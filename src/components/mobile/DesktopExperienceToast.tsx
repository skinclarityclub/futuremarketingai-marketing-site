/**
 * DesktopExperienceToast - Mobile-only toast notification
 *
 * Features:
 * - Appears bottom-center on mobile landing page
 * - Auto-dismisses after 5 seconds
 * - Manually dismissible with X button
 * - Persists dismissal to sessionStorage
 * - Slide-up animation
 * - Non-intrusive, modern design
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Monitor, X } from 'lucide-react'

interface DesktopExperienceToastProps {
  className?: string
  autoDismissDelay?: number // milliseconds, default 5000 (5s)
  storageKey?: string
}

export function DesktopExperienceToast({
  className = '',
  autoDismissDelay = 5000,
  storageKey = 'desktop-toast-dismissed',
}: DesktopExperienceToastProps) {
  const { t } = useTranslation(['mobile', 'common'])
  const [isVisible, setIsVisible] = useState(false)

  // Load dismissal state and handle auto-dismiss
  useEffect(() => {
    // Check if already dismissed
    const dismissed = sessionStorage.getItem(storageKey)
    if (dismissed === 'true') {
      return
    }

    // Show toast after short delay (for smooth initial load)
    const showTimer = setTimeout(() => {
      setIsVisible(true)
    }, 1000)

    // Auto-dismiss timer
    const dismissTimer = setTimeout(() => {
      setIsVisible(false)
      sessionStorage.setItem(storageKey, 'true')
    }, autoDismissDelay + 1000) // +1000 for show delay

    return () => {
      clearTimeout(showTimer)
      clearTimeout(dismissTimer)
    }
  }, [autoDismissDelay, storageKey])

  const handleDismiss = () => {
    setIsVisible(false)
    sessionStorage.setItem(storageKey, 'true')

    // Track dismissal
    if (window.gtag) {
      window.gtag('event', 'desktop_toast_dismissed', {
        event_category: 'engagement',
        event_label: 'mobile_landing_page',
        value: 1,
      })
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30,
            opacity: { duration: 0.2 },
          }}
          className={`
            fixed bottom-24 left-1/2 -translate-x-1/2
            z-[60] w-full max-w-sm mx-auto px-4
            md:hidden
            ${className}
          `}
          role="status"
          aria-live="polite"
          aria-label={t('mobile:desktop_toast.label', 'Desktop experience notification')}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl px-4 py-3 shadow-2xl flex items-center gap-3 border border-white/20">
            {/* Icon */}
            <Monitor className="w-5 h-5 text-white flex-shrink-0" aria-hidden="true" />

            {/* Message */}
            <span className="text-sm text-white font-medium flex-1">
              ✨ {t('mobile:desktop_toast.message', 'Beste ervaring op desktop')}
            </span>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="
                w-8 h-8 min-w-[32px] min-h-[32px]
                flex items-center justify-center
                hover:bg-white/10 rounded-lg
                transition-colors
                touch-manipulation
              "
              aria-label={t('common:actions.close', 'Close')}
              type="button"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Progress bar (shows auto-dismiss countdown) */}
          <motion.div
            className="absolute bottom-0 left-0 h-1 bg-white/30 rounded-b-xl"
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: autoDismissDelay / 1000, ease: 'linear', delay: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

