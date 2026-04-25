---
phase: 11-eaa-accessibility-compliance
verified: 2026-04-25T00:00:00Z
status: human_needed
score: 11/11 automated must-haves verified (2 human checks outstanding)
human_verification:
  - test: "Keyboard walkthrough of Skills mega-menu (NVDA / VoiceOver)"
    expected: "Screen reader announces aria-expanded state, cycles items on ArrowUp/Down, Escape returns focus to trigger, Tab from last item continues natural flow to Memory link. Per-field form errors announced with label + invalid + describedby content."
    why_human: "Screen reader semantic behaviour cannot be verified via grep — requires running Chrome + NVDA (or Safari + VoiceOver) against npm run dev. Plan 11-01 Task 5 + Plan 11-03 Task 3 both explicitly require this."
  - test: "Lighthouse a11y scan on /nl, /nl/pricing, /nl/apply, /nl/contact"
    expected: "Score >= 95 on all four pages. Zero contrast errors. Zero aria-valid-attr-value errors. Zero autocomplete-valid errors."
    why_human: "Lighthouse requires a running dev server + Chrome audit UI; verifier runs grep/file checks only. Plan 11-02 Task 3 defers this to the verifier."
---

# Phase 11: EAA Accessibility Compliance Verification Report

**Phase Goal:** Close the EAA-flagged WCAG 2.1 A + 2.2 AA violations from `docs/audits/2026-04-24-full-audit/07-ux-accessibility.md` (UX/A11y health 55/100). Bring the marketing site (fmai-nextjs) to documented compliance for: 2.1.1 Keyboard, 2.4.1 Bypass Blocks, 2.4.3 Focus Order, 2.4.7 Focus Visible, 2.4.11 Focus Not Obscured, 4.1.2 Name Role Value, 1.4.3 Contrast, 2.3.3 prefers-reduced-motion, 1.3.1 Info & Relationships, 3.3.1 Error ID, 3.3.3 Error Suggestion, 4.1.3 Status Messages.

