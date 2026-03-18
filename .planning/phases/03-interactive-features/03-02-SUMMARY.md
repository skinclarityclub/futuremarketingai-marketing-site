---
phase: 03-interactive-features
plan: 02
subsystem: chatbot
tags: [ai-sdk, anthropic, streaming, zustand, react-markdown, motion, tool-calling]

requires:
  - phase: 03-01
    provides: motion wrappers, chatbotStore, Providers, CookieConsentBanner
provides:
  - Complete chatbot engine with 6 personas and 17 tools
  - Route Handler at /api/chatbot for streaming chat
  - 18 chatbot UI components as client islands
  - Floating chatbot on every page via layout
  - usePersonaChat hook with DefaultChatTransport
affects: [03-03, 04-content-seo]

tech-stack:
  added: []
  patterns:
    [
      server-side chatbot engine with Route Handler delegation,
      tool result cards in side panel,
      persona-based tool filtering,
    ]

key-files:
  created:
    - fmai-nextjs/src/app/api/chatbot/route.ts
    - fmai-nextjs/src/lib/chatbot/engine.ts
    - fmai-nextjs/src/hooks/usePersonaChat.ts
    - fmai-nextjs/src/components/chatbot/ChatWidget.tsx
    - fmai-nextjs/src/components/chatbot/ChatWidgetIsland.tsx
    - fmai-nextjs/src/components/chatbot/tool-results/index.tsx
  modified:
    - fmai-nextjs/src/stores/chatbotStore.ts
    - fmai-nextjs/src/app/[locale]/layout.tsx

key-decisions:
  - 'Extended chatbotStore with full side panel, minimize, and demo state (Plan 03-01 had simplified interface)'
  - 'Removed DemoOrchestrator and DemoProgress from ChatWidget (demo orchestration deferred, not in plan scope)'
  - 'ProgressiveCTA uses direct Calendly links instead of CTAButton component (not yet migrated)'

patterns-established:
  - 'Route Handler delegation: thin route.ts delegates to engine.ts handleChatRequest'
  - 'Tool result cards route to SidePanel in flagship mode, inline in other personas'
  - 'usePersonaChat wraps useChat with DefaultChatTransport and persona-aware body params'

requirements-completed: [INT-01, INT-02]

duration: 20min
completed: 2026-03-18
---

# Phase 3 Plan 2: Chatbot Engine and UI Migration Summary

**Complete chatbot with 6 personas, 17 tools, streaming Route Handler, and floating UI on every page**

## Performance

- **Duration:** 20 min
- **Started:** 2026-03-18T04:02:18Z
- **Completed:** 2026-03-18T04:22:29Z
- **Tasks:** 2
- **Files modified:** 51

## Accomplishments

- Migrated 30 server-side chatbot engine files (types, security, rate limiter, personas, tools, knowledge bases)
- Created POST Route Handler at /api/chatbot delegating to handleChatRequest with CORS removed
- Migrated 18 chatbot UI components as "use client" islands with motion/react, @/stores paths, next/navigation
- Floating chatbot appears on every page via ChatWidgetIsland in layout.tsx

## Task Commits

Each task was committed atomically:

1. **Task 1: Migrate chatbot engine and create Route Handler** - `2677b76` (feat)
2. **Task 2: Migrate chatbot UI components and wire floating chatbot into layout** - `2b9aad5` (feat)

## Files Created/Modified

**Server-side engine (30 files):**

