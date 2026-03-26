---
phase: 17-chatwidget-ui-components
verified: 2026-03-13T12:00:00Z
status: passed
score: 7/7 must-haves verified
re_verification: false
gaps: []
human_verification:
  - test: 'Open ChatWidget in floating mode, click FAB, verify panel animation'
    expected: 'Smooth slide-up/fade-in panel with header, input, suggested prompts'
    why_human: 'Visual animation quality and layout cannot be verified programmatically'
  - test: 'Send a message to a persona with tools configured and verify tool result cards render'
    expected: 'Loading skeleton appears, then correct card type (ProductCard, LeadScoreCard, etc.) renders with data'
    why_human: 'Requires live API key and persona configuration from Phase 16'
  - test: 'Verify embedded mode renders inline with configurable height'
    expected: 'Chat widget fills container at specified height without FAB or floating panel'
    why_human: 'Layout behavior in different container contexts needs visual inspection'
---

# Phase 17: ChatWidget UI Components Verification Report

**Phase Goal:** Build the shared ChatWidget React component supporting floating mode (concierge/demo-guide) and embedded mode (demo playground). Includes message rendering with streaming, tool result cards, and suggested conversation starters.
**Verified:** 2026-03-13
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                               | Status   | Evidence                                                                                                                                                                                            |
| --- | ----------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Engine returns toUIMessageStreamResponse for structured message parts               | VERIFIED | engine.ts line 147: `result.toUIMessageStreamResponse({ headers: CORS_HEADERS })`                                                                                                                   |
| 2   | Engine accepts both useChat messages[] and legacy message string                    | VERIFIED | engine.ts lines 70-79: dual-mode detection with `isUseChatMode`, `convertToModelMessages` for useChat, legacy path preserved                                                                        |
| 3   | chatbotStore provides isOpen, isMinimized, sessionId, messageCount, activePersonaId | VERIFIED | chatbotStore.ts: full Zustand store with persist middleware, localStorage key `fmai-chatbot-state`, partialize excludes UI state                                                                    |
| 4   | usePersonaChat wraps useChat with DefaultChatTransport                              | VERIFIED | usePersonaChat.ts: imports `useChat` from `@ai-sdk/react`, `DefaultChatTransport` from `ai`, configures `/api/chatbot` endpoint with personaId + sessionId in body                                  |
| 5   | ChatMessages renders via message.parts with ToolResultRenderer                      | VERIFIED | ChatMessages.tsx lines 103-111: iterates `message.parts`, dispatches `part.type === 'text'` to MarkdownContent and `'toolName' in part` to ToolResultRenderer                                       |
| 6   | ChatWidget supports dual mode (floating + embedded) with all sub-components         | VERIFIED | ChatWidget.tsx: accepts `mode: 'floating'                                                                                                                                                           | 'embedded'`, floating mode has FAB + AnimatePresence panel + Escape close + focus management, embedded mode has inline container with configurable height |
| 7   | 5 tool result cards + ToolResultRenderer router with loading/error/fallback states  | VERIFIED | tool-results/index.tsx: TOOL_CARD_MAP maps 20 tool names to 5 card components, ToolLoadingCard for input-streaming/input-available, ToolErrorCard for output-error, JSON fallback for unknown tools |

**Score:** 7/7 truths verified

### Required Artifacts

| Artifact                                                | Expected                                             | Status   | Lines        |
| ------------------------------------------------------- | ---------------------------------------------------- | -------- | ------------ |
| `src/lib/chatbot/engine.ts`                             | UIMessageStreamResponse + dual request format        | VERIFIED | 155 (min 50) |
| `src/lib/chatbot/types.ts`                              | ChatRequest with optional messages field             | VERIFIED | 61 (min 10)  |
| `src/stores/chatbotStore.ts`                            | Zustand store for chatbot UI state                   | VERIFIED | 77 (min 40)  |
| `src/hooks/usePersonaChat.ts`                           | useChat wrapper with DefaultChatTransport            | VERIFIED | 32 (min 20)  |
| `src/components/chatbot/ChatHeader.tsx`                 | Header with persona info, mode controls              | VERIFIED | 85 (min 30)  |
| `src/components/chatbot/ChatMessages.tsx`               | Parts-based rendering, auto-scroll, typing indicator | VERIFIED | 125 (min 60) |
| `src/components/chatbot/ChatInput.tsx`                  | Auto-resize textarea, Enter to send                  | VERIFIED | 89 (min 40)  |
| `src/components/chatbot/SuggestedPrompts.tsx`           | Clickable prompt pills                               | VERIFIED | 29 (min 15)  |
| `src/components/chatbot/tool-results/ProductCard.tsx`   | E-commerce product card                              | VERIFIED | 70 (min 20)  |
| `src/components/chatbot/tool-results/LeadScoreCard.tsx` | Lead score visualization                             | VERIFIED | 96 (min 20)  |
| `src/components/chatbot/tool-results/KBArticleCard.tsx` | KB article preview                                   | VERIFIED | 57 (min 20)  |
| `src/components/chatbot/tool-results/TicketCard.tsx`    | Support ticket card                                  | VERIFIED | 60 (min 20)  |
| `src/components/chatbot/tool-results/ServiceCard.tsx`   | Service info card                                    | VERIFIED | 54 (min 20)  |
| `src/components/chatbot/tool-results/index.tsx`         | ToolResultRenderer router + barrel                   | VERIFIED | 109 (min 30) |
| `src/components/chatbot/ChatWidget.tsx`                 | Dual-mode widget                                     | VERIFIED | 176 (min 80) |
| `src/components/chatbot/FloatingButton.tsx`             | FAB with breathing animation                         | VERIFIED | 46 (min 30)  |
| `src/components/chatbot/index.ts`                       | Barrel exports                                       | VERIFIED | 14 (min 10)  |

