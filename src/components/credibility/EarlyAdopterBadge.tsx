import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Rocket, Users, Zap, Target } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '../common/GlassCard'

interface EarlyAdopterBadgeProps {
  variant?: 'hero' | 'inline' | 'floating'
  showProgress?: boolean
  className?: string
}

/**
 * EarlyAdopterBadge - Transparent Pre-Launch Positioning
 *
 * Shows real founding teams launching Q1 2026 with transparent scarcity messaging.
 * NO fake social proof - uses honest "3 founding teams, 7 spots remaining" approach.
 */
export const EarlyAdopterBadge = memo(function EarlyAdopterBadge({
  variant = 'inline',
  showProgress = true,
  className = '',
}: EarlyAdopterBadgeProps) {
  const { t } = useTranslation(['common'])
  const foundingTeams = 3
  const totalSpots = 10
  const spotsRemaining = totalSpots - foundingTeams

  const isHero = variant === 'hero'
  const isFloating = variant === 'floating'

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  // Pre-calculate className to avoid re-computing on every render
  const cardClassName = useMemo(
    () => `
      relative overflow-hidden
      ${isHero ? 'p-8' : 'p-6'}
      ${isFloating ? 'shadow-2xl shadow-accent-primary/20' : ''}
    `,
    [isHero, isFloating]
  )

  return (
    <motion.div
      className={`relative ${className}`}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
    >
      <GlassCard className={cardClassName} glow>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-primary via-accent-secondary to-accent-primary" />
        </div>

        <div className="relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="p-2 rounded-lg bg-accent-primary/10 border border-accent-primary/30"
              animate={
                prefersReducedMotion
                  ? {}
                  : {
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, 0],
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
              aria-label={t('common:accessibility.launching_soon')}
            >
              <Rocket className="w-6 h-6 text-accent-primary" aria-hidden="true" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-text-primary">Launching Q1 2026</h3>
              <p className="text-sm text-white/70">Join the founding teams</p>
            </div>
          </div>

          {/* Founding Teams Status */}
          <div
            className="mb-4 p-4 rounded-xl border border-white/10"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-white/90">
                Currently in private beta with:
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success font-semibold">
                Active
              </span>
            </div>

            <ul className="space-y-2 text-sm text-white/80" role="list">
              <li className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"
                  aria-label={t('common:accessibility.active_status')}
                />
                <span>
                  <strong>FutureMarketingAI</strong> - Marketing automation platform
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"
                  aria-label={t('common:accessibility.active_status')}
                />
                <span>
                  <strong>SkinClarity Club</strong> - Online skincare platform
                </span>
              </li>
              <li className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full bg-accent-primary animate-pulse"
                  aria-label={t('common:accessibility.active_status')}
                />
                <span>
                  <strong>Den Hartogh Solutions</strong> - Business solutions
                </span>
              </li>
            </ul>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white/90">Founder Spots</span>
                <span className="text-sm font-bold text-accent-primary">
                  {foundingTeams}/{totalSpots} taken
                </span>
              </div>
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ background: 'rgba(255, 255, 255, 0.1)' }}
                role="progressbar"
                aria-valuenow={foundingTeams}
                aria-valuemin={0}
                aria-valuemax={totalSpots}
                aria-label={`${foundingTeams} out of ${totalSpots} founder spots taken`}
              >
                <motion.div
                  className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
                  initial={
                    prefersReducedMotion
                      ? { width: `${(foundingTeams / totalSpots) * 100}%` }
                      : { width: 0 }
                  }
                  animate={{ width: `${(foundingTeams / totalSpots) * 100}%` }}
                  transition={prefersReducedMotion ? { duration: 0 } : { duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Benefits Grid */}
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4" role="list">
            <li className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-success flex-shrink-0 mt-1" aria-hidden="true" />
              <span
                className="text-sm text-white/90"
                dangerouslySetInnerHTML={{ __html: t('early_adopter_benefits.founder_pricing') }}
              />
            </li>
            <li className="flex items-start gap-2">
              <Target className="w-4 h-4 text-success flex-shrink-0 mt-1" aria-hidden="true" />
              <span
                className="text-sm text-white/90"
                dangerouslySetInnerHTML={{ __html: t('early_adopter_benefits.team_size') }}
              />
            </li>
            <li className="flex items-start gap-2">
              <Users className="w-4 h-4 text-success flex-shrink-0 mt-1" aria-hidden="true" />
              <span
                className="text-sm text-white/90"
                dangerouslySetInnerHTML={{ __html: t('early_adopter_benefits.founder_access') }}
              />
            </li>
            <li className="flex items-start gap-2">
              <Rocket className="w-4 h-4 text-success flex-shrink-0 mt-1" aria-hidden="true" />
              <span
                className="text-sm text-white/90"
                dangerouslySetInnerHTML={{ __html: t('early_adopter_benefits.shape_product') }}
              />
            </li>
          </ul>

          {/* Urgency Message */}
          <div className="p-3 rounded-lg bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/30">
            <p
              className="text-center text-sm font-semibold text-white"
              dangerouslySetInnerHTML={{
                __html: t('slot_progress.spots_remaining_cohort', { count: spotsRemaining }),
              }}
            />
          </div>
        </div>
      </GlassCard>
    </motion.div>
  )
})
