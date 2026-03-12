# FMai — Revised Business Strategy, Design System & Implementation Plan

> **For Claude:** This plan contains full research context + design system + implementation tasks. Use `/gsd:plan-phase` to execute phases.

**Date:** 2026-03-12 (updated 2026-03-13)
**Status:** Design approved, ready for wave-based execution
**Previous plan:** `docs/plans/2026-03-12-future-ai-expansion.md` (Phase 1 + 2 already executed)
**Brand:** FMai (displayed as FM**ai**) — domain: future-marketing.ai

---

## BRAND DECISION (2026-03-13)

### From "Future AI" to "FMai"

**Problem:** "Future AI" as brand name requires an expensive domain. The current domain `future-marketing.ai` doesn't match. "Future Marketing AI" is too narrow for automations/chatbots/voice agents.

**Decision:** Use **FMai** as the brand. Like IBM outgrew "International Business Machines", FMai is short, modern, memorable, and the domain supports it perfectly (`future-marketing.ai` → FM + ai).

**Display:** "FM**ai**" — the "ai" portion is visually differentiated via accent color or font weight.

---

## WHAT WAS ALREADY DONE

### Phase 1: Website Rebrand ✅ (5 commits on main)

- `index.html` meta tags updated to "Future AI"
- i18n brand keys updated in EN/NL/ES (logo reads "Future AI")
- Landing hero updated: new headline, CTAs, trust anchor
- Remaining brand references updated (MessageList, Header aria-labels)
- SimpleHeader navigation: Services dropdown (Automations, Chatbots, Voice Agents, Marketing Machine) + Calendly CTA

### Phase 2: Service Pages ✅ (3 commits on main)

- `/automations` — AutomationsPage.tsx (hero, pain points, what we automate, process, pricing, trust bar, FAQ, CTA)
- `/chatbots` — ChatbotsPage.tsx (hero, use cases, process, pricing, trust metrics, FAQ, CTA)
- `/voice-agents` — VoiceAgentsPage.tsx (hero, use cases, pricing, partnership note, FAQ, CTA)
- All registered in App.tsx (lazy imports, marketingPaths, Routes)

### What Needs Revision

- Brand needs update from "Future AI" → "FMai" across entire codebase (~80+ references)
- Hero is too generic ("AI Systems That Run Your Business")
- Service pages have design inconsistencies (see UI/UX audit below)
- Full design overhaul needed (new colors, typography, visual language)
- Domain mismatch: SEO component uses `futuremarketingai.com` instead of `future-marketing.ai`

---

## STRATEGIC PIVOT: WHY THIS PLAN EXISTS

### The Problem

FMai was built as the core product — an autonomous AI marketing system. But:

- FMai is NOT proven yet. It needs 1 more month of building (ad builder, reel builder, stories) + 2-3 months of data collection on SkinClarity Club (SKC)
- Without a case study, FMai is just a claim — no B2B buyer will pay €5-15K/mo on a claim
- Meanwhile, the founder needs revenue NOW
- Simpler services (automations, chatbots) can sell immediately but risk cannibalizing the flagship

### The Solution: Philosophy-First Positioning + Funnel Strategy

Research from 5 parallel Perplexity deep-research sessions (see below) unanimously points to:

1. **Position the PHILOSOPHY as the flagship, not the current product state** (like HubSpot did with "inbound marketing")
2. **Sell gateway services NOW** (automations, chatbots) for immediate revenue + case studies
3. **Frame FMai as "founding member beta"** — not "coming soon" (which sounds unfinished)
4. **Build the upsell funnel**: gateway clients → trust → FMai retainer (25-35% convert)
5. **Use SKC as pilot case study** at 8-12 weeks of data (not waiting for 12 months)

---

## DESIGN SYSTEM (Approved 2026-03-13)

### Design Philosophy: "Living System"

The site should feel like opening a control room — not a marketing website that TELLS you about AI, but a live system that SHOWS it. The 3D visualization, real-time data, and system-panel aesthetic demonstrate AI mastery through the site itself.

**Core principle:** "This is the future. A professional who fully understands AI works here."

### Visual Metaphor

The entire site feels like a **mission control / live system overview**. Elements reference system monitoring, deployment logs, and operational dashboards. The site IS the proof of competence.

