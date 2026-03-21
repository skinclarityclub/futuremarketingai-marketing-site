# Roadmap: FMai AaaS Pivot

## Overview

Transform FutureMarketingAI from a generic AI automation agency into an Agent as a Service (AaaS) platform for marketing agencies. This is a brownfield rebrand across three production codebases (website, dashboard, n8n) -- 60-70% of the product already exists. The roadmap delivers a launchable AaaS product with founding member revenue by executing parallel work streams: website rebrand and GTM outreach start immediately, compliance runs independently, while dashboard and n8n follow a dependency chain.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

**Parallel Execution:**

- **Wave A (immediate):** Phase 1, Phase 4, Phase 5 -- no dependencies, run simultaneously
- **Wave B (after Phase 1):** Phase 2 -- needs website positioning settled
- **Wave C (after Phase 2):** Phase 3 -- needs dashboard data model

- [x] **Phase 1: Website Rebrand** - All website copy, pages, and SEO reframed for agency AaaS positioning
- [ ] **Phase 2: Dashboard Reframe** - Dashboard UI relabeled and agency data model with billing implemented
- [ ] **Phase 3: n8n Multi-Tenant** - Existing workflows parameterized for per-client isolation and metering
- [x] **Phase 4: Compliance** - AI-disclosure, legal documents, and privacy policies for EU AI Act readiness
- [ ] **Phase 5: Go-to-Market** - Founding member outreach, demo assets, and first 3-5 signed agencies
- [ ] **Phase 6: Vite Feature Parity** - Port all interactive demos, missing UI sections, and enhanced language switcher from Vite to Next.js
- [ ] **Phase 7: Website Copy Overhaul** - Introduce Clyde as named AI marketing employee with task-result storytelling across all pages
- [x] **Phase 8: Clyde Chatbot Personality** - Unified Clyde persona replacing 6 personas, context-aware welcome messages, all 17 tools on every page (completed 2026-03-21)

## Phase Details

### Phase 1: Website Rebrand

**Goal**: Agency owners visiting the website immediately understand FMai offers an AI Marketing Employee for their agency, can explore skills, see pricing, and sign up as founding members
**Depends on**: Nothing (first phase, Wave A)
**Requirements**: WEB-01, WEB-02, WEB-03, WEB-04, WEB-05, WEB-06, WEB-07, WEB-08, WEB-09, WEB-10, WEB-11, WEB-12, WEB-13, WEB-14, WEB-15
**Success Criteria** (what must be TRUE):

1. Homepage hero communicates "AI Marketing Employee for agencies" and all body copy targets agency owners, not generic businesses (EN/NL/ES)
2. Navigation shows Skills dropdown with 6 skill pages (/skills/content-creator, /skills/voice-agent, etc.) replacing old service pages
3. Pricing page displays 4 agent tiers with skill add-ons and a founding member CTA links to dedicated landing page with 10-spot scarcity
4. All supporting pages (About, How-it-works, FAQ) reflect AaaS positioning with agency-relevant trust badges, stats, and social proof
5. SEO metadata (titles, descriptions, JSON-LD, sitemap) targets "AI marketing employee agencies" keywords in all 3 languages
   **Plans**: 5 plans

Plans:

- [x] 01-01-PLAN.md — Core copy rebrand: all 3 locale files + SEO config (Wave 1)
- [x] 01-02-PLAN.md — Navigation restructure + skill routes + redirects + sitemap (Wave 1)
- [x] 01-03-PLAN.md — Pricing page redesign + homepage updates + chatbot personas (Wave 2)
- [x] 01-04-PLAN.md — Gap closure: missing locale namespaces for skill/founding-member pages + how-it-works fix (Wave 3)
- [x] 01-05-PLAN.md — Gap closure: chatbot persona engines rewritten for agency use cases (Wave 3)

### Phase 2: Dashboard Reframe

**Goal**: Agency owners can log into the dashboard, see their AI Employee status, create client workspaces, activate skills per client, and manage their subscription
**Depends on**: Phase 1 (positioning language settled)
**Requirements**: DASH-01, DASH-02, DASH-03, DASH-04, DASH-05, DASH-06, DASH-07, DASH-08
**Success Criteria** (what must be TRUE):

1. Sidebar and overview use "AI Employee" language (Agent Activity, Tasks, Skills) and old route URLs redirect to new ones
2. Agency data model exists in Supabase (fma_agencies table, agency-to-clients hierarchy) with RLS policies
3. Agency owner can create client workspaces and toggle skills on/off per workspace from the dashboard
4. Stripe billing is connected: agency subscribes to a base agent tier and can add/remove skill add-ons that update their invoice
5. New agency owner completes onboarding wizard (signup, first client creation, first skill activation) in a guided flow
   **Plans**: 4 plans

