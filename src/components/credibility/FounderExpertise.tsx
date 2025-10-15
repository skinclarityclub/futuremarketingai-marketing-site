import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { Users, TrendingUp, Sparkles, Award } from 'lucide-react'
import { GlassCard } from '../common/GlassCard'

interface FounderExpertiseProps {
  className?: string
}

/**
 * FounderExpertise - Team Authority Without Personal Details
 *
 * Shows team expertise and credibility without requiring personal founder info.
 * Focuses on experience, not individual names/photos. Perfect for pre-launch.
 */
export const FounderExpertise = memo(function FounderExpertise({
  className = '',
}: FounderExpertiseProps) {
  const { t } = useTranslation('common')

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const credentials = useMemo(
    () => [
      {
        icon: <TrendingUp className="w-5 h-5" />,
        label: t('founder_expertise.credentials.experience.label'),
        description: t('founder_expertise.credentials.experience.description'),
      },
      {
        icon: <Users className="w-5 h-5" />,
        label: t('founder_expertise.credentials.founding_teams.label'),
        description: t('founder_expertise.credentials.founding_teams.description'),
      },
      {
        icon: <Sparkles className="w-5 h-5" />,
        label: t('founder_expertise.credentials.early_adopters.label'),
        description: t('founder_expertise.credentials.early_adopters.description'),
      },
      {
        icon: <Award className="w-5 h-5" />,
        label: t('founder_expertise.credentials.operators.label'),
        description: t('founder_expertise.credentials.operators.description'),
      },
    ],
    [t]
  )

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
      >
        <GlassCard className="p-8 max-w-4xl mx-auto" glow>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 mb-4 rounded-full bg-accent-primary/10 border border-accent-primary/30">
              <span className="text-sm font-semibold text-accent-primary uppercase tracking-wider">
                {t('founder_expertise.badge')}
              </span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-text-primary mb-3">
              {t('founder_expertise.title')}
            </h3>
            <p
              className="text-white/80 leading-relaxed max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{ __html: t('founder_expertise.subtitle') }}
            />
          </div>

          {/* Credentials Grid */}
          <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" role="list">
            {credentials.map((credential, index) => (
              <motion.li
                key={credential.label}
                initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: 0.4, delay: 0.2 + index * 0.1 }
                }
                className="text-center p-4 rounded-xl border border-white/10 hover:border-accent-primary/30 transition-all"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                <div className="flex justify-center mb-2 text-accent-primary">
                  {credential.icon}
                </div>
                <div className="text-xl font-bold text-text-primary mb-1">{credential.label}</div>
                <div className="text-xs text-white/70">{credential.description}</div>
              </motion.li>
            ))}
          </ul>

          {/* Expertise Statement */}
          <div className="pt-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <p
                  className="text-sm text-white/80 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t('founder_expertise.expertise_p1') }}
                />
                <p
                  className="text-sm text-white/80 leading-relaxed mt-2"
                  dangerouslySetInnerHTML={{ __html: t('founder_expertise.expertise_p2') }}
                />
              </div>
            </div>
          </div>

          {/* Trust Badge */}
          <div className="mt-6 text-center">
            <p className="text-xs text-white/60">{t('founder_expertise.trust_badge')}</p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  )
})
