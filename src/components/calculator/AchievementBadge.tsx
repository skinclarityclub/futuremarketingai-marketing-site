/**
 * AchievementBadge Component
 *
 * Gamified badge system for ROI milestones with unlock animations.
 *
 * Features:
 * - Tiered badges (Bronze, Silver, Gold, Platinum, Diamond)
 * - Unlock animations with confetti effect
 * - Social media sharing ready
 * - Shareable badge images
 * - Responsive design
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '../common/GlassCard'
import { usePrefersReducedMotion } from '../../hooks'

export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'

export interface Badge {
  tier: BadgeTier
  name: string
  description: string
  threshold: number // ROI percentage threshold
  icon: string
  color: string
  gradient: string
  glow: string
}

export interface AchievementBadgeProps {
  roi: number
  currentROAS?: number // Optional ROAS for ad efficiency badges
  className?: string
  onUnlock?: (badge: Badge) => void
}

// Badge definitions with thresholds
export const BADGES: Badge[] = [
  {
    tier: 'bronze',
    name: 'Getting Started',
    description: 'Achieved 100% ROI',
    threshold: 100,
    icon: '🥉',
    color: 'from-orange-600 to-orange-400',
    gradient: 'linear-gradient(135deg, rgb(234, 88, 12) 0%, rgb(251, 146, 60) 100%)',
    glow: 'shadow-orange-500/50',
  },
  {
    tier: 'silver',
    name: 'Rising Star',
    description: 'Achieved 200% ROI',
    threshold: 200,
    icon: '🥈',
    color: 'from-gray-400 to-gray-200',
    gradient: 'linear-gradient(135deg, rgb(156, 163, 175) 0%, rgb(229, 231, 235) 100%)',
    glow: 'shadow-gray-400/50',
  },
  {
    tier: 'gold',
    name: 'Champion',
    description: 'Achieved 300% ROI',
    threshold: 300,
    icon: '🥇',
    color: 'from-yellow-500 to-yellow-300',
    gradient: 'linear-gradient(135deg, rgb(234, 179, 8) 0%, rgb(253, 224, 71) 100%)',
    glow: 'shadow-yellow-500/50',
  },
  {
    tier: 'platinum',
    name: 'Elite Performer',
    description: 'Achieved 400% ROI',
    threshold: 400,
    icon: '💎',
    color: 'from-cyan-400 to-blue-400',
    gradient: 'linear-gradient(135deg, rgb(34, 211, 238) 0%, rgb(96, 165, 250) 100%)',
    glow: 'shadow-cyan-400/50',
  },
  {
    tier: 'diamond',
    name: 'ROI Master',
    description: 'Achieved 500%+ ROI',
    threshold: 500,
    icon: '👑',
    color: 'from-purple-500 to-pink-500',
    gradient: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)',
    glow: 'shadow-purple-500/50',
  },
]

// ROAS-specific badges for ad efficiency
export const ROAS_BADGES: Badge[] = [
  {
    tier: 'bronze',
    name: 'Ad Testing Beginner',
    description: 'Achieved 3:1 ROAS',
    threshold: 3,
    icon: '🧪',
    color: 'from-orange-600 to-orange-400',
    gradient: 'linear-gradient(135deg, rgb(234, 88, 12) 0%, rgb(251, 146, 60) 100%)',
    glow: 'shadow-orange-500/50',
  },
  {
    tier: 'silver',
    name: 'Testing Pro',
    description: 'Achieved 5:1 ROAS',
    threshold: 5,
    icon: '🎯',
    color: 'from-gray-400 to-gray-200',
    gradient: 'linear-gradient(135deg, rgb(156, 163, 175) 0%, rgb(229, 231, 235) 100%)',
    glow: 'shadow-gray-400/50',
  },
  {
    tier: 'gold',
    name: 'Ad Efficiency Expert',
    description: 'Achieved 7:1 ROAS',
    threshold: 7,
    icon: '💎',
    color: 'from-yellow-500 to-yellow-300',
    gradient: 'linear-gradient(135deg, rgb(234, 179, 8) 0%, rgb(253, 224, 71) 100%)',
    glow: 'shadow-yellow-500/50',
  },
  {
    tier: 'platinum',
    name: 'ROAS Master',
    description: 'Achieved 10:1 ROAS',
    threshold: 10,
    icon: '🚀',
    color: 'from-cyan-400 to-blue-400',
    gradient: 'linear-gradient(135deg, rgb(34, 211, 238) 0%, rgb(96, 165, 250) 100%)',
    glow: 'shadow-cyan-400/50',
  },
  {
    tier: 'diamond',
    name: 'Testing Legend',
    description: 'Achieved 12:1+ ROAS',
    threshold: 12,
    icon: '👑',
    color: 'from-purple-500 to-pink-500',
    gradient: 'linear-gradient(135deg, rgb(168, 85, 247) 0%, rgb(236, 72, 153) 100%)',
    glow: 'shadow-purple-500/50',
  },
]

/**
 * AchievementBadge Component
 *
 * Displays earned badges based on ROI with unlock animation
 */
