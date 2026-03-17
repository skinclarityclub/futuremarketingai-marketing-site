# Voice Demo Widget Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace generic Vapi `<VapiWidget>` with a custom phone-mockup inline demo section + smart floating FAB, using the Living System design language.

**Architecture:** Custom `useVapiCall` hook wrapping `@vapi-ai/web` SDK provides shared call state. Two UI components consume it: `VoiceDemoSection` (inline, after hero) and `VoiceDemoFAB` (floating, appears when inline scrolls out). Existing `useIntersectionObserver` hook handles FAB visibility.

**Tech Stack:** React, `@vapi-ai/web` 2.5.2, Tailwind CSS (Living System tokens), Framer Motion, Lucide icons

**Design doc:** `docs/plans/2026-03-17-voice-demo-widget-redesign.md`

---

### Task 1: Create `useVapiCall` hook

**Files:**

- Create: `src/hooks/useVapiCall.ts`

**Step 1: Create the hook file**

```ts
import { useCallback, useEffect, useRef, useState } from 'react'
import Vapi from '@vapi-ai/web'

export interface TranscriptMessage {
  role: 'assistant' | 'user'
  text: string
  timestamp: number
}

export type CallState = 'idle' | 'connecting' | 'active' | 'ending'

export interface UseVapiCallReturn {
  state: CallState
  start: () => void
  stop: () => void
  volumeLevel: number
  transcript: TranscriptMessage[]
  duration: number
  error: string | null
}

export function useVapiCall(): UseVapiCallReturn {
  const vapiRef = useRef<Vapi | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTimeRef = useRef<number>(0)

  const [state, setState] = useState<CallState>('idle')
  const [volumeLevel, setVolumeLevel] = useState(0)
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([])
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)

  // Initialize Vapi instance once
  useEffect(() => {
    const publicKey = import.meta.env.VITE_VAPI_PUBLIC_KEY
    if (!publicKey) {
      console.warn('[useVapiCall] Missing VITE_VAPI_PUBLIC_KEY')
      return
    }
    vapiRef.current = new Vapi(publicKey)

    const vapi = vapiRef.current

    vapi.on('call-start', () => {
      setState('active')
      startTimeRef.current = Date.now()
      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000))
      }, 1000)
    })

    vapi.on('call-end', () => {
      setState('idle')
      setVolumeLevel(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    })

    vapi.on('volume-level', (level: number) => {
      setVolumeLevel(level)
    })

    vapi.on('message', (msg: any) => {
      if (msg.type === 'transcript' && msg.transcriptType === 'final') {
        setTranscript((prev) => [
          ...prev,
          {
            role: msg.role === 'assistant' ? 'assistant' : 'user',
            text: msg.transcript,
            timestamp: Date.now(),
          },
        ])
      }
    })

    vapi.on('error', (err: any) => {
      console.error('[useVapiCall] Error:', err)
      setError(typeof err === 'string' ? err : err?.message || 'Call failed')
      setState('idle')
    })

    return () => {
      vapi.removeAllListeners()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const start = useCallback(() => {
    const assistantId = import.meta.env.VITE_VAPI_DEMO_ASSISTANT_ID
    if (!vapiRef.current || !assistantId) {
      setError('Voice demo not configured')
      return
    }
    setError(null)
    setTranscript([])
    setDuration(0)
    setState('connecting')
    vapiRef.current.start(assistantId)
  }, [])

  const stop = useCallback(() => {
    if (!vapiRef.current) return
    setState('ending')
    vapiRef.current.stop()
  }, [])

  return { state, start, stop, volumeLevel, transcript, duration, error }
}
```

**Step 2: Export from hooks index**

In `src/hooks/index.ts`, add:

```ts
export { useVapiCall } from './useVapiCall'
```

**Step 3: Commit**

```bash
git add src/hooks/useVapiCall.ts src/hooks/index.ts
git commit -m "feat: add useVapiCall hook wrapping @vapi-ai/web SDK"
```

---

### Task 2: Create `WaveformVisualizer` component

**Files:**

- Create: `src/components/voice/WaveformVisualizer.tsx`

**Step 1: Create the waveform component**

