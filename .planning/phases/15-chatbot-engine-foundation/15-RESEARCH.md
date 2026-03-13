# Phase 15: Chatbot Engine Foundation - Research

**Researched:** 2026-03-13
**Domain:** AI chatbot backend — Vercel AI SDK streaming, Anthropic Claude, persona routing, tool calling
**Confidence:** HIGH

## Summary

This phase builds the shared chatbot backend engine that all personas (Phases 16-19) depend on. The architecture is well-defined by the CONTEXT.md decisions and validated by the SKC Sindy production codebase. The core stack is Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) with `streamText()` for SSE streaming, Zod for tool schema validation, and in-memory rate limiting (no Redis needed for a demo site).

A critical migration is required: the current `api/chat.ts` uses the legacy `@vercel/node` VercelRequest/VercelResponse pattern, which does NOT support streaming. The new `api/chatbot.ts` must use Vercel's Web API pattern (`export default { async fetch(request: Request) }`) that returns standard `Response` objects, enabling `toTextStreamResponse()` or `toUIMessageStreamResponse()` from the AI SDK.

**Primary recommendation:** Adapt the SKC Sindy architecture (hybrid prompt caching, topic router, tool availability matrix) to a multi-persona design. Use the Vercel Web API export pattern for streaming. Implement in-memory rate limiting instead of Upstash Redis to avoid external dependencies for a demo/showcase site.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Single `POST /api/chatbot` endpoint with `personaId` parameter routing
- Vercel AI SDK (`ai` + `@ai-sdk/anthropic`) with `streamText()` for SSE streaming
- Dual-model routing: Haiku 4.5 (80% default) / Sonnet 4 (20% complex)
- Hybrid prompt caching: static prefix (~2500 tokens, cached) + dynamic knowledge (topic-routed, not cached)
- Zero-latency topic router: keyword-based knowledge selection in <1ms, no API call
- Tool calling with Zod validation + tool availability matrix per persona
- Rate limiting: 15 messages/session, 100 requests/hour global, 10 requests/minute per-IP
- Security: max 500 chars input, PII blocking, output sanitization, prompt injection defense
- Dependencies to add: `@ai-sdk/anthropic`, `ai`, `zod`
- Dependencies to remove: `openai`
- File structure as defined in CONTEXT.md `## Files to Create` section

### Claude's Discretion

- Internal implementation details within each module
- Error message wording and fallback response content
- Complexity detector keyword lists and thresholds
- Specific PII regex patterns beyond the basics listed
- Topic router scoring weights and constants

### Deferred Ideas (OUT OF SCOPE)

- Persona-specific system prompts, tools, and knowledge (Phase 16)
- ChatWidget UI components (Phase 17)
- ChatbotsPage demo playground (Phase 18)
- Homepage concierge + ARIA replacement (Phase 19)
- Removal of old ARIA code (Phase 19)
- Real integrations (Shopify, databases) — demo mode only
  </user_constraints>

<phase_requirements>

## Phase Requirements

| ID                 | Description                                                                                                                                                                          | Research Support                                                                                                                                                                                            |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-CHATBOT-ENGINE | Build shared persona-driven chatbot backend: Vercel AI SDK streaming, Claude integration, prompt caching, tool calling framework, persona router, rate limiting, security guardrails | Full stack identified: `ai` + `@ai-sdk/anthropic` for streaming, `zod` for tool schemas, Vercel Web API pattern for serverless endpoint, SKC Sindy patterns for prompt caching/topic routing/tool execution |

</phase_requirements>

## Standard Stack

### Core

| Library             | Version       | Purpose                                                         | Why Standard                                                                                    |
| ------------------- | ------------- | --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| `ai`                | ^5.x (latest) | Vercel AI SDK core — `streamText()`, `tool()`, stream protocols | Official Vercel SDK, framework-agnostic, handles SSE streaming, tool calling, message protocols |
| `@ai-sdk/anthropic` | ^3.x (latest) | Anthropic Claude provider — model access, prompt caching        | Official Anthropic provider for AI SDK, supports `cacheControl` via `providerOptions`           |
| `zod`               | ^3.x          | Schema validation for tool inputs                               | De-facto TypeScript schema validation, native AI SDK integration via `inputSchema`              |

