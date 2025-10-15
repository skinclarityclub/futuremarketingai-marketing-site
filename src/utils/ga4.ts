/**
 * Google Analytics 4 Configuration
 *
 * This module initializes and manages Google Analytics 4 tracking.
 * It provides a clean interface for tracking events, page views, and user interactions.
 */

import ReactGA from 'react-ga4'
import type { CustomUserProperties } from './analytics-integration'
import { handleSilentError } from './errorHandling'

// GA4 Configuration
const GA4_MEASUREMENT_ID = import.meta.env.VITE_GA4_MEASUREMENT_ID
const IS_PRODUCTION = import.meta.env.PROD
const IS_ANALYTICS_ENABLED = import.meta.env.VITE_ENABLE_ANALYTICS === 'true'

// Track if GA4 is initialized
let isInitialized = false

// Store custom user properties (like Hotjar User ID)
let customUserProperties: CustomUserProperties = {}

/**
 * Initialize Google Analytics 4
 * Should be called once when the app starts
 */
export const initGA4 = (): void => {
  // Only initialize if we have a measurement ID and analytics is enabled
  if (!GA4_MEASUREMENT_ID) {
    console.warn('⚠️ GA4 Measurement ID not found. Analytics will not be tracked.')
    return
  }

  if (isInitialized) {
    console.warn('⚠️ GA4 already initialized')
    return
  }

  try {
    ReactGA.initialize(GA4_MEASUREMENT_ID, {
      testMode: !IS_PRODUCTION, // Don't send data in development
      gaOptions: {
        anonymizeIp: true, // Privacy: anonymize IP addresses
        cookieFlags: 'SameSite=None;Secure', // Cookie security
      },
    })

    isInitialized = true

    if (!IS_PRODUCTION) {
      console.log('✅ GA4 initialized in test mode (no data will be sent)')
    } else {
      console.log('✅ GA4 initialized')
    }
  } catch (error) {
    handleSilentError(error, { utility: 'ga4', action: 'init' })
  }
}

/**
 * Check if GA4 is initialized
 */
export const isGA4Ready = (): boolean => {
  return isInitialized && IS_ANALYTICS_ENABLED
}

/**
 * Track a page view in GA4
 *
 * @param path - Page path (e.g., '/dashboard')
 * @param title - Page title (e.g., 'Dashboard')
 */
export const trackGA4PageView = (path: string, title?: string): void => {
  if (!isGA4Ready()) {
    if (!IS_PRODUCTION) {
      console.log('📄 [Test Mode] Page View:', { path, title })
    }
    return
  }

  try {
    ReactGA.send({
      hitType: 'pageview',
      page: path,
      title: title || document.title,
    })

    if (!IS_PRODUCTION) {
      console.log('📄 Page View Tracked:', { path, title })
    }
  } catch (error) {
    handleSilentError(error, { utility: 'ga4', action: 'trackPageView', path })
  }
}

/**
 * Set custom user properties for GA4
 * These properties will be automatically included in all subsequent events
 *
 * @param properties - Custom user properties (e.g., { hotjar_user_id: 'abc123' })
 */
export const setGA4UserProperties = (properties: CustomUserProperties): void => {
  customUserProperties = { ...customUserProperties, ...properties }

  if (!isGA4Ready()) {
    if (!IS_PRODUCTION) {
      console.log('📊 [Test Mode] User Properties Set:', properties)
    }
    return
  }

  try {
    // Set user properties in GA4
    ReactGA.set(properties)

    if (!IS_PRODUCTION) {
      console.log('📊 GA4 User Properties Set:', properties)
    }
  } catch (error) {
    handleSilentError(error, { utility: 'ga4', action: 'setUserProperties', properties })
  }
}

/**
 * Get current custom user properties
 */
export const getGA4UserProperties = (): CustomUserProperties => {
  return { ...customUserProperties }
}

/**
 * Track a custom event in GA4
 * Automatically includes custom user properties (like Hotjar User ID)
 *
 * @param eventName - Name of the event (e.g., 'cta_click', 'calculator_complete')
 * @param params - Additional event parameters
 */
export const trackGA4Event = (eventName: string, params?: Record<string, any>): void => {
  if (!isGA4Ready()) {
    if (!IS_PRODUCTION) {
      console.log('📊 [Test Mode] Event:', eventName, params)
    }
    return
  }

  try {
    // Merge custom user properties with event params
    const enrichedParams = {
      ...customUserProperties,
      ...params,
    }

    ReactGA.event(eventName, enrichedParams)

    if (!IS_PRODUCTION) {
      console.log('📊 Event Tracked:', eventName, enrichedParams)
    }
  } catch (error) {
    handleSilentError(error, { utility: 'ga4', action: 'trackEvent', eventName, params })
  }
}

/**
 * Track critical events for FutureMarketingAI
 * These are the key events we want to monitor
 */

// Page Load Event
export const trackPageLoad = (pageName: string): void => {
  trackGA4Event('page_load', {
    page_name: pageName,
    timestamp: new Date().toISOString(),
  })
}

// Hero Section View
export const trackHeroView = (): void => {
  trackGA4Event('hero_view', {
    section: 'hero',
  })
}

// Module Open Event
export const trackModuleOpen = (moduleName: string): void => {
  trackGA4Event('module_open', {
    module_name: moduleName,
  })
}

// Calculator Interaction
export const trackCalculatorInteract = (action: string, value?: number): void => {
  trackGA4Event('calculator_interact', {
    action,
    value,
  })
}

// CTA Click Event
export const trackCTAClick = (ctaName: string, destination: string): void => {
  trackGA4Event('cta_click', {
    cta_name: ctaName,
    destination,
  })
}

// Form Submission
export const trackFormSubmit = (formName: string, success: boolean): void => {
  trackGA4Event('form_submit', {
    form_name: formName,
    success,
  })
}

// Calendly Events
export const trackCalendlyEvent = (action: string, eventType?: string): void => {
  trackGA4Event('calendly_event', {
    action,
    event_type: eventType,
  })
}

// Navigation Events
export const trackNavigation = (from: string, to: string): void => {
  trackGA4Event('navigation', {
    from,
    to,
  })
}

// Outbound Link Click
export const trackOutboundClick = (url: string, label?: string): void => {
  trackGA4Event('outbound_click', {
    url,
    label,
  })
}

// Error Tracking
export const trackError = (errorMessage: string, errorType?: string): void => {
  trackGA4Event('error', {
    error_message: errorMessage,
    error_type: errorType || 'unknown',
  })
}

// Engagement Time (how long user spent on a section)
export const trackEngagementTime = (section: string, timeInSeconds: number): void => {
  trackGA4Event('engagement_time', {
    section,
    time_seconds: timeInSeconds,
  })
}

export default {
  initGA4,
  isGA4Ready,
  setGA4UserProperties,
  getGA4UserProperties,
  trackGA4PageView,
  trackGA4Event,
  trackPageLoad,
  trackHeroView,
  trackModuleOpen,
  trackCalculatorInteract,
  trackCTAClick,
  trackFormSubmit,
  trackCalendlyEvent,
  trackNavigation,
  trackOutboundClick,
  trackError,
  trackEngagementTime,
}
