---
title: Guided Demo Mode — Flagship Chatbot
tags: [chatbot, demo, flagship, design]
created: 2026-03-16
source: brainstorming session
---

# Guided Demo Mode — Design Document

## Overview

A "Guided Demo" feature for the flagship concierge chatbot that walks prospects through realistic business scenarios, showcasing all chatbot capabilities (tools, side panel, booking) with a single button press.

## Approach: Hybrid Orchestration

**Scripted skeleton + real AI tool calls.** The frontend orchestrates the flow (timing, steps, checkpoints) but sends real messages to the API. The AI responds authentically with real tool calls and streaming responses. User messages are pre-scripted; AI responses are live.

**Why hybrid:**

- Feels 100% authentic — real AI, real tools, real side panels
- Controlled flow — we determine which questions get asked
- Branching works — user can choose at checkpoints
- Premium feel — indistinguishable from a real conversation
- Cost: ~$0.03 per full demo run (haiku)

## Entry Points

Two entry points, both active simultaneously:

1. **Welcome message CTA** — The welcome bubble includes a "Start guided demo" button
2. **Suggested prompt** — One of the suggested prompts reads "Start guided demo"

Both trigger the same `startDemo()` action on the Zustand store.

## Scenarios

Three scenario-based flows, each telling a realistic business story. User picks one from scenario selection cards.

### Scenario 1: "The New Client Journey" (6 steps)

A prospect discovers FMai and evaluates the platform.

| Step | User Message                                                        | Expected Tool      | Display                     |
| ---- | ------------------------------------------------------------------- | ------------------ | --------------------------- |
| 1    | "What services does FMai offer?"                                    | `get_services`     | Side panel                  |
| 2    | "Do you have any case studies?"                                     | `get_case_study`   | Side panel                  |
| 3    | "How much could we save with AI marketing?"                         | `get_roi_estimate` | Side panel                  |
| —    | **Checkpoint**: "See pricing" / "Skip to booking" / "End demo"      |                    |                             |
| 4    | "What are your pricing plans?"                                      | `get_pricing_info` | Side panel                  |
| 5    | "Can you qualify our needs?"                                        | `qualify_lead`     | Side panel                  |
| —    | **Checkpoint**: "Book a call" / "Try another scenario" / "End demo" |                    |                             |
| 6    | "I'd like to book a discovery call"                                 | `book_call`        | Side panel (Calendly embed) |

### Scenario 2: "E-commerce Brand in Actie" (6 steps)

A skincare brand explores how FMai can help them grow.

| Step | User Message                                                             | Expected Tool     | Display                     |
| ---- | ------------------------------------------------------------------------ | ----------------- | --------------------------- |
| 1    | "Show me skincare products for dry skin"                                 | `search_products` | Side panel                  |
| 2    | "Build me a morning routine for sensitive skin"                          | `build_routine`   | Side panel                  |
| —    | **Checkpoint**: "See Marketing Machine" / "Skip to booking" / "End demo" |                   |                             |
| 3    | "What Marketing Machine modules would help us?"                          | `explain_module`  | Side panel                  |
| 4    | "Calculate the ROI for a team of 5"                                      | `get_roi_info`    | Side panel                  |
| —    | **Checkpoint**: "See case study" / "Book a call" / "End demo"            |                   |                             |
| 5    | "Show me how your case study client used this"                           | `get_case_study`  | Side panel                  |
| 6    | "Book a demo to see this in action"                                      | `book_call`       | Side panel (Calendly embed) |

### Scenario 3: "Client Support Experience" (4 steps)

An existing client needs help — showcases support capabilities.

| Step | User Message                                             | Expected Tool           | Display    |
| ---- | -------------------------------------------------------- | ----------------------- | ---------- |
| 1    | "I need help with my billing"                            | `search_knowledge_base` | Side panel |
| 2    | "That doesn't solve it, create a ticket"                 | `create_ticket`         | Inline     |
| —    | **Checkpoint**: "Check status" / "Escalate" / "End demo" |                         |            |
| 3    | "Can I check the status of my ticket?"                   | `check_status`          | Inline     |
| 4    | "I need to speak to someone"                             | `escalate_to_human`     | Inline     |

## Booking Side Panel (New)

`book_call` moves from `INLINE_TOOLS` to `SIDE_PANEL_TOOLS`. New `BookingCard` component renders an embedded Calendly iframe (400px wide) in the side panel. All three scenarios end with the calendar open — a powerful closer.

**Fallback:** If iframe fails to load, show a styled CTA button linking to Calendly.

## UI/UX Design

### Demo Mode Indicators

