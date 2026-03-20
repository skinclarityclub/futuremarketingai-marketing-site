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
- [ ] 01-04-PLAN.md — Gap closure: missing locale namespaces for skill/founding-member pages + how-it-works fix (Wave 3)
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
   **Plans**: TBD

Plans:

- [ ] 02-01: TBD
- [ ] 02-02: TBD
- [ ] 02-03: TBD

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

Plans:

- [ ] 03-01: TBD
- [ ] 03-02: TBD
- [ ] 03-03: TBD

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
   **Plans**: TBD

Plans:

- [ ] 05-01: TBD
- [ ] 05-02: TBD

## Progress

**Execution Order:**
Phases execute in parallel waves:

- Wave A: Phase 1 + Phase 4 + Phase 5 (simultaneous)
- Wave B: Phase 2 (after Phase 1 positioning settled)
- Wave C: Phase 3 (after Phase 2 data model complete)

| Phase                | Plans Complete | Status      | Completed  |
| -------------------- | -------------- | ----------- | ---------- |
| 1. Website Rebrand   | 5/5            | Complete    | 2026-03-20 |
| 2. Dashboard Reframe | 0/3            | Not started | -          |
| 3. n8n Multi-Tenant  | 0/3            | Not started | -          |
| 4. Compliance        | 2/2            | Complete    | 2026-03-20 |
| 5. Go-to-Market      | 0/2            | Not started | -          |
