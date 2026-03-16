# Guided Demo Mode — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a guided demo mode to the flagship chatbot that walks prospects through realistic business scenarios using real AI tool calls, side panel results, and embedded Calendly booking.

**Architecture:** Client-side `DemoOrchestrator` state machine sends scripted user messages via the existing `useChat` hook. The AI responds live with real tool calls. Checkpoints pause between steps for user control. All state managed via Zustand store extension.

**Tech Stack:** React 18, TypeScript, Zustand, Framer Motion, AI SDK v6 (`useChat`), Tailwind CSS

**Design Doc:** `docs/plans/2026-03-16-guided-demo-mode-design.md`

---

## Task 1: Scenario Data Definitions

**Files:**

- Create: `src/components/chatbot/demo/scenarios.ts`

**Step 1: Create scenario type definitions and data**

```typescript
export interface DemoCheckpoint {
  prompt: string
  options: { label: string; action: 'next' | 'skip-to-booking' | 'end' | 'next-scenario' }[]
}

export interface DemoStep {
  userMessage: string
  expectTool?: string
  checkpoint?: DemoCheckpoint
}

export interface DemoScenario {
  id: string
  title: string
  subtitle: string
  icon: string // Lucide icon name
  stepCount: number
  steps: DemoStep[]
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: 'new-client',
    title: 'The New Client Journey',
    subtitle: 'See how prospects discover and evaluate FMai',
    icon: 'Briefcase',
    stepCount: 6,
    steps: [
      { userMessage: 'What services does FMai offer?', expectTool: 'get_services' },
      { userMessage: 'Do you have any case studies?', expectTool: 'get_case_study' },
      {
        userMessage:
          'How much could we save with AI marketing? Our team has 8 people and we spend about 40 hours per week on marketing.',
        expectTool: 'get_roi_estimate',
        checkpoint: {
          prompt: 'Want to see our pricing plans next?',
          options: [
            { label: 'Show pricing', action: 'next' },
            { label: 'Skip to booking', action: 'skip-to-booking' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      { userMessage: 'What are your pricing plans?', expectTool: 'get_pricing_info' },
      {
        userMessage:
          'Can you evaluate our needs? We are a mid-size e-commerce company with a budget around 2000 EUR, looking at a 1-3 month timeline. I am the decision maker.',
        expectTool: 'qualify_lead',
        checkpoint: {
          prompt: 'Ready to book a discovery call?',
          options: [
            { label: 'Book a call', action: 'next' },
            { label: 'Try another scenario', action: 'next-scenario' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      { userMessage: "I'd like to book a discovery call", expectTool: 'book_call' },
    ],
  },
  {
    id: 'ecommerce',
    title: 'E-commerce Brand in Action',
    subtitle: 'See how FMai powers a skincare brand',
    icon: 'ShoppingBag',
    stepCount: 6,
    steps: [
      { userMessage: 'Show me skincare products for dry skin', expectTool: 'search_products' },
      {
        userMessage: 'Build me a morning and evening routine for sensitive skin',
        expectTool: 'build_routine',
        checkpoint: {
          prompt: 'Want to see the Marketing Machine next?',
          options: [
            { label: 'Show Marketing Machine', action: 'next' },
            { label: 'Skip to booking', action: 'skip-to-booking' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      {
        userMessage: 'What Marketing Machine modules would help an e-commerce brand?',
        expectTool: 'explain_module',
      },
      {
        userMessage: 'Calculate the ROI for a team of 5 with a 5000 EUR monthly marketing budget',
        expectTool: 'get_roi_info',
        checkpoint: {
          prompt: 'See a real case study next?',
          options: [
            { label: 'Show case study', action: 'next' },
            { label: 'Book a call', action: 'skip-to-booking' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      { userMessage: 'Show me how your case study client used this', expectTool: 'get_case_study' },
      { userMessage: 'Book a demo to see this in action', expectTool: 'book_call' },
    ],
  },
  {
    id: 'support',
    title: 'Client Support Experience',
    subtitle: 'See how we handle customer support',
    icon: 'Headphones',
    stepCount: 4,
    steps: [
      {
        userMessage: 'I need help with my billing, my last invoice seems incorrect',
        expectTool: 'search_knowledge_base',
      },
      {
        userMessage:
          "That doesn't fully solve my issue. Can you create a support ticket for me? Category: billing, subject: Incorrect invoice amount, description: My March invoice shows a charge I don't recognize.",
        expectTool: 'create_ticket',
        checkpoint: {
          prompt: 'Want to see ticket tracking and escalation?',
          options: [
            { label: 'Check ticket status', action: 'next' },
            { label: 'End demo', action: 'end' },
          ],
        },
      },
      { userMessage: 'Can I check the status of my ticket?', expectTool: 'check_status' },
      {
        userMessage: 'I need to speak to someone about this urgently',
        expectTool: 'escalate_to_human',
      },
    ],
  },
]

// The booking step used when user picks "skip-to-booking" at any checkpoint
export const BOOKING_STEP: DemoStep = {
  userMessage: "I'd like to book a discovery call",
  expectTool: 'book_call',
}
```

