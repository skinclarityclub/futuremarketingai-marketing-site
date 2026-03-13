---
phase: 16-chatbot-personas-knowledge
plan: 03
subsystem: chatbot
tags: [ai-sdk, personas, tools, zod, typescript, chatbot-engine]

requires:
  - phase: 15-chatbot-engine-foundation
    provides: Engine pipeline, persona-router, tool-executor stub, types
  - phase: 16-chatbot-personas-knowledge (plans 01-02)
    provides: 4 persona vertical slices (concierge, ecommerce, leadgen, support)
provides:
  - Demo-guide persona with Marketing Machine module knowledge and demo flow tools
  - Persona registry index triggering all 5 persona registrations via side-effect imports
  - Tool-executor wired to all 5 persona tool records via PERSONA_TOOLS map
  - Barrel exports for all persona configs and i18n starters
affects: [17-chatwidget-ui, 18-chatbotspage-demo, 19-homepage-concierge]

tech-stack:
  added: []
  patterns:
    - 'AnyToolRecord type alias for Tool<any, any> to bridge heterogeneous tool schemas'
    - 'Side-effect import chain: barrel -> personas/index -> 5x persona files -> registerPersona()'

key-files:
  created:
    - src/lib/chatbot/knowledge/demo-guide-kb.ts
    - src/lib/chatbot/tools/demo-guide-tools.ts
    - src/lib/chatbot/personas/demo-guide.ts
    - src/lib/chatbot/personas/index.ts
  modified:
    - src/lib/chatbot/tool-executor.ts
    - src/lib/chatbot/index.ts

key-decisions:
  - 'AnyToolRecord type (Tool<any, any>) used for PERSONA_TOOLS map — each persona has differently-typed Zod schemas, Record<string, ReturnType<typeof tool>> resolves to Tool<never, never> which rejects all concrete tools'
  - 'Barrel index.ts imports ./personas for side-effect registration — engine.ts not modified, consumers importing from chatbot barrel get personas automatically'

patterns-established:
  - 'PERSONA_TOOLS record pattern: persona ID string -> tool record, with nullish coalescing fallback to empty object'
  - 'Side-effect import chain for persona registration: import personas/index.ts triggers all registerPersona() calls'

requirements-completed: [REQ-CHATBOT-PERSONAS]

duration: 5min
completed: 2026-03-13
---

# Phase 16 Plan 03: Demo Guide Persona + Registry Wiring Summary

**Demo-guide persona with 7-module knowledge base, 4 tools (navigate/explain/ROI/book), persona registry index wiring all 5 personas into engine pipeline**

## Performance

- **Duration:** 5 min
- **Started:** 2026-03-13T18:03:17Z
- **Completed:** 2026-03-13T18:08:19Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments

- Demo-guide persona complete with MODULE_INFO for all 7 Marketing Machine modules, 5 topic definitions, and i18n starters (EN/NL/ES)
- All 5 personas wired into engine via PERSONA_TOOLS map in tool-executor.ts — createPersonaTools returns correct tools for any persona ID
- Barrel exports updated so any consumer importing from src/lib/chatbot gets persona registration + all configs/starters

## Task Commits

Each task was committed atomically:

1. **Task 1: Demo guide persona — knowledge base, tools, and persona config** - `5bd1966` (feat)
2. **Task 2: Persona registry index + tool-executor wiring + barrel exports** - `dab671f` (feat)

## Files Created/Modified

- `src/lib/chatbot/knowledge/demo-guide-kb.ts` - DEMO_GUIDE_TOPICS (5 topics) + MODULE_INFO (7 modules) for demo-guide persona
- `src/lib/chatbot/tools/demo-guide-tools.ts` - 4 tools: navigate_to_page, explain_module, get_roi_info, book_demo
- `src/lib/chatbot/personas/demo-guide.ts` - PersonaConfig + registerPersona() + DEMO_GUIDE_STARTERS in 3 languages
- `src/lib/chatbot/personas/index.ts` - Side-effect imports for 5 personas + re-exports of all configs and starters
- `src/lib/chatbot/tool-executor.ts` - PERSONA_TOOLS map wiring 5 persona IDs to tool records, createPersonaTools returns from map
- `src/lib/chatbot/index.ts` - Side-effect import of ./personas + re-export of all persona configs and starters

## Decisions Made

- Used `Tool<any, any>` type alias (AnyToolRecord) for the PERSONA_TOOLS map because `ReturnType<typeof tool>` resolves to `Tool<never, never>` which rejects all concrete tool instances with different Zod schemas
- Barrel index.ts imports `./personas` for side-effect registration rather than modifying engine.ts — any consumer importing from the chatbot barrel automatically gets all 5 personas registered

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed Tool type variance in PERSONA_TOOLS record**

- **Found during:** Task 2 (tool-executor wiring)
- **Issue:** `Record<string, ReturnType<typeof tool>>` resolves to `Record<string, Tool<never, never>>` — TypeScript rejects assigning concrete tool records with different Zod input schemas
- **Fix:** Created `AnyToolRecord = Record<string, Tool<any, any>>` type alias, used for PERSONA_TOOLS map and createPersonaTools return type
- **Files modified:** src/lib/chatbot/tool-executor.ts
- **Verification:** Full TypeScript compilation passes with zero errors
- **Committed in:** dab671f (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 bug)
**Impact on plan:** Type fix necessary for correctness. No scope creep.

## Issues Encountered

None beyond the type variance issue documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 personas registered and wired into engine pipeline
- createPersonaTools returns correct tool definitions for any persona ID
- Phase 17 (ChatWidget UI) can import persona configs and starters from src/lib/chatbot barrel
- Engine pipeline fully functional: POST /api/chatbot with personaId routes to correct persona + tools

---

_Phase: 16-chatbot-personas-knowledge_
_Completed: 2026-03-13_
