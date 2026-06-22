import type { Metadata } from 'next'
import { existsSync } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Check, Quote, X } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import {
  DALEY_PERSON_ID,
  LINKEDIN_DALEY_URL,
  WIKIDATA_DALEY_URL,
  TWITTER_URL,
} from '@/lib/seo-config'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { SectionShell } from '@/components/sections/SectionShell'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { MissionTimeline, type TimelineMilestone } from '@/components/about/MissionTimeline'
import { CapacityBar } from '@/components/about/CapacityBar'
import {
  FOUNDING_SPOTS_TAKEN,
  FOUNDING_SPOTS_TOTAL,
  MAX_PARTNERS_PER_YEAR,
} from '@/lib/constants'

const PORTRAIT_SRC = '/images/daley-portrait.webp'
const HAS_PORTRAIT = existsSync(
  path.join(process.cwd(), 'public', 'images', 'daley-portrait.webp'),
)

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
const FIT_KEYS = ['fit1', 'fit2', 'fit3', 'fit4'] as const
const NOT_FIT_KEYS = ['notFit1', 'notFit2', 'notFit3', 'notFit4'] as const
const INFRA_KEYS = ['selfHosted', 'eu', 'openStandards', 'noLockIn'] as const
const JOURNEY_KEYS = ['spark', 'prototype', 'founding', 'scale'] as const

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'about' })

  const journeyMilestones: readonly TimelineMilestone[] = JOURNEY_KEYS.map((key) => ({
    period: t(`journey.milestones.${key}.period`),
    title: t(`journey.milestones.${key}.title`),
    body: t(`journey.milestones.${key}.body`),
    current: key === 'founding',
  }))

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
      <Breadcrumbs path="/about" locale={locale} />
      <PersonJsonLd
        id={DALEY_PERSON_ID}
        name={t('founder.fullName')}
        jobTitle={t('founder.role')}
        description={t('founder.bio')}
        sameAs={[LINKEDIN_DALEY_URL, WIKIDATA_DALEY_URL, TWITTER_URL]}
        knowsAbout={[
          'AI Marketing Automation',
          'LLM Orchestration',
          'n8n workflow automation',
          'Brand Voice Modeling',
          'B2B Marketing Strategy',
          'EU AI Act Compliance',
        ]}
      />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12" aria-labelledby="about-hero">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-human/10 border border-accent-human/30 rounded-full text-sm font-mono uppercase tracking-[0.16em] text-accent-human">
            {t('hero.badge', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
          </span>
          <h1
            id="about-hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.tagline')}
          </p>
        </div>
      </section>

      {/* Mission — consolidated: intro = WHAT, callout = personal WHY origin */}
      <SectionShell
        id="about-mission"
        eyebrow={t('mission.eyebrow')}
        heading={t('mission.heading')}
        intro={t('mission.text')}
        align="left"
        containerClassName="max-w-5xl mx-auto"
        className="py-16 px-6 lg:px-12"
      >
        <ScrollReveal>
          <GlassCard className="text-left">
            <blockquote className="relative pl-6">
              <Quote
                aria-hidden
                className="absolute left-0 top-1 w-4 h-4 text-accent-system/60"
              />
              <p className="text-lg text-text-secondary leading-relaxed">
                {t('mission.personal')}
              </p>
            </blockquote>
          </GlassCard>
        </ScrollReveal>
      </SectionShell>

      {/* Build Journey — Signature Experiment */}
      <SectionShell
        id="about-journey"
        eyebrow={t('journey.eyebrow')}
        heading={t('journey.title')}
        intro={t('journey.subtitle')}
        align="center"
        containerClassName="max-w-5xl mx-auto"
        className="py-16 px-6 lg:px-12 bg-bg-surface/30"
      >
        <MissionTimeline
          milestones={journeyMilestones}
          ariaLabel={t('journey.ariaLabel')}
        />
      </SectionShell>

      {/* Market context — horizontal 3-era strip (visual differentiation from vertical journey) */}
      <SectionShell
        id="about-timeline"
        eyebrow={t('timeline.eyebrow')}
        heading={t('timeline.title')}
        align="center"
        containerClassName="max-w-6xl mx-auto"
        className="py-16 px-6 lg:px-12"
      >
        <RevealContainer className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          {ERA_KEYS.map((era) => (
            <RevealItem key={era}>
              <GlassCard
                highlighted={era === 'autonomous'}
                className={`h-full text-left ${
                  era === 'autonomous' ? 'border-accent-system/40' : ''
                }`}
              >
                <div className="text-xs font-semibold font-mono uppercase tracking-[0.16em] text-accent-system mb-2">
                  {t(`timeline.eras.${era}.year`)}
                </div>
                <h3 className="text-xl font-bold font-display text-text-primary mb-3">
                  {t(`timeline.eras.${era}.title`)}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`timeline.eras.${era}.description`)}
                </p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealContainer>

        <div className="mt-8 bg-accent-system/5 border border-accent-system/20 rounded-[var(--radius-card)] p-8 text-center">
          <p className="text-xl font-semibold text-text-primary mb-2">
            {t('timeline.key_message.title')}
          </p>
          <p className="text-text-secondary">{t('timeline.key_message.description')}</p>
        </div>
      </SectionShell>

      {/* Hybrid ICP — anti-slop: Lucide icons */}
      <SectionShell
        id="about-icp"
        eyebrow={t('icp.eyebrow')}
        heading={t('icp.title')}
        intro={t('icp.subtitle')}
        align="center"
        containerClassName="max-w-6xl mx-auto"
        className="py-16 px-6 lg:px-12"
      >
        <RevealContainer className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RevealItem>
            <GlassCard className="text-left h-full">
              <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-status-active/15 text-status-active"
                >
                  <Check className="w-4 h-4" />
                </span>
                {t('icp.fitTitle')}
              </h3>
              <ul className="space-y-4">
                {FIT_KEYS.map((key) => (
                  <li
                    key={key}
                    className="flex gap-3 text-text-secondary leading-relaxed"
                  >
                    <Check
                      aria-hidden
                      className="w-4 h-4 text-status-active mt-[5px] shrink-0"
                    />
                    <span>{t(`icp.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </RevealItem>
          <RevealItem>
            <GlassCard className="text-left h-full">
              <h3 className="text-xl font-semibold text-text-primary mb-6 flex items-center gap-3">
                <span
                  aria-hidden
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-text-muted/15 text-text-muted"
                >
                  <X className="w-4 h-4" />
                </span>
                {t('icp.notFitTitle')}
              </h3>
              <ul className="space-y-4">
                {NOT_FIT_KEYS.map((key) => (
                  <li
                    key={key}
                    className="flex gap-3 text-text-secondary leading-relaxed"
                  >
                    <X
                      aria-hidden
                      className="w-4 h-4 text-text-muted mt-[5px] shrink-0"
                    />
                    <span>{t(`icp.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </RevealItem>
        </RevealContainer>
      </SectionShell>

      {/* Infrastructure */}
      <SectionShell
        id="about-infra"
        eyebrow={t('infra.eyebrow')}
        heading={t('infra.title')}
        intro={t('infra.subtitle')}
        align="center"
        containerClassName="max-w-5xl mx-auto"
        className="py-16 px-6 lg:px-12 bg-bg-surface/30"
      >
        <RevealContainer className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INFRA_KEYS.map((key) => (
            <RevealItem key={key}>
              <GlassCard className="text-left h-full">
                <h3 className="text-base font-semibold text-text-primary mb-2">
                  {t(`infra.${key}.title`)}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {t(`infra.${key}.body`)}
                </p>
              </GlassCard>
            </RevealItem>
          ))}
        </RevealContainer>
      </SectionShell>

      {/* Capacity */}
      <SectionShell
        id="about-capacity"
        eyebrow={t('capacity.eyebrow')}
        heading={t('capacity.title')}
        align="center"
        containerClassName="max-w-4xl mx-auto"
        className="py-16 px-6 lg:px-12"
      >
        <ScrollReveal>
          <div className="space-y-6">
            <CapacityBar
              totalPerYear={MAX_PARTNERS_PER_YEAR}
              taken={FOUNDING_SPOTS_TAKEN}
              takenLabel={t('capacity.barTakenLabel')}
              availableLabel={t('capacity.barAvailableLabel')}
              legendLabel={t('capacity.barLegend')}
            />
            <GlassCard className="text-left">
              <p className="text-text-secondary leading-relaxed mb-4">
                {t('capacity.body', {
                  taken: FOUNDING_SPOTS_TAKEN,
                  total: FOUNDING_SPOTS_TOTAL,
                  maxPartners: MAX_PARTNERS_PER_YEAR,
                })}
              </p>
              <p className="text-text-secondary leading-relaxed">
                {t('capacity.reasoning', { maxPartners: MAX_PARTNERS_PER_YEAR })}
              </p>
            </GlassCard>
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* Founder bio — HAS_PORTRAIT fs.existsSync auto-flip pattern */}
      <SectionShell
        id="about-founder"
        eyebrow={t('founder.eyebrow')}
        heading={t('founder.title')}
        align="center"
        containerClassName="max-w-4xl mx-auto"
        className="py-16 px-6 lg:px-12 bg-bg-surface/30"
      >
        <ScrollReveal>
          <GlassCard className="text-left">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {HAS_PORTRAIT ? (
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden ring-2 ring-accent-system/40 shrink-0">
                  {/* Sole/first <img> on /about. priority removes the default
                      loading="lazy" so the page's first image is eager
                      (LCP_LAZY_LOADING). Single portrait — perf-safe. */}
                  <Image
                    src={PORTRAIT_SRC}
                    alt={t('founder.fullName')}
                    fill
                    sizes="(min-width: 640px) 112px, 96px"
                    className="object-cover"
                    priority
                  />
                </div>
              ) : (
                <div
                  aria-hidden
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-bg-elevated via-bg-surface to-bg-deep border border-border-primary grid place-items-center font-display font-bold text-4xl text-accent-system/80 shrink-0"
                >
                  D
                </div>
              )}
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-text-primary mb-1">
                  {t('founder.name')}
                </h3>
                <p className="text-sm text-text-muted mb-4">{t('founder.role')}</p>
                <blockquote className="relative pl-6">
                  <Quote
                    aria-hidden
                    className="absolute left-0 top-1 w-4 h-4 text-accent-system/60"
                  />
                  <p className="text-text-secondary leading-relaxed">{t('founder.bio')}</p>
                </blockquote>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      </SectionShell>

      {/* CTA — single primary button (dual-CTA pattern removed per homepage walkthrough) */}
      <SectionShell
        id="about-cta"
        eyebrow={t('cta.eyebrow')}
        heading={t('cta.title')}
        intro={t('cta.description')}
        align="center"
        containerClassName="max-w-4xl mx-auto"
        className="py-20 px-6 lg:px-12"
      >
        <div className="flex justify-center">
          <CTAButton href="/apply" size="lg" icon={<ArrowRight className="h-4 w-4" />}>
            {t('cta.demo_button')}
          </CTAButton>
        </div>
      </SectionShell>
    </PageShell>
  )
}
