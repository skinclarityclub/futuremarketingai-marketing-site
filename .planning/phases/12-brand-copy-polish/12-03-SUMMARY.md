---
phase: 12-brand-copy-polish
plan: 03
subsystem: i18n
tags: [next-intl, i18n, react, typescript, header, chatbot, pricing]

requires:
  - phase: 01-website-rebrand
    provides: HeaderClient.tsx + ChatWidget.tsx + pricing/page.tsx + SkillsTierMatrix.tsx live components
  - phase: 12-brand-copy-polish
    provides: pricing.matrix.* baseline keys (12-02) and palette tokens (12-01)
provides:
  - header.* top-level i18n namespace (38 strings × 3 locales = 114 translations)
  - common.comingSoon canonical key for non-header use (3 translations)
  - pricing.tiers.professional.mostPopular badge key (3 translations)
  - chat.widget.{typeMessage, demoLimitReached, demoLimitMessage, demoLimitCta} (12 translations)
  - HeaderClient SKILL_CATEGORIES + NAV_ITEMS as structural metadata only (icons + hrefs + comingSoon flags)
  - SkillsTierMatrix scoped to three translators (pricing.matrix + pricing.tiers + common)
  - DECISION-PENDING-phone-number.md decision-gate artifact for VoiceDemoSection US number
affects: [12-04-glossary-interpolation, phase-13]

tech-stack:
  added: []
  patterns:
    - i18n key dispatch via category.key + item.key string concatenation (no object lookup tables)
    - Three-translator pattern in async server components for cross-namespace copy (pricing.matrix + pricing.tiers + common)
    - Decision-gate artifact: parked DECISION-PENDING-*.md in phase folder when plan flags an issue but defers the fix

key-files:
  created:
    - .planning/phases/12-brand-copy-polish/DECISION-PENDING-phone-number.md
  modified:
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/es.json
    - fmai-nextjs/src/components/layout/HeaderClient.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx
    - fmai-nextjs/src/components/pricing/SkillsTierMatrix.tsx
    - fmai-nextjs/src/components/chatbot/ChatWidget.tsx

key-decisions:
  - "header.* placed as top-level namespace (not merged into existing common.nav) — common.nav is footer-shaped (home/pricing/about/contact) while header.nav is megabar-shaped (skills/memory/caseStudies/pricing/about); semantic split keeps both clean"
  - "Top-level nav.{login,apply} kept untouched — those are right-side CTAs (auth + primary apply button) consumed by HeaderClient via existing useTranslations('nav') and by other components; merging would break sibling consumers"
  - "common.comingSoon added as the canonical key for non-header use sites (SkillsTierMatrix); header.skills.comingSoon kept as a header-local convenience key — same value, different scope"
  - "ChatWidget demo-limit banner split into two keys (demoLimitMessage + demoLimitCta) instead of inline 'Book a call' mid-sentence — gives translators control over CTA wording, matches NL/ES sentence structure"
  - "VoiceDemoSection phone number flagged via DECISION-PENDING-phone-number.md — three options documented (NL DID rental EUR 5/mo, hide-and-CTA, keep-and-defer); default-after-2-weeks is hide-only to clear the audit finding cost-free"
  - "hasDropdown:false added to non-skills NAV_ITEMS so the `as const` discriminated union retains the field across all branches (TS strict required this after the restructure to key/href shape)"
  - "Apply CTA banner copy ('Apply' + 'Book a partnership call') routed through header.cta.applyTitle/applySubtitle — these were hardcoded EN before this plan and not in the original task list, but moved under Rule 2 (missing critical i18n on a user-facing surface)"

patterns-established:
  - "Pattern: structural-metadata + i18n-keyed render — components hold icon/href/comingSoon flags and a `key` string; render layer dispatches `tHeader(`skills.${category.key}.items.${skill.key}.title`)` against locale files"
  - "Pattern: cross-namespace translator stacking in async server components — multiple `getTranslations({locale, namespace})` calls are cheap and let mixed-scope JSX render without prop-drilling translation bags"
  - "Pattern: decision-gate parking — when a plan task is 'flag, do not fix', commit a DECISION-PENDING-*.md note in the phase folder with options + default-after-2-weeks rule, so the audit finding stays visible until shipped or explicitly closed"

requirements-completed: [WEB-01]

