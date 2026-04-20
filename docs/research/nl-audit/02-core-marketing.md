# NL Audit — About / How-it-works / Contact / Pricing / Founding-member / Apply / Memory

## Summary

- Total keys reviewed: ~280 (7 namespaces: about ~35 keys, pricing ~90, how-it-works ~20, contact ~20, founding-member ~30, memory ~30, apply ~45)
- Issues found: 57
- Severity breakdown: 14 critical, 27 moderate, 16 minor

**Hoofdbevindingen:**
1. Systematisch gebruik van Engelstalige termen die prima Nederlandse equivalenten hebben: "unlimited", "features", "workspaces", "Sign-up", "skills", "caps", "review", "campaign", "committeren".
2. Glossary-violaties (kritiek): meermaals "klanten" gebruikt voor eindklanten van bureaus (moet "merken/klantportfolio" zijn), "AI-tool" gebruikt waar verboden, "unlimited" zonder onderbouwing.
3. Typografie: verschillende keys gebruiken komma "," waar duidelijk een em-dash of dubbele punt bedoeld is (pricing.meta.title, pricing.matrix.notAvailable, apply.form.tierOptions.growth, etc.). Dit is een eerder beleid om em-dashes te vervangen, maar levert grammaticaal onleesbare zinnen op.
4. Dunglish constructies: "pro-rated facturering", "prioriteit krijgen", "early-adopter bureaus", "forced upgrade", "set-and-forget".
5. Grammatica: "coordineren" zonder trema ("coördineren"), "creert" ("creëert"), "beeindiging" ("beëindiging"), "toestemming" gevolgd door passive phrasing.

---

## Issues

### about.timeline.eras.assisted.description
**Issue type**: Dunglish + grammatica (ontbrekend trema)
**Current**: "Bureaus adopteerden ChatGPT en AI-tools voor snellere content, maar hadden nog steeds mensen nodig om alles te coordineren."
**Problem**: "adopteerden" is een anglicisme (to adopt → adopteren). "Coordineren" mist trema (moet "coördineren"). "AI-tools" overtreedt glossary. "Nog steeds" is letterlijke vertaling van "still".
**Proposed**: "Bureaus omarmden ChatGPT en AI-hulpmiddelen voor snellere content, maar hielden nog mensen nodig om alles te coördineren."

### about.timeline.eras.autonomous.description
**Issue type**: Dunglish
**Current**: "Persistente AI-agents die volledige workflows autonoom uitvoeren. Dit is waar early-adopter bureaus een onoverbrugbaar voordeel opbouwen."
**Problem**: "Dit is waar" is een letterlijke vertaling van "This is where". "Early-adopter" blijft onvertaald zonder reden.
**Proposed**: "Persistente AI-agents die volledige workflows autonoom uitvoeren. In deze periode bouwen vroege adopters een onoverbrugbaar voordeel op."

### about.timeline.eras.standard.description
**Issue type**: Dunglish + letterlijke vertaling
**Current**: "Elk bureau heeft AI-medewerkers. Bureaus die vroeg begonnen hebben 2-3 jaar samengestelde AI-learnings."
**Problem**: "Samengestelde AI-learnings" is directe vertaling van "compounded AI learnings". Klinkt robotisch.
**Proposed**: "Elk bureau heeft AI-medewerkers. Bureaus die vroeg begonnen, hebben 2 tot 3 jaar opgebouwde AI-ervaring als voorsprong."

### about.timeline.key_message.title
**Issue type**: Dunglish
**Current**: "Early-adopter bureaus bouwen een 2-3 jaar concurrentievoordeel op"
**Problem**: "Early-adopter" is Engelse jargonterm waar geen noodzaak voor is.
**Proposed**: "Vroege adopters bouwen een concurrentievoordeel van 2 tot 3 jaar op"

### about.timeline.key_message.description
**Issue type**: Grammatica (trema) + Dunglish
**Current**: "Het samengesteld effect van AI-learning betekent dat nu beginnen een voordeel creert dat laatkomers niet kunnen inlopen."
**Problem**: "Creert" mist trema (→ "creëert"). "AI-learning" is Engels. "Samengesteld effect" is vertaalmachinale weergave van "compound effect".
**Proposed**: "Het cumulatieve effect van leren met AI betekent dat wie nu begint een voorsprong opbouwt die laatkomers niet meer inhalen."

### about.cta.description
**Issue type**: Dunglish
**Current**: "We onboarden onze eerste 10 founding member bureaus voor EUR 997/maand. Zeker je laagste prijs en help het product vormen."
**Problem**: "Onboarden" is anglicisme. "Zeker je laagste prijs" is ongrammaticaal ("zeker" hoort hier niet als werkwoord); vermoedelijk bedoeld als "secure your lowest price".
**Proposed**: "We verwelkomen onze eerste 10 founding-bureaus voor €997 per maand. Leg je laagste prijs nu vast en help het product vormen."

### about.icp.subtitle
**Issue type**: Anglicisme
**Current**: "Zelfde hybride ICP als op home, maar hier uitgebreider. We zijn bewust selectief."
**Problem**: "Home" is Engels (gebruiker ziet rare term); in NL is dat "de homepagina" of "de startpagina". "Hybride ICP" is intern jargon, voor bezoekers onverklaard.
**Proposed**: "Hetzelfde profiel als op de homepagina, hier uitgebreider toegelicht. We zijn bewust selectief."

### about.icp.fit3
**Issue type**: Dunglish
**Current**: "Founders die een partner zoeken, geen tool. Bereid workflows te herijken, niet alleen uit te voeren"
**Problem**: "Founders" is Engels. De tweede zin is elliptisch en klinkt ingekort/vertaald. "Workflows herijken" is omslachtig.
**Proposed**: "Oprichters die een partner zoeken, geen tool. Die bereid zijn werkprocessen te herzien, niet alleen uit te voeren."

### about.icp.notFit1
**Issue type**: Onhandige constructie
**Current**: "Je minder dan €300K jaaromzet hebt. Het budget past niet en we willen je groei niet in de weg staan"
**Problem**: "Je minder dan … hebt" klinkt opgeknipt en informeel-telegrafisch.
**Proposed**: "Je jaaromzet onder de €300K ligt. Het budget past niet en we willen je groei niet in de weg staan."

### about.icp.notFit3
**Issue type**: Anglicisme
**Current**: "Je op zoek bent naar set-and-forget. Clyde leert van jou, dat vereist 4 weken onboarding en blijvende input"
**Problem**: "Set-and-forget" is onvertaald Engels. "Input" is Engels (→ inbreng).
**Proposed**: "Je iets zoekt wat je instelt en vergeet. Clyde leert van jou, dat vraagt vier weken onboarding en blijvende inbreng."

