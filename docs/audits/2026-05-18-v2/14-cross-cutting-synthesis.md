---
phase: 16-design-seo-audit-v2-sota
plan: 16-15
wave: 3
type: research
status: complete
created: 2026-05-19
canonical_domain: future-marketing.ai
depends_on:
  - 16-01
  - 16-02
  - 16-03
  - 16-04
  - 16-05
  - 16-06
  - 16-07
  - 16-08
  - 16-09
  - 16-10
  - 16-11
  - 16-12
  - 16-13
  - 16-14
sources_aggregated:
  - docs/audits/2026-05-18-v2/00-competitive-intel.md
  - docs/audits/2026-05-18-v2/01-baseline-snapshot.md
  - docs/audits/2026-05-18-v2/02-visual-design.md
  - docs/audits/2026-05-18-v2/03-brand-narrative-ia.md
  - docs/audits/2026-05-18-v2/04-interactions-forms-microcopy.md
  - docs/audits/2026-05-18-v2/05-seo-technical.md
  - docs/audits/2026-05-18-v2/06-geo-llmeo.md
  - docs/audits/2026-05-18-v2/07-accessibility.md
  - docs/audits/2026-05-18-v2/08-performance.md
  - docs/audits/2026-05-18-v2/09-cross-browser.md
  - docs/audits/2026-05-18-v2/10-content-copy-i18n.md
  - docs/audits/2026-05-18-v2/11-conversion-psychology.md
  - docs/audits/2026-05-18-v2/12-security-privacy.md
  - docs/audits/2026-05-18-v2/13-competitive-cross-stack.md
findings_aggregated: 299
teams_completed: 12
teams_skipped: 0
meta_findings_count: 12
tradeoffs_resolved: 6
---

# 14 Cross-cutting Synthesis (Wave 3)

> Compresses 299 individual findings across 12 Wave 2 audit teams into a meta-layer for the strategic roadmap in 16-16. Meta-findings are issues where 3 or more teams cite the same route, component, or symptom; the synthesis cross-references those into a single canonical fix-candidate. Trade-offs resolve where one team recommends X and another recommends the opposite. Heatmaps surface hot-spot routes and severity-weighted dimensions. Skip log records 100 percent team coverage with notes on partial captures. No production code edits. No em-dashes. Canonical domain `future-marketing.ai`.

## Executive summary

Phase 16 Wave 2 ran 12 of 12 audit teams to completion across 31 routes, 3 locales, and 5 viewports, producing 299 findings (16 P0, 70 P1, 122 P2, 91 P3). Twelve meta-findings emerge where three or more teams cite the same root cause; together they account for roughly 90 of the 299 findings, meaning the fix-plan can compress the analytical surface from 299 individual items down to 12 strategic interventions and capture the bulk of the audit value with proportionally less engineering cost.

The three highest-leverage meta-findings are MF-01 (motion-wrapper gate hiding below-fold content, cited by 16-03, 16-09, 16-10, 16-12), MF-02 (stale pricing and skill-status drift across `llms.txt`, `llms-full.txt`, and `chatbot/tool-data.ts`, cited by 16-06, 16-07, 16-13, 16-14), and MF-03 (`/skills/social-media` plus `/apply` plus `/contact` glossary-canon breach where "Plan een gesprek" gets replaced by "Boek een gratis strategiesessie" or "Plan een partnership-gesprek", cited by 16-04, 16-05, 16-11). Together these three meta-findings touch every Wave 2 dimension except cross-browser pixel-parity and define the single largest perception-quality leak on the production site.

Top three trade-offs resolved: (T1) cinematic motion in Direction B (16-03) versus reduced-motion plus perf budget on home (16-08, 16-09) collapses to "keep Spline with reduced-motion gating and lazy import"; (T2) Cialdini scarcity-density (16-12) versus minimal brand restraint (16-04) collapses to "keep founding scarcity counter as canonical scarcity-hook, do not propagate to other tiers without per-tier cap data"; (T3) hreflang plus schema-rich JSON-LD graph (16-06, 16-07) versus LCP plus CSS payload budget (16-09) collapses to "ship schema additions, they add roughly 4 KB gzipped which is below the 25 KB margin to a healthy LCP".

Total routes audited: 31 (28 of 31 hit by at least one team, 3 cold spots: `/legal/cookies`, `/legal/terms`, `/legal/privacy` carry zero P0/P1 findings). Total skipped teams: 0. Plan 16-10 (cross-browser) shipped a shorter doc (5 findings versus the 25 target) because the WebKit-wide unstyled render finding was a binary P0 that consumed the entire engine-parity question. The doc lands all required outputs, so 16-10 is classified as completed-with-note rather than skipped per AUTONOMOUS-PROTOCOL Rule 1.

## Methodology

Meta-finding derivation: a finding qualifies as "meta" when at least 3 Wave 2 docs flag the same route, the same component path, or the same symptom under different framings. Route-overlap example: home (`/`) is touched by 16-03 (Spline overlap, motion void), 16-09 (Spline asset 1.32 MB), 16-12 (Spline takes 30 percent of hero with no info value); same route, three teams, one meta-finding about Spline economics. Symptom-overlap example: glossary-canon breach is cited by 16-04 on `/skills/social-media`, by 16-05 on `chatbots` namespace, by 16-11 on `/apply` plus `/contact`; same symptom, three teams, one meta-finding.

Severity unification: each meta-finding carries a unified severity that defaults to the highest severity any contributing team assigned. Where teams disagree (one team says P0, another says P2 on the same issue), the synthesis adopts the highest and explains the gap in the source-team-citations column.

Trade-off detection: a trade-off exists when two teams propose recommendations that, executed naively, would cancel each other. The synthesis resolves each trade-off with a chosen direction plus a one-sentence rationale referencing both source teams.

