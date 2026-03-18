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
  return generatePageMetadata({ locale, namespace: 'automations', path: '/automations' })
}

const PAIN_POINT_KEYS = ['manual_work', 'disconnected_tools', 'scaling'] as const

const AUTOMATION_KEYS = [
  'lead_qualification',
  'email_sequences',
  'social_media',
  'invoicing',
  'onboarding',
  'data_sync',
] as const

const PROCESS_STEPS = [
  { key: 'audit', number: '01' },
  { key: 'build', number: '02' },
  { key: 'optimize', number: '03' },
] as const

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'What is AI marketing automation?',
    answer:
      'AI marketing automation uses machine learning to execute repetitive marketing tasks — lead qualification, email sequences, CRM sync — without human intervention, running 24/7 with consistent quality.',
  },
  {
    question: 'How long does it take to deploy an automation workflow?',
    answer:
      'Most workflow automations go live within 2-3 weeks: one week for audit and design, one week for build and testing, and a final integration sprint.',
  },
  {
    question: 'Which tools do you integrate with?',
    answer:
      'We integrate with HubSpot, Salesforce, ActiveCampaign, Zapier, Make (Integromat), Airtable, Slack, Google Workspace, and most REST API-based platforms.',
  },
  {
    question: 'Is AI automation suitable for small marketing teams?',
    answer:
      'Yes — AI automation scales down as well as up. Small teams (2-5 people) often see the biggest productivity gains because automation eliminates tasks that previously required dedicated headcount.',
  },
  {
    question: 'What happens if an automation breaks?',
    answer:
      'All workflows include monitoring and error-handling. We provide 30-day post-launch support and can configure Slack/email alerts for any failure states.',
  },
]

export default async function AutomationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'automations' })

  return (
    <PageShell>
      {/* JSON-LD Structured Data */}
      <ServiceJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        serviceType="AI Marketing Automation"
        path="/automations"
        locale={locale}
      />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/automations"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Automations', path: '/automations' },
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
            <CTAButton href="#automations" variant="secondary" size="lg">
              {t('hero.cta_secondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Quick Answer Block */}
      <div className="max-w-5xl mx-auto px-6 lg:px-12 pb-8">
        <QuickAnswerBlock definition="AI Marketing Automations by Future Marketing AI replace manual marketing workflows with intelligent, self-running systems — so your team focuses on strategy while AI handles execution." />
      </div>

      {/* Why Does Your Marketing Team Need AI Automation? */}
      <section aria-labelledby="challenges" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="challenges">
            Why Does Your Marketing Team Need AI Automation?
          </SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {PAIN_POINT_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`pain_points.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary">{t(`pain_points.${key}.description`)}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* What Does Our Automation Service Include? */}
      <section aria-labelledby="automations" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="automations">
            What Does Our Automation Service Include?
          </SectionHeading>
          <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-12">
            {t('what_we_automate.subtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AUTOMATION_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <GlassCard className="text-center">
                  <p className="text-text-primary font-medium">
                    {t(`what_we_automate.items.${key}`)}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How Does an Automation Workflow Get Built? */}
      <section aria-labelledby="process" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="process">How Does an Automation Workflow Get Built?</SectionHeading>
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
