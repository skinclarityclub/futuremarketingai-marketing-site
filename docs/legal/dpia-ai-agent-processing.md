---
title: DPIA - AI Agent Gegevensverwerking
tags: #legal #gdpr #dpia #compliance #aaas #ai-act
created: 2026-03-20
source: 'GDPR Art. 35, WP29 richtlijnen, docs/wetgeving-aaas-nederland-eu.md'
---

# Data Protection Impact Assessment (DPIA)

## AI Agent Gegevensverwerking — Future Marketing AI

> **Disclaimer**: Dit is een conceptdocument en geen juridisch advies. Professioneel juridisch advies wordt sterk aanbevolen voordat dit document wordt gebruikt. Een DPIA dient regelmatig te worden geactualiseerd bij wijzigingen in de verwerking.

**Versie**: 1.0
**Datum**: maart 2026
**Verantwoordelijke**: Future Marketing AI B.V. (i.o.)
**Status**: Concept

---

## 1. Beschrijving van de verwerkingsactiviteiten

### 1.1 Overzicht

Future Marketing AI (FMai) biedt een AI Marketing Employee als dienst (Agent as a Service / AaaS) aan marketing agencies. Het platform verwerkt persoonsgegevens van de klanten van deze agencies door middel van zes AI-gestuurde vaardigheden ("skills").

### 1.2 Verwerking per skill

#### Content Creator

- **Invoergegevens**: Merkrichtlijnen, doelgroepprofielen, historische content, trefwoorden
- **Verwerking**: AI-modellen (OpenAI, Anthropic) genereren marketingcontent op basis van klantcontext
- **Uitvoergegevens**: Blogartikelen, social media posts, nieuwsbrieven
- **Persoonsgegevens**: Mogelijk namen, functies en bedrijfsgegevens in contentcontext

#### Voice Agent

- **Invoergegevens**: Telefoonnummers, gespreksscripts, klantprofielen
- **Verwerking**: Spraakherkenning (speech-to-text), AI-analyse, tekst-naar-spraak (text-to-speech) via Vapi
- **Uitvoergegevens**: Gespreksopnames, transcripties, leadscores, afspraakbevestigingen
- **Persoonsgegevens**: Stemgegevens, naam, telefoonnummer, gespreksinhoud

#### Lead Qualifier

- **Invoergegevens**: Websiteformulieren, chatberichten, gedragsgegevens
- **Verwerking**: AI-analyse van leadkwaliteit, scoring en routering
- **Uitvoergegevens**: Leadscores, gekwalificeerde leads, routeringsbeslissingen
- **Persoonsgegevens**: Naam, e-mail, bedrijf, IP-adres, websitegedrag

#### Social Media Manager

- **Invoergegevens**: Social media accounts, content kalenders, engagement-data
- **Verwerking**: Planning, publicatie en prestatie-analyse op meerdere platforms
- **Uitvoergegevens**: Geplande posts, engagement-rapporten, volgersanalyses
- **Persoonsgegevens**: Social media profielnamen, interactiegegevens

#### Ad Creator

- **Invoergegevens**: Merkmateriaal, doelgroepgegevens, campagnedoelen
- **Verwerking**: AI-generatie van advertentiemateriaal, publicatie naar advertentieplatforms
- **Uitvoergegevens**: Advertenties (statisch/video), campagneconfiguraties
- **Persoonsgegevens**: Doelgroepsegmenten (geanonimiseerd), campagneresultaten

#### Reporting en Analytics

- **Invoergegevens**: Prestatiemetrieken van alle skills, platformdata
- **Verwerking**: Aggregatie, anomaliedetectie, trendanalyse
- **Uitvoergegevens**: Dashboards, weekrapporten, aanbevelingen
- **Persoonsgegevens**: Geaggregeerde gegevens (in beginsel geanonimiseerd)

### 1.3 Doel van de verwerking

Het doel van de verwerking is het leveren van geautomatiseerde marketingdiensten aan marketing agencies, zodat deze bureaus hun klanten efficinter kunnen bedienen zonder extra personeel aan te nemen.

### 1.4 Datastromen

