---
phase: 18-chatbotspage-demo-playground
plan: 01
subsystem: ui
tags: [react, zustand, i18n, chatbot, demo, tabs, aria]

requires:
  - phase: 17-chatwidget-ui-components
    provides: ChatWidget component with embedded mode, usePersonaChat hook, chatbotStore
  - phase: 16-chatbot-personas-knowledge
    provides: Persona starters (ECOMMERCE_STARTERS, LEADGEN_STARTERS, SUPPORT_STARTERS)
provides:
  - Per-persona message counting in chatbotStore (messageCounts Record)
  - DemoPlayground orchestrator with 3 ChatWidget instances
  - PersonaSelector accessible tab bar with DemoPersonaId type
  - DemoContextCard scenario + capabilities sidebar
  - Demo tab i18n keys (EN/NL/ES)
affects: [18-02, 18-03, 19-homepage-concierge-demo-guide]

tech-stack:
  added: []
  patterns:
    [
      hidden/block toggle for conversation preservation,
      per-persona state via Record map,
      lifted tab state for scroll-to-tab coordination,
    ]

key-files:
  created:
    - src/components/chatbot/DemoPlayground.tsx
    - src/components/chatbot/PersonaSelector.tsx
    - src/components/chatbot/DemoContextCard.tsx
  modified:
    - src/stores/chatbotStore.ts
    - src/hooks/usePersonaChat.ts
    - src/components/chatbot/index.ts
    - public/locales/en/chatbots.json
    - public/locales/nl/chatbots.json
    - public/locales/es/chatbots.json

key-decisions:
  - 'Per-persona messageCounts as Record<string, number> with standalone getMessageCount selector export'
  - 'DemoPlayground activeTab state lifted to parent (ChatbotsPage) for scroll-to-tab coordination from use case cards'

patterns-established:
  - 'Hidden/block toggle: 3 ChatWidgets mounted simultaneously, CSS hidden/block for tab switching preserves chat history'
  - 'Per-persona state: Zustand store uses Record<personaId, value> pattern for per-persona isolation'

requirements-completed: [REQ-CHATBOT-PLAYGROUND]

duration: 7min
completed: 2026-03-13
---

# Phase 18 Plan 01: Demo Playground Core Summary

**Per-persona message counting in chatbotStore + DemoPlayground orchestrator with 3 embedded ChatWidgets, tab bar, and context card**

## Performance

- **Duration:** 7 min
- **Started:** 2026-03-13T19:39:09Z
- **Completed:** 2026-03-13T19:46:27Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Migrated chatbotStore from global messageCount to per-persona messageCounts Record
- Created DemoPlayground orchestrator with 3 simultaneously-mounted ChatWidget instances using hidden/block toggle for conversation preservation
- Created PersonaSelector with accessible tab bar (role=tablist, role=tab, aria-selected) and Lucide icons
- Created DemoContextCard with i18n scenario descriptions and capabilities lists
- Added demo tab i18n keys for all 3 locales (EN, NL, ES)

## Task Commits

Each task was committed atomically:

1. **Task 1: Extend chatbotStore + usePersonaChat for per-persona message counting** - `9f5ba6c` (feat)
2. **Task 2: Create PersonaSelector, DemoContextCard, and DemoPlayground components** - `e9c0945` (feat)

## Files Created/Modified

- `src/stores/chatbotStore.ts` - Per-persona messageCounts Record, incrementMessageCount(personaId), getMessageCount selector
- `src/hooks/usePersonaChat.ts` - Reads/writes per-persona counts via messageCounts[personaId]
- `src/components/chatbot/PersonaSelector.tsx` - Tab bar with ShoppingCart/Target/LifeBuoy icons, DemoPersonaId type export
- `src/components/chatbot/DemoContextCard.tsx` - Scenario title, description, capabilities list with CheckCircle icons
- `src/components/chatbot/DemoPlayground.tsx` - Orchestrator: tabs + context card + 3 embedded ChatWidgets
- `src/components/chatbot/index.ts` - Barrel exports for DemoPlayground, PersonaSelector, DemoContextCard
- `public/locales/en/chatbots.json` - Demo tab labels, scenarios, capabilities (EN)
- `public/locales/nl/chatbots.json` - Demo tab labels, scenarios, capabilities (NL)
- `public/locales/es/chatbots.json` - Demo tab labels, scenarios, capabilities (ES)

## Decisions Made

- Per-persona messageCounts uses Record<string, number> with standalone getMessageCount selector export (not a Zustand getter, since Zustand create() does not support getters)
- DemoPlayground activeTab + onTabChange props lifted to parent for ChatbotsPage scroll-to-tab coordination from use case cards
- PERSONA_NAMES uses English strings (not i18n) since they are technical identifiers shown in ChatHeader

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Pre-commit hook auto-generated ProgressiveCTA and MultiPlatformShowcase**

- **Found during:** Task 2 (commit stage)
- **Issue:** Lint-staged pre-commit hook auto-added barrel exports for ProgressiveCTA and MultiPlatformShowcase (Plan 02 components) which triggered auto-generation of those component files
- **Fix:** Accepted the auto-generated files as they are correct and align with Plan 02 spec; barrel exports kept intact
- **Files modified:** src/components/chatbot/ProgressiveCTA.tsx, src/components/chatbot/MultiPlatformShowcase.tsx, src/components/chatbot/index.ts
- **Verification:** TypeScript compiles clean with all exports
- **Committed in:** 210c7d8, e9c0945

---

**Total deviations:** 1 auto-fixed (blocking)
**Impact on plan:** ProgressiveCTA and MultiPlatformShowcase files were pre-created during commit. Plan 02 may need to verify/adjust these rather than create from scratch.

## Issues Encountered

None beyond the pre-commit hook deviation noted above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- DemoPlayground ready to be wired into ChatbotsPage (Plan 02/03)
- ProgressiveCTA and MultiPlatformShowcase already created by pre-commit hook (Plan 02 should verify)
- DemoPersonaId type exported for ChatbotsPage scroll-to-tab coordination

---

_Phase: 18-chatbotspage-demo-playground_
_Completed: 2026-03-13_