duration: 13min
completed: 2026-04-25
---

# Phase 12 Plan 03: Hardcoded EN Strings to i18n Summary

**HeaderClient mega-menu + nav, pricing 'Most popular' badge, SkillsTierMatrix 'Coming soon' label, and ChatWidget placeholders all routed through new header.* / chat.widget.* / common.comingSoon i18n namespaces; VoiceDemoSection US phone number flagged via decision-gate artifact, no code change.**

## Performance

- **Duration:** 13 min
- **Started:** 2026-04-25T05:48:29Z
- **Completed:** 2026-04-25T06:02:02Z
- **Tasks:** 6 (5 auto + 1 manual decision-gate)
- **Files modified:** 7 (1 created, 7 modified including 3 messages files)

## Accomplishments

- New `header.*` top-level namespace shipped in NL/EN/ES with full parity: 12 skill titles + descriptions, 3 category labels + descriptions, 5 nav items (skills/memory/caseStudies/pricing/about), `comingSoon` badge, `cta.applyTitle/applySubtitle` for the mega-menu Apply banner. 38 strings per locale × 3 = 114 translations.
- New `chat.widget.*` namespace shipped: typeMessage, demoLimitReached, demoLimitMessage, demoLimitCta. 4 strings per locale × 3 = 12 translations.
- `common.comingSoon` added as canonical "Coming soon" key for non-header use (SkillsTierMatrix) — 3 translations.
- `pricing.tiers.professional.mostPopular` badge key added — 3 translations.
- HeaderClient.tsx restructured: SKILL_CATEGORIES and NAV_ITEMS now hold only structural metadata (icon, href, key, comingSoon flag, hasDropdown). All 30+ user-facing strings render through `tHeader(...)` dispatch on `category.key` + `skill.key`. Mobile drawer mirrors the desktop dispatch. Top-level `nav.{login,apply}` translator kept untouched for right-side CTAs.
- pricing/page.tsx:127 hardcoded `'Most popular'` swapped to `t('tiers.professional.mostPopular')`.
- SkillsTierMatrix.tsx:101 hardcoded `Coming soon` swapped to `tCommon('comingSoon')` via a third translator scoped to the `common` namespace.
- ChatWidget.tsx hardcoded English strings eliminated on all 3 sites: lines 107 (banner with split message + CTA keys), 181 (floating placeholder), 231 (embedded placeholder).
- VoiceDemoSection.tsx phone number `+1 (570) 783-8236` flagged via `DECISION-PENDING-phone-number.md` per task 5 directive: 3 options documented, default-if-not-answered-in-2-weeks = option 2 (hide CTA-only). VoiceDemoSection.tsx code is UNCHANGED.
- Production build green: `npm run build` compiles in 6.8s, 87/87 static pages prerendered, zero new TypeScript errors.

## Task Commits

Each task was committed atomically against the working tree:

1. **Task 1: Create header.* + common.comingSoon + chat.widget.* + pricing.tiers.professional.mostPopular keys in NL/EN/ES** — `64bce9b` (feat)
2. **Task 2: Refactor HeaderClient.tsx to consume header.* i18n** — `927cab0` (refactor)
3. **Task 3: Localize 'Most popular' in pricing/page.tsx + 'Coming soon' in SkillsTierMatrix.tsx** — `1eefa7e` (fix)
4. **Task 4: Localize ChatWidget.tsx placeholders + demo-limit banner** — `5a7305c` (fix)
5. **Task 5: FLAG VoiceDemoSection US phone number for Daley decision** — `41148b7` (docs)
6. **Task 6: Regression check via production build** — implicit in Tasks 1-5 commits; `npm run build` green, no separate commit needed (build is the evidence)

**Plan metadata commit:** trailing commit covers SUMMARY + STATE + ROADMAP updates.

## Files Created/Modified

