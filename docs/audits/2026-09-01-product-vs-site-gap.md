# Product vs. Site — de kloof

**Datum:** 2026-09-01
**STATUS: compleet.** Alle acht onderdelen zijn geschreven en onderbouwd.

## Meetbasis (belangrijk)

| | |
|---|---|
| PRODUCT (waarheid) | `c:/Users/daley/Desktop/fma-app` — **gemeten op `origin/master` = `9b5f91ed1`** (2026-09-01 13:52) |
| SITE (claim) | `c:/Users/daley/Desktop/Futuremarketingai/fmai-nextjs` — copy in `messages/nl.json` (222 KB), pagina's in `src/app/[locale]/` |

**Waarschuwing die deze audit bijna om zeep hielp:** de hoofdmap van fma-app stond bij aanvang op
`fix/before-after-photo-plate` (`7208da36f`) en liep **348 commits achter op `origin/master`**. De
strategiesessie-migraties bestaan in die boom niet. Alle metingen zijn daarom overgezet naar een
schone worktree van `origin/master`. Dit is dezelfde val als in de vorige design-audit
("gemeten op een branch die 317 achterliep").

---

## Kern in vijf regels

1. De site verkoopt **twaalf vaardigheden**; het product heeft er twaalf, en de prijzen en caps kloppen exact.
2. Wat de site NIET verkoopt: de **strategiesessie**, de **contentagenda over een jaar**, het **klantportaal** (0 vermeldingen), het **meeting-attendant**, het **agent-team** en de **herkomstregistratie per strategieveld**. Dat is tabel 7a.
3. Wat de site WEL claimt en het product niet waarmaakt: **LinkedIn-API, zes CMS-koppelingen, vier CRM's, GA4, een Slack-app, Tavily/Exa, Ahrefs/Semrush, Runway/Pika, Twilio/Telnyx** — en, het zwaarst, **een prijspagina zonder werkende betaalrails**. Dat is tabel 7b.
4. De site beschrijft de onboarding als **"4 weken handwerk door Daley, geen zelfbediening"**. Het product heeft een **11-staps bureau-wizard** en een **10-staps klantwizard** met een activatiepijplijn van 400 seconden.
5. De site heeft **nul productscreenshots** (`public/screenshots/skills/` is leeg; 22 afbeeldingen totaal, allemaal blog/portret/logo). Sectie 8 geeft 25 kandidaten op prioriteit.

---

## 1. SKILLS — canoniek uit `src/lib/skills.ts`

Bron: `src/lib/skills.ts` (535 regels, identiek op master en werkboom — alleen line-endings verschillen).
Geverifieerd met `node scripts/list-features.mjs` (12 skills).

| # | id | Naam (product) | Status in code | Route in app | n8n-workflows |
|---|---|---|---|---|---|
| 1 | `socialMedia` | Social Media Manager | `live` (`skills.ts:50`) | `/content-engine/content` | rnp-pipeline, blog-orchestrator, content-factory, posting-pipeline, carousel-builder, story-builder |
| 2 | `reporting` | Reporting & Analytics | `live` (`skills.ts:64`) | `/analytics/social` | daily-analytics, weekly-performance, anomaly-detection |
| 3 | `intelligence` | Research | `live` (`skills.ts:78`) | `/intelligence/overview` | intelligence-research, trend-monitor, alert-pipeline |
| 4 | `blogFactory` | Blog Factory | `live` (`skills.ts:92`) | `/blog-factory` | blog-factory-pipeline |
| 5 | `manychatDm` | Social Command Center | `live` (`skills.ts:106`) | `/manychat` | manychat-dm-pipeline |
| 6 | `emailManagement` | Email Management | `live` (`skills.ts:120`) | `/email` | email-classify-pipeline, email-digest |
| 7 | `leadQualifier` | Lead Qualifier | `live` (`skills.ts:134`) | `/lead-qualifier/chatbots` | chatbot-workflows, lead-management |
| 8 | `voiceAgent` | Voice Agent | **`coming_soon`** (`skills.ts:148`) | `/voice-agent/agents` | vapi-server, call-logging |
| 9 | `adCreator` | Ad Manager | **`active`** (`skills.ts:162`) — afwijkende waarde, geen `live` | `/ad-manager/campaigns` | ad-creative-pipeline, dpa-pipeline |
| 10 | `reelBuilder` | Reel Builder | **`coming_soon`** (`skills.ts:176`) | *(geen route)* | reel-builder-pipeline |
| 11 | `seoAnalyst` | SEO / GEO Analyst | `live` (`skills.ts:190`) | `/seo` | seo-crawl, rank-tracker, cwv-monitor, geo-tracker |
| 12 | `clyde` | Clyde AI Employee | `live` (`skills.ts:204`) | `/clyde` | *(geen)* |

**Opmerking bij status:** er zijn DRIE statuswaarden in gebruik (`live`, `active`, `coming_soon`).
`adCreator` is de enige `active` — dat is geen gedefinieerde derde categorie maar een inconsistentie
in de bron. De site moet niet klakkeloos "live" overnemen voor Ad Manager.

### Tier-gating

Bron: `src/lib/skills.ts:226-285` (`AGENT_TIERS`), `:333-...` (`SKILL_CAPS`), `:311-330` (helpers).

Alle vier de tiers hebben `includedSkills: SKILL_IDS` — **elke tier bevat alle 12 skills**
(`getOrgActiveSkills()` retourneert onvoorwaardelijk alle skill-ids, `skills.ts` einde bestand).
De gating zit dus NIET in welke skills je krijgt, maar in **caps per skill** en de **creditpool**.

| Tier | displayName | Model | Prijs | Workspaces | Credits | Onboarding-fee | Support |
|---|---|---|---|---|---|---|---|
| `GROWTH` | Growth — "AI Marketing Starter" | workspace | €499 p/workspace/mnd | 2–4 | 800 p/workspace | €1.997 | e-mail |
| `PROFESSIONAL` | Professional — "AI Marketing Pro" | workspace | €399 p/workspace/mnd | 5–14 | 800 p/workspace | €3.997 | Slack |
| `ENTERPRISE` | Enterprise — "AI Marketing Suite" | workspace | €299 p/workspace/mnd | 15–∞ | 800 p/workspace | €5.997 | dedicated CSM |
| `FOUNDING_MEMBER` | Founding Member — "Founders Club" | fixed | €997/mnd | onbeperkt | 8.000 vast | €0 | founder Slack |

Effectieve instapprijzen: Growth min. **€998/mnd** (2×499), Professional min. **€1.995/mnd** (5×399),
Enterprise min. **€4.485/mnd** (15×299).

### Skill-caps per tier (`SKILL_CAPS`)

Groep A (Clyde, Social, Reporting, Research, Lead Qualifier, SEO) is **fair use op alle tiers**,
alleen begrensd door de creditpool — die staan bewust niet in de cap-tabel (comment `skills.ts:326-332`).

| Cap-sleutel | GROWTH | PROFESSIONAL | ENTERPRISE | FOUNDING |
|---|---|---|---|---|
| `blogFactory` | 8 | 20 | onbeperkt | 12 |
| `emailManagement` | 20 | 60 | onbeperkt | 40 |
| `adCreatorStatic` | 15 | 50 | onbeperkt | 25 |
| `adCreatorVideo` | 4 | 20 | onbeperkt | 8 |
| `reelBuilder` | 4 | 15 | onbeperkt | 8 |
| `voiceAgentMinutes` | 30 | 120 | onbeperkt | 60 |
| `manychatDm` | 200 | 1000 | onbeperkt | 500 |

Bron: `skills.ts:333-370` (`-1` = onbeperkt/fair use). **Deze tabel staat 1-op-1 zo op de
prijspagina van de site** — dat deel klopt dus volledig.

### Creditkosten per actie (`CREDIT_COSTS`, `skills.ts:474-488`)

| Skill | Actie → credits |
|---|---|
| socialMedia | social_post 2 · caption 1 · schedule_post 1 · engage 1 |
| blogFactory | article 15 |
| voiceAgent | call_minute 5 |
| leadQualifier | score_lead 2 |
| adCreator | static_ad 10 · video_ad 20 |
| reelBuilder | reel 25 |
| seoAnalyst | audit 5 · report 3 · plan 3 |
| emailManagement | campaign 5 |
| manychatDm | dm_batch_10 2 |
| reporting | report 5 |
| intelligence | research_query 3 |
| **clyde** | chat_haiku 1 · chat_sonnet 2 · **chat_opus 5** |

### Creditpacks + skillpacks

