# NL Audit. Skills: Voice Agent / Email / ManyChat / Lead Qualifier

Scope: namespaces `skills-voice-agent`, `skills-lead-qualifier`, `skills-email-management`, `skills-manychat` in `fmai-nextjs/messages/nl.json` (lines 942-1097, 1661-1734, 2031-2104).

## Summary

- Total keys reviewed: ~125 (4 namespaces, hero/meta/features/how/integrations/useCases/allocation/cta/proof blocks)
- Issues found: 42

Hoofdpatronen:

1. Structurele glossary-overtreding. "skills" in plaats van "vaardigheden" (minstens 6x in integrations-blokken en microcopy), en elke CTA eindigt met "past bij jouw klanten" terwijl de glossary voorschrijft dat "klanten" niet voor eindklanten mag (moet "merken" / "klantportfolio").
2. Dunglish rond communication-jargon. "call logging", "inbound/outbound", "widget deployen", "AI classificatie", "conversation analytics", "lead capture + CRM routing", "flows", "connecten", "editen", "syncen". Hoogste concentratie in lead-qualifier features (feature1 t/m feature4 zijn alle vier Dunglish).
3. Grammaticale breuken (2 harde gevallen). "Chat kwalificeert voor sales-team leads filtert." (lead-qualifier.useCases.useCase1.body) is niet parseerbaar. "hoge belvolume" (voice-agent.useCases.useCase1.body) overtreedt congruentie (het-woord → "hoog belvolume").
4. Typo / wrong word. "meetreizen" (voice-agent.integrations.integration3) moet "meereizen". Probable copy-paste from autocomplete.
5. Hero-subtitles zijn letterlijke Engels-naar-NL vertalingen. Vooral voice-agent hero subtitle (passief, Engelse werkwoordsvolgorde) en email-management hero subtitle (lang, enumeratief Engels).

## Issues

### skills-voice-agent.meta.description
**Issue type**: Dunglish / opsomming zonder lidwoorden
**Current**: "AI-telefoongesprekken, afspraak booking, call-logging, escalatie naar mens. 5 credits per minuut."
**Problem**: "afspraak booking" en "call-logging" zijn Engelse samenstellingen tussen NL tekst. "escalatie naar mens" mist lidwoord.
**Proposed**: "AI-telefoongesprekken, afspraken inplannen, gespreksregistratie, escalatie naar een mens. 5 credits per minuut."

### skills-voice-agent.hero.subtitle
**Issue type**: Dunglish / passief / Engelse woordvolgorde
**Current**: "Inkomende calls worden beantwoord, FAQ worden afgehandeld, afspraken geboekt. Uitgaande campagnes draaien zonder dat je agent-team belt. Escalatie naar mens wanneer het gesprek daarom vraagt."
**Problem**: "calls" Engels, "FAQ worden afgehandeld" plural-congruentie fout, "agent-team" Engels en inhoudelijk verwarrend (waarom zou een agent-team bellen als Clyde belt?), "Escalatie naar mens" hoekig.
**Proposed**: "Inkomende gesprekken beantwoorden, veelgestelde vragen afhandelen, afspraken inplannen. Uitgaande campagnes lopen zonder dat jouw team hoeft te bellen. Clyde schakelt door naar een mens zodra een gesprek daarom vraagt."

### skills-voice-agent.features.feature1.title
**Issue type**: Anglicisme
**Current**: "Inbound calls + FAQ"
**Problem**: "Inbound calls" is pure Engels, ongebruikelijk als kopje op een NL pagina.
**Proposed**: "Inkomende gesprekken + veelgestelde vragen"

### skills-voice-agent.features.feature1.body
**Issue type**: Anglicisme
**Current**: "Clyde beantwoordt veelgestelde vragen in natural language, boekt afspraken in de agenda en escaleert alleen wanneer nodig."
**Problem**: "in natural language" is een anglicisme.
**Proposed**: "Clyde beantwoordt veelgestelde vragen in natuurlijke taal, plant afspraken in de agenda en schakelt alleen door wanneer dat nodig is."