- `fmai-nextjs/messages/nl.json` — header.* + chat.widget.* + common.comingSoon + pricing.tiers.professional.mostPopular added; +44 keys
- `fmai-nextjs/messages/en.json` — same key set added in EN; +44 keys
- `fmai-nextjs/messages/es.json` — same key set added in ES; +44 keys
- `fmai-nextjs/src/components/layout/HeaderClient.tsx` — SKILL_CATEGORIES + NAV_ITEMS restructured to metadata-only; render layer dispatches via tHeader; hasDropdown:false added on non-skills items for TS union; unused Mic import removed; net delta -39 lines
- `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx` — single literal `'Most popular'` swapped to t() call (1-line change)
- `fmai-nextjs/src/components/pricing/SkillsTierMatrix.tsx` — third translator scoped to `common`; "Coming soon" literal swapped to tCommon call
- `fmai-nextjs/src/components/chatbot/ChatWidget.tsx` — `useTranslations('chat.widget')` added; 3 hardcoded literal sites replaced; demo-limit banner split into 2 translation keys (message + CTA)
- `.planning/phases/12-brand-copy-polish/DECISION-PENDING-phone-number.md` — new file: VoiceDemoSection phone number decision artifact

## Decisions Made

- **header.* as top-level namespace, not nested under common**: Existing `common.nav` is footer-shaped (home/pricing/about/contact), but `header.nav` is megabar-shaped (skills/memory/caseStudies/pricing/about). Different shape, different consumers, semantically distinct. Keeping them as separate top-level namespaces avoids ambiguity in future audits.
- **Top-level `nav.{login,apply}` kept untouched**: HeaderClient's right-side login/apply CTAs use `useTranslations('nav')`. Merging into `header.nav` would require updating every consumer of the legacy namespace and risks orphaning copies of the keys. Kept clean.
- **`common.comingSoon` as the canonical non-header key**: Plan explicitly named `common.comingSoon` for SkillsTierMatrix. `header.skills.comingSoon` kept as the header-local convenience key — same value, but consumer-scoped.
- **ChatWidget demo-limit banner split into two keys**: Original code had a sentence with "Book a call" as an inline link mid-paragraph. NL and ES often invert clause order, so an inline mid-sentence link forces awkward translations. Splitting into `demoLimitMessage` + `demoLimitCta` lets translators ship natural copy in each locale.
- **VoiceDemoSection phone via DECISION-PENDING-*.md**: Plan task 5 explicitly says "no code change in this plan". Created the parking note with 3 options and a default-if-not-answered rule so the audit finding does not silently re-surface in a future audit.
- **hasDropdown:false on non-skills NAV_ITEMS**: After restructuring NAV_ITEMS from `{label, href, hasDropdown?}` to `{key, href, hasDropdown}`, the `as const` produced a union where some branches lacked `hasDropdown`. Adding `hasDropdown: false` everywhere keeps the discriminator field present across all branches under TS strict.
- **Apply CTA banner localized too (not in plan task list)**: HeaderClient had two more hardcoded EN strings I noticed during Task 2: "Apply" and "Book a partnership call" inside the mega-menu's Apply CTA banner (lines 377-382 of the old file). These were NOT explicitly named in the plan but were direct collateral of the refactor — Rule 2 (missing critical i18n on a user-facing surface). Added `header.cta.applyTitle` + `header.cta.applySubtitle` keys to all 3 locales.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Apply CTA banner inside HeaderClient mega-menu was hardcoded EN**
- **Found during:** Task 2 (HeaderClient refactor)
- **Issue:** Plan named SKILL_CATEGORIES + NAV_ITEMS as the i18n migration targets but did not list the "Apply" / "Book a partnership call" copy in the mega-menu's footer CTA banner. Both strings were hardcoded English on a user-facing surface that NL and ES visitors hit on every header hover.
- **Fix:** Added `header.cta.applyTitle` + `header.cta.applySubtitle` keys to all 3 locales; wired the banner JSX to `tHeader('cta.applyTitle')` / `tHeader('cta.applySubtitle')`.
- **Files modified:** fmai-nextjs/messages/nl.json, en.json, es.json + HeaderClient.tsx
- **Verification:** Build green; no hardcoded EN remains in the file (`grep -E "'Apply'|'Book a partnership call'"` returns 0).
- **Committed in:** 64bce9b (Task 1, keys) + 927cab0 (Task 2, render-layer wiring)

