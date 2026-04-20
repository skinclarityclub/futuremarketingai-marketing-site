# NL Audit — Legal (Privacy / Terms / Cookies)

## Summary
- Total keys reviewed: 26 (meta, hero, sections.terms + 7 subsecties, sections.privacy + 9 subsecties, sections.cookies, sections.disclaimer, last_updated)
- Issues found: 21
- U/je-vorm consistent: **nee** — inconsistent. De meeste juridische secties (terms subsections, privacy subsections) gebruiken correct "u/uw". Echter:
  - `legal.sections.terms.content` (intro) gebruikt "u/uw"
  - `legal.sections.privacy.content` (intro) gebruikt geen persoonsvorm maar "onze abonnees"
  - `legal.sections.cookies.content` gebruikt "je/jouw"
  - `legal.sections.disclaimer.content` gebruikt "je"
  - Conclusie: privacybeleid + servicevoorwaarden = "u-vorm" (correct voor legal), maar cookies + disclaimer = "je-vorm". Dit moet geharmoniseerd worden naar consequent "u" binnen de hele `legal` namespace.

Extra opmerking: ontbrekende diakritieken door JSON-escape problematiek (categorieen, beeindiging, essentiele, anomalieen, enz.). In legal-context zijn trema's verplicht voor correct Nederlands (categorieën, beëindiging, essentiële, anomalieën). Dit is geen puur Dunglish-issue, maar tastbare kwaliteit die voor een juridische pagina wel degelijk gefixed moet worden.

## Issues

### legal.sections.terms.content
**Issue type**: Anglicisme + onnatuurlijke formulering
**Current**: "Door u te abonneren op of gebruik te maken van onze diensten, gaat u akkoord met deze voorwaarden."
**Problem**: "u te abonneren op of gebruik te maken" is een onhandige hybride constructie (een infinitief die aan twee voorzetselgroepen tegelijk hangt). Natuurlijker Nederlands scheidt de twee werkwoorden.
**Proposed**: "Door een abonnement af te sluiten of gebruik te maken van onze diensten, gaat u akkoord met deze voorwaarden."

### legal.sections.terms.content
**Issue type**: Dunglish
**Current**: "FutureMarketingAI opereert als een Agent as a Service (AaaS) aanbieder en levert persistente AI-agenten met instelbare marketingvaardigheden aan marketing agencies."
**Problem**: "opereert als" is een letterlijke vertaling van "operates as". Beter Nederlands: "treedt op als" of "fungeert als". Daarnaast: "marketing agencies" is Engels, moet "marketingbureaus" zijn (dat woord is NL standaard en past bij doelgroep). "persistente AI-agenten" is ook Dunglish — "persistent" wordt zelden zo gebruikt in NL, beter "AI-agenten met doorlopend geheugen" of "met behoud van context".
**Proposed**: "FutureMarketingAI treedt op als Agent as a Service (AaaS)-aanbieder en levert AI-agenten met doorlopend geheugen en instelbare marketingvaardigheden aan marketingbureaus."

### legal.sections.terms.subsections.service_description.content
**Issue type**: Dunglish / Engelse termen
**Current**: "Skills worden geactiveerd per abonnementsniveau en kunnen op elk moment worden toegevoegd of verwijderd."
**Problem**: "Skills" is Engels. In de site-glossary wordt "vaardigheden" gebruikt (zie rest van namespace: "marketingvaardigheden", "12 AI-vaardigheden"). Inconsistentie.
**Proposed**: "Vaardigheden worden geactiveerd per abonnementsniveau en kunnen op elk moment worden toegevoegd of verwijderd."

### legal.sections.terms.subsections.subscription_terms.content
**Issue type**: Anglicisme / stijl
**Current**: "Diensten worden aangeboden op maandelijkse abonnementsbasis in vijf tiers: Partner (EUR 347/mnd), Growth (EUR 2.497/mnd), ..."
**Problem**: "tiers" is Engels — kan in juridische tekst vervangen door "niveaus" of "abonnementsvormen". Verder: "EUR 347/mnd" oogt als database-output; voor juridisch document is "EUR 347 per maand" leesbaarder en Nederlands standaard.
**Proposed**: "Diensten worden aangeboden op basis van een maandelijks abonnement in vijf niveaus: Partner (EUR 347 per maand), Growth (EUR 2.497 per maand), Professional (EUR 4.497 per maand), Enterprise (EUR 7.997 per maand) en Founding (EUR 997 per maand, 10 plekken levenslang)."

