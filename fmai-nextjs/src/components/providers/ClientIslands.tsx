'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { FloatingChatTrigger } from '@/components/chatbot/FloatingChatTrigger'
import { CalendlyTrigger } from '@/components/interactive/CalendlyTrigger'
import { BookingTrigger } from '@/components/booking/BookingTrigger'

/**
 * ClientIslands -- mounts interaction-driven lightweight triggers on
 * every page. Heavy chunks (ChatWidget, CalendlyModal, BookingModal,
 * react-cookie-consent) are now lazy-loaded only when they are
 * actually needed:
 *   - FloatingChatTrigger -> ChatWidget on first click
 *   - CalendlyTrigger     -> CalendlyModal when chatbotStore.calendlyOpen
 *   - BookingTrigger      -> BookingModal when bookingStore.isOpen
 *   - CookieConsentBannerLazy -> only when no consent cookie is present
 *
 * The cookie banner double-gates: (1) needsConsent state checks the
 * cookie synchronously inside useEffect; (2) the dynamic import only
 * fires once needsConsent flips true, so returning visitors who have
 * already accepted/declined never download the
 * react-cookie-consent chunk. Roughly 8 KB gz saved on every repeat
 * visit. See 13-01-PLAN.md Tasks 4 + 6 + RESEARCH R-4.
 */

const CookieConsentBannerLazy = dynamic(
  () =>
    import('@/components/interactive/CookieConsentBanner').then((m) => ({
      default: m.CookieConsentBanner,
    })),
  { ssr: false, loading: () => null }
)

export function ClientIslands() {
  const [needsConsent, setNeedsConsent] = useState(false)

  useEffect(() => {
    if (
      typeof document !== 'undefined' &&
      !document.cookie.includes('futuremarketingai-cookie-consent=')
    ) {
      setNeedsConsent(true)
    }
  }, [])

  return (
    <>
      <FloatingChatTrigger />
      <CalendlyTrigger />
      <BookingTrigger />
      {needsConsent && <CookieConsentBannerLazy />}
    </>
  )
}
