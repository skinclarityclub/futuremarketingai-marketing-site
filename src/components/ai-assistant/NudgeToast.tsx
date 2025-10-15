/**
 * Nudge Toast Component
 *
 * Displays contextual nudges and milestone celebrations
 * at optimal moments in the user journey.
 */

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Trophy, TrendingUp, MessageCircle, Calculator, Calendar } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useJourneyStore } from '../../stores/journeyStore'
import type { Nudge } from '../../utils/journeyNudges'

const iconMap = {
  '🚀': Sparkles,
  '✨': Sparkles,
  '🎉': Trophy,
  '🎊': Trophy,
  '🏆': Trophy,
  '📊': TrendingUp,
  '💰': TrendingUp,
  '💬': MessageCircle,
  '🤖': MessageCircle,
  '🧮': Calculator,
  '📅': Calendar,
}

export default function NudgeToast() {
  const { t } = useTranslation(['common'])
  const { currentNudge, dismissNudge } = useJourneyStore()

  // Auto-dismiss after duration
  useEffect(() => {
    if (currentNudge) {
      const timer = setTimeout(() => {
        dismissNudge()
      }, currentNudge.duration || 5000)

      return () => clearTimeout(timer)
    }

    return undefined
  }, [currentNudge, dismissNudge])

  if (!currentNudge) {
    return null
  }

  const handleAction = () => {
    if (!currentNudge.action) {
      return
    }

    switch (currentNudge.action.type) {
      case 'navigate':
        // Navigate to a route (if using React Router)
        window.location.hash = currentNudge.action.value || ''
        break

      case 'open_chat':
        // Trigger chat open
        document.dispatchEvent(new CustomEvent('openChat'))
        break

      case 'open_calculator':
        // Trigger calculator open
        document.dispatchEvent(new CustomEvent('openCalculator'))
        break

      case 'schedule_demo':
        // Trigger demo scheduling
        document.dispatchEvent(new CustomEvent('scheduleDemo'))
        break
    }

    dismissNudge()
  }

  const Icon =
    currentNudge.icon && iconMap[currentNudge.icon as keyof typeof iconMap]
      ? iconMap[currentNudge.icon as keyof typeof iconMap]
      : Sparkles

  return (
    <AnimatePresence>
      {currentNudge && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed bottom-6 right-6 z-[9999] max-w-sm"
          role="alert"
          aria-live="polite"
        >
          <div
            className={`
              relative overflow-hidden rounded-2xl shadow-2xl
              backdrop-blur-xl border
              ${getNudgeStyles(currentNudge.type)}
            `}
          >
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

            {/* Content */}
            <div className="relative px-6 py-5">
              {/* Header */}
              <div className="flex items-start gap-4 mb-3">
                <div
                  className={`flex-shrink-0 p-2 rounded-xl ${getIconBgColor(currentNudge.type)}`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold text-lg leading-tight">
                    {currentNudge.title}
                  </h3>
                </div>

                <button
                  onClick={dismissNudge}
                  className="flex-shrink-0 p-1 rounded-lg hover:transition-colors"
                  aria-label={t('common:actions.close')}
                >
                  <X className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </div>

              {/* Message */}
              <p className="text-white/90 text-sm leading-relaxed mb-4">{currentNudge.message}</p>

              {/* Action Button */}
              {currentNudge.action && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAction}
                  className={`
                    w-full py-3 px-4 rounded-xl font-semibold text-sm
                    transition-all duration-200
                    ${getButtonStyles(currentNudge.type)}
                  `}
                >
                  {currentNudge.action.label}
                </motion.button>
              )}
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: (currentNudge.duration || 5000) / 1000, ease: 'linear' }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function getNudgeStyles(type: Nudge['type']): string {
  switch (type) {
    case 'success':
      return 'bg-gradient-to-br from-emerald-500/90 to-teal-600/90 border-emerald-400/30'
    case 'celebration':
      return 'bg-gradient-to-br from-purple-500/90 to-pink-600/90 border-purple-400/30'
    case 'warning':
      return 'bg-gradient-to-br from-amber-500/90 to-orange-600/90 border-amber-400/30'
    case 'cta':
      return 'bg-gradient-to-br from-blue-500/90 to-indigo-600/90 border-blue-400/30'
    case 'info':
    default:
      return 'bg-gradient-to-br from-slate-700/90 to-slate-800/90 border-slate-600/30'
  }
}

function getIconBgColor(type: Nudge['type']): string {
  switch (type) {
    case 'success':
      return 'bg-emerald-600'
    case 'celebration':
      return 'bg-purple-600'
    case 'warning':
      return 'bg-amber-600'
    case 'cta':
      return 'bg-blue-600'
    case 'info':
    default:
      return 'bg-slate-600'
  }
}

function getButtonStyles(type: Nudge['type']): string {
  switch (type) {
    case 'success':
      return 'bg-white text-emerald-600 hover:bg-emerald-50'
    case 'celebration':
      return 'bg-white text-purple-600 hover:bg-purple-50'
    case 'warning':
      return 'bg-white text-amber-600 hover:bg-amber-50'
    case 'cta':
      return 'bg-white text-blue-600 hover:bg-blue-50'
    case 'info':
    default:
      return 'bg-white text-slate-700 hover:bg-slate-50'
  }
}
