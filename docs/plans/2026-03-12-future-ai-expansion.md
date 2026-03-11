# Future AI — Business Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform FutureMarketingAI into "Future AI" — a full-spectrum AI implementation partner — while generating short-term revenue through productized automation services within 1-2 months.

**Architecture:** One brand (Future AI) on the existing domain (future-marketing.ai), with the AI Marketing Machine as flagship and AI Automations as the primary gateway service. All services live under one roof via dedicated service pages. The holding entity (Estland/e-Residency) operates behind the scenes — the online presence is built now without waiting for legal structure.

**Tech Stack:** React 18 + TypeScript + Vite + Tailwind CSS + Framer Motion (existing stack) | n8n / Make / Zapier (automation delivery) | Upwork + Fiverr (acquisition channels) | Cold email via partner infrastructure

---

## RESEARCH CONTEXT (Summary from 6 Perplexity Research Sessions)

### Market Validation

- AI agents market: **$7.63B (2025)**, growing at **45.8%/year**
- Voice AI market: **$2.4B → $47.5B** by 2034 (34.8% CAGR)
- Agency gross margins with AI: **65-90%**
- **81% of businesses** believe in AI, but only **15-20%** use it strategically
- Companies working with external partners are **2.5x more likely** to succeed with AI

### Brand Strategy Decision

- Research unanimously recommends **ONE specialist brand** over multi-brand
- Specialist brands achieve **5-8% conversion** vs 1-3% for generalists
- CAC is **2-4x lower** for specialists (€1.300-€2.000 vs €4.000-€5.000)
- Decision: FutureMarketingAI homepage rebranded to **"Future AI"** — one brand, multiple service pages

### Service Priority Order (Research-Validated)

1. **AI Automations** (lead service) — delivers in 1-2 weeks, easy to sell cold, high retainer conversion
2. **AI Marketing Machine** (flagship) — €5K-€15K/month, highest LTV
3. **AI Chatbots** (upsell) — €1.500-€5.000, add-on after trust is established
4. **AI Voice Agents** (partnership) — via friend's voice agent business
5. **AI Consulting** (reserve) — mention in calls, not on homepage

### Pricing (Research-Validated)

| Service              | Entry                 | Retainer         |
| -------------------- | --------------------- | ---------------- |
| AI Automations       | €1.000-€8.000/project | €2.000-€5.000/mo |
| AI Marketing Machine | €5.000-€15.000/mo     | — (is retainer)  |
| AI Chatbots          | €1.500-€5.000         | €500-€1.500/mo   |
| AI Voice Agents      | €1.000-€5.000         | €500-€1.000/mo   |

### Target ICP (Research-Validated)

- **Primary:** SaaS & e-commerce, 20-500 employees, US/UK/Canada
- **Secondary:** Real estate, professional services, healthcare
- **Titles:** Founder/CEO (1-50 emp), VP Operations/VP Marketing (50-500 emp)
- **Buying signals:** Recent funding, hiring spikes, new exec hire, tech stack change

### Acquisition Channels

- **Fiverr:** 4 separate gigs per specialization (automations, chatbots, voice, lead gen)
- **Upwork:** Specialist profile, 3-5 targeted proposals/day
- **Cold email:** Via partner's warm infrastructure, 200-300 contacts/batch, ICP-segmented
- **LinkedIn:** Multi-channel touchpoint alongside cold email

### Language Expansion Roadmap

1. English (now) → 2. German (month 4-5) → 3. Spanish (month 6-7) → 4. French (month 8-9) → 5. Portuguese (month 10-11, Brazil)

---

## CODEBASE TECHNICAL CONTEXT (from 3 parallel exploration agents)

### Design System

- **Dark-only app.** Background colors: `#050814` (deepest) / `#0A0E27` (surface) / `#0F1629` (cards)
- **Marketing pages** use: `bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900`
- **Accent colors (Tailwind tokens):** indigo `#6366F1` → violet `#8B5CF6` → pink `#EC4899`
- **Glow shadows:** `shadow-glow` = `0 0 20px rgba(99,102,241,0.4)` (indigo)
- **CSS utility palette (older, used in utilities):** cyan `#00D4FF`, purple `#A855F7`, green `#00FF88`
- **Glassmorphism:** via `<GlassCard>` component (3 variants) or `.glass-card` CSS class
  - default: `rgba(0,0,0,0.3)` + `backdrop-filter: blur(12px)` + `1px solid rgba(255,255,255,0.1)`
  - strong: `rgba(0,0,0,0.4)` + `blur(16px)`
  - subtle: `rgba(0,0,0,0.2)` + `blur(8px)`
