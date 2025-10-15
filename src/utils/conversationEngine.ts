/**
 * Conversation Engine
 *
 * Generates context-aware, personalized responses based on user intent,
 * industry, journey state, and conversation history
 */

import { recognizeIntent, type UserIntent } from './intentRecognition'
import {
  getTemplates,
  getPersonality,
  getRandomMessage,
  formatMessage,
  type MessageTemplate,
} from '../config/conversationPersonality'
import type { ChatMessage } from '../types/chat'
import { llmService, type ConversationContext as LLMContext } from '../services/llmService'
import { rateLimiter } from './rateLimiter'
import { generateRelatedQuestions, type QuestionContext } from './relatedQuestions'
import { getFallbackResponse, getEmergencyFallback } from './fallbackResponses'
import { detectNavigationIntent, getNavigationAction } from './chatNavigationHelpers'
import { MODULE_EXPLANATIONS, NEXT_MODULE_MAP } from '../config/moduleExplanations'
import {
  matchQuestion,
  getRelatedQuestions,
  getFallbackResponse as getQuestionFallback, // Renamed to avoid conflict with fallbackResponses
  type MatchContext,
} from './questionMatcher'
import i18n from '../i18n/config'

export interface ConversationContext {
  industryId: string | null
  icpScore?: number
  modulesExplored: number
  timeOnSite: number // seconds
  calculatorCompleted: boolean
  messagesCount: number
  lastIntent?: UserIntent
  lastViewedModules?: string[] // Track which modules have been viewed
}

export interface ResponseGeneration {
  type: 'text' | 'card' | 'carousel' | 'quick-replies' | 'navigation' | 'calendly-booking'
  content: string
  suggestedActions?: string[]
  card?: any
  cards?: any[]
  replies?: Array<{
    label: string
    value: string
    icon?: string
  }>
  followUp?: string
  navigationData?: {
    label: string
    route: string
    icon?: 'calculator' | 'explorer' | 'dashboard' | 'sparkles' | 'demo'
    helpText?: string
    features?: string[]
    ctaText?: string
  }
  calendlyData?: {
    eventTypeId?: string // Optional specific event type
    prefill?: {
      name?: string
      email?: string
      company?: string
    }
    ctaText?: string
    secondaryCtaText?: string
  }
}

/**
 * Generate intelligent response using LLM with fallback to mock responses
 */
