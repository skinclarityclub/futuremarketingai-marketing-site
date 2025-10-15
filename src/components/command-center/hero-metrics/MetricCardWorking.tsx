/**
 * MetricCard - Working Version with Icons
 */

import React, { useEffect } from 'react'
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion'
import {
  FaArrowUp,
  FaArrowDown,
  FaBullseye,
  FaUsers,
  FaRocket,
  FaDollarSign,
  FaChartLine,
} from 'react-icons/fa'
import type { HeroMetric } from '../../../types/dashboard'

const ICON_MAP = {
  rocket: FaRocket,
  users: FaUsers,
  target: FaBullseye,
  dollar: FaDollarSign,
  activity: FaChartLine,
}

export interface MetricCardWorkingProps {
  metric: HeroMetric
  delay?: number
  onClick?: () => void
}

export const MetricCardWorking: React.FC<MetricCardWorkingProps> = ({
  metric,
  delay = 0,
  onClick,
}) => {
  // Get icon component
  const iconKey = (metric?.icon || 'activity') as keyof typeof ICON_MAP
  const IconComponent = ICON_MAP[iconKey] || FaChartLine

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
  useEffect(() => {
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
          gradient: 'from-success/20 to-success/5',
        }
      case 'secondary':
        return {
          text: 'text-accent-secondary',
          gradient: 'from-accent-secondary/20 to-accent-secondary/5',
        }
      case 'gradient':
        return {
          text: 'text-accent-primary',
          gradient: 'from-accent-primary/20 to-accent-secondary/20',
        }
      default:
        return {
          text: 'text-accent-primary',
          gradient: 'from-accent-primary/20 to-accent-primary/5',
        }
    }
  }

  const colors = getColorClasses()
  const TrendIcon = metric.trend.direction === 'up' ? FaArrowUp : FaArrowDown
  const trendColor = metric.trend.direction === 'up' ? 'text-success' : 'text-error'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-xl p-6
        bg-gradient-to-br ${colors.gradient}
        border border-white/10 backdrop-blur-md
        hover:border-white/20 transition-all duration-300
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      {/* Header with icon and trend */}
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${colors.gradient}`}>
          <IconComponent className={`w-6 h-6 ${colors.text}`} />
        </div>

        {/* Trend indicator */}
        <div className={`flex items-center gap-1 text-sm font-medium ${trendColor}`}>
          <TrendIcon className="w-4 h-4" />
          <span>{metric.trend.value}%</span>
        </div>
      </div>

      {/* Value - Animated Counter */}
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
    </motion.div>
  )
}