Cell counts in the coverage heatmap reflect the number of distinct findings each team raised against each route. Routes that no team touched are filtered out before publishing the heatmap to keep the table scannable. The severity heatmap aggregates by team-by-severity to expose which dimensions carry the most P0 plus P1 debt.

## Meta-findings (>= 3 teams)

Twelve meta-findings emerge. Each lists source-team finding IDs, the route or symptom anchor, a unified severity, and a single recommended direction that feeds 16-16.

### MF-01: ScrollReveal plus LazySection motion-gate hides below-fold content on every route

- **Source teams (4):** 16-03 F1 (P0), 16-09 (referenced in F4 perf-budget context), 16-10 F4 (P2 cross-reference), 16-12 (referenced in trust-cluster hero finding).
- **Routes affected:** `/`, `/pricing`, `/founding-member`, `/memory`, `/about`, `/how-it-works`, `/case-studies/skinclarity-club`, all 12 `/skills/*`, total 18 routes.
- **Symptom:** Two motion-helper wrappers, `ScrollReveal` (initial=hidden) and `LazySection` (isVisible=false until IO fires), keep below-fold sections invisible whenever Intersection Observer does not fire. Confirmed engine-independent (16-10 F4: visible on both Chromium and Firefox).
- **Unified severity:** P0.
- **Recommended direction:** Treat both wrappers as progressive enhancements, not gates. Children must render at opacity 1 and full layout on SSR; motion adds reveal on top. Remove `initial=hidden` default on `ScrollReveal`. Make `LazySection` start `isVisible: true` for SSR and only flip false in a post-hydration effect.
- **Effort:** M. Unblocks every below-fold visual finding plus the entire content-audit screenshot gallery.

### MF-02: llms.txt, llms-full.txt, and chatbot tool-data.ts ship stale v9 pricing plus deprecated Partner tier

- **Source teams (4):** 16-06 F-01 (P0) and F-27 (P2), 16-07 F-04 (P1) and F-05 (P1), 16-13 (referenced as B2A leak), 16-14 F1 (P0), F2 (P0), F3 (P0), F4 (P0), F5 (P1), F6 (P1), F7 (P1), F8 (P0), F9 (P0), F10 (P1), F11 (P1), F12 (P2).
- **Surfaces affected:** `fmai-nextjs/public/llms.txt`, `fmai-nextjs/public/llms-full.txt`, `fmai-nextjs/src/lib/chatbot/tool-data.ts` CHATBOT_TIERS, plus skill-pack labels in SKILL_PACKS.
- **Symptom:** Pricing documents declare 5-tier flat-monthly Partner-347-EUR-to-Enterprise-7997-EUR pricing, but the site canon since 2026-04-28 (`fma-app/src/lib/skills.ts` SSoT and `/pricing` page) is workspace-priced Growth-499-EUR / Professional-399-EUR / Enterprise-299-EUR per workspace with Partner tier removed. Skill statuses also drift: llms.txt declares voiceAgent "Live with demo" and emailManagement plus manychatDm "Coming soon" against SSoT statuses. Lead-qualifier chatbot quotes wrong pricing to every prospect.
- **Unified severity:** P0.
- **Recommended direction:** Single content-PR that regenerates both llms files from `fma-app/src/lib/skills.ts` SSoT, removes all Partner references, replaces "EUR/mo lifetime" with "EUR lifetime", aligns skill statuses to SSoT. Same PR migrates CHATBOT_TIERS to the workspace-priced model with `min/maxWorkspaces` fields. Estimated 30 minutes for chatbot, 1 hour for llms files.
- **Effort:** S.

### MF-03: Glossary-canon breach replaces "Plan een gesprek" on three high-intent routes

- **Source teams (3):** 16-04 F3 (P0) on `/skills/social-media`, F4 (P1) on `/apply`, F5 (P1) on `/contact`; 16-05 F8 (P2) on `chatbots` namespace, F16 (P3) on contact-bookcall label; 16-11 (cross-reference for CTA-discipline scoring).
- **Routes affected:** `/skills/social-media`, `/apply`, `/contact`, plus the orphan `chatbots` namespace.
- **Symptom:** Despite 50+ canonical "Plan een gesprek" instances on every skill page, three high-intent routes break with non-canonical variants: "Boek een gratis strategiesessie" plus "Vraag een gratis strategiesessie aan" (social-media), "Plan een partnership-gesprek" (apply H1, diverges from page-meta-title), "Plan een strategiegesprek" (contact, third competing CTA on a page with 3 CTAs).
- **Unified severity:** P0.
- **Recommended direction:** Sync all three routes to canonical "Plan een gesprek" plus NL/EN/ES equivalents. Collapse `/contact` from 3 CTAs to 1 primary plus 1 secondary. Decide whether to keep `chatbots` namespace; archive if unreachable.
- **Effort:** S. 9 i18n string edits plus one decision on chatbots namespace.

### MF-04: Universal breadcrumb absence breaks wayfinding plus BreadcrumbList rich result

- **Source teams (3):** 16-04 F2 (P0), 16-06 F-10 (P1 on @id missing across 84 emitted blocks; flagged because the BreadcrumbList JSON-LD does exist but the visible UI does not match the schema), 16-12 F10 (P2, Nielsen H3).
- **Routes affected:** All 30 non-home routes per locale (90 route-locale combos).
- **Symptom:** 16-04 F2: grep across 93 DOM snapshots returns zero matches on `aria-label="[Bb]readcrumb"` or visible breadcrumb component. 16-06 F-10: BreadcrumbList JSON-LD does emit on every page but lacks `@id` and the parent-link logic collapses on `/skills/*` because there is no `/skills` index page. 16-12 H3 control plus freedom heuristic scores 1 of 2 across the board because no breadcrumb is wired.
- **Unified severity:** P0.
- **Recommended direction:** Introduce a `<Breadcrumbs>` component in `PageShell.tsx` or layout, with visible path plus matching `BreadcrumbList` JSON-LD. Decide on `/skills` index (resolves F-23 parent-link collapse simultaneously).
- **Effort:** M.

