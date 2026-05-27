import { existsSync } from 'node:fs'
import path from 'node:path'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { ArrowRight, Linkedin } from 'lucide-react'
import { Link } from '@/i18n/navigation'

const PORTRAIT_SRC = '/images/sindy-portrait.webp'
const HAS_PORTRAIT = existsSync(
  path.join(process.cwd(), 'public', 'images', 'sindy-portrait.webp'),
)

export async function TestimonialBlock({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.testimonial' })

  return (
    <section
      aria-labelledby="testimonial-sindy"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-human text-center md:text-left mb-8 md:mb-12">
          {t('eyebrow')}
        </p>

        <div className="grid md:grid-cols-[auto_1fr] gap-8 md:gap-12 items-center">
          <div
            aria-label={t('portraitAlt')}
            role="img"
            className="relative mx-auto md:mx-0 w-32 h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border border-border-primary bg-gradient-to-br from-accent-human/15 via-bg-surface to-bg-deep grid place-items-center shrink-0"
          >
            {HAS_PORTRAIT ? (
              <Image
                src={PORTRAIT_SRC}
                alt={t('portraitAlt')}
                width={288}
                height={288}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="font-display font-bold text-4xl lg:text-5xl text-accent-human/80">
                SK
              </span>
            )}
            <span
              className="absolute inset-0 ring-1 ring-inset ring-accent-human/15 rounded-full"
              aria-hidden
            />
          </div>

          <div>
            <blockquote
              id="testimonial-sindy"
              className="font-display text-2xl md:text-3xl lg:text-[2.25rem] font-medium leading-[1.3] text-text-primary"
            >
              {t('quote')}
            </blockquote>

            <div className="mt-7 pt-6 border-t border-border-primary/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="font-semibold text-text-primary">{t('name')}</p>
                <p className="text-sm text-text-secondary mt-0.5">{t('role')}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <a
                  href={t('linkedinUrl')}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-accent-system transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
                  aria-label={t('linkedinLabel')}
                >
                  <Linkedin className="w-4 h-4" aria-hidden />
                  <span>LinkedIn</span>
                </a>
                <Link
                  href="/case-studies/skinclarity-club"
                  className="inline-flex items-center gap-1.5 text-sm text-accent-system hover:text-text-primary transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
                >
                  {t('ctaLabel')}
                  <ArrowRight className="w-4 h-4 shrink-0" aria-hidden />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
