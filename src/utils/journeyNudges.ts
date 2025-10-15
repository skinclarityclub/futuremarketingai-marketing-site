/**
 * Journey Nudge System
 *
 * Provides context-aware, proactive guidance to users based on:
 * - Time on site
 * - Modules explored
 * - ICP score
 * - Calculator completion
 * - Conversation engagement
 *
 * Nudges are non-intrusive suggestions that appear at optimal moments
 * to guide users through their discovery journey.
 *
 * @module journeyNudges
 */

/**
 * Multi-Dimensional Trigger Scoring System (2025 Best Practice)
 *
 * Combines time, engagement, and intent signals for nuanced nudge triggering.
 * Based on research: milestone-triggered nudges have 3x higher engagement.
 */
export interface NudgeTriggerScore {
  timeWeight: number // 0-1, based on timeOnSite
  engagementWeight: number // 0-1, based on modulesExplored
  intentWeight: number // 0-1, based on icpScore, calculatorCompleted
  totalScore: number // Weighted average
  threshold: number // trigger when totalScore > threshold (default: 0.7)
}

export interface NudgeTrigger {
  id: string
  name: string
  condition: (context: NudgeContext) => boolean
  scoringFn?: (context: NudgeContext) => NudgeTriggerScore // New: scoring function
  priority: number // 1-10, higher = more urgent
  cooldown: number // Minutes before this nudge can trigger again
  maxOccurrences?: number // Max times this nudge can show
  triggerType: 'time-based' | 'milestone' | 'intent' | 'inactivity' // New: categorization
}

export interface Nudge {
  id: string
  type: 'info' | 'success' | 'warning' | 'celebration' | 'cta'
  title: string
  message: string
  action?: {
    label: string
    type: 'navigate' | 'open_chat' | 'open_calculator' | 'schedule_demo'
    value?: string
  }
  icon?: string
  duration?: number // ms to show (default: 5000)
}

export interface NudgeContext {
  timeOnSite: number // seconds
  modulesExplored: number
  icpScore: number
  calculatorCompleted: boolean
  messagesCount: number
  lastMessageTime?: number // timestamp
  completedSteps: string[]
  hasScheduledDemo: boolean
  hasSeenPricing: boolean
  inactivityTime?: number // seconds since last interaction
}

export interface NudgeHistory {
  [nudgeId: string]: {
    count: number
    lastShown: number // timestamp
  }
}

/**
 * Calculate multi-dimensional trigger score (2025 Best Practice)
 *
 * Time Weight (30%): Time spent on site
 * Engagement Weight (40%): Modules explored, steps completed
 * Intent Weight (30%): ICP score, calculator usage, demo interest
 *
 * @param context - Current user context
 * @param weights - Custom weight distribution (default: 0.3, 0.4, 0.3)
 * @returns Trigger score object with weighted average
 */
export function calculateTriggerScore(
  context: NudgeContext,
  weights: { time: number; engagement: number; intent: number } = {
    time: 0.3,
    engagement: 0.4,
    intent: 0.3,
  }
): NudgeTriggerScore {
  // Time Weight (0-1): normalized time on site (max 10 minutes = 1.0)
  const timeWeight = Math.min(context.timeOnSite / 600, 1.0)

  // Engagement Weight (0-1): modules explored (max 6 = 1.0) + steps completed
  const modulesScore = Math.min(context.modulesExplored / 6, 1.0)
  const stepsScore = Math.min(context.completedSteps.length / 5, 1.0)
  const engagementWeight = modulesScore * 0.7 + stepsScore * 0.3

  // Intent Weight (0-1): ICP score (0-100) + calculator + demo interest
  const icpScore = context.icpScore / 100
  const calculatorBonus = context.calculatorCompleted ? 0.3 : 0
  const pricingInterest = context.hasSeenPricing ? 0.2 : 0
  const intentWeight = Math.min(icpScore + calculatorBonus + pricingInterest, 1.0)

  // Weighted average
  const totalScore =
    timeWeight * weights.time +
    engagementWeight * weights.engagement +
    intentWeight * weights.intent

  return {
    timeWeight,
    engagementWeight,
    intentWeight,
    totalScore,
    threshold: 0.7, // Default threshold
  }
}

