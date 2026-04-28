import type { ReactNode } from 'react'
import { getTranslations } from 'next-intl/server'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { ArrowRight } from 'lucide-react'
import { getSkillBySlug, type SkillData, type TierKey } from '@/lib/skills-data'

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

  const skill = getSkillBySlug(slug)
  const isComingSoon = skill?.status === 'coming_soon'

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
          { name: 'Skills', path: `/skills/${slug}` },
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
      <FaqJsonLd items={faqItems} />

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
            {!isComingSoon && (
              <div className="mt-8">
                <CTAButton href="/apply" size="lg">
                  {t('hero.cta')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features — 4 cards */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="features-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="features-heading">{t('features.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              {t('features.subtitle')}
            </p>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {featureKeys.map((key) => (
                <GlassCard key={key} className="text-left">
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(`features.${key}.body`)}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* How it works — 3 steps */}
      <section
        className="py-16 px-6 lg:px-12 bg-bg-surface/30"
        aria-labelledby="how-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="how-heading">{t('how.title')}</SectionHeading>
          </div>
          <ScrollReveal>
            <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stepKeys.map((key, index) => (
                <GlassCard as="li" key={key} className="text-left">
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
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="integrations-heading">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <SectionHeading id="integrations-heading">
              {t('integrations.title')}
            </SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              {t('integrations.subtitle')}
            </p>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {integrationKeys.map((key) => (
                <div
                  key={key}
                  className="border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-lg px-4 py-3 text-sm text-text-secondary"
                >
                  {t(`integrations.${key}`)}
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Use cases */}
      <section
        className="py-16 px-6 lg:px-12 bg-bg-surface/30"
        aria-labelledby="usecases-heading"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="usecases-heading">{t('useCases.title')}</SectionHeading>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {useCaseKeys.map((key) => (
                <GlassCard key={key} className="text-left">
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {t(`useCases.${key}.title`)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(`useCases.${key}.body`)}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Credit allocation per tier */}
      {skill && (
        <section className="py-16 px-6 lg:px-12" aria-labelledby="allocation-heading">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <SectionHeading id="allocation-heading">
                {t('allocation.title')}
              </SectionHeading>
              <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
                {t('allocation.subtitle')}
              </p>
              <p className="mt-2 text-sm text-text-muted">
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
                      <tr key={key} className="border-b border-border-primary/50 last:border-0">
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
          className="py-16 px-6 lg:px-12 bg-bg-surface/30"
          aria-labelledby="proof-heading"
        >
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10">
              <SectionHeading id="proof-heading">{t('proof.title')}</SectionHeading>
              <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
                {t('proof.subtitle')}
              </p>
            </div>
            <ScrollReveal>{customProof}</ScrollReveal>
          </div>
        </section>
      )}

      {/* FAQ — citation-bait, schema-content parity with FaqJsonLd above */}
      <section
        className="py-16 px-6 lg:px-12 bg-bg-surface/30"
        aria-labelledby="skill-faq-heading"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="skill-faq-heading">{t('faq.title')}</SectionHeading>
          </div>
          <dl className="space-y-6">
            {faqItems.map((item, index) => (
              <div key={faqKeys[index]} className="bg-bg-surface/50 rounded-lg p-6">
                <dt>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {item.question}
                  </h3>
                </dt>
                <dd className="text-text-secondary leading-relaxed">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-6 lg:px-12" aria-labelledby="skill-cta">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="skill-cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8 mt-4">{t('cta.subtitle')}</p>
            <CTAButton href="/apply" size="lg">
              {t('cta.button')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
