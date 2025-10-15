import React, { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  PricingTier,
  TIER_CONFIGS,
  calculateSlotAvailability,
  SlotAvailability,
} from '../../types/pricing'
import { TierBadge } from './TierBadge'

// ============================================================================
// Types
// ============================================================================

export interface SlotProgressIndicatorProps {
  /** Which pricing tier to display */
  tier: PricingTier
  /** Current total number of customers (for calculating availability) */
  totalCustomers: number
  /** Variant: minimal (just bar), compact (bar + text), full (badge + bar + text) */
  variant?: 'minimal' | 'compact' | 'full'
  /** Show tier badge */
  showBadge?: boolean
  /** Show numeric count (X/Y remaining) */
  showCount?: boolean
  /** Show percentage label */
  showPercentage?: boolean
  /** Size: small, medium, large */
  size?: 'sm' | 'md' | 'lg'
  /** Show glow effect on progress bar */
  glow?: boolean
  /** Additional CSS classes */
  className?: string
  /** Show animated pulse when slots are low */
  pulseWhenLow?: boolean
  /** Threshold for "low" slots (default: 2) */
  lowThreshold?: number
}

// ============================================================================
// Component
// ============================================================================

/**
 * SlotProgressIndicator - Visual progress bar for slot availability
 *
 * Features:
 * - Animated progress bar with tier-specific colors
 * - Multiple variants: minimal (bar only), compact (bar + text), full (badge + bar + text)
 * - Three sizes: sm, md, lg
 * - Optional glow effect
 * - Pulse animation when slots are low
 * - ARIA accessible with progress bar role
 * - Screen reader support with live regions
 * - Respects prefers-reduced-motion
 *
 * Usage:
 * ```tsx
 * <SlotProgressIndicator tier="founding" totalCustomers={3} variant="compact" />
 * <SlotProgressIndicator tier="pioneer" totalCustomers={8} variant="full" showBadge />
 * ```
 */
