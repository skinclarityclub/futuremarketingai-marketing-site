---
title: AI Agent Allocation & Multi-Tenancy — Competitive Intelligence
tags: #research #pricing #multi-tenancy #aaas #competitive-intel
created: 2026-03-26
source: Web research via WebSearch/WebFetch (11x.ai, Artisan, Relevance AI, AWS, Chargebee, n8n)
---

# AI Agent Allocation & Multi-Tenancy: Competitive Intelligence

Research conducted 2026-03-26 for FutureMarketingAI AaaS pivot.

---

## 1. Competitor Analysis

### 1A. 11x.ai — "Digital Workers" (Alice SDR, Julian Phone Agent)

| Dimension | Detail |
|-----------|--------|
| Agent model | **Dedicated digital worker per customer** — each customer gets "Alice" or "Julian" as their named AI employee |
| Pricing | ~$5,000/month (~$50,000-60,000/year) |
| Volume included | ~3,000 contacts/month, up to 5 emails per contact (15,000 emails) |
| Cost per contact | ~$1.67 per contact |
| Contract | **Annual commitment required**, users report inflexible opt-out |
| Architecture | Likely shared infrastructure with logical tenant isolation — the "dedicated worker" is a branding/UX concept, not separate compute |
| Multi-tenancy | Not publicly documented; the product is positioned as "your digital employee" but the underlying model almost certainly uses shared LLM inference with per-tenant context/data |

**Key insight**: 11x uses the "digital employee" metaphor heavily in branding. Each customer feels they have a dedicated worker, but technically it is contextual AaaS (shared agent with tenant-specific context, leads, and sequences).

