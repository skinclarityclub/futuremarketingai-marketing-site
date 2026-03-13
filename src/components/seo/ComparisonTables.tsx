/**
 * Comparison Tables Component
 *
 * Optimized for both traditional SEO and LLM extraction with:
 * - Semantic HTML <table> elements
 * - Clear header rows for LLM parsing
 * - Comparison data in structured format
 * - Mobile-responsive design
 *
 * Content derived from demo pricing and platform features.
 *
 * @see LANDING-PAGE-COMPREHENSIVE-AUDIT-2025.md - LLM Content Optimization
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface PricingTableProps {
  /** Show Early Adopter urgency indicators */
  showUrgency?: boolean
  /** Highlight a specific tier (by index) */
  highlightTier?: number
  className?: string
}

interface PricingTier {
  name: string
  price: string
  period: string
  savings: string | null
  slots: string
  features: string[]
  badge: string | null
  urgency?: 'high' | 'medium' | 'low' | null
}

interface PlatformFeature {
  category: string
  description: string
  savings?: string
  additionalRevenue?: string
  benefit: string
}

interface ToolComparison {
  need: string
  traditional: string
  traditionalCost: string
  futureMarketing: string
}

/**
 * Pricing Comparison Table
 *
 * Displays Early Adopter pricing tiers in an LLM-friendly table format.
 */
