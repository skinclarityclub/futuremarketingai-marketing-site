import React from 'react'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CTAButton } from '../components/common'
import { Phone, Calendar, Headphones, RefreshCw, CheckCircle, Handshake } from 'lucide-react'

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

      <div className="min-h-screen bg-bg-deep">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
                <Phone className="w-4 h-4 text-accent-system" />
                <span className="text-sm font-medium text-text-secondary">
                  AI That Handles Your Calls
                </span>
              </div>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              AI Voice Agents for Lead Qualification & Booking
            </h1>

            <p
              className="text-xl text-text-muted leading-relaxed max-w-3xl mx-auto mb-10"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              AI voice agents that call prospects, qualify leads, and book appointments — at scale,
              without a sales team.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <CTAButton size="lg" calendly arrow>
                Book a Demo Call
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="#use-cases">
                See Use Cases
              </CTAButton>
            </div>
          </div>
        </section>

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
                What Voice Agents Can Do
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase, i) => (
                <motion.div
                  key={i}
                  className="card-gradient-border bg-white/[0.02] border border-border-primary rounded-card p-8 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]"
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
                Pricing
              </h2>
              <p className="text-lg text-text-secondary">
                Transparent pricing for voice AI solutions
              </p>
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
                    Get Started
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
                  Built With Specialized Partners
                </h3>
                <p className="text-text-muted">
                  Our voice agent solutions are built in collaboration with specialized voice AI
                  partners, ensuring you get the best technology and expertise available in the
                  market.
                </p>
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
                <div className="text-3xl font-bold font-display text-text-primary mb-1">24/7</div>
                <div className="text-sm text-text-muted">Always Available</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-display text-text-primary mb-1">500+</div>
                <div className="text-sm text-text-muted">Calls Per Day</div>
              </div>
              <div>
                <div className="text-3xl font-bold font-display text-text-primary mb-1">98%</div>
                <div className="text-sm text-text-muted">Accuracy Rate</div>
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
                Book a Voice Agent Demo
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                Hear a live demo of our voice AI and discover how it can qualify leads and book
                meetings for your business.
              </p>
              <CTAButton size="lg" calendly arrow>
                Book Demo Call
              </CTAButton>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default VoiceAgentsPage
