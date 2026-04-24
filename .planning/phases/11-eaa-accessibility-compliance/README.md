# Phase 11: EAA Accessibility Compliance

## Goal

Lift the `fmai-nextjs` marketing site to WCAG 2.2 AA for the five critical-path failures identified in the 2026-04-24 full audit, so the site is legally defensible under the European Accessibility Act (EAA, Directive 2019/882, in force per 2025-06-28) for its primary conversion flow (`/apply`, header navigation, forms, motion, contrast).

## Legal basis

- EAA / Directive 2019/882 applies to digital services offered to EU consumers. The `/apply` form is a contract-initiation step — arguably in scope.
- Dutch enforcement: College voor de Rechten van de Mens, ACM, Autoriteit Persoonsgegevens. Reference: `toegankelijkheid.nl`.
- Technical standard: WCAG 2.2 AA (EN 301 549 Annex A references WCAG 2.1 AA; 2.2 is the current working baseline).

## Depends on

- Phase 09 (codebase cleanup) — recommended, not blocking. The hardcoded English strings in `ContactForm.tsx` were not addressed in 09-03, so Plan 11-03 will pick them up.
- Phase 10 — skipped (decimal numbering intentionally free for a future insertion).

## Success criteria (what must be TRUE)

1. Every page exposes a keyboard-reachable skip-to-content link that jumps past the header on first Tab.
2. The Skills mega-menu in `HeaderClient.tsx` is fully keyboard-operable: Enter or Space opens the disclosure, ArrowDown moves to the first menu item, ArrowUp/ArrowDown navigate within it, Escape closes and returns focus to the trigger, Tab exits the menu forward.
3. `--color-text-muted` is raised from `#5a6378` (3.23:1) to `#8C98AD` (6.67:1 on `#0a0d14`), fixing every downstream `text-text-muted` usage site automatically.
4. All 17 CSS keyframes in `globals.css` plus the four inline `fadeInUp` + one `fadeIn` animations on `src/app/[locale]/page.tsx` are paused under `@media (prefers-reduced-motion: reduce)`.
5. Global `*:focus-visible` outline is applied in `globals.css` (2px solid `var(--color-accent-system)`, offset 2px), and `html { scroll-padding-top: 5rem; }` respects the sticky 64 px header for in-page anchor jumps.
6. `BookingModal` stores `document.activeElement` on open and calls `.focus()` on it when closed, so screen-reader users land back on the trigger.
7. `ApplicationForm` shows per-field errors (`<p id="{field}-err" role="alert">`), sets `aria-invalid="true"` and `aria-describedby="{field}-err"` on failed inputs, and exposes the correct `autoComplete` token on each of the 8 fields (`name`, `email`, `organization`, `organization-title`; `off` on the 3 selects and the honeypot).
8. `inputMode="email"` is set on every email input across `ApplicationForm.tsx`, `ContactForm.tsx`.
9. All four hardcoded English strings in `ContactForm.tsx` (`'Sending...'`, `'Message sent!'`, `'Thank you for reaching out...'`, `'Send another message'`) plus `'Network error.'` plus `'Something went wrong. Please try again.'` are moved to `messages/{nl,en,es}.json` under a new `contact.form.status.*` namespace.
10. `npm run build` passes. `npx @axe-core/cli http://localhost:3000/nl --exit` returns 0 critical violations for the flagged criteria.

## Plans

- **11-01** — Skip-to-content + keyboard mega-menu + focus-visible + scroll-padding + modal focus-return (Wave 1, blockers B-6 + P1-14 + BookingModal return-focus)
- **11-02** — Contrast token raise + complete `prefers-reduced-motion` coverage (Wave 1, independent of 11-01. Blockers B-7 + P1-15)
- **11-03** — ApplicationForm per-field errors + ContactForm i18n + `inputMode` + autoComplete tokens (Wave 2, depends on 11-01 passing so shared focus-visible ring is in place before form rework. Blocker B-8 + T-6 hardcoded-strings slice)

## Audit references

- `docs/audits/2026-04-24-full-audit/MASTER-ACTION-PLAN.md` — TL;DR, theme T-5, blockers B-6, B-7, B-8, P1 items 14 + 15
- `docs/audits/2026-04-24-full-audit/07-ux-accessibility.md` — full content, sections 2.1 to 2.4, 5, 6, 8, 10, A.5
- `.planning/phases/11-eaa-accessibility-compliance/RESEARCH.md` — WCAG 2.2 criteria mapping, keyboard disclosure patterns, `prefers-reduced-motion` syntax, contrast math, next-intl lang handling

## Out of scope for this phase

- Cookie banner stale-palette fix (P1 #16; handled in a follow-up hygiene phase)
- Footer social-icon hit-area fix (P2, low impact)
- Character counter on problem textarea (P3, UX polish)
- BookingModal focus trap re-query for Calendly iframe (P2)
- Mobile sticky Apply CTA carousel (P3)
- ES native-review of error messages (S-8)

All of the above are tracked in the master action plan and belong to separate phases.

## Estimated effort

5 hours total, roughly:

- 11-01: 2.5 hours
- 11-02: 1 hour
- 11-03: 1.5 hours

Matches the "P0 ~5.5 hours + P1 ~4 hours" budget in the audit section 15.


---

## Committed Decisions (2026-04-24)

Alle open questions voor deze phase zijn vastgelegd in `.planning/phases/DECISIONS-2026-04-24.md`.

Execute agents: lees dat document vóór elke `plan-XX` die een decision-gate heeft. De decisions zijn bindend voor deze wave, reversible via commit als later blijkt dat een keuze herziening vereist.