### about.capacity.body
**Issue type**: Dunglish + onhandige zin
**Current**: "Dit is geen marketing-kunstje. Het is een realiteit van high-touch partnership-onboarding. Daley begeleidt elke nieuwe klant persoonlijk door 4 weken setup, waardoor er een bovengrens zit op hoe veel bureaus we tegelijkertijd kunnen verwelkomen."
**Problem**: "High-touch partnership-onboarding" is een Engelse stapeling. "Hoe veel" moet "hoeveel" zijn (één woord).
**Proposed**: "Dit is geen marketingtrucje, het is de realiteit van intensieve partner-onboarding. Daley begeleidt elke nieuwe klant persoonlijk door vier weken setup, waardoor er een bovengrens zit op hoeveel bureaus we tegelijk kunnen verwelkomen."

### about.capacity.reasoning
**Issue type**: Onhandige constructie
**Current**: "De wachtlijst schaalt mee met de vraag. Als we vol zitten, plannen we met jou een gesprek voor volgende cohort."
**Problem**: "Volgende cohort" mist lidwoord ("het/de volgende cohort"). Zinsbouw is ingekort/vertaald.
**Proposed**: "De wachtlijst schaalt mee met de vraag. Als we vol zitten, plannen we met jou een gesprek voor het volgende cohort."

### about.founder.role
**Issue type**: Typografie (komma mist punt)
**Current**: "Founder & operator. FutureMarketingAI"
**Problem**: "Founder" is Engels en wordt niet consistent gehanteerd op site. Glossary schrijft "oprichter/operator" voor.
**Proposed**: "Oprichter en operator, FutureMarketingAI"

### about.founder.bio
**Issue type**: Anglicisme + onhandige zin
**Current**: "Ik bouw FutureMarketingAI vanuit ervaring: als operator bij SkinClarity Club zag ik hoe 12 losse tools niet schaalden bij 3 IG-accounts × 4 merken. Clyde werd geboren als oplossing voor mijn eigen probleem. Elke nieuwe klant die ik aanneem is iemand waar ik persoonlijk contact mee houd. Geen CSM-laag, geen ticket-systeem voor strategische beslissingen."
**Problem**: "Niet schaalden" klinkt Engels-technisch. "Clyde werd geboren" is dramatische letterlijke vertaling van "Clyde was born". "CSM-laag" is Engels jargon.
**Proposed**: "Ik bouw FutureMarketingAI vanuit ervaring: als operator bij SkinClarity Club zag ik hoe twaalf losse tools onhoudbaar werden bij drie IG-accounts en vier merken. Clyde is ontstaan als oplossing voor mijn eigen probleem. Met elke nieuwe klant onderhoud ik persoonlijk contact. Geen laag customer success managers, geen ticketsysteem voor strategische beslissingen."

---

### pricing.meta.title
**Issue type**: Typografie (komma waar leesteken hoort)
**Current**: "Pricing , 5 tiers. Transparant. Van Partner €347 tot Enterprise €7.997 | FutureMarketingAI"
**Problem**: "Pricing ," met spatie-komma-spatie is onleesbaar en typografisch fout. Komma is gebruikt als em-dash-vervanger en gaat mis. "Pricing" is Engels; glossary wil Nederlands.
**Proposed**: "Prijzen: 5 tiers, volledig transparant. Van Partner €347 tot Enterprise €7.997 | FutureMarketingAI"

### pricing.meta.description
**Issue type**: Typografie + Dunglish
**Current**: "Premium AI marketing partnership , 5 tiers met skill-caps, credit-allocatie en add-on packs. Geen verborgen kosten, geen self-service. Max 20 bureaus per jaar."
**Problem**: Dezelfde "spatie-komma-spatie" fout. "Skill-caps", "add-on packs", "self-service" zijn onvertaald. "Credit-allocatie" leesbaar.
**Proposed**: "Premium AI-marketingpartnership: 5 tiers met vaardigheids-limieten, creditverdeling en aanvullende pakketten. Geen verborgen kosten, geen self-aanmelding. Maximaal 20 bureaus per jaar."

### pricing.hero.title
**Issue type**: Dunglish
**Current**: "Premium partnerships. 5 tiers. Transparant."
**Problem**: "Partnerships" is Engels. Acceptabel als productterm, maar kan naar "partnerschappen".
**Proposed**: "Premium partnerschappen. 5 tiers. Transparant."

### pricing.hero.description
**Issue type**: Dunglish + Engelstalige termen
**Current**: "Alle prijzen zichtbaar. 5 tiers voor iedere portfolio-grootte. Van solo operator tot enterprise. Skill-gating eerlijk uitgelegd, geen verborgen kosten, geen contact-us-voor-pricing."
**Problem**: "Solo operator", "enterprise", "skill-gating", "contact-us-voor-pricing" zijn allemaal Engels en klinken als Slack-taal. Niet voor klant-gericht Nederlands.
**Proposed**: "Alle prijzen zichtbaar. 5 tiers voor elke portfolio-grootte, van zelfstandige tot enterprise. Eerlijke uitleg over welke vaardigheden in welke tier zitten, geen verborgen kosten, geen 'vraag naar de prijs'."

### pricing.visibility.body
**Issue type**: Dunglish
**Current**: "Bij premium AI partners zien we vaak \"Contact us for pricing\". Dat ondermijnt de relatie voordat die begint. Wij laten liever zien wat Clyde kost, wat je krijgt en welke caps er zijn, zodat jij zelf kunt inschatten of de investering past. Geen sales dans nodig."
**Problem**: "Sales dans" is letterlijke vertaling van "sales dance", bestaat niet in NL. "Caps" is Engels.
**Proposed**: "Bij premium AI-partners zien we vaak 'Contact us for pricing'. Dat ondermijnt de relatie voordat die begint. Wij laten liever zien wat Clyde kost, wat je krijgt en welke limieten er gelden, zodat je zelf kunt inschatten of de investering past. Geen verkoopspel nodig."

### pricing.onboardingLabel / pricing.creditsLabel / pricing.workspacesLabel
**Issue type**: Engelstalige termen (meermaals in tiers)
**Current**: "Eenmalig onboarding" / "credits/mo" / "werkruimtes"
**Problem**: "Mo" is afgekorte Engelse "month" (onjuist in NL, moet "mnd" of "/maand"). "Werkruimtes" is goed. "Onboarding" blijft Engels.
**Proposed**: "Eenmalige onboarding" / "credits/mnd" / behoud "werkruimtes"

