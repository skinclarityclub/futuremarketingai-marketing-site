# Clyde Chatbot — SOTA Full Audit (Handover voor verse sessie)

> Doel: De Clyde-chatbot is de **eerste kennismaking** van een nieuwe client met FutureMarketingAI. Dit moet meteen SOTA-2026 niveau zijn. Deze audit dekt **alles**: conversatie-kwaliteit, tool-triggers, sidebar (primaire focus), interactiviteit, multi-viewport, multi-browser, multi-taal.
>
> Aanpak (door user gekozen): **Hybride** — Playwright lokaal als harness + visuele/semantische review door de agent. Specs worden CI-regressie. API key via `vercel env pull`.

---

## 0. Setup (eerst doen)

### 0.1 API key lokaal
De chatbot route `/api/chatbot` heeft een Anthropic key nodig. Zonder key krijg je 500's en kun je niet met Clyde praten.

```powershell
cd C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs
# Vercel CLI installeren als die er nog niet is:
npm i -g vercel
vercel login            # interactief — user moet dit zelf via ! <command> doen
vercel link             # koppel aan project futuremarketingai
vercel env pull .env.local   # haalt productie-env (incl ANTHROPIC_API_KEY) lokaal
```

Verifieer dat `.env.local` nu een `ANTHROPIC_API_KEY` (of de var die de route gebruikt — check `src/app/api/chatbot/route.ts`) bevat. **Nooit committen** (.env.local staat in .gitignore).

> Als `vercel env pull` niet lukt: vraag user de key te plakken, of kopieer uit `C:\Users\daley\Desktop\fma-app\.env.local` als die er een heeft.

### 0.2 Port-conflict
**Port 3000 is bezet door fma-app** (een ander Next-project). Twee opties:
- Draai de audit-server op een vrije port: `npx next dev -p 3100`
- En zet voor Playwright: `$env:PLAYWRIGHT_BASE_URL = "http://localhost:3100"` (anders start Playwright zelf een server op 3000 en botst het).

Check welke ports bezet zijn:
```powershell
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -ge 3000 -and $_.LocalPort -lt 3200 } |
  ForEach-Object { [PSCustomObject]@{ Port=$_.LocalPort; PID=$_.OwningProcess } } | Sort-Object Port
```

### 0.3 Commando's
```powershell
npx next dev -p 3100                                    # dev server (laat lopen)
$env:PLAYWRIGHT_BASE_URL = "http://localhost:3100"
npx playwright test tests/e2e/clyde-audit.spec.ts       # de nieuwe audit-suite (skeleton meegeleverd)
npx playwright test tests/e2e/clyde-audit.spec.ts --headed --project=chromium   # zien wat er gebeurt
npx playwright show-report                              # HTML rapport met screenshots
```

Voor de **visuele/semantische review** (de oordeel-laag die Playwright niet kan): gebruik `agent-browser` tegen `http://localhost:3100/nl` en beoordeel screenshots zelf, of laat de Playwright-suite screenshots droppen in `test-results/` en lees die met de Read-tool.

---

## 1. Architectuur (wat je test)

### 1.1 Flow
`FloatingChatTrigger` (placeholder, `aria-label="Open chat met Clyde"`) → lazy-load `ChatWidgetIsland` → `ChatWidget`. Na hydratie: `aria-label="Open chat"` / `"Close chat"`. Panel heeft `data-chatwidget-panel`.

### 1.2 Persona / model
- `src/lib/chatbot/personas/clyde.ts` — STATIC_PREFIX (system prompt), `defaultModel: 'haiku'`, `maxTokens: 500`, temp 0.7.
- System prompt bevat sinds 2026-05-29: TOOL ROUTING, HONEST FIT ASSESSMENT, CHIPS FORMAT secties.

### 1.3 Sidebar (PRIMAIRE FOCUS)
`SidePanel.tsx` rendert links van de chat (desktop) of fullscreen overlay (mobile). Toont één `ToolResultRenderer` card.

**7 card-types** (`tool-results/`), mapping in `tool-results/index.tsx` → `TOOL_CARD_MAP`:

