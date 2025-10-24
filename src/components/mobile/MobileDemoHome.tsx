/**
 * MobileDemoHome - Mobile-optimized demo/home page
 *
 * Desktop-first compliant: This is a NEW mobile-only component.
 * Simplified layout with vertical stacking, module cards, and clear CTAs.
 *
 * Requirements:
 * - Remove complex desktop elements
 * - Vertical stacking layout
 * - Module overview cards
 * - Large tap targets (≥48px)
 * - Concise mobile-optimized copy
 * - Analytics tracking
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Sparkles, TrendingUp, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface ModuleCard {
  id: string
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  color: string
}

interface MobileDemoHomeProps {
  className?: string
}

export function MobileDemoHome({ className = '' }: MobileDemoHomeProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  // Module cards - simplified for mobile
  const modules: ModuleCard[] = [
    {
      id: 'explorer',
      title: t('mobile.demo.explorer.title', 'AI Explorer'),
      description: t('mobile.demo.explorer.desc', 'Discover AI insights and trends'),
      icon: Sparkles,
      path: '/explorer',
      color: 'from-purple-500 to-pink-500',
    },
    {
      id: 'calculator',
      title: t('mobile.demo.calculator.title', 'ROI Calculator'),
      description: t('mobile.demo.calculator.desc', 'Calculate your potential savings'),
      icon: TrendingUp,
      path: '/calculator',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      id: 'dashboard',
      title: t('mobile.demo.dashboard.title', 'Dashboard'),
      description: t('mobile.demo.dashboard.desc', 'View analytics and insights'),
      icon: Zap,
      path: '/dashboard',
      color: 'from-green-500 to-emerald-500',
    },
  ]

  const handleModuleClick = (module: ModuleCard) => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'demo_module_click', {
        event_category: 'engagement',
        event_label: `demo_${module.id}`,
        value: 1,
      })
    }

    navigate(module.path)
  }

  const handleExploreClick = () => {
    // Analytics tracking
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'explore_features_click', {
        event_category: 'engagement',
        event_label: 'demo_home_explore_cta',
        value: 1,
      })
    }

    // Scroll to features or navigate
    const featuresSection = document.getElementById('features')
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      className={`relative min-h-screen flex flex-col px-6 py-12 pb-24 ${className}`}
      aria-label="Demo home section"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary -z-10" />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-primary mb-3 leading-tight">
          {t('mobile.demo.title', 'Explore AI Marketing')}
        </h1>
        <p className="text-base text-text-secondary leading-relaxed">
          {t('mobile.demo.subtitle', 'Interactive demos showing the power of AI automation')}
        </p>
      </div>

      {/* Module Cards - Vertical Stack */}
      <div className="flex flex-col gap-4 mb-8">
        {modules.map((module, index) => {
          const Icon = module.icon

          return (
            <motion.button
              key={module.id}
              onClick={() => handleModuleClick(module)}
              className={`
                relative overflow-hidden
                bg-bg-card border border-white/10
                rounded-xl p-6
                text-left
                min-h-[120px]
                touch-manipulation
                group
                hover:border-accent-primary/50
                transition-all duration-200
              `}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              aria-label={`${module.title} - ${module.description}`}
              type="button"
            >
              {/* Gradient overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${module.color} opacity-5 group-hover:opacity-10 transition-opacity`}
              />

              {/* Content */}
              <div className="relative flex items-start gap-4">
                {/* Icon */}
                <div className={`p-3 rounded-lg bg-gradient-to-br ${module.color} flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-text-primary mb-1 group-hover:text-accent-primary transition-colors">
                    {module.title}
                  </h3>
                  <p className="text-sm text-text-secondary line-clamp-2">{module.description}</p>
                </div>

                {/* Arrow indicator */}
                <ArrowRight className="w-5 h-5 text-text-muted group-hover:text-accent-primary group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Explore Features CTA */}
      <motion.button
        onClick={handleExploreClick}
        className="
          w-full h-14 min-h-touch
          bg-gradient-to-r from-accent-primary to-accent-secondary
          hover:from-accent-primary/90 hover:to-accent-secondary/90
          active:scale-[0.98]
          text-white font-semibold rounded-lg
          flex items-center justify-center gap-2
          transition-all duration-200
          shadow-lg hover:shadow-xl
          touch-manipulation
        "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        aria-label={t('mobile.demo.exploreCta', 'Explore All Features')}
        type="button"
      >
        <Sparkles className="w-5 h-5" />
        <span>{t('mobile.demo.exploreCta', 'Explore All Features')}</span>
      </motion.button>

      {/* Trust indicator */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-text-muted">
        <div
          className="w-2 h-2 rounded-full bg-green-400 animate-pulse"
          aria-label="Active status"
        />
        <span>{t('mobile.demo.status', 'Live demos • No signup required')}</span>
      </div>
    </section>
  )
}

MobileDemoHome.displayName = 'MobileDemoHome'
