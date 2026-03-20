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
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { TrustMetrics } from '@/components/common/TrustMetrics'
import { PricingTiers } from '@/components/common/PricingTiers'
import { Link } from '@/i18n/navigation'
import { Handshake } from 'lucide-react'
import { VoiceDemoSection } from '@/components/voice/VoiceDemoSection'
import { VoiceDemoFAB } from '@/components/voice/VoiceDemoFAB'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'voice-agents', path: '/voice-agents' })
}

const USE_CASE_KEYS = [
  'outbound_leads',
  'appointment_setting',
  'inbound_service',
  'post_sale',
] as const

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

const VOICE_TRUST_METRICS = [
  { value: '99.9%', label: 'Uptime', description: 'Enterprise-grade availability' },
  { value: '10,000+', label: 'Calls Completed', description: 'Across all voice agents' },
  { value: '95%+', label: 'Accuracy', description: 'Intent recognition rate' },
]

const VOICE_PRICING_TIERS = [
  {
    name: 'Starter',
    price: '\u20AC997',
    period: '/mo',
    features: ['200 minutes/mo', 'Email support', 'Setup in 1-2 weeks'],
  },
  {
    name: 'Growth',
    price: '\u20AC1,497',
    period: '/mo',
    features: ['500 minutes/mo', 'Analytics dashboard', 'Setup in 2-3 weeks'],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'Scale',
    price: '\u20AC1,997',
    period: '/mo',
    features: ['1,000 minutes/mo', 'Priority support', 'Monthly strategy call'],
  },
]

export default async function VoiceAgentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'voice-agents' })

  return (
    <PageShell>
      {/* JSON-LD Structured Data */}
      <ServiceJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        serviceType="AI Voice Agent Solutions"
        path="/voice-agents"
        locale={locale}
      />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/voice-agents"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Voice Agents', path: '/voice-agents' },
        ]}
        locale={locale}
      />
      <FaqJsonLd
        items={FAQ_KEYS.map((key) => ({
          question: t(`faq.items.${key}.question`),
          answer: t(`faq.items.${key}.answer`),
        }))}
      />

      {/* 1. Hero */}
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
            <CTAButton href="/contact" size="lg">
              {t('hero.cta_primary')}
            </CTAButton>
            <CTAButton href="#use-cases" variant="secondary" size="lg">
              {t('hero.cta_secondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* 2. Quick Answer Block */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-8">
        <QuickAnswerBlock definition={t('quick_answer')} />
      </div>

      {/* 3. Use Cases */}
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

      {/* 4. Voice Demo (dynamic, client-only) */}
      <section aria-labelledby="voice-demo" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="voice-demo">Try Our Voice Agent Live</SectionHeading>
          <div className="mt-10">
            <VoiceDemoSection />
          </div>
        </div>
      </section>

      {/* 5. Trust Metrics */}
      <section aria-labelledby="trust-metrics" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="trust-metrics" className="text-center mb-10">
            Trusted Performance
          </SectionHeading>
          <TrustMetrics metrics={VOICE_TRUST_METRICS} />
        </div>
      </section>

      {/* 6. Partnership (enhanced with GlassCard) */}
      <section aria-labelledby="partnership" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="partnership">{t('sections.partnership_heading')}</SectionHeading>
          <ScrollReveal>
            <GlassCard className="mt-8 border-l-4 border-l-accent-system">
              <div className="flex gap-6 items-start">
                <Handshake className="w-10 h-10 text-accent-system flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold font-display text-text-primary mb-2">
                    {t('sections.partnership_heading')}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {t('partnership.description')}
                  </p>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* 7. Pricing Tiers */}
      <section aria-labelledby="pricing" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="pricing" className="text-center mb-4">
            Voice Agent Packages
          </SectionHeading>
          <p className="text-lg text-text-secondary text-center mb-10">
            Choose the plan that fits your call volume
          </p>
          <PricingTiers tiers={VOICE_PRICING_TIERS} ctaHref="/contact" ctaLabel="Get Started" />
          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-accent-system hover:underline font-medium text-sm"
            >
              View all packages
            </Link>
          </div>
        </div>
      </section>

      {/* 8. FAQ */}
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

      {/* 9. Related Services */}
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

      {/* 10. CTA */}
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

      {/* Floating FAB -- appears when voice demo scrolls out of viewport */}
      <VoiceDemoFAB />
    </PageShell>
  )
}
