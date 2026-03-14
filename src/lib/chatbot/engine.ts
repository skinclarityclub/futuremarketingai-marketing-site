import { streamText, convertToModelMessages } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { validateInput } from './security'
import { checkAllRateLimits } from './rate-limiter'
import { getPersona } from './persona-router'
import { routeToKnowledge } from './topic-router'
import { buildSystemMessages } from './prompt-builder'
import { detectComplexity, MODEL_IDS } from './complexity-detector'
import { createPersonaTools } from './tool-executor'
import type { ChatRequest } from './types'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
} as const

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
    // 1. Handle OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: CORS_HEADERS })
    }

    // 2. Reject non-POST
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405, headers: CORS_HEADERS })
    }

    // 3. Parse request body
    let body: ChatRequest
    try {
      body = (await request.json()) as ChatRequest
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers: CORS_HEADERS })
    }

    // 4. Destructure
    const { personaId, message, sessionId, conversationHistory, messages, context } = body

    // 5. Validate required fields
    if (!personaId || typeof personaId !== 'string') {
      return Response.json(
        { error: 'personaId is required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }
    if (!sessionId || typeof sessionId !== 'string') {
      return Response.json(
        { error: 'sessionId is required' },
        { status: 400, headers: CORS_HEADERS }
      )
    }

    // Determine mode: useChat sends `messages` array, legacy sends `message` string
    const isUseChatMode = Array.isArray(messages) && messages.length > 0

    if (!isUseChatMode && (!message || typeof message !== 'string')) {
      return Response.json({ error: 'message is required' }, { status: 400, headers: CORS_HEADERS })
    }

    // Extract the user message text for validation and topic routing
    const userMessageText = isUseChatMode
      ? (messages[messages.length - 1]?.content ?? '')
      : (message as string)

    // 6. Validate input via security module
    const validation = validateInput(userMessageText)
    if (!validation.valid) {
      return Response.json({ error: validation.reason }, { status: 400, headers: CORS_HEADERS })
    }

    // 7. Check rate limits
    const ip = getClientIp(request)
    const rateCheck = checkAllRateLimits(sessionId, ip, personaId)
    if (!rateCheck.allowed) {
      return Response.json(
        {
          error: 'Rate limit exceeded',
          limitType: rateCheck.limitType,
          resetAt: rateCheck.resetAt,
        },
        { status: 429, headers: CORS_HEADERS }
      )
    }

    // 8. Load persona
    let persona
    try {
      persona = getPersona(personaId)
    } catch {
      return Response.json(
        { error: `Unknown persona: ${personaId}` },
        { status: 404, headers: CORS_HEADERS }
      )
    }

    // 9. Route knowledge via topic router
    const topicResult = routeToKnowledge(userMessageText, persona.topicDefinitions)

    // 10. Build system messages with prompt caching
    const systemMessages = buildSystemMessages(persona, topicResult, context)

    // 11. Detect complexity for model routing
    const historyLength = isUseChatMode ? messages.length : (conversationHistory?.length ?? 0)
    const complexity = detectComplexity(userMessageText, historyLength, persona.complexityKeywords)
    const modelId = MODEL_IDS[complexity]

    // 12. Create persona tools
    const tools = createPersonaTools(persona)

    // 13. Build messages for streamText
    const modelMessages = isUseChatMode
      ? await convertToModelMessages(messages as Parameters<typeof convertToModelMessages>[0])
      : [
          ...(conversationHistory ?? []).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          { role: 'user' as const, content: validation.sanitizedInput ?? (message as string) },
        ]

    // 14. Stream response
    const result = streamText({
      model: anthropic(modelId),
      messages: [...systemMessages, ...modelMessages],
      tools: Object.keys(tools).length > 0 ? tools : undefined,
      toolChoice: Object.keys(tools).length > 0 ? 'auto' : undefined,
      maxOutputTokens: persona.maxTokens,
      temperature: persona.temperature,
    })

    return result.toUIMessageStreamResponse({
      headers: CORS_HEADERS,
    })
  } catch (error) {
    // 15. Unexpected error handler
    console.error('[chatbot-engine] Unexpected error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500, headers: CORS_HEADERS })
  }
}
