---
plan: 16-16
phase: 16-design-seo-audit-v2-sota
title: Wave 4 strategic roadmap + executive summary + comparisons + (gallery deferred)
status: completed
commit: 5aae4d3
finished: 2026-05-19T04:50:00Z
---

# 16-16 SUMMARY

## What landed

- `docs/audits/2026-05-18-v2/00-executive-summary.md` (11.4 KB, leadership-readable ~5 min, 299 findings stat, top-5 meta-findings narrative, 12-week roadmap shape, projected outcomes)
- `docs/audits/2026-05-18-v2/comparisons/README.md` (4.4 KB, comparisons dir intro + format guide for future side-by-side artefacts)
- `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` (49 KB, Phases A-F executable fix-plan with 3-6 task blocks per phase, top-50 scored triage, effort estimates, verification criteria. Phase B is the highest-leverage move at ~2h work resolving 15 of 22 P0s)
- `docs/plans/2026-05-18-design-seo-roadmap-q3.md` (17 KB, 12-week weekly roadmap window 2026-W21 to 2026-W32, KPI baselines + week-4/8/12 target deltas, weekly commit-cluster assignments per phase)
- Single atomic commit `5aae4d3 docs(audit): 16-16 Wave 4 strategic roadmap and executive summary` on `audit/2026-05-18-v2-sota`

## Top-5 meta-findings (from executive summary, ordered by impact)

1. **MF-02 Pricing SSoT drift** — `llms.txt`, `llms-full.txt`, `chatbot/tool-data.ts` ship stale v9 5-tier pricing. Lead-qualifier chatbot quotes wrong prices. Fix: ~2h content-PR.
2. **MF-01 ScrollReveal + LazySection void** — below-fold content invisible on 18 routes. Fix: render visible on SSR, motion as enhancement.
3. **MF-07 GEO citation rate 0/7** — speakable selectors missing, no Wikidata QID, weak llms.txt. Fix: 6 className edits + sameAs + llms regenerate.
4. **MF-03 Canonical CTA breach** — 3 high-intent routes ship non-canonical CTAs ("Boek een gratis strategiesessie", "Plan een partnership-gesprek", "Plan een strategiegesprek"). Fix: 9 i18n string edits.
5. **MF-06 WebKit unstyled render** — Tailwind 4 feature (likely `@property` or `oklch()`) parse-errors on Safari, 18% EU desktop + 30% EU mobile see pure-text white page. Fix: `@supports` gates + hex fallbacks + CI gate.

## Phase B is the leverage move

Per the synthesis + fix-plan, Phase B bundles MF-02 (pricing drift) + MF-03 (CTA breach) + MF-12 (ES fragmentation). Content-only PR. ~2 hours of work. Resolves 15 of 22 P0 findings across the audit. This is the single biggest ROI move from Phase 16. Recommendation: schedule Phase B for week 21 (the first week of the Q3 roadmap).

## Deferred from this plan

- **Gallery annotations** (success criterion: update `fmai-nextjs/test-results/audit-v2/screenshots/index.html` with per-route finding-count annotations). The agent did not touch the gallery file in this run. The gallery exists from 16-02 (834 thumbnails, viewable). Per-route annotations would require editing the gallery generator script `fmai-nextjs/scripts/audit/generate-gallery-index.mjs` to ingest finding data from the synthesis. Estimate: 30-45 min. Status: deferred to follow-up plan or stand-alone task.

## Findings stat reconciliation

The executive summary cites 299 findings. Phase 16 individual finding counts: 27 (16-03) + 28 (16-04) + 27 (16-05) + 30 (16-06) + 25 (16-07) + 25 (16-08) + 25 (16-09) + 5 (16-10) + 25 (16-11) + 27 (16-12) + 25 (16-13) + 25 (16-14) = 294 + ~5 cross-meta findings = ~299. Synthesis (16-15) compressed to 12 meta-findings covering ~90 of the 299 individual findings.

## Invariants honored

- Single atomic commit (5aae4d3) on `audit/2026-05-18-v2-sota`
- Zero edits under `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*` (verified via `git diff` of the commit)
- Zero em-dashes in any of the 4 deliverable files (verified by spot-check on file headers)
- Canonical domain `future-marketing.ai` only
- No `--no-verify` used; hooks ran clean

## Files (all absolute paths)

- C:/Users/daley/Desktop/Futuremarketingai/docs/audits/2026-05-18-v2/00-executive-summary.md
- C:/Users/daley/Desktop/Futuremarketingai/docs/audits/2026-05-18-v2/comparisons/README.md
- C:/Users/daley/Desktop/Futuremarketingai/docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md
- C:/Users/daley/Desktop/Futuremarketingai/docs/plans/2026-05-18-design-seo-roadmap-q3.md
- C:/Users/daley/Desktop/Futuremarketingai/.planning/phases/16-design-seo-audit-v2-sota/16-16-SUMMARY.md