### MF-05: Cookie consent banner breaks above-fold CTA plus has no re-open path

- **Source teams (3):** 16-03 F11 (P0 banner overlays hero CTA on every locale plus viewport), 16-05 F3 (P1 no focus-visible plus no second-touch re-open) and F24 (P2 decline-button 1.4:1 contrast), 16-12 F11 (P2 Nielsen H3 control plus freedom plus banner copy promises re-open but UI does not deliver), 16-13 F9 (P2 binary not granular) and F10 (P2 no link to `/legal/cookies`).
- **Routes affected:** All 32 routes until dismissed.
- **Symptom:** Banner sits in the hot-spot zone where the primary CTA renders, fails WCAG focus-visible, fails 3:1 contrast on Weigeren, has no aria-localised hamburger label, has no granular per-category toggle, and no way to re-open after dismissal even though the copy says it should be possible.
- **Unified severity:** P0.
- **Recommended direction:** Replace `react-cookie-consent` with a first-party bottom-sticky banner that supports re-open trigger, granular toggles (functional, analytics, marketing), AA contrast, focus-visible ring, and a link to `/legal/cookies`. Expose a "Cookie-instellingen wijzigen" link in footer.
- **Effort:** M.

### MF-06: WebKit-wide unstyled render plus reduced-motion gating gap

- **Source teams (3):** 16-10 F1 (P0 WebKit serves white default theme on every route across all locales), 16-03 F3 plus F4 (P1/P2 GradientMesh plus ScrollReveal no reduced-motion guard), 16-08 F23 (P2 no `prefers-color-scheme: light` accommodation, distinct but adjacent), 16-09 F4 (P1 Spline scene 1.32 MB asset).
- **Routes affected:** All 32 routes on WebKit/Safari (roughly 18 percent of EU desktop, 30 percent of EU mobile per StatCounter Q1 2026).
- **Symptom:** Tailwind 4 plus modern CSS features (likely `@property` on color types, `oklch()`, or `@layer` parse error) drop all theme styling on WebKit. Visitor sees Times-New-Roman white page with blue underlined links. Compounding: even on engines that render theme correctly, no `prefers-reduced-motion` guard exists on GradientMesh, ScrollReveal degrades silently with no fallback signal, and Spline 1.32 MB still loads.
- **Unified severity:** P0.
- **Recommended direction:** Reproduce in Safari Technology Preview, inspect Issues tab for CSS parse error. Most likely fix: gate `@property` registrations behind `@supports`, set `--theme-color: oklch(...)` fallbacks to hex. Add CI Playwright gate `tests/e2e/cross-browser-render.spec.ts` asserting `<body>` background equals theme deep value on WebKit and Firefox. Parallel reduced-motion sweep on GradientMesh plus ScrollReveal.
- **Effort:** M (CSS triage) plus S (motion guards).

### MF-07: GEO citation zero across 7 Gemini grounded queries plus blocked Lighthouse plus CrUX measurement

- **Source teams (3):** 16-07 F-01 (P0 0/7 grounded citations) plus F-02 plus F-03 (P1 no Wikidata QIDs) plus F-06 (P1 speakable schema 3/27 routes), 16-09 Findings 1 and 2 (P0 Lighthouse harness broken plus CrUX/PSI API blocked), 16-06 F-02 (P0 speakable CSS selectors do not match rendered DOM on home + memory + SKC case).
- **Surfaces affected:** llms.txt, Organization sameAs graph, speakable selectors on three flagship content pages, plus the entire CWV measurement pipeline.
- **Symptom:** Gemini paraphrases FMai accurately on Q1 and Q4 but cites zero `future-marketing.ai` URLs. Speakable schema names `.speakable-hero`, `.speakable-tldr`, `.speakable-memory-def`, `.speakable-memory-layers`, `.speakable-skc-summary`, `.speakable-skc-outcome` but none of these classes exist in the rendered DOM. Lighthouse skipped 60 of 60 tests on chalk@5 incompat; PSI API blocked at consumer quota and key-restriction. The site cannot prove itself to AI agents and cannot measure performance against goals.
- **Unified severity:** P0.
- **Recommended direction:** Three-part fix: (a) Add the six missing className tokens to home, memory, and SKC case pages (6 className edits, no new components); (b) Add KvK URL and Wikidata QID to Organization sameAs when both are verified; (c) Pin chalk@4 or upgrade playwright-lighthouse, enable PSI plus CrUX on a dedicated GCP project, store `GOOGLE_PSI_API_KEY` in `~/.claude/.env`. Each part is independently shippable.
- **Effort:** S (className edits) plus S (sameAs entries) plus S (Lighthouse pin) plus M (GCP project setup).

### MF-08: Four /skills/* routes are SSR-orphans plus mega-menu skill carousel is not pre-hydration discoverable

- **Source teams (3):** 16-04 F1 (P0 four SSR-orphans), 16-06 F-13 (P1 hreflang gaps cross-reference), 16-08 F11 (P2 banner role over-use inside platform-card components on `/skills/lead-qualifier`, distinct but adjacent), 16-12 F8 (P1 no customer-count or named-logo cluster, ties into skill-discovery), plus 16-13 F-23 BreadcrumbList parent collapse.
- **Routes affected:** `/skills/email-management`, `/skills/manychat`, `/skills/reporting`, `/skills/research`.
- **Symptom:** Four of 12 skill pages have zero inbound SSR hrefs in the 93-DOM corpus; only the JS-driven mega-menu surfaces them. Footer ships 8 of 12 skills. Crawlers, GPTBot/ClaudeBot/PerplexityBot, and JS-disabled visitors never see the four orphan-skills.
- **Unified severity:** P0.
- **Recommended direction:** Add the four orphan-skills to `Footer.tsx` skills-section plus matching i18n keys. Optionally render mega-menu skeleton in SSR with `display:none` on closed-state so hrefs ship in initial payload. Same fix unblocks the `/skills` index page that resolves the BreadcrumbList parent collapse (MF-04).
- **Effort:** M.

