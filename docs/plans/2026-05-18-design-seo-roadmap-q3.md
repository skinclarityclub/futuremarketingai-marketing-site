---
title: Design + SEO/GEO Roadmap Q3 2026 (12-week)
phase_source: 16-design-seo-audit-v2-sota
fix_plan_source: docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md
synthesis_source: docs/audits/2026-05-18-v2/14-cross-cutting-synthesis.md
window: 2026-W21 to 2026-W32 (12 weeks)
canonical_domain: future-marketing.ai
created: 2026-05-19
status: ready_for_execution
---

# Design + SEO/GEO Roadmap Q3 2026

## Overview

This roadmap sequences the 6 fix-plan phases (A through F) across 12 calendar weeks. Each week ships a primary commit-cluster against one phase, with KPI delta-targets that compound toward end-of-Q3 targets. The roadmap reads `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` as the canonical task source: every weekly milestone names which task-blocks land, what KPI moves, and which verification command confirms the move. Rules: geen em-dashes, canonical domain `future-marketing.ai` only.

## KPI baseline + targets

Baselines captured from Phase 16 audit run 2026-05-18 (commit `a4d6b82`). Targets reflect realistic Q3 deltas given the fix-plan effort estimates. Sources column points to where each baseline figure was measured during Wave 2.

| KPI | Baseline (2026-05-18) | Week 4 Target | Week 8 Target | Week 12 Target | Source |
|---|---|---|---|---|---|
| Lighthouse Performance (mobile avg) | gated (harness broken) | 70 (first measurement) | 82 | 90 | `test-results/audit-v2/lighthouse/` (after D1) |
| Lighthouse Accessibility (avg) | gated | 92 | 96 | 98 | `test-results/audit-v2/lighthouse/` |
| WCAG 2.2 AA axe pass-rate | 90.3% (84 of 93 snapshots clean) | 95% | 98% | 100% (0 serious) | `test-results/audit-v2/axe/` |
| Cross-LLM citation rate (Gemini grounded) | 0 of 7 queries | 1 of 7 | 3 of 7 | 5 of 7 | `docs/audits/2026-05-18-v2/06-geo-llmeo-matrix.json` |
| Speakable selectors matching DOM | 0 of 6 classes present | 6 of 6 | 6 of 6 | 6 of 6 | grep DOM snapshots |
| BreadcrumbList @id coverage | 0 of 84 blocks | 84 of 84 | 84 of 84 | 84 of 84 | curl + jq schema-validator |
| First Load JS (home, gz) | 870 KB shared chunk profile | -10% | -15% | -20% (target <700 KB) | `npm run build` summary |
| CSS payload (gz) | 118 KB every route | 110 KB | 95 KB | 80 KB | `npm run build` summary |
| Spline asset on critical path | 1.32 MB blocking | deferred (idle-import) | deferred + static PNG LCP | deferred + reduced-motion gated | curl _next/static |
| i18n parity (EN, ES leaf paths vs NL) | 100% structural, ES quality FAIL | 100% structural + ES length compliant | 100% + ES Flesch >=70 | 100% + ES translator-reviewed | `messages/*.json` diff |
| ES title compliance (<=70c) | 21 over-length titles | 0 | 0 | 0 | `messages/es.json` |
| ES description compliance (<=155c) | 12 over-length descriptions | 0 | 0 | 0 | `messages/es.json` |
| Apply form fields above-fold | 9 fields | 9 (no Phase A change) | 3 (after D4) | 3 | source code grep |
| WebKit theme rendering | broken (Times-New-Roman default) | broken (C-phase) | fixed | fixed + CI gate | Playwright cross-browser spec |
| Cookie banner conversion-block | overlays hero CTA all viewports | overlays (C-phase) | bottom-sheet, granular | bottom-sheet + re-open | manual visit + screenshots |
| Founding spots taken | 1 of 10 | 1 of 10 | 3 of 10 (sales-led) | 5 of 10 (sales-led + audit lift) | `src/lib/constants.ts` |
| Apply form conversion (visit-to-submit) | unmeasured baseline | baseline measurement | +10% vs week 4 | +25% vs baseline | GA4 + Vercel Analytics |
| CSP unsafe-inline + unsafe-eval | present (P1 finding 16-13) | present | present (report-uri only) | removed (nonce + strict-dynamic) | curl response headers |