```tsx
import { useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

interface WaveformVisualizerProps {
  volumeLevel: number // 0-1
  isActive: boolean
  barCount?: number
  className?: string
}

export function WaveformVisualizer({
  volumeLevel,
  isActive,
  barCount = 24,
  className,
}: WaveformVisualizerProps) {
  const barsRef = useRef<number[]>(Array.from({ length: barCount }, () => Math.random() * 0.3))

  // Update bar heights based on volume
  useEffect(() => {
    if (isActive) {
      barsRef.current = Array.from({ length: barCount }, (_, i) => {
        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2)
        const base = volumeLevel * (1 - centerDistance * 0.5)
        const jitter = (Math.random() - 0.5) * 0.3
        return Math.max(0.08, Math.min(1, base + jitter))
      })
    } else {
      barsRef.current = Array.from({ length: barCount }, (_, i) => {
        const centerDistance = Math.abs(i - barCount / 2) / (barCount / 2)
        return 0.08 + (1 - centerDistance) * 0.12
      })
    }
  }, [volumeLevel, isActive, barCount])

  return (
    <div
      className={cn('flex items-center justify-center gap-[3px] h-16', className)}
      aria-hidden="true"
    >
      {barsRef.current.map((height, i) => (
        <div
          key={i}
          className="w-[3px] rounded-full bg-accent-system transition-all duration-75"
          style={{
            height: `${height * 100}%`,
            opacity: isActive ? 0.6 + height * 0.4 : 0.3,
          }}
        />
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/voice/WaveformVisualizer.tsx
git commit -m "feat: add WaveformVisualizer component with volume-reactive bars"
```

---

### Task 3: Create `CallTranscript` component

**Files:**

- Create: `src/components/voice/CallTranscript.tsx`

**Step 1: Create the transcript component**

```tsx
import { useEffect, useRef } from 'react'
import type { TranscriptMessage } from '../../hooks/useVapiCall'
import { cn } from '../../utils/cn'

interface CallTranscriptProps {
  messages: TranscriptMessage[]
  className?: string
}

export function CallTranscript({ messages, className }: CallTranscriptProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages.length])

  if (messages.length === 0) return null

  return (
    <div
      ref={scrollRef}
      className={cn('flex-1 overflow-y-auto space-y-2 px-3 py-2 scrollbar-hide', className)}
      role="log"
      aria-live="polite"
      aria-label="Call transcript"
    >
      {messages.map((msg, i) => (
        <div
          key={i}
          className={cn(
            'max-w-[85%] px-3 py-1.5 rounded-lg text-xs leading-relaxed',
            msg.role === 'user'
              ? 'ml-auto bg-accent-system/15 text-text-primary'
              : 'mr-auto bg-bg-elevated text-text-secondary'
          )}
        >
          {msg.text}
        </div>
      ))}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/voice/CallTranscript.tsx
git commit -m "feat: add CallTranscript component with auto-scroll"
```

---

### Task 4: Create `VoiceDemoPhone` component

**Files:**

- Create: `src/components/voice/VoiceDemoPhone.tsx`

**Step 1: Create the phone call UI component**

This is the core component that renders inside the phone mockup frame. Three states: idle, connecting, active.

