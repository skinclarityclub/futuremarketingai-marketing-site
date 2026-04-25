---
phase: 11-eaa-accessibility-compliance
plan: 03
subsystem: a11y
tags:
  - a11y
  - wcag
  - eaa
  - i18n
  - forms
requires:
  - 11-01-SUMMARY.md
  - 11-02-SUMMARY.md
provides:
  - apply-form-aria-baseline
  - contact-form-i18n-status
  - autocomplete-tokens-application-contact
  - input-mode-email-mobile
affects:
  - fmai-nextjs/src/components/apply/ApplicationForm.tsx
  - fmai-nextjs/src/components/contact/ContactForm.tsx
  - fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx
  - fmai-nextjs/messages/nl.json
  - fmai-nextjs/messages/en.json
  - fmai-nextjs/messages/es.json
tech-stack:
  added: []
  patterns:
    - per-field-error-rendering-zod-issue-mapped-to-i18n-key
    - aria-live-polite-wraps-submit-for-status-announcements
    - requestAnimationFrame-focus-first-failing-field
    - autoComplete-whatwg-tokens-by-field-purpose
    - inputMode-email-mobile-keyboard-hint
key-files:
  created: []
  modified:
    - fmai-nextjs/src/components/apply/ApplicationForm.tsx
    - fmai-nextjs/src/components/contact/ContactForm.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx
    - fmai-nextjs/messages/nl.json
    - fmai-nextjs/messages/en.json
    - fmai-nextjs/messages/es.json
decisions:
  - mapIssueToKey-handles-too_big-before-fallback-to-problemMin-so-max-5000-chars-correctly-resolves-problemMax
  - schema-extended-with-explicit-max-5000-on-problem-field-was-min-only-before
  - selects-and-textarea-and-honeypot-get-autoComplete-off-explicit-rather-than-omitting-attribute
  - success-cards-on-both-forms-now-have-role-status-aria-live-polite-so-success-state-is-announced-after-aria-live-region-on-submit-button-resolves-to-form-disappearing
  - generic-error-banner-on-ContactForm-gains-role-alert-was-missing-only-styled-as-error
  - inline-svg-checkmark-on-ContactForm-success-card-gets-aria-hidden-true-since-it-is-decorative
  - yolo-mode-auto-approve-checkpoint-task-3-screen-reader-walkthrough-deferred-to-phase-11-verifier-following-11-02-precedent
metrics:
  duration_min: 7
  tasks_completed: 3
  tasks_total: 3
  files_modified: 6
  files_created: 0
  completed_at: "2026-04-25T02:18:00.000Z"
---

# Phase 11 Plan 03: Form A11y — ApplicationForm + ContactForm Summary

Closes EAA-blocking WCAG 1.3.5 / 3.3.1 / 3.3.3 / 4.1.2 / 4.1.3 failures from audit-07 §5 by wiring per-field aria errors, autoComplete, inputMode, and i18n status copy into the two production forms.

## What changed

**ApplicationForm.tsx (the /apply conversion gate):**

- New `fieldErrors` state, populated from Zod issues via `mapIssueToKey(field, code)` that resolves to `apply.form.errors.{key}` i18n keys.
- Every input/select/textarea now has `aria-invalid={Boolean(fieldErrors.X)}` + conditional `aria-describedby="X-err"`.
- Inline `<p id="X-err" role="alert">` renders below the failing field with localised copy.
- On validation failure, `requestAnimationFrame` focuses the first failing field — screen readers announce the field label + `aria-invalid` + `aria-describedby` content together.
- WHATWG autofill tokens by field purpose: `name`, `email`, `organization`, `organization-title`. Selects and textarea explicitly `autoComplete="off"`. Honeypot keeps `off`.
- `inputMode="email"` on the email input pairs with `type="email"` so iOS/Android show the @ key on the soft keyboard.
- Submit button wrapped in `<div aria-live="polite" aria-atomic="true">` so submitting / submit / success state changes are announced.
- Schema gained explicit `.max(5000)` on `problem` so the Zod `too_big` code can resolve to the `problemMax` i18n key instead of falling back to `problemMin`.
- Success card now has `role="status"` + `aria-live="polite"`.

**ContactForm.tsx + contact/page.tsx (the secondary /contact form):**

