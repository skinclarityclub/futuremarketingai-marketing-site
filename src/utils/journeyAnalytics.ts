/**
 * Journey Analytics - Enhanced Event Tracking
 *
 * Journey-specific analytics with custom dimensions for:
 * - Milestone achievements
 * - Next-best-action engagement
 * - Path completion
 * - Funnel analysis
 *
 * Based on 2025 best practices for product-led growth analytics.
 *
 * @module journeyAnalytics
 */

import type { NextBestAction } from './journeyPredictions'
import type { Nudge } from './journeyNudges'

/**
 * Journey Event Types
 */
export type JourneyEventName =
  | 'journey_started'
  | 'journey_step_completed'
  | 'journey_milestone_achieved'
  | 'journey_completed'
  | 'journey_abandoned'
  | 'nudge_triggered'
  | 'nudge_dismissed'
  | 'nudge_action_clicked'
  | 'recommendation_shown'
  | 'recommendation_dismissed'
  | 'recommendation_action_clicked'
  | 'progress_viewed'
  | 'celebration_shown'

/**
 * Journey Analytics Properties
 */
export interface JourneyEventProperties {
  // Journey Context
  journey_step?: string
  journey_progress?: number // 0-100
  completion_percentage?: number
  time_on_site?: number // seconds

  // User Segmentation
  industry?: string | null
  icp_tier?: string // 'high' | 'medium' | 'low'
  icp_score?: number

  // Milestone Data
  milestone_id?: string
  milestone_title?: string
  achievement_count?: number

  // Nudge Data
  nudge_id?: string
  nudge_type?: string
  nudge_priority?: number
  nudge_trigger_source?: string

  // Recommendation Data
  recommendation_id?: string
  recommendation_type?: string
  recommendation_priority?: number
  recommendation_confidence?: number

  // Engagement Metrics
  modules_explored?: number
  calculator_completed?: boolean
  demo_scheduled?: boolean
  has_seen_pricing?: boolean

  // Conversion Path
  conversion_path?: string // e.g., "hero → explorer → calculator → demo"
  session_duration?: number

  // Action Metadata
  action_target?: string // URL or module ID
  action_label?: string
}

/**
 * Get ICP tier based on score
 */
function getICPTier(score: number): string {
  if (score > 75) {
    return 'high'
  }
  if (score > 50) {
    return 'medium'
  }
  return 'low'
}

/**
 * Track journey start
 */
export function trackJourneyStart(properties: { industry: string | null; icpScore: number }) {
  const eventProps: JourneyEventProperties = {
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
    journey_progress: 0,
    time_on_site: 0,
  }

  trackJourneyEvent('journey_started', eventProps)
}

/**
 * Track step completion
 */