**Step 2: Commit**

```bash
git add src/components/chatbot/demo/scenarios.ts
git commit -m "feat(demo): add scenario data definitions for guided demo mode"
```

---

## Task 2: Zustand Store Extension

**Files:**

- Modify: `src/stores/chatbotStore.ts`

**Step 1: Add demo state and actions to the ChatbotState interface**

Add after the `toolsUsed: string[]` line (around line 35):

```typescript
// Demo mode (ephemeral, not persisted)
demoMode: boolean
demoScenarioId: string | null
demoStepIndex: number
demoStatus: 'idle' | 'choosing' | 'running' | 'checkpoint' | 'completed'
demoStartedAt: number | null
```

Add after the `addToolUsed` action (around line 50):

```typescript
  startDemo: () => void
  selectScenario: (id: string) => void
  advanceStep: () => void
  setDemoStatus: (status: ChatbotState['demoStatus']) => void
  endDemo: () => void
```

**Step 2: Add default values in the store**

Add after `toolsUsed: []` (around line 66):

```typescript
      demoMode: false,
      demoScenarioId: null,
      demoStepIndex: 0,
      demoStatus: 'idle',
      demoStartedAt: null,
```

**Step 3: Add action implementations**

Add after the `addToolUsed` action implementation (around line 110):

```typescript
      startDemo: () =>
        set({
          demoMode: true,
          demoScenarioId: null,
          demoStepIndex: 0,
          demoStatus: 'choosing',
          demoStartedAt: null,
          isOpen: true,
          isMinimized: false,
        }),
      selectScenario: (id: string) =>
        set({
          demoScenarioId: id,
          demoStepIndex: 0,
          demoStatus: 'running',
          demoStartedAt: Date.now(),
        }),
      advanceStep: () =>
        set((state) => ({
          demoStepIndex: state.demoStepIndex + 1,
          demoStatus: 'running',
        })),
      setDemoStatus: (status) => set({ demoStatus: status }),
      endDemo: () =>
        set({
          demoMode: false,
          demoScenarioId: null,
          demoStepIndex: 0,
          demoStatus: 'idle',
          demoStartedAt: null,
        }),
```

**Step 4: Commit**

```bash
git add src/stores/chatbotStore.ts
git commit -m "feat(demo): extend chatbot store with demo mode state"
```

---

## Task 3: BookingCard Component

**Files:**

- Create: `src/components/chatbot/tool-results/BookingCard.tsx`
- Modify: `src/components/chatbot/tool-results/index.tsx`

**Step 1: Create the BookingCard with embedded Calendly iframe**

```typescript
import { motion } from 'framer-motion'
import { Calendar, ExternalLink } from 'lucide-react'
import { useState } from 'react'

const CALENDLY_URL = 'https://calendly.com/futuremarketingai/discovery'

export interface BookingCardData {
  action: string
  url: string
  reason?: string
}

export function BookingCard({ data }: { data: BookingCardData }) {
  const [iframeLoaded, setIframeLoaded] = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const calendlyUrl = data?.url || CALENDLY_URL

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full space-y-3"
    >
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-system/20">
          <Calendar className="h-4 w-4 text-accent-system" />
        </div>
        <div>
          <p className="font-sans text-sm font-semibold text-text-primary">Schedule Your Call</p>
          {data?.reason && (
            <p className="text-xs text-text-secondary">{data.reason}</p>
          )}
        </div>
      </div>

      {/* Calendly Embed or Fallback */}
      {!iframeError ? (
        <div className="relative overflow-hidden rounded-xl border border-border-primary">
          {!iframeLoaded && (
            <div className="flex h-[420px] items-center justify-center bg-bg-elevated/50">
              <div className="animate-pulse text-xs text-text-secondary">Loading calendar...</div>
            </div>
          )}
          <iframe
            src={`${calendlyUrl}?hide_gdpr_banner=1&background_color=0a0e27&text_color=e0e0e0&primary_color=00d4ff`}
            width="100%"
            height="420"
            frameBorder="0"
            title="Book a discovery call"
            className={iframeLoaded ? 'block' : 'hidden'}
            onLoad={() => setIframeLoaded(true)}
            onError={() => setIframeError(true)}
          />
        </div>
      ) : (
        <a
          href={calendlyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-system to-accent-secondary px-4 py-3 text-sm font-medium text-white transition-opacity hover:opacity-90"
        >
          <ExternalLink className="h-4 w-4" />
          Open Calendar
        </a>
      )}
    </motion.div>
  )
}

export default BookingCard
```

