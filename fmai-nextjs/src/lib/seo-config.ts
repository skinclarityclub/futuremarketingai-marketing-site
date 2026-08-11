export const SITE_URL = 'https://future-marketing.ai'
// Canonical brand name = one word, matches the domain + <title>. Google reads the
// spaced "Future Marketing AI" as a generic term (collides with an existing agency),
// so we make the one-word string primary and register the variants as alternateName
// to bind them to a single entity in the Knowledge Graph.
export const SITE_NAME = 'FutureMarketingAI'
export const SITE_ALTERNATE_NAME = ['Future Marketing AI', 'Future Marketing AI - Clyde']
export const ORG_EMAIL = 'hello@future-marketing.ai'
export const LINKEDIN_URL = 'https://www.linkedin.com/company/futuremarketingai'

export const ENTITY_DESCRIPTION =
  'Future Marketing AI provides an AI Marketing Employee for marketing agencies: a persistent AI partner named Clyde with 12 skills (social media, blog factory, ad creator, voice agent, lead qualifier, email management, reporting, SEO/GEO, research, ManyChat DM, reel builder, and orchestration) plus long-term client memory.'

// --- Entity Identity (added Phase 14-01) ---
// All values below trace to .planning/phases/DECISIONS-2026-04-24.md Phase 14 section.

// Stable @id fragments — used as cross-references in JSON-LD graph
// Pattern: ${SITE_URL}/${path}#${entity-fragment}
export const ORG_ID = `${SITE_URL}/#org`
export const WEBSITE_ID = `${SITE_URL}/#website`
export const DALEY_PERSON_ID = `${SITE_URL}/about/#daley`
export const SINDY_PERSON_ID = `${SITE_URL}/case-studies/skinclarity-club/#sindy`

export const pageWebPageId = (locale: string, path: string) =>
  `${SITE_URL}/${locale}${path === '/' ? '' : path}#webpage`

export const skillServiceId = (slug: string) => `${SITE_URL}/skills/${slug}/#service`

// External profiles — null-defaults filtered out by buildSameAs() in OrganizationJsonLd.
// Per DECISIONS Q3: Wikidata = proceed. Set WIKIDATA_URL once QID is confirmed live (>48h survival).
export const WIKIDATA_URL: string | null = null // TODO(phase-14-01): swap to https://www.wikidata.org/wiki/{QID} after Task 1 contingency check passes
export const WIKIDATA_DALEY_URL: string | null = null // TODO(phase-14-01): set if Daley Person item created in Task 1

// Per DECISIONS Q5: only add Twitter if Daley already has an active @FutureMarketAI account.
// Default = null. Do NOT create an account purely for schema purposes — abandoned profiles hurt E-E-A-T.
export const TWITTER_URL: string | null = null

// Per DECISIONS Q4: Crunchbase is intentionally skipped (pay-to-play, zero organic value for solo-founder niche).
// Do NOT export a Crunchbase profile URL constant. Do NOT include in buildSameAs().

// Personal profiles — confirm slugs in DECISIONS doc before commit.
export const LINKEDIN_DALEY_URL = 'https://www.linkedin.com/in/daley-van-diest' // confirmed 2026-06-16
export const LINKEDIN_SINDY_URL = 'https://www.linkedin.com/in/sindy-skinclarity' // TODO: confirm slug with Sindy

// Per DECISIONS Q2: KvK = added once Daley confirms registration via kvk.nl/zoeken. null until then.
export const KVK_URL: string | null = null

// YouTube + Instagram — null unless Daley already maintains an active channel/profile.
// Empty profiles hurt E-E-A-T (same logic as Twitter per DECISIONS Q5).
export const YOUTUBE_URL: string | null = null
export const INSTAGRAM_URL: string | null = null

// Topical authority (knowsAbout) — expand from 4 to 10 per research doc sec 2
export const ORG_KNOWS_ABOUT = [
  'AI Marketing Automation',
  'Generative AI',
  'LLM Orchestration',
  'Brand Voice Modeling',
  'Multi-Brand Content Operations',
  'n8n workflow automation',
  'EU AI Act Compliance',
  'AVG / GDPR',
  'Conversational AI for B2B',
  'Marketing Agency Tooling',
]

// Per DECISIONS Q1: 2024 (FMai existed as agency entity before AaaS pivot).
export const ORG_FOUNDING_DATE = '2024-01-01'

/**
 * Fallback <lastmod> for a path missing from PAGE_DATES.
 *
 * Deliberately old. The previous fallback was `new Date()`, so any forgotten
 * path announced itself as freshly modified on EVERY deploy — six paths were
 * doing exactly that across three locales. A sitemap that cries fresh without
 * changing teaches Google to distrust its lastmod site-wide, which is the
 * opposite of what the field is for. Under-claiming is harmless; over-claiming
 * costs us the one signal we have to pull a crawl.
 */
export const FALLBACK_PAGE_DATE = '2026-03-18'

export const PAGE_DATES: Record<string, string> = {
  // Brand-entity fix (one-word SITE_NAME + visible hero kicker) shipped today.
  '/': '2026-08-11',
  '/memory': '2026-04-20',
  // The "what happens after you apply" section moved into the server tree today.
  '/apply': '2026-08-11',
  '/case-studies/skinclarity-club': '2026-04-20',
  '/skills/social-media': '2026-04-20',
  '/skills/blog-factory': '2026-04-20',
  '/skills/ad-manager': '2026-06-15',
  '/skills/reel-builder': '2026-04-20',
  '/skills/voice-agent': '2026-04-20',
  '/skills/lead-qualifier': '2026-04-20',
  '/skills/email-management': '2026-04-20',
  '/skills/manychat': '2026-04-20',
  '/skills/reporting': '2026-04-20',
  '/skills/seo-geo': '2026-04-20',
  '/skills/research': '2026-04-20',
  '/skills/clyde': '2026-04-20',
  '/founding-member': '2026-04-20',
  '/pricing': '2026-04-20',
  '/about': '2026-03-18',
  '/contact': '2026-03-18',
  '/how-it-works': '2026-03-18',
  '/legal': '2026-04-24',
  '/kennisbank': '2026-06-02',
  // Dates below come from `git log -1` on each page's own source file, not
  // from a guess — these six were missing and hit the old `new Date()` path.
  '/skills': '2026-06-15',
  '/assessment': '2026-05-28',
  '/roadmap': '2026-06-15',
  '/legal/privacy': '2026-04-27',
  '/legal/terms': '2026-04-27',
  '/legal/cookies': '2026-04-27',
}
