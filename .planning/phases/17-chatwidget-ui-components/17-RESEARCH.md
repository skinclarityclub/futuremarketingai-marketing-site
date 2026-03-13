# Phase 17: ChatWidget UI Components - Research

**Researched:** 2026-03-13
**Domain:** React chat UI components with Vercel AI SDK streaming
**Confidence:** HIGH

## Summary

Phase 17 builds the shared ChatWidget React component that connects to the Phase 15 chatbot engine via the Vercel AI SDK `useChat` hook. The widget operates in two modes: floating (FAB + panel for concierge/demo-guide) and embedded (inline for /chatbots demo playground). The component renders streaming text, tool result cards, and suggested conversation starters, all styled in the Living System design language.

The primary technical challenge is adopting the AI SDK v6 `useChat` hook with its `message.parts`-based rendering model and `DefaultChatTransport` configuration. The engine currently uses `toTextStreamResponse` (set up in Phase 15 with the explicit note to switch to `toUIMessageStreamResponse` for `useChat` compatibility). Tool results from Phase 16 personas need to be rendered as typed visual cards, routed by `part.type` in the message parts array.

**Primary recommendation:** Use `@ai-sdk/react` `useChat` hook with `DefaultChatTransport` pointing to `/api/chatbot`. Render all messages via `message.parts` (not `message.content`). Switch engine from `toTextStreamResponse` to `toUIMessageStreamResponse`. Build a `usePersonaChat` wrapper hook that encapsulates persona-specific transport config, session management, and the Zustand store integration.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- **Two widget modes**: floating (FAB + panel) and embedded (inline in DemoPlayground)
- **Component architecture**: ChatWidget.tsx (main, mode prop) > FloatingButton.tsx, ChatHeader.tsx, ChatMessages.tsx, ChatInput.tsx, SuggestedPrompts.tsx, tool-results/\*.tsx
- **Streaming via Vercel AI SDK**: `useChat` hook with `/api/chatbot` endpoint
- **State management**: New Zustand `chatStore` with per-persona histories, persisted to localStorage
- **Design system**: Living System dark theme (#0A0E27 surface), user messages = warm gradient (amber), assistant messages = glass (backdrop-blur + subtle border), CSS fadeIn/slideUp animations (not heavy Framer Motion)
- **FAB**: Warm gradient button with breathing animation, bottom-right on mobile, right-middle on desktop
- **Tool result cards**: ProductCard, LeadScoreCard, KBArticleCard, TicketCard, ServiceCard
- **Typography**: DM Sans for messages, JetBrains Mono for tool result data
- **Accessibility**: ARIA labels, keyboard nav, focus management, screen reader support, reduced motion
- **SKC reference code**: ChatWidget.tsx, ChatMessages.tsx, ChatInput.tsx, ToolResults/ for UI patterns
- **Current ARIA reference**: FloatingActionButton.tsx, ChatPanel.tsx, QuickReplies.tsx, RichCard.tsx for feature parity
- **Files to create**: 14 files as specified in CONTEXT.md

### Claude's Discretion

- (No explicit discretion areas listed — all decisions are locked)

### Deferred Ideas (OUT OF SCOPE)

- (No deferred items listed)
  </user_constraints>

<phase_requirements>

## Phase Requirements

| ID                | Description                                                                                                                                                                                                      | Research Support                                                                                                                                                                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-CHATWIDGET-UI | Build shared ChatWidget component supporting floating mode (concierge/demo-guide) and embedded mode (demo playground), with message rendering, streaming, tool result cards, and suggested conversation starters | Full research covers: useChat hook integration, message.parts rendering pattern, tool result card architecture, dual-mode widget design, Zustand store for per-persona state, FAB + panel floating mode, embedded mode, Living System styling |

</phase_requirements>

## Standard Stack

### Core

| Library          | Version                             | Purpose                                                             | Why Standard                                                                            |
| ---------------- | ----------------------------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `@ai-sdk/react`  | ^6.0.x (bundled with `ai` ^6.0.116) | `useChat` hook for streaming chat UI                                | Official Vercel AI SDK React integration — manages message state, streaming, tool calls |
| `ai`             | ^6.0.116                            | `DefaultChatTransport`, `UIMessage` types, `convertToModelMessages` | Already installed; provides transport layer and type system                             |
| `zustand`        | ^5.0.8                              | Chat state management (per-persona histories, UI state)             | Already installed; project pattern for all stores                                       |
| `lucide-react`   | ^0.545.0                            | Icons (MessageCircle, X, Send, Minimize2, etc.)                     | Already installed; project standard icon library                                        |
| `react-markdown` | ^10.1.0                             | Markdown rendering in assistant messages                            | Already installed; handles bold, lists, links in AI responses                           |

### Supporting

| Library          | Version | Purpose                                             | When to Use                                                             |
| ---------------- | ------- | --------------------------------------------------- | ----------------------------------------------------------------------- |
| `framer-motion`  | ^11.0.0 | AnimatePresence for panel open/close, FAB breathing | Already installed; use sparingly per CONTEXT.md — prefer CSS animations |
| `tailwind-merge` | ^3.3.1  | Merge conditional Tailwind classes cleanly          | Already installed; useful for mode-specific class merging               |

### Alternatives Considered

| Instead of                       | Could Use                   | Tradeoff                                                                                                                              |
| -------------------------------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `@ai-sdk/react` useChat          | Custom fetch + state        | Would lose streaming, tool call handling, status management — no reason to hand-roll                                                  |
| react-markdown                   | Hand-rolled markdown parser | SKC uses hand-rolled inline formatting — works for simple bold/lists but react-markdown already installed and handles more edge cases |
| Framer Motion for all animations | CSS-only animations         | CONTEXT.md specifies CSS fadeIn/slideUp, Framer Motion only for AnimatePresence (panel enter/exit)                                    |

**Installation:**

```bash
# No new dependencies — all already installed
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/chatbot/
│   ├── ChatWidget.tsx          # Main component, mode: 'floating' | 'embedded'
│   ├── FloatingButton.tsx      # FAB for floating mode only
│   ├── ChatHeader.tsx          # Persona name/avatar, minimize/close, demo badge
│   ├── ChatMessages.tsx        # Message list rendering via message.parts
│   ├── ChatInput.tsx           # Text input + send button
│   ├── SuggestedPrompts.tsx    # Conversation starter pills
│   ├── tool-results/
│   │   ├── ProductCard.tsx     # E-commerce: image, price, rating, CTA
│   │   ├── LeadScoreCard.tsx   # Lead-gen: score /100, stage, recommendation
│   │   ├── KBArticleCard.tsx   # Support: title, snippet, source
│   │   ├── TicketCard.tsx      # Support: ID, status, category, priority
│   │   ├── ServiceCard.tsx     # Concierge: FMai service info
│   │   └── index.ts           # ToolResultRenderer + barrel exports
│   └── index.ts               # Barrel exports
├── stores/chatStore.ts         # New per-persona Zustand store (replaces old)
└── hooks/usePersonaChat.ts     # Wrapper around useChat with persona config
```

### Pattern 1: useChat with DefaultChatTransport (AI SDK v6)

**What:** The AI SDK v6 useChat hook no longer uses `api` and `body` as direct options. Instead, it requires a `DefaultChatTransport` instance.
**When to use:** Always — this is the only way to configure useChat in v6.
**Example:**

```typescript
// Source: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'

const { messages, sendMessage, status } = useChat({
  transport: new DefaultChatTransport({
    api: '/api/chatbot',
    body: { personaId, sessionId, context },
  }),
})
```

### Pattern 2: Rendering via message.parts (not message.content)

**What:** AI SDK v6 messages use a `parts` array containing typed objects (`text`, tool invocations, etc.). The `content` property is deprecated for rendering.
**When to use:** Always when rendering messages from useChat.
**Example:**

```typescript
// Source: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
{messages.map(message => (
  <div key={message.id}>
    {message.parts.map((part, index) => {
      if (part.type === 'text') {
        return <MarkdownContent key={index} text={part.text} />;
      }
      // Tool parts are typed: 'tool-{toolName}'
      if (part.type.startsWith('tool-')) {
        return <ToolResultRenderer key={index} part={part} />;
      }
      return null;
    })}
  </div>
))}
```

### Pattern 3: Tool Invocation State Machine

**What:** Tool parts have a `state` property that transitions through phases.
**When to use:** For rendering loading states while tool executes, then showing result card.
**Example:**

```typescript
// Source: https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage
// States: 'input-streaming' -> 'input-available' -> 'output-available' | 'output-error'
function ToolResultRenderer({ part }) {
  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return <ToolLoadingCard toolName={part.toolName} />;
  }
  if (part.state === 'output-available') {
    return renderToolCard(part.toolName, part.output);
  }
  if (part.state === 'output-error') {
    return <ToolErrorCard error={part.errorText} />;
  }
}
```

### Pattern 4: Engine Switch — toUIMessageStreamResponse

**What:** Phase 15 engine uses `toTextStreamResponse`. For `useChat` compatibility with tool results and structured parts, it must switch to `toUIMessageStreamResponse`.
**When to use:** Required change in Phase 17 to make the engine compatible with the UI.
**Example:**

```typescript
// In src/lib/chatbot/engine.ts — change from:
return result.toTextStreamResponse({ headers: CORS_HEADERS })
// To:
return result.toUIMessageStreamResponse({ headers: CORS_HEADERS })
```

**Note:** This was explicitly anticipated in Phase 15 STATE.md decision: "[Phase 15]: [15-03]: toTextStreamResponse used for simplicity — Phase 17 can switch to toUIMessageStreamResponse if useChat adopted"

### Pattern 5: Dual-Mode Widget via mode prop

**What:** Single ChatWidget component with a `mode` prop controlling layout behavior.
**When to use:** Floating mode renders FAB + animated panel; embedded mode renders inline.
**Example:**

```typescript
interface ChatWidgetProps {
  mode: 'floating' | 'embedded';
  personaId: string;
  height?: string;  // embedded mode only
}

function ChatWidget({ mode, personaId, height }: ChatWidgetProps) {
  if (mode === 'floating') {
    return (
      <>
        <FloatingButton />
        <AnimatePresence>
          {isOpen && <FloatingPanel>
            <ChatHeader />
            <ChatMessages />
            <ChatInput />
          </FloatingPanel>}
        </AnimatePresence>
      </>
    );
  }
  // Embedded mode — inline, no FAB
  return (
    <div style={{ height }} className="flex flex-col">
      <ChatHeader />
      <ChatMessages />
      <ChatInput />
    </div>
  );
}
```

### Pattern 6: Per-Persona Zustand Store

**What:** New chatStore with per-persona message histories keyed by personaId.
**When to use:** Persists chat state across persona switches and page navigations.
**Example:**

```typescript
// Source: Project Zustand pattern (existing stores)
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ChatState {
  histories: Record<string, UIMessage[]>
  activePersonaId: string
  isOpen: boolean // floating mode only
  isMinimized: boolean // floating mode only
  sessionId: string
  messageCount: number
  switchPersona: (id: string) => void
  resetSession: () => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      /* ... */
    }),
    {
      name: 'fmai-chatbot-state',
      partialize: (state) => ({
        histories: state.histories,
        sessionId: state.sessionId,
        messageCount: state.messageCount,
      }),
    }
  )
)
```

### Anti-Patterns to Avoid

- **Rendering message.content instead of message.parts**: AI SDK v6 deprecates content-based rendering. Parts contain both text and tool invocations — content misses tools.
- **Using toTextStreamResponse with useChat**: Won't transmit tool calls or structured data to the client. Must use toUIMessageStreamResponse.
- **Heavy Framer Motion on every message bubble**: CONTEXT.md specifies CSS fadeIn/slideUp. Only use Framer Motion for AnimatePresence (panel open/close) and FAB breathing.
- **Single flat message array for all personas**: Switching personas would lose conversation history. Use per-persona `histories` record in Zustand.
- **Passing conversationHistory manually in body**: useChat manages message state internally and sends messages in the request body. The engine needs to read from the messages array, not a separate conversationHistory field.

## Don't Hand-Roll

| Problem              | Don't Build                           | Use Instead                                                                  | Why                                                                                    |
| -------------------- | ------------------------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Chat streaming state | Custom EventSource + state management | `useChat` from `@ai-sdk/react`                                               | Handles SSE parsing, message accumulation, status tracking, tool calls, error recovery |
| Message transport    | Manual fetch + body serialization     | `DefaultChatTransport` from `ai`                                             | Handles reconnection, headers, body merging, request preparation                       |
| Markdown rendering   | Regex-based bold/list parser          | `react-markdown` (already installed)                                         | Handles edge cases, XSS-safe, extensible with plugins                                  |
| Scroll-to-bottom     | Manual scrollHeight tracking          | `useRef` + `scrollIntoView({ behavior: 'smooth' })` on message count change  | Simple, native, smooth                                                                 |
| Textarea auto-resize | Complex height calculation            | Set `height: auto` then `height = scrollHeight` in useEffect on input change | SKC pattern, proven simple                                                             |

**Key insight:** The Vercel AI SDK eliminates the need to build streaming infrastructure. The `useChat` hook manages the entire message lifecycle (send -> stream -> tool calls -> complete). The UI layer only needs to render `message.parts` and manage layout/styling.

## Common Pitfalls

### Pitfall 1: useChat API Configuration in v6

**What goes wrong:** Passing `api` and `body` directly to `useChat()` — these are no longer top-level options in AI SDK v6.
**Why it happens:** Most tutorials and examples online show the v4/v5 API where `api` was a direct option.
**How to avoid:** Always use `transport: new DefaultChatTransport({ api, body })` configuration.
**Warning signs:** TypeScript errors on `api` property, requests going to `/api/chat` instead of `/api/chatbot`.

### Pitfall 2: Rendering content Instead of parts

**What goes wrong:** Using `message.content` to render messages — misses tool invocations and structured parts entirely.
**Why it happens:** The older API used `content` as the primary text field. In v6, `parts` is the canonical rendering source.
**How to avoid:** Always iterate `message.parts` and render based on `part.type`. Text parts have `part.text`, tool parts have `part.toolName`, `part.state`, `part.output`.
**Warning signs:** Tool calls not appearing in chat, only plain text visible.

### Pitfall 3: sendMessage vs handleSubmit

**What goes wrong:** Using the old `handleSubmit` / `handleInputChange` pattern from v4/v5.
**Why it happens:** The AI SDK v6 removed built-in input state management. `useChat` no longer returns `input` or `handleInputChange`.
**How to avoid:** Manage input state locally with `useState`. Use `sendMessage({ text: input })` to send. Check `status !== 'ready'` to disable input.
**Warning signs:** TypeScript errors on destructuring `input` or `handleInputChange` from useChat.

### Pitfall 4: Engine toTextStreamResponse Incompatibility

**What goes wrong:** useChat receives plain text stream but expects UI message stream protocol with tool call parts.
**Why it happens:** Phase 15 set up `toTextStreamResponse` intentionally as a placeholder.
**How to avoid:** Switch engine.ts to `toUIMessageStreamResponse` as part of this phase.
**Warning signs:** Tool results never appearing in UI, messages arriving as raw text without structure.

### Pitfall 5: Body/Messages Conflict

**What goes wrong:** Sending `conversationHistory` in the transport body while useChat also sends messages.
**Why it happens:** Phase 15 engine expects a `conversationHistory` field in the request body. But useChat sends `messages` (UIMessage[]) automatically.
**How to avoid:** Update engine to use `convertToModelMessages(messages)` from the `ai` package instead of reading `conversationHistory`. Or: keep `conversationHistory` but populate it from the `messages` array server-side.
**Warning signs:** Duplicate messages, conversation context lost, engine receiving both fields.

### Pitfall 6: Zustand Store Collision

**What goes wrong:** The existing `chatStore.ts` (ARIA) and the new chatStore conflict on import paths or localStorage keys.
**Why it happens:** Both stores live at `src/stores/chatStore.ts` with different interfaces.
**How to avoid:** The old store uses localStorage key `fmai-chat-state`. New store should use `fmai-chatbot-state` (as specified in CONTEXT.md). During Phase 17, the old store is NOT removed (that happens in Phase 19). New store can coexist with a different export name (e.g., `useChatbotStore`) or the old store is replaced in-place since Phase 19 will remove all ARIA references.
**Warning signs:** Type conflicts, localStorage overwrite, import resolution errors.

### Pitfall 7: Z-Index Stacking

**What goes wrong:** Floating widget overlaps with existing ARIA FAB, navigation, or modals.
**Why it happens:** Both ARIA and new chatbot use high z-index values. The existing FAB uses z-[9999] on mobile and z-50 on desktop.
**How to avoid:** During Phase 17, the old ARIA components still exist (removed in Phase 19). The new floating widget should use matching z-index values so it can replace ARIA cleanly. Use the same z-index strategy: z-50 desktop panel, z-[9999] mobile FAB.
**Warning signs:** Widget appearing behind navigation, double FABs visible.

## Code Examples

### usePersonaChat Wrapper Hook

```typescript
// src/hooks/usePersonaChat.ts
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { useChatbotStore } from '../stores/chatStore'

export function usePersonaChat(personaId: string) {
  const { sessionId, messageCount } = useChatbotStore()

  const chat = useChat({
    id: `chat-${personaId}`,
    transport: new DefaultChatTransport({
      api: '/api/chatbot',
      body: {
        personaId,
        sessionId,
      },
    }),
    onFinish: () => {
      useChatbotStore.getState().incrementMessageCount()
    },
    onError: (error) => {
      console.error(`[chat-${personaId}]`, error)
    },
  })

  return {
    ...chat,
    messageCount,
    isAtLimit: messageCount >= 15,
  }
}
```

### ChatMessages with Parts Rendering

```typescript
// src/components/chatbot/ChatMessages.tsx
import type { UIMessage } from 'ai';
import { ToolResultRenderer } from './tool-results';

function MessageBubble({ message }: { message: UIMessage }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={isUser ? 'msg-user' : 'msg-assistant'}>
        {message.parts.map((part, i) => {
          if (part.type === 'text') {
            return <MarkdownContent key={i} text={part.text} />;
          }
          // Tool parts: render loading or result card
          if ('toolName' in part) {
            return <ToolResultRenderer key={i} part={part} />;
          }
          return null;
        })}
      </div>
    </div>
  );
}
```

### Tool Result Renderer (Router)

```typescript
// src/components/chatbot/tool-results/index.ts
import { ProductCard } from './ProductCard';
import { LeadScoreCard } from './LeadScoreCard';
import { KBArticleCard } from './KBArticleCard';
import { TicketCard } from './TicketCard';
import { ServiceCard } from './ServiceCard';

const TOOL_CARD_MAP: Record<string, React.ComponentType<{ data: unknown }>> = {
  search_products: ProductCard,
  get_product_details: ProductCard,
  build_routine: ProductCard,  // or RoutineCard
  qualify_lead: LeadScoreCard,
  get_roi_estimate: LeadScoreCard,
  search_knowledge_base: KBArticleCard,
  create_ticket: TicketCard,
  check_status: TicketCard,
  get_services: ServiceCard,
  get_case_study: ServiceCard,
};

export function ToolResultRenderer({ part }: { part: ToolUIPart }) {
  // Loading state
  if (part.state === 'input-streaming' || part.state === 'input-available') {
    return <ToolLoadingCard toolName={part.toolName} />;
  }
  // Error state
  if (part.state === 'output-error') {
    return <ToolErrorCard />;
  }
  // Result state — route to correct card
  const Card = TOOL_CARD_MAP[part.toolName];
  if (!Card) return null;
  return <Card data={part.output} />;
}
```

### Floating Panel with CSS Animations

```typescript
// Per CONTEXT.md: CSS fadeIn/slideUp, not heavy Framer Motion
// Use Framer Motion AnimatePresence ONLY for mount/unmount
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.25 }}
      className="fixed right-6 top-[10vh] w-[420px] h-[70vh]
                 bg-bg-surface/95 backdrop-blur-xl
                 border border-border-primary rounded-card
                 shadow-2xl flex flex-col overflow-hidden z-50"
      role="dialog"
      aria-label="Chat"
      aria-modal="true"
    >
      {/* Chat content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Message Bubble Styling (Living System)

```typescript
// User message: warm amber gradient
const userBubbleClass = `
  max-w-[85%] px-4 py-3 rounded-2xl rounded-tr-md
  bg-gradient-to-br from-accent-human/90 to-accent-human/70
  text-white font-sans text-sm
`

// Assistant message: glass with subtle border
const assistantBubbleClass = `
  max-w-[85%] px-4 py-3 rounded-2xl rounded-tl-md
  bg-bg-elevated/80 backdrop-blur-md
  border border-border-primary
  text-text-primary font-sans text-sm
`
```

## State of the Art

| Old Approach               | Current Approach                               | When Changed | Impact                                    |
| -------------------------- | ---------------------------------------------- | ------------ | ----------------------------------------- |
| useChat with `api` prop    | useChat with `transport: DefaultChatTransport` | AI SDK v5/v6 | Must use transport pattern                |
| message.content rendering  | message.parts rendering                        | AI SDK v5    | Parts contain text + tool invocations     |
| handleSubmit + input state | sendMessage + local useState                   | AI SDK v5/v6 | No built-in input management              |
| addToolResult              | addToolOutput                                  | AI SDK v6    | addToolResult deprecated                  |
| toDataStreamResponse       | toUIMessageStreamResponse                      | AI SDK v5/v6 | UIMessage stream is canonical for useChat |

**Deprecated/outdated:**

- `message.content` for rendering: replaced by `message.parts`
- `useChat({ api, body })` direct options: replaced by `transport`
- `handleInputChange` / `input` from useChat: removed, use local state
- `addToolResult`: deprecated, use `addToolOutput`
- `toDataStreamResponse`: replaced by `toUIMessageStreamResponse`

## Open Questions

1. **Engine request body compatibility**
   - What we know: Phase 15 engine reads `message`, `personaId`, `sessionId`, `conversationHistory` from the request body. useChat sends `messages` (UIMessage[]) automatically via DefaultChatTransport.
   - What's unclear: Whether the engine should be refactored to use `convertToModelMessages(messages)` from the `ai` package, or if the body.message field should be extracted from the last user message in the messages array.
   - Recommendation: Refactor engine to accept UIMessage[] from the `messages` field (sent by useChat) and use `convertToModelMessages` for the AI provider call. Keep `personaId` and `sessionId` as extra body fields.

2. **Coexistence with old chatStore**
   - What we know: Current `src/stores/chatStore.ts` serves ARIA. Phase 19 removes ARIA. Phase 17 needs a new store.
   - What's unclear: Whether to create a separate file (e.g., `chatbotStore.ts`) or replace the existing `chatStore.ts` in-place.
   - Recommendation: Create as `src/stores/chatStore.ts` replacing the old one. Phase 17 runs before Phase 19 (ARIA removal), but the old ARIA code won't break because it imports the old store — if the store is replaced, ARIA imports will fail. Safer to create a new file `src/stores/chatbotStore.ts` during Phase 17, then Phase 19 can remove the old `chatStore.ts` and optionally rename.

3. **useChat per-persona message isolation**
   - What we know: useChat manages its own internal message state. Different `id` values create separate chat instances.
   - What's unclear: Whether the Zustand store `histories` record should sync with useChat's internal state, or if useChat's `id` parameter (`chat-${personaId}`) is sufficient for isolation.
   - Recommendation: Use useChat's `id` for isolation. The Zustand store tracks UI state (isOpen, isMinimized, messageCount, sessionId) while useChat manages message state internally. No need to duplicate messages in Zustand.

## Sources

### Primary (HIGH confidence)

- [AI SDK Chatbot docs](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot) — useChat setup, message.parts rendering, sendMessage API
- [AI SDK useChat reference](https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat) — Full API reference, DefaultChatTransport, UIMessage types
- [AI SDK Chatbot Tool Usage](https://ai-sdk.dev/docs/ai-sdk-ui/chatbot-tool-usage) — Tool invocation states, onToolCall, addToolOutput
- [AI SDK Stream Protocol](https://ai-sdk.dev/docs/ai-sdk-ui/stream-protocol) — toUIMessageStreamResponse vs toTextStreamResponse compatibility
- Phase 15 engine code (`src/lib/chatbot/engine.ts`) — Current toTextStreamResponse, request body schema
- Phase 15 STATE.md decision — "[15-03]: toTextStreamResponse used for simplicity — Phase 17 can switch to toUIMessageStreamResponse if useChat adopted"

### Secondary (MEDIUM confidence)

- SKC SindyChat components — ChatWidget.tsx, ChatMessages.tsx, ChatInput.tsx, ToolResults/\*.tsx patterns
- Existing ARIA components — FloatingActionButton.tsx, ChatPanel.tsx positioning/animation patterns
- Project tailwind.config.js — Living System design tokens, card/btn border-radius, shadows

### Tertiary (LOW confidence)

- AI SDK v6 announcement blog — DefaultChatTransport migration details (may be pre-release info)

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - all libraries already installed, AI SDK v6 docs verified via official sources
- Architecture: HIGH - component structure locked in CONTEXT.md, patterns verified against AI SDK docs
- Pitfalls: HIGH - critical v6 migration pitfalls (transport, parts, sendMessage) verified against official docs, engine compatibility verified against actual Phase 15 code

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (30 days — AI SDK API is stable post-v6)
