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
