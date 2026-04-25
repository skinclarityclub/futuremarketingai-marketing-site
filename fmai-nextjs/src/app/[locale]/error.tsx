'use client'

import { useTranslations } from 'next-intl'

interface ErrorProps {
  // Next.js error boundary signature requires `error` prop, but we do not surface
  // raw error messages to users (security / info-leak). Underscore signals intent.
  error: Error & { digest?: string }
  reset: () => void
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Error({ error: _error, reset }: ErrorProps) {
  const t = useTranslations('errors.generic')

  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-6xl font-bold text-accent-system">!</p>
      <h1 className="mt-4 text-3xl font-semibold text-text-primary">{t('title')}</h1>
      <p className="mt-2 text-lg text-text-secondary">{t('description')}</p>
      <button
        onClick={reset}
        className="mt-8 inline-block rounded-lg bg-accent-system px-6 py-3 text-sm font-medium text-bg-deep transition-colors hover:bg-accent-system/80"
      >
        {t('retryButton')}
      </button>
    </main>
  )
}
