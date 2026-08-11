#!/usr/bin/env node
/**
 * check-sitemap-lastmod: fails when a sitemap path has no real <lastmod> date.
 *
 * Why: PAGE_DATES was missing six of the twenty-nine paths in sitemap.ts, and
 * the fallback was `new Date()`. Those six therefore announced themselves as
 * modified on every deploy — eighteen URLs across three locales claiming to be
 * fresh while their content had not changed since spring. Google's own answer
 * to a sitemap that lies about lastmod is to stop trusting the field for the
 * whole site, and lastmod is the only lever we have to pull a re-crawl. On
 * 2026-08-11 Google had not re-read the sitemap in 52 days.
 *
 * Two failure modes are guarded:
 *   1. a path in `pages` with no PAGE_DATES entry
 *   2. sitemap.ts reintroducing a build-time date as the fallback
 *
 * Run: npm run check:sitemap-lastmod
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const ROOT = process.cwd()
const SITEMAP = join(ROOT, 'src', 'app', 'sitemap.ts')
const SEO_CONFIG = join(ROOT, 'src', 'lib', 'seo-config.ts')

const sitemapSrc = readFileSync(SITEMAP, 'utf-8')
const configSrc = readFileSync(SEO_CONFIG, 'utf-8')

// `pages` entries look like: { path: '/skills/clyde', changeFrequency: ... }
const paths = [...sitemapSrc.matchAll(/\{\s*path:\s*'([^']+)'/g)].map((m) => m[1])
if (paths.length === 0) {
  console.error('FAIL: no `path:` entries found in sitemap.ts — did the shape change?')
  process.exit(1)
}

// PAGE_DATES keys look like: '/skills/clyde': '2026-04-20',
const datesBlock = /export const PAGE_DATES[^{]*\{([\s\S]*?)\n\}/.exec(configSrc)
if (!datesBlock) {
  console.error('FAIL: could not locate the PAGE_DATES object in seo-config.ts')
  process.exit(1)
}
const dated = new Set(
  [...datesBlock[1].matchAll(/'([^']+)':\s*'(\d{4}-\d{2}-\d{2})'/g)].map((m) => m[1]),
)

const missing = paths.filter((p) => !dated.has(p))

// The fallback must be a constant, never a build-time date.
const buildTimeFallback = /lastModified[^\n]*new Date\(\s*\)/.test(sitemapSrc)

let failed = false

if (missing.length) {
  failed = true
  console.error(
    `FAIL: ${missing.length} of ${paths.length} sitemap paths are missing from ` +
      'PAGE_DATES, so each falls back to FALLBACK_PAGE_DATE instead of a real date:',
  )
  for (const p of missing) console.error(`  ${p}`)
  console.error(
    "\nFix: add the path to PAGE_DATES in src/lib/seo-config.ts, using the page's\n" +
      "own last content change — `git log -1 --format=%ad --date=short -- <page.tsx>`.",
  )
}

if (buildTimeFallback) {
  failed = true
  console.error(
    '\nFAIL: sitemap.ts computes a lastModified from `new Date()`.\n' +
      'That marks pages fresh at build time whether or not they changed.\n' +
      'Use FALLBACK_PAGE_DATE from seo-config.ts instead.',
  )
}

if (failed) process.exit(1)

console.log(`OK: all ${paths.length} sitemap paths have a real lastmod date, no build-time fallback.`)
