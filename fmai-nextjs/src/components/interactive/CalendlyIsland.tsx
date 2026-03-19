'use client'

import { CalendlyModal } from './CalendlyModal'
import { useChatbotStore } from '@/stores/chatbotStore'
import { calendlyConfig } from '@/config/calendlyConfig'

export function CalendlyIsland() {
  const { calendlyOpen, calendlyPrefill, closeCalendly } = useChatbotStore()
  return (
    <CalendlyModal
      isOpen={calendlyOpen}
      onClose={closeCalendly}
      url={calendlyConfig.url}
      prefill={calendlyPrefill}
    />
  )
}
