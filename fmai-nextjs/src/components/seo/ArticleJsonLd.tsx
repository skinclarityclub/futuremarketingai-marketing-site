import type { WithContext, Article } from 'schema-dts'
import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME } from '@/lib/seo-config'

interface ArticleJsonLdProps {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  slug: string
  locale: string
}

export function ArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  slug,
  locale,
}: ArticleJsonLdProps) {
  const url = `${SITE_URL}/${locale}/blog/${slug}`

  const data: WithContext<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished,
    dateModified,
    author: {
      '@type': 'Person',
      name: author,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    url,
    inLanguage: locale,
    isPartOf: {
      '@type': 'WebSite',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  return <JsonLd data={data} />
}
