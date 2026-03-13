/**
 * FeatureShowcase Component
 * Lightweight 2D alternative to SystemDiagram for landing page
 * Shows key platform capabilities without heavy 3D rendering
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Brain, Crown, Palette, Send, BarChart3, DollarSign, TrendingUp } from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  translationKey: string
  accentColor: string
}

// Real platform modules from Explorer (src/config/platformKnowledge.ts)
const features: Feature[] = [
  {
    icon: <Brain className="h-8 w-8" />,
    translationKey: 'research',
    accentColor: 'text-accent-system',
  },
  {
    icon: <Crown className="h-8 w-8" />,
    translationKey: 'manager',
    accentColor: 'text-accent-human',
  },
  {
    icon: <Palette className="h-8 w-8" />,
    translationKey: 'content',
    accentColor: 'text-accent-system',
  },
  {
    icon: <Send className="h-8 w-8" />,
    translationKey: 'publishing',
    accentColor: 'text-accent-human',
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    translationKey: 'analytics',
    accentColor: 'text-accent-system',
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    translationKey: 'ads',
    accentColor: 'text-accent-human',
  },
]

export const FeatureShowcase: React.FC = () => {
  const { t } = useTranslation('common')
  return (
    <div className="relative">
      {/* Grid of feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {features.map((feature, index) => {
          const title = t(`landing.features.showcase.${feature.translationKey}.title`)
          const description = t(`landing.features.showcase.${feature.translationKey}.description`)
          const stat = t(`landing.features.showcase.${feature.translationKey}.stat`)

          return (
            <motion.div
              key={feature.translationKey}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative h-full p-6 rounded-sm bg-bg-surface border border-border-primary hover:border-accent-system/40 transition-all duration-300 overflow-hidden">
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-accent-system opacity-0 group-hover:opacity-5 transition-opacity duration-300" />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 rounded-sm bg-bg-elevated border border-border-primary ${feature.accentColor}`}
                  >
                    {feature.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold text-text-primary group-hover:text-accent-system transition-all duration-300">
                    {title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-text-muted leading-relaxed">{description}</p>

                  {/* Stat badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-accent-system/10 border border-accent-system/20">
                    <span className="text-xs font-semibold text-accent-system">{stat}</span>
                  </div>
                </div>

                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-accent-system/10 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Total savings callout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-sm bg-bg-surface border border-border-primary">
          <TrendingUp className="h-6 w-6 text-green-400" />
          <div className="text-left">
            <div className="text-sm text-text-secondary font-medium">
              {t('landing.features.total_value.label')}
            </div>
            <div className="text-2xl font-bold text-text-primary">
              {t('landing.features.total_value.amount')}
            </div>
          </div>
        </div>
        <p className="mt-4 text-sm text-text-muted">
          {t('landing.features.total_value.description')}
        </p>
      </motion.div>
    </div>
  )
}
