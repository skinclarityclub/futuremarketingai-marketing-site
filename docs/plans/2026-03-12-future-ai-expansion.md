# Future AI — Business Expansion Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform FutureMarketingAI into "Future AI" — a full-spectrum AI implementation partner — while generating short-term revenue through productized automation services within 1-2 months.

**Architecture:** One brand (Future AI) on the existing domain (future-marketing.ai), with the AI Marketing Machine as flagship and AI Automations as the primary gateway service. All services live under one roof via dedicated service pages. The holding entity (Estland/e-Residency) operates behind the scenes — the online presence can be built immediately without waiting for legal structure.

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
- Solo founders who split into multiple brands fragment marketing spend and reach no critical mass
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

1. English (now) → 2. German (month 4-5, highest ROI/deal) → 3. Spanish (month 6-7, volume) → 4. French (month 8-9) → 5. Portuguese (month 10-11, Brazil)

---

## PHASE 1: Website Rebrand — "Future AI" Positioning

**Goal:** Update homepage to position as "Future AI" — broader than marketing, encompassing all AI services. The domain stays, the brand narrative expands.

**Files to modify:**

- `src/pages/Hero.tsx` — hero copy, tagline, positioning
- `src/components/layer1-hero/` — hero section components
- `src/App.tsx` — document title / meta tags
- `public/index.html` — page title, meta description, OG tags

---

### Task 1.1: Update Document Title & Meta Tags

**Files:**

- Modify: `index.html`
- Modify: `src/App.tsx` (if dynamic title is set there)

**Step 1: Update index.html meta tags**

Change:

```html
<title>FutureMarketingAI</title> <meta name="description" content="..." />
```

To:

```html
<title>Future AI — AI Systems That Run Your Business</title>
<meta
  name="description"
  content="Future AI builds AI automation systems for SaaS and e-commerce companies. From marketing automation to custom workflows, chatbots, and voice agents — we implement AI that delivers measurable results."
/>
<meta property="og:title" content="Future AI — AI Implementation Partner" />
<meta
  property="og:description"
  content="We build AI systems that run your business. Marketing, automations, chatbots, voice agents — all under one roof."
/>
```

**Step 2: Verify in browser**
Open dev server (`npm run dev`) and check browser tab + view source.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: update meta tags for Future AI positioning"
```

---

### Task 1.2: Update Hero Section Copy

**Files:**

- Modify: `src/pages/Hero.tsx` (read first to find exact copy locations)
- Modify: relevant components in `src/components/layer1-hero/`

**Step 1: Read the current hero copy**
Use Read tool on `src/pages/Hero.tsx` to find all headline/subheadline/CTA text.

**Step 2: Replace positioning copy**

Current headline pattern (find and replace):

- Old: "AI Marketing Machine" / "FutureMarketingAI"
- New headline: **"AI Systems That Run Your Business"**
- New subheadline: **"We implement AI that actually works — marketing automation, custom workflows, chatbots, and voice agents for SaaS and e-commerce companies."**
- New CTA primary: **"See What We Build"** (links to /automations or /demo)
- New CTA secondary: **"Book a Strategy Call"** (Calendly)

**Step 3: Update trust/credibility copy**
Find the "2.5x" stat and add it as a trust anchor: _"Businesses working with AI partners are 2.5x more likely to succeed with AI"_

**Step 4: Run dev server and verify visually**

```bash
npm run dev
```

Check hero at localhost:5173

**Step 5: Commit**

```bash
git add src/pages/Hero.tsx src/components/layer1-hero/
git commit -m "feat: rebrand hero to Future AI positioning"
```

---

### Task 1.3: Update Navigation

**Files:**

- Modify: find navbar component via `grep -r "nav" src/components --include="*.tsx" -l`

**Step 1: Read navbar component**

**Step 2: Update nav links to include service pages**

```
Logo: "Future AI" (keep domain as-is)
Nav items:
- Services (dropdown: AI Automations, AI Marketing Machine, AI Chatbots, AI Voice Agents)
- How It Works
- Pricing
- Demo
- Book a Call (CTA button)
```

**Step 3: Update logo text from "FutureMarketingAI" to "Future AI"**

**Step 4: Commit**

```bash
git add src/components/
git commit -m "feat: update navigation for Future AI brand and service pages"
```

---

## PHASE 2: Service Pages

**Goal:** Build 2 new service pages — AI Automations (lead service) and a refreshed positioning for AI Marketing Machine. These are conversion pages, not demos.

**Files to create:**

- `src/pages/Automations.tsx` — AI Automations service page
- `src/pages/Chatbots.tsx` — AI Chatbots service page (upsell)
- Modify: `src/App.tsx` — add routes

---

### Task 2.1: AI Automations Service Page

**Files:**

- Create: `src/pages/Automations.tsx`
- Modify: `src/App.tsx` — add `/automations` route

**Page Structure:**

```
1. Hero: "Automate Your Business Operations With AI"
   - Subheadline: "We build custom AI workflows that eliminate manual work. Powered by n8n, Make, and custom integrations — delivered in 1-2 weeks."
   - CTA: "Get a Free Automation Audit"

