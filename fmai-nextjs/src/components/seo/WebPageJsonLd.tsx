/**
 * WebPage JSON-LD emitter.
 *
 * Phase 14-02 additions:
 * - @id (`${url}#webpage`) for cross-graph references from Article and Service @ids
 * - isPartOf -> WebSite @id (#website) — graph coherence with WebSiteJsonLd
 * - Optional speakable selectors — Google Speakable schema (pending class on schema.org)
 *
 * Refs:
 * - https://schema.org/WebPage
 * - https://schema.org/SpeakableSpecification (pending — typed via &)
 * - https://developers.google.com/search/docs/appearance/structured-data/speakable
 * - docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md Top-15 #11
 */
import type { WithContext, WebPage } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME, PAGE_DATES, WEBSITE_ID, pageWebPageId } from '@/lib/seo-config'

interface WebPageJsonLdProps {
  name: string
  description: string
  path: string
  locale: string
  /**
   * CSS selectors pointing at the quotable paragraphs — tells AI/voice assistants
   * which blocks to prioritize for snippet/citation extraction. Optional.
   */
  speakableSelectors?: string[]
}

type WebPageWithExtras = WithContext<WebPage> & {
  '@id'?: string
  speakable?: {
    '@type': 'SpeakableSpecification'
    cssSelector: string[]
  }
}

export function WebPageJsonLd({
  name,
  description,
  path,
  locale,
  speakableSelectors,
}: WebPageJsonLdProps) {
  const url = `${SITE_URL}/${locale}${path === '/' ? '' : path}`
  const dateModified = PAGE_DATES[path] || PAGE_DATES['/']

  const data: WebPageWithExtras = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': pageWebPageId(locale, path),
    name,
    description,
    url,
    isPartOf: {
      '@id': WEBSITE_ID,
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: locale,
    dateModified,
    ...(speakableSelectors && speakableSelectors.length > 0
      ? {
          speakable: {
            '@type': 'SpeakableSpecification',
            cssSelector: speakableSelectors,
          },
        }
      : {}),
  }

  return <JsonLd data={data} />
}
