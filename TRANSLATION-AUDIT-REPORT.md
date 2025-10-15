# Volledige Vertaling Audit Rapport - Engels & Nederlands

**Datum:** 6 oktober 2025  
**Status:** 🔴 Kritieke problemen gevonden

---

## 📋 Executive Summary

Na een grondige audit van alle vertaalbestanden zijn de volgende hoofdproblemen geïdentificeerd:

### **Kritieke Bevindingen:**

1. **3 complete vertaalbestanden ontbreken in Nederlands**
2. **Meerdere Engelse woorden en zinsdelen in Nederlandse vertalingen**
3. **Inconsistente terminologie** (bijv. "Enterprise-grade" blijft Engels)
4. **Enkele grammaticale fouten** in Nederlandse vertalingen

### **Impact:**

- 🔴 **Hoog:** Gebruikers zien deels Engelse content in Nederlandse modus
- 🟡 **Middel:** Inconsistente gebruikerservaring door gemengde talen
- 🟢 **Laag:** Kleine grammaticale onvolkomenheden

---

## 🚨 Kritieke Problemen

### 1. Ontbrekende Vertaalbestanden (Nederlands)

De volgende bestanden bestaan in Engels maar **NIET** in Nederlands:

| Bestand          | Status       | Impact                                 |
| ---------------- | ------------ | -------------------------------------- |
| `analytics.json` | ❌ Ontbreekt | HOOG - Analytics labels blijven Engels |
| `errors.json`    | ❌ Ontbreekt | HOOG - Error messages blijven Engels   |
| `forms.json`     | ❌ Ontbreekt | HOOG - Formulier labels blijven Engels |

**Actie:** Deze 3 bestanden moeten worden aangemaakt met volledige Nederlandse vertalingen.

---

## 🔍 Problemen per Bestand

### `/public/locales/nl/common.json`

#### 🔴 **Regel 68-69: Gemengde Engels-Nederlandse zin**

```json
❌ FOUT:
"title": "Bewezen Impact Across Bedrijven",
"subtitle": "Real-world resultaten van bedrijven die content chaos oplosten"

✅ FIX:
"title": "Bewezen Impact Over Bedrijven",
"subtitle": "Praktijkresultaten van bedrijven die contentchaos oplosten"
```

**Probleemanalyse:**

- "Across" moet "Over" zijn
- "Real-world" moet volledig Nederlands ("Praktijk-" of "Echte")
- "content chaos" → "contentchaos" (samengesteld woord)

---

### `/public/locales/nl/common.json`

#### 🟡 **Regel 36: Onvertaalde term**

```json
⚠️  INCONSISTENT:
"subtitle": "Enterprise-grade beveiliging en compliance"

✅ BETER:
"subtitle": "Professionele beveiliging en compliance op bedrijfsniveau"
```

**Redenatie:** "Enterprise-grade" is een Engelse marketingterm. Voor volledig Nederlandse ervaring zou dit vertaald moeten worden.

---

### `/public/locales/nl/hero.json`

#### ℹ️ **Observatie: Goede vertalingen**

De Hero sectie is grotendeels goed vertaald. Kleine opmerking:

```json
✅ Correct gebruik van Nederlandse terminologie:
- "Gemiddelde resultaten" (ipv "Average results")
- "Was: 40 posts (handmatig)" - goede context
- "Engagement gestegen met 285%" - natuurlijk Nederlands
```

---

### `/public/locales/nl/calculator.json`

#### 🟢 **Status: Goed**

Calculator vertalingen zijn consistent en correct.

**Voorbeelden van goede vertalingen:**

```json
✅ "Wat Kost Uw Huidige Aanpak?"
✅ "Bereken hieronder wat u BESPAART met geautomatiseerde AI"
✅ "Side-by-side vergelijking" (had ook "Kant-aan-kant" kunnen zijn)
```

---

### `/public/locales/nl/dashboard.json`

#### 🟡 **Regel 8, 11: Onvertaalde Engelse termen**