## Weekly milestones

### Week 1 (2026-W21): Phase A kickoff

- **Phase:** A (P0 production-integrity + SSR rendering foundation)
- **Tasks:** A1 (ScrollReveal gate), A2 (Footer orphan-skill links)
- **Primary commits:** `fix(motion): remove ScrollReveal initial-hidden gate`, `fix(layout): footer 12-skill coverage`
- **KPI deltas:** Below-fold content visible with JS disabled on 18 routes. SSR HTML ships 12 skill hrefs (was 8).
- **Verification:** `cd fmai-nextjs && npm run build && curl -s https://future-marketing.ai/nl | grep -c "skills/"` must return >=12.
- **Risk:** ScrollReveal change could break visual-design Direction-B motion language; smoke-test on home + memory + SKC case.

### Week 2 (2026-W22): Phase A close

- **Phase:** A continuing
- **Tasks:** A3 (Breadcrumbs component + PageShell wire), A4 (/skills index page), A5 (SSR mega-menu skeleton), A6 (cold-route verification)
- **Primary commits:** `feat(layout): Breadcrumbs component + JSON-LD @id`, `feat(skills): /skills index page`, `feat(layout): SSR mega-menu skeleton`
- **KPI deltas:** Breadcrumbs render on all 30 non-home routes (90 route-locale combos). `/skills` index live in 3 locales. Nielsen H3 wayfinding heuristic lifts from 1 of 2 to 2 of 2.
- **Verification:** `powershell -NoProfile -Command "Select-String -Path 'fmai-nextjs/test-results/audit-v2/dom/*.html' -Pattern 'aria-label=\"Breadcrumb\"' | Measure-Object"` returns >=90.
- **Risk:** Breadcrumb wire-up could regress layout shift on routes with previously zero breadcrumb space; verify CLS on weekly CrUX run.

### Week 3 (2026-W23): Phase B kickoff (content-PR sweep, highest leverage)

- **Phase:** B (content-PR sweep) starts in parallel with Phase A close
- **Tasks:** B1 (regenerate llms.txt + llms-full.txt from SSoT), B2 (CHATBOT_TIERS migration)
- **Primary commits:** `content(llms): regenerate from fma-app SSoT v10`, `content(chatbot): workspace-priced tier-data`
- **KPI deltas:** 0 Partner-tier references in llms files or chatbot. Pricing canon aligned to SSoT. 9 of 22 P0 findings resolved this week.
- **Verification:** `powershell -NoProfile -Command "(Get-Content 'fmai-nextjs/public/llms.txt' -Raw) -match 'Partner|347'"` returns False.
- **Risk:** Lead-qualifier chatbot in production must not regress live conversations; run shadow-test before deploy.

### Week 4 (2026-W24): Phase B close + first measurement-baseline

- **Phase:** B (content-PR sweep) closes
- **Tasks:** B3 (canonical CTA sync), B4 (ES translator pass), B5 (contact CTA collapse), B6 (chatbots namespace decision)
- **Primary commits:** `content(i18n): canonical CTA sweep NL EN ES`, `content(es): translator pass titles + descriptions + naming`, `refactor(contact): single primary CTA`
- **KPI deltas:** Canonical CTA used on social-media, apply, contact across 3 locales. 0 ES titles over 70c, 0 ES descriptions over 155c. ES naming unified. 15 of 22 P0 findings resolved cumulative.
- **Verification:** Re-run `node scripts/audit/measure-llm-citations.mjs` post-deploy. Initial Lighthouse measurement (D1 prep) gives first Performance score.
- **Risk:** ES translator pass could introduce missing-key regressions if executed without test-driven approach; use existing i18n parity guard.
- **Week-4 KPI snapshot:** Lighthouse 70+, WCAG axe 95%, ES compliance 100%, 1 of 7 LLM citations.

