/**
 * Organization JSON-LD emitter (rewritten Phase 14-01).
 *
 * - Emits stable @id (ORG_ID) so other entities can reference us via @id graph links.
 * - founder is now a @id reference to DALEY_PERSON_ID — the full Person entity is
 *   provided by PersonJsonLd (rendered on /about by Wave-2 plan 14-02).
 * - logo is now an ImageObject with width/height (rich-results requirement).
 * - hasOfferCatalog lists the 12 v10 skills imported from skills-data.ts; each
 *   offer references the skill page's Service @id so SkillPageTemplate's
 *   ServiceJsonLd (14-02) is the same entity.
 * - knowsAbout expanded from 4 to 10 topics per RESEARCH.md sec 2.
 * - sameAs filters null-valued external URLs (LinkedIn always; Wikidata/Twitter/KvK
 *   add when their constants flip from null).
 * - Crunchbase intentionally absent per DECISIONS-2026-04-24.md Q4.
 *
 * Refs:
 * - https://schema.org/Organization
 * - .planning/phases/DECISIONS-2026-04-24.md Q1-Q5
 * - docs/audits/2026-04-24-full-audit/04-seo-technical.md fixes #3 + #8
 * - docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md Top-15 #2
 * - docs/research-schema-markup-structured-data-seo-geo.md sec 1 + 2 + 6
 */
import { JsonLd } from './JsonLd'
import {
  SITE_URL,
  SITE_NAME,
  ORG_EMAIL,
  ORG_ID,
  DALEY_PERSON_ID,
  LINKEDIN_URL,
  WIKIDATA_URL,
  TWITTER_URL,
  KVK_URL,
  YOUTUBE_URL,
  INSTAGRAM_URL,
  ORG_KNOWS_ABOUT,
  ORG_FOUNDING_DATE,
  ENTITY_DESCRIPTION,
} from '@/lib/seo-config'
import { SKILLS_DATA } from '@/lib/skills-data'

// Filter null-valued external profile URLs before emitting sameAs.
// Crunchbase is intentionally absent per DECISIONS-2026-04-24.md Q4.
// Twitter/YouTube/Instagram default to null per DECISIONS Q5 (no abandoned profiles for schema).
function buildSameAs(): string[] {
  return [LINKEDIN_URL, WIKIDATA_URL, TWITTER_URL, KVK_URL, YOUTUBE_URL, INSTAGRAM_URL].filter(
    (u): u is string => typeof u === 'string' && u.length > 0,
  )
}

// hasOfferCatalog — 12 skills as Services, referenced by @id so SkillPage ServiceJsonLd (14-02) agrees.
function buildOfferCatalog() {
  return {
    '@type': 'OfferCatalog',
    name: 'Clyde AI Marketing Skills',
    itemListElement: SKILLS_DATA.map((skill) => ({
      '@type': 'Offer',
      itemOffered: {
        '@type': 'Service',
        '@id': `${SITE_URL}/skills/${skill.slug}/#service`,
        name: skill.name,
        description: skill.shortDescription,
      },
      seller: { '@id': ORG_ID },
    })),
  }
}

export function OrganizationJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'ProfessionalService'],
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/og-image.png`,
      width: 1200,
      height: 630,
    },
    email: ORG_EMAIL,
    description: ENTITY_DESCRIPTION,
    foundingDate: ORG_FOUNDING_DATE,
    founder: {
      '@id': DALEY_PERSON_ID,
    },
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NL',
      addressRegion: 'Netherlands',
    },
    areaServed: ['NL', 'EU', 'Worldwide'],
    knowsAbout: ORG_KNOWS_ABOUT,
    knowsLanguage: ['en', 'nl', 'es'],
    hasOfferCatalog: buildOfferCatalog(),
    contactPoint: {
      '@type': 'ContactPoint',
      email: ORG_EMAIL,
      contactType: 'sales',
      availableLanguage: ['English', 'Dutch', 'Spanish'],
    },
    sameAs: buildSameAs(),
    priceRange: '€€€',
  }

  return <JsonLd data={data} />
}
