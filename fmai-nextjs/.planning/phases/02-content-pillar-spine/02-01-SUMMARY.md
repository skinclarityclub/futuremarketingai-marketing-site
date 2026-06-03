---
phase: 02-content-pillar-spine
plan: 01
subsystem: database
tags: [supabase, content-pillars, seed-script, fma-app, cross-repo, geo, clyde]

# Dependency graph
requires:
  - phase: 01-kennisbank-infrastructuur
    provides: BLOG_CATEGORIES taxonomy (geo / ai-marketing-automation / agency-ops) that the first three pillar slugs map onto 1:1
provides:
  - 4 active fma_content_pillars rows under FMai client b7681463-cd1f-4212-87e0-c5174b3631d9, the single strategy-spine for blog + social + WF7
  - Idempotent service-role seed script fma-app/scripts/fmai-pillars-import.mjs (seeds + self-verifies + retires legacy placeholders)
  - Contract-correct PillarPromptContext.topics[] payload Phase-6 WF7 can read with zero rework
affects: [03-cornerstone-content, 04-multitenant-publishing, 06-wf7-wiring]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Cross-repo seed: planning docs in fmai-nextjs, the executable + commits + live DB write in fma-app"
    - "Lookup-with-assertion FK resolution (resolve client_id, assert organization_id equals canonical) instead of loose hardcoded constants on inserts"
    - "Reversible legacy retirement via is_active=false (never delete), since both readers filter is_active=true"

key-files:
  created:
    - "C:/Users/daley/Desktop/fma-app/scripts/fmai-pillars-import.mjs"
  modified: []

key-decisions:
  - "Deactivated (not deleted) 7 stale 2026-04-15 placeholder pillars so the FMai client carries exactly the 4-pillar spine; reversible, no schema change"
  - "account_weights set to {} per pillar; FMai account_keys unconfirmed and both readers fall back to top-level weight"
  - "product-clyde pillar uses the existing comparisons blog category for its cornerstone (pillar slug != blog category by design, no orphan cluster)"

patterns-established:
  - "Seed scripts self-verify: every run reads back and asserts the full contract, exit 1 on any failure"
  - "Idempotent legacy cleanup folded into the seed: any active non-canonical slug under the client gets deactivated"

requirements-completed: [PILR-01]

# Metrics
duration: 9min
completed: 2026-06-02
---

# Phase 02 Plan 01: FMai Content-Pillar Spine Summary

**Four contract-correct fma_content_pillars (geo, ai-marketing-automation, agency-ops, product-clyde) seeded under FMai's client in the shared fma-app Supabase, with an idempotent self-verifying seed script that also retired 7 stale legacy placeholder pillars.**

## Performance

- **Duration:** ~9 min
- **Started:** 2026-06-02T11:14:00Z
- **Completed:** 2026-06-02T11:23:00Z
- **Tasks:** 2
- **Files modified:** 1 (in fma-app)

## Accomplishments
- Authored `fma-app/scripts/fmai-pillars-import.mjs`: idempotent service-role upsert (onConflict client_id,slug) of 4 FMai pillars, with FK pair resolved via lookup-with-assertion and a self-verifying read-back block.
- Live run against the shared Supabase DB: `Found FMai client`, `Upserted 4 FMai pillars`, PASS summary of exactly 4 active rows; second consecutive run still reports exactly 4 (idempotent).
- Discovered and retired 7 pre-existing stale placeholder pillars (created 2026-04-15) that would otherwise have left the client with 11 active pillars and a broken spine.

## The Four Pillars Seeded

| slug | name (NL) | funnel_stage | weight | topics |
|------|-----------|--------------|--------|--------|
| geo | GEO | awareness | 0.35 | 4 |
| ai-marketing-automation | AI marketing automation voor bureaus | consideration | 0.30 | 3 |
| agency-ops | Agency-ops en proof | consideration | 0.20 | 3 |
| product-clyde | Clyde, jouw AI Marketing Medewerker | conversion | 0.15 | 3 |

Weights sum to 1.0. FK pair on every row: client_id `b7681463-cd1f-4212-87e0-c5174b3631d9`, organization_id `ae336ca4-41ec-442d-b8cf-0a30bb53de1c`.

## Task Commits

Committed atomically in the **fma-app** repo (branch `fix/v32-render-sota`):

1. **Task 1: Author fmai-pillars-import.mjs** - `1b0a2dab` (feat)
2. **Task 2: Live run + read-back verify + retire legacy** - `b7623bd4` (feat)

Planning docs (SUMMARY/STATE/ROADMAP/REQUIREMENTS) committed separately in the **fmai-nextjs** repo.