### Supporting

| Library        | Version                  | Purpose                               | When to Use                                                                    |
| -------------- | ------------------------ | ------------------------------------- | ------------------------------------------------------------------------------ |
| `@vercel/node` | ^5.x (already installed) | TypeScript types for Vercel functions | Already in devDependencies, provides types but NOT used for streaming endpoint |

### Alternatives Considered

| Instead of             | Could Use                    | Tradeoff                                                                                     |
| ---------------------- | ---------------------------- | -------------------------------------------------------------------------------------------- |
| `@ai-sdk/anthropic`    | `@anthropic-ai/sdk` (direct) | Direct SDK lacks AI SDK streaming integration, tool protocol, message format standardization |
| In-memory rate limiter | `@upstash/ratelimit` + Redis | Redis adds external dependency + cost for a demo site with low traffic; in-memory sufficient |
| Keyword topic router   | Embedding-based similarity   | Embedding adds latency (API call) and cost; keyword matching is <1ms and proven in SKC       |

**Installation:**

```bash
npm install ai @ai-sdk/anthropic zod
npm uninstall openai
```

## Architecture Patterns

### Recommended Project Structure

```
api/
└── chatbot.ts                          # Vercel serverless endpoint (Web API pattern)
src/lib/chatbot/
├── index.ts                            # Barrel exports
├── types.ts                            # TypeScript types (PersonaConfig, ChatRequest, etc.)
├── engine.ts                           # Core orchestration: persona loading → prompt building → streaming → tool execution
├── persona-router.ts                   # Persona config registry + validation
├── topic-router.ts                     # Zero-latency keyword-based knowledge selection
├── prompt-builder.ts                   # Hybrid prompt caching: static prefix + dynamic knowledge
├── tool-executor.ts                    # Central tool execution with persona gating
├── complexity-detector.ts              # Haiku vs Sonnet routing by message analysis
├── rate-limiter.ts                     # In-memory session + global + IP limits
└── security.ts                         # Input validation, PII blocking, output sanitization
```

### Pattern 1: Vercel Web API Serverless Endpoint (CRITICAL)

**What:** The new `api/chatbot.ts` MUST use the Vercel Web API export pattern, NOT the legacy `@vercel/node` VercelRequest/VercelResponse pattern.
**Why:** The legacy pattern does not support returning streaming `Response` objects. The AI SDK's `toTextStreamResponse()` and `toUIMessageStreamResponse()` return standard Web `Response` objects.
**Current state:** `api/chat.ts` uses legacy pattern (`export default async function handler(req: VercelRequest, res: VercelResponse)`).

```typescript
// api/chatbot.ts — CORRECT pattern for streaming
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export default {
  async fetch(request: Request): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: corsHeaders })
    }
    if (request.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 })
    }

    const body = await request.json()
    // ... validate, build prompt, select model ...

    const result = streamText({
      model: anthropic('claude-haiku-4-5'),
      system: systemPrompt,
      messages: body.conversationHistory,
      tools: personaTools,
      toolChoice: 'auto',
    })

    return result.toTextStreamResponse({
      headers: { ...corsHeaders },
    })
  },
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}
```

### Pattern 2: Hybrid Prompt Caching (from SKC)

**What:** Split system prompt into cached static prefix and uncached dynamic knowledge.
**When to use:** Every request — the static prefix contains persona identity and rules (~2500 tokens), cached by Anthropic for 5 minutes. Dynamic knowledge is topic-routed per user message.

