---
phase: 12-brand-copy-polish
plan: 02
subsystem: i18n
tags: [next-intl, i18n, pricing, brand-glossary, typescript]

requires:
  - phase: 01-website-rebrand
    provides: skills-data.ts mirror of fma-app pricing SSoT
  - phase: 07-website-copy-overhaul
    provides: pricing.matrix.* baseline namespace in NL/EN/ES
provides:
  - SkillTierCap interface with unit + labelKey fields (i18n-driven label rendering)
  - 5 new pricing.matrix.* keys per locale (15 total) with {count} interpolation
  - SkillsTierMatrix + SkillPageTemplate render via i18n dispatch on labelKey/unit
  - skills-data.ts NL-clean (zero EN labels, zero em-dashes, zero "brand voice")
affects: [12-03-hardcoded-en-strings, 12-04-glossary-interpolation, phase-13]

tech-stack:
  added: []
  patterns:
    - i18n labelKey enum literal type for typo-safe i18n key references
    - Unit-based render dispatch (count|min|dm) for localized numeric caps
    - Mirror-then-i18n pattern: numeric truth in skills-data.ts, label truth in messages/

key-files:
  created:
    - fmai-nextjs/scripts/capture-tier-matrix.mjs
  modified:
    - fmai-nextjs/src/lib/skills-data.ts
    - fmai-nextjs/src/components/pricing/SkillsTierMatrix.tsx
    - fmai-nextjs/src/components/skills/SkillPageTemplate.tsx
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/es.json

key-decisions:
  - "labelKey as TypeScript enum literal type (4 values) prevents typos and keeps i18n key references discoverable in IDE"
  - "addOn47/addOn97 as dedicated keys (not interpolated) because only 2 skills use them; simpler than template + price arg"
  - "NL notAvailable changed from em-dash to middle dot for consistency with EN/ES and to comply with no-em-dash brand rule"
  - "SkillPageTemplate updated alongside SkillsTierMatrix (Rule 3 deviation: blocking type errors otherwise) to keep build green"
  - "JSDoc em-dashes also stripped to satisfy strict zero-em-dash verify on whole file"

patterns-established:
  - "Pattern: i18n dispatch via labelKey + unit — data layer carries semantic intent, render layer carries locale-specific text"
  - "Pattern: when extending discriminated tier-cap shapes, audit ALL consumers (not just one named in plan) before tsc to catch other call sites"

requirements-completed: [WEB-01]

duration: 16min
completed: 2026-04-25
---

# Phase 12 Plan 02: skills-data.ts i18n Refactor Summary

**Tier-matrix labels migrated from 16 hardcoded English strings into typed labelKey + unit fields routed through pricing.matrix.* i18n namespace; 9 em-dashes and 6 'brand voice' slips swept from skills-data.ts in the same pass.**

## Performance

- **Duration:** 16 min
- **Started:** 2026-04-25T05:22:55Z
- **Completed:** 2026-04-25T05:38:32Z
- **Tasks:** 6
- **Files modified:** 6 (1 created, 5 modified)

## Accomplishments

- SkillTierCap shape extended: `unit?: 'count' | 'min' | 'dm'` + `labelKey?: 'addOn47' | 'addOn97' | 'notAvailable' | 'unlimited'`. Old `label?: string` removed entirely.
- 16 hardcoded English label strings in skills-data.ts replaced with type-safe `unit` or `labelKey` references across 6 skills (Blog Factory, Ad Creator, Reel Builder, Voice Agent, Email Management, ManyChat DM).
- 9 em-dashes (—) in user-facing skill descriptions replaced with komma/punt/dubbele punt; 3 additional em-dashes in JSDoc comments stripped for strict whole-file compliance.
- 6 occurrences of "brand voice" replaced with "merkstem" (Dutch glossary). Note: plan listed 5 sites, but the longDescription on social-media also contained the slip — auto-fixed under Rule 1.
- 15 new i18n keys landed across NL/EN/ES with `{count}` ICU interpolation (5 per locale × 3 locales): `addOn47`, `addOn97`, `minPerMonth`, `dmsPerMonth`, `itemsPerMonth`. Key-set parity verified via `jq | diff`.
- SkillsTierMatrix.renderCap rewritten to dispatch on labelKey first, then unit (with t() interpolation for the `{count}` template). SkillPageTemplate.formatCap mirrored for consistency.
- NL notAvailable cell value changed from em-dash to middle dot ("·") matching EN/ES — this also closes the audit's separate em-dash-in-i18n flag.
- Production build green (`npm run build` compiled successfully, all 87 static pages prerendered).

## Task Commits

Each task was committed atomically against the working tree:

