/**
 * MobilePricingCard Component
 * 
 * Simplified pricing display optimized for mobile:
 * - Compact vertical layout
 * - "Starting at X" pricing
 * - Single-line value propositions
 * - Large CTA button
 * - "View full pricing" modal trigger
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Check, ExternalLink, Sparkles, TrendingUp } from 'lucide-react'
import { Button } from '../ui/button'

interface PricingPlan {
  id: string
  name: string
  startingPrice: string
  billingPeriod: string
  valueProposition: string
  badge?: string
  highlighted?: boolean
}

interface MobilePricingCardProps {
  /** Array of pricing plans */
  plans?: PricingPlan[]
  /** Early adopter message */
  urgencyMessage?: string
  /** Show full pricing modal */
  onViewFullPricing?: () => void
}

const DEFAULT_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    startingPrice: '€497',
    billingPeriod: '/month',
    valueProposition: 'Perfect for teams getting started with AI marketing',
  },
  {
    id: 'professional',
    name: 'Professional',
    startingPrice: '€997',
    billingPeriod: '/month',
    valueProposition: 'Complete automation for growing marketing teams',
    badge: 'Most Popular',
    highlighted: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    startingPrice: 'Custom',
    billingPeriod: '',
    valueProposition: 'Tailored solutions for large-scale operations',
  },
]

export const MobilePricingCard: React.FC<MobilePricingCardProps> = ({
  plans = DEFAULT_PLANS,
  urgencyMessage,
  onViewFullPricing,
}) => {
  const { t } = useTranslation(['pricing', 'common'])
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    
    // Analytics event
    if (window.gtag) {
      window.gtag('event', 'select_plan', {
        event_category: 'pricing_mobile',
        event_label: planId,
      })
    }
  }

  const handleViewFullPricing = () => {
    if (onViewFullPricing) {
      onViewFullPricing()
    }
    
    // Analytics event
    if (window.gtag) {
      window.gtag('event', 'view_full_pricing', {
        event_category: 'pricing_mobile',
      })
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-8">
      {/* Urgency Message */}
      {urgencyMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/30 rounded-xl text-center"
        >
          <div className="flex items-center justify-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-blue-400" aria-hidden="true" />
            <span className="text-sm font-semibold text-blue-400">
              {t('pricing:early_adopter', 'Early Adopter Pricing')}
            </span>
          </div>
          <p className="text-sm text-slate-300">
            {urgencyMessage || t('pricing:urgency_default', '2 slots remaining at current rates')}
          </p>
        </motion.div>
      )}

      {/* Pricing Cards */}
      <div className="space-y-4 mb-6">
        {plans.map((plan, index) => (
          <motion.div
            key={plan.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative rounded-xl border-2 transition-all ${
              plan.highlighted
                ? 'border-blue-500 bg-gradient-to-br from-blue-500/5 to-purple-500/5'
                : 'border-white/10 bg-slate-900/50'
            } ${
              selectedPlan === plan.id
                ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-slate-950'
                : ''
            }`}
          >
            {/* Badge */}
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full">
                <span className="text-xs font-bold text-white uppercase tracking-wide">
                  {plan.badge}
                </span>
              </div>
            )}

            <div className="p-6">
              {/* Plan Name */}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>

              {/* Pricing */}
              <div className="mb-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-sm text-slate-400">
                    {t('pricing:starting_at', 'Starting at')}
                  </span>
                  <span className="text-3xl font-bold text-white">
                    {plan.startingPrice}
                  </span>
                  <span className="text-sm text-slate-400">{plan.billingPeriod}</span>
                </div>
              </div>

              {/* Value Proposition */}
              <p className="text-base text-slate-300 mb-6 leading-relaxed">
                {plan.valueProposition}
              </p>

              {/* CTA Button */}
              <Button
                size="lg"
                onClick={() => handleSelectPlan(plan.id)}
                className={`w-full h-14 text-base font-semibold touch-manipulation ${
                  plan.highlighted
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500'
                    : 'bg-slate-800 hover:bg-slate-700 border-2 border-white/10'
                }`}
              >
                {selectedPlan === plan.id ? (
                  <>
                    <Check className="mr-2 h-5 w-5" aria-hidden="true" />
                    {t('common:selected', 'Selected')}
                  </>
                ) : (
                  <>
                    {t('pricing:get_started', 'Get Started')}
                    <TrendingUp className="ml-2 h-5 w-5" aria-hidden="true" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* View Full Pricing Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <button
          onClick={handleViewFullPricing}
          className="inline-flex items-center gap-2 px-6 py-3 text-blue-400 hover:text-blue-300 font-medium transition-colors touch-manipulation"
        >
          {t('pricing:view_full_pricing', 'View full pricing & features')}
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
        </button>
        <p className="text-sm text-slate-500 mt-2">
          {t('pricing:full_comparison', 'See detailed feature comparison on desktop')}
        </p>
      </motion.div>
    </div>
  )
}

export default MobilePricingCard

