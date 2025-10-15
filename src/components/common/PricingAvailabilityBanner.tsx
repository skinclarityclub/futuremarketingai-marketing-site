import React, { useMemo, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GlassCard } from './GlassCard'
import { Button } from './Button'
import {
  TIER_CONFIGS,
  getCurrentTier,
  calculateSlotAvailability,
  formatPrice,
} from '../../types/pricing'
// import { trackPricingBannerImpression, trackPricingBannerClick, trackUrgencyTrigger } from '../../utils/analytics';

export interface PricingAvailabilityBannerProps {
  /** Current total number of customers (for demo, use simulated value) */
  totalCustomers?: number
  /** Variant: floating (fixed position) or inline */
  variant?: 'floating' | 'inline'
  /** Position for floating variant */
  position?: 'top-right' | 'top-left' | 'bottom-center'
  /** Show expanded view by default */
  expandedByDefault?: boolean
  /** Additional CSS classes */
  className?: string
  /** Callback when user clicks CTA */
  onCTAClick?: () => void
}

/**
 * PricingAvailabilityBanner - Shows real-time slot availability with urgency
 *
 * Features:
 * - Real-time slot counter with ARIA live region
 * - Animated progress bar per tier
 * - Cyan/purple/green color schemes matching demo theme
 * - Respects prefers-reduced-motion
 * - Mobile responsive (sticky bottom on mobile, fixed top-right on desktop)
 * - Non-manipulative messaging
 *
 * Based on research-backed UX best practices for early adopter pricing.
 */