### skills-voice-agent.features.feature2.title
**Issue type**: Anglicisme
**Current**: "Outbound campaigns"
**Proposed**: "Uitgaande campagnes"

### skills-voice-agent.features.feature2.body
**Issue type**: Dunglish
**Current**: "Lijsten aflopen, intake-calls, follow-ups. Clyde belt een contactlijst en logt de resultaten per call."
**Problem**: "intake-calls", "follow-ups", "logt", "per call" zijn allemaal Engels.
**Proposed**: "Lijsten aflopen, intake-gesprekken, opvolgingen. Clyde belt een contactlijst af en legt de uitkomst per gesprek vast."

### skills-voice-agent.features.feature3.title
**Issue type**: Anglicisme
**Current**: "Call logging + transcripties"
**Proposed**: "Gespreksregistratie + transcripties"

### skills-voice-agent.features.feature4.title
**Issue type**: Anglicisme
**Current**: "Human escalation"
**Proposed**: "Doorschakelen naar een mens"

### skills-voice-agent.features.feature4.body
**Issue type**: Anglicisme
**Current**: "Duidelijke rules wanneer Clyde doorschakelt naar een mens. Geen gesprek eindigt zonder correcte afhandeling."
**Problem**: "rules" is Engels; "Geen gesprek eindigt" is letterlijk vertaald uit "No call ends".
**Proposed**: "Heldere regels voor wanneer Clyde doorschakelt. Elk gesprek wordt correct afgehandeld."

### skills-voice-agent.how.step1.title
**Issue type**: Anglicisme
**Current**: "Stem + persona setup"
**Proposed**: "Stem en persona instellen"

### skills-voice-agent.how.step2.title
**Issue type**: Anglicisme (kopje volledig Engels)
**Current**: "Number routing"
**Proposed**: "Nummer koppelen"

### skills-voice-agent.how.step2.body
**Issue type**: Dunglish
**Current**: "Koppel een telefoonnummer (via VAPI). Inbound routes naar Clyde; outbound campaigns worden gepland."
**Problem**: "Inbound routes naar Clyde" is grammaticaal krom (Engels werkwoord als NL zelfstandig naamwoord), "outbound campaigns" Engels.
**Proposed**: "Koppel een telefoonnummer (via VAPI). Inkomende gesprekken gaan naar Clyde; uitgaande campagnes worden ingepland."

### skills-voice-agent.how.step3.body
**Issue type**: Anglicisme
**Current**: "Realtime dashboard voor calls, escalaties en resultaten. Clyde leert van gesprekken voor scherpere antwoorden."
**Proposed**: "Real-time dashboard met gesprekken, escalaties en resultaten. Clyde leert elk gesprek bij voor scherpere antwoorden."

### skills-voice-agent.integrations.integration2
**Issue type**: Dunglish (Engelse metriek-termen)
**Current**: "Reporting. Call-metrics (volume, avg duration, escalation-rate) in wekelijkse digest"
**Problem**: "Call-metrics", "avg duration", "escalation-rate" zijn letterlijk Engels.
**Proposed**: "Reporting. Gespreksmetrics (volume, gemiddelde duur, doorschakelpercentage) in de wekelijkse samenvatting"

### skills-voice-agent.integrations.integration3
**Issue type**: Typo + glossary (skills)
**Current**: "Clyde orchestrator. Gesprek-context meetreizen met andere skills"
**Problem**: "meetreizen" is geen Nederlands woord (bedoeld: "meereizen"). "skills" overtreedt glossary.
**Proposed**: "Clyde orchestrator. Gesprekscontext reist mee met andere vaardigheden"

### skills-voice-agent.useCases.useCase1.body
**Issue type**: Grammatica (genus-congruentie)
**Current**: "Klinieken, tandartsen, therapeuten met hoge belvolume. Clyde handelt intake + booking af."
**Problem**: "het belvolume" → "hoog belvolume" (niet "hoge"). Daarnaast: "intake + booking" Engels.
**Proposed**: "Klinieken, tandartsen en therapeuten met een hoog belvolume. Clyde handelt intake en inplannen af."