`CREDIT_PACKS`: Mini Top-Up 500 · Boost Pack 2.000 · Scale Pack 5.000 · Unlimited Pack 15.000.
`SKILL_PACKS`: Partner Static Ads Pack · Partner ManyChat Pack · Voice Minutes Pack ·
Video Ads Pack · Reels Pack · Blog Power Pack (10 artikelen, €197).

---

## 2. STRATEGIELAAG

**LIVE-status: BEVESTIGD.** `STRATEGY_SESSION_ENABLED` staat als Production-env-var op het Vercel-project
`daleys-projects-5f2c57e7/fma-app` (aangemaakt 5 dagen geleden), naast `STRATEGY_SPINE_ENABLED`
(41 dagen), `STRATEGY_PREVIEW_SECRET` (42d), `STRATEGY_CANARY_SECRET` (43d) en
`PROVENANCE_TOKEN_SECRET` (43d). Bron: `vercel env ls production`.

De vlag zelf: `src/lib/strategy/strategy-session-flag.ts` — `process.env.STRATEGY_SESSION_ENABLED === '1'`.
Hij gate't drie ingangen: `startStrategySession`, het sessiepad in `src/app/api/clyde/chat/route.ts:301`,
en de toolregistratie. Met de vlag uit geeft de chatroute **404** op een `sessionId`.

### De vijf strategieblokken

Bron: `src/lib/strategy-session/blocks.ts:22`

```
BLOCK_KEYS = ['positioning', 'goals', 'pillars', 'themes', 'channels']
```

Statussen (`blocks.ts:31`): `draft` → `needs_review` → `confirmed`.
Herkomstklassen (`blocks.ts:39`): `user_transcript`, `research`, `model_prior` — elk veld draagt
provenance, en `STRATEGY_LOW_CONFIDENCE_THRESHOLD = 0.7` (`blocks.ts:64`) markeert zwakke velden.
Envelope-cap `MAX_ENVELOPE_CHARS = 10_000` (`blocks.ts:257`), som-cap `MAX_CONTEXT_ENVELOPE_SUM = 50_000`
(`blocks.ts:261`).

### De DONE-drempels (`src/lib/strategy-session/block-content.ts`)

- **goals**: max 3 objectives, max 5 key results per objective (`block-content.ts:116`).
  `target_value` mag `null` — "mens vult later" blokkeert DONE niet (`:92`).
- **pillars**: minimaal **3** pijlers vereist (`block-content.ts:365`); schema-max is 5
  (bindend milestone-getal "3–5 pijlers", `:128`).
- **themes**: elke pijler moet in ≥1 thema vallen dat de komende **3 maanden** overlapt
  (`block-content.ts:404`, `:412`).

**Gemeten defect (uit projectgeheugen, `clyde-strategiesessie-fase-7-gebouwd-2026-08-28`):**
het schema draagt een JAAR (12 vensters, 2000 tekens narratief, 60 key_dates, `recurs`), maar de
DONE-drempel vraagt maar drie maanden en de agenda-horizon is server-gepind op drie maanden
(`20260822000100:61`, `generate_series(0, 2)`). Van 17 themes-blokken op productie was er **geen enkele
echt** — allemaal fixtures. De prompt is aangescherpt naar een boog van 364 dagen, de POORT is bewust
niet verzet.

### Strategie-migraties op master (`supabase/migrations/`)

Strategiesessie:
`20260922002400_fma_strategy_session_channel.sql` ·
`20260922002500_fma_strategy_session_blocks.sql` ·
`20260922002700_fma_strategy_session_commit.sql` ·
`20260922003100_fma_complete_strategy_session_revise_admission.sql` ·
`20260922003200_fma_strategy_session_trigger_fn_revoke_execute.sql` ·
`20260926000000_fma_abandon_strategy_session.sql`

Strategy spine / doelen / agenda:
`20260819000100_fma_client_strategy.sql` ·
`20260819000200_fma_content_pillars_pillar_key.sql` ·
`20260819000300_fma_clients_strategy_spine_enabled.sql` (per-client allowlist, tweede gate) ·
`20260819000400_fma_system_ensure_client_strategy_lease.sql` ·
`20260819000500_fma_commit_client_strategy_projection.sql` ·
`20260821000000_fma_report_goals_strategy_refs.sql` ·
`20260821000100_fma_project_strategy_goal.sql` ·
`20260821000200_fma_strategy_goal_preview.sql` ·
`20260822000000_fma_strategy_agenda.sql` ·
`20260822000100_fma_strategy_planning_readmodel.sql` ·
`20260822000200_fma_activate_strategy_agenda.sql` ·
`20260822000300_fma_agent_tasks_strategy.sql` ·
`20260822000400_fma_reconcile_strategy_tasks.sql` ·
`20260823000100_fma_pillar_bandit_arms.sql` ·
`20260823000400_fma_apply_pillar_weights.sql`

Doelen los: `20260625000000_fma_report_goals.sql`, `20260731020000_report_goals_per_channel.sql`,
`20260823000000_fma_report_goals_current_value.sql`.

### Strategie-codeoppervlak (master)

`src/lib/strategy-session/` — 14 modules: `start-session`, `abandon-session`, `blocks`,
`block-content`, `channel`, `conversation-jargon`, `existing-pillars-choice`, `finish-prompt`,
`greeting`, `intent-from-blocks`, `salvage`, `save-section-tool`, `session-replies`,
`session-revision-adapter`.

`src/lib/strategy/` — 31 modules waaronder `agenda-scheduler`, `agenda-view`, `arc-view`,
`goal-actuals`, `task-derivation`, `fan-out`, `promote-strategy-proposals`, `adjustment-*` (6 stuks),
`canary-*`, `provenance-token`, `canonical-strategy-mirror`.

Server actions: `src/lib/actions/strategy-session.ts`, `strategy-agenda.ts`, `strategy-dashboard.ts`,
`strategy-tasks.ts`, `strategy-adjustment.ts`, `import-strategy.ts`, `goal-projection.ts`,
`report-goals.ts`.

Cronjobs: `src/app/api/cron/strategy-reconcile/`, `src/app/api/cron/strategy-review-sweep/`,
`src/app/api/cron/pillar-bandit-update/`.

Pagina's: `/clients/[id]/strategy`, `/clients/[id]/content-strategy`, `/goals`, `/clyde/goals`.

**Pillar-bandit:** `src/lib/bandits/thompson-sampling.ts` + `src/lib/bandits/pillar-weights.ts` —
de contentpijlers worden herwogen op basis van gemeten performance (Thompson sampling).
Dit staat nergens op de site.

---

### Gemeten op de PRODUCTIEDATABASE (2026-09-01, `nurdldgqxseunotmygzn`)

De strategielaag is niet alleen gebouwd — hij wordt gebruikt.

| Tabel | Rijen |
|---|---|
| `fma_strategy_session_blocks` | **227** (waarvan **105 `confirmed`**) |
| unieke strategiesessies | **28** |
| `fma_client_strategy` | **46** |
| `fma_strategy_agenda` | **1.558** |
| `fma_content_pillars` | **104** |
| `fma_report_goals` | **65** |

---

---

## 3. ONBOARDING — de exacte stappen

Er zijn **twee** wizards, en dat is zelf al iets wat de site niet vertelt.

### Wizard A — de bureau-wizard: 11 stappen

Enige bron van waarheid: `src/lib/onboarding/steps.ts:8-20` (het bestand zegt letterlijk
"Wizard STEPS SSOT — de ENE plek waar de stapvolgorde staat").
Route: `/clients/[id]/onboard` (`src/app/(protected)/clients/[id]/onboard/page.tsx`).
Componenten: `src/components/onboarding/steps/`.

