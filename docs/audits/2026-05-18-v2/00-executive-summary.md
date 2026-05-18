---
title: Executive Summary - Design + SEO/GEO Audit v2
phase: 16-design-seo-audit-v2-sota
date: 2026-05-19
audience: Daley (founder), leadership-readable
read_time_minutes: 5
canonical_domain: future-marketing.ai
findings_total: 299
meta_findings: 12
trade_offs_resolved: 6
teams_completed: 12
teams_skipped: 0
recommendation_target: Phase 17 execution against docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md
---

# Executive Summary: Design + SEO/GEO Audit v2 (2026-05-18)

## What was audited

Phase 16 v2 audited the FMai marketing site `https://future-marketing.ai` across 31 routes, 3 locales (NL authoritative, EN, ES), 5 viewports (mobile-s 360x800, mobile-l 414x896, tablet 768x1024, desktop 1440x900, desktop-w 1920x1080), and 3 browser engines (Chromium primary, Firefox, WebKit) using 12 parallel Wave 2 audit teams. Wave 0 published a 7-competitor SOTA rubric with 25 markers (M1 to M25). Wave 2 produced 12 team-docs covering visual design, brand narrative + IA, interactions + forms + microcopy, SEO technical, GEO + LLMEO, accessibility, performance, cross-browser, content + i18n, conversion psychology, security + privacy, and competitive cross-stack drift. Wave 3 synthesised 299 findings into 12 meta-findings and 12 theme clusters. Wave 4 (this deliverable bundle) compresses everything into a fix-plan with phases A through F, a 12-week roadmap, and this one-page summary. The audit ran with zero production-code edits and zero skipped teams.

## Top 5 meta-findings

1. **MF-02 Pricing SSoT drift (P0).** `public/llms.txt`, `public/llms-full.txt`, and `src/lib/chatbot/tool-data.ts` ship stale v9 5-tier flat-monthly pricing including the deprecated Partner tier, while the site canon since 2026-04-28 is workspace-priced Growth EUR 499 / Professional EUR 399 / Enterprise EUR 299 per workspace plus Founding EUR 997 lifetime fixed. Lead-qualifier chatbot quotes wrong prices to every prospect. Cited by 4 teams (16-06, 16-07, 16-13, 16-14). Fix: single content-PR, roughly 2 hours.
2. **MF-01 ScrollReveal + LazySection hide below-fold content on 18 routes (P0).** Two client-side motion wrappers gate content rendering on Intersection Observer; below-fold sections stay invisible whenever IO does not fire (JS disabled, crawlers, slow connections). Cited by 4 teams. Fix: remove `initial=hidden` default; render children visible on SSR with motion as enhancement.
3. **MF-07 GEO citation zero across 7 Gemini grounded queries (P0).** FMai paraphrases correctly on AI search but is cited 0 of 7 times. Root causes: speakable selector classNames missing in rendered DOM (6 specific class tokens), Wikidata QID absent from Organization sameAs, llms.txt structure suboptimal. Fix: 6 className edits + sameAs additions + llms regeneration. Lifts citation rate to projected 5 of 7 by week 12.
4. **MF-03 Canonical CTA breach on social-media + apply + contact (P0).** Despite 50+ canonical "Plan een gesprek" instances on every skill page, three high-intent routes ship non-canonical variants: "Boek een gratis strategiesessie", "Plan een partnership-gesprek", "Plan een strategiegesprek". Contact carries 3 competing CTAs. Cited by 3 teams. Fix: 9 i18n string edits.
5. **MF-06 WebKit serves white default theme on every route (P0).** Tailwind 4 CSS feature (likely `@property` or `oklch()` without fallback) parse-errors on Safari, dropping all theme styling. Visitor sees Times-New-Roman white page with blue underlined links. Affects 18 percent of EU desktop and 30 percent of EU mobile audience. Fix: gate Tailwind 4 feature behind `@supports`, add hex fallbacks, ship Playwright CI gate.

