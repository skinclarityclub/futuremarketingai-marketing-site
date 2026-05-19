import type { WithContext, WebSite } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME, WEBSITE_ID } from '@/lib/seo-config'

export function WebSiteJsonLd() {
  const data: WithContext<WebSite> & { '@id': string } = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
  }

  return <JsonLd data={data} />
}