export const SlotProgressIndicator: React.FC<SlotProgressIndicatorProps> = ({
  tier,
  totalCustomers,
  variant = 'compact',
  showBadge = false,
  showCount = true,
  showPercentage = false,
  size = 'md',
  glow = false,
  className = '',
  pulseWhenLow = true,
  lowThreshold = 2,
}) => {
  const { t } = useTranslation('common')
  const shouldReduceMotion = useReducedMotion()
  const config = TIER_CONFIGS[tier]
  const availability: SlotAvailability = useMemo(
    () => calculateSlotAvailability(tier, totalCustomers),
    [tier, totalCustomers]
  )

  const isLow = availability.remaining <= lowThreshold

  // Size classes
  const sizeClasses = {
    sm: {
      bar: 'h-1.5',
      text: 'text-xs',
      gap: 'gap-1.5',
      badge: 'sm' as const,
    },
    md: {
      bar: 'h-2',
      text: 'text-sm',
      gap: 'gap-2',
      badge: 'md' as const,
    },
    lg: {
      bar: 'h-3',
      text: 'text-base',
      gap: 'gap-3',
      badge: 'lg' as const,
    },
  }

  // Color classes - Using demo theme colors
  const colorClasses = {
    cyan: {
      bg: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      glow: 'shadow-[0_0_15px_rgba(0,212,255,0.5)]',
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-400 to-purple-600',
      glow: 'shadow-[0_0_15px_rgba(168,85,247,0.5)]',
    },
    green: {
      bg: 'bg-gradient-to-r from-emerald-400 to-green-500',
      glow: 'shadow-[0_0_15px_rgba(0,255,136,0.5)]',
    },
    gray: {
      bg: 'bg-gradient-to-r from-gray-400 to-gray-600',
      glow: 'shadow-[0_0_15px_rgba(107,114,128,0.4)]',
    },
  }

  const sizes = sizeClasses[size]
  const colors = colorClasses[config.badge.color]

  // Render minimal variant (bar only)
  if (variant === 'minimal') {
    return (
      <div className={`w-full ${className}`}>
        <div className={`rounded-full ${sizes.bar} overflow-hidden`}>
          <motion.div
            className={`h-full ${colors.bg} ${glow ? colors.glow : ''}`}
            initial={{ width: 0 }}
            animate={
              isLow && pulseWhenLow && !shouldReduceMotion
                ? {
                    width: `${availability.percentFilled}%`,
                    opacity: [1, 0.7, 1],
                  }
                : { width: `${availability.percentFilled}%` }
            }
            transition={
              isLow && pulseWhenLow && !shouldReduceMotion
                ? {
                    width: { duration: 1, ease: 'easeOut' },
                    opacity: { duration: 1.5, repeat: Infinity },
                  }
                : { duration: shouldReduceMotion ? 0 : 1, ease: 'easeOut' }
            }
            role="progressbar"
            aria-valuenow={availability.percentFilled}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={t('slot_progress.slots_remaining_label', {
              remaining: availability.remaining,
              total: availability.total,
              tier: config.displayName,
            })}
          />
        </div>
      </div>
    )
  }

  // Render compact variant (bar + text)
  if (variant === 'compact') {
    return (
      <div className={`w-full ${sizes.gap} flex flex-col ${className}`}>
        {/* Header with count */}
        {(showCount || showPercentage) && (
          <div className="flex items-center justify-between mb-1">
            {showCount && (
              <p
                className={`${sizes.text} text-white/90 font-medium`}
                aria-live="polite"
                aria-atomic="true"
              >
                {t('slot_progress.count_remaining', {
                  remaining: availability.remaining,
                  total: availability.total,
                })}
              </p>
            )}
            {showPercentage && (
              <p className={`${sizes.text} text-white/70`}>
                {availability.percentFilled.toFixed(0)}% claimed
              </p>
            )}
          </div>
        )}

        {/* Progress Bar */}
        <div className={`rounded-full ${sizes.bar} overflow-hidden`}>
          <motion.div
            className={`h-full ${colors.bg} ${glow ? colors.glow : ''}`}
            initial={{ width: 0 }}
            animate={
              isLow && pulseWhenLow && !shouldReduceMotion
                ? {
                    width: `${availability.percentFilled}%`,
                    opacity: [1, 0.7, 1],
                  }
                : { width: `${availability.percentFilled}%` }
            }
            transition={
              isLow && pulseWhenLow && !shouldReduceMotion
                ? {
                    width: { duration: 1, ease: 'easeOut' },
                    opacity: { duration: 1.5, repeat: Infinity },
                  }
                : { duration: shouldReduceMotion ? 0 : 1, ease: 'easeOut' }
            }
            role="progressbar"
            aria-valuenow={availability.percentFilled}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${availability.percentFilled.toFixed(0)}% of ${config.displayName} slots claimed`}
          />
        </div>

        {/* Low availability warning */}
        {isLow && availability.remaining > 0 && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${sizes.text} text-accent-warning font-semibold mt-1`}
          >
            {t('slot_progress.only_slots_left', { count: availability.remaining })}
          </motion.p>
        )}
      </div>
    )
  }

  // Render full variant (badge + bar + text)
  return (
    <div className={`w-full ${sizes.gap} flex flex-col ${className}`}>
      {/* Tier Badge */}
      {showBadge && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-2"
        >
          <TierBadge tier={tier} variant="compact" size={sizes.badge} glow />
        </motion.div>
      )}

      {/* Header with count */}
      <div className="flex items-center justify-between mb-1">
        <p className={`${sizes.text} text-white/80 font-medium`}>
          {t('pricing_banner.availability')}
        </p>
        <p
          className={`${sizes.text} text-white font-semibold`}
          aria-live="polite"
          aria-atomic="true"
          aria-label={t('slot_progress.slots_remaining_aria', {
            remaining: availability.remaining,
            total: availability.total,
          })}
        >
          {t('slot_progress.count_remaining', {
            remaining: availability.remaining,
            total: availability.total,
          })}
        </p>
      </div>

      {/* Progress Bar */}
      <div className={`rounded-full ${sizes.bar} overflow-hidden`}>
        <motion.div
          className={`h-full ${colors.bg} ${glow ? colors.glow : ''}`}
          initial={{ width: 0 }}
          animate={
            isLow && pulseWhenLow && !shouldReduceMotion
              ? {
                  width: `${availability.percentFilled}%`,
                  opacity: [1, 0.7, 1],
                }
              : { width: `${availability.percentFilled}%` }
          }
          transition={
            isLow && pulseWhenLow && !shouldReduceMotion
              ? {
                  width: { duration: 1, ease: 'easeOut' },
                  opacity: { duration: 1.5, repeat: Infinity },
                }
              : { duration: shouldReduceMotion ? 0 : 1, ease: 'easeOut' }
          }
          role="progressbar"
          aria-valuenow={availability.percentFilled}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${availability.percentFilled.toFixed(0)}% of ${config.displayName} slots claimed`}
        />
      </div>

      {/* Low availability warning */}
      {isLow && availability.remaining > 0 && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${sizes.text} text-accent-warning font-semibold mt-1.5 flex items-center gap-1`}
        >
          <span className="animate-pulse">⚠️</span>
          {t('slot_progress.slots_left_at_price', {
            count: availability.remaining,
            currency: `${config.currency}${config.price.toLocaleString('nl-NL')}/mo`,
          })}
        </motion.p>
      )}

      {/* Percentage indicator */}
      {showPercentage && (
        <p className={`${sizes.text} text-white/60 text-center mt-1`}>
          {availability.percentFilled.toFixed(0)}% claimed
        </p>
      )}
    </div>
  )
}

export default SlotProgressIndicator
