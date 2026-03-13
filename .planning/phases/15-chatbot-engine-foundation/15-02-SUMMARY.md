---
phase: 15-chatbot-engine-foundation
plan: 02
subsystem: api
tags: [anthropic, ai-sdk, chatbot, prompt-caching, topic-routing, persona, tool-calling, zod]

requires:
  - phase: 15-01
    provides: TypeScript types (PersonaConfig, TopicDefinition, TopicRouterResult)
provides:
  - Zero-latency keyword-based topic router selecting top 3 knowledge topics
  - Hybrid prompt caching system message builder (cached static prefix + uncached dynamic)
  - Map-based persona registry with register/get/has/list operations
  - Tool executor factory with persona gating and AI SDK v6 tool() reference pattern
affects: [15-03, 16-chatbot-personas-knowledge, 17-chatwidget-ui-components]

tech-stack:
  added: []
  patterns:
    [
      keyword scoring topic selection,
      hybrid prompt caching with ephemeral cache control,
      persona registry pattern,
      AI SDK v6 inputSchema tool pattern,
    ]

key-files:
  created:
    - src/lib/chatbot/topic-router.ts
    - src/lib/chatbot/prompt-builder.ts
    - src/lib/chatbot/persona-router.ts
    - src/lib/chatbot/tool-executor.ts
  modified: []

key-decisions:
  - 'AI SDK v6 uses inputSchema (not parameters) for tool() definitions — DEMO_TOOL updated accordingly'
  - 'Map.forEach pattern continued from 15-01 to avoid downlevelIteration requirement'

patterns-established:
  - 'Topic router: +1 keyword match, +0.5 word boundary bonus, +0.3 context carryover — top 3 selected'
  - 'Prompt builder: Part 1 (static, cached) + Part 2 (dynamic knowledge, uncached) + Part 3 (context, uncached)'
  - 'Persona registry: module-level Map, personas registered by Phase 16 persona modules'
  - 'Tool executor: createPersonaTools factory returns AI SDK tool() objects, executeToolCall gates by persona'

requirements-completed: [REQ-CHATBOT-ENGINE]

duration: 5min
completed: 2026-03-13
---

# Phase 15 Plan 02: Persona Infrastructure Modules Summary

**Keyword-scored topic router, hybrid-cached prompt builder, Map-based persona registry, and AI SDK v6 tool executor with Zod validation**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-13T17:04:48Z
- **Completed:** 2026-03-13T17:10:19Z
- **Tasks:** 2
- **Files modified:** 4

## Accomplishments

- Topic router scores keywords (+1 match, +0.5 boundary, +0.3 context) and selects top 3 topics in under 1ms
- Prompt builder creates system messages with ephemeral cache control on static prefix only (byte-for-byte identical per persona)
- Persona router provides Map-based registry infrastructure ready for Phase 16 persona registration
- Tool executor establishes createPersonaTools factory and executeToolCall with persona gating, plus DEMO_TOOL reference

## Task Commits

Each task was committed atomically:

1. **Task 1: Create topic router and prompt builder** - `f3db465` (feat)
2. **Task 2: Create persona router and tool executor** - `5d63ee6` (feat)

## Files Created/Modified

- `src/lib/chatbot/topic-router.ts` - Zero-latency keyword-based knowledge selection with scoring and top-3 filtering
- `src/lib/chatbot/prompt-builder.ts` - Hybrid prompt caching system message builder (cached static + uncached dynamic + uncached context)
- `src/lib/chatbot/persona-router.ts` - Map-based persona registry with register/get/has/list operations and input validation
- `src/lib/chatbot/tool-executor.ts` - Tool factory and executor with persona gating, plus DEMO_TOOL AI SDK v6 reference pattern

## Decisions Made

- AI SDK v6 uses `inputSchema` instead of `parameters` for `tool()` definitions -- DEMO_TOOL updated to use the correct v6 API
- Map.forEach pattern continued from Plan 01 to avoid downlevelIteration tsconfig requirement in persona registry

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed AI SDK v6 tool() API change**

- **Found during:** Task 2 (tool-executor.ts DEMO_TOOL)
- **Issue:** Plan specified `parameters` property for tool() but AI SDK v6 uses `inputSchema`
- **Fix:** Changed `parameters: z.object(...)` to `inputSchema: z.object(...)` in DEMO_TOOL
- **Files modified:** src/lib/chatbot/tool-executor.ts
- **Verification:** `npx tsc --noEmit --skipLibCheck` passes clean
- **Committed in:** 5d63ee6 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** API compatibility fix for AI SDK v6. No scope change.

## Issues Encountered

None beyond the AI SDK v6 API change documented above.

## User Setup Required

None - no external service configuration required for these infrastructure modules.

## Next Phase Readiness

- All 4 persona infrastructure modules compile cleanly and export correct interfaces
- Plan 03 (engine.ts + API endpoint) can import from all modules
- Phase 16 can call registerPersona() to populate the registry
- DEMO_TOOL shows the correct AI SDK v6 tool() + Zod pattern for Phase 16 implementers

---

_Phase: 15-chatbot-engine-foundation_
_Completed: 2026-03-13_
