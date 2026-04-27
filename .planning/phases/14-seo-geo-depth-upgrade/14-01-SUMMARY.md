---
phase: 14-seo-geo-depth-upgrade
plan: 01
subsystem: seo
tags: [schema-org, json-ld, geo, llm-citation, organization, person, wikidata, sameAs, eeat]

# Dependency graph
requires:
  - phase: 10-production-integrity-domain-ssot
    provides: Stable SITE_URL (`https://future-marketing.ai`) — every @id and sameAs URL is built from this single source.
provides:
  - Stable @id constants (ORG_ID, WEBSITE_ID, DALEY_PERSON_ID, SINDY_PERSON_ID) + page/skill helpers (pageWebPageId, skillServiceId)
  - Filtered sameAs builder (LinkedIn always, Wikidata/Twitter/KvK/YouTube/Instagram null-default — Crunchbase intentionally absent per DECISIONS Q4)
  - Reusable PersonJsonLd component (worksFor → ORG_ID by default; supports knowsAbout, image, sameAs filtering)
  - Organization schema with v10 12-skill OfferCatalog cross-referenced to ServiceJsonLd @ids (skills landed in 14-02)
  - knowsAbout 4 → 10 topical-authority items
  - foundingDate = 2024-01-01 (DECISIONS Q1)
  - ArticleJsonLd resolves Daley by @id when author matches "Daley Maat" / "Daley"
  - Perplexity baseline probe scaffold (results pending MCP-enabled agent dispatch)
affects:
  - 14-02 (consumes ORG_ID + DALEY_PERSON_ID + SINDY_PERSON_ID + PersonJsonLd component for /about + SKC case + skill ServiceJsonLd @id parity)
  - 14-03 (already merged author@id hunk into ArticleJsonLd completion commit 25c3fd3)
  - 14-04 (no direct dependency)
  - Future 14.5 (Daley Wikidata Person item)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "@id graph cross-references: Pattern `${SITE_URL}/path/#fragment` for stable, locale-agnostic entity IDs"
    - "Null-default filter: external profile URL constants typed `string | null = null`, walked through `filter((u): u is string => ...)` before emission — abandoned profiles never accidentally land in sameAs"
    - "Component-level reusable Person emitter with caller-passed @id so multiple Persons can be graph-linked from a single component file"
    - "DECISIONS-doc citation in code comments: every locked decision references `DECISIONS-2026-04-24.md Qx` so future readers can audit rationale"

key-files:
  created:
    - "fmai-nextjs/src/components/seo/PersonJsonLd.tsx (reusable Person schema emitter — Daley + Sindy + future authors)"
    - ".planning/phases/14-seo-geo-depth-upgrade/14-01-NOTES.md (Wikidata QID tracking for deferred Task 1)"
    - ".planning/phases/14-seo-geo-depth-upgrade/BASELINE-perplexity-probe-2026-04-24.md (5-probe baseline scaffold + post-deploy comparison plan)"
  modified:
    - "fmai-nextjs/src/lib/seo-config.ts (add ORG_ID, WEBSITE_ID, DALEY_PERSON_ID, SINDY_PERSON_ID, pageWebPageId, skillServiceId, WIKIDATA_URL, TWITTER_URL, KVK_URL, YOUTUBE_URL, INSTAGRAM_URL, ORG_KNOWS_ABOUT, ORG_FOUNDING_DATE, LINKEDIN_DALEY_URL, LINKEDIN_SINDY_URL — Crunchbase intentionally NOT exported)"
    - "fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx (rewrite: add @id, founder @id ref, ImageObject logo, buildSameAs() null-filter, buildOfferCatalog() with 12 skills cross-referenced to skillServiceId, knowsAbout 4→10, foundingDate constant)"
    - "fmai-nextjs/src/components/seo/ArticleJsonLd.tsx (author resolves to DALEY_PERSON_ID @id when matches 'Daley Maat'/'Daley'; otherwise inline Person fallback) — landed in 14-03 commit 25c3fd3 alongside image+publisher+mainEntityOfPage per Wave-1 collision rules"

