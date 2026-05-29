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

/** Why a complexity level was chosen — surfaced for cost/latency monitoring. */
export type ComplexityTrigger =
  | 'persona-keyword'
  | 'complex-keyword'
  | 'long-message'
  | 'deep-conversation'
  | 'default-haiku'

export interface ComplexityResult {
  level: ComplexityLevel
  trigger: ComplexityTrigger
  /** The specific keyword that forced escalation, when trigger is keyword-based. */
  matched?: string
}

/**
 * Like {@link detectComplexity} but also reports WHY the level was chosen, so the
 * engine can log every model decision. Sonnet escalations cost/latency multiples of
 * haiku, so we want to size how often (and why) they fire in production.
 */
export function explainComplexity(
  message: string,
  conversationDepth: number,
  personaKeywords?: string[]
): ComplexityResult {
  const lowerMessage = message.toLowerCase()

  // Check persona-specific keywords first
  if (personaKeywords) {
    for (const keyword of personaKeywords) {
      if (lowerMessage.includes(keyword.toLowerCase())) {
        return { level: 'sonnet', trigger: 'persona-keyword', matched: keyword }
      }
    }
  }

  // Check general complexity keywords
  for (const keyword of COMPLEX_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      return { level: 'sonnet', trigger: 'complex-keyword', matched: keyword }
    }
  }

  // Long messages suggest complex queries
  if (message.length > LONG_MESSAGE_THRESHOLD) {
    return { level: 'sonnet', trigger: 'long-message' }
  }

  // Deep conversations need more reasoning
  if (conversationDepth > DEEP_CONVERSATION_THRESHOLD) {
    return { level: 'sonnet', trigger: 'deep-conversation' }
  }

  return { level: 'haiku', trigger: 'default-haiku' }
}

export function detectComplexity(
  message: string,
  conversationDepth: number,
  personaKeywords?: string[]
): ComplexityLevel {
  return explainComplexity(message, conversationDepth, personaKeywords).level
}

export const MODEL_IDS = {
  haiku: 'claude-haiku-4-5-20251001',
  // Real Sonnet escalation for complex/long/deep queries (was wired to haiku,
  // making detectComplexity a no-op). Improves reasoning + Dutch quality where
  // it matters; cost/latency only rises for the minority of complex turns.
  sonnet: 'claude-sonnet-4-6',
} as const
