# NL Audit — Home / Landing / Nav / Common / Errors / Calendly / Booking

Audit uitgevoerd op `messages/nl.json` — scope: `home`, `landing`, `nav`, `common`, `errors`, `calendly`, `booking`.

## Summary

- **Total keys reviewed**: ~155 string keys
  - `home`: 97 keys
  - `common`: 38 keys (incl. `common.landing.footer.*`)
  - `calendly`: 2 keys
  - `errors`: 6 keys
  - `booking`: 7 keys
  - `landing`: 1 (leeg object `footer.nav: {}`)
  - `nav`: 2 keys
- **Issues found**: 42
- **Severity breakdown**: 8 critical, 19 moderate, 15 minor

**Hoofdbevindingen**:
1. Veel Engels jargon blijft staan ("Lead Qualifier", "Ad Creator", "unlimited", "Reporting", "Voice Agent") in een tier/service-context die ook in NL werkt. Sommige zijn productnamen (oké), maar de omringende taal mixt frameworks (bv. "Clyde AI Employee") met NL-copy wat inconsistent leest.
2. Komma's als zachte zin-scheiders waar een punt of dubbele punt sterker is ("Dit is Clyde. De AI Marketing Medewerker ," → "Dit is Clyde: de AI Marketing Medewerker voor jouw bureau").
3. Hoofdletters in zins-titels ("Wat Clyde Doet voor Jouw Bureau", "Waarom Bureaus Clyde Inhuren") zijn Engels-style Title Case. In NL: alleen eerste woord + eigennamen.
4. Kleine grammatica/tikfouten ("concurrentievoordeel" → goed; "creert" → "creëert", "authoriteit" → "autoriteit", "Passing of niet-passing" is geen NL).
5. Mixture van "je" en "jij" (oké) maar inconsistent met "onze" vs. "wij" in identieke context.
6. Glossary-inconsistenties: "features" wordt soms stilzwijgend toch gebruikt via CSS-key (`features_0`), maar in UI-strings komt "skills" 40+ keer voor naast "vaardigheden" (mixed). Binnen dezelfde page soms "skill" en "vaardigheid" door elkaar. Dit moet kiezen-en-consequent-toepassen.

## Issues

---

### home.meta.description
**Issue type**: Dunglish / interpunctie
**Current**: "Clyde is de AI-medewerker van jouw bureau. Hij schrijft content, belt leads, beheert social media, maakt advertenties en rapporteert over prestaties , 24/7, voor elke klant. Gebouwd door FutureMarketingAI."
**Problem**: ", 24/7," is een em-dash vervanger die niet werkt in NL (losse komma met spatie eromheen). Leest als tekstverwerkings-ongeluk. Ook "rapporteert over prestaties" klinkt formeel-Engels.
**Proposed**: "Clyde is de AI-medewerker van jouw bureau. Hij schrijft content, belt leads, beheert social media, maakt advertenties en levert prestatie-rapportages: 24/7 voor elke klant. Gebouwd door FutureMarketingAI."

---

### home.hero.badge
**Issue type**: Dunglish / interpunctie
**Current**: "Jouw AI Marketing Medewerker met lange-termijn geheugen , {taken} van {total} founding plekken bezet"
**Problem**: Losse komma met spatie-ervoor (em-dash-vervanging) leest rommelig. "lange-termijn geheugen" mist streepje-consistentie; NL schrijft "langetermijngeheugen" als één woord.
**Proposed**: "Jouw AI Marketing Medewerker met langetermijngeheugen. {taken} van {total} founding plekken bezet."

---

### home.hero.subtitle
**Issue type**: Dunglish / lezen-moeilijk
**Current**: "Clyde onthoudt elke klant, leert van elke campagne, en runt twaalf vaardigheden autonoom. Social, blogs, voice, ads, SEO en analytics. Eén AI-medewerker voor jouw hele klantportfolio."
**Problem**: "runt" is Nederengels (van "to run"). "Social, blogs, voice, ads" is telegram-Engels zonder NL-equivalenten. Comma voor "en" is on-Nederlands (Oxford comma).
**Proposed**: "Clyde onthoudt elke klant, leert van elke campagne en voert twaalf vaardigheden autonoom uit: social media, blogs, voice, advertenties, SEO en analytics. Eén AI-medewerker voor jouw hele klantportfolio."

