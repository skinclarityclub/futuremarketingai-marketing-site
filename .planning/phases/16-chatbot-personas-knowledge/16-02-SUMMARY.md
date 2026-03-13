---
phase: 16-chatbot-personas-knowledge
plan: 02
subsystem: chatbot
tags: [ai-sdk, zod, persona, lead-gen, support, knowledge-base, i18n]

requires:
  - phase: 15-chatbot-engine-foundation
    provides: PersonaConfig interface, registerPersona(), tool() + Zod pattern, TopicDefinition interface
provides:
  - Lead-gen persona with BANT qualification scoring, ROI estimation, pricing info, demo scheduling
  - Support persona with 17-article knowledge base, ticket creation, status checking, human escalation
  - 8 AI SDK tool() definitions with Zod inputSchema
  - i18n conversation starters (EN/NL/ES) for both personas
affects:
  [16-chatbot-personas-knowledge, 17-chatwidget-ui-components, 18-chatbotspage-demo-playground]

tech-stack:
  added: []
  patterns:
    [
      persona-vertical-slice,
      knowledge-base-topic-definitions,
      tool-scoring-logic,
      kb-article-search,
    ]

key-files:
  created:
    - src/lib/chatbot/knowledge/leadgen-kb.ts
    - src/lib/chatbot/tools/leadgen-tools.ts
    - src/lib/chatbot/personas/leadgen.ts
    - src/lib/chatbot/knowledge/support-kb.ts
    - src/lib/chatbot/tools/support-tools.ts
    - src/lib/chatbot/personas/support.ts
  modified: []

key-decisions:
  - 'tools cast as `unknown as Record<string, unknown>` to satisfy PersonaConfig generic tools type while keeping AI SDK tool() type safety'

patterns-established:
  - 'Persona vertical slice: knowledge-kb.ts + tools.ts + persona.ts per persona'
  - 'KB_ARTICLES array pattern for searchable knowledge base content'
  - 'Tool scoring with point-based accumulation and threshold-based qualification levels'

requirements-completed: [REQ-CHATBOT-PERSONAS]

duration: 6min
completed: 2026-03-13
---

# Phase 16 Plan 02: Lead-Gen and Support Personas Summary

**Lead-gen BANT qualification bot with scoring/ROI tools and support helpdesk bot with 17-article KB search, ticket creation, and human escalation**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-13T17:53:14Z
- **Completed:** 2026-03-13T17:59:33Z
- **Tasks:** 2
- **Files created:** 6

## Accomplishments

- Lead-gen persona with 5 topic definitions covering qualification framework, pricing tiers, ROI benchmarks, product features, and competitive positioning
- 4 lead-gen tools: qualify_lead (0-100 scoring from BANT inputs), get_pricing_info, schedule_demo, get_roi_estimate (monthly/annual savings + payback period)
- Support persona with 4 topic definitions and 17 searchable FAQ articles across billing, technical, account, and getting started categories
- 4 support tools: search_knowledge_base (substring matching with category filter), create_ticket, check_status, escalate_to_human
- Both personas registered via registerPersona() at module scope
- EN/NL/ES conversation starters exported for both personas

## Task Commits

Each task was committed atomically:

1. **Task 1: Lead-gen persona — knowledge base, tools, and persona config** - `00267a9` (feat)
2. **Task 2: Support persona — knowledge base, tools, and persona config** - `83175e0` (feat)

## Files Created/Modified

- `src/lib/chatbot/knowledge/leadgen-kb.ts` - 5 TopicDefinition[] for B2B SaaS qualification
- `src/lib/chatbot/tools/leadgen-tools.ts` - qualify_lead, get_pricing_info, schedule_demo, get_roi_estimate tools
- `src/lib/chatbot/personas/leadgen.ts` - PersonaConfig with consultative SDR system prompt + LEADGEN_STARTERS
- `src/lib/chatbot/knowledge/support-kb.ts` - 4 TopicDefinition[] + 17 KBArticle[] for helpdesk FAQ
- `src/lib/chatbot/tools/support-tools.ts` - search_knowledge_base, create_ticket, check_status, escalate_to_human tools
- `src/lib/chatbot/personas/support.ts` - PersonaConfig with empathetic support agent system prompt + SUPPORT_STARTERS

## Decisions Made

- Tools property cast as `unknown as Record<string, unknown>` to bridge AI SDK tool() return type with PersonaConfig's generic Record type

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- First commit attempt failed with `fatal: cannot lock ref 'HEAD'` due to lint-staged stash/unstash race condition on HEAD ref. Retry succeeded immediately.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- 2 of 5 personas complete (concierge and ecommerce done in 16-01, leadgen and support done here)
- Plan 16-03 (demo-guide persona) is next
- All 8 tools conform to AI SDK v6 tool() + Zod inputSchema pattern
- TypeScript compiles clean with no errors

## Self-Check: PASSED

- All 6 created files exist on disk
- Commit 00267a9 (Task 1) verified in git log
- Commit 83175e0 (Task 2) verified in git log
- TypeScript compilation passes with zero errors

---

_Phase: 16-chatbot-personas-knowledge_
_Completed: 2026-03-13_
