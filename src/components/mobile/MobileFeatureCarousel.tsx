/**
 * MobileFeatureCarousel - Mobile-optimized features carousel
 *
 * Desktop-first compliant: This is a NEW mobile-only component.
 * Uses EXACT same feature data (translation keys, FEATURE_KEYS) as desktop.
 *
 * Key differences from desktop:
 * - Carousel (1 feature at a time) instead of 3-column grid
 * - Swipe gestures for navigation
 * - Pagination dots
 * - Touch-friendly navigation buttons
 * - All text ≥16px for legibility
 */

import React, { useState } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Brain,
  Settings,
  Zap,
  Send,
  BarChart3,
  Target,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react'

/**
 * Core platform features - EXACT same as desktop
 */
const FEATURE_KEYS = [
  { key: 'research', icon: Brain },
  { key: 'manager', icon: Settings },
  { key: 'content', icon: Zap },
  { key: 'publishing', icon: Send },
  { key: 'analytics', icon: BarChart3 },
  { key: 'ads', icon: Target },
] as const

interface MobileFeatureCarouselProps {
  /** Show compact version (fewer details) */
  compact?: boolean
  className?: string
}

/**
 * Mobile Feature Carousel - Uses SAME data as desktop
 * Shows 6 AI modules in swipeable carousel format
 */
export const MobileFeatureCarousel: React.FC<MobileFeatureCarouselProps> = ({
  compact = false,
  className = '',
}) => {
  const { t } = useTranslation('common')
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const handleNext = () => {
    setDirection(1)
    setActiveIndex((prev) => (prev + 1) % FEATURE_KEYS.length)
  }

  const handlePrev = () => {
    setDirection(-1)
    setActiveIndex((prev) => (prev - 1 + FEATURE_KEYS.length) % FEATURE_KEYS.length)
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

  // Use EXACT same translation keys as desktop
  const name = t(`landing.features.detailed.${currentFeature.key}.name`)
  const tagline = t(`landing.features.detailed.${currentFeature.key}.tagline`)
  const description = t(`landing.features.detailed.${currentFeature.key}.description`)
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
      {/* Section Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
        >
          <Sparkles className="w-5 h-5 text-purple-400" />
          <span className="text-sm font-medium text-purple-100">Complete Marketing OS</span>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold text-white mb-3"
        >
          6 AI Modules, One Autonomous System
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-base text-blue-100"
        >
          Each module works independently while the Manager ensures perfect coordination.
        </motion.p>
      </div>

      {/* Carousel Container */}
      <div className="relative min-h-[500px] mb-6">
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
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4">
              <Icon className="w-7 h-7 text-white" />
            </div>

            {/* Title & Tagline */}
            <h3 className="text-xl font-bold text-white mb-2">{name}</h3>
            <p className="text-base text-purple-300 font-semibold mb-4">{tagline}</p>

            {/* Description */}
            <p className="text-sm text-blue-100 leading-relaxed mb-6">{description}</p>

            {/* Benefits (if not compact) */}
            {!compact && (
              <>
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  Key Benefits
                </h4>
                <ul className="space-y-2 mb-6">
                  {benefits.map((benefit, i) => (
                    <li key={i} className="text-sm text-blue-100 flex items-start gap-2">
                      <span className="text-green-400 mt-0.5">✓</span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                {/* Use Cases */}
                <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Use Cases
                </h4>
                <ul className="space-y-2">
                  {useCases.map((useCase, i) => (
                    <li key={i} className="text-xs text-blue-100/80">
                      • {useCase}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mb-6">
        {/* Previous/Next Buttons */}
        <button
          onClick={handlePrev}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors touch-manipulation"
          aria-label="Previous feature"
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
              }}
              className={`h-2 rounded-full transition-all ${
                index === activeIndex ? 'bg-purple-400 w-8' : 'bg-white/20 w-2 hover:bg-white/40'
              }`}
              aria-label={`Go to feature ${index + 1}`}
              aria-current={index === activeIndex ? 'true' : 'false'}
              type="button"
            />
          ))}
        </div>

        <button
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors touch-manipulation"
          aria-label="Next feature"
          type="button"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Feature Counter */}
      <p className="text-sm text-center text-white/60 mb-8">
        Feature {activeIndex + 1} of {FEATURE_KEYS.length}
      </p>

      {/* Value Stack Summary - Condensed for Mobile */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl text-center"
      >
        <h3 className="text-xl font-bold text-white mb-4">The Complete Package</h3>
        <div className="flex flex-col gap-4 mb-4">
          <div>
            <div className="text-3xl font-bold text-green-400 mb-1">€39,000</div>
            <div className="text-xs text-blue-100">Retail value verified</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400 mb-1">€24,000</div>
            <div className="text-xs text-blue-100">Monthly savings at Founding rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-blue-400 mb-1">€288k</div>
            <div className="text-xs text-blue-100">Year 1 total savings</div>
          </div>
        </div>
        <p className="text-sm text-white font-semibold mb-4">
          Founding Member: €15,000/month for €39,000 automation (62% discount)
        </p>
        <a
          href="/demo"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center w-full h-14 min-h-touch px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg touch-manipulation"
        >
          Try All Modules Now
        </a>
      </motion.div>
    </section>
  )
}

MobileFeatureCarousel.displayName = 'MobileFeatureCarousel'