export async function generateResponse(
  userMessage: string,
  context: ConversationContext,
  conversationHistory: ChatMessage[]
): Promise<ResponseGeneration> {
  const lowerMessage = userMessage.toLowerCase()

  // === PRIORITY -1: Handle CTA Button Clicks from Knowledge Base ===
  // Map common CTA button texts to module IDs
  const ctaModuleMap: Record<string, string> = {
    'verken research & planning': 'research-planning',
    'bekijk research & planning': 'research-planning',
    'bekijk manager workflow': 'manager-workflow',
    'bekijk content pipeline': 'content-pipeline',
    'bekijk analytics lab': 'analytics-lab',
    'bekijk telegram control': 'telegram-control',
    'bekijk publishing layer': 'publishing-layer',
    'test ad builder': 'ad-builder',
    'bekijk de ad builder demo': 'ad-builder',
    'bekijk ad builder': 'ad-builder',
    'bekijk command center': 'command-center',
  }

  // Check if message matches a CTA button
  for (const [ctaText, moduleId] of Object.entries(ctaModuleMap)) {
    if (lowerMessage === ctaText || lowerMessage.includes(ctaText)) {
      return {
        type: 'navigation',
        content: `👉 Laten we de **${moduleId
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ')}** module verkennen!`,
        navigationData: {
          label: moduleId
            .split('-')
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(' '),
          route: `/explorer#${moduleId}`,
          icon: 'sparkles',
          ctaText: 'Open module',
          helpText: 'Ontdek deze module in detail',
          features: [], // Empty = direct navigation
        },
      }
    }
  }

  // === PRIORITY 0: Start Tour (Special 2-button Response) ===
  if (lowerMessage === 'start rondleiding' || lowerMessage === 'start_tour') {
    return {
      type: 'quick-replies',
      content:
        '🚀 Perfect! Laten we beginnen met de rondleiding. Je hebt 2 opties:\n\n**1️⃣ Start met Research (Stap 1)** - Begin de gestructureerde rondleiding vanaf het begin\n**2️⃣ Bekijk alle modules** - Overzicht van alle 7 modules om zelf te verkennen',
      replies: [
        {
          label: '▶️ Start met Research (Stap 1)',
          value: 'start_research_module',
          icon: 'sparkles',
        },
        {
          label: '🗺️ Bekijk alle modules',
          value: 'show_all_modules',
          icon: 'explorer',
        },
      ],
    }
  }

  // === Handle the 2 tour options ===
  if (
    lowerMessage === 'start_research_module' ||
    lowerMessage === '▶️ start met research (stap 1)'
  ) {
    // DIRECT navigation to Research module (no info panel)
    return {
      type: 'navigation',
      content:
        '🧠 Geweldig! We beginnen met **Research & Planning** (Stap 1). Dit is het fundament van ons autonome marketing systeem.\n\nHier gebruik je Perplexity AI om diepgaand marktonderzoek te doen. Laten we een kijkje nemen! 👇',
      navigationData: {
        label: 'Research & Planning',
        route: '/explorer#research-planning',
        icon: 'sparkles',
        ctaText: 'Open Research module',
        helpText: 'Start met Stap 1: AI-powered market research met Perplexity',
        features: [],
      },
    }
  }

  // === Handle "Next Module" navigation ===
  if (NEXT_MODULE_MAP[lowerMessage]) {
    const next = NEXT_MODULE_MAP[lowerMessage]
    return {
      type: 'navigation',
      content: `▶️ Perfect! Laten we **${next.name}** bekijken. Ik ben er om vragen te beantwoorden! 🚀`,
      navigationData: {
        label: next.name,
        route: next.route,
        icon: 'sparkles',
        ctaText: `Open ${next.name}`,
        helpText: `Ontdek ${next.name}`,
        features: [],
      },
    }
  }

  // === Handle quick action: Calculator ===
  if (lowerMessage === 'calculator' || lowerMessage === '💰 bereken mijn roi') {
    return {
      type: 'navigation',
      content:
        '💰 Perfect! Laten we je potentiële ROI berekenen. De calculator laat zien hoeveel tijd en geld je kunt besparen met AI-automatisering.',
      navigationData: {
        label: 'ROI Calculator',
        route: '/calculator',
        icon: 'calculator',
        ctaText: 'Open Calculator',
        helpText: 'Bereken je ROI in 2 minuten',
        features: [],
      },
    }
  }

  // === Handle quick action: Demo / Booking ===
  const demoTriggers = [
    'demo',
    'plan demo',
    'plan een demo',
    'plan afspraak',
    'boek demo',
    'schedule demo',
    '📅 plan een demo',
    '📅 plan afspraak',
  ]
  if (demoTriggers.includes(lowerMessage)) {
    // Use personalized demo response
    const templates = getTemplates(context.industryId)
    return generateDemoResponse(templates, context)
  }

  // === Handle quick action: Ask Question ===
  if (lowerMessage === 'ask_question' || lowerMessage === '❓ ik heb nog vragen') {
    return {
      type: 'text',
      content:
        '❓ Natuurlijk! Stel gerust je vraag. Ik kan je helpen met:\n\n• Specifieke modules uitleg\n• Pricing & implementatie\n• Technische vragen\n• Use cases voor jouw branche',
      suggestedActions: ['Hoe werkt Perplexity?', 'Wat kost dit?', 'Kan het integreren met...?'],
    }
  }

  // === Handle module explanation requests ===
  if (MODULE_EXPLANATIONS[lowerMessage]) {
    return {
      type: 'text',
      content: MODULE_EXPLANATIONS[lowerMessage],
      suggestedActions: ['Volgende module', 'Bereken ROI', 'Stel een vraag'],
    }
  }

  // Match module exploration requests with various phrasings
  const moduleRequestPatterns = [
    'show_all_modules',
    '🗺️ bekijk alle modules',
    'bekijk alle modules',
    'bekijk modules',
    'verken modules',
    'toon modules',
    'welke modules',
    'volgende module',
    'modules bekijken',
  ]

  const isModuleRequest = moduleRequestPatterns.some(
    (pattern) => lowerMessage.includes(pattern) || lowerMessage === pattern
  )

  if (isModuleRequest) {
    // Module sequence for progressive exploration
    const moduleSequence = [
      {
        id: 'research-planning',
        icon: '🧠',
        name: 'Research & Planning',
        description: 'AI-powered market research',
      },
      {
        id: 'manager-workflow',
        icon: '💼',
        name: 'Manager Workflow',
        description: 'Centrale workflow coördinatie',
      },
      {
        id: 'content-pipeline',
        icon: '📝',
        name: 'Content Pipeline',
        description: 'Snellere content productie',
      },
      {
        id: 'telegram-approval',
        icon: '📱',
        name: 'Telegram Control',
        description: 'Mobiele goedkeuring',
      },
      {
        id: 'publishing-layer',
        icon: '🚀',
        name: 'Publishing Layer',
        description: 'Multi-channel distributie',
      },
      {
        id: 'analytics-monitoring',
        icon: '📊',
        name: 'Analytics Lab',
        description: 'Real-time performance tracking',
      },
      {
        id: 'ad-builder',
        icon: '🎨',
        name: 'Ad Builder Studio',
        description: 'AI-gegenereerde advertenties',
      },
    ]

    // Get already viewed modules from context
    const viewedModules = context.lastViewedModules || []

    // Find the LAST viewed module and suggest the NEXT one in sequence
    let nextModule = null
    if (viewedModules.length > 0) {
      // Find the last viewed module's position in the sequence
      const lastViewedModule = viewedModules[viewedModules.length - 1]
      const lastViewedIndex = moduleSequence.findIndex((m) => m.id === lastViewedModule)

      if (lastViewedIndex !== -1) {
        // Look for the next unviewed module AFTER the last viewed one
        for (let i = lastViewedIndex + 1; i < moduleSequence.length; i++) {
          if (!viewedModules.includes(moduleSequence[i].id)) {
            nextModule = moduleSequence[i]
            break
          }
        }

        // If no unviewed module found after, wrap around and find first unviewed
        if (!nextModule) {
          nextModule = moduleSequence.find((m) => !viewedModules.includes(m.id))
        }
      }
    }

    // If still no next module found, just get first unviewed
    if (!nextModule) {
      nextModule = moduleSequence.find((m) => !viewedModules.includes(m.id))
    }

    if (nextModule && viewedModules.length > 0) {
      // User has viewed some modules - show next in sequence
      const viewedCount = viewedModules.length
      const totalModules = moduleSequence.length

      return {
        type: 'navigation',
        content: `👍 Je hebt al ${viewedCount} van de ${totalModules} modules verkend!\n\n📍 **Volgende module:** ${nextModule.icon} **${nextModule.name}**\n_${nextModule.description}_\n\n✨ Of bekijk alle modules om te springen naar een specifieke module.`,
        navigationData: {
          label: nextModule.name,
          route: `/explorer#${nextModule.id}`,
          icon: 'sparkles',
          ctaText: `Verken ${nextModule.name}`,
          helpText: `Je bent ${Math.round((viewedCount / totalModules) * 100)}% door het platform!`,
          features: moduleSequence.map((m) => {
            const viewed = viewedModules.includes(m.id)
            const isCurrent = m.id === nextModule.id
            return `${viewed ? '✅' : isCurrent ? '👉' : '⭕'} ${m.icon} ${m.name} - ${m.description}`
          }),
        },
        suggestedActions: [`Verken ${nextModule.name}`, 'Bekijk alle modules', 'Bereken ROI'],
      }
    } else {
      // First time viewing modules - show overview
      return {
        type: 'navigation',
        content:
          '🗺️ Hier is het complete overzicht van alle 7 modules. Klik op een module om de details te bekijken! 👇',
        navigationData: {
          label: 'Platform Explorer',
          route: '/explorer',
          icon: 'explorer',
          ctaText: 'Bekijk alle modules',
          helpText: 'Volledig overzicht van ons autonome marketing systeem',
          features: moduleSequence.map((m) => `${m.icon} ${m.name} - ${m.description}`),
        },
        suggestedActions: ['Start met Research & Planning', 'Bereken ROI', 'Stel een vraag'],
      }
    }
  }

  // === PRIORITY 0.5: Enhanced Q&A System with Knowledge Base ===
  // Build match context from conversation context
  const matchContext: MatchContext = {
    currentPage: context.modulesExplored > 0 ? '/explorer' : '/',
    modulesViewed: context.modulesExplored,
    industry: context.industryId || undefined,
    icpScore: context.icpScore,
    recentQueries: conversationHistory
      .filter((msg) => msg.sender === 'user')
      .slice(-3)
      .map((msg) => ('content' in msg && typeof msg.content === 'string' ? msg.content : '')),
  }

  // Try to match question
  const questionMatch = matchQuestion(lowerMessage, matchContext, 0.3)

  if (questionMatch && questionMatch.confidence >= 0.5) {
    // HIGH CONFIDENCE MATCH (>= 0.5) - Return answer directly
    const related = getRelatedQuestions(questionMatch, 3)
    const relatedQuestionTexts = related.map((q) => q.question)

    // 🔧 FIX: Handle CTA as navigation action if it's a navigate_module action
    if (
      questionMatch.cta &&
      questionMatch.cta.action === 'navigate_module' &&
      questionMatch.cta.value
    ) {
      return {
        type: 'navigation',
        content: `✅ ${questionMatch.answer}`,
        navigationData: {
          label: questionMatch.cta.text,
          route: `/explorer#${questionMatch.cta.value}`,
          icon: 'sparkles',
          ctaText: questionMatch.cta.text,
          helpText: 'Ontdek deze module in detail',
          features: [], // Empty = direct navigation
        },
        suggestedActions: relatedQuestionTexts.slice(0, 2),
      }
    }

    // Regular response with suggested actions
    return {
      type: 'text',
      content: `✅ ${questionMatch.answer}`,
      suggestedActions: questionMatch.cta
        ? [questionMatch.cta.text, ...relatedQuestionTexts.slice(0, 2)]
        : relatedQuestionTexts,
    }
  } else if (questionMatch && questionMatch.confidence >= 0.3) {
    // MEDIUM CONFIDENCE MATCH (0.3-0.5) - Give answer with disclaimer
    const related = getRelatedQuestions(questionMatch, 3)
    const relatedQuestionTexts = related.map((q) => q.question)

    // 🔧 FIX: Handle CTA as navigation action if it's a navigate_module action
    if (
      questionMatch.cta &&
      questionMatch.cta.action === 'navigate_module' &&
      questionMatch.cta.value
    ) {
      return {
        type: 'navigation',
        content: `💡 ${questionMatch.answer}\n\n_Als dit niet helemaal je vraag beantwoordt, stel gerust een andere vraag!_`,
        navigationData: {
          label: questionMatch.cta.text,
          route: `/explorer#${questionMatch.cta.value}`,
          icon: 'sparkles',
          ctaText: questionMatch.cta.text,
          helpText: 'Ontdek deze module in detail',
          features: [], // Empty = direct navigation
        },
        suggestedActions: relatedQuestionTexts.slice(0, 2),
      }
    }

    return {
      type: 'text',
      content: `💡 ${questionMatch.answer}\n\n_Als dit niet je vraag beantwoordt, stel gerust een andere vraag!_`,
      suggestedActions:
        relatedQuestionTexts.length > 0
          ? relatedQuestionTexts
          : ['Stel andere vraag', 'Bekijk modules', 'Plan demo'],
    }
  } else if (
    // Question-like patterns (who, what, where, when, why, how)
    /^(wie|wat|waar|wanneer|waarom|hoe|kan|is|zijn|heeft|hebben|moet|mag)\s/i.test(lowerMessage) ||
    lowerMessage.endsWith('?')
  ) {
    // This looks like a question but no good match - use question-specific fallback
    const fallback = getQuestionFallback(lowerMessage, 0, matchContext)

    return {
      type: 'text',
      content: fallback.message,
      suggestedActions: fallback.suggestions,
    }
  }

  // === PRIORITY 1: Check for Navigation Intent (including info requests) ===
  const navIntent = detectNavigationIntent(userMessage)
  if (navIntent) {
    const navAction = getNavigationAction(navIntent)
    if (navAction) {
      return {
        type: 'navigation',
        content: `Ik snap het! ${navIntent === 'calculator' ? 'Laten we je ROI berekenen.' : navIntent === 'explorer' ? 'Laten we het platform verkennen.' : 'Laten we daar naartoe gaan.'}`,
        navigationData: navAction,
      }
    }
  }

  // === PRIORITY 1.5: Check for Platform Info Request ===
  const platformInfoTriggers = [
    'wat kan dit platform',
    'wat doet dit platform',
    'platform info',
    'platform_info',
    'vertel over',
    'wat is dit',
    'mogelijkheden',
    'functies',
  ]

  if (platformInfoTriggers.some((trigger) => lowerMessage.includes(trigger))) {
    return {
      type: 'navigation',
      content:
        '📊 Ons platform combineert meerdere AI-modules voor complete marketing automation. Begin met Research & Planning →',
      navigationData: {
        label: 'Platform Explorer',
        route: '/explorer#research-planning',
        icon: 'sparkles',
        helpText: 'Begin met Research & Planning - diepgaand online onderzoek met Perplexity AI',
        features: [
          '🧠 Research & Planning - AI-powered market research',
          '💼 Manager Workflow - Centrale workflow coördinatie',
          '📝 Content Pipeline - Snellere content productie',
          '📱 Telegram Control - Mobiele goedkeuring',
          '🚀 Publishing Layer - Multi-channel distributie',
          '📊 Analytics Lab - Real-time performance tracking',
          '🎨 Ad Builder Studio - AI-gegenereerde advertenties',
        ],
        ctaText: 'Start met Research',
      },
    }
  }

  // Check rate limit
  const rateCheck = rateLimiter.canSendMessage()
  if (!rateCheck.allowed) {
    const fallback = getFallbackResponse('rate_limit', context)
    return {
      type: 'text',
      content: fallback.content,
      suggestedActions: fallback.suggestedActions,
    }
  }

  // Record message
  rateLimiter.recordMessage()

  // Check if LLM is enabled (API key present)
  const llmEnabled = Boolean(import.meta.env.VITE_OPENROUTER_API_KEY)

  if (llmEnabled) {
    try {
      // Try LLM first
      const llmContext: LLMContext = {
        industryId: context.industryId,
        icpScore: context.icpScore || 0,
        modulesExplored: context.modulesExplored,
        timeOnSite: context.timeOnSite,
        calculatorCompleted: context.calculatorCompleted,
        messagesCount: context.messagesCount,
      }

      const llmResponse = await llmService.generateResponse(
        userMessage,
        llmContext,
        conversationHistory,
        i18n.language // Pass current language
      )

      return {
        type: 'text',
        content: llmResponse.content,
        suggestedActions: llmResponse.suggestedActions,
      }
    } catch (error) {
      console.error('❌ LLM Error:', error)
      console.warn('⚠️ Falling back to smart fallback system')

      // Use smart fallback system
      const fallback = getFallbackResponse('api_error', context, userMessage)

      return {
        type: 'text',
        content: fallback.content,
        suggestedActions: fallback.suggestedActions,
      }
    }
  }

  // Fallback to mock responses
  const mockResponse = generateMockResponse(userMessage, context, conversationHistory)

  // Ensure response always has required fields
  if (!mockResponse || !mockResponse.content) {
    const emergency = getEmergencyFallback()
    return {
      type: 'text',
      content: emergency.content,
      suggestedActions: emergency.suggestedActions,
    }
  }

  // Add related questions as suggestions
  const questionContext: QuestionContext = {
    industryId: context.industryId,
    icpScore: context.icpScore || 0,
    modulesExplored: context.modulesExplored,
    calculatorCompleted: context.calculatorCompleted,
    messagesCount: context.messagesCount,
    recentMessages: conversationHistory.slice(-4),
  }

  const relatedQuestions = generateRelatedQuestions(userMessage, questionContext, 3)

  // Enhance suggested actions with related questions if available
  if (relatedQuestions.length > 0 && mockResponse.suggestedActions) {
    mockResponse.suggestedActions = [
      ...mockResponse.suggestedActions.slice(0, 1), // Keep first action
      ...relatedQuestions.map((q) => q.text), // Add related questions
    ].slice(0, 3) // Max 3 total
  }

  return mockResponse
}

