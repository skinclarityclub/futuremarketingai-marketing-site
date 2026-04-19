# FMai Credit Economics Per Tier — 2026-04-20

> Vervolg op `2026-04-19-pricing-solo-research.md`. Pivot: FMai wordt
> high-touch boutique met 5 tiers. Partner (€347) is de nieuwe entry-SKU
> voor solo entrepreneurs. Dit document herberekent credit-allocaties,
> included-vs-addon skill matrix en credit packs vanuit de owner's
> eigen drie regels:
>
> 1. Klant heeft genoeg credits voor GEMIDDELD gebruik — geen anxiety.
> 2. Extra dure skills (Voice, Video Ad, Reel) via credit packs in lagere tiers.
> 3. Hogere tiers = meer ruimte voor dure skills INCLUDED.

---

## CREDIT_COSTS Reference

Bron: `src/lib/skills.ts` (SSoT).

| Skill | Action | Credits |
|---|---|---|
| socialMedia | social_post | **2** |
| socialMedia | caption | 1 |
| socialMedia | schedule_post | 1 |
| socialMedia | engage | 1 |
| blogFactory | article | **15** |
| voiceAgent | call_minute | **5** |
| leadQualifier | score_lead | 2 |
| adCreator | static_ad | **10** |
| adCreator | video_ad | **20** |
| reelBuilder | reel | **25** |
| seoAnalyst | audit | 5 |
| seoAnalyst | report | 3 |
| emailManagement | campaign | 5 |
| manychatDm | dm_batch_10 | 2 |
| reporting | report | 5 |
| intelligence | research_query | 3 |
| clyde | chat_haiku | 1 |
| clyde | chat_sonnet | **2** |
| clyde | chat_opus | 5 |

**Unit bundels die we hergebruiken**:
- `full social post` = social_post (2) + caption (1) + schedule_post (1) = **4 credits**
- `full blog article` = article (15) + schedule_post (1) = **16 credits** (we ronden af op 15, de schedule valt binnen engage caps)
- `voice minute` = call_minute = **5 credits**
- `video ad` = video_ad = **20 credits**
- `reel` = reel = **25 credits**
- `static ad` = static_ad = **10 credits**
- `Clyde conversation` (avg sonnet, 5 msgs) = 5 × 2 = **10 credits per conversation** — let op: dit is per gesprek, niet per message.

---

## Persona Definitions

### Partner Personas (€347 / 1 workspace / 8 skills — geen Voice, Video Ad, Reel, ManyChat)

Skills beschikbaar: socialMedia, blogFactory, reporting, intelligence, leadQualifier, seoAnalyst, emailManagement, clyde. Static ads via add-on.

**P1 — Partner Licht ("coach / consultant met Instagram+LinkedIn")**
- 3 social posts/wk (IG + LinkedIn duplicate = 6 posts, maar telt als 3 unieke)
- 1 blog/mo
- 2 reports/mo
- 15 Clyde conversations/wk (mix haiku+sonnet, avg 2 cr per convo = 7 msgs)
- 1 research query/wk

**P2 — Partner Medium ("e-commerce solopreneur, Shopify store 0-5 FTE")**
- 5 social posts/wk (3 IG + 2 LinkedIn)
- 2 blogs/mo (SEO content)
- 4 reports/mo (weekly)
- 25 Clyde conversations/wk
- 2 research queries/wk
- 1 SEO audit/mo
- 10 lead qualifier scores/mo (chatbot op site)
- 1 email campaign/mo
- **Add-on trigger**: 2 static ads/mo

**P3 — Partner Heavy ("groei-solopreneur, content machine")**
- 10 social posts/wk (IG + LinkedIn + TikTok captions)
- 4 blogs/mo
- 4 reports/mo
- 40 Clyde conversations/wk (daily heavy use)
- 3 research queries/wk
- 2 SEO audits/mo
- 30 lead qualifier scores/mo
- 2 email campaigns/mo (segment-based)
- **Add-on trigger**: 4 static ads/mo

---

### Growth Personas (€1.497 / 5 workspaces / alle 12 skills)

**G1 — Growth Licht ("starting agency, 5 basic clients")**
- Per workspace ~ Partner Medium, maar minder intens
- 4 social posts/wk × 5 = 20 posts/wk totaal
- 1 blog/mo × 5 = 5 blogs/mo
- 3 reports/mo × 5 = 15 reports
- 15 Clyde convos/wk × 5 = 75 convos/wk
- 1 research/wk × 5 = 5 queries/wk
- 1 SEO audit/mo per client = 5 audits
- 5 lead scores/mo × 5 = 25 scores
- Geen voice, geen video ads, geen reels nog

