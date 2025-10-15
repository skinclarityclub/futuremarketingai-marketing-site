import { useMemo, useCallback } from 'react'
import { usePersonalizationStore } from '../stores'
import type { UserProfile } from '../stores/personalizationStore'
import type { Industry } from '../components'
import {
  getIndustryBenchmarks,
  getModulePriorities,
  getFoundingTeams,
  getIndustryMessaging,
  sortModulesByIndustry,
  type IndustryBenchmarks,
  type ModulePriority,
  type FoundingTeam,
  type IndustryMessaging,
} from '../config/industryPersonalization'

/**
 * usePersonalization Hook (Enhanced)
 *
 * Central hook for accessing personalized content based on user's industry selection and profile
 *
 * Features:
 * - Calculator benchmarks
 * - Module ordering
 * - Testimonials
 * - Content variations
 * - User profile data (company size, role, budget, pain points)
 * - Smooth industry switching
 * - Journey tracking
 *
 * Usage:
 * ```tsx
 * const { benchmarks, testimonials, userProfile, changeIndustry } = usePersonalization()
 * ```
 */
export function usePersonalization() {
  const {
    selectedIndustry,
    userProfile,
    userJourney,
    icpScore,
    setIndustry,
    updateUserProfile,
    updateICPScore,
    getICPScore,
    trackCTAClick,
    trackModuleView,
    trackPageVisit,
  } = usePersonalizationStore()

  // Industry benchmarks for calculator
  const benchmarks = useMemo<IndustryBenchmarks>(() => {
    return getIndustryBenchmarks(selectedIndustry?.id)
  }, [selectedIndustry])

  // Module priorities
  const modulePriorities = useMemo<ModulePriority>(() => {
    return getModulePriorities(selectedIndustry?.id)
  }, [selectedIndustry])

  // Founding teams (transparent early-stage social proof)
  const foundingTeams = useMemo<FoundingTeam[]>(() => {
    return getFoundingTeams(3)
  }, [])

  // Industry-specific messaging
  const messaging = useMemo<IndustryMessaging>(() => {
    return getIndustryMessaging(selectedIndustry?.id)
  }, [selectedIndustry])

  // Function to sort modules by industry priority
  const sortModules = <T extends { id: string }>(modules: T[]): T[] => {
    return sortModulesByIndustry(modules, selectedIndustry?.id)
  }

  // Check if industry is selected
  const hasIndustry = selectedIndustry !== null

  // Industry name for display
  const industryName = selectedIndustry?.name || 'General'

  // Check if user profile is complete
  const isProfileComplete = useMemo(() => {
    return !!(
      userProfile.companySize &&
      userProfile.role &&
      userProfile.budget &&
      userProfile.painPoints &&
      userProfile.painPoints.length > 0
    )
  }, [userProfile])

  // Smooth industry change with optional callback
  const changeIndustry = useCallback(
    (industry: Industry | null, onComplete?: () => void) => {
      setIndustry(industry)

      // Track the change
      if (industry) {
        trackCTAClick(`industry-changed-to-${industry.id}`)
      }

      // Call completion callback if provided
      if (onComplete) {
        // Small delay to allow state to update
        setTimeout(onComplete, 100)
      }
    },
    [setIndustry, trackCTAClick]
  )

  // Update profile with tracking
  const updateProfile = useCallback(
    (profile: Partial<UserProfile>, trackAs?: string) => {
      updateUserProfile(profile)

      // Track profile update
      if (trackAs) {
        trackCTAClick(trackAs)
      }
    },
    [updateUserProfile, trackCTAClick]
  )

  // Get personalized CTA message based on context
  const getPersonalizedCTA = useCallback(
    (context: 'hero' | 'calculator' | 'explorer' | 'module' | 'exit') => {
      const baseMessages = {
        hero: messaging.ctaPrimaryMessage,
        calculator: 'Claim My ROI Analysis',
        explorer: 'View My Demo',
        module: 'Book Free Demo',
        exit: 'Start My Growth',
      }

      return baseMessages[context]
    },
    [messaging]
  )

  // Determine user intent based on journey AND ICP score
  const userIntent = useMemo(() => {
    const calculatorVisited = userJourney.visitedPages.includes('calculator')
    const explorerVisited = userJourney.visitedPages.includes('explorer')
    const ctaClicked = userJourney.clickedCTAs.length > 0

    // High intent if CTA clicked OR primary ICP tier
    if (ctaClicked) {
      return 'high'
    } // Already engaged
    if (icpScore && icpScore.tier === 'primary') {
      return 'high'
    } // Perfect fit ICP

    // Medium intent if exploring deeply OR secondary ICP tier
    if (calculatorVisited && explorerVisited) {
      return 'medium'
    } // Exploring deeply
    if (icpScore && icpScore.tier === 'secondary') {
      return 'medium'
    } // Good fit ICP
    if (calculatorVisited || explorerVisited) {
      return 'medium'
    } // Some exploration

    return 'low' // Just browsing or nurture tier
  }, [userJourney, icpScore])

  return {
    // Selected industry
    selectedIndustry,
    hasIndustry,
    industryName,

    // User profile
    userProfile,
    isProfileComplete,
    userIntent,

    // ICP Scoring
    icpScore,
    updateICPScore,
    getICPScore,

    // Personalized content
    benchmarks,
    modulePriorities,
    foundingTeams, // Transparent early-stage social proof (not fake testimonials)
    messaging,

    // Helper functions
    sortModules,
    changeIndustry,
    updateProfile,
    getPersonalizedCTA,

    // Journey tracking
    trackCTAClick,
    trackModuleView,
    trackPageVisit,
  }
}

export default usePersonalization