/**
 * Mock response generation (fallback)
 */
function generateMockResponse(
  userMessage: string,
  context: ConversationContext,
  _conversationHistory: ChatMessage[]
): ResponseGeneration {
  // Direct intent matching for common actions (from quick replies)
  const directIntents: Record<string, UserIntent> = {
    platform_info: 'platform_info',
    calculator: 'calculator_request',
    demo: 'demo_request',
    pricing: 'pricing_question',
  }

  // Check for direct intent match first
  let intent: UserIntent
  if (directIntents[userMessage.toLowerCase()]) {
    intent = directIntents[userMessage.toLowerCase()]
  } else {
    // Fallback to pattern-based recognition
    const recognition = recognizeIntent(userMessage)
    intent = recognition.intent
  }

  // Get personality and templates for industry
  const templates = getTemplates(context.industryId)

  // Generate response based on intent
  switch (intent) {
    case 'platform_info':
      return generatePlatformInfoResponse(templates, context)

    case 'calculator_request':
      return generateCalculatorResponse(templates, context)

    case 'demo_request':
      return generateDemoResponse(templates, context)

    case 'pricing_question':
      return generatePricingResponse(templates, context)

    case 'feature_question':
      return generateFeatureResponse(templates, context)

    case 'support_request':
      return generateSupportResponse(templates, context)

    case 'greeting':
      return generateGreetingResponse(templates)

    case 'gratitude':
      return generateGratitudeResponse(templates, context)

    default:
      // For unrecognized intents, try to be helpful
      const recognition = recognizeIntent(userMessage)
      return generateDefaultResponse(templates, recognition.confidence)
  }
}

