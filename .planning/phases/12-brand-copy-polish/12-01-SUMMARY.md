---
phase: 12-brand-copy-polish
plan: 01
subsystem: brand-assets-palette
tags:
  - brand
  - palette-migration
  - og-image
  - schema
  - i18n
dependency-graph:
  requires: []
  provides:
    - public/og-image.png (1200x630 social share)
    - public/logo.png (512x512 schema.org logo)
    - npm run check:palette (regression gate)
    - /api/og dynamic OG route
    - errors.generic.retryButton + homeButton i18n keys (NL/EN/ES)
  affects:
    - OrganizationJsonLd.logo field
    - All pages with stale #00D4FF / #050814 / #A855F7 / #0A0E27 refs
tech-stack:
  added:
    - sharp (for PNG generation, transitive via next 16)
    - next/og (ImageResponse for /api/og route)
  patterns:
    - design-token CSS-vars (--color-*) over hardcoded hex
    - Tailwind 4 @theme tokens auto-resolve as utility classes
    - bash regression script wired to npm script
key-files:
  created:
    - fmai-nextjs/public/og-image.png
    - fmai-nextjs/public/logo.png
    - fmai-nextjs/scripts/generate-brand-assets.mjs
    - fmai-nextjs/scripts/verify-palette.sh
    - fmai-nextjs/src/lib/og-theme.ts
    - fmai-nextjs/src/app/api/og/route.tsx
  modified:
    - fmai-nextjs/CLAUDE.md (Theme section rewritten)
    - fmai-nextjs/package.json (check:palette script)
    - fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx
    - fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx
    - fmai-nextjs/src/app/[locale]/not-found.tsx
    - fmai-nextjs/src/app/[locale]/error.tsx
    - fmai-nextjs/src/components/chatbot/demo/{DemoCheckpoint,DemoCompletionCard,DemoOrchestrator,DemoProgress,DemoScenarioCard}.tsx
    - fmai-nextjs/src/components/chatbot/{DemoContextCard,PersonaSelector}.tsx
    - fmai-nextjs/src/components/memory/MemoryLayersDiagram.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/memory/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/about/page.tsx
    - fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx
    - fmai-nextjs/src/components/interactive/CalendlyModal.tsx (deviation)
    - fmai-nextjs/src/components/ui/QuickAnswerBlock.tsx (deviation)
    - fmai-nextjs/src/lib/email/apply-templates.ts (deviation)
    - fmai-nextjs/src/lib/email/contact-templates.ts (deviation)
    - fmai-nextjs/src/lib/og-image.tsx (deviation)
    - fmai-nextjs/messages/{nl,en,es}.json (errors.generic keys)
decisions:
  - Generated brand assets programmatically via sharp + SVG instead of waiting for Figma export. Reproducible, deterministic, re-runnable.
  - logo.png is a geometric F-mark in accent-system teal on transparent background, framed by rounded square stroke. Pragmatic placeholder until brand polish.
  - CookieConsentBanner inline-styles migrated to CSS-var(--color-*) refs because react-cookie-consent does not pick up Tailwind utility classes on its style props.
  - error.tsx hides raw error.message — security / info-leak concern. Renamed prop to _error with ESLint suppress.
  - Added retryButton + homeButton message keys instead of renaming legacy tryAgain — keeps backward compat with any other consumer.
  - Email templates (apply, contact) and Satori OG (lib/og-image.tsx) keep literal hex (no CSS-var support in those render contexts) but values updated to current palette: #0a0d14 / #00d4aa.
  - Dynamic /api/og route shipped (Task 9) but not yet wired into per-locale metadata — static og-image.png stays default until visual review.
  - MemoryLayersDiagram context layer swapped purple #A855F7 to amber accent-human, deliberate normalization (purple was never in design system).
metrics:
  duration_minutes: 16
  completed: 2026-04-25T05:40:42Z
  tasks_total: 9
  tasks_completed: 9
  files_changed: 24
  commits: 9
---

# Phase 12 Plan 01: Brand Assets + Palette Migration Summary

Phase 12-01 closes the brand-asset and palette-dialect gaps surfaced by the 2026-04-24 audit. Two static brand assets shipped (og-image.png 1200x630, logo.png 512x512) generated reproducibly via sharp+SVG from globals.css design tokens, every deprecated `#050814` / `#00D4FF` / `#A855F7` / `#0A0E27` ref purged from src/, error.tsx fully localized in NL/EN/ES with no purple "!" glyph, regression gate via `npm run check:palette` wired into package.json, CLAUDE.md Theme section rewritten to match live `globals.css @theme`, and an opt-in `/api/og` edge route shipped for future per-locale dynamic OG variants.

## What Shipped

### Brand assets (Task 1)

