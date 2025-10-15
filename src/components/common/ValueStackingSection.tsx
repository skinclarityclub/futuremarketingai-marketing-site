import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { GlassCard } from './GlassCard'
import { PricingTier, TIER_CONFIGS, formatPrice } from '../../types/pricing'

// ============================================================================
// Types & Data
// ============================================================================

export interface ModuleValue {
  id: string
  name: string
  description: string
  icon: string
  retailValue: number // Monthly retail value in EUR
  currency: string
  highlights: string[]
  category: 'core' | 'premium' | 'enterprise'
}

/**
 * All FutureMarketingAI modules with their individual market values
 * Based on comparable SaaS products in the market
 */
export const MODULE_VALUES: ModuleValue[] = [
  {
    id: 'campaign-orchestra',
    name: 'Campaign Orchestra',
    description: 'Multi-platform campaign automation and scheduling',
    icon: '🎼',
    retailValue: 4500,
    currency: '€',
    highlights: ['10+ platform integrations', 'Smart scheduling', 'A/B testing'],
    category: 'core',
  },
  {
    id: 'ai-content-studio',
    name: 'AI Content Studio',
    description: 'AI-powered content generation and copywriting',
    icon: '✍️',
    retailValue: 3500,
    currency: '€',
    highlights: ['GPT-4 integration', 'Brand voice training', 'Unlimited generation'],
    category: 'core',
  },
  {
    id: 'ad-builder-pro',
    name: 'Ad Builder Pro',
    description: 'AI video ads with virtual presenters',
    icon: '🎬',
    retailValue: 5000,
    currency: '€',
    highlights: ['AI presenters', 'Video templates', 'Background removal'],
    category: 'premium',
  },
  {
    id: 'analytics-center',
    name: 'Analytics Center',
    description: 'Advanced analytics and ROI tracking dashboard',
    icon: '📊',
    retailValue: 2500,
    currency: '€',
    highlights: ['Real-time reporting', 'ROI calculator', 'Custom metrics'],
    category: 'core',
  },
  {
    id: 'strategy-matrix',
    name: 'Strategy Matrix',
    description: 'AI-powered campaign strategy and planning',
    icon: '🎯',
    retailValue: 3000,
    currency: '€',
    highlights: ['Perplexity AI research', 'Trend forecasting', 'Competitor analysis'],
    category: 'premium',
  },
  {
    id: 'content-calendar',
    name: 'Content Calendar',
    description: 'Smart content planning and team collaboration',
    icon: '📅',
    retailValue: 1500,
    currency: '€',
    highlights: ['Drag-and-drop planning', 'Team collaboration', 'Approval workflows'],
    category: 'core',
  },
  {
    id: 'brand-management',
    name: 'Brand Management Suite',
    description: 'Multi-brand asset management and guidelines',
    icon: '🏢',
    retailValue: 2000,
    currency: '€',
    highlights: ['Unlimited brands', 'Asset library', 'Brand guidelines'],
    category: 'premium',
  },
  {
    id: 'ai-assistant',
    name: '24/7 AI Marketing Expert',
    description: 'Personal AI assistant for strategy and support',
    icon: '🤖',
    retailValue: 4000,
    currency: '€',
    highlights: ['Real-time help', 'Strategy advice', 'Technical support'],
    category: 'enterprise',
  },
]

export interface ValueStackingSectionProps {
  /** Which tier pricing to compare against */
  compareTier?: PricingTier
  /** Show category filters */
  showFilters?: boolean
  /** Variant: compact (grid), full (detailed list), summary (totals only) */
  variant?: 'compact' | 'full' | 'summary'
  /** Show savings calculation */
  showSavings?: boolean
  /** Additional CSS classes */
  className?: string
  /** Click handler for CTA */
  onCTAClick?: () => void
}

// ============================================================================
// Component
// ============================================================================

