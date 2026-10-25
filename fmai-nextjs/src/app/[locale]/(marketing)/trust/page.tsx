import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { GlassCard } from '@/components/ui/GlassCard'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { SectionShell } from '@/components/sections/SectionShell'
import { Link } from '@/i18n/navigation'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'trust', path: '/trust' })
}

const HOSTING_KEYS = ['app', 'database', 'server', 'queues'] as const
const MODEL_KEYS = ['anthropic', 'openai'] as const
const MODEL_ROWS = ['training', 'retention', 'contract'] as const
const RETENTION_KEYS = ['chats', 'leads', 'inbox', 'uploads'] as const
const LIMIT_KEYS = ['zdr', 'model', 'cdn'] as const

const PRIVACY_EMAIL = 'privacy@future-marketing.ai'

// Read 2026-10-25; the copy in `trust.model` paraphrases these pages, so re-read them when it changes.
const SOURCES = {
  anthropicTerms: 'https://www.anthropic.com/legal/commercial-terms',
  anthropicRetention:
    'https://privacy.claude.com/en/articles/7996866-how-long-do-you-store-my-organization-s-data',
  openaiData: 'https://developers.openai.com/api/docs/guides/your-data',
} as const

function SourceLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} className="underline hover:text-text-primary" target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

export default async function TrustPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'trust' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/trust"
        locale={locale}
        speakableSelectors={['.speakable-trust-summary']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('hero.eyebrow'), path: '/trust' },
        ]}
        locale={locale}
      />
      <Breadcrumbs path="/trust" locale={locale} />

      {/* Hero */}
      <section aria-labelledby="trust-hero" className="px-6 lg:px-12 pt-16 lg:pt-24 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <EyebrowLabel className="mb-6 inline-block">{t('hero.eyebrow')}</EyebrowLabel>
          <h1
            id="trust-hero"
            className="text-4xl sm:text-5xl md:text-6xl font-display font-bold mb-6 text-text-primary"
          >
            {t('hero.title')}
          </h1>
          <p className="speakable-trust-summary text-lg lg:text-xl text-text-secondary leading-relaxed">
            {t('hero.subtitle')}
          </p>
          <p className="mt-6 text-sm text-text-muted">{t('updated')}</p>
        </div>
      </section>

      {/* Where it runs */}
      <SectionShell
        id="trust-hosting"
        eyebrow={t('hosting.eyebrow')}
        heading={t('hosting.title')}
        intro={t('hosting.intro')}
        containerClassName="max-w-5xl mx-auto"
        className="bg-bg-surface/30"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HOSTING_KEYS.map((key) => (
            <GlassCard key={key} className="text-left h-full p-6">
              <h3 className="text-base font-semibold text-text-primary">{t(`hosting.${key}.title`)}</h3>
              <p className="mt-1 mb-3 font-mono text-xs text-accent-system">{t(`hosting.${key}.place`)}</p>
              <p className="text-sm text-text-secondary leading-relaxed">{t(`hosting.${key}.body`)}</p>
            </GlassCard>
          ))}
        </div>
      </SectionShell>

      {/* The language model */}
      <SectionShell
        id="trust-model"
        eyebrow={t('model.eyebrow')}
        heading={t('model.title')}
        intro={t('model.intro')}
        containerClassName="max-w-5xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MODEL_KEYS.map((key) => (
            <GlassCard key={key} className="text-left h-full p-6">
              <h3 className="text-base font-semibold text-text-primary mb-4">{t(`model.${key}.name`)}</h3>
              <dl className="space-y-3">
                {MODEL_ROWS.map((row) => (
                  <div key={row}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-text-muted">
                      {t(`model.rows.${row}`)}
                    </dt>
                    <dd className="text-sm text-text-secondary leading-relaxed">{t(`model.${key}.${row}`)}</dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          ))}
        </div>
        <p className="mt-6 text-sm text-text-muted leading-relaxed">
          {t.rich('model.sources', {
            terms: (chunks) => <SourceLink href={SOURCES.anthropicTerms}>{chunks}</SourceLink>,
            retention: (chunks) => <SourceLink href={SOURCES.anthropicRetention}>{chunks}</SourceLink>,
            openai: (chunks) => <SourceLink href={SOURCES.openaiData}>{chunks}</SourceLink>,
          })}
        </p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          {t.rich('model.others', {
            link: (chunks) => (
              <Link href="/legal/privacy#privacy-sub_processors" className="text-accent-system hover:opacity-80">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </SectionShell>

      {/* Retention */}
      <SectionShell
        id="trust-retention"
        eyebrow={t('retention.eyebrow')}
        heading={t('retention.title')}
        intro={t('retention.intro')}
        containerClassName="max-w-3xl mx-auto"
        className="bg-bg-surface/30"
      >
        <dl className="divide-y divide-border-primary border-y border-border-primary">
          {RETENTION_KEYS.map((key) => (
            <div key={key} className="py-4 sm:grid sm:grid-cols-[1fr_1.4fr] sm:gap-6">
              <dt className="font-semibold text-text-primary">{t(`retention.${key}.what`)}</dt>
              <dd className="mt-1 sm:mt-0 text-text-secondary leading-relaxed">{t(`retention.${key}.term`)}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 text-text-secondary leading-relaxed">{t('retention.exit')}</p>
        <p className="mt-4 text-text-secondary leading-relaxed">
          {t.rich('retention.more', {
            link: (chunks) => (
              <Link href="/legal/privacy#privacy-data_retention" className="text-accent-system hover:opacity-80">
                {chunks}
              </Link>
            ),
          })}
        </p>
      </SectionShell>

      {/* What we do not promise */}
      <SectionShell
        id="trust-limits"
        eyebrow={t('limits.eyebrow')}
        heading={t('limits.title')}
        containerClassName="max-w-3xl mx-auto"
      >
        <ul className="space-y-4">
          {LIMIT_KEYS.map((key) => (
            <li key={key} className="text-left">
              <p className="font-semibold text-text-primary">{t(`limits.${key}.title`)}</p>
              <p className="text-text-secondary leading-relaxed">{t(`limits.${key}.body`)}</p>
            </li>
          ))}
        </ul>
      </SectionShell>

      {/* DPA and contact */}
      <SectionShell
        id="trust-dpa"
        eyebrow={t('dpa.eyebrow')}
        heading={t('dpa.title')}
        // "Verwerkersovereenkomst" is one word wider than a 390 px screen at the default text-3xl.
        headingClassName="text-2xl sm:text-3xl md:text-4xl lg:text-5xl"
        containerClassName="max-w-3xl mx-auto"
        className="bg-bg-surface/30"
      >
        <GlassCard className="text-left p-6" highlighted>
          <p className="text-text-secondary leading-relaxed">{t('dpa.body')}</p>
          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="mt-4 inline-block font-semibold text-accent-system hover:opacity-80"
          >
            {PRIVACY_EMAIL}
          </a>
        </GlassCard>
      </SectionShell>
    </PageShell>
  )
}
