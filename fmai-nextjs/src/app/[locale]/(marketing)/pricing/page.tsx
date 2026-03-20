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

const TIER_KEYS = ['founding', 'starter', 'growth', 'agency'] as const

const TIER_CONFIG: Record<
  (typeof TIER_KEYS)[number],
  { featureCount: number; highlighted: boolean; hasBadge: boolean; ctaHref: string }
> = {
  founding: { featureCount: 6, highlighted: true, hasBadge: true, ctaHref: '/founding-member' },
  starter: { featureCount: 5, highlighted: false, hasBadge: false, ctaHref: '/contact' },
  growth: { featureCount: 6, highlighted: true, hasBadge: true, ctaHref: '/contact' },
  agency: { featureCount: 7, highlighted: false, hasBadge: false, ctaHref: '/contact' },
}

const ADDON_KEYS = [
  'content_creator',
  'voice_agent',
  'lead_qualifier',
  'social_media',
  'ad_creator',
  'reporting',
] as const

const ADDON_HREFS: Record<(typeof ADDON_KEYS)[number], string> = {
  content_creator: '/skills/content-creator',
  voice_agent: '/skills/voice-agent',
  lead_qualifier: '/skills/lead-qualifier',
  social_media: '/skills/social-media',
  ad_creator: '/skills/ad-creator',
  reporting: '/skills/reporting',
}

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
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="pricing-tiers">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
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
                        <span
                          className={`px-4 py-1 text-sm font-semibold rounded-full whitespace-nowrap ${
                            tier === 'founding'
                              ? 'bg-[#F5A623] text-bg-deep'
                              : 'bg-accent-system text-bg-deep'
                          }`}
                        >
                          {t(`tiers.${tier}.badge`)}
                        </span>
                      </div>
                    )}

                    {/* Tier Name */}
                    <h3 className="text-2xl font-bold font-display text-text-primary mb-2 mt-2">
                      {t(`tiers.${tier}.name`)}
                    </h3>

                    {/* Price */}
                    <div className="mb-4">
                      <span className="font-mono text-4xl font-bold text-text-primary">
                        &euro;{t(`tiers.${tier}.price`)}
                      </span>
                      <span className="text-text-muted text-lg">/mo</span>
                    </div>

                    {/* Service count */}
                    <p className="text-accent-system font-semibold mb-4">
                      {t(`tiers.${tier}.service_count`)}
                    </p>

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
                    <CTAButton
                      href={config.ctaHref}
                      variant={config.highlighted ? 'primary' : 'secondary'}
                      className="w-full justify-center"
                    >
                      {tier === 'founding' ? t('founding_cta.button') : t('cta.primary_button')}
                    </CTAButton>
                  </GlassCard>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* Skill Add-ons Section */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="skill-addons">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="skill-addons">{t('addons.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mt-4">{t('addons.description')}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {ADDON_KEYS.map((key) => (
              <ScrollReveal key={key}>
                <Link
                  href={ADDON_HREFS[key]}
                  className="flex items-center gap-3 border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-xl px-5 py-4 transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5 cursor-pointer group"
                >
                  <svg
                    className="w-5 h-5 text-accent-system shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">
                    {t(`addons.items.${key}`)}
                  </span>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Founding Member CTA Banner */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="founding-cta">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard highlighted className="text-center p-10">
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
