import type { WithContext, WebSite } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME } from '@/lib/seo-config'

export function WebSiteJsonLd() {
  const data: WithContext<WebSite> = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    } as WebSite['potentialAction'],
  }

  return <JsonLd data={data} />
}
