# Homepage Anti-Slop v2.1 — Validated + Specced Plan

**Datum**: 2026-05-25 (v2.1 update)
**Successor van**: `~/.claude/plans/bekijk-de-rest-van-unified-shamir.md` (v1) → v2 → **v2.1**
**Validatie**: 7 parallelle Opus-audits + 8 finale gap-fixes
**Scope**: volledig W0-W5 + 8 wow-effecten (4 origineel + 4 extra)

---

## TL;DR

6 waves (W0-W5), 18-24u over meerdere sessies. V2.1 voegt toe op v2: specs voor MemoryUSP/Comparison/Clyde-tile (G2/G3/G5), countup-component (G1), performance budget (G6), reduced-motion-fallback per W5-effect (G7), NL-content-drafts voor 8 nieuwe secties (G8), en 4 extra scroll-wow effecten (countup, kinetic typo, MemoryUSP layer-stack, Pricing sticky reveal).

---

## Decisions log (v2 + v2.1)

| Beslissing | Keuze | Reden |
|---|---|---|
| Scope | Volledig W0-W5 + alle 8 wow | User-akkoord 2026-05-25 |
| Merken-framing | "SKC voert autonoom content-operatie voor hun 4 huismerken" | Eerlijk: SKC = founder Sindy's eigen multi-brand webshop |
| FAQ | Radix Accordion (`type="single" collapsible`) + Motion `asChild` | Anti-DIY a11y, single-open voorkomt overload |
| Motion-library | `framer-motion` → `motion/react` | Rebrand 2025 |
| Pillars | Bento / asymmetrisch (NIET 3-equal-col) | Taste-audit |
| Trust-cards | Numerieke leading (01-04), NIET Lucide-icon-tegels | Anti-2021-SaaS-pattern |
| Services-layout | Bento featured Clyde span-2 + 11 secundair (12 totaal) | Taste + completeness |
| ICP-animatie | Wrap 2 cards (niet bullets staggeren) | Emil: bullets breken leesritme |
| Reduced-motion | `<MotionConfig reducedMotion="user">` + per-W5-effect fallback | Emil + SOTA + G7 |
| GradientMesh | → Paper Shaders MeshGradient | Wow-audit |
| Spline | Promote naar scroll-scrub narrative | Wow-audit |
| **v2.1**: Countup | Eigen `<CountUp>` component met `useInView` + `motion/react` `animate()` | G1 |
| **v2.1**: Content drafts | Inline in plan (NL), EN/ES later in W2 | G8 — voorkomt mid-W2 blockers |
| **v2.1**: Performance | LCP <2.5s, INP <200ms, CLS <0.1, perf >90 desktop / >75 mobile | G6 hard targets |
| **v2.1**: 4 extra wow | Countup + kinetic typo + MemoryUSP layer-stack + Pricing sticky | User-akkoord |

---

## Glossary check (per CLAUDE.md)

| Verboden | Verplicht |
|---|---|
| em-dash (—) | komma, punt, dubbele punt |
| "platform", "tool", "feature" | "Clyde", "AI Marketing Medewerker", "vaardigheid" |
| "klanten" voor bureau-eindklanten | "merken", "klantportfolio" |
| "Sign up", "Try free" | "Plan een gesprek", "Apply" |
| "9 AI-skills" | "9 vaardigheden live" |

V1 plan-copy bevatte 3× em-dash — gefixt in W1 + alle content-drafts hieronder.

---

## Performance budget (G6)

Hard targets, gemeten per wave via Lighthouse audit-spec (zie `tests/e2e/audit-v2-lighthouse.spec.ts` setup uit Phase 17):

| Metric | W0-W3 | W4 | W5 |
|---|---|---|---|
| LCP | < 2.5s | < 2.5s | < 2.5s |
| INP | < 200ms | < 150ms | < 200ms |
| CLS | < 0.1 | < 0.05 | < 0.1 |
| Lighthouse perf (desktop) | > 90 | > 95 | > 90 |
| Lighthouse perf (mobile) | > 75 | > 80 | > 70 |
| Bundle delta vs baseline | < +30kb | < +5kb (motion-rebrand neutral) | < +100kb gz |
| TBT | < 200ms | < 150ms | < 250ms |

**W5 specifics**: Paper Shaders 15kb gz + GSAP 85kb gz lazy = totaal max +100kb. Spline scrub adds 0kb (asset bestaat al). Pricing sticky reveal hergebruikt GSAP load.

**Reduced-motion mode**: alle stagger/transform animaties < 50ms total. Opacity-fades 100ms max.

**Acceptance criteria per wave**: bundles meten via `npm run build` output, Lighthouse via `npm run audit:lighthouse` (audit-server moet draaien op port 3002).

---

## Risk register (v2 + v2.1)

