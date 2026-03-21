import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { validateInput } from './security'
import { checkAllRateLimits } from './rate-limiter'
import { getPersona } from './persona-router'
// Side-effect: registers all personas in the registry
import './personas'
import { routeToKnowledge } from './topic-router'
import { buildSystemMessages } from './prompt-builder'
import { detectComplexity, MODEL_IDS } from './complexity-detector'
import { createPersonaTools } from './tool-executor'
import type { ChatRequest } from './types'
import type { Tool } from 'ai'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyToolRecord = Record<string, Tool<any, any>>

/** Tools always available regardless of page context */
const ALWAYS_AVAILABLE = ['get_services', 'book_call', 'navigate_to_page', 'get_case_study']

/** Additional tools surfaced per page path */
const PAGE_TOOLS: Record<string, string[]> = {
  '/chatbots': [
    'search_products',
    'get_product_details',
    'build_routine',
    'search_knowledge_base',
    'create_ticket',
  ],
  '/marketing-machine': ['explain_module', 'get_roi_info', 'get_roi_estimate'],
  '/pricing': ['get_pricing_info', 'get_roi_estimate', 'qualify_lead'],
  '/voice-agents': ['get_pricing_info', 'qualify_lead'],
  '/automations': ['get_pricing_info', 'qualify_lead'],
  '/contact': ['qualify_lead', 'create_ticket'],
}

/**
 * Filters tools by page context for the flagship persona.
 * Reduces prompt size from ~17 tools to ~6-8 per request.
 */
function filterToolsByContext(
  allTools: AnyToolRecord,
  context: { currentPage?: string }
): AnyToolRecord {
  if (!context.currentPage) {
    return allTools
  }

  const pageSpecific = PAGE_TOOLS[context.currentPage] ?? []
  const allowedNames = [...ALWAYS_AVAILABLE, ...pageSpecific]

  const filtered: AnyToolRecord = {}
  Object.entries(allTools).forEach(([name, toolDef]) => {
    if (allowedNames.includes(name)) {
      filtered[name] = toolDef
    }
  })

  // If filtering would result in too few tools, return all (safety fallback)
  return Object.keys(filtered).length > 0 ? filtered : allTools
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp
  }

  return 'unknown'
}

export async function handleChatRequest(request: Request): Promise<Response> {
  try {
    // Check for API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return Response.json({ error: 'API key not configured' }, { status: 500 })
    }

    // 1. Reject non-POST
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }

    // 2. Parse request body
    let body: ChatRequest
    try {
      body = (await request.json()) as ChatRequest
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    // 3. Destructure
    const { personaId, message, sessionId, conversationHistory, messages, context } = body
    console.log('[ENGINE-V2] persona:', personaId, 'demoMode:', context?.demoMode)

    // 4. Validate required fields
    if (!personaId || typeof personaId !== 'string') {
      return Response.json({ error: 'personaId is required' }, { status: 400 })
    }
    if (!sessionId || typeof sessionId !== 'string') {
      return Response.json({ error: 'sessionId is required' }, { status: 400 })
    }

    // Determine mode: useChat sends `messages` array, legacy sends `message` string
    const isUseChatMode = Array.isArray(messages) && messages.length > 0

    if (!isUseChatMode && (!message || typeof message !== 'string')) {
      return Response.json({ error: 'message is required' }, { status: 400 })
    }

    // Extract the user message text for validation and topic routing
    // AI SDK v6 messages use `parts` array; fall back to `content` for legacy format
    let userMessageText: string
    if (isUseChatMode) {
      const lastMsg = messages[messages.length - 1]
      if (lastMsg?.parts && Array.isArray(lastMsg.parts)) {
        userMessageText = (lastMsg.parts as { type: string; text?: string }[])
          .filter((p) => p.type === 'text')
          .map((p) => p.text ?? '')
          .join('')
      } else {
        userMessageText = typeof lastMsg?.content === 'string' ? lastMsg.content : ''
      }
    } else {
      userMessageText = message as string
    }

    // 5. Validate input via security module
    const validation = validateInput(userMessageText)
    if (!validation.valid) {
      return Response.json({ error: validation.reason }, { status: 400 })
    }

    // 6. Check rate limits
    const ip = getClientIp(request)
    const rateCheck = checkAllRateLimits(sessionId, ip, personaId)
    if (!rateCheck.allowed) {
      return Response.json(
        {
          error: 'Rate limit exceeded',
          limitType: rateCheck.limitType,
          resetAt: rateCheck.resetAt,
        },
        { status: 429 }
      )
    }

    // 7. Load persona
    let persona
    try {
      persona = getPersona(personaId)
    } catch {
      return Response.json({ error: `Unknown persona: ${personaId}` }, { status: 404 })
    }

    // 8. Route knowledge via topic router
    const topicResult = routeToKnowledge(userMessageText, persona.topicDefinitions)

    // 9. Build system messages with prompt caching
    const systemMessages = buildSystemMessages(persona, topicResult, context)

    // 10. Detect complexity for model routing
    const historyLength = isUseChatMode ? messages.length : (conversationHistory?.length ?? 0)
    const complexity = detectComplexity(userMessageText, historyLength, persona.complexityKeywords)
    const modelId = MODEL_IDS[complexity]

    // 11. Create persona tools (with context-aware filtering for flagship)
    // During demo mode, all tools are needed regardless of page context
    let tools = createPersonaTools(persona)
    // For Clyde: all tools always available (no page-based filtering)
    // For demo mode: exclude navigate_to_page (catches too many queries)
    if (persona.id === 'clyde' || persona.id === 'flagship') {
      if (context?.demoMode) {
        const { navigate_to_page: _, ...demoTools } = tools
        tools = demoTools
      }
      // No else -- Clyde gets all tools on every page
    }

    // 12. Build messages for streamText
    const modelMessages = isUseChatMode
      ? await convertToModelMessages(messages as Parameters<typeof convertToModelMessages>[0])
      : [
          ...(conversationHistory ?? []).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user' as const, content: validation.sanitizedInput ?? (message as string) },
        ]

    // 13. Stream response
    // In demo mode, force tool usage so the AI always showcases capabilities
    const hasTools = Object.keys(tools).length > 0
    const result = streamText({
      model: anthropic(modelId),
      messages: [...systemMessages, ...modelMessages],
      tools: hasTools ? tools : undefined,
      toolChoice: hasTools ? (context?.demoMode ? 'required' : 'auto') : undefined,
      // Demo mode: 1 step = 1 tool call + text response (no chaining)
      // Normal mode: allow up to 3 rounds of tool calls
      stopWhen: stepCountIs(context?.demoMode ? 2 : 3),
      maxOutputTokens: persona.maxTokens,
      temperature: persona.temperature,
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    // 14. Unexpected error handler
    console.error('[chatbot-engine] Unexpected error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