| Card | Getriggerd door tools | Bedoeld voor |
|---|---|---|
| `ServiceCard` | `get_skills`, `get_pricing_info`, `explain_module`, `schedule_demo`, `book_demo` | Vaardigheden + tarieven |
| `LeadScoreCard` | `qualify_lead`, `get_roi_estimate`, `get_roi_info` | ROI / lead-score |
| `CaseStudyCard` | `get_case_study` | SkinClarity Club proof |
| `BookingCard` | `book_call` | Conversie → /apply |
| `ProductCard` | `search_products`, `get_product_details`, `build_routine`, `add_to_cart_suggestion` | **E-commerce (SKC restant — relevant?)** |
| `KBArticleCard` | `search_knowledge_base` | Support kennisbank |
| `TicketCard` | `create_ticket`, `check_status`, `escalate_to_human` | Support tickets |

`TOOL_PANEL_TITLES` = de header-titel per tool. `TOOL_FOLLOWUPS` = chips per tool.

---

## 2. PRE-AUDIT BEVINDINGEN (al bevestigd in code — verifieer + fix)

> Deze heb ik tijdens de voorbereiding al in de code gezien. Begin hiermee.

### 🔴 BUG-1: Desktop sidebar titel altijd "Details"
`SidePanel.tsx` regel ~105: de **desktop** panel-header is hardcoded `<span>Details</span>`. Alleen de **mobile** versie (regel ~63) gebruikt `TOOL_PANEL_TITLES[content.toolName] ?? 'Details'`. De "dynamische sidebar titel" (commit 59d2836) werkt dus **niet op desktop**. → Fix: desktop ook `TOOL_PANEL_TITLES[content.toolName] ?? 'Details'` laten gebruiken. Dit verklaart waarschijnlijk de "teksten kloppen niet" observatie van de user.

### 🟠 VRAAG-1: E-commerce/support cards in marketing-context
`ProductCard` (skincare producten), `KBArticleCard`, `TicketCard` zijn restanten van de SKC e-commerce/support persona's maar zitten in `flagshipTools`. Vraag: kan een prospect die "wat kost product X" of "ik heb een probleem" typt een irrelevante skincare-product-card of support-ticket krijgen? Test dit expliciet (zie §4.6). Zo ja → uit Clyde's toolset halen of guarden.

### 🟠 VRAAG-2: Multi-card / opeenvolgende tool-calls
User meldde "soms meerdere dingen laten zien ging niet goed". De sidebar toont maar **één** card (`lastSidePanelTool` = laatste tool met output). Als Clyde in één beurt 2 tools aanroept, of de user snel achter elkaar verschillende cards triggert, wat gebeurt er? Test transitie-gedrag, race conditions, of de juiste card wint (zie §4.5).

---

## 3. Testmatrix — Conversatie & tool-triggers

Voor elke rij: typ de prompt (NL), verifieer (a) juiste tool getriggerd, (b) juiste card in sidebar, (c) card-content klopt + is duidelijk, (d) chips verschijnen + zijn relevant, (e) Clyde's tekst is 1-2 zinnen + premium toon.

| # | Prompt (NL) | Verwachte tool | Card | Let op |
|---|---|---|---|---|
| T1 | "Welke vaardigheden hebben jullie?" | `get_skills` | ServiceCard (12 skills) | Alle 12, klikbaar, NL labels |
| T2 | "Wat kost het voor 4 merken?" | `get_pricing_info` | ServiceCard (tarieven) | Workspace-prijzen correct (Founding €997, Growth €499/ws) |
| T3 | "Bereken ROI: 3 man, 12u/week" | `get_roi_estimate` | LeadScoreCard | Getallen plausibel, NL labels, €-besparing |
| T4 | "Heb je bewijs / een case study?" | `get_case_study` | CaseStudyCard | Sindy testimonial, SKC resultaten, NL |
| T5 | "Ik wil een gesprek plannen" | `book_call` | BookingCard | Trust signals, → /apply, GEEN Calendly iframe |
| T6 | "Voor wie werkt dit NIET?" | (tekst, geen tool) | — | Eerlijk antwoord (honest_fit KB), dan chips |
| T7 | "Wat is jullie geheugen-systeem?" | navigate of tekst | NavigationButton/—| 4-laags geheugen uitleg, link /memory |
| T8 | "Hoe verschil je van ChatGPT?" | (tekst) | — | Geen competitor-bashing, wel onderscheid |
| T9 | "Kwalificeer mij: 50 man, €5k budget, beslisser" | `qualify_lead` | LeadScoreCard | Score + NL aanbevelingen, geen "sales team"/"webinar" |
| T10 | "Wat is de hoofdstad van Australië?" | (tekst) | — | Kort correct + redirect naar marketing |

