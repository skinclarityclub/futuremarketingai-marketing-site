# Homepage Anti-Slop — Execution Handover (W2-W5)

**Datum**: 2026-05-25
**Voor**: Fresh Opus session continuation
**Companion**: `2026-05-25-homepage-anti-slop-v2.md` (vol context + specs + content drafts)
**Reeds gedaan op `main`**:
- W0 commit `f24c044` (bugs + plan v2.1)
- W1 commit `5990717` (copy + em-dash purge)

---

## TL;DR voor fresh session

User wil W2-W5 (4 waves, 9 nieuwe components, motion-rebrand, 8 wow-effecten) in één sessie uitvoeren met **strenge validatie-gates tussen iedere stap**. Dit document specificeert exact wat te valideren wanneer, zodat regressies vroeg geprikt worden ipv pas bij wave-einde.

Companion v2.1 plan bevat: alle decisions, content-drafts NL, specs MemoryUSP/Comparison/Clyde-tile, performance budget, risk register, file-map. **Lees v2.1 EERST** — dit doc is alleen execution-discipline.

---

## Universal validation gates (FUNDAMENTAL)

### Gate A — Per file edit
Geen extra commands; vertrouw op Edit-tool errors. Als Edit faalt: stop, lees file opnieuw, fix.

### Gate B — Per nieuwe component
```bash
npm run build 2>&1 | tail -15
```
- Pass: route-tabel zichtbaar aan eind, geen "error" lines
- Fail: STOP, fix immediately, niet doorgaan naar volgende component

### Gate C — Per sub-task (na 1-3 file edits met logische unit)
```bash
npm run lint 2>&1 | tail -5
```
- Pass: "0 errors" (warnings OK als ze pre-existing zijn in andere files)
- Fail: fix new errors VOORDAT je commit

### Gate D — Per commit (na 1-3 sub-tasks)
```bash
npm run build && npm run lint
```
Combo. Pass beide. Dan commit met semantic message.

### Gate E — Per wave-einde
```bash
npm run build
npm run lint
npm run test:e2e:cross-browser  # 9/9 must pass
```
Plus voor W4 en W5:
```bash
# In separate terminal eerst:
npm run audit:server  # LIGHTHOUSE_TEST=true next start --port 3002

# Dan:
npm run audit:lighthouse  # ~30 min, schrijft naar test-results/audit-v2/lighthouse/
```
Targets per wave: zie v2.1 plan sectie "Performance budget".

### Gate F — Visuele validatie (per nieuwe sectie)
- Start dev server `npm run dev` (laat draaien in background)
- Open browser naar `http://localhost:3000/nl`
- Scroll naar nieuwe sectie
- Verifieer: layout matcht spec, geen broken styles, NL-copy klopt
- Vóór W4: gebruik agent-browser-copilot skill voor screenshot-validation als component visueel complex is

---

## Wave 2 — Structuur (4-6u, 9 components + reorder)

> 9 nieuwe React components, 6 i18n namespaces × 3 locales, page.tsx reorder, services 6→12.

### Build-order (afhankelijkheden eerst, simpel naar complex)

#### W2.1 — CaseStudyCard (klein, copy bestaat in stats.caseStudy)
**File**: NIEUW `src/components/home/CaseStudyCard.tsx` (server component, gebruikt getTranslations)
**Spec**: SKC logo links (placeholder SVG/PNG, comment dat asset volgt) + 3 metrics horizontaal ("4 huismerken", "3 IG-accounts", "wekelijkse output") + quote Sindy + link `/case-studies/skinclarity-club`
**Copy**: zie v2.1 content-draft 1
**i18n**: `home.caseStudyCard.{role, metric1, metric2, metric3, quote, attribution, ctaLink}` — voeg toe aan nl/en/es.json
**Validation**: Gate B (build) + Gate C (lint)
**Commit**: `feat(home): W2.1 CaseStudyCard component`

#### W2.2 — FounderSection (klein, copy bestaat)
**File**: NIEUW `src/components/home/FounderSection.tsx` (server)
**Spec**: Daley portret links (placeholder, comment), naam + role + quote + link `/about`. Layout: side-by-side desktop, stacked mobile
**Copy**: zie v2.1 content-draft 5
**i18n**: `home.founder.{name, role, quote, ctaLink}` (check of `founder.*` namespace al bestaat — als ja, mergen, niet dupliceren)
**Validation**: Gate B + C
**Commit**: `feat(home): W2.2 FounderSection component`

