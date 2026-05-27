import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { HowToJsonLd } from '@/components/seo/HowToJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { SectionShell } from '@/components/sections/SectionShell'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { ImprovementLoopCycle } from '@/components/how-it-works/ImprovementLoopCycle'
import { FOUNDING_SPOTS_TAKEN, FOUNDING_SPOTS_TOTAL } from '@/lib/constants'

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
    namespace: 'how-it-works',
    path: '/how-it-works',
  })
}

const STEP_KEYS = ['apply', 'onboarding', 'configure', 'production', 'improvement'] as const
const FEATURED_STEPS = new Set(['onboarding', 'improvement'])

export default async function HowItWorksPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'how-it-works' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/how-it-works"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'How It Works', path: '/how-it-works' },
        ]}
        locale={locale}
      />
      <HowToJsonLd
        name={t('jsonLd.name')}
        description={t('jsonLd.description')}
        steps={STEP_KEYS.map((key) => ({
          name: t(`process.steps.${key}.title`),
          text: t(`process.steps.${key}.description`),
        }))}
      />
      <Breadcrumbs path="/how-it-works" locale={locale} />

      {/* Hero — scarcity anchor + inline CTA */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12" aria-labelledby="hiw-hero">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
          <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-human/10 border border-accent-human/30 rounded-full text-sm font-mono uppercase tracking-[0.16em] text-accent-human">
            {t('hero.badge', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
          </span>
          <h1
            id="hiw-hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.description')}
          </p>
          <div className="pt-2">
            <CTAButton href="/apply" size="lg">
              {t('hero.cta')}
            </CTAButton>
          </div>
        </div>
      </section>

      {/* Process Steps — vertical timeline + deliverable chips */}
      <SectionShell
        id="hiw-process"
        eyebrow={t('process.eyebrow')}
        heading={t('process.title')}
        align="center"
        className="py-12"
      >
        <RevealContainer as="ol" className="relative space-y-6">
          {/* Vertical connecting line */}
          <div
            className="pointer-events-none absolute left-[27px] md:left-[35px] top-6 bottom-6 w-px bg-gradient-to-b from-accent-system/40 via-border-primary to-accent-human/40"
            aria-hidden="true"
          />

          {STEP_KEYS.map((stepKey, index) => {
            const featured = FEATURED_STEPS.has(stepKey)
            const accent = stepKey === 'improvement' ? 'human' : 'system'
            const accentColor = featured
              ? accent === 'human'
                ? 'border-accent-human/50 bg-accent-human/[0.04]'
                : 'border-accent-system/50 bg-accent-system/[0.04]'
              : 'border-border-primary bg-bg-surface/30'
            const nodeAccent =
              accent === 'human'
                ? 'bg-accent-human/15 border-accent-human/40 text-accent-human ring-accent-human/10'
                : 'bg-accent-system/15 border-accent-system/40 text-accent-system ring-accent-system/10'

            return (
              <RevealItem key={stepKey} as="li" className="relative pl-16 md:pl-20">
                {/* Timeline node */}
                <div
                  className={`absolute left-0 top-0 w-14 h-14 md:w-[72px] md:h-[72px] rounded-[var(--radius-card)] border flex items-center justify-center ring-8 ${nodeAccent}`}
                  aria-hidden="true"
                >
                  <span className="text-xl md:text-2xl font-bold font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                <article
                  className={`rounded-[var(--radius-card)] border p-6 lg:p-7 transition-colors duration-200 ${accentColor}`}
                >
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-3">
                    <span
                      className={`font-mono text-[11px] uppercase tracking-[0.18em] ${
                        accent === 'human' ? 'text-accent-human' : 'text-accent-system'
                      }`}
                    >
                      {t(`process.steps.${stepKey}.step`)}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-text-muted">
                      · {t(`process.steps.${stepKey}.timeStamp`)}
                    </span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold font-display text-text-primary mb-3">
                    {t(`process.steps.${stepKey}.title`)}
                  </h3>
                  <p className="text-text-secondary leading-relaxed mb-5">
                    {t(`process.steps.${stepKey}.description`)}
                  </p>
                  <ul className="flex flex-wrap gap-2" aria-label="deliverables">
                    {[1, 2, 3].map((n) => (
                      <li
                        key={n}
                        className="font-mono text-[11px] uppercase tracking-[0.14em] px-2.5 py-1 rounded-full border border-border-primary bg-bg-deep/60 text-text-secondary"
                      >
                        {t(`process.steps.${stepKey}.deliverable${n}`)}
                      </li>
                    ))}
                  </ul>
                </article>
              </RevealItem>
            )
          })}
        </RevealContainer>

        {/* Loop cycle visual */}
        <ScrollReveal>
          <div className="mt-10">
            <ImprovementLoopCycle
              eyebrow={t('process.loop_eyebrow')}
              title={t('process.loop_title')}
              description={t('process.loop_description')}
              stages={[
                t('process.loop_stage1'),
                t('process.loop_stage2'),
                t('process.loop_stage3'),
                t('process.loop_stage4'),
              ]}
            />
          </div>
        </ScrollReveal>
      </SectionShell>

      {/* Final CTA — scarcity anchor */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="hiw-cta">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard className="p-12 text-center space-y-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-human/10 border border-accent-human/30 rounded-full text-sm font-mono uppercase tracking-[0.16em] text-accent-human">
                {t('cta.eyebrow', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
              </span>
              <h2
                id="hiw-cta"
                className="text-3xl md:text-4xl font-bold font-display text-text-primary"
              >
                {t('cta.title')}
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                {t('cta.description')}
              </p>
              <div className="pt-2">
                <CTAButton href="/apply" size="lg">
                  {t('cta.button')}
                </CTAButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