**Step 2: Register BookingCard in tool-results index**

In `src/components/chatbot/tool-results/index.tsx`:

Add import:

```typescript
import { BookingCard } from './BookingCard'
```

Add to re-exports:

```typescript
export {
  ProductCard,
  LeadScoreCard,
  KBArticleCard,
  TicketCard,
  ServiceCard,
  CaseStudyCard,
  BookingCard,
}
```

Move `book_call` from `INLINE_TOOLS` to `SIDE_PANEL_TOOLS`:

```typescript
// Remove 'book_call' from INLINE_TOOLS set
// Add 'book_call' to SIDE_PANEL_TOOLS set
```

Update `TOOL_CARD_MAP`:

```typescript
  book_call: BookingCard,
```

**Step 3: Commit**

```bash
git add src/components/chatbot/tool-results/BookingCard.tsx src/components/chatbot/tool-results/index.tsx
git commit -m "feat(demo): add BookingCard with Calendly embed and route book_call to side panel"
```

---

## Task 4: DemoScenarioCard Component

**Files:**

- Create: `src/components/chatbot/demo/DemoScenarioCard.tsx`

**Step 1: Create scenario selection cards**

```typescript
import { motion } from 'framer-motion'
import { Briefcase, ShoppingBag, Headphones } from 'lucide-react'

const ICON_MAP: Record<string, typeof Briefcase> = {
  Briefcase,
  ShoppingBag,
  Headphones,
}

interface DemoScenarioCardProps {
  id: string
  title: string
  subtitle: string
  icon: string
  stepCount: number
  index: number
  onSelect: (id: string) => void
}

export function DemoScenarioCard({
  id,
  title,
  subtitle,
  icon,
  stepCount,
  index,
  onSelect,
}: DemoScenarioCardProps) {
  const Icon = ICON_MAP[icon] || Briefcase

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.3 }}
      onClick={() => onSelect(id)}
      className="w-full cursor-pointer rounded-xl border border-border-primary bg-bg-elevated/80 p-3 text-left backdrop-blur-md transition-all duration-200 hover:border-accent-system/40 hover:shadow-lg hover:shadow-accent-system/5"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent-system/20 to-accent-secondary/10">
          <Icon className="h-4 w-4 text-accent-system" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-sans text-sm font-medium text-text-primary">{title}</p>
          <p className="mt-0.5 text-xs text-text-secondary">{subtitle}</p>
          <p className="mt-1.5 font-mono text-[10px] text-text-secondary/60">{stepCount} steps</p>
        </div>
      </div>
    </motion.button>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/chatbot/demo/DemoScenarioCard.tsx
git commit -m "feat(demo): add DemoScenarioCard selection component"
```

---

## Task 5: DemoCheckpoint Component

**Files:**

- Create: `src/components/chatbot/demo/DemoCheckpoint.tsx`

**Step 1: Create checkpoint buttons component**

```typescript
import { motion } from 'framer-motion'

interface CheckpointOption {
  label: string
  action: 'next' | 'skip-to-booking' | 'end' | 'next-scenario'
}

interface DemoCheckpointProps {
  prompt: string
  options: CheckpointOption[]
  onSelect: (action: CheckpointOption['action']) => void
}

export function DemoCheckpoint({ prompt, options, onSelect }: DemoCheckpointProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.3 }}
      className="space-y-2 px-1 py-2"
    >
      <p className="text-xs text-text-secondary">{prompt}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((option, i) => (
          <motion.button
            key={option.label}
            type="button"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 + i * 0.1, duration: 0.25 }}
            onClick={() => onSelect(option.action)}
            className={
              i === 0
                ? 'rounded-full bg-accent-system/20 border border-accent-system/40 px-3 py-1.5 text-xs font-medium text-accent-system transition-colors hover:bg-accent-system/30 cursor-pointer animate-[pulseGlow_2s_ease-in-out_2s_infinite]'
                : option.action === 'end'
                  ? 'rounded-full border border-border-primary/50 px-3 py-1.5 text-xs text-text-secondary/60 transition-colors hover:text-text-secondary cursor-pointer'
                  : 'rounded-full border border-border-primary px-3 py-1.5 text-xs text-text-secondary transition-colors hover:border-accent-system/30 hover:text-text-primary cursor-pointer'
            }
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  )
}
```

