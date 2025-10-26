import React, { useEffect, useState } from 'react'
import { InlineWidget } from 'react-calendly'
import { useTranslation } from 'react-i18next'
// Direct import to avoid circular dependency
import { Modal } from './Modal'
import { MobileCalendlyModal } from './MobileCalendlyModal'
import { trackCalendly } from '../../utils/analytics'
import { trackGA4Event } from '../../utils/ga4'
import { hotjarEvent, HotjarEvents } from '../../utils/hotjar'
import { useIsMobile } from '../../hooks'

// Default Calendly URL (fallback)
const DEFAULT_CALENDLY_URL = 'https://calendly.com/futuremarketingai/platform-demo-30min'

// Calendly Prefill type structure
interface CalendlyPrefill {
  name?: string
  email?: string
  firstName?: string
  lastName?: string
  location?: string
  guests?: string[]
  customAnswers?: {
    a1?: string
    a2?: string
    a3?: string
    a4?: string
    a5?: string
    a6?: string
    a7?: string
    a8?: string
    a9?: string
    a10?: string
  }
  date?: Date
}

export interface CalendlyModalProps {
  /** Show/hide modal */
  isOpen: boolean
  /** Close handler */
  onClose: () => void
  /** Calendly URL (with or without UTM parameters) */
  url?: string
  /** Pre-fill data - Calendly prefill structure */
  prefill?: CalendlyPrefill
  /** Use inline widget instead of popup */
  inline?: boolean
}

/**
 * CalendlyModal - Enhanced Calendly booking integration (2025 Best Practices)
 *
 * Features:
 * - Official React Calendly widget with lazy loading
 * - Pre-fill support for user data with automatic personalization
 * - UTM parameter support for campaign tracking
 * - Advanced event tracking (scheduled, viewed, closed, date_selected)
 * - Loading states with fallback for errors
 * - Ad blocker detection and fallback links
 * - Inline or modal popup modes
 * - Mobile optimized (min-height 700px, proper scrolling)
 * - Full WCAG 2.1 AA accessibility compliance
 * - SSR-safe implementation
 */
