#!/usr/bin/env node
/**
 * check-indexability: every localized page must have a decided robots policy.
 *
 * INDEXABLE_LOCALES (src/i18n/routing.ts) marks `es` non-indexable, and
 * generatePageMetadata turns that into `robots: noindex, follow`. A page that
 * builds its own metadata object skips that helper and stays indexable in every
 * locale, es included, with nothing in the diff to show for it.
 *
 * Scope, stated precisely because a guard that is believed to cover more than it
 * does is worse than no guard: this fails only on a page that uses NEITHER the
 * helper NOR an explicit `robots:` key. Three routes legitimately bypass the
 * helper today and each sets robots itself; this catches a fourth that forgets.
 *
 * It deliberately does NOT judge whether a given page *should* be noindex —
 * /newsletter/confirm went through the helper and was still wrongly indexable
 * for months, and no static check would have flagged that. Deciding a page has
 * no search value stays a human call.
 *
 * Run: npm run check:indexability
 */

import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'

const ROOT = process.cwd()
const APP_DIR = join(ROOT, 'src', 'app')

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry)
    if (statSync(full).isDirectory()) walk(full, acc)
    else if (entry === 'page.tsx') acc.push(full)
  }
  return acc
}

const localized = walk(APP_DIR).filter((f) => relative(ROOT, f).includes('[locale]'))
if (localized.length === 0) {
  console.error('FAIL: found no [locale] page.tsx files — did the app structure change?')
  process.exit(1)
}

const offenders = []
for (const file of localized) {
  const src = readFileSync(file, 'utf-8')
  const usesHelper = /generatePageMetadata\s*\(/.test(src)
  const setsRobots = /robots:\s*\{/.test(src)
  if (!usesHelper && !setsRobots) offenders.push(relative(ROOT, file).replace(/\\/g, '/'))
}

if (offenders.length) {
  console.error(
    `FAIL: ${offenders.length} localized page(s) neither use generatePageMetadata ` +
      'nor set a robots policy, so they stay indexable in every locale including es:',
  )
  for (const o of offenders) console.error(`  ${o}`)
  console.error(
    '\nFix: route the page through generatePageMetadata (src/lib/metadata.ts), or\n' +
      'set robots explicitly and spread isIndexableLocale(locale) like\n' +
      'src/app/[locale]/(blog)/kennisbank/[slug]/page.tsx does.',
  )
  process.exit(1)
}

console.log(`OK: all ${localized.length} localized pages have a decided robots policy.`)
