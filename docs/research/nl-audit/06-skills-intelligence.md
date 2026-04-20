# NL Audit — Skills: Research / SEO-GEO / Reporting / Clyde

## Summary
- Total keys reviewed: ~180 (4 namespaces × gemiddeld 45 keys)
- Issues found: 58

Bevindingen per categorie:
- Dunglish / anglicismen: 34
- Woordvolgorde / onnatuurlijk: 8
- Omslachtige zinnen: 6
- Marketing-clichés / buzzwords: 4
- Glossary-inconsistenties: 4
- Grammaticale fouten / typo's: 2

De intelligence-skills (reporting, research, SEO/GEO) lopen vol met Engelse vakjargon die onvertaald blijft. Termen als "digest", "anomaly detection", "Set-and-forget", "actionable insights", "natural language", "drop-alerts" en "rank tracking" staan op plekken waar een Nederlandse term past. `skills-clyde` is relatief schoon, maar heeft twee belangrijke afkortingen/typo's ("ipv") en een paar anglicismen ("Corrections", "Orkestratie").

---

## Issues

### skills-reporting

#### skills-reporting.meta.title
**Issue type**: Dunglish
**Current**: "Reporting. Dashboards, digests, anomaly detection | Clyde"
**Problem**: "Reporting", "digests", "anomaly detection" zijn onvertaald. Nederlandstalige prospect scant deze title en ziet drie Engelse begrippen.
**Proposed**: "Rapportage. Dashboards, weekoverzichten, afwijkingsdetectie | Clyde"

#### skills-reporting.meta.description
**Issue type**: Dunglish
**Current**: "Wekelijkse performance digests, KPI dashboards, anomaly detection met alerts. 5 credits per rapport."
**Problem**: "performance digests" en "anomaly detection met alerts" blijven Engels. "Performance" = "prestaties", "digest" = "overzicht/samenvatting".
**Proposed**: "Wekelijkse prestatie-overzichten, KPI-dashboards en afwijkingsdetectie met meldingen. 5 credits per rapport."

#### skills-reporting.hero.subtitle
**Issue type**: Dunglish + omslachtig
**Current**: "Automatische performance digests, real-time KPI dashboards, anomaly detection met alerts. Maandag 08:00 heb je een overzicht in je inbox. Geen handmatige Notion-updates meer."
**Problem**: Vier Engelse termen op rij ("performance digests", "real-time", "anomaly detection", "alerts"). "Real-time" mag blijven maar rest moet NL.
**Proposed**: "Automatische prestatie-overzichten, live KPI-dashboards, afwijkingsdetectie met meldingen. Maandag 08:00 heb je een overzicht in je inbox. Geen handmatige Notion-updates meer."

#### skills-reporting.features.feature1.title
**Issue type**: Dunglish
**Current**: "Wekelijkse performance digest"
**Problem**: "Performance digest" is tweemaal Engels.
**Proposed**: "Wekelijkse prestatie-samenvatting"

#### skills-reporting.features.feature1.body
**Issue type**: Dunglish + typo
**Current**: "Maandag 08:00 in je inbox: top KPIs, trends, anomalieen, aanbevolen acties. Clyde schrijft de verhaallijn."
**Problem**: "anomalieen" mist trema (moet "anomalieën" zijn). "Top KPIs" is acceptabel maar "belangrijkste KPI's" leest beter.
**Proposed**: "Maandag 08:00 in je inbox: belangrijkste KPI's, trends, afwijkingen, aanbevolen acties. Clyde schrijft de verhaallijn."

#### skills-reporting.features.feature2.title
**Issue type**: Acceptabel maar mixed
**Current**: "Real-time KPI dashboards"
**Problem**: "Real-time" is ingeburgerd, maar "Live KPI-dashboards" klinkt Nederlandser en loopt beter met de rest van de pagina.
**Proposed**: "Live KPI-dashboards"

