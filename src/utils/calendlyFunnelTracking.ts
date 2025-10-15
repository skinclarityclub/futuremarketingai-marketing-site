/**
 * Calendly Funnel Tracking (2025 Best Practices)
 *
 * Comprehensive funnel analytics for Calendly booking flow
 * - Track user progression through booking funnel
 * - Identify drop-off points
 * - Optimize conversion rates
 * - GA4 + Hotjar integration
 */

import { trackGA4Event } from './ga4'
import { hotjarEvent, HotjarEvents } from './hotjar'

export type FunnelStep =
  | 'booking_prompt_shown'
  | 'booking_cta_clicked'
  | 'calendly_modal_opened'
  | 'calendly_widget_loaded'
  | 'date_selected'
  | 'form_started'
  | 'booking_completed'

export interface FunnelContext {
  source: string // 'ai_assistant_chat', 'hero_section', 'explorer_module', etc.
  eventType?: string // 'enterprise-demo', 'strategic-demo', etc.
  icpScore?: number
  icpTier?: string // 'enterprise', 'strategic', 'standard', 'discovery'
  sessionId?: string
  userId?: string
}

/**
 * Track a funnel step with context
 */
export function trackCalendlyFunnelStep(step: FunnelStep, context: FunnelContext): void {
  const eventName = `calendly_funnel_${step}`

  // GA4 Event with detailed context
  trackGA4Event(eventName, {
    event_category: 'conversion_funnel',
    event_label: `Calendly - ${step}`,
    funnel_step: step,
    source: context.source,
    event_type: context.eventType || 'unknown',
    icp_score: context.icpScore || 0,
    icp_tier: context.icpTier || 'unknown',
    session_id: context.sessionId,
    user_id: context.userId,
  })

  // Log for debugging
  console.log(`📊 Funnel Step: ${step}`, {
    source: context.source,
    eventType: context.eventType,
    icpTier: context.icpTier,
  })

  // Critical conversion point
  if (step === 'booking_completed') {
    hotjarEvent(HotjarEvents.CALENDLY_BOOKING_COMPLETED)
  }
}

/**
 * Track funnel abandonment
 */
export function trackCalendlyFunnelAbandonment(
  lastStep: FunnelStep,
  context: FunnelContext,
  reason?: string
): void {
  trackGA4Event('calendly_funnel_abandoned', {
    event_category: 'conversion_funnel',
    event_label: 'Booking Flow Abandoned',
    last_step: lastStep,
    source: context.source,
    event_type: context.eventType || 'unknown',
    icp_score: context.icpScore || 0,
    icp_tier: context.icpTier || 'unknown',
    abandonment_reason: reason || 'unknown',
  })

  console.log(`⚠️ Funnel Abandoned at: ${lastStep}`, {
    reason,
    context,
  })
}

/**
 * Calculate and track funnel conversion rate
 */
export function trackCalendlyFunnelConversion(
  startTime: number,
  endTime: number,
  context: FunnelContext
): void {
  const duration = Math.round((endTime - startTime) / 1000) // seconds

  trackGA4Event('calendly_funnel_converted', {
    event_category: 'conversion',
    event_label: 'Booking Flow Completed',
    value: 1,
    conversion_duration: duration,
    source: context.source,
    event_type: context.eventType || 'unknown',
    icp_tier: context.icpTier || 'unknown',
  })

  console.log(`✅ Funnel Conversion: ${duration}s`, context)
}

/**
 * Funnel step sequence for validation
 */
export const FUNNEL_STEPS_SEQUENCE: FunnelStep[] = [
  'booking_prompt_shown',
  'booking_cta_clicked',
  'calendly_modal_opened',
  'calendly_widget_loaded',
  'date_selected',
  'form_started',
  'booking_completed',
]

/**
 * Get funnel progress percentage
 */
export function getFunnelProgress(currentStep: FunnelStep): number {
  const stepIndex = FUNNEL_STEPS_SEQUENCE.indexOf(currentStep)
  if (stepIndex === -1) {
    return 0
  }

  return Math.round(((stepIndex + 1) / FUNNEL_STEPS_SEQUENCE.length) * 100)
}

/**
 * Funnel session tracker
 */
export class CalendlyFunnelSession {
  private startTime: number
  private steps: FunnelStep[] = []
  private context: FunnelContext

  constructor(context: FunnelContext) {
    this.startTime = Date.now()
    this.context = {
      ...context,
      sessionId: `funnel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
  }

  trackStep(step: FunnelStep): void {
    if (!this.steps.includes(step)) {
      this.steps.push(step)
      trackCalendlyFunnelStep(step, this.context)
    }
  }

  complete(): void {
    const endTime = Date.now()
    trackCalendlyFunnelConversion(this.startTime, endTime, this.context)
  }

  abandon(reason?: string): void {
    const lastStep = this.steps[this.steps.length - 1] || 'booking_prompt_shown'
    trackCalendlyFunnelAbandonment(lastStep, this.context, reason)
  }

  getProgress(): number {
    const lastStep = this.steps[this.steps.length - 1]
    return lastStep ? getFunnelProgress(lastStep) : 0
  }

  getContext(): FunnelContext {
    return this.context
  }
}
