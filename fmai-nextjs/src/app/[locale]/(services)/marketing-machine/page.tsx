import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { QuickAnswerBlock } from '@/components/ui/QuickAnswerBlock'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { CTAButton } from '@/components/ui/CTAButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { Link } from '@/i18n/navigation'
import { SocialProof } from '@/components/common/SocialProof'
import { FeatureShowcase } from '@/components/marketing-machine/FeatureShowcase'
import { ProductMedia } from '@/components/common/ProductMedia'
import { PricingTiers } from '@/components/common/PricingTiers'

const VisionTimeline = dynamic(
  () =>
    import('@/components/marketing-machine/VisionTimeline').then((m) => ({
      default: m.VisionTimeline,
    })),
  { ssr: false }
)

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
    namespace: 'marketing-machine',
    path: '/marketing-machine',
  })
}

const FEATURE_KEYS = [
  'research',
  'content',
  'publishing',
  'analytics',
  'ads',
  'orchestrator',
] as const

const FEATURE_ICONS: Record<string, string> = {
  research: '\uD83D\uDD0D',
  content: '\u270D\uFE0F',
  publishing: '\uD83D\uDE80',
  analytics: '\uD83D\uDCCA',
  ads: '\uD83D\uDCB0',
  orchestrator: '\uD83E\uDDE0',
}

const HOW_IT_WORKS_STEPS = [
  { key: 'step1', number: '01' },
  { key: 'step2', number: '02' },
  { key: 'step3', number: '03' },
] as const

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const

const PRICING_TIERS = [
  {
    name: 'Starter',
    price: '\u20AC997',
    period: '/mo',
    features: ['3 AI modules active', '40 posts/month', 'Email support', 'Monthly reporting'],
    highlighted: false,
  },
  {
    name: 'Marketing Machine',
    price: '\u20AC1,997',
    period: '/mo',
    features: [
      'All 6 AI modules',
      '160 posts/month',
      'Priority support',
      'Weekly strategy calls',
      'Custom integrations',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Scale',
    price: '\u20AC3,497',
    period: '/mo',
    features: [
      'All 6 AI modules',
      '300+ posts/month',
      'Dedicated account manager',
      'Daily optimization',
      'Multi-brand support',
      'Custom reporting',
    ],
    highlighted: false,
  },
]

export default async function MarketingMachinePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'marketing-machine' })

  const features = FEATURE_KEYS.map((key) => ({
    title: t(`features.${key}.title`),
    description: t(`features.${key}.description`),
    icon: FEATURE_ICONS[key] || '\u2728',
  }))

  return (
    <PageShell>
      {/* JSON-LD Structured Data */}
      <ServiceJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        serviceType="AI Marketing Platform"
        path="/marketing-machine"
        locale={locale}
      />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/marketing-machine"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Marketing Machine', path: '/marketing-machine' },
        ]}
        locale={locale}
      />
      <FaqJsonLd
        items={FAQ_KEYS.map((key) => ({
          question: t(`faq.items.${key}.question`),
          answer: t(`faq.items.${key}.answer`),
        }))}
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
            {t('hero.title')} <span className="text-accent-system">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/contact" size="lg">
              {t('hero.cta_primary')}
            </CTAButton>
            <CTAButton href="/pricing" variant="secondary" size="lg">
              {t('hero.cta_secondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Quick Answer Block */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-8">
        <QuickAnswerBlock definition={t('quick_answer')} />
      </div>

      {/* Social Proof */}
      <section aria-labelledby="social-proof" className="py-12 px-6 lg:px-12">
        <SocialProof
          quote="Since deploying the Marketing Machine, our content output increased 10x while our team stayed the same size."
          author="Early Adopter"
          role="Marketing Director"
          company="Agency Partner"
        />
      </section>

      {/* Feature Showcase - 6 AI Modules */}
      <section aria-labelledby="features" className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <SectionHeading id="features">{t('sections.features_heading')}</SectionHeading>
          <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-12">
            {t('features.subtitle')}
          </p>
          <FeatureShowcase features={features} />
        </div>
      </section>

      {/* Vision Timeline - 3 eras */}
      <section aria-labelledby="vision-timeline" className="bg-bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <div className="pt-20 px-6 lg:px-12">
            <SectionHeading id="vision-timeline">The Evolution of Marketing</SectionHeading>
            <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-4">
              From manual processes to fully autonomous AI marketing employees.
            </p>
          </div>
          <VisionTimeline />
        </div>
      </section>

      {/* Product Media */}
      <section aria-labelledby="product-media" className="py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="product-media">See the Marketing Machine in Action</SectionHeading>
          <ProductMedia title="Marketing Machine Demo" />
        </div>
      </section>

      {/* Pricing Tiers */}
      <section aria-labelledby="pricing" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-6xl mx-auto">
          <SectionHeading id="pricing">Choose Your Plan</SectionHeading>
          <p className="text-lg text-text-secondary text-center max-w-2xl mx-auto mb-12">
            Start with what you need, scale as you grow.
          </p>
          <PricingTiers tiers={PRICING_TIERS} ctaHref="/contact" ctaLabel="Get Started" />
        </div>
      </section>

      {/* How Does the Marketing Machine Get Built? */}
      <section aria-labelledby="how-it-works" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="how-it-works">{t('sections.how_it_works_heading')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <ScrollReveal key={step.key} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold font-mono text-accent-system/30 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {t(`howItWorks.${step.key}.title`)}
                  </h3>
                  <p className="text-text-secondary">{t(`howItWorks.${step.key}.description`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section aria-labelledby="faq" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="faq" className="text-center mb-10">
            {t('sections.faq_heading')}
          </SectionHeading>
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
        </div>
      </section>

      {/* Related Services */}
      <section aria-labelledby="related-services" className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <h2
            id="related-services"
            className="text-2xl font-bold font-display text-text-primary mb-8 text-center"
          >
            {t('sections.related_heading')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/automations"
              className="block border border-border-primary bg-white/[0.02] rounded-xl p-6 text-center transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {t('related.automations_title')}
              </h3>
              <p className="text-sm text-text-secondary">{t('related.automations_description')}</p>
            </Link>
            <Link
              href="/chatbots"
              className="block border border-border-primary bg-white/[0.02] rounded-xl p-6 text-center transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {t('related.chatbots_title')}
              </h3>
              <p className="text-sm text-text-secondary">{t('related.chatbots_description')}</p>
            </Link>
            <Link
              href="/voice-agents"
              className="block border border-border-primary bg-white/[0.02] rounded-xl p-6 text-center transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {t('related.voice_agents_title')}
              </h3>
              <p className="text-sm text-text-secondary">{t('related.voice_agents_description')}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
            <CTAButton href="/contact" size="lg">
              {t('cta.button')}
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