key-decisions:
  - "WIKIDATA_URL ships as null — Task 1 needs authenticated Wikidata UI; defers to follow-up commit after 48h speedy-delete survival check (DECISIONS Q3 + RESEARCH.md sec 1)"
  - "TWITTER_URL = null by default — no abandoned profiles created purely for schema (DECISIONS Q5)"
  - "Crunchbase intentionally absent: no constant, no sameAs entry, no comment with the literal token (verification gate `grep CRUNCHBASE_URL = 0`) (DECISIONS Q4)"
  - "ORG_FOUNDING_DATE = 2024-01-01 (DECISIONS Q1 — FMai existed as agency entity before AaaS pivot)"
  - "12-skill OfferCatalog cross-references skillServiceId(`${slug}/#service`) so 14-02's ServiceJsonLd lands as the same graph entity"
  - "PersonJsonLd ships unrendered in 14-01 — Wave-2 plan 14-02 owns rendering on /about + /case-studies/skinclarity-club + matching i18n key additions (single messages/*.json owner per wave)"
  - "ArticleJsonLd author@id matches both 'Daley Maat' and 'Daley' (handles both formal full-name and short-form authoring conventions) — future authors fall through to inline Person until they get their own @id"
  - "Task 5 hunk merged into 14-03 commit 25c3fd3 by parallel agent — same file, disjoint hunks, wave-1 collision rules honored (no rework needed)"

patterns-established:
  - "Stable @id pattern: `${SITE_URL}/path/#fragment` (e.g. `https://future-marketing.ai/about/#daley`) — locale-agnostic, stable across redeploys, reusable as foreign-key in JSON-LD graph"
  - "Helper-fn @id generators: `pageWebPageId(locale, path)` and `skillServiceId(slug)` — call-site authors don't string-build URLs"
  - "Null-default external URL constants + `buildSameAs()` filter — graceful degradation when accounts/QIDs aren't ready, schema graph remains valid at every step"
  - "DECISIONS-doc cite-in-comment: every locked DECISIONS-2026-04-24.md Qx referenced in the code that depends on it"

requirements-completed: [SEO-GEO-01, SEO-GEO-02]

# Metrics
duration: 24min
completed: 2026-04-27
---

# Phase 14 Plan 01: SEO + GEO Entity Foundation Summary

**Organization JSON-LD with stable @id + filtered sameAs + 12-skill OfferCatalog cross-referenced via skillServiceId + reusable PersonJsonLd component built (rendering deferred to 14-02 per wave-1 messages-file ownership rules) + ArticleJsonLd author resolves Daley by @id**

## Performance

- **Duration:** 24 min
- **Started:** 2026-04-27T08:59:25Z
- **Completed:** 2026-04-27T09:24:14Z
- **Tasks:** 6 (Task 1 deferred per design — Wikidata UI work; Tasks 2-6 fully executed)
- **Files modified:** 3 created (PersonJsonLd.tsx, 14-01-NOTES.md, BASELINE-...md), 3 modified (seo-config.ts, OrganizationJsonLd.tsx, ArticleJsonLd.tsx)

## Accomplishments

- **Organization graph foundation:** stable `@id` (`ORG_ID = https://future-marketing.ai/#org`) + null-filtered `sameAs` (LinkedIn renders today; Wikidata/Twitter/KvK auto-add when constants flip from null) + 12-skill `OfferCatalog` cross-linked to `skillServiceId(slug)` so 14-02's ServiceJsonLd is the same entity + `knowsAbout` expanded 4 → 10 topics + `foundingDate` driven by constant (2024-01-01) + ImageObject logo with width/height for rich-results compliance.
- **PersonJsonLd component:** reusable, schema-dts-typed, accepts `id` + `name` + `jobTitle` + `description` + optional `sameAs` (null-filtered inline) + optional `knowsAbout` + optional `image` + `worksForId` (defaults to ORG_ID). Ready for 14-02 to render onto `/about` (Daley) and `/case-studies/skinclarity-club` (Sindy) without further design.
- **ArticleJsonLd author@id:** when blog author matches "Daley Maat" or "Daley", schema emits `author: { '@id': DALEY_PERSON_ID }` instead of inline Person — unifies author identity across `/about` (14-02) and blog posts. Future authors fall through to inline Person path.
- **Crunchbase explicitly absent:** zero constants, zero sameAs entries, zero literal `CRUNCHBASE_URL` token anywhere in seo-config.ts or OrganizationJsonLd.tsx. Verification gate `grep -c CRUNCHBASE_URL` returns 0 in both files.
- **v9 schema residue eliminated:** "Marketing Machine", "AI Chatbots" Strings removed from `src/components/seo/`. Verification gates return 0.
- **Wave-1 collision rule honored:** zero `messages/*.json` files modified by 14-01 commits — confirmed via `git log --name-only` audit.