### Week 5 (2026-W25): Phase C kickoff (a11y + cookie + WebKit)

- **Phase:** C (a11y + cookie + cross-browser parity)
- **Tasks:** C1 (WebKit CSS triage), C2 (Playwright cross-browser CI gate)
- **Primary commits:** `fix(css): WebKit theme parse error + oklch fallback`, `test(e2e): cross-browser theme parity gate`
- **KPI deltas:** WebKit + Firefox render full theme. CI gate prevents regression. 18% EU desktop + 30% EU mobile unblocked.
- **Verification:** Open `https://future-marketing.ai` in Safari Technology Preview. Body background `#0a0d14`, text `#e8ecf4`. `npx playwright test cross-browser-render.spec.ts` PASS on webkit + firefox.
- **Risk:** Tailwind 4 root-cause may require deeper postcss-config refactor; allocate buffer for triage.

### Week 6 (2026-W26): Phase C close + cross-LLM re-measurement

- **Phase:** C continuing
- **Tasks:** C3 (first-party cookie banner), C4 (opacity-modifier sweep), C5 (newsletter-confirm title), C6 (focus-visible rings), C7 (reduced-motion guards)
- **Primary commits:** `feat(banner): first-party cookie consent with granular toggles`, `refactor(css): discrete tokens replace opacity-modifiers`, `fix(seo): newsletter-confirm metadata title`, `fix(a11y): focus-visible on CTA + Input`, `fix(motion): prefers-reduced-motion on GradientMesh + Spline + ScrollReveal`
- **KPI deltas:** WCAG axe pass-rate 98%. 0 color-contrast violations on lead-qualifier. 0 empty-title WCAG 2.4.2 violations. Focus-visible rings on every CTA + form input. prefers-reduced-motion respected.
- **Verification:** Re-run axe via `cd fmai-nextjs && npx playwright test audit-v2-axe.spec.ts`. Cookie banner does not overlay hero CTA on 360x800, 1440x900, 1920x1080.
- **Cross-LLM measurement:** Re-run `node scripts/audit/measure-llm-citations.mjs`. Target >=2 of 7 grounded citations.

### Week 7 (2026-W27): Phase D kickoff (perf + measurement infrastructure)

- **Phase:** D (forms + perf measurement)
- **Tasks:** D1 (chalk@4 pin + Lighthouse restore), D2 (GCP project + PSI + CrUX), D3 (web-vitals endpoint)
- **Primary commits:** `chore(deps): pin chalk@4 for Lighthouse`, `feat(perf): GCP measurement project + PSI + CrUX scripts`, `feat(perf): web-vitals client + /api/vitals endpoint`
- **KPI deltas:** Lighthouse JSON output produced. CrUX returns field data for top 10 routes. web-vitals INP + CLS streaming live.
- **Verification:** `cd fmai-nextjs && npx playwright test audit-v2-lighthouse.spec.ts` produces non-zero JSON. `node scripts/measure-crux.mjs` returns FCP/LCP/INP/CLS p75.
- **Risk:** GCP project setup may stall on org-policy if FMai uses a workspace-managed GCP; allocate buffer.

### Week 8 (2026-W28): Phase D close + WebKit/Firefox regression test + week-8 KPI snapshot

