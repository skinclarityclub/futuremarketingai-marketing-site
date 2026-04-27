/**
 * SkcTestimonialBlock — Sindy testimonial render for /case-studies/skinclarity-club.
 *
 * Server component (no client interactivity needed). Reads from
 * `case_studies.skc.testimonial.*` i18n namespace via getTranslations:
 * - quote: 1-2 sentence verbatim quote from Sindy
 * - authorName: 'Sindy'
 * - authorRole: 'Founder, SkinClarity Club'
 * - photoSrc: '/case-studies/skc/sindy-headshot.jpg'
 * - photoAlt: alt text for screen readers
 * - linkedinUrl: Sindy's LinkedIn profile (also rendered into PersonJsonLd sameAs[])
 * - linkedinLabel: link label, locale-specific
 *
 * Server-component path keeps the case_studies namespace out of
 * GLOBAL_CLIENT_NAMESPACES (Phase 13-02 invariant), preserving the bundle
 * payload budget on every page. Phase 14-02 already shipped PersonJsonLd
 * emission for Sindy on the same page, so this component handles ONLY the
 * visible testimonial UI.
 */
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Linkedin } from 'lucide-react'

export async function SkcTestimonialBlock() {
  const t = await getTranslations('case_studies.skc.testimonial')

  const photoSrc = t('photoSrc')
  const linkedinUrl = t('linkedinUrl')

  return (
    <figure className="rounded-2xl border border-border-primary bg-white/[0.02] p-6 md:p-8">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <div className="shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-full ring-2 ring-accent-system/40">
            <Image
              src={photoSrc}
              alt={t('photoAlt')}
              fill
              sizes="80px"
              className="object-cover"
            />
          </div>
        </div>
        <div className="flex-1">
          <blockquote className="text-lg md:text-xl text-text-primary leading-relaxed mb-4">
            {t('quote')}
          </blockquote>
          <figcaption className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-text-secondary">
            <span className="font-semibold text-text-primary">{t('authorName')}</span>
            <span className="hidden sm:inline text-text-muted">·</span>
            <span>{t('authorRole')}</span>
            <span className="hidden sm:inline text-text-muted">·</span>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-accent-system hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system rounded-sm"
            >
              <Linkedin className="h-4 w-4" aria-hidden />
              <span>{t('linkedinLabel')}</span>
            </a>
          </figcaption>
        </div>
      </div>
    </figure>
  )
}

export default SkcTestimonialBlock