### pricing.tiers.partner.subtitle / growth.subtitle / professional.subtitle / enterprise.subtitle
**Issue type**: Engelstalige termen
**Current**: "Voor solo operators" / "Voor kleine bureaus" / "Voor middelgrote bureaus" / "Voor grote bureaus"
**Problem**: "Solo operators" is Engels.
**Proposed partner.subtitle**: "Voor zelfstandige operators"

### pricing.tiers.partner.tagline
**Issue type**: Dunglish (Engelse structuur)
**Current**: "1 workspace. 8 skills included + 2 add-on paden. Geen Voice/Video/Reel."
**Problem**: "Workspace", "skills included", "add-on paden" zijn anglicismen. "Paden" is verwarrende vertaling van "paths".
**Proposed**: "1 werkruimte, 8 vaardigheden inbegrepen + 2 via add-on. Geen Voice, Video of Reels."

### pricing.tiers.partner.description
**Issue type**: Dunglish
**Current**: "Het instap-tier voor solo marketing operators die Clyde willen gebruiken voor één eigen praktijk of één klant. Lage instap, beperkte caps. Perfect om het partnership-model te proeven zonder grote commitment."
**Problem**: "Caps", "commitment", "solo marketing operators" zijn Engels. "Proeven zonder grote commitment" is letterlijk Engels idioom.
**Proposed**: "Het instap-tier voor zelfstandige marketingoperators die Clyde willen inzetten voor één eigen praktijk of één merk. Lage drempel, beperkte limieten. Perfect om het partnerschapsmodel te verkennen zonder grote verplichting."

### pricing.tiers.partner.features_2 / _3 / _4 / _5 / _7
**Issue type**: Glossary-violatie (klanten voor eindklanten? hier is context onduidelijk), Engelstalig
**Current**: "Social Media, Blog Factory, Lead Qualifier" / "SEO/GEO, Reporting, Research" / "Clyde AI Employee (orchestrator)" / "Email Management (5/mo inbox classify)" / "ManyChat DM via add-on (€47 → 300/mo)"
**Problem**: "Mo" moet "/mnd". "AI Employee" is Engels. "Inbox classify" is Engels (→ "inbox-classificatie"). Skill-namen mogen Engels blijven als productnaam, maar de omschrijvingen niet.
**Proposed**: Gebruik "/mnd", "Clyde AI-medewerker (orchestrator)", "Email Management (5/mnd inbox-classificatie)".

### pricing.tiers.growth.description
**Issue type**: Dunglish
**Current**: "Voor bureaus met 1-5 klanten die Clyde als hele marketing-medewerker willen inzetten. Alle 12 skills beschikbaar met tier-caps op de duurdere (voice, video, reels)."
**Problem**: Glossary: "klanten" moet "merken"/"klantportfolio" worden bij verwijzing naar bureau-eindklanten. "Skills" en "tier-caps" zijn Engels.
**Proposed**: "Voor bureaus met 1 tot 5 merken in portfolio die Clyde als volwaardige marketingmedewerker willen inzetten. Alle 12 vaardigheden beschikbaar, met limieten per tier op de duurdere (voice, video, reels)."

### pricing.tiers.growth.features_3 t/m _7
**Issue type**: Engelstalige termen
**Current**: "Blog Factory: 8/mo" / "Static ads: 15/mo. Video ads: 4/mo" / "Reel Builder: 4/mo" / "Voice Agent: 30 min/mo" / "ManyChat DM: 200 DMs/mo"
**Problem**: "/mo" moet "/mnd" (consistentie NL).
**Proposed**: vervang alle "/mo" door "/mnd" in de hele pricing-namespace.

### pricing.tiers.professional.description
**Issue type**: Dunglish + glossary-violatie
**Current**: "Voor bureaus met 5-15 klanten die serieus draaien op Clyde. Ruimere caps, Slack-access tot Daley, maandelijkse strategie-call."
**Problem**: "Klanten" (glossary: merken). "Caps", "Slack-access" Engels. "Serieus draaien op Clyde" is Dunglish voor "seriously running on Clyde".
**Proposed**: "Voor bureaus met 5 tot 15 merken in portfolio die volledig op Clyde leunen. Ruimere limieten, Slack-toegang tot Daley, maandelijkse strategiegesprek."

### pricing.tiers.enterprise.description
**Issue type**: Glossary-violatie
**Current**: "Voor bureaus met 15+ klanten die Clyde als core infrastructuur gebruiken. White-label, API-toegang, dedicated customer success manager met SLA."
**Problem**: "Klanten" → merken. "Core infrastructuur" Engels. "Dedicated" Engels.
**Proposed**: "Voor bureaus met 15 of meer merken die Clyde als kerninfrastructuur inzetten. White-label, API-toegang, toegewijde customer success manager met SLA."

### pricing.tiers.enterprise.workspaces / features_0 / features_2
**Issue type**: CRITICAL - Glossary-violatie ("Unlimited" zonder onderbouwing)
**Current**: "Unlimited" / "Unlimited werkruimtes" / "Alle 12 skills unlimited (fair use)"
**Problem**: Glossary verbiedt expliciet "unlimited" zonder onderbouwing. Moet worden: "zonder plafond voor zover infra reikt" of "binnen fair use".
**Proposed features_0**: "Onbeperkte werkruimtes binnen fair use"
**Proposed features_2**: "Alle 12 vaardigheden zonder harde limieten (fair use)"
**Proposed workspaces-label**: Gebruik "Onbeperkt" of "Fair use"; vermijd letterlijk "Unlimited".

### pricing.tiers.enterprise.tagline
**Issue type**: Glossary-violatie + Engelstalig
**Current**: "Unlimited workspaces + skills. White-label + API access. Dedicated CSM + SLA."
**Problem**: Unlimited, workspaces, skills, access, CSM zijn Engels.
**Proposed**: "Onbeperkte werkruimtes en vaardigheden (fair use). White-label, API-toegang. Toegewijde CSM plus SLA."

### pricing.tiers.enterprise.features_3 t/m _7
**Issue type**: Engelstalige termen
**Current**: "White-label optie" / "API access voor integraties" / "Dedicated Customer Success Manager" / "SLA-contract" / "Priority feature requests"
**Problem**: "Access", "Dedicated", "Priority feature requests" zijn Engels.
**Proposed**: "White-label-optie" / "API-toegang voor integraties" / "Toegewijde customer success manager" / "SLA-contract" / "Voorrang op nieuwe functies"

