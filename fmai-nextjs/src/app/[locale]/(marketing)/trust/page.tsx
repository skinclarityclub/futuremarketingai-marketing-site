import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { TrustSections } from '@/components/trust/TrustSections'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'trust', path: '/trust' })
}

export default async function TrustPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'trust' })
  const crumbs = await getTranslations({ locale, namespace: 'common.breadcrumbs' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/trust"
        locale={locale}
        speakableSelectors={['.speakable-trust-summary']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: crumbs('trust'), path: '/trust' },
        ]}
        locale={locale}
      />
      <TrustSections locale={locale} />
    </PageShell>
  )
}
