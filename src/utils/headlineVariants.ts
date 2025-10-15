/**
 * Headline Variants A/B Testing
 *
 * Implements A/B testing for 6 headline approaches:
 *
 * **Original Variants (Outcome-Focused):**
 * - Variant A: Team Size Focus
 * - Variant B: Pain Point Focus
 * - Variant C: Situation Focus
 *
 * **New Variants (Early-Stage Positioning):**
 * - Variant D: Future-Focused
 * - Variant E: Innovation-Focused
 * - Variant F: Risk/Reward Balance
 *
 * Based on: docs/messaging/proxy-indicators-framework.md
 */

export type HeadlineVariant =
  | 'team_size'
  | 'pain_point'
  | 'situation'
  | 'future_focused'
  | 'innovation_focused'
  | 'risk_reward'

const HEADLINE_VARIANT_KEY = 'futuremarketing_headline_variant'
const VARIANT_ANALYTICS_KEY = 'futuremarketing_variant_analytics'

/**
 * Get or assign headline variant for current user
 *
 * Uses localStorage to persist variant across sessions
 * Randomly assigns variant on first visit (33.33% each)
 */
export function getHeadlineVariant(): HeadlineVariant {
  // Check if variant already assigned
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(HEADLINE_VARIANT_KEY)
    if (stored && isValidVariant(stored)) {
      return stored
    }

    // Assign new variant randomly
    const variant = assignRandomVariant()
    localStorage.setItem(HEADLINE_VARIANT_KEY, variant)

    // Track variant assignment
    trackVariantAssignment(variant)

    return variant
  }

  // Fallback for SSR
  return 'team_size'
}

/**
 * Validate variant string
 */
function isValidVariant(variant: string): variant is HeadlineVariant {
  return [
    'team_size',
    'pain_point',
    'situation',
    'future_focused',
    'innovation_focused',
    'risk_reward',
  ].includes(variant)
}

/**
 * Assign random variant (16.67% each - 6 variants)
 */
function assignRandomVariant(): HeadlineVariant {
  const random = Math.random()

  if (random < 0.167) {
    return 'team_size'
  } else if (random < 0.333) {
    return 'pain_point'
  } else if (random < 0.5) {
    return 'situation'
  } else if (random < 0.667) {
    return 'future_focused'
  } else if (random < 0.833) {
    return 'innovation_focused'
  } else {
    return 'risk_reward'
  }
}

/**
 * Track variant assignment in localStorage analytics
 */
function trackVariantAssignment(variant: HeadlineVariant): void {
  if (typeof window === 'undefined') {
    return
  }

  const analytics = getVariantAnalytics()
  const now = new Date().toISOString()

  analytics.assignments.push({
    variant,
    timestamp: now,
    sessionId: getSessionId(),
  })

  localStorage.setItem(VARIANT_ANALYTICS_KEY, JSON.stringify(analytics))
}

/**
 * Track CTA click for current variant
 */
export function trackVariantCTAClick(ctaType: string): void {
  if (typeof window === 'undefined') {
    return
  }

  const variant = getHeadlineVariant()
  const analytics = getVariantAnalytics()
  const now = new Date().toISOString()

  analytics.ctaClicks.push({
    variant,
    ctaType,
    timestamp: now,
    sessionId: getSessionId(),
  })

  localStorage.setItem(VARIANT_ANALYTICS_KEY, JSON.stringify(analytics))

  // Also track to GA4 if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', 'headline_variant_cta_click', {
      variant,
      cta_type: ctaType,
    })
  }
}

/**
 * Track form completion for current variant
 */
export function trackVariantFormCompletion(formType: string): void {
  if (typeof window === 'undefined') {
    return
  }

  const variant = getHeadlineVariant()
  const analytics = getVariantAnalytics()
  const now = new Date().toISOString()

  analytics.formCompletions.push({
    variant,
    formType,
    timestamp: now,
    sessionId: getSessionId(),
  })

  localStorage.setItem(VARIANT_ANALYTICS_KEY, JSON.stringify(analytics))

  // Also track to GA4 if available
  if (typeof window !== 'undefined' && 'gtag' in window) {
    ;(window as any).gtag('event', 'headline_variant_form_complete', {
      variant,
      form_type: formType,
    })
  }
}