**G2 — Growth Medium ("actieve agency, 5 clients met ad+voice op 1 client")**
- Baseline: 5× Partner Medium
- 5 social/wk × 5 = 25/wk totaal
- 2 blogs/mo × 5 = 10
- 4 reports/mo × 5 = 20
- 25 Clyde convos/wk × 5 = 125/wk
- 2 research/wk × 5 = 10
- 1 SEO audit/mo × 5 = 5
- 10 lead scores × 5 = 50
- 1 email campaign × 5 = 5
- **Dure skills toegevoegd**:
  - 30 voice minutes/mo (1 workspace inbound receptie)
  - 3 video ads/mo (2 workspaces actief op Meta)
  - 2 reels/mo (1 workspace Instagram Reels)
  - 3 static ads/mo (2 workspaces)

**G3 — Growth Heavy ("full-service agency, 5 clients allen met ads")**
- Baseline: 5× Partner Heavy
- 10 social/wk × 5 = 50/wk
- 4 blogs/mo × 5 = 20
- 4 reports/mo × 5 = 20
- 40 convos/wk × 5 = 200/wk
- 3 research/wk × 5 = 15
- 2 audits × 5 = 10
- 30 lead scores × 5 = 150
- 2 emails × 5 = 10
- **Dure skills max**:
  - 60 voice minutes/mo (1 workspace primary + 2 backup)
  - 8 video ads/mo (all 5 workspaces)
  - 5 reels/mo (3 workspaces)
  - 10 static ads/mo (all 5)

---

### Professional Personas (€2.997 / 15 workspaces / alle 12 skills)

**PR1 — Professional Licht ("mid agency, 15 basic clients")**
- 15× Partner Medium baseline, minimal voice/video/reel use
- Social: 5/wk × 15 = 75/wk
- Blogs: 2/mo × 15 = 30
- Reports: 4/mo × 15 = 60
- Clyde: 25 convos/wk × 15 = 375/wk
- Research: 2/wk × 15 = 30
- SEO audits: 1 × 15 = 15
- Lead scores: 10 × 15 = 150
- Emails: 1 × 15 = 15
- Voice: 30 min/mo (1 workspace testing)
- Video ads: 2/mo (1 workspace)
- Reels: 1/mo (1 workspace)
- Static ads: 5/mo (2-3 workspaces)

**PR2 — Professional Medium ("15 actieve clients, mixed services")**
- Social: 7/wk × 15 = 105/wk
- Blogs: 3/mo × 15 = 45
- Reports: 4/mo × 15 = 60
- Clyde: 30 convos/wk × 15 = 450/wk
- Research: 2/wk × 15 = 30
- SEO audits: 1.5 avg × 15 = 22
- Lead scores: 15 × 15 = 225
- Emails: 1.5 × 15 = 22
- **Dure skills**:
  - 120 voice minutes/mo (5 workspaces inbound)
  - 10 video ads/mo (5 workspaces)
  - 6 reels/mo (3 workspaces)
  - 15 static ads/mo (8 workspaces)

**PR3 — Professional Heavy ("15 clients, ads+voice op meeste")**
- Social: 10/wk × 15 = 150/wk
- Blogs: 4/mo × 15 = 60
- Reports: 4/mo × 15 = 60
- Clyde: 40 convos/wk × 15 = 600/wk
- Research: 3/wk × 15 = 45
- SEO audits: 2 × 15 = 30
- Lead scores: 25 × 15 = 375
- Emails: 2 × 15 = 30
- **Dure skills max**:
  - 200 voice minutes/mo (10 workspaces)
  - 20 video ads/mo (10 workspaces)
  - 10 reels/mo (6 workspaces)
  - 25 static ads/mo (12 workspaces)

---

### Enterprise Personas (€4.997 / unlimited / alle 12 skills)

**E1 — Enterprise Medium ("25-30 clients, volledig actief")**
- Gebaseerd op 25 workspaces avg (niet echt "unlimited" maar normale range)
- Social: 7/wk × 25 = 175/wk
- Blogs: 3/mo × 25 = 75
- Reports: 4/mo × 25 = 100
- Clyde: 30 convos/wk × 25 = 750/wk
- Research: 2/wk × 25 = 50
- SEO audits: 1.5 × 25 = 37
- Lead scores: 15 × 25 = 375
- Emails: 1.5 × 25 = 37
- **Dure skills**:
  - 250 voice minutes/mo
  - 20 video ads/mo
  - 12 reels/mo
  - 30 static ads/mo

**E2 — Enterprise Heavy ("50+ workspaces, agency at scale")**
- 50 workspaces avg
- Social: 8/wk × 50 = 400/wk
- Blogs: 3/mo × 50 = 150
- Reports: 4/mo × 50 = 200
- Clyde: 35 convos/wk × 50 = 1.750/wk
- Research: 2/wk × 50 = 100
- SEO audits: 1.5 × 50 = 75
- Lead scores: 20 × 50 = 1.000
- Emails: 2 × 50 = 100
- **Dure skills max**:
  - 500 voice minutes/mo
  - 40 video ads/mo
  - 25 reels/mo
  - 60 static ads/mo

---

