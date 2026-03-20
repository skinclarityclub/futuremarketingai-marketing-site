# Architecture Research: AaaS Platform for Marketing Agencies

## Current Architecture (Three Connected Systems)

```
┌─────────────────────────────────────────────────────────┐
│                    WEBSITE (This Repo)                    │
│              Next.js 16 • Vercel • i18n                  │
│                                                          │
│  Marketing site → Founding member signup → Booking       │
│  Skill showcase → Pricing → Contact → Blog              │
└──────────────────────┬──────────────────────────────────┘
                       │ Links to dashboard login
┌──────────────────────▼──────────────────────────────────┐
│                   DASHBOARD (fma-app)                     │
│          Next.js 16 • Supabase Auth • 93 API routes      │
│                                                          │
│  Agent overview • Skills • Client workspaces             │
│  Ad builder • Analytics • Voice agents • Blog mgmt       │
│  Billing (Stripe) • Settings                             │
└──────────────────────┬──────────────────────────────────┘
                       │ Webhooks + shared Supabase DB
┌──────────────────────▼──────────────────────────────────┐
│                  n8n ENGINE (FMai)                        │
│       115 workflows • WAT Architecture • Cloud           │
│                                                          │
│  LAYER 1: Intelligence (R&P → Strategy → Content)        │
│  LAYER 2: Production (CarouselBuilder, Blog, Ads)        │
│  LAYER 3: Distribution (Posting Pipeline, Blotato)       │
│  LAYER 4: Analytics (Daily Intel, Weekly Performance)    │
│  + Voice (Vapi server) + Ad Creative (Kling/Remotion)    │
└─────────────────────────────────────────────────────────┘
```

## Data Flow

```
Agency signs up (website) → Auth (Supabase) → Dashboard
  → Creates client workspace
    → Dashboard writes to fma_clients table
    → n8n Init Config reads client config
    → n8n workflows execute per client (R&P, posting, voice, ads)
    → Results write to Supabase (content_schedule, posting_log, analytics)
    → Dashboard reads and displays results
    → Agency sees what their AI employee did
```

## Multi-Tenant Model

**Current (partially built):**

- `fma_clients` table exists with `account_keys[]` array
- n8n R&P Orchestrator has "Fetch Active Clients" → loop
- Init Config loads per-client pillars, brands, schedules from Supabase
- Row-Level Security (RLS) on Supabase tables

**Needs for AaaS:**

- New `fma_agencies` table (agency → owns multiple clients)
- Agency-level billing (Stripe subscription on agency, not client)
- Skill activation per client (which workflows run for this client)
- Usage metering per client (count in pipeline_runs)

## Build Order (Dependencies)

```
Phase 1: Website Rebrand (independent — can run in parallel)
├── Copy/messaging changes (i18n files)
├── Route restructuring (/services → /skills)
├── Pricing page rebuild
└── Founding member page

Phase 2: Dashboard Reframe (partially parallel with Phase 1)
├── UI label changes (independent)
├── Agency data model (depends on nothing)
├── Skill activation UI (depends on data model)
└── Stripe billing (depends on pricing decisions)

Phase 3: n8n Multi-tenant (depends on dashboard data model)
├── Parameterize existing workflows
├── Agency client setup workflow
├── Usage metering
└── Activate analytics collectors

Phase 4: Compliance (parallel with Phase 2-3)
├── AI-disclosure implementation
├── DPA template
├── DPIA document
└── Terms of service updates

Phase 5: Go-to-Market (depends on Phase 1 completion)
├── LinkedIn profile + content
├── Demo video
├── Founding member outreach
└── First 3-5 clients onboarded
```

## Component Boundaries

| Component  | Owns                                     | Talks To                                             |
| ---------- | ---------------------------------------- | ---------------------------------------------------- |
| Website    | Marketing, SEO, booking                  | Dashboard (links), Calendly (embeds)                 |
| Dashboard  | Auth, UI, client mgmt, billing           | Supabase (data), n8n (webhooks), Stripe (payments)   |
| n8n Engine | Workflow execution, content gen, posting | Supabase (read/write), Vapi (voice), external APIs   |
| Supabase   | Data, auth, storage                      | Dashboard (SDK), n8n (API), Website (edge functions) |
| Vapi       | Voice calls, transcripts                 | n8n (webhooks), Google Calendar                      |
| Stripe     | Billing, subscriptions                   | Dashboard (API)                                      |
