/**
 * MobileFeatureCarousel Component
 *
 * A touch-optimized, swipeable carousel for showcasing key features on mobile.
 * Features:
 * - Swipe gestures with Framer Motion
 * - Expandable feature cards
 * - Lazy-loaded icons
 * - Touch-optimized interactions (≥48px targets)
 * - Smooth animations and transitions
 */

import React, { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Brain,
  Zap,
  Target,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  LucideIcon,
} from 'lucide-react'

interface Feature {
  id: string
  icon: LucideIcon
  titleKey: string
  descriptionKey: string
  detailsKey: string
  /** Optional interactive link (e.g., to demo page, chart, or screenshot) */
  interactiveLink?: string
  /** Optional link label translation key */
  interactiveLabelKey?: string
}

const FEATURES: Feature[] = [
  {
    id: 'ai-automation',
    icon: Brain,
    titleKey: 'features.ai_automation.title',
    descriptionKey: 'features.ai_automation.description',
    detailsKey: 'features.ai_automation.details',
  },
  {
    id: 'instant-results',
    icon: Zap,
    titleKey: 'features.instant_results.title',
    descriptionKey: 'features.instant_results.description',
    detailsKey: 'features.instant_results.details',
  },
  {
    id: 'smart-targeting',
    icon: Target,
    titleKey: 'features.smart_targeting.title',
    descriptionKey: 'features.smart_targeting.description',
    detailsKey: 'features.smart_targeting.details',
  },
  {
    id: 'growth-tracking',
    icon: TrendingUp,
    titleKey: 'features.growth_tracking.title',
    descriptionKey: 'features.growth_tracking.description',
    detailsKey: 'features.growth_tracking.details',
  },
]

const swipeConfidenceThreshold = 10000
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity
}

interface MobileFeatureCarouselProps {
  /** Custom features to display (optional) */
  features?: Feature[]
  /** Auto-play interval in ms (0 = disabled) */
  autoPlayInterval?: number
}

export const MobileFeatureCarousel: React.FC<MobileFeatureCarouselProps> = ({
  features = FEATURES,
  autoPlayInterval = 0,
}) => {
  const { t } = useTranslation(['common', 'features'])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [[page, direction], setPage] = useState([0, 0])

  // Auto-play logic
  React.useEffect(() => {
    if (autoPlayInterval > 0) {
      const interval = setInterval(() => {
        paginate(1)
      }, autoPlayInterval)
      return () => clearInterval(interval)
    }
    return undefined
  }, [currentIndex, autoPlayInterval])

  const paginate = (newDirection: number) => {
    const newIndex = (currentIndex + newDirection + features.length) % features.length
    setCurrentIndex(newIndex)
    setPage([page + newDirection, newDirection])
    // Collapse when swiping
    setExpandedId(null)
  }

  const handleDragEnd = (
    _e: MouseEvent | TouchEvent | PointerEvent,
    { offset, velocity }: PanInfo
  ) => {
    const swipe = swipePower(offset.x, velocity.x)

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1)
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1)
    }
  }

  const toggleExpand = (featureId: string) => {
    setExpandedId(expandedId === featureId ? null : featureId)
  }

  const currentFeature = features[currentIndex]
  const Icon = currentFeature.icon

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      scale: 0.9,
    }),
  }

  const isExpanded = expandedId === currentFeature.id

  return (
    <section
      className="relative py-12 px-6 bg-gradient-to-b from-slate-900 to-slate-950"
      aria-label="Feature showcase"
    >
      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {t('features.section_title', 'Key Features')}
        </h2>
        <p className="text-blue-200/70 text-sm">
          {t('features.section_subtitle', 'Swipe to explore')}
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative h-[420px] flex items-center justify-center overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute w-full max-w-sm cursor-grab active:cursor-grabbing"
          >
            {/* Feature Card */}
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-6 shadow-2xl">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-400/20">
                  <Icon className="w-12 h-12 text-blue-400" aria-hidden="true" />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white text-center mb-3">
                {t(currentFeature.titleKey, currentFeature.id)}
              </h3>

              {/* One-line Description */}
              <p className="text-blue-100/80 text-center text-sm mb-4 leading-relaxed">
                {t(currentFeature.descriptionKey, 'Feature description')}
              </p>

              {/* Expandable Details */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pb-2 border-t border-white/10">
                      <p className="text-blue-200/70 text-sm leading-relaxed">
                        {t(currentFeature.detailsKey, 'Detailed information about this feature.')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expand/Collapse Button */}
              <button
                onClick={() => toggleExpand(currentFeature.id)}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-400/20 rounded-xl transition-colors touch-manipulation min-h-touch"
                aria-expanded={isExpanded}
                aria-label={
                  isExpanded
                    ? t('common:collapse', 'Collapse details')
                    : t('common:expand', 'Expand details')
                }
              >
                <span className="text-sm font-medium text-blue-300">
                  {isExpanded
                    ? t('common:show_less', 'Show Less')
                    : t('common:show_more', 'Show More')}
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4 text-blue-300" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-blue-300" />
                )}
              </button>

              {/* Optional Interactive Button */}
              {currentFeature.interactiveLink && (
                <a
                  href={currentFeature.interactiveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full mt-3 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 border border-purple-400/30 rounded-xl transition-all touch-manipulation min-h-touch group"
                  aria-label={t(
                    currentFeature.interactiveLabelKey || 'common:view_interactive',
                    'View Interactive Demo'
                  )}
                >
                  <span className="text-sm font-semibold text-purple-200 group-hover:text-purple-100 transition-colors">
                    {t(
                      currentFeature.interactiveLabelKey || 'common:view_interactive',
                      'View Interactive'
                    )}
                  </span>
                  <ExternalLink className="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition-colors" />
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Pagination Dots */}
      <div
        className="flex justify-center gap-2 mt-6"
        role="tablist"
        aria-label="Feature navigation"
      >
        {features.map((feature, index) => (
          <button
            key={feature.id}
            onClick={() => {
              const newDirection = index > currentIndex ? 1 : -1
              setCurrentIndex(index)
              setPage([page + newDirection, newDirection])
              setExpandedId(null)
            }}
            className="touch-manipulation min-w-touch min-h-touch flex items-center justify-center"
            role="tab"
            aria-selected={index === currentIndex}
            aria-label={`Go to feature ${index + 1}`}
          >
            <div
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-blue-400 w-8' : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          </button>
        ))}
      </div>

      {/* Swipe Hint (first time only) */}
      <div className="text-center mt-4">
        <p className="text-blue-200/50 text-xs">
          {t('common:swipe_hint', '← Swipe to explore more →')}
        </p>
      </div>
    </section>
  )
}

export default MobileFeatureCarousel
