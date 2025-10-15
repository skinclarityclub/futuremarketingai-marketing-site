/**
 * WastedAdSpendCard Component
 *
 * Killer visual that shows the stark reality of wasted ad spend
 * and the massive opportunity with AI-powered testing.
 *
 * Features:
 * - Dramatic before/after comparison
 * - Animated "wasted money" visualization
 * - Clear ROI impact numbers
 * - CTA to optimize ad spend
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import GlassCard from '../common/GlassCard'
import { AnimatedMetric } from '../common/AnimatedMetric'

export interface WastedAdSpendCardProps {
  monthlyAdBudget: number
  testingLevel: number // 0-100
  wastedAdSpend: number
  adSpendSavings: number
  adRevenueIncrease: number
  currentROAS: number
  potentialROAS: number
  className?: string
}

const WastedAdSpendCard: React.FC<WastedAdSpendCardProps> = ({
  monthlyAdBudget,
  testingLevel,
  wastedAdSpend,
  adSpendSavings,
  adRevenueIncrease,
  currentROAS,
  potentialROAS,
  className = '',
}) => {
  const { t } = useTranslation(['calculator'])

  if (!monthlyAdBudget || monthlyAdBudget === 0) {
    return null
  }

  const wastePercentage = (wastedAdSpend / monthlyAdBudget) * 100
  const annualWaste = wastedAdSpend * 12
  const annualSavings = adSpendSavings * 12
  const totalImpact = annualSavings + adRevenueIncrease * 12

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className={className}
    >
      <GlassCard className="p-6 md:p-8 overflow-hidden relative">
        {/* Animated background particles (fire/money burning effect) */}
        {testingLevel < 50 && (
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-red-500 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -50, 0],
                  opacity: [0.3, 0.8, 0.3],
                  scale: [1, 1.5, 1],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>
        )}

        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-xl md:text-2xl font-bold text-white mb-2 flex items-center gap-2">
              <span className="text-3xl">💸</span>
              {t('calculator:wasted_ad_spend.title', 'Wasted Ad Spend')}
            </h3>
            <p className="text-sm text-white/70">
              {t(
                'calculator:wasted_ad_spend.subtitle',
                'The hidden cost of launching ads without testing'
              )}
            </p>
          </div>
          {testingLevel < 25 && (
            <div className="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50">
              <span className="text-xs font-semibold text-red-400">
                ⚠️ {t('calculator:wasted_ad_spend.alert', 'High Risk')}
              </span>
            </div>
          )}
        </div>

        {/* Main Stat: Wasted Spend */}
        <div className="mb-8 p-6 rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border-2 border-red-500/30">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-white/90 font-medium">
              {t('calculator:wasted_ad_spend.currently_wasting', "You're Currently Wasting")}
            </span>
            <span className="text-sm font-bold text-red-400">{Math.round(wastePercentage)}%</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <AnimatedMetric
              label={t('calculator:wasted_ad_spend.per_month', 'Per Month')}
              value={wastedAdSpend}
              format="currency"
              color="warning"
              size="lg"
            />
            <AnimatedMetric
              label={t('calculator:wasted_ad_spend.per_year', 'Per Year')}
              value={annualWaste}
              format="currency"
              color="warning"
              size="lg"
            />
          </div>
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-white/70 text-center">
              💡{' '}
              {t(
                'calculator:wasted_ad_spend.insight',
                "This is money spent on ads that don't convert due to lack of testing"
              )}
            </p>
          </div>
        </div>

        {/* ROAS Comparison: Before vs After */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-white/5 border border-white/10">
            <div className="text-xs text-white/60 mb-2">
              {t('calculator:wasted_ad_spend.current_roas', 'Current ROAS')}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{currentROAS}:1</div>
            <div className="text-xs text-white/50">
              {t('calculator:wasted_ad_spend.testing_level', 'Testing Level')}: {testingLevel}%
            </div>
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-accent-success/20 to-accent-primary/20 border border-accent-success/30">
            <div className="text-xs text-white/80 mb-2">
              {t('calculator:wasted_ad_spend.potential_roas', 'Potential ROAS')}
            </div>
            <div className="text-2xl font-bold text-accent-success mb-1 flex items-center gap-2">
              {potentialROAS}:1
              <span className="text-lg">🚀</span>
            </div>
            <div className="text-xs text-accent-success">
              {t('calculator:wasted_ad_spend.with_ai_testing', 'With AI Testing')}
            </div>
          </div>
        </div>

        {/* Total Impact */}
        <div className="p-6 rounded-xl bg-gradient-to-br from-accent-success/10 to-accent-primary/10 border border-accent-success/20 mb-6">
          <h4 className="text-lg font-semibold text-white mb-4 text-center">
            ✨ {t('calculator:wasted_ad_spend.total_annual_impact', 'Total Annual Impact')}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <AnimatedMetric
                label={t('calculator:wasted_ad_spend.ad_spend_savings', 'Ad Spend Savings')}
                value={annualSavings}
                format="currency"
                color="success"
                size="md"
              />
            </div>
            <div className="text-center">
              <AnimatedMetric
                label={t('calculator:wasted_ad_spend.revenue_increase', 'Revenue Increase')}
                value={adRevenueIncrease * 12}
                format="currency"
                color="primary"
                size="md"
              />
            </div>
            <div className="text-center p-4 rounded-xl bg-gradient-to-br from-accent-success/20 to-accent-primary/20 border border-accent-success/30">
              <div className="text-xs text-white/70 mb-2">
                {t('calculator:wasted_ad_spend.total_impact', 'Total Impact')}
              </div>
              <AnimatedMetric
                value={totalImpact}
                format="currency"
                color="success"
                size="lg"
                className="text-3xl font-bold"
              />
            </div>
          </div>
        </div>

        {/* Action Message */}
        <div className="text-center p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
          <p className="text-sm text-white/90 mb-2">
            <strong>
              {t('calculator:wasted_ad_spend.action_message', 'Test First, Then Scale')}
            </strong>
          </p>
          <p className="text-xs text-white/70">
            {t(
              'calculator:wasted_ad_spend.action_description',
              'AI-powered testing finds winning ads before you waste budget on losers'
            )}
          </p>
        </div>
      </GlassCard>
    </motion.div>
  )
}

export default WastedAdSpendCard