### Color Palette

| Token           | Hex                      | Usage                                          |
| --------------- | ------------------------ | ---------------------------------------------- |
| `bg-deep`       | `#0A0D14`                | Main background                                |
| `bg-surface`    | `#111520`                | Panels, cards, elevated elements               |
| `bg-elevated`   | `#1A1F2E`                | Hover states, active elements                  |
| `text-primary`  | `#E8ECF4`                | Headlines, important text                      |
| `text-muted`    | `#5A6378`                | Descriptions, labels                           |
| `accent-system` | `#00D4AA`                | "System running" — primary accent (teal-green) |
| `accent-human`  | `#F5A623`                | "Human attention needed" — amber               |
| `status-active` | `#22C55E`                | Live/operational indicators                    |
| `border`        | `rgba(255,255,255,0.06)` | Subtle dividers                                |

**No blue/purple gradients.** No rainbow. Two accents: teal = machine, amber = human.

### Typography

| Role              | Font               | Weight   | Usage                                              |
| ----------------- | ------------------ | -------- | -------------------------------------------------- |
| Display/Headlines | **Space Grotesk**  | 700      | Page titles, hero text, section headers            |
| Body              | **Inter**          | 400, 500 | Descriptions, paragraphs, nav links                |
| Data/System       | **JetBrains Mono** | 400, 700 | All numbers, metrics, status labels, terminal text |

**The tension between grotesk and mono IS the story.** Mono = the machine. Grotesk = the human narrative around it.

### Visual Elements

- **Status indicators**: small dots (green/amber) with subtle pulse animation (3s cycle)
- **System panels**: `bg-surface` + thin border + scan-line overlay (very subtle, 2px interval, low opacity)
- **Connection lines**: thin (1px) lines between sections with flowing data-dots (CSS animation)
- **3D Hero**: Three.js system diagram showing FMai modules connected with animated data flow (NOT decorative blob — functional diagram)
- **Noise texture**: SVG feTurbulence grain overlay at 2-3% opacity
- **Monospace for data**: every number, metric, status label uses JetBrains Mono
- **Accent dividers**: thin (2-3px) amber/teal lines between major sections, 40-60px wide

### What We're Removing

- ❌ Glassmorphism (overdone in AI space)
- ❌ Indigo/violet/pink gradient palette
- ❌ Floating particles and neural network decorations
- ❌ Gradient text effects
- ❌ Satoshi font (replacing with Space Grotesk)
- ❌ Multiple glow effects

### Component Design Language

| Element             | Style                                                                     |
| ------------------- | ------------------------------------------------------------------------- |
| Buttons (primary)   | `accent-system` filled, no border-radius (sharp or 4px max)               |
| Buttons (secondary) | Transparent + thin border, hover fills with `bg-elevated`                 |
| Cards/Panels        | `bg-surface` + `border` + optional scan-line overlay                      |
| Service items       | System-panel feel with status dots, monospace metrics                     |
| Hover states        | Subtle bg change + left-border glow (teal), no scale transforms           |
| Data displays       | Large monospace numbers + small monospace labels                          |
| Terminal/logs       | Dark bg, monospace, colored timestamps (teal), status words (green/amber) |

### Responsive Strategy

- Desktop-first (B2B audience)
- Mobile: stack panels vertically, hide 3D visualization, keep monospace data
- Touch targets: 44px minimum (WCAG AAA)
- Breakpoints: 768px (tablet), 480px (mobile)

---

## UI/UX AUDIT FINDINGS (2026-03-13)

### Critical Issues to Fix

| Issue                                              | Impact                | Where                                  |
| -------------------------------------------------- | --------------------- | -------------------------------------- |
| VoiceAgents page missing secondary CTA             | Incomplete UX         | Hero section                           |
| CTA destinations inconsistent across pages         | User confusion        | All pages                              |
| ~80 brand references still say "FutureMarketingAI" | Brand inconsistency   | Codebase-wide                          |
| CSS variables don't match Tailwind config          | Two color systems     | index.css vs tailwind.config.js        |
| Framer Motion ignores `prefers-reduced-motion`     | Accessibility failure | All animated components                |
| Focus trap missing in mobile menu                  | WCAG failure          | SimpleHeader.tsx                       |
| Domain mismatch in SEO component                   | SEO issue             | SEOHead.tsx uses futuremarketingai.com |
| Hardcoded Dutch text in mobile hero                | i18n broken           | SimplifiedHeroMobile.tsx               |
| No centralized Button component                    | Maintenance burden    | Each page has own button styles        |
| Calendly opens in new tab, not modal               | Bad UX                | Multiple CTAs                          |
| Footer uses emoji as icon (🗑️)                     | Unprofessional        | Footer.tsx                             |

