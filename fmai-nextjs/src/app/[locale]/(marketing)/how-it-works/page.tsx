import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { HowToJsonLd } from '@/components/seo/HowToJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { HowItWorksSections, WEEK_KEYS } from '@/components/how-it-works/HowItWorksSections'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    locale,
    namespace: 'how-it-works',
    path: '/how-it-works',
  })
}

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'how-it-works' })
  // The HowTo steps are the four visible weeks, in the same words (plain text, without the <b> of the hours).
  const plain = (key: string) => t.markup(key, { b: (c) => c })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/how-it-works"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'How It Works', path: '/how-it-works' },
        ]}
        locale={locale}
      />
      <HowToJsonLd
        name={t('jsonLd.name')}
        description={t('jsonLd.description')}
        steps={WEEK_KEYS.map((w) => ({
          name: `${t(`weeks.items.${w}.label`)}: ${t(`weeks.items.${w}.title`)}`,
          text: (['delivers', 'clyde', 'done'] as const)
            .map((r) => `${t(`weeks.rows.${r}`)}: ${plain(`weeks.items.${w}.${r}`)}`)
            .join(' '),
        }))}
      />
      <HowItWorksSections locale={locale} />
    </PageShell>
  )
}
