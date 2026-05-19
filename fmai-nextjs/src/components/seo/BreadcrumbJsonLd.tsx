import type { WithContext, BreadcrumbList } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, pageWebPageId } from '@/lib/seo-config'

interface BreadcrumbItem {
  name: string
  path: string
}

interface BreadcrumbJsonLdProps {
  items: BreadcrumbItem[]
  locale: string
  /**
   * Current page path for `@id` derivation. Defaults to the last item's
   * path. Pass explicitly when the visible chain is not anchored to the
   * actual route (e.g. blog post breadcrumbs that include the post slug).
   */
  path?: string
}

/**
 * BreadcrumbList JSON-LD. Each ListItem ships `@id` for entity-graph
 * cohesion with the parent WebPage. The BreadcrumbList itself ships
 * `@id: <webpage-id>#breadcrumb` so future cross-references can target
 * the chain directly.
 *
 * Closes audit F-10 (BreadcrumbList missing @id on 84 blocks) from
 * 2026-05-18 v2 SEO technical audit.
 */
export function BreadcrumbJsonLd({ items, locale, path }: BreadcrumbJsonLdProps) {
  const effectivePath = path ?? items[items.length - 1]?.path ?? '/'
  const breadcrumbId = `${pageWebPageId(locale, effectivePath)}#breadcrumb`

  const data: WithContext<BreadcrumbList> = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    '@id': breadcrumbId,
    itemListElement: items.map((item, index) => {
      const itemUrl = `${SITE_URL}/${locale}${item.path === '/' ? '' : item.path}`
      return {
        '@type': 'ListItem',
        '@id': `${itemUrl}#listitem`,
        position: index + 1,
        name: item.name,
        item: itemUrl,
      }
    }),
  }

  return <JsonLd data={data} />
}
