import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CTAButton } from '../components/common'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { ProductMedia } from '../components/common/ProductMedia'
import type { LucideIcon } from 'lucide-react'
import {
  Zap,
  Clock,
  Link2,
  TrendingUp,
  Users,
  Mail,
  Share2,
  FileText,
  UserPlus,
  RefreshCw,
  CheckCircle,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { GATEWAY_TIERS, formatGatewayPrice } from '../lib/gateway-pricing'

// Key arrays and icon mappings at module level (icons are not translatable)
const PAIN_POINT_KEYS = ['manual_work', 'disconnected_tools', 'scaling'] as const
const PAIN_POINT_ICONS: Record<string, LucideIcon> = {
  manual_work: Clock,
  disconnected_tools: Link2,
  scaling: TrendingUp,
}

const AUTOMATION_KEYS = [
  'lead_qualification',
  'email_sequences',
  'social_media',
  'invoicing',
  'onboarding',
  'data_sync',
] as const
const AUTOMATION_ICONS: Record<string, LucideIcon> = {
  lead_qualification: Users,
  email_sequences: Mail,
  social_media: Share2,
  invoicing: FileText,
  onboarding: UserPlus,
  data_sync: RefreshCw,
}

const PROCESS_STEP_KEYS = ['audit', 'build', 'optimize'] as const
const PROCESS_STEP_NUMBERS = ['01', '02', '03'] as const

const AUTOMATION_FEATURES: Record<string, string[]> = {
  starter: ['5 custom workflows', 'Email support', 'Setup in 1-2 weeks'],
  growth: ['10 custom workflows', 'Analytics dashboard', 'Setup in 2-3 weeks'],
  scale: ['20 custom workflows', 'Priority support', 'Monthly strategy call'],
}

const FAQ_KEYS = ['integrations', 'delivery', 'technical', 'breaks', 'multi_tool'] as const

export const AutomationsPage: React.FC = () => {
  const { t } = useTranslation(['automations', 'common'])

  // Build translated data arrays inside component
  const painPoints = PAIN_POINT_KEYS.map((key) => ({
    icon: PAIN_POINT_ICONS[key],
    title: t(`automations:pain_points.${key}.title`),
    description: t(`automations:pain_points.${key}.description`),
  }))

  const automations = AUTOMATION_KEYS.map((key) => ({
    icon: AUTOMATION_ICONS[key],
    label: t(`automations:what_we_automate.items.${key}`),
  }))

  const processSteps = PROCESS_STEP_KEYS.map((key, i) => ({
    step: PROCESS_STEP_NUMBERS[i],
    title: t(`automations:process.steps.${key}.title`),
    description: t(`automations:process.steps.${key}.description`),
  }))

  const pricingTiers = GATEWAY_TIERS.map((tier) => {
    const limit = tier.limits.find((l) => l.service === 'automations')
    return {
      name: tier.name,
      price: `${formatGatewayPrice(tier.price)}/mo`,
      setupFee: `Setup from ${formatGatewayPrice(tier.setupFee)}`,
      description: tier.description,
      limit: limit ? `${limit.value} ${limit.unit}` : '',
      features: AUTOMATION_FEATURES[tier.id] || [],
      highlighted: !!tier.highlighted,
      badge: tier.badge,
    }
  })

  const faqs = FAQ_KEYS.map((key) => ({
    q: t(`automations:faq.items.${key}.q`),
    a: t(`automations:faq.items.${key}.a`),
  }))

  return (
    <>
      <SimpleHeader />
      <SEOHead
        title="AI Workflow Automation Services | Future AI"
        description="We build custom AI workflows that eliminate manual work — lead routing, CRM enrichment, email sequences, and more. Delivered in 1-2 weeks."
        keywords={[
          'AI automation',
          'workflow automation',
          'n8n',
          'Make',
          'business process automation',
          'AI workflows',
        ]}
        canonical="https://future-marketing.ai/automations"
      />

      <div className="min-h-screen bg-bg-deep">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
                <Zap className="w-4 h-4 text-accent-system" />
                <span className="text-sm font-medium text-text-secondary">
                  {t('automations:hero.badge')}
                </span>
              </div>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              {t('automations:hero.title')}
            </h1>

            <p
              className="text-xl text-text-muted leading-relaxed max-w-3xl mx-auto mb-10"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              {t('automations:hero.description')}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <CTAButton size="lg" calendly arrow>
                {t('automations:hero.cta_primary')}
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="#what-we-automate">
                {t('automations:hero.cta_secondary')}
              </CTAButton>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((point, i) => (
                <motion.div
                  key={i}
                  className="card-gradient-border card-tilt bg-white/[0.02] border border-border-primary rounded-card p-8 text-center transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <point.icon className="w-10 h-10 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold font-display text-text-primary mb-2">
                    {point.title}
                  </h3>
                  <p className="text-text-muted">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Automate */}
        <section id="what-we-automate" className="py-16 px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                {t('automations:what_we_automate.title')}
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                {t('automations:what_we_automate.subtitle')}
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {automations.map((item, i) => (
                <motion.div
                  key={i}
                  className="card-gradient-border card-tilt flex items-center gap-4 bg-white/[0.02] border border-border-primary rounded-card p-6 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <item.icon className="w-8 h-8 text-accent-system flex-shrink-0" />
                  <span className="text-text-primary font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
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
                {t('automations:process.title')}
              </h2>
            </motion.div>

            <div className="space-y-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  className="card-gradient-border card-tilt flex gap-6 bg-white/[0.02] border border-border-primary rounded-card p-8 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-black text-accent-system/30 flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold font-display text-text-primary mb-2">
                      {step.title}
                    </h3>
                    <p className="text-text-muted">{step.description}</p>
                  </div>
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
                Automation Packages
              </h2>
              <p className="text-lg text-text-secondary">
                Gateway pricing — one subscription, full-stack AI
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier, i) => (
                <motion.div
                  key={i}
                  className={`relative bg-white/[0.02] border rounded-card p-8 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${
                    tier.highlighted
                      ? 'border-accent-system/50 shadow-glow-sm overflow-visible'
                      : 'card-gradient-border border-border-primary'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {tier.highlighted && tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-system text-bg-deep text-xs font-semibold rounded-sm">
                      {tier.badge}
                    </div>
                  )}
                  <h3 className="text-xl font-bold font-display text-text-primary mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-sm text-text-muted mb-2">{tier.description}</p>
                  {tier.limit && (
                    <p className="text-sm text-accent-system font-medium mb-4">{tier.limit}</p>
                  )}
                  <div className="text-2xl font-bold text-text-primary mb-1">{tier.price}</div>
                  <p className="text-xs text-text-muted mb-6">{tier.setupFee}</p>
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
                    Get Started
                  </CTAButton>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 text-accent-system hover:underline font-medium"
              >
                View all packages <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-12 px-12">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="grid grid-cols-3 gap-6 text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-text-primary">
                  {t('automations:trust_metrics.hours_saved.value')}
                </div>
                <div className="text-sm text-text-muted">
                  {t('automations:trust_metrics.hours_saved.label')}
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-text-primary">
                  {t('automations:trust_metrics.delivery_time.value')}
                </div>
                <div className="text-sm text-text-muted">
                  {t('automations:trust_metrics.delivery_time.label')}
                </div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-text-primary">
                  {t('automations:trust_metrics.success_rate.value')}
                </div>
                <div className="text-sm text-text-muted">
                  {t('automations:trust_metrics.success_rate.label')}
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
                {t('automations:faq.title')}
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
              videoSrc="/media/placeholder-automations.mp4"
              posterSrc="/media/placeholder-automations-poster.webp"
              alt="Automations demo"
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
                {t('automations:final_cta.title')}
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('automations:final_cta.description')}
              </p>
              <CTAButton size="lg" calendly arrow>
                {t('automations:final_cta.button')}
              </CTAButton>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AutomationsPage
