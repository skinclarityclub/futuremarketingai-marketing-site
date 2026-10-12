# Claim-audit D: skills-research, voice-agent, email-management, lead-qualifier, manychat, reel-builder, chatbots

Bronnen: origin/master (fma-app) + prod-DB SELECT, 2026-10-12. Prijzen/credits (research 3, lead 2, email 5, voice 5/min, ManyChat 2 per 10 DM, reel 25), tiercaps (email 20/60/40, voice 30/120/60, DM 200/1000/500, reel 4/15/8) en Founding 997 EUR kloppen met src/lib/skills.ts:518-536, :360-396, :289 (WAAR, niet gelist).

## Lead Qualifier (bekende feiten opgenomen)

| sleutel | claim | verdict | bewijs | wat wel waar is |
|---|---|---|---|---|
| skills-lead-qualifier.features.feature3.body | "Warme leads gaan automatisch naar HubSpot, Salesforce of Pipedrive ... Koude leads in een nurture-flow" | ONWAAR | geen hubspot/salesforce/pipedrive/nurture in lead-qualifier/chatbot-code (git grep origin/master); HubSpot alleen src/app/api/voice/oauth/hubspot | Uitgaande webhook per chatbot met leveringslog/DLQ/replay (src/actions/webhook-actions.ts); geen nurture-flow |
| skills-lead-qualifier.how.step3.body | "score 80+ direct naar sales, 40-80 naar CRM-nurture, onder 40 naar info-mailadres" (instelbare drempels) | ONWAAR | src/lib/validations/lead-score.ts:126-134 vaste tiers (cold <26, warm 26-50, hot 51-75, on_fire 76+ of urgentievlag); geen routering op drempel | Score 0-100 + vaste tier; lijstfilter op score_min/max |
| skills-lead-qualifier.features.feature3.title / meta.description | "CRM-routering" | ONWAAR | zie hierboven | Webhook-levering; geen native CRM-koppeling |
| skills-lead-qualifier.faq.items.q1.answer | routeert warme leads "naar je CRM, Slack of het salesteam" | ONWAAR | geen slack in chatbot/webhook-code | Webhook naar elke URL (geen Slack-koppeling) |
| skills-lead-qualifier.faq.items.q3.answer | Pro/Enterprise: "dynamische routing op basis van score-drempels en automatische opvolging via e-mail" | ONWAAR | geen tiergating of opvolgmail in lead-qualifier; SKILL_CAPS bevat geen lead-qualifier | Lead Qualifier is fair-use op alle tiers (skills.ts:355-358) |
| skills-lead-qualifier.faq.items.q4.answer | criteria "BANT of MEDDIC"; "wekelijkse kalibratie van score-drempels"; 2 weken onboarding | ONWAAR (MEDDIC) / ONBEWEZEN (rest) | src/lib/ai/chatbot-scoring.ts:1-12: 3 pijlers (Profile Fit 0-33, Intent 0-33, Conversation Quality 0-34 = BANT-extractie); geen MEDDIC | BANT-data wordt geextraheerd en getoond (lead-bant-breakdown); termijn/kalibratie niet in code |
| skills-lead-qualifier.features.feature2.body | score op "budget, tijdlijn, specificiteit ... direct zichtbaar in het CRM" | ONWAAR (deel "in het CRM") | geen CRM-koppeling | Score zichtbaar in het FMai-leaddashboard |
| skills-lead-qualifier.hero.subtitle | "Geen lead gaat verloren door gemiste chats" | ONBEWEZEN (absolute garantie) | n.v.t. | Widget + persona + kennisbasis per chatbot bestaan (api/chatbot/knowledge/ingest) |
| skills-lead-qualifier.features.feature4.body | gespreksanalyse: "waar haken mensen af, welke flows converteren" | ONBEWEZEN | geen funnel-/afhaakanalyse voor chatbots gevonden (wel in DM-motor src/lib/instagram-dm/funnel.ts) | Gesprekken en leads per chatbot zijn doorzoekbaar |
| skills-lead-qualifier.integrations.integration1 | "Voice Agent (binnenkort): chat-leads opvolgen met een telefoongesprek" | NIET-LIVE | geen link chatbot-lead -> voice campaign in code; voice coming_soon (skills.ts:139) | Staat als binnenkort; koppeling bestaat niet |
| skills-lead-qualifier.integrations.integration2 | "Email Management: opvolgmails naar gekwalificeerde leads" | ONWAAR | geen koppeling lead -> e-mailconcept gevonden | Mailcategorie "Leads" bestaat in de mailtriage (template-labels.ts), los van chatbot-leads |
| skills-lead-qualifier.integrations.integration3 | rapportage "conversietrechter en kost-per-lead per bron" | ONBEWEZEN | niet gevonden voor chatbot | leads.source prod: chatbot 26, inbox 2, ig_dm 1 |
| skills-lead-qualifier.faq.items.q5.answer | "Goedkoper dan een SDR, met geheugen tussen sessies" | ONBEWEZEN | geen vergelijking/sessiegeheugen gevonden | n.v.t. |