### skills-voice-agent.useCases.useCase2.body
**Issue type**: Dunglish (afkorting + samenstelling)
**Current**: "SDRs ontlasten voor eerste-contact calls. Clyde kwalificeert, plant, escaleert."
**Problem**: "SDRs" zonder uitleg in NL-context onduidelijk; "eerste-contact calls" letterlijk uit "first-contact calls".
**Proposed**: "Sales-teams ontlasten voor het eerste contactmoment. Clyde kwalificeert, plant en schakelt door."

### skills-voice-agent.cta.title & skills-lead-qualifier.cta.title & skills-email-management.cta.title & skills-manychat.cta.title
**Issue type**: Glossary (klanten)
**Current**: "Plan een gesprek. We bespreken hoe deze vaardigheid past bij jouw klanten."
**Problem**: CLAUDE.md glossary schrijft voor dat "klanten" niet gebruikt wordt voor eindklanten van een bureau (→ "merken" / "klantportfolio"). Dit patroon komt in alle 4 namespaces terug in `cta.subtitle`.
**Proposed**: "Plan een gesprek. We bespreken hoe deze vaardigheid past bij jouw klantportfolio."

### skills-lead-qualifier.meta.title
**Issue type**: Anglicisme (scoren vs. kwalificeren)
**Current**: "Lead Qualifier. Website chatbot die leads scort en routeert | Clyde"
**Problem**: "scort" is een Engels leenwoord waar "beoordeelt" of "kwalificeert" natuurlijker is. Ook: de bullet zegt "scort en routeert" terwijl we elders "kwalificeren" hanteren.
**Proposed**: "Lead Qualifier. Website-chatbot die leads kwalificeert en doorroutert | Clyde"

### skills-lead-qualifier.meta.description
**Issue type**: Dunglish (meerdere)
**Current**: "AI chatbot op website, lead scoring, CRM routing, conversation analytics. 2 credits per score."
**Problem**: "lead scoring", "CRM routing", "conversation analytics" zijn alle drie Engelse termen.
**Proposed**: "AI-chatbot op de website, lead-kwalificatie, CRM-doorrouting, gespreksanalyse. 2 credits per kwalificatie."

### skills-lead-qualifier.hero.subtitle
**Issue type**: Dunglish / woordvolgorde
**Current**: "Embeddable AI-chatbot op de website van elke klant. Voert kwalificatie-gesprek, scoort intent, routeert warme leads naar CRM of sales. Geen lead gaat verloren door gemiste chats."
**Problem**: "Embeddable" Engels; "scoort intent" anglicisme; "Geen lead gaat verloren" = letterlijke vertaling van "No lead gets lost"; "gemiste chats" Dunglish.
**Proposed**: "Insluitbare AI-chatbot op de website van elk merk. Voert het kwalificatiegesprek, weegt de koopintentie, stuurt warme leads door naar CRM of sales. Geen enkele lead blijft liggen."

### skills-lead-qualifier.features.feature1.title
**Issue type**: Anglicisme
**Current**: "Embeddable chatbot widget"
**Proposed**: "In te sluiten chatbot-widget"

### skills-lead-qualifier.features.feature1.body
**Issue type**: Dunglish
**Current**: "Eén script-tag op elke klant-website. Customizable styling, persona en kennisbasis per klant."
**Problem**: "Customizable styling" is Engels.
**Proposed**: "Eén script-tag op de website van elk merk. Aanpasbare styling, persona en kennisbasis per merk."

### skills-lead-qualifier.features.feature2.body
**Issue type**: Anglicisme (intent-signalen)
**Current**: "Op basis van intent-signalen (budget, tijdlijn, specificiteit) berekent Clyde een lead score. Direct zichtbaar in CRM."
**Proposed**: "Op basis van koopsignalen (budget, tijdlijn, concreetheid) bepaalt Clyde een leadscore. Direct zichtbaar in het CRM."