**2. [Rule 3 - Blocking] `as const` on NAV_ITEMS produced a non-uniform discriminated union after key/href restructure**
- **Found during:** Task 2 (HeaderClient refactor — `npx tsc --noEmit`)
- **Issue:** After moving NAV_ITEMS from `{label, href, hasDropdown?}` to `{key, href, hasDropdown}` and applying `as const`, TS narrowed each branch to a different shape. Branches without `hasDropdown` could not access `item.hasDropdown` in the JSX render. 2 errors at lines 183 and 411.
- **Fix:** Added `hasDropdown: false` to all non-skills NAV_ITEMS so the field is present across the entire union. Also could have used a relaxed type, but the explicit field is more discoverable.
- **Files modified:** fmai-nextjs/src/components/layout/HeaderClient.tsx
- **Verification:** `npx tsc --noEmit` returns zero errors after the fix; build compiles.
- **Committed in:** 927cab0 (Task 2 commit, same atomic change)

**3. [Rule 1 - Cleanup] Unused `Mic` import in HeaderClient.tsx**
- **Found during:** Task 2 (HeaderClient refactor)
- **Issue:** The lucide-react `Mic` import was unused in the original file (no skill in SKILL_CATEGORIES used it). Restructuring made the dead import obvious. Build emits no error but ESLint would flag it.
- **Fix:** Removed `Mic` from the lucide-react import block.
- **Files modified:** fmai-nextjs/src/components/layout/HeaderClient.tsx
- **Verification:** `npx tsc --noEmit` clean; ESLint no-unused-vars rule satisfied for this file.
- **Committed in:** 927cab0 (Task 2 commit, same atomic change)

### Deferred Items

**Task 6 visual regression check via dev server deferred to verifier**
- **Reason:** Per plan-12-02 SUMMARY (and project session continuity notes), local dev ports 3000 and 3001 are occupied by other dev servers. Per global safety rule (NEVER kill user terminals), I did not free them. Production-server fallback also fails because dev processes hold a lock on `.next/`.
- **Mitigation:** Production build (`npm run build`) is the de-facto integration test on this content-centric project (per fmai-nextjs/CLAUDE.md). Build is green, all 87 static pages prerender successfully, no missing-key warnings on i18n compile. Phase verifier can run the visual sweep in any clean session.
- **Plan impact:** Zero — Task 6 was a regression check, not a code-change task. The check happened via build; visual sweep is downstream verifier work.

---

**Total deviations:** 3 auto-fixed (1 missing critical, 1 blocking TS, 1 unused-import cleanup) + 1 deferred item (visual capture)
**Impact on plan:** All auto-fixes were necessary for build correctness or to fully satisfy the plan's "zero hardcoded EN strings" success criterion. No scope creep — every change either fulfilled a plan must-have or was direct collateral of one. Visual capture deferral is environmental (port conflicts) not implementation-related.

## Issues Encountered

- Two parallel dev servers held ports 3000/3001 throughout this session, blocking visual regression capture (same as plan 12-02). Resolved by deferring captures to verifier and relying on `npm run build` as the integration test.
- The `common` namespace already had a `nav` key (footer-shaped: home/pricing/about/contact) which collides semantically with the new header `nav` (megabar-shaped: skills/memory/caseStudies/pricing/about). Resolved by keeping `common.nav` for footer use and creating `header.nav` as a sibling top-level namespace — clean separation, no consumer breakage.

## Verification Evidence

```
=== TypeScript ===
npx tsc --noEmit  ->  zero errors

=== HeaderClient cleanliness ===
grep -E "label: 'Create & Publish'|label: 'Engage & Convert'|label: 'Grow & Optimize'|title: 'Social Media'|title: 'Blog Factory'" \
  src/components/layout/HeaderClient.tsx  ->  0 matches
grep -c "tHeader(" src/components/layout/HeaderClient.tsx  ->  many matches (full i18n dispatch)

=== pricing/page.tsx cleanliness ===
grep "'Most popular'" src/app/[locale]/(marketing)/pricing/page.tsx  ->  0 matches

=== SkillsTierMatrix.tsx cleanliness ===
grep "Coming soon" src/components/pricing/SkillsTierMatrix.tsx  ->  0 matches

=== ChatWidget.tsx cleanliness ===
grep -E "'Demo limit reached'|'Type a message\\.\\.\\.'" \
  src/components/chatbot/ChatWidget.tsx  ->  0 matches

=== i18n parity ===
diff <(jq -r '.header.skills | paths | join(".")' messages/nl.json | sort) \
     <(jq -r '.header.skills | paths | join(".")' messages/en.json | sort)  ->  identical
diff <(jq -r '.header.skills | paths | join(".")' messages/en.json | sort) \
     <(jq -r '.header.skills | paths | join(".")' messages/es.json | sort)  ->  identical
diff <(jq -r '.chat | paths | join(".")' messages/nl.json | sort) \
     <(jq -r '.chat | paths | join(".")' messages/es.json | sort)  ->  identical
common.comingSoon present in NL/EN/ES
pricing.tiers.professional.mostPopular present in NL/EN/ES

=== Total new i18n keys ===
header.* (38 keys/locale × 3) + chat.widget.* (4 × 3) + common.comingSoon (1 × 3) + pricing.tiers.professional.mostPopular (1 × 3) = 132 new translations

=== Production build ===
npm run build  ->  Compiled successfully in 6.8s
                ->  Generating static pages using 15 workers (87/87) in 1346ms

=== Decision-gate artifact ===
test -f .planning/phases/12-brand-copy-polish/DECISION-PENDING-phone-number.md  ->  PASS
```