- **Header badge**: Small "DEMO" pill next to persona name when demo is active
- **Progress dots**: Segmented dots at bottom of chat area, fill with cyan-to-purple gradient as steps complete. Completed segments get a self-drawing SVG checkmark.

### Timing and Pacing

| Moment                               | Delay                    | Rationale                |
| ------------------------------------ | ------------------------ | ------------------------ |
| Scenario card selection to first msg | 500ms                    | Maintain momentum        |
| Scripted user message appears        | 300ms type-effect        | Feels natural            |
| AI response                          | Real streaming           | Authentic tool execution |
| Checkpoint buttons appear            | 800ms after AI ready     | Let content settle       |
| Side panel trigger                   | Immediate on tool output | Instant feedback         |

### Checkpoint Buttons

Appear in the chat flow after designated steps:

- **Primary**: "Next" (cyan accent, filled)
- **Secondary**: Context-specific option (outline)
- **Ghost**: "End demo" (subtle, low-contrast)

Buttons appear with subtle bounce animation (scale 0.9 to 1.0 to 0.98). After 2 seconds of inactivity, primary button gets a pulsing cyan border glow.

### Scenario Selection Cards

Three cards displayed in the chat area at demo start:

- Each card: icon + title + subtitle + step count
- Cards have hover effects (border glow, slight lift)
- Click triggers scenario selection

### Auto-Typing Effect

Scripted user messages appear with a 300ms typing simulation delay, so they don't feel instant/robotic.

## Premium Upgrades (v1)

### Staggered Card Entry

- Side panel cards: heading appears instant, body line-by-line (80ms delay), CTA last with glow
- Cards enter with perspective tilt (rotateY: -8deg to 0deg) + shadow depth increase

### Tool Execution Transparency

- Side panel shows "Calling [Tool Name]..." with pulsing dot during tool execution
- Result appears with self-drawing checkmark (200ms SVG animation)

### Post-Booking Celebration

- Checkmark draw animation (800ms SVG)
- Typewriter text: "Let's talk strategy" (1.5s)
- Calendly widget fades in (1.2s delay)
- Subtle geometric particle burst (40 particles, cyan/purple, 2.5s)

### Scenario Completion Card

- Inline card after final step: scenario name + completion time
- Social proof: "86% of prospects book after this demo"
- CTAs: "Try another scenario" / "Book a call"

## Premium Upgrades (v2 — Future)

- Optional sound design (toggle in header): subtle tones for message arrival, tool execution, checkpoints
- Haptic feedback via Vibration API
- Sentiment arc visualization (thin gradient line showing conversation journey)
- Connective animated lines from chat messages to side panel cards

## Technical Architecture

### New Components

```
src/components/chatbot/
  demo/
    DemoOrchestrator.tsx     — State machine, orchestrates the demo flow
    DemoScenarioCard.tsx     — Scenario selection card
    DemoCheckpoint.tsx       — Checkpoint buttons in chat
    DemoProgress.tsx         — Progress dots indicator
    DemoCompletionCard.tsx   — Scenario completion summary
    scenarios.ts             — Scenario definitions (pure data)
  tool-results/
    BookingCard.tsx           — Calendly embed card for side panel
```

### State Management (Zustand store extension)

```typescript
// Add to chatbotStore
demoMode: boolean
demoScenarioId: string | null
demoStepIndex: number
demoStatus: 'idle' | 'choosing' | 'running' | 'checkpoint' | 'completed'

// Actions
startDemo: () => void
selectScenario: (id: string) => void
advanceStep: () => void
endDemo: () => void
```

### Integration with Existing Chat

- `ChatWidget` checks `demoMode` — shows `DemoProgress` in header, `DemoCheckpoint` after AI responses
- `DemoOrchestrator` listens to `useChat` status — when `status === 'ready'` after a step, triggers checkpoint
- Scripted user messages sent via `sendMessage({ text })` — same function as normal messages
- No backend changes needed — uses same `/api/chatbot` endpoint with flagship persona

### Tool Routing Change

- `book_call` moves from `INLINE_TOOLS` to `SIDE_PANEL_TOOLS`
- New `BookingCard` added to `TOOL_CARD_MAP`
- `BookingCard` renders embedded Calendly iframe with fallback link

## Success Criteria

1. User can start a guided demo from welcome message or suggested prompts
2. Three scenarios available with realistic business narratives
3. Real AI responses with real tool calls (not mocked)
4. Side panel shows tool results with premium animations
5. Checkpoints allow user control (next, skip, end)
6. Progress indicator shows current position
7. Booking calendar embedded in side panel as finale
8. Demo mode clearly indicated (header badge)
9. Completion card with social proof and next-step CTAs
