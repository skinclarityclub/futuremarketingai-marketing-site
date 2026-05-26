import { existsSync } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Quote } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const PORTRAIT_SRC = '/images/daley-portrait.webp'
const HAS_PORTRAIT = existsSync(
  path.join(process.cwd(), 'public', 'images', 'daley-portrait.webp'),
)

const CHIP_KEYS = ['engineer', 'stack', 'infra'] as const

export async function FounderSection({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.founder' })

  return (
    <section
      aria-labelledby="founder-section"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system">
          {t('eyebrow')}
        </p>

        <blockquote className="relative mt-8">
          <Quote
            aria-hidden
            className="mx-auto mb-5 w-7 h-7 text-accent-system/70"
          />
          <div className="space-y-1 md:space-y-2">
            {(['quote1', 'quote2', 'quote3'] as const).map((key) => (
              <p
                key={key}
                className="font-display text-2xl md:text-3xl lg:text-[2.25rem] font-medium leading-[1.25] text-text-primary"
              >
                {t(key)}
              </p>
            ))}
          </div>
          <p className="mt-6 text-sm md:text-base text-accent-system/85 font-medium">
            {t('proof')}
          </p>
        </blockquote>

        <div className="mt-12 flex flex-col items-center">
          <div
            aria-label={t('portraitAlt')}
            role="img"
            className="relative w-20 h-20 lg:w-24 lg:h-24 rounded-full overflow-hidden border border-border-primary bg-gradient-to-br from-bg-elevated via-bg-surface to-bg-deep grid place-items-center"
          >
            {HAS_PORTRAIT ? (
              <Image
                src={PORTRAIT_SRC}
                alt={t('portraitAlt')}
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display font-bold text-3xl lg:text-4xl text-accent-system/80">
                D
              </span>
            )}
            <span
              className="absolute inset-0 ring-1 ring-inset ring-accent-system/15 rounded-full"
              aria-hidden
            />
          </div>

          <h3
            id="founder-section"
            className="mt-4 font-display text-xl lg:text-2xl font-semibold text-text-primary"
          >
            {t('name')}
          </h3>
          <p className="text-sm text-text-secondary mt-1">{t('role')}</p>

          <ul className="mt-5 flex flex-wrap gap-2 justify-center" aria-label="Credentials">
            {CHIP_KEYS.map((key) => (
              <li
                key={key}
                className="px-3 py-1 text-xs font-mono uppercase tracking-[0.08em] rounded-full border border-border-primary bg-bg-surface/40 text-text-secondary"
              >
                {t(`chips.${key}`)}
              </li>
            ))}
          </ul>

          <Link
            href="/about"
            className="mt-7 inline-flex items-center gap-1.5 text-sm text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
          >
            {t('ctaLink')}
            <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
