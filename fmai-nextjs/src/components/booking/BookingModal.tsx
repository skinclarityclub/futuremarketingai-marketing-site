'use client'

import { useEffect, useRef, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'motion/react'
import { useTranslations } from 'next-intl'
import { X, CheckCircle } from 'lucide-react'
import { useBookingStore } from '@/stores/bookingStore'
import { calendlyConfig } from '@/config/calendlyConfig'

const InlineWidget = dynamic(
  () => import('react-calendly').then((mod) => mod.InlineWidget),
  { ssr: false }
)

const BULLETS = ['bullet1', 'bullet2', 'bullet3', 'bullet4'] as const

export function BookingModal() {
  const { isOpen, closeBooking, triggerEl } = useBookingStore()
  const t = useTranslations('booking')
  const overlayRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  // Scroll lock + focus management (WCAG 2.4.3)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      // Focus close button on open
      closeRef.current?.focus()
    } else {
      document.body.style.overflow = ''
      // Return focus to the element that opened the modal. Guard against the
      // edge case where the trigger unmounted (e.g. after a route change).
      // requestAnimationFrame waits for AnimatePresence exit to complete.
      if (triggerEl && document.contains(triggerEl)) {
        requestAnimationFrame(() => triggerEl.focus())
      }
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen, triggerEl])

  // Escape key
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeBooking()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeBooking])

  // Backdrop click
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === overlayRef.current) closeBooking()
    },
    [closeBooking]
  )

  // Focus trap
  useEffect(() => {
    if (!isOpen) return
    const overlay = overlayRef.current
    if (!overlay) return

    const focusable = overlay.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    const trapFocus = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }

    document.addEventListener('keydown', trapFocus)
    return () => document.removeEventListener('keydown', trapFocus)
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-label={t('title')}
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-2xl border border-white/[0.06] bg-[#0a0d14] shadow-2xl"
          >
            {/* Close button */}
            <button
              ref={closeRef}
              onClick={closeBooking}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={t('close')}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Split-screen layout */}
            <div className="flex flex-col lg:flex-row min-h-[650px]">
              {/* LEFT: Info panel */}
              <div className="lg:w-[42%] p-8 lg:p-10 flex flex-col justify-center bg-gradient-to-br from-[#0a0d14] to-[#111520]">
                {/* Heading */}
                <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3">
                  {t('title')}
                </h2>
                <p className="text-[#9ba3b5] text-base mb-8 leading-relaxed">
                  {t('subtitle')}
                </p>

                {/* Gold divider */}
                <div className="w-12 h-[2px] bg-[#f5a623] rounded-full mb-8" />

                {/* Bullet points */}
                <div className="space-y-4 mb-10">
                  {BULLETS.map((key) => (
                    <div
                      key={key}
                      className="flex items-start gap-3 bg-white/[0.03] backdrop-blur-sm border border-white/[0.06] rounded-xl px-4 py-3"
                    >
                      <CheckCircle className="w-5 h-5 text-[#00d4aa] mt-0.5 shrink-0" />
                      <span className="text-sm text-[#c8cdd8] leading-relaxed">
                        {t(key)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Credential */}
                <div className="flex items-center gap-3 mt-auto">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00d4aa] to-[#f5a623] flex items-center justify-center text-[#0a0d14] font-bold text-sm">
                    D
                  </div>
                  <span className="text-sm text-[#9ba3b5]">{t('credential')}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden lg:block w-px bg-white/[0.06]" />

              {/* RIGHT: Calendly embed */}
              <div className="lg:w-[58%] bg-[#111520] min-h-[500px] lg:min-h-0">
                <InlineWidget
                  url={calendlyConfig.url}
                  styles={{ height: '100%', minHeight: '650px' }}
                  pageSettings={{
                    backgroundColor: '111520',
                    textColor: 'e8ecf4',
                    primaryColor: '00d4aa',
                    hideLandingPageDetails: true,
                    hideEventTypeDetails: false,
                    hideGdprBanner: true,
                  }}
                  utm={{
                    utmSource: 'website',
                    utmMedium: 'booking-modal',
                    utmCampaign: 'strategy-call',
                  }}
                />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