---

### home.hero.trustAnchor
**Issue type**: Onnatuurlijk / te beknopt
**Current**: "Gebouwd met Nederlandse bureaus in de praktijk. Max 20 partners per jaar."
**Problem**: "Gebouwd met Nederlandse bureaus in de praktijk" is krom. Bedoelt "in samenwerking met" of "getoetst in de praktijk van".
**Proposed**: "In de praktijk gebouwd met Nederlandse bureaus. Maximaal 20 partners per jaar."

---

### home.hero.ctaSecondary
**Issue type**: Glossary / consistency
**Current**: "Ontmoet Clyde"
**Problem**: "Ontmoet" in UI-context is dunglish (Meet Clyde). NL gebruikt eerder "Maak kennis met" of "Bekijk Clyde". Maar note: elders in de site wordt hero-copy doelbewust afgekort naar "Dit is Clyde." Dus CTA "Ontmoet Clyde" botst stilistisch.
**Proposed**: "Maak kennis met Clyde" of "Bekijk wat Clyde doet"

---

### home.services.title
**Issue type**: Title Case (EN-style)
**Current**: "Wat Clyde Doet voor Jouw Bureau"
**Problem**: Nederlandse titels gebruiken alleen een hoofdletter op het eerste woord (en eigennamen). "Wat Clyde Doet voor Jouw Bureau" is Engels Title Case.
**Proposed**: "Wat Clyde doet voor jouw bureau"

---

### home.services.subtitle
**Issue type**: Onnatuurlijk
**Current**: "Twaalf gespecialiseerde vaardigheden. Hier een greep uit wat Clyde het vaakst doet."
**Problem**: "Hier een greep uit" is kort, mist werkwoord. Leest als losse-pols-notitie.
**Proposed**: "Twaalf gespecialiseerde vaardigheden. Hieronder een selectie van wat Clyde het vaakst doet."

---

### home.services.voiceAgent.description
**Issue type**: Interpunctie (losse komma)
**Current**: "Clyde neemt de telefoon op, boekt afspraken en beantwoordt FAQ , 24/7 per klant"
**Problem**: Losse komma met spatie. Punt of dubbele punt maakt het schoner. Ook "FAQ" in NL → "veelgestelde vragen" of gewoon houden als eigennaam, maar dan zonder losse komma.
**Proposed**: "Clyde neemt de telefoon op, boekt afspraken en beantwoordt veelgestelde vragen. 24/7 per klant."

---

### home.services.leadQualifier.description
**Issue type**: Anglicisme / passief
**Current**: "Website chatbot die leads kwalificeert en warme prospects naar CRM stuurt"
**Problem**: "Warme prospects" is acceptabel jargon, maar "naar CRM stuurt" zonder lidwoord is onnatuurlijk NL. "Warme leads" past glossary-technisch beter dan "prospects" in NL.
**Proposed**: "Website-chatbot die leads kwalificeert en warme leads doorzet naar je CRM"

---

### home.services.socialMedia.description
**Issue type**: Glossary / NL consistency
**Current**: "Clyde runt captions, scheduling en carrousels per klant. In de juiste brand voice per merk"
**Problem**: "Runt", "captions", "scheduling", "carrousels", "brand voice" — vijf anglicismen in één zin. "Runt" is echt dunglish. "Scheduling" heeft een NL-woord ("planning"). "Carrousels" is geaccepteerd. "Brand voice" is vakjargon maar kan NL: "merkstem".
**Proposed**: "Clyde verzorgt captions, planning en carrousels per klant. In de juiste merkstem per merk."

---

