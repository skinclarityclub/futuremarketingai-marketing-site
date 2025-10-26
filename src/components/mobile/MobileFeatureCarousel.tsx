/**
 * MobileFeatureCarousel - Mobile-optimized features carousel
 *
 * ✅ DESKTOP-FIRST COMPLIANT
 * - This is a NEW mobile-only component, separate from desktop FeatureShowcase
 * - Desktop FeatureShowcase remains 100% unchanged
 * - Used via conditional rendering in Hero component
 *
 * ✅ CONTENT PARITY COMPLIANT
 * - Uses EXACT same primary translation keys as desktop (landing.features.showcase.*)
 * - Shows same title, description, stat as desktop by default
 * - Optional expand/collapse for additional details (benefits, use cases)
 * - Same data, different layout (carousel vs grid)
 *
 * Key differences from desktop:
 * - Carousel (1 feature at a time) instead of 3-column grid
 * - Swipe gestures for navigation
 * - Expand/collapse for details (optional)
 * - Touch-friendly controls
 * - Mobile-optimized animations
 */

import { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Brain,
  Crown,
  Palette,
  Send,
  BarChart3,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react'

/**
 * Core platform features - EXACT same icons/keys as desktop FeatureShowcase
 */
const FEATURE_KEYS = [
  { key: 'research', icon: Brain, color: 'from-blue-500 to-cyan-500' },
  { key: 'manager', icon: Crown, color: 'from-purple-500 to-pink-500' },
  { key: 'content', icon: Palette, color: 'from-pink-500 to-rose-500' },
  { key: 'publishing', icon: Send, color: 'from-green-500 to-emerald-500' },
  { key: 'analytics', icon: BarChart3, color: 'from-cyan-500 to-blue-500' },
  { key: 'ads', icon: DollarSign, color: 'from-yellow-500 to-orange-500' },
] as const

interface MobileFeatureCarouselProps {
  /** Start with details expanded (default: collapsed for content parity) */
  defaultExpanded?: boolean
  className?: string
}

/**
 * Mobile Feature Carousel
 * - Shows same showcase.* content as desktop by default
 * - Optional expand for detailed.* info (benefits, use cases)
 */
export const MobileFeatureCarousel: React.FC<MobileFeatureCarouselProps> = ({
  defaultExpanded = false,
  className = '',
}) => {
  const { t } = useTranslation('common')
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % FEATURE_KEYS.length)
    setIsExpanded(false) // Collapse when changing cards
  }

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + FEATURE_KEYS.length) % FEATURE_KEYS.length)
    setIsExpanded(false) // Collapse when changing cards
  }

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const threshold = 50
    if (info.offset.x > threshold) {
      handlePrev()
    } else if (info.offset.x < -threshold) {
      handleNext()
    }
  }

  const currentFeature = FEATURE_KEYS[activeIndex]
  const Icon = currentFeature.icon

  // PRIMARY content - EXACT same as desktop FeatureShowcase (landing.features.showcase.*)
  const title = t(`landing.features.showcase.${currentFeature.key}.title`)
  const description = t(`landing.features.showcase.${currentFeature.key}.description`)
  const stat = t(`landing.features.showcase.${currentFeature.key}.stat`)

  // OPTIONAL expanded content - Additional details (landing.features.detailed.*)
  const benefits = t(`landing.features.detailed.${currentFeature.key}.benefits`, {
    returnObjects: true,
  }) as string[]
  const useCases = t(`landing.features.detailed.${currentFeature.key}.useCases`, {
    returnObjects: true,
  }) as string[]

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300,
      opacity: 0,
    }),
  }

  return (
    <section className={`py-12 px-6 ${className}`} aria-label="Features carousel">
      {/* Section Header - Uses translation keys (if available) or fallback */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-100">
            {t('landing.hero_landing.solution_section.badge', 'Complete Marketing OS')}
          </span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-bold text-white mb-3"
        >
          {t('landing.hero_landing.solution_section.title', '6 AI Modules, One Autonomous System')}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-base text-blue-100"
        >
          {t(
            'landing.hero_landing.solution_section.subtitle',
            'Each module works independently while the Manager ensures perfect coordination.'
          )}
        </motion.p>
      </div>

      {/* Carousel Container */}
      <div className="relative min-h-[400px] mb-6">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={activeIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 touch-manipulation"
          >
            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br ${currentFeature.color} rounded-xl mb-4`}
            >
              <Icon className="w-7 h-7 text-white" />
            </div>

            {/* Title - SAME as desktop FeatureShowcase */}
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>

            {/* Stat Badge - SAME as desktop */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4">
              <span className="text-sm font-semibold text-blue-300">{stat}</span>
            </div>

            {/* Description - SAME as desktop */}
            <p className="text-base text-blue-100 leading-relaxed mb-4">{description}</p>

            {/* Expand/Collapse Button for Additional Details */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-medium text-purple-300 hover:text-purple-200 transition-colors mb-4 tap-target-sm touch-manipulation"
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Verberg details' : 'Toon details'}
              type="button"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  <span>Verberg details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  <span>Bekijk details</span>
                </>
              )}
            </button>

            {/* Expanded Details Section (Benefits & Use Cases) */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  {/* Benefits */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Belangrijkste Voordelen
                    </h4>
                    <ul className="space-y-2">
                      {benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-blue-100 flex items-start gap-2">
                          <span className="text-green-400 mt-0.5">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Use Cases */}
                  <div>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Gebruikssituaties
                    </h4>
                    <ul className="space-y-2">
                      {useCases.map((useCase, i) => (
                        <li key={i} className="text-sm text-blue-100/90">
                          • {useCase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Previous/Next Buttons - Touch-friendly 48px */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors touch-manipulation tap-target"
          aria-label="Vorige feature"
          type="button"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>

        {/* Pagination Dots */}
        <div className="flex gap-2">
          {FEATURE_KEYS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > activeIndex ? 1 : -1)
                setActiveIndex(index)
                setIsExpanded(false) // Collapse when jumping to different card
              }}
              className={`h-2 rounded-full transition-all touch-manipulation ${
                index === activeIndex ? 'bg-purple-400 w-8' : 'bg-white/20 w-2 hover:bg-white/40'
              }`}
              aria-label={`Ga naar feature ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
              type="button"
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors touch-manipulation tap-target"
          aria-label="Volgende feature"
          type="button"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Feature Counter */}
      <p className="text-sm text-center text-white/60 mb-8">
        Feature {activeIndex + 1} van {FEATURE_KEYS.length}
      </p>

      {/* Total Value Summary - SAME content as desktop FeatureShowcase */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm mx-auto"
      >
        <TrendingUp className="h-6 w-6 text-green-400" />
        <div className="text-left">
          <div className="text-sm text-green-300 font-medium">
            {t('landing.features.total_value.label')}
          </div>
          <div className="text-2xl font-bold text-white">
            {t('landing.features.total_value.amount')}
          </div>
        </div>
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-4 text-sm text-center text-blue-200/60"
      >
        {t('landing.features.total_value.description')}
      </motion.p>
    </section>
  )
}

MobileFeatureCarousel.displayName = 'MobileFeatureCarousel'
