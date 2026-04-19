# FMai Skill-Gating Architecture — 2026-04-20

> Purpose: ontwerp voor welke van de 12 skills, in welke hoeveelheid, op welk
> tier (Partner €347, Growth €1.497, Professional €2.997, Enterprise €4.997,
> Founding €997) beschikbaar zijn — inclusief add-on pricing en upgrade-triggers.
>
> Scope: architectuur, geen code changes. Gebouwd op interne credit-economics
> (`src/lib/skills.ts` — CREDIT_COSTS) en owner-principes:
> - Partner: geen Voice, geen Video Ad, geen Reel, geen ManyChat DM
> - Growth: alle 12 met caps op dure skills
> - Professional: ruimere caps
> - Enterprise: unlimited / zeer ruim
> - Founding: positioneer op Pro-level (reden in Edge Cases)
> - "Dure skills: in lagere tiers via add-on, in hogere tiers included"

---

## 1. Skill Groups per Cost Tier

De 12 skills splitsen zich economisch in drie groepen. Indeling bepaalt of
een skill unlimited fair-use kan zijn (A) of harde caps nodig heeft (C).

### Groep A — Cheap (always included, fair-use)

Kosten 1-5 credits per actie. Zelfs bij hoge usage (50-200 acties/mo) blijft
het volume ruim binnen included credits. Kunnen "unlimited fair-use" zijn op
alle tiers.

| Skill | Cost | Rationale |
|---|---|---|
| Clyde AI Employee | 1-5 cr/chat | Core product-verhaal. Nooit cappen op gebruik. |
| Reporting & Analytics | 5 cr/report | Automatisch wekelijks + on-demand — max ~20/mo per workspace |
| Research (Intelligence) | 3 cr/query | Typisch 20-40 queries/mo = 60-120 credits |
| Lead Qualifier | 2 cr/score | Chatbot scoort leads, triggered door website volume |
| Social Media (caption/schedule) | 1-2 cr | Hoog volume (30-50 posts/mo) maar lage unit cost = 60-100 credits |
| SEO Analyst | 3-5 cr | Wekelijkse audit + maandrapporten, max 10-15 acties/mo |

**Total typical usage Groep A**: 300-450 credits/mo per workspace.

### Groep B — Medium (metered per tier)

Kosten 5-15 credits per actie. Volume-afhankelijk — 1 artikel per week is
60 credits; 5 artikelen per week is 300 credits. Caps per tier sturen
gebruik naar passend pakket.

| Skill | Cost | Typical caps |
|---|---|---|
| Blog Factory | 15 cr/article | Partner 2/mo, Growth 8/mo, Pro 20/mo, Ent unlimited |
| Ad Creator (static only) | 10 cr/ad | Partner off, Growth 15/mo, Pro 50/mo, Ent unlimited |
| Email Management | 5 cr/campaign | Partner 5/mo, Growth 20/mo, Pro 60/mo, Ent unlimited |
| ManyChat DM | 2 cr/batch of 10 | Partner off, Growth 200 DMs/mo, Pro 1000, Ent unlimited |

**Total typical usage Groep B op Growth**: 500-900 credits/mo.

### Groep C — Expensive (capped + add-on path)

Kosten 5-25 credits per actie, maar schaal lineair met gebruik. Deze drie
skills kunnen in een maand alle credits opslorpen. Harde caps per tier +
dedicated add-on packs.

| Skill | Cost | Schaal-risico |
|---|---|---|
| Voice Agent | 5 cr/minuut | 60 min call = 300 credits, 240 min = 1.200 credits |
| Ad Creator (video) | 20 cr/video | 10 video ads = 200 credits |
| Reel Builder | 25 cr/reel | 8 reels/mo = 200 credits; serieuze creator 20/mo = 500 credits |

**Partner exclusie**: Voice, Video Ad, Reel zijn economisch + positionerend
niet geschikt voor €347 tier. Agencies verkopen deze ook vaak als service aan
hun eigen clients — gating beschermt Growth+ marge.

**Total typical usage Groep C op Growth (light)**: 400-700 credits/mo.
**Op Pro (serieus gebruik)**: 1.500-2.500 credits/mo.

---

## 2. Skill × Tier Matrix

Legenda:
- ✅ = beschikbaar met aangegeven cap
- ❌ = niet beschikbaar
- "fair use" = geen harde cap, throttle alleen bij extreme outliers (>3x typisch gebruik)
- Aantallen zijn per maand, per workspace

