---
title: FMai AaaS Pivot — Complete Design Document
tags:
  - strategy
  - aaas
  - pivot
  - design
created: 2026-03-20
source: Claude Code research synthesis (19 parallel agents, 100+ sources)
---

# FMai AaaS Pivot — Complete Design Document

## Executive Summary

FutureMarketingAI pivots from "AI automation agency for businesses" to "Agent as a Service (AaaS) for marketing agencies." Instead of selling individual services (automations, chatbots, voice agents), we sell ONE persistent AI Marketing Employee per agency with pluggable skills.

**One-liner:** "De eerste AI marketing medewerker voor bureaus. Draait 24/7. Leert je klanten kennen. Wordt elke week beter."

**Competitive frame:** "GoHighLevel geeft je tools. Wij geven je een medewerker die de tools voor je gebruikt."

---

## 1. What We Sell

### The Product: AI Marketing Employee

One persistent AI employee per agency that runs 24/7. Skills (capabilities) are plugins that agencies activate based on their needs.

**Positioning language by context:**
- Sales conversations: "AI Medewerker" (anchors against salary: EUR 2K/mo vs EUR 60K/yr junior)
- Brand identity: "Marketing Machine"
- Thought leadership: "GaaS" (Jensen Huang, NVIDIA GTC 2026)
- Dutch market: "Digitale collega" (softer than "AI employee", European sensitivity)

### Skills (Pluggable Capabilities)

| Skill | What It Does | n8n Workflows Available |
|-------|-------------|------------------------|
| Content Creator | Blog posts, social content, email newsletters | R&P Pipeline, Blog Pipeline, Content Factory (PRODUCTION) |
| Social Media Manager | Multi-platform scheduling, engagement, analytics | Posting Pipeline, CarouselBuilder, StoryBuilder (PRODUCTION) |
| Lead Qualifier | Website chatbot, lead scoring, CRM routing | Chatbot workflows, Lead Management (BUILT) |
| Voice Agent | Inbound/outbound calls, appointment booking | Vapi server, Assistant CRUD, Call logging (ACTIVE) |
| Ad Creator | AI-generated static/video ads, Meta publishing | Kling, Remotion, HeyGen, Creatify pipelines (PRODUCTION) |
| Reporting & Analytics | Cross-platform dashboards, weekly reports, anomaly detection | Daily Analytics, Weekly Performance, AI Copilot (BUILT) |

### What Already Exists vs What Must Be Built

| Component | Status | Work Needed |
|-----------|--------|-------------|
| Content generation (R&P) | PRODUCTION | Add multi-tenant client params |
| Social posting (Blotato) | PRODUCTION | Parameterize for agency clients |
| Ad creative pipeline | PRODUCTION | Add agency client context |
| Blog pipeline with citations | PRODUCTION | Parameterize, add agency branding |
| Voice agent (Vapi) | ACTIVE | Expand tool server, add booking |
| Analytics collection | BUILT | Activate, add per-client filtering |
| Dashboard (fma-app) | PRODUCTION MVP | Reframe UI labels, add agency views |
| Website (Next.js) | 85-90% | Rebrand copy, update pricing page |
| i18n (EN/NL/ES) | IMPLEMENTED | Update translation files |
| Auth (Supabase) | WORKING | Keep as-is |
| Multi-client support | PARTIAL | fma_clients table exists, needs agency layer |
| Billing (Stripe) | SCAFFOLDED | Implement skill-based billing |

**Key insight: 60-70% of the AaaS product already exists. The pivot is more reframing than rebuilding.**

---

## 2. Ideal Customer Profile (ICP)

### Primary: Performance/Growth Agency Owner

| Parameter | Value |
|-----------|-------|
| Agency type | Performance marketing (paid ads, SEO, lead gen, CRO) |
| Team size | 3-12 employees |
| Revenue | EUR 500K-1.5M/year |
| Decision maker | Founder/CEO — sole buyer, no procurement |
| Age | 28-45 |
| Psychographic | Growth-hungry, time-starved, hiring-averse |
| Trigger | Turning down work due to capacity constraints |
| Tool spend | EUR 2,000-5,000/month |
| Sales cycle | 3-14 days |
| Why #1 | Highest budget (EUR 1.5-3.5K comfortable), data-driven buyer, fastest ROI proof |

