# Design- en UX-audit — future-marketing.ai (live productie)
Datum: 2026-09-01 · Auditor: design-audit agent · Basis: live screenshots, desktop 1440x900 + mobiel 390x844

STATUS: COMPLEET — alle 18 paginas bekeken (desktop + mobiel), bevindingen definitief.
Omvang: 18 paginas, 72 screenshots + leesbare slices; per-pagina oordeel, consistentietabel, platformlogo-voorstel, 20 geprioriteerde bevindingen, sectievoorstellen home + how-it-works.

## Vaststaande context
- Designsysteem (fmai-nextjs/CLAUDE.md): dark-only `#0a0d14` bg, teal `#00d4aa`, amber `#f5a623`, DM Sans / Space Grotesk / JetBrains Mono. Desktop-first, mobiel supplementair met aparte componenten. Deprecated: `#050814`, `#0A0E27`, `#00D4FF`, paars.
- `public/screenshots/` is leeg op een .gitkeep na. De hele site draait op 3 afbeeldingen: twee portretfoto's en één robot-preview. Verder alleen tekst, iconen, gradients en een Spline 3D-robot in de hero.
- Kennisbank heeft 14 artikelen; als voorbeeldartikel is `/nl/kennisbank/wat-is-een-ai-marketing-medewerker` geschoten.
- Verkeer is minimaal (246 zoekimpressies/3mnd): dit is een overtuigingsaudit, geen volume-CRO.


---
## Per-pagina beoordeling

### 1. Homepage `/nl`
Bewijs: `home--desktop-fold.png`, `home--mobile-fold.png`, `home--desktop-full.png` (14.512px), `home--mobile-full.png` (25.973 CSS-px!), slices `home--desktop-s00..s07`, `home--mobile-s01/s04/s09/s11/s14/s17`.

**Eerste indruk (desktop-fold):** Sterk. "Dit is Clyde. / Jouw AI marketing medewerker." + founding-counter + trustrow is binnen 5 sec duidelijk (wat, voor wie half — "bureaus" staat alleen in een mini-badge). MAAR: de primaire CTA "Plan een gesprek" wordt boven de vouw half afgesneden door de cookiebanner (home--desktop-fold.png, knop onderaan half zichtbaar). De hero-alinea is een opsomming-in-proza van 4 regels ("social, blogs, ads, e-mail, leadkwalificatie, SEO, analytics") — leest als een tag-dump. "1 van 10 founding plekken" staat TWEE keer in dezelfde viewport (eyebrow-counter én trustrow). Zwevende "NL"-chip linksboven hangt los in de hero — oogt als een vergeten debug-element.

**Eerste indruk (mobile-fold):** Zwak. Geen robot, geen CTA, geen scanknop boven de vouw — alleen kop + bodytekst, en de cookiebanner eet 40% van het scherm. De Clyde-chat-FAB overlapt de lopende bodytekst midden in de alinea (home--mobile-fold.png: FAB over "Maximaal 10 partners..."). NL-chip weer als zwevend blok.

**Visuele hiërarchie:** Desktop goed geritmeerd: hero → AI-scan-kaart → case-teaser → skills → geheugen → vergelijking → onboarding → founder → testimonial → cijfers → pricing → pijlers → voor-wie → kennisbank → FAQ → eind-CTA. Elke sectie heeft één focuspunt. Wel: 16+ secties is lang; de funnel-CTA wisselt tussen "Plan een gesprek", "Leer Clyde kennen", "Word founding partner", "Start de scan" — vier werkwoorden voor drie bestemmingen.

