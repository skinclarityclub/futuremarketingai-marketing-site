'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { ArrowRight } from 'lucide-react'

interface QuickApplyTeaserProps {
  /** Optional override of the destination path. */
  destination?: string
}

/**
 * QuickApplyTeaser — Fase 6 mid-funnel capture for /founding-member.
 *
 * Two-field quick-capture (work email + bureau-naam). On submit, validates
 * email shape client-side, then pushes the user to /apply with the values
 * prefilled via URL search params. ApplicationForm reads them on mount.
 *
 * Why prefill instead of POSTing here: the full apply intake collects more
 * fields and then routes to Calendly. Splitting the path would create two
 * write surfaces for the same intent. The teaser exists to remove the cold
 * landing onto /apply: the user arrives with their context already typed.
 */
export function QuickApplyTeaser({ destination = '/apply' }: QuickApplyTeaserProps) {
  const router = useRouter()
  const locale = useLocale()
  const t = useTranslations('founding-member.quickApply')
  const [email, setEmail] = useState('')
  const [agency, setAgency] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmedEmail = email.trim()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError(t('emailInvalid'))
      return
    }
    setError(null)
    const params = new URLSearchParams()
    params.set('email', trimmedEmail)
    if (agency.trim().length > 0) {
      params.set('agency', agency.trim())
    }
    router.push(`/${locale}${destination}?${params.toString()}`)
  }

  const inputClasses =
    'w-full px-4 py-3 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary placeholder:text-text-muted focus:border-accent-human focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-human transition-colors'

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={t('ariaLabel')}
      className="rounded-2xl border border-[#F5A623]/30 bg-gradient-to-br from-[#F5A623]/10 via-bg-surface/40 to-bg-surface/10 p-6 sm:p-8 backdrop-blur"
    >
      <div className="mb-5 text-center sm:text-left">
        <p className="font-mono uppercase tracking-[0.18em] text-xs text-accent-human mb-2">
          {t('eyebrow')}
        </p>
        <h3 className="text-xl sm:text-2xl font-display font-bold text-text-primary">
          {t('heading')}
        </h3>
        <p className="text-sm text-text-secondary mt-2">{t('subheading')}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[1.4fr_1fr_auto] gap-3">
        <div>
          <label htmlFor="quick-apply-email" className="sr-only">
            {t('emailLabel')}
          </label>
          <input
            id="quick-apply-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t('emailPlaceholder')}
            className={inputClasses}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={error ? 'quick-apply-error' : undefined}
          />
        </div>
        <div>
          <label htmlFor="quick-apply-agency" className="sr-only">
            {t('agencyLabel')}
          </label>
          <input
            id="quick-apply-agency"
            name="agency"
            type="text"
            autoComplete="organization"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            placeholder={t('agencyPlaceholder')}
            className={inputClasses}
          />
        </div>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-[#F5A623] to-[#E08D00] text-bg-deep font-semibold text-sm sm:text-base shadow-[0_8px_24px_-12px_rgba(245,166,35,0.6)] hover:shadow-[0_12px_28px_-10px_rgba(245,166,35,0.7)] hover:-translate-y-0.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-human"
        >
          {t('cta')}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </div>

      {error && (
        <p id="quick-apply-error" role="alert" className="mt-3 text-sm text-[#FF4D4D]">
          {error}
        </p>
      )}

      <p className="text-xs text-text-muted mt-4">{t('reassurance')}</p>
    </form>
  )
}