### Secondary: Social Media/Content Agency Owner

| Parameter | Value |
|-----------|-------|
| Agency type | Content creation, social media management |
| Team size | 3-10 employees |
| Revenue | EUR 300K-1M/year |
| Price sensitivity | Higher — EUR 997/mo is their max |
| Why #2 | Largest market (40-50K agencies), highest AI fit for content, fastest decisions |

### Future Verticals (Month 3+)

- Healthcare/Dental agencies (compliance moat, appointment booking killer app)
- E-commerce/Shopify agencies (technical owners, massive automation surface)

### Anti-ICP (Do Not Target)

- Agencies > 30 employees (procurement layers, slow decisions)
- Creative/branding agencies (AI-skeptical, less repetitive work)
- SaaS/B2B demand gen (build in-house, long sales cycles)
- Agencies < EUR 300K revenue (cannot afford EUR 997+/mo)

---

## 3. Geographic Strategy

### Phase 1 (Month 1-3): Netherlands + UK

**Netherlands (Score 35/40 — BEST opportunity):**
- 28,153 marketing agencies
- 95% have AI programs, only 5% extract value — massive gap
- Zero dedicated AI agent platforms for Dutch agencies
- Home market: language, culture, network advantage
- GDPR-first = competitive moat vs US platforms
- Communities: DDMA, Emerce, Frankwatching, Adformatie, LinkedIn NL

**UK (simultaneous, English content):**
- 25-30K digital agencies
- Good budgets, less saturated than US
- English dashboard already built
- Same timezone range

### Phase 2 (Month 3-6): Spain

- 8-12K marketing agencies
- Almost zero competition for Spanish-language AI agents
- EU payments (clean Stripe flow)
- Consider lower pricing tier (EUR 497-797)
- ES translations already exist in website

### Phase 3 (Month 6-12): US (selective)

- 90K+ agencies but extremely competitive
- Enter with NL/UK case studies as social proof
- Target specific niches, not broad market

### Phase 4 (Year 2): LATAM (Mexico)

- Largest Spanish-speaking market
- Need localized pricing (lower tier)

---

## 4. Technical Architecture

### Current Architecture (What Exists)

```
Website (Next.js 16, Vercel)          Dashboard (Next.js 16, fma-app)
├── 11 pages, 59 components           ├── 20+ pages, 93 API routes
├── i18n: EN/NL/ES                     ├── Auth: Supabase (working)
├── Chatbot demo (Claude)             ├── Ad Builder (Kling, HeyGen, Remotion)
├── SEO: JSON-LD, sitemap             ├── Meta Ads dashboard
└── Living System design              ├── Shopify integration
                                       ├── AI Copilot
                                       ├── Voice Agents section
                                       ├── Content pipeline (n8n sync)
                                       └── Blog management

n8n (115 workflows, n8n Cloud + self-hosted)
├── R&P Content Pipeline (PRODUCTION)
│   ├── Orchestrator → Init → Research → Strategy → Content → Validate
│   └── Multi-client loop via "Fetch Active Clients"
├── Social Posting (PRODUCTION)
│   ├── CarouselBuilder v5 (Orshot)
│   ├── StoryBuilder, PostBuilder
│   └── Content Posting Pipeline v2 (Blotato)
├── Ad Creative (PRODUCTION)
│   ├── Shopify → fal.ai/Kling → Orshot/Creatomate → Supabase
│   └── Static + Video DPA pipelines
├── Blog Pipeline (PRODUCTION)
│   ├── Keyword → Research → PubMed → Write → Validate → Publish
├── Voice (ACTIVE)
│   ├── Vapi webhook server
│   ├── Assistant CRUD manager
│   └── Call report processor
├── Analytics (BUILT, INACTIVE)
│   ├── Daily Instagram collector
│   ├── Weekly Performance Intelligence
│   └── Token Health Monitor
└── Legacy (various older workflows)

Database: Supabase PostgreSQL
├── fma_clients (multi-client with account_keys[])
├── fma_organizations + members (RBAC)
├── content_schedule, content_briefs
├── ad_creative_assets
├── voice agents tables
├── instagram_post_snapshots
├── blog_articles + versions
└── 30+ tables total
```