| ID | Risico | Mitigatie |
|---|---|---|
| R1 | `aria-labelledby="badges"` rename naar `pillars` breekt 6 e2e tests | Tests mee-updaten in dezelfde commit |
| R2 | `home.badges.*` rename mag `leadMagnet.badges.*` NIET raken | i18n-rename script scope strict |
| R3 | Merken-claim 3 vs 4 — gekozen voor 4 huismerken + eerlijke framing | Update copy in nl/en/es |
| R4 | IcpSection `#00FF88` (niet in palette) | Vervang door `var(--color-status-active)` |
| R5 | Hero 4× inline `style={{ animation }}` | Vervang in W4, niet eerder |
| R6 | Paper Shaders SSR-compat met Next 16 | Lazy via `next/dynamic({ssr:false})` fallback |
| R7 | Spline scroll-scrub vereist runtime API toegang | Test in dev, fallback = static |
| R8 | GSAP +85kb lazy — INP-risico | Preload na hero-paint |
| **v2.1 R9** | Countup `animate()` API in `motion/react` — bevestig syntax | Test in iso component eerst (G1 spec hieronder) |
| **v2.1 R10** | Kinetic typo word-stagger — als headline langer dan 8 woorden voelt het traag | Cap stagger total < 0.6s, individual woord-delay max 0.08s |
| **v2.1 R11** | Pricing sticky reveal (4 tiers × 100vh) = 400vh extra page-height | Mobile: degrade naar normale grid (geen sticky), alleen desktop |
| **v2.1 R12** | MemoryUSP layer-stack scroll-trigger conflict met andere ScrollTriggers op pagina | GSAP `ScrollTrigger.config({ ignoreMobileResize: true })` + namespacing per sectie |

---

## Specs (G2/G3/G5 pre-W2 blockers resolved)

### G2 — MemoryUSPTeaser 4-layer diagram

**Visual structuur**:
```
┌─────────────────────────────────────────┐
│  CONTEXT       wat speelt er nu in      │
│                jouw bureau-portfolio    │
├─────────────────────────────────────────┤
│  MERKEN        tone of voice, do's &    │
│                don'ts, doelgroep        │
├─────────────────────────────────────────┤
│  HISTORIE      wat heeft Clyde eerder   │
│                gedaan, wat werkte       │
├─────────────────────────────────────────┤
│  VOORKEUREN    review-stijl, kanalen,   │
│                deadlines per merk       │
└─────────────────────────────────────────┘
```
4 horizontale gestapelde "kaarten" met dataflow-lijntjes ertussen (subtle teal connectors). Label (kapitaal, font-mono small) + body (font-display med). Achtergrond: gradient van `bg-surface` boven naar `bg-deep` onder, illustreert "lagen". W5.7 voegt sequential layer-reveal toe.

**Component**: `src/components/home/MemoryUSPTeaser.tsx` (W2 static; W5.7 animated)
**i18n**: `home.memoryUsp.{intro, layer1, layer2, layer3, layer4, cta}`

### G3 — ComparisonTable data

**Structuur**: 6 rijen × 3 koloms. Mobile: horizontal-scroll table (overflow-x: auto). Desktop: full grid.

| Onderwerp | DIY-stack (ChatGPT + Jasper + Buffer) | Traditioneel bureau | **Clyde** |
|---|---|---|---|
| Geheugen tussen sessies | Reset bij elke prompt | Account-manager kent jouw merken | 4-laags persistent memory per merk |
| Schaalbaarheid bij meer merken | Handmatig per merk opnieuw inrichten | Lineair meer uren, hogere kosten | Marginale kosten per extra merk |
| EU-data sovereignty | US-cloud verzonden | Afhankelijk van tools van bureau | Self-hosted EU servers |
| Setup-tijd tot productie | 2-3 weken eigen werk | 4-8 weken inrichting | 4 weken begeleide onboarding |
| Prijs per maand (4 merken portfolio) | 250-400 euro (tools) + jouw tijd | 4.000-12.000 euro | 1.196-1.996 euro (workspace + Founding) |
| Lock-in / data-export | Per tool verschillend | Vaak data bij bureau | Export binnen 24u, open API |

Visueel: Clyde-kolom heeft accent-system border + light-teal subtle background. Andere koloms grijs. Iconen voor row-state: rood-bolletje (zwak), oranje-bolletje (gemengd), groen-checkmark (sterk).

**Component**: `src/components/home/ComparisonTable.tsx`
**i18n**: `home.comparison.{title, subtitle, rows.{geheugen,schaalbaar,...}.{label,diy,bureau,clyde}}`

### G5 — Clyde featured tile typewriter prompts

