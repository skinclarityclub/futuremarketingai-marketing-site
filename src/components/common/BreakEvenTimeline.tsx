import React from 'react'
import { motion } from 'framer-motion'

export interface BreakEvenTimelineProps {
  /** Break-even period in months */
  months: number
  /** Monthly benefit amount */
  monthlyBenefit: number
  /** Initial system cost */
  systemCost: number
}

/**
 * BreakEvenTimeline - Visual timeline showing break-even period
 *
 * Features:
 * - Animated progress bar
 * - Monthly milestone markers
 * - Cost recovery visualization
 * - Infinity handling for no break-even
 */
export const BreakEvenTimeline: React.FC<BreakEvenTimelineProps> = ({
  months,
  monthlyBenefit,
  systemCost,
}) => {
  const isInfinity = !isFinite(months) || months >= 999
  const displayMonths = Math.min(months, 24) // Cap display at 24 months
  const milestones = isInfinity ? [] : [3, 6, 12, 18, 24].filter((m) => m <= displayMonths + 3)

  // Calculate progress percentage (capped at 100%)
  const progressPercentage = isInfinity ? 0 : Math.min((12 / displayMonths) * 100, 100)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white/90 mb-1">Break-Even Timeline</h3>
          {!isInfinity && (
            <p className="text-xs text-white/80">
              Recover ${systemCost.toLocaleString()} in {months.toFixed(1)} months
            </p>
          )}
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold gradient-text">
            {isInfinity ? '∞' : months.toFixed(1)}
          </div>
          <div className="text-xs text-white/70">{isInfinity ? 'never' : 'months'}</div>
        </div>
      </div>

      {/* Timeline Visualization */}
      {!isInfinity && (
        <div className="relative pt-6 pb-2">
          {/* Timeline Bar */}
          <div className="relative w-full h-3 bg-bg-surface/30 rounded-full overflow-hidden">
            {/* Progress Fill */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-success rounded-full"
            />

            {/* Break-even Point Marker */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-accent-success rounded-full border-2 border-bg-dark shadow-glow-success"
              style={{
                left: `${Math.min((months / Math.max(displayMonths, months)) * 100, 95)}%`,
              }}
            />
          </div>

          {/* Milestone Markers */}
          <div className="relative w-full mt-2">
            {milestones.map((milestone, index) => {
              const position = (milestone / Math.max(displayMonths, 24)) * 100
              const isPassed = milestone <= months

              return (
                <motion.div
                  key={milestone}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                  className="absolute -translate-x-1/2"
                  style={{ left: `${Math.min(position, 95)}%` }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-2 h-2 rounded-full mb-1 ${
                        isPassed ? 'bg-accent-success shadow-glow-success' : 'bg-text-muted/30'
                      }`}
                    />
                    <span
                      className={`text-xs whitespace-nowrap ${
                        isPassed ? 'text-accent-success' : 'text-white/60'
                      }`}
                    >
                      {milestone}mo
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="text-center p-3 rounded-lg bg-bg-surface/20 backdrop-blur-sm">
          <div className="text-xs text-white/80 mb-1">Monthly Benefit</div>
          <div className="text-lg font-bold text-accent-success">
            ${monthlyBenefit.toLocaleString()}
          </div>
        </div>
        <div className="text-center p-3 rounded-lg bg-bg-surface/20 backdrop-blur-sm">
          <div className="text-xs text-white/80 mb-1">System Cost</div>
          <div className="text-lg font-bold text-accent-primary">
            ${systemCost.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Infinity Message */}
      {isInfinity && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="p-4 rounded-lg bg-accent-warning/10 border border-accent-warning/30"
        >
          <p className="text-sm text-white/90">
            With current inputs, the system cost exceeds the monthly benefit. Adjust your team size
            or campaign volume to see break-even projections.
          </p>
        </motion.div>
      )}
    </div>
  )
}

export default BreakEvenTimeline
