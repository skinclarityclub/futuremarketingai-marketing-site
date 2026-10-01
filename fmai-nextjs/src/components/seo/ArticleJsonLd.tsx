import { JsonLd } from './JsonLd'
import { SITE_URL, SITE_NAME, DALEY_PERSON_ID, LINKEDIN_DALEY_URL, ORG_ID } from '@/lib/seo-config'

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
  /** Schema.org type. Cluster blog posts can use 'BlogPosting'; pillars stay 'Article'. */
  type?: 'Article' | 'BlogPosting'
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
  type = 'Article',
}: ArticleJsonLdProps) {
  const url = `${SITE_URL}/${locale}/kennisbank/${slug}`
  const articleId = `${url}#article`
  const imageUrl = image ?? `${SITE_URL}/og-image.png`

  const data = {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': articleId,
    headline: title,
    description,
    datePublished,
    dateModified,
    // Daley keeps the shared Person @id so the identity unifies with /about, but
    // the node is also inline: the full Person is only emitted on /about, so a
    // bare @id left the article's author without a name, bio URL or sameAs.
    // Future authors fall through to the generic inline Person path.
    // Canonical author name is "Daley van Diest" (short form "Daley").
    author:
      author === 'Daley van Diest' || author === 'Daley'
        ? {
            '@type': 'Person',
            '@id': DALEY_PERSON_ID,
            name: 'Daley van Diest',
            url: `${SITE_URL}/${locale}/about`,
            sameAs: [LINKEDIN_DALEY_URL],
          }
        : {
            '@type': 'Person',
            name: author,
            url: SITE_URL,
          },
    publisher: {
      '@type': 'Organization',
      '@id': ORG_ID,
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