### Target Architecture (AaaS Reframe)

```
AGENCY LAYER (NEW — thin wrapper)
├── Agency onboarding wizard
├── Agency → Client workspace mapping
├── Skill activation per client
├── Usage metering per client
└── Billing: base agent + skill add-ons (Stripe)

EXISTING SYSTEMS (REFRAMED)
├── Dashboard → "AI Employee Command Center"
│   ├── /dashboard → Agent overview + health
│   ├── /pipeline → Agent activity feed
│   ├── /calendar → Agent content schedule
│   ├── /ad-builder → Ad Creator skill
│   ├── /analytics → Performance reporting skill
│   ├── /voice-agents → Voice Agent skill (already exists!)
│   └── /clients → Client workspace management (exists!)
│
├── n8n → "Agent Skills Engine"
│   ├── R&P Pipeline → Content Creator skill
│   ├── Posting Pipeline → Social Media Manager skill
│   ├── Ad Creative → Ad Creator skill
│   ├── Blog Pipeline → Blog Writer skill
│   ├── Vapi workflows → Voice Agent skill
│   └── Analytics → Reporting skill
│
└── Website → "Marketing + Founding Member Launch"
    ├── Homepage → Agency-focused messaging
    ├── /skills/* → Skill showcase pages
    ├── /pricing → Agent tier pricing
    ├── /founding-member → Exclusive launch page
    └── i18n → NL/EN/ES (already built)
```

### What Must Be Built (Net New)

1. **Agency layer in dashboard** (fma_agencies table, agency→client mapping)
2. **Skill activation UI** (toggle skills per client workspace)
3. **Usage metering** (track executions, voice minutes, content items per client)
4. **Stripe billing** (base agent + skill add-ons — scaffold exists)
5. **n8n multi-tenant params** (inject client brand/accounts into existing workflows)
6. **Website rebrand** (copy changes in i18n files, pricing page, new founding-member page)

### What Does NOT Need To Be Built

- Content generation (exists, production)
- Social media posting (exists, production)
- Ad creative pipeline (exists, production)
- Blog pipeline (exists, production)
- Voice agent infrastructure (exists, active)
- Analytics collection (exists, built)
- Dashboard UI (exists, production MVP)
- Auth system (exists, working)
- i18n (exists, EN/NL/ES)
- SEO infrastructure (exists, comprehensive)
- Chatbot demo (exists, interactive)

---

## 5. Pricing

### Agent Tiers

| Tier | Price/mo | Skills | Client Workspaces | Target |
|------|----------|--------|-------------------|--------|
| Founding Member | EUR 997 | All included | 5 | First 10 agencies |
| Starter | EUR 1,497 | 2 skills | 3 | Small agencies |
| Growth | EUR 1,997 | 5 skills | 10 | Growing agencies |
| Agency | EUR 3,497 | Unlimited | 25 | Established agencies |

### Skill Add-ons (for Starter/Growth tiers)

| Skill | Monthly Add-on |
|-------|---------------|
| Content Creator | EUR 197 |
| Social Media Manager | EUR 297 |
| Lead Qualifier (chatbot) | EUR 197 |
| Voice Agent (inbound) | EUR 297 + EUR 0.15/min |
| Voice Agent (outbound) | EUR 497 + EUR 0.20/min |
| Ad Creator | EUR 397 |
| Reporting & Analytics | EUR 197 |

### Founding Member Program

- 10 spots only
- EUR 997/mo (50% off future EUR 1,997 Growth tier)
- 6-month minimum commitment
- All skills included
- Direct founder access (Slack channel)
- Feature request priority
- Revenue at full capacity: EUR 9,970/mo

