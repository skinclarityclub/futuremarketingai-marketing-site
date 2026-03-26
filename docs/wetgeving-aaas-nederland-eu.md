---
title: Wetgeving AI Agents as a Service (AaaS) - Nederland & EU
tags: #legal #compliance #ai-act #gdpr #nederland
created: 2026-03-20
source: Web research maart 2026
---

# Wetgeving AI Agents as a Service (AaaS) — Nederland & EU

Volledig juridisch overzicht voor een bedrijf dat AI agents (chatbots, voice agents, marketing automation) als service verkoopt aan marketing agencies in Nederland en de EU.

**Status**: Maart 2026
**Disclaimer**: Dit is een onderzoeksoverzicht, geen juridisch advies. Raadpleeg een jurist voor definitieve compliance.

---

## 1. EU AI Act

### 1.1 Risicoclassificatie van marketing AI agents

De EU AI Act hanteert vier risiconiveaus. Marketing AI agents vallen in twee categorieen:

**Minimaal risico (geen specifieke verplichtingen)**:
- Basis email marketing automation
- AI-powered spelling/grammatica checkers
- Analytics en reporting dashboards
- SEO tools en keyword research
- Content recommendation engines (zonder uitgebreide profilering)

**Beperkt risico / Limited risk (transparantieverplichtingen via Artikel 50)**:
- Chatbots en conversational AI voor klantencontact
- AI-gegenereerde marketing content en creatieve materialen
- Deepfake of synthetische media in advertenties
- AI-systemen die tekst genereren voor publieke communicatie
- Voice agents die gesprekken voeren met mensen

Marketing AI agents zijn GEEN hoog risico, tenzij ze worden ingezet voor:
- Kredietwaardigheidsbeoordeling
- Werknemersselectie
- Biometrische identificatie
- Manipulatie van gedrag op een schadelijke manier

### 1.2 Transparantieverplichtingen (Artikel 50)

**Kernverplichting**: Personen moeten weten dat ze met een AI-systeem communiceren en niet met een mens, tenzij dit evident is uit de context.

Concreet voor jouw diensten:
- **Chatbots**: Moeten bij het begin van elk gesprek duidelijk maken dat het een AI is
- **Voice agents**: Moeten aan het begin van het gesprek melden dat het een AI-systeem is
- **AI-gegenereerde content**: Moet herkenbaar en labelbaar zijn als AI-gegenereerd (machine-readable markering)
- **Deepfakes/synthetische media**: Verplichte labeling

**Deadline**: Artikel 50 wordt van kracht op **2 augustus 2026**.

De Europese Commissie publiceerde op 17 december 2025 het eerste concept van de Code of Practice voor Transparantie van AI-Gegenereerde Content. Een tweede concept wordt verwacht in maart 2026, met een definitieve code in juni 2026.

### 1.3 Boetes

| Overtreding | Maximale boete |
|---|---|
| Verboden AI-gebruik | EUR 40 miljoen of 7% jaaromzet |
| Niet-naleving hoog-risico verplichtingen | EUR 15 miljoen of 3% jaaromzet |
| Niet-naleving transparantieverplichtingen (Art. 50) | EUR 15 miljoen of 3% jaaromzet |
| Onjuiste of misleidende informatie verstrekken | EUR 7,5 miljoen of 1,5% jaaromzet |

**Voor MKB/startups**: De lagere drempel geldt (dus als 3% van je omzet lager is dan EUR 15M, geldt dat lagere bedrag).

### 1.4 Tijdlijn

| Datum | Wat wordt van kracht |
|---|---|
| 2 feb 2025 | Verboden AI-praktijken + AI-geletterdheidsplicht |
| 2 aug 2025 | Verplichtingen voor general-purpose AI modellen |
| **2 aug 2026** | **Transparantieverplichtingen (Art. 50) + algemene toepassing** |
| 2 aug 2027 | Aanvullende eisen voor specifieke hoog-risico systemen |

### 1.5 Concrete acties EU AI Act