## Voice Agent (moet "coming soon" zijn)

| sleutel | claim | verdict | bewijs | wat wel waar is |
|---|---|---|---|---|
| skills-voice-agent.meta.title/description + hero.title | "Clyde voert AI-telefoongesprekken, boekt afspraken ... neemt de telefoon op" (meta en hero.title zonder voorbehoud) | NIET-LIVE | skills.ts:139 coming_soon; prod voice_agents=2, voice_calls=0, voice_campaigns=0 | Code en tabellen bestaan, nooit een gesprek gevoerd; eyebrow en subtitle zeggen wel "binnenkort" |
| skills-voice-agent.features.feature1-4 | FAQ, afspraken boeken, uitgaande lijsten, opnemen/transcriberen, escalatie | NIET-LIVE | 0 calls in prod | Richting; alleen toelaatbaar met "binnenkort" erbij |
| skills-voice-agent.how.step2.body | "Koppel een telefoonnummer via VAPI" | ONWAAR | src/app/api/voice/agents/route.ts:71-72 vapi_assistant_id: null "during migration"; src/lib/voice/elevenlabs-client.ts is de actieve client | Agents lopen via ElevenLabs; Vapi is nog kolom/analytics-tekst |
| skills-voice-agent.faq.items.q2.answer | "ElevenLabs (stem) en Twilio of Telnyx ... eigen NL-nummer ... SIP-trunking vanaf Professional" | ONWAAR (Twilio/Telnyx/SIP) | git grep twilio/telnyx/sip.?trunk in src: geen telefonie-integratie | ElevenLabs-client bestaat; geen nummerprovisioning |
| skills-voice-agent.faq.items.q3.answer | "Growth 30 min, Professional 120, Enterprise onbeperkt, Founding 60" | NIET-LIVE | caps in skills.ts:360-396 maar vaardigheid coming_soon, 0 calls | Caps gedefinieerd, niet leverbaar |
| skills-voice-agent.faq.items.q4.answer | "Drie tot vier weken ... week 2 schaduwluisteren" | ONBEWEZEN | geen call ooit | n.v.t. |
| skills-voice-agent.integrations.integration1 | gesprekken "synchroniseren naar het CRM" | NIET-LIVE | HubSpot-OAuth alleen in voice-agent (api/voice/oauth/hubspot), 0 calls | HubSpot-OAuth voor voice-agent in code |
| skills-voice-agent.proof.title/subtitle | "Probeer Clyde live. Interactieve demo: voer zelf een gesprek" | NIET-LIVE | 0 calls, coming_soon | geen live voice-demo aangetoond |
| skills-voice-agent.faq.items.q5.answer / integrations.integration2-3 | terugkoppeling naar Lead Qualifier en Rapportage "zonder extra werk"; gespreksmetrics in digest | NIET-LIVE | geen koppeling gevonden | n.v.t. |

## Reel Builder (moet "coming soon" zijn)

