import { getTranslations } from 'next-intl/server'
import { ArrowRight, Quote } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export async function FounderSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.founder' })

  return (
    <section
      aria-labelledby="founder-section"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-6">
          {t('eyebrow')}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 lg:gap-12 items-center">
          {/*
            TODO: Daley portret — vervang placeholder door echte foto.
            Pad-suggestie: /public/images/daley-portrait.webp (512×512 min).
          */}
          <div
            aria-label={t('portraitAlt')}
            role="img"
            className="relative shrink-0 mx-auto lg:mx-0 w-40 h-40 lg:w-56 lg:h-56 rounded-full overflow-hidden border border-border-primary bg-gradient-to-br from-bg-elevated via-bg-surface to-bg-deep grid place-items-center"
          >
            <span className="font-display font-bold text-5xl lg:text-7xl text-accent-system/80">
              D
            </span>
            <span className="absolute inset-0 ring-1 ring-inset ring-accent-system/10 rounded-full" aria-hidden />
          </div>

          <div className="text-center lg:text-left">
            <h3
              id="founder-section"
              className="font-display text-2xl lg:text-3xl font-bold text-text-primary"
            >
              {t('name')}
            </h3>
            <p className="text-sm text-text-secondary mt-1 mb-6">{t('role')}</p>

            <blockquote className="relative pl-7 lg:pl-9 max-w-2xl mx-auto lg:mx-0">
              <Quote
                aria-hidden
                className="absolute left-0 top-0 w-4 h-4 lg:w-5 lg:h-5 text-accent-system/60"
              />
              <p className="text-base lg:text-xl text-text-primary leading-relaxed">
                {t('quote')}
              </p>
            </blockquote>

            <div className="mt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-1.5 text-sm text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
              >
                {t('ctaLink')}
                <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
