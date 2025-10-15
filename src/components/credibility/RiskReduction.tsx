import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Shield, MessageSquare, Wrench, Rocket } from 'lucide-react'
import { GlassCard } from '../common/GlassCard'

interface RiskReductionProps {
  className?: string
}

interface Guarantee {
  icon: React.ReactNode
  title: string
  description: string
  highlight?: string
}

/**
 * RiskReduction - Transparent Early-Stage Commitments
 *
 * Realistic guarantees for a pre-launch, custom-built platform.
 * Focus on partnership and commitment, not unrealistic promises.
 */
export const RiskReduction = memo(function RiskReduction({ className = '' }: RiskReductionProps) {
  const { t } = useTranslation('common')

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const guarantees: Guarantee[] = useMemo(
    () => [
      {
        icon: <Shield className="w-6 h-6" />,
        title: t('risk_reduction.guarantees.success.title'),
        description: t('risk_reduction.guarantees.success.description'),
        highlight: t('risk_reduction.guarantees.success.highlight'),
      },
      {
        icon: <MessageSquare className="w-6 h-6" />,
        title: t('risk_reduction.guarantees.partnership.title'),
        description: t('risk_reduction.guarantees.partnership.description'),
        highlight: t('risk_reduction.guarantees.partnership.highlight'),
      },
      {
        icon: <Wrench className="w-6 h-6" />,
        title: t('risk_reduction.guarantees.custom.title'),
        description: t('risk_reduction.guarantees.custom.description'),
        highlight: t('risk_reduction.guarantees.custom.highlight'),
      },
      {
        icon: <Rocket className="w-6 h-6" />,
        title: t('risk_reduction.guarantees.trial.title'),
        description: t('risk_reduction.guarantees.trial.description'),
        highlight: t('risk_reduction.guarantees.trial.highlight'),
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
        <div className="inline-block px-4 py-2 mb-4 rounded-full bg-accent-primary/10 border border-accent-primary/30">
          <span className="text-sm font-semibold text-accent-primary uppercase tracking-wider">
            {t('risk_reduction.badge')}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          {t('risk_reduction.title')}
        </h2>
        <p className="text-xl text-white/90 max-w-2xl mx-auto">{t('risk_reduction.subtitle')}</p>
      </motion.header>

      {/* Guarantees Grid */}
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto" role="list">
        {guarantees.map((guarantee, index) => (
          <motion.li
            key={guarantee.title}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={
              prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: index * 0.1 }
            }
          >
            <GlassCard className="p-6 h-full hover-lift group" glow>
              {/* Icon */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="p-3 rounded-xl bg-success/10 border border-success/30 text-success group-hover:scale-110 transition-transform"
                  aria-hidden="true"
                >
                  {guarantee.icon}
                </div>
                <h3 className="text-xl font-bold text-text-primary">{guarantee.title}</h3>
              </div>

              {/* Description */}
              <p className="text-white/80 leading-relaxed mb-3">{guarantee.description}</p>

              {/* Highlight */}
              {guarantee.highlight && (
                <div className="pt-3 border-t border-white/10">
                  <p className="text-sm font-semibold text-success">{guarantee.highlight}</p>
                </div>
              )}
            </GlassCard>
          </motion.li>
        ))}
      </ul>

      {/* Bottom Message */}
      <motion.div
        className="mt-8 text-center"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.4 }}
      >
        <p
          className="text-white/70 max-w-3xl mx-auto"
          dangerouslySetInnerHTML={{ __html: t('risk_reduction.footer_message') }}
        />
      </motion.div>

      {/* Transparency Note */}
      <motion.div
        className="mt-6 text-center"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.5 }}
      >
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <span className="text-xs text-white/80">
            💡 <strong className="text-white">Fully Custom:</strong> Every system is built from
            scratch for your specific needs - not a template
          </span>
        </div>
      </motion.div>
    </div>
  )
})
