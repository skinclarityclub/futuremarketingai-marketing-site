'use client'

import { useEffect, useState, useCallback } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { ArrowRight, X } from 'lucide-react'

const SESSION_KEY = 'fmai_sticky_cta_dismissed_v1'
const SCROLL_TRIGGER_PERCENT = 0.5

/**
 * StickyMobileCTA — dismissible bottom bar on mobile only.
 *
 * Rules (see .planning/phases/15-conversion-accelerators/15-01-PLAN.md):
 * - md:hidden — desktop header has its own CTA.
 * - Appears after 50% scroll.
 * - Hidden while a text input/textarea/contenteditable is focused (iOS keyboard dodge).
 * - Dismiss state lives in sessionStorage (reappears next visit).
 * - role=complementary + aria-label for screen-reader landmark.
 * - Respects prefers-reduced-motion via motion-safe: prefix.
 * - Uses locale-aware Link from @/i18n/navigation so href stays prefixed.
 */
function readInitialDismissed(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === '1'
  } catch {
    return false
  }
}

export function StickyMobileCTA({ href = '/apply' }: { href?: string }) {
  const t = useTranslations('stickyCta')
  const [visible, setVisible] = useState(false)
  // Lazy initializer reads sessionStorage once on first client render — avoids
  // the cascading-render warning from React Compiler that a setState-in-effect
  // pattern triggers. SSR returns false; first client render rehydrates.
  const [dismissed, setDismissed] = useState<boolean>(readInitialDismissed)
  const [inputFocused, setInputFocused] = useState(false)

  // Scroll listener — throttled via requestAnimationFrame so we never block paint.
  useEffect(() => {
    if (dismissed) return
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const doc = document.documentElement
        const denom = Math.max(1, doc.scrollHeight - window.innerHeight)
        const scrolled = window.scrollY / denom
        if (scrolled >= SCROLL_TRIGGER_PERCENT) setVisible(true)
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [dismissed])

  // Hide while user is focused inside a text input — iOS keyboard would otherwise overlap.
  useEffect(() => {
    const isTextInput = (el: EventTarget | null): boolean => {
      if (!(el instanceof HTMLElement)) return false
      const tag = el.tagName.toLowerCase()
      return tag === 'input' || tag === 'textarea' || el.isContentEditable
    }
    const onFocusIn = (e: FocusEvent) => {
      if (isTextInput(e.target)) setInputFocused(true)
    }
    const onFocusOut = (e: FocusEvent) => {
      if (isTextInput(e.target)) setInputFocused(false)
    }
    document.addEventListener('focusin', onFocusIn)
    document.addEventListener('focusout', onFocusOut)
    return () => {
      document.removeEventListener('focusin', onFocusIn)
      document.removeEventListener('focusout', onFocusOut)
    }
  }, [])

  const handleDismiss = useCallback(() => {
    setDismissed(true)
    try {
      window.sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      // sessionStorage unavailable — swallow
    }
  }, [])

  const handleClick = useCallback(() => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'cta_click', {
        location: 'sticky_mobile',
        href,
      })
    }
  }, [href])

  if (dismissed || !visible || inputFocused) return null

  return (
    <aside
      role="complementary"
      aria-label={t('srLandmark')}
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border-primary bg-bg-deep/95 backdrop-blur-md shadow-[0_-4px_24px_rgba(0,0,0,0.35)] motion-safe:animate-[fadeInUp_0.3s_ease-out]"
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <Link
          href={href}
          onClick={handleClick}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent-system px-4 py-2.5 text-sm font-semibold text-bg-deep hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-[filter]"
        >
          <span>{t('label')}</span>
          <span className="text-xs opacity-80">· {t('subLabel')}</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label={t('dismiss')}
          className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-system transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}

export default StickyMobileCTA