### Founding Member (€997 / unlimited / 10 agency plekken / alle 12 skills)

Founding is identiek aan Professional qua skills + unlimited workspaces + lifetime lock-in. Credit-allocatie moet tussen Growth en Pro liggen omdat deze klanten goodwill earnen én beperkt zijn qua productmarktfit feedback. Persona = "Growth Medium to Professional Light" range.

**F1 — Founding Typical ("ambassador agency, 8-12 clients")**
- Neem gemiddeld 10 workspaces, Growth Medium intensiteit per workspace
- Social: 5/wk × 10 = 50/wk
- Blogs: 2/mo × 10 = 20
- Reports: 4/mo × 10 = 40
- Clyde: 25 convos/wk × 10 = 250/wk
- Research: 2/wk × 10 = 20
- SEO audits: 1 × 10 = 10
- Lead scores: 10 × 10 = 100
- Emails: 1 × 10 = 10
- Voice: 60 min/mo (2 workspaces)
- Video ads: 5/mo
- Reels: 3/mo
- Static ads: 6/mo

---

## Credit Consumption Per Persona

Formules:
- full social post = 4 credits (2 post + 1 caption + 1 schedule)
- blog = 15 credits
- report = 5 credits
- Clyde conversation avg = 2 credits (sonnet, single response) — BUT real user
  heeft meerdere turns per convo. We gebruiken 2 cr/convo als proxy voor
  "1-2 Sonnet messages per conversation" aangezien de meeste Clyde-gebruikers
  geen 7-turn dialogen hebben maar quick-command style. Voor heavy users
  rekenen we 3 cr/convo.
- research query = 3 credits
- SEO audit = 5 credits
- lead score = 2 credits
- email campaign = 5 credits
- voice minute = 5 credits
- video ad = 20 credits
- reel = 25 credits
- static ad = 10 credits
- **Maand factor = 4.33 weken**

---

### Partner — maandelijks credit verbruik

**P1 — Partner Licht**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 3/wk × 4.33 × 4 | 52 |
| Blogs | 1 × 15 | 15 |
| Reports | 2 × 5 | 10 |
| Clyde convos | 15/wk × 4.33 × 2 | 130 |
| Research | 1/wk × 4.33 × 3 | 13 |
| **Totaal** | | **220** |

**P2 — Partner Medium**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 5/wk × 4.33 × 4 | 87 |
| Blogs | 2 × 15 | 30 |
| Reports | 4 × 5 | 20 |
| Clyde convos | 25/wk × 4.33 × 2 | 217 |
| Research | 2/wk × 4.33 × 3 | 26 |
| SEO audit | 1 × 5 | 5 |
| Lead scores | 10 × 2 | 20 |
| Email campaign | 1 × 5 | 5 |
| **Subtotaal included** | | **410** |
| Static ads (add-on) | 2 × 10 | 20 |
| **Met static ad gebruik** | | **430** |

**P3 — Partner Heavy**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 10/wk × 4.33 × 4 | 173 |
| Blogs | 4 × 15 | 60 |
| Reports | 4 × 5 | 20 |
| Clyde convos (heavy) | 40/wk × 4.33 × 3 | 520 |
| Research | 3/wk × 4.33 × 3 | 39 |
| SEO audits | 2 × 5 | 10 |
| Lead scores | 30 × 2 | 60 |
| Emails | 2 × 5 | 10 |
| **Subtotaal included** | | **892** |
| Static ads (add-on) | 4 × 10 | 40 |
| **Met static ad gebruik** | | **932** |

---

### Growth — maandelijks credit verbruik

**G1 — Growth Licht**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 20/wk × 4.33 × 4 | 346 |
| Blogs | 5 × 15 | 75 |
| Reports | 15 × 5 | 75 |
| Clyde | 75/wk × 4.33 × 2 | 650 |
| Research | 5/wk × 4.33 × 3 | 65 |
| SEO audits | 5 × 5 | 25 |
| Lead scores | 25 × 2 | 50 |
| **Totaal** | | **1.286** |

**G2 — Growth Medium**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 25/wk × 4.33 × 4 | 433 |
| Blogs | 10 × 15 | 150 |
| Reports | 20 × 5 | 100 |
| Clyde | 125/wk × 4.33 × 2 | 1.083 |
| Research | 10/wk × 4.33 × 3 | 130 |
| SEO audits | 5 × 5 | 25 |
| Lead scores | 50 × 2 | 100 |
| Emails | 5 × 5 | 25 |
| Voice | 30 × 5 | 150 |
| Video ads | 3 × 20 | 60 |
| Reels | 2 × 25 | 50 |
| Static ads | 3 × 10 | 30 |
| **Totaal** | | **2.336** |