### pricing.tiers.founding.description
**Issue type**: Dunglish (committeerden)
**Current**: "De oprichtende klanten die vóór launch committeerden. Levenslange prijs €997, Pro-level skill-caps, direct Slack-contact met Daley. {taken} van {total} plekken bezet."
**Problem**: "Committeerden" is anglicisme (to commit). "Pro-level skill-caps" is Engels.
**Proposed**: "De oprichtende klanten die zich voor de launch hebben vastgelegd. Levenslange prijs €997, limieten op Pro-niveau, direct Slack-contact met Daley. {taken} van {total} plekken bezet."

### pricing.matrix.notAvailable
**Issue type**: CRITICAL — typografie-fout
**Current**: ", "
**Problem**: Placeholder-tekst is letterlijk een komma met spatie, onleesbaar in UI. Vermoedelijk had hier "—" of "n.v.t." moeten staan; em-dash vervanging door komma is fout gegaan.
**Proposed**: "n.v.t."

### pricing.matrix.legend
**Issue type**: Dunglish
**Current**: "Cijfers zijn monthly caps per werkruimte. \"Fair use\" = onbeperkt met throttle bij extreme outliers. \"Add-on\" = beschikbaar via skill-pack, niet in basis tier."
**Problem**: "Monthly caps", "throttle", "outliers", "skill-pack", "basis tier" zijn Engels.
**Proposed**: "Cijfers zijn maandlimieten per werkruimte. 'Fair use' = geen harde limiet, maar throttling bij extreme uitschieters. 'Add-on' = beschikbaar als los pakket, niet inbegrepen in het basis-tier."

### pricing.creditPacks.title
**Issue type**: Typografie (komma als em-dash-vervanger)
**Current**: "Credit packs. Top-ups voor swing-months"
**Problem**: "Swing-months" is Engels slang (zie ook: totaal onbekend begrip voor NL-publiek). "Top-ups" Engels.
**Proposed**: "Creditpakketten: aanvullingen voor maanden met uitschieters"

### pricing.creditPacks.description
**Issue type**: Anglicismen
**Current**: "Niet genoeg credits in je tier voor deze maand? Top-up met een credit pack. Geen automatische upsell, geen verplichting."
**Problem**: "Upsell", "top-up", "credit pack" zijn Engels.
**Proposed**: "Niet genoeg credits in je tier voor deze maand? Vul aan met een creditpakket. Geen automatische upsell, geen verplichting." *(upsell is sales-jargon dat beleving kan behouden; eventueel "verkoop-push")*

### pricing.skillPacks.title
**Issue type**: Typografie + Engelstalig
**Current**: "Skill-specifieke packs. Gerichte add-ons"
**Problem**: "Packs", "add-ons" zijn Engels.
**Proposed**: "Vaardigheid-specifieke pakketten: gerichte uitbreidingen"

### pricing.skillPacks.description
**Issue type**: Dunglish
**Current**: "Eén skill tegen de cap? Koop een skill-pack voor die skill specifiek, in plaats van een volle tier-upgrade."
**Problem**: Letterlijke vertaling van "one skill against the cap". "Tegen de cap" klinkt nergens naar in NL.
**Proposed**: "Eén vaardigheid die z'n limiet raakt? Koop een gericht pakket voor die ene vaardigheid, in plaats van je hele tier te upgraden."

### pricing.faq.items.q1.answer
**Issue type**: Dunglish
**Current**: "Voice, Video Ad en Reel Builder zijn de duurste skills in credit-verbruik (5-25 cr per actie). Unlimited voor alle tiers zou ofwel tot astronomische prijzen leiden, ofwel tot fair-use throttling achter de schermen. Caps maken kosten voorspelbaar en geven elk tier een natuurlijke upgrade-trigger."
**Problem**: "Unlimited", "fair-use throttling", "upgrade-trigger" zijn Engels. "Natuurlijke upgrade-trigger" is lelijke directe vertaling.
**Proposed**: "Voice, Video Ad en Reel Builder zijn de duurste vaardigheden qua creditverbruik (5 tot 25 credits per actie). Onbeperkt voor alle tiers zou óf tot extreme prijzen leiden, óf tot fair-use-throttling achter de schermen. Met limieten blijven kosten voorspelbaar en ontstaat per tier een logisch upgrade-moment."

### pricing.faq.items.q3.answer
**Issue type**: Dunglish (pro-rated)
**Current**: "Upgraden kan op elk moment, prorated facturering. Downgraden kan bij de volgende billing cycle. Van Founding naar lager kan niet. Je Founding-prijs is levenslang zolang je actief blijft."
**Problem**: "Prorated facturering" is Engelstalig boekhouden-jargon. "Billing cycle" Engels.
**Proposed**: "Upgraden kan op elk moment, naar rato berekend. Downgraden kan bij de volgende factuurperiode. Van Founding naar lager tier gaan kan niet. Je Founding-prijs blijft levenslang geldig zolang je actief klant blijft."

### pricing.faq.items.q4.answer
**Issue type**: Dunglish
**Current**: "Partner heeft 8 skills included + 2 add-on paden (static ads + ManyChat). Growth / Professional / Enterprise / Founding hebben alle 12 skills beschikbaar, met tier-caps op de duurdere skills."
**Problem**: "Skills", "included", "add-on paden" zijn Engels. "Paden" is verwarrend.
**Proposed**: "Partner heeft 8 vaardigheden inbegrepen plus 2 via add-on (statische ads en ManyChat). Growth, Professional, Enterprise en Founding hebben alle 12 vaardigheden beschikbaar, met limieten per tier op de duurdere."

### pricing.faq.items.q5.answer
**Issue type**: Dunglish + ongrammaticaal
**Current**: "De eenmalige onboarding fee dekt 4 weken partnership-setup door Daley: intake brand voice per klant, KPI-definities, skill-configuratie, testruns en approval-workflow setup. Dit is geen setup-fee voor technische installatie. Het is investering in een werkende AI-medewerker."
**Problem**: "Onboarding fee", "partnership-setup", "testruns", "approval-workflow", "setup-fee" zijn Engels. "Het is investering" mist lidwoord ("Het is een investering").
**Proposed**: "De eenmalige onboardingfee dekt vier weken partnershipsetup door Daley: brand-voice-intake per merk, KPI-definities, vaardigheids-configuratie, testruns en goedkeuringsworkflow. Dit is geen technische installatie-fee, maar een investering in een werkende AI-medewerker."

---

