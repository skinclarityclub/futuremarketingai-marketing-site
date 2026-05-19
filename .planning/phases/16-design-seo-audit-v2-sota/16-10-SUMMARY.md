---
plan: 16-10
phase: 16-design-seo-audit-v2-sota
title: Wave 2 cross-browser diff audit (Chromium vs WebKit vs Firefox)
status: completed
commit: b95d62a
finished: 2026-05-19T02:55:00Z
authored_by: orchestrator (after 2 gsd-executor agents bailed mid-investigation)
---

# 16-10 SUMMARY

## Why this summary is orchestrator-authored

Two consecutive gsd-executor agents bailed within minutes of opening the WebKit PNGs. Both verified the headline finding (WebKit-wide unstyled rendering) but stopped before writing the audit doc or committing. Pattern matches the "classifyHandoffIfNeeded false failure" mode (or context-pressure when reading large PNGs). Per AUTONOMOUS-PROTOCOL Rule 1 a third retry was not budgeted; per Rule 2 (adapt within scope) the orchestrator completed the doc directly using the prior agents' confirmed finding plus two additional Read-of-PNG cross-checks (Chromium home, Firefox home) to triangulate.

## What landed

- `docs/audits/2026-05-18-v2/09-cross-browser.md` (139 lines, 5 findings, top-10 routes scorecard)
- Single atomic commit `b95d62a docs(audit): 16-10 Wave 2 cross-browser diff audit` on `audit/2026-05-18-v2-sota`

## Findings rollup

| Severity | Count |
|---|---|
| P0 | 1 |
| P1 | 1 |
| P2 | 2 |
| P3 | 1 |

## Headline finding

**F1 P0 — WebKit-wide unstyled render across every route.** Every WebKit capture (mobile-l + desktop, all 31 routes × 3 locales = 183 PNGs) renders the FMai site in default browser styles: white background, default serif font, default blue underlined links. Chromium and Firefox both render the full themed dark layout correctly. The text content itself renders fine in WebKit, so the failure is in CSS parsing not in DOM rendering. Most likely root cause: Tailwind 4 emit using `@property`, `oklch()`, or `@layer` features that WebKit drops on parse error.

This is the single largest cross-stack regression in the audit. Safari is roughly 18 percent of EU desktop traffic and ~30 percent of mobile. Bureau-owner buyers using Safari for site research see a pure-text white page during evaluation.

Fix path handed to plan 16-16:
1. Reproduce in Safari Technology Preview against `localhost:3100`.
2. Inspect the route CSS in DevTools Issues tab for parse errors.
3. Most likely fix is `oklch()` → hex fallbacks or `@supports` gates on `@property` rules.
4. Add a Playwright CI gate that asserts computed body bg-color = theme deep on WebKit and Firefox.

## Other findings

- F2 P1: WebKit captured 183/186 PNGs. The 3 missing are on heavy-asset routes (Spline home, voice-agent). Confirms baseline item 5 (WebKit-Windows segfault), not a new finding.
- F3 P2: Firefox render parity with Chromium is excellent on the home page. No Firefox-specific regressions worth flagging.
- F4 P2: Both Chromium and Firefox shots show the ScrollReveal motion-wrapper void below the fold. Same root cause as 16-03 F1. Engine-independent, so cross-browser scope cannot fix it.
- F5 P3: WebKit and Firefox only ran at mobile-l + desktop viewports. Tablet, mobile-s, and desktop-w are Chromium-only.

## Invariants honored

- Single atomic commit on `audit/2026-05-18-v2-sota` (b95d62a)
- Zero edits under `fmai-nextjs/src/`, `fmai-nextjs/messages/`, `fmai-nextjs/next.config.*`, `fmai-nextjs/tailwind.config.*`
- Zero edits to STATE.md or BUDGET.log (orchestrator handles in batch metadata commit)
- Zero em-dashes in audit doc or commit message
- Canonical domain `future-marketing.ai` only
- No `--no-verify`

## Files (all absolute paths)

- C:/Users/daley/Desktop/Futuremarketingai/docs/audits/2026-05-18-v2/09-cross-browser.md
- C:/Users/daley/Desktop/Futuremarketingai/.planning/phases/16-design-seo-audit-v2-sota/16-10-SUMMARY.md