**G3 — Growth Heavy**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 50/wk × 4.33 × 4 | 866 |
| Blogs | 20 × 15 | 300 |
| Reports | 20 × 5 | 100 |
| Clyde (heavy) | 200/wk × 4.33 × 3 | 2.598 |
| Research | 15/wk × 4.33 × 3 | 195 |
| SEO audits | 10 × 5 | 50 |
| Lead scores | 150 × 2 | 300 |
| Emails | 10 × 5 | 50 |
| Voice | 60 × 5 | 300 |
| Video ads | 8 × 20 | 160 |
| Reels | 5 × 25 | 125 |
| Static ads | 10 × 10 | 100 |
| **Totaal** | | **5.144** |

---

### Professional — maandelijks credit verbruik

**PR1 — Professional Licht**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 75/wk × 4.33 × 4 | 1.299 |
| Blogs | 30 × 15 | 450 |
| Reports | 60 × 5 | 300 |
| Clyde | 375/wk × 4.33 × 2 | 3.247 |
| Research | 30/wk × 4.33 / 4.33 × 3 | ~90 (2/wk × 15 ws × 3) |
| *Correct: Research* | 30/mo × 3 (research already mo totaal) | 90 |
| SEO audits | 15 × 5 | 75 |
| Lead scores | 150 × 2 | 300 |
| Emails | 15 × 5 | 75 |
| Voice | 30 × 5 | 150 |
| Video ads | 2 × 20 | 40 |
| Reels | 1 × 25 | 25 |
| Static ads | 5 × 10 | 50 |
| **Totaal** | | **6.201** |

*Let op*: Clyde is dominant. PR1 Licht gebruikt 3.247 Clyde credits op 6.201 totaal = 52%. Dit is realistisch voor een 15-workspace agency waarin 25 Clyde convos/wk per workspace normaal is (Clyde is de central orchestrator, wordt voor alles gebruikt). Zie "Open Vragen" #3 over Clyde capping.

**PR2 — Professional Medium**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 105/wk × 4.33 × 4 | 1.819 |
| Blogs | 45 × 15 | 675 |
| Reports | 60 × 5 | 300 |
| Clyde | 450/wk × 4.33 × 2 | 3.897 |
| Research | 30/mo × 3 | 90 |
| SEO audits | 22 × 5 | 110 |
| Lead scores | 225 × 2 | 450 |
| Emails | 22 × 5 | 110 |
| Voice | 120 × 5 | 600 |
| Video ads | 10 × 20 | 200 |
| Reels | 6 × 25 | 150 |
| Static ads | 15 × 10 | 150 |
| **Totaal** | | **8.551** |

**PR3 — Professional Heavy**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 150/wk × 4.33 × 4 | 2.598 |
| Blogs | 60 × 15 | 900 |
| Reports | 60 × 5 | 300 |
| Clyde (heavy) | 600/wk × 4.33 × 3 | 7.794 |
| Research | 45/mo × 3 | 135 |
| SEO audits | 30 × 5 | 150 |
| Lead scores | 375 × 2 | 750 |
| Emails | 30 × 5 | 150 |
| Voice | 200 × 5 | 1.000 |
| Video ads | 20 × 20 | 400 |
| Reels | 10 × 25 | 250 |
| Static ads | 25 × 10 | 250 |
| **Totaal** | | **14.677** |

---

### Enterprise — maandelijks credit verbruik

**E1 — Enterprise Medium (25 workspaces)**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 175/wk × 4.33 × 4 | 3.031 |
| Blogs | 75 × 15 | 1.125 |
| Reports | 100 × 5 | 500 |
| Clyde | 750/wk × 4.33 × 2 | 6.495 |
| Research | 50/mo × 3 | 150 |
| SEO audits | 37 × 5 | 185 |
| Lead scores | 375 × 2 | 750 |
| Emails | 37 × 5 | 185 |
| Voice | 250 × 5 | 1.250 |
| Video ads | 20 × 20 | 400 |
| Reels | 12 × 25 | 300 |
| Static ads | 30 × 10 | 300 |
| **Totaal** | | **14.671** |

**E2 — Enterprise Heavy (50 workspaces)**

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 400/wk × 4.33 × 4 | 6.928 |
| Blogs | 150 × 15 | 2.250 |
| Reports | 200 × 5 | 1.000 |
| Clyde (heavy) | 1.750/wk × 4.33 × 3 | 22.733 |
| Research | 100/mo × 3 | 300 |
| SEO audits | 75 × 5 | 375 |
| Lead scores | 1.000 × 2 | 2.000 |
| Emails | 100 × 5 | 500 |
| Voice | 500 × 5 | 2.500 |
| Video ads | 40 × 20 | 800 |
| Reels | 25 × 25 | 625 |
| Static ads | 60 × 10 | 600 |
| **Totaal** | | **40.611** |

E2 Heavy = 40.611 credits per maand. Dit is meer dan 2x de huidige Enterprise allocatie (20.000). Het signaal: Enterprise moet óf Clyde capping krijgen óf naar 40k-50k verhoogd worden (zie Gap Analysis).

---