/**
 * Progressive threshold escalation: highly engaged users see nudges sooner
 *
 * @param context - Current user context
 * @returns Adjusted threshold (0.5-0.8)
 */
export function getAdaptiveThreshold(context: NudgeContext): number {
  const baseThreshold = 0.7

  // Lower threshold for high-intent users (easier to trigger)
  if (context.icpScore > 75 && context.modulesExplored >= 2) {
    return 0.5 // Highly qualified, show nudges sooner
  }

  // Raise threshold for low-engagement users (harder to trigger, avoid annoyance)
  if (context.modulesExplored === 0 && context.messagesCount === 0 && context.timeOnSite < 60) {
    return 0.8 // Passive browser, wait longer
  }

  return baseThreshold
}

/**
 * Define all nudge triggers with their conditions
 */
export const NUDGE_TRIGGERS: NudgeTrigger[] = [
  // === MILESTONE TRIGGERS (3x Higher Engagement) ===
  {
    id: 'first_module_congrats',
    name: 'First Module Explored',
    triggerType: 'milestone',
    priority: 9, // Raised: milestones are high priority
    cooldown: 1440,
    maxOccurrences: 1,
    condition: (ctx) => {
      return ctx.modulesExplored === 1 && ctx.completedSteps.length === 1
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx),
      threshold: 0.3, // Lower threshold for milestone celebrations
    }),
  },

  {
    id: 'halfway_milestone',
    name: 'Halfway Through Journey',
    triggerType: 'milestone',
    priority: 8,
    cooldown: 1440,
    maxOccurrences: 1,
    condition: (ctx) => {
      return ctx.modulesExplored === 3 && ctx.completedSteps.length >= 3
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx),
      threshold: 0.4, // Milestone = easier trigger
    }),
  },

  {
    id: 'all_modules_explored',
    name: 'All Modules Complete - Next Step',
    triggerType: 'milestone',
    priority: 10, // Highest priority
    cooldown: 1440,
    maxOccurrences: 1,
    condition: (ctx) => {
      return ctx.modulesExplored >= 6 && ctx.completedSteps.length >= 6
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx),
      threshold: 0.2, // Major milestone, always celebrate
    }),
  },

  {
    id: 'calculator_completed',
    name: 'Calculator Done - Schedule Demo',
    triggerType: 'milestone',
    priority: 10,
    cooldown: 1440,
    maxOccurrences: 1,
    condition: (ctx) => {
      return (
        ctx.calculatorCompleted && !ctx.hasScheduledDemo && ctx.timeOnSite > 300 // After 5 min
      )
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx),
      threshold: 0.3, // Key conversion milestone
    }),
  },

  // === TIME-BASED TRIGGERS ===
  {
    id: 'welcome_explore',
    name: 'Welcome: Encourage Exploration',
    triggerType: 'time-based',
    priority: 6, // Lower than milestones
    cooldown: 1440, // 24 hours
    maxOccurrences: 1,
    condition: (ctx) => {
      return (
        ctx.timeOnSite > 30 && // After 30s
        ctx.timeOnSite < 90 && // Before 90s
        ctx.modulesExplored === 0 && // Haven't explored yet
        ctx.messagesCount === 0 // Haven't chatted
      )
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx),
      threshold: getAdaptiveThreshold(ctx),
    }),
  },

  // === INTENT TRIGGERS (High-Value Actions) ===
  {
    id: 'calculator_prompt',
    name: 'Suggest Calculator After 2 Modules',
    triggerType: 'intent',
    priority: 9,
    cooldown: 30,
    maxOccurrences: 2,
    condition: (ctx) => {
      return (
        ctx.modulesExplored >= 2 &&
        !ctx.calculatorCompleted &&
        ctx.timeOnSite > 120 && // After 2 min
        ctx.timeOnSite < 600 // Before 10 min
      )
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx),
      threshold: 0.6, // Mid-journey, moderate threshold
    }),
  },

  // DISABLED: User prefers less chat nudges
  // {
  //   id: 'high_engagement_chat',
  //   name: 'High Engagement: Offer Chat Help',
  //   priority: 7,
  //   cooldown: 60,
  //   maxOccurrences: 2,
  //   condition: (ctx) => {
  //     return (
  //       ctx.modulesExplored >= 2 &&
  //       ctx.timeOnSite > 180 &&
  //       ctx.messagesCount === 0 // Haven't used chat yet
  //     )
  //   }
  // },

  {
    id: 'high_icp_demo_push',
    name: 'High ICP Score - Strong Demo CTA',
    triggerType: 'intent',
    priority: 10, // High priority for qualified leads
    cooldown: 120,
    maxOccurrences: 2,
    condition: (ctx) => {
      return (
        ctx.icpScore > 75 &&
        ctx.modulesExplored >= 3 &&
        ctx.calculatorCompleted &&
        !ctx.hasScheduledDemo
      )
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx, { time: 0.2, engagement: 0.3, intent: 0.5 }), // Intent-heavy
      threshold: 0.5, // Lower for high-value leads
    }),
  },

  {
    id: 'seen_pricing_no_demo',
    name: 'Saw Pricing But No Demo',
    triggerType: 'intent',
    priority: 8,
    cooldown: 60,
    maxOccurrences: 2,
    condition: (ctx) => {
      return ctx.hasSeenPricing && !ctx.hasScheduledDemo && ctx.timeOnSite > 180
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx),
      threshold: 0.55, // Pricing interest = moderate intent
    }),
  },

  {
    id: 'founding_member_urgency',
    name: 'Founding Member Urgency (High ICP)',
    triggerType: 'intent',
    priority: 9,
    cooldown: 180,
    maxOccurrences: 2,
    condition: (ctx) => {
      return (
        ctx.icpScore > 70 && ctx.calculatorCompleted && ctx.hasSeenPricing && !ctx.hasScheduledDemo
      )
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx, { time: 0.2, engagement: 0.3, intent: 0.5 }),
      threshold: 0.45, // Very high intent, aggressive triggering
    }),
  },

  // === INACTIVITY TRIGGERS (Use Sparingly) ===
  {
    id: 'inactive_2min',
    name: 'Inactive for 3 minutes',
    triggerType: 'inactivity',
    priority: 4, // Low priority
    cooldown: 30, // Longer cooldown
    maxOccurrences: 1, // Only once
    condition: (ctx) => {
      return (
        (ctx.inactivityTime || 0) > 180 && // 3 min instead of 2
        ctx.modulesExplored > 0 &&
        ctx.modulesExplored < 3 && // Only early journey
        !ctx.calculatorCompleted
      )
    },
    scoringFn: (ctx) => ({
      ...calculateTriggerScore(ctx),
      threshold: 0.75, // High threshold, avoid annoying users
    }),
  },

  // === CHAT ENGAGEMENT ===
  // DISABLED: User feedback - te veel pop-ups
  // {
  //   id: 'chat_inactive',
  //   name: 'Chat Started But Gone Quiet',
  //   priority: 4,
  //   cooldown: 10,
  //   condition: (ctx) => {
  //     const timeSinceLastMessage = ctx.lastMessageTime
  //       ? (Date.now() - ctx.lastMessageTime) / 1000
  //       : 9999
  //
  //     return (
  //       ctx.messagesCount > 0 &&
  //       ctx.messagesCount < 5 &&
  //       timeSinceLastMessage > 120 // 2 min since last message
  //     )
  //   }
  // }
]

