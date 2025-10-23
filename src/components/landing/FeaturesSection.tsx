/**
 * Features Overview Section
 *
 * Comprehensive showcase of platform capabilities with benefits and use cases.
 * Based on the 6 core AI modules from the demo.
 *
 * @see src/config/platformKnowledge.ts for feature details
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Brain,
  Settings,
  Zap,
  Send,
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react'

/**
 * Core platform features based on the 6 AI modules
 */
const FEATURE_KEYS = [
  { key: 'research', icon: Brain },
  { key: 'manager', icon: Settings },
  { key: 'content', icon: Zap },
  { key: 'publishing', icon: Send },
  { key: 'analytics', icon: BarChart3 },
  { key: 'ads', icon: Target },
] as const

interface FeaturesSectionProps {
  /** Show compact version (fewer details) */
  compact?: boolean
  className?: string
}

/**
 * Features Overview Section Component
 *
 * Displays comprehensive platform capabilities with benefits and use cases.
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  compact = false,
  className = '',
}) => {
  const { t } = useTranslation('common')

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-100">Complete Marketing OS</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            6 AI Modules, One Autonomous System
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Each module works independently while the Manager Orchestrator ensures perfect
            coordination. The result: a marketing system that runs itself.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {FEATURE_KEYS.map((feature, index) => {
            const Icon = feature.icon
            const name = t(`landing.features.detailed.${feature.key}.name`)
            const tagline = t(`landing.features.detailed.${feature.key}.tagline`)
            const description = t(`landing.features.detailed.${feature.key}.description`)
            const benefits = t(`landing.features.detailed.${feature.key}.benefits`, {
              returnObjects: true,
            }) as string[]
            const useCases = t(`landing.features.detailed.${feature.key}.useCases`, {
              returnObjects: true,
            }) as string[]

            return (
              <motion.div
                key={feature.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title & Tagline */}
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {name}
                </h3>
                <p className="text-purple-300 font-semibold mb-4">{tagline}</p>

                {/* Description */}
                <p className="text-blue-100 leading-relaxed mb-6">{description}</p>

                {/* Benefits */}
                {!compact && (
                  <>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Key Benefits
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-blue-100 flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Use Cases */}
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Use Cases
                    </h4>
                    <ul className="space-y-2">
                      {useCases.map((useCase, i) => (
                        <li key={i} className="text-xs text-blue-100/80">
                          • {useCase}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Value Stack Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">The Complete Package</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">€39,000</div>
              <div className="text-sm text-blue-100">
                Retail value - verified by 2025 market research
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">€24,000</div>
              <div className="text-sm text-blue-100">Monthly savings at Founding Member rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">€288k</div>
              <div className="text-sm text-blue-100">
                Year 1 total savings (incl. 2 free months)
              </div>
            </div>
          </div>
          <p className="text-lg text-white font-semibold mb-4">
            Founding Member pricing: €15,000/month for €39,000 in enterprise automation (62%
            discount)
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <Clock className="w-5 h-5 mr-2" />
              Try All Modules Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