function generatePlatformInfoResponse(
  templates: MessageTemplate,
  context: ConversationContext
): ResponseGeneration {
  const content = getRandomMessage(templates.responses.platform_info)

  // Suggest next steps based on journey
  const suggestedActions: string[] = []

  if (!context.calculatorCompleted) {
    suggestedActions.push('Bereken mijn ROI')
  }

  if (context.modulesExplored < 3) {
    suggestedActions.push('Verken modules')
  }

  suggestedActions.push('Plan een demo')

  return {
    type: 'quick-replies',
    content,
    replies: suggestedActions.map((action) => ({
      label: action,
      value: action,
      icon: action.includes('ROI')
        ? 'calculator'
        : action.includes('demo')
          ? 'calendar'
          : 'sparkles',
    })),
  }
}

function generateCalculatorResponse(
  _templates: MessageTemplate,
  _context: ConversationContext
): ResponseGeneration {
  const content = 'Laten we je ROI berekenen! 💰'

  return {
    type: 'text',
    content,
    suggestedActions: ['Wat gebeurt er na de berekening?', 'Plan een demo'],
  }
}

function generateDemoResponse(
  _templates: MessageTemplate,
  context: ConversationContext
): ResponseGeneration {
  // Build personalized message based on engagement
  const highEngagement = context.modulesExplored >= 2 || context.calculatorCompleted
  const highICPScore = context.icpScore && context.icpScore >= 60
  const veryHighICPScore = context.icpScore && context.icpScore >= 80

  let personalizedMessage = '📅 **Geweldig! Laten we een demo inplannen.**\n\n'

  // Add personalized tier messaging
  if (veryHighICPScore) {
    personalizedMessage +=
      '⭐ **Je profiel past perfect!** Ik open het booking panel waar je direct een tijdstip kunt kiezen.\n\n'
  } else if (highICPScore) {
    personalizedMessage += '🎯 **Perfect moment!** Ik open het booking panel voor je.\n\n'
  } else if (highEngagement) {
    personalizedMessage +=
      '🚀 **Je bent goed bezig!** Klik op de knop hieronder om het booking panel te openen.\n\n'
  } else {
    personalizedMessage +=
      '📊 **Mooie keuze!** Klik op de knop hieronder om je demo in te plannen.\n\n'
  }

  personalizedMessage += '**Wat je krijgt:**\n'
  personalizedMessage += '✓ 30-minuten persoonlijke demo\n'
  personalizedMessage += '✓ Platform tour voor jouw industrie\n'
  personalizedMessage += '✓ Directe Q&A sessie\n'
  personalizedMessage += '✓ Custom ROI berekening\n'

  return {
    type: 'navigation',
    content: personalizedMessage,
    navigationData: {
      label: 'Plan je Demo',
      route: '#', // Not used, but required
      icon: 'demo' as const,
      helpText:
        'Kies een tijdstip dat jou uitkomt. We passen de demo aan op basis van jouw industrie en interesses.',
      ctaText: 'Open Booking Panel',
    },
  }
}

