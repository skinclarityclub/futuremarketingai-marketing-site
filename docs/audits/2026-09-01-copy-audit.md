# Copywriting-audit marketingwebsite future-marketing.ai — 2026-09-01

STATUS: compleet. llms.txt-check, meta-description-sweep en skill-status-verificatie zijn uitgevoerd; resultaten verwerkt in §0 (bevinding 4), §4 en §8.

**Bronnen**: `fmai-nextjs/messages/nl.json` (volledig gelezen, alle 41 namespaces), alle `page.tsx` onder `src/app/[locale]/`, `src/lib/constants.ts`, `src/lib/pricing-data.ts`, `fma-app/src/lib/skills.ts` (pricing/skill-SSoT), `public/` asset-inventaris, `content/blog/*.mdx` (frontmatter), `fmai-nextjs/CLAUDE.md` (glossary + canon).
**Gegeven context (gemeten, niet aangenomen)**: GSC 2026-06-03 t/m 08-29: 246 impressies, 1 klik. `public/screenshots/` leeg. Product heeft: strategielaag met doelen/jaarplanning, 11-stappen onboarding-flow, Clyde via WhatsApp, brede platform-integraties.

---

## 0. De 21 zwaarste bevindingen, gerangschikt op conversie/traffic-impact

| # | Bevinding | Vindplaats |
|---|-----------|------------|
| 1 | **De site beschrijft het product als uitvoerder-zonder-strategie, terwijl het product een strategielaag hééft.** `about.mission.text`: "een AI Marketing Medewerker die de uitvoering op zich neemt. Zodat bureauteams zich kunnen richten op strategie". Grep over heel nl.json: doelen/jaarplanning/contentpijlers als productlaag = 0 treffers. Daley's kernklacht letterlijk bevestigd. | `messages/nl.json` → `about.mission.text` + afwezigheid overal |
| 2 | **Nul productbewijs in pixels.** Copy claimt "Live in productie sinds 2025" (`home.hero.trustAnchor`) en "autonoom", maar er is geen enkele screenshot. Erger: de case-study zegt het zelf hardop: "Definitieve thumbnails worden later toegevoegd; de huidige cards tonen volume en type per merk" (`case_studies.skc.gallery.subtitle`) — een intern excuus dat live staat. | `public/screenshots/skills/` (leeg) + `case_studies.skc.gallery.subtitle` |
| 3 | **Bewijs-mismatch met de ICP.** Doelgroep = "Bureaus met 5 tot 30 FTE die 10 tot 50 merken bedienen" (`home.icp.fit1`). Het enige bewijs is SkinClarity Club: geen bureau maar een merk-operator met 4 eigen merken. Nergens wordt die brug geslagen ("als het voor 4 eigen merken werkt, werkt het voor jouw 15 klantmerken omdat…"). De koper ziet bewijs dat expliciet niet op hem lijkt. | `home.icp.*` vs `case_studies.skc.*` |
| 4 | **Meta-descriptions verkopen dode features als live — het patroon zit op drie plekken.** (a) `home.meta.description`: "Schrijft content, **belt leads** en onthoudt elk merk" — Voice Agent staat op `coming_soon` (`src/lib/skills-data.ts` regel 152; `roadmap.voiceAgent.phase: "In testing"`). De mei-audit repareerde de kaarten, niet de meta — juist de enige regel die Google toont bij die 246 impressies. (b) `skills-voice-agent.meta.description`: "Clyde **voert** AI-telefoongesprekken, **boekt** afspraken (…) 5 credits per minuut" — tegenwoordige tijd + prijs voor iets dat niet live is; de title mist "binnenkort". (c) `skills-reel-builder.meta.description`: "Korte verticale video's (…) 25 credits per Reel" — idem, geen coming-soon-markering. `skills-index.meta.description` doet het wél goed ("10 live, 2 binnenkort") — dat is de norm. | `home.meta.description`, `skills-voice-agent.meta.*`, `skills-reel-builder.meta.*` |
| 5 | **Verzonnen/tegenstrijdige technische specs in skill-FAQ's.** Voice: FAQ zegt "ElevenLabs (stem) en Twilio of Telnyx" (`skills-voice-agent.faq.items.q2.answer`) terwijl dezelfde pagina "Koppel een telefoonnummer via VAPI" zegt (`skills-voice-agent.how.step2.body`) en roadmap "productie-integratie met VAPI" (`roadmap.voiceAgent.description`). Reels: "Runway en Pika voor scene-creatie" (`skills-reel-builder.faq.items.q2.answer`) — TE VERIFIEREN, product bouwt op eigen Remotion-pipeline. Blogs: "Beelden worden via Unsplash- of DALLE-API toegevoegd" (`skills-blog-factory.faq.items.q2.answer`) — TE VERIFIEREN. SEO: "Ahrefs of Semrush voor keyword-tracking (jouw bestaande seat)" + "Otterly-probes" (`skills-seo-geo.faq.items.q2.answer`) — TE VERIFIEREN; "levert 12 procent kans op rich-result lift" (`q5`) is pseudo-precisie. Eén technisch onderlegde bezoeker of één kennismakingsgesprek en het vertrouwen is weg. | 5 skill-FAQ-namespaces |
| 6 | **De case study spreekt zichzelf drie keer tegen over het aantal actieve vaardigheden**: "alle 10 live skills aan" (`case_studies.skc.skills.subtitle`), "de 9 vaardigheden aan elkaar knoopt" (`skills.skill6Body`), "Zes vaardigheden van Clyde staan aan" (`chapter2.intro`). Plus "4 merken live in 7 dagen" (`hero.chip2`) botst met de eigen 4-weken-onboarding op elke andere pagina. | `case_studies.skc.*` |
| 7 | **Buffer/Hootsuite als publicatiekanaal in de case study** ("Geplande publicatie via Buffer-integratie", `case_studies.skc.after.step5.body`; "Bron: Buffer en Hootsuite scheduled-content-export", `outcomes.metrics.outputVolume.sourceNote`) terwijl de home-vergelijkingstabel Buffer juist als DIY-concurrent wegzet (`home.comparison.headers.diyHint`: "ChatGPT, Claude, Buffer"). Het echte systeem publiceert via de eigen n8n/Postiz-pipeline — TE VERIFIEREN welke naam extern gecommuniceerd mag worden, maar de huidige dubbele rol van Buffer is intern al kapot. | `case_studies.skc` + `home.comparison` |
| 8 | **"Credit" wordt nooit uitgelegd.** Pricing verkoopt "800 credits per werkruimte", "8.000 credits per maand", packs van €39-€697, "5 tot 25 credits per actie" (`pricing.faq.items.q1.answer`), en elke skill-meta noemt per-actie-prijzen ("15 credits per artikel"). Nergens: wat is één credit, wat verbruikt een gemiddeld merk per maand, één rekenvoorbeeld. De koper kan de dekking van geen enkel tier beoordelen — precies waar de koopbeslissing valt. | `pricing.*`, alle `skills-*.meta.description` |
| 9 | **"Werkruimte" wordt nergens gedefinieerd behalve in een verstopte form-hulptekst**: "Eén werkruimte per merk" (`apply.form.workspacesHelp`). Het hele prijsmodel hangt aan dit woord; de glossary (`glossary.*`) heeft 4 begrippen maar dit niet. | `apply.form.workspacesHelp`, `glossary` |
| 10 | **Data-export: 24 uur of 14 dagen?** "Je data is altijd binnen 24 uur exporteerbaar" (`home.faq.items.q2.answer`, ook `about.infra.noLockIn.body`, `memory.isolation.body2`, `home.pillars.infrastructure.stat`) versus "Bij opzegging krijg je binnen 14 dagen een volledige export" (`pricing.faq.items.q8.answer`). Directe tegenspraak op een vertrouwensclaim. | 4 plekken vs `pricing.faq.q8` |
| 11 | **Legacy "chatbots"-copy lekt de oude positionering in een live pagina.** Op /skills/lead-qualifier rendert `MultiPlatformShowcase` met "50.000+ / Vragen per maand" (`chatbots.multi_platform.stats.inquiries`) — onverdedigbaar cijfer voor een bedrijf met 1 klant; "Claude AI" als brain-label (`chatbots.multi_platform.brain_label`) — vendor-namedrop die botst met de EU-eigen-stack-framing; "Al live: SkinClarity Club draait dezelfde AI-medewerker over website, Shopify en WhatsApp" (`chatbots.multi_platform.case_study`) — TE VERIFIEREN, de case study zelf noemt alleen Instagram; en de CTA "Vraag een gratis strategiesessie aan" (`chatbots.cta.button`) schendt de glossary-canon "Plan een gesprek". | `chatbots.*` via `src/components/chatbot/MultiPlatformShowcase.tsx` op `(skills)/skills/lead-qualifier` |
| 12 | **Het solo-founder-continuïteitsbezwaar wordt overal opgeroepen en nergens beantwoord.** De copy benadrukt 9x dat alles op één persoon draait ("Ik schrijf Clyde's code", `home.founder.quote1`; "door een solo founder", `about.hero.tagline`; "1:1 met Daley", `home.pillars.partnership.stat`). Geen enkele FAQ behandelt: wat als Daley uitvalt, wie is aansprakelijk als Clyde iets fout publiceert, hoe zit escrow/continuïteit. Voor een bureau dat 10-50 klantmerken toevertrouwt is dit hét gesprek-killer-bezwaar. | `home.founder`, `about.*`, alle FAQ's (afwezigheid) |
| 13 | **Pricing meta-title is feitelijk fout**: "Prijzen: Founding €997 per werkruimte" (`pricing.meta.title`) — Founding is juist een vast tarief voor onbeperkt werkruimtes. Dit is de SERP-regel van de belangrijkste commerciële pagina. | `pricing.meta.title` |
| 14 | **De contact-pagina noemt zichzelf "AI Marketing Bureau" in de SERP** (`contact.meta.title`: "Contact Future Marketing AI \| AI Marketing Bureau") terwijl de hele positionering is: geen bureau, maar AI-medewerker vóór bureaus. Positioneringsbreuk precies waar Google hem toont. | `contact.meta.title` |
| 15 | **Het onboarding-verhaal bestaat in 3+ onverenigbare versies**: home zegt 4 weken met urenverdeling (`home.processTimeline.weeks.*`), how-it-works zegt 5 stappen waarbij productie "vanaf week 5" start (`how-it-works.process.steps.production.timeStamp`), en elke skill-FAQ claimt een eigen onboardingduur (1 week e-mail, 2 weken blogs, 3-5 dagen research, 2-3 weken ads, 3-4 weken voice) die niet optellen binnen de beloofde 4 weken. De echte 11-stappen flow uit de app komt nergens voor. | `home.processTimeline`, `how-it-works.process`, alle `skills-*.faq.q4` |
| 16 | **Vindbaarheid: geen enkele H1 draagt zoekintentie.** "Dit is Clyde." (`home.hero.headlineMain`), "Clyde onthoudt alles." (`memory.hero.headlineMain`), "Over FutureMarketingAI" (`about.hero.title`) — allemaal merk-interne zinnen. De categorie "AI Marketing Medewerker" is zelfbedacht (nul zoekvolume; TE VERIFIEREN maar 246 impressies in 88 dagen bevestigen het). De kennisbank (15 posts) is het enige dat op zoektermen mikt; de commerciële pagina's liften er niet op mee. | alle `*.hero`-keys |
| 17 | **Product is verder dan de site — twee hard aanwijsbare gevallen.** (a) Site: "Op dit moment uitsluitend Gmail (…) Outlook en custom IMAP staan op de roadmap voor Q3" (`skills-email-management.faq.items.q2.answer`); product: "Gmail + Outlook (Microsoft 365) OAuth integratie" staat live in `fma-app/src/lib/skills.ts` (emailManagement.features). (b) Site verkoopt "ManyChat DM" als keyword-autoresponder; product heet inmiddels "Social Command Center" met unified inbox, provider health en meerdere providers (`fma-app/src/lib/skills.ts` manychatDm.longDescription). | site vs `fma-app/src/lib/skills.ts` |
| 18 | **WhatsApp-verhaal is inconsistent en onderverkocht.** `skills-clyde.hero.subtitle` zegt "chat, Slack en Telegram"; `skills-clyde.faq.items.q1` zegt "chat, Slack, Telegram of WhatsApp"; `q2` belooft zelfs "een Slack-gesprek wordt voortgezet in WhatsApp" en e-mail-forwarding. `skills-manychat.faq.q2` zegt dan weer "WhatsApp Business staat op de roadmap voor Q3". Clyde-via-WhatsApp is echt (gegeven) en is een verkoopargument van de eerste orde ("app je AI-medewerker zoals je een collega appt") — nu is het een voetnoot die zichzelf tegenspreekt. Telegram en e-mail-forwarding: TE VERIFIEREN. | `skills-clyde.*`, `skills-manychat.faq.q2` |
| 19 | **"Volledig autonoom" naast "Sindy reviewt" op dezelfde kaart** (`home.caseStudyCard.metric1Value`: "Volledig autonoom" / `metric1Label`: "Sindy reviewt, Clyde voert uit"). Kies één waarheid; de eerlijke versie ("autonoom ná goedkeuring") is óók de sterkere. | `home.caseStudyCard` |
| 20 | **Assessment claimt validatie die er niet is**: "Resultaten gevalideerd met bureaus in de praktijk" (`assessment.intro.trust.validated`) — er is één klant en dat is geen bureau. TE VERIFIEREN of er validatiegesprekken waren; zo niet: schrappen. | `assessment.intro.trust.validated` |
| 21 | **llms.txt — het bestand dat speciaal voor AI-engines is geschreven — spreekt de site op drie punten tegen**: "Max 20 new partnerships per year" (6 plekken; site + `constants.ts` zeggen 10), "12 skills (9 live, 3 coming soon)" (site: 10 live, 2 binnenkort), "Daley reviews personally within 48 hours" (site: 3 werkdagen). Voor een site die GEO als vaardigheid verkoopt, is een stale llms.txt een zelfdiagnose. | `public/llms.txt:3,7,21`, `public/llms-full.txt:3,9,302` |

