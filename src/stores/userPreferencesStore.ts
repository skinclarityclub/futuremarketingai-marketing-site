/**
 * User Preferences Store
 *
 * Manages user preferences for:
 * - Personalization level (full/moderate/minimal/off)
 * - Privacy settings
 * - Communication preferences
 * - Accessibility options
 *
 * GDPR/Privacy compliant with user control over data usage
 *
 * @module userPreferencesStore
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { PersonalizationLevel } from '../utils/personalizationEngine'

export interface NotificationPreferences {
  emailUpdates: boolean
  productUpdates: boolean
  marketingEmails: boolean
}

export interface PrivacyPreferences {
  allowAnalytics: boolean
  allowPersonalization: boolean
  allowThirdPartyIntegrations: boolean
}

export interface AccessibilityPreferences {
  reducedMotion: boolean
  highContrast: boolean
  largerText: boolean
}

interface UserPreferencesState {
  // === Personalization Settings ===
  personalizationLevel: PersonalizationLevel

  // === Privacy Settings ===
  privacy: PrivacyPreferences

  // === Notification Settings ===
  notifications: NotificationPreferences

  // === Accessibility Settings ===
  accessibility: AccessibilityPreferences

  // === Consent Tracking ===
  hasGivenConsent: boolean
  consentDate: string | null
  consentVersion: string // Track which version of terms user agreed to

  // === Actions ===
  setPersonalizationLevel: (level: PersonalizationLevel) => void
  updatePrivacy: (privacy: Partial<PrivacyPreferences>) => void
  updateNotifications: (notifications: Partial<NotificationPreferences>) => void
  updateAccessibility: (accessibility: Partial<AccessibilityPreferences>) => void
  giveConsent: (version: string) => void
  revokeConsent: () => void
  resetPreferences: () => void
}

// Default preferences (privacy-first defaults)
const defaultPrivacy: PrivacyPreferences = {
  allowAnalytics: true, // Essential analytics only
  allowPersonalization: true, // Personalization opt-in by default
  allowThirdPartyIntegrations: false, // Third-party opt-in required
}

const defaultNotifications: NotificationPreferences = {
  emailUpdates: false, // Opt-in required
  productUpdates: false,
  marketingEmails: false,
}

const defaultAccessibility: AccessibilityPreferences = {
  reducedMotion: false, // Auto-detect from system preferences ideally
  highContrast: false,
  largerText: false,
}

/**
 * User Preferences Store
 *
 * Features:
 * - Personalization level control
 * - GDPR-compliant consent tracking
 * - Privacy-first defaults
 * - Accessibility options
 * - LocalStorage persistence
 *
 * Usage:
 * ```tsx
 * const { personalizationLevel, setPersonalizationLevel } = useUserPreferencesStore()
 * ```
 */
export const useUserPreferencesStore = create<UserPreferencesState>()(
  persist(
    (set) => ({
      // Initial state
      personalizationLevel: 'full',
      privacy: defaultPrivacy,
      notifications: defaultNotifications,
      accessibility: defaultAccessibility,
      hasGivenConsent: false,
      consentDate: null,
      consentVersion: '',

      // Actions
      setPersonalizationLevel: (level) => {
        set({ personalizationLevel: level })

        // If user disables personalization, also disable analytics
        if (level === 'off') {
          set((state) => ({
            privacy: {
              ...state.privacy,
              allowPersonalization: false,
            },
          }))
        }
      },

      updatePrivacy: (privacy) =>
        set((state) => ({
          privacy: {
            ...state.privacy,
            ...privacy,
          },
        })),

      updateNotifications: (notifications) =>
        set((state) => ({
          notifications: {
            ...state.notifications,
            ...notifications,
          },
        })),

      updateAccessibility: (accessibility) =>
        set((state) => ({
          accessibility: {
            ...state.accessibility,
            ...accessibility,
          },
        })),

      giveConsent: (version) =>
        set({
          hasGivenConsent: true,
          consentDate: new Date().toISOString(),
          consentVersion: version,
        }),

      revokeConsent: () =>
        set({
          hasGivenConsent: false,
          consentDate: null,
          consentVersion: '',
          personalizationLevel: 'off',
          privacy: {
            ...defaultPrivacy,
            allowAnalytics: false,
            allowPersonalization: false,
            allowThirdPartyIntegrations: false,
          },
        }),

      resetPreferences: () =>
        set({
          personalizationLevel: 'full',
          privacy: defaultPrivacy,
          notifications: defaultNotifications,
          accessibility: defaultAccessibility,
        }),
    }),
    {
      name: 'fmai-user-preferences',
      version: 1,
    }
  )
)

export default useUserPreferencesStore

/**
 * Helper: Check if user allows specific feature
 */
export function canUseFeature(
  feature: keyof PrivacyPreferences,
  preferences: PrivacyPreferences
): boolean {
  return preferences[feature] === true
}

/**
 * Helper: Get effective personalization level based on privacy settings
 */
export function getEffectivePersonalizationLevel(
  preferredLevel: PersonalizationLevel,
  privacy: PrivacyPreferences
): PersonalizationLevel {
  // If personalization disabled in privacy, force to 'off'
  if (!privacy.allowPersonalization) {
    return 'off'
  }

  return preferredLevel
}

/**
 * Helper: Check if user has given valid consent
 */
export function hasValidConsent(
  hasGivenConsent: boolean,
  consentVersion: string,
  requiredVersion: string
): boolean {
  return hasGivenConsent && consentVersion === requiredVersion
}