### Key Link Verification

| From               | To                 | Via                       | Status | Details                                                                                                                        |
| ------------------ | ------------------ | ------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------ |
| engine.ts          | useChat            | toUIMessageStreamResponse | WIRED  | Line 147 returns structured stream; usePersonaChat consumes via DefaultChatTransport                                           |
| usePersonaChat     | /api/chatbot       | DefaultChatTransport      | WIRED  | Transport configured with api: '/api/chatbot', body: { personaId, sessionId }                                                  |
| chatbotStore       | usePersonaChat     | sessionId in body         | WIRED  | usePersonaChat destructures sessionId from useChatbotStore, passes in transport body                                           |
| ChatWidget         | usePersonaChat     | hook call                 | WIRED  | ChatWidget.tsx line 30: `usePersonaChat(personaId)`                                                                            |
| ChatWidget         | useChatbotStore    | hook call                 | WIRED  | ChatWidget.tsx line 31: `useChatbotStore()` for isOpen, toggle, close, etc.                                                    |
| ChatMessages       | ToolResultRenderer | import + usage            | WIRED  | Import from './tool-results', used at line 108 for parts with toolName                                                         |
| ToolResultRenderer | Card components    | TOOL_CARD_MAP lookup      | WIRED  | 20 tool names mapped to 5 card components                                                                                      |
| FloatingButton     | ChatWidget         | onClick={toggle}          | WIRED  | ChatWidget passes toggle from useChatbotStore to FloatingButton                                                                |
| SuggestedPrompts   | ChatWidget         | onSelect={handleSend}     | WIRED  | ChatWidget passes handleSend which calls sendMessage({ text })                                                                 |
| ChatInput          | ChatWidget         | onSend={handleSend}       | WIRED  | Same handleSend pipeline                                                                                                       |
| Barrel index.ts    | All components     | named exports             | WIRED  | Exports ChatWidget, FloatingButton, ChatHeader, ChatMessages, ChatInput, SuggestedPrompts, ToolResultRenderer, and all 5 cards |

### Requirements Coverage

| Requirement       | Source Plans               | Description                                                                                                   | Status    | Evidence                                                                                |
| ----------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------- | --------- | --------------------------------------------------------------------------------------- |
| REQ-CHATWIDGET-UI | 17-01, 17-02, 17-03, 17-04 | Build shared ChatWidget with floating/embedded modes, message rendering, tool result cards, suggested prompts | SATISFIED | All 17 artifacts exist, are substantive, and are wired. TypeScript and Vite build pass. |

**Note:** REQ-CHATWIDGET-UI is referenced in all 4 plans and in ROADMAP.md but is NOT defined in REQUIREMENTS.md. This is a documentation gap (not a code gap). The requirement should be added to REQUIREMENTS.md for traceability.

### Anti-Patterns Found

| File   | Line | Pattern | Severity | Impact                                                                       |
| ------ | ---- | ------- | -------- | ---------------------------------------------------------------------------- |
| (none) | -    | -       | -        | No TODO, FIXME, PLACEHOLDER, or stub patterns found in any phase 17 artifact |

### Build Verification

- TypeScript compilation: PASS (zero errors)
- Vite build: PASS (produces output bundles)
- Old chatStore.ts: UNTOUCHED (still exists at src/stores/chatStore.ts, separate from new chatbotStore.ts)

### Integration Status

The chatbot components are intentionally NOT wired into any page route yet. No imports of `components/chatbot` exist outside the chatbot directory itself. This is correct -- Phase 18 (demo playground) and Phase 19 (homepage concierge) handle the integration wiring.

### Human Verification Required

### 1. Floating Mode Visual Check

**Test:** Temporarily wire `<ChatWidget mode="floating" personaId="concierge" personaName="Concierge" suggestedPrompts={["What services do you offer?"]} />` into a page and verify FAB position, panel animation, Escape to close, focus management.
**Expected:** FAB bottom-right on mobile, right-middle on desktop. Panel slides up smoothly. Escape closes. Textarea auto-focuses on open.
**Why human:** Animation quality, positioning across viewports, and focus behavior require visual inspection.

### 2. Embedded Mode Layout

**Test:** Wire `<ChatWidget mode="embedded" personaId="concierge" height="400px" />` into a container and verify inline rendering.
**Expected:** Widget fills container at 400px height, no FAB, header shows "Demo" badge, no floating panel.
**Why human:** Container integration behavior varies by parent layout context.

### 3. Streaming + Tool Result Cards (requires API key)

**Test:** Send a message that triggers a tool invocation (e.g., ask concierge about services).
**Expected:** Typing indicator appears, then streaming text, then tool result card with correct card type and data.
**Why human:** Requires live Anthropic API key and Phase 16 persona configurations. Cannot test programmatically in CI.

### Gaps Summary

No code gaps found. All 17 artifacts exist, are substantive (well above minimum line counts), and are properly wired internally. The component library is self-contained and build-passing, ready for Phase 18/19 integration.

One documentation gap: REQ-CHATWIDGET-UI needs to be added to `.planning/REQUIREMENTS.md` for full traceability.

---

_Verified: 2026-03-13_
_Verifier: Claude (gsd-verifier)_