1. **Nu**: Zorg dat je team AI-geletterd is (verplicht sinds feb 2025)
2. **Voor aug 2026**: Implementeer transparantie-disclosure in alle chatbots en voice agents
3. **Voor aug 2026**: Zorg voor machine-readable labeling van AI-gegenereerde content
4. **Documenteer**: Welke AI-systemen je inzet en hun risicoclassificatie
5. **Volg**: De definitieve Code of Practice (verwacht juni 2026)

---

## 2. AVG/GDPR voor AI Agents

### 2.1 Verwerkersovereenkomst (DPA) — ketenverplichting

Bij AaaS voor agencies heb je te maken met een verwerkingsketen:

```
Jouw bedrijf (verwerker/sub-verwerker)
    |
    v
Marketing agency (verwerkingsverantwoordelijke of verwerker)
    |
    v
Agency's klanten (betrokkenen / verwerkingsverantwoordelijke)
```

**Verplichte documenten**:
1. **Verwerkersovereenkomst** tussen jou en elke agency-klant
2. **Sub-verwerkersovereenkomst** als de agency zelf verwerker is voor hun klant
3. **Lijst van sub-verwerkers** (OpenAI, Anthropic, hosting providers, etc.)
4. Agency moet **toestemming** geven voor elke sub-verwerker die je inzet

**In de verwerkersovereenkomst moet staan**:
- Onderwerp en duur van de verwerking
- Aard en doel van de verwerking
- Type persoonsgegevens en categorieen betrokkenen
- Beveiligingsmaatregelen (TOMs — Technische en Organisatorische Maatregelen)
- Procedure voor datalekken (meldplicht binnen 72 uur)
- Audit-rechten voor de verwerkingsverantwoordelijke
- Geheimhoudingsplicht
- Instructies voor internationale doorgifte

### 2.2 Data minimalisatie

**Wat een AI agent mag opslaan**:
- Alleen gegevens die strikt noodzakelijk zijn voor het doel
- Gesprekslogs alleen als daar een gerechtvaardigd doel voor is
- Geen overbodige persoonsgegevens in trainingdata of context

**Wat je moet regelen**:
- Automatische retentieperiodes instellen (bijv. 30/90 dagen)
- Geen persoonsgegevens gebruiken voor modeltraining zonder expliciete toestemming
- Anonimiseer of pseudonimiseer waar mogelijk
- Documenteer welke data je opslaat en waarom (register van verwerkingsactiviteiten)

### 2.3 Recht op vergetelheid bij AI agents met geheugen

Dit is een van de complexste uitdagingen:

**Verplichtingen**:
- Je moet delete requests kunnen afhandelen binnen 1 maand
- Alle persoonsgegevens van de betrokkene moeten verwijderbaar zijn
- Dit geldt ook voor gesprekslogs, opgebouwd klantprofiel, en vector embeddings

**Praktische aanpak**:
1. Sla conversatiedata op met een koppeling aan een uniek klant-ID
2. Bouw een mechanisme om alle data van een specifiek klant-ID te verwijderen
3. Als je RAG (Retrieval Augmented Generation) gebruikt: zorg dat documenten per klant verwijderbaar zijn
4. Vector databases: implementeer filtering/verwijdering per klant-ID
5. LLM fine-tuning op klantdata: vermijd dit, of documenteer dat verwijdering uit een model technisch onmogelijk is en bied alternatieven

### 2.4 Data residency en US-based LLM APIs

**Kernprobleem**: Elke API-call naar een US-based LLM is potentieel een internationale doorgifte van persoonsgegevens.

**EU-US Data Privacy Framework (DPF)**:
- Aangenomen juli 2023 als opvolger van Privacy Shield
- OpenAI en Anthropic zijn gecertificeerd onder het DPF
- MAAR: juridische aanvechting (Schrems III) wordt verwacht — het DPF kan opnieuw ongeldig worden verklaard

**Provider-specifieke oplossingen**:

| Provider | EU Data Residency | DPA beschikbaar | Retentie |
|---|---|---|---|
| OpenAI API | Ja, EU-regio beschikbaar | Ja, via OpenAI Ireland Ltd. | 30 dagen (ZDR mogelijk) |
| Anthropic Claude API | Ja, EU-verwerking sinds aug 2025 | Ja, automatisch in Commercial Terms | 7 dagen (ZDR beschikbaar) |