## Task Commits

1. **Task 1: Wikidata item creation (deferred to async)** — `7fbd0c6` (docs) — Notes file scaffolded; FMai Wikidata UI work pending Daley account login + 48h survival check
2. **Task 2: seo-config.ts entity constants** — `190756c` (seo) — 15 new exports + 2 helper fns; CRUNCHBASE_URL = 0; Q_PLACEHOLDER = 0
3. **Task 3: OrganizationJsonLd rewrite** — `1cc5a44` (seo) — @id + buildSameAs() filter + buildOfferCatalog() with 12 skills + ImageObject logo + knowsAbout 4→10 + founder @id ref
4. **Task 4: PersonJsonLd component (new)** — `8138edb` (feat) — schema-dts-typed reusable Person emitter; tree-shaken from output until 14-02 wires it
5. **Task 5: ArticleJsonLd author@id** — `25c3fd3` (seo, merged into 14-03 commit per wave-1 collision rules — author@id hunk + 14-03's image+publisher+mainEntityOfPage hunks landed atomically in same file)
6. **Task 6: Perplexity baseline probe scaffold** — `c26f552` (docs) — 5 probes documented + post-deploy comparison plan; results dispatched to MCP-enabled agent OR Daley pre-deploy

**Plan metadata commit (final):** TBD (this SUMMARY + STATE.md + ROADMAP.md + REQUIREMENTS.md update)

## Files Created/Modified

- `fmai-nextjs/src/components/seo/PersonJsonLd.tsx` — new reusable Person JSON-LD emitter (78 lines, schema-dts-typed, JSDoc with research/audit citations)
- `fmai-nextjs/src/lib/seo-config.ts` — extended with 15 new exports (ORG_ID, WEBSITE_ID, DALEY_PERSON_ID, SINDY_PERSON_ID, pageWebPageId, skillServiceId, WIKIDATA_URL, WIKIDATA_DALEY_URL, TWITTER_URL, KVK_URL, YOUTUBE_URL, INSTAGRAM_URL, LINKEDIN_DALEY_URL, LINKEDIN_SINDY_URL, ORG_KNOWS_ABOUT, ORG_FOUNDING_DATE) + DECISIONS-2026-04-24.md citations in comments
- `fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx` — full rewrite (78 insertions / 49 deletions): added `@id`, ImageObject logo, founder@id ref, `buildSameAs()` null-filter, `buildOfferCatalog()` with 12-skill iteration over SKILLS_DATA cross-referenced via skillServiceId, knowsAbout from constant, foundingDate from constant. Removed inline founder Person duplicate, removed v9 Marketing-Machine/AI-Chatbots literals.
- `fmai-nextjs/src/components/seo/ArticleJsonLd.tsx` — added DALEY_PERSON_ID import + ternary author resolution (Daley → @id ref, else inline Person). Hunk merged with 14-03's image+publisher+mainEntityOfPage in commit 25c3fd3.
- `.planning/phases/14-seo-geo-depth-upgrade/14-01-NOTES.md` — Task 1 deferral tracker with Daley action items + speedy-delete contingency steps
- `.planning/phases/14-seo-geo-depth-upgrade/BASELINE-perplexity-probe-2026-04-24.md` — 5-probe scaffold + T+0/T+14d/T+30d/T+60d comparison plan

## Decisions Made

All decisions trace to `.planning/phases/DECISIONS-2026-04-24.md` §Phase 14:

- **Q1 (founding year):** ORG_FOUNDING_DATE = `2024-01-01` per Daley's pre-AaaS-pivot agency entity. Constant-driven so a swap to KvK-registration date is a one-line change.
- **Q2 (KvK):** KVK_URL = `null` until Daley confirms registration via `kvk.nl/zoeken`. `buildSameAs()` filter handles gracefully.
- **Q3 (Wikidata):** WIKIDATA_URL = `null` initially; Task 1 dispatches the UI work to Daley with 48h speedy-delete survival check baked into the contingency. Schema graph stays valid at every step.
- **Q4 (Crunchbase):** intentionally absent. No constant, no sameAs entry, comment rewritten to avoid the literal `CRUNCHBASE_URL` substring (so the phase-level verification gate `grep CRUNCHBASE_URL` returns 0 even on the doc comment).
- **Q5 (Twitter):** TWITTER_URL = `null` by default. Code comment cites the rule explicitly.

Additional execution decisions (not from DECISIONS doc):

- **PersonJsonLd ships unrendered:** wave-1 collision rule prohibits 14-01 from touching `messages/*.json`, so wiring + i18n key additions live entirely in wave-2 plan 14-02. PersonJsonLd is fully implemented + buildable but tree-shaken from production output until imported.
- **Author@id matches two name variants:** `'Daley Maat' || 'Daley'` to handle both formal full-name and short-form blog author conventions. The current MDX blog post uses one of these; both forms are also documented in DECISIONS Q1 sub-context.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed literal `CRUNCHBASE_URL` substring from doc comment to honor verification gate**
- **Found during:** Task 2 (seo-config.ts extension)
- **Issue:** Plan's verification gate is `grep -c CRUNCHBASE_URL fmai-nextjs/src/lib/seo-config.ts must return 0`. The plan text itself instructed me to write a comment containing the literal substring `Do NOT export a CRUNCHBASE_URL constant`, which would have made the gate return 1 (matching the comment, not a declaration).
- **Fix:** Rewrote the comment to `Do NOT export a Crunchbase profile URL constant.` — same semantic, no token match.
- **Files modified:** `fmai-nextjs/src/lib/seo-config.ts`
- **Verification:** `grep -c CRUNCHBASE_URL fmai-nextjs/src/lib/seo-config.ts` = 0
- **Committed in:** `190756c` (Task 2 commit)

### Cross-plan coordination (not deviations, documented for traceability)

**Task 5 author@id hunk merged into 14-03 commit 25c3fd3:**
- The parallel 14-03 agent (Wave 1, owns ArticleJsonLd image+publisher+mainEntityOfPage per phase README ownership table) committed the entire `ArticleJsonLd.tsx` file including my staged Task 5 author@id hunk. This is the documented wave-1 collision rule: "ArticleJsonLd.tsx (author @id ref ONLY — image+publisher belong to 14-03)" — same file, disjoint hunks, atomic merge by whichever agent commits first. 14-03's commit message explicitly co-credits my hunk: _"Co-merges 14-01's author @id reference"_. No rework needed; my Task 5 changes are in git history under commit 25c3fd3.

---

**Total deviations:** 1 auto-fixed (Rule 3 — verification-gate literal-token conflict)
**Impact on plan:** Zero scope creep. Single one-token comment edit to make the phase-level verification gate consistent with the plan's own DECISIONS Q4 directive.

## Issues Encountered

- **Build lock contention with parallel wave-1 agents:** the first `npm run build` after Task 2 returned `A previous build that didn't exit cleanly — Suggestion: Wait for the build to complete.` This is from concurrent Wave-1 agents (14-03, 14-04) running their own builds in parallel. Resolved by `sleep` + retry; build passes (88/88 SSG pages every run).
- **Pre-existing audit-08 React Compiler lint errors surfaced by `npm run build` (soft prebuild lint gate from Phase 13-03):** `Cannot create components during render`, `Cannot call impure function during render`, `require()-style imports forbidden`, `unused vars`, `unsafe any`. None caused by 14-01 changes — all pre-existing, all out of scope per Rule 4 boundary, all documented for Phase 11 strict-mode flip in `_fixme_prebuild_strict` package.json marker.

## User Setup Required

**External account work pending Daley action:**

1. **Wikidata FMai item creation** (Task 1 deferred). See `.planning/phases/14-seo-geo-depth-upgrade/14-01-NOTES.md` for step-by-step plan + speedy-delete contingency. After 48h survival check, swap `WIKIDATA_URL` constant in `seo-config.ts` from `null` to `https://www.wikidata.org/wiki/{QID}` and commit as follow-up.
2. **Daley Wikidata Person item:** optional, deferred to Phase 14.5 (per plan task 1 step 4 + DECISIONS Q3 sub-decision).
3. **KvK URL:** Daley confirms registration via `kvk.nl/zoeken`; if found, swap `KVK_URL = null` to the public KvK page URL in `seo-config.ts` and commit.
4. **Perplexity baseline probes:** 5 probes scaffolded in `BASELINE-perplexity-probe-2026-04-24.md` await execution by an MCP-enabled agent OR Daley before production deploy. Results land via follow-up commit; T+14d/T+30d/T+60d post-deploy re-runs already scheduled in the doc's comparison plan.

No environment variables to add. No dashboard configuration required for 14-01 itself (Wikidata + KvK are external account work, captured in NOTES.md).

## Next Phase Readiness

**Ready for 14-02 (Wave 2):**

- `ORG_ID`, `DALEY_PERSON_ID`, `SINDY_PERSON_ID`, `pageWebPageId`, `skillServiceId` exported and stable.
- `PersonJsonLd` component ready to render onto `/about` (Daley) + `/case-studies/skinclarity-club` (Sindy) — 14-02 imports it, passes `id` + name + jobTitle + description + sameAs (LinkedIn URLs from `seo-config.ts`) + knowsAbout (Daley-specific topical authority).
- 12-skill OfferCatalog already cross-references `skillServiceId(slug)`, so 14-02's per-skill ServiceJsonLd just needs to emit the same `@id` (`${SITE_URL}/skills/${slug}/#service`) and the graph parity holds.
- All new i18n keys (216 FAQ + about.founder.* + case_studies.skc.testimonial.author.*) consolidated under 14-02 ownership per phase README.

**Blockers / concerns for 14-02:**

- None from 14-01.
- Daley still needs to confirm `LINKEDIN_DALEY_URL` and `LINKEDIN_SINDY_URL` slug values in `seo-config.ts` (TODO comments left in code).

**Wave-1 peer plans status (reference only):**

- 14-03 (meta description trims + legal pages metadata + ArticleJsonLd image/publisher) — committed alongside, no conflicts (commit 25c3fd3 + 61629cd + 8d8cd67 + 6924661).
- 14-04 (robots.ts AI-crawler allowlist) — committed `1defd5e`; 14-04-SUMMARY landed `5455ad2`.

---

## Self-Check

- [x] `fmai-nextjs/src/lib/seo-config.ts` modified (15 new exports) — found via `grep -E "ORG_ID|DALEY_PERSON_ID|..." | wc -l` = 8
- [x] `fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx` modified (full rewrite) — `grep -c sameAs` = 3
- [x] `fmai-nextjs/src/components/seo/PersonJsonLd.tsx` created — `test -f` = exists
- [x] `fmai-nextjs/src/components/seo/ArticleJsonLd.tsx` modified (author@id) — verified in 25c3fd3 diff
- [x] `.planning/phases/14-seo-geo-depth-upgrade/14-01-NOTES.md` created — `test -f` = exists
- [x] `.planning/phases/14-seo-geo-depth-upgrade/BASELINE-perplexity-probe-2026-04-24.md` created — `test -f` = exists
- [x] Commit `7fbd0c6` exists — `git log` confirmed
- [x] Commit `190756c` exists — `git log` confirmed
- [x] Commit `1cc5a44` exists — `git log` confirmed
- [x] Commit `8138edb` exists — `git log` confirmed
- [x] Commit `25c3fd3` exists (Task 5 hunk merged by 14-03 agent) — `git log` confirmed
- [x] Commit `c26f552` exists — `git log` confirmed
- [x] Build passes — `npm run build` 88/88 SSG pages, "Compiled successfully"
- [x] No `messages/*.json` files modified by 14-01 commits — `git log --name-only` audit clean
- [x] Q_PLACEHOLDER count = 0 — verified
- [x] CRUNCHBASE_URL count in seo-config.ts = 0 — verified
- [x] CRUNCHBASE_URL count in OrganizationJsonLd.tsx = 0 — verified
- [x] "Marketing Machine" in src/components/seo/ = 0 — verified
- [x] "AI Chatbots" in src/components/seo/ = 0 — verified
- [x] sameAs in OrganizationJsonLd ≥ 1 — verified (3 occurrences: import alias, function name, schema field)

## Self-Check: PASSED

---
*Phase: 14-seo-geo-depth-upgrade*
*Completed: 2026-04-27*