In Services bento, featured Clyde-tile (`col-span-2 row-span-2`):
- Header: "Clyde" + live status pulse (groene puls met "actief" label)
- Body: typewriter-effect met 3 roterende prompts (interval 4s elk):
  1. "Plan Instagram content voor alle SKC-merken deze week"
  2. "Maak een wekelijks performance-rapport voor merk X"
  3. "Analyseer welke contenttypen het beste presteerden in Q4"
- Footer: "→ open Clyde-skill" link

Typewriter: char-by-char appearance, 50ms per char, hold 2s, dan delete 30ms per char, dan volgende prompt. Reduced-motion: vervang door static prompt (eerste in lijst).

**Component**: `src/components/home/ClydeFeaturedTile.tsx`
**i18n**: `home.services.clyde.{title, status, prompts[]}`

---

## NL Content drafts (G8 — pre-W2 om blockers te voorkomen)

> EN + ES vertalingen worden tijdens W2 toegevoegd. NL is leidend.

### 1. CaseStudyCard (SKC)

```
[SKC logo]

SkinClarity Club
Founding partner sinds Q4 2025

▸ 4 huismerken          ▸ 3 Instagram-accounts          ▸ wekelijkse output

"Clyde is geen tool die ik aan moet zetten. Hij plant, schrijft en
analyseert alsof er een vaste medewerker is. Het verschil voel je in
hoeveel tijd ik niet meer kwijt ben."
                                                    — Sindy, SKC

Lees de volledige case →  /case-studies/skinclarity-club
```

### 2. MemoryUSPTeaser

```
Geheugen, geen sessies

Andere AI begint elke prompt opnieuw. Clyde onthoudt jouw merken
zoals een vaste medewerker dat doet — en dat in 4 lagen.

[4-LAGEN DIAGRAM]

  CONTEXT      Wat speelt er nu in jouw portfolio
  MERKEN       Tone of voice, do's en don'ts per merk
  HISTORIE     Wat Clyde eerder deed, wat werkte
  VOORKEUREN   Review-stijl, kanalen, deadlines

Hoe Clyde's geheugen werkt →  /memory
```

### 3. ComparisonTable

```
Waarom een AI Marketing Medewerker, niet nóg meer tools

[6×3 TABEL, zie G3 spec]

Bekijk de volledige vergelijking →  /how-it-works
```

### 4. ProcessTimeline

```
Van eerste gesprek naar autonome content in 4 weken

Week 1  Intake & Discovery
        Wij leren jouw bureau en jouw klantportfolio kennen.
        Geen lange RFP, geen onboarding-PDF. Eén werksessie.

Week 2  Setup & Integratie
        Clyde krijgt toegang tot jouw kanalen, tools en data.
        Wij configureren memory-layers en review-flow.

Week 3  Training & Tuning
        Eerste content rondes met begeleide review. Clyde leert
        jouw tone of voice tot het natuurlijk voelt.

Week 4  Live & Autonomous
        Vanaf hier loopt Clyde zelfstandig. Jij houdt regie,
        Daley blijft persoonlijk aanspreekpunt.
```

### 5. FounderSection

```
[Daley portret foto]

Daley
Founder & lead engineer FutureMarketingAI

"Bureaus huren AI als een product. Ik bouw het als een collega.
Geen helpdesk laag, geen ticketing. Mijn nummer staat in jouw
WhatsApp."

→ Meer over Daley en de aanpak  /about
```

### 6. PricingTeaser

```
Transparante prijzen, geen verborgen credits

[4 mini-kaarten]

FOUNDING            GROWTH             PROFESSIONAL       ENTERPRISE
997 euro            499 euro/ws        399 euro/ws        299 euro/ws
levenslang fixed    2-4 merken         5-14 merken        15+ merken
10 plekken          .                  .                  .
1 bezet             .                  .                  .

Volledige prijspagina →  /pricing
```

### 7. TestimonialBlock (Sindy)

```
[Sindy portret foto]

"Wat ik niet had verwacht, is dat ik Clyde miste op vakantie.
Niet de tool. De medewerker."

Sindy
Founder & operator, SkinClarity Club
```

### 8. Services 6→12 (extra 6 nieuwe service-keys)

Bestaande 6: socialMedia, leadQualifier, emailManagement, reporting, seoGeo, clyde

**Toevoegen** (per `audit-capabilities-inventory.md` + status):
- **research** (live)         — "Marktonderzoek, concurrentie-analyse en trendsignalen per merk, in jouw briefingdocs."
- **blogFactory** (live)      — "Volledige blog-artikelen, geoptimaliseerd voor SEO en GEO, klaar voor publicatie."
- **adCreator** (live)        — "Ad-varianten voor Meta, Google en TikTok. Inclusief copy, hooks en visuele richting."
- **manychat** (coming_soon)  — "Conversational flows voor Instagram en WhatsApp, gekoppeld aan jouw funnels."
- **voiceAgent** (coming_soon)— "Inbound en outbound calls afgehandeld in jouw merkstem. Routing naar mens waar nodig."
- **reelBuilder** (coming_soon)— "Reels en short-form videos van briefing tot finale cut, klaar voor publicatie."

