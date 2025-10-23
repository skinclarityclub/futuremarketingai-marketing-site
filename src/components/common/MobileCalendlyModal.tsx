import React, { useEffect, useState } from 'react'
import { InlineWidget } from 'react-calendly'
import { useTranslation } from 'react-i18next'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { trackCalendly } from '../../utils/analytics'
import { trackGA4Event } from '../../utils/ga4'
import { hotjarEvent, HotjarEvents } from '../../utils/hotjar'

interface MobileCalendlyModalProps {
  /** Show/hide modal */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Calendly URL */
  url: string
  /** Pre-fill data */
  prefill?: Record<string, any>
}

/**
 * MobileCalendlyModal - Mobile-optimized full-screen Calendly booking
 *
 * Features:
 * - Full-screen on mobile for maximum usability
 * - Large, touch-friendly form fields (via Calendly's mobile optimization)
 * - Native date/time pickers on mobile devices (handled by Calendly)
 * - Smooth slide-up animation
 * - Focus trap and accessibility
 * - Safe area support for notched devices
 *
 * @example
 * ```tsx
 * <MobileCalendlyModal
 *   isOpen={isOpen}
 *   onClose={handleClose}
 *   url="https://calendly.com/..."
 *   prefill={{ name: 'John', email: 'john@example.com' }}
 * />
 * ```
 */
export const MobileCalendlyModal: React.FC<MobileCalendlyModalProps> = ({
  isOpen,
  onClose,
  url,
  prefill,
}) => {
  const { t } = useTranslation(['calendly', 'common'])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false)

  // Track Calendly events
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        const eventType = e.data.event

        console.log('📅 Mobile Calendly event:', eventType, e.data)

        switch (eventType) {
          case 'calendly.event_scheduled':
            console.log('✅ Meeting scheduled on mobile!')
            trackCalendly('Event Scheduled', 'mobile-booking-completed')
            trackGA4Event('booking_completed', {
              event_category: 'calendly',
              event_label: 'mobile_meeting_scheduled',
              device: 'mobile',
              value: 1,
            })
            hotjarEvent(HotjarEvents.CALENDLY_BOOKING_COMPLETED)
            // Close modal after successful booking
            setTimeout(() => onClose(), 1500)
            break

          case 'calendly.profile_page_viewed':
            console.log('👀 Profile page viewed on mobile')
            setIsLoading(false)
            setHasError(false)
            trackCalendly('Profile Viewed', 'mobile-widget-loaded')
            break

          case 'calendly.date_and_time_selected':
            console.log('📆 Date and time selected on mobile')
            trackCalendly('Date Selected', 'mobile-user-interaction')
            trackGA4Event('booking_date_selected', {
              event_category: 'calendly',
              event_label: 'mobile_date_time_selected',
              device: 'mobile',
            })
            break

          case 'calendly.event_type_viewed':
            console.log('📋 Event type viewed on mobile')
            trackCalendly('Event Type Viewed', 'mobile-widget-interaction')
            break

          default:
            trackCalendly(eventType.replace('calendly.', ''), 'mobile-calendly-event')
        }
      }
    }

    if (isOpen) {
      setIsLoading(true)
      setHasError(false)
      window.addEventListener('message', handleCalendlyEvent)

      // Detect ad blockers after 5 seconds
      const adBlockerTimeout = setTimeout(() => {
        if (isLoading) {
          setIsAdBlockerDetected(true)
          console.warn('⚠️ Possible ad blocker detected on mobile - Calendly widget not loading')
          trackGA4Event('calendly_blocked', {
            event_category: 'error',
            event_label: 'mobile_potential_ad_blocker',
            device: 'mobile',
          })
        }
      }, 5000)

      return () => {
        window.removeEventListener('message', handleCalendlyEvent)
        clearTimeout(adBlockerTimeout)
      }
    }

    return undefined
  }, [isOpen, isLoading, onClose])

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[9998]"
            aria-hidden="true"
          />

          {/* Full-Screen Modal */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="
              fixed inset-0 z-[9999] 
              bg-bg-surface
              flex flex-col
              safe-area-inset
            "
            role="dialog"
            aria-modal="true"
            aria-label={t('common:accessibility.booking_calendar')}
          >
            {/* Header - Fixed at top */}
            <div
              className="
              flex-shrink-0
              flex items-center justify-between
              px-4 py-3
              bg-gradient-primary
              shadow-lg
              safe-area-top
            "
            >
              <h2 className="text-lg font-semibold text-white">
                {t('calendly:modal.title', 'Schedule Your Call')}
              </h2>

              <button
                onClick={onClose}
                className="
                  flex items-center justify-center
                  min-w-touch min-h-touch
                  p-2
                  rounded-lg
                  text-white/80 hover:text-white
                  hover:bg-white/10
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent-primary
                  active:scale-95
                "
                aria-label={t('common:actions.close_modal', 'Close modal')}
              >
                <X className="w-6 h-6" aria-hidden="true" />
              </button>
            </div>

            {/* Calendly Widget - Scrollable content */}
            <div className="flex-1 overflow-y-auto bg-white relative safe-area-bottom">
              {/* Loading State */}
              {isLoading && !hasError && !isAdBlockerDetected && (
                <div
                  className="absolute inset-0 flex items-center justify-center bg-white z-10"
                  role="status"
                  aria-live="polite"
                >
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    <p className="text-gray-700 text-sm">
                      {t('calendly:modal.loading', 'Loading calendar...')}
                    </p>
                  </div>
                </div>
              )}

              {/* Error/Ad Blocker Fallback */}
              {(hasError || isAdBlockerDetected) && (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-white"
                  role="alert"
                  aria-live="assertive"
                >
                  <p className="text-lg font-semibold text-gray-900 mb-4">
                    {isAdBlockerDetected ? '🚫 Ad Blocker Detected' : '⚠️ Loading Error'}
                  </p>
                  <p className="text-sm text-gray-700 mb-6">
                    {isAdBlockerDetected
                      ? 'Please disable your ad blocker or use the direct link below.'
                      : 'The scheduling widget could not be loaded. Please use the direct link below.'}
                  </p>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      px-6 py-3
                      bg-blue-600 text-white
                      rounded-lg
                      hover:bg-blue-700
                      transition-colors
                      focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      min-h-touch
                    "
                    aria-label={t('common:accessibility.open_calendly', 'Open Calendly in new tab')}
                  >
                    {t('common:calendly.open_direct', 'Open Calendly Direct →')}
                  </a>
                </div>
              )}

              {!hasError && !isAdBlockerDetected && (
                <InlineWidget
                  url={url}
                  prefill={prefill}
                  styles={{
                    height: '100%',
                    minHeight: '100%',
                  }}
                  pageSettings={{
                    // Mobile-optimized settings
                    hideEventTypeDetails: false,
                    hideLandingPageDetails: false,
                    primaryColor: '6366f1', // Match accent-primary
                    textColor: '000000',
                    backgroundColor: 'ffffff',
                  }}
                />
              )}
            </div>

            {/* Trust Signals Footer */}
            <div
              className="
              flex-shrink-0
              flex flex-wrap justify-center gap-3
              px-4 py-3
              bg-bg-surface
              border-t border-white/10
              text-xs text-white/80
              safe-area-bottom
            "
            >
              <span>✓ {t('calendly:modal.trust_signals.no_obligations', 'No obligations')}</span>
              <span>✓ {t('calendly:modal.trust_signals.free_advice', 'Free consultation')}</span>
              <span>✓ {t('calendly:modal.trust_signals.instant_booking', 'Instant booking')}</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}

export default MobileCalendlyModal