- **Fonts:** Inter (variable, Google Fonts) + Satoshi (Fontshare) + JetBrains Mono
- **Border radius:** `rounded-2xl` is standard card radius
- **Hover lift:** `.hover-lift` = `translateY(-4px)` + `box-shadow: 0 10px 30px rgba(0,212,255,0.3)`
- **All animations** respect `prefers-reduced-motion`

### i18n Architecture (CRITICAL)

- ALL text in Hero.tsx and marketing components is **i18n-driven** via `useTranslation()`
- Text lives in: `public/locales/en/*.json` (English), `public/locales/nl/*.json` (Dutch), `public/locales/es/*.json` (Spanish)
- **To change visible text: edit the JSON files, NOT the TSX components**
- Key namespaces: `hero`, `common`, `landing`, `navigation`, `pricing_comparison`
- Landing page header text is in: `public/locales/en/landing.json` (keys: `header.brand.future`, `header.brand.marketing`, `header.brand.ai`)

### Logo Treatment

- **Text-based logo, no image file**
- Defined in `src/components/landing/SimpleHeader.tsx` (lines 192-213)
- Three colored `<span>` elements + Sparkles Lucide icon:
  - Sparkles icon: `text-blue-400`
  - "Future": `text-white/90` — from i18n key `landing.header.brand.future`
  - "Marketing": `bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent` — from i18n key `landing.header.brand.marketing`
  - "AI": `text-cyan-400 ml-0.5` — from i18n key `landing.header.brand.ai`
- Also in `src/components/landing/Header.tsx` (older nav, same three-span pattern)
- **To rebrand logo to "Future AI": change i18n key `landing.header.brand.marketing` to empty string or space, update aria-label**

### Navigation Architecture

- **SimpleHeader.tsx** (`src/components/landing/SimpleHeader.tsx`) — Active on all marketing/landing routes
  - Nav items: Features, Pricing (both i18n-driven from `landing.header.nav.*`)
  - CTA buttons: Login → `https://app.future-marketing.ai/login`, Try Demo → `/demo`
  - Language switcher: GB/NL/ES flag icons
- **FloatingNav.tsx** (`src/components/common/FloatingNav.tsx`) — Active on demo/app routes
  - Nav items: Home, Explorer, Dashboard, Calculator, Ad Builder
- **Header.tsx** (`src/components/landing/Header.tsx`) — Older full marketing nav (less used)

### Page Architecture

- **Marketing routes** (get `SimpleHeader` + `LandingFooter`): `/`, `/features`, `/pricing`, `/how-it-works`, `/about`, `/contact`, and all placeholder pages, `/skinclarity-pitch`
- **Demo/app routes** (get `FloatingNav` + `Footer`): `/demo`, `/explorer`, `/dashboard`, `/calculator`, `/ad-builder`
- To add a new marketing page: create page component, add lazy import in `App.tsx`, add path to `marketingPaths` array in `App.tsx`

### Landing Page Hero (`/`)