### Design Inconsistencies Between Service Pages

| Aspect            | Automations                   | Chatbots                      | Voice Agents       |
| ----------------- | ----------------------------- | ----------------------------- | ------------------ |
| Hero CTA 1        | "Get a Free Automation Audit" | "See a Live Demo"             | "Book a Demo Call" |
| Hero CTA 2        | "See Examples"                | "Get a Free Strategy Session" | **MISSING**        |
| Use case grid     | 3-col, 6 items                | 2-col, 4 items                | 2-col, 4 items     |
| Trust metrics row | Present (3 metrics)           | Present (3 metrics)           | **MISSING**        |

### What's Good (Keep)

- ✅ Touch targets 44-56px (WCAG AAA)
- ✅ Lazy loading with Suspense
- ✅ i18n system (EN/NL/ES)
- ✅ Framer Motion animation quality
- ✅ Mobile-first responsive strategy
- ✅ Calendly integration architecture (ICP routing, analytics)
- ✅ Three.js + React Three Fiber already installed

---

## HOMEPAGE DESIGN (New)

### Page Structure

The hero is NOT a traditional "headline + CTA" — it's a **live system overview**.

| #   | Section                         | Content                                                                                                                                                 |
| --- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **System Bar** (nav)            | Fixed top: FMai logo, "SYSTEM STATUS: ALL OPERATIONAL" + green dot, live clock (JetBrains Mono, updates every second), "Book a call" CTA                |
| 2   | **Hero: Live System**           | 3D system diagram (Three.js) showing 4 FMai modules connected with animated data flow. Below diagram: headline "Your marketing, on autopilot." + 2 CTAs |
| 3   | **Social Proof**                | "Trusted by forward-thinking teams" — monospace company name placeholders                                                                               |
| 4   | **System Metrics**              | 4 large monospace numbers: "247%" (teal) / "360 hrs" (teal) / "99.8%" (green) / "<14 days" (amber). Count up on scroll.                                 |
| 5   | **Services: Available Systems** | 4 system panels with: SYS-01 numbering, service name, description, status badge "DEPLOYABLE", live-feel metrics                                         |
| 6   | **How It Works**                | 3 steps: Discovery → Build → Launch. Connected by gradient teal-to-amber line.                                                                          |
| 7   | **Live Pilot**                  | Panel: "ACTIVE PILOT: SKINCLARITY CLUB" + pulsing green dot. Animated metric counters. Progress bar "Week 8 of 12".                                     |
| 8   | **Bottom CTA**                  | "Ready for launch?" + "Deploy your AI systems in under 2 weeks." + primary CTA button                                                                   |
| 9   | **Footer**                      | FMai logo + future-marketing.ai + "Systems operational" status + social links                                                                           |

### Hero 3D Visualization (Three.js)

- Central node: "FMai CORE"
- 4 satellite nodes: Content Engine, Chatbot Fleet, Voice Systems, Automation Grid
- Animated connection lines with flowing data particles between nodes
- Subtle mouse-parallax interaction
- Replaces current decorative blob/sphere on /demo
- Falls back to static SVG diagram on mobile

### CTA Strategy (Consistent Across All Pages)

| Location               | Primary CTA                 | Secondary CTA     | Destination                 |
| ---------------------- | --------------------------- | ----------------- | --------------------------- |
| Nav bar                | "Book a call"               | —                 | Calendly modal              |
| Homepage hero          | "Get a Free Audit"          | "See our systems" | Calendly modal / #services  |
| Service pages          | "Book a Strategy Call"      | "See Use Cases"   | Calendly modal / #use-cases |
| /marketing-machine     | "Apply for Founding Access" | "View Demo"       | Calendly modal / /demo      |
| Bottom CTA (all pages) | "Book a Free Strategy Call" | —                 | Calendly modal              |

