# FMai AaaS Pivot — Agent as a Service for Marketing Agencies

## What This Is

FutureMarketingAI (FMai) is being rebranded from an "AI automation agency for businesses" to an "Agent as a Service (AaaS) platform for marketing agencies." Instead of selling individual services (automations, chatbots, voice agents), we sell ONE persistent AI Marketing Employee per agency with pluggable skills — targeting performance/growth agency owners (3-12 employees) in NL and UK first.

## Core Value

Marketing agencies can scale from 10 to 50 clients without hiring by deploying an AI Marketing Employee that runs 24/7 with pluggable skills (content, voice, ads, social, reporting, lead qualification).

## Requirements

### Validated

<!-- Existing systems that already work and we're keeping -->

- ✓ Content generation pipeline (R&P: Research → Strategy → Content → Validate) — n8n production
- ✓ Social media posting (CarouselBuilder, StoryBuilder, Blotato scheduling) — n8n production
- ✓ Ad creative pipeline (Shopify → fal.ai/Kling → Orshot/Creatomate) — n8n production
- ✓ Blog pipeline with PubMed citations and AI validation — n8n production
- ✓ Voice agent infrastructure (Vapi webhook server, assistant CRUD, call logging) — n8n active
- ✓ Dashboard auth (Supabase email + Google/GitHub OAuth) — fma-app working
- ✓ Dashboard UI shell (20+ pages, 93 API routes, ad builder, analytics) — fma-app production MVP
- ✓ Website with i18n (EN/NL/ES), 11 pages, 59 components, SEO — Next.js 85-90% complete
- ✓ Multi-client data model (fma_clients table with account_keys[]) — Supabase partial

### Active

<!-- What we're building in this milestone -->

- [ ] Website rebrand: all copy targeting "marketing agencies" instead of "businesses"
- [ ] Website new pricing page with Agent tiers (Founding Member €997, Starter €1,497, Growth €1,997, Agency €3,497)
- [ ] Website founding member landing page
- [ ] Website skill pages replacing service pages (/skills/content-creator, /skills/voice-agent, etc.)
- [ ] Dashboard reframe: UI labels from SaaS to "AI Employee" language
- [ ] Dashboard agency onboarding wizard
- [ ] Dashboard skill activation toggles per client workspace
- [ ] Dashboard Stripe billing (base agent + skill add-ons)
- [ ] n8n multi-tenant parameterization (client brand/accounts injected into existing workflows)
- [ ] n8n agency client setup workflow (new client → auto-configure all skill workflows)
- [ ] n8n usage metering per client (execution counts, voice minutes, content items)
- [ ] n8n activate analytics collectors (Daily Intel, Weekly Performance)
- [ ] Compliance: AI-disclosure in chatbot/voice, DPA template, DPIA document
- [ ] Go-to-market: LinkedIn profile, demo video, founding member outreach

### Out of Scope

- Building custom platform on OpenClaw — enterprise readiness 1.2/5, alpha stage, used as narrative only
- LATAM market launch — defer to Year 2, pricing mismatch
- Mobile app — web-first
- Self-serve onboarding — manual founding member onboarding first
- Full marketplace for skills — simple toggle UI first
- Healthcare/dental vertical-specific compliance (HIPAA) — v2 after product-market fit
- Real-time multi-agent orchestration (CrewAI) — n8n workflows sufficient for v1

## Context

### What Exists (Brownfield)

**Three codebases being rebranded:**

