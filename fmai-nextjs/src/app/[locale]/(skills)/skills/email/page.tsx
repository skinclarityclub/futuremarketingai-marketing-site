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
  return generatePageMetadata({ locale, namespace: 'skills-email', path: '/skills/email' })
}

const USE_CASE_KEYS = [
  'automated_campaigns',
  'smart_followups',
  'newsletter_generation',
  'inbox_management',
] as const

export default async function EmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'skills-email' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/skills/email"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Email', path: '/skills/email' },
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
            <CTAButton href="/skills/chatbot" size="lg">
              {t('cta.button')}
            </CTAButton>
            <CTAButton href="/contact" size="lg" variant="secondary">
              Book a Strategy Call
            </CTAButton>
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

      {/* Trust Metrics */}
      <section aria-labelledby="trust" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="trust">{t('trust.heading')}</SectionHeading>
          <div className="mt-10">
            <TrustMetrics
              metrics={[
                {
                  value: t('trust.metrics.open_rates.value'),
                  label: t('trust.metrics.open_rates.label'),
                  description: t('trust.metrics.open_rates.description'),
                },
                {
                  value: t('trust.metrics.replies.value'),
                  label: t('trust.metrics.replies.label'),
                  description: t('trust.metrics.replies.description'),
                },
                {
                  value: t('trust.metrics.sending.value'),
                  label: t('trust.metrics.sending.label'),
                  description: t('trust.metrics.sending.description'),
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/skills/chatbot" size="lg">
                {t('cta.button')}
              </CTAButton>
              <CTAButton href="/contact" size="lg" variant="secondary">
                Book a Strategy Call
              </CTAButton>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
