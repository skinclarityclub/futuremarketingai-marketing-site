'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Check } from 'lucide-react'

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
  // Off by default (golf 8b, Daley 2026-11-07): consent has to be an active tick
  const [consent, setConsent] = useState(false)
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
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-2.5" noValidate>
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
      <label className="flex flex-[1_1_200px] flex-col gap-1.5 text-[12.5px] font-semibold text-[#a3adbd]">
        {t('label')}
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('placeholder')}
          autoComplete="email"
          disabled={status === 'submitting' || status === 'success'}
          className="h-[42px] rounded-[10px] bg-white/[0.02] px-3 text-[14.5px] font-normal text-[#f4f7fb] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.16)] placeholder:text-text-muted focus:outline-none focus:shadow-[inset_0_0_0_1px_rgba(94,234,212,0.6)] disabled:opacity-60 transition-shadow"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'submitting' || status === 'success' || !email || !consent}
        className="inline-flex h-[42px] shrink-0 items-center justify-center gap-1.5 rounded-[10px] px-4 text-[14.5px] font-semibold text-[#5eead4] shadow-[inset_0_0_0_1px_rgba(94,234,212,0.5)] transition-colors hover:bg-[#5eead4]/10 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
      >
        {status === 'success' && <Check className="w-4 h-4" aria-hidden />}
        {t('cta')}
      </button>
      <label className="flex basis-full items-start gap-2 text-[12.5px] leading-[1.45] text-[#a3adbd] cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-px h-4 w-4 shrink-0 accent-[#5eead4]"
        />
        <span>{t('consent')}</span>
      </label>
      {status === 'success' && (
        <p className="basis-full text-xs text-accent-system flex items-center gap-1.5">
          <Check className="w-3 h-3" aria-hidden />
          {t('success')}
        </p>
      )}
      {status === 'error' && <p className="basis-full text-xs text-error">{t('error')}</p>}
    </form>
  )
}
