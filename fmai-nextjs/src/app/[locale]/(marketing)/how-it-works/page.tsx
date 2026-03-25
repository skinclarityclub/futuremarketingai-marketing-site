import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { HowToJsonLd } from '@/components/seo/HowToJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
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
    namespace: 'how-it-works',
    path: '/how-it-works',
  })
}

const STEP_KEYS = ['choose', 'activate', 'connect', 'working'] as const

const HOW_TO_STEPS = [
  {
    name: 'Choose Your Plan',
    text: 'Select the plan that matches your agency — Growth, Professional, or Enterprise — each includes Clyde, your persistent AI Marketing Employee, with all skills and a monthly credit allocation.',
  },
  {
    name: 'Activate Skills',
    text: 'Pick the skills your AI employee should learn: Content Creator, Voice Agent, Lead Qualifier, Social Media, Ad Creator, or Reporting.',
  },
  {
    name: 'Connect Your Clients',
    text: 'Create a workspace for each client, upload brand guidelines, connect social accounts, and configure tone of voice.',
  },
  {
    name: 'AI Employee Starts Working',
    text: 'Your AI Marketing Employee begins executing — creating content, qualifying leads, managing social, running ads, and generating reports 24/7.',
  },
]

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'how-it-works' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/how-it-works"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'How It Works', path: '/how-it-works' },
        ]}
        locale={locale}
      />
      <HowToJsonLd
        name="How Your AI Marketing Employee Gets Started"
        description="A 4-step agent onboarding process: choose your tier, activate skills, connect clients, and your AI employee starts working"
        steps={HOW_TO_STEPS}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="process">
        <div className="max-w-7xl mx-auto">
          <SectionHeading id="process" className="text-center mb-12">
            {t('process.title')}
          </SectionHeading>

          <ol className="space-y-6">
            {STEP_KEYS.map((stepKey, index) => (
              <li key={stepKey}>
                <ScrollReveal delay={index * 0.1}>
                  <GlassCard className="flex flex-col md:flex-row gap-6 items-start">
                    {/* Step Number */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-accent-system/20 border border-accent-system/30 rounded-[var(--radius-card)] flex items-center justify-center">
                        <span className="text-2xl font-bold font-mono text-accent-system">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="text-sm font-semibold font-mono text-accent-human mb-2">
                        {t(`process.steps.${stepKey}.step`)}
                      </div>
                      <h3 className="text-2xl font-bold font-display text-text-primary mb-3">
                        {t(`process.steps.${stepKey}.title`)}
                      </h3>
                      <p className="text-text-secondary leading-relaxed">
                        {t(`process.steps.${stepKey}.description`)}
                      </p>
                    </div>
                  </GlassCard>
                </ScrollReveal>
              </li>
            ))}
          </ol>

          {/* Loop Indicator */}
          <div className="mt-8 bg-accent-system/5 border border-accent-system/20 rounded-[var(--radius-card)] p-6 text-center">
            <p className="text-text-secondary">
              <strong className="text-text-primary">{t('process.loop_title')}:</strong>{' '}
              {t('process.loop_description')}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="hiw-cta">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <GlassCard className="p-12">
              <SectionHeading id="hiw-cta" className="mb-4">
                {t('cta.title')}
              </SectionHeading>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <CTAButton href="/contact" size="lg">
                {t('cta.button')}
              </CTAButton>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