**Chips-check (kritiek):** Elke tekst-respons moet eindigen met klikbare chips (geparsed uit `CHIPS:`-regel). De `CHIPS:`-regel zelf mag **niet** zichtbaar zijn in de bubble. Klik elke chip → stuurt door als nieuw bericht + sluit sidebar.

---

## 4. Sidebar diepte-audit (PRIMAIRE FOCUS)

### 4.1 Per card — content-accuratesse + duidelijkheid
Open elke card en lees **woord voor woord**. Check op:
- Engelse tekst die NL had moeten zijn (mixed-language)
- Stale/foute prijzen (SSoT: `fma-app/src/lib/skills.ts`, mirror `skills-data.ts`)
- Placeholder/lorem/debug-tekst
- Afgekapte tekst, overflow, lege velden
- Onduidelijke labels (jargon, ongedefinieerde afkortingen)
- CTA's die kloppen (alle → `/apply`, niet self-service)

### 4.2 Card-per-card checklist
- **ServiceCard (skills):** 12 skills, juiste namen/beschrijvingen, "Bekijk vaardigheid" link locale-aware, klik triggert Clyde.
- **ServiceCard (pricing):** 4 tiers, workspace-model correct, features-lijst NL, onboarding-fee vermeld.
- **LeadScoreCard (ROI):** maandelijkse + jaarlijkse besparing, uren/mnd, ROI%, payback. Getallen consistent (geen €0 of NaN bij edge-input).
- **LeadScoreCard (qualify):** score 0-100, qualification-level NL, aanbevelingen FMai-correct.
- **CaseStudyCard:** challenge/solution/results, Sindy testimonial gerenderd, dubbele CTA (case pagina + apply).
- **BookingCard:** 3 trust signals, → /apply, geen Calendly.
- **ProductCard / KBArticleCard / TicketCard:** zie VRAAG-1 — horen die hier?

### 4.3 Desktop titel (BUG-1)
Verifieer per card dat de desktop-header de juiste titel toont (Tarieven / Case study / ROI berekening / ...), niet "Details". Fix → hertest.

### 4.4 Sidebar open/dicht gedrag
- Opent automatisch bij side-panel tool.
- Sluit via ← (back) en × (close).
- Mobile: fullscreen overlay, backdrop-klik sluit, portal naar body.
- Desktop: inline links, animeert breedte (min(520px, 40vw)).
- Nieuwe chat knop → sidebar sluit.

### 4.5 Multi-card / opeenvolgend (VRAAG-2)
- Trigger card A (skills) → dan card B (pricing) → toont sidebar B correct? Geen flikkering/restanten van A?
- Snel 3 verschillende tools achter elkaar → welke wint? Stale data?
- Klik chip terwijl sidebar A open is → sluit + nieuwe respons + evt nieuwe card.
- Clyde die 2 tools in 1 beurt aanroept → gedrag?

### 4.6 Irrelevante triggers (VRAAG-1)
- "Wat kost een serum?" / "ik zoek een product" → ProductCard met skincare? (zou niet moeten in agency-context)
- "Ik heb een probleem / klacht" → TicketCard? (zou niet moeten)
- "Hoe reset ik mijn wachtwoord" → KBArticleCard met SKC support? (zou niet moeten)
- Zo ja: documenteer als bug, advies = die tools uit Clyde's `tools{}` halen.

---

## 5. Interactiviteit-audit

- **Nieuwe chat knop** (SquarePen): zichtbaar zodra bericht aanwezig, reset wist messages + sidebar + herstart auto-greet.
- **Edit** (user-bericht hover → potlood): herstelt tekst in input, trimt conversatie vanaf dat punt.
- **Regenerate** (laatste assistant → ↻): nieuwe respons.
- **Copy** (assistant hover): kopieert tekst (zonder `CHIPS:`-regel? — verifieer dat de gekopieerde tekst geen rauwe CHIPS-regel bevat; `extractText` gebruikt nu de volledige tekst incl CHIPS — **mogelijke bug**, check `CopyButton`).
- **Ctrl+K / focus**: input focus shortcut.
- **Auto-greet**: verschijnt 400ms na openen, met inline prompt-chips.
- **Proactive follow-up**: na 2 min stilte (kort testen met verlaagde timer of code-review).
- **Scroll-nudge / ProactiveNudge**: gedrag bij scrollen.
- **Escape**: sluit chat.

