import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Brain, Sparkles, TrendingUp, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '../common/GlassCard'

interface VisionSectionProps {
  className?: string
}

interface Era {
  year: string
  label: string
  description: string
  icon: React.ReactNode
  isCurrent?: boolean
}

/**
 * VisionSection - Vision-Selling for Pre-Launch
 *
 * Sells the FUTURE, not past results. Perfect for early adopters who want
 * to be ahead of the curve. Shows timeline from AI-Assisted → Autonomous → Standard.
 */
export const VisionSection = memo(function VisionSection({ className = '' }: VisionSectionProps) {
  const { t } = useTranslation(['common'])
  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const eras: Era[] = useMemo(
    () => [
      {
        year: t('vision.eras.ai_assisted.year'),
        label: t('vision.eras.ai_assisted.label'),
        description: t('vision.eras.ai_assisted.description'),
        icon: <Brain className="w-5 h-5" />,
      },
      {
        year: t('vision.eras.autonomous.year'),
        label: t('vision.eras.autonomous.label'),
        description: t('vision.eras.autonomous.description'),
        icon: <Sparkles className="w-5 h-5" />,
        isCurrent: true,
      },
      {
        year: t('vision.eras.standard.year'),
        label: t('vision.eras.standard.label'),
        description: t('vision.eras.standard.description'),
        icon: <TrendingUp className="w-5 h-5" />,
      },
    ],
    [t]
  )

  return (
    <div className={`relative py-20 ${className}`}>
      {/* Header */}
      <motion.header
        className="text-center mb-16"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
      >
        <div className="inline-block px-4 py-2 mb-4 rounded-full bg-accent-primary/10 border border-accent-primary/30">
          <span className="text-sm font-semibold text-accent-primary uppercase tracking-wider">
            {t('vision.badge')}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">{t('vision.title')}</h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">
          {t('vision.subtitle_line1')}
          <br />
          <span dangerouslySetInnerHTML={{ __html: t('vision.subtitle_line2') }} />
        </p>
      </motion.header>

      {/* Timeline */}
      <div className="max-w-6xl mx-auto mb-12">
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-6" role="list">
          {eras.map((era, index) => (
            <motion.li
              key={era.year}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: index * 0.15 }
              }
            >
              <GlassCard
                className={`
                  p-6 h-full relative
                  ${era.isCurrent ? 'ring-2 ring-accent-primary shadow-2xl shadow-accent-primary/20' : ''}
                `}
                glow={era.isCurrent}
              >
                {/* Current Badge */}
                {era.isCurrent && (
                  <div className="absolute -top-3 -right-3">
                    <motion.div
                      className="px-3 py-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary text-white text-xs font-bold shadow-lg"
                      animate={
                        prefersReducedMotion
                          ? {}
                          : {
                              scale: [1, 1.05, 1],
                            }
                      }
                      transition={
                        prefersReducedMotion
                          ? { duration: 0 }
                          : {
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'reverse',
                            }
                      }
                      aria-label={t('common:accessibility.current_stage')}
                    >
                      ← You Are Here
                    </motion.div>
                  </div>
                )}

                {/* Icon */}
                <div
                  className={`
                    p-3 rounded-xl mb-4 w-fit
                    ${
                      era.isCurrent
                        ? 'bg-accent-primary/20 border-2 border-accent-primary text-accent-primary'
                        : 'border border-white/10 text-white/70'
                    }
                  `}
                  style={!era.isCurrent ? { background: 'rgba(0, 0, 0, 0.3)' } : undefined}
                  aria-hidden="true"
                >
                  {era.icon}
                </div>

                {/* Year */}
                <div
                  className={`
                  text-2xl font-bold mb-2
                  ${era.isCurrent ? 'text-accent-primary' : 'text-white/70'}
                `}
                >
                  {era.year}
                </div>

                {/* Label */}
                <h3 className="text-xl font-bold text-text-primary mb-2">{era.label}</h3>

                {/* Description */}
                <p className="text-sm text-white/70 leading-relaxed">{era.description}</p>

                {/* Early Adopter Tag for Current Era */}
                {era.isCurrent && (
                  <div className="mt-4 pt-4 border-t border-accent-primary/30">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-accent-primary" />
                      <span className="text-xs font-semibold text-accent-primary uppercase tracking-wider">
                        {t('vision.early_adopter_tag')}
                      </span>
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Insight Box */}
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <GlassCard className="p-6 md:p-8">
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-xl bg-accent-primary/10 border border-accent-primary/30 flex-shrink-0"
              aria-hidden="true"
            >
              <Sparkles className="w-6 h-6 text-accent-primary" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-primary mb-3">
                {t('vision.insight_title')}
              </h3>
              <div className="space-y-2 text-white/80 leading-relaxed">
                <p dangerouslySetInnerHTML={{ __html: t('vision.insight_salesforce') }} />
                <p dangerouslySetInnerHTML={{ __html: t('vision.insight_ai_tools') }} />
                <p className="text-lg font-semibold text-accent-primary pt-2">
                  {t('vision.insight_moment')}
                </p>
              </div>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-12 text-center"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.6 }}
      >
        <p
          className="text-white/70 max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: t('vision.cta_message') }}
        />
      </motion.div>
    </div>
  )
})