**Aanbevolen aanpak**:
1. **Gebruik EU data residency** bij OpenAI en Anthropic — dit elimineert het Schrems-risico
2. Sluit een **DPA met SCCs** af met elke LLM-provider
3. Overweeg **EU-hosted alternatieven** (Mistral, of self-hosted open-source modellen)
4. Documenteer je **Transfer Impact Assessment (TIA)** als je toch US-verwerking gebruikt
5. Implementeer **end-to-end encryptie** en minimaliseer persoonsgegevens in prompts

### 2.5 DPIA (Data Protection Impact Assessment)

**Een DPIA is verplicht** voor jouw AI agents. De Autoriteit Persoonsgegevens (AP) heeft AI op de lijst van hoog-risicoverwerkingen geplaatst.

Een DPIA is verplicht als 2 of meer van deze 9 criteria van toepassing zijn:
1. Evaluatie of scoring (profilering)
2. Geautomatiseerde besluitvorming
3. Systematische monitoring
4. Gevoelige gegevens
5. Grootschalige verwerking
6. Matching of combineren van datasets
7. Kwetsbare betrokkenen
8. Innovatief gebruik van technologie
9. Blokkering van een recht of dienst

**Voor AI agents zijn minimaal criteria 1, 3, 5, en 8 van toepassing** — dus een DPIA is altijd verplicht.

**Wat moet in een DPIA**:
- Beschrijving van de verwerking en doeleinden
- Beoordeling van noodzaak en proportionaliteit
- Risicobeoordeling voor betrokkenen
- Maatregelen om risico's te beperken
- Raadpleeg de Functionaris Gegevensbescherming (FG/DPO) als je die hebt

**AP Ontwikkelingen 2026**:
- De AP publiceert in 2026 guidance over GDPR-voorwaarden voor AI-modeltraining
- De AP werkt aan verduidelijking van het recht op uitleg bij geautomatiseerde besluitvorming
- De AP zet het tweejaarlijkse AI & Algoritme Risico Rapport voort
- Nederland werkt aan een AI-regulatory sandbox (verwacht 2026)

---

## 3. Telecom/Voice Wetgeving Nederland

### 3.1 Bel-me-niet Register en telemarketing

**Huidige situatie (tot 1 juli 2026)**:
- Het Bel-me-niet Register is afgeschaft
- Bedrijven mogen alleen bellen als de persoon toestemming heeft gegeven OF bestaande klant is
- ACM houdt toezicht

**Nieuwe regels vanaf 1 juli 2026**:
- **Alleen bellen met expliciete, voorafgaande toestemming (opt-in)**
- De uitzondering voor bestaande klanten vervalt
- Toestemming moet aantoonbaar en verifieerbaar zijn
- Toestemming moet gekoppeld zijn aan de specifieke persoon
- Uitzonderingen alleen voor: goede doelen, bepaalde loterijen, tijdschriftuitgevers

### 3.2 AI Voice Agents — specifieke regels

**EU AI Act (vanaf aug 2026)**:
- Voice agents MOETEN aan het begin van elk gesprek melden dat het een AI-systeem is
- Dit is een wettelijke verplichting onder Artikel 50

**Telecommunicatiewet**:
- Alle telemarketingregels gelden ook voor AI voice agents — er is geen uitzondering voor geautomatiseerde systemen
- De opt-in verplichting geldt ongeacht of een mens of AI belt
- Je moet kunnen bewijzen dat de gebelde persoon toestemming heeft gegeven

**ACM handhaving**:
- ACM controleert actief op naleving van telemarketingregels
- ACM waarschuwt dat telefonische verkopers expliciete toestemming moeten kunnen bewijzen
- Bij overtreding kan ACM boetes opleggen

### 3.3 Concrete acties voor AI voice agents

1. **Implementeer verplichte AI-disclosure** aan het begin van elk gesprek
2. **Bouw een opt-in mechanisme** met audit trail (wie gaf wanneer toestemming)
3. **Geen cold calling** — alleen personen die expliciete toestemming hebben gegeven
4. **Bewaar toestemmingsbewijzen** gekoppeld aan telefoonnummers
5. **Bied altijd een opt-out** mogelijkheid tijdens het gesprek
6. **B2B uitzondering**: Telemarketing aan zakelijke nummers kent iets soepelere regels, maar de AI-disclosure blijft verplicht

