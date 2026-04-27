---
phase: 15-conversion-accelerators
plan: 03
subsystem: content
tags: [case-study, testimonial, i18n, seo, person-schema, sindy, skc]

# Dependency graph
requires:
  - phase: 14-seo-geo-depth-upgrade
    provides: PersonJsonLd reusable component (already wired Sindy on case-study page)
  - phase: 12-brand-assets
    provides: og-image, brand color tokens (Sindy headshot deferred to interview)
provides:
  - Sindy SKC interview brief with 10-question template + consent recap email + transcript scaffold
  - SkcTestimonialBlock client component (orphan, awaiting photo to wire)
  - i18n scaffolding keys (photoSrc, photoAlt, linkedinUrl, linkedinLabel) in nl+en+es
  - Rule 1 fix: removed "Sindy Maat" surname leak from author.name in 3 locales
  - Photo-directory README at public/case-studies/skc/ documenting the asset gate
affects: [15-04, 15-05, 16-_-multi-step-apply, 17-_-skill-proof]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Scaffolding-first execution under blocked external dependency: deliver code + i18n keys + asset-dir gate, do NOT wire visible UI until external artifact (transcript + photo + consent) lands"

key-files:
  created:
    - docs/interviews/2026-04-sindy-skc-interview-brief.md
    - fmai-nextjs/src/components/case-studies/SkcTestimonialBlock.tsx
    - fmai-nextjs/public/case-studies/skc/README.md
  modified:
    - fmai-nextjs/messages/nl.json (testimonial keys + Sindy Maat leak fix)
    - fmai-nextjs/messages/en.json (testimonial keys + Sindy Maat leak fix)
    - fmai-nextjs/messages/es.json (testimonial keys + Sindy Maat leak fix)

key-decisions:
  - "Surname Maat removed from case_studies.skc.testimonial.author.name in 3 locales (Rule 1 fix): shared surname with Daley implies co-ownership leak per phase README success criterion 4. Author name unified to bare 'Sindy' across visible (authorName) + schema (author.name) + bio (author.bio)."
  - "SkcTestimonialBlock built but NOT wired into case-study page.tsx — orphan component until photo file lands at public/case-studies/skc/sindy-headshot.jpg. Existing inline testimonial render in page.tsx stays in place, no user-facing regression."
  - "Component reads testimonial.{authorName,authorRole,quote,photoSrc,photoAlt,linkedinUrl,linkedinLabel} from i18n — does NOT use plan-spec flat keys 'author' + 'role' since existing schema (Phase 14-02) already names them authorName + authorRole; matching established convention reduces churn."
  - "Photo-dir README acts as physical reminder of the asset gate at public/case-studies/skc/. When Daley drops the headshot it sits next to a doc explaining what's expected and why the component isn't yet wired."
  - "Person schema for Sindy was already shipped by Phase 14-02 (commit a9deef5). Plan 15-03 Task 5 is therefore a no-op verification, not a re-implementation. PersonJsonLd reused, not recreated, per phase contract (success criterion 4 + must_haves.truths)."
  - "LinkedIn URL placeholder kept as 'https://www.linkedin.com/in/sindy-skinclarity' in i18n + seo-config.ts (TODO marker present from Phase 14-01). Real slug confirmed during Sindy call replaces this in a follow-up commit."

patterns-established:
  - "External-dependency partial-execution: scaffolding (code + key shape + asset-dir + brief) lands first commit, content (real numbers + asset binary + final wiring) lands after external artifact arrives. Avoids blocking the entire plan on one human action."
  - "Surname-leak audit: any contributor on a public surface whose surname matches Daley's must NOT have surname rendered. Codified through case_studies.skc.testimonial.author.name = bare first name."
  - "Photo-asset gate documented inside the asset directory itself (README.md at the public/<feature>/ path) — survives repo navigation, not buried in plan docs."

requirements-completed: []  # WEB-01 partial; full completion requires Sindy interview content rewrite

# Metrics
duration: 14min
completed: 2026-04-27
status: PARTIAL — checkpoint emitted, Tasks 3 + final wiring + Task 6 blocked on external Sindy interview artifacts
---

# Phase 15 Plan 03: SKC Case Study Sindy Testimonial + Metrics Rewrite (PARTIAL)