#### W2.3 — PricingTeaser (klein, mirror van pricing-data)
**File**: NIEUW `src/components/home/PricingTeaser.tsx` (server)
**Spec**: 4 mini-kaarten in grid (Founding €997 fixed / Growth €499/ws / Pro €399/ws / Ent €299/ws) + link `/pricing`. Founding card kleur-accent (gold/amber border). Mobile: stack vertical.
**Copy**: zie v2.1 content-draft 6
**i18n**: `home.pricingTeaser.{title, subtitle, tiers.{founding,growth,pro,ent}.{label,price,unit,desc}, ctaLink}`
**Reference**: `src/lib/skills-data.ts` of `src/lib/pricing-data.ts` voor exacte prijzen — gebruik constants, niet hardcode
**Validation**: Gate B + C
**Commit**: `feat(home): W2.3 PricingTeaser component`

#### W2.4 — TestimonialBlock (klein, vereist Sindy-foto placeholder)
**File**: NIEUW `src/components/home/TestimonialBlock.tsx` (server)
**Spec**: Sindy foto (placeholder), quote, naam + role. Compact, single-column gecentreerd.
**Copy**: zie v2.1 content-draft 7
**i18n**: `home.testimonial.{quote, name, role}`
**Asset gap**: Sindy-foto ontbreekt nog (zie v2.1 open items). Gebruik placeholder `/images/sindy-placeholder.svg` met TODO comment.
**Validation**: Gate B + C
**Commit**: `feat(home): W2.4 TestimonialBlock component (Sindy photo placeholder)`

### **Validation checkpoint na W2.1-W2.4** (4 commits)
- Gate D op alle 4 components
- Quick smoke: voeg ze tijdelijk toe aan page.tsx (anywhere) om visueel te checken in dev. Verwijder daarna, want reorder komt in W2.10.

#### W2.5 — MemoryUSPTeaser (mid, statisch in W2, animated in W5.7)
**File**: NIEUW `src/components/home/MemoryUSPTeaser.tsx` (server initially, wordt `'use client'` in W5.7)
**Spec**: 4 horizontale gestapelde "layer kaarten" volgens v2.1 spec G2 (Context / Merken / Historie / Voorkeuren). Subtle dataflow-lijntjes ertussen (border-t border-accent-system/20). Achtergrond gradient bg-surface → bg-deep.
**Copy**: zie v2.1 content-draft 2
**i18n**: `home.memoryUsp.{title, intro, layers.{context,merken,historie,voorkeuren}, ctaLink}` (label + body per layer)
**Validation**: Gate B + C + Gate F (visual check is hier kritiek)
**Commit**: `feat(home): W2.5 MemoryUSPTeaser static 4-layer (W5.7 adds reveal)`

#### W2.6 — ComparisonTable (mid, nieuwe data)
**File**: NIEUW `src/components/home/ComparisonTable.tsx` (server)
**Spec**: 6 rijen × 3 koloms per v2.1 spec G3. Mobile: horizontal-scroll (`overflow-x-auto`), desktop: full grid. Clyde-kolom heeft accent-system border + light bg-accent-system/5. Iconen voor row-state: kleur-bolletje + Lucide icon (X / AlertCircle / Check).
**Copy**: zie v2.1 spec G3 (data table)
**i18n**: `home.comparison.{title, subtitle, headers.{onderwerp,diy,bureau,clyde}, rows.{geheugen,schaalbaar,sovereignty,setup,prijs,lockin}.{label,diy,bureau,clyde}, ctaLink}`
**Validation**: Gate B + C + Gate F (visual responsive check op 320/768/1280px)
**Commit**: `feat(home): W2.6 ComparisonTable 6x3 grid responsive`

