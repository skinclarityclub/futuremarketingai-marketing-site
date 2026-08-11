import type { Metadata } from 'next'
import { Suspense } from 'react'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { SectionShell } from '@/components/sections/SectionShell'
import { ApplyWizardClient } from '@/components/apply/ApplyWizardClient'
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

      {/* Hero — scarcity-anchored */}
      <section className="pt-24 pb-8 px-6 lg:px-12" aria-labelledby="apply-hero">
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <EyebrowLabel>{t('hero.eyebrow')}</EyebrowLabel>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-human/10 border border-accent-human/30 rounded-full text-sm font-mono uppercase tracking-[0.16em] text-accent-human">
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

      {/* What happens after you apply — server-rendered on purpose.
          The wizard below reads useSearchParams, so Next bails out of
          prerendering it and `fallback={null}` ships an empty subtree: every
          word of the form, the steps and the reassurance existed only in the
          client payload. Crawled 2026-08-11, this page gave Google 40 visible
          words. These three steps are static copy that was already translated
          into all three locales and rendered by nothing at all — putting them
          in the server tree is what makes the page answer "what happens if I
          apply?" for a reader who never runs the JavaScript. */}
      <SectionShell
        eyebrow={t('expectations.eyebrow')}
        heading={t('expectations.title')}
        className="py-16 px-6 lg:px-12"
        containerClassName="max-w-4xl mx-auto"
        align="center"
      >
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {(['step1', 'step2', 'step3'] as const).map((step, i) => (
            <li key={step} className="text-left">
              <span
                aria-hidden="true"
                className="mb-3 block font-mono text-sm tracking-[0.16em] text-accent-human"
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className="mb-2 text-lg font-semibold text-text-primary">
                {t(`expectations.${step}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                {t(`expectations.${step}.body`)}
              </p>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-10 max-w-2xl text-sm leading-relaxed text-text-muted">
          {t('expectations.reassurance')}
        </p>
      </SectionShell>

      {/* Wizard — multi-step qualification + branched result */}
      <Suspense fallback={null}>
        <ApplyWizardClient />
      </Suspense>
    </PageShell>
  )
}
