/**
 * Journey Store - AI Journey Assistant
 *
 * Manages user journey state, progress tracking, and milestone achievements
 * for personalized demo guidance.
 *
 * @module journeyStore
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  checkNudgeTriggers,
  updateNudgeHistory,
  type Nudge,
  type NudgeContext,
  type NudgeHistory,
} from '../utils/journeyNudges'
import {
  predictNextBestAction,
  calculateJourneyProgress,
  estimateTimeToCompletion,
  getProgressMessage,
  type NextBestAction,
  type PredictionContext,
} from '../utils/journeyPredictions'
import {
  checkMultipleAchievements,
  calculateTotalPoints,
  getAchievementTier,
  getNextSuggestedAchievement,
  type Achievement,
  ACHIEVEMENTS,
} from '../utils/achievementSystem'

/**
 * Journey Step Definition
 */
export interface JourneyStep {
  id: string
  title: string
  description: string
  completed: boolean
  unlocked: boolean
  order: number
  moduleId?: string // Link to demo module
}

/**
 * Journey Milestone / Achievement
 */
export interface JourneyMilestone {
  id: string
  title: string
  description: string
  achieved: boolean
  achievedAt?: Date
  badgeIcon: string // Icon name or emoji
  requirement: string // What triggers this milestone
}

/**
 * Journey State Interface
 */
interface JourneyState {
  // ===== Journey State =====
  isJourneyStarted: boolean
  currentStepId: string | null
  steps: JourneyStep[]
  milestones: JourneyMilestone[]
  completionPercentage: number

  // ===== Contextual Triggers =====
  modulesViewedCount: number
  hasUsedCalculator: boolean
  hasScheduledDemo: boolean
  timeOnSiteSeconds: number
  lastActivityTime: Date | null

  // ===== Page Tracking =====
  visitedPages: string[] // Changed from Set to Array for Zustand compatibility
  currentPage: string

  // ===== Nudge System =====
  lastNudgeTime: Date | null
  nudgesShown: string[]
  nudgeHistory: NudgeHistory
  currentNudge: Nudge | null
  hasSeenPricing: boolean

  // ===== Predictive Guidance (2025 Best Practice) =====
  currentRecommendation: NextBestAction | null
  recommendationHistory: string[] // IDs of shown recommendations

  // ===== Achievement System =====
  unlockedAchievements: string[] // Achievement IDs
  totalPoints: number
  questionsAsked: number
  hasCompletedContactForm: boolean

  // ===== Computed Properties (for backwards compatibility) =====
  completedSteps: string[] // Array of completed step IDs
  timeOnSite: number // Alias for timeOnSiteSeconds

  // ===== Actions =====
  startJourney: (industry?: string, role?: string) => void
  initializeSteps: (steps: Omit<JourneyStep, 'completed' | 'unlocked'>[]) => void
  completeStep: (stepId: string) => void
  unlockStep: (stepId: string) => void
  setCurrentStep: (stepId: string) => void
  achieveMilestone: (milestoneId: string) => void
  trackModuleView: () => void
  trackCalculatorUse: () => void
  trackDemoScheduled: () => void
  updateTimeOnSite: (seconds: number) => void
  recordActivity: () => void
  shouldShowNudge: (nudgeId: string, cooldownMinutes?: number) => boolean
  recordNudge: (nudgeId: string) => void
  calculateProgress: () => void
  resetJourney: () => void
  checkForNudges: (icpScore: number, messagesCount: number) => Nudge | null
  dismissNudge: () => void
  setSeenPricing: (seen: boolean) => void
  getInactivityTime: () => number

  // Page tracking
  visitPage: (pathname: string) => void
  getVisitedPagesArray: () => string[]

  // Predictive Guidance (2025 Best Practice)
  getNextBestAction: (industry: string | null, icpScore: number) => NextBestAction | null
  dismissRecommendation: (recommendationId: string) => void
  getJourneyProgress: () => number
  getEstimatedTimeRemaining: (industry: string | null, icpScore: number) => number
  getProgressMessage: (industry: string | null, icpScore: number) => string

  // Achievement System Actions
  checkAndUnlockAchievements: (icpScore: number) => Achievement[]
  trackQuestionAsked: () => void
  trackContactFormCompleted: () => void
  getAchievementTier: () => {
    tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'
    icon: string
    nextTierPoints: number
  }
  getNextSuggestedAchievement: (icpScore: number) => Achievement | null
  getTotalAchievements: () => { unlocked: number; total: number; percentage: number }
}

/**
 * Initial journey state
 */