```
Agency (Opdrachtgever)
  |
  | Invoer: merkrichtlijnen, klantgegevens, accounts
  v
FMai Platform (Verwerker)
  |
  |--- OpenAI API (EU-regio) --> contentgeneratie
  |--- Anthropic API (EU-verwerking) --> contentgeneratie
  |--- Vapi (VS) --> spraakverwerking
  |--- Supabase (EU) --> dataopslag
  |--- Vercel (EU) --> hosting
  |
  v
Output naar Agency
  |
  | Content, rapporten, leads, afspraken
  v
Agency's klanten (Betrokkenen)
```

---

## 2. Beoordeling van noodzaak en proportionaliteit

### 2.1 Rechtsgrond

De verwerking is gebaseerd op de volgende rechtsgronden (artikel 6 AVG):

- **Uitvoering overeenkomst (Art. 6(1)(b))**: Verwerking is noodzakelijk voor het uitvoeren van de AaaS-serviceovereenkomst tussen FMai en de agency
- **Gerechtvaardigd belang (Art. 6(1)(f))**: Verbetering van de dienstkwaliteit op basis van gebruikspatronen en prestatiemetrieken
- **Toestemming (Art. 6(1)(a))**: Voor analytische cookies en optionele functies

### 2.2 Data minimalisatie

De volgende maatregelen zijn getroffen om data minimalisatie te waarborgen:

- **Promptontwerp**: AI-prompts worden zo ontworpen dat alleen de minimaal noodzakelijke persoonsgegevens worden meegestuurd naar LLM-providers
- **Geen modeltraining**: Klantgegevens worden niet gebruikt voor het trainen van AI-modellen (Zero Data Retention bij OpenAI en Anthropic)
- **Pseudonimisering**: Waar mogelijk worden persoonsgegevens gepseudonimiseerd voordat ze worden verwerkt door AI-modellen
- **Selectieve verwerking**: Per skill worden alleen de strikt noodzakelijke gegevenscategorieen verwerkt

### 2.3 Bewaartermijnen

| Gegevenscategorie        | Bewaartermijn            | Motivatie                              |
| ------------------------ | ------------------------ | -------------------------------------- |
| Actieve accountgegevens  | Duur serviceovereenkomst | Noodzakelijk voor dienstverlening      |
| Spraakopnames            | 90 dagen                 | Kwaliteitscontrole en geschiloplossing |
| Chatgesprekken           | 90 dagen                 | Leadopvolging en kwaliteitscontrole    |
| Analytische gegevens     | Duur serviceovereenkomst | Rapportage en optimalisatie            |
| Na beeindiging           | 30 dagen exportperiode   | Recht op dataportabiliteit             |
| Back-ups na verwijdering | 30 dagen                 | Technische noodzaak                    |

---

## 3. Risicobeoordeling voor betrokkenen

### 3.1 Risico: AI-gegenereerde content met persoonsgegevens

**Beschrijving**: AI-modellen kunnen onbedoeld persoonsgegevens opnemen in gegenereerde content, of content genereren die verwijst naar echte personen zonder hun toestemming.

**Waarschijnlijkheid**: Middel
**Impact**: Middel
**Risicoscore**: Middel

**Betrokken skills**: Content Creator, Social Media Manager, Ad Creator

### 3.2 Risico: Verwerking en opslag van spraakopnames

**Beschrijving**: Voice Agent verwerkt en bewaart spraakopnames die biometrische kenmerken (stempatroon) bevatten. Ongeautoriseerde toegang tot deze opnames vormt een privacyrisico.

**Waarschijnlijkheid**: Laag
**Impact**: Hoog
**Risicoscore**: Middel-Hoog

**Betrokken skills**: Voice Agent

### 3.3 Risico: Cross-client datalekkage in multi-tenant systeem

**Beschrijving**: In een multi-tenant platform bestaat het risico dat gegevens van de ene klant zichtbaar worden voor een andere klant, door fouten in de isolatie tussen workspaces.

**Waarschijnlijkheid**: Laag
**Impact**: Hoog
**Risicoscore**: Middel-Hoog

**Betrokken skills**: Alle skills

### 3.4 Risico: Doorgifte van persoonsgegevens naar sub-verwerkers buiten de EU

**Beschrijving**: Bepaalde sub-verwerkers (OpenAI, Anthropic, Vapi) zijn gevestigd in de VS. API-calls naar deze diensten kunnen persoonsgegevens buiten de EU/EER brengen, ondanks DPF-certificering.