---

## 6. Multi-dimensie matrix

Draai de kern-scenario's (T1-T6) over:
- **Viewports:** desktop (1440×900), tablet (768), mobile (390×844). Sidebar desktop=inline, mobile=overlay.
- **Browsers:** chromium, firefox, webkit (playwright projects al geconfigureerd).
- **Talen:** `/nl`, `/en`, `/es`. Verifieer dat Clyde in de juiste taal antwoordt (prompt-builder default = nl) + cards gelokaliseerd zijn. **Bekend risico:** card-content is deels hardcoded NL (CaseStudyCard testimonial) — op /en/es is dat een mismatch. Documenteer.

---

## 7. SOTA-acceptatiecriteria (eerste-indruk lat)

Een nieuwe client mag in de eerste 60 seconden NIET tegenkomen:
1. ❌ Engelse tekst op /nl (of omgekeerd)
2. ❌ "Details" als sidebar-titel (moet betekenisvol zijn)
3. ❌ Lege/kapotte/placeholder card
4. ❌ Foute prijs
5. ❌ Respons zonder vervolg-chips
6. ❌ Irrelevante card (skincare-product bij agency-vraag)
7. ❌ Rauwe `CHIPS:`-regel in tekst
8. ❌ Sidebar die niet sluit / verkeerde card toont
9. ❌ Ontwijkend antwoord op kritische vragen (prijs, fit, bewijs)
10. ❌ Trage/janky animaties, layout-shift, overflow

SOTA = elke respons voelt als een scherpe, eerlijke, behulpzame medewerker die altijd een logische volgende stap aanbiedt.

---

## 8. Deliverable van de audit

1. **Bevindingen-rapport** (markdown): per bevinding severity (🔴/🟠/🟡), screenshot, reproductie, fix-advies. Groepeer per gebied (conversatie / sidebar / interactiviteit / i18n / cross-browser).
2. **Fixes** toegepast + her-getest (hybride loop, lokaal).
3. **`clyde-audit.spec.ts`** uitgebouwd tot volledige regressie-suite (skeleton meegeleverd, zie §9).
4. **Design-review sidebar** (optioneel): roep `/design` aan voor de sidebar-cards als de content/layout herontwerp nodig heeft (per global CLAUDE.md: design-verzoek → /design router).

---

## 9. Meegeleverd: Playwright skeleton

`tests/e2e/clyde-audit.spec.ts` is aangemaakt met:
- `openClyde(page)` helper (open chat, wacht op panel)
- `sendToClyde(page, text)` helper (typ + enter + wacht op respons)
- `getSidebar(page)` / `getSidebarTitle(page)` helpers
- Skeleton-tests voor T1-T6 + sidebar-titel + chips, met `test.skip` waar API-respons-asserties nog ingevuld moeten worden.

**Let op:** de bestaande `chatbot.spec.ts` test alleen chrome (open/close/a11y) en draait **zonder** API key. De nieuwe `clyde-audit.spec.ts` praat **echt** met Clyde en vereist de key uit stap 0.1. Markeer API-afhankelijke tests zodat ze in CI zonder key netjes skippen (guard op `process.env.ANTHROPIC_API_KEY`).

---

## 10. Volgorde voor de verse sessie

1. Setup (§0): key + port + server.
2. Fix BUG-1 (desktop titel) — quick win, daarna zichtbaar in alle sidebar-tests.
3. Draai T1-T10 handmatig via agent-browser/headed Playwright, beoordeel visueel (§3 + §4).
4. Beantwoord VRAAG-1 en VRAAG-2 met expliciete tests (§4.5, §4.6).
5. Multi-dimensie sweep (§6).
6. Schrijf bevindingen-rapport, pas fixes toe, hertest.
7. Bouw `clyde-audit.spec.ts` uit tot CI-regressie.
8. Commit per logisch cluster.

Branch-advies: `feature/clyde-sota-audit`.
