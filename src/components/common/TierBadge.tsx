import React from 'react'
import { motion } from 'framer-motion'
import { PricingTier, TIER_CONFIGS, TierConfig } from '../../types/pricing'

// ============================================================================
// Types
// ============================================================================

export interface TierBadgeProps {
  /** Which pricing tier to display */
  tier: PricingTier
  /** Variant: icon-only, with-text, or full (with price) */
  variant?: 'icon' | 'compact' | 'full'
  /** Size: small (inline), medium (default), large (prominent) */
  size?: 'sm' | 'md' | 'lg'
  /** Show glow effect on hover */
  glow?: boolean
  /** Show verified checkmark */
  showCheck?: boolean
  /** Additional CSS classes */
  className?: string
  /** Click handler */
  onClick?: () => void
}

// ============================================================================
// Component
// ============================================================================

/**
 * TierBadge - Display pricing tier badges throughout the UI
 *
 * Features:
 * - Multiple variants: icon-only, compact (icon + name), full (icon + name + price)
 * - Three sizes: sm (inline text), md (default), lg (prominent)
 * - Tier-specific colors (cyan/purple/green/gray matching demo theme)
 * - Optional glow effect
 * - ARIA accessible with proper labels
 *
 * Usage:
 * ```tsx
 * <TierBadge tier="founding" variant="compact" size="sm" />
 * <TierBadge tier="pioneer" variant="full" size="md" glow />
 * ```
 */
export const TierBadge: React.FC<TierBadgeProps> = ({
  tier,
  variant = 'compact',
  size = 'md',
  glow = false,
  showCheck = false,
  className = '',
  onClick,
}) => {
  const config: TierConfig = TIER_CONFIGS[tier]

  // Size classes
  const sizeClasses = {
    sm: {
      container: 'px-2 py-0.5 text-xs gap-1',
      icon: 'text-sm',
      text: 'text-xs',
      check: 'w-3 h-3',
    },
    md: {
      container: 'px-3 py-1 text-sm gap-1.5',
      icon: 'text-base',
      text: 'text-sm',
      check: 'w-4 h-4',
    },
    lg: {
      container: 'px-4 py-2 text-base gap-2',
      icon: 'text-xl',
      text: 'text-base',
      check: 'w-5 h-5',
    },
  }

  // Color classes based on badge.color - Using demo theme colors
  const colorClasses = {
    cyan: {
      bg: 'bg-gradient-to-r from-cyan-400 to-blue-500',
      border: 'border-cyan-400/30',
      glow: 'shadow-[0_0_20px_rgba(0,212,255,0.4)]',
    },
    purple: {
      bg: 'bg-gradient-to-r from-purple-400 to-purple-600',
      border: 'border-purple-400/30',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.4)]',
    },
    green: {
      bg: 'bg-gradient-to-r from-emerald-400 to-green-500',
      border: 'border-green-400/30',
      glow: 'shadow-[0_0_20px_rgba(0,255,136,0.4)]',
    },
    gray: {
      bg: 'bg-gradient-to-r from-gray-400 to-gray-600',
      border: 'border-gray-400/30',
      glow: 'shadow-[0_0_20px_rgba(107,114,128,0.3)]',
    },
  }

  const colors = colorClasses[config.badge.color]
  const sizes = sizeClasses[size]

  // Render icon-only variant
  if (variant === 'icon') {
    return (
      <motion.span
        className={`inline-flex items-center justify-center ${sizes.container} ${colors.bg} text-white rounded-full ${
          glow ? colors.glow : ''
        } ${onClick ? 'cursor-pointer' : ''} ${className}`}
        whileHover={onClick ? { scale: 1.1 } : {}}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={`${config.displayName} tier`}
      >
        <span className={sizes.icon}>{config.badge.icon}</span>
        {showCheck && (
          <span className="ml-1">
            <svg className={sizes.check} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </motion.span>
    )
  }

  // Render compact variant (icon + text)
  if (variant === 'compact') {
    return (
      <motion.span
        className={`inline-flex items-center ${sizes.container} ${colors.bg} text-white rounded-full font-semibold border ${
          colors.border
        } ${glow ? colors.glow : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        whileHover={onClick ? { scale: 1.05 } : {}}
        onClick={onClick}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        aria-label={`${config.displayName} tier`}
      >
        <span className={sizes.icon}>{config.badge.icon}</span>
        <span className={sizes.text}>{config.displayName}</span>
        {showCheck && (
          <span className="ml-1">
            <svg className={sizes.check} fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        )}
      </motion.span>
    )
  }

  // Render full variant (icon + text + price)
  return (
    <motion.span
      className={`inline-flex items-center ${sizes.container} ${colors.bg} text-white rounded-lg font-semibold border ${
        colors.border
      } ${glow ? colors.glow : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      whileHover={onClick ? { scale: 1.05 } : {}}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      aria-label={`${config.displayName} tier - ${config.currency}${config.price.toLocaleString('nl-NL')} per month`}
    >
      <span className={sizes.icon}>{config.badge.icon}</span>
      <span className="flex flex-col items-start leading-tight">
        <span className={sizes.text}>{config.displayName}</span>
        <span className="text-xs opacity-90">
          {config.currency}
          {config.price.toLocaleString('nl-NL')}/mo
        </span>
      </span>
      {showCheck && (
        <span className="ml-1">
          <svg className={sizes.check} fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </span>
      )}
    </motion.span>
  )
}

// ============================================================================
// Convenience Components for Each Tier
// ============================================================================

export const FoundingBadge: React.FC<Omit<TierBadgeProps, 'tier'>> = (props) => (
  <TierBadge tier="founding" {...props} />
)

export const PioneerBadge: React.FC<Omit<TierBadgeProps, 'tier'>> = (props) => (
  <TierBadge tier="pioneer" {...props} />
)

export const InnovatorBadge: React.FC<Omit<TierBadgeProps, 'tier'>> = (props) => (
  <TierBadge tier="innovator" {...props} />
)

export const StandardBadge: React.FC<Omit<TierBadgeProps, 'tier'>> = (props) => (
  <TierBadge tier="standard" {...props} />
)

export default TierBadge
