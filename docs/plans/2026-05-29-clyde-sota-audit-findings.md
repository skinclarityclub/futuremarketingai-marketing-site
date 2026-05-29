# Clyde Chatbot — SOTA Audit Findings (uitvoering)

> Uitvoering van het plan in `2026-05-29-clyde-sota-audit-handover.md`. Hybride methode: Playwright-harness lokaal (`tests/e2e/clyde-capture.spec.ts`, NL desktop, live tegen `:3100` met production `ANTHROPIC_API_KEY`) + een 8-gebieden static deep-dive workflow (61 agents, 52/52 adversarieel bevestigde bevindingen) + agent-oordeel op screenshots/tekst-dumps.
>
> Datum: 2026-05-29. Server: `npx next dev -p 3100`. Key: `vercel env pull --environment=production` (ANTHROPIC_API_KEY zit alleen in production). Bewijs-dumps: `fmai-nextjs/.audit-screens/*.json` + `*.png`.

## 0. Kernconclusie (waarom "de sidebar klopt niet")

De klacht van de user is gereproduceerd en verklaard. Twee onafhankelijke oorzaken:

1. **De sidebar-CARDS renderen Engelse content op de NL-site.** Clyde's chat-tekst is correct Nederlands, maar de tool-result-cards (pricing, case study, deels ROI) tonen hardcoded Engelse strings. Dat is de zichtbare mismatch. Voorbeeld pricing-card op `/nl`: "All 12 skills included", "Unlimited workspaces", "Lifetime price lock at 997 EUR", "Email support", "499 EUR per workspace per month". Case-study-card: "Sindy runs SkinClarity Club across 4 brands...", "Zero added headcount".
2. **Off-context tools uit de oude SkinClarity-persona's vuurden in agency-context.** Een prospect die "hoe reset ik mijn wachtwoord" typte kreeg een **nep support-ticket** (`#TKT-...`, "Ticket created successfully... ETA: 24 hours"); "product voor droge huid" opende een skincare **ProductCard**.

Daarnaast een blokkerende UX-bug die het testen aanvankelijk onmogelijk maakte (en echte first-time bezoekers raakt): de **cookie-banner (`z-[9999]`, `fixed bottom-0`) ligt over de Clyde-FAB** (`z-40`, `lg:bottom-24`) op desktop — de FAB is pas klikbaar nadat de banner is weggeklikt.

## 1. Deze sessie gefixt + bewezen

| # | Fix | Bestand | Bewijs |
|---|---|---|---|
| F1 | **BUG-1**: desktop sidebar-titel was hardcoded "Details"; nu dynamisch `TOOL_PANEL_TITLES[toolName]` | `components/chatbot/SidePanel.tsx` | T1 "Onze vaardigheden", T2 "Tarieven", T3 "ROI berekening", T4 "Case study", T5 "Plan een gesprek" ✅ |
| F2 | **Copy-bug**: kopieer-knop nam de rauwe `CHIPS:`-regel mee; nu gestript via `stripChipsLine()` | `components/chatbot/ChatMessages.tsx` | `rawChipsLeak:false` overal + copy levert schone tekst |
| F3 | **Off-context tools uit normale chat** (VRAAG-1): engine strip `search_products, get_product_details, build_routine, add_to_cart_suggestion, search_knowledge_base, create_ticket, check_status, escalate_to_human, explain_module, get_roi_info` in niet-demo modus (demo behoudt ze) | `lib/chatbot/engine.ts` | **Vóór**: G4→nep-ticket card, G2→ProductCard. **Na**: G4 `hasSidebar:false`, G2 `hasSidebar:false` ✅ |
| F4 | **qualify_lead titel** stond op "ROI berekening"; nu "Jouw match" | `components/chatbot/tool-results/index.tsx` | T9 sidebarTitle "Jouw match" ✅ |
| F5 | **Persona-prompt hardening**: NL-taal-respect, em-dash-verbod, NL-vervoeging, "herhaal niet wat de kaart toont"; em-dash uit prompt-body | `lib/chatbot/personas/clyde.ts` | minder em-dashes + betere beknoptheid |
| F6 | **maxTokens 500→700**: chat-tekst werd mid-woord afgekapt ("...marktonderzoek + conc") | `lib/chatbot/personas/clyde.ts` | T1 na fix: volledige respons, geen truncatie ✅ |

> **Belangrijke code-ontdekking** (relevant voor toekomstige fixes): `createPersonaTools()` retourneert hard `flagshipTools` (ALLE tools) en negeert de `persona.tools{}`-whitelist in `clyde.ts` volledig. Die whitelist wordt enkel door de ongebruikte `executeToolCall`-backup gelezen. Tools wijzigen voor de live chat moet dus via `flagship-tools.ts` of (zoals F3) de engine-filter.