/**
 * Get nudge content based on trigger ID and context
 */
export function getNudgeContent(triggerId: string, _context: NudgeContext): Nudge {
  const nudges: Record<string, Nudge> = {
    welcome_explore: {
      id: 'welcome_explore',
      type: 'info',
      title: '👋 Welkom!',
      message:
        'Verken onze modules om te ontdekken hoe ons platform jouw marketing kan transformeren.',
      action: {
        label: 'Start ontdekkingstour',
        type: 'navigate',
        value: '/explorer',
      },
      icon: '🚀',
      duration: 7000,
    },

    first_module_congrats: {
      id: 'first_module_congrats',
      type: 'celebration',
      title: '🎉 Eerste module voltooid!',
      message: 'Geweldig begin! Nog 5 modules te ontdekken.',
      icon: '✨',
      duration: 4000,
    },

    calculator_prompt: {
      id: 'calculator_prompt',
      type: 'cta',
      title: '💰 Benieuwd naar je ROI?',
      message: 'Je hebt al 2 modules verkend. Bereken nu hoeveel je kunt besparen!',
      action: {
        label: 'Bereken mijn ROI',
        type: 'open_calculator',
      },
      icon: '📊',
      duration: 8000,
    },

    halfway_milestone: {
      id: 'halfway_milestone',
      type: 'success',
      title: '🎯 Lekker bezig!',
      message: 'Je hebt al meerdere modules bekeken! Blijf ontdekken.',
      icon: '⚡',
      duration: 5000,
    },

    high_engagement_chat: {
      id: 'high_engagement_chat',
      type: 'info',
      title: '💬 Vragen?',
      message: 'Ik zie dat je enthousiast aan het verkennen bent! Kan ik je ergens mee helpen?',
      action: {
        label: 'Chat met assistent',
        type: 'open_chat',
      },
      icon: '🤖',
      duration: 7000,
    },

    all_modules_explored: {
      id: 'all_modules_explored',
      type: 'celebration',
      title: '🏆 Alle modules voltooid!',
      message: 'Geweldig! Je hebt het volledige platform verkend. Klaar voor de volgende stap?',
      action: {
        label: 'Bereken ROI',
        type: 'open_calculator',
      },
      icon: '🎊',
      duration: 10000,
    },

    calculator_completed: {
      id: 'calculator_completed',
      type: 'cta',
      title: '📈 Wow, indrukwekkende cijfers!',
      message: 'Zie je de potentie? Laten we bespreken hoe we dit realiseren.',
      action: {
        label: 'Plan strategic consultation',
        type: 'schedule_demo',
      },
      icon: '💼',
      duration: 10000,
    },

    high_icp_demo_push: {
      id: 'high_icp_demo_push',
      type: 'cta',
      title: '🚀 Perfect match!',
      message: 'Jouw profiel is ideaal voor ons platform. Nog 2 Founding Member slots beschikbaar!',
      action: {
        label: 'Claim je slot',
        type: 'schedule_demo',
      },
      icon: '🏆',
      duration: 12000,
    },

    inactive_30s: {
      id: 'inactive_30s',
      type: 'info',
      title: '👀 Nog meer te ontdekken!',
      message:
        'Je hebt nog niet alle modules gezien. Verken verder om het volledige plaatje te krijgen.',
      icon: '🧭',
      duration: 6000,
    },

    inactive_2min: {
      id: 'inactive_2min',
      type: 'info',
      title: '💡 Pro tip',
      message: 'Bereken je ROI om te zien hoeveel je kunt besparen met ons platform!',
      action: {
        label: 'Bereken nu',
        type: 'open_calculator',
      },
      icon: '💰',
      duration: 8000,
    },

    seen_pricing_no_demo: {
      id: 'seen_pricing_no_demo',
      type: 'cta',
      title: '📅 Interesse?',
      message: 'Je hebt onze pricing bekeken. Laten we bespreken hoe we je kunnen helpen!',
      action: {
        label: 'Plan gesprek',
        type: 'schedule_demo',
      },
      icon: '🤝',
      duration: 9000,
    },

    founding_member_urgency: {
      id: 'founding_member_urgency',
      type: 'warning',
      title: '⏰ Founding Member Slots',
      message: 'Nog maar 2 slots beschikbaar! Lock je rate voor 24 maanden en bespaar €120,000.',
      action: {
        label: 'Claim je slot',
        type: 'schedule_demo',
      },
      icon: '🏆',
      duration: 12000,
    },

    chat_inactive: {
      id: 'chat_inactive',
      type: 'info',
      title: '💬 Nog vragen?',
      message: 'Ik ben er nog steeds! Heb je nog vragen over het platform?',
      action: {
        label: 'Stel een vraag',
        type: 'open_chat',
      },
      icon: '🤖',
      duration: 7000,
    },
  }

  return nudges[triggerId] || nudges['welcome_explore'] // Fallback
}

