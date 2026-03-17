import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CTAButton } from '../components/common'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { ProductMedia } from '../components/common/ProductMedia'
import { VoiceDemoSection } from '../components/voice/VoiceDemoSection'
import { VoiceDemoFAB } from '../components/voice/VoiceDemoFAB'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { Phone, Calendar, Headphones, RefreshCw, CheckCircle, Handshake } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const USE_CASE_KEYS = [
  'outbound_leads',
  'appointment_setting',
  'inbound_service',
  'post_sale',
] as const
const USE_CASE_ICONS: Record<string, LucideIcon> = {
  outbound_leads: Phone,
  appointment_setting: Calendar,
  inbound_service: Headphones,
  post_sale: RefreshCw,
}

const PRICING_TIER_KEYS = ['basic', 'standard', 'ongoing'] as const
const PRICING_TIER_CONFIG: Record<string, { highlighted: boolean }> = {
  basic: { highlighted: false },
  standard: { highlighted: true },
  ongoing: { highlighted: false },
}
const FAQ_KEYS = ['voice_quality', 'objections', 'languages', 'crm'] as const

export const VoiceAgentsPage: React.FC = () => {
  const { t } = useTranslation(['voice-agents', 'common'])
  const [demoRef, isDemoVisible] = useIntersectionObserver<HTMLElement>({
    threshold: 0.1,
  })

  const useCases = USE_CASE_KEYS.map((key) => ({
    icon: USE_CASE_ICONS[key],
    title: t(`voice-agents:use_cases.items.${key}.title`),
    description: t(`voice-agents:use_cases.items.${key}.description`),
  }))

  const pricingTiers = PRICING_TIER_KEYS.map((key) => ({
    name: t(`voice-agents:pricing.tiers.${key}.name`),
    price: t(`voice-agents:pricing.tiers.${key}.price`),
    description: t(`voice-agents:pricing.tiers.${key}.description`),
    features: t(`voice-agents:pricing.tiers.${key}.features`, {
      returnObjects: true,
    }) as string[],
    highlighted: PRICING_TIER_CONFIG[key].highlighted,
  }))

  const faqs = FAQ_KEYS.map((key) => ({
    q: t(`voice-agents:faq.items.${key}.q`),
    a: t(`voice-agents:faq.items.${key}.a`),
  }))

  return (
    <>
      <SimpleHeader />
      <SEOHead
        title="AI Voice Agent Services | Future AI"
        description="AI voice agents that call prospects, qualify leads, and book appointments — at scale, without a sales team. Built in partnership with specialized voice AI experts."
        keywords={[
          'AI voice agent',
          'voice AI',
          'automated calling',
          'lead qualification',
          'appointment setting',
          'AI sales',
        ]}
        canonical="https://future-marketing.ai/voice-agents"
      />

      <div className="min-h-screen bg-bg-deep">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
                <Phone className="w-4 h-4 text-accent-system" />
                <span className="text-sm font-medium text-text-secondary">
                  {t('voice-agents:hero.badge')}
                </span>
              </div>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              {t('voice-agents:hero.title')}
            </h1>

            <p
              className="text-xl text-text-muted leading-relaxed max-w-3xl mx-auto mb-10"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              {t('voice-agents:hero.description')}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <CTAButton size="lg" calendly arrow>
                {t('voice-agents:hero.cta_primary')}
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="#use-cases">
                {t('voice-agents:hero.cta_secondary')}
              </CTAButton>
            </div>
          </div>
        </section>

        {/* Interactive Demo */}
        <VoiceDemoSection sectionRef={demoRef} />

        {/* Use Cases */}
        <section id="use-cases" className="py-16 px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('voice-agents:use_cases.title')}
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, i) => (
                <motion.div
                  key={i}
                  className="card-gradient-border card-tilt bg-white/[0.02] border border-border-primary rounded-card p-8 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <useCase.icon className="w-10 h-10 text-accent-system mb-4" />
                  <h3 className="text-xl font-semibold font-display text-text-primary mb-2">
                    {useCase.title}
                  </h3>
                  <p className="text-text-muted">{useCase.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('voice-agents:pricing.title')}
              </h2>
              <p className="text-lg text-text-secondary">{t('voice-agents:pricing.subtitle')}</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier, i) => (
                <motion.div
                  key={i}
                  className={`card-gradient-border relative bg-white/[0.02] border rounded-card p-8 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${
                    tier.highlighted
                      ? 'border-accent-system/50 shadow-glow-sm'
                      : 'border-border-primary'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-system text-bg-deep text-xs font-semibold rounded-sm">
                      {t('voice-agents:pricing.most_popular')}
                    </div>
                  )}
                  <h3 className="text-xl font-bold font-display text-text-primary mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">{tier.description}</p>
                  <div className="text-2xl font-bold text-text-primary mb-6">{tier.price}</div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-text-muted">
                        <CheckCircle className="w-4 h-4 text-accent-system flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <CTAButton
                    size="md"
                    calendly
                    variant={tier.highlighted ? 'primary' : 'secondary'}
                    className="w-full justify-center"
                  >
                    {t('voice-agents:pricing.cta')}
                  </CTAButton>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Note */}
        <section className="py-12 px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="card-gradient-border bg-white/[0.02] border border-border-primary rounded-card p-8 flex gap-6 items-start transition-all duration-500 hover:bg-white/[0.03]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Handshake className="w-10 h-10 text-accent-system flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold font-display text-text-primary mb-2">
                  {t('voice-agents:partnership.title')}
                </h3>
                <p className="text-text-muted">{t('voice-agents:partnership.description')}</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Metrics */}
        <section className="py-12 px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-3 gap-8 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="text-3xl font-bold font-display text-text-primary mb-1">
                  {t('voice-agents:trust_metrics.availability.value')}
                </div>
                <div className="text-sm text-text-muted">
                  {t('voice-agents:trust_metrics.availability.label')}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold font-display text-text-primary mb-1">
                  {t('voice-agents:trust_metrics.calls.value')}
                </div>
                <div className="text-sm text-text-muted">
                  {t('voice-agents:trust_metrics.calls.label')}
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold font-display text-text-primary mb-1">
                  {t('voice-agents:trust_metrics.accuracy.value')}
                </div>
                <div className="text-sm text-text-muted">
                  {t('voice-agents:trust_metrics.accuracy.label')}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold font-display text-text-primary mb-4">
                {t('voice-agents:faq.title')}
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, i) => (
                <motion.details
                  key={i}
                  className="group card-gradient-border bg-white/[0.02] border border-border-primary rounded-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <summary className="px-6 py-4 cursor-pointer text-text-primary font-medium list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-accent-system group-open:rotate-45 transition-transform text-xl">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-text-muted">{faq.a}</div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* Product Demo Media */}
        <ScrollReveal>
          <div className="max-w-7xl mx-auto px-12 py-16">
            {/* TODO: Replace with real demo video/screenshot */}
            <ProductMedia
              videoSrc="/media/placeholder-voice-agents.mp4"
              posterSrc="/media/placeholder-voice-agents-poster.webp"
              alt="Voice Agents demo"
              className="max-w-4xl mx-auto"
            />
          </div>
        </ScrollReveal>

        {/* Final CTA */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.div
              className="card-gradient-border bg-accent-system/5 border border-border-primary rounded-card p-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('voice-agents:final_cta.title')}
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('voice-agents:final_cta.description')}
              </p>
              <CTAButton size="lg" calendly arrow>
                {t('voice-agents:final_cta.button')}
              </CTAButton>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Floating FAB — appears when demo section scrolls out */}
      <VoiceDemoFAB visible={!isDemoVisible} />
    </>
  )
}

export default VoiceAgentsPage