### Infrastructure Costs

| Component | 5 Clients | 10 Clients |
|-----------|-----------|------------|
| n8n Cloud | EUR 50-100 | EUR 50-100 |
| Supabase | EUR 25 | EUR 25-75 |
| LLM APIs (Claude, Perplexity) | EUR 50-200 | EUR 100-400 |
| Vapi (voice) | EUR 50-150 | EUR 100-300 |
| Orshot/Blotato | EUR 20-50 | EUR 40-100 |
| Hosting (Hetzner/Vercel) | EUR 40-80 | EUR 60-120 |
| **Total** | **EUR 235-580** | **EUR 375-995** |

**Per-client cost: EUR 50-100/mo → 90%+ margin at EUR 997/mo**

---

## 6. Go-to-Market Plan

### Week 1-2: Foundation + Pre-sell

**Rebrand actions:**
- Update website i18n files (EN/NL/ES) — agency-focused copy
- New pricing page (Agent tiers)
- Founding member landing page
- Update SEO metadata and JSON-LD
- LinkedIn profile optimization

**Pre-sell actions:**
- Identify 50 target agencies (NL: 30, UK: 20)
- Engage with LinkedIn content for 1-2 weeks
- Daily LinkedIn posts (building journey, behind-the-scenes)
- 1 killer demo video (under 5 min, show agent in action)
- DM warm leads: "Building AI marketing employee for agencies. 10 founding spots."

**Quick cash:**
- OpenClaw consulting on Fiverr/LinkedIn (EUR 500-2,000/setup)
- Leverage NVIDIA/GaaS narrative for credibility

### Week 2-5: Activate MVP

**Dashboard reframe:**
- Rename UI labels (automations → skills, campaigns → tasks)
- Add agency onboarding wizard
- Add skill activation toggles
- Connect Stripe for billing

**n8n activation:**
- Parameterize R&P pipeline for multi-client
- Activate analytics collectors
- Test voice agent end-to-end
- Create "agency client setup" workflow

### Week 5-7: Deploy to Founding Members

- Onboard 3-5 founding agencies
- Collect real usage data
- Video testimonials
- Iterate based on actual usage patterns

### Week 7-10: Public Launch

- Case studies from founding members
- LinkedIn content blitz
- UK market opening
- Full price activation (EUR 1,497-1,997/mo)

### Outreach Funnel Math

```
50 target agencies (NL+UK)
→ 30 engage with content (60%)
→ 15 respond to DM (50%)
→ 8 take a call (53%)
→ 3-5 become founding members (38-63%)
= EUR 2,991-4,985/mo revenue
```

---

## 7. Compliance & Legal

### EU AI Act (Limited Risk Classification)

- Marketing AI agents = limited risk (NOT high risk)
- Primary obligation: Transparency (Art. 50) — AI must disclose it is AI
- Deadline: 2 August 2026
- Fines: up to EUR 15M or 3% annual revenue
- Action: Implement AI-disclosure in all chatbots and voice agents

### AVG/GDPR

- DPIA required (AI is on AP high-risk list)
- Verwerkersovereenkomst (DPA) needed with every agency client
- EU data residency: Supabase EU region (Amsterdam) — compliant
- LLM providers: Both Anthropic and OpenAI offer EU data residency
- Right to erasure: Build delete mechanism for all client data
- Action: Draft DPA template, activate EU regions on all providers

### Telecom/Voice (Netherlands)

- From 1 July 2026: outbound calls require explicit opt-in only
- AI voice agents must identify as AI at start of call
- Bel-me-niet register check required
- All telemarketing rules apply to AI systems

### Practical Compliance Checklist (Before First Client)

1. Verwerkersovereenkomst (DPA) template — draft
2. DPIA execution — document
3. EU data residency on all providers — configure
4. AI-disclosure in chatbot/voice — implement
5. Algemene voorwaarden with liability limits — draft
6. Beroepsaansprakelijkheidsverzekering (BAV) — purchase
7. AI-generated content disclaimer — add to contracts
8. KvK registration verification — confirm