### skills-lead-qualifier.features.feature3.body
**Issue type**: Dunglish
**Current**: "Warme leads auto-gerouteerd naar HubSpot/Salesforce/Pipedrive met gespreks-samenvatting. Cold leads in nurture-flow."
**Problem**: "auto-gerouteerd" Dunglish; "Cold leads" Engels; "nurture-flow" jargon.
**Proposed**: "Warme leads gaan automatisch naar HubSpot, Salesforce of Pipedrive, inclusief gesprekssamenvatting. Koude leads belanden in een opvolgflow."

### skills-lead-qualifier.features.feature4.title
**Issue type**: Anglicisme
**Current**: "Conversation analytics"
**Proposed**: "Gespreksanalyse"

### skills-lead-qualifier.features.feature4.body
**Issue type**: Dunglish / marketingcliché
**Current**: "Welke vragen komen vaak voor, waar drop-off, welke flows converteren het beste. Continuous optimization."
**Problem**: "drop-off", "flows", "Continuous optimization" zijn Engelse termen.
**Proposed**: "Welke vragen keren vaak terug, waar leads afhaken, welke gespreksroutes het best converteren. Doorlopend scherper."

### skills-lead-qualifier.how.step2.body
**Issue type**: Anglicisme
**Current**: "Eén embed-tag op de website. Klaar. Clyde start met praten."
**Problem**: "start met praten" is letterlijke vertaling van "starts talking".
**Proposed**: "Eén embed-tag op de website. Klaar. Clyde begint direct gesprekken."

### skills-lead-qualifier.how.step3.body
**Issue type**: Anglicisme
**Current**: "Configureer drempels: score 80+ gaat direct naar sales-team, score 40-80 naar CRM-nurture, <40 naar info-email."
**Problem**: "CRM-nurture" is jargon; "info-email" compound is Dunglish.
**Proposed**: "Stel drempels in: score 80+ gaat direct naar het sales-team, score 40-80 naar de CRM-opvolging, lager dan 40 naar het algemene info-adres."

### skills-lead-qualifier.integrations.integration1
**Issue type**: Dunglish
**Current**: "Voice Agent. Chat leads kunnen worden opgevolgd met calls"
**Problem**: "Chat leads" en "calls" zijn Engels; passief werkwoord omslachtig.
**Proposed**: "Voice Agent. Chat-leads worden opgevolgd met telefoongesprekken"

### skills-lead-qualifier.integrations.integration2
**Issue type**: Anglicisme
**Current**: "Email Management. Follow-up emails naar gequalificeerde leads"
**Problem**: "Follow-up" Engels; "gequalificeerde" moet "gekwalificeerde" zijn.
**Proposed**: "Email Management. Opvolgmails naar gekwalificeerde leads"

### skills-lead-qualifier.integrations.integration3
**Issue type**: Dunglish
**Current**: "Reporting. Conversion funnel + cost-per-lead per bron"
**Problem**: "Conversion funnel" en "cost-per-lead" Engels.
**Proposed**: "Reporting. Conversietrechter en kosten per lead per bron"

### skills-lead-qualifier.useCases.useCase1.body
**Issue type**: Harde grammaticale breuk (onleesbaar)
**Current**: "SaaS, diensten-bureaus, consultancies. Chat kwalificeert voor sales-team leads filtert."
**Problem**: De tweede zin heeft twee werkwoorden zonder voegwoord en is niet te parseren. Oorspronkelijke intentie waarschijnlijk: "Chat kwalificeert leads en filtert ze voor het sales-team."
**Proposed**: "SaaS, dienstenbureaus, consultancies. De chat kwalificeert leads en filtert ze voor het sales-team."

### skills-lead-qualifier.useCases.useCase2.body
**Issue type**: Anglicisme
**Current**: "Product-vragen afhandelen + warme kopers identificeren voor hoog-marge upsell calls."
**Problem**: "hoog-marge upsell calls" is Engels gestapeld; "+" in vloeiende zin is onnatuurlijk.
**Proposed**: "Productvragen afhandelen en warme kopers herkennen voor telefonische upsell-gesprekken met hoge marge."