/**
 * Get variant analytics data
 */
function getVariantAnalytics(): VariantAnalytics {
  if (typeof window === 'undefined') {
    return createEmptyAnalytics()
  }

  const stored = localStorage.getItem(VARIANT_ANALYTICS_KEY)
  if (!stored) {
    return createEmptyAnalytics()
  }

  try {
    return JSON.parse(stored)
  } catch {
    return createEmptyAnalytics()
  }
}

/**
 * Create empty analytics object
 */
function createEmptyAnalytics(): VariantAnalytics {
  return {
    assignments: [],
    ctaClicks: [],
    formCompletions: [],
  }
}

/**
 * Get or create session ID
 */
function getSessionId(): string {
  if (typeof window === 'undefined') {
    return 'ssr'
  }

  const SESSION_KEY = 'futuremarketing_session_id'
  let sessionId = sessionStorage.getItem(SESSION_KEY)

  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`
    sessionStorage.setItem(SESSION_KEY, sessionId)
  }

  return sessionId
}

/**
 * Get variant analytics summary (for debugging)
 */
export function getVariantAnalyticsSummary(): VariantAnalyticsSummary {
  const analytics = getVariantAnalytics()

  const summary: VariantAnalyticsSummary = {
    team_size: {
      assignments: 0,
      ctaClicks: 0,
      formCompletions: 0,
      conversionRate: 0,
    },
    pain_point: {
      assignments: 0,
      ctaClicks: 0,
      formCompletions: 0,
      conversionRate: 0,
    },
    situation: {
      assignments: 0,
      ctaClicks: 0,
      formCompletions: 0,
      conversionRate: 0,
    },
    future_focused: {
      assignments: 0,
      ctaClicks: 0,
      formCompletions: 0,
      conversionRate: 0,
    },
    innovation_focused: {
      assignments: 0,
      ctaClicks: 0,
      formCompletions: 0,
      conversionRate: 0,
    },
    risk_reward: {
      assignments: 0,
      ctaClicks: 0,
      formCompletions: 0,
      conversionRate: 0,
    },
  }

  // Count assignments
  analytics.assignments.forEach(({ variant }) => {
    summary[variant].assignments++
  })

  // Count CTA clicks
  analytics.ctaClicks.forEach(({ variant }) => {
    summary[variant].ctaClicks++
  })

  // Count form completions
  analytics.formCompletions.forEach(({ variant }) => {
    summary[variant].formCompletions++
  })

  // Calculate conversion rates
  Object.keys(summary).forEach((key) => {
    const variant = key as HeadlineVariant
    const data = summary[variant]
    if (data.assignments > 0) {
      data.conversionRate = (data.formCompletions / data.assignments) * 100
    }
  })

  return summary
}

/**
 * Reset variant (for testing)
 */
export function resetVariant(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(HEADLINE_VARIANT_KEY)
  }
}

/**
 * Reset all analytics (for testing)
 */
export function resetVariantAnalytics(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(VARIANT_ANALYTICS_KEY)
  }
}

// Types
interface VariantAnalytics {
  assignments: Array<{
    variant: HeadlineVariant
    timestamp: string
    sessionId: string
  }>
  ctaClicks: Array<{
    variant: HeadlineVariant
    ctaType: string
    timestamp: string
    sessionId: string
  }>
  formCompletions: Array<{
    variant: HeadlineVariant
    formType: string
    timestamp: string
    sessionId: string
  }>
}

export interface VariantAnalyticsSummary {
  team_size: VariantMetrics
  pain_point: VariantMetrics
  situation: VariantMetrics
  future_focused: VariantMetrics
  innovation_focused: VariantMetrics
  risk_reward: VariantMetrics
}

export interface VariantMetrics {
  assignments: number
  ctaClicks: number
  formCompletions: number
  conversionRate: number
}
