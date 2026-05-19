---
plan: 16-02
phase: 16-design-seo-audit-v2-sota
title: Wave 1 setup + Playwright multi-engine capture infrastructure
status: completed
commit: 5a8af29
started: 2026-05-18T18:30:00Z
finished: 2026-05-19T00:23:00Z
---

# 16-02 SUMMARY

## What landed

- New branch `audit/2026-05-18-v2-sota` off `fix/audit-2026-05-18-followup`.
- 7 Playwright spec files under `fmai-nextjs/tests/e2e/`:
  - `audit-v2-screenshots.spec.ts` (Chromium primary, 31 routes × 3 locales × 5 viewports)
  - `audit-v2-screenshots-webkit.spec.ts` (WebKit, 31 × 3 × 2)
  - `audit-v2-screenshots-firefox.spec.ts` (Firefox, 31 × 3 × 2)
  - `audit-v2-har-capture.spec.ts` (HAR network capture, 31 × 3 at 1440×900)
  - `audit-v2-dom-snapshot.spec.ts` (raw HTML, 31 × 3 at 1440×900)
  - `audit-v2-axe.spec.ts` (axe-core a11y JSON, 31 × 3 at 1440×900)
  - `audit-v2-lighthouse.spec.ts` (production URL, 10 routes × 3 locales × 2 form-factors)
- Shared helper `tests/e2e/_audit-v2-config.ts` (routes, locales, viewports, URL builder).
- Dev-deps `@axe-core/playwright` and `playwright-lighthouse` added to `package.json`.
- `fmai-nextjs/playwright.config.ts` patched: `outputDir: './playwright-output'` and `preserveOutput: 'always'` so Playwright's per-run cleanup no longer wipes the audit-v2 artefact tree.
- `fmai-nextjs/.gitignore` updated: heavy binaries in `test-results/audit-v2/**` ignored, `screenshots/index.html` exception preserved, `playwright-output/` ignored.
- Gallery generator `fmai-nextjs/scripts/audit/generate-gallery-index.mjs` written and executed; produced `test-results/audit-v2/screenshots/index.html` (259 KB, 834 thumbnails).
- Baseline snapshot doc `docs/audits/2026-05-18-v2/01-baseline-snapshot.md` written and extended to 11 out-of-scope items (added items 9-11 for lighthouse-chalk incompat, dev-server port shift, and consolidated re-run history).

## Capture run output (final)

| Artefact | Count | Target | Status |
|---|---|---|---|
| Chromium PNGs | 465 | 465 (31×3×5 = 465) | Full |
| WebKit PNGs | 183 | 186 (31×3×2) | 98% (3 SKIPs on heavy-asset routes) |
| Firefox PNGs | 186 | 186 (31×3×2) | Full |
| Axe JSONs | 93 | 93 | Full |
| HAR files | 93 | 93 | Full |
| DOM HTML | 93 | 93 | Full |
| Lighthouse JSON | 0 | 60 | **All SKIP** (chalk@5 incompat — see Out-of-scope item 9) |
| Gallery thumbs | 834 | ≥432 | Exceeded |

Disk usage: 791 MB / 3 GB cap.

## Notable deviations from the plan

1. **Three separate Playwright invocations were tried before a consolidated re-run worked.** The first agent attempt invoked `playwright test` three times (chromium-only, then webkit+firefox, then lighthouse). Playwright's default `outputDir = test-results/` cleanup wiped the chromium/axe/HAR/DOM artefacts between invocations. Fix: edit `playwright.config.ts` to move `outputDir` away from `test-results/`, then run all 7 specs in one `--project=chromium` invocation.

2. **Dev-server port shifted from 3000 to 3100.** An orphan dev server from the prior agent held port 3000 plus the `.next/dev/lock` file. Next.js 16 refuses to start a second dev server from the same directory. Recovery: cleared lock, started dev on 3100, ran captures with `PLAYWRIGHT_BASE_URL=http://localhost:3100 AUDIT_BASE_URL=http://localhost:3100`. The port choice is not a site finding; Wave 2 teams ignore it.

3. **Lighthouse zero output.** `playwright-lighthouse@4.x` calls `chalk.yellow.italic(...)` which was removed in `chalk@5`. All 60 lighthouse tests SKIP-logged via the catch block per AUTONOMOUS-PROTOCOL Rule 2. Wave 2 plan 16-09 (Performance) must use the WebFetch PageSpeed Insights API fallback (the documented Rule 2 path). Library-fix scope is post-phase.

## Wave 2 readiness

Wave 2 teams (16-03..16-14) can now:

- Open `fmai-nextjs/test-results/audit-v2/screenshots/index.html` for a single-page gallery of all 834 captures.
- Read raw axe JSON per route × locale from `test-results/audit-v2/axe/<route>-<locale>.json`.
- Read raw DOM per route × locale from `test-results/audit-v2/dom/<route>-<locale>.html`.
- Read HAR files for network audits from `test-results/audit-v2/har/<route>-<locale>.har`.
- Cross-browser plan 16-10 has 183 WebKit + 186 Firefox shots to diff against Chromium.
- Performance plan 16-09 starts from PageSpeed Insights (lighthouse JSON is empty).

## Files modified

| File | Change |
|---|---|
| `audit/2026-05-18-v2-sota` (branch) | Created from `fix/audit-2026-05-18-followup` |
| `fmai-nextjs/tests/e2e/audit-v2-*.spec.ts` (7 specs) | New |
| `fmai-nextjs/tests/e2e/_audit-v2-config.ts` | New |
| `fmai-nextjs/scripts/audit/generate-gallery-index.mjs` | New |
| `fmai-nextjs/package.json`, `package-lock.json` | `@axe-core/playwright` + `playwright-lighthouse` deps |
| `fmai-nextjs/playwright.config.ts` | `outputDir` + `preserveOutput` |
| `fmai-nextjs/.gitignore` | audit-v2 binaries ignored, `playwright-output/` ignored |
| `fmai-nextjs/test-results/audit-v2/screenshots/index.html` | New (834 thumbnails) |
| `docs/audits/2026-05-18-v2/01-baseline-snapshot.md` | New, 11 out-of-scope items |
| `.planning/phases/16-design-seo-audit-v2-sota/STATE.md` | `16-02: completed`, SHA 5a8af29 |
| `.planning/phases/16-design-seo-audit-v2-sota/BUDGET.log` | Recovery run telemetry, +11 entries |

Zero edits under `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*` (audit invariant honoured).

## Budget impact

| Metric | Plan-15 baseline | Post-16-02 |
|---|---|---|
| Gemini calls | 3 / 100 | 3 / 100 (unchanged) |
| Firecrawl calls | 3 / 80 | 3 / 80 (unchanged) |
| Disk | 0.1 MB | 791 MB / 3 GB |
| Wall-clock cumulative | ~10 min | ~3 h |
