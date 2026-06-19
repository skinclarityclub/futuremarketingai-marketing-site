import { streamText, convertToModelMessages, stepCountIs } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { validateInput } from './security'
import { checkAllRateLimits } from './rate-limiter'
import { getPersona } from './persona-router'
// Side-effect: registers all personas in the registry
import './personas'
import { routeToKnowledge } from './topic-router'
import { buildSystemMessages } from './prompt-builder'
import { explainComplexity, MODEL_IDS } from './complexity-detector'
import { createPersonaTools } from './tool-executor'
import { normalizeChatbotLocale } from './tool-data'
import type { ChatRequest } from './types'
import { forwardTurnToInbox } from '../fma-inbox-forwarder'

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

    // Fire-and-forget: stuur user-turn naar inbox (dormant als env vars ontbreken)
    // Volgorde-garantie: user arriveert in DB VOOR assistant turn (onFinish)
    void forwardTurnToInbox({
      account_key: 'fmai_website',
      vendor: 'own-bot',
      external_session_id: sessionId,
      external_message_id: crypto.randomUUID(),
      role: 'user',
      content: userMessageText,
    });

    // 6. Check rate limits
    const ip = getClientIp(request)
    const rateCheck = await checkAllRateLimits(sessionId, ip, personaId)
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

    // 7. Load persona (fall back to 'clyde' for unknown persona IDs)
    let persona
    try {
      persona = getPersona(personaId)
    } catch {
      console.warn(`[ENGINE-V2] Unknown persona "${personaId}", falling back to clyde`)
      persona = getPersona('clyde')
    }

    // 8. Route knowledge via topic router
    const topicResult = routeToKnowledge(userMessageText, persona.topicDefinitions)

    // 9. Build system messages with prompt caching
    const systemMessages = buildSystemMessages(persona, topicResult, context)

    // 10. Detect complexity for model routing
    const historyLength = isUseChatMode ? messages.length : (conversationHistory?.length ?? 0)
    const complexity = explainComplexity(userMessageText, historyLength, persona.complexityKeywords)
    const modelId = MODEL_IDS[complexity.level]

    // 11. Create persona tools (locale-aware so cards render in the visitor's
    // language; context-aware filtering for flagship below).
    const locale = normalizeChatbotLocale(context?.language)

    // Cost/latency monitoring: sonnet escalations run multiples of haiku's cost +
    // latency, so log every model decision (model + why + cheap signals). No message
    // text is logged — privacy + log-size safe. Grep Vercel logs for [clyde-model]
    // to size the sonnet share and which trigger drives it.
    console.log(
      '[clyde-model]',
      JSON.stringify({
        persona: persona.id,
        model: complexity.level,
        escalated: complexity.level === 'sonnet',
        trigger: complexity.trigger,
        matched: complexity.matched,
        msgLen: userMessageText.length,
        depth: historyLength,
        locale,
        demo: !!context?.demoMode,
      })
    )

    let tools = createPersonaTools(persona, locale)
    if (persona.id === 'clyde' || persona.id === 'flagship') {
      // Strip e-commerce/support/legacy tools inherited from the SkinClarity
      // personas in BOTH normal and demo chat. They fire on plausible prompts
      // and render off-context cards (skincare products, fake support tickets,
      // the deprecated "Marketing Machine" module) — wrong for a B2B agency
      // prospect. The guided demo now scripts only the real agency tools, so the
      // strip never breaks a scenario.
      const OFF_CONTEXT_TOOLS = new Set([
        'search_products',
        'get_product_details',
        'build_routine',
        'add_to_cart_suggestion',
        'search_knowledge_base',
        'create_ticket',
        'check_status',
        'escalate_to_human',
        'explain_module',
        'get_roi_info',
      ])
      tools = Object.fromEntries(
        Object.entries(tools).filter(([name]) => !OFF_CONTEXT_TOOLS.has(name))
      )
      // Demo mode also drops navigate_to_page: under toolChoice:'required' it
      // over-triggers and hijacks scripted steps.
      if (context?.demoMode) {
        // navigate_to_page + remember_context over-trigger under toolChoice:'required'
        // and would hijack scripted demo steps.
        const DEMO_STRIP = new Set(['navigate_to_page', 'remember_context'])
        tools = Object.fromEntries(
          Object.entries(tools).filter(([name]) => !DEMO_STRIP.has(name))
        )
      }
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
      onFinish: ({ text }: { text: string }) => {
        // Fire-and-forget: stuur assistant-turn naar inbox na stream-voltooiing
        // text is de complete gestreamde tekst — nooit leeg bij normale flow
        if (text.trim().length > 0) {
          void forwardTurnToInbox({
            account_key: 'fmai_website',
            vendor: 'own-bot',
            external_session_id: sessionId,
            external_message_id: crypto.randomUUID(),
            role: 'assistant',
            content: text,
          });
        }
      },
    })

    return result.toUIMessageStreamResponse()
  } catch (error) {
    // 14. Unexpected error handler
    console.error('[chatbot-engine] Unexpected error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