### home.services.adCreator.description
**Issue type**: Dunglish
**Current**: "Clyde genereert statische en video ads voor Meta. A/B varianten direct publiceerbaar"
**Problem**: "A/B varianten direct publiceerbaar" is telegramstijl zonder werkwoord. Mist lidwoord en hulpwerkwoord.
**Proposed**: "Clyde genereert statische en video-advertenties voor Meta. A/B-varianten zijn direct publiceerbaar."

---

### home.services.reporting.description
**Issue type**: Anglicisme
**Current**: "Wekelijkse performance digests, KPI dashboards en anomaly alerts"
**Problem**: "Performance digests" en "anomaly alerts" zijn pure Engels. NL heeft hiervoor woorden.
**Proposed**: "Wekelijkse prestatie-overzichten, KPI-dashboards en alerts bij afwijkingen"

---

### home.services.clyde.description
**Issue type**: Anglicisme
**Current**: "De orchestrator. Geef opdrachten in natural language, Clyde routeert naar de juiste vaardigheid"
**Problem**: "Orchestrator" en "natural language" en "routeert" zijn Engels. NL heeft "orkestrator" / "dirigent" en "gewone taal". "Routeert" is ingeburgerd maar "stuurt door" leest natuurlijker.
**Proposed**: "De orkestrator. Geef opdrachten in gewone taal, Clyde stuurt ze door naar de juiste vaardigheid."

---

### home.trust.title
**Issue type**: Title Case
**Current**: "Waarom Bureaus Clyde Inhuren"
**Problem**: Engelse Title Case.
**Proposed**: "Waarom bureaus Clyde inhuren"

---

### home.trust.customBuilt
**Issue type**: Dunglish / fragment
**Current**: "Persistent geheugen per klant. Clyde bestudeert merkstem, doelgroep en prestatiegeschiedenis. Elke week scherper, per merk geïsoleerd."
**Problem**: "Per merk geïsoleerd" is zinsfragment. Leest als bulletpoint-resten.
**Proposed**: "Persistent geheugen per klant. Clyde leert merkstem, doelgroep en prestatiehistorie. Elke week scherper, met strikte scheiding tussen merken."

---

### home.trust.founderAccess
**Issue type**: Oké in principe, maar "self-service" staat in NL-content
**Current**: "Max 20 bureaus per jaar. Persoonlijke onboarding door Daley. Geen self-service. Elke klant is een partnership."
**Problem**: "Self-service" is jargon dat blijft hangen. Verder leest dit redelijk.
**Proposed**: "Maximaal 20 bureaus per jaar. Persoonlijke onboarding door Daley. Geen selfservice-aanmelding: elke klant is een partnership."

---

### home.trust.successGuarantee
**Issue type**: Dunglish constructie
**Current**: "SkinClarity Club draait al 3 Instagram-accounts × 4 merken × meerdere content-types autonoom. Wat je klantportfolio ook is, Clyde past zich aan."
**Problem**: Eerste zin leest als spreadsheet ("×"). Tweede zin "Wat je klantportfolio ook is" is Engelse constructie ("Whatever your portfolio is").
**Proposed**: "SkinClarity Club draait al autonoom op 3 Instagram-accounts met 4 merken en meerdere content-types. Hoe je klantportfolio er ook uitziet: Clyde past zich aan."

---

### home.trust.trialTitle + trialCommitment
**Issue type**: Mismatch tussen key-naam en content
**Current (trialTitle)**: "EU-native, zero lock-in"
**Current (trialCommitment)**: "Self-hosted infrastructuur op Europese servers. AVG + EU AI Act ready. Je data blijft van jou."
**Problem**: "EU-native, zero lock-in" is telegramstijl, drie anglicismen. "Ready" is dunglish (we zeggen "compliant" of "voldoet aan"). Technisch oké maar niet gepolijst.
**Proposed title**: "Europees, zonder lock-in"
**Proposed body**: "Self-hosted infrastructuur op Europese servers. Voldoet aan AVG en EU AI Act. Je data blijft van jou."

---