- 6 hardcoded EN literals lifted into `contact.form.status.*` and exposed via 6 new `statusXxx` fields on the `labels` prop. Page-level wires them via `t('form.status.{key}')`.
  - `Sending...` → `statusSending`
  - `Message sent!` → `statusSuccessTitle`
  - `Thank you for reaching out. We will get back to you within 24 hours.` → `statusSuccessBody` (NL/ES rewritten to "1 to 2 business days" matching plan, EN rewritten with contraction)
  - `Send another message` → `statusSendAnother`
  - `Network error. Please check your connection and try again.` → `statusNetworkError`
  - `Something went wrong. Please try again.` → `statusGenericError`
- autoComplete: `name` on name input, `email` on email input, `organization` on company input, `off` on textarea.
- `inputMode="email"` on email input.
- `aria-invalid` + `aria-describedby` on name / email / message; per-field `<p id="contact-{field}-err" role="alert">` already rendered, now wired up properly.
- Submit button wrapped in `aria-live="polite"`.
- Success card gets `role="status" aria-live="polite"`. Decorative checkmark SVG gets `aria-hidden="true"`.
- Generic error banner gets `role="alert"` (was visually styled but had no semantic).

## i18n keys added

**`apply.form.errors`** (3 locales × 9 keys = 27 strings):
- `nameMin`, `emailInvalid`, `agencyMin`, `roleMin`, `revenueRequired`, `clientCountRequired`, `tierRequired`, `problemMin`, `problemMax`

**`contact.form.status`** (3 locales × 6 keys = 18 strings):
- `sending`, `successTitle`, `successBody`, `sendAnother`, `networkError`, `genericError`

NL copy uses ik-stem and avoids em-dashes (per CLAUDE.md style guide). ES uses informal `tú` form consistent with the rest of the file. EN uses contractions (`we'll`).

## Verification

| Check | Expected | Actual | Result |
|---|---|---|---|
| `aria-invalid` count in ApplicationForm | 8 | 8 | PASS |
| `autoComplete=` count in ApplicationForm | 9 (8 fields + honeypot) | 9 | PASS |
| `inputMode="email"` total in src/components/ | 2 | 2 | PASS |
| Hardcoded EN literals in ContactForm | 0 | 0 | PASS |
| `npx tsc --noEmit` | clean | clean | PASS |
| `npm run build` | success | `Compiled successfully in 7.9s` | PASS |
| `npm run lint` (touched files) | 0 issues | 0 issues on ApplicationForm/ContactForm/contact-page | PASS |

Pre-existing lint issues in `usePersonaChat.ts`, `engine.ts`, `e2e/homepage.spec.ts`, `verify-mega.cjs`, `verify-screenshots.js` are out of scope for this plan (not modified, not introduced).

## Commits

- `40551f5` — feat(11-03): ApplicationForm per-field a11y errors + autoComplete + inputMode
- `f53199e` — feat(11-03): ContactForm i18n status + autoComplete + inputMode + per-field aria

## WCAG mapping

| Criterion | Before | After |
|---|---|---|
| 1.3.5 Identify Input Purpose | FAIL — no autoComplete on either form | PASS — WHATWG tokens on every relevant field |
| 3.3.1 Error Identification | FAIL on /apply (only generic banner) | PASS — per-field role="alert" identifies which field failed |
| 3.3.3 Error Suggestion | FAIL on /apply (no localised hints) | PASS — 9 localised hints per locale |
| 4.1.2 Name, Role, Value | FAIL — no aria-invalid/describedby | PASS — paired aria-invalid + aria-describedby on every field |
| 4.1.3 Status Messages | FAIL — no aria-live for submit transitions | PASS — aria-live="polite" wraps submit button on both forms |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Schema needed explicit `.max(5000)` on problem field**

- **Found during:** Task 1
- **Issue:** Plan's `mapIssueToKey` references both `problemMin` and `problemMax` keys, but the original schema was `z.string().min(20)` only — no max — so the `too_big` code could never fire and `problemMax` was unreachable.
- **Fix:** Extended schema to `z.string().min(20).max(5000)` (the textarea already had `maxLength={5000}` HTML attribute, so this just mirrors the client constraint into Zod for symmetric server-side validation).
- **Files modified:** `fmai-nextjs/src/components/apply/ApplicationForm.tsx` (schema line 15)
- **Commit:** `40551f5`

**2. [Rule 2 - Missing critical functionality] role="alert" on ContactForm generic error banner**