### how-it-works.meta.title
**Issue type**: Typografie (komma-als-em-dash)
**Current**: "Hoe Het Werkt , 5 stappen naar een AI-medewerker in jouw portfolio | FutureMarketingAI"
**Problem**: "Hoe Het Werkt ," is leesbaarheid-fout (spatie-komma-spatie). Hoofdletters inconsistent ("Het" met hoofdletter is Engels title-case).
**Proposed**: "Hoe het werkt: 5 stappen naar een AI-medewerker in jouw portfolio | FutureMarketingAI"

### how-it-works.meta.description
**Issue type**: Dunglish
**Current**: "Van application tot live production in 5 stappen: application + discovery call, 4-week onboarding door Daley, Clyde configureren per klant, productie starten, continue verbetering."
**Problem**: "Application", "live production", "discovery call" zijn Engels. "Klant" glossary-inconsistentie.
**Proposed**: "Van aanmelding tot live productie in vijf stappen: aanmelding plus kennismakingsgesprek, vierweekse onboarding door Daley, Clyde inrichten per merk, productie starten, doorlopende verbetering."

### how-it-works.process.steps.apply.description
**Issue type**: Dunglish
**Current**: "Vul het application-formulier in. Binnen 3 werkdagen horen we van elkaar. 30 min videogesprek waarin we wederzijds beoordelen of het een match is. Geen pitch. Eerlijke check."
**Problem**: "Application-formulier", "pitch", "check" Engels. "Horen we van elkaar" is Dunglish voor "we hear from each other" (onzinnig; bedoeld is "nemen we contact op").
**Proposed**: "Vul het aanmeldformulier in. Binnen drie werkdagen nemen we contact op. Een videogesprek van 30 minuten waarin we wederzijds toetsen of er een match is. Geen verkooppraatje, een eerlijke check."

### how-it-works.process.steps.onboarding.description
**Issue type**: Dunglish
**Current**: "Daley begeleidt persoonlijk het onboarding-traject. Brand voice intake per klant, KPI-doelen definiëren, skill-matrix opbouwen, approval workflows instellen. Geen self-service wizard."
**Problem**: "Brand voice intake", "skill-matrix", "approval workflows", "self-service wizard" zijn Engels. "Per klant" — glossary: "per merk".
**Proposed**: "Daley begeleidt het onboardingtraject persoonlijk. Brand-voice-intake per merk, KPI-doelen bepalen, vaardigheidsmatrix opbouwen, goedkeuringsworkflows inrichten. Geen self-service-wizard."

### how-it-works.process.steps.configure.description
**Issue type**: Dunglish
**Current**: "Voor elke klant een workspace met: brand guidelines, doelgroep, tone of voice, actieve skills, kanalen, goedkeuringsregels. Clyde begint zijn geheugen te vormen per klant."
**Problem**: "Workspace", "brand guidelines", "tone of voice", "skills" zijn Engels. "Klant" glossary-inconsistentie.
**Proposed**: "Voor elk merk een werkruimte met: merkrichtlijnen, doelgroep, tone of voice, actieve vaardigheden, kanalen en goedkeuringsregels. Clyde begint direct geheugen op te bouwen per merk."

### how-it-works.process.steps.production.description
**Issue type**: Dunglish
**Current**: "Clyde gaat aan het werk: social posts, blogs, calls, ads. Jij reviewt elke output in de approval-queue voordat het live gaat. Week 1 veel correcties, maar Clyde leert snel."
**Problem**: "Reviewt", "output", "approval-queue", "live" zijn Engels. "Week 1 veel correcties" is getransponeerd Engels.
**Proposed**: "Clyde gaat aan het werk: socialposts, blogs, calls, ads. Jij controleert elke output in de goedkeuringsqueue voordat die live gaat. In week één nog veel correcties, maar Clyde leert snel."

### how-it-works.process.steps.improvement.description
**Issue type**: Dunglish
**Current**: "Elke week scherper per klant. Clyde onthoudt correcties, leert van performance data, en bouwt micro-kennis op. Wekelijkse performance digest houdt je in control."
**Problem**: "Performance data", "performance digest", "in control" zijn Engels. "Klant" glossary-issue.
**Proposed**: "Elke week scherper per merk. Clyde onthoudt correcties, leert van prestatiedata en bouwt micro-kennis op. Een wekelijks prestatie-overzicht houdt je in controle."

### how-it-works.process.loop_description
**Issue type**: Dunglish
**Current**: "Clyde wordt elke week beter per klant. Geheugen plus prestatiedata plus jouw correcties voeden de volgende iteratie. Na 12 weken ken je het verschil met week 1."
**Problem**: "Plus ... plus" als opsomming klinkt on-Nederlands (typisch Engels "A plus B plus C"). "Ken je het verschil met week 1" is letterlijk (bedoeld: "merk je het verschil met week 1").
**Proposed**: "Clyde wordt elke week beter per merk. Geheugen, prestatiedata en jouw correcties voeden samen de volgende iteratie. Na twaalf weken merk je het verschil met week één."

---

### contact.hero.description
**Issue type**: Onhandige structuur
**Current**: "Voor partnership-aanvragen: ga naar /apply. Voor alle andere vragen. Feedback, pers, partnerships, algemene informatie. Gebruik dit formulier. Reactie binnen 1-2 werkdagen."
**Problem**: Zin "Voor alle andere vragen." eindigt op punt maar is geen volledige zin. Onsamenhangend.
**Proposed**: "Voor partnershipaanvragen: ga naar /apply. Voor alle andere vragen — feedback, pers, partnerschappen, algemene informatie — gebruik dit formulier. Je krijgt binnen 1 tot 2 werkdagen antwoord."
*(Let op: em-dash verboden. Alternatief: "feedback, pers of algemeen: gebruik dit formulier.")*
**Proposed zonder em-dash**: "Voor partnershipaanvragen ga je naar /apply. Voor feedback, pers, partnerschappen of algemene informatie: gebruik dit formulier. Je krijgt binnen 1 tot 2 werkdagen antwoord."

### contact.form.title
**Issue type**: Stijl (u-vorm)
**Current**: "Stuur Ons Een Bericht"
**Problem**: Title-case (elk woord met hoofdletter) is Engels. NL gebruikt gewone zinsstructuur. Instructie zegt "je"-vorm.
**Proposed**: "Stuur ons een bericht"

### contact.form.message_placeholder
**Issue type**: Glossary-issue (skills)
**Current**: "Vertel ons over je bureau en welke skills je interesseren..."
**Problem**: "Skills" is Engels (glossary: "vaardigheden").
**Proposed**: "Vertel ons over je bureau en welke vaardigheden je interesseren…"