- **Phase:** D closing
- **Tasks:** D4 (apply form 2-step refactor), D5 (required-markers + form-top help-text), D6 (Spline lazy + static PNG LCP)
- **Primary commits:** `refactor(apply): 2-step intake + drop tier-selector`, `fix(a11y): required-markers + form-top help`, `perf(hero): lazy Spline + static PNG LCP`
- **KPI deltas:** Apply form drops from 9 fields to 3. Spline asset (1.32 MB) off critical path. First Load JS down by 10-15%. Cross-browser regression test PASS.
- **Verification:** `cd fmai-nextjs && npm run build` shows First Load JS for home down vs week 4 baseline. Visit /apply: 3 fields step 1, Calendly step 2.
- **Cross-browser regression:** Run `npx playwright test --project=webkit --project=firefox` full suite. 0 regressions vs week 5 baseline.
- **Week-8 KPI snapshot:** Lighthouse 82+, WCAG axe 98%, 3 of 7 LLM citations, apply form 3 fields, WebKit fixed + CI-gated.

### Week 9 (2026-W29): Phase E kickoff (schema + trust + GEO)

- **Phase:** E (schema graph + GEO citation + trust signals)
- **Tasks:** E1 (6 speakable className tokens), E2 (@id on all JSON-LD), E3 (Wikidata QID + KvK sameAs)
- **Primary commits:** `feat(seo): speakable className tokens in DOM`, `feat(seo): @id on WebSite + BreadcrumbList + FAQPage + HowTo`, `feat(seo): Wikidata QID + KvK in Organization sameAs`
- **KPI deltas:** 6 of 6 speakable selectors match DOM. 84 of 84 JSON-LD blocks ship @id. Wikidata QID assigned + linked in sameAs.
- **Verification:** `curl -s https://future-marketing.ai/nl | grep -c '"@id"'` returns >=10 per page. Google Rich Results test validates graph.
- **Risk:** Wikidata submission has manual approval queue; submit week 5 to land by week 9.

### Week 10 (2026-W30): Phase E close + Lighthouse re-baseline

- **Phase:** E closing
- **Tasks:** E4 (TrustClusterHero), E5 (SKC case 3-metric chip-row), E6 (llms-full.txt HowTo + FAQPage)
- **Primary commits:** `feat(home): TrustClusterHero above-fold`, `feat(case-study): SKC quantified-outcome chip-row`, `content(llms-full): HowTo + FAQPage entries`
- **KPI deltas:** Trust cluster live on home (SKC logo + counter + AVG badge). SKC case shows quantified outcome above-fold. llms-full expanded with HowTo + FAQ.
- **Verification:** Re-run `node scripts/audit/measure-llm-citations.mjs`. Target >=4 of 7 grounded citations.
- **Lighthouse re-baseline:** Full mobile + desktop Lighthouse run on top 10 routes. Performance avg target 85+.

### Week 11 (2026-W31): Phase F kickoff (CSP + security trust-page)

- **Phase:** F (CSP nonce + security trust-page + cleanup)
- **Tasks:** F1 (CSP report-uri), F2 (/legal/security trust-page), F3 (Next.js patched upgrade)
- **Primary commits:** `feat(csp): report-uri to /api/csp-report`, `feat(legal): /legal/security DPA + sub-processors + EU AI Act`, `chore(deps): next@16.2.6 patched`
- **KPI deltas:** CSP violations collecting. /legal/security live in 3 locales. Next.js on patched version.
- **Verification:** `curl -sI https://future-marketing.ai/ | grep -i "content-security-policy"` includes `report-uri`. `/legal/security` returns 200 in 3 locales. `npm ls next` shows >=16.2.6.

### Week 12 (2026-W32): Phase F close + Phase 17 retrospective + week-12 KPI snapshot