const initialState = {
  isJourneyStarted: false,
  currentStepId: null,
  steps: [],
  milestones: [],
  completionPercentage: 0,
  modulesViewedCount: 0,
  hasUsedCalculator: false,
  hasScheduledDemo: false,
  timeOnSiteSeconds: 0,
  lastActivityTime: null,
  visitedPages: [],
  currentPage: '/',
  lastNudgeTime: null,
  nudgesShown: [],
  nudgeHistory: {},
  currentNudge: null,
  hasSeenPricing: false,
  currentRecommendation: null,
  recommendationHistory: [],
  unlockedAchievements: [],
  totalPoints: 0,
  questionsAsked: 0,
  hasCompletedContactForm: false,
  // Computed properties (initialized, will be computed dynamically)
  completedSteps: [],
  timeOnSite: 0,
}

/**
 * Journey Store
 *
 * Tracks user progress through the demo experience and manages
 * contextual nudges for engagement.
 *
 * Usage:
 * ```tsx
 * const {
 *   steps,
 *   completeStep,
 *   achieveMilestone
 * } = useJourneyStore()
 * ```
 */
export const useJourneyStore = create<JourneyState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // ===== Journey Initialization =====
      startJourney: (_industry, _role) => {
        set({
          isJourneyStarted: true,
          lastActivityTime: new Date(),
        })
      },

      initializeSteps: (steps) => {
        // Unlock first step by default
        const initializedSteps = steps.map((step, index) => ({
          ...step,
          unlocked: index === 0,
          completed: false,
        }))

        set({
          steps: initializedSteps,
          completedSteps: [], // No steps completed initially
        })
        get().calculateProgress()
      },

      // ===== Page Tracking =====
      visitPage: (pathname: string) => {
        const { visitedPages } = get()

        // Safe conversion: handle both old Set and new Array
        const pagesArray: string[] = Array.isArray(visitedPages)
          ? visitedPages
          : Array.from(visitedPages || [])

        // Only add if not already visited
        if (!pagesArray.includes(pathname)) {
          set({
            visitedPages: [...pagesArray, pathname],
            currentPage: pathname,
          })
        } else {
          // Just update current page
          set({ currentPage: pathname })
        }
      },

      getVisitedPagesArray: () => {
        const pages = get().visitedPages
        // Safe conversion: handle both old Set and new Array
        return Array.isArray(pages) ? pages : Array.from(pages || [])
      },

      // ===== Step Management =====
      completeStep: (stepId) => {
        set((state) => {
          const steps = state.steps.map((step) => {
            if (step.id === stepId) {
              return { ...step, completed: true }
            }
            return step
          })

          // Unlock next step
          const currentIndex = steps.findIndex((s) => s.id === stepId)
          if (currentIndex >= 0 && currentIndex < steps.length - 1) {
            steps[currentIndex + 1].unlocked = true
          }

          // Update completedSteps array
          const completedSteps = steps.filter((step) => step.completed).map((step) => step.id)

          return { steps, completedSteps }
        })

        get().calculateProgress()
        get().recordActivity()
      },

      unlockStep: (stepId) => {
        set((state) => ({
          steps: state.steps.map((step) =>
            step.id === stepId ? { ...step, unlocked: true } : step
          ),
        }))
      },

      setCurrentStep: (stepId) => {
        set({ currentStepId: stepId })
        get().recordActivity()
      },

      // ===== Milestone Management =====
      achieveMilestone: (milestoneId) => {
        set((state) => ({
          milestones: state.milestones.map((milestone) =>
            milestone.id === milestoneId
              ? { ...milestone, achieved: true, achievedAt: new Date() }
              : milestone
          ),
        }))

        get().recordActivity()
      },

      // ===== Activity Tracking =====
      trackModuleView: () => {
        set((state) => ({
          modulesViewedCount: state.modulesViewedCount + 1,
        }))

        // Check for milestone
        const count = get().modulesViewedCount
        if (count === 3) {
          get().achieveMilestone('explorer')
        } else if (count === 5) {
          get().achieveMilestone('deep_dive')
        }

        get().recordActivity()
      },

      trackCalculatorUse: () => {
        set({ hasUsedCalculator: true })
        get().achieveMilestone('roi_calculator')
        get().recordActivity()
      },

      trackDemoScheduled: () => {
        set({ hasScheduledDemo: true })
        get().achieveMilestone('demo_booked')
        get().recordActivity()
      },

      updateTimeOnSite: (seconds) => {
        set({
          timeOnSiteSeconds: seconds,
          timeOnSite: seconds, // Keep computed property in sync
        })
      },

      recordActivity: () => {
        set({ lastActivityTime: new Date() })
      },

      // ===== Nudge System =====
      shouldShowNudge: (nudgeId, cooldownMinutes = 5) => {
        const state = get()

        // Already shown this nudge?
        if (state.nudgesShown.includes(nudgeId)) {
          return false
        }

        // Too soon since last nudge?
        if (state.lastNudgeTime) {
          const timeSinceLastNudge = Date.now() - new Date(state.lastNudgeTime).getTime()
          const cooldownMs = cooldownMinutes * 60 * 1000
          if (timeSinceLastNudge < cooldownMs) {
            return false
          }
        }

        return true
      },

      recordNudge: (nudgeId) => {
        set((state) => ({
          nudgesShown: [...state.nudgesShown, nudgeId],
          lastNudgeTime: new Date(),
        }))
      },

      // ===== Progress Calculation =====
      calculateProgress: () => {
        const { steps } = get()
        if (steps.length === 0) {
          set({
            completionPercentage: 0,
            completedSteps: [],
          })
          return
        }

        const completed = steps.filter((step) => step.completed)
        const completedCount = completed.length
        const percentage = Math.round((completedCount / steps.length) * 100)

        set({
          completionPercentage: percentage,
          completedSteps: completed.map((step) => step.id),
        })

        // Achievement for 100% completion
        if (percentage === 100) {
          get().achieveMilestone('journey_master')
        }
      },

      // ===== Reset =====
      resetJourney: () => {
        set(initialState)
      },

      /**
       * Check if nudges should trigger based on current context
       */
      checkForNudges: (icpScore: number, messagesCount: number) => {
        const state = get()

        const context: NudgeContext = {
          timeOnSite: state.timeOnSiteSeconds,
          modulesExplored: state.modulesViewedCount,
          icpScore,
          calculatorCompleted: state.hasUsedCalculator,
          messagesCount,
          lastMessageTime: undefined, // This would come from chatStore
          completedSteps: state.steps.filter((s) => s.completed).map((s) => s.id),
          hasScheduledDemo: state.hasScheduledDemo,
          hasSeenPricing: state.hasSeenPricing,
          inactivityTime: state.getInactivityTime(),
        }

        const nudge = checkNudgeTriggers(context, state.nudgeHistory)

        if (nudge) {
          const updatedHistory = updateNudgeHistory(nudge.id, state.nudgeHistory)
          set({
            currentNudge: nudge,
            nudgeHistory: updatedHistory,
            nudgesShown: [...state.nudgesShown, nudge.id],
          })
          return nudge
        }

        return null
      },

      /**
       * Dismiss current nudge
       */
      dismissNudge: () => set({ currentNudge: null }),

      /**
       * Mark pricing as seen
       */
      setSeenPricing: (seen: boolean) => set({ hasSeenPricing: seen }),

      /**
       * Get time since last activity (in seconds)
       */
      getInactivityTime: () => {
        const state = get()
        if (!state.lastActivityTime) {
          return 0
        }
        return Math.floor((Date.now() - new Date(state.lastActivityTime).getTime()) / 1000)
      },

      // ===== Predictive Guidance Functions (2025 Best Practice) =====

      /**
       * Get next-best-action recommendation based on current journey state
       */
      getNextBestAction: (industry, icpScore) => {
        const state = get()

        const context: PredictionContext = {
          industry,
          modulesViewed: state
            .getVisitedPagesArray()
            .filter((page) => page.includes('/explorer') || page.includes('/calculator')),
          completedSteps: state.steps.filter((s) => s.completed).map((s) => s.id),
          currentPage: state.currentPage,
          timeOnSite: state.timeOnSiteSeconds,
          icpScore,
          calculatorCompleted: state.hasUsedCalculator,
          hasScheduledDemo: state.hasScheduledDemo,
          lastActivity: state.lastActivityTime,
          messagesCount: 0, // This would come from chatStore
        }

        const recommendation = predictNextBestAction(context)

        // Only show if not already shown
        if (recommendation && !state.recommendationHistory.includes(recommendation.id)) {
          set({ currentRecommendation: recommendation })
          return recommendation
        }

        return null
      },

      /**
       * Dismiss current recommendation and record it
       */
      dismissRecommendation: (recommendationId) => {
        set((state) => ({
          currentRecommendation: null,
          recommendationHistory: [...state.recommendationHistory, recommendationId],
        }))
      },

      /**
       * Get journey completion progress (0-100)
       */
      getJourneyProgress: () => {
        const state = get()

        const context: PredictionContext = {
          industry: null, // Will be passed from personalizationStore
          modulesViewed: state.getVisitedPagesArray(),
          completedSteps: state.steps.filter((s) => s.completed).map((s) => s.id),
          currentPage: state.currentPage,
          timeOnSite: state.timeOnSiteSeconds,
          icpScore: 0,
          calculatorCompleted: state.hasUsedCalculator,
          hasScheduledDemo: state.hasScheduledDemo,
          lastActivity: state.lastActivityTime,
          messagesCount: 0,
        }

        return calculateJourneyProgress(context)
      },

      /**
       * Get estimated time remaining (in minutes)
       */
      getEstimatedTimeRemaining: (industry, icpScore) => {
        const state = get()

        const context: PredictionContext = {
          industry,
          modulesViewed: state.getVisitedPagesArray(),
          completedSteps: state.steps.filter((s) => s.completed).map((s) => s.id),
          currentPage: state.currentPage,
          timeOnSite: state.timeOnSiteSeconds,
          icpScore,
          calculatorCompleted: state.hasUsedCalculator,
          hasScheduledDemo: state.hasScheduledDemo,
          lastActivity: state.lastActivityTime,
          messagesCount: 0,
        }

        return estimateTimeToCompletion(context)
      },

      /**
       * Get motivational progress message
       */
      getProgressMessage: (industry, icpScore) => {
        const state = get()

        const context: PredictionContext = {
          industry,
          modulesViewed: state.getVisitedPagesArray(),
          completedSteps: state.steps.filter((s) => s.completed).map((s) => s.id),
          currentPage: state.currentPage,
          timeOnSite: state.timeOnSiteSeconds,
          icpScore,
          calculatorCompleted: state.hasUsedCalculator,
          hasScheduledDemo: state.hasScheduledDemo,
          lastActivity: state.lastActivityTime,
          messagesCount: 0,
        }

        return getProgressMessage(context)
      },

      // ===== Achievement System Functions =====

      /**
       * Check and unlock new achievements based on current state
       */
      checkAndUnlockAchievements: (icpScore: number) => {
        const state = get()

        const achievementState = {
          modulesViewed: state.modulesViewedCount,
          messagesCount: 0, // This would come from chatStore
          timeOnSiteSeconds: state.timeOnSiteSeconds,
          hasUsedCalculator: state.hasUsedCalculator,
          hasScheduledDemo: state.hasScheduledDemo,
          icpScore,
          hasSeenPricing: state.hasSeenPricing,
          questionsAsked: state.questionsAsked,
          hasCompletedContactForm: state.hasCompletedContactForm,
          lastVisitDate: undefined,
          currentDate: new Date(),
        }

        const newlyUnlocked = checkMultipleAchievements(
          achievementState,
          state.unlockedAchievements
        )

        if (newlyUnlocked.length > 0) {
          const newUnlockedIds = newlyUnlocked.map((a) => a.id)
          const updatedUnlocked = [...state.unlockedAchievements, ...newUnlockedIds]
          const updatedPoints = calculateTotalPoints(updatedUnlocked)

          set({
            unlockedAchievements: updatedUnlocked,
            totalPoints: updatedPoints,
          })
        }

        return newlyUnlocked
      },

      /**
       * Track when user asks a question
       */
      trackQuestionAsked: () => {
        set((state) => ({
          questionsAsked: state.questionsAsked + 1,
        }))
      },

      /**
       * Track when user completes contact form
       */
      trackContactFormCompleted: () => {
        set({ hasCompletedContactForm: true })
      },

      /**
       * Get current achievement tier
       */
      getAchievementTier: () => {
        const state = get()
        return getAchievementTier(state.totalPoints)
      },

      /**
       * Get next suggested achievement
       */
      getNextSuggestedAchievement: (icpScore: number) => {
        const state = get()

        const achievementState = {
          modulesViewed: state.modulesViewedCount,
          messagesCount: 0,
          timeOnSiteSeconds: state.timeOnSiteSeconds,
          hasUsedCalculator: state.hasUsedCalculator,
          hasScheduledDemo: state.hasScheduledDemo,
          icpScore,
          hasSeenPricing: state.hasSeenPricing,
          questionsAsked: state.questionsAsked,
          hasCompletedContactForm: state.hasCompletedContactForm,
        }

        return getNextSuggestedAchievement(achievementState, state.unlockedAchievements)
      },

      /**
       * Get total achievements unlocked vs total available
       */
      getTotalAchievements: () => {
        const state = get()
        const total = Object.keys(ACHIEVEMENTS).length
        const unlocked = state.unlockedAchievements.length
        const percentage = Math.round((unlocked / total) * 100)

        return { unlocked, total, percentage }
      },
    }),
    {
      name: 'fmai-journey-state',
      version: 4, // Bump version for achievement system
    }
  )
)

export default useJourneyStore
