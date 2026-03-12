import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CalendlyModal } from '../components/common/CalendlyModal'
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
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

const CALENDLY_URL =
  'https://calendly.com/futureai/strategy-call?background_color=111520&text_color=e8ecf4&primary_color=00D4AA'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true as const },
}

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
  const [isCalendlyOpen, setIsCalendlyOpen] = useState(false)

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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero Section */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-100">Delivered in 1-2 Weeks</span>
              </div>
            </motion.div>

            <motion.h1 className="text-4xl md:text-6xl font-bold text-white mb-6" {...fadeInUp}>
              Automate Your Business With AI
            </motion.h1>

            <motion.p
              className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-10"
              {...fadeInUp}
            >
              We build custom AI workflows that eliminate manual work — lead routing, CRM
              enrichment, email sequences, and more. Powered by n8n, Make, and custom integrations.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" {...fadeInUp}>
              <button
                onClick={() => setIsCalendlyOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Get a Free Automation Audit
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#what-we-automate"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all"
              >
                See Examples
              </a>
            </motion.div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((point, i) => (
                <motion.div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <point.icon className="w-10 h-10 text-red-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">{point.title}</h3>
                  <p className="text-blue-100/80">{point.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Automate */}
        <section id="what-we-automate" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What We Automate</h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                From lead generation to customer onboarding — we automate the workflows that slow
                your team down.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {automations.map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <item.icon className="w-8 h-8 text-blue-400 flex-shrink-0" />
                  <span className="text-white font-medium">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How It Works</h2>
            </motion.div>

            <div className="space-y-6">
              {processSteps.map((step, i) => (
                <motion.div
                  key={i}
                  className="flex gap-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  viewport={{ once: true }}
                >
                  <div className="text-3xl font-black text-blue-400/30 flex-shrink-0">
                    {step.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-blue-100/80">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pricing</h2>
              <p className="text-lg text-blue-100">Transparent pricing. No surprises.</p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              {pricingTiers.map((tier, i) => (
                <motion.div
                  key={i}
                  className={`relative bg-white/5 backdrop-blur-sm border rounded-xl p-8 ${
                    tier.highlighted
                      ? 'border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'border-white/10'
                  }`}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  {tier.highlighted && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold rounded-full">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-1">{tier.name}</h3>
                  <p className="text-sm text-blue-100/60 mb-4">{tier.description}</p>
                  <div className="text-2xl font-bold text-white mb-6">{tier.price}</div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, j) => (
                      <li key={j} className="flex items-center gap-2 text-blue-100/80">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => setIsCalendlyOpen(true)}
                    className={`block w-full text-center px-6 py-3 font-semibold rounded-xl transition-all ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    {tier.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Bar */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div className="grid grid-cols-3 gap-6 text-center" {...fadeInUp}>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">15-30 hrs</div>
                <div className="text-sm text-blue-100/60">saved per week</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">1-2 weeks</div>
                <div className="text-sm text-blue-100/60">delivery time</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold text-white">2.5x</div>
                <div className="text-sm text-blue-100/60">success rate with AI partner</div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
            </motion.div>

            <div className="space-y-4">
              {faqs.map((faq, i) => (
                <motion.details
                  key={i}
                  className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  viewport={{ once: true }}
                >
                  <summary className="px-6 py-4 cursor-pointer text-white font-medium list-none flex justify-between items-center">
                    {faq.q}
                    <span className="text-blue-400 group-open:rotate-45 transition-transform text-xl">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-blue-100/80">{faq.a}</div>
                </motion.details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12"
              {...fadeInUp}
            >
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Book a Free 30-min Automation Audit
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                We'll map your manual processes and tell you exactly what AI can automate — and how
                much time and money you'll save.
              </p>
              <button
                onClick={() => setIsCalendlyOpen(true)}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Book Free Audit
                <ArrowRight className="w-5 h-5" />
              </button>
            </motion.div>
          </div>
        </section>
      </div>

      <CalendlyModal
        isOpen={isCalendlyOpen}
        onClose={() => setIsCalendlyOpen(false)}
        url={CALENDLY_URL}
      />
    </>
  )
}

export default AutomationsPage
