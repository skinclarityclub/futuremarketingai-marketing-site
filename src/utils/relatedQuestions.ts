/**
 * Intelligent Related Questions System
 *
 * Generates contextually relevant follow-up questions based on:
 * - User's current conversation context
 * - Industry and ICP profile
 * - Journey progression
 * - Previous questions asked
 *
 * @module relatedQuestions
 */

import type { ChatMessage } from '../types/chat'

export interface RelatedQuestion {
  text: string
  category: 'product' | 'pricing' | 'implementation' | 'roi' | 'comparison'
  priority: number // 1-10, higher = more relevant
  icon?: string
}

export interface QuestionContext {
  industryId: string | null
  icpScore: number
  modulesExplored: number
  calculatorCompleted: boolean
  messagesCount: number
  recentMessages: ChatMessage[]
}

/**
 * Generate intelligent related questions based on conversation context
 */
export function generateRelatedQuestions(
  lastUserMessage: string,
  context: QuestionContext,
  maxQuestions: number = 3
): RelatedQuestion[] {
  const questions: RelatedQuestion[] = []

  // Analyze last message for topic
  const messageLower = lastUserMessage.toLowerCase()

  // === MODULE-SPECIFIC QUESTIONS ===

  if (messageLower.includes('content') || messageLower.includes('pipeline')) {
    questions.push(
      { text: 'Hoe snel kan ik content genereren?', category: 'product', priority: 9, icon: '⚡' },
      { text: 'Ondersteunt het mijn brand voice?', category: 'product', priority: 8, icon: '🎨' },
      { text: 'Kan ik de content nog aanpassen?', category: 'product', priority: 7, icon: '✏️' }
    )
  }

  if (
    messageLower.includes('analytics') ||
    messageLower.includes('data') ||
    messageLower.includes('reporting')
  ) {
    questions.push(
      { text: 'Welke metrics worden getrackt?', category: 'product', priority: 9, icon: '📊' },
      { text: 'Kan ik custom dashboards maken?', category: 'product', priority: 7, icon: '🎯' },
      { text: 'Hoe werkt de self-learning?', category: 'product', priority: 8, icon: '🧠' }
    )
  }

  if (
    messageLower.includes('ad') ||
    messageLower.includes('advertising') ||
    messageLower.includes('roas')
  ) {
    questions.push(
      { text: 'Wat is de gemiddelde ROAS verbetering?', category: 'roi', priority: 9, icon: '💰' },
      {
        text: 'Welke ad platforms worden ondersteund?',
        category: 'product',
        priority: 8,
        icon: '📱',
      },
      { text: 'Hoe werkt budget optimalisatie?', category: 'product', priority: 7, icon: '🎛️' }
    )
  }

  // === PRICING QUESTIONS ===

  if (
    messageLower.includes('prijs') ||
    messageLower.includes('kost') ||
    messageLower.includes('€') ||
    messageLower.includes('founding')
  ) {
    questions.push(
      { text: 'Hoeveel bespaar ik in jaar 1?', category: 'roi', priority: 10, icon: '💵' },
      { text: 'Wat krijg ik voor €15,000/maand?', category: 'pricing', priority: 9, icon: '🎁' },
      { text: 'Zijn er setup fees?', category: 'pricing', priority: 7, icon: '🔧' }
    )

    if (messageLower.includes('slot') || messageLower.includes('founding')) {
      questions.push(
        {
          text: 'Hoeveel Founding slots zijn er nog?',
          category: 'pricing',
          priority: 10,
          icon: '🏆',
        },
        { text: 'Wat is de rate lock periode?', category: 'pricing', priority: 8, icon: '🔒' }
      )
    }
  }

  // === IMPLEMENTATION QUESTIONS ===

  if (
    messageLower.includes('setup') ||
    messageLower.includes('onboarding') ||
    messageLower.includes('start') ||
    messageLower.includes('implement')
  ) {
    questions.push(
      {
        text: 'Hoe lang duurt de implementatie?',
        category: 'implementation',
        priority: 10,
        icon: '⏱️',
      },
      {
        text: 'Hoeveel tijd kost het van mijn team?',
        category: 'implementation',
        priority: 9,
        icon: '👥',
      },
      { text: 'Krijgen we training?', category: 'implementation', priority: 7, icon: '🎓' }
    )
  }

  // === COMPARISON QUESTIONS ===

  if (
    messageLower.includes('verschil') ||
    messageLower.includes('versus') ||
    messageLower.includes('beter dan')
  ) {
    questions.push(
      { text: 'Wat maakt jullie uniek?', category: 'comparison', priority: 9, icon: '✨' },
      {
        text: 'Kan het mijn huidige tools vervangen?',
        category: 'comparison',
        priority: 8,
        icon: '🔄',
      },
      { text: 'Hoe snel zie ik resultaten?', category: 'roi', priority: 9, icon: '📈' }
    )
  }

  // === INTEGRATION QUESTIONS ===

  if (
    messageLower.includes('integra') ||
    messageLower.includes('connect') ||
    messageLower.includes('shopify') ||
    messageLower.includes('api')
  ) {
    questions.push(
      {
        text: 'Integreert het met Shopify/WooCommerce?',
        category: 'product',
        priority: 9,
        icon: '🛍️',
      },
      { text: 'Welke tools worden ondersteund?', category: 'product', priority: 8, icon: '🔌' },
      { text: 'Hoe lang duurt de setup?', category: 'implementation', priority: 7, icon: '⚙️' }
    )
  }

  // === JOURNEY-BASED QUESTIONS ===

  // Early journey (< 2 modules explored)
  if (context.modulesExplored < 2) {
    questions.push(
      { text: 'Wat zijn de 6 core modules?', category: 'product', priority: 8, icon: '🧩' },
      { text: 'Voor welke bedrijven werkt dit?', category: 'product', priority: 7, icon: '🎯' },
      { text: 'Kan ik een demo zien?', category: 'product', priority: 6, icon: '👀' }
    )
  }

  // Mid journey (2-4 modules, no calculator)
  if (context.modulesExplored >= 2 && context.modulesExplored < 5 && !context.calculatorCompleted) {
    questions.push(
      { text: 'Hoeveel kan ik besparen?', category: 'roi', priority: 9, icon: '💰' },
      { text: 'Wat is de payback period?', category: 'roi', priority: 8, icon: '📊' },
      { text: 'Bereken mijn ROI', category: 'roi', priority: 10, icon: '🧮' }
    )
  }

  // Late journey (calculator done, high ICP)
  if (context.calculatorCompleted && context.icpScore > 60) {
    questions.push(
      { text: 'Hoe claim ik een Founding slot?', category: 'pricing', priority: 10, icon: '🏆' },
      { text: 'Wanneer kunnen we starten?', category: 'implementation', priority: 9, icon: '🚀' },
      { text: 'Wat zijn de contractvoorwaarden?', category: 'pricing', priority: 7, icon: '📄' }
    )
  }

  // === INDUSTRY-SPECIFIC QUESTIONS ===

  if (context.industryId === 'ecommerce') {
    questions.push(
      {
        text: 'Hoe werkt product catalog integration?',
        category: 'product',
        priority: 8,
        icon: '🛒',
      },
      { text: 'Kunnen we retargeting automatiseren?', category: 'product', priority: 7, icon: '🎯' }
    )
  }

  if (context.industryId === 'saas') {
    questions.push(
      {
        text: 'Kan het lead nurturing automatiseren?',
        category: 'product',
        priority: 8,
        icon: '🌱',
      },
      { text: 'Hoe verhoog ik trial conversions?', category: 'roi', priority: 8, icon: '📈' }
    )
  }

  if (context.industryId === 'agency') {
    questions.push(
      {
        text: 'Kan ik white-label dashboards maken?',
        category: 'product',
        priority: 9,
        icon: '🎨',
      },
      { text: 'Hoeveel klanten kan ik managen?', category: 'product', priority: 8, icon: '👥' }
    )
  }

  // === DEFAULT FALLBACK QUESTIONS ===

  // If no specific questions matched, add general high-value ones
  if (questions.length === 0) {
    questions.push(
      { text: 'Hoe werkt het platform precies?', category: 'product', priority: 7, icon: '🤔' },
      {
        text: 'Wat zijn de voordelen voor mijn bedrijf?',
        category: 'roi',
        priority: 8,
        icon: '💼',
      },
      { text: 'Kan ik een demo inplannen?', category: 'implementation', priority: 7, icon: '📅' }
    )
  }

  // Sort by priority (highest first) and return top N
  const sortedQuestions = questions.sort((a, b) => b.priority - a.priority).slice(0, maxQuestions)

  // Deduplicate
  const uniqueQuestions = sortedQuestions.filter(
    (q, index, self) => index === self.findIndex((t) => t.text === q.text)
  )

  return uniqueQuestions
}