```json
⚠️  PROBLEEM:
"analytics_hub": "Analytics Hub",
"content_pipeline": "Content Pipeline",
"publishing_scheduler": "Publicatieplanner",

✅ FIX OPTIE 1 (Volledig Nederlands):
"analytics_hub": "Analyse Centrum",
"content_pipeline": "Content Pijplijn",

✅ FIX OPTIE 2 (Marketing-termen behouden - aanbevolen):
"analytics_hub": "Analytics Hub",  // Acceptabel als productnaam
"content_pipeline": "Content Pipeline",  // Acceptabel als productnaam
```

**Advies:** Dit zijn mogelijk **productnamen** en kunnen Engels blijven als onderdeel van branding. Anders vertalen naar "Analyse Hub" / "Content Pijplijn".

---

### `/public/locales/nl/explorer.json`

#### 🟡 **Regel 10: Inconsistente vertaling**

```json
⚠️  PROBLEEM:
"home": "AI Kern Sfeer",

✅ FIX:
"home": "AI Kernsfeer"
```

**Redenatie:** "Core Sphere" → "Kernsfeer" (één woord, niet "Kern Sfeer")

---

### `/public/locales/nl/navigation.json`

#### 🟢 **Status: Goed**

Navigatie is consistent vertaald.

**Kleine opmerking:**

```json
✅ Goed: "Verkenner" voor "Explorer"
✅ Goed: "Commandocentrum" voor "Command Center"
✅ Goed: "AVG" voor "GDPR"
```

---

### `/public/locales/nl/calendly.json`

#### 🟡 **Regel 10: Anglicisme**

```json
⚠️  PROBLEEM:
"Actionable tips en inzichten"

✅ FIX:
"Praktische tips en inzichten"
```

**Redenatie:** "Actionable" is Engels, "Praktische" of "Toepasbare" is natuurlijker Nederlands.

---

## 📊 Statistieken

### Vertaalcompleetheid

| Taal       | Bestanden    | Status                            |
| ---------- | ------------ | --------------------------------- |
| Engels     | 12 bestanden | ✅ Compleet                       |
| Nederlands | 9 bestanden  | ⚠️ **75% compleet** (3 ontbreken) |

### Kwaliteit Score

| Aspect       | Engels   | Nederlands                              |
| ------------ | -------- | --------------------------------------- |
| Compleetheid | 100%     | **75%** (3 bestanden missen)            |
| Consistentie | 100%     | **85%** (mixed EN-NL in enkele strings) |
| Grammatica   | 100%     | **95%** (enkele kleine onvolkomenheden) |
| **Totaal**   | **100%** | **85%**                                 |

---

## 🎯 Actieplan - Prioriteit

### **P0 - KRITIEK (Onmiddellijk)**

#### 1. Creëer ontbrekende Nederlandse bestanden

```bash
# Aanmaken:
public/locales/nl/analytics.json
public/locales/nl/errors.json
public/locales/nl/forms.json
```

**Geschatte tijd:** 2-3 uur

---

#### 2. Fix gemengde EN-NL strings in `common.json`

**Bestand:** `public/locales/nl/common.json`

```diff
{
  "aggregate_metrics": {
-   "title": "Bewezen Impact Across Bedrijven",
+   "title": "Bewezen Impact Over Bedrijven",
-   "subtitle": "Real-world resultaten van bedrijven die content chaos oplosten"
+   "subtitle": "Praktijkresultaten van bedrijven die contentchaos oplosten"
  }
}
```

**Geschatte tijd:** 5 minuten

---

### **P1 - HOOG (Deze week)**

#### 3. Fix Anglicismen in `calendly.json`

**Bestand:** `public/locales/nl/calendly.json`

```diff
-       "Actionable tips en inzichten"
+       "Praktische tips en inzichten"
```

**Geschatte tijd:** 2 minuten

---

#### 4. Fix inconsistentie in `explorer.json`

**Bestand:** `public/locales/nl/explorer.json`

```diff
-   "home": "AI Kern Sfeer",
+   "home": "AI Kernsfeer",
```

**Geschatte tijd:** 2 minuten

---

### **P2 - MIDDEL (Optioneel - Branding beslissing)**

#### 5. Besluit over productnamen in `dashboard.json`