**Het schermloze probleem — hier het scherpst:**
1. `home--desktop-s01`: de "Clyde AI Marketing Medewerker"-hoofdkaart bevat een chatmock "VRAAG BIJVOORBEELD: JIJ / CLYDE" die LEEG is — een cursor, geen vraag, geen antwoord. Het enige productvenster op de pagina is een dode doos.
2. `home--desktop-s02` + `home--mobile-s09`: sectie "Zelfde prompt, twee uitkomsten" — de ANDERE AI-kaart toont "● ● ●" en de CLYDE-kaart toont als RESPONSE alleen `...`. De kern-USP (Clyde's merkbewuste antwoord) wordt nergens getoond. De rode conclusieregel staat er, het bewijs niet. Dit is de plek waar een echte schermopname of uitgeschreven response het verhaal zou dragen.
3. `home--mobile-s04`: skill-kaarten op mobiel hebben ~500-900px LEGE ruimte per kaart (kop + 2 regels, dan een gapend gat, pijltje onderaan). Oogt als gereserveerde beeldruimte zonder beeld. Dit blaast de mobiele pagina op tot ~26.000px.
4. `home--desktop-s04`: "36 per week"-bewijsblok is alleen cijfers. Eén screenshot van de daadwerkelijke IG-grid van SkinClarity (3 accounts) ernaast zou het bewijs tastbaar maken.

**Mobiel breekt:** `home--mobile-s11`: de vergelijkingstabel wordt rechts AFGEKAPT — kolom DIY-stack halfleesbaar ("Handmatig per m...", "US-cloud verzond..."), kolommen Traditioneel bureau en CLYDE staan volledig buiten beeld. De payoff-kolom (Clyde) is op mobiel onzichtbaar; geen zichtbare scroll-affordance. RESULTAAT-rij toont alleen het DIY-resultaat.

**Spline-robot:** mooi belicht, integreert goed in het donkere palet (home--desktop-s00). Maar het is een generieke humanoïde zonder relatie met marketing, content of software; hij toont niets van het product en duwt op mobiel niet eens mee (daar ontbreekt hij). Oordeel: VERVANGEN door een productvenster (zie sectievoorstel) of degraderen tot klein accent; als hij blijft: statisch poster-frame op mobiel en lazy-load.

**Toegankelijkheid/contrast:** bodytekst `#9ba3b5` op donker oogt overal net-aan maar leesbaar; mono-labels in muted kleur op 11-12px (ZELFDE PROMPT..., NA DE FOUNDING-FASE) zijn krap. Cookiebanner: "Alles accepteren" teal vs "Alles weigeren" donker — kleurhiërarchie stuurt richting accepteren, prima juridisch maar de banner verbergt de hero-CTA.

---
### 2. `/nl/how-it-works`
Bewijs: `how-it-works--desktop-fold.png`, `slices/how-it-works--desktop-s00/s01.png`, `how-it-works--mobile-fold.png`, `slices/how-it-works--mobile-s02.png`. Pagina is kort: 3.469px desktop.

**Eerste indruk:** Helder. Kop "Hoe begint jouw partnership met Clyde?" + "Vijf stappen..." + CTA — binnen 5 sec duidelijk. Mobiel: Clyde-FAB overlapt de subtiteltekst ("Geen zelfbediening. Daley bege..." verdwijnt achter de FAB, `how-it-works--mobile-fold.png`); cookiebanner eet weer de halve viewport.

**Uitlegbaarheid:** Dit is de beste "structuur"-pagina van de site: genummerde 5-stappen-tijdlijn met per stap week-aanduiding en chips (AANMELDFORMULIER / 3 WERKDAGEN REACTIE / 30-MIN VIDEO-CALL), plus onderaan het ENIGE echte diagram van de site: de cyclus Productie → Goedkeuring → Geheugen → Verbetering (`how-it-works--desktop-s01.png`). Maar de pagina beantwoordt alleen "hoe BEGINT het", niet "hoe WERKT het": er is geen systeemplaat (merk → brand-scan → Clyde → 12 vaardigheden → kanalen → goedkeuring → publicatie) en geen enkel scherm van wat de klant straks ziet.

**Schermloos, concreet:** stap 3 noemt "een werkruimte met merkrichtlijnen, doelgroep, tone of voice" — screenshot van die werkruimte hoort hier. Stap 4 noemt "de goedkeuringslijst" — HET moment voor een screenshot van de review-queue met een concept-post en Goedkeuren/Afwijzen-knoppen, bijschrift "Jij keurt elke post, Clyde publiceert". Stap 5 noemt "wekelijkse prestatie-digest" — screenshot van dat wekelijkse rapport (mail of dashboard). De cyclus-plaat onderaan is goed maar klein; de mono-caption eronder herhaalt exact dezelfde vier woorden (dubbel, kan weg).

**Hiërarchie/consistentie:** consistent met home (zelfde nav, kaartstijl, chips). Stap-2-kaart heeft een teal rand en stap-5 een amber rand — betekenis onduidelijk (waarom is stap 2 gemarkeerd?). Verticale tijdlijn-as verspringt van teal naar amber zonder legenda.

---
### 3. `/nl/pricing`
Bewijs: `slices/pricing--desktop-s00/s01.png`, `slices/pricing--mobile-s02/s05.png`.

**Eerste indruk:** Goed. "Premium partnerships. Founding €997 levenslang." + anti-"neem contact op"-belofte is direct duidelijk. MAAR de schaarste-badge zegt "Stand van 24 april 2026 · Cohort start 1 juni 2026" — het is vandaag 1 september: de cohortdatum is VERSTREKEN en de teller staat al vier maanden op 1/10. Een gedateerde schaarsteclaim is erger dan geen schaarsteclaim (pricing--desktop-s00.png).

**Sterk:** de werkruimte-slider met live maandtotaal (enige echt interactieve uitleg op de site), de per-vaardigheid-capstabel, credit packs, "Waarom onze prijzen zichtbaar zijn". Dit is de meest "eerlijke" pagina.

**Hiërarchie:** vier tierkaarten met TWEE amber CTA's (Founding én Professional) — twee primaire knoppen naast elkaar verzwakt de founding-focus. Growth toont "VANAF €1.996" pal naast Founding €997 — de duurdere kaart heet Growth; zonder toelichting boven de kaarten leest dit als een prijsfout. Cookiebanner overlapt de tussenkop van het tier-overzicht.

**Mobiel:** `pricing--mobile-s05.png`: de beschikbaarheidstabel toont alleen kolommen Founding en Growth; Professional en Enterprise vallen buiten beeld zonder zichtbare scroll-hint — zelfde tabel-afkappatroon als op home. Tierkaarten stapelen verder prima.

**Beeld nodig?** Nee — dit is een cijferpagina; de slider en tabellen zijn de juiste vorm. Alleen de afgekapte mobiele tabel moet een kaart-per-tier layout of scroll-affordance krijgen. Een klein "wat krijg ik voor 1 credit"-legendablok zou meer doen dan welk beeld ook.

---
### 4. `/nl/memory`
Bewijs: `slices/memory--desktop-s00/s01/s02.png`, `slices/memory--mobile-s03.png`.

**Dit is de beste pagina van de site.** Zij TOONT in plaats van vertelt: per geheugenlaag een echt "VRAAG AAN CLYDE / CLYDE ANTWOORDT"-kaartje met concrete, merkspecifieke antwoorden ("De carrousel staat ingepland voor 19:00", "gedeeld 312 keer en bewaard door 1.804 volgers"). De sticky laag-visual links (4 lagen, chips 01-04) plus "Maand 1 versus maand 3" (voor/na) en "Waarom generieke AI hier vastloopt" (3-koloms vergelijking met Clyde-kaart in teal rand) — dit is het patroon dat de rest van de site mist.

**Maar:** 1) de laag-visual is grotendeels een LEEG donker vlak met alleen een titel bovenin (memory--desktop-s00.png: kaart "Wie het merk ís" is ~700px hoog waarvan 80% leeg); 2) in "Drie gesprekken, één merk, één week" (memory--desktop-s02.png) staan onder beurt 1 per kolom TWEE LEGE berichtvakken — de replay-animatie stond stil bij de screenshot; wie niet wacht ziet lege dozen; 3) cookiebanner over de architectuur-kop.