---

## 4. ePrivacy/Cookie Wetgeving

### 4.1 Chatbots op websites

**Cookie-implicaties**:
- Als je chatbot cookies plaatst voor tracking/identificatie: cookietoestemming vereist
- Functionele cookies (bijv. sessie-ID om gesprek te onthouden): geen toestemming nodig
- Analytics cookies op chatbot-interacties: toestemming vereist

**Conversational data opslag**:
- Gesprekslogs zijn persoonsgegevens als ze herleidbaar zijn tot een persoon
- AVG-regels voor opslag en retentie zijn van toepassing
- Informeer gebruikers via het privacybeleid over opslag van chatgesprekken

### 4.2 Concrete acties

1. Zorg dat je chatbot-widget geen tracking cookies plaatst zonder toestemming
2. Vermeld chatbot-dataverwerking in het privacybeleid van de website
3. Stel retentieperiodes in voor gesprekslogs
4. Bied gebruikers de mogelijkheid om hun gespreksgeschiedenis te verwijderen

---

## 5. Commerciele Wetgeving

### 5.1 KvK Registratie

**Vereisten**:
- Inschrijving bij KvK is verplicht voor elk bedrijf in Nederland
- Sinds september 2025 bestaan SBI-codes uit 5 cijfers

**Relevante SBI-codes** (na herziening 2025):
- Software development / IT-dienstverlening (exacte nieuwe code verifiëren bij KvK)
- Mogelijk aanvullende code voor advies/consultancy
- Neem contact op met KvK voor de meest passende code voor "AI agents as a service"

**Aanbevolen rechtsvorm**: BV (besloten vennootschap) vanwege:
- Beperkte aansprakelijkheid (persoonlijk vermogen beschermd)
- Professionele uitstraling voor B2B
- Fiscale voordelen bij hogere omzet

### 5.2 Algemene Voorwaarden voor AaaS

**Verplichte elementen**:
- Beschrijving van de dienst en SLA (Service Level Agreement)
- Prijzen, betaalvoorwaarden, opzegtermijnen
- Aansprakelijkheidsbeperking en -uitsluiting
- Intellectueel eigendom clausules
- Geheimhouding/NDA bepalingen
- Verwerkersovereenkomst (als bijlage of apart document)
- Force majeure clausule
- Toepasselijk recht en bevoegde rechter
- Procedure bij datalekken
- AI-specifiek: disclaimer dat AI-output niet altijd accuraat is

**Aanbevolen**: Gebruik ICT-recht specifieke voorwaarden (bijv. via ICTrecht.nl of Nederland ICT Voorwaarden)

### 5.3 Aansprakelijkheid bij AI-fouten

**Huidige situatie (maart 2026)**:
- De EU AI-aansprakelijkheidsrichtlijn is ingetrokken door de Europese Commissie (12 februari 2025)
- Er is voorlopig GEEN specifieke EU-regelgeving voor AI-aansprakelijkheid
- Reguliere aansprakelijkheidsregels (BW Boek 6) zijn van toepassing

**Risico's**:
- Als een AI agent onjuiste informatie geeft aan leads/klanten van de agency
- Als een AI agent onbedoeld beloftes doet namens de agency
- Als een AI agent discriminerende of aanstootgevende content genereert

**Mitigatie**:
1. **Contractuele aansprakelijkheidsbeperking** in je algemene voorwaarden
2. **Disclaimers** dat AI-output niet 100% accuraat is
3. **Human-in-the-loop** voor kritieke beslissingen
4. **Content filters** en guardrails op AI-output
5. **Logging** van alle AI-interacties voor bewijsvoering
6. **Maximale aansprakelijkheid** begrenzen tot bijv. 12 maanden abonnementskosten

### 5.4 Beroepsaansprakelijkheidsverzekering (BAV)

**Aanbevolen maar niet wettelijk verplicht** (tenzij je in een gereguleerd beroep valt).

