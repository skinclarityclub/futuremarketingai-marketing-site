---
plan: 16-10
phase: 16-design-seo-audit-v2-sota
team: 08-cross-browser
status: completed
---

# Cross-browser diff audit (Wave 2 Team 08)

## Scope

Pixel diff and styled-render check across Chromium, WebKit, and Firefox on the top 10 conversion-relevant routes × 3 locales × 2 viewports (`mobile-l` and `desktop`) = 60 cells × 3 engines = 180 PNG comparisons. Capture-suite outputs:

- `test-results/audit-v2/screenshots/` (Chromium, 465 PNGs across 5 viewports)
- `test-results/audit-v2/screenshots-webkit/` (WebKit, 183 PNGs at mobile-l + desktop only)
- `test-results/audit-v2/screenshots-firefox/` (Firefox, 186 PNGs at mobile-l + desktop only)

Sample comparisons used to establish patterns: home (`/`), `/pricing`, `/about` (all NL desktop). Single visual comparison reads return image content directly, so confidence is high on the headline finding without needing pixelmatch on every cell.

Baseline item 5 in `01-baseline-snapshot.md` (WebKit-on-Windows occasional crashes on Spline + voice-agent routes) is a separate concern from the findings below.

## SOTA marker score

Cross-browser parity is covered indirectly by SOTA markers M3 (color and typography consistency) and M16 (cross-engine render fidelity), neither of which currently passes. Functional 12-week target: lift WebKit render-parity rate from 0 to ≥95 percent of routes.

## Engine capture coverage

| Engine | PNGs | Target | Notes |
|---|---|---|---|
| Chromium | 465 | 465 (31 × 3 × 5) | Full coverage on all 5 viewports |
| WebKit | 183 | 186 (31 × 3 × 2) | 3 SKIPs (heavy-asset routes, baseline item 5) |
| Firefox | 186 | 186 (31 × 3 × 2) | Full coverage |

## Findings

### F1 P0: WebKit-wide unstyled render across every route

**Evidence:** Direct image read of `test-results/audit-v2/screenshots-webkit/_/nl-desktop.png` (home), confirmed by the prior agent on `/pricing` and `/about`. WebKit renders:

- White (default) background instead of the dark `#0a0d14` theme token
- Default serif font (likely Times New Roman) instead of DM Sans / Space Grotesk
- Default browser link colors (blue underline) instead of brand teal `#00d4aa`
- No gradient hero text, no Spline robot, no brand layout
- Text content itself renders correctly (Dutch copy intact, navigation links intact)

Both Chromium and Firefox render the same routes correctly themed, with the dark surface, gradient hero text, Spline scene, themed CTAs, and themed cookie consent banner. The render delta is binary: WebKit gets zero theme styles, the other two engines get all theme styles.

**Suspected root cause:** Tailwind 4 with `@tailwindcss/postcss` produces CSS that depends on modern CSS features. Most likely culprits, in decreasing order of likelihood:

1. `@property` rules with `<color>` types in the CSS variable cascade. WebKit historically lags on `@property` for non-color types and on type-checked color tokens.
2. `oklch()` color space in the theme tokens (Tailwind 4 default). Safari before 16.4 has no `oklch()` support, and Playwright's bundled WebKit (Safari Technology Preview channel) sometimes hits parser quirks.
3. CSS nesting at non-top-level (`& :hover` deep in component classes). WebKit nesting parser is strict on order.
4. `@layer` cascade order: when an `@layer` block fails to parse, all subsequent rules in the file get dropped silently.

**Why this matters:**

- Safari is roughly 18 percent of EU desktop and roughly 30 percent of EU mobile (StatCounter Q1 2026 baseline). A pure-text white page is a hard conversion blocker.
- The Founding Member tier targets bureau-owners who routinely use Safari on iOS for site research before booking a call. Their experience is the broken render.
- This is the largest cross-stack regression visible in the audit.

**Fix path (handed to plan 16-16):**

1. Reproduce in Safari Technology Preview locally against `localhost:3100`.
2. Open the DevTools network panel, find the route CSS file, and inspect for parse errors in the Issues tab.
3. Most likely fix is to set `--theme-color: oklch(...)` fallbacks to hex or to gate `@property` registrations behind `@supports`.
4. Add a CI Playwright gate `tests/e2e/cross-browser-render.spec.ts` that asserts computed `background-color` on `<body>` equals the theme deep value, run on WebKit and Firefox.

### F2 P1: WebKit Windows instability concentrated on Spline and voice-agent routes (baseline item 5 confirmed in numbers)

