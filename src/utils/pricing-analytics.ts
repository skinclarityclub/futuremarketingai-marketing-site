/**
 * Pricing Analytics Tracking
 *
 * Specialized analytics tracking for Early Adopter Pricing Strategy (Model B).
 * Tracks all user interactions with pricing components across the demo.
 *
 * Events tracked:
 * - Banner impressions & clicks
 * - Tier badge views
 * - Slot progress views
 * - Modal opens/closes/tab switches
 * - Value stacking views
 * - Roadmap interactions
 * - CTA conversions
 */

import { trackEvent, trackCTAClick } from './analytics'
import { trackGA4Event } from './ga4'
import { PricingTier } from '../types/pricing'

// ============================================================================
// Pricing Banner Events
// ============================================================================

/**
 * Track pricing banner impression
 * @param location - Where the banner is displayed (e.g., 'Hero', 'Explorer')
 * @param position - Banner position (e.g., 'top-right', 'bottom')
 * @param variant - Banner variant ('floating', 'inline')
 */
export const trackPricingBannerImpression = (
  location: string,
  position: string,
  variant: string
): void => {
  trackEvent({
    category: 'Pricing Banner',
    action: 'Impression',
    label: `${location} - ${position} - ${variant}`,
  })
}

/**
 * Track pricing banner CTA click
 * @param location - Where the banner is displayed
 * @param tier - Current tier displayed
 * @param slotsRemaining - Slots remaining in tier
 */
export const trackPricingBannerClick = (
  location: string,
  tier: PricingTier,
  slotsRemaining: number
): void => {
  trackCTAClick('Pricing Banner', 'Calendly', {
    tier,
    slots_remaining: slotsRemaining,
    location,
  })

  trackGA4Event('pricing_banner_click', {
    location,
    tier,
    slots_remaining: slotsRemaining,
    urgency_level: slotsRemaining <= 2 ? 'critical' : slotsRemaining <= 5 ? 'high' : 'normal',
  })
}

// ============================================================================
// Slot Progress Events
// ============================================================================

/**
 * Track slot progress indicator impression
 * @param tier - Pricing tier displayed
 * @param variant - Display variant
 * @param percentFilled - Percentage of slots filled
 */
export const trackSlotProgressView = (
  tier: PricingTier,
  variant: string,
  percentFilled: number,
  metadata?: {
    slotsRemaining?: number
    showsWarning?: boolean
  }
): void => {
  trackEvent({
    category: 'Slot Progress',
    action: 'View',
    label: `${tier} - ${variant}`,
    value: Math.round(percentFilled),
  })

  trackGA4Event('slot_progress_view', {
    tier,
    variant,
    percent_filled: percentFilled,
    slots_remaining: metadata?.slotsRemaining,
    shows_warning: metadata?.showsWarning,
  })
}

// ============================================================================
// Pricing Modal Events
// ============================================================================

/**
 * Track pricing reveal modal open
 * @param trigger - What triggered the modal (e.g., 'Auto After ROI', 'CTA Click')
 * @param recommendedTier - AI-recommended tier
 * @param calculatedROI - User's calculated ROI
 */
export const trackPricingModalOpen = (
  trigger: string,
  recommendedTier: PricingTier,
  metadata?: {
    calculatedROI?: number
    timeOnPage?: number
    previousInteractions?: number
  }
): void => {
  trackEvent({
    category: 'Pricing Modal',
    action: 'Open',
    label: `${trigger} - Recommended: ${recommendedTier}`,
  })

  trackGA4Event('pricing_modal_open', {
    trigger,
    recommended_tier: recommendedTier,
    calculated_roi: metadata?.calculatedROI,
    time_on_page: metadata?.timeOnPage,
    previous_interactions: metadata?.previousInteractions,
  })
}

/**
 * Track pricing modal close
 * @param method - How modal was closed (e.g., 'Close Button', 'Escape', 'Overlay Click')
 * @param timeSpent - Seconds spent in modal
 * @param tabsViewed - Which tabs were viewed
 */
