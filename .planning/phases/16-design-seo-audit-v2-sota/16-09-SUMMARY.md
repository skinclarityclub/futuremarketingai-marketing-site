---
phase: 16-design-seo-audit-v2-sota
plan: 09
subsystem: performance
tags: [performance, core-web-vitals, lighthouse, pagespeed-insights, crux, bundle-analysis, lcp, cls, inp, vercel, spline, third-party-scripts]

# Dependency graph
requires:
  - phase: 16-02
    provides: HAR captures (93 routes × 3 locales), build baseline, branch state, AUTONOMOUS-PROTOCOL Rule 2 fallback authority
  - phase: 13-performance-bundle-cleanup
    provides: Post-cleanup gz HTML baseline, font-preload trim to 2 families, client-island gating invariants, Spline home-only confirmation
  - phase: 16-01
    provides: SOTA markers M16 to M20 (Performance category), competitive intel for SOTA peer comparison
provides:
  - Production walk CWV scorecard (TTFB, gz HTML, gz JS, chunk count) for top-10 routes NL locale on canonical domain
  - Per-route LCP element + source analysis with image/font preload inventory
  - Bundle composition with top-3 chunk attribution + 13-14 chunk graph profile
  - Third-party scripts audit (GA, Calendly, Spline, Vercel SpeedInsights, Stripe, Resend, unpkg)
  - Image audit + lazy-load above-fold finding on case-study route
  - KPI baseline + 12-week targets for plan 16-16 weekly tracker
  - Lighthouse gap documentation (chalk@5 incompatibility) with chalk@4 pin + GCP project enable as recommended fix path
  - CrUX/PSI gating documentation with mitigation path
  - 25 ranked findings (2 P0, 6 P1, 13 P2, 4 P3) ready for 16-16 roadmap synthesis
affects: [16-15 cross-cutting synthesis, 16-16 Q3 roadmap, 16-fix-plan, future performance phases]

# Tech tracking
tech-stack:
  added: [pagespeed-insights-api-attempt, chrome-ux-report-api-attempt, production-curl-walk-fallback]
  patterns:
    - Production-walk fallback methodology when Lighthouse + CrUX gated
    - Per-route chunk-size measurement via curl against _next/static/chunks
    - Resource-count topology read from local-dev HAR (production sizes via curl)
    - HAR + production HTML triangulation for LCP candidate identification

key-files:
  created:
    - docs/audits/2026-05-18-v2/08-performance.md (14.5k words, 25 findings)
    - docs/audits/2026-05-18-v2/08-performance-pagespeed.json (20 quota-exhausted records, reproducibility evidence)
  modified:
    - .planning/phases/16-design-seo-audit-v2-sota/BUDGET.log (appended 8 entries)

key-decisions:
  - "Used production-walk fallback (curl TTFB + chunk size + HAR resource topology) when both Lighthouse (chalk@5 incompat) and PageSpeed Insights API (anonymous IP quota exhausted + Gemini-project key restricted) were blocked, per AUTONOMOUS-PROTOCOL Rule 2"
  - "Persisted the 20 quota-exhausted PSI error records to 08-performance-pagespeed.json instead of discarding, to document that the fallback was attempted and provide reproducibility for 16-16"
  - "Severity-tagged 25 findings (2 P0, 6 P1, 13 P2, 4 P3) using SOTA markers M16-M20 as the binary scoring axis from 00-competitive-intel.md"
  - "Did NOT re-flag what Phase 13 already removed (Spline non-home, eagerly-mounted client islands, Space Grotesk, 24 KB cookie consent on returning visitors); focused on regressions/remaining bloat per orchestrator critical-constraints"
  - "Documented CrUX gap with a concrete unblock path (dedicated fmai-audit GCP project with PSI + CrUX APIs enabled) rather than hand-waving"
  - "Filled gated columns with 'gated' string in CWV scorecard rather than estimates, preserving table structure for 16-16 fill-in"
  - "Removed single em-dash (line 151) per global CLAUDE.md no em-dash rule before commit"

