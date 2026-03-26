---
phase: 17-chatwidget-ui-components
plan: 01
subsystem: api, ui
tags: [ai-sdk, useChat, zustand, streaming, chatbot]

requires:
  - phase: 15-chatbot-engine-foundation
    provides: engine pipeline with streamText, persona routing, tool execution
provides:
  - toUIMessageStreamResponse engine output for structured message parts
  - Dual request format (useChat messages[] + legacy message string)
  - chatbotStore Zustand store for chatbot UI state
  - usePersonaChat hook wrapping useChat with DefaultChatTransport
affects:
  [17-chatwidget-ui-components, 18-chatbotspage-demo-playground, 19-homepage-concierge-demo-guide]

tech-stack:
  added: ['@ai-sdk/react']
  patterns:
    [
      DefaultChatTransport for useChat,
      convertToModelMessages for UIMessage conversion,
      Zustand persist with partialize,
    ]

key-files:
  created:
    - src/stores/chatbotStore.ts
    - src/hooks/usePersonaChat.ts
  modified:
    - src/lib/chatbot/engine.ts
    - src/lib/chatbot/types.ts

key-decisions:
  - 'convertToModelMessages (async) converts UIMessage[] to model messages server-side'
  - 'chatbotStore uses fmai-chatbot-state localStorage key (separate from old fmai-chat-state)'
  - 'usePersonaChat uses useChat id param for per-persona message isolation'
  - 'Demo message limit set at 15 messages per session'

patterns-established:
  - 'Dual request format: engine accepts both useChat messages[] and legacy message + conversationHistory'
  - 'useChatbotStore for chatbot UI state (not old chatStore)'
  - 'usePersonaChat(personaId) as standard hook for all chat UI components'

requirements-completed: [REQ-CHATWIDGET-UI]

duration: 10min
completed: 2026-03-13
---

# Phase 17 Plan 01: Foundation -- Engine Compatibility, Chat Store, usePersonaChat Hook Summary

**Engine switched to toUIMessageStreamResponse with dual request format, Zustand chatbotStore for UI state, usePersonaChat hook wrapping AI SDK v6 useChat with DefaultChatTransport**

## Performance

- **Duration:** 10 min
- **Started:** 2026-03-13T17:56:06Z
- **Completed:** 2026-03-13T18:06:21Z
- **Tasks:** 2
- **Files modified:** 4 (+ package.json/package-lock.json for @ai-sdk/react)

## Accomplishments

- Engine returns toUIMessageStreamResponse enabling structured message parts (text + tool invocations) for useChat
- Engine accepts both useChat messages[] array and legacy message string for backward compatibility
- chatbotStore provides isOpen, isMinimized, sessionId, messageCount, activePersonaId with localStorage persistence
- usePersonaChat hook wraps useChat with DefaultChatTransport pointing to /api/chatbot with demo limit tracking

## Task Commits

Each task was committed atomically:

1. **Task 1: Switch engine to toUIMessageStreamResponse + update request handling** - `b43d1ac` (feat)
2. **Task 2: Create chatbotStore (Zustand) + usePersonaChat hook** - `dd476e6` (feat)

## Files Created/Modified

- `src/lib/chatbot/engine.ts` - Switched to toUIMessageStreamResponse, added convertToModelMessages for UIMessage[] support, dual request format handling
- `src/lib/chatbot/types.ts` - ChatRequest updated with optional messages field and optional message field
- `src/stores/chatbotStore.ts` - New Zustand store for chatbot UI state with localStorage persistence
- `src/hooks/usePersonaChat.ts` - Wrapper around useChat with DefaultChatTransport and demo limit tracking

## Decisions Made

- Used `convertToModelMessages` (async) from `ai` package to convert UIMessage[] to model messages server-side rather than manual extraction
- chatbotStore uses `fmai-chatbot-state` localStorage key, separate from old `fmai-chat-state` to avoid collision
- usePersonaChat relies on useChat `id` parameter (`chat-${personaId}`) for per-persona message isolation -- no need to duplicate messages in Zustand
- Demo message limit set at 15 messages per session via `DEMO_MESSAGE_LIMIT` constant

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing @ai-sdk/react dependency**

- **Found during:** Task 1 (pre-execution dependency check)
- **Issue:** @ai-sdk/react not in package.json despite being required for useChat hook
- **Fix:** Ran npm install @ai-sdk/react
- **Files modified:** package.json, package-lock.json
- **Verification:** Import resolves, TypeScript compiles clean
- **Committed in:** b43d1ac (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Essential dependency install. No scope creep.

## Issues Encountered

- lint-staged stash backup corruption caused Task 1 changes to be bundled into a pre-existing style commit (b43d1ac). Changes are correct and complete but commit message is misleading. Not worth rebasing to fix.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Engine ready for useChat streaming with structured parts
- chatbotStore ready for ChatWidget UI state management
- usePersonaChat hook ready for use by all chat UI components (ChatMessages, ChatInput, etc.)
- Old chatStore.ts untouched -- ARIA components continue working until Phase 19 removal

## Self-Check: PASSED

- All 4 source files exist
- Both commit hashes found (b43d1ac, dd476e6)
- Line counts meet minimums: engine 155/50, types 61/10, chatbotStore 77/40, usePersonaChat 32/20
- TypeScript compiles clean (npx tsc --noEmit)

---

_Phase: 17-chatwidget-ui-components_
_Completed: 2026-03-13_
