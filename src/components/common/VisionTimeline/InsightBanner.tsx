import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'

// ============================================================================
// Component
// ============================================================================

export const InsightBanner: React.FC = () => {
  const { t } = useTranslation(['hero'])

  return (
    <motion.aside
      className="
        relative max-w-4xl mx-auto p-6 md:p-8 rounded-2xl
        bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-red-500/10
        border-2 border-amber-500/30
        backdrop-blur-xl
      "
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      role="complementary"
      aria-label={t('common:accessibility.insight_about_adoption')}
    >
      {/* Lightbulb icon */}
      <div
        className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
        role="img"
        aria-label={t('common:accessibility.insight_icon')}
      >
        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
        </svg>
      </div>

      {/* Content */}
      <div className="text-center pt-4">
        <p className="text-base md:text-lg text-white/90 mb-2">
          {t(
            'hero:vision_timeline.insight',
            'Teams that adopted AI-assisted tools early (2020-2022) gained 3-5 years on competitors.'
          )}
        </p>
        <p className="text-lg md:text-xl font-bold text-amber-300 mb-1">
          {t(
            'hero:vision_timeline.insight_emphasis',
            'The SAME 2-year window exists NOW (end 2025) for autonomous.'
          )}
        </p>
        <p className="text-sm text-amber-200/80">
          {t(
            'hero:vision_timeline.insight_data',
            '<1% have this today. Mainstream hits 2027-2028. Act now = 2-3 year unfair advantage.'
          )}
        </p>
      </div>

      {/* Decorative glow */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/5 to-orange-500/5 pointer-events-none"
        role="presentation"
        aria-hidden="true"
      />
    </motion.aside>
  )
}