#### W2.7 — ProcessTimeline (mid, statisch in W2, pin-stack in W5.4)
**File**: NIEUW `src/components/home/ProcessTimeline.tsx` (server initially)
**Spec**: 4 weken horizontaal (desktop) of vertical timeline (mobile). Per week: nummer 01-04, label, heading, body. Connector-lijn ertussen.
**Copy**: zie v2.1 content-draft 4
**i18n**: `home.processTimeline.{title, subtitle, weeks.{1,2,3,4}.{label,heading,body}}`
**Validation**: Gate B + C + Gate F
**Commit**: `feat(home): W2.7 ProcessTimeline static 4-week (W5.4 adds pin-stack)`

### **Validation checkpoint na W2.5-W2.7** (3 commits)
- Gate D
- Visual dev check elk component standalone

#### W2.8 — ClydeFeaturedTile (klein, statisch in W2, typewriter in W3/W5)
**File**: NIEUW `src/components/home/ClydeFeaturedTile.tsx` (server initially, `'use client'` voor typewriter later)
**Spec**: large tile met "Clyde" header + live status pulse (groene dot met "actief"). Body: één static prompt voorbeeld (typewriter komt in W5). Footer: "open Clyde-skill →" link.
**Copy**: prompt 1 uit v2.1 spec G5: "Plan Instagram content voor alle SKC-merken deze week"
**i18n**: `home.services.clyde.{title, status, prompts}` (prompts is array van 3 strings)
**Validation**: Gate B + C
**Commit**: `feat(home): W2.8 ClydeFeaturedTile static (typewriter komt in W3/W5)`

#### W2.9 — ServicesBento (mid, 12 skills + featured Clyde)
**File**: NIEUW `src/components/home/ServicesBento.tsx` (client component voor latere W5.1 spotlight, maar in W2 puur layout)
**Spec**: Bento grid, Clyde featured `col-span-2 row-span-2` linksboven, 11 overige `col-span-1`. Grid: `grid-cols-4` desktop, `grid-cols-2` tablet, `grid-cols-1` mobile.
**Services lijst** (12 totaal): socialMedia, leadQualifier, emailManagement, reporting, seoGeo, clyde (existing 6) + research, blogFactory, adCreator, manychat, voiceAgent, reelBuilder (nieuwe 6 uit v2.1 content-draft 8)
**Icon mapping**: extend `SERVICE_CARDS` constant uit page.tsx — pas Lucide icons: research=Search, blogFactory=FileText, adCreator=Megaphone (conflict met socialMedia? gebruik Target), manychat=MessageSquare, voiceAgent=Mic, reelBuilder=Video
**Status badges**: green "live" of amber "binnenkort" per skill
**Copy**: zie v2.1 content-draft 8
**i18n**: `home.services.{research,blogFactory,adCreator,manychat,voiceAgent,reelBuilder}.{title,description,status}` toevoegen
**Validation**: Gate B + C + Gate F (12 cards bento layout op 3 viewports check)
**Commit**: `feat(home): W2.9 ServicesBento 12 skills with featured Clyde tile`

#### W2.10 — Page.tsx sectie-reorder
**File**: `src/app/[locale]/page.tsx` (EXISTING, herstructureer)
**Spec**: nieuwe sectie-volgorde uit v2.1 (14 secties). Verwijder oude services 6-grid, oude badges-sectie (komt in W3), oude trust-cards (komt in W3), oude FAQ (komt in W3), oude TrustSignals (verplaats naar positie 8), oude LeadMagnetCTA (verplaats naar positie 11).
**Tijdelijk in W2**: badges + trust-cards + FAQ blijven oude implementatie (W3 vervangt ze). Reorder positioneert ze alleen.
**Imports**: alle nieuwe components importeren
**Validation**: Gate B + C + Gate F (visueel — scroll hele pagina door)
**Commit**: `refactor(home): W2.10 sectie-reorder + nieuwe components inwerken in page.tsx`

### **W2 wave-end validation (Gate E)**
```bash
npm run build
npm run lint
npm run test:e2e:cross-browser
```
- 9/9 cross-browser groen
- E2e voor services-grid telt 12 cards (tests/e2e/homepage.spec.ts regel 58 TODO uit W0): update `toHaveCount(6)` → `toHaveCount(12)` als onderdeel van W2.10
- Build pass, lint 0 errors

**Als regressie**: rollback laatste commit met `git revert`, fix in nieuwe commit. NIET amend.

---

## Wave 3 — Anti-slop pass (2-3u, 4 commits)

