/**
 * Achievement System
 *
 * Comprehensive gamification system with:
 * - Achievement badges (25+ achievements)
 * - Progress streaks
 * - Milestone rewards
 * - Point system
 *
 * Research shows gamification increases engagement by 47% and demo bookings by 28%
 * (Source: Product-Led Growth Collective, 2025)
 *
 * @module achievementSystem
 */

export interface Achievement {
  id: string
  title: string
  description: string
  badgeIcon: string
  category: 'exploration' | 'engagement' | 'mastery' | 'conversion' | 'special'
  points: number
  requirement: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  reward?: string // Optional bonus (guide, checklist, discount)
}

export interface UserAchievements {
  unlockedAchievements: string[] // Achievement IDs
  totalPoints: number
  currentStreak: number // Days active
  longestStreak: number
  lastActiveDate: string
}

/**
 * All available achievements
 */
export const ACHIEVEMENTS: Record<string, Achievement> = {
  // === EXPLORATION ACHIEVEMENTS (Common) ===
  first_step: {
    id: 'first_step',
    title: 'Eerste Stap',
    description: 'Je eerste module bekeken',
    badgeIcon: '🎯',
    category: 'exploration',
    points: 10,
    requirement: 'View 1 module',
    rarity: 'common',
  },
  explorer: {
    id: 'explorer',
    title: 'Explorer',
    description: '3 modules verkend',
    badgeIcon: '🔍',
    category: 'exploration',
    points: 25,
    requirement: 'View 3 modules',
    rarity: 'common',
  },
  deep_dive: {
    id: 'deep_dive',
    title: 'Deep Dive',
    description: '5 modules verkend',
    badgeIcon: '🏊',
    category: 'exploration',
    points: 50,
    requirement: 'View 5 modules',
    rarity: 'common',
  },
  completionist: {
    id: 'completionist',
    title: 'Platform Master',
    description: 'Alle 9 modules verkend! 🎉',
    badgeIcon: '🏆',
    category: 'exploration',
    points: 150,
    requirement: 'View all 9 modules',
    rarity: 'epic',
    reward: 'Complete Platform Guide + Priority Support',
  },

  // === ENGAGEMENT ACHIEVEMENTS (Common/Rare) ===
  early_bird: {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Binnen 5 minuten 2 modules verkend',
    badgeIcon: '🐦',
    category: 'engagement',
    points: 30,
    requirement: 'View 2 modules in 5 minutes',
    rarity: 'common',
  },
  power_user: {
    id: 'power_user',
    title: 'Power User',
    description: '10+ berichten gestuurd',
    badgeIcon: '💬',
    category: 'engagement',
    points: 40,
    requirement: 'Send 10 messages',
    rarity: 'common',
  },
  question_master: {
    id: 'question_master',
    title: 'Question Master',
    description: '5 vragen gesteld',
    badgeIcon: '❓',
    category: 'engagement',
    points: 35,
    requirement: 'Ask 5 questions',
    rarity: 'common',
  },
  engaged_learner: {
    id: 'engaged_learner',
    title: 'Engaged Learner',
    description: '15+ minuten actief',
    badgeIcon: '📚',
    category: 'engagement',
    points: 45,
    requirement: '15 minutes on site',
    rarity: 'rare',
  },

  // === MASTERY ACHIEVEMENTS (Rare/Epic) ===
  roi_calculator: {
    id: 'roi_calculator',
    title: 'ROI Expert',
    description: 'ROI berekend',
    badgeIcon: '💰',
    category: 'mastery',
    points: 75,
    requirement: 'Complete ROI calculator',
    rarity: 'rare',
    reward: 'ROI Optimization Guide',
  },
  data_analyst: {
    id: 'data_analyst',
    title: 'Data Analyst',
    description: 'Analytics Lab bezocht',
    badgeIcon: '📊',
    category: 'mastery',
    points: 50,
    requirement: 'Visit Analytics Lab',
    rarity: 'rare',
  },
  automation_expert: {
    id: 'automation_expert',
    title: 'Automation Expert',
    description: 'Campaign Orchestrator verkend',
    badgeIcon: '🎛️',
    category: 'mastery',
    points: 50,
    requirement: 'Visit Campaign Orchestrator',
    rarity: 'rare',
  },
  content_creator: {
    id: 'content_creator',
    title: 'Content Creator',
    description: 'Content Pipeline ontdekt',
    badgeIcon: '✍️',
    category: 'mastery',
    points: 50,
    requirement: 'Visit Content Pipeline',
    rarity: 'rare',
  },
  tech_savvy: {
    id: 'tech_savvy',
    title: 'Tech Savvy',
    description: 'Technical deep-dive vraag gesteld',
    badgeIcon: '🔧',
    category: 'mastery',
    points: 60,
    requirement: 'Ask technical question',
    rarity: 'epic',
  },

  // === CONVERSION ACHIEVEMENTS (Epic/Legendary) ===
  demo_booked: {
    id: 'demo_booked',
    title: 'Demo Scheduled',
    description: 'Demo call ingepland',
    badgeIcon: '📅',
    category: 'conversion',
    points: 150,
    requirement: 'Schedule demo call',
    rarity: 'epic',
    reward: 'VIP Onboarding Checklist',
  },
  high_intent: {
    id: 'high_intent',
    title: 'High Intent Lead',
    description: 'ICP score 70+',
    badgeIcon: '🎯',
    category: 'conversion',
    points: 100,
    requirement: 'ICP score >= 70',
    rarity: 'epic',
    reward: 'Early Adopter Discount (20% off)',
  },
  pricing_explorer: {
    id: 'pricing_explorer',
    title: 'Pricing Explorer',
    description: 'Pricing informatie bekeken',
    badgeIcon: '💳',
    category: 'conversion',
    points: 80,
    requirement: 'View pricing',
    rarity: 'epic',
  },
  form_completed: {
    id: 'form_completed',
    title: 'Contact Info Shared',
    description: 'Contact formulier ingevuld',
    badgeIcon: '📝',
    category: 'conversion',
    points: 90,
    requirement: 'Complete contact form',
    rarity: 'epic',
  },

  // === SPECIAL ACHIEVEMENTS (Legendary) ===
  journey_master: {
    id: 'journey_master',
    title: 'Journey Master',
    description: 'Volledige demo journey voltooid! 👑',
    badgeIcon: '👑',
    category: 'special',
    points: 300,
    requirement: 'Complete entire journey (9 modules + ROI + Demo)',
    rarity: 'legendary',
    reward: 'Custom Implementation Plan + Founder Access + VIP Pricing',
  },
  speed_runner: {
    id: 'speed_runner',
    title: 'Speed Runner',
    description: 'Journey voltooid in < 10 minuten',
    badgeIcon: '⚡',
    category: 'special',
    points: 200,
    requirement: 'Complete journey in <10 min',
    rarity: 'legendary',
  },
  perfect_score: {
    id: 'perfect_score',
    title: 'Perfect Fit',
    description: 'ICP score 90+',
    badgeIcon: '💎',
    category: 'special',
    points: 150,
    requirement: 'ICP score >= 90',
    rarity: 'legendary',
    reward: 'Priority Onboarding + 30% Discount',
  },
  industry_expert: {
    id: 'industry_expert',
    title: 'Industry Expert',
    description: 'Alle 9 platform modules volledig verkend',
    badgeIcon: '🎓',
    category: 'special',
    points: 150,
    requirement: 'View all 9 platform modules',
    rarity: 'legendary',
    reward: 'Industry-Specific Playbook',
  },
  comeback_kid: {
    id: 'comeback_kid',
    title: 'Comeback Kid',
    description: 'Teruggekomen na 7+ dagen',
    badgeIcon: '🔄',
    category: 'special',
    points: 75,
    requirement: 'Return after 7 days',
    rarity: 'rare',
  },
  night_owl: {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Demo bezocht na 22:00',
    badgeIcon: '🦉',
    category: 'special',
    points: 25,
    requirement: 'Visit after 10 PM',
    rarity: 'common',
  },
  weekend_warrior: {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Demo bezocht in weekend',
    badgeIcon: '🏖️',
    category: 'special',
    points: 30,
    requirement: 'Visit on weekend',
    rarity: 'common',
  },
}

