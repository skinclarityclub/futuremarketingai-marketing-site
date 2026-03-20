import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { VisionTimeline } from '@/components/marketing-machine/VisionTimeline'
import { FeatureShowcase } from '@/components/marketing-machine/FeatureShowcase'
import { SocialProof } from '@/components/common/SocialProof'
import { PricingTiers } from '@/components/common/PricingTiers'
import { TrustMetrics } from '@/components/common/TrustMetrics'

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
    namespace: 'skills-social-media',
    path: '/skills/social-media',
  })
}

const FEATURE_KEYS = ['scheduling', 'analytics', 'creation', 'monitoring'] as const
const STEP_KEYS = ['connect', 'plan', 'publish'] as const
const USE_CASE_KEYS = ['agencies', 'brands'] as const

export default async function SocialMediaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'skills-social-media' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/skills/social-media"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Social Media', path: '/skills/social-media' },
        ]}
        locale={locale}
      />

      {/* Hero */}
      <section aria-labelledby="hero" className="relative pt-20 pb-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-system/10 border border-accent-system/20 rounded-full mb-6">
            <span className="text-sm font-medium text-accent-system">{t('hero.badge')}</span>
          </div>
          <h1
            id="hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/pricing" size="lg">
              {t('cta.button')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 lg:px-12">
        <SocialProof
          quote="FMai's Social Media skill manages all our client accounts. We scaled from 5 to 20 clients without adding headcount."
          author="Agency Owner"
          role="Digital Marketing Agency"
          company="Rotterdam"
        />
      </section>

      {/* Use Cases */}
      <section aria-labelledby="use-cases" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="use-cases">{t('use_cases.heading')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {USE_CASE_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`use_cases.items.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary">{t(`use_cases.items.${key}.description`)}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Timeline */}
      <VisionTimeline />

      {/* AI Feature Showcase */}
      <section aria-labelledby="ai-features" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="ai-features">The AI Social Media Engine</SectionHeading>
          <div className="mt-10">
            <FeatureShowcase
              features={[
                {
                  title: 'Smart Scheduling',
                  description:
                    'AI-optimized posting times across all platforms for maximum reach and engagement.',
                  icon: '\uD83D\uDCC5',
                },
                {
                  title: 'Analytics Dashboard',
                  description:
                    'Real-time performance tracking across all social channels with actionable insights.',
                  icon: '\uD83D\uDCCA',
                },
                {
                  title: 'Engagement Automation',
                  description:
                    'Auto-respond to comments, DMs, and mentions with on-brand, context-aware replies.',
                  icon: '\uD83D\uDCAC',
                },
                {
                  title: 'Content Repurposing',
                  description:
                    'Automatically adapt content for each platform — blog to carousel, video to reel, post to story.',
                  icon: '\uD83D\uDD04',
                },
                {
                  title: 'Trend Monitoring',
                  description:
                    "Stay ahead with AI-powered trend detection and content suggestions based on what's working.",
                  icon: '\uD83D\uDD25',
                },
                {
                  title: 'Competitor Tracking',
                  description:
                    'Monitor competitor activity, benchmark performance, and identify content gaps.',
                  icon: '\uD83D\uDD0D',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="features">{t('features.heading')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {FEATURE_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary">{t(`features.items.${key}.description`)}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section aria-labelledby="how-it-works" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="how-it-works">{t('how_it_works.heading')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {STEP_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold font-mono text-accent-system/30 mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {t(`how_it_works.steps.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary">
                    {t(`how_it_works.steps.${key}.description`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section aria-labelledby="pricing" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="pricing">Pricing</SectionHeading>
          <div className="mt-10">
            <PricingTiers
              tiers={[
                {
                  name: 'Starter',
                  price: '\u20AC497',
                  period: '/mo',
                  features: [
                    '3 platforms',
                    '60 posts/mo',
                    'Basic scheduling',
                    'Performance reports',
                  ],
                },
                {
                  name: 'Growth',
                  price: '\u20AC997',
                  period: '/mo',
                  highlighted: true,
                  badge: 'Most Popular',
                  features: [
                    '6 platforms',
                    '150 posts/mo',
                    'AI-optimized scheduling',
                    'Engagement automation',
                    'Competitor tracking',
                  ],
                },
                {
                  name: 'Scale',
                  price: '\u20AC1,997',
                  period: '/mo',
                  features: [
                    'Unlimited platforms',
                    'Unlimited posts',
                    'Full automation suite',
                    'Custom workflows',
                    'Dedicated support',
                  ],
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section aria-labelledby="trust" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="trust">Results That Speak</SectionHeading>
          <div className="mt-10">
            <TrustMetrics
              metrics={[
                {
                  value: '2x',
                  label: 'Engagement',
                  description: 'Average increase in social engagement',
                },
                {
                  value: '15h',
                  label: 'Saved Per Week',
                  description: 'Time saved on social media management',
                },
                { value: '6+', label: 'Platforms', description: 'Managed from a single dashboard' },
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
            <CTAButton href="/pricing" size="lg">
              {t('cta.button')}
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
