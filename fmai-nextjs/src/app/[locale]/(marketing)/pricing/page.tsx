import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

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

const TIER_KEYS = ['starter', 'growth', 'scale'] as const
const FEATURE_COUNT = 5

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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {TIER_KEYS.map((tier, index) => {
              const isGrowth = tier === 'growth'

              return (
                <ScrollReveal key={tier} delay={index * 0.15}>
                  <GlassCard highlighted={isGrowth} className="relative flex flex-col">
                    {/* Badge */}
                    {isGrowth && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="px-4 py-1 bg-accent-system text-bg-deep text-sm font-semibold rounded-full">
                          {t('tiers.growth.badge')}
                        </span>
                      </div>
                    )}

                    {/* Tier Name */}
                    <h3 className="text-2xl font-bold font-display text-text-primary mb-2">
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
                      {Array.from({ length: FEATURE_COUNT }).map((_, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                          <svg
                            className="w-4 h-4 text-accent-system flex-shrink-0 mt-0.5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                          {t(`tiers.${tier}.features_${i}`)}
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <CTAButton
                      href="/contact"
                      variant={isGrowth ? 'primary' : 'secondary'}
                      className="w-full justify-center"
                    >
                      {t('cta.primary_button')}
                    </CTAButton>
                  </GlassCard>
                </ScrollReveal>
              )
            })}
          </div>
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