2. Pain Points Section (3 cards):
   - "Your team spends hours on work AI can do in minutes"
   - "Tools don't talk to each other — data gets lost between apps"
   - "Scaling means hiring more people, not working smarter"

3. What We Automate (icon grid):
   - Lead qualification & CRM enrichment
   - Email sequences & follow-ups
   - Social media scheduling & content
   - Invoice & billing workflows
   - Customer onboarding flows
   - Data sync between platforms

4. Process Section:
   - Step 1: Free Audit (we map your manual processes)
   - Step 2: Build (1-2 weeks delivery)
   - Step 3: Optimize (ongoing retainer)

5. Pricing Cards:
   - Starter: €1.000-€2.500 (1-3 workflows)
   - Growth: €2.500-€5.000 (5-10 workflows + documentation)
   - Scale: €2.000-€5.000/mo retainer (ongoing builds + optimization)

6. CTA: "Book a Free 30-min Automation Audit" (Calendly)
```

**Step 1: Create the page component using existing UI patterns from the codebase**
Read one existing page (e.g., `src/pages/Calculator.tsx`) for component patterns.

**Step 2: Add route to App.tsx**

```tsx
<Route path="/automations" element={<Automations />} />
```

**Step 3: Verify page renders**

```bash
npm run dev
# Navigate to localhost:5173/automations
```

**Step 4: Commit**

```bash
git add src/pages/Automations.tsx src/App.tsx
git commit -m "feat: add AI Automations service page"
```

---

### Task 2.2: AI Chatbots Service Page

**Files:**

- Create: `src/pages/Chatbots.tsx`
- Modify: `src/App.tsx` — add `/chatbots` route

**Page Structure (same pattern as Automations):**

```
1. Hero: "AI Chatbots That Qualify Leads 24/7"
   - Subheadline: "Custom AI chatbots that answer questions, qualify leads, and book calls — while you sleep."
   - CTA: "See a Live Demo"

2. Use Cases: Customer service | Lead qualification | Appointment booking | FAQ automation

3. Pricing:
   - Basic: €1.500 (FAQ chatbot, 1 platform)
   - Standard: €2.500-€3.500 (multi-intent + CRM integration)
   - Custom: €5.000+ (full custom with analytics)
   - Maintenance: from €500/mo