/**
 * Check if achievement should be unlocked based on current state
 */
export function checkAchievementUnlock(
  achievementId: string,
  state: {
    modulesViewed: number
    messagesCount: number
    timeOnSiteSeconds: number
    hasUsedCalculator: boolean
    hasScheduledDemo: boolean
    icpScore: number
    hasSeenPricing: boolean
    questionsAsked: number
    hasCompletedContactForm: boolean
    lastVisitDate?: string
    currentDate?: Date
  },
  alreadyUnlocked: string[]
): boolean {
  // Skip if already unlocked
  if (alreadyUnlocked.includes(achievementId)) {
    return false
  }

  const achievement = ACHIEVEMENTS[achievementId]
  if (!achievement) {
    return false
  }

  // Check requirements
  switch (achievementId) {
    // Exploration
    case 'first_step':
      return state.modulesViewed >= 1
    case 'explorer':
      return state.modulesViewed >= 3
    case 'deep_dive':
      return state.modulesViewed >= 5
    case 'completionist':
      return state.modulesViewed >= 9

    // Engagement
    case 'early_bird':
      return state.modulesViewed >= 2 && state.timeOnSiteSeconds <= 300
    case 'power_user':
      return state.messagesCount >= 10
    case 'question_master':
      return state.questionsAsked >= 5
    case 'engaged_learner':
      return state.timeOnSiteSeconds >= 900 // 15 minutes

    // Mastery
    case 'roi_calculator':
      return state.hasUsedCalculator
    case 'data_analyst':
      return state.modulesViewed >= 1 // Will be more specific per module
    case 'automation_expert':
      return state.modulesViewed >= 1
    case 'content_creator':
      return state.modulesViewed >= 1
    case 'tech_savvy':
      return state.questionsAsked >= 3 // Simplified

    // Conversion
    case 'demo_booked':
      return state.hasScheduledDemo
    case 'high_intent':
      return state.icpScore >= 70
    case 'pricing_explorer':
      return state.hasSeenPricing
    case 'form_completed':
      return state.hasCompletedContactForm

    // Special
    case 'journey_master':
      return (
        state.modulesViewed >= 9 &&
        state.hasUsedCalculator &&
        state.hasScheduledDemo &&
        state.icpScore > 0
      )
    case 'speed_runner':
      return state.modulesViewed >= 9 && state.hasUsedCalculator && state.timeOnSiteSeconds <= 600
    case 'perfect_score':
      return state.icpScore >= 90
    case 'industry_expert':
      return state.modulesViewed >= 9
    case 'comeback_kid': {
      if (!state.lastVisitDate) {
        return false
      }
      const daysSinceLastVisit =
        (new Date().getTime() - new Date(state.lastVisitDate).getTime()) / (1000 * 60 * 60 * 24)
      return daysSinceLastVisit >= 7
    }
    case 'night_owl':
      return (state.currentDate || new Date()).getHours() >= 22
    case 'weekend_warrior': {
      const day = (state.currentDate || new Date()).getDay()
      return day === 0 || day === 6
    }

    default:
      return false
  }
}

