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
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { SkillsTierMatrix } from '@/components/pricing/SkillsTierMatrix'
import { PricingExperience } from '@/components/pricing/PricingExperience'
import { FoundingCounter } from '@/components/founding/FoundingCounter'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import {
  FOUNDING_SPOTS_TAKEN,
  FOUNDING_SPOTS_TOTAL,
  MAX_PARTNERS_PER_YEAR,
} from '@/lib/constants'
import { ArrowRight, ChevronDown } from 'lucide-react'

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
// Pro / Enterprise are workspace-priced (live shared slider above the grid).
const TIER_FEATURE_COUNTS = {
  founding: 10,
  growth: 8,
  professional: 8,
  enterprise: 7,
} as const

const CREDIT_PACK_KEYS = ['miniTopUp', 'boost', 'scale', 'unlimited'] as const
const SKILL_PACK_KEYS = ['voiceMinutes', 'videoAds', 'reels', 'blogPower'] as const
const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'] as const

// Mid-range slider start: 5 workspaces = top of Growth / bottom of Pro,
// shows tier-transition mechanic on first load without needing a drag.
const INITIAL_WORKSPACES = 5

export default async function PricingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'pricing' })

  // PricingExperience + its slider live as a single subtree that consumes
  // the pricing namespace via useTranslations(). Global client payload only
  // ships GLOBAL_CLIENT_NAMESPACES, so we scope a local provider here.
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
        path="/pricing"
        locale={locale}
      />
      <PricingJsonLd />
      <Breadcrumbs path="/pricing" locale={locale} />

      {/* Hero */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12" aria-labelledby="pricing-hero">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
          <h1
            id="pricing-hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
          <FoundingCounter />
        </div>
      </section>

      {/* Tier Cards — shared workspace-slider drives all four cards */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="pricing-tiers">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="text-center space-y-3">
            <EyebrowLabel>{t('tiers.eyebrow')}</EyebrowLabel>
            <h2
              id="pricing-tiers"
              className="text-3xl md:text-4xl font-bold font-display text-text-primary"
            >
              {t('tiers.title')}
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">{t('tiers.subtitle')}</p>
          </div>

          <NextIntlClientProvider locale={locale} messages={pricingMessages}>
            <PricingExperience
              locale={locale}
              initialWorkspaces={INITIAL_WORKSPACES}
              foundingCounter={{ taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL }}
              tierFeatureCounts={TIER_FEATURE_COUNTS}
            />
          </NextIntlClientProvider>
          <p className="mt-6 max-w-3xl mx-auto text-xs text-text-muted text-center leading-relaxed">
            {t('tiers.rateDisclosure')}
          </p>
        </div>
      </section>

      {/* Visibility — trust-frame placed BEFORE matrix & FAQ */}
      <section className="py-12 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="visibility">
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <EyebrowLabel>{t('visibility.eyebrow')}</EyebrowLabel>
          <SectionHeading id="visibility">{t('visibility.title')}</SectionHeading>
          <p className="text-text-secondary leading-relaxed">{t('visibility.body')}</p>
        </div>
      </section>

      {/* Skills × Tier Matrix — kept visible (trust-anchor that Visibility promises) */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="pricing-matrix">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <EyebrowLabel>{t('matrix.eyebrow')}</EyebrowLabel>
            <SectionHeading id="pricing-matrix">{t('matrix.title')}</SectionHeading>
            <p className="text-text-secondary max-w-2xl mx-auto">{t('matrix.subtitle')}</p>
          </div>
          <ScrollReveal>
            <SkillsTierMatrix locale={locale} />
          </ScrollReveal>
          <p className="text-xs text-text-muted mt-4 text-center max-w-3xl mx-auto">
            {t('matrix.legend')}
          </p>
        </div>
      </section>

      {/* Credit Packs */}
      <section className="py-16 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="credit-packs">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <EyebrowLabel>{t('creditPacks.eyebrow')}</EyebrowLabel>
            <SectionHeading id="credit-packs">{t('creditPacks.title')}</SectionHeading>
            <p className="text-text-secondary">{t('creditPacks.description')}</p>
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

      {/* Skill-specific Packs — progressive disclosure (add-ons, not core decision data) */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="skill-packs">
        <div className="max-w-5xl mx-auto">
          <details className="group rounded-2xl border border-border-primary bg-white/[0.02] backdrop-blur-sm">
            <summary className="flex items-center justify-between cursor-pointer list-none px-6 py-5 transition-colors hover:bg-white/[0.03] rounded-2xl">
              <div className="text-left space-y-1">
                <p className="font-mono uppercase tracking-[0.18em] text-xs text-accent-system">
                  {t('skillPacks.eyebrow')}
                </p>
                <h2 id="skill-packs" className="text-2xl md:text-3xl font-display font-bold text-text-primary">
                  {t('skillPacks.title')}
                </h2>
              </div>
              <ChevronDown
                className="w-5 h-5 text-text-muted transition-transform duration-300 group-open:rotate-180 shrink-0 ml-4"
                aria-hidden
              />
            </summary>
            <div className="px-6 pb-6 pt-2">
              <p className="text-text-secondary mb-6 max-w-2xl">{t('skillPacks.description')}</p>
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
          </details>
        </div>
      </section>

      {/* FAQ — objection-handling op moment-of-decision, vlak voor final CTA */}
      <section aria-labelledby="pricing-faq" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 space-y-3">
            <EyebrowLabel>{t('faq.eyebrow')}</EyebrowLabel>
            <SectionHeading id="pricing-faq">{t('faq.title')}</SectionHeading>
          </div>
          <ScrollReveal>
            <FaqAccordion
              items={FAQ_KEYS.map((key) => ({
                key,
                question: t(`faq.items.${key}.question`),
                answer: t(`faq.items.${key}.answer`),
              }))}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA — single primary button (dual-CTA pattern removed per homepage walkthrough) */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="pricing-cta">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <GlassCard className="p-12">
              <EyebrowLabel className="mb-3">{t('cta.eyebrow')}</EyebrowLabel>
              <SectionHeading id="pricing-cta" className="mb-4">
                {t('cta.title')}
              </SectionHeading>
              <p className="text-lg text-text-secondary mb-8">
                {t('cta.description', { maxPartners: MAX_PARTNERS_PER_YEAR })}
              </p>
              <CTAButton href="/apply" size="lg">
                {t('cta.primary')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </CTAButton>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