### contact.book_demo.description
**Issue type**: Dunglish
**Current**: "Plan een gepersonaliseerde walkthrough om je AI Marketing Medewerker in actie te zien."
**Problem**: "Gepersonaliseerde walkthrough" is letterlijk Engels.
**Proposed**: "Plan een persoonlijke rondleiding om je AI Marketing Medewerker in actie te zien."

### contact.direct_contact.email_label
**Issue type**: Engelstalig
**Current**: "Email"
**Problem**: In NL: "E-mail".
**Proposed**: "E-mail"

---

### founding-member.meta.title
**Issue type**: Typografie
**Current**: "Founding Member , 10 plekken, €997 levenslang | FutureMarketingAI"
**Problem**: Opnieuw het "spatie-komma-spatie"-patroon als foute em-dash-vervanging.
**Proposed**: "Founding Member: 10 plekken, €997 levenslang | FutureMarketingAI"

### founding-member.hero.description
**Issue type**: Dunglish
**Current**: "10 plekken totaal voor bureaus die vanaf launch committeren. €997/maand levenslang. De nieuwe Growth tier wordt €2.497/mo. Alle 12 vaardigheden, Pro-level caps, directe Slack-toegang tot Daley."
**Problem**: "Committeren", "/mo", "Pro-level caps" zijn Engels. "Directe Slack-toegang tot Daley" klinkt stroef.
**Proposed**: "10 plekken in totaal voor bureaus die zich vanaf de launch vastleggen. €997 per maand, levenslang. De nieuwe Growth-tier wordt €2.497 per maand. Alle 12 vaardigheden, limieten op Pro-niveau en directe Slack-toegang tot Daley."

### founding-member.pricing.period
**Issue type**: Punt in plaats van komma (stijl)
**Current**: "/mo. Levenslang"
**Problem**: "/mo" Engels + "." voor "Levenslang" breekt onnodig.
**Proposed**: "/maand, levenslang"

### founding-member.value.line3
**Issue type**: Dunglish
**Current**: "10 plekken. Geen heropening. Als ze vol zijn, zijn ze vol."
**Problem**: "Als ze vol zijn, zijn ze vol" is letterlijke vertaling van "when they're full, they're full". In NL klinkt dit niet als vaste uitdrukking.
**Proposed**: "10 plekken. Geen heropening. Vol is vol."

### founding-member.benefits.items.priority.title
**Issue type**: Engelstalig
**Current**: "Priority development queue"
**Problem**: Volledig Engelse kop op een NL-site.
**Proposed**: "Voorrang op de ontwikkelagenda"

### founding-member.benefits.items.priority.description
**Issue type**: Dunglish
**Current**: "Feature requests van Founding partners gaan voor. Je hebt directe lijn naar de roadmap."
**Problem**: "Feature requests", "roadmap" zijn Engels (roadmap is geaccepteerd, feature requests minder).
**Proposed**: "Functieverzoeken van Founding partners krijgen voorrang. Je hebt een directe lijn naar de roadmap."

### founding-member.benefits.items.influence.title
**Issue type**: Engelstalig
**Current**: "Roadmap influence"
**Problem**: Kop is puur Engels.
**Proposed**: "Invloed op de roadmap"

### founding-member.benefits.items.influence.description
**Issue type**: Dunglish
**Current**: "Maandelijkse Founder calls om te bespreken wat we volgende bouwen. Geen committee, wel jouw input."
**Problem**: "Founder calls", "committee", "input" zijn Engels. "Wat we volgende bouwen" is ongrammaticaal ("wat we hierna bouwen").
**Proposed**: "Maandelijkse Founder-gesprekken om te bespreken wat we hierna bouwen. Geen commissie, wel jouw inbreng."

### founding-member.benefits.items.early_access.description
**Issue type**: Dunglish
**Current**: "Reel Builder, Email Management, ManyChat DM komen eerst naar Founding partners. Je probeert voordat de rest toegang krijgt."
**Problem**: "Komen eerst naar" is letterlijke vertaling van "come first to". In NL: "gaan als eerst naar".
**Proposed**: "Reel Builder, Email Management en ManyChat DM gaan eerst naar Founding partners. Jij probeert ze voordat de rest toegang krijgt."

### founding-member.benefits.items.onboarding.description
**Issue type**: Grammatica-fout (onlogische zin)
**Current**: "Andere tiers betalen €497-€5.997 onboarding voor 4 weken partnership setup. Founding partners: €0. Enige eenmalige kost is gratis."
**Problem**: "Enige eenmalige kost is gratis" is een contradictio in terminis en onduidelijk (kost kan niet tegelijk "eenmalig" en "gratis" zijn; bedoeld was waarschijnlijk: "De enige kostenpost is gratis" — nog steeds onlogisch).
**Proposed**: "Andere tiers betalen €497 tot €5.997 aan onboardingkosten voor vier weken setup. Voor Founding partners: €0. Geen eenmalige investering, wél volledige persoonlijke begeleiding."

### founding-member.faq.items.q2.answer
**Issue type**: Onhandige constructie
**Current**: "Ja, pro-rated. Van Founding naar lager (Growth/Partner) kan niet. Je Founding-prijs is exclusief voor Founding."
**Problem**: "Pro-rated" Engels. "Exclusief voor Founding" is tautologisch.
**Proposed**: "Ja, naar rato. Van Founding naar een lager tier (Growth of Partner) gaan kan niet. De Founding-prijs geldt uitsluitend voor Founding-leden."

### founding-member.cta.subtitle
**Issue type**: Dunglish (qualifies)
**Current**: "{taken} van {total} plekken bezet. Plan een gesprek. Als je fit qualifies en we beide match zien, reserveren we je plek."
**Problem**: "Fit qualifies", "beide match zien" zijn pure Engelse woordvolgorde. "Qualifies" bestaat niet in NL.
**Proposed**: "{taken} van {total} plekken bezet. Plan een gesprek. Als je profiel past en we aan beide kanten een match zien, reserveren we je plek."

---

### memory.meta.description
**Issue type**: Typografie + Engelstalig
**Current**: "Clyde heeft persistent geheugen per klant , 4 lagen (HOT/WARM/COLD/CONTEXT), per-client isolation, nightly consolidation. Elke week scherper, niet verwateren."
**Problem**: Spatie-komma-spatie fout. "Per-client isolation", "nightly consolidation" zijn Engels.
**Proposed**: "Clyde heeft persistent geheugen per merk: 4 lagen (HOT, WARM, COLD, CONTEXT), isolatie per klant, nachtelijke consolidatie. Elke week scherper, nooit verwaterd."