**Mobiel** (memory--mobile-s03.png): stapelt netjes, Q&A-kaarten volledig leesbaar. Wel weer een extreem lange pagina (19.736px).

**Beeld nodig?** De pagina bewijst dat gesimuleerde dialogen werken; een screenshot van het ECHTE geheugen in de app (werkruimte met merkprofiel/brand-DNA) onder "Strikt gescheiden per merk" zou de claim "eigen geheugenruimte per klant" tastbaar maken. Verder niets toevoegen — eerder de lege visual vullen.

---
### 5. `/nl/about`
Bewijs: `slices/about--desktop-s00/s01/s02.png`.
Goede opbouw: missie → bouwreis-tijdlijn (Q3 2025 → H2 2026, met "je bent hier"-dot) → marktcontext-tijdperken → ICP → infrastructuur → capaciteitsbalk (1/10, mooiste schaarste-visual van de site) → founder-kaart met portret. Twee punten: (1) de sectie "Voor wie dit werkt (en voor wie niet)" is een vrijwel LETTERLIJKE herhaling van dezelfde sectie op home — wie doorklikt leest hem twee keer; (2) de tijdlijn belooft "H2 2026: Cohort 2 + Marketplace-app" — een datum die nu loopt; net als de pricing-badge veroudert dit zichtbaar. Beeld niet nodig behalve één: bij "Mijn infrastructuur" zou een klein architectuurdiagram (n8n → Supabase EU → kanalen) meer zeggen dan vier tekstkaarten.

### 6. `/nl/apply`
Bewijs: `slices/apply--desktop-s00.png`.
Kort en functioneel: 3-stappen-uitleg → wizard "Wie ben je?" (4 velden, "Volgende"). Drie fricties: (1) breadcrumb zegt "Aanmelden", H1 zegt "Plan een gesprek", de nav-knop heet óók "Plan een gesprek" — drie labels voor één actie; (2) de wizard-knop "Volgende" is TEAL terwijl elke primaire CTA op de site AMBER is — precies op de conversiepagina wisselt de knoptaal; (3) cookiebanner bedekt de 3-stappen-uitleg. Geen beeld nodig; wel een indicatie "stap 1 van X" op de wizard (nu onbekend hoeveel er komen).

### 7. `/nl/founding-member`
Bewijs: `slices/founding-member--desktop-s00.png`, `slices/founding-member--mobile-s02.png` (bladbreedte 898px i.p.v. 780px!).
Desktop sterk: prijskaart, "Waarom de 10 plekken bestaan", en de 10-slots-grid met het SKC-logo op slot 1 — beste schaarste-bewijs van de site. Drie defecten: (1) zelfde VEROUDERDE badge als pricing ("Stand van 24 april 2026 · Cohort start 1 juni 2026"); (2) mobiel heeft deze pagina HORIZONTALE overflow — de full-page screenshot is 59 CSS-px breder dan de viewport, dus de pagina schuift/knipt op een echte telefoon; (3) instructie "Hover op een plek voor context" bij de slots-grid werkt niet op touch. Beeld: per bezet slot een echt merklogo (nu alleen SKC) is het juiste patroon — voortzetten bij plek 2+.