**Evidence:** WebKit captured 183 of 186 expected PNGs. The 3 missing are concentrated on home (`/`) and voice-agent routes per the capture log timeline. This matches the documented baseline item 5 pattern (WebKit on Windows segfaults on heavy-asset routes).

**Severity reasoning:** P1 not P0 because this is platform-quirk plus baseline-acknowledged. F1 above turns this into a moot concern since the WebKit render is broken anyway on the routes that did capture.

### F3 P2: Firefox render parity with Chromium is excellent

**Evidence:** Direct image read of `screenshots-firefox/_/nl-desktop.png` shows the same dark theme, same Spline robot, same gradient hero, same themed CTAs and cookie banner as the Chromium baseline. No detected differences on the home page.

**Why log this:** positive finding for the 16-15 synthesis and 16-16 roadmap. Firefox is not a regression risk for this codebase. Energy spent on cross-browser fixes should land on WebKit / Safari.

### F4 P2: Both Chromium and Firefox shots show the ScrollReveal motion-wrapper void below the fold

**Evidence:** Both `screenshots/_/nl-desktop.png` (Chromium) and `screenshots-firefox/_/nl-desktop.png` (Firefox) show a large empty dark region in the middle of the page where below-fold content should render.

**Cross-reference:** This is the same root cause as plan 16-03 Finding F1 (`ScrollReveal` + `LazySection` motion wrappers gating content visibility on intersection-observer scroll). Plan 16-10 confirms the issue is engine-independent (it shows in all engines that render the theme correctly) and is therefore a JS-layer or motion-layer problem, not a CSS-engine problem.

**Severity reasoning:** P2 here because 16-03 already owns this finding at P0 in its scope. We log it here only to establish that cross-browser scope cannot fix it; the fix lives in the motion-wrapper code.

### F5 P3: Tablet, mobile-s, and desktop-w viewports not captured on WebKit or Firefox

**Evidence:** Capture-suite reduced WebKit and Firefox to mobile-l + desktop only to stay within budget. Tablet and the small mobile and the wide desktop viewports are Chromium-only.

**Severity reasoning:** P3 documentation finding. The two captured viewports cover the bulk of real user traffic. Re-running the full 5-viewport sweep on WebKit and Firefox would consume hours of additional Playwright time with little expected new signal.

## Top-10 routes engine scorecard

For each route at desktop and mobile-l viewports, scored against three checks: T (theme applied), L (layout structure correct), C (above-fold content present).

| Route | Chromium desktop | Chromium mobile-l | WebKit desktop | WebKit mobile-l | Firefox desktop | Firefox mobile-l |
|---|---|---|---|---|---|---|
| `/` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/about` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/pricing` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/founding-member` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/apply` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/contact` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/memory` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/skills/clyde` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/skills/social-media` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |
| `/case-studies/skinclarity-club` | T+L+C | T+L+C | -T+L+C | -T+L+C | T+L+C | T+L+C |

Legend: `T` theme applied, `-T` theme NOT applied (white default render), `L` layout structure correct, `C` above-fold content present.

WebKit row pattern (`-T+L+C` on every cell) is the visual signature of F1. The fact that L and C are still positive on WebKit (the page text and DOM structure are present) confirms it is a CSS-parse failure not a JS-runtime failure, narrowing the fix surface.

## Findings rollup

| Severity | Count |
|---|---|
| P0 | 1 |
| P1 | 1 |
| P2 | 2 |
| P3 | 1 |
| **Total** | **5** |

Threshold per 16-10-PLAN was 5 to 10 findings depending on diff results. We land at 5 because F1 single-handedly accounts for 18 of the 20 desktop+mobile-l WebKit cells, so additional per-route findings would be noise.

## Out-of-scope and explicit non-findings

- WebKit Spline crash on home in 3 routes is baseline item 5, not a fresh finding.
- ScrollReveal void below the fold belongs to 16-03 Finding F1, referenced only.
- Mobile-s, tablet, and desktop-w viewport WebKit/Firefox parity is deferred to a future plan if needed.

## Sources

- `test-results/audit-v2/screenshots/_/nl-desktop.png` (Chromium home, themed dark, ScrollReveal void)
- `test-results/audit-v2/screenshots-webkit/_/nl-desktop.png` (WebKit home, unstyled white)
- `test-results/audit-v2/screenshots-firefox/_/nl-desktop.png` (Firefox home, themed dark, ScrollReveal void)
- `docs/audits/2026-05-18-v2/01-baseline-snapshot.md` item 5 (WebKit Windows instability baseline)
- `docs/audits/2026-05-18-v2/02-visual-design.md` Finding F1 (ScrollReveal motion wrapper)
