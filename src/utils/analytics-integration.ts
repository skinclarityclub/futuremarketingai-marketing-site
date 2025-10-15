/**
 * Analytics Integration Module
 *
 * This module manages the integration between Google Analytics 4 and Hotjar,
 * enabling cross-platform tracking and unified user analysis.
 *
 * Features:
 * - Automatic Hotjar User ID injection into GA4 events
 * - Bidirectional event tracking (GA4 ↔ Hotjar)
 * - Custom dimension configuration
 * - Session linking between platforms
 */

import { setGA4UserProperties, trackGA4Event } from './ga4'
import { getHotjarUserId, isHotjarReady, hotjarEvent } from './hotjar'
import { handleSilentError } from './errorHandling'

const IS_PRODUCTION = import.meta.env.PROD

/**
 * Custom user properties that will be attached to all GA4 events
 */
export interface CustomUserProperties {
  hotjar_user_id?: string | null
  [key: string]: any
}

/**
 * Integration status
 */
let isIntegrationActive = false
let hotjarUserIdSynced = false

/**
 * Initialize GA4 ↔ Hotjar integration
 *
 * This function should be called after both GA4 and Hotjar are initialized.
 * It will:
 * 1. Retrieve the Hotjar user ID
 * 2. Set it as a custom dimension in GA4
 * 3. Enable cross-platform event tracking
 */
export const initAnalyticsIntegration = (): void => {
  if (isIntegrationActive) {
    if (!IS_PRODUCTION) {
      console.log('⚠️ Analytics integration already active')
    }
    return
  }

  if (!IS_PRODUCTION) {
    console.log('🔗 Initializing GA4 ↔ Hotjar integration...')
  }

  // Wait for Hotjar to be ready (it loads asynchronously)
  const maxAttempts = 10
  let attempts = 0

  const checkAndSync = () => {
    attempts++

    if (isHotjarReady()) {
      syncHotjarUserIdToGA4()
      isIntegrationActive = true

      if (!IS_PRODUCTION) {
        console.log('✅ GA4 ↔ Hotjar integration complete')
      }
    } else if (attempts < maxAttempts) {
      // Retry after a short delay
      setTimeout(checkAndSync, 500)
    } else {
      if (!IS_PRODUCTION) {
        console.warn(
          '⚠️ Hotjar not ready after',
          maxAttempts,
          'attempts. Integration partially active.'
        )
      }
      // Mark as active anyway to avoid continuous retries
      isIntegrationActive = true
    }
  }

  checkAndSync()
}

/**
 * Sync Hotjar User ID to GA4 as a custom dimension
 *
 * This enables filtering GA4 data by Hotjar sessions and vice versa.
 */
export const syncHotjarUserIdToGA4 = (): void => {
  if (hotjarUserIdSynced) {
    return
  }

  try {
    const hjUserId = getHotjarUserId()

    if (hjUserId) {
      // Set Hotjar user ID as a custom dimension in GA4
      setGA4UserProperties({
        hotjar_user_id: hjUserId,
      })

      hotjarUserIdSynced = true

      if (!IS_PRODUCTION) {
        console.log('🔗 Hotjar User ID synced to GA4:', hjUserId)
      }
    } else {
      if (!IS_PRODUCTION) {
        console.log('ℹ️ Hotjar User ID not available yet')
      }
    }
  } catch (error) {
    handleSilentError(error, { utility: 'analytics-integration', action: 'syncHotjarUserIdToGA4' })
  }
}

/**
 * Track an event to both GA4 and Hotjar
 *
 * This ensures that events are available for filtering in both platforms.
 *
 * @param eventName - Name of the event
 * @param params - Event parameters (for GA4)
 */
export const trackCrossPlatformEvent = (eventName: string, params?: Record<string, any>): void => {
  // Track to both GA4 and Hotjar
  trackGA4Event(eventName, params)
  hotjarEvent(eventName)

  if (!IS_PRODUCTION) {
    console.log('🔗 Cross-platform event tracked:', eventName)
  }
}

/**
 * Get integration status
 */
export const isIntegrationReady = (): boolean => {
  return isIntegrationActive
}

/**
 * Get the synced Hotjar User ID
 */
export const getSyncedHotjarUserId = (): string | null => {
  return getHotjarUserId()
}

/**
 * Configuration guide for GA4 Custom Dimensions
 *
 * To enable Hotjar User ID tracking in GA4 dashboard:
 *
 * 1. Go to GA4 Admin → Custom Definitions → Custom Dimensions
 * 2. Click "Create custom dimension"
 * 3. Configure as follows:
 *    - Dimension name: "Hotjar User ID"
 *    - Scope: User
 *    - User property: hotjar_user_id
 *    - Description: "Hotjar session identifier for cross-platform analysis"
 *
 * After configuration, you can:
 * - Filter GA4 reports by Hotjar User ID
 * - Create segments based on Hotjar sessions
 * - Cross-reference GA4 events with Hotjar recordings
 */
export const GA4_CUSTOM_DIMENSION_SETUP = {
  name: 'Hotjar User ID',
  scope: 'User',
  userProperty: 'hotjar_user_id',
  description: 'Hotjar session identifier for cross-platform analysis',
} as const

export default {
  initAnalyticsIntegration,
  syncHotjarUserIdToGA4,
  trackCrossPlatformEvent,
  isIntegrationReady,
  getSyncedHotjarUserId,
  GA4_CUSTOM_DIMENSION_SETUP,
}