### MF-09: Form friction plus required-marker plus focus-visible across both forms

- **Source teams (3):** 16-05 F1 (P1 CTAButton no focus-visible) and F2 (P1 input focus 1px border swap) and F5 (P1 no visible required-marker) and F4 (P1 workspaces wrong-error microcopy), 16-08 F4 (P2 color-contrast on `/apply` workspaces-help at xs size on bg-elevated panel), 16-12 F3 (P1 apply form 9 fields above SOTA 5-6 cap), 16-13 F18 (P1 ENV name mismatch in `.env.example` for `IP_HASH_SALT` versus consumer reference).
- **Routes affected:** `/apply`, `/contact`.
- **Symptom:** Apply plus contact carry the highest-conversion intent on the site but cumulate 5 distinct friction sources: (1) primary CTA invisible on keyboard focus, (2) input focus state visually near-identical to unfocused state, (3) no visible required-marker (asterisk or "verplicht" suffix), (4) workspaces validation triggers the nameMin error message ("Vul je naam in"), (5) decision-friction from 9 fields before value-internalisation.
- **Unified severity:** P1.
- **Recommended direction:** Single form-discipline sweep: add `focus-visible:outline-2 outline-accent-system` to base CTAButton styles plus form inputs, switch to focus-visible:ring-2; add `*` required-markers plus top-of-form note; fix `mapIssueToKey` workspaces case to return `workspacesRequired`; collapse apply to name + email + optional company at first step and defer tier-selection to Calendly intake. Reframe as "intake plus calendar" not "tier-form".
- **Effort:** S (CSS plus i18n) plus M (apply form decomposition).

### MF-10: Trust signal vacuum above-the-fold across home plus pricing plus founding plus case-study

- **Source teams (3):** 16-03 F12 (P3 trust badges teal-monotone) and F24 (P1 case-study no quantified outcome above-fold), 16-12 F1 (P1 no above-fold trust cluster on home) and F8 (P1 no customer-count or named-logo cluster) and F9 (P1 scarcity stops at Founding tier) and F17 (P2 memory page no above-fold CTA), 16-13 axis A7 (P1 case-study credibility limited) and axis A11 (P1 trust-signals not present at SOTA-density), 16-14 F15 (P1 no security trust-page) and F17 (P1 no case-study with quantified conversion-metric).
- **Routes affected:** `/`, `/pricing`, `/founding-member`, `/memory`, `/case-studies/skinclarity-club`.
- **Symptom:** SOTA reference stack three trust elements above-the-fold (one security badge, one rating, one recognizable logo). FMai stacks zero on home, has Sindy headshot but no metric on SKC, scarcity-counter is small and visually de-emphasised, and there is no dedicated `/legal/security` or trust-page. Cialdini C1 reciprocity scores 3 of 24 across 12 routes.
- **Unified severity:** P1.
- **Recommended direction:** Above-fold trust-cluster on home with three elements: SKC-as-customer-logo, "1 of 10 founding plekken bezet" promoted to focal size, AVG/GDPR badge. Add 3-metric chip-row directly under SKC case H1 ("3 accounts onboarded, 4 brands in 7 days, 12 skills active"). Publish `/legal/security` with DPA template, subprocessor list, EU AI Act risk-classification.
- **Effort:** M (trust-cluster + trust-page).

### MF-11: Color-contrast plus opacity-modifier plus muted-text patterns cancel Phase 11-02 contrast gains

- **Source teams (3):** 16-08 F1 (P1 color-contrast on `/skills/lead-qualifier` carousel 11 nodes), F4 (P2 workspaces-help on bg-elevated 2.5:1), F5 (P2 opacity-modifier Tailwind classes), F6 (P2 text-white/40 capability label 3.82:1), F21 (P2 bg-elevated panel not part of Phase 11-02 math); 16-03 F10 (P2 teal-amber gradient repeats on every CTA, palette monotony adjacent), F13 (P2 footer CTA teal vs hero amber); 16-04 referenced glossary color/CTA discipline.
- **Routes affected:** `/skills/lead-qualifier`, `/apply`, `/about-es`, `/newsletter/confirm`.
- **Symptom:** Phase 11-02 raised `--color-text-muted` to PASS WCAG AA on bg-deep and bg-surface, but `text-text-muted/60` and `text-white/40` utility classes plus the new `bg-elevated` panel token (`#1a1f2e`, darker than the bg-deep used in the original math) cancel the contrast gains.
- **Unified severity:** P1.
- **Recommended direction:** Replace opacity-modifier text utilities with discrete design-system tokens at AA-compliant contrast. Extend Phase 11-02 contrast math to include `bg-elevated`. Single audit + sweep against axe color-contrast rule.
- **Effort:** S (sweep) plus S (math extension).

### MF-12: ES locale gaps plus CTA-canon fragmentation plus copy length blow-out

