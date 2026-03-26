---
phase: 16-chatbot-personas-knowledge
plan: 01
subsystem: chatbot
tags: [ai-sdk, zod, personas, knowledge-base, tools, i18n]

requires:
  - phase: 15-chatbot-engine-foundation
    provides: PersonaConfig interface, registerPersona(), tool-executor pattern, topic-router
provides:
  - Concierge persona with FMai service knowledge, pricing, process, case studies
  - E-commerce persona with skincare product catalog, routine building, ingredient glossary
  - 8 AI SDK v6 tool definitions (4 per persona) with Zod 4 inputSchema
  - i18n conversation starters (EN/NL/ES) for both personas
affects:
  [17-chatwidget-ui-components, 18-chatbotspage-demo-playground, 19-homepage-concierge-demo-guide]

tech-stack:
  added: []
  patterns: [persona-vertical-slice, knowledge-topic-definitions, tool-catalog-pattern]

key-files:
  created:
    - src/lib/chatbot/knowledge/concierge-kb.ts
    - src/lib/chatbot/tools/concierge-tools.ts
    - src/lib/chatbot/personas/concierge.ts
    - src/lib/chatbot/knowledge/ecommerce-kb.ts
    - src/lib/chatbot/tools/ecommerce-tools.ts
    - src/lib/chatbot/personas/ecommerce.ts
  modified: []

key-decisions:
  - 'Persona vertical slice pattern: knowledge-kb.ts + tools.ts + persona.ts per persona'
  - 'PRODUCT_CATALOG exported as typed array for tool handler querying'
  - 'Tool names in persona.tools record match tool export keys for tool-executor validation'

patterns-established:
  - 'Persona vertical slice: knowledge/ + tools/ + personas/ directories with consistent naming'
  - 'Knowledge topics: TopicDefinition[] with non-overlapping keywords and priority ordering'
  - 'Tool pattern: AI SDK v6 tool() with Zod 4 inputSchema, static/mock execute handlers'
  - 'Persona config: registerPersona() called at module scope as side-effect on import'
  - 'i18n starters: Record<string, string[]> with en/nl/es keys'

requirements-completed: [REQ-CHATBOT-PERSONAS]

duration: 7min
completed: 2026-03-13
---

# Phase 16 Plan 01: Chatbot Personas and Knowledge Summary

**Concierge and e-commerce persona vertical slices with 6 topic definitions, 8 product catalog, 8 AI SDK v6 tools, and tri-lingual conversation starters**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-13T17:53:07Z
- **Completed:** 2026-03-13T18:00:24Z
- **Tasks:** 2
- **Files created:** 6

## Accomplishments

- Concierge persona with 6 FMai knowledge topics (services, pricing, process, case studies, about, contact) and 4 tools (get_services, book_call, navigate_to_page, get_case_study)
- E-commerce persona with 8-product skincare catalog, 4 knowledge topics (products, skin types, routines, ingredients), and 4 tools (search_products, get_product_details, build_routine, add_to_cart_suggestion)
- Both personas register via registerPersona() side-effect with conforming PersonaConfig interface
- Tri-lingual conversation starters (EN/NL/ES) for both personas

## Task Commits

Each task was committed atomically:

1. **Task 1: Concierge persona** - `45648f0` (feat)
2. **Task 2: E-commerce persona** - `b43d1ac` (feat + style)

## Files Created

- `src/lib/chatbot/knowledge/concierge-kb.ts` - 6 TopicDefinition[] for FMai services, pricing, process, case studies, about, contact
- `src/lib/chatbot/tools/concierge-tools.ts` - 4 AI SDK v6 tools: get_services, book_call, navigate_to_page, get_case_study
- `src/lib/chatbot/personas/concierge.ts` - PersonaConfig with system prompt, registerPersona side-effect, CONCIERGE_STARTERS
- `src/lib/chatbot/knowledge/ecommerce-kb.ts` - Product interface, PRODUCT_CATALOG (8 products), 4 TopicDefinition[] for skincare domain
- `src/lib/chatbot/tools/ecommerce-tools.ts` - 4 AI SDK v6 tools: search_products, get_product_details, build_routine, add_to_cart_suggestion
- `src/lib/chatbot/personas/ecommerce.ts` - PersonaConfig with skincare advisor prompt, registerPersona side-effect, ECOMMERCE_STARTERS

## Decisions Made

- Persona vertical slice pattern: each persona gets 3 files (knowledge, tools, config) in separate directories
- PRODUCT_CATALOG exported as typed Product[] array so tool handlers can filter/query it directly
- Tool names in persona.tools record match tool export keys exactly for tool-executor.ts validation path
- System prompts are const strings (~1500-2500 tokens) with communication style, decision rules, and tone calibration

## Deviations from Plan

### Lint-staged Side Effects

During Task 1 commit, lint-staged stash/restore picked up pre-existing untracked files (leadgen-kb.ts, leadgen-tools.ts, leadgen.ts, support-kb.ts, support-tools.ts, support.ts) that were in the working tree from prior planning. These were committed as separate 16-02 commits by the lint-staged process. They are valid persona files for Plan 02 and do not affect Plan 01 deliverables.

---

**Total deviations:** 0 auto-fixes. 1 lint-staged side effect (pre-existing files committed).
**Impact on plan:** No scope creep. All 6 planned files created correctly.

## Issues Encountered

- Pre-existing TS error in engine.ts (TS2488 Symbol.iterator) — out of scope, from Phase 15 working-tree changes
- Lint-staged stash mechanism committed pre-existing persona files from working tree during stash pop

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Both personas ready for ChatWidget UI integration (Phase 17)
- Tool definitions ready for tool-executor.ts wiring (Plan 02 or Phase 17)
- Conversation starters ready for ChatWidget initial state

---

_Phase: 16-chatbot-personas-knowledge_
_Completed: 2026-03-13_

## Self-Check: PASSED

- All 6 files verified on disk
- Both task commits (45648f0, b43d1ac) verified in git log
