---
phase: 15-conversion-accelerators
plan: 01
subsystem: ui
tags: [conversion, mobile-cta, i18n, next-intl, react, accessibility, sessionstorage]

# Dependency graph
requires:
  - phase: 11-eaa-accessibility-compliance
    provides: focus-visible ring tokens + reduced-motion baseline used by StickyMobileCTA + demoted hero text link
provides:
  - Single-dominant home hero CTA discipline (one size=lg button + small secondary text link)
  - Reusable StickyMobileCTA client component (md:hidden, scroll-gated, dismissible, input-aware)
  - PageShell.showStickyCta opt-in flag wired on 17 route leaves x 3 locales = 51 prerendered pages
  - stickyCta i18n namespace in nl/en/es (label + subLabel + dismiss + srLandmark)
affects:
  - 15-02 (post-submit Calendly embed reuses ApplicationForm; sticky CTA rolls out across funnel)
  - 15-04 (LeadMagnetCTA can co-exist; sticky bar stays at bottom of viewport, lead magnet inline)
  - 15-05 (pricing FAQ promotion; sticky CTA already on pricing route)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "PageShell opt-in feature flag (showStickyCta) — keeps cross-cutting UI off by default and explicit per-route"
    - "Lazy useState initializer for sessionStorage rehydration (avoids React Compiler cascading-render warning vs setState-in-effect)"
    - "Locale-aware Link from @/i18n/navigation in client component to preserve nl/en/es URL prefix on all CTA hops"
    - "Palette-token only in new components (bg-bg-deep, text-bg-deep, accent-system) — passes scripts/verify-palette.sh gate set up in Phase 12-01"

key-files:
  created:
    - "fmai-nextjs/src/components/ui/StickyMobileCTA.tsx"
  modified:
    - "fmai-nextjs/src/app/[locale]/page.tsx"
    - "fmai-nextjs/src/components/layout/PageShell.tsx"
    - "fmai-nextjs/src/components/skills/SkillPageTemplate.tsx"
    - "fmai-nextjs/src/app/[locale]/(marketing)/memory/page.tsx"
    - "fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx"
    - "fmai-nextjs/src/app/[locale]/(marketing)/founding-member/page.tsx"
    - "fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx"
    - "fmai-nextjs/messages/nl.json"
    - "fmai-nextjs/messages/en.json"
    - "fmai-nextjs/messages/es.json"

key-decisions:
  - "Demoted hero secondary CTAButton (variant=secondary size=lg) to a plain text Link styled at one-third visual weight (text-sm + text-text-muted). Preserves underline-on-hover + focus-visible ring for a11y. Stacks vertically (flex-col gap-3) on every viewport so primary CTA dominates regardless of screen size."
  - "PageShell opt-in (showStickyCta default false) chosen over implicit-everywhere or per-page imports. Avoids accidental render on /apply or /contact (where the bar would compete with the form CTA) and keeps the dependency injection explicit."
  - "Single edit on SkillPageTemplate.tsx covers all 12 skill pages (one PageShell instance per template). Avoids 12 near-identical page edits and means future skill pages inherit the bar automatically."
  - "Used bg-bg-deep + text-bg-deep palette tokens instead of plan-spec literals #0A0E27 / #05080f because those are deprecated palette colors enforced via scripts/verify-palette.sh (Phase 12-01 gate). Palette gate stayed green."
  - "Used Link from @/i18n/navigation (not next/link as plan suggested) so the /apply destination keeps its locale prefix in nl/en/es. Matches the established pattern in chatbot/ProgressiveCTA.tsx and 5 other client components."
  - "Lazy useState initializer (readInitialDismissed) instead of useEffect setState for sessionStorage rehydration. React Compiler flagged the setState-in-effect as a cascading-render risk; lazy init is the canonical fix and remains hydration-safe because the component returns null until visible flips on scroll (post-hydration)."

patterns-established:
  - "showStickyCta = false by default in PageShell — opt-in for high-intent funnel pages, opt-out for forms / legal / blog. Future route additions inherit the safe default."
  - "Lazy state initializer reads browser-only APIs (sessionStorage) on first render, returning a safe default during SSR. Pattern reusable for future sessionStorage-backed UI state (banners, dismissibles)."

requirements-completed: [WEB-01]

# Metrics
duration: 19min
completed: 2026-04-27
---

# Phase 15 Plan 01: Hero CTA Demote + StickyMobileCTA Summary

**Single-dominant home hero CTA + new dismissible mobile bottom bar wired across home, memory, pricing, founding-member, SKC case study, and all 12 skill pages (17 route leaves x 3 locales).**

## Performance

