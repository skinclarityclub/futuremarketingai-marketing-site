# Voice Demo Widget Redesign

**Date:** 2026-03-17
**Status:** Approved
**Scope:** Replace generic Vapi `<VapiWidget>` with custom premium voice demo experience

## Problem

The current `VoiceDemoWidget` uses the out-of-the-box `@vapi-ai/client-sdk-react` `<VapiWidget>` component — a generic floating button in the bottom-right corner. It doesn't match the Living System design language (dark theme, teal accents, glassmorphism, glow effects) and looks out of place on a premium product page.

## Solution

Replace with two custom components:

1. **Inline Demo Section** — a full-width section with phone mockup, placed after the hero
2. **Floating FAB** — appears only when the inline section scrolls out of view

Both share a single `useVapiCall` hook wrapping `@vapi-ai/web` SDK (already installed).

## Architecture

```
src/components/voice/
├── useVapiCall.ts           — Shared Vapi SDK hook
├── VoiceDemoSection.tsx     — Inline section (split layout: copy + phone)
├── VoiceDemoPhone.tsx       — Phone mockup with call UI states
├── VoiceDemoFAB.tsx         — Floating action button + compact panel
├── WaveformVisualizer.tsx   — Volume-reactive animated bars
└── CallTranscript.tsx       — Scrollable transcript area
```

## Component Details

### `useVapiCall` Hook

Wraps `@vapi-ai/web` SDK. Singleton — only one active call at a time.

```ts
interface UseVapiCall {
  state: 'idle' | 'connecting' | 'active' | 'ending'
  start: () => void
  stop: () => void
  volumeLevel: number // 0-1, from 'volume-level' event
  transcript: Message[] // { role: 'assistant'|'user', text: string }
  duration: number // seconds since call start
  error: string | null
}
```

Events consumed from Vapi SDK:

- `call-start` → state: connecting → active
- `call-end` → state: ending → idle
- `volume-level` → volumeLevel update
- `message` (type: transcript) → append to transcript
- `error` → set error string

### VoiceDemoSection (Inline)

Split layout: `grid md:grid-cols-2`, placed after hero section in `VoiceAgentsPage.tsx`.

**Left column:**

- Badge: "Live Demo" (accent-system bg)
- Heading: "Talk to Our AI Agent"
- Subtitle: descriptive text
- Feature bullets: responds in <1s, 24/7, real AI
- Phone number fallback: +1 (570) 783-8236

**Right column:**

- `VoiceDemoPhone` inside CSS phone mockup frame
- Phone frame: rounded-[2.5rem], border-zinc-700, bg-bg-deep

Uses `ref={demoSectionRef}` for IntersectionObserver (FAB visibility trigger).

### VoiceDemoPhone (Call UI States)

Three visual states based on `useVapiCall` state:

**Idle:**

- Dark background (bg-deep)
- Centered: teal glow circle with mic icon (agent avatar)
- "ARIA" name, "AI Voice Agent" subtitle
- Large round call button: bg-accent-system, shadow-glow, cta-pulse animation
- "Tap to start" helper text

**Connecting:**

- Same layout, call button shows spinner
- "Connecting..." text replaces subtitle
- Pulsing glow animation intensifies

**Active Call:**

- WaveformVisualizer at top: 20+ bars, height = volumeLevel mapping
- Call timer: mm:ss format, centered
- CallTranscript below: scrollable, chat-bubble style
  - User messages: right-aligned, accent-system/20 bg
  - AI messages: left-aligned, bg-surface bg
- Red end-call button: bg-error, centered at bottom

### VoiceDemoFAB (Floating)

- Position: fixed bottom-6 right-6
- Size: 56px circle
- Style: bg-accent-system, shadow-glow, mic icon
- Animation: cta-pulse when idle, solid glow when call active
- Visibility: IntersectionObserver on VoiceDemoSection ref
  - Hidden when inline section is in viewport
  - Slide-up animation when it appears

**Expanded panel (on click):**

- 320px wide, max-h-[480px]
- Position: fixed bottom-20 right-6
- Style: bg-bg-surface/90, backdrop-blur-xl, border-border-primary, rounded-card
- Contains: compact VoiceDemoPhone (scaled down)
- Close button: top-right corner
- Slide-up + fade-in animation

### WaveformVisualizer

- 24 vertical bars in a row
- Each bar: 3px wide, rounded-full, bg-accent-system
- Height: mapped from volumeLevel (0-1) with per-bar randomization
- Idle state: subtle ambient animation (low bars gently oscillating)
- Active state: bars react to real volume data
- Transition: smooth height transitions (transition-all duration-75)

### CallTranscript

- Scrollable container, max height constrained
- Auto-scrolls to bottom on new messages
- Message bubbles with role indicator
- Typing indicator when AI is processing

## Design Tokens Used

| Token          | Value                        | Usage                            |
| -------------- | ---------------------------- | -------------------------------- |
| bg-deep        | #0A0D14                      | Phone screen bg, section bg      |
| bg-surface     | #111520                      | AI message bubbles, FAB panel    |
| accent-system  | #00D4AA                      | Call button, waveform bars, glow |
| text-primary   | #E8ECF4                      | Headings, transcript text        |
| text-muted     | #5A6378                      | Subtitles, helper text           |
| border-primary | rgba(255,255,255,0.06)       | Card borders, FAB panel          |
| error          | #EF4444                      | End call button                  |
| shadow-glow    | 0 0 20px rgba(0,212,170,0.3) | Call button, FAB                 |
| rounded-card   | 20px                         | Section card, FAB panel          |
| font-display   | Space Grotesk                | Headings                         |
| font-sans      | DM Sans                      | Body text                        |

## Integration

### VoiceAgentsPage.tsx changes

```tsx
// Remove: <VapiWidget> import and usage
// Add: VoiceDemoSection after hero, VoiceDemoFAB at page level

<VoiceDemoSection />     {/* After hero, before use-cases */}
<VoiceDemoFAB />         {/* Fixed position, auto-hides */}
```

### Removed

- `VoiceDemoWidget.tsx` (current file) — deleted entirely
- `@vapi-ai/client-sdk-react` dependency can be removed from package.json

### Kept

- `@vapi-ai/web` SDK — used by `useVapiCall` hook
- `VITE_VAPI_PUBLIC_KEY` and `VITE_VAPI_DEMO_ASSISTANT_ID` env vars

## Accessibility

- Call button: `aria-label="Start voice call with AI agent"`
- End button: `aria-label="End call"`
- Waveform: `aria-hidden="true"` (decorative)
- Transcript: `role="log"`, `aria-live="polite"`
- FAB: `aria-label="Open voice demo"`
- Focus management: focus call button when panel opens
