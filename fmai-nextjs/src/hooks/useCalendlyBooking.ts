'use client'

import { useState, useCallback } from 'react'
import { calendlyConfig } from '@/config/calendlyConfig'

interface CalendlyPrefill {
  name?: string
  email?: string
}

/**
 * Hook to manage Calendly booking modal state.
 *
 * Provides open/close controls and prefill support.
 * Used by DemoCompletionCard, ProgressiveCTA, and any CTA button
 * that triggers a booking flow.
 */
export function useCalendlyBooking() {
  const [isOpen, setIsOpen] = useState(false)
  const [prefill, setPrefill] = useState<CalendlyPrefill | undefined>()

  const openCalendly = useCallback((data?: CalendlyPrefill) => {
    if (data) setPrefill(data)
    setIsOpen(true)
  }, [])

  const closeCalendly = useCallback(() => {
    setIsOpen(false)
  }, [])

  return {
    isOpen,
    prefill,
    url: calendlyConfig.url,
    openCalendly,
    closeCalendly,
  }
}
