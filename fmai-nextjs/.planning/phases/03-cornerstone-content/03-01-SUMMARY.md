---
phase: 03-cornerstone-content
plan: 01
subsystem: content
tags: [mdx, geo, blog, json-ld, faqpage, next-intl, seo]

# Dependency graph
requires:
  - phase: 01-kennisbank-infrastructuur
    provides: "Shipped blog renderer (TOC/KeyTakeaways/BlogFaq/Citations + Article/FAQPage JSON-LD), MDX componentmap, explicit <h2 id> convention, block-YAML frontmatter rule"
  - phase: 02-content-pillar-spine
    provides: "fma_content_pillars geo-pillar spine; product-clyde->comparisons category mapping flag"
provides:
  - "Deepened GEO pillar-gids (content/blog/geo-generative-engine-optimization.mdx) at 1564 words"
  - "6-entry TOC, 5 keyTakeaways, 5 FAQs (FAQPage JSON-LD), 5 grounded citations"
  - "In-body hub links to the 3 GEO clusters (geo-vs-seo, zichtbaarheid-meten, monitoring-tools)"
affects: [03-02, 03-03, 03-04, 03-07, cornerstone-content, geo-cluster]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pillar deepening in place: expand existing canonical MDX rather than rewrite (keeps slug/identity stable)"
    - "In-body cross-links use locale-prefixed raw /nl/blog/<slug> (not next-intl Link) since MDX prose anchors are not auto-prefixed"
    - "Grounded GEO stats phrased softly (ongeveer/rond) and backed by citations frontmatter"

key-files:
  created:
    - ".planning/phases/03-cornerstone-content/03-01-SUMMARY.md"
  modified:
    - "content/blog/geo-generative-engine-optimization.mdx"

key-decisions:
  - "Deepened the existing GEO pillar (Open Q2 resolved: deepen, not accept-as-is) to clear the 1500-3000w bar (1564w) while preserving frontmatter title/description/author/pillar/schemaType"
  - "Added the hoe-meet-je-geo / geo-tactieken / geo-tools-landschap sections as the pillar's link-out hub to the three forthcoming GEO clusters (03-02/03/04), wiring CONT-08 from the pillar side ahead of the clusters existing"
  - "In-body cluster links use locale-prefixed /nl/blog/<slug> raw anchors (Pattern 3) so they resolve before next-intl wrapping"

patterns-established:
  - "Pillar = answer-first body + 6 <h2 id> sections matching TOC + one Callout-warning + exactly one /apply CtaBlock; frontmatter blocks never duplicated in body"
  - "JSON-LD proof = parse application/ld+json from .next static HTML, assert Article + FAQPage present, record blocks for external validators"

requirements-completed: [CONT-01]

# Metrics
duration: 14min
completed: 2026-06-02
---

# Phase 3 Plan 1: GEO Pillar Deepening Summary

**GEO pillar-gids deepened to 1564 NL words with 6-section TOC, 5 grounded FAQs/citations, and in-body links to the three GEO clusters, emitting valid Article + FAQPage JSON-LD.**

## Performance

- **Duration:** 14 min
- **Started:** 2026-06-02T12:07:36Z
- **Completed:** 2026-06-02T12:21:29Z
- **Tasks:** 3
- **Files modified:** 1 (the cornerstone MDX)

## Accomplishments
- Expanded GEO pillar frontmatter: keyTakeaways 3->5, TOC 3->6, FAQs 2->5, citations 1->5 (all grounded in 03-RESEARCH §1-§3, block-YAML, no em-dash)
- Deepened the body from ~830 to 1564 words with three new grounded sections (hoe-meet-je-geo, geo-tactieken, geo-tools-landschap) plus enriched wat-is-geo and hoe-begin-je
- Wired CONT-08 from the pillar: in-body locale-prefixed links to geo-vs-seo-waar-investeren-2026, zichtbaarheid-meten-ai-overviews, geo-monitoring-tools-chatgpt-perplexity
- Proven live: build exits 0, page statically generated for nl, Article + FAQPage JSON-LD valid (datePublished/dateModified 2026-06-02, 5 FAQ entries), all 6 TOC anchors scroll on mobile, single /apply CTA routes to /nl/apply, no heavy hero asset added (CWV neutral)