**Waarschijnlijkheid**: Middel
**Impact**: Middel
**Risicoscore**: Middel

**Betrokken skills**: Content Creator, Voice Agent, Lead Qualifier

### 3.5 Risico: Geautomatiseerde profilering via leadkwalificatie

**Beschrijving**: De Lead Qualifier skill scoort en classificeert leads op basis van geautomatiseerde analyse van hun gedrag en gegevens. Dit kan worden beschouwd als geautomatiseerde profilering onder artikel 22 AVG.

**Waarschijnlijkheid**: Hoog
**Impact**: Middel
**Risicoscore**: Middel-Hoog

**Betrokken skills**: Lead Qualifier

### 3.6 Risico: Onvermogen tot volledige verwijdering (recht op vergetelheid)

**Beschrijving**: Persoonsgegevens die zijn verwerkt door AI-modellen kunnen niet uit het model zelf worden verwijderd. Daarnaast kunnen gegevens verspreid zijn over meerdere sub-verwerkers, wat volledige verwijdering bemoeilijkt.

**Waarschijnlijkheid**: Middel
**Impact**: Middel
**Risicoscore**: Middel

**Betrokken skills**: Alle skills

### 3.7 Risico: AI-agenten die onjuiste of misleidende informatie verstrekken

**Beschrijving**: AI-gestuurde agenten (chatbot, voice agent) kunnen onjuiste informatie verstrekken aan leads of klanten, met mogelijke schade voor betrokkenen.

**Waarschijnlijkheid**: Middel
**Impact**: Middel
**Risicoscore**: Middel

**Betrokken skills**: Voice Agent, Lead Qualifier

---

## 4. Maatregelen om risico's te beperken

### 4.1 Technische maatregelen

| Risico                           | Maatregel                                                                                                                              | Status          |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| 3.1 Content met persoonsgegevens | Content review workflow: AI-output wordt als concept geleverd, agency beoordeelt voor publicatie                                       | Geimplementeerd |
| 3.2 Spraakopnames                | Encryptie at rest (AES-256) en in transit (TLS 1.2+); toegang beperkt tot geautoriseerd personeel; retentie max 90 dagen               | Geimplementeerd |
| 3.3 Cross-client lekkage         | Tenant-isolatie via Row Level Security (RLS) in Supabase; gescheiden API-keys per workspace; geautomatiseerde isolatietests            | Geimplementeerd |
| 3.4 Internationale doorgifte     | Gebruik van EU-datacenterregio's bij OpenAI en Anthropic; Zero Data Retention (ZDR) ingeschakeld; DPF + SCCs                           | Geimplementeerd |
| 3.5 Geautomatiseerde profilering | Leadscore is adviserend, niet besluitvormend; agency neemt de uiteindelijke beslissing; opt-out mogelijkheid                           | Geimplementeerd |
| 3.6 Recht op vergetelheid        | Verwijderingsmechanisme per klant-ID; ZDR bij LLM-providers zodat gegevens niet in modellen worden opgenomen; verwijderingsbevestiging | Gepland         |
| 3.7 Onjuiste informatie          | AI-disclosure aan begin van elk gesprek; guardrails en content filters; menselijke controle op kritieke uitingen                       | Geimplementeerd |

### 4.2 Organisatorische maatregelen

- **Privacy by design**: Gegevensbescherming is ingebouwd in het ontwerp van alle nieuwe functies
- **Medewerkerstraining**: Alle medewerkers ontvangen jaarlijks privacy- en beveiligingstraining
- **Incidentresponsplan**: Gedocumenteerd plan met escalatieprocedure, meldingstermijnen (24 uur intern, 72 uur AP) en communicatieprotocol
- **Regelmatige review**: DPIA wordt minimaal jaarlijks geactualiseerd en bij significante wijzigingen in de verwerking
- **AI-geletterdheid**: Team voldoet aan de AI-geletterdheidsverplichting (EU AI Act, van kracht sinds februari 2025)

### 4.3 Contractuele maatregelen

