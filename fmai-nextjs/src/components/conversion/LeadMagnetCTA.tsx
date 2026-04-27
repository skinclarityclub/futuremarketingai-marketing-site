'use client'

/**
 * LeadMagnetCTA — Phase 15-04
 *
 * Reusable email-capture block that pitches the NL Bureau AI Readiness
 * Checklist PDF in exchange for a double-opt-in newsletter signup.
 *
 * Wired on home, pricing, founding-member, blog (audit 03 leak #4 — there
 * was zero mid-funnel capture before this).
 *
 * AVG/GDPR posture:
 *   - Consent checkbox is required and NOT pre-checked (hardware checkbox
 *     with `required` attribute; Zod backs this up server-side).
 *   - Privacy policy link visible inline next to the consent text.
 *   - Honeypot field hidden via `aria-hidden + hidden` div for bots.
 *   - On submit, the verbatim consent text is sent so the audit trail can
 *     prove which copy the user agreed to.
 */
import { useState, type FormEvent } from 'react'
import { useTranslations, useLocale } from 'next-intl'
import { Download } from 'lucide-react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type Variant = 'inline' | 'sidebar'
type Status = 'idle' | 'submitting' | 'success' | 'error'

export interface LeadMagnetCTAProps {
  /** Page slug for analytics + Supabase audit trail. */
  source: string
  /** Visual variant: `inline` is the larger home/blog card, `sidebar` is compact. */
  variant?: Variant
}

export function LeadMagnetCTA({ source, variant = 'inline' }: LeadMagnetCTAProps) {
  const t = useTranslations('leadMagnet')
  const locale = useLocale()
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const fd = new FormData(event.currentTarget)
    const email = String(fd.get('email') ?? '')
    const consent = fd.get('consent') === 'on'
    const website = String(fd.get('website') ?? '')
    const consentText = t('consentLabel')

    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale, source, consent, consentText, website }),
      })
      if (!res.ok) throw new Error('request_failed')
      setStatus('success')
      if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
        window.gtag('event', 'newsletter_submit', { source, locale })
      }
    } catch {
      setStatus('error')
    }
  }

  const container =
    variant === 'sidebar'
      ? 'rounded-xl border border-border-primary bg-white/[0.02] p-5'
      : 'rounded-2xl border border-accent-system/30 bg-gradient-to-br from-white/[0.03] to-accent-system/[0.05] p-6 md:p-8'

  if (status === 'success') {
    return (
      <aside className={container} aria-live="polite">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{t('successTitle')}</h3>
        <p className="text-text-secondary text-sm leading-relaxed">{t('successBody')}</p>
      </aside>
    )
  }

  return (
    <aside className={container}>
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-accent-system mb-2">
        <Download className="h-4 w-4" />
        <span>{t('eyebrow')}</span>
      </div>
      <h3 className="text-lg md:text-xl font-semibold text-text-primary mb-2">{t('title')}</h3>
      <p className="text-sm text-text-secondary mb-4 leading-relaxed">{t('subtitle')}</p>
      <ul className="space-y-1 text-sm text-text-secondary mb-4 list-disc pl-5">
        <li>{t('bullet1')}</li>
        <li>{t('bullet2')}</li>
        <li>{t('bullet3')}</li>
      </ul>
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <div aria-hidden="true" className="hidden">
          <label>
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <label className="block">
          <span className="block text-xs font-medium text-text-secondary mb-1">
            {t('emailLabel')}
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={t('emailPlaceholder')}
            className="w-full px-3 py-2 rounded-lg bg-white/[0.02] border border-border-primary text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-system transition-colors"
          />
        </label>
        <label className="flex items-start gap-2 text-xs text-text-secondary">
          <input name="consent" type="checkbox" required className="mt-0.5" />
          <span>
            {t('consentLabel')}{' '}
            <a
              href={`/${locale}/legal/privacy`}
              className="underline text-accent-system focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
            >
              {t('privacyLink')}
            </a>
            .
          </span>
        </label>
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-accent-system px-4 py-2.5 text-sm font-semibold text-bg-deep hover:brightness-110 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-[filter]"
        >
          {status === 'submitting' ? t('submittingLabel') : t('submit')}
        </button>
        {status === 'error' ? (
          <p role="alert" className="text-xs text-red-400">
            {t('errorBody')}
          </p>
        ) : null}
      </form>
    </aside>
  )
}

export default LeadMagnetCTA
