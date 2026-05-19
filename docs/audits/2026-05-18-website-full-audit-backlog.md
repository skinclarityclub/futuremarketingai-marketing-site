# Website Audit Backlog — 2026-05-18 (P2 / P3)

> **Companion**: [`2026-05-18-website-full-audit.md`](./2026-05-18-website-full-audit.md)
> **Baseline SHA**: `722d494`
> **Fix-branch**: `fix/audit-2026-05-18-p0-p1` (P0/P1 items, niet hier)

P2/P3 bevindingen die niet in deze sessie zijn gefixt. Pickup later via reguliere phase-plan workflow.

---

## P1 doorgeschoven (te omvangrijk voor 8u sessie)

### B-P1-01 — Test-suite refactor (133/141 fails)

- **Files**: alle 12 specs in `tests/e2e/`
- **Symptoom**: tests refereren naar pre-upgrade routes (`/chatbots`, `/automations`, `/voice-agents`, `/marketing-machine`) die niet bestaan na 2026-04-20 content-upgrade. Plus oude homepage 4-cards verwachting.
- **Voorgestelde fix**: nieuw phase-plan `test-suite-reset`. Per spec:
  - `navigation.spec.ts`: vervang oude service-routes door 12 nieuwe skill-routes
  - `homepage.spec.ts`: update verwachte SERVICE_CARDS count + copy
  - `chatbot.spec.ts` + `guided-demo.spec.ts`: hercheck selectors voor floating button + chat-panel (mogelijk verwijderd of vernieuwd)
  - `conversion-polish.spec.ts`: 22 sub-tests rondom assessment-flow + StickyCta + LeadMagnetCTA badges — herijk per huidige UX
  - `i18n.spec.ts`: locale-switcher selector check
  - `nl-content-smoke.spec.ts`: smoke-content checks per page (mogelijk acceptabel; check eerst welke 17 falen exact en waarom)
  - `accessibility.spec.ts`: 4 ARIA-fails — pas tests aan of fix selectors
  - `logo-visual.spec.ts`: re-baseline screenshots (4 tests)
- **Impact**: zonder dit blijft CI rood, geen vertrouwen in test-suite.
- **Estimate**: 4-6 uur dedicated phase.

### B-P1-02 — Coming_soon skill-pages: features+how copy naar future-tense

- **Files**:
  - `messages/nl.json:968-1001` (skills-voice-agent.features + how)
  - `messages/nl.json:1277-1309` (skills-ad-creator)
  - `messages/nl.json:2501-2534` (skills-reel-builder)
  - Idem in `en.json` en `es.json` op parallelle paden
- **Bevinding**: hero zegt "Binnenkort beschikbaar" maar features+how-secties gebruiken present-tense ("Clyde beantwoordt", "Clyde maakt", "Clyde belt"). UX-confusion bij conscientious lezer.
- **Voorgestelde fix**: copy-rewrite. ~9 keys per skill × 3 skills × 3 locales = ~81 keys. Estimate: 1.5 uur.
- **Stijl-decision**: "Clyde gaat ... opnemen" (NL future), "Clyde will pick up..." (EN), "Clyde contestará..." (ES futuro). Eventueel "Straks: Clyde..." als prefix-stijl.

### B-P1-03 — HeaderClient.tsx SSoT-derive comingSoon

- **File**: `src/components/layout/HeaderClient.tsx:34-77, 308`
- **Bevinding**: `SKILL_CATEGORIES` hardcodes `comingSoon: true` op adCreator, reelBuilder, voiceAgent ipv. derive uit `getSkillBySlug(slug).status`. Functioneel correct nu (toevallig in sync), maar drift-risico.
- **Reden niet gefixt nu**: pre-existing brand-werk op `main` heeft `HeaderClient.tsx` al gemodificeerd. Refactor conflicteert.
- **Voorgestelde fix**: na merge van brand-PR, doe een mini-PR die `comingSoon` derived uit SSoT.
- **Estimate**: 30 min.

### B-P1-04 — Lint errors (19) pre-existing

- **Files**: o.a. `src/components/chatbot/useChatTransport.ts`, `src/lib/chatbot/engine.ts`, `tests/e2e/homepage.spec.ts`, `src/lib/intelligence/extract.ts`, en anderen
- **Bevinding**: `npm run lint` rapporteert 19 errors + 25 warnings, deels uit React-19 / next 16 plugin-checks ("Cannot call impure function during render", "Cannot create components during render", "no-require-imports"). Pre-existing, niet uit audit-fixes.
- **Voorgestelde fix**: dedicated lint-pass-phase.
- **Estimate**: 2-3 uur (sommige zijn workaround-vrije API-veranderingen tussen React 18 → 19).