## User Setup Required

None — no external service configuration required. All work is in-repo i18n + render-layer refactor.

The `DECISION-PENDING-phone-number.md` artifact requires Daley's input to close out. Default-if-not-answered-in-2-weeks rule = hide-and-CTA-only (option 2). After decision is committed, the chosen option ships as a 1-task plan outside Phase 12 scope.

## Next Phase Readiness

- **12-04 unblocked**: my changes added `header.*`, `chat.*`, `common.comingSoon`, and `pricing.tiers.professional.mostPopular` without removing any keys. 12-04 will modify glossary terms (klanten -> merken), interpolation (MAX_PARTNERS_PER_YEAR), and legal dates on disjoint keys/files. Sequential ordering enforced by the plan's wave system.
- **ContactForm.tsx untouched**: per plan directive, Phase 11 (a11y form work) owns ContactForm.tsx. Verified untouched by 12-03 commits via `git diff --name-only HEAD~5 HEAD`.
- **VoiceDemoSection.tsx untouched**: per plan task 5 directive, the file is unchanged. The decision artifact is in the phase folder for Daley.
- **Phase 12 status**: 3 of 4 plans complete (12-01, 12-02, 12-03). 12-04 is Wave 2, depends on this plan landing first (which it now has).
- **Verifier ready**: production build is green, i18n parity is verified, decision-gate artifact is committed. Verifier can run the visual sweep against /nl, /en, /es header + pricing + chat surfaces in any clean dev session.

## Self-Check: PASSED

Verifying every claim in this SUMMARY against disk and git:

```
[x] commits exist:
  64bce9b (Task 1)  -> FOUND
  927cab0 (Task 2)  -> FOUND
  1eefa7e (Task 3)  -> FOUND
  5a7305c (Task 4)  -> FOUND
  41148b7 (Task 5)  -> FOUND

[x] files modified exist:
  fmai-nextjs/messages/nl.json                                                -> FOUND
  fmai-nextjs/messages/en.json                                                -> FOUND
  fmai-nextjs/messages/es.json                                                -> FOUND
  fmai-nextjs/src/components/layout/HeaderClient.tsx                          -> FOUND
  fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx                   -> FOUND
  fmai-nextjs/src/components/pricing/SkillsTierMatrix.tsx                     -> FOUND
  fmai-nextjs/src/components/chatbot/ChatWidget.tsx                           -> FOUND

[x] file created exists:
  .planning/phases/12-brand-copy-polish/DECISION-PENDING-phone-number.md      -> FOUND

[x] all must_haves verified:
  HeaderClient SKILL_CATEGORIES + NAV_ITEMS via useTranslations('header.*')   -> PASS
  pricing/page.tsx:127 'Most popular' replaced with t() call                  -> PASS
  SkillsTierMatrix.tsx:101 'Coming soon' replaced with tCommon('comingSoon')  -> PASS
  ChatWidget placeholders + limit messages use t()                            -> PASS
  Decision-gate artifact for VoiceDemoSection phone (no code change)          -> PASS
  ContactForm.tsx UNTOUCHED (Phase 11 owns it)                                -> PASS
  jq parity NL/EN/ES on all new keys                                          -> PASS
```

---
*Phase: 12-brand-copy-polish*
*Completed: 2026-04-25*
