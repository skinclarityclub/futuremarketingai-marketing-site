import React from 'react'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import {
  Phone,
  Calendar,
  Headphones,
  RefreshCw,
  ArrowRight,
  CheckCircle,
  Handshake,
} from 'lucide-react'

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
  viewport: { once: true as const },
}

const useCases = [
  {
    icon: Phone,
    title: 'Outbound Lead Qualification',
    description:
      'Call and qualify hundreds of leads per day. AI handles the first conversation so your sales team only talks to qualified prospects.',
  },
  {
    icon: Calendar,
    title: 'Appointment Setting',
    description:
      'Fill calendars automatically. The voice agent books meetings directly into your calendar system.',
  },
  {
    icon: Headphones,
    title: 'Inbound Customer Service',
    description:
      'Handle routine calls 24/7. Answer FAQs, route complex issues, and never put a customer on hold.',
  },
  {
    icon: RefreshCw,
    title: 'Post-Sale Follow-up',
    description: 'Automated check-ins, renewal reminders, and satisfaction surveys — at scale.',
  },
]

const pricingTiers = [
  {
    name: 'Basic',
    price: '€1,000 – €2,000',
    description: 'Single-purpose voice agent',
    features: [
      '1 workflow (e.g., appointment booking)',
      'Basic CRM integration',
      'Call recording & transcripts',
      '14-day delivery',
    ],
    highlighted: false,
  },
  {
    name: 'Standard',
    price: '€2,000 – €5,000',
    description: 'Multi-purpose voice agent',
    features: [
      'Multiple workflows',
      'Full CRM integration',
      'Analytics dashboard',
      'Multi-language support',
    ],
    highlighted: true,
  },
  {
    name: 'Ongoing',
    price: 'from €500/mo',
    description: 'Hosting, monitoring & optimization',
    features: [
      'Cloud hosting',
      'Performance monitoring',
      'Monthly optimization',
      'Priority support',
    ],
    highlighted: false,
  },
]

const faqs = [
  {
    q: 'How natural does the AI voice sound?',
    a: 'Modern voice AI is remarkably natural. We use the latest text-to-speech models that sound indistinguishable from human voices in most conversations.',
  },
  {
    q: 'Can the voice agent handle objections?',
    a: 'Yes. We train the agent on your specific objection-handling scripts. It can navigate common pushbacks and knows when to escalate to a human.',
  },
  {
    q: 'What languages are supported?',
    a: 'English, Spanish, French, German, Dutch, and many more. Multi-language support is available on Standard and above.',
  },
  {
    q: 'How does it integrate with my CRM?',
    a: 'We integrate with HubSpot, Salesforce, Pipedrive, and any CRM with an API. Call outcomes, transcripts, and lead scores are automatically synced.',
  },
]

export const VoiceAgentsPage: React.FC = () => {
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

      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div {...fadeInUp}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
                <Phone className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium text-blue-100">
                  AI That Handles Your Calls
                </span>
              </div>
            </motion.div>

            <motion.h1 className="text-4xl md:text-6xl font-bold text-white mb-6" {...fadeInUp}>
              AI Voice Agents for Lead Qualification & Booking
            </motion.h1>

            <motion.p
              className="text-xl text-blue-100 leading-relaxed max-w-3xl mx-auto mb-10"
              {...fadeInUp}
            >
              AI voice agents that call prospects, qualify leads, and book appointments — at scale,
              without a sales team.
            </motion.p>

            <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" {...fadeInUp}>
              <a
                href="https://calendly.com/futureai/strategy-call"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Book a Demo Call
                <ArrowRight className="w-5 h-5" />
              </a>
              <a
                href="#use-cases"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-all"
              >
                See Use Cases
              </a>
            </motion.div>
          </div>
        </section>

        {/* Use Cases */}
        <section id="use-cases" className="py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div className="text-center mb-12" {...fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                What Voice Agents Can Do
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, i) => (
                <motion.div
                  key={i}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <useCase.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{useCase.title}</h3>
                  <p className="text-blue-100/80">{useCase.description}</p>
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
              <p className="text-lg text-blue-100">Transparent pricing for voice AI solutions</p>
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
                  <a
                    href="https://calendly.com/futureai/strategy-call"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block text-center px-6 py-3 font-semibold rounded-xl transition-all ${
                      tier.highlighted
                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                        : 'bg-white/10 text-white border border-white/20 hover:bg-white/20'
                    }`}
                  >
                    Get Started
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Partnership Note */}
        <section className="py-12 px-6">
          <div className="max-w-3xl mx-auto">
            <motion.div
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 flex gap-6 items-start"
              {...fadeInUp}
            >
              <Handshake className="w-10 h-10 text-blue-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  Built With Specialized Partners
                </h3>
                <p className="text-blue-100/80">
                  Our voice agent solutions are built in collaboration with specialized voice AI
                  partners, ensuring you get the best technology and expertise available in the
                  market.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Trust Metrics */}
        <section className="py-12 px-6">
          <div className="max-w-4xl mx-auto">
            <motion.div className="grid grid-cols-3 gap-8 text-center" {...fadeInUp}>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-blue-100/60">Always Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-blue-100/60">Calls Per Day</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-sm text-blue-100/60">Accuracy Rate</div>
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
                Book a Voice Agent Demo
              </h2>
              <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
                Hear a live demo of our voice AI and discover how it can qualify leads and book
                meetings for your business.
              </p>
              <a
                href="https://calendly.com/futureai/strategy-call"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Book Demo Call
                <ArrowRight className="w-5 h-5" />
              </a>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default VoiceAgentsPage
