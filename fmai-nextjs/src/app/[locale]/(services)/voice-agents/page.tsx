import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import type { FaqItem } from '@/components/seo/FaqJsonLd'
import { QuickAnswerBlock } from '@/components/ui/QuickAnswerBlock'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'voice-agents', path: '/voice-agents' })
}

const USE_CASE_KEYS = [
  'outbound_leads',
  'appointment_setting',
  'inbound_service',
  'post_sale',
] as const

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is an AI voice agent?',
    answer:
      'An AI voice agent is a conversational telephone bot that can handle inbound calls (qualifying prospects, answering FAQs) or make outbound calls (follow-ups, appointment reminders) using natural language.',
  },
  {
    question: 'How human-like is the voice?',
    answer:
      'Modern text-to-speech models produce near-human speech with adjustable tone, pace, and accent. Most callers cannot distinguish the agent from a human in the first 30 seconds.',
  },
  {
    question: 'What call scenarios can voice agents handle?',
    answer:
      'Lead qualification, appointment scheduling, inbound support routing, outbound reminders, NPS surveys, and post-purchase follow-up calls are the most common use cases.',
  },
  {
    question: 'How do voice agents integrate with my phone system?',
    answer:
      'We use Twilio or Vonage as the telephony layer, which connects to most VoIP systems. SIP trunking or PSTN integration is included in all deployments.',
  },
  {
    question: 'What is the average call deflection rate?',
    answer:
      'Clients typically see 40-70% deflection on repeat/FAQ inbound queries within the first 90 days, reducing live agent queue time significantly.',
  },
]

export default async function VoiceAgentsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'voice-agents' })

  return (
    <PageShell>
      {/* JSON-LD Structured Data */}
      <ServiceJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        serviceType="AI Voice Agent Solutions"
        path="/voice-agents"
        locale={locale}
      />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/voice-agents"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Voice Agents', path: '/voice-agents' },
        ]}
        locale={locale}
      />
      <FaqJsonLd items={FAQ_ITEMS} />

      {/* Hero */}
      <section aria-labelledby="hero" className="relative pt-20 pb-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-system/10 border border-accent-system/20 rounded-full mb-6">
            <span className="text-sm font-medium text-accent-system">{t('hero.badge')}</span>
          </div>
          <h1
            id="hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/contact" size="lg">
              {t('hero.cta_primary')}
            </CTAButton>
            <CTAButton href="#use-cases" variant="secondary" size="lg">
              {t('hero.cta_secondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Quick Answer Block */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-8">
        <QuickAnswerBlock definition="AI Voice Agents by Future Marketing AI handle inbound and outbound calls autonomously — qualifying prospects, scheduling appointments, and resolving support queries at scale." />
      </div>

      {/* What Can AI Voice Agents Do? */}
      <section aria-labelledby="use-cases" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="use-cases">What Can AI Voice Agents Do?</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {USE_CASE_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`use_cases.items.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary">{t(`use_cases.items.${key}.description`)}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How Do Voice Agents Integrate With Your Stack? */}
      <section aria-labelledby="partnership" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading id="partnership">
            How Do Voice Agents Integrate With Your Stack?
          </SectionHeading>
          <ScrollReveal>
            <p className="text-lg text-text-secondary leading-relaxed mt-6">
              {t('partnership.description')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section aria-labelledby="faq" className="py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="faq" className="text-center mb-10">
            Frequently Asked Questions
          </SectionHeading>
          <dl className="space-y-6">
            {FAQ_ITEMS.map((item) => (
              <div key={item.question} className="bg-bg-surface/30 rounded-lg p-6">
                <dt className="text-lg font-semibold text-text-primary mb-2">{item.question}</dt>
                <dd className="text-text-secondary leading-relaxed">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
            <CTAButton href="/contact" size="lg">
              {t('cta.button')}
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