- **Duration:** 19 min
- **Started:** 2026-04-27T13:23:47Z
- **Completed:** 2026-04-27T13:43:08Z
- **Tasks:** 3 of 3 (Task 4 checkpoint auto-approved per yolo-mode)
- **Files modified:** 10 (1 created, 9 modified)

## Accomplishments

- Closed audit 03 leak #8 (split hero CTA): hero now shows ONE size=lg primary button (`Plan een gesprek`) + a small unstyled text link (`Leer Clyde kennen`) at one-third visual weight. Stacked vertically.
- Closed audit 03 leak #9 (no sticky mobile CTA): new `StickyMobileCTA` component appears after 50% scroll on mobile, dismisses to sessionStorage, hides while text inputs are focused (iOS keyboard dodge), respects prefers-reduced-motion via `motion-safe:` Tailwind prefix, and ships a screen-reader landmark (`role=complementary`).
- Wired the bar opt-in via a single PageShell flag — 5 explicit page wires + 1 SkillPageTemplate edit cover 17 route leaves multiplied across nl/en/es = 51 prerendered pages with sticky CTA.
- Translation keys (`stickyCta.label`, `subLabel`, `dismiss`, `srLandmark`) added to all three locale files; NL canonical glossary respected (`Plan een gesprek`, never "Sign up" / "Try free").
- Build green: 88/88 SSG pages prerender, palette gate green, type-check clean. Zero new lint warnings introduced (the one React Compiler warning my Task 2 surfaced was self-fixed in a Rule 1 deviation commit before Task 4).

## Task Commits

1. **Task 1: Demote home hero secondary CTA to text link** — `8a4c601` (feat)
2. **Task 2: Create StickyMobileCTA component + i18n keys** — `bd58d87` (feat)
3. **Task 3: Wire StickyMobileCTA on 15 routes via PageShell flag** — `79c0f18` (feat)
4. **Deviation: Lazy-initialize dismissed state to fix React Compiler warning** — `200dc31` (fix)

Plan metadata commit will follow this SUMMARY write.

## Files Created/Modified

- `fmai-nextjs/src/components/ui/StickyMobileCTA.tsx` — NEW. Client component, ~125 lines, three useEffect listeners (scroll/focus-in/focus-out), lazy useState for sessionStorage, gtag analytics hook for `cta_click` event with `location=sticky_mobile`.
- `fmai-nextjs/src/components/layout/PageShell.tsx` — added `showStickyCta?: boolean` prop, default false. Renders `<StickyMobileCTA />` as sibling of `<main>` when flag true. JSX wrapper now Fragment so existing `min-h-screen pt-16` styling on main is preserved.
- `fmai-nextjs/src/components/skills/SkillPageTemplate.tsx` — opt-in flag added to single PageShell usage; covers 12 skill pages.
- `fmai-nextjs/src/app/[locale]/page.tsx` — hero CTA demote (Task 1) + `<PageShell showStickyCta>` (Task 3).
- `fmai-nextjs/src/app/[locale]/(marketing)/memory/page.tsx` — opt-in flag.
- `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx` — opt-in flag.
- `fmai-nextjs/src/app/[locale]/(marketing)/founding-member/page.tsx` — opt-in flag.
- `fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx` — opt-in flag.
- `fmai-nextjs/messages/nl.json` — new `stickyCta` namespace (4 keys, NL canonical `Plan een gesprek`).
- `fmai-nextjs/messages/en.json` — new `stickyCta` namespace (`Book a call`).
- `fmai-nextjs/messages/es.json` — new `stickyCta` namespace (`Reserva una llamada`).

## Decisions Made

See frontmatter `key-decisions`. Six substantive decisions logged.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Lazy-initialize dismissed state in StickyMobileCTA**
- **Found during:** Task 4 pre-checkpoint build verification (`npm run build`).
- **Issue:** React Compiler / `react-hooks/setState-in-effect` rule flagged the rehydration pattern `useEffect(() => setDismissed(true))` at line 34 as a cascading-render risk. Pattern would cause every mounted instance to render once with `dismissed=false`, then re-render after the effect set the true value — perceptible flash of bar visibility on re-visits within the session.
- **Fix:** Replaced the post-mount setState with a lazy useState initializer that reads sessionStorage on the first client render. Hydration-safe because the component returns `null` until `visible` flips on scroll (which only happens post-hydration), so SSR (`dismissed=false, visible=false → null`) and CSR (`dismissed=may-be-true, visible=false → null`) initial renders both produce nothing.
- **Files modified:** `fmai-nextjs/src/components/ui/StickyMobileCTA.tsx`
- **Verification:** `npm run build` re-run, exit 0, zero StickyMobileCTA mentions in lint output. Type-check clean.
- **Committed in:** `200dc31` (separate fix commit)

