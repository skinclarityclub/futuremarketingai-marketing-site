import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
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
import { Link } from '@/i18n/navigation'

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

const TIER_KEYS = ['growth', 'professional', 'enterprise'] as const

const TIER_CONFIG: Record<
  (typeof TIER_KEYS)[number],
  { featureCount: number; highlighted: boolean; hasBadge: boolean; ctaHref: string; isEnterprise: boolean }
> = {
  growth: { featureCount: 7, highlighted: false, hasBadge: false, ctaHref: '/contact', isEnterprise: false },
  professional: { featureCount: 8, highlighted: true, hasBadge: true, ctaHref: '/contact', isEnterprise: false },
  enterprise: { featureCount: 8, highlighted: false, hasBadge: true, ctaHref: '/contact', isEnterprise: true },
}

const CREDIT_PACK_KEYS = ['boost', 'scale', 'unlimited'] as const

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4'] as const

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

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-8">
            {t('hero.description')}
          </p>

          {/* Premium Badges */}
          <div className="flex flex-wrap justify-center gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-system/10 border border-accent-system/20 rounded-full text-sm font-medium text-accent-system">
              {t('badges.nvidia')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#00FF88]/10 border border-[#00FF88]/20 rounded-full text-sm font-medium text-[#00FF88]">
              {t('badges.gdpr')}
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#A855F7]/10 border border-[#A855F7]/20 rounded-full text-sm font-medium text-[#A855F7]">
              {t('badges.eu_ai_act')}
            </span>
          </div>
        </div>
      </section>

      {/* Pricing Tiers — 3 columns */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="pricing-tiers">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TIER_KEYS.map((tier, index) => {
              const config = TIER_CONFIG[tier]

              return (
                <ScrollReveal key={tier} delay={index * 0.1}>
                  <GlassCard
                    highlighted={config.highlighted}
                    className="relative flex flex-col h-full"
                  >
                    {/* Badge */}
                    {config.hasBadge && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 text-sm font-semibold rounded-full whitespace-nowrap bg-accent-system text-bg-deep">
                          {t(`tiers.${tier}.badge`)}
                        </span>
                      </div>
                    )}

                    {/* Tier Name */}
                    <h3 className="text-2xl font-bold font-display text-text-primary mb-2 mt-2">
                      {t(`tiers.${tier}.name`)}
                    </h3>

                    {/* Price */}
                    <div className="mb-2">
                      <span className="font-mono text-4xl font-bold text-text-primary">
                        &euro;{t(`tiers.${tier}.price`)}
                      </span>
                      <span className="text-text-muted text-lg">/mo</span>
                    </div>

                    {/* Credits & Workspaces */}
                    <div className="flex flex-col gap-1 mb-2">
                      <p className="text-accent-system font-semibold">
                        {t(`tiers.${tier}.service_count`)}
                      </p>
                      <p className="text-text-secondary text-sm">
                        {t(`tiers.${tier}.credits_included`)} {t('credits_label')}
                      </p>
                    </div>

                    {/* Onboarding Fee */}
                    <p className="text-text-muted text-xs mb-4">
                      {t('onboarding_label')}: &euro;{t(`tiers.${tier}.onboarding`)}
                    </p>

                    {/* All Skills Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-full mb-4 w-fit">
                      <svg
                        className="w-4 h-4 text-accent-system flex-shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-xs font-semibold text-accent-system">
                        {t('all_skills_badge')}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                      {t(`tiers.${tier}.description`)}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-border-primary mb-6" />

                    {/* Features */}
                    <ul className="space-y-3 mb-8 flex-1">
                      {Array.from({ length: config.featureCount }).map((_, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <svg
                            className="w-4 h-4 text-accent-system flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                            aria-hidden="true"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {t(`tiers.${tier}.features_${i}`)}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    {config.isEnterprise ? (
                      <CTAButton
                        href="/contact"
                        variant="secondary"
                        className="w-full justify-center"
                      >
                        {t('contact_sales')}
                      </CTAButton>
                    ) : (
                      <CTAButton
                        href={config.ctaHref}
                        variant={config.highlighted ? 'primary' : 'secondary'}
                        className="w-full justify-center"
                      >
                        {t('cta.primary_button')}
                      </CTAButton>
                    )}
                  </GlassCard>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Founding Member CTA Banner */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="founding-cta">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard highlighted className="text-center p-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-full mb-6">
                <span className="text-sm font-medium text-[#F5A623]">{t('founding_cta.spots')}</span>
              </div>
              <h2
                id="founding-cta"
                className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-4"
              >
                {t('founding_cta.title')}
              </h2>
              <p className="text-lg text-text-secondary mb-6 max-w-2xl mx-auto">
                {t('founding_cta.description')}
              </p>
              <CTAButton href="/founding-member" size="lg">
                {t('founding_cta.button')}
              </CTAButton>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Credit Packs Section */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="credit-packs">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="credit-packs">{t('credit_packs.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mt-4">{t('credit_packs.description')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {CREDIT_PACK_KEYS.map((key) => (
              <ScrollReveal key={key}>
                <div className="flex flex-col items-center gap-3 border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-xl px-6 py-6 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 text-center">
                  <span className="text-lg font-bold font-display text-text-primary">
                    {t(`credit_packs.items.${key}.name`)}
                  </span>
                  <span className="text-accent-system font-semibold">
                    {t(`credit_packs.items.${key}.credits`)} credits
                  </span>
                  <span className="font-mono text-2xl font-bold text-text-primary">
                    &euro;{t(`credit_packs.items.${key}.price`)}
                  </span>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
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

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="pricing-cta">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <GlassCard className="p-12">
              <SectionHeading id="pricing-cta" className="mb-4">
                {t('cta.title')}
              </SectionHeading>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/contact" size="lg">
                  {t('cta.primary_button')}
                </CTAButton>
                <CTAButton href="/contact" variant="secondary" size="lg">
                  {t('cta.secondary_button')}
                </CTAButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