| # | Skill | Partner €347 | Growth €1.497 | Professional €2.997 | Enterprise €4.997 | Founding €997 |
|---|---|---|---|---|---|---|
| 1 | Social Media Manager | ✅ fair use (30 posts) | ✅ fair use | ✅ fair use | ✅ unlimited | ✅ fair use |
| 2 | Reporting & Analytics | ✅ fair use (8 rapporten) | ✅ fair use | ✅ fair use | ✅ unlimited | ✅ fair use |
| 3 | Research | ✅ fair use (30 queries) | ✅ fair use | ✅ fair use | ✅ unlimited | ✅ fair use |
| 4 | Clyde AI Employee | ✅ fair use (500 chats) | ✅ fair use | ✅ fair use | ✅ unlimited | ✅ fair use |
| 5 | Lead Qualifier | ✅ fair use (50 scores) | ✅ fair use | ✅ fair use | ✅ unlimited | ✅ fair use |
| 6 | SEO / GEO Analyst | ✅ fair use (10 acties) | ✅ fair use | ✅ fair use | ✅ unlimited | ✅ fair use |
| 7 | Blog Factory | ✅ 2 articles incl. | ✅ 8 articles incl. | ✅ 20 articles incl. | ✅ unlimited | ✅ 12 articles incl. |
| 8 | Ad Creator (static) | ❌ (add-on €97 → 15/mo) | ✅ 15 static incl. | ✅ 50 static incl. | ✅ unlimited | ✅ 25 static incl. |
| 9 | Ad Creator (video) | ❌ no path | ✅ 4 video incl. | ✅ 20 video incl. | ✅ unlimited | ✅ 8 video incl. |
| 10 | Reel Builder | ❌ no path | ✅ 4 reels incl. | ✅ 15 reels incl. | ✅ unlimited | ✅ 8 reels incl. |
| 11 | Voice Agent | ❌ no path | ✅ 30 min incl. | ✅ 120 min incl. | ✅ unlimited | ✅ 60 min incl. |
| 12 | ManyChat DM | ❌ (add-on €47 → 200) | ✅ 200 DMs incl. | ✅ 1000 DMs incl. | ✅ unlimited | ✅ 500 DMs incl. |

### Afleiding included quantity per tier (Growth = baseline)

Growth (€1.497, 5 workspaces, 3.000 credits):
- Fair-use Groep A = 300 cr/workspace × 5 = **1.500 credits** — reserveren
- Blog 8 × 15 = 120 cr × 5 = 600 (*niet per workspace exclusieve pool bij low multi-use agencies; quotum per ws*)
- Ad static 15 × 10 = 150 cr per ws × 5 = 750
- Video 4 × 20 = 80 × 5 = 400
- Reel 4 × 25 = 100 × 5 = 500
- Voice 30 × 5 = 150 × 5 = 750
- ManyChat 200/10 batches × 2 = 40 × 5 = 200

**Total cap-based**: 1.500 + 600 + 750 + 400 + 500 + 750 + 200 = **4.700 cr**.
Dit overschrijdt de 3.000 cr allocation — maar dat is **by design**: niet
elke agency vult alle caps in alle workspaces elke maand. 3.000 credits is
genoeg voor ~60% benutting van caps gemiddeld. Voor swing-months is top-up
via Boost/Scale pack beschikbaar.

Pro (€2.997, 15 ws, 8.000 credits): caps +2.5× Growth per ws (rekening
houdend met 15 ws = nog steeds ~60-70% fill-rate verwacht).

Enterprise: alles unlimited = fair-use only. Bij misbruik (>10x gemiddeld
usage) aparte Sales conversatie.

Founding (€997, unlimited ws, 10.000 credits): caps tussen Growth en Pro
omdat het een agency-lock-tier is die founding members belonen wil zonder
Enterprise-level te geven.

---

## 3. Coming_Soon Skills Policy

Drie skills zijn in `src/lib/skills.ts` `status: 'coming_soon'`: ManyChat DM,
Email Management, Reel Builder.

**Launch windows** (voorstel):

