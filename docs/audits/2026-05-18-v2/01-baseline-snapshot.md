---
phase: 16-design-seo-audit-v2-sota
plan: 02
date: 2026-05-18
branch: audit/2026-05-18-v2-sota
parent: fix/audit-2026-05-18-followup
parent_commit: a4d6b8244e8c19243757f2112869ef93e6d2a707
---

# Phase 16 Wave 1 Baseline Snapshot

> Captured by plan 16-02 at the moment the audit branch was cut. Every Wave 2 team
> reads this file first to know which build, type-check, lint, palette, Playwright
> and bundle failures are PRE-EXISTING vs potential regressions introduced by the
> audit work. Pre-existing failures are explicitly tagged out-of-scope so that
> Wave 2 plans do not get distracted fixing baseline noise.

## Scope

This baseline snapshot records the verifiable health of the live codebase at the
exact commit that the SOTA audit branch was cut from. It freezes the build,
type-check, lint, palette regression-check, Playwright legacy-suite, and Next.js
production build output as the "known starting point". Wave 2 teams reference
this document when they encounter a build error, lint warning, or Playwright
flake to decide whether the issue is baseline noise (out-of-scope for Phase 16)
or a true regression caused by audit work (in-scope to flag back to the planner).
The document is append-only for the duration of the audit; if any Wave 2 plan
discovers additional pre-existing failures, they amend the Out-of-scope section
rather than rewriting earlier sections.

The audit is intentionally research-only. No fix work happens inside this phase.
Anything red below stays red until the Phase 16 fix-plan deliverable (16-16) and
its derivative phases land. The branch itself only accumulates artefacts under
`docs/audits/2026-05-18-v2/` and `fmai-nextjs/test-results/audit-v2/`, plus seven
new Playwright spec files and the gallery-index script.

## Branch state

```
$ git rev-parse --abbrev-ref HEAD
audit/2026-05-18-v2-sota

$ git rev-parse HEAD
a4d6b8244e8c19243757f2112869ef93e6d2a707

$ git log --oneline -3
a4d6b82 docs(audit): 16-01 Wave 0 pre-audit intelligence (competitors + SOTA markers)
83eac78 plan(16): apply plan-checker fixes (no em-dashes in commit strings, no package.json sidecar keys)
4ba0233 plan(16): generate 16 plan files for SOTA audit phase
```

The branch sits one commit ahead of `fix/audit-2026-05-18-followup` because the
checkout itself does not create a new commit (the branch and the parent share
HEAD `a4d6b82`). All subsequent audit work lands on `audit/2026-05-18-v2-sota`
and never on `main` or the followup branch.

Working-tree state at branch creation: clean for production code paths
(`fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`,
`fmai-nextjs/tailwind.config.*`). Untracked or modified files are confined to
`.planning/`, `docs/`, `playwright-report/index.html`, and prior-run
`fmai-nextjs/test-results/` artefacts that are gitignored.

## Type-check baseline

Command run from `fmai-nextjs/`:

```
npx tsc --noEmit
```

Result: PASS with zero output. The TypeScript strict configuration in
`tsconfig.json` reports no errors on the current `src/` tree. This is the
expected state after Phase 15 closure; any new type errors that appear during
Wave 2 audit work indicate a regression introduced by an audit-plan touching
code (which the audit-invariant explicitly forbids — see commit-invariants in
the plan).

## Lint baseline

Command run from `fmai-nextjs/`:

```
npm run lint
```

Result: `0 errors, 24 warnings`. None of the warnings are blocking and none
sit inside `fmai-nextjs/src/app/` route entry-points. The 24 warnings break down
by file as follows.

Production code (8 warnings, all unused-vars or unused-eslint-disable comments,
not behavioural):

- `src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx:270`
  unused `index` arg in a `.map()` callback.
- `src/components/chatbot/tool-results/ServiceCard.tsx:157,270` two unused
  eslint-disable directives for `@typescript-eslint/no-explicit-any`.
- `src/components/interactive/CookieConsentBanner.tsx:30` unused
  eslint-disable directive for `react-hooks/set-state-in-effect`.
- `src/components/layout/HeaderClient.tsx:82,111` unused `_locale` arg plus
  unused eslint-disable directive.
- `src/components/voice/WaveformVisualizer.tsx:40` unused eslint-disable.
- `src/lib/chatbot/engine.ts:131` unused destructured `_`.

Test and tooling code (15 warnings, none affect production bundles):

- `scripts/check-translations.js:24`
- `scripts/site-audit.ts:11,146`
- `scripts/validate/partner-removal-playwright.mjs:50,78,84,498,750,757`
- `scripts/validate/phase-15-playwright.mjs:49,67,349,458,841,848`
- `tests/e2e/logo-visual.spec.ts:8`

One warning is auto-fixable via `npm run lint -- --fix` (`12 warnings
potentially fixable`). Lint warnings are tagged out-of-scope baseline noise for
Phase 16 — Wave 2 teams do not need to fix them.

