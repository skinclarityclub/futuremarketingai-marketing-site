---
title: FMai vs Competitor + SOTA Reference Side-by-Side Comparisons
phase: 16-design-seo-audit-v2-sota
plan: 16-16
canonical_domain: future-marketing.ai
created: 2026-05-19
comparison_count: 4
---

# Comparisons: FMai vs Competitor + SOTA Reference Side-by-Side Artefacts

> This directory holds side-by-side comparison documents that score FMai against the named competitors from Wave 0 (16-01) and the 3 SOTA reference SaaS marketing sites (Stripe, Linear, Vercel). Each comparison MD covers a single dimension (hero pattern, pricing layout, schema graph, founding-member positioning) across 2 to 4 reference sites. Comparisons link to relevant screenshots in `../../../fmai-nextjs/test-results/audit-v2/screenshots/` and reference scrapes captured during 16-01 (`tmp/stripe-home.md`, `tmp/linear-home.md`, `tmp/vercel-home.md`).

## Comparison index

| # | File | Dimension | Reference sites | FMai score | Notes |
|---|---|---|---|---|---|
| 1 | `01-hero-pattern.md` | Hero block: H1 + sub + primary CTA + scarcity signal | Stripe, Linear, Vercel, FMai | 3 of 5 | Spline keeper is unique brand asset, scarcity counter under-promoted |
| 2 | `02-pricing-layout.md` | Pricing page: tier-cards, comparison-table, FAQ | Stripe, Linear, Mediacooks, FMai | 4 of 5 | Workspace-priced model is SOTA-novel, lacks ROI calculator |
| 3 | `03-schema-graph.md` | JSON-LD coverage: Organization, WebSite, BreadcrumbList, FAQPage, HowTo, Speakable | Stripe, Linear, Vercel, FMai | 2 of 5 | Speakable selectors do not match DOM, @id missing |
| 4 | `04-founding-member-positioning.md` | Lifetime-deal pattern: scarcity, urgency, FOMO signals | Stripe (n/a), Linear (n/a), Mediacooks (n/a), FMai | n/a | Category-wedge: no named competitor or SOTA reference offers a comparable lifetime tier |

## How to add a new comparison

1. Pick a single dimension that is scored as part-failed or part-passed in one or more Wave 2 audit docs (16-03 through 16-14).
2. Identify 2 to 4 reference points: at least 1 competitor from 16-01 section 2 (named 7) plus at least 1 SOTA reference from 16-01 section 3 (Stripe, Linear, Vercel).
3. Create `NN-{dimension-slug}.md` in this directory.
4. Frontmatter must include: `dimension`, `reference_sites`, `fmai_score`, `source_findings` (list of finding IDs from Wave 2 docs).
5. Document body should have 3 sections minimum: (a) Side-by-side table comparing each reference on key sub-criteria, (b) FMai delta analysis, (c) Recommended fix-plan task block reference.
6. Link to relevant screenshots: FMai screenshots in `../../../fmai-nextjs/test-results/audit-v2/screenshots/{route}/`. Competitor reference scrapes only exist for Stripe/Linear/Vercel from 16-01 (other competitors had no scrape budget).
7. Update this README's index table.

## Naming conventions

- Dimension slug uses kebab-case and matches the Wave 2 audit doc topic where possible (e.g. `hero-pattern` maps to 16-03 visual-design).
- Reference site order: SOTA first (Stripe, Linear, Vercel in that order if multiple), then competitors alphabetical, then FMai last as the subject-under-comparison.
- Screenshot paths use the `_route_subroute` path format (matches Playwright spec output).

## Source dependencies

Comparisons feed off these Wave 0 + Wave 2 + Wave 3 sources, in priority order:

- `../00-competitive-intel.md` (16-01 Wave 0: 7 named competitors with positioning, 3 SOTA references with hero + schema + llms.txt analysis)
- `../14-cross-cutting-synthesis.md` (Wave 3 meta-findings + theme clusters)
- `../02-visual-design.md` (16-03 Wave 2: hero pattern, motion, palette per route)
- `../03-brand-narrative-ia.md` (16-04: IA + glossary discipline)
- `../05-seo-technical.md` (16-06: schema graph emission)
- `../06-geo-llmeo.md` (16-07: cross-LLM citation, speakable, sameAs)
- `../09-cross-browser.md` (16-10: visual parity per engine)
- `../11-conversion-psychology.md` (16-12: trust signals, scarcity, CTAs)
- `../13-competitive-cross-stack.md` (16-14: drift between site canon vs downstream surfaces)

## Update cadence

Comparisons are static deliverables for Phase 17 decision-making. They are not updated weekly. After Phase 17 execution completes (week 12 per `docs/plans/2026-05-18-design-seo-roadmap-q3.md`), the team retrospective (`PHASE-17-RETRO.md`) re-scores each comparison with post-fix deltas and archives the pre-fix version under `comparisons/archive/2026-05-18-pre-fix/`.
