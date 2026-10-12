---
title: Verwerkersovereenkomst (Data Processing Agreement)
tags: #legal #gdpr #dpa #compliance #aaas
created: 2026-03-20
updated: 2026-10-12
status: concept
source: 'GDPR Art. 28, docs/wetgeving-aaas-nederland-eu.md, privacyverklaring op future-marketing.ai/legal/privacy'
---

# Verwerkersovereenkomst

> **Disclaimer**: Dit is een conceptdocument en geen juridisch advies. Professioneel juridisch advies wordt sterk aanbevolen voordat dit document wordt gebruikt.

> **Open punten (intern, verwijderen vóór verzending).** Bijgewerkt op 2026-10-12, zodat het concept aansluit op de subverwerkers en bewaartermijnen in de privacyverklaring. Wat nog open staat:
>
> 1. **Partijen**: juridische naam (nu "Future Marketing AI B.V. (i.o.)"), adres, KvK-nummer en contactpersoon invullen.
> 2. **Firecrawl**: geen openbare DPA en geen SCC's gevonden. Een DPA opvragen, of Firecrawl geen persoonsgegevens laten verwerken.
> 3. **Upstash Redis**: volgens DNS staat er vanuit de EU een instantie in Frankfurt en vanuit Azië een in Singapore (gemeten 2026-10-12). Dat wijst op een replica buiten de EU. Controleer de primaire regio en de leesregio's in de Upstash-console.
> 4. **Hetzner**: de verwerkersovereenkomst moet in het Hetzner-account worden afgesloten. Of dat gebeurd is, is niet gecontroleerd.
> 5. **Google Gemini**: de DPA geldt alleen voor betaalde diensten. Controleer dat het gebruikte project billing heeft.
> 6. **Niet getoetste beweringen** in dit concept: audit logging met 90 dagen bewaring en intrusion detection (9.1), achtergrondcontrole en training (9.2), "heeft een TIA uitgevoerd" (11.2) en melding van een datalek binnen 24 uur (12.2). Bevestigen of aanpassen.
> 7. **Meta (Instagram/Facebook) en Telegram** staan in Annex A apart als derde partij, omdat zij daar zelf verantwoordelijk zijn. De privacyverklaring noemt ze nog gewoon bij de sub-verwerkers.

---

## 1. Partijen

Deze verwerkersovereenkomst ("Overeenkomst") is aangegaan tussen:

**Verwerkingsverantwoordelijke** ("Opdrachtgever"):

- Naam: [Naam marketing agency]
- Adres: [Adres]
- KvK-nummer: [Nummer]
- Contactpersoon: [Naam]
- E-mail: [E-mail]

Hierna te noemen: "Verwerkingsverantwoordelijke" of "Opdrachtgever"

**Verwerker**:

- Naam: Future Marketing AI B.V. (i.o.)
- Adres: Nederland
- KvK-nummer: [Nummer]
- Contactpersoon: [Naam]
- E-mail: privacy@future-marketing.ai

Hierna te noemen: "Verwerker" of "FMai"

Gezamenlijk aangeduid als "Partijen".

---

## 2. Onderwerp en duur van de verwerking

### 2.1 Onderwerp

Deze Overeenkomst heeft betrekking op de verwerking van persoonsgegevens door de Verwerker ten behoeve van de Verwerkingsverantwoordelijke in het kader van het leveren van het FMai-platform met Clyde, de AI-collega voor marketingbureaus.

### 2.2 Duur

Deze Overeenkomst treedt in werking op de ingangsdatum van de bijbehorende serviceovereenkomst en blijft van kracht zolang de Verwerker persoonsgegevens verwerkt in opdracht van de Verwerkingsverantwoordelijke.

Bij beeindiging van de serviceovereenkomst blijft deze Overeenkomst van kracht totdat alle persoonsgegevens zijn teruggegeven of verwijderd conform artikel 13.

---

## 3. Aard en doel van de verwerking

De Verwerker verwerkt persoonsgegevens uitsluitend ten behoeve van de volgende doeleinden:

### 3.1 AI Marketing Content Creatie

- Genereren van blogartikelen, social media posts, nieuwsbrieven en andere marketingcontent op basis van klantgegevens en merkrichtlijnen van de Opdrachtgever.

### 3.2 Berichten op gekoppelde kanalen

- Ontvangen en beantwoorden van berichten en reacties op gekoppelde Instagram-accounts, en gesprekken met de chatbot op websites van klanten van de Opdrachtgever.

### 3.3 Lead Kwalificatie