**Sindy interview brief shipped + scaffolding (component + i18n keys + photo-dir gate + Sindy-Maat surname leak fixed) committed; metric rewrite + final component wiring + browser verification blocked on transcript + photo + consent.**

## Performance

- **Duration:** 14 min
- **Started:** 2026-04-27T13:52:26Z
- **Completed:** 2026-04-27T14:06:20Z (partial; checkpoint pending)
- **Tasks completed:** 3 of 6 (Task 1 + Task 4 partial scaffolding + Task 5 verified-already-done)
- **Tasks blocked:** 3 of 6 (Task 2 external + Task 3 content rewrite + Task 6 browser verify)
- **Files created:** 3
- **Files modified:** 3 (messages/{nl,en,es}.json — partial via parallel agent commit, see Issues Encountered)

## Accomplishments

- 30-minute interview brief written for Daley's Sindy call: 10-question template (R-5 from RESEARCH.md, expanded with acceptable-minimum + follow-ups), consent-recap email template, transcript scaffold
- SkcTestimonialBlock component: 80px round photo, blockquote, name/role/LinkedIn link with focus-visible ring; reads 7 i18n keys; client-component pattern with next/image and lucide Linkedin glyph
- i18n placeholder scaffolding for photoSrc + photoAlt + linkedinUrl + linkedinLabel landed in nl + en + es (component can be wired immediately when transcript arrives)
- "Sindy Maat" surname leak fixed in 3 locales (Rule 1 deviation): author.name was rendering Daley's surname implicitly on schema, in violation of phase README success criterion 4
- Photo-directory README at fmai-nextjs/public/case-studies/skc/ documenting asset spec + wiring trigger so future Daley (or any agent) sees the gate
- PersonJsonLd verified already-shipped from Phase 14-02 — Task 5 is a no-op, plan correctly anticipated this overlap

## Task Commits

