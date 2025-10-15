/**
 * Analytics Tracking Utilities
 *
 * Unified analytics tracking interface that works with:
 * - Google Analytics 4 (via react-ga4)
 * - Legacy gtag.js and analytics.js (fallback)
 *
 * This module provides a simple, consistent API for tracking
 * all user interactions across the application.
 */

import {
  trackGA4Event,
  trackCTAClick as trackGA4CTA,
  trackCalculatorInteract as trackGA4Calculator,
  trackCalendlyEvent,
  trackOutboundClick as trackGA4Outbound,
} from './ga4'

export interface AnalyticsEvent {
  category: string
  action: string
  label?: string
  value?: number
}

/**
 * Track a custom event
 *
 * This is the base tracking function that sends events to all
 * configured analytics platforms.
 *
 * @param event - Event details
 */
export const trackEvent = (event: AnalyticsEvent): void => {
  const { category, action, label, value } = event

  // Console log for development
  if (import.meta.env.DEV) {
    console.log('📊 Analytics Event:', { category, action, label, value })
  }

  // Send to Google Analytics 4 (primary)
  trackGA4Event(`${category.toLowerCase()}_${action.toLowerCase()}`, {
    category,
    action,
    label,
    value,
  })

  // Fallback: Google Analytics (gtag.js) - if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    const gtag = (window as any).gtag
    gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }

  // Fallback: Google Analytics (Universal Analytics) - if available
  if (typeof window !== 'undefined' && 'ga' in window) {
    const ga = (window as any).ga
    ga('send', 'event', category, action, label, value)
  }
}

/**
 * Track CTA impression (when CTA becomes visible)
 *
 * @param ctaName - Name of the CTA
 * @param location - Where the CTA is displayed
 * @param metadata - Additional tracking data
 */
export const trackCTAImpression = (
  ctaName: string,
  location: string,
  metadata?: Record<string, any>
): void => {
  trackEvent({
    category: 'CTA',
    action: 'Impression',
    label: `${ctaName} at ${location}`,
  })

  trackGA4Event('cta_impression', {
    cta_name: ctaName,
    cta_location: location,
    ...metadata,
  })
}

/**
 * Track CTA button click
 *
 * @param ctaName - Name of the CTA button
 * @param destination - Where the CTA leads
 * @param metadata - Additional tracking data (timeToClick, variant, etc.)
 */
export const trackCTAClick = (
  ctaName: string,
  destination: string,
  metadata?: Record<string, any>
): void => {
  // Use GA4-specific tracking
  trackGA4CTA(ctaName, destination)

  // Also track via generic event system for compatibility
  trackEvent({
    category: 'CTA',
    action: 'Click',
    label: `${ctaName} -> ${destination}`,
  })

  // Track enhanced metadata if provided
  if (metadata) {
    trackGA4Event('cta_click_enhanced', {
      cta_name: ctaName,
      cta_destination: destination,
      ...metadata,
    })
  }
}

/**
 * Track calculator usage
 *
 * @param action - Calculator action (e.g., 'Input Change', 'Calculation Complete')
 * @param label - Additional context
 * @param value - Optional numeric value
 */
export const trackCalculator = (action: string, label?: string, value?: number): void => {
  // Use GA4-specific tracking
  trackGA4Calculator(action, value)

  // Also track via generic event system for compatibility
  trackEvent({
    category: 'ROI Calculator',
    action,
    label,
    value,
  })
}

/**
 * Track Calendly events
 *
 * @param action - Calendly action (e.g., 'Modal Opened', 'Event Scheduled')
 * @param eventType - Type of event scheduled
 */
export const trackCalendly = (action: string, eventType?: string): void => {
  // Use GA4-specific tracking
  trackCalendlyEvent(action, eventType)

  // Also track via generic event system for compatibility
  trackEvent({
    category: 'Calendly',
    action,
    label: eventType,
  })
}

/**
 * Track page view
 *
 * Note: Page views are now handled automatically by GA4 integration in App.tsx.
 * This function is kept for backward compatibility.
 *
 * @param pageName - Name of the page
 * @param path - Page path
 */
export const trackPageView = (pageName: string, path: string): void => {
  if (import.meta.env.DEV) {
    console.log('📄 Page View:', { pageName, path })
  }
}

/**
 * Track outbound link click
 *
 * @param url - Destination URL
 * @param label - Link label
 */
export const trackOutboundLink = (url: string, label?: string): void => {
  // Use GA4-specific tracking
  trackGA4Outbound(url, label)

  // Also track via generic event system for compatibility
  trackEvent({
    category: 'Outbound Link',
    action: 'Click',
    label: label || url,
  })
}

// Re-export GA4 functions for direct use
export {
  trackPageLoad,
  trackHeroView,
  trackModuleOpen,
  trackFormSubmit,
  trackNavigation,
  trackError,
  trackEngagementTime,
} from './ga4'

// Re-export Hotjar functions for direct use
export {
  hotjarEvent,
  hotjarStateChange,
  hotjarTagRecording,
  hotjarIdentify,
  hotjarTriggerPoll,
  getHotjarUserId,
  isHotjarReady,
  HotjarEvents,
} from './hotjar'

// Re-export Analytics Integration functions
export {
  initAnalyticsIntegration,
  syncHotjarUserIdToGA4,
  trackCrossPlatformEvent,
  isIntegrationReady,
  getSyncedHotjarUserId,
  GA4_CUSTOM_DIMENSION_SETUP,
} from './analytics-integration'

export type { CustomUserProperties } from './analytics-integration'

// Re-export Pricing Analytics functions
export {
  trackPricingBannerImpression,
  trackPricingBannerClick,
  trackSlotProgressView,
  trackPricingModalOpen,
  trackPricingModalClose,
  trackPricingModalTabSwitch,
  trackPricingModalCTA,
  trackValueStackingView,
  trackValueStackingCTA,
  trackRoadmapView,
  trackRoadmapTierExpand,
  trackRoadmapTierCollapse,
  trackTierBadgeView,
  trackPricingFunnelStep,
  trackPricingJourney,
  trackUrgencyTrigger,
  pricingAnalytics,
} from './pricing-analytics'
