---
phase: 16-design-seo-audit-v2-sota
plan: 07
subsystem: seo-geo-audit
tags: [geo, llmeo, ai-citations, gemini, wikidata, schema-org, speakable, llms-txt, audit]

# Dependency graph
requires:
  - phase: 16-01
    provides: SOTA markers M19-M25 (GEO/LLMEO category) + competitor baseline
  - phase: 16-02
    provides: dev-server up, audit branch, baseline snapshot
  - phase: 14-01
    provides: Organization JSON-LD with stable @id, PersonJsonLd component, llms.txt + llms-full.txt baseline, AI crawler allowlist
provides:
  - Baseline citation matrix (7 queries × 4 providers = 28 cells)
  - Reproducible measurement script (measure-llm-citations.mjs)
  - 25 GEO/LLMEO findings spanning Wikidata, speakable, author bylines, LocalBusiness, llms.txt parity, FAQPage, HowTo, Offer schema
  - Concrete KPI baseline (0/7 Gemini grounded citations) for 16-16 fix-plan targets
affects: [16-15, 16-16, future GEO sprints, Phase 17 verification]

# Tech tracking
tech-stack:
  added: [gemini-2.5-flash-google-grounded research provider via execSync, Bing/Google SERP probe pattern via raw fetch]
  patterns:
    - "Citation matrix JSON schema (per-query × per-provider object with cited/urls/answer_excerpt/error)"
    - "Plan-scoped audit script under fmai-nextjs/scripts/audit/"
    - "BUDGET.log telemetry pattern continued (gemini call N of 100)"

key-files:
  created:
    - "fmai-nextjs/scripts/audit/measure-llm-citations.mjs (228 lines)"
    - "docs/audits/2026-05-18-v2/06-geo-llmeo.md (616 lines, 7048 words)"
    - "docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json (205 lines, machine-readable baseline)"
  modified:
    - ".planning/phases/16-design-seo-audit-v2-sota/BUDGET.log (appended 11 lines covering 7 Gemini calls + 14 SERP probes)"

key-decisions:
  - "Gemini 2.5 Flash with Google Search grounding is the only true LLM citation API used; Perplexity banned per Wave 0"
  - "Bing and Google SERP serve as Copilot/ChatGPT-search citation proxies; Claude.ai search marked provider_unavailable across all rows"
  - "Speakable schema coverage at 3/27 routes is a P1 GEO surface gap, not a P0 (the routes that DO use Speakable use it correctly)"
  - "LocalBusiness schema NOT recommended (privacy concern for solo founder home address; ProfessionalService already covers the use case)"
  - "Wikidata QID creation is highest single-leverage fix; deferred to 16-16 fix-plan"
  - "llms.txt + llms-full.txt declare deprecated Partner-tier pricing (P0/P1 parity gaps); regenerate from SSoT in 16-16"
  - "Auto-generation of llms.txt at build time recommended over manual maintenance"

patterns-established:
  - "Cross-LLM citation matrix structure: queries × providers JSON, with _summary block and per-provider error tolerance"
  - "SERP fetch limitations are documented honestly (consent walls, bot detection) rather than papered over"
  - "Findings table cells use V/X/-- legend to distinguish provider-failure from negative-signal"

requirements-completed: [AUDIT-V2-SOTA]

# Metrics
duration: 23min
completed: 2026-05-19
---

# Phase 16 Plan 07: Wave 2 Team 05 GEO and LLMEO Citation Audit Summary

**Baseline citation rate measured at 0/7 Gemini grounded queries despite correct grounded answer text, exposing the Wikidata-QID gap, llms.txt pricing-parity drift, and 24/27 routes missing Speakable schema as the three highest-leverage GEO fixes for 16-16.**

## Performance

