/**
 * Run Lighthouse N times per viewport and report median for the key
 * performance metrics. Used to validate hero perf fixes with statistical
 * confidence (single Lighthouse runs vary by 20-50% on Windows).
 *
 * Usage:  node scripts/lh-multi.mjs <url> [runs]
 * Output: median LCP / FCP / TBT / TTI / SI / Score / Bytes per viewport.
 */
import { spawn } from 'node:child_process'
import { readFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const url = process.argv[2] ?? 'http://localhost:3004/nl'
const RUNS = Number(process.argv[3] ?? 5)
const OUT_DIR = resolve('.audit-reports/v4')
await mkdir(OUT_DIR, { recursive: true })

const FACTORS = [
  {
    name: 'mobile',
    args: ['--form-factor=mobile', '--throttling-method=devtools'],
  },
  {
    name: 'desktop',
    args: ['--form-factor=desktop', '--throttling-method=devtools', '--screenEmulation.disabled'],
  },
]

function runLighthouse(name, runIdx, args) {
  return new Promise((resolveRun, rejectRun) => {
    const outFile = `${OUT_DIR}/${name}-${runIdx}.json`
    const proc = spawn(
      'npx',
      [
        'lighthouse',
        url,
        '--output=json',
        `--output-path=${outFile}`,
        '--only-categories=performance',
        ...args,
        '--chrome-flags=--headless=new --no-sandbox',
        '--quiet',
      ],
      { shell: true }
    )
    let err = ''
    proc.stderr.on('data', (d) => (err += d.toString()))
    proc.on('close', (code) => {
      if (code !== 0) console.warn(`  ${name}-${runIdx} exit ${code}: ${err.slice(0, 200)}`)
      resolveRun(outFile)
    })
    proc.on('error', rejectRun)
  })
}

function median(nums) {
  const sorted = [...nums].filter((n) => Number.isFinite(n)).sort((a, b) => a - b)
  if (sorted.length === 0) return NaN
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

async function loadMetrics(file) {
  try {
    const text = await readFile(file, 'utf8')
    const r = JSON.parse(text)
    return {
      score: r.categories.performance.score === null ? NaN : r.categories.performance.score * 100,
      lcp: r.audits['largest-contentful-paint']?.numericValue,
      fcp: r.audits['first-contentful-paint']?.numericValue,
      tbt: r.audits['total-blocking-time']?.numericValue,
      tti: r.audits['interactive']?.numericValue,
      si: r.audits['speed-index']?.numericValue,
      bytes: r.audits['total-byte-weight']?.numericValue,
      mainthread: r.audits['mainthread-work-breakdown']?.numericValue,
    }
  } catch {
    return null
  }
}

function fmtMs(n) {
  if (!Number.isFinite(n)) return 'n/a'
  return n >= 1000 ? `${(n / 1000).toFixed(2)} s` : `${Math.round(n)} ms`
}

function fmtKB(n) {
  if (!Number.isFinite(n)) return 'n/a'
  return `${Math.round(n / 1024)} KiB`
}

for (const factor of FACTORS) {
  console.log(`\n=== ${factor.name.toUpperCase()} — running ${RUNS} iterations ===`)

  const results = []
  for (let i = 1; i <= RUNS; i++) {
    process.stdout.write(`  run ${i}/${RUNS}... `)
    const file = await runLighthouse(factor.name, i, factor.args)
    const metrics = await loadMetrics(file)
    if (metrics) {
      results.push(metrics)
      console.log(`score ${metrics.score?.toFixed(0)}, LCP ${fmtMs(metrics.lcp)}`)
    } else {
      console.log('FAILED to parse')
    }
  }

  if (results.length === 0) {
    console.log('  no results parsed')
    continue
  }

  const med = {
    score: median(results.map((r) => r.score)),
    lcp: median(results.map((r) => r.lcp)),
    fcp: median(results.map((r) => r.fcp)),
    tbt: median(results.map((r) => r.tbt)),
    tti: median(results.map((r) => r.tti)),
    si: median(results.map((r) => r.si)),
    bytes: median(results.map((r) => r.bytes)),
    mainthread: median(results.map((r) => r.mainthread)),
  }

  console.log(`\n  MEDIAN over ${results.length} runs:`)
  console.log(`    Score:      ${med.score?.toFixed(0)} / 100`)
  console.log(`    LCP:        ${fmtMs(med.lcp)}`)
  console.log(`    FCP:        ${fmtMs(med.fcp)}`)
  console.log(`    TBT:        ${fmtMs(med.tbt)}`)
  console.log(`    TTI:        ${fmtMs(med.tti)}`)
  console.log(`    SpeedIndex: ${fmtMs(med.si)}`)
  console.log(`    Bytes:      ${fmtKB(med.bytes)}`)
  console.log(`    Mainthread: ${fmtMs(med.mainthread)}`)
}
