/**
 * Carousel Component
 *
 * Horizontal scrolling cards with navigation
 */

import { motion } from 'framer-motion'
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import RichCard from './RichCard'
import type { CardData } from '../../../types/chat'

interface CarouselProps {
  cards: CardData[]
  onAction: (action: string) => void
}

export default function Carousel({ cards, onAction }: CarouselProps) {
  const { t } = useTranslation(['common'])
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollToCard = (index: number) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 0
      const gap = 16 // gap-4 = 16px
      scrollRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: 'smooth',
      })
      setCurrentIndex(index)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      scrollToCard(currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      scrollToCard(currentIndex + 1)
    }
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0]?.clientWidth || 0
      const gap = 16
      const newIndex = Math.round(scrollRef.current.scrollLeft / (cardWidth + gap))
      setCurrentIndex(newIndex)
    }
  }

  return (
    <div className="relative -mx-4 px-4">
      {/* Carousel Container */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="
          flex gap-4 
          overflow-x-auto 
          snap-x snap-mandatory
          scrollbar-hide
          pb-4
        "
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="snap-start shrink-0"
          >
            <RichCard card={card} onAction={onAction} />
          </motion.div>
        ))}
      </div>

      {/* Navigation Buttons (Desktop) */}
      {cards.length > 1 && (
        <>
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="
              hidden md:flex
              absolute left-2 top-1/2 -translate-y-1/2
              w-10 h-10
              items-center justify-center
              bg-white dark:bg-gray-800
              rounded-full
              shadow-lg
              border border-gray-200 dark:border-white/10
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:bg-gray-50 dark:hover:bg-gray-700
              transition-all duration-200
              z-10
            "
            aria-label={t('common:accessibility.previous_card')}
          >
            <ChevronLeft size={20} className="text-gray-700 dark:text-gray-300" />
          </button>

          <button
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            className="
              hidden md:flex
              absolute right-2 top-1/2 -translate-y-1/2
              w-10 h-10
              items-center justify-center
              bg-white dark:bg-gray-800
              rounded-full
              shadow-lg
              border border-gray-200 dark:border-white/10
              disabled:opacity-30 disabled:cursor-not-allowed
              hover:bg-gray-50 dark:hover:bg-gray-700
              transition-all duration-200
              z-10
            "
            aria-label={t('common:accessibility.next_card')}
          >
            <ChevronRight size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {cards.length > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToCard(index)}
              className={`
                w-2 h-2 rounded-full transition-all duration-200
                ${
                  index === currentIndex
                    ? 'bg-purple-600 dark:bg-purple-400 w-6'
                    : 'bg-gray-300 dark:bg-gray-600'
                }
              `}
              aria-label={`Go to card ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
