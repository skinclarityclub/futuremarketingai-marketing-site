import type { PersonaConfig, TopicRouterResult } from './types'
import type { MemoryProfile } from './memory'

/** One short system line describing what Clyde already knows about the visitor,
 *  or '' when nothing is known. Only non-empty fields are included. A returning
 *  visitor starts a fresh session with no chat history, so this line is how Clyde
 *  recalls the agency without re-asking. */
export function buildMemoryContextLine(profile: MemoryProfile | undefined): string {
  if (!profile) return ''
  const parts: string[] = []
  if (profile.agencyName) parts.push(`agency "${profile.agencyName}"`)
  if (profile.niche) parts.push(`niche ${profile.niche}`)
  if (profile.brandCount != null) parts.push(`${profile.brandCount} brands`)
  if (profile.teamSize != null) parts.push(`team of ${profile.teamSize}`)
  if (profile.painPoint) parts.push(`pain point: ${profile.painPoint}`)
  if (profile.goal) parts.push(`goal: ${profile.goal}`)
  if (parts.length === 0) return ''
  return `You already know this about the visitor from earlier: ${parts.join(', ')}. Refer to it naturally and do not ask again for what you already know.`
}

const PAGE_CONTEXT_HINTS: Record<string, string> = {
  '/': 'User is on the homepage. Give an overview of capabilities, route to relevant skills.',
  '/memory': 'User is on the Memory page. Explain that Clyde keeps a memory per client (conversations, feedback, strategy and research) and that memories about a client belong to that agency and that client.',
  '/pricing': 'User is on the Pricing page. Walk through the tiers and help pick one by the number of client brands.',
  '/apply': 'User is on the Apply page. Answer questions about the partnership process.',
  '/case-studies/skinclarity-club':
    'User is on the SkinClarity Club case study, our first client. Explain how Clyde creates and schedules for 3 Instagram accounts and the agency approves before anything goes live. No result figures.',
  '/skills/social-media':
    'User is on the Social Media skill page. Offer to create a content calendar.',
  '/skills/blog-factory':
    'User is on the Blog Factory skill page. Offer to plan an SEO blog article.',
  '/skills/ad-manager': 'User is on the Ad Manager skill page. Offer to generate ad variants or explain how ads are prepared for approval in Meta and followed per ad on conversions, ROAS and ad fatigue.',
  '/skills/reel-builder':
    'User is on the Reel Builder skill page (coming soon). Explain the roadmap.',
  '/skills/voice-agent':
    'User is on the Voice Agent skill page (coming soon, not live yet). Explain what it is planned to do; do not claim you handle calls today.',
  '/skills/lead-qualifier':
    'User is on the Lead Qualifier skill page. You ARE the demo — point out they are chatting with you right now.',
  '/skills/email-management':
    'User is on the Email Management skill page. Explain Gmail and Outlook inbox classification with labels and draft replies sent after approval, not campaigns.',
  '/skills/manychat':
    'User is on the ManyChat DM skill page. Explain Instagram DM keyword triggers, draft replies in the brand voice and lead capture.',
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
  context?: {
    language?: string
    currentPage?: string
    demoMode?: boolean
    memoryProfile?: MemoryProfile
  }
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
    let contextContent = `## Context:\n- Language: ${context.language ?? 'nl'}\n- Current page: ${context.currentPage ?? 'unknown'}`

    const pageHint = context.currentPage ? PAGE_CONTEXT_HINTS[context.currentPage] : undefined
    if (pageHint) {
      contextContent += `\n- Page context: ${pageHint}`
    }

    if (context.demoMode) {
      contextContent += `\n\n## DEMO MODE ACTIVE
You are in a guided demo showcasing FutureMarketingAI capabilities. The user is a prospect being walked through scripted scenarios.

**CRITICAL RULES FOR DEMO MODE:**
1. You MUST use a tool for EVERY response. The tool cards in the conversation ARE the demo, your text is just a one-sentence bridge.
2. Match the user's request to the most relevant tool. When asked about skills/services/capabilities → get_skills. When asked about case studies/proof/results → get_case_study. When asked about ROI/savings/time → get_roi_estimate. When asked about pricing/tariffs → get_pricing_info. When asked about fit/qualification/evaluation → qualify_lead (its result is never shown, so never state a score; say the fit in one sentence, and when the level is hot or warm also call book_call so the visitor sees the application card). When asked to book/plan a call → book_call.
3. NEVER respond with only text, always call the appropriate tool.
4. Keep text to ONE sentence max. The tool card does the heavy lifting.`
    }

    messages.push({
      role: 'system',
      content: contextContent,
    })
  }

  // Part 4: Cross-session memory recall (only if a profile was sent).
  // NO cacheControl — varies per visitor. Kept out of the static prefix so the
  // byte-for-byte cache key is unaffected.
  const memoryLine = buildMemoryContextLine(context?.memoryProfile)
  if (memoryLine) {
    messages.push({ role: 'system', content: memoryLine })
  }

  return messages
}