4. CTA: "Get a Free Chatbot Strategy Session"
```

**Step 1-4:** Same pattern as Task 2.1.

---

## PHASE 3: Upwork & Fiverr Setup

**Goal:** Launch on both platforms with specialist positioning. Target first 5-10 reviews within 30-60 days.

**Note:** This phase is operational (no code) but must be tracked.

---

### Task 3.1: Upwork Profile

**Profile Headline:**

```
AI Automation Expert | Custom Workflows, Chatbots & Marketing Systems for SaaS & E-commerce
```

**Profile Description Structure:**

1. Open with client pain: "Your team is spending hours on work that should run automatically..."
2. Your methodology: n8n, Make, Zapier, OpenAI API, Claude API, custom integrations
3. Quantified outcomes: "Clients save 15-30 hours/week, reduce CAC by 40%, scale without headcount"
4. Services: AI Workflow Automation | AI Chatbots | AI Marketing Systems | Custom Integrations
5. CTA: "Send me a message with your biggest manual bottleneck — I'll tell you in 24 hours if and how AI can fix it."

**Pricing:**

- Launch phase: $65-$85/hr (build reviews)
- After 10 reviews: $100-$150/hr
- After 25 reviews: $150-$200+/hr

**Proposal strategy:** 3-5 per day, highly targeted, reference specific job details, offer 2-3 approach options at different price points.

---

### Task 3.2: Fiverr Gigs (4 Separate Gigs)

**Gig 1: AI Workflow Automation**

- Title: "I Will Automate Your Business Workflows Using Make, n8n or Zapier"
- Basic: €100 (1 workflow, 3 steps) | Standard: €250 (3 workflows) | Premium: €600 (5 workflows + documentation + 30-day support)
- Tags: workflow automation, n8n, Make, Zapier, business process automation

**Gig 2: AI Chatbot**

- Title: "I Will Build a Custom AI Chatbot for Lead Generation or Customer Support"
- Basic: €150 (FAQ bot, 1 platform) | Standard: €350 (multi-intent + CRM) | Premium: €750 (advanced + analytics)
- Tags: AI chatbot, customer service bot, ChatGPT integration, lead generation chatbot

**Gig 3: AI Lead Generation System**

- Title: "I Will Build an AI-Powered Lead Generation and Sales Automation System"
- Basic: €150 (scraping + enrichment) | Standard: €400 (full pipeline + outreach) | Premium: €900 (full system + CRM + analytics)
- Tags: AI lead generation, sales automation, B2B automation, lead scoring

**Gig 4: AI Marketing Automation**

- Title: "I Will Set Up an AI Marketing Automation System for Your Business"
- Basic: €200 (email automation setup) | Standard: €500 (full content + email system) | Premium: €1.200 (full marketing stack)
- Tags: AI marketing, marketing automation, content automation, social media AI

**For each gig:**

- Create a 60-90 second explainer video (screen recording showing the type of system you build)
- Use competitive "new seller" pricing first, raise after 5 reviews
- Add FAQ section addressing top objections

---

## PHASE 4: Cold Email Campaign Setup

**Goal:** Launch first cold email campaign via partner's warm infrastructure targeting the validated ICP.

---

### Task 4.1: Define First Campaign ICP

**Segment:** SaaS companies, 20-100 employees, US/UK, recently funded (Series A/B in last 6 months) OR active hiring in sales/operations roles.

**Data sources:**

- Apollo.io (filter: industry=SaaS, employees=20-100, location=US/UK, funding_date=last 6 months)
- LinkedIn Sales Navigator (same filters)
- Crunchbase (funding data)

**Target titles:** Founder, CEO, COO, Head of Operations, VP Sales

**First batch size:** 200-300 contacts

---

### Task 4.2: Write Email Sequence (SaaS Segment)

**Email 1 (Day 1) — Pain + Signal:**

```
Subject: [Company] — quick question about your ops stack

Hi [Name],

Congrats on [recent hire/funding/product launch — use specific signal].

Most SaaS teams at your stage I talk to are spending 10-15 hours/week on manual processes that AI can handle automatically — lead routing, CRM enrichment, onboarding sequences, that kind of thing.

We recently helped a similar SaaS reduce manual ops work by 70% in 2 weeks using n8n.

Worth a 15-min call to see if this applies to [Company]?

[Name]
Future AI
```

**Email 2 (Day 4) — Social Proof:**

```
Subject: How [Similar Company] saved 15 hrs/week

Hi [Name],

Sent a note a few days ago — sharing a quick case study in case it's useful.

[2-3 sentence case study with specific numbers]

Happy to do a free audit of your current ops stack — takes 30 mins, no obligation.

[Name]
```

**Email 3 (Day 7) — Value Add:**

```
Subject: Free resource for [Company]

Hi [Name],

One thing I see kill SaaS ops efficiency: disconnected tools with no automation layer between them.

Attached a quick checklist of the 5 automation wins most teams miss. No strings attached.

[Name]
```

**Email 4 (Day 10) — Direct Ask:**

```
Subject: Last note — [Company]

Hi [Name],

Didn't want to keep following up if timing isn't right. If you're not dealing with manual ops bottlenecks right now, totally understood.

If you are — 15 mins this week?

