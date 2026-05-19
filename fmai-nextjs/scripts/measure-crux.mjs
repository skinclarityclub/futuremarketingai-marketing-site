#!/usr/bin/env node
/**
 * measure-crux.mjs — Phase 17-D D2
 *
 * Pulls CrUX + PSI field data for the top 10 routes across NL/EN/ES and
 * writes a dated JSON snapshot. Idempotent + safe to schedule weekly.
 *
 * Usage:
 *   node scripts/measure-crux.mjs              # prod URL, all routes
 *   node scripts/measure-crux.mjs --route /pricing  # one route
 *   AUDIT_BASE_URL=http://localhost:3000 node scripts/measure-crux.mjs
 *
 * Requires env var GOOGLE_PSI_API_KEY. Set up:
 *   1. Create GCP project `fmai-perf-tracking` at console.cloud.google.com.
 *   2. Enable `pagespeedonline.googleapis.com` AND
 *      `chromeuxreport.googleapis.com` under APIs & Services > Library.
 *   3. Create an API key, restrict it to those two APIs only.
 *   4. Store as `GOOGLE_PSI_API_KEY` in ~/.claude/.env (or shell env).
 *
 * Output:
 *   test-results/audit-v2/crux/weekly-YYYY-MM-DD.json
 *
 * Schema (per origin/route):
 *   { url, formFactor, source: 'crux' | 'psi', metrics: { LCP, INP, CLS, FCP, TTFB } }
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const repoRoot = join(__dirname, '..')

const LOCALES = ['nl', 'en', 'es']
const ROUTES = [
  '/', // home
  '/pricing',
  '/apply',
  '/contact',
  '/about',
  '/how-it-works',
  '/founding-member',
  '/memory',
  '/skills',
  '/case-studies/skinclarity-club',
]
const FORM_FACTORS = ['PHONE', 'DESKTOP']

const BASE_URL = process.env.AUDIT_BASE_URL ?? 'https://future-marketing.ai'
const TODAY = new Date().toISOString().slice(0, 10)
const OUT_DIR = join(repoRoot, 'test-results/audit-v2/crux')
const OUT_FILE = join(OUT_DIR, `weekly-${TODAY}.json`)

const args = process.argv.slice(2)
const routeArgIndex = args.indexOf('--route')
const routesToRun =
  routeArgIndex >= 0 && args[routeArgIndex + 1]
    ? [args[routeArgIndex + 1]]
    : ROUTES

async function loadApiKey() {
  if (process.env.GOOGLE_PSI_API_KEY) return process.env.GOOGLE_PSI_API_KEY

  const envPath = join(process.env.HOME ?? process.env.USERPROFILE ?? '', '.claude/.env')
  if (existsSync(envPath)) {
    const raw = await readFile(envPath, 'utf-8')
    const match = raw.match(/^GOOGLE_PSI_API_KEY\s*=\s*(.+)$/m)
    if (match) return match[1].trim()
  }
  return null
}

async function fetchCrux(url, formFactor, apiKey) {
  const res = await fetch(
    `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, formFactor }),
    },
  )
  if (!res.ok) return null
  const data = await res.json()
  const metrics = data?.record?.metrics ?? {}
  return {
    source: 'crux',
    url,
    formFactor,
    metrics: {
      LCP: metrics.largest_contentful_paint?.percentiles?.p75 ?? null,
      INP: metrics.interaction_to_next_paint?.percentiles?.p75 ?? null,
      CLS: metrics.cumulative_layout_shift?.percentiles?.p75 ?? null,
      FCP: metrics.first_contentful_paint?.percentiles?.p75 ?? null,
      TTFB: metrics.experimental_time_to_first_byte?.percentiles?.p75 ?? null,
    },
  }
}

async function fetchPsi(url, formFactor, apiKey) {
  const strategy = formFactor === 'PHONE' ? 'mobile' : 'desktop'
  const qs = new URLSearchParams({ url, key: apiKey, strategy })
  const res = await fetch(
    `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${qs.toString()}`,
  )
  if (!res.ok) return null
  const data = await res.json()
  const audits = data?.lighthouseResult?.audits ?? {}
  const get = (id) => audits[id]?.numericValue ?? null
  return {
    source: 'psi',
    url,
    formFactor,
    metrics: {
      LCP: get('largest-contentful-paint'),
      INP: get('interaction-to-next-paint'),
      CLS: get('cumulative-layout-shift'),
      FCP: get('first-contentful-paint'),
      TTFB: get('server-response-time'),
    },
  }
}

async function main() {
  const apiKey = await loadApiKey()
  if (!apiKey) {
    console.error(
      '[measure-crux] GOOGLE_PSI_API_KEY not set. See file header for setup instructions.',
    )
    process.exit(2)
  }

  await mkdir(OUT_DIR, { recursive: true })

  const results = []

  for (const route of routesToRun) {
    for (const locale of LOCALES) {
      const url = `${BASE_URL}/${locale}${route === '/' ? '' : route}`
      for (const formFactor of FORM_FACTORS) {
        const crux = await fetchCrux(url, formFactor, apiKey)
        if (crux) {
          results.push(crux)
          continue
        }
        // CrUX has insufficient data for low-traffic URLs; fall back to PSI
        // lab data so the weekly snapshot is never empty for a new route.
        const psi = await fetchPsi(url, formFactor, apiKey)
        if (psi) results.push(psi)
      }
    }
  }

  await writeFile(
    OUT_FILE,
    JSON.stringify({ capturedAt: new Date().toISOString(), baseUrl: BASE_URL, results }, null, 2),
  )
  console.log(`[measure-crux] wrote ${results.length} entries → ${OUT_FILE}`)
}

main().catch((err) => {
  console.error('[measure-crux] failed:', err)
  process.exit(1)
})
