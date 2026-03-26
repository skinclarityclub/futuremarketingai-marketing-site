---
phase: 15-chatbot-engine-foundation
plan: 01
subsystem: api
tags: [anthropic, ai-sdk, zod, chatbot, rate-limiting, security, typescript]

requires:
  - phase: none
    provides: greenfield chatbot module
provides:
  - TypeScript type contracts for chatbot engine (ChatRequest, ChatResponse, PersonaConfig, etc.)
  - Input validation and output sanitization (security.ts)
  - 3-level in-memory rate limiting (session/global/IP)
  - Complexity-based dual-model routing (Haiku/Sonnet)
  - ai, @ai-sdk/anthropic, zod dependencies
affects: [15-02, 15-03, 16-chatbot-personas-knowledge, 17-chatwidget-ui-components]

tech-stack:
  added: [ai (Vercel AI SDK), '@ai-sdk/anthropic', zod]
  patterns: [sliding-window rate limiting, PII pattern blocking, keyword-based complexity detection]

key-files:
  created:
    - src/lib/chatbot/types.ts
    - src/lib/chatbot/security.ts
    - src/lib/chatbot/rate-limiter.ts
    - src/lib/chatbot/complexity-detector.ts
  modified:
    - package.json

key-decisions:
  - 'Map.forEach used instead of for-of iteration for Map — avoids downlevelIteration tsconfig requirement'
  - 'MODEL_IDS uses shorthand IDs (claude-haiku-4-5, claude-sonnet-4-5) — provider resolves to latest'

patterns-established:
  - 'Chatbot modules import types from ./types — central type contract'
  - 'Rate limiter uses in-memory Map with SSR-safe setInterval cleanup'
  - 'Security validation returns SecurityValidation object with reason string'

requirements-completed: [REQ-CHATBOT-ENGINE]

duration: 3min
completed: 2026-03-13
---

# Phase 15 Plan 01: Types, Security, Rate Limiting, Complexity Summary

**Chatbot foundation modules with TypeScript types, PII-blocking input validation, 3-level sliding-window rate limiter, and Haiku/Sonnet complexity routing**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-13T16:58:48Z
- **Completed:** 2026-03-13T17:01:55Z
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- Installed ai, @ai-sdk/anthropic, zod dependencies for chatbot engine
- Created complete TypeScript type contract (8 types/interfaces) shared by all chatbot modules
- Input validation blocks messages over 500 chars and 4 PII patterns (SSN, CC, email, phone)
- Output sanitization redacts API keys and internal email domains
- 3-level rate limiting: session (15 msg/hr), global (100 req/hr), IP (10 req/min)
- Complexity detector routes to Haiku (default) or Sonnet based on keywords (EN/NL/ES), message length, conversation depth

## Task Commits

Each task was committed atomically:

1. **Task 1: Install dependencies and create TypeScript types** - `d9adeb6` (feat)
2. **Task 2: Create security module and rate limiter** - `25317bb` (feat)
3. **Task 3: Create complexity detector** - `427f0aa` (feat)

## Files Created/Modified

- `src/lib/chatbot/types.ts` - All shared type definitions (ComplexityLevel, ChatRequest, ChatResponse, PersonaConfig, TopicDefinition, TopicRouterResult, RateLimitResult, SecurityValidation)
- `src/lib/chatbot/security.ts` - Input validation (length, PII) and output sanitization (API keys, internal emails)
- `src/lib/chatbot/rate-limiter.ts` - In-memory sliding window rate limiting with 3 levels and SSR-safe cleanup
- `src/lib/chatbot/complexity-detector.ts` - Keyword-based model routing with MODEL_IDS constant map
- `package.json` - Added ai, @ai-sdk/anthropic, zod dependencies

## Decisions Made

- Used Map.forEach instead of for-of iteration to avoid needing downlevelIteration tsconfig flag
- MODEL_IDS uses shorthand model IDs (claude-haiku-4-5, claude-sonnet-4-5) per RESEARCH.md guidance

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed Map iteration TypeScript error**

- **Found during:** Task 2 (rate-limiter.ts cleanup interval)
- **Issue:** `for...of` on Map requires `--downlevelIteration` or ES2015+ target
- **Fix:** Replaced `for (const [key, entry] of rateLimitStore)` with `rateLimitStore.forEach((entry, key) => ...)`
- **Files modified:** src/lib/chatbot/rate-limiter.ts
- **Verification:** `npx tsc --noEmit --skipLibCheck` passes clean
- **Committed in:** 25317bb (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Minimal — TypeScript compatibility fix, no scope change.

## Issues Encountered

None beyond the Map iteration fix documented above.

## User Setup Required

None - no external service configuration required for these foundation modules. API key setup will be needed in Plan 02 (engine.ts) or Plan 03 (API endpoint).

## Next Phase Readiness

- All 4 foundation modules compile cleanly and export correct interfaces
- Plan 02 (topic router, prompt builder, tool executor) can import from types.ts
- Plan 03 (engine + API endpoint) can import from all modules
- Dependencies (ai, @ai-sdk/anthropic, zod) installed and available

## Self-Check: PASSED

- All 4 source files exist on disk
- All 3 task commits verified in git log

---

_Phase: 15-chatbot-engine-foundation_
_Completed: 2026-03-13_