### W3.1 — Pillars bento (vervangt badges sectie)
**File**: `src/app/[locale]/page.tsx` (oude badges sectie weg, 3 bento-tiles in plaats)
**Spec**: 3 tiles per v2.1 spec C1. Tile A `md:col-span-2` (display-font typografisch), Tile B+C `md:col-span-1` (cijfers). Single accent teal.
**i18n**: rename `home.badges.*` → `home.pillars.*` in nl/en/es. **KRITIEK**: laat `leadMagnet.badges.*` ongewijzigd (andere namespace).
**Aria**: `aria-labelledby="badges"` → `aria-labelledby="pillars"`
**E2e**: `tests/e2e/homepage.spec.ts` regels 62-63 selector update + rename test "Trust Badges" → "Pillars"
**Validation**: Gate B + C + e2e local run
**Commit**: `feat(home): W3.1 pillars bento — vervangt 6 checkmarks door 3 inhoudelijke tiles`

### W3.2 — Trust numerieke tiles (vervangt trust GlassCards)
**File**: `src/app/[locale]/page.tsx` (oude trust sectie weg, 4 numerieke tiles in plaats)
**Spec**: 4 tiles "01/02/03/04" met label + body per v2.1 spec C2. Geen Lucide-icon-box. Cijfer in font-display 7xl text-accent-system.
**i18n**: keys blijven `home.trust.*`, alleen titles aanscherpen. Voeg `home.trust.numerals.{1,2,3,4}` toe of inline in code.
**Validation**: Gate B + C
**Commit**: `feat(home): W3.2 trust numerieke tiles — vervangt 4 Lucide GlassCards`

### W3.3 — ServicesBento integratie + Clyde typewriter
**File**: `src/components/home/ClydeFeaturedTile.tsx` (upgrade naar `'use client'` + typewriter)
**Spec**: 3 prompts roterend per v2.1 G5. Char-by-char 50ms, hold 2s, delete 30ms/char. Implementeer met useState + useEffect interval. **Reduced-motion**: useReducedMotion → render alleen prompt 1 statisch.
**Library**: geen extern, custom hook
**Validation**: Gate B + C + Gate F (typewriter werkt op desktop, accessibility check met OS reduce-motion)
**Commit**: `feat(home): W3.3 ClydeFeaturedTile typewriter rotation + reduced-motion`

### W3.4 — FaqAccordion via Radix
**File**: NIEUW `src/components/home/FaqAccordion.tsx`
**Install**: `npm install @radix-ui/react-accordion`
**Spec**: `<Accordion.Root type="single" collapsible>` + Motion `asChild` op Content. Chevron rotate 0.2s. AnimatePresence niet nodig — Radix doet state-management.
**Code template**: zie v2.1 W3 C4 sectie
**Page.tsx**: vervang oude `<dl>/<dt>/<dd>` FAQ door `<FaqAccordion>`
**E2e**: bestaande FAQ test moet groen blijven — selector update als nodig (van `dl[aria-labelledby="faq"]` naar `[aria-labelledby="faq"] [role="region"]`)
**a11y check**: keyboard nav (Tab, Enter, Space, Arrow Up/Down, Home, End) — Radix levert dit gratis
**Validation**: Gate B + C + manual keyboard test
**Commit**: `feat(home): W3.4 FaqAccordion via Radix UI (a11y baseline)`

### **W3 wave-end (Gate E)**
- 9/9 cross-browser
- E2e: pillars selector + 12 services count beide groen
- Visual: scroll hele homepage, verifieer bento/numerieke/typewriter/accordion alle 4 zichtbaar werken

---

## Wave 4 — Motion-systeem upgrade (1-2u, 1 grote commit of 2 kleine)

### W4.1 — Library migratie + tokens
**Steps**:
1. `npm uninstall framer-motion`
2. `npm install motion`
3. Global find-replace: `from 'framer-motion'` → `from 'motion/react'` (gebruik grep + sed of doe per file via Edit)
4. `npm run build` — verify geen import errors

**Validation**: Gate B + Gate C + grep verify `from 'framer-motion'` returns 0 hits