### home.icp.title
**Issue type**: Consistency / leestnatuurlijker
**Current**: "Voor welke bureaus bouwen we Clyde?"
**Problem**: Oké maar klinkt licht academisch. "Voor wie bouwen we Clyde?" zou directer zijn.
**Proposed**: OK, geen harde fix. Of: "Voor welke bureaus is Clyde gebouwd?"

---

### home.icp.subtitle
**Issue type**: Dunglish
**Current**: "Geen marketing-pitch. Lees het eerlijk: we werken liever niet met iedereen."
**Problem**: "Lees het eerlijk" is letterlijke vertaling van "read this honestly". Klinkt vreemd in NL.
**Proposed**: "Geen marketing-pitch. Eerlijk gezegd: we werken liever niet met iedereen."

---

### home.icp.fit3
**Issue type**: Anglicisme
**Current**: "Founders die een partner zoeken, geen tool. Bereid workflows te herijken, niet alleen uit te voeren"
**Problem**: "Tool" wordt elders door glossary verboden. "Workflows" en "herijken" mixen registers; "herijken" is heel formeel, "workflows" is anglicisme.
**Proposed**: "Founders die een partner zoeken, geen systeem. Bereid om werkwijzen te herzien, niet alleen uit te voeren."

---

### home.icp.notFit2
**Issue type**: Anglicisme
**Current**: "Je puur branding, identity of creative doet. Clyde levert performance content, geen design work"
**Problem**: "Creative" en "design work" en "performance content" zijn drie anglicismen in een rij. In NL kan "creatief werk" en "design" apart.
**Proposed**: "Je bureau puur branding, identity of creatief werk doet. Clyde levert performance-content, geen designwerk."

---

### home.icp.notFit3
**Issue type**: Syntax
**Current**: "Je op zoek bent naar 'set-and-forget'. Clyde leert van jou, dat vereist 4 weken onboarding en blijvende input"
**Problem**: "Dat vereist" hoort een nieuwe zin te beginnen met hoofdletter, niet na een komma. Anglicisme "blijvende input" (doorlopende betrokkenheid).
**Proposed**: "Je op zoek bent naar 'set and forget'. Clyde leert van jou; dat vraagt 4 weken onboarding en doorlopende betrokkenheid."

---

### home.stats.clients.value + label
**Issue type**: Onduidelijkheid
**Current value**: "3 × 4 merken" | **label**: "SkinClarity Club autonoom"
**Problem**: "3 × 4 merken" leest als wiskunde zonder context. Als label eronder "SKC autonoom" staat, begrijp je het achteraf, maar de stat-value zelf doet pijn in de ogen.
**Proposed value**: "3 accounts, 4 merken" | **label**: "SkinClarity Club draait autonoom"

---

### home.stats.hours.value + label
**Issue type**: Onnatuurlijk NL
**Current value**: "Persistent" | **label**: "Geheugen per klant"
**Problem**: "Persistent" als losstaand NL-woord is dunglish. Wij zeggen "Permanent" of "Blijvend".
**Proposed value**: "Permanent" | **label**: "Geheugen per klant"

---

### home.badges.title
**Issue type**: Title Case
**Current**: "Gebouwd voor Europese Bureaus"
**Problem**: Title Case.
**Proposed**: "Gebouwd voor Europese bureaus"

---

### home.badges.noLockIn
**Issue type**: Title Case / anglicisme
**Current**: "Geen Lock-in Contracten"
**Problem**: Title Case + "lock-in contracten" is half-NL half-EN.
**Proposed**: "Geen lock-in-contracten" of "Contracten zonder lock-in"

---

### home.cta.title
**Issue type**: Dunglish
**Current**: "Klaar om kennis te maken met Clyde?"
**Problem**: Oké maar slap. "Klaar om..." is letterlijke vertaling van "Ready to...". NL kan directer.
**Proposed**: "Kennismaken met Clyde?" of "Wil je Clyde leren kennen?"

---

