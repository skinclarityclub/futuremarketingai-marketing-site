/**
 * BenchmarkBar Component
 *
 * Visual comparison bar showing user's metrics vs industry average vs top performers.
 * Uses a 3-tier horizontal bar with clear visual hierarchy and color coding.
 *
 * Features:
 * - Responsive design (horizontal scroll on mobile)
 * - WCAG compliant color contrast
 * - Accessible ARIA labels
 * - Smooth animations
 * - Tooltips for additional context
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

export interface BenchmarkBarProps {
  /** User's current value */
  userValue: number
  /** Industry average value */
  industryAverage: number
  /** Top performer value (90th percentile) */
  topPerformer: number
  /** Label for the metric */
  label: string
  /** Format for display: 'currency', 'percentage', 'number' */
  format?: 'currency' | 'percentage' | 'number'
  /** Unit suffix (e.g., 'h', 'campaigns') */
  unit?: string
  /** Additional CSS classes */
  className?: string
}

/**
 * BenchmarkBar - 3-tier comparison visualization
 *
 * Displays user metrics compared to industry benchmarks with
 * clear visual hierarchy and accessibility support.
 */
export const BenchmarkBar: React.FC<BenchmarkBarProps> = ({
  userValue,
  industryAverage,
  topPerformer,
  label,
  format = 'number',
  unit = '',
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])

  // Format value based on type
  const formatValue = (value: number): string => {
    switch (format) {
      case 'currency':
        return `€${value.toLocaleString('nl-NL', { maximumFractionDigits: 0 })}`
      case 'percentage':
        return `${Math.round(value)}%`
      case 'number':
        return `${value.toLocaleString('nl-NL')}${unit ? ` ${unit}` : ''}`
      default:
        return String(value)
    }
  }

  // Calculate percentages for bar widths (relative to top performer)
  const maxValue = Math.max(userValue, industryAverage, topPerformer, 1)
  const userWidth = (userValue / maxValue) * 100
  const avgWidth = (industryAverage / maxValue) * 100
  const topWidth = (topPerformer / maxValue) * 100

  // Determine user's performance level
  const getUserPerformance = (): 'low' | 'average' | 'good' | 'excellent' => {
    if (userValue >= topPerformer * 0.9) {
      return 'excellent'
    }
    if (userValue >= industryAverage) {
      return 'good'
    }
    if (userValue >= industryAverage * 0.7) {
      return 'average'
    }
    return 'low'
  }

  const performance = getUserPerformance()

  // Color mapping for performance levels
  const performanceColors = {
    low: 'from-red-500 to-red-600',
    average: 'from-orange-500 to-orange-600',
    good: 'from-blue-500 to-blue-600',
    excellent: 'from-green-500 to-green-600',
  }

  return (
    <div className={`benchmark-bar ${className}`}>
      {/* Label */}
      <div className="mb-3">
        <h4 className="text-sm font-semibold text-white/90">{label}</h4>
      </div>

      {/* Benchmark Bars */}
      <div className="space-y-3" role="group" aria-label={`${label} benchmark comparison`}>
        {/* Top Performer Bar */}
        <div className="benchmark-tier">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/70">
              🏆 {t('calculator:benchmark.top_performer', 'Top 10%')}
            </span>
            <span className="text-xs font-semibold text-white/90">{formatValue(topPerformer)}</span>
          </div>
          <div className="h-8 bg-white/5 rounded-lg overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${topWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-green-500/40 to-green-600/40 flex items-center px-3"
              role="progressbar"
              aria-valuenow={topPerformer}
              aria-valuemin={0}
              aria-valuemax={maxValue}
              aria-label={`Top performer: ${formatValue(topPerformer)}`}
            >
              <span className="text-xs text-white/80">Top performers</span>
            </motion.div>
          </div>
        </div>

        {/* Industry Average Bar */}
        <div className="benchmark-tier">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/70">
              📊 {t('calculator:benchmark.industry_avg', 'Industry Average')}
            </span>
            <span className="text-xs font-semibold text-white/90">
              {formatValue(industryAverage)}
            </span>
          </div>
          <div className="h-8 bg-white/5 rounded-lg overflow-hidden border border-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${avgWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
              className="h-full bg-gradient-to-r from-blue-500/40 to-blue-600/40 flex items-center px-3"
              role="progressbar"
              aria-valuenow={industryAverage}
              aria-valuemin={0}
              aria-valuemax={maxValue}
              aria-label={`Industry average: ${formatValue(industryAverage)}`}
            >
              <span className="text-xs text-white/80">Average</span>
            </motion.div>
          </div>
        </div>

        {/* User's Performance Bar */}
        <div className="benchmark-tier">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-white">
              👤 {t('calculator:benchmark.your_result', 'Your Result')}
            </span>
            <span className="text-xs font-bold text-white">{formatValue(userValue)}</span>
          </div>
          <div className="h-10 bg-white/5 rounded-lg overflow-hidden border-2 border-accent-primary/50">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${userWidth}%` }}
              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
              className={`h-full bg-gradient-to-r ${performanceColors[performance]} flex items-center px-3`}
              role="progressbar"
              aria-valuenow={userValue}
              aria-valuemin={0}
              aria-valuemax={maxValue}
              aria-label={`Your result: ${formatValue(userValue)}`}
            >
              <span className="text-sm font-bold text-white">You</span>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Performance Indicator */}
      <div className="mt-3 flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            performance === 'excellent'
              ? 'bg-green-500'
              : performance === 'good'
                ? 'bg-blue-500'
                : performance === 'average'
                  ? 'bg-orange-500'
                  : 'bg-red-500'
          }`}
        />
        <span className="text-xs text-white/70">
          {performance === 'excellent' &&
            t('calculator:benchmark.performance.excellent', 'Outstanding performance!')}
          {performance === 'good' && t('calculator:benchmark.performance.good', 'Above average')}
          {performance === 'average' &&
            t('calculator:benchmark.performance.average', 'Room for improvement')}
          {performance === 'low' &&
            t('calculator:benchmark.performance.low', 'Significant opportunity')}
        </span>
      </div>
    </div>
  )
}

export default BenchmarkBar