**Rule:** All Calendly links open as MODAL (not new tab). Use existing CalendlyModal component with dark theme params: `background_color=111520&text_color=e8ecf4&primary_color=00D4AA`

---

## /MARKETING-MACHINE PAGE (New)

**Route:** `/marketing-machine`
**Framing:** "Controlled Beta" — NOT "coming soon"

### Sections

| #   | Section      | Content                                                                                                                                        |
| --- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hero         | Badge: "Now in Controlled Beta — 3 Founding Member Slots Available". Headline. Description. CTA: "Apply for Founding Member Access" → Calendly |
| 2   | What It Does | 6 modules (already built as demo features): content creation, scheduling, analytics, optimization, ad management, reporting                    |
| 3   | How It Works | Workflow: Research → Create → Publish → Optimize → Learn (loop)                                                                                |
| 4   | Live Pilot   | "Currently running on SkinClarity Club" — real metrics, updated as data comes in                                                               |
| 5   | FAQ          | What's included, how the beta works, timeline to full launch                                                                                   |
| 6   | CTA          | "Apply for Founding Member Access" → Calendly                                                                                                  |

**No pricing on this page.** Pricing discussed on call only.
**Link to /demo** as interactive proof of concept.

---

## RESEARCH CONTEXT (5 Perplexity Deep Research Sessions, 2026-03-12)

### Research 1: Agency Flagship Positioning

**Key finding:** Every successful company positions the philosophy/category as the flagship, not the current product state.

**Examples:**

- **HubSpot** coined "inbound marketing" and sold simple tools while building a comprehensive platform. The brand promise transcended the product scope at any given moment.
- **Drift** coined "conversational marketing" while their product was still manual-heavy. They created the category narrative before the technology was mature.
- **Jasper AI** sells content generation while building autonomous marketing agents. Positions "purpose-built marketing agents spanning 100+ functions."

**Tactical advice:**

- Stage Transparency + Capability Aspiration = Trust
- Weak: "Our platform is still in beta" → Strong: "We're evolving from managed to fully autonomous. Here's what autonomous means..."
- "Founding Customer" programs with lifetime discounts and input into product direction work well
- The flagship should feel _relational_ (ongoing intelligence, strategic guidance), gateway should feel _transactional_ (setup, optimization)

**Cannibalization warning signs:**

1. Gateway services represent 80%+ of revenue after 18+ months
2. Primary marketing emphasizes gateway over flagship vision
3. Prospects assume you specialize in the gateway ("you're chatbot consultants")

**Mitigation:** Define clear endpoint for gateway relationships. Maintain visual/linguistic hierarchy. Create decision gates for moving clients toward flagship.

### Research 2: AI Freelancer Market 2025-2026

**Market data:**

- AI skills demand: **+109% YoY** on Upwork
- AI video generation: +329% growth
- AI integration: +178% growth
- AI chatbot development: +71% growth, 3,230+ open positions

**Pricing (new sellers → established):**
| Service | New Seller | Established |
|---|---|---|
| AI workflow automation | €500-2,500/project | €5,000-15,000 |
| Chatbot systems | €1,500-3,500 | €5,000-7,500 |
| Voice agent development | €2,000-5,000 | €5,000-15,000 + retainer |
| AI consulting/retainer | N/A | €5,000-15,000/mo |

**What's working in 2025-2026:**

- Voice agents (barely existed in 2024, now highest margin)
- Outcome-based pricing ("I increase qualified leads by 40%")
- Retainer-based revenue (€1-5K/mo)
- Productized services ("AI Lead Qualification System, €3,000")
- AI-augmented services openly branded as such (+30-40% premium)

### Research 3: Gateway → Flagship Funnel

**The five-layer funnel:**
| Stage | Price | Purpose |
|---|---|---|
| Free Lead Magnet | €0 | Audit tool, assessment — generates leads |
| Gateway/Tripwire | €97-297 | Low-ticket audit — proves methodology |
| Entry Engagement | €997-2,497 | Limited project — tangible results |
| Primary/Flagship | €5,000-15,000+/mo | Comprehensive retainer |
| Premium Retainer | €15,000+/mo | White-glove strategic advisory |