function generatePricingResponse(
  _templates: MessageTemplate,
  _context: ConversationContext
): ResponseGeneration {
  const content = `💰 Goede vraag! We zijn momenteel in early adopter fase met **exclusieve founding member pricing**.\n\nDit betekent: significant lagere prijzen én lifetime voordelen. Perfect moment om in te stappen!`

  return {
    type: 'text',
    content,
    suggestedActions: ['Vertel meer over pricing', 'Wat zijn de voordelen?', 'Plan een demo'],
  }
}

function generateFeatureResponse(
  _templates: MessageTemplate,
  _context: ConversationContext
): ResponseGeneration {
  const content = `🎯 Goede vraag! Onze core capabilities:\n\n• **Content Factory**: AI content generation voor alle kanalen\n• **Campaign Manager**: Multi-channel orchestratie\n• **Analytics Monitor**: Real-time insights & predictive analytics\n• **Automation Engine**: End-to-end workflow automation\n\nWil je een specifieke feature in detail zien?`

  return {
    type: 'quick-replies',
    content,
    replies: [
      { label: 'Content Factory', value: 'explore_content_factory', icon: 'sparkles' },
      { label: 'Campaign Manager', value: 'explore_campaign_manager', icon: 'sparkles' },
      { label: 'Analytics', value: 'explore_analytics', icon: 'sparkles' },
      { label: 'Verken alles', value: 'explore_all', icon: 'arrow' },
    ],
  }
}

