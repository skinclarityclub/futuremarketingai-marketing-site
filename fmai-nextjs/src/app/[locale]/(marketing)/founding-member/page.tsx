import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PageShell } from '@/components/layout/PageShell'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { ScrollReveal } from '@/components/motion/ScrollReveal'

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
    namespace: 'founding-member',
    path: '/founding-member',
  })
}

const BENEFIT_KEYS = [
  'price_lock',
  'priority',
  'influence',
  'early_access',
  'community',
  'onboarding',
] as const

const FAQ_KEYS = ['q1', 'q2', 'q3', 'q4', 'q5'] as const

export default async function FoundingMemberPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'founding-member' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/founding-member"
        locale={locale}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Founding Member', path: '/founding-member' },
        ]}
        locale={locale}
      />

      {/* Hero */}
      <section aria-labelledby="hero" className="relative pt-20 pb-16 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-system/10 border border-accent-system/20 rounded-full mb-6">
            <span className="text-sm font-medium text-accent-system">{t('hero.badge')}</span>
          </div>
          <h1
            id="hero"
            className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto mb-10">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section aria-labelledby="pricing" className="py-16 px-6 lg:px-12">
        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <GlassCard highlighted>
              <div className="text-center py-4">
                <h2 id="pricing" className="text-2xl font-bold font-display text-text-primary mb-6">
                  {t('pricing.heading')}
                </h2>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-sm text-text-secondary">{t('pricing.currency')}</span>
                  <span className="text-6xl font-bold font-display text-accent-system">
                    {t('pricing.price')}
                  </span>
                  <span className="text-lg text-text-secondary">{t('pricing.period')}</span>
                </div>
                <p className="text-sm font-semibold text-accent-system mb-2">
                  {t('pricing.locked')}
                </p>
                <p className="text-sm text-text-muted mb-4">{t('pricing.comparison')}</p>
                <p className="text-text-secondary">{t('pricing.includes')}</p>
              </div>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Value Proposition */}
      <section aria-labelledby="value-prop" className="py-16 px-6 lg:px-12">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2
              id="value-prop"
              className="text-2xl md:text-3xl font-bold font-display text-text-primary mb-6"
            >
              {t('value.heading')}
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-4">
              {t('value.line1')}
            </p>
            <p className="text-lg text-text-secondary leading-relaxed mb-4">
              {t('value.line2')}
            </p>
            <p className="text-lg font-semibold text-accent-system">
              {t('value.line3')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Benefits */}
      <section aria-labelledby="benefits" className="py-20 px-6 lg:px-12 bg-bg-surface/30">
        <div className="max-w-5xl mx-auto">
          <SectionHeading id="benefits">{t('benefits.heading')}</SectionHeading>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
            {BENEFIT_KEYS.map((key, index) => (
              <ScrollReveal key={key} delay={index * 0.1}>
                <GlassCard>
                  <h3 className="text-lg font-semibold text-text-primary mb-2">
                    {t(`benefits.items.${key}.title`)}
                  </h3>
                  <p className="text-text-secondary">{t(`benefits.items.${key}.description`)}</p>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="py-20 px-6 lg:px-12">
        <div className="max-w-4xl mx-auto">
          <SectionHeading id="faq" className="text-center mb-10">
            {t('faq.heading')}
          </SectionHeading>
          <dl className="space-y-6">
            {FAQ_KEYS.map((key) => (
              <div key={key} className="bg-bg-surface/30 rounded-lg p-6">
                <dt className="text-lg font-semibold text-text-primary mb-2">
                  {t(`faq.items.${key}.question`)}
                </dt>
                <dd className="text-text-secondary leading-relaxed">
                  {t(`faq.items.${key}.answer`)}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section aria-labelledby="cta" className="py-20 px-6 lg:px-12">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8">{t('cta.subtitle')}</p>
            <CTAButton href="/apply" size="lg">
              {t('cta.button')}
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
