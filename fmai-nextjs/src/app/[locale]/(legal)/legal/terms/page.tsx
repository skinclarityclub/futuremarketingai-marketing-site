import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { SITE_URL } from '@/lib/seo-config'
import { LegalSectionPage } from '@/components/legal/LegalSectionPage'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'legal.sections.terms' })
  return {
    title: t('title'),
    description: t('content').slice(0, 160),
    alternates: { canonical: `${SITE_URL}/${locale}/legal/terms` },
  }
}

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  return <LegalSectionPage locale={locale} section="terms" />
}