### Founding — F1 Typical

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 50/wk × 4.33 × 4 | 866 |
| Blogs | 20 × 15 | 300 |
| Reports | 40 × 5 | 200 |
| Clyde | 250/wk × 4.33 × 2 | 2.165 |
| Research | 20/mo × 3 | 60 |
| SEO audits | 10 × 5 | 50 |
| Lead scores | 100 × 2 | 200 |
| Emails | 10 × 5 | 50 |
| Voice | 60 × 5 | 300 |
| Video ads | 5 × 20 | 100 |
| Reels | 3 × 25 | 75 |
| Static ads | 6 × 10 | 60 |
| **Totaal** | | **4.426** |

---

## Gap Analysis Per Tier

Huidige allocaties (skills.ts): Growth 3.000 / Pro 8.000 / Ent 20.000 / Founding 10.000. Partner is nieuw — geen baseline.

| Tier | Huidige inclusive | Light verbruik | Medium verbruik | Heavy verbruik | Verdict |
|---|---|---|---|---|---|
| **Partner** (NEW €347) | — (voorstel: 800) | 220 | 410 (430 met 2 static ads) | 892 (932 met ads) | 800 dekt Medium comfortable, Heavy loopt over bij add-ons → **raise naar 1.000** of push Heavy naar Growth |
| **Growth** €1.497 | 3.000 | 1.286 | 2.336 | 5.144 | Medium past binnen 3.000 (surplus +664). Heavy BREAKS (deficit −2.144). → **raise naar 4.000** om Heavy een ademende buffer te geven |
| **Professional** €2.997 | 8.000 | 6.201 | 8.551 | 14.677 | Licht past (surplus +1.799). Medium BREAKS (deficit −551). Heavy BREAKS zwaar (deficit −6.677). → **raise naar 12.000** |
| **Enterprise** €4.997 | 20.000 | — | 14.671 | 40.611 | Medium past (surplus +5.329). Heavy BREAKS zwaar (deficit −20.611). → **raise naar 30.000** en/of Clyde cappen |
| **Founding** €997 | 10.000 | — | 4.426 | — | Surplus +5.574. Founding allocatie is te ruim — ofwel bewuste goodwill (OK voor lifetime founders) ofwel verlagen naar 6.000-8.000 |

**Hoofdbevinding**: huidige allocaties dekken Light/Medium maar knakken op Heavy in alle tiers boven Partner. De primaire oorzaak is **Clyde consumptie** — bij agency-schaal is Clyde de centrale hub (30+ convos/wk per workspace) waardoor Clyde alleen al 40-55% van het budget opeet. Twee paden:

1. **Verhoog allocaties** (pad van minste weerstand, kostenverhoging).
2. **Cap Clyde per workspace** (bijv. 500 convos/mo/workspace) met top-up. Houdt allocaties stabiel.

Combinatie wordt aanbevolen: verhoog allocaties naar Medium-comfort niveau + implementeer Clyde soft-cap op Heavy usage.

---

## Recommended Allocations

**Basisregel**: allocatie = Medium verbruik × 1.15 (15% veiligheidsmarge). Heavy users overschrijden en koop een credit pack. Dit voelt niet als anxiety want klant weet: mijn normale gebruik past, alleen piek-maanden triggert pack.

| Tier | Nieuwe allocatie | Rationale | Cost per credit (€) |
|---|---|---|---|
| **Partner** €347 | **1.000** | P2 Medium is 410 incl. static ads. Licht 220 heeft ruime buffer. Heavy 932 past nu binnen. Simpel rond getal, makkelijk te marketen. Static ads via pack op zwaar usage. | €0.347 |
| **Growth** €1.497 | **4.000** | G2 Medium 2.336 × 1.15 = 2.686 minimum. 4.000 geeft G2 veel lucht én Heavy G3 (5.144) binnen 1 Boost pack top-up. | €0.374 |
| **Professional** €2.997 | **12.000** | PR2 Medium 8.551 × 1.15 = 9.834. 12.000 dekt Medium volledig + 40% buffer richting Heavy. PR3 Heavy (14.677) triggert 1 Boost. | €0.250 |
| **Enterprise** €4.997 | **30.000** | E1 Medium 14.671 × 1.15 = 16.872. 30.000 dekt Medium ruim + 73% buffer richting Heavy. E2 Heavy (40.611) triggert 1 Scale pack. | €0.167 |
| **Founding** €997 | **8.000** | F1 Typical 4.426 × 1.15 = 5.090. 8.000 is founder goodwill boost (81% buffer), minder extravagant dan huidige 10.000. Laat ruimte voor voice/video experiment. | €0.125 |

**Cost-per-credit curve**: Partner €0.347 > Growth €0.374 > Pro €0.250 > Ent €0.167 > Founding €0.125.

