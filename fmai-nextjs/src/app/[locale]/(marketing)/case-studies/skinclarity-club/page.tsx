import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import { CaseStudyJsonLd } from '@/components/seo/CaseStudyJsonLd'
import { SINDY_PERSON_ID, LINKEDIN_SINDY_URL, SITE_URL, ORG_ID } from '@/lib/seo-config'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { ChapterSection } from '@/components/case-study/ChapterSection'
import { ScrollProgressRail } from '@/components/case-study/ScrollProgressRail'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { ArrowRight, Instagram, ShoppingBag, Sparkles, Layers, type LucideIcon } from 'lucide-react'

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
    namespace: 'case_studies.skc',
    path: '/case-studies/skinclarity-club',
  })
}

const ACCOUNT_KEYS = ['account1', 'account2', 'account3'] as const
// Clyde (skill6) renders last as the orchestrator; the 4 newer live skills
// (skill7-10) slot in before it. All 10 live skills run for SKC (2026-06-15).
const SKILL_KEYS = ['skill1', 'skill2', 'skill7', 'skill3', 'skill4', 'skill5', 'skill8', 'skill9', 'skill10', 'skill6'] as const
// Outcome numbers, before/after durations, month 3 and Sindy's quotes came from a MOCKUP transcript
// (docs/interviews/2026-04-sindy-skc-transcript.md); they stay out until Sindy confirms real ones (Daley 2026-10-12).
const TIMELINE_KEYS = ['week1', 'month1', 'now'] as const
const GALLERY_BRAND_KEYS = ['brand1', 'brand2', 'brand3', 'brand4'] as const

// Per-brand iconography (placeholder until real gallery assets land)
const GALLERY_BRAND_META: Record<
  (typeof GALLERY_BRAND_KEYS)[number],
  { Icon: LucideIcon; accent: 'system' | 'human' }
> = {
  brand1: { Icon: Instagram, accent: 'system' }, // main account (educational)
  brand2: { Icon: Sparkles, accent: 'human' }, // personal authority
  brand3: { Icon: ShoppingBag, accent: 'system' }, // shop
  brand4: { Icon: Layers, accent: 'human' }, // portfolio
}

const CHAPTERS = [
  { id: 'chapter-uitdaging', railKey: 'chapter1', index: '01' },
  { id: 'chapter-aanpak', railKey: 'chapter2', index: '02' },
  { id: 'chapter-resultaten', railKey: 'chapter3', index: '03' },
  { id: 'chapter-vervolg', railKey: 'chapter5', index: '04' },
] as const

const CHAPTER_TOTAL = String(CHAPTERS.length).padStart(2, '0')