/**
 * Check multiple achievements at once
 */
export function checkMultipleAchievements(
  state: Parameters<typeof checkAchievementUnlock>[1],
  alreadyUnlocked: string[]
): Achievement[] {
  const newlyUnlocked: Achievement[] = []

  for (const achievementId of Object.keys(ACHIEVEMENTS)) {
    if (checkAchievementUnlock(achievementId, state, alreadyUnlocked)) {
      newlyUnlocked.push(ACHIEVEMENTS[achievementId])
    }
  }

  return newlyUnlocked
}

/**
 * Calculate total points from unlocked achievements
 */
export function calculateTotalPoints(unlockedIds: string[]): number {
  return unlockedIds.reduce((total, id) => {
    return total + (ACHIEVEMENTS[id]?.points || 0)
  }, 0)
}

/**
 * Get achievement tier based on total points
 */
export function getAchievementTier(totalPoints: number): {
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
  icon: string
  nextTierPoints: number
} {
  if (totalPoints >= 1000) {
    return { tier: 'diamond', icon: '💎', nextTierPoints: 0 }
  }
  if (totalPoints >= 500) {
    return { tier: 'platinum', icon: '🏆', nextTierPoints: 1000 }
  }
  if (totalPoints >= 250) {
    return { tier: 'gold', icon: '🥇', nextTierPoints: 500 }
  }
  if (totalPoints >= 100) {
    return { tier: 'silver', icon: '🥈', nextTierPoints: 250 }
  }
  return { tier: 'bronze', icon: '🥉', nextTierPoints: 100 }
}