Live skills: groene "live"-badge. Coming_soon: amber "binnenkort" badge.

---

## File-map (alle bestanden die worden geraakt)

### W0 — Bugs
- `src/components/marketing/TrustSignalsGrid.tsx` (sovereignty href)
- `src/components/home/IcpSection.tsx` (checkmarks + neon)
- `messages/{nl,en,es}.json` (stats.caseStudy.value → 4 huismerken)
- `src/app/[locale]/page.tsx` (hero dvh fix + animation-deprecate comments)

### W1 — Copy
- `messages/{nl,en,es}.json` (services, trust-strip, final CTA)
- Globale grep: alle em-dashes in user-copy

### W2 — Structure (nieuwe secties)
- `src/components/home/CaseStudyCard.tsx` (NIEUW)
- `src/components/home/MemoryUSPTeaser.tsx` (NIEUW, static)
- `src/components/home/ComparisonTable.tsx` (NIEUW)
- `src/components/home/ProcessTimeline.tsx` (NIEUW, static)
- `src/components/home/FounderSection.tsx` (NIEUW)
- `src/components/home/PricingTeaser.tsx` (NIEUW)
- `src/components/home/TestimonialBlock.tsx` (NIEUW)
- `src/components/home/ClydeFeaturedTile.tsx` (NIEUW)
- `src/components/home/ServicesBento.tsx` (NIEUW — wraps 12 services)
- `src/app/[locale]/page.tsx` (sectie-volgorde + 12 services)
- `messages/{nl,en,es}.json` (alle nieuwe namespaces)

### W3 — Anti-slop
- `src/app/[locale]/page.tsx` (badges → bento-pillars, trust → numerieke tiles)
- `src/components/home/FaqAccordion.tsx` (NIEUW, Radix)
- `package.json` (`@radix-ui/react-accordion`)
- `tests/e2e/homepage.spec.ts` (aria-labelledby selectors)

### W4 — Motion
- `src/app/[locale]/layout.tsx` (MotionConfig)
- `src/lib/motion/easings.ts` (NIEUW — tokens)
- `src/components/motion/CountUp.tsx` (NIEUW — G1)
- Globaal: `from 'framer-motion'` → `from 'motion/react'`
- `src/components/motion/ScrollReveal.tsx` (verify reduced-motion)
- `src/components/marketing/TrustSignalsGrid.tsx` (motion stagger + CountUp gebruik)
- `src/components/home/CaseStudyCard.tsx` (CountUp gebruik)
- `src/app/[locale]/page.tsx` (hero inline → motion)
- `package.json` (`framer-motion` → `motion`)

### W5 — Wow (8 effecten)
- `src/components/hero/HeroSpline.tsx` (W5.3 GSAP scrub)
- `src/components/home/ServicesBento.tsx` (W5.1 spotlight)
- `src/components/hero/PaperShaderMesh.tsx` (NIEUW W5.2)
- `src/components/home/GradientMesh.tsx` (deprecate fallback)
- `src/components/home/ProcessTimeline.tsx` (W5.4 pin-stack)
- `src/components/home/MemoryUSPTeaser.tsx` (W5.7 layer-stack reveal)
- `src/components/home/PricingTeaser.tsx` (W5.8 sticky reveal — desktop only)
- `src/app/[locale]/page.tsx` (W5.6 hero kinetic typo)
- `src/components/home/ClydeFeaturedTile.tsx` (typewriter — gebruikt motion.span)
- `package.json` (`gsap`, `@paper-design/shaders-react`)

---

## Sectie-volgorde (nieuw)

1. **Hero** + TrustCluster (W5.3 Spline scrub, W5.6 kinetic typo, W5.2 Paper Shaders bg)
2. **CaseStudyCard** (NEW, W5.5 countup metrics)
3. **ServicesBento** (NEW: 12 skills, W3 bento, W5.1 spotlight, W3 ClydeFeaturedTile typewriter)
4. **MemoryUSPTeaser** (NEW, W5.7 layer-stack reveal)
5. **ComparisonTable** (NEW)
6. **ProcessTimeline** (NEW, W5.4 pin-stack)
7. **FounderSection** (NEW)
8. **TrustSignalsGrid** (W4 stagger, W5.5 countup)
9. **PricingTeaser** (NEW, W5.8 sticky reveal desktop)
10. **ICP** (W4 wrap cards motion)
11. **LeadMagnetCTA** (verplaats van top)
12. **FAQ** (W3 Radix accordion)
13. **Final CTA + scarcity**
14. **TrustStrip** (compacter)