| sleutel | claim | verdict | bewijs | wat wel waar is |
|---|---|---|---|---|
| skills-reel-builder.meta.title/description + hero.title | "Clyde produceert je Reels ... 25 credits per Reel" zonder voorbehoud | NIET-LIVE | skills.ts:166 coming_soon, route null; geen reel-tabel in prod; geen reel-pipeline in src | eyebrow/subtitle zeggen "binnenkort" |
| skills-reel-builder.features.feature1-4 | scripts, synchrone captions, beat-sync muziek, "licentievrije bibliotheek", templates | NIET-LIVE | geen code | Richting |
| skills-reel-builder.faq.items.q2.answer | "Runway en Pika, ElevenLabs voice-overs, FFMPEG ... output naar Reels, TikTok, Shorts en LinkedIn Video" | ONWAAR | geen runway/pika in src (alleen archetype-comment); ffmpeg alleen in thumbnail-/frame-routes; publiceren vandaag alleen IG + LinkedIn | Remotion/Creatify-callbacks voor ads bestaan, geen Reel Builder |
| skills-reel-builder.faq.items.q3.answer | "Growth 4 Reels, Pro 15, Enterprise onbeperkt, Founding 8" | NIET-LIVE | caps in skills.ts, niet leverbaar | "staat op de roadmap" in dezelfde zin is correct |
| skills-reel-builder.faq.items.q4.answer | "Twee weken onboarding" | NIET-LIVE | geen product | n.v.t. |
| skills-reel-builder.how.step3.body / integrations.* | "Direct uploaden of inplannen via Social Media", "Blog Factory samenvatten in Reel van 60 s" | NIET-LIVE | geen koppeling | Richting |
| skills-reel-builder.faq.items.q5.answer | "Geen handmatig editen meer, batch van 4 of meer per week" | NIET-LIVE | geen product | n.v.t. |

## Email Management

| sleutel | claim | verdict | bewijs | wat wel waar is |
|---|---|---|---|---|
| skills-email-management.faq.items.q2.answer | "Op dit moment uitsluitend Gmail ... Outlook en custom IMAP staan op de roadmap voor Q3" | ONWAAR | src/app/api/oauth/email/[provider]/callback/route.ts:20 provider enum gmail+outlook; src/lib/email/providers/outlook.ts; prod fma_email_logs 60 d: outlook 1266, gmail 48 | Gmail en Outlook (Microsoft Graph) live via OAuth; IMAP-cron werkt op env-vars, niet per klant |
| skills-email-management.faq.items.q2.answer | "Verbinding wordt elk uur ververst" | ONWAAR | vercel.json: email-triage elke 15 min | Triage-cron */15 |
| skills-email-management.faq.items.q2.answer | "geen e-mails buiten EU-servers opgeslagen" | ONBEWEZEN (misleidend) | opslag EU-DB; classificatie stuurt mailtekst naar Anthropic Haiku (src/lib/email/llm/classify.ts:172-204), spec: taalmodel in de VS | Opslag in EU-database; mailinhoud gaat voor classificatie naar het taalmodel (VS) |
| skills-email-management.how.step1.body | "Alleen lees- en labelrechten; niets wordt verstuurd zonder beoordeling" | ONWAAR (scopes) | oauth/email/[provider]/start/route.ts:140-141 scope gmail.modify + gmail.labels; gmail.ts:27 draftSend; send-core.ts | Verzenden loopt via goedgekeurd concept (fma_email_drafts prod: 6 pending, 2 sent, 1 rejected); scope is breder dan lees+label (ook verplaatsen/archiveren) |
| skills-email-management.features.feature1.body / faq q1 | categorieen "urgent, actie, info, overig" | ONWAAR | template-labels.ts; prod fma_email_logs.category: fmai_notificaties 1061, fmai_nieuwsbrieven 159, facturen, leads, klant_vragen, urgent, intern | Categorieen instelbaar per klant (fma_email_categories) plus urgentiescore 1-5 en statuslabels Te beantwoorden / Wacht op klant |
| skills-email-management.features.feature3.body / faq q1 | digest "top-3 urgente items, openstaande acties en conceptantwoorden klaar om te versturen" | ONWAAR | src/app/api/cron/email-daily-digest/route.ts:1-8: telt gisteren geclassificeerde mails en pending concepten, een bel-notificatie met aantallen | Dagelijkse notificatie (07:00 UTC) met aantallen; uurlijkse Clyde-p1/p2-digestmail is een ander ding |
| skills-email-management.how.step2.body | "Vanaf week 2: 95% of hoger nauwkeurig" | VERBODEN | percentage als resultaat; geen nauwkeurigheidsmeting in code | Correcties (fma_email_corrections) dienen als voorbeeld voor de classifier |
| skills-email-management.faq.items.q4.answer | "Dag 2-4 leert Clyde labelpatronen door eerdere e-mails te analyseren (alleen rubriek-labels, geen inhoud)"; termijnen | ONWAAR (historische analyse) / ONBEWEZEN (termijnen) | geen backfill in src/lib/email of oauth-callback; leren = corrections + sender rules | Classifier leert van correcties en afzenderregels |
| skills-email-management.faq.items.q5.answer | "in jouw schrijfstijl ... bespaart scan-en-typ-uren" | ONBEWEZEN | brand voice + eerdere antwoorden worden meegegeven (load-brand-voice.ts); uren niet te toetsen | Conceptantwoorden bestaan (draft-reply.ts) |
| skills-email-management.integrations.integration1 | "Lead Qualifier: sales-mails naar leads via een scoring-flow" | ONWAAR | geen koppeling mailtriage -> fma_leads gevonden | Categorie "Leads" labelt mails |

