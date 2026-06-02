---
phase: 03-cornerstone-content
plan: 04
subsystem: blog-content
tags: [geo, cornerstone, cluster, comparison-table, mdx]
requires:
  - "geo-generative-engine-optimization.mdx (GEO pillar, 03-01)"
  - "ComparisonTable / CtaBlock / Callout MDX components (Phase 1)"
provides:
  - "content/blog/geo-monitoring-tools-chatgpt-perplexity.mdx (CONT-04 GEO monitoring-tools cluster)"
affects:
  - "/resources hub GEO bucket (cluster surfaces under GEO pillar; back-link verified 03-07)"
tech-stack:
  added: []
  patterns:
    - "Cluster MDX mirrors GEO pillar template: block-YAML frontmatter + explicit <h2 id> anchors"
    - "ComparisonTable with string 'Deels' for non-binary/uncertain capabilities (defensible-claims, Pitfall 5)"
key-files:
  created:
    - "content/blog/geo-monitoring-tools-chatgpt-perplexity.mdx"
  modified: []
decisions:
  - "Neutral comparison (no highlightColumn) - Clyde is not a GEO-monitoring tool, so the table stays a vendor-neutral landscape view per plan Task 2"
  - "Used 'Deels' strings rather than false booleans wherever section 3 did not assert a hard capability (e.g. Semrush ChatGPT/Perplexity tracking, Profound 100+ languages) to keep every cell defensible"
  - "Columns Profound / Peec AI / Otterly / Semrush - one tool per landscape category (enterprise, enterprise-accuracy, mid-market, SEO-suite) so the table teaches the three-category model from the body"
metrics:
  duration: "~5 min"
  completed: "2026-06-02"
  tasks: 3
  files: 1
---

# Phase 3 Plan 04: GEO Monitoring Tools Cluster Summary

NL GEO-cluster `geo-monitoring-tools-chatgpt-perplexity.mdx` (CONT-04): a dated, citeable overview of the GEO-monitoring tool landscape with a vendor-neutral ComparisonTable (Profound/Peec AI/Otterly/Semrush x 9 capabilities), grounded in 03-RESEARCH section 3, linked back to the GEO pillar and the measurement cluster.

## What Shipped

- **Cluster MDX** (913 words): `clusterOf: geo-generative-engine-optimization`, `category: geo`, `schemaType: BlogPosting`, NL, author Daley Maat, dates 2026-06-02.
- **Body sections** (explicit `<h2 id>` anchors matching TOC): `waarom-geo-monitoring`, `categorieen-tools` (three-category model: enterprise meetplatforms / mid-market trackers / SEO-suites met AI-module), `de-tools-vergeleken` (ComparisonTable), `welke-tool-kiezen` (three decision questions + agency portfolio angle).
- **ComparisonTable**: columns Profound / Peec AI / Otterly / Semrush; rows ChatGPT tracking, Perplexity tracking, Google AI Overviews tracking, citatiegraad, AI share of voice, prompt-volume data, concurrentie-benchmarking, meertalig, geintegreerd met SEO-data. Dated caption "Op basis van publieke productinformatie, juni 2026." No highlightColumn.
- **Frontmatter blocks**: 4 keyTakeaways, 4-entry TOC, 5 FAQs (drives FAQPage JSON-LD), 5 citations (Profound, Peec AI, Otterly, SE Ranking, Conductor) from section 3.
- **Internal links** (in-body, locale-prefixed): GEO pillar `/nl/blog/geo-generative-engine-optimization` (twice) + measurement cluster `/nl/blog/zichtbaarheid-meten-ai-overviews`.
- **One CtaBlock** -> `/apply`, label "Plan een gesprek".

## Tasks

| Task | Name | Commit |
| ---- | ---- | ------ |
| 1+2  | Author frontmatter + body + ComparisonTable + CTA | 35a48dc |
| 3    | Build + JSON-LD proof (no file change) | n/a |

Tasks 1 and 2 both write the single new MDX file, so they landed in one atomic content commit; both verification gates passed independently (Task 1 OK; Task 2 OK 913).

## Proof

- `npm run build`: `Compiled successfully`, all 122 static pages generated, `geo-monitoring-tools-chatgpt-perplexity.html` produced for `nl`.
- JSON-LD in rendered HTML: BlogPosting/Article = true, FAQPage = true.
- ComparisonTable: exactly 1 `<table>`, wrapped in `overflow-x-auto` (mobile horizontal scroll confirmed).
- CTA: exactly one in-body CtaBlock rendering to `/nl/apply`.
- Copy gates: no em-dash (U+2014 scan passed), glossary terms honored ("merken"/"klantportfolio"/"Plan een gesprek"/"AI Marketing Medewerker" framing), canonical domain only.

## Deviations from Plan

None - plan executed exactly as written. The pre-existing repo-wide ESLint errors/warnings surfaced during `npm run build` (`@ts-ignore`, React effect rules in unrelated files) are out of scope per the scope boundary and were not touched; compilation and static generation both succeeded.

## Self-Check: PASSED

- FOUND: content/blog/geo-monitoring-tools-chatgpt-perplexity.mdx
- FOUND: commit 35a48dc