**Let op bij polisvoorwaarden**:
- Veel verzekeraars nemen uitsluitingen op voor "autonome systemen" of "zelflerende systemen zonder menselijke controle"
- Controleer of AI-gerelateerde fouten gedekt zijn
- Overweeg een specifieke tech/cyber aansprakelijkheidsverzekering
- BAV dekt fouten in dienstverlening, ook als AI een rol speelt, MITS zorgvuldig gebruikt

**Aanbevolen verzekeringen**:
1. Beroepsaansprakelijkheidsverzekering (BAV) — dekt fouten in advies/dienstverlening
2. Bedrijfsaansprakelijkheidsverzekering (AVB) — dekt schade aan derden
3. Cyberverzekering — dekt datalekken en cyberincidenten

---

## 6. Intellectual Property

### 6.1 Auteursrecht op AI-gegenereerde content

**Huidige juridische situatie (maart 2026)**:

- Onder Nederlands en EU-auteursrecht is **menselijk auteurschap vereist** voor auteursrechtbescherming
- Het Hof van Justitie van de EU bevestigt dat een werk een "persoonlijke stempel" van een menselijke maker moet dragen
- **Puur AI-gegenereerde content (prompt in, tekst uit) heeft GEEN auteursrechtbescherming**
- Content waarbij een mens substantieel creatief bijdraagt (selectie, bewerking, samenstelling) KAN wel beschermd zijn

**Europees Parlement (10 maart 2026)**:
- Het EP heeft een resolutie aangenomen over "auteursrecht en generatieve AI"
- Het EP stelt voor dat content creators het recht krijgen om opt-out te kiezen voor AI-training
- EUIPO zou een gecentraliseerd Europees register van licentieaanbiedingen kunnen beheren

### 6.2 Eigendom van AI-gegenereerde content

**Wie is eigenaar?**
- Er is geen auteursrecht, dus technisch gezien is er geen "eigenaar"
- Contractueel kun je wel afspraken maken over gebruiksrechten
- In je voorwaarden: regel dat de klant gebruiksrecht krijgt op de output, maar dat je geen auteursrechtgarantie geeft

**In je contract opnemen**:
1. Klant krijgt gebruiksrecht op alle AI-gegenereerde output
2. Geen garantie dat output auteursrechtelijk beschermd is
3. Klant is verantwoordelijk voor controle op inbreuk op rechten van derden
4. Vrijwaring voor IP-claims van derden

### 6.3 AI-gegenereerde content als "origineel" verkopen

- Je mag AI-gegenereerde content verkopen als dienst
- Je mag het NIET presenteren als "door mensen geschreven" als het dat niet is (misleiding)
- Vanaf augustus 2026 moet AI-gegenereerde content gelabeld worden (EU AI Act Art. 50)
- De Reclame Code Commissie kan optreden tegen misleidende claims over de oorsprong van content

---

## 7. Sectorspecifieke Regels

### 7.1 Reclame Code Commissie (RCC)

- De Nederlandse Reclame Code geldt voor alle reclame-uitingen, ook AI-gegenereerde
- Reclame mag niet misleidend zijn — AI-output die onware claims bevat is in strijd met de code
- De Reclamecode Social Media & Influencer Marketing (RSM) wordt in 2026 geupdate vanwege AI-ontwikkelingen
- Bij klachten over AI-gegenereerde reclame is de adverteerder (jouw klant/agency) verantwoordelijk

### 7.2 DDMA Gedragscodes

- DDMA werkt aan updates van hun gedragscodes voor 2026
- Code Reclame via E-mail is vernieuwd (maart 2025)
- Code Telemarketing wordt in 2026 herzien
- EU Code of Practice voor transparantie van AI-gegenereerde content wordt ontwikkeld met stakeholders

**DDMA-lidmaatschap** overwegen:
- Geeft toegang tot actuele gedragscodes en guidance
- Toont professionaliteit aan agencies

### 7.3 Financiele dienstverlening (AFM)

**Als jouw agencies financiele klanten hebben, gelden extra regels**:

- AFM intensiveert in 2026 toezicht op AI-gebruik in de financiele sector
- AI-systemen moeten **uitlegbaar en controleerbaar** zijn
- Financiele instellingen moeten hun AI-toepassingen in kaart brengen
- **Model risk management** en datakwaliteit moeten versterkt worden
- Besluitvormingslogica moet gedocumenteerd zijn
- Incidenten moeten actief gemeld worden