| Skill | Beschikbaar vanaf | Reden |
|---|---|---|
| Email Management | Q2 2026 (6-8 wk) | Gmail OAuth + classification bestaat technisch; UI-rooster nodig |
| ManyChat DM | Q3 2026 (12-14 wk) | Gaat samen met Lead Qualifier funnel-integratie |
| Reel Builder | Q4 2026 (20-24 wk) | Vereist Remotion + Kling pipeline consolidatie — groot werk |

**Per-tier availability matrix coming_soon (zelfde als live matrix)**:

| Skill | Partner | Growth | Pro | Ent | Founding |
|---|---|---|---|---|---|
| Email Management | ✅ 5/mo | ✅ 20/mo | ✅ 60/mo | unlimited | ✅ 40/mo |
| ManyChat DM | ❌ add-on €47 | ✅ 200/mo | ✅ 1000/mo | unlimited | ✅ 500/mo |
| Reel Builder | ❌ | ✅ 4/mo | ✅ 15/mo | unlimited | ✅ 8/mo |

**Communicatie op pricing-page** (tot launch):

```
Reel Builder  [Coming Q4 2026]
15 reels per maand inbegrepen zodra gelanceerd
```

- **Early access voor founding members**: Founding krijgt coming_soon skills
  altijd 2-4 wkn voor general availability ("First in line").
- **Geen prijsverhoging bij launch**: existing subscribers krijgen nieuwe
  skills automatisch included — dit is retention-argument voor trage tiers.
- **Partner klanten**: bij launch van ManyChat DM krijgt Partner een one-time
  upsell-email over het €47 add-on pack.

---

## 4. Add-On Architecture

Drie add-on strategieën per type skill:

### A. Generieke credit packs (bestaand, voor incidenteel overvolume)

| Pack | Credits | Price | Best voor |
|---|---|---|---|
| Boost | 2.000 | €149 | Single month spike |
| Scale | 5.000 | €297 | Sustained growth |
| Unlimited | 15.000 | €697 | Agency-mode burst |

Alle tiers kunnen Boost/Scale/Unlimited kopen. Positioneert als safety-net
voor "swing months", niet als hoofdmonetisatie.

### B. Skill-specifieke packs (nieuw, voor Partner + tier-grensgevallen)

Voor skills die in een tier niet of krap beschikbaar zijn — koop je gerichte
"unlock" in plaats van generic credits:

| Pack | Unlock | Price | Beschikbaar op |
|---|---|---|---|
| **Partner Static Ads Pack** | 15 static ads/mo | €97/mo | Partner alleen |
| **Partner ManyChat Pack** | 200 DMs/mo | €47/mo | Partner alleen |
| **Voice Minutes Pack** | +60 minuten/mo | €147/mo | Growth + Pro |
| **Video Ads Pack** | +10 video ads/mo | €197/mo | Growth + Pro |
| **Reels Pack** | +10 reels/mo | €197/mo | Growth + Pro |
| **Blog Power Pack** | +15 articles/mo | €197/mo | Partner + Growth |

**Rationale per pack**:
- Partner packs zijn *beneden* tier-upgrade prijsgevoeligheid (Partner→Growth
  = €347→€1.497, verschil €1.150/mo). €97+€47 = €144/mo ≤ €191
  gap-consumerende-prijs. Is lucratief uitbreidingspad maar duwt zware users
  naar Growth.
- Growth/Pro packs zijn voor skills die hun cap bereiken zonder dat de hele
  tier-upgrade gerechtvaardigd is. €147 voor +60 voice min is voorspelbaar
  voor de koper.
- Geen Enterprise packs — als je op Ent zit is jouw gebruik afwijkend genoeg
  voor een custom-quote gesprek met Sales.

### C. Hard-capped → natural upgrade push

Bepaalde skills zijn bewust **niet** als add-on te koop op lagere tier:

| Skill | Op Partner | Op Growth | Op Pro |
|---|---|---|---|
| Voice Agent | NIET beschikbaar (upgrade Growth) | 30 min incl. + pack | Pack |
| Ad Creator video | NIET beschikbaar (upgrade Growth) | Pack | Pack |
| Reel Builder | NIET beschikbaar (upgrade Growth) | Pack | Pack |

**Waarom geen Partner add-on voor Voice/Video/Reel?** Drie redenen:
1. Credit-economics breken al bij matig gebruik (voice 2u/mo = 600 cr alleen
   hiervoor; Partner quota ontoereikend)