## 1b. Vervolgsessie — "alles opgepakt" (i18n + overige fixes, bewezen)

Alle resterende open punten zijn in een vervolgronde opgepakt op dezelfde branch. 22/22 regressie groen, tsc clean (m.u.v. de pre-existing lighthouse-spec). De secties §2-§4 hieronder beschrijven de oorspronkelijke bevindingen; onderstaande zijn nu gefixt.

**Locale-architectuur (de #1 follow-up):** locale loopt nu van `usePersonaChat` (useLocale) naar request-context naar `engine` naar een per-request **tool-factory** `buildFlagshipTools(locale)`. Card-DATA is locale-gekeyd (nl/en/es):
- **Pricing** (`tool-data.ts`): tiers met gelokaliseerde price-label + features. /nl toont nu "€499 per werkruimte/mnd", "Alle 12 vaardigheden inbegrepen" (geen `€998/mo` of Engels meer). en/es API-geverifieerd.
- **Case study** (`concierge-tools.ts`): challenge/solution/results/testimonial in nl/en/es. /nl volledig NL, /en Engels (API-geverifieerd).
- **Qualify** recommendations + nextSteps in nl/en/es. **book_call** url locale-aware.

**Card-render (`cardI18n.ts` helper + 4 cards):**
- Chrome-labels (headers, CTA's, trust-signals, "Populair") locale-aware in ServiceCard/LeadScoreCard/CaseStudyCard/BookingCard.
- ROI-card: NL-getalformaat (€6.202 i.p.v. €6,202), "1 maand" i.p.v. "1 month", em-dash uit CTA, maand-uren i.p.v. week-uren onder /mnd-label. ROI tool: guard tegen deel-door-nul.
- **`accent-secondary` → `accent-human`**: die token was nergens gedefinieerd; alle card-CTA-gradients renderden teal-only. Nu correct teal-naar-amber.

**Overige:**
- ProgressiveCTA: Engels naar NL, Calendly/`/contact` naar `/apply`.
- Loading/error-fallback in de cards: NL.
- complexity-detector: de `sonnet`-tier was aan haiku gewired (dead routing); nu echte `claude-sonnet-4-6` voor complexe/lange/diepe queries. **Kostennotitie:** verhoogt kosten/latency licht voor de minderheid complexe beurten; bewust gekozen voor conversatiekwaliteit (haiku maakte NL-vervoegingsfouten). Terugdraaien = sonnet weer op haiku-id.

**Resteert (bewust gedeferd, lage prioriteit):** get_skills skill-beschrijvingen zijn NL op en/es; een paar ROI metric-labels NL op en/es; live/coming-soon-badge op de skills-card; em-dashes in model-output (prompt-regel mitigeert, geen harde render-strip); auto-greet vuurde niet in Playwright (verifieer in echte browser); TicketCard-token (removed-tool card); Calendly-restant in dode demo-guide `book_demo`.

## 1c. Sessie 3 — i18n-data + demo-cleanup + chrome-i18n (bewezen)

Vervolg op §1b. Drie van de gedeferde punten zijn alsnog opgepakt + bewezen, 3 commits op de branch (`048b32b`, `dc40736`, `1d693c2`):

- **get_skills nl/en/es** (`skill-i18n.ts`): overview + single-skill beschrijvingen + features locale-aware (en/es overlay, NL uit SKILLS_DATA). API-geverifieerd 3 locales.
- **Coming-soon-badge**: `ServiceCard` rendert `status==='coming_soon'` als "Binnenkort/Coming soon/Próximamente" (live bevestigd op /en + /es). ROI metric-labels via `cardI18n`.
- **Guided demo NL/agency**: skincare + support scenario's verwijderd, 2 agency-scenario's met alleen echte tools; demo-chrome + entry-knop locale-aware; off-context tools in BEIDE modi gestript. **Marketing Machine volledig weg** — `explain_module`+`get_roi_info` uit flagship-tools, `DEMO_GUIDE_TOPICS` uit flagship-kb (dit lekte het 7-modulen-product in Clyde's tekst, ook zonder de tool), 6-skill topic uit ecommerce-kb, `demo-guide-tools.ts`+`demo-guide-kb.ts` verwijderd. `guided-demo.spec.ts` herschreven naar /nl (17/17 groen).
- **Chat-chrome i18n** (`useChatChrome.ts`, sweep-bevinding): sidebar-titel + follow-up-chips + knop-/aria-labels waren hardcoded NL op en/es (titel "Onze vaardigheden" boven Engelse kaart; chips NL én als bericht verstuurd). Nu nl/en/es. Live bewezen /en "Our skills" + chips 3/3, /es "Nuestras habilidades" + chips 3/3.

Resteert: cookie-banner-FAB op desktop (lift-logica bestaat, visueel verifiëren), em-dashes in output, firefox/webkit live sweep, branch push/merge. Zie `2026-05-29-clyde-next-session-handover.md`.

## 2. Open — KRITIEK (oorspronkelijke bevinding; pricing + case nu gefixt, zie §1b)

| Bevinding | Bestand:regel | Bewijs / fix |
|---|---|---|
| **Pricing-card volledig Engels** + `/mo`-suffix + flat starter-prijzen die het per-werkruimte-model verbergen (`€998/mo` i.p.v. "€499 per werkruimte") | data: `lib/chatbot/tool-data.ts:31-99` (CHATBOT_TIERS), render: `tool-results/ServiceCard.tsx:186-190` | NL-data + render `pricePerWorkspace` + band, suffix `/mnd` |
| **Case-study-card challenge/solution/results Engels** (alleen het testimonial-citaat is NL) | `lib/chatbot/tools/concierge-tools.ts:9-20` | Vertaal data naar NL |
| **Welcome/suggested-prompts/nudges/follow-ups NL-only** → op `/en` en `/es` Nederlands | `components/chatbot/ChatWidgetIsland.tsx:16-120` | i18n via next-intl messages |
| **ProgressiveCTA**: volledig Engels + linkt naar **Calendly + /contact** i.p.v. `/apply` | `components/chatbot/ProgressiveCTA.tsx:38-90` | NL + CTA → `/apply`, Calendly weg |
| `explain_module` rendert volledig Engelse "Marketing Machine"-content (niet-bestaand 7-modulen product, "300+ posts/month", "3.2x ROAS") | `lib/chatbot/knowledge/demo-guide-kb.ts:7-99` | **Gemitigeerd** (F3 haalt het uit normale chat); nog actief in demo-mode → verwijder of herschrijf naar 12-skill NL |

## 3. Open — HOOG

- **Locale bereikt de prompt nooit**: `context.language` is altijd `'nl'` (`usePersonaChat.ts:29-33`); EN/ES-bezoekers krijgen een NL-biased system-prompt zonder per-locale taalinstructie (`prompt-builder.ts:72`). Dit is de wortel van alle i18n-mismatch en blokkeert correcte EN/ES-cards. **Dit is de #1 architecturale fix** (zie §6).
- **Skills-card maakt geen onderscheid live vs coming-soon** — 3 coming-soon skills zien er live uit (`concierge-tools.ts:81-86`). Clyde's tekst markeert "(coming soon)" wel; de card niet.
- **ROI-card "1 month" / "months" Engels** op NL-card (`LeadScoreCard.tsx:77-81`) + **US-getalformaat** `€6,202` i.p.v. `€6.202`.
- **ROI-card label/eenheid-mismatch**: weekuren (36) onder maand-label "Uren terug/mnd" (`LeadScoreCard.tsx:82`).
- **Negatieve besparing / -100% ROI** bij lage/0-uren input (`leadgen-tools.ts:156-159`); **Infinity%** bij `monthlySubscription=0` (`leadgen-tools.ts:153-155`).
- **BookingCard primaire CTA** gebruikt ongedefinieerde kleur-token `accent-secondary` → rendert teal-only i.p.v. teal-naar-amber gradient (`BookingCard.tsx:58, 27`).
- **BookingCard toont interne reden-string als body**: "Gebruiker wil een gesprek plannen om FutureMarketingAI beter te leren kennen" (klinkt als systeemnotitie; `concierge-tools.ts` book_call).
- **Hardcoded i18n-strings** (NL-chrome dat niet wisselt op /en|/es): `ChatMessages.tsx` (Bekijk details, Vraag verder, Kopieer, Opnieuw genereren, Bewerk), `ServiceCard/BookingCard/CaseStudyCard` headers+CTA's, `index.tsx` TOOL_PANEL_TITLES/TOOL_FOLLOWUPS, `ChatHeader/ChatInput/FloatingButton/ProactiveNudge`.
- **E-commerce/support cards zelf zijn Engels + off-domain** (ProductCard "Your Skincare Routine"/"View Details" `ProductCard.tsx:64,111`; KBArticleCard "Knowledge Base Results"/"Read" `:94`; TicketCard support-flow Engels). **Gemitigeerd in normale chat door F3**, maar nog bereikbaar in demo-mode → overweeg helemaal verwijderen.
- **Legacy "Marketing Machine" 6-skill model** leeft in KB (`ecommerce-kb.ts:39-71`) en concurreert met het correcte 12-skill antwoord.

## 4. Open — MEDIUM / LAAG

- **Em-dashes** in Clyde's gegenereerde tekst — prompt-regel (F5) vermindert maar elimineert niet (haiku blijft ze in opsommingen gebruiken). Overweeg post-hoc strip in de render-laag (`MarkdownContent`) als hard-eis.
- **Nederlandse vervoegingsfouten** door haiku ("ik bouwt/levert/analyseert") — F5 instrueert het; monitor.
- **Calendly-resten**: `demo-guide-tools.ts:91-95` book_demo bevat dode Calendly-URL met legacy `futuremarketingai`-handle.
- **Loading/error-fallbacks Engels** op NL (`index.tsx:108-119` "Loading...", "Something went wrong").
- **complexity-detector dead routing**: belooft Sonnet-escalatie maar beide tiers resolven naar hetzelfde haiku-model-id (`complexity-detector.ts:73-76`).
- **Twee concurrerende 'pricing' KB-topics** (concierge-kb + support-kb) beide in Clyde geïnjecteerd.
- **CHIPS-contract broos**: model kan rauwe `CHIPS:`-regel lekken of weglaten (zwakke parse-fallback) — in praktijk geen leak waargenomen (`rawChipsLeak:false` in alle 18 runs), maar randgeval blijft.

## 5. Wat goed is (geverifieerd)

- T6 (voor-wie-niet) + T8 (vs ChatGPT) + T10 (off-topic): eerlijke, scherpe NL-antwoorden met relevante chips, geen competitor-bashing.
- Sindy correct gecrediteerd als operator/founder; **geen** vermelding van Daley's co-eigendom.
- Multi-card swap (VRAAG-2): skills→pricing wisselt correct, geen restanten/race.
- Chips verschijnen, geen rauwe `CHIPS:`-leak in de bubble (18/18 runs).
- ROI-getallen plausibel (€6.202/mnd, 621%, payback 1 maand). Domein `future-marketing.ai/apply` correct in qualify-card.

## 6. #1 aanbeveling: locale-aware card-data (architectuur)

De grootste resterende oorzaak is dat **card-DATA hardcoded is (meestal Engels) en locale de tools nooit bereikt**. Aanbevolen aanpak:

1. `usePersonaChat` stuurt de echte locale mee in de request body (nu hardcoded `nl`).
2. `engine.ts` geeft `context.language` door aan `createPersonaTools` / de tool-executie.
3. Tool-execute-functies (`concierge-tools.ts`, `leadgen-tools.ts`, `tool-data.ts`) retourneren gelokaliseerde strings (NL/EN/ES) i.p.v. één hardcoded taal — of de cards lezen uit `next-intl` messages.
4. Card-chrome (`ServiceCard`, `LeadScoreCard`, etc.) labels via `useTranslations()`.

Tussenoplossing met directe impact als bovenstaande te groot is voor één PR: vertaal de hardcoded card-data naar **NL** (de authoritative + primaire live-locale). Dat fixt `/nl` (de feitelijke klacht) onmiddellijk; `/en`+`/es` blijven dan een aparte i18n-taak (waren al fout).

## 7. SOTA-acceptatiecriteria (handover §7) — scorecard

| # | Criterium | Status |
|---|---|---|
| 1 | Geen Engelse tekst op /nl | ❌ pricing- + case-card nog Engels (kritiek open) |
| 2 | Sidebar-titel betekenisvol (niet "Details") | ✅ F1 + F4 |
| 3 | Geen lege/kapotte/placeholder card | ⚠️ build_routine gaf blanco card → tool weg uit normale chat (F3) |
| 4 | Geen foute prijs | ✅ bedragen kloppen met SSoT; ⚠️ framing (`/mo` flat) misleidend |
| 5 | Elke respons heeft vervolg-chips | ✅ 18/18 |
| 6 | Geen irrelevante card (skincare/ticket) | ✅ F3 (was ❌) |
| 7 | Geen rauwe `CHIPS:`-regel | ✅ 18/18 |
| 8 | Sidebar sluit / juiste card | ✅ swap + titels correct |
| 9 | Geen ontwijkend antwoord (prijs/fit/bewijs) | ✅ T2/T4/T6 eerlijk + concreet |
| 10 | Geen trage/janky/overflow | ✅ geen overflow waargenomen; FAB-achter-cookiebanner is de UX-blocker |

## 8. Regressie

- `tests/e2e/clyde-capture.spec.ts` — env-gedreven capture-harness (screenshots + tekst-dumps), gebruikt voor deze audit.
- `tests/e2e/clyde-audit.spec.ts` — uitgebouwd met deterministische asserties (cookie pre-seed, regenerate-knop = "klaar"-signaal, titel-checks, off-context-guards, geen CHIPS-leak). Live-tests guarden op `RUN_CLYDE_LIVE=1`.
- Pre-existing (niet door deze audit veroorzaakt, buiten scope): `tests/e2e/audit-v2-lighthouse.spec.ts:90` tsc-error `TestDetails.timeout` (Playwright API-drift).