**Concrete impact voor jou**:
- Als een agency jouw AI agents inzet voor een financiele klant, val je indirect onder AFM-toezicht
- Bouw extra logging en uitlegbaarheid in voor financiele use cases
- Overweeg een contractuele uitsluiting of meerprijs voor financiele dienstverlening
- Zorg dat AI agents geen beleggingsadvies of financiele aanbevelingen doen zonder vergunning

### 7.4 Digital Fairness Act (verwacht 2026)

De Europese Commissie publiceert in 2026 een concept voor de Digital Fairness Act, met focus op:
- Dark patterns
- Misleidende personalisatie
- Addictief design
- Ondoorzichtige prijsvorming
- Transparantie in influencer marketing

---

## 8. Praktische Compliance Checklist

### 8.1 Minimaal vereist om legaal te opereren (Quick Wins)

**Onmiddellijk regelen**:

- [ ] **KvK inschrijving** met juiste SBI-code
- [ ] **Verwerkersovereenkomst (DPA)** opstellen voor klanten
- [ ] **Privacybeleid** dat AI-dataverwerking beschrijft
- [ ] **DPA's afsluiten** met OpenAI/Anthropic (EU data residency activeren)
- [ ] **AI-disclosure** implementeren in alle chatbots ("U spreekt met een AI-assistent")
- [ ] **Algemene voorwaarden** met aansprakelijkheidsbeperking
- [ ] **Register van verwerkingsactiviteiten** (Art. 30 AVG)
- [ ] **AI-geletterdheid** van je team documenteren (verplicht sinds feb 2025)
- [ ] **Beroepsaansprakelijkheidsverzekering** afsluiten

### 8.2 Voor augustus 2026 (EU AI Act deadline)

- [ ] **DPIA uitvoeren** voor je AI agent diensten
- [ ] **Transparantie-compliance** volledig implementeren (Art. 50)
- [ ] **Machine-readable labeling** van AI-gegenereerde content
- [ ] **Voice agents**: AI-disclosure aan begin van elk gesprek
- [ ] **Documentatie** van AI-systemen en hun risicoclassificatie
- [ ] **Sub-verwerkerslijst** bijwerken en aan klanten communiceren
- [ ] **Data retentiebeleid** implementeren met automatische verwijdering
- [ ] **Delete-mechanisme** bouwen voor recht op vergetelheid

### 8.3 Complexere vereisten (doorlopend)

- [ ] **Transfer Impact Assessment** voor US-gebaseerde LLM APIs
- [ ] **Incident response plan** voor datalekken
- [ ] **Contractuele frameworks** voor verschillende klanttypen
- [ ] **Monitoring** van regelgevingsupdates (AI Act, ePrivacy, DFA)
- [ ] **Overweeg FG/DPO aanstelling** als je grootschalig persoonsgegevens verwerkt
- [ ] **Jaarlijkse review** van DPIA en compliance-status

### 8.4 Documenten die je klaar moet hebben voor klanten

| Document | Status |
|---|---|
| Algemene Voorwaarden (AV) | Verplicht |
| Verwerkersovereenkomst (DPA) | Verplicht |
| Privacybeleid | Verplicht |
| Sub-verwerkerslijst | Verplicht |
| Service Level Agreement (SLA) | Sterk aanbevolen |
| DPIA samenvatting (geanonimiseerd) | Op verzoek |
| Beveiligingsbeleid / TOMs | Op verzoek |
| ISO 27001 certificering | Nice-to-have (vertrouwenwekkend) |
| AI Act compliance statement | Aanbevolen vanaf aug 2026 |

---

## 9. Samenvatting Risico-inschatting