---

## 1. Inventaris — alle pagina's

| Pagina | H1 | Subkop | Belangrijkste claim | CTA |
|---|---|---|---|---|
| **/** (home) | "Dit is Clyde." + tagline "Jouw AI marketing medewerker." (`home.hero.headlineMain`/`tagline`) | "Onthoudt elk merk. Tien vaardigheden vandaag, twee binnenkort: social, blogs, ads, e-mail, leadkwalificatie, SEO, analytics. Autonoom uitgevoerd, met geheugen dat campagnes overleeft." (`home.hero.subtitle`) | 36 posts/week autonoom voor SKC; €5.000/mnd bespaard; 4-laags geheugen | "Plan een gesprek" (`home.hero.cta`) |
| **/about** | "Over FutureMarketingAI" (`about.hero.title`) | "De eerste AI Marketing Medewerker voor bureaus, door een solo founder." (`about.hero.tagline`) | Early-adopters bouwen "2 tot 3 jaar" onhaalbare voorsprong (`about.timeline.key_message.title`) | "Plan een gesprek" (`about.cta.demo_button`) |
| **/how-it-works** | "Hoe begint jouw partnership met Clyde?" (`how-it-works.hero.title`) | "Vijf stappen van eerste gesprek tot autonoom draaien. Geen zelfbediening." (`hero.description`) | 4 weken setup door Daley persoonlijk, daarna autonoom met goedkeuring | "Plan een gesprek" |
| **/pricing** | "Premium partnerships. Founding €997 levenslang." (`pricing.hero.title`) | "Alle prijzen staan zichtbaar. (…) geen 'neem contact op voor prijs'." (`hero.description`) | Founding €997 levenslang; Growth €499/Pro €399/Ent €299 per werkruimte | "Plan een gesprek" (`pricing.applyCta`) |
| **/founding-member** | "Word Founding partner. Eén keuze, levenslang vast." (`founding-member.hero.title`) | "Tien plekken totaal (…) €997 per maand, levenslang gelockt, voor onbeperkt aantal werkruimtes." (`hero.description`) | Levenslange prijsgarantie + €0 onboarding (andere tiers €1.997-€5.997) | "Reserveer je plek" (`hero.cta`) |
| **/contact** | "Algemene vragen of feedback?" (`contact.hero.title`) | "Voor een partnership-aanvraag ga je naar /apply." (`hero.description`) | Reactie binnen 1-2 werkdagen | "Verstuur bericht" / "Plan een gesprek" |
| **/memory** | "Clyde onthoudt alles." + "Per merk, voor altijd." (`memory.hero.headlineMain`/`headlineAccent`) | "Dit is het verschil tussen een generieke AI-prompt en een AI Marketing Medewerker: geheugen." (`hero.subtitle`) | 4 geheugenlagen, nachtelijke consolidatie, strikte merkisolatie | "Plan een gesprek" |
| **/apply** | "Plan een gesprek" (`apply.hero.title`) | "Geen zelfbediening. (…) We beoordelen elke aanvraag persoonlijk en antwoorden binnen 3 werkdagen." (`hero.subtitle`) | Persoonlijke beoordeling door Daley binnen 72u | "Verstuur aanvraag" (`form.submit`) |
| **/assessment** | "Hoe klaar is jouw bureau voor AI?" (`assessment.intro.titleLead`+`titleAccent`) | "Zestien vragen, vijf minuten. Eindigt met je bureau-DNA…" (`intro.subtitle`) | Bureau-DNA uit 5 profielen + 3 aanbevolen vaardigheden | "Start de scan" |
| **/roadmap** | "Wat Clyde binnenkort kan." (`roadmap.hero.title`) | "Tien vaardigheden draaien live (…) Twee staan op de roadmap." (`hero.subtitle`) | Voice in testing, Reels in ontwikkeling; founding krijgt eerst toegang | "Plan een gesprek" |
| **/case-studies/skinclarity-club** | "3 accounts. 4 merken. Eén AI Marketing Medewerker." (`case_studies.skc.hero.title`) | "SkinClarity Club is vanaf de eerste week Founding klant. (…) Autonoom, elke dag, zonder dat het team er omkijken naar heeft." (`hero.subtitle`) | 36 posts/week; goedkeuring 4 min → 30 sec; +30% reach; ~€5.000/mnd besparing | "Plan een gesprek" |
| **/skills** (index) | "De 12 vaardigheden van Clyde" (`skills-index.hero.title`) | "Eén AI Marketing Medewerker, twaalf vaardigheden, één gedeeld geheugen per merk." (`hero.subtitle`) | 10 live, 2 binnenkort | "Plan een gesprek" |
| **/skills/social-media** | "Clyde verzorgt je social media." | Captions/planning/carrousels per merk | SKC: 21 carrousels + 15 posts/week autonoom | "Plan een gesprek" |
| **/skills/voice-agent** | "Clyde neemt de telefoon op." | Inbound/outbound + escalatie — "Binnenkort beschikbaar." | Demo werkt al; productie in pilot | "Plan een gesprek" |
| **/skills/lead-qualifier** | "Clyde kwalificeert je website-leads." | Chatbot + scoring + CRM-routering | "Geen lead gaat verloren door gemiste chats" | "Plan een gesprek" |
| **/skills/email-management** | "Clyde classificeert je Gmail-inbox." | Labels + dagelijkse digest + conceptantwoorden | "Vanaf week 2: 95% of hoger nauwkeurig" (`how.step2.body`) | "Plan een gesprek" |
| **/skills/ad-manager** | "Clyde maakt én stuurt je Meta-ads." | Copy+visuals+video, publicatie, CPL/fatigue-sturing | Maken en managen in één | "Plan een gesprek" |
| **/skills/reporting** | "Clyde rapporteert elke week." | Digest maandag 08:00 + anomalie-alerts | "je hoort het voordat de klant belt" | "Plan een gesprek" |
| **/skills/research** | "Clyde doet jouw marktonderzoek." | Trends + concurrentie met bronvermelding | "Geen LLM-hallucinaties als input" | "Plan een gesprek" |
| **/skills/blog-factory** | "Clyde schrijft je SEO-blogs." | Zoekwoord → longread → publicatie | 1.500-3.000 woorden, 15 credits/artikel | "Plan een gesprek" |
| **/skills/seo-geo** | "Clyde monitort je SEO én AI-citaties." | Audits + posities + GEO-citaties | "De nieuwe zoeklaag draait op AI." | "Plan een gesprek" |
| **/skills/clyde** | "Dit is Clyde. Je AI Marketing Medewerker." | Orkestreert de andere 11 vaardigheden | Multi-channel: chat/Slack/Telegram (FAQ: +WhatsApp/e-mail) | "Plan een gesprek" |
| **/skills/manychat** | "Clyde handelt Instagram-DM's af." | Keywordtriggers + AI-flows + CRM | "Geen gemiste DM." | "Plan een gesprek" |
| **/skills/reel-builder** | "Clyde produceert je Reels." | 9:16 video's + captions + muziek — "Binnenkort" | Template-bibliotheek in opbouw | "Plan een gesprek" |
| **/kennisbank** | "Alles over GEO en AI marketing voor bureaus" (`resources.hero.heading`) | "Diepe gidsen, vergelijkingen en definities." (`hero.intro`) | 4 pillars + woordenlijst; 15 MDX-posts | "Lees verder" |