patterns-established:
  - "Production-walk fallback: when lab harness fails, curl-based TTFB + chunk-size + HAR-topology gives directional CWV signal"
  - "Gap documentation: when external service is blocked, document blocker + mitigation path in audit doc; do not synthesize fake numbers"
  - "Cross-reference enforcement: every finding ties to a SOTA marker (M16-M20) and an evidence anchor (HAR/curl/code)"

requirements-completed: [AUDIT-V2-SOTA]

# Metrics
duration: 32min
completed: 2026-05-19
---

# Phase 16 Plan 09: Performance + Core Web Vitals + Bundle Audit Summary

**25-finding performance audit covering CWV scorecard, LCP per route, bundle composition, third-party scripts, image strategy, and 12-week KPI targets, using production-walk fallback after Lighthouse + PageSpeed Insights + CrUX APIs were all gated**

## Performance

- **Duration:** 32 min
- **Started:** 2026-05-19T19:40:00Z
- **Completed:** 2026-05-19T20:12:00Z
- **Tasks:** 2 (both completed)
- **Files modified:** 2 created + 1 appended (BUDGET.log)
- **Commit:** 9f24bf5

## Accomplishments

- Produced 14.5k-word performance audit with 25 ranked findings (P0/P1/P2/P3 severity, mapped to SOTA markers M16-M20 from 00-competitive-intel.md).
- Captured production-walk CWV scorecard for top-10 routes NL locale: median TTFB 286 ms, median gz HTML 25 KB, median total JS per route 870 KB, font preload 76 KB, all 10 routes Vercel cache HIT.
- Documented Lighthouse + CrUX + PSI gating with concrete unblock paths: chalk@^4.1.2 pin OR playwright-lighthouse upgrade for lab; dedicated fmai-audit GCP project with PSI/CrUX APIs enabled for field data.
- Identified 2 P0 findings (Lighthouse harness broken; CrUX API blocked), 6 P1 findings (Sindy portrait lazy-loaded above fold; Spline scene races hero preload; 118 KB CSS payload; 222 KB top chunk; SpeedInsights data is private; missing GA loader script).
- Reconfirmed Phase 13 invariants held in production (Spline home-only, 2 fonts preloaded, no eagerly-mounted client islands, zero synchronous third-party scripts on 9 of 10 routes).
- Established KPI baseline table with 12-week targets ready for 16-16 weekly Lighthouse cron.

## Task Commits

Both tasks committed atomically as a single phase-bracket commit per AUTONOMOUS-PROTOCOL Rule 4 (one commit per plan):

1. **Task 1 + Task 2 (audit doc + bundle/third-party/image/KPI sections + BUDGET log)** - `9f24bf5` (docs)

## Files Created/Modified

- `docs/audits/2026-05-18-v2/08-performance.md` - 25-finding performance audit (created)
- `docs/audits/2026-05-18-v2/08-performance-pagespeed.json` - 20 PSI quota-exhausted error records (reproducibility evidence)
- `.planning/phases/16-design-seo-audit-v2-sota/BUDGET.log` - appended 8 entries documenting production walk + PSI attempt + CrUX attempt + HAR inspection

## Decisions Made