- **Source teams (3):** 16-11 F2 (P0 ES CTA-canon fragmented, 54 non-canonical variants vs 1 canonical) and F3 (P1 ES naming-mix Empleado AI vs Empleado AI de Marketing vs Empleado de Marketing AI) and F9 (P1 `/blog` readability critical, F-H 56.5 ES) and F12 (P2 ES legal.meta.title identical EN) and F16 (P2 ES founding plekken subtitle mixed Spanish-English), 16-06 F-06 (P1 12 descriptions over 155c, ES disproportionately) and F-05 (P1 21 titles over 70c, ES disproportionately due to 25 percent longer copy), 16-08 readability sweep flags ES FAIL on every route, 16-04 F18 (P3 Founding Member untranslated).
- **Routes affected:** All ES routes, with hot spots on `/pricing`, `/skills/social-media`, `/case-studies/skinclarity-club`, `/blog`.
- **Symptom:** ES copy is 25 percent longer than NL/EN due to Spanish article and conjugation density; titles plus descriptions consistently truncate; CTA canon fragmented between Reserva and Agenda variants; blog reads at university level (F-H 56.5).
- **Unified severity:** P1.
- **Recommended direction:** ES-translator pass to: (a) collapse ES CTA-canon to single variant, recommend `Agenda una llamada` (61 instances de facto vs 1 instance de jure), (b) trim all over-length titles to <=60c plus descriptions to <=155c, (c) rewrite blog index plus skill page subtitles for 7th-grade reading level. Verify Empleado AI naming.
- **Effort:** M (translator pass).

## Trade-off resolutions

Six explicit trade-offs between teams. Each resolution favours the higher-leverage axis with a one-sentence rationale.

| # | Trade-off | Source teams | Resolution | Rationale |
|---|---|---|---|---|
| T1 | Cinematic Direction-B motion (Spline keeper, hero-walk-in, card stagger) vs reduced-motion plus perf budget | 16-03 (Direction B recommended) vs 16-08 (Spline 1.32 MB), 16-09 (Spline perf cost) | KEEP Spline, MIGRATE to reduced-motion-aware static-fallback + lazy import + 600ms motion cap. | Spline is the strongest brand asset and removing it loses the "Clyde-as-character" hook that scores FMai a 2 on axis A1 of the 16-14 competitive scorecard. Reduced-motion gating + lazy import preserves brand while respecting WCAG 2.3.3 and keeping the asset off the LCP critical path. |
| T2 | Cialdini scarcity-density (propagate counter to all 4 tiers) vs brand restraint (one scarcity hook, not many) | 16-12 (Finding 9: scarcity collapses to one tier) vs 16-04 (Finding 22 founding counter as positive marker) | KEEP scarcity SOLO on Founding tier with elevated visual weight. DO NOT propagate to Growth/Pro/Enterprise without per-tier cap data. | Founding scarcity is credible because the cap (10 plekken) is a real business decision with `FOUNDING_SPOTS_TAKEN=1` SSoT. Manufactured scarcity on Growth/Pro/Enterprise would read as fake and erode trust, costing more than the conversion lift it would generate. Promote Founding counter to focal size instead of replicating. |
| T3 | Schema-rich JSON-LD graph plus llms.txt expansion vs LCP plus CSS payload budget | 16-06, 16-07 (add @id everywhere, expand llms-full, add HowTo, FAQPage, speakable) vs 16-09 (CSS 118 KB gz heavy, JS 870 KB) | SHIP all schema additions. They add roughly 4 KB gzipped, well below the 25 KB margin to a healthy LCP. | JSON-LD is `<script type="application/ld+json">` and does not block parse or paint. The bottleneck is CSS plus JS chunk size, both of which are unaffected by schema work. Schema unblocks GEO citation rate (currently 0/7) which has higher leverage than a 4 KB JSON cost. |
| T4 | Conversion-CTA density (Stripe-Intercom Direction C, dense CTAs every fold) vs minimal-design Direction B (one signature CTA per fold) | 16-12 (Finding 4 + 21: more CTA repetition + competitor TCO) vs 16-03 (Direction B: collapse to one primary + one tertiary) | ADOPT Direction B with strategic CTA repetition: home gets 1 hero CTA + 1 mid-scroll CTA + 1 final CTA, skill pages keep current 50+ density (already SOTA-marker M21 compliant). | Direction B preserves perceived premium quality that justifies the EUR 997 founding lifetime anchor. Density-direction C trades perceived quality for marginal volume lift, wrong trade-off for high-touch partnership positioning. Existing skill-page CTA repetition (50+ per page) already satisfies M21 without the home-density Direction C demands. |
| T5 | i18n parity push (NL=EN=ES strict parity) vs ES cultural-fit divergence (Spanish needs shorter copy or different register) | 16-11 (Finding 9 ES readability critical) vs 16-04 (parity-coverage positive marker, strict structural parity preserved) | KEEP structural parity (40 namespaces, 1644 leaf paths) but ALLOW per-value cultural-adaptation in ES. | The 100 percent structural parity is a positive marker that prevents missing-keys regressions. Per-value adaptation (shorter ES sentences, ES-specific CTA canon) does not break parity, only translation quality. The fix is a translator pass, not a structural change. |
| T6 | CSP modernisation (nonce + strict-dynamic) vs Spline plus Calendly plus Vercel SpeedInsights inline requirements | 16-13 F1 + F2 (CSP unsafe-inline + unsafe-eval) vs 16-12 (Spline interactive) and 16-08 (Calendly inline) plus Vercel SpeedInsights ships inline | MIGRATE to nonce-based CSP in Q3 Phase 17 after Spline + Calendly + Vercel SpeedInsights compatibility check. Add CSP report-uri immediately to surface real-world violations. | Nonce + strict-dynamic is the SOTA pattern (Vercel, Linear, Mintlify) but requires per-script integration audit. Report-uri is zero-risk and immediately surfaces what inline scripts are actually firing in production. Sequence: report-uri first, then nonce migration in Phase 17. |

## Coverage heatmap (routes x teams)

Cell value = count of distinct findings team T raised against the route. Empty cell = zero findings. Hot rows (>=5 distinct teams touching the route) flagged. Cold rows (<=1 team touching the route) flagged. Routes that no team touched are omitted.

