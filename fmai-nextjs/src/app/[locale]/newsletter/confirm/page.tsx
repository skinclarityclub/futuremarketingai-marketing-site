import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { NewsletterConfirmClient } from './NewsletterConfirmClient'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = await generatePageMetadata({
    locale,
    namespace: 'newsletter.confirm',
    path: '/newsletter/confirm',
  })
  // The landing spot for a one-time confirmation token, and client-rendered at
  // that — nothing here answers a search. It was indexable and absent from the
  // sitemap, which is the wrong half of the pair; same treatment as
  // /assessment/result.
  return { ...meta, robots: { index: false, follow: true } }
}

export default async function NewsletterConfirmPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  return <NewsletterConfirmClient />
}
