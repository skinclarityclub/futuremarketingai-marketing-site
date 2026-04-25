import type { PersonaConfig, TopicRouterResult } from './types'

const PAGE_CONTEXT_HINTS: Record<string, string> = {
  '/': 'User is on the homepage. Give an overview of capabilities, route to relevant skills.',
  '/memory': 'User is on the Memory System page. Explain the 4-layer memory and per-client isolation.',
  '/pricing': 'User is on the Pricing page. Help calculate ROI and walk through tiers.',
  '/apply': 'User is on the Apply page. Answer questions about the partnership process.',
  '/case-studies/skinclarity-club':
    'User is on the SkinClarity Club case study. Explain how Clyde runs 3 IG accounts autonomously.',
  '/skills/social-media':
    'User is on the Social Media skill page. Offer to create a content calendar.',
  '/skills/blog-factory':
    'User is on the Blog Factory skill page. Offer to plan an SEO blog article.',
  '/skills/ad-creator': 'User is on the Ad Creator skill page. Offer to generate ad variations.',
  '/skills/reel-builder':
    'User is on the Reel Builder skill page (coming soon). Explain the roadmap.',
  '/skills/voice-agent':
    'User is on the Voice Agent skill page. Explain how you handle calls or answer questions.',
  '/skills/lead-qualifier':
    'User is on the Lead Qualifier skill page. You ARE the demo — point out they are chatting with you right now.',
  '/skills/email-management':
    'User is on the Email Management skill page. Explain Gmail inbox classification, not campaigns.',
  '/skills/manychat':
    'User is on the ManyChat DM skill page (coming soon). Explain Instagram DM automation.',
  '/skills/reporting':
    'User is on the Reporting skill page. Offer to show a weekly performance report.',
  '/skills/seo-geo':
    'User is on the SEO/GEO skill page. Emphasize AI citation monitoring as a USP.',
  '/skills/research':
    'User is on the Research skill page. Offer to run a market research query.',
  '/skills/clyde': 'User is on the Clyde skill page. You are the orchestrator — demonstrate it.',
  '/about': 'User is on the About page. Share how you work.',
}

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

    const pageHint = context.currentPage ? PAGE_CONTEXT_HINTS[context.currentPage] : undefined
    if (pageHint) {
      contextContent += `\n- Page context: ${pageHint}`
    }

    if (context.demoMode) {
      contextContent += `\n\n## DEMO MODE ACTIVE
You are in a guided demo showcasing FutureMarketingAI capabilities. The user is a prospect being walked through scripted scenarios.

**CRITICAL RULES FOR DEMO MODE:**
1. You MUST use a tool for EVERY response. The tool cards in the side panel ARE the demo — your text is just a 1-sentence bridge.
2. Match the user's request to the most relevant tool. When asked about skills/services → get_skills. When asked about case studies → get_case_study. When asked about ROI → get_roi_estimate or get_roi_info. When asked about pricing → get_pricing_info. When asked about products → search_products. When asked to build a routine → build_routine. When asked about modules → explain_module. When asked about billing/support → search_knowledge_base. When asked to create a ticket → create_ticket. When asked about ticket status → check_status. When asked to escalate → escalate_to_human. When asked to book → book_call. When asked about lead qualification → qualify_lead.
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