| File | Dimensions | Size | Purpose |
|---|---|---|---|
| `public/og-image.png` | 1200x630 | 47.4 KB | Social share card (LinkedIn, Twitter, WhatsApp), referenced by OG meta tags |
| `public/logo.png` | 512x512 | 7.9 KB | OrganizationJsonLd.logo for schema.org crawlers, transparent background |

Generation script (`scripts/generate-brand-assets.mjs`) renders branded SVG via sharp. Sharp ships transitively with next 16 — zero new dependency. Re-runnable any time the brand visual language shifts; commit hash stays deterministic.

### Palette migration sweep

Total stale hex refs purged: **~30 across 17 files**.

Token mapping applied:

| Deprecated | Replacement (utility) | Replacement (var) | Replacement (literal) |
|---|---|---|---|
| `#050814` | `bg-deep` | `var(--color-bg-deep)` | `#0a0d14` |
| `#00D4FF` | `accent-system` | `var(--color-accent-system)` | `#00d4aa` |
| `#A855F7` | `accent-human` | `var(--color-accent-human)` | `#f5a623` |
| `#0A0E27` | `bg-surface` | `var(--color-bg-surface)` | `#111520` |

Files clustered by render context:

- **Tailwind utility surface (Tasks 3-6)**: bracket arbitrary `text-[#00D4FF]` → `text-accent-system`. CookieConsentBanner used inline styles so migrated to `var(--color-*)` (react-cookie-consent style prop does not consume Tailwind classes).
- **Email templates** (`src/lib/email/*-templates.ts`, deviation): email clients have no CSS-var support, so literal hex stays but values updated to `#0a0d14` / `#00d4aa`.
- **Satori OG** (`src/lib/og-image.tsx`, deviation): same Satori limitation — literal hex updated.

### Localization fix (Task 5)

`error.tsx` rewritten:
- Wired up `useTranslations('errors.generic')` — was hardcoded EN ("Something went wrong", "Try again").
- Removed `error.message` rendering — info-leak vector.
- Removed purple `#A855F7` "!" glyph — purple was never in design system.
- Added new keys `retryButton` + `homeButton` to `errors.generic` block in messages/{nl,en,es}.json. Kept legacy `tryAgain` for backward compat.

### Regression gate (Task 7)

`scripts/verify-palette.sh` greps `src/` for the four deprecated tokens across `.tsx` / `.ts` / `.css`. Wired as `npm run check:palette`. Currently opt-in (not prebuild) — the plan defers prebuild integration until Daley confirms zero false-positives across weeks of use.

### Operating manual update (Task 8)

`fmai-nextjs/CLAUDE.md` Theme section rewritten line-for-line against `src/app/globals.css` `@theme` block. Inter typography reference replaced with DM Sans (live deployed font). Added Deprecated palette block listing the four forbidden tokens and pointing at the npm gate.

### Dynamic OG route (Task 9, optional shipped)