export function trackStepCompleted(properties: {
  stepId: string
  progress: number
  timeOnSite: number
  modulesExplored: number
  industry: string | null
  icpScore: number
}) {
  const eventProps: JourneyEventProperties = {
    journey_step: properties.stepId,
    journey_progress: properties.progress,
    completion_percentage: properties.progress,
    time_on_site: properties.timeOnSite,
    modules_explored: properties.modulesExplored,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('journey_step_completed', eventProps)
}

/**
 * Track milestone achievement
 */
export function trackMilestoneAchieved(properties: {
  milestoneId: string
  milestoneTitle: string
  achievementCount: number
  progress: number
  timeOnSite: number
  industry: string | null
  icpScore: number
}) {
  const eventProps: JourneyEventProperties = {
    milestone_id: properties.milestoneId,
    milestone_title: properties.milestoneTitle,
    achievement_count: properties.achievementCount,
    journey_progress: properties.progress,
    time_on_site: properties.timeOnSite,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('journey_milestone_achieved', eventProps)
}

/**
 * Track journey completion (100%)
 */
export function trackJourneyCompleted(properties: {
  sessionDuration: number
  modulesExplored: number
  calculatorCompleted: boolean
  demoScheduled: boolean
  industry: string | null
  icpScore: number
  conversionPath: string
}) {
  const eventProps: JourneyEventProperties = {
    journey_progress: 100,
    completion_percentage: 100,
    session_duration: properties.sessionDuration,
    modules_explored: properties.modulesExplored,
    calculator_completed: properties.calculatorCompleted,
    demo_scheduled: properties.demoScheduled,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
    conversion_path: properties.conversionPath,
  }

  trackJourneyEvent('journey_completed', eventProps)
}

/**
 * Track nudge triggered
 */
export function trackNudgeTriggered(
  nudge: Nudge,
  properties: {
    progress: number
    timeOnSite: number
    industry: string | null
    icpScore: number
  }
) {
  const eventProps: JourneyEventProperties = {
    nudge_id: nudge.id,
    nudge_type: nudge.type,
    nudge_trigger_source: 'auto', // or 'manual' if user-triggered
    journey_progress: properties.progress,
    time_on_site: properties.timeOnSite,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('nudge_triggered', eventProps)
}

/**
 * Track nudge dismissed
 */
export function trackNudgeDismissed(
  nudgeId: string,
  properties: {
    industry: string | null
    icpScore: number
  }
) {
  const eventProps: JourneyEventProperties = {
    nudge_id: nudgeId,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('nudge_dismissed', eventProps)
}

/**
 * Track nudge action clicked
 */
export function trackNudgeActionClicked(
  nudge: Nudge,
  properties: {
    industry: string | null
    icpScore: number
  }
) {
  const eventProps: JourneyEventProperties = {
    nudge_id: nudge.id,
    nudge_type: nudge.type,
    action_target: nudge.action?.type,
    action_label: nudge.action?.label,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('nudge_action_clicked', eventProps)
}

/**
 * Track recommendation shown
 */
export function trackRecommendationShown(
  recommendation: NextBestAction,
  properties: {
    progress: number
    industry: string | null
    icpScore: number
  }
) {
  const eventProps: JourneyEventProperties = {
    recommendation_id: recommendation.id,
    recommendation_type: recommendation.type,
    recommendation_priority: recommendation.priority,
    recommendation_confidence: recommendation.confidence,
    journey_progress: properties.progress,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('recommendation_shown', eventProps)
}

/**
 * Track recommendation action clicked
 */
export function trackRecommendationClicked(
  recommendation: NextBestAction,
  properties: {
    industry: string | null
    icpScore: number
  }
) {
  const eventProps: JourneyEventProperties = {
    recommendation_id: recommendation.id,
    recommendation_type: recommendation.type,
    recommendation_priority: recommendation.priority,
    recommendation_confidence: recommendation.confidence,
    action_target: recommendation.action?.target,
    action_label: recommendation.action?.label,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('recommendation_action_clicked', eventProps)
}

/**
 * Track celebration shown
 */
export function trackCelebrationShown(properties: {
  milestoneId: string
  milestoneTitle: string
  progress: number
  industry: string | null
  icpScore: number
}) {
  const eventProps: JourneyEventProperties = {
    milestone_id: properties.milestoneId,
    milestone_title: properties.milestoneTitle,
    journey_progress: properties.progress,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('celebration_shown', eventProps)
}

/**
 * Core analytics tracking function
 *
 * Sends events to Google Analytics 4 with custom dimensions.
 * Can be extended to support other analytics platforms (Amplitude, Mixpanel, etc.)
 */
function trackJourneyEvent(eventName: JourneyEventName, properties: JourneyEventProperties) {
  // GA4 Event Tracking
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      event_category: 'journey_guidance',
      ...properties,
      // Filter out null values
      industry: properties.industry ?? undefined,
      // Add timestamp
      event_timestamp: Date.now(),
      // Add session ID (can be generated once per session)
      session_id: getSessionId(),
    })
  }

  // Console log for debugging (remove in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 Journey Analytics:', eventName, properties)
  }

  // TODO: Add support for other analytics platforms
  // - Amplitude: amplitude.track(eventName, properties)
  // - Mixpanel: mixpanel.track(eventName, properties)
  // - Segment: analytics.track(eventName, properties)
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') {
    return 'server'
  }

  let sessionId = sessionStorage.getItem('journey_session_id')

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
    sessionStorage.setItem('journey_session_id', sessionId)
  }

  return sessionId
}

/**
 * Track journey abandonment (user leaves or becomes inactive)
 *
 * Should be called on page unload or after extended inactivity.
 */
export function trackJourneyAbandoned(properties: {
  progress: number
  sessionDuration: number
  modulesExplored: number
  lastStepId: string
  industry: string | null
  icpScore: number
}) {
  const eventProps: JourneyEventProperties = {
    journey_progress: properties.progress,
    journey_step: properties.lastStepId,
    session_duration: properties.sessionDuration,
    modules_explored: properties.modulesExplored,
    industry: properties.industry,
    icp_tier: getICPTier(properties.icpScore),
    icp_score: properties.icpScore,
  }

  trackJourneyEvent('journey_abandoned', eventProps)
}

/**
 * Helper: Build conversion path string
 *
 * Example: "hero → explorer → calculator → demo"
 */
export function buildConversionPath(visitedPages: string[]): string {
  const pageNames: Record<string, string> = {
    '/': 'hero',
    '/explorer': 'explorer',
    '/calculator': 'calculator',
    '/roi-calculator': 'calculator',
    '/demo-scheduling': 'demo',
    '/dashboard': 'dashboard',
  }

  return visitedPages
    .map((page) => pageNames[page] || 'other')
    .filter((name, index, arr) => name !== 'other' && arr.indexOf(name) === index) // Dedupe
    .join(' → ')
}

/**
 * Helper: Calculate funnel conversion rates
 *
 * Returns percentage of users who completed each step
 */
export interface FunnelStep {
  step: string
  completed: number
  conversion: number // percentage
}

export function calculateFunnelMetrics(data: {
  started: number
  explorer: number
  calculator: number
  demo: number
}): FunnelStep[] {
  return [
    {
      step: 'Started',
      completed: data.started,
      conversion: 100,
    },
    {
      step: 'Explorer',
      completed: data.explorer,
      conversion: (data.explorer / data.started) * 100,
    },
    {
      step: 'Calculator',
      completed: data.calculator,
      conversion: (data.calculator / data.started) * 100,
    },
    {
      step: 'Demo Scheduled',
      completed: data.demo,
      conversion: (data.demo / data.started) * 100,
    },
  ]
}

// Type augmentation for gtag
declare global {
  interface Window {
    gtag?: (command: string, eventName: string, params?: Record<string, unknown>) => void
  }
}
