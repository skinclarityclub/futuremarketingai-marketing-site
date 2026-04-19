# FMai Value-Based Pricing Analysis — 2026-04-20

> Stelling-nemende analyse. Geen "het hangt ervan af". Inputs: capabilities
> inventory, solo-research doc 2026-04-19, `src/lib/skills.ts`, 10 web searches
> (salarissen NL 2026, martech benchmarks, boutique AI agency retainers,
> premium SaaS anchor prijzen).

---

## Executive Summary

**De drie agency-tiers (€1.497 / €2.997 / €4.997) zijn te laag — niet marginaal,
maar structureel. Aanbevolen nieuwe prijspunten: Growth €2.497, Professional
€4.497, Enterprise €7.997. Partner €347 kan blijven, Founding €997 moet omhoog
naar €1.497 voor nieuwe plekken.**

De reden in één zin: **huidige prijzen positioneren FMai als duurdere tool, niet
als goedkoper fractioneel team.** Een NL social media manager kost €4.200-€5.500
all-in per FTE per maand. FMai Growth levert voor €1.497 per 5 werkruimtes =
€299/werkruimte — dat is 18x goedkoper dan één FTE terwijl per workspace een
FTE-equivalent aan output geproduceerd wordt (4 social posts/week + 1 blog/mo +
voice minutes + ads + reels + reports + Clyde 24/7). Bij €2.497 is het nog
steeds 8x goedkoper per client dan een junior FTE. Bij €299/workspace zit FMai
in GoHighLevel-psychology ($32/client Starter-tier) — onvergelijkbare output,
vergelijkbare prijs. Dat is prijzingsfout richting commoditization.

De twee extra redenen waarom nu upgraden veiliger is dan later: (1) de
**positionering "AI partner, geen platform"** vereist dat de prijs signalen
afgeeft die een platform niet kan — onder €2.000 lees je als self-serve tool,
daarboven als managed service/partnership; (2) bij **20-80 klanten/jaar cap**
heeft solo owner marge per deal nodig, niet volume — elke klant die €1.497
betaalt kost evenveel owner-aandacht als één die €2.497 betalt maar bij 40
klanten scheelt het €40K/mo ARR (€480K ARR/jaar).

Het echte risico is niet "te duur" maar **prijs-frictie bij eerste 10 agency
klanten**. Mitigatie: Founding Member blijft €997 voor 10 plekken als Early
Partner SKU (onderhandelingsruimte), Growth schuift door naar €2.497 voor rest.

---

## Marktbenchmark High-Touch B2B

De eerste research (2026-04-19) focuste op social-tooling concurrenten
(Buffer/Ocoya/SocialBee). Die zijn de verkeerde referentie. FMai concurreert
niet met Buffer — Buffer is de tool in de stack ernaast. De juiste
referentieklasse zijn **premium B2B platforms die per seat, per workspace of
per outcome priceen en $100-$500 per eenheid rekenen omdat ze arbeid vervangen
of een fractioneel team ontsluiten**.

### Tabel: Premium B2B + high-touch AI platforms (2026)