```tsx
import { Mic, PhoneOff, Loader2 } from 'lucide-react'
import { WaveformVisualizer } from './WaveformVisualizer'
import { CallTranscript } from './CallTranscript'
import type { UseVapiCallReturn } from '../../hooks/useVapiCall'
import { cn } from '../../utils/cn'

interface VoiceDemoPhoneProps {
  call: UseVapiCallReturn
  compact?: boolean
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function VoiceDemoPhone({ call, compact = false }: VoiceDemoPhoneProps) {
  const { state, start, stop, volumeLevel, transcript, duration, error } = call
  const isIdle = state === 'idle'
  const isConnecting = state === 'connecting'
  const isActive = state === 'active'
  const isEnding = state === 'ending'

  return (
    <div
      className={cn(
        'flex flex-col bg-bg-deep text-text-primary overflow-hidden',
        compact ? 'h-[400px] w-[280px]' : 'h-[520px] w-[280px]'
      )}
    >
      {/* Header */}
      <div className="flex flex-col items-center pt-8 pb-4 px-4 flex-shrink-0">
        {/* Agent avatar */}
        <div
          className={cn(
            'relative w-20 h-20 rounded-full flex items-center justify-center mb-3 transition-all duration-500',
            isActive ? 'bg-accent-system/20 shadow-glow' : 'bg-accent-system/10'
          )}
        >
          <div
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center',
              isActive ? 'bg-accent-system/30' : 'bg-accent-system/15'
            )}
          >
            <Mic
              className={cn(
                'w-7 h-7 transition-colors',
                isActive ? 'text-accent-system' : 'text-accent-system/60'
              )}
            />
          </div>
          {/* Pulse ring when active */}
          {isActive && (
            <div className="absolute inset-0 rounded-full border-2 border-accent-system/40 animate-ping" />
          )}
        </div>

        <span className="text-sm font-display font-semibold text-text-primary">ARIA</span>
        <span className="text-xs text-text-muted">
          {isIdle && 'AI Voice Agent'}
          {isConnecting && 'Connecting...'}
          {isActive && formatDuration(duration)}
          {isEnding && 'Ending call...'}
        </span>
      </div>

      {/* Waveform (active state) */}
      {(isActive || isConnecting) && (
        <div className="px-4 flex-shrink-0">
          <WaveformVisualizer
            volumeLevel={volumeLevel}
            isActive={isActive}
            barCount={compact ? 16 : 24}
          />
        </div>
      )}

      {/* Transcript area */}
      {isActive && transcript.length > 0 && (
        <CallTranscript messages={transcript} className="mt-2 flex-1 min-h-0" />
      )}

      {/* Spacer for idle state */}
      {isIdle && <div className="flex-1" />}

      {/* Error message */}
      {error && (
        <div className="mx-4 mb-2 px-3 py-2 bg-error/10 border border-error/20 rounded-lg text-xs text-error text-center">
          {error}
        </div>
      )}

      {/* Call button area */}
      <div className="flex flex-col items-center pb-8 pt-4 flex-shrink-0">
        {isIdle || isConnecting ? (
          <>
            <button
              onClick={start}
              disabled={isConnecting}
              className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
                'bg-accent-system hover:bg-accent-system/90 shadow-glow',
                isConnecting ? 'opacity-70' : 'cta-pulse'
              )}
              aria-label="Start voice call with AI agent"
            >
              {isConnecting ? (
                <Loader2 className="w-7 h-7 text-bg-deep animate-spin" />
              ) : (
                <Mic className="w-7 h-7 text-bg-deep" />
              )}
            </button>
            {isIdle && <span className="text-[11px] text-text-muted mt-2">Tap to start</span>}
          </>
        ) : (
          <button
            onClick={stop}
            disabled={isEnding}
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300',
              'bg-error hover:bg-error/90',
              isEnding && 'opacity-70'
            )}
            aria-label="End call"
          >
            <PhoneOff className="w-7 h-7 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/voice/VoiceDemoPhone.tsx
git commit -m "feat: add VoiceDemoPhone with idle/connecting/active states"
```

---

### Task 5: Create `PhoneMockup` wrapper component

**Files:**

- Create: `src/components/voice/PhoneMockup.tsx`

**Step 1: Create phone frame component**

Adapted from fma-app's PhoneMockup but styled for the Living System dark theme.

```tsx
import { cn } from '../../utils/cn'

interface PhoneMockupProps {
  children: React.ReactNode
  className?: string
}

export function PhoneMockup({ children, className }: PhoneMockupProps) {
  return (
    <div className={cn('relative inline-block', className)}>
      {/* Phone border */}
      <div className="absolute inset-0 rounded-[2.5rem] border-[6px] border-zinc-700/80 bg-bg-deep z-10 pointer-events-none shadow-2xl">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-4 bg-bg-deep rounded-b-xl" />
        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-zinc-600 rounded-full" />
      </div>
      {/* Screen content */}
      <div className="rounded-[2rem] overflow-hidden relative z-0">{children}</div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/voice/PhoneMockup.tsx
git commit -m "feat: add PhoneMockup frame component for Living System theme"
```

---

### Task 6: Create `VoiceDemoSection` inline component

**Files:**

- Create: `src/components/voice/VoiceDemoSection.tsx`

**Step 1: Create the inline demo section**

```tsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Phone, Zap, Clock, Bot } from 'lucide-react'
import { useVapiCall } from '../../hooks/useVapiCall'
import { PhoneMockup } from './PhoneMockup'
import { VoiceDemoPhone } from './VoiceDemoPhone'

interface VoiceDemoSectionProps {
  sectionRef?: React.RefObject<HTMLElement>
}

const features = [
  { icon: Zap, text: 'Responds in <1 second' },
  { icon: Clock, text: 'Available 24/7' },
  { icon: Bot, text: 'Real AI — not a phone menu' },
]

export function VoiceDemoSection({ sectionRef }: VoiceDemoSectionProps) {
  const call = useVapiCall()

  return (
    <section
      ref={sectionRef as React.RefObject<HTMLDivElement>}
      className="py-16 px-12"
      id="live-demo"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-6">
              <Phone className="w-4 h-4 text-accent-system" />
              <span className="text-sm font-medium text-text-secondary">Live Demo</span>
            </div>

            <h2 className="text-3xl md:text-4xl font-bold font-display text-text-primary mb-4">
              Talk to Our AI Agent
            </h2>

            <p className="text-lg text-text-muted leading-relaxed mb-8">
              Experience a real conversation with our AI voice agent. No signup required — just tap
              the button and start talking.
            </p>

            <ul className="space-y-4 mb-8">
              {features.map(({ icon: Icon, text }, i) => (
                <li key={i} className="flex items-center gap-3 text-text-secondary">
                  <div className="w-8 h-8 rounded-lg bg-accent-system/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-accent-system" />
                  </div>
                  {text}
                </li>
              ))}
            </ul>

            {/* Phone number fallback */}
            <div className="flex items-center gap-3 bg-white/[0.02] border border-border-primary rounded-card px-5 py-3 w-fit">
              <Phone className="w-4 h-4 text-accent-system" />
              <div>
                <p className="text-xs text-text-muted">Or call directly:</p>
                <a
                  href="tel:+15707838236"
                  className="text-sm font-semibold text-text-primary hover:text-accent-system transition-colors"
                >
                  +1 (570) 783-8236
                </a>
              </div>
            </div>
          </motion.div>

          {/* Right: Phone mockup */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <PhoneMockup>
              <VoiceDemoPhone call={call} />
            </PhoneMockup>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/voice/VoiceDemoSection.tsx
git commit -m "feat: add VoiceDemoSection inline demo with phone mockup"
```

---

### Task 7: Create `VoiceDemoFAB` floating component

**Files:**

- Create: `src/components/voice/VoiceDemoFAB.tsx`

**Step 1: Create the FAB with expandable panel**

```tsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, X } from 'lucide-react'
import { useVapiCall } from '../../hooks/useVapiCall'
import { VoiceDemoPhone } from './VoiceDemoPhone'
import { cn } from '../../utils/cn'

interface VoiceDemoFABProps {
  visible: boolean
}

export function VoiceDemoFAB({ visible }: VoiceDemoFABProps) {
  const [expanded, setExpanded] = useState(false)
  const call = useVapiCall()
  const isInCall = call.state === 'active' || call.state === 'connecting'

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Expanded panel */}
          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="fixed bottom-24 right-6 z-50 bg-bg-surface/95 backdrop-blur-xl border border-border-primary rounded-card shadow-2xl overflow-hidden"
              >
                {/* Close button */}
                <button
                  onClick={() => setExpanded(false)}
                  className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  aria-label="Close voice demo"
                >
                  <X className="w-4 h-4 text-text-muted" />
                </button>

                <VoiceDemoPhone call={call} compact />
              </motion.div>
            )}
          </AnimatePresence>

          {/* FAB button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            onClick={() => setExpanded(!expanded)}
            className={cn(
              'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300',
              expanded
                ? 'bg-white/10 border border-border-primary'
                : isInCall
                  ? 'bg-accent-system shadow-glow animate-glow-pulse'
                  : 'bg-accent-system shadow-glow-sm hover:shadow-glow cta-pulse'
            )}
            aria-label={expanded ? 'Close voice demo' : 'Open voice demo'}
          >
            {expanded ? (
              <X className="w-5 h-5 text-text-primary" />
            ) : (
              <Mic className={cn('w-5 h-5', isInCall ? 'text-bg-deep' : 'text-bg-deep')} />
            )}
          </motion.button>
        </>
      )}
    </AnimatePresence>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/voice/VoiceDemoFAB.tsx
git commit -m "feat: add VoiceDemoFAB with expandable call panel"
```

---

### Task 8: Integrate into VoiceAgentsPage

**Files:**

- Modify: `src/pages/VoiceAgentsPage.tsx`
- Modify: `src/components/voice/VoiceDemoWidget.tsx` (delete)

