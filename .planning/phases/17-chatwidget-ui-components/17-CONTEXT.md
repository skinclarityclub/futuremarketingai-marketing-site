# Phase 17: ChatWidget UI Components — Context

## Goal

Build a single, configurable ChatWidget React component supporting two modes: floating (FAB + panel, for concierge and demo-guide) and embedded (inline, for /chatbots demo playground). Uses Vercel AI SDK `useChat` hook for streaming. Renders tool results as visual cards in the Living System design language.

## Design Reference

- Full design: `docs/plans/2026-03-13-chatbot-showcase-design.md`

## Two Widget Modes

### Floating Mode (Concierge + Demo Guide)

- Fixed-position FAB button (bottom-right on mobile, right-middle on desktop)
- Glassmorphic floating panel that slides in on click
- Minimize/close controls
- Preview bubble with greeting (desktop only, after 5s delay)
- Unread message badge

### Embedded Mode (Demo Playground)

- Inline component within page layout
- No FAB, no floating — rendered inside DemoPlayground container
- Fixed height with scrollable messages
- Side-by-side with context card

## Component Architecture

```
ChatWidget.tsx (main — mode: 'floating' | 'embedded')
├── FloatingButton.tsx (FAB, only in floating mode)
├── ChatHeader.tsx (persona name/avatar, minimize/close, demo badge)
├── ChatMessages.tsx (message list with streaming)
│   ├── UserMessage
│   ├── AssistantMessage (with streaming text)
│   ├── ToolResultRenderer (routes to correct card)
│   └── SuggestedPrompts (conversation starters)
├── ChatInput.tsx (text input + send button)
└── tool-results/
    ├── ProductCard.tsx (e-commerce: image, price, rating, CTA)
    ├── LeadScoreCard.tsx (lead-gen: score /100, stage, recommendation)
    ├── KBArticleCard.tsx (support: title, snippet, source)
    ├── TicketCard.tsx (support: ID, status, category, priority)
    ├── ServiceCard.tsx (concierge: FMai service info)
    └── index.ts (ToolResultRenderer + barrel exports)
```

## Streaming Implementation

### usePersonaChat Hook

Wraps Vercel AI SDK's `useChat`:

```typescript
const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
  api: '/api/chatbot',
  body: { personaId, sessionId, context },
  onToolCall: (toolCall) => {
    // Render tool result card inline
  },
})
```

### Streaming UX

- First token appears in <500ms (perceived speed)
- Typing indicator while waiting for first token
- Text streams in character-by-character
- Tool calls render as loading cards, then populate with results
- Smooth scroll-to-bottom on new messages

## State Management

### New chatStore (Zustand)

```typescript
{
  // Per-persona chat histories
  histories: Record<PersonaId, Message[]>,

  // Active persona
  activePersonaId: PersonaId,

  // UI state
  isOpen: boolean,        // floating mode only
  isMinimized: boolean,   // floating mode only

  // Session
  sessionId: string,
  messageCount: number,   // for demo limits

  // Actions
  switchPersona: (id) => void,
  resetSession: () => void,
}
```

Persisted to localStorage with `fmai-chatbot-state` key.

## Design System (Living System)

- **Background**: `#0A0E27` (surface)
- **Message bubbles**: User = warm gradient (amber), Assistant = glass (backdrop-blur + subtle border)
- **Accent**: `#00D4FF` (cyan) for links/interactive, `#A855F7` (purple) for highlights
- **Typography**: DM Sans for messages, JetBrains Mono for tool result data
- **Cards**: Gradient border-on-hover pattern (::before pseudo-element)
- **Animations**: CSS fadeIn/slideUp, no heavy Framer Motion
- **FAB**: Warm gradient button with breathing animation
- **Demo badge**: Subtle indicator "Demo Mode · 12/15 messages"

## SKC Code to Reference for UI Patterns

- `C:\Users\daley\Desktop\skinclarityclub\src\components\SindyChat\ChatWidget.tsx` — Widget layout, mobile detection, tab switching
- `C:\Users\daley\Desktop\skinclarityclub\src\components\SindyChat\ChatMessages.tsx` — Streaming message rendering
- `C:\Users\daley\Desktop\skinclarityclub\src\components\SindyChat\ChatInput.tsx` — Auto-resize input
- `C:\Users\daley\Desktop\skinclarityclub\src\components\SindyChat\ToolResults\` — Tool result card patterns

## Current ARIA UI to Reference (for feature parity)

- `C:\Users\daley\Desktop\Futuremarketingai\src\components\ai-assistant\FloatingActionButton.tsx` — FAB positioning, sizing, animations
- `C:\Users\daley\Desktop\Futuremarketingai\src\components\ai-assistant\ChatPanel.tsx` — Panel layout, desktop/mobile
- `C:\Users\daley\Desktop\Futuremarketingai\src\components\ai-assistant\messages\QuickReplies.tsx` — Suggested action buttons
- `C:\Users\daley\Desktop\Futuremarketingai\src\components\ai-assistant\messages\RichCard.tsx` — Card message pattern

## Accessibility

- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Escape to close)
- Focus management when panel opens/closes
- Screen reader support for streaming messages
- Reduced motion support

## Files to Create

```
src/components/chatbot/ChatWidget.tsx        — Main widget (floating + embedded)
src/components/chatbot/ChatMessages.tsx      — Message list + streaming
src/components/chatbot/ChatInput.tsx         — Input + suggested prompts
src/components/chatbot/ChatHeader.tsx        — Header with persona info + controls
src/components/chatbot/FloatingButton.tsx    — FAB for floating mode
src/components/chatbot/SuggestedPrompts.tsx  — Conversation starter pills
src/components/chatbot/tool-results/ProductCard.tsx
src/components/chatbot/tool-results/LeadScoreCard.tsx
src/components/chatbot/tool-results/KBArticleCard.tsx
src/components/chatbot/tool-results/TicketCard.tsx
src/components/chatbot/tool-results/ServiceCard.tsx
src/components/chatbot/tool-results/index.ts
src/components/chatbot/index.ts              — Barrel exports
src/stores/chatStore.ts                      — New per-persona Zustand store
src/hooks/usePersonaChat.ts                  — Vercel AI SDK wrapper hook
```
