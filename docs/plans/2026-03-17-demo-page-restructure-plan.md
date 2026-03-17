---
title: Demo Page Restructure Implementation Plan
tags: #plan #demo #implementation
created: 2026-03-17
source: design doc 2026-03-17-demo-page-restructure-design.md
---

# Demo Page Restructure Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the Marketing Machine-focused /demo route with a conversion-optimized single-page showcase of FMai's three sellable services (Automations, Chatbots, Voice Agents) with founder-led positioning and soft-gated ROI calculator.

**Architecture:** New single-page DemoShowcase component replaces Hero.tsx on /demo route. Built from composable sections: HeroSection, SocialProofBar, AutomationUseCases (with BeforeAfter + AnimatedWorkflow sub-components), ServicePreview cards, simplified ROI Calculator, FounderSection, and FinalCTA. Existing /chatbots and /voice-agents pages remain unchanged.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion, existing GlassCard/Button/StrategicCTA components, useCalendlyBooking hook, Recharts (for calculator charts).

**Design Doc:** `docs/plans/2026-03-17-demo-page-restructure-design.md`

---

## Task 1: Create DemoShowcase page shell with routing

**Files:**

- Create: `src/pages/DemoShowcase.tsx`
- Modify: `src/App.tsx` (lines 28, 249-259)

**Step 1: Create minimal DemoShowcase page**

```tsx
// src/pages/DemoShowcase.tsx
import { motion } from 'framer-motion'

export default function DemoShowcase() {
  return (
    <div className="min-h-screen bg-bg-deep">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section id="hero" className="pt-24 pb-16">
          <h1 className="font-display text-4xl font-bold text-text-primary md:text-5xl lg:text-6xl">
            Bespaar 40+ uur per week met AI
          </h1>
          <p className="mt-4 text-lg text-text-secondary">
            Automations, Chatbots & Voice Agents — gebouwd en geleverd door een specialist.
          </p>
        </section>
      </div>
    </div>
  )
}
```

**Step 2: Update App.tsx routing — replace Hero with DemoShowcase on /demo**

In `src/App.tsx`:

- Add lazy import: `const DemoShowcase = lazy(() => import('./pages/DemoShowcase'))`
- Change route line 249: `/demo` → `<DemoShowcase />`
- Change route line 251: `/demo-home` → `<DemoShowcase />`
- Comment out (don't delete) Explorer, Dashboard, AdBuilder routes (lines 252-259)
- Remove DemoIntro routes (lines 250, 253, 255, 257)
- Update `isDemoRoute` logic to include `/demo` only
- Remove `FloatingNav` and `PersonalizationControlBar` rendering for demo routes (they're no longer needed)

**Step 3: Verify the route works**

Run: `npm run dev`
Navigate to `/demo` — should show the placeholder hero text on dark background.

**Step 4: Commit**

```bash
git add src/pages/DemoShowcase.tsx src/App.tsx
git commit -m "feat: scaffold DemoShowcase page and update /demo routing"
```

---

## Task 2: Build HeroSection with 3 service cards

**Files:**

- Create: `src/components/demo-showcase/HeroSection.tsx`
- Modify: `src/pages/DemoShowcase.tsx`

**Step 1: Create HeroSection component**

```tsx
// src/components/demo-showcase/HeroSection.tsx
import { motion } from 'framer-motion'
import { Zap, Bot, Phone } from 'lucide-react'

const services = [
  {
    id: 'automations',
    icon: Zap,
    title: 'AI Automations',
    metric: 'Save 40+ hours/week',
    color: 'accent-system',
  },
  {
    id: 'chatbots',
    icon: Bot,
    title: 'AI Chatbots',
    metric: '84% auto-resolved',
    color: 'accent-system',
  },
  {
    id: 'voice',
    icon: Phone,
    title: 'AI Voice Agents',
    metric: '24/7, zero hold time',
    color: 'accent-system',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

export default function HeroSection() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="pt-24 pb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-display text-4xl font-bold text-text-primary md:text-5xl lg:text-6xl">
          Stop met handwerk.{' '}
          <span className="bg-gradient-to-r from-accent-system to-[#00D4FF] bg-clip-text text-transparent">
            Start met AI.
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-text-secondary">
          Wij bouwen AI-oplossingen die uw team uren per week besparen. Directe toegang tot de
          specialist die uw oplossing bouwt.
        </p>
      </motion.div>

      <motion.div
        className="mx-auto mt-12 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.map((service) => {
          const Icon = service.icon
          return (
            <motion.button
              key={service.id}
              variants={itemVariants}
              onClick={() => scrollTo(service.id)}
              className="group rounded-card border border-border-primary bg-bg-surface/80 p-6
                         backdrop-blur-md transition-all duration-300
                         hover:border-accent-system/30 hover:shadow-glow-sm"
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-accent-system/10">
                <Icon className="h-6 w-6 text-accent-system" />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-text-primary">
                {service.title}
              </h3>
              <p className="mt-1 font-mono text-sm text-accent-system">{service.metric}</p>
            </motion.button>
          )
        })}
      </motion.div>
    </section>
  )
}
```

**Step 2: Integrate into DemoShowcase**

Update `src/pages/DemoShowcase.tsx` to import and render `HeroSection`.

**Step 3: Verify visually**

Run: `npm run dev` → navigate to `/demo` → should show headline + 3 clickable service cards.

**Step 4: Commit**

```bash
git add src/components/demo-showcase/HeroSection.tsx src/pages/DemoShowcase.tsx
git commit -m "feat: add HeroSection with 3 service cards to demo page"
```

---

## Task 3: Build SocialProofBar

**Files:**

- Create: `src/components/demo-showcase/SocialProofBar.tsx`
- Modify: `src/pages/DemoShowcase.tsx`

**Step 1: Create SocialProofBar component**

Displays pilot metrics + tech stack badges. No fake client logos.

```tsx
// src/components/demo-showcase/SocialProofBar.tsx
import { motion } from 'framer-motion'
import { Clock, Rocket, Calendar } from 'lucide-react'

const metrics = [
  { icon: Clock, value: '240+', label: 'Hours automated', color: 'text-accent-system' },
  { icon: Rocket, value: '3', label: 'Live implementations', color: 'text-accent-system' },
  { icon: Calendar, value: '14 days', label: 'Average deployment', color: 'text-accent-system' },
]

const techStack = ['n8n', 'Claude', 'Vapi', 'Make', 'OpenAI']

export default function SocialProofBar() {
  return (
    <section className="border-y border-border-primary bg-bg-surface/50 py-8">
      <div className="mx-auto max-w-5xl px-4">
        <motion.div
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {metrics.map((m) => {
            const Icon = m.icon
            return (
              <div key={m.label} className="flex items-center gap-3">
                <Icon className={`h-5 w-5 ${m.color}`} />
                <div>
                  <p className="font-mono text-lg font-bold text-text-primary">{m.value}</p>
                  <p className="text-xs text-text-secondary">{m.label}</p>
                </div>
              </div>
            )
          })}
        </motion.div>

        <motion.div
          className="mt-6 flex flex-wrap items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="text-xs uppercase tracking-wider text-text-muted">Built with</span>
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full border border-border-primary bg-bg-elevated/60 px-3 py-1
                         font-mono text-xs text-text-secondary"
            >
              {tech}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 2: Add to DemoShowcase after HeroSection**

**Step 3: Verify visually**

**Step 4: Commit**

```bash
git add src/components/demo-showcase/SocialProofBar.tsx src/pages/DemoShowcase.tsx
git commit -m "feat: add SocialProofBar with pilot metrics and tech stack"
```

---

## Task 4: Build BeforeAfter component

**Files:**

- Create: `src/components/demo-showcase/BeforeAfter.tsx`

**Step 1: Create reusable BeforeAfter visualization**

Side-by-side on desktop, stacked on mobile. Left = pain (red-tinted), right = gain (green-tinted).

```tsx
// src/components/demo-showcase/BeforeAfter.tsx
import { motion } from 'framer-motion'
import { X, Check } from 'lucide-react'

interface BeforeAfterProps {
  before: {
    title: string
    items: string[]
    metric: string
    metricLabel: string
  }
  after: {
    title: string
    items: string[]
    metric: string
    metricLabel: string
  }
}

export default function BeforeAfter({ before, after }: BeforeAfterProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {/* BEFORE */}
      <motion.div
        className="rounded-card border border-red-500/20 bg-red-500/5 p-6"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-red-400">Before</p>
        <p className="mt-2 font-display text-lg font-semibold text-text-primary">{before.title}</p>
        <ul className="mt-4 space-y-2">
          {before.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <X className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-red-500/10 pt-4">
          <p className="font-mono text-2xl font-bold text-red-400">{before.metric}</p>
          <p className="text-xs text-text-muted">{before.metricLabel}</p>
        </div>
      </motion.div>

      {/* AFTER */}
      <motion.div
        className="rounded-card border border-accent-system/20 bg-accent-system/5 p-6"
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <p className="text-xs font-bold uppercase tracking-wider text-accent-system">
          After — with FMai
        </p>
        <p className="mt-2 font-display text-lg font-semibold text-text-primary">{after.title}</p>
        <ul className="mt-4 space-y-2">
          {after.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent-system" />
              {item}
            </li>
          ))}
        </ul>
        <div className="mt-4 border-t border-accent-system/10 pt-4">
          <p className="font-mono text-2xl font-bold text-accent-system">{after.metric}</p>
          <p className="text-xs text-text-muted">{after.metricLabel}</p>
        </div>
      </motion.div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/demo-showcase/BeforeAfter.tsx
git commit -m "feat: add reusable BeforeAfter comparison component"
```

---

## Task 5: Build AnimatedWorkflow component

**Files:**

- Create: `src/components/demo-showcase/AnimatedWorkflow.tsx`

**Step 1: Create animated workflow visualization**

Horizontal step-by-step flow on desktop, vertical on mobile. Auto-plays on scroll into view. Each step highlights sequentially with a pulse animation.

```tsx
// src/components/demo-showcase/AnimatedWorkflow.tsx
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import { ArrowRight, ArrowDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface WorkflowStep {
  icon: LucideIcon
  label: string
  detail?: string
}

interface AnimatedWorkflowProps {
  steps: WorkflowStep[]
}

export default function AnimatedWorkflow({ steps }: AnimatedWorkflowProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [activeStep, setActiveStep] = useState(-1)

  useEffect(() => {
    if (!isInView) return
    let step = 0
    const interval = setInterval(() => {
      setActiveStep(step)
      step++
      if (step >= steps.length) clearInterval(interval)
    }, 600)
    return () => clearInterval(interval)
  }, [isInView, steps.length])

  return (
    <div ref={ref} className="py-6">
      {/* Desktop: horizontal */}
      <div className="hidden items-center justify-center gap-2 md:flex">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isActive = i <= activeStep
          return (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-300 ${
                  isActive
                    ? 'border-accent-system/40 bg-accent-system/10 shadow-glow-sm'
                    : 'border-border-primary bg-bg-surface/50'
                }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Icon
                  className={`h-5 w-5 ${isActive ? 'text-accent-system' : 'text-text-muted'}`}
                />
                <span
                  className={`text-xs font-medium ${isActive ? 'text-text-primary' : 'text-text-muted'}`}
                >
                  {step.label}
                </span>
                {step.detail && <span className="text-[10px] text-text-muted">{step.detail}</span>}
              </motion.div>
              {i < steps.length - 1 && (
                <ArrowRight
                  className={`h-4 w-4 ${i < activeStep ? 'text-accent-system' : 'text-text-muted'}`}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Mobile: vertical */}
      <div className="flex flex-col items-center gap-2 md:hidden">
        {steps.map((step, i) => {
          const Icon = step.icon
          const isActive = i <= activeStep
          return (
            <div key={i} className="flex flex-col items-center gap-2">
              <motion.div
                className={`flex w-full items-center gap-3 rounded-xl border p-3 transition-all duration-300 ${
                  isActive
                    ? 'border-accent-system/40 bg-accent-system/10'
                    : 'border-border-primary bg-bg-surface/50'
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.3 }}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${isActive ? 'text-accent-system' : 'text-text-muted'}`}
                />
                <div>
                  <span
                    className={`text-sm font-medium ${isActive ? 'text-text-primary' : 'text-text-muted'}`}
                  >
                    {step.label}
                  </span>
                  {step.detail && <p className="text-[10px] text-text-muted">{step.detail}</p>}
                </div>
              </motion.div>
              {i < steps.length - 1 && (
                <ArrowDown
                  className={`h-4 w-4 ${i < activeStep ? 'text-accent-system' : 'text-text-muted'}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/demo-showcase/AnimatedWorkflow.tsx
git commit -m "feat: add AnimatedWorkflow step-by-step visualization"
```

---

## Task 6: Build AutomationShowcase with 3 use cases

**Files:**

- Create: `src/components/demo-showcase/AutomationShowcase.tsx`
- Create: `src/components/demo-showcase/automation-data.ts`
- Modify: `src/pages/DemoShowcase.tsx`

**Step 1: Create automation use case data**

```tsx
// src/components/demo-showcase/automation-data.ts
import {
  Database,
  Mail,
  Calendar,
  UserCheck,
  Send,
  Clock,
  Bell,
  BarChart3,
  Zap,
} from 'lucide-react'
import type { WorkflowStep } from './AnimatedWorkflow'

export interface AutomationUseCase {
  id: string
  title: string
  outcomeMetric: string
  before: {
    title: string
    items: string[]
    metric: string
    metricLabel: string
  }
  after: {
    title: string
    items: string[]
    metric: string
    metricLabel: string
  }
  workflow: WorkflowStep[]
}

export const automationUseCases: AutomationUseCase[] = [
  {
    id: 'lead-scoring',
    title: 'Lead Scoring & Routing',
    outcomeMetric: '50-70% more qualified leads',
    before: {
      title: 'Manual lead triage',
      items: [
        'Sales rep reviews every lead manually',
        '4+ hours/day sorting through unqualified prospects',
        'Hot leads wait hours before first contact',
        'No consistent scoring criteria across team',
      ],
      metric: '4 hrs/day',
      metricLabel: 'Wasted on unqualified leads',
    },
    after: {
      title: 'AI-powered lead intelligence',
      items: [
        'Every lead scored in real-time on entry',
        'Top prospects routed to the right rep instantly',
        'Response time drops from hours to minutes',
        'Consistent AI scoring based on your conversion data',
      ],
      metric: '30 min/day',
      metricLabel: 'Reviewing pre-qualified leads',
    },
    workflow: [
      { icon: Database, label: 'Lead enters CRM', detail: 'Form, ad, or referral' },
      { icon: Zap, label: 'AI scores lead', detail: 'Based on fit signals' },
      { icon: UserCheck, label: 'Route to rep', detail: 'Best match for deal' },
      { icon: Bell, label: 'Instant alert', detail: 'Slack + CRM update' },
    ],
  },
  {
    id: 'sales-sequences',
    title: 'Sales Follow-up Sequences',
    outcomeMetric: '320% more revenue from email',
    before: {
      title: 'Manual follow-up chaos',
      items: [
        'Reps forget to follow up after 2nd email',
        'Same generic message to every prospect',
        'No tracking of opens, clicks, or replies',
        '79% of leads never convert due to lack of follow-up',
      ],
      metric: '79%',
      metricLabel: 'Leads lost to no follow-up',
    },
    after: {
      title: 'Adaptive AI sequences',
      items: [
        'Personalized follow-ups sent automatically',
        'Adapts based on recipient behavior (opens, clicks)',
        'Hot leads escalated to sales immediately',
        'Every lead gets the right message at the right time',
      ],
      metric: '3.2x',
      metricLabel: 'More revenue from automated email',
    },
    workflow: [
      { icon: Send, label: 'Initial outreach', detail: 'Personalized by AI' },
      { icon: Mail, label: 'Behavior tracked', detail: 'Opens, clicks, replies' },
      { icon: Zap, label: 'AI adapts sequence', detail: 'Next best action' },
      { icon: UserCheck, label: 'Hot lead to sales', detail: 'Or nurture continues' },
    ],
  },
  {
    id: 'appointment-scheduling',
    title: 'Appointment Scheduling & No-shows',
    outcomeMetric: '50% fewer no-shows',
    before: {
      title: 'Email ping-pong',
      items: [
        '5+ emails back and forth to find a time',
        '3 days average to book one meeting',
        '20-30% no-show rate eats into revenue',
        'No automated reminders or confirmations',
      ],
      metric: '20-30%',
      metricLabel: 'Revenue lost to no-shows',
    },
    after: {
      title: 'One-click booking + smart reminders',
      items: [
        'Prospect picks a time in 10 seconds',
        'Automated confirmation + 3 reminder touchpoints',
        'No-show rate drops to 5-10%',
        'Rescheduling handled automatically',
      ],
      metric: '10 sec',
      metricLabel: 'From click to booked meeting',
    },
    workflow: [
      { icon: Calendar, label: 'Prospect clicks link', detail: 'One-step booking' },
      { icon: Clock, label: 'Auto-confirmation', detail: 'Instant email + SMS' },
      { icon: Bell, label: 'Smart reminders', detail: '-24h, -2h, -15min' },
      { icon: BarChart3, label: 'Analytics tracked', detail: 'Show rates, reschedules' },
    ],
  },
]
```

**Step 2: Create AutomationShowcase component**

```tsx
// src/components/demo-showcase/AutomationShowcase.tsx
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'
import BeforeAfter from './BeforeAfter'
import AnimatedWorkflow from './AnimatedWorkflow'
import { automationUseCases } from './automation-data'
import { StrategicCTA } from '../common/StrategicCTA'

export default function AutomationShowcase() {
  return (
    <section id="automations" className="py-20">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-system/10">
            <Zap className="h-5 w-5 text-accent-system" />
          </div>
          <h2 className="font-display text-3xl font-bold text-text-primary">AI Automations</h2>
          <p className="mt-2 text-text-secondary">
            De meest gevraagde automations die direct tijd en geld besparen.
          </p>
        </motion.div>

        <div className="space-y-20">
          {automationUseCases.map((useCase) => (
            <motion.div
              key={useCase.id}
              id={useCase.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  {useCase.title}
                </h3>
                <span className="rounded-full bg-accent-system/10 px-3 py-1 font-mono text-sm text-accent-system">
                  {useCase.outcomeMetric}
                </span>
              </div>

              <BeforeAfter before={useCase.before} after={useCase.after} />

              <div className="mt-6">
                <p className="mb-2 text-center text-xs uppercase tracking-wider text-text-muted">
                  How it works
                </p>
                <AnimatedWorkflow steps={useCase.workflow} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <StrategicCTA
            variant="inline"
            headline="Klaar om uren per week te besparen?"
            primaryCTA={{ label: 'Plan een 15-min gesprek', onClick: () => {} }}
            disableTracking
          />
        </div>
      </div>
    </section>
  )
}
```

Note: The `StrategicCTA` onClick will be wired to `useCalendlyBooking` in a later task.

**Step 3: Add to DemoShowcase page**

**Step 4: Verify — all 3 use cases render with before/after and workflow animations**

**Step 5: Commit**

```bash
git add src/components/demo-showcase/automation-data.ts src/components/demo-showcase/AutomationShowcase.tsx src/pages/DemoShowcase.tsx
git commit -m "feat: add AutomationShowcase with 3 use cases, before/after, and workflows"
```

---

## Task 7: Build ServicePreview cards (Chatbots + Voice)

**Files:**

- Create: `src/components/demo-showcase/ServicePreview.tsx`
- Modify: `src/pages/DemoShowcase.tsx`

**Step 1: Create ServicePreview component**

Two compact cards that link to the existing dedicated demo pages. Each shows: icon, title, metric, brief description, and a "Try the live demo" CTA.

```tsx
// src/components/demo-showcase/ServicePreview.tsx
import { motion } from 'framer-motion'
import { Bot, Phone, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../common/Button'

const services = [
  {
    id: 'chatbots',
    icon: Bot,
    title: 'AI Chatbots',
    metric: '84% of questions auto-resolved',
    description:
      'Custom-trained chatbots die uw klanten 24/7 helpen. Getraind op uw kennisbank, geïntegreerd met uw CRM.',
    cta: 'Probeer de live demo',
    link: '/chatbots',
  },
  {
    id: 'voice',
    icon: Phone,
    title: 'AI Voice Agents',
    metric: 'Zero hold time, 24/7 beschikbaar',
    description:
      'AI-gestuurde telefonisten die inbound en outbound calls afhandelen. Natuurlijke gesprekken, directe actie.',
    cta: 'Bel onze AI',
    link: '/voice-agents',
  },
]

export default function ServicePreview() {
  return (
    <div className="space-y-16">
      {services.map((service) => {
        const Icon = service.icon
        return (
          <section key={service.id} id={service.id} className="py-12">
            <div className="mx-auto max-w-4xl px-4">
              <motion.div
                className="rounded-card border border-border-primary bg-bg-surface/60 p-8 backdrop-blur-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-system/10">
                        <Icon className="h-5 w-5 text-accent-system" />
                      </div>
                      <h2 className="font-display text-2xl font-bold text-text-primary">
                        {service.title}
                      </h2>
                    </div>
                    <p className="mt-1 font-mono text-sm text-accent-system">{service.metric}</p>
                    <p className="mt-3 max-w-lg text-text-secondary">{service.description}</p>
                  </div>

                  <Link to={service.link}>
                    <Button variant="primary" size="lg">
                      {service.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
```

**Step 2: Add to DemoShowcase after AutomationShowcase**

**Step 3: Verify — both cards render, links work to /chatbots and /voice-agents**

**Step 4: Commit**

```bash
git add src/components/demo-showcase/ServicePreview.tsx src/pages/DemoShowcase.tsx
git commit -m "feat: add ServicePreview cards linking to chatbot and voice demos"
```

---

## Task 8: Integrate simplified ROI Calculator

**Files:**

- Create: `src/components/demo-showcase/ROICalculatorSection.tsx`
- Modify: `src/pages/DemoShowcase.tsx`

**Step 1: Create simplified calculator wrapper**

Reuses existing `CalculatorWizard` and calculation utilities but wraps them in a simpler container without the full Calculator page chrome (no competitive position, scenario explorer, etc.). Soft-gated: results shown freely, email capture offered after.

```tsx
// src/components/demo-showcase/ROICalculatorSection.tsx
import { lazy, Suspense, useState } from 'react'
import { motion } from 'framer-motion'
import { Calculator } from 'lucide-react'

// Lazy load the heavy calculator components
const CalculatorWizard = lazy(() => import('../calculator/CalculatorWizard'))

export default function ROICalculatorSection() {
  const [showEmailCapture, setShowEmailCapture] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <section id="calculator" className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent-system/10">
            <Calculator className="h-5 w-5 text-accent-system" />
          </div>
          <h2 className="font-display text-3xl font-bold text-text-primary">
            Bereken uw besparing
          </h2>
          <p className="mt-2 text-text-secondary">
            Vul uw cijfers in en zie direct wat AI automation u oplevert. Geen email nodig.
          </p>
        </motion.div>

        <motion.div
          className="rounded-card border border-border-primary bg-bg-surface/60 p-6 backdrop-blur-md md:p-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Suspense
            fallback={
              <div className="flex h-64 items-center justify-center">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent-system border-t-transparent" />
              </div>
            }
          >
            <CalculatorWizard onComplete={() => setShowEmailCapture(true)} />
          </Suspense>
        </motion.div>

        {/* Soft-gate: email capture AFTER results */}
        {showEmailCapture && (
          <motion.div
            className="mt-6 rounded-card border border-accent-system/20 bg-accent-system/5 p-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="font-display text-lg font-semibold text-text-primary">
              Sla uw resultaten op
            </p>
            <p className="mt-1 text-sm text-text-secondary">
              Ontvang een gepersonaliseerd implementatie-roadmap per email.
            </p>
            <form
              className="mx-auto mt-4 flex max-w-md gap-2"
              onSubmit={(e) => {
                e.preventDefault()
                // TODO: wire to email capture endpoint
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uw@email.com"
                className="flex-1 rounded-btn border border-border-primary bg-bg-elevated px-4 py-2
                           text-sm text-text-primary placeholder:text-text-muted
                           focus:border-accent-system/50 focus:outline-none focus:ring-1 focus:ring-accent-system/30"
                required
              />
              <button
                type="submit"
                className="rounded-btn bg-accent-system px-6 py-2 text-sm font-medium text-bg-deep
                           transition-opacity hover:opacity-90"
              >
                Verstuur
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </section>
  )
}
```

Note: The CalculatorWizard may need a minor prop adjustment to work standalone. Check during implementation if `inputs` and `onInputChange` need to be provided — if so, add local state for wizard inputs.

**Step 2: Add to DemoShowcase**

**Step 3: Verify — calculator renders, wizard steps work, email capture shows after completion**

**Step 4: Commit**

```bash
git add src/components/demo-showcase/ROICalculatorSection.tsx src/pages/DemoShowcase.tsx
git commit -m "feat: add soft-gated ROI calculator section to demo page"
```

---

## Task 9: Build FounderSection

**Files:**

- Create: `src/components/demo-showcase/FounderSection.tsx`
- Modify: `src/pages/DemoShowcase.tsx`

**Step 1: Create FounderSection component**

Founder photo placeholder, name, story, pilot case study metrics, implementation promise.

```tsx
// src/components/demo-showcase/FounderSection.tsx
import { motion } from 'framer-motion'
import { User, Clock, Zap, TrendingUp } from 'lucide-react'

const pilotMetrics = [
  { icon: Clock, value: '240+ uur', label: 'Geautomatiseerd per maand' },
  { icon: Zap, value: '14 dagen', label: 'Van start tot live' },
  { icon: TrendingUp, value: '3x', label: 'Meer output, minder werk' },
]

export default function FounderSection() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-4xl px-4">
        <motion.div
          className="rounded-card border border-border-primary bg-bg-surface/60 p-8 backdrop-blur-md md:p-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Photo placeholder */}
            <div className="shrink-0">
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-accent-system/30 bg-bg-elevated">
                <User className="h-10 w-10 text-accent-system" />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-text-primary">
                Gebouwd door een specialist, niet door een team
              </h2>
              <p className="mt-3 text-text-secondary leading-relaxed">
                Ik ben de oprichter van FMai. Elke oplossing die ik lever, bouw ik persoonlijk. Geen
                account managers, geen handoffs, geen miscommunicatie. U werkt direct met de persoon
                die uw systeem ontwerpt en implementeert.
              </p>
              <p className="mt-3 text-text-secondary leading-relaxed">
                Voordat ik dit aan klanten aanbood, heb ik alles eerst op mijn eigen bedrijf gebouwd
                en getest. Dit zijn de resultaten:
              </p>

              {/* Pilot metrics */}
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {pilotMetrics.map((m) => {
                  const Icon = m.icon
                  return (
                    <motion.div
                      key={m.label}
                      className="rounded-xl border border-border-primary bg-bg-elevated/60 p-4 text-center"
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <Icon className="mx-auto h-5 w-5 text-accent-system" />
                      <p className="mt-2 font-mono text-xl font-bold text-text-primary">
                        {m.value}
                      </p>
                      <p className="mt-1 text-xs text-text-secondary">{m.label}</p>
                    </motion.div>
                  )
                })}
              </div>

              <p className="mt-6 rounded-xl border border-accent-system/20 bg-accent-system/5 p-4 text-center font-medium text-accent-system">
                Live binnen 14 dagen — of u betaalt niet.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

**Step 2: Add to DemoShowcase after ROICalculatorSection**

**Step 3: Verify visually**

**Step 4: Commit**

```bash
git add src/components/demo-showcase/FounderSection.tsx src/pages/DemoShowcase.tsx
git commit -m "feat: add FounderSection with pilot case study metrics"
```

---

## Task 10: Build FinalCTA with Calendly integration

**Files:**

- Create: `src/components/demo-showcase/FinalCTA.tsx`
- Modify: `src/pages/DemoShowcase.tsx`

**Step 1: Create FinalCTA component**

Wires up `useCalendlyBooking` hook for proper booking with ICP tracking.

```tsx
// src/components/demo-showcase/FinalCTA.tsx
import { lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'
import { Button } from '../common/Button'
import { useCalendlyBooking } from '../../hooks/useCalendlyBooking'

const CalendlyModal = lazy(() => import('../common/CalendlyModal'))

export default function FinalCTA() {
  const calendly = useCalendlyBooking()

  return (
    <section className="py-20">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent-system/10">
            <Calendar className="h-6 w-6 text-accent-system" />
          </div>
          <h2 className="font-display text-3xl font-bold text-text-primary">Laten we praten</h2>
          <p className="mt-3 text-text-secondary">
            15 minuten. Geen verplichtingen. We bespreken uw grootste automation-kans en of FMai de
            juiste fit is.
          </p>

          <Button
            variant="cta"
            size="xl"
            className="mt-8"
            onClick={() => calendly.open('demo_final_cta')}
          >
            Plan uw discovery call
          </Button>

          <div className="mt-4 flex items-center justify-center gap-6 text-xs text-text-muted">
            <span>Gratis</span>
            <span>15 minuten</span>
            <span>Geen verplichtingen</span>
          </div>
        </motion.div>
      </div>

      <Suspense fallback={null}>
        {calendly.isOpen && (
          <CalendlyModal
            url={calendly.calendlyUrl}
            prefill={calendly.prefillData}
            utm={calendly.utmParams}
            onClose={calendly.close}
          />
        )}
      </Suspense>
    </section>
  )
}
```

**Step 2: Wire Calendly into AutomationShowcase CTA**

Update `AutomationShowcase.tsx` to also use `useCalendlyBooking` for its inline CTA.

**Step 3: Add FinalCTA to DemoShowcase as last section**

**Step 4: Verify — clicking CTA opens Calendly modal**

**Step 5: Commit**

```bash
git add src/components/demo-showcase/FinalCTA.tsx src/components/demo-showcase/AutomationShowcase.tsx src/pages/DemoShowcase.tsx
git commit -m "feat: add FinalCTA with Calendly integration and wire CTAs"
```

---

## Task 11: Assemble final DemoShowcase page

**Files:**

- Modify: `src/pages/DemoShowcase.tsx`

**Step 1: Assemble all sections in order**

```tsx
// src/pages/DemoShowcase.tsx
import { lazy, Suspense } from 'react'
import { SimpleHeader } from '../components/landing'
import HeroSection from '../components/demo-showcase/HeroSection'
import SocialProofBar from '../components/demo-showcase/SocialProofBar'
import AutomationShowcase from '../components/demo-showcase/AutomationShowcase'
import ServicePreview from '../components/demo-showcase/ServicePreview'
import FounderSection from '../components/demo-showcase/FounderSection'
import FinalCTA from '../components/demo-showcase/FinalCTA'

const ROICalculatorSection = lazy(() => import('../components/demo-showcase/ROICalculatorSection'))

export default function DemoShowcase() {
  return (
    <div className="min-h-screen bg-bg-deep">
      <SimpleHeader />

      <main>
        <HeroSection />
        <SocialProofBar />
        <AutomationShowcase />
        <ServicePreview />

        <Suspense fallback={<div className="h-96" />}>
          <ROICalculatorSection />
        </Suspense>

        <FounderSection />
        <FinalCTA />
      </main>
    </div>
  )
}
```

**Step 2: Verify full page flow**

Run: `npm run dev` → Navigate to `/demo`:

- Hero with 3 cards loads
- Social proof bar shows metrics
- 3 automation use cases with before/after + workflows
- Chatbot and Voice preview cards with links
- ROI Calculator lazy loads
- Founder section with pilot metrics
- Final CTA with Calendly

**Step 3: Test smooth scroll from hero cards to sections**

Click each service card in hero → should scroll to correct section.

**Step 4: Commit**

```bash
git add src/pages/DemoShowcase.tsx
git commit -m "feat: assemble complete DemoShowcase page with all sections"
```

---

## Task 12: Clean up App.tsx routing and remove dead demo routes

**Files:**

- Modify: `src/App.tsx`

**Step 1: Clean up routes**

- Remove or comment out: `/explorer`, `/dashboard`, `/ad-builder`, all `-intro` routes
- Keep `/calculator` as a standalone route (some links may reference it)
- Update `isDemoRoute` detection to only match `/demo`
- Remove `FloatingNav` conditional rendering
- Remove `PersonalizationControlBar` conditional rendering
- Keep chatbot persona logic (flagship on marketing, demo-guide on /demo)

**Step 2: Verify no broken imports**

Run: `npm run build`
Expected: No TypeScript errors, no missing imports.

**Step 3: Verify existing pages still work**

- `/` (homepage) → still works
- `/chatbots` → still works with DemoPlayground
- `/voice-agents` → still works with VapiWidget
- `/demo` → new DemoShowcase page

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "refactor: clean up old demo routes, keep new DemoShowcase"
```

---

## Task 13: Visual polish and responsive testing

**Files:**

- Potentially modify any `src/components/demo-showcase/*.tsx` files

**Step 1: Test on different viewport widths**

Check at: 320px (mobile), 768px (tablet), 1024px (small desktop), 1440px (large desktop).

Key checks:

- Before/After stacks vertically on mobile
- Workflow steps are vertical on mobile
- Service preview cards stack on mobile
- Calculator wizard is usable on mobile
- All text is readable, no overflow
- CTAs are full-width on mobile (min 44px tap targets)

**Step 2: Fix any responsive issues found**

**Step 3: Test animation performance**

- Scroll through entire page — animations should be smooth (60fps)
- Check that `whileInView` triggers at the right scroll position
- Verify AnimatedWorkflow plays correctly when scrolled into view

**Step 4: Commit any fixes**

```bash
git add -A
git commit -m "fix: responsive polish and animation refinements for demo page"
```

---

## Task 14: Final build verification

**Step 1: Run full build**

```bash
npm run build
```

Expected: Clean build with no errors.

**Step 2: Run type check**

```bash
npx tsc --noEmit
```

Expected: No TypeScript errors.

**Step 3: Test production build locally**

```bash
npm run preview
```

Navigate through: `/demo`, `/chatbots`, `/voice-agents`, `/`, `/pricing`
All pages should work correctly.

**Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify clean build for demo page restructure"
```

---

## Summary

| Task | Component                           | Est. Complexity |
| ---- | ----------------------------------- | --------------- |
| 1    | DemoShowcase shell + routing        | Low             |
| 2    | HeroSection with 3 cards            | Low             |
| 3    | SocialProofBar                      | Low             |
| 4    | BeforeAfter component               | Medium          |
| 5    | AnimatedWorkflow component          | Medium          |
| 6    | AutomationShowcase (3 use cases)    | Medium          |
| 7    | ServicePreview cards                | Low             |
| 8    | ROI Calculator section (soft-gated) | Medium-High     |
| 9    | FounderSection                      | Low             |
| 10   | FinalCTA with Calendly              | Low             |
| 11   | Assemble full page                  | Low             |
| 12   | Clean up old routes                 | Low             |
| 13   | Responsive polish                   | Medium          |
| 14   | Build verification                  | Low             |
