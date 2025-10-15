import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { TimelineEra } from './types'
import { EraIcon } from './EraIcon'

// ============================================================================
// Props
// ============================================================================

interface EraCardProps {
  era: TimelineEra
  index: number
  isMobile?: boolean
}

// ============================================================================
// Component
// ============================================================================

export const EraCard: React.FC<EraCardProps> = ({ era, index, isMobile = false }) => {
  const { t } = useTranslation(['hero'])
  const isPast = era.status === 'past'
  const isActive = era.status === 'active'
  const isFuture = era.status === 'future'

  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        delay: index * 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  }

  return (
    <motion.article
      className={`
        relative flex-1 max-w-xs
        ${isMobile ? 'w-full' : ''}
      `}
      variants={cardVariants}
      whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
      role="listitem"
      aria-label={`${era.label}: ${era.year}`}
    >
      {/* Glassmorphic Card */}
      <div
        className={`
          relative p-6 rounded-2xl
          backdrop-blur-xl border-2
          transition-all duration-500
          ${
            isPast
              ? 'border-white/10 hover:'
              : isActive
                ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/50 shadow-[0_0_30px_rgba(34,197,94,0.3)]'
                : 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-400/30 hover:border-purple-400/50'
          }
        `}
      >
        {/* Number Badge */}
        <div
          className={`
            absolute -top-3 -left-3 w-10 h-10 rounded-full
            flex items-center justify-center text-sm font-bold
            border-2
            ${
              isPast
                ? 'border-white/20 text-white/40'
                : isActive
                  ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.5)]'
                  : 'bg-purple-600 border-purple-400 text-white'
            }
          `}
        >
          {index + 1}
        </div>

        {/* "EARLY ADOPTER WINDOW" Badge - Only for active */}
        {isActive && (
          <motion.div
            className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold shadow-lg border-2 border-green-400"
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{
              opacity: [1, 0.8, 1],
              y: [-10, -14, -10],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            role="status"
            aria-live="polite"
            aria-label={t('common:accessibility.early_adopter_window')}
          >
            <span aria-hidden="true">🚀</span>{' '}
            {t('hero:vision_timeline.early_adopter_window', 'EARLY ADOPTER WINDOW')}
          </motion.div>
        )}

        {/* Icon Container */}
        <div className="w-24 h-24 mx-auto mb-4" role="img" aria-label={`${era.label} era icon`}>
          <EraIcon icon={era.icon} status={era.status} />
        </div>

        {/* Year Badge */}
        <div
          className={`
            text-center text-xs font-bold mb-2 px-3 py-1 rounded-full inline-block w-full
            ${
              isPast
                ? 'text-white/50'
                : isActive
                  ? 'text-green-300 bg-green-900/30'
                  : 'text-purple-300 bg-purple-900/30'
            }
          `}
          aria-label={`Time period: ${era.year}`}
        >
          {era.year}
        </div>

        {/* Label */}
        <h3
          className={`
            text-center text-xl font-bold mb-2
            ${isPast ? 'text-gray-300' : isActive ? 'text-green-100' : 'text-purple-100'}
          `}
          id={`era-${era.id}-label`}
        >
          {era.label}
        </h3>

        {/* Description */}
        <p
          className={`
            text-center text-sm
            ${isPast ? 'text-gray-400' : isActive ? 'text-green-200/80' : 'text-purple-200/80'}
          `}
        >
          {era.description}
        </p>

        {/* Future "Too Late" Overlay - Creates urgency */}
        {isFuture && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/5 to-blue-500/5 backdrop-blur-[2px] flex items-center justify-center"
            initial={{ opacity: 0 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center px-4">
              <div className="text-2xl mb-2">⏰</div>
              <p className="text-xs text-purple-300 font-semibold mb-1">2027-2028</p>
              <p className="text-xs text-purple-400">Too late - everyone has it</p>
              <p className="text-xs text-purple-500 mt-1">Your lead = gone</p>
            </div>
          </motion.div>
        )}
      </div>
    </motion.article>
  )
}
