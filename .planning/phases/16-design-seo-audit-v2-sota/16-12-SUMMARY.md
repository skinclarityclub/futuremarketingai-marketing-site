---
phase: 16-design-seo-audit-v2-sota
plan: 12
subsystem: audit-conversion-psychology
tags: [cro, nielsen, cialdini, f-pattern, funnel-friction, trust-signals, scarcity, sota-cro-2026, gemini-grounded]

# Dependency graph
requires:
  - phase: 16-02
    provides: DOM snapshots 93 files in test-results/audit-v2/dom/, screenshots in test-results/audit-v2/screenshots/
  - phase: 16-05
    provides: CTA inventory + form-field inventory from 04-interactions-forms-microcopy.md
  - phase: 16-01
    provides: SOTA markers M1..M25 (especially M21..M25 conversion markers) from 00-competitive-intel.md

provides:
  - Nielsen 10-heuristic scorecard across 12 conversion-relevant routes (0/1/2 per cell, 14 of 24 weakest, 24 of 24 strongest)
  - Cialdini 7-principle scorecard (Authority + Liking strongest at 16 of 24, Reciprocity weakest at 3 of 24)
  - 2 funnel-friction maps (home to /apply 5-step, home to /contact 3-step) with drop-off hypotheses + proposed fixes
  - F-pattern hero audit across 5 highest-traffic routes (10 of 20 aggregate, center-aligned hero is dominant break)
  - 27 ranked findings (0 P0, 9 P1, 12 P2, 6 P3) with severity schema + SOTA marker links
  - Expected-lift table by finding-category (+25 to +45 percent cumulative on /apply submit volume if P1s land)
  - SOTA CRO 2026 patterns distilled to 10 named-example markers (Gemini grounded call 12 of 100)