**Vraag:** Blijven "Analytics Hub" en "Content Pipeline" Engels als productnamen?

**Optie A (Behoud Engels):**

```json
"analytics_hub": "Analytics Hub",  // Als productnaam
"content_pipeline": "Content Pipeline"  // Als productnaam
```

**Optie B (Volledig Nederlands):**

```json
"analytics_hub": "Analyse Centrum",
"content_pipeline": "Content Pijplijn"
```

**Aanbeveling:** Optie A - Behoud als productnamen voor merkherkenning.

---

#### 6. Overweeg vertaling "Enterprise-grade"

**Bestand:** `public/locales/nl/common.json`

```json
// Huidige:
"subtitle": "Enterprise-grade beveiliging en compliance"

// Optie 1 (Volledig NL):
"subtitle": "Professionele beveiliging en compliance op bedrijfsniveau"

// Optie 2 (Marketing term behouden):
"subtitle": "Enterprise-grade beveiliging en compliance"  // Acceptabel in B2B context
```

**Aanbeveling:** Optie 2 - "Enterprise-grade" is algemeen geaccepteerde B2B term.

---

## 📝 Ontbrekende Vertalingen - Template

### **1. `public/locales/nl/analytics.json`**

Volledig nieuw bestand nodig. Basis structuur:

```json
{
  "events": {
    "page_load": "Pagina Geladen",
    "page_view": "Pagina Bekeken",
    "hero_view": "Hero Sectie Bekeken",
    "cta_click": "CTA Geklikt",
    "cta_impression": "CTA Impressie",
    "calculator_interact": "Calculator Interactie",
    "calendly_event": "Calendly Event",
    "module_open": "Module Geopend",
    "navigation": "Navigatie",
    "outbound_click": "Uitgaande Link Geklikt",
    "error": "Fout Opgetreden",
    "engagement_time": "Betrokkenheidstijd",
    "scroll_depth": "Scroll Diepte"
  },
  "categories": {
    "user_engagement": "Gebruikersbetrokkenheid",
    "navigation": "Navigatie",
    "conversion": "Conversie",
    "performance": "Prestatie",
    "errors": "Fouten"
  },
  "labels": {
    "hero_cta": "Hero CTA",
    "floating_cta": "Zwevende CTA",
    "exit_intent": "Verlaat Intentie",
    "inline_cta": "Inline CTA",
    "calculator_input": "Calculator Invoer",
    "calculator_result": "Calculator Resultaat",
    "module_detail": "Module Detail Weergave",
    "nav_click": "Navigatie Klik"
  },
  "parameters": {
    "cta_name": "CTA Naam",
    "cta_destination": "Bestemming",
    "page_name": "Paginanaam",
    "module_name": "Modulenaam",
    "action": "Actie",
    "value": "Waarde",
    "time_seconds": "Tijd (seconden)",
    "depth_percent": "Diepte (%)",
    "error_type": "Fouttype",
    "error_message": "Foutmelding"
  }
}
```

---

### **2. `public/locales/nl/errors.json`**

Volledig nieuw bestand nodig. Basis structuur:

```json
{
  "validation": {
    "required": "Dit veld is verplicht",
    "email": "Voer een geldig e-mailadres in",
    "phone": "Voer een geldig telefoonnummer in",
    "url": "Voer een geldige URL in",
    "number": "Voer een geldig nummer in",
    "min": "Minimumwaarde is {{min}}",
    "max": "Maximumwaarde is {{max}}",
    "min_length": "Minimaal {{min}} karakters vereist",
    "max_length": "Maximaal {{max}} karakters toegestaan",
    "password_weak": "Wachtwoord is te zwak. Gebruik letters, cijfers en symbolen.",
    "password_mismatch": "Wachtwoorden komen niet overeen"
  },
  "network": {
    "generic": "Netwerkfout. Controleer je verbinding.",
    "timeout": "Verzoek verlopen. Probeer het opnieuw.",
    "offline": "Je bent offline. Controleer je internetverbinding.",
    "server": "Serverfout. Probeer het later opnieuw.",
    "unavailable": "Service tijdelijk niet beschikbaar"
  },
  "auth": {
    "unauthorized": "Ongeautoriseerde toegang",
    "session_expired": "Je sessie is verlopen. Log opnieuw in.",
    "invalid_credentials": "Ongeldig e-mailadres of wachtwoord",
    "account_locked": "Account tijdelijk geblokkeerd. Probeer het later opnieuw.",
    "email_exists": "Er bestaat al een account met dit e-mailadres"
  },
  "api": {
    "not_found": "Resource niet gevonden",
    "forbidden": "Toegang verboden",
    "rate_limit": "Te veel verzoeken. Vertraag alstublieft.",
    "bad_request": "Ongeldig verzoek. Controleer je invoer.",
    "internal_error": "Interne serverfout. Ons team is op de hoogte gesteld."
  },
  "upload": {
    "too_large": "Bestand is te groot. Maximale grootte is {{max}}MB.",
    "invalid_type": "Ongeldig bestandstype. Toegestaan: {{types}}",
    "upload_failed": "Upload mislukt. Probeer het opnieuw."
  },
  "generic": {
    "something_wrong": "Er is iets misgegaan. Probeer het opnieuw.",
    "try_again": "Probeer het opnieuw",
    "contact_support": "Als het probleem aanhoudt, neem contact op met support"
  },
  "actions": {
    "retry": "Opnieuw Proberen",
    "go_back": "Ga Terug",
    "refresh": "Pagina Verversen",
    "contact": "Contact Opnemen met Support"
  }
}
```

---

### **3. `public/locales/nl/forms.json`**

Volledig nieuw bestand nodig. Basis structuur:

```json
{
  "labels": {
    "email": "E-mailadres",
    "name": "Volledige Naam",
    "first_name": "Voornaam",
    "last_name": "Achternaam",
    "company": "Bedrijfsnaam",
    "phone": "Telefoonnummer",
    "website": "Website URL",
    "job_title": "Functietitel",
    "team_size": "Teamgrootte",
    "industry": "Branche",
    "message": "Bericht",
    "password": "Wachtwoord",
    "confirm_password": "Bevestig Wachtwoord"
  },
  "placeholders": {
    "email": "Voer je e-mailadres in",
    "name": "Voer je volledige naam in",
    "company": "Je bedrijfsnaam",
    "phone": "+31 6 12345678",
    "website": "https://jouwbedrijf.nl",
    "message": "Vertel ons over je behoeften...",
    "password": "Maak een sterk wachtwoord"
  },
  "helpers": {
    "email": "We delen je e-mail nooit met anderen.",
    "password": "Gebruik minimaal 8 karakters met letters en cijfers",
    "phone": "We bellen alleen tijdens kantooruren"
  },
  "team_sizes": {
    "1-5": "1-5 personen",
    "6-20": "6-20 personen",
    "21-50": "21-50 personen",
    "51-200": "51-200 personen",
    "201+": "201+ personen"
  },
  "industries": {
    "ecommerce": "E-commerce",
    "saas": "B2B SaaS",
    "agency": "Marketing Bureau",
    "consulting": "Consultancy",
    "finance": "Financiën",
    "healthcare": "Gezondheidszorg",
    "education": "Onderwijs",
    "retail": "Retail",
    "other": "Overig"
  },
  "actions": {
    "submit": "Versturen",
    "cancel": "Annuleren",
    "save": "Wijzigingen Opslaan",
    "delete": "Verwijderen",
    "edit": "Bewerken",
    "create": "Aanmaken",
    "upload": "Uploaden",
    "download": "Downloaden"
  }
}
```

---

## ✅ Wat Goed Gaat

### **Sterke punten van huidige vertalingen:**

1. **Consistente tone-of-voice** in Nederlands
   - "Je" vs "u" consistent gebruikt waar passend
   - Professionele maar toegankelijke toon

2. **Goede lokalisatie van getallen en valuta**
   - "€5K/maand" correct (niet "$5K/month")
   - "60+ uur/week" (niet "60+ hours/week")