### home.cta.subtitle
**Issue type**: Losse komma / interpunctie
**Current**: "Max 20 bureaus per jaar. {taken} van {total} founding plekken bezet. Plan een gesprek. We bespreken samen of Clyde past bij jouw portfolio."
**Problem**: Oké eigenlijk. "Plan een gesprek" als losse zin met punt ervoor/erna voelt gehakt.
**Proposed**: "Maximaal 20 bureaus per jaar. {taken} van {total} founding plekken bezet. Plan een gesprek zodat we samen kunnen bekijken of Clyde bij jouw portfolio past."

---

### home.faq.items.q1.answer
**Issue type**: Glossary-violatie
**Current (slice)**: "...ChatGPT en Jasper zijn generieke tools zonder geheugen..."
**Problem**: Glossary zegt "nooit 'tool'". Hier onvermijdelijk als je ChatGPT beschrijft, maar elders in dezelfde antwoord-tekst ("niet een los tool per taak") wringt het.
**Proposed**: "...ChatGPT en Jasper zijn generieke AI-systemen zonder geheugen..." en "niet een los systeem per taak"

---

### home.faq.items.q3.answer
**Issue type**: Dunglish
**Current (slice)**: "Clyde is een high-touch AI partnership, geen SaaS-tool. ... De application is niet om je af te wijzen. Het is om te checken of we beide de juiste match zijn."
**Problem**: "Om te checken" dunglish (controleren/vaststellen). "De juiste match" is pure anglicisme. "High-touch" en "SaaS-tool" zijn EN.
**Proposed**: "Clyde is een hoogwaardig AI-partnership, geen SaaS-product. ... De application is niet om je af te wijzen, maar om samen vast te stellen of het een match is."

---

### home.faq.items.q5.answer
**Issue type**: Dunglish
**Current (slice)**: "...Daar verlies je context bij elke handover."
**Problem**: "Handover" (overdracht). Dunglish.
**Proposed**: "...Daar verlies je context bij elke overdracht."

---

### home.trustStrip.title
**Issue type**: Licht onnatuurlijk
**Current**: "Gebouwd met en voor Nederlandse bureaus en merken"
**Problem**: Gaat net. "Met en voor" is dubbele preposities; in spreektaal NL zou je kiezen.
**Proposed**: "Gebouwd samen met, en voor, Nederlandse bureaus en merken"

---

### home.trustStrip.caseLink
**Issue type**: Engels-NL mix
**Current**: "Bekijk de SKC case study"
**Problem**: "Case study" is anglicisme. NL zegt "klantcase" of "praktijkvoorbeeld".
**Proposed**: "Bekijk de SKC-klantcase"

---

### common.nav.about
**Issue type**: Glossary/tone
**Current**: "Over Ons"
**Problem**: Capital "O". In NL onderkast, tenzij merk. Ook "Over ons" kan korter als "Over".
**Proposed**: "Over ons"

---

### common.footer.services
**Issue type**: Glossary conflict
**Current**: "Skills"
**Problem**: Dit is een UI-label onder de footer-heading "Services". In NL moet dit "Vaardigheden" zijn per glossary. Nu is het dubbelzinnig: EN label onder een key "services", terwijl de rendertekst zelf Engels is.
**Proposed**: "Vaardigheden"

---

### common.footer.terms
**Issue type**: Stijl
**Current**: "Servicevoorwaarden"
**Problem**: NL-bureaus gebruiken eerder "Algemene voorwaarden".
**Proposed**: "Algemene voorwaarden"

---

### common.landing.footer.tagline
**Issue type**: Interpunctie
**Current**: "De AI Marketing Medewerker voor jouw bureau. Content, voice, ads, social, leads en rapportages in een altijd-aan systeem."
**Problem**: "Altijd-aan systeem" is dunglish ("always-on system"). "Ads" blijft EN; beter "advertenties".
**Proposed**: "De AI Marketing Medewerker voor jouw bureau. Content, voice, advertenties, social, leads en rapportages in één doorlopend systeem."

---