export const trackPricingModalClose = (
  method: string,
  timeSpent: number,
  tabsViewed: string[]
): void => {
  trackEvent({
    category: 'Pricing Modal',
    action: 'Close',
    label: method,
    value: timeSpent,
  })

  trackGA4Event('pricing_modal_close', {
    close_method: method,
    time_spent: timeSpent,
    tabs_viewed: tabsViewed.join(','),
    tabs_count: tabsViewed.length,
  })
}

/**
 * Track pricing modal tab switch
 * @param fromTab - Previous tab
 * @param toTab - New tab
 * @param timeOnPreviousTab - Seconds spent on previous tab
 */
export const trackPricingModalTabSwitch = (
  fromTab: string,
  toTab: string,
  timeOnPreviousTab: number
): void => {
  trackEvent({
    category: 'Pricing Modal',
    action: 'Tab Switch',
    label: `${fromTab} -> ${toTab}`,
    value: timeOnPreviousTab,
  })

  trackGA4Event('pricing_modal_tab_switch', {
    from_tab: fromTab,
    to_tab: toTab,
    time_on_previous_tab: timeOnPreviousTab,
  })
}

/**
 * Track pricing modal CTA click
 * @param ctaType - Type of CTA ('primary', 'secondary')
 * @param tier - Selected/recommended tier
 * @param activeTab - Which tab was active when clicked
 */
export const trackPricingModalCTA = (
  ctaType: 'primary' | 'secondary',
  tier: PricingTier,
  activeTab: string,
  metadata?: {
    timeInModal?: number
    tabsViewed?: string[]
  }
): void => {
  trackCTAClick(`Pricing Modal ${ctaType}`, tier, {
    active_tab: activeTab,
    time_in_modal: metadata?.timeInModal,
    tabs_viewed: metadata?.tabsViewed?.join(','),
  })

  trackGA4Event('pricing_modal_cta_click', {
    cta_type: ctaType,
    tier,
    active_tab: activeTab,
    time_in_modal: metadata?.timeInModal,
    tabs_viewed: metadata?.tabsViewed?.join(','),
  })
}

// ============================================================================
// Value Stacking Events
// ============================================================================

/**
 * Track value stacking section impression
 * @param location - Where section is displayed
 * @param variant - Display variant
 * @param compareTier - Tier being compared
 */
export const trackValueStackingView = (
  location: string,
  variant: string,
  compareTier: PricingTier,
  metadata?: {
    totalValue?: number
    userPrice?: number
    savings?: number
  }
): void => {
  trackEvent({
    category: 'Value Stacking',
    action: 'View',
    label: `${location} - ${variant} - ${compareTier}`,
  })

  trackGA4Event('value_stacking_view', {
    location,
    variant,
    compare_tier: compareTier,
    total_value: metadata?.totalValue,
    user_price: metadata?.userPrice,
    savings: metadata?.savings,
  })
}

/**
 * Track value stacking CTA click
 * @param location - Where CTA was clicked
 * @param tier - Associated tier
 */
export const trackValueStackingCTA = (location: string, tier: PricingTier): void => {
  trackCTAClick('Value Stacking CTA', 'Calendly', {
    location,
    tier,
  })

  trackGA4Event('value_stacking_cta_click', {
    location,
    tier,
  })
}

// ============================================================================
// Roadmap Table Events
// ============================================================================

/**
 * Track roadmap table impression
 * @param variant - Table variant ('timeline', 'table')
 * @param currentTier - User's current tier
 */
export const trackRoadmapView = (variant: string, currentTier: PricingTier): void => {
  trackEvent({
    category: 'Pricing Roadmap',
    action: 'View',
    label: `${variant} - Current: ${currentTier}`,
  })

  trackGA4Event('pricing_roadmap_view', {
    variant,
    current_tier: currentTier,
  })
}

/**
 * Track roadmap tier expansion
 * @param tier - Which tier was expanded
 * @param variant - Table variant
 */
export const trackRoadmapTierExpand = (tier: PricingTier, variant: string): void => {
  trackEvent({
    category: 'Pricing Roadmap',
    action: 'Tier Expand',
    label: `${tier} - ${variant}`,
  })

  trackGA4Event('pricing_roadmap_tier_expand', {
    tier,
    variant,
  })
}

