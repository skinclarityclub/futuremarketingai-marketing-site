/**
 * Mobile-only Lighthouse runner.
 *
 * Replaces the previous CLI-based approach (which EBUSY'd on Windows from
 * a Chrome rimraf race) with a programmatic invocation that:
 *   1. Launches Chrome with a unique user-data-dir per run, owned by us.
 *   2. Waits for Chrome to fully kill + release SQLite file handles
 *      before removing the dir, with retries to absorb any residual lock.
 *   3. Writes report JSONs to .audit-reports/<OUT_TAG>/.
 *
 * Usage:  node scripts/lh-mobile-only.mjs <url> [runs] [outTag]
 * Output: per-run JSON + median LCP/FCP/TBT/TTI/SI/Score.
 */
import lighthouse from 'lighthouse'
import * as chromeLauncher from 'chrome-launcher'
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'

const url = process.argv[2] ?? 'http://localhost:3000/nl'
const RUNS = Number(process.argv[3] ?? 3)
const OUT_TAG = process.argv[4] ?? 'mobile-only'
const OUT_DIR = resolve('.audit-reports', OUT_TAG)
await mkdir(OUT_DIR, { recursive: true })

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function cleanupChromeProfile(dir) {
  // Chrome may still flush SQLite/Network state for ~500ms after kill.
  // mkdtemp gave us a unique path so a leftover from this run only affects
  // this run, but we still try to remove it to avoid disk bloat.
  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      await rm(dir, { recursive: true, force: true })
      return
    } catch (e) {
      if (attempt === 5) {
        console.warn(`  cleanup of ${dir} failed after 5 attempts: ${e.code || e.message}`)
        return
      }
      await sleep(400 * attempt)
    }
  }
}

async function runOne(idx) {
  const userDataDir = await mkdtemp(join(tmpdir(), `lh-clean-${idx}-`))
  const chrome = await chromeLauncher.launch({
    chromeFlags: [
      '--headless=new',
      '--no-sandbox',
      '--disable-gpu',
      `--user-data-dir=${userDataDir}`,
    ],
    // Tell chrome-launcher NOT to manage its own temp dir — we own this.
    userDataDir: false,
  })

  let metrics = null
  try {
    const result = await lighthouse(url, {
      port: chrome.port,
      output: 'json',
      onlyCategories: ['performance'],
      formFactor: 'mobile',
      throttlingMethod: 'devtools',
      logLevel: 'error',
    })
    const r = result.lhr
    await writeFile(join(OUT_DIR, `mobile-${idx}.json`), result.report, 'utf8')
    metrics = {
      score: r.categories.performance.score * 100,
      lcp: r.audits['largest-contentful-paint']?.numericValue,
      fcp: r.audits['first-contentful-paint']?.numericValue,
      tbt: r.audits['total-blocking-time']?.numericValue,
      tti: r.audits['interactive']?.numericValue,
      si: r.audits['speed-index']?.numericValue,
    }
  } finally {
    try { await chrome.kill() } catch { /* already dead */ }
    // Critical: wait for SQLite handles to release before rm.
    await sleep(500)
    await cleanupChromeProfile(userDataDir)
  }
  return metrics
}

const median = (xs) => {
  const s = [...xs].filter(Number.isFinite).sort((a, b) => a - b)
  if (!s.length) return NaN
  const m = Math.floor(s.length / 2)
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2
}

const ms = (n) =>
  Number.isFinite(n) ? (n >= 1000 ? `${(n / 1000).toFixed(2)} s` : `${Math.round(n)} ms`) : 'n/a'

console.log(`Running ${RUNS}x mobile against ${url}`)
console.log(`Output: ${OUT_DIR}\n`)

const results = []
for (let i = 1; i <= RUNS; i++) {
  process.stdout.write(`  run ${i}/${RUNS}... `)
  try {
    const m = await runOne(i)
    if (m) {
      results.push(m)
      console.log(`score ${m.score?.toFixed(0)}, LCP ${ms(m.lcp)}, TBT ${ms(m.tbt)}`)
    } else {
      console.log('FAILED (no metrics)')
    }
  } catch (e) {
    console.log(`FAILED: ${e.message?.slice(0, 100)}`)
  }
}

if (results.length) {
  console.log(`\nMEDIAN over ${results.length} runs:`)
  console.log(`  Score: ${median(results.map((r) => r.score)).toFixed(0)} / 100`)
  console.log(`  LCP:   ${ms(median(results.map((r) => r.lcp)))}`)
  console.log(`  FCP:   ${ms(median(results.map((r) => r.fcp)))}`)
  console.log(`  TBT:   ${ms(median(results.map((r) => r.tbt)))}`)
  console.log(`  TTI:   ${ms(median(results.map((r) => r.tti)))}`)
  console.log(`  SI:    ${ms(median(results.map((r) => r.si)))}`)
  console.log(`\n  ALL LCP values: ${results.map((r) => ms(r.lcp)).join(', ')}`)
} else {
  console.log('\nNo successful runs.')
}