#### skills-reporting.features.feature2.body
**Issue type**: Dunglish
**Current**: "Cross-platform: social metrics, website traffic, sales/conversie, ad performance. Live dashboard, filterbaar per klant/periode."
**Problem**: "Cross-platform", "social metrics", "website traffic", "ad performance" zijn alle vier Engels. Klinkt als Google Translate.
**Proposed**: "Alle kanalen op één plek: socialcijfers, websitebezoek, omzet/conversie, advertentieprestaties. Live dashboard, filterbaar per klant en periode."

#### skills-reporting.features.feature3.title
**Issue type**: Dunglish
**Current**: "Anomaly detection"
**Problem**: Volledig Engels als feature-titel op een NL-pagina.
**Proposed**: "Afwijkingsdetectie"

#### skills-reporting.features.feature3.body
**Issue type**: Dunglish + onduidelijk vakjargon
**Current**: "Wanneer metrics 2+ stddev afwijken van normaal krijg je een alert. Geen verrassing bij maandrapportage."
**Problem**: "Metrics", "stddev", "alert" zijn alle drie Engels. "Stddev" (standaarddeviatie) is te technisch voor een marketingpagina.
**Proposed**: "Wanneer een cijfer significant afwijkt van het normale patroon, krijg je een melding. Geen verrassingen bij de maandrapportage."

#### skills-reporting.features.feature4.body
**Issue type**: Dunglish
**Current**: "Vraag in natural language: \"Rapport voor klant X over Q3 met focus op Instagram vs LinkedIn.\" Clyde bouwt het."
**Problem**: "Natural language" is Engels. "In gewone taal" of "in spreektaal" werkt perfect in het NL.
**Proposed**: "Vraag het in gewone taal: \"Rapport voor klant X over Q3 met focus op Instagram versus LinkedIn.\" Clyde bouwt het."

#### skills-reporting.how.step1.title
**Issue type**: Dunglish
**Current**: "Data sources koppelen"
**Problem**: "Data sources" is Engels.
**Proposed**: "Databronnen koppelen"

#### skills-reporting.how.step1.body
**Issue type**: Dunglish
**Current**: "Instagram, Google Analytics, Shopify, Ads Manager, CRM. OAuth-koppeling per klant."
**Problem**: Prima, tools blijven tools. OAuth is standaardterm. Geen wijziging nodig.
**Proposed**: (geen wijziging)

#### skills-reporting.how.step2.title
**Issue type**: Dunglish
**Current**: "KPI definitions"
**Problem**: "Definitions" is Engels terwijl de rest van de pagina NL is.
**Proposed**: "KPI's definiëren"

#### skills-reporting.how.step2.body
**Issue type**: Dunglish + grammaticafout
**Current**: "Wat is \"succes\" voor deze klant? Definieer top-5 KPIs; Clyde track ze continu."
**Problem**: "Clyde track" is foute conjugatie (moet "trackt" of "volgt"). "Top-5 KPIs" missen apostrof.
**Proposed**: "Wat is \"succes\" voor deze klant? Definieer de top-5 KPI's; Clyde volgt ze continu."

#### skills-reporting.how.step3.title
**Issue type**: Dunglish
**Current**: "Schedule + alerts"
**Problem**: Beide woorden Engels. "Planning + meldingen" is directe NL vertaling.
**Proposed**: "Planning en meldingen"

#### skills-reporting.how.step3.body
**Issue type**: Dunglish + cliché
**Current**: "Wanneer moet de digest komen (bijv. maandag 08:00)? Welke metrics triggeren alerts? Set-and-forget."
**Problem**: "Digest", "metrics triggeren alerts", "Set-and-forget" zijn allemaal Engels. "Set-and-forget" is marketing-jargon.
**Proposed**: "Wanneer moet het overzicht komen (bijv. maandag 08:00)? Welke cijfers triggeren een melding? Eenmalig instellen, daarna draait het vanzelf."

#### skills-reporting.useCases.useCase2.title
**Issue type**: Dunglish / anglicisme
**Current**: "Operators die data-driven willen werken"
**Problem**: "Data-driven" is een Engels buzzword. "Datagedreven" of liever "op basis van data" klinkt Nederlandser.
**Proposed**: "Operators die op basis van data willen beslissen"

