# NL Audit , Case Studies / Blog / Chatbots

Scope: namespaces `chatbots`, `chatbot`, `blog`, `case_studies` in `fmai-nextjs/messages/nl.json`.

## Summary

- Total keys reviewed: ~150 (chatbots ~85, chatbot 2, blog 4, case_studies ~55)
- Issues found: 38
- Belangrijkste patronen:
  - Title Case in headings (Engelse conventie) waar Nederlands zinsbouw vraagt
  - Veel anglicismen: "brain", "onboarding", "playground", "rules", "personas", "rich media", "integration", "tracking", "setup"
  - Glossary-breuk: "features" (in comment niveau) en vooral "klanten" als directe vertaling voor `customers`, terwijl we "merken/klantportfolio" moeten gebruiken. "AI tool" staat niet letterlijk maar "chatbot" wordt soms als los product neergezet in plaats van als vaardigheid van Clyde
  - Een em-dash `,` komt voor in `meta.title` van case_studies (regel 1580)
  - "suggested replies", "drag & drop", "AI-brein" , onnodige Engelse termen
  - "uw" duikt op in `multi_platform` en `demo.concierge` , inconsistent met je-vorm

## Issues

### chatbots.meta.title
**Issue type**: Anglicisme / glossary
**Current**: "AI Chatbot Oplossingen | Future Marketing AI"
**Problem**: "Oplossingen" is vage corporate-taal, "AI Chatbot" is een los product terwijl chatbots bij FMai onderdeel zijn van Clyde (vaardigheid).
**Proposed**: "AI-chatbots voor bureaus | Future Marketing AI"

### chatbots.meta.description
**Issue type**: Dunglish / stijl
**Current**: "Op maat gemaakte AI chatbots die klantenservice afhandelen, leads kwalificeren en afspraken boeken 24/7."
**Problem**: "24/7" hoort niet als staart-woord in een Nederlandse zin; "op maat gemaakte" is correct maar "afhandelen" combineert onhandig met "klantenservice".
**Proposed**: "AI-chatbots op maat die 24/7 klantvragen beantwoorden, leads kwalificeren en afspraken inplannen."

### chatbots.hero.title
**Issue type**: Title Case / anglicisme
**Current**: "Ervaar AI Chatbots in Actie"
**Problem**: Hoofdletters per woord is Engelse conventie. In Nederlands alleen eerste woord en eigennamen.
**Proposed**: "Zie AI-chatbots in actie"

### chatbots.hero.description
**Issue type**: Dunglish / woordvolgorde
**Current**: "Probeer ze zelf. Drie live demos die laten zien wat AI chatbots voor jouw bureau kunnen doen."
**Problem**: "Probeer ze zelf" is stug; "live demos" prima maar de tweede zin mag natuurlijker.
**Proposed**: "Probeer het zelf. Drie live demo's die laten zien wat AI-chatbots voor jouw bureau betekenen."

### chatbots.hero.cta_primary
**Issue type**: Title Case / stijl
**Current**: "Probeer een Demo Hieronder"
**Problem**: Hoofdletters, en "hieronder" is overbodig als het op dezelfde pagina staat.
**Proposed**: "Probeer een demo"

### chatbots.hero.cta_secondary
**Issue type**: Title Case
**Current**: "Vraag een Gratis Strategiesessie Aan"
**Proposed**: "Vraag een gratis strategiesessie aan"

### chatbots.quick_answer
**Issue type**: Dunglish / onhandige opsomming
**Current**: "AI Chatbots van Future Marketing AI zijn conversatie-agents geconfigureerd naar jouw merkpersoonlijkheid. Leads kwalificeren, vragen beantwoorden en demos boeken 24/7."
**Problem**: "conversatie-agents geconfigureerd naar" is letterlijk vertaald ("configured to"); tweede zin mist onderwerp/hoofdzin-structuur.
**Proposed**: "De AI-chatbots van Future Marketing AI zijn conversatie-agents die de toon van jouw merk overnemen. Ze kwalificeren leads, beantwoorden vragen en boeken demo's. 24/7."

