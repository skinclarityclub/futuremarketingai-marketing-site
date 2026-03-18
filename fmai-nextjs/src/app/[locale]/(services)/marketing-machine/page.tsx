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
  return generatePageMetadata({
    locale,
    namespace: 'marketing-machine',
    path: '/marketing-machine',
  })
}

const FEATURE_KEYS = [
  'research',
  'content',
  'publishing',
  'analytics',
  'ads',
  'orchestrator',
] as const

const HOW_IT_WORKS_STEPS = [
  { key: 'step1', number: '01' },
  { key: 'step2', number: '02' },
  { key: 'step3', number: '03' },
] as const

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is the AI Marketing Machine?',
    answer:
      'The AI Marketing Machine is an integrated system combining workflow automations, conversational AI, content production, and paid amplification into a single self-optimizing growth engine managed for you.',
  },
  {
    question: 'How is this different from buying individual tools?',
    answer:
      'Individual tools require manual orchestration. The Marketing Machine is a managed service where AI coordinates the tools, and we handle strategy, operations, and optimization.',
  },
  {
    question: "What does 'Marketing Machine' include?",
    answer:
      'A standard engagement includes: lead generation automations, a configured chatbot, content calendar and AI-assisted production, ad campaign management, and monthly optimization sprints.',
  },
  {
    question: 'How long until I see results?',
    answer:
      'Infrastructure setup takes 3-4 weeks. Most clients see measurable pipeline impact (qualified leads, booked calls) within 60 days of launch.',
  },
  {
    question: 'Is this suitable for B2C companies?',
    answer:
      'The Marketing Machine is optimized for B2B. B2C companies with high-ticket products (EUR 1.000+) can benefit, but the playbook is calibrated for longer sales cycles and account-based targeting.',
  },
  {
    question: 'What does ongoing management involve?',
    answer:
      'Monthly: performance review, A/B test analysis, content refresh, ad budget reallocation, and chatbot knowledge base updates. Quarterly: strategy reassessment and roadmap update.',
  },
]

export default async function MarketingMachinePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'marketing-machine' })

  return (
    <PageShell>
      {/* JSON-LD Structured Data */}
      <ServiceJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        serviceType="AI Marketing Platform"
        path="/marketing-machine"
        locale={locale}
      />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/marketing-machine"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Marketing Machine', path: '/marketing-machine' },
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
            {t('hero.title')} <span className="text-accent-system">{t('hero.titleHighlight')}</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {t('hero.description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/contact" size="lg">
              {t('hero.cta_primary')}
            </CTAButton>
            <CTAButton href="/pricing" variant="secondary" size="lg">
              {t('hero.cta_secondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Quick Answer Block */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-8">
        <QuickAnswerBlock definition="The AI Marketing Machine by Future Marketing AI is an integrated system combining automations, chatbots, content production, and paid amplification into a single self-optimizing growth engine." />
      </div>

      {/* What Does the Marketing Machine Include? */}
      <section aria-labelledby="features" className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <SectionHeading id="features">What Does the Marketing Machine Include?</SectionHeading>
          <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-12">
            {t('features.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURE_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary text-sm">{t(`features.${key}.description`)}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How Does the Marketing Machine Get Built? */}
      <section aria-labelledby="how-it-works" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="how-it-works">
            How Does the Marketing Machine Get Built?
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {HOW_IT_WORKS_STEPS.map((step, index) => (
              <ScrollReveal key={step.key} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold font-mono text-accent-system/30 mb-4">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {t(`howItWorks.${step.key}.title`)}
                  </h3>
                  <p className="text-text-secondary">{t(`howItWorks.${step.key}.description`)}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
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