export default async function SkcCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'case_studies.skc' })

  const railChapters = CHAPTERS.map((c) => ({
    id: c.id,
    label: t(`rail.${c.railKey}`),
    index: c.index,
  }))

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/case-studies/skinclarity-club"
        locale={locale}
        speakableSelectors={['.speakable-skc-summary', '.speakable-skc-outcome']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'SkinClarity Club', path: '/case-studies/skinclarity-club' },
        ]}
        locale={locale}
      />
      <Breadcrumbs path="/case-studies/skinclarity-club" locale={locale} />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': `${SITE_URL}/case-studies/skinclarity-club/#organization-skc`,
          name: 'SkinClarity Club',
          url: 'https://skinclarityclub.nl',
          description: t('client.description'),
        }}
      />
      <PersonJsonLd
        id={SINDY_PERSON_ID}
        name={t('testimonial.author.name')}
        jobTitle={t('testimonial.author.role')}
        description={t('testimonial.author.bio')}
        sameAs={[LINKEDIN_SINDY_URL]}
        worksForId={`${SITE_URL}/case-studies/skinclarity-club/#organization-skc`}
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          '@id': `${SITE_URL}/case-studies/skinclarity-club/#service-aaas`,
          name: 'Clyde, de AI-collega voor bureaus',
          description: t('hero.subtitle'),
          serviceType: 'AI marketing automation',
          provider: { '@id': ORG_ID },
          areaServed: ['NL', 'EU'],
          availableLanguage: ['nl', 'en', 'es'],
        }}
      />
      <CaseStudyJsonLd
        path="/case-studies/skinclarity-club"
        locale={locale}
        headline={t('meta.title')}
        description={t('meta.description')}
        authorId={SINDY_PERSON_ID}
        aboutOrgId={`${SITE_URL}/case-studies/skinclarity-club/#organization-skc`}
        serviceId={`${SITE_URL}/case-studies/skinclarity-club/#service-aaas`}
        datePublished="2026-03-15"
        dateModified="2026-10-12"
      />

      {/* Hero */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <EyebrowLabel className="inline-block mb-6">{t('hero.eyebrow')}</EyebrowLabel>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-4">
            {t('hero.title')}
          </h1>
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {(['chip1', 'chip2', 'chip3'] as const).map((key) => (
              <span
                key={key}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-bg-elevated text-accent-system border border-accent-system/20"
              >
                {t(`hero.${key}`)}
              </span>
            ))}
          </div>
          <p className="speakable-skc-summary text-lg lg:text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Body — chapter rail + chapters */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 lg:flex lg:gap-12 lg:items-start">
        <ScrollProgressRail title={t('rail.title')} chapters={railChapters} />
        <div className="flex-1 min-w-0">
          {/* Chapter 01 — Uitdaging */}
          <ChapterSection
            index="01"
            total={CHAPTER_TOTAL}
            id={CHAPTERS[0].id}
            eyebrow={t('chapter1.eyebrow')}
            title={t('chapter1.title')}
            intro={t('chapter1.intro')}
            railLabel={t('rail.chapter1')}
          >
            <ScrollReveal>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {ACCOUNT_KEYS.map((key) => (
                  <GlassCard key={key} className="text-left">
                    <div className="flex items-center gap-2 mb-3 text-accent-system">
                      <Instagram className="w-5 h-5" aria-hidden />
                      <span className="font-mono text-sm font-semibold">
                        {t(`setup.${key}Label`)}
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mb-3 uppercase tracking-wide">
                      {t(`setup.${key}Share`)}
                    </p>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {t(`setup.${key}Body`)}
                    </p>
                  </GlassCard>
                ))}
              </div>
            </ScrollReveal>
          </ChapterSection>

          {/* Chapter 02 — Aanpak */}
          <ChapterSection
            index="02"
            total={CHAPTER_TOTAL}
            id={CHAPTERS[1].id}
            eyebrow={t('chapter2.eyebrow')}
            title={t('chapter2.title')}
            intro={t('chapter2.intro')}
            bgVariant="surface"
            railLabel={t('rail.chapter2')}
          >
            <div className="space-y-12">
              {/* Skills active */}
              <div>
                <EyebrowLabel className="mb-3">{t('skills.title')}</EyebrowLabel>
                <p className="text-text-secondary mb-6 max-w-3xl">{t('skills.subtitle')}</p>
                <ScrollReveal>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {SKILL_KEYS.map((key) => (
                      <GlassCard key={key} className="text-left">
                        <h3 className="text-base font-semibold text-text-primary mb-2">
                          {t(`skills.${key}Name`)}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {t(`skills.${key}Body`)}
                        </p>
                      </GlassCard>
                    ))}
                  </div>
                </ScrollReveal>
              </div>

              {/* Architecture */}
              <div>
                <EyebrowLabel className="mb-3">{t('architecture.title')}</EyebrowLabel>
                <p className="text-text-secondary mb-6 max-w-3xl">{t('architecture.subtitle')}</p>
                <ScrollReveal>
                  <GlassCard className="text-left space-y-4">
                    <p className="speakable-skc-outcome text-text-secondary leading-relaxed">
                      {t('architecture.body1')}
                    </p>
                    <p className="text-text-secondary leading-relaxed">
                      {t('architecture.body2')}
                    </p>
                  </GlassCard>
                </ScrollReveal>
              </div>
            </div>
          </ChapterSection>

          {/* Chapter 03 — Resultaten */}
          <ChapterSection
            index="03"
            total={CHAPTER_TOTAL}
            id={CHAPTERS[2].id}
            eyebrow={t('chapter3.eyebrow')}
            title={t('chapter3.title')}
            intro={t('chapter3.intro')}
            railLabel={t('rail.chapter3')}
          >
            <div className="space-y-14">
              {/* Photo gallery — placeholder cards per brand */}
              <div>
                <EyebrowLabel className="mb-3">{t('gallery.title')}</EyebrowLabel>
                <p className="text-text-secondary mb-6 max-w-3xl">{t('gallery.subtitle')}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {GALLERY_BRAND_KEYS.map((key) => {
                    const { Icon, accent } = GALLERY_BRAND_META[key]
                    const accentTint =
                      accent === 'human'
                        ? 'from-accent-human/20 via-bg-elevated to-bg-deep'
                        : 'from-accent-system/20 via-bg-elevated to-bg-deep'
                    const iconColor =
                      accent === 'human' ? 'text-accent-human' : 'text-accent-system'
                    return (
                      <div
                        key={key}
                        className="rounded-2xl border border-border-primary bg-bg-surface/40 overflow-hidden"
                      >
                        <div
                          aria-hidden
                          className={`aspect-square bg-gradient-to-br ${accentTint} flex items-center justify-center`}
                        >
                          <Icon className={`h-12 w-12 ${iconColor}/80`} />
                        </div>
                        <div className="p-4">
                          <p className="text-sm font-semibold text-text-primary">
                            {t(`gallery.${key}.name`)}
                          </p>
                          <p className="font-mono text-[10px] uppercase tracking-wide text-text-muted mt-1">
                            {t(`gallery.${key}.role`)}
                          </p>
                          <p className="text-xs text-text-secondary mt-2 leading-relaxed">
                            {t(`gallery.${key}.output`)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Timeline — 4 phases */}
              <div>
                <EyebrowLabel className="mb-6">{t('timeline.title')}</EyebrowLabel>
                <ScrollReveal>
                  <ol className="relative border-l border-border-primary ml-4 space-y-8">
                    {TIMELINE_KEYS.map((key) => (
                      <li key={key} className="ml-6">
                        <span
                          aria-hidden
                          className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-accent-system/20 border border-accent-system"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-accent-system" />
                        </span>
                        <h3 className="text-sm font-semibold text-accent-system uppercase tracking-wide mb-1">
                          {t(`timeline.${key}Label`)}
                        </h3>
                        <p className="text-text-secondary leading-relaxed">
                          {t(`timeline.${key}Body`)}
                        </p>
                      </li>
                    ))}
                  </ol>
                </ScrollReveal>
              </div>
            </div>
          </ChapterSection>

          {/* Chapter 04 — Vervolg / CTA (the operator chapter held only mockup quotes, see TIMELINE_KEYS) */}
          <ChapterSection
            index="04"
            total={CHAPTER_TOTAL}
            id={CHAPTERS[3].id}
            eyebrow={t('chapter5.eyebrow')}
            title={t('chapter5.title')}
            intro={t('chapter5.intro')}
            railLabel={t('rail.chapter5')}
          >
            <ScrollReveal>
              <div className="text-center mt-2">
                <CTAButton href="/apply" size="lg">
                  {t('cta.button')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
              </div>
            </ScrollReveal>
          </ChapterSection>
        </div>
      </div>
    </PageShell>
  )
}
