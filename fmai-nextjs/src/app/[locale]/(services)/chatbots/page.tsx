import type { Metadata } from 'next'
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
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { DemoPlayground } from '@/components/chatbot/DemoPlayground'
import { TrustMetrics } from '@/components/common/TrustMetrics'
import { PricingTiers } from '@/components/common/PricingTiers'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { Link } from '@/i18n/navigation'
import MultiPlatformShowcase from '@/components/chatbot/MultiPlatformShowcase'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'chatbots', path: '/chatbots' })
}

const USE_CASE_KEYS = [
  'customer_service',
  'lead_qualification',
  'appointment_booking',
  'faq_automation',
] as const

const PROCESS_STEPS = [
  { key: 'discovery', number: '01' },
  { key: 'build', number: '02' },
  { key: 'optimize', number: '03' },
] as const

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6'] as const

export default async function ChatbotsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'chatbots' })

  return (
    <PageShell>
      {/* JSON-LD Structured Data */}
      <ServiceJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        serviceType="AI Chatbot Solutions"
        path="/chatbots"
        locale={locale}
      />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/chatbots"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Chatbots', path: '/chatbots' },
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
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="#use-cases" size="lg">
              {t('hero.cta_primary')}
            </CTAButton>
            <CTAButton href="/contact" variant="secondary" size="lg">
              {t('hero.cta_secondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Quick Answer Block */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-8">
        <QuickAnswerBlock definition={t('quick_answer')} />
      </div>

      {/* What Can an AI Chatbot Do for Your Business? */}
      <section aria-labelledby="use-cases" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="use-cases">{t('sections.use_cases_heading')}</SectionHeading>
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

      {/* Demo Playground -- client island */}
      <section
        id="demo"
        aria-labelledby="demo-heading"
        className="py-20 px-6 lg:px-12 bg-bg-surface/30"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeading id="demo-heading">{t('demo.title')}</SectionHeading>
          <DemoPlayground />
        </div>
      </section>

      {/* Multi-Platform Showcase */}
      <section aria-labelledby="multi-platform" className="py-20 px-6 lg:px-12">
        <MultiPlatformShowcase />
      </section>

      {/* Trust Metrics */}
      <section aria-labelledby="trust-metrics" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <TrustMetrics
            metrics={[
              {
                value: '50,000+',
                label: 'Inquiries Processed',
                description: 'Monthly across all clients',
              },
              {
                value: '24/7',
                label: 'Always Available',
                description: 'No downtime, no sick days',
              },
              {
                value: '15+',
                label: 'CRM Integrations',
                description: 'HubSpot, Salesforce, Pipedrive...',
              },
            ]}
          />
        </div>
      </section>

      {/* Pricing Tiers */}
      <section aria-labelledby="pricing" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="pricing">{t('sections.pricing_heading')}</SectionHeading>
          <p className="text-lg text-text-secondary text-center mb-10 -mt-4">
            {t('sections.pricing_subtitle')}
          </p>
          <PricingTiers
            tiers={[
              {
                name: 'Starter',
                price: '\u20AC497',
                period: '/mo',
                features: [
                  '1,000 conversations/mo',
                  'Email support',
                  'Setup in 1-2 weeks',
                  '1 platform',
                  'Basic analytics',
                ],
                highlighted: false,
              },
              {
                name: 'Growth',
                price: '\u20AC997',
                period: '/mo',
                badge: 'Most Popular',
                features: [
                  '3,000 conversations/mo',
                  'Analytics dashboard',
                  'Setup in 2-3 weeks',
                  '2 platforms',
                  'Priority support',
                ],
                highlighted: true,
              },
              {
                name: 'Scale',
                price: '\u20AC1,997',
                period: '/mo',
                features: [
                  '5,000 conversations/mo',
                  'Priority support',
                  'Monthly strategy call',
                  '3+ platforms',
                  'Custom integrations',
                ],
                highlighted: false,
              },
            ]}
            ctaHref="/contact"
            ctaLabel="Get Started"
          />
        </div>
      </section>

      {/* How Does a Chatbot Get Deployed? */}
      <section aria-labelledby="process" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="process">{t('sections.process_heading')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {PROCESS_STEPS.map((step, index) => (
              <ScrollReveal key={step.key} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold font-mono text-accent-system/30 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {t(`process.steps.${step.key}.title`)}
                  </h3>
                  <p className="text-text-secondary">
                    {t(`process.steps.${step.key}.description`)}
                  </p>
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
              href="/voice-agents"
              className="block border border-border-primary bg-white/[0.02] rounded-xl p-6 text-center transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {t('related.voice_agents_title')}
              </h3>
              <p className="text-sm text-text-secondary">{t('related.voice_agents_description')}</p>
            </Link>
            <Link
              href="/marketing-machine"
              className="block border border-border-primary bg-white/[0.02] rounded-xl p-6 text-center transition-all duration-300 hover:bg-white/[0.04] hover:-translate-y-0.5"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-1">
                {t('related.marketing_machine_title')}
              </h3>
              <p className="text-sm text-text-secondary">
                {t('related.marketing_machine_description')}
              </p>
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