- Analyse van chatberichten en formulierinzendingen om leads te scoren en door te sturen naar de Opdrachtgever. De score is adviserend; er worden geen geautomatiseerde besluiten genomen.

### 3.4 Social Media Management

- Beheer van social media accounts, planning van publicaties, analyse van engagement en prestaties op meerdere platforms.

### 3.5 Advertentie Creatie

- Genereren van advertentiemateriaal (statisch en video) en publicatie naar advertentieplatforms namens de Opdrachtgever.

### 3.6 Research en SEO

- Onderzoek naar markt, concurrenten, zoekwoorden en zoekposities op basis van openbare bronnen.

### 3.7 Rapportage en Analytics

- Verzamelen, aggregeren en rapporteren van prestatiemetrieken, campagneresultaten en anomaliedetectie.

### 3.8 Vergaderingen

- Opnemen en uitschrijven van een vergadering, alleen als de Opdrachtgever Clyde vraagt die vergadering bij te wonen.

---

## 4. Soorten persoonsgegevens

De volgende categorieen persoonsgegevens kunnen worden verwerkt:

| Categorie                | Voorbeelden                                                                                          | Doel (artikel 3)                 |
| ------------------------ | ---------------------------------------------------------------------------------------------------- | -------------------------------- |
| Contactgegevens          | Naam, e-mailadres, telefoonnummer, bedrijfsnaam                                                      | Alle doeleinden                  |
| Social media gegevens    | Profielnamen, engagement-data, volgersaantallen                                                      | 3.1, 3.4, 3.7                    |
| Kanaalgegevens           | Berichten en reacties op gekoppelde Instagram-accounts, gesprekken met de chatbot op klantwebsites   | 3.2, 3.3                         |
| Lead- en aanvraaggegevens | Formulierinzendingen, leadscores                                                                    | 3.3, 3.7                         |
| Interactie met Clyde     | Berichten aan Clyde in het dashboard, via WhatsApp of Telegram, en het geheugen dat Clyde per klant bijhoudt | Alle doeleinden          |
| Vergaderopnames          | Opnames en transcripties van vergaderingen die Clyde op verzoek bijwoont                             | 3.8                              |
| Analytische gegevens     | Prestatiemetrieken, campagneresultaten                                                               | 3.7                              |

**Bijzondere categorieen persoonsgegevens**: De Verwerker verwerkt in beginsel geen bijzondere categorieen persoonsgegevens (zoals bedoeld in artikel 9 AVG). Indien de Opdrachtgever dergelijke gegevens aanlevert, dient dit vooraf schriftelijk te worden overeengekomen.

---

## 5. Categorieen van betrokkenen

De persoonsgegevens hebben betrekking op de volgende categorieen van betrokkenen:

- **Klanten van de Opdrachtgever**: Eindklanten van het marketing agency waarvoor de AI-diensten worden uitgevoerd
- **Leads en prospects**: Potentiele klanten die via marketing, website of andere kanalen worden bereikt
- **Websitebezoekers**: Bezoekers van de websites van de klanten van de Opdrachtgever
- **Social media volgers**: Personen die interacteren met de social media accounts van de klanten, of er berichten naartoe sturen
- **Deelnemers aan vergaderingen**: Personen in een vergadering die Clyde op verzoek van de Opdrachtgever bijwoont

---

## 6. Rechten en verplichtingen van de Verwerkingsverantwoordelijke

De Verwerkingsverantwoordelijke:

1. Is verantwoordelijk voor de rechtmatigheid van de verwerking en het verkrijgen van de benodigde rechtsgronden (toestemming, gerechtvaardigd belang, of uitvoering overeenkomst)
2. Geeft de Verwerker uitsluitend schriftelijke instructies voor de verwerking van persoonsgegevens
3. Zorgt ervoor dat betrokkenen worden geinformeerd over de verwerking van hun persoonsgegevens, inclusief het gebruik van AI-systemen
4. Is verantwoordelijk voor de juistheid en volledigheid van de aangeleverde persoonsgegevens
5. Draagt zorg voor het beantwoorden van verzoeken van betrokkenen, met ondersteuning van de Verwerker
6. Informeert de Verwerker onverwijld over wijzigingen in de verwerkingsdoeleinden of -activiteiten

---

## 7. Instructies voor verwerking

### 7.1 Verwerkingsinstructies

De Verwerker verwerkt persoonsgegevens uitsluitend op basis van schriftelijke instructies van de Verwerkingsverantwoordelijke, tenzij de Verwerker hiertoe verplicht is op grond van Unierecht of lidstaatrecht.