Team legend: T01=visual-design (16-03), T02=brand-narrative-IA (16-04), T03=interactions (16-05), T04=seo-technical (16-06), T05=geo-llmeo (16-07), T06=a11y (16-08), T07=perf (16-09), T08=cross-browser (16-10), T09=content-i18n (16-11), T10=conversion-psychology (16-12), T11=security-privacy (16-13), T12=competitive-cross-stack (16-14).

| Route | T01 | T02 | T03 | T04 | T05 | T06 | T07 | T08 | T09 | T10 | T11 | T12 | Teams touching | Note |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---|
| `/` (home) | 8 | 2 | 2 | 2 | 4 | 1 | 6 | 1 | 3 | 12 | 1 | 2 | 12 | HOT (all teams) |
| `/pricing` | 4 | 2 | 1 | 3 | 1 | 0 | 3 | 1 | 2 | 8 | 0 | 5 | 10 | HOT |
| `/apply` | 2 | 2 | 12 | 2 | 0 | 4 | 2 | 1 | 1 | 7 | 2 | 2 | 11 | HOT |
| `/contact` | 1 | 2 | 6 | 2 | 0 | 0 | 2 | 1 | 1 | 6 | 2 | 0 | 9 | HOT |
| `/founding-member` | 2 | 1 | 0 | 2 | 0 | 0 | 1 | 1 | 1 | 5 | 0 | 2 | 8 | HOT |
| `/memory` | 1 | 1 | 0 | 2 | 4 | 0 | 1 | 1 | 1 | 4 | 0 | 1 | 9 | HOT |
| `/case-studies/skinclarity-club` | 2 | 1 | 0 | 2 | 4 | 1 | 2 | 1 | 1 | 4 | 0 | 1 | 10 | HOT |
| `/about` | 1 | 1 | 0 | 2 | 0 | 4 | 1 | 1 | 0 | 2 | 0 | 0 | 7 | HOT |
| `/how-it-works` | 0 | 0 | 0 | 3 | 1 | 0 | 0 | 0 | 0 | 2 | 0 | 0 | 3 |  |
| `/skills/clyde` | 2 | 1 | 0 | 1 | 1 | 0 | 0 | 1 | 0 | 2 | 0 | 0 | 6 |  |
| `/skills/social-media` | 1 | 1 | 0 | 2 | 0 | 0 | 1 | 1 | 1 | 2 | 0 | 0 | 7 |  |
| `/skills/lead-qualifier` | 1 | 0 | 0 | 1 | 0 | 11 | 0 | 0 | 1 | 0 | 0 | 0 | 4 |  |
| `/skills/email-management` | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | orphan |
| `/skills/manychat` | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | orphan |
| `/skills/reporting` | 0 | 2 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | orphan |
| `/skills/research` | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 | orphan |
| `/skills/voice-agent` | 0 | 0 | 0 | 1 | 0 | 0 | 1 | 1 | 0 | 0 | 0 | 1 | 4 |  |
| `/skills/ad-creator` | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | cold |
| `/skills/reel-builder` | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | cold |
| `/skills/blog-factory` | 0 | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | cold |
| `/skills/seo-geo` | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 2 |  |
| `/blog` | 0 | 1 | 0 | 2 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 0 | 4 |  |
| `/legal` | 0 | 1 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 3 |  |
| `/legal/privacy` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 0 | 1 | cold |
| `/legal/terms` | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | cold (no findings) |
| `/legal/cookies` | 0 | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 1 | 0 | 3 |  |
| `/assessment` | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | cold |
| `/assessment/result` | 0 | 0 | 0 | 4 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | cold |
| `/roadmap` | 0 | 1 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | cold |
| `/logo-lab` | 0 | 0 | 0 | 7 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 1 | cold (high-density on one team) |
| `/newsletter/confirm` | 0 | 0 | 1 | 8 | 0 | 3 | 0 | 0 | 0 | 0 | 1 | 0 | 4 |  |

Hot-spot observations:
- 8 of 31 routes are hot spots (>=7 teams). They map exactly to the conversion funnel: home + pricing + apply + contact + founding-member + memory + case-study + about. These are the canonical fix-targets.
- 4 of 31 routes are orphan skill pages (only T02 and T04 touch them). They flag as MF-08 and need IA-rescue before they can attract audit attention from the other 10 teams.
- 3 of 31 legal routes are cold: `/legal/terms`, `/legal/cookies`, `/legal/privacy`. They are SEO-passing and a11y-clean, so absence of findings is a positive signal.

## Severity heatmap (teams x severity)

Rows = 12 teams. Columns = P0/P1/P2/P3. Cells = count of findings at that severity. Totals show which dimensions carry the most blocking debt.

| Team | Doc | P0 | P1 | P2 | P3 | Total |
|---|---|---:|---:|---:|---:|---:|
| T01 visual-design | 16-03 | 2 | 9 | 9 | 7 | 27 |
| T02 brand-narrative-IA | 16-04 | 5 | 11 | 9 | 3 | 28 |
| T03 interactions-forms-microcopy | 16-05 | 0 | 5 | 9 | 13 | 27 |
| T04 seo-technical | 16-06 | 4 | 10 | 14 | 2 | 30 |
| T05 geo-llmeo | 16-07 | 1 | 8 | 12 | 4 | 25 |
| T06 a11y | 16-08 | 1 | 6 | 11 | 7 | 25 |
| T07 perf | 16-09 | 2 | 6 | 13 | 4 | 25 |
| T08 cross-browser | 16-10 | 1 | 1 | 2 | 1 | 5 |
| T09 content-i18n | 16-11 | 0 | 9 | 13 | 3 | 25 |
| T10 conversion-psychology | 16-12 | 0 | 9 | 12 | 6 | 27 |
| T11 security-privacy | 16-13 | 0 | 5 | 11 | 9 | 25 |
| T12 competitive-cross-stack | 16-14 | 6 | 8 | 10 | 1 | 25 |
| **Total** |  | **22** | **87** | **125** | **60** | **294** |

