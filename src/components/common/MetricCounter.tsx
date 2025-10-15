import React, { useEffect } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'

/**
 * MetricCounter - Animated counter for displaying key metrics
 *
 * Features:
 * - Smooth number animation from 0 to target value
 * - Framer Motion spring physics
 * - JetBrains Mono font for monospaced numbers
 * - Support for different metric types and formats
 * - Customizable animation duration
 */

export interface MetricCounterProps {
  /** Final value to count to */
  value: number
  /** Label/description for the metric */
  label: string
  /** Optional prefix (e.g., "$", "+") */
  prefix?: string
  /** Optional suffix (e.g., "%", "h", "x") */
  suffix?: string
  /** Number of decimal places (default: 0) */
  decimals?: number
  /** Animation duration in seconds (default: 2) */
  duration?: number
  /** Delay before animation starts in seconds (default: 0) */
  delay?: number
  /** Gradient variant for text color */
  variant?: 'primary' | 'secondary' | 'success'
  /** Additional CSS classes */
  className?: string
}

export const MetricCounter: React.FC<MetricCounterProps> = ({
  value,
  label,
  prefix = '',
  suffix = '',
  decimals = 0,
  delay = 0,
  variant = 'primary',
  className = '',
}) => {
  // Motion value for the counter
  const motionValue = useMotionValue(0)

  // Spring animation configuration
  const spring = useSpring(motionValue, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.001,
  })

  // Transform the spring value to formatted display value
  const displayValue = useTransform(spring, (latest) => {
    return latest.toFixed(decimals)
  })

  // Start animation on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      motionValue.set(value)
    }, delay * 1000)

    return () => clearTimeout(timer)
  }, [value, delay, motionValue])

  // Determine gradient class based on variant
  const gradientClass = {
    primary: 'gradient-text',
    secondary: 'gradient-text-secondary',
    success: 'gradient-text-success',
  }[variant]

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  // If reduced motion, show final value immediately
  useEffect(() => {
    if (prefersReducedMotion) {
      motionValue.set(value)
    }
  }, [prefersReducedMotion, value, motionValue])

  return (
    <div className={`text-center ${className}`}>
      <div className={`text-5xl font-bold ${gradientClass} font-mono`}>
        <span>{prefix}</span>
        <motion.span>{prefersReducedMotion ? value.toFixed(decimals) : displayValue}</motion.span>
        <span>{suffix}</span>
      </div>
      <div className="text-sm text-white/90 mt-2">{label}</div>
    </div>
  )
}

export default MetricCounter
