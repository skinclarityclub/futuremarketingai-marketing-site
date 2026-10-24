import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { ArrowRight } from 'lucide-react'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { SectionShell } from '@/components/sections/SectionShell'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'alternatives', path: '/alternatives' })
}

// Checked 2026-10-25 against these pages; re-check prices here before republishing the copy.
const ALTERNATIVES = [
  { key: 'lindy', source: 'https://www.lindy.ai/pricing' },
  { key: 'sintra', source: 'https://sintra.ai/pricing' },
  { key: 'gosocio', source: 'https://gosocio.ai/pricing' },
  { key: 'aicollegas', source: 'https://aicollegas.nl/wat-we-doen/ai-partnership' },
] as const

const ROWS = ['what', 'price', 'agencies', 'data'] as const

export default async function AlternativesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'alternatives' })

  return (
    <PageShell showStickyCta>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/alternatives"
        locale={locale}
        speakableSelectors={['.speakable-alternatives-summary']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('hero.eyebrow'), path: '/alternatives' },
        ]}
        locale={locale}
      />
      <Breadcrumbs path="/alternatives" locale={locale} />

      {/* Hero */}
      <section aria-labelledby="alternatives-hero" className="px-6 lg:px-12 pt-16 lg:pt-24 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <EyebrowLabel className="mb-6 inline-block">{t('hero.eyebrow')}</EyebrowLabel>
          <h1
            id="alternatives-hero"
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 text-text-primary"
          >
            {t('hero.title')}
          </h1>
          <p className="speakable-alternatives-summary text-lg lg:text-xl text-text-secondary leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <p className="mt-6 text-sm text-text-muted">{t('checked')}</p>
        </div>
      </section>

      {/* What Clyde is for, so every comparison below has a fixed reference */}
      <SectionShell
        id="alternatives-clyde"
        eyebrow={t('clyde.eyebrow')}
        heading={t('clyde.title')}
        containerClassName="max-w-3xl mx-auto"
        className="bg-bg-surface/30"
      >
        <GlassCard className="text-left p-6" highlighted>
          <p className="text-text-secondary leading-relaxed">{t('clyde.body')}</p>
          <p className="mt-4 text-text-secondary leading-relaxed">
            <span className="font-semibold text-text-primary">{t('labels.price')}: </span>
            {t('clyde.price')}
          </p>
        </GlassCard>
      </SectionShell>

      {/* One card per alternative */}
      <SectionShell
        id="alternatives-list"
        eyebrow={t('list.eyebrow')}
        heading={t('list.title')}
        containerClassName="max-w-4xl mx-auto"
      >
        <div className="space-y-6">
          {ALTERNATIVES.map(({ key, source }) => {
            const name = t(`items.${key}.name`)
            return (
              <GlassCard key={key} as="article" className="text-left p-6">
                <h3 className="text-2xl font-display font-bold text-text-primary">{name}</h3>
                <dl className="mt-4 space-y-3">
                  {ROWS.map((row) => (
                    <div key={row} className="sm:grid sm:grid-cols-[9rem_1fr] sm:gap-4">
                      <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted sm:pt-1">
                        {t(`labels.${row}`)}
                      </dt>
                      <dd className="text-text-secondary leading-relaxed">{t(`items.${key}.${row}`)}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-lg border border-border-primary p-4">
                    <p className="text-sm font-semibold text-text-primary mb-1">{t('labels.pickThem', { name })}</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{t(`items.${key}.pickThem`)}</p>
                  </div>
                  <div className="rounded-lg border border-accent-system/30 p-4">
                    <p className="text-sm font-semibold text-accent-system mb-1">{t('labels.pickClyde')}</p>
                    <p className="text-sm text-text-secondary leading-relaxed">{t(`items.${key}.pickClyde`)}</p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-text-muted">
                  {t('labels.source')}{' '}
                  <a
                    href={source}
                    className="underline hover:text-text-primary break-all"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    {source.replace(/^https:\/\/(www\.)?/, '')}
                  </a>
                </p>
              </GlassCard>
            )
          })}
        </div>
        <p className="mt-8 text-sm text-text-muted text-center">{t('correction')}</p>
      </SectionShell>

      {/* CTA */}
      <SectionShell
        id="alternatives-cta"
        heading={t('cta.title')}
        intro={t('cta.body')}
        containerClassName="max-w-3xl mx-auto"
        className="bg-bg-surface/30"
      >
        <div className="flex justify-center">
          <CTAButton size="lg" href="/apply" icon={<ArrowRight className="h-4 w-4" />}>
            {t('cta.button')}
          </CTAButton>
        </div>
      </SectionShell>
    </PageShell>
  )
}
