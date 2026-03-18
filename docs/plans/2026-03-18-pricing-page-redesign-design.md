---
title: 'Pricing Page Redesign — Gateway Services'
tags: [pricing, website, design, gateway-services]
created: 2026-03-18
source: Claude Code brainstorming session
---

# Pricing Page Redesign — Gateway Services

## Context

FMai has pivoted to offer three gateway services (automations, chatbots, voice agents) alongside the flagship Marketing Machine. The current `/pricing` page only shows the Marketing Machine tiers (€15-22.5K/mo). It needs to be replaced with the new tiered gateway pricing (Starter/Growth/Scale) while keeping the flagship as an upsell section.

Additionally, the three service pages (automations, chatbots, voice agents) have outdated pricing sections that need updating to reflect the new packages.

## Changes Required

### 1. Replace /pricing page

**New structure:**

```
SimpleHeader

Hero
  Title: "AI die voor je werkt — kies je pakket"
  Subtitle: managed AI services positioning

3-Column Grid: Starter | Growth (highlighted) | Scale
  Per tier:
  - Name + icon
  - Price/mo (JetBrains Mono, large)
  - "vanaf €X setup" (smaller)
  - Service count (1/2/all 3)
  - Included limits (conversations, minutes, workflows)
  - Features list (support, analytics, etc.)
  - CTA: "Plan een gesprek" → Calendly
  Growth tier: accent-system border + shadow-glow-sm

--- Divider ---

Marketing Machine Teaser Section
  "Voor bedrijven die alles willen"
  Brief description + Founding Member badge
  CTA → /marketing-machine

FAQ Section (6-8 items)
  - Wat als ik over mijn limiet ga? (soft cap, upgrade bij check-in)
  - Kan ik upgraden? (ja, op elk moment)
  - Wat zit er in de setup fee? (audit, bouw, integratie, testing)
  - Hoe snel is het live? (1-2 weken Starter, 2-4 weken Growth/Scale)
  - Welke services kan ik kiezen? (chatbot, voice agent, automations)
  - Is er een contract? (maandelijks opzegbaar)
  - Wat als ik meer services wil? (upgrade naar hoger tier)
  - Hoe werkt support? (email/chat/priority per tier)

Trust Metrics (3 stats)

Final CTA

LandingFooter
```

### 2. Update service page pricing sections

Each service page gets updated pricing showing the three tiers filtered for that service:

**AutomationsPage:**

- Starter: 5 workflows — vanaf €1.497/mo
- Growth: 10 workflows — vanaf €2.497/mo
- Scale: 20 workflows — vanaf €3.997/mo

**ChatbotsPage:**

- Starter: 1.000 gesprekken/mo — vanaf €1.497/mo
- Growth: 3.000 gesprekken/mo — vanaf €2.497/mo
- Scale: 5.000 gesprekken/mo — vanaf €3.997/mo

**VoiceAgentsPage:**

- Starter: 200 minuten/mo — vanaf €1.497/mo
- Growth: 500 minuten/mo — vanaf €2.497/mo
- Scale: 1.000 minuten/mo — vanaf €3.997/mo

Each includes "Bekijk alle pakketten →" link to /pricing.

### 3. Add gateway pricing types

Extend `src/types/pricing.ts` with gateway tier definitions alongside existing flagship tiers.

### 4. Pricing data centralization

Create a `src/lib/gateway-pricing.ts` data file with all tier details, limits, and features so pricing is defined once and reused across the pricing page and all service pages.

## Design Tokens (existing system)

- Background: bg-deep (#0A0D14), bg-surface (#111520)
- Highlighted tier: accent-system (#00D4AA) border + glow
- Price numbers: JetBrains Mono, text-3xl+
- Cards: card-gradient-border pattern
- Animations: Framer Motion ScrollReveal
- Typography: Space Grotesk (headers), DM Sans (body)

## Files to Modify

- `src/pages/PricingPage.tsx` — complete rewrite
- `src/pages/AutomationsPage.tsx` — update pricing section
- `src/pages/ChatbotsPage.tsx` — update pricing section
- `src/pages/VoiceAgentsPage.tsx` — update pricing section
- `src/types/pricing.ts` — add gateway tier types

## Files to Create

- `src/lib/gateway-pricing.ts` — centralized pricing data

## Verification

- All pricing pages render without errors
- Pricing numbers match the approved design (Starter €1.497, Growth €2.497, Scale €3.997)
- Growth tier is visually highlighted on /pricing
- Service pages show correct limits per service
- All CTAs link to Calendly
- Marketing Machine teaser links to /marketing-machine
- FAQ section renders with correct content
- Mobile responsive (stacked cards on mobile)
- Passes existing build (npm run build)
