/**
 * StickyBottomCTA - Mobile-specific sticky bottom CTA bar
 *
 * Desktop-first compliant: This is a NEW mobile-only component.
 * Auto-hides on scroll down, reappears on scroll up.
 *
 * Requirements:
 * - Fixed bottom positioning with z-index
 * - Two large buttons (≥48px height)
 * - Auto-hide/show based on scroll direction
 * - Touch feedback and accessibility
 * - Safe area insets for notched devices
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Calendar } from 'lucide-react'

interface StickyBottomCTAProps {
  className?: string
  primaryLabel?: string
  secondaryLabel?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
  minScrollDistance?: number // Minimum scroll before showing (default: 200px)
}

/**
 * Custom hook for scroll direction detection
 * Returns 'up' | 'down' | 'none'
 */
const useScrollDirection = (threshold = 10) => {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none')
  const [scrollY, setScrollY] = useState(0)
  const lastScrollY = useRef(0)
  const ticking = useRef(false)

  useEffect(() => {
    const updateScrollDirection = () => {
      const currentScrollY = window.scrollY

      if (Math.abs(currentScrollY - lastScrollY.current) < threshold) {
        ticking.current = false
        return
      }

      setScrollDirection(currentScrollY > lastScrollY.current ? 'down' : 'up')
      setScrollY(currentScrollY)
      lastScrollY.current = currentScrollY > 0 ? currentScrollY : 0
      ticking.current = false
    }

    const onScroll = () => {
      if (!ticking.current) {
        window.requestAnimationFrame(updateScrollDirection)
        ticking.current = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [threshold])

  return { scrollDirection, scrollY }
}

export function StickyBottomCTA({
  className = '',
  primaryLabel,
  secondaryLabel,
  onPrimaryClick,
  onSecondaryClick,
  minScrollDistance = 200,
}: StickyBottomCTAProps) {
  const { t } = useTranslation()
  const { scrollDirection, scrollY } = useScrollDirection(10)
  const [isVisible, setIsVisible] = useState(false)

  // Show/hide based on scroll direction and distance
  useEffect(() => {
    if (scrollY < minScrollDistance) {
      setIsVisible(false)
      return
    }

    if (scrollDirection === 'up') {
      setIsVisible(true)
    } else if (scrollDirection === 'down') {
      setIsVisible(false)
    }
  }, [scrollDirection, scrollY, minScrollDistance])

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick()
    } else {
      // Default: Open interactive demo (same as hero primary CTA)
      window.open('/demo', '_blank')
    }
  }

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick()
    } else {
      // Default: Navigate to pricing/waitlist (same as hero secondary CTA)
      window.location.href = '/pricing'
    }
  }

  // Use landing page CTA labels by default for content parity
  const defaultPrimaryLabel = t('landing.hero_landing.cta.primary', 'Probeer Interactieve Demo')
  const defaultSecondaryLabel = t('landing.hero_landing.cta.secondary', 'Sluit aan bij Wachtlijst')

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
            fixed bottom-0 left-0 right-0 z-50
            border-t border-white/10
            backdrop-blur-xl bg-gradient-to-t from-bg-primary/95 to-bg-secondary/95
            pb-safe
            ${className}
          `}
          role="complementary"
          aria-label="Sticky call-to-action bar"
        >
          {/* Container with safe area padding */}
          <div className="flex items-center gap-3 px-4 py-3 safe-area-inset-x">
            {/* Primary CTA - Full width with flex-1 */}
            <button
              onClick={handlePrimaryClick}
              className="
                flex-1 h-14 min-h-touch
                bg-gradient-to-r from-accent-primary to-accent-secondary
                hover:from-accent-primary/90 hover:to-accent-secondary/90
                active:scale-[0.98]
                text-white font-semibold rounded-lg
                flex items-center justify-center gap-2
                transition-all duration-200
                shadow-lg hover:shadow-xl
                touch-manipulation
                group
              "
              aria-label={primaryLabel || defaultPrimaryLabel}
              type="button"
            >
              <span>{primaryLabel || defaultPrimaryLabel}</span>
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>

            {/* Secondary CTA - Fixed width icon button */}
            <button
              onClick={handleSecondaryClick}
              className="
                w-14 h-14 min-h-touch min-w-touch
                bg-bg-card border border-white/10
                hover:bg-bg-card/80 hover:border-accent-primary/50
                active:scale-[0.95]
                text-text-primary rounded-lg
                flex items-center justify-center
                transition-all duration-200
                shadow-md hover:shadow-lg
                touch-manipulation
                group
              "
              aria-label={secondaryLabel || defaultSecondaryLabel}
              type="button"
            >
              <Calendar className="w-6 h-6 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

StickyBottomCTA.displayName = 'StickyBottomCTA'
