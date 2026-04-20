import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
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

      <section className="pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#F5A623]/10 border border-[#F5A623]/20 rounded-full text-sm font-medium text-[#F5A623] mb-6">
            {t('hero.counter', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
            {t('hero.title')}
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      <section className="pb-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Expectations panel */}
          <div>
            <GlassCard className="p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-text-primary mb-4">
                {t('expectations.title')}
              </h2>
              <ol className="space-y-4">
                {EXPECTATIONS_KEYS.map((key, index) => (
                  <li key={key} className="flex gap-3">
                    <span
                      aria-hidden
                      className="flex-shrink-0 w-7 h-7 rounded-full bg-accent-system/10 text-accent-system font-semibold text-sm flex items-center justify-center"
                    >
                      {index + 1}
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
              <div className="mt-6 pt-6 border-t border-border-primary">
                <p className="text-xs text-text-muted leading-relaxed">{t('expectations.reassurance')}</p>
              </div>
            </GlassCard>
          </div>

          {/* Form */}
          <div>
            <GlassCard className="p-8">
              <SectionHeading id="apply-form" className="mb-6 text-2xl">
                {t('form.title')}
              </SectionHeading>
              <ApplicationForm />
            </GlassCard>
          </div>
        </div>
      </section>
    </PageShell>
  )
}
