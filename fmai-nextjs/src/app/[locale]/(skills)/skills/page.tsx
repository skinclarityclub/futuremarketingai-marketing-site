import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import type { WithContext, ItemList } from 'schema-dts'
import {
  Megaphone,
  UserCheck,
  Inbox,
  BarChart3,
  Search,
  FileText,
  Target,
  MessageSquare,
  Mic,
  Video,
  ArrowRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import { SITE_URL, pageWebPageId } from '@/lib/seo-config'
import { SKILLS_DATA, getSkillBySlug } from '@/lib/skills-data'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { ClydeFeaturedTile } from '@/components/home/ClydeFeaturedTile'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'

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

const SKILL_ICONS: Record<string, LucideIcon> = {
  'social-media': Megaphone,
  'blog-factory': FileText,
  'lead-qualifier': UserCheck,
  'email-management': Inbox,
  manychat: MessageSquare,
  reporting: BarChart3,
  'seo-geo': Search,
  research: Target,
  'voice-agent': Mic,
  'ad-creator': Megaphone,
  'reel-builder': Video,
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
  // Reuse the home Clyde-bento chat pairs so the featured tile on /skills shows
  // the same demo conversation as the landing page — ClydeFeaturedTile expects
  // { user, clyde } pairs after the 4e9dd8b refactor.
  const tHomeClyde = await getTranslations({ locale, namespace: 'home.services.clyde' })

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

  const clydeSkill = getSkillBySlug('clyde')
  const secondarySkills = SKILLS_DATA.filter((s) => s.slug !== 'clyde')

  const clydePairs = [
    { user: tHomeClyde('prompt1'), clyde: tHomeClyde('response1') },
    { user: tHomeClyde('prompt2'), clyde: tHomeClyde('response2') },
    { user: tHomeClyde('prompt3'), clyde: tHomeClyde('response3') },
  ] as const

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

      <section className="relative pt-12 pb-20 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-12 space-y-4">
            <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
            <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary">
              {t('hero.title')}
            </h1>
            <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
          </header>

          {/*
            Bento mirroring home ServicesBento: Clyde featured tile
            col-span-2 row-span-2 (top-left), 11 secondary skills with
            SpotlightCard. 4-col desktop, 2-col tablet, 1-col mobile.
          */}
          <RevealContainer
            as="ul"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-fr gap-4 lg:gap-5"
            aria-label={t('grid_aria_label')}
          >
            {clydeSkill && (
              <RevealItem
                as="li"
                className="sm:col-span-2 lg:col-span-2 lg:row-span-2 min-h-[260px]"
              >
                <ClydeFeaturedTile
                  title={t('clyde.title')}
                  description={t('clyde.description')}
                  statusLabel={t('clyde.statusLabel')}
                  promptIntro={t('clyde.promptIntro')}
                  pairs={clydePairs}
                  userLabel={tHomeClyde('userLabel')}
                  clydeLabel={tHomeClyde('clydeLabel')}
                  openLink={t('clyde.openLink')}
                />
              </RevealItem>
            )}

            {secondarySkills.map((skill) => {
              const Icon = SKILL_ICONS[skill.slug] ?? Megaphone
              const labelKey = `skill_${skill.slug.replace(/-/g, '_')}`
              const label = tBreadcrumbs(labelKey)
              const isComingSoon = skill.status === 'coming_soon'
              return (
                <RevealItem as="li" key={skill.slug}>
                  <SpotlightCard
                    href={skill.route}
                    className="spotlight-card group relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-5 lg:p-6 h-full flex flex-col transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
                  >
                    <header className="flex items-start justify-between gap-3 mb-4">
                      <Icon className="w-5 h-5 text-accent-system shrink-0" aria-hidden />
                      <StatusBadge
                        status={skill.status}
                        liveLabel={t('status.live')}
                        soonLabel={tCommon('comingSoon')}
                      />
                    </header>

                    <h2 className="font-display text-base lg:text-lg font-bold text-text-primary mb-1.5 leading-tight">
                      {label}
                    </h2>
                    <p className="text-xs lg:text-sm text-text-secondary leading-relaxed flex-1">
                      {skill.shortDescription}
                    </p>

                    <span
                      aria-hidden
                      className={
                        'mt-3 inline-flex items-center transition-colors ' +
                        (isComingSoon ? 'text-text-muted' : 'text-text-muted group-hover:text-accent-system')
                      }
                    >
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </SpotlightCard>
                </RevealItem>
              )
            })}
          </RevealContainer>
        </div>
      </section>
    </PageShell>
  )
}

function StatusBadge({
  status,
  liveLabel,
  soonLabel,
}: {
  status: 'live' | 'coming_soon'
  liveLabel: string
  soonLabel: string
}) {
  if (status === 'live') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-status-active/10 border border-status-active/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-status-active">
        <span aria-hidden className="inline-block w-1 h-1 rounded-full bg-status-active" />
        {liveLabel}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent-human/10 border border-accent-human/30 px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.14em] text-accent-human">
      <span aria-hidden className="inline-block w-1 h-1 rounded-full bg-accent-human" />
      {soonLabel}
    </span>
  )
}