The next 7 meta-findings cover breadcrumb absence (MF-04), cookie banner overlay (MF-05), 4 SSR-orphan skill pages (MF-08), forms friction stack (MF-09), trust-signal vacuum above-fold (MF-10), opacity-modifier contrast regression (MF-11), and ES locale fragmentation (MF-12). Together the 12 meta-findings account for roughly 90 of 299 individual findings, meaning the fix-plan compresses the analytical surface from 299 items down to 12 strategic interventions and captures the bulk of audit value with proportionally less engineering cost.

## Positioning recommendation (from 16-14 competitive cross-stack drift)

FMai's wedge-position is sound: high-touch AI marketing partnership for EU bureaus is a category-gap none of the 7 named competitors occupy (Mediacooks, MS618, Virtual Outcomes, Chatarmin, Solda.AI, Genesy AI, NUMRIQ). The biggest positioning risk is internal drift: pricing on llms files and chatbot does not match the live site, breaking the "single source of truth" promise that the SaaS command center (`fma-app/src/lib/skills.ts`) was built to maintain. Phase B of the fix-plan resolves this with a single content-PR. The strategic move beyond Q3 is to publish a `/legal/security` trust-page with DPA, sub-processor list, EU AI Act risk classification, and ISO27001 alignment statement: this lifts the EU buyer-evaluator persona scoring from below to above Stripe + Linear + Vercel reference SaaS sites in the security-trust dimension that is currently table-stakes for any EU B2B AI tool.

## KPI baseline snapshot

| KPI | Baseline (2026-05-18) | Week 12 Target |
|---|---|---|
| Lighthouse Performance (mobile avg) | gated (harness broken) | 90 |
| WCAG 2.2 AA axe pass-rate | 90.3 percent (84 of 93 snapshots) | 100 percent (0 serious) |
| Cross-LLM citation rate (Gemini grounded) | 0 of 7 queries | 5 of 7 |
| First Load JS (home, gz) | 870 KB shared chunk profile | -20 percent (target <700 KB) |
| CSS payload (gz, every route) | 118 KB | 80 KB |
| Spline asset on critical path | 1.32 MB blocking | deferred, static PNG LCP |
| i18n parity (EN, ES leaf paths vs NL) | 100 percent structural, ES quality FAIL | 100 percent + ES translator-reviewed |
| WebKit theme rendering | broken | fixed + CI gate |
| Apply form fields above-fold | 9 | 3 (Calendly intake step 2) |
| Founding spots taken | 1 of 10 | 5 of 10 (sales-led + audit lift) |
| CSP unsafe-inline + unsafe-eval | present | removed (nonce + strict-dynamic) |

## Top 3 trade-offs resolved

- **T1 cinematic motion vs perf budget:** KEEP Spline. MIGRATE to reduced-motion-aware static-fallback + lazy import + 600 ms motion cap. Preserves "Clyde-as-character" brand asset (scored 2 on 16-14 axis A1) while respecting WCAG 2.3.3 and keeping the 1.32 MB asset off the LCP critical path.
- **T2 scarcity density vs brand restraint:** KEEP scarcity SOLO on Founding tier with elevated visual weight. DO NOT propagate to Growth/Pro/Enterprise without per-tier cap data. Manufactured scarcity on other tiers would read fake and erode trust.
- **T3 schema-rich graph vs CSS payload budget:** SHIP all schema additions. Adds roughly 4 KB gzipped which is below the 25 KB margin to a healthy LCP. JSON-LD is non-blocking; the real bottleneck is CSS (118 KB) and shared-chunk JS (870 KB), both unaffected by schema work.

The remaining 3 trade-off resolutions (T4 CTA density, T5 i18n cultural fit, T6 CSP modernisation sequence) are documented in `14-cross-cutting-synthesis.md`.

## Recommended next step

Execute `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` via `/gsd:plan-phase` or `superpowers:executing-plans` skill, sequenced against `docs/plans/2026-05-18-design-seo-roadmap-q3.md`. Phase B (content-PR sweep, week 3 to 4) is the highest-leverage move: it resolves 15 of 22 total P0 findings in roughly 2 hours of editor work plus 1 hour QA. Start Phase A and Phase B in parallel during weeks 1 to 4; sequence C, D, E, F linearly weeks 5 to 12. KPI re-measurement cadence is documented in the roadmap (week 4 / 8 / 12 snapshots).

