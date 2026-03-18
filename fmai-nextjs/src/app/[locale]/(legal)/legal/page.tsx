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