CTA-monocultuur: op 24 pagina's is de CTA identiek "Plan een gesprek", en 10 skill-pagina's sluiten met exact dezelfde zin: "Plan een gesprek. We bespreken hoe deze vaardigheid past bij jouw merken." (`skills-*.cta.subtitle`). Consistentie is goed; volledige uniformiteit maakt elke pagina inwisselbaar en geeft de bezoeker nergens een lichtere volgende stap (scan, kennisbank, case) op het moment dat hij nog niet gesprek-klaar is — behalve op home, waar de scan wél staat.

---

## 2. Diagnose per pagina

### 2.1 Home — sterkste pagina, maar hij moet 15 secties dragen

**Specificiteit: goed waar het over SKC gaat, hol waar het over de categorie gaat.**
- Sterk en concreet: "21 carrousels en 15 posts, verdeeld over 3 Instagram-accounts. Sinds Q4 2025 zonder onderbreking live." (`home.stats.hero.detail`); de memory-laag-voorbeelden met echte accountnamen (`home.memoryUsp.layers.merken.body`); "Sindy reviewt op vrijdag. Geen uitroeptekens. Posten doorgaans 19:00." (`memoryUsp.layers.voorkeuren.body`) — dit is de beste copy van de site.
- Hol: "Autonoom uitgevoerd, met geheugen dat campagnes overleeft" (`hero.subtitle`) — "geheugen dat campagnes overleeft" is een frase, geen feit. De opsomming "social, blogs, ads, e-mail, leadkwalificatie, SEO, analytics" telt 7 items bij "tien vaardigheden" — slordig.
- "AVG-compliant" (`hero.trustCluster.avgLabel`) — badge zonder link of onderbouwing ernaast.

**Bewijs**: "€5.000/maand bespaard" (`caseStudyCard.metric2Value`) leunt volledig op Sindy's eigen meting; dat staat er eerlijk bij in de case study (`sourceNote`) maar op home staat het kaal. De comparison-rij "Traditioneel bureau: 4.000 tot 12.000 euro" (`comparison.rows.prijs.bureau`) — TE VERIFIEREN, geen bron. "Volledig autonoom" naast "Sindy reviewt" (bevinding #19).

**Mechanisme**: de memoryUsp-sectie en processTimeline zijn de enige twee plekken op de héle site die echt HOE-vragen beantwoorden ("Brand-scan leest merk-DNA per klant: kleuren, fonts, tone en USPs. IG-analyse haalt jouw contentpatronen op." — `processTimeline.weeks.1.body`). Maar dit verdwijnt onder de vouw achter 6 andere secties, en how-it-works — de pagina waar je dit verwacht — heeft het niet.