| Risico | Impact | Urgentie | Actie |
|---|---|---|---|
| Geen DPA met klanten | Hoog (AVG-boete tot 4% omzet) | Nu | DPA opstellen en laten tekenen |
| Geen AI-disclosure in chatbots | Middel (boete tot 3% omzet) | Voor aug 2026 | Implementeren |
| US data transfer zonder SCCs | Hoog (AVG-boete) | Nu | EU data residency activeren |
| Geen DPIA | Middel (AP kan handhaven) | Voor aug 2026 | DPIA uitvoeren |
| Geen opt-in voor voice calls | Hoog (ACM-boete) | Voor jul 2026 | Opt-in systeem bouwen |
| Geen aansprakelijkheidsbeperking | Hoog (onbeperkte claim) | Nu | In AV opnemen |
| AI-content als "menselijk" verkopen | Middel (misleiding) | Nu | Eerlijk communiceren |
| Financiele klanten zonder extra zorg | Hoog (AFM-handhaving) | Doorlopend | Extra compliance voor fin. sector |

---

## 10. Bronnen

### EU AI Act
- [EU AI Act - Artikel 50 Transparantieverplichtingen](https://artificialintelligenceact.eu/article/50/)
- [EU AI Act - Artikel 6 Classificatieregels](https://artificialintelligenceact.eu/article/6/)
- [EU AI Act 2026 Compliance Guide - LegalNodes](https://www.legalnodes.com/article/eu-ai-act-2026-updates-compliance-requirements-and-business-risks)
- [EU AI Act en Marketing - Conformitas](https://conformitas.legal/knowledge-hub/eu-ai-act-and-marketing-what-every-european-business-needs-to-know-about-compliance/)
- [EU AI Act Samenvatting - SIG](https://www.softwareimprovementgroup.com/blog/eu-ai-act-summary/)
- [Code of Practice Transparantie - EC](https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content)

### AVG/GDPR en Data
- [AP - Regels voor AI en Algoritmen](https://www.autoriteitpersoonsgegevens.nl/en/themes/algorithms-ai/algorithms-ai-and-the-gdpr/rules-for-using-ai-algorithms)
- [AP - EU AI Act](https://www.autoriteitpersoonsgegevens.nl/en/themes/algorithms-ai/eu-ai-act)
- [OpenAI Data Processing Addendum](https://openai.com/policies/data-processing-addendum/)
- [OpenAI EU Data Residency](https://openai.com/index/introducing-data-residency-in-europe/)
- [Anthropic DPA](https://privacy.claude.com/en/articles/7996862-how-do-i-view-and-sign-your-data-processing-addendum-dpa)
- [GDPR en AI in Nederland - Law & More](https://lawandmore.eu/using-ai-in-your-dutch-business-gdpr-and-compliance-risks-explained-2/)

### Telecom en Telemarketing
- [ACM Telemarketing Regels](https://www.consuwijzer.nl/telefonische-verkoop/telemarketing/wanneer-mag-bedrijf-ongevraagd-bellen)
- [Rijksoverheid - Regels telefonische verkoop](https://www.rijksoverheid.nl/onderwerpen/bescherming-van-consumenten/regels-voor-telefonische-verkoop)
- [DDMA - Telemarketing opt-in](https://ddma.nl/kennisbank/telemarketing-ook-opt-in-nodig-bij-bestaande-klanten/)
- [DDMA - Nieuwe regels telemarketing FAQ](https://ddma.nl/kennisbank/de-meest-gestelde-vragen-over-de-nieuwe-regels-voor-telemarketing/)

### Aansprakelijkheid en IP
- [ICTrecht - AI en contractuele aansprakelijkheid](https://www.ictrecht.nl/blog/ai-en-contractuele-aansprakelijkheid-in-de-praktijk-woorden-doen-er-toe)
- [Blue Legal - AI Aansprakelijkheid](https://blue-legal.nl/en/ict-recht/ai-aansprakelijkheid/)
- [EU Parlement - Auteursrecht en generatieve AI](https://www.europarl.europa.eu/thinktank/en/document/EPRS_BRI(2025)782585)
- [AI-gegenereerde content aansprakelijkheid - Law & More](https://lawandmore.eu/ai-generated-content-who-is-liable-for-errors-under-dutch-and-eu-rules-2/)

### AFM en Sectorspecifiek
- [AFM Agenda 2026](https://www.afm.nl/en/persbericht/2026/jan/pb-agenda-2026)
- [DDMA Legal Wrapped 2025-2026](https://ddma.nl/kennisbank/legal-wrapped-wat-bracht-2025-wat-brengt-2026/)
