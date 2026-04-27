export const SITE_URL = 'https://future-marketing.ai'
export const SITE_NAME = 'Future Marketing AI'
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
export const LINKEDIN_DALEY_URL = 'https://www.linkedin.com/in/daleymaat' // TODO: confirm slug
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

export const PAGE_DATES: Record<string, string> = {
  '/': '2026-04-20',
  '/memory': '2026-04-20',
  '/apply': '2026-04-20',
  '/case-studies/skinclarity-club': '2026-04-20',
  '/skills/social-media': '2026-04-20',
  '/skills/blog-factory': '2026-04-20',
  '/skills/ad-creator': '2026-04-20',
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
}
