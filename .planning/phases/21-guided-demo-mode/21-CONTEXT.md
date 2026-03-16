---
title: 'Phase 21: Guided Demo Mode - Context'
tags:
  - phase-21
  - chatbot
  - demo
  - guided-demo
created: 2026-03-16
source: user conversation + brainstorming session
---

# Phase 21: Guided Demo Mode - Context

**Gathered:** 2026-03-16
**Status:** Ready for execution

<domain>
## Phase Boundary

Add a **Guided Demo Mode** to the flagship concierge chatbot that walks prospects through realistic business scenarios with a single button press. The demo showcases all chatbot capabilities (tools, side panel, booking) using **real AI responses** with **scripted user messages** — a hybrid orchestration approach.

**What this phase delivers:**

- Two demo entry points (welcome message CTA + suggested prompt)
- Three scenario-based demo flows (New Client Journey, E-commerce Brand, Client Support)
- Real AI tool calls with real streaming responses (not mocked)
- Checkpoint system for user control (next, skip, end)
- Progress indicator with animated step dots
- BookingCard with embedded Calendly iframe in side panel
- Scenario completion card with social proof and CTAs
- Premium UX: pulsing CTA glow, staggered animations, tool execution transparency

**No backend changes required** — uses the existing `/api/chatbot` endpoint with the flagship persona.

</domain>

<decisions>
## Implementation Decisions

### Approach: Hybrid Orchestration

- **Scripted skeleton + real AI tool calls** — frontend orchestrates the flow (timing, steps, checkpoints) but sends real messages to the API
- User messages are pre-scripted; AI responses are live with real tool calls
- Feels 100% authentic — indistinguishable from a real conversation
- Cost: ~$0.03 per full demo run (haiku)

### Entry Points

- **Both simultaneously active:**
  1. Welcome message CTA — "Take a guided tour" button in welcome bubble
  2. Suggested prompt — "Start guided demo" in suggested prompts list
- Both trigger the same `startDemo()` action on the Zustand store

### Scenario-Based (Not Feature-by-Feature)

- Three scenarios, each telling a realistic business story
- Research shows scenario-based demos get 3-5x longer engagement, 40-60% higher completion vs feature-by-feature
- User picks a scenario from selection cards displayed in chat

### Scenarios

1. **"The New Client Journey"** (6 steps) — Prospect discovers and evaluates FMai. Tools: get_services, get_case_study, get_roi_estimate, get_pricing_info, qualify_lead, book_call
2. **"E-commerce Brand in Action"** (6 steps) — Skincare brand explores FMai capabilities. Tools: search_products, build_routine, explain_module, get_roi_info, get_case_study, book_call
3. **"Client Support Experience"** (4 steps) — Existing client needs help. Tools: search_knowledge_base, create_ticket, check_status, escalate_to_human

### Booking in Side Panel

- `book_call` moves from `INLINE_TOOLS` to `SIDE_PANEL_TOOLS`
- New `BookingCard` component renders embedded Calendly iframe (400px wide, dark theme)
- All three scenarios end with the calendar open — a powerful closer
- Fallback: if iframe fails to load, show styled CTA button linking to Calendly

### State Management

- Demo state is **ephemeral** (not persisted to localStorage)
- Extends existing `chatbotStore` with: demoMode, demoScenarioId, demoStepIndex, demoStatus, demoStartedAt
- Actions: startDemo, selectScenario, advanceStep, setDemoStatus, endDemo

### Premium UX

- Progress dots with cyan-to-purple gradient, animated checkmarks
- Checkpoint buttons with pulsing cyan glow after 2s inactivity
- Scenario cards with hover effects (border glow, slight lift)
- Completion card with social proof ("86% of prospects book after this demo")
- Tool execution transparency: "Calling [Tool Name]..." with pulsing dot
- Post-booking celebration planned for v2

### Claude's Discretion

- Exact timing values for pacing (design doc provides recommendations)
- How to handle edge cases (user closes chatbot mid-demo, rapid clicking)
- Whether to add barrel exports for demo components

</decisions>

<specifics>
## Specific Ideas

- DemoOrchestrator is a React component rendered inside ChatWidget, not a standalone system
- It watches `useChat` status — when `status === 'ready'` after a step, triggers checkpoint or auto-advance
- Scripted user messages sent via the same `sendMessage({ text })` function as normal messages
- The "DEMO" badge replaces "Concierge" badge in ChatHeader during demo mode
- Side panel LEFT of chat (already implemented in Phase 20 bugfix session)
- Calendly URL: `https://calendly.com/futuremarketingai/discovery` with dark theme params

</specifics>

<deferred>
## Deferred Ideas (v2 Premium Upgrades)

- Optional sound design (toggle in header): subtle tones for message arrival, tool execution, checkpoints
- Haptic feedback via Vibration API
- Sentiment arc visualization (thin gradient line showing conversation journey)
- Connective animated lines from chat messages to side panel cards
- Post-booking celebration: checkmark draw animation, typewriter text, particle burst
- Staggered card entry: heading instant, body line-by-line (80ms delay), CTA with glow
- Cards with perspective tilt (rotateY: -8deg to 0deg) + shadow depth increase

</deferred>

---

_Phase: 21-guided-demo-mode_
_Context gathered: 2026-03-16 via brainstorming session_