Sources: [MarketBetter 11x Pricing 2026](https://marketbetter.ai/blog/11x-ai-pricing-2026/), [Vendr 11x Pricing](https://www.vendr.com/marketplace/11x), [Salesforge 11x Review](https://www.salesforge.ai/blog/11x-ai-review)

---

### 1B. Artisan.co — "Ava" AI BDR

| Dimension | Detail |
|-----------|--------|
| Agent model | **Named AI employee per customer** — "Ava" is your AI BDR |
| Pricing | Not publicly disclosed; annual contracts paid upfront |
| Tiers | Accelerate (12,000 leads/yr), Supercharge (35,000 leads/yr), Blitzscale (65,000+ leads/yr), Custom (enterprise) |
| Volume model | Priced by lead volume, not by agent count or seats |
| Features | All tiers include full multichannel outreach, inbox warmup, AI sequencing, analytics |
| Contract | **Annual, paid upfront**, no billing flexibility |
| Architecture | Shared infrastructure; Ava is a single product serving all customers with per-tenant lead data and sequences |

**Key insight**: Artisan's pricing is lead-volume-based, not per-agent or per-seat. Every customer gets the same "Ava" capabilities; differentiation is in volume caps and support level. The "digital employee" framing is pure positioning over shared multi-tenant infrastructure.

Sources: [Enginy/Genesy Artisan Pricing](https://www.enginy.ai/blog/artisan-pricing), [Artisan Pricing Page](https://www.artisan.co/pricing), [Oreate AI Artisan Analysis](https://www.oreateai.com/blog/demystifying-artisan-ai-sales-agent-pricing-what-you-need-to-know/bd0233556f0a615186f7ee8027e20153)

---

### 1C. Relevance AI — Agent Builder Platform

| Dimension | Detail |
|-----------|--------|
| Agent model | **Multi-agent platform** — customers build and deploy their own agents |
| Pricing | Hybrid: fixed plan fee + usage (Actions + Vendor Credits) |
| Credit system | Actions: $80 per 1,000 actions; Vendor Credits: $10 per 10,000 (pass-through LLM costs, no markup) |
| Free tier | 200 Actions/month + 1,000 Vendor Credits |
| Team structure | Pro/Team/Enterprise with varying seat counts (e.g., 5 build users + 45 end users on Team) |
| Multi-tenancy | Built-in: shared projects, RBAC, multi-region (Enterprise), SSO |
| Agent allocation | Customers create unlimited agents within their action/credit budget |

**Key insight**: Relevance AI is the most transparent on pricing and the most developer-friendly. Their split of Actions (what agents do) vs Vendor Credits (LLM costs at pass-through) is a clean model. Multi-tenancy is a first-class feature at Enterprise tier. This is the closest comparison to what FMai could build as an agency platform.

Sources: [Relevance AI Pricing](https://relevanceai.com/pricing), [Relevance AI Plans Docs](https://relevanceai.com/docs/get-started/subscriptions/plans), [Lindy Relevance AI Pricing Analysis](https://www.lindy.ai/blog/relevance-ai-pricing)

---

## 2. AI Agent Pricing Models — Industry Overview

### The 8 Dominant Models (2025-2026)

| Model | How it works | Best for | Example |
|-------|-------------|----------|---------|
| **Per-seat** | Traditional SaaS per-user fee | Lightweight copilots | Legacy SaaS (declining: 21% to 15% adoption) |
| **Per-agent** | Each AI agent priced like a digital employee | Autonomous workers with defined roles | 11x.ai (~$5K/mo per "worker") |
| **Usage-based** | Tokens, API calls, runtime minutes | Variable/unpredictable workloads | OpenAI AgentKit (pay per token) |
| **Per-workflow** | One run = one execution regardless of complexity | Automation platforms | n8n (execution-based billing) |
| **Per-action** | Each discrete step billed separately | Granular cost control | Make.com ($9/mo for 10K operations) |
| **Per-output** | Charge per deliverable produced | Content generation | Report/document generators |
| **Outcome-based** | Tied to measurable business results | High-trust, provable ROI | Intercom Fin ($0.99/resolved issue) |
| **Hybrid** | Base fee + variable usage/performance layer | Most enterprise scenarios | Relevance AI (plan + actions + credits) |

### Market Trend Data

- **Hybrid pricing surged from 27% to 41%** of AI companies in 12 months
- **Seat-based dropped from 21% to 15%** — companies actively moving away
- Companies sticking with per-seat pricing for AI see **40% lower gross margins** and **2.3x higher churn**
- **80% of companies use generative AI** but ~90% of vertical use cases remain pilot-stage (McKinsey)
- Most AI agents cost **$20,000-$60,000 to build** with additional ongoing infrastructure costs

Sources: [Chargebee AI Agent Pricing Playbook](https://www.chargebee.com/blog/pricing-ai-agents-playbook/), [EMA 8 AI Agent Pricing Models](https://www.ema.ai/additional-blogs/addition-blogs/ai-agents-pricing-strategies-models-guide), [Growth Unhinged Pricing Framework](https://www.growthunhinged.com/p/ai-agent-pricing-framework), [AIMultiple Agent Pricing](https://aimultiple.com/ai-agent-pricing)

---

## 3. Multi-Tenancy Architecture Patterns

### AWS Prescriptive Guidance: Three Models

#### Model A: Customer-Dedicated Agent (Silo)
- Separate agent instance per customer
- Full isolation: compute, data, models
- Highest cost, highest security
- Suitable for: regulated industries, enterprise contracts justifying premium pricing

#### Model B: Agent-as-a-Service / AaaS (Pool)
- Single agent serving multiple customers
- Shared infrastructure, logical isolation via tenant_id
- Best economies of scale
- Two variants:
  - **Universal AaaS**: Same experience for all (no tenant context)
  - **Contextual AaaS**: Tenant-aware — tools, knowledge, actions vary per customer

#### Model C: Hybrid
- Shared infrastructure with namespace-level isolation
- Per-tenant: knowledge bases, tools, actions, state
- Shared: LLM inference, compute, monitoring
- **Recommended for most B2B platforms** — balances cost and isolation

### Isolation Mechanisms (for any model)

| Layer | Technique |
|-------|-----------|
| Data | Tenant-specific vector DB namespaces, encrypted per-tenant storage |
| Identity | JWT tokens with tenant context, RBAC |
| Compute | Container/pod isolation, resource quotas per tenant |
| Knowledge | Separate RAG collections per tenant |
| Throttling | Per-tenant rate limits and scaling policies |

Sources: [AWS Agentic AI Multi-Tenancy](https://docs.aws.amazon.com/prescriptive-guidance/latest/agentic-ai-multitenant/agents-meet-multi-tenancy.html), [Medium: Multi-tenancy in AI Agentic Systems](https://isurusiri.medium.com/multi-tenancy-in-ai-agentic-systems-9c259c8694ac), [Azure Multi-tenant AI Architecture](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/approaches/ai-machine-learning)

---

## 4. Infrastructure Costs: Running n8n-Based AI Agents 24/7

### n8n Cloud Pricing

| Plan | Monthly | Executions | Concurrent Workflows |
|------|---------|-----------|---------------------|
| Community (self-host) | Free | Unlimited | Unlimited |
| Starter | EUR 24/mo (EUR 20 annual) | 2,500/mo | 5 |
| Pro | EUR 60/mo (EUR 50 annual) | 10,000/mo | 20 |
| Business | EUR 800/mo (EUR 667 annual) | 40,000/mo | 200+ |
| Enterprise | Custom | Unlimited | Custom |

Note: Business plan has 50% startup discount for companies with <20 employees.

### Self-Hosted Production Costs (per agent instance)

| Component | Monthly Cost | Notes |
|-----------|-------------|-------|
| VPS (Hetzner/DO) | EUR 6-50 | 2 vCPU, 4GB RAM minimum for production |
| PostgreSQL (managed) | EUR 10-30 | Or free if self-managed on same VPS |
| Redis (high volume) | EUR 5-15 | Queue management for concurrent workflows |
| LLM API costs | EUR 20-200+ | Highly variable; depends on model, volume, token usage |
| **Bare infrastructure** | **EUR 40-100** | **Without labor/maintenance** |
| Maintenance labor | ~EUR 430/mo | ~69 hrs/year at EUR 75/hr (setup + weekly + incidents) |
| **Realistic total** | **EUR 200-500/mo** | **Per agent instance, production-grade** |

### Cost Per Customer Agent (FMai AaaS Context)

For FMai running n8n-based agents for agency clients:

**Silo model (dedicated n8n per customer)**:
- EUR 40-100/mo infrastructure + LLM costs per customer
- Scales linearly with customer count
- Maximum isolation but highest cost

**Pool model (shared n8n, multi-tenant workflows)**:
- Single n8n Business instance (EUR 800/mo) serving ~20-50 customers
- Per-customer cost: EUR 16-40/mo infrastructure + individual LLM costs
- Requires tenant-aware workflow design

**Hybrid (recommended for FMai)**:
- Shared n8n infrastructure with per-tenant knowledge bases and configs
- Dedicated Supabase schemas or namespaces per customer
- Estimated per-customer COGS: EUR 30-80/mo (infra + LLM at moderate usage)
- Supports EUR 497-2,497/mo pricing tiers with 80-95% gross margins

Sources: [n8n Pricing](https://n8n.io/pricing/), [ConnectSafely n8n Cloud Pricing Guide](https://connectsafely.ai/articles/n8n-cloud-pricing-guide), [Dev.to Self-Hosting n8n Cost Analysis](https://dev.to/farrukh_tariq_b2d419a76cf/i-spent-11-hours-self-hosting-n8n-on-a-vps-heres-what-it-actually-costs-you-52i1), [Virtua Cloud Self-Host AI Agents Guide](https://www.virtua.cloud/learn/en/concepts/self-host-ai-agents-vps)

---

## 5. Strategic Implications for FMai AaaS

### What competitors do (summary)

| Company | True Architecture | Customer Perception | Pricing Anchor |
|---------|------------------|--------------------|--------------------|
| 11x.ai | Shared/contextual AaaS | "Your dedicated digital worker Alice" | Per-worker (~$5K/mo) |
| Artisan | Shared/contextual AaaS | "Your AI BDR Ava" | Per-lead-volume |
| Relevance AI | Multi-tenant platform | "Build your own agents" | Hybrid (plan + credits) |

### Key takeaways for FMai

1. **The "dedicated agent" is mostly branding.** 11x and Artisan both run shared infrastructure but sell the experience of a named digital employee. FMai can do the same — present each client's marketing agent as "their" dedicated worker while running shared n8n/Supabase infrastructure.

2. **Hybrid pricing wins.** The market is moving decisively toward hybrid (base fee + usage). FMai's current tier model (EUR 497/997/2497) with credit packs aligns well with this trend.

3. **Lead/action volume is the natural pricing axis.** Not seats, not agent count. For marketing agents: number of campaigns, content pieces generated, leads processed, or actions executed.

4. **Multi-tenancy is table stakes.** Use contextual AaaS: shared infrastructure, per-tenant knowledge bases (brand voice, target audiences, content history), per-tenant n8n workflow configs, tenant-aware Supabase schemas.

5. **Infrastructure margins are excellent.** At EUR 30-80/mo COGS per customer with EUR 497-2,497/mo pricing, FMai achieves 85-97% gross margins — comparable to pure SaaS.

6. **Annual contracts are industry standard.** Both 11x and Artisan require annual commitments. FMai should consider annual pricing with monthly payment options.

---

## 6. Recommended Architecture for FMai

```
Customer Request
  |
  v
API Gateway (auth + tenant resolution)
  |
  v
Shared n8n Instance(s) (Business plan or self-hosted)
  |-- Tenant-specific workflow configs
  |-- Per-tenant webhook endpoints
  |-- Tenant context injected into every execution
  |
  v
Shared LLM Layer (OpenAI/Anthropic API)
  |-- Per-tenant system prompts (brand voice, strategy)
  |-- Per-tenant RAG context (knowledge base)
  |
  v
Supabase (multi-tenant)
  |-- Per-tenant schemas or RLS policies
  |-- Content history, analytics, configs per tenant
  |-- Shared auth layer
```

**Model**: Contextual AaaS (AWS terminology) — shared infrastructure, tenant-aware context, branded as "your dedicated marketing agent."