2. Bewuste upgrade-trigger naar Growth (elimineert 2+ segmenten die Partner
   proberen te rekken)
3. Operationele setup (VAPI tuning, brand voice cloning, Remotion templates)
   is onderdeel van onboarding die pas bij Growth+ €1.500 fee zit

### D. Strategie-samenvatting per skill

| Skill | Strategy | Rationale |
|---|---|---|
| Social Media | Fair-use, geen add-on | Core product, cheap, onvoorspelbaar cappen = slecht UX |
| Reporting | Fair-use, geen add-on | Automation-kritisch, heel laag cost |
| Research | Fair-use, geen add-on | Lage cost, usage self-throttles |
| Clyde | Fair-use, geen add-on | Star of the show — cappen dooft adoption |
| Lead Qualifier | Fair-use, geen add-on | Triggered door website volume, niet buyer intent |
| SEO Analyst | Fair-use, geen add-on | Maandelijkse audits = capped-by-design |
| Blog Factory | Tier-cap + Blog Power Pack | Medium cost, kwalitatief volume-driven |
| Ad Creator static | Tier-cap + Partner Static Ads Pack | Partner wil dit; Pack is upsell-pad |
| Ad Creator video | Hard-gate op Growth+ | Te duur + agency-service-protectie |
| Reel Builder | Hard-gate op Growth+ | Zelfde als video |
| Voice Agent | Hard-gate op Growth+ + Voice Minutes Pack voor Growth/Pro | Lineaire cost, natural upgrade-trigger |
| ManyChat DM | Hard-gate op Growth+ met Partner ManyChat Pack uitzondering | DMs zijn incentive-driven, agencies verkopen setup |

---

## 5. Website Display Logic

Pricing page card copy per tier. Toon ALLE skills in elke card (geen tier
heeft "skills" als niet-vermeld) — maar geef verschillende badges/caps.

### Partner €347 card

```
[PARTNER]  €347/mo

Starten met AI marketing
Ideaal voor: freelance marketeer, solo boutique agency

INCLUDED:
  ✓ Social Media Manager         Unlimited (fair use)
  ✓ Reporting & Analytics        Unlimited
  ✓ Research                     Unlimited
  ✓ Clyde AI Employee            Unlimited
  ✓ Lead Qualifier               Unlimited
  ✓ SEO / GEO Analyst            Unlimited
  ✓ Blog Factory                 2 artikelen/mo
  ✓ Email Management (Q2)        5 campaigns/mo
    (→ add-on) Ad Creator        €97/mo voor 15 static ads/mo
    (→ add-on) ManyChat DM       €47/mo voor 200 DMs/mo

NOT AVAILABLE (upgrade to Growth):
  — Voice Agent
  — Video Ads
  — Reel Builder

Support: Email · Onboarding: Self-serve
```

Tooltip bij "Not available": "Voice Agent, video ads en reels vereisen
premium pipeline-toegang. Upgrade naar Growth of hoger om deze te activeren."

### Growth €1.497 card

```
[GROWTH]  €1.497/mo  — Most popular

Alle 12 skills inbegrepen
Ideaal voor: boutique agency 2-5 clients

INCLUDED (all 12 skills):
  ✓ Social, Reporting, Research, Clyde, Lead, SEO   Unlimited
  ✓ Blog Factory                 8 artikelen/mo
  ✓ Ad Creator (static)          15 ads/mo
  ✓ Ad Creator (video)           4 videos/mo
  ✓ Reel Builder                 4 reels/mo
  ✓ Voice Agent                  30 minuten/mo
  ✓ ManyChat DM                  200 DMs/mo
  ✓ Email Management (Q2)        20 campaigns/mo

ADD-ONS AVAILABLE:
  Voice Minutes Pack  €147/mo (+60 min)
  Video Ads Pack      €197/mo (+10 videos)
  Reels Pack          €197/mo (+10 reels)

5 workspaces · 3.000 credits/mo · Email support · €1.500 onboarding
```

### Professional €2.997 card

```
[PROFESSIONAL]  €2.997/mo

Voor groeiende bureaus
Ideaal voor: agency 5-15 clients

INCLUDED (all 12 skills, ruimere caps):
  ✓ All Partner + Growth skills
  ✓ Blog Factory                 20 artikelen/mo
  ✓ Ad Creator (static)          50 ads/mo
  ✓ Ad Creator (video)           20 videos/mo
  ✓ Reel Builder                 15 reels/mo
  ✓ Voice Agent                  120 minuten/mo
  ✓ ManyChat DM                  1000 DMs/mo
  ✓ Email Management (Q2)        60 campaigns/mo

15 workspaces · 8.000 credits/mo · Slack support · €3.000 onboarding
```

