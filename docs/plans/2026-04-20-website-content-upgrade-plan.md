# FutureMarketingAI Website Content Upgrade — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Volledige content-herpositionering van `fmai-nextjs` marketing website naar high-touch AI partnership model, met 12 correcte skills, 5-tier herziene pricing, nieuwe `/memory` USP-page, SKC case via Sindy-testimonial, application-gated CTAs en premium visuele proof per skill.

**Architecture:** Next.js 16 App Router + `next-intl` NL/EN/ES. Behoud van bestaande components (hero/cards/pricing layout) — alleen content-strings (via `messages/{locale}.json`), nieuwe page routes, en skill-matrix data. Screenshots via Playwright + frontend-design skill framing.

**Tech Stack:** Next.js 16, React 19, TypeScript, next-intl 4.8, Tailwind 4, Playwright.

**Design reference:** `docs/plans/2026-04-20-website-content-upgrade-design.md` — approved 2026-04-20.

**Pricing SSoT:** `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` — update in separate spoor (Phase 0.2).

---

## Table of Contents

- [Phase 0: Setup & Preparation](#phase-0-setup--preparation)
- [Phase 1: Foundation Pages](#phase-1-foundation-pages) (Home, Memory, Pricing, Apply)
- [Phase 2: SKC Case Study](#phase-2-skc-case-study)
- [Phase 3: 12 Skill Pages](#phase-3-12-skill-pages)
- [Phase 4: Supporting Pages](#phase-4-supporting-pages) (About, Founding, How-it-works, Contact)
- [Phase 5: Hygiene & i18n](#phase-5-hygiene--i18n) (Legal split, orphan cleanup, hardcoded EN)

---

## Global Conventions

**Working dir for website**: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs`
**Branch strategy**: feature branch per phase: `feature/content-upgrade-phase-{N}-{slug}`
**Commit frequency**: één commit per page completion (niet per step)
**Commit format**: `content(page): <what changed> — <why if non-obvious>`
**i18n flow**: NL-first in `messages/nl.json`, machine-translate + review naar `en.json` en `es.json`
**Build check**: elke phase eindigt met `npm run build` success + `npm run dev` preview check
**Quality gates per page**: zie design doc sectie 7

**Skill counter SSoT**: maak één constant `FOUNDING_SPOTS_TAKEN = 1` + `FOUNDING_SPOTS_TOTAL = 10` in `src/lib/constants.ts`, import overal.

---

## Phase 0: Setup & Preparation

### Task 0.1: Worktree + branch setup

**Files:**
- Nieuwe branch: `feature/content-upgrade`

**Steps:**
1. `cd "C:/Users/daley/Desktop/Futuremarketingai"`
2. `git checkout -b feature/content-upgrade`
3. `cd fmai-nextjs && npm install` (verify deps)
4. `npm run build` (baseline — verify current builds clean)
5. `npm run dev` (verify dev server starts, check http://localhost:3000/nl)
6. Commit: `chore: start content upgrade feature branch`

### Task 0.2: Pricing SSoT sync in fma-app

**Files:**
- Modify: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` (AGENT_TIERS object)
- Create: `C:\Users\daley\Desktop\fma-app\src\lib\skill-caps.ts` (new per-tier caps)
- Modify: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts` (CREDIT_PACKS, add Partner Top-Up)

**Steps:**
1. Read current `AGENT_TIERS` to understand structure
2. Add `PARTNER` tier key with price: 1497 → 347, maxClients: 1, includedCredits: 1000
3. Update existing tiers: Growth price 1497 → 2497, includedCredits 3000 → 4000; Professional 2997 → 4497, 8000 → 12000; Enterprise 4997 → 7997, 20000 → 30000; Founding credits 10000 → 8000, maxClients → unlimited
4. Add `SKILL_CAPS` constant: per-tier per-skill caps (Voice/Video/Reel/ManyChat/Blog) — see design doc pricing tabel
5. Add `PARTNER_TOP_UP` to `CREDIT_PACKS` (500 cr, €39)
6. Add skill-specific packs object: `SKILL_PACKS` with 6 packs (Partner Static Ads, Partner ManyChat, Voice Minutes, Video Ads, Reels, Blog Power)
7. Update `TIER_MAP` to include 'PARTNER' passthrough
8. `npx tsc --noEmit` (verify types)
9. Commit to fma-app: `feat(pricing): v10 tier structure + Partner tier + skill caps`

**Stripe price IDs**: NIET in deze task — user doet Stripe setup apart. Voeg `.env.example` entries toe voor nieuwe price IDs zodat ze zichtbaar zijn.

### Task 0.3: Maak shared constants in website

**Files:**
- Create: `src/lib/constants.ts`
- Create: `src/lib/skills-data.ts` (mirrors fma-app skills.ts voor site)

**Steps:**
1. Create `src/lib/constants.ts` met:
   ```typescript
   export const FOUNDING_SPOTS_TAKEN = 1;
   export const FOUNDING_SPOTS_TOTAL = 10;
   export const MAX_PARTNERS_PER_YEAR = 20;
   ```
2. Create `src/lib/skills-data.ts` met de 12 skills array (mirror van fma-app `SKILLS`):
   - id, name, slug, route (to website `/skills/{slug}`), description, longDescription, features, category, status, creditCostSample, inTier (per-tier availability), tierCaps (per-tier included quantity)
3. Export helper: `getSkillsByCategory()` voor mega-menu
4. `npx tsc --noEmit`
5. Commit: `feat: shared constants + skills data for website`

### Task 0.4: Screenshots workflow setup

**Files:**
- Create: `scripts/capture-screenshots.ts` (Playwright)
- Create: `public/screenshots/skills/` (directory)

**Steps:**
1. Install Playwright if not present: `npm i -D @playwright/test`
2. Create script that launches localhost:3000 of fma-app (requires app running)
3. For each skill page in fma-app, capture screenshot of relevant UI section
4. Post-process via frontend-design skill: add shadows, callouts, device mockup frame (dark theme consistent)
5. Save to `public/screenshots/skills/{skill-slug}/{variant}.png`
6. Document in script header: which fma-app routes must be accessible + have seeded data
7. Commit: `chore: screenshot capture pipeline`

**Note**: Don't run this script yet — app-side data stability required first. Noted as dependency for Phase 3.

### Task 0.5: Remove orphan translation namespaces (upfront cleanup)

**Files:**
- Modify: `messages/nl.json` — remove `automations`, `chatbots` (orphan, niet `skills-chatbot`), `voice-agents`, `marketing-machine`
- Modify: `messages/en.json` — same
- Modify: `messages/es.json` — same

**Steps:**
1. Backup current JSON files: `cp messages/nl.json messages/nl.json.bak` (etc)
2. Grep for any component referencing deze namespaces: `grep -r "useTranslations\('automations'\|'chatbots'\|'voice-agents'\|'marketing-machine'\)" src/`
3. For elke hit: either deprecated component (delete) or refactor to use correct namespace
4. Remove namespace entries from all 3 JSON files
5. `npm run build` — must pass
6. Commit: `chore(i18n): remove 4 orphan translation namespaces (~600 regels × 3 locales)`

---

## Phase 1: Foundation Pages

**Blocking**: all subsequent phases depend on home + messaging framework consistency.

### Task 1.1: Update home hero

**Files:**
- Modify: `messages/nl.json` (namespace `home`)
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/components/hero/*` (relevant hero components)

**Steps:**
1. Update `home.hero.*` keys in nl.json per design doc sectie 3 hero copy:
   - badge: "Jouw AI Marketing Medewerker met lange-termijn geheugen — {taken} van {total} founding plekken bezet"
   - headline_main: "Maak kennis met Clyde."
   - headline_accent: "Jouw AI Marketing Medewerker."
   - subtitle: "Clyde onthoudt elke klant, leert van elke campagne, en runt twaalf vaardigheden autonoom — social, blogs, voice, ads, SEO en analytics. Eén AI-medewerker voor jouw hele klantportfolio."
   - cta_primary: "Plan een gesprek" (links naar /apply — maar apply bestaat nog niet, temporarily `/contact`)
   - cta_secondary: "Ontmoet Clyde" (links naar `/skills/clyde`)
2. Use `t('home.hero.badge', { taken: FOUNDING_SPOTS_TAKEN, total: FOUNDING_SPOTS_TOTAL })`
3. Page component: verify hero renders new copy correctly
4. Browser check at http://localhost:3000/nl
5. Commit: `content(home): hero copy — memory USP + founding counter`

### Task 1.2: Update home stats bar (4 tegels)

**Files:**
- Modify: `messages/nl.json` (home.stats.*)
- Modify: relevant stats component in `src/components/`

**Steps:**
1. Replace tegels 1-4 per design doc:
   - Tegel 1: "3 accounts × 4 merken autonoom" — label "SkinClarity Club"
   - Tegel 2: "12" — label "Gespecialiseerde vaardigheden"
   - Tegel 3: "Persistent" — label "Geheugen per klant"
   - Tegel 4: "Max 20" — label "Plekken per jaar"
2. Remove "160+ content/maand", "<2min", "99,9%", "200+ integraties" strings from json
3. Visual check
4. Commit: `content(home): stats tegels — concrete proof ipv loze claims`

### Task 1.3: Update "Waarom bureaus Clyde inhuren" (4 cards)

**Files:**
- Modify: `messages/nl.json` (home.why.*)

**Steps:**
1. Card 1: **Memory-focused** (vervangt "Altijd aan"): "Clyde onthoudt alles" — "Persistent geheugen per klant. Clyde bestudeert merkstem, doelgroep en prestatiegeschiedenis — elke week scherper, per merk geïsoleerd."
2. Card 2: **Partnership** (vervangt "Leert continu"): "AI partner, geen platform" — "Max 20 bureaus per jaar. Persoonlijke onboarding door Daley. Geen self-service — elke klant is een partnership."
3. Card 3: **Scope** (vervangt "Beheert alle klanten"): "Clyde schaalt met jouw portfolio" — "SkinClarity draait al 3 Instagram-accounts × 4 merken × meerdere content-types autonoom. Wat je klantportfolio ook is, Clyde past zich aan."
4. Card 4: **EU-native** (vervangt "Enterprise AI Backbone"): "EU-native, zero lock-in" — "Self-hosted infrastructuur op Europese servers. AVG + EU AI Act ready. Je data blijft van jou."
5. Commit: `content(home): why-cards — memory/partnership/scope/EU ipv generiek`

### Task 1.4: Add hybride ICP sectie

**Files:**
- Create nieuwe sectie in `src/app/[locale]/page.tsx` OF nieuwe component `src/components/home/icp-section.tsx`
- Add translation keys `home.icp.*`

**Steps:**
1. Design component met 2 kolommen: "Voor wie werkt dit" (positief, 4 bullets) + "Waarschijnlijk niet de juiste match als" (negatief, 4 bullets)
2. Copy uit design doc sectie 3
3. Styling: glassmorphism cards, consistent met bestaande home
4. Commit: `feat(home): hybrid ICP section — "voor wie werkt / niet werkt"`

### Task 1.5: Update home FAQ

**Files:**
- Modify: `messages/nl.json` (home.faq.*)

**Steps:**
1. Vervang huidige 5 FAQ items met nieuwe set (design doc principles):
   - Q1: "Hoe verschilt Clyde van ChatGPT of Jasper?" → memory + multi-skill + per-klant context
   - Q2: "Wat als ik wil opzeggen?" → zero lock-in, data exporteerbaar, 30d export
   - Q3: "Waarom een application-gate?" → high-touch partnership, selectie beide kanten
   - Q4: "Hoeveel vaardigheden precies?" → 12 (9 live + 3 coming_soon), consistent overal
   - Q5: "Waarom werkt dit voor bureaus beter dan losse tools?" → één brein, gedeeld geheugen, cross-skill learning
2. Commit: `content(home): FAQ — skill-count + partnership framing`

### Task 1.6: Update home final CTA + trust-strip

**Files:**
- Modify: `messages/nl.json` (home.final_cta, home.trust_strip)
- Modify: page.tsx trust-strip sectie

**Steps:**
1. Final CTA: "Klaar om kennis te maken met Clyde?" + subtitle verwijst naar `/apply`
2. Trust-strip sectie: "Gebouwd met en voor Nederlandse bureaus en merken" + mini-case link → `/case-studies/skinclarity-club` (page nog niet live, leave `href="#"` placeholder, wire up na Phase 2)
3. Commit: `content(home): final CTA + trust-strip placeholder`

### Task 1.7: Translate home NL → EN + ES

**Files:**
- Modify: `messages/en.json` (all home.* keys)
- Modify: `messages/es.json` (all home.* keys)

**Steps:**
1. Translate NL-first copy (Claude NL → machine-vertaal + scherp review-pass)
2. Let op: "AI Marketing Medewerker" → "AI Marketing Employee" / "Empleado de Marketing con IA"
3. "vaardigheden" → "skills" / "habilidades"
4. Preserve i18n variables `{taken}` / `{total}`
5. Browser check /en en /es
6. Commit: `content(home): EN + ES translations`

### Task 1.8: Create `/memory` page

**Files:**
- Create: `src/app/[locale]/(marketing)/memory/page.tsx`
- Create: `messages/nl.json` namespace `memory`
- Create optional: `src/components/memory/memory-layers-diagram.tsx` (visual)

**Steps:**
1. Route structuur: `src/app/[locale]/(marketing)/memory/page.tsx`
2. Hero sectie: "Clyde onthoudt alles — per klant, voor altijd"
3. Content sections per design doc sectie 5 `/memory`:
   - 4-laags diagram (HOT/WARM/COLD/CONTEXT) — eerst placeholder image/SVG, later verfijnen via frontend-design skill
   - Per-client isolation uitleg
   - Decay + dream consolidation
   - Week 1 vs Week 12 voorbeeld (kan met side-by-side styled card)
   - Contrast met ChatGPT/Jasper
7. CTA → /apply
8. Translate NL → EN + ES
9. Metadata: title, description, OG image
10. Browser check
11. Commit: `feat(memory): new /memory USP page — 4-layer memory system`

### Task 1.9: Update `/pricing` page — tier data + matrix

**Files:**
- Modify: `messages/nl.json` (pricing.* namespace)
- Modify: `src/app/[locale]/(marketing)/pricing/page.tsx`
- Create: `src/components/pricing/skills-tier-matrix.tsx`
- Create: `src/components/pricing/skill-packs.tsx`

**Steps:**
1. Update hero: "Premium partnerships. 5 tiers. Transparant." + counter component
2. Add Partner tier card (nieuw, most prominent als entry)
3. Update 4 existing tier cards met nieuwe prijzen/credits/skills uit design doc sectie 4
4. Add Skills × Tier matrix component (12 rows × 5 cols, tooltip op caps)
5. Add Credit packs sectie (4 packs incl. Partner Top-Up)
6. Add Skill-specific packs sectie (6 packs)
7. Remove "alle 11 skills" FAQ, add nieuwe FAQ items rond skill-gating + credits
8. Add "Waarom prijzen zichtbaar" mini-sectie
9. All CTAs → /apply
10. Commit: `feat(pricing): v10 5-tier structure + skills matrix + add-on packs`

### Task 1.10: Translate pricing NL → EN + ES

**Files:**
- Modify: `messages/en.json` (pricing.*)
- Modify: `messages/es.json` (pricing.*)

**Steps:**
1. Translate + review (Spaans extra zorg — lokale prijsformatering '€1.497' vs '$1,497' check)
2. Commit: `content(pricing): EN + ES translations`

### Task 1.11: Create `/apply` page

**Files:**
- Create: `src/app/[locale]/(marketing)/apply/page.tsx`
- Create: `src/components/apply/application-form.tsx`
- Create: API route `src/app/api/apply/route.ts` (POST, stores to DB or emails)
- Modify: `messages/{nl,en,es}.json` (apply.*)

**Steps:**
1. Page layout met hero + form
2. Form fields: naam, bureau, rol, jaaromzet (select), aantal klanten (select), welk pakket (select 5 tiers), urgentste probleem (textarea)
3. Client-side Zod validatie
4. API route: email via Resend OR write naar Supabase (TBD — check met user, for now use simple email fallback to hello@futuremarketingai.com)
5. Success state: "We reageren binnen 3 werkdagen"
6. Honeypot anti-spam field
7. Commit: `feat(apply): new application page + form`

### Task 1.12: Wire CTAs globally naar /apply

**Files:**
- Grep + replace across `src/` for old CTA hrefs
- Modify: header "Meet Clyde" button → "Apply"
- Modify: all BookingCTA / CTAButton instances met generic "Plan een Strategiegesprek"

**Steps:**
1. Search all "/contact" CTAs die eigenlijk naar "/apply" moeten
2. Replace header nav + footer nav CTAs (i18n)
3. Replace all skill page CTAs (placeholder — will re-check in Phase 3)
4. Verify /contact blijft bestaan voor secundair contact
5. Commit: `feat(cta): route primary CTAs naar /apply (application-gated)`

### Task 1.13: Phase 1 quality gate

**Steps:**
1. `npm run build` — must pass
2. `npm run dev` — manual check:
   - /nl/ renders nieuwe hero, stats, why-cards, ICP, FAQ
   - /nl/memory renders (alle secties)
   - /nl/pricing renders 5 tiers + matrix + packs
   - /nl/apply renders form
   - CTAs leiden naar /apply
   - Counter `1/10` zichtbaar op home + pricing + founding-member
3. Check /en and /es briefly
4. Grep check: `grep -r "alle 11" messages/` → 0 results
5. Grep check: `grep -r "NVIDIA NemoClaw" .` → 0 results
6. Grep check: `grep -r "200+ integraties\|200+ Integraties" messages/` → 0 results
7. Commit: `test(phase-1): foundation pages build + quality gates passed`
8. Push branch: `git push -u origin feature/content-upgrade`

---

## Phase 2: SKC Case Study

### Task 2.1: Create `/case-studies/skinclarity-club` route

**Files:**
- Create: `src/app/[locale]/(marketing)/case-studies/skinclarity-club/page.tsx`
- Create: `messages/{nl,en,es}.json` namespace `case_studies.skc`
- Create folder: `public/case-studies/skc/` (for logos + visuals)

**Steps:**
1. Page hero: SKC logo (place in public folder) + headline: "3 accounts. 4 merken. Eén AI-medewerker."
2. Subtitle: korte samenvatting
3. Setup sectie: drie accounts visueel (@SkinClarityClub 50%, @Sindy_Huidtherapeut 30%, @SkinClarity_Shop 20%)
4. Active skills sectie: welke 6 van de 12 Clyde-vaardigheden actief voor SKC (Social Media, Blog Factory, SEO/GEO, Reporting, Research, Clyde orchestrator)
5. Content types: carrousels, posts, stories, blog articles, SEO tracking, shop analytics
6. Architecture diagram (placeholder, verfijnen via frontend-design skill)
7. Timeline (week 1 → nu, highlights)
8. Sindy testimonial quote (exact uit design doc, Sindy als founder)
9. CTA → /apply
10. Metadata + OG
11. Commit: `feat(case-studies): SKC case study page — Sindy as operator`

### Task 2.2: Update home trust-strip en `/skills/social-media` etc. proof links

**Files:**
- Modify: `src/app/[locale]/page.tsx` — wire trust-strip link naar SKC case
- Find existing skill pages die chatbots orphan namespace "SkinClarity Club draait..." claim gebruiken → vervang door link naar case

**Steps:**
1. Trust-strip home: active link → `/case-studies/skinclarity-club`
2. Commit: `feat(home): wire trust-strip naar SKC case study`

### Task 2.3: Translate SKC case NL → EN + ES

**Steps:**
1. Standard translate + review
2. Sindy quote: authentieke NL behoud — EN kan vertalen, Spaans ook
3. Commit: `content(case-studies): EN + ES translations`

### Task 2.4: Phase 2 quality gate

**Steps:**
1. `npm run build`
2. Browser: /nl/case-studies/skinclarity-club renders
3. Home trust-strip click → leidt naar case
4. Check metadata (OG image preview via Twitter card validator)
5. Commit: `test(phase-2): SKC case study passed`

---

## Phase 3: 12 Skill Pages

**Dependency**: screenshots vereisen fma-app pagina's productie-stabiel. Voor Phase 3 start: verifieer welke fma-app pages ready zijn via testing-playbook skill.

**Pattern**: alle 12 skills delen template structuur (design doc sectie 5). Per skill één task-cluster, één commit.

### Task 3.0: Skill template component

**Files:**
- Create: `src/components/skills/skill-page-template.tsx`
- Update: bestaande skill page files om template te gebruiken

**Steps:**
1. Template props: hero props, features (4), steps (3), integrations (list), useCases, creditAllocation (per tier), proofScreenshots (optional), proofDemo (optional slot), finalCTA
2. Sections zoals design doc sectie 5: Hero → 4 features → 3 steps → Integrations → Use cases → Credit allocation → Visual proof → CTA
3. Commit: `feat(skills): skill page template component`

### Task 3.1: `/skills/social-media` herschrijven

**Files:**
- Modify: `src/app/[locale]/(skills)/skills/social-media/page.tsx`
- Modify: `messages/{nl,en,es}.json` (skills-social-media.*)

**Steps:**
1. Hero: "Clyde runt jouw social media" — bestaande claim herformuleren met library-data
2. 4 features: match met SKILLS.socialMedia.features uit fma-app (multi-platform scheduling, carousel builder, hashtag research, engagement tracking)
3. 3 stappen: huidig OK, verifieer met design doc
4. Integrations: wijst naar Blog Factory + Reporting + Intelligence (memory-connected)
5. Credit allocation: 2 cr/post, Partner X/mo incl, Growth Y/mo, Pro Z/mo
6. Proof: screenshot (placeholder), output sample (SKC caption example — brand-blurrend indien nodig)
7. CTA → /apply
8. Commit: `content(skills/social-media): rewrite met library-data + proof`

### Task 3.2: `/skills/voice-agent` herschrijven

(Same pattern: hero, 4 features, 3 steps, integrations, use cases, credit allocation, proof. Behoud VoiceDemoSection — al ingebouwde Laag 3 demo.)

**Commit**: `content(skills/voice-agent): rewrite + keep interactive demo`

### Task 3.3: `/skills/lead-qualifier` herschrijven + chatbot merge

**Files:**
- Modify: `src/app/[locale]/(skills)/skills/lead-qualifier/page.tsx`
- Delete: `src/app/[locale]/(skills)/skills/chatbot/page.tsx`
- Add redirect: `/skills/chatbot` → `/skills/lead-qualifier`

**Steps:**
1. Merge DemoPlayground + MultiPlatformShowcase naar lead-qualifier page
2. Content update per design doc
3. Create redirect via `next.config.ts` of middleware
4. Commit: `content(skills/lead-qualifier): merge chatbot + rewrite`

### Task 3.4: `/skills/email-management` herschrijven (scope fix)

**Files:**
- Rename folder: `src/app/[locale]/(skills)/skills/email` → `src/app/[locale]/(skills)/skills/email-management`
- Add redirect `/skills/email` → `/skills/email-management`
- Modify: `messages/{nl,en,es}.json` (key `skills-email` → `skills-email-management`)

**Steps:**
1. Rewrite content: **Gmail classify** ipv "email campaigns" (scope-fix!)
2. 4 features match met SKILLS.emailManagement: inbox classify, smart labels, daily digest, suggested replies
3. Coming_soon label (is coming_soon in library)
4. Commit: `content(skills/email-management): scope fix — Gmail classify niet campaigns`

### Task 3.5: `/skills/ad-creator` update (breed video + static)

**Files:**
- Modify: `src/app/[locale]/(skills)/skills/ad-creator/page.tsx`
- Modify: `messages/{nl,en,es}.json`

**Steps:**
1. Split static vs video prominente uitleg
2. Credit costs: 10 cr static, 20 cr video, caps per tier
3. Meta Ads integration
4. Commit: `content(skills/ad-creator): static + video uitleg + caps`

### Task 3.6: `/skills/reporting` herschrijven

(Standard rewrite per template.)
**Commit**: `content(skills/reporting): rewrite template-based`

### Task 3.7: `/skills/content-creator` → redirect naar social-media

**Files:**
- Delete: `src/app/[locale]/(skills)/skills/content-creator/page.tsx`
- Add redirect

**Steps:**
1. 301 redirect `/skills/content-creator` → `/skills/social-media`
2. Remove translation keys
3. Commit: `chore(skills): deprecate content-creator — geen library-skill`

### Task 3.8: Create `/skills/research` (NEW)

**Files:**
- Create: `src/app/[locale]/(skills)/skills/research/page.tsx`
- Create: `messages/{nl,en,es}.json` (skills-research.*)

**Steps:**
1. Content per SKILLS.intelligence definition (research + trend monitoring + competitive analysis)
2. Credit costs: 3 cr/query, caps per tier
3. Commit: `feat(skills/research): new page — market research skill`

### Task 3.9: Create `/skills/blog-factory` (NEW)

**Files:**
- Create: `src/app/[locale]/(skills)/skills/blog-factory/page.tsx`
- Create translation keys

**Steps:**
1. Content per SKILLS.blogFactory (SEO keyword research, longform 1500-3000 woorden, auto-publish)
2. 15 cr/article, tier caps
3. Status: live (maar met "kwaliteit wordt continu verbeterd" disclaimer gezien known issues)
4. Commit: `feat(skills/blog-factory): new page — longform SEO content skill`

### Task 3.10: Create `/skills/seo-geo` (NEW — key USP)

**Files:**
- Create: `src/app/[locale]/(skills)/skills/seo-geo/page.tsx`
- Create translation keys

**Steps:**
1. Content per SKILLS.seoAnalyst — SEO audits + keyword tracking + **Core Web Vitals** + **AI citation monitoring (GEO)**
2. **GEO as USP highlight** — monitoring of je merk geciteerd wordt door ChatGPT/Perplexity/Google AI Overviews
3. Credit costs: 5 cr/audit, 3 cr/report
4. Commit: `feat(skills/seo-geo): new page met AI citation monitoring USP`

### Task 3.11: Create `/skills/clyde` (NEW — orchestrator skill)

**Files:**
- Create: `src/app/[locale]/(skills)/skills/clyde/page.tsx`
- Create translation keys

**Steps:**
1. Clyde as skill (orchestrator van alle andere)
2. 4 features: natural language opdrachten, skill routing, multi-channel (chat/Telegram/Slack), memory per klant
3. Credit costs: 1-5 cr/chat (Haiku/Sonnet/Opus)
4. "Meet Clyde" secondary CTA van hero leidt hierheen
5. Commit: `feat(skills/clyde): new orchestrator skill page`

### Task 3.12: Create `/skills/manychat` (coming_soon)

**Files:**
- Create: `src/app/[locale]/(skills)/skills/manychat/page.tsx`
- Translation keys

**Steps:**
1. Content per SKILLS.manychatDm
2. Prominent "Coming Soon" label en "join waitlist" state (link naar /apply)
3. Status-aware rendering — verbergen uit production build? Of toon met disabled CTA? → toon met coming_soon badge
4. Commit: `feat(skills/manychat): new page — coming soon`

### Task 3.13: Create `/skills/reel-builder` (coming_soon)

(Same pattern als manychat — coming_soon label, disabled CTA.)
**Commit**: `feat(skills/reel-builder): new page — coming soon`

### Task 3.14: Update mega-menu header nav met 12 skills

**Files:**
- Modify: `src/components/layout/HeaderClient.tsx` (NB: hardcoded English!)
- Modify: `messages/{nl,en,es}.json` add `nav.*` keys

**Steps:**
1. Refactor header nav copy van hardcoded naar i18n (`useTranslations('nav')`)
2. Implement 3x4 mega-menu per design doc sectie 2:
   - Create & Publish: Social Media / Blog Factory / Ad Creator / Reel Builder
   - Engage & Convert: Voice Agent / Lead Qualifier / Email Management / ManyChat DM
   - Grow & Optimize: Reporting / SEO/GEO Analyst / Research / Clyde AI Employee
3. Add nav items: Memory + Case Studies (nieuw), plus bestaande Pricing / About
4. Replace "Meet Clyde" primary CTA → "Apply"
5. Featured banner in mega-menu: "Nieuw: Memory System → /memory"
6. Commit: `feat(nav): 3x4 mega-menu + i18n + /memory + /apply`

### Task 3.15: Screenshots capture (blocker resolve)

**Steps:**
1. Verify fma-app pages accessible voor screenshots:
   - /content-engine/content (social-media skill)
   - /analytics/social (reporting)
   - /intelligence/overview (research)
   - /blog-factory (blog factory)
   - /lead-qualifier/chatbots (lead qualifier)
   - /voice-agent/agents (voice agent)
   - /ad-creator/library (ad creator)
   - /seo (seo-geo)
   - /ai-copilot (clyde)
2. Run `scripts/capture-screenshots.ts`
3. Apply premium framing via frontend-design skill (invoke it in this task)
4. Save to `public/screenshots/skills/{slug}/`
5. Wire up in skill pages (replace placeholder paths)
6. Commit: `chore(screenshots): premium framed captures for 9 live skills`

### Task 3.16: Translate alle skill pages NL → EN + ES

**Steps:**
1. Batch translate 12 skill pages
2. Commit per 4 skills om reviewable te houden
3. Finale commit: `content(skills): EN + ES translations for all 12 pages`

### Task 3.17: Phase 3 quality gate

**Steps:**
1. `npm run build`
2. Browser check all 12 /skills/* routes
3. Verify 301 redirects: /skills/content-creator → /skills/social-media, /skills/chatbot → /skills/lead-qualifier, /skills/email → /skills/email-management
4. Mega-menu shows 12 skills in 3 categorieën
5. Coming-soon labels zichtbaar op ManyChat + Reel Builder + Email Management
6. Screenshots laden
7. Commit: `test(phase-3): 12 skill pages passed`

---

## Phase 4: Supporting Pages

### Task 4.1: Update `/how-it-works` — 5 stappen

**Files:**
- Modify: `src/app/[locale]/(marketing)/how-it-works/page.tsx`
- Modify: `messages/{nl,en,es}.json` (how-it-works.*)

**Steps:**
1. Update to 5 stappen per design doc sectie 5
2. Remove hardcoded English `HowToJsonLd` → i18n
3. Loop indicator: "Continue verbetering — Clyde wordt elke week beter per klant"
4. CTA → /apply
5. Commit: `content(how-it-works): 5 stappen + i18n JsonLd`

### Task 4.2: Update `/about` — ICP + infra + capaciteit

**Files:**
- Modify: `src/app/[locale]/(marketing)/about/page.tsx`
- Modify: `messages/{nl,en,es}.json` (about.*)

**Steps:**
1. Behoud timeline + mission
2. Add: hybride ICP sectie (zelfde copy als home maar prominenter)
3. Add: "Onze infrastructuur" sectie — self-hosted n8n / Supabase EU / Hetzner / EU-first / zero lock-in (gefeit, geen ideologie)
4. Add: "Capaciteit & transparantie" — 20 plekken/jaar uitleg, `FOUNDING_SPOTS_TAKEN` counter
5. Add: founder bio Daley (kort, eigenaar-stem)
6. Commit: `content(about): ICP + infra + capacity — premium partnership framing`

### Task 4.3: Update `/founding-member`

**Files:**
- Modify: `src/app/[locale]/(marketing)/founding-member/page.tsx`
- Modify: `messages/{nl,en,es}.json` (founding-member.*)

**Steps:**
1. Single pool 10 plekken @ €997 levenslang (niet split, per design doc)
2. Counter sync via shared constants
3. Skills naar 12 + caps match Pro-level (zie design doc pricing tabel)
4. Remove anonieme social proof, replace with link naar SKC case
5. CTA → /apply
6. Commit: `content(founding-member): single pool + counter sync + SKC proof`

### Task 4.4: Update `/contact` (minor)

**Files:**
- Modify: `messages/{nl,en,es}.json` (contact.*)

**Steps:**
1. Copy update: "Directe contact — voor partnership-aanvragen zie /apply"
2. Form blijft werken voor generieke inquiries
3. Commit: `content(contact): secundaire rol naast /apply`

### Task 4.5: Phase 4 quality gate

**Steps:**
1. Build + dev check all 4 pages
2. Verify counter consistency across home / pricing / founding / about
3. Translations NL/EN/ES aligned
4. Commit: `test(phase-4): supporting pages passed`

---

## Phase 5: Hygiene & i18n

### Task 5.1: Legal split

**Files:**
- Create: `src/app/[locale]/(legal)/legal/privacy/page.tsx`
- Create: `src/app/[locale]/(legal)/legal/terms/page.tsx`
- Create: `src/app/[locale]/(legal)/legal/cookies/page.tsx`
- Delete (or keep as 301-redirect): `src/app/[locale]/(legal)/legal/page.tsx`
- Modify: `messages/{nl,en,es}.json` — split legal namespace in privacy/terms/cookies

**Steps:**
1. Split huidige `legal.*` namespace in 3 (`privacy.*`, `terms.*`, `cookies.*`)
2. Update content: skill-count 12, nieuwe prijzen/tiers, eventueel extra sub-processors
3. Footer links: 3 separate href targets
4. 301 redirect `/legal` → `/legal/terms` (with anchors naar privacy/cookies)
5. Commit: `feat(legal): split privacy/terms/cookies — 3 separate pages`

### Task 5.2: i18n hygiene — resterende hardcoded English

**Files:**
- Grep across `src/` for hardcoded English strings
- Modify: multiple files om useTranslations toe te passen

**Steps:**
1. Grep: `grep -rn "\"Book a Strategy Call\"\|\"Meet Clyde\"\|\"Sign up\"\|\"Login\"\|\"No posts found\"" src/`
2. Voor elke hit: move to translations + gebruik `t()`
3. Vision Timeline hardcoded English copy → i18n
4. Blog index strings → i18n
5. Commit: `chore(i18n): remove hardcoded English — full locale coverage`

### Task 5.3: Fix "Enterprise AI Backbone" button mislabel

**Files:**
- Modify: home page.tsx CTAButton usage

**Steps:**
1. Locate de mislabeled button (gebruikt `trust.trialTitle` key)
2. Fix key reference OR relabel button text consistently
3. Commit: `fix(home): Enterprise AI Backbone button label`

### Task 5.4: i18n EN/ES audit-pass

**Files:**
- `messages/en.json`, `messages/es.json`

**Steps:**
1. Run `diff <(jq -S 'paths | @tsv' messages/nl.json) <(jq -S 'paths | @tsv' messages/en.json)` — keys alignment check
2. Same voor ES
3. Fix missing keys (copy NL as placeholder if niet-vertaald)
4. Quality check Spanish: oude typo's (missende accenten, 'quot' escapes) corrigeren
5. Commit: `content(i18n): NL/EN/ES key alignment + ES typo fixes`

### Task 5.5: Verify Stripe price IDs env file

**Files:**
- Modify: `.env.example`

**Steps:**
1. Add all 5 new STRIPE_PRICE_* env vars voor tiers + onboarding + packs
2. Update README met setup note
3. Commit: `chore(env): new Stripe price IDs in .env.example`

### Task 5.6: Phase 5 quality gate + final build

**Steps:**
1. `npm run build` — must pass with no warnings
2. Full site navigation via dev server:
   - Home → memory → pricing → apply → case-studies/skc → skills/* (all 12) → how-it-works → about → founding-member → contact → legal/privacy → terms → cookies
3. All locales /nl /en /es
4. Grep final:
   - `grep -r "alle 11" messages/` → 0
   - `grep -r "NVIDIA NemoClaw" .` → 0
   - `grep -r "200+ integraties\|99,9% Uptime\|160+ Content" messages/` → 0
   - `grep -r "automations\|marketing-machine" messages/` → 0
5. Visual inspection: counter consistent, all CTAs → /apply, SKC proof visible
6. Commit: `test(phase-5): all hygiene + full build passed`
7. Push branch, open PR voor review

---

## Post-Implementation Checklist

Before merging to main:

- [ ] All 6 phases committed
- [ ] Build passes clean
- [ ] Preview deploy on Vercel checked (all 3 locales)
- [ ] Owner reviewed critical pages (home, memory, pricing, apply, SKC case)
- [ ] Stripe price IDs set in Vercel env (production)
- [ ] SEO: sitemap.ts includes new routes (/memory, /apply, /case-studies/*, split legal)
- [ ] robots.ts allows crawl
- [ ] Redirects tested: /skills/content-creator, /skills/chatbot, /skills/email, /legal
- [ ] No broken links (internal)
- [ ] Screenshots rendered correctly on mobile + desktop
- [ ] Application form submits + owner receives notification
- [ ] Counter shows `1/10` on home, pricing, founding-member (single SSoT)

## Future (Phase 6 — separate project)

Clyde mini-demo component op `/skills/clyde`:
- Rate-limited free prompt box
- Real API call naar fma-app Clyde endpoint (Haiku only, 3 free messages)
- "Ondertekend als Apply" overgang na 3 messages
- Design doc TBD wanneer begonnen

## References

- Design: `docs/plans/2026-04-20-website-content-upgrade-design.md`
- Pricing details: `docs/plans/2026-04-20-pricing-final-proposal.md`
- Target: `fmai-nextjs/` (Next.js 16 + next-intl)
- Pricing SSoT: `fma-app/src/lib/skills.ts`