```typescript
// Source: SKC sindy-system.ts adapted + ai-sdk.dev prompt caching docs
import { anthropic } from '@ai-sdk/anthropic'

// System messages array with cache control on static prefix
const systemMessages = [
  {
    role: 'system' as const,
    content: staticPrefix, // persona identity + rules (~2500 tokens)
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  },
  {
    role: 'system' as const,
    content: `## Relevant Knowledge:\n${dynamicKnowledge}`,
    // No cacheControl — changes per request
  },
]
```

### Pattern 3: Tool Definition with AI SDK `tool()` Helper

**What:** Define tools using the AI SDK's `tool()` helper with Zod schemas and execute functions.
**When to use:** For every tool definition — provides type safety, validation, and automatic execution within `streamText`.

```typescript
// Source: ai-sdk.dev tool() reference
import { tool } from 'ai'
import { z } from 'zod'

const personaTools = {
  get_services: tool({
    description: 'Get information about FMai services',
    inputSchema: z.object({
      serviceType: z
        .enum(['automations', 'chatbots', 'voice-agents'])
        .describe('The type of service to look up'),
    }),
    execute: async ({ serviceType }) => {
      // Return mock/static data for demo
      return getServiceData(serviceType)
    },
  }),
}
```

### Pattern 4: Persona Router (Adapted from SKC Platform Detection)

**What:** Single endpoint receives `personaId` in request body, loads corresponding persona config (system prompt, tools, knowledge, model preference).
**When to use:** Every request — the persona router is the first step in the engine pipeline.

```typescript
// Persona config interface
interface PersonaConfig {
  id: string
  name: string
  staticPrefix: string // Cached system prompt portion
  topicDefinitions: TopicDef[] // For topic router
  tools: Record<string, Tool> // Available tools for this persona
  defaultModel: 'haiku' | 'sonnet'
  complexityKeywords?: string[] // Override complexity detector
  maxTokens: number
  temperature: number
}

// Registry pattern
const PERSONA_REGISTRY = new Map<string, PersonaConfig>()

export function getPersona(personaId: string): PersonaConfig {
  const persona = PERSONA_REGISTRY.get(personaId)
  if (!persona) throw new PersonaNotFoundError(personaId)
  return persona
}

export function registerPersona(config: PersonaConfig): void {
  PERSONA_REGISTRY.set(config.id, config)
}
```

### Pattern 5: Dual-Model Complexity Routing (from SKC)

**What:** Analyze user message to decide Haiku (fast/cheap) vs Sonnet (powerful/expensive).
**When to use:** Before every `streamText` call — most queries route to Haiku, complex ones to Sonnet.

```typescript
// Source: SKC route.ts complexity detection pattern
const COMPLEX_KEYWORDS = [
  'strategy',
  'compare',
  'analyze',
  'explain in detail',
  'pros and cons',
  'architecture',
  'integration',
  'strategie',
  'vergelijk',
  'analyseer',
]

export function detectComplexity(message: string, conversationDepth: number): 'haiku' | 'sonnet' {
  const lower = message.toLowerCase()

  // Keyword match
  if (COMPLEX_KEYWORDS.some((kw) => lower.includes(kw))) return 'sonnet'

  // Long message (>200 chars suggests complex question)
  if (message.length > 200) return 'sonnet'

  // Deep conversation (>8 turns suggests complex topic)
  if (conversationDepth > 8) return 'sonnet'

  return 'haiku'
}
```

### Pattern 6: In-Memory Rate Limiter (Demo-Appropriate)

**What:** Rate limiting without external Redis dependency, using in-memory maps with TTL cleanup.
**Why not Redis:** This is a demo/showcase site, not production SaaS. In-memory is sufficient and avoids Upstash costs/configuration. SKC uses Upstash because it handles real users — FMai demos do not.

```typescript
// Sliding window rate limiter using Map
const windows = new Map<string, { count: number; resetAt: number }>()

export function checkRateLimit(
  identifier: string,
  maxRequests: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = windows.get(identifier)

  if (!entry || now > entry.resetAt) {
    windows.set(identifier, { count: 1, resetAt: now + windowMs })
    return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs }
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt }
}