### Enterprise €4.997 card

```
[ENTERPRISE]  €4.997/mo

Unlimited voor grote bureaus
Ideaal voor: agency 15+ clients, multi-market

INCLUDED (all 12 skills, fair use unlimited):
  ✓ Alle skills zonder volume caps
  ✓ Voice Agent                  Unlimited
  ✓ Video Ads & Reels            Unlimited
  ✓ Blog Factory                 Unlimited
  + White-label reports
  + API access
  + Dedicated CSM

Unlimited workspaces · 20.000 credits/mo · Dedicated CSM · €5.000 onboarding
```

### Founding €997 card (limited availability badge)

```
[FOUNDING MEMBER]  €997/mo  — 10 spots remaining, lifetime price

Vroege agency partners — 12 maand lock, lifetime prijs
Ideaal voor: agency willing to co-build

INCLUDED (all 12 skills, Pro-niveau caps):
  ✓ Blog Factory                 12 artikelen/mo
  ✓ Ad Creator (static)          25 ads/mo
  ✓ Ad Creator (video)           8 videos/mo
  ✓ Reel Builder                 8 reels/mo
  ✓ Voice Agent                  60 minuten/mo
  ✓ ManyChat DM                  500 DMs/mo
  + Early access nieuwe skills
  + Founder Slack channel
  + 12-month price lock

Unlimited workspaces · 10.000 credits/mo · Founder Slack · €0 onboarding
```

### Skill-detail tooltips (consistent across cards)

Hover op skill-naam → popup:
```
Voice Agent
Inbound + outbound AI calls, afspraak-booking, gespreklogging.

Partner: niet beschikbaar (upgrade naar Growth)
Growth: 30 minuten/mo inbegrepen. Meer? Voice Minutes Pack €147/mo (+60 min)
Pro: 120 minuten/mo inbegrepen
Enterprise: unlimited
```

### Pricing-page FAQ update (belangrijk)

De bestaande FAQ-entry "Bevatten alle tiers echt alle 11 skills?" moet
herschreven worden naar:

```
Q: Krijg ik alle 12 skills op elk tier?
A: Partner bevat 8 van de 12 skills included + 2 add-on skills (Ad Creator
static, ManyChat DM). Growth, Professional, Enterprise en Founding bevatten
alle 12 skills — verschil zit in included volumes. Zie vergelijkingstabel.
```

---

## 6. Natural Upgrade Triggers

Ontwerpvraag: welke skill-usage of context duwt een gezonde klant naar de
volgende tier?

### Partner → Growth (€347 → €1.497, +€1.150/mo)

**Trigger 1**: Klant wil Voice Agent activeren (niet beschikbaar op Partner).
"Voice Agent is beschikbaar vanaf Growth. Upgrade vandaag → 30 min
inbegrepen + unlock video ads + reels."

**Trigger 2**: Klant heeft tweede werkruimte nodig (Partner = 1 ws).
"Je serviceert een tweede business. Growth bevat 5 workspaces."

**Trigger 3**: Blog Factory cap overschreden 2 maanden achtereen (usage data
trigger).
"Je hebt 2 maanden >2 artikelen geproduceerd via top-ups. Growth = 8
artikelen standaard inbegrepen. ROI break-even bij 3+ artikelen/mo."

**Trigger 4**: Static Ads Pack + ManyChat Pack beide actief (€97+€47=€144
add-on → effectieve maandprijs €491). "Je add-ons kosten bijna Growth
(€1.497). Bij Growth krijg je video + reel + voice erbij gratis."

### Growth → Professional (€1.497 → €2.997, +€1.500/mo)

**Trigger 1**: >5 clients (Growth maxClients = 5).
"Zesde client wacht op onboarding. Professional bevat 15 workspaces +
ruimere caps op alle skills."

**Trigger 2**: Voice > 30 min/mo consistent 3 mnd.
"Je Voice usage is 3 maanden >30 min. Pro bevat 120 min standaard + je
bespaart de Voice Minutes Pack."