### common.landing.footer.sections.skills / nav.*
**Issue type**: Glossary conflict
**Current**: `skills: "Skills"`, `content_creator: "Content Creator"`, `voice_agent: "Voice Agent"`, `lead_qualifier: "Lead Qualifier"`, `social_media: "Social Media"`, `ad_creator: "Ad Creator"`, `reporting: "Reporting"`, `how_it_works: "Hoe het werkt"`, `blog_factory: "Blog Factory"`, `seo_geo: "SEO / GEO"`, `clyde: "Clyde AI Employee"`, `memory: "Memory System"`, `caseStudies: "Case Studies"`
**Problem**: Dit zijn productnamen (kunnen EN blijven), maar "Memory System" en "Case Studies" hebben NL-equivalent en "Reporting" is geen productnaam maar functie. Mixed register.
**Proposed**:
- `skills: "Vaardigheden"`
- `how_it_works: "Hoe het werkt"` (oké)
- `memory: "Geheugensysteem"` of laat "Memory System" als feature-naam
- `caseStudies: "Klantcases"`
- `reporting: "Rapportages"` (als functie-categorie)
- Overige (Voice Agent, Lead Qualifier, Ad Creator, Blog Factory, Clyde AI Employee) zijn productnamen — oké als ze als zodanig gebruikt worden.

---

### common.landing.footer.status_badge
**Issue type**: Anglicisme
**Current**: "Alle systemen operationeel"
**Problem**: "Operationeel" is niet fout, maar klinkt IT-afdelings-taal. "Alle systemen werken" of "Alles werkt" is natuurlijker.
**Proposed**: "Alle systemen werken"

---

### common.actions.learn_more
**Issue type**: Dunglish
**Current**: "Meer Leren"
**Problem**: Directe vertaling van "Learn More". NL zegt "Meer weten", "Lees meer", "Meer info".
**Proposed**: "Meer weten" of "Lees meer"

---

### common.cookie_consent.description
**Issue type**: Oké maar generiek
**Current**: "Wij gebruiken cookies om je ervaring te verbeteren en het siteverkeer te analyseren."
**Problem**: "Je ervaring" is acceptabel, "siteverkeer" is correct NL. Oké. Geen fix nodig.
**Proposed**: Geen wijziging.

---

### common.errors.notFound.title
**Issue type**: Title Case
**Current**: "Pagina Niet Gevonden"
**Problem**: In NL: eerste woord hoofdletter, rest klein.
**Proposed**: "Pagina niet gevonden"

---

### common.errors.notFound.backHome
**Issue type**: Engels dunglish
**Current**: "Terug naar Home"
**Problem**: "Home" blijft EN. NL: "Terug naar de homepage" of "Terug naar start".
**Proposed**: "Terug naar de homepagina"

---

### errors.notFound.title
**Issue type**: Title Case (dubbel met common.errors — zelfde issue)
**Current**: "Pagina Niet Gevonden"
**Proposed**: "Pagina niet gevonden"

---

### errors.notFound.backHome
**Issue type**: Engels dunglish (zelfde als common.errors.notFound.backHome)
**Current**: "Terug naar Home"
**Proposed**: "Terug naar de homepagina"

---

### calendly.modal_title
**Issue type**: OK maar afwijkend van CTA-conventie
**Current**: "Plan een Strategiegesprek"
**Problem**: Elders in NL-content is de standaard "Plan een gesprek". "Strategiegesprek" voegt waarde toe, maar Title Case is Engels. Tevens consistency: glossary zegt "Plan een gesprek" / "Apply".
**Proposed**: "Plan een strategiegesprek" (lowercase "s") of enkel "Plan een gesprek"

---

### calendly.close
**Issue type**: Oké
**Current**: "Sluiten"
**Proposed**: Geen wijziging.

---

### booking.title
**Issue type**: Title Case
**Current**: "Plan een Strategiegesprek"
**Problem**: Zie calendly.modal_title.
**Proposed**: "Plan een strategiegesprek"

---

### booking.subtitle
**Issue type**: Dunglish
**Current**: "Ontdek hoe Clyde je marketing kan transformeren"
**Problem**: "Transformeren" hier is dunglish van "transform your marketing". NL gebruikt eerder "versnellen", "verbeteren", "opnieuw opzetten".
**Proposed**: "Ontdek hoe Clyde jouw marketing versnelt"