const AchievementBadge: React.FC<AchievementBadgeProps> = ({
  roi,
  currentROAS: _currentROAS,
  className = '',
  onUnlock,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion()
  const [earnedBadges, setEarnedBadges] = useState<Badge[]>([])
  const [newlyUnlocked, setNewlyUnlocked] = useState<Badge | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  // Determine earned badges based on ROI
  useEffect(() => {
    const earned = BADGES.filter((badge) => roi >= badge.threshold)
    const previousHighest = earnedBadges[earnedBadges.length - 1]
    const currentHighest = earned[earned.length - 1]

    // Check if a new badge was unlocked
    if (currentHighest && currentHighest.tier !== previousHighest?.tier) {
      setNewlyUnlocked(currentHighest)
      setShowConfetti(true)
      onUnlock?.(currentHighest)

      // Hide unlock notification after 5 seconds
      setTimeout(() => {
        setNewlyUnlocked(null)
        setShowConfetti(false)
      }, 5000)
    }

    setEarnedBadges(earned)
  }, [roi])

  const highestBadge = earnedBadges[earnedBadges.length - 1]
  const nextBadge = BADGES.find((badge) => badge.threshold > roi)
  const progressToNext = nextBadge
    ? ((roi - (highestBadge?.threshold || 0)) /
        (nextBadge.threshold - (highestBadge?.threshold || 0))) *
      100
    : 100

  return (
    <div className={`achievement-badge-container ${className}`}>
      {/* Confetti Effect - Disabled for reduced motion */}
      <AnimatePresence>
        {showConfetti && !prefersReducedMotion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center"
          >
            {/* Reduced particle count from 50 to 20 for performance */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  rotate: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * window.innerWidth,
                  y: (Math.random() - 0.5) * window.innerHeight,
                  scale: Math.random() * 1.5 + 0.5,
                  rotate: Math.random() * 360,
                }}
                transition={{
                  duration: 1.5, // Reduced from 2s
                  delay: Math.random() * 0.2, // Reduced from 0.3s
                  ease: 'easeOut',
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ['#fbbf24', '#f472b6', '#60a5fa', '#34d399', '#a78bfa'][i % 5],
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Unlock Notification */}
      <AnimatePresence>
        {newlyUnlocked && (
          <motion.div
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.3 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-50 max-w-md"
          >
            <GlassCard className="p-6 border-2 border-accent-success">
              <div className="text-center">
                <motion.div
                  initial={
                    prefersReducedMotion ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }
                  }
                  animate={{ scale: 1, rotate: 0 }}
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : { type: 'spring', stiffness: 200, damping: 15 }
                  }
                  className="text-6xl mb-3"
                >
                  {newlyUnlocked.icon}
                </motion.div>
                <h3 className="text-xl font-bold text-white mb-2">🎉 Badge Unlocked!</h3>
                <p className="text-lg font-semibold text-accent-primary mb-1">
                  {newlyUnlocked.name}
                </p>
                <p className="text-sm text-white/70">{newlyUnlocked.description}</p>
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Display */}
      <GlassCard className="p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">🏆 Achievement Badges</h3>
          {highestBadge && (
            <div className="px-3 py-1 rounded-full bg-accent-primary/20 border border-accent-primary/30">
              <span className="text-xs font-semibold text-accent-primary">
                {highestBadge.tier.toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Current Badge Showcase */}
        {highestBadge ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div
              className="relative p-8 rounded-2xl overflow-hidden"
              style={{ background: highestBadge.gradient }}
            >
              <div className="relative z-10 text-center">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="text-7xl mb-4 drop-shadow-2xl"
                >
                  {highestBadge.icon}
                </motion.div>
                <h4 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
                  {highestBadge.name}
                </h4>
                <p className="text-white/90 text-sm drop-shadow-md">{highestBadge.description}</p>
              </div>

              {/* Animated background particles */}
              <div className="absolute inset-0 opacity-30">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-white rounded-full"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                      y: [0, -30, 0],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{
                      duration: 3 + Math.random() * 2,
                      repeat: Infinity,
                      delay: Math.random() * 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <div className="mb-8 p-8 rounded-2xl bg-white/5 border border-white/10 text-center">
            <div className="text-5xl mb-3 opacity-50">🎯</div>
            <p className="text-white/70">Reach 100% ROI to unlock your first badge!</p>
          </div>
        )}

        {/* Progress to Next Badge */}
        {nextBadge && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">
                Next: {nextBadge.icon} {nextBadge.name}
              </span>
              <span className="text-sm font-semibold text-accent-primary">
                {Math.round(progressToNext)}%
              </span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressToNext, 100)}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary"
              />
            </div>
            <p className="text-xs text-white/60 mt-2">{nextBadge.threshold - roi}% ROI to go!</p>
          </div>
        )}

        {/* All Badges Overview */}
        <div className="grid grid-cols-5 gap-2 md:gap-3">
          {BADGES.map((badge, index) => {
            const isEarned = earnedBadges.some((b) => b.tier === badge.tier)
            const isNext = nextBadge?.tier === badge.tier

            return (
              <motion.div
                key={badge.tier}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-3 rounded-xl text-center transition-all ${
                  isEarned
                    ? 'bg-white/10 border-2 border-accent-primary'
                    : isNext
                      ? 'bg-white/5 border-2 border-accent-secondary/50 animate-pulse'
                      : 'bg-white/5 border border-white/10 opacity-50'
                }`}
                whileHover={{ scale: isEarned ? 1.1 : 1.05 }}
                title={`${badge.name} - ${badge.description}`}
              >
                <div className={`text-2xl md:text-3xl ${!isEarned && 'grayscale opacity-30'}`}>
                  {badge.icon}
                </div>
                {isEarned && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-success rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Share Buttons */}
        {highestBadge && (
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-sm text-white/70 mb-3 text-center">Share your achievement:</p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => {
                  const text = `🏆 I just earned the "${highestBadge.name}" badge with ${Math.round(roi)}% ROI! #MarketingAutomation #ROI`
                  window.open(
                    `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
                    '_blank'
                  )
                }}
                className="px-4 py-2 rounded-lg bg-[#1DA1F2] hover:bg-[#1a8cd8] text-white text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  Twitter
                </span>
              </button>
              <button
                onClick={() => {
                  const url = window.location.href
                  const text = `I just earned the "${highestBadge.name}" badge with ${Math.round(roi)}% ROI!`
                  window.open(
                    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
                    '_blank'
                  )
                }}
                className="px-4 py-2 rounded-lg bg-[#0077B5] hover:bg-[#006399] text-white text-sm font-medium transition-colors"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn
                </span>
              </button>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  )
}

export default AchievementBadge
