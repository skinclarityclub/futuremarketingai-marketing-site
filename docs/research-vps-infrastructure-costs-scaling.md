---
title: VPS Infrastructure Costs and Scaling Analysis for AI Agent Hosting
tags:
  - infrastructure
  - pricing
  - scaling
  - n8n
  - vps
  - hetzner
  - cost-analysis
created: 2026-03-26
source: Firecrawl research (n8n docs, Hetzner pricing, Latenode, Evalics, AgentCenter, BetterStack)
---

# VPS Infrastructure Costs and Scaling Analysis for AI Agent Hosting

Research-backed cost analysis for hosting n8n-based AI marketing agents on European VPS infrastructure, with margin calculations against FMai's premium pricing tiers.

---

## 1. n8n Resource Requirements (Real-World Data)

### Official Minimum (Dev/Testing Only)
- **CPU:** 2 vCPU
- **RAM:** 2 GB
- **Storage:** 20 GB SSD
- **Database:** SQLite (NOT suitable for production)
- **Source:** n8n docs, Hostinger tutorial

### Production Single Instance (10-20 Concurrent Workflows)
- **CPU:** 4+ vCPU
- **RAM:** 8 GB minimum
- **Storage:** 50 GB+ SSD
- **Database:** PostgreSQL (dedicated, SSD-backed)
- **Source:** Latenode community benchmarks, n8n community forums

### Key Findings on n8n Resource Usage
- n8n is NOT CPU-intensive for most workflows; memory requirements supersede CPU
- Each n8n instance recommends a **dedicated PostgreSQL database** (or at minimum a dedicated Postgres schema)
- SQLite cannot handle concurrent operations or multi-user scenarios
- AI agent workflows (HTTP + LLM API calls) are I/O-bound, not compute-bound -- the heavy compute happens at the LLM provider (OpenAI, Anthropic, etc.)
- The n8n process itself is lightweight; the bottleneck is concurrent execution count

### n8n Queue Mode (Production Scaling)
n8n supports a **queue mode** for horizontal scaling:
- **Main instance:** Handles web UI, receives webhooks/triggers, creates execution records
- **Redis:** Message broker maintaining execution queue
- **Workers:** Separate n8n processes that pull jobs from Redis and execute workflows
- Each worker is its own Node.js instance capable of handling multiple simultaneous executions
- Workers can be added/removed dynamically to match workload

**Architecture for scaling:**
```
Main n8n (triggers/webhooks) -> Redis queue -> Worker pool -> PostgreSQL
```

This means you do NOT need one full n8n instance per agent/workspace. You need:
1. One main instance (lightweight, 2 vCPU / 4 GB)
2. Redis (minimal, <1 GB)
3. Worker pool (scalable, each worker ~1-2 vCPU / 2-4 GB)
4. One PostgreSQL database (shared, with per-workspace schemas)

---

## 2. Hetzner Cloud Pricing (Post-April 2026 Adjustment)

All prices excl. VAT. Germany/Finland data centers. Source: Hetzner price adjustment docs.

### Shared VPS (Regular Performance — CPX series, AMD)
| Plan | vCPU | RAM | SSD | Monthly |
|------|------|-----|-----|---------|
| CPX22 | 2 | 4 GB | 80 GB | **EUR 7.99** |
| CPX32 | 4 | 8 GB | 160 GB | **EUR 13.99** |
| CPX42 | 8 | 16 GB | 240 GB | **EUR 25.49** |
| CPX52 | 16 | 32 GB | 360 GB | **EUR 36.49** |

### Dedicated vCPU (General Purpose — CCX series)
| Plan | vCPU | RAM | SSD | Monthly |
|------|------|-----|-----|---------|
| CCX13 | 2 | 8 GB | 80 GB | **EUR 15.99** |
| CCX23 | 4 | 16 GB | 160 GB | **EUR 31.49** |
| CCX33 | 8 | 32 GB | 240 GB | **EUR 62.49** |
| CCX43 | 16 | 64 GB | 360 GB | **EUR 124.99** |
| CCX53 | 32 | 128 GB | 600 GB | **EUR 249.99** |
| CCX63 | 48 | 192 GB | 960 GB | **EUR 374.49** |

### ARM VPS (Cost-Optimized — CAX series, Ampere)
| Plan | vCPU | RAM | SSD | Monthly |
|------|------|-----|-----|---------|
| CAX11 | 2 | 4 GB | 40 GB | **EUR 4.49** |
| CAX21 | 4 | 8 GB | 80 GB | **EUR 7.99** |
| CAX31 | 8 | 16 GB | 160 GB | **EUR 15.99** |
| CAX41 | 16 | 32 GB | 320 GB | **EUR 31.49** |