### chatbots.sections.use_cases_heading
**Issue type**: Title Case
**Current**: "Wat Kan een AI Chatbot voor Jouw Bureau Doen?"
**Proposed**: "Wat kan een AI-chatbot voor jouw bureau doen?"

### chatbots.sections.process_heading
**Issue type**: Title Case
**Current**: "Hoe Wordt een Chatbot Ingezet?"
**Proposed**: "Hoe zetten we een chatbot in?"

### chatbots.sections.faq_heading
**Issue type**: Title Case
**Current**: "Veelgestelde Vragen"
**Proposed**: "Veelgestelde vragen"

### chatbots.sections.related_heading
**Issue type**: Title Case
**Current**: "Gerelateerde Diensten"
**Proposed**: "Gerelateerde vaardigheden"
**Note**: "Diensten" voelt los; deze pagina's zijn vaardigheden van Clyde.

### chatbots.sections.pricing_heading
**Issue type**: Title Case
**Current**: "Chatbot Pakketten"
**Proposed**: "Chatbot-pakketten"

### chatbots.sections.pricing_subtitle
**Issue type**: Dunglish / spatiekoppeling
**Current**: "Gateway prijzen. Een abonnement, volledige AI-stack"
**Problem**: "Gateway prijzen" is losse samenstelling (moet aan elkaar of met streepje); "AI-stack" is erg technisch voor marketing-context.
**Proposed**: "Instapprijzen. Eén abonnement, volledige AI-medewerker."

### chatbots.sections.multi_platform_heading
**Issue type**: Title Case
**Current**: "Multi-Platform Integratie"
**Proposed**: "Multi-platform integratie"

### chatbots.use_cases.title
**Issue type**: Title Case / glossary
**Current**: "Wat Onze Chatbots Doen"
**Proposed**: "Wat onze chatbots doen"

### chatbots.use_cases.items.lead_qualification.description
**Issue type**: Werkwoordsvervoeging / Dunglish
**Current**: "Score en routeer leads dag en nacht."
**Problem**: "Score" is Engelse imperatief; Nederlands: "Scoor". Losse opdrachtzinnen voelen als direct vertaalde UI-copy.
**Proposed**: "Leads worden dag en nacht gescoord en doorgestuurd."

### chatbots.use_cases.items.appointment_booking.description
**Issue type**: Anglicisme
**Current**: "Vul je agenda zonder handmatig heen-en-weer."
**Problem**: "handmatig heen-en-weer" is letterlijk vertaald uit "back-and-forth"; klinkt krakkemikkig.
**Proposed**: "Vul je agenda zonder handmatig heen-en-weer-gemail."

### chatbots.use_cases.items.faq_automation.title
**Issue type**: Anglicisme
**Current**: "FAQ Automatisering"
**Proposed**: "FAQ-automatisering"

### chatbots.demo.tabs.ecommerce.scenario
**Issue type**: Dunglish / woordvolgorde
**Current**: "Zie hoe je AI-medewerker een nieuwe klant leert kennen. Merkrichtlijnen, tone of voice en doelgroep worden ingevoerd om binnen uren on-brand content te produceren."
**Problem**: "om binnen uren on-brand content te produceren" is letterlijk vertaald; "on-brand" is jargon zonder NL-equivalent maar "in de juiste merkstijl" werkt beter.
**Proposed**: "Zie hoe je AI-medewerker een nieuw merk leert kennen. Merkrichtlijnen, tone of voice en doelgroep gaan erin; binnen enkele uren rolt er content uit die bij het merk past."

### chatbots.demo.tabs.leadgen.scenario
**Issue type**: Anglicisme / onnatuurlijk
**Current**: "Bekijk hoe de Content Creator skill een blogpost maakt voor een bureau-klant. Van onderzoek tot SEO-geoptimaliseerd concept, gepubliceerd op alle platforms."
**Problem**: "skill" in running copy; "bureau-klant" is ambigue (klant van bureau = merk).
**Proposed**: "Bekijk hoe de Content Creator-vaardigheid een blogpost maakt voor een merk uit jouw portfolio. Van research tot SEO-geoptimaliseerd concept, gepubliceerd op alle kanalen."

