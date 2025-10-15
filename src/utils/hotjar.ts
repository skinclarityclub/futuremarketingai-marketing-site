/**
 * Hotjar Integration
 *
 * This module initializes and manages Hotjar heatmap and session recording tracking.
 * Hotjar helps understand user behavior through:
 * - Heatmaps (click, move, scroll)
 * - Session recordings
 * - Conversion funnels
 * - Feedback polls
 */

import { handleSilentError } from './errorHandling'

// Hotjar Configuration
const HOTJAR_ID = import.meta.env.VITE_HOTJAR_ID
const HOTJAR_SV = import.meta.env.VITE_HOTJAR_SV || '6' // Script version
const IS_PRODUCTION = import.meta.env.PROD
const IS_ANALYTICS_ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

// Track if Hotjar is initialized
let isInitialized = false

/**
 * Initialize Hotjar
 * Should be called once when the app starts
 */
export const initHotjar = (): void => {
  // Only initialize if we have a site ID and analytics is enabled
  if (!HOTJAR_ID) {
    console.warn('⚠️ Hotjar ID not found. Heatmaps and recordings will not be tracked.')
    return
  }

  if (isInitialized) {
    console.warn('⚠️ Hotjar already initialized')
    return
  }

  if (!IS_ANALYTICS_ENABLED) {
    console.log('📊 Analytics disabled. Hotjar will not be initialized.')
    return
  }

  try {
    // Hotjar initialization script
    ;(function (h: any, o: any, t: string, j: string, a?: any, r?: any) {
      h.hj =
        h.hj ||
        function () {
          ;(h.hj.q = h.hj.q || []).push(arguments)
        }
      h._hjSettings = { hjid: HOTJAR_ID, hjsv: Number(HOTJAR_SV) }
      a = o.getElementsByTagName('head')[0]
      r = o.createElement('script')
      r.async = 1
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv
      a.appendChild(r)
    })(window, document, 'https://static.hotjar.com/c/hotjar-', '.js?sv=')

    isInitialized = true

    if (!IS_PRODUCTION) {
      console.log('✅ Hotjar initialized (Site ID:', HOTJAR_ID, ')')
    } else {
      console.log('✅ Hotjar initialized')
    }
  } catch (error) {
    handleSilentError(error, { utility: 'hotjar', action: 'init' })
  }
}

/**
 * Check if Hotjar is initialized
 */
export const isHotjarReady = (): boolean => {
  return isInitialized && IS_ANALYTICS_ENABLED && typeof (window as any).hj === 'function'
}

/**
 * Get Hotjar user ID
 * Useful for linking Hotjar sessions with GA4 events
 *
 * Note: This uses a synchronous approach by checking Hotjar's internal state.
 * The user ID is stored in Hotjar's settings after initialization.
 */
export const getHotjarUserId = (): string | null => {
  if (!isHotjarReady()) {
    return null
  }

  try {
    // Access Hotjar's internal user ID from window._hjSettings
    const hjSettings = (window as any)._hjSettings

    if (hjSettings && hjSettings.hjid) {
      // The user ID is a combination of site ID and a unique identifier
      // We'll construct it from available data
      const siteId = hjSettings.hjid

      // Try to get the user UUID from Hotjar's storage
      const hjUserAttributes = (window as any).hj?.q?.find?.(
        (item: any[]) => item[0] === 'identify'
      )

      if (hjUserAttributes && hjUserAttributes[1]) {
        return String(hjUserAttributes[1])
      }

      // Fallback: Use site ID as identifier
      return `hj_${siteId}`
    }

    return null
  } catch (error) {
    handleSilentError(error, { utility: 'hotjar', action: 'getUserID' })
    return null
  }
}

/**
 * Track a state change in Hotjar
 * Useful for triggering heatmap updates on SPA navigation
 *
 * @param path - New page path
 */
export const hotjarStateChange = (path: string): void => {
  if (!isHotjarReady()) {
    if (!IS_PRODUCTION) {
      console.log('📊 [Hotjar] State Change:', path)
    }
    return
  }

  try {
    const hj = (window as any).hj
    hj('stateChange', path)

    if (!IS_PRODUCTION) {
      console.log('📊 Hotjar State Change:', path)
    }
  } catch (error) {
    handleSilentError(error, { utility: 'hotjar', action: 'stateChange', path })
  }
}

/**
 * Trigger a Hotjar event
 * Events can be used to filter recordings and heatmaps
 *
 * @param eventName - Name of the event
 */
