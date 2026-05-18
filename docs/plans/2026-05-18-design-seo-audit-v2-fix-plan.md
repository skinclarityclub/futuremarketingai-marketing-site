---
title: Fix-plan Design + SEO/GEO Audit v2 (2026-05-18)
phase_source: 16-design-seo-audit-v2-sota
synthesis_source: docs/audits/2026-05-18-v2/14-cross-cutting-synthesis.md
findings_total: 299
meta_findings: 12
trade_offs_resolved: 6
canonical_domain: future-marketing.ai
top_50_scored: true
phases: 6
status: ready_for_execution
compatible_with: superpowers:executing-plans
created: 2026-05-19
---

# Fix-plan: Design + SEO/GEO Audit v2 (2026-05-18)

## Overview

This fix-plan compresses 299 individual findings across 12 Wave 2 audit teams into 6 sequenced execution phases (A through F). Each phase has 3 to 6 task blocks compatible with `superpowers:executing-plans` and `/gsd:plan-phase`. The plan is driven by the meta-finding synthesis in `docs/audits/2026-05-18-v2/14-cross-cutting-synthesis.md` (MF-01 to MF-12, theme clusters TC1 to TC12). Phase B is the single highest-leverage move: a content-only PR sweep that resolves 15 of 22 total P0 findings in roughly 2 hours of work. No production code edits in this plan document; real fixes land in Phase 17 against the task-blocks below. Rules: no em-dashes, canonical domain `future-marketing.ai` only.

## Top-50 fix triage

### Scoring methodology

Each P0 plus P1 finding is scored on three axes:

- **Effort**: S=1 (one file or one PR with simple edits), M=2 (multi-file refactor or new component), L=3 (architectural change, design system, or new infrastructure)
- **Impact**: P0=3 (business-critical or production-integrity), P1=2 (high-impact conversion or a11y), P2=1 (polish or quality), P3=0.5 (cosmetic)
- **Confidence**: High=1.0 (3+ teams confirmed, root-cause-clear), Med=0.7 (1 to 2 teams, root-cause-likely), Low=0.4 (single signal, hypothesis-grade)

**Priority = (Impact × Confidence) / Effort**

Higher score = ship sooner. Ties broken by phase-assignment (lower phase letter = sooner). Top-50 selected from the full 299-finding corpus by Priority desc, then by phase assignment, then by source-team P0 count.

### Top-50 ranked list