| # | `key` | Label | Component | Wat er gebeurt |
|---|---|---|---|---|
| 1 | `basics` | Basics | `BasicInfoStep.tsx` | Bedrijfsgegevens + **taalkeuze** (en/nl/de/fr/es). Dit veld bepaalt later de contenttaal |
| 2 | `brand_scan` | Brand Scan | `BrandScanStep.tsx` | Firecrawl crawlt de website: kleuren, logo, typografie, propositie. Plus `ICPQuickScanCard` (**"kost ~$0.06, duurt 20-30s"**, `ICPQuickScanCard.tsx:247`), `IcpSynthesisReviewCard`, `SoulCompetitorsReviewCard` |
| 3 | `design` | Design | `DesignDirectionStep.tsx` | Genereert design-richtingen uit archetypen (`direction-archetypes.ts`) en toont ze als preview |
| 4 | `templates` | Templates | `TemplatePreviewStep.tsx` | Slide-/carrousel-templates per merk, live gerenderd |
| 5 | `strategy_session` | **Pillars** | `strategy-session/StrategySessionStep.tsx` | **De strategiesessie** — zie hieronder |
| 6 | `accounts` | Accounts | `AccountsScheduleStep.tsx` | Social-accounts + weekschema (`account_key`, `week_schema`) |
| 7 | `channel_roles` | Channel Roles | `ChannelRolesStep.tsx` | Per account een **rol** (default `pov_amplifier`) en status |
| 8 | `goals` | Goals | `GoalsStep.tsx` | Doelrijen per scope (workspace of `account_key`), periode 7d/30d/90d → `fma_report_goals` |
| 9 | `ctas` | CTAs | `CtaStep.tsx` | Call-to-actions per kanaal |
| 10 | `brand_voice` | Brand Voice | `BrandVoiceApprovalStep.tsx` | De gesynthetiseerde merkstem goedkeuren |
| 11 | `review` | Review | `ReviewActivateStep.tsx` | Nakijken + **activeren** |

`REVIEW_STEP` wordt afgeleid uit de array (`steps.ts:38`), niet apart gehardcodeerd, en
`stepNumber()` gooit fail-loud bij een onbekende sleutel (`steps.ts:27-31`).

### Stap 5 in detail — de strategiesessie

Componenten: `src/components/onboarding/strategy-session/` — `StrategySessionStep.tsx`,
`StrategySessionSpine.tsx`, `StrategyProposal.tsx`, `StrategyApproval.tsx`,
`StrategyProvenance.tsx`.

**Het gesprek is omgekeerd**: niet de klant stelt Clyde vragen, Clyde interviewt de klant.
Bij binnenkomst vuurt een verborgen bootstrap-bericht af en Clyde opent zelf. Tijdens het gesprek
vult hij vijf blokken (`src/lib/strategy-session/blocks.ts:22`):

| Blok | DONE-drempel | Bewijs |
|---|---|---|
| `positioning` | — | `block-content.ts` |
| `goals` | max 3 doelstellingen, max 5 key results per doel; `target_value` mag leeg blijven | `block-content.ts:92`, `:116` |
| `pillars` | **minimaal 3**, schema-max 5 | `block-content.ts:365`, `:128` |
| `themes` | elke pijler moet in ≥1 thema vallen dat de komende **3 maanden** overlapt | `block-content.ts:404`, `:412` |
| `channels` | — | `channel.ts` |

Elk veld draagt herkomst (`user_transcript` / `research` / `model_prior`) plus een
confidence-score; onder 0,7 wordt het gemarkeerd (`blocks.ts:39`, `:64`). Envelopes zijn begrensd
op 10.000 tekens per blok en 50.000 in totaal (`blocks.ts:257`, `:261`).

Een sessie kan worden **afgebroken en herstart** zonder het transcript te verliezen:
`src/lib/strategy-session/abandon-session.ts` + RPC `fma_abandon_strategy_session`
(migratie `20260926000000`), idempotent (tweede klik → `no_active_session`).

**Doorlooptijd:** niet als getal in de code vastgelegd. Gemeten in een live sessie op productie:
**zes beurten van ongeveer 50 seconden**, waarna vier van de vijf blokken stonden
(projectgeheugen `clyde-strategiesessie-fase-7-gebouwd-2026-08-28`). Dat is de enige harde
observatie; er staat nergens een belofte "duurt X minuten".

### Wizard B — de klant-uitnodigingswizard: 10 stappen

Bron: `src/components/onboarding/client-onboarding-wizard.tsx:22-31`. Dit is de wizard die een
**uitgenodigde klant** zelf doorloopt (via `/welcome/[token]`).

| # | Label | Component |
|---|---|---|
| 1 | Organisatie | `ConfirmOrgStep.tsx` |
| 2 | Bedrijfsinfo | `BusinessBrandingStep.tsx` (draait de brand scan) |
| 3 | Design | `DesignDirectionStep.tsx` (gedeeld met wizard A) |
| 4 | Templates | `TemplatePreviewStep.tsx` (gedeeld) |
| 5 | Pijlers | `PillarsConfirmStep.tsx` — **bevestigen**, niet zelf de sessie voeren |
| 6 | Accounts | `AccountsSimpleStep.tsx` / `ConnectAccountsStep.tsx` |
| 7 | CTA's | `CtasConfirmStep.tsx` |
| 8 | Clyde | `MeetClydeStep.tsx` |
| 9 | Kickoff | `BookKickoffStep.tsx` |
| 10 | Activeren | `CompletionStep.tsx` |

Voortgang wordt na elke stap weggeschreven met `saveOnboardingStep(clientId, currentStep, meta)`
(`client-onboarding-wizard.tsx:90`), dus de klant kan halverwege stoppen en later verder.

### Wat "Activeren" werkelijk doet

`src/lib/onboarding/activate.ts` (**1.866 regels**) — `activateClientPipeline()` (`:1212`) zaait
in één transactie-achtige keten:

`seedKnowledgeFromOnboarding` (`:143`) · `seedAgentState` (`:335`) · `seedVoiceProfile` (`:444`) ·
`seedVoiceOverrides` (`:519`) · `seedContentConfig` (`:659`, inclusief `deriveWeekCadence`) ·
`seedFormatPreferences` (`:755`) · `seedUnifiedProfile` (`:829`) · `seedFmaContentPillars` (`:964`) ·
`strategyInputsReady` (`:1116`).

Het tijdsbudget staat expliciet in de code: **`maxDuration = 400` seconden**, met een
prerequisite-deadline van 240 s en 160 s gereserveerd werk (`activate.ts:27-45`). Dat is het enige
harde doorlooptijd-getal in de hele onboarding: **activatie is klaar binnen ~6,5 minuut**.

### Poorten en vlaggen

| Mechanisme | Bewijs |
|---|---|
| **Onboarding-gate** — een organisatie zonder afgeronde onboarding wordt naar de wizard gestuurd; `onboarding_completed_at` (of `is_founder`) opent hem | `src/app/onboarding/page.tsx:119-124`, geschreven door `src/lib/actions/onboarding.ts:109` |
| **Strategiesessie-vlag** — drie ingangen gate'd; uit = 404 op een `sessionId` | `src/lib/strategy/strategy-session-flag.ts` · `src/app/api/clyde/chat/route.ts:301` · **`STRATEGY_SESSION_ENABLED` staat in Vercel Production** |
| **Strategy Spine** — tweede, per-klant-gate bovenop de env-vlag | `src/lib/strategy/strategy-spine-flag.ts` · kolom `fma_clients.strategy_spine_enabled` (migratie `20260819000300`) · **`STRATEGY_SPINE_ENABLED` staat in Production** |

### Wat de site hierover zegt

`how-it-works` beschrijft **vijf stappen die een verkooptraject zijn**, geen product:
1. Aanmelden + kennismakingscall (30 min) · 2. **"4 weken partnership-setup met Daley"** ·
3. Clyde inregelen per merk · 4. Productie met goedkeuring · 5. Continu verbeteren.
Expliciet: *"Geen zelfbediening. Daley begeleidt elke klant persoonlijk door het traject."*
(`how-it-works.hero.description`).

Het product heeft dus **een 11-staps bureau-wizard én een 10-staps zelfbedieningswizard voor de
klant**, met brand scan, ICP-synthese, design-richtingen, templates, een AI-gevoerde
strategiesessie en een activatiepijplijn van 400 seconden — en de site zegt dat het vier weken
handwerk is.

## 4. PLATFORMS / INTEGRATIES

### Bewijsmethode

Drie lagen, alle drie gemeten:

1. **Code** — `src/lib/…`, `src/app/api/…` op `origin/master`.
2. **Productie-env** — `vercel env ls production` op `daleys-projects-5f2c57e7/fma-app`:
   **158 variabelen in Production**, 254 over alle omgevingen.
3. **Productiedatabase** — rijtellingen via Supabase op `nurdldgqxseunotmygzn`.

Regel: **(A) LIVE** = code + env aanwezig + rijen in de DB. **(B) GEBOUWD, NIET AANGESLOTEN** =
code aanwezig, env of DB-rijen ontbreken. **(C) GEPLAND** = alleen stubs/plannen.

### A — echt live in productie