## Task Commits

Each task was committed atomically:

1. **Task 1: Expand GEO pillar frontmatter** - `a4db4b5` (content)
2. **Task 2: Deepen the body to 1500-3000 words** - `5f5d8da` (content)
3. **Task 3: Build + JSON-LD + mobile proof** - no file change (verification-only task; build + Playwright mobile proof + JSON-LD recording)

**Plan metadata:** committed with STATE/ROADMAP/REQUIREMENTS update (see final commit)

## Files Created/Modified
- `content/blog/geo-generative-engine-optimization.mdx` - GEO pillar-gids deepened to 1564 words; expanded frontmatter (TOC/takeaways/FAQ/citations) and 3 new grounded body sections with cluster cross-links
- `.planning/debug/03-01-jsonld.json` - recorded Article + FAQPage JSON-LD for external validation (gitignored)
- `.mobile-test/geo-pillar-mobile.png` - mobile full-page screenshot proof (gitignored)

## Decisions Made
- Resolved Open Question 2 (03-RESEARCH): deepened the existing GEO pillar rather than accepting it as-is, hitting 1564w (within 1500-3000) and turning it into the GEO-cluster hub. Slug/identity preserved.
- The pillar links out to the three GEO clusters that plans 03-02/03/04 will author. These targets do not exist yet; the back-links from cluster -> pillar are wired in plan 03-07 per the plan note. Forward links are intentional and will resolve once clusters ship.

## Deviations from Plan

None - plan executed exactly as written. The Task 2 word-count verify initially reported 1232 words (under the 1500 floor) because the verify strips all HTML before counting; this was expected tuning, not a deviation. I enriched two existing sections to reach 1564 words within the same task before its commit.

## Issues Encountered
- Task 2 first measured 1232 words (verify strips tags, undercounts vs prose). Resolved by expanding wat-is-geo and hoe-begin-je with grounded GEO context (paper origin, ~35-40% lift, zero-click behavior, measurement cadence, earned-media) to 1564 words, still within range.
- Mobile Playwright TOC-click was initially intercepted by the site-wide cookie-consent dialog (a chrome overlay, not an article bug). Resolved by dismissing the banner ("Alles accepteren") first; TOC then sets hash #geo-tactieken and scrolls the target into view, CTA routes to /nl/apply.

## User Setup Required

None - no external service configuration required. External JSON-LD validation (Google Rich Results Test for Article, Schema Markup Validator for FAQPage; FAQ rich result deprecated 2026 so validate syntax not appearance) can be run by pasting the recorded blocks from `.planning/debug/03-01-jsonld.json`.

## Next Phase Readiness
- GEO pillar is the live hub of the GEO cluster; plans 03-02 (geo-vs-seo), 03-03 (zichtbaarheid-meten), 03-04 (monitoring-tools) can mirror this file's structure and set clusterOf: geo-generative-engine-optimization.
- Forward in-body links from this pillar point at the 3 cluster slugs; ensure those slugs match verbatim when authoring the clusters (geo-vs-seo-waar-investeren-2026, zichtbaarheid-meten-ai-overviews, geo-monitoring-tools-chatgpt-perplexity). Back-links wired in 03-07.

## Self-Check: PASSED

- FOUND: content/blog/geo-generative-engine-optimization.mdx
- FOUND: .planning/phases/03-cornerstone-content/03-01-SUMMARY.md
- FOUND: commit a4db4b5 (Task 1)
- FOUND: commit 5f5d8da (Task 2)

---
*Phase: 03-cornerstone-content*
*Completed: 2026-06-02*