#### skills-reporting.useCases.useCase2.body
**Issue type**: Dunglish
**Current**: "Welke content werkt, welke campagnes ROI hebben, waar de portfolio-groei zit. Transparant en auditeerbaar."
**Problem**: "Auditeerbaar" bestaat in NL maar is ambtenarentaal. "Controleerbaar" is natuurlijker.
**Proposed**: "Welke content werkt, welke campagnes ROI opleveren, waar de portfolio-groei zit. Transparant en controleerbaar."

#### skills-reporting.cta.title
**Issue type**: Klein woordvolgorde-issue
**Current**: "Klaar om rapportages aan Clyde over te dragen?"
**Problem**: Prima. Geen wijziging nodig.
**Proposed**: (geen wijziging)

---

### skills-research

#### skills-research.meta.description
**Issue type**: Acceptabel
**Current**: "Geautomatiseerd marktonderzoek, trend monitoring, concurrentie-analyse met bronvermelding. 3 credits per query."
**Problem**: "Trend monitoring" mag blijven (ingeburgerd), maar "query" is Engels terwijl "zoekopdracht" of "vraag" beter is.
**Proposed**: "Geautomatiseerd marktonderzoek, trendmonitoring en concurrentie-analyse met bronvermelding. 3 credits per vraag."

#### skills-research.hero.subtitle
**Issue type**: Dunglish
**Current**: "Trend monitoring in de niche van elke klant, concurrentie-analyse met benchmarks, content-ideeën met bronvermelding. Elke insight heeft een bron zodat jij het kunt verifiëren. Geen LLM-hallucinaties als research-input."
**Problem**: "Insight" (inzicht), "research-input" (onderzoeksinput), "benchmarks" zijn alle drie Engels in een NL zin. "Insight" vooral is een klassiek anglicisme.
**Proposed**: "Trendmonitoring in de niche van elke klant, concurrentie-analyse met benchmarks, content-ideeën met bronvermelding. Elk inzicht heeft een bron zodat jij het kunt verifiëren. Geen LLM-hallucinaties als onderzoeksbasis."

#### skills-research.features.feature2.body
**Issue type**: Dunglish
**Current**: "Wie zijn de key spelers, wat doen ze, wat zegt hun content-strategie over hun positionering. Gap-analyse voor jouw klant."
**Problem**: "Key spelers" (belangrijkste spelers), "Gap-analyse" is halfvertaald. Ook mist vraagteken.
**Proposed**: "Wie zijn de belangrijkste spelers, wat doen ze, wat zegt hun contentstrategie over hun positionering? Gat-analyse voor jouw klant."

#### skills-research.features.feature3.body
**Issue type**: Dunglish
**Current**: "Actionable content-voorstellen met onderliggende bronnen. Geen \"AI bedacht dit\". Elke bewering is naspeurbaar."
**Problem**: "Actionable" is een klassiek anglicisme. "Praktisch toepasbaar" of "direct bruikbaar" is NL.
**Proposed**: "Direct bruikbare content-voorstellen met onderliggende bronnen. Geen \"AI heeft dit bedacht\". Elke bewering is naspeurbaar."

#### skills-research.features.feature4.title
**Issue type**: Dunglish
**Current**: "Actionable insights"
**Problem**: Letterlijk twee anglicismen achter elkaar. Feature-titel op NL-pagina.
**Proposed**: "Bruikbare inzichten"

#### skills-research.features.feature4.body
**Issue type**: Dunglish + woordvolgorde
**Current**: "Niet \"de trend is X\" maar \"gezien trend X, jouw klant Y kan action Z doen\". Aanbevelingen met context."
**Problem**: "Action" is Engels. Woordvolgorde "jouw klant Y kan action Z doen" is onlogisch NL.
**Proposed**: "Niet \"de trend is X\", maar \"gezien trend X kan jouw klant Y actie Z ondernemen\". Aanbevelingen met context."