| Platform | Waarvoor | Bewijs |
|---|---|---|
| **Supabase** | Hele datalaag, RLS, auth | `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` in Production · 123 `fma_clients`, 13 `fma_organizations` |
| **n8n** (self-hosted) | Content-, research-, posting-, render-pipelines | 13 `N8N_*` vars in Production (`N8N_API_URL`, `N8N_API_KEY`, `N8N_WF4/WF7/RP/POSTING/RENDER/RESEARCH/PREWRITE_SERP/GEO_AI_OVERVIEW/ICP_VOC/REGENERATE_WEBHOOK_URL`, `N8N_WEBHOOK_SECRET`) |
| **Anthropic (Claude)** | Clyde + alle tekstgeneratie | `ANTHROPIC_API_KEY`, `ANTHROPIC_ADMIN_KEY`, `ANTHROPIC_TEXT_GEN_MODEL` · 950 `fma_clyde_messages` |
| **OpenAI** | Tekst + beeld | `OPENAI_API_KEY`, `OPENAI_IMAGE_API_KEY`, `OPENAI_IMAGE_QUALITY` |
| **Google Gemini** | Modelroute | `GEMINI_API_KEY` |
| **Vercel AI Gateway** | Modelrouting | `VERCEL_AI_GATEWAY_KEY` |
| **Voyage AI** | Embeddings (RAG/geheugen) | `VOYAGE_API_KEY` |
| **Perplexity** | Research-skill | `PERPLEXITY_API_KEY` |
| **Firecrawl** | Brand-scan, site-crawl, onboarding | `FIRECRAWL_API_KEY` · `src/lib/onboarding/firecrawl.ts` |
| **WhatsApp Business Cloud API (Meta)** | Clyde via WhatsApp | `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_APP_SECRET`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_WEBHOOK_VERIFY_TOKEN`, `CLYDE_WHATSAPP_BOT_PHONE` · `src/app/api/channels/whatsapp/webhook/route.ts` · **2 actieve `fma_channel_links`** — zie §5 voor de blokkade |
| **Telegram** | Clyde via Telegram (tweede kanaal) | `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `TELEGRAM_WEBHOOK_SECRET` · `src/app/api/channels/telegram/webhook/route.ts` · **3 links** |
| **Instagram / Meta Graph** | Contentpublicatie + engagement-metrics | `INSTAGRAM_APP_ID/SECRET`, `META_INSTAGRAM_ACTOR_ID`, `META_INSTAGRAM_SHOP_ACTOR_ID`, `META_PAGE_ID`, `META_BUSINESS_ID` · **420 rijen `instagram_posts`** |
| **Meta Ads** | Ad Manager / campagnes | `META_ADS_ACCESS_TOKEN`, `META_AD_ACCOUNT_ID`, `META_ADS_ACCOUNT_ID`, `META_SHOP_URL` |
| **ManyChat** | DM-automatisering / Social Command Center | `fma_manychat_tokens` = **5 rijen**, `fma_manychat_events` = **876**. LET OP: `MANYCHAT_WEBHOOK_SECRET` staat NIET in Production — zie B |
| **Gmail (Google OAuth)** | Inbox-triage e-mailskill | `GOOGLE_OAUTH_CLIENT_ID/SECRET`, `EMAIL_OAUTH_STATE_SECRET`, `EMAIL_TOKEN_ENC_KEY` · **10.829 `fma_email_logs`**, 18 `fma_email_drafts` |
| **Microsoft Graph (Outlook)** | Tweede e-mailprovider | `MS_GRAPH_CLIENT_ID`, `MS_GRAPH_CLIENT_SECRET` |
| **Resend** | Transactionele mail | `RESEND_API_KEY` |
| **Google Search Console** | Rankings, GEO/SEO | `GSC_OAUTH_CLIENT_ID/SECRET/REFRESH_TOKEN` · **790 `fma_gsc_metrics`** |
| **Google PageSpeed Insights** | Core Web Vitals | `GOOGLE_PSI_API_KEY` |
| **Postiz** (self-hosted) | Multi-kanaal publiceren | `src/lib/postiz/api-client.ts`, base-URL-allowlist `https://postiz.future-marketing.ai/api/public/v1` (`handover-validation.ts:25`). **API-sleutel per klant in de DB, niet in env** — `fma_postiz_connections` = **5 rijen** |
| **Recall.ai** | Meeting-bot/transcripties | `RECALL_API_KEY`, `RECALL_BASE_URL`, `RECALL_WEBHOOK_SECRET` · 4 `fma_client_meetings` |
| **Apify** | Instagram/benchmark-scraping | `APIFY_TOKEN`, `APIFY_TOKEN_BACKUP` |
| **AWS S3 / Remotion Lambda** | Videorendering | `AWS_*`, `REMOTION_AWS_*`, `REMOTION_FUNCTION_NAME`, `REMOTION_SERVE_URL`, `REMOTION_WEBHOOK_SECRET` |
| **Upstash QStash + Redis/KV** | Job-queue, rate limits | `QSTASH_URL/TOKEN/SIGNING_KEYS`, `KV_REST_API_*`, `REDIS_URL` |
| **ElevenLabs** | Stemsynthese | `ELEVENLABS_API_KEY` |
| **Kling / Higgsfield / HeyGen / Minimax / fal.ai / useapi** | Video- en beeldgeneratie | `KLING_ACCESS_KEY/SECRET_KEY`, `HIGGSFIELD_MCP_TOKEN/URL`, `HEYGEN_API_KEY`, `MINIMAX_API_KEY/BASE_URL`, `FAL_API_KEY`, `USEAPI_API_KEY/EMAIL` |
| **Blotato** | Social publishing (tweede route) | `BLOTATO_API_KEY` |
| **Smartlead** | Outbound e-mailcampagnes | `SMARTLEAD_API_KEY`, `SMARTLEAD_WEBHOOK_SECRET` · 26 `fma_leads` |
| **Adzuna / Jooble** | Vacature-/marktdata (outbound) | `ADZUNA_APP_ID/KEY`, `JOOBLE_API_KEY` |
| **Orshot / Stitch** | Beeld-templating | `ORSHOT_API_KEY`, `STITCH_API_KEY`, `STITCH_WORKER_URL/SECRET` |
| **ChangeDetection.io** | Concurrentmonitoring | `CHANGEDETECTION_API_KEY`, `CHANGEDETECTION_BASE_URL` |
| **LanguageTool** | Taalcontrole | `LANGUAGETOOL_URL` |
| **Obsidian vault-API** | Kennisbank van Clyde | `VAULT_API_URL`, `VAULT_API_TOKEN`, `VAULT_PATH` |
| **GitHub** | Klant-site-deploys (SKC) | `GITHUB_TOKEN_SKC` |
| **Vercel** | Hosting van de app zelf | project `daleys-projects-5f2c57e7/fma-app` |

### B — gebouwd, NIET aangesloten (code klaar, configuratie ontbreekt)

| Platform | Wat er staat | Waarom niet live |
|---|---|---|
| **Stripe** (!) | Volledige billing-laag: `src/app/api/webhooks/stripe/route.ts`, vier tiers + 4 credit-packs + 6 skill-packs met `process.env.STRIPE_PRICE_*` (`skills.ts:230-460`) | **NUL `STRIPE_*` variabelen in ALLE 254 Vercel-env-entries** (`vercel env ls` + grep op stripe = 0 treffers). En in de DB: **0 van 13 organisaties heeft een `stripe_customer_id` of `stripe_subscription_id`**. De hele betaalflow heeft nog nooit gedraaid |
| **ManyChat inbound** | `src/app/api/webhooks/manychat/route.ts:18` en `.../manychat/clyde/route.ts:37` eisen `x-webhook-secret === process.env.MANYCHAT_WEBHOOK_SECRET` | `MANYCHAT_WEBHOOK_SECRET` staat **niet** in Production → elke inkomende webhook krijgt 401. De 876 `fma_manychat_events` komen via het n8n-pad, niet via deze route |
| **Instagram-connect (eigen OAuth-flow)** | Callback + verwijderpagina + privacy sectie 10 gebouwd | `FACEBOOK_APP_ID`, `FACEBOOK_APP_SECRET` en `FB_LOGIN_CONFIG_ID` staan **in geen enkele Vercel-omgeving**. Vastgelegd in projectgeheugen `meta-app-review-linkedin-access-2026-08-31` |
| **LinkedIn** | LinkedIn bestaat als contentoppervlak (slide-layouts) en platform-enum, niet als koppeling | **Nul `LINKEDIN_*` variabelen, geen API-client.** Metrics worden **handmatig** ingevoerd — `src/lib/actions/channel-metrics.ts:9` noemt dit het *"LinkedIn/X graceful-degrade path"*. Publiceren kan alleen via Postiz; Meta Business Verification + KvK-inschrijving blokkeren de rest |
| **Voice Agent (Vapi/Retell)** | 14 `voice_*` tabellen, complete UI onder `/voice-agent/**` en `/voice-agents/**` | `skills.ts:148` zegt `coming_soon`; **`voice_calls` = 0 rijen**; geen `VAPI_*` env. Alleen `ELEVENLABS_API_KEY` bestaat (stem, geen telefonie) |
| **Reel Builder** | n8n-workflow `reel-builder-pipeline` gedefinieerd | `skills.ts:176` = `coming_soon`, **geen route in de app** |
| **Analytics-sync** | `fma_analytics_sync_runs` bestaat | **0 rijen** — de sync heeft nog nooit gedraaid |
| **GA4** | — | Geen `GA4_*`/`GOOGLE_ANALYTICS_*` env, geen aparte GA4-client. Google-data komt uit **GSC + PSI**, niet uit GA4 |
| **Shopify / e-commerce** | `getRevenueStats` vereist capability `shopify` (`src/lib/clyde/tools.ts:105`) | Geen `SHOPIFY_*` env. De capability bestaat, de koppeling niet |

