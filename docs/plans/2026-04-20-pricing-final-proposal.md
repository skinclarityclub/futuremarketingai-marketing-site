# FMai Pricing Final Proposal — 2026-04-20

> **⚠ SUPERSEDED — 2026-04-29**
>
> Het 5-tier model in dit document (Partner €347 / Growth €2.497 / Pro €4.497 / Ent €7.997 / Founding €997) is op **2026-04-28** vervangen door een workspace-priced model:
>
> - **Partner verwijderd** (legacy DB-rows redirecten naar Founding).
> - **Growth / Professional / Enterprise** zijn nu **lineair per werkruimte**: €499 / €399 / €299 (recalibrated elke 6 maanden op werkelijk credit-verbruik).
> - **Founding €997 levenslang** blijft de fixed anchor — wint mathematisch voor portfolios van 3+ merken.
>
> Live SSoT: `fma-app/src/lib/skills.ts` (`AGENT_TIERS`, `priceForTier`, `creditsForTier`).
> Marketing-site mirror: `fmai-nextjs/src/lib/pricing-data.ts`.
> Migratie-commit: `2edc715` — `feat(pricing): workspace-priced tiers with live slider`.
>
> Dit document blijft staan als historisch artefact dat de overweging vastlegt waarom we van fixed-tier naar workspace-pricing zijn gegaan: de €2.497 → €4.497 stap (+80% voor één workspace meer) was zelf een transparantie-falen dat het lineaire model oplost.

> Synthese van drie parallel research documenten:
> - `2026-04-19-pricing-solo-research.md` — Ronde 1 solo tier research
> - `2026-04-20-pricing-value-analysis.md` — Zijn agency tiers te laag? (Agent 1)
> - `2026-04-20-pricing-credit-economics.md` — Staan credits in verhouding? (Agent 2)
> - `2026-04-20-pricing-skill-gating.md` — Welke skills waar? (Agent 3)

## TL;DR

Drie onafhankelijke onderzoeken convergeren op één conclusie: **FMai's huidige prijzen zijn structureel te laag** voor wat het platform biedt, en de credit-allocaties waren berekend op die te-lage prijzen dus ook te krap. Voor een high-touch AI partner met 20-80 klanten/jaar moet de pricing 40-60% hoger liggen; dat rechtvaardigt tegelijk ruimere credit-budgets die consumptie-anxiety wegnemen.

**Voorgesteld schema**: Partner €347 / Growth €2.497 / Professional €4.497 / Enterprise €7.997 / Founding grandfathered €997 of €1.497 voor nieuwe plekken. Credit-allocaties plus 33-50% boven oude niveau. Skill-gating: Partner 8 skills + 2 add-on, overige tiers alle 12 met tier-caps op de 3 dure skills (Voice / Video Ad / Reel Builder).

## De Finale Prijstabel

| Tier | Prijs/mo | Onboarding | Workspaces | Credits/mo | Skills | Voice | Video Ad | Reel | ManyChat | Support |
|---|---|---|---|---|---|---|---|---|---|---|
| **Partner** | **€347** | €497 | 1 | 1.000 | 8 incl + 2 add-on | ❌ | ❌ | ❌ | add-on €47 | email |
| **Growth** | **€2.497** ⬆ | €1.997 | 5 | 4.000 ⬆ | Alle 12 | 30 min | 4/mo | 4/mo | 200 DMs | email + app |
| **Professional** | **€4.497** ⬆ | €3.997 | 15 | 12.000 ⬆ | Alle 12 | 120 min | 20/mo | 15/mo | 1.000 DMs | Slack + monthly call |
| **Enterprise** | **€7.997** ⬆ | €5.997 | Unlimited | 30.000 ⬆ | Alle 12 + WL + API | Unlimited* | Unlimited* | Unlimited* | Unlimited* | Dedicated CSM + SLA |
| **Founding** | €997 (grandfather) / €1.497 (nieuw) | €0 | Unlimited | 8.000 | Alle 12 | 60 min | 8/mo | 8/mo | 500 DMs | Founder Slack |

⬆ = hoger dan huidige pricing in code
\* = fair use, soft throttle boven uitzonderlijk volume

**Workspace add-on**: €147/mo/extra workspace (was €97, verhoogd om Growth-stretch te blokkeren).

## Credit Packs (generic top-ups)

