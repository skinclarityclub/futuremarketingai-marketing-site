import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { ArrowRight, Clapperboard, Megaphone, Phone } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
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
  return generatePageMetadata({ locale, namespace: 'roadmap', path: '/roadmap' })
}

const ROADMAP_SKILLS = [
  { key: 'voiceAgent', icon: Phone, href: '/skills/voice-agent' as const },
  { key: 'adCreator', icon: Megaphone, href: '/skills/ad-creator' as const },
  { key: 'reelBuilder', icon: Clapperboard, href: '/skills/reel-builder' as const },
] as const

export default async function RoadmapPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'roadmap' })

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/roadmap"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Roadmap', path: '/roadmap' },
        ]}
        locale={locale}
      />
      <Breadcrumbs path="/roadmap" locale={locale} />

      {/* Hero */}
      <section
        aria-labelledby="roadmap-hero"
        className="relative min-h-[50vh] flex items-center px-6 lg:px-12 pt-24 lg:pt-[140px] pb-12"
      >
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F5A623]/10 border border-[#F5A623]/30 rounded-full text-xs font-semibold text-[#F5A623] uppercase tracking-wide mb-4">
            {t('hero.eyebrow')}
          </div>
          <h1
            id="roadmap-hero"
            className="text-4xl sm:text-5xl md:text-6xl font-bold font-display text-text-primary mb-6"
          >
            {t('hero.title')}
          </h1>
          <p className="text-lg lg:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Skill cards */}
      <section aria-labelledby="roadmap-skills" className="py-16 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="roadmap-skills">{t('skills.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">{t('skills.subtitle')}</p>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {ROADMAP_SKILLS.map(({ key, icon: Icon }) => (
                <GlassCard key={key} className="text-left">
                  <div className="flex items-start justify-between mb-4">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-bg-elevated">
                      <Icon className="w-5 h-5 text-accent-system" aria-hidden />
                    </div>
                    <span className="text-[10px] uppercase tracking-wider font-semibold text-[#F5A623] bg-[#F5A623]/10 border border-[#F5A623]/30 rounded px-2 py-0.5">
                      {t(`${key}.phase`)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {t(`${key}.name`)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(`${key}.description`)}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="roadmap-cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="roadmap-cta">{t('cta.title')}</SectionHeading>
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