### chatbots.demo.tabs.support.scenario
**Issue type**: Dunglish
**Current**: "Bereken hoeveel je bureau bespaart met een AI Marketing Medewerker. Vergelijk wervingskosten, bespaarde uren en klantcapaciteit."
**Problem**: "wervingskosten" is OK maar "recruitment cost" zou hier bedoeld kunnen zijn; overall natuurlijk, kleine tweak voor ritme.
**Proposed**: "Bereken wat je bureau bespaart met een AI Marketing Medewerker. Vergelijk wervingskosten, uren-besparing en extra klantcapaciteit."

### chatbots.demo.tabs.concierge.scenario
**Issue type**: U-vorm (inconsistent met je-vorm)
**Current**: "Maak kennis met de FutureMarketingAI Concierge. Een hybride rondleider en verkoopmedewerker. Vraag naar diensten, prijzen of hoe AI-marketing uw bureau kan transformeren."
**Problem**: "uw" waar elders "je/jouw" wordt gebruikt; "transformeren" is cliché.
**Proposed**: "Maak kennis met de FutureMarketingAI Concierge, een hybride rondleider en salesmedewerker. Vraag naar diensten, prijzen of hoe AI-marketing jouw bureau verandert."

### chatbots.faq.items.q1.answer
**Issue type**: Onvolledig / te kort
**Current**: "AI chatbots gebruiken grote taalmodellen om intentie te begrijpen en contextuele antwoorden te genereren."
**Problem**: Stopt voordat het antwoord echt geleverd is , vraag vergelijkt juist met regelgebaseerd.
**Proposed**: "AI-chatbots gebruiken grote taalmodellen om intentie te begrijpen en context-afhankelijke antwoorden te geven. Regelgebaseerde bots volgen vaste scripts; AI-chatbots begrijpen variaties in taal en handelen daar flexibel op."

### chatbots.faq.items.q2.answer
**Issue type**: Anglicisme
**Current**: "Ja. Onze Chatbots-pagina bevat een live demo playground met 3 voorgeconfigureerde personas."
**Problem**: "playground" en "personas" , beide hebben goede NL-equivalenten.
**Proposed**: "Ja. Onze Chatbots-pagina bevat een live speeltuin met drie voorbeeld-persona's."

### chatbots.faq.items.q3.answer
**Issue type**: Dunglish / stijl
**Current**: "Elke chatbot ontvangt een systeemprompt, toonrichtlijnen, kennisbankdocumenten en voorbeeldgesprekken."
**Problem**: "ontvangt" is letterlijk "receives"; Nederlands zegt "krijgt".
**Proposed**: "Elke chatbot krijgt een systeemprompt, tone-of-voice-richtlijnen, kennisbankdocumenten en voorbeeldgesprekken."

### chatbots.faq.items.q4.answer
**Issue type**: OK (prima)
**Current**: "Ja. Leads worden direct doorgestuurd naar HubSpot, Salesforce of jouw CRM via webhook."
**Note**: "via webhook" achteraan is acceptabel, geen issue.

### chatbots.faq.items.q6.answer
**Issue type**: Stijl / technische term
**Current**: "Ja. Alle gespreksdata wordt verwerkt binnen EU-datacenters en wij bieden een verwerkersovereenkomst op aanvraag."
**Proposed**: "Ja. Alle gespreksdata wordt binnen EU-datacenters verwerkt en we bieden op aanvraag een verwerkersovereenkomst."

### chatbots.related.automations_title
**Issue type**: Anglicisme (onnodig Engels)
**Current**: "AI Automations"
**Proposed**: "AI-automatiseringen"

### chatbots.related.automations_description
**Issue type**: Anglicisme
**Current**: "Custom workflow automatisering die jouw tools en processen verbindt"
**Problem**: "Custom" waar "Op maat" gewoon kan.
**Proposed**: "Workflow-automatisering op maat die jouw tools en processen verbindt."

### chatbots.related.voice_agents_description
**Issue type**: Anglicisme / glossary
**Current**: "AI voice agents die inkomende en uitgaande gesprekken op schaal afhandelen"
**Problem**: "op schaal" is letterlijke vertaling ("at scale").
**Proposed**: "AI-voice-agents die inkomende en uitgaande gesprekken in grote volumes afhandelen."

