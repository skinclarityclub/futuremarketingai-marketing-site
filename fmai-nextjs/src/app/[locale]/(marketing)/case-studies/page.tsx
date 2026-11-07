import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { JsonLd } from '@/components/seo/JsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { SITE_URL, SITE_NAME, WEBSITE_ID, PAGE_DATES, pageWebPageId } from '@/lib/seo-config'
import { PageShell } from '@/components/layout/PageShell'
import { CasesHubSections } from '@/components/cases/CasesHubSections'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'case_studies.hub', path: '/case-studies' })
}

export default async function CasesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'case_studies' })

  return (
    <PageShell showStickyCta>
      {/* CollectionPage with an ItemList of the case pages; SalesLobe joins the list in PR 7b, after Paul's yes */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          '@id': pageWebPageId(locale, '/case-studies'),
          name: t('hub.meta.title'),
          description: t('hub.meta.description'),
          url: `${SITE_URL}/${locale}/case-studies`,
          isPartOf: { '@id': WEBSITE_ID, '@type': 'WebSite', name: SITE_NAME, url: SITE_URL },
          inLanguage: locale,
          dateModified: PAGE_DATES['/case-studies'],
          speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.speakable-cases-def'] },
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: t('skc.meta.title'),
                url: `${SITE_URL}/${locale}/case-studies/skinclarity-club`,
              },
            ],
          },
        }}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Cases', path: '/case-studies' },
        ]}
        locale={locale}
      />
      <CasesHubSections locale={locale} />
    </PageShell>
  )
}
