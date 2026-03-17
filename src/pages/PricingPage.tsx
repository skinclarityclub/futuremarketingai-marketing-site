/**
 * Pricing Page - Gateway Service Tiers
 *
 * Shows Starter / Growth / Scale pricing for managed AI services.
 * SEO-optimized for "AI service pricing" and "managed AI automation" keywords.
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  CheckCircle,
  ArrowRight,
  MessageSquare,
  Phone,
  Zap,
  Clock,
  Shield,
  Calendar,
} from 'lucide-react'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CTAButton } from '../components/common/CTAButton'
import { ScrollReveal } from '../components/common/ScrollReveal'
import { GATEWAY_TIERS, PRICING_FAQS, formatGatewayPrice } from '../lib/gateway-pricing'
import type { GatewayTierId } from '../lib/gateway-pricing'

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const SERVICE_ICONS: Record<string, React.ElementType> = {
  chatbot: MessageSquare,
  voice: Phone,
  automations: Zap,
}

const TIER_FEATURES: Record<GatewayTierId, string[]> = {
  starter: [
    'Choose 1 service',
    'Hosting & infrastructure included',
    'Monthly updates & maintenance',
    'Email support',
    'Setup in 1-2 weeks',
  ],
  growth: [
    'Choose 2 services',
    'Analytics dashboard',
    'Monthly performance report',
    'Chat & email support',
    'Setup in 2-3 weeks',
  ],
  scale: [
    'All 3 services included',
    'Priority support (<4h response)',
    'Monthly strategy call',
    'Advanced analytics',
    'Setup in 2-4 weeks',
  ],
}

const SERVICE_LABELS: Record<number, string> = {
  1: '1 service',
  2: '2 services',
  3: 'All 3 services',
}

const TRUST_METRICS = [
  { label: '98% Uptime', icon: Shield },
  { label: '<2h Response', icon: Clock },
  { label: 'Month-to-Month', icon: Calendar },
]

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const PricingPage: React.FC = () => {
  return (
    <>
      <SimpleHeader />

      <SEOHead
        title="AI Service Pricing — Managed Chatbot, Voice & Automation Plans | Future AI"
        description="Transparent pricing for managed AI services. Choose from Starter, Growth, or Scale plans — chatbots, voice agents, and workflow automations with no long-term contracts."
        keywords={[
          'AI service pricing',
          'managed AI automation',
          'AI chatbot pricing',
          'voice agent pricing',
          'workflow automation cost',
          'AI marketing services',
        ]}
        canonical="https://futuremarketingai.com/pricing"
      />

      <div className="min-h-screen bg-bg-deep">
        {/* ---------------------------------------------------------------- */}
        {/* Hero Section                                                     */}
        {/* ---------------------------------------------------------------- */}
        <section className="relative pt-32 pb-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              AI That Works For You — Choose Your Plan
            </motion.h1>
            <motion.p
              className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              Managed AI services tailored to your business. Pick the services you need, scale when
              you are ready — no long-term contracts.
            </motion.p>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* 3-Column Pricing Grid                                            */}
        {/* ---------------------------------------------------------------- */}
        <section className="py-16 px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            {GATEWAY_TIERS.map((tier, i) => {
              const features = TIER_FEATURES[tier.id]
              const isHighlighted = tier.highlighted === true

              return (
                <motion.div
                  key={tier.id}
                  className={`relative bg-white/[0.02] rounded-card p-8 flex flex-col transition-all duration-500 hover:bg-white/[0.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${
                    isHighlighted
                      ? 'border border-accent-system/50 shadow-glow-sm overflow-visible'
                      : 'card-gradient-border border border-border-primary'
                  }`}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  viewport={{ once: true }}
                >
                  {/* Badge */}
                  {tier.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-accent-system text-bg-deep text-sm font-semibold rounded-full">
                        {tier.badge}
                      </span>
                    </div>
                  )}

                  {/* Tier Name */}
                  <h3 className="text-2xl font-bold font-display text-text-primary mb-2">
                    {tier.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-1">
                    <span className="font-mono text-4xl font-bold text-text-primary">
                      {formatGatewayPrice(tier.price)}
                    </span>
                    <span className="text-text-muted text-lg">/mo</span>
                  </div>

                  {/* Setup fee */}
                  <p className="text-sm text-text-muted mb-4">
                    Setup from {formatGatewayPrice(tier.setupFee)}
                  </p>

                  {/* Service count */}
                  <p className="text-accent-system font-semibold mb-4">
                    {SERVICE_LABELS[tier.includedServices]}
                  </p>

                  {/* Description */}
                  <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                    {tier.description}
                  </p>

                  {/* Service Limits */}
                  <div className="space-y-2 mb-6">
                    {tier.limits.map((limit) => {
                      const Icon = SERVICE_ICONS[limit.service]
                      return (
                        <div
                          key={limit.service}
                          className="flex items-center gap-2 text-sm text-text-muted"
                        >
                          {Icon && <Icon className="w-4 h-4 text-text-muted/60" />}
                          <span>
                            {limit.value.toLocaleString()} {limit.unit}
                          </span>
                        </div>
                      )
                    })}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-border-primary mb-6" />

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-text-secondary"
                      >
                        <CheckCircle className="w-4 h-4 text-accent-system flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <CTAButton calendly arrow className="w-full justify-center">
                    Get Started
                  </CTAButton>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Divider                                                          */}
        {/* ---------------------------------------------------------------- */}
        <div className="max-w-7xl mx-auto px-12">
          <div className="border-t border-border-primary" />
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Marketing Machine Teaser                                         */}
        {/* ---------------------------------------------------------------- */}
        <ScrollReveal>
          <section className="py-16 px-12">
            <div className="max-w-3xl mx-auto">
              <div className="card-gradient-border bg-white/[0.02] border border-accent-human/30 rounded-card p-8 text-center transition-all duration-500 hover:bg-white/[0.03]">
                <h2 className="text-2xl font-bold font-display text-text-primary mb-3">
                  For Businesses That Want Everything
                </h2>
                <p className="text-text-secondary mb-6 leading-relaxed">
                  The AI Marketing Machine is our flagship platform — a fully autonomous marketing
                  system that combines all three services with content generation, analytics, and
                  strategic intelligence. Built for companies ready to hand marketing to AI
                  entirely.
                </p>
                <Link
                  to="/marketing-machine"
                  className="inline-flex items-center gap-2 text-accent-human font-semibold hover:underline"
                >
                  Learn about the Marketing Machine
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ---------------------------------------------------------------- */}
        {/* FAQ Section                                                      */}
        {/* ---------------------------------------------------------------- */}
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
                Frequently Asked Questions
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-4">
              {PRICING_FAQS.map((faq, i) => (
                <motion.details
                  key={i}
                  className="group card-gradient-border bg-white/[0.02] border border-border-primary rounded-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <summary className="px-6 py-4 cursor-pointer text-text-primary font-medium list-none flex justify-between items-center">
                    {faq.question}
                    <span className="text-accent-system group-open:rotate-45 transition-transform text-xl">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-text-muted">{faq.answer}</div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------------- */}
        {/* Trust Metrics                                                    */}
        {/* ---------------------------------------------------------------- */}
        <ScrollReveal>
          <section className="py-12 px-12">
            <div className="max-w-4xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {TRUST_METRICS.map((metric, i) => {
                  const Icon = metric.icon
                  return (
                    <motion.div
                      key={metric.label}
                      className="flex flex-col items-center gap-2 py-6 card-gradient-border bg-white/[0.02] border border-border-primary rounded-card"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Icon className="w-6 h-6 text-accent-system" />
                      <span className="text-lg font-semibold text-text-primary">
                        {metric.label}
                      </span>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* ---------------------------------------------------------------- */}
        {/* Final CTA                                                        */}
        {/* ---------------------------------------------------------------- */}
        <ScrollReveal>
          <section className="py-16 px-12">
            <div className="max-w-7xl mx-auto text-center">
              <div className="card-gradient-border rounded-card bg-white/[0.02] border border-border-primary p-12 transition-all duration-500 hover:bg-white/[0.03] hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
                <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
                  Ready to Put AI to Work?
                </h2>
                <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                  Book a free strategy call and we will map out exactly which services will drive
                  the most impact for your business.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <CTAButton calendly arrow size="lg">
                    Book a Strategy Call
                  </CTAButton>
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-bg-elevated border border-border-primary text-text-primary font-semibold rounded-btn hover:bg-bg-surface transition-all"
                  >
                    Contact Us
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </>
  )
}

export default PricingPage