### W4.2 — Easings tokens + MotionConfig
**File**: NIEUW `src/lib/motion/easings.ts` (exporteer constants per v2.1 D2)
**File**: `src/app/[locale]/layout.tsx` — wrap children in `<MotionConfig reducedMotion="user">`. Layout is currently server component — MotionConfig moet in een `'use client'` boundary. Optie: maak `src/components/motion/MotionRoot.tsx` als client wrapper, import in layout.
**Validation**: Gate B + C

### W4.3 — Hero inline animations → motion
**File**: `src/app/[locale]/page.tsx`
**Steps**: vervang 5 inline `style={{ animation }}` (TODO W4 comments uit W0) door `motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}` met juiste delays (0/0.2/0.4/0.5/0.6s) en `transition={{ duration: 0.4, ease: EASE_OUT }}`. Hero moet `'use client'` worden, of extract hero sectie naar client component `<HeroSection>`.
**Decision**: extract `<HeroSection>` naar `src/components/home/HeroSection.tsx` zodat page.tsx server-rendering elders niet breekt.
**Validation**: Gate B + C + Gate F (hero animations vuren bij paint)

### W4.4 — TrustSignalsGrid motion stagger
**File**: `src/components/marketing/TrustSignalsGrid.tsx`
**Steps**: `'use client'`, vervang inline `style={{ animation }}` door `motion.div` parent met `variants={{ visible: { transition: { staggerChildren: STAGGER_FAST } } }}` en kinder-`motion.div` met variants
**Validation**: Gate B + C

### W4.5 — CountUp component (G1)
**File**: NIEUW `src/components/motion/CountUp.tsx`
**Spec**: zie v2.1 W4 D7
**Test**: isoleer in een storybook of test page first; integrate in TrustSignalsGrid + CaseStudyCard
**Validation**: Gate B + C + Gate F (countup animeert bij scroll-in)

### W4.6 — ScrollReveal reduced-motion audit
**File**: `src/components/motion/ScrollReveal.tsx`
**Action**: lees component, check of `useReducedMotion()` of `prefers-reduced-motion` wordt gerespecteerd. Indien niet: fix.
**Validation**: Gate B + manual test (DevTools rendering panel → prefers-reduced-motion: reduce → reload → verifieer geen translates)

### **W4 wave-end (Gate E + Lighthouse)**
```bash
npm run build && npm run lint && npm run test:e2e:cross-browser
# 9/9 must pass

# Then in 2 terminals:
npm run audit:server   # terminal 1
npm run audit:lighthouse  # terminal 2, ~30 min
```
- Lighthouse perf > 95 desktop (was > 90), bundle < +5kb (motion-rebrand is neutral)
- 0 imports framer-motion (`grep -r "from 'framer-motion'" src` empty)

**Commits**: 1 grote of 6 kleine — gebruiker's keuze. Aanbevolen: 1 grote met heldere body listing alle subtaken.

---

## Wave 5 — Wow-effecten (6-8u, 8 commits)

> Elk effect heeft expliciete reduced-motion fallback. Effecten zijn onafhankelijk te bouwen, maar W5.4 + W5.8 delen GSAP install — doe die install eenmalig vóór W5.3.

### W5.1 — Spotlight cards (XS, 0kb)
**File**: `src/components/home/ServicesBento.tsx` (al `'use client'` uit W2.9)
**Spec**: v2.1 W5.1. Pointer-move → CSS var, radial-gradient pseudo-element.
**No JS animation** — pure CSS. Reduced-motion automatisch OK.
**Validation**: Gate B + C + Gate F (cursor sweep over services-grid → highlight volgt)
**Commit**: `feat(home): W5.1 services bento spotlight cards (Linear-style)`

### W5.2 — Paper Shaders MeshGradient (XS, +15kb)
**Install**: `npm install @paper-design/shaders-react`
**File**: NIEUW `src/components/hero/PaperShaderMesh.tsx`
**Spec**: v2.1 W5.2. Lazy-load via `next/dynamic({ ssr: false })` als SSR-issues optreden.
**Reduced-motion**: useReducedMotion → render bestaande `<GradientMesh />` fallback.
**Page.tsx**: vervang `<GradientMesh />` door `<PaperShaderMesh />`
**Validation**: Gate B + C + Gate F (visueel: animated mesh-gradient zichtbaar) + bundle delta check
**Commit**: `feat(home): W5.2 Paper Shaders MeshGradient (replaces GradientMesh)`