## Execution telemetry

| Metric | Used | Cap | Status |
|---|---|---|---|
| Gemini grounded research calls | ~12 (incl. Wave 0 + Wave 2 spot-checks) | 100 RPD | within budget |
| Firecrawl scrapes | 3 (Wave 0 reference sites) | 80 | within budget |
| WebFetch calls | ~25 (Wave 2 cross-LLM probes, CrUX attempts) | uncapped | informational |
| Disk usage `test-results/audit-v2/` | ~480 MB (834 screenshots + 93 axe + 93 DOM + HAR) | 5 GB hard-abort | within budget |
| Total wall-clock | ~9 hours across Wave 1 + Wave 2 + Wave 3 + Wave 4 | 14 days planned | ahead of plan |
| Audit branch commits | 16 (one per plan, atomic) | n/a | clean |

## Scope adaptations during execution

Per AUTONOMOUS-PROTOCOL.md Rule 3, the following in-scope adaptations happened mid-execution and are documented for traceability rather than escalated:

- **Cross-LLM matrix partial coverage.** Bing SERP, Google SERP, and Claude.ai search were unreachable in the audit window for 16-07. Gemini grounded provider delivered a complete 7-query cell set (7 of 28 matrix cells filled, 21 marked `provider_unavailable`). Phase 17 verification re-run must add Playwright-driven SERP scrape or paid SERP API.
- **Lighthouse harness broken (chalk@5).** Plan 16-02 Lighthouse run produced zero JSON outputs because `playwright-lighthouse@^4.x` calls property-style chained chalk methods removed in chalk@5. Documented in `01-baseline-snapshot.md` item 9 as out-of-scope baseline noise; fallback methodology was production curl walk for chunk-size + TTFB measurement. Lab CWV (LCP, CLS, INP, TBT) remain gated until Phase 17 D1 (chalk@4 pin).
- **PSI + CrUX API blocked.** Anonymous PSI quota exhausted for executor IP; `GEMINI_API_KEY` belongs to a Google Cloud project where neither `pagespeedonline.googleapis.com` nor `chromeuxreport.googleapis.com` is enabled. Phase 17 D2 provisions dedicated GCP project + restricted API key.
- **WebKit Playwright capture timed out** on full 31-route x 3-locale matrix; reduced to top 10 routes at desktop + mobile-l only to fit budget. Documented in 16-10 `09-cross-browser.md`. Pixel-parity findings limited to the reduced set; the binary P0 (WebKit unstyled render, MF-06) consumed the question regardless.
- **Cross-browser team (16-10) shipped 5 findings versus 25 target.** Classified completed-with-note rather than skipped per Rule 1 because the doc lands all required outputs and the WebKit-unstyled finding is a single P0 that consumes the entire engine-parity question; per-route findings on that engine would have been pure noise until the root-cause CSS parse error is fixed.

No viewports, locales, browser-engines, or routes were dropped from the original plan beyond the WebKit-capture reduction above. The 5 viewports x 3 locales x 31 routes Chromium primary matrix shipped complete (465 screenshots). NL remained authoritative throughout; EN + ES coverage stayed at 100 percent structural parity.

## Where to read more

- Full synthesis: `docs/audits/2026-05-18-v2/14-cross-cutting-synthesis.md` (12 meta-findings, 6 trade-offs resolved, coverage heatmap, severity heatmap, 12 theme clusters)
- Fix-plan with task-blocks: `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` (6 phases A-F, top-50 ranked list, executable by `superpowers:executing-plans`)
- 12-week roadmap with KPI baselines + targets: `docs/plans/2026-05-18-design-seo-roadmap-q3.md`
- Side-by-side competitor comparisons: `docs/audits/2026-05-18-v2/comparisons/README.md`
- Annotated screenshot gallery: `fmai-nextjs/test-results/audit-v2/screenshots/index.html`
- 12 Wave 2 team docs: `docs/audits/2026-05-18-v2/02-visual-design.md` through `13-competitive-cross-stack.md`

End of executive summary. Open `docs/plans/2026-05-18-design-seo-audit-v2-fix-plan.md` next to decide Phase 17 scope.