### 7.2 Afwijkende instructies

Indien de Verwerker van mening is dat een instructie van de Verwerkingsverantwoordelijke in strijd is met de AVG of andere toepasselijke wetgeving, stelt de Verwerker de Verwerkingsverantwoordelijke hiervan onverwijld op de hoogte.

### 7.3 Standaardinstructies

De volgende standaardinstructies zijn van toepassing:

- Persoonsgegevens worden uitsluitend verwerkt voor de in artikel 3 genoemde doeleinden
- Gegevens worden niet langer bewaard dan noodzakelijk (zie retentiebeleid in Annex B)
- Gegevens worden niet doorgegeven aan derden anders dan de goedgekeurde sub-verwerkers
- AI-modellen worden niet getraind op klantspecifieke persoonsgegevens

---

## 8. Geheimhouding

### 8.1 Geheimhoudingsplicht

De Verwerker waarborgt dat personen die bevoegd zijn om persoonsgegevens te verwerken, zich tot geheimhouding hebben verplicht of onder een passende wettelijke geheimhoudingsplicht vallen.

### 8.2 Reikwijdte

De geheimhoudingsplicht strekt zich uit tot alle medewerkers, ingehuurde krachten en sub-verwerkers die toegang hebben tot persoonsgegevens van de Verwerkingsverantwoordelijke.

### 8.3 Doorwerking

De geheimhoudingsplicht blijft ook na beeindiging van deze Overeenkomst van kracht.

---

## 9. Beveiligingsmaatregelen

De Verwerker treft de volgende technische en organisatorische maatregelen (TOMs) ter bescherming van persoonsgegevens:

### 9.1 Technische maatregelen

- **Encryptie**: Versleuteling van gegevens in transit (TLS 1.2+) en at rest (AES-256)
- **Toegangscontrole**: Role-based access control (RBAC) met principe van minimale rechten
- **Multi-tenant isolatie**: Strikte scheiding van gegevens tussen verschillende klantworkspaces
- **Logging en monitoring**: Audit logging van alle verwerkingsactiviteiten met bewaring van minimaal 90 dagen
- **Backup en recovery**: Geregelde back-ups met encryptie en disaster recovery procedures
- **Netwerkbeveiliging**: Firewalls, intrusion detection en DDoS-bescherming

### 9.2 Organisatorische maatregelen

- **Personeelsbeleid**: Achtergrondcontrole en geheimhoudingsverklaringen voor medewerkers
- **Training**: Regelmatige privacy- en beveiligingstraining voor alle medewerkers
- **Incidentresponsplan**: Gedocumenteerd plan voor het afhandelen van beveiligingsincidenten en datalekken
- **Toegangsbeheer**: Regelmatige evaluatie en herziening van toegangsrechten
- **Documentatie**: Register van verwerkingsactiviteiten conform artikel 30 AVG

---

## 10. Sub-verwerkers

### 10.1 Toestemming

De Verwerkingsverantwoordelijke geeft hierbij voorafgaande schriftelijke toestemming voor het inschakelen van de sub-verwerkers als vermeld in Annex A.

### 10.2 Wijzigingen in sub-verwerkers

De Verwerker informeert de Verwerkingsverantwoordelijke minimaal 30 dagen vooraf over voorgenomen wijzigingen in de lijst van sub-verwerkers. De Verwerkingsverantwoordelijke heeft het recht om bezwaar te maken tegen de inschakeling van een nieuwe sub-verwerker. Indien de Verwerkingsverantwoordelijke bezwaar maakt en partijen niet tot overeenstemming komen, heeft de Verwerkingsverantwoordelijke het recht deze Overeenkomst te beeindigen.

### 10.3 Doorgifte-verplichtingen

De Verwerker legt aan sub-verwerkers dezelfde verplichtingen op als in deze Overeenkomst zijn opgenomen, met name ten aanzien van beveiliging, geheimhouding en naleving van de AVG.

### 10.4 Aansprakelijkheid

De Verwerker blijft volledig aansprakelijk voor de handelingen en nalatigheden van ingeschakelde sub-verwerkers.

---

## 11. Doorgifte van gegevens buiten de EU/EER

### 11.1 Waarborgen

De Verwerker draagt persoonsgegevens uitsluitend door naar landen buiten de EU/EER indien adequate waarborgen zijn getroffen, waaronder:

- **EU-VS Data Privacy Framework (DPF)**: Voor sub-verwerkers die gecertificeerd zijn onder het DPF (zie Annex A)
- **Standard Contractual Clauses (SCCs)**: Waar het DPF niet van toepassing is, worden de door de Europese Commissie goedgekeurde modelcontractbepalingen gehanteerd
- **Adequaatheidsbesluit**: Doorgifte naar landen waarvoor een adequaatheidsbesluit van de Europese Commissie geldt

### 11.2 Transfer Impact Assessment

De Verwerker heeft een Transfer Impact Assessment (TIA) uitgevoerd voor alle internationale doorgiftes en stelt deze op verzoek beschikbaar aan de Verwerkingsverantwoordelijke.

### 11.3 EU-verwerking

Waar mogelijk maakt de Verwerker gebruik van EU-datacenterregio's bij sub-verwerkers om internationale doorgifte te minimaliseren.

---

## 12. Bijstand aan de Verwerkingsverantwoordelijke

### 12.1 Verzoeken van betrokkenen

De Verwerker verleent bijstand bij het afhandelen van verzoeken van betrokkenen (recht op inzage, rectificatie, vergetelheid, beperking, overdraagbaarheid en bezwaar) door:

- Het onverwijld doorsturen van ontvangen verzoeken aan de Verwerkingsverantwoordelijke
- Het bieden van technische ondersteuning bij het lokaliseren en exporteren van persoonsgegevens
- Het uitvoeren van verwijderingsverzoeken binnen de systemen van de Verwerker

De Verwerker reageert binnen 5 werkdagen op bijstandsverzoeken van de Verwerkingsverantwoordelijke.

### 12.2 Melding van datalekken

De Verwerker meldt een inbreuk in verband met persoonsgegevens (datalek) aan de Verwerkingsverantwoordelijke zonder onredelijke vertraging en in ieder geval binnen 24 uur na ontdekking. De melding bevat minimaal:

- De aard van het datalek
- De categorieen en het geschatte aantal betrokken betrokkenen
- De waarschijnlijke gevolgen
- De genomen en voorgestelde maatregelen

### 12.3 DPIA-ondersteuning