### skills-lead-qualifier.cta.title
**Issue type**: Samenstelling
**Current**: "Klaar om lead kwalificatie aan Clyde over te dragen?"
**Problem**: "lead kwalificatie" is een samenstelling en hoort aaneen of met streepje.
**Proposed**: "Klaar om leadkwalificatie aan Clyde over te dragen?"

### skills-lead-qualifier.proof.subtitle
**Issue type**: Dunglish
**Current**: "Multi-platform embedbaar. Probeer hieronder of zie de SKC setup."
**Problem**: "embedbaar" en "SKC setup" zijn Engelse samenstellingen; "zie de SKC setup" is onaffe NL.
**Proposed**: "Insluitbaar op meerdere platformen. Probeer hieronder, of bekijk de setup van SkinClarity Club."

### skills-email-management.meta.description
**Issue type**: Dunglish
**Current**: "Gmail inbox classificatie, smart labels, dagelijkse digest, suggested replies. 5 cr per actie."
**Problem**: "smart labels", "suggested replies", "digest" zijn Engels.
**Proposed**: "Gmail-inbox-classificatie, slimme labels, dagelijkse samenvatting, voorgestelde antwoorden. 5 cr per actie."

### skills-email-management.hero.subtitle
**Issue type**: Dunglish / lange opsomming
**Current**: "Geen email campaigns. Dit is inbox-classify: Clyde leest binnenkomende emails, voegt smart labels toe (urgent/actie/info), stelt prioriteit en stuurt een dagelijkse digest. Je begint je dag met overzicht, niet met chaos."
**Problem**: "email campaigns", "inbox-classify", "smart labels", "digest" zijn Engels. De kopje-achtige Engelse sleutelwoorden in lopende NL tekst voelen vertaald.
**Proposed**: "Geen e-mailcampagnes. Wel inbox-classificatie: Clyde leest binnenkomende mail, voegt slimme labels toe (urgent, actie, info), stelt prioriteit en stuurt elke ochtend een samenvatting. Je begint de dag met overzicht, niet met chaos."

### skills-email-management.features.feature2.body
**Issue type**: Onnatuurlijke constructie
**Current**: "Auto-labels zoals \"Van klant X\", \"Factuur\", \"Sollicitatie\", \"Sales-lead\" via klant-context."
**Problem**: "Sales-lead" Engels; "via klant-context" is onhandig zonder lidwoord/werkwoord.
**Proposed**: "Automatische labels als \"Van klant X\", \"Factuur\", \"Sollicitatie\" of \"Verkooplead\", afgeleid uit de klantcontext."

### skills-email-management.features.feature4.body
**Issue type**: Hybride-taalgebruik + verloren em-dash vervanger
**Current**: "Voor veel-voorkomende emails stelt Clyde een concept-antwoord voor in jouw brand voice , 1-klik versturen of editen."
**Problem**: "brand voice" Engels; "editen" is Dunglish; de " , " (spatie-komma-spatie) is een lelijke restant van een verwijderd em-dash.
**Proposed**: "Voor veelvoorkomende mails stelt Clyde een conceptantwoord voor in jouw merkstem: met één klik versturen of aanpassen."

### skills-email-management.how.step1.body
**Issue type**: Dunglish
**Current**: "Connect je Gmail (of die van je klant) via OAuth. Alleen read + label permissions, geen send zonder review."
**Problem**: "Connect" Engelse imperatief; "read + label permissions" Engels; "geen send zonder review" Dunglish.
**Proposed**: "Koppel je Gmail (of die van de klant) via OAuth. Alleen rechten om te lezen en te labelen, nooit om namens jou te versturen zonder jouw akkoord."

### skills-email-management.how.step2.body
**Issue type**: Anglicisme
**Current**: "Week 1: Clyde classificeert, jij corrigeert. Week 2+: accuracy 95%+ voor jouw specifieke context."
**Problem**: "accuracy" Engels.
**Proposed**: "Week 1: Clyde classificeert, jij corrigeert. Vanaf week 2: 95%+ nauwkeurigheid voor jouw specifieke context."