**Conversion benchmarks:**
| Transition | Rate | Timeline |
|---|---|---|
| Gateway → Entry engagement | 25-40% | 90-180 days |
| Entry engagement → Retainer | 25-35% | 120 days post-project |
| Overall: Gateway → Retainer | 6-14% | 90-180 days |

**Upsell timing (critical):**

- At point of delivery: 37.8% conversion
- Immediately post-delivery: 23.4%
- 30+ days post: 14.6%

**Key principles:**

- Each tier should be 3-5x the previous
- Present highest tier FIRST (price anchoring)
- Gateway should solve only 10-20% of the larger challenge
- Reserve ~20% of retainer hours for strategic planning

### Research 4: Case Study Timing & MVP Proof

**Minimum credible case study: 8-12 weeks of tracked data.**

| Timeframe      | What You Can Claim                                           |
| -------------- | ------------------------------------------------------------ |
| 2-4 weeks      | Implementation success (system live, integrations working)   |
| 4-6 weeks      | Specific metrics (email rates, preliminary lead gen numbers) |
| **8-12 weeks** | **Credible "pilot results" with trend data**                 |
| 12-16 weeks    | Polished case study with baseline-vs-result narrative        |

**"Founding Member" program structure:**

- 15-30% discount off standard pricing
- 3-6 month duration
- Client agrees to participate in case study + provide feedback
- Position as win-win: client gets discounted premium service + influence on development

### Research 5: Solo AI Agency 90-Day Cold Start

**90-day realistic path:**

- Week 1-2: Foundation (profiles, landing page, first 50 emails)
- Week 3-4: First client(s) closed (€2-5K)
- Week 5-8: Delivery + continued outreach (€5-8K cumulative)
- Week 9-12: 2-3 retainer clients (€8-12K/mo run rate)

**Critical mistakes to avoid:**

1. Positioning around technology instead of outcomes (reduces conversion 30-50%)
2. Attempting too many channels simultaneously
3. Attempting premium positioning without track record
4. Underestimating B2B sales cycles (30-60 days median)

### Research 6: Design & Differentiation (2026-03-13)

**Key finding:** The AI agency website space is saturated with dark + purple gradient + glassmorphism designs. Standing out requires a strong visual concept, not just different colors.

**What award-winning sites do differently (Awwwards 2025-2026):**

- **Locomotive** (6x Agency of the Year): Only 2 typefaces, custom font, 3D team member scans. Restraint + one bold idea beats visual noise.
- **Lusion** (Site of the Month): Pre-rendered 3D optimized to 983KB desktop / 246KB mobile. Proves 3D can be lightweight.
- **Lando Norris** (Site of the Year 2025): Cinematic scroll, bold typography, speed-inspired animations. The experience IS the pitch.

**Trends replacing dark+glassmorphism:**

- Kinetic typography (text that moves, responds to scroll)
- Warm futurism (earthy tones + tech elements)
- Strong visual metaphors (the site embodies a concept, not just displays content)
- Custom typeface/font choices as differentiator
- 3D used functionally, not decoratively

**Anti-AI-aesthetic movements:**

- Neo-brutalism (Gumroad, Figma refresh)
- Organic futurism (biomorphic shapes + clean tech UI)
- Editorial/magazine layouts with serif headlines

**Decision:** "Living System" metaphor — the site feels like a mission control / live system overview. 3D system diagram as hero (functional, not decorative). Teal-green + amber palette. Monospace data creates tension with grotesk headlines.

---

## IMPLEMENTATION PHASES (Revised)

### Phase 3: Design Overhaul & FMai Rebrand (CODE — Waves)

**Goal:** Transform the site from generic AI template to the "Living System" design. Rebrand to FMai. Build /marketing-machine page.

#### Wave 1: Foundation (Design System + Fixes)

- Update Tailwind config with new color palette (remove indigo/violet/pink, add teal/amber system)
- Update CSS custom properties in index.css to match new palette
- Add Space Grotesk font, keep Inter and JetBrains Mono, remove Satoshi
- Create shared components: `<SystemPanel>`, `<StatusIndicator>`, `<CTAButton>`, `<SectionContainer>`, `<MetricDisplay>`
- Fix VoiceAgents page: add missing secondary CTA + trust metrics row
- Fix accessibility: add `prefers-reduced-motion` check in Framer Motion animations
- Fix mobile menu focus trap
- Standardize CTA destinations across all pages (all Calendly → modal, not new tab)
- Fix Calendly dark theme (add color params to CalendlyModal)
- Replace footer emoji with Lucide icon

