/**
 * Proactive Journey Predictions - Next-Best-Action System
 *
 * Implements predictive next-step recommendations based on:
 * - Behavioral path analysis
 * - Industry-specific common paths
 * - User engagement patterns
 * - Intent signals
 *
 * Based on 2025 best practices from Pendo, Userpilot, and PLG platforms.
 *
 * @module journeyPredictions
 */

/**
 * Next-Best-Action Recommendation
 */
export interface NextBestAction {
  id: string
  type: 'navigate' | 'suggest_module' | 'calculator' | 'demo' | 'chat' | 'tip'
  priority: number // 1-10
  title: string
  message: string
  action?: {
    label: string
    target: string // URL or module ID
  }
  reason: string // Why this recommendation (for debugging/analytics)
  confidence: number // 0-1, how confident the prediction is
}

/**
 * User Journey Context for Predictions
 */
export interface PredictionContext {
  industry: string | null
  modulesViewed: string[] // Module IDs
  completedSteps: string[]
  currentPage: string
  timeOnSite: number
  icpScore: number
  calculatorCompleted: boolean
  hasScheduledDemo: boolean
  lastActivity: Date | null
  messagesCount: number
}

/**
 * Common Journey Paths (Industry-Specific)
 *
 * Based on behavioral analysis: what do most users do after X?
 * Updated from analytics to optimize conversion.
 */
const COMMON_PATHS: Record<string, Record<string, string[]>> = {
  ecommerce: {
    'command-center': ['ad-builder', 'analytics-hub'],
    'ad-builder': ['analytics-hub', 'roi-calculator'],
    'analytics-hub': ['roi-calculator', 'content-pipeline'],
    'roi-calculator': ['demo-scheduling', 'pricing'],
  },
  saas: {
    'command-center': ['campaign-orchestrator', 'content-pipeline'],
    'campaign-orchestrator': ['content-pipeline', 'analytics-hub'],
    'content-pipeline': ['roi-calculator', 'analytics-hub'],
    'roi-calculator': ['demo-scheduling', 'pricing'],
  },
  agency: {
    'command-center': ['multi-account-manager', 'ad-builder'],
    'multi-account-manager': ['ad-builder', 'analytics-hub'],
    'ad-builder': ['roi-calculator', 'analytics-hub'],
    'roi-calculator': ['demo-scheduling', 'pricing'],
  },
  other: {
    'command-center': ['ad-builder', 'analytics-hub', 'content-pipeline'],
    'ad-builder': ['analytics-hub', 'roi-calculator'],
    'analytics-hub': ['roi-calculator'],
    'roi-calculator': ['demo-scheduling'],
  },
}

/**
 * Module Completion Time Estimates (in seconds)
 * Used to show "2 min remaining" style prompts
 */
const MODULE_TIME_ESTIMATES: Record<string, number> = {
  'command-center': 120, // 2 min
  'ad-builder': 180, // 3 min
  'analytics-hub': 150, // 2.5 min
  'campaign-orchestrator': 180, // 3 min
  'content-pipeline': 150, // 2.5 min
  'multi-account-manager': 180, // 3 min
  'roi-calculator': 240, // 4 min
  'demo-scheduling': 300, // 5 min
}

/**
 * Calculate next-best-action based on user context
 *
 * Uses multi-signal analysis:
 * - Current position in journey
 * - Common paths for industry
 * - Engagement signals (time, modules)
 * - Intent signals (ICP, calculator, pricing)
 *
 * @param context - Current user context
 * @returns Prioritized next-best-action recommendation
 */
