import type { ComplexityLevel } from './types'

const COMPLEX_KEYWORDS = [
  // English
  'strategy',
  'compare',
  'analyze',
  'explain in detail',
  'pros and cons',
  'architecture',
  'integration',
  'how does it work',
  'difference between',
  'recommend',
  'evaluate',
  'trade-off',
  'trade-offs',
  // Dutch
  'strategie',
  'vergelijk',
  'analyseer',
  'uitleggen',
  'verschil tussen',
  'aanbevelen',
  'beoordelen',
  // Spanish
  'estrategia',
  'comparar',
  'analizar',
  'explicar en detalle',
  'diferencia entre',
]

const LONG_MESSAGE_THRESHOLD = 200
const DEEP_CONVERSATION_THRESHOLD = 8

export function detectComplexity(
  message: string,
  conversationDepth: number,
  personaKeywords?: string[]
): ComplexityLevel {
  const lowerMessage = message.toLowerCase()

  // Check persona-specific keywords first
  if (personaKeywords) {
    for (const keyword of personaKeywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return 'sonnet'
      }
    }
  }

  // Check general complexity keywords
  for (const keyword of COMPLEX_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      return 'sonnet'
    }
  }

  // Long messages suggest complex queries
  if (message.length > LONG_MESSAGE_THRESHOLD) {
    return 'sonnet'
  }

  // Deep conversations need more reasoning
  if (conversationDepth > DEEP_CONVERSATION_THRESHOLD) {
    return 'sonnet'
  }

  return 'haiku'
}

export const MODEL_IDS = {
  haiku: 'anthropic/claude-haiku-4-5-20251001',
  sonnet: 'anthropic/claude-sonnet-4-5-20250514',
} as const