#### skills-research.how.step1.body
**Issue type**: Dunglish
**Current**: "Per klant: welke niche, welke 3-5 key concurrenten, welke keywords en thema's monitor je?"
**Problem**: "Key concurrenten" (belangrijkste concurrenten), "monitor je" (volg je).
**Proposed**: "Per klant: welke niche, welke 3-5 belangrijkste concurrenten, welke zoekwoorden en thema's volg je?"

#### skills-research.how.step2.title
**Issue type**: Dunglish
**Current**: "Monitoring activeren"
**Problem**: "Monitoring" mag blijven als zelfstandig naamwoord (ingeburgerd), maar "Volgen activeren" of "Monitoring starten" is natuurlijker.
**Proposed**: "Monitoring starten"

#### skills-research.how.step2.body
**Issue type**: Dunglish
**Current**: "Clyde draait continu. Nieuws, social, search data. Alerts bij significante veranderingen."
**Problem**: "Social", "search data", "Alerts" zijn alle drie Engels. Telegramstijl mag, maar niet als alles Engels is.
**Proposed**: "Clyde draait continu. Nieuws, social media, zoekdata. Meldingen bij significante veranderingen."

#### skills-research.how.step3.title
**Issue type**: Dunglish
**Current**: "Query op demand"
**Problem**: "Query" en "on demand" zijn beide Engels, en "op demand" is zelfs foute spelling (moet "on demand" of "op aanvraag").
**Proposed**: "Op aanvraag bevragen"

#### skills-research.how.step3.body
**Issue type**: Dunglish
**Current**: "Vraag in natural language: \"Wat doen concurrenten op thema X?\". Clyde levert gestructureerd antwoord met bronnen."
**Problem**: "Natural language" is Engels.
**Proposed**: "Stel een vraag in gewone taal: \"Wat doen concurrenten op thema X?\". Clyde levert een gestructureerd antwoord met bronnen."

#### skills-research.useCases.useCase1.title
**Issue type**: Dunglish
**Current**: "Content-strategen zonder tijd voor diepe research"
**Problem**: "Diepe research" klinkt als directe vertaling van "deep research". Natuurlijker is "diepgaand onderzoek".
**Proposed**: "Contentstrategen zonder tijd voor diepgaand onderzoek"

#### skills-research.useCases.useCase1.body
**Issue type**: Dunglish
**Current**: "Geen 3 uur op Google per content-kalender. Clyde levert de achtergrond; jij neemt strategische beslissingen."
**Problem**: Acceptabel, maar "content-kalender" is half-vertaald. "Contentkalender" (aan elkaar) is NL-schrijfwijze.
**Proposed**: "Geen drie uur zoekwerk op Google per contentkalender. Clyde levert de achtergrond, jij neemt de strategische beslissingen."

#### skills-research.useCases.useCase2.body
**Issue type**: Woordvolgorde
**Current**: "Nieuwe klant in een branche waar je niet thuis bent? Clyde bouwt in een dag een niche-briefing."
**Problem**: Prima maar "thuis bent in" klinkt sterker. Verder acceptabel.
**Proposed**: "Nieuwe klant in een branche waar je niet in thuis bent? Clyde bouwt binnen een dag een niche-briefing."

---

### skills-seo-geo

#### skills-seo-geo.meta.description
**Issue type**: Dunglish
**Current**: "Technische SEO audits, keyword tracking, Core Web Vitals, AI citation monitoring (ChatGPT/Perplexity). 5 cr audit / 3 cr rapport."
**Problem**: "Keyword tracking", "AI citation monitoring" zijn Engels. SEO en Core Web Vitals zijn vakterm, mogen blijven.
**Proposed**: "Technische SEO-audits, zoekwoordtracking, Core Web Vitals en AI-citaatmonitoring (ChatGPT/Perplexity). 5 cr audit / 3 cr rapport."

