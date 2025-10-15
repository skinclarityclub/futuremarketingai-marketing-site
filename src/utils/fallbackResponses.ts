/**
 * Smart Fallback Response System
 *
 * Provides categorized, context-aware fallback responses when:
 * - LLM API fails
 * - User asks out-of-scope questions
 * - Response quality is low
 * - Rate limits are hit
 *
 * @module fallbackResponses
 */

import type { ConversationContext } from './conversationEngine'

export type FallbackCategory =
  | 'off_topic'
  | 'too_vague'
  | 'competitor'
  | 'technical_detail'
  | 'pricing_standard'
  | 'api_error'
  | 'rate_limit'
  | 'generic'

export interface FallbackResponse {
  content: string
  suggestedActions: string[]
  redirectTo?: 'calculator' | 'explorer' | 'pricing' | 'demo'
}

/**
 * Get appropriate fallback response based on category and context
 */
export function getFallbackResponse(
  category: FallbackCategory,
  context: ConversationContext,
  _userMessage?: string
): FallbackResponse {
  switch (category) {
    case 'off_topic':
      return getOffTopicResponse(context)

    case 'too_vague':
      return getTooVagueResponse(context)

    case 'competitor':
      return getCompetitorResponse(context)

    case 'technical_detail':
      return getTechnicalDetailResponse(context)

    case 'pricing_standard':
      return getPricingStandardResponse(context)

    case 'api_error':
      return getAPIErrorResponse(context)

    case 'rate_limit':
      return getRateLimitResponse(context)

    case 'generic':
    default:
      return getGenericResponse(context)
  }
}

/**
 * OFF-TOPIC: User asks about something unrelated
 */
function getOffTopicResponse(context: ConversationContext): FallbackResponse {
  const responses = [
    'Interessante vraag! Maar ik ben hier om je te helpen met FutureMarketingAI. Wat wil je weten over het platform?',
    'Dat valt net buiten mijn expertise. Ik focus me graag op hoe ons platform jouw marketing kan transformeren.',
    'Goeie vraag, maar laten we het over FutureMarketingAI hebben. Welk onderdeel interesseert je het meest?',
  ]

  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    suggestedActions:
      context.modulesExplored === 0
        ? ['Verken modules', 'Bereken ROI', 'Plan demo']
        : ['Wat kan het platform?', 'Bereken ROI', 'Plan demo'],
  }
}

/**
 * TOO VAGUE: User message is unclear
 */
function getTooVagueResponse(context: ConversationContext): FallbackResponse {
  const responses = [
    'Hmm, ik begrijp je vraag niet helemaal. Kun je wat specifieker zijn?',
    'Interessant! Kun je me wat meer vertellen over wat je precies bedoelt?',
    'Ik wil je graag helpen, maar ik snap je vraag niet helemaal. Kun je het anders formuleren?',
  ]

  // Context-aware suggestions
  let actions: string[]
  if (context.modulesExplored < 2) {
    actions = ['Verken het platform', 'Wat zijn de voordelen?', 'Bereken ROI']
  } else if (!context.calculatorCompleted) {
    actions = ['Bereken mijn ROI', 'Zie pricing', 'Plan demo']
  } else {
    actions = ['Stel een specifieke vraag', 'Plan demo', 'Zie Dashboard']
  }

  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    suggestedActions: actions,
  }
}

/**
 * COMPETITOR: User mentions competitors
 */
function getCompetitorResponse(context: ConversationContext): FallbackResponse {
  const responses = [
    'Ik focus me graag op wat FutureMarketingAI uniek maakt. Wil je zien hoe wij 847% ROI realiseren?',
    'Goede vraag! Maar in plaats van vergelijkingen, laat ik je liever zien wat wij kunnen. Bereken je persoonlijke ROI?',
    'Ik kan je het beste vertellen over FutureMarketingAI zelf. Welk onderdeel interesseert je?',
  ]

  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    suggestedActions:
      (context.icpScore ?? 0) > 60
        ? ['Bereken mijn ROI', 'Zie unieke features', 'Plan demo']
        : ['Verken het platform', 'Wat maakt het uniek?', 'Bereken ROI'],
    redirectTo: 'calculator',
  }
}

/**
 * TECHNICAL DETAIL: User asks deep technical questions
 */
function getTechnicalDetailResponse(context: ConversationContext): FallbackResponse {
  const responses = [
    'Dat is een technische vraag waar ons team je graag bij helpt. Zullen we een demo inplannen?',
    'Goede technische vraag! Die beantwoorden we het beste in een persoonlijk gesprek. Plan een demo?',
    'Technische details bespreken we graag in een strategic consultation. Interesse?',
  ]

  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    suggestedActions:
      (context.icpScore ?? 0) > 60
        ? ['Plan strategic consultation', 'Bereken ROI', 'Stel andere vraag']
        : ['Plan demo', 'Zie Dashboard', 'Stel andere vraag'],
    redirectTo: 'demo',
  }
}

/**
 * PRICING STANDARD: User asks about non-Early Adopter pricing
 */