### legal.sections.terms.subsections.subscription_terms.content
**Issue type**: Dunglish
**Current**: "Alle plannen bevatten alle 12 AI-vaardigheden, met caps per tier op voice, video en reels."
**Problem**: "caps" + "tier" + "voice" + "reels" — vier Engelse leenwoorden op één rij in juridische tekst. "caps" vervangen door "limieten", "tier" door "niveau", "voice" door "voice-minuten" (behouden als productnaam) en "reels" blijft productnaam maar kleine letter is vreemd.
**Proposed**: "Alle abonnementen bevatten alle 12 AI-vaardigheden, met limieten per niveau voor Voice-minuten, videoproductie en Reels."

### legal.sections.terms.subsections.subscription_terms.content
**Issue type**: Onnatuurlijke formulering
**Current**: "U kunt uw abonnement opzeggen met 30 dagen schriftelijke opzegtermijn, ingaand aan het einde van de lopende factuurperiode."
**Problem**: "ingaand aan het einde" is grammaticaal kreupel — een opzegging gaat niet "in" aan het einde, ze wordt "van kracht" of "heeft effect" aan het einde.
**Proposed**: "U kunt uw abonnement opzeggen met een schriftelijke opzegtermijn van 30 dagen. De opzegging wordt van kracht aan het einde van de lopende factuurperiode."

### legal.sections.terms.subsections.ai_output_disclaimer.content
**Issue type**: Dunglish / onnatuurlijke woordvolgorde
**Current**: "Alle content, aanbevelingen en output gegenereerd door uw AI Marketing Medewerker worden geleverd als concepten die menselijke beoordeling vereisen voor publicatie of verspreiding."
**Problem**: Anglo-syntax — Engelse nabepaling ("generated by") in NL gaat vóór het substantief of met "die/dat" relatiefzin. Verder: "content" en "output" zijn Engels, respectievelijk "inhoud" en "uitkomsten/resultaten" zijn NL equivalenten die hier passen. "worden geleverd" is lijdend en kan sterker.
**Proposed**: "Alle inhoud, aanbevelingen en uitkomsten die door uw AI Marketing Medewerker worden gegenereerd, worden geleverd als concepten. Menselijke beoordeling is vereist voordat deze worden gepubliceerd of verspreid."

### legal.sections.terms.subsections.ai_output_disclaimer.content
**Issue type**: Dunglish
**Current**: "Het abonnerende bureau is als enige verantwoordelijk voor het beoordelen, bewerken en goedkeuren van alle AI-output voordat deze wordt gepubliceerd aan of namens hun klanten."
**Problem**: "Het abonnerende bureau" is letterlijk "the subscribing agency" — NL kent "abonnerende" als werkwoordsvorm wel, maar ongebruikelijk in juridisch NL, waar "de abonnee" of "het bureau dat het abonnement afneemt" normaal is. Verder: "hun klanten" — enkelvoud/meervoud congruentie: "het bureau" is enkelvoud, dus "zijn klanten" (niet "hun").
**Proposed**: "De abonnee is als enige verantwoordelijk voor het beoordelen, bewerken en goedkeuren van alle AI-output voordat deze wordt gepubliceerd aan of namens zijn klanten."

### legal.sections.terms.subsections.liability_limitation.content
**Issue type**: Dunglish / juridische anglicisme
**Current**: "De totale aansprakelijkheid van FutureMarketingAI voortvloeiend uit of verband houdend met deze voorwaarden is beperkt tot het totaal aan vergoedingen betaald door de abonnee in de twaalf (12) maanden voorafgaand aan de gebeurtenis die aanleiding geeft tot de claim."
**Problem**: "vergoedingen betaald door de abonnee" is Engelse nabepalings-woordvolgorde ("fees paid by"). Standaard NL juridisch: "de door de abonnee betaalde vergoedingen". Verder "de claim" — Nederlandse juridische term is "de vordering" (claim is leenwoord, wel geaccepteerd, maar "vordering" is formeler en gangbaar in NL contracten).
**Proposed**: "De totale aansprakelijkheid van FutureMarketingAI die voortvloeit uit of verband houdt met deze voorwaarden is beperkt tot het totaal aan door de abonnee betaalde vergoedingen in de twaalf (12) maanden voorafgaand aan de gebeurtenis die aanleiding geeft tot de vordering."