// Periodic cleanup to prevent memory leaks
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of windows) {
    if (now > entry.resetAt) windows.delete(key)
  }
}, 60_000)
```

### Anti-Patterns to Avoid

- **Using VercelRequest/VercelResponse for streaming:** The legacy `@vercel/node` handler pattern cannot return streaming Response objects. MUST use Web API export pattern.
- **Caching the entire system prompt:** Cache only the static prefix. Dynamic knowledge changes per request and must NOT have `cacheControl`.
- **One giant system prompt file:** Split persona + knowledge into separate concerns. SKC learned this: a 6000-token prompt with everything crammed in caused "lost-in-the-middle" degradation.
- **Embedding-based topic routing:** Adds latency and cost. Keyword matching is <1ms and sufficient for demo scenarios.
- **Session state in serverless memory:** Serverless functions are stateless between invocations. Session/conversation history must come from the client request body (as `conversationHistory` array).
- **Parallel tool calls without gating:** Tool availability must be checked per persona before execution. Not all tools are available to all personas.

## Don't Hand-Roll

| Problem                | Don't Build                                  | Use Instead                           | Why                                                                             |
| ---------------------- | -------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------- |
| SSE streaming protocol | Custom SSE implementation with `res.write()` | `streamText().toTextStreamResponse()` | Protocol is complex (data framing, error handling, keep-alive, backpressure)    |
| Tool schema validation | Manual `typeof` / `if` checks                | Zod schemas with `tool()` helper      | Runtime type safety, automatic error messages, self-documenting for Claude      |
| Anthropic API client   | Raw `fetch()` to Anthropic API               | `@ai-sdk/anthropic` provider          | Handles auth, retries, streaming parsing, error mapping, prompt caching headers |
| Message protocol       | Custom JSON streaming format                 | AI SDK data stream protocol (SSE)     | Standardized format that `useChat` hook consumes on client side                 |
| Model ID management    | Hardcoded model strings                      | Constants map with model aliases      | Model IDs change with releases; centralized mapping eases updates               |

**Key insight:** The AI SDK abstracts the hardest parts — streaming, tool calling protocol, model switching — into a 5-line `streamText()` call. Hand-rolling any of this wastes effort and introduces fragile protocol implementation bugs.

## Common Pitfalls

### Pitfall 1: Wrong Vercel Export Pattern

**What goes wrong:** Using `export default async function handler(req: VercelRequest, res: VercelResponse)` like the current `api/chat.ts` — streaming silently fails or buffers the entire response before sending.
**Why it happens:** Developer copies existing endpoint pattern without realizing it doesn't support streaming Response objects.
**How to avoid:** Use the Web API pattern: `export default { async fetch(request: Request): Promise<Response> }`. Verify streaming works by checking the response `Content-Type` is `text/event-stream` and response arrives incrementally.
**Warning signs:** Response arrives all at once (no streaming), or endpoint returns 500 errors with `res.write is not a function`.

### Pitfall 2: Prompt Cache Invalidation

**What goes wrong:** Cache savings never materialize because the static prefix keeps changing between requests.
**Why it happens:** Including dynamic content (user context, timestamp, message count) in the cached portion. Even one character change invalidates the entire cache.
**How to avoid:** Static prefix must be BYTE-FOR-BYTE identical across requests for the same persona. Only persona identity + rules + platform modifier go in the cached part. Everything dynamic goes in separate uncached system messages.
**Warning signs:** `cacheCreationInputTokens` appears on every request in `providerMetadata.anthropic` (should only appear on first request, then `cacheReadInputTokens` on subsequent ones within 5-minute TTL).

### Pitfall 3: Haiku Minimum Cache Token Threshold

**What goes wrong:** Prompt caching silently does nothing with Haiku because the static prefix is too short.
**Why it happens:** Claude Haiku 4.5 requires a minimum of 4096 tokens for prompt caching (vs 1024 for Sonnet). A ~2500 token static prefix is below Haiku's threshold.
**How to avoid:** For Haiku, either: (a) accept no caching on Haiku calls (still cheap at $0.0008/1K input), or (b) pad the static prefix to >4096 tokens by including more persona context. Option (a) is pragmatic — Haiku is already cheap enough that caching savings are marginal.
**Warning signs:** No `cacheReadInputTokens` in Haiku response metadata even after multiple identical requests.

### Pitfall 4: Serverless Statelessness

**What goes wrong:** Rate limiter state, session tracking, or conversation history stored in module-level variables resets between invocations.
**Why it happens:** Vercel serverless functions are ephemeral — each invocation may run in a fresh container. Module-level state persists only within warm function instances.
**How to avoid:** Accept that in-memory rate limiting is "best effort" for a demo site. Conversation history comes from the client request body. Session message count tracked client-side in localStorage. For stricter rate limiting, use the IP-based approach (checked per request, no cross-request state needed).
**Warning signs:** Rate limits never trigger even with rapid requests, or conversation history resets unexpectedly.

### Pitfall 5: CORS Configuration for Streaming

**What goes wrong:** Browser blocks SSE stream from `/api/chatbot` due to CORS.
**Why it happens:** SSE responses need proper CORS headers on both the OPTIONS preflight and the streaming response itself.
**How to avoid:** Set CORS headers on the streaming response: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods: POST, OPTIONS`, `Access-Control-Allow-Headers: Content-Type`. Handle OPTIONS preflight explicitly.
**Warning signs:** Browser console shows CORS errors, streaming connection fails before first byte.