export function predictNextBestAction(context: PredictionContext): NextBestAction | null {
  const actions: NextBestAction[] = []

  // === High-Intent Conversion Actions ===

  // Calculator completed + high ICP = Demo booking (HIGHEST PRIORITY)
  if (context.calculatorCompleted && context.icpScore > 70 && !context.hasScheduledDemo) {
    actions.push({
      id: 'demo_after_calculator',
      type: 'demo',
      priority: 10,
      title: 'Ready for the Next Step?',
      message: `Based on your ${context.industry || 'profile'} and ROI calculations, let's discuss implementation. Most ${context.industry || 'companies'} see value in a 30-min strategy call.`,
      action: {
        label: 'Schedule Strategy Call',
        target: '/demo-scheduling',
      },
      reason: 'Calculator completed with high ICP score',
      confidence: 0.95,
    })
  }

  // Modules explored but no calculator = Calculator prompt
  if (
    context.modulesViewed.length >= 2 &&
    !context.calculatorCompleted &&
    context.timeOnSite > 120
  ) {
    actions.push({
      id: 'calculator_after_modules',
      type: 'calculator',
      priority: 9,
      title: 'Calculate Your Potential ROI',
      message: `You've explored ${context.modulesViewed.length} modules. Want to see your potential savings? Takes 2 minutes.`,
      action: {
        label: 'Open ROI Calculator',
        target: '/roi-calculator',
      },
      reason: '2+ modules viewed, no calculator yet',
      confidence: 0.85,
    })
  }

  // === Behavioral Path Predictions ===

  // Predict next module based on common paths
  const lastViewedModule = getLastViewedModule(context)
  if (lastViewedModule && context.industry) {
    const industryPaths = COMMON_PATHS[context.industry] || COMMON_PATHS.other
    const nextModules = industryPaths[lastViewedModule] || []

    // Filter out already viewed modules
    const unseenNextModules = nextModules.filter(
      (moduleId) => !context.modulesViewed.includes(moduleId)
    )

    if (unseenNextModules.length > 0) {
      const nextModule = unseenNextModules[0]
      const timeEstimate = MODULE_TIME_ESTIMATES[nextModule] || 120

      actions.push({
        id: `suggest_${nextModule}`,
        type: 'suggest_module',
        priority: 7,
        title: getModuleTitle(nextModule, context.industry),
        message: `Most ${context.industry || 'users'} explore this next. ${Math.ceil(timeEstimate / 60)} min to complete.`,
        action: {
          label: 'Explore Module',
          target: `/explorer?module=${nextModule}`,
        },
        reason: `Common path after ${lastViewedModule} for ${context.industry}`,
        confidence: 0.75,
      })
    }
  }

  // === Milestone-Based Suggestions ===

  // 3 modules viewed = "You're making progress!"
  if (context.modulesViewed.length === 3 && !context.completedSteps.includes('halfway')) {
    actions.push({
      id: 'halfway_encouragement',
      type: 'tip',
      priority: 6,
      title: '🎯 Goed bezig!',
      message: `Geweldige vooruitgang! Blijf verkennen om alle mogelijkheden te ontdekken.`,
      reason: 'Milestone: 3 modules viewed',
      confidence: 1.0,
    })
  }

  // === Engagement Recovery ===

  // Long time on site, few modules = Suggest shortcut to high-value content
  if (context.timeOnSite > 300 && context.modulesViewed.length < 3 && context.messagesCount === 0) {
    actions.push({
      id: 'chat_offer_help',
      type: 'chat',
      priority: 5,
      title: 'Need Guidance?',
      message:
        'Taking your time exploring? I can point you to the most relevant modules for your needs.',
      action: {
        label: 'Chat with Assistant',
        target: 'open-chat',
      },
      reason: 'Long time on site, low exploration',
      confidence: 0.65,
    })
  }

  // === Inactivity Recovery ===

  // Inactive for 2+ min after some engagement
  const inactivitySeconds = context.lastActivity
    ? Math.floor((Date.now() - new Date(context.lastActivity).getTime()) / 1000)
    : 0

  if (
    inactivitySeconds > 120 &&
    context.modulesViewed.length > 0 &&
    context.modulesViewed.length < 5
  ) {
    actions.push({
      id: 'inactivity_nudge',
      type: 'suggest_module',
      priority: 4,
      title: 'Continue Your Journey',
      message: `Pick up where you left off! ${6 - context.modulesViewed.length} modules remaining.`,
      action: {
        label: 'Resume Exploring',
        target: '/explorer',
      },
      reason: 'Inactivity detected',
      confidence: 0.55,
    })
  }

  // === Sort by Priority & Confidence ===

  if (actions.length === 0) {
    return null
  }

  // Sort by priority DESC, then confidence DESC
  actions.sort((a, b) => {
    if (b.priority !== a.priority) {
      return b.priority - a.priority
    }
    return b.confidence - a.confidence
  })

  // Return highest priority action
  return actions[0]
}

/**
 * Get last viewed module ID from context
 */
function getLastViewedModule(context: PredictionContext): string | null {
  if (context.modulesViewed.length === 0) {
    return null
  }
  return context.modulesViewed[context.modulesViewed.length - 1]
}

/**
 * Get human-readable module title
 */
function getModuleTitle(moduleId: string, _industry: string | null): string {
  const titles: Record<string, string> = {
    'command-center': 'Command Center Overview',
    'ad-builder': 'AI Ad Builder Studio',
    'analytics-hub': 'Analytics Hub',
    'campaign-orchestrator': 'Campaign Orchestrator',
    'content-pipeline': 'Content Pipeline',
    'multi-account-manager': 'Multi-Account Manager',
    'roi-calculator': 'ROI Calculator',
    'demo-scheduling': 'Schedule Your Demo',
  }

  return titles[moduleId] || moduleId
}

/**
 * Calculate journey completion percentage
 *
 * @param context - User context
 * @returns Completion percentage (0-100)
 */
export function calculateJourneyProgress(context: PredictionContext): number {
  const targetModulesCount = 6 // Total explorable modules
  const completedCount = context.modulesViewed.length

  let baseProgress = (completedCount / targetModulesCount) * 100

  // Bonus progress for key actions
  if (context.calculatorCompleted) {
    baseProgress += 10
  }
  if (context.hasScheduledDemo) {
    baseProgress += 10
  }

  return Math.min(Math.round(baseProgress), 100)
}

/**
 * Estimate time to completion
 *
 * @param context - User context
 * @returns Estimated minutes to complete journey
 */
export function estimateTimeToCompletion(context: PredictionContext): number {
  const remainingModules = 6 - context.modulesViewed.length
  const avgTimePerModule = 150 // 2.5 min average

  let estimatedSeconds = remainingModules * avgTimePerModule

  // Add calculator time if not done
  if (!context.calculatorCompleted) {
    estimatedSeconds += MODULE_TIME_ESTIMATES['roi-calculator']
  }

  // Add demo scheduling time if high intent but not scheduled
  if (context.icpScore > 70 && !context.hasScheduledDemo) {
    estimatedSeconds += MODULE_TIME_ESTIMATES['demo-scheduling']
  }

  return Math.ceil(estimatedSeconds / 60) // Return minutes
}

/**
 * Get personalized journey completion message
 *
 * @param context - User context
 * @returns Motivational message based on progress
 */
export function getProgressMessage(context: PredictionContext): string {
  const progress = calculateJourneyProgress(context)

  if (progress < 25) {
    return "🚀 Just getting started! Let's explore what's possible."
  }

  if (progress < 50) {
    return `⚡ ${progress}% complete. You're making great progress!`
  }

  if (progress < 75) {
    return `🔥 Over halfway there! ${100 - progress}% remaining.`
  }

  if (progress < 100) {
    return `🎯 Almost done! Just ${100 - progress}% left to see everything.`
  }

  return "🏆 You've explored everything! Ready to move forward?"
}
