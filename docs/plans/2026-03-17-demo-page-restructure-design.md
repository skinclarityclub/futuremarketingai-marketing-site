---
title: Demo Page Restructure Design
tags: #design #demo #conversion #automation
created: 2026-03-17
source: brainstorming session with Perplexity research validation
---

# Demo Page Restructure Design

## Context

The current `/demo` route was built to showcase the Marketing Machine (Explorer, Dashboard, Calculator) when it was the only product. The business has since pivoted:

- **Now selling**: AI Automations, AI Chatbots, AI Voice Agents
- **Later (months out)**: Marketing Machine with real SKC pilot data
- **Problem**: The demo showcases a product that isn't ready, while the sellable services lack demos

### Research-Validated Decisions

| Decision                                  | Validation                                                      |
| ----------------------------------------- | --------------------------------------------------------------- |
| Single-page scroll + dedicated demo pages | Hybrid approach is B2B best practice                            |
| Before/after + animated workflow format   | 32% higher conversion than static demos                         |
| ROI calculator as lead gen tool           | 493% ROI reported for calculator-based lead gen                 |
| 3 service categories                      | 3-5 is optimal before scanning efficiency drops                 |
| Remove "coming soon" waitlist             | Trust killer for new agency — fragments focus                   |
| Founder-led positioning                   | 3x more engagement than corporate messaging                     |
| Soft-gated calculator                     | Post-results opt-in outperforms pre-results forms               |
| CTA after every section                   | Don't wait until bottom — offer booking after first proof point |

## What Gets Removed

- Neural Warp 5.5s intro animation
- Industry Selector modal
- Explorer (9 modules) — parked in code
- Dashboard (mock data) — parked in code
- FloatingNav sidebar
- DemoIntro transition animation
- Marketing Machine waitlist/teaser

## What Gets Kept

- ROI Calculator — repurposed as general tool for all services
- Chatbot floating widget — stays on all pages
- Existing demos on `/chatbots` and `/voice-agents` — unchanged

## New `/demo` Page Structure

### Section 1: Hero (5 second read time)

**Purpose**: Immediately communicate what FMai does and why it matters.

- Outcome-focused headline (not "AI automation" but specific savings/results)
- 3 clickable service cards: AI Automations, AI Chatbots, AI Voice Agents
- Each card: icon + service name + one-line outcome metric
- Sub-headline with founder positioning: "Built and delivered by [name] — direct access to expertise"
- Click card -> smooth scroll to that section

### Section 2: Social Proof Bar

**Purpose**: Build credibility without case studies.

- Pilot metrics: "240+ hours automated | 3 live implementations | 14-day deployment"
- Tech stack badges: n8n, Claude, Vapi, Make (proves technical competence)
- No fake client logos, no inflated claims

### Section 3: AI Automations (deepest section)

**Purpose**: Showcase the primary sellable service with 3 high-demand use cases.

Each use case gets:

- **Before/After visual**: Left side shows manual pain, right side shows automated flow with specific time/cost metrics
- **Animated workflow diagram**: Simplified n8n-style flow showing trigger -> AI processing -> output -> notification
- **Outcome metric**: Specific, defensible number (e.g., "50-70% more qualified leads")

**Use Case 1: Lead Scoring & Routing**

- Before: Sales rep manually reviewing 50 leads, 4 hours/day
- After: AI scores leads in real-time, rep gets ranked list, 30 min/day
- Workflow: Lead enters CRM -> AI extracts attributes -> ML model scores -> CRM updated -> Sales notified
- Metric: "10+ hours/week reclaimed per rep"

**Use Case 2: Sales Follow-up Sequences**

- Before: Manual follow-up emails, inconsistent timing, leads go cold
- After: Automated adaptive sequences based on recipient behavior
- Workflow: Lead action -> Trigger email -> If opened: follow-up immediately -> If no response: escalate after 5 days -> If replied: notify sales
- Metric: "320% more revenue from automated sequences"

**Use Case 3: Appointment Scheduling & No-show Prevention**

