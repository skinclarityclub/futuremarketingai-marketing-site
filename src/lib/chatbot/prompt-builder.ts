import type { PersonaConfig, TopicRouterResult } from './types'

interface SystemMessage {
  role: 'system'
  content: string
  providerOptions?: {
    anthropic?: { cacheControl?: { type: 'ephemeral' } }
  }
}

export function buildSystemMessages(
  persona: PersonaConfig,
  topicResult: TopicRouterResult,
  context?: { language?: string; currentPage?: string }
): SystemMessage[] {
  const messages: SystemMessage[] = []

  // Part 1: Static prefix with cache control (ALWAYS included)
  // Must be byte-for-byte identical across requests for same persona
  messages.push({
    role: 'system',
    content: persona.staticPrefix,
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  })

  // Part 2: Dynamic knowledge (only if non-empty)
  // NO cacheControl — changes per request
  if (topicResult.knowledgeContent) {
    messages.push({
      role: 'system',
      content: `## Relevant Knowledge:\n${topicResult.knowledgeContent}`,
    })
  }

  // Part 3: Request context (only if provided)
  // NO cacheControl
  if (context) {
    messages.push({
      role: 'system',
      content: `## Context:\n- Language: ${context.language ?? 'en'}\n- Current page: ${context.currentPage ?? 'unknown'}`,
    })
  }

  return messages
}
