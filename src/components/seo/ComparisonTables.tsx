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
import { Check, X, Sparkles } from 'lucide-react'

/**
 * Early Adopter Pricing Tiers
 * Source: src/config/platformKnowledge.ts, src/services/llmService.ts
 */
export const PRICING_TIERS = [
  {
    name: 'Founding Member',
    price: '€15,000',
    period: '/month',
    savings: '€120,000 saved vs Standard',
    slots: '2 of 5 remaining',
    urgency: 'high',
    features: [
      'All 6 Core AI Modules',
      'Rate locked for 24 months',
      '2 months completely FREE',
      'Roadmap influence priority',
      'Dedicated success manager',
      'Priority support (2h response)',
      '42% discount vs Standard rate',
    ],
    badge: '🏆 Best Value',
    badgeColor: 'gold',
  },
  {
    name: 'Pioneer',
    price: '€17,500',
    period: '/month',
    savings: '€60,000 saved vs Standard',
    slots: '4 of 10 remaining',
    urgency: 'medium',
    features: [
      'All 6 Core AI Modules',
      'Rate locked for 24 months',
      '1 month completely FREE',
      'Roadmap feedback channel',
      'Priority support (4h response)',
      '22% discount vs Standard rate',
    ],
    badge: '💎 Popular',
    badgeColor: 'blue',
  },
  {
    name: 'Innovator',
    price: '€20,000',
    period: '/month',
    savings: '€30,000 saved vs Standard',
    slots: '2 of 10 remaining',
    urgency: 'low',
    features: [
      'All 6 Core AI Modules',
      'Rate locked for 12 months',
      'Roadmap access',
      'Standard support (8h response)',
      '11% discount vs Standard rate',
    ],
    badge: '🚀 Limited',
    badgeColor: 'purple',
  },
  {
    name: 'Standard',
    price: '€22,500',
    period: '/month',
    savings: null,
    slots: 'Unlimited availability',
    urgency: null,
    features: [
      'All 6 Core AI Modules',
      'Month-to-month pricing',
      'Standard support (12h response)',
    ],
    badge: null,
    badgeColor: null,
  },
] as const

/**
 * Core Platform Features
 * Source: src/config/platformKnowledge.ts
 */
export const PLATFORM_FEATURES = [
  {
    category: 'AI Research & Planning',
    description: 'Analyzes trends 24/7',
    savings: '€6,400/month',
    benefit: 'Never miss market opportunities',
  },
  {
    category: 'Manager Orchestrator',
    description: 'Coordinates all workflows',
    savings: '€12,000/month',
    benefit: 'Zero manual coordination needed',
  },
  {
    category: 'Content Pipelines',
    description: '15x faster content creation',
    savings: '€8,000/month',
    benefit: 'Scale content without hiring',
  },
  {
    category: 'Smart Publishing',
    description: '35% better engagement',
    additionalRevenue: '€15,000/month',
    benefit: 'Optimized multi-channel distribution',
  },
  {
    category: 'Self-Learning Analytics',
    description: '23% monthly improvement',
    benefit: 'Platform gets smarter over time',
  },
  {
    category: 'Ad Automation',
    description: '3.2x better ROAS',
    additionalRevenue: '€45,000/month',
    benefit: 'Maximize advertising ROI',
  },
] as const

/**
 * Traditional Tools vs Future Marketing AI
 */
export const TOOL_COMPARISON = [
  {
    need: 'Content Creation',
    traditional: 'Jasper + Copy.ai + Writesonic',
    traditionalCost: '€300/month',
    futureMarketing: 'Included (AI Content Pipelines)',
    included: true,
  },
  {
    need: 'Social Media Management',
    traditional: 'Hootsuite Enterprise',
    traditionalCost: '€600/month',
    futureMarketing: 'Included (Smart Publishing)',
    included: true,
  },
  {
    need: 'Analytics & Reporting',
    traditional: 'Google Analytics 360',
    traditionalCost: '€12,500/month',
    futureMarketing: 'Included (Self-Learning Analytics)',
    included: true,
  },
  {
    need: 'Ad Management',
    traditional: 'AdEspresso + Smartly.io',
    traditionalCost: '€1,200/month',
    futureMarketing: 'Included (Ad Automation)',
    included: true,
  },
  {
    need: 'Marketing Automation',
    traditional: 'HubSpot Enterprise',
    traditionalCost: '€3,600/month',
    futureMarketing: 'Included (Manager Orchestrator)',
    included: true,
  },
  {
    need: 'Market Research',
    traditional: 'SEMrush + Ahrefs + BuzzSumo',
    traditionalCost: '€800/month',
    futureMarketing: 'Included (AI Research & Planning)',
    included: true,
  },
  {
    need: 'Agency Labor (3 FTEs)',
    traditional: 'Full-service agency',
    traditionalCost: '€7,000/month',
    futureMarketing: 'Automated workflows',
    included: true,
  },
] as const

