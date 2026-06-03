'use client'

import { Component, useCallback, useState, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'
import { CalInlineEmbed } from './CalInlineEmbed'
import { calHostedUrl } from '@/config/calConfig'

export interface ApplyCalendlyInlineProps {
  name?: string
  email?: string
}

/**
 * ApplyCalendlyInline -- inline Cal.com embed for post-submit success states.
 *
 * Name kept for call-site stability (ApplicationForm + ResultBranchA); backed
 * by Cal.com since the 2026-06 scheduling migration. Falls back to a hosted
 * Cal.com anchor link when the embed throws at render (ad-blocker, CSP strip,
 * network error). Prefill flows to the embed on the happy path and is encoded
 * as query params on the fallback link.
 *
 * GA4 event `calendly_load` fires once after the embed UI is configured.
 */
export function ApplyCalendlyInline({ name, email }: ApplyCalendlyInlineProps) {
  const t = useTranslations('apply.calendly')
  const [failed, setFailed] = useState(false)

  const handleReady = useCallback(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'calendly_load', { location: 'apply_success' })
    }
  }, [])

  if (failed) {
    return (
      <div className="rounded-xl border border-border-primary bg-white/[0.02] p-6 text-center">
        <p className="text-text-secondary mb-4">{t('fallbackIntro')}</p>
        <a
          href={calHostedUrl({ name, email })}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-accent-system px-5 py-2.5 text-sm font-semibold text-bg-deep hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-[filter]"
        >
          {t('fallbackCta')}
        </a>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden border border-white/10">
      <ErrorBoundary onError={() => setFailed(true)}>
        <CalInlineEmbed prefill={{ name, email }} height={720} minHeight={720} onReady={handleReady} />
      </ErrorBoundary>
    </div>
  )
}

/**
 * Minimal error boundary -- swaps to the fallback anchor when the embed throws
 * at render time. Class component required because componentDidCatch /
 * getDerivedStateFromError have no functional equivalent.
 */
class ErrorBoundary extends Component<
  { children: ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; onError: () => void }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  componentDidCatch() {
    this.props.onError()
  }
  render() {
    return this.state.hasError ? null : this.props.children
  }
}

export default ApplyCalendlyInline