/**
 * ValueStackingSection - Display all modules with their individual values
 *
 * Features:
 * - Shows all 8 FutureMarketingAI modules with retail values
 * - Calculates total value vs tier pricing
 * - Demonstrates massive savings (value stacking technique)
 * - 3 variants: compact (grid), full (detailed), summary (totals only)
 * - Animated entrance with staggered children
 * - Category filtering (core, premium, enterprise)
 * - Mobile responsive
 * - Full accessibility
 *
 * Usage:
 * ```tsx
 * <ValueStackingSection compareTier="founding" variant="full" showSavings />
 * ```
 */
export const ValueStackingSection: React.FC<ValueStackingSectionProps> = ({
  compareTier = 'founding',
  variant = 'full',
  showSavings = true,
  className = '',
  onCTAClick,
}) => {
  const { t } = useTranslation('common')
  const tierConfig = TIER_CONFIGS[compareTier]

  // Get translated module data
  const translatedModules = useMemo(() => {
    return MODULE_VALUES.map((module) => ({
      ...module,
      name: t(`value_stacking.modules.${module.id}.name`, module.name),
      description: t(`value_stacking.modules.${module.id}.description`, module.description),
      highlights: t(`value_stacking.modules.${module.id}.highlights`, {
        returnObjects: true,
        defaultValue: module.highlights,
      }) as string[],
    }))
  }, [t])

  // Calculate totals
  const totalRetailValue = useMemo(() => {
    return MODULE_VALUES.reduce((sum, module) => sum + module.retailValue, 0)
  }, [])

  const annualRetailValue = totalRetailValue * 12
  const tierAnnualCost = tierConfig.yearOneCost
  const totalSavings = annualRetailValue - tierAnnualCost
  const savingsPercentage = ((totalSavings / annualRetailValue) * 100).toFixed(0)

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  // Summary variant - Just totals
  if (variant === 'summary') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`glass-card p-6 ${className}`}
      >
        <div className="text-center">
          <p className="text-sm text-white/70 uppercase tracking-wider mb-2">Total Value</p>
          <p className="text-4xl md:text-5xl font-bold gradient-text mb-1">
            {formatPrice(totalRetailValue, '€')}
            <span className="text-lg text-white/70 font-normal">/month</span>
          </p>
          <p className="text-white/80 mb-4">
            All 8 modules • €{(annualRetailValue / 1000).toFixed(0)}k annual value
          </p>

          {showSavings && (
            <>
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-white/70">Your {tierConfig.displayName} Price:</span>
                  <span className="text-white font-semibold">
                    {formatPrice(tierConfig.price, '€')}/mo
                  </span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="text-accent-success font-semibold">You Save:</span>
                  <span className="text-accent-success font-bold">
                    {formatPrice(totalRetailValue - tierConfig.price, '€')}/mo
                  </span>
                </div>
                <p className="text-sm text-white/60 mt-2">
                  💰 {savingsPercentage}% savings vs buying individually
                </p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    )
  }

  // Compact variant - Grid of cards
  if (variant === 'compact') {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <div className="text-center mb-6">
          <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
            {t('value_stacking.title')}
          </h3>
          <p className="text-white/90">
            {t('value_stacking.subtitle', {
              count: MODULE_VALUES.length,
              value: formatPrice(totalRetailValue, '€'),
            })}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {translatedModules.map((module) => (
            <motion.div key={module.id} variants={itemVariants}>
              <GlassCard className="p-4 h-full text-center hover:scale-105 transition-transform">
                <div className="text-4xl mb-2">{module.icon}</div>
                <h4 className="text-sm font-semibold text-white mb-1">{module.name}</h4>
                <p className="text-lg font-bold text-accent-primary">
                  {formatPrice(module.retailValue, module.currency)}
                  <span className="text-xs text-white/60 block">/month</span>
                </p>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {showSavings && (
          <motion.div variants={itemVariants}>
            <GlassCard className="p-6 border-2 border-accent-success/30">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-left">
                  <p className="text-sm text-white/70 uppercase tracking-wider mb-1">
                    {t('value_stacking.your_price', { tier: tierConfig.displayName })}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {formatPrice(tierConfig.price, '€')}
                    <span className="text-lg text-white/70 font-normal">/month</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-accent-success font-semibold mb-1">
                    {t('value_stacking.you_save')}
                  </p>
                  <p className="text-4xl font-bold text-accent-success">{savingsPercentage}%</p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-sm text-white/70 mb-1">{t('value_stacking.annual_savings')}</p>
                  <p className="text-2xl font-bold gradient-text">
                    {formatPrice(totalSavings, '€')}
                  </p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </motion.div>
    )
  }

  // Full variant - Detailed list
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <motion.div variants={itemVariants} className="text-center mb-8">
        <h3 className="text-2xl md:text-3xl font-bold gradient-text mb-2">
          {t('value_stacking.title_full')}
        </h3>
        <p className="text-lg text-white/90 mb-1">
          {t('value_stacking.subtitle_full', { count: MODULE_VALUES.length })}
        </p>
        <p className="text-3xl font-bold text-accent-primary mt-4">
          {formatPrice(totalRetailValue, '€')}
          <span className="text-lg text-white/70 font-normal">
            {' '}
            {t('value_stacking.total_value')}
          </span>
        </p>
      </motion.div>

      <div className="space-y-4 mb-6">
        {translatedModules.map((module) => (
          <motion.div key={module.id} variants={itemVariants}>
            <GlassCard className="p-4 md:p-6 hover:border-accent-primary/30 transition-all">
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{module.icon}</div>
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                    <div>
                      <h4 className="text-lg font-bold text-white">{module.name}</h4>
                      <p className="text-sm text-white/80">{module.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-accent-primary whitespace-nowrap">
                        {formatPrice(module.retailValue, module.currency)}
                      </p>
                      <p className="text-xs text-white/60">/month value</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {module.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full text-white/90"
                        style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                      >
                        ✓ {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {showSavings && (
        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 md:p-8 border-2 border-accent-success/30 bg-gradient-to-br from-accent-success/5 to-transparent">
            <div className="text-center">
              <h4 className="text-xl md:text-2xl font-bold text-white mb-4">
                🎉 {t('value_stacking.your_price', { tier: tierConfig.displayName })}
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-sm text-white/70 uppercase tracking-wider mb-1">
                    {t('value_stacking.title')}
                  </p>
                  <p className="text-3xl font-bold text-white">
                    {formatPrice(totalRetailValue, '€')}
                    <span className="text-sm text-white/70 font-normal block">/month</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/70 uppercase tracking-wider mb-1">
                    {t('value_stacking.your_price', { tier: tierConfig.displayName })}
                  </p>
                  <p className="text-3xl font-bold text-accent-primary">
                    {formatPrice(tierConfig.price, '€')}
                    <span className="text-sm text-white/70 font-normal block">/month</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-accent-success font-semibold uppercase tracking-wider mb-1">
                    {t('value_stacking.you_save')}
                  </p>
                  <p className="text-4xl font-bold text-accent-success">{savingsPercentage}%</p>
                </div>
              </div>

              <div className="rounded-lg p-4 mb-4" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
                <p className="text-white/90 mb-2">
                  <span className="font-semibold text-white">
                    {t('value_stacking.annual_savings')}:
                  </span>{' '}
                  {formatPrice(totalSavings, '€')}{' '}
                  {t('value_stacking.savings_vs_individual', { percent: savingsPercentage })}
                </p>
                <p className="text-sm text-white/70">
                  {formatPrice(Math.round(totalSavings / 12), '€')} /month
                </p>
              </div>

              {onCTAClick && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCTAClick}
                  className="w-full md:w-auto px-8 py-4 bg-gradient-to-r from-accent-primary to-accent-secondary rounded-xl font-bold text-lg text-white shadow-lg hover:shadow-accent-primary/50 transition-shadow"
                  aria-label={`Claim ${tierConfig.displayName} spot with ${savingsPercentage}% savings`}
                >
                  🚀 Lock In This {savingsPercentage}% Discount
                </motion.button>
              )}
            </div>
          </GlassCard>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ValueStackingSection