**Verified:** 2026-04-25
**Status:** human_needed (all automated checks pass; screen reader + Lighthouse deferred to human)
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| #   | Truth | Status | Evidence |
| --- | --- | --- | --- |
| 1 | Skip-link present + `<main id="main">` landmark with focusable tabIndex={-1} | VERIFIED | `layout.tsx:64-69` renders `<a href="#main">` as first body child with `sr-only focus:not-sr-only` and `z-[200]`; `PageShell.tsx:9` has `<main id="main" tabIndex={-1}>`. Note: success criteria mentions `id="main-content"` but implementation uses `id="main"` consistent with the plan's must_haves and link target. |
| 2 | Skills mega-menu reachable via keyboard with ARIA disclosure semantics | VERIFIED | `HeaderClient.tsx:232-249` trigger has `aria-expanded={skillsOpen}`, `aria-controls="skills-menu"`, `aria-haspopup="menu"`, `onKeyDown` for ArrowDown + Escape. `HeaderClient.tsx:262-302` menu has `id="skills-menu"`, `role="menu"`, `aria-label="Skills"` and a full keyboard handler covering ArrowUp/Down/Home/End/Escape/Tab. Each menu item has `role="menuitem"` + `tabIndex={skillsOpen ? 0 : -1}` (lines 326-327, 367-368). Mobile disclosure at lines 456-459 and 472 gets `aria-expanded` + `aria-controls="mobile-skills-menu"` + `id="mobile-skills-menu"` for parity. |
| 3 | Global `:focus-visible` ring visible on dark theme | VERIFIED | `globals.css:394-399` `*:focus-visible { outline: 2px solid var(--color-accent-system); outline-offset: 2px; border-radius: 2px; }`. `--color-accent-system` is `#00d4aa` (cyan, high contrast against dark bg). Input/select/textarea repeat at lines 403-408. Carve-out `main:focus(-visible) { outline: none }` at lines 412-414 prevents double-ring when skip-link focuses the landmark. Grep count: 7 focus-visible occurrences in globals.css. |
| 4 | `BookingModal` returns focus to its trigger on close | VERIFIED | `bookingStore.ts:10-19` stores `triggerEl` in Zustand and `openBooking(trigger?)` signature. `BookingCTA.tsx:48` passes `e.currentTarget` to openBooking. `BookingModal.tsx:19` destructures triggerEl; `BookingModal.tsx:25-42` effect restores focus on close via `requestAnimationFrame` with `document.contains(triggerEl)` guard. Effect fires regardless of close method (Escape, X button, backdrop). |
| 5 | `--color-text-muted` ≥ 4.5:1 on bg-deep AND bg-surface | VERIFIED | `globals.css:18` `--color-text-muted: #8C98AD;`. Computed contrast (WCAG 2.x luminance formula): 6.67:1 on `#0a0d14` (bg-deep) and 6.26:1 on `#111520` (bg-surface). Both PASS AA (≥4.5:1). |
| 6 | `@media (prefers-reduced-motion)` block neutralizes ALL keyframes | VERIFIED | `globals.css:308-335` single comprehensive block with universal selector `*, *::before, *::after { animation-duration: 0.01ms !important; ... }` covering all 18 `@keyframes` in the file plus inline animations via `!important`. Explicit `animation: none !important` halt for `.blob-warm/.blob-cool/.blob-mixed/.loader` (decorative, no terminal state). Framer Motion respects `useReducedMotion()` separately in JS. Grep counts: exactly 1 `prefers-reduced-motion: reduce` block, 18 `@keyframes`. |
| 7 | ApplicationForm: `aria-invalid` + `aria-describedby` on each field with errors | VERIFIED | `ApplicationForm.tsx`: 8 `aria-invalid={Boolean(fieldErrors.X)}` and matching `aria-describedby="X-err"` attributes on every input/select/textarea (name, email, agency, role, revenue, clientCount, tier, problem). Per-field `<p id="X-err" role="alert">` renders conditionally when `fieldErrors[X]` populated. `fieldErrors` populated from Zod issues via `mapIssueToKey` to `apply.form.errors.*` i18n keys. `requestAnimationFrame` focuses first failing field for SR announcement. |
| 8 | ContactForm: `aria-invalid` + `aria-describedby` + per-field role=alert | VERIFIED | `ContactForm.tsx` lines 121-133 (name), 147-157 (email), 192-204 (message): each has `aria-invalid={Boolean(fieldErrors.X)}` + `aria-describedby={fieldErrors.X ? 'contact-X-err' : undefined}` and per-field `<p id="contact-X-err" role="alert">`. Generic server-side error banner at lines 208-215 has `role="alert"`. |
| 9 | `role="alert"` or `aria-live` for server-side error/success status | VERIFIED | ApplicationForm: success container `role="status" aria-live="polite"` at lines 102-106; generic error banner `role="alert"` at line 338; submit wrapped in `aria-live="polite" aria-atomic="true"` at lines 343-351. ContactForm: success container `role="status" aria-live="polite"` at line 80; error banner `role="alert"` at line 210; submit wrapped in `aria-live="polite" aria-atomic="true"` at lines 218-226. Covers WCAG 4.1.3 status messages. |
| 10 | `autoComplete` + `inputMode` attributes on relevant fields | VERIFIED | ApplicationForm: 9 autoComplete tokens (name, email, organization, organization-title, 4× off on selects/textarea/honeypot) per WHATWG purpose-of-field spec; inputMode="email" on email input. ContactForm: autoComplete=name/email/organization/off on name/email/company/message; inputMode="email" on email. Total inputMode="email" in src/components: exactly 2 (one per form) matching plan verification target. |
| 11 | i18n: nl.json + en.json + es.json have identical keys for new a11y strings | VERIFIED | All three locale files carry: (a) top-level `"a11y": { "skipToContent": "..." }` (NL: "Ga direct naar inhoud" / EN: "Skip to content" / ES: "Ir al contenido"); (b) `apply.form.errors` block with 9 keys (nameMin, emailInvalid, agencyMin, roleMin, revenueRequired, clientCountRequired, tierRequired, problemMin, problemMax); (c) `contact.form.status` block with 6 keys (sending, successTitle, successBody, sendAnother, networkError, genericError). All keys present at line 1581 (errors) and 816 (status) in each file. |
| 12 | `npm run build` passes | VERIFIED | Run from `fmai-nextjs/`: output shows "Compiled successfully in 6.0s" with all locale × route prerender. No TypeScript errors, no runtime warnings. |