### 8. `/nl/case-studies/skinclarity-club`
Bewijs: `slices/case-skc--desktop-s00/s01/s02.png` (mobiel 31.468px hoog, 16 slices).
Sterkste verhaalstructuur van de site: hoofdstukken 01-05 met zij-nav, accountkaarten met contentvolume-verdeling, "Voor Clyde / Met Clyde"-workflow naast elkaar met minuten per stap (uitstekend), zes metrics MET bronvermelding. Maar dit is de pagina die om echte beelden schreeuwt en de site GEEFT HET ZELF TOE: onder "Wat er per merk de deur uit gaat" staat letterlijk "Definitieve thumbnails worden later toegevoegd; de huidige cards tonen volume en type per merk" — vier kaarten met ICONEN (IG-glyph, sparkles, tasje, laagjes) waar thumbnails van echte carrousels horen (case-skc--desktop-s02.png). Voor een case over 36 IG-posts/week staat er NUL Instagram-content op de pagina. Tweede punt: de vier stat-tegels ("5 uur per week / 30 sec / +30% / €5.000") worden direct daarna nóg een keer herhaald als zes grote kaarten met dezelfde cijfers — één van de twee kan weg.

---
### 9. `/nl/skills` (index)
Bewijs: `slices/skills--desktop-s00/s01.png`.
Duidelijke grid, statusbadges LIVE/BINNENKORT, en hier is de Clyde-voorbeeldchat WÉL gevuld ("JIJ: Plan Instagram-content voor alle SKC-merken deze week / CLYDE: Gedaan. 21 carrousels + 15 posts...") — het bewijs dat de lege kaart op home een defect is, geen ontwerpkeuze. Footer-namen wijken af van kaartnamen ("Rapportage" vs "Rapportage & Analytics", "SEO / GEO" vs "SEO en GEO Analyst").

### 10-12. Skill-detailpagina's `/nl/skills/clyde`, `/social-media`, `/blog-factory`, `/voice-agent`
Bewijs: `slices/skill-clyde--desktop-s00/s01.png`, `slices/skill-social--desktop-s00.png`, `skill-blog--desktop-fold.png`, `slices/skill-voice--desktop-s00/s01/s02.png`.
Alle vier volgen een identiek, degelijk sjabloon: hero + getypte voorbeeldprompt + CTA, zij-nav "Op deze pagina", 4 functiekaarten, "Hoe het werkt" (3 genummerde stappen), "Werkt samen met", tier-tabel, FAQ. Consistentie is top; het gevolg is wel dat de pagina's onderling inwisselbaar zijn — vervang de zelfstandige naamwoorden en je leest dezelfde pagina. Specifiek:
- **Nul productbeeld op alle vier.** Social-media-pagina beschrijft "één contentkalender, slepen en neerzetten, preview over alle kanalen" — dat IS een screenshot, hij ontbreekt. Clyde-pagina beschrijft chat via dashboard/Slack/Telegram — geen enkel chatvenster afgebeeld (alleen een half getypte prompt "Plan deze week voor alle S▌").
- **De iconische interactieve VoiceDemoSection is WEG van de live voice-pagina** (skill-voice--desktop-s00/s01/s02 tonen: functies, stappen, tier-tabel, FAQ, CTA, footer — geen demo). Het enige echte interactieve productdemo-element van de site staat niet (meer) op prod.
- Voice-agent is BINNENKORT: hero-CTA zegt eerlijk "Bekijk de roadmap", maar de eind-CTA verkoopt "Klaar om telefoonverkeer aan Clyde over te dragen? Plan een gesprek" — dubbele boodschap voor een niet-live skill.
- Clyde's tier-tabel toont 4x "Fair use" — een tabel die niets onderscheidt is ruis; één zin volstaat.

---
### 13. `/nl/kennisbank`
Bewijs: `slices/kennisbank--desktop-s00.png`.
**Elke artikelkaart toont een KAPOTTE afbeelding** — broken-image-glyph linksboven en ~500px leeg donker vlak per kaart, over de hele grid. De kaarten reserveren beeldruimte voor covers die ontbreken of 404 geven. Dit is de meest zichtbare bug van de site: de pagina die autoriteit moet uitstralen oogt stuk. Verder is de structuur goed (filters, AI-scan-kaart in de zijbalk, auteur + datum per kaart). Fix: covers genereren (per categorie een sjabloonbeeld is genoeg) of de img-slot verwijderen en kaarten compact maken.

### 14. `/nl/kennisbank/wat-is-een-ai-marketing-medewerker`
Bewijs: `slices/kb-artikel--desktop-s00.png`.
Prima leespagina: eyebrow + categorie-chip, heldere H1, auteur/datum/leestijd, "IN DIT ARTIKEL"-inhoudsopgave, samenvattingsblok met checkmarks, nette regellengte. Kopstructuur H1-H2 klopt visueel. Geen beeld nodig; hooguit een eenvoudig diagram bij "Hoe Clyde werkt". Interne link naar de pillar-gids aanwezig. Beste tekstpagina van de site.