**2. [Rule 1 - Bug] Replaced deprecated palette literals in plan-suggested className with active palette tokens**
- **Found during:** Task 2 component creation (caught during write).
- **Issue:** Plan specified `bg-[#0A0E27]/95` and `text-[#05080f]` — both are deprecated palette colors per `fmai-nextjs/CLAUDE.md` "Deprecated palette" section, enforced by `scripts/verify-palette.sh` (Phase 12-01 regression gate). Committing them would have failed the palette CI check.
- **Fix:** Substituted active palette tokens: `bg-bg-deep/95` (resolves to `#0a0d14`, the canonical bg-deep) for the bar background; `text-bg-deep` for the primary CTA text (high-contrast against teal `accent-system`).
- **Files modified:** `fmai-nextjs/src/components/ui/StickyMobileCTA.tsx` (during Task 2 creation, not a separate commit)
- **Verification:** `npm run check:palette` → `PASS: no stale palette hex in src/`.
- **Committed in:** `bd58d87` (folded into Task 2 commit)

**3. [Rule 3 - Blocking] Used Link from @/i18n/navigation instead of next/link**
- **Found during:** Task 1 (hero demote) + Task 2 (StickyMobileCTA).
- **Issue:** Plan said `import Link from 'next/link'` (verify it's already present). The page.tsx file imports `Link` from `@/i18n/navigation` (next-intl locale-aware wrapper), not `next/link`. Switching to `next/link` would have broken the locale prefix on `/skills/clyde` and `/apply` (visitors on `/nl` clicking the demoted link would hit `/skills/clyde` instead of `/nl/skills/clyde`, defeating Phase 1 i18n routing).
- **Fix:** Kept the existing `@/i18n/navigation` Link import on page.tsx. Used the same import in StickyMobileCTA.tsx (matches established pattern in 5 other client components: `chatbot/ProgressiveCTA.tsx`, `chatbot/ChatWidget.tsx`, etc.).
- **Files modified:** none beyond planned files.
- **Verification:** Type-check clean. Build prerendered all 51 nl/en/es route leaves successfully.
- **Committed in:** Folded into Task 1 (`8a4c601`) + Task 2 (`bd58d87`) commits.

---

**Total deviations:** 3 auto-fixed (2 Rule 1 bugs + 1 Rule 3 blocking)
**Impact on plan:** All three were necessary for correctness (lint regression, palette regression, locale-prefix regression). Zero scope creep — every fix was strictly inside Task 1/2/3 boundaries.

## Issues Encountered

- Task 4 is a `checkpoint:human-verify` gate. With `.planning/config.json` `mode: "yolo"` and the established project pattern (Phase 11-02, 11-03, 12-02 all show `yolo-mode auto-approve` in STATE.md), the executor auto-approved the checkpoint and deferred browser-flow visual verification (the 13-step manual test list in the plan) to the verifier agent. Build green, palette green, type-check clean, 6 explicit `showStickyCta` opt-in wires confirmed via grep — all automated checks pass; the Playwright visual flow is verifier territory.

## Next Phase Readiness

- 15-02 (post-submit Calendly embed on ApplicationForm) is unblocked — relies on Phase 10 forms (already wired) and Phase 12 brand assets (Sindy photo) but does not depend on 15-01.
- 15-03 (SKC case study rewrite) blocked on Sindy interview + consent (DECISIONS Q1) — Daley to schedule.
- 15-04 (lead magnet) blocked on Resend Audience ID provisioning + Canva PDF (DECISIONS Q2 + Q4).
- 15-05 (pricing FAQ promotion + founding counter) is independent; can proceed any time.

**Verifier agent should validate:**
1. Bar appears at 50% scroll on mobile (375-390px viewport) on home, memory, pricing, founding-member, SKC case, all 12 skill pages.
2. Bar is hidden on desktop (>=768px) on every route.
3. Bar is absent on `/apply`, `/contact`, `/about`, `/how-it-works`, legal pages, blog.
4. Dismiss button persists across reload in same tab (sessionStorage), reappears in fresh tab.
5. Bar hides when typing into a text input/textarea (focus-within shadow DOM event).
6. Locale labels render correctly: NL `Plan een gesprek · 30 min met Daley`, EN `Book a call · 30 min with Daley`, ES `Reserva una llamada · 30 min con Daley`.
7. Tab navigation reaches the link + dismiss button with visible focus ring.

---
*Phase: 15-conversion-accelerators*
*Completed: 2026-04-27*

## Self-Check: PASSED

All 12 listed key files verified on disk. All 4 task/fix commits verified in git log.