Plans:

- [ ] 02-01-PLAN.md — Agency data model migration + skills config + sidebar relabel + route redirects (Wave 1)
- [ ] 02-02-PLAN.md — Stripe billing integration: tier config, checkout, webhook, billing page (Wave 2)
- [ ] 02-03-PLAN.md — Dashboard overview + client workspace management + skill toggles (Wave 2)
- [ ] 02-04-PLAN.md — Agency onboarding wizard + visual verification checkpoint (Wave 3)

### Phase 3: n8n Multi-Tenant

**Goal**: Existing n8n workflows run isolated per client with correct brand context, and usage is metered and reported back to the dashboard
**Depends on**: Phase 2 (agency data model and client workspaces must exist)
**Requirements**: N8N-01, N8N-02, N8N-03, N8N-04, N8N-05, N8N-06, N8N-07, N8N-08
**Success Criteria** (what must be TRUE):

1. Init Config workflow loads per-client brand voice, social accounts, and API keys from Supabase agency data model
2. R&P Pipeline and Posting Pipeline execute per-client with isolated content schedules and social accounts (no cross-client data leakage)
3. New client setup workflow auto-configures all active skill workflows when an agency creates a new client workspace
4. Usage metrics (execution counts, content items, voice minutes) are logged to Supabase per client and visible in dashboard
5. Analytics collectors (Daily Intel, Weekly Performance) run per-client and error notifications route to the correct agency owner
   **Plans**: TBD

**Plans**: 3 plans

Plans:

- [ ] 03-01-PLAN.md — Usage metrics table + Content Posting Pipeline parameterization (Wave 1)
- [ ] 03-02-PLAN.md — Analytics workflows multi-client + error notification routing (Wave 1)
- [ ] 03-03-PLAN.md — Usage Metering + Agency Client Setup workflows + verification (Wave 2)

### Phase 4: Compliance

**Goal**: FMai meets EU AI Act transparency obligations and has legal documents ready for agency client contracts
**Depends on**: Nothing (independent, Wave A)
**Requirements**: COMP-01, COMP-02, COMP-03, COMP-04, COMP-05, COMP-06
**Success Criteria** (what must be TRUE):

1. Website chatbot widget displays "Ik ben een AI-assistent" disclosure and voice agent greeting identifies itself as AI
2. DPA (Verwerkersovereenkomst) template is drafted and ready to send to agency clients
3. DPIA document exists covering AI agent data processing risks and mitigations
4. Terms of service and privacy policy are updated with AaaS-specific clauses, liability limits, and agent data processing descriptions
   **Plans**: 2 plans

Plans:

- [x] 04-01-PLAN.md — AI disclosure in chatbot widget + voice agent documentation (Wave 1)
- [x] 04-02-PLAN.md — DPA, DPIA legal documents + legal page ToS/privacy expansion (Wave 1)

### Phase 5: Go-to-Market

**Goal**: First 3-5 founding member agencies are signed at EUR 997/mo with 6-month commitments
**Depends on**: Nothing (starts immediately, Wave A -- pre-selling while building)
**Requirements**: GTM-01, GTM-02, GTM-03, GTM-04, GTM-05
**Success Criteria** (what must be TRUE):

1. LinkedIn profile communicates "AI Marketing Employee for agencies" positioning with AaaS-focused headline and banner
2. Demo video (under 5 min) shows agent skills in action and is published/shareable
3. 50 target agencies (30 NL, 20 UK) are identified and documented matching ICP criteria
4. Outreach sequence is executing (LinkedIn engagement, DMs, calls) with tracking
5. 3-5 agencies have signed founding member agreements (EUR 997/mo, 6-month commitment)
   **Plans**: 3 plans

Plans:

- [x] 05-01-PLAN.md — LinkedIn profile assets + demo video script + content calendar (Wave 1)
- [x] 05-02-PLAN.md — ICP checklist + target tracking CSV + outreach templates + founding member agreement (Wave 1)
- [ ] 05-03-PLAN.md — Demo call script + launch checklist + GTM execution kickoff (Wave 2)

### Phase 6: Vite Feature Parity

**Goal**: All 4 service pages (chatbots, voice agents, marketing machine, automations) have full interactive demo and UI section parity with the original Vite website, and the language switcher is enhanced with flags and analytics
**Depends on**: Phase 1 (website rebrand must be complete)
**Requirements**: WEB-01, WEB-03
**Success Criteria** (what must be TRUE):

1. Language switcher shows flag emojis, full language names, animated checkmark, and fires gtag analytics event
2. Chatbots page has 4-persona DemoPlayground, MultiPlatformShowcase, ProgressiveCTA, pricing tiers, and trust metrics
3. Voice agents page has interactive VoiceDemoSection with phone mockup, VoiceDemoFAB, pricing tiers, trust metrics, and enhanced partnership card
4. Marketing machine page has VisionTimeline, FeatureShowcase with visual hierarchy, SocialProof, ProductMedia, and pricing tiers
5. Automations page has icon-enhanced automation grid, trust metrics, ProductMedia, and pricing tiers
   **Plans**: 4 plans

