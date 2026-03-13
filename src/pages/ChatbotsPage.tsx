import React from 'react'
import { motion } from 'framer-motion'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { CTAButton } from '../components/common'
import { Bot, MessageSquare, Users, Calendar, HelpCircle, CheckCircle } from 'lucide-react'

const useCases = [
  {
    icon: MessageSquare,
    title: 'Customer Service',
    description:
      'Handle 70% of customer inquiries automatically — instant responses, 24/7 availability.',
  },
  {
    icon: Users,
    title: 'Lead Qualification',
    description: 'Score and route leads around the clock. Never miss a hot prospect again.',
  },
  {
    icon: Calendar,
    title: 'Appointment Booking',
    description:
      'Fill your calendar without manual back-and-forth. Integrated with Calendly, Cal.com, and more.',
  },
  {
    icon: HelpCircle,
    title: 'FAQ Automation',
    description:
      'Consistent, accurate answers — always available. Trained on your specific knowledge base.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Discovery',
    description:
      'We map your use case, identify key intents, and plan integration with your existing tools.',
  },
  {
    step: '02',
    title: 'Build',
    description:
      'Custom LLM-powered chatbot, trained on your data. Multi-platform deployment ready.',
  },
  {
    step: '03',
    title: 'Optimize',
    description:
      'Ongoing improvement based on real conversation data. Monthly performance reports.',
  },
]

const pricingTiers = [
  {
    name: 'Basic',
    price: '€1,500',
    description: 'FAQ chatbot for one platform',
    features: [
      'FAQ chatbot',
      '1 platform (web or WhatsApp)',
      'Trained on your content',
      '7-day delivery',
    ],
    highlighted: false,
  },
  {
    name: 'Standard',
    price: '€2,500 – €3,500',
    description: 'Multi-intent with CRM integration',
    features: [
      'Multi-intent recognition',
      'CRM integration',
      'Analytics dashboard',
      'Multi-platform',
    ],
    highlighted: true,
  },
  {
    name: 'Custom',
    price: '€5,000+',
    description: 'Enterprise-grade AI chatbot',
    features: [
      'Full custom workflows',
      'Advanced analytics',
      'Multi-language support',
      'Dedicated account manager',
    ],
    highlighted: false,
  },
]

const faqs = [
  {
    q: 'What platforms can you deploy chatbots on?',
    a: 'We deploy on websites (widget), WhatsApp, Slack, Discord, Facebook Messenger, and any platform with an API.',
  },
  {
    q: 'How is the chatbot trained?',
    a: 'We train on your existing documentation, FAQs, product info, and past support conversations. The bot learns your specific domain and brand voice.',
  },
  {
    q: 'Can the chatbot hand off to a human agent?',
    a: 'Yes. Smart escalation routes complex queries to your team via email, Slack, or your helpdesk tool — with full conversation context.',
  },
  {
    q: 'What about data privacy?',
    a: 'We follow GDPR best practices. Your data stays in your infrastructure. We can deploy models that run entirely on your own servers if required.',
  },
]

export const ChatbotsPage: React.FC = () => {
  return (
    <>
      <SimpleHeader />
      <SEOHead
        title="AI Chatbot Development Services | Future AI"
        description="Custom AI chatbots that answer questions, qualify leads, and book calls — while you sleep. Integrated with your CRM, calendar, and support tools."
        keywords={[
          'AI chatbot',
          'customer service bot',
          'lead generation chatbot',
          'ChatGPT integration',
          'AI customer support',
        ]}
        canonical="https://future-marketing.ai/chatbots"
      />

      <div className="min-h-screen bg-bg-deep">
        {/* Hero */}
        <section className="relative pt-32 pb-16 px-12">
          <div className="max-w-7xl mx-auto text-center">
            <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
                <Bot className="w-4 h-4 text-accent-system" />
                <span className="text-sm font-medium text-text-secondary">
                  24/7 Lead Qualification
                </span>
              </div>
            </div>

            <h1
              className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              AI Chatbots That Never Sleep
            </h1>

            <p
              className="text-xl text-text-muted leading-relaxed max-w-3xl mx-auto mb-10"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              Custom AI chatbots that answer questions, qualify leads, and book calls — while you
              sleep. Integrated with your CRM, calendar, and support tools.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <CTAButton size="lg" href="/demo" arrow>
                See a Live Demo
              </CTAButton>
              <CTAButton size="lg" variant="secondary" calendly>
                Get a Free Strategy Session
              </CTAButton>
            </div>
          </div>
        </section>

        {/* Use Cases */}
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
                What Our Chatbots Do
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
                How We Build It
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
              <p className="text-lg text-text-secondary">Maintenance retainer from €500/mo</p>
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

        {/* Trust Metrics */}
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
                  70%
                </div>
                <div className="text-sm text-text-muted">inquiries handled automatically</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-text-primary">
                  24/7
                </div>
                <div className="text-sm text-text-muted">availability</div>
              </div>
              <div>
                <div className="text-2xl md:text-3xl font-bold font-display text-text-primary">
                  CRM
                </div>
                <div className="text-sm text-text-muted">fully integrated</div>
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
                Get a Free Chatbot Strategy Session
              </h2>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                We'll analyze your use case and show you exactly how an AI chatbot can save your
                team hours every week.
              </p>
              <CTAButton size="lg" calendly arrow>
                Book Free Session
              </CTAButton>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  )
}

export default ChatbotsPage