---

## Wave 0 — Bugs & conflicts (1u)

### A1 — Merken-conflict harmoniseren (G3 framing)
`messages/nl.json` `stats.caseStudy.value`: `"3 merken live"` → `"4 huismerken"`. Idem EN/ES.

### A2 — TrustSignalsGrid sovereignty href
`src/components/marketing/TrustSignalsGrid.tsx` regel 20: `'/memory'` → `'/privacy'`.

### A3 — IcpSection neon + checkmarks
- Vervang `#00FF88` (regel 25, 34) door `var(--color-status-active)` (#22c55e)
- Vervang `&#10003;` (regels 27, 34, 50, 57) door `<Check className="w-4 h-4 text-accent-system" />` Lucide

### A4 — Hero animation-deprecate comments
NU: voeg comment `/* TODO W4: replace inline animation with motion */` boven 4 inline-style locaties (`page.tsx` 110/119/133/141/158). W4 doet migratie.

### A5 — Hero viewport unit fix
`min-h-[85vh]` → `min-h-[85dvh]` (iOS Safari).

### A6 — Aria-rename voorbereiden (no-op)
Comment in `page.tsx` + `tests/e2e/homepage.spec.ts`: W3 rename `aria-labelledby="badges"` → `"pillars"`.

**Commit**: `fix(home): W0 bugs — merken-claim, sovereignty href, IcpSection palette+checkmarks, dvh fix`

---

## Wave 1 — Copy (1u)

### B1 — Services impact-led copy (NL)
```json
"socialMedia": { "description": "Captions, planning en carrousels per merk. Klaar voordat jij maandag start." }
"emailManagement": { "description": "Jij ziet alleen wat aandacht nodig heeft. De rest is al weg." }
"reporting": { "description": "Wekelijks rapport in je inbox. Bij afwijkende metrics hoor je het voordat de klant belt." }
"clyde": { "description": "Eén aanspreekpunt voor je hele portfolio. Vraag in gewone taal, Clyde kiest de juiste vaardigheid." }
```

### B2 — TrustSignalsGrid stats reframe
```json
"skills": {
  "value": "9 vaardigheden live",
  "label": "Direct inzetbaar voor jouw bureau"
}
```

### B3 — Trust strip eerlijke claim (4 huismerken)
```json
"trustStrip": {
  "subtitle": "SkinClarity Club voert volledig autonoom de content-operatie voor hun 4 huismerken. 3 Instagram-accounts, wekelijkse output, minimale review."
}
```

### B4 — Final CTA scherper close
```json
"cta": {
  "subtitle": "Tien founding plekken. Eén bezet. Jouw bureau krijgt persoonlijke onboarding van Daley en lifetime founding-tarief. Plan een gesprek van 30 minuten."
}
```

### B5 — Em-dash scan
Grep alle em-dashes (—) in `messages/*.json` user-facing values. Vervang door komma / punt / dubbele punt.

**Commit**: `content(home): W1 copy — services impact-led, trust-strip honest, em-dash purge`

---

## Wave 2 — Structuur (4-6u)

### Volgorde van bouwen (afhankelijkheden eerst)
1. `CaseStudyCard.tsx` — copy: zie content-draft 1
2. `FounderSection.tsx` — copy: zie content-draft 5
3. `PricingTeaser.tsx` — copy: zie content-draft 6
4. `TestimonialBlock.tsx` — copy: zie content-draft 7
5. `MemoryUSPTeaser.tsx` (static) — copy: zie content-draft 2 + visual G2
6. `ComparisonTable.tsx` — data: zie G3
7. `ProcessTimeline.tsx` (static) — copy: zie content-draft 4
8. `ClydeFeaturedTile.tsx` (static prompt eerste in lijst) — spec G5
9. `ServicesBento.tsx` — wraps 12 services, featured Clyde
10. **Sectie-volgorde** in `page.tsx` herschikken

### i18n nieuwe namespaces
- `home.caseStudyCard.*` (logo alt, role, metric labels, quote, attribution, ctaLink)
- `home.memoryUsp.{title, intro, layers.{context,merken,historie,voorkeuren}, ctaLink}`
- `home.comparison.{title, subtitle, headers.{onderwerp,diy,bureau,clyde}, rows[6].{label,diy,bureau,clyde}, ctaLink}`
- `home.processTimeline.{title, subtitle, weeks.{1,2,3,4}.{label,heading,body}}`
- `home.founder.{name, role, quote, ctaLink}` (check of `founder.*` al bestaat)
- `home.pricingTeaser.{title, subtitle, tiers.{founding,growth,pro,ent}.{label,price,unit,desc}, ctaLink}`
- `home.testimonial.{quote, name, role}`
- `home.services.{research,blogFactory,adCreator,manychat,voiceAgent,reelBuilder}.{title,description,status}`

**Commits**: 1 per nieuwe component (~9 commits) + 1 reorder + 1 i18n.

---

## Wave 3 — Anti-slop pass (2-3u)

### C1 — Pillars (bento, was: 6 checkmarks)
3 bento-tiles, niet 3-equal-col:
- Tile A (`md:col-span-2`): **Veiligheid & Compliance** — display-font "GDPR · EU AI Act" 6xl + 1 onderbouwing-zin
- Tile B (`md:col-span-1`): **Infrastructuur** — cijfer "24u" 6xl + "Data-export SLA" label + Server-icon klein
- Tile C (`md:col-span-1`): **Samenwerking** — "1:1" cijfer + "Persoonlijke onboarding door Daley"

Single accent: alles teal. `aria-labelledby="pillars"` (e2e tests mee-updaten).

### C2 — Trust cards (numerieke leading, was: 4× GlassCard `&#10003;`)
```
01  Custom-built voor jouw bureau           02  Founder access — geen CSM-laag
03  Resultaatgarantie binnen 4 weken        04  No-commitment trial
```
Cijfer in `font-display` 7xl text-accent-system, label `font-display` md, body small text-text-secondary. Geen icon-box.

### C3 — Services bento-asymmetrie
ServicesBento.tsx: Clyde featured `col-span-2 row-span-2` (live status pulse + typewriter G5), overige 11 services `col-span-1`. Grid: 4 koloms desktop, 2 koloms tablet, 1 kolom mobile.

### C4 — FAQ via Radix
`npm install @radix-ui/react-accordion`. Nieuwe `FaqAccordion.tsx`:
```tsx
<Accordion.Root type="single" collapsible>
  {FAQ_KEYS.map(key => (
    <Accordion.Item value={key} key={key}>
      <Accordion.Trigger className="...flex items-center justify-between w-full...">
        {question}
        <ChevronDown className="transition-transform duration-200 data-[state=open]:rotate-180" />
      </Accordion.Trigger>
      <Accordion.Content asChild forceMount>
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          style={{ overflow: 'hidden' }}
        >
          {answer}
        </motion.div>
      </Accordion.Content>
    </Accordion.Item>
  ))}
</Accordion.Root>
```

**Commits**: 1 per anti-slop sectie (4 commits)

---

## Wave 4 — Motion-systeem upgrade (1-2u)

### D1 — Library migratie
```bash
npm uninstall framer-motion
npm install motion
```
Globale find-replace: `from 'framer-motion'` → `from 'motion/react'`. `npm run build` verify.

### D2 — Easing tokens
`src/lib/motion/easings.ts`:
```ts
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const
export const DEFAULT_DURATION = 0.4
export const STAGGER_FAST = 0.05
export const STAGGER_NORMAL = 0.07
export const VIEWPORT_DEFAULT = { once: true, margin: '-80px' }
```

### D3 — MotionConfig root
`src/app/[locale]/layout.tsx`:
```tsx
import { MotionConfig } from 'motion/react'
// ...
<MotionConfig reducedMotion="user">
  {children}
</MotionConfig>
```

### D4 — Hero inline animations → motion
4× `style={{ animation: 'fadeInUp...' }}` (regels 110/119/133/141/158) vervangen door `motion.div initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }}` met juiste delays (0/0.2/0.4/0.5/0.6s).

### D5 — TrustSignalsGrid → motion stagger + CountUp
`'use client'`, vervang inline animations door `motion.div` parent met `staggerChildren: STAGGER_FAST`. Cijferwaarden via `<CountUp />`.

### D6 — ScrollReveal verify
Check `src/components/motion/ScrollReveal.tsx` op `useReducedMotion()` respect. Anders fix.

### D7 — CountUp component (G1)
`src/components/motion/CountUp.tsx`:
```tsx
'use client'
import { motion, useInView, useMotionValue, useTransform, animate } from 'motion/react'
import { useEffect, useRef } from 'react'

interface CountUpProps {
  to: number
  suffix?: string
  duration?: number
  format?: (n: number) => string
}

export function CountUp({ to, suffix = '', duration = 1.2, format }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => format ? format(v) : String(Math.round(v)))

  useEffect(() => {
    if (inView) {
      const controls = animate(count, to, { duration, ease: [0.23, 1, 0.32, 1] })
      return controls.stop
    }
  }, [inView, to, duration, count])

  return (
    <span ref={ref}>
      <motion.span>{rounded}</motion.span>{suffix}
    </span>
  )
}
```
Gebruik in `TrustSignalsGrid` (`100%`, `9`, `1`, `99.9%`) + `CaseStudyCard` (`4`, `3`).

**Commit**: `chore(motion): migrate framer-motion → motion/react + easings + reduced-motion + CountUp`

---

## Wave 5 — Wow-effecten (6-8u, 8 effecten)

> Per effect: implementatie + **reduced-motion fallback** (G7).

### W5.1 — Linear-style multi-card spotlight (XS, 0kb)
Op `ServicesBento`: parent `onPointerMove` → CSS vars `--mx`, `--my`. Card pseudo:
```css
&::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(300px circle at var(--mx) var(--my),
    rgba(0, 212, 170, 0.06), transparent 40%);
  opacity: 0; transition: opacity 200ms;
}
.group:hover &::before { opacity: 1; }
```
**Reduced-motion fallback**: pure-CSS, geen JS animation — al goed. Geen wijziging nodig.

### W5.2 — Paper Shaders MeshGradient (XS, +15kb)
```bash
npm install @paper-design/shaders-react
```
`src/components/hero/PaperShaderMesh.tsx`:
```tsx
'use client'
import { MeshGradient } from '@paper-design/shaders-react'

export function PaperShaderMesh() {
  return (
    <MeshGradient
      colors={['#0a0d14', '#00d4aa', '#f5a623', '#111520']}
      speed={0.4}
      className="fixed inset-0 -z-10"
    />
  )
}
```
Vervang `<GradientMesh />` in `page.tsx`. Behoud `GradientMesh.tsx` als deprecated fallback voor SSR-issues.
**Reduced-motion fallback**: `useReducedMotion()` — als reduced, render `<GradientMesh />` static (existing component).

### W5.3 — Spline hero scroll-scrub (M, +85kb GSAP lazy)
```bash
npm install gsap
```
In `HeroSpline.tsx`:
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useReducedMotion } from 'motion/react'

