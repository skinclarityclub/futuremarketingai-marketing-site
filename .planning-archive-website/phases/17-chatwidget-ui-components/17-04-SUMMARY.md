---
phase: 17-chatwidget-ui-components
plan: 04
subsystem: ui
tags: [react, framer-motion, chatbot, floating-widget, barrel-exports, css-animation]

requires:
  - phase: 17-chatwidget-ui-components (plans 01-03)
    provides: usePersonaChat hook, chatbotStore, ChatHeader, ChatMessages, ChatInput, SuggestedPrompts, ToolResultRenderer
provides:
  - ChatWidget dual-mode component (floating + embedded)
  - FloatingButton FAB with breathing animation and unread badge
  - Barrel exports for all chatbot components
  - CSS breathe keyframe animation
affects: [18-chatbotspage-demo-playground, 19-homepage-concierge-demo-guide]

tech-stack:
  added: []
  patterns:
    - "Dual-mode widget pattern: single ChatWidget component with mode='floating'|'embedded' prop"
    - 'CSS breathing animation via @keyframes + utility class instead of Framer Motion for always-on effects'
    - 'Barrel exports for full chatbot component library'

key-files:
  created:
    - src/components/chatbot/ChatWidget.tsx
    - src/components/chatbot/FloatingButton.tsx
    - src/components/chatbot/index.ts
  modified:
    - src/index.css

key-decisions:
  - 'FloatingButton uses CSS @keyframes breathe instead of Framer Motion for always-on animation -- lighter weight'
  - 'ChatWidget dual-mode via prop rather than separate components -- shared hook/state logic'
  - 'Barrel index.ts exports all chatbot components including tool-results for Phase 18/19 consumers'

patterns-established:
  - 'ChatWidget mode prop pattern: floating (FAB + AnimatePresence panel) vs embedded (inline container)'
  - 'Demo limit banner pattern: show CTA when messageCount >= limit, disable input'

requirements-completed: [REQ-CHATWIDGET-UI]

duration: 12min
completed: 2026-03-13
---

# Phase 17 Plan 04: ChatWidget + FloatingButton Summary

**Dual-mode ChatWidget (floating FAB panel + embedded inline) with FloatingButton breathing animation, demo limit banner, and barrel exports for all chatbot components**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-13T18:45:00Z
- **Completed:** 2026-03-13T18:57:00Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments

- ChatWidget supports floating mode (FAB + AnimatePresence panel + Escape to close + focus management) and embedded mode (inline container with configurable height)
- FloatingButton FAB with warm gradient, MessageCircle/X icon toggle, CSS breathing animation, unread badge, reduced motion support
- Demo limit banner shown when message count reaches limit with CTA to book a call
- Barrel exports expose ChatWidget, FloatingButton, and all sub-components for Phase 18/19 consumption

## Task Commits

Each task was committed atomically:

1. **Task 1: FloatingButton FAB component** - `60b5c02` (feat)
2. **Task 2: ChatWidget dual-mode + barrel exports** - `5cf388b` (feat)
3. **Task 3: Verify: ChatWidget visual + streaming check** - no commit (temp wiring was working-tree only, reverted to clean state after human approval)

## Files Created/Modified

- `src/components/chatbot/FloatingButton.tsx` - FAB with gradient, breathing animation, unread badge, icon toggle (46 lines)
- `src/components/chatbot/ChatWidget.tsx` - Dual-mode widget with floating panel + embedded container (176 lines)
- `src/components/chatbot/index.ts` - Barrel exports for all chatbot components (14 lines)
- `src/index.css` - Added @keyframes breathe + .animate-breathe utility class

## Decisions Made

- FloatingButton uses CSS @keyframes breathe instead of Framer Motion for the always-on breathing animation -- lighter weight, no JS overhead for continuous effect
- ChatWidget uses a single component with mode prop rather than separate FloatingChatWidget/EmbeddedChatWidget -- shared hook integration and state logic makes this cleaner
- Barrel index.ts exports all chatbot components including tool-results sub-module for Phase 18/19 consumers

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 17 COMPLETE: All 4 plans done -- full chatbot UI component library ready
- Phase 18 (Chatbots Demo Playground) can import all components from `src/components/chatbot`
- Phase 19 (Homepage Concierge) can wire ChatWidget in floating mode into App.tsx with real persona

## Self-Check: PASSED

- All 3 created files verified on disk
- Both task commits (60b5c02, 5cf388b) verified in git log
- Build passes with no errors

---

_Phase: 17-chatwidget-ui-components_
_Completed: 2026-03-13_
