/**
 * Calendly Configuration
 *
 * Configures different Calendly event types based on ICP score and user journey.
 * Higher quality leads get routed to more premium meeting types.
 */

export interface CalendlyEventType {
  id: string
  name: string
  url: string
  duration: number // in minutes
  description: string
  minICPScore?: number // Minimum ICP score to qualify for this event type
  maxICPScore?: number // Maximum ICP score for this event type
  priority: number // Higher number = higher priority event type
}

/**
 * Calendly Event Types
 *
 * Organized by priority:
 * - Enterprise Demo: For high-value prospects (ICP score 80+)
 * - Strategic Demo: For qualified prospects (ICP score 60-79)
 * - Standard Demo: For interested prospects (ICP score 40-59)
 * - Discovery Call: For exploratory prospects (ICP score <40)
 */
export const CALENDLY_EVENT_TYPES: CalendlyEventType[] = [
  {
    id: 'enterprise-demo',
    name: 'Enterprise Strategy Session',
    url: 'https://calendly.com/futuremarketingai/enterprise-strategy-60min',
    duration: 60,
    description: 'Exclusive 60-minute strategy session with our senior strategist',
    minICPScore: 80,
    priority: 4,
  },
  {
    id: 'strategic-demo',
    name: 'Strategic Platform Demo',
    url: 'https://calendly.com/futuremarketingai/strategic-demo-45min',
    duration: 45,
    description: 'In-depth 45-minute platform walkthrough tailored to your needs',
    minICPScore: 60,
    maxICPScore: 79,
    priority: 3,
  },
  {
    id: 'standard-demo',
    name: 'Platform Demo',
    url: 'https://calendly.com/futuremarketingai/platform-demo-30min',
    duration: 30,
    description: 'Comprehensive 30-minute platform demonstration',
    minICPScore: 40,
    maxICPScore: 59,
    priority: 2,
  },
  {
    id: 'discovery-call',
    name: 'Discovery Call',
    url: 'https://calendly.com/futuremarketingai/discovery-call-20min',
    duration: 20,
    description: 'Quick 20-minute exploratory call to understand your needs',
    maxICPScore: 39,
    priority: 1,
  },
]

/**
 * Default Calendly URL (fallback)
 */
export const DEFAULT_CALENDLY_URL = CALENDLY_EVENT_TYPES[2].url // Standard demo

/**
 * Get appropriate Calendly event type based on ICP score
 */
export function getCalendlyEventType(icpScore: number | null | undefined): CalendlyEventType {
  // If no ICP score, use standard demo
  if (icpScore === null || icpScore === undefined) {
    return CALENDLY_EVENT_TYPES[2] // Standard demo
  }

  // Find matching event type based on ICP score
  const matchingEventTypes = CALENDLY_EVENT_TYPES.filter((eventType) => {
    const meetsMin = eventType.minICPScore === undefined || icpScore >= eventType.minICPScore
    const meetsMax = eventType.maxICPScore === undefined || icpScore <= eventType.maxICPScore
    return meetsMin && meetsMax
  })

  // Return highest priority match, or default to standard demo
  if (matchingEventTypes.length > 0) {
    return matchingEventTypes.sort((a, b) => b.priority - a.priority)[0]
  }

  return CALENDLY_EVENT_TYPES[2] // Standard demo fallback
}

/**
 * Get Calendly event type by ID
 */
export function getCalendlyEventTypeById(id: string): CalendlyEventType | undefined {
  return CALENDLY_EVENT_TYPES.find((eventType) => eventType.id === id)
}

/**
 * Journey Stage-Based Event Selection
 *
 * Different journey stages may warrant different meeting types
 */
export interface JourneyContext {
  completedSteps: number
  timeOnSite: number // seconds
  exploredModules: number
  calculatorCompleted: boolean
}

export function getCalendlyEventTypeByJourney(
  icpScore: number | null | undefined,
  journeyContext: JourneyContext
): CalendlyEventType {
  const baseEventType = getCalendlyEventType(icpScore)

  // High engagement = upgrade to strategic demo (if not already enterprise)
  const highEngagement =
    journeyContext.completedSteps >= 5 ||
    journeyContext.exploredModules >= 3 ||
    journeyContext.timeOnSite >= 300 // 5 minutes

  if (highEngagement && baseEventType.priority < 3) {
    // Upgrade to strategic demo
    return CALENDLY_EVENT_TYPES[1] // Strategic demo
  }

  // Calculator completed = strong buying intent
  if (journeyContext.calculatorCompleted && baseEventType.priority < 2) {
    // Upgrade to at least standard demo
    return CALENDLY_EVENT_TYPES[2] // Standard demo
  }

  return baseEventType
}

/**
 * Get event type display name with emoji
 */
export function getEventTypeDisplayName(eventType: CalendlyEventType): string {
  const emojiMap: Record<string, string> = {
    'enterprise-demo': '⭐',
    'strategic-demo': '🎯',
    'standard-demo': '📊',
    'discovery-call': '💬',
  }

  const emoji = emojiMap[eventType.id] || '📅'
  return `${emoji} ${eventType.name}`
}