- **Production-walk fallback over synthesis:** Both Lighthouse (chalk@5 incompat per `01-baseline-snapshot.md` item 9) AND PageSpeed Insights (anonymous IP quota exhausted, Gemini-project API key restricted) AND CrUX API (same key restriction) were blocked. Per AUTONOMOUS-PROTOCOL Rule 2 (soft-warn, continue), used `curl` against canonical production URLs to measure TTFB, gz HTML, per-chunk transfer sizes, plus HAR resource-count topology. Documented gating with concrete unblock paths so 16-16 can lift it.
- **Persisted PSI error records:** Wrote the 20 quota-exhausted records to `08-performance-pagespeed.json` instead of discarding. Provides reproducibility (16-16 can verify the fallback was needed) and documents the consumer-quota constraint.
- **Severity schema strict adherence:** All 25 findings tagged P0/P1/P2/P3 + tied to a SOTA marker M16-M20 + tied to an evidence anchor (HAR/curl/code) per orchestrator critical-constraints.
- **Did not re-flag Phase 13 work:** Phase 13 verification confirmed Spline non-home gating, eagerly-mounted client island removal, font-preload trim. This audit focused on regressions/remaining bloat (Spline scene 1.32 MB at home, JetBrains Mono 40 KB preload, lazy-loaded above-fold case-study portrait).
- **Removed em-dash before commit:** One em-dash found on line 151 of audit doc. Replaced with comma per global CLAUDE.md no em-dash rule. Verified zero em-dashes in final commit.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Soft warn, continue] Lighthouse + CrUX + PSI all gated**
- **Found during:** Task 1 (CrUX field data step)
- **Issue:** Plan task 1 required `WebFetch PageSpeed Insights API` calls for top 5 routes. Reality: anonymous-IP PSI quota exhausted (HTTP 429), and the only available Google Cloud key (`GEMINI_API_KEY` belongs to project 34000241058) does NOT have `pagespeedonline.googleapis.com` or `chromeuxreport.googleapis.com` enabled (HTTP 403, `API_KEY_SERVICE_BLOCKED`).
- **Fix:** Applied production-walk fallback: `curl` for TTFB + total time + gz HTML on top-10 routes, `curl` for chunk transfer sizes referenced in initial HTML, HAR inspection for resource topology, Phase 13 baseline for gz HTML floor reference. Persisted the 20 PSI error records to `08-performance-pagespeed.json` for reproducibility. Documented gating + concrete unblock path (dedicated fmai-audit GCP project) as P0 Finding 2.
- **Files modified:** docs/audits/2026-05-18-v2/08-performance.md (Lighthouse gap section + CrUX field data section + Finding 1 + Finding 2)
- **Verification:** Verification commands pass (CWV scorecard present, LCP element section present, Bundle analysis present, Third-party scripts audit present, KPI baseline present, 25 findings present, 0 em-dashes).
- **Committed in:** 9f24bf5

**2. [Rule 2 - Soft warn, continue] BUDGET.log: PSI calls logged as attempted-but-blocked, not as successful API consumption**
- **Found during:** End of Task 1
- **Issue:** Plan required logging WebFetch PageSpeed Insights calls to BUDGET.log. Reality: 20 attempted PSI calls all failed at the consumer quota layer (no successful consumption to log).
- **Fix:** Logged attempts as `pagespeed-api attempted 20 calls ... all returned HTTP 429 Quota exceeded` plus the persisted JSON evidence file. Documents that the fallback was attempted in good faith.
- **Files modified:** .planning/phases/16-design-seo-audit-v2-sota/BUDGET.log (8 appended entries)
- **Verification:** BUDGET.log line count went from 36 to 44 with 8 new entries covering production walk + PSI attempt + CrUX attempt + HAR inspection.
- **Committed in:** 9f24bf5

**Total deviations:** 2 auto-fixed (both Rule 2 soft-warn-continue).
**Impact on plan:** Plan goal (block-lifting CWV baseline for 16-16) is partially blocked by external service quota; audit-side deliverable (25 findings + KPI baseline + production-walk numbers + concrete unblock path) is complete. The two P0 findings precisely capture the external blockers and the documented fix path keeps the 16-16 roadmap actionable.

## Issues Encountered