---

### booking.bullet1
**Issue type**: Dunglish
**Current**: "Gratis audit van je huidige marketing"
**Problem**: "Audit" is oké als vakterm, leest acceptabel. Kan scherper.
**Proposed**: "Gratis audit van je huidige marketing-setup" of laat staan.

---

### booking.bullet2
**Issue type**: Anglicisme
**Current**: "Live Clyde demo met jouw merk"
**Problem**: "Live Clyde demo" is drie-woorden-EN zonder verbinding. Leest haperend.
**Proposed**: "Live demo van Clyde, toegepast op jouw merk"

---

### booking.bullet3
**Issue type**: Dunglish
**Current**: "Op maat gemaakte strategie-aanbevelingen"
**Problem**: "Op maat gemaakte" is oké, licht omslachtig. "Aanbevelingen op maat" is natuurlijker.
**Proposed**: "Strategische aanbevelingen op maat"

---

### booking.bullet4
**Issue type**: Kort maar onduidelijk
**Current**: "Transparante prijsbespreking"
**Problem**: "Prijsbespreking" is juridisch-stijf. "Prijzen open op tafel" of "Prijzen zonder verrassingen".
**Proposed**: "Prijzen open op tafel"

---

### booking.credential
**Issue type**: Interpunctie
**Current**: "Daley. Oprichter, FutureMarketingAI"
**Problem**: Punt na naam is vreemd. Normaal is dit komma of em-streepje (maar em-streepje verboden). Hier werkt komma.
**Proposed**: "Daley, oprichter van FutureMarketingAI"

---

### nav.login
**Issue type**: Engels / consistency
**Current**: "Login"
**Problem**: Op een NL-site met consistent "Plan een gesprek" hoort "Login" in NL. "Inloggen".
**Proposed**: "Inloggen"

---

### nav.apply
**Issue type**: OK (matcht glossary)
**Current**: "Plan een gesprek"
**Proposed**: Geen wijziging.

---

## Opvallende patronen over de hele scope

1. **Title Case in titels** — zeker 8 plekken in `home.*` en `common.*` hebben Engelse Title Case. Fix: hele file doorlopen en titles lowercase maken (behalve eerste woord + eigennamen).

2. **Losse komma's met spaties** (" , ") — komen van em-dash-vervanging. Dit leest als een bug; vervangen door punt, dubbele punt, of wegwerken in zin.

3. **Anglicisme-stack** — "tool", "workflow", "platform", "features" (in copy, niet key-namen), "runt", "self-service", "set-and-forget", "ready", "always-on", "operationeel", "transform" — komen allemaal meermalen terug.

4. **"Performance" als bijvoeglijk naamwoord** — "performance content", "performance digest", "performance tracking". NL heeft "prestatie-": "prestatie-rapportage", "prestatie-data".

5. **Korte zinsfragmenten zonder werkwoord** — typisch Engels advertising-style ("A/B varianten direct publiceerbaar"). NL verwacht volzinnen of echte bullets.

6. **"Unlimited"** — komt voor in pricing (buiten scope) maar wordt ook via `home.badges.*` indirect aangeraakt. Let op glossary: nooit "unlimited" zonder onderbouwing.

7. **"Skills" vs. "vaardigheden"** — in `common.landing.footer.sections.skills: "Skills"` en elders mix. Kies: NL = "Vaardigheden", productnaam = "skills" binnen dev-context.

## Aanbevolen vervolgacties

1. Globale find-replace "Title Case" → lowercase in titel-keys (menselijk review noodzakelijk voor eigennamen).
2. Globale find-replace " , " → ". " of ": " (case-by-case).
3. Glossary-sweep op "tool", "workflow", "runt", "performance", "handover", "learn more" etc.
4. Specifiek blokje "nav" + "common.footer" harmoniseren met glossary.
5. `common.errors` en `errors` zijn duplicaten — overweeg samenvoeging.
