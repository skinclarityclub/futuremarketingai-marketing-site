# Pricing & Solo Tier Research — 2026-04-19

> Research opdracht: onderzoek markt + interne credit economics en lever 2-3
> concrete tier-architectuur opties voor het toevoegen van een solo-entrepreneur
> pakket aan FutureMarketingAI. Bronnen en berekeningen zijn traceerbaar.

---

## Executive Summary

FutureMarketingAI is vandaag gepositioneerd als B2B2B voor marketingbureaus met
4 tiers (Growth €1.497, Professional €2.997, Enterprise €4.997, Founding €997) en
een credit model (3k/8k/20k/10k gekoppeld aan credit packs van €149/€297/€697).
De eigenaar wil een vijfde SKU toevoegen voor solo-entrepreneurs — single company
klanten die geen bureau zijn. Dit breekt de oorspronkelijke anti-ICP uit
`aaas-strategy.md` (waarin direct-SMB expliciet werd uitgesloten in Phase 1).

**Drie harde bevindingen uit het marktonderzoek** bepalen het speelveld:

1. **De solo-markt ligt vrijwel volledig tussen €10-€60/mo.** Jasper Creator
   $49/mo, Buffer Essentials $6/mo per kanaal, Publer Professional €12/mo,
   Ocoya Bronze $19, Later Starter $25, SocialBee Bootstrap $29, Simplified
   Business €19, ContentStudio Starter $19, ChatGPT Plus / Claude Pro $20.
   Alles boven €100/mo positioneert zich expliciet als "team" of "agency".
   Een FMai solo SKU onder €60-80/mo is onvermijdelijk voor marktfit — óf het
   product moet zó duidelijk boven solo-tooling uitsteken dat het een andere
   koopcategorie wordt (zie Optie C).

2. **Credit-based pricing wint in 2025 (126% YoY groei naar 79 van 500 getrackte
   SaaS), maar wordt in 2026 al gecorrigeerd richting "simpler + outcome-based".**
   Het signaal uit Metronome en Lago is identiek: credits zijn een bridge, geen
   destination. Credit-anxiety onderdrukt usage en verlaagt NRR. FMai's huidige
   credit model is al defensief ingericht (rollovers niet expliciet, pack-prijs
   €0.046-€0.075/credit), maar voor solopreneurs is het een adoption-killer.

3. **Cannibalisatie controle door alleen prijs werkt niet — je hebt structurele
   hard caps nodig.** Buffer rekent per kanaal, Hootsuite per user+seats, Ocoya
   per workspace+profiles, Metricool per brand. FMai's huidige model gebruikt
   alleen `maxClients` als cap (5/15/unlimited). Voor een solo-SKU moet dit
   worden aangevuld met: hard cap op 1 workspace + geen team-seats + geen
   approval workflows + geen white-label + geen API (zie cannibalisatie
   hoofdstuk).

**Aanbevolen richting: Optie B — Solo als "Light" tier onder Growth, met
skill-gating i.p.v. credit-schrapping.** Reden: solo entrepreneurs willen géén
credit anxiety (dat maakt €500/mo reseller-arbitrage riskant voor de koper) en
wél een begrijpelijke "wat doet dit wel en niet" belofte. Skill-gating op Voice
Agent + Ad Creator + Reel Builder (de drie skills die de credit-economics
breken, zie interne analyse) sluit kannibalisatie mechanisch uit en maakt de
solo-SKU betaalbaar te positioneren op €97-€147/mo.

---

## Marktbenchmark

### A. Solo creator / SMB tier bij AI content + social platforms (2026)

Alle getallen per maand. Waar monthly/annual verschilt, is monthly genoemd.
Prijzen in USD tenzij anders vermeld; ruwe €-equivalenten bij 1 USD ≈ 0.92 EUR.