### chatbots.related.marketing_machine_description
**Issue type**: Stijl
**Current**: "Autonome contentcreatie, planning en campagne-automatisering"
**Proposed**: "Autonome content-creatie, planning en campagne-automatisering."

### chatbots.process.title
**Issue type**: Stijl
**Current**: "Hoe Wij Bouwen"
**Proposed**: "Hoe wij bouwen"

### chatbots.process.steps.discovery.title
**Issue type**: Anglicisme (onnodig)
**Current**: "Discovery"
**Proposed**: "Kennismaking" of "Inventarisatie"

### chatbots.process.steps.discovery.description
**Issue type**: Dunglish
**Current**: "Wij brengen je use case in kaart en plannen integratie met je bestaande tools."
**Problem**: "use case" is hier acceptabel maar "plannen integratie met" is krakkemikkig.
**Proposed**: "We brengen je use case in kaart en plannen de integratie met je bestaande tools."

### chatbots.process.steps.build.description
**Issue type**: Title Case / stijl
**Current**: "Op maat gemaakte LLM-chatbot, getraind op jouw data."
**Proposed**: "Een op maat gemaakte LLM-chatbot, getraind op jouw data."

### chatbots.cta.title
**Issue type**: Title Case / Dunglish
**Current**: "Klaar voor 24/7 Klantbetrokkenheid?"
**Problem**: "Klantbetrokkenheid" is directe vertaling van "customer engagement" en zegt weinig.
**Proposed**: "Klaar voor klantcontact dat nooit stopt?"

### chatbots.cta.button
**Issue type**: Title Case
**Current**: "Vraag een Gratis Strategiesessie Aan"
**Proposed**: "Vraag een gratis strategiesessie aan"

### chatbots.multi_platform.title
**Issue type**: Dunglish / onhandige metafoor
**Current**: "Een Brein, Elk Kanaal"
**Problem**: "Een Brein" is letterlijk "One Brain" , werkt niet in NL-marketing-register.
**Proposed**: "Eén AI-medewerker, alle kanalen"

### chatbots.multi_platform.subtitle
**Issue type**: U-vorm / anglicisme
**Current**: "Een enkel AI-model bestuurt uw chatbot op alle platformen. Consistente merkstem, gedeelde kennis, uniforme analytics."
**Problem**: "Een enkel" is vertaling van "A single"; "uw" inconsistent; "analytics" onnodig Engels hier.
**Proposed**: "Eén AI-model stuurt jouw chatbot aan op alle kanalen. Consistente merkstem, gedeelde kennis, uniforme rapportage."

### chatbots.multi_platform.brain_label
**Issue type**: Stijl
**Current**: "Claude AI"
**Note**: Productnaam, geen issue.

### chatbots.multi_platform.platforms.website.behavior
**Issue type**: Anglicisme
**Current**: "Ingebedde chat met volledige productkennis en leadcapture"
**Problem**: "leadcapture" is onnodig Engels.
**Proposed**: "Ingebedde chat met volledige productkennis en directe leadregistratie."

### chatbots.multi_platform.platforms.shopify.behavior
**Issue type**: Dunglish
**Current**: "Productaanbevelingen, ordertracking en verlaten winkelwagen herstel"
**Problem**: "verlaten winkelwagen herstel" is een los substantief zonder lijm; in NL hoort dit met streepjes of omschreven.
**Proposed**: "Productaanbevelingen, order-tracking en herinneringen voor verlaten winkelwagens."

### chatbots.multi_platform.platforms.whatsapp.behavior
**Issue type**: Anglicisme (veel)
**Current**: "Conversational commerce met rich media en snelle antwoorden"
**Problem**: "Conversational commerce" en "rich media" , beide onnodig Engels of uitlegbaar.
**Proposed**: "Verkoop via chat met rijke media en snelle antwoorden."

### chatbots.multi_platform.case_study
**Issue type**: Stijl
**Current**: "Al live: SkinClarity Club draait hetzelfde AI-brein over website, Shopify en WhatsApp. Zonder contextverlies tussen kanalen."
**Problem**: "AI-brein" werkt hier beter vervangen door de glossary-term.
**Proposed**: "Al live: SkinClarity Club draait dezelfde AI-medewerker over website, Shopify en WhatsApp, zonder contextverlies tussen kanalen."

