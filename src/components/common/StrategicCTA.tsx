import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useTranslation } from 'react-i18next'
// Direct imports to avoid circular dependency
import { Button } from './Button'
import { TierBadge } from './TierBadge'
import { PricingTier } from '../../types/pricing'
import { trackCTAImpression, trackCTAClick } from '../../utils/analytics'
import { useIsMobile } from '../../hooks'
import { useFloatingElement } from '../../contexts/FloatingElementContext'

export interface StrategicCTAProps {
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
  variant?: 'hero' | 'inline' | 'floating' | 'exit-intent' | 'module'
  /** Show urgency indicator */
  showUrgency?: boolean
  /** Urgency text */
  urgencyText?: string
  /** Trust indicators to display below CTAs */
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
  /** Tier badge variant */
  tierBadgeVariant?: 'icon' | 'compact' | 'full'
}

/**
 * StrategicCTA - High-conversion CTA component
 *
 * Features:
 * - Multiple variants (hero, inline, floating, exit-intent, module)
 * - Advanced analytics tracking (impressions, clicks, time-to-click)
 * - Gradient & glow styling
 * - Urgency indicators with smart visibility
 * - Trust signals
 * - Progressive disclosure
 * - Fully accessible (WCAG 2.1 AA)
 * - Mobile optimized (touch-friendly, responsive)
 * - Performance optimized (intersection observer)
 */
