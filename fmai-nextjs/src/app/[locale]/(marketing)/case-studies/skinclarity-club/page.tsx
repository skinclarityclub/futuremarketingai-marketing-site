import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, ORG_ID, PAGE_DATES, pageWebPageId } from '@/lib/seo-config'
import { PageShell } from '@/components/layout/PageShell'
import { SkcCaseSections } from '@/components/cases/SkcCaseSections'

const PATH = '/case-studies/skinclarity-club'
const SKC_ORG_ID = `${SITE_URL}${PATH}/#organization-skc`

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'case_studies.skc', path: PATH })
}

export default async function SkcCaseStudyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'case_studies.skc' })
  const url = `${SITE_URL}/${locale}${PATH}`

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path={PATH}
        locale={locale}
        speakableSelectors={['.speakable-skc-def']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Cases', path: '/case-studies' },
          { name: 'SkinClarity Club', path: PATH },
        ]}
        locale={locale}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': SKC_ORG_ID,
          name: 'SkinClarity Club',
          url: 'https://skinclarityclub.nl',
          description: t('client.description'),
        }}
      />
      {/* FutureMarketingAI writes the case (golf 7); Sindy is no longer the author Person node. url = the canonical per locale. */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Article',
          '@id': `${url}#case-study`,
          url,
          mainEntityOfPage: { '@id': pageWebPageId(locale, PATH) },
          inLanguage: locale,
          headline: t('meta.title'),
          description: t('meta.description'),
          author: { '@id': ORG_ID },
          publisher: { '@id': ORG_ID },
          about: { '@id': SKC_ORG_ID },
          datePublished: '2026-03-15',
          dateModified: PAGE_DATES[PATH],
        }}
      />
      <SkcCaseSections locale={locale} />
    </PageShell>
  )
}
