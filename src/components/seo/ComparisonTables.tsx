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
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('pricing_comparison:pricing_table.title')}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
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
              className={`relative bg-white/5 backdrop-blur-sm border rounded-xl p-6 ${
                index === highlightTier
                  ? 'border-blue-500 ring-2 ring-blue-500/50'
                  : 'border-white/10'
              }`}
            >
              {/* Badge */}
              {tier.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full shadow-lg">
                    {tier.badge}
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="text-center mt-2">
                <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-white">{tier.price}</span>
                  <span className="text-blue-100">{tier.period}</span>
                </div>
                {tier.savings && (
                  <p className="text-sm text-green-400 mt-2 font-medium">{tier.savings}</p>
                )}
                {showUrgency && tier.urgency && (
                  <p
                    className={`text-sm mt-2 font-medium ${
                      tier.urgency === 'high'
                        ? 'text-red-400'
                        : tier.urgency === 'medium'
                          ? 'text-orange-400'
                          : 'text-yellow-400'
                    }`}
                  >
                    ⏰ {tier.slots}
                  </p>
                )}
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3">
                {tier.features.map((feature: string) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-blue-100">
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <div className="mt-8">
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    index === highlightTier
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                  }`}
                >
                  {index === 3
                    ? t('pricing_comparison:pricing_table.coming_soon')
                    : t('pricing_comparison:pricing_table.secure_slot')}
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile/Tablet: Semantic Table */}
        <div className="lg:hidden overflow-x-auto">
          <table className="w-full border-collapse bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:pricing_table.table_headers.tier')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:pricing_table.table_headers.price')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:pricing_table.table_headers.savings')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:pricing_table.table_headers.slots')}
                </th>
              </tr>
            </thead>
            <tbody>
              {tiers.map((tier: any) => (
                <tr key={tier.name} className="border-t border-white/10">
                  <td className="px-4 py-3 text-white font-medium">{tier.name}</td>
                  <td className="px-4 py-3 text-white">{tier.price}/mo</td>
                  <td className="px-4 py-3 text-green-400 text-sm">{tier.savings || '-'}</td>
                  <td className="px-4 py-3 text-blue-100 text-sm">{tier.slots}</td>
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
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('pricing_comparison:feature_table.title')}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6">
            {t('pricing_comparison:feature_table.subtitle_template', {
              savings: totalSavings.toLocaleString(),
              revenue: totalRevenue.toLocaleString(),
            })}
          </p>
        </div>

        {/* Semantic Table for LLM extraction */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:feature_table.table_headers.module')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:feature_table.table_headers.capability')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:feature_table.table_headers.monthly_value')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
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
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-white">{feature.category}</td>
                  <td className="px-6 py-4 text-blue-100">{feature.description}</td>
                  <td className="px-6 py-4">
                    {feature.savings && (
                      <span className="text-green-400 font-medium">
                        {feature.savings} {t('pricing_comparison:feature_table.value_labels.saved')}
                      </span>
                    )}
                    {feature.additionalRevenue && (
                      <span className="text-purple-400 font-medium">
                        +{feature.additionalRevenue}{' '}
                        {t('pricing_comparison:feature_table.value_labels.revenue')}
                      </span>
                    )}
                    {!feature.savings && !feature.additionalRevenue && (
                      <span className="text-blue-100">
                        {t('pricing_comparison:feature_table.value_labels.included')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-blue-100">{feature.benefit}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-t-2 border-white/20">
                <td colSpan={2} className="px-6 py-4 font-bold text-white text-lg">
                  {t('pricing_comparison:feature_table.footer.total_platform_value')}
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-green-400 text-lg">
                    €{totalSavings.toLocaleString()}
                    {t('pricing_comparison:feature_table.footer.saved_label')}
                  </div>
                  <div className="font-bold text-purple-400">
                    +€{totalRevenue.toLocaleString()}
                    {t('pricing_comparison:feature_table.footer.revenue_label')}
                  </div>
                </td>
                <td className="px-6 py-4 text-blue-100">
                  {t('pricing_comparison:feature_table.footer.average_roi')}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Value Proposition */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl text-center">
          <p className="text-xl text-white font-semibold mb-2">
            <Sparkles className="inline w-6 h-6 text-yellow-400 mr-2" />
            {t('pricing_comparison:feature_table.value_proposition.platform_roi_template', {
              net_gain: (totalSavings + totalRevenue - 15000).toLocaleString(),
            })}
          </p>
          <p className="text-blue-100">
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
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('pricing_comparison:tool_table.title')}
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            {t('pricing_comparison:tool_table.subtitle')}
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:tool_table.table_headers.marketing_need')}
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  {t('pricing_comparison:tool_table.table_headers.traditional_tools')}
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                  {t('pricing_comparison:tool_table.table_headers.traditional_cost')}
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">
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
                  className="border-t border-white/10 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-white">{item.need}</td>
                  <td className="px-6 py-4 text-blue-100">{item.traditional}</td>
                  <td className="px-6 py-4 text-right text-red-400 font-medium">
                    {item.traditionalCost}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Check className="w-5 h-5 text-green-400" />
                      <span className="text-green-400 font-medium">
                        {t('pricing_comparison:tool_table.status_labels.included')}
                      </span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-red-500/20 to-green-500/20 border-t-2 border-white/20">
                <td colSpan={2} className="px-6 py-4 font-bold text-white text-lg">
                  {t('pricing_comparison:tool_table.footer.total_monthly_cost')}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-bold text-red-400 text-lg line-through">
                    €{totalTraditionalCost.toLocaleString()}/month
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="font-bold text-green-400 text-lg">€15,000/month</div>
                  <div className="text-sm text-blue-100">
                    {t('pricing_comparison:tool_table.footer.founding_member_rate')}
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Savings Highlight */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl text-center">
          <p className="text-2xl text-white font-bold mb-2">
            💰{' '}
            {t('pricing_comparison:tool_table.savings_highlight.save_template', {
              savings: (totalTraditionalCost - 15000).toLocaleString(),
            })}
          </p>
          <p className="text-green-400 text-lg font-semibold">
            {t('pricing_comparison:tool_table.savings_highlight.yearly_savings_template', {
              savings: ((totalTraditionalCost - 15000) * 12).toLocaleString(),
            })}
          </p>
          <p className="text-blue-100 mt-2">
            {t('pricing_comparison:tool_table.savings_highlight.unified_system')}
          </p>
        </div>
      </div>
    </section>
  )
}

export default { PricingTable, FeatureComparisonTable, ToolComparisonTable }