- File: `src/components/landing/Hero.tsx` (NOT `src/pages/Hero.tsx` — that's the demo page)
- Current headline: "Turn content into growth." + "On autopilot."
- Current CTA: "Try Interactive Demo" → `/demo`, "Join Waitlist"
- Background: `NeuralNetwork` SVG + `HolographicGrid` + `FloatingParticles` + `GradientOrbs`

### Demo Hero (`/demo`)

- File: `src/pages/Hero.tsx`
- A/B tested headlines (6 variants) — all via i18n key `hero:headline_variants.*`
- Current variants include: "10x Output, Same Team Size", "Scale Content Without Scaling Costs", "Team of 3, Output of 30", "Autonomous Marketing That Scales With You", "Marketing That Runs Itself", "The Future is Autonomous"
- Primary CTA: "Explore Platform →" → `/explorer`
- Stats displayed: 360h/month saved, 160 posts/month, 247% engagement

### Existing Branding Occurrences ("FutureMarketingAI" as visible text)

| File                                          | Line              | Text                                               | Action                |
| --------------------------------------------- | ----------------- | -------------------------------------------------- | --------------------- |
| `src/components/ai-assistant/MessageList.tsx` | 312               | `✨ Welkom bij FutureMarketingAI!`                 | Update to "Future AI" |
| `public/locales/en/hero.json`                 | ~117              | `"discover how FutureMarketingAI can automate..."` | Update in JSON        |
| `public/locales/en/common.json`               | ~521              | `"...experience FutureMarketingAI on desktop..."`  | Update in JSON        |
| `index.html`                                  | 9, 14, 19, 25, 26 | Meta tags                                          | Update all            |
| `src/components/landing/Header.tsx`           | 397               | `aria-label="FutureMarketingAI home"`              | Update aria-label     |
| `public/locales/en/landing.json`              | brand keys        | `header.brand.*`                                   | Rebrand               |

### Reusable Components for New Service Pages

Located in `src/components/common/` — import from `src/components/common/index.ts`:

- `<GlassCard variant="default|strong|subtle" hover glow>` — glassmorphism card
- `<Button variant="primary|secondary|outline|ghost|cta" size="sm|md|lg|xl" glow>` — styled button
- `<StrategicCTA variant="inline|floating|exit-intent" title description primaryText>` — high-conversion CTA
- `<FAQSection />` — accordion FAQ with schema.org markup
- `<ValueStackingSection variant="compact|full|summary" showSavings>` — value prop module
- `<TrustBadges />` — GDPR/ISO/SOC2/SSL badges
- `<PricingAvailabilityBanner />` — slot availability
- `<AnimatedMetric />` — animated number counter
- `<Modal />` — accessible dialog
- `<Toast />` — notification system

Located in `src/components/seo/`:

- `<SEOHead title description keywords canonical>` — react-helmet meta
- `<StructuredDataPresets.webpage|organization|product>` — JSON-LD schema
- `<PricingTable showUrgency highlightTier>` — 4-tier pricing grid
- `<FAQSection additionalFAQs initialVisible includeSchema>` — SEO FAQ

Located in `src/components/landing/`:

- `<SimpleHeader />` — fixed floating header (use on ALL new marketing pages)
- `<FeaturesSection compact>` — 6-module feature grid
- `<SocialProof />` — social proof section

### Standard New Marketing Page Recipe

```tsx
// src/pages/AutomationsPage.tsx
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { SEOHead } from '../components/seo/SEOHead'
import { GlassCard } from '../components/common/GlassCard'
import { Button } from '../components/common/Button'
import { StrategicCTA } from '../components/common/StrategicCTA'
import { motion } from 'framer-motion'

export function AutomationsPage() {
  return (
    <>
      <SimpleHeader />
      <SEOHead title="..." description="..." keywords="..." canonical="..." />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
        {/* Hero section: pt-32 pb-16 px-6, max-w-4xl mx-auto text-center */}
        {/* Content sections: py-16 px-6, max-w-6xl mx-auto */}
        {/* Cards: bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 */}
        {/* Motion: whileInView={{ opacity:1, y:0 }} initial={{ opacity:0, y:30 }} viewport={{ once:true }} */}
        {/* Final CTA: bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12 */}
      </div>
    </>
  )
}
```

### Adding Route in App.tsx

```tsx
// 1. Add lazy import at top with other marketing page imports:
const AutomationsPage = lazy(() =>
  import('./pages/AutomationsPage').then((m) => ({ default: m.AutomationsPage }))
)

// 2. Add to marketingPaths array (so LandingFooter renders):
const marketingPaths = [...existingPaths, '/automations']

// 3. Add Route inside Routes:
;<Route path="/automations" element={<AutomationsPage />} />
```

---

## PHASE 1: Website Rebrand — "Future AI" Positioning

**Goal:** Update brand from "FutureMarketingAI" to "Future AI" across all touchpoints. Keep the domain. Expand the positioning from marketing-only to full AI implementation partner.

**Key insight:** Most text is i18n-driven. Edit JSON files in `public/locales/en/`, not TSX components.

---

### Task 1.1: Update index.html Meta Tags

**Files:**

- Modify: `index.html` (lines 9, 12-14, 18-21, 24-26, 29)

**Exact changes:**

```html
<!-- LINE 9: Change title -->
<title>Future AI — AI Systems That Run Your Business</title>

<!-- LINE 12: Change description -->
<meta
  name="description"
  content="Future AI builds AI automation systems for SaaS and e-commerce companies. Marketing automation, custom workflows, chatbots, and voice agents — we implement AI that delivers measurable results."
/>

<!-- LINE 14: Change author -->
<meta name="author" content="Future AI" />

<!-- LINE 19: Change og:site_name -->
<meta property="og:site_name" content="Future AI" />

<!-- LINE 20: Keep og:locale en_US -->

<!-- LINE 25: Change twitter:site -->
<meta name="twitter:site" content="@FutureAI" />

<!-- LINE 26: Change twitter:creator -->
<meta name="twitter:creator" content="@FutureAI" />

<!-- LINE 29: Change canonical -->
<meta name="canonical" content="https://future-marketing.ai/" />

<!-- ADD after existing OG tags: -->
<meta property="og:title" content="Future AI — AI Implementation Partner" />
<meta
  property="og:description"
  content="We build AI systems that run your business. Marketing, automations, chatbots, voice agents — all under one roof."
/>
```

**Step 1:** Open `index.html`, make all changes above
**Step 2:** Verify with `npm run dev` — check browser tab title
**Step 3:** Commit: `git commit -m "feat: update meta tags for Future AI rebrand"`

---

### Task 1.2: Update i18n Brand Keys (Landing Page Logo)

**Files:**

- Modify: `public/locales/en/landing.json` — find `header.brand.*` keys
- Modify: `public/locales/nl/landing.json` — same keys
- Modify: `public/locales/es/landing.json` — same keys

**Find and update these keys:**

```json
{
  "header": {
    "brand": {
      "future": "Future",
      "marketing": "",
      "ai": "AI"
    },
    "logo_aria": "Future AI Home"
  }
}
```

Setting `marketing` to empty string makes the logo read "Future AI" (the gradient span disappears).

**Also update in all locale files:**

```json
{
  "header": {
    "login": "Login",
    "try_demo": "See Our Work",
    "nav": {
      "features": "Services",
      "pricing": "Pricing"
    }
  }
}
```

**Step 1:** Read `public/locales/en/landing.json` to find exact structure
**Step 2:** Update en, nl, es landing.json files
**Step 3:** Commit: `git commit -m "feat: rebrand logo to Future AI in all locales"`

---

### Task 1.3: Update Hero i18n Copy (Landing Page Hero)

**Files:**

- Modify: `public/locales/en/hero.json` — update exit intent and any FutureMarketingAI references
- Modify: `src/components/landing/Hero.tsx` — update headline, subheadline, CTA text

**Changes in `public/locales/en/hero.json`:**

```json
{
  "exit_intent": {
    "description": "Book a free 30-minute consultation and discover how Future AI can transform your operations."
  }
}
```

**Changes in `src/components/landing/Hero.tsx`:**
Find current hardcoded or i18n-driven headline and update:

- Headline: `"AI Systems That Run Your Business"`
- Subheadline: `"We implement AI that actually works — marketing automation, custom workflows, chatbots, and voice agents for SaaS and e-commerce companies."`
- Primary CTA: `"See What We Build"` → links to `/automations`
- Secondary CTA: `"Book a Strategy Call"` → Calendly

Add trust anchor stat: _"Businesses working with AI partners are 2.5x more likely to succeed"_

**Step 1:** Read `src/components/landing/Hero.tsx` to find exact text locations
**Step 2:** Update headline/subheadline/CTA
**Step 3:** Update hero.json exit intent text
**Step 4:** Run `npm run dev`, verify at `localhost:5173`
**Step 5:** Commit: `git commit -m "feat: update landing hero to Future AI positioning"`

---

### Task 1.4: Update Remaining Brand References

**Files:**

- Modify: `src/components/ai-assistant/MessageList.tsx` line 312
- Modify: `public/locales/en/common.json` line ~521
- Modify: `src/components/landing/Header.tsx` line 397 (aria-label)
- Modify: `src/components/landing/SimpleHeader.tsx` line 195 (aria-label)

**Changes:**

```tsx
// MessageList.tsx line 312 — change:
`✨ Welkom bij FutureMarketingAI!`
// to:
`✨ Welcome to Future AI!`

// Header.tsx line 397 — change:
aria-label="FutureMarketingAI home"
// to:
aria-label="Future AI home"

// SimpleHeader.tsx line 195 — change:
aria-label="Future Marketing AI Home"
// to:
aria-label="Future AI Home"
```

**common.json update:**
Find the desktop-notice string referencing FutureMarketingAI and replace with "Future AI".

**Step 1:** Make all 4 changes
**Step 2:** Commit: `git commit -m "feat: update remaining brand references to Future AI"`

---

### Task 1.5: Update SimpleHeader Navigation

**File:** `src/components/landing/SimpleHeader.tsx`

**Current nav:** Features, Pricing | Login, Try Demo
**New nav:** Services (dropdown), Pricing | Login, Book a Call

**Add "Services" dropdown with links to:**

- `/automations` — AI Automations
- `/chatbots` — AI Chatbots
- `/voice-agents` — AI Voice Agents
- `/demo` — AI Marketing Machine (demo)

**Change CTA button:** "Try Demo" → "Book a Free Call" (link to Calendly URL already in codebase)

**Step 1:** Read `SimpleHeader.tsx` fully to understand dropdown implementation pattern
**Step 2:** Add Services dropdown (look at `Header.tsx` for dropdown pattern to reuse)
**Step 3:** Update CTA button text + link
**Step 4:** Update nav i18n keys in `public/locales/en/landing.json`
**Step 5:** Run `npm run dev`, verify nav works
**Step 6:** Commit: `git commit -m "feat: update navigation for Future AI services"`

---

## PHASE 2: Service Pages

**Goal:** Build 3 new marketing service pages using the established page pattern. These are conversion pages targeting the validated ICP.

**Page template to follow:** `src/pages/FeaturesPage.tsx` or `src/pages/AboutPage.tsx` (NOT Calculator.tsx)

---

### Task 2.1: AI Automations Service Page (`/automations`)

**Files:**

- Create: `src/pages/AutomationsPage.tsx`
- Modify: `src/App.tsx` — add lazy import, add to marketingPaths, add Route

**Page sections:**

```
1. SimpleHeader
2. SEOHead (title: "AI Workflow Automation Services | Future AI")
3. Hero section (pt-32 pb-16 px-6, max-w-4xl text-center):
   - Badge pill: "⚡ Delivered in 1-2 Weeks"
   - h1: "Automate Your Business With AI"
   - p: "We build custom AI workflows that eliminate manual work — lead routing, CRM enrichment, email sequences, and more. Powered by n8n, Make, and custom integrations."
   - CTA primary: "Get a Free Automation Audit" (Calendly)
   - CTA secondary: "See Examples" (scroll anchor)

4. Pain Points (3-column GlassCard grid):
   - ⏱ "Your team spends hours on work AI can do in minutes"
   - 🔗 "Your tools don't talk to each other — data gets lost between apps"
   - 📈 "Scaling means hiring more people, not working smarter"

5. What We Automate (icon grid, 6 items):
   - Lead qualification & CRM enrichment
   - Email sequences & follow-ups
   - Social media scheduling & content
   - Invoice & billing workflows
   - Customer onboarding flows
   - Data sync between platforms

6. Process (3 steps, GlassCard):
   - Step 1: Free Audit (we map your manual processes, 30 min)
   - Step 2: Build (1-2 weeks delivery, fully documented)
   - Step 3: Optimize (ongoing retainer optional)

7. Pricing (3 GlassCards, bg-white/5 border border-white/10 rounded-xl):
   - Starter: "€1.000 – €2.500" — 1-3 workflows, documentation, 7-day delivery
   - Growth: "€2.500 – €5.000" — 5-10 workflows, testing, priority support
   - Retainer: "€2.000 – €5.000/mo" — ongoing builds, optimization, dedicated support
   - Each card: feature list + CTA button (variant="primary" or "outline")

8. Trust bar: [metric] "15-30 hrs/week saved" | "1-2 weeks delivery" | "2.5x success rate with AI partner"

9. FAQSection (3-5 questions about AI automations)

10. Final CTA section:
    - bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-12
    - "Book a Free 30-min Automation Audit"
    - Subtext: "We'll map your manual processes and tell you exactly what AI can automate."
    - Button: "Book Free Audit" (Calendly)
```

**Motion pattern (use on every section):**

```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
```

**Step 1:** Read `src/pages/FeaturesPage.tsx` for exact import patterns
**Step 2:** Create `src/pages/AutomationsPage.tsx` following recipe above
**Step 3:** Add to `App.tsx` (lazy import + marketingPaths + Route)
**Step 4:** Run `npm run dev`, visit `localhost:5173/automations`
**Step 5:** Commit: `git commit -m "feat: add AI Automations service page"`

---

### Task 2.2: AI Chatbots Service Page (`/chatbots`)

**Files:**

- Create: `src/pages/ChatbotsPage.tsx`
- Modify: `src/App.tsx`

**Page sections (same pattern as Task 2.1):**

```
1. SimpleHeader
2. SEOHead (title: "AI Chatbot Development Services | Future AI")
3. Hero:
   - Badge: "🤖 24/7 Lead Qualification"
   - h1: "AI Chatbots That Never Sleep"
   - p: "Custom AI chatbots that answer questions, qualify leads, and book calls — while you sleep. Integrated with your CRM, calendar, and support tools."
   - CTA: "See a Live Demo" (link to /demo) | "Get a Free Strategy Session" (Calendly)

4. Use Cases (4 GlassCards):
   - Customer service (handle 70% of inquiries automatically)
   - Lead qualification (score and route leads 24/7)
   - Appointment booking (fill your calendar without manual back-and-forth)
   - FAQ automation (consistent answers, always available)

5. How We Build It (3 steps):
   - Discovery: map your use case and integrate with existing tools
   - Build: custom LLM-powered bot, trained on your data
   - Optimize: ongoing improvement based on conversation data

6. Pricing (3 cards):
   - Basic: "€1.500" — FAQ chatbot, 1 platform, trained on your content
   - Standard: "€2.500 – €3.500" — multi-intent, CRM integration, analytics
   - Custom: "€5.000+" — full enterprise chatbot, custom workflows, analytics dashboard
   - Maintenance retainer: "from €500/mo"

7. Trust metrics: "70% of inquiries handled automatically" | "24/7 availability" | "CRM integrated"

8. FAQSection

9. Final CTA: "Get a Free Chatbot Strategy Session"
```

**Step 1:** Reuse AutomationsPage as template
**Step 2:** Create `src/pages/ChatbotsPage.tsx`
**Step 3:** Add to App.tsx
**Step 4:** Verify + commit: `git commit -m "feat: add AI Chatbots service page"`

---

### Task 2.3: AI Voice Agents Service Page (`/voice-agents`)

**Files:**

- Create: `src/pages/VoiceAgentsPage.tsx`
- Modify: `src/App.tsx`

**Page sections:**

```
1. Hero:
   - Badge: "📞 AI That Handles Your Calls"
   - h1: "AI Voice Agents for Lead Qualification & Booking"
   - p: "AI voice agents that call prospects, qualify leads, and book appointments — at scale, without a sales team."
   - CTA: "Book a Demo Call" (Calendly)

2. Use Cases (4 cards):
   - Outbound lead qualification (call and qualify 100s of leads/day)
   - Appointment setting (fill calendars automatically)
   - Inbound customer service (handle routine calls 24/7)
   - Post-sale follow-up (automated check-ins and renewals)

3. Pricing:
   - Basic: "€1.000 – €2.000" — single-purpose voice agent, 1 workflow
   - Standard: "€2.000 – €5.000" — multi-purpose, CRM integration, analytics
   - Ongoing: "from €500/mo" — hosting, monitoring, optimization

4. Partnership note: "Built in collaboration with a specialized voice AI partner"

5. FAQSection

6. Final CTA: "Book a Voice Agent Demo"
```

**Step 1:** Reuse page template
**Step 2:** Create + add to App.tsx
**Step 3:** Verify + commit: `git commit -m "feat: add AI Voice Agents service page"`

---

## PHASE 3: Upwork & Fiverr Setup (Operational — No Code)

**Goal:** Launch on both platforms with specialist positioning. Target first 5-10 reviews within 30-60 days.

---

### Task 3.1: Upwork Profile Setup

**Profile Headline:**

```
AI Automation Expert | Custom Workflows, Chatbots & Marketing Systems for SaaS & E-commerce
```

**Profile Description:**

```
Your team is spending hours on work that should run automatically.

I build AI automation systems that eliminate manual processes — lead routing, CRM enrichment, email sequences, customer onboarding, data sync, and more. Using n8n, Make, Zapier, OpenAI API, and Claude API.

What I deliver:
✓ AI Workflow Automation — eliminate manual bottlenecks
✓ AI Chatbots — qualify leads and handle support 24/7
✓ AI Marketing Systems — autonomous content and ad management
✓ Custom AI Integrations — connect any stack

Typical results: 15-30 hours/week saved, 70% of support automated, faster sales cycles.

Send me a message with your biggest manual bottleneck — I'll tell you in 24 hours if and how AI can fix it.
```

**Pricing phases:**

- Launch (first 60 days): $65-$85/hr to build reviews
- After 10 reviews: $100-$150/hr
- After 25 reviews: $150-$200+/hr

**Proposal strategy:** 3-5 per day, reference specific job details, offer 2-3 price-point options.

---

### Task 3.2: Fiverr Gigs (4 Separate Gigs)

**Gig 1: AI Workflow Automation**

- Title: "I Will Automate Your Business Workflows Using Make, n8n or Zapier"
- Basic €100 (1 workflow, 3 steps, 5 days) | Standard €250 (3 workflows, docs, 7 days) | Premium €600 (5 workflows + docs + 30-day support, 14 days)
- Tags: workflow automation, n8n, Make, Zapier, business process automation, AI automation

**Gig 2: AI Chatbot**

- Title: "I Will Build a Custom AI Chatbot for Lead Generation or Customer Support"
- Basic €150 (FAQ bot, 1 platform) | Standard €350 (multi-intent + CRM) | Premium €750 (advanced + analytics + support)
- Tags: AI chatbot, customer service bot, ChatGPT integration, lead generation chatbot

**Gig 3: AI Lead Generation System**

- Title: "I Will Build an AI-Powered Lead Generation and Sales Automation System"
- Basic €150 (scraping + enrichment) | Standard €400 (full pipeline + outreach) | Premium €900 (full system + CRM + analytics)
- Tags: AI lead generation, sales automation, B2B automation, lead scoring

**Gig 4: AI Marketing Automation**

- Title: "I Will Set Up an AI Marketing Automation System for Your Business"
- Basic €200 (email automation) | Standard €500 (content + email system) | Premium €1.200 (full marketing stack)
- Tags: AI marketing, marketing automation, content automation, social media AI

**For each gig:**

- Record 60-90 second screen recording showing a real system you build
- Use "new seller boost" pricing, raise after 5 reviews
- Add FAQ addressing: "How long does delivery take?", "Do I need technical knowledge?", "What platforms do you integrate with?"

---

## PHASE 4: Cold Email Campaign Setup (Operational — No Code)

---

### Task 4.1: First Campaign ICP

**Segment:** SaaS companies, 20-100 employees, US/UK, recently funded (last 6 months) OR active hiring in sales/operations

**Data sources:**

- Apollo.io: industry=SaaS, employees=20-100, location=US+UK, last_funding_date=last_6_months
- LinkedIn Sales Navigator: same filters
- Crunchbase: Series A/B rounds in last 6 months

**Target titles:** Founder, CEO, COO, Head of Operations, VP Sales
**Batch size:** Start with 200-300, validate before scaling

---

### Task 4.2: Email Sequence (4 emails, 14 days)

**Email 1 — Day 3 (Pain + Signal):**

```
Subject: [Company] — quick question about your ops stack

Hi [Name],

Congrats on [recent hire/funding/product launch].

Most SaaS teams at your stage are spending 10-15 hours/week on manual processes AI can handle automatically — lead routing, CRM enrichment, onboarding sequences.

We recently helped a similar SaaS team cut their manual ops work by 70% in 2 weeks using n8n.

Worth a 15-min call to see if this applies to [Company]?

[Name]
Future AI | future-marketing.ai
```

**Email 2 — Day 7 (Social Proof):**

```
Subject: How [Similar Company] saved 15 hrs/week

Hi [Name],

Following up on my last note — sharing a quick result in case it's useful.

[2-3 sentences: specific company type, specific workflow automated, specific time/money saved]

Happy to do a free 30-min audit of your current ops stack. No obligation.

[Name]
```

**Email 3 — Day 10 (Value Add):**

```
Subject: The 5 automation wins most SaaS teams miss

Hi [Name],

One pattern I see constantly: SaaS teams lose 30-40% of their efficiency to disconnected tools with no automation layer between them.

Here are the 5 highest-ROI automations for teams at your stage:
1. Lead enrichment → CRM auto-population
2. Trial signup → automated onboarding sequence
3. Support ticket → AI triage + routing
4. Invoice → payment follow-up sequence
5. Meeting notes → CRM + task creation

Worth a call to see which of these apply to [Company]?

[Name]
```

**Email 4 — Day 14 (Final):**

```
Subject: Last note — [Company]

Hi [Name],

Didn't want to keep following up if timing isn't right. If manual ops aren't a priority right now — totally understood.

If they are, I'm happy to hop on a 15-min call this week.

[Name]
```

---

### Task 4.3: Multi-Channel Sequence

| Day | Channel  | Action                                    |
| --- | -------- | ----------------------------------------- |
| 1   | LinkedIn | Connection request + brief personal note  |
| 3   | Email    | Email 1 (pain + signal)                   |
| 5   | LinkedIn | Follow-up message with relevant insight   |
| 7   | Email    | Email 2 (social proof)                    |
| 10  | Email    | Email 3 (5 automation wins)               |
| 12  | LinkedIn | Graceful "did my emails reach you?" touch |
| 14  | Email    | Email 4 (final ask)                       |

**Send timing:** 4-5 PM recipient's local time (71% better open rates)

**Scale criteria:** Only scale beyond 300 contacts when: open rate >25%, reply rate >5%, positive reply ratio >30%

---

## PHASE 5: Voice Agent Partnership

**Goal:** Structure collaboration with friend's voice agent business for zero-risk revenue.

**Recommended model:** Start with referral (Option A) — you refer clients, friend delivers, you earn 20-30%.

**Steps:**

1. Define referral fee in writing (simple 1-page agreement)
2. Build `/voice-agents` page (Task 2.3)
3. When leads book call mentioning voice → refer + earn fee
4. After 2-3 deals: upgrade to white-label model (you sell, friend builds, 40-50% margin)

---

## PHASE 6: SkinClarity Club as Live Case Study

**Goal:** Use your own marketing machine output as proof of concept for potential clients.

**Output to track:**

- IG carousels: 2-3/week via automation
- Ad creatives: via ad builder
- Email sequences: welcome + abandoned cart

**Document as case study:**

- "Our own skincare brand — from X to Y orders using the same system we build for clients"
- Add to `/about` or new `/case-studies` page once data exists

---

## PHASE 7: Language Expansion (Roadmap)

| Priority | Language   | When        | Market          | Avg Deal |
| -------- | ---------- | ----------- | --------------- | -------- |
| 1        | English    | Now         | $60B+ (US/UK)   | $50-100K |
| 2        | German     | Month 4-5   | $19-38B (DACH)  | €40-60K  |
| 3        | Spanish    | Month 6-7   | $14-35B (LATAM) | €16-28K  |
| 4        | French     | Month 8-9   | $11-30B         | €35-50K  |
| 5        | Portuguese | Month 10-11 | $6-8B (Brazil)  | €12-20K  |
| 6        | Arabic     | Month 12+   | $4-7B (GCC)     | €50-80K  |

**Implementation:** The i18n system already supports multiple locales. Adding German requires:

1. Create `public/locales/de/` with translated JSON files
2. Add `de` to language switcher in `SimpleHeader.tsx`
3. Add German domain or subdomain (de.future-marketing.ai)

---

## Revenue Timeline Projection

| Period    | Channel                              | Expected Revenue      |
| --------- | ------------------------------------ | --------------------- |
| Month 1   | Fiverr/Upwork (first projects)       | €2.000-€5.000         |
| Month 2   | Freelance + first cold email replies | €5.000-€8.000         |
| Month 3   | First retainer clients               | €8.000-€12.000        |
| Month 4-6 | 3-5 retainer clients + project work  | €15.000-€25.000       |
| Month 6+  | Marketing Machine clients arriving   | €15.000+/client/month |

**Retainer sweet spot:** 3-5 clients at €3.000-€5.000/month = **€9.000-€25.000 recurring base**

---

## This Week's Execution Priority

| Day   | Task                                                 | Phase   |
| ----- | ---------------------------------------------------- | ------- |
| Day 1 | Update `index.html` meta tags                        | Phase 1 |
| Day 1 | Update i18n brand keys → logo reads "Future AI"      | Phase 1 |
| Day 2 | Update landing hero copy + exit intent JSON          | Phase 1 |
| Day 2 | Update remaining brand references (4 files)          | Phase 1 |
| Day 3 | Update SimpleHeader navigation (Services dropdown)   | Phase 1 |
| Day 3 | Build `/automations` service page                    | Phase 2 |
| Day 4 | Build `/chatbots` service page                       | Phase 2 |
| Day 4 | Build `/voice-agents` service page                   | Phase 2 |
| Day 5 | Fiverr gigs live (4 gigs) + Upwork profile           | Phase 3 |
| Day 6 | Cold email ICP list (200-300 contacts via Apollo.io) | Phase 4 |
| Day 7 | First cold email batch + LinkedIn outreach starts    | Phase 4 |
