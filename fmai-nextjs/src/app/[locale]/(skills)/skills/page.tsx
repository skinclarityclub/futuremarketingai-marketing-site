import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { WithContext, ItemList } from 'schema-dts'
import { routing } from '@/i18n/routing'
import { Link } from '@/i18n/navigation'
import { generatePageMetadata } from '@/lib/metadata'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, pageWebPageId } from '@/lib/seo-config'
import { SKILLS_DATA } from '@/lib/skills-data'

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
    namespace: 'skills-index',
    path: '/skills',
  })
}

export default async function SkillsIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'skills-index' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tBreadcrumbs = await getTranslations({ locale, namespace: 'common.breadcrumbs' })

  // ItemList JSON-LD enumerating all 12 skills for graph-cohesion + AI citation.
  const itemListId = `${pageWebPageId(locale, '/skills')}#itemlist`
  const itemList: WithContext<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    '@id': itemListId,
    name: t('meta.title'),
    numberOfItems: SKILLS_DATA.length,
    itemListElement: SKILLS_DATA.map((skill, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `${SITE_URL}/${locale}/skills/${skill.slug}`,
      name: tBreadcrumbs(`skill_${skill.slug.replace(/-/g, '_')}`),
    })),
  }

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/skills"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('hero.title'), path: '/skills' },
        ]}
        locale={locale}
        path="/skills"
      />
      <JsonLd data={itemList} />
      <Breadcrumbs path="/skills" locale={locale} />

      <section className="relative pt-12 pb-16 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </header>

          <ul
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label={t('grid_aria_label')}
          >
            {SKILLS_DATA.map((skill) => {
              const labelKey = `skill_${skill.slug.replace(/-/g, '_')}`
              const label = tBreadcrumbs(labelKey)
              const isComingSoon = skill.status === 'coming_soon'
              return (
                <li key={skill.slug}>
                  <Link
                    href={skill.route as never}
                    className="group block h-full p-6 rounded-[var(--radius-card)] border border-border-primary bg-bg-surface hover:border-accent-system/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h2 className="text-lg font-semibold text-text-primary group-hover:text-accent-system transition-colors">
                        {label}
                      </h2>
                      {isComingSoon ? (
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 rounded px-1.5 py-0.5">
                          {tCommon('comingSoon')}
                        </span>
                      ) : (
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-status-active bg-status-active/10 border border-status-active/30 rounded px-1.5 py-0.5">
                          {t('status.live')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {skill.shortDescription}
                    </p>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>
    </PageShell>
  )
}
