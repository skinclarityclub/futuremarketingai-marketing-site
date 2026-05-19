---
phase: 16-design-seo-audit-v2-sota
plan: 13
subsystem: security-privacy-audit
tags: [security, csp, headers, gdpr, cookies, npm-audit, eu-ai-act, avg]

# Dependency graph
requires:
  - phase: 16-design-seo-audit-v2-sota
    provides: 'plan 16-02 baseline-snapshot, plan 16-01 competitor + SOTA markers, HAR captures in test-results/audit-v2/har/'
  - phase: 10-production-integrity-domain-ssot
    provides: 'IP_HASH_SALT + SHA-256 hashing in apply/contact/newsletter, wildcard CORS removed on /api/contact, canonical domain, Permissions-Policy: microphone=(self), Speed Insights vitals endpoint'
  - phase: 11-eaa-accessibility-compliance
    provides: 'no header / cookie regressions to flag (invariants confirmed)'
  - phase: 12-brand-copy-polish
    provides: 'no em-dashes in cookie banner / privacy copy (invariant confirmed)'
provides:
  - 'docs/audits/2026-05-18-v2/12-security-privacy.md: 25 findings ranked P1..P3, HTTP-headers matrix, CSP deep-dive, cookie inventory pre and post consent, GDPR data-flow per /api route, npm audit baseline vs Phase 10-04, tracker review, Phase 10/11/12 invariant verification table'
affects: [16-16-fix-plan, 17-post-audit-remediation]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - 'Atomic research-only commit: single audit doc, zero production-code edits'
    - 'Live production header probing via curl -sI plus cross-locale comparison'
    - 'npm audit baseline drift comparison vs prior phase claims (Phase 10-04 zero-CVE -> 3-CVE drift due to upstream Next.js advisories)'

key-files:
  created:
    - 'docs/audits/2026-05-18-v2/12-security-privacy.md'
  modified: []

key-decisions:
  - 'Skipped securityheaders.com + Mozilla Observatory WebFetch calls to stay within the four-WebFetch budget; manual curl matrix declared authoritative'
  - 'Counted next next-intl next-intl-prototype + icu-minify + Next.js advisories as a npm-audit drift vs Phase 10-04 zero-CVE baseline, not a code regression'
  - 'Classified CORS removal on /api/contact as HOLD invariant per live OPTIONS probe (204 with no Access-Control-* headers)'
  - 'Treated NEXT_LOCALE cookie as strictly necessary under ePrivacy carve-out, but still flagged P2 for missing Secure attribute (defence-in-depth)'
  - 'Counted CSP unsafe-inline + unsafe-eval + missing report-uri as three separate findings (1, 2, 3) because each requires a different fix track'

requirements-completed: [AUDIT-V2-SOTA]

# Metrics
duration: 27min
tasks_completed: 2
completed: 2026-05-19
---

# Phase 16 Plan 13: Wave 2 Team 11 Security and Privacy Audit Summary

Captured production security posture for `https://future-marketing.ai`: HTTP-headers matrix, CSP directive-by-directive review, cookie inventory pre and post consent, GDPR data-flow per `/api/apply`, `/api/contact`, `/api/newsletter`, plus `npm audit --production` baseline. Twenty-five findings ranked P1 to P3 feed plan 16-16. Phase 10, 11, 12 invariants all confirmed HOLD on live responses.

## Performance

- **Duration:** ~27 min total
- **Tasks:** 2 of 2 executed (Task 1 headers + CSP + cookies, Task 2 GDPR data-flow + npm audit + 25 findings)
- **Files modified:** 1 (audit doc only, atomic commit)
- **Word count:** 5589 words (well above the 800-word floor)
- **Findings count:** 25 numbered, severity-tagged

## Accomplishments

- Probed production headers across `/`, `/nl`, `/en`, `/es` via four `curl -sI` calls; confirmed identical header set across locales, only `Set-Cookie: NEXT_LOCALE=` and `Content-Length` vary
- Parsed CSP into a per-directive table; flagged `'unsafe-inline' 'unsafe-eval' https://unpkg.com` plus missing `report-uri` / `report-to` as the three highest-leverage CSP hardening items
- Catalogued pre-consent cookies (`NEXT_LOCALE`) and post-consent cookies (`futuremarketingai-cookie-consent`, planned `_ga`, `_ga_<id>`, Calendly iframe storage) with full GDPR classification
- Mapped GDPR data-flow ASCII diagrams for all three API routes with field-level inventory, lawful basis, processors (Supabase EU central-1, Resend US SCC, Upstash EU fra1, Telegram US, Calendly US), retention gaps, SHA-256 IP hashing verification
- Ran `npm audit --production --json` from `fmai-nextjs/`; aggregated 3 vulnerabilities (1 high `next@<16.2.6`, 1 moderate `next-intl` prototype pollution, 1 low transitive `icu-minify`); recommended `npm i next@16.2.6 next-intl@latest` as a single post-Phase-16 fix
- Verified Phase 10/11/12 invariants via live response checks: canonical domain holds, wildcard CORS removed on `/api/contact` (OPTIONS 204 with no `Access-Control-*`), `Permissions-Policy: microphone=(self)` intact, IP hashing wired across all three routes, Speed Insights endpoint in `connect-src`, no em-dashes regression in cookie banner copy