#### Wave 2: Homepage Redesign

- Build new System Bar (nav) with status indicator + live clock
- Build 3D system diagram hero (Three.js — reuse existing R3F setup, replace decorative sphere)
- Build system metrics section with animated counters (JetBrains Mono)
- Build services section as system panels (not marketing cards)
- Build "How It Works" 3-step flow
- Build Live Pilot section (SKC metrics, progress bar)
- Update hero i18n copy in all 3 locales (EN/NL/ES)
- Build new footer with status indicator

#### Wave 3: /marketing-machine Page

- Create MarketingMachinePage.tsx with founding member beta framing
- Sections: Hero (beta badge), What It Does (6 modules), How It Works (flow), Live Pilot (SKC), FAQ, CTA
- NO pricing on this page
- Link to /demo as proof of concept
- Register route in App.tsx + marketingPaths
- Update SimpleHeader nav: "AI Marketing Machine" → `/marketing-machine`

#### Wave 4: Brand Cleanup & Polish

- Update ALL ~80 brand references: "FutureMarketingAI" / "Future Marketing AI" / "Future AI" → "FMai"
- Fix domain mismatch in SEO components (futuremarketingai.com → future-marketing.ai)
- Fix hardcoded Dutch text in mobile hero → i18n
- Update service pages to use new design system components
- Remove dead code (unused shimmer animation, etc.)
- Ensure consistent design language across all pages

### Phase 4: Upwork & Fiverr Setup (OPERATIONAL — no code)

**Goal:** Launch on both platforms. Target first 5-10 reviews within 30-60 days.

- Task 4.1: Upwork profile setup (headline, description, portfolio)
- Task 4.2: 4 Fiverr gigs (automations, chatbots, lead gen, marketing automation)
- Task 4.3: First 2-3 projects at lower rates for reviews

**Upwork Profile Headline:**

```
AI Automation Expert | Custom Workflows, Chatbots & Marketing Systems for SaaS & E-commerce
```

**Fiverr Gigs (4 separate):**

- Gig 1: "I Will Automate Your Business Workflows Using Make, n8n or Zapier" — Basic €100 / Standard €250 / Premium €600
- Gig 2: "I Will Build a Custom AI Chatbot for Lead Generation or Customer Support" — €150 / €350 / €750
- Gig 3: "I Will Build an AI-Powered Lead Generation and Sales Automation System" — €150 / €400 / €900
- Gig 4: "I Will Set Up an AI Marketing Automation System for Your Business" — €200 / €500 / €1,200

### Phase 5: Cold Email Campaign (OPERATIONAL — no code)

**Goal:** First 200-300 contacts, start multi-channel outreach

- Task 5.1: Build ICP list (SaaS, 20-100 employees, US/UK, recently funded)
- Task 5.2: Set up 4-email sequence over 14 days
- Task 5.3: LinkedIn multi-channel touchpoints (days 1, 5, 12)
- Task 5.4: Track and optimize (target: >25% open, >5% reply)

### Phase 6: Voice Agent Partnership (OPERATIONAL)

- Start with referral model: refer clients → friend delivers → 20-30% fee
- `/voice-agents` page already built (Phase 2)
- After 2-3 deals: upgrade to white-label (you sell, friend builds, 40-50% margin)

### Phase 7: SKC Case Study Development (OPERATIONAL + SMALL CODE)

**Goal:** Document SKC results as they come in. Publish "pilot results" at 8-12 weeks.

- Task 7.1: Define baseline metrics for SKC
- Task 7.2: Track weekly metrics (posts automated, engagement, reach, follower growth)
- Task 7.3: At 8 weeks: draft "pilot results" case study
- Task 7.4: Add to `/marketing-machine` page as live proof
- Task 7.5: At 16 weeks: publish full case study on `/case-studies`

### Phase 8: Language Expansion (FUTURE — month 4+)

1. German (month 4-5) → 2. Spanish improvements (month 6-7) → 3. French (month 8-9)

