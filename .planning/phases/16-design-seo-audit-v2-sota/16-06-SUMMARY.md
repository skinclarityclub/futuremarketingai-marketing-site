---
phase: 16-design-seo-audit-v2-sota
plan: 16-06
subsystem: audit-seo-technical
team: 04
wave: 2
status: completed
date: 2026-05-19
duration_min: 70
tags:
  - audit
  - seo
  - schema-org
  - jsonld
  - hreflang
  - sitemap
  - robots
  - llms-txt
  - geo
dependencies:
  requires:
    - 16-01 (SOTA rubric, markers M11..M15)
    - 16-02 (DOM snapshots in fmai-nextjs/test-results/audit-v2/dom/)
  provides:
    - 96-row metadata matrix per route x locale (actual 93, 31 routes x 3 locales)
    - 366-row JSON-LD validation per block
    - sitemap.xml + robots.ts + llms.txt audits
    - 30 ranked findings (P0..P3)
  affects:
    - 16-15 (cross-cutting synthesis, will pull P0/P1 findings)
    - 16-16 (fix-plan, will sequence 6 PR-sized fix bundles)
tech-stack:
  added:
    - none (static analysis only)
  patterns:
    - dom-snapshot static analysis (no production code touched)
    - direct-regex parse of <head> for metadata, JSON.parse for JSON-LD blocks
