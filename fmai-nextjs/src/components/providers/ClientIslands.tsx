'use client'

import { FloatingChatTrigger } from '@/components/chatbot/FloatingChatTrigger'
import { CalendlyTrigger } from '@/components/interactive/CalendlyTrigger'
import { BookingTrigger } from '@/components/booking/BookingTrigger'

/**
 * ClientIslands -- mounts interaction-driven lightweight triggers on
 * every page. Heavy chunks (ChatWidget, CalendlyModal, BookingModal)
 * are now lazy-loaded only when the corresponding open-state flips
 * true:
 *   - FloatingChatTrigger -> ChatWidget on first click
 *   - CalendlyTrigger     -> CalendlyModal when chatbotStore.calendlyOpen
 *   - BookingTrigger      -> BookingModal when bookingStore.isOpen
 *
 * See 13-01-PLAN.md Tasks 3 + 4. Replaces the previous eager-dynamic
 * ChatWidgetIsland + CalendlyIsland + BookingModal pattern that paid
 * ~71 KB gz on every pageload regardless of interaction.
 */
export function ClientIslands() {
  return (
    <>
      <FloatingChatTrigger />
      <CalendlyTrigger />
      <BookingTrigger />
    </>
  )
}
