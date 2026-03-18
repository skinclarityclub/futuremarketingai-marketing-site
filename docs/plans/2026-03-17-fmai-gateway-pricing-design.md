---
title: 'FMai Gateway Services Pricing Design'
tags: [pricing, strategie, gateway-services, chatbot, voice-agent, automations]
created: 2026-03-17
source: Claude Code brainstorming session
---

# FMai Gateway Services — Pricing Design

## Context

FMai is gepivet van een pure marketing-machine naar een breder AI-services aanbod: **automations, chatbots en voice agents**. De Marketing Machine (€15K/mo flagship) is nog niet bewezen — er is eerst een case study nodig (SKC pilot, 8-12 weken). In de tussentijd moeten gateway services direct omzet genereren.

**Doel**: €5-10K/mo omzet binnen 3 maanden met 5-10 klanten op competitief mid-range pricing.

**Beslissingen (17 maart 2026)**:

- Doelgroep: Mix NL + internationaal
- Positionering: Competitief mid-range
- Capaciteit: 5-10 klanten als solo operator
- Presentatie: Hybrid (prijzen zichtbaar, details via call)
- Bundeling: Bundels met korting (tiered pakketten)
- API-kosten: Inbegrepen tot soft cap
- Contract: Maandelijks opzegbaar
- Overage: Soft cap + upsell bij check-in

---

## Pricing Architectuur

### Drie Tiered Pakketten

#### STARTER — €1.497/mo

| Kenmerk         | Details                          |
| --------------- | -------------------------------- |
| **Setup fee**   | €2.500 eenmalig                  |
| **Services**    | 1 service naar keuze             |
| **Chatbot**     | 1.000 gesprekken/mo              |
| **Voice Agent** | 200 minuten/mo                   |
| **Automations** | 5 workflows                      |
| **Inclusief**   | Hosting, updates, e-mail support |
| **Overage**     | Soft cap — upsell bij check-in   |
| **Contract**    | Maandelijks opzegbaar            |
| **Jouw kosten** | ~€10-30/mo                       |
| **Marge**       | ~98%                             |

**Ideale klant**: MKB dat wil starten met AI, 1 specifiek probleem oplossen.

---

#### GROWTH — €2.497/mo

| Kenmerk         | Details                                                |
| --------------- | ------------------------------------------------------ |
| **Setup fee**   | €4.500 eenmalig                                        |
| **Services**    | 2 services naar keuze                                  |
| **Chatbot**     | 3.000 gesprekken/mo                                    |
| **Voice Agent** | 500 minuten/mo                                         |
| **Automations** | 10 workflows                                           |
| **Inclusief**   | Analytics dashboard, maandelijks rapport, chat support |
| **Overage**     | Soft cap — upsell bij check-in                         |
| **Contract**    | Maandelijks opzegbaar                                  |
| **Jouw kosten** | ~€50-100/mo                                            |
| **Marge**       | ~96%                                                   |

**Ideale klant**: Groeiend bedrijf dat meerdere processen wil automatiseren.

---

#### SCALE — €3.997/mo

| Kenmerk         | Details                                                 |
| --------------- | ------------------------------------------------------- |
| **Setup fee**   | €7.500 eenmalig                                         |
| **Services**    | Alle 3 services                                         |
| **Chatbot**     | 5.000 gesprekken/mo                                     |
| **Voice Agent** | 1.000 minuten/mo                                        |
| **Automations** | 20 workflows                                            |
| **Inclusief**   | Priority support, maandelijkse strategy call, analytics |
| **Overage**     | Soft cap — upsell bij check-in                          |
| **Contract**    | Maandelijks opzegbaar                                   |
| **Jouw kosten** | ~€130-250/mo                                            |
| **Marge**       | ~94%                                                    |

**Ideale klant**: Scale-up/enterprise die volledige AI-stack wil.

---

## Kosten-onderbouwing

### Marktvalidatie (40+ bronnen, maart 2026)

| Benchmark                           | Marktprijs                   | FMai prijs                      | Verschil           |
| ----------------------------------- | ---------------------------- | ------------------------------- | ------------------ |
| Custom chatbot (agency)             | €2K-10K setup + €500-2.5K/mo | €1.5K-7.5K setup + €697-1.5K/mo | 30-40% onder markt |
| Voice agent (Synthflow/Vapi agency) | €1K-5K setup + €500-1.5K/mo  | Inbegrepen in pakket            | Bundel-voordeel    |
| n8n automation agency               | €2.5K-15K/project + €2-5K/mo | €1K-3K setup + €697-1.5K/mo     | 50-70% onder markt |
| Full-service AI agency bundel       | €5K-20K setup + €3-8K/mo     | €2.5-7.5K setup + €1.5-4K/mo    | ~50% onder markt   |

### API-kosten per eenheid