**Trigger 3**: 2+ Reels Packs of Video Ads Packs gekocht in 1 mnd.
"Je behoeft significant meer video-content. Pro = 15 reels + 20 videos
included (2.5x wat je nu verbruikt)."

**Trigger 4**: Slack-support ticket-volume (workflow signal).
"Je hebt wekelijks Slack-support nodig. Pro voegt prioriteits Slack
channel toe."

### Professional → Enterprise (€2.997 → €4.997, +€2.000/mo)

**Trigger 1**: >15 clients (Pro maxClients = 15).
"16e client in onboarding. Enterprise = unlimited workspaces."

**Trigger 2**: White-label-aanvraag via support.
"Je wilt FMai white-labellen voor jouw clients. Enterprise = WL + dedicated
CSM."

**Trigger 3**: API-access aangevraagd.
"Enterprise-only feature. API toegang + custom integraties."

**Trigger 4**: >80% unlimited cap benutting 3 maanden (abnormaal voor
normale Pro-usage).
"Je gebruikt Pro tot de limits. Enterprise = unlimited + dedicated CSM die
workflows optimaliseert."

### Founding → Enterprise (speciaal pad)

Founding is 12-maand lock. Na afloop:
- Kies upgrade naar Enterprise (€4.997) — behoud unlimited workspaces
- Of switch naar Pro (€2.997) — geef 15 workspace cap op
- Niet terug naar Founding-prijs (lock expired)

**Trigger in maand 11**: "Je Founding lock eindigt over 30 dagen. Wil je
doorgaan met Enterprise-level (€4.997) of Pro (€2.997)?"

---

## 7. Edge Cases

### E1: Founding = Pro of Enterprise level?

Beslissing: **Founding = Pro-level caps, niet Enterprise**.

Rationale:
- Enterprise €4.997 = unlimited alles. Founding €997 met unlimited =
  extreme underpricing (5x lager prijs voor zelfde product) en sabotage van
  Enterprise-verkopen.
- Pro-level caps (tussen Growth en Pro in included quantity) voelt
  royaal maar niet extreem.
- Founding heeft wel **unlimited workspaces** (net als Enterprise) +
  **early access** + **Founder Slack** — dat zijn de echte Founding perks.
- Credits (10.000) zit tussen Pro 8.000 en Ent 20.000 — logisch.
- Specifieke caps hierboven in matrix: Blog 12, static 25, video 8, reel 8,
  voice 60, ManyChat 500.

### E2: Add-on stapeling op Partner

Kan een Partner-klant stapelen Static Ads Pack (€97) + ManyChat Pack (€47) +
Boost Pack (€149 voor extra credits) = €640/mo?

Ja, **technisch** mogelijk. Praktisch:
- Onze prijsvergelijker zal dit tonen: "Je betaalt €640/mo. Growth is
  €1.497 met álle 12 skills + video + reel + voice. Upgrade aanbevolen."
- Hard-cap: max 2 skill-specifieke packs per tier. Voorkomt dat Partner
  feitelijk een Growth-lookalike wordt.
- Boost/Scale/Unlimited credit packs zijn wel ongelimiteerd stapelbaar
  (deze zijn nergens exclusiviteit-gate).

### E3: Trial voor Partner / Growth

Geen trial voor Pro / Enterprise / Founding (deze zijn sales-led met
onboarding fee).

- **Partner trial**: 14 dagen, credit card required, 200 credits cap (niet
  500). Signaleert serious intent zonder gratis-evaluatie risico.
- **Growth trial**: 14 dagen, credit card required, 500 credits cap + max 1
  workspace aangemaakt (niet 5). Voorkomt agency-abuse via trial.

### E4: Downgrade paden

- Growth → Partner: mogelijk maar forceert keuze "welke workspace blijft
  actief" (4 van 5 ws gaan read-only).
- Pro → Growth: zelfde mechanisme (14 van 15 ws naar read-only).
- Enterprise → Pro: unlimited → 15 ws cap.
- Founding downgrade: alleen na 12-mnd lock, geen early exit.

### E5: Cap rollover?

Vraag: als Growth-klant maand 1 maar 3 van 8 blog-articles gebruikt, rollen
de 5 over naar maand 2?

**Advies: NEE — geen rollover op tier-caps**.
Wel: **Credit packs (Boost/Scale/Unlimited) rollen wel over** tot 90 dagen
(retentie-hefboom zoals Gamma / PostHog doen).

