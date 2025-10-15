import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Search, Wrench, CheckCircle } from 'lucide-react'
import { GlassCard } from '../common/GlassCard'

interface CustomBuildProcessProps {
  className?: string
}

interface ProcessStep {
  number: string
  icon: React.ReactNode
  title: string
  description: string
}

/**
 * CustomBuildProcess - Visualize the Custom-Built Approach
 *
 * Shows the 3-step process: Discovery → Custom Build → Zero Compromises
 * Emphasizes that the solution is built FOR the client, not BY them.
 */
export const CustomBuildProcess = memo(function CustomBuildProcess({
  className = '',
}: CustomBuildProcessProps) {
  const { t } = useTranslation('common')

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const processSteps: ProcessStep[] = useMemo(
    () => [
      {
        number: '1',
        icon: <Search className="w-8 h-8" />,
        title: t('custom_build.steps.discovery.title'),
        description: t('custom_build.steps.discovery.description'),
      },
      {
        number: '2',
        icon: <Wrench className="w-8 h-8" />,
        title: t('custom_build.steps.custom_build.title'),
        description: t('custom_build.steps.custom_build.description'),
      },
      {
        number: '3',
        icon: <CheckCircle className="w-8 h-8" />,
        title: t('custom_build.steps.zero_compromises.title'),
        description: t('custom_build.steps.zero_compromises.description'),
      },
    ],
    [t]
  )

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <motion.header
        className="text-center mb-12"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
      >
        <div className="inline-block px-4 py-2 mb-4 rounded-full bg-accent-gold/10 border border-accent-gold/30">
          <span className="text-sm font-semibold text-accent-gold uppercase tracking-wider">
            {t('custom_build.badge')}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          {t('custom_build.title')}
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">{t('custom_build.subtitle')}</p>
      </motion.header>

      {/* Process Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {processSteps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: index * 0.15 }
            }
          >
            <GlassCard className="p-8 h-full hover-lift group relative" glow>
              {/* Step Number Badge */}
              <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent-gold/20 border border-accent-gold/40 flex items-center justify-center">
                <span className="text-lg font-bold text-accent-gold">{step.number}</span>
              </div>

              {/* Icon */}
              <div className="mb-6">
                <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 border border-accent-primary/30 text-accent-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  {step.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-text-primary mb-3">{step.title}</h3>

              {/* Description */}
              <p className="text-white/80 leading-relaxed text-lg">{step.description}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* Bottom Message */}
      <motion.div
        className="mt-12 text-center"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.5 }}
      >
        <GlassCard className="p-6 max-w-4xl mx-auto border-accent-gold/30">
          <p
            className="text-white/90 text-lg"
            dangerouslySetInnerHTML={{ __html: t('custom_build.footer_message') }}
          />
        </GlassCard>
      </motion.div>
    </div>
  )
})