export const PricingAvailabilityBanner: React.FC<PricingAvailabilityBannerProps> = ({
  totalCustomers = 3, // Demo default: 3 customers claimed
  variant = 'floating',
  position = 'top-right',
  expandedByDefault = false,
  className = '',
  onCTAClick,
}) => {
  const { t } = useTranslation('common')
  const shouldReduceMotion = useReducedMotion()
  const [isExpanded, setIsExpanded] = useState(expandedByDefault)
  const [isVisible, setIsVisible] = useState(false)

  // Calculate current tier and availability
  const currentTier = useMemo(() => getCurrentTier(totalCustomers), [totalCustomers])
  const currentTierConfig = useMemo(() => TIER_CONFIGS[currentTier], [currentTier])
  const slotAvailability = useMemo(
    () => calculateSlotAvailability(currentTier, totalCustomers),
    [currentTier, totalCustomers]
  )

  // Next tier info
  const nextTier = useMemo(() => {
    if (currentTier === 'founding') {
      return 'pioneer'
    }
    if (currentTier === 'pioneer') {
      return 'innovator'
    }
    if (currentTier === 'innovator') {
      return 'standard'
    }
    return null
  }, [currentTier])

  const nextTierConfig = nextTier ? TIER_CONFIGS[nextTier] : null

  // Animate entrance after mount
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  // Track impression analytics (temporarily disabled)
  // useEffect(() => {
  //   if (isVisible) {
  //     trackPricingBannerImpression(
  //       'Unknown', // Location will be passed as prop in production
  //       position,
  //       variant,
  //       {
  //         currentCustomers: totalCustomers,
  //         slotsRemaining: slotAvailability.remaining,
  //         currentTier: currentTier,
  //       }
  //     );

  //     // Track urgency trigger if low availability
  //     if (slotAvailability.remaining <= 5) {
  //       trackUrgencyTrigger('low_availability', currentTier, slotAvailability.remaining);
  //     }
  //   }
  // }, [isVisible, position, variant, totalCustomers, slotAvailability.remaining, currentTier]);

  // Position classes for floating variant
  const positionClasses = {
    'top-right': 'top-4 right-4 md:top-6 md:right-6',
    'top-left': 'top-4 left-4 md:top-6 md:left-6',
    'bottom-center':
      'bottom-0 left-0 right-0 md:bottom-6 md:left-1/2 md:-translate-x-1/2 md:w-auto',
  }

  // Badge color classes - Using demo theme colors
  const badgeColorClasses = {
    cyan: 'bg-gradient-to-r from-cyan-400 to-blue-500',
    purple: 'bg-gradient-to-r from-purple-400 to-purple-600',
    green: 'bg-gradient-to-r from-emerald-400 to-green-500',
    gray: 'bg-gradient-to-r from-gray-400 to-gray-600',
  }

  // Render collapsed view (minimal badge)
  const renderCollapsed = () => (
    <motion.div
      key="collapsed"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center gap-3 p-3 md:p-4 cursor-pointer"
      onClick={() => setIsExpanded(true)}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          setIsExpanded(true)
        }
      }}
      aria-label={
        t('pricing_banner.slots_remaining_label', {
          remaining: slotAvailability.remaining,
          total: slotAvailability.total,
        }) +
        '. ' +
        currentTierConfig.displayName
      }
    >
      {/* Tier Icon */}
      <motion.span
        className="text-2xl md:text-3xl flex-shrink-0"
        animate={
          shouldReduceMotion
            ? {}
            : {
                scale: [1, 1.1, 1],
              }
        }
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        {currentTierConfig.badge.icon}
      </motion.span>

      {/* Slot Counter */}
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm font-bold text-white leading-tight">
          {currentTierConfig.displayName}
        </p>
        <p className="text-xs text-white/90" aria-live="polite" aria-atomic="true">
          <span className="font-bold text-base md:text-lg">
            {slotAvailability.remaining}/{slotAvailability.total}
          </span>{' '}
          {t('pricing_banner.remaining')}
        </p>
      </div>

      {/* Expand indicator */}
      <motion.div
        className="text-white/70 text-xs md:text-sm"
        animate={shouldReduceMotion ? {} : { rotate: [0, 5, 0, -5, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        ›
      </motion.div>
    </motion.div>
  )

  // Render expanded view (full details)
  const renderExpanded = () => (
    <motion.div
      key="expanded"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="p-4 md:p-6 w-full md:w-96"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{currentTierConfig.badge.icon}</span>
          <div>
            <h3 className="text-sm font-bold text-white">{currentTierConfig.displayName}</h3>
            <p className="text-xs text-white/80">{t('pricing_banner.exclusive_early_access')}</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsExpanded(false)
          }}
          className="text-white/70 hover:text-white transition-colors text-lg leading-none"
          aria-label={t('pricing_banner.collapse_banner')}
        >
          ✕
        </button>
      </div>

      {/* Slot Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-white/90">{t('pricing_banner.availability')}</p>
          <p
            className="text-sm font-bold text-white"
            aria-live="polite"
            aria-atomic="true"
            aria-label={t('pricing_banner.slots_remaining_label', {
              remaining: slotAvailability.remaining,
              total: slotAvailability.total,
            })}
          >
            {t('pricing_banner.slots_remaining', {
              remaining: slotAvailability.remaining,
              total: slotAvailability.total,
            })}
          </p>
        </div>

        {/* Progress Bar */}
        <div
          className="rounded-full h-2 overflow-hidden"
          style={{ background: 'rgba(255, 255, 255, 0.1)' }}
        >
          <motion.div
            className={`h-full ${badgeColorClasses[currentTierConfig.badge.color]}`}
            initial={{ width: 0 }}
            animate={{ width: `${slotAvailability.percentFilled}%` }}
            transition={{ duration: shouldReduceMotion ? 0 : 1, ease: 'easeOut' }}
            role="progressbar"
            aria-valuenow={slotAvailability.percentFilled}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('pricing_banner.slots_claimed', {
              percent: slotAvailability.percentFilled.toFixed(0),
            })}
          />
        </div>
      </div>

      {/* Pricing */}
      <div
        className="mb-4 p-3 rounded-lg border border-white/10"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      >
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-xs text-white/80">{t('pricing_banner.investment')}</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-white">
              {formatPrice(currentTierConfig.price)}
            </span>
            <span className="text-xs text-white/70 ml-1">/month</span>
          </div>
        </div>
        <p className="text-xs text-white/70">
          {t('pricing_banner.rate_locked', { months: currentTierConfig.lockPeriodMonths })}
        </p>
        {currentTierConfig.freeMonths > 0 && (
          <p className="text-xs text-accent-primary font-semibold mt-1">
            {t('pricing_banner.free_months', {
              count: currentTierConfig.freeMonths,
            })}
          </p>
        )}
      </div>

      {/* Next Tier Info */}
      {nextTierConfig && (
        <div
          className="mb-4 p-3 rounded-lg border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/70 mb-1">{t('pricing_banner.next_tier')}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-white/80">{nextTierConfig.displayName}</span>
            <span className="text-sm font-bold text-white">
              {formatPrice(nextTierConfig.price)}/mo
            </span>
          </div>
        </div>
      )}

      {/* CTA */}
      <Button
        variant="primary"
        size="md"
        glow
        onClick={() => {
          // Track click analytics (temporarily disabled)
          // trackPricingBannerClick('Unknown', currentTier, slotAvailability.remaining);
          // Execute callback
          if (onCTAClick) {
            onCTAClick()
          }
        }}
        className="w-full"
      >
        Be Customer #{totalCustomers + 1}
      </Button>

      {/* First-come message */}
      <p className="text-xs text-white/60 text-center mt-3">
        First come, first served • Earlier customers = lower prices
      </p>
    </motion.div>
  )

  // Floating variant
  if (variant === 'floating') {
    return (
      <motion.div
        className={`fixed ${positionClasses[position]} z-50 ${position === 'bottom-center' ? 'w-full md:w-auto' : ''} ${className}`}
        initial={{ opacity: 0, scale: 0.8, y: position === 'bottom-center' ? 100 : -20 }}
        animate={
          isVisible
            ? { opacity: 1, scale: 1, y: 0 }
            : { opacity: 0, scale: 0.8, y: position === 'bottom-center' ? 100 : -20 }
        }
        transition={{ duration: shouldReduceMotion ? 0 : 0.5, ease: 'easeOut' }}
      >
        <GlassCard
          className={`${badgeColorClasses[currentTierConfig.badge.color]} border-2 border-white/20`}
          variant="strong"
          glow
        >
          {isExpanded ? renderExpanded() : renderCollapsed()}
        </GlassCard>
      </motion.div>
    )
  }

  // Inline variant
  return (
    <div className={`w-full ${className}`}>
      <GlassCard
        className={`${badgeColorClasses[currentTierConfig.badge.color]} border-2 border-white/20`}
        variant="strong"
        glow
      >
        {isExpanded ? renderExpanded() : renderCollapsed()}
      </GlassCard>
    </div>
  )
}

export default PricingAvailabilityBanner
