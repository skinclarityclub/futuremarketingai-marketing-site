import type { Metadata } from 'next'
import { setRequestLocale, getTranslations } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { generatePageMetadata } from '@/lib/metadata'
import { WebPageJsonLd } from '@/components/seo/WebPageJsonLd'
import { BreadcrumbJsonLd } from '@/components/seo/BreadcrumbJsonLd'
import { PersonJsonLd } from '@/components/seo/PersonJsonLd'
import { JsonLd } from '@/components/seo/JsonLd'
import { SINDY_PERSON_ID, LINKEDIN_SINDY_URL, SITE_URL } from '@/lib/seo-config'
import { PageShell } from '@/components/layout/PageShell'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ScrollReveal } from '@/components/motion/ScrollReveal'
import { ArrowRight, Instagram } from 'lucide-react'

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
    namespace: 'case_studies.skc',
    path: '/case-studies/skinclarity-club',
  })
}

const ACCOUNT_KEYS = ['account1', 'account2', 'account3'] as const
const SKILL_KEYS = ['skill1', 'skill2', 'skill3', 'skill4', 'skill5', 'skill6'] as const
const CONTENT_ROWS = ['row1', 'row2', 'row3', 'row4', 'row5', 'row6'] as const
const TIMELINE_KEYS = ['week1', 'month1', 'month3', 'now'] as const

export default async function SkcCaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  setRequestLocale(locale)

  const t = await getTranslations({ locale, namespace: 'case_studies.skc' })

  return (
    <PageShell>
      <WebPageJsonLd
        name={t('meta.title')}
        description={t('meta.description')}
        path="/case-studies/skinclarity-club"
        locale={locale}
        speakableSelectors={['.speakable-skc-summary', '.speakable-skc-outcome']}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', path: '/' },
          { name: 'Case Studies', path: '/case-studies/skinclarity-club' },
          { name: 'SkinClarity Club', path: '/case-studies/skinclarity-club' },
        ]}
        locale={locale}
      />
      {/* SKC Organization — separate from FMai org so Sindy.worksFor @id resolves */}
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          '@id': `${SITE_URL}/case-studies/skinclarity-club/#organization-skc`,
          name: 'SkinClarity Club',
          url: 'https://skinclarityclub.nl',
          description: t('client.description'),
        }}
      />
      {/* Sindy Person — operator + founder of SkinClarity Club */}
      <PersonJsonLd
        id={SINDY_PERSON_ID}
        name={t('testimonial.author.name')}
        jobTitle={t('testimonial.author.role')}
        description={t('testimonial.author.bio')}
        sameAs={[LINKEDIN_SINDY_URL]}
        worksForId={`${SITE_URL}/case-studies/skinclarity-club/#organization-skc`}
      />

      {/* Hero */}
      <section className="relative pt-24 pb-12 px-6 lg:px-12">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2.5 text-[13px] font-medium text-accent-system tracking-wide mb-6 before:content-[''] before:block before:w-6 before:h-px before:bg-accent-system">
            {t('hero.eyebrow')}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold font-display text-text-primary mb-6">
            {t('hero.title')}
          </h1>
          <p className="speakable-skc-summary text-lg lg:text-xl text-text-secondary leading-relaxed max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
        </div>
      </section>

      {/* Setup — 3 IG accounts */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="setup-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="setup-heading">{t('setup.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">{t('setup.subtitle')}</p>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {ACCOUNT_KEYS.map((key) => (
                <GlassCard key={key} className="text-left">
                  <div className="flex items-center gap-2 mb-3 text-accent-system">
                    <Instagram className="w-5 h-5" aria-hidden />
                    <span className="font-mono text-sm font-semibold">
                      {t(`setup.${key}Label`)}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mb-3 uppercase tracking-wide">
                    {t(`setup.${key}Share`)}
                  </p>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {t(`setup.${key}Body`)}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Active skills */}
      <section className="py-16 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="skills-heading">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="skills-heading">{t('skills.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">{t('skills.subtitle')}</p>
          </div>
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SKILL_KEYS.map((key) => (
                <GlassCard key={key} className="text-left">
                  <h3 className="text-base font-semibold text-text-primary mb-2">
                    {t(`skills.${key}Name`)}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {t(`skills.${key}Body`)}
                  </p>
                </GlassCard>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Content output table */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="content-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="content-heading">{t('content.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary">{t('content.subtitle')}</p>
          </div>
          <ScrollReveal>
            <GlassCard className="text-left">
              <dl className="divide-y divide-border-primary/50">
                {CONTENT_ROWS.map((key) => (
                  <div
                    key={key}
                    className="grid grid-cols-2 gap-4 py-3 first:pt-0 last:pb-0"
                  >
                    <dt className="text-text-secondary">{t(`content.${key}Label`)}</dt>
                    <dd className="text-text-primary font-medium text-right">
                      {t(`content.${key}Value`)}
                    </dd>
                  </div>
                ))}
              </dl>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Architecture */}
      <section className="py-16 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="arch-heading">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="arch-heading">{t('architecture.title')}</SectionHeading>
            <p className="mt-4 text-text-secondary max-w-2xl mx-auto">
              {t('architecture.subtitle')}
            </p>
          </div>
          <ScrollReveal>
            <GlassCard className="text-left">
              <p className="speakable-skc-outcome text-text-secondary leading-relaxed">
                {t('architecture.body')}
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-6 lg:px-12" aria-labelledby="timeline-heading">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <SectionHeading id="timeline-heading">{t('timeline.title')}</SectionHeading>
          </div>
          <ScrollReveal>
            <ol className="relative border-l border-border-primary ml-4 space-y-8">
              {TIMELINE_KEYS.map((key, index) => (
                <li key={key} className="ml-6">
                  <span
                    aria-hidden
                    className="absolute -left-[9px] flex items-center justify-center w-4 h-4 rounded-full bg-accent-system/20 border border-accent-system"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-accent-system" />
                  </span>
                  <h3 className="text-sm font-semibold text-accent-system uppercase tracking-wide mb-1">
                    {t(`timeline.${key}Label`)}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">{t(`timeline.${key}Body`)}</p>
                </li>
              ))}
            </ol>
          </ScrollReveal>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 px-6 lg:px-12 bg-bg-surface/30" aria-labelledby="testimonial">
        <div className="max-w-3xl mx-auto">
          <ScrollReveal>
            <GlassCard highlighted className="text-left p-10">
              <blockquote className="text-xl lg:text-2xl text-text-primary leading-relaxed italic mb-6">
                &ldquo;{t('testimonial.quote')}&rdquo;
              </blockquote>
              <footer className="flex items-center gap-3">
                <div
                  aria-hidden
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-system to-accent-human flex items-center justify-center text-bg-deep font-bold"
                >
                  S
                </div>
                <div>
                  <div className="font-semibold text-text-primary">{t('testimonial.authorName')}</div>
                  <div className="text-sm text-text-muted">{t('testimonial.authorRole')}</div>
                </div>
              </footer>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 lg:px-12" aria-labelledby="skc-cta">
        <ScrollReveal>
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeading id="skc-cta">{t('cta.title')}</SectionHeading>
            <p className="text-lg text-text-secondary mb-8 mt-4">{t('cta.subtitle')}</p>
            <CTAButton href="/apply" size="lg">
              {t('cta.button')}
              <ArrowRight className="ml-1 h-4 w-4" />
            </CTAButton>
          </div>
        </ScrollReveal>
      </section>
    </PageShell>
  )
}