### chatbots.trust_metrics.title
**Issue type**: Title Case
**Current**: "Vertrouwd door Groeiende Bedrijven"
**Proposed**: "Vertrouwd door groeiende bedrijven"

### chatbot.disclosure.notice
**Issue type**: OK
**Current**: "Ik ben een AI-assistent"
**Note**: Geen issue.

---

### blog.title
**Issue type**: Stijl / ampersand
**Current**: "AI Marketing & Automatisering Inzichten"
**Problem**: "&" in running title is Engelse conventie; volgorde leest als vertaalde samenstelling ("AI marketing & automation insights").
**Proposed**: "Inzichten in AI-marketing en automatisering"

### blog.subtitle
**Issue type**: Ontbrekend trema / stijl
**Current**: "Inzichten over AI marketing automatisering, chatbots en groeistrategieen voor bureaus."
**Problem**: "groeistrategieen" moet "groeistrategieën" zijn (trema); "AI marketing automatisering" is drie losse samenstellingen zonder streepjes.
**Proposed**: "Inzichten over AI-marketingautomatisering, chatbots en groeistrategieën voor bureaus."

### blog.noPosts
**Issue type**: OK
**Current**: "Geen artikelen gevonden."
**Note**: Geen issue.

### blog.noPostsInCategory
**Issue type**: OK
**Current**: "Geen artikelen in deze categorie."
**Note**: Geen issue.

---

### case_studies.skc.meta.title
**Issue type**: Leesteken (komma waar streepje hoort) + em-dash-regel
**Current**: "SkinClarity Club , 3 accounts × 4 merken × 1 AI-medewerker | FutureMarketingAI"
**Problem**: Losse komma na "Club" zonder context; oorspronkelijk em-dash vervangen door ", " is visueel rommelig. Beter: pipe of dubbele punt.
**Proposed**: "SkinClarity Club: 3 accounts, 4 merken, 1 AI-medewerker | FutureMarketingAI"

### case_studies.skc.meta.description
**Issue type**: Title Case in running copy / stijl
**Current**: "Case study: hoe Clyde de volledige social media operatie van SkinClarity Club autonoom runt over 3 Instagram-accounts en 4 merken. Founding partner sinds launch."
**Problem**: "social media operatie" moet gekoppeld; "Founding partner sinds launch" is Engelse zin (werkwoordloos, directe vertaling).
**Proposed**: "Case study: hoe Clyde de volledige social-media-operatie van SkinClarity Club autonoom draait over 3 Instagram-accounts en 4 merken. Founding partner vanaf de lancering."

### case_studies.skc.hero.eyebrow
**Issue type**: OK
**Current**: "Case study. Founding partner"
**Note**: Compact, prima.

### case_studies.skc.hero.title
**Issue type**: OK
**Current**: "3 accounts. 4 merken. Eén AI-medewerker."
**Note**: Sterke zin, geen issue.

### case_studies.skc.hero.subtitle
**Issue type**: Anglicisme / woordvolgorde
**Current**: "SkinClarity Club is sinds de eerste week Founding klant. Clyde beheert 3 Instagram-accounts, 4 merken en meerdere content-types. Autonoom, elke dag, zonder dat het team er omkijken naar heeft."
**Problem**: "Founding klant" (mix NL/EN); "er omkijken naar heeft" is correct Nederlands maar "omkijken naar" met "er heeft" voelt ouderwets; "content-types" is glossary-vreemd.
**Proposed**: "SkinClarity Club is sinds de eerste week founding partner. Clyde beheert 3 Instagram-accounts, 4 merken en meerdere contentvormen. Autonoom, elke dag, zonder dat het team er nog omkijken naar heeft."

### case_studies.skc.setup.subtitle
**Issue type**: Dunglish / Engelse samenstelling
**Current**: "SkinClarity Club draait een portfolio aan huidspecialisten en product-merken. Drie Instagram-accounts met elk hun eigen doelgroep en brandstyle."
**Problem**: "brandstyle" is niet-bestaand in NL; ofwel "merkstijl" ofwel "brand style" (los).
**Proposed**: "SkinClarity Club heeft een portfolio met huidspecialisten en productmerken. Drie Instagram-accounts, elk met een eigen doelgroep en merkstijl."

