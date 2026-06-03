---
phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters
plan: 02
subsystem: content
tags: [mdx, seo, geo, json-ld, agency-ops, blog, next-intl]

# Dependency graph
requires:
  - phase: 03-cornerstone-content
    provides: "Proven MDX cornerstone renderer, ai-marketing-automation-voor-bureaus.mdx pillar template, Article+FAQPage JSON-LD chain, /resources hub buckets"
  - phase: 02-content-pillar-spine
    provides: "agency-ops pillar slot in the 4-pillar spine + hub bucket"
provides:
  - "CONT-09: NL agency-ops pillargids content/blog/marketingbureau-schalen-met-ai.mdx (pillar:true, category agency-ops, schemaType Article)"
  - "AI-first operating-model framing for the agency-ops hub: break the linear revenue-headcount relation, human-in-the-loop"
  - "Forward-links to the 3 agency-ops clusters (CONT-10/11/12) that those plans wire their back-links to"
affects: [08-03, 08-04, 08-05, 08-07]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Agency-ops pillar mirrors the ai-marketing-automation pillar shape verbatim (block-YAML frontmatter, explicit <h2 id> sections, single closing CtaBlock)"
    - "Market stats phrased softly (ongeveer/rond) + cited as market context, never as FMai/SKC own results"

key-files:
  created:
    - "content/blog/marketingbureau-schalen-met-ai.mdx"
  modified: []

key-decisions:
  - "Frontmatter + body authored in a single file write; Tasks 1+2 committed as one content commit (single-file deliverable, splitting one write into two commits would be artificial). Task 3 was verification-only, no source mutation."
  - "AI-first operating-model angle (08-RESEARCH winning angle) over a tool-list framing: the pillar defines a scaling framework, not a product pitch."
  - "Market stats (~72% NL AI-adoption, ~54% knowledge barrier, AI-first efficiency claims) cited as market context with soft phrasing; SKC told via Sindy as operator only, no invented metrics."
  - "Pricing kept conceptual (werkruimte-geprijsd) with a /nl/pricing deeplink, no hardcoded tariffs (pricing-data.ts SSoT)."

patterns-established:
  - "Pillar -> cluster forward-links: 3 locale-prefixed /nl/blog/<slug> raw links to CONT-10/11/12 + 1 sibling-pillar link to ai-marketing-automation-voor-bureaus"

requirements-completed: [CONT-09]

# Metrics
duration: 7min
completed: 2026-06-02
---

# Phase 8 Plan 02: Agency-ops pillargids (marketingbureau schalen met AI) Summary

**NL agency-ops pillargids (1895w) framing agency scaling as an AI-first operating model that breaks the linear revenue-headcount relation, with valid Article + FAQPage JSON-LD, one /apply CTA, and forward-links to the 3 agency-ops clusters.**

## Performance

- **Duration:** 7 min
- **Started:** 2026-06-02T15:36:53Z
- **Completed:** 2026-06-02T15:44:00Z
- **Tasks:** 3 (Task 3 verification-only)
- **Files modified:** 1 created

## Accomplishments
- Authored `content/blog/marketingbureau-schalen-met-ai.mdx` (CONT-09): pillar:true, category agency-ops, schemaType Article, 1895 words across 6 explicit `<h2 id>` sections matching the tableOfContents ids.
- AI-first operating-model framing per 08-RESEARCH: het schaalprobleem (lineaire omzet-headcount-relatie), operating model, welk werk AI overneemt, human-in-the-loop, resultaat meten met een framework, hoe begin je.
- Build passes (123 static pages, +1 vs Phase 3's 122); Article + FAQPage (5 valid Q&A) JSON-LD emitted and parse-valid in generated HTML; no parse errors.
- Exactly one in-body CtaBlock to /apply (renders /nl/apply); forward-links to CONT-10/11/12 + sibling automation pillar all present in rendered HTML; hub appearance confirmed under the agency-ops bucket.
- No em-dashes (U+2014) in source or rendered body; glossary terms honored; SKC via Sindy as operator only; market stats softly phrased + cited.

## Task Commits

1. **Task 1 + Task 2: Author full frontmatter + 1500-3000w body** - `6503be9` (content)
   - Both authored in one file write; both automated verifies passed (frontmatter: pillar/agency-ops/Article/5 FAQs/6 TOC/5 citations/no em-dash; body: 1895w, 1 CtaBlock, 1 /apply, all anchors resolve, all 3 cluster links present).
3. **Task 3: Build + JSON-LD + mobile proof** - verification-only, no source mutation (no commit).

**Plan metadata:** (this SUMMARY + STATE + ROADMAP + REQUIREMENTS) committed separately.

## Files Created/Modified
- `content/blog/marketingbureau-schalen-met-ai.mdx` - CONT-09 agency-ops pillargids; drives the hub agency-ops bucket and the 3-cluster forward-link spine.

## Decisions Made
- Single-write authoring → one content commit for Tasks 1+2 (single-file deliverable; artificial to split one write into two commits). Per-task verifies still run independently and both passed.
- AI-first operating-model angle over tool-list (08-RESEARCH winning angle).
- Market stats cited softly as market context, never as FMai/SKC own results; SKC via Sindy as operator; conceptual werkruimte-geprijsd pricing + /nl/pricing deeplink (no hardcoded tariffs).

## Deviations from Plan
None - plan executed exactly as written. (The two authoring tasks target the same single file and were written in one pass, so Task 1+2 share one commit; this is a commit-granularity choice, not a content deviation. All verifies pass.)

## Issues Encountered
- `npm run build` surfaces many pre-existing repo-wide ESLint errors/warnings (ts-ignore, setState-in-effect) in unrelated files. These are out of scope (not caused by this content-only task) and do NOT block the build; `npm run build` compiled successfully and generated all 123 static pages. Per CLAUDE.md the build is the de-facto integration test and it passed.

## External Validation (deferred-to-human, Phase-3 precedent)
- JSON-LD parse-validity confirmed in generated `.next` HTML (Article on pillar, FAQPage with 5 Q&A, no parse errors). External Google Rich Results Test (Article) + Schema Markup Validator (FAQPage syntax; FAQ rich result deprecated 2026) require a live/deployed URL.
- Mobile rendering inherits the Phase-3 mobile proof: identical static-prerendered MDX renderer/template, no new client-JS or assets. CWV neutral (reuses /og-image.png, no heavy hero added).

## Next Phase Readiness
- The 3 agency-ops cluster plans (CONT-10/11/12) can be authored next; their back-links target this pillar slug `marketingbureau-schalen-met-ai`, which is live and hub-visible. The forward-links from this pillar will resolve as those clusters ship.
- Sluitsteen 08-07 (CONT-16) will prove bidirectional pillar<->cluster links + homepage teaser wiring across both pillars once batch 2 content is complete.

## Self-Check: PASSED
- FOUND: content/blog/marketingbureau-schalen-met-ai.mdx
- FOUND: commit 6503be9

---
*Phase: 08-cornerstone-content-batch-2-agency-ops-product-clyde-pillars-clusters*
*Completed: 2026-06-02*
