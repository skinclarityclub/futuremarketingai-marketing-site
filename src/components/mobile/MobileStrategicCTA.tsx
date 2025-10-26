/**
 * MobileStrategicCTA - Compact mobile-optimized CTA component
 *
 * ✅ DESKTOP-FIRST COMPLIANT
 * - NEW mobile component, desktop StrategicCTA unchanged
 * - Used via conditional rendering based on isMobile
 *
 * Mobile Optimizations:
 * - Compact design (smaller padding, text sizes)
 * - Single column layout
 * - Touch-optimized buttons (48px minimum)
 * - Simplified trust indicators
 * - Reduced animations for performance
 */

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '../common/Button'
import { TierBadge } from '../common/TierBadge'
import { PricingTier } from '../../types/pricing'
import { trackCTAImpression, trackCTAClick } from '../../utils/analytics'

export interface MobileStrategicCTAProps {
  /** Main CTA text */
  title: string
  /** Supporting description/subtitle */
  description?: string
  /** Primary button text */
  primaryText: string
  /** Primary button click handler */
  onPrimaryClick: () => void
  /** Secondary button text (optional) */
  secondaryText?: string
  /** Secondary button click handler */
  onSecondaryClick?: () => void
  /** CTA variant/style */
  variant?: 'hero' | 'inline' | 'floating' | 'module'
  /** Show urgency indicator */
  showUrgency?: boolean
  /** Urgency text */
  urgencyText?: string
  /** Trust indicators (max 2 for mobile) */
  trustIndicators?: string[]
  /** Custom className */
  className?: string
  /** Context/location for analytics tracking */
  context?: string
  /** Module ID for module variant */
  moduleId?: string
  /** Disable analytics tracking (for testing) */
  disableTracking?: boolean
  /** Show tier badge for pricing exclusivity */
  tierBadge?: PricingTier
}

/**
 * MobileStrategicCTA - Compact, mobile-optimized CTA
 * Smaller, simpler, touch-friendly
 */
export function MobileStrategicCTA({
  title,
  description,
  primaryText,
  onPrimaryClick,
  secondaryText,
  onSecondaryClick,
  variant = 'inline',
  showUrgency = false,
  urgencyText,
  trustIndicators,
  className = '',
  context = 'unknown',
  moduleId,
  disableTracking = false,
  tierBadge,
}: MobileStrategicCTAProps) {
  const { t } = useTranslation(['common'])

  // Use translation defaults if not provided
  const finalUrgencyText = urgencyText || t('common:cta.default_urgency')
  // Mobile: max 2 trust indicators
  const finalTrustIndicators = (
    trustIndicators || [
      t('common:cta.default_trust.strategy_call'),
      t('common:cta.default_trust.no_cc'),
    ]
  ).slice(0, 2)

  const ctaRef = useRef<HTMLDivElement>(null)
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false)
  const [impressionTime, setImpressionTime] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(true)

  // Track impression with Intersection Observer
  useEffect(() => {
    if (disableTracking || hasTrackedImpression || !ctaRef.current) {
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            setImpressionTime(Date.now())
            setHasTrackedImpression(true)

            // Track impression
            trackCTAImpression(`mobile-${context}-${variant}`, moduleId || context, {
              variant,
              title,
              primaryText,
              isMobile: true,
            })

            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )

    observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [disableTracking, hasTrackedImpression, context, variant, moduleId, title, primaryText])

  // Handle primary click with analytics
  const handlePrimaryClick = () => {
    if (!disableTracking) {
      const timeToClick = impressionTime ? Date.now() - impressionTime : 0
      trackCTAClick(`mobile-${context}-${variant}-primary`, primaryText, {
        variant,
        title,
        timeToClick,
        isMobile: true,
        context,
      })
    }
    onPrimaryClick()
  }

  // Handle secondary click with analytics
  const handleSecondaryClick = () => {
    if (!disableTracking && onSecondaryClick) {
      const timeToClick = impressionTime ? Date.now() - impressionTime : 0
      trackCTAClick(`mobile-${context}-${variant}-secondary`, secondaryText || 'secondary', {
        variant,
        title,
        timeToClick,
        isMobile: true,
        context,
      })
      onSecondaryClick()
    } else if (onSecondaryClick) {
      onSecondaryClick()
    }
  }

  // Compact mobile styles
  const variantStyles = {
    hero: 'p-6 rounded-2xl glass-card-strong border-2 border-accent-primary/30 shadow-glow-primary',
    inline: 'p-5 rounded-xl glass-card border border-accent-primary/20',
    floating:
      'fixed bottom-20 left-4 right-4 p-4 rounded-xl glass-card-strong border-2 border-accent-primary/40 shadow-2xl shadow-accent-primary/30 z-40',
    module: 'p-4 rounded-lg glass-card border border-accent-secondary/30 hover:border-accent-primary/40 transition-all',
  }

  const containerClass = `${variantStyles[variant]} ${className}`

  // Handle close (floating variant only)
  const handleClose = () => {
    setIsVisible(false)
  }

  // Don't render floating variant if hidden
  if (variant === 'floating' && !isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={ctaRef}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ duration: 0.4 }}
        className={`${containerClass} text-center`}
        role="region"
        aria-label={`Call to action: ${title}`}
      >
        {/* Close button (floating variant only) */}
        {variant === 'floating' && (
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={t('common:actions.close')}
          >
            <X size={18} className="text-white/60 hover:text-white" />
          </button>
        )}

        {/* Urgency Banner - Compact */}
        {showUrgency && (
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-accent-warning/20 border border-accent-warning/40 text-xs font-semibold text-accent-warning"
          >
            {finalUrgencyText}
          </motion.div>
        )}

        {/* Tier Badge - Compact */}
        {tierBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="mb-3 flex justify-center"
          >
            <TierBadge tier={tierBadge} variant="compact" size="sm" glow showCheck />
          </motion.div>
        )}

        {/* Title - Compact */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.3 }}
          className={`
            font-bold gradient-text mb-2 text-center
            ${variant === 'hero' ? 'text-2xl' : variant === 'floating' ? 'text-lg' : variant === 'module' ? 'text-base' : 'text-xl'}
          `}
        >
          {title}
        </motion.h2>

        {/* Description - Compact */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="text-sm text-white/90 mb-4 max-w-md mx-auto text-center"
          >
            {description}
          </motion.p>
        )}

        {/* CTA Buttons - Compact, Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
          className="flex flex-col items-center gap-2 mb-3"
        >
          <Button
            variant="cta"
            size={variant === 'hero' ? 'lg' : 'md'}
            glow={variant === 'hero'}
            onClick={handlePrimaryClick}
            className="w-full h-12 min-h-touch font-semibold touch-manipulation"
            ariaLabel={`${primaryText} - ${title}`}
          >
            {primaryText}
          </Button>

          {secondaryText && onSecondaryClick && (
            <Button
              variant="outline"
              size="md"
              onClick={handleSecondaryClick}
              className="w-full h-11 min-h-touch touch-manipulation"
              ariaLabel={`${secondaryText} - ${title}`}
            >
              {secondaryText}
            </Button>
          )}
        </motion.div>

        {/* Trust Indicators - Compact (max 2) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex flex-col items-center gap-1.5 text-center"
        >
          {finalTrustIndicators.map((indicator, index) => (
            <div key={index} className="text-xs text-white/70">
              {indicator}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

MobileStrategicCTA.displayName = 'MobileStrategicCTA'

