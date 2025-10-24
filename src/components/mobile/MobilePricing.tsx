/**
 * MobilePricing - Mobile-optimized version of PricingAvailabilityBanner
 *
 * Desktop-first compliant: This is a NEW mobile-only component.
 * Uses EXACT same pricing data (TIER_CONFIGS, translation keys) as desktop.
 *
 * Key differences from desktop:
 * - Vertical card layout instead of inline/floating banner
 * - Simplified "Starting at X" display
 * - Single tier shown (current tier)
 * - "View Full Pricing" button links to desktop modal
 * - All text ≥16px for legibility
 * - Touch-friendly targets (48px+)
 */

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ExternalLink, ArrowRight } from 'lucide-react'
import {
  TIER_CONFIGS,
  getCurrentTier,
  calculateSlotAvailability,
  formatPrice,
} from '../../types/pricing'

export interface MobilePricingProps {
  totalCustomers?: number
  className?: string
  onViewFullPricing?: () => void
}

/**
 * Mobile Pricing - Condensed version using SAME data as desktop
 * Shows current tier pricing with CTA to view full details on desktop
 */
export const MobilePricing: React.FC<MobilePricingProps> = ({
  totalCustomers = 3,
  className = '',
  onViewFullPricing,
}) => {
  const { t } = useTranslation('common')

  // Use EXACT same logic as desktop
  const currentTier = useMemo(() => getCurrentTier(totalCustomers), [totalCustomers])
  const currentTierConfig = useMemo(() => TIER_CONFIGS[currentTier], [currentTier])
  const slotAvailability = useMemo(
    () => calculateSlotAvailability(currentTier, totalCustomers),
    [currentTier, totalCustomers]
  )

  const handleViewFullPricing = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'view_full_pricing_click', {
        event_category: 'engagement',
        event_label: 'mobile_pricing_section',
        value: 1,
      })
    }

    if (onViewFullPricing) {
      onViewFullPricing()
    } else {
      // Default: scroll to top where full pricing banner is
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <section className={`py-12 px-6 ${className}`} aria-label="Pricing section">
      {/* Section Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400/10 to-purple-500/10 border border-cyan-400/20 rounded-full mb-4"
        >
          <span className="text-2xl">{currentTierConfig.badge.icon}</span>
          <span className="text-sm font-medium text-cyan-100">
            {t('pricing_banner.exclusive_early_access')}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-white mb-2"
        >
          {currentTierConfig.displayName} {t('pricing_banner.pricing')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-base text-blue-100"
        >
          {t('pricing_banner.early_adopter_message')}
        </motion.p>
      </div>

      {/* Pricing Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-6 mb-6"
      >
        {/* "Starting at" */}
        <div className="text-center mb-6">
          <p className="text-sm text-white/70 mb-2">{t('pricing_banner.starting_at')}</p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-4xl font-bold text-white">
              {formatPrice(currentTierConfig.price)}
            </span>
            <span className="text-lg text-white/70">/month</span>
          </div>
        </div>

        {/* Slot Availability */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-white/80">{t('pricing_banner.availability')}</p>
            <p className="text-sm font-bold text-white" aria-live="polite">
              {slotAvailability.remaining}/{slotAvailability.total} {t('pricing_banner.remaining')}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="rounded-full h-2 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${slotAvailability.percentFilled}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              role="progressbar"
              aria-valuenow={slotAvailability.percentFilled}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={t('pricing_banner.slots_claimed', {
                percent: slotAvailability.percentFilled.toFixed(0),
              })}
            />
          </div>
        </div>

        {/* Value Props */}
        <div className="space-y-2 mb-6">
          {currentTierConfig.lockPeriodMonths > 0 && (
            <div className="flex items-start gap-2 text-sm text-white/80">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>
                {t('pricing_banner.rate_locked', { months: currentTierConfig.lockPeriodMonths })}
              </span>
            </div>
          )}
          {currentTierConfig.freeMonths > 0 && (
            <div className="flex items-start gap-2 text-sm text-cyan-200 font-semibold">
              <span className="text-cyan-400 mt-0.5">🎁</span>
              <span>
                {t('pricing_banner.free_months', {
                  count: currentTierConfig.freeMonths,
                })}
              </span>
            </div>
          )}
          <div className="flex items-start gap-2 text-sm text-white/80">
            <span className="text-green-400 mt-0.5">✓</span>
            <span>{t('pricing_banner.first_come_first_served')}</span>
          </div>
        </div>

        {/* CTA Button */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full h-14 min-h-touch bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-cyan-500/50 transition-all duration-300 flex items-center justify-center gap-2 touch-manipulation"
          aria-label={t('pricing_banner.claim_spot')}
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'claim_spot_click', {
                event_category: 'conversion',
                event_label: 'mobile_pricing_cta',
                value: 1,
              })
            }
          }}
        >
          {t('pricing_banner.be_customer', { number: totalCustomers + 1 })}
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </motion.div>

      {/* View Full Pricing Link */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        onClick={handleViewFullPricing}
        className="w-full h-12 min-h-touch bg-white/5 border border-white/20 hover:bg-white/10 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2 touch-manipulation"
        aria-label={t('pricing_banner.view_full_pricing')}
      >
        {t('pricing_banner.view_full_pricing')}
        <ExternalLink className="w-4 h-4" />
      </motion.button>

      {/* Urgency Messaging */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-sm text-center text-white/60 mt-4"
      >
        {t('pricing_banner.earlier_customers_lower_prices')}
      </motion.p>
    </section>
  )
}

MobilePricing.displayName = 'MobilePricing'