- **Phase:** F closing + retrospective
- **Tasks:** F4 (CSP nonce + strict-dynamic), F5 (SRI on external resources), F6 (retrospective + roadmap close)
- **Primary commits:** `feat(csp): nonce + strict-dynamic, remove unsafe-inline`, `feat(security): SRI hashes on third-party scripts`, `docs(audit): Phase 17 retrospective + roadmap close`
- **KPI deltas:** unsafe-inline removed. SRI on Calendly + Spline + Vercel SpeedInsights. Phase 17 retrospective documented. Branch merged to main.
- **Verification:** `curl -sI https://future-marketing.ai/ | grep nonce-` returns nonce-prefixed CSP. `curl -s` page output contains `integrity="sha384-"` on external scripts.
- **Week-12 KPI snapshot:** Lighthouse 90+, WCAG axe 100% (0 serious), 5 of 7 LLM citations, First Load JS -20%, WebKit + Firefox fixed + CI-gated, CSP nonce, /legal/security live.

## Risk register (top 5)

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Calendly API contract change breaks inline embed on /apply during D4 refactor | Low | High | Pin Calendly script version. Test on Vercel preview before merge. Manual fallback: redirect /apply to Calendly hosted page. |
| R2 | Spline payload regresses above 1.32 MB during a future content-refresh | Med | Med | Add CI gate that fails build if `_next/static/**/*.splinecode` exceeds 1.5 MB. Document in fmai-nextjs/CLAUDE.md red-flags. |
| R3 | Gemini API quota exhaustion blocks weekly cross-LLM measurement | Med | Low | Fallback path: switch from `flash` to `pro` (separate quota). Document `~/.claude/.env` second-key pattern. Defer to WebSearch tool if both fail. |
| R4 | WebKit fix in C1 turns out to require Tailwind 4 downgrade or postcss-config refactor that breaks Phase 11-02 contrast math | Low | High | Reproduce in Safari TP first week 5. If root-cause is Tailwind 4 only, decision-gate: stay on Tailwind 4 with @supports gate vs downgrade. Allocate buffer week 5 to 6. |
| R5 | CSP nonce migration breaks third-party inline injection (Spline, Calendly, Vercel SpeedInsights) and requires per-script integration audit during week 12 | Med | High | Sequence: report-uri week 11 to surface violations, then nonce-migration week 12 with per-third-party validation. Keep unsafe-inline as fallback if nonce-roll-out incomplete by week 12 end. |

## Out of scope for Q3

These items emerged from the audit but are deferred to Q4 or later. Documented here so they do not slip into Q3 mid-stream.

- Multi-step apply form with mid-flow value-internalisation (Phase 18 conversion-experiment).
- Server-side ROI calculator on /pricing (requires sales-data integration, defer to Q4).
- Second case-study acquisition (sales-pipeline task, not engineering).
- Translation of Founding-tier copy to non-EU languages (no business case yet).
- Stripe price-ID migration (handled in fma-app SSoT directly, not site).
- Database schema changes for analytics events (Vercel KV is sufficient for Q3 web-vitals capture).
- Adobe Analytics or Mixpanel integration (GA4 is sufficient for Q3 conversion tracking).
- A/B test infrastructure (premature; ship the high-leverage fixes first, measure, then experiment Q4).

## Verification cadence

- **Daily during execution weeks:** `cd fmai-nextjs && npm run build && npm run lint` must pass on every commit.
- **Weekly Mondays:** Run `node scripts/audit/measure-llm-citations.mjs` and append result to `test-results/audit-v2/llm-citations-weekly.csv`. Run `node scripts/measure-crux.mjs` and append to `test-results/audit-v2/crux-weekly.csv`.
- **Weekly Fridays:** Run full Playwright suite including cross-browser parity gate. Append axe + lighthouse results to weekly KPI CSV.
- **Week 4, 8, 12 Fridays:** Capture KPI snapshot doc at `docs/audits/2026-05-18-v2/kpi-snapshot-w{N}.md` cross-referencing baseline.

## Roadmap close

End of week 12 the Phase 17 retrospective lands at `docs/audits/2026-05-18-v2/PHASE-17-RETRO.md`. The audit branch merges to main via PR titled `Phase 17 design + SEO/GEO Q3 fix-execution close`. STATE.md and ROADMAP.md update accordingly. Phase 18 planning kickoff session reads the retrospective as its primary input.