/**
 * Check which nudges should trigger based on current context
 *
 * Uses multi-signal scoring system for nuanced triggering.
 * Milestone triggers have priority over time-based triggers (3x higher engagement).
 *
 * @param context - Current user context
 * @param history - Nudge history for cooldown tracking
 * @returns Highest priority eligible nudge, or null
 */
export function checkNudgeTriggers(
  context: NudgeContext,
  history: NudgeHistory = {}
): Nudge | null {
  const now = Date.now()

  // Find all eligible triggers using enhanced scoring
  const eligibleTriggers = NUDGE_TRIGGERS.filter((trigger) => {
    // Check if basic condition is met
    if (!trigger.condition(context)) {
      return false
    }

    // Check scoring function if present (2025 best practice)
    if (trigger.scoringFn) {
      const score = trigger.scoringFn(context)
      if (score.totalScore < score.threshold) {
        return false // Score too low
      }
    }

    // Check cooldown
    const nudgeHistory = history[trigger.id]
    if (nudgeHistory) {
      const timeSinceLastShown = (now - nudgeHistory.lastShown) / 1000 / 60 // minutes
      if (timeSinceLastShown < trigger.cooldown) {
        return false
      }

      // Check max occurrences
      if (trigger.maxOccurrences && nudgeHistory.count >= trigger.maxOccurrences) {
        return false
      }
    }

    return true
  })

  // No eligible triggers
  if (eligibleTriggers.length === 0) {
    return null
  }

  // Prioritize milestone triggers (3x higher engagement per research)
  const milestoneTriggers = eligibleTriggers.filter((t) => t.triggerType === 'milestone')
  const otherTriggers = eligibleTriggers.filter((t) => t.triggerType !== 'milestone')

  // Sort both groups by priority
  milestoneTriggers.sort((a, b) => b.priority - a.priority)
  otherTriggers.sort((a, b) => b.priority - a.priority)

  // Milestone triggers always win if eligible
  const selectedTrigger = milestoneTriggers.length > 0 ? milestoneTriggers[0] : otherTriggers[0]

  if (!selectedTrigger) {
    return null
  }

  return getNudgeContent(selectedTrigger.id, context)
}

