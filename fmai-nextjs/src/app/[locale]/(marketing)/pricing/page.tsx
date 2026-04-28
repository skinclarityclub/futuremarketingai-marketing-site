import type { Metadata } from 'next'
import { setRequestLocale, getTranslations, getMessages } from 'next-intl/server'
import { NextIntlClientProvider } from 'next-intl'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { pick } from '@/lib/i18n-pick'
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
import { TierPricingCard } from '@/components/pricing/TierPricingCard'
import { FoundingCounter } from '@/components/founding/FoundingCounter'
import { LeadMagnetCTA } from '@/components/conversion/LeadMagnetCTA'
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

// Founding-first ordering. Founding stays anchored at €997 lifetime; Growth /
// Pro / Enterprise are workspace-priced (live slider in the card itself).
// Per 2026-04-28 the "lockedUntilFoundingFull" gating callout was retired:
// workspace-pricing gives Founding a clean math advantage for portfolios of
// 3+ brands (€997 fixed vs €499×3 = €1,497), so the routing is implicit.
const TIER_KEYS = ['founding', 'growth', 'professional', 'enterprise'] as const

const TIER_CONFIG: Record<
  (typeof TIER_KEYS)[number],
  { featureCount: number; highlighted: boolean; badge?: 'founding' }
> = {
  founding: { featureCount: 10, highlighted: true, badge: 'founding' },
  growth: { featureCount: 8, highlighted: false },
  professional: { featureCount: 8, highlighted: false },
  enterprise: { featureCount: 7, highlighted: false },
}

const CREDIT_PACK_KEYS = ['miniTopUp', 'boost', 'scale', 'unlimited'] as const
const SKILL_PACK_KEYS = ['voiceMinutes', 'videoAds', 'reels', 'blogPower'] as const
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'pricing' })

  // TierPricingCard is a Client Component (it owns the workspace slider state)
  // and reads the pricing namespace via useTranslations(). The root locale
  // layout's NextIntlClientProvider only ships GLOBAL_CLIENT_NAMESPACES, so we
  // scope an extra provider here to hand the pricing namespace to that subtree
  // without enlarging the global client payload.
  const messages = await getMessages()
  const pricingMessages = pick(messages, ['pricing'] as const)

  return (
    <PageShell showStickyCta>
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
          <FoundingCounter />
        </div>
      </section>

      {/* Tier Cards — Founding fixed, others workspace-sliders */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="pricing-tiers">
        <div className="max-w-7xl mx-auto">
          <h2 id="pricing-tiers" className="sr-only">
            Pricing tiers
          </h2>
          <NextIntlClientProvider locale={locale} messages={pricingMessages}>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
              {TIER_KEYS.map((tier, index) => {
                const config = TIER_CONFIG[tier]
                return (
                  <ScrollReveal key={tier} delay={index * 0.05}>
                    <TierPricingCard
                      tierLabel={tier}
                      highlighted={config.highlighted}
                      badge={config.badge}
                      featureCount={config.featureCount}
                      locale={locale}
                      foundingCounter={
                        tier === 'founding'
                          ? { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL }
                          : undefined
                      }
                    />
                  </ScrollReveal>
                )
              })}
            </div>
          </NextIntlClientProvider>
          <p className="mt-6 max-w-3xl mx-auto text-xs text-text-muted text-center leading-relaxed">
            {t('tiers.rateDisclosure')}
          </p>
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

      {/* FAQ — promoted directly after the decision surface (tier cards + matrix) */}
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

      {/* Why prices visible */}
      <section className="py-12 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="visibility">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading id="visibility">{t('visibility.title')}</SectionHeading>
          <p className="mt-4 text-text-secondary leading-relaxed">{t('visibility.body')}</p>
        </div>
      </section>

      {/* Lead magnet — Phase 15-04 mid-funnel capture */}
      <section className="py-12 px-6 lg:px-12" aria-label="AI Readiness Checklist download">
        <div className="max-w-md mx-auto">
          <LeadMagnetCTA source="pricing" variant="sidebar" />
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
                  <h3 className="text-base font-semibold text-text-primary mb-1">
                    {t(`skillPacks.items.${key}.name`)}
                  </h3>
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