export const hotjarEvent = (eventName: string): void => {
  if (!isHotjarReady()) {
    if (!IS_PRODUCTION) {
      console.log('📊 [Hotjar] Event:', eventName)
    }
    return
  }

  try {
    const hj = (window as any).hj
    hj('event', eventName)

    if (!IS_PRODUCTION) {
      console.log('📊 Hotjar Event:', eventName)
    }
  } catch (error) {
    handleSilentError(error, { utility: 'hotjar', action: 'event', eventName })
  }
}

/**
 * Tag a recording with specific attributes
 * Useful for categorizing and filtering recordings
 *
 * @param attributes - Key-value pairs to tag the recording
 */
export const hotjarTagRecording = (attributes: Record<string, string | number | boolean>): void => {
  if (!isHotjarReady()) {
    if (!IS_PRODUCTION) {
      console.log('📊 [Hotjar] Tag Recording:', attributes)
    }
    return
  }

  try {
    const hj = (window as any).hj
    hj('tagRecording', attributes)

    if (!IS_PRODUCTION) {
      console.log('📊 Hotjar Tag Recording:', attributes)
    }
  } catch (error) {
    handleSilentError(error, { utility: 'hotjar', action: 'tagRecording', attributes })
  }
}

/**
 * Identify a user in Hotjar
 * Links recordings to specific user IDs
 *
 * @param userId - User identifier
 * @param attributes - Additional user attributes
 */
export const hotjarIdentify = (
  userId: string,
  attributes?: Record<string, string | number | boolean>
): void => {
  if (!isHotjarReady()) {
    if (!IS_PRODUCTION) {
      console.log('📊 [Hotjar] Identify:', userId, attributes)
    }
    return
  }

  try {
    const hj = (window as any).hj
    hj('identify', userId, attributes)

    if (!IS_PRODUCTION) {
      console.log('📊 Hotjar Identify:', userId, attributes)
    }
  } catch (error) {
    handleSilentError(error, { utility: 'hotjar', action: 'identify', userId })
  }
}

/**
 * Trigger feedback poll or survey
 *
 * @param pollId - ID of the poll to trigger
 */
export const hotjarTriggerPoll = (pollId: string): void => {
  if (!isHotjarReady()) {
    if (!IS_PRODUCTION) {
      console.log('📊 [Hotjar] Trigger Poll:', pollId)
    }
    return
  }

  try {
    const hj = (window as any).hj
    hj('trigger', pollId)

    if (!IS_PRODUCTION) {
      console.log('📊 Hotjar Trigger Poll:', pollId)
    }
  } catch (error) {
    handleSilentError(error, { utility: 'hotjar', action: 'triggerPoll', pollId })
  }
}

/**
 * Common Hotjar events for FutureMarketingAI
 */
export const HotjarEvents = {
  // Page events
  PAGE_LOAD: 'page_load',
  HERO_VIEW: 'hero_view',
  MODULE_OPEN: 'module_open',

  // User interactions
  CTA_CLICK: 'cta_click',
  CTA_IMPRESSION: 'cta_impression',
  CALCULATOR_START: 'calculator_start',
  CALCULATOR_COMPLETE: 'calculator_complete',

  // Personalization events
  OPEN_INDUSTRY_SELECTOR: 'open_industry_selector',
  INDUSTRY_CHANGED: 'industry_changed',
  OPEN_USER_PREFERENCES: 'open_user_preferences',
  UPDATE_USER_PREFERENCES: 'update_user_preferences',

  // Conversion events
  CALENDLY_OPEN: 'calendly_open',
  CALENDLY_BOOKING_COMPLETED: 'calendly_booking_completed',
  FORM_SUBMIT: 'form_submit',

  // Engagement
  SCROLL_DEPTH_25: 'scroll_25',
  SCROLL_DEPTH_50: 'scroll_50',
  SCROLL_DEPTH_75: 'scroll_75',
  SCROLL_DEPTH_100: 'scroll_100',
  TIME_ON_PAGE_30S: 'time_30s',
  TIME_ON_PAGE_60S: 'time_60s',

  // Performance
  PERFORMANCE_ISSUE: 'performance_issue',
} as const

export default {
  initHotjar,
  isHotjarReady,
  getHotjarUserId,
  hotjarStateChange,
  hotjarEvent,
  hotjarTagRecording,
  hotjarIdentify,
  hotjarTriggerPoll,
  HotjarEvents,
}
