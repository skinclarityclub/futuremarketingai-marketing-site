/**
 * MetricCard Component
 *
 * Displays a key performance indicator with:
 * - Animated counter value
 * - Trend indicator (up/down with percentage and period)
 * - Optional visualizations (sparkline, progress ring, compare bar)
 * - Interactive hover effects (lift + glow)
 * - Click handler to open detailed modal
 */

import React, { useState } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'
import {
  FaArrowUp as TrendingUp,
  FaArrowDown as TrendingDown,
  FaBullseye as Target,
  FaUsers as Users,
  FaRocket as Rocket,
  FaDollarSign as DollarSign,
  FaChartLine as Activity,
} from 'react-icons/fa'
import type { HeroMetric } from '../../../types/dashboard'

export interface MetricCardProps {
  metric: HeroMetric
  onClick?: () => void
  /** Optional sparkline data for mini chart */
  sparklineData?: number[]
  /** Show progress ring instead of sparkline */
  progressRing?: boolean
  /** Show before/after comparison bar */
  compareBar?: { previous: number; current: number }
  /** Animation delay for staggered entrance */
  delay?: number
}

const ICON_MAP = {
  rocket: Rocket,
  users: Users,
  target: Target,
  dollar: DollarSign,
  activity: Activity,
}

export const MetricCard: React.FC<MetricCardProps> = ({
  metric,
  onClick,
  sparklineData,
  progressRing = false,
  compareBar,
  delay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false)

  // Animated counter setup
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, {
    stiffness: 50,
    damping: 30,
    restDelta: 0.001,
  })

  const displayValue = useTransform(spring, (latest) => {
    // Format based on value size
    if (metric.suffix === '%') {
      return latest.toFixed(1)
    } else if (metric.suffix === 'M') {
      return latest.toFixed(1)
    } else if (metric.prefix === '€') {
      return Math.round(latest).toLocaleString('nl-NL')
    }
    return Math.round(latest).toString()
  })

  // Start animation on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      motionValue.set(metric.value)
    }, delay * 100)

    return () => clearTimeout(timer)
  }, [metric.value, delay, motionValue])

  // Color mapping
  const getColorClasses = () => {
    switch (metric.color) {
      case 'success':
        return {
          text: 'text-success',
          glow: 'shadow-glow-green',
          gradient: 'from-success/20 to-success/5',
        }
      case 'secondary':
        return {
          text: 'text-accent-secondary',
          glow: 'shadow-glow-purple',
          gradient: 'from-accent-secondary/20 to-accent-secondary/5',
        }
      case 'gradient':
        return {
          text: 'bg-gradient-primary bg-clip-text text-transparent',
          glow: 'shadow-glow',
          gradient: 'from-accent-primary/20 to-accent-secondary/20',
        }
      default: // primary
        return {
          text: 'text-accent-primary',
          glow: 'shadow-glow',
          gradient: 'from-accent-primary/20 to-accent-primary/5',
        }
    }
  }

  const colors = getColorClasses()

  // Get icon component - ensure it's always defined
  const iconKey = (metric?.icon || 'activity') as keyof typeof ICON_MAP
  const IconComponent = ICON_MAP[iconKey] || Activity

  // Calculate progress percentage for ring
  const progressPercentage = progressRing ? (metric.value / 100) * 100 : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl p-6
        bg-gradient-to-br ${colors.gradient}
        border border-white/10 backdrop-blur-md
        transition-all duration-300 cursor-pointer
        ${isHovered ? colors.glow : ''}
      `}
    >
      {/* Background gradient overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.gradient}`}>
            <IconComponent className={`w-6 h-6 ${colors.text}`} />
          </div>

          {/* Trend indicator */}
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              metric.trend.direction === 'up' ? 'text-success' : 'text-error'
            }`}
          >
            {metric.trend.direction === 'up' ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{metric.trend.value}%</span>
          </div>
        </div>

        {/* Value */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1">
            {metric.prefix && (
              <span className={`text-2xl font-bold ${colors.text}`}>{metric.prefix}</span>
            )}
            <motion.span className={`text-4xl font-bold font-mono ${colors.text}`}>
              {displayValue}
            </motion.span>
            {metric.suffix && (
              <span className={`text-2xl font-bold ${colors.text}`}>{metric.suffix}</span>
            )}
          </div>
        </div>

        {/* Label */}
        <p className="text-sm text-white/70 mb-3">{metric.label}</p>

        {/* Trend period */}
        <p className="text-xs text-white/50">{metric.trend.period}</p>

        {/* Optional visualizations */}
        {sparklineData && sparklineData.length > 0 && (
          <div className="mt-4">
            <Sparkline data={sparklineData} color={colors.text} />
          </div>
        )}

        {progressRing && (
          <div className="mt-4 flex items-center gap-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  className="stroke-white/10"
                  strokeWidth="4"
                  fill="none"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="24"
                  cy="24"
                  r="20"
                  className={`stroke-current ${colors.text}`}
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ strokeDasharray: '0 126' }}
                  animate={{
                    strokeDasharray: `${(progressPercentage / 100) * 126} 126`,
                  }}
                  transition={{ duration: 1, delay: delay * 0.1 + 0.3 }}
                />
              </svg>
            </div>
            <span className="text-xs text-white/60">Target Progress</span>
          </div>
        )}

        {compareBar && (
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/50">Previous</span>
              <span className="text-white/70 font-mono">
                {metric.prefix}
                {compareBar.previous.toLocaleString('nl-NL')}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-white/30 to-white/50 rounded-full"
                initial={{ width: 0 }}
                animate={{
                  width: `${(compareBar.previous / compareBar.current) * 100}%`,
                }}
                transition={{ duration: 1, delay: delay * 0.1 + 0.2 }}
              />
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">Current</span>
              <span className={`font-mono font-bold ${colors.text}`}>
                {metric.prefix}
                {compareBar.current.toLocaleString('nl-NL')}
              </span>
            </div>
            <div className="h-2 rounded-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 1, delay: delay * 0.1 + 0.3 }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Hover indicator */}
      <motion.div
        className="absolute bottom-2 right-2 text-white/30 text-xs"
        animate={{ opacity: isHovered ? 1 : 0 }}
      >
        Click for details →
      </motion.div>
    </motion.div>
  )
}

/**
 * Sparkline Component - Mini line chart
 */
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  // Generate SVG path
  const points = data.map((value, i) => {
    const x = (i / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  })

  const pathD = `M ${points.join(' L ')}`

  return (
    <svg viewBox="0 0 100 30" className="w-full h-8" preserveAspectRatio="none">
      <motion.path
        d={pathD}
        fill="none"
        className={`${color} opacity-60`}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />
    </svg>
  )
}
