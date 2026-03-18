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
import { DemoPlayground } from '@/components/chatbot/DemoPlayground'
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
  return generatePageMetadata({ locale, namespace: 'chatbots', path: '/chatbots' })
}

const USE_CASE_KEYS = [
  'customer_service',
  'lead_qualification',
  'appointment_booking',
  'faq_automation',
] as const

const PROCESS_STEPS = [
  { key: 'discovery', number: '01' },
  { key: 'build', number: '02' },
  { key: 'optimize', number: '03' },
] as const

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What makes an AI chatbot different from a rule-based chatbot?',
    answer:
      'AI chatbots use large language models to understand intent and generate contextual responses, while rule-based bots follow fixed decision trees. AI chatbots handle novel questions without pre-programmed paths.',
  },
  {
    question: 'Can I try the chatbot before purchasing?',
    answer:
      'Yes — our Chatbots page features a live demo playground with 3 pre-configured personas: e-commerce, lead generation, and customer support.',
  },
  {
    question: "How do you configure the chatbot's persona?",
    answer:
      'Each chatbot receives a system prompt, tone guidelines, knowledge base documents, and example conversations. Configuration typically takes 3-5 business days for a production-ready persona.',
  },
  {
    question: 'Does the chatbot integrate with my CRM?',
    answer:
      'Yes — chatbot-captured leads are routed directly to HubSpot, Salesforce, or your CRM via webhook. We configure the field mapping during onboarding.',
  },
  {
    question: 'What languages does the chatbot support?',
    answer:
      'The underlying models support 50+ languages. We configure and test for your primary languages (EN/NL/ES as standard) during deployment.',
  },
  {
    question: 'Is the chatbot GDPR compliant?',
    answer:
      'Yes — all conversation data is processed within EU data centers, chat history is not retained beyond the session by default, and we provide a DPA on request.',
  },
]

export default async function ChatbotsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'chatbots' })

  return (
    <PageShell>
      {/* JSON-LD Structured Data */}
      <ServiceJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        serviceType="AI Chatbot Solutions"
        path="/chatbots"
        locale={locale}
      />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/chatbots"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Chatbots', path: '/chatbots' },
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
            <CTAButton href="#use-cases" size="lg">
              {t('hero.cta_primary')}
            </CTAButton>
            <CTAButton href="/contact" variant="secondary" size="lg">
              {t('hero.cta_secondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Quick Answer Block */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-8">
        <QuickAnswerBlock definition="AI Chatbots by Future Marketing AI are conversational agents configured to your brand persona — qualifying leads, answering questions, and booking demos 24/7 without human intervention." />
      </div>

      {/* What Can an AI Chatbot Do for Your Business? */}
      <section aria-labelledby="use-cases" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="use-cases">
            What Can an AI Chatbot Do for Your Business?
          </SectionHeading>
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

      {/* Demo Playground -- client island */}
      <section
        id="demo"
        aria-labelledby="demo-heading"
        className="py-20 px-6 lg:px-12 bg-bg-surface/30"
      >
        <div className="max-w-7xl mx-auto">
          <SectionHeading id="demo-heading">{t('demo.title')}</SectionHeading>
          <DemoPlayground />
        </div>
      </section>

      {/* How Does a Chatbot Get Deployed? */}
      <section aria-labelledby="process" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="process">How Does a Chatbot Get Deployed?</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {PROCESS_STEPS.map((step, index) => (
              <ScrollReveal key={step.key} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold font-mono text-accent-system/30 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {t(`process.steps.${step.key}.title`)}
                  </h3>
                  <p className="text-text-secondary">
                    {t(`process.steps.${step.key}.description`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section aria-labelledby="faq" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
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