1. **Task 1: Extend SkillTierCap interface** — `58c7908` (refactor)
2. **Task 2: Migrate 16 tierCaps labels to unit/labelKey** — `a4ce35a` (refactor)
3. **Task 3: Strip em-dashes + brand voice slips** — `e785523` (content)
4. **Task 4: Add 5 pricing.matrix.* keys per locale** — `4869c82` (feat)
5. **Task 5: Update SkillsTierMatrix + SkillPageTemplate render dispatch** — `2d3b280` (feat)
6. **Task 6: Add Playwright capture script (browser screenshots deferred)** — `5a86015` (chore)

**Plan metadata commit:** trailing commit covers SUMMARY + STATE + ROADMAP updates.

## Files Created/Modified

- `fmai-nextjs/src/lib/skills-data.ts` — interface extension + 16 label migrations + 12 em-dash/brand-voice rewrites; net delta is i18n-cleaner data layer
- `fmai-nextjs/src/components/pricing/SkillsTierMatrix.tsx` — renderCap signature now takes `t` instead of bag-of-strings; labelKey/unit dispatch added
- `fmai-nextjs/src/components/skills/SkillPageTemplate.tsx` — formatCap mirrored to same dispatch shape (Rule 3 deviation)
- `fmai-nextjs/messages/nl.json` — pricing.matrix gained 5 keys; notAvailable em-dash → middle dot
- `fmai-nextjs/messages/en.json` — pricing.matrix gained 5 keys
- `fmai-nextjs/messages/es.json` — pricing.matrix gained 5 keys
- `fmai-nextjs/scripts/capture-tier-matrix.mjs` — Playwright screenshot helper for verifier sweep

## Decisions Made

- **labelKey as TypeScript enum literal type**: 4 enum values (`'addOn47' | 'addOn97' | 'notAvailable' | 'unlimited'`) instead of `string` — IDE autocomplete + compile-time typo prevention. Same shape used in SkillsTierMatrix tone mapping.
- **addOn47/addOn97 as dedicated keys**: Plan suggested either "single addOn key with price interpolation" or "dedicated keys per price". Chose dedicated because only 2 skills use add-on prices; price-interpolation template would add complexity for no flexibility win.
- **NL notAvailable → middle dot**: Existing NL value was em-dash (—). EN and ES were already middle dot (·). Standardizing on middle dot has dual benefit: (1) matches no-em-dash brand rule, (2) gives identical visual character across locales for the "this skill is not in this tier" cell.
- **JSDoc em-dashes stripped**: Plan's verify command (`grep -c '—'` returning zero) is whole-file scope. Stripped 3 JSDoc em-dashes too. They're not user-facing but cost nothing to remove and unlocks the strict verify.
- **SkillPageTemplate.formatCap updated alongside the named target**: Plan only named SkillsTierMatrix, but SkillPageTemplate consumes the same `cap.label` shape and would have broken tsc after Task 1. Fixed under Rule 3 (blocking issue).
- **Browser screenshot capture deferred**: Both candidate dev ports (3000, 3001) were occupied by other running dev servers from prior sessions. Per global safety rule (NEVER kill user terminals), I did not free them. The capture script is committed for the Phase 12 verifier to run cleanly.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Sixth "brand voice" occurrence in social-media longDescription**
- **Found during:** Task 3 (em-dash + brand voice rewrites)
- **Issue:** Plan listed 5 "brand voice" sites (lines 50, 54, 72, 78, 226). The social-media skill's longDescription (line 52) also contained "in de juiste brand voice" — same slip, not in the plan's table.
- **Fix:** Replaced with "in de juiste merkstem" matching the same rewrite applied on the shortDescription
- **Files modified:** fmai-nextjs/src/lib/skills-data.ts
- **Verification:** `grep -ci "brand voice"` returns 0 across whole file
- **Committed in:** e785523 (Task 3 commit)

**2. [Rule 3 - Blocking] SkillPageTemplate.tsx still consumed cap.label after Task 1**
- **Found during:** Task 5 (SkillsTierMatrix update)
- **Issue:** After Task 1 removed `label?: string` from SkillTierCap, `npx tsc --noEmit` reported 6 errors total: 4 in SkillsTierMatrix.tsx (planned target) and 2 in SkillPageTemplate.tsx (not in plan). SkillPageTemplate.formatCap accessed `cap.label` on lines 47-48 and would fail to compile / would render `undefined` at runtime.
- **Fix:** Mirrored the same labelKey + unit dispatch into formatCap. Updated the call site to pass tMatrix instead of an inflated `matrixLabels` bag-of-strings.
- **Files modified:** fmai-nextjs/src/components/skills/SkillPageTemplate.tsx
- **Verification:** `npx tsc --noEmit` returns zero errors; `npm run build` compiles successfully
- **Committed in:** 2d3b280 (Task 5 commit)

**3. [Rule 1 - Brand glossary] NL notAvailable was em-dash in i18n value**
- **Found during:** Task 4 (extending pricing.matrix in NL)
- **Issue:** Existing NL `notAvailable: "—"` predates the no-em-dash rule. EN and ES already used middle dot. The em-dash renders to users in every "tier does not have this skill" cell on /nl/pricing.
- **Fix:** Changed NL notAvailable to "·" (middle dot) matching EN/ES.
- **Files modified:** fmai-nextjs/messages/nl.json
- **Verification:** all 3 locales now render the same character; satisfies no-em-dash rule for user-facing copy
- **Committed in:** 4869c82 (Task 4 commit)

