import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL, SITE_NAME } from './seo-config'

export interface PageMetadataOptions {
  locale: string
  namespace: string
  path: string
  ogImage?: string
  metaKeyPrefix?: string
}

const OG_LOCALE_MAP: Record<string, string> = {
  en: 'en_US',
  nl: 'nl_NL',
  es: 'es_ES',
}

const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`

export async function generatePageMetadata({
  locale,
  namespace,
  path,
  ogImage,
  metaKeyPrefix = 'meta',
}: PageMetadataOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace })

  const title = t(`${metaKeyPrefix}.title`)
  const description = t(`${metaKeyPrefix}.description`)
  const canonicalPath = path === '/' ? '' : path
  const url = `${SITE_URL}/${locale}${canonicalPath}`

  const alternates: Record<string, string> = {}
  for (const loc of routing.locales) {
    alternates[loc] = `${SITE_URL}/${loc}${canonicalPath}`
  }
  alternates['x-default'] = `${SITE_URL}/en${canonicalPath}`

  const ogLocale = OG_LOCALE_MAP[locale] ?? locale

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: ogLocale,
      type: 'website',
      images: [{ url: ogImage ?? DEFAULT_OG_IMAGE }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
