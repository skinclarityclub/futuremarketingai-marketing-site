/**
 * Achievement Tracking Hook
 *
 * Automatically checks for and unlocks achievements based on:
 * - Journey progress
 * - Module views
 * - User interactions
 * - Time on site
 * - ICP score
 *
 * Returns newly unlocked achievements for celebration display
 *
 * @module useAchievementTracking
 */

import { useEffect, useState, useCallback } from 'react'
import { useJourneyStore } from '../stores/journeyStore'
import { usePersonalizationStore } from '../stores/personalizationStore'
import type { Achievement } from '../utils/achievementSystem'

/**
 * Track achievements and return newly unlocked ones
 */
export function useAchievementTracking() {
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([])
  const [isChecking, setIsChecking] = useState(false)

  // Get stores
  const {
    modulesViewedCount,
    hasUsedCalculator,
    hasScheduledDemo,
    hasSeenPricing,
    timeOnSiteSeconds,
    questionsAsked,
    hasCompletedContactForm,
    checkAndUnlockAchievements,
  } = useJourneyStore()

  const { icpScore } = usePersonalizationStore()

  /**
   * Check for achievements
   */
  const checkAchievements = useCallback(() => {
    if (isChecking) {
      return
    }

    setIsChecking(true)

    try {
      const unlocked = checkAndUnlockAchievements(icpScore?.overall || 0)

      if (unlocked.length > 0) {
        setNewlyUnlocked(unlocked)
      }
    } catch (error) {
      console.error('Error checking achievements:', error)
    } finally {
      setIsChecking(false)
    }
  }, [checkAndUnlockAchievements, icpScore, isChecking])

  /**
   * Check achievements when relevant state changes
   */
  useEffect(() => {
    // Debounce checks to avoid excessive re-renders
    const timeout = setTimeout(() => {
      checkAchievements()
    }, 500)

    return () => clearTimeout(timeout)
  }, [
    modulesViewedCount,
    hasUsedCalculator,
    hasScheduledDemo,
    hasSeenPricing,
    Math.floor(timeOnSiteSeconds / 60), // Check every minute
    questionsAsked,
    hasCompletedContactForm,
    icpScore?.overall,
  ])

  /**
   * Clear newly unlocked after celebration
   */
  const clearNewlyUnlocked = useCallback(() => {
    setNewlyUnlocked([])
  }, [])

  return {
    newlyUnlocked,
    clearNewlyUnlocked,
    checkAchievements,
  }
}

/**
 * Track question asks (for question_master achievement)
 */
export function useQuestionTracking() {
  const { trackQuestionAsked } = useJourneyStore()

  const trackQuestion = useCallback(() => {
    trackQuestionAsked()
  }, [trackQuestionAsked])

  return { trackQuestion }
}

/**
 * Track contact form completion
 */
export function useContactFormTracking() {
  const { trackContactFormCompleted } = useJourneyStore()

  const trackFormCompletion = useCallback(() => {
    trackContactFormCompleted()
  }, [trackContactFormCompleted])

  return { trackFormCompletion }
}

/**
 * Get achievement tier display
 */
export function useAchievementTier() {
  const { getAchievementTier, totalPoints, unlockedAchievements } = useJourneyStore()

  const tier = getAchievementTier()

  return {
    tier: tier.tier,
    icon: tier.icon,
    totalPoints,
    nextTierPoints: tier.nextTierPoints,
    unlockedCount: unlockedAchievements.length,
  }
}

/**
 * Get next suggested achievement to work towards
 */
export function useNextAchievement() {
  const { getNextSuggestedAchievement } = useJourneyStore()
  const { icpScore } = usePersonalizationStore()

  const nextAchievement = getNextSuggestedAchievement(icpScore?.overall || 0)

  return { nextAchievement }
}

export default useAchievementTracking
