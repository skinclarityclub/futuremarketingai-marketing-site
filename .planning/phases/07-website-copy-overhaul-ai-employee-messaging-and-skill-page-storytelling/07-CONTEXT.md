# Phase 7: Website Copy Overhaul — AI Employee Messaging and Skill Page Storytelling - Context

**Gathered:** 2026-03-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Rewrite all website copy (homepage + 8 skill pages) to clearly communicate that FMai's product is "Clyde" — a 24/7 AI marketing employee that agencies can give tasks to, get reports from, and that continuously learns. Copy must be native-quality in EN, NL, and ES (not direct translations). CTAs updated site-wide.

</domain>

<decisions>
## Implementation Decisions

### Core Messaging Strategy

- The AI employee is named **Clyde** — "FutureMarketingAI presents Clyde"
- Clyde is positioned as a **real colleague**, not a tool or platform
- Agencies interact with Clyde via **chat (ad-hoc tasks) AND dashboard (configuration/monitoring)**
- Emotional hook: **wow/ontzag** — visitors should feel amazed at what's possible
- Messaging hierarchy on every page: **wow first** (what Clyde can do) → **human comparison** (unlike a human, Clyde works 24/7, never gets sick, learns continuously) → **results** (hard numbers and proof)
- Research-backed: outcome-focused messaging converts best, but human comparison makes it tangible and memorable. Combine both. (Sources: appvizer.com, cortes.design, almcorp.com)

### Skill Page Storytelling

- Every skill page shows an **"opdracht → resultaat" (task → result) flow** — a concrete example of giving Clyde a task and seeing the output
- Each skill gets its own example command, e.g.:
  - Content Creator: "Write 5 blog posts about local SEO for Bakkerij De Groot"
  - Voice Agent: "Call all yesterday's leads and book follow-up appointments"
  - Lead Qualifier: "Score all website visitors from the last 24 hours using BANT"
  - Chatbot: "Deploy a support chatbot on client X's website trained on their FAQ"
  - Social Media: "Create and schedule next week's posts for all 3 client accounts"
  - Ad Creator: "Generate 5 Meta ad variations for the spring campaign"
  - Email: "Send a follow-up sequence to all demo no-shows from this week"
  - Reporting: "Generate a weekly performance report for all active clients"
- These examples make the "real colleague" positioning tangible

### Tone of Voice

- **Premium & authority** — high-end positioning matching the EUR 997+/mo price point
- Confident, not salesy. Authoritative, not arrogant
- No "possibly" or "can help with" — Clyde DOES it
- Short, powerful sentences. No fluff

### CTA Strategy

- Primary CTA: **"Meet Clyde"** → routes to interactive demo/kennismaking
- Secondary CTA: **"Book a Strategy Call"** → Calendly booking
- Research-backed: multiple CTAs per page for different buyer stages convert better. Personalized CTAs outperform default by 202%. (Source: howdygo.com, unbounce.com)
- Every skill page ends with a clear CTA section

### Multilingual Approach

- **Native-quality copy per language** — not translations but rewrites
- English is the primary language (crafted first)
- Dutch (NL) and Spanish (ES) are **herschreven** (rewritten) to sound natural in that language
- "Clyde" stays "Clyde" in all languages — only surrounding copy adapts
- No directe vertalingen — those sound robotic and unprofessional

### Branding

- Product name: **Clyde** by FutureMarketingAI
- Clyde has a personality: professional, capable, always-on
- The name "Clyde" appears on the site, in the chatbot widget, and in marketing materials
- Lindy.ai uses the same pattern (company IS the AI) — FMai goes one step further by giving the AI its own distinct name

### Claude's Discretion

- Exact wording of each skill page's example command
- How to visually present the task → result flow (chat bubble mockup, terminal-style, or card-based)
- Specific trust badges and social proof placement
- FAQ content per skill page
- Exact metrics/numbers in trust sections (should be realistic/aspirational)

</decisions>

<code_context>

## Existing Code Insights

### Reusable Assets

- `DemoPlayground` component: Interactive chat demo — could be repurposed to show Clyde responding to example tasks
- `MultiPlatformShowcase`: Architecture diagram — update copy to reference Clyde
- `PricingTiers`, `TrustMetrics`, `SocialProof`, `ProductMedia`: Shared components already on skill pages
- `FloatingLocaleSwitcher`: Language switching works — copy changes need to update all 3 locale files
- `GlassCard`, `SectionHeading`, `CTAButton`, `ScrollReveal`: UI building blocks

### Established Patterns

- Skill pages use translation keys from `messages/{locale}.json` — some pages (chatbot, email) have hardcoded strings that need to be converted to translation keys first
- Hero sections follow badge → title → description → CTA pattern
- All skill pages are server components importing client components as needed

### Integration Points

- `fmai-nextjs/messages/en.json`, `nl.json`, `es.json` — all copy lives here for translated pages
- Skill page files in `fmai-nextjs/src/app/[locale]/(skills)/skills/*/page.tsx`
- Homepage: `fmai-nextjs/src/app/[locale]/page.tsx`
- Header: `fmai-nextjs/src/components/layout/HeaderClient.tsx` — SKILL_ITEMS descriptions need updating
- Chatbot widget persona: may need "Clyde" branding

</code_context>

<specifics>
## Specific Ideas

- "FutureMarketingAI presents Clyde" as the brand positioning
- Lindy.ai as competitive reference — they use "Meet your first AI employee" and "just tell them what you want"
- The 24/7 availability should be shown through the human comparison lens: "A marketer works 8 hours. Clyde works 24."
- Each skill page should feel like you're meeting a specialist side of Clyde, not a separate product
- The wow factor should come from the demo interactions — seeing Clyde "respond" to a task

</specifics>

<deferred>
## Deferred Ideas

- Clyde avatar/mascot design — visual identity for Clyde (design phase)
- Clyde chatbot personality — updating the actual chatbot widget to respond as "Clyde" (separate implementation phase)
- Video content showing Clyde in action — demo videos for each skill
- Client testimonials/case studies featuring Clyde results

</deferred>

---

_Phase: 07-website-copy-overhaul-ai-employee-messaging-and-skill-page-storytelling_
_Context gathered: 2026-03-20_
