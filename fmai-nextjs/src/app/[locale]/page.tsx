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
import { HeroBackdrop } from '@/components/hero/HeroBackdrop'
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
import { TIER_PRICING, formatEur } from '@/lib/pricing-data'
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
        Spline preconnect + prefetch removed 2026-05-27: the prefetch was
        VeryLow-priority but still occupied bandwidth slots that competed
        with first-paint resources (CSS, fonts). SplineScene's own idle
        callback orchestrates the runtime download when needed.

        Desktop hero LCP preload — Next.js 16's `priority` prop on
        <Image> emits a preload link without `fetchpriority="high"`, so
        the WebP was getting Low priority in the browser. Adding an
        explicit preload with the high-priority hint + media-query gate
        so mobile never preloads it (mobile container is `hidden lg:block`
        and the entire SplineScene runtime is skipped via matchMedia
        inside ui/spline.tsx).

        See docs/plans/2026-05-27-hero-perf-audit.md for the full trace.
      */}
      <link
        rel="preload"
        as="image"
        fetchPriority="high"
        media="(min-width: 1024px)"
        href="/_next/image?url=%2Fimages%2Fhero-robot-preview.webp&w=1280&q=75"
        imageSrcSet="/_next/image?url=%2Fimages%2Fhero-robot-preview.webp&w=1024&q=75 1024w, /_next/image?url=%2Fimages%2Fhero-robot-preview.webp&w=1280&q=75 1280w, /_next/image?url=%2Fimages%2Fhero-robot-preview.webp&w=1536&q=75 1536w, /_next/image?url=%2Fimages%2Fhero-robot-preview.webp&w=1920&q=75 1920w"
        imageSizes="60vw"
      />

      {/*
        Hero background — statische subtle radial + grid overlay.
        Vervangt PaperShaderMesh (W5.2 reverted): user feedback animated
        WebGL mesh was te dominant. Server-rendered, geen JS, geen WebGL.
      */}
      <HeroBackdrop />

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
        tagline={t.rich('hero.tagline', {
          accent: (chunks) => <span>{chunks}</span>,
        })}
        subtitle={t('hero.subtitle')}
        trustAnchor={t('hero.trustAnchor')}
        ctaPrimary={t('hero.cta')}
        ctaSecondary={t('hero.ctaSecondary')}
        trustClusterTarget={t('hero.trustCluster.target')}
        trustClusterFounding={t('hero.trustCluster.founding', {
          taken: FOUNDING_SPOTS_TAKEN,
          total: FOUNDING_SPOTS_TOTAL,
        })}
        trustClusterAvg={t('hero.trustCluster.avgLabel')}
      />

      {/* ─────────────────────────────────────────────────────────────
          Sectie 2 — LeadMagnetCTA (AI Bureau Scan, hoog-funnel hook)
          Verplaatst van positie 14 naar 2: interactive engagement direct
          na hero. Visitor scoort zichzelf voordat-ie de rest leest.
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="280px">
        <section aria-label="AI Readiness Checklist download" className="py-12 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <LeadMagnetCTA source="home" />
          </div>
        </section>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 3 — CaseStudyCard (SKC proof anchor)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="380px">
        <ScrollReveal>
          <CaseStudyCard locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 4 — ServicesBento (12 skills incl. featured Clyde)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="500px">
        <ScrollReveal>
          <ServicesBento locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 5 — MemoryUSPTeaser (4-layer geheugen, W5.7 sequential reveal)
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
            compare={{
              eyebrow:       t('memoryUsp.compare.eyebrow'),
              promptLabel:   t('memoryUsp.compare.promptLabel'),
              responseLabel: t('memoryUsp.compare.responseLabel'),
              prompt:        t('memoryUsp.compare.prompt'),
              otherLabel:    t('memoryUsp.compare.otherLabel'),
              otherTag:      t('memoryUsp.compare.otherTag'),
              otherResponse: t('memoryUsp.compare.otherResponse'),
              otherWarning:  t('memoryUsp.compare.otherWarning'),
              clydeLabel:    t('memoryUsp.compare.clydeLabel'),
              clydeTag:      t('memoryUsp.compare.clydeTag'),
              clydeResponse: t('memoryUsp.compare.clydeResponse'),
              clydeProof:    t('memoryUsp.compare.clydeProof'),
            }}
          />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 6 — ComparisonTable (DIY / Bureau / Clyde)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="500px">
        <ScrollReveal>
          <ComparisonTable locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 7 — ProcessTimeline (W5.4 stagger reveal)
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
          Sectie 8 — FounderSection (Daley intro)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="320px">
        <ScrollReveal>
          <FounderSection locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 9 — TestimonialBlock (Sindy operator-stem)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="280px">
        <ScrollReveal>
          <TestimonialBlock locale={locale} />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 10 — TrustSignalsGrid (numerieke trust)
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
          Sectie 11 — PricingTeaser (4 tiers, W5.8 stagger reveal)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="420px">
        <ScrollReveal>
          <PricingTeaser
            eyebrow={t('pricingTeaser.eyebrow')}
            title={t('pricingTeaser.title')}
            subtitle={t('pricingTeaser.subtitle')}
            ctaLink={t('pricingTeaser.ctaLink')}
            spotsTaken={t('pricingTeaser.spotsTaken', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
            perMonth={t('pricingTeaser.perMonth')}
            perWorkspace={t('pricingTeaser.perWorkspace')}
            tiers={[
              { key: 'founding',     price: formatEur(TIER_PRICING.FOUNDING_MEMBER.pricingModel === 'fixed' ? TIER_PRICING.FOUNDING_MEMBER.price : 0, locale),                       unit: 'perMonth',     highlighted: true  },
              { key: 'growth',       price: formatEur(TIER_PRICING.GROWTH.pricingModel === 'workspace' ? TIER_PRICING.GROWTH.pricePerWorkspace : 0, locale),                          unit: 'perWorkspace', highlighted: false },
              { key: 'professional', price: formatEur(TIER_PRICING.PROFESSIONAL.pricingModel === 'workspace' ? TIER_PRICING.PROFESSIONAL.pricePerWorkspace : 0, locale),              unit: 'perWorkspace', highlighted: false },
              { key: 'enterprise',   price: formatEur(TIER_PRICING.ENTERPRISE.pricingModel === 'workspace' ? TIER_PRICING.ENTERPRISE.pricePerWorkspace : 0, locale),                  unit: 'perWorkspace', highlighted: false },
            ]}
            tierCopy={{
              founding:     { label: t('pricingTeaser.tiers.founding.label'),     tagline: t('pricingTeaser.tiers.founding.tagline'),     desc: t('pricingTeaser.tiers.founding.desc')     },
              growth:       { label: t('pricingTeaser.tiers.growth.label'),       tagline: t('pricingTeaser.tiers.growth.tagline'),       desc: t('pricingTeaser.tiers.growth.desc')       },
              professional: { label: t('pricingTeaser.tiers.professional.label'), tagline: t('pricingTeaser.tiers.professional.tagline'), desc: t('pricingTeaser.tiers.professional.desc') },
              enterprise:   { label: t('pricingTeaser.tiers.enterprise.label'),   tagline: t('pricingTeaser.tiers.enterprise.tagline'),   desc: t('pricingTeaser.tiers.enterprise.desc')   },
            }}
          />
        </ScrollReveal>
      </LazySection>

      {/* ─────────────────────────────────────────────────────────────
          Sectie 12 — Pillars bento (3 inhoudelijke tiles, was: 6 checkmarks)
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
          Sectie 13 — Trust numerieke tiles (01-04, was: 4 checkmark GlassCards)
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
          Sectie 14 — Hybrid ICP (who is this for / not for)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="400px">
        <ScrollReveal>
          <IcpSection locale={locale} />
        </ScrollReveal>
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