function generateSupportResponse(
  _templates: MessageTemplate,
  _context: ConversationContext
): ResponseGeneration {
  const content = `🤗 Natuurlijk help ik je graag! Waar loop je tegenaan?\n\nIk kan je helpen met:\n• Platform informatie\n• ROI berekeningen\n• Demo planning\n• Technische vragen`

  return {
    type: 'text',
    content,
    suggestedActions: ['Stel mijn vraag'],
  }
}

function generateGreetingResponse(templates: MessageTemplate): ResponseGeneration {
  const content = getRandomMessage(templates.greeting)

  return {
    type: 'quick-replies',
    content,
    replies: [
      { label: 'Wat kan dit platform?', value: 'platform_info', icon: 'sparkles' },
      { label: 'Bereken ROI', value: 'calculator', icon: 'calculator' },
      { label: 'Plan demo', value: 'demo', icon: 'calendar' },
    ],
  }
}

function generateGratitudeResponse(
  templates: MessageTemplate,
  context: ConversationContext
): ResponseGeneration {
  const encouragement = getRandomMessage(templates.encouragement)

  let content = `${encouragement} Graag gedaan!`

  // Suggest next step based on journey
  if (!context.calculatorCompleted && context.modulesExplored >= 2) {
    content += '\n\nWil je je ROI berekenen?'
    return {
      type: 'text',
      content,
      suggestedActions: ['Ja, bereken ROI', 'Nog even verkennen'],
    }
  }

  if (context.timeOnSite > 300) {
    // 5 minutes
    content += '\n\nJe bent goed bezig! Klaar voor een persoonlijke demo?'
    return {
      type: 'text',
      content,
      suggestedActions: ['Ja, plan demo', 'Nog vragen'],
    }
  }

  return {
    type: 'text',
    content,
    suggestedActions: ['Verken verder', 'Stel een vraag'],
  }
}