### Pitfall 6: CSP Header Blocking Anthropic API

**What goes wrong:** After migrating from OpenAI to Anthropic, API calls from the serverless function succeed but the existing `connect-src` CSP header in `vercel.json` still references `api.openai.com`.
**Why it happens:** CSP `connect-src` was configured for OpenAI; the migration swaps the backend but the header isn't updated.
**How to avoid:** The serverless function calls Anthropic API server-side, so `connect-src` doesn't need `api.anthropic.com` (browser never connects directly). But `api.openai.com` should be removed from CSP to clean up. The client connects to `/api/chatbot` (same-origin), which IS allowed by `'self'`.
**Warning signs:** No actual failure (server-side calls bypass CSP), but stale CSP config signals incomplete migration.

## Code Examples

### Complete Engine Orchestration Flow

```typescript
// Source: Adapted from SKC route.ts + AI SDK docs
import { streamText, tool } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

export async function handleChatRequest(request: Request): Promise<Response> {
  const body = await request.json()
  const { personaId, message, sessionId, conversationHistory, context } = body

  // 1. Validate input
  const validation = validateInput(message)
  if (!validation.valid) {
    return Response.json({ error: validation.reason }, { status: 400 })
  }

  // 2. Check rate limits
  const ip = getIpFromHeaders(request.headers)
  const rateCheck = checkAllRateLimits(sessionId, ip)
  if (!rateCheck.allowed) {
    return Response.json({ error: 'rate_limited', resetAt: rateCheck.resetAt }, { status: 429 })
  }

  // 3. Load persona config
  const persona = getPersona(personaId)

  // 4. Route to knowledge via topic router
  const topicResult = routeToKnowledge(message, persona.topicDefinitions)

  // 5. Build system messages with prompt caching
  const systemMessages = buildSystemMessages(persona, topicResult, context)

  // 6. Detect complexity for model routing
  const modelId =
    detectComplexity(message, conversationHistory?.length ?? 0) === 'sonnet'
      ? 'claude-sonnet-4-20250514'
      : 'claude-haiku-4-5-20250514'

  // 7. Stream response
  const result = streamText({
    model: anthropic(modelId),
    messages: [
      ...systemMessages,
      ...(conversationHistory ?? []),
      { role: 'user', content: message },
    ],
    tools: persona.tools,
    toolChoice: 'auto',
    maxTokens: persona.maxTokens,
    temperature: persona.temperature,
  })

  return result.toTextStreamResponse({
    headers: corsHeaders,
  })
}
```

### Prompt Cache System Messages

