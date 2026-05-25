import { getTranslations } from 'next-intl/server'
import { Quote } from 'lucide-react'

export async function TestimonialBlock({ locale }: { locale: string }) {
  const t = await getTranslations({ locale, namespace: 'home.testimonial' })

  return (
    <section
      aria-labelledby="testimonial-sindy"
      className="py-20 px-6 lg:px-12"
    >
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-xs font-mono uppercase tracking-[0.18em] text-accent-system mb-6">
          {t('eyebrow')}
        </p>

        {/*
          TODO: Sindy portret — vervang placeholder door echte foto.
          Spec: 512×512 min, neutrale background. Pad: /public/images/sindy-portrait.webp
        */}
        <div
          aria-label={t('portraitAlt')}
          role="img"
          className="relative mx-auto mb-8 w-24 h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border border-border-primary bg-gradient-to-br from-accent-human/10 via-bg-surface to-bg-deep grid place-items-center"
        >
          <span className="font-display font-bold text-3xl lg:text-4xl text-accent-human/80">
            S
          </span>
          <span className="absolute inset-0 ring-1 ring-inset ring-accent-human/10 rounded-full" aria-hidden />
        </div>

        <Quote
          aria-hidden
          className="mx-auto mb-6 w-6 h-6 text-accent-system/60"
        />

        <blockquote
          id="testimonial-sindy"
          className="font-display text-2xl lg:text-3xl text-text-primary leading-snug max-w-2xl mx-auto"
        >
          {t('quote')}
        </blockquote>

        <footer className="mt-6">
          <p className="font-semibold text-text-primary">{t('name')}</p>
          <p className="text-sm text-text-secondary mt-0.5">{t('role')}</p>
        </footer>
      </div>
    </section>
  )
}
