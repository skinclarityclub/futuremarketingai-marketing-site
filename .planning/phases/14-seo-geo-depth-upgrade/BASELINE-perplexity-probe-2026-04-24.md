---
plan: 14-01
task: 6 — Perplexity baseline probe
created: 2026-04-27
purpose: Capture LLM citation baseline BEFORE Phase 14 schema upgrades propagate to AI training data + AI search engines. Compared against post-deploy probe (T+14 days, T+30 days, T+60 days) to measure citation lift from sameAs/Person/Service schema additions.
---

# Perplexity Baseline Probe — Phase 14-01

## Probe metadata

- **Run on:** 2026-04-27 (pre-Phase-14-deploy snapshot — schema changes still on `main` local, not yet deployed to production)
- **Run via:** MCP perplexity_search (parallel-agent dispatch — see status block below)
- **Production URL:** https://future-marketing.ai (Phase 10 unified domain)
- **Legacy URL still in training data:** futuremarketingai.com (301 redirects via Vercel edge since 2026-04-24)
- **Comparison plan:** re-run all 5 probes at T+14d, T+30d, T+60d after Phase 14 lands in prod. Track: domain in `citations[]` (yes/no), citation rank position, misinformation about FMai (pricing/URLs/product framing).

## Status — Probes pending parallel-agent dispatch

The 14-01 executor agent does not have the `perplexity_search` MCP tool exposed in its function inventory (tools available: Read/Write/Edit/Bash/Grep/Glob only). The 5 probes below are dispatched to Daley OR a follow-up agent with MCP access (orchestrator can spawn a sub-agent with perplexity MCP enabled).

This file's commit serves as the placeholder + dispatch contract. Probe results land in a follow-up commit (`seo(phase-14/14-01): record baseline perplexity probe results`) before Phase 14 is declared complete and well before Phase 14 deploys to production.

## Probes

### Probe 1 — Brand entity in NL

**Prompt:** `Wat is Clyde van FutureMarketingAI`

- [ ] `future-marketing.ai` in citations[]
- [ ] `futuremarketingai.com` in citations[] (legacy domain in training data)
- Top 3 citations:
  1. _TBD_
  2. _TBD_
  3. _TBD_
- Misinformation surfaced: _TBD (e.g. wrong pricing, wrong product framing, hallucinated features)_

### Probe 2 — Product category in EN

**Prompt:** `What is an AI Marketing Medewerker`

- [ ] `future-marketing.ai` in citations[]
- [ ] `futuremarketingai.com` in citations[]
- Top 3 citations:
  1. _TBD_
  2. _TBD_
  3. _TBD_
- Misinformation surfaced: _TBD_

### Probe 3 — Founder identity in EN

**Prompt:** `Who is Daley Maat founder FutureMarketingAI`

- [ ] `future-marketing.ai` in citations[]
- [ ] `futuremarketingai.com` in citations[]
- Top 3 citations:
  1. _TBD_
  2. _TBD_
  3. _TBD_
- Misinformation surfaced: _TBD_
- **NOTE:** baseline expectation = LOW or zero citations because (a) Person schema for Daley does not exist yet (Wave-2 plan 14-02), (b) Wikidata item for Daley deferred (Phase 14.5).

### Probe 4 — Pricing query in EN

**Prompt:** `FutureMarketingAI pricing tiers`

- [ ] `future-marketing.ai` in citations[]
- [ ] `futuremarketingai.com` in citations[]
- Top 3 citations:
  1. _TBD_
  2. _TBD_
  3. _TBD_
- Misinformation surfaced: _TBD (especially: chatbot v9 pricing, stale tiers — Phase 10-03 fixed this in llms.txt + chatbot, but training-data lag may still show v9)_

### Probe 5 — Case study query in EN

**Prompt:** `SkinClarity Club AI content automation case study`

- [ ] `future-marketing.ai` in citations[]
- [ ] `futuremarketingai.com` in citations[]
- Top 3 citations:
  1. _TBD_
  2. _TBD_
  3. _TBD_
- Misinformation surfaced: _TBD_
- **NOTE:** baseline expectation = LOW because Sindy Person schema not yet emitted (Wave-2 plan 14-02 wires it). Post-deploy expectation = lift after 14-02 + 14-day index window.

## Aggregated baseline metrics (TBD)

- **Probes citing future-marketing.ai (canonical):** _N_/5
- **Probes citing futuremarketingai.com (legacy in training data):** _N_/5
- **Probes citing FMai at all (canonical OR legacy):** _N_/5
- **Probes with misinformation:** _N_/5

## Post-deploy comparison checkpoints

| Date    | Checkpoint                | Run by              | Citation count target               |
| ------- | ------------------------- | ------------------- | ----------------------------------- |
| T+0     | Baseline (this doc)       | TBD parallel agent  | Snapshot only                       |
| T+14d   | First post-deploy probe   | Daley or sub-agent  | At least 1/5 cite canonical domain  |
| T+30d   | Mid-window probe          | Daley or sub-agent  | At least 2/5 cite canonical domain  |
| T+60d   | Long-window probe         | Daley or sub-agent  | At least 3/5 cite canonical domain  |

Per RESEARCH.md sec 10 + GEO research doc: AI citation lift from schema changes (sameAs + Wikidata + Person) typically materializes 14-90 days post-deploy as crawlers re-index and AI providers refresh training-data deltas.

## Citations in this baseline doc

- Plan: `.planning/phases/14-seo-geo-depth-upgrade/14-01-PLAN.md` Task 6
- Research: `.planning/phases/14-seo-geo-depth-upgrade/RESEARCH.md` sec 10
- Audit: `docs/audits/2026-04-24-full-audit/05-geo-llm-citation.md` (current GEO score 42/100, target 70+)
