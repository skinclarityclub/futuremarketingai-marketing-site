import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
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
// Below-the-fold client components — split out of the main chunk so the
// hero LCP doesn't have to wait for their JS to parse. Each still SSRs
// (ssr: true) so SEO + crawlers see real content. The browser fetches
// each chunk in parallel after the main chunk finishes downloading.
const MemoryUSPTeaser = dynamic(() =>
  import('@/components/home/MemoryUSPTeaser').then((m) => ({ default: m.MemoryUSPTeaser }))
)
import { ComparisonTable } from '@/components/home/ComparisonTable'
const ProcessTimeline = dynamic(() =>
  import('@/components/home/ProcessTimeline').then((m) => ({ default: m.ProcessTimeline }))
)
import { FounderSection } from '@/components/home/FounderSection'
import { TestimonialBlock } from '@/components/home/TestimonialBlock'
const PricingTeaser = dynamic(() =>
  import('@/components/home/PricingTeaser').then((m) => ({ default: m.PricingTeaser }))
)
import { TIER_PRICING, formatEur } from '@/lib/pricing-data'
const FaqAccordion = dynamic(() =>
  import('@/components/home/FaqAccordion').then((m) => ({ default: m.FaqAccordion }))
)
const LeadMagnetCTA = dynamic(() =>
  import('@/components/conversion/LeadMagnetCTA').then((m) => ({ default: m.LeadMagnetCTA }))
)
const TrustSignalsGrid = dynamic(() =>
  import('@/components/marketing/TrustSignalsGrid').then((m) => ({ default: m.TrustSignalsGrid }))
)
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'
import { getPillarPosts, getClusterPosts } from '@/lib/blog'
import { KennisbankTeaser, type KennisbankCard } from '@/components/home/KennisbankTeaser'
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

  // Featured cornerstone cards for the Kennisbank teaser. Pulled from real MDX
  // frontmatter so titles/snippets never drift. NL has content now; EN/ES stay
  // empty (section self-hides) until the cornerstones are translated.
  const pillars = getPillarPosts(locale)
  const geoPillar = pillars.find((p) => p.category === 'geo')
  const aiPillar = pillars.find((p) => p.category === 'ai-marketing-automation')
  const agencyPillar = pillars.find((p) => p.category === 'agency-ops')
  const productPillar = pillars.find((p) => p.category === 'product-clyde')
  const comparison = getClusterPosts('ai-marketing-automation-voor-bureaus', locale).find(
    (p) => p.slug === 'clyde-vs-jasper-chatgpt-semrush'
  )
  const kennisbankItems: KennisbankCard[] = [
    geoPillar && { ...geoPillar, kind: 'pillar' as const },
    aiPillar && { ...aiPillar, kind: 'pillar' as const },
    agencyPillar && { ...agencyPillar, kind: 'pillar' as const },
    productPillar && { ...productPillar, kind: 'pillar' as const },
    comparison && { ...comparison, kind: 'comparison' as const },
  ]
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      readTime: p.readTime ?? 1,
      kind: p.kind,
    }))

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
              '1': { label: t('processTimeline.weeks.1.label'), heading: t('processTimeline.weeks.1.heading'), body: t('processTimeline.weeks.1.body'), deliverable: t('processTimeline.weeks.1.deliverable'), clientHours: t('processTimeline.weeks.1.clientHours') },
              '2': { label: t('processTimeline.weeks.2.label'), heading: t('processTimeline.weeks.2.heading'), body: t('processTimeline.weeks.2.body'), deliverable: t('processTimeline.weeks.2.deliverable'), clientHours: t('processTimeline.weeks.2.clientHours') },
              '3': { label: t('processTimeline.weeks.3.label'), heading: t('processTimeline.weeks.3.heading'), body: t('processTimeline.weeks.3.body'), deliverable: t('processTimeline.weeks.3.deliverable'), clientHours: t('processTimeline.weeks.3.clientHours') },
              '4': { label: t('processTimeline.weeks.4.label'), heading: t('processTimeline.weeks.4.heading'), body: t('processTimeline.weeks.4.body'), deliverable: t('processTimeline.weeks.4.deliverable'), clientHours: t('processTimeline.weeks.4.clientHours') },
            }}
            ctaLabel={t('processTimeline.ctaLabel')}
            ctaHint={t('processTimeline.ctaHint')}
            fullJourneyLink={t('processTimeline.fullJourneyLink')}
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
      <LazySection minHeight="280px">
        <section aria-labelledby="key-metrics" className="py-16 lg:py-20 px-6 lg:px-12">
          <div className="max-w-6xl mx-auto">
            <h2 id="key-metrics" className="sr-only">{t('stats.heading')}</h2>
            <TrustSignalsGrid
              eyebrow={t('stats.eyebrow')}
              hero={{
                valueLead: t('stats.hero.valueLead'),
                valueTrail: t('stats.hero.valueTrail'),
                label: t('stats.hero.label'),
                detail: t('stats.hero.detail'),
                linkText: t('stats.hero.linkText'),
              }}
              signals={{
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
            futurePhaseEyebrow={t('pricingTeaser.futurePhaseEyebrow')}
            futureAvailability={t('pricingTeaser.futureAvailability')}
            foundingCtaLabel={t('pricingTeaser.foundingCtaLabel')}
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
            <div className="text-center max-w-2xl mx-auto">
              <SectionHeading id="pillars">{t('pillars.title')}</SectionHeading>
              <p className="mt-4 text-base lg:text-lg text-text-secondary leading-relaxed">
                {t('pillars.subtitle')}
              </p>
            </div>
            <ScrollReveal>
              <div className="mt-10 grid grid-cols-1 md:grid-cols-4 gap-4 lg:gap-5 auto-rows-fr">
                {/* Tile A — Compliance, spans 2 cols on desktop, typographic 2-line */}
                <div className="md:col-span-2 relative rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] p-7 lg:p-9 flex flex-col justify-between min-h-[220px]">
                  <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-accent-system">
                    <ShieldCheck className="w-4 h-4" aria-hidden />
                    {t('pillars.compliance.label')}
                  </div>
                  <h3 className="font-display text-4xl md:text-5xl font-bold text-text-primary tracking-tight my-6 leading-[1.05]">
                    <span className="block">{t('pillars.compliance.headingLine1')}</span>
                    <span className="block">{t('pillars.compliance.headingLine2')}</span>
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-md">
                    {t('pillars.compliance.body')}
                  </p>
                  <Link
                    href="/privacy"
                    className="mt-5 inline-flex items-center gap-1 text-xs text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm self-start"
                  >
                    {t('pillars.compliance.linkText')}
                    <ArrowRight className="w-3 h-3 shrink-0" aria-hidden />
                  </Link>
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
                  <Link
                    href="/memory"
                    className="mt-4 inline-flex items-center gap-1 text-xs text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm self-start"
                  >
                    {t('pillars.infrastructure.linkText')}
                    <ArrowRight className="w-3 h-3 shrink-0" aria-hidden />
                  </Link>
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
                  <Link
                    href="/about"
                    className="mt-4 inline-flex items-center gap-1 text-xs text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm self-start"
                  >
                    {t('pillars.partnership.linkText')}
                    <ArrowRight className="w-3 h-3 shrink-0" aria-hidden />
                  </Link>
                </div>
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
          Sectie 14b — KennisbankTeaser (cornerstone hub → /resources)
          Internal links naar de 2 pillars + comparison money-page. Self-hides
          wanneer er geen cornerstone-content voor de locale is (EN/ES voorlopig).
          ──────────────────────────────────────────────────────────── */}
      {kennisbankItems.length > 0 && (
        <LazySection minHeight="360px">
          <ScrollReveal>
            <KennisbankTeaser
              eyebrow={t('kennisbank.eyebrow')}
              title={t('kennisbank.title')}
              intro={t('kennisbank.intro')}
              ctaLabel={t('kennisbank.ctaLabel')}
              badgePillar={t('kennisbank.badgePillar')}
              badgeComparison={t('kennisbank.badgeComparison')}
              readLabel={t('kennisbank.readLabel')}
              readTimeLabel={t('kennisbank.readTimeLabel')}
              items={kennisbankItems}
            />
          </ScrollReveal>
        </LazySection>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Sectie 15 — FAQ (Radix Accordion, type=single collapsible)
          ──────────────────────────────────────────────────────────── */}
      <LazySection minHeight="400px">
        <section aria-labelledby="faq" className="py-20 px-6 lg:px-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <SectionHeading id="faq">{t('faq.title')}</SectionHeading>
              <p className="mt-4 text-base lg:text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
                {t('faq.subtitle')}
              </p>
            </div>
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
      <LazySection minHeight="280px">
        <section aria-labelledby="cta" className="py-20 lg:py-28 px-6 lg:px-12">
          <ScrollReveal>
            <div className="relative max-w-4xl mx-auto rounded-3xl border border-accent-human/30 bg-gradient-to-br from-accent-human/[0.08] via-bg-surface/30 to-transparent p-8 md:p-12 lg:p-16 text-center overflow-hidden">
              <span
                aria-hidden
                className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-accent-human/[0.08] blur-3xl"
              />
              <div className="relative">
                <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-human mb-5">
                  {t('cta.eyebrow', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
                </p>
                <h2
                  id="cta"
                  className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-[1.05] mb-6"
                >
                  {t('cta.title')}
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
                  {t('cta.subtitle')}
                </p>
                <CTAButton
                  size="lg"
                  href="/apply"
                  variant="primary"
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {t('cta.button')}
                </CTAButton>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </LazySection>

    </PageShell>
  )
}
