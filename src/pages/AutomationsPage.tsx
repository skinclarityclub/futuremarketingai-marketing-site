import React from 'react'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CTAButton } from '../components/common'
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
} from 'lucide-react'

const painPoints = [
  {
    icon: Clock,
    title: 'Hours Lost to Manual Work',
    description: 'Your team spends hours on work AI can do in minutes',
  },
  {
    icon: Link2,
    title: 'Disconnected Tools',
    description: "Your tools don't talk to each other — data gets lost between apps",
  },
  {
    icon: TrendingUp,
    title: 'Scaling Means Hiring',
    description: 'Scaling means hiring more people, not working smarter',
  },
]

const automations = [
  { icon: Users, label: 'Lead qualification & CRM enrichment' },
  { icon: Mail, label: 'Email sequences & follow-ups' },
  { icon: Share2, label: 'Social media scheduling & content' },
  { icon: FileText, label: 'Invoice & billing workflows' },
  { icon: UserPlus, label: 'Customer onboarding flows' },
  { icon: RefreshCw, label: 'Data sync between platforms' },
]

const processSteps = [
  {
    step: '01',
    title: 'Free Audit',
    description:
      'We map your manual processes and identify automation opportunities. 30 minutes, no obligation.',
  },
  {
    step: '02',
    title: 'Build',
    description: '1-2 weeks delivery, fully documented workflows. We build, test, and hand over.',
  },
  {
    step: '03',
    title: 'Optimize',
    description:
      'Optional ongoing retainer for new workflows, optimization, and dedicated support.',
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    price: '€1,000 – €2,500',
    description: 'Perfect for getting started',
    features: ['1-3 workflows', 'Full documentation', '7-day delivery', 'Email support'],
    cta: 'Get Started',
    highlighted: false,
  },
  {
    name: 'Growth',
    price: '€2,500 – €5,000',
    description: 'For teams ready to scale',
    features: ['5-10 workflows', 'End-to-end testing', 'Priority support', '14-day delivery'],
    cta: 'Most Popular',
    highlighted: true,
  },
  {
    name: 'Retainer',
    price: '€2,000 – €5,000/mo',
    description: 'Ongoing automation partner',
    features: [
      'Unlimited workflow builds',
      'Continuous optimization',
      'Dedicated support',
      'Monthly strategy call',
    ],
    cta: "Let's Talk",
    highlighted: false,
  },
]

const faqs = [
  {
    q: 'What tools do you integrate with?',
    a: 'We work with n8n, Make, Zapier, and custom API integrations. We connect any tool that has an API — CRMs, email platforms, payment systems, and more.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Most projects are delivered within 1-2 weeks. Simple workflows can be ready in days, while more complex multi-step automations take up to 14 days.',
  },
  {
    q: 'Do I need technical knowledge?',
    a: 'No. We handle all the technical work. You get fully documented workflows with clear instructions for your team.',
  },
  {
    q: 'What happens if something breaks?',
    a: 'All workflows include error handling and monitoring. Retainer clients get priority support. One-time projects include 7 days of post-delivery support.',
  },
  {
    q: 'Can you automate processes across multiple tools?',
    a: 'Absolutely. Most of our workflows connect 3-5 different tools. We specialize in making your entire stack work together seamlessly.',
  },
]

export const AutomationsPage: React.FC = () => {
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
                  Delivered in 1-2 Weeks
                </span>
              </div>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              Automate Your Business With AI
            </h1>

            <p
              className="text-xl text-text-muted leading-relaxed max-w-3xl mx-auto mb-10"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              We build custom AI workflows that eliminate manual work — lead routing, CRM
              enrichment, email sequences, and more. Powered by n8n, Make, and custom integrations.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <CTAButton size="lg" calendly arrow>
                Get a Free Automation Audit
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="#what-we-automate">
                See Examples
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
                  className="card-gradient-border bg-white/[0.02] border border-border-primary rounded-card p-8 text-center transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
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
                What We Automate
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                From lead generation to customer onboarding — we automate the workflows that slow
                your team down.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {automations.map((item, i) => (
                <motion.div
                  key={i}
                  className="card-gradient-border flex items-center gap-4 bg-white/[0.02] border border-border-primary rounded-card p-6 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
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
                How It Works
              </h2>
            </motion.div>

            <div className="space-y-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  className="card-gradient-border flex gap-6 bg-white/[0.02] border border-border-primary rounded-card p-8 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
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
                Pricing
              </h2>
              <p className="text-lg text-text-secondary">Transparent pricing. No surprises.</p>
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
                      Most Popular
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
                    {tier.cta}
                  </CTAButton>
                </motion.div>
              ))}
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
                  15-30 hrs
                </div>
                <div className="text-sm text-text-muted">saved per week</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-text-primary">
                  1-2 weeks
                </div>
                <div className="text-sm text-text-muted">delivery time</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-text-primary">
                  2.5x
                </div>
                <div className="text-sm text-text-muted">success rate with AI partner</div>
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
                Frequently Asked Questions
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
                Book a Free 30-min Automation Audit
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                We'll map your manual processes and tell you exactly what AI can automate — and how
                much time and money you'll save.
              </p>
              <CTAButton size="lg" calendly arrow>
                Book Free Audit
              </CTAButton>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default AutomationsPage