### C — niet aanwezig (dekkingsrapport)

Gezocht op naam in code én env, geen treffer: **TikTok, Pinterest, YouTube, Threads, X/Twitter
(als eigen API), Slack (als integratie), Discord, Sentry, PostHog, Cloudflare, WooCommerce,
Twilio, LiveKit, Retell, DataForSEO, Bright Data**. Waar die kanalen tóch bediend worden, loopt
dat via **Postiz** (publiceren) of **n8n** — niet via een eigen client in deze codebase.

---

## 5. CLYDE IN WHATSAPP

**Status: LIVE, maar geblokkeerd op Meta's sandboxnummer.**

### Wat er staat

| Bestand | Rol |
|---|---|
| `src/app/api/channels/whatsapp/webhook/route.ts` | GET = Meta-verificatiechallenge; POST = inkomende berichten. Flow: `X-Hub-Signature-256` verifiëren op de raw body → parse → dedup → 200 → `after()`: link-handshake / rate-limit → identiteit → conversatie → `/api/clyde/external-message` → formatteren → splitsen → sturen |
| `src/app/api/channels/_lib/whatsapp-api.ts` | Graph-client (v22.0), typed send-helpers, detectie van geblokkeerde/onbezorgbare nummers, **template-pad voor proactieve berichten buiten het 24-uursvenster** |
| `src/app/api/channels/_lib/whatsapp-format.ts` | Opmaak + berichtsplitsing |
| `src/lib/clyde/whatsapp-templates.ts` | Templatebeheer (`CLYDE_OCHTENDBRIEFING_TEMPLATE`, `..._LANG` staan in Production) |
| `src/lib/clyde/whatsapp-notification-controls.ts` | De klant kan meldingen aan/uit zetten **vanuit de chat zelf** |
| `src/app/api/clyde/link-whatsapp/route.ts` + `src/components/client/client-whatsapp-link-card.tsx` | Koppeltoken-flow in het klantportaal |
| `src/components/settings/whatsapp-channel-settings.tsx` | Beheer onder `/settings/integrations` |

Het is expliciet **hetzelfde Clyde-pad als Telegram, alleen een ander transport** (comment in de
routekop). Reactieve antwoorden vallen altijd in het 24-uursvenster; proactieve meldingen gaan via
goedgekeurde templates.

### De blokkade (gemeten 2026-08-18, live op productie)

Clyde's WhatsApp hangt aan **Meta's sandboxnummer** `+1 555-668-1721`, `verified_name: "Test Number"`.

| | |
|---|---|
| Uitgaand | **max 5 handmatig geverifieerde ontvangers** |
| Naam in de chat | blijft "Test Number", niet te wijzigen |
| `code_verification_status` | `NOT_VERIFIED` |
| Inkomend | werkt van iedereen — **alleen uitgaand is beperkt** |

Daardoor ziet een geslaagde koppeling er in de DB identiek uit aan een werkende: pas Clyde's
ántwoord stuit op Graph-fout `131030 "Recipient phone number not in allowed list"`.
Geen codefout — het blokkeert op **Step 2 (Production setup) + Step 3 (Business verification)** in
Meta's App Dashboard, en dat hangt weer aan de **KvK-inschrijving van FMai**.
`account_mode` zegt misleidend "LIVE" en `TIER_250`; dat heft de sandboxlimiet niet op.

**Latent risico (BSUID):** zodra een klant een WhatsApp-username aanzet komt zijn telefoonnummer
niet meer mee in de webhook. Ons pad hangt volledig aan het nummer
(`whatsapp-types.ts:134` → `channel-identity.ts:107`), dus Clyde **zwijgt dan zonder foutmelding**.

**Gevolg voor de site:** "Clyde in WhatsApp" mag genoemd worden als **capability**, maar niet als
"vandaag beschikbaar voor jouw klanten" tot het bedrijfsnummer geverifieerd is.

---

## 6. WAT CLYDE KAN ZIEN EN DOEN

### Omvang van de app

**191 routes met een `page.tsx`** onder `src/app/` op `origin/master`, verdeeld over:
`(auth)` 3 · `(dev)` 3 · `(protected)` ~170 · publieke routes (`/onboarding`, `/welcome/[token]`,
`/review/[clientId]`, `/preview/**`, `/chat/[widgetId]`, `/showcase`, `/demo/pretend-payment`) ~15.

### Clyde's vijf modi (`src/lib/clyde/modes.ts:41`)

`strategy` (Strategie) · `content` (Content) · `analytics` · `operations` · `creative`.
Elke modus wisselt systeemprompt, modeltier, geheugennamespace, vault-map en creditlabel.
Strategie draait bewust op **opus** met `tier_override: true` en de kernblokken
`client_profile, brand_voice, strategy, client_summary`.

### Clyde's gereedschap (`src/lib/clyde/tool-card-registry.ts`)

Zichtbare tools met een eigen resultaatkaart: `getEngagementMetrics`, `getRevenueStats`,
`comparePeriods`, `getTopPerformers`, `getTrend`, `getContentCalendar`, `getBlogArticles`,
`getAdCampaigns`, `getAnomalies`, `getDailyBrief`, `createTask`, **`delegateToAgent`**,
`getAgentTasks`, `getResearch`, `getResearchTrends`, `research`, `updateCoreMemory`,
`searchMemory`, `getMeetingHistory`, `searchMeetingTranscripts`.

Elke tool hangt aan een **capability** (`src/lib/clyde/tools.ts:102-127`): `instagram`, `shopify`,
`meta_ads`, `seo`, `email`, `content`, `manychat`, `inbox`. Zonder capability geen tool —
fail-closed, ook op stapniveau in de executor.

Twee scopes zijn extra afgeschermd: **e-mail en meetings** vereisen expliciete per-klant-consent
voordat bureau-Clyde ze mag lezen (`tools.ts:133-148`).

### Wat een KLANT ziet in het portaal (`src/lib/nav-config.ts:140-151`)

| Menu-item | Route | Vereiste skill |
|---|---|---|
| Content Review | `/client/content` | socialMedia |
| Social Inbox | `/client/inbox` | manychatDm |
| Aanvragen | `/client/requests` | — |
| Kalender | `/client/calendar` | socialMedia |
| Reports | `/client/reports` | reporting |
| Mediabibliotheek | `/client/media` | socialMedia |
| Website | `/client/website` | seoAnalyst |
| Blogs | `/client/blog` | blogFactory |
| Instellingen | `/client/settings` | — |

Negen schermen, **skill-gated per item** — een klant zonder blogFactory ziet "Blogs" niet.

### Wat er live in de database staat (2026-09-01)

| | |
|---|---|
| Organisaties / klanten | 13 / **123** |
| Ingeplande content | **3.316** `content_schedule` |
| Blogartikelen | **112** |
| Instagram-posts | **420** |
| E-maillogs | **10.829** |
| Clyde-berichten | **950** |
| Agent-taken | **206** |
| Contentpijlers | **104** · doelen **65** · agenda-rijen **1.558** |
| Meetings | 4 · leads 26 · voice-calls **0** |

---

## 7. DE DIFF

### Meetbasis voor de site