Reden: cap rollover zou agencies kunnen laten "sparen" voor een
megamaand — breaks kostenbegroting.

### E6: Multi-tier-purchase (bv. agency koopt Pro + Partner voor eigen
interne marketing)

Allowed — elke account heeft eigen subscription. Niet bouwen als feature maar
blokkeer het ook niet.

### E7: Custom Enterprise (> Enterprise)

Voor agencies >50 clients of >1M/jr revenue via platform: **Custom tier**
(geen publieke prijs). Sales-led proces. Bevat:
- Custom SLA
- Dedicated server resources (of hybrid cloud setup)
- Per-client white-label niet alleen agency white-label
- Priority roadmap influence

Niet op pricing-page vermeld, wel in FAQ: "Meer dan 50 clients? Contact us
for Custom plan."

---

## 8. Open Vragen Owner (3-5 beslissingen)

**Q1: Exacte Partner caps — €347 sweet spot?**
Voorstel is 2 blog, 30 social posts, 5 email campaigns. Is dit **genoeg** om
een freelance marketeer waarde te geven, of **te weinig**? Alternatief: 4
blog + 8 email → positioneert Partner als "alternatief voor Buffer + Jasper
combo". Jouw beslissing bepaalt marge per klant.

**Q2: Video/Reel op Partner als €97 add-on toestaan?**
Huidig voorstel: hard-gate op Growth. Alternatief: €97/mo Partner add-on
voor 3 video ads OF 3 reels (niet beide). Upside: meer Partner upsell
revenue. Downside: sabotage van Growth-upgrade-trigger (zwaarste skills
werken juist om ze hard te gaten).

**Q3: Founding "lifetime" of "12-month lock"?**
Momenteel: 12-maand lock op €997. Na 12 mnd moet klant upgraden naar Pro of
Enterprise (Founding sluit). Alternatief: **lifetime €997** zolang ze
subscription continueren. Pro: extreme loyaliteit. Contra: ondergraaft
prijsverhoging in 2027+ omdat Founding lifetime locks blijven.

**Q4: ManyChat DM add-on op Partner als Lead Qualifier ook beschikbaar is?**
Partner krijgt Lead Qualifier included. ManyChat DM heeft veel overlap
(chatbot + DM). Risico: feature-overlap verwarring. Alternatief: ManyChat
ALLEEN Growth+ (geen Partner add-on), houd Lead Qualifier als Partner
chatbot-solution.

**Q5: Cap limits — harde block of soft throttle + waarschuwing?**
Als Growth-klant zijn 8 blog-articles op heeft in week 2: **hard block**
("koop Blog Power Pack €197") of **soft**: 9e artikel wordt gegenereerd
tegen credit-cost uit pack van 3.000? Soft is beter UX, hard forceert
upgrade meer. Aanbeveling: **soft met dashboard warning** ("je bent over
blog-cap, kosten 15 credits uit algemene pool ipv included").

---

## Conclusie

Architectuur in 4 woorden: **Partner = 8 included + 2 add-on skills,
Growth+ = alle 12**. Dure skills (Voice, Video, Reel) zijn hard-gated op
Partner omdat ze economisch (credit-cost) én commercieel (agency-service-
protection) niet passen bij €347 tier. Skill-specifieke add-on packs vullen
de gap voor Partner (€97 static ads, €47 ManyChat) en geven Growth/Pro een
volume-extensie pad zonder tier-upgrade (€147 voice min, €197 video, €197
reel). Founding = Pro-level caps + unlimited workspaces = Enterprise-only
perks die niet met caps te verkopen zijn. Alle tier-caps zijn soft throttle
met upgrade-prompt, geen harde blocks.

Volgende stap: owner beantwoordt de 5 open vragen hierboven, daarna kan dit
document als input naar `/gsd:plan-phase` voor implementation (database
schema voor tier-caps, Stripe price IDs, pricing-page rendering, usage
meter enforcement).

## Bronnen

- `c:\Users\daley\Desktop\fma-app\src\lib\skills.ts` — SKILLS, CREDIT_COSTS SSoT
- `c:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-04-19-pricing-solo-research.md` — markt benchmarks + skill-economics
- `c:\Users\daley\Desktop\Futuremarketingai\docs\plans\audit-capabilities-inventory.md` — 12 skills capability claims
