/**
 * ScenarioExplorer Component
 *
 * Interactive "what if" scenario exploration for ROI calculations.
 * Users can adjust key variables and see immediate impact on ROI metrics.
 *
 * Features:
 * - Interactive sliders for key variables (team size, campaigns, channels)
 * - Real-time ROI calculations with debouncing
 * - Before/After comparison display
 * - Responsive design with mobile support
 * - Accessible controls
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import GlassCard from '../common/GlassCard'
import InputSlider from './InputSlider'
import { AnimatedMetric } from '../common/AnimatedMetric'
import { useDebounce } from '../../hooks'
import { calculateROIMetrics } from '../../utils/calculations'

export interface ScenarioExplorerProps {
  /** Baseline inputs to compare against */
  baselineInputs: {
    teamSize: number
    campaignsPerMonth: number
    avgSalary: number
    monthlyAdBudget?: number
    testingLevel?: number
  }
  /** Baseline metrics calculated from inputs */
  baselineMetrics: {
    totalROI: number
    timeSaved: number
    laborCostSavings: number
    revenueIncrease: number
    currentROAS?: number
    wastedAdSpend?: number
  }
  /** Whether the explorer is visible */
  show?: boolean
  /** Additional CSS classes */
  className?: string
}

/**
 * ScenarioExplorer - Interactive ROI scenario exploration
 *
 * Allows users to explore "what if" scenarios by adjusting key variables
 * and seeing immediate impact on ROI calculations.
 */