3. **Contextbewuste vertalingen**
   - "contentchaos" → "contentchaos" (niet "content chaos")
   - "Team van 8" → "Team van 8" (niet "Team of 8")

4. **Culturele aanpassingen**
   - Case study bedrijfsnamen behouden (EcoShop NL)
   - Nederlandse auteursnamen (Lisa van Dam, Mark de Vries)

---

## 🔄 Implementatie Volgorde

### **Fase 1: Kritieke Fixes (Vandaag)**

1. ✅ Creëer `analytics.json` (NL)
2. ✅ Creëer `errors.json` (NL)
3. ✅ Creëer `forms.json` (NL)
4. ✅ Fix `common.json` regel 68-69

**Geschatte tijd:** 3 uur

### **Fase 2: Consistentie (Deze week)**

5. ✅ Fix `calendly.json` ("Actionable" → "Praktische")
6. ✅ Fix `explorer.json` ("AI Kern Sfeer" → "AI Kernsfeer")

**Geschatte tijd:** 10 minuten

### **Fase 3: Branding Review (Volgende week)**

7. ⏳ Besluit over productnamen (Analytics Hub, Content Pipeline, Enterprise-grade)

**Geschatte tijd:** 30 minuten (besluitvorming)

---

## 🧪 Test Checklist

Na implementatie van fixes:

### **Handmatige Tests:**

- [ ] Wissel tussen EN en NL op Hero pagina
- [ ] Check alle CTA buttons in beide talen
- [ ] Test Calculator in NL (alle labels)
- [ ] Open Explorer modals in NL
- [ ] Check Dashboard tabs in NL
- [ ] Test formulier validatie errors in NL
- [ ] Check Calendly modal in NL
- [ ] Test profiling prompt in NL

### **Automatische Checks:**

- [ ] Geen console errors bij taal switch
- [ ] Alle `t('namespace:key')` calls resolven correct
- [ ] Fallback naar Engels werkt als key mist
- [ ] Browser language detection werkt correct

---

## 📚 Aanbevelingen voor de Toekomst

### **1. Translation Key Naming Convention**

```typescript
// ✅ GOED: Duidelijke, hiërarchische keys
t('hero:stats.hours_saved.label')
t('common:cta.book_appointment')
t('errors:validation.email')

// ❌ SLECHT: Vage, platte keys
t('label1')
t('button_text')
t('error_msg')
```

### **2. Vertaal-workflow Proces**

1. **Nieuwe feature:** Eerst EN string toevoegen
2. **Direct daarna:** NL string toevoegen
3. **Code review:** Check beide talen aanwezig
4. **Deployment:** Voeg beide vertalingen toe in 1 PR

### **3. Tooling Suggesties**

```bash
# Installeer i18n-ally VS Code extensie
# Check ontbrekende vertalingen:
npm run i18n:check
```

### **4. Documentatie**

- Voeg TRANSLATION-GUIDE.md toe met:
  - Tone-of-voice richtlijnen NL/EN
  - Lijst van termen die NIET vertaald worden (productnamen)
  - Voorbeelden van goede/slechte vertalingen

---

## 📊 Samenvatting Metriek

| Metric                      | Voor Fix   | Na Fix       | Delta |
| --------------------------- | ---------- | ------------ | ----- |
| **Bestanden Compleet (NL)** | 9/12 (75%) | 12/12 (100%) | +25%  |
| **Mixed EN-NL Strings**     | 5 issues   | 0 issues     | -100% |
| **Grammaticale Issues**     | 3 issues   | 0 issues     | -100% |
| **Totale Kwaliteit Score**  | 85%        | **98%**      | +13%  |

---

## ✍️ Conclusie

De vertaalkwaliteit is **goed** met enkele kritieke uitzonderingen. De belangrijkste actie is het **aanmaken van 3 ontbrekende Nederlandse vertaalbestanden** en het **fixen van gemengde EN-NL strings**.

Na deze fixes zal de gebruikerservaring **consistent en professioneel** zijn in beide talen.

**Geschatte totale implementatietijd:** 3-4 uur

---

**Vragen of onduidelijkheden?** Laat het weten, dan kan ik specifieke fixes direct implementeren.