```typescript
// Source: ai-sdk.dev Anthropic provider docs + SKC sindy-system.ts
import type { ModelMessage } from 'ai'

export function buildSystemMessages(
  persona: PersonaConfig,
  topicResult: TopicRouterResult,
  context?: { language?: string; currentPage?: string }
): ModelMessage[] {
  const messages: ModelMessage[] = []

  // Part 1: Static prefix (CACHED by Anthropic)
  messages.push({
    role: 'system',
    content: persona.staticPrefix,
    providerOptions: {
      anthropic: { cacheControl: { type: 'ephemeral' } },
    },
  })

  // Part 2: Dynamic knowledge (NOT cached, changes per request)
  if (topicResult.knowledgeContent) {
    messages.push({
      role: 'system',
      content: `## Relevant Knowledge:\n${topicResult.knowledgeContent}`,
    })
  }

  // Part 3: Request context (NOT cached)
  if (context) {
    messages.push({
      role: 'system',
      content: `## Context:\n- Language: ${context.language ?? 'en'}\n- Page: ${context.currentPage ?? 'unknown'}`,
    })
  }

  return messages
}
```

### Topic Router (Adapted from SKC)

```typescript
// Source: SKC sindy-topic-router.ts
export interface TopicDefinition {
  key: string
  content: string
  keywords: string[]
  priority: number
}

export function routeToKnowledge(
  message: string,
  topics: TopicDefinition[],
  conversationTopics?: string[]
): TopicRouterResult {
  const lower = message.toLowerCase()
  const scores: Array<{ topic: TopicDefinition; score: number }> = []

  for (const topic of topics) {
    let score = 0
    for (const keyword of topic.keywords) {
      if (lower.includes(keyword.toLowerCase())) {
        score += 1
        // Bonus for exact word boundary match
        const regex = new RegExp(`\\b${escapeRegex(keyword)}\\b`, 'i')
        if (regex.test(message)) score += 0.5
      }
    }
    // Context carryover bonus
    if (conversationTopics?.includes(topic.key)) score += 0.3

    if (score >= 1) scores.push({ topic, score })
  }

  scores.sort((a, b) => b.score - a.score || b.topic.priority - a.topic.priority)

  const selected = scores.slice(0, 3)
  return {
    topics: selected.map((s) => s.topic.key),
    knowledgeContent: selected.map((s) => s.topic.content).join('\n\n'),
    estimatedTokens: Math.ceil(selected.reduce((acc, s) => acc + s.topic.content.length, 0) / 4),
  }
}
```

## State of the Art

| Old Approach                                | Current Approach                     | When Changed          | Impact                                                                            |
| ------------------------------------------- | ------------------------------------ | --------------------- | --------------------------------------------------------------------------------- |
| `@vercel/node` VercelRequest/VercelResponse | Web API `export default { fetch() }` | Vercel 2024-2025      | Required for streaming Response objects                                           |
| `providerMetadata` for cache control        | `providerOptions` for cache control  | AI SDK v5 (2025-2026) | Property name change; `providerMetadata` still works but deprecated               |
| `parameters` in tool definition             | `inputSchema` in tool definition     | AI SDK v5 (2025-2026) | `parameters` still works but `inputSchema` is the new standard                    |
| `toDataStreamResponse()`                    | `toUIMessageStreamResponse()`        | AI SDK v5 (2025-2026) | New method name for data stream protocol; `toTextStreamResponse()` for plain text |
| `openai('gpt-4o-mini')` model strings       | `anthropic('claude-haiku-4-5')`      | Project decision      | Switching provider from OpenAI to Anthropic                                       |

**Deprecated/outdated:**

- `openai` package: Being removed from project — replaced by `@ai-sdk/anthropic`
- `api/chat.ts`: Legacy endpoint being replaced by `api/chatbot.ts`
- `src/services/llmService.ts`: Will be obsoleted by `src/lib/chatbot/engine.ts`
- `providerMetadata` in AI SDK: Use `providerOptions` instead (newer API)

## Open Questions

1. **toTextStreamResponse vs toUIMessageStreamResponse**
   - What we know: `toTextStreamResponse()` returns plain text stream. `toUIMessageStreamResponse()` returns data stream protocol with tool calls, reasoning, etc.
   - What's unclear: Whether the client-side code (Phase 17) will use `useChat` hook (which expects data stream protocol) or a custom stream consumer. This affects which response method to use.
   - Recommendation: Start with `toTextStreamResponse()` for simplicity. It works with any client-side consumer. Upgrade to `toUIMessageStreamResponse()` in Phase 17 if `useChat` is adopted (the hook auto-consumes data streams). The endpoint switch is a one-line change.

2. **AI SDK Version: v4 (stable) vs v5 (latest)**
   - What we know: AI SDK v5 (released Feb 2026) introduced `inputSchema`, `toUIMessageStreamResponse`, `ModelMessage`, and `providerOptions`. The npm `ai` package latest is v5.x.
   - What's unclear: Whether there are breaking changes that affect the patterns documented here.
   - Recommendation: Install latest `ai` (v5.x). Use v5 API names (`inputSchema`, `providerOptions`). If any break, v4 names (`parameters`, `providerMetadata`) still work as aliases.

3. **Anthropic Model IDs**
   - What we know: Provider docs show `anthropic('claude-haiku-4-5')` and `anthropic('claude-sonnet-4-5')` as shorthand. Full model IDs like `claude-haiku-4-5-20250514` may be needed for pinning.
   - What's unclear: Exact model ID format for the latest Haiku 4.5 and Sonnet 4.
   - Recommendation: Use shorthand (`claude-haiku-4-5`, `claude-sonnet-4-5`) and let the provider resolve to latest. Pin to specific dated IDs only if response quality issues arise.

4. **vercel.json CSP Update**
   - What we know: Current CSP `connect-src` includes `https://api.openai.com`. Server-side API calls bypass CSP (browser never calls Anthropic directly).
   - What's unclear: Whether removing `api.openai.com` from CSP will break anything else in the codebase.
   - Recommendation: Remove `api.openai.com` from CSP `connect-src` when the `openai` package is uninstalled. No replacement needed since Claude calls happen server-side.

