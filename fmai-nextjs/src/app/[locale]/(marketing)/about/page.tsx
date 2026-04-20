import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL, MAX_PARTNERS_PER_YEAR } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'about', path: '/about' })
}

const ERA_KEYS = ['assisted', 'autonomous', 'standard'] as const
const FIT_KEYS = ['fit1', 'fit2', 'fit3', 'fit4'] as const
const NOT_FIT_KEYS = ['notFit1', 'notFit2', 'notFit3', 'notFit4'] as const
const INFRA_KEYS = ['selfHosted', 'eu', 'openStandards', 'noLockIn'] as const

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/about"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('hero.title'), path: '/about' },
        ]}
        locale={locale}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-human/10 border border-accent-human/20 rounded-full mb-6 text-sm font-medium text-text-secondary">
            {t('hero.badge')}
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.tagline')}
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="mission">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <GlassCard>
              <SectionHeading id="mission">{t('mission.heading')}</SectionHeading>
              <p className="text-lg text-text-secondary leading-relaxed mt-4 mb-6">
                {t('mission.text')}
              </p>
              <h3 className="text-2xl font-bold font-display text-text-primary mb-3">
                {t('mission.why_heading')}
              </h3>
              <p className="text-lg text-text-secondary leading-relaxed">{t('mission.why_text')}</p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-12 px-6 lg:px-12" aria-labelledby="timeline">
        <div className="max-w-7xl mx-auto">
          <SectionHeading id="timeline" className="text-center mb-12">
            {t('timeline.title')}
          </SectionHeading>

          <div className="space-y-6">
            {ERA_KEYS.map((era, index) => (
              <ScrollReveal key={era} delay={index * 0.1}>
                <GlassCard
                  highlighted={era === 'autonomous'}
                  className="relative border-l-4 border-l-accent-system pl-8"
                >
                  <div className="text-sm font-semibold font-mono text-accent-system mb-2">
                    {t(`timeline.eras.${era}.year`)}
                  </div>
                  <h3 className="text-2xl font-bold font-display text-text-primary mb-3">
                    {t(`timeline.eras.${era}.title`)}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {t(`timeline.eras.${era}.description`)}
                  </p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>

          {/* Key Message */}
          <div className="mt-8 bg-accent-system/5 border border-accent-system/20 rounded-[var(--radius-card)] p-8 text-center">
            <p className="text-xl font-semibold text-text-primary mb-2">
              {t('timeline.key_message.title')}
            </p>
            <p className="text-text-secondary">{t('timeline.key_message.description')}</p>
          </div>
        </div>
      </section>

      {/* Hybrid ICP */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="about-icp">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="about-icp">{t('icp.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">{t('icp.subtitle')}</p>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassCard className="text-left">
                <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#00FF88]/15 text-[#00FF88] text-sm"
                  >
                    ✓
                  </span>
                  {t('icp.fitTitle')}
                </h3>
                <ul className="space-y-4">
                  {FIT_KEYS.map((key) => (
                    <li key={key} className="flex gap-3 text-text-secondary leading-relaxed">
                      <span aria-hidden className="text-[#00FF88] pt-[2px] shrink-0">✓</span>
                      <span>{t(`icp.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
              <GlassCard className="text-left">
                <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                  <span
                    aria-hidden
                    className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-text-muted/15 text-text-muted text-sm"
                  >
                    ×
                  </span>
                  {t('icp.notFitTitle')}
                </h3>
                <ul className="space-y-4">
                  {NOT_FIT_KEYS.map((key) => (
                    <li key={key} className="flex gap-3 text-text-secondary leading-relaxed">
                      <span aria-hidden className="text-text-muted pt-[2px] shrink-0">×</span>
                      <span>{t(`icp.${key}`)}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Infrastructure */}
      <section className="py-16 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="about-infra">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="about-infra">{t('infra.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">{t('infra.subtitle')}</p>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {INFRA_KEYS.map((key) => (
                <GlassCard key={key} className="text-left">
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {t(`infra.${key}.title`)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(`infra.${key}.body`)}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Capacity + transparency */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="about-capacity">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <SectionHeading id="about-capacity">{t('capacity.title')}</SectionHeading>
          </div>
          <ScrollReveal>
            <GlassCard className="text-left">
              <p className="text-text-secondary leading-relaxed mb-4">
                {t('capacity.body', {
                  taken: FOUNDING_SPOTS_TAKEN,
                  total: FOUNDING_SPOTS_TOTAL,
                  maxPerYear: MAX_PARTNERS_PER_YEAR,
                })}
              </p>
              <p className="text-text-secondary leading-relaxed">{t('capacity.reasoning')}</p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Founder bio */}
      <section className="py-16 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="about-founder">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <SectionHeading id="about-founder">{t('founder.title')}</SectionHeading>
          </div>
          <ScrollReveal>
            <GlassCard className="text-left">
              <div className="flex items-start gap-4">
                <div
                  aria-hidden
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-system to-[#A855F7] flex items-center justify-center text-bg-deep font-bold text-xl shrink-0"
                >
                  D
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-text-primary mb-1">
                    {t('founder.name')}
                  </h3>
                  <p className="text-sm text-text-muted mb-4">{t('founder.role')}</p>
                  <p className="text-text-secondary leading-relaxed">{t('founder.bio')}</p>
                </div>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="about-cta">
        <div className="max-w-7xl mx-auto text-center">
          <ScrollReveal>
            <GlassCard className="p-12">
              <SectionHeading id="about-cta" className="mb-4">
                {t('cta.title')}
              </SectionHeading>
              <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton href="/apply" size="lg">
                  {t('cta.demo_button')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
                <CTAButton href="/contact" variant="secondary" size="lg">
                  {t('cta.contact_button')}
                </CTAButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