**Score:** 12/12 truths verified

### Required Artifacts

| Artifact | Expected | Status | Details |
| --- | --- | --- | --- |
| `fmai-nextjs/src/app/[locale]/layout.tsx` | Skip-link as first child of `<body>` | VERIFIED | Lines 64-69; `getTranslations({ namespace: 'a11y' })` at line 50 wires i18n. Class list includes `focus:z-[200]` (above header z-50 and modal z-60). |
| `fmai-nextjs/src/components/layout/PageShell.tsx` | `<main id="main" tabIndex={-1}>` | VERIFIED | Line 9 exact match. |
| `fmai-nextjs/src/components/layout/HeaderClient.tsx` | Keyboard-operable Skills mega-menu with ARIA disclosure | VERIFIED | 538 lines. Refs + key handlers + role=menu/menuitem + FLAT_SKILLS index covering 12 skills + Apply CTA = 13 items. Outside-click ref-scoped. Hover-to-open dropped. |
| `fmai-nextjs/src/app/globals.css` | Muted token, focus-visible, scroll-padding, reduced-motion | VERIFIED | 415 lines. `--color-text-muted: #8C98AD` at line 18. Full reduced-motion block at 308-335. Focus-visible + scroll-padding-top block at 384-414. |
| `fmai-nextjs/src/stores/bookingStore.ts` | triggerEl state + openBooking(trigger) | VERIFIED | 19 lines. `triggerEl: HTMLElement \| null` + `openBooking(trigger?: HTMLElement \| null)` signature. |
| `fmai-nextjs/src/components/booking/BookingModal.tsx` | Focus-return effect | VERIFIED | Lines 25-42. `requestAnimationFrame(() => triggerEl.focus())` gated by `document.contains()`. |
| `fmai-nextjs/src/components/booking/BookingCTA.tsx` | Passes event.currentTarget to openBooking | VERIFIED | Line 48: `onClick={(e) => openBooking(e.currentTarget)}`. |
| `fmai-nextjs/src/components/apply/ApplicationForm.tsx` | Per-field errors, aria-invalid/describedby, autoComplete, inputMode | VERIFIED | 357 lines. 8 aria-invalid, 9 autoComplete, inputMode="email" on email, per-field `<p role="alert">`, submit wrapped in aria-live, success card role=status. |
| `fmai-nextjs/src/components/contact/ContactForm.tsx` | i18n status, autoComplete, inputMode, aria-invalid/describedby | VERIFIED | 230 lines. Zero hardcoded EN literals. 4 autoComplete tokens. inputMode="email". 3 aria-invalid fields + banner with role=alert. |
| `fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx` | Passes 6 new status labels to ContactForm | VERIFIED | Lines 103-108: `statusSending: t('form.status.sending')` through `statusGenericError`. |
| `fmai-nextjs/messages/{nl,en,es}.json` | a11y.skipToContent + apply.form.errors + contact.form.status parity | VERIFIED | All 3 locale files verified via grep. Identical key shapes, locale-appropriate copy. |

### Key Link Verification

| From | To | Via | Status | Details |
| --- | --- | --- | --- | --- |
| `layout.tsx` | `PageShell.tsx` | `href="#main"` | WIRED | Link at layout.tsx:65 matches id="main" on PageShell.tsx:9. |
| `BookingCTA.tsx` | `bookingStore.ts` | `openBooking(e.currentTarget)` | WIRED | triggerEl captured, read by BookingModal. |
| `BookingModal.tsx` | `bookingStore.ts` | `useBookingStore().triggerEl` | WIRED | Used in focus-return effect. |
| `ApplicationForm.tsx` | `messages/*.json` | `useTranslations('apply.form')` + `t(errors.{key})` | WIRED | mapIssueToKey() returns keys present in all 3 locale files. |
| `ContactForm.tsx` | `contact/page.tsx` | `labels` prop (6 new fields) | WIRED | Server component passes, client consumes. |
| Skills trigger button | Skills menu panel | `aria-controls="skills-menu"` ↔ `id="skills-menu"` | WIRED | Exactly 1 match on each ID. Mobile has `aria-controls="mobile-skills-menu"` ↔ `id="mobile-skills-menu"` parity. |

### Requirements Coverage

