---
phase: 01-kennisbank-infrastructuur-afronden
plan: 02
subsystem: content
tags: [mdx, geo, json-ld, blog, next-intl, seo]

# Dependency graph
requires:
  - phase: 01-kennisbank-infrastructuur-afronden (Plan 01)
    provides: KB-01/KB-02/KB-03 shipped renderer + JSON-LD + frontmatter schema (already on branch)
provides:
  - First SKC-grade pillar article using the full frontmatter schema (keyTakeaways/faqs/citations/tableOfContents/pillar)
  - End-to-end proof that the rich renderer emits TOC, key takeaways, FAQ, citations
  - Verified Article + FAQPage JSON-LD emission from a real article
  - A real pillar to seed the /resources hub (Plan 03)
affects: [resources-hub, phase-03-cornerstone-content]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pillar MDX template: full SKC frontmatter + explicit <h2 id> anchors matching tableOfContents ids"
    - "Frontmatter list-of-objects must use block YAML (not inline flow-mapping) under @next/mdx"

key-files:
  created:
    - content/blog/geo-generative-engine-optimization.mdx
  modified: []

key-decisions:
  - "Authored headings as explicit <h2 id=\"...\"> because the repo has no rehype-slug plugin and BlogContent does not inject ids; this keeps TOC anchors resolvable without touching next.config.ts"
  - "Used block-style YAML for tableOfContents because @next/mdx ships without remark-frontmatter and parses inline { } flow-mappings as JSX expressions, breaking the build"

patterns-established:
  - "Pillar article template: complete frontmatter drives renderer blocks; body carries prose + one Callout + one /apply CtaBlock, never duplicating frontmatter-driven blocks"
  - "Frontmatter object-arrays in this repo use block YAML, never inline flow-mapping"

requirements-completed: [KB-01, KB-02, KB-03]

# Metrics
duration: ~20min
completed: 2026-06-02
---

# Phase 1 Plan 02: GEO Pillar Article Infra-Proof Summary

**Shipped a SKC-grade NL GEO pillar article using the full frontmatter schema, proving KB-01/02/03 end-to-end: rich renderer (TOC/takeaways/FAQ/citations) plus valid Article + FAQPage JSON-LD on a green build.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-06-02
- **Completed:** 2026-06-02
- **Tasks:** 3 (2 auto + 1 human-verify checkpoint)
- **Files modified:** 1 (created)

## Accomplishments
- Created `content/blog/geo-generative-engine-optimization.mdx`, the first article using the complete SKC frontmatter schema (heroImage, readTime, keyTakeaways, faqs, citations, tableOfContents, pillar, schemaType).
- Proved the rich renderer emits all four blocks (TableOfContents, KeyTakeaways, BlogFaq, Citations) and that all three TOC anchors resolve to matching heading ids.
- Proved `pillar: true` (belt-and-braces with `schemaType: "Article"`) emits Article JSON-LD, and `faqs` emits valid FAQPage JSON-LD.
- Seeded the `/resources` hub (Plan 03) with a real pillar post so it is not empty.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author SKC-grade GEO pillar article (full frontmatter)** - `fc2bb58` (content)
2. **Task 2: Build + confirm renderer and JSON-LD emit** - `c8b331d` (fix)
3. **Task 3: Human-verify rich render + validate JSON-LD** - checkpoint, verified PASS (no code commit)

**Plan metadata:** see final docs commit

## Files Created/Modified
- `content/blog/geo-generative-engine-optimization.mdx` - SKC-grade GEO pillar article. Full frontmatter drives the rich renderer; body holds NL prose across three sections with explicit `<h2 id>` anchors, one Callout, and one `/apply` CtaBlock.

## Decisions Made
- **Explicit heading ids over auto-slugging:** The repo's `next.config.ts` configures `rehypePlugins: []` (no rehype-slug) and `BlogContent` does not inject ids. Authored the body as `<h2 id="wat-is-geo">` etc. so the frontmatter `tableOfContents` anchors resolve. This avoids modifying the shipped renderer/config (out of scope for KB-01/02/03).
- **Block YAML for object arrays:** `@next/mdx` is configured without remark-frontmatter, so inline flow-mapping frontmatter (`{ id: ..., title: ..., level: 2 }`) is handed to the MDX body parser and rejected by acorn. Block-style YAML parses identically through gray-matter and builds green.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Corrected Callout prop name**
- **Found during:** Task 1 (authoring), surfaced at Task 2 (build)
- **Issue:** Plan example implied `<Callout type="info">`, but the component API uses `variant`.
- **Fix:** Changed `type` to `variant`.
- **Files modified:** content/blog/geo-generative-engine-optimization.mdx
- **Verification:** Build green, Callout renders.
- **Committed in:** `c8b331d`

**2. [Rule 3 - Blocking] Corrected CtaBlock prop names**
- **Found during:** Task 1 (authoring), surfaced at Task 2 (build)
- **Issue:** Used `description`/`buttonText`/`buttonHref`, but the component API uses `body`/`label`/`href`.
- **Fix:** Renamed props to match `CtaBlock`'s actual interface.
- **Files modified:** content/blog/geo-generative-engine-optimization.mdx
- **Verification:** Build green; CtaBlock routes to `/nl/apply`.
- **Committed in:** `fc2bb58`

**3. [Rule 3 - Blocking] Block YAML for tableOfContents frontmatter**
- **Found during:** Task 2 (build)
- **Issue:** Inline flow-mapping `tableOfContents` entries broke the Turbopack build; `@next/mdx` (no remark-frontmatter) parsed the inline `{ }` as JSX expressions ("Could not parse expression with acorn").
- **Fix:** Rewrote `tableOfContents` to block-style YAML. gray-matter parse is identical (verified TOC length 3, first entry intact).
- **Files modified:** content/blog/geo-generative-engine-optimization.mdx
- **Verification:** `npm run build` exits 0, article statically generated for `nl`.
- **Committed in:** `c8b331d`

---

**Total deviations:** 3 auto-fixed (3 blocking)
**Impact on plan:** All three were component-API/frontmatter-syntax corrections required to compile the article. No scope creep; renderer, blog.ts and next.config.ts were left untouched as the plan required.

## Issues Encountered
- Build initially failed because `@next/mdx` lacks remark-frontmatter and mis-parsed inline-flow frontmatter as JSX. Resolved by switching that frontmatter field to block YAML (deviation 3). Also confirmed early that the absence of rehype-slug meant plain markdown headings would not produce ids, so headings were authored as explicit `<h2 id>` (decision above).

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- KB-01/KB-02/KB-03 are demonstrably proven end-to-end with a real pillar article. Phase 1 success criterion 3 (rich render + valid Article + FAQPage JSON-LD) is met.
- `/resources` hub (Plan 03) now has at least one pillar post to display.
- Open concern carried from STATE: this work lives on branch `feature/seo-geo-kennisbank`, not `main` — verify merge status before declaring Phase 1 fully done.

## Self-Check: PASSED

- FOUND: content/blog/geo-generative-engine-optimization.mdx
- FOUND: .planning/phases/01-kennisbank-infrastructuur-afronden/01-02-SUMMARY.md
- FOUND commit: fc2bb58 (Task 1)
- FOUND commit: c8b331d (Task 2)

---
*Phase: 01-kennisbank-infrastructuur-afronden*
*Completed: 2026-06-02*
