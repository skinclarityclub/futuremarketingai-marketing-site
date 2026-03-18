import type { WithContext, BreadcrumbList } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL } from '@/lib/seo-config'

interface BreadcrumbItem {
  name: string
  path: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
  locale: string
}

export function BreadcrumbJsonLd({ items, locale }: BreadcrumbJsonLdProps) {
  const data: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}/${locale}${item.path === '/' ? '' : item.path}`,
    })),
  }

  return <JsonLd data={data} />
}
