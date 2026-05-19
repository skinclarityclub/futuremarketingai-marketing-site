# Website Full Audit — 2026-05-18

> **Baseline SHA**: `722d494` (`feat(assessment): LinkedIn share + dynamic OG result card`)
> **Auditor**: Claude (autonoom per goedgekeurd plan `~/.claude/plans/we-gaan-voor-goal-joyful-parasol.md`)
> **Fix-branch**: `fix/audit-2026-05-18-p0-p1` (4 commits, build groen)

## Executive Summary

De marketing site `future-marketing.ai` is structureel solide na de recente content-upgrade, maar dreef weg van haar eigen SSoT op een aantal kritieke punten. **2 P0-issues** en **6 P1-issues** bevestigd, waarvan **4 direct gefixt** op een gedeelde feature-branch (`fix/audit-2026-05-18-p0-p1`). Het pricing-mirror tussen `fma-app` (SaaS dashboard) en `fmai-nextjs` (marketing) blijkt **100 procent in sync** voor alle workspace-priced tiers en credit-allocaties. De grootste resterende risico's zijn een **E2E test-suite die voor 94 procent rood staat** (133 van 141 tests falen, voornamelijk op verouderde route-assumpties) en **3 coming_soon skill-pages** waar de hero "Binnenkort" zegt maar de body in present tense doorgaat.

### Top 5 bevindingen

1. **P0** — Homepage SERVICE_CARDS toonden Voice Agent en Ad Creator zonder coming_soon-marker en met present-tense copy ("Clyde picks up the phone"). **GEFIXT** in commit `4f965d6`.
2. **P0** — Sitemap miste `/assessment` en `/roadmap`, twee publieke marketing-pages. **GEFIXT** in commit `b627689`.
3. **P1** — Footer linkte naar `/skills/voice-agent` en `/skills/ad-creator` zonder marker. **GEFIXT** in commit `c9e650f`.
4. **P1** — 4 files in de assessment-result flow gebruikten `#a855f7` (deprecated purple). **GEFIXT** in commit `c8270c7`.
5. **P1** — 7 em-dashes (U+2014) in user-facing i18n copy. **GEFIXT** als onderdeel van commit `4f965d6`.

### Niet gefixt in deze sessie (P1, doorgeschoven) — **all closed in follow-up PR**

- ~~**P1** — Coming_soon skill-pages (voice-agent, ad-creator, reel-builder) gebruiken present-tense in features+how-secties.~~ **CLOSED** in `35da360` op `fix/audit-2026-05-18-followup`.
- ~~**P1** — `tests/e2e/conversion-polish.spec.ts` + 132 andere tests falen.~~ **CLOSED** in 8 commits op `fix/audit-2026-05-18-followup` — final pass rate 151/158 (95.6%).
- ~~**P1** — `HeaderClient.tsx` hardcoded `comingSoon: true` ipv. derive uit SSoT.~~ **CLOSED** in `1b7998e`.