/**
 * Get questions for a specific category
 */
export function getQuestionsByCategory(
  category: RelatedQuestion['category'],
  context: QuestionContext
): RelatedQuestion[] {
  const allQuestions = generateRelatedQuestions('', context, 20) // Generate many
  return allQuestions.filter((q) => q.category === category).slice(0, 5) // Top 5 per category
}

/**
 * Get "frequently asked" questions (static but high-value)
 */
export function getFrequentlyAskedQuestions(industryId: string | null = null): RelatedQuestion[] {
  const baseQuestions: RelatedQuestion[] = [
    { text: 'Hoe werkt de AI Content Writer?', category: 'product', priority: 10, icon: '✍️' },
    { text: 'Wat kost het platform?', category: 'pricing', priority: 10, icon: '💰' },
    { text: 'Hoeveel tijd bespaart het?', category: 'roi', priority: 9, icon: '⏱️' },
    { text: 'Hoe lang duurt de setup?', category: 'implementation', priority: 9, icon: '🔧' },
    { text: 'Kan ik het eerst testen?', category: 'implementation', priority: 8, icon: '🧪' },
    { text: 'Welke platforms worden ondersteund?', category: 'product', priority: 8, icon: '🔌' },
  ]

  // Add industry-specific FAQ
  if (industryId === 'ecommerce') {
    baseQuestions.push({
      text: 'Integreert het met mijn webshop?',
      category: 'product',
      priority: 10,
      icon: '🛍️',
    })
  }

  if (industryId === 'saas') {
    baseQuestions.push({
      text: 'Kan het leads nurturing automatiseren?',
      category: 'product',
      priority: 10,
      icon: '🌱',
    })
  }

  return baseQuestions.sort((a, b) => b.priority - a.priority).slice(0, 6)
}