---

## 8. Rebrand Change Matrix

### Website (fmai-nextjs)

| Current | New | Files to Change |
|---------|-----|----------------|
| "AI Automation Agency That Runs Your Business" | "De eerste AI marketing medewerker voor bureaus" | messages/en.json, nl.json, es.json |
| Target: "SaaS and e-commerce companies" | Target: "marketing agencies" | All i18n files |
| /automations | /skills/content-creator | App router + i18n |
| /chatbots | /skills/lead-qualifier | App router + i18n |
| /voice-agents | /skills/voice-agent | App router + i18n |
| /marketing-machine | /agent | App router + i18n |
| /pricing (gateway tiers) | /pricing (agent tiers) | pricing/page.tsx + i18n |
| NEW | /founding-member | New page |
| Trust: "Enterprise Grade" | Trust: "Powered by NemoClaw, GDPR-first" | i18n files |
| Stats: "50+ Automations" | Stats: "X agencies, Y skills, 24/7" | i18n files |
| SEO: "AI marketing automation" | SEO: "AI marketing employee agencies" | seo-config.ts, metadata.ts |

### Dashboard (fma-app)

| Current | New | Effort |
|---------|-----|--------|
| "FMai Command Center" | "AI Employee Command Center" | UI labels |
| /pipeline | /agent-activity | Route rename |
| /campaigns | /tasks | Route rename |
| Generic client management | Agency → Client workspace hierarchy | Schema + UI |
| No billing | Stripe + skill add-ons | Implementation |
| No skill toggles | Skill activation per workspace | New UI component |
| No usage metering | Per-client execution tracking | New middleware |

### n8n Workflows

| Current | New | Effort |
|---------|-----|--------|
| Hardcoded brand context | Client-injected brand params | Parameterize Init Config |
| Single SkinClarity posting | Multi-agency client posting | Extend Posting Pipeline |
| No agency onboarding | "New client setup" workflow | New workflow |
| No usage tracking | Execution counter per client | Add logging nodes |

---

## 9. Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| No agencies buy founding membership | Medium | High | Fallback to individual service sales |
| OpenClaw hype fades before we leverage it | Medium | Low | OpenClaw is narrative, not foundation |
| n8n workflows break under multi-tenant load | Low | High | Test thoroughly, start with 3-5 clients |
| Competitor enters NL market | Low (6-12mo) | Medium | Speed of execution + Dutch language moat |
| LLM API costs spike | Low | Medium | Model switching (Claude ↔ Gemini ↔ open models) |
| GDPR compliance issue | Low | Very High | DPA + DPIA + EU hosting from day 1 |

---

## 10. Success Metrics

### Month 1-3

- 3-5 founding members = EUR 2,991-4,985/mo MRR
- Website rebrand complete
- 2+ skills activated per client
- NPS > 8 from founding members

### Month 3-6

- 10-15 total clients = EUR 10-25K/mo MRR
- 3+ video testimonials
- UK market generating inbound leads
- Voice agent skill in production

### Month 6-12

- 25-40 clients = EUR 40-80K/mo MRR
- Spain market launched
- 2nd vertical identified and entered
- Self-serve onboarding live

---

## Appendix: Research Sources

This design is based on 19 parallel research agents analyzing 100+ sources including:
- NVIDIA GTC 2026 announcements (NemoClaw, OpenClaw, GaaS)
- EU AI Act and AVG/GDPR requirements (Dutch implementation)
- Agency market data (NL: 28,153 agencies, UK: 25-30K, US: 90K+)
- Competitive landscape (GoHighLevel, Synthflow, Vapi, Voiceflow)
- Agency buyer behavior research
- 8 vertical analyses (Performance, Content, E-commerce, Healthcare, etc.)
- OpenClaw ecosystem assessment (250K stars, enterprise readiness 1.2/5)
- Pricing model analysis across AI agent platforms