### skills-email-management.how.step3.body
**Issue type**: Dunglish
**Current**: "Dagelijkse digest in dashboard. Reply suggesties 1-klik sturen of editen in Gmail."
**Problem**: "digest", "Reply suggesties" Engels; "editen" Dunglish; grammaticaal incompleet (geen werkwoord in tweede zin).
**Proposed**: "Dagelijkse samenvatting in het dashboard. Voorgestelde antwoorden verstuur of bewerk je met één klik in Gmail."

### skills-email-management.integrations.integration1
**Issue type**: Anglicisme
**Current**: "Lead Qualifier. Sales-emails naar leads via scoring-flow"
**Proposed**: "Lead Qualifier. Verkoopmails naar leads via de kwalificatieflow"

### skills-email-management.integrations.integration2
**Issue type**: Glossary (skills)
**Current**: "Clyde orchestrator. Email-context deelbaar met andere skills"
**Proposed**: "Clyde orchestrator. E-mailcontext deelbaar met andere vaardigheden"

### skills-email-management.integrations.integration3
**Issue type**: Anglicisme
**Current**: "Reporting. Email-volume + response-time metrics"
**Proposed**: "Reporting. Metrics voor e-mailvolume en responstijd"

### skills-email-management.useCases.useCase1.body
**Issue type**: Dunglish + verwarrende naam
**Current**: "Wanneer je 15 klanten hebt, krijg je 100+ emails per dag. Clyde sorteert, Sindy reageert op wat echt telt."
**Problem**: "Inbox-overload" in de titel is Engels. In de body-tekst wordt plots "Sindy" genoemd; deze pagina is generiek agency-copy, de Sindy-referentie hoort in de case-study en haalt de lezer uit de tekst.
**Proposed**: "Bij 15 merken krijg je 100+ mails per dag. Clyde sorteert, jij reageert alleen op wat echt telt."

### skills-email-management.useCases.useCase1.title
**Issue type**: Anglicisme
**Current**: "Inbox-overload bij agency operators"
**Proposed**: "Overvolle inbox bij bureau-operators"

### skills-email-management.useCases.useCase2.body
**Issue type**: Dunglish
**Current**: "Eén label-systeem per klant-portfolio. Urgent van klant X meteen zichtbaar, niet verstopt tussen nieuwsbrieven."
**Proposed**: "Eén labelsysteem over je hele klantportfolio. Urgente mail van klant X is meteen zichtbaar, niet verstopt tussen nieuwsbrieven."

### skills-manychat.meta.description
**Issue type**: Dunglish
**Current**: "Instagram DM keyword triggers, AI-antwoorden, lead capture, CRM routing. 2 cr per 10 DMs."
**Problem**: "lead capture", "CRM routing", "DMs" Engels.
**Proposed**: "Instagram-DM's met keyword-triggers, AI-antwoorden, leadopvang en CRM-doorrouting. 2 cr per 10 DM's."

### skills-manychat.hero.subtitle
**Issue type**: Dunglish
**Current**: "Keyword triggers (\"INFO\", \"PRIJS\") starten AI-flows die kwalificeren, info delen en warme leads naar CRM sturen. Geen gemiste DM. Coming soon."
**Problem**: "AI-flows", "Coming soon" in de body (hoort niet in lopende NL-tekst); "info delen" is afgeknot NL.
**Proposed**: "Keyword-triggers (\"INFO\", \"PRIJS\") starten AI-gesprekken die leads kwalificeren, informatie delen en warme leads naar het CRM sturen. Geen DM blijft onbeantwoord. Binnenkort beschikbaar."

### skills-manychat.features.feature1.body
**Issue type**: Dunglish
**Current**: "Configureer \"INFO\", \"GRATIS\", \"PRIJS\" per post/Reel. Wanneer iemand DMt, start de flow."
**Problem**: "DMt" is een werkwoord-anglicisme; "flow" Engels jargon.
**Proposed**: "Stel \"INFO\", \"GRATIS\" of \"PRIJS\" in per post of Reel. Stuurt iemand een DM, dan start het gesprek."

