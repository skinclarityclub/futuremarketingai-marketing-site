import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { getSkillBySlug } from '@/lib/skills-data'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { ReportingSections } from '@/components/skills/ReportingSections'

const PATH = '/skills/reporting'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'skills-reporting', path: PATH })
}

// Golf 9c: proof page from the prototype golf9-reporting (Daley 2026-11-08), off the old SkillPageTemplate.
// Service plus the visible questions, no FAQPage, like /skills/strategy.
export default async function ReportingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'skills-reporting' })
  const tc = await getTranslations({ locale, namespace: 'common.breadcrumbs' })
  const skill = getSkillBySlug('reporting')

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path={PATH}
        locale={locale}
        speakableSelectors={['.speakable-rp-def']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: tc('skills_index'), path: '/skills' },
          { name: tc('skill_reporting'), path: PATH },
        ]}
        locale={locale}
      />
      {skill && (
        <ServiceJsonLd
          name={skill.name}
          description={t('hero.definition')}
          serviceType={skill.serviceType}
          slug="reporting"
          locale={locale}
        />
      )}
      <ReportingSections locale={locale} />
    </PageShell>
  )
}