Phase 11 PLAN frontmatter declares these requirement IDs across plans:

| Plan | Requirements |
| --- | --- |
| 11-01 | WCAG-2.4.1, WCAG-2.1.1, WCAG-2.4.7, WCAG-2.4.11, WCAG-2.4.3, WCAG-4.1.2 |
| 11-02 | WCAG-1.4.3, WCAG-2.3.3, WCAG-2.3.1 |
| 11-03 | WCAG-1.3.5, WCAG-3.3.1, WCAG-3.3.3, WCAG-4.1.2, WCAG-4.1.3 |

**ROADMAP.md maps Phase 11 to requirement `AUDIT-BLOCKER-P0-A11Y` (rolled-up ID).**

| Requirement | Source Plan | Description | Status | Evidence |
| --- | --- | --- | --- | --- |
| AUDIT-BLOCKER-P0-A11Y | ROADMAP rollup | EAA 2025-06-28 legal exposure — resolve critical WCAG violations from audit-07 | SATISFIED | All 5 ROADMAP success criteria (skip-link, keyboard mega-menu, contrast, form aria, reduced-motion + focus ring) verified above. |
| WCAG-2.4.1 Bypass Blocks | 11-01 | Skip-link first focusable | SATISFIED | layout.tsx:64-69 + PageShell.tsx:9 |
| WCAG-2.1.1 Keyboard | 11-01 | Skills mega-menu fully keyboard operable | SATISFIED | HeaderClient.tsx arrow/Home/End/Escape/Tab handler |
| WCAG-2.4.7 Focus Visible | 11-01 | Global cyan ring | SATISFIED | globals.css *:focus-visible rule |
| WCAG-2.4.11 Focus Not Obscured | 11-01 | scroll-padding-top 5rem | SATISFIED | globals.css:390 |
| WCAG-2.4.3 Focus Order | 11-01 | Modal returns focus to trigger | SATISFIED | BookingModal focus-return effect |
| WCAG-4.1.2 Name Role Value | 11-01 + 11-03 | aria-expanded/controls/haspopup on trigger, aria-invalid/describedby on fields | SATISFIED | HeaderClient + ApplicationForm + ContactForm |
| WCAG-1.4.3 Contrast | 11-02 | #8C98AD 6.67:1 on bg-deep, 6.26:1 on bg-surface | SATISFIED | globals.css:18, computed |
| WCAG-2.3.3 Animation from Interactions | 11-02 | Universal reduced-motion rule | SATISFIED | globals.css:308-335 |
| WCAG-2.3.1 Three Flashes | 11-02 | Animation halted under reduced-motion | SATISFIED | Same block |
| WCAG-1.3.5 Identify Input Purpose | 11-03 | WHATWG autoComplete tokens | SATISFIED | 9 autoComplete on /apply + 4 on /contact |
| WCAG-3.3.1 Error Identification | 11-03 | Per-field role=alert + first-field focus | SATISFIED | ApplicationForm mapIssueToKey + RAF focus |
| WCAG-3.3.3 Error Suggestion | 11-03 | Localised hints per field | SATISFIED | errors.* block with 9 keys × 3 locales |
| WCAG-4.1.3 Status Messages | 11-03 | aria-live on submit + role=status on success | SATISFIED | Both forms wrap submit in aria-live=polite |

**ORPHANED requirements (in plans, not in REQUIREMENTS.md):**

All 14 WCAG-* IDs and the rollup AUDIT-BLOCKER-P0-A11Y are declared by plans/ROADMAP but absent from `.planning/REQUIREMENTS.md`. REQUIREMENTS.md only contains legacy WEB-* (Phase 1) + business requirements. This is a pre-existing gap consistent with the note in the objective (IDs roll up under AUDIT-BLOCKER-P0-A11Y, which is also missing).

**Action (non-blocking):** Backfill REQUIREMENTS.md with an `AUDIT-BLOCKER-P0-A11Y` entry and map the 14 WCAG IDs under it in a future documentation pass. Do not block phase completion — the implementation evidence above independently satisfies the EAA/WCAG contract documented in the audit.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
| --- | --- | --- | --- | --- |
| (none) | — | — | — | No TODO/FIXME/placeholder/stub patterns detected in the 10 files modified by this phase. |

