import type { WithContext, Organization } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME, ORG_EMAIL, LINKEDIN_URL } from '@/lib/seo-config'

export function OrganizationJsonLd() {
  const data: WithContext<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    email: ORG_EMAIL,
    sameAs: [LINKEDIN_URL],
  }

  return <JsonLd data={data} />
}
