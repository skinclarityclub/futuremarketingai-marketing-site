# Phase 15: Chatbot Engine Foundation — Context

## Goal

Build a single API endpoint (`/api/chatbot`) that serves multiple chatbot personas with SSE streaming, dual-model routing (Haiku/Sonnet), prompt caching, tool calling, rate limiting, and security guardrails. This is the backend foundation all chatbot personas depend on.

## Design Reference

- Full design: `docs/plans/2026-03-13-chatbot-showcase-design.md`

## Architecture Decisions

### Single API + Persona Routing (Industry Standard)

- Single `POST /api/chatbot` endpoint
- `personaId` parameter determines: system prompt, tools, knowledge, model
- Benefits: unified rate limiting, shared infrastructure, single monitoring, simplified deployment
- Pattern validated by Botpress (workspace/bot IDs), Voiceflow (bot ID routing), and SKC Sindy (platform routing)

### Vercel AI SDK + @ai-sdk/anthropic

- `streamText()` for SSE streaming responses
- `toDataStreamResponse()` for proper SSE format
- Native tool calling support via `tools` parameter
- `toolChoice: 'auto'` lets Claude decide when to use tools

### Dual-Model Routing

- **Haiku 4.5** (80% of queries): ~180ms TTFT, $0.0008/1K input — default for demos
- **Sonnet 4** (20% complex): ~700ms TTFT, $0.003/1K input — complex reasoning/strategy
- Complexity detection: keyword matching + message length + conversation depth
- SKC pattern: medical/protocol keywords → smart, everything else → fast

### Hybrid Prompt Caching (SKC Pattern)

- **Static prefix** (~2500 tokens): Core persona + rules + platform modifiers → CACHED (90% savings)
- **Dynamic knowledge** (~2000-4000 tokens): Topic-router selected per request → NOT cached
- Uses Anthropic's `ephemeral` cache control (5-minute TTL)
- Break-even at ~10 calls with same system prompt
- For demos with 5-10 turns average: 15-25% cost savings

### Zero-Latency Topic Router (SKC Pattern)

- Keyword-based knowledge selection in <1ms, NO API call
- Define topics with keywords + priority
- Score: +1 per keyword match, +0.5 exact boundary, +0.3 conversation context carryover
- Select TOP 3 topics, combine knowledge content
- Each persona has its own topic definitions

### Tool Calling with Zod Validation

- Tools defined with Zod schemas (type-safe validation)
- Tool availability matrix gates tools per persona
- Central executor routes to persona-specific handlers
- Server-side validation of ALL tool inputs

### Rate Limiting

- **Session limit**: 15 messages per demo session (prevents cost explosion)
- **Global limit**: 100 requests/hour total
- **Per-IP limit**: 10 requests/minute
- Session tracking via generated sessionId in localStorage

### Security

- Input: max 500 chars, PII pattern blocking (SSN, credit card), competitor filtering
- Output: API key/email/internal ID redaction
- Prompt injection: structured tool schemas (Claude resists better), input validation
- Demo mode: no real integrations, no real data writes

## SKC Code to Reference

Key files from `C:\Users\daley\Desktop\skinclarityclub\src\lib\chatbot\`:

- `route.ts` (551 lines) — API endpoint, streaming, model routing, complexity detection
- `sindy-system.ts` (470 lines) — Static prefix builder, dynamic knowledge, hybrid caching
- `sindy-topic-router.ts` (510 lines) — Zero-latency topic selection algorithm
- `tools.ts` (263 lines) — Tool definitions with Zod, platform availability matrix
- `tool-executor.ts` (278 lines) — Unified tool routing, platform-specific handlers
- `types.ts` (266 lines) — Platform types, request/response types, tool definitions
- `rate-limiter.ts` — Multi-level rate limiting (IP, session, user)
- `error-handling.ts` — Error codes and graceful degradation

## Current FMai State (What Gets Replaced)

- `api/chat.ts` — OpenAI proxy (replaced by new `api/chatbot.ts`)
- `src/services/llmService.ts` — OpenAI integration with basic guardrails
- `src/utils/conversationEngine.ts` — Template-based response routing
- Uses GPT-4o-mini, no streaming, no real tool calling, no prompt caching

## Dependencies to Add

- `@ai-sdk/anthropic` — Anthropic provider for Vercel AI SDK
- `ai` — Vercel AI SDK core
- `zod` — Schema validation for tools

## Dependencies to Remove

- `openai` — No longer needed

## Cost Estimate

- 100 demo sessions/day × 30 days × $0.01 avg = $30/month
- With caching: ~$22/month
- With rate limiting: ~$15-20/month

## Files to Create

```
api/chatbot.ts                          — Vercel serverless endpoint
src/lib/chatbot/engine.ts               — Core engine orchestration
src/lib/chatbot/types.ts                — TypeScript types
src/lib/chatbot/persona-router.ts       — Persona config loading
src/lib/chatbot/topic-router.ts         — Zero-latency knowledge selection
src/lib/chatbot/prompt-builder.ts       — Hybrid prompt caching
src/lib/chatbot/tool-executor.ts        — Central tool execution
src/lib/chatbot/rate-limiter.ts         — Session + global + IP limits
src/lib/chatbot/security.ts             — Input/output validation
src/lib/chatbot/complexity-detector.ts  — Haiku vs Sonnet routing
src/lib/chatbot/index.ts                — Barrel exports
```