## Files Created/Modified
- `C:/Users/daley/Desktop/fma-app/scripts/fmai-pillars-import.mjs` - Idempotent seed of 4 FMai pillars + read-back verification + reversible legacy-pillar retirement.

## Decisions Made
- **account_weights = {}**: FMai's account_key array is unconfirmed; both live readers (`clyde/pillars.ts`, `narrative/pillars.ts`) fall back to the top-level `weight` column, so empty is the safe correct default. Did not invent account_key strings.
- **product-clyde maps to the `comparisons` blog category**: pillar slug intentionally differs from blog category id. Phase-3 cornerstone CONT-07 ("Clyde vs Jasper vs ChatGPT vs Semrush") uses the existing `comparisons` category, so every Phase-3 cluster still has a parent pillar (no orphan).
- **Reversible legacy retirement**: deactivate (is_active=false), never delete, so the 7 old rows are fully recoverable.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Retired 7 pre-existing legacy placeholder pillars**
- **Found during:** Task 2 (live run + read-back)
- **Issue:** The FMai client already carried 7 stale pillar rows created 2026-04-15 (snake_case slugs `ai_automations`, `ai_chatbots`, `ai_marketing`, `voice_agents`, `ai_personal_assistants`, `behind_the_system`, `client_results`), all with empty topics, empty account_weights, and equal 0.143 weights. After the upsert the client had 11 active pillars, so the read-back failed its must-have ("exactly 4 active rows") and the weight sum was 2.0. These rows predate the entire content-pillar-spine effort and the new kebab-case slug convention.
- **Fix:** Added Step 3b to the seed script that, after upsert, selects any active row under the FMai client whose slug is not one of the 4 canonical slugs and sets `is_active=false`. Reversible, idempotent, no schema change, no delete. Both live readers filter `is_active=true`, so they now see exactly the 4-pillar spine.
- **Files modified:** `C:/Users/daley/Desktop/fma-app/scripts/fmai-pillars-import.mjs`
- **Verification:** Live run logged `Deactivated 7 legacy pillar(s): ...`, read-back PASS at exactly 4 rows, weights sum 1.0. Second consecutive run logged `No legacy pillars to deactivate`, still PASS at 4 rows.
- **Committed in:** `b7623bd4` (Task 2 commit)

**2. [Rule 1 - Bug] Removed em-dash from a comment copied from the precedent**
- **Found during:** Task 1 (script authoring, automated verification)
- **Issue:** A comment line copied verbatim from `skc-pillars-import.mjs` contained an em-dash, violating the no-em-dash hard rule (which applies to ANY string in the file).
- **Fix:** Replaced the em-dash with a colon.
- **Files modified:** `C:/Users/daley/Desktop/fma-app/scripts/fmai-pillars-import.mjs`
- **Verification:** `node -e` em-dash scan passes (zero U+2014).
- **Committed in:** `1b0a2dab` (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both necessary for the plan's must-haves (exactly-4-active-rows and no-em-dash). The legacy retirement is the load-bearing one: without it the spine would be ambiguous for both readers and WF7. No scope creep, no schema change.

## Issues Encountered
- None beyond the legacy-pillar data state documented under Deviations. No schema gap, no missing column, no FK resolution failure.

## User Setup Required
None - no external service configuration required. The live shared Supabase DB now holds the 4 pillars.

## Next Phase Readiness
- **Phase 3 (cornerstone content):** the 4 pillar rows exist with real Phase-3 cornerstone candidate topics, so cornerstone clusters map 1:1 onto pillar slugs. FLAG: the `product-clyde` pillar's cornerstone (CONT-07) uses the `comparisons` blog category, so pillar slug != blog category by design for that one pillar; the other three slugs equal their BLOG_CATEGORIES ids exactly.
- **Phase 6 (WF7 wiring):** `prompt_context.topics[]` matches the PillarPromptContext/PillarTopic contract the fma-app readers consume; WF7 can load these with zero rework once the Phase-4 publishing prerequisite is met.
- **Phase 4 (multi-tenant publishing) remains a hard prerequisite** before FMai goes live as a publishing client (cross-publishing risk SKC vs FMai), unchanged by this plan.
- Note: the 7 legacy pillars are deactivated, not deleted; if any unexpected dependency on them surfaces, flip `is_active` back to true.

## Self-Check: PASSED

- FOUND: C:/Users/daley/Desktop/fma-app/scripts/fmai-pillars-import.mjs
- FOUND commit 1b0a2dab (Task 1, fma-app)
- FOUND commit b7623bd4 (Task 2, fma-app)
- FOUND: .planning/phases/02-content-pillar-spine/02-01-SUMMARY.md

---
*Phase: 02-content-pillar-spine*
*Completed: 2026-06-02*
