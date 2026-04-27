'use client'

/**
 * /[locale]/newsletter/confirm
 *
 * Double-opt-in landing page (Phase 15-04).
 *
 * Reads `?token=` from URL → POSTs to /api/newsletter/confirm → renders one
 * of four deterministic states (pending, ok, already-confirmed, error).
 *
 * Client component because state transition happens on first effect after
 * hydration. The API route does the actual heavy lifting (DB flip, Resend
 * audience add, PDF mail).
 *
 * Wrapped in Suspense because useSearchParams() bails out of static
 * prerendering otherwise (Next.js 16 requirement).
 */
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

type ConfirmState = 'pending' | 'ok' | 'already' | 'error'

function NewsletterConfirmInner() {
  const t = useTranslations('newsletter.confirm')
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<ConfirmState>(() => (token ? 'pending' : 'error'))

  useEffect(() => {
    if (!token) return
    fetch('/api/newsletter/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { alreadyConfirmed?: boolean }
        if (res.ok) {
          setState(data.alreadyConfirmed ? 'already' : 'ok')
        } else {
          setState('error')
        }
      })
      .catch(() => setState('error'))
  }, [token])

  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center">
      <h1 className="text-3xl font-semibold text-text-primary mb-4">
        {state === 'pending' && t('pendingTitle')}
        {state === 'ok' && t('okTitle')}
        {state === 'already' && t('alreadyTitle')}
        {state === 'error' && t('errorTitle')}
      </h1>
      <p className="text-text-secondary leading-relaxed mb-8">
        {state === 'pending' && t('pendingBody')}
        {state === 'ok' && t('okBody')}
        {state === 'already' && t('alreadyBody')}
        {state === 'error' && t('errorBody')}
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 rounded-lg bg-accent-system px-5 py-2.5 text-sm font-semibold text-bg-deep hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
      >
        {t('backHome')}
      </Link>
    </main>
  )
}

export default function NewsletterConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-xl mx-auto px-6 py-24 text-center">
          <p className="text-text-secondary">…</p>
        </main>
      }
    >
      <NewsletterConfirmInner />
    </Suspense>
  )
}