### Add-ons
| Item | Monthly |
|------|---------|
| Load Balancer (LB11) | EUR 7.49 |
| Load Balancer (LB21) | EUR 21.49 |
| Primary IPv4 | EUR 0.50 |
| Object Storage (base) | EUR 6.49 |
| 20 TB traffic included (EU) | Free |
| Additional traffic per TB (EU) | EUR 1.19 |

### Dedicated Servers (Bare Metal)
| Tier | Starting Price |
|------|---------------|
| Server Auction (refurbished) | From EUR 34/mo |
| Dedicated Server (new) | From EUR 37.30/mo |

---

## 3. Cost Models: Agent-per-Workspace vs Shared Infrastructure

### Model A: Isolated n8n Instance per Workspace (Naive Approach)

Each customer workspace gets its own n8n instance + database.

**Per workspace (minimum production-ready):**
- CPX32 (4 vCPU, 8 GB RAM): EUR 13.99/mo
- Or CAX21 ARM (4 vCPU, 8 GB): EUR 7.99/mo
- PostgreSQL on same server or managed: included
- Total per workspace: **EUR 8-14/mo**

**Scaling costs (using CAX21 ARM, cheapest production-viable):**

| Workspaces | Servers | Monthly Infra Cost |
|------------|---------|-------------------|
| 1 | 1x CAX21 | EUR 8 |
| 5 | 5x CAX21 | EUR 40 |
| 15 | 15x CAX21 | EUR 120 |
| 50 | 50x CAX21 | EUR 400 |
| 100 | 100x CAX21 | EUR 800 |

**Pros:** Full isolation, easy to reason about, per-customer kill switch
**Cons:** Massive resource waste (most agents idle 95%+ of the time), management overhead

### Model B: Shared n8n with Queue Mode (Recommended)

Single n8n cluster shared across all workspaces, with queue-based execution.

**Base infrastructure (handles up to ~50 workspaces):**

| Component | Server | Monthly |
|-----------|--------|---------|
| Main n8n (triggers + UI) | CAX21 (4 vCPU, 8 GB) | EUR 7.99 |
| Redis | CAX11 (2 vCPU, 4 GB) | EUR 4.49 |
| Worker 1 | CAX21 (4 vCPU, 8 GB) | EUR 7.99 |
| Worker 2 | CAX21 (4 vCPU, 8 GB) | EUR 7.99 |
| PostgreSQL | CAX31 (8 vCPU, 16 GB) | EUR 15.99 |
| Load Balancer | LB11 | EUR 7.49 |
| **Total** | | **EUR 51.94** |

**Scaling by adding workers:**

| Workspaces | Workers | Monthly Infra Cost |
|------------|---------|-------------------|
| 1-10 | 2 | EUR 52 |
| 10-25 | 3 | EUR 60 |
| 25-50 | 5 | EUR 76 |
| 50-100 | 8 | EUR 100 |
| 100-200 | 12 | EUR 132 |
| 200-500 | 20 | EUR 196 |

**Pros:** 5-10x cheaper, efficient resource utilization, agents are idle most of the time anyway (marketing workflows run on schedules, not 24/7)
**Cons:** Shared infrastructure risk, need queue management, noisy neighbor potential

### Model C: Dedicated Server + Docker (Best Value at Scale)

At ~50+ workspaces, a single Hetzner dedicated server from the auction (EUR 34-50/mo) with 32-64 GB RAM and 6-8 cores can run everything via Docker Compose or lightweight Kubernetes.

**Example Hetzner Auction server (~EUR 45/mo):**
- Intel i7 / Xeon, 6-8 cores
- 64 GB RAM
- 2x 512 GB NVMe SSD
- Runs: 10+ n8n workers, PostgreSQL, Redis, monitoring

| Workspaces | Servers | Monthly Infra Cost |
|------------|---------|-------------------|
| 1-100 | 1 dedicated | EUR 45-55 |
| 100-300 | 2 dedicated | EUR 90-110 |
| 300-500 | 3 dedicated + failover | EUR 150-180 |

---

## 4. Complete Infrastructure Cost per Tier

### What Actually Runs per Agent/Workspace

An FMai "agent" for a client workspace involves:
1. **n8n workflows** (scheduled content creation, social posting, lead scoring, email campaigns) -- these are event-driven, not 24/7 compute
2. **LLM API calls** (OpenAI, Anthropic) -- billed per token to FMai, NOT compute on VPS
3. **Third-party API calls** (social platforms, Vapi for voice, ad platforms) -- billed per usage
4. **Data storage** (workflow configs, execution logs, credentials) -- PostgreSQL rows

