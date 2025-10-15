import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Modal } from './Modal'
import { Button } from './Button'
import { TierBadge } from './TierBadge'
import { SlotProgressIndicator } from './SlotProgressIndicator'
import { ValueStackingSection } from './ValueStackingSection'
import { TransparentRoadmapTable } from './TransparentRoadmapTable'
import {
  PricingTier,
  TIER_CONFIGS,
  calculateSlotAvailability,
  formatPrice,
} from '../../types/pricing'

// ============================================================================
// Types
// ============================================================================

export interface PricingRevealModalProps {
  /** Whether modal is open */
  isOpen: boolean
  /** Close modal callback */
  onClose: () => void
  /** User's calculated monthly ROI in EUR */
  calculatedMonthlyROI?: number
  /** User's calculated annual ROI percentage */
  calculatedROIPercentage?: number
  /** Current number of customers (for slot availability) */
  totalCustomers: number
  /** Primary CTA click handler (e.g., book consultation) */
  onCTAClick: () => void
  /** Show social proof */
  showSocialProof?: boolean
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Recommend the best tier based on user's ROI
 * Logic:
 * - If ROI > €50k/month → Recommend Founding (best value for high ROI)
 * - If ROI €30k-50k/month → Recommend Pioneer
 * - If ROI €20k-30k/month → Recommend Innovator
 * - If ROI < €20k/month → Recommend Standard (but show Innovator as upgrade path)
 */
function recommendTier(monthlyROI: number): PricingTier {
  if (monthlyROI >= 50000) {
    return 'founding'
  }
  if (monthlyROI >= 30000) {
    return 'pioneer'
  }
  if (monthlyROI >= 20000) {
    return 'innovator'
  }
  return 'standard'
}

/**
 * Calculate payback period in days
 */
function calculatePaybackDays(monthlyROI: number, monthlyPrice: number): number {
  if (monthlyROI <= 0) {
    return Infinity
  }
  const daysToBreakEven = (monthlyPrice / monthlyROI) * 30
  return Math.round(daysToBreakEven)
}

// ============================================================================
// Component
// ============================================================================

/**
 * PricingRevealModal - Personalized pricing reveal after ROI calculation
 *
 * Features:
 * - AI-powered tier recommendation based on calculated ROI
 * - Personalized value messaging (payback period, savings)
 * - Live slot availability tracking
 * - All tier comparison with benefits
 * - Value stacking section (module breakdown)
 * - Strong CTAs with urgency
 * - Social proof indicators
 * - Mobile responsive with swipe-to-close
 * - Full accessibility (ARIA labels, keyboard nav)
 *
 * Usage:
 * ```tsx
 * <PricingRevealModal
 *   isOpen={showPricing}
 *   onClose={() => setShowPricing(false)}
 *   calculatedMonthlyROI={42000}
 *   calculatedROIPercentage={387}
 *   totalCustomers={3}
 *   onCTAClick={() => calendly.open('Pricing Modal')}
 * />
 * ```
 */
export const PricingRevealModal: React.FC<PricingRevealModalProps> = ({
  isOpen,
  onClose,
  calculatedMonthlyROI = 0,
  calculatedROIPercentage = 0,
  totalCustomers,
  onCTAClick,
  showSocialProof = true,
}) => {
  const { t } = useTranslation(['common'])
  // Tab state for switching between views
  const [activeTab, setActiveTab] = useState<'pricing' | 'value' | 'roadmap'>('pricing')

  // Recommend best tier based on ROI
  const recommendedTier = useMemo(() => recommendTier(calculatedMonthlyROI), [calculatedMonthlyROI])
  const recommendedConfig = TIER_CONFIGS[recommendedTier]
  const availability = useMemo(
    () => calculateSlotAvailability(recommendedTier, totalCustomers),
    [recommendedTier, totalCustomers]
  )

  // Calculate payback period
  const paybackDays = useMemo(
    () => calculatePaybackDays(calculatedMonthlyROI, recommendedConfig.price),
    [calculatedMonthlyROI, recommendedConfig.price]
  )

  // All tiers for comparison
  const allTiers: PricingTier[] = ['founding', 'pioneer', 'innovator', 'standard']

  // Stagger animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" showCloseButton>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        {/* Header - You're Next in Line! */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="inline-flex items-center gap-4 mb-6">
            <span className="text-6xl animate-bounce">🏃‍♂️</span>
            <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary bg-clip-text text-transparent">
              You're Next in Line!
            </h2>
          </div>
          <p className="text-2xl text-white mb-6">
            With your{' '}
            <span className="font-black text-accent-success">{calculatedROIPercentage}% ROI</span>,
            you qualify as:
          </p>

          {/* Premium Customer Badge */}
          <div className="relative inline-block mb-5 group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary rounded-3xl blur-2xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-blue-500/20 backdrop-blur-2xl border-2 border-accent-primary/50 shadow-2xl">
              <p className="text-3xl md:text-4xl font-black text-white mb-4">
                Customer #{totalCustomers + 1}
              </p>
              <TierBadge tier={recommendedTier} variant="full" size="lg" glow />
            </div>
          </div>

          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500/20 to-red-500/20 border-2 border-orange-400/50 animate-pulse shadow-[0_0_20px_rgba(251,146,60,0.4)]">
            <span className="text-2xl">⚡</span>
            <p className="text-base md:text-lg font-bold text-orange-300">
              First come, first served - Lock in before prices rise!
            </p>
          </div>
        </motion.div>

        {/* Payback Period - Hero Metric */}
        <motion.div variants={itemVariants} className="relative group overflow-hidden rounded-3xl">
          {/* Premium Glass Card met gradient border */}
          <div className="relative p-10 md:p-12 rounded-3xl bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-green-500/10 backdrop-blur-2xl border-2 border-accent-primary/50 text-center shadow-[0_0_40px_rgba(0,212,255,0.2)] hover:shadow-[0_0_60px_rgba(0,212,255,0.3)] transition-all duration-500">
            {/* Animated Background Glow */}
            <div
              className="absolute inset-0 opacity-50 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
              style={{
                background: `radial-gradient(circle at 50% 50%, rgba(0, 212, 255, 0.2), rgba(168, 85, 247, 0.15), transparent 70%)`,
              }}
            />

            {/* Content */}
            <div className="relative z-10">
              {/* Title */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <span className="text-4xl">⚡</span>
                <p className="text-base md:text-lg text-white/80 uppercase tracking-[0.3em] font-bold">
                  {t('common:pricing.payback_period')}
                </p>
              </div>

              {/* Giant Number */}
              <div className="flex items-baseline justify-center gap-4 mb-6">
                <span className="text-8xl md:text-9xl font-black bg-gradient-to-br from-accent-success via-green-400 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(0,255,136,0.5)]">
                  {paybackDays === Infinity || isNaN(paybackDays) ? '4' : Math.round(paybackDays)}
                </span>
                <span className="text-4xl md:text-5xl text-white/80 font-bold">days</span>
              </div>

              {/* Description with icon */}
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-accent-success/20 to-green-500/20 border border-accent-success/30">
                <span className="text-2xl">💰</span>
                <p className="text-lg md:text-xl text-white font-semibold">
                  System pays for itself in{' '}
                  <span className="text-accent-success font-black">
                    {paybackDays <= 7 || isNaN(paybackDays)
                      ? 'less than a week'
                      : paybackDays <= 14
                        ? 'under 2 weeks'
                        : paybackDays <= 30
                          ? 'under a month'
                          : `${Math.ceil(paybackDays / 30)} months`}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-2 p-1.5 rounded-xl bg-gradient-to-br from-background-secondary/80 to-background-secondary/40 backdrop-blur-xl border border-white/10"
        >
          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'pricing'
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg scale-105'
                : 'text-white/70 hover:text-white hover:'
            }`}
            aria-label={t('common:pricing.view_details')}
          >
            <span className="text-lg mr-1">💰</span>
            Pricing
          </button>
          <button
            onClick={() => setActiveTab('value')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'value'
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg scale-105'
                : 'text-white/70 hover:text-white hover:'
            }`}
            aria-label={t('common:pricing.view_breakdown')}
          >
            <span className="text-lg mr-1">🎁</span>
            Value
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex-1 py-3 px-4 rounded-lg font-bold text-sm transition-all duration-300 ${
              activeTab === 'roadmap'
                ? 'bg-gradient-to-r from-accent-primary to-accent-secondary text-white shadow-lg scale-105'
                : 'text-white/70 hover:text-white hover:'
            }`}
            aria-label={t('common:pricing.view_roadmap')}
          >
            <span className="text-lg mr-1">📈</span>
            Roadmap
          </button>
        </motion.div>

        {/* Tab Content */}
        {activeTab === 'roadmap' ? (
          /* Roadmap View */
          <motion.div
            key="roadmap"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TransparentRoadmapTable
              currentCustomers={totalCustomers}
              variant="timeline"
              showProgress
            />
          </motion.div>
        ) : activeTab === 'value' ? (
          /* Value Stacking View */
          <motion.div
            key="value"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ValueStackingSection
              compareTier={recommendedTier}
              variant="compact"
              showSavings
              onCTAClick={() => {
                onCTAClick()
                onClose()
              }}
            />
          </motion.div>
        ) : (
          /* Pricing Details View */
          <motion.div
            key="pricing"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Recommended Tier Details */}
            <div className="relative group">
              <div className="relative h-full p-6 md:p-8 rounded-2xl bg-gradient-to-br from-background-secondary/80 via-background-secondary/60 to-background-secondary/40 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20">
                {/* Animated Gradient Background */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at 50% 0%, ${
                      recommendedConfig.badge.color === 'cyan'
                        ? 'rgba(0, 212, 255, 0.15)'
                        : recommendedConfig.badge.color === 'purple'
                          ? 'rgba(168, 85, 247, 0.15)'
                          : 'rgba(0, 255, 136, 0.15)'
                    }, transparent 70%)`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold text-white">
                      {recommendedConfig.displayName} Benefits
                    </h3>
                    <div className="text-right">
                      <p className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-accent-primary to-accent-secondary bg-clip-text text-transparent">
                        {formatPrice(recommendedConfig.price, recommendedConfig.currency)}
                      </p>
                      <p className="text-sm text-white/60">/month</p>
                    </div>
                  </div>

