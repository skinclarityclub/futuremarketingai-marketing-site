'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FloatingChatTrigger } from '@/components/chatbot/FloatingChatTrigger'
import { CalendlyTrigger } from '@/components/interactive/CalendlyTrigger'
import { BookingTrigger } from '@/components/booking/BookingTrigger'
import { BackToTop } from '@/components/common/BackToTop'

/**
 * ClientIslands -- mounts interaction-driven lightweight triggers on
 * every page. Heavy chunks (ChatWidget, CalendlyModal, BookingModal) are
 * lazy-loaded only when needed:
 *   - FloatingChatTrigger -> ChatWidget on first click
 *   - CalendlyTrigger     -> CalendlyModal when chatbotStore.calendlyOpen
 *   - BookingTrigger      -> BookingModal when bookingStore.isOpen
 *   - CookieConsentBannerLazy -> rendered when no consent in localStorage,
 *     OR when the footer's "Change cookie settings" link dispatches the
 *     `fmai:cookie-reopen` window event.
 *
 * Phase 17-C C3 migrated consent storage from `document.cookie` to
 * `localStorage.cookieConsent` with per-category booleans. The chunk
 * still lazy-loads — returning visitors who already gave consent only pay
 * the network cost when they explicitly re-open the banner from the
 * footer.
 */

const CookieConsentBannerLazy = dynamic(
  () =>
    import('@/components/interactive/CookieConsentBanner').then((m) => ({
      default: m.CookieConsentBanner,
    })),
  { ssr: false, loading: () => null }
)

const REOPEN_EVENT = 'fmai:cookie-reopen'

export function ClientIslands() {
  const [needsConsent, setNeedsConsent] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    let consented = false
    try {
      consented = window.localStorage.getItem('cookieConsent') !== null
    } catch {
      // Storage blocked (private mode, quota); treat as no consent so the
      // banner is offered every visit rather than silently skipped.
    }
    if (!consented) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-shot mount-time storage probe
      setNeedsConsent(true)
    }

    function handleReopen() {
      setNeedsConsent(true)
    }
    window.addEventListener(REOPEN_EVENT, handleReopen)
    return () => window.removeEventListener(REOPEN_EVENT, handleReopen)
  }, [])

  return (
    <>
      <FloatingChatTrigger />
      <CalendlyTrigger />
      <BookingTrigger />
      <BackToTop />
      {needsConsent && <CookieConsentBannerLazy />}
    </>
  )
}