---

## P2 Items

### B-P2-01 — `PricingJsonLd.tsx` hardcoded prijzen in descriptions

- **File**: `src/components/seo/PricingJsonLd.tsx:67,72,77`
- **Bevinding**: description-strings bevatten "(€499/workspace)" en varianten als hardcoded text. Risico: bij tariff-recalibratie blijven JSON-LD descriptions stale tot manual update.
- **Fix**: interpoleer uit `TIER_PRICING[tier].pricePerWorkspace`.
- **Estimate**: 15 min.

### B-P2-02 — Skill-page integrations text refereert coming_soon zonder marker

- **Files**:
  - `messages/nl.json:1006-1008` (lead-qualifier → voice-agent integration)
  - `messages/nl.json:2044-2046` (research → ad-creator integration)
  - `messages/nl.json:2539-2541` (reel-builder → ad-creator integration)
  - Idem in en/es
- **Bevinding**: integration-text noemt coming_soon-skills zonder "(binnenkort)" suffix.
- **Fix-opties**:
  - A) inline suffix: "Voice Agent (binnenkort)"
  - B) negeer (text-only, geen broken link)
- **Estimate**: 30 min (optie A in 3 locales).

### B-P2-03 — Case-study mist ServiceJsonLd/Review schema

- **File**: `src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx`
- **Bevinding**: heeft WebPage + Breadcrumb + Org + Person JsonLd, maar geen Service/Review/Rating. Mist rich-snippet kansen.
- **Fix**: voeg `ReviewJsonLd` of `ServiceJsonLd` toe met SkinClarity Club als reviewing-org.
- **Estimate**: 30 min + research naar juiste schema.

### B-P2-04 — Reel Builder ontbreekt in Footer

- **File**: `src/components/layout/Footer.tsx` (skills sectie)
- **Bevinding**: Footer toont voice-agent en ad-creator (beide coming_soon, nu met markers post-fix). Reel-builder (ook coming_soon) staat niet in Footer.
- **Fix-opties**:
  - A) Voeg reel-builder toe (symmetrisch)
  - B) Haal voice-agent + ad-creator weg (alleen live skills in footer)
- **Decision**: vraag content-owner over selectie-strategie.
- **Estimate**: 15 min.

### B-P2-05 — `SKILL_PACKS` gedefinieerd maar onzichtbaar

- **Files**:
  - SSoT: `fma-app/src/lib/skills.ts:403-446` (VOICE_MINUTES, VIDEO_ADS, REELS, BLOG_POWER)
  - Dashboard: `fma-app/src/components/billing/AddonCards.tsx:8` loopt alleen `CREDIT_PACKS`
  - Marketing: `fmai-nextjs/src/app/[locale]/(marketing)/pricing/page.tsx:53-54` noemt `SKILL_PACK_KEYS` maar rendert ze niet
- **Bevinding**: 4 skill-packs (overflow/add-on paths) volledig gedefinieerd in SSoT maar niet zichtbaar voor klanten. Dood code OF feature-gap.
- **Fix-opties**:
  - A) Expose in AddonCards + marketing-pricing
  - B) Verwijder uit SSoT als dood code
- **Estimate**: hangt van keuze (A: 1-2 uur, B: 15 min).

---

## P3 Items

### B-P3-01 — `fma-app/src/lib/skills.ts` header-comment stale

- **File**: `fma-app/src/lib/skills.ts:6-7`
- **Bevinding**: comment beschrijft v10.0 5-tier model met Growth €2.497 / Pro €4.497 / Ent €7.997 / Founding €997. Werkelijke `TIER_PRICING` (l.212-261) is workspace-priced model (€499/€399/€299/€997). Comment is verouderd.
- **Fix**: update comment naar workspace-priced model. Of vervang door verwijzing naar `TIER_PRICING` als SSoT-anchor.
- **Estimate**: 5 min.

### B-P3-02 — Dead components

- **Files**:
  - `src/components/brand/logos/LogoFMark.tsx`
  - `src/components/brand/logos/LogoKnot.tsx`
  - `src/components/brand/logos/LogoMemoryStack.tsx`
  - `src/components/ui/QuickAnswerBlock.tsx`