**Step 2: Add the `pulseGlow` keyframe to `src/index.css`**

Find the existing `@keyframes` section and add:

```css
@keyframes pulseGlow {
  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(0, 212, 255, 0);
  }
  50% {
    box-shadow: 0 0 8px 2px rgba(0, 212, 255, 0.3);
  }
}
```

**Step 3: Commit**

```bash
git add src/components/chatbot/demo/DemoCheckpoint.tsx src/index.css
git commit -m "feat(demo): add DemoCheckpoint with pulsing CTA buttons"
```

---

## Task 6: DemoProgress Component

**Files:**

- Create: `src/components/chatbot/demo/DemoProgress.tsx`

**Step 1: Create progress dots indicator**

```typescript
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

interface DemoProgressProps {
  totalSteps: number
  currentStep: number
}

export function DemoProgress({ totalSteps, currentStep }: DemoProgressProps) {
  return (
    <div className="flex items-center gap-1.5 px-1">
      {Array.from({ length: totalSteps }, (_, i) => {
        const isCompleted = i < currentStep
        const isCurrent = i === currentStep

        return (
          <motion.div
            key={i}
            className={`flex h-5 w-5 items-center justify-center rounded-full transition-colors duration-300 ${
              isCompleted
                ? 'bg-gradient-to-br from-accent-system to-accent-secondary'
                : isCurrent
                  ? 'border-2 border-accent-system bg-accent-system/10'
                  : 'border border-border-primary bg-bg-elevated/50'
            }`}
          >
            {isCompleted && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              >
                <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
              </motion.div>
            )}
            {isCurrent && (
              <motion.div
                className="h-1.5 w-1.5 rounded-full bg-accent-system"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/chatbot/demo/DemoProgress.tsx
git commit -m "feat(demo): add DemoProgress step indicator with animated checkmarks"
```

---

## Task 7: DemoCompletionCard Component

**Files:**

- Create: `src/components/chatbot/demo/DemoCompletionCard.tsx`

**Step 1: Create scenario completion card**

```typescript
import { motion } from 'framer-motion'
import { PartyPopper, ArrowRight, RotateCcw } from 'lucide-react'

interface DemoCompletionCardProps {
  scenarioTitle: string
  durationSeconds: number
  onTryAnother: () => void
  onBookCall: () => void
  onEndDemo: () => void
}

export function DemoCompletionCard({
  scenarioTitle,
  durationSeconds,
  onTryAnother,
  onBookCall,
  onEndDemo,
}: DemoCompletionCardProps) {
  const durationMin = Math.ceil(durationSeconds / 60)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', damping: 20, stiffness: 200 }}
      className="mx-1 rounded-xl border border-accent-system/20 bg-gradient-to-br from-accent-system/10 to-accent-secondary/5 p-4 backdrop-blur-md"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-system/20">
          <PartyPopper className="h-4 w-4 text-accent-system" />
        </div>
        <div className="flex-1">
          <p className="font-sans text-sm font-semibold text-text-primary">
            Demo Complete
          </p>
          <p className="mt-0.5 text-xs text-text-secondary">
            {scenarioTitle} — {durationMin} min
          </p>
          <p className="mt-2 text-[11px] text-accent-system/70">
            86% of prospects book a call after this demo
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onBookCall}
          className="flex items-center gap-1.5 rounded-full bg-accent-system/20 border border-accent-system/40 px-3 py-1.5 text-xs font-medium text-accent-system transition-colors hover:bg-accent-system/30 cursor-pointer"
        >
          Book a call <ArrowRight className="h-3 w-3" />
        </button>
        <button
          type="button"
          onClick={onTryAnother}
          className="flex items-center gap-1.5 rounded-full border border-border-primary px-3 py-1.5 text-xs text-text-secondary transition-colors hover:text-text-primary cursor-pointer"
        >
          <RotateCcw className="h-3 w-3" /> Try another
        </button>
        <button
          type="button"
          onClick={onEndDemo}
          className="rounded-full border border-border-primary/50 px-3 py-1.5 text-xs text-text-secondary/60 transition-colors hover:text-text-secondary cursor-pointer"
        >
          End demo
        </button>
      </div>
    </motion.div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/chatbot/demo/DemoCompletionCard.tsx
git commit -m "feat(demo): add DemoCompletionCard with social proof and CTAs"
```