### legal.sections.terms.subsections.liability_limitation.content
**Issue type**: Dunglish
**Current**: "FutureMarketingAI is niet aansprakelijk voor indirecte, incidentele, bijzondere, gevolgschade of punitieve schade, met inbegrip van maar niet beperkt tot verlies van winst, gegevens, zakelijke kansen of goodwill."
**Problem**: Letterlijke vertaling van "including but not limited to" — in NL juridisch gebruikt men "waaronder begrepen, maar niet beperkt tot" of eenvoudiger "waaronder, maar niet beperkt tot". Verder: "incidentele" en "punitieve schade" zijn Amerikaanse juridische concepten ("incidental", "punitive damages"); Nederlands recht kent deze categorieën niet zo — "incidentele" klinkt als Dunglish, beter weglaten of vervangen door "bijkomende". "punitieve schade" (punitive damages) bestaat niet in NL recht; men kan wel "boeteachtige schadevergoeding" zeggen, maar meestal laat men dit weg.
**Proposed**: "FutureMarketingAI is niet aansprakelijk voor indirecte schade, gevolgschade of bijkomende schade, waaronder begrepen maar niet beperkt tot winstderving, verlies van gegevens, gemiste zakelijke kansen of reputatieschade (goodwill)."

### legal.sections.terms.subsections.termination.title
**Issue type**: Ontbrekende diakriet
**Current**: "6. Beeindiging"
**Problem**: "Beëindiging" hoort met trema. Zonder trema is het formeel een ander woord ("beëindigen" = afsluiten; "beeindigen" bestaat niet). Voor juridische pagina is de trema verplicht.
**Proposed**: "6. Beëindiging"

### legal.sections.terms.subsections.termination.content
**Issue type**: Ontbrekende diakritieken (meermaals) + Engels leenwoord
**Current**: "Beide partijen kunnen het abonnement beeindigen met 30 dagen schriftelijke opzegtermijn. ... worden alle bureaugegevens, klantworkspace-gegevens en bijbehorende content permanent verwijderd ... FutureMarketingAI kan uw account onmiddellijk beeindigen bij wezenlijke schending ..."
**Problem**: "beeindigen" → "beëindigen" (2x). "klantworkspace-gegevens" bevat Engels "workspace" — kan "klantwerkruimtegegevens" worden, maar als "workspace" elders productnaam is kan het blijven. "content" kan "inhoud" worden.
**Proposed**: "Beide partijen kunnen het abonnement beëindigen met een schriftelijke opzegtermijn van 30 dagen. Na beëindiging heeft u een exportperiode van 30 kalenderdagen, waarin u alle werkruimtegegevens, inhoud, rapporten en configuraties kunt downloaden. Na deze exportperiode van 30 dagen worden alle bureaugegevens, werkruimtegegevens van klanten en bijbehorende inhoud permanent verwijderd uit onze systemen en sub-verwerkers. FutureMarketingAI kan uw account onmiddellijk beëindigen bij wezenlijke schending van deze voorwaarden, waaronder betalingsachterstand van meer dan 30 dagen."

### legal.sections.terms.subsections.governing_law.content
**Issue type**: Dunglish / pleonasme
**Current**: "Voordat juridische procedures worden gestart, komen beide partijen overeen om gedurende een periode van ten minste 30 dagen te pogen het geschil op te lossen door middel van onderhandeling te goeder trouw."
**Problem**: "te pogen ... op te lossen" is omslachtig. "door middel van onderhandeling te goeder trouw" is letterlijke vertaling van "good faith negotiation"; NL standaard is "door middel van onderhandelingen te goeder trouw" (meervoud) of "door onderhandelingen te goeder trouw". "juridische procedures worden gestart" klinkt Engels; NL: "gerechtelijke procedures aanhangig worden gemaakt" of "een procedure te starten".
**Proposed**: "Voordat een gerechtelijke procedure wordt aangespannen, komen beide partijen overeen om gedurende ten minste 30 dagen te proberen het geschil op te lossen door middel van onderhandelingen te goeder trouw."