export const PricingTable: React.FC<PricingTableProps> = ({
  showUrgency = true,
  highlightTier = 0,
  className = '',
}) => {
  const { t } = useTranslation(['pricing_comparison'])

  // Load pricing tiers from translations
  const TIER_KEYS = ['founding_member', 'pioneer', 'innovator', 'standard'] as const
  const tiers = TIER_KEYS.map((key) => {
    const tierData = t(`pricing_comparison:pricing_tiers.${key}`, {
      returnObjects: true,
    }) as PricingTier
    return {
      ...tierData,
      urgency:
        key === 'founding_member'
          ? ('high' as const)
          : key === 'pioneer'
            ? ('medium' as const)
            : key === 'innovator'
              ? ('low' as const)
              : null,
    }
  })

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
            {t('pricing_comparison:pricing_table.title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('pricing_comparison:pricing_table.subtitle')}
          </p>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {tiers.map((tier: any, index) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`card-gradient-border relative rounded-card bg-white/[0.02] border p-6 transition-all duration-500 hover:bg-white/[0.03] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)] ${
                index === highlightTier ? 'border-accent-human/30' : 'border-border-primary'
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-accent-human/10 text-accent-human text-sm font-semibold rounded-btn shadow-lg border border-accent-human/20">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="text-center mt-2">
                <h3 className="text-xl font-bold font-display text-text-primary">{tier.name}</h3>
                {/* Customer Range Badge */}
                <div className="mt-2 mb-3">
                  <span className="inline-block px-3 py-1 bg-white/[0.04] border border-border-primary rounded-full text-xs text-text-secondary">
                    {index === 0 && 'Customers 1-5'}
                    {index === 1 && 'Customers 6-15'}
                    {index === 2 && 'Customers 16-25'}
                    {index === 3 && 'Customer 26+'}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="text-4xl font-bold font-mono text-text-primary">
                    {tier.price}
                  </span>
                  <span className="text-text-secondary">{tier.period}</span>
                </div>
                {tier.savings && (
                  <p className="text-sm text-accent-system mt-2 font-medium">{tier.savings}</p>
                )}
                {showUrgency && tier.urgency && (
                  <p
                    className={`text-sm mt-2 font-medium ${
                      tier.urgency === 'high'
                        ? 'text-red-400'
                        : tier.urgency === 'medium'
                          ? 'text-accent-human'
                          : 'text-yellow-400'
                    }`}
                  >
                    {tier.slots}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3">
                {tier.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-text-secondary">
                    <Check className="w-5 h-5 text-accent-system flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8">
                <button
                  className={`w-full py-3 rounded-btn font-semibold transition-all ${
                    index === 0
                      ? 'bg-accent-human/20 border border-accent-human/30 text-accent-human hover:bg-accent-human/30'
                      : 'bg-white/[0.04] border border-border-primary text-text-muted cursor-not-allowed'
                  }`}
                  disabled={index !== 0}
                >
                  {index === 0
                    ? t('pricing_comparison:pricing_table.secure_slot')
                    : t('pricing_comparison:pricing_table.not_available_yet')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet: Semantic Table */}
        <div className="lg:hidden overflow-x-auto">
          <table className="w-full border-collapse bg-white/[0.02] rounded-card overflow-hidden">
            <thead>
              <tr className="bg-white/[0.04]">
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:pricing_table.table_headers.tier')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  Customers
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:pricing_table.table_headers.price')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:pricing_table.table_headers.slots')}
                </th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier: any, index) => (
                <tr key={tier.name} className="border-t border-border-primary">
                  <td className="px-4 py-3 text-text-primary font-medium">{tier.name}</td>
                  <td className="px-4 py-3 text-text-secondary text-sm">
                    {index === 0 && '1-5'}
                    {index === 1 && '6-15'}
                    {index === 2 && '16-25'}
                    {index === 3 && '26+'}
                  </td>
                  <td className="px-4 py-3 text-text-primary font-mono">{tier.price}/mo</td>
                  <td className="px-4 py-3 text-text-secondary text-sm">{tier.slots}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

/**
 * Feature Comparison Table
 *
 * Shows platform features with cost savings in LLM-friendly format.
 */
export const FeatureComparisonTable: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation(['pricing_comparison'])

  // Load platform features from translations
  const features = t('pricing_comparison:platform_features', {
    returnObjects: true,
  }) as PlatformFeature[]

  const totalSavings = features.reduce((acc, feature) => {
    const savings = feature.savings ? parseInt(feature.savings.replace(/[^0-9]/g, '')) : 0
    return acc + savings
  }, 0)

  const totalRevenue = features.reduce((acc, feature) => {
    const revenue = feature.additionalRevenue
      ? parseInt(feature.additionalRevenue.replace(/[^0-9]/g, ''))
      : 0
    return acc + revenue
  }, 0)

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
            {t('pricing_comparison:feature_table.title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-6">
            {t('pricing_comparison:feature_table.subtitle_template', {
              savings: totalSavings.toLocaleString(),
              revenue: totalRevenue.toLocaleString(),
            })}
          </p>
        </div>

        {/* Semantic Table for LLM extraction */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/[0.02] rounded-card overflow-hidden">
            <thead>
              <tr className="bg-white/[0.04]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:feature_table.table_headers.module')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:feature_table.table_headers.capability')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:feature_table.table_headers.monthly_value')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:feature_table.table_headers.key_benefit')}
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((feature, index) => (
                <motion.tr
                  key={feature.category}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-border-primary hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-text-primary">{feature.category}</td>
                  <td className="px-6 py-4 text-text-secondary">{feature.description}</td>
                  <td className="px-6 py-4">
                    {feature.savings && (
                      <span className="text-accent-system font-medium">
                        {feature.savings} {t('pricing_comparison:feature_table.value_labels.saved')}
                      </span>
                    )}
                    {feature.additionalRevenue && (
                      <span className="text-accent-human font-medium">
                        +{feature.additionalRevenue}{' '}
                        {t('pricing_comparison:feature_table.value_labels.revenue')}
                      </span>
                    )}
                    {!feature.savings && !feature.additionalRevenue && (
                      <span className="text-text-secondary">
                        {t('pricing_comparison:feature_table.value_labels.included')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-text-secondary">{feature.benefit}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-accent-system/10 border-t-2 border-accent-system/20">
                <td colSpan={2} className="px-6 py-4 font-bold text-text-primary text-lg">
                  {t('pricing_comparison:feature_table.footer.total_platform_value')}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-accent-system text-lg">
                    {totalSavings.toLocaleString()}
                    {t('pricing_comparison:feature_table.footer.saved_label')}
                  </div>
                  <div className="font-bold text-accent-human">
                    +{totalRevenue.toLocaleString()}
                    {t('pricing_comparison:feature_table.footer.revenue_label')}
                  </div>
                </td>
                <td className="px-6 py-4 text-text-secondary">
                  {t('pricing_comparison:feature_table.footer.average_roi')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Value Proposition */}
        <div className="mt-8 card-gradient-border rounded-card bg-accent-system/5 border border-accent-system/20 p-6 text-center transition-all duration-500 hover:bg-accent-system/10">
          <p className="text-xl text-text-primary font-semibold mb-2">
            <Sparkles className="inline w-6 h-6 text-accent-human mr-2" />
            {t('pricing_comparison:feature_table.value_proposition.platform_roi_template', {
              net_gain: (totalSavings + totalRevenue - 15000).toLocaleString(),
            })}
          </p>
          <p className="text-text-secondary">
            {t(
              'pricing_comparison:feature_table.value_proposition.founding_member_explanation_template',
              {
                savings: totalSavings.toLocaleString(),
                revenue: totalRevenue.toLocaleString(),
                total_value: (totalSavings + totalRevenue).toLocaleString(),
              }
            )}
          </p>
        </div>
      </div>
    </section>
  )
}

/**
 * Tool Replacement Comparison Table
 *
 * Shows what traditional tools Future Marketing AI replaces.
 */
export const ToolComparisonTable: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { t } = useTranslation(['pricing_comparison'])

  // Load tool comparison from translations
  const tools = t('pricing_comparison:tool_comparison', { returnObjects: true }) as ToolComparison[]

  const totalTraditionalCost = tools.reduce((acc, item) => {
    const cost = parseInt(item.traditionalCost.replace(/[^0-9]/g, ''))
    return acc + cost
  }, 0)

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
            {t('pricing_comparison:tool_table.title')}
          </h2>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            {t('pricing_comparison:tool_table.subtitle')}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/[0.02] rounded-card overflow-hidden">
            <thead>
              <tr className="bg-white/[0.04]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:tool_table.table_headers.marketing_need')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:tool_table.table_headers.traditional_tools')}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:tool_table.table_headers.traditional_cost')}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-text-primary">
                  {t('pricing_comparison:tool_table.table_headers.future_marketing_ai')}
                </th>
              </tr>
            </thead>
            <tbody>
              {tools.map((item, index) => (
                <motion.tr
                  key={item.need}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-t border-border-primary hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-text-primary">{item.need}</td>
                  <td className="px-6 py-4 text-text-secondary">{item.traditional}</td>
                  <td className="px-6 py-4 text-right text-red-400 font-medium font-mono">
                    {item.traditionalCost}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5 text-accent-system" />
                      <span className="text-accent-system font-medium">
                        {t('pricing_comparison:tool_table.status_labels.included')}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-accent-system/10 border-t-2 border-accent-system/20">
                <td colSpan={2} className="px-6 py-4 font-bold text-text-primary text-lg">
                  {t('pricing_comparison:tool_table.footer.total_monthly_cost')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-bold text-red-400 text-lg font-mono line-through">
                    {totalTraditionalCost.toLocaleString()}/month
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="font-bold text-accent-system text-lg font-mono">15,000/month</div>
                  <div className="text-sm text-text-secondary">
                    {t('pricing_comparison:tool_table.footer.founding_member_rate')}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Savings Highlight */}
        <div className="mt-8 card-gradient-border rounded-card bg-accent-system/5 border border-accent-system/20 p-6 text-center transition-all duration-500 hover:bg-accent-system/10">
          <p className="text-2xl text-text-primary font-bold mb-2">
            {t('pricing_comparison:tool_table.savings_highlight.save_template', {
              savings: (totalTraditionalCost - 15000).toLocaleString(),
            })}
          </p>
          <p className="text-accent-system text-lg font-semibold">
            {t('pricing_comparison:tool_table.savings_highlight.yearly_savings_template', {
              savings: ((totalTraditionalCost - 15000) * 12).toLocaleString(),
            })}
          </p>
          <p className="text-text-secondary mt-2">
            {t('pricing_comparison:tool_table.savings_highlight.unified_system')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default { PricingTable, FeatureComparisonTable, ToolComparisonTable }