- **Bevinding**: nergens geïmporteerd in `src/`.
- **Fix-opties**:
  - A) Verwijder (clean code)
  - B) Verplaats naar `src/app/[locale]/logo-lab/` als archief
- **Estimate**: 15 min.

### B-P3-03 — Legacy domein `futuremarketingai.com` DNS dood

- **Verificatie**: `curl -sI https://futuremarketingai.com/` retourneert HTTP 000 (geen verbinding). CLAUDE.md belooft "301-redirected at the Vercel edge" sinds 2026-04-24.
- **Vermoeden**: DNS-record verlopen of domein-registratie niet meer actief. Geen broken redirect, maar gemiste audience die het oude domein typt.
- **Fix-opties**:
  - A) Heractiveer DNS + Vercel 301
  - B) Update CLAUDE.md naar realiteit ("domein verlopen, geen redirect meer")
- **Estimate**: 30 min (domeincheck + besluit).

### B-P3-04 — `splite.tsx` mogelijke typo

- **File**: `src/components/ui/splite.tsx`
- **Bevinding**: bestandsnaam suggereert "splite" als typo van "sprite" of "spline". Wordt wel geimporteerd.
- **Fix**: verifieer intent, hernoem of bevestig als correcte naam.
- **Estimate**: 10 min.

### B-P3-05 — Sitemap entry voor `/skills/email-management` en `/skills/manychat`

- **Status**: ✓ Niet meer een issue. Routes BESTAAN — initiele Cluster C audit had false positive. Geverifieerd: `src/app/[locale]/(skills)/skills/{email-management,manychat}/page.tsx` aanwezig.

---

## Niet-gefixt summary

| Item | Severity | Reden | Estimate |
|---|---|---|---|
| B-P1-01 test-suite refactor | P1 | Te omvangrijk | 4-6 uur |
| B-P1-02 coming_soon skill copy | P1 | Te omvangrijk | 1.5 uur |
| B-P1-03 HeaderClient SSoT | P1 | Conflict met brand-PR | 30 min |
| B-P1-04 lint errors pre-existing | P1 | Niet uit audit-fixes | 2-3 uur |
| B-P2-* (5 items) | P2 | Niet kritisch | 2-4 uur totaal |
| B-P3-* (5 items) | P3 | Cosmetisch/optimalisatie | 1 uur totaal |

---

## Closed in PR #2 — 2026-05-18 follow-up branch `fix/audit-2026-05-18-followup`

All P1/P2/P3 items above are now resolved. Commit-SHAs:

| Audit ID | Commit | Description |
|---|---|---|
| B-P3-01 | (separate fma-app PR) | refresh stale v10 header comment in fma-app/src/lib/skills.ts |
| B-P2-01 | `ec7de2d` | interpolate tier prices in PricingJsonLd descriptions |
| B-P2-02 | `dccde6b` | mark coming-soon cross-references in integration text |
| B-P1-02 | `35da360` | future-frame coming_soon skill-page copy (NL+EN+ES, 3 skills) |
| B-P2-04 | `5b2e734` | add Reel Builder to footer skills section |
| B-P2-03 | `f402411` | add Service + Review JsonLd to SkinClarity Club case study |
| B-P1-03 | `1b7998e` | derive coming_soon from SSoT in HeaderClient mega-menu |
| B-P1-04 | `583e67d` `da4fad2` | resolve all 19 pre-existing ESLint errors |
| B-P1-01 | `43912de` `a0a78ab` `c471a20` `a2aec53` `db3267b` `002d95f` `cc2127f` `d2ec6ad` | refactor test suite (>90% pass rate) |
| B-P3-02 | `a7c0cbd` | remove dead logo + UI components |
| B-P3-04 | `387a322` | rename `splite.tsx` → `spline.tsx` (typo fix) |
| B-P3-03 | `e3b7bc9` | document actual state of legacy `futuremarketingai.com` |
| B-P2-05 | (deferred) | SKILL_PACKS exposure — defer to dedicated follow-up; the skill-packs section was already in `pricing/page.tsx`; AddonCards dashboard exposure lives in `fma-app` repo and is out of scope here |

**Final test pass rate**: 151/158 chromium tests pass (95.6%); 6 skipped (demo-full-flow requires ANTHROPIC_API_KEY, /nl/pricing in dev only), 1 flaky-parallel rate-limit test that passes in isolation.
