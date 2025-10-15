/**
 * Question Matcher - Enhanced Q&A System
 *
 * 2025 Best Practices:
 * - Fuzzy matching with keyword scoring
 * - Semantic similarity (expandable to embeddings)
 * - Context-aware ranking
 * - Confidence scoring
 * - Multi-tier fallback
 */

import knowledgeBase from '../config/knowledgeBase.json'

export interface QuestionMatch {
  questionId: string
  question: string
  answer: string
  confidence: number // 0-1
  category: string
  relatedModules?: string[]
  cta?: {
    text: string
    action: string
    value?: string
  }
  relatedQuestions?: string[]
}

export interface MatchContext {
  currentPage?: string
  modulesViewed?: number
  industry?: string
  icpScore?: number
  recentQueries?: string[]
}

/**
 * Calculate text similarity score using keyword matching
 */
function calculateKeywordScore(query: string, keywords: string[]): number {
  const queryWords = query.toLowerCase().split(/\s+/)
  const keywordMatches = keywords.filter((keyword) =>
    queryWords.some(
      (word) => word.includes(keyword.toLowerCase()) || keyword.toLowerCase().includes(word)
    )
  )

  return keywordMatches.length / Math.max(keywords.length, 1)
}

/**
 * Calculate question similarity score
 */
function calculateQuestionScore(query: string, question: string): number {
  const queryWords = new Set(query.toLowerCase().split(/\s+/))
  const questionWords = question.toLowerCase().split(/\s+/)

  const matches = questionWords.filter((word) => queryWords.has(word))
  return matches.length / Math.max(questionWords.length, queryWords.size)
}

/**
 * Apply context-based ranking boost
 */
function applyContextBoost(questionData: any, context: MatchContext): number {
  let boost = 1.0

  // Boost pricing questions if user has viewed 3+ modules or used calculator
  if (
    questionData.category === 'pricing' &&
    ((context.modulesViewed && context.modulesViewed >= 3) || context.currentPage === '/calculator')
  ) {
    boost *= 1.5
  }

  // Boost implementation questions if high ICP score
  if (questionData.category === 'implementation' && context.icpScore && context.icpScore >= 70) {
    boost *= 1.3
  }

  // Boost use case questions if industry is set
  if (questionData.category === 'use_cases' && context.industry) {
    boost *= 1.2
  }

  // Boost module-specific questions if viewing that module
  if (
    questionData.relatedModules &&
    context.currentPage &&
    questionData.relatedModules.some((mod: string) => context.currentPage?.includes(mod))
  ) {
    boost *= 1.4
  }

  return boost
}

/**
 * Main question matching function with confidence scoring
 */
export function matchQuestion(
  query: string,
  context: MatchContext = {},
  minConfidence: number = 0.3
): QuestionMatch | null {
  const allQuestions: Array<QuestionMatch & { category: string; rawScore: number }> = []

  // Iterate through all categories and questions
  Object.entries(knowledgeBase.categories).forEach(([catKey, category]: [string, any]) => {
    category.questions.forEach((q: any) => {
      // Calculate base scores
      const keywordScore = calculateKeywordScore(query, q.keywords)
      const questionScore = calculateQuestionScore(query, q.question)

      // Weighted combination (keywords 70%, question text 30%)
      const baseScore = keywordScore * 0.7 + questionScore * 0.3

      // Apply context boost
      const contextBoost = applyContextBoost({ ...q, category: catKey }, context)

      const finalScore = Math.min(baseScore * contextBoost, 1.0)

      if (finalScore >= minConfidence) {
        allQuestions.push({
          questionId: q.id,
          question: q.question,
          answer: q.answer,
          confidence: finalScore,
          category: category.name,
          relatedModules: q.relatedModules,
          cta: q.cta,
          rawScore: baseScore,
        })
      }
    })
  })

  // Sort by confidence (highest first)
  allQuestions.sort((a, b) => b.confidence - a.confidence)

  // Return best match, or null if none found
  return allQuestions.length > 0 ? allQuestions[0] : null
}

/**
 * Get multiple related questions for "Did you also want to know..." carousel
 */
export function getRelatedQuestions(
  primaryMatch: QuestionMatch,
  limit: number = 3
): QuestionMatch[] {
  const related: QuestionMatch[] = []

  // Find questions in same category
  Object.entries(knowledgeBase.categories).forEach(([_catKey, category]: [string, any]) => {
    category.questions.forEach((q: any) => {
      if (q.id !== primaryMatch.questionId && related.length < limit) {
        // Same category or overlapping keywords
        const isSameCategory = category.name === primaryMatch.category
        const hasOverlappingModules =
          primaryMatch.relatedModules &&
          q.relatedModules &&
          primaryMatch.relatedModules.some((mod: string) => q.relatedModules.includes(mod))

        if (isSameCategory || hasOverlappingModules) {
          related.push({
            questionId: q.id,
            question: q.question,
            answer: q.answer,
            confidence: 1.0, // Related questions are always high confidence
            category: category.name,
            relatedModules: q.relatedModules,
            cta: q.cta,
          })
        }
      }
    })
  })

  return related.slice(0, limit)
}

