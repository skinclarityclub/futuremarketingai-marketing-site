import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
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
    namespace: 'skills-voice-agent',
    path: '/skills/voice-agent',
  })
}

const FEATURE_KEYS = ['inbound', 'outbound', 'qualification', 'booking'] as const
const STEP_KEYS = ['setup', 'deploy', 'optimize'] as const
const USE_CASE_KEYS = ['agencies', 'sales'] as const

export default async function VoiceAgentPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'skills-voice-agent' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/skills/voice-agent"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Voice Agent', path: '/skills/voice-agent' },
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
            <CTAButton href="/pricing" size="lg">
              {t('cta.button')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Features */}
      <section aria-labelledby="features" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="features">{t('features.heading')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            {FEATURE_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`features.items.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary">{t(`features.items.${key}.description`)}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section aria-labelledby="how-it-works" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="how-it-works">{t('how_it_works.heading')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
            {STEP_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl font-bold font-mono text-accent-system/30 mb-4">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {t(`how_it_works.steps.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary">
                    {t(`how_it_works.steps.${key}.description`)}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section aria-labelledby="use-cases" className="py-20 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="use-cases">{t('use_cases.heading')}</SectionHeading>
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

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
            <CTAButton href="/pricing" size="lg">
              {t('cta.button')}
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
