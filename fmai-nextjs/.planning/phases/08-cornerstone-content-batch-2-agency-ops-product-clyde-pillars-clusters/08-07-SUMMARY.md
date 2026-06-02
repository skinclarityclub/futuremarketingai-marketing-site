---
phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters
plan: 07
subsystem: content
tags: [seo, geo, mdx, json-ld, internal-linking, cornerstone, blog]

# Dependency graph
requires:
  - phase: 08-01
    provides: "4-bucket hub (geo / ai-marketing-automation / agency-ops / product-clyde) + KennisbankTeaser per-pillar feed"
  - phase: 08-02
    provides: "Agency-ops pillar marketingbureau-schalen-met-ai with forward-links to its 3 clusters"
  - phase: 08-03
    provides: "Product/Clyde pillar ai-marketing-medewerker with forward-links to CONT-06 + its 2 clusters"
  - phase: 08-04
    provides: "Agency-ops clusters CONT-10/11 (efficiency + ROI-framework) with pillar back-links"
  - phase: 08-05
    provides: "Agency-ops proof-case cluster CONT-12 with pillar back-link"
  - phase: 08-06
    provides: "Product/Clyde clusters CONT-14/15 with pillar back-links"
provides:
  - "Bidirectional pillar<->cluster link-network proven against rendered .next HTML for all 7 batch-2 cornerstones"
  - "Cross-page proof-sweep: hub bucket placement (4 buckets), homepage teaser appearance, JSON-LD validity, one /apply CTA, no em-dash, no orphan cluster"
  - "Phase 8 keystone closed (Success Criteria 3 + 4) — batch-2 content-half fully wired"
affects: [phase-9-batch-3-skills-articles, seo-geo-kennisbank-merge]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Keystone proof-sweep validates the link-network against rendered .next HTML, not just MDX source (Phase-3 03-07 standard)"
    - "Bucket alignment asserted by comparing each cluster.category to its pillar.category"

key-files:
  created:
    - ".planning/phases/08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters/08-07-SUMMARY.md"
  modified: []

key-decisions:
  - "Keystone was verification-only: both pillars already carried complete out-links (08-02/08-03) and every cluster its back-link (08-04/05/06) — no MDX edits needed, identical outcome to 03-07"
  - "Pre-existing ESLint errors during build (ts-ignore, React 19 effect rules in unrelated component files) treated as out-of-scope: build compiled successfully and prerendered 129/129 static pages"
  - "CWV argued structurally-neutral: all 7 are static-prerendered MDX via the identical renderer/template with inlined critical CSS, no new client-JS; the 08-01 tsx edits added no client-JS"

patterns-established:
  - "Bidirectionality proven by reading the generated .next/server/app/nl/blog/<slug>.html anchors, hub buckets via .next/server/app/nl/resources.html, teaser via .next/server/app/nl.html"

requirements-completed: [CONT-16]

# Metrics
duration: 7min
completed: 2026-06-02
---

# Phase 8 Plan 07: Keystone (CONT-16) Summary

**Bidirectional pillar<->cluster link-network for all 7 batch-2 cornerstones proven against rendered .next HTML, with hub-bucket + homepage-teaser appearance, valid Article/BlogPosting + FAQPage JSON-LD, one /apply CTA each, zero em-dash and zero orphan cluster — Phase 8 closed.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-02T16:13:12Z
- **Completed:** 2026-06-02T16:20Z
- **Tasks:** 3 (all verification-only)
- **Files modified:** 0 (content); 1 SUMMARY created

## Accomplishments
- Verified both pillars OUT-link all their clusters and every cluster BACK-links its pillar — proven against rendered `.next` blog HTML, not just MDX source (Phase-3 03-07 standard).
- Cross-page invariant sweep over all 7 new cornerstones: exactly one `<CtaBlock>` + one `/apply` href each, zero U+2014 em-dash, canonical `future-marketing.ai` only, no orphan cluster (every `clusterOf` resolves to an existing `pillar: true` slug in a hub-bucket category).
- Final `npm run build` exits 0 with 129 static pages (122 prior + 7 new), no MISSING_MESSAGE; `npm run check:palette` PASS.
- Proved against rendered HTML: all 7 cornerstones appear on `/nl/resources` (agency-ops bucket: pillar + 3 clusters; product-clyde bucket: pillar + 2 clusters + CONT-06 down-link target); both new pillars appear in the homepage KennisbankTeaser; every article carries its Article/BlogPosting + FAQPage JSON-LD.

## Task Commits

All three tasks were verification-only — the upstream pillar/cluster plans had already written every out-link and back-link, so no MDX edits were required (mirrors 03-07). There are therefore no per-task code commits; the deliverable is the cross-page proof-sweep documented here, captured in the plan-metadata commit.

**Plan metadata:** see final docs commit (SUMMARY + STATE + ROADMAP + REQUIREMENTS).

## Files Created/Modified
- `.planning/phases/08-.../08-07-SUMMARY.md` — this keystone proof record (created)
- No `content/blog/*.mdx` or `src/*` changes — verification-only

## Decisions Made
- Keystone was verification-only: the bidirectional network was already complete before this plan ran (out-links from 08-02/08-03, back-links from 08-04/05/06). Same as 03-07.
- Pre-existing ESLint errors surfaced during the build (`@ts-ignore`, React-19 "setState in effect"/"refs during render" in unrelated component files) are out-of-scope per the scope boundary — they are not caused by this content-only plan and the build still compiles + prerenders 129/129 pages. Logged as a standing pre-existing-lint concern, not fixed here.
- CWV argued structurally-neutral (static-prerendered MDX, identical renderer, inline critical CSS, no new client-JS) rather than run a standalone Lighthouse pass — same reasoning as 03-07.

## Deviations from Plan

None - plan executed exactly as written. All 3 tasks were verification-only and every automated check passed on the first run.

## Issues Encountered
None blocking. The build emits a large volume of pre-existing ESLint warnings/errors from unrelated component files; these do not affect compilation or static generation (build exit 0, 129/129 pages) and are out of this plan's scope.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Phase 8 (cornerstone-content batch 2) is closed: 7 new cornerstones live with a bidirectional pillar<->cluster network filling the agency-ops + product-clyde hub-buckets.
- MERGE-STATUS: all Phase 8 work sits on `feature/seo-geo-kennisbank`, not `main`. Verify merge before treating the kennisbank as production-live.
- Deferred: batch 3 (12 skills-articles + thematic pieces man-vs-machine / toekomst-AI) noted in Roadmap Evolution as a follow-up phase.

## Self-Check: PASSED

- SUMMARY file: FOUND (`.planning/phases/08-.../08-07-SUMMARY.md`)
- Build: exit 0, 129/129 static pages, no MISSING_MESSAGE
- Palette: PASS
- All 7 cornerstones bidirectional-proven in rendered `.next` HTML
- No per-task code commits expected (verification-only plan) — none claimed

---
*Phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters*
*Completed: 2026-06-02*
