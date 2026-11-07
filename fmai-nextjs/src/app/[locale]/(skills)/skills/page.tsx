import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { WithContext, ItemList } from 'schema-dts'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { PageShell } from '@/components/layout/PageShell'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, pageWebPageId } from '@/lib/seo-config'
import { SKILLS_DATA } from '@/lib/skills-data'
import { SkillsHubSections } from '@/components/skills/SkillsHubSections'

const PATH = '/skills'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'skills-index', path: PATH })
}

// Golf 9a: the bento made way for "Wat Clyde maakt" in the golf 6 template (prototype golf9-skills, Daley 2026-11-08).
export default async function SkillsIndexPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'skills-index' })
  const tc = await getTranslations({ locale, namespace: 'common.breadcrumbs' })

  // Only pages that exist: coming_soon skills have no page, their old URLs 308 to #binnenkort.
  const pages = SKILLS_DATA.filter((s) => s.status === 'live')
  const itemList: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': `${pageWebPageId(locale, PATH)}#itemlist`,
    name: t('meta.title'),
    numberOfItems: pages.length,
    itemListElement: pages.map((skill, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/${locale}/skills/${skill.slug}`,
      name: tc(`skill_${skill.slug.replace(/-/g, '_')}`),
    })),
  }

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path={PATH}
        locale={locale}
        speakableSelectors={['.speakable-sk-def']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: tc('skills_index'), path: PATH },
        ]}
        locale={locale}
        path={PATH}
      />
      <JsonLd data={itemList} />
      <SkillsHubSections locale={locale} />
    </PageShell>
  )
}
