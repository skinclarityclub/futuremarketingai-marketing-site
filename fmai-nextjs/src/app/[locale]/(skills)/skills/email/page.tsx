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
    namespace: 'skills-email',
    path: '/skills/email',
  })
}

const USE_CASE_KEYS = [
  {
    key: 'automated_campaigns',
    title: 'Automated Campaigns',
    description:
      'AI-written email sequences based on audience segments. Personalized at scale with dynamic content that adapts to each recipient.',
  },
  {
    key: 'smart_followups',
    title: 'Smart Follow-ups',
    description:
      'Automatic follow-up emails triggered by lead behavior. Never miss a warm lead with intelligent timing and messaging.',
  },
  {
    key: 'newsletter_generation',
    title: 'Newsletter Generation',
    description:
      'Weekly or monthly newsletters compiled from your content calendar. Curated, written, and scheduled automatically.',
  },
  {
    key: 'inbox_management',
    title: 'Inbox Management',
    description:
      'Smart routing, auto-replies, and priority flagging. Keep client inboxes organized and response times under control.',
  },
] as const

export default async function EmailPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <PageShell>
      <WebPageJsonLd
        name="AI Email Management for Your Agency Clients"
        description="Automated email campaigns, intelligent follow-ups, and AI-powered inbox management for your agency clients."
        path="/skills/email"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Email', path: '/skills/email' },
        ]}
        locale={locale}
      />

      {/* Hero */}
      <section aria-labelledby="hero" className="relative pt-20 pb-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-system/10 border border-accent-system/20 rounded-full mb-6">
            <span className="text-sm font-medium text-accent-system">Email Skill</span>
          </div>
          <h1
            id="hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
          >
            AI Email Management for Your Agency Clients
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            Automated email campaigns, intelligent follow-ups, and AI-powered inbox management.
            Deliver results for your clients without the manual grind.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/pricing" size="lg">
              Get Started
            </CTAButton>
          </div>
        </div>
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
                  price: '\u20AC397',
                  period: '/mo',
                  features: [
                    '1,000 emails/mo',
                    '1 client account',
                    'Campaign templates',
                    'Basic analytics',
                  ],
                },
                {
                  name: 'Growth',
                  price: '\u20AC797',
                  period: '/mo',
                  highlighted: true,
                  badge: 'Most Popular',
                  features: [
                    '5,000 emails/mo',
                    '5 client accounts',
                    'Smart follow-ups',
                    'A/B testing',
                    'CRM integration',
                  ],
                },
                {
                  name: 'Scale',
                  price: '\u20AC1,497',
                  period: '/mo',
                  features: [
                    'Unlimited emails',
                    'Unlimited clients',
                    'Full inbox management',
                    'Custom workflows',
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
                  value: '45%',
                  label: 'Higher Open Rates',
                  description: 'AI-optimized subject lines and send times',
                },
                {
                  value: '3x',
                  label: 'More Replies',
                  description: 'Personalized content that resonates',
                },
                {
                  value: '24/7',
                  label: 'Sending',
                  description: 'Automated delivery at optimal times',
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
            <SectionHeading id="cta">Ready to Automate Email?</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">
              Start delivering AI-powered email solutions to your agency clients today.
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
