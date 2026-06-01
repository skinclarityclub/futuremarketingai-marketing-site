'use client'

import { CalendlyModal } from './CalendlyModal'
import { useChatbotStore } from '@/stores/chatbotStore'

export function CalendlyIsland() {
  const { calendlyOpen, calendlyPrefill, closeCalendly } = useChatbotStore()
  return (
    <CalendlyModal
      isOpen={calendlyOpen}
      onClose={closeCalendly}
      prefill={calendlyPrefill}
    />
  )
}
