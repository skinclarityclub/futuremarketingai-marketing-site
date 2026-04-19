# FMai Capabilities Inventory — 2026-04-19

> Source inventory: memory (~57 files), fma-app CLAUDE.md, FMai CLAUDE.md, Futuremarketingai CLAUDE.md, graphify CODEBASE_MAP (4930 nodes), Obsidian vault (44 wiki pages + Agency/ synthesis), 131 Supabase migrations, recent git log (~80 commits).

---

## Executive Summary

FutureMarketingAI is a live, multi-component **AI Marketing Employee platform for agencies** (B2B2B). It is not a demo or a roadmap — it runs a real content pipeline for a paying-style first client (SkinClarity Club, 3 Instagram accounts, 21 carousels/week) and a self-hosted 8-agent AI team (OpenClaw) on a Hetzner VPS producing 110 heartbeat wakes/day at ~EUR 7/mo LLM spend.

The stack has three tiers: (1) an **n8n content pipeline** (self-hosted, WAT architecture: Workflows → Agents → Tools) that does research → strategy → generation → quality scoring (QSE V3 with 5 weighted dimensions) → rendering (Orshot) → posting (Blotato); (2) a **Next.js 16 multi-tenant SaaS command center** (`app.future-marketing.ai`) with 131 migrations, Clyde AI employee with 4-layer memory, 17 tools, Telegram bridge, and a revenue loop with spike detection + PDF reports; (3) a **persistent 8-agent OpenClaw team** orchestrated by Paperclip, connected via Tailscale mesh to a local RTX 5070 Ti laptop running Ollama qwen3:14b as the primary LLM (zero inference cost, ~30ms latency), with cloud fallbacks to Gemini 3 Flash and Claude Sonnet.

The **real differentiators** — almost none of which are currently on the marketing website — are: the memory system (pgvector + decay formula + dream consolidation + 2-hop graphify codebase navigation), the local-first AI routing (laptop GPU serves all agents, free inference), the agency-first B2B2B positioning with vertical packs (EUR 997–1997/mo), the AutoFix Agent Team that detects issues and opens GitHub PRs autonomously, the Client Intelligence learning loop (5 tables, 3 n8n workflows for weekly/monthly synthesis), the self-evolving skill engine (OpenSpace, 37 skills with auto-repair/derivation), and a proven content pipeline with 7-stage multi-client multi-platform support that works for SKC (21 items/run) and FMai (28 items/run = 2 accounts × 2 platforms × 7 pillars).

---

## Memory System

This is the single biggest unmarketed USP. Multi-layered, versioned, semantically searchable, with decay and nightly consolidation.

**4-Layer Memory Architecture** (see `wiki/concepts/Memory Architecture.md`, `wiki/concepts/Clyde AI Employee.md`):

| Layer | Contents | Load strategy |
|---|---|---|
| HOT | CLAUDE.md rules, MEMORY.md index | Always loaded, <500 tokens |
| WARM | `wiki/hot.md` 48h cache, skill files, memory topic files, graphify report | On-demand |
| COLD | `memory/archive/`, 416+ Obsidian files, historical graph snapshots | Never auto-loaded |
| CONTEXT | Per-conversation working memory | Session-bound |

**Per-client isolation**: separate memory namespace per client (e.g. `agent-memory-local/skc/`) — no cross-client leakage.

**Dream consolidation** (`~/.claude/skills/dream/SKILL.md`): 4-phase ritual — Orient → Gather → Consolidate → Prune. Runs nightly at 01:00 CET via OpenClaw cron. Detects stale/outdated memories, merges duplicates, rewrites frontmatter. Triggered by flag-file pattern: Stop hook writes `.dream-needed`, SessionStart hook injects warning.

**Decay formula** (`scripts/decay-memories.mjs`): `importance × e^(-0.16 × ageDays) × (1 + access_count × 0.1)`. Archive threshold 0.05. Stats mode shows decay score per memory. Grouped by base_path to keep chunks together.

**Semantic search** (`scripts/memory-search.mjs`): pgvector retrieval over memory + wiki via Supabase `memory_embeddings` table. Filters: `--source memory|wiki`, `--type user|feedback|project|reference`, `--top N`. Migration `20260416000000_fma_memory_embeddings.sql` + `20260418000000_fix_memory_ranking.sql`.

**Structured knowledge layer** (`fma_knowledge` table, migration `20260415000000_fma_knowledge.sql`): injected as L1 context in Clyde system prompt. Separate from episodic memory — explicit facts the agent treats as ground truth.

**Memory health**: MEMORY.md hard cap 200 lines / soft cap 25, `.health.json` tracks `last_dream`, `memory_md_lines`, `topic_files_active`, `graphify_status`. Git-versioned with 22 snapshots (max 5 retained).

**Improvements already shipped** (2026-04-18): retrieval scoring tuned — FTS 10→25%, vector 50→45% for marketing keywords. 90-day inferred memory confirmation loop prevents stale facts (Letta sleep-time pattern). Weekly reflection generation on Sunday consolidation cron.

**2-Hop Graphify protocol** for code navigation: knowledge graph at `graphify-out/` (4930 nodes, 4644 edges, 1257 communities, 20 named). Hop 1: `CODEBASE_MAP.md` → find community. Hop 2: `wiki/_COMMUNITY_*.md` → exact files. Total ~3k tokens vs 10-30k for blind grep. Auto-updated by post-commit hook.

---

## Agent System (OpenClaw + Paperclip + Claude Code skills)

### OpenClaw — 8 Persistent Production Agents

Deployed 2026-03-23, updated to v2026.4.16 on 2026-04-17. Runs as `openclaw` user (not root) under systemd on Hetzner CPX42.

| Agent | Role | Heartbeat |
|---|---|---|
| Clyde (CEO/main) | Orchestrator, daily digest, client-facing | 1800s (30m) |
| Content Engine | Pipeline monitoring, content production | 3600s (1h) |
| Ops Monitor | Infra health, uptime, alerting (merged Guardian) | 900s (15m) |
| SKC Clyde | Client Success Lead for SkinClarity | 7200s (2h) |
| Product Scout | Market research, feature discovery | 7200s (2h) |
| Revenue Ops | Revenue tracking, churn signals | 7200s (2h) |
| Ad Manager | Paid media (currently paused, no Meta API) | 3600s (1h) |
| SEO Analyst | Rank tracking, CWV audits, GEO citations | 14400s (4h) |

**Gateway**: port 18789, bind=lan, Hetzner Cloud Firewall `fma-production` (22/80/443 only), 8GB swap, credentials in `openclaw.json` env vars (not hardcoded), UFW + iptables enforce Docker bridge isolation.

