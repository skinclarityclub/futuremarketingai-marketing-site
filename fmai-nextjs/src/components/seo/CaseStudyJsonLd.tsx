import { JsonLd } from './JsonLd'
import { SITE_URL, ORG_ID } from '@/lib/seo-config'

interface CaseStudyJsonLdProps {
  /** Canonical path of the case study (e.g. "/case-studies/skinclarity-club"). */
  path: string
  locale: string
  headline: string
  description: string
  /** Author Person @id (e.g. SINDY_PERSON_ID for the SKC case). */
  authorId: string
  /** Subject Organization @id (the client being profiled). */
  aboutOrgId: string
  /** Service @id powering the case (links outcomes back to the AaaS service). */
  serviceId: string
  /** Publication date (ISO 8601). */
  datePublished: string
  /** Last edit date (ISO 8601); defaults to datePublished. */
  dateModified?: string
  /** Optional hero/social image absolute or root-relative URL. */
  image?: string
  /** Outcomes worth annotating as Claim/Statement entries (max 6). */
  claims?: readonly { name: string; value: string }[]
}

/**
 * Schema.org Article + AnalysisNewsArticle hybrid for case studies. Connects
 * the article to the client Organization (about), the AaaS Service (mentions),
 * the author Person (Sindy), and the publisher Organization (FMai). Outcome
 * metrics get serialized as `Claim` entries so they surface in rich results.
 */
export function CaseStudyJsonLd({
  path,
  locale,
  headline,
  description,
  authorId,
  aboutOrgId,
  serviceId,
  datePublished,
  dateModified,
  image,
  claims,
}: CaseStudyJsonLdProps) {
  const url = `${SITE_URL}${path}`
  const absoluteImage = image
    ? image.startsWith('http')
      ? image
      : `${SITE_URL}${image}`
    : undefined

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Article',
        '@id': `${url}#case-study`,
        url,
        inLanguage: locale,
        headline,
        description,
        author: { '@id': authorId },
        publisher: { '@id': ORG_ID },
        about: { '@id': aboutOrgId },
        mentions: [{ '@id': serviceId }],
        datePublished,
        dateModified: dateModified ?? datePublished,
        ...(absoluteImage ? { image: absoluteImage } : {}),
        ...(claims && claims.length > 0
          ? {
              mainEntity: claims.map((claim, idx) => ({
                '@type': 'Claim',
                '@id': `${url}#claim-${idx + 1}`,
                name: claim.name,
                claimReviewed: claim.value,
              })),
            }
          : {}),
      }}
    />
  )
}
