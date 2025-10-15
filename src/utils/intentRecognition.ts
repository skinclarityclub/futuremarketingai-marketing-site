/**
 * Intent Recognition
 *
 * Pattern-based intent recognition for user messages
 */

export type UserIntent =
  | 'platform_info'
  | 'calculator_request'
  | 'demo_request'
  | 'pricing_question'
  | 'feature_question'
  | 'support_request'
  | 'greeting'
  | 'gratitude'
  | 'unknown'

export interface IntentMatch {
  intent: UserIntent
  confidence: number
  entities?: Record<string, string>
}

// Pattern matching rules
const intentPatterns: Record<UserIntent, RegExp[]> = {
  platform_info: [
    /wat (kan|doet|is) (dit|het|jullie) platform/i,
    /wat (zijn|heb je|hebben jullie) (voor )?mogelijkheden/i,
    /hoe werkt (dit|het|jullie)/i,
    /vertel (me )?(meer )?over/i,
    /wat (bieden jullie|bied je)/i,
    /features/i,
    /functionaliteit(en)?/i,
  ],

  calculator_request: [
    /roi calculator/i,
    /(bereken|toon|laat zien|show).*(roi|return)/i,
    /calculator/i,
    /mijn roi/i,
    /hoeveel (kan|zou) (ik|we).*(besparen|verdienen)/i,
    /cijfers/i,
    /berekening/i,
  ],

  demo_request: [
    /(plan|boek|inplannen|schedule).*(demo|afspraak|meeting|gesprek)/i,
    /demo/i,
    /persoonlijk.*gesprek/i,
    /wil.*zien/i,
    /contact.*opnemen/i,
    /live.*presentatie/i,
  ],

  pricing_question: [
    /(wat|hoeveel).*(kost|prijs|tarief)/i,
    /pricing/i,
    /abonnement/i,
    /investering/i,
    /early adopter/i,
    /founding member/i,
  ],

  feature_question: [
    /(heeft|hebt) (dit|jullie).*(functie|feature|mogelijkheid)/i,
    /(kan|kunt) (ik|we|jullie).*(integreren|koppelen|verbinden)/i,
    /(support|ondersteun)(t|en).*(voor|met)/i,
    /automation/i,
    /ai.*capabilities/i,
  ],

  support_request: [
    /(heb|hebben).*(vraag|probleem|issue)/i,
    /(help|hulp).*(nodig|met)/i,
    /support/i,
    /(begrijp|snap).*(niet|geen)/i,
    /(werkt|doet).*(niet|geen)/i,
  ],

  greeting: [/^(hey|hi|hoi|hallo|goedemorgen|goedemiddag|goedenavond)/i, /^(dag|hoi|hello)/i],

  gratitude: [/(dank|bedankt|thanks|thank you)/i, /top/i, /^(geweldig|excellent|perfect|super)/i],

  unknown: [],
}

// Keyword boosting for confidence
const keywordBoosts: Record<UserIntent, string[]> = {
  platform_info: ['platform', 'mogelijkheden', 'features', 'functionaliteit'],
  calculator_request: ['roi', 'calculator', 'berekenen', 'cijfers', 'return'],
  demo_request: ['demo', 'afspraak', 'gesprek', 'meeting', 'presentatie'],
  pricing_question: ['prijs', 'kosten', 'tarief', 'pricing', 'investering'],
  feature_question: ['feature', 'functie', 'mogelijkheid', 'integratie'],
  support_request: ['help', 'hulp', 'support', 'probleem', 'vraag'],
  greeting: ['hallo', 'hi', 'hey', 'hoi'],
  gratitude: ['bedankt', 'dank', 'thanks', 'top'],
  unknown: [],
}

/**
 * Recognize intent from user message
 */
export function recognizeIntent(message: string): IntentMatch {
  const normalizedMessage = message.toLowerCase().trim()

  // Check each intent pattern
  const matches: Array<{ intent: UserIntent; confidence: number }> = []

  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (pattern.test(normalizedMessage)) {
        let confidence = 0.7 // Base confidence for pattern match

        // Boost confidence based on keywords
        const boostWords = keywordBoosts[intent as UserIntent] || []
        const foundBoosts = boostWords.filter((word) =>
          normalizedMessage.includes(word.toLowerCase())
        )
        confidence += foundBoosts.length * 0.1

        // Cap at 1.0
        confidence = Math.min(confidence, 1.0)

        matches.push({ intent: intent as UserIntent, confidence })
        break // Only count first pattern match per intent
      }
    }
  }

  // Return highest confidence match
  if (matches.length > 0) {
    matches.sort((a, b) => b.confidence - a.confidence)
    return matches[0]
  }

  // Default to unknown
  return { intent: 'unknown', confidence: 0.5 }
}

/**
 * Extract entities from message (basic)
 */
export function extractEntities(message: string): Record<string, string> {
  const entities: Record<string, string> = {}

  // Extract numbers (for ROI, pricing discussions)
  const numbers = message.match(/\d+/g)
  if (numbers) {
    entities.number = numbers[0]
  }

  // Extract email
  const email = message.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g)
  if (email) {
    entities.email = email[0]
  }

  // Extract company name (after "bij" or "voor")
  const companyMatch = message.match(/(?:bij|voor)\s+([A-Z][\w\s]+)/i)
  if (companyMatch) {
    entities.company = companyMatch[1].trim()
  }

  return entities
}
