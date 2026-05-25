import type { Metadata } from 'next'
import { Suspense } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { RevealContainer, RevealItem } from '@/components/sections/RevealContainer'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { ApplicationForm } from '@/components/apply/ApplicationForm'
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
  return generatePageMetadata({ locale, namespace: 'apply', path: '/apply' })
}

const EXPECTATIONS_KEYS = ['step1', 'step2', 'step3'] as const

export default async function ApplyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'apply' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/apply"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Apply', path: '/apply' },
        ]}
        locale={locale}
      />
      <Breadcrumbs path="/apply" locale={locale} />

      <section className="pt-24 pb-12 px-6 lg:px-12" aria-labelledby="apply-hero">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-human/10 border border-accent-human/20 rounded-full text-sm font-medium text-accent-human">
            {t('hero.counter', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
          </div>
          <h1
            id="apply-hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary"
          >
            {t('hero.title')}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="pb-20 px-6 lg:px-12">
        <RevealContainer className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Expectations panel */}
          <RevealItem>
            <GlassCard className="p-6 sticky top-24 space-y-5">
              <div className="space-y-2">
                <EyebrowLabel>{t('expectations.eyebrow')}</EyebrowLabel>
                <h2 className="text-lg font-semibold text-text-primary">
                  {t('expectations.title')}
                </h2>
              </div>
              <ol className="space-y-4">
                {EXPECTATIONS_KEYS.map((key, index) => (
                  <li key={key} className="flex gap-3">
                    <span
                      aria-hidden
                      className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-system/15 text-accent-system font-mono font-semibold text-sm flex items-center justify-center"
                    >
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <p className="text-text-primary text-sm font-medium">
                        {t(`expectations.${key}.title`)}
                      </p>
                      <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                        {t(`expectations.${key}.body`)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="pt-5 border-t border-border-primary">
                <p className="text-xs text-text-muted leading-relaxed">
                  {t('expectations.reassurance')}
                </p>
              </div>
            </GlassCard>
          </RevealItem>

          {/* Form */}
          <RevealItem>
            <div className="rounded-[var(--radius-card)] bg-gradient-to-br from-bg-surface to-bg-deep border border-border-primary p-8 space-y-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
              <div className="space-y-2">
                <EyebrowLabel>{t('form.eyebrow')}</EyebrowLabel>
                <h2
                  id="apply-form"
                  className="text-2xl font-bold font-display text-text-primary"
                >
                  {t('form.title')}
                </h2>
              </div>
              <Suspense fallback={null}>
                <ApplicationForm />
              </Suspense>
            </div>
          </RevealItem>
        </RevealContainer>
      </section>
    </PageShell>
  )
}
