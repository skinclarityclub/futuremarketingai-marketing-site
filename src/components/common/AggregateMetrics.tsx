import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { AnimatedMetric } from './AnimatedMetric'

// ============================================================================
// Types
// ============================================================================

export interface AggregateMetric {
  id: string
  value: number
  suffix?: string
  prefix?: string
  label: string
  painLabel: string // Pain-first description
  variant: 'success' | 'primary' | 'secondary'
  icon: React.ReactNode
}

interface AggregateMetricsProps {
  metrics: AggregateMetric[]
  title?: string
  subtitle?: string
  className?: string
}

// ============================================================================
// Component
// ============================================================================

export function AggregateMetrics({
  metrics,
  title,
  subtitle,
  className = '',
}: AggregateMetricsProps) {
  const { t } = useTranslation(['common'])

  // Use translations as fallback if props not provided
  const finalTitle = title || t('common:aggregate_metrics.title')
  const finalSubtitle = subtitle || t('common:aggregate_metrics.subtitle')
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{finalTitle}</h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">{finalSubtitle}</p>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
      >
        {metrics.map((metric, index) => (
          <motion.div key={metric.id} variants={itemVariants} className="relative group">
            {/* Card */}
            <div className="relative h-full p-8 rounded-2xl bg-gradient-to-br from-background-secondary/80 via-background-secondary/60 to-background-secondary/40 backdrop-blur-xl border border-white/10 overflow-hidden transition-all duration-500 hover:border-white/20 hover:scale-105">
              {/* Animated Gradient Background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${
                    metric.variant === 'success'
                      ? 'rgba(0, 255, 136, 0.15)'
                      : metric.variant === 'primary'
                        ? 'rgba(0, 212, 255, 0.15)'
                        : 'rgba(138, 43, 226, 0.15)'
                  }, transparent 70%)`,
                }}
              />

              {/* Content */}
              <div className="relative z-10">
                {/* Icon */}
                <motion.div
                  className="w-16 h-16 mb-6 flex items-center justify-center rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10"
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                >
                  <div
                    className={`text-3xl ${
                      metric.variant === 'success'
                        ? 'text-success'
                        : metric.variant === 'primary'
                          ? 'text-accent-primary'
                          : 'text-accent-secondary'
                    }`}
                  >
                    {metric.icon}
                  </div>
                </motion.div>

                {/* Animated Counter */}
                <AnimatedMetric
                  value={metric.value}
                  prefix={metric.prefix}
                  suffix={metric.suffix}
                  variant={metric.variant}
                  duration={2}
                  delay={index * 0.2}
                  className="mb-4"
                />

                {/* Label */}
                <h3 className="text-lg font-semibold text-text-primary mb-3">{metric.label}</h3>

                {/* Pain-First Description */}
                <div className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 text-accent-primary flex-shrink-0 mt-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-white/80 leading-relaxed">{metric.painLabel}</p>
                </div>
              </div>

              {/* Glow Effect */}
              <div
                className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 ${
                  metric.variant === 'success'
                    ? 'bg-success'
                    : metric.variant === 'primary'
                      ? 'bg-accent-primary'
                      : 'bg-accent-secondary'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
