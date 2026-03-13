---
title: 'Phase 09 Plan 05: Utility Components & CSS — Living System Conversion Summary'
tags: [phase-09, living-system, conversion, utility-components, css]
created: 2026-03-13
phase: 09-living-system-page-conversion
plan: '05'
subsystem: common-components
dependency_graph:
  requires:
    - 09-01
    - 09-02
    - 09-03
    - 09-04
  provides:
    - LoadingFallback with teal spinner on bg-bg-deep
    - FloatingNav with Living System surface/border tokens
    - CookieConsent banner with Living System hex values via inline style props
    - cta-pulse keyframe using teal rgba(0,212,170)
  affects:
    - All pages (LoadingFallback used on every lazy route)
    - All pages (FloatingNav is persistent sidebar/bottom nav)
    - All pages (CookieConsent appears on first visit)
    - All CTAs (cta-pulse animation via index.css)
tech_stack:
  added: []
  patterns:
    - react-cookie-consent inline style props override Tailwind (use style/buttonStyle/declineButtonStyle props)
    - CSS keyframe color replacement (rgba(79,70,229) indigo → rgba(0,212,170) teal)
    - FloatingNav glassmorphism removed entirely — bg-bg-surface solid surface with border-border-primary
key_files:
  created: []
  modified:
    - src/components/common/LoadingFallback.tsx
    - src/components/common/FloatingNav.tsx
    - src/components/common/CookieConsent.tsx
    - src/index.css
decisions:
  - 'FloatingNav tooltip arrows use bg-bg-elevated with border-border-primary (not inline style rgba) for consistency'
  - 'CookieConsent text elements use inline style={{ color }} because react-cookie-consent injects styles that override Tailwind classes'
  - 'index.css backdrop-blur utility class definitions retained — they define the classes themselves, not apply glassmorphism to new elements'
metrics:
  duration_seconds: 900
  completed_date: 2026-03-13
  tasks_completed: 2
  tasks_total: 2
  files_modified: 4
---

# Phase 09 Plan 05: Utility Components & CSS — Living System Conversion Summary

**One-liner:** LoadingFallback, FloatingNav, CookieConsent, and index.css cta-pulse converted to Living System teal/amber tokens — completing full-site utility migration.

## Status

COMPLETE — all tasks executed, visual audit approved.

## Tasks Completed

| #   | Task                                                           | Commit  | Files                                                  |
| --- | -------------------------------------------------------------- | ------- | ------------------------------------------------------ |
| 1   | Convert LoadingFallback, FloatingNav, CookieConsent, index.css | 756724b | LoadingFallback, FloatingNav, CookieConsent, index.css |
| 2   | Full-site Living System visual audit                           | 488dd62 | (visual audit + i18n span fix)                         |

## What Was Built

### LoadingFallback.tsx

- `bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900` → `bg-bg-deep`
- `border-blue-500/30 border-t-blue-500` → `border-accent-system/30 border-t-accent-system`
- `text-blue-200` → `text-text-secondary`

### FloatingNav.tsx

- Removed `backdrop-blur-xl`, `rounded-2xl`, inline `rgba(0,0,0,0.4)` glass style
- Container: `bg-bg-surface border border-border-primary rounded-sm`
- Active nav items: `bg-accent-system text-bg-deep` (solid teal, no gradient)
- Inactive items: `bg-bg-elevated text-text-secondary` with `hover:text-text-primary`
- Tooltips: `bg-bg-elevated border border-border-primary rounded-sm` (no glass)
- CTA button: `bg-bg-elevated border-accent-system/40` with `cta-pulse` animation
- Calendly fallback spinner: `border-accent-system/30 border-t-accent-system` (teal)
- Mobile bottom nav: `bg-bg-surface border border-border-primary rounded-sm`
- Old `whileHover` gradient (`rgba(79,70,229)` indigo) removed from CTA button

### CookieConsent.tsx

- Container style: `background: '#111520'`, `borderTop: '1px solid rgba(0,212,170,0.2)'`
- Accept button style: `background: '#00D4AA'`, `color: '#0A0D14'`, `borderRadius: '0.125rem'`
- Decline button style: `background: 'transparent'`, `border: '1px solid rgba(90,99,120,0.3)'`
- All Tailwind color classes replaced with inline `style={{ color }}` props
- `text-slate-300` → `style={{ color: '#9BA3B5' }}`
- `text-indigo-400` link → `style={{ color: '#00D4AA' }}`

### index.css

- `@keyframes cta-pulse`: `rgba(79, 70, 229, *)` → `rgba(0, 212, 170, *)` in all 4 instances
- No other old palette references found (backdrop-blur class definitions retained as CSS infrastructure)

## Visual Audit Results (Task 2)

**Playwright screenshots reviewed:** /, /automations, /chatbots, /pricing, /about — all confirmed Living System teal/amber palette.

**Code-level grep audit (19 files):**

- LoadingFallback.tsx: 0 old palette references
- FloatingNav.tsx: 0 old palette references
- CookieConsent.tsx: 0 old palette references
- index.css: 20 matches — ALL are backdrop-blur polyfill class _definitions_ (CSS infrastructure), not old color usage
- SimpleHeader.tsx: 1 match — JSDoc comment "no backdrop-blur" (design note, not color usage)
- All other 14 converted files: 0 old palette references

**Verdict: PASS.** Zero actual old indigo/purple/blue color values remain in any converted file.

**Fix applied during audit (488dd62):** Removed empty i18n marketing span from header that was showing raw key path text on all pages.

## Deviations from Plan

None — plan executed exactly as written. The i18n span fix (488dd62) was a pre-existing bug discovered during visual review.

## Self-Check: PASSED

- [x] `src/components/common/LoadingFallback.tsx` — modified and committed
- [x] `src/components/common/FloatingNav.tsx` — modified and committed
- [x] `src/components/common/CookieConsent.tsx` — modified and committed
- [x] `src/index.css` — modified and committed
- [x] Commit 756724b exists (Task 1)
- [x] Commit 488dd62 exists (Task 2 fix)
- [x] TypeScript compiles with no errors
- [x] Zero indigo/purple/blue color values in all 19 converted files
- [x] Human visual audit approved — all pages show Living System teal/amber palette
- [x] `bg-bg-deep` in LoadingFallback (1 match)
- [x] `bg-bg-surface` in FloatingNav (2 matches)
- [x] `#111520` in CookieConsent (1 match)
- [x] `rgba(0, 212, 170` in index.css cta-pulse (confirmed present)