1. **Task 1: Sindy interview brief** — `7529304` (docs)
2. **Task 4 scaffolding (component + photo dir gate)** — `684061a` (feat)
3. **Task 4 Rule 1 fix (Sindy Maat surname leak removal) + scaffolding i18n keys** — landed in `96b6bbe` (parallel 15-02 agent's git add captured my Edit-tool changes; see Issues Encountered)
4. **Task 5 verification: PersonJsonLd already shipped** — no new commit; existing `a9deef5` (Phase 14-02) confirmed correct

**Plan metadata commit (this SUMMARY + STATE.md + ROADMAP.md):** pending in final commit after this file.

## Files Created/Modified

- `docs/interviews/2026-04-sindy-skc-interview-brief.md` — 10-question template with acceptable-minimum criteria, consent-recap email template, transcript scaffold for Daley to fill
- `fmai-nextjs/src/components/case-studies/SkcTestimonialBlock.tsx` — client component reading testimonial.{quote,authorName,authorRole,photoSrc,photoAlt,linkedinUrl,linkedinLabel} via useTranslations; renders 80px round photo (next/image fill), blockquote, figcaption with name + role + LinkedIn link
- `fmai-nextjs/public/case-studies/skc/README.md` — asset-spec doc (.jpg, 800x800 min, sRGB), consent trail required, wiring-trigger note
- `fmai-nextjs/messages/nl.json` — testimonial.photoSrc + photoAlt + linkedinUrl + linkedinLabel added; testimonial.author.name 'Sindy Maat' → 'Sindy'
- `fmai-nextjs/messages/en.json` — same key set, EN strings
- `fmai-nextjs/messages/es.json` — same key set, ES strings

## Decisions Made

- Component scaffolding intentionally NOT wired into case-study page.tsx — orphan until photo file lands. Rationale: a wired component pointing to a non-existent /case-studies/skc/sindy-headshot.jpg would render a broken image (404) on the live page. Cleaner to keep the existing inline testimonial render in page.tsx and swap to SkcTestimonialBlock in one atomic commit when photo + transcript arrive.
- author.name unified to 'Sindy' (bare first name) across all locales. The pre-existing 'Sindy Maat' bio entry was a Phase 14-02 carry-over bug (Daley's surname accidentally attached to Sindy in the JSON-LD bio). Per phase README success criterion 4 (no Daley co-ownership leak) this is a Rule 1 bug fix.
- LinkedIn URL placeholder kept as 'https://www.linkedin.com/in/sindy-skinclarity' (Phase 14-01 TODO marker). Real slug lands during Sindy interview; same key, real value, single follow-up commit.
- Plan-spec flat keys 'author' + 'role' for figcaption replaced with the existing 'authorName' + 'authorRole' shape from Phase 14-02. Reason: avoid breaking the existing testimonial render in page.tsx (still using authorName/authorRole), and avoid double-keys in i18n.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Removed "Sindy Maat" surname leak from author.name in 3 locales**
- **Found during:** Task 4 (component scaffolding — verified i18n shape against component reads)
- **Issue:** case_studies.skc.testimonial.author.name was set to "Sindy Maat" in nl + en + es JSON files. This is Daley's surname, not Sindy's. Implies shared family/business connection in the JSON-LD bio output, in direct violation of phase README success criterion 4 ("ZERO mention of Daley co-ownership of SkinClarity Club on any SKC case-study surface"). Person schema would have rendered "Sindy Maat" as the displayName on the SKC case study, leaking the connection to AI crawlers + LLM citers + Google rich-results.
- **Fix:** Changed author.name to bare "Sindy" in all 3 locales. Aligns with the visible authorName key (already correctly "Sindy") and removes the schema leak.
- **Files modified:** fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json
- **Verification:** `grep "Sindy Maat" fmai-nextjs/messages/*.json` returns zero results
- **Committed in:** Captured by parallel 15-02 agent's commit `96b6bbe` (their `git add fmai-nextjs/messages/*.json` snapshotted my unstaged Edit-tool changes)

**2. [Rule 3 - Blocking] Created public/case-studies/skc/ directory with asset-spec README**
- **Found during:** Task 4 (component reads /case-studies/skc/sindy-headshot.jpg path)
- **Issue:** Plan implies the photo dir + file exist as an external dependency, but the directory itself wasn't yet created. Without it, the photo (when it arrives) has no canonical home, and a future agent might wire the component before noticing the file is missing.
- **Fix:** Created the directory + dropped a README.md documenting the spec (filename, dimensions, format, source, consent) + the wiring trigger (component lands on the page when this file lands here).
- **Files modified:** fmai-nextjs/public/case-studies/skc/README.md (new)
- **Verification:** Directory present, README readable, references the component path correctly
- **Committed in:** `684061a`

---

**Total deviations:** 2 auto-fixed (1 bug fix removing identity leak, 1 blocking — asset gate doc)
**Impact on plan:** Both essential. The Sindy Maat leak would have shipped to production as schema markup poisoning the SKC case-study Person entity in LLM/Google indices; catching it during scaffolding is a clean win. The photo-dir README is operational hygiene — keeps the gate visible without burying it in plan docs.

## Issues Encountered

**Parallel-agent commit collision** — A parallel 15-02 execute agent ran during my Read-phase and committed `96b6bbe` ("soft Calendly CTA on contact success state") which performed `git add fmai-nextjs/messages/*.json` AFTER my unstaged Edit-tool changes had landed in the working copy. Result: my testimonial-key additions + Sindy Maat surname fix were captured into the 15-02 commit rather than a dedicated 15-03 commit. Functionally identical (the fix is in HEAD), but the git log attributes the 15-03 changes to a 15-02 commit message. Documented here so the audit trail is complete. No data loss, no conflicts; just provenance noise.

## Awaited External Artifacts (Tasks 3 + final-wiring + Task 6 blocked)

The remaining work cannot complete until the following artifacts land:

- `docs/interviews/2026-04-sindy-skc-transcript.md` — 10 Q&A pairs from the brief, with quantified answers wherever Sindy provided numbers (uren-per-week baseline + delta, engagement metric + delta, goedkeuringstijd verification, output volume verification, EUR-saved math, quality bar, faalmodi, testimonial quote, consent items)
- `fmai-nextjs/public/case-studies/skc/sindy-headshot.jpg` — JPEG, minimum 800x800, sRGB, square or portrait
- LinkedIn URL — confirmed slug, replaces placeholder in messages/*.json + src/lib/seo-config.ts `LINKEDIN_SINDY_URL`
- Job-title confirmation — current default is "Founder, SkinClarity Club"; Sindy may prefer different
- Written consent email — Daley archives outside the repo; transcript-doc references the location

When these land, a follow-up agent (or Daley directly) executes:
- Task 3: Replace `case_studies.skc.content.row*` block with new `outcomes.metrics.*` shape (5+ metrics with sourceNote each), update meta description per metrics, mirror to en+es
- Task 4 final wiring: Replace inline testimonial render in `case-studies/skinclarity-club/page.tsx` with `<SkcTestimonialBlock />`. Replace `content` table render with new outcomes 5-card grid.
- Task 6: Browser verification per plan checklist (all 5 metric cards render + photo + LinkedIn click-through + Person schema validates in Google Rich Results + grep negative for Daley co-ownership leak)

## User Setup Required

**Daley action items:**

1. Schedule + run the 30-min Sindy call using the brief at `docs/interviews/2026-04-sindy-skc-interview-brief.md`. Per DECISIONS-2026-04-24.md Phase 15 Q1: within 48 hours of execute start.
2. Transcribe (Whisper or similar) and save to `docs/interviews/2026-04-sindy-skc-transcript.md`.
3. Drop Sindy's headshot at `fmai-nextjs/public/case-studies/skc/sindy-headshot.jpg` (.jpg, 800x800 min).
4. Confirm Sindy's actual LinkedIn URL slug (current placeholder: `sindy-skinclarity` — likely incorrect).
5. Send Sindy the consent-recap email (template in the brief), wait for "akkoord" reply, archive in personal vault.
6. Re-run plan 15-03 from Task 3 once all 4 artifacts above are in place.

## Next Phase Readiness

- 15-04 (lead magnet programme) and 15-05 (pricing FAQ promotion + founding counter) are unblocked by 15-03 partial completion — they have no dependency on Sindy's interview content. Can execute in parallel right now.
- 15-02 (post-submit Calendly embed) already shipped per parallel agent — no longer in flight.
- 15-03 final completion gates only the SKC case-study page rendering quality; does not block 15-04 or 15-05 plan execution.

## Self-Check: PASSED (scaffolding portion)

Files (all 4 expected):
- FOUND: docs/interviews/2026-04-sindy-skc-interview-brief.md
- FOUND: fmai-nextjs/src/components/case-studies/SkcTestimonialBlock.tsx
- FOUND: fmai-nextjs/public/case-studies/skc/README.md
- FOUND: fmai-nextjs/src/components/seo/PersonJsonLd.tsx (Phase 14-02 reuse)

Commits (all 4 expected):
- FOUND: 7529304 (brief)
- FOUND: 684061a (component + photo-dir gate)
- FOUND: 96b6bbe (parallel-agent commit captured Sindy Maat fix + i18n keys)
- FOUND: a9deef5 (Phase 14-02 PersonJsonLd render — verified, not redone)

Negative checks (leak prevention):
- PASS: zero "Sindy Maat" matches across messages/{nl,en,es}.json

i18n key shape (nl):
- photoSrc = /case-studies/skc/sindy-headshot.jpg
- photoAlt = Portret van Sindy, founder van SkinClarity Club
- linkedinUrl = https://www.linkedin.com/in/sindy-skinclarity (placeholder, awaiting confirmed slug)
- linkedinLabel = Bekijk Sindy op LinkedIn
- author.name = Sindy (leak fixed)

Build: `npm run build` exit 0; SKC case-study page prerendered as SSG in 3 locales (en/nl/es). Pre-existing soft lint warnings unchanged (per Phase 13-03 lint-gate decision).

Plan completion: PARTIAL — 3 of 6 tasks completed (Task 1 brief, Task 4 scaffolding, Task 5 verified-already-done from Phase 14-02). Tasks 3 (real metrics rewrite), Task 4 final wiring, Task 6 browser verify gated on external Sindy interview artifacts (transcript + headshot + LinkedIn slug + written consent). Checkpoint emitted to caller.

---
*Phase: 15-conversion-accelerators*
*Plan: 03 (PARTIAL — checkpoint pending external Sindy artifacts)*
*Completed: 2026-04-27 (scaffolding portion)*