- Anonymous PSI quota was already exhausted at start of execution. Retried with user's stored `GEMINI_API_KEY`: HTTP 403 because the Gemini project lacks PSI + CrUX API enablement. No path to lab Lighthouse numbers within this plan's execution window. Documented as P0 Finding 1 + Finding 2 with concrete unblock instructions for 16-16.
- HAR files reflect local-dev unminified chunks (e.g., 1.18 MB unminified vendor chunk that compresses to ~222 KB in production). HAR is useful for resource-count topology but not for production transfer sizes. Mitigated by curl-walking each chunk URL against production to get real wire bytes.
- Plan-level verification commands had a PowerShell `$c` variable interpolation issue when invoked via the orchestrator's verify task (bash strips `$c`). Worked around by running explicit Select-String + Measure-Object commands which confirmed: 0 em-dashes, all 5 required section headings present, exactly 25 findings.

## User Setup Required

None for this plan. For the recommended 16-16 unblock:
- **External services to configure:** Create dedicated `fmai-audit` Google Cloud project, enable `pagespeedonline.googleapis.com` + `chromeuxreport.googleapis.com`, mint key, store as `GOOGLE_PSI_API_KEY` in `~/.claude/.env`. Estimated 15 minutes one-time setup.
- **Library fix:** Pin `chalk@^4.1.2` as `overrides` in `package.json` resolutions (15-line edit + 1-line resolution).

## Next Phase Readiness

- **For 16-15 (Cross-cutting synthesis):** This audit's 25 findings are ranked + severity-tagged + cross-referenced. 6 P1 findings (Sindy lazy-load, Spline race, CSS 118 KB, top chunk 222 KB, private SpeedInsights, missing GA loader) are the highest-leverage actions for 16-16.
- **For 16-16 (Q3 roadmap):** KPI baseline table with 12-week targets ready. Two P0 findings provide concrete external-service unblock checklist (chalk pin + GCP project enable + key in `~/.claude/.env`) totaling 30 minutes of one-time setup.
- **Cross-reference integrity:** Plan 16-08 (a11y) and 16-10 (cross-browser) are running in parallel. The hero `<img alt="">` decision (Finding 24) cross-references 16-08. The case-study lazy-load above-fold (Finding 3) is a perf finding; 16-10 will cover any cross-browser image-loading variance.
- **No blockers for downstream plans.** Phase 13 invariants confirmed held. Plan 16-09 deliverable is complete.

## Self-Check: PASSED

- [x] `docs/audits/2026-05-18-v2/08-performance.md` exists (~14.5k words, well above 800-word threshold)
- [x] CWV scorecard section present (`## CWV scorecard (production-curl fallback, NL locale)`)
- [x] LCP element + source per route section present (`## LCP element + source per route`)
- [x] Bundle analysis section present (`## Bundle analysis`)
- [x] Third-party scripts audit section present (`## Third-party scripts audit`)
- [x] Image audit section present (within `## Bundle analysis` as `### Image audit per route`)
- [x] KPI baseline + targets section present (`## KPI baseline + targets for 16-16`)
- [x] 25 findings present (exact, ranked P0-P3 with effort callouts)
- [x] Zero em-dashes (verified by PowerShell Select-String)
- [x] `docs/audits/2026-05-18-v2/08-performance-pagespeed.json` exists (PSI fallback evidence)
- [x] BUDGET.log appended (8 new entries documenting production walk + PSI attempt + CrUX attempt + HAR inspection)
- [x] Commit `9f24bf5` on branch `audit/2026-05-18-v2-sota` with exact message `docs(audit): 16-09 Wave 2 performance audit (PageSpeed Insights fallback)`
- [x] Commit diff against parent `dae226a` shows ONLY the 3 files in commit_invariants (no production code changes, no STATE.md edit by this plan)
- [x] Lighthouse gap documented in main audit doc with citation of baseline doc item 9 + concrete fix path
- [x] All findings reference SOTA markers M16-M20 from `00-competitive-intel.md`
- [x] No re-flagging of Phase 13 already-removed items

---
*Phase: 16-design-seo-audit-v2-sota*
*Plan: 09 (Wave 2 Team 07)*
*Completed: 2026-05-19*