### legal.sections.privacy.content
**Issue type**: Anglicisme
**Current**: "FutureMarketingAI is toegewijd aan het beschermen van de privacy van onze abonnees, hun klanten en eindgebruikers, in overeenstemming met de Algemene Verordening Gegevensbescherming (AVG) en toepasselijke Nederlandse wetgeving inzake gegevensbescherming."
**Problem**: "is toegewijd aan het beschermen van" is letterlijke vertaling van "is committed to protecting". Natuurlijker NL: "zet zich in voor de bescherming van" of "hecht groot belang aan de bescherming van".
**Proposed**: "FutureMarketingAI hecht groot belang aan de bescherming van de privacy van haar abonnees, hun klanten en eindgebruikers, conform de Algemene Verordening Gegevensbescherming (AVG) en de toepasselijke Nederlandse wetgeving inzake gegevensbescherming."

### legal.sections.privacy.subsections.data_collected.title
**Issue type**: Ontbrekende diakriet + Engels leenwoord
**Current**: "1. Gegevens die wij verzamelen"
**Problem**: Titel is correct NL — geen issue hier. (Let op: content van deze subsectie gebruikt "categorieen" zonder trema.)
**Proposed**: (geen wijziging titel)

### legal.sections.privacy.subsections.data_collected.content
**Issue type**: Ontbrekende diakritieken + anglicismen
**Current**: "Wij verzamelen de volgende categorieen persoonsgegevens: Accountgegevens (naam, e-mailadres, bedrijfsnaam, factuurgegevens), Klantworkspace-gegevens (brand voice documenten, social media accountkoppelingen, contentplanningen, doelgroepprofielen), Gebruiksgegevens (platformactiviteitslogs, functiegebruik, uitvoeringsaantallen), en AI-interactiegegevens (chatberichten met AI-agenten, telefoongesprekstranscripties, contentgeneratie-prompts). Wij verzamelen niet opzettelijk bijzondere persoonsgegevens (bijzondere categorieen conform AVG artikel 9)."
**Problem**: "categorieen" → "categorieën" (2x, trema vereist). "brand voice documenten" en "social media accountkoppelingen" mengen Engels/NL — kan "documenten over merkstem" en "koppelingen naar social media-accounts". "contentplanningen" — "content" is toegestaan maar consistent. "contentgeneratie-prompts" is Dunglish; beter "prompts voor contentgeneratie".
**Proposed**: "Wij verzamelen de volgende categorieën persoonsgegevens: Accountgegevens (naam, e-mailadres, bedrijfsnaam, factuurgegevens), Werkruimtegegevens van klanten (documenten over merkstem, koppelingen naar social media-accounts, contentplanningen, doelgroepprofielen), Gebruiksgegevens (activiteitenlogs van het platform, functiegebruik, aantallen uitvoeringen) en AI-interactiegegevens (chatberichten met AI-agenten, transcripties van telefoongesprekken, prompts voor contentgeneratie). Wij verzamelen niet opzettelijk bijzondere persoonsgegevens (bijzondere categorieën zoals bedoeld in AVG artikel 9)."

### legal.sections.privacy.subsections.purpose_of_processing.content
**Issue type**: Onnatuurlijke opsomming / Dunglish
**Current**: "Het leveren van AI Marketing Medewerker diensten (contentcreatie, voice agent operaties, leadkwalificatie, social media management, advertentiecreatie, rapportage), het verbeteren van de dienstkwaliteit en AI-prestaties door geaggregeerde gebruiksanalyse, ..."
**Problem**: "voice agent operaties" is Dunglish (letterlijk "voice agent operations"); NL: "de werking van Voice Agent" of "voice agent-activiteiten". "social media management" is mix NL/EN; bij Nederlandse juridische tekst "social media-beheer". "AI-prestaties door geaggregeerde gebruiksanalyse" — "geaggregeerd" is OK maar zwaar; "door analyse van geaggregeerde gebruiksgegevens" is helderder.
**Proposed**: "Wij verwerken persoonsgegevens voor de volgende doeleinden: het leveren van AI Marketing Medewerker-diensten (contentcreatie, voice agent-activiteiten, leadkwalificatie, social media-beheer, advertentiecreatie, rapportage); het verbeteren van de dienstkwaliteit en AI-prestaties door analyse van geaggregeerde gebruiksgegevens; facturering en abonnementsbeheer; het bieden van technische ondersteuning en klantenservice; en het voldoen aan wettelijke verplichtingen, waaronder fiscale, boekhoudkundige en regelgevende vereisten."