---

## Task 8: DemoOrchestrator — Core State Machine

**Files:**

- Create: `src/components/chatbot/demo/DemoOrchestrator.tsx`

**Step 1: Create the orchestrator component**

This component is rendered inside `ChatWidget` and orchestrates the demo flow. It watches the `useChat` status and advances steps. It renders scenario cards, checkpoints, progress, and completion cards inline in the chat area.

```typescript
import { useEffect, useRef, useCallback } from 'react'
import { useChatbotStore } from '../../../stores/chatbotStore'
import { DEMO_SCENARIOS, BOOKING_STEP } from './scenarios'
import { DemoScenarioCard } from './DemoScenarioCard'
import { DemoCheckpoint } from './DemoCheckpoint'
import { DemoProgress } from './DemoProgress'
import { DemoCompletionCard } from './DemoCompletionCard'

interface DemoOrchestratorProps {
  chatStatus: string
  onSendMessage: (text: string) => void
}

export function DemoOrchestrator({ chatStatus, onSendMessage }: DemoOrchestratorProps) {
  const {
    demoMode,
    demoScenarioId,
    demoStepIndex,
    demoStatus,
    demoStartedAt,
    selectScenario,
    advanceStep,
    setDemoStatus,
    startDemo,
    endDemo,
  } = useChatbotStore()

  const hasSentRef = useRef(false)
  const scenario = DEMO_SCENARIOS.find((s) => s.id === demoScenarioId)
  const currentStep = scenario?.steps[demoStepIndex]

  // Send the next scripted message when status is 'running' and chat is ready
  useEffect(() => {
    if (
      demoStatus !== 'running' ||
      !currentStep ||
      chatStatus !== 'ready' ||
      hasSentRef.current
    ) {
      return
    }

    hasSentRef.current = true

    // Small delay for natural pacing (300ms type effect)
    const timer = setTimeout(() => {
      onSendMessage(currentStep.userMessage)
    }, 500)

    return () => clearTimeout(timer)
  }, [demoStatus, demoStepIndex, chatStatus, currentStep, onSendMessage])

  // After AI responds (status goes back to ready), check for checkpoint
  useEffect(() => {
    if (
      demoStatus !== 'running' ||
      !hasSentRef.current ||
      chatStatus !== 'ready'
    ) {
      return
    }

    // Wait a moment then check if this step has a checkpoint
    const timer = setTimeout(() => {
      if (!currentStep) {
        return
      }

      // If this was the last step, mark completed
      if (scenario && demoStepIndex >= scenario.steps.length - 1) {
        setDemoStatus('completed')
        return
      }

      // If step has checkpoint, pause for user choice
      if (currentStep.checkpoint) {
        setDemoStatus('checkpoint')
        return
      }

      // Otherwise auto-advance
      hasSentRef.current = false
      advanceStep()
    }, 300)

    return () => clearTimeout(timer)
  }, [chatStatus, demoStatus, currentStep, scenario, demoStepIndex, advanceStep, setDemoStatus])

  // Reset sent flag when step changes
  useEffect(() => {
    hasSentRef.current = false
  }, [demoStepIndex])

  const handleScenarioSelect = useCallback(
    (id: string) => {
      hasSentRef.current = false
      selectScenario(id)
    },
    [selectScenario]
  )

  const handleCheckpoint = useCallback(
    (action: 'next' | 'skip-to-booking' | 'end' | 'next-scenario') => {
      hasSentRef.current = false

      switch (action) {
        case 'next':
          advanceStep()
          break
        case 'skip-to-booking':
          // Send the booking message directly
          onSendMessage(BOOKING_STEP.userMessage)
          setDemoStatus('completed')
          break
        case 'next-scenario':
          // Go back to scenario selection
          setDemoStatus('choosing')
          break
        case 'end':
          endDemo()
          break
      }
    },
    [advanceStep, onSendMessage, setDemoStatus, endDemo]
  )

  const handleCompletionBookCall = useCallback(() => {
    hasSentRef.current = false
    onSendMessage(BOOKING_STEP.userMessage)
  }, [onSendMessage])

  if (!demoMode) {
    return null
  }

  return (
    <>
      {/* Progress indicator — rendered in header area via prop */}

      {/* Scenario selection */}
      {demoStatus === 'choosing' && (
        <div className="space-y-2 px-1 py-2">
          <p className="text-xs text-text-secondary">Choose a scenario to explore:</p>
          {DEMO_SCENARIOS.map((s, i) => (
            <DemoScenarioCard
              key={s.id}
              id={s.id}
              title={s.title}
              subtitle={s.subtitle}
              icon={s.icon}
              stepCount={s.stepCount}
              index={i}
              onSelect={handleScenarioSelect}
            />
          ))}
        </div>
      )}

      {/* Checkpoint */}
      {demoStatus === 'checkpoint' && currentStep?.checkpoint && (
        <DemoCheckpoint
          prompt={currentStep.checkpoint.prompt}
          options={currentStep.checkpoint.options}
          onSelect={handleCheckpoint}
        />
      )}

      {/* Completion card */}
      {demoStatus === 'completed' && scenario && (
        <DemoCompletionCard
          scenarioTitle={scenario.title}
          durationSeconds={demoStartedAt ? Math.round((Date.now() - demoStartedAt) / 1000) : 0}
          onTryAnother={() => {
            hasSentRef.current = false
            setDemoStatus('choosing')
          }}
          onBookCall={handleCompletionBookCall}
          onEndDemo={endDemo}
        />
      )}
    </>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/chatbot/demo/DemoOrchestrator.tsx
git commit -m "feat(demo): add DemoOrchestrator state machine for guided demo flow"
```

