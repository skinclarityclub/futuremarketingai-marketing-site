---
phase: 15-chatbot-engine-foundation
plan: 03
subsystem: api
tags: [anthropic, ai-sdk, chatbot, streaming, vercel-serverless, engine, barrel-exports]

requires:
  - phase: 15-01
    provides: Types, security, rate limiting, complexity detection modules
  - phase: 15-02
    provides: Topic router, prompt builder, persona router, tool executor modules
provides:
  - Engine orchestrator wiring all 7 chatbot modules into single handleChatRequest pipeline
  - Vercel serverless streaming endpoint at POST /api/chatbot using Web API pattern
  - Barrel exports for all chatbot modules from src/lib/chatbot/index.ts
  - CSP updated to remove api.openai.com (no longer needed)
affects:
  [16-chatbot-personas-knowledge, 17-chatwidget-ui-components, 18-chatbotspage-demo-playground]

tech-stack:
  added: []
  patterns:
    [
      Vercel Web API export pattern for streaming responses,
      Engine orchestrator pipeline pattern (validate -> rate limit -> persona -> route -> build -> detect -> stream),
      Barrel exports for module boundary,
    ]

key-files:
  created:
    - src/lib/chatbot/engine.ts
    - api/chatbot.ts
    - src/lib/chatbot/index.ts
  modified:
    - vercel.json

key-decisions:
  - 'maxOutputTokens used instead of maxTokens — AI SDK v6 renamed this parameter'
  - 'toTextStreamResponse used for simplicity — Phase 17 can switch to toUIMessageStreamResponse if useChat hook is adopted'

patterns-established:
  - 'Engine orchestrator: single handleChatRequest function wires all modules in sequence'
  - 'Vercel Web API: export default { async fetch(request) } for streaming Response support'
  - 'Barrel exports: src/lib/chatbot/index.ts re-exports all public APIs'

requirements-completed: [REQ-CHATBOT-ENGINE]

duration: 2min
completed: 2026-03-13
---

# Phase 15 Plan 03: Engine Orchestration and API Endpoint Summary

**Full chatbot pipeline wired into streaming Vercel endpoint with engine orchestrator, Web API pattern, and barrel exports**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-13T17:12:49Z
- **Completed:** 2026-03-13T17:15:33Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Engine orchestrator wires all 7 modules into a single pipeline: validate input -> rate limit -> load persona -> route topics -> build prompts -> detect complexity -> stream response
- Vercel serverless endpoint at /api/chatbot uses Web API export pattern (not legacy VercelRequest/VercelResponse) enabling streaming Response support
- Barrel exports from src/lib/chatbot/index.ts expose all public APIs (types, security, rate limiting, complexity, topics, prompts, personas, tools, engine)
- CSP connect-src cleaned up — removed api.openai.com since chatbot uses server-side Anthropic API

## Task Commits

Each task was committed atomically:

1. **Task 1: Create engine orchestrator** - `b85b4b1` (feat)
2. **Task 2: Create API endpoint, barrel exports, and update CSP** - `1bf3ef5` (feat)

## Files Created/Modified

- `src/lib/chatbot/engine.ts` - Core orchestration: handleChatRequest wires validate -> rate limit -> persona -> topics -> prompts -> complexity -> stream
- `api/chatbot.ts` - Thin Vercel serverless wrapper using Web API export pattern for streaming
- `src/lib/chatbot/index.ts` - Barrel exports for all chatbot modules (10 types, 15 functions/constants)
- `vercel.json` - Removed api.openai.com from CSP connect-src

## Decisions Made

- Used `maxOutputTokens` instead of `maxTokens` — AI SDK v6 renamed this parameter (discovered via type-checking)
- Used `toTextStreamResponse()` for simplicity per RESEARCH.md guidance — Phase 17 can switch to `toUIMessageStreamResponse()` if useChat hook is adopted (one-line change)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed AI SDK v6 parameter naming**

- **Found during:** Task 1 (engine.ts streamText call)
- **Issue:** Plan used `maxTokens` but AI SDK v6 renamed it to `maxOutputTokens`
- **Fix:** Changed `maxTokens: persona.maxTokens` to `maxOutputTokens: persona.maxTokens`
- **Files modified:** src/lib/chatbot/engine.ts
- **Verification:** `npx tsc --noEmit --skipLibCheck` passes clean
- **Committed in:** b85b4b1 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** API compatibility fix for AI SDK v6 parameter naming. No scope change.

## Issues Encountered

None beyond the AI SDK v6 parameter rename documented above.

## User Setup Required

None - ANTHROPIC_API_KEY environment variable must be set on Vercel for the endpoint to function in production, but this is a deployment concern, not a code setup requirement.

## Next Phase Readiness

- Complete chatbot engine pipeline ready for persona registration (Phase 16)
- Phase 16 calls registerPersona() to populate the registry, then POST /api/chatbot works end-to-end
- Phase 17 builds the chat widget UI that calls /api/chatbot
- All modules export from src/lib/chatbot/index.ts for clean imports

---

_Phase: 15-chatbot-engine-foundation_
_Completed: 2026-03-13_