export const ScenarioExplorer: React.FC<ScenarioExplorerProps> = ({
  baselineInputs,
  baselineMetrics,
  show = true,
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])

  // Scenario state (separate from main calculator inputs)
  const [scenarioInputs, setScenarioInputs] = useState({
    teamSize: baselineInputs.teamSize,
    campaignsPerMonth: baselineInputs.campaignsPerMonth,
    avgSalary: baselineInputs.avgSalary,
    monthlyAdBudget: baselineInputs.monthlyAdBudget || 0,
    testingLevel: baselineInputs.testingLevel || 0,
  })

  // Debounce scenario inputs for performance
  const debouncedScenarioInputs = useDebounce(scenarioInputs, 300)

  // Calculate scenario ROI metrics
  const scenarioMetrics = useMemo(() => {
    if (!debouncedScenarioInputs.teamSize || !debouncedScenarioInputs.campaignsPerMonth) {
      return null
    }

    return calculateROIMetrics({
      teamSize: debouncedScenarioInputs.teamSize,
      campaignsPerMonth: debouncedScenarioInputs.campaignsPerMonth,
      avgSalary: debouncedScenarioInputs.avgSalary,
      monthlyAdBudget: debouncedScenarioInputs.monthlyAdBudget,
      testingLevel: debouncedScenarioInputs.testingLevel,
    })
  }, [debouncedScenarioInputs])

  // Calculate differences from baseline
  const differences = useMemo(() => {
    if (!scenarioMetrics) {
      return null
    }

    const roasDiff =
      scenarioMetrics.currentROAS && baselineMetrics.currentROAS
        ? scenarioMetrics.currentROAS - baselineMetrics.currentROAS
        : 0

    const wastedSpendDiff =
      scenarioMetrics.wastedAdSpend && baselineMetrics.wastedAdSpend
        ? baselineMetrics.wastedAdSpend - scenarioMetrics.wastedAdSpend // Positive = improvement
        : 0

    return {
      roi: scenarioMetrics.totalROI - baselineMetrics.totalROI,
      timeSaved: scenarioMetrics.timeSaved - baselineMetrics.timeSaved,
      costSavings:
        scenarioMetrics.laborCostSavings +
        scenarioMetrics.revenueIncrease -
        (baselineMetrics.laborCostSavings + baselineMetrics.revenueIncrease),
      roas: roasDiff,
      wastedSpendSaved: wastedSpendDiff,
    }
  }, [scenarioMetrics, baselineMetrics])

  // Update scenario input
  const updateScenarioInput = (key: keyof typeof scenarioInputs, value: number) => {
    setScenarioInputs((prev) => ({ ...prev, [key]: value }))
  }

  // Reset to baseline
  const resetToBaseline = () => {
    setScenarioInputs({
      teamSize: baselineInputs.teamSize,
      campaignsPerMonth: baselineInputs.campaignsPerMonth,
      avgSalary: baselineInputs.avgSalary,
      monthlyAdBudget: baselineInputs.monthlyAdBudget || 0,
      testingLevel: baselineInputs.testingLevel || 0,
    })
  }

  // Check if scenario differs from baseline
  const hasChanges =
    scenarioInputs.teamSize !== baselineInputs.teamSize ||
    scenarioInputs.campaignsPerMonth !== baselineInputs.campaignsPerMonth ||
    scenarioInputs.avgSalary !== baselineInputs.avgSalary

  if (!show) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <GlassCard className="p-6 md:p-8">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2">
                🔬 {t('calculator:scenario.title', 'Explore "What If" Scenarios')}
              </h3>
              <p className="text-sm text-white/70 mt-1">
                {t(
                  'calculator:scenario.description',
                  'Adjust variables to see how different scenarios impact your ROI'
                )}
              </p>
            </div>

            {hasChanges && (
              <button
                onClick={resetToBaseline}
                className="px-4 py-2 text-sm rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/20"
                aria-label={t('calculator:scenario.reset', 'Reset to baseline')}
              >
                ↺ {t('calculator:scenario.reset_btn', 'Reset')}
              </button>
            )}
          </div>
        </div>

        {/* Interactive Sliders */}
        <div className="space-y-6 mb-8">
          {/* Team Size Slider */}
          <div>
            <InputSlider
              label={t('calculator:scenario.team_size', 'Team Size')}
              value={scenarioInputs.teamSize}
              min={1}
              max={50}
              step={1}
              onChange={(value) => updateScenarioInput('teamSize', value)}
              formatValue={(val) => `${val} ${val === 1 ? 'person' : 'people'}`}
            />
            {scenarioInputs.teamSize !== baselineInputs.teamSize && (
              <p className="text-xs text-accent-primary mt-1">
                {scenarioInputs.teamSize > baselineInputs.teamSize ? '↑' : '↓'}{' '}
                {Math.abs(scenarioInputs.teamSize - baselineInputs.teamSize)} from baseline
              </p>
            )}
          </div>

          {/* Campaigns Per Month Slider */}
          <div>
            <InputSlider
              label={t('calculator:scenario.campaigns', 'Campaigns Per Month')}
              value={scenarioInputs.campaignsPerMonth}
              min={1}
              max={100}
              step={1}
              onChange={(value) => updateScenarioInput('campaignsPerMonth', value)}
              formatValue={(val) => `${val} campaigns`}
            />
            {scenarioInputs.campaignsPerMonth !== baselineInputs.campaignsPerMonth && (
              <p className="text-xs text-accent-primary mt-1">
                {scenarioInputs.campaignsPerMonth > baselineInputs.campaignsPerMonth ? '↑' : '↓'}{' '}
                {Math.abs(scenarioInputs.campaignsPerMonth - baselineInputs.campaignsPerMonth)} from
                baseline
              </p>
            )}
          </div>

          {/* Average Salary Slider */}
          <div>
            <InputSlider
              label={t('calculator:scenario.avg_salary', 'Average Team Salary')}
              value={scenarioInputs.avgSalary}
              min={30000}
              max={200000}
              step={5000}
              onChange={(value) => updateScenarioInput('avgSalary', value)}
              formatValue={(val) => `€${(val / 1000).toFixed(0)}k`}
            />
            {scenarioInputs.avgSalary !== baselineInputs.avgSalary && (
              <p className="text-xs text-accent-primary mt-1">
                {scenarioInputs.avgSalary > baselineInputs.avgSalary ? '↑' : '↓'} €
                {Math.abs(scenarioInputs.avgSalary - baselineInputs.avgSalary).toLocaleString()}{' '}
                from baseline
              </p>
            )}
          </div>
        </div>

        {/* Scenario Results */}
        <AnimatePresence mode="wait">
          {scenarioMetrics && differences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Comparison Header */}
              <div className="mb-4 p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30">
                <h4 className="text-sm font-semibold text-white mb-2">
                  📊 {t('calculator:scenario.results_title', 'Scenario Results')}
                </h4>
                <p className="text-xs text-white/70">
                  {hasChanges
                    ? t(
                        'calculator:scenario.results_changed',
                        'See how your changes impact the ROI'
                      )
                    : t(
                        'calculator:scenario.results_same',
                        'Adjust sliders above to explore scenarios'
                      )}
                </p>
              </div>

              {/* Metrics Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* ROI */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/70 mb-2">ROI Impact</p>
                  <AnimatedMetric
                    label=""
                    value={scenarioMetrics.totalROI}
                    format="percentage"
                    color={differences.roi >= 0 ? 'success' : 'warning'}
                    size="sm"
                  />
                  {hasChanges && (
                    <p
                      className={`text-xs mt-2 ${differences.roi >= 0 ? 'text-green-400' : 'text-orange-400'}`}
                    >
                      {differences.roi >= 0 ? '↑' : '↓'} {Math.abs(differences.roi).toFixed(0)}% vs
                      baseline
                    </p>
                  )}
                </div>

                {/* Time Saved */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/70 mb-2">Time Saved Impact</p>
                  <AnimatedMetric
                    label=""
                    value={scenarioMetrics.timeSaved}
                    format="number"
                    suffix="h"
                    color={differences.timeSaved >= 0 ? 'success' : 'warning'}
                    size="sm"
                  />
                  {hasChanges && (
                    <p
                      className={`text-xs mt-2 ${differences.timeSaved >= 0 ? 'text-green-400' : 'text-orange-400'}`}
                    >
                      {differences.timeSaved >= 0 ? '↑' : '↓'}{' '}
                      {Math.abs(differences.timeSaved).toFixed(0)}h vs baseline
                    </p>
                  )}
                </div>

                {/* Cost Savings */}
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-white/70 mb-2">Total Benefit Impact</p>
                  <AnimatedMetric
                    label=""
                    value={scenarioMetrics.laborCostSavings + scenarioMetrics.revenueIncrease}
                    format="currency"
                    color={differences.costSavings >= 0 ? 'success' : 'warning'}
                    size="sm"
                  />
                  {hasChanges && (
                    <p
                      className={`text-xs mt-2 ${differences.costSavings >= 0 ? 'text-green-400' : 'text-orange-400'}`}
                    >
                      {differences.costSavings >= 0 ? '↑' : '↓'} €
                      {Math.abs(differences.costSavings).toLocaleString('nl-NL', {
                        maximumFractionDigits: 0,
                      })}{' '}
                      vs baseline
                    </p>
                  )}
                </div>
              </div>

              {/* Insight Message */}
              {hasChanges && differences && (
                <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20">
                  <p className="text-xs text-white/90">
                    💡{' '}
                    {differences.roi >= 0
                      ? t(
                          'calculator:scenario.insight.positive',
                          'This scenario shows an improved ROI! Consider scaling your team or campaign output.'
                        )
                      : t(
                          'calculator:scenario.insight.negative',
                          'This scenario shows reduced ROI. The current baseline may be more optimal for your situation.'
                        )}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </GlassCard>
    </motion.div>
  )
}

export default ScenarioExplorer
