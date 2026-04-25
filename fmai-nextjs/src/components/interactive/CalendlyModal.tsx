'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { useTranslations } from 'next-intl'

const InlineWidget = dynamic(() => import('react-calendly').then((mod) => mod.InlineWidget), {
  ssr: false,
})

const DEFAULT_CALENDLY_URL =
  'https://calendly.com/futureai/strategy-call?background_color=111520&text_color=e8ecf4&primary_color=00D4FF'

interface CalendlyPrefill {
  name?: string
  email?: string
}

export interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
  url?: string
  prefill?: CalendlyPrefill
}

/**
 * CalendlyModal -- Modal overlay with dynamically loaded Calendly widget.
 *
 * Uses next/dynamic with ssr: false to prevent SSR issues with react-calendly.
 * Guarded with mounted state to prevent hydration mismatch.
 */
export function CalendlyModal({
  isOpen,
  onClose,
  url = DEFAULT_CALENDLY_URL,
  prefill,
}: CalendlyModalProps) {
  const t = useTranslations('calendly')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={t('modal_title')}
    >
      <div className="relative w-full max-w-3xl mx-4 rounded-xl bg-bg-surface border border-white/10 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          aria-label={t('close')}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Loading skeleton */}
        <div className="min-h-[650px]">
          <InlineWidget url={url} prefill={prefill} styles={{ height: '650px' }} />
        </div>
      </div>
    </div>
  )
}

export default CalendlyModal