function generateDefaultResponse(
  templates: MessageTemplate,
  confidence: number
): ResponseGeneration {
  // Low confidence → Ask for clarification
  if (confidence < 0.6) {
    return {
      type: 'text',
      content: getRandomMessage(templates.responses.question),
      suggestedActions: ['Wat kan dit platform?', 'Bereken ROI', 'Plan demo'],
    }
  }

  // Medium confidence → General helpful response
  return {
    type: 'text',
    content: 'Interessant! Kan je me daar iets meer over vertellen?',
    suggestedActions: ['Wat kan dit platform?', 'Ik heb een vraag'],
  }
}

/**
 * Generate proactive nudge based on user behavior
 */
export function generateNudge(context: ConversationContext): ResponseGeneration | null {
  const templates = getTemplates(context.industryId)

  // Nudge: Explored 2+ modules but no calculator
  if (context.modulesExplored >= 2 && !context.calculatorCompleted) {
    const content = formatMessage(getRandomMessage(templates.nudges.explored_two_modules), {
      count: context.modulesExplored,
    })

    return {
      type: 'text',
      content,
      suggestedActions: ['Bereken ROI', 'Verken verder'],
    }
  }

  // Nudge: High engagement (5+ minutes)
  if (context.timeOnSite >= 300 && context.messagesCount >= 5) {
    const content = getRandomMessage(templates.nudges.high_engagement)

    return {
      type: 'text',
      content,
      suggestedActions: ['Ja, plan demo', 'Nog even kijken'],
    }
  }

  // Nudge: Calculator completed
  if (context.calculatorCompleted && context.messagesCount < 10) {
    const content = formatMessage(
      getRandomMessage(templates.nudges.calculator_completed),
      { roi: '€50.000+' } // This would come from actual calculator
    )

    return {
      type: 'text',
      content,
      suggestedActions: ['Ja, laten we praten', 'Meer info over implementatie'],
    }
  }

  return null
}

/**
 * Add personality touch to response
 */
export function addPersonalityTouch(content: string, industryId: string | null): string {
  const personality = getPersonality(industryId)

  // Add enthusiasm based on personality
  if (personality.enthusiasm === 'high' && Math.random() > 0.7) {
    const exclamations = ['!', '! 🚀', '! 💪', '! ⚡']
    const randomExclamation = exclamations[Math.floor(Math.random() * exclamations.length)]
    content = content.replace(/\.$/, randomExclamation)
  }

  return content
}