## Palette baseline

Command run from `fmai-nextjs/`:

```
npm run check:palette
```

Result: `PASS: no stale palette hex in src/`. The palette-regression gate
introduced in Phase 12-01 stays green. The legacy palette tokens (`#050814`,
`#0A0E27`, `#00D4FF`, `#A855F7`) do not appear anywhere under `fmai-nextjs/src/`.
Any audit work that touches code MUST keep this gate green.

## Playwright baseline

Existing legacy Playwright suite under `fmai-nextjs/tests/e2e/` consists of 12
spec files:

```
accessibility.spec.ts
chatbot.spec.ts
conversion-polish.spec.ts
demo-full-flow.spec.ts
guided-demo.spec.ts
homepage.spec.ts
i18n.spec.ts
logo-visual.spec.ts
navigation.spec.ts
nl-content-smoke.spec.ts
performance.spec.ts
seo.spec.ts
```

Last recorded `npm run test:e2e` state (per
`fmai-nextjs/test-results/.last-run.json`): `status: failed`, with one failing
test `f609baaeb852649c071e-fedd81a8afab50d3410f`. The failure trace is preserved
in `fmai-nextjs/test-results/conversion-polish-Conversi-6e5b9-es-inbox-check-confirmation-chromium/`
(error-context.md plus video.webm plus failing screenshot). The test exercises
the Spanish newsletter-confirm inbox-check happy path landed in Phase 15-04;
the failure relates to Resend webhook timing in test mode and was already known
prior to Wave 0. This is OUT-OF-SCOPE baseline noise; Phase 16 does not retry
or fix it. Wave 2 plan 16-08 (Accessibility) and 16-09 (Performance) get their
own dedicated specs under `audit-v2-*.spec.ts` rather than touching the legacy
12-spec suite.

The new Phase 16 capture-suite landing in this plan (`audit-v2-*.spec.ts`) is
intentionally additive: it runs in parallel with the legacy suite without
overlapping, so the existing 12-spec failure does not block any Wave 2 work.

## Build baseline

Command run from `fmai-nextjs/`:

```
npm run build
```

Result: `Compiled successfully in 19.6s`. Full pipeline including TypeScript
re-check (`Finished TypeScript in 24.0s`) and SSG of 108 prerendered pages
across `en/nl/es` locales (`Generating static pages using 15 workers (108/108)
in 3.6s`). The total build emits 108 static pages plus 11 dynamic API routes
plus `/api/og`, `/icon.svg`, `/robots.txt`, `/sitemap.xml`. No build error, no
SSG opt-out, no missing-message warning. One known deprecation notice:

```
The "middleware" file convention is deprecated. Please use "proxy" instead.
```

That deprecation tracks an upstream Next.js 16 rename that Phase 10-04 left
half-migrated (the file was renamed but the convention path was not flipped
because the `proxy` convention reads from the same source). The notice is
OUT-OF-SCOPE baseline noise for Phase 16 and is already tracked for a future
phase. The build also prints one informational notice:

```
Using edge runtime on a page currently disables static generation for that page.
```

This refers to the `/api/og` and `/api/og/assessment-result` edge routes; they
are correctly dynamic. Not an issue.

## Bundle size table

Next.js 16 simplified its build summary table and no longer prints a per-route
First Load JS column inline. The aggregate `.next/` artefact sizes captured
from disk immediately after build are:

| Layer | Size on disk |
|---|---|
| `.next/static/` (client chunks shipped to browser) | 6.5 MB |
| `.next/server/` (server bundle + RSC payload) | 76 MB |
| `.next/` total (build cache + traces) | 2.2 GB |

The 6.5 MB client-side total is the relevant figure for browser-facing bundle
budget. Per-route First Load JS will be measured by the dedicated Wave 2 plan
16-09 (Performance) using `@next/bundle-analyzer` (already pulled in
devDependencies) and Lighthouse runs against production URL `https://future-marketing.ai`.
That number is the audit's source-of-truth for performance scoring; the 6.5 MB
on-disk number is a coarse baseline only.

Heaviest expected routes (per prior Phase 13 analysis, reproduced for
continuity, exact numbers TBD by 16-09):

| Route | Notes |
|---|---|
| `/[locale]` (home) | Heaviest, Spline 3D robot + hero animations |
| `/[locale]/skills/voice-agent` | Heavy, VoiceDemo embed + waveform |
| `/[locale]/skills/clyde` | Heavy, full DemoPlayground + 17 tools |
| `/[locale]/skills/chatbot` | Heavy, DemoPlayground variant |
| `/[locale]/about` | Heavy, Spline hero variant |
| `/[locale]/memory` | Medium, MemoryLayersDiagram |
| `/[locale]/pricing` | Medium, PricingTiers + matrix |
| `/[locale]/case-studies/skinclarity-club` | Medium, outcomes grid + testimonial block |
| `/[locale]/founding-member` | Medium, FoundingCounter + FAQ |
| `/[locale]/apply` | Light-medium, Calendly inline embed |