---

## REVENUE TIMELINE (REVISED)

| Period    | Channel                                            | Expected Revenue      |
| --------- | -------------------------------------------------- | --------------------- |
| Month 1   | Fiverr/Upwork first projects                       | €2,000-€5,000         |
| Month 2   | Freelance + first cold email replies               | €5,000-€8,000         |
| Month 3   | First retainer clients + SKC pilot data ready      | €8,000-€12,000        |
| Month 4   | FMai founding member pitch begins (SKC case study) | €10,000-€15,000       |
| Month 5-6 | 2-3 retainer clients + first FMai founding member  | €15,000-€25,000       |
| Month 6+  | FMai retainers compounding                         | €15,000+/client/month |

**Retainer sweet spot:** 3-5 automation clients at €1-3K/mo + 1-2 FMai founding members at €5-10K/mo = **€13,000-€35,000 recurring base**

---

## EXECUTION PRIORITY

| Priority | Task                                                        | Phase   | Wave   | Type        |
| -------- | ----------------------------------------------------------- | ------- | ------ | ----------- |
| 1        | Design system foundation (colors, fonts, shared components) | Phase 3 | Wave 1 | Code        |
| 2        | Fix critical UX issues (VoiceAgents, CTAs, accessibility)   | Phase 3 | Wave 1 | Code        |
| 3        | Homepage redesign (system bar, 3D hero, panels)             | Phase 3 | Wave 2 | Code        |
| 4        | Build `/marketing-machine` founding member page             | Phase 3 | Wave 3 | Code        |
| 5        | Brand cleanup (FMai references, SEO, dead code)             | Phase 3 | Wave 4 | Code        |
| 6        | Set up Upwork profile                                       | Phase 4 | —      | Operational |
| 7        | Create 4 Fiverr gigs                                        | Phase 4 | —      | Operational |
| 8        | Build ICP list (200-300 contacts)                           | Phase 5 | —      | Operational |
| 9        | Define SKC baseline metrics                                 | Phase 7 | —      | Operational |

---

## CODEBASE TECHNICAL CONTEXT

### Current Tech Stack

- React 18.3.1 + TypeScript 5.7.2 + Vite 6.0.5
- Tailwind CSS 3.4.17
- Framer Motion 11.0.0
- Three.js 0.168.0 + @react-three/fiber + @react-three/drei (already installed)
- react-calendly 4.4.0 (Calendly modal integration with ICP routing)
- react-i18next (EN/NL/ES)
- Zustand (state management)
- Deployed on Vercel

### Design System (NEW — replacing old)

- **Old:** `#050814` bg, indigo/violet/pink gradients, glassmorphism, Inter + Satoshi
- **New:** `#0A0D14` bg, teal `#00D4AA` + amber `#F5A623`, system panels, Space Grotesk + Inter + JetBrains Mono

### i18n Architecture

- ALL marketing text via `useTranslation()` — edit JSON files in `public/locales/{en,nl,es}/`
- Landing keys under `"landing"` namespace in `common.json`
- New pages can use hardcoded English initially, i18n in Wave 4

### Page Architecture

- Marketing routes get `SimpleHeader` + `LandingFooter` (determined by `marketingPaths` in App.tsx)
- To add new page: create component, add lazy import in App.tsx, add to marketingPaths, add Route

### Scheduling Integration

- Calendly already deeply integrated: react-calendly package, CalendlyModal component, ICP-based routing to 4 event types
- Primary URL: `calendly.com/futureai/strategy-call`
- **Action needed:** Upgrade to Calendly Standard ($10/mo) for branding removal + dark theme colors
- Add color params: `background_color=111520&text_color=e8ecf4&primary_color=00D4AA`

### Design Prototypes (Reference)

Prototypes created during design exploration (in `public/`):

- `prototype-mission.html` — Mission Control concept (closest to final direction)
- `prototype-hybrid.html` — Warm Futurism + Data Architect hybrid
- `prototype-engine.html` — Engine Room / flow diagram concept
- `prototype-blueprint.html` — Architect's Table / blueprint concept
- `prototype-4.html` — Cinematic Scroll concept
- `prototype-1.html` through `prototype-3.html` — Early explorations
  These are reference only — the actual implementation will be in React/Three.js.