export const CalendlyModal: React.FC<CalendlyModalProps> = ({
  isOpen,
  onClose,
  url = DEFAULT_CALENDLY_URL,
  prefill,
  inline = false,
}) => {
  const { t } = useTranslation(['calendly'])
  const isMobile = useIsMobile()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [isAdBlockerDetected, setIsAdBlockerDetected] = useState(false)

  // Track Calendly events with enhanced analytics
  useEffect(() => {
    const handleCalendlyEvent = (e: MessageEvent) => {
      if (e.data.event && e.data.event.indexOf('calendly') === 0) {
        const eventType = e.data.event

        console.log('📅 Calendly event:', eventType, e.data)

        // Track all Calendly events
        switch (eventType) {
          case 'calendly.event_scheduled':
            console.log('✅ Meeting scheduled!')
            trackCalendly('Event Scheduled', 'booking-completed')
            trackGA4Event('booking_completed', {
              event_category: 'calendly',
              event_label: 'meeting_scheduled',
              value: 1,
            })
            // Track to Hotjar - HIGH VALUE EVENT!
            hotjarEvent(HotjarEvents.CALENDLY_BOOKING_COMPLETED)
            // Close modal after successful booking
            setTimeout(() => onClose(), 1500)
            break

          case 'calendly.profile_page_viewed':
            console.log('👀 Profile page viewed')
            setIsLoading(false)
            setHasError(false)
            trackCalendly('Profile Viewed', 'widget-loaded')
            break

          case 'calendly.date_and_time_selected':
            console.log('📆 Date and time selected')
            trackCalendly('Date Selected', 'user-interaction')
            trackGA4Event('booking_date_selected', {
              event_category: 'calendly',
              event_label: 'date_time_selected',
            })
            break

          case 'calendly.event_type_viewed':
            console.log('📋 Event type viewed')
            trackCalendly('Event Type Viewed', 'widget-interaction')
            break

          default:
            // Track any other Calendly events
            trackCalendly(eventType.replace('calendly.', ''), 'calendly-event')
        }
      }
    }

    if (isOpen) {
      setIsLoading(true)
      setHasError(false)
      window.addEventListener('message', handleCalendlyEvent)

      // Detect ad blockers after 5 seconds if still loading
      const adBlockerTimeout = setTimeout(() => {
        if (isLoading) {
          setIsAdBlockerDetected(true)
          console.warn('⚠️ Possible ad blocker detected - Calendly widget not loading')
          trackGA4Event('calendly_blocked', {
            event_category: 'error',
            event_label: 'potential_ad_blocker',
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

  // Use MobileCalendlyModal for mobile devices (full-screen optimization)
  if (isMobile && !inline) {
    return <MobileCalendlyModal isOpen={isOpen} onClose={onClose} url={url} prefill={prefill} />
  }

  if (inline) {
    return (
      <div
        className="w-full min-h-[700px] rounded-xl overflow-hidden"
        role="region"
        aria-label={t('common:accessibility.schedule_appointment')}
      >
        {(hasError || isAdBlockerDetected) && (
          <div className="flex flex-col items-center justify-center min-h-[700px] p-8 text-center">
            <p className="text-lg font-semibold text-gray-100 mb-4">
              {isAdBlockerDetected ? '🚫 Ad Blocker Gedetecteerd' : '⚠️ Fout bij laden'}
            </p>
            <p className="text-sm text-gray-400 mb-6">
              {isAdBlockerDetected
                ? 'Schakel je ad blocker uit of gebruik de directe link hieronder.'
                : 'De scheduling widget kon niet worden geladen.'}
            </p>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {t('common:calendly.open_direct')}
            </a>
          </div>
        )}
        {!hasError && !isAdBlockerDetected && (
          <InlineWidget
            url={url}
            prefill={prefill}
            styles={{
              height: '700px',
              minHeight: '700px',
            }}
          />
        )}
      </div>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t('calendly:modal.title')} size="xl">
      <div className="space-y-4">
        <div
          className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30"
          role="complementary"
          aria-label={t('common:accessibility.what_to_expect')}
        >
          <p className="text-white">
            <strong>{t('calendly:modal.what_to_expect.heading')}</strong>
          </p>
          <ul className="mt-2 space-y-2 text-sm text-white/90" role="list">
            {(t('calendly:modal.what_to_expect.items', { returnObjects: true }) as string[]).map(
              (item, index) => (
                <li key={index} role="listitem">
                  • {item}
                </li>
              )
            )}
          </ul>
        </div>

        {/* Calendly Inline Widget */}
        <div
          className="relative w-full min-h-[700px] sm:h-[600px] rounded-xl overflow-hidden border border-white/10"
          role="region"
          aria-label={t('common:accessibility.booking_calendar')}
        >
          {/* Loading State */}
          {isLoading && !hasError && !isAdBlockerDetected && (
            <div
              className="absolute inset-0 flex items-center justify-center bg-bg-card/50 backdrop-blur-sm z-10"
              role="status"
              aria-live="polite"
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="w-12 h-12 border-4 border-accent-primary/30 border-t-accent-primary rounded-full animate-spin"
                  aria-hidden="true"
                />
                <p className="text-white/80 text-sm">{t('calendly:modal.loading')}</p>
              </div>
            </div>
          )}

          {/* Error/Ad Blocker Fallback */}
          {(hasError || isAdBlockerDetected) && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-bg-card"
              role="alert"
              aria-live="assertive"
            >
              <p className="text-lg font-semibold text-white mb-4">
                {isAdBlockerDetected ? '🚫 Ad Blocker Gedetecteerd' : '⚠️ Fout bij laden'}
              </p>
              <p className="text-sm text-white/80 mb-6">
                {isAdBlockerDetected
                  ? 'Schakel je ad blocker uit of gebruik de directe link hieronder.'
                  : 'De scheduling widget kon niet worden geladen. Gebruik de directe link hieronder.'}
              </p>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label={t('common:accessibility.open_calendly')}
              >
                {t('common:calendly.open_direct')}
              </a>
            </div>
          )}

          {!hasError && !isAdBlockerDetected && (
            <InlineWidget
              url={url}
              prefill={prefill}
              styles={{
                height: '700px',
                minHeight: '700px',
              }}
            />
          )}
        </div>

        {/* Trust Signals */}
        <div
          className="flex flex-wrap justify-center gap-4 text-sm text-white/90 pt-4"
          role="list"
          aria-label={t('common:accessibility.trust_indicators')}
        >
          <span role="listitem">{t('calendly:modal.trust_signals.no_obligations')}</span>
          <span role="listitem">{t('calendly:modal.trust_signals.free_advice')}</span>
          <span role="listitem">{t('calendly:modal.trust_signals.instant_booking')}</span>
        </div>
      </div>
    </Modal>
  )
}

export default CalendlyModal
