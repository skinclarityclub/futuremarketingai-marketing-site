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
import { GradientMesh } from '@/components/hero/GradientMesh'
import { IcpSection } from '@/components/home/IcpSection'
import { CaseStudyCard } from '@/components/home/CaseStudyCard'
import { ServicesBento } from '@/components/home/ServicesBento'
import { MemoryUSPTeaser } from '@/components/home/MemoryUSPTeaser'
import { ComparisonTable } from '@/components/home/ComparisonTable'
import { ProcessTimeline } from '@/components/home/ProcessTimeline'
import { FounderSection } from '@/components/home/FounderSection'
import { TestimonialBlock } from '@/components/home/TestimonialBlock'
import { PricingTeaser } from '@/components/home/PricingTeaser'
import { LeadMagnetCTA } from '@/components/conversion/LeadMagnetCTA'
import { TrustClusterHero } from '@/components/marketing/TrustClusterHero'
import { TrustSignalsGrid } from '@/components/marketing/TrustSignalsGrid'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'
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

const BADGE_KEYS = ['gdpr', 'enterprise', 'dutch', 'uptime', 'integrations', 'noLockIn'] as const

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'home' })

  return (
    <PageShell showStickyCta>
      {/*
        Spline hero hints — home page only (Next.js 16 App Router hoists
        bare <link> elements into the document <head>). Lives here, not
        in [locale]/layout.tsx, to avoid 1.3 MB bandwidth on 86 non-home
        prerendered routes. See 13-01-PLAN.md Task 2.
      */}
      <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
      <link rel="prefetch" href="/spline/scene.splinecode" as="fetch" />

      {/*
        GradientMesh — 3 blurred animated blobs behind the home hero.
        Home-only (was previously in [locale]/layout.tsx). Position is
        fixed inset-0 so it covers the home viewport like before.
        W5.2 replaces this with PaperShaderMesh + reduced-motion fallback.
      */}
      <GradientMesh />

      {/* JSON-LD Structured Data */}
      <WebSiteJsonLd />
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/"
        locale={locale}
        speakableSelectors={['.speakable-hero', '.speakable-tldr']}
      />
      <BreadcrumbJsonLd items={[{ name: 'Home', path: '/' }]} locale={locale} />
      <FaqJsonLd
        items={FAQ_KEYS.map((key) => ({
          question: t(`faq.items.${key}.question`),
          answer: t(`faq.items.${key}.answer`),
        }))}
        path="/"
        locale={locale}
      />

      {/* ─────────────────────────────────────────────────────────────
          Sectie 1 — Hero + TrustCluster
          ──────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero"
        className="relative min-h-[85dvh] flex items-center px-6 lg:px-12 pt-24 lg:pt-[140px] pb-8 lg:pb-20 overflow-hidden"
      >
        {/* 3D Robot — absolute, bleeds across full hero */}
        <HeroSpline />

        <div className="flex flex-col lg:flex-row items-center w-full gap-8">
          {/* Left content */}
          <div className="relative z-10 flex-1 max-w-[720px]">
            {/* Eyebrow badge */}
            {/* TODO W4: replace inline animation with motion (CSS keyframe fires on mount, not viewport-gated, not interruptible) */}
            <div
              className="inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-4 lg:mb-8 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system"
              style={{ animation: 'fadeIn 0.8s ease-out' }}
            >
              {t('hero.badge', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
            </div>

            {/* Headline with gradient accent */}
            {/* TODO W4: replace inline animation with motion + word-by-word kinetic stagger (W5.6) */}
            {/* TODO W3: remove gradient accent on headlineAccent — impeccable ban, switch to solid teal */}
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
            {/* TODO W4: replace inline animation with motion */}
            <p
              className="speakable-hero text-base lg:text-xl text-text-secondary max-w-xl mb-4 lg:mb-6 leading-relaxed"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.4s both' }}
            >
              {t('hero.subtitle')}
            </p>

            {/* Trust anchor */}
            {/* TODO W4: replace inline animation with motion */}
            <p
              className="speakable-tldr text-sm text-text-muted mb-6 lg:mb-10"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.5s both' }}
            >
              {t('hero.trustAnchor')}
            </p>

            {/* Trust cluster — client proof + founding scarcity + AVG badge */}
            <TrustClusterHero
              foundingLabel={t('hero.trustCluster.founding', {
                taken: FOUNDING_SPOTS_TAKEN,
                total: FOUNDING_SPOTS_TOTAL,
              })}
              avgLabel={t('hero.trustCluster.avgLabel')}
            />

            {/* CTA Buttons — left-aligned, single dominant primary + subtle text link */}
            {/* TODO W4: replace inline animation with motion */}
            <div
              className="flex flex-col items-start gap-3"
              style={{ animation: 'fadeInUp 0.8s ease-out 0.6s both' }}
            >
              <CTAButton href="/apply" size="lg">
                <Zap className="mr-1 h-5 w-5" />
                {t('hero.cta')}
                <ArrowRight className="ml-1 h-4 w-4" />
              </CTAButton>

              <Link
                href="/skills/clyde"
                className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text-primary transition-colors underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
              >
                {t('hero.ctaSecondary')}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          {/* Right spacer — reserves space for the absolute-positioned 3D scene */}
          <div className="flex-1 hidden lg:block" />
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 2 — CaseStudyCard (SKC proof anchor)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="380px">
        <ScrollReveal>
          <CaseStudyCard locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 3 — ServicesBento (12 skills incl. featured Clyde)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="500px">
        <ScrollReveal>
          <ServicesBento locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 4 — MemoryUSPTeaser (4-layer geheugen)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="400px">
        <ScrollReveal>
          <MemoryUSPTeaser locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 5 — ComparisonTable (DIY / Bureau / Clyde)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="500px">
        <ScrollReveal>
          <ComparisonTable locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 6 — ProcessTimeline (4 weken onboarding)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="400px">
        <ScrollReveal>
          <ProcessTimeline locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 7 — FounderSection (Daley intro)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="320px">
        <ScrollReveal>
          <FounderSection locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 8 — TestimonialBlock (Sindy operator-stem)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="280px">
        <ScrollReveal>
          <TestimonialBlock locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 9 — TrustSignalsGrid (numerieke trust)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="200px">
        <section aria-labelledby="key-metrics" className="py-12 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <h2 id="key-metrics" className="sr-only">{t('stats.heading')}</h2>
            <TrustSignalsGrid
              signals={{
                caseStudy: {
                  value: t('stats.caseStudy.value'),
                  label: t('stats.caseStudy.label'),
                  linkText: t('stats.caseStudy.linkText'),
                },
                skills: {
                  value: t('stats.skills.value'),
                  label: t('stats.skills.label'),
                  linkText: t('stats.skills.linkText'),
                },
                founding: {
                  value: t('stats.founding.value', {
                    taken: FOUNDING_SPOTS_TAKEN,
                    total: FOUNDING_SPOTS_TOTAL,
                  }),
                  label: t('stats.founding.label'),
                  linkText: t('stats.founding.linkText'),
                },
                sovereignty: {
                  value: t('stats.sovereignty.value'),
                  label: t('stats.sovereignty.label'),
                  linkText: t('stats.sovereignty.linkText'),
                },
              }}
            />
          </div>
        </section>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 10 — PricingTeaser (4 tiers)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="420px">
        <ScrollReveal>
          <PricingTeaser locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 11 — Pillars (W3 vervangt door bento, was: 6 checkmarks)
          TODO W3: rename aria-labelledby="badges" → "pillars", 6 checkmarks → 3 bento pillars.
          Mirror update in tests/e2e/homepage.spec.ts lines 62-63.
          ──────────────────────────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────────────────────────
          Sectie 12 — Trust cards (W3 vervangt door numerieke 01-04 tiles)
          TODO W3: 4 GlassCards met &#10003; → 4 numerieke tiles (01-04).
          ──────────────────────────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────────────────────────
          Sectie 13 — Hybrid ICP (who is this for / not for)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="400px">
        <ScrollReveal>
          <IcpSection locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 14 — LeadMagnetCTA (mid-funnel capture, verplaatst van top)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="280px">
        <section aria-label="AI Readiness Checklist download" className="py-12 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <LeadMagnetCTA source="home" />
          </div>
        </section>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 15 — FAQ (W3 vervangt door Radix Accordion)
          TODO W3: replace <dl> by FaqAccordion (Radix UI single-collapsible).
          ──────────────────────────────────────────────────────────── */}
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

      {/* ─────────────────────────────────────────────────────────────
          Sectie 16 — Final CTA + scarcity
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="200px">
        <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto text-center">
              <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
              <p className="text-lg text-text-secondary mb-8">
                {t('cta.subtitle', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <CTAButton size="lg" href="/apply">
                  {t('cta.button')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
                <CTAButton variant="secondary" size="lg" href="/case-studies/skinclarity-club">
                  {t('cta.buttonSecondary')}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </CTAButton>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 17 — TrustStrip (SKC eerlijke claim, compact close)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="120px">
        <section aria-label="Trust strip" className="py-12 px-6 lg:px-12 border-t border-border-primary">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-text-primary font-medium mb-1">{t('trustStrip.title')}</p>
            <p className="text-sm text-text-secondary mb-3">{t('trustStrip.subtitle')}</p>
            <Link
              href="/case-studies/skinclarity-club"
              className="text-sm text-accent-system hover:underline"
            >
              {t('trustStrip.caseLink')} →
            </Link>
          </div>
        </section>
      </LazySection>
    </PageShell>
  )
}