| Pack | Credits | Price | €/credit | Doelgroep |
|---|---|---|---|---|
| **Partner Top-Up** (NIEUW) | 500 | €39 | €0.078 | Partner swing-month |
| Boost | 2.000 | €149 | €0.075 | Growth overflow |
| Scale | 5.000 | €297 | €0.059 | Professional overflow |
| Unlimited | 15.000 | €697 | €0.046 | Enterprise mega-burst |

## Skill-Specifieke Add-On Packs

Voor dure skills (Groep C) waar tier-caps bereikt worden:

| Pack | Waarde | Prijs |
|---|---|---|
| Partner Static Ads Pack | 5 static ads | €97 |
| Partner ManyChat Pack | 300 DMs/mo | €47 |
| Voice Minutes Pack | 100 min | €147 |
| Video Ads Pack | 10 video ads | €197 |
| Reels Pack | 10 reels | €197 |
| Blog Power Pack | 10 blog articles | €197 |

## Waarom deze getallen

### 1. Waarom Growth €2.497 ipv €1.497

Uit de value-analyse: een FMai-workspace vervangt **0,35-0,50 FTE** aan marketing arbeid. In NL context = €1.650-€2.460 interne loonkost per workspace per maand (€4.200-€5.500 all-in × werkgeverslasten).

- Huidige Growth €1.497 / 5 werkruimtes = **€299/workspace** → 5,5-8x arbitrage voor de klant, 18-27x vs bureau-retainer
- Voorgestelde Growth €2.497 / 5 = **€499/workspace** → nog steeds 3,3-4,9x arbitrage (ruim verdedigbaar)
- De juiste benchmark is niet Buffer ($6) of Ocoya ($19) — dat zijn self-service. Voor high-touch AI partners: **Gong.io ($1.298-$3.000/user/jr + $50K platform fee), Artisan AI ($2K-$5K/mo), Vendasta Premium ($999+$65/seat), fractional CMO ($5K-$15K/mo)**.

Onder €2.000 leest FMai als "self-service tool". Boven €2.000 triggert automatische due-diligence reflex die jouw proof-points (SKC 21 carousels/week, 8-agent OpenClaw, memory system) uitnodigt.

### 2. Waarom credits omhoog van 3k → 4k Growth, 8k → 12k Pro

Uit de economics-analyse: **Clyde als centrale hub consumeert 40-55% van credits per workspace** bij Medium gebruik (30-40 convos/week × 2 credits Sonnet = 240-320 cr alleen Clyde). Huidige 3.000 Growth credits voor 5 workspaces = 600/workspace — dekt bijna alleen Clyde zelf. Medium gebruik breekt.

Nieuwe allocatie 4.000 Growth = **800/workspace** = Medium + 29-40% buffer. Elke tier krijgt vergelijkbare +29-51% buffer. Dit volgt je regel "genoeg credits voor gemiddeld gebruik".

### 3. Waarom Voice/Video Ad/Reel uit Partner

Deze 3 skills hebben de hoogste credit-kosten (5/min, 20/stuk, 25/stuk). Bij solo gebruik:
- Voice 60 min/mo = 300 credits = 30% van Partner allocatie voor één skill
- 10 reels/mo = 250 credits = 25%
- 10 video ads = 200 credits = 20%

Drie effecten van exclusie:
1. **Cannibalisatie mechanisch uitgesloten** — agencies verkopen juist voice+video+reels als premium services aan hun eindklanten
2. **Partner blijft betaalbaar** op €347 zonder marges te verliezen
3. **Natuurlijke upgrade-trigger** naar Growth als solo-klant voice of video wil

### 4. Waarom Founding gesplitst

- **Grandfathered €997** voor de 10 al-bestaande plekken (contract-eer)
- **€1.497** voor nieuwe Founding plekken → 50% onder nieuwe Growth €2.497 = nog steeds duidelijke deal
- Founding caps op **Pro-level** (niet Enterprise) zodat Ent-verkopen niet gekannibaliseerd worden bij €7.997 vs €1.497 founding

## High-Touch Signalen op Website (nieuw)

Uit value-analyse: om €2.497+ prijspunt te rechtvaardigen moet de site high-touch boutique framing expliciet uitstralen:

1. **Capaciteit-counter**: "14/20 Partner plekken 2026 beschikbaar" (Fomo + schaarste)
2. **Application-only**: geen "Sign up" knoppen — overal "Apply for a strategy call" / "Plan een gesprek"
3. **Owner-signed onboarding**: "4 weken partnership-onboarding, persoonlijk met Daley"
4. **Anti-ICP lijst**: expliciet "Wij werken NIET met: [agencies <€300K revenue, >30 FTE, branding/creative-only, startups zonder budget]"
5. **Commitment-terms**: 12-24 maanden commitment op Professional+ en Enterprise
6. **Partners tonen**: SkinClarity Club als prominente case + 2-3 andere bij groei (geen anonieme quotes meer)
7. **Prijzen ZICHTBAAR** — niet "contact us for pricing", want dat ondergraaft de premium partnership framing en maakt prospects huiverig

## Samengevoegde Open Beslissingen (alleen de echte keuzes)

Uit 3 rapporten had ik 15+ vragen — hier de 7 die er echt toe doen:

### Prijs-keuzes
1. **Growth prijs: €2.497 of €2.997?** €2.497 is safer voor conversie bij launch. €2.997 = huidige Professional → iedereen shift één tier omhoog. Mijn advies: **€2.497** start, verhoog later bij sterke demand.
2. **Enterprise prijs: €7.997 of €6.997?** Agent 1 beveelt €7.997 voor 60% stijging. €6.997 is minder disruptive. Advies: **€7.997** — als je premium positioneert, doe het dan fully.
3. **Partner prijs: €347 of €447?** €347 behoud oorspronkelijke advies, €447 matcht betere marge-per-touch. Advies: **€347** — solo entrepreneurs hebben hard budget-plafond rond €400.

### Skill/credit keuzes
4. **Static ads op Partner: metered (3/mo incl) of add-on (€97 pack)?** Credit-agent stelt metered voor, skill-gating agent stelt add-on pack voor. Advies: **beide — 3/mo included + €97 pack voor meer**. Beste van beide werelden.
5. **ManyChat op Partner: add-on €47 of gewoon included?** ManyChat DM overlapt deels met Lead Qualifier. Advies: **add-on €47** — voorkomt skill-verwatering Partner, creëert natuurlijke upsell.

### Positionering keuzes
6. **Founding nieuwe plekken: €997 of €1.497?** €997 grandfather oud, €1.497 nieuw. Of allemaal €997 voor consistency. Advies: **grandfather €997 voor huidige 10 plekken, €1.497 voor 5 nieuwe Founding plekken tot cap 15**. Geeft upgrade-ruimte naar €2.497 Growth.
7. **Commitment-terms: 12 of 24 maanden op Professional+?** 12 matcht GHL Unlimited, 24 matcht premium B2B norm. Advies: **12 maanden verplicht op alle tiers behalve Partner (maandelijks), 24 als optioneel voor 15% korting**.

## Implementatie Impact

### Code changes (fma-app)
- `src/lib/skills.ts` — update AGENT_TIERS prices + maxClients + included credits
- Nieuwe tier key `PARTNER` toevoegen
- Skill-gating logic per tier (momenteel alle tiers includen alle skills)
- Nieuwe `SKILL_CAPS` constant met per-tier caps voor Voice/Video Ad/Reel/ManyChat/Blog
- Nieuwe credit packs en skill-specifieke packs in CREDIT_PACKS
- Stripe: 5 nieuwe price IDs (Partner + updated prices), 6 skill-pack price IDs
- Migration: tier validation, skip-billing flag voor grandfathered Founding

### Website changes
- Pricing page: 5-kolommen met nieuwe prijzen + skill-matrix + caps
- CTAs: alle "Sign up" → "Apply for a call"
- Nieuwe capaciteit-counter component
- Founding sectie: differentiatie grandfather vs nieuw
- Anti-ICP sectie (nieuw)
- Application form (vervangt direct checkout)

### Migration strategie voor bestaande klanten (voor zover die er zijn)
- Grandfather alle actieve subscriptions op huidige prijs voor 12 maanden
- Communicatie 30 dagen vooraf
- Optie voor vrijwillige upgrade met bonus credits

## Bronnen

- Agent 1: `2026-04-20-pricing-value-analysis.md`
- Agent 2: `2026-04-20-pricing-credit-economics.md`
- Agent 3: `2026-04-20-pricing-skill-gating.md`
- Ronde 1: `2026-04-19-pricing-solo-research.md`
- SSoT: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts`
