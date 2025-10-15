/**
 * Celebration Toast
 *
 * Brief (2-second) celebratory moments for milestone achievements.
 * Research shows these create dopamine responses that encourage continued engagement.
 *
 * Based on 2025 best practices: celebrations must be brief and dismissible.
 */

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { X, Award, Trophy, Star, Zap, Target } from 'lucide-react'

interface CelebrationToastProps {
  milestone: {
    id: string
    title: string
    description: string
    badgeIcon: string
  } | null
  onDismiss: () => void
  duration?: number // ms, default 2000
}

/**
 * Get icon component based on milestone type
 */
function getMilestoneIcon(milestoneId: string) {
  const icons: Record<string, any> = {
    first_step: Target,
    explorer: Zap,
    deep_dive: Star,
    roi_calculator: Award,
    demo_booked: Trophy,
    journey_master: Trophy,
  }

  return icons[milestoneId] || Award
}

/**
 * Confetti particle component
 */
function Confetti() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: -20 - Math.random() * 30,
    rotation: Math.random() * 360,
    color: ['#FFD700', '#FFA500', '#FF69B4', '#00CED1', '#9370DB'][Math.floor(Math.random() * 5)],
  }))

  return (
    <>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 rounded-full"
          style={{ backgroundColor: particle.color }}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 0,
          }}
          animate={{
            x: particle.x,
            y: particle.y,
            opacity: 0,
            scale: 1,
            rotate: particle.rotation,
          }}
          transition={{
            duration: 1.5,
            ease: 'easeOut',
          }}
        />
      ))}
    </>
  )
}

export default function CelebrationToast({
  milestone,
  onDismiss,
  duration = 2000,
}: CelebrationToastProps) {
  const [isVisible, setIsVisible] = useState(!!milestone)

  useEffect(() => {
    if (milestone) {
      setIsVisible(true)

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        setIsVisible(false)
        setTimeout(onDismiss, 300) // Wait for exit animation
      }, duration)

      return () => clearTimeout(timer)
    }

    // No cleanup needed if there's no milestone
    return undefined
  }, [milestone, duration, onDismiss])

  if (!milestone) {
    return null
  }

  const Icon = getMilestoneIcon(milestone.id)

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed bottom-20 right-6 z-50 max-w-sm"
          role="alert"
          aria-live="polite"
        >
          {/* Confetti Effect */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <Confetti />
          </div>

          {/* Toast Card */}
          <div className="relative bg-gradient-to-br from-yellow-400/90 via-orange-400/90 to-pink-500/90 backdrop-blur-xl border border-yellow-300/50 rounded-2xl shadow-2xl shadow-yellow-500/50 p-4 overflow-hidden">
            {/* Animated Background Pattern */}
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Content */}
            <div className="relative flex items-start gap-3">
              {/* Icon Badge */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                className="shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg"
              >
                <span className="text-2xl">{milestone.badgeIcon}</span>
              </motion.div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <Icon className="w-4 h-4 text-white" />
                  <h3 className="font-bold text-white text-sm">🎉 Achievement Unlocked!</h3>
                </div>
                <p className="text-white font-semibold text-base leading-tight mb-1">
                  {milestone.title}
                </p>
                <p className="text-white/90 text-xs leading-tight">{milestone.description}</p>
              </div>

              {/* Dismiss Button */}
              <button
                onClick={() => {
                  setIsVisible(false)
                  setTimeout(onDismiss, 300)
                }}
                className="shrink-0 p-1 hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Dismiss celebration"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Progress Bar */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-white/30"
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: duration / 1000, ease: 'linear' }}
              style={{ transformOrigin: 'left' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
