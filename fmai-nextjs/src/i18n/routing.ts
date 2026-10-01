import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  // `es` left on 2026-10-02 (next.config.ts redirects /es to /en). Its strings
  // in the chatbot and API routes are dead code now, kept out of this change.
  locales: ['en', 'nl'],
  // Dutch, not English. 14 of 15 kennisbank articles are NL, llms.txt calls
  // Dutch the source of truth, and not-found.tsx renders lang="nl" — but
  // x-default pointed at /en, so Dutch searchers were sent to the weakest
  // variant of every page. Measured 2026-08-11: of 30 EN URLs, 22 were unknown
  // to Google entirely. There is no ranking equity here to protect, which makes
  // this the cheapest moment this switch will ever be.
  defaultLocale: 'nl',
  localePrefix: 'always',
  // next-intl otherwise emits an hreflang `Link` HTTP header built from
  // `locales` above — all three, including the noindex `es` — plus an x-default
  // pointing at the bare domain. That contradicts the on-page hreflang, which
  // generatePageMetadata builds from INDEXABLE_LOCALES (nl + en, x-default →
  // /nl). Two conflicting hreflang maps for the same URL is worse than one:
  // Google picks whichever it likes and we lose control of the choice.
  // Measured live 2026-09-01 on /nl, /en, /nl/pricing and /es.
  alternateLinks: false,
})

/**
 * Locales we offer to search engines. A locale outside this set still renders —
 * visitors and existing links keep working — but is marked noindex and left out
 * of both the sitemap and the hreflang map.
 *
 * `es` was excluded here in September and removed as a locale on 2026-10-02,
 * for the same reasons: zero kennisbank articles, the thinnest pages on the site
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