### **Install GSAP eenmalig**:
```bash
npm install gsap
```
**Licentie check**: GSAP MIT voor non-commercial. Commercial Business Green = $99/jaar. Confirm met user vóór deze install, of installeer en run free voor nu — kan later switchen.

### W5.3 — Spline hero scroll-scrub (M, +85kb GSAP lazy)
**File**: `src/components/hero/HeroSpline.tsx`
**Spec**: v2.1 W5.3. Test of Spline scene `rotation`/`zoom` variables heeft — als niet, fallback naar pure CSS transform op canvas wrapper.
**Reduced-motion**: skip ScrollTrigger, render static Spline.
**Validation**: Gate B + C + Gate F (scroll first 100vh → robot draait/zoomt)
**Commit**: `feat(home): W5.3 Spline scroll-scrub via GSAP ScrollTrigger`

### W5.4 — ProcessTimeline pin-stack (M, GSAP herbruik)
**File**: `src/components/home/ProcessTimeline.tsx` (upgrade van W2.7 static)
**Spec**: v2.1 W5.4. `'use client'`, ScrollTrigger pin + scrub.
**Reduced-motion**: render static 4-step grid.
**Validation**: Gate B + C + Gate F (scroll door section → pin + reveals)
**Commit**: `feat(home): W5.4 ProcessTimeline pin-and-stack scroll scrub`

### W5.5 — CountUp wijdverbreid gebruik (XS, 0kb — gebruikt G1)
**Files**: `src/components/marketing/TrustSignalsGrid.tsx` + `src/components/home/CaseStudyCard.tsx`
**Spec**: vervang harde nummers door `<CountUp />`. CountUp checkt zelf reduced-motion (in D7 spec).
**Validation**: Gate B + C + Gate F (cijfers tellen op bij scroll-in)
**Commit**: `feat(home): W5.5 CountUp number animations in TrustSignals + CaseStudy`

### W5.6 — Hero kinetic typo (XS, 0kb)
**File**: `src/components/home/HeroSection.tsx` (was extracted in W4.3)
**Spec**: v2.1 W5.6. Word-by-word blur-stagger reveal.
**Cap**: stagger total < 0.6s, individual delay max 0.08s. Headline > 8 woorden? Gebruik snellere stagger.
**Reduced-motion**: MotionConfig handles auto (filter/transform uit, opacity blijft).
**Validation**: Gate B + C + Gate F (refresh hero, headline reveal woord-voor-woord)
**Commit**: `feat(home): W5.6 hero kinetic typography word-stagger reveal`

### W5.7 — MemoryUSP layer-stack reveal (S, 0kb)
**File**: `src/components/home/MemoryUSPTeaser.tsx` (upgrade naar `'use client'`)
**Spec**: v2.1 W5.7. Stagger 0.15s, opacity + x-translate.
**Reduced-motion**: MotionConfig auto (geen x, alleen opacity).
**Validation**: Gate B + C + Gate F (scroll in sectie → 4 layers sequentieel)
**Commit**: `feat(home): W5.7 MemoryUSP layer-stack sequential reveal`

### W5.8 — Pricing tier sticky reveal (M) — desktop only
**File**: `src/components/home/PricingTeaser.tsx` (upgrade van W2.3)
**Spec**: v2.1 W5.8. Mobile + reduced-motion fallback = normale grid (geen pin/scrub).
**Window check**: `window.innerWidth < 1024` check op mount.
**Cleanup**: GSAP ctx.revert() in useEffect cleanup om resize-conflicts te voorkomen.
**Validation**: Gate B + C + Gate F (desktop: sticky reveal werkt; mobile: normale grid)
**Commit**: `feat(home): W5.8 PricingTeaser sticky reveal (desktop only, mobile grid)`

### **W5 wave-end (Gate E + Lighthouse + bundle audit)**
```bash
npm run build && npm run lint && npm run test:e2e:cross-browser
npm run audit:server &
sleep 5
npm run audit:lighthouse
```
**Hard checks**:
- Bundle delta < +100kb gzipped (Paper Shaders ~15 + GSAP ~85)
- Lighthouse perf desktop > 90, mobile > 70
- All 8 W5 effects working + reduced-motion fallbacks confirmed via DevTools
- 9/9 cross-browser still green

