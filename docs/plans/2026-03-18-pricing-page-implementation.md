# Gateway Pricing Page & Service Pages Update — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current Marketing Machine pricing page with a new gateway services pricing page (Starter/Growth/Scale tiers) and update all three service pages with aligned pricing sections.

**Architecture:** Create a centralized gateway pricing data module (`src/lib/gateway-pricing.ts`) that defines all tier data once. The pricing page and service pages import from this single source of truth. No i18n for pricing numbers — they're hardcoded in the data file since prices change infrequently and need precise control.

**Tech Stack:** React 18, TypeScript, Tailwind CSS, Framer Motion, Lucide icons, existing design system (bg-deep, accent-system, card-gradient-border patterns).

---

### Task 1: Create gateway pricing data module

**Files:**

- Create: `src/lib/gateway-pricing.ts`

**Step 1: Create the data file**

```typescript
import type { LucideIcon } from 'lucide-react'
import { Zap, MessageSquare, Phone, BarChart3, Headphones, LineChart } from 'lucide-react'

export type GatewayTierId = 'starter' | 'growth' | 'scale'
export type ServiceType = 'chatbot' | 'voice' | 'automations'

export interface ServiceLimit {
  service: ServiceType
  label: string
  limit: string
}

export interface GatewayTier {
  id: GatewayTierId
  name: string
  price: number
  setupFee: number
  description: string
  serviceCount: string // "1 service", "2 services", "All 3 services"
  limits: ServiceLimit[]
  features: string[]
  highlighted: boolean
  badge?: string
}

export const GATEWAY_TIERS: GatewayTier[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 1497,
    setupFee: 2500,
    description: 'Start with 1 AI service to solve your biggest bottleneck.',
    serviceCount: '1 service',
    limits: [
      { service: 'chatbot', label: 'Chatbot', limit: '1,000 conversations/mo' },
      { service: 'voice', label: 'Voice Agent', limit: '200 minutes/mo' },
      { service: 'automations', label: 'Automations', limit: '5 workflows' },
    ],
    features: [
      'Choose 1 service',
      'Hosting & infrastructure included',
      'Monthly updates & maintenance',
      'Email support',
      'Setup in 1-2 weeks',
    ],
    highlighted: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    price: 2497,
    setupFee: 4500,
    description: 'Combine 2 AI services for maximum impact.',
    serviceCount: '2 services',
    limits: [
      { service: 'chatbot', label: 'Chatbot', limit: '3,000 conversations/mo' },
      { service: 'voice', label: 'Voice Agent', limit: '500 minutes/mo' },
      { service: 'automations', label: 'Automations', limit: '10 workflows' },
    ],
    features: [
      'Choose 2 services',
      'Analytics dashboard',
      'Monthly performance report',
      'Chat support',
      'Setup in 2-3 weeks',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    id: 'scale',
    name: 'Scale',
    price: 3997,
    setupFee: 7500,
    description: 'The complete AI stack — chatbot, voice & automations.',
    serviceCount: 'All 3 services',
    limits: [
      { service: 'chatbot', label: 'Chatbot', limit: '5,000 conversations/mo' },
      { service: 'voice', label: 'Voice Agent', limit: '1,000 minutes/mo' },
      { service: 'automations', label: 'Automations', limit: '20 workflows' },
    ],
    features: [
      'All 3 services included',
      'Priority support (<4h response)',
      'Monthly strategy call',
      'Advanced analytics',
      'Setup in 2-4 weeks',
    ],
    highlighted: false,
  },
]

export const PRICING_FAQS = [
  {
    q: 'What happens if I exceed my limits?',
    a: "We use a soft cap — your service won't be interrupted. We'll discuss upgrading to a higher tier at your next check-in if usage consistently exceeds limits.",
  },
  {
    q: 'Can I upgrade my plan?',
    a: 'Yes, you can upgrade at any time. We pro-rate the difference and adjust your limits immediately.',
  },
  {
    q: "What's included in the setup fee?",
    a: 'The setup fee covers a full audit of your needs, custom development, integration with your existing tools, testing, and launch support.',
  },
  {
    q: 'How quickly can I go live?',
    a: 'Starter plans typically launch in 1-2 weeks. Growth plans in 2-3 weeks. Scale plans in 2-4 weeks depending on integrations.',
  },
  {
    q: 'Which services can I choose?',
    a: 'You can choose from AI Chatbots (customer support, lead gen), AI Voice Agents (phone answering, appointment booking), and AI Automations (workflow automation, CRM integration).',
  },
  {
    q: 'Is there a contract?',
    a: 'No long-term contracts. All plans are month-to-month. The setup fee covers the initial build — after that, cancel anytime.',
  },
  {
    q: 'What if I need more services later?',
    a: 'Simply upgrade to a higher tier. Going from Starter to Growth adds a second service, and Scale gives you everything.',
  },
  {
    q: 'How does support work?',
    a: 'Starter includes email support. Growth adds chat support. Scale includes priority support with <4h response time and a dedicated monthly strategy call.',
  },
]

/** Format price as EUR with period separator */
export function formatGatewayPrice(price: number): string {
  return `€${price.toLocaleString('nl-NL')}`
}

/** Get limits for a specific service type across all tiers */
export function getServiceLimits(service: ServiceType): { tier: GatewayTier; limit: string }[] {
  return GATEWAY_TIERS.map((tier) => ({
    tier,
    limit: tier.limits.find((l) => l.service === service)?.limit ?? '',
  }))
}
```

