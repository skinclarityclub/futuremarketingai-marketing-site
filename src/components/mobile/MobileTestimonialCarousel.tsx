/**
 * MobileTestimonialCarousel Component
 * 
 * Swipeable testimonial carousel optimized for mobile:
 * - Shows 1-2 testimonials at a time
 * - Touch-friendly swipe gestures
 * - Pagination dots
 * - Auto-advance with pause on interaction
 * - Accessible navigation
 * - Minimum 16px text
 */

import React, { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'

interface Testimonial {
  id: string
  name: string
  role: string
  company: string
  text: string
  avatar?: string
}

interface MobileTestimonialCarouselProps {
  /** Array of testimonials to display */
  testimonials?: Testimonial[]
  /** Auto-advance interval in ms (0 to disable) */
  autoAdvanceInterval?: number
  /** Show navigation arrows */
  showArrows?: boolean
  /** Show pagination dots */
  showPagination?: boolean
}

const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    company: 'TechCorp',
    text: 'FutureMarketingAI transformed our entire marketing strategy. We saw a 300% increase in qualified leads within the first 3 months.',
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'CEO',
    company: 'GrowthLabs',
    text: 'The AI automation saved us 40+ hours per week. Our team can now focus on strategy instead of manual tasks.',
  },
  {
    id: '3',
    name: 'Emma Williams',
    role: 'CMO',
    company: 'ScaleUp Inc',
    text: 'Best investment we made this year. The ROI was immediate and continues to grow month over month.',
  },
]

export const MobileTestimonialCarousel: React.FC<MobileTestimonialCarouselProps> = ({
  testimonials = DEFAULT_TESTIMONIALS,
  autoAdvanceInterval = 5000,
  showArrows = true,
  showPagination = true,
}) => {
  const { t } = useTranslation(['common'])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const swipeConfidenceThreshold = 10000
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity
  }

  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection)
    setCurrentIndex((prevIndex) => {
      let nextIndex = prevIndex + newDirection
      if (nextIndex < 0) nextIndex = testimonials.length - 1
      if (nextIndex >= testimonials.length) nextIndex = 0
      return nextIndex
    })
  }, [testimonials.length])

  // Auto-advance
  useEffect(() => {
    if (!autoAdvanceInterval || isPaused) return

    const timer = setInterval(() => {
      paginate(1)
    }, autoAdvanceInterval)

    return () => clearInterval(timer)
  }, [autoAdvanceInterval, isPaused, paginate])

  const handleDragEnd = (e: MouseEvent | TouchEvent | PointerEvent, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x)

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1)
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1)
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  }

  return (
    <div 
      className="relative w-full max-w-2xl mx-auto px-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900/50 border border-white/10 min-h-[280px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 p-6 sm:p-8 cursor-grab active:cursor-grabbing"
          >
            {/* Quote Icon */}
            <Quote className="h-8 w-8 text-blue-400/30 mb-4" aria-hidden="true" />

            {/* Testimonial Text */}
            <p className="text-base sm:text-lg text-slate-200 mb-6 leading-relaxed min-h-[120px]">
              "{testimonials[currentIndex].text}"
            </p>

            {/* Author Info */}
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                {testimonials[currentIndex].name.charAt(0)}
              </div>

              {/* Name & Role */}
              <div>
                <div className="font-semibold text-white text-base">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-sm text-slate-400">
                  {testimonials[currentIndex].role} • {testimonials[currentIndex].company}
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows */}
        {showArrows && testimonials.length > 1 && (
          <>
            <button
              onClick={() => paginate(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/10 flex items-center justify-center touch-manipulation transition-colors"
              aria-label={t('common:previous', 'Previous testimonial')}
            >
              <ChevronLeft className="h-5 w-5 text-white" aria-hidden="true" />
            </button>

            <button
              onClick={() => paginate(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-slate-800/80 hover:bg-slate-700 border border-white/10 flex items-center justify-center touch-manipulation transition-colors"
              aria-label={t('common:next', 'Next testimonial')}
            >
              <ChevronRight className="h-5 w-5 text-white" aria-hidden="true" />
            </button>
          </>
        )}
      </div>

      {/* Pagination Dots */}
      {showPagination && testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-6" role="tablist" aria-label="Testimonial navigation">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`w-2 h-2 rounded-full transition-all touch-manipulation ${
                index === currentIndex
                  ? 'bg-blue-400 w-8'
                  : 'bg-slate-600 hover:bg-slate-500'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
              aria-selected={index === currentIndex}
              role="tab"
            />
          ))}
        </div>
      )}

      {/* Swipe Hint (only on first load) */}
      {currentIndex === 0 && (
        <motion.p
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ delay: 3, duration: 0.5 }}
          className="text-center text-sm text-slate-400 mt-3"
        >
          {t('common:swipe_hint', '← Swipe to explore more →')}
        </motion.p>
      )}
    </div>
  )
}

export default MobileTestimonialCarousel

