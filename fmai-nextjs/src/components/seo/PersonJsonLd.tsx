/**
 * Reusable Person JSON-LD emitter (created Phase 14-01).
 *
 * Used for:
 * - Daley on /about (rendered by 14-02 Wave-2 plan)
 * - Sindy on /case-studies/skinclarity-club (rendered by 14-02)
 * - Future blog post authors (each gets their own Person @id)
 *
 * Design:
 * - Stable @id parameter required — caller passes DALEY_PERSON_ID, SINDY_PERSON_ID,
 *   or a custom URL fragment so the Person becomes a graph-linkable entity that
 *   Article/Organization schemas can reference via {@id}.
 * - sameAs array filters null/undefined entries — same null-default pattern as
 *   OrganizationJsonLd.buildSameAs(). Caller can pass Wikidata-may-be-null mixed
 *   with always-present LinkedIn URLs without preprocessing.
 * - worksFor defaults to ORG_ID (our Organization). Override only when emitting a
 *   Person who works for a different Organization (e.g. a partner agency).
 * - Optional knowsAbout (5-10 items) and image strengthen E-E-A-T per audit-05.
 *
 * Refs:
 * - https://schema.org/Person
 * - docs/research-schema-markup-structured-data-seo-geo.md sec 1 Tier 1 (Person)
 * - docs/audits/2026-04-24-full-audit/04-seo-technical.md fix #4
 * - docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md Top-15 #9
 *   (E-E-A-T +30.64% citation correlation per Semrush Jan 2026)
 */
import type { WithContext, Person } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, ORG_ID } from '@/lib/seo-config'

interface PersonJsonLdProps {
  /** Stable @id for this person — e.g. DALEY_PERSON_ID */
  id: string
  /** Display name — e.g. "Daley Maat" */
  name: string
  /** Role/title — e.g. "Founder & CEO of FutureMarketingAI" */
  jobTitle: string
  /** Short bio — 1-2 sentences, self-contained, quotable for LLMs */
  description: string
  /** External profiles — LinkedIn, X, Wikidata (if notable), etc. Falsy/null entries are filtered. */
  sameAs?: Array<string | null | undefined>
  /** Optional knowsAbout topics for E-E-A-T. 5-10 items. */
  knowsAbout?: string[]
  /** Optional image URL (absolute). 1200x630 recommended. */
  image?: string
  /** Optional worksFor override. Defaults to ORG_ID (our Organization). */
  worksForId?: string
}

export function PersonJsonLd({
  id,
  name,
  jobTitle,
  description,
  sameAs = [],
  knowsAbout,
  image,
  worksForId = ORG_ID,
}: PersonJsonLdProps) {
  const filteredSameAs = sameAs.filter(
    (u): u is string => typeof u === 'string' && u.length > 0,
  )

  const data: WithContext<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': id,
    name,
    jobTitle,
    description,
    worksFor: { '@id': worksForId },
    ...(filteredSameAs.length > 0 ? { sameAs: filteredSameAs } : {}),
    ...(knowsAbout && knowsAbout.length > 0 ? { knowsAbout } : {}),
    ...(image ? { image } : {}),
    ...(SITE_URL ? { url: SITE_URL } : {}),
  }

  return <JsonLd data={data} />
}