affects: [16-15-cross-cutting-synthesis, 16-16-fix-plan, 17-cro-trust-cluster-implementation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Nielsen 10 heuristics applied as 0/1/2 scorecard across 12 routes (240 cells)"
    - "Cialdini 7 principles applied as 0/1/2 scorecard across 12 routes (168 cells)"
    - "F-pattern reading audit: 4-axis scoring (headline placement + first horizontal scan-stop + left-edge anchors + CTA position)"
    - "Funnel-friction mapping: per-step columns of friction-items + trust-artefacts + drop-off-hypothesis + proposed-fix (no code)"
    - "Expected-lift estimation per finding-category mirroring Phase 15 README style"
    - "Gemini grounded research budget tracking (call 12 of 100, SOTA CRO B2B SaaS 2026)"

key-files:
  created:
    - docs/audits/2026-05-18-v2/11-conversion-psychology.md
  modified:
    - .planning/phases/16-design-seo-audit-v2-sota/BUDGET.log

key-decisions:
  - "Top 3 P1 priorities for 16-16 fix-plan: F1 above-the-fold trust cluster (highest lift, lowest-risk), F3 apply form reduce to 4 fields step-1 (highest lift via Calendly intake refactor), F4 scarcity counter visual upgrade to hero-headline level prominence."
  - "Scarcity framing should extend beyond Founding tier: Growth/Pro/Enterprise need cohort-caps (synthetic from MAX_PARTNERS_PER_YEAR=20 until real signups fill) to remove infinite-capacity feel."
  - "Contact form should add intent-radio (Sales/Partner/Press/Support/Anders) to route inbound to correct alias and surface tier-appropriate success-copy."
  - "F-pattern break is consistent across 5 routes due to center-alignment. Decision: align with Linear (center-aligned, narrative-first) only when product-demo motion replaces decorative Spline scene. Until then, left-align hero copy."
  - "Reciprocity is the weakest Cialdini score (3 of 24). Lead magnet (Free AI Marketing Audit Template or EU AI Compliance Checklist) is the lowest-friction unlock for /memory and /blog routes."
  - "A/B test infrastructure (Vercel Edge Config + PostHog) must land before rolling out Findings 1-9 to measure actual lift vs estimate."

patterns-established:
  - "Conversion psychology audit pattern: Nielsen scorecard + Cialdini scorecard + funnel-friction map + F-pattern audit + ranked findings + expected-lift table"
  - "Gemini grounded budget-logging: 1 call per discrete SOTA-pattern surface query in BUDGET.log"
  - "Severity + marker reference inline in finding headers: '(P1, marker M23)' or '(P2, Nielsen H3)'"
  - "Cross-doc deduplication: 16-12 scopes funnel + psychology; 16-05 already covered interaction-level CTA scoring; no double-coverage"

requirements-completed: [AUDIT-V2-SOTA]

# Metrics
duration: ~35min
completed: 2026-05-19
findings_total: 27
severity_breakdown: { P0: 0, P1: 9, P2: 12, P3: 6 }
gemini_calls: 1
words: 6391
commit: 8a691ea
---

# Phase 16 Plan 12: Wave 2 Conversion Psychology + CRO Audit Summary

Conversion-relevant pages scored against Nielsen 10 heuristics and Cialdini 7 principles across 12 routes. Two primary funnels mapped step-by-step (home to /apply 5-step, home to /contact 3-step) with friction-items, trust-artefacts, drop-off hypotheses, and proposed fixes. F-pattern hero compliance audited on 5 highest-conversion routes. 27 findings ranked by severity P0..P3, mapped to SOTA markers M1..M25 from 00-competitive-intel.md. One Gemini grounded research call (call 12 of 100, BUDGET.log) surfaced SOTA CRO 2026 patterns distilled to 10 named-example markers (Notion outcome-messaging, Factors AI 2-field form, Aragon AI SOC 2 + GDPR badge stack, Betterstack TCO comparison, Storylane interactive demo, Superhuman dark-mode premium signaling).

Aggregate Nielsen score: 6.7 of 10 normalised (strong H4 consistency 24 of 24 and H2 language-match 24 of 24, weak H10 help/documentation 11 of 24 and H3 user-control 12 of 24). Aggregate Cialdini score: 4.2 of 10 normalised (strong C4 Authority 16 of 24 and C5 Liking 16 of 24, weak C1 Reciprocity 3 of 24 and C6 Scarcity 7 of 24, C7 Unity 8 of 24). F-pattern aggregate: 10 of 20 across 5 routes, center-aligned hero is the dominant break-pattern.

## Top 5 leaks ranked by expected lift on /apply submit-volume

1. No above-the-fold trust cluster on home (F1, P1, +18 to +28 percent estimated)
2. Apply form asks 9 fields including tier-selection before value-internalisation (F3, P1, +12 to +20 percent)
3. Hero scarcity counter visually de-emphasised (F4, P1, +8 to +14 percent)
4. Contact form does not segment intent (F5, P1, +5 to +9 percent)
5. No exit-intent capture, no lead magnet, no reciprocity hook (F6 + F7, P1+P2, +6 to +12 percent)

Cumulative expected lift if all P1 findings land: +25 to +45 percent on /apply submit-volume with diminishing returns past the first 4 fixes.

## Deviations from Plan

None. Plan executed as written:

- Task 1: Nielsen + Cialdini scorecards delivered for 12 routes with 0/1/2 cells and per-route + per-heuristic totals. SOTA CRO 2026 patterns surfaced via 1 Gemini grounded call (logged BUDGET.log call 12 of 100, well under the 1-call budget specified).
- Task 2: Funnel-friction maps for both primary funnels (home to /apply, home to /contact), F-pattern audit across 5 highest-conversion routes, 27 findings (>=25 required) with full severity schema, expected-lift table by category mirroring Phase 15 README style.

No checkpoint required (autonomous plan). No production-code edits (research-only invariant respected). No STATE.md edits (orchestrator-managed). Em-dash compliance: 0 occurrences in final doc (initial draft had 27 in finding headers, swept to comma-separated parenthetical format `(P1, marker M23)` for cleaner reading).

## Self-Check

- [x] docs/audits/2026-05-18-v2/11-conversion-psychology.md exists, 6391 words (>>800 required)
- [x] Nielsen 10 heuristics scorecard with 12 route columns, 0-2 cells, evidence column, per-route + per-heuristic totals
- [x] Cialdini 7 principles scorecard with 12 route columns, 0-2 cells, evidence column, per-route + per-principle totals
- [x] Funnel-friction maps for both home to /apply (5 steps) and home to /contact (3 steps) with full schema (step + friction + trust + drop-off + fix)
- [x] F-pattern hero audit across 5 highest-conversion routes with 4-axis scoring
- [x] 27 findings >= 25 required, severity breakdown P0=0, P1=9, P2=12, P3=6
- [x] Expected-lift table by finding-category with conservative cumulative estimate
- [x] SOTA CRO 2026 patterns from 1 Gemini grounded call (BUDGET.log call 12 of 100)
- [x] No em-dashes in doc (0 occurrences verified)
- [x] Canonical domain future-marketing.ai (no legacy futuremarketingai.com references)
- [x] Single atomic commit 8a691ea with exact message "docs(audit): 16-12 Wave 2 conversion psychology audit"
- [x] Commit includes docs/audits/2026-05-18-v2/11-conversion-psychology.md + BUDGET.log only
- [x] No fmai-nextjs/src/, messages/, next.config, tailwind.config edits
- [x] No STATE.md edits

## Self-Check: PASSED
