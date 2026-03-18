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
      locale,
      type: 'website',
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}
