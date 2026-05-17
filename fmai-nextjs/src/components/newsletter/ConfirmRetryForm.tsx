'use client'

/**
 * ConfirmRetryForm
 *
 * Rendered on the error variant of /[locale]/newsletter/confirm when the user
 * arrived via a missing/expired token. POSTs email+locale to
 * /api/newsletter/resend-confirm; surfaces success, rate-limit and generic
 * error messages from the `newsletter.confirm.retry.*` i18n namespace.
 *
 * Locale comes from the next-intl prop drilling chain (the page reads
 * `useLocale()` and passes it in) so the new confirm-mail uses the same
 * language as the page the user is on.
 */
import { useState } from 'react'
import { useTranslations } from 'next-intl'

type Status = 'idle' | 'submitting' | 'success' | 'errorRate' | 'errorGeneric'

export function ConfirmRetryForm({ locale }: { locale: 'nl' | 'en' | 'es' }) {
  const t = useTranslations('newsletter.confirm.retry')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'submitting') return
    setStatus('submitting')
    try {
      const res = await fetch('/api/newsletter/resend-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
      })
      if (res.ok) {
        setStatus('success')
        return
      }
      if (res.status === 429) {
        setStatus('errorRate')
        return
      }
      setStatus('errorGeneric')
    } catch {
      setStatus('errorGeneric')
    }
  }

  if (status === 'success') {
    return (
      <p
        role="status"
        aria-live="polite"
        className="rounded-lg border border-status-active/40 bg-status-active/10 px-4 py-3 text-sm text-text-primary"
      >
        {t('success')}
      </p>
    )
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-3 text-left"
      noValidate
    >
      <label htmlFor="resend-confirm-email" className="text-sm font-medium text-text-primary">
        {t('label')}
      </label>
      <input
        id="resend-confirm-email"
        name="email"
        type="email"
        required
        autoComplete="email"
        inputMode="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('placeholder')}
        disabled={status === 'submitting'}
        className="w-full rounded-lg border border-white/10 bg-bg-elevated px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={status === 'submitting' || email.length === 0}
        className="inline-flex items-center justify-center gap-2 rounded-lg bg-accent-system px-5 py-2.5 text-sm font-semibold text-bg-deep transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system disabled:cursor-not-allowed disabled:opacity-60"
      >
        {t('submit')}
      </button>
      {status === 'errorRate' && (
        <p role="alert" className="text-sm text-error">
          {t('errorRate')}
        </p>
      )}
      {status === 'errorGeneric' && (
        <p role="alert" className="text-sm text-error">
          {t('errorGeneric')}
        </p>
      )}
    </form>
  )
}