**Paperclip orchestration** (v0.3.1, Docker port 3200, URL `paperclip.future-marketing.ai`): company-level routines beyond OpenClaw crons. 11 routines with cron triggers (Ops 2h, Content 3h, SKC 4h, SEO Rank 6am, SEO Audit Mon 7am, CWV Wed 7am, Clyde Digest 8am, Weekrapport Fri 17:00, Revenue 9am, Product Scout 6h). 110 heartbeat wakes/day at ~EUR 7/mo.

**Quality controls**: max 3 issues per session, self-close ban (creators can't close own issues), anti-duplication (search before create), assignment routing to specialist (never self-assign), `SCHEMA_REFERENCE.md` in each workspace for correct column names, 6 OKR goals assigned to owners.

### Always-Active Agents v2+v3 (2026-03-27, all waves complete)

6 waves of infrastructure + 4 waves of self-improvement/collaboration. **Event-driven architecture** via 3 DB triggers (content failures, sales anomalies, task delegation) → `pgmq agent_events` queue → `pg_cron` processor → OpenClaw webhook. Per-agent budgets totaling $12/day. 3 pgmq queues (events, DLQ after 5 retries, insights event bus), DLQ Telegram alerts if >5 messages. Observability columns on `fma_agent_activity`: input_tokens, output_tokens, model, cost_usd, error_code.

**Proactive output verified**: Content Engine (A/B caption analysis, pipeline gap alerts), SKC (cross-sell analysis, engagement-sales correlation), Ops Monitor (security scans, cost reports), Clyde (coordination, SSH brute-force review).

### AutoFix Agent Team (LIVE, E2E tested with auto-merged PR #5)

VPS agents detect code issues → Supabase `fma_issue_queue` → router → fixer → GitHub PRs with fingerprint dedup. Auto-merges `autofix:low-risk` after CI passes. Security-hardened through 4-source audit: 35+ dangerous patterns blocked (eval, Function, fs.write, WebSocket, axios), timing-safe auth, case-insensitive path exclusion, dedup race fix, per-agent rate limiting (10/hour), self-modification blocked on autofix code + CI workflows. Design: `docs/plans/2026-03-29-autofix-agent-team-design.md`.

### OpenSpace Self-Evolving Skill Engine

Installed 2026-03-28, HKUDS repo, v0.1.0 MIT. MCP server at `/opt/OpenSpace/.venv/bin/openspace-mcp` registered in `openclaw.json`. **37 skills** discovered across 8 directories. 3 evolution modes: FIX (auto-repair fallback >40%), DERIVED (specialized variants when effective <55%), CAPTURED (extract patterns from successes). 51 blocked commands + domain whitelist for security.

### n8n Agent Management (LIVE 2026-03-31)

Hybrid 3-layer: n8n-mcp sidecar (complex ops, Docker `n8n-n8n-mcp-1` port 3333) + REST API (simple ops) + SSH/Docker (infra). 7 skills deployed across workspaces (n8n-monitor, n8n-diagnose, n8n-fix-execution, n8n-fix-workflow, n8n-build-workflow, n8n-fix-infra, n8n-test-workflow). Error Collector workflow `wrPT4B5VWeqR8cTT` catches all n8n errors → `fma_agent_activity`. Health-check cron every 15min.

### Claude Code Skills

~30+ skills. Global (`~/.claude/skills/`): graphify, dream, obsidian-capture, n8n-conventions, testing-playbook, seedance-prompts, orshot-designer, remotion-best-practices, firecrawl variants. Project (`.claude/skills/`): agent-ops, content-strategy, deep-interview, deslop, launch-strategy, linkedin-b2b, marketing-context, marketing-psychology, social-content, ui-ux-pro-max. Agents: database-architect, nextjs-specialist, stripe-specialist, security-auditor.

---

## Content Pipeline (FMai n8n)

### Live Workflow Versions (2026-04-19)

- **SAG Prep V14.0** — Research & Planning, generates content briefs
- **QSE V3** — 5-dimensional quality scoring: Brand Voice 35%, Coherence 25%, Hook 15%, Readability 15%, CTA 10%. Avg score 82. Ollama (qwen3:14b, 24h keep-alive) → Anthropic fallback. Current node code V2.8 stuck on typeVersion whitelist issue, V2.9 plan ready (`typeVersion 1` enables `$helpers.httpRequest`).
- **Caption Gen V4.0**
- **Prepare Items V7.0**
- **Platform Adapter V2.2b** — config-driven CTAs + IG CTA/hashtag correction + slide_specs fallback (deployed 2026-04-16)
- **Quality Gate V2.1** — threads_post bypass
- **Render Orchestrator** — `POST https://n8n.future-marketing.ai/webhook/render-orchestrator-v2`

### Multi-Platform Architecture (Phase 216)

- CF workflow `21924KzWEm57PyWw` — IG passthrough + LI/FB via Haiku + Threads rule-based
- V&P workflow `xD5r2qsKqFtUWSha`
- R&P orchestrator `GTbV3iTY4cgTB3Py`, webhook `rnp-orchestrator`
- Init & Config sub-workflow `RV4n3vEeDSlqXuB2`
- Config endpoint `GET /api/pipeline/config/{clientId}` (Bearer `PIPELINE_CONFIG_SECRET`) — fully dynamic: CTA keywords, storytelling frameworks, target_audiences all from DB

**Pipeline status**: SKC (21 items/run, 3×7 pillars) + FMai (28 items/run = 2 accounts × 2 platforms × 7 pillars) both verified end-to-end. V14 features live: hook-type structures, no text_only slides, stat=headline, contextual images.

### Multi-Client Dynamic — COMPLETE (2026-04-16)

Plan `~/.claude/plans/abundant-hopping-shamir.md`. All hardcoded SKC values removed across 5 phases (config endpoint, CF workflow nodes, app code, onboarding defaults, Clyde `updateClientKnowledge` as 17th tool). Seven CF bugs fixed in sequence (account ordering, client_id forwarding, cross-run contamination via `_sd[$execution.id]`, TDZ error, invalid funnel_stage, PA V2.2 IG fix, CIA V5.2 account distribution).

### Ad Builder (Complete, Phases 29-38)

Two complementary layers:
1. **n8n DPA Machine** (autonomous daily) — all products → Nano Banana (fal.ai) → Orshot (static) + Kling via PiAPI (video) → Creatomate → Meta catalog
2. **FMA App Ad Builder** (human-directed) — 9-step wizard (brief, inspiratie, product, concept, beeld, video, ugc, template, output), Nano Banana 2 → Kling (async via WF4) → Remotion → Meta/download

Central table `ad_creative_assets` with source/pipeline tracking + analytics (impressions, CTR, ROAS, ctr_prev_week, is_fatigued). WF IDs: WF1 Orchestrator `9fbkPoijeCevFcR7`, WF2 Static DPA `ASx2TsU3clw7RwVm`, WF3 Kling DPA `7zUIEIYua0hghyRs`, WF4 Async Bridge `HJ3O53Czbep9q3Nk`. Fatigue detection 3-level (fresh/declining/fatigued) via CTR peak decline + frequency.

**Quality gate**: Claude Vision 0-10 scoring. Multi-variant A/B (3 parallel concepts). Shot Technique Engine (3-layer decision: goal→framework, role→technique, platform→pacing).

### Blog Factory v1 (LIVE 2026-03-27)

Page `/blog-factory` + `POST /api/blog-factory/generate` + n8n WF7 (35+ nodes). Research sub-workflow with 4 parallel queries. Gemini Imagen 3 for images. Currently on OpenAI (Anthropic credits exhausted, switchback pending). 7 Playwright tests pass. Known quality issues tracked: empty secondary keywords, articles too short (2100 vs 5000-10000 benchmark), voice guide not loaded, AI fabricated citations (Firecrawl integration pending).

### Outbound Lead Pipeline (2026-04-01)

6 workflows LIVE on Hetzner: WF-LEAD-0 Stale Cleanup (daily 06:00), WF-LEAD-1 Adzuna Scraper (07:00), WF-LEAD-2 AI Scoring (Claude Haiku, dimensions: keywords 0-25, salary 0-15, location 0-10, urgency 0-5, company_fit 0-20 → Priority A/B/C/D), WF-LEAD-3 Email Generation (Claude Sonnet), WF-LEAD-4 Export to DHS, WF-LEAD-GDPR 90-day cleanup. 4 Supabase tables (migration 080+081). Legal: B2B cold email to BV/NV legal in NL (Art. 11.7 lid 3 Tw); KvK API hard gate pending for ZZP/VOF filter.

### SKC Production Pipeline (separate FMai repo, n8n Cloud)

Separate from Hetzner multi-client pipeline. R&P workflow with pillar rotation SSoT in `skinclarity_workflow_config`. 3 Instagram accounts (skinclarityclub 50%, sindy_huidtherapeut 30%, skinclarity_shop 20%). 7-day brand rotation: maandag LABRAINS microbioom, di/do Eminence Organics, do Nutrins, vr SkinClarity, za Mintenz, zo Eminence. Blotato API for scheduled posting (3 account IDs: 5874/31104/31105). Carousel-first strategy (research: 1.92% engagement vs 1.23% reels, 15-25% vs 2-8% save rate). Smart Week Scheduling V1.9.0 prevents overlapping consecutive runs via `MAX(scheduled_datetime)`.

---

## Multi-Tenant SaaS (fma-app)

Live at `https://app.future-marketing.ai` (Vercel).

**Stack**: Next.js 16 App Router, TypeScript strict, Tailwind + shadcn/ui dark-mode-only, Supabase PostgreSQL + RLS, Stripe, TanStack Query v5, Zod, Vercel. **131 migrations** latest at `20260418010000_add_agent_scope.sql`.

### Milestones Shipped

- **v1.0 MVP** (2026-02-25) — 9 phases, 406 files, 11.100 LOC, 65/65 requirements. Dashboard, content pipeline, analytics, AI Copilot, calendar, campaigns, config, token health.
- **v1.1 Real Data** — notifications with Realtime, Orshot preview, per-account analytics, ManyChat conversion funnel
- **v2.0 Grand Redesign** — framer-motion, Meta Ads UI, AI agents infrastructure, InsightsFeed
- **v2.1 Futuristic UI Makeover** — cyan accent, calendar redesign, pipeline grid, Shopify integration, campaign system, analytics split (Social/Ecommerce/Business), Ad Builder (phases 29-38)
- **v5.0 AaaS Dashboard** (phases 93-100) — nav, Clyde, workspace, routines, metering, dashboard, activity
- **v6.0 Clyde Memory & Intelligence** (104-111)
- **v7.0 Client Onboarding & Agent Provisioning** (113-114)
- **v8.0 Agency-First AaaS Launch** (126-132) — skill library, vertical packs, billing, ManyChat DB, email DB
- **v10.0 Shopify Inventory Intelligence** (144-146)
- **v13.0 R&P Pipeline Feature Parity** (159-166)
- **v14.0 Content Quality Engine** (172-176)
- **v17.0 Clyde Universal AI Employee** (201-207)
- **Phase 216** Pipeline Plumbing + Platform Adapter V1.0 + Content Items V5.0 + E2E test (80 rows content_schedule) + Clyde Memory + Telegram bridge
- **Onboarding Overhaul** — 7-step client wizard, skip_billing, data seeding on activation

### Clyde AI Employee (core SaaS feature)

Persistent AI Marketing Employee per client. **Claude Sonnet 4.6** (execution) + **Opus** (planning). Claude Code subagent (`clyde-skc`) with `memory: local` scope. **17 tools** including `updateClientKnowledge` (17th, commit `149a0f3b`). Multi-channel: dashboard panel → `/api/clyde/chat`, Telegram (`@FutureMarketingAI_Clyde_Bot`, webhook `/api/webhooks/telegram`, deeplink `/start {base64url(orgId|clientId)}` for multi-tenant routing). Growth stages: Cold (0 convos) → Warm (15+) → Hot (50+).

### Revenue Loop (COMPLETE 2026-03-27)

Migration 070: 5 tables (`fma_content_attribution`, `fma_human_minutes_lookup`, `fma_client_reports`, `fma_event_dedup`, `fma_agent_roi_snapshots`). Revenue spike trigger: on `business_kpi_daily` INSERT fires when revenue >1.5× 7-day avg, publishes to `pgmq agent_insights`. Human minutes BEFORE INSERT trigger auto-fills `estimated_human_minutes`. Weekly client report cron (Sunday 09:00 UTC) two-phase: SQL aggregation → OpenAI narrative in Dutch. PDF export via `@react-pdf/renderer` (A4 dark theme). Dashboard route `/clients/[id]/reports`.

### Client Intelligence Platform (design complete 2026-04-07)

Design: `docs/plans/2026-04-07-client-intelligence-learning-platform-design.md`. 8 phases, 5 new tables (`fma_vault_insights`, `fma_content_feedback`, `fma_learning_briefs`, `fma_client_signals`, `fma_client_health`). 3 n8n workflows: WF-LEARN-WEEKLY (Monday), WF-LEARN-MONTHLY (1st), WF-LEARN-CHAT (per conversation). Significance scoring with 5 factors, ≥70 threshold for vault persistence. Temporal insight lifecycle (episodic → durable → superseded). Local-first LLM routing (Qwen3 → Haiku fallback).

### Health Scoring (2026-04-11+)

`feat(health): scoring engine — 5 sub-scores from real data`. Weekly cron endpoint + Vercel schedule (Sundays 06:00 UTC). Recommendation engine with threshold rules + Haiku fallback. Server action for on-demand refresh. UI: refresh button, recommendations display, stale indicator, /10 scale.

### Other Shipped Features

- **Lead Qualifier chatbot** — v9.1, phases 133-143 designed (iframe widget, 3-tier AI routing GPT-4.1 Nano/Mini/Sonnet, Voyage-4 embeddings, hybrid pgvector+BM25 with RRF, GDPR cookie-less + EU AI Act Article 50 disclosure, HMAC-SHA256 webhooks with 12 retries + DLQ). Cost ~$0.55/month per client for 1000 conversations, 99%+ gross margin.
- **Help Center** — tickets, KB articles, ideas (28 nodes in graphify community)
- **Agent Command Center** — scrum meetings, autonomy tiers, proposals, delegation
- **Shopify Integration** — Client Credentials Grant, `fma_shopify_products` with benefits/USPs/skin_type/complementary_product_handles
- **Nudge System** — contextual AI nudges with Clyde avatar, dismiss/Escape, page-type isolation, clientsAtRisk integration

### Database

- Project `nurdldgqxseunotmygzn.supabase.co` (shared with n8n FMai project)
- n8n tables READ-ONLY, new tables `fma_` prefix
- Every table: `organization_id` + RLS enabled + indexes
- Policies: `is_org_member(org_id)` + `has_org_role(org_id, 'admin')`
- Auth: always `getUser()` (never `getSession()`)

### Stripe Billing

Vertical packs + add-ons (see Pricing section). Webhook signature verification with `constructEvent()`, raw body required, idempotency keys. Skip_billing flag for comped accounts.

---

## Infrastructure

### Hetzner VPS (primary compute)

- IP `91.98.143.60`, **CPX42 (8 vCPU, 16GB RAM, 160GB NVMe)**, Ubuntu 24.04, Nuremberg, EUR 24/mo
- Upgraded 2026-03-31 from CPX32 (4/8) to handle Paperclip + OpenClaw + n8n
- Services: n8n (3 containers: main + 2 workers), n8n-mcp sidecar (port 3333), OpenClaw gateway (18789), Paperclip (3200), OpenSpace MCP, Event Collector (systemd `fma-collector.service`)
- Hetzner Cloud Firewall `fma-production`: 22/80/443 inbound only
- Automatic Hetzner backups ENABLED
- 8GB swap (swappiness=10)
- Docker resource limits: postgres 1G, redis 256M, n8n-main 3G, workers 2G, caddy 256M, n8n-mcp 512M
- Daily backup `/opt/scripts/backup-openclaw.sh` at 03:00 UTC (all workspaces + services)
- Paperclip daily backup 04:00 UTC (7d retention, ~172MB)

### Caddy Reverse Proxy

- `n8n.future-marketing.ai` — n8n UI (webhooks external, `/api/*` + `/rest/*` return 403 externally; `X-N8N-API-KEY` header bypass allowed)
- `paperclip.future-marketing.ai` — Paperclip UI
- `openclaw.future-marketing.ai` — OpenClaw dashboard
- MCP sidecar switched to internal Docker URL `http://n8n-main:5678`

### Local AI (Laptop)

- **ASUS ROG Zephyrus G16**, **RTX 5070 Ti 12GB GDDR7** (Blackwell sm_120), Intel Core Ultra 9 285H (16 cores, NPU 13 TOPS, Arc iGPU 77 TOPS), 32GB DDR5
- Ollama v0.20.2 (Windows service, `OLLAMA_HOST=0.0.0.0`, `OLLAMA_KEEP_ALIVE=5m`, `OLLAMA_FLASH_ATTENTION=1`)
- Models: `qwen3:14b` daily driver (9.3GB, 43 tok/s warm, 55-85s cold), `qwen2.5-coder:14b` (code)
- Open-WebUI in Docker port 8080
- Warmup scheduled task at logon (`C:\Scripts\ollama-warmup.ps1`)

### Tailscale Mesh

- Laptop `100.116.19.18`, VPS `100.77.5.79`, ~30ms RTT
- Single Windows Firewall rule: "Allow Ollama (Tailscale only)" port 11434
- All 8 OpenClaw agents routed: primary `ollama-laptop/qwen3:14b`, fallback `google/gemini-3-flash-preview` → `google/gemini-2.0-flash` → `google/gemini-2.5-flash` → `anthropic/claude-haiku-4-5`
- **Zero inference cost** for 8 agents, ~30ms extra latency vs cloud, automatic failover
- n8n WF-AI-Router `Sw3NHukQhte8bsuB` health-checks laptop (3s), routes local or cloud

### Local Creative Toolchain (C:\AI\)

12 tools installed 2026-04-07 on RTX 5070 Ti (isolated Python venvs, PyTorch cu130 nightly):

- **ComfyUI** — image gen (Flux.1 Q8 GGUF, SDXL Juggernaut v10, ControlNet canny/depth, IPAdapter FaceID, upscale)
- **Wan2GP** — Wan 2.2 video generation
- **faster-whisper** large-v3 float16 — transcription
- **XTTS v2** — Dutch voice cloning
- **ACE-Step** — music generation
- **Deep-Live-Cam** — face swap (inswapper_128_fp16)
- **LatentSync** v1.5 — lip sync
- **Piper** — fast Dutch TTS (nl_NL-mls-medium)
- **Continue.dev** — VS Code autocomplete via Ollama (qwen3:14b chat, qwen2.5-coder:14b autocomplete)
- ~70GB disk. 58-test suite at `C:\AI\scripts\test_suite.py`.

### Supabase

- Project ID `nurdldgqxseunotmygzn`
- Migrations via `mcp__supabase__apply_migration` (never manual SQL)
- 131 migration files, shared between n8n FMai project and fma-app

### Multi-Project Codebase

| Path | Role |
|---|---|
| `C:\Users\daley\Desktop\fma-app` | Next.js 16 SaaS command center |
| `C:\Users\daley\Desktop\FMai` | n8n content automation (WAT) for SKC |
| `C:\Users\daley\Desktop\Futuremarketingai` | React/Vite demo/showcase website |
| `C:\Users\daley\Desktop\skinclarityclub` | SKC member platform |
| `C:\Users\daley\Desktop\skinclarity-shopify` | SKC Shopify webshop |

---

## Client Results & Proof Points

### SkinClarity Club (first production client)

- **3 Instagram accounts**: @SkinClarityClub (educational, 50%, posting 09:00), @Sindy_Huidtherapeut (founder, 30%, 13:00), @SkinClarity_Shop (commerce, 20%, 18:00)
- **4 brands** rotated per day: LABRAINS (Mon/Wed), Eminence Organics (Tue/Thu), Nutrins (Sun), Mintenz (Sat), SkinClarity own (Fri)
- **21 carousels/week** generated, rendered, scheduled autonomously
- **28 rows verified** in `content_schedule` after 2026-04-16 multi-client run
- **QSE pass rate ~65%** at threshold 70 (continuously improving)
- **Carousel engagement 1.92% vs 1.23% reels** — 6-slide 40% better save rate than 3-slide
- **Shopify products**: 245 rows, 111 columns (productshopifynieuw.csv)
- **Daily Intel collecting**: Shopify orders/revenue/customers, Instagram posts/metrics, Meta Ads spend/campaigns, Google Analytics, Search Console → `business_kpi_daily`
- **SKC Clyde subagent** with isolated memory, brand voice from `content_config_store.blog_voice_guide`, Sindy persona ("15+ years, 1000+ clients")
- **CTA keyword funnel**: HUIDANALYSE (TOFU), ACADEMY (MOFU), PROGRAM (BOFU), WACHTLIJST/CONSULT/ROUTINE/TIPS/PRIJS; WACHTLIJST active through 2026-12-31 with €10 discount
- **Cross-sell insight** (Content Engine): Bakuchiol + Nordic Mud on 34 orders
- **Active wachtlijst**: 2026-12-31 end date, €10/month Academy discount

### FMai as own client

- 2 accounts (fmai-ig-main + fmai-li-company) × 2 platforms (instagram + linkedin) × 7 pillars = **28 items per run verified** (2026-04-16, re-verified CF 32549)
- Dogfooding the platform for LinkedIn-first content strategy

### Content Quality Learnings (validated in production)

- Brand Voice 35% weight is decisive — Sindy personal voice 20+ points higher than generic educational
- "Je huid reageert op..." curiosity-gap hooks >75 QSE; generic tips <65
- **WACHTLIJST (BOFU) converts better than HUIDANALYSE (TOFU)** on educational content — pre-qualification effect
- Carousels > Reels: 1.92% vs 1.23% engagement, saves 15-25% vs 2-8%, shares significantly higher
- 50-30-20 distribution across accounts > equal allocation
- Personal first-person messaging converts 15-25% better for founder-led brands
- Ingredient-first framing outperforms product-first on educational accounts
- Pre-computed matrices > LLM soft constraints (hook rotation, brand-day mapping)

### Agent ROI (tracked 2026-03-27)

- Content Engine: caption A/B analysis (educational 6.4% ER), performance deep-dive, pipeline gap alerts
- Ops Monitor: EUR 0.03/week cost report, security scan detecting disabled gateway auth
- Paperclip: ~EUR 7/maand for 110 wakes/dag
- Revenue Loop: attribution sidecar for content → order mapping

---

## Commercial Model & Pricing

### Strategic Pivot (2026-03-20 → 2026-03-24)

AaaS (Agent-as-a-Service) for marketing agencies, **B2B2B only** (GoHighLevel playbook). No direct-to-SMB in Phase 1.

| Metric | Direct SMB | Via Agencies (chosen) |
|---|---|---|
| ARPU | EUR 30-200/mo | EUR 500-2.500/mo |
| Monthly churn | 3-7% | 1.5-2.5% |
| LTV | EUR 600-1.200 | EUR 18.000-36.000 |
| LTV:CAC | 2-4x | 10-25x |
| NRR | 97% (shrinking) | 108-118% (growing) |
| Customers for EUR 1M ARR | 400-850 | 40-170 |

Proof: GoHighLevel EUR 82.7M bootstrapped, Vendasta EUR 100M+ ARR. No Dutch competitor in this model.

### Vertical Packs (flat monthly, no usage complexity)

| Pack | Price/mo | Workspaces |
|---|---|---|
| Social Media Engine | EUR 997 | 3 |
| Ecommerce Growth | EUR 1.497 | 5 |
| Full Agency Suite | EUR 1.997 | 10 |
| Founding Member | EUR 697 | 5 (max 5 agencies, 12-month lock) |

**Add-ons**: Blog Factory EUR 247 | Voice Agent EUR 347 | Ad Builder EUR 347 | Extra workspace EUR 97

### Alternative: Gateway Services Pricing (3-tier)

Pre-AaaS pricing direction. Per-pack: Starter EUR 1.497 (setup EUR 2.500), Growth EUR 2.497 (EUR 4.500), Scale EUR 3.997 (EUR 7.500). Target 25-35% upsell from gateway to Marketing Machine flagship (EUR 15.000/mo).

### ICP

- Primary: Performance/Growth agency, 7-15 employees, EUR 750K-2M revenue, NL first
- Secondary: Social/Content agency, 3-10 employees
- Anti-ICP: >30 employees, branding/creative agencies, <EUR 300K revenue
- Dutch market: 5.000-8.000 digital agencies, 49% AI adoption, TAM EUR 9M-30M/year

### Sequencing

1. Now → EUR 500K ARR: 5-10 hand-picked agencies
2. EUR 500K-2M ARR: Partner program + white-label
3. EUR 2M+: optionally direct SMB

### Implementation Status (per AaaS strategy memory)

- ~75% ready
- Ontbrekend: `/agent-activity` log page, `/skills` route, usage metering UI, tier enforcement validation, DB tables `fma_usage_events` + `fma_usage_summary` + `fma_workspace_skill_config`

---

## Integrations

### AI Providers

- **Anthropic** Claude API — Sonnet 4.6 (Clyde execution), Opus (Clyde planning), Haiku 4.5 (scoring, Ops fallback). Cost tracked via `fma_agent_activity`.
- **OpenAI** GPT-4.1, GPT-5.4 (Clyde planning/complex)
- **Google** Gemini 2.5 Flash (OpenClaw primary for 7 agents), Gemini 3 Flash Preview (Paperclip primary), Gemini 2.0 Flash (fallback), Imagen 3 (blog images)
- **Ollama local** qwen3:14b (OpenClaw primary via Tailscale, $0 cost), qwen2.5-coder:14b, deepseek-r1:14b planned
- **OpenRouter** (API key issued 2026-04-10) — GLM-5.1 (MIT, $1.26/$3.96 per 1M), DeepSeek V3.2 ($0.14/$0.28), GPT-4.1 Nano ($0.10)
- **Voyage AI** — embeddings (Voyage-4 for Lead Qualifier RAG)

### Media Generation

- **fal.ai** nano-banana — image gen (Ad Builder, 3 variants × 3 formats = 9 parallel)
- **Orshot** — carousel template rendering (~EUR 30/mo, `api.orshot.com`)
- **PiAPI Kling 2.1** — video generation (Ad Builder WF3/WF4)
- **UseAPI.net Kling 3.0** — multi-shot video (replaced PiAPI for some flows, then reverted to direct Kling API after 522 errors)
- **Remotion Lambda** — branded video assembly
- **ElevenLabs** — Dutch voice-over
- **HeyGen** — UGC video (talking_photo_id / avatar_id)
- **Nano Banana 2** (Gemini natural language) — image gen replaces FLUX T5/CLIP
- **Creatomate** — video composition (legacy, being replaced by Remotion)

### Publishing & Distribution

- **Blotato API** — primary publishing (IG, FB, TikTok, LinkedIn, X, YouTube). Scheduled posts via `scheduledTime`. SKC account IDs: 5874/31104/31105.
- **Meta Graph API** — insights sync, catalog upload (WF2+WF3 DPA), page/instagram actor for ads
- **ManyChat** — DM automation, lead magnet delivery, keyword funnel tracking (`fma_manychat_events`)
- **Placid** — legacy template rendering (PostBuilder)

### Data Sources

- **Shopify** (Client Credentials Grant, 24h TTL on access_token) — orders, products, customers, 245-row CSV
- **Instagram Business API** (`graph.instagram.com`, IGAA tokens) — posts, metrics, Stories
- **Meta Ads API** — campaigns, spend, ROAS, fatigue metrics
- **Google Search Console** — rank tracking
- **PageSpeed Insights** — CWV (Core Web Vitals)
- **Perplexity API** — AI citation tracking (GEO/LLMEO — USP differentiator, ~$2-4/mo)
- **Firecrawl** — content scraping (deferred to first paying client)
- **Apify** — platform data scraping (deferred, ~$170/mo for 1 client)
- **Adzuna API** — vacancy scraping for outbound leads
- **KvK API** — B2B company verification (key pending)

### Communication

- **Telegram** — Clyde bot `@FutureMarketingAI_Clyde_Bot` (multi-tenant deeplink), OpenClaw notifications bot (separate token), pipeline alerts
- **Resend** — transactional email (Lead Qualifier)
- **Upstash Redis** — rate limiting
- **WhatsApp/Discord/Slack** — OpenClaw native bridges (configured but mostly unused)

### Payments & Auth

- **Stripe** — webhook signature verification, webhooks at `/api/webhooks/stripe`, idempotent processing
- **Supabase Auth** — Google OAuth, email/password, `getUser()` always (never `getSession()`)

### Dev Tooling (MCPs)

n8n-docs (525+ node docs + instance workflows), Supabase, Canva, Apify, Blotato, Firecrawl, GitHub, Hetzner, Perplexity, Taskmaster AI, Obsidian (local REST API port 27124). `n8n-mcp` sidecar v2.43.0.

---

## Differentiators / Moats

Two reinforcing moats from wiki synthesis:

### 1. Proprietary Content Pipeline (SAG V14 + QSE V3)

- 7-stage pipeline (research → strategy → generation → quality → render → adapt → distribute)
- 5-dimensional quality scoring (Brand Voice 35%, Coherence 25%, Hook 15%, Readability 15%, CTA 10%)
- Multi-client dynamic (CF workflow `21924KzWEm57PyWw`)
- Multi-platform (IG passthrough, LI/FB via Haiku, Threads rule-based)
- Production-validated hook patterns, CTA conversion insights, carousel length optimization
- Pre-computed matrices > LLM soft constraints (brand-day-theme SSoT in Supabase `pillar_rotation_config`)

### 2. Client Intelligence Learning Loop

- Every content cycle generates data that improves the next
- 5 tables (`fma_vault_insights`, `fma_content_feedback`, `fma_learning_briefs`, `fma_client_signals`, `fma_client_health`) — design ready, implementation in Phase 16
- 3 learning workflows (weekly Monday, monthly 1st, per-conversation)
- Significance scoring with 5-factor formula (threshold ≥70 for vault persistence)
- Temporal insight lifecycle (episodic → durable → superseded)
- After 18 months accumulated cross-client intelligence creates data advantage not easily replicated

### 3. Memory System as Operational Advantage

- Multi-layered (HOT/WARM/COLD/CONTEXT)
- Decay formula + dream consolidation + semantic search + 2-hop graphify
- Per-client isolation via Supabase RLS
- Flat-file works for single-client, Supabase pgvector migration path for multi-client

### 4. Local-First AI Routing

- Laptop GPU serves 8 agents at zero inference cost
- Tailscale mesh with 30ms latency to VPS
- Automatic cloud fallback chain: Ollama → Gemini 3 Flash → 2.0 Flash → 2.5 Flash → Claude Haiku 4.5
- Key advantage: unit economics independent of token costs at scale

### 5. Self-Improving Agent Infrastructure

- OpenSpace 3-mode evolution (FIX/DERIVED/CAPTURED) over 37 skills
- AutoFix Agent Team (VPS detection → GitHub PRs, auto-merge low-risk)
- Always-Active Agent Team v3 with insights event bus, proposals, weekly self-review
- Event-driven via pgmq + pg_cron, not polling

### 6. Agency-First Positioning (Market Moat)

- Only NL/EU competitor in B2B2B AaaS model for marketing agencies
- 10-25x capital-efficient vs direct-to-SMB
- Flat monthly packs = no usage-complexity friction
- Founding Member tier + 12-month lock = early adopter commitment

### 7. Multi-Channel Clyde with Unified Memory

- Dashboard panel, Telegram, email (via n8n), Slack/WhatsApp/Discord (OpenClaw bridges)
- All channels write to same Supabase tables (`fma_conversations` + `fma_memories`)
- Cross-channel context ("je vroeg gisteren via WhatsApp...")
- Not achievable with Claude Code Channels (CLI-only) — OpenClaw bridges are the production path

### 8. Revenue Loop + Attribution Sidecar

- Revenue spike detection (1.5× 7-day avg trigger)
- `fma_content_attribution` sidecar respects READ-ONLY n8n table contract
- Weekly automated Dutch-narrative PDF client reports
- Human-minutes-saved tracking per agent activity

### 9. Dutch-Native Compliance & UX

- All content in Dutch (system prompts enforced, post-processing)
- GDPR cookie-less Lead Qualifier
- EU AI Act Article 50 disclosure in chatbot
- Legal cold-email framework (Art. 11.7 lid 3 Tw)
- Sindy brand voice as template for warmth + authority

---

## Capability Claims (for matching with website)

| Capability | Description | Evidence | Marketing-ready |
|---|---|---|---|
| **24/7 AI Marketing Employee per client (Clyde)** | Persistent AI with 4-layer memory, 17 tools, multi-channel (dashboard+Telegram) | `wiki/concepts/Clyde AI Employee.md`, `src/lib/clyde/tools.ts`, Telegram bot live | YES |
| **8-Agent Always-Active Team** | CEO/Content/Ops/SKC/Scout/RevOps/AdMgr/SEO, 110 wakes/day | `openclaw-agent-team.md`, Paperclip v0.3.1 live | YES |
| **Autonomous Content Pipeline (21-28 items/run)** | Research → SAG V14 → QSE V3 → Caption V4 → Render → Post | Pipeline live for SKC + FMai | YES |
| **5-Dimensional Quality Scoring (QSE V3)** | Brand Voice 35% / Coherence 25% / Hook 15% / Read 15% / CTA 10% | `pipeline.md`, QSE workflow `6zMSSvD28at5MXUA` | YES |
| **Multi-Platform Content (IG+LI+FB+Threads)** | Platform Adapter V2.2b routes per platform | Phase 216, CF workflow `21924KzWEm57PyWw` | YES |
| **Ad Builder (image + video, DPA + manual)** | 9-step wizard, fal.ai + Kling + Remotion, Claude Vision QA | Phases 29-38 shipped | YES |
| **Blog Factory** | 35-node WF7, research + voice + image gen | Page live `/blog-factory`, WF7 operational | PARTIAL (quality iterating) |
| **Outbound Lead Pipeline** | Vacancy scraping → Claude scoring → email gen → DHS handoff | 6 n8n workflows LIVE 2026-04-01 | PARTIAL (pre-revenue) |
| **Lead Qualifier Chatbot (embeddable)** | iframe widget, 3-tier AI routing, RAG, GDPR-compliant | Design complete phases 133-143, not yet built | NO |
| **Memory System (HOT/WARM/COLD + Decay + Dream)** | Per-client isolated pgvector with nightly consolidation | `wiki/concepts/Memory Architecture.md`, `scripts/decay-memories.mjs`, `scripts/memory-search.mjs` | YES — underused |
| **Local-First AI (Zero inference cost)** | RTX 5070 Ti serves all agents via Tailscale | `local-ai-routing.md`, ~EUR 7/mo Paperclip spend proof | YES — strong |
| **Self-Hosted n8n** | Unlimited executions EUR 15/mo vs EUR 50+/mo cloud | `n8n.future-marketing.ai`, Docker compose | YES |
| **AutoFix Agent Team** | VPS agents detect → GitHub PR → auto-merge low-risk | LIVE, E2E tested with PR #5 | YES — unique |
| **Self-Evolving Skills (OpenSpace)** | 37 skills auto-repair, derive variants, capture successes | `/opt/OpenSpace/`, MCP registered | YES |
| **n8n Agent Management (agents can fix n8n)** | 7 skills for monitor/diagnose/fix/build via MCP | LIVE 2026-03-31, health-check cron 15min | YES |
| **Multi-Tenant SaaS Command Center** | 131 migrations, RLS, Supabase Auth, Stripe, Vercel | `app.future-marketing.ai` live | YES |
| **Client Dashboard with PDF Reports** | Weekly auto-generated Dutch narrative reports | `/clients/[id]/reports`, cron Sunday 09:00 UTC | YES |
| **Revenue Loop + Attribution** | Spike trigger, content→order attribution sidecar | Migration 070, LIVE | YES |
| **Clyde Telegram Bridge** | Multi-tenant deeplink routing per client | `@FutureMarketingAI_Clyde_Bot` live, commit `2776f0a4` | YES |
| **Health Scoring Engine** | 5 sub-scores, weekly cron, Haiku recommendations | Commits 2026-04-11+, migration 103 | YES |
| **Shopify Integration** | Orders/products/customers sync, inventory intelligence | `v10.0` milestone shipped 2026-03-28 | YES |
| **Vertical Packs Pricing (EUR 997/1497/1997)** | Flat monthly, no usage meters | `aaas-strategy.md`, docs/plans | YES |
| **Agency-First Positioning** | B2B2B only, 10-25x LTV:CAC vs direct | Decision 2026-03-24, 2-alinea thesis | YES — differentiator |
| **Dutch-Native AI Content** | System prompts enforce Dutch, post-processing | `FMai/CLAUDE.md` line 35 | YES |
| **Orshot Template Rendering** | Branded carousels on-demand, multi-client | Live, `orshot-designer` skill | YES |
| **SEO/GEO/LLMEO Monitoring** | Perplexity API for AI citation tracking — USP | Masterplan complete 2026-03-28, 10 phases | PARTIAL (plan ready, not deployed) |
| **Blotato Multi-Platform Publishing** | IG/FB/TikTok/LI/X/YouTube scheduled | LIVE for SKC | YES |
| **Shot Technique Engine** | Auto-selects cinematography per scene (3-layer decision) | Phase 86 complete | YES |
| **Event-Driven DB Triggers** | 3 triggers → pgmq → OpenClaw, 10 pg_cron jobs | Always-Active v2 waves complete | YES |
| **Graphify Codebase Knowledge Graph** | 4930-node 2-hop navigation | `graphify-out/CODEBASE_MAP.md` | INTERNAL only |
| **OpenSpace MCP Tools** | execute_task, search_skills, fix_skill, upload_skill | Registered in openclaw.json | INTERNAL only |
| **Local Creative Toolchain (12 tools)** | ComfyUI, Wan2GP, XTTS, Piper, Deep-Live-Cam etc. | `local-creative-toolchain.md` | YES (build-in-public) |
| **ManyChat Conversion Funnel Tracking** | Keyword → DM → lead mapping | Phase 14 shipped | YES |
| **Storytelling Frameworks (dynamic per client)** | Config endpoint serves from `content_config_store` | Phase 2 of abundant-hopping-shamir plan | YES |
| **Client Onboarding Wizard (7 steps)** | Skip-billing, data seeding on activation | Overhaul 2026-04-15/16 | YES |
| **Notification System + Nudge Engine** | Realtime badge, contextual Clyde nudges | Phase 11 + nudge V2 | YES |

---

## Recente Wins (laatste 2 maanden, 2026-02-25 → 2026-04-19)

### Pipeline & Content

- **Multi-Client Dynamic Pipeline COMPLETE** (2026-04-16) — removed ALL hardcoded SKC values across 5 phases; FMai now runs natively (28 items/run verified, CF execution 32549)
- **PA V2.2b + FMai Content Quality Fix** (2026-04-16) — IG CTA/hashtag contamination fixed, platform_cta_config extended with hashtags/ig_cta_line/cta_slide_headline, 14 contaminated items patched
- **Scheduled Pipeline Multi-Platform COMPLETE** (2026-04-18) — 4 groups verified (fmai-ig-main/fmai-li-company × instagram/linkedin)
- **CF Pillar Bug FIXED** (2026-04-18) — duplicate `fma_clients` row with `pipeline_client_id='skc'` and 0 pillars was blocking CF; cleared via SQL UPDATE
- **7 CF workflow bugs fixed in sequence** (2026-04-15/16) — node connections, account ordering, cross-run contamination via `_sd[$execution.id]` scoping, TDZ, funnel_stage CHECK
- **QSE V2.6 deployed** — Ollama + Anthropic fallback, qwen3:14b warm at 24h keep-alive
- **Platform Adapter V2.2b** — config-driven CTAs, IG fix, slide_specs fallback
- **Quality Gate V2.1** — threads_post bypass

### Clyde & Memory

- **Clyde Memory Architecture** (v6.0 phases 104-111) + **Telegram bridge** (commit `2776f0a4`, 2026-04-15)
- **17th Clyde tool `updateClientKnowledge`** (commit `149a0f3b`, 2026-04-16) — writes directly to pipeline tables
- **fma_knowledge L1 structured context** injected into Clyde system prompt (commit `8590faac`)
- **90-day inferred memory confirmation loop** (commit `54a788d9`) — prevents stale facts
- **Weekly reflection generation** on Sunday consolidation cron (commit `5b045227`, Letta sleep-time pattern)
- **Memory ranking improvements** — FTS 10→25%, vector 50→45% for marketing keywords (commit `6a199fb6`)
- **fma_memory_embeddings** table + pgvector index (migration `20260416000000`)
- **fma_telegram_sessions** (migration `20260415200000`) — session bridge for Telegram

### SaaS Platform

- **Onboarding Overhaul** (2026-04-15/16) — 8→7 step wizard, skip_billing flag, data seeding on activation (commit `d3fc24ef`)
- **Client users can save progress + activate pipeline** (commit `eaa2c9b9`)
- **Voice profile schema match + readable knowledge rendering** (commit `a4e9cd88`)
- **Health Scoring Engine** — 5 sub-scores from real data (commits 2026-04-11+, migration 103)
- **Health UI** — refresh button, recommendations display, stale indicator (commit `848df8c4`)
- **Weekly Health Cron** (commit `4628b12a`) — Sundays 06:00 UTC
- **Nudge System V2** — Clyde avatar, dismiss/Escape, page-type isolation, wired to dashboard/analytics/content-engine/schedule/agent-team
- **Approval flow in calendar** (commit `73e744b9`) — posting pipeline gated on approval
- **Routines overhaul** — 15 bugfixes + AI-powered briefings + realtime dashboard (2026-04-16)
- **Clyde SKC subagent with isolated memory** (commit `b4c13a67`)
- **Config endpoint no rate limit** (commit `ea76427e`) — Bearer auth sufficient

### Infrastructure & Agents

- **OpenClaw updated v2026.3.23 → v2026.4.16** (2026-04-17)
- **Paperclip LIVE** (2026-04-01) — 8 agents, 11 routines, Gemini 3 Flash primary
- **Local-First AI Routing LIVE** (2026-04-07) — Tailscale mesh, OpenClaw agents primary Ollama laptop
- **Local Creative Toolchain** (2026-04-07) — 12 tools installed on RTX 5070 Ti
- **AutoFix Agent Team LIVE + E2E tested** with auto-merged PR #5 (2026-03-29)
- **OpenSpace self-evolving skill engine** installed + optimized (2026-03-28, 37 skills)
- **n8n Agent Management LIVE** (2026-03-31) — 7 skills, Error Collector, 15min health cron
- **SEO/GEO/LLMEO masterplan complete** (2026-03-28) — 10 phases, GEO via Perplexity as USP
- **Outbound Lead Pipeline LIVE** (2026-04-01) — 6 workflows, Adzuna → Haiku scoring → Sonnet email → DHS export
- **VPS Security Hardening** (2026-03-31) — OpenClaw as non-root user, Hetzner firewall, 8GB swap, Docker resource limits, daily backups
- **LLM Wiki Vault** — 44 pages at 100% coverage, graphify CODEBASE_MAP with 2-hop navigation
- **2026-04-18 migration**: agent scope field added

### Developer Tooling

- **Playwright CI reduced 60 → 40 failures** across 4 commit rounds (2026-04-19)
- **Ad Builder visual premium overhaul** (phases 34-35) — vertical step sidebar, glassmorphism, AI quality gate, multi-variant A/B
- **Token cost optimization strategy** (2026-04-09) — OpenRouter + GLM-5.1 + DeepSeek tiering

---

## Sources Reached

- Memory index + 25 topic files including MEMORY.md, active-work, pipeline, openclaw, openclaw-agent-team, infrastructure, aaas-strategy, decisions, clients/skc, always-active-agents-v2, autofix-agent-team, openspace-engine, llm-wiki-vault, local-ai-setup, local-ai-routing, n8n-agent-management, blog-factory-v1, ad-builder, lead-qualifier, client-intelligence-platform, revenue-loop, outbound-pipeline, seo-agent-phase, paperclip-setup, apify-firecrawl-strategy, claude-code-features-vs-production, claude-partner-network, fmai-content-strategy, roadmap, pipeline-handover-finetuning, telegram-shared-bot, token-cost-optimization, local-creative-toolchain, playwright-ci-fix, openclaw-docs-index, openclaw-architecture-decision, feedback
- `fma-app/CLAUDE.md`, `FMai/CLAUDE.md`, `Futuremarketingai/CLAUDE.md`
- `graphify-out/CODEBASE_MAP.md` (4930 nodes + community index)
- Obsidian vault: 6 synthesis pages (FMai Business Strategy, Content Quality Learnings, Pipeline Architecture Decisions, Clyde Memory Design, GTM Netherlands, Local Creative Toolchain), 10 concept pages (Memory Architecture, OpenClaw Agent Team, Content Engine Architecture, Clyde AI Employee, SaaS Architecture Blueprint, AaaS Product Design, Client Intelligence Platform, LLM Wiki Pattern, Sub-Workflow Architecture, Video Pipeline)
- Agency/Strategie/: Gateway Services Pricing 2026, 18 other pricing/pitch docs
- Agency/Platform/: FMai Platform State, FMai Platform Milestones, Client Intelligence Learning Platform Design
- 131 migration files (last 40 examined)
- Git log: 80 recent commits

## Sources Not Reached / Deferred

- Full graph.json (too large to parse)
- Per-community wiki files (20 named, only index consulted)
- `docs/plans/` detail files (130+ plans, only key ones referenced via memory)
- `openclaw/agents/<name>/AGENTS.md` and `SOUL.md` per agent (structure confirmed, content not read)
- Meeting notes in `Agency/Platform/Meetings/`
- Wiki entities/references/skills subpages
- `fmai-nextjs/` subproject (appears separate)
- Full `Openclaw Documentation.md` (17.646 lines, indexed only)
