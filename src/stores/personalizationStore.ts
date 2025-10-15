import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Industry } from '../components'
import type { TeamSize, ChannelsCount } from '../types/icp'
import { calculateICPScore, type ICPScoreBreakdown } from '../utils/icpScoring'

// Helper function to convert number to TeamSize
function numberToTeamSize(teamSize: number): TeamSize {
  if (teamSize <= 5) {
    return '1-5'
  }
  if (teamSize <= 15) {
    return '5-15'
  }
  if (teamSize <= 50) {
    return '15-50'
  }
  return '50+'
}

/**
 * User Journey Tracking
 */
export interface UserJourney {
  visitedPages: string[]
  viewedModules: string[]
  clickedCTAs: string[]
  calculatorInputs?: {
    teamSize?: number
    avgSalary?: number
    campaignsPerMonth?: number
    channels?: ChannelsCount
    marketingSpend?: number
  }
  lastVisit: string
  sessionCount: number
}

/**
 * User Contact Information
 */
export interface UserContact {
  firstName?: string
  lastName?: string
  fullName?: string
  email?: string
  company?: string
  phone?: string
}

/**
 * User Profile
 */
export interface UserProfile {
  companySize?: 'small' | 'medium' | 'large' | 'enterprise' // <50, 50-200, 200-1000, 1000+
  role?: 'owner' | 'cmo' | 'manager' | 'specialist' | 'other'
  budget?: 'low' | 'medium' | 'high' // <5k, 5k-20k, 20k+
  painPoints?: string[]
}

/**
 * Personalization State
 */
interface PersonalizationState {
  // Industry selection
  selectedIndustry: Industry | null
  hasSeenIndustrySelector: boolean

  // User journey
  userJourney: UserJourney

  // User profile
  userProfile: UserProfile

  // User contact information
  userContact: UserContact

  // ICP Score (derived from calculator inputs)
  icpScore: ICPScoreBreakdown | null

  // Actions
  setIndustry: (industry: Industry | null) => void
  setHasSeenIndustrySelector: (seen: boolean) => void
  trackPageVisit: (page: string) => void
  trackModuleView: (module: string) => void
  trackCTAClick: (cta: string) => void
  setCalculatorInputs: (inputs: UserJourney['calculatorInputs']) => void
  updateUserProfile: (profile: Partial<UserProfile>) => void
  updateUserContact: (contact: Partial<UserContact>) => void
  updateICPScore: () => void
  getICPScore: () => ICPScoreBreakdown | null
  resetPersonalization: () => void
}

// Initial state
const initialJourney: UserJourney = {
  visitedPages: [],
  viewedModules: [],
  clickedCTAs: [],
  lastVisit: new Date().toISOString(),
  sessionCount: 1,
}

const initialProfile: UserProfile = {}

const initialContact: UserContact = {}

/**
 * Personalization Store
 *
 * Features:
 * - Industry selection persistence
 * - User journey tracking (pages, modules, CTAs)
 * - User profile data (company size, role, budget)
 * - LocalStorage persistence
 * - Reset functionality
 *
 * Usage:
 * ```tsx
 * const { selectedIndustry, setIndustry } = usePersonalizationStore()
 * ```
 */
export const usePersonalizationStore = create<PersonalizationState>()(
  persist(
    (set, get) => ({
      // Initial state
      selectedIndustry: null,
      hasSeenIndustrySelector: false,
      userJourney: initialJourney,
      userProfile: initialProfile,
      userContact: initialContact,
      icpScore: null,

      // Actions
      setIndustry: (industry) => set({ selectedIndustry: industry }),

      setHasSeenIndustrySelector: (seen) => set({ hasSeenIndustrySelector: seen }),

      trackPageVisit: (page) =>
        set((state) => {
          const visitedPages = state.userJourney.visitedPages.includes(page)
            ? state.userJourney.visitedPages
            : [...state.userJourney.visitedPages, page]

          return {
            userJourney: {
              ...state.userJourney,
              visitedPages,
              lastVisit: new Date().toISOString(),
            },
          }
        }),

      trackModuleView: (module) =>
        set((state) => {
          const alreadyViewed = state.userJourney.viewedModules.includes(module)
          const viewedModules = alreadyViewed
            ? state.userJourney.viewedModules
            : [...state.userJourney.viewedModules, module]

          return {
            userJourney: {
              ...state.userJourney,
              viewedModules,
            },
          }
        }),

      trackCTAClick: (cta) =>
        set((state) => {
          const clickedCTAs = state.userJourney.clickedCTAs.includes(cta)
            ? state.userJourney.clickedCTAs
            : [...state.userJourney.clickedCTAs, cta]

          return {
            userJourney: {
              ...state.userJourney,
              clickedCTAs,
            },
          }
        }),

      setCalculatorInputs: (inputs) =>
        set((state) => ({
          userJourney: {
            ...state.userJourney,
            calculatorInputs: inputs,
          },
        })),

      updateUserProfile: (profile) =>
        set((state) => ({
          userProfile: {
            ...state.userProfile,
            ...profile,
          },
        })),

      updateUserContact: (contact) =>
        set((state) => ({
          userContact: {
            ...state.userContact,
            ...contact,
            // Auto-generate fullName if first/last provided
            fullName:
              contact.firstName || contact.lastName
                ? `${contact.firstName || ''} ${contact.lastName || ''}`.trim()
                : state.userContact.fullName,
          },
        })),

      updateICPScore: () => {
        const state = get()
        const inputs = state.userJourney.calculatorInputs

        if (!inputs?.teamSize || !inputs?.channels) {
          set({ icpScore: null })
          return
        }

        const icpData = {
          teamSize: numberToTeamSize(inputs.teamSize),
          channels: inputs.channels,
          painPoints: (state.userProfile.painPoints || []) as import('../types/icp').PainPoint[],
          industry: (state.selectedIndustry?.id || 'other') as
            | 'ecommerce'
            | 'saas'
            | 'agency'
            | 'other',
          currentSpend: inputs.marketingSpend || 0,
        }

        const score = calculateICPScore(icpData)
        set({ icpScore: score })
      },

      getICPScore: () => {
        const state = get()
        return state.icpScore
      },

      resetPersonalization: () =>
        set({
          selectedIndustry: null,
          hasSeenIndustrySelector: false,
          userJourney: initialJourney,
          userProfile: initialProfile,
          userContact: initialContact,
          icpScore: null,
        }),
    }),
    {
      name: 'futuremarketingai-personalization', // LocalStorage key
      version: 4, // Updated for contact information storage
      migrate: (persistedState: any, version: number) => {
        // Migration for industry ID changes (v2 → v3)
        if (version < 3 && persistedState?.selectedIndustry) {
          const oldId = persistedState.selectedIndustry.id

          // Map old IDs to new IDs
          const idMigrationMap: Record<string, string> = {
            professional: 'agency',
            technology: 'saas',
            // Removed industries default to 'other'
            healthcare: 'other',
            finance: 'other',
            'real-estate': 'other',
            education: 'other',
            hospitality: 'other',
            manufacturing: 'other',
          }

          if (idMigrationMap[oldId]) {
            persistedState.selectedIndustry.id = idMigrationMap[oldId]
          }
        }

        // Migration for contact information (v3 → v4)
        if (version < 4) {
          persistedState.userContact = initialContact
        }

        return persistedState
      },
    }
  )
)

export default usePersonalizationStore
