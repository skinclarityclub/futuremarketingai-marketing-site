import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { Sparkles, Zap, Compass, Rocket, MessagesSquare, Gift } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { FaqJsonLd } from '@/components/seo/FaqJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SpotlightCard } from '@/components/ui/SpotlightCard'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { FoundingCounter } from '@/components/founding/FoundingCounter'
import { SpotScarcityGrid } from '@/components/founding/SpotScarcityGrid'
import { QuickApplyTeaser } from '@/components/founding/QuickApplyTeaser'
import { FaqAccordion } from '@/components/home/FaqAccordion'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({
    locale,
    namespace: 'founding-member',
    path: '/founding-member',
  })
}

const BENEFIT_KEYS = [
  'price_lock',
  'priority',
  'influence',
  'early_access',
  'community',
  'onboarding',
] as const

const BENEFIT_ICONS = {
  price_lock: Sparkles,
  priority: Zap,
  influence: Compass,
  early_access: Rocket,
  community: MessagesSquare,
  onboarding: Gift,
} as const

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

export default async function FoundingMemberPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'founding-member' })

  const takenSpots = [
    {
      position: 1,
      name: t('scarcity.takenSpots.skc.name'),
      since: t('scarcity.takenSpots.skc.since'),
    },
  ]

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/founding-member"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Founding Member', path: '/founding-member' },
        ]}
        locale={locale}
      />
      <FaqJsonLd
        items={FAQ_KEYS.map((key) => ({
          question: t(`faq.items.${key}.question`),
          answer: t(`faq.items.${key}.answer`),
        }))}
        path="/founding-member"
        locale={locale}
      />
      <Breadcrumbs path="/founding-member" locale={locale} />

      {/* Hero */}
      <section aria-labelledby="hero" className="relative pt-20 pb-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="mb-6">
            <FoundingCounter />
          </div>
          <h1
            id="hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section aria-labelledby="pricing" className="py-16 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-6">
              <EyebrowLabel className="text-accent-human">
                {t('eyebrows.pricing')}
              </EyebrowLabel>
            </div>
            <GlassCard highlighted>
              <div className="text-center py-4">
                <h2 id="pricing" className="text-2xl font-bold font-display text-text-primary mb-6">
                  {t('pricing.heading')}
                </h2>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-sm text-text-secondary">{t('pricing.currency')}</span>
                  <span className="text-6xl font-bold font-display text-accent-system">
                    {t('pricing.price')}
                  </span>
                  <span className="text-lg text-text-secondary">{t('pricing.period')}</span>
                </div>
                <p className="text-sm font-semibold text-accent-system mb-2">
                  {t('pricing.locked')}
                </p>
                <p className="text-sm text-text-muted mb-4">{t('pricing.comparison')}</p>
                <p className="text-text-secondary">{t('pricing.includes')}</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Value Proposition */}
      <section aria-labelledby="value-prop" className="py-16 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <EyebrowLabel className="mb-4 inline-block">
              {t('eyebrows.value')}
            </EyebrowLabel>
            <h2
              id="value-prop"
              className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-6"
            >
              {t('value.heading')}
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-4">
              {t('value.line1')}
            </p>
            <p className="text-lg text-text-secondary leading-relaxed mb-4">
              {t('value.line2')}
            </p>
            <p className="text-lg font-semibold text-accent-system">
              {t('value.line3')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Scarcity grid — Fase 6 signature */}
      <section aria-labelledby="scarcity" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <EyebrowLabel className="mb-3 inline-block text-accent-human">
              {t('eyebrows.scarcity')}
            </EyebrowLabel>
            <h2
              id="scarcity"
              className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-4"
            >
              {t('scarcity.heading')}
            </h2>
            <p className="text-base text-text-secondary leading-relaxed max-w-2xl mx-auto">
              {t('scarcity.intro')}
            </p>
          </div>
          <SpotScarcityGrid
            total={FOUNDING_SPOTS_TOTAL}
            takenSpots={takenSpots}
            openHeading={t('scarcity.open.heading')}
            openLabel={t('scarcity.open.body')}
            ariaLabel={t('scarcity.ariaLabel')}
          />
        </div>
      </section>

      {/* Benefits bento */}
      <section aria-labelledby="benefits" className="py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <EyebrowLabel className="mb-3 inline-block">
              {t('eyebrows.benefits')}
            </EyebrowLabel>
            <h2
              id="benefits"
              className="text-2xl md:text-3xl font-bold font-display text-text-primary"
            >
              {t('benefits.heading')}
            </h2>
          </div>
          <RevealContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BENEFIT_KEYS.map((key, index) => {
              const Icon = BENEFIT_ICONS[key]
              const isFeatured = index === 0
              return (
                <RevealItem
                  key={key}
                  className={isFeatured ? 'md:col-span-2 lg:row-span-2' : ''}
                >
                  <SpotlightCard
                    className={`spotlight-card group h-full block rounded-2xl border bg-bg-surface/40 p-6 transition-colors duration-200 ${
                      isFeatured
                        ? 'border-accent-human/30 bg-gradient-to-br from-[#F5A623]/8 via-bg-surface/40 to-bg-surface/10'
                        : 'border-border-primary hover:border-accent-system/30'
                    }`}
                  >
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl mb-4 ${
                        isFeatured
                          ? 'bg-accent-human/15 text-accent-human'
                          : 'bg-accent-system/10 text-accent-system'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <h3 className={`font-semibold text-text-primary mb-2 ${isFeatured ? 'text-xl' : 'text-lg'}`}>
                      {t(`benefits.items.${key}.title`)}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {t(`benefits.items.${key}.description`)}
                    </p>
                  </SpotlightCard>
                </RevealItem>
              )
            })}
          </RevealContainer>
        </div>
      </section>

      {/* Quick apply teaser */}
      <section aria-labelledby="quick-apply" className="py-16 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-6">
              <EyebrowLabel className="text-accent-human">
                {t('eyebrows.quickApply')}
              </EyebrowLabel>
              <h2 id="quick-apply" className="sr-only">
                {t('quickApply.heading')}
              </h2>
            </div>
            <QuickApplyTeaser
              locale={locale}
              copy={{
                eyebrow: t('quickApply.eyebrow'),
                heading: t('quickApply.heading'),
                subheading: t('quickApply.subheading'),
                emailLabel: t('quickApply.emailLabel'),
                emailPlaceholder: t('quickApply.emailPlaceholder'),
                agencyLabel: t('quickApply.agencyLabel'),
                agencyPlaceholder: t('quickApply.agencyPlaceholder'),
                cta: t('quickApply.cta'),
                emailInvalid: t('quickApply.emailInvalid'),
                reassurance: t('quickApply.reassurance'),
                ariaLabel: t('quickApply.ariaLabel'),
              }}
            />
          </ScrollReveal>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <EyebrowLabel className="mb-3 inline-block">
              {t('eyebrows.faq')}
            </EyebrowLabel>
            <h2 id="faq" className="text-2xl md:text-3xl font-bold font-display text-text-primary">
              {t('faq.heading')}
            </h2>
          </div>
          <FaqAccordion
            items={FAQ_KEYS.map((key) => ({
              key,
              question: t(`faq.items.${key}.question`),
              answer: t(`faq.items.${key}.answer`),
            }))}
          />
        </div>
      </section>

      {/* SKC proof */}
      <section aria-labelledby="proof" className="py-16 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <EyebrowLabel className="mb-3 inline-block">
              {t('eyebrows.proof')}
            </EyebrowLabel>
            <h2 id="proof" className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-4">
              {t('proof.heading')}
            </h2>
            <p className="text-text-secondary leading-relaxed mt-4 mb-6">
              {t('proof.body')}
            </p>
            <CTAButton href="/case-studies/skinclarity-club" variant="secondary">
              {t('proof.caseButton')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </CTAButton>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <EyebrowLabel className="mb-3 inline-block text-accent-human">
              {t('eyebrows.cta')}
            </EyebrowLabel>
            <h2 id="cta" className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              {t('cta.subtitle', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
            </p>
            <CTAButton href="/apply" size="lg">
              {t('cta.button')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