#### skills-seo-geo.hero.title
**Issue type**: Acceptabel
**Current**: "Clyde monitort je SEO én AI-citaties."
**Problem**: Prima. "Monitort" is ingeburgerd werkwoord.
**Proposed**: (geen wijziging)

#### skills-seo-geo.hero.subtitle
**Issue type**: Marketing-cliché + Dunglish
**Current**: "Technische SEO audits + keyword tracking + Core Web Vitals. Plus GEO: hoe vaak wordt je merk geciteerd door ChatGPT, Perplexity en Google AI Overviews? De nieuwe search-laag is AI-gedreven. Clyde houdt je daar zichtbaar."
**Problem**: "Keyword tracking" (zoekwoordtracking), "search-laag" (zoeklaag), "AI-gedreven" is direct vertaald uit "AI-driven".
**Proposed**: "Technische SEO-audits, zoekwoordtracking en Core Web Vitals. Plus GEO: hoe vaak wordt je merk geciteerd door ChatGPT, Perplexity en Google AI Overviews? De nieuwe zoeklaag draait op AI. Clyde zorgt dat je daar zichtbaar blijft."

#### skills-seo-geo.features.feature1.body
**Issue type**: Dunglish
**Current**: "Periodieke crawl: broken links, ontbrekende meta tags, slow pages, mobile-friendliness, structured data. Prioritized fix-lijst."
**Problem**: "Broken links", "slow pages", "mobile-friendliness", "Prioritized fix-lijst" zijn alle Engels. Dit leest als een Engelse release note.
**Proposed**: "Periodieke crawl: gebroken links, ontbrekende meta tags, trage pagina's, mobielvriendelijkheid, structured data. Geprioriteerde fixlijst."

#### skills-seo-geo.features.feature2.title
**Issue type**: Dunglish
**Current**: "Keyword ranking tracking"
**Problem**: Drie Engelse woorden op rij als feature-titel.
**Proposed**: "Zoekwoordposities volgen"

#### skills-seo-geo.features.feature2.body
**Issue type**: Dunglish
**Current**: "Dagelijks je posities checken op Google voor target keywords. Concurrent-vergelijking. Drop-alerts."
**Problem**: "Target keywords" (doelwoorden/zoekwoorden), "Drop-alerts" (daalmeldingen).
**Proposed**: "Dagelijks je posities checken op Google voor de zoekwoorden die ertoe doen. Vergelijking met concurrenten. Meldingen bij positieverlies."

#### skills-seo-geo.features.feature3.body
**Issue type**: Marketing-cliché
**Current**: "LCP, FID, CLS per page. Trend over tijd. Alert bij achteruitgang. Google ranking factor #1."
**Problem**: "Page" (pagina), "Alert" (melding), "Google ranking factor #1" is buzzword en feitelijk overdreven.
**Proposed**: "LCP, FID, CLS per pagina. Trend over tijd. Melding bij achteruitgang. Belangrijke Google-rankingfactor."

#### skills-seo-geo.features.feature4.body
**Issue type**: Dunglish + marketing-cliché
**Current**: "Vraagt ChatGPT/Perplexity vragen over je niche. Wordt je merk genoemd? Hoe vaak? In welke context? Nieuwe USP."
**Problem**: "Nieuwe USP" is Engels buzzword, bovendien ongepast hier (USP staat er niet qua functie).
**Proposed**: "Stelt ChatGPT en Perplexity vragen over je niche. Wordt je merk genoemd? Hoe vaak? In welke context? Nieuwe vorm van zichtbaarheid."

