'use client'

/**
 * Client island for /[locale]/newsletter/confirm.
 *
 * Owns the four-state transition (pending / ok / already / error) after
 * hydration. Wrapped in <Suspense> by the parent server component because
 * `useSearchParams()` opts out of static prerendering in Next.js 16.
 */
import { Suspense, useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { ConfirmRetryForm } from '@/components/newsletter/ConfirmRetryForm'
import { EyebrowLabel } from '@/components/sections/EyebrowLabel'
import { EASE_OUT } from '@/lib/motion/easings'

type ConfirmState = 'pending' | 'ok' | 'already' | 'error'

function NewsletterConfirmInner() {
  const t = useTranslations('newsletter.confirm')
  const localeRaw = useLocale()
  const locale: 'nl' | 'en' | 'es' =
    localeRaw === 'en' || localeRaw === 'es' ? localeRaw : 'nl'
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<ConfirmState>(() => (token ? 'pending' : 'error'))

  useEffect(() => {
    if (!token) return
    let cancelled = false
    fetch('/api/newsletter/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = (await res.json().catch(() => ({}))) as { alreadyConfirmed?: boolean }
        if (cancelled) return
        if (res.ok) {
          setState(data.alreadyConfirmed ? 'already' : 'ok')
        } else {
          setState('error')
        }
      })
      .catch(() => {
        if (!cancelled) setState('error')
      })
    return () => {
      cancelled = true
    }
  }, [token])

  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
        className="space-y-6"
      >
        <div className="space-y-3">
          <EyebrowLabel className="inline-block">{t('eyebrow')}</EyebrowLabel>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-text-primary leading-tight">
            {state === 'pending' && t('pendingTitle')}
            {state === 'ok' && t('okTitle')}
            {state === 'already' && t('alreadyTitle')}
            {state === 'error' && t('errorTitle')}
          </h1>
        </div>
        <p
          className="text-text-secondary leading-relaxed"
          aria-live={state === 'pending' ? 'polite' : undefined}
        >
          {state === 'pending' && t('pendingBody')}
          {state === 'ok' && t('okBody')}
          {state === 'already' && t('alreadyBody')}
          {state === 'error' && t('errorBody')}
        </p>
        {state === 'error' ? (
          <div className="flex flex-col items-center gap-6 pt-2">
            <ConfirmRetryForm locale={locale} />
            <Link
              href="/"
              className="text-sm text-text-muted underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
            >
              {t('backHome')}
            </Link>
          </div>
        ) : (
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-accent-system px-5 py-2.5 text-sm font-semibold text-bg-deep hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system"
          >
            {t('backHome')}
          </Link>
        )}
      </motion.div>
    </main>
  )
}

export function NewsletterConfirmClient() {
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