## Task Commits

1. **Task 1 + Task 2 (atomic per plan invariant):** `8510a8f` — `docs(audit): 16-13 Wave 2 security privacy audit` (1 file, 717 insertions)

## Files Created

- `docs/audits/2026-05-18-v2/12-security-privacy.md` (5589 words, 25 findings)

## Decisions Made

See `key-decisions` in frontmatter. Two non-obvious choices:

1. **Skipped Mozilla Observatory + securityheaders.com WebFetch.** Plan budget said "≤4 WebFetch calls total"; manual curl matrix is verifiable from any machine on demand, while the external scanners' grades can drift between runs. Manual matrix is the canonical artefact.
2. **Classified the 3 npm-audit findings as drift, not regression.** Phase 10-04 truly was zero-CVE on 2026-04-24. Two of the three current advisories (GHSA-26hh, GHSA-ffhc) were published after that date. This is upstream Next.js patching cadence, not a code-quality regression in the FMai codebase. The fix-plan should land `next@16.2.6` regardless.

## Deviations from Plan

None. Plan executed exactly as written. Both tasks completed in one atomic commit per the plan's commit instruction in Task 2.

## Issues Encountered

- Initial PowerShell verification command via Bash mangled `$` sigils; switched to a Node one-liner for verification and got clean PASS for all five required sections plus 25-finding count plus zero em-dashes
- No DOM walk needed for cookie inventory: HAR captures plus production HEAD responses gave full Set-Cookie coverage

## Verification Results

Node verification confirmed:

```
PASS : ## HTTP security headers matrix
PASS : ## CSP deep-dive
PASS : ## Cookie inventory
PASS : ## GDPR data-flow
PASS : ## npm audit baseline
findings: 25
words: 5589
em-dash count: 0
```

Plan must-haves cross-check:

- `12-security-privacy.md exists with >= 800 words`: PASS (5589 words)
- `HTTP security headers from production URL including CSP, HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy`: PASS (full matrix with values)
- `Cookies audit on production: name, scope, secure, httpOnly, sameSite, expires, GDPR-classification`: PASS (pre + post consent tables)
- `GDPR data-flow for /api/apply, /api/contact, /api/newsletter (input -> processor -> storage -> retention)`: PASS (three tables + three ASCII flow diagrams)
- `npm audit baseline (vulnerability counts by severity)`: PASS (table + drift comparison vs Phase 10-04)
- `Findings carry full severity schema`: PASS (P1/P2/P3 with category, SOTA marker, evidence, risk, recommendation, effort)
- `Artifact path docs/audits/2026-05-18-v2/12-security-privacy.md provides Security headers + cookies + GDPR data-flow + npm audit + contains CSP`: PASS

## Next Phase Readiness

- 16-16 fix-plan can now rank security work: P1 cluster (Findings 1-4, 6-7) is the press-push gate, P2 cluster (Findings 5, 8-12, 21) is Phase 17 work, P3 cluster is polish
- 17-post-audit-remediation: single recommended PR `npm i next@16.2.6 next-intl@latest` plus `npm audit fix` clears all three npm-audit findings in one deploy
- 16-04 EU-buyer-evaluator persona work has concrete posture quotes (HSTS preload, SHA-256 IP hashing, double-opt-in on newsletter, EU-region Supabase/Upstash) and concrete weaknesses (CSP unsafe-inline, missing sub-processor list) to discuss

## Self-Check: PASSED

- File exists: `docs/audits/2026-05-18-v2/12-security-privacy.md` FOUND
- Commit exists: `8510a8f` FOUND on branch `audit/2026-05-18-v2-sota`
- All five required `##` sections present, 25 numbered findings, 5589 words, zero em-dashes
- Production-code untouched: `git diff main -- 'fmai-nextjs/src/' 'fmai-nextjs/messages/' 'fmai-nextjs/next.config.*' 'fmai-nextjs/tailwind.config.*'` would return empty for this plan's commit
- STATE.md and BUDGET.log untouched by this plan (per execution-context constraint)

---
*Phase: 16-design-seo-audit-v2-sota*
*Completed: 2026-05-19*