[Name]
```

**Timing rule:** Send at 4-5 PM recipient's local time (71% better response rate).

---

### Task 4.3: Multi-Channel Sequence

| Day | Channel  | Action                          |
| --- | -------- | ------------------------------- |
| 1   | LinkedIn | Connection request + brief note |
| 3   | Email    | Email 1 (pain + signal)         |
| 5   | LinkedIn | Follow-up with resource         |
| 7   | Email    | Email 2 (case study)            |
| 10  | Email    | Email 3 (value add)             |
| 12  | LinkedIn | Graceful touch                  |
| 14  | Email    | Email 4 (final ask)             |

**Success benchmarks to hit before scaling:**

- Open rate: >25%
- Reply rate: >5%
- Positive reply ratio: >30% of replies
- If not hitting these: adjust subject lines and pain point angle before scaling beyond 300 contacts

---

## PHASE 5: Voice Agent Partnership Integration

**Goal:** Structure the collaboration with friend's voice agent business into a revenue-sharing model.

---

### Task 5.1: Define Partnership Model

**Option A: Referral model**

- You refer clients needing voice agents → friend delivers
- You receive 20-30% referral fee per project

**Option B: White-label model**

- You sell voice agents under Future AI brand
- Friend builds and maintains
- You keep 40-50%, friend keeps 50-60%

**Option C: Joint landing page**

- Build `/voice-agents` page together
- Split leads, each handles own clients
- Shared brand credibility

**Recommended:** Start with Option A (zero risk, no new delivery work), upgrade to B as deals come in.

---

### Task 5.2: Add Voice Agents Page (Placeholder)

**Files:**

- Create: `src/pages/VoiceAgents.tsx`
- Modify: `src/App.tsx`

**Page content:** Position voice agents as a service, explain use cases, pricing range €1.000-€5.000, CTA = "Book a discovery call" (your Calendly). Deliver via partner, brand as Future AI.

---

## PHASE 6: SkinClarity Club Integration

**Goal:** Use your marketing machine to generate content for SkinClarity Club as a live case study — demonstrating the product's capabilities to future marketing machine clients.

---

### Task 6.1: Define Content Output for SkinClarity

- IG carousel automation: 2-3 carousels/week from product data
- Ad creative: use your ad builder to test creatives
- Email sequences: new customer welcome + abandoned cart
- Track metrics: ROAS, engagement, follower growth

**Use as:** Social proof on your website. "Our own skincare brand went from 0 to X orders in Y weeks using the same system we build for you."

---

## PHASE 7: Language Expansion (Future)

**Expansion order (research-validated):**

| Phase | Language   | When        | Market Size    | Avg Deal |
| ----- | ---------- | ----------- | -------------- | -------- |
| 1     | English    | Now         | $60B+          | $50-100K |
| 2     | German     | Month 4-5   | $19-38B        | €40-60K  |
| 3     | Spanish    | Month 6-7   | $14-35B        | €16-28K  |
| 4     | French     | Month 8-9   | $11-30B        | €35-50K  |
| 5     | Portuguese | Month 10-11 | $6-8B (Brazil) | €12-20K  |
| 6     | Arabic     | Month 12+   | $4-7B (GCC)    | €50-80K  |

---

## Revenue Timeline Projection

| Period    | Channel                              | Expected Revenue      |
| --------- | ------------------------------------ | --------------------- |
| Month 1   | Fiverr/Upwork (first projects)       | €2.000-€5.000         |
| Month 2   | Freelance + first cold email replies | €5.000-€8.000         |
| Month 3   | First retainer clients               | €8.000-€12.000        |
| Month 4-6 | 3-5 retainer clients + project work  | €15.000-€25.000       |
| Month 6+  | Marketing Machine clients arriving   | €15.000+/client/month |

**Retainer sweet spot:** 3-5 clients at €3.000-€5.000/month = **€9.000-€25.000 recurring base** before project work.

---

## Execution Priority (This Week)

1. **Day 1-2:** Phase 1 (website rebrand copy + meta tags)
2. **Day 3-4:** Phase 2 (Automations service page)
3. **Day 4-5:** Phase 3 (Fiverr gigs live + Upwork profile)
4. **Day 5-7:** Phase 4 (Cold email sequence written + first batch ready)
5. **Week 2:** Phase 5 (Voice agent partnership model defined)
6. **Ongoing:** Phase 6 (SkinClarity as live case study)
