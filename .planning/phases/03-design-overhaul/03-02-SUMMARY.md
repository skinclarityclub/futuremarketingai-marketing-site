---
phase: 03-design-overhaul
plan: 02
subsystem: ui
tags: [react, typescript, tailwind, components, living-system, design-system]

# Dependency graph
requires:
  - phase: 03-design-overhaul plan 01
    provides: Living System design tokens (color palette, scan-line utilities, CSS custom properties)
provides:
  - SystemPanel component — primary container replacing GlassCard
  - StatusIndicator component — pulsing status dots with monospace labels
  - MetricDisplay component — large monospace numbers with accent colors
  - CTAButton component — consistent CTA with Calendly modal integration
  - SectionContainer component — consistent section layout wrapper
  - All 5 components exported from src/components/common/index.ts
affects: [03-design-overhaul plan 03, homepage, service pages, any page using shared components]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'Living System component pattern: bg-bg-surface + border-border-primary + rounded-sm'
    - 'forwardRef pattern for SystemPanel for ref forwarding support'
    - 'Monospace data display: font-mono + uppercase tracking-wider for labels'
    - 'CTAButton wraps CalendlyModal state internally — no parent state needed'

key-files:
  created:
    - src/components/common/SystemPanel.tsx
    - src/components/common/StatusIndicator.tsx
    - src/components/common/MetricDisplay.tsx
    - src/components/common/CTAButton.tsx
    - src/components/common/SectionContainer.tsx
  modified:
    - src/components/common/index.ts

key-decisions:
  - 'CTAButton self-manages Calendly modal state (isCalendlyOpen) — callers just pass calendly={true}'
  - 'SystemPanel uses forwardRef for composability with animation libraries'
  - "StatusIndicator defaults to pulse=true and variant='active' for minimal usage"
  - "SectionContainer defaults to maxWidth='xl' and padding='md' — most common case"

patterns-established:
  - 'System panels: bg-bg-surface border border-border-primary rounded-sm (no glassmorphism)'
  - 'Status dots: variant controls color (system=teal, active=green, attention=amber, inactive=muted)'
  - 'Metric values: font-mono text-3xl md:text-4xl font-bold + accent color'
  - 'CTA primary: bg-accent-system text-bg-deep (teal fills with deep text)'
  - 'CTA secondary: transparent + border-border-primary, fills bg-bg-elevated on hover'

requirements-completed: [REQ-COMPONENTS]

# Metrics
duration: 12min
completed: 2026-03-13
---

# Phase 3 Plan 2: Shared Components Summary

**5 Living System shared components (SystemPanel, StatusIndicator, MetricDisplay, CTAButton, SectionContainer) built with teal/amber design tokens and exported from common index**

## Performance

- **Duration:** 12 min
- **Started:** 2026-03-12T23:48:50Z
- **Completed:** 2026-03-13T00:00:50Z
- **Tasks:** 5
- **Files modified:** 6

## Accomplishments

- SystemPanel replaces GlassCard — solid dark surface + thin border, supports scan-lines and hover accent
- StatusIndicator renders colored pulsing dots with monospace labels for operational status
- MetricDisplay renders large monospace numbers with accent colors (system/human/active)
- CTAButton handles both regular navigation and Calendly modal internally (no parent state needed)
- SectionContainer provides consistent padding/max-width for all page sections
- All 5 components exported from the common barrel index

## Task Commits

Each task was committed atomically:

1. **Task 1: SystemPanel** — `f5b8a12` (feat)
2. **Task 2: StatusIndicator** — `7510378` (feat)
3. **Task 3: MetricDisplay** — `ca1455e` (feat)
4. **Task 4: CTAButton** — `105d79c` (feat)
5. **Task 5: SectionContainer** — `da46abe` (feat)

## Files Created/Modified

- `src/components/common/SystemPanel.tsx` — Primary container component using bg-bg-surface + border-border-primary, forwardRef support
- `src/components/common/StatusIndicator.tsx` — Colored dots (active/attention/inactive/system) with optional pulse and monospace label
- `src/components/common/MetricDisplay.tsx` — Large monospace value display with prefix/suffix and accent color variants
- `src/components/common/CTAButton.tsx` — Unified CTA with primary/secondary variants, arrow icon, Calendly modal integration
- `src/components/common/SectionContainer.tsx` — Section wrapper with configurable maxWidth and padding
- `src/components/common/index.ts` — Added exports for all 5 new components

## Decisions Made

- CTAButton self-manages Calendly modal state: callers just pass `calendly={true}` — no boilerplate in parent pages
- SystemPanel uses `React.forwardRef` for composability with Framer Motion and other ref-consuming libraries
- StatusIndicator defaults `pulse={true}` and `variant="active"` — minimal usage is `<StatusIndicator />` for a green pulsing dot
- SectionContainer uses `<section>` element (semantic HTML) with inner `<div>` for max-width centering

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. TypeScript type check passed with zero errors after all 5 components created.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 5 shared components ready for use in Plan 03 (homepage redesign) and Plan 04+ (service page redesign)
- Import pattern: `import { SystemPanel, StatusIndicator, MetricDisplay, CTAButton, SectionContainer } from '../components/common'`
- Design tokens from Plan 01 are required — verify tailwind.config.js was updated before using these components

---

_Phase: 03-design-overhaul_
_Completed: 2026-03-13_

## Self-Check: PASSED

All 5 component files exist on disk. All 5 task commits verified in git history.
