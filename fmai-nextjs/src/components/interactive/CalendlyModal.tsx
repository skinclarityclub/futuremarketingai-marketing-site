'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import { CalInlineEmbed } from './CalInlineEmbed'

interface CalendlyPrefill {
  name?: string
  email?: string
}

export interface CalendlyModalProps {
  isOpen: boolean
  onClose: () => void
  prefill?: CalendlyPrefill
}

/**
 * CalendlyModal -- Modal overlay hosting the Cal.com inline embed.
 *
 * Name kept for call-site stability (chatbot store + ClientIslands wiring);
 * backed by Cal.com since the 2026-06 scheduling migration. Mount-guarded to
 * prevent SSR hydration mismatch for this portal-rendered modal.
 */
export function CalendlyModal({ isOpen, onClose, prefill }: CalendlyModalProps) {
  const t = useTranslations('calendly')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mount guard prevents SSR hydration mismatch for portal-rendered modal
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
          className="absolute top-4 right-4 z-10 p-2 rounded-lg text-text-quiet hover:text-white hover:bg-white/10 transition-colors"
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

        {/* Cal.com inline embed */}
        <div className="min-h-[650px]">
          <CalInlineEmbed prefill={prefill} height={650} />
        </div>
      </div>
    </div>
  )
}

export default CalendlyModal