**Step 2: Verify the file compiles**

Run: `npx tsc --noEmit src/lib/gateway-pricing.ts` or check build.

**Step 3: Commit**

```bash
git add src/lib/gateway-pricing.ts
git commit -m "feat: add centralized gateway pricing data module"
```

---

### Task 2: Rewrite PricingPage

**Files:**

- Modify: `src/pages/PricingPage.tsx` (complete rewrite)

**Step 1: Rewrite PricingPage.tsx**

Replace entire content with a new page that:

1. Imports `GATEWAY_TIERS`, `PRICING_FAQS`, `formatGatewayPrice` from `src/lib/gateway-pricing.ts`
2. Hero section: "AI die voor je werkt — kies je pakket" with subtitle
3. 3-column pricing grid (Starter | Growth highlighted | Scale) using existing card-gradient-border pattern
4. Each card shows: name, price (JetBrains Mono font-mono), setup fee, service count, limits, features, CTA to Calendly
5. Growth card: `border-accent-system/50 shadow-glow-sm` + "Most Popular" badge
6. Divider + Marketing Machine teaser section with link to /marketing-machine
7. FAQ section using PRICING_FAQS (details/summary accordion, same pattern as service pages)
8. Trust metrics bar (3 stats)
9. Final CTA card

Key design details:

- Price: `text-4xl font-bold font-mono text-text-primary`
- Setup fee: `text-sm text-text-muted` below price
- Limits shown as small pills/badges per service
- Features list with CheckCircle icons (same as service pages)
- CTA: CTAButton with calendly prop
- Marketing Machine teaser: compact card with accent-human border, TierBadge Founding, and link

**Step 2: Verify page renders**

Run: `npm run dev` and check `/pricing` in browser.

**Step 3: Commit**

```bash
git add src/pages/PricingPage.tsx
git commit -m "feat: rewrite pricing page with gateway service tiers"
```

---

### Task 3: Update AutomationsPage pricing section

**Files:**

- Modify: `src/pages/AutomationsPage.tsx` (pricing section only, ~lines 254-314)

**Step 1: Update pricing section**

Replace the current pricing section (which uses i18n translation keys for old tiers) with one that imports from `gateway-pricing.ts` and shows:

- 3 cards, each showing the automation-specific limit for that tier
- Starter: "5 workflows — €1.497/mo"
- Growth: "10 workflows — €2.497/mo" (highlighted)
- Scale: "20 workflows — €3.997/mo"
- Each card includes setup fee and a few key features
- "View all packages →" link to /pricing at bottom

Update the `PRICING_TIER_KEYS`, `PRICING_TIER_HIGHLIGHTED` constants and the pricing data construction to use the new gateway data instead of i18n keys.

**Step 2: Verify page renders**

Run: `npm run dev` and check `/automations`.

**Step 3: Commit**

```bash
git add src/pages/AutomationsPage.tsx
git commit -m "feat: update automations page with gateway pricing tiers"
```

---

### Task 4: Update ChatbotsPage pricing section

**Files:**

- Modify: `src/pages/ChatbotsPage.tsx` (pricing section only)

**Step 1: Update pricing section**

Same approach as Task 3 but for chatbot limits:

- Starter: "1,000 conversations/mo — €1.497/mo"
- Growth: "3,000 conversations/mo — €2.497/mo" (highlighted)
- Scale: "5,000 conversations/mo — €3.997/mo"

**Step 2: Verify page renders**

**Step 3: Commit**

```bash
git add src/pages/ChatbotsPage.tsx
git commit -m "feat: update chatbots page with gateway pricing tiers"
```

---

### Task 5: Update VoiceAgentsPage pricing section

**Files:**

- Modify: `src/pages/VoiceAgentsPage.tsx` (pricing section only)

**Step 1: Update pricing section**

Same approach but for voice limits:

- Starter: "200 minutes/mo — €1.497/mo"
- Growth: "500 minutes/mo — €2.497/mo" (highlighted)
- Scale: "1,000 minutes/mo — €3.997/mo"

**Step 2: Verify page renders**

**Step 3: Commit**

```bash
git add src/pages/VoiceAgentsPage.tsx
git commit -m "feat: update voice agents page with gateway pricing tiers"
```

---

### Task 6: Build verification

**Step 1: Run full build**

Run: `npm run build`
Expected: No TypeScript errors, no build failures.

**Step 2: Check all pages render**

Verify in browser:

- `/pricing` — 3 tiers visible, Growth highlighted, FAQ works, Marketing Machine teaser links correctly
- `/automations` — Updated pricing section with automation limits
- `/chatbots` — Updated pricing section with conversation limits
- `/voice-agents` — Updated pricing section with minute limits

**Step 3: Final commit if any fixes needed**

---

## Verification Checklist

- [ ] `src/lib/gateway-pricing.ts` compiles and exports correctly
- [ ] `/pricing` shows Starter (€1.497), Growth (€2.497 highlighted), Scale (€3.997)
- [ ] Setup fees visible on all tiers
- [ ] Marketing Machine teaser section at bottom of /pricing
- [ ] FAQ accordion works
- [ ] All CTAs link to Calendly
- [ ] `/automations` shows workflow limits per tier
- [ ] `/chatbots` shows conversation limits per tier
- [ ] `/voice-agents` shows minute limits per tier
- [ ] All service pages link to /pricing
- [ ] `npm run build` succeeds
- [ ] Mobile responsive (cards stack vertically)