#### skills-seo-geo.how.step1.body
**Issue type**: Dunglish
**Current**: "Clyde crawlt de site, identificeert structure + key pages. Upload keyword-lijst (of laat Clyde er een samenstellen)."
**Problem**: "Structure" (structuur), "key pages" (belangrijkste pagina's), "Upload" als werkwoord is direct Engels, "keyword-lijst" halfvertaald.
**Proposed**: "Clyde crawlt de site en bepaalt de structuur en belangrijkste pagina's. Lever een zoekwoordenlijst aan (of laat Clyde er een samenstellen)."

#### skills-seo-geo.how.step3.body
**Issue type**: Dunglish
**Current**: "Rankings, audit-issues, GEO-citations, Core Web Vitals. Alles in één dashboard + wekelijkse digest."
**Problem**: "Rankings", "audit-issues", "GEO-citations", "digest" zijn alle Engels. Elk van de vier heeft NL equivalent.
**Proposed**: "Posities, audit-bevindingen, GEO-citaten, Core Web Vitals. Alles in één dashboard en een wekelijkse samenvatting."

#### skills-seo-geo.integrations.integration1
**Issue type**: Dunglish
**Current**: "Blog Factory. Blog artikelen worden getrackt voor ranking performance"
**Problem**: "Getrackt" is halfvertaald, "ranking performance" is Engels.
**Proposed**: "Blog Factory. Blogartikelen worden gevolgd op zoekpositie"

#### skills-seo-geo.integrations.integration2
**Issue type**: Dunglish
**Current**: "Research. Concurrent keyword data verrijkt strategy"
**Problem**: "Concurrent keyword data verrijkt strategy" is bijna volledig Engels met NL plakband eromheen.
**Proposed**: "Research. Zoekworden-data van concurrenten verrijkt de strategie"

#### skills-seo-geo.useCases.useCase1.title
**Issue type**: Dunglish
**Current**: "E-commerce met organic traffic als groeimotor"
**Problem**: "Organic traffic" is Engels; "organisch verkeer" is de gangbare NL term.
**Proposed**: "E-commerce met organisch zoekverkeer als groeimotor"

#### skills-seo-geo.useCases.useCase1.body
**Issue type**: Dunglish
**Current**: "Technische audits en rank tracking zorgen dat blog + product pages blijven presteren."
**Problem**: "Rank tracking" en "product pages" zijn Engels.
**Proposed**: "Technische audits en positiemonitoring zorgen dat blog- en productpagina's blijven presteren."

#### skills-seo-geo.useCases.useCase2.body
**Issue type**: Dunglish
**Current**: "GEO is de nieuwe SEO. Wie nu al citation-share bouwt, heeft straks een voorsprong."
**Problem**: "Citation-share" is zeer Engels jargon dat een NL-lezer niet herkent.
**Proposed**: "GEO is de nieuwe SEO. Wie nu al aandeel opbouwt in AI-citaten, heeft straks een voorsprong."

---

### skills-clyde

#### skills-clyde.meta.description
**Issue type**: Dunglish
**Current**: "Natural language opdrachten, orkestratie van alle skills, multi-channel (chat/Slack/Telegram), memory per klant. 1-5 cr per chat."
**Problem**: "Natural language" (gewone taal), "multi-channel" (meerdere kanalen), "memory" (geheugen). Drie anglicismen op rij.
**Proposed**: "Opdrachten in gewone taal, orkestratie van alle vaardigheden, werkt op meerdere kanalen (chat, Slack, Telegram), geheugen per klant. 1-5 cr per chat."

#### skills-clyde.hero.eyebrow
**Issue type**: Glossary + Dunglish
**Current**: "Vaardigheid 10. Clyde AI Employee"
**Problem**: "AI Employee" is Engels. In de FMai-glossary is het altijd "AI Marketing Medewerker".
**Proposed**: "Vaardigheid 10. Clyde, je AI Marketing Medewerker"

#### skills-clyde.hero.title
**Issue type**: Glossary-consistentie
**Current**: "Ontmoet Clyde. Je AI-medewerker."
**Problem**: Op de homepage staat "Dit is Clyde" (zie laatste commit). Deze pagina zegt "Ontmoet Clyde". Inconsistent met het nieuwe opener-cliché-vrij framing. Bovendien: glossary is "AI Marketing Medewerker", niet "AI-medewerker".
**Proposed**: "Dit is Clyde. Je AI Marketing Medewerker."

#### skills-clyde.hero.subtitle
**Issue type**: Dunglish
**Current**: "De andere 11 vaardigheden zijn losse tools. Clyde is de medewerker die ze orkestreert. Geef opdrachten in natural language; Clyde routeert naar de juiste skill en brengt resultaten terug. Werkt via chat, Slack, Telegram."
**Problem**: "Tools" en "natural language" zijn Engels. Glossary zegt bovendien: nooit "tool", altijd "vaardigheid" of "AI Marketing Medewerker". "Losse tools" tegenover "medewerker" is precies de framing — maar dan mag je dat juist expliciet maken.
**Proposed**: "De andere elf vaardigheden zijn op zichzelf losse functies. Clyde is de medewerker die ze aan elkaar knoopt. Geef opdrachten in gewone taal; Clyde kiest de juiste vaardigheid en brengt de resultaten terug. Werkt via chat, Slack en Telegram."

#### skills-clyde.features.feature1.title
**Issue type**: Dunglish
**Current**: "Natural language opdrachten"
**Problem**: "Natural language" is Engels.
**Proposed**: "Opdrachten in gewone taal"

#### skills-clyde.features.feature2.title
**Issue type**: Dunglish
**Current**: "Orkestratie van alle skills"
**Problem**: "Skills" is Engels (NL: "vaardigheden"). "Orkestratie" bestaat in NL maar is formeel; "aansturing" is natuurlijker.
**Proposed**: "Aansturing van alle vaardigheden"

#### skills-clyde.features.feature2.body
**Issue type**: Dunglish
**Current**: "Cross-skill workflows: blog schrijven → social posts afleiden → performance tracken. Eén opdracht, meerdere skills."
**Problem**: "Cross-skill workflows", "performance tracken", "skills" zijn Engels. Vier anglicismen in één zin.
**Proposed**: "Werkstromen over meerdere vaardigheden heen: blog schrijven → social posts afleiden → prestaties volgen. Eén opdracht, meerdere vaardigheden."

#### skills-clyde.features.feature3.body
**Issue type**: Dunglish
**Current**: "Chat in dashboard, Slack integratie, Telegram bot. Clyde is waar jij werkt."
**Problem**: Acceptabel, maar "Slack integratie" mist koppelteken.
**Proposed**: "Chat in je dashboard, Slack-integratie, Telegram-bot. Clyde is waar jij werkt."

#### skills-clyde.features.feature4.body
**Issue type**: Dunglish
**Current**: "Onthoudt eerdere gesprekken, voorkeuren, corrections. Elke week scherper per klant."
**Problem**: "Corrections" is Engels; "correcties" is het NL equivalent en correct.
**Proposed**: "Onthoudt eerdere gesprekken, voorkeuren en correcties. Elke week scherper per klant."

#### skills-clyde.how.step1.body
**Issue type**: Woordvolgorde
**Current**: "Dashboard chat, Slack, of Telegram. Clyde werkt op alle drie parallel."
**Problem**: "Op alle drie parallel" klinkt vertaald. "Tegelijk op alle drie" is natuurlijker.
**Proposed**: "Dashboard-chat, Slack of Telegram. Clyde werkt tegelijk op alle drie."

#### skills-clyde.how.step2.body
**Issue type**: Dunglish
**Current**: "Natural language. \"Rapport voor klant X\" of \"Plan 5 social posts over onderwerp Y\". Clyde doet de rest."
**Problem**: "Natural language" is Engels.
**Proposed**: "Gewone taal. \"Rapport voor klant X\" of \"Plan 5 social posts over onderwerp Y\". Clyde doet de rest."

#### skills-clyde.how.step3.title
**Issue type**: Dunglish
**Current**: "Review + iterate"
**Problem**: Beide woorden Engels als stap-titel.
**Proposed**: "Beoordelen en bijsturen"

#### skills-clyde.how.step3.body
**Issue type**: Dunglish
**Current**: "Clyde levert output. Jij reviewt. Corrections landen in memory zodat volgend verzoek scherper is."
**Problem**: "Output", "reviewt", "Corrections", "memory" — vier anglicismen in twee zinnen.
**Proposed**: "Clyde levert het resultaat. Jij beoordeelt. Correcties landen in het geheugen, zodat het volgende verzoek scherper is."

#### skills-clyde.integrations.integration1
**Issue type**: Dunglish
**Current**: "Alle andere 11 skills. Clyde is de orchestrator"
**Problem**: "Skills" en "orchestrator" zijn Engels. Glossary: altijd "vaardigheden".
**Proposed**: "Alle andere 11 vaardigheden. Clyde stuurt ze aan"

#### skills-clyde.integrations.integration2
**Issue type**: Dunglish
**Current**: "Memory system. Context per klant, per brand, per kanaal"
**Problem**: "Memory system" en "brand" zijn Engels.
**Proposed**: "Geheugensysteem. Context per klant, per merk, per kanaal"

#### skills-clyde.integrations.integration3
**Issue type**: Dunglish
**Current**: "Routines. Terugkerende taken (weekly digest, monthly review) automatisch"
**Problem**: "Weekly digest", "monthly review" zijn Engels.
**Proposed**: "Routines. Terugkerende taken (wekelijks overzicht, maandelijkse review) lopen automatisch"

#### skills-clyde.useCases.useCase2.title
**Issue type**: Afkorting / informeel
**Current**: "Delegeren ipv uitvoeren"
**Problem**: "ipv" is informele schrijftaal-afkorting, ongepast op een corporate pagina. "Delegeren" is zelf een anglicisme; "overdragen" is NL.
**Proposed**: "Overdragen in plaats van zelf doen"

#### skills-clyde.useCases.useCase2.body
**Issue type**: Woordvolgorde
**Current**: "Stop met zelf posts schrijven en rapporten maken. Geef opdrachten. Clyde voert uit, jij neemt beslissingen."
**Problem**: Acceptabel, directe toon past. Geen wijziging.
**Proposed**: (geen wijziging)

#### skills-clyde.cta.title
**Issue type**: Semantiek / logica
**Current**: "Klaar om je AI-medewerker aan Clyde over te dragen?"
**Problem**: Dit klopt niet: Clyde **is** de AI-medewerker. Je draagt niet iets aan Clyde over terwijl Clyde de persoon zelf is. Foutieve copy-paste van andere skill-CTA's.
**Proposed**: "Klaar om Clyde als AI Marketing Medewerker in te zetten?"

---

## Glossary-afwijkingen samengevat

Overal waar "skills" staat → "vaardigheden" (conform CLAUDE.md glossary). Gezien in:
- `skills-clyde.features.feature2.title`, `.feature2.body` ("skills")
- `skills-clyde.integrations.integration1` ("skills")
- `skills-clyde.hero.subtitle` ("tools")

"AI Employee" / "AI-medewerker" → "AI Marketing Medewerker" conform glossary. Gezien in:
- `skills-clyde.hero.eyebrow`
- `skills-clyde.hero.title`

"Brand" → "merk". Gezien in:
- `skills-clyde.integrations.integration2`

## Aanbevolen top-10 fixes (hoogste impact)

1. `skills-clyde.hero.eyebrow` en `.hero.title` — glossary-fout ("AI Employee")
2. `skills-clyde.cta.title` — logisch onzinnige zin
3. `skills-reporting.hero.subtitle` — vier Engelse termen achter elkaar op hero
4. `skills-seo-geo.hero.subtitle` — "AI-gedreven" anglicisme in hero
5. `skills-research.hero.subtitle` — "insight" als klassiek anglicisme
6. Alle 4× `features.featureX` waar "Natural language" staat
7. `skills-reporting.features.feature2.body` — "Cross-platform: social metrics, website traffic, ad performance"
8. `skills-seo-geo.features.feature1.body` — "broken links, slow pages, mobile-friendliness, Prioritized fix-lijst"
9. `skills-clyde.useCases.useCase2.title` — "ipv" afkorting + "Delegeren"
10. `skills-reporting.features.feature3.body` — "stddev" te technisch voor marketingpagina
