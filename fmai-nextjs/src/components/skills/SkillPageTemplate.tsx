import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { Typewriter } from '@/components/motion/Typewriter'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import {
  getSkillBySlug,
  getRelatedSkills,
  type SkillData,
  type TierKey,
} from '@/lib/skills-data'
import { SkillStickyToc } from './SkillStickyToc'

interface SkillPageTemplateProps {
  /** i18n namespace for this skill page, e.g. 'skills-social-media' */
  namespace: string
  /** Slug matches SKILLS_DATA.slug — used for breadcrumb name + tierCaps lookup */
  slug: string
  locale: string
  /** Optional override for hero custom content (e.g. VoiceDemoSection) */
  customHero?: ReactNode
  /** Optional proof/demo content injected into the proof section */
  customProof?: ReactNode
  /** Numbers in the right order of how many feature/step keys exist */
  featureCount?: number
  stepCount?: number
  useCaseCount?: number
  integrationCount?: number
  /** How many FAQ Qs exist in the i18n namespace under .faq.items (q1..qN). Default 5. */
  faqCount?: number
}

const TIER_ORDER: Array<{ key: TierKey; labelKey: string }> = [
  { key: 'FOUNDING_MEMBER', labelKey: 'founding' },
  { key: 'GROWTH', labelKey: 'growth' },
  { key: 'PROFESSIONAL', labelKey: 'professional' },
  { key: 'ENTERPRISE', labelKey: 'enterprise' },
]

type MatrixT = (key: string, values?: Record<string, string | number>) => string

function formatCap(
  skill: SkillData,
  tier: TierKey,
  t: MatrixT,
  labels: { fairUse: string; unlimited: string; notAvailable: string },
): string {
  if (!skill.tierCaps) return labels.fairUse
  const cap = skill.tierCaps[tier]
  if (!cap) return labels.notAvailable
  if (cap.labelKey) return t(cap.labelKey)
  if (cap.included === -1) return labels.unlimited
  if (cap.included === 0) return labels.notAvailable
  switch (cap.unit ?? 'count') {
    case 'min':
      return t('minPerMonth', { count: cap.included })
    case 'dm':
      return t('dmsPerMonth', { count: cap.included })
    case 'count':
    default:
      return t('itemsPerMonth', { count: cap.included })
  }
}