### case_studies.skc.setup.account2Body
**Issue type**: Anglicisme
**Current**: "Persoonlijke autoriteit-account van founder Sindy. Vertrouwen, expertise, personal branding."
**Problem**: "founder" en "personal branding" , founder is acceptabel als jargon, maar "personal branding" kan beter beschreven.
**Proposed**: "Persoonlijk autoriteits-account van founder Sindy. Vertrouwen, expertise, personal brand."
**Note**: "personal branding" > "personal brand" voegt niet veel toe; desnoods "persoonlijk merk".

### case_studies.skc.setup.account3Body
**Issue type**: Stijl / samenstelling
**Current**: "Product-account voor de webshop. Launches, bundels, product-content."
**Problem**: "Launches" is Engels waar "lanceringen" gewoon kan.
**Proposed**: "Productaccount voor de webshop. Lanceringen, bundels, productcontent."

### case_studies.skc.skills.subtitle
**Issue type**: Stijl (lichte Dunglish)
**Current**: "Van de 12 Clyde-vaardigheden zijn er 6 actief voor SKC. De rest draait op de achtergrond, beschikbaar wanneer de business dat vraagt."
**Problem**: "de business" is letterlijke vertaling van "the business"; in NL zeg je "wanneer dat nodig is".
**Proposed**: "Van de 12 Clyde-vaardigheden zijn er 6 actief voor SKC. De rest staat klaar op de achtergrond, voor wanneer de business dat vraagt."
**Note**: Als "de business" als bedrijfsjargon acceptabel is in je target group: laten staan. Anders alternatief: "voor wanneer dat nodig is".

### case_studies.skc.skills.skill1Body
**Issue type**: Anglicisme
**Current**: "Carrousels, posts, stories op 3 IG-accounts. AI-gegenereerd in de juiste brand voice per account."
**Problem**: "brand voice" is acceptabel jargon; geen issue. "IG-accounts" is afkorting die ok is voor dit publiek.
**Note**: Prima zoals het is.

### case_studies.skc.skills.skill3Body
**Issue type**: Stijl
**Current**: "Technische SEO-audits + keyword tracking + AI citation monitoring (ChatGPT, Perplexity)."
**Problem**: "+ plussen" is UI-shorthand, niet natuurlijk in een bodytekst.
**Proposed**: "Technische SEO-audits, keyword-tracking en AI-citation-monitoring (ChatGPT, Perplexity)."

### case_studies.skc.skills.skill4Body
**Issue type**: Anglicisme
**Current**: "Wekelijkse performance digest over Instagram + Shopify + SEO data. Anomaly alerts."
**Problem**: "Anomaly alerts" is letterlijk Engels; "performance digest" acceptabel jargon.
**Proposed**: "Wekelijkse performance-digest over Instagram-, Shopify- en SEO-data. Waarschuwingen bij uitschieters."

### case_studies.skc.skills.skill5Body
**Issue type**: OK
**Current**: "Trend monitoring in huidverzorging, concurrentie-analyse, content-ideeën met bronvermelding."
**Note**: Geen issue.

### case_studies.skc.skills.skill6Body
**Issue type**: Dunglish
**Current**: "Centrale AI-medewerker die de 5 skills aan elkaar knoopt. Geheugen per account + cross-skill learning."
**Problem**: "skills" in copy (glossary zegt "vaardigheden"); "cross-skill learning" is technisch jargon.
**Proposed**: "Centrale AI-medewerker die de 5 vaardigheden aan elkaar knoopt. Geheugen per account en leren over vaardigheden heen."

### case_studies.skc.architecture.subtitle
**Issue type**: Dunglish
**Current**: "Eén Clyde, 3 workspace-namespaces (per account), gedeeld portfolio-geheugen. Content-goedkeuring via Sindy voordat publicatie."
**Problem**: "voordat publicatie" is fout Nederlands (subordinating conj zonder werkwoord); moet "vóór publicatie" of "voordat er gepubliceerd wordt".
**Proposed**: "Eén Clyde, 3 workspace-namespaces (per account), gedeeld portfolio-geheugen. Content wordt door Sindy goedgekeurd vóór publicatie."

