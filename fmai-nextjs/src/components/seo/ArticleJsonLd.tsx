import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME, DALEY_PERSON_ID } from '@/lib/seo-config'

interface ArticleJsonLdProps {
  title: string
  description: string
  author: string
  datePublished: string
  dateModified: string
  slug: string
  locale: string
  /** Optional absolute image URL. Falls back to og-image.png. 1200x630 recommended. */
  image?: string
}

export function ArticleJsonLd({
  title,
  description,
  author,
  datePublished,
  dateModified,
  slug,
  locale,
  image,
}: ArticleJsonLdProps) {
  const url = `${SITE_URL}/${locale}/blog/${slug}`
  const articleId = `${url}#article`
  const imageUrl = image ?? `${SITE_URL}/og-image.png`

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': articleId,
    headline: title,
    description,
    datePublished,
    dateModified,
    // Phase 14-01: when the author is Daley (the only current author), reference
    // the Daley Person @id so search engines + LLMs unify the author identity
    // across /about (Person rendered by 14-02) and blog posts. Future authors
    // fall through to the inline Person path until they get their own @id.
    author:
      author === 'Daley Maat' || author === 'Daley'
        ? { '@id': DALEY_PERSON_ID }
        : {
            '@type': 'Person',
            name: author,
            url: SITE_URL,
          },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
      },
    },
    image: {
      '@type': 'ImageObject',
      url: imageUrl,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${url}#webpage`,
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