- **Duration:** 23 min
- **Started:** 2026-05-19T18:12:30Z (measure-llm-citations.mjs first invocation)
- **Completed:** 2026-05-19T18:35:00Z (atomic commit afb3f23)
- **Tasks:** 2 (script + audit doc, single atomic commit per plan invariant)
- **Files modified/created:** 4 (1 modified, 3 new)

## Accomplishments

- Built reproducible citation measurement script `fmai-nextjs/scripts/audit/measure-llm-citations.mjs` that runs 7 NL+EN queries against Gemini 2.5 Flash with Google grounding plus secondary Bing+Google SERP probes, writes a structured JSON baseline to `docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json`, and is re-runnable in Phase 17 verification without re-implementation.
- Captured the empirical baseline: **0/7 Gemini grounded citations contain `future-marketing.ai`** even on queries where Gemini's grounded answer text describes FMai accurately (Q1, Q4). This is the canonical GEO failure: the model has the knowledge but credits other sources.
- Wrote `docs/audits/2026-05-18-v2/06-geo-llmeo.md` (7,048 words, 25 findings F-01 through F-25, 11 required sections present) auditing every GEO surface the codebase emits: Organization JSON-LD `sameAs` (missing Wikidata), Speakable selectors (3/27 route coverage), Person schema (Daley + Sindy, LinkedIn-only `sameAs`), LocalBusiness presence (intentionally absent, recommended to stay absent), llms.txt + llms-full.txt parity vs live workspace-priced model (3 mismatches identified including P0 fictional one-time onboarding fees), AI-crawler allowlist (16 explicit crawlers, scored as best-in-class), and a Top-25-findings table with severity, route, viewport, locale, evidence, code-path, impact, fix, effort, and confidence per finding.
- Established a concrete KPI baseline for 16-16: Gemini grounded citation rate 0/7 -> target 4/7 by Phase 19 close, with ranked 8-step fix-plan (llms.txt regenerate -> Wikidata QIDs -> Speakable expansion -> FAQPage/HowTo schemas -> author pages -> Offer schemas -> SERP-probe infrastructure upgrade -> SKC inbound link).

## Task Commits

Per plan invariant (single atomic commit per plan), one commit landed:

1. **Task 1+2 combined: build script, run matrix, write audit doc, update BUDGET.log** - `afb3f23` (docs)

Both tasks were committed together per the plan's commit invariant: `docs(audit): 16-07 Wave 2 GEO LLMEO audit plus cross-LLM citation matrix`. The 4 staged files match the frontmatter `files_modified` list exactly.

## Files Created/Modified

- `fmai-nextjs/scripts/audit/measure-llm-citations.mjs` (created, 228 lines) - Reproducible citation harness. Wraps `~/.claude/scripts/gemini-research.mjs --json` for primary measurement, raw `fetch` against Bing+Google SERPs for secondary, and stubs Claude as `provider_unavailable`. CLI flags: `--output=path`, `--gemini-only`. Exits 0 on success with matrix written to JSON.
- `docs/audits/2026-05-18-v2/06-geo-llmeo.md` (created, 616 lines, 7,048 words) - Wave 2 Team 05 audit document with 11 sections: Executive summary, Methodology, Cross-LLM citation matrix table, Per-query analysis (7 queries with full Gemini answer excerpts), Speakable schema audit, Author bylines audit, Wikidata entity audit (with QID creation steps), LocalBusiness schema audit, llms.txt parity audit (mapping every claim to live state), AI-crawler allowlist audit (recognizing the 16-crawler best-in-class baseline), Top 25 findings with full schema, plus Coverage matrix recap and Reproducibility section.
- `docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json` (created, 205 lines) - Machine-readable citation baseline. Per-query rows with `gemini_grounded` (cited, urls, citation_count, answer_excerpt), `bing_serp` (cited, urls, top_titles, result_count or error), `google_serp` (same), `claude_search` (cited: null, reason: provider_unavailable, note). `_summary` block records start/finish ISO timestamps and provider list.
- `.planning/phases/16-design-seo-audit-v2-sota/BUDGET.log` (modified, +11 lines) - Logged 7 Gemini grounded calls (call 4 through 10 of 100), 14 WebFetch-equivalent SERP probes (call 1 through 14 of 50), plus script-run start/end timestamps. Append-only per protocol.