### memory.hero.subtitle
**Issue type**: CRITICAL — Glossary-violatie + Dunglish
**Current**: "Het verschil tussen een AI-tool en een AI-medewerker is geheugen. Clyde onthoudt merkstem, doelgroep, KPI-doelen en prestatiegeschiedenis. En wordt elke week scherper per klant."
**Problem**: "AI-tool" wordt expliciet verboden door glossary. "Per klant" — glossary wil "per merk" voor bureau-eindklanten, al is hier context dubbelzinnig.
**Proposed**: "Het verschil tussen generieke AI en een AI Marketing Medewerker is geheugen. Clyde onthoudt merkstem, doelgroep, KPI-doelen en prestatiegeschiedenis, en wordt elke week scherper per merk."

### memory.layers.hot.description
**Issue type**: Engels jargon
**Current**: "De lopende conversatie, de huidige campagne, de content die nu in review zit. Direct beschikbaar, zonder ophaal-latentie."
**Problem**: "Ophaal-latentie" is letterlijke vertaling van "retrieval latency". Technisch jargon.
**Proposed**: "De lopende conversatie, de huidige campagne, de content die nu wordt gereviewd. Direct beschikbaar, zonder wachttijd."

### memory.isolation.body1
**Issue type**: Dunglish
**Current**: "Clyde beheert meerdere klanten en meerdere merken zonder dat de merkstem van Klant A in Klant B opduikt. Elke klant krijgt een eigen geheugen-namespace die strikt gescheiden is op database-niveau (Supabase RLS) en in de vector store."
**Problem**: "Vector store" Engels, "namespace" Engels (technisch, acceptabel). De zin "Clyde beheert meerdere klanten en meerdere merken" is consistent met glossary (hier echt tussen klant vs. merk onderscheiden).
**Proposed**: "Clyde beheert meerdere klanten en meerdere merken zonder dat de merkstem van klant A in klant B opduikt. Elke klant krijgt een eigen geheugennamespace, strikt gescheiden op databaseniveau (Supabase RLS) en in de vectorstore."

### memory.isolation.body2
**Issue type**: Dunglish
**Current**: "Wat Clyde leert over een client blijft bij die client. Je operators zien alleen wat ze mogen zien. Bij opzegging: data is in 24 uur exporteerbaar, 30 dagen retentie voor vangnet, daarna schoon verwijderd."
**Problem**: "Client" (Engels) gebruikt naast "klant" elders. Inconsistent. "Schoon verwijderd" is "cleanly deleted" letterlijk.
**Proposed**: "Wat Clyde leert over een klant, blijft bij die klant. Je operators zien alleen wat ze mogen zien. Bij opzegging: data is binnen 24 uur exporteerbaar, 30 dagen retentie als vangnet, daarna volledig verwijderd."

### memory.progress.week1Body
**Issue type**: Onhandige constructie
**Current**: "\"Schrijf een caption voor klant X\". Clyde volgt brand guidelines, maar nog niet altijd met perfecte microstylering. Veel feedback-rondes. Jij bent nog veel bezig met correctie en fine-tuning."
**Problem**: "Caption", "brand guidelines", "microstylering" (neologisme?), "fine-tuning" Engels.
**Proposed**: "'Schrijf een caption voor klant X'. Clyde volgt de merkrichtlijnen, maar nog niet altijd met de perfecte microstijl. Veel feedbackrondes, veel correctie en bijschaven."

### memory.progress.week12Body
**Issue type**: Dunglish
**Current**: "Clyde kent de micro-tics van klant X: welke emoji wel en niet, welke openingszinnen converteren, welke hashtags presteren, welke tijdstippen werken. Eerste drafts zijn bruikbaar. Jij reviewt, Clyde voert uit."
**Problem**: "Micro-tics", "drafts", "reviewt" zijn Engels. "Converteren" is marketing-jargon, acceptabel.
**Proposed**: "Clyde kent de microtics van klant X: welke emoji wel en niet, welke openingszinnen converteren, welke hashtags presteren, welke tijdstippen werken. De eerste concepten zijn al bruikbaar. Jij controleert, Clyde voert uit."

### memory.contrast.chatgpt.body
**Issue type**: Dunglish
**Current**: "Geen klant-specifiek geheugen. Elke sessie begint blanco. Je moet brand voice, doelgroep en context herhalen bij elke prompt. Werkt niet bij 20 klanten."
**Problem**: "Klant-specifiek" / "blanco" / "prompt" zijn acceptabel, maar "Werkt niet bij 20 klanten" is te kort en klinkt Dunglish.
**Proposed**: "Geen klantspecifiek geheugen. Elke sessie begint blanco. Je moet merkstem, doelgroep en context bij elke prompt opnieuw invoeren. Werkt niet als je 20 klanten bedient."

### memory.contrast.clyde.body
**Issue type**: Onhandig
**Current**: "Persistent per klant, 4 lagen, isolatie tussen merken, nightly consolidation. Gebouwd voor bureaus met 10-50 merken. Elke week scherper, nooit verwateren."
**Problem**: "Nightly consolidation" Engels. "Nooit verwateren" = infinitief, moet "verwatert nooit".
**Proposed**: "Persistent per klant, vier lagen, isolatie tussen merken, nachtelijke consolidatie. Gebouwd voor bureaus met 10 tot 50 merken. Elke week scherper, nooit vervagend."

---

### apply.meta.description
**Issue type**: Anglicismen
**Current**: "Application voor een partnership-call. Max 20 bureaus per jaar. Wij reviewen binnen 3 werkdagen. Passend of niet, je krijgt altijd antwoord."
**Problem**: "Application", "reviewen" zijn Engels.
**Proposed**: "Aanmelding voor een partnershipgesprek. Maximaal 20 bureaus per jaar. We beoordelen binnen drie werkdagen. Passend of niet, je krijgt altijd antwoord."

### apply.hero.subtitle
**Issue type**: Dunglish
**Current**: "Geen self-service. Geen generieke sign-up. We reviewen elke applicatie persoonlijk en antwoorden binnen 3 werkdagen. Ook als het geen match is."
**Problem**: "Self-service", "sign-up", "reviewen", "applicatie" (in deze context bedoelt men "aanmelding"), "match" zijn Engels. Glossary verbiedt "Sign up".
**Proposed**: "Geen self-service. Geen standaard aanmelding. We beoordelen elke aanmelding persoonlijk en antwoorden binnen drie werkdagen. Ook als het geen match is."

### apply.expectations.step1.body
**Issue type**: Dunglish
**Current**: "Daley leest elke applicatie persoonlijk. Je krijgt binnen 72 uur antwoord. Ja, nee of \"laten we eerst bellen\"."
**Problem**: "Applicatie" in NL betekent "app/toepassing", niet "sollicitatie/aanmelding". Ongelukkige dubbele betekenis.
**Proposed**: "Daley leest elke aanmelding persoonlijk. Je krijgt binnen 72 uur antwoord: ja, nee of 'laten we eerst bellen'."

