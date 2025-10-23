import React, { useState, useEffect } from 'react'
import { X, Mail } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DesktopBannerProps {
  /**
   * Callback when user clicks "Email me link"
   * If not provided, default behavior will open email client
   */
  onEmailClick?: () => void
  /**
   * Custom className for additional styling
   */
  className?: string
  /**
   * Storage key for persistence (default: 'desktop-banner-dismissed')
   */
  storageKey?: string
}

/**
 * DesktopBanner Component
 *
 * A subtle, dismissible banner that appears at the top of mobile pages
 * encouraging users to visit the site on desktop for the best experience.
 *
 * Features:
 * - Mobile-only display (hidden on tablet and above)
 * - Blue/purple gradient styling
 * - Persistent dismiss state using localStorage
 * - Accessible with ARIA live region and keyboard navigation
 * - Optional "Email me link" action
 *
 * @example
 * ```tsx
 * <DesktopBanner onEmailClick={() => openEmailModal()} />
 * ```
 */
export const DesktopBanner: React.FC<DesktopBannerProps> = ({
  onEmailClick,
  className = '',
  storageKey = 'desktop-banner-dismissed',
}) => {
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem(storageKey) === 'true'

    if (!isDismissed) {
      // Small delay for smooth animation
      setTimeout(() => {
        setIsVisible(true)
        setIsAnimating(true)
      }, 500)
    }
  }, [storageKey])

  const handleDismiss = () => {
    setIsAnimating(false)

    // Wait for animation to complete before hiding
    setTimeout(() => {
      setIsVisible(false)
      localStorage.setItem(storageKey, 'true')

      // Announce to screen readers
      const announcement = document.createElement('div')
      announcement.setAttribute('role', 'status')
      announcement.setAttribute('aria-live', 'polite')
      announcement.className = 'sr-only'
      announcement.textContent = t('mobile.desktopBanner.dismissed', 'Banner dismissed')
      document.body.appendChild(announcement)

      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    }, 300)
  }

  const handleEmailClick = () => {
    if (onEmailClick) {
      onEmailClick()
    } else {
      // Default behavior: open email client with subject line
      const subject = encodeURIComponent(
        t('mobile.desktopBanner.emailSubject', 'Send me a link to view on desktop')
      )
      const body = encodeURIComponent(
        t(
          'mobile.desktopBanner.emailBody',
          'Please send me a link to view this page on my desktop computer.'
        )
      )
      window.location.href = `mailto:?subject=${subject}&body=${body}`
    }
  }

  if (!isVisible) {
    return null
  }

  return (
    <div
      role="region"
      aria-live="polite"
      aria-label={t('mobile.desktopBanner.label', 'Desktop experience notification')}
      className={`
        fixed top-0 left-0 right-0 z-50
        tablet:hidden
        transition-all duration-300 ease-out
        ${isAnimating ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}
        ${className}
      `}
    >
      <div
        className="
          relative
          bg-gradient-primary
          px-4 py-3
          shadow-lg shadow-accent-primary/20
        "
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent-primary/80 via-accent-secondary/80 to-accent-primary/80 opacity-90" />

        {/* Content */}
        <div className="relative flex items-center justify-between gap-3">
          {/* Message and CTA */}
          <div className="flex-1 flex flex-col mobile:flex-row mobile:items-center gap-2 min-w-0">
            <p className="text-sm font-medium text-white leading-tight">
              {t('mobile.desktopBanner.message', '🖥️ Best viewed on desktop')}
            </p>

            <button
              onClick={handleEmailClick}
              className="
                flex items-center gap-1.5
                px-3 py-1.5
                bg-white/20 hover:bg-white/30
                backdrop-blur-sm
                rounded-lg
                text-xs font-semibold text-white
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent-primary
                active:scale-95
                whitespace-nowrap
                min-h-touch-sm mobile:min-h-0
              "
              aria-label={t(
                'mobile.desktopBanner.emailAriaLabel',
                'Send me a link to view this page on desktop'
              )}
            >
              <Mail className="w-3.5 h-3.5" aria-hidden="true" />
              <span>{t('mobile.desktopBanner.emailCta', 'Email me link')}</span>
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="
              flex-shrink-0
              p-2
              rounded-lg
              text-white/80 hover:text-white
              hover:bg-white/10
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-accent-primary
              active:scale-95
              min-w-touch min-h-touch
              flex items-center justify-center
            "
            aria-label={t('mobile.desktopBanner.closeAriaLabel', 'Dismiss desktop notification')}
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default DesktopBanner
