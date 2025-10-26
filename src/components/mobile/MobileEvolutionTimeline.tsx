/**
 * MobileEvolutionTimeline - Mobile-optimized Evolution of Marketing timeline
 *
 * ✅ DESKTOP-FIRST COMPLIANT
 * - NEW mobile component, desktop VisionTimeline unchanged
 * - Used via conditional rendering on LandingPage
 *
 * ✅ CONTENT PARITY COMPLIANT
 * - Uses EXACT same translation keys (hero:vision_timeline.*)
 * - Same 3 eras (AI-Assisted, Autonomous, Mainstream)
 * - Same data, mobile-optimized layout
 *
 * Mobile Optimizations:
 * - Vertical timeline (not horizontal)
 * - Card-based layout
 * - Touch-friendly spacing
 * - Simplified animations
 */

import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { useRef } from 'react'
import { Sparkles, Zap, TrendingUp } from 'lucide-react'

interface MobileEvolutionTimelineProps {
  className?: string
}

// Era icons
const ERA_ICONS = {
  assisted: Sparkles,
  autonomous: Zap,
  standard: TrendingUp,
}

export function MobileEvolutionTimeline({ className = '' }: MobileEvolutionTimelineProps) {
  const { t } = useTranslation(['hero'])
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  // Build eras from translations (SAME as desktop)
  const eras = [
    {
      id: 'ai-assisted',
      year: t('hero:vision_timeline.eras.ai_assisted.year', '2020-2024'),
      label: t('hero:vision_timeline.eras.ai_assisted.label', 'AI-Assisted Era'),
      description: t(
        'hero:vision_timeline.eras.ai_assisted.description',
        '80% of teams stuck here with ChatGPT/Jasper'
      ),
      icon: ERA_ICONS.assisted,
      status: 'past' as const,
      color: 'from-slate-500 to-slate-600',
    },
    {
      id: 'autonomous',
      year: t('hero:vision_timeline.eras.autonomous.year', '2025-2026'),
      label: t('hero:vision_timeline.eras.autonomous.label', '⚡ Pioneer Window'),
      description: t(
        'hero:vision_timeline.eras.autonomous.description',
        '<1% adoption NOW. First 10 teams building unfair advantage.'
      ),
      icon: ERA_ICONS.autonomous,
      status: 'active' as const,
      color: 'from-blue-500 to-purple-600',
      highlight: true,
    },
    {
      id: 'standard',
      year: t('hero:vision_timeline.eras.mainstream.year', '2027-2028'),
      label: t('hero:vision_timeline.eras.mainstream.label', 'Mainstream Adoption'),
      description: t(
        'hero:vision_timeline.eras.mainstream.description',
        'Everyone has it. Your 2-3 year lead evaporates.'
      ),
      icon: ERA_ICONS.standard,
      status: 'future' as const,
      color: 'from-gray-600 to-gray-700',
    },
  ]

  return (
    <section
      ref={ref}
      className={`relative w-full py-16 px-6 bg-gradient-to-b from-slate-900 to-slate-950 ${className}`}
      aria-label="Evolution of Marketing Timeline"
    >
      {/* Background effects */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm mb-4">
            <Sparkles className="w-4 h-4 text-purple-300" />
            <span className="text-sm font-semibold text-purple-300">
              {t('hero:vision_timeline.badge', "Where We're Heading")}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
            {t('hero:vision_timeline.title', 'The Evolution of Marketing Automation')}
          </h2>
        </motion.div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-6 top-8 bottom-8 w-0.5 bg-gradient-to-b from-slate-700 via-blue-500/50 to-slate-700" />

          {/* Era Cards */}
          <div className="space-y-8">
            {eras.map((era, index) => {
              const Icon = era.icon

              return (
                <motion.div
                  key={era.id}
                  className="relative"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Era Card */}
                  <div
                    className={`
                      relative ml-16 p-5 rounded-xl
                      backdrop-blur-md
                      border
                      transition-all duration-300
                      ${
                        era.highlight
                          ? 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/50 shadow-lg shadow-blue-500/20'
                          : 'bg-white/5 border-white/10'
                      }
                    `}
                  >
                    {/* Icon circle on timeline */}
                    <div className="absolute -left-16 top-1/2 -translate-y-1/2">
                      <div
                        className={`
                          w-12 h-12 rounded-full flex items-center justify-center
                          bg-gradient-to-br ${era.color}
                          border-4 border-slate-900
                          ${era.highlight ? 'shadow-lg shadow-blue-500/50 animate-pulse' : ''}
                        `}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                    </div>

                    {/* "You Are Here" badge */}
                    {era.highlight && (
                      <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-xs font-bold text-white shadow-lg animate-pulse">
                        {t('hero:vision_timeline.you_are_here', 'U Bent Hier')} 🔥
                      </div>
                    )}

                    {/* Era Year */}
                    <div className="text-xs font-bold text-blue-400 mb-1 tracking-wider">
                      {era.year}
                    </div>

                    {/* Era Label */}
                    <h3
                      className={`
                        text-lg font-bold mb-2
                        ${era.highlight ? 'text-white' : 'text-white/80'}
                      `}
                    >
                      {era.label}
                    </h3>

                    {/* Era Description */}
                    <p
                      className={`
                        text-sm leading-relaxed
                        ${era.highlight ? 'text-blue-100' : 'text-slate-300'}
                      `}
                    >
                      {era.description}
                    </p>

                    {/* Status indicator */}
                    <div className="mt-3 flex items-center gap-2">
                      <div
                        className={`
                          w-2 h-2 rounded-full
                          ${era.status === 'past' ? 'bg-slate-500' : ''}
                          ${era.status === 'active' ? 'bg-green-400 animate-pulse' : ''}
                          ${era.status === 'future' ? 'bg-gray-500' : ''}
                        `}
                      />
                      <span className="text-xs text-slate-400 capitalize">
                        {era.status === 'past' && 'Verleden'}
                        {era.status === 'active' && 'NU Actief'}
                        {era.status === 'future' && 'Toekomst'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Bottom CTA Message */}
        <motion.div
          className="mt-12 p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 backdrop-blur-md"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white mb-1">
                {t('hero:vision_timeline.insight', 'Teams die vroeg AI-hulpmiddelen adopteerden kregen 3-5 jaar voorsprong')}
              </h3>
              <p className="text-sm text-blue-100/80 leading-relaxed">
                {t('hero:vision_timeline.insight_data', '<1% heeft dit vandaag. Mainstream komt 2027-2028. Handel nu = 2-3 jaar unfair advantage.')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

MobileEvolutionTimeline.displayName = 'MobileEvolutionTimeline'