gsap.registerPlugin(ScrollTrigger)

export function HeroSpline() {
  const containerRef = useRef<HTMLDivElement>(null)
  const splineRef = useRef<any>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce || !splineRef.current) return
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=100vh',
        scrub: 1,
        onUpdate: (self) => {
          try {
            splineRef.current.setVariable('rotation', self.progress * 360)
            splineRef.current.setVariable('zoom', 1 - self.progress * 0.3)
          } catch { /* variables don't exist in scene */ }
        }
      })
    })
    return () => ctx.revert()
  }, [reduce])

  return <div ref={containerRef}>...{/* Spline mount */}</div>
}
```
**Reduced-motion fallback**: skip ScrollTrigger setup, render static Spline.

### W5.4 — ProcessTimeline pin-stack scrub (M, GSAP herbruik)
Upgrade `ProcessTimeline.tsx`:
```tsx
useEffect(() => {
  if (reduce) return
  const ctx = gsap.context(() => {
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top top',
      end: '+=300vh',
      pin: true,
      scrub: 1,
    })
    // Per-week reveal binnen pinned sectie
    weeks.forEach((_, i) => {
      gsap.to(`.week-${i}`, {
        opacity: 1, y: 0,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: `top top-=${i * 25}%`,
          end: `top top-=${(i + 1) * 25}%`,
          scrub: 1,
        }
      })
    })
  })
  return () => ctx.revert()
}, [reduce])
```
**Reduced-motion fallback**: render static 4-step grid (geen pin, geen scrub).

### W5.5 — Number countup (XS, 0kb — gebruikt G1)
TrustSignalsGrid + CaseStudyCard: vervang harde nummers door `<CountUp to={4} />` etc. Triggert via `useInView` (al in component).
**Reduced-motion fallback**: CountUp checkt `useReducedMotion()` → render final value direct zonder animate.

### W5.6 — Hero kinetic typo (XS, 0kb)
In `page.tsx` headline: word-by-word stagger.
```tsx
const words = t('hero.headlineMain').split(' ')
<h1>
  {words.map((word, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, filter: 'blur(10px)', y: 8 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ delay: i * 0.08, duration: 0.4, ease: EASE_OUT }}
      className="inline-block mr-3"
    >
      {word}
    </motion.span>
  ))}
