import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  return generatePageMetadata({ locale, namespace: 'legal', path: '/legal' })
}

const SECTION_KEYS = ['terms', 'privacy', 'cookies', 'disclaimer'] as const

const SECTION_SUBSECTIONS: Record<string, string[]> = {
  terms: [
    'service_description',
    'subscription_terms',
    'ai_output_disclaimer',
    'liability_limitation',
    'data_processing',
    'termination',
    'governing_law',
  ],
  privacy: [
    'data_collected',
    'purpose_of_processing',
    'legal_basis',
    'ai_data_processing',
    'sub_processors',
    'data_retention',
    'data_subject_rights',
    'international_transfers',
    'contact',
  ],
  cookies: [],
  disclaimer: [],
}

export default async function LegalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'legal' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/legal"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('hero.title'), path: '/legal' },
        ]}
        locale={locale}
      />

      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary mb-4">
            {t('hero.title')}
          </h1>
        </div>
      </section>

      {/* Legal Content */}
      <section className="py-8 px-6 lg:px-12" aria-labelledby="legal-content">
        <article className="max-w-3xl mx-auto">
          {SECTION_KEYS.map((sectionKey) => (
            <section key={sectionKey} className="mb-12" aria-labelledby={`legal-${sectionKey}`}>
              <SectionHeading id={`legal-${sectionKey}`} className="text-2xl mb-4">
                {t(`sections.${sectionKey}.title`)}
              </SectionHeading>
              <div className="bg-white/[0.02] border border-border-primary rounded-[var(--radius-card)] p-8">
                <p className="text-text-secondary leading-relaxed">
                  {t(`sections.${sectionKey}.content`)}
                </p>
                {SECTION_SUBSECTIONS[sectionKey]?.map((subKey) => (
                  <div key={subKey} className="mt-6">
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {t(`sections.${sectionKey}.subsections.${subKey}.title`)}
                    </h3>
                    <p className="text-text-secondary leading-relaxed">
                      {t(`sections.${sectionKey}.subsections.${subKey}.content`)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}

          {/* Last Updated */}
          <div className="text-center mt-8 pb-12">
            <p className="text-sm text-text-muted">{t('last_updated')}</p>
          </div>
        </article>
      </section>
    </PageShell>
  )
}