`/api/og?locale=nl` — edge handler renders 1200x630 ImageResponse with Clyde headline + locale-specific tagline (NL/EN/ES). `s-maxage=31536000` cache-control because output is deterministic. Not yet wired into per-locale metadata — static `/og-image.png` stays default until visual review.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Stale hex in src/lib/email/* and src/lib/og-image.tsx**
- **Found during:** Task 6 verification
- **Issue:** Plan listed only chatbot demo + memory + about + case-studies refs. Full `src/` sweep surfaced 13 additional refs in `src/lib/email/apply-templates.ts`, `src/lib/email/contact-templates.ts`, and `src/lib/og-image.tsx` that would have left `verify-palette.sh` (Task 7) red.
- **Fix:** Updated literal hex values (CSS-var migration not possible in email-client / Satori contexts): `#0A0E27` → `#0a0d14`, `#00D4FF` → `#00d4aa`. Same visual intent, current values.
- **Files modified:** src/lib/email/apply-templates.ts, src/lib/email/contact-templates.ts, src/lib/og-image.tsx
- **Commit:** d0a0781

**2. [Rule 3 - Blocking] Stale hex in CalendlyModal.tsx and QuickAnswerBlock.tsx**
- **Found during:** Task 6 sweep
- **Issue:** Plan's component list missed two files: `src/components/interactive/CalendlyModal.tsx:54` (`bg-[#0A0E27]`) and `src/components/ui/QuickAnswerBlock.tsx:8` (`border-[#00D4FF]`, `bg-[#00D4FF]/5`). verify-palette.sh would have failed.
- **Fix:** Migrated to design-token utilities (`bg-bg-surface`, `border-accent-system`, `bg-accent-system/5`).
- **Note:** CalendlyModal also has `primary_color=00D4FF` in the Calendly URL (line 12) — that controls 3rd-party Calendly widget UI, deliberately left untouched (different scope).
- **Files modified:** src/components/interactive/CalendlyModal.tsx, src/components/ui/QuickAnswerBlock.tsx
- **Commit:** d0a0781

**3. [Rule 2 - Quality] Hardcoded colors in CookieConsentBanner that match current values**
- **Found during:** Task 3
- **Issue:** Beyond the plan-listed `#050814` / `#00D4FF` / `rgba(0, 212, 255, 0.2)`, the file had `#E8ECF4` and `#9BA3B5` literals which match current text-primary / text-secondary values but bypass the token system.
- **Fix:** Routed through `var(--color-text-primary)` and `var(--color-text-secondary)`. Single source of truth means future palette polishes propagate without revisiting this file.
- **Files modified:** src/components/interactive/CookieConsentBanner.tsx
- **Commit:** 1e5f7a3

**4. [Rule 1 - Bug] Lint hits in just-committed files**
- **Found during:** Post-Task-9 lint check
- **Issue:** The error.tsx commit left `_error` unused-vars warning, and generate-brand-assets.mjs had two unused eslint-disable directives (no-console rule does not fire in .mjs CLI scripts).
- **Fix:** Switched error.tsx prop-rename to function-level `// eslint-disable-next-line @typescript-eslint/no-unused-vars`. Removed the two unused disables in generate-brand-assets.mjs.
- **Files modified:** src/app/[locale]/error.tsx, scripts/generate-brand-assets.mjs
- **Commit:** 2a79a8b

### Plan Refinements

- **Task 1 (manual asset):** Plan asked Daley to design assets in Figma. Auto-mode constraint meant no Figma access, so generated programmatically via sharp+SVG with design-token literals from globals.css. Reproducible, deterministic, lower stakes — Daley can re-run the script with adjusted SVG any time without losing precision.

## Pre-existing Issues (Out of Scope)

The lint pass surfaced 36 errors / 17 warnings repo-wide. **None were introduced by this plan**:
- `src/components/chatbot/demo/DemoOrchestrator.tsx:210` — "Cannot call impure function during render" (Date.now in JSX)
- `src/components/interactive/CalendlyModal.tsx:42` + `CookieConsentBanner.tsx:19` — "Calling setState synchronously within an effect"
- 2 require-imports errors in standalone `.cjs` / `.js` audit scripts at repo root

These are pre-existing patterns that pre-date Phase 12. Per plan scope_boundary, deferred — not blocking for the palette migration goal.

## Tasks Completed

| # | Task | Commit | Files |
|---|---|---|---|
| 1 | Generate og-image.png + logo.png brand assets | 2ec8fa6 | 3 |
| 2 | Update OrganizationJsonLd logo path | d590a41 | 1 |
| 3 | Migrate CookieConsentBanner palette to CSS vars | 1e5f7a3 | 1 |
| 4 | Migrate not-found.tsx to design tokens | d16fe21 | 1 |
| 5 | Localize error.tsx + remove purple | 840660a | 4 |
| 6 | Palette sweep across components, email, OG | d0a0781 | 16 |
| 7 | check:palette regression script | ff29d7c | 2 |
| 8 | CLAUDE.md Theme section rewrite | 15eef44 | 1 |
| 9 | /api/og dynamic OG route + lint cleanup | 2a79a8b | 4 |

Total: 9 commits, ~30 hex refs purged, 24 files touched.

## Verification

```
=== Verify OG asset ===
public/og-image.png: PNG image data, 1200 x 630, 8-bit/color RGBA
public/logo.png: PNG image data, 512 x 512, 8-bit/color RGBA

=== Verify check:palette ===
PASS: no stale palette hex in src/

=== Verify CLAUDE.md ===
PASS

=== Verify error.tsx ===
PASS

=== Verify CookieConsentBanner ===
PASS

=== OrganizationJsonLd ===
10:    logo: `${SITE_URL}/logo.png`,

=== Build ===
Compiled successfully in 8.8s
```

All eight `must_haves.truths` from plan frontmatter pass. All four `must_haves.artifacts` shipped (og-image.png, logo.png, /api/og route, verify-palette.sh).

## Self-Check: PASSED

Verified all created files exist on disk:
- public/og-image.png — FOUND
- public/logo.png — FOUND
- scripts/generate-brand-assets.mjs — FOUND
- scripts/verify-palette.sh — FOUND
- src/lib/og-theme.ts — FOUND
- src/app/api/og/route.tsx — FOUND
- .planning/phases/12-brand-copy-polish/12-01-SUMMARY.md — FOUND (this file)

Verified all 9 commits exist in git log:
- 2ec8fa6, d590a41, 1e5f7a3, d16fe21, 840660a, d0a0781, ff29d7c, 15eef44, 2a79a8b — all FOUND