## Sources

### Primary (HIGH confidence)

- [ai-sdk.dev — streamText reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/stream-text) — `streamText()` API, parameters, return value methods
- [ai-sdk.dev — Anthropic provider](https://ai-sdk.dev/providers/ai-sdk-providers/anthropic) — Provider setup, model IDs, prompt caching with `providerOptions`
- [ai-sdk.dev — tool() reference](https://ai-sdk.dev/docs/reference/ai-sdk-core/tool) — Tool definition with Zod `inputSchema` and `execute`
- [ai-sdk.dev — Dynamic Prompt Caching cookbook](https://ai-sdk.dev/cookbook/node/dynamic-prompt-caching) — `addCacheControlToMessages` utility, `prepareStep` pattern
- [ai-sdk.dev — Stream Protocols](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) — Data stream protocol (SSE format), `toUIMessageStreamResponse`, `toTextStreamResponse`
- [Vercel Streaming Functions docs](https://vercel.com/docs/functions/streaming-functions) — Web API export pattern, `toTextStreamResponse()` usage
- [Vercel Functions Quickstart](https://vercel.com/docs/functions/quickstart) — `export default { async fetch() }` pattern for framework=other
- SKC Sindy codebase (`C:\Users\daley\Desktop\skinclarityclub\src\lib\chatbot\`) — Production-validated patterns for hybrid caching, topic routing, tool execution, rate limiting

### Secondary (MEDIUM confidence)

- [npm @ai-sdk/anthropic](https://www.npmjs.com/package/@ai-sdk/anthropic) — Latest version 3.0.58, verified available
- [Vercel Blog — AI SDK 5](https://vercel.com/blog/ai-sdk-5) — v5 release notes, new API names

### Tertiary (LOW confidence)

- Haiku 4.5 minimum cache token threshold (4096 tokens) — sourced from web search, not verified against current Anthropic docs. May have changed.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — Verified via official AI SDK docs and npm
- Architecture: HIGH — Patterns validated by SKC production codebase + official docs
- Pitfalls: HIGH — Endpoint pattern pitfall verified by Vercel docs; cache pitfall from SKC experience

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (30 days — stable stack, well-documented)