De Verwerker verleent bijstand bij Data Protection Impact Assessments (DPIA's) door het verstrekken van informatie over verwerkingsactiviteiten, beveiligingsmaatregelen en risico's.

---

## 13. Gegevens bij beeindiging

### 13.1 Teruggave van gegevens

Bij beeindiging van de serviceovereenkomst stelt de Verwerker alle persoonsgegevens beschikbaar aan de Verwerkingsverantwoordelijke in een gangbaar, machineleesbaar formaat. De Verwerkingsverantwoordelijke heeft 30 dagen na beeindiging om de gegevens te exporteren.

### 13.2 Verwijdering

Na afloop van de exportperiode van 30 dagen verwijdert de Verwerker alle persoonsgegevens van de Verwerkingsverantwoordelijke, inclusief alle kopieeen, back-ups en afgeleide gegevens, tenzij opslag verplicht is op grond van toepasselijk recht.

### 13.3 Bevestiging

De Verwerker bevestigt de volledige verwijdering schriftelijk aan de Verwerkingsverantwoordelijke.

---

## 14. Auditrechten

### 14.1 Recht op audit

De Verwerkingsverantwoordelijke heeft het recht om audits en inspecties uit te voeren, of door een aangewezen onafhankelijke derde partij te laten uitvoeren, om naleving van deze Overeenkomst te verifieren.

### 14.2 Voorwaarden

- Audits worden aangekondigd met een termijn van minimaal 30 dagen
- Audits vinden plaats tijdens reguliere kantooruren
- De Verwerkingsverantwoordelijke draagt de kosten van de audit, tenzij uit de audit blijkt dat de Verwerker niet voldoet aan deze Overeenkomst
- De auditor is gebonden aan geheimhouding

### 14.3 Alternatieve audit

De Verwerker mag als alternatief een recent auditrapport van een onafhankelijke auditor overleggen (SOC 2, ISO 27001, of gelijkwaardig) ter voldoening aan het auditrecht.

### 14.4 Medewerking

De Verwerker verleent alle redelijke medewerking aan audits en stelt de benodigde informatie, systemen en locaties beschikbaar.

---

## Annex A: Lijst van sub-verwerkers

De categorieën volgen artikel 5 van de privacyverklaring. "DPF" is het EU-VS Data Privacy Framework, "SCC" zijn de standaardcontractbepalingen van de Europese Commissie. ONBEKEND betekent: niet gevonden in de bronnen van de leverancier, dus niet ingevuld.

### A.1 Sub-verwerkers

**Infrastructuur**

| Sub-verwerker | Entiteit en land | Doel | Verwerkingslocatie | Waarborg doorgifte | DPA |
| --- | --- | --- | --- | --- | --- |
| Supabase | Supabase Pte. Ltd. (Singapore); support en operations door Supabase, Inc. (VS) | Database, authenticatie en opslag | EU (Frankfurt, eu-central-1). Account-, billing-, support- en telemetriegegevens buiten de regio | SCC (geen DPF) | Ja |
| Vercel | Vercel Inc. (VS) | Hosting van de applicatie en CDN | Serverfuncties in Frankfurt (fra1), CDN wereldwijd. Volgens de Vercel-DPA zitten de primaire voorzieningen in de VS | DPF + SCC | Ja |
| Hetzner | Hetzner Online GmbH (Duitsland) | Eigen server voor automatiseringen (n8n), de kennisbank en het inplannen van posts (Postiz, zelf-gehost) | Duitsland, Neurenberg (nbg1) | n.v.t. (EU) | Ja, af te sluiten in het Hetzner-account (zie open punt 4) |
| Upstash | Upstash, Inc. (VS) | Wachtrijen (QStash) en tijdelijke opslag (Redis) | QStash: Frankfurt (eu-central-1). Redis: zie open punt 3 | DPF + SCC | Ja |
| Sentry | Functional Software, Inc. (VS) | Foutmeldingen | Opslagregio ONBEKEND. Op 2026-10-12 was in productie geen Sentry-DSN ingesteld, dus ontving Sentry toen geen gegevens | DPF + SCC | Ja |

**Taalmodellen en AI**

| Sub-verwerker | Entiteit en land | Doel | Verwerkingslocatie | Waarborg doorgifte | DPA |
| --- | --- | --- | --- | --- | --- |
| Anthropic | Anthropic Ireland, Limited (Ierland) | Taalmodel voor tekst | VS (opslag at rest alleen in de VS) | SCC (geen DPF) | Ja |
| OpenAI | OpenAI Ireland Ltd. (Ierland) | Taalmodel voor tekst en beeld | ONBEKEND. FMai gebruikt het standaard-endpoint en geen EU-project; EU-residentie bestaat alleen voor een EU-project | SCC (geen DPF) | Ja |
| Google Gemini API | Google Cloud EMEA Limited (Ierland) | Research en productanalyse | Wereldwijd | DPF (Google LLC) + SCC | Ja, alleen voor betaalde diensten (zie open punt 5) |
| Perplexity | Perplexity AI, Inc. (VS) | Research met bronvermelding | VS (AWS, Noord-Amerika) | SCC. De DPF-hercertificering is op 2026-10-08 verlopen | Ja |
| Voyage AI | Voyage AI Innovations Inc. (VS), dochter van MongoDB, Inc. | Kennis en geheugen doorzoekbaar maken | VS volgens het privacybeleid; regio ONBEKEND | DPF (via MongoDB, Inc.) + SCC | Ja |

**Beeld, video en audio**

| Sub-verwerker | Entiteit en land | Doel | Verwerkingslocatie | Waarborg doorgifte | DPA |
| --- | --- | --- | --- | --- | --- |
| fal.ai | Features & Labels, Inc. (VS) | Beeld en video voor advertenties | VS en andere landen | SCC; DPF ONBEKEND | Ja |
| ElevenLabs | Eleven Labs Inc. (VS) | Voice-overs voor advertenties | VS (EU-residentie alleen bij Enterprise) | DPF + SCC | Ja |

**Webdata en SEO**

| Sub-verwerker | Entiteit en land | Doel | Verwerkingslocatie | Waarborg doorgifte | DPA |
| --- | --- | --- | --- | --- | --- |
| Firecrawl | SideGuide Technologies, Inc. (VS) | Webpagina's lezen | VS | ONBEKEND: geen DPF en geen SCC's gevonden | Geen openbare DPA (zie open punt 2) |
| Apify | Apify Technologies s.r.o. (Tsjechië) | Openbare socialmediagegevens | AWS, regio ONBEKEND; subverwerkers in de VS | n.v.t. (EU); de DPA bevat SCC's voor doorgifte naar de VS | Ja |
| DataForSEO | DataForSEO OÜ (Estland) | Zoekposities, zoekwoorden en vermeldingen in AI-antwoorden | Hetzner Duitsland, plus subverwerkers in de VS | n.v.t. (EU) | Ja |

**Communicatie en kanalen**

| Sub-verwerker | Entiteit en land | Doel | Verwerkingslocatie | Waarborg doorgifte | DPA |
| --- | --- | --- | --- | --- | --- |
| Resend | Plus Five Five, Inc. (VS) | E-mail | Verzending vanuit Ierland (eu-west-1); account-, metadata en logs in de VS | DPF (hercertificering in behandeling) + SCC | Ja |
| Meta: WhatsApp Business | Meta Platforms Ireland Limited (Ierland) | Berichten van en aan Clyde via WhatsApp | Wereldwijd (EER en VS) | SCC via het EU Data Transfer Addendum; WhatsApp LLC staat in het DPF | Ja, via de Meta Global Processor Terms |
| Recall.ai | Hyperdoc Inc. (San Francisco, VS) | Vergaderingen opnemen en uitschrijven, alleen als Clyde een vergadering bijwoont | EU-regio Frankfurt (eu-central-1). Volgens de DPA vindt de primaire verwerking in de VS plaats | SCC (geen DPF) | Ja |

**Betalingen**

| Sub-verwerker | Entiteit en land | Doel | Verwerkingslocatie | Waarborg doorgifte | DPA |
| --- | --- | --- | --- | --- | --- |
| Stripe | Stripe Payments Europe, Limited (Ierland) | Betalingen en abonnementen | Doorgifte naar Stripe, LLC (VS) en wereldwijd | DPF (Stripe, LLC) + SCC | Ja |

### A.2 Derde partijen (geen sub-verwerker)

Bij deze partijen is de aanbieder zelf verwerkingsverantwoordelijke. Een verwerkersovereenkomst is daar niet mogelijk.

| Partij | Entiteit | Waarvoor | Rol |
| --- | --- | --- | --- |
| Meta: Instagram en Facebook (Graph API) | Meta Platforms Ireland Limited (Ierland) | Publiceren, statistieken en berichten op gekoppelde accounts | Meta is zelfstandig verwerkingsverantwoordelijke ("data exporter") onder de Meta Platform Terms |
| Telegram | Telegram Messenger Inc. (land ONBEKEND; EER-vertegenwoordiger EDPO) | Berichten aan Clyde via Telegram | Een botontwikkelaar geldt bij Telegram als derde partij. Gegevens van EER-gebruikers staan in Nederlandse datacenters |

_Bronnen: de DPA-, privacy- en trustpagina's van de leveranciers en dataprivacyframework.gov, peildatum 2026-10-12. Deze lijst wordt bijgewerkt bij wijzigingen conform artikel 10.2._

---

## Annex B: Retentiebeleid

De termijnen volgen artikel 6 van de privacyverklaring.

| Gegevenscategorie | Bewaartermijn |
| --- | --- |
| Gegevens van actieve accounts | Duur van de serviceovereenkomst, behalve waar hieronder een kortere termijn staat |
| Na beëindiging | Exportperiode van 30 dagen, daarna permanent verwijderd (artikel 13) |
| Geheugen en gesprekken van Clyde | Founding 6 maanden, Growth en Professional 12 maanden, Enterprise zolang het account actief is |
| Chatbotgesprekken op websites van klanten | Zonder toestemming van de bezoeker na 30 dagen geanonimiseerd, met toestemming na 12 maanden verwijderd |
| Instagram-berichten | Tekst en id's van afzender en ontvanger na 90 dagen gewist; alleen tellingen blijven over |
| Leads en aanvragen via de website | 24 maanden |
| Inboxgesprekken | 24 maanden na het laatste bericht |
| Video-uploads die niet gepubliceerd worden | 24 uur |

De opschoning draait periodiek, waardoor gegevens tot een maand na het verstrijken van de termijn kunnen blijven staan.

De privacyverklaring noemt daarnaast 12 maanden voor antwoorden op de AI Readiness Scan en 7 jaar voor factuurgegevens. Die gegevens verwerkt FMai als verwerkingsverantwoordelijke, en ze vallen buiten deze overeenkomst.

---

## Ondertekening

**Verwerkingsverantwoordelijke:**

Naam: **********\_\_\_\_**********
Functie: **********\_\_\_\_**********
Datum: **********\_\_\_\_**********
Handtekening: **********\_\_\_\_**********

**Verwerker (Future Marketing AI):**

Naam: **********\_\_\_\_**********
Functie: **********\_\_\_\_**********
Datum: **********\_\_\_\_**********
Handtekening: **********\_\_\_\_**********
