import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Quote } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export async function CaseStudyCard({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.caseStudyCard' })

  return (
    <section
      aria-labelledby="case-study-skc"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-5xl mx-auto">
        <article className="relative overflow-hidden rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] backdrop-blur-sm p-8 lg:p-12">
          {/* Outcome-headline pattern (Notion-style) — compact identity + dominant narrative title */}
          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="shrink-0 grid place-items-center w-11 h-11 rounded-full bg-[#127059] p-2 shadow-[0_0_24px_rgba(18,112,89,0.22)]">
                <Image
                  src="/brand/skc-emblem.png"
                  alt={t('logoAlt')}
                  width={746}
                  height={684}
                  className="w-full h-auto"
                />
              </div>
              <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system">
                {t('eyebrow')}
              </p>
            </div>

            <h3
              id="case-study-skc"
              className="font-display text-2xl lg:text-4xl font-bold text-text-primary leading-tight max-w-3xl"
            >
              {t('outcomeHeadline')}
            </h3>
            <span className="sr-only">{t('companyName')}</span>
            <p className="text-sm text-text-secondary mt-3 max-w-2xl">{t('subtitle')}</p>
          </header>

          {/* Metrics — value (big) + label (mute), middentile dominant met accent treatment */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-10">
            <div className="flex flex-col rounded-xl border border-border-primary/60 bg-bg-deep/40 px-5 py-5">
              <span className="font-display text-xl lg:text-2xl font-bold text-text-primary leading-tight">
                {t('metric1Value')}
              </span>
              <span className="mt-2 text-xs text-text-muted leading-relaxed">
                {t('metric1Label')}
              </span>
            </div>

            <div className="flex flex-col rounded-xl border border-accent-system/30 bg-accent-system/[0.04] px-5 py-6 shadow-[0_0_32px_rgba(0,212,170,0.10)]">
              <span className="font-display text-xl lg:text-3xl font-bold text-accent-system leading-tight">
                {t('metric2Value')}
              </span>
              <span className="mt-2 text-xs text-text-muted leading-relaxed">
                {t('metric2Label')}
              </span>
            </div>

            <div className="flex flex-col rounded-xl border border-border-primary/60 bg-bg-deep/40 px-5 py-5">
              <span className="font-display text-xl lg:text-2xl font-bold text-text-primary leading-tight">
                {t('metric3Value')}
              </span>
              <span className="mt-2 text-xs text-text-muted leading-relaxed">
                {t('metric3Label')}
              </span>
            </div>
          </div>

          {/* Quote */}
          <blockquote className="relative pl-8 lg:pl-10 max-w-3xl">
            <Quote
              aria-hidden
              className="absolute left-0 top-0 w-5 h-5 lg:w-6 lg:h-6 text-accent-system/60"
            />
            <p className="text-base lg:text-xl text-text-primary leading-relaxed">
              {t('quote')}
            </p>
            <footer className="mt-4 text-sm text-text-secondary">
              {t('attribution')}
            </footer>
          </blockquote>

          {/* CTA */}
          <div className="mt-8">
            <Link
              href="/case-studies/skinclarity-club"
              className="inline-flex items-center gap-1.5 text-sm text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
            >
              {t('ctaLink')}
              <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
            </Link>
          </div>
        </article>
      </div>
    </section>
  )
}
