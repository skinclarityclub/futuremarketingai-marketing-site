import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { DemoPlayground } from '@/components/chatbot/DemoPlayground'
import { MultiPlatformShowcase } from '@/components/chatbot/MultiPlatformShowcase'
import { TrustMetrics } from '@/components/common/TrustMetrics'
import { PricingTiers } from '@/components/common/PricingTiers'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    locale,
    namespace: 'skills-chatbot',
    path: '/skills/chatbot',
  })
}

const USE_CASE_KEYS = [
  {
    key: 'customer_service',
    title: 'Customer Service',
    description:
      'Deploy AI chatbots that handle customer inquiries, resolve issues, and escalate complex cases to human agents seamlessly.',
  },
  {
    key: 'faq_automation',
    title: 'FAQ Automation',
    description:
      'Automatically answer frequently asked questions with context-aware responses, reducing support ticket volume by up to 70%.',
  },
  {
    key: 'appointment_booking',
    title: 'Appointment Booking',
    description:
      "Let chatbots manage scheduling, rescheduling, and reminders — integrated directly with your clients' calendar systems.",
  },
  {
    key: 'product_recommendations',
    title: 'Product Recommendations',
    description:
      'AI-powered product suggestions based on customer behavior, preferences, and purchase history to boost conversions.',
  },
] as const

export default async function ChatbotPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <PageShell>
      <WebPageJsonLd
        name="AI Chatbots for Your Agency Clients"
        description="Deploy intelligent chatbots across client websites that qualify leads, answer questions, and convert visitors 24/7."
        path="/skills/chatbot"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Chatbot', path: '/skills/chatbot' },
        ]}
        locale={locale}
      />

      {/* Hero */}
      <section aria-labelledby="hero" className="relative pt-20 pb-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-system/10 border border-accent-system/20 rounded-full mb-6">
            <span className="text-sm font-medium text-accent-system">Chatbot Skill</span>
          </div>
          <h1
            id="hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
          >
            AI Chatbots for Your Agency Clients
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            Deploy intelligent chatbots across client websites that qualify leads, answer questions,
            and convert visitors 24/7. White-labeled and fully customizable for each client.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/pricing" size="lg">
              Get Started
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Demo Playground */}
      <DemoPlayground />

      {/* Multi-Platform Showcase */}
      <section className="py-20 px-6 lg:px-12">
        <MultiPlatformShowcase />
      </section>

      {/* Use Cases */}
      <section aria-labelledby="use-cases" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="use-cases">Use Cases</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {USE_CASE_KEYS.map((useCase, index) => (
              <ScrollReveal key={useCase.key} delay={index * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">{useCase.title}</h3>
                  <p className="text-text-secondary">{useCase.description}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section aria-labelledby="pricing" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="pricing">Pricing</SectionHeading>
          <div className="mt-10">
            <PricingTiers
              tiers={[
                {
                  name: 'Starter',
                  price: '\u20AC497',
                  period: '/mo',
                  features: [
                    '1 chatbot',
                    'Website embed',
                    '1,000 conversations/mo',
                    'Basic analytics',
                  ],
                },
                {
                  name: 'Growth',
                  price: '\u20AC997',
                  period: '/mo',
                  highlighted: true,
                  badge: 'Most Popular',
                  features: [
                    '3 chatbots',
                    'Website + WhatsApp',
                    '5,000 conversations/mo',
                    'Lead scoring & CRM sync',
                    'A/B testing',
                  ],
                },
                {
                  name: 'Scale',
                  price: '\u20AC1,997',
                  period: '/mo',
                  features: [
                    'Unlimited chatbots',
                    'All platforms',
                    'Unlimited conversations',
                    'Custom integrations',
                    'Dedicated support',
                  ],
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* Trust Metrics */}
      <section aria-labelledby="trust" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="trust">Results That Speak</SectionHeading>
          <div className="mt-10">
            <TrustMetrics
              metrics={[
                {
                  value: '70%',
                  label: 'Inquiries Handled',
                  description: 'Automatically resolved without human intervention',
                },
                {
                  value: '24/7',
                  label: 'Always Available',
                  description: 'No missed opportunities, day or night',
                },
                {
                  value: '<2s',
                  label: 'Response Time',
                  description: 'Instant engagement with every visitor',
                },
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="cta">Ready to Deploy AI Chatbots?</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">
              Start delivering chatbot solutions to your agency clients today.
            </p>
            <CTAButton href="/pricing" size="lg">
              Get Started
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