/**
 * Update nudge history after showing a nudge
 */
export function updateNudgeHistory(nudgeId: string, history: NudgeHistory = {}): NudgeHistory {
  const now = Date.now()

  return {
    ...history,
    [nudgeId]: {
      count: (history[nudgeId]?.count || 0) + 1,
      lastShown: now,
    },
  }
}

/**
 * Get proactive chat message based on journey state
 */
export function getProactiveChatMessage(context: NudgeContext): string | null {
  // High ICP, explored a lot, but haven't used chat
  if (
    context.icpScore > 70 &&
    context.modulesExplored >= 3 &&
    context.messagesCount === 0 &&
    context.timeOnSite > 180
  ) {
    return 'Ik zie dat je het platform grondig verkent! 🚀 Kan ik je ergens bij helpen?'
  }

  // Calculator completed, high value
  if (context.calculatorCompleted && context.icpScore > 60 && context.messagesCount < 3) {
    return 'Indrukwekkende ROI cijfers! 📊 Wil je bespreken hoe we dit kunnen realiseren?'
  }

  // Stuck in mid-journey
  if (
    context.modulesExplored >= 2 &&
    context.modulesExplored < 5 &&
    (context.inactivityTime || 0) > 60 &&
    context.messagesCount === 0
  ) {
    return 'Vragen over wat je tot nu toe hebt gezien? 💬 Ik help je graag!'
  }

  return null
}
