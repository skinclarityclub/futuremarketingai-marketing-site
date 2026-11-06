import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { AlternativesSections } from '@/components/alternatives/AlternativesSections'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'alternatives', path: '/alternatives' })
}

export default async function AlternativesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'alternatives' })
  const crumbs = await getTranslations({ locale, namespace: 'common.breadcrumbs' })

  // dateModified comes from the /alternatives lastmod in seo-config.ts, the day the prices were checked.
  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/alternatives"
        locale={locale}
        speakableSelectors={['.speakable-alternatives-summary']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: crumbs('alternatives'), path: '/alternatives' },
        ]}
        locale={locale}
      />
      <AlternativesSections locale={locale} />
    </PageShell>
  )
}