### skills-manychat.features.feature2.body
**Issue type**: Anglicisme + glossary (klant = eindklant)
**Current**: "Niet \"auto-responder\". Clyde praat als de klant. Memory per gebruiker, context-aware."
**Problem**: "Memory", "context-aware" zijn Engels. Daarnaast is "de klant" hier het merk waarvan de DM's worden beheerd, niet het bureau, wat verwarring oproept in de context van de hele site.
**Proposed**: "Geen auto-responder. Clyde klinkt als het merk zelf. Geheugen per gebruiker, contextbewust."

### skills-manychat.features.feature3.title
**Issue type**: Anglicisme
**Current**: "Lead capture + CRM routing"
**Proposed**: "Lead vastleggen en doorrouten naar CRM"

### skills-manychat.features.feature4.body
**Issue type**: Dunglish werkwoord
**Current**: "Welke keyword performs, welke flow converteert, waar drop-off. Iteratief verbeteren."
**Problem**: "performs" is Engels werkwoord; "flow" Engels; "drop-off" Engels.
**Proposed**: "Welk keyword presteert, welk gespreksscript converteert, waar lezers afhaken. Iteratief verbeteren."

### skills-manychat.how.step1.body
**Issue type**: Anglicisme werkwoord
**Current**: "Instagram Business connecten via ManyChat. Vereist Meta Business-akkoord."
**Problem**: "connecten" is Dunglish; "Business-akkoord" is vertaling van "Business approval", natuurlijker is "goedkeuring".
**Proposed**: "Instagram Business koppelen via ManyChat. Vereist goedkeuring van Meta Business."

### skills-manychat.how.step2.body
**Issue type**: Anglicisme
**Current**: "Per product/campagne: keyword → flow → routing. Clyde stelt flows voor op basis van doelstelling."
**Proposed**: "Per product of campagne: keyword → gespreksscript → doorrouting. Clyde stelt scripts voor op basis van je doelstelling."

### skills-manychat.how.step3.body
**Issue type**: Anglicisme
**Current**: "Clyde reageert binnen seconden. Dashboard toont live conversaties, conversies, drop-offs."
**Problem**: "drop-offs" Engels.
**Proposed**: "Clyde reageert binnen enkele seconden. Het dashboard toont live gesprekken, conversies en uitval."

### skills-manychat.integrations.integration3
**Issue type**: Dunglish + glossary
**Current**: "Clyde orchestrator. DM context shareable met andere skills"
**Problem**: "shareable" Engels; "skills" overtreedt glossary; zin heeft geen werkwoord.
**Proposed**: "Clyde orchestrator. DM-context is deelbaar met andere vaardigheden"

### skills-manychat.useCases.useCase1.body
**Issue type**: Dunglish
**Current**: "Reel met \"DM PRIJS voor prijslijst\". Clyde stuurt + kwalificeert + routeert naar shop."
**Problem**: "+" als opsomming onnatuurlijk; "routeert naar shop" letterlijk uit "routes to shop".
**Proposed**: "Reel met \"DM PRIJS voor prijslijst\". Clyde stuurt, kwalificeert en verwijst door naar de webshop."

### skills-manychat.useCases.useCase2.title
**Issue type**: Anglicisme
**Current**: "Service-bureaus met Instagram lead-gen"
**Proposed**: "Dienstenbureaus met Instagram als leadkanaal"

### skills-manychat.useCases.useCase2.body
**Issue type**: Woordvolgorde / Dunglish
**Current**: "Posts op LinkedIn gaan naar website; Instagram posts gaan naar DM. Clyde schaalt beide."
**Problem**: "gaan naar DM" is afgeknot NL; ontbrekend lidwoord bij "website".
**Proposed**: "LinkedIn-posts leiden naar de website, Instagram-posts naar DM. Clyde schaalt beide kanalen op."