1. **Website** (`fmai-nextjs/`): Next.js 16, Tailwind 4, next-intl (EN/NL/ES), Living System design (teal #00D4AA / amber #F5A623), 11 pages, 59 components, interactive chatbot demo with Claude API, comprehensive SEO (JSON-LD, sitemap, hreflang). Currently targets "SaaS and e-commerce companies" — needs agency-focused copy.

2. **Dashboard** (`C:\Users\daley\Desktop\fma-app`): Next.js 16, Supabase auth + PostgreSQL, 93 API routes, Recharts, Framer Motion. Features: ad builder (Kling/HeyGen/Remotion/Creatify), Meta Ads dashboard, Shopify integration, AI Copilot (anomaly detection, chat), voice agents section, content pipeline with n8n sync, blog management with SEO scoring. Auth works; most features use real data from n8n/Supabase.

3. **n8n Automations** (`C:\Users\daley\Desktop\FMai`): 115 workflows on n8n Cloud (skinclarityclub.app.n8n.cloud). WAT architecture (4-layer: Intelligence → Production → Distribution → Analytics). Active production workflows: R&P content pipeline, CarouselBuilder v5, Content Posting Pipeline v2, Ad Creative (static + video DPA), Blog Orchestrator. Voice: Vapi webhook server active. Multi-client loop exists in R&P Orchestrator. ~60-70% of AaaS "skills" already built.

### Market Research (19 agents, 100+ sources)

- AI agents market: $7.8B → $52.6B by 2030 (46% CAGR)
- Jensen Huang (NVIDIA GTC 2026): "Every SaaS becomes GaaS"
- NL: 28,153 agencies, 95% have AI programs but only 5% extract value
- Zero AI agent platforms targeting Dutch marketing agencies
- Generic AI agency market saturated (15K+ agencies globally)
- Agency owners (3-12 employees) make buying decisions in 3-14 days
- EUR 997/mo = "serious evaluation" zone (1-2 weeks decision)
- Performance agencies: highest budget (EUR 3-5K/mo tool spend), data-driven buyers
- EU AI Act: marketing agents = limited risk, transparency obligation by Aug 2026

### ICP (Ideal Customer Profile)

- **Type**: Performance/growth agency (paid ads, SEO, lead gen)
- **Size**: 3-12 employees, EUR 500K-1.5M revenue
- **Decision maker**: Founder/CEO personally
- **Psychographic**: Growth-hungry, time-starved, hiring-averse
- **Trigger**: Turning down work due to capacity constraints
- **Geography**: NL first, UK simultaneously, ES month 3-6

### Positioning

- One-liner: "De eerste AI marketing medewerker voor bureaus"
- Competitive frame: "GoHighLevel geeft je tools. Wij geven je een medewerker die de tools voor je gebruikt."
- Dutch: "Digitale collega" framing (softer than "AI employee")
- NVIDIA narrative: "Powered by enterprise AI, GDPR-first"

## Constraints

- **Solo founder**: Everything must be achievable by one person — parallel execution via agents
- **Zero revenue**: Pre-selling and founding members critical for runway
- **Existing codebases**: Must rebrand, not rebuild — leverage 60-70% existing work
- **Three repos**: Website (this repo), Dashboard (fma-app), n8n (FMai) — changes span all three
- **Compliance deadline**: EU AI Act transparency obligation by 2 August 2026
- **Time pressure**: OpenClaw/GaaS narrative window = 3-6 months before commoditization
- **Stack locked**: Next.js 16, Supabase, n8n, Vapi, Tailwind 4 — no migrations
- **i18n exists**: EN/NL/ES translation files already built — update content, not infrastructure

## Key Decisions

| Decision                                     | Rationale                                                                                | Outcome   |
| -------------------------------------------- | ---------------------------------------------------------------------------------------- | --------- |
| AaaS over SaaS                               | Generic AI agency market saturated (15K+); agent-first positioning differentiated        | — Pending |
| n8n as brain, NOT OpenClaw                   | OpenClaw enterprise readiness 1.2/5, alpha, banned by Big Tech; n8n is production-proven | — Pending |
| OpenClaw as narrative only                   | NVIDIA hype creates credibility; "Powered by NemoClaw" as trust badge, not foundation    | — Pending |
| NL + UK first                                | NL: zero competition, home market, 28K agencies; UK: good budgets, English content ready | — Pending |
| Performance agencies as primary ICP          | Highest budget, data-driven buyers, fastest ROI proof, 3-14 day sales cycle              | — Pending |
| Founding member model (10 spots, EUR 997/mo) | Validates demand before scaling; creates case studies; 50% discount creates urgency      | — Pending |
| Rebrand over rebuild                         | 60-70% of product exists; reframing UI labels + copy is faster than starting fresh       | — Pending |
| Horizontal product, vertical sales           | Product works for any agency; sales targets performance agencies first                   | — Pending |
| Hetzner EU hosting for GDPR                  | EUR 40-80/mo, Amsterdam region, GDPR-compliant by default                                | — Pending |

---

_Last updated: 2026-03-20 after AaaS pivot design approval_
