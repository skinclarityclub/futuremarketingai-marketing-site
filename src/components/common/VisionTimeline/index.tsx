import React from 'react'
import { motion, useInView } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TimelineEra } from './types'
import { EraCard } from './EraCard'
import { TimelineConnector } from './TimelineConnector'
import { InsightBanner } from './InsightBanner'

// ============================================================================
// Props
// ============================================================================

export interface VisionTimelineProps {
  /** Custom eras to display (optional - uses defaults if not provided) */
  eras?: TimelineEra[]
  /** Additional CSS classes */
  className?: string
}

// ============================================================================
// Component
// ============================================================================

export const VisionTimeline: React.FC<VisionTimelineProps> = ({
  eras: customEras,
  className = '',
}) => {
  const { t } = useTranslation(['hero'])
  const ref = React.useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  // Build eras from translations
  const eras = customEras || [
    {
      id: 'ai-assisted',
      year: t('hero:vision_timeline.eras.ai_assisted.year', '2020-2024'),
      label: t('hero:vision_timeline.eras.ai_assisted.label', 'AI-Assisted Era'),
      description: t(
        'hero:vision_timeline.eras.ai_assisted.description',
        '80% of teams stuck here with ChatGPT/Jasper'
      ),
      icon: 'assisted' as const,
      status: 'past' as const,
    },
    {
      id: 'autonomous',
      year: t('hero:vision_timeline.eras.autonomous.year', '2025-2026'),
      label: t('hero:vision_timeline.eras.autonomous.label', '⚡ Pioneer Window'),
      description: t(
        'hero:vision_timeline.eras.autonomous.description',
        '<1% adoption NOW. First 10 teams building unfair advantage.'
      ),
      icon: 'autonomous' as const,
      status: 'active' as const,
    },
    {
      id: 'standard',
      year: t('hero:vision_timeline.eras.mainstream.year', '2027-2028'),
      label: t('hero:vision_timeline.eras.mainstream.label', 'Mainstream Adoption'),
      description: t(
        'hero:vision_timeline.eras.mainstream.description',
        'Everyone has it. Your 2-3 year lead evaporates.'
      ),
      icon: 'standard' as const,
      status: 'future' as const,
    },
  ]

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      className={`relative w-full ${className}`}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      variants={containerVariants}
      role="region"
      aria-label={t('common:accessibility.timeline_evolution')}
    >
      {/* Section Header */}
      <motion.div
        className="text-center mb-16"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        }}
      >
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 backdrop-blur-sm mb-4"
          role="presentation"
        >
          <span className="text-sm font-semibold text-purple-300">
            {t('hero:vision_timeline.badge', "Where We're Heading")}
          </span>
        </div>

        {/* Title */}
        <h2 id="timeline-heading" className="text-3xl md:text-4xl font-bold text-white mb-2">
          {t('hero:vision_timeline.title', 'The Evolution of Marketing Automation')}
        </h2>
      </motion.div>

      {/* Timeline Container - Horizontal on desktop, vertical on mobile */}
      <div className="relative" role="list" aria-labelledby="timeline-heading">
        {/* Desktop: Horizontal Layout */}
        <div className="hidden md:flex items-start justify-center gap-8 lg:gap-12 px-4">
          {eras.map((era, index) => (
            <React.Fragment key={era.id}>
              <EraCard era={era} index={index} />
              {index < eras.length - 1 && <TimelineConnector />}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile: Vertical Layout */}
        <div className="md:hidden flex flex-col gap-8 px-4">
          {eras.map((era, index) => (
            <React.Fragment key={era.id}>
              <EraCard era={era} index={index} isMobile />
              {index < eras.length - 1 && <TimelineConnector isVertical />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Insight Banner */}
      <motion.div
        className="mt-16"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: 0.8 } },
        }}
      >
        <InsightBanner />
      </motion.div>
    </motion.div>
  )
}

export default VisionTimeline