| Component             | Kosten per eenheid | Bron                           |
| --------------------- | ------------------ | ------------------------------ |
| GPT-4o-mini (chatbot) | ~€0.01/gesprek     | OpenAI pricing maart 2026      |
| Vapi voice (all-in)   | ~€0.13/minuut      | Vapi + Deepgram + TTS + Twilio |
| n8n (self-hosted)     | ~€0/executie       | Eigen VPS (€10/mo gedeeld)     |
| Supabase              | €0-25/mo           | Free tier tot 500MB            |
| VPS hosting           | €10-20/mo          | Hetzner, gedeeld over klanten  |

### Maandelijkse kosten per tier bij gemiddeld gebruik

| Tier    | API kosten | Infra kosten | Totaal   | Marge op retainer |
| ------- | ---------- | ------------ | -------- | ----------------- |
| Starter | €5-15      | €5-15        | €10-30   | 98%               |
| Growth  | €25-60     | €10-20       | €50-100  | 96%               |
| Scale   | €80-200    | €30-50       | €130-250 | 94%               |

---

## Omzetprojecties

### Scenario: 6 klanten in 3 maanden

| Mix                               | Setup (eenmalig) | MRR     | Jouw kosten/mo | Netto/mo    |
| --------------------------------- | ---------------- | ------- | -------------- | ----------- |
| 3x Starter + 2x Growth + 1x Scale | €24.000          | €12.488 | ~€400          | **€12.088** |
| 4x Starter + 2x Growth            | €19.000          | €10.982 | ~€250          | **€10.732** |
| 2x Starter + 2x Growth + 2x Scale | €31.000          | €15.982 | ~€550          | **€15.432** |

---

## Website Presentatie (Hybrid Model)

### Zichtbaar op website

- Drie pakketnamen: **Starter / Growth / Scale**
- "Vanaf €1.497/mo" pricing per tier
- Wat er in elk pakket zit (services, limieten)
- Setup fees met "vanaf" indicatie
- "Kies jouw pakket" CTA naar Calendly discovery call

### Via call besproken

- Exacte scope en customization
- Welke services de klant kiest (bij Starter/Growth)
- Specifieke integraties en complexiteit
- Tijdlijn en planning

### Pricing Page Structuur

```
[Hero: "AI die voor je werkt — kies je pakket"]

[3 kolommen: Starter | Growth (highlighted) | Scale]
  - Prijs/mo
  - Setup fee
  - Services inbegrepen
  - Limieten
  - Support level
  - CTA: "Plan een gesprek"

[FAQ sectie]
  - Wat als ik over mijn limiet ga?
  - Kan ik upgraden?
  - Wat zit er in de setup?
  - Hoe snel is het live?

[Social proof / case studies]
```

---

## Overage en Fair Use Policy

- **Soft cap**: Klant wordt niet geblokkeerd bij overlimiet
- **80% notificatie**: Automatisch bericht wanneer 80% van limiet bereikt
- **Bij overschrijding**: Noteer intern, bespreek upgrade bij volgende check-in
- **Buffer**: Intern 20% meer capaciteit dan geadverteerd
- **Extreme misbruik**: Bij >200% van limiet proactief contact opnemen

---

## Upsell Pad naar Flagship

```
Gateway (€1.5-4K/mo) → Vertrouwen opgebouwd → FMai Marketing Machine (€15K/mo)

Timing: Na 2-3 maanden succesvolle gateway service
Conversie verwacht: 25-35% van gateway klanten
Trigger: Kwartaal-review meeting, resultaten tonen
```

---

## Concurrentiepositie

| Concurrent                | Model                 | Prijs range  | FMai voordeel                             |
| ------------------------- | --------------------- | ------------ | ----------------------------------------- |
| Watermelon.ai (NL)        | SaaS chatbot          | €99-1.650/mo | FMai is full-service, niet self-service   |
| Trengo (NL)               | Communicatie platform | €125-475/mo  | FMai doet meer dan alleen chat            |
| Generic Upwork freelancer | Per project           | €50-150/uur  | FMai biedt ongoing retainer + support     |
| US AI agencies            | Full-service          | $3-8K/mo     | FMai is 40-50% goedkoper                  |
| Synthflow/Vapi direct     | Voice SaaS            | €29-1.250/mo | FMai is managed, klant hoeft niks te doen |

**Positionering**: "Managed AI services — jij hoeft niks te doen, wij bouwen en beheren alles."

---

## Volgende Stappen

1. Pricing page bouwen op de FMai website (3-kolom layout, hybrid model)
2. Service pages updaten met nieuwe pricing referenties
3. Calendly flow opzetten voor discovery calls per tier
4. Fiverr/Upwork gigs aanmaken met deze pricing als basis
5. Contracttemplates maken (maandelijks opzegbaar, scope definitie)
6. Onboarding flow documenteren per service type