All P1/P2/P3 items from this audit are now resolved on branch `fix/audit-2026-05-18-followup`. See [`2026-05-18-website-full-audit-backlog.md`](./2026-05-18-website-full-audit-backlog.md#closed-in-pr-2--2026-05-18-follow-up-branch-fixaudit-2026-05-18-followup) for the full commit-SHA mapping.

## Methode

- **Scope**: `fmai-nextjs/` Next.js 16 marketing site, alle ~32 routes onder `src/app/[locale]/` × 3 locales (NL authoritative, EN, ES). Plus cross-stack consistency met `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` (pricing SSoT).
- **Plan**: 8 blokken in `~/.claude/plans/we-gaan-voor-goal-joyful-parasol.md`.
- **Tools**: 3× parallel Explore agents per cluster (Blok 1, 2, 6). Playwright suites lokaal. Firecrawl-style WebFetch voor productie. Direct Read/Grep/Glob voor static audit.
- **Dev servers**: fmai-nextjs op `http://localhost:3005` (pre-existing dev process PID 37252).
- **Beperkingen**:
  - Lighthouse niet uitgevoerd (geen lokale Chrome-runner in deze sessie); performance-claim uit `audit/05-geo-llm-citation` van 2026-04-24 wordt aangehouden als baseline.
  - Stripe price-ID validation buiten scope (bekend pending per CLAUDE.md).
  - fma-app dashboard niet draaiend; cross-check is source-level via Explore agent.

## Severity Rubriek

| Level | Definitie |
|---|---|
| **P0** | Feitelijk onjuist (false claim), broken build, security/privacy, broken CTA-pad, missing canonical, missing core SEO entry |
| **P1** | UX-misleidend, conventieschending uit CLAUDE.md, falende test-suite, content-drift, SSoT-bypass |
| **P2** | Inconsistentie zonder directe user-impact, optimalisatie |
| **P3** | Cosmetisch, future-proofing, tech-debt notitie |

## P0 Bevindingen

### P0-01 — Homepage SERVICE_CARDS coming_soon ontbreekt — **GEFIXT**

- **Files**: `src/app/[locale]/page.tsx:36-43`, `src/app/[locale]/page.tsx:222-256`, `messages/{nl,en,es}.json` services.voiceAgent/adCreator
- **Bevinding**: `SERVICE_CARDS` toont `voiceAgent` en `adCreator` zonder coming_soon-marker. Copy in messages claimde aanwezige functionaliteit ("Clyde picks up the phone", "Clyde makes static and video ads") terwijl beide skills `status: 'coming_soon'` hebben in SSoT.
- **Evidence**: WebFetch `https://future-marketing.ai/nl` bevestigde "Alle skills worden als beschikbaar gepresenteerd, geen Binnenkort badge."
- **Fix**: commit `4f965d6` — derive `isComingSoon` uit `getSkillBySlug(slug).status`, render orange badge wanneer true, copy in NL/EN/ES geherformuleerd met "Binnenkort:" / "Coming soon:" / "Próximamente:" prefix.

### P0-02 — Sitemap miste publieke marketing-pages — **GEFIXT**

- **File**: `src/app/sitemap.ts:6-33`
- **Bevinding**: `/assessment` (AI Readiness lead-magnet) en `/roadmap` (publiek roadmap-overview) ontbraken in sitemap. SEO-verlies + gemiste discovery via search.
- **Evidence**: WebFetch `https://future-marketing.ai/sitemap.xml` bevestigde dat geen van beide URLs in productie-sitemap stonden.
- **Fix**: commit `b627689` — beide toegevoegd aan `pages` array met `priority: 0.7` (assessment) en `priority: 0.6` (roadmap).

## P1 Bevindingen

### P1-01 — Em-dashes in user-facing copy (7 hits) — **GEFIXT**

- **Files**: `messages/nl.json:2889`, `messages/en.json:2828,2841,2889`, `messages/es.json:2828,2841,2889`
- **Bevinding**: U+2014 em-dash in `assessment.metaTitle` ("{persona} — {total}/100") en in 2 FAQ option-labels (en/es). Schending van CLAUDE.md `no_em_dashes` convention.
- **Fix**: commit `4f965d6` — vervangen door dubbele-punt (`:`) en puntkomma (`;`).

### P1-02 — Deprecated palette `#a855f7` in 4 files — **GEFIXT**

- **Files**: `src/lib/email/assessment-templates.ts:85`, `src/app/api/og/assessment-result/route.tsx:36`, `src/components/assessment/ResultReveal.tsx:43`, `src/app/[locale]/(marketing)/assessment/result/page.tsx:41`
- **Bevinding**: 3-stop operator-gradient `linear-gradient(135deg, #f5a623 0%, #ef4444 60%, #a855f7 100%)` bevat deprecated purple `#a855f7`. CLAUDE.md theme spec: "purple, never in design system."
- **Fix**: commit `c8270c7` — gereduceerd naar 2-stop `linear-gradient(135deg, #f5a623 0%, #ef4444 100%)`. Behoudt warm/operator-feel, palette-conform.

### P1-03 — Footer mist coming_soon markers — **GEFIXT** (deels)

- **File**: `src/components/layout/Footer.tsx:53-76`
- **Bevinding**: Footer linkt naar `/skills/voice-agent` (l.54-59) en `/skills/ad-creator` (l.69-75) zonder markers. Reel Builder ontbreekt volledig in Footer (asymmetrisch).
- **Fix**: commit `c9e650f` — orange badge toegevoegd aan beide links, gebruikt `common.comingSoon` i18n-key (Binnenkort/Coming soon/Próximamente). Reel-builder weglating doorgeschoven als P2 (zie backlog) — keuze: voeg toe vs. haal de twee andere weg, hangt af van content-strategie.

### P1-04 — Conversion-polish test + brede test-suite failure — **NIET GEFIXT** (scope)

- **Files**: `tests/e2e/conversion-polish.spec.ts` + 11 andere specs
- **Bevinding**: 133/141 tests falen. Root causes:
  - **Outdated routes**: `navigation.spec.ts` test `/chatbots`, `/automations`, `/voice-agents`, `/marketing-machine` — geen van deze bestaan na 2026-04-20 content-upgrade.
  - **Outdated structure**: `homepage.spec.ts` verwacht "Services section with 4 cards" — is nu 6.
  - **Selector drift**: `chatbot.spec.ts` zoekt naar floating chat button met selectors die niet meer passen (`guided-demo.spec.ts` idem).
  - **StickyCta**: `conversion-polish.spec.ts:160` verwacht progress-bar onderaan op desktop — afhankelijk van actual render-positie.
- **Aanbeveling**: aparte phase voor test-suite refactor (geen scope in 8u audit).

### P1-05 — Coming_soon skill-pages: present tense in features/how — **NIET GEFIXT** (scope)

- **Files**: `messages/nl.json:968-1001` (voice-agent), `:1277-1309` (ad-creator), `:2501-2534` (reel-builder). Idem in en.json, es.json (parallel structuur).
- **Bevinding**: Hero zegt "Binnenkort beschikbaar" maar features+how secties gebruiken present-tense ("Clyde beantwoordt", "Clyde maakt", "Clyde belt"). Inconsistent met coming_soon-status.
- **Aanbeveling**: copy-rewrite naar future-framing in 3 locales × ~9 keys per skill (27+ keys totaal). Dedicated content-pass.

### P1-06 — `HeaderClient.tsx` hardcoded comingSoon — **NIET GEFIXT** (conflict)

- **File**: `src/components/layout/HeaderClient.tsx:34-77, 308`
- **Bevinding**: `SKILL_CATEGORIES` heeft `comingSoon: true` als hardcoded property op adCreator, reelBuilder, voiceAgent in plaats van derive uit SSoT (`getSkillBySlug(slug).status === 'coming_soon'`). Functioneel correct nu (matches SSoT toevallig), maar SSoT-bypass risico.
- **Reden niet gefixt**: pre-existing brand-werk op `main` heeft `HeaderClient.tsx` al gemodificeerd (logo + brand changes), refactor conflict. Doe in aparte PR na merge brand-werk.

## P2/P3 Bevindingen

Zie backlog: [`2026-05-18-website-full-audit-backlog.md`](./2026-05-18-website-full-audit-backlog.md).

Highlights:
- **P2** — `PricingJsonLd.tsx:67,72,77` hardcoded €499/€399/€299 in description-strings (drift-risico).
- **P2** — Skill-page integrations text refereert naar coming_soon skills zonder marker (lead-qualifier → voice-agent, research → ad-creator, reel-builder → ad-creator).
- **P2** — Case-study `/case-studies/skinclarity-club` heeft geen `Service`/`Review` JsonLd.
- **P2** — Reel Builder ontbreekt in Footer (asymmetrisch met voice-agent + ad-creator).
- **P2** — `SKILL_PACKS` (VOICE_MINUTES, VIDEO_ADS, REELS, BLOG_POWER) gedefinieerd in SSoT maar niet zichtbaar in dashboard `AddonCards.tsx` of marketing-pricing.
- **P3** — `fma-app/src/lib/skills.ts:6-7` header-comment toont verouderde v10.0 prijzen (€2.497/€4.497/€7.997 + Partner €347). Code-prijzen kloppen (€499/€399/€299/€997 workspace-priced), alleen comment is stale.
- **P3** — Dead components: `LogoFMark.tsx`, `LogoKnot.tsx`, `LogoMemoryStack.tsx`, `QuickAnswerBlock.tsx`. Mogelijk archief voor `/logo-lab`.
- **P3** — Legacy domein `futuremarketingai.com` geeft HTTP 000 (DNS down / domein verlopen), niet de in CLAUDE.md beloofde 301-redirect.

## Per-Page Log

| Route | Checked | Coming_soon | Links | Copy | SEO | JsonLd | Issues |
|---|---|---|---|---|---|---|---|
| `/` | ✓ | ❌→✓ (fix) | ✓ | future-fix | ✓ | WebPage+FAQ+Breadcrumb | P0-01 fixed |
| `/pricing` | ✓ | ✓ (matrix badge) | ✓ | ✓ | ✓ | Pricing+Breadcrumb | P2 hardcoded €/desc |
| `/founding-member` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage+Breadcrumb | none |
| `/apply` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage+Breadcrumb | none |
| `/about` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage+Person | none |
| `/how-it-works` | ✓ | n/a | ✓ | ✓ | ✓ | HowTo+Breadcrumb | none |
| `/memory` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage+Breadcrumb | none |
| `/contact` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage+Breadcrumb | none |
| `/assessment` | ✓ | n/a | ✓ | ✓ (em-dash fix) | + sitemap | WebPage | P0-02, P1-01 fixed |
| `/assessment/result` | ✓ | n/a | ✓ | ✓ (em-dash fix) | noindex | WebPage+Breadcrumb | P1-02 fixed |
| `/case-studies/skinclarity-club` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage+Org+Person | P2 missing Service/Review schema |
| `/roadmap` | ✓ | ✓ (per-skill badge) | ✓ | ✓ | + sitemap | WebPage+Breadcrumb | P0-02 fixed |
| `/skills/clyde` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | none |
| `/skills/social-media` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | none |
| `/skills/blog-factory` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | none |
| `/skills/lead-qualifier` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | P2 cross-link to voice-agent w/o marker |
| `/skills/email-management` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | none |
| `/skills/manychat` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | none |
| `/skills/reporting` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | none |
| `/skills/research` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | P2 cross-link to ad-creator w/o marker |
| `/skills/seo-geo` | ✓ | n/a (live) | ✓ | ✓ | ✓ | Service | none |
| `/skills/voice-agent` | ✓ | ✓ hero only | ✓ | ⚠ present tense in body | ✓ | Service | P1-05 |
| `/skills/ad-creator` | ✓ | ✓ hero only | ✓ | ⚠ present tense in body | ✓ | Service | P1-05 |
| `/skills/reel-builder` | ✓ | ✓ hero only | ✓ | ⚠ present tense in body | ✓ | Service | P1-05 + P2 cross-link |
| `/blog` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage+Breadcrumb | none |
| `/blog/[slug]` (sample) | ✓ | n/a | ✓ | ✓ | ✓ | Article | none |
| `/legal` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage+Breadcrumb | none |
| `/legal/privacy` | ✓ | n/a | ✓ | ✓ (`privacy@future-marketing.ai`) | ✓ | WebPage | none |
| `/legal/terms` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage | none |
| `/legal/cookies` | ✓ | n/a | ✓ | ✓ | ✓ | WebPage | none |
| `/newsletter/confirm` | ✓ | n/a | ✓ | ✓ | transactional | n/a | none |
| `/logo-lab` | ✓ | n/a | ✓ | ✓ | `robots: index:false` | n/a | P3 (acceptabel intern) |

**Footer (cross-cutting)**: P1-04 voor coming_soon labels gefixt; reel-builder weglating als P2 backlog.

## Cross-stack Consistentie Matrix

| Aspect | SSoT `fma-app/src/lib/skills.ts` | Marketing mirror | Match? |
|---|---|---|---|
| Growth `pricePerWorkspace` | €499 | €499 (`pricing-data.ts`) | ✓ |
| Professional `pricePerWorkspace` | €399 | €399 | ✓ |
| Enterprise `pricePerWorkspace` | €299 | €299 | ✓ |
| Founding `price` (fixed) | €997 | €997 | ✓ |
| Workspace ranges (2-4 / 5-14 / 15+) | ✓ | ✓ | ✓ |
| Credits per workspace (800) | ✓ | ✓ | ✓ |
| Onboarding fees (€1997/€3997/€5997/€0) | ✓ | ✓ | ✓ |
| Skill count (12) | 12 (9 live + 3 coming_soon) | 12 (9 + 3) | ✓ |
| Coming_soon skill IDs | voiceAgent, adCreator, reelBuilder | voice-agent, ad-creator, reel-builder | ✓ |
| Partner tier (verwijderd) | gone customer-facing, only Stripe SKU stubs | gone | ✓ |
| Credit packs visible (BOOST/SCALE/UNLIMITED) | dashboard `AddonCards.tsx` ✓ | not on marketing pricing | ⚠ P2 |
| Skill packs visible (VOICE_MINUTES/VIDEO_ADS/REELS/BLOG_POWER) | not in `AddonCards.tsx` | not on marketing pricing | ⚠ P2 (defined but invisible) |

**Conclusie**: 100 procent sync op tier-pricing + skill-status. P2 mismatch op skill-packs zichtbaarheid.

## i18n Parity Matrix

| Locale | Top-level keys | Total leaves | Missing vs NL | Extra vs NL | Em-dashes (post-fix) |
|---|---|---|---|---|---|
| NL (source) | 40 | 2305 | — | — | 0 |
| EN | 40 | 2305 | 0 | 0 | 0 |
| ES | 40 | 2305 | 0 | 0 | 0 |

**Conclusie**: perfecte parity. Em-dashes (7 hits) volledig verwijderd in commit `4f965d6`.

## Productie-diff Tabel

| Aspect | Lokaal (post-fix branch) | Productie | Diff |
|---|---|---|---|
| Homepage SERVICE_CARDS coming_soon badge | ✓ (fix) | ❌ ontbreekt | wachten op deploy |
| Homepage copy "picks up the phone" | "Coming soon: ... will pick up" | "picks up" (live) | wachten op deploy |
| Sitemap `/assessment` | ✓ (fix) | ❌ ontbreekt | wachten op deploy |
| Sitemap `/roadmap` | ✓ (fix) | ❌ ontbreekt | wachten op deploy |
| Sitemap `/skills/{email-management, manychat}` | ✓ | ✓ | match |
| Canonical | `future-marketing.ai` | `future-marketing.ai` | ✓ |
| `https://futuremarketingai.com/` redirect | n/a | HTTP 000 (DNS dood / domein verlopen) | ⚠ niet de 301 die CLAUDE.md belooft |
| Operator-gradient `#a855f7` | ✓ (fix removed) | nog aanwezig | wachten op deploy |

## Performance / A11y / SEO Scoreboard

| Categorie | Status | Notitie |
|---|---|---|
| Lighthouse desktop (LCP/CLS/INP) | Niet getest | Geen Chrome runner in deze sessie. Baseline uit `docs/audits/2026-04-24-full-audit/` aangehouden. |
| Bundle-size analysis | Niet getest | `npm run build` slaagt, geen size-budgets gedefinieerd. |
| Image optimization | Spot-checked | Public assets gebruiken `<Image>`; geen >200 KB hits in steekproef. |
| Spline 3D asset | Bekend, home-only | Per `13-01-PLAN.md` al geoptimaliseerd. |
| Accessibility (axe via Playwright) | 4 fails | ARIA homepage, lang=nl, footer aria-label, mobile menu aria-label. Subset van 133 test-failures. |
| Sitemap completeness | ✓ (post-fix) | /assessment + /roadmap toegevoegd. |
| Robots.txt | ✓ | 16 AI-crawlers expliciet allowed, `/api/` + `/_next/` disallowed. |
| Hreflang alternates | ✓ | Per page generated via `generatePageMetadata`. Spot-check op `/`, `/pricing`, `/skills/clyde`. |
| Canonicals | ✓ | Allemaal `https://future-marketing.ai/{locale}/...`. |
| JsonLd | ✓ per page-type | WebPage+Breadcrumb overal, FAQ op home + skill-pages, Service per skill, Person op about+case-study, Article op blog. |
| OG-images | ✓ | Dynamic `/api/og/*` + static `og-image.png`. |
| `/logo-lab` indexability | ✓ | `robots: { index: false, follow: false }` ingesteld in page metadata. |

## Test-suite Status

| Spec | Tests | Passed | Failed |
|---|---|---|---|
| accessibility.spec.ts | 4 | 0 | 4 |
| chatbot.spec.ts | 13 | 0 | 13 |
| conversion-polish.spec.ts | 22 | 0 | 22 |
| demo-full-flow.spec.ts | 5 | 0 | 5 |
| guided-demo.spec.ts | 16 | 0 | 16 |
| homepage.spec.ts | 11 | 0 | 11 |
| i18n.spec.ts | 9 | 0 | 9 |
| logo-visual.spec.ts | 4 | 0 | 4 |
| navigation.spec.ts | 13 | 0 | 13 |
| nl-content-smoke.spec.ts | 17 | 0 | 17 |
| performance.spec.ts | 7 | 0 | 7 |
| seo.spec.ts | 12 | (8 passed elders) | 12 (subset) |
| **Totaal** | ~141 | **8** | **133** |

**Root cause**: tests refereren naar pre-upgrade routes (`/chatbots`, `/automations`, `/voice-agents`, `/marketing-machine`) en oude homepage structuur. CI-vertrouwen is afwezig totdat de suite herschreven wordt.

## Fix-PR's / Commits

Alle commits op branch `fix/audit-2026-05-18-p0-p1`:

| SHA | Type | Scope | Beschrijving |
|---|---|---|---|
| `b627689` | feat | seo | Add `/assessment` and `/roadmap` to sitemap (P0-02) |
| `4f965d6` | content | home, i18n | Coming-soon markers on homepage SERVICE_CARDS + future-tense copy + remove em-dashes (P0-01, P1-01) |
| `c9e650f` | content | footer | Label coming-soon skill links in footer (P1-04) |
| `c8270c7` | fix | palette | Replace deprecated `#a855f7` in operator gradient (P1-02) |

Build is groen na elke commit (`npm run build` → `✓ Compiled successfully`). Pre-existing lint-errors (19 hits) zijn niet uit deze fixes en zijn los gedocumenteerd in backlog.

## Conclusie + Vervolgacties

**Audit conclusie**: site-content is na de 2026-04-20 herpositionering grotendeels in lijn met CLAUDE.md conventies en SSoT. De 4 gefixte items dekken de hoogste user-impact (false claims op homepage, missende SEO-paden, deprecated palette, footer-drift). De resterende P1's vragen om aparte phases:

1. **Test-suite refactor** (P1-04) — herschrijf 12 specs naar nieuwe routes en componenten. Doe als `phase-12 test-suite-reset`.
2. **Coming_soon skill-pages copy** (P1-05) — herschrijf features+how-secties naar future-tense in 3 locales × 3 skills. Schat 1.5 uur copy-pass.
3. **HeaderClient SSoT-derive** (P1-06) — kleine refactor (~30 min) na merge van pre-existing brand-werk dat hetzelfde bestand modificeert.
4. **Legacy domain check** — verifieer of `futuremarketingai.com` DNS-config heractiveerd moet worden (HTTP 000 nu).

**Aanbevolen vervolg-PR**: merge `fix/audit-2026-05-18-p0-p1` na review, plan dan de 3 follow-up phases.