Authoritative per-route bundle table will land in plan 16-09 once
`@next/bundle-analyzer` ANALYZE runs are committed under
`docs/audits/2026-05-18-v2/08-performance.md`.

## Out-of-scope failures

The following pre-existing issues are EXPLICITLY excluded from Phase 16 audit
scope. They are real findings but they do not block Wave 2 team plans, and
Wave 2 teams must not spend cycles trying to fix them inside the audit.

1. **Playwright legacy-suite failure** — `conversion-polish.spec.ts: es inbox
   check confirmation` fails in Resend test-mode timing. Documented in Phase 15
   close-out. Rationale: not an SOTA audit concern, owned by the post-launch
   Resend instrumentation work.

2. **Next.js `middleware` deprecation warning** — `proxy` convention rename
   was started in Phase 10-04 but not finished. Cosmetic deprecation notice
   only, zero runtime impact. Rationale: tracked under post-phase carry-overs.

3. **24 lint warnings** — all unused-vars or unused-eslint-disable directives,
   no errors, no production behavioural impact. Rationale: cleanup work, no
   audit-finding value.

4. **`prebuild` lint-soft gate** (`npm run lint || true`) — Phase 13-03
   shipped this as a temporary measure pending React Compiler error-fix work
   in a future phase. Rationale: known design decision documented in
   `package.json` `_fixme_prebuild_strict` key.

5. **WebKit-on-Windows Playwright instability** — historical pattern from
   Phase 09 visual-regression work; WebKit occasionally segfaults on Windows
   during heavy-asset routes (`/skills/voice-agent`, `/[locale]` Spline hero).
   Wave 2 plan 16-10 (Cross-browser) treats per-route WebKit crash as
   SKIP-with-note rather than a hard failure, per AUTONOMOUS-PROTOCOL Rule 2.
   Rationale: platform-quirk, not an FMai-code defect.

6. **Lighthouse perf score for localhost dev** — dev-mode bundles are
   unminified and skew Lighthouse below realistic numbers. Rationale: 16-09
   runs Lighthouse against the production URL `https://future-marketing.ai`
   to get representative scores.

7. **Pre-existing test-results clutter** — `fmai-nextjs/test-results/` already
   contains failed-run artefacts from prior phases (logo-visual,
   nl-audit-screenshots, conversion-polish). These are gitignored. Rationale:
   leave alone, do not rebuild.

8. **Existing chatbot React-hooks warnings** — `HeaderClient.tsx` and
   `CookieConsentBanner.tsx` and `WaveformVisualizer.tsx` carry
   `react-hooks/set-state-in-effect` eslint-disable directives that the linter
   now reports as unused. Rationale: React Compiler emits the underlying lint
   rule conditionally; the disable comments stay as documentation of intent
   until the next React Compiler bump.

9. **`playwright-lighthouse` chalk incompatibility** — the
   `playwright-lighthouse@^4.x` library calls `chalk.yellow.italic(...)` which
   was removed in `chalk@5` (currently installed via transitive). All 60
   Lighthouse tests SKIP-logged with `chalk.yellow.italic is not a function`
   per AUTONOMOUS-PROTOCOL Rule 2. The Lighthouse JSON output dir
   (`test-results/audit-v2/lighthouse/`) is therefore empty. Rationale: 16-09
   Performance plan uses the WebFetch PageSpeed Insights API as the documented
   fallback (Rule 2). Library-fix scope is post-phase carry-over.

10. **Capture-suite port shift** — initial agent attempt left an orphan dev
    server holding port 3000 plus a `.next/dev/lock` file, blocking subsequent
    dev servers per Next.js 16 single-server-per-directory guard. Recovery
    used port 3100 (`PLAYWRIGHT_BASE_URL=http://localhost:3100`,
    `AUDIT_BASE_URL=http://localhost:3100`). All captures in this snapshot were
    taken against `localhost:3100`. Wave 2 teams should NOT treat the port
    shift as an audit finding. Rationale: tooling artefact, not site behaviour.

11. **Capture-suite consolidated re-run** — the first recovery agent invoked
    `npx playwright test` three separate times (chromium, then webkit+firefox,
    then lighthouse), and Playwright's default `outputDir = test-results/`
    cleanup wiped the chromium and axe and HAR and DOM and lighthouse outputs
    between invocations. The eventual fix was setting
    `outputDir: './playwright-output'` plus `preserveOutput: 'always'` in
    `playwright.config.ts` and running all 7 specs in a single
    `--project=chromium` invocation. Final counts: chromium 465, webkit 183,
    firefox 186, axe 93, HAR 93, DOM 93, lighthouse 0 (see item 9). Rationale:
    documented for reproducibility; Wave 2 teams should rerun via the
    consolidated single-invocation pattern only.

If Wave 2 finds additional baseline failures, they extend this section rather
than file a new audit finding.