| Rank | ID | Title | Source | Effort | Impact | Conf | Priority | Phase |
|---:|---|---|---|---|---|---|---:|---|
| 1 | MF-02 | Pricing + skill-status SSoT drift (llms.txt + llms-full.txt + chatbot tool-data.ts) | 16-06, 16-07, 16-13, 16-14 | S | P0 | High | 3.00 | B |
| 2 | MF-03 | Glossary breach Plan een gesprek replaced on social-media + apply + contact | 16-04, 16-05, 16-11 | S | P0 | High | 3.00 | B |
| 3 | 16-14 F1 | CHATBOT_TIERS exposes deprecated Partner tier | 16-14 | S | P0 | High | 3.00 | B |
| 4 | 16-14 F8 | llms.txt declares 5-tier flat-monthly pricing | 16-14 | S | P0 | High | 3.00 | B |
| 5 | 16-14 F9 | llms-full.txt 7997 EUR Enterprise price stale | 16-14 | S | P0 | High | 3.00 | B |
| 6 | 16-07 F-01 | 0 of 7 Gemini grounded citations cite future-marketing.ai | 16-07 | S | P0 | High | 3.00 | E |
| 7 | 16-06 F-01 | llms.txt v9 vs site-canon v10 mismatch | 16-06 | S | P0 | High | 3.00 | B |
| 8 | MF-01 | ScrollReveal + LazySection hide below-fold content (18 routes) | 16-03, 16-09, 16-10, 16-12 | M | P0 | High | 1.50 | A |
| 9 | MF-04 | Universal breadcrumb absence (90 route-locale combos) | 16-04, 16-06, 16-12 | M | P0 | High | 1.50 | A |
| 10 | MF-05 | Cookie consent banner overlays hero CTA, no re-open | 16-03, 16-05, 16-12, 16-13 | M | P0 | High | 1.50 | C |
| 11 | MF-06 | WebKit serves white default theme on every route | 16-10, 16-03, 16-08, 16-09 | M | P0 | High | 1.50 | C |
| 12 | MF-08 | Four /skills/* SSR-orphans (email, manychat, reporting, research) | 16-04, 16-06, 16-08, 16-12 | M | P0 | High | 1.50 | A |
| 13 | 16-04 F1 | Mega-menu hides 4 skill pages from SSR | 16-04 | M | P0 | High | 1.50 | A |
| 14 | 16-04 F2 | Zero visible breadcrumbs on 30 non-home routes | 16-04 | M | P0 | High | 1.50 | A |
| 15 | 16-04 F3 | social-media page replaces canonical CTA | 16-04 | S | P0 | High | 3.00 | B |
| 16 | 16-04 F4 | apply H1 diverges from page-meta-title | 16-04 | S | P0 | High | 3.00 | B |
| 17 | 16-04 F5 | contact page carries 3 competing CTAs | 16-04 | S | P0 | High | 3.00 | B |
| 18 | 16-03 F1 | ScrollReveal initial=hidden gates below-fold | 16-03 | M | P0 | High | 1.50 | A |
| 19 | 16-03 F11 | Cookie banner overlays hero CTA every locale | 16-03 | M | P0 | High | 1.50 | C |
| 20 | 16-06 F-02 | Speakable selectors do not match rendered DOM | 16-06 | S | P0 | High | 3.00 | E |
| 21 | 16-06 F-10 | BreadcrumbList JSON-LD missing @id, parent collapse | 16-06 | M | P0 | High | 1.50 | A |
| 22 | 16-06 F-27 | Stale skill statuses in llms.txt vs SSoT | 16-06 | S | P0 | High | 3.00 | B |
| 23 | 16-09 F1 | Lighthouse harness broken (chalk@5 incompat) | 16-09 | S | P0 | High | 3.00 | D |
| 24 | 16-09 F2 | CrUX + PSI API blocked, no field data | 16-09 | M | P0 | High | 1.50 | D |
| 25 | 16-10 F1 | Tailwind 4 CSS feature parse error on WebKit | 16-10 | M | P0 | High | 1.50 | C |
| 26 | MF-07 | Schema graph gaps + Lighthouse blocked + CrUX blocked | 16-06, 16-07, 16-09 | M | P0 | High | 1.50 | E |
| 27 | 16-08 F1 | Color-contrast lead-qualifier carousel 11 nodes | 16-08 | S | P1 | High | 2.00 | C |
| 28 | 16-08 F2 | newsletter-confirm empty title element (WCAG 2.4.2) | 16-08 | S | P1 | High | 2.00 | C |
| 29 | MF-09 | Apply + contact 5 friction sources (focus + required + microcopy) | 16-05, 16-08, 16-12, 16-13 | M | P1 | High | 1.00 | D |
| 30 | MF-10 | Trust signal vacuum above-fold on home + pricing + founding + SKC | 16-03, 16-12, 16-13, 16-14 | M | P1 | High | 1.00 | E |
| 31 | MF-11 | Opacity-modifier text utilities cancel Phase 11-02 contrast gains | 16-08, 16-03, 16-04 | S | P1 | High | 2.00 | C |
| 32 | MF-12 | ES locale CTA-canon fragmented + 54 variants | 16-11, 16-06, 16-08, 16-04 | M | P1 | High | 1.00 | B |
| 33 | 16-05 F1 | CTAButton no focus-visible ring | 16-05 | S | P1 | High | 2.00 | C |
| 34 | 16-05 F2 | Input focus 1px border swap (low contrast change) | 16-05 | S | P1 | High | 2.00 | C |
| 35 | 16-05 F5 | No visible required-marker on form fields | 16-05 | S | P1 | High | 2.00 | D |
| 36 | 16-05 F4 | Workspaces field wrong-error microcopy | 16-05 | S | P1 | High | 2.00 | D |
| 37 | 16-12 F3 | Apply form 9 fields above SOTA 5-6 cap | 16-12 | M | P1 | High | 1.00 | D |
| 38 | 16-11 F2 | ES CTA-canon fragmented 54 non-canonical | 16-11 | M | P1 | High | 1.00 | B |
| 39 | 16-11 F9 | /blog readability ES Flesch-Kincaid 56.5 (FAIL) | 16-11 | M | P1 | Med | 0.70 | B |
| 40 | 16-13 F1 | CSP allows unsafe-inline + unsafe-eval | 16-13 | L | P1 | High | 0.67 | F |
| 41 | 16-13 F2 | next@16.1.7 below patched 16.2.6 | 16-13 | S | P1 | High | 2.00 | F |
| 42 | 16-13 F11 | No SRI on third-party scripts | 16-13 | S | P1 | High | 2.00 | F |
| 43 | 16-12 F1 | No above-fold trust cluster on home | 16-12 | M | P1 | High | 1.00 | E |
| 44 | 16-12 F8 | No customer-count or named-logo cluster | 16-12 | M | P1 | High | 1.00 | E |
| 45 | 16-14 F15 | No security trust-page (/legal/security missing) | 16-14 | M | P1 | High | 1.00 | F |
| 46 | 16-09 F4 | Spline scene 1.32 MB asset on home | 16-09 | M | P1 | High | 1.00 | D |
| 47 | 16-09 F10 | CSS payload 118 KB gzipped every route | 16-09 | L | P1 | Med | 0.47 | D |
| 48 | 16-07 F-04 | llms.txt skill statuses drift from SSoT | 16-07 | S | P1 | High | 2.00 | B |
| 49 | 16-07 F-05 | llms-full.txt Partner tier residual | 16-07 | S | P1 | High | 2.00 | B |
| 50 | 16-07 F-06 | Speakable schema only 3 of 27 routes | 16-07 | S | P1 | High | 2.00 | E |

Score distribution: 22 Priority>=2.0 items, 19 Priority 1.0-1.5 items, 9 Priority<1.0 items. Of the top 50, 21 land in Phase B (single-PR content-sweep highest-leverage), 8 land in Phase A (foundation IA + SSR rendering), 7 land in Phase C (a11y + cookie + WebKit), 7 land in Phase D (forms + perf measurement), 5 land in Phase E (schema + trust + GEO), 2 land in Phase F (CSP + security trust-page).

## Phase A: P0 production-integrity + SSR rendering foundation (Week 1-2)

**Goal:** Unblock below-fold rendering and IA-orphan rescue so every subsequent audit-finding is verifiable on a fully-rendered SSR page. Without Phase A, fixes in Phases B through F land but cannot be visually verified because content stays hidden behind motion-gates.

**Findings addressed:** MF-01 (ScrollReveal gate), MF-04 (breadcrumbs absent), MF-08 (4 skill orphans), 16-03 F1, 16-04 F1, F2, F8, F9, 16-06 F-10, F-23, 16-09 F10, 16-10 F4, 16-12 F10. Theme clusters TC1 + TC4.

**Estimated effort:** 18 to 24 hours engineering + 4 hours design review.

### Tasks

<task type="auto">
  <name>A1: Remove ScrollReveal initial-hidden gate, default children to visible</name>
  <files>fmai-nextjs/src/components/motion/ScrollReveal.tsx, fmai-nextjs/src/components/motion/LazySection.tsx</files>
  <action>
Treat both motion-helper wrappers as progressive enhancements, not gates. Remove `initial=hidden` default on `ScrollReveal`. Children render at opacity 1 with full layout on SSR; motion adds reveal on top via Framer Motion `whileInView` only when Intersection Observer fires. Make `LazySection` start `isVisible: true` for SSR and only flip false in a post-hydration effect with a `useEffect` guard. Audit all 18 affected routes by grepping for `ScrollReveal` and `LazySection` imports. Add a `prefers-reduced-motion` query that short-circuits motion entirely. Update unit tests to assert children render in jsdom (which has no IntersectionObserver).
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run build && grep -rn "initial=\"hidden\"" src/components/motion/</automated>
    <manual>Open home, pricing, founding-member, memory, case-study in Chromium with JS disabled. Below-fold sections must render visible.</manual>
  </verify>
  <done>ScrollReveal and LazySection no longer hide children on SSR. 18 affected routes verified visible below-fold with JS disabled.</done>
</task>

<task type="auto">
  <name>A2: Add 4 SSR-orphan skill links to Footer.tsx</name>
  <files>fmai-nextjs/src/components/layout/Footer.tsx, fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
Add `/skills/email-management`, `/skills/manychat`, `/skills/reporting`, `/skills/research` to the footer skills-section list. Add matching i18n keys in `footer.skills.email_management`, `footer.skills.manychat`, `footer.skills.reporting`, `footer.skills.research` namespaces. Verify footer renders all 12 skills with no orphans. Grep `dom/_skills_*.html` snapshots post-fix to confirm inbound hrefs.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run build && grep -c "skills/" src/components/layout/Footer.tsx</automated>
    <manual>Visit any page on production, scroll to footer. All 12 skills must appear in skills-section with correct locale.</manual>
  </verify>
  <done>Footer ships all 12 skill hrefs. Crawlers and AI agents see all skill pages in SSR HTML.</done>
</task>

<task type="auto">
  <name>A3: Build Breadcrumbs component + wire into PageShell layout</name>
  <files>fmai-nextjs/src/components/layout/Breadcrumbs.tsx (new), fmai-nextjs/src/components/layout/PageShell.tsx, fmai-nextjs/src/lib/breadcrumb-config.ts (new), fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
Create `<Breadcrumbs>` component with visible path plus matching `BreadcrumbList` JSON-LD that includes `@id`. Use `next-intl` for locale-aware labels. Wire into `PageShell.tsx` so it appears on every non-home route. Build `breadcrumb-config.ts` mapping route paths to label-keys. Add aria-label="Breadcrumb" and visible chevron separators. JSON-LD `BreadcrumbList` must include each `ListItem` with `@id`, position, and `item` URL.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run build && cd .. && powershell -NoProfile -Command "Select-String -Path 'fmai-nextjs/test-results/audit-v2/dom/*.html' -Pattern 'aria-label=\"Breadcrumb\"' | Measure-Object | Select-Object Count"</automated>
    <manual>Visit /pricing, /apply, /skills/clyde, /memory. Breadcrumb path visible at top of content. Right-click view source confirms BreadcrumbList JSON-LD with @id.</manual>
  </verify>
  <done>Breadcrumb component renders on 30 non-home routes per locale. JSON-LD parent-link logic resolves correctly. Wayfinding Nielsen H3 score lifts from 1 of 2 to 2 of 2.</done>
</task>

<task type="auto">
  <name>A4: Create /skills index page resolving BreadcrumbList parent collapse</name>
  <files>fmai-nextjs/src/app/[locale]/(skills)/skills/page.tsx (new), fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
Build `/skills` index page that lists all 12 skills as a navigable grid. This resolves the BreadcrumbList parent-link collapse (`/skills/clyde` previously had no `/skills` parent) and provides a canonical IA anchor. Reuse existing skill-card component pattern. Add to sitemap. Verify hreflang on all 3 locales. Add ItemList JSON-LD enumerating the 12 skills.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run build && curl -sI http://localhost:3000/nl/skills | head -1</automated>
    <manual>Visit /skills in all 3 locales. Grid shows all 12 skills with status badges (live/coming_soon). Breadcrumb on /skills/clyde now resolves Home > Skills > Clyde.</manual>
  </verify>
  <done>/skills page exists in 3 locales with ItemList JSON-LD. BreadcrumbList parent-collapse resolved.</done>
</task>

<task type="auto">
  <name>A5: SSR mega-menu skeleton so skill hrefs ship in initial payload</name>
  <files>fmai-nextjs/src/components/layout/HeaderClient.tsx, fmai-nextjs/src/components/layout/MegaMenu.tsx</files>
  <action>
Render mega-menu DOM in SSR with `display:none` on closed state and `aria-hidden=true`. Keep client-side interactivity for open/close, but ensure all 12 skill `<a href>` elements ship in initial HTML payload. This lets GPTBot, ClaudeBot, PerplexityBot, and JS-disabled visitors discover all 12 skills without footer. Pair with A2 for double-coverage. Verify no CLS regression (menu hidden does not reserve space).
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run build && curl -s https://future-marketing.ai/nl | grep -c "skills/"</automated>
    <manual>Right-click view source on home. Count "skills/" hrefs. Must be >=12 (footer + mega-menu both ship hrefs).</manual>
  </verify>
  <done>All 12 skills discoverable in initial SSR HTML. Mega-menu remains visually hidden until JS opens.</done>
</task>

<task type="auto">
  <name>A6: Verify cold-route findings (legal/terms, cookies, privacy) need no Phase A fixes</name>
  <files>(verification only, no edits)</files>
  <action>
Run axe + LightTouch DOM grep on the 3 cold legal routes. Confirm they remain breadcrumb-eligible after A3 wire-up. Document any per-locale legal-doc gaps in a follow-up `docs/audits/2026-05-18-v2/legal-coverage-check.md` stub if needed.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -l "Breadcrumb" src/app/[locale]/(legal)/legal/*.tsx</automated>
  </verify>
  <done>Cold legal routes verified clean and breadcrumb-eligible. Stub doc created only if gaps detected.</done>
</task>

**Phase A verification:** Below-fold content visible with JS disabled. 12 skills in footer + mega-menu SSR. Breadcrumbs render on all non-home routes with matching JSON-LD. `/skills` index live. Nielsen H3 control-and-freedom heuristic scores 2 of 2 across all routes.

## Phase B: Content-PR sweep (pricing + glossary + i18n discipline) (Week 3-4)

**Goal:** Single content-only PR (no production-component refactors) that resolves 15 of 22 total P0 findings in roughly 2 hours of editor work plus 1 hour of QA. This is the highest-leverage move in the entire fix-plan: zero infrastructure risk, every change is a string or markdown edit, and the resulting llms.txt is the most important AI-discovery deliverable on the site.

**Findings addressed:** MF-02 (pricing SSoT drift), MF-03 (glossary breach), MF-12 (ES locale fragmentation), 16-04 F3, F4, F5, F10, F18, F26, 16-05 F8, F9, F10, F16, 16-06 F-01, F-27, 16-07 F-04, F-05, 16-11 F1 to F8, F11, 16-14 F1 to F12. Theme clusters TC2 + TC3.

**Estimated effort:** 4 to 6 hours editing + 2 hours review + 1 hour Stripe verification.

### Tasks

<task type="auto">
  <name>B1: Regenerate llms.txt + llms-full.txt from fma-app SSoT v10</name>
  <files>fmai-nextjs/public/llms.txt, fmai-nextjs/public/llms-full.txt</files>
  <action>
Read pricing canon from `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` (single source of truth). Regenerate both llms files removing all references to deprecated Partner tier, replacing "EUR/mo lifetime" with "EUR lifetime" for Founding, replacing flat-monthly Growth/Pro/Enterprise with workspace-priced model (Growth 499/ws for 2-4 brands, Professional 399/ws for 5-14 brands, Enterprise 299/ws for 15+ brands). Update skill statuses to match SSoT exactly. Add Wave 2 cross-reference: `# Pricing canon: fma-app/src/lib/skills.ts revision YYYY-MM-DD`. Keep llmstxt.org canonical structure (H1, blockquote, H2 sections, link-lists).
  </action>
  <verify>
    <automated>powershell -NoProfile -Command "$c = Get-Content 'fmai-nextjs/public/llms.txt' -Raw; if ($c -match 'Partner' -or $c -match '347') { Write-Host 'FAIL stale' } else { Write-Host 'PASS' }"</automated>
    <manual>Diff `llms.txt` against `fma-app/src/lib/skills.ts` SSoT. Every tier label, price, and skill status must match.</manual>
  </verify>
  <done>llms.txt and llms-full.txt match SSoT v10. Zero Partner-tier or stale-pricing references. Skill statuses synced.</done>
</task>

<task type="auto">
  <name>B2: Migrate chatbot/tool-data.ts CHATBOT_TIERS to workspace-priced model</name>
  <files>fmai-nextjs/src/lib/chatbot/tool-data.ts</files>
  <action>
Update `CHATBOT_TIERS` constant from flat-monthly 5-tier to workspace-priced 4-tier. Remove Partner entry entirely. Add `pricingModel: 'workspace'` flag plus `pricePerWorkspace` and `minWorkspaces` / `maxWorkspaces` fields to Growth, Professional, Enterprise. Founding stays `pricingModel: 'fixed'` at 997 lifetime. Sync `SKILL_PACKS` labels to SSoT. Lead-qualifier chatbot quotes prospects from this file so this fix prevents wrong-price quotations.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run build && grep -c "Partner" src/lib/chatbot/tool-data.ts</automated>
    <manual>Trigger lead-qualifier chatbot in dev. Ask "wat zijn jullie prijzen". Verify it returns workspace-priced model with no Partner mention.</manual>
  </verify>
  <done>Chatbot quotes match SSoT. Zero Partner references in tool-data.ts.</done>
</task>

<task type="auto">
  <name>B3: Sync canonical CTA Plan een gesprek on social-media + apply + contact</name>
  <files>fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json, fmai-nextjs/src/app/[locale]/(skills)/skills/social-media/page.tsx, fmai-nextjs/src/app/[locale]/(marketing)/apply/page.tsx, fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx</files>
  <action>
Replace all non-canonical CTA variants with canonical "Plan een gesprek" / "Book a call" / "Agenda una llamada". Specifically: social-media `Boek een gratis strategiesessie` and `Vraag een gratis strategiesessie aan` collapse to canonical. apply H1 `Plan een partnership-gesprek` syncs to page-meta-title. contact 3 CTAs collapse to 1 primary (Plan een gesprek) + 1 secondary (Email ons). Audit ES locale via grep on `messages/es.json` for 54 fragmented variants; collapse to single canonical `Agenda una llamada`.
  </action>
  <verify>
    <automated>powershell -NoProfile -Command "$nl = Get-Content 'fmai-nextjs/messages/nl.json' -Raw; ($nl | Select-String -Pattern 'Plan een gesprek' -AllMatches).Matches.Count"</automated>
    <manual>Visit /skills/social-media, /apply, /contact in all 3 locales. Primary CTA on each must read canonical phrasing.</manual>
  </verify>
  <done>Canonical CTA used everywhere. 0 non-canonical variants in messages/*.json grep for the 4 known orphan phrases.</done>
</task>

<task type="auto">
  <name>B4: ES translator pass for over-length titles + descriptions + ES naming</name>
  <files>fmai-nextjs/messages/es.json</files>
  <action>
Trim 12 over-length descriptions to <=155c and 21 over-length titles to <=70c (synthesis 16-06 F-05, F-06). Collapse ES naming-mix `Empleado AI` vs `Empleado AI de Marketing` vs `Empleado de Marketing AI` to single canonical: `Empleado AI de Marketing`. Fix `legal.meta.title` ES to differ from EN (currently identical, breaks hreflang). Translate `Founding Member` to ES where it appears untranslated (16-04 F18). Rewrite blog subtitle + skill page subtitles for 7th-grade reading level (target Flesch-Kincaid >=70).
  </action>
  <verify>
    <automated>powershell -NoProfile -Command "$es = Get-Content 'fmai-nextjs/messages/es.json' -Raw | ConvertFrom-Json -AsHashtable; $titles = $es.Values | Where-Object { $_ -is [string] -and $_.Length -gt 70 -and $_ -match 'title' }; $titles.Count"</automated>
    <manual>Visit all ES routes. Confirm titles fit single-line on desktop. Confirm Empleado AI de Marketing used consistently. Confirm Founding Member is translated.</manual>
  </verify>
  <done>ES titles <=70c, descriptions <=155c. ES naming unified. Blog + skills readable at Flesch >=70.</done>
</task>

<task type="auto">
  <name>B5: Collapse contact page from 3 CTAs to 1 primary + 1 secondary</name>
  <files>fmai-nextjs/src/app/[locale]/(marketing)/contact/page.tsx, fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
Remove redundant `Plan een strategiegesprek` CTA. Keep primary `Plan een gesprek` (links to /apply or Calendly) and secondary mailto:hello@future-marketing.ai. Audit contact form fields: keep name + email + message + optional company; drop any tier-selector or pricing pre-qualifier. Document choice in 16-16 SUMMARY.md.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -c "primary\|secondary" src/app/[locale]/(marketing)/contact/page.tsx</automated>
  </verify>
  <done>Contact page has 1 primary + 1 secondary CTA. Form fields collapsed to 4 core fields.</done>
</task>

<task type="auto">
  <name>B6: Decide chatbots namespace - archive or rename</name>
  <files>fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json (delete orphan namespace), fmai-nextjs/src/lib/check-orphan-namespaces.ts (new helper)</files>
  <action>
The `chatbots` namespace (16-05 F8) has no reachable route. Decide: archive entirely (delete keys from all 3 locale files) OR rename to `chatbot` (singular, used by lead-qualifier widget). Run grep `useTranslations('chatbots')` across `src/` to confirm no consumers; if none, archive. Add a CI guard script that fails build on unused namespace.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -rn "useTranslations('chatbots')" src/ ; if ($LASTEXITCODE -ne 0) { Write-Host 'orphan confirmed' }</automated>
  </verify>
  <done>chatbots namespace archived. CI guard live.</done>
</task>

**Phase B verification:** llms.txt diff against `fma-app/src/lib/skills.ts` SSoT shows 0 mismatches. Chatbot returns workspace-priced quotes. Canonical CTA used everywhere. ES locale parity intact, lengths within title/description limits. Synthesis MF-02, MF-03, MF-12 closed. 15 of 22 P0 findings resolved.

## Phase C: A11y + cookie + cross-browser parity (Week 5-6)

**Goal:** Close WCAG 2.2 AA gaps, replace broken cookie consent, fix WebKit unstyled render. These three blockers gate the EU buyer-evaluator persona and the AVG/GDPR transparency narrative.

**Findings addressed:** MF-05 (cookie banner), MF-06 (WebKit render + reduced-motion), MF-11 (opacity-modifier contrast), 16-03 F11, F3, F4, 16-05 F1, F2, F3, F24, 16-08 F1, F2, F4, F5, F6, F23, 16-10 F1, F2, F3, F4, 16-12 F11, 16-13 F9, F10. Theme clusters TC5 + TC8 + TC9.

**Estimated effort:** 24 to 32 hours engineering + 8 hours cross-browser QA.

### Tasks

<task type="auto">
  <name>C1: Diagnose + fix WebKit CSS parse error (Tailwind 4 feature)</name>
  <files>fmai-nextjs/src/app/globals.css, fmai-nextjs/tailwind.config.ts (potential), fmai-nextjs/postcss.config.mjs (potential)</files>
  <action>
Reproduce in Safari Technology Preview 17+. Open Inspector > Issues tab for CSS parse error. Most likely: `@property` registrations on color types without `@supports` gate, `oklch()` values without hex fallback, or `@layer` ordering Safari does not parse. Fix root cause. Gate any Tailwind 4 feature behind `@supports` if needed. Add hex fallback for every `oklch()` token. Smoke-test in Safari TP, mobile Safari iOS 17 (TestFlight), and WebKitGTK on Linux if available.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npx playwright test tests/e2e/audit-v2-screenshots-webkit.spec.ts --grep="home"</automated>
    <manual>Open https://future-marketing.ai in Safari Technology Preview. Body background must be `#0a0d14` (theme deep), text must be `#e8ecf4`, NOT Times-New-Roman white-page.</manual>
  </verify>
  <done>WebKit renders site with full theme. CSS parse error gone. 18 percent of EU desktop + 30 percent of EU mobile audience unblocked.</done>
</task>

<task type="auto">
  <name>C2: Add Playwright CI gate asserting WebKit + Firefox theme parity</name>
  <files>fmai-nextjs/tests/e2e/cross-browser-render.spec.ts (new), .github/workflows/playwright.yml (or vercel-build.json)</files>
  <action>
Create `cross-browser-render.spec.ts` that loads home + pricing + apply on WebKit and Firefox at 1440x900, asserts `<body>` computed background equals `rgb(10, 13, 20)` (theme deep), and `<h1>` computed color equals `rgb(232, 236, 244)` (text primary). Fails CI on regression. Add to Vercel preview pipeline gate.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npx playwright test tests/e2e/cross-browser-render.spec.ts --project=webkit --project=firefox</automated>
  </verify>
  <done>CI gates WebKit + Firefox theme rendering. Future regressions block deploys.</done>
</task>

<task type="auto">
  <name>C3: Replace react-cookie-consent with first-party CookieConsentBanner</name>
  <files>fmai-nextjs/src/components/interactive/CookieConsentBanner.tsx (rewrite), fmai-nextjs/src/components/layout/Footer.tsx (add re-open link), fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json, package.json (remove react-cookie-consent)</files>
  <action>
Build first-party bottom-sticky banner with: (1) granular toggles for functional, analytics, marketing categories with three buttons (Alles accepteren, Selectie opslaan, Alles weigeren); (2) WCAG focus-visible ring on all interactive elements; (3) 4.5:1 contrast on weigeren button; (4) footer link "Cookie-instellingen wijzigen" that re-opens banner; (5) link to /legal/cookies; (6) closing the banner sets `cookieConsent` localStorage key with per-category booleans; (7) banner sits in bottom-sheet position to NOT overlay hero CTA on any viewport. Use Phase 11 design-system tokens. Remove react-cookie-consent from package.json.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run build && grep -c "react-cookie-consent" package.json</automated>
    <manual>Visit home in fresh incognito at 360x800, 1440x900, 1920x1080. Banner appears bottom-sheet, does NOT overlap hero. Accept/Reject/Customise all keyboard-focusable. Footer cookie-link re-opens banner after dismiss.</manual>
  </verify>
  <done>First-party banner replaces react-cookie-consent. Granular toggles, focus-visible, AA contrast, re-open from footer. AVG/GDPR-compliant.</done>
</task>

<task type="auto">
  <name>C4: Sweep opacity-modifier text utilities to discrete tokens</name>
  <files>fmai-nextjs/src/app/globals.css, fmai-nextjs/tailwind.config.ts, plus 11 component files matching grep `text-text-muted/` or `text-white/`</files>
  <action>
Add discrete design-system tokens at AA-compliant contrast for the 4 cases that opacity-modifiers currently approximate: `--color-text-quiet` (was `text-text-muted/60`), `--color-text-faint` (was `text-white/40`), `--color-text-on-elevated` (was muted on `bg-elevated`), `--color-text-help` (was xs help-text). Run axe color-contrast rule on lead-qualifier carousel post-sweep. Extend Phase 11-02 contrast math to include `bg-elevated` (`#1a1f2e`).
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run lint && grep -rn "text-text-muted/\|text-white/" src/ | wc -l</automated>
    <manual>Run axe on /skills/lead-qualifier in 3 locales. 0 color-contrast violations.</manual>
  </verify>
  <done>0 opacity-modifier text utilities. 4 new discrete tokens AA-compliant on bg-deep, bg-surface, bg-elevated. Lead-qualifier axe 0 violations.</done>
</task>

<task type="auto">
  <name>C5: Fix empty title on newsletter-confirm (WCAG 2.4.2)</name>
  <files>fmai-nextjs/src/app/[locale]/(marketing)/newsletter/confirm/page.tsx, fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
Add `generateMetadata` export to newsletter-confirm page returning `title` per locale. Test render: title must appear in `<title>` tag in production HTML and in Playwright DOM snapshot. Pair with axe re-run.
  </action>
  <verify>
    <automated>curl -s https://future-marketing.ai/nl/newsletter/confirm | grep -oP "<title>.*</title>"</automated>
  </verify>
  <done>newsletter-confirm renders non-empty title in 3 locales. WCAG 2.4.2 serious violation closed.</done>
</task>

<task type="auto">
  <name>C6: Add focus-visible ring to CTAButton + form inputs</name>
  <files>fmai-nextjs/src/components/ui/CTAButton.tsx, fmai-nextjs/src/components/ui/Input.tsx, fmai-nextjs/src/app/globals.css</files>
  <action>
Add `focus-visible:outline-2 outline-offset-2 outline-accent-system` to CTAButton base. Switch input focus state from 1px border-swap to 2px focus-visible ring. Verify on /apply, /contact, /pricing tier-select CTA. Confirm focus-visible only fires on keyboard nav, not mouse-click (uses `:focus-visible` not `:focus`).
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -c "focus-visible:outline" src/components/ui/CTAButton.tsx</automated>
    <manual>Tab through /apply. Each CTA + input must show a 2px teal outline. Click them with mouse: no outline (correct).</manual>
  </verify>
  <done>CTAButton + Input have focus-visible rings. Keyboard nav clearly visible. Mouse interactions clean.</done>
</task>

<task type="auto">
  <name>C7: Add prefers-reduced-motion guard to GradientMesh + ScrollReveal</name>
  <files>fmai-nextjs/src/components/visual/GradientMesh.tsx, fmai-nextjs/src/components/motion/ScrollReveal.tsx, fmai-nextjs/src/components/visual/HeroSpline.tsx</files>
  <action>
Wrap GradientMesh animation in `useReducedMotion()` (Framer) hook; render static gradient when reduced. ScrollReveal should also short-circuit motion on reduced. HeroSpline should swap to static fallback PNG on reduced-motion. Verify on macOS Safari with Reduce Motion enabled.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -rn "useReducedMotion" src/components/</automated>
  </verify>
  <done>3 motion components respect prefers-reduced-motion. WCAG 2.3.3 closed.</done>
</task>

**Phase C verification:** WebKit + Firefox render site with full theme (CI gate live). Cookie banner does not overlay hero CTA, has granular toggles, re-open, AA contrast. 0 axe color-contrast violations on lead-qualifier. newsletter-confirm has non-empty title. Focus-visible rings on CTA + inputs. prefers-reduced-motion respected on Spline + GradientMesh + ScrollReveal.

## Phase D: Forms + perf measurement infrastructure (Week 7-8)

**Goal:** Restore Lighthouse + CrUX + PSI measurement pipeline, refactor apply form, fix forms friction. Without measurement infrastructure the next phases ship blind. Without form fixes apply conversion stays leaky.

**Findings addressed:** MF-09 (forms friction), 16-05 F4, F5, F11 to F25, 16-08 F4, 16-09 F1, F2, F3, F4, F10, 16-12 F3. Theme clusters TC6 + TC10.

**Estimated effort:** 20 to 28 hours engineering + 4 hours GCP setup.

### Tasks

<task type="auto">
  <name>D1: Pin chalk@4 to fix Lighthouse harness, re-enable lab CWV runs</name>
  <files>fmai-nextjs/package.json, fmai-nextjs/package-lock.json, fmai-nextjs/tests/e2e/audit-v2-lighthouse.spec.ts</files>
  <action>
Add `"chalk": "4.1.2"` to package.json overrides field (or `resolutions` if pnpm). Alternatively upgrade `playwright-lighthouse` to a version that supports chalk@5. Verify by running `npx playwright test tests/e2e/audit-v2-lighthouse.spec.ts --grep="home"` against production URL with mobile profile. Output must land in `test-results/audit-v2/lighthouse/home-mobile.json` with non-zero size.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npx playwright test tests/e2e/audit-v2-lighthouse.spec.ts --grep="home"</automated>
  </verify>
  <done>Lighthouse runs produce JSON output. Lab CWV measurement live.</done>
</task>

<task type="auto">
  <name>D2: Provision GCP project + enable PSI + CrUX APIs + store key</name>
  <files>~/.claude/.env (add GOOGLE_PSI_API_KEY), fmai-nextjs/scripts/measure-crux.mjs (new)</files>
  <action>
Create dedicated GCP project `fmai-perf-tracking`. Enable `pagespeedonline.googleapis.com` and `chromeuxreport.googleapis.com`. Create API key, restrict to those two services. Store as `GOOGLE_PSI_API_KEY` in `~/.claude/.env`. Build `measure-crux.mjs` script that fetches CrUX field data for top 10 routes weekly, writes to `test-results/audit-v2/crux/weekly-{date}.json`.
  </action>
  <verify>
    <automated>powershell -NoProfile -Command "Test-Path '$HOME/.claude/.env' ; (Get-Content $HOME/.claude/.env -Raw) -match 'GOOGLE_PSI_API_KEY'"</automated>
    <manual>Run `node fmai-nextjs/scripts/measure-crux.mjs`. Output JSON contains FCP, LCP, INP, CLS p75 for /nl + /en + /es home.</manual>
  </verify>
  <done>PSI + CrUX APIs reachable. Weekly CWV tracking script live.</done>
</task>

<task type="auto">
  <name>D3: Add web-vitals library + custom endpoint for field-data INP + CLS</name>
  <files>fmai-nextjs/src/app/layout.tsx, fmai-nextjs/src/lib/web-vitals.ts (new), fmai-nextjs/src/app/api/vitals/route.ts (new)</files>
  <action>
Install `web-vitals@4`. Instrument in root layout via `useReportWebVitals` (Next.js 16 built-in) that posts to `/api/vitals` endpoint. Endpoint stores metric, route, locale, viewport, timestamp in Vercel KV or simple log-flush. This captures INP + CLS even before CrUX has 28-day public data per URL.
  </action>
  <verify>
    <automated>cd fmai-nextjs && curl -s -X POST http://localhost:3000/api/vitals -d '{"name":"INP","value":120,"id":"v3-test"}'</automated>
  </verify>
  <done>Per-route web-vitals push live. /api/vitals endpoint receives metrics.</done>
</task>

<task type="auto">
  <name>D4: Refactor apply form to 2-step intake (drop tier-selector from form)</name>
  <files>fmai-nextjs/src/app/[locale]/(marketing)/apply/page.tsx, fmai-nextjs/src/components/apply/ApplyForm.tsx, fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
Step 1 (form): name, email, optional company. Step 2 (Calendly inline): tier-discovery during call, not form. Reframe page H1 to canonical "Plan een gesprek". Drop `workspaces` field from form entirely; collect during Calendly intake. Fix `mapIssueToKey` workspaces case to return `workspacesRequired` if still rendered. Pair with B3 H1-sync.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -c "workspaces" src/components/apply/ApplyForm.tsx</automated>
    <manual>Visit /apply. Form has 3 fields (name, email, company optional). Step 2 shows Calendly inline.</manual>
  </verify>
  <done>Apply form 3 fields. Tier-discovery deferred to Calendly. Conversion-friction drop.</done>
</task>

<task type="auto">
  <name>D5: Add required-markers + form-top help-text</name>
  <files>fmai-nextjs/src/components/ui/Label.tsx, fmai-nextjs/src/components/apply/ApplyForm.tsx, fmai-nextjs/src/components/forms/ContactForm.tsx, fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
Update `Label` component to render visible `*` asterisk in `--color-error` when `required={true}`. Add top-of-form help-text "* verplicht" / "* required" / "* obligatorio". Apply to apply, contact, newsletter forms. Verify aria-required attribute on input.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -c "aria-required" src/components/ui/Label.tsx</automated>
  </verify>
  <done>Required-fields visibly marked + top-of-form note. WCAG 3.3.2 confirmed.</done>
</task>

<task type="auto">
  <name>D6: Defer Spline 3D scene + add static fallback PNG</name>
  <files>fmai-nextjs/src/components/visual/HeroSpline.tsx, fmai-nextjs/public/images/hero-robot-static.png (new asset)</files>
  <action>
Pre-render Spline scene as static PNG at 1440x900, optimise to <50 KB with Sharp. Lazy-import Spline scene with `next/dynamic` + ssr:false + loading=eager-after-idle. Show static PNG as LCP target. Spline component upgrades after `requestIdleCallback`. Skip Spline entirely on prefers-reduced-motion or save-data hint.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm run build && find .next -name "*.splinecode" | xargs -I {} ls -lh {}</automated>
  </verify>
  <done>Spline lazy-deferred. Static PNG LCP. 1.32 MB asset off critical path.</done>
</task>

**Phase D verification:** Lighthouse runs produce JSON. CrUX + PSI return field data. web-vitals pushes per-route INP + CLS. Apply form has 3 fields step 1, Calendly step 2. Required-markers visible. Spline deferred, static PNG LCP. CWV measurable for week 10 baseline reset.

## Phase E: Schema graph + GEO citation + trust signals (Week 9-10)

**Goal:** Lift cross-LLM citation rate from 0/7 to >=4/7 Gemini grounded queries. Build trust cluster above-fold on home + SKC case. Schema additions roughly 4 KB gzipped, well below LCP budget.

**Findings addressed:** MF-07 (GEO citation), MF-10 (trust vacuum), 16-06 F-02, F-03, F-08, F-09, F-11, F-12, F-13, F-14, F-18, F-19, F-20, 16-07 F-01 to F-25, 16-12 F1, F8, F9, F17, F18, F21, 16-13 axis A4, A7, A11, 16-14 F15, F17. Theme clusters TC7 + TC12.

**Estimated effort:** 16 to 24 hours engineering + 4 hours content writing.

### Tasks

<task type="auto">
  <name>E1: Add 6 missing speakable selector classes to home + memory + SKC case</name>
  <files>fmai-nextjs/src/app/[locale]/(marketing)/page.tsx, fmai-nextjs/src/app/[locale]/(marketing)/memory/page.tsx, fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx</files>
  <action>
Add 6 className tokens that already exist in JSON-LD speakable schema but not in rendered DOM: `.speakable-hero` (home H1+sub), `.speakable-tldr` (home value-prop block), `.speakable-memory-def` (memory page first paragraph), `.speakable-memory-layers` (memory layers list), `.speakable-skc-summary` (SKC case intro), `.speakable-skc-outcome` (SKC case quantified outcome). No new components, only className edits.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -rn "speakable-hero\|speakable-tldr\|speakable-memory\|speakable-skc" src/app/</automated>
  </verify>
  <done>6 speakable classNames in production DOM. Schema parses successfully.</done>
</task>

<task type="auto">
  <name>E2: Add WebSite + BreadcrumbList + FAQPage + HowTo @id everywhere</name>
  <files>fmai-nextjs/src/lib/json-ld.ts (new helper) or fmai-nextjs/src/components/seo/JsonLd.tsx</files>
  <action>
Add `@id` to every JSON-LD entity: WebSite (`@id: future-marketing.ai/#website`), Organization (`@id: future-marketing.ai/#org`), BreadcrumbList (`@id: {url}/#breadcrumb`), FAQPage (`@id: {url}/#faq`), HowTo (`@id: {url}/#howto`). Cross-link via `mainEntityOfPage` and `isPartOf`. Verify in Google Rich Results test + schema.org validator.
  </action>
  <verify>
    <automated>curl -s https://future-marketing.ai/nl | grep -c '"@id"'</automated>
  </verify>
  <done>@id on 84 emitted JSON-LD blocks. Schema graph validates.</done>
</task>

<task type="auto">
  <name>E3: Add Wikidata QID + KvK URL to Organization sameAs when verified</name>
  <files>fmai-nextjs/src/components/seo/OrganizationJsonLd.tsx</files>
  <action>
Create Wikidata entry for FutureMarketingAI (manual one-time submission). When QID assigned, add to Organization `sameAs` array along with KvK URL. Verify Gemini grounded citation rate post-deploy (re-run `scripts/audit/measure-llm-citations.mjs`).
  </action>
  <verify>
    <automated>node fmai-nextjs/scripts/audit/measure-llm-citations.mjs --query="Wat is FutureMarketingAI"</automated>
  </verify>
  <done>Wikidata QID + KvK in sameAs. Cross-LLM citation rate measurable.</done>
</task>

<task type="auto">
  <name>E4: Above-fold trust cluster on home (SKC logo + scarcity counter + AVG badge)</name>
  <files>fmai-nextjs/src/app/[locale]/(marketing)/page.tsx, fmai-nextjs/src/components/marketing/TrustClusterHero.tsx (new)</files>
  <action>
Build `TrustClusterHero` component with 3 elements: (1) SKC-as-customer-logo (small monochrome), (2) Founding counter "1 van 10 plekken bezet" promoted to focal size, (3) AVG/GDPR-compliant badge linking to /legal/security. Position between hero H1 and primary CTA. Cialdini C1 reciprocity score lifts from 3 of 24 to >=12 of 24.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -c "TrustClusterHero" src/app/[locale]/(marketing)/page.tsx</automated>
  </verify>
  <done>Trust cluster renders above-fold on home. 3 elements visible.</done>
</task>

<task type="auto">
  <name>E5: 3-metric chip-row under SKC case H1</name>
  <files>fmai-nextjs/src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx, fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
Add 3-chip row directly under SKC case H1: "3 accounts onboarded", "4 brands live in 7 days", "12 skills active". Each chip uses design-system token color. Quantified outcome above-fold per 16-03 F24 fix.
  </action>
  <verify>
    <automated>cd fmai-nextjs && grep -c "case_study_metrics" messages/nl.json</automated>
  </verify>
  <done>SKC case shows quantified outcome above-fold.</done>
</task>

<task type="auto">
  <name>E6: Expand llms-full.txt with HowTo + FAQPage entries</name>
  <files>fmai-nextjs/public/llms-full.txt</files>
  <action>
Add HowTo block for "Hoe start ik met FutureMarketingAI" with step-by-step list of /apply > intake-call > onboarding. Add FAQPage block with top 10 prospect questions sourced from chatbot logs + sales-calls. Re-run `scripts/audit/measure-llm-citations.mjs` post-deploy.
  </action>
  <verify>
    <automated>powershell -NoProfile -Command "(Get-Content 'fmai-nextjs/public/llms-full.txt' -Raw) -match 'HowTo' -and (Get-Content 'fmai-nextjs/public/llms-full.txt' -Raw) -match 'FAQPage'"</automated>
  </verify>
  <done>llms-full.txt expanded. Cross-LLM citation rate re-measured.</done>
</task>

**Phase E verification:** Gemini grounded re-run shows >=4 of 7 queries cite future-marketing.ai. Trust cluster live on home + SKC case. Schema graph validates with @id everywhere. Wikidata QID in sameAs.

## Phase F: CSP nonce + security trust-page + cleanup (Week 11-12)

**Goal:** Land EU buyer-evaluator gradeup via CSP nonce migration, security trust-page, sub-processor list. Cleanup remaining P2/P3 polish.

**Findings addressed:** 16-13 F1 to F8, F11 to F25, 16-14 F15 (security trust-page), MF-07 part F (CSP report-uri). Theme cluster TC11.

**Estimated effort:** 24 to 32 hours engineering + 6 hours legal review.

### Tasks

<task type="auto">
  <name>F1: Add CSP report-uri to surface real-world violations</name>
  <files>fmai-nextjs/next.config.ts</files>
  <action>
Add `report-uri https://future-marketing.ai/api/csp-report` to existing CSP header (without removing unsafe-inline yet). Create `/api/csp-report` endpoint that logs violations to Vercel KV. After 1 week of data, audit which inline scripts are firing in production (Spline, Calendly, Vercel SpeedInsights).
  </action>
  <verify>
    <automated>curl -sI https://future-marketing.ai/ | grep -i "content-security-policy"</automated>
  </verify>
  <done>CSP report-uri live. Violation log collecting.</done>
</task>

<task type="auto">
  <name>F2: Build /legal/security trust-page with DPA + subprocessor list + EU AI Act</name>
  <files>fmai-nextjs/src/app/[locale]/(legal)/legal/security/page.tsx (new), fmai-nextjs/messages/nl.json, fmai-nextjs/messages/en.json, fmai-nextjs/messages/es.json</files>
  <action>
New page /legal/security covering: (1) AVG/GDPR DPA template downloadable PDF, (2) subprocessor list (Vercel, Supabase, Stripe, Calendly, Resend, Sentry), (3) EU AI Act risk classification (low-risk per Article 6), (4) ISO27001 alignment statement, (5) security.txt at /.well-known/security.txt. Link from footer + cookie banner.
  </action>
  <verify>
    <automated>curl -sI https://future-marketing.ai/nl/legal/security | head -1</automated>
  </verify>
  <done>/legal/security live in 3 locales. DPA + sub-processors + EU AI Act + security.txt published.</done>
</task>

<task type="auto">
  <name>F3: Upgrade next@16.1.7 to >=16.2.6 (patched)</name>
  <files>fmai-nextjs/package.json, fmai-nextjs/package-lock.json</files>
  <action>
Bump `next` to latest 16.x patched. Run full Playwright suite. Verify no behaviour regression in image optimization, App Router routing, or `next-intl` integration. Document Phase 11 + Phase 13 dependency-pin notes if applicable.
  </action>
  <verify>
    <automated>cd fmai-nextjs && npm install next@latest && npm run build && npm run lint</automated>
  </verify>
  <done>Next.js upgraded to patched version. Build + lint pass.</done>
</task>

<task type="auto">
  <name>F4: Migrate CSP to nonce + strict-dynamic (post-report-uri audit)</name>
  <files>fmai-nextjs/next.config.ts, fmai-nextjs/src/middleware.ts</files>
  <action>
Generate per-request nonce in middleware, inject into CSP header and into every inline `<script>` and `<style>`. Add strict-dynamic. Remove unsafe-inline. Verify Spline + Calendly + Vercel SpeedInsights still load (their inline injects must read nonce from runtime). Test in 3 browsers.
  </action>
  <verify>
    <automated>curl -sI https://future-marketing.ai/ | grep -i "content-security-policy" | grep "nonce-"</automated>
  </verify>
  <done>CSP nonce + strict-dynamic. unsafe-inline removed. Third-party scripts still work.</done>
</task>

<task type="auto">
  <name>F5: Add SRI hashes to external script + style tags</name>
  <files>fmai-nextjs/src/app/layout.tsx, third-party-script wrappers</files>
  <action>
For every third-party `<script src>` and `<link rel=stylesheet href>` (Calendly, Spline runtime CDN, Vercel SpeedInsights), generate SRI hash and add `integrity` + `crossorigin=anonymous` attributes. Test in 3 browsers.
  </action>
  <verify>
    <automated>curl -s https://future-marketing.ai/nl | grep -c 'integrity="sha384-'</automated>
  </verify>
  <done>External resources protected by SRI. 0 unverified external loads.</done>
</task>

<task type="auto">
  <name>F6: Phase 17 retrospective + roadmap close</name>
  <files>docs/audits/2026-05-18-v2/PHASE-17-RETRO.md (new), .planning/phases/16-design-seo-audit-v2-sota/STATE.md, .planning/ROADMAP.md</files>
  <action>
Write retrospective: which deltas hit week-4/8/12 KPI targets, which slipped, deferred items, lessons for Phase 18+. Update STATE.md + ROADMAP.md. Archive `audit/2026-05-18-v2-sota` branch into main via PR.
  </action>
  <verify>
    <automated>git log --oneline audit/2026-05-18-v2-sota | wc -l</automated>
  </verify>
  <done>Phase 17 closed. Retrospective documented. Branch merged.</done>
</task>

**Phase F verification:** CSP nonce + strict-dynamic live. /legal/security published. Next.js patched. SRI on external resources. Phase 17 retrospective documented.

## Cross-phase dependencies

- Phase A (rendering foundation) blocks every other phase. Without SSR-visible content, fixes ship blind.
- Phase B (content sweep) is independent of A. Can run in parallel during weeks 1 to 2 if writer-resource available.
- Phase C (a11y + WebKit) depends on Phase A for breadcrumb + skill-orphan rendering.
- Phase D (perf measurement) is independent. Can start in parallel with C if a second engineer available.
- Phase E (schema + trust) depends on B (llms.txt clean) + A (speakable selector classNames in rendered DOM).
- Phase F (CSP + security) depends on D (web-vitals endpoint for nonce-readiness) + E (subprocessor list reflects actual surface).

## Out of scope for this fix-plan

- Multi-step apply form with mid-flow value-internalisation (defer to Phase 18 conversion-experiment).
- Server-side ROI calculator (defer, requires sales-data integration).
- Second case-study acquisition (sales-pipeline task, not engineering).
- Translation of Founding-tier copy to non-EU languages (no business case yet).
- Stripe price-ID migration (handled in fma-app SSoT directly).
- Database schema changes for analytics events (handled via Vercel KV first, scaled later).

## Glossary discipline

Per `fmai-nextjs/CLAUDE.md` key-phrase glossary: never "AI tool" (always "AI Marketing Medewerker" or "Clyde"), never "features" (always "vaardigheden"), never "klanten" for agency end-clients (always "merken"), never "unlimited" without qualifier, never "Sign up" (always "Plan een gesprek" or "Apply"). Every task block above honours this; the canonical CTA fix in B3 is the systemic patch.
