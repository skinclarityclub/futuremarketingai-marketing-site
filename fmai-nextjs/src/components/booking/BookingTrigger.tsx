'use client'

import dynamic from 'next/dynamic'
import { useBookingStore } from '@/stores/bookingStore'

/**
 * BookingTrigger -- Store subscriber that lazy-imports BookingModal
 * (which pulls in react-calendly + motion/react + lucide-react) the
 * first time bookingStore.isOpen flips to true.
 *
 * Why: BookingModal is ~25 KB gz of modal + Calendly iframe wrapper
 * code that only fires when a "Plan een gesprek" CTA is clicked. The
 * store still owns isOpen + triggerEl (focus return on close), this
 * component just delays the JS download until first use.
 * See 13-01-PLAN.md Task 3.
 */
const BookingModal = dynamic(
  () =>
    import('@/components/booking/BookingModal').then((m) => ({
      default: m.BookingModal,
    })),
  { ssr: false, loading: () => null }
)

export function BookingTrigger() {
  const isOpen = useBookingStore((s) => s.isOpen)
  return isOpen ? <BookingModal /> : null
}
