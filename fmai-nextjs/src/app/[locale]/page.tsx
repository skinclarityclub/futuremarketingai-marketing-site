import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebSiteJsonLd } from '@/components/seo/WebSiteJsonLd'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { Link } from '@/i18n/navigation'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { LazySection } from '@/components/motion/LazySection'
import { HeroSpline } from '@/components/hero/HeroSpline'
import { Zap, ArrowRight } from 'lucide-react'

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
  { key: 'contentCreator', href: '/skills/content-creator' },
  { key: 'voiceAgent', href: '/skills/voice-agent' },
  { key: 'leadQualifier', href: '/skills/lead-qualifier' },
  { key: 'socialMedia', href: '/skills/social-media' },
  { key: 'adCreator', href: '/skills/ad-creator' },
  { key: 'reporting', href: '/skills/reporting' },
] as const

const STAT_KEYS = ['clients', 'content', 'hours', 'languages'] as const

const BADGE_KEYS = ['gdpr', 'enterprise', 'dutch', 'uptime', 'integrations', 'noLockIn'] as const

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

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
      <FaqJsonLd
        items={FAQ_KEYS.map((key) => ({
          question: t(`faq.items.${key}.question`),
          answer: t(`faq.items.${key}.answer`),
        }))}
      />

      {/* Hero Section — Immersive layout with Spline 3D */}
      <section
        aria-labelledby="hero"
        className="relative min-h-[85vh] flex items-center px-6 lg:px-12 pt-24 lg:pt-[140px] pb-8 lg:pb-20 overflow-hidden"
      >
        {/* 3D Robot — absolute, bleeds across full hero */}
        <HeroSpline />

        <div className="flex flex-col lg:flex-row items-center w-full gap-8">
          {/* Left content */}
          <div className="relative z-10 flex-1 max-w-[720px]">
            {/* Eyebrow badge */}
            <div
              className="inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-4 lg:mb-8 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system"
              style={{ animation: 'fadeIn 0.8s ease-out' }}
            >
              {t('hero.badge')}
            </div>

            {/* Headline with gradient accent */}
            <h1
              id="hero"
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-6"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.2s both' }}
            >
              <span className="block text-text-primary">{t('hero.headlineMain')}</span>
              <span
                className="relative inline-block bg-clip-text text-transparent after:content-[''] after:absolute after:bottom-[2px] after:left-0 after:w-full after:h-[3px] after:bg-gradient-to-r after:from-[#F5A623] after:to-transparent after:rounded-sm"
                style={{ backgroundImage: 'linear-gradient(135deg, #00D4AA 0%, #F5A623 100%)' }}
              >
                {t('hero.headlineAccent')}
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-base lg:text-xl text-text-secondary max-w-xl mb-4 lg:mb-6 leading-relaxed"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              {t('hero.subtitle')}
            </p>

            {/* Trust anchor */}
            <p
              className="text-sm text-text-muted mb-6 lg:mb-10"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.5s both' }}
            >
              {t('hero.trustAnchor')}
            </p>

            {/* CTA Buttons — left-aligned */}
            <div
              className="flex flex-wrap gap-4"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <CTAButton size="lg" href="/skills/chatbot">
                <Zap className="mr-1 h-5 w-5" />
                {t('hero.cta')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </CTAButton>

              <CTAButton variant="secondary" size="lg" href="/contact">
                {t('hero.ctaSecondary')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </CTAButton>
            </div>
          </div>

          {/* Right spacer — reserves space for the absolute-positioned 3D scene */}
          <div className="flex-1 hidden lg:block" />
        </div>
      </section>

      {/* Stats / Metrics Bar */}
      <LazySection minHeight="150px">
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
      </LazySection>

      {/* Services — Numbered 2x2 Cards */}
      <LazySection minHeight="400px">
      <ScrollReveal>
        <section
          id="services"
          aria-labelledby="services-heading"
          className="relative z-10 px-6 lg:px-12 pb-20"
        >
          <div className="text-center mb-12">
            <h2
              id="services-heading"
              className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4"
            >
              {t('services.title')}
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              {t('services.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {SERVICE_CARDS.map((card) => (
              <Link
                key={card.key}
                href={card.href}
                className="relative card-gradient-border card-tilt rounded-[var(--radius-card)] bg-white/[0.02] border border-border-primary p-11 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] cursor-pointer block group"
              >
                {/* Service number */}
                <span className="font-display text-xs font-semibold text-text-muted tracking-[2px] mb-5 block">
                  {t(`services.${card.key}.number`)}
                </span>

                {/* Title */}
                <h3 className="font-display text-2xl font-bold text-text-primary tracking-tight mb-3.5">
                  {t(`services.${card.key}.title`)}
                </h3>

                {/* Description */}
                <p className="text-sm text-text-secondary leading-relaxed max-w-[380px]">
                  {t(`services.${card.key}.description`)}
                </p>

                {/* Arrow circle — bottom-right */}
                <div className="absolute bottom-9 right-9 w-10 h-10 rounded-full border border-border-primary flex items-center justify-center transition-all duration-300 group-hover:bg-[#F5A623] group-hover:border-[#F5A623]">
                  <svg
                    className="w-4 h-4 text-text-muted transition-all duration-300 group-hover:text-bg-deep group-hover:translate-x-0.5"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M4 12L12 4M12 4H6M12 4V10" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>

          {/* Final CTA after service cards */}
          <div className="text-center mt-12">
            <p className="text-text-secondary mb-6">{t('cta.subtitle')}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton size="lg" href="/pricing">
                {t('hero.ctaSecondary')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </CTAButton>
              <CTAButton variant="secondary" size="lg" href="/founding-member">
                {t('trust.trialTitle')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </CTAButton>
            </div>
          </div>
        </section>
      </ScrollReveal>
      </LazySection>

      {/* Trust Badges / Social Proof */}
      <LazySection minHeight="200px">
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
      </LazySection>

      {/* Why Teams Choose Us */}
      <LazySection minHeight="300px">
      <section aria-labelledby="trust" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto text-center">
          <SectionHeading id="trust">{t('trust.title')}</SectionHeading>
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              <GlassCard className="text-left">
                <span className="text-accent-system text-lg font-bold block mb-2">&#10003;</span>
                <p className="text-text-primary font-semibold mb-1">
                  {t('trust.customBuiltTitle')}
                </p>
                <p className="text-text-secondary text-sm">{t('trust.customBuilt')}</p>
              </GlassCard>
              <GlassCard className="text-left">
                <span className="text-accent-system text-lg font-bold block mb-2">&#10003;</span>
                <p className="text-text-primary font-semibold mb-1">
                  {t('trust.founderAccessTitle')}
                </p>
                <p className="text-text-secondary text-sm">{t('trust.founderAccess')}</p>
              </GlassCard>
              <GlassCard className="text-left">
                <span className="text-accent-system text-lg font-bold block mb-2">&#10003;</span>
                <p className="text-text-primary font-semibold mb-1">
                  {t('trust.successGuaranteeTitle')}
                </p>
                <p className="text-text-secondary text-sm">{t('trust.successGuarantee')}</p>
              </GlassCard>
              <GlassCard className="text-left">
                <span className="text-accent-system text-lg font-bold block mb-2">&#10003;</span>
                <p className="text-text-primary font-semibold mb-1">{t('trust.trialTitle')}</p>
                <p className="text-text-secondary text-sm">{t('trust.trialCommitment')}</p>
              </GlassCard>
            </div>
          </ScrollReveal>
        </div>
      </section>
      </LazySection>

      {/* FAQ Section */}
      <LazySection minHeight="400px">
      <section aria-labelledby="faq" className="py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="faq" className="text-center mb-10">
            {t('faq.title')}
          </SectionHeading>
          <ScrollReveal>
            <dl className="space-y-6">
              {FAQ_KEYS.map((key) => (
                <div key={key} className="bg-bg-surface/30 rounded-lg p-6">
                  <dt className="text-lg font-semibold text-text-primary mb-2">
                    {t(`faq.items.${key}.question`)}
                  </dt>
                  <dd className="text-text-secondary leading-relaxed">
                    {t(`faq.items.${key}.answer`)}
                  </dd>
                </div>
              ))}
            </dl>
          </ScrollReveal>
        </div>
      </section>
      </LazySection>

      {/* Final CTA */}
      <LazySection minHeight="200px">
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
            <CTAButton href="/skills/chatbot" size="lg">
              {t('cta.button')}
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
      </LazySection>
    </PageShell>
  )
}
