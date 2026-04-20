import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { MemoryLayersDiagram } from '@/components/memory/MemoryLayersDiagram'
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
  return generatePageMetadata({ locale, namespace: 'memory', path: '/memory' })
}

const CONTRAST_KEYS = ['chatgpt', 'jasper', 'clyde'] as const

export default async function MemoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'memory' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/memory"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Memory', path: '/memory' },
        ]}
        locale={locale}
      />

      {/* Hero */}
      <section
        aria-labelledby="memory-hero"
        className="relative min-h-[60vh] flex items-center px-6 lg:px-12 pt-24 lg:pt-[140px] pb-16"
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-6 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system">
            {t('hero.eyebrow')}
          </div>
          <h1
            id="memory-hero"
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6 text-text-primary"
          >
            {t('hero.headlineMain')}
            <br />
            <span
              className="relative inline-block bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #00D4AA 0%, #A855F7 100%)' }}
            >
              {t('hero.headlineAccent')}
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* 4-layer diagram */}
      <section aria-labelledby="layers-heading" className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="layers-heading">{t('layers.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">{t('layers.subtitle')}</p>
          </div>
          <ScrollReveal>
            <MemoryLayersDiagram locale={locale} />
          </ScrollReveal>
        </div>
      </section>

      {/* Per-client isolation */}
      <section aria-labelledby="isolation-heading" className="py-16 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="isolation-heading" className="text-center mb-8">
            {t('isolation.title')}
          </SectionHeading>
          <ScrollReveal>
            <GlassCard className="text-left">
              <p className="text-text-secondary leading-relaxed mb-4">{t('isolation.body1')}</p>
              <p className="text-text-secondary leading-relaxed">{t('isolation.body2')}</p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Decay + dream consolidation */}
      <section aria-labelledby="decay-heading" className="py-16 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="decay-heading" className="text-center mb-8">
            {t('decay.title')}
          </SectionHeading>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="text-left">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {t('decay.decayTitle')}
                </h3>
                <p className="text-text-secondary leading-relaxed">{t('decay.decayBody')}</p>
              </GlassCard>
              <GlassCard className="text-left">
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {t('decay.dreamTitle')}
                </h3>
                <p className="text-text-secondary leading-relaxed">{t('decay.dreamBody')}</p>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Week 1 vs Week 12 comparison */}
      <section aria-labelledby="progress-heading" className="py-16 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="progress-heading" className="text-center mb-8">
            {t('progress.title')}
          </SectionHeading>
          <p className="text-center text-text-secondary max-w-2xl mx-auto mb-10">
            {t('progress.subtitle')}
          </p>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="text-left">
                <div className="text-sm font-semibold text-text-muted uppercase tracking-wide mb-3">
                  {t('progress.week1Label')}
                </div>
                <p className="text-text-secondary leading-relaxed">{t('progress.week1Body')}</p>
              </GlassCard>
              <GlassCard className="text-left" highlighted>
                <div className="text-sm font-semibold text-accent-system uppercase tracking-wide mb-3">
                  {t('progress.week12Label')}
                </div>
                <p className="text-text-secondary leading-relaxed">{t('progress.week12Body')}</p>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Contrast with ChatGPT/Jasper */}
      <section aria-labelledby="contrast-heading" className="py-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="contrast-heading" className="text-center mb-8">
            {t('contrast.title')}
          </SectionHeading>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CONTRAST_KEYS.map((key) => (
                <GlassCard key={key} className="text-left" highlighted={key === 'clyde'}>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`contrast.${key}.name`)}
                  </h3>
                  <p className="text-text-secondary leading-relaxed text-sm">
                    {t(`contrast.${key}.body`)}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="memory-cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="memory-cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8 mt-4">{t('cta.subtitle')}</p>
            <CTAButton size="lg" href="/apply">
              {t('cta.button')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