</h1>
```
**Reduced-motion fallback**: MotionConfig handles automatically (transform/filter uit, opacity blijft).

### W5.7 — MemoryUSP layer-stack reveal (S, 0kb)
Sticky-scroll sectie. 4 layers initial `opacity: 0, x: -40`. Sequentieel reveal via stagger 0.15s bij scroll-in.
```tsx
<motion.div
  variants={{
    visible: { transition: { staggerChildren: 0.15 } }
  }}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
>
  {layers.map((layer, i) => (
    <motion.div
      key={i}
      variants={{
        hidden: { opacity: 0, x: -40 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_OUT } }
      }}
    >
      {layer}
    </motion.div>
  ))}
</motion.div>
```
**Reduced-motion fallback**: MotionConfig handles — geen x-translate, alleen opacity.

### W5.8 — Pricing tier sticky reveal (M, GSAP herbruik) — desktop only
4 tier-sections elk in sticky-container. Mobile: degrade naar normale grid (geen sticky).
```tsx
// In PricingTeaser.tsx
useEffect(() => {
  if (reduce || window.innerWidth < 1024) return
  const ctx = gsap.context(() => {
    tiers.forEach((_, i) => {
      ScrollTrigger.create({
        trigger: `.tier-${i}`,
        start: 'top top',
        end: '+=100vh',
        pin: i < tiers.length - 1,
        pinSpacing: false,
      })
    })
  })
  return () => ctx.revert()
}, [reduce])
```
**Reduced-motion fallback**: render normale grid van 4 tiers (geen sticky, geen pin).
**Mobile fallback**: zelfde grid layout.

**Commits**: 1 per wow-effect (8 commits in W5).

---

## Verificatie per wave

### Globaal na elke wave
```bash
npm run build                          # type + bundle pass
npm run lint                           # ESLint
npm run test:e2e:cross-browser         # 9/9 cross-browser parity
npm run audit:lighthouse               # alleen na W4/W5 (vereist audit:server)
```

### W0
- ICP-sectie geen neon-groen; checkmarks zijn Lucide icons
- Sovereignty-stat linkt naar `/privacy`
- "4 huismerken" zichtbaar in stats-grid (NL/EN/ES)
- Hero gebruikt `dvh` viewport unit

### W1
- 0 em-dashes in `messages/*.json` user-facing values (grep verifieer)
- Nieuwe service descriptions zichtbaar
- Trust strip toont "4 huismerken" framing

### W2
- 9 nieuwe components renderen zonder TS errors
- Services-grid toont 12 cards in nieuwe bento-volgorde
- Sectie-volgorde matcht spec
- Bestaande e2e tests groen (oude selectors nog werkend)
- Acceptance per content-draft: NL-copy zichtbaar = matches plan

### W3
- `aria-labelledby="pillars"` (was badges) + e2e tests mee-bijgewerkt
- FAQ accordion keyboard-toegankelijk (Tab, Enter, Arrow, Home, End)
- Pillars 3-bento layout (geen 3-equal-col)
- Trust 4 numerieke tiles
- Services bento-asymmetrisch
- Performance: LCP < 2.5s, INP < 200ms, CLS < 0.1

### W4
- 0 imports van `'framer-motion'` (`grep -r "from 'framer-motion'" src` returns empty)
- DevTools `prefers-reduced-motion: reduce`: translates/scales uit, opacity blijft
- Hero animaties via motion (geen inline CSS keyframes)
- CountUp component werkt in isolatie + TrustSignalsGrid + CaseStudyCard
- Performance regression: < 5kb bundle delta (rebrand is neutraal)

### W5
- Bundle: +~100kb totaal gzipped (Paper Shaders ~15kb + GSAP ~85kb lazy)
- Lighthouse perf desktop > 90, mobile > 70
- Spline scroll-scrub smooth op M1 + mid-tier laptop
- Spotlight cards: zichtbaar bij cursor-move op desktop, geen layout shift
- Countup animeert vanaf 0 naar target waarde bij scroll-in
- Kinetic typo: hero headline word-by-word reveal bij paint
- MemoryUSP layers stack sequential bij scroll-in
- Pricing sticky reveal alleen desktop, mobile degrades naar normale grid
- Per W5-effect: `prefers-reduced-motion` getest → fallback rendert correct

---

## Open items / follow-up

- **Sindy-foto**: voor `TestimonialBlock` — vragen aan SKC of Higgsfield-generatie (1024×1024 portret, neutrale BG)
- **Daley-foto**: voor `FounderSection` — bestaand of Higgsfield (zelfde formaat)
- **SKC logo**: voor `CaseStudyCard` — bestaand brand asset, SVG preferred
- **R3F memory-cube op `/memory` route**: uitgesteld uit W5, volgende sessie
- **Paper Shaders SSR-compat Next 16**: bevestig tijdens W5.2 build; dynamic-import fallback klaar
- **GSAP licentie**: open-source MIT voor non-commercial OK; commercial Business Green = $99/jaar. Confirm met user vóór W5.3
- **WebGPU**: Spline draait al WebGL2, geen actie
- **EN/ES vertalingen**: NL-content-drafts (sectie boven) zijn leidend, EN/ES tijdens W2 per component

---

## Plan-uitvoering

V2.1 wordt sequentieel uitgevoerd. Atomic commits per task. Per wave: build + lint + cross-browser tests passen voor volgende wave start. Performance audits na W4 en W5. Bij sessie-eind: WIP-commit + handoff-doc met cursor-state.

**Eerste actie: W0 — bugs**.
