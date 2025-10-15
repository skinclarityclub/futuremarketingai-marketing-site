import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { formatNumber, formatPercentage, type ROIMetrics } from '../../utils/calculations'

export interface ComparisonRow {
  metric: string
  before: {
    value: string
    subtext?: string
  }
  after: {
    value: string
    subtext?: string
  }
  difference: {
    value: string
    percentage?: string
  }
  visualBar?: {
    beforePercent: number // 0-100
    afterPercent: number // 0-100
  }
}

export interface ComparisonTableProps {
  metrics: ROIMetrics
  inputs: {
    teamSize: number
    avgSalary: number
    campaignsPerMonth: number
  }
  systemCost: number
}

/**
 * ComparisonTable - Visual before/after comparison with bars
 *
 * Shows "Without AI" vs "With FutureMarketingAI" comparison
 * with animated bars and clear metrics
 */
export const ComparisonTable: React.FC<ComparisonTableProps> = ({
  metrics,
  inputs,
  systemCost,
}) => {
  const { t } = useTranslation(['calculator'])

  const rows: ComparisonRow[] = [
    {
      metric: t('calculator:comparison_table.metrics.content_output.metric'),
      before: {
        value: `${inputs.campaignsPerMonth} ${t('calculator:comparison_table.metrics.content_output.unit_month')}`,
        subtext: t('calculator:comparison_table.metrics.content_output.before_subtext'),
      },
      after: {
        value: `${formatNumber(metrics.contentOutput)} ${t('calculator:comparison_table.metrics.content_output.unit_month')}`,
        subtext: t('calculator:comparison_table.metrics.content_output.after_subtext'),
      },
      difference: {
        value: `+${formatNumber(metrics.contentOutput - inputs.campaignsPerMonth)}`,
        percentage: formatPercentage((metrics.contentOutput / inputs.campaignsPerMonth - 1) * 100),
      },
      visualBar: {
        beforePercent: 25,
        afterPercent: 100,
      },
    },
    {
      metric: t('calculator:comparison_table.metrics.time_per_month.metric'),
      before: {
        value: `${formatNumber(inputs.teamSize * 60)} ${t('calculator:comparison_table.metrics.time_per_month.unit_hours')}`,
        subtext: t('calculator:comparison_table.metrics.time_per_month.before_subtext_template', {
          teamSize: inputs.teamSize,
        }),
      },
      after: {
        value: t('calculator:comparison_table.metrics.time_per_month.after_value'),
        subtext: t('calculator:comparison_table.metrics.time_per_month.after_subtext'),
      },
      difference: {
        value: `-${formatNumber(Math.round(metrics.timeSaved))}h${t('calculator:comparison_table.summary.per_month')}`,
        percentage: t('calculator:comparison_table.metrics.time_per_month.difference_percentage'),
      },
      visualBar: {
        beforePercent: 100,
        afterPercent: 11, // 40/360 ≈ 11%
      },
    },
    {
      metric: t('calculator:comparison_table.metrics.team_costs.metric'),
      before: {
        value: `€${formatNumber(Math.round((inputs.avgSalary / 12) * inputs.teamSize * 0.5))}`,
        subtext: t('calculator:comparison_table.metrics.team_costs.before_subtext_template', {
          teamSize: inputs.teamSize,
        }),
      },
      after: {
        value: `€${formatNumber(Math.round((inputs.avgSalary / 12) * 2))}`,
        subtext: t('calculator:comparison_table.metrics.team_costs.after_subtext'),
      },
      difference: {
        value: `-€${formatNumber(Math.round(metrics.laborCostSavings))}`,
        percentage: formatPercentage(
          (metrics.laborCostSavings / ((inputs.avgSalary / 12) * inputs.teamSize * 0.5)) * 100
        ),
      },
      visualBar: {
        beforePercent: 100,
        afterPercent: 33, // 2/6 ≈ 33%
      },
    },
    {
      metric: t('calculator:comparison_table.metrics.platform_costs.metric'),
      before: {
        value: t('calculator:comparison_table.metrics.platform_costs.before_value'),
        subtext: t('calculator:comparison_table.metrics.platform_costs.before_subtext'),
      },
      after: {
        value: `€${formatNumber(systemCost)}${t('calculator:comparison_table.summary.per_month')}`,
        subtext: t('calculator:comparison_table.metrics.platform_costs.after_subtext'),
      },
      difference: {
        value: `+€${formatNumber(systemCost)}`,
        percentage: t('calculator:comparison_table.metrics.platform_costs.difference_percentage'),
      },
      visualBar: {
        beforePercent: 0,
        afterPercent: 100,
      },
    },
    {
      metric: t('calculator:comparison_table.metrics.publishing_consistency.metric'),
      before: {
        value: t('calculator:comparison_table.metrics.publishing_consistency.before_value'),
        subtext: t('calculator:comparison_table.metrics.publishing_consistency.before_subtext'),
      },
      after: {
        value: t('calculator:comparison_table.metrics.publishing_consistency.after_value'),
        subtext: t('calculator:comparison_table.metrics.publishing_consistency.after_subtext'),
      },
      difference: {
        value: t('calculator:comparison_table.metrics.publishing_consistency.difference_value'),
        percentage: t(
          'calculator:comparison_table.metrics.publishing_consistency.difference_percentage'
        ),
      },
      visualBar: {
        beforePercent: 40,
        afterPercent: 100,
      },
    },
    {
      metric: t('calculator:comparison_table.metrics.ad_roi.metric'),
      before: {
        value: t('calculator:comparison_table.metrics.ad_roi.before_value'),
        subtext: t('calculator:comparison_table.metrics.ad_roi.before_subtext'),
      },
      after: {
        value: t('calculator:comparison_table.metrics.ad_roi.after_value'),
        subtext: t('calculator:comparison_table.metrics.ad_roi.after_subtext'),
      },
      difference: {
        value: t('calculator:comparison_table.metrics.ad_roi.difference_value'),
        percentage: t('calculator:comparison_table.metrics.ad_roi.difference_percentage'),
      },
      visualBar: {
        beforePercent: 20,
        afterPercent: 100,
      },
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          {t('calculator:comparison_table.header.title')}
        </h2>
        <p className="text-white/90">{t('calculator:comparison_table.header.subtitle')}</p>
      </div>

      {/* Comparison Rows */}
      <div className="space-y-4">
        {rows.map((row, index) => (
          <motion.div
            key={row.metric}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass-card p-6 hover-lift transition-all duration-300"
          >
            {/* Metric Name */}
            <h3 className="text-lg font-semibold text-text-primary mb-4">{row.metric}</h3>

            {/* Before/After Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Before */}
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <div className="text-xs font-semibold text-red-400 uppercase mb-2 flex items-center gap-2">
                  {t('calculator:comparison_table.labels.without_ai')}
                </div>
                <div className="text-xl font-bold text-text-primary mb-1">{row.before.value}</div>
                {row.before.subtext && (
                  <div className="text-xs text-white/70">{row.before.subtext}</div>
                )}
              </div>

              {/* After */}
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="text-xs font-semibold text-success uppercase mb-2 flex items-center gap-2">
                  {t('calculator:comparison_table.labels.with_ai')}
                </div>
                <div className="text-xl font-bold text-text-primary mb-1">{row.after.value}</div>
                {row.after.subtext && (
                  <div className="text-xs text-white/70">{row.after.subtext}</div>
                )}
              </div>

              {/* Difference */}
              <div className="p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30">
                <div className="text-xs font-semibold text-accent-primary uppercase mb-2">
                  {t('calculator:comparison_table.labels.difference')}
                </div>
                <div className="text-xl font-bold text-accent-primary mb-1">
                  {row.difference.value}
                </div>
                {row.difference.percentage && (
                  <div className="text-xs text-white/70">{row.difference.percentage}</div>
                )}
              </div>
            </div>

            {/* Visual Bar Comparison */}
            {row.visualBar && (
              <div className="space-y-2 mt-4">
                {/* Before Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-red-400 w-16 text-right">
                    {t('calculator:comparison_table.labels.before')}
                  </span>
                  <div className="flex-1 h-3 bg-bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.visualBar.beforePercent}%` }}
                      transition={{ delay: index * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-red-500 to-red-600"
                    />
                  </div>
                  <span className="text-xs text-white/70 w-12">{row.visualBar.beforePercent}%</span>
                </div>

                {/* After Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-success w-16 text-right">
                    {t('calculator:comparison_table.labels.after')}
                  </span>
                  <div className="flex-1 h-3 bg-bg-surface rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${row.visualBar.afterPercent}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-success to-accent-success shadow-glow-success"
                    />
                  </div>
                  <span className="text-xs text-white/70 w-12">{row.visualBar.afterPercent}%</span>
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Summary Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: rows.length * 0.1, duration: 0.6 }}
        className="p-6 rounded-xl bg-gradient-to-r from-success/20 via-success/10 to-success/20 border-2 border-success/40"
      >
        <div className="text-center">
          <div className="text-4xl font-black text-success mb-2">
            €{formatNumber(Math.round(metrics.netBenefit))}
            <span className="text-xl">{t('calculator:comparison_table.summary.per_month')}</span>
          </div>
          <div className="text-sm text-white/90 mb-3">
            💡{' '}
            <strong className="text-success">
              {t('calculator:comparison_table.summary.net_benefit')}
            </strong>{' '}
            {t('calculator:comparison_table.summary.after_all_costs')}
          </div>
          <div className="text-xs text-white/80">
            = Tijdbesparingen (€{formatNumber(Math.round(metrics.laborCostSavings))}) + Extra
            Revenue (€{formatNumber(Math.round(metrics.revenueIncrease))}) - Platform (€
            {formatNumber(systemCost)})
          </div>
          <div className="mt-4 pt-4 border-t border-success/30">
            <div className="text-2xl font-bold text-success">
              €{formatNumber(Math.round(metrics.netBenefit * 12))}{' '}
              {t('calculator:comparison_table.summary.per_year')}
            </div>
            <div className="text-xs text-white/80 mt-1">
              {t('calculator:comparison_table.summary.roi_label')}{' '}
              {formatPercentage(metrics.totalROI)}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ComparisonTable
