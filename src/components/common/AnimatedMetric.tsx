import React from 'react'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks'

export interface AnimatedMetricProps {
  /** Label for the metric */
  label?: string
  /** Current/after value */
  value: number
  /** Before value (for comparison) */
  beforeValue?: number
  /** Display format: 'currency', 'percentage', 'number', 'ratio' */
  format?: 'currency' | 'percentage' | 'number' | 'ratio'
  /** Color variant (alias for color) */
  variant?: 'primary' | 'secondary' | 'success' | 'warning'
  /** Color variant */
  color?: 'primary' | 'secondary' | 'success' | 'warning'
  /** Show before/after bars */
  showComparison?: boolean
  /** Prefix for the value */
  prefix?: string
  /** Additional suffix (e.g., 'h', 'campaigns') */
  suffix?: string
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Animation duration in seconds */
  duration?: number
  /** Animation delay in seconds */
  delay?: number
  /** Additional CSS classes */
  className?: string
}

/**
 * AnimatedMetric - Displays an animated metric with optional before/after comparison
 *
 * Features:
 * - Smooth number animations with Framer Motion
 * - Before/after comparison bars
 * - Multiple format options
 * - Color coding based on value
 * - Responsive sizing
 */
export const AnimatedMetric: React.FC<AnimatedMetricProps> = ({
  label,
  value,
  beforeValue,
  format = 'number',
  variant,
  color = 'primary',
  showComparison = false,
  prefix = '',
  suffix = '',
  size = 'md',
  duration = 2,
  delay = 0,
  className = '',
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  // Use variant as alias for color if provided
  const effectiveColor = variant || color
  // Format the value based on type
  const formatValue = (val: number): string => {
    if (!isFinite(val)) {
      return format === 'currency' ? '$0' : '0'
    }

    switch (format) {
      case 'currency':
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(val)

      case 'percentage':
        return `${Math.round(val)}%`

      case 'ratio':
        return `${val.toFixed(1)}:1`

      case 'number':
      default:
        return new Intl.NumberFormat('en-US').format(Math.round(val))
    }
  }

  // Determine color class based on color prop
  const getColorClass = () => {
    switch (effectiveColor) {
      case 'success':
        return 'gradient-text-success'
      case 'secondary':
        return 'gradient-text-secondary'
      case 'warning':
        return 'gradient-text-warning'
      case 'primary':
      default:
        return 'gradient-text'
    }
  }

  // Size classes
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  }

  // Calculate improvement percentage
  const improvement =
    beforeValue && beforeValue !== 0 ? ((value - beforeValue) / beforeValue) * 100 : 0

  // Bar widths for comparison
  const maxValue = Math.max(value, beforeValue || 0)
  const beforeBarWidth = beforeValue && maxValue > 0 ? (beforeValue / maxValue) * 100 : 0
  const afterBarWidth = maxValue > 0 ? (value / maxValue) * 100 : 0

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Label */}
      {label && <h3 className="text-sm font-semibold text-white/90">{label}</h3>}

      {/* Animated Value */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: prefersReducedMotion ? 0 : duration * 0.5,
          delay: prefersReducedMotion ? 0 : delay,
        }}
        className={`${sizeClasses[size]} font-bold ${getColorClass()}`}
      >
        <motion.span
          key={value}
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: prefersReducedMotion ? 0 : duration * 0.3,
            delay: prefersReducedMotion ? 0 : delay,
          }}
        >
          {prefix && <span className="text-white/70 mr-1">{prefix}</span>}
          {formatValue(value)}
          {suffix && <span className="text-white/70 ml-1">{suffix}</span>}
        </motion.span>
      </motion.div>

      {/* Before/After Comparison Bars */}
      {showComparison && beforeValue !== undefined && (
        <div className="space-y-2">
          {/* Before Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/80">Before</span>
              <span className="text-xs text-white/90">{formatValue(beforeValue)}</span>
            </div>
            <div className="w-full h-2 bg-bg-surface/30 rounded-full overflow-hidden">
              <motion.div
                initial={prefersReducedMotion ? { width: `${beforeBarWidth}%` } : { width: 0 }}
                animate={{ width: `${beforeBarWidth}%` }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: 'easeOut' }}
                className="h-full bg-white/30 rounded-full"
              />
            </div>
          </div>

          {/* After Bar */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/80">After</span>
              <span className="text-xs text-white/90">{formatValue(value)}</span>
            </div>
            <div className="w-full h-2 bg-bg-surface/30 rounded-full overflow-hidden">
              <motion.div
                initial={prefersReducedMotion ? { width: `${afterBarWidth}%` } : { width: 0 }}
                animate={{ width: `${afterBarWidth}%` }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.8,
                  ease: 'easeOut',
                  delay: prefersReducedMotion ? 0 : 0.2,
                }}
                className={`h-full rounded-full ${
                  color === 'success'
                    ? 'bg-accent-success'
                    : color === 'secondary'
                      ? 'bg-accent-secondary'
                      : 'bg-accent-primary'
                }`}
              />
            </div>
          </div>

          {/* Improvement Indicator */}
          {improvement !== 0 && (
            <motion.div
              initial={prefersReducedMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: prefersReducedMotion ? 0 : 0.3,
                delay: prefersReducedMotion ? 0 : 0.5,
              }}
              className={`text-xs font-semibold ${
                improvement > 0 ? 'text-accent-success' : 'text-accent-warning'
              }`}
            >
              {improvement > 0 ? '↑' : '↓'} {Math.abs(improvement).toFixed(0)}%
              {improvement > 0 ? ' increase' : ' decrease'}
            </motion.div>
          )}
        </div>
      )}
    </div>
  )
}

export default AnimatedMetric
