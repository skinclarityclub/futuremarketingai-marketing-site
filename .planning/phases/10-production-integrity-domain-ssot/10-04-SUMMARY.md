---
phase: 10-production-integrity-domain-ssot
plan: 04
subsystem: infra

tags: [next16, proxy-convention, vercel-speed-insights, csp, npm-audit, postcss, picomatch]

# Dependency graph
requires:
  - phase: 10-production-integrity-domain-ssot
    provides: 10-01 already moved middleware.ts to proxy.ts during domain canonicalization (commit 0346709)
provides:
  - Next.js 16 file convention compliance (proxy.ts replaces middleware.ts)
  - Vercel Speed Insights wired in [locale]/layout.tsx for production vitals
  - 0 npm audit vulnerabilities at all severity levels (was 7 CVEs)
  - Tighter CSP with api.anthropic.com removed from connect-src
  - Permissions-Policy that allows microphone on same-origin (voice-agent demo unblocked)
  - engines.node pinned to >=22.0.0
  - npm overrides forcing postcss >=8.5.10 across the tree
affects:
  - 11-eaa-accessibility-compliance (build hygiene foundation)
  - 13-performance-bundle-cleanup (Speed Insights gives baseline metrics)
  - 14-seo-geo-depth-upgrade (clean build, no 404 storm)

# Tech tracking
tech-stack:
  added:
    - "@vercel/speed-insights@^2.0.0"
  patterns:
    - "npm overrides for transitive CVE patching when host package ships outdated nested deps"
    - "Production vitals via Vercel Speed Insights endpoint (no custom /api/vitals route)"
    - "Dev-only console logger for web-vitals; production handled by SpeedInsights component"

key-files:
  created:
    - .planning/phases/10-production-integrity-domain-ssot/10-04-SUMMARY.md
  modified:
    - fmai-nextjs/src/app/[locale]/layout.tsx
    - fmai-nextjs/src/lib/web-vitals.ts
    - fmai-nextjs/next.config.ts
    - fmai-nextjs/package.json
    - fmai-nextjs/package-lock.json

key-decisions:
  - "Used npm overrides to force postcss >=8.5.10 because Next 16.2.4 still bundles postcss 8.4.31 in node_modules/next/node_modules/postcss"
  - "Mounted SpeedInsights at locale-layout level (not root layout) for per-locale tracking"
  - "Web-vitals dev-only logger preserved for local debugging; short-circuits in production"
  - "Permissions-Policy microphone=(self) instead of removing the directive entirely, to keep cross-origin blocked"

patterns-established:
  - "CVE patching via npm overrides: when a transitive dep is locked in by a host package, override key in package.json forces resolution"
  - "Vitals collection: SaaS over self-host (Vercel Speed Insights) — no custom beacon route"
  - "Permissions-Policy as feature gate, not feature kill: prefer (self) over () when same-origin needs the API"

requirements-completed: [PHASE-10]

# Metrics
duration: 15min
completed: 2026-04-24
---

# Phase 10 Plan 04: Next.js 16 Hygiene Cleanup Summary

**Migrated to Next.js 16 proxy convention, mounted Vercel Speed Insights, killed the /api/vitals 404 storm, closed all 7 npm audit CVEs via dependency bumps + postcss override, and tightened CSP/Permissions-Policy headers.**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-04-24T23:06:54Z
- **Completed:** 2026-04-24T23:21:56Z
- **Tasks:** 6 (5 code-changing, 1 verification-only)
- **Files modified:** 5

## Accomplishments

- Next.js 16 file convention compliant (`src/proxy.ts`); build emits `ƒ Proxy (Middleware)` with no deprecation warning
- `<SpeedInsights />` from `@vercel/speed-insights/next` mounted in `[locale]/layout.tsx` for production vitals collection
- Removed `navigator.sendBeacon('/api/vitals', ...)` from `lib/web-vitals.ts`; the 404 storm on every pageload is gone
- `npm audit` reports `found 0 vulnerabilities` (was 7 CVEs: 3 high, 4 moderate)
- CSP `connect-src` no longer lists `https://api.anthropic.com` (server-side only, no browser use)
- `Permissions-Policy: microphone=(self)` so the `/skills/voice-agent` ElevenLabs demo can request mic permission
- `engines.node: ">=22.0.0"` pinned in `package.json`
- `npm overrides.postcss: ^8.5.10` forces resolution past the postcss XSS CVE

