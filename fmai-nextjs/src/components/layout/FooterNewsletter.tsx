'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { ArrowRight, Check } from 'lucide-react'

type Status = 'idle' | 'submitting' | 'success' | 'error'

/**
 * FooterNewsletter — inline double-opt-in newsletter form in the footer.
 *
 * Posts to /api/newsletter which sends a confirmation email; subscriber is
 * added to the Resend audience only after they click the link.
 * AVG-compliant: explicit consent checkbox, consent_text recorded server-side.
 */
export function FooterNewsletter() {
  const t = useTranslations('common.landing.footer.newsletter')
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(true)
  const [website, setWebsite] = useState('') // honeypot
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (status === 'submitting' || !email) return
    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          locale,
          source: 'footer',
          consent: true,
          consentText: t('consent'),
          website,
        }),
      })
      if (!res.ok) {
        setStatus('error')
        return
      }
      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2.5" noValidate>
      {/* Honeypot, hidden from real users */}
      <input
        type="text"
        name="website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="sr-only"
      />
      <div className="flex items-stretch gap-1.5">
        <label htmlFor="footer-newsletter-email" className="sr-only">
          {t('label')}
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          autoComplete="email"
          disabled={status === 'submitting' || status === 'success'}
          className="flex-1 min-w-0 rounded-lg border border-border-primary bg-bg-elevated/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-accent-system/50 focus:outline-none focus:ring-2 focus:ring-accent-system/20 disabled:opacity-60 transition-colors"
        />
        <button
          type="submit"
          disabled={status === 'submitting' || status === 'success' || !email || !consent}
          aria-label={t('cta')}
          className="shrink-0 inline-flex items-center justify-center rounded-lg bg-accent-system px-3 py-2 text-bg-deep transition-all hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
        >
          {status === 'success' ? (
            <Check className="w-4 h-4" aria-hidden />
          ) : (
            <ArrowRight className="w-4 h-4" aria-hidden />
          )}
        </button>
      </div>
      <label className="flex items-start gap-2 text-[11px] text-text-muted leading-snug cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 h-3 w-3 shrink-0 rounded border-border-primary bg-bg-elevated text-accent-system focus:ring-accent-system/30 focus:ring-1"
        />
        <span>{t('consent')}</span>
      </label>
      {status === 'success' && (
        <p className="text-xs text-accent-system flex items-center gap-1.5">
          <Check className="w-3 h-3" aria-hidden />
          {t('success')}
        </p>
      )}
      {status === 'error' && (
        <p className="text-xs text-error">{t('error')}</p>
      )}
    </form>
  )
}
