/**
 * Achievement Badge Display
 *
 * Shows unlocked achievements with:
 * - Badge icons and titles
 * - Points and rarity
 * - Progress towards next achievement
 * - Achievement tier display
 *
 * Compact design suitable for sidebar or modal
 */

import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, Award, Star, Lock } from 'lucide-react'
import { useJourneyStore } from '../../stores/journeyStore'
import { ACHIEVEMENTS, type Achievement } from '../../utils/achievementSystem'
import { useState } from 'react'

interface AchievementBadgeDisplayProps {
  compact?: boolean
  showProgress?: boolean
  maxDisplay?: number
}

/**
 * Get rarity color classes
 */
function getRarityColor(rarity: Achievement['rarity']): string {
  const colors = {
    common: 'from-gray-500 to-gray-600 border-gray-400',
    rare: 'from-blue-500 to-blue-600 border-blue-400',
    epic: 'from-purple-500 to-purple-600 border-purple-400',
    legendary: 'from-yellow-500 to-orange-600 border-yellow-400',
  }
  return colors[rarity]
}

/**
 * Single achievement badge
 */
function AchievementBadge({
  achievement,
  unlocked,
}: {
  achievement: Achievement
  unlocked: boolean
}) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <motion.div
      className="relative"
      onHoverStart={() => setShowDetails(true)}
      onHoverEnd={() => setShowDetails(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Badge */}
      <div
        className={`
          w-16 h-16 rounded-xl
          flex items-center justify-center
          transition-all duration-300
          ${
            unlocked
              ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} shadow-lg`
              : 'border border-white/10'
          }
        `}
      >
        {unlocked ? (
          <span className="text-3xl">{achievement.badgeIcon}</span>
        ) : (
          <Lock className="w-6 h-6 text-white/30" />
        )}
      </div>

      {/* Rarity indicator */}
      {unlocked && (
        <div
          className={`
            absolute -top-1 -right-1 w-5 h-5 rounded-full
            bg-gradient-to-br ${getRarityColor(achievement.rarity)}
            flex items-center justify-center
            border-2 border-[#1a1a2e]
          `}
        >
          {achievement.rarity === 'legendary' && (
            <Star className="w-3 h-3 text-white" fill="white" />
          )}
          {achievement.rarity === 'epic' && <Award className="w-3 h-3 text-white" />}
          {achievement.rarity === 'rare' && <Trophy className="w-3 h-3 text-white" />}
        </div>
      )}

      {/* Tooltip on hover */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="
              absolute bottom-full left-1/2 -translate-x-1/2 mb-2
              w-64 p-3 rounded-xl
              bg-gradient-to-br from-gray-900/95 to-gray-800/95
              backdrop-blur-xl
              border border-white/10
              shadow-2xl
              z-50
              pointer-events-none
            "
          >
            <div className="flex items-start gap-2 mb-2">
              <span className="text-2xl">{achievement.badgeIcon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white text-sm mb-1">{achievement.title}</h4>
                <p className="text-xs text-white/70 leading-tight">{achievement.description}</p>
              </div>
            </div>

            {/* Points & Rarity */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/60">{achievement.rarity.toUpperCase()}</span>
              <span className="font-bold text-yellow-400">+{achievement.points} pts</span>
            </div>

            {/* Reward if available */}
            {achievement.reward && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-xs text-green-400">🎁 {achievement.reward}</p>
              </div>
            )}

            {/* Requirement if locked */}
            {!unlocked && (
              <div className="mt-2 pt-2 border-t border-white/10">
                <p className="text-xs text-white/50">🔒 {achievement.requirement}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function AchievementBadgeDisplay({
  compact = false,
  showProgress = true,
  maxDisplay = 8,
}: AchievementBadgeDisplayProps) {
  const { unlockedAchievements, totalPoints, getAchievementTier, getTotalAchievements } =
    useJourneyStore()

  const allAchievements = Object.values(ACHIEVEMENTS)
  const tier = getAchievementTier()
  const stats = getTotalAchievements()

  // Show recently unlocked or highest rarity unlocked
  const displayAchievements = allAchievements
    .filter((a) => unlockedAchievements.includes(a.id))
    .sort((a, b) => {
      const rarityOrder = { legendary: 4, epic: 3, rare: 2, common: 1 }
      return rarityOrder[b.rarity] - rarityOrder[a.rarity]
    })
    .slice(0, maxDisplay)

  // Fill remaining slots with locked achievements
  const remainingSlots = maxDisplay - displayAchievements.length
  const lockedToShow = allAchievements
    .filter((a) => !unlockedAchievements.includes(a.id))
    .slice(0, remainingSlots)

  const displayList = [...displayAchievements, ...lockedToShow]

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-xl">{tier.icon}</span>
          <span className="text-sm font-bold text-white">{totalPoints}</span>
        </div>
        <div className="text-xs text-white/50">
          {stats.unlocked}/{stats.total} unlocked
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header with tier */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white mb-1">Achievements</h3>
          <p className="text-xs text-white/60">
            {stats.unlocked} of {stats.total} unlocked ({stats.percentage}%)
          </p>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-2xl">{tier.icon}</span>
            <span className="text-lg font-bold text-white">{tier.tier}</span>
          </div>
          <p className="text-xs text-yellow-400 font-semibold">{totalPoints} points</p>
        </div>
      </div>

      {/* Progress to next tier */}
      {showProgress && tier.nextTierPoints > 0 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white/60">Next tier</span>
            <span className="text-white/60">{tier.nextTierPoints - totalPoints} points to go</span>
          </div>
          <div className="h-1.5 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-500 to-orange-500"
              initial={{ width: 0 }}
              animate={{
                width: `${(totalPoints / tier.nextTierPoints) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
      )}

      {/* Badge grid */}
      <div className="grid grid-cols-4 gap-3">
        {displayList.map((achievement) => (
          <AchievementBadge
            key={achievement.id}
            achievement={achievement}
            unlocked={unlockedAchievements.includes(achievement.id)}
          />
        ))}
      </div>

      {/* View all link */}
      {allAchievements.length > maxDisplay && (
        <button
          className="
            w-full py-2 text-xs text-white/60
            hover:text-white/90 transition-colors
            border border-white/10 rounded-lg
            hover:border-white/20
          "
        >
          View All {allAchievements.length} Achievements →
        </button>
      )}
    </div>
  )
}
