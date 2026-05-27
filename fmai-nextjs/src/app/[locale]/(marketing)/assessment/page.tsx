import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { PageShell } from '@/components/layout/PageShell'
import { Breadcrumbs } from '@/components/layout/Breadcrumbs'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { AssessmentClient } from './AssessmentClient'
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
  return generatePageMetadata({ locale, namespace: 'assessment', path: '/assessment' })
}

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'assessment' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/assessment"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('breadcrumb'), path: '/assessment' },
        ]}
        locale={locale}
      />
      <Breadcrumbs path="/assessment" locale={locale} />
      <AssessmentClient />

      {/* Final CTA — alternatieve path voor wie liever direct praat */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="assessment-final-cta">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <GlassCard className="p-12 text-center space-y-5">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent-human/10 border border-accent-human/30 rounded-full text-sm font-mono uppercase tracking-[0.16em] text-accent-human">
                {t('finalCta.eyebrow', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })}
              </span>
              <h2
                id="assessment-final-cta"
                className="text-3xl md:text-4xl font-bold font-display text-text-primary"
              >
                {t('finalCta.title')}
              </h2>
              <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                {t('finalCta.description')}
              </p>
              <div className="pt-2">
                <CTAButton href="/apply" size="lg">
                  {t('finalCta.button')}
                </CTAButton>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </PageShell>
  )
}