key-files:
  created:
    - docs/audits/2026-05-18-v2/05-seo-technical.md
  modified:
    - none
  inspected_read_only:
    - fmai-nextjs/test-results/audit-v2/dom/*.html (93 files)
    - fmai-nextjs/src/app/sitemap.ts
    - fmai-nextjs/src/app/robots.ts
    - fmai-nextjs/src/lib/seo-config.ts
    - fmai-nextjs/src/components/seo/{WebSiteJsonLd,BreadcrumbJsonLd,FaqJsonLd,ServiceJsonLd}.tsx
    - fmai-nextjs/public/llms.txt
    - fmai-nextjs/public/llms-full.txt
decisions:
  - "Use static DOM-snapshot parsing as evidence basis. Zero gemini or firecrawl calls (this plan is structure-validation, not external research)."
  - "Score 5 SEO markers (M11..M15) of the 25-marker SOTA rubric. Performance markers M16..M20 stay with 16-09."
  - "Document 30 findings (above the >=25 plan threshold). Group fixes into 6 PR-sized bundles for 16-16 sequencing."
  - "Flag llms.txt content drift (stale pricing) as P0 separate from llms.txt structure (PASS). Structure and content are independent SOTA criteria."
  - "Treat speakable cssSelector miss as P0 (rich-result blocker on 3 highest-value pages)."
metrics:
  duration_min: 70
  artefacts_read: 93 DOM snapshots + 11 source files
  api_calls_paid: 0
  api_calls_free_curl_head: 5
  disk_usage_added_kb: 0 (tmp/ gitignored)
  findings_total: 30
  findings_p0: 4
  findings_p1: 10
  findings_p2: 14
  findings_p3: 2
  routes_covered: 31
  locales_covered: 3
  jsonld_blocks_parsed: 366
  jsonld_parse_failures: 0
commit: d5fc048
---

# Phase 16 Plan 06: SEO Technical Audit Summary

SEO technical audit across 31 routes x 3 locales (93 DOM snapshots), validating per-route metadata, JSON-LD schema entities, sitemap.xml, robots.ts, and llms.txt against Google rich-result criteria and the 25-marker SOTA rubric from 16-01.

## One-liner

Static-analysis SEO audit of 93 DOM snapshots, 366 JSON-LD blocks, sitemap, robots.ts, and llms.txt, scoring 5 SEO SOTA markers and producing 30 ranked findings (4 P0, 10 P1, 14 P2, 2 P3) for the 16-16 fix-plan.

## Output

- `docs/audits/2026-05-18-v2/05-seo-technical.md` (10194 words, 30 findings)
- Single atomic commit `d5fc048 docs(audit): 16-06 Wave 2 SEO technical audit`
- 93-row metadata matrix (Route, Locale, Title length, Desc length, Canonical, Hreflang, og:image, og:locale, og:type, twitter:card, robots, Issues)
- JSON-LD validation summary (366 blocks parsed, 196 PASS, 170 WARN, 0 FAIL)
- Sitemap audit (29 entries, hreflang verified, 7 routes use deploy-time lastmod fallback)
- Robots audit (16 named AI crawlers explicit-Allow, best-in-class versus SOTA reference set)
- llms.txt audit (structure PASS, content STALE pricing)

## Top findings (executive)

- **F-01 (P0)** llms.txt and llms-full.txt content is stale: references Partner-tier 347 EUR/mo and Enterprise 7,997 EUR/mo pre-pivot pricing. Site canon since 2026-04-28 is workspace-priced Growth/Pro/Ent 499/399/299 EUR with Partner-tier removed.
- **F-02 (P0)** Speakable CSS selectors (`.speakable-hero`, `.speakable-tldr`, `.speakable-memory-def`, `.speakable-memory-layers`, `.speakable-skc-summary`, `.speakable-skc-outcome`) emitted in JSON-LD on home, memory, and SKC case do NOT exist as class names in the rendered DOM. Speakable rich result suppressed on 9 highest-value pages.
- **F-03 (P0)** `/newsletter/confirm` ships with no title, no description, no canonical, no robots:noindex. Thin utility page is index-eligible.
- **F-04 (P0)** `/logo-lab` has no canonical, no hreflang. Em-dash present in title (violates project content rule).
- **F-05 (P1)** 21 routes ship titles >70 characters (truncated in SERP, CTR loss roughly 15 to 25 percent).
- **F-06 (P1)** 12 descriptions >155 characters (truncated, mostly Spanish copy which inflates 10 to 25 percent vs NL/EN).
- **F-09..F-11 (P1)** WebSite, BreadcrumbList, FAQPage JSON-LD missing `@id`, blocking future entity-graph merges.
- **F-12 (P1)** 7 sitemap entries fall back to `new Date()` lastmod, inflating freshness signal on every deploy.

## SOTA marker scoring (5 of 25)

- **M11 Per-route unique title <=60c plus description <=155c**: PARTIAL (21 titles >70c, 12 descs >155c, 4 cross-locale dup titles)
- **M12 Per-route relevant schema.org types render**: PASS (11 distinct types, 366 blocks, 3.9 per page)
- **M13 llms.txt in canonical structure**: PARTIAL (structure PASS, content STALE pricing)
- **M14 AI crawlers explicit allowlist in robots.txt**: PASS (16 named bots, best-in-class)
- **M15 Per-locale hreflang correct**: PARTIAL (84 of 93 DOMs full, 9 utility-route DOMs missing all hreflang)

SOTA score on SEO sub-rubric: 2.6 of 5 = 52 percent.

## Fix-plan handoff for 16-16

Recommended bundling into 6 PR-sized fix groups:

1. Content sweep (4 to 6 hours): F-01, F-27 (llms refresh) + F-05, F-06, F-07, F-16, F-17, F-22, F-28 (i18n string edits).
2. JSON-LD `@id` sweep (1 to 2 hours): F-09, F-10, F-11, F-18, F-19. 5 emitter components.
3. Speakable selectors (1 hour): F-02. 6 className additions on home, memory, SKC.
4. Utility-page hygiene (1 to 2 hours): F-03, F-04, F-13, F-21.
5. Sitemap freshness (30 min): F-12. Extend PAGE_DATES.
6. Optional: F-08, F-14, F-15, F-20, F-23, F-24, F-25.

Estimated total: 12 to 16 hours focused implementation, primarily content. Zero new infrastructure.

## Deviations from plan

- Plan stated "32 routes x 3 locales = 96 rows". Actual capture (per 16-02) covered 31 routes x 3 locales = 93 rows. Matrix preserves the 93 actual rows. The missing-from-32 route is undefined in the plan source; cross-checked against `fmai-nextjs/src/app/sitemap.ts` (29 sitemap routes plus 3 noindexed utility routes = 32) and confirmed `/blog/<post-slug>` was the 32nd which is dynamic and not in the snapshot sweep.
- Plan optional: "Google Rich Results test via WebFetch for 5 highest-impact routes". Skipped: Google's rich-results endpoint requires interactive headless rendering and is not callable from server-side fetch in a reliable way without API key; static-analysis evidence is sufficient for marker scoring and the fix-plan sequencing.
- Em-dashes remain in 4 lines of the report, all inside backtick-quoted evidence strings citing the literal `Logo Lab — FutureMarketingAI` title bug (the artefact being audited). Prose em-dashes were replaced with commas/periods.

## Self-Check: PASSED

- `docs/audits/2026-05-18-v2/05-seo-technical.md`: FOUND
- Commit `d5fc048`: FOUND
- Has `## Metadata matrix`: PASS
- Has `## JSON-LD validation`: PASS
- Has `## sitemap.xml audit`: PASS
- Has `## robots.ts audit`: PASS
- Has `## llms.txt`: PASS
- Findings count: 30 (>= 25 plan threshold)
- Word count: 10194 (>= 800 plan threshold)
- Production-code changes: 0 verified (git status confirms only `?? docs/audits/2026-05-18-v2/05-seo-technical.md` before commit)
- STATE.md / BUDGET.log not touched per orchestrator delegation