### apply.expectations.step2.body
**Issue type**: Dunglish
**Current**: "Videocall over jouw portfolio, de huidige blockers en of Clyde realistisch past. Geen pitch. Wederzijds interview."
**Problem**: "Blockers", "pitch", "interview" zijn Engels. "Videocall" is geaccepteerd.
**Proposed**: "Videocall over je portfolio, je huidige knelpunten en of Clyde realistisch past. Geen verkooppraatje, wel een wederzijds gesprek."

### apply.expectations.step3.title
**Issue type**: Grammatica (onsamenhangend)
**Current**: "Passing of niet-passing"
**Problem**: "Passing" bestaat niet in NL (zou "passend of niet-passend" moeten zijn).
**Proposed**: "Passend of niet-passend"

### apply.expectations.step3.body
**Issue type**: Dunglish
**Current**: "Als het klopt starten we met 4 weken onboarding-partnership. Zo niet. We verwijzen door naar DIY-alternatieven."
**Problem**: "Zo niet." op zichzelf staand is ongrammaticaal in deze positie. "DIY-alternatieven" is Engels (→ "doe-het-zelf-alternatieven").
**Proposed**: "Als het klopt, starten we met vier weken onboarding-partnership. Zo niet, dan verwijzen we je door naar doe-het-zelf-alternatieven."

### apply.expectations.reassurance
**Issue type**: Stijl
**Current**: "Niet-passende applicaties zijn geen teleurstelling. We zijn bewust selectief om kwaliteit te borgen voor beide kanten."
**Problem**: "Applicaties" = toepassingen in NL, moet "aanmeldingen" zijn.
**Proposed**: "Een niet-passende aanmelding is geen teleurstelling. We zijn bewust selectief om voor beide kanten de kwaliteit te waarborgen."

### apply.form.tierOptions.growth / professional / founding
**Issue type**: Typografie (komma als em-dash)
**Current**: "Growth (€2.497/mo) , 5 werkruimtes" / "Professional (€4.497/mo) , 15 werkruimtes" / "Founding (€997/mo) , 10 plekken"
**Problem**: Wederom de "spatie-komma-spatie" fout. "/mo" moet "/mnd".
**Proposed**: "Growth (€2.497/mnd): 5 werkruimtes" / "Professional (€4.497/mnd): 15 werkruimtes" / "Founding (€997/mnd): 10 plekken"

### apply.form.tierOptions.enterprise
**Issue type**: Glossary-violatie
**Current**: "Enterprise (€7.997/mo). Unlimited"
**Problem**: "Unlimited" zonder onderbouwing, verboden.
**Proposed**: "Enterprise (€7.997/mnd): onbeperkte werkruimtes (fair use)"

### apply.form.problemPlaceholder
**Issue type**: Grammatica
**Current**: "Bijv.: \"We verliezen 2 FTE aan content-productie voor 15 klanten\" of \"Onze SEO stagneert en we hebben geen bandwidth voor blogs.\""
**Problem**: "Bandwidth" is Engels (→ capaciteit). "Klanten" — in context van een bureau verwijzen naar eindklanten, dus moet mogelijk "merken" zijn, maar in dit voorbeeld past "klanten" omdat het over de eigen agency-klanten gaat (nog steeds glossary-grijs gebied — accepteer hier).
**Proposed**: "Bijv.: 'We verliezen 2 FTE aan content-productie voor 15 klanten' of 'Onze SEO stagneert en we hebben geen capaciteit voor blogs.'"

### apply.form.successBody
**Issue type**: Dunglish
**Current**: "Daley leest je applicatie persoonlijk en antwoordt binnen 3 werkdagen. Check je inbox (en spam-folder) voor onze reply."
**Problem**: "Applicatie", "check", "spam-folder", "reply" zijn Engels.
**Proposed**: "Daley leest je aanmelding persoonlijk en antwoordt binnen drie werkdagen. Houd je inbox (en spam-folder) in de gaten voor onze reactie."

### apply.form.errorValidation
**Issue type**: Stijl (alsjeblieft — te joviaal)
**Current**: "Controleer alsjeblieft de velden. Sommige zijn niet volledig ingevuld."
**Problem**: "Alsjeblieft" is in UI-context ongebruikelijk; NL-UI gebruikt meestal imperatief. Werkt, maar "alsjeblieft" is een directe vertaling van "please".
**Proposed**: "Controleer de velden, niet alle verplichte velden zijn ingevuld."

---

## Cross-cutting aanbevelingen

1. **Globale find-and-replace**: alle "/mo" → "/mnd" in pricing, founding-member, apply namespaces (~20 voorkomens).
2. **Globale "Unlimited" audit**: vervang door "Onbeperkt (fair use)" of "Geen harde limiet" in pricing.tiers.enterprise (3x) en apply.form.tierOptions.enterprise.
3. **"Spatie-komma-spatie" cleanup**: zoek op `" , "` (letterlijke string) in pricing.meta.title, pricing.meta.description, how-it-works.meta.title, founding-member.meta.title, apply.form.tierOptions.*, pricing.matrix.notAvailable (dit is een leeg placeholder). Vervang door `: ` of `, ` afhankelijk van context.
4. **Glossary-pass "klanten" → "merken"**: bij elke verwijzing naar eindklanten-van-bureaus (niet eigen klanten) consistent "merken" of "klantportfolio" gebruiken. Relevante keys: pricing.tiers.*.description, how-it-works.process.steps.*.description, memory.hero.subtitle.
5. **Skill-terminologie**: overal "skills" → "vaardigheden" in user-facing content (productnamen zoals "Voice Agent", "Blog Factory" blijven Engels als eigennaam, maar categorieaanduiding is NL).
6. **"Workspace(s)"**: inconsistent gebruikt als "werkruimtes" (goed) en "workspace" (in how-it-works.process.steps.configure.description). Overal naar "werkruimte(s)".
7. **"Application"/"Applicatie"**: in apply-namespace 8 voorkomens die naar "aanmelding" moeten (applicatie = toepassing in NL).
8. **"Review/reviewt/reviewen"**: overal naar "beoordelen/controleren" (~6 voorkomens in apply + how-it-works).
9. **"Onboarding" zelf**: geaccepteerde term, niet vertalen. Wel consistent schrijven (niet "onboarding-traject" vs "onboardingtraject" afwisselen).