### 15. `/nl/contact`
Bewijs: `slices/contact--desktop-s00.png`.
Helder: doorverwijskaart naar /apply voor partnership, formulier (Naam/E-mail/Bureau/Bericht) met amber "Verstuur bericht", info-kaart (remote-first, reactietijd 24u — terwijl de intro "1 tot 2 werkdagen" zegt: kleine tegenspraak), eind-CTA. Geen beeld nodig. Cookiebanner bedekt het halve formulier bij eerste bezoek.

### 16. `/nl/assessment` — DE SCAN ONTBREEKT
Bewijs: `slices/assessment--desktop-s00.png` (volledige pagina is maar 1.865px), `slices/assessment--mobile-s01.png`.
De opvallendste nav-CTA ("Doe de AI-Scan", op elke pagina zichtbaar) landt op een pagina die belooft "Zestien vragen, vijf minuten" — en er is GEEN scan. Geen startknop, geen vragenformulier; alleen drie uitlegkaartjes, privacy-regels, dan "Liever direct praten? Sla de scan over" en de footer. Het interactieve hart van de funnel bestaat niet op de live pagina (of rendert niet — Playwright draaide met volledige JS en 3,5s wachttijd plus scroll). Wie op home "Start de scan" klikt eindigt in een doodlopende straat. Dit is bevinding #1 van de audit.

### 17. `/nl/roadmap`
Bewijs: `slices/roadmap--desktop-s00.png`.
Korte, eerlijke pagina: twee in-ontwikkeling-kaarten (Voice, Reel Builder) + founding-CTA. Detail: de Voice-kaart zegt "De interactieve demo werkt al" — maar die demo staat nergens op de site (niet op /skills/voice-agent, zie bevinding aldaar). Een claim naar iets onzichtbaars. Geen beeld nodig behalve juist die demo terugzetten.

---
## Dwarsdoorsneden

### Mobiel (samenvatting)
1. Tabellen kappen af zonder scroll-affordance: home-vergelijkingstabel (Clyde-kolom volledig buiten beeld, `home--mobile-s11`), pricing-beschikbaarheidstabel (Professional/Enterprise weg, `pricing--mobile-s05`).
2. `/nl/founding-member` heeft echte horizontale overflow (full-page screenshot 898px breed bij 780px viewport).
3. Skill-kaarten op home hebben honderden pixels lege ruimte per kaart (`home--mobile-s04`) waardoor de mobiele homepage ~26.000 CSS-px lang wordt.
4. De Clyde-FAB overlapt lopende tekst op de hero van home en how-it-works (`home--mobile-fold.png`, `how-it-works--mobile-fold.png`).
5. "Hover op een plek voor context" (founding-slots) is een muisinstructie op een touchpagina.
6. Boven de vouw op mobiel staat nergens een CTA; de cookiebanner eet 40-50% van het eerste scherm.

### Beweging en gewicht
De Spline-robot (alleen desktop-hero, `home--desktop-s00.png`) is technisch goed geïntegreerd maar semantisch leeg: een generieke humanoïde die niets van het product toont, terwijl de site juist bewijs-honger heeft. Verder is de site bewegingsarm — de animaties die er zijn (typende prompts, replay-chats) stonden bij de meting juist STIL in lege staat, wat erger is dan geen animatie. Oordeel: VERVANGEN door een statisch of licht geanimeerd productvenster (goedkeuringsqueue of chat), robot hooguit als klein merkaccent; minimaal: mobiel poster-frame en de lege chatstates een uitgeschreven eindstaat geven in plaats van lege dozen.

### Toegankelijkheid (basis)
- Contrast: bodytekst `#9ba3b5` en muted labels op `#0a0d14` zijn aan de krappe kant maar het muted-token is in Phase 11-02 op AA gebracht; mono-eyebrows op 11px in muted zijn het zwakst (site-breed).
- Kopstructuur visueel consistent H1-H2-H3; skill-paginas en artikel netjes.
- Alt-teksten: niet meetbaar via screenshots, maar er zijn nauwelijks afbeeldingen; de kapotte kennisbank-covers wijzen op ontbrekende src eerder dan alt-problemen.
- Focusindicatoren: niet zichtbaar in statische shots — apart te testen met toetsenbord.
- De zwevende NL-taalknop staat als los element over de breadcrumb op elke pagina (alle fold-shots) — verwarrend element zonder duidelijke functie-affordance.