- `fmai-nextjs/src/app/api/chatbot/route.ts` - POST Route Handler
- `fmai-nextjs/src/lib/chatbot/engine.ts` - Core engine (CORS removed, API key check added)
- `fmai-nextjs/src/lib/chatbot/types.ts` - Shared types
- `fmai-nextjs/src/lib/chatbot/security.ts` - Input validation, PII detection
- `fmai-nextjs/src/lib/chatbot/rate-limiter.ts` - Session/IP/global rate limiting
- `fmai-nextjs/src/lib/chatbot/persona-router.ts` - Persona registry
- `fmai-nextjs/src/lib/chatbot/prompt-builder.ts` - System message construction with cache control
- `fmai-nextjs/src/lib/chatbot/topic-router.ts` - Keyword-based knowledge routing
- `fmai-nextjs/src/lib/chatbot/complexity-detector.ts` - Model routing (haiku/sonnet)
- `fmai-nextjs/src/lib/chatbot/tool-executor.ts` - Persona-to-tool mapping
- `fmai-nextjs/src/lib/chatbot/personas/*.ts` - 6 persona configs
- `fmai-nextjs/src/lib/chatbot/tools/*.ts` - 6 tool sets (17 unique tools)
- `fmai-nextjs/src/lib/chatbot/knowledge/*.ts` - 6 knowledge bases

**Client-side UI (21 files):**

- `fmai-nextjs/src/stores/chatbotStore.ts` - Extended with side panel, minimize, demo state
- `fmai-nextjs/src/hooks/usePersonaChat.ts` - useChat wrapper with DefaultChatTransport
- `fmai-nextjs/src/components/chatbot/ChatWidget.tsx` - Main widget (floating/embedded)
- `fmai-nextjs/src/components/chatbot/ChatWidgetIsland.tsx` - Layout-level floating wrapper
- `fmai-nextjs/src/components/chatbot/ChatHeader.tsx` - Header with persona info
- `fmai-nextjs/src/components/chatbot/ChatMessages.tsx` - Message list with markdown
- `fmai-nextjs/src/components/chatbot/ChatInput.tsx` - Auto-resizing textarea
- `fmai-nextjs/src/components/chatbot/FloatingButton.tsx` - FAB with breathe animation
- `fmai-nextjs/src/components/chatbot/SidePanel.tsx` - Slide-out tool results panel
- `fmai-nextjs/src/components/chatbot/SuggestedPrompts.tsx` - Prompt chips
- `fmai-nextjs/src/components/chatbot/ProgressiveCTA.tsx` - Message-count CTAs
- `fmai-nextjs/src/components/chatbot/NavigationButton.tsx` - In-app navigation
- `fmai-nextjs/src/components/chatbot/tool-results/*.tsx` - 7 tool result card components
- `fmai-nextjs/src/app/[locale]/layout.tsx` - Added ChatWidgetIsland

## Decisions Made

- Extended chatbotStore with isMinimized, hasUnread, isSidePanelOpen, sidePanelContent, startDemo (Plan 03-01 had simplified interface, ChatWidget needs full state)
- Removed DemoOrchestrator/DemoProgress from ChatWidget migration (demo-specific components not in plan scope, chatbot works without them)
- ProgressiveCTA uses direct Calendly links and hardcoded English text (CTAButton and translations not yet available in Next.js)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Extended chatbotStore interface**

- **Found during:** Task 2 (ChatWidget migration)
- **Issue:** Plan 03-01 created simplified chatbotStore; ChatWidget requires isMinimized, hasUnread, toggle/close/minimize/markRead, side panel state, and startDemo
- **Fix:** Rewrote chatbotStore with full interface while preserving persist/skipHydration pattern
- **Files modified:** fmai-nextjs/src/stores/chatbotStore.ts
- **Verification:** Build passes, all store selectors in ChatWidget resolve
- **Committed in:** 2b9aad5

---

**Total deviations:** 1 auto-fixed (1 missing critical)
**Impact on plan:** Essential for ChatWidget to function. No scope creep.

## Issues Encountered

None

## User Setup Required

ANTHROPIC_API_KEY must be set in fmai-nextjs/.env.local for the chatbot to function. The engine returns a 500 error with "API key not configured" if missing.

## Next Phase Readiness

- Chatbot engine and UI fully operational (pending API key)
- Ready for Plan 03-03 (remaining interactive features)
- DemoOrchestrator can be added in a future plan if guided demo flow is needed

---

_Phase: 03-interactive-features_
_Completed: 2026-03-18_