interface PricingTableProps {
  /** Show Early Adopter urgency indicators */
  showUrgency?: boolean
  /** Highlight a specific tier (by index) */
  highlightTier?: number
  className?: string
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
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Early Adopter Pricing</h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Lock in founding rates and save up to €120,000 vs standard pricing. Limited slots
            available.
          </p>
        </div>

        {/* Desktop: Grid Layout */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-6">
          {PRICING_TIERS.map((tier, index) => (
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
                {tier.features.map((feature) => (
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
                  {index === 3 ? 'Coming Soon' : 'Secure Slot'}
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
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Tier</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Price</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Savings</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-white">Slots</th>
              </tr>
            </thead>
            <tbody>
              {PRICING_TIERS.map((tier) => (
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
  const totalSavings = PLATFORM_FEATURES.reduce((acc, feature) => {
    const savings = feature.savings ? parseInt(feature.savings.replace(/[^0-9]/g, '')) : 0
    return acc + savings
  }, 0)

  const totalRevenue = PLATFORM_FEATURES.reduce((acc, feature) => {
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
            The Complete AI Marketing System
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-6">
            6 AI modules working together to save you €{totalSavings.toLocaleString()}/month and
            generate €{totalRevenue.toLocaleString()}/month in additional revenue.
          </p>
        </div>

        {/* Semantic Table for LLM extraction */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Module</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">Capability</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Monthly Value
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Key Benefit
                </th>
              </tr>
            </thead>
            <tbody>
              {PLATFORM_FEATURES.map((feature, index) => (
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
                      <span className="text-green-400 font-medium">{feature.savings} saved</span>
                    )}
                    {feature.additionalRevenue && (
                      <span className="text-purple-400 font-medium">
                        +{feature.additionalRevenue} revenue
                      </span>
                    )}
                    {!feature.savings && !feature.additionalRevenue && (
                      <span className="text-blue-100">Included</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-blue-100">{feature.benefit}</td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-t-2 border-white/20">
                <td colSpan={2} className="px-6 py-4 font-bold text-white text-lg">
                  Total Platform Value
                </td>
                <td className="px-6 py-4">
                  <div className="font-bold text-green-400 text-lg">
                    €{totalSavings.toLocaleString()}/mo saved
                  </div>
                  <div className="font-bold text-purple-400">
                    +€{totalRevenue.toLocaleString()}/mo revenue
                  </div>
                </td>
                <td className="px-6 py-4 text-blue-100">847% average ROI</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Value Proposition */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl text-center">
          <p className="text-xl text-white font-semibold mb-2">
            <Sparkles className="inline w-6 h-6 text-yellow-400 mr-2" />
            Platform ROI: €{(totalSavings + totalRevenue - 15000).toLocaleString()}/month net gain
          </p>
          <p className="text-blue-100">
            At Founding Member pricing (€15,000/month), you're saving €
            {totalSavings.toLocaleString()} + generating €{totalRevenue.toLocaleString()} = €
            {(totalSavings + totalRevenue).toLocaleString()} total value
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
  const totalTraditionalCost = TOOL_COMPARISON.reduce((acc, item) => {
    const cost = parseInt(item.traditionalCost.replace(/[^0-9]/g, ''))
    return acc + cost
  }, 0)

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Replace 10+ Tools with One Platform
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Stop paying for fragmented tools. Future Marketing AI replaces your entire marketing
            stack.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white/5 backdrop-blur-sm rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-white/10">
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Marketing Need
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-white">
                  Traditional Tools
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-white">
                  Traditional Cost
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-white">
                  Future Marketing AI
                </th>
              </tr>
            </thead>
            <tbody>
              {TOOL_COMPARISON.map((item, index) => (
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
                    {item.included ? (
                      <div className="flex items-center justify-center gap-2">
                        <Check className="w-5 h-5 text-green-400" />
                        <span className="text-green-400 font-medium">Included</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <X className="w-5 h-5 text-red-400" />
                        <span className="text-red-400">Not included</span>
                      </div>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gradient-to-r from-red-500/20 to-green-500/20 border-t-2 border-white/20">
                <td colSpan={2} className="px-6 py-4 font-bold text-white text-lg">
                  Total Monthly Cost
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="font-bold text-red-400 text-lg line-through">
                    €{totalTraditionalCost.toLocaleString()}/month
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="font-bold text-green-400 text-lg">€15,000/month</div>
                  <div className="text-sm text-blue-100">(Founding Member rate)</div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Savings Highlight */}
        <div className="mt-8 p-6 bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl text-center">
          <p className="text-2xl text-white font-bold mb-2">
            💰 Save €{(totalTraditionalCost - 15000).toLocaleString()}/month
          </p>
          <p className="text-green-400 text-lg font-semibold">
            That's €{((totalTraditionalCost - 15000) * 12).toLocaleString()}/year in immediate
            savings
          </p>
          <p className="text-blue-100 mt-2">
            Plus you get a unified, autonomous system that becomes smarter over time.
          </p>
        </div>
      </div>
    </section>
  )
}

export default { PricingTable, FeatureComparisonTable, ToolComparisonTable }