### Consistentietabel (afwijkingen met bewijs)
| Element | Norm (meest voorkomend) | Afwijking | Bewijs |
|---|---|---|---|
| Primaire CTA-kleur | Amber "Plan een gesprek" | Apply-wizard gebruikt teal "Volgende"; cookiebanner-primair is ook teal | `slices/apply--desktop-s00.png` |
| Amber CTA's per scherm | 1 | Pricing toont er 2 naast elkaar (Founding en Professional) | `slices/pricing--desktop-s00.png` |
| Paginanaam | breadcrumb = H1 | breadcrumb "Aanmelden" vs H1 "Plan een gesprek" vs nav-knop met dezelfde naam | `slices/apply--desktop-s00.png` |
| Schaarste-badge | "FOUNDING OPEN · 1/10 BEZET" chip | pricing/founding-member voeren een gedateerde variant "Stand van 24 april 2026 · Cohort start 1 juni 2026" | `slices/pricing--desktop-s00.png`, `slices/founding-member--desktop-s00.png` |
| Hero-CTA skillpagina | "Plan een gesprek" | voice-agent hero "Bekijk de roadmap", maar de eind-CTA verkoopt wel een gesprek | `slices/skill-voice--desktop-s00/s02.png` |
| Skill-namen | kaartnamen ("Rapportage & Analytics", "SEO en GEO Analyst") | footer kort ze in ("Rapportage", "SEO / GEO", "Clyde Orchestrator") | `slices/skills--desktop-s01.png` |
| Demo-chatkaart Clyde | gevuld voorbeeldgesprek (skills-index) | zelfde kaart op home is LEEG | `slices/skills--desktop-s00.png` vs `slices/home--desktop-s01.png` |
| Tijdlijn-accentkleur | teal voor actief | how-it-works: stap 2 teal rand en stap 5 amber rand zonder legenda | `slices/how-it-works--desktop-s00.png` |
| Founding-plekken-visual | 10-slots-grid (founding-member) | balk (about), chip (elders): drie vormen voor hetzelfde getal | `slices/founding-member--mobile-s02.png`, `slices/about--desktop-s02.png` |
| Reactietijd-belofte | "binnen 3 werkdagen" (apply, contactkaart) | contact-infoblok zegt "Binnen 24 uur", intro "1 tot 2 werkdagen" | `slices/contact--desktop-s00.png` |

### Platformlogo-voorstel
Waar logo's geloofwaardigheid toevoegen (de site noemt de platforms nu alleen in lopende tekst):
1. **Home, nieuwe sectie "Werkt op jouw kanalen" direct onder de skills-grid**: een rustige rij monochrome logo's — Instagram, Facebook, LinkedIn, TikTok, WhatsApp, Gmail, Outlook, Google Analytics, Search Console, Stripe, ManyChat, n8n — met caption "Clyde publiceert, meet en reageert op de kanalen die je al gebruikt". Monochroom in tekst-secundair, merkkleur op hover; geen kaartjes, een logostrip. Dit is het patroon dat elke SaaS-bezoeker als integratiebewijs herkent.
2. **Skill-detailpaginas, in de functiekaarten**: klein inline logo bij het genoemde kanaal (IG/FB/LinkedIn op social-media; Gmail/Outlook op email-management; Meta op ad-manager; WhatsApp/IG op manychat).
3. **Case-study, bij "Hoe het werkt"**: pipeline-logos (n8n, Buffer, Instagram) bij de flowbeschrijving; de accountkaarten hebben het IG-glyph al.
4. **How-it-works stap 3 ("kanalen gekoppeld")**: dezelfde logostrip in miniatuur.
NIET doen: logo's in hero of footer als "partners" — dit zijn integraties, geen partnerschappen.
**Juridische randvoorwaarde**: nominative fair use — logo's alleen om compatibiliteit aan te duiden, in officiële vorm (brand-kits van Meta/Google/TikTok/Stripe respecteren: geen vervorming, juiste clear-space, geen endorsement-suggestie). Voeg een regel toe: "Alle merknamen en logo's zijn eigendom van hun respectievelijke eigenaren; vermelding duidt op compatibiliteit, niet op partnerschap." TikTok vereist het volledige logo (niet alleen de noot); Stripe-logo alleen tonen als betalingen echt via Stripe lopen.

---
## Geprioriteerde bevindingen

Ernst: P0 = breekt de funnel of geloofwaardigheid · P1 = ondermijnt overtuiging · P2 = polish.

