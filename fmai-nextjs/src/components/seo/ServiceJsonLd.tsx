/**
 * Service JSON-LD emitter (rewritten Phase 14-02).
 *
 * Wired by SkillPageTemplate.tsx for all 12 skill pages. The @id pattern
 * cross-references the Organization's hasOfferCatalog (built in 14-01),
 * keeping the entity graph coherent: Org -> hasOfferCatalog -> Service @id
 * matches the Service @id rendered here.
 *
 * Refs:
 * - https://schema.org/Service
 * - https://schema.org/Offer
 * - docs/audits/2026-04-24-full-audit/04-seo-technical.md fix #4 (dead component, 12 wasted rich-result opportunities)
 * - docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md Top-15 #3
 */
import type { WithContext, Service } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, PAGE_DATES, ORG_ID, skillServiceId } from '@/lib/seo-config'

interface ServiceOffer {
  priceCurrency: string
  price: string
  /** Tier name including price formatting, e.g. "Growth 2497 EUR" */
  name: string
  /** Absolute URL to the pricing tier or apply page */
  url: string
}

interface ServiceJsonLdProps {
  name: string
  description: string
  serviceType: string
  /** Slug used to build @id and URL, e.g. 'social-media' */
  slug: string
  locale: string
  /** Optional pricing offers per tier */
  offers?: ServiceOffer[]
}

type ServiceWithExtras = WithContext<Service> & {
  dateModified?: string
  '@id'?: string
  availableLanguage?: string[]
}

export function ServiceJsonLd({
  name,
  description,
  serviceType,
  slug,
  locale,
  offers,
}: ServiceJsonLdProps) {
  const path = `/skills/${slug}`
  const url = `${SITE_URL}/${locale}${path}`
  const dateModified = PAGE_DATES[path] ?? PAGE_DATES['/']

  const data: ServiceWithExtras = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': skillServiceId(slug),
    name,
    description,
    serviceType,
    url,
    provider: { '@id': ORG_ID },
    areaServed: ['NL', 'EU', 'Worldwide'],
    availableLanguage: ['en', 'nl', 'es'],
    dateModified,
    ...(offers && offers.length > 0
      ? {
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${name}, tier availability`,
            itemListElement: offers.map((o) => ({
              '@type': 'Offer',
              priceCurrency: o.priceCurrency,
              price: o.price,
              name: o.name,
              url: o.url,
              seller: { '@id': ORG_ID },
            })),
          },
        }
      : {}),
  }

  return <JsonLd data={data} />
}