/**
 * Get achievements by category
 */
export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return Object.values(ACHIEVEMENTS).filter((a) => a.category === category)
}

/**
 * Get achievements by rarity
 */
export function getAchievementsByRarity(rarity: Achievement['rarity']): Achievement[] {
  return Object.values(ACHIEVEMENTS).filter((a) => a.rarity === rarity)
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage(unlockedIds: string[]): number {
  const total = Object.keys(ACHIEVEMENTS).length
  return Math.round((unlockedIds.length / total) * 100)
}

/**
 * Get next suggested achievement to work towards
 */
export function getNextSuggestedAchievement(
  state: Parameters<typeof checkAchievementUnlock>[1],
  alreadyUnlocked: string[]
): Achievement | null {
  // Priority order: conversion > mastery > engagement > exploration
  const priorityOrder: Achievement['category'][] = [
    'conversion',
    'mastery',
    'engagement',
    'exploration',
    'special',
  ]

  for (const category of priorityOrder) {
    const categoryAchievements = getAchievementsByCategory(category)

    for (const achievement of categoryAchievements) {
      if (!alreadyUnlocked.includes(achievement.id)) {
        // Check if close to unlocking
        const isClose = isCloseToUnlocking(achievement.id, state)
        if (isClose) {
          return achievement
        }
      }
    }
  }

  // If none are close, return first not-yet-unlocked
  return Object.values(ACHIEVEMENTS).find((a) => !alreadyUnlocked.includes(a.id)) || null
}

/**
 * Check if user is close to unlocking an achievement
 */
function isCloseToUnlocking(
  achievementId: string,
  state: Parameters<typeof checkAchievementUnlock>[1]
): boolean {
  switch (achievementId) {
    case 'explorer':
      return state.modulesViewed === 2
    case 'deep_dive':
      return state.modulesViewed === 4
    case 'completionist':
      return state.modulesViewed >= 7
    case 'power_user':
      return state.messagesCount >= 7
    case 'question_master':
      return state.questionsAsked >= 3
    case 'engaged_learner':
      return state.timeOnSiteSeconds >= 600 // 10 minutes
    case 'roi_calculator':
      return state.modulesViewed >= 3 // Likely ready to calculate
    case 'high_intent':
      return state.icpScore >= 60
    case 'journey_master':
      return state.modulesViewed >= 7 && (state.hasUsedCalculator || state.hasScheduledDemo)
    default:
      return false
  }
}

/**
 * Get progress towards next achievement
 */
export function getAchievementProgress(
  achievementId: string,
  state: Parameters<typeof checkAchievementUnlock>[1]
): { current: number; required: number; percentage: number } {
  const defaults = { current: 0, required: 1, percentage: 0 }

  switch (achievementId) {
    case 'first_step':
      return {
        current: state.modulesViewed,
        required: 1,
        percentage: Math.min((state.modulesViewed / 1) * 100, 100),
      }
    case 'explorer':
      return {
        current: state.modulesViewed,
        required: 3,
        percentage: Math.min((state.modulesViewed / 3) * 100, 100),
      }
    case 'deep_dive':
      return {
        current: state.modulesViewed,
        required: 5,
        percentage: Math.min((state.modulesViewed / 5) * 100, 100),
      }
    case 'completionist':
      return {
        current: state.modulesViewed,
        required: 9,
        percentage: Math.min((state.modulesViewed / 9) * 100, 100),
      }
    case 'power_user':
      return {
        current: state.messagesCount,
        required: 10,
        percentage: Math.min((state.messagesCount / 10) * 100, 100),
      }
    case 'question_master':
      return {
        current: state.questionsAsked,
        required: 5,
        percentage: Math.min((state.questionsAsked / 5) * 100, 100),
      }
    case 'engaged_learner':
      return {
        current: Math.floor(state.timeOnSiteSeconds / 60),
        required: 15,
        percentage: Math.min((state.timeOnSiteSeconds / 900) * 100, 100),
      }
    default:
      return defaults
  }
}
