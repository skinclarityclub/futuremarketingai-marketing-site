/**
 * CompetitivePositionCard Component
 *
 * Encapsulates the competitive benchmarking section with clear positioning messages
 * and actionable insights. Creates urgency and social proof by showing where the
 * user stands relative to their industry.
 *
 * Features:
 * - Clear positioning messages ("bottom 25%", "outperforming 75%", etc.)
 * - Multiple benchmark visualizations (BenchmarkBar)
 * - Actionable insights based on performance
 * - Responsive GlassCard container
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import GlassCard from '../common/GlassCard'
import BenchmarkBar from './BenchmarkBar'

export interface CompetitivePositionCardProps {
  /** User's ROI metrics */
  userMetrics: {
    roi: number
    timeSaved: number
    costSavings: number
    currentROAS?: number
  }
  /** Industry benchmark data */
  benchmarks: {
    avgROI: number
    topROI: number
    avgTimeSaved: number
    topTimeSaved: number
    avgCostSavings: number
    topCostSavings: number
    avgROAS?: number
    topROAS?: number
  }
  /** Additional CSS classes */
  className?: string
}

/**
 * CompetitivePositionCard - Competitive benchmarking visualization
 *
 * Shows user's position relative to industry averages and top performers,
 * providing urgency and social proof.
 */
export const CompetitivePositionCard: React.FC<CompetitivePositionCardProps> = ({
  userMetrics,
  benchmarks,
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])

  // Calculate overall percentile (based on ROI)
  const calculatePercentile = (): number => {
    const { roi } = userMetrics
    const { avgROI, topROI } = benchmarks

    if (roi >= topROI) {
      return 90
    }
    if (roi >= avgROI) {
      // Linear interpolation between average (50th) and top (90th)
      const progress = (roi - avgROI) / (topROI - avgROI)
      return 50 + progress * 40
    }
    // Below average
    const progress = roi / avgROI
    return progress * 50
  }

  const percentile = Math.round(calculatePercentile())

  // Determine performance tier
  const getPerformanceTier = (): {
    tier: 'bottom' | 'average' | 'good' | 'top'
    message: string
    color: string
    emoji: string
    insight: string
  } => {
    if (percentile >= 90) {
      return {
        tier: 'top',
        message: t('calculator:competitive.tier.top.message', `You're in the top 10%!`),
        color: 'text-green-400',
        emoji: '🏆',
        insight: t(
          'calculator:competitive.tier.top.insight',
          `Outstanding! You're already performing better than 90% of similar companies. Focus on maintaining this excellence.`
        ),
      }
    }
    if (percentile >= 75) {
      return {
        tier: 'good',
        message: t(
          'calculator:competitive.tier.good.message',
          `You're outperforming ${percentile}% of your peers`
        ),
        color: 'text-blue-400',
        emoji: '📈',
        insight: t(
          'calculator:competitive.tier.good.insight',
          `Strong performance! You're above average, but there's still room to reach top-tier results.`
        ),
      }
    }
    if (percentile >= 50) {
      return {
        tier: 'average',
        message: t(
          'calculator:competitive.tier.average.message',
          `You're around the industry average`
        ),
        color: 'text-orange-400',
        emoji: '⚡',
        insight: t(
          'calculator:competitive.tier.average.insight',
          `You're doing okay, but automation could help you significantly outpace competitors.`
        ),
      }
    }
    return {
      tier: 'bottom',
      message: t(
        'calculator:competitive.tier.bottom.message',
        `You're in the bottom ${100 - percentile}%`
      ),
      color: 'text-red-400',
      emoji: '🎯',
      insight: t(
        'calculator:competitive.tier.bottom.insight',
        `Major opportunity! AI automation could dramatically improve your competitive position.`
      ),
    }
  }

  const performanceTier = getPerformanceTier()

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
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{performanceTier.emoji}</span>
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                {t('calculator:competitive.title', 'How You Compare')}
              </h3>
              <p className={`text-lg font-semibold ${performanceTier.color}`}>
                {performanceTier.message}
              </p>
            </div>
          </div>

          {/* Insight Message */}
          <div className="p-4 rounded-lg bg-white/5 border border-white/10">
            <p className="text-sm text-white/90">{performanceTier.insight}</p>
          </div>
        </div>

        {/* Benchmark Visualizations */}
        <div className="space-y-6">
          {/* ROI Benchmark */}
          <BenchmarkBar
            label={t('calculator:competitive.roi_label', 'Return on Investment')}
            userValue={userMetrics.roi}
            industryAverage={benchmarks.avgROI}
            topPerformer={benchmarks.topROI}
            format="percentage"
          />

          {/* Time Saved Benchmark */}
          <BenchmarkBar
            label={t('calculator:competitive.time_label', 'Time Saved (Monthly)')}
            userValue={userMetrics.timeSaved}
            industryAverage={benchmarks.avgTimeSaved}
            topPerformer={benchmarks.topTimeSaved}
            format="number"
            unit="h"
          />

          {/* Cost Savings Benchmark */}
          <BenchmarkBar
            label={t('calculator:competitive.cost_label', 'Cost Savings (Annual)')}
            userValue={userMetrics.costSavings}
            industryAverage={benchmarks.avgCostSavings}
            topPerformer={benchmarks.topCostSavings}
            format="currency"
          />

          {/* ROAS Benchmark (conditional) */}
          {userMetrics.currentROAS && benchmarks.avgROAS && benchmarks.topROAS && (
            <div className="pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xl">💎</span>
                <h4 className="text-sm font-semibold text-white">
                  {t('calculator:competitive.roas_section', 'Ad Efficiency')}
                </h4>
              </div>
              <BenchmarkBar
                label={t('calculator:competitive.roas_label', 'Return on Ad Spend (ROAS)')}
                userValue={userMetrics.currentROAS}
                industryAverage={benchmarks.avgROAS}
                topPerformer={benchmarks.topROAS}
                format="number"
                unit=":1"
              />
            </div>
          )}
        </div>

        {/* Action Prompt */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/20">
          <p className="text-sm text-white/90 text-center">
            💡{' '}
            {performanceTier.tier === 'bottom' || performanceTier.tier === 'average'
              ? t(
                  'calculator:competitive.action.improve',
                  `AI automation could help you reach the top 10% - see how below`
                )
              : t(
                  'calculator:competitive.action.maintain',
                  `Maintain your competitive edge with FutureMarketingAI`
                )}
          </p>
        </div>

        {/* Data Source */}
        <div className="mt-4 text-xs text-center text-white/50">
          {t(
            'calculator:competitive.source',
            'Based on industry benchmarks from similar companies'
          )}
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default CompetitivePositionCard
