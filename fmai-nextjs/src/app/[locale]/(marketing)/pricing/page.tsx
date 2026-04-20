import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PricingJsonLd } from '@/components/seo/PricingJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { SkillsTierMatrix } from '@/components/pricing/SkillsTierMatrix'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'pricing', path: '/pricing' })
}

const TIER_KEYS = ['partner', 'growth', 'professional', 'enterprise', 'founding'] as const

const TIER_CONFIG: Record<
  (typeof TIER_KEYS)[number],
  { featureCount: number; highlighted: boolean; badge?: 'popular' | 'founding' }
> = {
  partner: { featureCount: 10, highlighted: false },
  growth: { featureCount: 9, highlighted: false },
  professional: { featureCount: 9, highlighted: true, badge: 'popular' },
  enterprise: { featureCount: 8, highlighted: false },
  founding: { featureCount: 10, highlighted: true, badge: 'founding' },
}

const CREDIT_PACK_KEYS = ['partnerTopUp', 'boost', 'scale', 'unlimited'] as const
const SKILL_PACK_KEYS = [
  'partnerStaticAds',
  'partnerManychat',
  'voiceMinutes',
  'videoAds',
  'reels',
  'blogPower',
] as const
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'pricing' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/pricing"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Pricing', path: '/pricing' },
        ]}
        locale={locale}
      />
      <FaqJsonLd
        items={FAQ_KEYS.map((key) => ({
          question: t(`faq.items.${key}.question`),
          answer: t(`faq.items.${key}.answer`),
        }))}
      />
      <PricingJsonLd />

      {/* Hero */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-6">
            {t('hero.description')}
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-full text-sm font-medium text-[#F5A623]">
            {t('hero.counter', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
          </div>
        </div>
      </section>

      {/* 5 Tier Cards */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="pricing-tiers">
        <div className="max-w-7xl mx-auto">
          <h2 id="pricing-tiers" className="sr-only">
            Pricing tiers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {TIER_KEYS.map((tier, index) => {
              const config = TIER_CONFIG[tier]
              const isFounding = tier === 'founding'

              return (
                <ScrollReveal key={tier} delay={index * 0.05}>
                  <GlassCard
                    highlighted={config.highlighted}
                    className="relative flex flex-col h-full"
                  >
                    {config.badge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap ${
                            config.badge === 'founding'
                              ? 'bg-[#F5A623] text-bg-deep'
                              : 'bg-accent-system text-bg-deep'
                          }`}
                        >
                          {config.badge === 'founding'
                            ? t('tiers.founding.subtitle')
                            : 'Most popular'}
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-bold font-display text-text-primary mb-1 mt-2">
                      {t(`tiers.${tier}.name`)}
                    </h3>
                    <p className="text-xs text-text-muted mb-4">{t(`tiers.${tier}.subtitle`)}</p>

                    <div className="mb-2">
                      <span className="font-mono text-3xl font-bold text-text-primary">
                        &euro;{t(`tiers.${tier}.price`)}
                      </span>
                      <span className="text-text-muted text-sm">/mo</span>
                    </div>

                    <div className="flex flex-col gap-0.5 mb-2">
                      <p className="text-accent-system font-medium text-sm">
                        {t(`tiers.${tier}.workspaces`)} {t('workspacesLabel')}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {t(`tiers.${tier}.credits`)} {t('creditsLabel')}
                      </p>
                    </div>

                    <p className="text-text-muted text-xs mb-4">
                      {t('onboardingLabel')}: &euro;{t(`tiers.${tier}.onboarding`)}
                    </p>

                    <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                      {isFounding
                        ? t('tiers.founding.description', {
                            taken: FOUNDING_SPOTS_TAKEN,
                            total: FOUNDING_SPOTS_TOTAL,
                          })
                        : t(`tiers.${tier}.description`)}
                    </p>

                    <div className="border-t border-border-primary mb-4" />

                    <ul className="space-y-2 mb-6 flex-1">
                      {Array.from({ length: config.featureCount }).map((_, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-sm text-text-secondary"
                        >
                          <svg
                            className="w-4 h-4 text-accent-system flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{t(`tiers.${tier}.features_${i}`)}</span>
                        </li>
                      ))}
                    </ul>

                    <CTAButton
                      href="/apply"
                      variant={config.highlighted ? 'primary' : 'secondary'}
                      className="w-full justify-center"
                    >
                      {t('applyCta')}
                    </CTAButton>
                  </GlassCard>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Skills × Tier Matrix */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="pricing-matrix">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="pricing-matrix">{t('matrix.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">{t('matrix.subtitle')}</p>
          </div>
          <ScrollReveal>
            <SkillsTierMatrix locale={locale} />
          </ScrollReveal>
          <p className="text-xs text-text-muted mt-4 text-center max-w-3xl mx-auto">
            {t('matrix.legend')}
          </p>
        </div>
      </section>

      {/* Why prices visible */}
      <section className="py-12 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="visibility">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading id="visibility">{t('visibility.title')}</SectionHeading>
          <p className="mt-4 text-text-secondary leading-relaxed">{t('visibility.body')}</p>
        </div>
      </section>

      {/* Credit Packs */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="credit-packs">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="credit-packs">{t('creditPacks.title')}</SectionHeading>
            <p className="text-text-secondary mt-4">{t('creditPacks.description')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CREDIT_PACK_KEYS.map((key) => (
              <ScrollReveal key={key}>
                <div className="flex flex-col items-center gap-2 border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-xl px-4 py-6 text-center transition-all duration-300 hover:bg-white/[0.04]">
                  <span className="text-sm font-semibold text-text-primary">
                    {t(`creditPacks.items.${key}.name`)}
                  </span>
                  <span className="text-accent-system text-sm">
                    {t(`creditPacks.items.${key}.credits`)} credits
                  </span>
                  <span className="font-mono text-xl font-bold text-text-primary">
                    &euro;{t(`creditPacks.items.${key}.price`)}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Skill-specific Packs */}
      <section className="py-16 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="skill-packs">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="skill-packs">{t('skillPacks.title')}</SectionHeading>
            <p className="text-text-secondary mt-4">{t('skillPacks.description')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SKILL_PACK_KEYS.map((key) => (
              <ScrollReveal key={key}>
                <div className="border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-xl px-5 py-5 transition-all duration-300 hover:bg-white/[0.04]">
                  <h4 className="text-base font-semibold text-text-primary mb-1">
                    {t(`skillPacks.items.${key}.name`)}
                  </h4>
                  <p className="text-sm text-text-secondary mb-3">
                    {t(`skillPacks.items.${key}.quantity`)}
                  </p>
                  <span className="font-mono text-lg font-bold text-accent-system">
                    &euro;{t(`skillPacks.items.${key}.price`)}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="pricing-faq" className="py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="pricing-faq" className="text-center mb-10">
            {t('faq.title')}
          </SectionHeading>
          <ScrollReveal>
            <dl className="space-y-6">
              {FAQ_KEYS.map((key) => (
                <div key={key} className="bg-bg-surface/30 rounded-lg p-6">
                  <dt className="text-lg font-semibold text-text-primary mb-2">
                    {t(`faq.items.${key}.question`)}
                  </dt>
                  <dd className="text-text-secondary leading-relaxed">
                    {t(`faq.items.${key}.answer`)}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="pricing-cta">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <GlassCard className="p-12">
              <SectionHeading id="pricing-cta" className="mb-4">
                {t('cta.title')}
              </SectionHeading>
              <p className="text-lg text-text-secondary mb-8">{t('cta.description')}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/apply" size="lg">
                  {t('cta.primary')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
                <CTAButton
                  href="/case-studies/skinclarity-club"
                  variant="secondary"
                  size="lg"
                >
                  {t('cta.secondary')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
