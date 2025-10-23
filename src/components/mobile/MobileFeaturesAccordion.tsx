/**
 * MobileFeaturesAccordion Component
 *
 * Mobile-optimized features section using progressive disclosure pattern.
 * Features:
 * - Accordion/expandable cards for 6 core AI modules
 * - 80/20 rule: Essential info visible, details on demand
 * - Large touch targets (≥48px)
 * - Smooth animations
 * - Accessibility-first design
 *
 * Usage:
 * ```tsx
 * <MobileFeaturesAccordion />
 * ```
 */

import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import {
  Brain,
  Settings,
  Zap,
  Send,
  BarChart3,
  Target,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react'
import { AccordionItem, Accordion } from '../common/AccordionItem'

/**
 * Core platform features based on the 6 AI modules
 */
const FEATURE_KEYS = [
  { key: 'research', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  { key: 'manager', icon: Settings, color: 'from-purple-500 to-pink-500' },
  { key: 'content', icon: Zap, color: 'from-yellow-500 to-orange-500' },
  { key: 'publishing', icon: Send, color: 'from-green-500 to-emerald-500' },
  { key: 'analytics', icon: BarChart3, color: 'from-indigo-500 to-blue-500' },
  { key: 'ads', icon: Target, color: 'from-red-500 to-pink-500' },
] as const

interface MobileFeaturesAccordionProps {
  /** Custom className */
  className?: string
}

export const MobileFeaturesAccordion: React.FC<MobileFeaturesAccordionProps> = ({
  className = '',
}) => {
  const { t } = useTranslation('common')

  return (
    <section className={`py-12 px-6 ${className}`}>
      {/* Section Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-100">
            {t('landing.features.complete_marketing_os', 'Complete Marketing OS')}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-white mb-3"
        >
          {t('landing.features.six_modules_title', '6 AI Modules, One System')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-blue-100/80 text-sm leading-relaxed"
        >
          {t(
            'landing.features.autonomous_subtitle',
            'Each module works independently while the Manager Orchestrator ensures perfect coordination.'
          )}
        </motion.p>
      </div>

      {/* Accordion for Features */}
      <Accordion spacing="normal">
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <AccordionItem
                title={name}
                icon={
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-md`}
                  >
                    <Icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                }
              >
                {/* Tagline */}
                <p className="text-purple-300 font-semibold mb-3 text-sm">{tagline}</p>

                {/* Description */}
                <p className="text-blue-100 leading-relaxed mb-4 text-sm">{description}</p>

                {/* Benefits */}
                <div className="mb-4">
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    {t('landing.features.key_benefits', 'Key Benefits')}
                  </h4>
                  <ul className="space-y-2">
                    {benefits.map((benefit, i) => (
                      <li key={i} className="text-sm text-blue-100 flex items-start gap-2">
                        <span className="text-green-400 mt-0.5 flex-shrink-0">✓</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases */}
                <div>
                  <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    {t('landing.features.use_cases', 'Use Cases')}
                  </h4>
                  <ul className="space-y-1.5">
                    {useCases.map((useCase, i) => (
                      <li key={i} className="text-xs text-blue-100/80 flex items-start gap-2">
                        <span className="text-blue-400 mt-0.5 flex-shrink-0">•</span>
                        <span>{useCase}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </AccordionItem>
            </motion.div>
          )
        })}
      </Accordion>

      {/* Bottom Hint */}
      <div className="text-center mt-8">
        <p className="text-blue-200/50 text-xs">
          {t('common:landing.features.tap_hint', 'Tap any module to explore details')}
        </p>
      </div>
    </section>
  )
}

export default MobileFeaturesAccordion