---

## Task 9: Integrate Demo into ChatWidget

**Files:**

- Modify: `src/components/chatbot/ChatWidget.tsx`
- Modify: `src/components/chatbot/ChatHeader.tsx`
- Modify: `src/components/chatbot/ChatMessages.tsx`

**Step 1: Add demo imports and state to ChatWidget**

In `src/components/chatbot/ChatWidget.tsx`, add imports:

```typescript
import { DemoOrchestrator } from './demo/DemoOrchestrator'
import { DemoProgress } from './demo/DemoProgress'
import { DEMO_SCENARIOS } from './demo/scenarios'
```

Add store selectors alongside existing ones (around line 39-42):

```typescript
const demoMode = useChatbotStore((s) => s.demoMode)
const demoScenarioId = useChatbotStore((s) => s.demoScenarioId)
const demoStepIndex = useChatbotStore((s) => s.demoStepIndex)
const demoStatus = useChatbotStore((s) => s.demoStatus)
const startDemo = useChatbotStore((s) => s.startDemo)
```

Add derived state:

```typescript
const demoScenario = DEMO_SCENARIOS.find((s) => s.id === demoScenarioId)
```

**Step 2: Add "Start guided demo" to suggested prompts**

In `ChatWidget.tsx`, modify the `showPrompts` condition and add a demo start handler. Where `suggestedPrompts` are rendered, intercept the "Start guided demo" prompt:

```typescript
const handlePromptSelect = useCallback(
  (text: string) => {
    if (text === 'Start guided demo') {
      startDemo()
      return
    }
    handleSend(text)
  },
  [handleSend, startDemo]
)
```

Replace `onSelect={handleSend}` with `onSelect={handlePromptSelect}` in both `SuggestedPrompts` instances.

**Step 3: Add DemoOrchestrator and DemoProgress to floating mode render**

After `<ChatMessages ... />` and before the SuggestedPrompts, add:

```typescript
                {/* Demo orchestrator — renders scenario cards, checkpoints, completion */}
                <DemoOrchestrator
                  chatStatus={status}
                  onSendMessage={handleSend}
                />
```

In the header area, pass demo badge when in demo mode. Change the badge prop:

```typescript
                  badge={demoMode ? 'Demo' : isFlagship ? 'Concierge' : undefined}
```

Add progress indicator below the header (or inside header):

```typescript
                {demoMode && demoScenario && (
                  <div className="border-b border-border-primary px-4 py-2 bg-bg-surface/95">
                    <DemoProgress
                      totalSteps={demoScenario.stepCount}
                      currentStep={demoStepIndex}
                    />
                  </div>
                )}
```

