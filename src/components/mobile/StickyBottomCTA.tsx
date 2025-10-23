/**
 * StickyBottomCTA Component
 * 
 * A persistent sticky bottom CTA bar for mobile with:
 * - Two large, touch-optimized buttons
 * - Auto-hide on scroll down
 * - Auto-show on scroll up
 * - Smooth transitions
 * - Full accessibility support
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ArrowRight, Calendar } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useScrollBehavior } from '../../hooks'
import { Button } from '../ui/button'

interface StickyBottomCTAProps {
  /** Primary button text override */
  primaryText?: string
  /** Primary button action override */
  onPrimaryClick?: () => void
  /** Secondary button text override */
  secondaryText?: string
  /** Secondary button action override */
  onSecondaryClick?: () => void
  /** Hide the CTA bar entirely */
  hidden?: boolean
  /** Minimum scroll distance before showing (px) */
  showAfterScroll?: number
}

export const StickyBottomCTA: React.FC<StickyBottomCTAProps> = ({
  primaryText,
  onPrimaryClick,
  secondaryText,
  onSecondaryClick,
  hidden = false,
  showAfterScroll = 200,
}) => {
  const { t } = useTranslation(['common'])
  const navigate = useNavigate()
  const { scrollDirection, scrollY } = useScrollBehavior({
    threshold: 10,
    debounce: 50,
  })

  // Determine if CTA should be visible
  const isVisible = 
    !hidden && 
    scrollY > showAfterScroll && 
    scrollDirection !== 'down'

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick()
    } else {
      navigate('/demo')
    }
  }

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick()
    } else {
      // Default: scroll to top or open calendly
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const getPrimaryText = () => {
    return primaryText || t('common:cta.start_free', 'Start Free Demo')
  }

  const getSecondaryText = () => {
    return secondaryText || t('common:cta.book_appointment', 'Book Call')
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 300, 
            damping: 30,
            opacity: { duration: 0.2 }
          }}
          className="fixed bottom-0 left-0 right-0 z-50 safe-area-inset-bottom"
          role="complementary"
          aria-label="Call to action"
        >
          {/* Backdrop blur effect */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/95 to-transparent backdrop-blur-lg" />
          
          {/* Content */}
          <div className="relative px-4 py-3 pb-safe">
            <div className="flex gap-2">
              {/* Primary CTA */}
              <Button
                onClick={handlePrimaryClick}
                className="flex-1 h-14 text-base font-semibold bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/40 touch-manipulation min-h-touch group"
                aria-label={getPrimaryText()}
              >
                <span>{getPrimaryText()}</span>
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>

              {/* Secondary CTA */}
              <Button
                onClick={handleSecondaryClick}
                variant="outline"
                className="h-14 px-6 text-base font-semibold bg-white/5 hover:bg-white/10 border-white/20 hover:border-white/30 text-white transition-all duration-300 touch-manipulation min-h-touch group"
                aria-label={getSecondaryText()}
              >
                <Calendar className="h-5 w-5 transition-transform group-hover:scale-110" />
              </Button>
            </div>

            {/* Safe area spacer for devices with home indicator */}
            <div className="h-safe" aria-hidden="true" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default StickyBottomCTA