**Step 1: Check the `cn` utility exists**

The components use a `cn` utility. Check if it exists at `src/utils/cn.ts`. If not, create it:

```ts
// src/utils/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

If `clsx` and `tailwind-merge` are not installed, use simple string concatenation instead — replace all `cn()` calls with template literals.

**Step 2: Update VoiceAgentsPage.tsx**

Replace the current Vapi widget integration:

1. Remove the lazy import of `VoiceDemoWidget`
2. Remove the `<Suspense><VoiceDemoWidget /></Suspense>` at the bottom
3. Remove the phone number display from the hero (it's now in the demo section)
4. Add `VoiceDemoSection` after the hero section
5. Add `VoiceDemoFAB` with IntersectionObserver visibility

Changes to `src/pages/VoiceAgentsPage.tsx`:

**Remove these lines:**

```tsx
const VoiceDemoWidget = lazy(() =>
  import('../components/voice/VoiceDemoWidget').then((m) => ({ default: m.VoiceDemoWidget }))
)
```

**Remove at bottom of file:**

```tsx
{
  /* Floating voice demo widget */
}
;<Suspense fallback={null}>
  <VoiceDemoWidget />
</Suspense>
```

**Remove from hero section** (the phone number card at lines ~121-134):

```tsx
{/* Live Demo Section */}
<div
  className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-6"
  ...
```

**Add imports:**

```tsx
import { useRef } from 'react'
import { VoiceDemoSection } from '../components/voice/VoiceDemoSection'
import { VoiceDemoFAB } from '../components/voice/VoiceDemoFAB'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
```

**Add inside component, before the return:**

```tsx
const [demoRef, isDemoVisible] = useIntersectionObserver<HTMLElement>({
  threshold: 0.1,
})
```

**Add after the hero `</section>` and before the use-cases section:**

```tsx
{
  /* Interactive Demo */
}
;<VoiceDemoSection sectionRef={demoRef} />
```

**Add before the closing `</>` (replacing the old VoiceDemoWidget):**

```tsx
{
  /* Floating FAB — appears when demo section scrolls out */
}
;<VoiceDemoFAB visible={!isDemoVisible} />
```

**Step 3: Delete old VoiceDemoWidget**

Delete `src/components/voice/VoiceDemoWidget.tsx`.

**Step 4: Run dev server and verify**

Run: `npm run dev` in the Futuremarketingai directory.

Navigate to `/voice-agents`. Verify:

- Inline demo section appears after hero with phone mockup
- Clicking the call button initiates a Vapi call (requires env vars)
- Scrolling past the demo section shows the FAB in bottom-right
- FAB click opens compact call panel
- Scrolling back up to demo section hides the FAB

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: integrate custom voice demo into VoiceAgentsPage, remove VapiWidget"
```

---

### Task 9: Remove `@vapi-ai/client-sdk-react` dependency

**Files:**

- Modify: `package.json`

**Step 1: Check if `@vapi-ai/client-sdk-react` is used anywhere else**

Search the entire `src/` for any imports from `@vapi-ai/client-sdk-react`. The only usage should have been `VoiceDemoWidget.tsx` which was deleted in Task 8.

**Step 2: Remove the dependency**

Run: `npm uninstall @vapi-ai/client-sdk-react`

**Step 3: Verify build still works**

Run: `npm run build`

Expected: Build succeeds with no errors.

**Step 4: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: remove unused @vapi-ai/client-sdk-react dependency"
```

---

### Task 10: Visual polish pass

**Files:**

- Modify: `src/components/voice/WaveformVisualizer.tsx` (if needed)
- Modify: `src/components/voice/VoiceDemoPhone.tsx` (if needed)

**Step 1: Run dev server and review visually**

Run: `npm run dev`

Check these visual details:

1. Phone mockup is centered and properly sized on mobile
2. Waveform bars animate smoothly
3. Call button glow/pulse looks premium
4. Transcript messages are readable
5. FAB panel doesn't overlap with other content
6. Mobile responsive: on small screens the grid should stack (single column)

**Step 2: Fix any visual issues found**

Common fixes:

- Adjust phone height if content overflows
- Ensure mobile breakpoint works (`md:grid-cols-2` → single column on small screens)
- Check FAB z-index doesn't conflict with header

**Step 3: Final commit**

```bash
git add -A
git commit -m "style: polish voice demo visual details"
```
