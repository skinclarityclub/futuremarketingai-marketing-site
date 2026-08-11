import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'nl', 'es'],
  // Dutch, not English. 14 of 15 kennisbank articles are NL, llms.txt calls
  // Dutch the source of truth, and not-found.tsx renders lang="nl" — but
  // x-default pointed at /en, so Dutch searchers were sent to the weakest
  // variant of every page. Measured 2026-08-11: of 30 EN URLs, 22 were unknown
  // to Google entirely. There is no ranking equity here to protect, which makes
  // this the cheapest moment this switch will ever be.
  defaultLocale: 'nl',
  localePrefix: 'always',
})

/**
 * Locales we offer to search engines. A locale outside this set still renders —
 * visitors and existing links keep working — but is marked noindex and left out
 * of both the sitemap and the hreflang map.
 *
 * `es` is excluded: zero kennisbank articles, the thinnest pages on the site
 * (/es/apply is 30 visible words), and no Spanish query in 67 days of Search
 * Console data. Google's own guidance is to keep only translations that meet
 * your quality bar indexable; an unfinished one adds to the weak-URL footprint
 * without adding reach. Dropping it takes the indexable surface from 102 URLs
 * to 68 — and shrinking that surface is the single highest-impact lever we have.
 *
 * Do NOT also disallow these paths in robots.txt: Google has to fetch a page to
 * see its noindex.
 */
export const INDEXABLE_LOCALES: readonly string[] = ['nl', 'en']

export function isIndexableLocale(locale: string): boolean {
  return INDEXABLE_LOCALES.includes(locale)
}
