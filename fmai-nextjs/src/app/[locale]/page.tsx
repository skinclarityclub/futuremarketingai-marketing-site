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
import { CTAButton } from '@/components/ui/CTAButton'
import { Link } from '@/i18n/navigation'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { LazySection } from '@/components/motion/LazySection'
import { PaperShaderMesh } from '@/components/hero/PaperShaderMesh'
import { HeroSection } from '@/components/home/HeroSection'
import { IcpSection } from '@/components/home/IcpSection'
import { CaseStudyCard } from '@/components/home/CaseStudyCard'
import { ServicesBento } from '@/components/home/ServicesBento'
import { MemoryUSPTeaser } from '@/components/home/MemoryUSPTeaser'
import { ComparisonTable } from '@/components/home/ComparisonTable'
import { ProcessTimeline } from '@/components/home/ProcessTimeline'
import { FounderSection } from '@/components/home/FounderSection'
import { TestimonialBlock } from '@/components/home/TestimonialBlock'
import { PricingTeaser } from '@/components/home/PricingTeaser'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { LeadMagnetCTA } from '@/components/conversion/LeadMagnetCTA'
import { TrustSignalsGrid } from '@/components/marketing/TrustSignalsGrid'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'
import { ArrowRight, ShieldCheck, ServerCog, Handshake } from 'lucide-react'

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
        Hero background — Paper Shaders WebGL MeshGradient (W5.2).
        Home-only. Dynamic-imported client-only; reduced-motion users fall
        back to the static GradientMesh blobs.
      */}
      <PaperShaderMesh />

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
          Sectie 1 — Hero + TrustCluster (W4 motion migration)
          ──────────────────────────────────────────────────────────── */}
      <HeroSection
        badge={t('hero.badge', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
        headlineMain={t('hero.headlineMain')}
        headlineAccent={t('hero.headlineAccent')}
        subtitle={t('hero.subtitle')}
        trustAnchor={t('hero.trustAnchor')}
        ctaPrimary={t('hero.cta')}
        ctaSecondary={t('hero.ctaSecondary')}
        trustClusterFounding={t('hero.trustCluster.founding', {
          taken: FOUNDING_SPOTS_TAKEN,
          total: FOUNDING_SPOTS_TOTAL,
        })}
        trustClusterAvg={t('hero.trustCluster.avgLabel')}
      />

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
          Sectie 4 — MemoryUSPTeaser (4-layer geheugen, W5.7 sequential reveal)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="400px">
        <ScrollReveal>
          <MemoryUSPTeaser
            eyebrow={t('memoryUsp.eyebrow')}
            title={t('memoryUsp.title')}
            intro={t('memoryUsp.intro')}
            ctaLink={t('memoryUsp.ctaLink')}
            layers={{
              context:    { label: t('memoryUsp.layers.context.label'),    body: t('memoryUsp.layers.context.body')    },
              merken:     { label: t('memoryUsp.layers.merken.label'),     body: t('memoryUsp.layers.merken.body')     },
              historie:   { label: t('memoryUsp.layers.historie.label'),   body: t('memoryUsp.layers.historie.body')   },
              voorkeuren: { label: t('memoryUsp.layers.voorkeuren.label'), body: t('memoryUsp.layers.voorkeuren.body') },
            }}
          />
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
          Sectie 6 — ProcessTimeline (W5.4 pin-stack scrub desktop)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="400px">
        <ScrollReveal>
          <ProcessTimeline
            eyebrow={t('processTimeline.eyebrow')}
            title={t('processTimeline.title')}
            subtitle={t('processTimeline.subtitle')}
            weeks={{
              '1': { label: t('processTimeline.weeks.1.label'), heading: t('processTimeline.weeks.1.heading'), body: t('processTimeline.weeks.1.body') },
              '2': { label: t('processTimeline.weeks.2.label'), heading: t('processTimeline.weeks.2.heading'), body: t('processTimeline.weeks.2.body') },
              '3': { label: t('processTimeline.weeks.3.label'), heading: t('processTimeline.weeks.3.heading'), body: t('processTimeline.weeks.3.body') },
              '4': { label: t('processTimeline.weeks.4.label'), heading: t('processTimeline.weeks.4.heading'), body: t('processTimeline.weeks.4.body') },
            }}
          />
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
          Sectie 11 — Pillars bento (3 inhoudelijke tiles, was: 6 checkmarks)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="280px">
        <section aria-labelledby="pillars" className="py-20 px-6 lg:px-12">
          <div className="max-w-5xl mx-auto">
            <SectionHeading id="pillars" className="text-center">{t('pillars.title')}</SectionHeading>
            <ScrollReveal>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-5 auto-rows-fr">
                {/* Tile A — Compliance, spans 2 cols on desktop, typographic */}
                <div className="md:col-span-2 relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-7 lg:p-9 flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-accent-system">
                    <ShieldCheck className="w-4 h-4" aria-hidden />
                    {t('pillars.compliance.label')}
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary tracking-tight my-6 leading-[1.05]">
                    {t('pillars.compliance.heading')}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                    {t('pillars.compliance.body')}
                  </p>
                </div>

                {/* Tile B — Infrastructure, single col, numeric */}
                <div className="md:col-span-1 relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-6 flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-accent-system">
                    <ServerCog className="w-4 h-4" aria-hidden />
                    {t('pillars.infrastructure.label')}
                  </div>
                  <div className="my-4">
                    <p className="font-display text-5xl lg:text-6xl font-bold text-accent-system leading-none">
                      {t('pillars.infrastructure.stat')}
                    </p>
                    <p className="mt-2 text-xs font-mono uppercase tracking-[0.14em] text-text-muted">
                      {t('pillars.infrastructure.statLabel')}
                    </p>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {t('pillars.infrastructure.body')}
                  </p>
                </div>

                {/* Tile C — Partnership, single col, numeric */}
                <div className="md:col-span-1 relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-6 flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-accent-system">
                    <Handshake className="w-4 h-4" aria-hidden />
                    {t('pillars.partnership.label')}
                  </div>
                  <div className="my-4">
                    <p className="font-display text-5xl lg:text-6xl font-bold text-accent-system leading-none">
                      {t('pillars.partnership.stat')}
                    </p>
                    <p className="mt-2 text-xs font-mono uppercase tracking-[0.14em] text-text-muted">
                      {t('pillars.partnership.statLabel')}
                    </p>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {t('pillars.partnership.body')}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 12 — Trust numerieke tiles (01-04, was: 4 checkmark GlassCards)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="300px">
        <section aria-labelledby="trust" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
          <div className="max-w-5xl mx-auto">
            <SectionHeading id="trust" className="text-center">{t('trust.title')}</SectionHeading>
            <ScrollReveal>
              <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
                {[
                  { num: '01', titleKey: 'customBuiltTitle', bodyKey: 'customBuilt'       },
                  { num: '02', titleKey: 'founderAccessTitle', bodyKey: 'founderAccess'   },
                  { num: '03', titleKey: 'successGuaranteeTitle', bodyKey: 'successGuarantee' },
                  { num: '04', titleKey: 'trialTitle', bodyKey: 'trialCommitment'         },
                ].map(({ num, titleKey, bodyKey }) => (
                  <div
                    key={num}
                    className="flex flex-col"
                  >
                    <span
                      aria-hidden
                      className="font-display text-6xl lg:text-7xl font-bold text-accent-system leading-none mb-4"
                    >
                      {num}
                    </span>
                    <span className="block w-10 h-px bg-accent-system/40 mb-4" aria-hidden />
                    <p className="font-display text-lg font-bold text-text-primary mb-2">
                      {t(`trust.${titleKey}`)}
                    </p>
                    <p className="text-sm text-text-secondary leading-relaxed">
                      {t(`trust.${bodyKey}`)}
                    </p>
                  </div>
                ))}
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
          Sectie 15 — FAQ (Radix Accordion, type=single collapsible)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="400px">
        <section aria-labelledby="faq" className="py-20 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <SectionHeading id="faq" className="text-center mb-10">
              {t('faq.title')}
            </SectionHeading>
            <ScrollReveal>
              <FaqAccordion
                items={FAQ_KEYS.map((key) => ({
                  key,
                  question: t(`faq.items.${key}.question`),
                  answer: t(`faq.items.${key}.answer`),
                }))}
              />
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
