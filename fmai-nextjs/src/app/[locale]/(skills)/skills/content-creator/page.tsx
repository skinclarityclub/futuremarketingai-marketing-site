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
import { BookingCTA } from '@/components/booking/BookingCTA'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { VisionTimeline } from '@/components/marketing-machine/VisionTimeline'
import { FeatureShowcase } from '@/components/marketing-machine/FeatureShowcase'
import { SocialProof } from '@/components/common/SocialProof'
import { ProductMedia } from '@/components/common/ProductMedia'

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
            <BookingCTA size="lg">
              {t('cta.button')}
            </BookingCTA>
            <BookingCTA size="lg" variant="secondary">
              Book a Strategy Call
            </BookingCTA>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20 px-6 lg:px-12">
        <SocialProof
          quote={t('social_proof.quote')}
          author={t('social_proof.author')}
          role={t('social_proof.role')}
          company={t('social_proof.company')}
        />
      </section>

      {/* Vision Timeline */}
      <VisionTimeline />

      {/* AI Feature Showcase */}
      <section aria-labelledby="ai-features" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="ai-features">{t('showcase.heading')}</SectionHeading>
          <div className="mt-10">
            <FeatureShowcase
              features={[
                {
                  title: t('showcase.items.seo_research.title'),
                  description: t('showcase.items.seo_research.description'),
                  icon: '\uD83D\uDD0D',
                },
                {
                  title: t('showcase.items.content_generation.title'),
                  description: t('showcase.items.content_generation.description'),
                  icon: '\u270D\uFE0F',
                },
                {
                  title: t('showcase.items.visual_creation.title'),
                  description: t('showcase.items.visual_creation.description'),
                  icon: '\uD83C\uDFA8',
                },
                {
                  title: t('showcase.items.multi_channel.title'),
                  description: t('showcase.items.multi_channel.description'),
                  icon: '\uD83D\uDE80',
                },
                {
                  title: t('showcase.items.performance_analytics.title'),
                  description: t('showcase.items.performance_analytics.description'),
                  icon: '\uD83D\uDCCA',
                },
                {
                  title: t('showcase.items.ai_orchestrator.title'),
                  description: t('showcase.items.ai_orchestrator.description'),
                  icon: '\uD83E\uDDE0',
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

      {/* Task Demo -- Clyde in Action */}
      <section aria-labelledby="task-demo" className="py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="task-demo">{t('task_demo.heading')}</SectionHeading>
          <div className="mt-10 space-y-6">
            <GlassCard className="border-accent-system/30">
              <div className="flex items-start gap-3">
                <span className="text-sm font-mono text-accent-system">You:</span>
                <p className="text-text-primary font-medium">{t('task_demo.command')}</p>
              </div>
            </GlassCard>
            <GlassCard>
              <div className="flex items-start gap-3">
                <span className="text-sm font-mono text-[#00FF88]">Clyde:</span>
                <div>
                  <p className="text-text-primary font-semibold mb-2">
                    {t('task_demo.result_title')}
                  </p>
                  <p className="text-text-secondary">{t('task_demo.result_description')}</p>
                </div>
              </div>
            </GlassCard>
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

      {/* Product Media */}
      <section className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="product-demo">{t('product_media.heading')}</SectionHeading>
          <div className="mt-10">
            <ProductMedia
              title={t('product_media.title')}
              description={t('product_media.description')}
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section aria-labelledby="pricing" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading id="pricing">{t('pricing.heading')}</SectionHeading>
          <p className="text-lg text-text-secondary mt-4 mb-8">{t('pricing.description')}</p>
          <CTAButton href={t('pricing.cta_link')} size="lg">
            {t('pricing.cta')}
          </CTAButton>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <BookingCTA size="lg">
                {t('cta.button')}
              </BookingCTA>
              <BookingCTA size="lg" variant="secondary">
                Book a Strategy Call
              </BookingCTA>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
