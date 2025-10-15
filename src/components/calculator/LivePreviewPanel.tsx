/**
 * LivePreviewPanel Component
 *
 * Real-time ROI preview that updates as users interact with the calculator wizard.
 * Shows key metrics with smooth animations and provides instant feedback.
 *
 * Features:
 * - Sticky positioning (right side desktop, below on mobile)
 * - Real-time metric updates with debouncing
 * - Smooth animations for value changes
 * - Accessible live regions for screen readers
 * - Responsive layout
 */

import React, { useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import GlassCard from '../common/GlassCard'
import { AnimatedMetric } from '../common/AnimatedMetric'
import { useDebounce, usePrefersReducedMotion, getReducedMotionTransition } from '../../hooks'
import { calculateROIMetrics } from '../../utils/calculations'

export interface LivePreviewPanelProps {
  /** Current wizard inputs for ROI calculation */
  inputs: {
    teamSize: number
    campaignsPerMonth: number
    avgSalary: number
    monthlyAdBudget?: number
    testingLevel?: number
  }
  /** Whether to show the panel */
  show?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * LivePreviewPanel - Real-time ROI metrics display
 *
 * Updates in real-time as users interact with the wizard,
 * providing instant feedback on potential ROI improvements.
 */
export const LivePreviewPanel: React.FC<LivePreviewPanelProps> = ({
  inputs,
  show = true,
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])
  const prefersReducedMotion = usePrefersReducedMotion()

  // Debounce inputs to prevent excessive recalculations (300ms)
  const debouncedInputs = useDebounce(inputs, 300)

  // Calculate ROI metrics efficiently with useMemo
  const metrics = useMemo(() => {
    if (!debouncedInputs.teamSize || !debouncedInputs.campaignsPerMonth) {
      return null
    }

    return calculateROIMetrics(debouncedInputs)
  }, [debouncedInputs])

  // Don't render if hidden or no valid metrics
  if (!show) {
    return null
  }

  return (
    <motion.div
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, x: 20 }}
      transition={getReducedMotionTransition(0.3, prefersReducedMotion)}
      className={`live-preview-panel ${className}`}
    >
      {/* Sticky container - right side on desktop, below on mobile */}
      <div className="lg:sticky lg:top-24 space-y-4">
        <GlassCard className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <motion.div
                className="w-2 h-2 rounded-full bg-accent-primary"
                animate={prefersReducedMotion ? {} : { scale: [1, 1.2, 1] }}
                transition={prefersReducedMotion ? {} : { duration: 2, repeat: Infinity }}
              />
              <h3 className="text-lg font-bold text-white">
                {t('calculator:live_preview.title', 'Live Preview')}
              </h3>
            </div>
            <p className="text-xs text-white/70">
              {t('calculator:live_preview.subtitle', 'Your potential ROI updates in real-time')}
            </p>
          </div>

          {/* Live region for screen readers */}
          <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
            {metrics && `ROI updated: ${Math.round(metrics.totalROI)}% return on investment`}
          </div>

          {/* Metrics Display */}
          <AnimatePresence mode="wait">
            {metrics ? (
              <motion.div
                key="metrics"
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: -10 }}
                transition={getReducedMotionTransition(0.2, prefersReducedMotion)}
                className="space-y-4"
              >
                {/* Hero Metric - ROI % */}
                <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-secondary/20 border border-accent-primary/30">
                  <div className="text-sm text-white/70 mb-1">
                    {t('calculator:live_preview.roi_label', 'Potential ROI')}
                  </div>
                  <AnimatedMetric
                    value={metrics.totalROI}
                    format="percentage"
                    color="primary"
                    size="lg"
                    className="text-4xl font-bold"
                  />
                </div>

                {/* Financial Impact */}
                <div className="space-y-2">
                  <AnimatedMetric
                    label={t('calculator:live_preview.labor_savings', 'Labor Cost Savings')}
                    value={metrics.laborCostSavings}
                    format="currency"
                    color="success"
                    size="sm"
                  />
                  <AnimatedMetric
                    label={t('calculator:live_preview.revenue_increase', 'Revenue Increase')}
                    value={metrics.revenueIncrease}
                    format="currency"
                    color="success"
                    size="sm"
                  />
                  <div className="h-px bg-white/10 my-2" />
                  <AnimatedMetric
                    label={t('calculator:live_preview.net_benefit', 'Net Benefit')}
                    value={metrics.netBenefit}
                    format="currency"
                    color="success"
                    size="md"
                    className="font-bold"
                  />
                </div>

                {/* Time & Productivity */}
                <div className="space-y-2 p-3 rounded-lg bg-white/5 border border-white/10">
                  <AnimatedMetric
                    label={t('calculator:live_preview.time_saved', 'Time Saved/Month')}
                    value={metrics.timeSaved}
                    format="number"
                    suffix="h"
                    color="secondary"
                    size="sm"
                  />
                  <AnimatedMetric
                    label={t('calculator:live_preview.productivity', 'Productivity Boost')}
                    value={metrics.productivityMultiplier}
                    format="number"
                    suffix="x"
                    color="primary"
                    size="sm"
                  />
                </div>

                {/* Break-even */}
                <div className="text-center p-3 rounded-lg bg-white/5 border border-white/10">
                  <div className="text-xs text-white/70 mb-1">
                    {t('calculator:live_preview.breakeven', 'Break-even')}
                  </div>
                  <div className="text-lg font-bold text-accent-secondary">
                    {metrics.breakEven < 1
                      ? t('calculator:live_preview.immediate', 'Immediate')
                      : `${Math.round(metrics.breakEven)} ${t('calculator:live_preview.months', 'months')}`}
                  </div>
                </div>

                {/* ROAS Metrics (if ad budget provided) */}
                {metrics.currentROAS && metrics.currentROAS > 0 && (
                  <motion.div
                    initial={
                      prefersReducedMotion
                        ? { opacity: 1, height: 'auto' }
                        : { opacity: 0, height: 0 }
                    }
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={getReducedMotionTransition(0.3, prefersReducedMotion)}
                    className="pt-4 border-t border-white/10"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">💎</span>
                      <h4 className="text-sm font-semibold text-white">
                        {t('calculator:live_preview.ad_efficiency', 'Ad Efficiency')}
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-3">
                      {/* Current ROAS */}
                      <div className="p-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-white/60 mb-1">
                          {t('calculator:live_preview.current_roas', 'Current ROAS')}
                        </div>
                        <div className="text-lg font-bold text-white">{metrics.currentROAS}:1</div>
                      </div>

                      {/* Potential ROAS */}
                      <div className="p-2 rounded-lg bg-gradient-to-br from-accent-success/20 to-accent-primary/20 border border-accent-success/30">
                        <div className="text-xs text-white/80 mb-1">
                          {t('calculator:live_preview.potential_roas', 'Potential')}
                        </div>
                        <div className="text-lg font-bold text-accent-success">
                          {metrics.potentialROAS}:1
                        </div>
                      </div>
                    </div>

                    {/* Wasted Spend */}
                    {metrics.wastedAdSpend && metrics.wastedAdSpend > 0 && (
                      <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <AnimatedMetric
                          label={t('calculator:live_preview.wasted_monthly', 'Wasted/Month')}
                          value={metrics.wastedAdSpend}
                          format="currency"
                          color="warning"
                          size="sm"
                        />
                      </div>
                    )}

                    {/* Ad Savings */}
                    {metrics.adSpendSavings && metrics.adSpendSavings > 0 && (
                      <div className="mt-2 p-3 rounded-lg bg-accent-success/10 border border-accent-success/30">
                        <AnimatedMetric
                          label={t(
                            'calculator:live_preview.potential_savings',
                            'Potential Savings'
                          )}
                          value={metrics.adSpendSavings}
                          format="currency"
                          color="success"
                          size="sm"
                        />
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Update indicator */}
                <div className="text-xs text-center text-white/50 mt-4">
                  {t('calculator:live_preview.updating', 'Updates as you type')}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8 text-white/50"
              >
                <div className="mb-2">📊</div>
                <p className="text-sm">
                  {t('calculator:live_preview.waiting', 'Fill in the form to see your ROI')}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>

        {/* Confidence indicator */}
        {metrics && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-center text-white/60"
          >
            💡{' '}
            {t('calculator:live_preview.confidence', 'Based on industry benchmarks & your inputs')}
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default LivePreviewPanel