## ManyChat DM

| sleutel | claim | verdict | bewijs | wat wel waar is |
|---|---|---|---|---|
| skills-manychat.how.step1.body + faq q1 | "Instagram Business koppelen via ManyChat" / "via de ManyChat-koppeling" | ONWAAR (verouderd) | src/lib/instagram-dm/connect.ts:15-23 eigen Instagram Login (instagram_business_manage_messages/comments); cron instagram-dm elke minuut (vercel.json); ManyChat alleen nog inbox-webhook (prod 1 manychat-kanaal) | Eigen DM-motor op de Meta Graph API; ManyChat-webhook bestaat naast |
| skills-manychat.features.feature2.body / faq q1 | "AI-antwoorden in de merkstem, geheugen per gebruiker", "Clyde reageert direct" | NIET-LIVE | src/lib/instagram-dm/accounts.ts:11 clyde_mode autonomous/draft/off; prod fma_instagram_dm_settings: alleen draft en off, 2 regels aan, 42 events | Keywordregels (comment, dm, story_reply, story_mention) sturen vaste antwoorden; Clyde-AI-antwoord alleen als concept |
| skills-manychat.features.feature3.body | "doorsturen naar HubSpot, Salesforce of het sales-team" | ONWAAR | geen CRM-koppeling in DM-motor of inbox | Lead komt in fma_leads (source ig_dm: 1) |
| skills-manychat.hero.subtitle / meta.description | "Geen gemiste DM" / "dag en nacht" | VERBODEN | 24/7-equivalent en absolute garantie; Meta-limiet 750 private replies per uur (decide.ts) | Cron elke minuut |
| skills-manychat.how.step3.body | "Clyde reageert binnen seconden" | ONWAAR | cron instagram-dm * * * * * (polling per minuut) | Reactie binnen ongeveer een minuut |
| skills-manychat.faq.items.q4.answer | "Dag 5 live met handmatige goedkeuring per flow-pad; vanaf week 2 autonoom" | ONBEWEZEN (autonoom NIET-LIVE) | geen autonome modus aan in prod | n.v.t. |
| skills-manychat.faq.items.q5.answer | "levert leads die ChatGPT-bots missen; bespaart wekelijkse flow-onderhoud-uur" | ONBEWEZEN | - | - |

## Research

