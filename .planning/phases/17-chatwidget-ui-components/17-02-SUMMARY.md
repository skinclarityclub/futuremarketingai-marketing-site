---
phase: 17-chatwidget-ui-components
plan: 02
subsystem: ui
tags: [react, ai-sdk, useChat, markdown, streaming, tailwind, chat-ui]

requires:
  - phase: 17-chatwidget-ui-components
    provides: usePersonaChat hook, chatbotStore Zustand store
  - phase: 15-chatbot-engine-foundation
    provides: streaming API endpoint at /api/chatbot
provides:
  - ChatHeader component (persona info, floating/embedded mode controls)
  - ChatMessages component (parts-based rendering, auto-scroll, typing indicator)
  - ChatInput component (local state textarea, Enter to send)
  - SuggestedPrompts component (clickable prompt pills)
  - ToolResultPlaceholder inline component (temporary until Plan 03)
affects: [17-03-tool-result-renderer, 17-04-chatwidget-assembly]

tech-stack:
  added: [react-markdown]
  patterns: [message.parts rendering, local useState for chat input, CSS-only message animations]

key-files:
  created:
    - src/components/chatbot/ChatHeader.tsx
    - src/components/chatbot/ChatMessages.tsx
    - src/components/chatbot/ChatInput.tsx
    - src/components/chatbot/SuggestedPrompts.tsx
  modified:
    - src/index.css

key-decisions:
  - 'ToolResultPlaceholder uses cast via unknown for tool part types -- Plan 03 ToolResultRenderer will replace with proper typed handling'
  - 'CSS-only animations (fadeIn, chatDotBounce) on messages instead of Framer Motion -- lighter weight per plan spec'
  - 'Auto-scroll uses 80px threshold from bottom to detect manual scroll-up'

patterns-established:
  - 'message.parts iteration: text parts -> MarkdownContent, toolName parts -> ToolResultPlaceholder'
  - 'ChatInput local useState: AI SDK v6 does not manage input state, component owns it'
  - 'chatDotBounce keyframe in index.css for typing indicator dots'

requirements-completed: [REQ-CHATWIDGET-UI]

duration: 9min
completed: 2026-03-13
---

# Phase 17 Plan 02: Core Chat UI Summary

**Four chat UI components with parts-based message rendering, react-markdown, auto-scroll, and auto-resize textarea using Living System tokens**

## Performance

- **Duration:** 9 min
- **Started:** 2026-03-13T18:11:03Z
- **Completed:** 2026-03-13T18:19:45Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- ChatHeader with persona avatar, name, demo badge counter, floating mode minimize/close controls with ARIA labels
- ChatMessages rendering via message.parts (text + tool placeholders) with auto-scroll, typing indicator, and markdown support
- ChatInput with local useState, auto-resize textarea (max 120px), Enter to send / Shift+Enter newline
- SuggestedPrompts with clickable pill buttons and Living System styling
- ToolResultPlaceholder handling input-streaming, input-available, output-available, and output-error states

## Task Commits

Each task was committed atomically:

1. **Task 1: ChatHeader + SuggestedPrompts** - `9d3c5b7` (feat)
2. **Task 2: ChatMessages + ChatInput** - `4b6fd31` (feat)

## Files Created/Modified

- `src/components/chatbot/ChatHeader.tsx` - Header with persona info, mode-specific controls, Escape key support
- `src/components/chatbot/ChatMessages.tsx` - Message list with parts-based rendering, auto-scroll, typing indicator, MarkdownContent, ToolResultPlaceholder
- `src/components/chatbot/ChatInput.tsx` - Auto-resize textarea with local state, Enter to send
- `src/components/chatbot/SuggestedPrompts.tsx` - Clickable prompt pills with disabled state
- `src/index.css` - Added chatDotBounce keyframe for typing indicator dots

## Decisions Made

- ToolResultPlaceholder casts tool part via `as unknown as` for type bridging -- Plan 03 replaces with properly typed ToolResultRenderer
- CSS-only animations on messages (fadeIn inline style) instead of Framer Motion per plan specification
- Auto-scroll threshold set at 80px from bottom to detect manual scroll-up vs. at-bottom

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added chatDotBounce keyframe to index.css**

- **Found during:** Task 2 (ChatMessages typing indicator)
- **Issue:** Plan specified CSS animation with staggered bounce dots, but no `bounce` keyframe existed in project CSS (Tailwind's built-in bounce only works via class, not inline style)
- **Fix:** Added `@keyframes chatDotBounce` with translateY(-4px) to index.css, referenced in TypingIndicator inline styles
- **Files modified:** src/index.css
- **Verification:** TypeScript compiles, keyframe renders correctly
- **Committed in:** 4b6fd31 (Task 2 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary for typing indicator animation. No scope creep.

## Issues Encountered

None

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All four core chat UI components ready for ChatWidget assembly (Plan 04)
- ToolResultPlaceholder in ChatMessages ready to be replaced by Plan 03 ToolResultRenderer
- ChatInput onSend callback ready to wire to ChatWidget handleSend -> usePersonaChat sendMessage

---

_Phase: 17-chatwidget-ui-components_
_Completed: 2026-03-13_