| Product | Categorie | Entry | Top | Per seat/workspace | Model | Bron |
|---|---|---|---|---|---|---|
| **Attio CRM** | Next-gen CRM | $29/seat | $69/seat + custom | $29-$69 per seat | Seat | [attio.com/pricing](https://attio.com/pricing) |
| **Linear** | Issue tracker | $10/seat | $16/seat + Enterprise | $10-$25/seat | Seat | [quackback Linear 2026](https://quackback.io/blog/linear-pricing) |
| **Notion Business** | Workspace + AI | $20/seat | Enterprise custom | $20+/seat (AI included) | Seat | [notion.com/pricing](https://www.notion.com/pricing) |
| **Superhuman Business** | Email productivity | $30/user | $40/user + Enterprise | $30-$40/seat | Seat | [superhuman.com/plans](https://superhuman.com/plans) |
| **Gong.io** | Revenue intelligence | $1.298/user/yr | $3.000/user/yr + $50K platform fee | ~$110-$250/seat/mo | Seat + platform | [cloudtalk Gong](https://www.cloudtalk.io/blog/gong-pricing/) |
| **Vendasta Premium** | Agency platform | $999/mo + $65/seat | Custom | €65/extra seat | Flat + seat | [vendasta.com/pricing](https://www.vendasta.com/pricing/) |
| **GoHighLevel SaaS Pro** | Agency platform | $497/mo | Custom | Unlimited sub-accounts | Flat | [gohighlevel.com](https://www.gohighlevel.com/pricing) |
| **Artisan (AI agent)** | AI SDR platform | $2.000/mo | $5.000/mo | Flat monthly | Subscription | [lindy.ai blog best AI agent platforms](https://www.lindy.ai/blog/state-of-ai-agent-platforms-2026) |
| **Lindy** | AI agent platform | $49/mo | Enterprise custom | Usage-based credits | Usage | [lindy.ai/blog/crew-ai-pricing](https://www.lindy.ai/blog/crew-ai-pricing) |
| **Relevance AI** | No-code AI ops | $49/mo | Enterprise custom | Credit-based | Usage | [lindy.ai/blog/relevance-ai-pricing](https://www.lindy.ai/blog/relevance-ai-pricing) |
| **Fractional CMO (NL/EU)** | Human service | €5K/mo | €15-€25K/mo | Retainer | Retainer | [growtal 2026 rates](https://www.growtal.com/2026-fractional-cmo-rates-a-guide-to-hourly-retainer-performance-models/) |
| **Boutique NL marketing agency** | Human service | €3K/mo | €8K-€25K/mo | Retainer | Retainer | [venturemedia Amsterdam 2025](https://www.venturemedia.io/post/digital-marketing-agencies-in-amsterdam-2025) |
| **"Done for you" AI content retainer** | Hybrid | $2.000/mo | $8.000/mo | Retainer | Retainer | [digitalagencynetwork 2026](https://digitalagencynetwork.com/ai-agency-pricing/) |
| **FMai Growth (huidig)** | Platform + AI team | €1.497/5 ws | — | €299/workspace | Flat | `src/lib/skills.ts` |
| **FMai Professional (huidig)** | Platform + AI team | €2.997/15 ws | — | €200/workspace | Flat | `src/lib/skills.ts` |

### Drie conclusies uit deze tabel

1. **FMai Growth €299/workspace zit in commodity-zone.** Vendasta ($65/extra
   seat = ±€60/ws), Attio ($69/seat), Linear Business ($16/seat) rekenen
   *minder* per seat dan FMai — maar zij leveren ook puur software. FMai levert
   een werkend AI-team dat content, voice, ads, reels per werkruimte produceert.
   De waarde-mismatch: FMai levert "fractioneel marketing team per client" maar
   prijs net iets boven "collaboration software". Elk boutique NL-bureau of
   fractional CMO voor €5K-€15K/mo is het juiste referentiepunt — niet Attio of
   Linear.

2. **AI agent platforms die écht arbeid vervangen priceen $2K-$5K/mo (Artisan)**
   en komen met verplichte jaarcontracten. Dat is het signaal aan enterprise
   buyers: dit is geen tool die je naast je bestaande stack legt, dit is een
   employee-equivalent. FMai moet in dezelfde band opereren als die
   positionering klopt — en die klopt (8-agent OpenClaw team, Clyde 24/7,
   AutoFix, Client Intelligence).

3. **Per-seat pricing sterft in 2026.** McKinsey/Gartner-cijfers: 70% van
   bedrijven prefereert usage/outcome over per-seat; 62% van SaaS heeft
   AI-premium tier geïntroduceerd met 25-35% prijspremie
   ([getmonetizely](https://www.getmonetizely.com/blogs/the-2026-guide-to-saas-ai-and-agentic-pricing-models),
   [pymnts](https://www.pymnts.com/news/artificial-intelligence/2026/ai-moves-saas-subscriptions-consumption)).
   FMai's per-workspace model past in deze trend mits de prijs per workspace de
   AI-premium reflecteert — wat hij nu niet doet.

---

## Arbeidsvervangingswaarde per Workspace

Dit is de echte kern. "Concurrent-prijs" is een afleiding — de koopvergelijking
voor een bureau is niet "hoeveel kost het alternatief?" maar "hoeveel FTE-uren
vervangt dit per client per maand?". De answer moet de prijs rechtvaardigen.

### Baseline kosten (NL, 2026)

- **Social Media Manager** bruto: €2.800-€3.800/mo, werkgeverslasten +25-45% =
  **€3.500-€5.500 all-in/mo**
  ([mijnzzp.nl](https://www.mijnzzp.nl/Beroep/999-Social-media-beheerder/Salaris-en-tarief),
  [werkgeverslasten 2026](https://www.ondernemenmetpersoneel.nl/orienteren/personeelskosten/werkgeverslasten-berekenen-2026))
- **Content marketeer** bruto: €3.187-€3.455/mo all-in =
  **€4.100-€5.000/mo**
  ([jobted content marketeer NL 2026](https://www.jobted.nl/salaris/content-marketeer),
  [dezaak werkgeverslasten](https://www.dezaak.nl/financien/payroll-en-salarisadministratie/wat-zijn-werkgeverslasten-en-hoe-bereken-je-ze/))
- **Uurtarief**: 160 productieve uren/mo → ~€22-€34/uur directe kost;
  per ingekocht uur bij een bureau: €75-€125/uur
- **Junior ads buyer / PPC**: bruto €2.900-€3.600 =
  all-in **€3.800-€5.200/mo**

### Output per workspace bij typische bureau-klant (Growth scenario)

Wat levert FMai per maand per werkruimte wanneer je alle 12 skills op normaal
gebruik zet (Scenario 4 uit solo-research doc, lichte usage):

| Output | Volume/mo/workspace | Human FTE-uren nodig | NL kostprijs @€30/uur |
|---|---|---|---|
| Social posts (IG+LI+FB) | 16 posts + 16 captions + scheduling | 16-20 uur | €480-€600 |
| Blog artikel (SEO) | 1 longform 1.500-3.000w | 6-10 uur | €180-€300 |
| Voice minutes | 30 min inbound/outbound AI calls | 1-2 uur voorbereiding | €30-€60 |
| Video ads / static ads | 2 video + 4 static | 8-12 uur | €240-€360 |
| Reel / vertical video | 2 reels | 4-8 uur | €120-€240 |
| SEO audit + rapport | 1 audit + 4 rapporten | 4-6 uur | €120-€180 |
| Weekrapport (AI-narrative PDF) | 4 | 2-4 uur | €60-€120 |
| Clyde 24/7 conversaties | ~200 Sonnet-berichten | 6-10 uur | €180-€300 |
| Research queries + alerts | 8 | 2-4 uur | €60-€120 |
| Lead scoring + CRM routing | 40 leads | 2 uur | €60 |
| Email triage/digest | 1 inbox | 4 uur | €120 |
| **Totaal per workspace** | — | **55-82 uur/mo** | **€1.650-€2.460** |

Dat is **0,35-0,50 FTE output per workspace** in directe-kostprijs (intern
personeel). Als je deze output inkoopt bij een bureau à €100/uur wordt het
€5.500-€8.200 per workspace "uitbesteed equivalent".

### Implicatie per tier

| Tier | Huidige prijs | Workspaces | €/ws | FTE-equivalent waarde | Arbitrage-ratio |
|---|---|---|---|---|---|
| Partner €347 | €347 | 1 | €347 | 0,1-0,2 FTE = €400-€1.000 intern / €2.500-€4.000 bureau | 3-11x |
| **Growth €1.497** | €1.497 | 5 | €299 | 5× (0,35-0,50 FTE) = 1,75-2,5 FTE intern = **€7.000-€13.750 intern** | **5-9x intern, 18-27x vs bureau** |
| **Professional €2.997** | €2.997 | 15 | €200 | 15× = 5,25-7,5 FTE = **€21.000-€41.000 intern** | **7-14x intern** |
| **Enterprise €4.997** | €4.997 | unlimited (cap ~40 realistisch) | €125 @40ws | 14-20 FTE = **€55K-€110K intern** | **11-22x** |
| Founding €997 | €997 | unlimited (praktisch ~10) | €100 @10ws | 3,5-5 FTE = **€14K-€27K** | **14-27x** |

**Conclusie: de arbitrage is 5-27x waarde-vs-prijs. Dat is niet "premium
prijzing" — dat is "onderpriced activeringsmarkt". Gezonde
value-based pricing zou 3-6x ratio hanteren.** FMai geeft 60-80% van de
gecapteerde waarde weg aan de koper. Voor een solo owner met 20-80 klant-cap
is dat €-verlies zonder concurrentie-rationale.

### Waarom upgrade naar €2.497/€4.497/€7.997 verantwoord is

Met nieuwe prijzen:

| Tier | Nieuwe prijs | €/ws | FTE-equiv | Nieuwe ratio |
|---|---|---|---|---|
| Growth €2.497 | €2.497 | €499 | 1,75-2,5 FTE = €7K-€13,75K | **2,8-5,5x** |
| Professional €4.497 | €4.497 | €300 | 5,25-7,5 FTE = €21K-€41K | **4,6-9,1x** |
| Enterprise €7.997 | €7.997 | €200 | 14-20 FTE = €55K-€110K | **6,9-13,8x** |

Nog steeds sterk aantrekkelijk voor de buyer (elke gezonde value-play zit 3-10x
arbitrage), maar FMai capteert nu 15-30% van de waarde ipv 5-10%. Bij 40
klanten verdeeld (15 Growth + 20 Professional + 5 Enterprise) =
€37,5K + €89,9K + €40K = **€167K/mo ARR vs huidige €113K/mo**. Dat is
**+48% ARR bij zelfde klantbasis**.

---

## Anchoring Analyse

Wat verandert precies op verschillende prijspunten voor Growth?

### Growth op €1.497 (huidig)

- Positie: zit net onder boutique Amsterdam retainer (€3K-€8K)
  ([venturemedia](https://www.venturemedia.io/post/digital-marketing-agencies-in-amsterdam-2025))
- Leest als: "duurdere agency-tool"
- Buyer-reflex: vergelijkt met GoHighLevel ($497 = €460), Vendasta ($999 = €925)
- Gevoel: "klopt ongeveer, maar ik wacht op korting"
- Conversie-profiel: impulsbeslissing-mogelijk, weinig due diligence
- **Probleem**: trekt prijsgevoelige kopers, niet kwaliteitskopers. Deze
  kopers vereisen evenveel support (applicatie + video-intake) maar geven 67%
  minder revenue-per-hour-of-owner-time.

### Growth op €1.797

- Leest als: "aan de hoge kant van tooling, onder retainer"
- Buyer-reflex: vergelijkt nog steeds met tools
- Minimale verschil vs €1.497 — verwarrend signaal
- **Geen aanbeveling**: half-hearted upgrade geeft alle frictie zonder waarde

### Growth op €2.497 — AANBEVOLEN

- Leest als: "fractioneel team, niet tool"
- Buyer-reflex: vergelijkt met retainer (€3K-€8K/mo) en denkt "dit is
  70% goedkoper voor meer output"
- Psychologische drempel: boven €2.000 wordt due diligence standaard; buyer
  vraagt naar case studies, onboarding, proof — dit is precies wat FMai goed
  kan (SKC proof point, 8-agent team, Clyde demo, capabilities inventory)
- Ratio zit op 2,8-5,5x FTE-equivalent — goede value messaging
- Kannibalisatie met Partner €347 blijft groot (10x onderschil) — buffer tegen
  downgrade
- **Conversie-impact geschat**: -15-25% sign-up rate bij cold-lead, maar +40-60%
  revenue-per-sign-up; klant-kwaliteit verbetert significant (minder
  price-chasers, meer commit)

### Growth op €2.997

- Leest als: "premium fractional team"
- Overlap met nieuwe Professional pricing — verwarrend
- **Niet aanbevolen tenzij Professional doorschuift naar €4.997**; maar dan
  overlap met huidige Enterprise

### Growth op €3.497+

- Leest als: "vervangt meer dan entry-tier belofte"
- Te dicht bij mid-tier retainer (€5K boutique NL)
- Verliest "5 workspaces" waarde-prop omdat buyer denkt aan 1-2 key clients
- **Niet aanbevolen**

### Per tier aanbevolen ankers

| Tier | Huidig | Aanbevolen | Rationale |
|---|---|---|---|
| Partner | €347 | **€347** (houden) | Entry-door; 8-skill gated; kannibalisatie-buffer; goede solo-fit per research doc 2026-04-19 |
| Growth | €1.497 | **€2.497** | FTE-ratio 2,8-5,5x; retainer-alternatief; premium-signaal |
| Professional | €2.997 | **€4.497** | FTE-ratio 4,6-9,1x; boutique-agency equivalent; 15 ws unlock mid-bureaus |
| Enterprise | €4.997 | **€7.997** | FTE-ratio 6,9-13,8x; unlimited + WL + API + CSM; in Gong-territorium |
| Founding | €997 | **€1.497** | Voor NIEUWE plekken; bestaande 10 blijven €997 lifetime; nieuwe 10 op €1.497 |

---

## Concurrent-weerlegging: waarom €2.497 ipv €722 stack

### De naieve stack-berekening

Een prospect-bureau rekent op: GoHighLevel Agency Pro $497 + ChatGPT Team $60 +
Buffer Team $120 + Canva Pro $45 = **~€650-€722/mo totaal**. Waarom dan
€2.497/mo voor FMai Growth?

### Wat die stack NIET doet (en FMai wel)

Dit moet de site-copy expliciet gaan framen. Zeven gaten in de naieve stack:

1. **Niemand schrijft de content in brand voice.** ChatGPT Team geeft toegang
   tot GPT — niet aan Sindy-voice systeem. FMai heeft **QSE V3 5-dimensionale
   scoring** waar Brand Voice 35% weegt, getrained per client. Bureau zou dit
   handmatig moeten iterativeeren (40-60 uur/client/maand).

2. **Niemand plant het op optimale tijd in de juiste rotatie.** Buffer plant
   wel, maar niet met brand-day-pillar matrix per client. FMai's
   **pre-computed rotation matrix + SAG V14** doet dit autonoom.

3. **Niemand maakt de content.** ChatGPT schrijft copy — het maakt geen
   carousels, video ads, reels, UGC-video's. Stack moet extra: Canva templates
   (handmatig) + Nano Banana + Kling + Remotion = 4 extra tools en
   integratie-werk.

4. **Niemand analyseert de resultaten en leert.** Geen van die tools sluit de
   loop: content → post → metrics → learnings → volgende content. FMai's
   **Client Intelligence learning loop** (5 tabellen, 3 workflows, weekly
   synthesis) doet dat automatisch.

5. **Niemand antwoordt de DM's en telefoons.** Stack heeft geen Voice Agent,
   geen ManyChat-level DM automation met brand-voice replies.

6. **Niemand onthoudt de client cross-sessions.** ChatGPT Team heeft geen
   per-client isolated memory; FMai's **4-layer memory + pgvector + dream
   consolidation** bouwt over maanden een client intelligence op die niet
   opnieuw uitgelegd hoeft te worden.

7. **Niemand levert het rapport in het Nederlands aan de eindklant.** Stack
   vereist dat iemand het samenstelt. FMai's **weekly PDF narrative report
   cron** levert dit auto.

### Gereconstrueerd FTE-equivalent van de stack

Om de output van FMai uit de stack-alternatief te halen: het bureau heeft
**1 content marketeer + 0,5 designer + 0,3 PPC specialist + 0,2 social manager
per 3-5 clients**. Dat is ~2 FTE all-in = **€8.000-€10.000 interne loonkost**
ipv €722 tooling. De tooling is 10% van de totale kost. FMai levert
tooling+werknemer voor €2.497 = **4-5x goedkoper dan intern FTE-team** terwijl
het 24/7 werkt en niet op vakantie gaat.

### Copy-richtingen (verplicht om €2.497 te verkopen)

- **"Geen tool — een AI-team. 8 agents die 24/7 werken, 40+ uur output per
  client per maand, zonder vakantie of ziekteverzuim."**
- **"Replace €8.000/mo FTE-team met €2.497/mo FMai Growth — dezelfde output,
  zonder werkgeverslasten."**
- **"ChatGPT Team + Buffer + Canva = €722/mo tooling zonder iemand die het
  uitvoert. FMai = €2.497/mo tooling + werknemer."**
- **Naast elke tier: "Vergelijkbaar met [X FTE]-equivalent output."**

---

## Premium Anchor Strategie

De vraag: **hoe positioneert FMai zich als schaars, "beste in klasse,
gelimiteerde capaciteit"** — niet "ook een optie"? Precedenten:

- **Superhuman** ($30/mo vs Gmail $0): anchor = "elke email is een paar seconden
  sneller, cumulatief uren/week gewonnen" + invite-only tot 2022
- **Linear** ($10-$16/seat vs Jira Free $0): anchor = "design-first, Apple-level
  polish, geen bloat"
- **Notion Business** ($20/seat vs Google Docs $0): anchor = "one tool replaces
  five"
- **Gong** ($1.298-$3.000/user/jr, platform fee $5-$50K, 2-3yr contract): anchor
  = "complete revenue intelligence, elke rep-call leert, enterprise-grade"

### FMai's anchor-candidaten (ranked)

**#1 aanbevolen anchor: "Agency's AI Operations Partner — 20 plekken per jaar"**

Signalen op website (alle te implementeren):

- **Capaciteit-indicator**: "2026: 14/20 plekken ingevuld" (real counter,
  update quarterly; pipe-dream als lancer als 0/20 nu) — scarcity-signaal
- **Application-only, video-call intake**: geen "Sign up" knop voor agency
  tiers; alleen "Apply for Partnership" met form dat een echte intake-call
  triggert. Dit is al jullie plan, maar framing op site moet expliciet "we nemen
  jullie wel/niet aan" zijn ipv "book a demo"
- **Commitment-clausule**: minimale 6 of 12 maanden op Growth, 12 op
  Professional, 24 op Enterprise — standaard voor high-touch (Gong 2-3 jaar,
  premium fractional CMO 12+ mnd)
- **Owner-signed onboarding**: site noemt expliciet "Daley persoonlijk begeleidt
  de eerste 4 weken onboarding per klant" — schaarste via owner-bandwidth
- **Proof-bar met echte getallen**: SKC case (3 IG-accounts, 21 carousels/week,
  QSE-score 82, dashboard screenshot). Niet "increased engagement" maar "42
  posts/week gegenereerd autonomously, 1,92% engagement vs 1,23% reels"
- **Founder-led media**: Daley op LinkedIn, blog-posts, podcasts — personal
  brand als scarcity-signal (je koopt toegang tot de persoon, niet de software)
- **"Niet voor iedereen" copy**: expliciet **anti-ICP** lijst op site:
  "niet voor agencies >30 FTE, niet voor branding/creative-only agencies, niet
  voor <€300K revenue" — signaleert keuze-criteria

**#2 secundair anchor: "The Future is 1:10 (1 human director, 10 AI employees)"**

McKinsey/Gartner-framing
([pymnts](https://www.pymnts.com/news/artificial-intelligence/2026/ai-moves-saas-subscriptions-consumption)):
het beste 2026-bureau heeft 1 menselijke director op 10 AI-employees. FMai
levert precies die 10 — de director is jouw agency owner. Dit is een
strategische positionering die een traditioneel bureau niet kan claimen zonder
FMai te kopen.

**#3 tertiair anchor: "De enige NL AI-partner met proof-pipeline"**

SKC proof-point is concreet, Nederlands, meetbaar. Geen NL-concurrent heeft dit
(Aigency Amsterdam doet creative visuals, niet continue content-operaties).
"NL-first, GDPR-compliant, Dutch-native" is een categorie-monopolie voor
FMai in 2026.

---

## Aanbeveling per Tier

### Partner — €347 houden

**Rationale**: matcht Jasper Pro ($69), Hootsuite Professional ($99) op
upper-band solo; binnen premium-aware range; 8 skills zonder Voice/Video Ad/Reel
mechanisch kannibalisatie-safe voor agencies. **NIET verlagen naar €97-€147
(zoals research doc 2026-04-19 voorstelt)** — dat schaadt positionering "we
nemen geen DIY-klanten" en introduceert support-load voor lage marge. €347 is
hoog genoeg om serieuze aanvragers te filtreren + laag genoeg om solo-shop
owner te accommoderen die fractional AI wil.

Nieuwe copy-bovenschrift: **"Single Workspace — voor consultants, coaches en
solo e-commerce brands die met FMai serieus willen groeien, niet als
hobby."**

### Growth — €2.497 (was €1.497, +67%)

**Rationale**: retainer-alternatief (€3K-€8K boutique NL); 2,8-5,5x
FTE-arbitrage is gezond maar niet exploitatief; premium-drempel (>€2K triggert
due-diligence reflex, wat FMai's proof-points uitnodigt); psychologisch
"teams-level" (Superhuman Business, Notion Business, Linear Business zitten
€20-€40/seat = €200-€400/seat/maand × 5 seats = €1K-€2K, FMai levert 5 hele
workspaces in die band).

Founding Member-kortingslevering (€997) blijft intact, maar nieuwe Founding
gaat naar €1.497 — zie onder.

### Professional — €4.497 (was €2.997, +50%)

**Rationale**: 15 workspaces × €300/ws FTE-waarde = mid-bureau positie
(7-15 FTE agency ICP matchend); boutique Amsterdam-retainer entry-tier voor
full-service (€8K-€25K/mo); 4,6-9,1x arbitrage. **Belangrijk**: Professional
moet gaten naar Growth niet te groot zijn dat klanten Growth overkopen met
extra workspace add-ons. Gap €4.497 - €2.497 = €2.000 = 10 extra workspaces
à €200. Extra workspace add-on blijft €97/ws — dus bureau met 8 clients kan
Growth (5) + 3× add-on (€291) = €2.788 pakken. Fix: **extra workspace add-on
omhoog naar €147/ws**, dan 8 clients = €2.938 = net onder Professional maar
zonder Slack-support en CSM. Daarmee blijft Professional aantrekkelijk bij
12+ clients.

### Enterprise — €7.997 (was €4.997, +60%)

**Rationale**: unlimited workspaces + white-label + API + dedicated CSM +
onboarding €5K; zit in Gong.io territorium (~$110-$250/seat). In NL context met
20+ client-agencies (40+ workspaces) levert dit €200/ws — absurde waarde. Maar
dit moet **exclusief application-based, minimaal 24mo commit, 20% annual
prepay discount**. Enterprise zonder commit is korting-vergelijking; met commit
wordt het een partnership contract.

Tweede rationale: deze tier fungeert als **ankerprijs** voor de perceptie van
Professional. Als Enterprise €4.997 blijft, dan ziet Professional eruit als
60% van premium. Als Enterprise €7.997 wordt, ziet Professional eruit als 56%
van premium — psychologisch "midden-tier" wat de primary agency-doelgroep voelt.

### Founding — €997 houden voor bestaande 10 plekken, €1.497 voor NIEUWE plekken

**Rationale**: de 10 oorspronkelijke Founding-leden kregen eerste-mover
voorrecht met €997/mo lifetime — dat mag niet veranderen (vertrouwen-kapitaal).
Maar: als er "10 plekken" waren en bijvoorbeeld 3 ingevuld, dan de resterende
7 gaan naar €1.497. Reframing:

- "Founding Members Wave 1 (10 plekken, 7 resterend)" — €997/mo lifetime,
  eerste wave
- **NIEUW**: "Founding Members Wave 2 (5 extra plekken)" — €1.497/mo lifetime;
  launched na Wave 1 vol; minder inhoudelijke korting maar nog steeds premium
  voor 18-month commit

Alternatief: laat €997 volledig doodbloeden en introduceer "Early Partner"
SKU op €1.497 lifetime. Kies op basis van actuele Founding-animo.

---

## Premium Anchor Strategie — concrete website-signalen

Niet alleen prijs. **Prijs zonder congruente signalen leest als te duur;
prijs met congruente signalen leest als terecht premium.** Implementeer alle
onderstaande op futuremarketingai.nl voor de prijsupdate live gaat:

### Scarcity signalen

- [ ] Live counter "Plekken 2026: X/20 ingevuld" op hero + pricing page
- [ ] "Applicaties dicht na Y" datumbadge per quarter
- [ ] "Waitlist" CTA (niet "Sign up") voor alle tiers behalve Partner
- [ ] Email aan waitlist-leads om de 4 weken: "nog 3 plekken voor Q2"

### Proof signalen

- [ ] "Case study" pagina met SKC: 21 carousels/week, 0% handmatig, 3 accounts
  rotatie, QSE-score over tijd als grafiek
- [ ] "Agency dashboard tour" 3-min video met echte werkruimte (Sindy +
  skinclarityclub)
- [ ] Referral quote-block: "Dit is geen tool meer, dit is een team" — met
  foto, bureau-naam, rol
- [ ] Live pipeline-counter: "Aantal content items gegenereerd deze maand: X"
  (pull van fma-app DB)

### Commitment signalen

- [ ] "Application-only" — geen self-signup voor agency tiers
- [ ] 45-60 min intake video-call (al in scope)
- [ ] 6-12mo commitment als default op Growth+; no refund na 30d
- [ ] Owner-letter op pricing page: "Daley persoonlijk begeleidt eerste 4 weken"

### Anti-ICP signalen (counterintuitief maar effectief)

- [ ] "Dit is niet voor jou als..." sectie: >30 FTE bureau, <€300K revenue,
  geen Dutch-language content, enkel creative agency zonder groei-focus
- [ ] "We zeggen nee tegen 60% van aanvragers" badge
- [ ] Pricing-tier karakter-sketch: "Growth is voor bureaus met 3-10 clients
  die willen groeien naar 10-20"

### Premium visuele signalen

- [ ] Dark-mode-first met cyan accent (al in design-stack)
- [ ] Geen stock images. Foto's van real SKC content, real dashboard
- [ ] Prijzen niet verstopt — direct zichtbaar op pricing page
- [ ] Geen "percentage discount" language ("save 30%") — dat is retail-frame

---

## Open Vragen Owner

Deze vijf beslissingen moeten vastliggen voor price-update live gaat:

1. **Bestaande Growth-klanten (als er zijn): grandfather op €1.497 of upgrade
   naar €2.497?** Default-advies: **grandfather voor 12 maanden** (goodwill +
   voorkom churn), daarna marktconforme price-letter. Uitzondering: als er nog
   géén betalende agency-klanten op Growth zijn, dan direct op €2.497 launchen
   en geen backcompat-issue.

2. **Partner €347 als onderdeel van "20 klanten/jaar cap" of apart?** Als
   Partner meetelt in de 20-cap, verlies je 18-fold revenue-leverage vs Growth
   (Partner €347 × 12 = €4.164 LTY vs Growth €2.497 × 12 = €29.964). Default-advies:
   **Partner telt niet in de cap, maar is wel application-based en krijgt
   basis-intake (30 min ipv 60 min)**. Max 30 Partner-plekken per jaar
   geindiceerd om totale support-load binnen solo owner bandwidth te houden.

3. **Price-signalering op site: "vanaf €2.497" of expliciete tier-prijzen?**
   Default-advies: **expliciete prijzen** voor Partner/Growth/Professional,
   "op aanvraag" alleen voor Enterprise (Gong-model). Verborgen prijzen voor
   mid-tier geeft bureau-prospects geen houvast en vertraagt sales-cycle.

4. **Enterprise-commitment: 12mo, 24mo of beide (met discount)?** Default-advies:
   **12mo standaard, 24mo geeft 15% off (€7.997 → €6.797 effectief)**. Dit
   matcht Gong-logica en geeft owner cash-flow zekerheid. Minder dan 12mo
   ondermijnt "partnership" framing.

5. **Website-copy audit voor nieuwe pricing launch: ingehuurd of zelf?** Dit
   document noemt 15+ specifieke copy-aanpassingen. Default-advies: **ingehuurde
   B2B copywriter met AI/SaaS-positioning ervaring (2-3 weken turn-around,
   €3K-€5K budget)**. Owner bandwidth moet op klant-intake blijven, niet op
   copy herschrijven.

---

## Bronnen

### NL arbeidsmarkt (2026)

- [Salaris social media manager NL 2026 — mijnzzp.nl](https://www.mijnzzp.nl/Beroep/999-Social-media-beheerder/Salaris-en-tarief) — €2.500-€3.500 bruto
- [Glassdoor social media manager salaris](https://www.glassdoor.nl/Salarissen/social-media-manager-salarissen-SRCH_KO0,20.htm)
- [Content marketeer salaris NL — jobted 2026](https://www.jobted.nl/salaris/content-marketeer) — €3.187 bruto gem.
- [Werkgeverslasten 2026 berekenen — ondernemenmetpersoneel.nl](https://www.ondernemenmetpersoneel.nl/orienteren/personeelskosten/werkgeverslasten-berekenen-2026) — 20-35% bovenop bruto
- [Werkgeverslasten NL 2026 — dezaak.nl](https://www.dezaak.nl/financien/payroll-en-salarisadministratie/wat-zijn-werkgeverslasten-en-hoe-bereken-je-ze/) — tot 25-45%
- [Indeed content marketeer NL](https://nl.indeed.com/career/content-marketeer/salaries)

### Agency martech stack & retainers (2026)

- [Boutique Amsterdam agencies — venturemedia 2025](https://www.venturemedia.io/post/digital-marketing-agencies-in-amsterdam-2025) — €3K-€8K full-service retainer
- [NL agency pricing — inBeat Amsterdam](https://inbeat.agency/blog/top-amsterdam-digital-marketing-agencies)
- [AI agency pricing 2026 — digitalagencynetwork](https://digitalagencynetwork.com/ai-agency-pricing/) — $2K-$8K AI content retainers
- [Fractional CMO rates 2026 — growtal](https://www.growtal.com/2026-fractional-cmo-rates-a-guide-to-hourly-retainer-performance-models/) — $5K-$15K retainers standard
- [AI content creation enterprise pricing — workfx](https://blogs.workfx.ai/2026/03/20/ai-content-creation-service-pricing-for-enterprise-marketing-in-2026/)
- [Social media marketing pricing 2026 — socialrails](https://socialrails.com/blog/social-media-marketing-agency-pricing-guide)

### Premium B2B platform benchmarks (2026)

- [Attio pricing 2026](https://attio.com/pricing) — $29-$69/seat, custom Enterprise
- [Linear pricing 2026 — quackback](https://quackback.io/blog/linear-pricing) — $10-$16/seat, Enterprise custom
- [Notion pricing 2026](https://www.notion.com/pricing) — $12-$24/seat
- [Superhuman pricing plans 2026](https://superhuman.com/plans) — $30-$40/user
- [Gong.io pricing 2026 — cloudtalk](https://www.cloudtalk.io/blog/gong-pricing/) — $1.298-$3.000/user/jr + $5K-$50K platform fee + 2-3yr commit
- [Gong pricing breakdown — marketbetter](https://www.marketbetter.ai/blog/gong-pricing-breakdown-2026/)
- [Vendasta pricing 2026](https://www.vendasta.com/pricing/) — Premium $999 + $65/seat
- [GoHighLevel pricing 2026](https://www.gohighlevel.com/pricing) — $97/$297/$497
- [SocialPilot pricing 2026](https://www.socialpilot.co/plans) — $25-$170/mo agency
- [AgencyAnalytics pricing 2026 — reportingninja](https://www.reportingninja.com/blog/agency-analytics-pricing) — per-client model

### AI agent platforms (2026)

- [Lindy best AI agent platforms 2026](https://www.lindy.ai/blog/state-of-ai-agent-platforms-2026) — Artisan $2K-$5K/mo
- [Lindy Relevance AI pricing 2026](https://www.lindy.ai/blog/relevance-ai-pricing)
- [Lindy CrewAI pricing 2026](https://www.lindy.ai/blog/crew-ai-pricing)

### SaaS-pricing macro trends (2026)

- [McKinsey B2B pricing AI revolution](https://www.mckinsey.com/capabilities/growth-marketing-and-sales/our-insights/b2b-pricing-navigating-the-next-phase-of-the-ai-revolution)
- [SaaS AI agentic pricing models 2026 — getmonetizely](https://www.getmonetizely.com/blogs/the-2026-guide-to-saas-ai-and-agentic-pricing-models) — 62% SaaS heeft AI-premium tier
- [PYMNTS AI usage-based pricing](https://www.pymnts.com/news/artificial-intelligence/2026/ai-moves-saas-subscriptions-consumption) — 70% prefer usage over seat
- [MindStudio per-seat pricing dying](https://www.mindstudio.ai/blog/saas-pricing-ai-agent-era)
- [AI cost Zylo 2026](https://zylo.com/blog/ai-cost/) — AI employee $20-$500/mo vs $11K human FTE
- [AI employee ROI — noimosai](https://noimosai.com/en/blog/the-real-cost-of-hiring-an-ai-employee-vs-traditional-staff-2026-roi-guide)
- [CFO scramble AI pricing — PYMNTS](https://www.pymnts.com/artificial-intelligence-2/2026/cfos-scramble-as-ai-pricing-breaks-traditional-saas-billing-model/)

### Interne

- `c:\Users\daley\Desktop\Futuremarketingai\docs\plans\2026-04-19-pricing-solo-research.md`
- `c:\Users\daley\Desktop\Futuremarketingai\docs\plans\audit-capabilities-inventory.md`
- `c:\Users\daley\Desktop\fma-app\src\lib\skills.ts`
- `C:\Users\daley\.claude\projects\C--Users-daley-Desktop-fma-app\memory\aaas-strategy.md`