function getPricingStandardResponse(context: ConversationContext): FallbackResponse {
  const responses = [
    'We focussen nu op Early Adopter pricing. Founding Member slots zijn €15,000/maand met 2 maanden gratis. Interesse?',
    'Onze Early Adopter slots zijn de beste deal: €15,000/maand, rate locked 24 maanden. Nog maar 2 Founding slots over!',
    'Standard pricing komt later. Nu zijn er nog 2 Founding Member slots (€15,000/maand). Claim je slot?',
  ]

  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    suggestedActions: context.calculatorCompleted
      ? ['Claim Founding slot', 'Bereken besparing', 'Plan consultation']
      : ['Bereken mijn ROI', 'Zie volledige value stack', 'Plan demo'],
    redirectTo: 'pricing',
  }
}

/**
 * API ERROR: LLM API call failed
 */
function getAPIErrorResponse(context: ConversationContext): FallbackResponse {
  const responses = [
    'Even een momentje... Laten we het anders proberen. Wat wil je weten?',
    'Sorry, daar ging iets mis. Maar ik help je graag verder! Wat wil je weten?',
    'Hmm, technische hik. Geen probleem! Stel je vraag anders?',
  ]

  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    suggestedActions:
      context.modulesExplored > 0
        ? ['Bereken ROI', 'Plan demo', 'Verken verder']
        : ['Wat kan dit platform?', 'Bereken ROI', 'Plan demo'],
  }
}

/**
 * RATE LIMIT: Too many requests
 */
function getRateLimitResponse(_context: ConversationContext): FallbackResponse {
  const responses = [
    'Even rustig aan! Je bent enthousiast, dat waardeer ik. Neem even de tijd om te verkennen.',
    'Wow, je stelt veel vragen! Neem even de tijd om het platform te verkennen.',
    'Even een pauze. Verken ondertussen de modules op je eigen tempo!',
  ]

  return {
    content: responses[Math.floor(Math.random() * responses.length)],
    suggestedActions: ['Verken modules', 'Zie Dashboard', 'Bereken ROI'],
    redirectTo: 'explorer',
  }
}

/**
 * GENERIC: Catch-all fallback
 */
function getGenericResponse(context: ConversationContext): FallbackResponse {
  // High-engagement leads get different response
  if ((context.icpScore ?? 0) > 70 && context.modulesExplored > 2) {
    return {
      content:
        'Interessant! Laten we daar dieper op ingaan in een persoonlijk gesprek. Plan je een demo?',
      suggestedActions: ['Plan strategic consultation', 'Bereken ROI', 'Claim Founding slot'],
      redirectTo: 'demo',
    }
  }

  // Mid-journey
  if (context.modulesExplored > 0 && !context.calculatorCompleted) {
    return {
      content: 'Goede vraag! Wil je eerst zien hoeveel je kunt besparen met ons platform?',
      suggestedActions: ['Bereken mijn ROI', 'Verken verder', 'Plan demo'],
      redirectTo: 'calculator',
    }
  }

  // Early journey
  return {
    content: 'Interessant! Vertel me meer over wat je zoekt, of verken eerst de modules.',
    suggestedActions: ['Verken modules', 'Wat zijn de voordelen?', 'Bereken ROI'],
    redirectTo: 'explorer',
  }
}

/**
 * Detect which fallback category applies to a user message
 */
export function detectFallbackCategory(userMessage: string): FallbackCategory {
  const messageLower = userMessage.toLowerCase()

  // Check for competitor mentions
  const competitors = [
    'hubspot',
    'marketo',
    'salesforce',
    'pardot',
    'drift',
    'intercom',
    'activecampaign',
  ]
  if (competitors.some((comp) => messageLower.includes(comp))) {
    return 'competitor'
  }

  // Check for off-topic keywords
  const offTopicKeywords = ['weer', 'voetbal', 'politiek', 'recepten', 'nieuws', 'film', 'muziek']
  if (offTopicKeywords.some((word) => messageLower.includes(word))) {
    return 'off_topic'
  }

  // Check for technical depth
  const technicalKeywords = [
    'api endpoint',
    'database schema',
    'architecture',
    'source code',
    'infrastructure',
    'deployment',
  ]
  if (technicalKeywords.some((word) => messageLower.includes(word))) {
    return 'technical_detail'
  }

  // Check for vague input
  if (userMessage.trim().length < 5 || userMessage.split(' ').length < 2) {
    return 'too_vague'
  }

  // Check for standard pricing questions (non-Early Adopter)
  if (messageLower.includes('standard prijs') || messageLower.includes('normale prijs')) {
    return 'pricing_standard'
  }

  return 'generic'
}

/**
 * Generate emergency fallback (when everything fails)
 */
export function getEmergencyFallback(): FallbackResponse {
  return {
    content: 'Ik wil je graag helpen! Kies een onderwerp waar ik je mee kan helpen:',
    suggestedActions: ['Wat kan dit platform?', 'Bereken ROI', 'Plan demo'],
  }
}