**Critical insight:** The VPS only runs the n8n orchestration layer. The expensive parts (LLM inference, voice calls, video generation) happen on external APIs and are already captured in the credit system's internal cost of EUR 0.03-0.04 per credit.

### Realistic Infrastructure Cost per Workspace

Using Model B (shared n8n queue mode):

| Scale | Infra/mo | Per Workspace/mo | Per Workspace/yr |
|-------|----------|-------------------|-------------------|
| 5 workspaces | EUR 52 | **EUR 10.40** | EUR 125 |
| 15 workspaces | EUR 60 | **EUR 4.00** | EUR 48 |
| 50 workspaces | EUR 76 | **EUR 1.52** | EUR 18 |
| 100 workspaces | EUR 100 | **EUR 1.00** | EUR 12 |
| 200 workspaces | EUR 132 | **EUR 0.66** | EUR 8 |

Using Model C (dedicated server at scale):

| Scale | Infra/mo | Per Workspace/mo | Per Workspace/yr |
|-------|----------|-------------------|-------------------|
| 50 workspaces | EUR 50 | **EUR 1.00** | EUR 12 |
| 100 workspaces | EUR 50 | **EUR 0.50** | EUR 6 |
| 200 workspaces | EUR 100 | **EUR 0.50** | EUR 6 |
| 500 workspaces | EUR 180 | **EUR 0.36** | EUR 4 |

---

## 5. Margin Analysis Against FMai Pricing Tiers

### Total Cost of Goods Sold (COGS) per Tier

COGS has three components:
1. **VPS/Infrastructure** (this analysis)
2. **LLM/API costs** (credit system internal cost: EUR 0.03-0.04/credit)
3. **Third-party SaaS** (n8n license, monitoring, backup, etc.)

#### Fixed Overhead (Regardless of Customer Count)
| Item | Monthly |
|------|---------|
| n8n Enterprise license (if needed) | EUR 0 (self-hosted community is free) |
| Domain + SSL | EUR 2 |
| Monitoring (Uptime, logs) | EUR 10-20 |
| Backup (S3/Object Storage) | EUR 6.49 |
| Coolify/management layer | EUR 0 (self-hosted) |
| **Fixed overhead** | **~EUR 20-30** |

#### Per-Tier COGS Analysis

**Growth Tier: EUR 1,497/mo (5 workspaces, 3,000 credits)**

| Cost Component | Amount |
|----------------|--------|
| VPS share (5 ws in 50-ws cluster) | EUR 7.60 |
| Credit internal cost (3,000 x EUR 0.035) | EUR 105 |
| Fixed overhead share (5/50) | EUR 3 |
| **Total COGS** | **EUR 115.60** |
| **Revenue** | **EUR 1,497** |
| **Gross Margin** | **EUR 1,381 (92.3%)** |

**Professional Tier: EUR 2,997/mo (15 workspaces, 8,000 credits)**

| Cost Component | Amount |
|----------------|--------|
| VPS share (15 ws in 50-ws cluster) | EUR 22.80 |
| Credit internal cost (8,000 x EUR 0.035) | EUR 280 |
| Fixed overhead share (15/50) | EUR 9 |
| **Total COGS** | **EUR 311.80** |
| **Revenue** | **EUR 2,997** |
| **Gross Margin** | **EUR 2,685 (89.6%)** |

**Enterprise Tier: EUR 4,997/mo (unlimited workspaces, 20,000 credits)**

Assuming 30 active workspaces (realistic for "unlimited"):

| Cost Component | Amount |
|----------------|--------|
| VPS share (30 ws in 100-ws cluster) | EUR 30 |
| Credit internal cost (20,000 x EUR 0.035) | EUR 700 |
| Fixed overhead share (30/100) | EUR 9 |
| **Total COGS** | **EUR 739** |
| **Revenue** | **EUR 4,997** |
| **Gross Margin** | **EUR 4,258 (85.2%)** |

**Founding Member: EUR 997/mo (unlimited workspaces, 10,000 credits)**

Assuming 20 active workspaces:

| Cost Component | Amount |
|----------------|--------|
| VPS share (20 ws in 100-ws cluster) | EUR 20 |
| Credit internal cost (10,000 x EUR 0.035) | EUR 350 |
| Fixed overhead share | EUR 6 |
| **Total COGS** | **EUR 376** |
| **Revenue** | **EUR 997** |
| **Gross Margin** | **EUR 621 (62.3%)** |

---

## 6. Scaling Inflection Points

### When Does Agent-per-Workspace Become Cost-Prohibitive?

**Answer: Almost immediately.** Model A (isolated instances) costs EUR 8-14 per workspace versus EUR 1-4 per workspace with shared infrastructure. At 50 workspaces:
- Model A: EUR 400-700/mo
- Model B: EUR 76/mo
- Model C: EUR 50/mo