| Product | Plan | Price/mo | Workspaces / brands | AI allowance | Social profiles | Seats | Target | Source |
|---|---|---|---|---|---|---|---|---|
| Jasper AI | Creator | $49 ($39 annual) | 1 | Unlimited words | — | 1 | Solo freelancer / creator | [demandsage](https://www.demandsage.com/jasper-ai-pricing/) |
| Jasper AI | Pro | $69 ($59 annual) | 1 | Unlimited words | — | 5 | Small team | [socialrails](https://socialrails.com/blog/jasper-pricing) |
| Jasper AI | Business | ~$1.000-$2.000+ custom | custom | Custom | — | 10+ | Enterprise | [vendr](https://www.vendr.com/marketplace/jasper) |
| Ocoya | Bronze | $19 | 1 workspace | 100 AI credits | 5 profiles | 1 | Solo basics | [ocoya.com/pricing](https://www.ocoya.com/pricing) |
| Ocoya | Silver | $49 | 5 workspaces | 500 AI credits | 20 profiles | 5 | Small team | [socialchamp](https://www.socialchamp.com/blog/ocoya-pricing/) |
| Ocoya | Gold | $79 | 20 workspaces | 1.500 AI credits | 50 profiles | 20 | Agency | idem |
| Ocoya | Diamond | $159 | Unlimited | Unlimited AI credits | 150 profiles | 50 | Large agency | idem |
| Publer | Professional | $12 + ~$4/extra account | — | AI included | 3 base + per-acc | 1 | Solo | [publer.com](https://publer.com/plans/professional) |
| Publer | Business | $21 + ~$7/extra account | — | AI + approval | 3 base + per-acc | 1 | Small biz | [socialrails](https://socialrails.com/blog/publer-pricing) |
| ContentStudio | Starter | $19 | 1 | AI included | 5 profiles | 1 | Solo | [contentstudio.io](https://contentstudio.io/pricing) |
| ContentStudio | Pro | $49 | — | AI included | 10 profiles + 3 blogs | 2 | Entrepreneur | idem |
| ContentStudio | Agency | $99 + $50/mo white-label | — | AI included | Custom | Custom | Agency | [docs.contentstudio](https://docs.contentstudio.io/article/416-pricing-and-plans) |
| SocialBee | Bootstrap | $29 ($24 annual) | 1 | AI posts included | 5 profiles | 1 | Solo / coach | [socialbee.com/pricing](https://socialbee.com/pricing/) |
| SocialBee | Accelerate | $49 | 1 | AI included | 10 profiles | 1 | Startup | idem |
| SocialBee | Pro50 / 100 / 150 | $179 / $329 / $449 | Multi | AI + whitelabel | 50/100/150 profiles | Multi | Agency | idem |
| Buffer | Free | $0 | 1 | Limited | 3 channels | 1 | Casual | [buffer.com](https://buffer.com/pricing) |
| Buffer | Essentials | $5/channel/mo annual ($6 monthly) | — | AI Assistant | Per channel | 1 | Solo | [support.buffer.com](https://support.buffer.com/article/595-features-available-on-each-buffer-plan) |
| Buffer | Team | $10/channel/mo annual ($12 monthly), $3.33/channel 11-25 | — | AI + workflow | Per channel | Unlimited | Team / agency | idem (Dec 2025 restructure) |
| Hootsuite | Professional | $99 annual ($149 monthly) | — | AI Canva | 10 accounts | 1 | Solo | [hootsuite.com/plans](https://www.hootsuite.com/plans) |
| Hootsuite | Team | $249 annual ($399 monthly) | — | AI + approval | 20 accounts | 3 | Team | idem |
| Hootsuite | Enterprise | Custom ($1.000+/mo) | — | Full | 50+ accounts | 5+ | Enterprise | [capterra](https://www.capterra.com/p/121701/HootSuite/pricing/) |
| Later | Starter | $25 | 1 social set | 5 AI credits/mo | ~8 profiles | 1 | Solo | [later.com/pricing](https://later.com/pricing/) |
| Later | Growth | $50 | 2 social sets | AI included | ~16 profiles | Team | Small team | idem |
| Later | Scale | $110 | Multi sets | AI included | Many profiles | Multi | Agency | idem |
| Simplified | Business | €19 + €10/extra user | 5 brand styles | 100.000 credits + unlimited words | 30 accounts | 5 | SMB | [simplified.com](https://simplified.com/pricing) |
| Agorapulse | Professional | $119/user annual ($149 monthly) | — | Included | 10 profiles | 1 per seat | Growing team | [agorapulse.com/pricing](https://www.agorapulse.com/pricing/) |
| Agorapulse | Advanced | $149/user annual ($199 monthly) | — | Competitor analysis + inbox AI | 10 profiles | 1 per seat | Agency entry | idem |
| Metricool | Starter | $20 annual ($25 monthly) | up to 5 brands | — | — | Solo | Small solo | [metricool.com/pricing](https://metricool.com/pricing/) |
| Metricool | Advanced | $53 annual ($67 monthly) | up to 15 brands | Collaborators | — | Team | Agency entry | idem |
| Metricool | Custom | Custom | 50+ brands | White-label | — | Multi | Enterprise agency | idem |
| Lately.ai | Starter | $29 (varies) | 1 | AI-generated posts | 3 | 1 | Solo | web search — pricing varies |
| **DIY anchors** | | | | | | | | |
| ChatGPT Plus | Individual | $20 | — | GPT-4/5 + images | — | 1 | Solo DIY | [openai.com](https://openai.com/chatgpt/pricing) |
| Claude Pro | Individual | $20 | — | Sonnet unlimited*, Opus limited | — | 1 | Solo DIY | [anthropic.com](https://www.anthropic.com/pricing) |
| Claude Max | Individual | $100-$200 | — | 5x-20x Pro usage | — | 1 | Heavy solo DIY | idem |

**Observaties (solo tier)**:

1. **Modal solo-prijs zit op $19-$49/mo.** Onder $19 is gratis/free-tier
   territorium (Buffer Free, Canva Free). Boven $49 begin je al in "small team"
   overlap met Jasper Pro ($69), Hootsuite Pro ($99) en Agorapulse Pro ($119).
2. **DIY stack kost een solopreneur ~$40-$60/mo** (ChatGPT Plus $20 + Canva
   Pro $15 + Buffer Essentials 3 channels à $5 = $50). Dit is de psychologische
   prijs-anchor waar solo's naar kijken.
3. **AI-included is standaard** — geen enkel modern platform rekent AI apart
   op de solo tier meer. Jasper, Simplified en Ocoya geven expliciet
   "unlimited words" of royale credits. Credits-op-de-solo-tier (zoals Ocoya
   100, Later 5) worden algemeen als frictie ervaren.
4. **Multi-client caps op solo tiers zijn hard.** SocialBee Bootstrap = 1
   workspace, Ocoya Bronze = 1 workspace, ContentStudio Starter = 1 brand,
   Simplified Business = 5 brand styles (maar dit is al hun Team plan niet
   Solo). FMai solo moet 1 workspace cap hebben om bureau-arbitrage uit te
   sluiten.

### B. Agency / multi-client platforms (2026)

| Product | Entry agency tier | Top tier | Clients / brands | White-label | API | Key per-client economics |
|---|---|---|---|---|---|---|
| GoHighLevel | Starter $97 | SaaS Pro $497 | 3 sub-accts → unlimited | On Unlimited+ | Yes on Pro+ | $97/3=$32 per client Starter; $297/∞=marginal Unlimited | [gohighlevel.com/pricing](https://www.gohighlevel.com/pricing) |
| Vendasta | Starter $99 | Premium $999 | — | Yes | Yes | $99 minimum commitment, apps resold | [vendasta.com/pricing](https://www.vendasta.com/pricing/) |
| HubSpot Marketing Hub | Starter $20/seat | Enterprise $3.600/mo (5 seats) | — | No (separate partner program) | Yes on Pro+ | Too expensive for small agencies | [hubspot.com](https://www.hubspot.com/pricing/marketing) |
| Ocoya Gold | $79 (Gold), Diamond $159 | Diamond | 20 / Unlimited workspaces | — | — | $159/∞ = marginal for high-volume | [ocoya.com/pricing](https://www.ocoya.com/pricing) |
| Buffer Team | $10/channel (was Agency) | Team at scale | Per channel | Yes branded reports | — | Channels 11-25 drop to $3.33/channel; Dec 2025 consolidated | [buffer.com](https://support.buffer.com/article/595) |
| Metricool Advanced | $53 annual ($67 monthly) | Custom | 15 brands → 50+ | Custom plan only | — | $53/15 brands = $3.53 per brand | [metricool.com/pricing](https://metricool.com/pricing/) |
| Agorapulse Advanced | $149/user annual ($199 monthly) | Custom | 10 profiles per seat | Enterprise | — | Per-seat model — expensive at scale | [agorapulse.com/pricing](https://www.agorapulse.com/pricing/) |
| SocialBee Pro50/100/150 | $179 / $329 / $449 | Pro150 $449 | 50/100/150 profiles | Yes | — | $449/150 = $3 per profile Pro150 | [socialbee.com/pricing](https://socialbee.com/pricing/) |
| ContentStudio Agency | $99 base + $50 white-label | Custom | Custom | +$50/mo add-on | Yes | $149/mo for white-label agency | [docs.contentstudio](https://docs.contentstudio.io/article/416-pricing-and-plans) |
| FMai (huidig) | Growth €1.497 | Enterprise €4.997 | 5 / 15 / unlimited | Enterprise only | — | €1.497/5 = €299 per workspace Growth | `src/lib/skills.ts` |

**Observaties (agency tier)**:

1. **GoHighLevel is de prijs-vergelijkende referentie** voor bureaus die naar
   FMai kijken. $97/mo voor 3 clients = $32/client. FMai Growth €1.497/5 =
   €299/client — dat is **9x duurder per werkruimte**. FMai moet zijn waarde
   qua AI-employees duidelijker maken (echt 24/7 content + voice + ads vs GHL
   generiek CRM met AI add-ons).
2. **Marktprijs per client bij mid-tier agency tools: $3-10 per brand/channel**
   (Metricool $3.53, SocialBee Pro150 $3, Buffer $3.33 voor channels 11-25).
   FMai's €299/workspace Growth is gerechtvaardigd alleen als per-client
   services (auto content + voice + reports) concrete arbeidsuren vervangen.
3. **White-label pricing is universeel gate op top tier** (SocialBee,
   ContentStudio, Metricool Custom, GHL Pro). FMai Enterprise-only
   white-label past dit patroon.
4. **Vendasta $99-$999 is closest analog** voor FMai's B2B2B positie maar heeft
   een completere reseller+marketplace infra — pure AI productie hebben ze
   niet.

### C. Credit / usage-based pricing patronen (2025-2026)

**Cijfers uit Metronome 2025 Field Report** (state of credit models):

- 79 van 500 getrackte SaaS bedrijven gebruiken nu een credit model, tegen 35
  eind 2024 — **126% YoY groei**.
- Credit rollovers worden gangbare retentie-hefbomen: Gamma verhoogde
  rollover-cap van 1.5x naar 2x plan size, PostHog laat 50% rollover van
  remaining credits. Zonder rollover → credit anxiety → lagere adoption.
- Outcome-based pricing (Intercom Fin AI — $0.99 per resolved conversation)
  wint terrein als alternatief: voorspelbaar voor de buyer, schaalbaar voor
  de seller.
- 2026 voorspelling (Metronome + Pilot): "pendulum swings back toward
  simplicity" — winnaars behandelen credits als bridge, niet destination.

**Wat werkt**:

- **Gecombineerd model**: included credits (predictability) + top-ups
  (flexibility). Dit is wat Cursor, Gamma en ChatGPT Team doen. FMai's huidige
  model doet dit ook.
- **Transparante credit = unit cost mapping**: elke user weet dat 1 blog post
  = 15 credits = €0.70-€1.10 afhankelijk van pack. Jasper was succesvol met
  "per woord" tot ze "per credit" gingen en backlash kregen.
- **Soft/hard usage limits** (OpenAI API pattern): caps instellen voor
  predictability.
- **Credits als intern concept, niet als kern-prijsdrijfveer**. Coinbase/
  Supabase rekenen credits intern maar verkopen "pro plan / team plan" in UI.

**Wat rot wegt**:

- **Credits zonder rollover** → customers hoarden → low engagement → hoge
  churn. Midjourney Fast GPU hours (reset zonder rollover) heeft 1.5/5
  Trustpilot met "pricing too high" als common thread ([cybernews](https://cybernews.com/ai-tools/midjourney-review/)).
- **Onduidelijke credit-naar-actie conversie**. Users snappen niet dat 1
  "fast hour" = ~60 images, of 1 credit = 0.7 blog posts. Jasper Creator plan
  heeft daarom bewust "unlimited words" gekeerd.
- **Credit-anxiety bij solopreneurs** is dodelijk omdat zij mentaal
  €X-per-maand budgetten. De eerste maand waarin credits op zijn voordat de
  maand klaar is = churn.
- **Enterprise/agency kan credits mooi absorberen**, solo's bijna nooit.

**Per-credit cost benchmarks** (markt spread, AI content/image/video tools):
- Jasper (historisch per-word): ~$0.001 per woord → ~$1 per 1000 woord
- Midjourney Fast GPU: ~$0.10-$0.25 per image afhankelijk van plan
- Runway video: ~$0.05-$0.15 per gen credit
- ElevenLabs: ~$0.18 per 1k characters TTS
- FMai huidig: **€0.046-€0.075 per credit**, met 1 blog = 15 credits = €0.70-€1.10

FMai's credit prijs is **in lijn met markt** voor een premium positie, maar
het "per credit" abstract label is voor solo's een barrière. Reactie-optie:
in Solo-SKU presenteren als "30 AI content items/maand" i.p.v. "500 credits".

### D. Kannibalisatie controles bij vergelijkbare platforms

**Hard caps (mechanisch)**:

- **Buffer Essentials**: per kanaal bilen → ieder extra kanaal kost geld, dus
  een agency die 30 client channels op 1 Essentials account zet betaalt
  $150/mo — meer dan Team voor dezelfde scope.
- **Hootsuite Professional**: hard limit 10 social accounts + 1 user.
  Professional is 1 user-account technisch, team plan gate op user count.
- **Ocoya Bronze**: 1 workspace + 5 profiles + 100 AI credits. Onmogelijk
  voor agency om meerdere clients te beheren binnen die caps.
- **SocialBee Bootstrap**: 1 workspace + 5 profiles + 1 user. Pro50 is 7x
  duurder voor 10x de profiles.
- **Metricool Starter**: 5 brands cap — 11e brand forceert upgrade.
- **Later Starter**: 1 social set = bij elkaar horende profiles van één
  entiteit. Wachtwoord-delen = TOS schending.

**Feature-gating**:

- Approval workflows, content library sharing, branded reports, client
  access levels: universeel gate op Team+. Agencies hebben deze nodig, solo's
  niet.
- White-label: universeel enterprise/agency only (SocialBee Pro, Metricool
  Custom, GHL Unlimited+).
- API access: usually gate op Pro+.
- Client portal / sub-account: meestal agency-specific (GHL sub-accounts,
  Vendasta reseller).

**Juridisch / TOS**:

- Buffer, Hootsuite, Later: TOS expliciet "personal use" vs "business use".
- GoHighLevel: sub-accounts zijn deel van product design — upgrading is de
  enige route.

**Zachter (marketing + packaging)**:

- Agency branding + community (GHL agency community, SocialBee agency program).
- Reseller programma's (Vendasta marketplace) trekken explicit agencies.

**Conclusie**: kannibalisatie wordt universeel met een **combinatie** van
caps, feature-gating en TOS geadresseerd. Alleen prijs werkt niet.
FMai moet voor zijn solo-SKU minstens 2 lagen (cap + feature-gate) hebben.

---

## Interne Economics

### Credit costs per skill (uit `src/lib/skills.ts`)

```
socialMedia     social_post: 2      caption: 1       schedule_post: 1     engage: 1
blogFactory     article: 15
voiceAgent      call_minute: 5
leadQualifier   score_lead: 2
adCreator       static_ad: 10       video_ad: 20
reelBuilder     reel: 25
seoAnalyst      audit: 5            report: 3
emailManagement campaign: 5
manychatDm      dm_batch_10: 2
reporting       report: 5
intelligence    research_query: 3
clyde           chat_haiku: 1       chat_sonnet: 2   chat_opus: 5
```

### Scenario 1 — Solo lightweight (coach / consultant / creator)

Assumpties: 1 workspace, 4 social posts/week, 1 blog post/maand, 4 weekly
reports, 20 Clyde chats/week (Sonnet), 2 research queries/week.

| Actie | Berekening | Credits/mo |
|---|---|---|
| Social posts | 4/wk × 4.33 wk × (2 post + 1 caption + 1 schedule) = 17.3 × 4 | **69** |
| Blog posts | 1 × 15 | **15** |
| Weekly reports | 4 × 5 | **20** |
| Clyde Sonnet chats | 20/wk × 4.33 × 2 | **173** |
| Research queries | 2/wk × 4.33 × 3 | **26** |
| **Totaal** | | **303 credits/mo** |

Bij €0.075/credit (Boost pack) = **€22.7 gebruikswaarde/mo**.

### Scenario 2 — Solo moderate (e-commerce solopreneur, SaaS founder)

Basis scenario 1 + 1 static ad/mo + SEO audit + 10 lead qualifier scores/mo.

| Actie | Berekening | Credits/mo |
|---|---|---|
| Scenario 1 basis | — | **303** |
| SEO audit | 1 × 5 | **5** |
| Lead qualifier scores | 10 × 2 | **20** |
| Static ad | 1 × 10 | **10** |
| **Totaal** | | **338 credits/mo** |

Bij €0.075/credit = **€25.4 gebruikswaarde/mo**.

### Scenario 3 — Agency medium (5 werkruimtes × solo moderate)

Simpele multiplicatie: 5 × 338 = **1.690 credits/mo**.

Past ruim binnen Growth's 3.000 credits. €1.497/1.690 = **€0.89 per credit
verkocht** — dat is ~12x duurder dan Boost pack per credit. Margin reflects
platform value, niet credit costs.

### Scenario 4 — Agency heavy (5 werkruimtes incl. voice + video ads)

Per workspace: scenario 2 basis 338 + 30 min voice/mo × 5 = 150 + 2 video ads
× 20 = 40.

Per workspace: **528 credits/mo**. × 5 = **2.640 credits/mo**. Nog binnen
Growth 3.000. Credit-waarde: €1.497/2.640 = €0.57/credit ≈ 10x Boost pack.

### Scenario 5 — Agency voice-heavy (5 × 120 min voice calls/mo)

Per workspace: 338 + (120 × 5) = 938. × 5 = **4.690 credits/mo**. **Breaks
Growth 3.000.** Moet upgraden naar Professional (8.000) of Scale pack bijkopen.

### Scenario 6 — Agency reel + video ad centric

Per workspace: 338 + 4 reels × 25 = 100 + 4 video ads × 20 = 80. Per ws **518**,
× 5 = **2.590**. Past nog binnen Growth. Maar bij 8 reels + 8 video ads per
workspace: 338 + 200 + 160 = 698, × 5 = **3.490 → breaks Growth**.

### Waar het huidige model breekt

Drie skills domineren credit-consumptie en maken het voorspellingsmodel
onbetrouwbaar voor solopreneurs en light agencies:

| Skill | Credit cost per actie | Marginal cost per €-revenue | Risico |
|---|---|---|---|
| **Voice Agent** | 5 credits/min | 1 min = €0.23-€0.38 | Lineair in gebruiksminuten → onvoorspelbaar |
| **Ad Creator (video)** | 20 credits/video | 1 video = €0.92-€1.50 | 10 videos = 200 credits, niet random |
| **Reel Builder** | 25 credits/reel | 1 reel = €1.15-€1.88 | 20 reels/mo = 500 credits alleen hiervoor |

**Implicatie**: de 3 "coming_soon" + "live" content-heavy skills die een
solopreneur *zou willen* gebruiken (Reel Builder, Ad Creator video) zijn
economisch dezelfde skills die Growth naar Professional duwen bij volume.

**Design implicatie voor solo tier**: deze 3 skills uit solo-scope halen of
strikt cappen. Dit levert drie voordelen:
1. Solo credits kunnen veel lager (300-500/mo ruim voldoende)
2. Cannibalisatie onmogelijk (agency kan geen 5 solo-SKU's kopen voor
   clients die voice + video ads nodig hebben)
3. Solo tier kan betaalbaar (€97-€147/mo) terwijl marges goed blijven

### Credit packs vs nieuwe solo allocatie

Huidige packs (voor opschalen):

| Pack | Credits | Price | Per credit |
|---|---|---|---|
| Boost | 2.000 | €149 | €0.075 |
| Scale | 5.000 | €297 | €0.059 |
| Unlimited | 15.000 | €697 | €0.046 |

Voor solo tier gewenst: **500-800 credits/mo included**, met top-up pad via
Boost pack. Bij €97/mo met 500 credits = €0.194/credit (veel marge vs €0.075
cost) — reflecteert platform/onboarding value, niet per-credit cost.

Alternatief: presenteer geen credits maar "items". Bijv.: "30 content items
+ 5 rapporten + onbeperkte Clyde chats". Dit lost credit-anxiety op.

---

## Solo ICP Analyse

### Target segmenten (in volgorde van fit)

**A. E-commerce solopreneurs (primair)**
- Shopify store owners, 0-5 FTE, €5k-€50k MRR
- Need: social media content + blog SEO + product ads + reports
- Budget: €50-€150/mo voor marketing tech
- Huidige stack: ChatGPT Plus ($20) + Buffer Essentials ($15-30) + Canva ($15)
  + misschien Jasper Creator ($49) = ~$100-$130/mo
- Pijnpunt: tool sprawl, inconsistent brand voice, geen attributie
- FMai value prop: "één brein, consistent merk, rapport inclusief"
- Benodigde skills: Social + Blog + Reporting + Intelligence + Static Ads

**B. Coaches en consultants (secundair)**
- Service business, personal brand, 0-2 FTE
- Need: LinkedIn content + blog + chatbot + lead qualifier
- Budget: €30-€100/mo
- Huidige stack: ChatGPT + Buffer/Hootsuite starter + Calendly
- Pijnpunt: tijd voor content, lead volgen
- FMai value prop: "24/7 collega die LinkedIn + leads doet"
- Benodigde skills: Social + Blog + Lead Qualifier + Clyde chat + Reporting

**C. SaaS founders (tertiair, meest prijsgevoelig)**
- Indie hackers, bootstrapped SaaS
- Need: SEO content + growth hacks + documentatie
- Budget: €20-€60/mo max (zeer DIY cultuur)
- Huidige stack: ChatGPT Pro/Team, Notion AI, Buffer Free/Essentials
- Fit: laag — zij bouwen het zelf met OpenAI/Claude API directly
- **Niet prioritair** voor eerste solo-SKU

**D. Content creators / influencers (niet aanbevolen)**
- Heel andere tool-set (CapCut, InShot, Canva)
- Gedreven door reels/video
- Credit-economics breekt (Reel Builder 25 credits/stuk)
- **Anti-fit** — skip

### Prijsplafond voor solo-entrepreneur

Uit benchmark zien we drie prijsbanden:

- **€0-€30/mo**: DIY range (ChatGPT/Claude Pro $20, Buffer $5-$15, Ocoya
  Bronze $19, SocialBee $29, Publer $12). FMai kan hier NIET mee concurreren
  zonder winst weg te geven.
- **€30-€80/mo**: serieuze solo-tools (Jasper Creator $49, Ocoya Silver $49,
  ContentStudio Pro $49, Later $50, SocialBee Accelerate $49). FMai past
  hier mits caps strak zijn en margin via platform-value niet per-credit komt.
- **€80-€150/mo**: prosumer / small business upper (Jasper Pro $69, Hootsuite
  Pro $99, Agorapulse Pro $119). Hier heeft FMai voordeel als hij "AI
  Medewerker" belofte hard maakt — significant meer dan scheduling.
- **€150+/mo**: team/agency plateau. Solopreneur gaat hier bijna nooit heen.

**Aanbevolen FMai solo band: €97-€147/mo.**
- Op €97 = iets premium vs ChatGPT+Buffer combo, duidelijk onder Jasper Pro.
- Op €147 = rechtvaardigt op marge + vermijdt DIY-arbitrage.
- Hoger dan €150 = verliest solo-markt totaal.
- Lager dan €97 = geen productmarge en riskeert agency-arbitrage.

### Kannibalisatie-risico (kern designvraag)

**Het risico**: agency koopt 5 solo-SKU's (€97 × 5 = €485) in plaats van
Growth (€1.497) → **67% revenue loss per agency**.

Kwantitatieve breakeven: solo-prijs × maxClients ≥ Growth prijs ÷ kans op
detectie. Als detectie niet 100% kan, moet solo-SKU ofwel duurder dan €300/mo
zijn (onverkoopbaar voor solo) of mechanisch onvervangbaar (kan niet
functioneren als agency-workspace).

**Mechanische verdedigingen die moeten (in volgorde van belang)**:

1. **Hard cap op 1 workspace** (niet 2, niet 3 — één). Een agency die 5
   solo's koopt moet 5 account-registraties doen met 5 verschillende emails
   en 5 verschillende betaalmiddelen.
2. **Geen sub-user seats / team members**. Zonder teammates is het
   operationeel onhaalbaar voor agency waar meerdere mensen in content werken.
3. **Geen approval workflows / client access** — agencies gebruiken deze voor
   client sign-off. Zonder dit functioneert FMai niet als agency tool.
4. **Geen API / white-label**. API en white-label zijn 100% gate op Growth+.
5. **Skill-exclusies**: geen Voice Agent, geen Ad Creator video, geen Reel
   Builder. Dit zijn juist de skills die agencies verkopen als add-on services
   aan hun clients.
6. **Geen uitgebreide reporting met klant-branding**: solo tier rapporten zijn
   standaard FMai-branded, geen white-label PDF.
7. **TOS-clausule**: expliciet verbieden "managing social accounts on behalf
   of multiple unrelated businesses". Dit is wat Buffer, Hootsuite en Later
   doen.

**Zachtere verdedigingen (secundair)**:

- Support channel: solo tier = email only (geen Slack). Agencies verwachten
  Slack.
- Onboarding: solo = self-serve, geen €1.500 onboarding fee en geen CSM.
  Agencies verwachten hand-holding.
- Dashboard lay-out: "my business" framing i.p.v. "my clients" lijst.
  Functioneel verschil, niet alleen copy.

**Detectie signalen** (voor customer success als agency-abuse verdacht):
- Rapid switching van connected social accounts (agency swapt clients in/uit)
- Widely different brand voice / industry per maand
- Login from fixed team IP-block
- Billing email ≠ social account name

---

## Drie Architectuur Opties

### Optie A — "Solo als eigen SKU, naast de agency lineup"

**Concept**: solo tier is een volledig aparte productlijn met eigen
positionering ("Clyde voor jouw business"), eigen website-pagina, eigen
onboarding-flow. Agency tiers blijven ongewijzigd.

**Pakketten**:

| Tier | Doel | Price/mo | Workspaces | Credits | Skills | Support |
|---|---|---|---|---|---|---|
| **Solo Starter** | Solo DIY, AI-curious | €47 | 1 | 300 (of "20 content items") | Social + Blog + Reporting + Clyde chat + Intelligence | email self-serve |
| **Solo Pro** | E-commerce solo, serieuze growth | €97 | 1 | 700 (of "50 items") | + Lead Qualifier + SEO Analyst + Static Ads + Email Mgmt | email + community |
| Growth (agency) | Small agency | €1.497 | 5 | 3.000 | All 12 skills | email |
| Professional | Mid agency | €2.997 | 15 | 8.000 | All 12 skills | Slack |
| Enterprise | Large agency | €4.997 | Unlimited | 20.000 | All 12 skills + white-label + API | CSM |
| Founding | 10 early bureaus | €997 | Unlimited | 10.000 | All 12 skills | Founder Slack |

**Skill-gating**:
- Solo Starter: Social Media, Blog Factory, Reporting, Clyde, Intelligence — **5 skills**
- Solo Pro: Solo Starter + Lead Qualifier, SEO Analyst, Ad Creator (static only), Email Management — **9 skills**
- Solo tiers NIET: Voice Agent, Ad Creator (video), Reel Builder, ManyChat DM, white-label, API

**Credit allocations**:
- Solo Starter: 300 credits/mo (presented als "20 content items")
- Solo Pro: 700 credits/mo (presented als "50 items")
- Top-up via Boost pack (€149/2.000) mogelijk maar niet aangemoedigd

**Add-ons solo**:
- Extra 500 credits: €39/mo
- Team member access (max 2, opens approval workflow): €29/mo — gate on
  Solo Pro
- SEO audit deep-dive: €49/onetime

**Hard caps**:
- 1 workspace (absoluut)
- 1 user seat Starter, 1+2 Pro with add-on
- No white-label, no API
- No Voice Agent / no video ads / no Reel Builder

**Voordelen**:
- Schone productlijn-scheiding, geen verwatering van agency-positionering
- Duidelijke upgrade-path (Solo Pro → Growth voor bureau-starters)
- Marketing kan twee publieken apart bedienen

**Nadelen**:
- Hogere productmanagement overhead (twee product-lijnen)
- Website wordt complexer (solo page + agency page + pricing)
- Risico dat agency-positionering verwatert ("oh het is ook voor solo's")
- Solo tier heeft eigen onboarding/support loop nodig

**Best voor**: als je serieus van plan bent twee ICP's parallel te bedienen
en solo-inkomsten als ≥20% van toekomstige ARR ziet.

---

### Optie B — "Solo als Light-tier in dezelfde product-lijn"

**Concept**: solo tier is een goedkopere variant binnen dezelfde lineup, met
duidelijke skill-gating. De site houdt één positionering ("AI Marketing
Employee"), maar laat pricing sliden van 1 workspace (solo) tot unlimited
(agency). Geen eigen website-pagina voor solo.

**Pakketten**:

| Tier | Doel | Price/mo | Workspaces | Credits | Skills | Support |
|---|---|---|---|---|---|---|
| **Light** | Solo entrepreneur | €97 | 1 | 500 | 8 skills (no Voice/Video ad/Reel) | email |
| Growth | Small agency / prosumer | €1.497 (was €1.497) | 5 | 3.000 | All 12 skills | email |
| Professional | Mid agency | €2.997 | 15 | 8.000 | All 12 skills | Slack |
| Enterprise | Large agency | €4.997 | Unlimited | 20.000 | All 12 skills + WL + API | CSM |
| Founding | 10 bureaus | €997 | Unlimited | 10.000 | All 12 skills | Founder Slack |

**Skill-gating**:
- **Light**: Social Media, Blog Factory, Reporting, Intelligence, Clyde,
  Lead Qualifier, SEO Analyst, Email Management — **8 skills**
- Niet beschikbaar op Light: **Voice Agent, Ad Creator (statisch + video),
  Reel Builder, ManyChat DM**
- Reden voor Ad Creator uit Light: agencies verkopen ad-creatie als service;
  als solo dat kon zou de agency-resell-risk terugkomen. Static ads zijn
  echter wel de meest gewenste feature door solo's — zie "Open Vragen".

**Credit allocations**:
- Light: 500 credits ("35 items/mo")
- Rest: ongewijzigd

**Add-ons Light**:
- Static ad credits: €29/mo voor 100 ad-credits (unlock van static_ad actie)
- Extra 500 credits: €39/mo
- Top-up via bestaande Boost/Scale packs

**Hard caps op Light**:
- 1 workspace
- 1 user
- No white-label / API
- No team features

**Voor-en-nadelen**:
- **Voordelen**: één product-lijn, minder UX-complexiteit, natural upgrade
  path (Light user groeit naar 2e workspace → moet naar Growth). Positionering
  blijft schoon. Kannibalisatie mechanisch onmogelijk door skill-exclusies
  en 1-workspace cap.
- **Nadelen**: solo prospect ziet agency-prijzen (€1.497-€4.997) op dezelfde
  pagina wat intimiderend kan zijn. Copy moet zorgvuldig tussen "voor jouw
  business" (solo) en "voor je klantportfolio" (agency) differentiëren.
  "Light" voelt klein — "Starter" is aantrekkelijker label.

**Best voor**: als je dichter bij de huidige pricing-architectuur wilt
blijven, productmanagement-overhead laag wilt houden, en solo als de
funnel-entry naar agency ziet (indie consultant groeit tot 3-client agency
→ upgrade naar Growth).

**Subtile implicatie**: deze optie vereist dat "alle tiers bevatten alle
skills" claim op de huidige site wordt opgegeven. De pricing-pagina FAQ
staat nu expliciet: "Bevatten alle tiers echt alle 11 skills?" → Ja. Dit
moet naar: "Light bevat 8 skills, agency tiers bevatten alle 12."

---

### Optie C — "Usage-first, geen tiers, één product met caps en overage"

**Concept**: elimineer tiers volledig. Eén product "FutureMarketingAI".
Twee dimensies bepalen de prijs: **(1) aantal workspaces** en **(2) skill
access**. Credits worden intern gebruikt maar niet naar de buyer getoond —
in plaats daarvan "fair use" caps per skill.

**Pakket structuur** (twee sliders):

| Dimensie | Opties |
|---|---|
| Workspaces | 1 (€97) / 5 (€497) / 15 (€1.497) / Unlimited (€3.997) |
| Skill package | **Starter** (6 skills, €0 extra) / **Pro** (9 skills, €400 extra) / **Full** (12 skills, €1.000 extra) |

**Hoe dat werkt voor de koper**:

- Solo entrepreneur: 1 workspace + Starter = **€97/mo** (only Social, Blog,
  Reporting, Clyde, Intelligence, Lead Qualifier)
- Solo premium: 1 workspace + Pro = **€497/mo** (+ SEO, Email Mgmt, Static
  Ad) — positioneert als "het complete pakket voor een serieuze
  solo-onderneming"
- Small agency: 5 workspaces + Full = €497 + €1.000 = **€1.497/mo** (alle
  12 skills, match huidige Growth)
- Mid agency: 15 workspaces + Full = €1.497 + €1.000 = **€2.497/mo**
- Enterprise: Unlimited + Full = €3.997 + €1.000 = **€4.997/mo**

**Fair use limits** (vervangen credits, intern geteld, niet shown in UI):
- Social posts: 30/mo per workspace
- Blog posts: 5/mo per workspace
- Reports: 8/mo per workspace
- Clyde chats: 500 messages/mo per workspace
- Research queries: 50/mo per workspace
- (skill-specifiek limits voor Voice, Ad, Reel hierboven voor Pro/Full only)

**Overage**: niet voor de koper, hij ziet "fair use reached, upgrade to
higher tier" popup. Internal credit pack top-ups blijven beschikbaar voor
power users via sales flow.

**Cannibalisatie controles**:
- 1 workspace Starter: €97 voor 1 user. Geen team seats. Geen API. No
  white-label.
- Agency die 5 × Starter koopt betaalt €485 — minder dan 5-workspace bundel
  €497. **Dit is het kannibalisatie-risico.**
  **Fix**: hard TOS-clausule "Starter = single legal business entity".
  Mechanisch + per-account verification (Stripe fraud check, IP-check,
  KvK-nummer voor NL bedrijven).

**Voor-en-nadelen**:
- **Voordelen**: meest marktconform (Metricool, Ocoya doen vergelijkbaar
  met sliders). Credits uit UI haalt credit-anxiety weg. Eenvoudig uit te
  leggen. Hogere fit met 2026 pricing trends ("simplicity wins"). Een prijs-
  pagina i.p.v. vijf.
- **Nadelen**: grootste herschrijving van pricing-stack (Stripe, DB,
  onboarding). Founding Member tier moet herdefinieerd worden. Minder
  "premium" feel dan gestructureerde tiers; kan agency-founders (die de
  meeste geld betalen) minder aanspreken. Risico dat agencies 5 × €97
  trucje doen — vereist harde TOS enforcement.

**Best voor**: als je bereid bent grotere pricing-migratie uit te voeren
voor een toekomstbestendigere architectuur, én je gelooft dat 2026 "simplicity"
de markt gaat winnen van gestructureerde tiers.

---

## Aanbeveling

**Optie B — Solo als Light-tier binnen dezelfde lineup, met skill-gating op
Voice Agent / Ad Creator / Reel Builder / ManyChat DM, hard cap op 1
workspace + 1 seat + geen white-label/API, prijs €97/mo met 500 credits
gepresenteerd als "35 content items".**

**Drie redenen**:

1. **Matcht de economie van het platform**. De skills die de credit-economics
   breken (Voice 5/min, Video Ad 20, Reel 25) zijn *precies* de skills die
   agencies verkopen aan hun clients als premium services. Door ze uit solo
   te houden, krijg je gratis kannibalisatie-controle én beschermde marges
   voor Growth/Professional. Geen andere optie geeft je deze eigenschap
   "for free". In Optie A ben je gedwongen om ze ofwel op Solo Pro te
   plaatsen (risico) ofwel extra SKUs te maken (complexiteit). In Optie C
   zijn ze al in "Pro package", maar dan ontbreekt de hard workspace-cap
   scheiding.

2. **Minimale productmanagement overhead**. De huidige 4-tier structuur staat;
   Light is één extra rij in een tabel. Geen tweede website-lijn nodig.
   Onboarding-wizard blijft hetzelfde met een skip-flag voor de niet-Light
   stappen. Het Stripe-schema blijft hetzelfde (één extra price ID). Dit is
   2-4 weken werk, waar Optie A 6-8 weken is en Optie C 12-16 weken.

3. **Behoudt agency-positionering als primair verhaal**. De
   `aaas-strategy.md` thesis (10-25x LTV:CAC vs direct SMB, 108-118% NRR vs
   97%) blijft intact. Light is de entry-funnel die *sommige* solo's tot
   agency doorgroeien (1 workspace → serviceert 2e client → upgrade naar
   Growth) — wat empirisch gebeurt bij GoHighLevel (Starter $97 → Unlimited
   $297 → SaaS Pro $497 upgrade ladder is hun kerngroei-motor).

**Waar dit risico heeft en hoe het te mitigeren**:
- **Risico**: solo-tier klant voelt zich "tweederangs" op de site naast de
  agency-lineup. **Mitigatie**: eigen section header "For solopreneurs" op
  de pricing pagina, plus een dedicated "for solo business owners" snippet
  op de home die naar pricing#light scrollt.
- **Risico**: kannibalisatie bij agencies die Light gebruiken voor 1 client
  ipv Growth. **Mitigatie**: skill-exclusies maken dit operationeel onhandig
  voor agencies (ze verkopen vaak voice/ads als service), en de 1-workspace
  cap dwingt tot vijfvoudige account-registratie bij 5 clients. Plus KvK
  verification in onboarding voor NL markt.
- **Risico**: "alle tiers bevatten alle skills" FAQ op pricing moet herschreven.
  **Mitigatie**: dit is hoe dan ook een P0 contradictie uit de gap analysis
  (A1 — skill-count inconsistentie). Oplossen.

Start met Optie B. Als binnen 6 maanden meer dan 40% van solo-sign-ups
Light-tier kiest (en niet terug upgraden), heroverweeg naar Optie A voor
eigen productlijn. Als er weinig solo-tractie is (<10% ARR binnen 12 mnd),
consolideer terug naar alleen agency-tiers. Optie C is een "fase 3" migratie
als solo én agency beide volwassen zijn.

---

## Open Vragen voor Owner

Deze beslissingen moeten genomen worden voordat we naar uitvoering gaan:

1. **Prijs Light: €97 of €147?** €97 matcht GoHighLevel-entry en is
   psychologisch onder €100. €147 positioneert premium en geeft meer marge.
   Aanbeveling: start €97 voor 10 launch-klanten ("Solo Founding 5x"), dan
   €147 voor de rest. Recommendation bij twijfel: **€97** want
   acquisitie-friction wint over marge bij eerste 12 maanden.

2. **Static ads op Light: ja of nee?** Dit is de enige twijfel in
   skill-gating. Static ads (10 credits) zijn technisch OK voor solo
   economics, maar agencies verkopen ad-creatie vaak als service. Opties:
   (a) toestaan maar cap op 5 statische ads/mo — solo vriendelijk, agency
   onhandig, (b) achter €29 add-on — alleen betalen wie echt nodig heeft,
   (c) volledig uit Light — simpelere SKU maar gemiste feature.

3. **Credits presenteren of verbergen?** Markeer op Light als
   "35 content items/mo" of als "500 credits/mo"? Benchmark (Ocoya, Later,
   Simplified) gaat meer naar credits omdat cross-skill alloc flexibel is.
   Maar credit-anxiety is reëel. Aanbeveling: **toon beiden** — "35 items
   (≈500 credits, wissel af zoals je wilt)" — beste van beide werelden.

4. **"Solo Starter" of "Light" als label?** Light klinkt afwaarderend.
   Alternatieven: Starter (neutraal), Indie (creator-vriendelijk), Solo
   (letterlijk), Founder (ambitieus). Aanbeveling: **"Starter"** — universeel
   begrepen, geen waardeoordeel, upgrade-ladder evident.

5. **Gratis trial voor Light?** Jasper 7d, Ocoya 7d, SocialBee 14d,
   ContentStudio 14d. FMai huidig: geen trial. Aanbeveling: **14-daagse
   trial met 100 credits** voor Light only, met credit card required (no
   email-only). Verlaagt sign-up friction zonder arbitrage-risico (100
   credits is te weinig voor echte agency-test).

6. **Founding voor solo?** Analoog aan huidige Founding Member (€997 voor
   10 agencies): een "Solo Founding" met bijv. €47/mo lifetime voor de
   eerste 20 solo-users? Overweging: dit ondergraaft de €97 solo-prijs
   (Founding is 50% lager). Advies: **geen Solo Founding** — de huidige
   Founding is agency-positioneerd en moet dat blijven.

7. **NL-first of direct EN?** FMai marketing site is al NL/EN/ES. Solo-tier
   kan beginnen NL-only voor eerste 3 maanden om ICP/feedback strak te
   houden, dan EN+ES unlock. Aanbeveling: **start NL-only** (kopieert SKC
   proof-point patroon).

8. **Teams-addon voor Light: ja of nee?** Light met 1 seat is restrictief
   voor kleine ondernemers met een VA. Optie: €29/mo add-on voor +2
   team-seats op Light. Risico: opent cannibalisatie (solo + 2 VA = agency
   gebruik). Advies: **nee, niet op Light**. Teams-feature is de duidelijke
   Light → Growth upgrade-trigger.

9. **Onboarding fee voor Light?** Growth/Pro/Enterprise hebben €1.500-5.000
   onboarding. Solo Light: €0 self-serve of €97 eenmalig ("onboarding
   assistance")? Aanbeveling: **€0 onboarding** — self-serve is standaard
   op solo en friction-verhoging via onboarding fee doodt conversie.

10. **Wat gebeurt bij de 3 coming_soon skills (ManyChat DM, Email Mgmt, Reel
    Builder) na launch?** Plan nu: Email op Light, ManyChat DM + Reel Builder
    niet op Light. Herbekijk bij launch. Aanbeveling: **voeg in dit document
    pre-launch toe aan Growth+ inclusive, nooit aan Light voor de 2 video/DM
    skills**. Voor Email: ja op Light (text-based, past binnen credit budget).

---

## Bronnen

### Solo / SMB pricing
- Jasper AI pricing — [demandsage](https://www.demandsage.com/jasper-ai-pricing/), [socialrails](https://socialrails.com/blog/jasper-pricing), [jasper.ai/pricing](https://www.jasper.ai/pricing) (opgehaald 2026-04-19)
- Ocoya pricing — [ocoya.com/pricing](https://www.ocoya.com/pricing), [socialchamp](https://www.socialchamp.com/blog/ocoya-pricing/)
- Publer pricing — [publer.com/plans](https://publer.com/plans/professional), [socialrails](https://socialrails.com/blog/publer-pricing)
- ContentStudio pricing — [contentstudio.io/pricing](https://contentstudio.io/pricing), [docs.contentstudio.io](https://docs.contentstudio.io/article/416-pricing-and-plans)
- SocialBee pricing — [socialbee.com/pricing](https://socialbee.com/pricing/)
- Buffer pricing — [buffer.com](https://support.buffer.com/article/595-features-available-on-each-buffer-plan), [aumiqx](https://aumiqx.com/ai-tools/buffer-pricing-social-media-plans-2026/)
- Hootsuite pricing — [hootsuite.com/plans](https://www.hootsuite.com/plans), [socialchamp](https://www.socialchamp.com/blog/hootsuite-pricing/)
- Later pricing — [later.com/pricing](https://later.com/pricing/)
- Simplified pricing — [simplified.com/pricing](https://simplified.com/pricing), [eesel](https://www.eesel.ai/blog/simplified-ai-pricing)
- Agorapulse pricing — [agorapulse.com/pricing](https://www.agorapulse.com/pricing/)
- Metricool pricing — [metricool.com/pricing](https://metricool.com/pricing/)

### Agency / B2B2B pricing
- GoHighLevel pricing — [gohighlevel.com/pricing](https://www.gohighlevel.com/pricing), [leadsflex](https://leadsflex.com/gohighlevel-starter-vs-unlimited-vs-saas-pro/)
- Vendasta pricing — [vendasta.com/pricing](https://www.vendasta.com/pricing/), [agencyhandy](https://www.agencyhandy.com/vendasta-pricing/)
- HubSpot Marketing Hub — [hubspot.com](https://www.hubspot.com/pricing/marketing), [cargas](https://cargas.com/software/hubspot/pricing/)

### Credit / usage-based pricing patterns
- Metronome "AI Pricing in Practice: 2025 Field Report" — [metronome.com/blog](https://metronome.com/blog/ai-pricing-in-practice-2025-field-report-from-leading-saas-teams)
- Metronome "The Rise of AI Credits" — [metronome.com/blog](https://metronome.com/blog/the-rise-of-ai-credits-why-cost-plus-credit-models-work-until-they-dont)
- Lago "6 Proven Pricing Models for AI SaaS" — [getlago.com/blog](https://getlago.com/blog/6-proven-pricing-models-for-ai-saas)
- Growth Unhinged "2025 State of SaaS Pricing" — [growthunhinged](https://www.growthunhinged.com/p/2025-state-of-saas-pricing-changes)
- Midjourney user sentiment — [cybernews review](https://cybernews.com/ai-tools/midjourney-review/), [checkthat](https://checkthat.ai/brands/midjourney/pricing)

### Cannibalization controls
- Buffer agency usage — [support.buffer.com](https://support.buffer.com/article/667-using-buffer-as-an-agency)
- GoHighLevel SaaS mode — [gohighlevel.com/pricing](https://www.gohighlevel.com/pricing)
- SocialBee white-label — [socialbee.com/pricing](https://socialbee.com/pricing/)

### Interne
- `c:\Users\daley\Desktop\fma-app\src\lib\skills.ts` — SKILLS, AGENT_TIERS, CREDIT_PACKS, CREDIT_COSTS (SSoT)
- `c:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-04-19-audit-website-inventory.md`
- `c:\Users\daley\Desktop\Futuremarketingai\docs\plans\audit-capabilities-inventory.md`
- `c:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-04-19-audit-gap-analysis.md`
- `C:\Users\daley\.claude\projects\C--Users-daley-Desktop-fma-app\memory\aaas-strategy.md`