### Deferred Items

**Task 6 browser screenshot capture deferred to verifier**
- **Reason:** Both candidate dev ports (3000, 3001) were occupied: port 3000 by the **fma-app** SaaS project's dev server, port 3001 by a stale fmai-nextjs dev server in 500-error state. Production-server fallback (`next start -p 3012`) failed because the running dev process held a lock on `.next/`. Per global rule (NEVER kill user terminals), I did not free these ports.
- **Impact:** Plan verification at the data + render layer is complete and deterministic (TS check, jq parity, grep counts). Visual screenshots are an artifact for the Phase 12 verifier sweep, not a hard verify gate.
- **Mitigation:** scripts/capture-tier-matrix.mjs committed with usage instructions. Verifier can run `npm run dev` on a clean port and execute the script to produce the 3 screenshots.

---

**Total deviations:** 3 auto-fixed (1 bug, 1 blocking, 1 brand-glossary) + 1 deferred item (visual capture)
**Impact on plan:** All auto-fixes were necessary for build correctness or brand-rule compliance. No scope creep — every change either fulfilled a plan must-have or was direct collateral of one. Visual capture deferral is environmental (port conflicts) not implementation-related; the verifier can produce it from the committed script in any clean session.

## Issues Encountered

- Two parallel dev servers locked the local environment, blocking screenshot capture. Resolved by deferring captures to verifier and committing the helper script.
- Plan-12-01 was running in parallel and committing ahead of me on disjoint files (CookieConsentBanner, error.tsx, palette migration). No git conflicts arose because file boundaries held: 12-01 never touched skills-data.ts, SkillsTierMatrix.tsx, SkillPageTemplate.tsx, or pricing.matrix.* keys.

## Verification Evidence

```
=== TypeScript ===
npx tsc --noEmit  →  zero errors

=== skills-data.ts cleanliness ===
grep -c "label: '" src/lib/skills-data.ts   →  0
grep -ci "brand voice" src/lib/skills-data.ts →  0
grep -c '—' src/lib/skills-data.ts          →  0

=== i18n parity ===
diff <(jq -r '.pricing.matrix | keys | .[]' messages/nl.json | sort) \
     <(jq -r '.pricing.matrix | keys | .[]' messages/en.json | sort)  →  identical
diff <(jq -r '.pricing.matrix | keys | .[]' messages/en.json | sort) \
     <(jq -r '.pricing.matrix | keys | .[]' messages/es.json | sort)  →  identical
14 keys per locale: addOn, addOn47, addOn97, dmsPerMonth, fairUse,
  itemsPerMonth, legend, minPerMonth, notAvailable, perMonth,
  skillHeader, subtitle, title, unlimited

=== Production build ===
npm run build  →  ✓ Compiled successfully in 7.1s
                  ✓ Generating static pages using 15 workers (87/87) in 1551ms
```

## User Setup Required

None — no external service configuration required. All work is in-repo i18n + render-logic refactor.

## Next Phase Readiness

- **12-03 unblocked**: my changes added pricing.matrix.* keys without removing any. 12-03 will modify header.* / common.comingSoon / chat.* on different code paths and JSON namespaces. Sequential ordering enforced by orchestrator should yield clean merges.
- **12-04 unblocked**: pricing.matrix namespace is now the canonical seed for further matrix-related copy work.
- **Verifier ready**: scripts/capture-tier-matrix.mjs allows the Phase 12 verifier to do visual diffs against /nl/pricing, /en/pricing, /es/pricing tier-matrix sections in any clean dev session.

## Self-Check: PASSED

Verifying every claim in this SUMMARY against disk and git:

```
[ ] commits exist:
  58c7908 (Task 1)  → FOUND
  a4ce35a (Task 2)  → FOUND
  e785523 (Task 3)  → FOUND
  4869c82 (Task 4)  → FOUND
  2d3b280 (Task 5)  → FOUND
  5a86015 (Task 6)  → FOUND

[ ] files modified exist:
  fmai-nextjs/src/lib/skills-data.ts                          → FOUND
  fmai-nextjs/src/components/pricing/SkillsTierMatrix.tsx     → FOUND
  fmai-nextjs/src/components/skills/SkillPageTemplate.tsx     → FOUND
  fmai-nextjs/messages/nl.json                                → FOUND
  fmai-nextjs/messages/en.json                                → FOUND
  fmai-nextjs/messages/es.json                                → FOUND
  fmai-nextjs/scripts/capture-tier-matrix.mjs                 → FOUND
```

---
*Phase: 12-brand-copy-polish*
*Completed: 2026-04-25*
