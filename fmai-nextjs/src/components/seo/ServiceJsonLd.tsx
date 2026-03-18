import type { WithContext, Service } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME, PAGE_DATES } from '@/lib/seo-config'

interface ServiceJsonLdProps {
  name: string
  description: string
  serviceType: string
  path: string
  locale: string
}

type ServiceWithDate = WithContext<Service> & { dateModified: string }

export function ServiceJsonLd({
  name,
  description,
  serviceType,
  path,
  locale,
}: ServiceJsonLdProps) {
  const url = `${SITE_URL}/${locale}${path}`
  const dateModified = PAGE_DATES[path] || PAGE_DATES['/']

  const data: ServiceWithDate = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    serviceType,
    url,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    areaServed: 'Worldwide',
    dateModified,
  }

  return <JsonLd data={data} />
}
