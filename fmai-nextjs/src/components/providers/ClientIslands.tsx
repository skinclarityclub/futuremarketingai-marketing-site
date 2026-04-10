'use client'

import dynamic from 'next/dynamic'

/**
 * ClientIslands -- Lazy-loaded client islands for heavy third-party components.
 *
 * ChatWidgetIsland (~20 client files + AI SDK + Zustand) and CalendlyIsland
 * (react-calendly) are dynamically imported with ssr:false to keep them out
 * of the initial page bundle, improving LCP and reducing First Load JS.
 *
 * This wrapper exists because next/dynamic with ssr:false is only allowed
 * in Client Components (not Server Components like layout.tsx).
 */

const ChatWidgetIsland = dynamic(
  () => import('@/components/chatbot/ChatWidgetIsland').then((mod) => mod.ChatWidgetIsland),
  { ssr: false }
)

const CalendlyIsland = dynamic(
  () => import('@/components/interactive/CalendlyIsland').then((mod) => mod.CalendlyIsland),
  { ssr: false }
)

const BookingModal = dynamic(
  () => import('@/components/booking/BookingModal').then((mod) => mod.BookingModal),
  { ssr: false }
)

export function ClientIslands() {
  return (
    <>
      <ChatWidgetIsland />
      <CalendlyIsland />
      <BookingModal />
    </>
  )
}
