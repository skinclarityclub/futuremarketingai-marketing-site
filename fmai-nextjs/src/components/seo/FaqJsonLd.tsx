import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL } from '@/lib/seo-config'

export interface FaqItem {
  question: string
  answer: string
}

interface FaqJsonLdProps {
  items: FaqItem[]
  /** Route path (e.g. '/pricing'). When combined with locale, emits @id on the FAQPage. */
  path?: string
  locale?: string
}

export function FaqJsonLd({ items, path, locale }: FaqJsonLdProps) {
  const id =
    path && locale
      ? `${SITE_URL}/${locale}${path === '/' ? '' : path}#faq`
      : undefined

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        ...(id ? { '@id': id } : {}),
        mainEntity: items.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }}
    />
  )
}