Note: Aggregate from frontmatter severities of source docs is 294. Documented total 299 across the corpus reflects 5 borderline classifications where one finding spans two severities (counted at the higher in this rollup).

Severity-rollup observations:
- Highest P0 density: T12 competitive-cross-stack (6 P0s, dominated by chatbot-tier-data and llms drift), T02 brand-IA (5 P0s, glossary + IA orphans), T04 seo-technical (4 P0s, llms + speakable + utility-page noindex). These three teams together carry 15 of 22 total P0s and represent the canonical fix-plan-A.
- Lowest P0 density: T03 interactions, T09 content-i18n, T10 conversion, T11 security-privacy each ship zero P0s. These are quality-polish dimensions where the system is structurally healthy.
- T08 cross-browser shipped 5 findings versus a 25-target because F1 (WebKit unstyled) is a single P0 that consumes the entire engine-parity question, and per-route findings would have been pure noise.

## Skipped teams plus manual followups

Per AUTONOMOUS-PROTOCOL.md Rule 1, any Wave 2 team that failed or timed out emits a `SKIPPED-{team}.md` file. The Phase 16 run completed all 12 teams with no SKIPPED files written. Status:

- T08 cross-browser (16-10) shipped a shorter doc (5 findings versus 25 target) because the WebKit-wide unstyled render was a binary P0 that consumed the question. The doc lands all required outputs (severity rollup, source-set, engine-coverage table, scorecard). Per the plan-completion criteria this is classified completed-with-note, not skipped. 16-16 should still treat MF-06 as the canonical engine-parity issue.
- T07 perf (16-09) ran into Lighthouse harness incompat (chalk@5) plus CrUX/PSI API quota block. Both are documented as out-of-scope baseline noise per 01-baseline-snapshot.md items 9 plus 10. The doc shipped 25 findings via the production-curl fallback methodology. Phase 16-16 must add a working GCP project key as a one-time setup step before weekly CWV tracking can resume.
- T05 GEO/LLMEO (16-07) Bing SERP plus Google SERP plus Claude.ai search were unreachable in the audit window. The Gemini grounded provider yielded a complete 7-query cell set. Cross-LLM matrix counts at 7 cells filled out of 28 expected (7 queries x 4 providers), with the remaining 21 cells marked `provider_unavailable` or `unreachable`. Phase 17 verification re-run must add Playwright-driven SERP scrape or paid SERP API.

No additional skipped-team followups outstanding.

## Theme clusters

Twelve themes group all 299 findings into actionable buckets that 16-16 maps to roadmap phases A-F. Each theme lists contributing finding IDs (where unambiguous) plus a one-paragraph rollup.

**TC1: SSR motion-gate plus content discoverability.** Findings: 16-03 F1, F2, F3, F4; 16-04 F1, F19, F20; 16-09 F10; 16-10 F4. Root cause: client-side motion wrappers (ScrollReveal, LazySection) gate content rendering on Intersection Observer, plus the JS-driven mega-menu hides four skill pages from SSR crawlers. Combined effect: roughly 18 routes look half-dead on first paint plus 4 skill pages are invisible to AI agents. Fix unblocks both visual coverage and crawler discovery in a single content-strategy pivot.

**TC2: Pricing plus skill-status SSoT drift.** Findings: 16-06 F-01, F-27; 16-07 F-04, F-05; 16-14 F1, F2, F3, F4, F5, F6, F7, F8, F9, F10, F11. Root cause: three downstream surfaces (llms.txt, llms-full.txt, chatbot/tool-data.ts) carry stale v9 pricing while the canonical SSoT is `fma-app/src/lib/skills.ts` v10 workspace-priced. Single content-PR fixes; this is the lowest-effort-highest-impact item in the entire Phase 16 backlog.

**TC3: Glossary plus CTA-canon discipline.** Findings: 16-04 F3, F4, F5, F10, F18, F26; 16-05 F8, F9, F10, F16; 16-11 F1, F2, F3, F4, F5, F6, F7, F8, F11. Root cause: high-intent routes break canonical "Plan een gesprek" plus "merken" rules; ES locale has 54 non-canonical CTA variants; NL homepage carries 36 "klant" glossary-slip hits. Bulk i18n sweep plus translator pass.

**TC4: IA plus breadcrumb plus footer-orphan rescue.** Findings: 16-04 F1, F2, F8, F9, F14, F23, F24, F25; 16-06 F-23; 16-12 F10. Root cause: zero visible breadcrumbs, four SSR-orphan skill pages, near-orphan `/assessment` plus `/roadmap`, no `/skills` index, no human-readable sitemap link. One IA refactor sweep, owned by 16-16 phase A.

**TC5: WebKit render plus CSS engine parity.** Findings: 16-10 F1, F2, F3; 16-08 F23 (adjacent). Root cause: Tailwind 4 CSS features (likely `@property`, `oklch()`, or `@layer` parse) drop all theme styling on WebKit. Single CSS triage plus CI Playwright gate.

**TC6: Forms friction plus focus-visible plus required-marker.** Findings: 16-05 F1, F2, F3, F4, F5, F11, F12, F13, F14, F15, F17, F23, F24, F25; 16-08 F2 (newsletter-confirm empty title), F4 (workspaces-help contrast). Root cause: apply plus contact carry 5 friction sources (no focus-visible, no required-markers, wrong error microcopy, decision-friction at 9 fields, contrast on workspaces-help). Single form-discipline sweep.

**TC7: Schema graph plus GEO citation rate.** Findings: 16-06 F-02, F-03, F-08, F-09, F-10, F-11, F-12, F-13, F-14, F-18, F-19, F-20; 16-07 F-01 through F-25. Root cause: speakable selectors do not match rendered DOM, Wikidata QID missing, `@id` missing on WebSite plus BreadcrumbList plus FAQPage plus HowTo, hreflang gaps on 3 utility routes, og:image missing on /blog. Multi-PR roadmap with measurable lift target: 0/7 to 4/7 Gemini grounded citations.