## Task Commits

Atomic commits, in execution order:

1. **Task 1: Rename `middleware.ts` -> `proxy.ts`** — already done in `0346709` (Plan 10-01 picked it up while canonicalizing the domain). No new commit needed; verified file state and build output (`ƒ Proxy (Middleware)`).
2. **Task 2: Install `@vercel/speed-insights` + mount in root layout** — `5a682bd` (feat)
3. **Task 3: Remove `/api/vitals` beacon, dev-only logger** — `afc804e` (fix)
4. **Task 4: Bump `next/eslint/mdx/bundle-analyzer` to 16.2.4 + postcss override + engines.node** — `f5d2351` (chore)
5. **Task 5: Tighten CSP (drop api.anthropic.com) + Permissions-Policy (microphone=(self))** — `c5b5c12` (chore)
6. **Task 6: Full build + audit + smoke verification** — verification-only, no commit (build passed, 0 vulns)

## Files Created/Modified

- `fmai-nextjs/src/app/[locale]/layout.tsx` — added `import { SpeedInsights } ...` and `<SpeedInsights />` as last child of `<body>` (sibling of `NextIntlClientProvider`)
- `fmai-nextjs/src/lib/web-vitals.ts` — removed sendBeacon path; `initWebVitals` short-circuits in production; dev-only console logger retained
- `fmai-nextjs/next.config.ts` — `connect-src` no longer lists `https://api.anthropic.com`; `Permissions-Policy` allows `microphone=(self)`
- `fmai-nextjs/package.json` — bumped Next/eslint/mdx/bundle-analyzer to ^16.2.4, next-intl ^4.9.1, web-vitals ^5.2.0, added `@vercel/speed-insights ^2.0.0`, added `overrides.postcss ^8.5.10`, added `engines.node >=22.0.0`
- `fmai-nextjs/package-lock.json` — regenerated

## Decisions Made

- **postcss CVE: npm override over `--force`** — `npm audit fix --force` would have downgraded Next.js to 9.3.3 (major regression). Instead, added `"overrides": { "postcss": "^8.5.10" }` in `package.json`, which forces nested resolutions to the patched version while keeping Next 16.2.4. Result: `0 vulnerabilities`. Build still passes.
- **Speed Insights mount point** — locale layout, not root layout. Per audit 08 Appendix E, `[locale]/layout.tsx` is the primary layout owning `<html>` and `<body>` (`generateStaticParams` lives there too). Root layout is minimal. Mounting at locale level gives per-route tracking out of the box.
- **Permissions-Policy microphone** — used `microphone=(self)` not `microphone=*`. Same-origin only because the voice-agent demo runs on our domain. Cross-origin embedded use would need to be reviewed separately.
- **vercel.json migration** — left as-is. The plan's per-task touch was `next.config.ts`, not `vercel.json`. The `important_constraints` from the orchestrator note that `vercel.ts` is now recommended, but plan 10-04 doesn't migrate config; it edits security headers which already live in `next.config.ts`. Flagged for a future hygiene pass.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Task 1 already done by upstream (Plan 10-01)**
- **Found during:** Task 1 (rename middleware.ts -> proxy.ts)
- **Issue:** When I went to do `git mv src/middleware.ts src/proxy.ts`, the file was already at `proxy.ts` (no `middleware.ts`). git log showed `fmai-nextjs/src/{middleware.ts => proxy.ts}` as part of commit `0346709` (`feat(10-01): canonicalize SITE_URL and ORG_EMAIL on future-marketing.ai`). Plan 10-01 ran in parallel and bundled the rename into its domain-migration commit.
- **Fix:** No code change needed. Verified content of `src/proxy.ts` matches expected (createMiddleware default export + matcher config). Verified build output shows `ƒ Proxy (Middleware)` and emits no deprecation warnings.
- **Files modified:** none (already done upstream)
- **Verification:** `npm run build` shows `ƒ Proxy (Middleware)`, no deprecation strings in output, `src/middleware.ts` does not exist
- **Committed in:** `0346709` (upstream, by Plan 10-01)