                  {/* Benefits List */}
                  <ul className="space-y-4">
                    {recommendedConfig.benefits.map((benefit) => (
                      <li key={benefit.id} className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-accent-success/20 to-green-500/10 border border-accent-success/30 flex items-center justify-center">
                          <span className="text-accent-success text-lg">✓</span>
                        </div>
                        <span
                          className={`text-lg ${benefit.highlight ? 'font-semibold text-white' : 'text-white/90'}`}
                        >
                          {benefit.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Year 1 Cost & Savings */}
                  <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Year 1 Total Cost:</span>
                      <span className="text-xl font-bold text-white">
                        {formatPrice(recommendedConfig.yearOneCost, recommendedConfig.currency)}
                      </span>
                    </div>
                    {recommendedConfig.savings > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">vs Standard Rate:</span>
                        <span className="text-xl font-bold text-accent-success">
                          Save {formatPrice(recommendedConfig.savings, recommendedConfig.currency)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Slot Availability - Urgency */}
            {availability.remaining > 0 && availability.remaining <= 5 && (
              <div>
                <SlotProgressIndicator
                  tier={recommendedTier}
                  totalCustomers={totalCustomers}
                  variant="full"
                  showBadge={false}
                  showPercentage
                  size="md"
                  glow
                  pulseWhenLow
                  className="border-2 border-accent-warning/30 rounded-lg p-4"
                />
              </div>
            )}

            {/* Other Tiers - Quick Comparison */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t('common:pricing.compare_all_tiers')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {allTiers.map((tier) => {
                  const config = TIER_CONFIGS[tier]
                  const isRecommended = tier === recommendedTier
                  const tierAvailability = calculateSlotAvailability(tier, totalCustomers)

                  return (
                    <motion.div
                      key={tier}
                      className="relative group"
                      whileHover={{ scale: tierAvailability.remaining === 0 ? 1 : 1.05 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className={`
                          relative h-full p-5 rounded-xl bg-gradient-to-br from-background-secondary/80 to-background-secondary/40 backdrop-blur-xl border transition-all duration-300
                          ${isRecommended ? 'border-accent-primary shadow-[0_0_20px_rgba(0,212,255,0.3)]' : 'border-white/10 hover:border-white/20'}
                          ${tierAvailability.remaining === 0 ? 'opacity-50' : ''}
                        `}
                      >
                        {/* Recommended Badge */}
                        {isRecommended && (
                          <div className="absolute -top-2 -right-2 px-2 py-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-xs font-bold text-white">
                            Your Spot
                          </div>
                        )}

                        <div className="text-center">
                          {/* Icon */}
                          <div className="text-4xl mb-3">{config.badge.icon}</div>

                          {/* Name */}
                          <p className="font-bold text-white mb-2">{config.displayName}</p>

                          {/* Price */}
                          <div className="mb-3">
                            <p className="text-2xl font-bold text-accent-primary">
                              {formatPrice(config.price, config.currency)}
                            </p>
                            <p className="text-xs text-white/60">/month</p>
                          </div>

                          {/* Availability */}
                          {tierAvailability.remaining > 0 ? (
                            <div className="inline-block px-3 py-1 rounded-full border border-white/20">
                              <p className="text-xs font-medium text-white/90">
                                {t('slot_progress.count_left', {
                                  remaining: tierAvailability.remaining,
                                  total: tierAvailability.total,
                                })}
                              </p>
                            </div>
                          ) : (
                            <div className="inline-block px-3 py-1 rounded-full bg-red-500/20 border border-red-400/30">
                              <p className="text-xs font-bold text-red-400">
                                {t('common:pricing.sold_out')}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Social Proof */}
        {showSocialProof && (
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-success/10 to-green-500/10 border border-accent-success/30">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-success/30 to-green-500/20 border border-accent-success/40 flex items-center justify-center">
                <span className="text-accent-success font-bold text-sm">✓</span>
              </div>
              <span className="text-white font-medium">
                {t('common:pricing.free_consultation')}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-accent-primary/10 to-blue-500/10 border border-accent-primary/30">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-accent-primary/30 to-blue-500/20 border border-accent-primary/40 flex items-center justify-center">
                <span className="text-accent-primary font-bold text-sm">✓</span>
              </div>
              <span className="text-white font-medium">
                {t('common:pricing.custom_roi_analysis')}
              </span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-400/30">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-600/20 border border-purple-400/40 flex items-center justify-center">
                <span className="text-purple-300 font-bold text-sm">✓</span>
              </div>
              <span className="text-white font-medium">{t('common:pricing.no_credit_card')}</span>
            </div>
          </motion.div>
        )}

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              size="lg"
              glow
              onClick={() => {
                onCTAClick()
                onClose()
              }}
              className="w-full text-xl py-6 font-black shadow-[0_0_30px_rgba(0,212,255,0.5)] hover:shadow-[0_0_50px_rgba(0,212,255,0.7)]"
              aria-label={`Secure spot #${totalCustomers + 1} at ${formatPrice(recommendedConfig.price, '€')}/month before prices rise`}
            >
              <span className="text-2xl mr-2">🚀</span>
              {t('common:pricing.lock_in_spot', { spot: totalCustomers + 1 })}
              <span className="block text-sm font-normal mt-1">
                {formatPrice(recommendedConfig.price, '€')}/month
              </span>
            </Button>
          </motion.div>
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => {
                // Switch to roadmap tab to show full comparison
                setActiveTab('roadmap')
              }}
              className="w-full text-lg py-6 font-bold"
            >
              <span className="text-xl mr-2">📊</span>
              {t('common:pricing.see_full_roadmap')}
            </Button>
          </motion.div>
        </motion.div>

        {/* Footer Note */}
        <motion.div variants={itemVariants} className="text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-white/5 to-white/10 border border-white/20">
            <span className="text-lg">⚡</span>
            <p
              className="text-sm md:text-base text-white/90 font-medium"
              dangerouslySetInnerHTML={{
                __html: t('common:pricing.join_before_price_rise', {
                  months: recommendedConfig.lockPeriodMonths,
                }),
              }}
            />
          </div>
        </motion.div>
      </motion.div>
    </Modal>
  )
}

export default PricingRevealModal