**Reduced-motion test protocol**:
1. DevTools → Rendering panel → "Emulate CSS media feature prefers-reduced-motion" → "reduce"
2. Reload homepage
3. Verifieer per W5 effect:
   - W5.1 spotlight: nog steeds zichtbaar (pure CSS)
   - W5.2 mesh: gefallbacked naar static GradientMesh
   - W5.3 Spline: static (geen scroll-scrub)
   - W5.4 ProcessTimeline: static grid (geen pin)
   - W5.5 CountUp: cijfer direct getoond zonder animate
   - W5.6 kinetic typo: opacity-fade only (geen filter/translate)
   - W5.7 layer-stack: opacity-fade only (geen x-translate)
   - W5.8 Pricing sticky: normale grid (geen pin)

---

## Commit cadence guidance

**Aanbevolen**: 1 commit per genummerd sub-taak (W2.1, W2.2, ..., W5.8). Resultaat: ~30 commits over 4 waves. Voordeel: granular rollback, leesbare git log.

**Alternatief**: 1 commit per wave (W2, W3, W4, W5). Sneller bij happy path, maar als wave half-pad faalt is rollback grover.

**Niet**: amend commits na push. Maak altijd nieuwe commits.

**Voor pre-commit hooks**: deze repo heeft mogelijk lint-staged of husky — als pre-commit faalt, fix issue en maak NIEUWE commit, niet `--no-verify`.

---

## Rollback strategy

### Per commit (single sub-taak)
```bash
git revert HEAD --no-edit
# Maak nieuwe commit met fix
```

### Per wave (meerdere commits)
```bash
git log --oneline -10  # vind eerste commit van wave
git revert <first-wave-commit>..HEAD --no-commit
git commit -m "revert: rollback W<N> due to <reason>"
```

### Nuclear (back to W1 done)
```bash
git reset --hard 5990717  # W1 commit hash
# DANGER: destroys uncommitted work. Confirm met user vóór gebruik.
```

---

## Sessie-eind protocol

Als sessie eindigt mid-wave:
1. Commit current work-in-progress: `wip(home): W<N>.<M> partial — <wat is af, wat niet>`
2. Schrijf `docs/plans/2026-05-25-homepage-handover-mid-W<N>.md` met:
   - Welke sub-taak laatst voltooid
   - Welke sub-taak begonnen + state
   - Welke tests pass/fail
   - Wat de volgende sessie als eerste moet doen
3. Update `MEMORY.md` (project) met snapshot

---

## Asset gaps (niet-blokkerend, oplossen tijdens W2)

- **Sindy-foto** (TestimonialBlock W2.4): placeholder SVG met TODO. User levert later of via Higgsfield.
- **Daley-foto** (FounderSection W2.2): placeholder of bestaand asset checken.
- **SKC logo** (CaseStudyCard W2.1): zoek in `public/images/` of `public/brand/`. Als niet aanwezig: placeholder SVG met TODO.

Stuur user een lijst aan eind van W2 met exacte foto-specs:
- Sindy: portret 1024×1024, neutrale background, glimlach OK
- Daley: portret 1024×1024, professional studio of office BG
- SKC logo: SVG of PNG transparant, 256×256 min.

---

## Bekend risico: page.tsx wordt complex

Na W2-W5 zal `src/app/[locale]/page.tsx` ~600+ regels zijn met veel imports. Als het te onleesbaar wordt:
- Extract `<HomeServices>`, `<HomeProof>`, `<HomeConversion>` als logische groepering
- Niet doen voordat W5 af is — vermijd refactor in midstream

---

## Open vragen voor user (verzamel tijdens execution, niet vooraf vragen)

- W5.3 Spline scene heeft `rotation` + `zoom` variables? (zo niet, fallback CSS transform)
- GSAP licentie: commercial? (Business Green $99/jaar, alleen nodig als bedrijf > $1M revenue per GSAP TOS)
- Sindy/Daley/SKC assets: bestaand of nieuw te maken?

**Niet blokkeren op deze** — placeholders + TODO comments, ship en user resolvt later.
