import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { getSkillBySlug } from '@/lib/skills-data'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { ClydeSections } from '@/components/clyde/ClydeSections'

const PATH = '/skills/clyde'
const FAQ_KEYS = ['assistant', 'whatsapp', 'split', 'client', 'app'] as const

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'skills-clyde', path: PATH })
}

// Golf 8a: the skill template made way for a proof page in the golf 6 template (prototype golf8-clyde, r4).
export default async function ClydePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'skills-clyde' })
  const tc = await getTranslations({ locale, namespace: 'common.breadcrumbs' })
  const skill = getSkillBySlug('clyde')

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path={PATH}
        locale={locale}
        speakableSelectors={['.speakable-cl-def']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: tc('skills_index'), path: '/skills' },
          { name: tc('skill_clyde'), path: PATH },
        ]}
        locale={locale}
      />
      {skill && (
        <ServiceJsonLd
          name={skill.name}
          description={t('hero.definition')}
          serviceType={skill.serviceType}
          slug="clyde"
          locale={locale}
        />
      )}
      {/* same words as the visible questions; the link tag in the client answer becomes plain text */}
      <FaqJsonLd
        items={FAQ_KEYS.map((k) => ({
          question: t(`faq.items.${k}.q`),
          answer: t.markup(`faq.items.${k}.a`, { link: (c) => c }),
        }))}
        path={PATH}
        locale={locale}
      />
      <ClydeSections locale={locale} />
    </PageShell>
  )
}
