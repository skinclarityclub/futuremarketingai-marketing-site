'use client'

import dynamic from 'next/dynamic'
import { useChatbotStore } from '@/stores/chatbotStore'

/**
 * CalendlyTrigger -- Store subscriber that lazy-imports CalendlyIsland
 * (which owns CalendlyModal + react-calendly) the first time
 * chatbotStore.calendlyOpen flips to true.
 *
 * Why: react-calendly is ~32 KB gz of iframe-management code that 95%
 * of visitors never use. Until any CTA calls openCalendly(), no chunk
 * is requested. After first open, the chunk is cached, so subsequent
 * opens are instant. See 13-01-PLAN.md Task 3.
 */
const CalendlyIsland = dynamic(
  () =>
    import('@/components/interactive/CalendlyIsland').then((m) => ({
      default: m.CalendlyIsland,
    })),
  { ssr: false, loading: () => null }
)

export function CalendlyTrigger() {
  const calendlyOpen = useChatbotStore((s) => s.calendlyOpen)
  return calendlyOpen ? <CalendlyIsland /> : null
}