- Before: 5 email back-and-forth over 3 days to schedule one meeting
- After: One-click calendar booking + automated reminder sequence
- Workflow: Prospect clicks link -> Sees available times -> Books slot -> Auto-confirmation + reminders at -24h, -2h, -15min
- Metric: "50% fewer no-shows"

**CTA after section**: "Plan a 15-min call about your automation needs"

### Section 4: AI Chatbots (showcase + link)

**Purpose**: Brief showcase that drives to the existing live demo.

- What it does + outcome metric ("84% of routine questions answered automatically")
- Visual preview of the live chatbot demo (screenshot or mini embedded version)
- "Try the live demo ->" link to `/chatbots`
- CTA: "Book a call about chatbots for your business"

### Section 5: AI Voice Agents (showcase + link)

**Purpose**: Brief showcase that drives to the existing live demo.

- What it does + outcome metric ("24/7 phone handling, zero hold time")
- Phone number CTA or visual preview of voice interaction
- "Call our AI ->" link to `/voice-agents`
- CTA: "Book a call about voice agents"

### Section 6: ROI Calculator (soft-gated)

**Purpose**: Personalized ROI calculation that qualifies leads.

- Repurposed from existing Calculator component
- Simplified wizard: team size, hours on manual work, hourly cost
- Shows results immediately WITHOUT requiring email
- After results: "Save your results + get a custom implementation roadmap" -> email capture
- Conservative assumptions with transparency: "Based on industry benchmarks"

### Section 7: Founder Section

**Purpose**: Build trust through founder visibility and authenticity.

- Photo + name
- Short story: why FMai exists, background in AI/automation
- Differentiator: "I personally build every solution — no account managers, no handoffs"
- Pilot case study: "Here's what I built for my own business" with real metrics from SKC
- Implementation promise: "Live in 14 days or less"

### Section 8: Final CTA

**Purpose**: Close the deal.

- Calendly booking with pre-filled context from page interactions
- Clear expectation: "15-minute discovery call — we'll map your biggest automation opportunity"
- No form fields beyond Calendly

## Design System

Follows existing CLAUDE.md theme:

- Dark background: #050814
- Surface: #0A0E27
- Primary accent: #00D4FF (cyan)
- Secondary accent: #A855F7 (purple)
- Success: #00FF88 (green)
- Typography: Inter (sans), JetBrains Mono (mono)

## Key Design Principles

1. **Outcome over capability** — every headline is a result, not a feature
2. **Specificity over vagueness** — concrete numbers, not "efficient" or "powerful"
3. **Respect time** — prospect understands value in 10 seconds, is convinced in 2 minutes
4. **Founder-led** — solo agency is the advantage, not the limitation
5. **Proof over promise** — pilot data, tech badges, live demos > marketing claims
6. **CTA everywhere** — booking option after every section, not just at the end
7. **Soft-gate** — show value first, ask for info second

## Automation Demo Format Specification

Each of the 3 automation use cases follows this visual structure:

```
+------------------------------------------+
|  USE CASE TITLE + OUTCOME METRIC         |
+------------------------------------------+
|                                          |
|  [BEFORE]          [AFTER]               |
|  Manual process    Automated flow        |
|  with pain         with gains            |
|  metrics           metrics               |
|                                          |
+------------------------------------------+
|                                          |
|  ANIMATED WORKFLOW                       |
|  Step 1 -> Step 2 -> Step 3 -> Step 4   |
|  (simplified flow, business logic only)  |
|                                          |
+------------------------------------------+
```

- Before/After: side-by-side on desktop, stacked on mobile
- Workflow animation: 30-45 seconds max, auto-plays on scroll into view
- Workflow shows business logic, NOT technical implementation details
- Each step has icon + brief label + optional metric

## Mobile Considerations

Despite desktop-first approach, mobile MUST work:

- Before/After stacks vertically
- Workflow animation simplifies to vertical steps
- All CTAs are full-width tap targets
- Calculator works on mobile
- No "desktop only" notice on this page
