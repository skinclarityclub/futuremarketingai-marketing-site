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
import { ProductMedia } from '@/components/common/ProductMedia'
import { PricingTiers } from '@/components/common/PricingTiers'

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
    namespace: 'skills-content-creator',
    path: '/skills/content-creator',
  })
}

const FEATURE_KEYS = ['blog', 'social', 'newsletters', 'repurposing'] as const
const STEP_KEYS = ['connect', 'generate', 'review'] as const
const USE_CASE_KEYS = ['agencies', 'ecommerce'] as const

export default async function ContentCreatorPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'skills-content-creator' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/skills/content-creator"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Content Creator', path: '/skills/content-creator' },
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
          <SectionHeading id="ai-features">The AI Content Engine</SectionHeading>
          <div className="mt-10">
            <FeatureShowcase
              features={[
                {
                  title: 'SEO Research',
                  description:
                    'Automatically identifies high-value keywords and content gaps in your niche.',
                  icon: '\uD83D\uDD0D',
                },
                {
                  title: 'Content Generation',
                  description:
                    'Writes blog posts, social captions, and newsletters in your brand voice.',
                  icon: '\u270D\uFE0F',
                },
                {
                  title: 'Visual Creation',
                  description: 'Generates on-brand images, carousels, and video thumbnails.',
                  icon: '\uD83C\uDFA8',
                },
                {
                  title: 'Multi-Channel Publishing',
                  description:
                    'Publishes to WordPress, LinkedIn, Instagram, and more — automatically.',
                  icon: '\uD83D\uDE80',
                },
                {
                  title: 'Performance Analytics',
                  description: 'Tracks engagement, conversions, and ROI across all channels.',
                  icon: '\uD83D\uDCCA',
                },
                {
                  title: 'AI Orchestrator',
                  description:
                    'Coordinates all modules, learns from results, and continuously improves output.',
                  icon: '\uD83E\uDDE0',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Product Media */}
      <section className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="product-demo">See It in Action</SectionHeading>
          <div className="mt-10">
            <ProductMedia
              title="Content Creator Demo"
              description="Watch how the AI Content Creator researches, writes, and publishes a complete blog post in under 5 minutes."
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 lg:px-12">
        <SocialProof
          quote="We replaced a 3-person content team with FMai's Content Creator. Output tripled and quality actually improved."
          author="Marketing Director"
          role="E-commerce Agency"
          company="Amsterdam"
        />
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
                    '20 blog posts/mo',
                    '60 social posts/mo',
                    '1 brand voice',
                    'WordPress integration',
                  ],
                },
                {
                  name: 'Growth',
                  price: '\u20AC997',
                  period: '/mo',
                  highlighted: true,
                  badge: 'Most Popular',
                  features: [
                    '50 blog posts/mo',
                    '150 social posts/mo',
                    '3 brand voices',
                    'Multi-platform publishing',
                    'SEO optimization',
                  ],
                },
                {
                  name: 'Scale',
                  price: '\u20AC1,997',
                  period: '/mo',
                  features: [
                    'Unlimited content',
                    'Unlimited brand voices',
                    'All platforms',
                    'Custom workflows',
                    'Dedicated support',
                  ],
                },
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
