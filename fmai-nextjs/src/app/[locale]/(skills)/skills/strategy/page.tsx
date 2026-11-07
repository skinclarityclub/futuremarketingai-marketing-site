import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { getSkillBySlug } from '@/lib/skills-data'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { StrategySections } from '@/components/skills/StrategySections'

const PATH = '/skills/strategy'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'skills-strategy', path: PATH })
}

// Golf 9a: new page that takes over /skills/research (308 to #research), prototype golf9-strategy (Daley 2026-11-08).
// Service plus the visible questions, no FAQPage (golf9-ONTWERP.md).
export default async function StrategyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'skills-strategy' })
  const tc = await getTranslations({ locale, namespace: 'common.breadcrumbs' })
  const skill = getSkillBySlug('strategy')

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path={PATH}
        locale={locale}
        speakableSelectors={['.speakable-st-def']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: tc('skills_index'), path: '/skills' },
          { name: tc('skill_strategy'), path: PATH },
        ]}
        locale={locale}
      />
      {skill && (
        <ServiceJsonLd
          name={skill.name}
          description={t('hero.definition')}
          serviceType={skill.serviceType}
          slug="strategy"
          locale={locale}
        />
      )}
      <StrategySections locale={locale} />
    </PageShell>
  )
}
