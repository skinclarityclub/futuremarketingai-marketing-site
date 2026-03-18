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
  context?: { language?: string; currentPage?: string; demoMode?: boolean }
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
    let contextContent = `## Context:\n- Language: ${context.language ?? 'en'}\n- Current page: ${context.currentPage ?? 'unknown'}`

    if (context.demoMode) {
      contextContent += `\n\n## DEMO MODE ACTIVE
You are in a guided demo showcasing FMai capabilities. The user is a prospect being walked through scripted scenarios.

**CRITICAL RULES FOR DEMO MODE:**
1. You MUST use a tool for EVERY response. The tool cards in the side panel ARE the demo — your text is just a 1-sentence bridge.
2. Match the user's request to the most relevant tool. When asked about services → get_services. When asked about case studies → get_case_study. When asked about ROI → get_roi_estimate or get_roi_info. When asked about pricing → get_pricing_info. When asked about products → search_products. When asked to build a routine → build_routine. When asked about modules → explain_module. When asked about billing/support → search_knowledge_base. When asked to create a ticket → create_ticket. When asked about ticket status → check_status. When asked to escalate → escalate_to_human. When asked to book → book_call. When asked about lead qualification → qualify_lead.
3. NEVER respond with only text — always call the appropriate tool.
4. Keep text to ONE sentence max. The tool card does the heavy lifting.`
    }

    messages.push({
      role: 'system',
      content: contextContent,
    })
  }

  return messages
}