| sleutel | claim | verdict | bewijs | wat wel waar is |
|---|---|---|---|---|
| skills-research.faq.items.q2.answer | bronnen "Perplexity-, Tavily- en Exa-API's, nieuws-aggregators, Instagram/LinkedIn/TikTok, Meta Ad Library, Google Trends, custom RSS-feeds" met "exacte bron, datum en relevantiescore" | ONWAAR (Tavily, Exa, RSS, Google Trends, sociale platforms, relevantiescore) | git grep tavily/exa/rss/google trends in src: 0 hits; src/lib/research/run-research.ts:2 = een Perplexity-zoekactie + Haiku-synthese; prod source_tool 90 d: perplexity, firecrawl, pubmed, meta_ad_library (4 runs), anthropic | Live bronnen: Perplexity (met bronlinks), Firecrawl, PubMed, Meta Ad Library; bronnen krijgen url en titel, geen relevantiescore |
| skills-research.features.feature1.body / how.step2.body | "Continu scannen van nieuwsbronnen, social media en zoekvolumes"; "Clyde draait continu ... alerts" | ONWAAR | geen social-/zoekvolumebron; wel geplande runs: research-job-worker */30 min, intelligence-refresh dagelijks 01:00 UTC (vercel.json); prod 18 geplande market_trends-runs in 90 d | Geplande onderzoeksruns per klant (markttrends, concurrentie, nieuws) |
| skills-research.faq.items.q3.answer | "Professional krijgt geplande wekelijkse trendrapporten, Enterprise aangepaste cadences en watchlists" | ONWAAR | geen tiergating voor research (skills.ts:355-358 fair-use alle tiers) | Research fair-use op alle tiers, 3 credits per vraag |
| skills-research.faq.items.q4.answer | "Drie tot vijf dagen ... baseline dag 2-3, eerste rapport dag 4" | ONBEWEZEN | geen onboarding-sequentie voor research in code; prod wel runs met trigger_type onboarding | Bij onboarding draaien automatisch runs (ICP, audience, competitor) |
| skills-research.hero.subtitle / features.feature3 | "Elk inzicht heeft een bron ... Geen LLM-hallucinaties" | ONBEWEZEN (absolute claim) | run-research.ts:160-175 alleen genummerde bronnen; MIN_CITATIONS=2 in market-trends.ts | Citatiepoort: bevindingen met minder dan 2 bronnen vallen af in de wekelijkse run |
| skills-research.faq.items.q5.answer | "trend van vorige week wordt niet opnieuw opgehaald, geheugen per merk" | ONBEWEZEN | dedup-hash per vraag (market-trends.ts) en cache.ts bestaan | Dedup op vraag-hash |
| skills-research.useCases.useCase2.body | "bouwt in een dag een niche-briefing" | ONBEWEZEN | - | - |
| skills-research.integrations.integration3 | "Ad Manager: concurrentie-analyse verbetert je eigen advertenties" | ONBEWEZEN | ad-builder gebruikt eigen inspiratiecache (api/ad-builder/refresh-inspiration), geen research-koppeling aangetoond | - |

## Chatbots (dienstpagina)