**Step 4: Do the same for embedded mode**

Add the same `DemoOrchestrator`, progress, and badge updates to the embedded mode section (below line 177).

**Step 5: Add welcome message demo button**

In `ChatMessages.tsx`, modify the welcome message section to include a demo start button. Add `onStartDemo` to the props interface:

```typescript
interface ChatMessagesProps {
  messages: UIMessage[]
  status: string
  welcomeMessage?: string
  flagship?: boolean
  onStartDemo?: () => void
}
```

In the welcome message render (around line 125-131), add a button after the markdown:

```typescript
      {messages.length === 0 && welcomeMessage && (
        <div className="flex justify-start" style={{ animation: 'fadeIn 0.3s ease-in' }}>
          <div className={assistantBubbleClass}>
            <MarkdownContent text={welcomeMessage} />
            {onStartDemo && (
              <button
                type="button"
                onClick={onStartDemo}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-accent-system/30 bg-accent-system/10 px-3 py-1.5 text-xs font-medium text-accent-system transition-colors hover:bg-accent-system/20 cursor-pointer"
              >
                Take a guided tour
              </button>
            )}
          </div>
        </div>
      )}
```

Pass `onStartDemo={demoMode ? undefined : startDemo}` from `ChatWidget` to `ChatMessages`.

**Step 6: Commit**

```bash
git add src/components/chatbot/ChatWidget.tsx src/components/chatbot/ChatHeader.tsx src/components/chatbot/ChatMessages.tsx
git commit -m "feat(demo): integrate demo orchestrator into ChatWidget with entry points"
```

---

## Task 10: Add Demo Prompt to Suggested Prompts Config

**Files:**

- Modify: `src/App.tsx`

**Step 1: Add "Start guided demo" to concierge suggested prompts**

Find where `conciergeCtx.suggestedPrompts` is defined or where starters are configured. The suggested prompts for the flagship persona come from `conciergeCtx.suggestedPrompts`. Find the concierge context hook that generates these prompts.

Check: `src/hooks/useConciergeContext.ts` or wherever `conciergeCtx` is defined. Add `'Start guided demo'` as the first or last suggested prompt in the prompts array for the flagship persona.

If prompts are defined inline in App.tsx, add it there. If in a separate hook, modify that file.

**Step 2: Commit**

```bash
git add <modified files>
git commit -m "feat(demo): add guided demo to suggested prompts"
```

---

## Task 11: Remove Debug Logging from ChatMessages

**Files:**

- Modify: `src/components/chatbot/ChatMessages.tsx`

**Step 1: Remove the `import.meta.env.DEV` console.log block**

Remove the debug logging block (lines 141-153) that was added during debugging:

```typescript
if (import.meta.env.DEV) {
  console.log(
    `[ChatMsg] msg=${message.id} part ${i}:`
    // ...
  )
}
```

**Step 2: Commit**

```bash
git add src/components/chatbot/ChatMessages.tsx
git commit -m "chore: remove debug logging from ChatMessages"
```

---

## Task 12: End-to-End Manual Test

**No files to modify — testing only.**

**Step 1: Start dev server**

```bash
npm run dev
```

**Step 2: Test entry points**

- Open chatbot → verify "Take a guided tour" button in welcome message
- Verify "Start guided demo" appears in suggested prompts
- Click both → should show scenario selection cards

**Step 3: Test Scenario 1 ("The New Client Journey")**

- Select scenario → verify progress dots appear in header
- Verify "DEMO" badge in header
- Watch each step: scripted user message appears → AI responds with tool call → side panel opens
- At checkpoint: click "Show pricing" → demo continues
- At final step: side panel should show BookingCard with Calendly embed
- Verify completion card appears with duration and CTAs

**Step 4: Test Scenario 2 ("E-commerce Brand")**

- From completion card, click "Try another" → should show scenario selection
- Select e-commerce → verify products, routines, modules in side panel
- Test "Skip to booking" at a checkpoint → should jump to booking

**Step 5: Test Scenario 3 ("Support")**

- Verify support tools work inline (tickets, escalation)
- Test "End demo" at checkpoint → demo mode should turn off

**Step 6: Test edge cases**

- Close and reopen chatbot during demo → demo state should persist (ephemeral Zustand)
- Normal chatting after ending demo → should work normally
- Verify side panel opens/closes correctly for each tool