**2. [Rule 3 - Blocking] postcss CVE persists in nested next dep**
- **Found during:** Task 4 (`npm audit` after bumping to 16.2.4)
- **Issue:** After `npm install next@16.2.4`, audit still reported 5 moderate postcss vulns at `node_modules/next/node_modules/postcss` (Next bundles postcss 8.4.31 internally; advisory needs >=8.5.10). `npm audit fix --force` proposed downgrading next to 9.3.3 — completely unacceptable.
- **Fix:** Added `"overrides": { "postcss": "^8.5.10" }` to `package.json`. Ran `npm install`. Audit then reports `0 vulnerabilities`.
- **Files modified:** `fmai-nextjs/package.json`, `fmai-nextjs/package-lock.json`
- **Verification:** `npm audit` -> `found 0 vulnerabilities`. `npm run build` -> `Compiled successfully in 6.5s`.
- **Committed in:** `f5d2351` (Task 4)

**3. [Rule 3 - Blocking] engines.node pin from audit 08 rec #11**
- **Found during:** Task 4
- **Issue:** Plan 4 referenced audit 08 rec #11 which calls for pinning Node engine. Without it, npm warns about engine compatibility on installs.
- **Fix:** Added `"engines": { "node": ">=22.0.0" }` to `package.json` (Next.js 16 requires Node 18.18+; we choose 22 LTS-aligned baseline).
- **Files modified:** `fmai-nextjs/package.json`
- **Verification:** install completes without engine warnings.
- **Committed in:** `f5d2351` (Task 4)

---

**Total deviations:** 3 auto-fixed (1 already-done upstream, 2 blocking)
**Impact on plan:** All deviations were necessary. The upstream rename meant Task 1 was a no-op; the postcss override was the only path to closing the CVE without downgrading Next; engines.node pin was an explicit plan reference (audit 08 rec #11). No scope creep.

## Issues Encountered

- **Parallel plan 10-01 was committing files I needed to look at** — `nl.json`, `CLAUDE.md` (root + nextjs), and `[locale]/layout.tsx` all changed during my session. I read each carefully and only staged my own task-related files in each commit. No merge conflicts because 10-01 and 10-04 touched different lines of `[locale]/layout.tsx` (10-01: `metadataBase`; 10-04: `SpeedInsights` import + mount).
- **Lint debt** — `npm run lint` reports 49 problems (36 errors, 13 warnings) including `no-require-imports` errors in `verify-mega.cjs`/`verify-screenshots.js`, `no-unused-vars` warnings, `react-hooks/exhaustive-deps` warnings. Per plan note ("phase 11 or later handles lint debt"), captured but not fixed in this plan.

## User Setup Required

None for the code changes themselves. Manual step (one-time, in Vercel dashboard):

- Settings -> Speed Insights -> Enable. Free on Vercel Pro. Without this toggle, the `<SpeedInsights />` component is mounted but does nothing in production.

## Next Phase Readiness

- Build is clean: `npm run build` -> `Compiled successfully` with no deprecation warnings
- `npm audit` -> `found 0 vulnerabilities` at all severity levels
- Foundation ready for Phase 11 (EAA accessibility): no blocking infra issues
- Speed Insights baseline metrics will populate after first prod deploy + dashboard toggle
- One observation for a future hygiene phase: migrating `next.config.ts` headers to `vercel.ts` (per the platform's new recommended config) would centralize header config with the platform; not done here because plan 10-04 was scoped to header content edits, not config-format migration

## Self-Check

Files created/modified:
- FOUND: fmai-nextjs/src/app/[locale]/layout.tsx (SpeedInsights mounted, verified via grep)
- FOUND: fmai-nextjs/src/lib/web-vitals.ts (no /api/vitals references, verified)
- FOUND: fmai-nextjs/next.config.ts (no api.anthropic.com, microphone=(self) present)
- FOUND: fmai-nextjs/package.json (next ^16.2.4, overrides.postcss ^8.5.10, engines.node >=22.0.0)
- FOUND: fmai-nextjs/package-lock.json (regenerated)

Commits:
- FOUND: 5a682bd feat(10-04): mount Vercel Speed Insights, replace 404-ing /api/vitals beacon
- FOUND: afc804e fix(10-04): remove sendBeacon('/api/vitals') 404 storm, dev-only logger
- FOUND: f5d2351 chore(10-04): bump next/eslint/mdx/bundle-analyzer to 16.2.4, override postcss
- FOUND: c5b5c12 chore(10-04): tighten CSP — drop api.anthropic.com, allow microphone=(self)
- FOUND: 0346709 (upstream Task 1, Plan 10-01)

## Self-Check: PASSED

---

*Phase: 10-production-integrity-domain-ssot*
*Completed: 2026-04-24*
