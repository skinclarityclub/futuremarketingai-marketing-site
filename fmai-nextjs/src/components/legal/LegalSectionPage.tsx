import { getTranslations } from 'next-intl/server'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { Link } from '@/i18n/navigation'

type SectionKey = 'privacy' | 'terms' | 'cookies'

const SUBSECTIONS: Record<SectionKey, readonly string[]> = {
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
}

const SIBLING_ROUTES: Array<{ key: SectionKey; path: string }> = [
  { key: 'terms', path: '/legal/terms' },
  { key: 'privacy', path: '/legal/privacy' },
  { key: 'cookies', path: '/legal/cookies' },
]

export async function LegalSectionPage({
  locale,
  section,
}: {
  locale: string
  section: SectionKey
}) {
  const t = await getTranslations({ locale, namespace: 'legal' })
  const path = `/legal/${section}`
  const sectionTitle = t(`sections.${section}.title`)
  const subsectionKeys = SUBSECTIONS[section]

  return (
    <PageShell>
      <WebPageJsonLd name={sectionTitle} description={t(`sections.${section}.content`)} path={path} locale={locale} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: t('hero.title'), path: '/legal' },
          { name: sectionTitle, path },
        ]}
        locale={locale}
      />

      <section className="relative pt-16 pb-8 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-display text-text-primary mb-4">
            {sectionTitle}
          </h1>
          <p className="text-sm text-text-muted">{t('last_updated')}</p>
        </div>
      </section>

      {/* Sub-nav: sibling legal pages */}
      <section className="px-6 lg:px-12 pb-4">
        <div className="max-w-3xl mx-auto flex flex-wrap justify-center gap-2">
          {SIBLING_ROUTES.map(({ key, path: siblingPath }) => (
            <Link
              key={key}
              href={siblingPath}
              className={`text-sm px-4 py-2 rounded-full border transition-colors ${
                key === section
                  ? 'bg-accent-system/10 border-accent-system/30 text-accent-system'
                  : 'bg-white/[0.02] border-border-primary text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              {t(`sections.${key}.title`)}
            </Link>
          ))}
        </div>
      </section>

      <section className="py-8 px-6 lg:px-12" aria-labelledby="legal-content">
        <article className="max-w-3xl mx-auto">
          <div className="bg-white/[0.02] border border-border-primary rounded-[var(--radius-card)] p-8">
            <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
              {t(`sections.${section}.content`)}
            </p>
            {subsectionKeys.length > 0 && (
              <div className="mt-6 space-y-6">
                {subsectionKeys.map((subKey) => (
                  <div key={subKey}>
                    <SectionHeading id={`${section}-${subKey}`} className="text-lg mb-2">
                      {t(`sections.${section}.subsections.${subKey}.title`)}
                    </SectionHeading>
                    <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                      {t(`sections.${section}.subsections.${subKey}.content`)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </article>
      </section>
    </PageShell>
  )
}