### case_studies.skc.architecture.body
**Issue type**: Spelfout / Dunglish
**Current**: "Clyde houdt een apart geheugen bij per Instagram-account. Wat werkt op @SkinClarityClub (educatief, tips) is anders dan op @Sindy_Huidtherapeut (persoonlijk, authoriteit). Cross-account learning vindt plaats op portfolio-niveau. Bijvoorbeeld: een succesvol thema op shop kan geadapteerd worden naar het hoofd-account."
**Problem**: "authoriteit" moet "autoriteit" (spelfout); "Cross-account learning" en "geadapteerd worden" zijn beide Dunglish.
**Proposed**: "Clyde houdt een apart geheugen bij per Instagram-account. Wat werkt op @SkinClarityClub (educatief, tips) is anders dan op @Sindy_Huidtherapeut (persoonlijk, autoriteit). Leren over accounts heen gebeurt op portfolio-niveau. Voorbeeld: een succesvol thema op de shop kan worden aangepast naar het hoofdaccount."

### case_studies.skc.timeline.month1Body
**Issue type**: Stijl
**Current**: "Eerste volledige content-week autonoom. Veel feedback, Clyde kalibreert."
**Note**: Telegrafisch maar werkt, geen harde fout.

### case_studies.skc.timeline.month3Body
**Issue type**: Anglicisme
**Current**: "Approval-tijd per post daalt van 4 min naar 30 sec. Clyde kent de micro-tics."
**Problem**: "Approval-tijd" is half-vertaald; "micro-tics" is grappig maar obscuur.
**Proposed**: "Goedkeuringstijd per post daalt van 4 min naar 30 sec. Clyde kent de kleine voorkeuren."

### case_studies.skc.timeline.nowBody
**Issue type**: OK
**Current**: "Volledig autonoom over 3 accounts, 4 merken. Sindy reviewt, Clyde voert uit."
**Note**: "reviewt" is acceptabel jargon.

### case_studies.skc.testimonial.quote
**Issue type**: Stijl (kleine verbetering)
**Current**: "Clyde beheert onze volledige social content-operatie over 3 Instagram-accounts en 4 merken. Wat eerst een hele middag per week kostte, draait nu autonoom in de achtergrond. Ik review, Clyde voert uit."
**Problem**: "social content-operatie" mist streepje; "in de achtergrond" moet "op de achtergrond".
**Proposed**: "Clyde beheert onze volledige social-content-operatie over 3 Instagram-accounts en 4 merken. Wat eerst een hele middag per week kostte, draait nu autonoom op de achtergrond. Ik review, Clyde voert uit."

### case_studies.skc.cta.subtitle
**Issue type**: OK
**Current**: "Plan een gesprek. We bespreken hoe Clyde past bij jouw merken en klanten."
**Note**: Hier is "klanten" prima want het verwijst naar de bureau-klanten die op hun beurt merken aansturen. Laat staan.

## Aanbevelingen (kort)

1. **Global pass op Title Case in headings** , alle `title`, `sections.*_heading`, `cta.title`, `use_cases.title` velden lopen fout. Eén find/replace-ronde per heading-veld lost het grootste deel op.
2. **Glossary-audit**: `skill` , `vaardigheid`; `brain` , `AI-medewerker`; `launches` , `lanceringen`; `personas` , `persona's`; `playground` , `speeltuin`.
3. **U/je inconsistentie**: `chatbots.demo.tabs.concierge.scenario` en `chatbots.multi_platform.subtitle` gebruiken "uw" , overal je/jouw consistent maken.
4. **Samenstellingen zonder streepje**: "social media operatie", "performance digest", "brand voice" , in het Nederlands streepjes of aan elkaar (social-media-operatie).
5. **Spelfouten**: `groeistrategieen` , `groeistrategieën` (blog.subtitle); `authoriteit` , `autoriteit` (case_studies.skc.architecture.body).
6. **Em-dash-regel**: `case_studies.skc.meta.title` heeft een rare losse komma , vervangen door dubbele punt.