export async function SkillPageTemplate({
  namespace,
  slug,
  locale,
  customHero,
  customProof,
  featureCount = 4,
  stepCount = 3,
  useCaseCount = 2,
  integrationCount = 3,
  faqCount = 5,
}: SkillPageTemplateProps) {
  const t = await getTranslations({ locale, namespace })
  const tTiers = await getTranslations({ locale, namespace: 'pricing.tiers' })
  const tMatrix = await getTranslations({ locale, namespace: 'pricing.matrix' })
  const tCommon = await getTranslations({ locale, namespace: 'common' })
  const tBreadcrumbs = await getTranslations({ locale, namespace: 'common.breadcrumbs' })
  const tTemplate = await getTranslations({ locale, namespace: 'skills-template' })

  const skill = getSkillBySlug(slug)
  const isComingSoon = skill?.status === 'coming_soon'
  const related = getRelatedSkills(slug, 3)

  const matrixLabels = {
    fairUse: tMatrix('fairUse'),
    unlimited: tMatrix('unlimited'),
    notAvailable: tMatrix('notAvailable'),
  }

  const featureKeys = Array.from({ length: featureCount }, (_, i) => `feature${i + 1}`)
  const stepKeys = Array.from({ length: stepCount }, (_, i) => `step${i + 1}`)
  const useCaseKeys = Array.from({ length: useCaseCount }, (_, i) => `useCase${i + 1}`)
  const integrationKeys = Array.from({ length: integrationCount }, (_, i) => `integration${i + 1}`)
  const faqKeys = Array.from({ length: faqCount }, (_, i) => `q${i + 1}`)
  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.items.${key}.question`),
    answer: t(`faq.items.${key}.answer`),
  }))
  const faqAccordionItems = faqItems.map((item, index) => ({
    key: faqKeys[index],
    question: item.question,
    answer: item.answer,
  }))

  // Hero typewriter prompts — graceful fallback if missing in i18n.
  let heroPrompts: readonly string[] = []
  try {
    heroPrompts = [
      t('hero.prompts.prompt1'),
      t('hero.prompts.prompt2'),
      t('hero.prompts.prompt3'),
    ]
  } catch {
    heroPrompts = []
  }

  // Sticky TOC sections — synced with section ids below.
  const tocSections = [
    { id: 'features', label: tTemplate('toc.features') },
    { id: 'how', label: tTemplate('toc.how') },
    { id: 'integrations', label: tTemplate('toc.integrations') },
    { id: 'usecases', label: tTemplate('toc.useCases') },
    ...(skill ? [{ id: 'allocation', label: tTemplate('toc.allocation') }] : []),
    ...(customProof ? [{ id: 'proof', label: tTemplate('toc.proof') }] : []),
    ...(related.length > 0 ? [{ id: 'related', label: tTemplate('toc.related') }] : []),
    { id: 'faq', label: tTemplate('toc.faq') },
    { id: 'cta', label: tTemplate('toc.cta') },
  ]

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path={`/skills/${slug}`}
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Skills', path: '/skills' },
          { name: skill?.name ?? slug, path: `/skills/${slug}` },
        ]}
        locale={locale}
      />
      {skill && (
        <ServiceJsonLd
          name={skill.name}
          description={t('hero.subtitle')}
          serviceType={skill.serviceType}
          slug={slug}
          locale={locale}
        />
      )}
      <FaqJsonLd items={faqItems} path={`/skills/${slug}`} locale={locale} />
      <Breadcrumbs path={`/skills/${slug}`} locale={locale} />

      {/* Hero */}
      {customHero ?? (
        <section className="relative pt-24 pb-12 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto text-center">
            {isComingSoon ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-full text-xs font-semibold text-[#F5A623] uppercase tracking-wide mb-4">
                {t('hero.eyebrow')}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-4 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system">
                {t('hero.eyebrow')}
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
              {t('hero.title')}
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {heroPrompts.length > 0 && (
              <div className="mt-8 mx-auto max-w-xl rounded-xl border border-border-primary/70 bg-bg-deep/40 px-4 py-3 text-left">
                <p className="text-[11px] font-mono uppercase tracking-[0.16em] text-text-muted mb-1.5">
                  {tTemplate('promptHero.intro')}
                </p>
                <Typewriter prompts={heroPrompts} />
              </div>
            )}

            <div className="mt-8">
              {isComingSoon ? (
                <CTAButton href="/roadmap" size="lg">
                  {tCommon('viewRoadmap')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
              ) : (
                <CTAButton href="/apply" size="lg">
                  {t('hero.cta')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Sticky-TOC two-column layout for the long content body */}
      <div className="relative px-6 lg:px-12">
        <div className="max-w-7xl mx-auto lg:flex lg:gap-12">
          <SkillStickyToc title={tTemplate('toc.title')} sections={tocSections} />

          <div className="flex-1 min-w-0">
            {/* Features — 4 cards */}
            <section id="features" className="py-16" aria-labelledby="features-heading">
              <div className="max-w-6xl mx-auto">
                <div className="text-center mb-10 space-y-3">
                  <EyebrowLabel>{tTemplate('eyebrows.features')}</EyebrowLabel>
                  <SectionHeading id="features-heading">{t('features.title')}</SectionHeading>
                  <p className="text-text-secondary max-w-2xl mx-auto">
                    {t('features.subtitle')}
                  </p>
                </div>
                <RevealContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featureKeys.map((key) => (
                    <RevealItem key={key}>
                      <SpotlightCard className="spotlight-card group relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-5 lg:p-6 h-full text-left transition-colors duration-300 hover:bg-white/[0.04]">
                        <h3 className="text-lg font-semibold text-text-primary mb-2">
                          {t(`features.${key}.title`)}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {t(`features.${key}.body`)}
                        </p>
                      </SpotlightCard>
                    </RevealItem>
                  ))}
                </RevealContainer>
              </div>
            </section>

            {/* How it works — 3 steps */}
            <section
              id="how"
              className="py-16 bg-bg-surface/30 -mx-6 lg:-mx-12 px-6 lg:px-12 rounded-2xl"
              aria-labelledby="how-heading"
            >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10 space-y-3">
                  <EyebrowLabel>{tTemplate('eyebrows.how')}</EyebrowLabel>
                  <SectionHeading id="how-heading">{t('how.title')}</SectionHeading>
                </div>
                <RevealContainer
                  as="ol"
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  {stepKeys.map((key, index) => (
                    <RevealItem key={key} as="li">
                      <GlassCard className="text-left h-full">
                        <div className="text-accent-system font-mono text-sm mb-2">
                          {String(index + 1).padStart(2, '0')}
                        </div>
                        <h3 className="text-base font-semibold text-text-primary mb-2">
                          {t(`how.${key}.title`)}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {t(`how.${key}.body`)}
                        </p>
                      </GlassCard>
                    </RevealItem>
                  ))}
                </RevealContainer>
              </div>
            </section>

            {/* Integrations */}
            <section
              id="integrations"
              className="py-16"
              aria-labelledby="integrations-heading"
            >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-8 space-y-3">
                  <EyebrowLabel>{tTemplate('eyebrows.integrations')}</EyebrowLabel>
                  <SectionHeading id="integrations-heading">
                    {t('integrations.title')}
                  </SectionHeading>
                  <p className="text-text-secondary max-w-2xl mx-auto">
                    {t('integrations.subtitle')}
                  </p>
                </div>
                <RevealContainer className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {integrationKeys.map((key) => (
                    <RevealItem key={key}>
                      <div className="border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-lg px-4 py-3 text-sm text-text-secondary h-full">
                        {t(`integrations.${key}`)}
                      </div>
                    </RevealItem>
                  ))}
                </RevealContainer>
              </div>
            </section>

            {/* Use cases */}
            <section
              id="usecases"
              className="py-16 bg-bg-surface/30 -mx-6 lg:-mx-12 px-6 lg:px-12 rounded-2xl"
              aria-labelledby="usecases-heading"
            >
              <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10 space-y-3">
                  <EyebrowLabel>{tTemplate('eyebrows.useCases')}</EyebrowLabel>
                  <SectionHeading id="usecases-heading">{t('useCases.title')}</SectionHeading>
                </div>
                <RevealContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {useCaseKeys.map((key) => (
                    <RevealItem key={key}>
                      <SpotlightCard className="spotlight-card group relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-5 lg:p-6 h-full text-left transition-colors duration-300 hover:bg-white/[0.04]">
                        <h3 className="text-base font-semibold text-text-primary mb-2">
                          {t(`useCases.${key}.title`)}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {t(`useCases.${key}.body`)}
                        </p>
                      </SpotlightCard>
                    </RevealItem>
                  ))}
                </RevealContainer>
              </div>
            </section>

            {/* Credit allocation per tier */}
            {skill && (
              <section id="allocation" className="py-16" aria-labelledby="allocation-heading">
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-8 space-y-3">
                    <EyebrowLabel>{tTemplate('eyebrows.allocation')}</EyebrowLabel>
                    <SectionHeading id="allocation-heading">
                      {t('allocation.title')}
                    </SectionHeading>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                      {t('allocation.subtitle')}
                    </p>
                    <p className="text-sm text-text-muted">
                      <span className="font-mono">{skill.creditCostLabel}</span>
                    </p>
                  </div>
                  <ScrollReveal>
                    <GlassCard className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border-primary">
                            <th className="text-left px-3 py-2 font-semibold text-text-primary">
                              Tier
                            </th>
                            <th className="text-right px-3 py-2 font-semibold text-text-primary">
                              {skill.name}
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {TIER_ORDER.map(({ key, labelKey }) => (
                            <tr
                              key={key}
                              className="border-b border-border-primary/50 last:border-0"
                            >
                              <td className="px-3 py-2 text-text-secondary">
                                {tTiers(`${labelKey}.name`)}
                              </td>
                              <td className="px-3 py-2 text-right text-text-primary font-medium">
                                {formatCap(skill, key, tMatrix, matrixLabels)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </GlassCard>
                  </ScrollReveal>
                </div>
              </section>
            )}

            {/* Proof / demo slot */}
            {customProof && (
              <section
                id="proof"
                className="py-16 bg-bg-surface/30 -mx-6 lg:-mx-12 px-6 lg:px-12 rounded-2xl"
                aria-labelledby="proof-heading"
              >
                <div className="max-w-5xl mx-auto">
                  <div className="text-center mb-10 space-y-3">
                    <EyebrowLabel>{tTemplate('eyebrows.proof')}</EyebrowLabel>
                    <SectionHeading id="proof-heading">{t('proof.title')}</SectionHeading>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                      {t('proof.subtitle')}
                    </p>
                  </div>
                  <ScrollReveal>{customProof}</ScrollReveal>
                </div>
              </section>
            )}

            {/* Related skills */}
            {related.length > 0 && (
              <section id="related" className="py-16" aria-labelledby="related-heading">
                <div className="max-w-6xl mx-auto">
                  <div className="text-center mb-10 space-y-3">
                    <EyebrowLabel>{tTemplate('eyebrows.related')}</EyebrowLabel>
                    <SectionHeading id="related-heading">
                      {tTemplate('related.title')}
                    </SectionHeading>
                    <p className="text-text-secondary max-w-2xl mx-auto">
                      {tTemplate('related.subtitle')}
                    </p>
                  </div>
                  <RevealContainer className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {related.map((r) => {
                      const labelKey = `skill_${r.slug.replace(/-/g, '_')}`
                      return (
                        <RevealItem key={r.slug}>
                          <SpotlightCard
                            href={r.route}
                            className="spotlight-card group relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-5 lg:p-6 h-full flex flex-col gap-2 transition-colors duration-300 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
                          >
                            <h3 className="font-display text-lg font-bold text-text-primary leading-tight">
                              {tBreadcrumbs(labelKey)}
                            </h3>
                            <p className="text-sm text-text-secondary leading-relaxed flex-1">
                              {r.shortDescription}
                            </p>
                            <span
                              aria-hidden
                              className="mt-2 inline-flex items-center gap-1.5 text-sm text-accent-system group-hover:text-text-primary transition-colors"
                            >
                              <ArrowRight className="w-4 h-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                            </span>
                          </SpotlightCard>
                        </RevealItem>
                      )
                    })}
                  </RevealContainer>
                </div>
              </section>
            )}

            {/* FAQ — citation-bait, schema-content parity with FaqJsonLd above */}
            <section
              id="faq"
              className="py-16 bg-bg-surface/30 -mx-6 lg:-mx-12 px-6 lg:px-12 rounded-2xl"
              aria-labelledby="skill-faq-heading"
            >
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-10 space-y-3">
                  <EyebrowLabel>{tTemplate('eyebrows.faq')}</EyebrowLabel>
                  <SectionHeading id="skill-faq-heading">{t('faq.title')}</SectionHeading>
                </div>
                <FaqAccordion items={faqAccordionItems} />
              </div>
            </section>

            {/* Final CTA */}
            <section id="cta" className="py-20" aria-labelledby="skill-cta">
              <ScrollReveal>
                <div className="max-w-3xl mx-auto text-center space-y-3">
                  <EyebrowLabel>{tTemplate('eyebrows.cta')}</EyebrowLabel>
                  <SectionHeading id="skill-cta">{t('cta.title')}</SectionHeading>
                  <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
                  <CTAButton href="/apply" size="lg">
                    {t('cta.button')}
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </CTAButton>
                </div>
              </ScrollReveal>
            </section>
          </div>
        </div>
      </div>
    </PageShell>
  )
}
