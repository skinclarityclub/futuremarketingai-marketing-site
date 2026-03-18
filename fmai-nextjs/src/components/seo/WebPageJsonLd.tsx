import type { WithContext, WebPage } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME, PAGE_DATES } from '@/lib/seo-config'

interface WebPageJsonLdProps {
  name: string
  description: string
  path: string
  locale: string
}

export function WebPageJsonLd({ name, description, path, locale }: WebPageJsonLdProps) {
  const url = `${SITE_URL}/${locale}${path === '/' ? '' : path}`
  const dateModified = PAGE_DATES[path] || PAGE_DATES['/']

  const data: WithContext<WebPage> = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name,
    description,
    url,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
    inLanguage: locale,
    dateModified,
  }

  return <JsonLd data={data} />
}
