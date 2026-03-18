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

const STAT_KEYS = ['automations', 'support', 'growth', 'setup'] as const

const BADGE_KEYS = ['gdpr', 'enterprise', 'uptime', 'support', 'integrations', 'noLockIn'] as const

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
            <CTAButton href="/contact" size="lg" className="cta-primary">
              {t('hero.cta')}
            </CTAButton>
            <CTAButton href="/contact" variant="secondary" size="lg" className="cta-secondary">
              {t('hero.ctaSecondary')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Stats / Metrics Bar */}
      <section aria-label="Key metrics" className="py-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {STAT_KEYS.map((key) => (
                <div
                  key={key}
                  className="border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 text-center"
                >
                  <span className="block text-3xl font-bold text-accent-system mb-1">
                    {t(`stats.${key}.value`)}
                  </span>
                  <span className="text-sm text-text-secondary">{t(`stats.${key}.label`)}</span>
                </div>
              ))}
            </div>
          </ScrollReveal>
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

      {/* Trust Badges / Social Proof */}
      <section aria-labelledby="badges" className="py-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <SectionHeading id="badges">{t('badges.title')}</SectionHeading>
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10">
              {BADGE_KEYS.map((key) => (
                <div
                  key={key}
                  className="flex items-center justify-center gap-2 border border-border-primary bg-white/[0.02] backdrop-blur-sm rounded-xl px-5 py-4"
                >
                  <svg
                    className="w-5 h-5 text-accent-system shrink-0"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-text-secondary">
                    {t(`badges.${key}`)}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Why Teams Choose Us */}
      <section aria-labelledby="trust" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading id="trust">{t('trust.title')}</SectionHeading>
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              <GlassCard className="text-left">
                <span className="text-accent-system text-lg font-bold block mb-2">&#10003;</span>
                <p className="text-text-primary font-semibold mb-1">Custom-Built Solutions</p>
                <p className="text-text-secondary text-sm">{t('trust.customBuilt')}</p>
              </GlassCard>
              <GlassCard className="text-left">
                <span className="text-accent-system text-lg font-bold block mb-2">&#10003;</span>
                <p className="text-text-primary font-semibold mb-1">Direct Founder Access</p>
                <p className="text-text-secondary text-sm">{t('trust.founderAccess')}</p>
              </GlassCard>
              <GlassCard className="text-left">
                <span className="text-accent-system text-lg font-bold block mb-2">&#10003;</span>
                <p className="text-text-primary font-semibold mb-1">Success Guarantee</p>
                <p className="text-text-secondary text-sm">{t('trust.successGuarantee')}</p>
              </GlassCard>
              <GlassCard className="text-left">
                <span className="text-accent-system text-lg font-bold block mb-2">&#10003;</span>
                <p className="text-text-primary font-semibold mb-1">Risk-Free Trial</p>
                <p className="text-text-secondary text-sm">{t('trust.trialCommitment')}</p>
              </GlassCard>
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
            <CTAButton href="/contact" size="lg" className="cta-primary">
              {t('cta.button')}
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
