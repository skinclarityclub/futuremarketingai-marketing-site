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
  '/pricing': 'User is on the Pricing page. Explain the Founding offer and what it costs for their number of client brands.',
  '/apply': 'User is on the Apply page. Answer questions about the partnership process.',
  '/case-studies/skinclarity-club':
    'User is on the SkinClarity Club case study, our first client. Explain, in the past tense, how Clyde made the posts for 3 Instagram accounts from May to October 2026 and a post went live only after approval in the app. No result figures.',
  '/case-studies/saleslobe':
    "User is on the SalesLobe case study (B2B). Explain how Clyde makes the brand's Instagram and the LinkedIn of founder Paul den Hartogh since 5 October 2026: first the voice round, then every post approved in the app before it goes live. No result figures, and do not name who approves.",
  '/skills/social-media':
    'User is on the Social Media skill page. Offer to create a content calendar.',
  '/skills/blog-factory':
    'User is on the Blog Factory skill page. Offer to plan an SEO blog article.',
  '/skills/ad-manager': 'User is on the Ad Manager skill page. Offer to generate ad variants or explain how ads are prepared for approval in Meta and followed per ad on conversions, ROAS and ad fatigue.',
  '/skills/lead-qualifier':
    'User is on the From post to lead page. Explain the Instagram flow: a keyword under a post or in a DM gets an instant DM with the matching link, Clyde writes the follow-up in the brand voice and the agency approves it. No scores and no "warm leads".',
  '/skills/strategy':
    'User is on the Strategy and research page. Explain the strategy page per client (goal, audience, platforms, goals and a calendar for the year) and the research signals with source and date. Clyde proposes, the agency decides. Never say the strategy or the calendar adjusts itself.',
  '/skills':
    'User is on the What Clyde makes page. Walk them through planning, making, approving, from post to lead and measuring, per client in one workspace. Never give a number of skills. Voice Agent and Reel Builder are coming soon, not live.',
  '/skills/email-management':
    'User is on the Email Management skill page. Explain Gmail and Outlook inbox classification with labels and draft replies sent after approval, not campaigns.',
  '/skills/reporting':
    'User is on the Reporting skill page. Offer to show a weekly performance report.',
  '/skills/seo-geo':
    'User is on the SEO/GEO skill page. Emphasize AI citation monitoring as a USP.',
  '/skills/clyde':
    'User is on the Working with Clyde page. Explain what Clyde does himself, what he puts to the agency (under For you or on WhatsApp, with Run and Cancel) and what only the agency does: approving and pausing. No post goes live without approval.',
  '/client-portal':
    "User is on the client portal page. Explain what the agency's client does in their portal: approve, reject or ask for a change (only a manager on their team approves), see the calendar and reports, add images and send requests through the form. The client's own Clyde only reads. Never say the client approves or requests through WhatsApp.",
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
2. Match the user's request to the most relevant tool. When asked about skills/services/capabilities → get_skills. When asked about case studies/proof/results → get_case_study. When asked about ROI/savings/time → get_roi_estimate. When asked about pricing/tariffs → get_pricing_info. When asked about fit/qualification/evaluation → qualify_lead (its result is never shown, so never state a score; say the fit in one sentence; the demo books the call in its own step). When asked to book/plan a call → book_call.
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