/**
 * Track roadmap tier collapse
 * @param tier - Which tier was collapsed
 * @param timeExpanded - Seconds tier was expanded
 */
export const trackRoadmapTierCollapse = (tier: PricingTier, timeExpanded: number): void => {
  trackEvent({
    category: 'Pricing Roadmap',
    action: 'Tier Collapse',
    label: tier,
    value: timeExpanded,
  })

  trackGA4Event('pricing_roadmap_tier_collapse', {
    tier,
    time_expanded: timeExpanded,
  })
}

// ============================================================================
// Tier Badge Events
// ============================================================================

/**
 * Track tier badge impression
 * @param tier - Which tier badge
 * @param location - Where badge is displayed
 * @param variant - Badge variant
 */
export const trackTierBadgeView = (tier: PricingTier, location: string, variant: string): void => {
  trackEvent({
    category: 'Tier Badge',
    action: 'View',
    label: `${tier} - ${location} - ${variant}`,
  })

  trackGA4Event('tier_badge_view', {
    tier,
    location,
    variant,
  })
}

// ============================================================================
// Conversion Funnel Events
// ============================================================================

/**
 * Track user progressing through pricing funnel
 * @param step - Funnel step name
 * @param tier - Associated tier
 */
export const trackPricingFunnelStep = (
  step: 'awareness' | 'consideration' | 'evaluation' | 'conversion',
  tier: PricingTier,
  metadata?: Record<string, any>
): void => {
  trackEvent({
    category: 'Pricing Funnel',
    action: step,
    label: tier,
  })

  trackGA4Event('pricing_funnel_step', {
    step,
    tier,
    ...metadata,
  })
}

/**
 * Track complete pricing journey
 * @param startTier - Initial tier shown
 * @param endTier - Final tier selected
 * @param touchpoints - Number of pricing interactions
 * @param timeToConversion - Seconds from first view to CTA click
 */
export const trackPricingJourney = (
  startTier: PricingTier,
  endTier: PricingTier,
  touchpoints: number,
  timeToConversion: number
): void => {
  trackEvent({
    category: 'Pricing Journey',
    action: 'Complete',
    label: `${startTier} -> ${endTier}`,
    value: timeToConversion,
  })

  trackGA4Event('pricing_journey_complete', {
    start_tier: startTier,
    end_tier: endTier,
    touchpoints,
    time_to_conversion: timeToConversion,
    tier_changed: startTier !== endTier,
  })
}

// ============================================================================
// Urgency & Scarcity Triggers
// ============================================================================

/**
 * Track when urgency messaging is displayed
 * @param triggerType - Type of urgency trigger
 * @param tier - Associated tier
 * @param slotsRemaining - Current slots remaining
 */
export const trackUrgencyTrigger = (
  triggerType: 'low_availability' | 'timer' | 'social_proof' | 'price_increase',
  tier: PricingTier,
  slotsRemaining?: number
): void => {
  trackEvent({
    category: 'Urgency Trigger',
    action: 'Display',
    label: `${triggerType} - ${tier}`,
    value: slotsRemaining,
  })

  trackGA4Event('urgency_trigger_display', {
    trigger_type: triggerType,
    tier,
    slots_remaining: slotsRemaining,
  })
}

// ============================================================================
// Export all tracking functions
// ============================================================================

export const pricingAnalytics = {
  // Banner
  trackBannerView: trackPricingBannerImpression,
  trackBannerClick: trackPricingBannerClick,

  // Slot Progress
  trackSlotProgressView,

  // Modal
  trackModalOpen: trackPricingModalOpen,
  trackModalClose: trackPricingModalClose,
  trackModalTabSwitch: trackPricingModalTabSwitch,
  trackModalCTA: trackPricingModalCTA,

  // Value Stacking
  trackValueStackingView,
  trackValueStackingCTA,

  // Roadmap
  trackRoadmapView,
  trackRoadmapTierExpand,
  trackRoadmapTierCollapse,

  // Tier Badge
  trackTierBadgeView,

  // Funnel
  trackFunnelStep: trackPricingFunnelStep,
  trackJourney: trackPricingJourney,

  // Urgency
  trackUrgencyTrigger,
}