Plans:

- [ ] 06-01-PLAN.md — Language switcher enhancement + shared reusable components (TrustMetrics, PricingTiers, SocialProof, ProductMedia) (Wave 1)
- [ ] 06-02-PLAN.md — Chatbots page: DemoPlayground 4th persona + MultiPlatformShowcase + ProgressiveCTA + pricing/trust (Wave 2)
- [ ] 06-03-PLAN.md — Voice agents page: VoiceDemoSection + VoiceDemoFAB + useElevenLabsCall + pricing/trust (Wave 2)
- [ ] 06-04-PLAN.md — Marketing machine + automations pages: VisionTimeline + FeatureShowcase + pricing/trust/icons (Wave 2)

### Phase 7: Website Copy Overhaul - AI Employee Messaging and Skill Page Storytelling

**Goal**: All website copy (homepage + 8 skill pages) introduces Clyde as a named AI marketing employee with task-result storytelling, premium authority tone, and native-quality EN/NL/ES copy
**Depends on**: Phase 6 (Vite feature parity must be complete)
**Requirements**: WEB-01
**Success Criteria** (what must be TRUE):

1. All 8 skill pages use translation keys for every visible string (no hardcoded English)
2. Homepage hero introduces Clyde by name with wow-first messaging hierarchy
3. Every skill page has a task-demo section showing an example command to Clyde and his response
4. Header navigation descriptions reference Clyde's capabilities
5. Dutch and Spanish copy are native-quality rewrites (not translations) with "Clyde" consistent across all languages
   **Plans**: 4 plans

Plans:

- [x] 07-01-PLAN.md — Translation architecture fix: convert chatbot/email to t() keys + extract hardcoded props from 4 other pages (Wave 1)
- [ ] 07-02-PLAN.md — Homepage + header English copy rewrite with Clyde messaging (Wave 2)
- [ ] 07-03-PLAN.md — All 8 skill pages English copy rewrite + task-demo sections (Wave 2)
- [ ] 07-04-PLAN.md — Native Dutch and Spanish rewrites of all Clyde messaging (Wave 3)

### Phase 8: Clyde Chatbot Personality - Unified Persona and Context-Aware Messaging

**Goal:** The floating chatbot widget becomes Clyde — one unified persona replacing 6 separate personas, with context-aware welcome messages, confident expert tone, and all 17 tools available on every page
**Depends on:** Phase 7 (Clyde messaging must be in place)
**Requirements**: WEB-01

**Success Criteria** (what must be TRUE):

1. All 6 persona files (flagship, concierge, demo-guide, ecommerce, leadgen, support) are replaced by a single unified Clyde persona
2. Chat header shows "Clyde" with subtitle "AI Marketing Employee" (EU AI Act disclosure)
3. Welcome message adapts per page context (12 different pages mapped)
4. Suggested prompts adapt per page context
5. Clyde has access to all 17 tools on every page and selects the right one based on context
6. Clyde's tone is confident expert + ultra-concise (max 2 sentences + tool output)
7. Default persona in chatbot store is 'clyde' instead of 'concierge'

**Plans:** 2/2 plans complete

Plans:

- [x] 08-01-PLAN.md — Unified Clyde persona + persona index rewrite + store default + prompt-builder context (Wave 1)
- [ ] 08-02-PLAN.md — ChatWidgetIsland context-aware messages/prompts + ChatHeader Clyde branding + engine tool-filtering removal (Wave 2)

## Progress

**Execution Order:**
Phases execute in parallel waves:

- Wave A: Phase 1 + Phase 4 + Phase 5 (simultaneous)
- Wave B: Phase 2 (after Phase 1 positioning settled)
- Wave C: Phase 3 (after Phase 2 data model complete)

| Phase                | Plans Complete | Status      | Completed  |
| -------------------- | -------------- | ----------- | ---------- |
| 1. Website Rebrand   | 5/5            | Complete    | 2026-03-20 |
| 2. Dashboard Reframe | 3/4            | In Progress |            |
| 3. n8n Multi-Tenant  | 0/3            | Not started | -          |
| 4. Compliance        | 2/2            | Complete    | 2026-03-20 |
| 5. Go-to-Market      | 2/3            | In progress | -          |
| 6. Vite Feature Par. | 3/4            | In Progress |            |
| 7. Copy Overhaul     | 3/4            | In Progress |            |
| 8. Clyde Chatbot     | 2/2            | Complete    | 2026-03-21 |
