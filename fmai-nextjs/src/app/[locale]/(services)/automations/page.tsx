import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { ServiceJsonLd } from '@/components/seo/ServiceJsonLd'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'

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

      {/* Pain Points / Challenges */}
      <section aria-labelledby="challenges" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="challenges">{t('pain_points.title')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
            {PAIN_POINT_KEYS.map((key) => (
              <GlassCard key={key}>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {t(`pain_points.${key}.title`)}
                </h3>
                <p className="text-text-secondary">{t(`pain_points.${key}.description`)}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* What We Automate */}
      <section aria-labelledby="automations" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="automations">{t('what_we_automate.title')}</SectionHeading>
          <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-12">
            {t('what_we_automate.subtitle')}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AUTOMATION_KEYS.map((key) => (
              <GlassCard key={key} className="text-center">
                <p className="text-text-primary font-medium">
                  {t(`what_we_automate.items.${key}`)}
                </p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section aria-labelledby="process" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="process">{t('process.title')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {PROCESS_STEPS.map((step) => (
              <div key={step.key} className="text-center">
                <div className="text-4xl font-bold font-mono text-accent-system/30 mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {t(`process.steps.${step.key}.title`)}
                </h3>
                <p className="text-text-secondary">{t(`process.steps.${step.key}.description`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
          <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
          <CTAButton href="/contact" size="lg">
            {t('cta.button')}
          </CTAButton>
        </div>
      </section>
    </PageShell>
  )
}