Note: Pre-existing lint errors documented in `deferred-items.md` (36 errors + 14 warnings) are in files **not modified** by Phase 11 (`verify-mega.cjs`, `verify-screenshots.js`, `src/components/chat/ChatWidget.tsx`, `src/lib/chatbot/engine.ts`, `tests/e2e/homepage.spec.ts`). They predate commit `dd33f7e` and are not introduced by this phase. Flagged for a future lint cleanup plan.

### Human Verification Required

#### 1. Keyboard walkthrough with NVDA / VoiceOver

**Test:** Run `npm run dev` from `fmai-nextjs/`. On Windows with NVDA (or macOS with VoiceOver):
1. `/nl` — Tab once from body, SR announces "Ga direct naar inhoud, link". Enter jumps to `<main>`.
2. Tab to Skills trigger, press ArrowDown — SR announces Social Media menuitem. Cycle through 13 items. Escape returns focus to trigger. Tab from Apply CTA item closes menu and focus lands on Memory.
3. `/nl/apply` — Tab into form, submit empty. SR announces each field's per-field error. Focus lands on first failing field (name). Per-field announcement includes label + "invalid entry" + error text.
4. `/nl/contact` — same SR pattern for 3 fields + server banner.
5. Repeat key checks on `/en` and `/es`.
**Expected:** All announcements match per-locale strings. No "no landmark found" warnings. Mega-menu opens + cycles via keys.
**Why human:** Screen reader semantic output is an assistive tech behaviour — cannot be verified via grep. Plan 11-01 Task 5 + Plan 11-03 Task 3 both explicitly require this step and were auto-approved under yolo mode with a note deferring to the verifier.

#### 2. Lighthouse a11y scan

**Test:** Chrome DevTools > Lighthouse > Accessibility only > Desktop:
1. `/nl` → save HTML report to `fmai-nextjs/test-results/lighthouse-nl-home-11.html`
2. `/nl/pricing`
3. `/nl/apply`
4. `/nl/contact`
**Expected:** Score ≥ 95 on each page. "Background and foreground colors have a sufficient contrast ratio" PASS. No aria-valid-attr-value / autocomplete-valid / label-content-name-mismatch violations.
**Why human:** Requires running Chrome audit UI against a live dev server. Plan 11-02 Task 3 explicitly defers Lighthouse to the verifier.

#### 3. (Optional) `prefers-reduced-motion` emulation

**Test:** Chrome DevTools command palette > "Emulate CSS media feature prefers-reduced-motion" > reduce. Reload `/nl`:
- Hero fadeInUp cascade renders statically (no 0.8s animation).
- Skills menu opens without scale/fade transition.
- Blob backgrounds freeze.
- DevTools Animations panel shows zero active animations (or all at 0.01ms).
**Expected:** All animations halt when preference is on. Toggle off → animations return.
**Why human:** DevTools feature-emulation UX is manual; CSS rule correctness is already verified by grep/build.

### Gaps Summary

No gaps blocking the phase goal. All 12 observable truths and all 11 required artifacts are verified in code. Contrast math is mathematically proven (6.67:1 and 6.26:1 both ≥ 4.5:1). Build passes. i18n parity across 3 locales. Skills mega-menu ARIA disclosure pattern complete. Form a11y full coverage (per-field errors + aria-invalid + aria-describedby + autoComplete + inputMode + aria-live).

Two items need a human pass before final sign-off:
- Screen reader walkthrough (NVDA/VoiceOver) — deferred from Plan 11-01 Task 5 + Plan 11-03 Task 3.
- Lighthouse a11y score ≥ 95 on `/nl`, `/nl/pricing`, `/nl/apply`, `/nl/contact` — deferred from Plan 11-02 Task 3.

These do not change the code contract, but close the EAA legal-risk loop with user-agent-side evidence. Until they run, the phase status is `human_needed` rather than `passed`.

One non-blocking documentation gap flagged: `.planning/REQUIREMENTS.md` does not contain `AUDIT-BLOCKER-P0-A11Y` or any WCAG-* IDs. Plans/ROADMAP reference them consistently — REQUIREMENTS.md needs a backfill pass. Tracked for a future docs phase.

---

_Verified: 2026-04-25_
_Verifier: Claude (gsd-verifier, Opus 4.7 1M context)_
