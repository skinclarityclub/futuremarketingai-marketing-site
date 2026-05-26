import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Quote } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export async function CaseStudyCard({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.caseStudyCard' })

  const metrics = [t('metric1'), t('metric2'), t('metric3')] as const

  return (
    <section
      aria-labelledby="case-study-skc"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-6">
          {t('eyebrow')}
        </p>

        <article className="relative overflow-hidden rounded-[var(--radius-card)] border border-border-primary bg-white/[0.02] backdrop-blur-sm p-8 lg:p-12">
          {/* Brand identity — SKC lockup op brand-groen (#127059) badge */}
          <header className="mb-8">
            <div className="inline-flex items-center rounded-xl bg-[#127059] px-5 py-3 mb-4 shadow-[0_0_32px_rgba(18,112,89,0.20)]">
              <Image
                src="/brand/skc-logo.png"
                alt={t('logoAlt')}
                width={1794}
                height={638}
                className="h-10 lg:h-12 w-auto"
              />
            </div>
            {/* Bedrijfsnaam visueel-verborgen — logo is de visuele identity, h3 voor SEO/SR */}
            <h3 id="case-study-skc" className="sr-only">
              {t('companyName')}
            </h3>
            <p className="text-sm text-text-secondary">{t('subtitle')}</p>
          </header>

          {/* Metrics row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6 mb-10">
            {metrics.map((value, i) => (
              <div
                key={i}
                className="flex flex-col rounded-xl border border-border-primary/60 bg-bg-deep/40 px-5 py-4"
              >
                <span className="text-[11px] font-mono uppercase tracking-[0.16em] text-text-muted">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="mt-1 font-display text-lg lg:text-xl font-semibold text-text-primary leading-tight">
                  {value}
                </span>
              </div>
            ))}
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