- Partner/Growth zijn premium per-credit (≈ 5x Boost pack prijs) — reflects platform setup value, niet per-credit cost.
- Pro/Ent/Founding dalen stevig, logische upgrade-economics.
- Growth is *marginaal* duurder per credit dan Partner (€0.374 vs €0.347). Dit is OK want Growth pakket bevat 5 workspaces + alle 12 skills included (voice/video/reel). Partner mist 4 skills, dus effectieve value is lager.

**Alternatief met Clyde cap**: als je Clyde cap op 500 convos/mo per workspace implementeert, dan kunnen allocaties **stabiel** blijven:
- Partner: 800, Growth: 3.000, Pro: 8.000, Ent: 20.000, Founding: 10.000.
- Dit vereist UI-werk voor Clyde usage bar per workspace + graceful degradation naar haiku model bij cap-bijna.

---

## Included vs Add-On Skills Matrix

Legende:
- **Included** = onbeperkt fair-use binnen het credit budget (geen skill-specific cap)
- **Metered cap** = included maar met hard workspace-level maandcap, daarboven pay-per-use
- **Pack add-on** = toegankelijk via Credit Pack of eigen skill pack; niet in default budget
- **Not available** = skill is niet te activeren op deze tier

| Skill | Partner (€347) | Growth (€1.497) | Professional (€2.997) | Enterprise (€4.997) | Founding (€997) |
|---|---|---|---|---|---|
| socialMedia | Included | Included | Included | Included | Included |
| blogFactory | Metered cap 6/mo | Included | Included | Included | Included |
| reporting | Included | Included | Included | Included | Included |
| intelligence | Included | Included | Included | Included | Included |
| leadQualifier | Metered cap 40/mo | Included | Included | Included | Included |
| seoAnalyst | Metered cap 3/mo | Included | Included | Included | Included |
| emailManagement | Metered cap 4/mo | Included | Included | Included | Included |
| clyde | Metered cap 150 convos/mo | Metered cap 500/mo/ws | Metered cap 800/mo/ws | Included (fair use 1.500/ws) | Included (fair use) |
| **adCreator (static)** | **Pack add-on** | Metered cap 20/mo | Metered cap 50/mo | Included | Included |
| **adCreator (video)** | **Not available** | Metered cap 10/mo | Metered cap 30/mo | Metered cap 100/mo | Metered cap 50/mo |
| **reelBuilder** | **Not available** | Metered cap 5/mo | Metered cap 20/mo | Metered cap 50/mo | Metered cap 25/mo |
| **voiceAgent** | **Not available** | Metered cap 30 min/mo | Metered cap 120 min/mo | Metered cap 500 min/mo | Metered cap 150 min/mo |
| manychatDm | Not available | Included | Included | Included | Included |

**Waarom deze matrix**:

1. **Partner heeft geen Voice / Video Ad / Reel** (conform de eigenaar's pivot). Static ads als pack add-on (zie Credit Packs hieronder). Clyde hard gecapped op 150 convos om credit budget te beschermen (hub-gebruik is grootste cost driver).

2. **Growth krijgt de 3 dure skills included maar met caps die matchen met de medium persona**:
   - Voice 30 min/mo = G2 persona (150 credits van 4.000). Extra via pack.
   - Video ads 10/mo = 200 credits. Buffer voor G2-G3.
   - Reels 5/mo = 125 credits. Matcht G2.
   - Static ads 20/mo = 200 credits.
   Totaal dure skills capped: 675 credits van 4.000. Laat 3.325 over voor basis work.

3. **Professional caps zijn 4x Growth** op dure skills (voice 120, video 30, reels 20) om PR2 Medium te accommoderen binnen 12.000.

4. **Enterprise caps zijn 4x Professional** op video/reel, voice 500 (dekkend maar niet onbeperkt). Static ads unlimited (included) want E2 Heavy 600 credits is niks in 30.000.

5. **Founding zit tussen Growth en Pro** (matcht F1 Typical persona). Voice 150 min, video 50, reels 25, static unlimited. Reflecteert lifetime-goodwill zonder Enterprise level te geven.

6. **Clyde metering** is de grootste nieuwe beleidskeuze. Zie "Open Vragen" #3.

---

## Credit Pack Redesign

Huidige packs:

| Pack | Credits | Price | Per credit |
|---|---|---|---|
| Boost | 2.000 | €149 | €0.075 |
| Scale | 5.000 | €297 | €0.059 |
| Unlimited | 15.000 | €697 | €0.046 |

**Analyse vs nieuwe tiers**:

- **Partner (€347, 1.000 credits)** kan 200-400 credits overage hebben in piek-maanden. Boost 2.000 is **2x te groot** voor een Partner. Dit leidt tot packs-sit-unused → waste-perception → churn.
- **Growth (€1.497, 4.000 credits)** met G3 Heavy (5.144): overage 1.144 → Boost 2.000 past perfect.
- **Pro (€2.997, 12.000 credits)** met PR3 Heavy (14.677): overage 2.677 → Boost 2.000 nipt, Scale 5.000 iets ruim.
- **Ent (€4.997, 30.000 credits)** met E2 Heavy (40.611): overage 10.611 → tussen Scale (5.000) en Unlimited (15.000). Unlimited past.
- **Founding (€997, 8.000 credits)** overage scenario's laag, past bij Boost.

**Nieuwe pack structuur aanbevolen**:

| Pack | Credits | Price | Per credit | Doel |
|---|---|---|---|---|
| **Partner Top-Up** (NEW) | 500 | €39 | €0.078 | Partner overage (1-5 extra social days, 2 static ads) |
| Boost | 2.000 | €149 | €0.075 | Growth / Founding overage |
| Scale | 5.000 | €297 | €0.059 | Pro / Enterprise overage |
| Unlimited | 15.000 | €697 | €0.046 | Enterprise spike / campaigns |

**Waarom Partner Top-Up €39/500 cr**:
- Psychologisch <€50: geen budget-approval bij solopreneur
- 500 credits = 125 social posts of 2 static ad campagnes of 100 voice minutes (als voice ooit Partner add-on wordt — nee)
- Per-credit €0.078 is marginaal hoger dan Boost €0.075 — reflects small-pack premium, consistent met Metronome findings over "small pack premium" (3-5% normal)

**Static Ads Pack voor Partner (NEW)**:
Partner heeft Static Ads als "Pack add-on" in de matrix. Implementatie-optie:
- **Optie A**: bundeled in Partner Top-Up (klant kiest zelf wat ze met credits doen).
- **Optie B**: skill-specific "Static Ads Pack" — 10 static ads voor €69 (€6.90/ad, betere marge dan credits).
- Aanbeveling: **Optie A** — minder SKUs, maximum flexibiliteit, credit model consistent.

**Unlimited voor Founding?**
Founding krijgt 8.000. Een founding member die 10 workspaces draait kan 4.426 baseline + Heavy modes trigger ~6.500-7.000 met dure skills. Binnen 8.000 met redelijke buffer. Unlimited pack komt alleen in beeld bij echt extreme gebruik — OK want Founding is geen growth SKU.

---

## Scarcity/Abundance Check

Benchmark context: Jasper Pro $69/mo = unlimited words. ChatGPT Plus $20 = unlimited in rate limits. Perception is dat modern SaaS-AI "unlimited-feel" heeft.

**Per tier abundance test** (voelt klant het als "genoeg"?):

**Partner €347 / 1.000 credits**
- Medium P2 gebruikt 410 credits (41% budget) → surplus 59%.
- Licht P1 gebruikt 220 credits (22%) → surplus 78%.
- Heavy P3 gebruikt 892 (89%) → tight maar past.
- **Verdict**: Medium voelt abundant (halve budget op), Heavy voelt tight. Add-on bij 900+ is natural upgrade trigger naar Growth of pack. **OK**.
- Framing aanbeveling: presenteer als "~50-60 content items/mo" in UI, credits als secundaire metric. Lost anxiety op.

**Growth €1.497 / 4.000 credits**
- G2 Medium 2.336 (58%) → surplus 42%.
- G3 Heavy 5.144 (128%) → deficit 28%.
- **Verdict**: Medium voelt comfortabel. Heavy klanten moeten upgraden of Boost pack kopen. **OK mits Heavy klanten al het scheiding-signaal naar Pro krijgen**.

**Professional €2.997 / 12.000 credits**
- PR2 Medium 8.551 (71%) → surplus 29%.
- PR3 Heavy 14.677 (122%) → deficit 22%.
- **Verdict**: Medium voelt ruim. Heavy is overage-trigger. **OK**.

**Enterprise €4.997 / 30.000 credits**
- E1 Medium 14.671 (49%) → surplus 51%.
- E2 Heavy 40.611 (135%) → deficit 35%.
- **Verdict**: Medium voelt abundant. Heavy scenario E2 (50 workspaces) is custom-enterprise territorium waar CSM een op-maat pack onderhandelt. **OK**.

**Founding €997 / 8.000 credits**
- F1 Typical 4.426 (55%) → surplus 45%.
- **Verdict**: Comfortable abundance passend bij founder goodwill. **OK**.

**Overall**: de voorgestelde allocaties voelen ruim voor Medium gebruik op alle tiers (29-78% surplus). Heavy overage triggert packs, wat correct marktgedrag is. Geen tier voelt krap voor zijn target persona.

**Cross-benchmark check**:
- Jasper Pro $69 unlimited woorden: een blog van 1500 woorden kost FMai 15 credits = €1.13 (Growth tier). Partner €347/1.000 = €0.35/blog. Jasper break-even: meer dan 61 blogs/mo needed om Jasper duurder te maken. Onrealistisch voor Partner.
- **Conclusion**: Partner is duurder dan Jasper per unit, gerechtvaardigd door multi-skill platform + brand voice continuity + workspace + reporting.

---

## Open Vragen Owner

1. **Partner allocatie: 800 of 1.000 credits?**
   - 800 = dekt Medium 410 met 95% buffer, Heavy 892 breaks met 11% overage.
   - 1.000 = dekt Medium met 143% buffer, Heavy met 12% buffer.
   - Aanbeveling: **1.000** — ronde getal, abundance-feel op €347, upgrade-trigger pas bij echte Heavy users (die sowieso Growth nodig hebben).

2. **Pro allocatie: 10.000 of 12.000 of 15.000?**
   - 10k breakt PR2 Medium (8.551 = 86%, OK) en PR3 Heavy (147%).
   - 12k past PR2 Medium comfortabel, PR3 Heavy 122% (kleine pack).
   - 15k past PR2 Medium ruim, PR3 Heavy 98% (geen pack nodig).
   - Prijs-elasticiteit: €2.997 / 12.000 = €0.25/credit; €2.997 / 15.000 = €0.20/credit. 15k is 25% guller.
   - Aanbeveling: **12.000** — beter cost-per-credit kromme versus Enterprise 30.000 (€0.167), laat upgrade-trigger ruimte.

3. **Clyde capping: ja/nee en op welk niveau?**
   - Ja-cap: houdt allocaties laag, voorspelbare economics, risk is klant-frustratie bij centraal gebruikte skill.
   - Nee-cap: ruimere allocaties nodig (zie alternative path), alle tiers moeten 30-50% hoger.
   - Hybride: metered cap met "degrade naar haiku bij 80%" — auto-downgrade to goedkoper model ipv hard-block. Product-friendly.
   - Aanbeveling: **hybride met auto-downgrade** — 500 convos/mo/ws Growth, 800 Pro, 1.500 Ent, unlimited fair-use Enterprise. Na cap: auto-route naar haiku (1 credit) ipv sonnet (2 credits). Klant merkt zachtere AI maar geen block.

4. **Static ads op Partner: Pack add-on of Metered cap?**
   - Pack add-on (Partner Top-Up €39): simpeler SKU, credit-model consistent, meer upsell revenue.
   - Metered cap 3 ads/mo included: beter UX, makkelijker te marketen ("3 ads/mo included!"), minder upsell.
   - Aanbeveling: **Metered cap 3/mo included** — voelt genereuzer op €347, meer marktfit vs Jasper/Simplified die ads included hebben. Voor ads boven 3: trigger Partner Top-Up naturally.

5. **Partner Top-Up pack: €39/500 of €49/700?**
   - €39/500 (€0.078/cr): psychologisch onder €40, matcht DIY solopreneur mindset.
   - €49/700 (€0.070/cr): iets betere cost-per-credit, alignment met Jasper Creator $49.
   - Aanbeveling: **€39/500** — launch small, test conversion. Upgrade naar €49/700 als data toont dat packs structureel worden gekocht (retentiesignaal).

---

## Samenvatting Nieuwe Allocaties (verplaatsen naar skills.ts)

```typescript
// Voorgesteld — vervangen in AGENT_TIERS
PARTNER:      { price: 347,   maxClients: 1,        includedCredits: 1000  }  // NEW
GROWTH:       { price: 1497,  maxClients: 5,        includedCredits: 4000  }  // was 3000
PROFESSIONAL: { price: 2997,  maxClients: 15,       includedCredits: 12000 }  // was 8000
ENTERPRISE:   { price: 4997,  maxClients: -1,       includedCredits: 30000 }  // was 20000
FOUNDING:     { price: 997,   maxClients: -1,       includedCredits: 8000  }  // was 10000

// CREDIT_PACKS additie
PARTNER_TOPUP: { credits: 500, price: 39, perCredit: 0.078 }  // NEW
BOOST:         { credits: 2000,  price: 149 }  // ongewijzigd
SCALE:         { credits: 5000,  price: 297 }  // ongewijzigd
UNLIMITED:     { credits: 15000, price: 697 }  // ongewijzigd
```

**Per-workspace caps (nieuw DB veld nodig `skill_caps` per tier)**:
- Partner: clyde 150 convos/mo, blog 6/mo, leads 40/mo, seo 3/mo, email 4/mo, static ad 3/mo; voice/video/reel DISABLED
- Growth: clyde 500/mo/ws, voice 30 min/mo, video 10/mo, reel 5/mo, static 20/mo
- Professional: clyde 800/mo/ws, voice 120 min/mo, video 30/mo, reel 20/mo, static 50/mo
- Enterprise: clyde 1.500/mo/ws, voice 500 min/mo, video 100/mo, reel 50/mo; static unlimited
- Founding: clyde fair-use, voice 150 min/mo, video 50/mo, reel 25/mo; static unlimited

---

## Bronnen

- `c:\Users\daley\Desktop\fma-app\src\lib\skills.ts` (SSoT)
- `c:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-04-19-pricing-solo-research.md`
- Metronome 2025 AI Pricing Field Report (geciteerd in solo-research.md)
- Jasper Pro $69 unlimited words benchmark
