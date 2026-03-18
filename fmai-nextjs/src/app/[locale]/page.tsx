import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebSiteJsonLd } from '@/components/seo/WebSiteJsonLd'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { Link } from '@/i18n/navigation'
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
  return generatePageMetadata({ locale, namespace: 'home', path: '/' })
}

const SERVICE_CARDS = [
  {
    key: 'automations',
    href: '/automations',
  },
  {
    key: 'chatbots',
    href: '/chatbots',
  },
  {
    key: 'voiceAgents',
    href: '/voice-agents',
  },
  {
    key: 'marketingMachine',
    href: '/marketing-machine',
  },
] as const

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <PageShell>
      {/* JSON-LD Structured Data */}
      <WebSiteJsonLd />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/"
        locale={locale}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }]} locale={locale} />

      {/* Hero Section */}
      <section aria-labelledby="hero" className="relative pt-20 pb-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <h1
            id="hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
          >
            {t('hero.headline')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton href="/contact" size="lg">
              {t('hero.cta')}
            </CTAButton>
            <CTAButton href="/contact" variant="secondary" size="lg">
              {t('hero.ctaSecondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section aria-labelledby="services" className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <SectionHeading id="services">{t('services.title')}</SectionHeading>
          <p className="text-lg text-text-secondary text-center max-w-3xl mx-auto mb-12">
            {t('services.subtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICE_CARDS.map((card, index) => (
              <ScrollReveal key={card.key} delay={index * 0.1}>
                <Link href={card.href}>
                  <GlassCard className="h-full hover:border-border-accent transition-all cursor-pointer">
                    <h3 className="text-xl font-semibold font-display text-text-primary mb-3">
                      {t(`services.${card.key}.title`)}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {t(`services.${card.key}.description`)}
                    </p>
                  </GlassCard>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Social Proof */}
      <section aria-labelledby="trust" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading id="trust">{t('trust.title')}</SectionHeading>
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              <div className="flex items-start gap-3 text-left">
                <span className="text-accent-system mt-1 shrink-0">&#10003;</span>
                <p className="text-text-secondary">{t('trust.customBuilt')}</p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="text-accent-system mt-1 shrink-0">&#10003;</span>
                <p className="text-text-secondary">{t('trust.founderAccess')}</p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="text-accent-system mt-1 shrink-0">&#10003;</span>
                <p className="text-text-secondary">{t('trust.successGuarantee')}</p>
              </div>
              <div className="flex items-start gap-3 text-left">
                <span className="text-accent-system mt-1 shrink-0">&#10003;</span>
                <p className="text-text-secondary">{t('trust.trialCommitment')}</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Final CTA */}
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