## Decisions Made

- **Q: Run citation script from repo root or from fmai-nextjs/?** A: From repo root, because `OUTPUT_PATH` is cwd-relative and the plan-required path `docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json` resolves correctly only with cwd at repo root. Documented in script JSDoc usage example.
- **Q: How to handle SERP probe failures (consent walls)?** A: Document honestly as `result_count: 0` with the cell flagged P2 in findings (F-12, F-13), recommend Playwright-driven upgrade for Phase 17. Did not attempt to fake citation data or skip the providers entirely; the JSON matrix preserves the empirical truth that raw `fetch` cannot reach SERPs from this environment.
- **Q: LocalBusiness schema yes or no?** A: NO. Solo founder use case + privacy concern around exposed KvK/home address + remote-first operating model means `ProfessionalService` is the right Organization subtype. Documented in finding F-section under LocalBusiness audit with both for/against arguments.
- **Q: Severity for llms.txt parity gaps?** A: Split by truth-distance. The deprecated 5-tier framing in llms.txt is P1 (out-of-date but not fictional). The one-time onboarding fees in llms-full.txt (EUR 1,997 / 3,997 / 5,997+) are P0 because they describe a cost structure that does not exist; an LLM citing this misleads prospects.
- **Q: How many findings to write?** A: Exactly 25, matching the plan threshold of "≥25" while staying within the audit-doc 7k-word soft cap. F-01 through F-25 are individually substantive (each has full schema fields) rather than padded.
- **Q: Em-dash compliance?** A: Two em-dashes leaked into the "Providers explicitly NOT used" bullet list. Caught by post-write grep and rewritten to use colons. Final em-dash count in both audit doc and script: 0.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical] Added `--gemini-only` and `--output=path` CLI flags to citation script**
- **Found during:** Task 1 (script implementation)
- **Issue:** Plan-supplied template script was non-parameterizable; running it twice with different output paths or to re-test only Gemini after a SERP fix would require code edits each time.
- **Fix:** Added args parser that recognizes `--output=path` and `--gemini-only` flags. Default `OUTPUT_PATH` preserved as `docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json` so plan-required path still works without flags.
- **Files modified:** fmai-nextjs/scripts/audit/measure-llm-citations.mjs
- **Verification:** Default run wrote matrix to plan-required path successfully; usage block in JSDoc documents both flags. Phase 17 will use `--output=` for incremental snapshots.
- **Committed in:** afb3f23 (atomic plan commit)

**2. [Rule 2 - Missing Critical] Added output directory auto-creation**
- **Found during:** Task 1 (script implementation)
- **Issue:** Plan-supplied template called `writeFileSync` directly without ensuring parent directory exists. On a clean checkout where `docs/audits/2026-05-18-v2/` does not yet exist, the script would crash.
- **Fix:** Added `mkdirSync(outDir, { recursive: true })` guard before write.
- **Files modified:** fmai-nextjs/scripts/audit/measure-llm-citations.mjs
- **Verification:** Script runs cleanly even when output dir was missing.
- **Committed in:** afb3f23

**3. [Rule 1 - Bug] Removed em-dashes from audit doc**
- **Found during:** Post-write em-dash audit (project rule: no em-dashes in user-facing copy)
- **Issue:** Two em-dashes leaked in the "Providers explicitly NOT used" bullet list (Methodology section).
- **Fix:** Replaced both with colons via Edit tool. Final em-dash count: 0 (verified via `node -e "(c.match(/—/g) || []).length"`).
- **Files modified:** docs/audits/2026-05-18-v2/06-geo-llmeo.md
- **Verification:** Em-dash regex returns zero matches. Same check confirms script has zero em-dashes.
- **Committed in:** afb3f23

