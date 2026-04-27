'use client'

import { Component, useEffect, useRef, useState, type ReactNode } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

const InlineWidget = dynamic(() => import('react-calendly').then((mod) => mod.InlineWidget), {
  ssr: false,
  loading: () => (
    <div
      className="h-[720px] w-full animate-pulse rounded-xl bg-white/5"
      aria-hidden="true"
    />
  ),
})

const DEFAULT_URL = 'https://calendly.com/futureai/strategy-call'

export interface ApplyCalendlyInlineProps {
  name?: string
  email?: string
}

/**
 * ApplyCalendlyInline -- inline Calendly widget for post-submit success states.
 *
 * Reuses the existing react-calendly dependency (also used by CalendlyModal).
 * Falls back to a hosted-Calendly anchor link when the dynamic import rejects,
 * the URL env var is malformed, or the embed throws at render (ad-blocker, CSP
 * strip, network error).
 *
 * Prefill flows directly to react-calendly's `prefill` prop on the happy path;
 * fallback path encodes name + email as URL search params so the hosted
 * Calendly form pre-populates on click-through.
 *
 * GA4 event `calendly_load` fires once on widget mount (apply success surface).
 */
export function ApplyCalendlyInline({ name, email }: ApplyCalendlyInlineProps) {
  const t = useTranslations('apply.calendly')
  const [failed, setFailed] = useState(false)
  // useRef instead of state — flipping a ref does not trigger re-render and the
  // effect needs to fire once-per-mount, not once-per-render. Mirrors the
  // StickyMobileCTA Phase 15-01 fix for the same react-hooks/set-state-in-effect
  // lint rule.
  const loadEventFired = useRef(false)

  const rawUrl = process.env.NEXT_PUBLIC_CALENDLY_APPLY_URL ?? DEFAULT_URL

  // Fire GA4 calendly_load once after the embed mounts on the client. Effects
  // run only on the client, so the typeof window guard is belt-and-braces.
  useEffect(() => {
    if (failed || loadEventFired.current) return
    loadEventFired.current = true
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'calendly_load', { location: 'apply_success' })
    }
  }, [failed])

  // Guard against malformed env var (e.g. missing scheme).
  let urlIsValid = true
  try {
    new URL(rawUrl)
  } catch {
    urlIsValid = false
  }

  const fallbackHref = buildFallbackHref(rawUrl, { name, email })

  if (!urlIsValid || failed) {
    return (
      <div className="rounded-xl border border-border-primary bg-white/[0.02] p-6 text-center">
        <p className="text-text-secondary mb-4">{t('fallbackIntro')}</p>
        <a
          href={fallbackHref}
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
        <InlineWidget url={rawUrl} prefill={{ name, email }} styles={{ height: '720px' }} />
      </ErrorBoundary>
    </div>
  )
}

function buildFallbackHref(base: string, prefill: { name?: string; email?: string }) {
  try {
    const url = new URL(base)
    if (prefill.name) url.searchParams.set('name', prefill.name)
    if (prefill.email) url.searchParams.set('email', prefill.email)
    return url.toString()
  } catch {
    return base
  }
}

/**
 * Minimal error boundary -- only used to swap the fallback UI when the dynamic
 * Calendly import throws at render time. Class component required because
 * componentDidCatch / getDerivedStateFromError have no functional equivalent.
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
