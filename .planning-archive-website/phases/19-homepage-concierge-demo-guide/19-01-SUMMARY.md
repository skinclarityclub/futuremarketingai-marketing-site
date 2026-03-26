---
phase: 19-homepage-concierge-demo-guide
plan: 01
subsystem: ui
tags: [react, chatbot, persona, routing, chatwidget]

requires:
  - phase: 17-chatwidget-ui-components
    provides: ChatWidget component with floating/embedded modes
  - phase: 15-chatbot-engine-foundation
    provides: /api/chatbot streaming endpoint with persona support
provides:
  - Floating ChatWidget on all pages with route-based persona switching
  - pageContext prop plumbing from App.tsx through ChatWidget to API
affects: [19-02-aria-cleanup, demo-guide-persona, concierge-persona]

tech-stack:
  added: []
  patterns: [route-based persona detection with isDemoPage array match]

key-files:
  created: []
  modified:
    - src/App.tsx
    - src/components/chatbot/ChatWidget.tsx
    - src/hooks/usePersonaChat.ts

key-decisions:
  - 'isDemoPage uses startsWith array match for /explorer, /calculator, /dashboard, /demo prefixes'
  - 'Old fmai-chat-state localStorage key cleaned up on mount in existing dark mode useEffect'

patterns-established:
  - 'Route-based persona switching: isDemoPage ternary selects personaId in App.tsx'
  - 'pageContext prop forwarding: App.tsx -> ChatWidget -> usePersonaChat -> DefaultChatTransport body'

requirements-completed: [REQ-CHATBOT-CONCIERGE]

duration: 4min
completed: 2026-03-13
---

# Phase 19 Plan 01: Homepage Concierge + Demo Guide Wiring Summary

**ChatWidget floating mode replaces AIJourneyAssistant with route-based concierge/demo-guide persona switching and pageContext forwarding**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-13T22:05:18Z
- **Completed:** 2026-03-13T22:09:17Z
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments

- ChatWidget floating mode wired into App.tsx replacing AIJourneyAssistant
- Route-based persona detection: marketing pages get concierge, demo pages get demo-guide
- pageContext prop plumbed from App.tsx through ChatWidget to usePersonaChat API transport body
- NudgeToast removed, old ARIA localStorage key cleaned up

## Task Commits

Each task was committed atomically:

1. **Task 1: Add pageContext prop to ChatWidget and usePersonaChat** - `763d92f` (feat)
2. **Task 2: Wire ChatWidget into App.tsx with route-based persona switching** - `297964f` (feat)

## Files Created/Modified

- `src/hooks/usePersonaChat.ts` - Added optional pageContext parameter, forwarded as context in transport body
- `src/components/chatbot/ChatWidget.tsx` - Added pageContext prop to interface, passed to usePersonaChat
- `src/App.tsx` - Replaced AIJourneyAssistant with ChatWidget, added isDemoPage detection, removed NudgeToast, added localStorage cleanup

## Decisions Made

- isDemoPage uses startsWith array match for /explorer, /calculator, /dashboard, /demo prefixes (matches CONTEXT.md spec)
- Old fmai-chat-state localStorage key cleaned up on mount in existing dark mode useEffect (avoids adding a new useEffect)

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 02 (ARIA Cleanup) can proceed to remove all old ai-assistant components, stores, hooks, and configs
- AIJourneyAssistant barrel export still exists in components/index.ts (unused) -- Plan 02 cleans this up
- FloatingElementContext still imported in App.tsx -- Plan 02 removes if only used by ARIA

---

_Phase: 19-homepage-concierge-demo-guide_
_Completed: 2026-03-13_