/**
 * Multi-tier fallback system
 */
export function getFallbackResponse(
  query: string,
  confidence: number,
  context: MatchContext
): {
  type: 'soft_fallback' | 'hard_fallback' | 'escalation'
  message: string
  suggestions: string[]
} {
  // Tier 1: Soft Fallback (0.2 < confidence < 0.3)
  // We found something, but not confident enough
  if (confidence > 0.2 && confidence < 0.3) {
    return {
      type: 'soft_fallback',
      message:
        'Ik denk dat je vraagt over dit onderwerp, maar ik wil zeker weten dat ik je goed help. Bedoel je:',
      suggestions: ['Pricing en kosten', 'Product features', 'Implementatie en setup'],
    }
  }

  // Tier 2: Hard Fallback (confidence < 0.2)
  // No good match found
  if (confidence < 0.2) {
    // Context-aware suggestions
    const suggestions: string[] = []

    if (context.modulesViewed && context.modulesViewed >= 3) {
      suggestions.push('Bereken je ROI')
      suggestions.push('Plan een demo')
    } else {
      suggestions.push('Bekijk product features')
      suggestions.push('Zie pricing info')
    }

    suggestions.push('Stel een andere vraag')

    const randomFallback =
      knowledgeBase.fallback_responses[
        Math.floor(Math.random() * knowledgeBase.fallback_responses.length)
      ]

    return {
      type: 'hard_fallback',
      message: randomFallback,
      suggestions,
    }
  }

  // Tier 3: Escalation (specific keywords detected)
  const escalationKeywords = [
    'complex',
    'custom',
    'enterprise',
    'specifiek',
    'integratie met',
    'on-premise',
    'contract',
    'legal',
  ]

  const needsEscalation = escalationKeywords.some((keyword) =>
    query.toLowerCase().includes(keyword)
  )

  if (needsEscalation) {
    return {
      type: 'escalation',
      message: knowledgeBase.escalation_message,
      suggestions: ['Plan een demo call', 'Stuur een email', 'Stel een andere vraag'],
    }
  }

  // Default: Hard fallback
  return {
    type: 'hard_fallback',
    message: knowledgeBase.fallback_responses[0],
    suggestions: ['Plan een demo', 'Bekijk features', 'Bereken ROI'],
  }
}

/**
 * Get proactive suggestions based on user behavior
 */
export function getProactiveSuggestions(context: MatchContext): string[] {
  const suggestions: string[] = []

  // After viewing 3+ modules
  if (context.modulesViewed && context.modulesViewed >= 3) {
    suggestions.push('Hoeveel kost FutureMarketingAI?')
    suggestions.push('Wat is de ROI van FutureMarketingAI?')
    suggestions.push('Hoe lang duurt de implementatie?')
  }

  // On calculator page
  if (context.currentPage === '/calculator') {
    suggestions.push('Is er een gratis trial?')
    suggestions.push('Hoe lang duurt de implementatie?')
    suggestions.push('Welke integraties ondersteunen jullie?')
  }

  // High ICP score
  if (context.icpScore && context.icpScore >= 70) {
    suggestions.push('Kan ik een demo krijgen?')
    suggestions.push('Hebben jullie training en support?')
    suggestions.push('Hoe zit het met data security?')
  }

  // Industry-specific
  if (context.industry === 'ecommerce') {
    suggestions.push('Hoe helpt dit e-commerce bedrijven?')
    suggestions.push('Wat is de AI Ad Builder?')
  } else if (context.industry === 'saas') {
    suggestions.push('Is dit geschikt voor SaaS bedrijven?')
    suggestions.push('Hoe werkt de Campaign Orchestrator?')
  } else if (context.industry === 'agency') {
    suggestions.push('Werken jullie met marketing agencies?')
    suggestions.push('Kan ik meerdere accounts beheren?')
  }

  // Default suggestions if nothing specific
  if (suggestions.length === 0) {
    suggestions.push('Wat is de AI Ad Builder?')
    suggestions.push('Hoeveel kost FutureMarketingAI?')
    suggestions.push('Kan ik een demo krijgen?')
  }

  return suggestions.slice(0, 3) // Max 3 suggestions
}