- **Verwerkersovereenkomst (DPA)**: Afgesloten met elke agency-klant, conform artikel 28 AVG
- **Sub-verwerkersovereenkomsten**: DPA's afgesloten met alle sub-verwerkers (OpenAI, Anthropic, Supabase, Vercel, Vapi)
- **Auditrechten**: Agencies hebben het recht om audits uit te voeren of auditrapportages op te vragen
- **Aansprakelijkheidsbeperking**: In serviceovereenkomst en algemene voorwaarden opgenomen
- **AI-output disclaimer**: Contractueel vastgelegd dat AI-output concepten zijn die menselijke beoordeling vereisen

---

## 5. Conclusie en residueel risicobeoordeling

### 5.1 Samenvatting risico's en maatregelen

| Risico                          | Initieel risico | Na maatregelen | Acceptabel?         |
| ------------------------------- | --------------- | -------------- | ------------------- |
| AI-content met persoonsgegevens | Middel          | Laag           | Ja                  |
| Spraakopnames                   | Middel-Hoog     | Laag-Middel    | Ja                  |
| Cross-client lekkage            | Middel-Hoog     | Laag           | Ja                  |
| Internationale doorgifte        | Middel          | Laag-Middel    | Ja (met monitoring) |
| Geautomatiseerde profilering    | Middel-Hoog     | Laag-Middel    | Ja                  |
| Recht op vergetelheid           | Middel          | Laag-Middel    | Ja (met ZDR)        |
| Onjuiste informatie             | Middel          | Laag-Middel    | Ja                  |

### 5.2 Conclusie

Na implementatie van de beschreven technische, organisatorische en contractuele maatregelen is het residuele risico van de verwerkingsactiviteiten **acceptabel**. De belangrijkste resterende aandachtspunten zijn:

1. **EU-US doorgifte**: Het EU-US Data Privacy Framework kan juridisch worden aangevochten (Schrems III). FMai monitort deze ontwikkelingen en is voorbereid om over te schakelen naar EU-only verwerking indien nodig.

2. **Recht op vergetelheid**: Het volledige verwijderingsmechanisme is in ontwikkeling. Door het gebruik van ZDR bij LLM-providers worden persoonsgegevens niet in AI-modellen opgenomen, waardoor het risico beperkt is.

3. **EU AI Act compliance**: De transparantieverplichtingen van artikel 50 treden in werking op 2 augustus 2026. FMai implementeert proactief AI-disclosure in alle klantgerichte AI-systemen.

### 5.3 Aanbevelingen

1. Implementeer het volledige verwijderingsmechanisme per klant-ID voor alle datalaag componenten
2. Monitor de juridische status van het EU-US Data Privacy Framework en bereid een fallback-scenario voor
3. Actualiseer deze DPIA bij elke significante wijziging in verwerkingsactiviteiten, sub-verwerkers of technologie
4. Overweeg aanstelling van een Functionaris Gegevensbescherming (FG/DPO) bij schaalvergroting
5. Volg de definitieve Code of Practice voor transparantie van AI-gegenereerde content (verwacht juni 2026)

### 5.4 Goedkeuring

**Opgesteld door**: [Naam]
**Datum**: maart 2026
**Volgende review**: september 2026

---

## DPIA-criteria checklist (AP)

De volgende criteria uit de lijst van de Autoriteit Persoonsgegevens zijn van toepassing:

- [x] **Criterium 1**: Evaluatie of scoring (leadkwalificatie en -scoring)
- [ ] Criterium 2: Geautomatiseerde besluitvorming (leadscore is adviserend, niet besluitvormend)
- [x] **Criterium 3**: Systematische monitoring (analytics, prestatiemonitoring)
- [ ] Criterium 4: Gevoelige gegevens (niet standaard, tenzij door agency aangeleverd)
- [x] **Criterium 5**: Grootschalige verwerking (meerdere agencies, meerdere klanten per agency)
- [ ] Criterium 6: Matching of combineren van datasets (beperkt)
- [ ] Criterium 7: Kwetsbare betrokkenen (niet primair)
- [x] **Criterium 8**: Innovatief gebruik van technologie (AI agents, LLMs)
- [ ] Criterium 9: Blokkering van een recht of dienst (niet van toepassing)

**Conclusie**: Met 4 van de 9 criteria van toepassing is een DPIA verplicht, conform de richtlijnen van de AP en WP29.
