import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { HowToJsonLd } from '@/components/seo/HowToJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { SectionShell } from '@/components/sections/SectionShell'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'
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

const STEP_KEYS = ['apply', 'onboarding', 'configure', 'production', 'improvement'] as const

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
        name={t('jsonLd.name')}
        description={t('jsonLd.description')}
        steps={STEP_KEYS.map((key) => ({
          name: t(`process.steps.${key}.title`),
          text: t(`process.steps.${key}.description`),
        }))}
      />
      <Breadcrumbs path="/how-it-works" locale={locale} />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 lg:px-12" aria-labelledby="hiw-hero">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
          <h1
            id="hiw-hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <SectionShell
        id="hiw-process"
        eyebrow={t('process.eyebrow')}
        heading={t('process.title')}
        align="center"
        className="py-12"
      >
        <RevealContainer as="ol" className="space-y-6">
          {STEP_KEYS.map((stepKey, index) => (
            <RevealItem key={stepKey} as="li">
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
            </RevealItem>
          ))}
        </RevealContainer>

        {/* Loop Indicator */}
        <ScrollReveal>
          <div className="mt-10 bg-gradient-to-br from-accent-system/10 via-accent-system/5 to-transparent border border-accent-system/20 rounded-[var(--radius-card)] p-6 text-center">
            <p className="text-text-secondary">
              <strong className="text-text-primary">{t('process.loop_title')}:</strong>{' '}
              {t('process.loop_description')}
            </p>
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="hiw-cta">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard className="p-12 text-center space-y-5">
              <EyebrowLabel className="block">{t('cta.eyebrow')}</EyebrowLabel>
              <h2
                id="hiw-cta"
                className="text-3xl md:text-4xl font-bold font-display text-text-primary"
              >
                {t('cta.title')}
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <div className="pt-2">
                <CTAButton href="/apply" size="lg">
                  {t('cta.button')}
                </CTAButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