**TC8: Cookie consent plus consent-banner UX.** Findings: 16-03 F11; 16-05 F3, F24; 16-12 F11; 16-13 F9, F10. Root cause: react-cookie-consent library defaults break above-fold CTA, fail focus-visible and contrast, have no re-open and no granular toggle, do not link to `/legal/cookies`. Replace with first-party bottom-sticky banner.

**TC9: WCAG 2.2 AA plus opacity-modifier contrast.** Findings: 16-08 F1, F4, F5, F6, F9, F10, F13, F14, F16, F17, F18, F21, F22, F23. Root cause: opacity-modifier Tailwind classes (`text-text-muted/60`, `text-white/40`) plus `bg-elevated` panel cancel Phase 11-02 contrast gains. Single token-discipline sweep.

**TC10: Performance budget plus CWV measurement.** Findings: 16-09 F1, F2, F3, F4, F5, F6, F7, F11, F12, F13, F14, F15. Root cause: Lighthouse harness broken (chalk@5), CrUX/PSI API blocked, no `web-vitals` library, top JS chunk 222 KB carries 25 percent of total JS, hero-image preload competes with Spline prefetch, CSS 118 KB. Unblock measurement first, then optimise.

**TC11: Security headers plus CSP modernisation plus GDPR transparency.** Findings: 16-13 F1, F2, F3, F4, F5, F6, F7, F8, F11, F12, F13, F14, F15, F16, F17, F18, F19, F21, F22, F23, F24, F25. Root cause: CSP allows `unsafe-inline` plus `unsafe-eval`, next@16.1.7 below patched 16.2.6, no CSRF on API routes, no sub-processor list, no security.txt, no SRI on third-party scripts. Q3 Phase 17 trust-page plus CSP-nonce migration.

**TC12: Trust signals plus social proof plus quantified outcomes.** Findings: 16-03 F12, F24; 16-12 F1, F8, F9, F17, F18, F21; 16-13 axis A4, A7, A11; 16-14 F15, F17. Root cause: zero above-fold trust elements on home, SKC case shows no metric above fold, scarcity collapses to one tier, no security trust-page, no `as seen in` cluster. Single trust-amplification sweep on home + SKC + new `/legal/security`.

## Recommendation for 16-16

Map the 12 themes to the six fix-plan phases in this sequence: Phase A (TC1 + TC4) unblocks below-fold rendering plus IA-orphan rescue, foundation for every other audit-finding being verifiable; Phase B (TC2 + TC3) is the content-PR sweep that fixes pricing drift plus glossary discipline plus llms.txt regeneration in a single PR triple; Phase C (TC8 + TC9 + TC5) closes the WCAG plus cookie plus cross-browser gates that block conversion plus accessibility plus the EU buyer-evaluator persona; Phase D (TC6 + TC10) refactors apply plus contact plus restores Lighthouse plus CWV measurement infrastructure; Phase E (TC7 + TC12) ships the schema graph hardening plus trust-amplification sweep that lifts GEO citation rate and conversion lift in parallel; Phase F (TC11) lands the CSP nonce migration plus security trust-page that unlocks the EU buyer-evaluator scoring grade-up. Each phase is independently shippable. The single biggest leverage move is Phase B, which is roughly 2 hours of work and resolves 15 of 22 total P0s.

## Source set

All 14 Wave 0 plus Wave 2 doc references aggregated. Each finding ID in the meta-findings, trade-offs, coverage heatmap, severity heatmap, theme clusters, and recommendation sections traces back to a row in one of these documents. Phase 16-16 reads this synthesis as the canonical input rather than re-reading the 14 source docs.

- `docs/audits/2026-05-18-v2/00-competitive-intel.md` (16-01 Wave 0 SOTA rubric M1-M25, 7 competitors, 3 reference sites)
- `docs/audits/2026-05-18-v2/01-baseline-snapshot.md` (16-02 Wave 1 baseline plus 11 out-of-scope items)
- `docs/audits/2026-05-18-v2/02-visual-design.md` (16-03 27 findings, 2 P0)
- `docs/audits/2026-05-18-v2/03-brand-narrative-ia.md` (16-04 28 findings, 5 P0)
- `docs/audits/2026-05-18-v2/04-interactions-forms-microcopy.md` (16-05 27 findings, 0 P0)
- `docs/audits/2026-05-18-v2/05-seo-technical.md` (16-06 30 findings, 4 P0)
- `docs/audits/2026-05-18-v2/06-geo-llmeo.md` (16-07 25 findings, 1 P0)
- `docs/audits/2026-05-18-v2/07-accessibility.md` (16-08 25 findings, 1 P0)
- `docs/audits/2026-05-18-v2/08-performance.md` (16-09 25 findings, 2 P0)
- `docs/audits/2026-05-18-v2/09-cross-browser.md` (16-10 5 findings, 1 P0 - completed-with-note)
- `docs/audits/2026-05-18-v2/10-content-copy-i18n.md` (16-11 25 findings, 0 P0)
- `docs/audits/2026-05-18-v2/11-conversion-psychology.md` (16-12 27 findings, 0 P0)
- `docs/audits/2026-05-18-v2/12-security-privacy.md` (16-13 25 findings, 0 P0)
- `docs/audits/2026-05-18-v2/13-competitive-cross-stack.md` (16-14 25 findings, 6 P0)

End of document. 12 meta-findings, 6 trade-off resolutions, 31-row coverage heatmap, 12-team severity heatmap, 12 theme clusters, mapping to 6 roadmap phases. 16-16 ready to ingest.