| # | Ernst | Bevinding | Bewijs | Fix |
|---|---|---|---|---|
| 1 | P0 | `/nl/assessment` bevat geen scan: nav-CTA "Doe de AI-Scan" + home-teaser "Start de scan" landen op een pagina zonder start-knop of vragen | `slices/assessment--desktop-s00.png` | Scan-component terugzetten/repareren; tot die tijd nav-CTA en home-teaser op /apply richten |
| 2 | P0 | Kennisbank-grid: elke artikelkaart een kapotte cover (broken-image-glyph + leeg vlak) | `slices/kennisbank--desktop-s00.png` | Covers genereren of de image-slot uit de kaartcomponent halen |
| 3 | P0 | Verouderde schaarste-badge "Stand van 24 april 2026 · Cohort start 1 juni 2026" op pricing én founding-member — vandaag 1 sept | `slices/pricing--desktop-s00.png`, `slices/founding-member--desktop-s00.png` | Datum dynamisch of weglaten; cohorttekst herzien |
| 4 | P0 | Kern-demo "Zelfde prompt, twee uitkomsten" toont NOOIT Clyde's antwoord (lege response-vakken, drie puntjes) — de USP blijft onbewezen | `slices/home--desktop-s02.png`, `slices/home--mobile-s09.png` | Eindstaat uitschrijven als statische tekst; animatie alleen als progressive enhancement |
| 5 | P0 | Home hoofd-skillkaart bevat een lege chatmock (JIJ/CLYDE zonder inhoud) terwijl dezelfde kaart op /skills gevuld is | `slices/home--desktop-s01.png` vs `slices/skills--desktop-s00.png` | Gevulde variant van skills-index overnemen op home |
| 6 | P1 | Mobiele vergelijkingstabellen kappen de payoff-kolom af (Clyde-kolom onzichtbaar; pricing mist Professional/Enterprise) | `slices/home--mobile-s11.png`, `slices/pricing--mobile-s05.png` | Op mobiel stapelen als kaarten per kolom, of expliciete scroll-affordance + sticky eerste kolom |
| 7 | P1 | Case-study heeft nul content-thumbnails en zegt dat zelf ("Definitieve thumbnails worden later toegevoegd") — iconen op de plek van bewijs | `slices/case-skc--desktop-s02.png` | 4-8 echte IG-carrousel-covers (publiek materiaal SKC) plaatsen met caption per merk |
| 8 | P1 | Geen enkel productscreenshot op de hele site; secties beschrijven schermen (contentkalender, goedkeuringslijst, digest, werkruimte) die nooit getoond worden | alle slices; `public/screenshots/` is leeg | Drie screenshots maken het verschil: (1) goedkeuringsqueue met concept-post, (2) contentkalender-week, (3) wekelijkse digest. Inzetten op how-it-works stap 4, home-geheugensectie, skill-social |
| 9 | P1 | `/nl/founding-member` mobiel: horizontale overflow (pagina 59 CSS-px breder dan viewport) + hover-instructie op touch | `slices/founding-member--mobile-s02.png` (898px breed) | Overflow-bron fixen; "Hover" vervangen door "Tik" |
| 10 | P1 | Cookiebanner bedekt op elke pagina de primaire CTA of kernsectie boven de vouw (desktop: hero-CTA half afgesneden; mobiel: 40-50% van het scherm) | `home--desktop-fold.png`, `home--mobile-fold.png` | Banner compacter (één regel + knoppen) en onderaan zonder de CTA-zone te raken |
| 11 | P1 | Clyde-FAB overlapt lopende tekst op mobiele hero's (home, how-it-works) | `home--mobile-fold.png`, `how-it-works--mobile-fold.png` | FAB pas tonen na eerste scroll of onder de hero |
| 12 | P1 | Mobiele skill-kaarten (home) hebben elk honderden px lege ruimte; mobiele homepage ~26.000 px | `slices/home--mobile-s04.png` | min-height/aspect-slot van de kaarten schrappen op mobiel |
| 13 | P1 | Interactieve VoiceDemo staat niet (meer) op /skills/voice-agent, terwijl /roadmap claimt "De interactieve demo werkt al" | `slices/skill-voice--desktop-s00/s01/s02.png`, `slices/roadmap--desktop-s00.png` | Demo terugplaatsen op de voice-pagina of de roadmap-claim schrappen |
| 14 | P2 | Twee amber CTA's naast elkaar op pricing (Founding + Professional) verzwakt de founding-focus | `slices/pricing--desktop-s00.png` | Professional-knop naar outline-stijl |
| 15 | P2 | Apply: teal "Volgende" breekt de amber CTA-taal; breadcrumb/H1/nav-naam drie verschillende labels | `slices/apply--desktop-s00.png` | Amber knop; één naam kiezen ("Plan een gesprek") |
| 16 | P2 | "1 van 10 founding plekken" twee keer binnen de home-fold; "Voor wie dit werkt" letterlijk dubbel op home en about; casemetrics twee keer op de casepagina | `home--desktop-fold.png`, `slices/about--desktop-s01.png`, `slices/case-skc--desktop-s02.png` | Per pagina één keer; about-versie inkorten tot verschil-punten |
| 17 | P2 | Zwevende NL-chip over de breadcrumb op elke pagina, functie onduidelijk | alle fold-shots | In de nav opnemen als NL/EN/ES-switcher |
| 18 | P2 | Spline-robot toont niets van het product en ontbreekt op mobiel — het verhaal leunt op een asset die de helft van de bezoekers nooit ziet | `home--desktop-s00.png` vs `home--mobile-fold.png` | Vervangen door productvenster (zie sectievoorstel); robot als accent |
| 19 | P2 | Clyde-skillpagina tier-tabel: vier rijen allemaal "Fair use" — tabel zonder informatie | `slices/skill-clyde--desktop-s01.png` | Vervangen door één zin |
| 20 | P2 | Contact: drie verschillende reactietijden (24u / 1-2 werkdagen / 3 werkdagen) op één pagina | `slices/contact--desktop-s00.png` | Eén belofte kiezen |

---
## Ontwerpvoorstel: homepage-sectievolgorde