### legal.sections.privacy.subsections.legal_basis.content
**Issue type**: Minor — styling van AVG-artikelnummers
**Current**: "Uitvoering van een overeenkomst (AVG artikel 6(1)(b)) voor het leveren van onze geabonneerde diensten, ..."
**Problem**: "geabonneerde diensten" is Dunglish — bestaat niet. Het bedoelt "de diensten waarop u een abonnement heeft" of eenvoudiger "onze abonnementsdiensten". Verder: AVG-notatie in NL is vaak "artikel 6 lid 1 onder b AVG" (officiële NL-notatie) in plaats van de Engelse numerieke vorm "6(1)(b)". Niet strikt fout, maar gemengd.
**Proposed**: "Onze verwerking van persoonsgegevens is gebaseerd op de volgende rechtsgronden: de uitvoering van een overeenkomst (artikel 6 lid 1 onder b AVG) voor het leveren van onze abonnementsdiensten; gerechtvaardigd belang (artikel 6 lid 1 onder f AVG) voor dienstverbetering, beveiligingsmonitoring en fraudepreventie; toestemming (artikel 6 lid 1 onder a AVG) voor analytische cookies en optionele marketingcommunicatie; en wettelijke verplichting (artikel 6 lid 1 onder c AVG) voor fiscale en regelgevende naleving."

### legal.sections.privacy.subsections.ai_data_processing.content
**Issue type**: Dunglish + Engelse termen in NL juridische context
**Current**: "Onze AI Marketing Medewerker verwerkt gegevens als volgt: De Content Creator skill gebruikt brand voice documenten en contentbriefings om marketingcontent te genereren. ... De Voice Agent skill verwerkt gespreksaudio voor spraakherkenning en antwoordgeneratie. Opnames worden 90 dagen bewaard voor kwaliteitsborging. De Lead Qualifier skill analyseert formulierinzendingen en chatberichten om leads te scoren en te routeren. Lead scoring is adviserend en neemt geen geautomatiseerde beslissingen. AI-providers (OpenAI, Anthropic) verwerken gegevens onder Zero Data Retention beleid, wat betekent dat uw gegevens niet worden gebruikt om AI-modellen te trainen."
**Problem**: "skill" overal is Engels — inconsistent met rest van site die "vaardigheid" gebruikt. "brand voice documenten" = "documenten over merkstem". "te routeren" is OK. "Lead scoring is adviserend en neemt geen geautomatiseerde beslissingen" is grammaticaal fout — het onderwerp "lead scoring" (een activiteit/proces) kan niet "beslissingen nemen"; dat is een dangling subject uit het Engels. Herformuleren. "AI-providers" is Engelstalig; in AVG-context beter "AI-aanbieders" of "AI-dienstverleners". "onder Zero Data Retention beleid" is Engelse genitief-constructie; NL: "volgens een Zero Data Retention-beleid" of "op basis van een beleid voor zero data retention".
**Proposed**: "Onze AI Marketing Medewerker verwerkt gegevens als volgt: De vaardigheid Content Creator gebruikt documenten over de merkstem en contentbriefings om marketinginhoud te genereren. Alleen de minimaal benodigde context wordt naar de AI-aanbieders gestuurd. De vaardigheid Voice Agent verwerkt gespreksaudio voor spraakherkenning en antwoordgeneratie; opnames worden 90 dagen bewaard voor kwaliteitsborging. De vaardigheid Lead Qualifier analyseert formulierinzendingen en chatberichten om leads te scoren en door te sturen. De lead-scoring heeft een adviserend karakter en er worden geen geautomatiseerde besluiten genomen. AI-aanbieders (OpenAI, Anthropic) verwerken gegevens op basis van een Zero Data Retention-beleid, wat betekent dat uw gegevens niet worden gebruikt om AI-modellen te trainen."

