/**
 * DesktopBanner - Mobile-only banner encouraging desktop usage
 *
 * Desktop-first compliant: This banner ONLY shows on mobile.
 * Purpose: Inform users that desktop provides the best experience.
 *
 * Features:
 * - Dismissible with localStorage persistence
 * - "Email me link" action
 * - Blue/purple gradient styling
 * - Non-blocking (top positioned)
 * - Fully accessible (ARIA, keyboard support)
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Monitor, Mail, X } from 'lucide-react'

interface DesktopBannerProps {
  /** LocalStorage key for dismissed state */
  storageKey?: string
  /** Custom callback for email action */
  onEmailClick?: () => void
  /** Custom callback for dismiss */
  onDismiss?: () => void
  className?: string
}

/**
 * DesktopBanner Component
 * Shows subtle banner encouraging desktop usage, only on mobile
 */
export const DesktopBanner: React.FC<DesktopBannerProps> = ({
  storageKey = 'desktop-banner-dismissed',
  onEmailClick,
  onDismiss,
  className = '',
}) => {
  const { t } = useTranslation('common')
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const isDismissed = localStorage.getItem(storageKey) === 'true'
    if (!isDismissed) {
      setIsVisible(true)
      // Delay animation for smooth entrance
      setTimeout(() => setIsAnimating(true), 100)
    }
  }, [storageKey])

  const handleDismiss = () => {
    // Animate out
    setIsAnimating(false)

    // Hide and persist after animation
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem(storageKey, 'true')

      // Screen reader announcement
      const announcement = document.createElement('div')
      announcement.setAttribute('role', 'status')
      announcement.setAttribute('aria-live', 'polite')
      announcement.className = 'sr-only'
      announcement.textContent = t(
        'mobile.desktopBanner.dismissed',
        'Desktop notification dismissed'
      )
      document.body.appendChild(announcement)
      setTimeout(() => document.body.removeChild(announcement), 1000)

      if (onDismiss) {
        onDismiss()
      }
    }, 300)
  }

  const handleEmailClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_desktop_link_click', {
        event_category: 'engagement',
        event_label: 'desktop_banner',
        value: 1,
      })
    }

    if (onEmailClick) {
      onEmailClick()
    } else {
      // Default: open email client with pre-filled content
      const subject = encodeURIComponent(
        t('mobile.desktopBanner.emailSubject', 'Desktop Link - FutureMarketingAI')
      )
      const body = encodeURIComponent(
        t(
          'mobile.desktopBanner.emailBody',
          'Please send me the link to experience FutureMarketingAI on desktop for the full interactive demo.'
        )
      )
      window.location.href = `mailto:?subject=${subject}&body=${body}`
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`fixed top-0 left-0 right-0 z-40 md:hidden ${className}`}
          role="region"
          aria-live="polite"
          aria-label={t('mobile.desktopBanner.label', 'Desktop experience notification')}
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                {/* Icon + Message */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Monitor className="w-5 h-5 text-white flex-shrink-0" aria-hidden="true" />
                  <p className="text-sm text-white font-medium truncate">
                    {t('mobile.desktopBanner.message', 'Best experience on desktop')}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Email Button */}
                  <button
                    onClick={handleEmailClick}
                    className="
                      flex items-center gap-1.5 px-3 py-1.5 min-h-touch-sm
                      bg-white/10 hover:bg-white/20 backdrop-blur-sm
                      border border-white/20 rounded-lg
                      text-xs font-semibold text-white whitespace-nowrap
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
                      active:scale-95
                      touch-manipulation
                    "
                    aria-label={t('mobile.desktopBanner.emailAction', 'Email me desktop link')}
                    type="button"
                  >
                    <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                    <span className="hidden xs:inline">
                      {t('mobile.desktopBanner.emailButton', 'Email Link')}
                    </span>
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={handleDismiss}
                    className="
                      flex items-center justify-center w-8 h-8 min-w-touch min-h-touch
                      hover:bg-white/10 rounded-lg
                      text-white/80 hover:text-white
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-600
                      active:scale-95
                      touch-manipulation
                    "
                    aria-label={t('mobile.desktopBanner.dismiss', 'Dismiss desktop notification')}
                    type="button"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

DesktopBanner.displayName = 'DesktopBanner'