- Copy: `messages/nl.json` (222 KB, **42 top-level keys**, waarvan 12 skill-pagina's + `skills-template`).
- Beeld: **22 afbeeldingen in `public/`** — 14 blogillustraties, 3 portretten, 2 SKC-merkbestanden,
  `logo.png`, `og-image.png`, 4 Next.js-standaard-SVG's.
  **`public/screenshots/` bevat één lege map `skills/`. Nul productscreenshots.**
- Platformnamen in `nl.json` (aantal keer genoemd): instagram 53 · manychat 27 · slack 24 ·
  linkedin 23 · gmail 12 · perplexity 11 · whatsapp 10 · facebook 9 · tiktok 8 · shopify 8 ·
  telegram 7 · vapi 5 · youtube 4 · n8n 4 · meta ads 3 · google analytics 3 · stripe 2 ·
  twilio 1 · search console 1 · resend 1 · outlook 1. **Postiz: 0. Recall: 0. Remotion: 0.
  Firecrawl: 0. Apify: 0.**

### Wat WEL goed staat (zodat de kloof scherp blijft)

Prijzen kloppen exact met `skills.ts`: €499/€399/€299 per werkruimte, €997 founding,
800 credits per werkruimte, 8.000 voor founding. **Alle caps kloppen ook** — inclusief de
founding-rij (Blog 12, statisch 25, video 8, reel 8, voice 60, ManyChat 500) tegen
`skills.ts:361-369`. Het aantal skills (12) en het aantal `coming soon` (2: Voice Agent,
Reel Builder) klopt met `skills.ts`. De creditpacks kloppen (500/2.000/5.000/15.000).

---

### 7a) IN PRODUCT, NIET OP DE SITE — verkoopmateriaal dat op de plank ligt

Dit is de belangrijkste tabel. Elke rij bestaat in het product, met bewijs, en wordt op de site
niet genoemd of niet uitgelegd.

| # | Capability in het product | Bewijs (bestand / tabel / rijen) | Wat de site nu zegt |
|---|---|---|---|
| 1 | **De strategiesessie: Clyde interviewt de klant en legt vijf strategieblokken vast** (positioning, goals, pillars, themes, channels) met status draft→needs_review→confirmed | `src/lib/strategy-session/` (14 modules) · `blocks.ts:22` · vlag `STRATEGY_SESSION_ENABLED` in Vercel Production · **28 sessies, 227 blokken, 105 confirmed** | Het woord "strategiesessie" komt 3× voor — **alle drie als gratis salesgesprek** ("Vraag een gratis strategiesessie aan"). De productfunctie wordt nergens genoemd |
| 2 | **Herkomst (provenance) per strategieveld**: elk veld draagt `user_transcript` / `research` / `model_prior` + confidence, drempel 0,7. Auditeerbaar waarom Clyde iets vindt | `blocks.ts:39`, `:64` · `PROVENANCE_TOKEN_SECRET` in Production · `src/lib/strategy/provenance-token.ts` | Niets. Dit is een uniek verdedigbaarheids-/AVG-argument dat nergens staat |
| 3 | **Contentagenda: 12 maandvensters, jaarboog van 364 dagen, per pijler ingeroosterd** | `fma_strategy_agenda` = **1.558 rijen** · `src/lib/strategy/agenda-scheduler.ts`, `arc-view.ts` · migratie `20260822000000_fma_strategy_agenda.sql` | "contentkalender" 4×, "agenda" 11×, "kwartaal" 1×. Geen jaarplanning, geen uitleg |
| 4 | **Doelen met projectie én gemeten actuals per kanaal** | `fma_report_goals` = **65 rijen** · `src/lib/actions/goal-projection.ts`, `src/lib/strategy/goal-actuals.ts` · routes `/goals`, `/clyde/goals` | "doelen" 3×, alleen als "KPI-doelen vastleggen" in stap 2. Geen scherm, geen mechanisme |
| 5 | **Contentpijlers die zichzelf herwegen op prestatie** (Thompson sampling / multi-armed bandit) | `src/lib/bandits/thompson-sampling.ts`, `pillar-weights.ts` · cron `/api/cron/pillar-bandit-update` · migraties `..._fma_pillar_bandit_arms.sql`, `..._fma_apply_pillar_weights.sql` · **104 pijlers** | "pijler" 5× / "pillar" 6× als statisch begrip. Het lerende mechanisme staat nergens |
| 6 | **Het klantportaal: negen eigen schermen voor de eindklant**, skill-gated per item | `src/lib/nav-config.ts:140-151` · routes `/client/content`, `/inbox`, `/requests`, `/calendar`, `/reports`, `/media`, `/website`, `/blog`, `/settings` | **"portaal" en "klantportaal" komen 0× voor in `nl.json`.** De hele tweede gebruiker van het product is onzichtbaar |
| 7 | **Publieke review-links zonder account**: klant beoordeelt content via een token-URL | routes `/review/[clientId]`, `/welcome/[token]`, `/preview/[templateId]`, `/chat/[widgetId]` · `PREVIEW_JWT_SECRET`, `STRATEGY_PREVIEW_SECRET` in Production | Niets |
| 8 | **Merk-kernel: brand-scan → kleuren/logo/typografie → design-richtingen → showcase per merk** | `src/lib/onboarding/` — 60+ modules (`brand-kernel.ts`, `logo-color.ts`, `design-directions.ts`, `direction-archetypes.ts`, `reference-compose.ts`, `showcase-compose.ts`) · `FIRECRAWL_API_KEY` in Production | "merk-DNA" 2×, "brand-scan" 1× als deliverable in stap 2. Het hele visuele systeem wordt niet getoond |
| 9 | **ICP-synthese met versiegeschiedenis** | routes `/clients/[id]/icp` en `/icp/versions` · `src/lib/onboarding/icp-full-synthesis.ts` · `N8N_ICP_VOC_WEBHOOK_URL` in Production | Niets over versies of ICP-opbouw |
| 10 | **Meeting-attendant: bot woont de klantmeeting bij, transcribeert, vat samen, haalt acties eruit** | `RECALL_API_KEY`, `RECALL_BASE_URL`, `RECALL_WEBHOOK_SECRET` in Production · tabellen `fma_client_meetings/_segments/_summaries/_actions` · routes `/clyde/meetings`, `/meetings` | "meeting" komt **1×** voor, en niet als functie |
| 11 | **Agent-team: Clyde delegeert werk aan sub-agents en volgt de taken** | tool `delegateToAgent` (`src/lib/clyde/tool-card-registry.ts:29`) · routes `/agent-team`, `/agent-activity`, `/agents/[agentId]`, `/admin/agent-standups` · **206 `fma_agent_tasks`** | "agent team" 0×, "delegeer" 0× |
| 12 | **Consent-poort per klant voor gevoelige scopes (e-mail, meetings)** — bureau-Clyde mag pas lezen na expliciete toestemming, fail-closed | `src/lib/clyde/tools.ts:133-148` · route `/clients/[id]/settings/consent` | "consent" 5×, alleen in de cookiebanner-context. Als AVG-argument onbenut |
| 13 | **Capability-gating per tool, fail-closed tot in de executor-stap** — `instagram`, `shopify`, `meta_ads`, `seo`, `email`, `content`, `manychat`, `inbox` | `src/lib/clyde/tools.ts:102-127` | Niets |
| 14 | **Vijf Clyde-modi met eigen model, geheugen en vault-map** (Strategie draait bewust op Opus) | `src/lib/clyde/modes.ts:41` | Niets. De site beschrijft Clyde als één modus |
| 15 | **Kostentransparantie: API-kosten- en budgetdashboards per bureau** | routes `/admin/api-costs`, `/admin/budget`, `/admin/costs`, `/agency/cost-dashboard`, `/admin/models` · `BLOG_RESEARCH_MONTHLY_CAP_USD`, `SINGLE_IMAGE_MONTHLY_CAP_USD` in Production | Credits worden 49× genoemd, maar het kosteninzicht in de app niet |
| 16 | **In-app helpdesk: tickets, kennisbank, ideeënbord** (14 routes onder `/help`) | `/help/tickets`, `/help/kb/[slug]/[article]`, `/help/ideas`, plus admin-varianten | "ticket" 3×, "kennisbank" 13× (= de blog op de site, niet de in-app KB) |
| 17 | **Outbound-motor: leadlijsten, verrijking, e-mailcampagnes, reviews** | `SMARTLEAD_API_KEY` + `_WEBHOOK_SECRET`, `ADZUNA_APP_ID/KEY`, `JOOBLE_API_KEY` in Production · routes `/outbound-leads`, `/outbound-reviews` · 26 `fma_leads` | Niets |
| 18 | **Contentproductie op schaal, met bewijs**: 3.316 ingeplande items, 112 blogs, 420 IG-posts, 10.829 e-maillogs, 950 Clyde-berichten | Productiedatabase 2026-09-01 | De site heeft **één** case study (SKC) en geen enkel getal uit het echte systeem |
| 19 | **Contentreview per slide + narrative preview** vóór publicatie | routes `/clients/[id]/content-review`, `/narrative-preview/[contentScheduleId]`, `/content-engine/review` | "content review" 0× |
| 20 | **Rollen en multi-tenant isolatie**: `platform_admin`, `agency_owner`, `agency_member`, `client_user`, workspace-switcher | `src/app/(protected)/settings/integrations/page.tsx:44-48` · `src/components/layout/workspace-switcher.tsx` | "workspace" 20× als prijsdrager, niet als beveiligingsmodel |

---

### 7b) OP DE SITE, NIET (VOLLEDIG) IN PRODUCT — risico

| # | Claim op de site | Waar | Wat er werkelijk is | Ernst |
|---|---|---|---|---|
| 1 | Vier prijstiers, creditpacks en skillpacks met exacte bedragen | `pricing.*` (hele pagina) | **Nul `STRIPE_*` variabelen in alle 254 Vercel-env-entries; 0 van 13 organisaties heeft een `stripe_customer_id` of `stripe_subscription_id`.** De billing-code bestaat (`src/app/api/webhooks/stripe/route.ts`, `skills.ts:230-460`) maar heeft nog nooit gedraaid | **Hoog** |
| 2 | "Native publicatie naar Instagram, Facebook en LinkedIn via de Meta- **en LinkedIn-API's**" | `skills-social-media.faq.items.q2.answer` | **Er is geen LinkedIn-API-client en geen `LINKEDIN_*` env** (`grep -rn "process.env.LINKEDIN" src/` = leeg). LinkedIn bestaat in de code alleen als *contentoppervlak* (slide-layouts, `account-identity.ts:87-126`) en als waarde in een platform-enum (`src/lib/connections/store.ts:17`). Metrics komen er **met de hand** in: `src/lib/actions/channel-metrics.ts:9` noemt het letterlijk het *"LinkedIn/X graceful-degrade path — manual metric entry"*. Publiceren kan alleen via Postiz | **Hoog** |
| 3 | "Native publicatie naar WordPress (REST-API), Webflow, Shopify-blog, Ghost, Sanity en Notion" | `skills-blog-factory.faq.items.q2.answer` | Het publicatiepad is **één route: een GitHub-commit naar de repo van de klantsite** (`src/lib/blog/publish-core.ts:114-596`, `resolveGitHubToken`, `GITHUB_TOKEN_SKC`). Geen enkele CMS-integratie | **Hoog** |
| 4 | "Native koppelingen met HubSpot, Pipedrive, Salesforce en Notion" | `skills-lead-qualifier.faq.items.q2.answer`, `skills-lead-qualifier.features.feature3.body`, `chatbots.faq.items.q4.answer`, `skills-manychat.features.feature3.body` | HubSpot komt alleen voor in demo-mockdata en één veld op de (coming soon) voice-agent. **Pipedrive: 0 treffers. Salesforce: 1 (mockdata). Notion: 0 als integratie** | **Hoog** |
| 5 | "Native koppelingen met Meta Ads, **Google Analytics 4**, Shopify, HubSpot, Pipedrive en Stripe. Data wordt **elk uur ververst**" | `skills-reporting.faq.items.q2.answer` (+ `skills-reporting.how.step1.body`) | Geen GA4-env of -client; Google-data komt uit GSC (790 rijen) + PageSpeed. **`fma_analytics_sync_runs` = 0 rijen** — de uursync heeft nooit gedraaid | **Hoog** |
| 6 | "**Slack-app voor agencyteams**" als Clyde-kanaal, plus "e-mail (geforwarde berichten)" | `skills-clyde.faq.items.q2.answer` | `src/app/api/channels/` bevat **precies twee kanalen: telegram en whatsapp**. Slack bestaat als één `slack_webhook_url`-veld in instellingen (`src/lib/actions/settings.ts:173`) — geen app, geen tweerichtingsverkeer | **Hoog** |
| 7 | "Al live: SkinClarity Club draait dezelfde AI-medewerker over website, Shopify **en WhatsApp**" | `chatbots.multi_platform.case_study` | WhatsApp draait op Meta's **sandboxnummer**: max 5 handmatig toegevoegde ontvangers, `verified_name: "Test Number"`, `code_verification_status: NOT_VERIFIED`. Uitgaand naar een willekeurige klant faalt met Graph-fout `131030` | **Hoog** |
| 8 | "Web via Perplexity-, **Tavily- en Exa-API's**" | `skills-research.faq.items.q2.answer` | Alleen `PERPLEXITY_API_KEY` en `FIRECRAWL_API_KEY` bestaan. Tavily: 1 losse tekstvermelding. Exa: geen client | Middel |
| 9 | "Dag 1 koppelt Search Console, **Ahrefs of Semrush** en Google Analytics" | `skills-seo-geo.faq.items.q4.answer` | Ahrefs: 0 treffers. Semrush: 0 treffers. GA: geen client. Alleen GSC + PSI | Middel |
| 10 | "Onder de motorkap: **Runway en Pika** voor scene-creatie … **FFMPEG** voor compositie" (Reel Builder) | `skills-reel-builder.faq.items.q2.answer` | Runway: 0. Pika: 0. Het product gebruikt Kling, Higgsfield, HeyGen, Minimax, fal.ai en **Remotion Lambda**. (Reel Builder is bovendien `coming_soon`, dus dit is een toekomstclaim met de verkeerde stack) | Middel |
| 11 | "ElevenLabs (stem) en **Twilio of Telnyx** (telefonienummer)" | `skills-voice-agent.faq.items.q2.answer` | Twilio: 0 treffers. Telnyx: 0. Alleen `ELEVENLABS_API_KEY`. `voice_calls` = **0 rijen** | Middel |
| 12 | De site spreekt zichzelf tegen over WhatsApp: "WhatsApp Business via een gekoppeld nummer" vs. "Facebook Messenger en WhatsApp Business staan op de **roadmap voor Q3**" | `skills-clyde.faq.items.q2.answer` vs. `skills-manychat.faq.items.q2.answer` | Beide kunnen niet waar zijn | Middel |
| 13 | "Onboarding in 5 stappen … **4 weken partnership-setup met Daley** … Geen zelfbediening" | `how-it-works.process.steps.*` | Het product heeft een **in-app onboarding-wizard** met brand-scan, ICP-synthese, pijlers, design-richtingen, showcase en de strategiesessie. De site beschrijft handwerk waar een product staat | Middel — dit is óók een gemiste kans (zie 7a) |
| 14 | Vaardigheid heet "**ManyChat DM**" en gaat alleen over Instagram-DM's | `skills-manychat.hero.*` | In het product heet de skill **"Social Command Center"** met "unified social inbox, DM automation, channel health, lead capture" (`skills.ts:96-97`). De site gebruikt de oude, smallere naam | Laag — maar het is gratis upside |
| 15 | Onboarding-fees: alleen €1.997 en €5.997 genoemd | `pricing.*` | `skills.ts` kent drie: €1.997 (Growth), **€3.997 (Professional)**, €5.997 (Enterprise) | Laag |
| 16 | "ManyChat"-koppeling als levende integratie (27×) | `skills-manychat.*` | De ManyChat-**webhookroute** eist `MANYCHAT_WEBHOOK_SECRET`, en die staat **niet in Production** (`route.ts:18` → 401 op alles). De 876 `fma_manychat_events` komen via n8n, niet via deze route | Middel |

---

## 8. SCREENSHOT-KANDIDATEN

De site heeft **nul** productscreenshots (`public/screenshots/skills/` is leeg; 22 afbeeldingen
totaal, allemaal blog/portret/logo). Dit is de goedkoopste kwaliteitssprong die de site kan maken.

Prioritering: (1) bewijst een claim die nu alleen in tekst staat, (2) toont iets wat de
concurrent niet heeft, (3) heeft echte data erin.

| # | Route in fma-app | Wat je ziet | Hoort op | Anonimiseren? |
|---|---|---|---|---|
| 1 | `/clyde` | Het chatpaneel met toolkaarten (`getEngagementMetrics`, `getDailyBrief`) en de moduskiezer. **Het hoofdbeeld van het hele product** | Home hero · `skills/clyde` | **Ja** — klantnamen in de conversatie |
| 2 | `/clients/[id]/onboard` (stap 5) | De strategiesessie: Clyde stelt de vraag, de vijf blokken vullen zich met status draft/confirmed | `how-it-works` · nieuwe sectie "de strategiesessie" | **Ja** — echte klantstrategie |
| 3 | `/clients/[id]/strategy` | De vastgelegde strategie: positionering, doelen, pijlers, thema's, kanalen, mét herkomstlabels | `how-it-works` · `skills/clyde` | **Ja** |
| 4 | `/clients/[id]/content-strategy` | De contentagenda over de maanden, pijlers ingeroosterd | Home "de cyclus" · `skills/social-media` | **Ja** |
| 5 | `/content-engine/calendar` | Contentkalender met drag & drop over kanalen — bewijst "3.316 ingeplande items" | `skills/social-media` | **Ja** |
| 6 | `/clients/[id]/content-review` | Contentreview per slide met feedbackknoppen | `skills/social-media` · `how-it-works` stap 4 | **Ja** — echte carrousels |
| 7 | `/clyde/approvals` | De goedkeuringswachtrij — de site noemt "goedkeuring" 28× en toont hem nooit | `how-it-works` stap 4 | **Ja** |
| 8 | `/client/content` (klantportaal) | Wat de **eindklant** ziet. Vult het gat "portaal = 0 vermeldingen" | Nieuwe sectie "wat jouw klant ziet" · `pricing` | **Ja** |
| 9 | `/clyde/goals` of `/goals` | Doelen met projectie versus gemeten actuals | `skills/reporting` · home | **Ja** |
| 10 | `/analytics/social` | KPI-dashboard met echte Instagram-data (420 posts) | `skills/reporting` | **Ja** — merknamen en cijfers |
| 11 | `/seo` of `/analytics/seo` | SEO-audit + GEO-citaties naast elkaar (790 GSC-rijen) | `skills/seo-geo` | **Ja** — domeinnaam |
| 12 | `/blog-factory` | De blogpijplijn van zoekwoord tot gepubliceerd (112 artikelen) | `skills/blog-factory` | **Ja** |
| 13 | `/email` of `/clients/[id]/email/inbox` | Inbox-triage met labels en de concept-goedkeuringswachtrij | `skills/email-management` | **Ja, streng** — echte e-mailinhoud (10.829 logs) |
| 14 | `/clients/[id]/showcase` of `/pillar-showcase` | Het merk-showcase-bord: kleuren, typografie, voorbeeldcontent per pijler | Home · `about` · `skills-index` | Nee, met een demo-merk het mooist |
| 15 | `/settings/integrations` | Kanaalkoppelingen + token-gezondheid — bewijst dat koppelen echt bestaat | `how-it-works` stap 3 | **Ja** — tokenstatus |
| 16 | `/agent-team` of `/agent-activity` | Clyde die werk delegeert en de taken volgt (206 taken) | `skills/clyde` | **Ja** |
| 17 | `/clyde/memory` | Clyde's geheugen per merk — de site heeft al een `memory`-pagina zonder beeld | `memory` | **Ja** |
| 18 | `/clyde/meetings/[meetingId]` | Meeting-samenvatting met actiepunten | Nieuwe sectie · `skills/clyde` | **Ja, streng** — transcriptinhoud |
| 19 | `/manychat/inbox` | De unified social inbox — bewijst de nieuwe naam "Social Command Center" | `skills/manychat` | **Ja** |
| 20 | `/ad-manager/campaigns` of `/ad-builder` | Ad-varianten per formaat plus prestaties | `skills/ad-manager` | **Ja** |
| 21 | `/lead-qualifier/chatbots` + `/chat/[widgetId]` | De chatbot-bouwer naast de live widget | `skills/lead-qualifier` · `chatbots` | **Ja** |
| 22 | `/billing` | Creditverbruik en tier — maakt de prijspagina concreet | `pricing` | **Ja** |
| 23 | `/clients` | De portfolio-lijst: bewijst multi-tenant schaal (123 klanten, 13 organisaties) | `pricing` (werkruimte-model) · home | **Ja, streng** — alle klantnamen |
| 24 | `/agency/cost-dashboard` of `/admin/api-costs` | Wat een merk per maand aan AI kost | `pricing` · `about` (transparantie) | **Ja** |
| 25 | `/review/[clientId]` (publieke reviewlink) | Wat een klant zonder account te zien krijgt | `how-it-works` stap 4 | **Ja** |

### Anonimisatie — praktisch

Bijna elk scherm draagt echte klantdata (123 klanten in productie). Twee werkbare routes:

1. **Demo-organisatie**: er bestaat al demo-infrastructuur — `src/lib/demo/seed.ts`,
   `src/lib/demo/mock-ai-responses.ts`, `DEMO_AGENCY_PASSWORD` en `DEMO_CLIENT_PASSWORD` in
   Vercel Production, plus de route `/demo/pretend-payment`. **Schiet de screenshots op een
   demo-org**, dan is anonimiseren niet nodig en blijft het beeld herhaalbaar.
2. **SkinClarity Club met toestemming**: SKC is al de publieke case study (Sindy staat met naam,
   foto en LinkedIn op de site). Voor SKC-schermen is anonimiseren dus niet nodig — voor de
   andere 122 klanten wél.

Nooit ongefilterd tonen: `/clients` (namenlijst), `/email*` (mailinhoud), `/clyde/meetings/*`
(transcripties), `/settings/integrations` (tokenstatus), `/outbound-leads` (persoonsgegevens).

---

## Dekkingsrapport

Welke lagen zijn gecheckt, en welke waren beperkt. Zonder dit is geen enkele "bestaat niet"-conclusie
in dit rapport geldig.

| Laag | Gecheckt | Beperking |
|---|---|---|
| `src/lib/skills.ts` (canonieke featurelijst) | Ja, volledig | Geen |
| `node scripts/list-features.mjs` | Ja | Geen |
| Code op `origin/master` `9b5f91ed1` | Ja, via een schone worktree | Geen. **De oorspronkelijke werkboom liep 348 commits achter en is niet gebruikt** |
| `supabase/migrations/` | Ja, per naam gefilterd | Migratiebestand ≠ productie — daarom is elke statusclaim óók tegen de DB getoetst |
| Vercel Production env vars | Ja — `vercel env ls production`, 158 keys; `vercel env ls`, 254 entries over alle omgevingen | Alleen NAMEN gelezen, nooit waardes |
| Productiedatabase `nurdldgqxseunotmygzn` | Ja — rijtellingen op 20+ tabellen | Read-only; geen rij-inhoud gelezen behalve aggregaten |
| Projectgeheugen (`memory-search.mjs`) | Ja, voor de strategiesessie en de WhatsApp-blokkade | Geen |
| Site `messages/nl.json` | Ja, volledig geparsed (42 top-level keys) | Alleen `nl.json`; `en.json` (216 KB) en `es.json` (233 KB) zijn niet doorgelicht — als de NL-claims fout zijn, zijn de EN/ES-varianten dat vermoedelijk ook |
| Site `public/` | Ja, alle bestanden geteld | Geen |
| Obsidian vault | **Niet gebruikt** | Niet nodig: alle claims konden tegen code, env of DB worden getoetst |
| graphify | **Niet gebruikt** | Idem |

### Waar de conclusies het zwakst zijn

1. **`en.json` en `es.json` zijn ongemeten.** Tabel 7b geldt bewezen alleen voor de Nederlandse site.
2. **De site-subagents waren nog niet terug** toen dit rapport werd afgerond; alle site-bevindingen
   hierin zijn door mijzelf direct uit `messages/nl.json` en `public/` gemeten, niet overgenomen.
3. **"Live" is gemeten als code + env + DB-rijen.** Dat bewijst dat een pad ooit gedraaid heeft,
   niet dat het vandaag foutloos draait. Voor twee gevallen is dat expliciet ontkracht:
   `fma_analytics_sync_runs` (0 rijen) en `voice_calls` (0 rijen).
4. **Postiz en Shopify draaien op per-klant-sleutels in de database, niet op env vars.** Voor die
   twee is "geen env var" dus géén bewijs van afwezigheid — daarom is er op tabelrijen geteld
   (`fma_postiz_connections` = 5, `fma_shopify_tokens` = 1).

### Reproduceerbaar

```bash
# product, op de deploy-branch
git -C c:/Users/daley/Desktop/fma-app worktree add --detach <pad> origin/master
node scripts/list-features.mjs

# productie-env (alleen namen)
vercel env ls production

# site
python -c "import json,io;d=json.load(io.open('messages/nl.json',encoding='utf-8'));print(sorted(d))"
find public -type f \( -name '*.png' -o -name '*.jpg' -o -name '*.webp' \) | wc -l
```