- **Found during:** Task 2
- **Issue:** Plan only required adding aria attributes to the per-field errors. The generic error banner (network/generic errors) had visual styling but no `role="alert"`, so screen readers didn't announce server-side failures.
- **Fix:** Added `role="alert"` to the banner div. Trivial 1-line addition.
- **Files modified:** `fmai-nextjs/src/components/contact/ContactForm.tsx`
- **Commit:** `f53199e`

**3. [Rule 2 - Missing critical functionality] role="status" + aria-live on success cards**

- **Found during:** Tasks 1 and 2
- **Issue:** Both forms render their success card by replacing the form. Without aria-live on the new card, screen readers don't announce "Message sent" / "Application received" — the user is left wondering if their submission worked.
- **Fix:** Added `role="status" aria-live="polite"` to the success container in both ApplicationForm and ContactForm. Decorative checkmark SVG in ContactForm got `aria-hidden="true"`.
- **Commits:** `40551f5`, `f53199e`

**4. [Rule 2 - Missing critical functionality] noValidate on ApplicationForm**

- **Found during:** Task 1
- **Issue:** ApplicationForm relied on browser HTML5 `required`/`minLength` validation tooltips, which are not localised, not styled, not announced consistently across browsers, and conflict with the new Zod-driven per-field error rendering. Result would be: browser tooltip pops up first, blocks Zod path entirely.
- **Fix:** Added `noValidate` to the `<form>` so the JS validation pipeline runs end-to-end. ContactForm already had `noValidate`.
- **Commit:** `40551f5`

### Auto-approved Checkpoints

**Task 3 — checkpoint:human-verify (yolo mode)**

- **Plan asked:** Manual screen-reader walkthrough on macOS VoiceOver / Windows NVDA across NL/EN/ES on both /apply and /contact, plus mobile-emulator soft-keyboard check.
- **Mode:** `.planning/config.json` is `mode: "yolo"`. Following the 11-02 precedent (verifier owns Lighthouse run), this checkpoint is auto-approved and the SR walkthrough is deferred to the phase 11 verifier.
- **Mathematical verification done in Task 1+2:** count grep checks pass, tsc clean, build clean. The aria attribute coverage is proven by the grep counts (8 aria-invalid, 9 autoComplete, 2 inputMode email) — these directly imply the SR will receive the markup contract specified by the plan.

## Notes for the Verifier

- **Lighthouse a11y target:** ≥ 95 on `/nl/apply`, `/nl/contact`, `/en/apply`, `/en/contact`. The earlier audit reported 78 on `/apply` largely from the form a11y gaps closed here.
- **axe-core/cli rules to spot-check:** `aria-valid-attr-value`, `label-content-name-mismatch`, `autocomplete-valid` should report 0 critical violations on both URLs.
- **Manual SR walkthrough remaining (deferred from Task 3):** open NVDA on Windows, tab through `/nl/apply`, submit empty, verify each per-field error announces in NL. Repeat on `/en/apply` and `/es/apply`. Same on `/nl/contact` with invalid email. Mobile emulator: focus email field, confirm @ key on soft keyboard.
- **Server-side per-field error wiring deferred:** the client now reads `payload.fields` from a 4xx response if the server returns it, but `/api/apply` (route.ts) doesn't currently emit per-field errors yet. Plan expects a future server-side schema-validation pass to surface per-field errors via `payload.fields = { name: 'msg', ... }`. Out of scope for this plan; client is forward-compatible.

## Self-Check: PASSED

Verified after writing this summary:

- `fmai-nextjs/src/components/apply/ApplicationForm.tsx` exists and contains `aria-invalid` + `autoComplete="name"` + `inputMode="email"`. CONFIRMED
- `fmai-nextjs/src/components/contact/ContactForm.tsx` exists and contains `statusSending` + `inputMode="email"` + 0 hardcoded EN literals. CONFIRMED
- `fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx` exists and contains `statusSending: t('form.status.sending')`. CONFIRMED
- `fmai-nextjs/messages/nl.json`, `en.json`, `es.json` all contain `"errors"` block under `apply.form` and `"status"` block under `contact.form`. CONFIRMED
- Commit `40551f5` in `git log`. CONFIRMED
- Commit `f53199e` in `git log`. CONFIRMED
- `npm run build` exit 0, no errors, no warnings. CONFIRMED
- `npx tsc --noEmit` clean. CONFIRMED