| sleutel | claim | verdict | bewijs | wat wel waar is |
|---|---|---|---|---|
| chatbots.multi_platform.stats.inquiries.value / trust_metrics.inquiries.value | "50.000+ vragen per maand / vragen verwerkt" | ONWAAR (ook VERBODEN: volumecijfer als bewijs) | prod fma_chatbot_conversations: 46 gesprekken en 171 berichten in totaal; 44 gesprekken laatste 30 d | 6 chatbots, 29 leads in prod |
| chatbots.trust_metrics.crm.value | "15+ CRM-integraties" | ONWAAR | geen native CRM-koppeling in chatbot; alleen uitgaande webhook | Webhook naar elk CRM |
| chatbots.faq.items.q4.answer | "Leads gaan direct door naar HubSpot, Salesforce of jouw CRM via webhook" | ONWAAR (HubSpot/Salesforce direct) | src/actions/webhook-actions.ts; HubSpot-OAuth alleen voice-agent | Uitgaande webhook per chatbot |
| chatbots.faq.items.q5.answer | "meer dan 50 talen ... standaard NL, EN en ES" | ONWAAR (ES) | src/components/lead-qualifier/chatbot-options.ts:30-35 nl/en/de/fr | NL, EN, DE, FR instelbaar |
| chatbots.faq.items.q6.answer | "Alle gespreksdata binnen EU-datacenters; verwerkersovereenkomst op aanvraag; AVG-proof" | ONWAAR (EU-verwerking) / ONBEWEZEN (DPA, AVG-claim) | src/lib/ai/chatbot-model-resolver.ts:45 Claude-only (Anthropic, VS); opslag EU; consent/erase-routes bestaan (api/chatbot/consent, dsr/erase) | Opslag in EU-DB; taalmodel bij Anthropic (VS); toestemming- en wisroutes aanwezig |
| chatbots.multi_platform.platforms.shopify | "Productaanbevelingen, orderstatus, herstel verlaten winkelwagens" | ONWAAR | geen shopify in src/lib/ai, api/chatbot, lib/chatbot | Geen chatbot-Shopify-koppeling |
| chatbots.multi_platform.platforms.whatsapp | "WhatsApp Business: gesprekken die verkopen, rich media" | NIET-LIVE | chatbotkanalen = website-widget; WhatsApp is Clyde voor bureau/klant, geen verkoopchatbot voor bezoekers | Widget + Instagram-DM-motor + ManyChat-inbox |
| chatbots.multi_platform.case_study | "SkinClarity Club draait dezelfde Clyde over website, Shopify en WhatsApp. Zonder contextverlies" | ONWAAR | geen Shopify/WhatsApp-chatbot in code; SKC-claims uit mockup verdacht | Niet aantoonbaar |
| chatbots.multi_platform.stats.platforms | "3+ kanalen verbonden" | ONBEWEZEN | prod inbox-kanalen: 3 own-bot, 1 manychat, 2 instagram | 3 soorten kanaal (widget, ManyChat, Instagram) |
| chatbots.use_cases.items.customer_service.description | "Handelt 70% van de klantvragen automatisch af. 24/7" | VERBODEN | percentage als resultaat + 24/7; geen meting | - |
| chatbots.meta.description / quick_answer / stats.availability / trust_metrics.availability / cta.title / hero / use_cases.* | "24/7" | VERBODEN | woordregel | Widget draait doorlopend, geen garantie |
| chatbots.use_cases.items.appointment_booking / quick_answer / meta.description | "Afspraken boeken ... agenda vullen", "boeken demo's" | ONWAAR | geen boekings-/agenda-integratie in api/chatbot, lib/chatbot, lib/ai | Chatbot vangt en scoort leads; geen agenda |
| chatbots.hero.description / faq.items.q2.answer | "Drie live demo's" / "live demo-omgeving met 3 persona's" | ONWAAR | chatbots.demo.placeholder zegt zelf "komt binnenkort"; de tabs (onboarding, content, ROI, concierge) zijn geen chatbot-demo's | Niet aantoonbaar |
| chatbots.demo.tabs.support.* | "bespaarde uren inschatten, kostenvergelijking, break-even" | ONBEWEZEN (uren-bespaard-framing) | ROI-calculator; "X uur bespaard" als kop is verboden | - |
| chatbots.demo.tabs.leadgen.scenario | blogpost "gepubliceerd op alle kanalen" | ONWAAR | publiceren vandaag IG + LinkedIn (prod 60 d: IG 259, LinkedIn 5) | Blog Factory schrijft en publiceert beperkt |
| chatbots.demo.tabs.ecommerce.scenario | "binnen uren on-brand content" | ONBEWEZEN | - | - |
| chatbots.process.steps.build.description | "Op maat gebouwde LLM-chatbot, getraind op jouw data" | ONWAAR (getraind) | geen training; RAG: api/chatbot/knowledge/ingest, lib/chatbot/kb-pipeline.ts, hybrid-search.ts | Kennisbank (RAG) uit eigen site/documenten |
| chatbots.related.voice_agents_description | "AI-gespreksagenten die in- en uitgaande gesprekken op schaal afhandelen" | NIET-LIVE | voice coming_soon, 0 calls | Richting |
| chatbots.related.marketing_machine_description | "Autonome contentcreatie, planning en campagne-automatisering" | ONBEWEZEN | autonomie is per taak instelbaar (observe/propose/act_report/full) | Autonomie per taak |
| chatbots.multi_platform.subtitle | "uniforme analytics, gedeelde kennis over alle platformen" | ONBEWEZEN | geen cross-kanaal analytics aangetoond; chatbot Claude-only | Claude voor chatbotantwoorden |