### legal.sections.privacy.subsections.data_retention.content
**Issue type**: Ontbrekende diakriet + stijl
**Current**: "Actieve accounts: Alle gegevens worden bewaard voor de duur van de serviceovereenkomst. Na beeindiging: Een exportperiode van 30 dagen wordt geboden, waarna alle gegevens permanent worden verwijderd. ..."
**Problem**: "beeindiging" → "beëindiging". "Een exportperiode van 30 dagen wordt geboden" is lijdend en Engels van structuur ("a period is offered"); NL activer: "Wij bieden een exportperiode van 30 dagen aan".
**Proposed**: "Actieve accounts: alle gegevens worden bewaard voor de duur van de serviceovereenkomst. Na beëindiging: wij bieden een exportperiode van 30 dagen aan, waarna alle gegevens permanent worden verwijderd. Spraakopnames en chatlogs: 90 dagen bewaard na verwerking voor kwaliteitsborging en geschiloplossing. Platformlogs: 90 dagen bewaard. Back-ups: verwijderd binnen 30 dagen na verwijdering van de brongegevens. Factuurgegevens: bewaard conform de Nederlandse belastingwetgeving (7 jaar)."

### legal.sections.privacy.subsections.data_subject_rights.content
**Issue type**: Dunglish / stijl
**Current**: "Op grond van de AVG heeft u het recht op: Inzage in uw persoonsgegevens en het ontvangen van een kopie, rectificatie ... wissing ... beperking van de verwerking ... gegevensoverdraagbaarheid (ontvangst van uw gegevens in een gestructureerd, machineleesbaar formaat), bezwaar tegen verwerking op basis van gerechtvaardigd belang, en intrekking van toestemming op elk moment voor op toestemming gebaseerde verwerking. Om een van deze rechten uit te oefenen, neem contact met ons op via privacy@futuremarketingai.com."
**Problem**: "Inzage ... en het ontvangen van een kopie" — NL AVG-terminologie is "recht op inzage" (niet "inzage en ontvangen van een kopie" — kopie is onderdeel van inzage, hoewel het wel apart genoemd mag worden). "machineleesbaar formaat" — AVG-NL-term is "machineleesbare vorm" of "machineleesbaar formaat" (beide OK). "op toestemming gebaseerde verwerking" is kreupel Dunglish ("consent-based processing"); NL: "verwerkingen die zijn gebaseerd op toestemming" of "verwerking op basis van toestemming". "Om een van deze rechten uit te oefenen, neem contact met ons op" — imperatief in bijzin is Engelse constructie; NL: "Om een van deze rechten uit te oefenen, kunt u contact met ons opnemen".
**Proposed**: "Op grond van de AVG heeft u het recht op: inzage in uw persoonsgegevens (en het ontvangen van een kopie daarvan); rectificatie van onjuiste of onvolledige persoonsgegevens; wissing van uw persoonsgegevens (recht op vergetelheid); beperking van de verwerking van uw persoonsgegevens; gegevensoverdraagbaarheid (ontvangst van uw gegevens in een gestructureerde, gangbare en machineleesbare vorm); bezwaar tegen verwerking op basis van gerechtvaardigd belang; en intrekking van toestemming op elk moment, voor verwerkingen die op toestemming zijn gebaseerd. Om een van deze rechten uit te oefenen, kunt u contact met ons opnemen via privacy@futuremarketingai.com. Wij reageren binnen 30 dagen, conform de AVG."

### legal.sections.privacy.subsections.international_transfers.content
**Issue type**: Dunglish
**Current**: "Voor deze doorgiftes vertrouwen wij op de volgende waarborgen: ... Wij monitoren juridische ontwikkelingen met betrekking tot internationale doorgiftes, inclusief mogelijke aanvechtingen van het DPF."
**Problem**: "vertrouwen wij op" is letterlijke vertaling van "we rely on"; NL juridisch: "hanteren wij" of "maken wij gebruik van". "monitoren" is leenwoord, in juridische tekst beter "volgen" of "houden in de gaten". "aanvechtingen van het DPF" is Dunglish ("challenges to the DPF"); NL: "mogelijke juridische aanvechtingen" of "mogelijke juridische procedures tegen het DPF".
**Proposed**: "Voor deze doorgiftes maken wij gebruik van de volgende waarborgen: het EU-VS Data Privacy Framework (DPF) voor gecertificeerde Amerikaanse bedrijven (OpenAI, Anthropic, Vercel, Stripe), en Standard Contractual Clauses (SCCs) die door de Europese Commissie zijn goedgekeurd, waar DPF-certificering niet beschikbaar is. Waar mogelijk gebruiken wij EU-datacenterregio's om internationale doorgiftes tot een minimum te beperken. Wij volgen juridische ontwikkelingen met betrekking tot internationale doorgiftes nauwgezet, waaronder mogelijke juridische procedures tegen het DPF."

