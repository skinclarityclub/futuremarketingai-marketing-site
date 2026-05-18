---
phase: 16-design-seo-audit-v2-sota
created: 2026-05-18
last_updated: 2026-05-19
status: in_progress
total_plans: 16
completed_plans: 5
---

# Phase 16 State

## Current position

Wave 2 batch 2A complete (16-03, 16-04, 16-05). 16-03 visual-design (c9d025e): 27 findings P0=2 P1=9 P2=9 P3=7, headline finding is ScrollReveal+LazySection motion-wrapper pair leaving below-fold content invisible across 8 routes × 3 locales × 5 viewports. 16-04 brand+narrative+IA (84222a2): 28 findings P0=4 P1=7 P2=8 P3=9, P0s are 4 orphan vaardigheid pages, universal breadcrumb absence, `/skills/social-media` CTA glossary violation, home H2 hierarchy. 16-05 interactions (8c6302e): 27 findings P0=0 P1=8, real validation bug found in `ApplicationForm.tsx:38-49` (workspaces-field error fallthrough renders nameMin message). Next: Wave 2 batch 2B (16-06 SEO Technical, 16-07 GEO/LLMEO, 16-08 Accessibility).

## Plans

| Plan | Status | Wave | Started | Finished | Commit |
|---|---|---|---|---|---|
| 16-01 Pre-audit intelligence | completed | 1 | 2026-05-18T12:30:00Z | 2026-05-18T12:40:00Z | a4d6b82 |
| 16-02 Setup + capture infra | completed | 1 | 2026-05-18T18:30:00Z | 2026-05-19T00:23:00Z | 5a8af29 |
| 16-03 Team 01 Visual Design | completed | 2 | 2026-05-19T00:31:00Z | 2026-05-19T00:49:00Z | c9d025e |
| 16-04 Team 02 Brand/Narrative/IA | completed | 2 | 2026-05-19T00:31:00Z | 2026-05-19T01:03:00Z | 84222a2 |
| 16-05 Team 03 Interactions | completed | 2 | 2026-05-19T00:31:00Z | 2026-05-19T00:59:00Z | 8c6302e |
| 16-06 Team 04 SEO Technical | pending | 2 | — | — | — |
| 16-07 Team 05 GEO/LLMEO | pending | 2 | — | — | — |
| 16-08 Team 06 Accessibility | pending | 2 | — | — | — |
| 16-09 Team 07 Performance | pending | 2 | — | — | — |
| 16-10 Team 08 Cross-browser | pending | 2 | — | — | — |
| 16-11 Team 09 Content/Copy/i18n | pending | 2 | — | — | — |
| 16-12 Team 10 CRO/Psychology | pending | 2 | — | — | — |
| 16-13 Team 11 Security/Privacy | pending | 2 | — | — | — |
| 16-14 Team 12 Competitive/Stack | pending | 2 | — | — | — |
| 16-15 Cross-cutting synthesis | pending | 3 | — | — | — |
| 16-16 Roadmap + bundling | pending | 4 | — | — | — |

## Budget consumed

- Gemini grounded calls: 3 / 100 (gratis tier 250 RPD)
- Firecrawl calls: 3 / 80
- WebFetch calls: 0 / 50
- Artifact disk: ~791 MB / 3 GB (test-results/audit-v2/ post-capture)
- Wall-clock: ~3h elapsed / 6h soft cap (16-01 ~10min, 16-02 ~2h50 incl. recovery from orphan-dev-server + lighthouse-chalk discovery + consolidated re-run 25 min)

## Skipped plans

(none yet)

## Notes

- Phase 16 is research-only; no production code changes allowed (success criterion 7).
- All 12 Wave-2 team-plans can run in parallel; executor caps concurrency per budget.
- Resume-protocol: read this file on restart, identify last `status: completed` plan, restart any `status: in_progress` plan from scratch.