Doel: de bezoeker die wél komt binnen twee schermen laten ZIEN wat Clyde is, voor wie, en wat het bewijs is. Nu praat de pagina 16 secties lang; het bewijs (lege demo's, iconen-kaarten) laat verstek gaan.

1. **Hero** — behouden: "Dit is Clyde. Jouw AI marketing medewerker." + subregel voor wie ("Voor bureaus met 5-30 FTE en 10-50 merken" als echte zin, niet als badge). Eén amber CTA + secundaire tekstlink naar de scan (zodra die bestaat). Rechts NIET de robot maar een productvenster: de goedkeuringsqueue met drie concept-posts in verschillende merkstijlen, één op "Goedgekeurd". Dat beeld vertelt autonoom + jij houdt regie + multi-merk in één oogopslag. Founding-counter één keer, in de eyebrow.
2. **Logostrip "Werkt op jouw kanalen"** — nieuw (zie platformlogo-voorstel): 10-12 monochrome kanaallogo's, één regel caption. Direct herkenbaar integratiebewijs, kost 60px hoogte.
3. **Bewijsblok SkinClarity** — de bestaande case-teaser ("36 posts/week autonoom") maar met een echte IG-grid-screenshot van de drie accounts naast de cijfers, plus de quote van Sindy. Cijfers + gezicht + echte content in één sectie; vervangt de losse stats-strip en de aparte testimonial verderop.
4. **Zelfde prompt, twee uitkomsten** — de bestaande geheugensectie, maar met UITGESCHREVEN antwoorden (links generiek antwoord, rechts Clyde's merkspecifieke antwoord, statisch leesbaar). De vier geheugenlaag-kaartjes eronder behouden; link naar /memory.
5. **Wat Clyde doet** — de 12-skills-grid, ingekort tot de 10 LIVE skills met de 2 BINNENKORT als kleine voetregel; per kaart het kanaallogo inline. De Clyde-orchestratorkaart met het GEVULDE voorbeeldgesprek (zoals op /skills).
6. **Hoe het begint** — de bestaande 4-weken-tijdlijn comprimeren tot 4 stappen op één rij met week-labels + link naar /how-it-works. Screenshot van de wekelijkse digest als bewijs bij week 4.
7. **Prijs zonder omweg** — Founding-kaart €997 + één regel over de tiers daarna + "Bekijk prijzen"-link (de volledige vier-kaarten-vergelijking blijft op /pricing). Founding-slots-grid (uit founding-member) hier hergebruiken als visual.
8. **Voor wie (en voor wie niet)** — bestaande twee kolommen, dit is een sterk kwalificatie-instrument; op about vervangen door een verwijzing.
9. **FAQ (5 vragen)** — behouden.
10. **Eind-CTA "Tien plekken open."** — behouden, maar teller en datum kloppend.
Weg/samengevoegd: losse stats-strip (in 3), losse founder-sectie (naar about; op home één regel onder de tijdlijn: "Daley begeleidt elke onboarding persoonlijk" + portret-thumbnail), drie pijlers GDPR/24u/1:1 (comprimeren tot badges onder de prijs), kennisbank-teasers (footer volstaat bij dit verkeer).

## Ontwerpvoorstel: /nl/how-it-works sectievolgorde

Doel: van "hoe begint het" naar "zo werkt het systeem, dit zie je als klant".

1. **Hero** — kop behouden ("Hoe begint jouw partnership met Clyde?"), subregel "Vijf stappen, vier weken, daarna draait het autonoom." Eén CTA.
2. **Systeemplaat (nieuw, hét ontbrekende beeld van de site)** — één breed diagram: [Jouw merken] → brand-scan → [Clyde + geheugen per merk] → 12 vaardigheden → [kanalen: logostrip] → [goedkeuringsqueue] → publicatie → [wekelijkse digest] → terug het geheugen in. Eén oogopslag, geen animatie nodig; caption: "Jij keurt, Clyde voert uit, het geheugen leert."
3. **De 5-stappen-tijdlijn** — bestaand, maar per stap één screenshot-thumbnail: stap 2 werksessie (agenda/Slack), stap 3 werkruimte met merkprofiel, stap 4 goedkeuringsqueue met concept-post (belangrijkste beeld: concept + Goedkeuren/Afwijzen-knoppen + merkbadge), stap 5 wekelijkse digest-mail. Randkleuren teal/amber alleen nog met betekenis (amber = doorlopend).
4. **Wat je per week ziet (nieuw, klein)** — drie mini-schermen naast elkaar: maandag conceptbatch klaar, jij keurt in 30 sec/post, vrijdag digest. Koppelt het proces aan de ervaring.
5. **De ritmische cyclus** — bestaand diagram (Productie → Goedkeuring → Geheugen → Verbetering), groter, zonder de dubbele mono-caption.
6. **Onboarding-slots + eind-CTA** — bestaand ("2 slots per maand", "Klaar om te starten?"), teller kloppend.
Weg: niets — de pagina is kort en goed; hij mist alleen de systeemplaat en de schermen.

---
*Alle oordelen in dit rapport verwijzen naar bekeken screenshots in `screens-2026-09-01/` (72 stuks, desktop 1440x900 en mobiel 390x844, plus `slices/` met leesbare stroken van de full-page shots).*