export const StrategicCTA: React.FC<StrategicCTAProps> = ({
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
  tierBadgeVariant = 'compact',
}) => {
  const { t } = useTranslation(['common'])

  // Use translation defaults if not provided
  const finalUrgencyText = urgencyText || t('common:cta.default_urgency')
  const finalTrustIndicators = trustIndicators || [
    t('common:cta.default_trust.strategy_call'),
    t('common:cta.default_trust.no_cc'),
    t('common:cta.default_trust.team_size'),
  ]
  const isMobile = useIsMobile()
  const ctaRef = useRef<HTMLDivElement>(null)
  const [hasTrackedImpression, setHasTrackedImpression] = useState(false)
  const [impressionTime, setImpressionTime] = useState<number>(0)
  const [isVisible, setIsVisible] = useState(true)
  const hasRegisteredRef = useRef(false)

  // Floating element coordination (only for floating variant)
  const { activeElement, openModal, closeModal } = useFloatingElement()

  // Register as modal when floating variant mounts (only once)
  useEffect(() => {
    if (variant === 'floating' && isVisible && !hasRegisteredRef.current) {
      openModal()
      hasRegisteredRef.current = true
    }
  }, [variant, isVisible, openModal])

  // Hide floating CTA when chat opens (DON'T call closeModal - chat will handle it)
  useEffect(() => {
    if (variant === 'floating' && activeElement === 'chat') {
      setIsVisible(false)
      hasRegisteredRef.current = false
    }
  }, [variant, activeElement])

  // Track impression with Intersection Observer (more performant than scroll listeners)
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
            trackCTAImpression(`${context}-${variant}`, moduleId || context, {
              variant,
              title,
              primaryText,
            })

            // Unobserve after tracking
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 } // Track when 50% visible
    )

    observer.observe(ctaRef.current)
    return () => observer.disconnect()
  }, [disableTracking, hasTrackedImpression, context, variant, moduleId, title, primaryText])

  // Handle primary click with analytics
  const handlePrimaryClick = () => {
    if (!disableTracking) {
      const timeToClick = impressionTime ? Date.now() - impressionTime : 0
      trackCTAClick(`${context}-${variant}-primary`, primaryText, {
        variant,
        title,
        timeToClick,
        isMobile,
        context,
      })
    }
    onPrimaryClick()
  }

  // Handle secondary click with analytics
  const handleSecondaryClick = () => {
    if (!disableTracking && onSecondaryClick) {
      const timeToClick = impressionTime ? Date.now() - impressionTime : 0
      trackCTAClick(`${context}-${variant}-secondary`, secondaryText || 'secondary', {
        variant,
        title,
        timeToClick,
        isMobile,
        context,
      })
      onSecondaryClick()
    } else if (onSecondaryClick) {
      onSecondaryClick()
    }
  }

  const variantStyles = {
    hero: `p-12 rounded-3xl glass-card-strong border-2 border-accent-primary/30 shadow-glow-primary ${isMobile ? 'p-8' : ''}`,
    inline: `p-8 rounded-2xl glass-card border border-accent-primary/20 ${isMobile ? 'p-6' : ''}`,
    floating: `fixed ${isMobile ? 'bottom-20 left-4 right-4 max-w-full' : 'bottom-8 right-8 max-w-sm'} p-5 rounded-2xl glass-card-strong border-2 border-accent-primary/40 shadow-2xl shadow-accent-primary/30 z-40`,
    'exit-intent': `p-10 rounded-2xl glass-card-strong border-2 border-accent-primary/50 shadow-glow-primary ${isMobile ? 'p-6 max-w-md' : 'max-w-xl'}`,
    module: `p-6 rounded-xl glass-card border border-accent-secondary/30 hover:border-accent-primary/40 transition-all ${isMobile ? 'p-4' : ''}`,
  }

  const containerClass = `${variantStyles[variant]} ${className}`

  // Handle close (floating variant only)
  const handleClose = () => {
    setIsVisible(false)
    closeModal()
  }

  // Don't render floating variant if hidden
  if (variant === 'floating' && !isVisible) {
    return null
  }

  return (
    <AnimatePresence>
      <motion.div
        ref={ctaRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.6 }}
        className={`${containerClass} text-center`}
        role="region"
        aria-label={`Call to action: ${title}`}
      >
        {/* Close button (floating variant only) */}
        {variant === 'floating' && (
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-2 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={t('common:actions.close')}
          >
            <X size={20} className="text-white/60 hover:text-white" />
          </button>
        )}
        {/* Urgency Banner */}
        {showUrgency && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`mb-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-warning/20 border border-accent-warning/40 text-sm font-semibold ${variant === 'floating' ? 'text-white' : 'text-accent-warning'}`}
          >
            {finalUrgencyText}
          </motion.div>
        )}

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className={`
          font-bold gradient-text mb-3 text-center
          ${
            variant === 'hero' || variant === 'exit-intent'
              ? 'text-4xl md:text-5xl'
              : variant === 'floating'
                ? 'text-2xl'
                : variant === 'module'
                  ? 'text-xl md:text-2xl'
                  : 'text-3xl md:text-4xl'
          }
        `}
        >
          {title}
        </motion.h2>

        {/* Tier Badge - Shows pricing tier exclusivity */}
        {tierBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-4 flex justify-center"
          >
            <TierBadge
              tier={tierBadge}
              variant={tierBadgeVariant}
              size={
                variant === 'hero' || variant === 'exit-intent'
                  ? 'lg'
                  : variant === 'floating'
                    ? 'sm'
                    : 'md'
              }
              glow
              showCheck
            />
          </motion.div>
        )}

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-lg text-white/90 mb-6 max-w-2xl mx-auto text-center"
          >
            {description}
          </motion.p>
        )}

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-5"
        >
          <Button
            variant="cta"
            size={
              variant === 'hero'
                ? 'xl' // Hero gets XL for maximum impact
                : variant === 'exit-intent'
                  ? 'lg' // Exit intent gets large
                  : variant === 'floating' || variant === 'module'
                    ? 'md' // Floating/module get medium (was sm, but md is better for accessibility)
                    : 'lg' // Default inline gets large
            }
            glow
            onClick={handlePrimaryClick}
            className={
              variant === 'floating'
                ? 'w-full font-bold touch-active'
                : variant === 'module'
                  ? 'w-full font-semibold touch-active'
                  : 'min-w-[240px] font-bold touch-active'
            }
            ariaLabel={`${primaryText} - ${title}`}
          >
            {primaryText}
          </Button>

          {secondaryText && onSecondaryClick && (
            <Button
              variant="outline"
              size={
                variant === 'hero' || variant === 'exit-intent'
                  ? 'lg'
                  : variant === 'floating' || variant === 'module'
                    ? 'md'
                    : 'lg'
              }
              onClick={handleSecondaryClick}
              className="min-w-[200px] touch-active"
              ariaLabel={`${secondaryText} - ${title}`}
            >
              {secondaryText}
            </Button>
          )}
        </motion.div>

        {/* Trust Indicators - Centered footer with benefits */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 sm:gap-4 text-center w-full"
        >
          {finalTrustIndicators.map((indicator, index) => (
            <div
              key={index}
              className={`flex items-center justify-center gap-2 text-sm ${variant === 'floating' ? 'text-white/90' : 'text-white/80'}`}
            >
              <span className="whitespace-nowrap">{indicator}</span>
            </div>
          ))}
        </motion.div>

        {/* Floating variant close button */}
        {variant === 'floating' && (
          <button
            onClick={(e) => {
              e.currentTarget.parentElement?.classList.add('hidden')
            }}
            className="absolute top-3 right-3 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors border border-white/20"
            style={{ background: 'rgba(0, 0, 0, 0.4)' }}
            aria-label={t('common:actions.close_floating_cta')}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default StrategicCTA