---

**Total deviations:** 3 auto-fixed (2 missing critical, 1 bug)
**Impact on plan:** All auto-fixes were small. Script flags improve Phase 17 re-runability. Output-dir guard prevents fresh-checkout crash. Em-dash fix enforces project copy rule. No scope creep, no architectural changes.

## Issues Encountered

- **PowerShell variable expansion in bash heredoc.** The plan's automated verify command `powershell -NoProfile -Command "$c = Get-Content ..."` failed because bash expanded `$c` to empty string before PowerShell received it. Worked around by writing the verify script to a temp `.ps1` file and invoking `powershell -File`. Same verification logic, deterministic execution. Both Task 1 verify (file existence) and Task 2 verify (4 required sections + 25 findings) PASS.
- **Bing and Google SERPs unreachable via raw `fetch`.** Both providers serve consent walls or render SERP markup entirely client-side. Documented as Findings F-12 and F-13 with severity P2. Recommended upgrade to Playwright-driven session or paid SERP API for Phase 17. Did not retry or pad data.

## User Setup Required

None. This audit plan is research-only; no external service configuration is required. Phase 17 verification will require Playwright SERP upgrade or paid SERP API key (Serper / DataForSEO / Bright Data) which is a future-phase decision.

## Next Phase Readiness

- Wave 2 Team 05 deliverable complete and committed. Orchestrator can mark `16-07` as `status: completed` in `STATE.md` (not modified by this plan per critical_constraints).
- Phase 16-15 cross-cutting synthesis can consume the 25 findings from `06-geo-llmeo.md`. The headline citation-baseline number (0/7 Gemini) belongs in `00-executive-summary.md` alongside the visual + brand + interaction headline findings from Wave 2 batch 2A.
- Phase 16-16 fix-plan has a ranked 8-step backlog (see audit doc § "Recommended 16-16 fix-plan inputs"): regenerate llms.txt -> create Wikidata QIDs -> extend Speakable coverage -> add FAQPage + HowTo schemas -> create /author/[slug] route -> add Offer JSON-LD on /pricing -> upgrade SERP probe infrastructure -> solicit SKC inbound link. Estimated total fix-plan effort 12-16 hours of code plus 48-72 hours Wikidata survival wait.
- Phase 17 verification will re-run `node fmai-nextjs/scripts/audit/measure-llm-citations.mjs` after each fix-plan plan and measure citation-rate delta against this baseline.

## Self-Check: PASSED

Verified post-write:
- `fmai-nextjs/scripts/audit/measure-llm-citations.mjs` FOUND (228 lines, executable script)
- `docs/audits/2026-05-18-v2/06-geo-llmeo.md` FOUND (616 lines, 7,048 words, 25 findings, 11 sections, 0 em-dashes)
- `docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json` FOUND (205 lines, 7 query rows, 4 provider columns, JSON-parseable)
- `.planning/phases/16-design-seo-audit-v2-sota/BUDGET.log` MODIFIED (+11 lines appended, append-only respected)
- Commit `afb3f23` FOUND in `git log --oneline` on branch `audit/2026-05-18-v2-sota`
- Commit message matches plan requirement EXACTLY: `docs(audit): 16-07 Wave 2 GEO LLMEO audit plus cross-LLM citation matrix`
- Zero production-code edits: `git diff --cached --name-only -- 'fmai-nextjs/src/' 'fmai-nextjs/messages/' 'fmai-nextjs/next.config.*' 'fmai-nextjs/tailwind.config.*'` returns empty (exit 0)
- Zero STATE.md modifications (per critical_constraints, orchestrator owns)
- Hooks ran during commit (no `--no-verify` flag used)
- Plan Task 1 verify: PASS. Plan Task 2 verify: PASS.

---
*Phase: 16-design-seo-audit-v2-sota, plan 07*
*Completed: 2026-05-19*