### legal.sections.privacy.subsections.contact.content
**Issue type**: Stijl / correctheid
**Current**: "Verwerkingsverantwoordelijke: Future Marketing AI, Nederland. Voor privacyvragen, verzoeken van betrokkenen of klachten: privacy@futuremarketingai.com. Indien u van mening bent dat uw gegevensbeschermingsrechten zijn geschonden, heeft u het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens (AP) via autoriteitpersoonsgegevens.nl."
**Problem**: Grotendeels correct NL. Twee kleine issues: (1) "gegevensbeschermingsrechten" is een lang samengesteld woord dat niet gangbaar is; AVG-NL zegt "rechten met betrekking tot de bescherming van persoonsgegevens" of simpel "uw privacyrechten". (2) "via autoriteitpersoonsgegevens.nl" — betere formulering met URL is "(website: autoriteitpersoonsgegevens.nl)".
**Proposed**: "Verwerkingsverantwoordelijke: Future Marketing AI, Nederland. Voor privacyvragen, verzoeken van betrokkenen of klachten kunt u contact opnemen via privacy@futuremarketingai.com. Indien u van mening bent dat uw privacyrechten zijn geschonden, heeft u het recht om een klacht in te dienen bij de Autoriteit Persoonsgegevens (AP, autoriteitpersoonsgegevens.nl)."

### legal.sections.cookies.content
**Issue type**: U/je-inconsistentie
**Current**: "Onze website gebruikt essentiele cookies en optionele analytische cookies. Je kunt je cookievoorkeuren beheren via je browserinstellingen."
**Problem**: Wisselt naar "je-vorm" terwijl de rest van de legal-namespace "u-vorm" gebruikt. Daarnaast "essentiele" → "essentiële" (trema vereist).
**Proposed**: "Onze website gebruikt essentiële cookies en optionele analytische cookies. U kunt uw cookievoorkeuren beheren via de instellingen van uw browser."

### legal.sections.disclaimer.content
**Issue type**: U/je-inconsistentie + letterlijke vertaling
**Current**: "De informatie op deze website wordt verstrekt voor algemene informatiedoeleinden. Elk vertrouwen dat je stelt in dergelijke informatie is op eigen risico."
**Problem**: "je" in plaats van "u". Verder: "Elk vertrouwen dat je stelt in dergelijke informatie is op eigen risico" is een 1-op-1 vertaling van "Any reliance you place on such information is at your own risk". In NL klinkt dit on-idiomatisch; natuurlijker: "Het gebruik van deze informatie is voor eigen risico" of "Handelen op basis van deze informatie is voor eigen risico".
**Proposed**: "De informatie op deze website wordt uitsluitend verstrekt voor algemene informatiedoeleinden. Het gebruik van of handelen op basis van deze informatie is voor eigen risico."

### legal.last_updated
**Issue type**: Geen issue
**Current**: "Laatst bijgewerkt: maart 2026"
**Problem**: Correct NL.
**Proposed**: (geen wijziging)

---

## Overzicht trema-fixes (samengevat)

Binnen `legal` namespace ontbreken diakritieken op de volgende plekken (waarschijnlijk JSON-escape-historie):

| Key | Nu | Moet zijn |
|---|---|---|
| `sections.terms.subsections.termination.title` | Beeindiging | Beëindiging |
| `sections.terms.subsections.termination.content` | beeindigen (2x), beeindiging | beëindigen, beëindiging |
| `sections.privacy.subsections.data_collected.content` | categorieen (2x) | categorieën |
| `sections.privacy.subsections.data_retention.content` | beeindiging | beëindiging |
| `sections.privacy.subsections.data_retention.content` | (indirect via ref.) | — |
| `sections.cookies.content` | essentiele | essentiële |

## Overzicht u/je-harmonisatie

Voorstel: de hele `legal` namespace gebruikt **u-vorm** (standaard voor juridische teksten in NL). Twee aanpassingen nodig:
1. `sections.cookies.content` — "Je ... je ... je" → "U ... uw ... uw"
2. `sections.disclaimer.content` — "je" → "u" (met bijgewerkte zinsbouw)