Agent-per-workspace only makes sense if you are charging EUR 500+/mo per workspace AND need strict isolation (regulated industries). For marketing agents, shared infrastructure with logical isolation (per-workspace database schemas, separate n8n projects) is the clear winner.

### When Do You Need to Upgrade Infrastructure?

| Trigger | Action | Added Cost |
|---------|--------|-----------|
| >50 concurrent workflow executions | Add worker (CAX21) | +EUR 8/mo |
| >500 workspaces | Add second dedicated server | +EUR 45-55/mo |
| Database >100 GB | Upgrade PostgreSQL server | +EUR 8-16/mo |
| Need HA/failover | Add replica + load balancer | +EUR 20-30/mo |
| SLA requirement (99.9%) | Multi-server + monitoring | +EUR 50-80/mo |

### The Real Scaling Bottleneck

It is NOT VPS compute. The scaling bottleneck is:
1. **LLM API costs** -- these scale linearly with usage (captured in credit system)
2. **Third-party API rate limits** -- social platform APIs, Vapi minutes, ad platform limits
3. **Engineering time** -- building, maintaining, and debugging agent workflows per client

VPS infrastructure is a rounding error in the total cost structure.

---

## 7. Comparison: What Platforms Charge vs What It Costs Them

### AI Agent Platform Pricing (Market Research)

| Platform | Price | What They Charge | Estimated COGS |
|----------|-------|-----------------|---------------|
| 11x (AI Alice) | $5,000/mo | 1 outbound sales agent | ~$200-500/mo |
| Artisan (Ava) | $2,000/mo | 1 SDR agent | ~$100-300/mo |
| n8n Cloud Pro | $50/mo | Platform + executions | ~$5-10/mo |
| Relevance AI | $249-999/mo | Agent platform + tasks | ~$30-100/mo |
| Lindy.ai | $49-299/mo | AI assistant tasks | ~$10-50/mo |

**Industry gross margins for AI agent platforms: 70-90%**

The pattern is clear: platforms charge for the value of the outcome (replacing a human), NOT the cost of compute. A human SDR costs $5,000/mo; an AI agent doing 80% of the same work for $2,000/mo is a no-brainer for the buyer -- even though compute + API costs are under $500.

---

## 8. Recommended Architecture for FMai

### Phase 1: Launch (0-20 Customers, 0-100 Workspaces)

```
1x Hetzner CAX31 (8 vCPU, 16 GB) -- EUR 15.99/mo
  - n8n main + 2 workers (Docker)
  - PostgreSQL
  - Redis

Total: ~EUR 20/mo (with IPv4 + backups)
```

### Phase 2: Growth (20-50 Customers, 100-300 Workspaces)

```
1x Hetzner Dedicated (auction, ~EUR 45/mo)
  - 64 GB RAM, 8 cores
  - n8n main + 5-8 workers
  - PostgreSQL
  - Redis

1x CAX21 (failover/staging) -- EUR 7.99/mo

Total: ~EUR 55/mo
```

### Phase 3: Scale (50-200 Customers, 300-1000+ Workspaces)

```
2x Hetzner Dedicated (~EUR 90/mo)
  - n8n workers distributed
  - PostgreSQL primary + replica

1x CAX31 (Redis + monitoring) -- EUR 15.99/mo
1x Load Balancer -- EUR 7.49/mo

Total: ~EUR 115/mo
```

---

## 9. Key Takeaways

1. **VPS costs are negligible** relative to revenue. Even at scale, infrastructure is 1-3% of revenue.

2. **Never use agent-per-workspace isolation** unless regulation demands it. Shared n8n queue mode with logical tenant separation is 5-10x cheaper.

3. **The real COGS is LLM/API tokens**, already captured in the credit system at EUR 0.03-0.04/credit with 65-70% margin.

4. **Hetzner (Germany/Finland) is optimal** for GDPR-compliant European hosting at 3-5x lower cost than AWS/GCP/Azure equivalents.

5. **Gross margins across all tiers are 62-92%**, with Growth being the most profitable tier per-euro and Founding being the least (but still healthy at 62%).

6. **At EUR 1,497/mo (Growth)** the infrastructure cost per workspace is EUR 10.40 -- that is 0.7% of revenue.

7. **At EUR 4,997/mo (Enterprise)** even with 30 workspaces and 20,000 credits, COGS is EUR 739 -- yielding 85% gross margin.

8. **Scaling from 5 to 500 workspaces** increases VPS costs from EUR 52 to EUR 180/mo -- a 3.5x increase for 100x more customers.

9. **Start with a single EUR 16/mo ARM VPS.** You will not need to upgrade until you have 20+ paying customers.
