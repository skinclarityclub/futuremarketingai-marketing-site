/**
 * KineticTypographyTransition - Brand + Tagline Impact
 *
 * Simple, clean, impactful typography transition:
 * 1. Brand name (0-1s)
 * 2. Tagline (1-2s)
 * 3. Fade to demo (2-2.5s)
 *
 * @multilingual Adapts to browser language
 */

import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'

interface KineticTypographyTransitionProps {
  isActive: boolean
  onComplete: () => void
  duration?: number
}

export const KineticTypographyTransition: React.FC<KineticTypographyTransitionProps> = ({
  isActive,
  onComplete,
  duration = 5500, // 5.5 seconds total for better readability
}) => {
  const { t } = useTranslation()
  const [phase, setPhase] = useState<'brand' | 'tagline' | 'complete'>('brand')

  // Reset phase when becoming active
  useEffect(() => {
    if (isActive) {
      setPhase('brand')
    }
  }, [isActive])

  // Phase transitions - Based on UX best practices for reading time
  useEffect(() => {
    if (!isActive) {
      return
    }

    console.log('🎬 Starting transition, duration:', duration)

    // Calculate phase durations from total duration
    const brandDuration = duration * 0.36 // ~2s of 5.5s
    const taglineDuration = duration * 0.45 // ~2.5s of 5.5s
    // Remaining ~1s is for fade-out handled by AnimatePresence

    // Switch to tagline
    const taglineTimer = setTimeout(() => {
      console.log('🎯 Switching to tagline phase')
      setPhase('tagline')
    }, brandDuration)

    // Complete animation
    const completeTimer = setTimeout(() => {
      console.log('✅ Transition complete, calling onComplete')
      setPhase('complete')
      // Small delay to ensure AnimatePresence exit completes
      setTimeout(onComplete, 300)
    }, brandDuration + taglineDuration)

    return () => {
      clearTimeout(taglineTimer)
      clearTimeout(completeTimer)
    }
  }, [isActive, onComplete, duration])

  if (!isActive) {
    return null
  }

  const portalRoot = document.getElementById('root')
  if (!portalRoot) {
    return null
  }

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      {phase !== 'complete' && (
        <motion.div
          key="transition-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900"
        >
          <AnimatePresence mode="wait">
            {/* Phase 1: Brand Name */}
            {phase === 'brand' && (
              <motion.div
                key="brand"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: 0.8, // Slower, more elegant
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="absolute inset-0 flex items-center justify-center px-4"
              >
                <div className="text-center space-y-3">
                  {/* Main brand name - Optimized size for readability */}
                  <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 tracking-tight leading-tight">
                    {t('brandName', 'FUTURE MARKETING AI')}
                  </h1>

                  {/* DEMO label - Clear hierarchy */}
                  <div className="flex items-center justify-center gap-3">
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                    <p className="text-xl md:text-3xl font-medium text-cyan-400/90 tracking-[0.3em] uppercase">
                      {t('demoLabel', 'Demo')}
                    </p>
                    <div className="h-px w-12 bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent"></div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Phase 2: Tagline */}
            {phase === 'tagline' && (
              <motion.div
                key="tagline"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{
                  duration: 0.7, // Slower transitions
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="absolute inset-0 flex items-center justify-center px-8"
              >
                <div className="text-center space-y-6 max-w-5xl">
                  <p className="text-4xl md:text-7xl font-bold text-white/95 tracking-tight leading-tight">
                    {t('tagline', 'The Future of Marketing Intelligence')}
                  </p>
                  <p className="text-xl md:text-3xl text-cyan-400 font-medium tracking-wide">
                    {t('taglineSubtitle', 'AI-Powered. Data-Driven. Results-Focused.')}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Skip button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            whileHover={{ opacity: 1 }}
            onClick={onComplete}
            className="absolute bottom-8 right-8 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm rounded-lg hover:bg-white/20 transition-colors z-10"
          >
            {t('skip', 'Skip')}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  )
}