**Bezwaren onbeantwoord**: continuïteit solo-founder (#12); wie is juridisch aansprakelijk voor gepubliceerde content; wat ziet mijn eindklant (white-label pas bij Enterprise, nooit uitgelegd wat niet-white-label betekent: staat er "Clyde" onder de posts? Nee — maar dat zegt de site nergens).

**Jargon/AI-slop**: "Drie pijlers die geen US-tool kan matchen" (`pillars.title`) — kan-niet-matchen-frame is inwisselbaar; "één brein met gedeeld geheugen" (`faq.items.q5.answer`, 2x) gaat richting cliché maar is nog verdedigbaar.

### 2.2 About — de zwakste verhoudingsgewijs: futurologie in plaats van feiten
- AI-slop, citaten: "Hier bouwen vroege bureaus een voorsprong op die nauwelijks meer in te halen is." (`about.timeline.eras.autonomous.description`); "Early-adopter bureaus bouwen een voorsprong van 2 tot 3 jaar op" + "een voorsprong geeft die laatkomers niet meer inlopen" (`about.timeline.key_message.*`); "Elk bureau heeft AI-medewerkers" in 2027 (`eras.standard.description`). Elke AI-marketingsite van 2024-2026 schreef deze exacte alinea. Geen bron, geen mechanisme, en het ondermijnt de verder nuchtere toon ("Feiten, geen ideologie", `about.infra.subtitle` — die sectie is juist goed).
- Sterk: de infra-sectie (`about.infra.*`) is concreet (Hetzner, Duitsland/Nederland, n8n+Supabase, 24u export) en de capaciteitsuitleg (`about.capacity.body`) geeft een echte reden voor de schaarste. 
- Gat: de "Bouwreis" (`about.journey.milestones.*`) eindigt op "H2 2026: Cohort 2 + Marketplace-app" — er staat geen enkel bewijs uit 2026 zelf (het is september). De tijdlijn voelt daardoor als een pitch deck, precies wat `journey.subtitle` ontkent ("Geen pitch deck, wel een logboek").
- "ge-announced" (`journey.milestones.founding.body`) — half Engels, half Nederlands.

### 2.3 How-it-works — de dunste pagina waar de dikste hoort te staan
3.489 bytes copy; pricing heeft er 10.467. Dit is de pagina die Daley's klacht moet oplossen en hij bestaat uit vijf proces-kaartjes zonder één mechanisme:
- "Daley begeleidt het traject persoonlijk. Intake van de merkstem per merk, KPI-doelen vastleggen, vaardigheden-matrix opbouwen en goedkeuringsworkflows inregelen." (`how-it-works.process.steps.onboarding.description`) — vier abstracta op een rij. WAT is een brand-scan, WAT is een vaardigheden-matrix, HOE ziet een goedkeuringsworkflow eruit? De home-versie (`home.processTimeline`) is concreter dan deze pagina — de hiërarchie staat op zijn kop.
- "Week 1 veel correcties, maar Clyde leert snel." (`steps.production.description`) — dit is eerlijk (goed!) maar legt niet uit HOE hij leert (het geheugen-verhaal van /memory wordt hier niet eens gelinkt in de copy).
- De 11-stappen onboarding-flow uit de app, de strategiesessie, doelen/jaarplanning: 0 woorden.
- Tegenspraak met home: hier start productie "Vanaf week 5" (`steps.production.timeStamp`), home zegt "Week 4: Clyde plant en publiceert autonoom" (`home.processTimeline.weeks.4.body`).

### 2.4 Pricing — transparant over cijfers, stil over betekenis
- Sterk: caps eerlijk benoemd en verklaard (`pricing.faq.items.q1.answer` legt uit WAAROM caps bestaan — beste FAQ-antwoord van de site), downgrade/pauze/exportregels expliciet (q6, q7), "Waarom onze prijzen zichtbaar zijn" (`visibility.body`) is on-brand.
- Zwak: credits (bevinding #8) en werkruimtes (#9) worden verondersteld bekend. `hero.description` somt vier prijzen op zonder ankervoorbeeld ("een bureau met 6 merken betaalt €2.394 en krijgt 4.800 credits ≈ X posts + Y blogs" ontbreekt — de slider doet dit deels, maar pas na scrollen en zonder credits→output-vertaling).
- Fout: meta-title (#13). 
- `tiers.founding.description`: "De oprichtende klanten die vóór launch committeerden." — verleden tijd terwijl er 9 plekken open staan en de site overal "founding open" roept. Tegenstrijdig frame.

### 2.5 Founding-member — beste bewijsvoering van de commerciële pagina's
- "€997 voor onbeperkt. Vanaf 3 merken bespaar je structureel." (`founding-member.pricing.comparison`) met de Professional-rekensom ernaast (`value.line2`: "bij 5 merken €1.995, bij 14 merken €5.586") — dit is hoe je een prijs onderbouwt. 
- Zwak: "Maandelijkse Founder-calls" (`benefits.items.influence.description`) en "Reel Builder, Email Management en ManyChat DM komen eerst naar Founding partners" (`benefits.items.early_access.description`) — Email Management en ManyChat zijn allang live voor iedereen (10 live skills). Verouderde belofte die de oplettende lezer laat twijfelen aan de rest.
- `eyebrows.quickApply`: "Snel starten" + quickApply-flow is goed conversiewerk.

### 2.6 Memory — de benchmark. Zo moet de rest.
Deze pagina doet als enige alles goed: mechanisme (4 lagen met per laag een echte prompt + echt antwoord, `memory.layers.*`), eerlijke grenzen ("Past zich alleen aan als je dat expliciet vraagt", `layers.context.description`), differentiatie met namen (`contrast.*`), en een concreet vergelijkingsgesprek in 3 beurten (`comparison.turns`). Kleine smetten: "Net als bij mensen." (`decay.decayBody`) en "Jij wordt wakker met een slimmere AI Marketing Medewerker dan die je gisteren achterliet" (`decay.dreamBody`) — net over de rand van mooi-schrijverij, maar hier verdiend. Key-hygiëne: `progress.week1Label` bevat "Maand 1" (key zegt week, copy zegt maand).

### 2.7 Apply — goed, op één ding na
Verwachtingsmanagement is sterk ("ja, nee of 'laten we eerst bellen'", `apply.expectations.step1.body`; "Geen automatische e-mails, geen ghosting", `wizard.result.review.subtitle`). Het probleem-veld met voorbeeldpijnen (`form.problemPlaceholder`) is uitstekend. Gat: de pagina vraagt commitment zonder één regel bewijs — geen SKC-cijfer, geen citaat, terwijl de bezoeker hier de laatste twijfel heeft. En "Max 10 plekken per jaar" (`apply.meta.description`) vs "Partnership met Clyde voor bureaus met 5+ merken" — de ICP elders zegt 2-4 merken (Growth) óók welkom; de meta sluit een tier uit.

### 2.8 Assessment — sterk instrument, twee zwakke claims
De 16 vragen zijn de best geschreven interactieve copy van de site (antwoordopties zijn concreet en zelf-diagnostisch, bv. `assessment.questions.q5.options.a`: "Versnipperd over Drive, Notion en hoofden"). Zwak: validatieclaim (#20) en typografie — minstens 8 keys missen een spatie na de komma: "nodig hebben,maar de uitvoer" (`result.archetypes.strategy-led.validationHook`), "indrukwekkend,de campagnes" (`data-led.validationHook`), "tools en te weinig centraal brein" ok maar "automatiseringen,meer dan" (`tooling-led.summary`), "naam,en schalen" (`team-led.validationHook`), "profiel,maar ook" (`balanced.identity`), "basis,elke stap telt dubbel" (`result.stages.emerging.description`), "momentum,consistentie" (`scaling.description`), "schaal,het volgende" (`leading.description`). Dit staat in productie.

### 2.9 Roadmap — eerlijk maar kaal
Correct dat er geen harde data beloofd worden (`roadmap.skills.subtitle`). Maar "De interactieve demo werkt al" (`voiceAgent.description`) zonder link ernaartoe in de copy is een gemiste kans, en de pagina heeft geen enkele reden om terug te komen (geen changelog, geen "recent geleverd"-blok — terwijl er in 2026 aantoonbaar veel geleverd is).

### 2.10 Case study SKC — de rijkste pagina en de slordigste
- Sterk: bron-noten per metric (`outcomes.metrics.*.sourceNote`), conservatieve attributie expliciet ("rauwe meting +42 procent, gecorrigeerd voor product-launch-effect", `reachDelta.detail`), before/after-flow met minuten (`before.*`/`after.*`). Dit is de goede richting.
- Maar: drie tegenstrijdige vaardigheden-tellingen (#6), Buffer/Hootsuite (#7), "4 merken live in 7 dagen" (#6), "Cijfers gemeten over Q1-2026" — twee kwartalen oud zonder hermeting terwijl `outcomes.disclaimer` "periodiek herijkt" belooft.
- "zonder dat het team er omkijken naar heeft" (`hero.subtitle`) — grammaticaal fout ("er … naar omkijken" → "zonder dat het team ernaar om hoeft te kijken") én in tegenspraak met het review-model dat de pagina zelf beschrijft.

### 2.11 De 12 skill-pagina's — één template, twaalf keer, met verzonnen diepte
Elke pagina: zelfde opbouw, zelfde subtitel "Vier kernfuncties van deze vaardigheid." (9x letterlijk), zelfde slot-CTA (10x letterlijk). De hero's zijn goed ("Clyde neemt de telefoon op." is de beste H1-reeks van de site). Drie structurele problemen:
1. **De FAQ's compenseren het gebrek aan screenshots met specificiteit die niet klopt of niet te verifiëren is** (bevinding #5). Patroon-diagnose: waar bewijs hoort (een screenshot van de digest, een echt gerenderd carrousel, een echt rapport), staat nu een verzonnen tech-stack.
2. **Caps in FAQ's die nergens anders bestaan**: "Growth 20 classificaties per maand, Professional 60 (…) Founding 40 acties" (`skills-email-management.faq.items.q3.answer`) — pricing-matrix noemt e-mailcaps niet; `fma-app/src/lib/skills.ts` SKILL_CAPS zegt Growth emailManagement: 20 ✓ maar Founding "40 acties": TE VERIFIEREN. "2 credits per 10 DM's" (`skills-manychat.meta.description`) vs "Kost 2 credits per 10 DM's" (faq q3) consistent, maar tegen skills.ts: TE VERIFIEREN.
3. **Coming-soon-pagina's wisselen tijden**: voice-agent hero gebruikt correct toekomende tijd ("Clyde gaat veelgestelde vragen … beantwoorden", `features.feature1.body`) maar de FAQ beschrijft alles in tegenwoordige tijd alsof het live is ("Clyde handelt inkomende en uitgaande telefoongesprekken af", `faq.items.q1.answer`).

### 2.12 Kennisbank + blog — inhoudelijk in orde, één weeffout
15 NL-posts met nette frontmatter-descriptions. Weeffout: `content/blog/ai-marketing-automation-guide.mdx` is een Engelstalige post uit de oude positionering ("How AI-powered marketing automation transforms B2B growth with chatbots, voice agents, and integrated marketing machines") — oude categorie-taal ("marketing machines") op een verder NL-source-of-truth site. Ook: `blog`-namespace subtitle "Inzichten over AI-marketingautomatisering, chatbots en groeistrategieën voor bureaus" (nl.json regel 1398) voert "chatbots" als categorie — de oude positionering.

---

## 3. De uitlegkloof — genoemd maar nooit uitgelegd

| Concept | Waar genoemd | Wat ontbreekt | Waar het uitgelegd had moeten worden |
|---|---|---|---|
| **Strategielaag (doelen, jaarplanning, pijlers → agenda)** | NERGENS. Grep: 0 treffers als productfunctie. `about.mission.text` zegt zelfs expliciet dat strategie bij het bureau blijft. | Het bestaan zelf. Het product bouwt per merk doelen, een jaarverhaal en contentpijlers die de agenda voeden — dat is precies het "geen tool maar medewerker"-bewijs dat de site mist. | Eigen sectie op home (na memoryUsp), stap 3 van how-it-works, en een eigen kennisbank-pillar. |
| **Onboarding (11-stappen flow in de app)** | "4 weken partnership-setup" (`how-it-works.process.steps.onboarding`), "Brand-scan" (`home.processTimeline.weeks.1.body`) | De stappen zelf: wat vult de klant in, wat leest de brand-scan, wat komt eruit (pijlers, templates, merkstem-profiel). Nu klinkt het als 4 weken consultancy i.p.v. een productflow. | how-it-works, als kern van de pagina; met screenshots per stap. |
| **Clyde in WhatsApp** | Alleen `skills-clyde.faq.items.q1/q2` — en `skills-manychat.faq.q2` spreekt het tegen ("roadmap Q3") | Eén scenario: "App 's ochtends 'wat staat er vandaag live?' en krijg de agenda terug." Kanaal-canon vaststellen (WhatsApp ja; Telegram/e-mail TE VERIFIEREN). | skills-clyde hero + home services.clyde-kaart. |
| **Credit** | `pricing.*` overal, alle skill-meta's | Definitie + rekenvoorbeeld ("800 credits ≈ 30 posts + 4 blogs + 2 rapporten per maand" — cijfers TE VERIFIEREN tegen skills.ts) | pricing, direct onder de slider; glossary-entry. |
| **Werkruimte** | `apply.form.workspacesHelp` ("Eén werkruimte per merk") | Definitie op de plek waar het prijsmodel geïntroduceerd wordt + wat er ín een werkruimte zit (geheugen, kanalen, goedkeuring) | pricing.hero of tiers-intro; glossary-entry. |
| **Merkstem leren** | "Brand-voice tuning (…) Maximaal drie iteraties per merk" (`home.processTimeline.weeks.3`), "geleerd van eerdere goedgekeurde content" (`skills-social-media.features.feature1.body`) | Welke input (bestaande posts? interview? de brand-scan?), wat een "iteratie" is, wat "gelocked" betekent, en hoe correcties daarna doorwerken | /memory (heeft de lagen maar niet het leerproces) + how-it-works week 3. |
| **Goedkeuring/review** | "goedkeurings-queue" (`how-it-works.steps.production.deliverable2`), "Clyde-inbox" (`case_studies.skc.after.step4.body`), "30 sec per post" | Hoe batch-review eruitziet, wat je ziet per post, wat er gebeurt bij afkeuren (leert het geheugen daarvan? — ja, maar dat staat alleen terloops in de case study) | how-it-works stap 4 + screenshot; dit is ook het antwoord op het aansprakelijkheidsbezwaar. |
| **Platform-integraties (breedte)** | Versnipperd per skill-FAQ, deels verzonnen (#5) | Eén eerlijke integratiepagina/sectie: wat is native gekoppeld vandaag, wat via export, wat op de roadmap | pricing of how-it-works; footer-link. |
| **Wat de eindklant van het bureau ziet** | "White-label optie" (`pricing.tiers.enterprise.features_3`) | Of er zonder white-label ergens "Clyde/FMai" zichtbaar is voor eindklanten — cruciaal bureaubezwaar | pricing-FAQ. |
| **"AVG-compliant / EU AI Act ready"** | `home.hero.trustCluster.avgLabel`, `home.pillars.compliance` | Waar de verwerkersovereenkomst is, welke subverwerkers, wat "audit-trail per actie" concreet betekent | /memory isolatie-sectie uitbouwen of aparte trust-pagina; nu alleen losse badges. |

---

## 4. Getallen-consistentietabel

| Claim | Plek | Bronwaarde (SSoT) | Klopt? |
|---|---|---|---|
| "belt leads" (live) | `home.meta.description` | Voice Agent `coming_soon` in `src/lib/skills-data.ts`; `roadmap.voiceAgent.phase` "In testing" | **NEE** |
| "Max 10 partners per jaar" | `home.meta.description`, `home.faq.q3` ({maxPartners}) | `constants.ts` `MAX_PARTNERS_PER_YEAR = 10` | JA (maar zie llms.txt-rij) |
| "Max 20 new partnerships per year" | `public/llms.txt` regels 3, 7, 21 + `llms-full.txt` regels 3, 9, 302 (6 plekken, zelf geverifieerd) | `constants.ts` = 10; nl.json "Max 10 partners per jaar" | **NEE — llms.txt spreekt de site tegen in het bestand dat juist voor AI-engines is geschreven** |
| "12 skills (9 live, 3 coming soon)" | `public/llms.txt:3` + `llms-full.txt:3` | `skills-data.ts`: 10 live, 2 coming_soon; site overal "10 live, 2 binnenkort" | **NEE — stale** |
| "Daley reviews personally within 48 hours" | `public/llms.txt:7` + `llms-full.txt:9` | Site overal "binnen 3 werkdagen" / "72 uur" (`apply.hero.subtitle`, `apply.expectations.step1.body`) | **NEE — 48u vs 72u** |
| Voice-meta: "5 credits per minuut" + tegenwoordige tijd | `skills-voice-agent.meta.description` | Voice = coming_soon | **NEE — zie bevinding #4b** |
| Reel-meta: "25 credits per Reel" zonder coming-soon | `skills-reel-builder.meta.description` | Reel Builder = coming_soon | **NEE — zie bevinding #4c** |
| "MAX_PARTNERS_PER_YEAR // 20" | `fmai-nextjs/CLAUDE.md` Shared Constants | `constants.ts` = 10 | **NEE (stale doc)** |
| Founding €997, onbeperkt werkruimtes, 8.000 credits, €0 onboarding | `pricing.tiers.founding.*`, `founding-member.*` | `pricing-data.ts`: 997 / 8000 / fee 0 | JA |
| "Founding €997 per werkruimte" | `pricing.meta.title` | Founding is `pricingModel: 'fixed'` | **NEE** |
| Growth €499/ws, 800 credits/ws, onboarding €1.997 | `pricing.tiers.growth.*`, `founding-member.benefits.onboarding` ("€1.997 en €5.997") | `pricing-data.ts`: 499/800/1997; Ent fee 5997 | JA |
| "Growth start bij €998 per maand voor 2 werkruimtes" | `founding-member.pricing.comparison` | 2 × €499 = €998 | JA |
| "bij 5 merken op Professional €1.995, bij 14 €5.586" | `founding-member.value.line2` | 5×399=1995; 14×399=5586 | JA |
| 36 posts/week = 21 carrousels + 15 posts | `home.stats.hero`, `home.caseStudyCard.metric3*`, `case_studies.skc.outcomes.metrics.outputVolume` | intern consistent | JA (bron: Sindy/scheduler-export, extern TE VERIFIEREN) |
| Aantal actieve SKC-vaardigheden: 10 vs 9 vs 6 | `case_studies.skc.skills.subtitle` / `skills.skill6Body` / `chapter2.intro` | 10 live skills (skills-data) | **NEE — 3 waarden op één pagina** |
| "4 merken live in 7 dagen" | `case_studies.skc.hero.chip2` | Onboarding elders overal 4 weken | **TEGENSTRIJDIG / TE VERIFIEREN** |
| Data-export "binnen 24 uur" | `home.faq.q2`, `home.pillars.infrastructure.stat`, `about.infra.noLockIn.body`, `memory.isolation.body2` | — | — |
| Data-export "binnen 14 dagen" | `pricing.faq.items.q8.answer` | — | **TEGENSPRAAK met 24u-claims** |
| Retentie na opzegging: "30 dagen voor volledige export" | `home.faq.q2` | vs `pricing.faq.q8`: "binnen 30 dagen verwijderd" | net verenigbaar, maar formuleer één regel |
| Blog Factory: Growth 8 / Pro 20 / Founding 12 per maand | `pricing.tiers.*.features_3`, `skills-blog-factory.faq.q3` | `fma-app skills.ts` SKILL_CAPS: growth blogFactory 8, professional 20 ✓ | JA (Founding 12: TE VERIFIEREN in SKILL_CAPS founding-blok) |
| Voice: Growth 30 min / Pro 120 / Founding 60 | `pricing.tiers.*`, `skills-voice-agent.faq.q3`, `founding-member.faq.q3` | skills.ts: growth voiceAgentMinutes 30 ✓ | JA (Pro/Founding: TE VERIFIEREN) |
| ManyChat: Growth 200 / Pro 1.000 / Founding 500 DM's | `skills-manychat.faq.q3`, `pricing.tiers.founding.features_7` | skills.ts: growth manychatDm 200 ✓ | JA (rest TE VERIFIEREN) |
| Email: Growth 20 / Pro 60 / Founding 40 | `skills-email-management.faq.q3` | skills.ts: growth 20 ✓, professional 60 ✓ | JA (Founding 40: TE VERIFIEREN; staat nérgens op pricing) |
| Reels: Growth 4 / Pro 15 / Founding 8 | `skills-reel-builder.faq.q3`, `pricing.tiers.*` | skills.ts: growth reelBuilder 4 ✓ | JA (rest TE VERIFIEREN) |
| "50.000+ vragen per maand" | `chatbots.multi_platform.stats.inquiries` (rendert op /skills/lead-qualifier) | geen enkele bron; 1 klant | **NEE — schrappen** |
| "1/10 founding plekken bezet" overal | `{taken}/{total}` interpolatie | `constants.ts` 1/10 | JA |
| Voice-provider: VAPI | `skills-voice-agent.how.step2.body`, `roadmap.voiceAgent.description` | vs `skills-voice-agent.faq.q2`: "ElevenLabs + Twilio of Telnyx" | **TEGENSPRAAK op één pagina** |
| Email-provider: "uitsluitend Gmail, Outlook roadmap Q3" | `skills-email-management.faq.q2` | `fma-app skills.ts`: "Gmail + Outlook (Microsoft 365) OAuth integratie" live | **NEE — product is verder** |
| Onboarding totaal: 4 weken | `home.processTimeline`, `pricing.faq.q5` | vs `how-it-works` productie "vanaf week 5"; per-skill FAQ's 1-5 weken elk | **TEGENSTRIJDIG** |
| Engagement 3,1% → 4,3%; +30% reach; 30 sec/post; 5 uur/week | `case_studies.skc.outcomes.metrics.*` | bron-noten aanwezig (Sindy-meting, IG Insights) | JA als claim-met-bron; herijking Q1-2026 is 2 kwartalen oud |

---

## 5. Narratief — één rode draad, drie breuken

**De rode draad bestaat**: medewerker-niet-tool → geheugen als bewijs → schaarse toegang via gesprek. Home draagt hem goed (hero → skills → ICP → bewijs → founder → onboarding → vergelijking → geheugen → prijs → FAQ). De volgorde op home is logisch, al is 15+ secties te veel: tussen caseStudyCard (sectie 5) en testimonial (sectie 10) zit dezelfde Sindy twee keer, en pricingTeaser + pillars + kennisbank + cta + faq stapelen vier keer "plan een gesprek".

**Breuk 1 — het scharnier ontbreekt.** De bezoeker die na home "ja, maar hoe dan?" denkt klikt naar how-it-works en vindt dáár minder mechanisme dan op home zelf (§2.3). Daar valt de sceptische koper — de hele ICP — uit.

**Breuk 2 — skill-pagina's zijn 12 losse verhalen.** Zelfde template, zelfde zinnen, en de onderlinge samenhang ("wat Clyde leert bij social gebruikt hij bij ads") staat alleen als integratie-bulletjes. De site claimt "één brein" maar de informatiearchitectuur is 12 silo's. Eén "een week uit het leven van een merk"-pagina (maandag research-brief → dinsdag carrousels klaar → vrijdag review → maandag digest) zou de orkestratie tonen die nu alleen beweerd wordt.

**Breuk 3 — de case study ondermijnt het slot.** Wie het hele verhaal gelooft en op de bewijspagina landt, vindt daar tegenstrijdige tellingen, een Buffer-bron die elders concurrent heet, en een "thumbnails volgen later"-excuus. Precies op het moment van maximale koopintentie is de kwaliteitscontrole het laagst.

---

## 6. Taalkwaliteit NL — glossary-schendingen, anglicismen, fouten

Canon uit `fmai-nextjs/CLAUDE.md`: nooit "AI tool/platform" → "AI Marketing Medewerker/Clyde"; nooit "features" → "vaardigheden"; nooit "klanten" (voor eindklanten van bureaus) → "merken/klantportfolio"; nooit "Sign up/Try free" → "Plan een gesprek/Apply".

| Bestand + key | Fout | Voorstel |
|---|---|---|
| `messages/nl.json` → `header.cta.applyTitle` | "Apply" als knoplabel in NL-UI | "Plan een gesprek" (glossary staat "Apply" toe, maar de NL-header is de enige plek waar het kaal Engels rendert; subtitle zegt al "Plan een gesprek" — draai om) |
| `header.skills.grow.items.clyde.title` | "Clyde AI Employee" — Engels in NL-navigatie | "Clyde AI Marketing Medewerker" |
| `common.landing.footer.nav.content_creator` | "Content Creator" — skill die niet bestaat in het 12-skills-model (legacy footerlink) | Verwijderen of hernoemen naar bestaande vaardigheid |
| `home.stats.skills.linkText` | "Alle skills" | "Alle vaardigheden" |
| `case_studies.skc.skills.subtitle` | "alle 10 live skills" | "alle 10 live vaardigheden" |
| `leadMagnet.preview.skillsHeading` | "AI-skills voor jouw profiel" | "AI-vaardigheden voor jouw profiel" |
| `chatbots.cta.button` + `chatbots.hero.cta_secondary` | "Vraag een gratis strategiesessie aan" — CTA-canon is "Plan een gesprek"; "gratis" ondermijnt premium-frame | "Plan een gesprek" |
| `chatbots.sections.pricing_heading` + `pricing_subtitle` | "Chatbot-pakketten" / "Instapprijzen. Eén abonnement, volledige AI-stack." — oud pricing-model | Sectie schrappen uit actieve componenten |
| `chatbots.demo.tabs.ecommerce.scenario` | "Nieuwe klant onboarden" — "klant" waar "merk" bedoeld is | "Nieuw merk onboarden" |
| `contact.meta.title` | "AI Marketing Bureau" — positioneringsbreuk | "Contact — FutureMarketingAI, de AI Marketing Medewerker voor bureaus" |
| `about.journey.milestones.founding.body` | "ge-announced" | "aangekondigd" |
| `home.pricingTeaser.title` + `founding-member.hero.description` | "gelockt" | "vastgezet" of "vast, levenslang" |
| `pricing.tiers.eyebrow`-blok `tiers.subtitle` | "Founding blijft anker op €997" — financieel jargon | "Founding blijft €997, wat er ook herijkt wordt" |
| `case_studies.skc.hero.subtitle` | "zonder dat het team er omkijken naar heeft" — grammaticaal fout | "zonder dat het team ernaar om hoeft te kijken" |
| `home.icp.notFit1` | "Je jaaromzet onder €300K zit." — bijzin zonder hoofdzin | "Je jaaromzet zit onder €300K." (idem `notFit4`, `about.icp.notFit1/4`) |
| `assessment.result.archetypes.*` + `result.stages.*` (8 keys, zie §2.8) | ontbrekende spatie na komma ("hebben,maar") | spaties herstellen — dit staat zichtbaar in productie |
| `skills-voice-agent.features.*` | "Clyde gaat … beantwoorden/registreren/draaien" — stroef toekomstpatroon 5x herhaald | één keer "Binnenkort:" markeren, dan gewone tegenwoordige tijd |
| `skills-seo-geo.useCases.useCase2.body` | "GEO is de nieuwe SEO." — AI-slop-frase | "Wie nu meetbaar wordt in AI-antwoorden, is dat straks als eerste in zijn niche." (of schrappen; de zin erna is al goed) |
| `about.timeline.key_message.*` | "voorsprong die laatkomers niet meer inlopen" — niet onderbouwde futurologie | Vervangen door gemeten SKC-leereffect (goedkeuringstijd 4 min → 30 sec in 3 maanden) als bewijs van "compounding" |
| `memory.progress.week1Label`/`week12Label` | keys zeggen week, copy zegt maand | keys hernoemen bij volgende refactor (geen user-facing fout) |
| `common.footer.copyright` + `chatbots.meta.title` | "Future Marketing AI" met spaties vs "FutureMarketingAI" elders | Overal "FutureMarketingAI" |
| `skills-research.faq.q4` + `skills-reporting.faq.q4` | "baseert Clyde een baseline-trendprofiel" / "baseert Clyde KPI-baseline" — "baseren" verkeerd gebruikt | "bouwt Clyde een baseline-trendprofiel op" / "stelt Clyde de KPI-baseline vast" |
| `home.hero.subtitle` | "Tien vaardigheden vandaag, twee binnenkort: social, blogs, ads, e-mail, leadkwalificatie, SEO, analytics" — opsomming van 7 bij het getal 10 | zie herschrijfblok 1 |
| `blog`-namespace subtitle (nl.json:1398) | "chatbots en groeistrategieën" — oude categorietaal | "AI-marketingautomatisering, GEO en bureau-operaties" |

---

## 7. Herschrijfvoorstellen — 10 blokken

Merkstemregels afgeleid uit de beste bestaande copy (memory-pagina, ICP-sectie): korte zinnen, feiten met naam en getal, eerlijke grenzen expliciet, geen uitroeptekens, geen superlatief zonder bron.

### Blok 1 — Hero home (`home.hero`)
**Huidig** (`headlineMain`/`tagline`/`subtitle`/`trustAnchor`):
> "Dit is Clyde. / Jouw AI marketing medewerker. / Onthoudt elk merk. Tien vaardigheden vandaag, twee binnenkort: social, blogs, ads, e-mail, leadkwalificatie, SEO, analytics. Autonoom uitgevoerd, met geheugen dat campagnes overleeft. / Live in productie sinds 2025. Maximaal 10 partners per jaar."

**Voorstel**:
> "Dit is Clyde. / Jouw AI marketing medewerker. / Clyde publiceert elke week 36 posts voor drie Instagram-accounts van SkinClarity Club — in drie verschillende merkstemmen, met een jaarplan per merk als kompas. Jij keurt goed, Clyde voert uit en onthoudt elke correctie. / Live sinds 2025. Eén founding-klant, negen plekken open."

Waarom: het sterkste gemeten feit (36/week, 3 stemmen) staat nu drie secties te laag; "geheugen dat campagnes overleeft" vervangen door wat het geheugen dóét; strategielaag (jaarplan) voor het eerst benoemd; "TE VERIFIEREN": formulering "jaarplan per merk als kompas" pas live zetten als de strategielaag extern getoond mag worden.

### Blok 2 — Hero pricing (`pricing.hero` + nieuw credit-blok)
**Huidig** (`title`/`description`):
> "Premium partnerships. Founding €997 levenslang. / Alle prijzen staan zichtbaar. Founding €997 levenslang voor de eerste 10 bureaus. Daarna een lineair tarief per werkruimte: Growth €499, Professional €399, Enterprise €299. Caps per vaardigheid eerlijk uitgelegd, geen verborgen kosten, geen 'neem contact op voor prijs'."

**Voorstel**:
> "Eén prijs per merk. Founding €997 voor alles, levenslang. / Elke klant van jouw bureau krijgt een eigen werkruimte: eigen geheugen, eigen merkstem, eigen goedkeuringsflow. Je betaalt per werkruimte — Growth €499, Professional €399, Enterprise €299 — en elke werkruimte bevat 800 credits per maand: genoeg voor ongeveer [X posts, Y blogs en Z rapporten — TE VERIFIEREN tegen skills.ts]. De eerste 10 bureaus betalen €997 voor onbeperkt werkruimtes, levenslang. Geen verborgen kosten, geen 'neem contact op voor prijs'."

Plus meta-title fix: "Prijzen: per werkruimte, Founding €997 levenslang | FutureMarketingAI".

### Blok 3 — Hero how-it-works (`how-it-works.hero`)
**Huidig** (`title`/`description`):
> "Hoe begint jouw partnership met Clyde? / Vijf stappen van eerste gesprek tot autonoom draaien. Geen zelfbediening. Daley begeleidt elke klant persoonlijk door het traject."

**Voorstel**:
> "Van kennismaking naar autonome contentmotor in vier weken. / Geen zelfbediening: je doorloopt met Daley een onboarding van elf stappen in de app — van brand-scan (kleuren, fonts, tone, USP's per merk) via contentpijlers en een jaarplan naar je eerste goedgekeurde contentweek. Hieronder staat per week wat er gebeurt, wat het jou aan tijd kost en wat er aan het eind van die week live staat."

Waarom: noemt voor het eerst het echte artefact (11 stappen, brand-scan, jaarplan) en belooft de uren-transparantie die home al waarmaakt en deze pagina niet. Vereist dat de 4-weken/5-stappen-tegenspraak (bevinding #15) tegelijk wordt opgelost — kies "vier weken" als frame, stappen als inhoud.

### Blok 4 — Case-study opening (`case_studies.skc.hero`)
**Huidig** (`title`/`chip1-3`/`subtitle`):
> "3 accounts. 4 merken. Eén AI Marketing Medewerker. / 3 accounts onboarded / 4 merken live in 7 dagen / 10 vaardigheden actief / SkinClarity Club is vanaf de eerste week Founding klant. Clyde beheert 3 Instagram-accounts, 4 merken en meerdere contentsoorten. Autonoom, elke dag, zonder dat het team er omkijken naar heeft."

**Voorstel**:
> "3 accounts. 4 merken. 36 posts per week. / Sinds Q4 2025 zonder onderbreking / Goedkeuren: van 4 minuten naar 30 seconden per post / 10 vaardigheden actief / SkinClarity Club runt vier huidmerken op drie Instagram-accounts. Sindy keurt op vrijdag de batch goed; Clyde doet de rest — research, carrousels, captions, inplannen, publiceren. Hieronder staat per stap hoe dat werkt, met de meetmethode bij elk cijfer."

Waarom: "7 dagen"-chip vervangen door twee cijfers die de pagina wél onderbouwt; "zonder dat het team er omkijken naar heeft" (grammaticaal fout + onwaar: er ís review) vervangen door het eerlijke, sterkere reviewmodel. Vereist tegelijk: de 10/9/6-tellingen gelijktrekken naar 10 en Buffer/Hootsuite vervangen door de echte pipeline-naam (TE VERIFIEREN wat extern mag).

### Blok 5 — Apply (`apply.hero`)
**Huidig** (`title`/`subtitle`):
> "Plan een gesprek / Geen zelfbediening. Geen generieke aanmelding. We beoordelen elke aanvraag persoonlijk en antwoorden binnen 3 werkdagen. Ook als het geen match is."

**Voorstel**:
> "Plan een gesprek met Daley / Vertel in vijf velden hoe jouw portfolio eruitziet. Daley leest elke aanvraag zelf en antwoordt binnen 3 werkdagen — ja, nee, of 'laten we eerst bellen'. Ter referentie: onze eerste partner keurt 36 posts per week goed in een half uur. Dat gesprek gaat over of dat ook voor jouw merken kan."

Waarom: enige pagina zonder bewijs krijgt één bewijszin; de sterke "ja/nee/bellen"-formulering die nu in `expectations.step1.body` verstopt zit komt naar boven.

### Blok 6 — skills/voice-agent hero (`skills-voice-agent.hero.subtitle` + FAQ-sanering)
**Huidig**:
> "Inkomende gesprekken worden beantwoord, veelgestelde vragen afgehandeld, afspraken geboekt. Uitgaande campagnes draaien zonder dat je team hoeft te bellen. Escalatie naar een mens wanneer het gesprek daarom vraagt. Binnenkort beschikbaar."

**Voorstel**:
> "In testing, nog niet live. De interactieve demo hieronder werkt al: voer zelf een gesprek met Clyde. In productie gaat Clyde straks inkomende gesprekken beantwoorden, afspraken boeken en escaleren naar een mens zodra het gesprek daarom vraagt. Founding-partners draaien als eerste mee in de pilot."

En: FAQ q2 ("ElevenLabs + Twilio of Telnyx") verwijderen of gelijktrekken met VAPI (TE VERIFIEREN welke stack de pilot echt draait) — één waarheid per pagina.

### Blok 7 — skills/reel-builder hero (`skills-reel-builder.hero.subtitle` + FAQ q2)
**Huidig**:
> "Korte verticale video's (9:16) met AI-scripts, automatische captions die synchroon lopen en achtergrondmuziek. Voor Instagram Reels, TikTok en YouTube Shorts. Binnenkort beschikbaar."
plus FAQ q2: "Onder de motorkap: Runway en Pika voor scene-creatie, ElevenLabs voor voice-overs, FFMPEG voor compositie."

**Voorstel** (hero):
> "In ontwikkeling. Clyde gaat korte verticale video's (9:16) maken: script in de merkstem, captions die synchroon meelopen, muziek eronder. De template-bibliotheek wordt nu gebouwd op dezelfde render-pipeline die de carrousels van SkinClarity Club maakt. Founding-partners testen de eerste versies."

FAQ q2 vervangen door: "Reel Builder draait op onze eigen render-pipeline [TE VERIFIEREN: Remotion-gebaseerd] — dezelfde infrastructuur die wekelijks de SKC-carrousels rendert. Zodra de vaardigheid live gaat publiceren we hier de ondersteunde outputformaten." Geen verzonnen vendors.

### Blok 8 — skills/email-management (`skills-email-management.hero.subtitle` + FAQ q2)
**Huidig** (hero):
> "Geen mailcampagnes: dit is inbox-classificatie. Clyde leest inkomende mails, plaatst slimme labels (urgent, actie, info), bepaalt prioriteit en stuurt een dagelijkse digest. Je begint je dag met overzicht in plaats van chaos."
FAQ q2: "Op dit moment uitsluitend Gmail (…) Outlook en custom IMAP staan op de roadmap voor Q3."

**Voorstel** (hero, na verificatie tegen skills.ts dat Outlook live is):
> "Geen mailcampagnes: dit is je inbox, opgeruimd. Clyde koppelt via OAuth aan Gmail óf Outlook, classificeert elk bericht (lead, urgent, factuur, nieuwsbrief, intern), zet nette labels in je eigen mailbox en legt conceptantwoorden in de merkstem klaar. Elke ochtend één digest: de drie dingen die vandaag aandacht nodig hebben."

FAQ q2: "Gmail (Google Workspace en gratis accounts) en Outlook (Microsoft 365), beide via OAuth. Labels en mappen worden in je eigen mailbox aangemaakt — zeg je op, dan blijft je indeling staan. [Custom IMAP: TE VERIFIEREN.]"

### Blok 9 — skills/manychat (`skills-manychat.hero.subtitle`)
**Huidig**:
> "Keywordtriggers ('INFO', 'PRIJS') starten AI-flows die kwalificeren, informatie delen en warme leads naar het CRM sturen. Geen gemiste DM."

**Voorstel** (na besluit of de productnaam "Social Command Center" al extern mag — TE VERIFIEREN):
> "Elke Instagram-DM beantwoord, dag en nacht, in de stem van het merk. Een volger stuurt 'PRIJS' onder je Reel; Clyde antwoordt binnen seconden, stelt twee kwalificatievragen en zet de warme lead met gespreksverslag in je CRM. Jij ziet alle gesprekken terug in één inbox per merk."

Waarom: van feature-opsomming naar één concreet scenario met afloop; de unified inbox (die het product al heeft) als zichtbaar voordeel.

### Blok 10 — skills/lead-qualifier (`skills-lead-qualifier.hero.subtitle` + chatbots-sanering)
**Huidig**:
> "Een insluitbare AI-chatbot op de website van elk merk. Voert het kwalificatiegesprek, scoort de intentie en routeert warme leads naar het CRM of sales. Geen lead gaat verloren door gemiste chats."

**Voorstel**:
> "Een chatwidget op de site van elk merk — één regel code. Clyde stelt de vragen die jouw sales anders in het eerste kwartier stelt (budget, tijdlijn, probleem, beslisser), geeft de lead een score en zet alles boven jouw drempel direct door naar het CRM, met gespreksverslag. Probeer de demo hieronder zelf."

Plus verplichte sanering op dezelfde pagina: `chatbots.multi_platform.stats` ("50.000+ vragen per maand"), `brain_label` ("Claude AI") en `chatbots.cta.button` ("gratis strategiesessie") uit de gerenderde componenten halen of vervangen door SKC-echte cijfers.

---

## 8. Dekkingsrapport

Gecheckte lagen: `messages/nl.json` volledig (alle 41 namespaces gedumpt en gelezen); alle route-directories onder `src/app/[locale]/`; `src/lib/constants.ts`, `src/lib/pricing-data.ts`, `src/lib/skills-data.ts` (statussen zelf geverifieerd: 10× live, 2× coming_soon); `public/llms.txt` + `llms-full.txt` (partner-cap, skill-telling en reactietermijn zelf geverifieerd — alle drie stale); meta-description-sweep over alle namespaces op coming_soon-claims (3 treffers, zie bevinding #4); `fma-app/src/lib/skills.ts` (greps op skill-beschrijvingen + SKILL_CAPS growth-blok; founding/professional-blok niet regel-voor-regel — gemarkeerd TE VERIFIEREN in §4); `public/` asset-lijst; `content/blog/` frontmatter; component-tracing voor `chatbots.*` (MultiPlatformShowcase/DemoPlayground → lead-qualifier). Buiten scope: EN/ES-locales (NL is source of truth), legal-namespace inhoudelijk. Conclusies over productfeiten (strategielaag, 11 stappen, WhatsApp) steunen op de door Daley aangeleverde context plus `fma-app/src/lib/skills.ts`-greps.
