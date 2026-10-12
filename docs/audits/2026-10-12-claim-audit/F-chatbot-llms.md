# Audit F: chatbot-kennis + llms-bestanden

Basis: `C:/tmp/fmai-verhaal-site/fmai-nextjs/`, pad-prefix hieronder weggelaten (`src/lib/chatbot/...` en `public/...`). App via `origin/master`, DB via SELECT.
Extra verdict `VERHAAL` = klopt niet met het nieuwe verhaal of mist een kernpunt. Founding (15 werkruimtes + EUR 299 extra) niet getoetst; alleen tegenstrijdigheid tussen bestanden gemeld.

Gemeten feiten die vaak terugkomen:
- Tierprijzen, credit packs, skillpacks en creditkosten in tool-data/support-kb/llms kloppen met `src/lib/skills.ts` (AGENT_TIERS 499/399/299, CREDIT_COSTS). Skill-status 10 live / 2 coming_soon klopt.
- SKC (`fma_clients`): account_keys = skinclarity_club, skinclarity_shop, sindy_huidtherapeut; active_skills = 10 (socialMedia, reporting, intelligence, blogFactory, emailManagement, leadQualifier, adCreator, seoAnalyst, clyde, socialCommandCenter).
- Geheugen: `fma_memories` types episodic/semantic/procedural (migratie 20260508000000) plus core blocks; RLS is org-niveau (`is_org_member`) plus `fma_memories_client_user_select` (migratie 20260703000200, zonder client-filter); scheiding per merk zit in `client_id` in de RPC `fma_retrieve_memories`, niet in RLS. Cron `/api/cron/memory-consolidation` loopt dagelijks 03:00 UTC (vercel.json:161), samenvoegen/decay/archiveren. Geen "dream", geen 4 lagen "Vandaag/Deze maand/Archief/Wie het merk is" in code. Cross-org lek (ISO18) pas gedicht 2026-10-11 (#1237); eigen memory-notities: "vault splitst NIET per client", "Sindy leest alle SKC-rijen via RLS".
- Rollen in app: `owner_admin` / `member` / `client_user` (geen Admin/Manager/Viewer). Autonomie: observe/propose/act_report/full (`agent-team/actions.ts:280`).
- Weekly digest cron `0 8 * * 0` (zondag 08:00 UTC), client-report `0 9 * * 0`; geen maandag 08:00.
- Geen Webflow/Mailchimp/Twilio/Google Ads/CRM-koppeling in src (alleen mock/demo). Geen data-export/verwijder-flow, geen 90-dagen-retentie, geen DPIA in src/app. Calendly alleen als kickoff-embed in onboarding.

| sleutel | claim (kort citaat) | verdict | bewijs | wat wel waar is |
|---|---|---|---|---|
| personas/clyde.ts:9 | "You work for 50+ agencies" | ONWAAR | DB: 1 founding-klant (SKC); eigen tekst zegt elders 1 plek bezet | Eén klant, in opbouw met de eerste bureaus |
| personas/clyde.ts:10 | "handling content, calls, leads, ads, email, and reporting" | NIET-LIVE | skills.ts:139 voiceAgent coming_soon | Calls (Voice Agent) zijn richting, niet live |
| personas/clyde.ts:11 | "always available, always learning, always delivering" | VERBODEN | woordregel 24/7 / "altijd" | Clyde draait op routines en op verzoek |
| personas/clyde.ts:15 | "reference benchmarks and results when relevant" | ONBEWEZEN | geen resultaatdata; SKC-cijfers uit mockup | Geen gemeten resultaten om naar te verwijzen |
| personas/clyde.ts:5-54 | persona-prompt als geheel | VERHAAL | prompt mist kring (doel, research, agenda, uitvoering, analytics), klantdashboard, drie ingangen, controle per taak, EU-zin | Persona noemt alleen "AI-collega", skills en tools |
| personas/clyde.ts:35 | "Not a fit: ... agencies doing < 3 client brands" | VERHAAL | ICP-synthese 5-15 fte; tiers starten bij 2 werkruimtes | Growth begint bij 2 merken; ICP is 5-15 fte |
| personas/clyde.ts:22 | "On pricing: help calculate ROI" (tool get_roi_estimate) | VERBODEN | leadgen-tools.ts:173-212 rekent % ROI en bespaarde uren | Tool rekent met aangenomen 15 uur/week per persoon |
| knowledge/concierge-kb.ts:8 | "10 skills are live today, 2 coming soon" | WAAR | skills.ts | (telling) |
| knowledge/concierge-kb.ts:19 | Lead Qualifier "scores leads and routes to CRM" | ONWAAR | geen CRM-koppeling in src/lib (grep hubspot/pipedrive/salesforce: 0 buiten blog-gate-voorbeelden) | Scoring en inbox in app; doorzetten naar eigen CRM niet gebouwd |
| knowledge/concierge-kb.ts:20 | ManyChat DM "Instagram DM keyword triggers with AI replies" | ONBEWEZEN | skill heet socialCommandCenter (skills.ts:98); DM-inbox + attributie live sinds 2026-10-11 | DM-inbox en link-attributie post-DM-formulier, 0 leads toegeschreven |
| knowledge/concierge-kb.ts:28 | "per-brand 4-layer memory ... nightly dream consolidation" | ONWAAR | geheugentypes episodic/semantic/procedural + core blocks; geen "dream"; geen 4 lagen | Memories + kernblokken per klant, dagelijkse consolidatie-cron 03:00 UTC |
| knowledge/concierge-kb.ts:28 | "Memory is positioned as the USP" | VERHAAL | nieuw verhaal draait om kring en controle, geheugen is geen USP-claim | Geheugen is middel, niet bewezen onderscheid |
| knowledge/concierge-kb.ts:63-80 | Growth "Email + app support", Pro "Slack support and monthly strategy call", Enterprise "White-label and API access", "Dedicated CSM and SLA" | ONBEWEZEN | skills.ts support: email/slack/dedicated_csm; white-label/API/SLA/maandelijkse strategiecall niet in code | Supportniveau email / slack / CSM staat in tierconfig |
| knowledge/concierge-kb.ts:77 | Enterprise "All 12 skills, no caps (fair use)" | ONBEWEZEN | niet gevonden in tierconfig | Credits 800 per werkruimte |
| knowledge/concierge-kb.ts:88,111,197 | "Max 20 partnerships per year" | ONBEWEZEN | tegenstrijdig met llms.txt:3 / llms-full.txt:3,298 ("Max 10") en spots 10 | Intern tegenstrijdig; cijfer is Daley's keuze |
| knowledge/concierge-kb.ts:114 | Apply-formulier "9 fields" | ONBEWEZEN | llms.txt:19 en llms-full.txt:300 zeggen 8, :372 zegt alleen naam/mail/bedrijf | Site-intern tegenstrijdig; formulier staat op de site, niet in app |
| knowledge/concierge-kb.ts:125 | Correction loop "Clyde remembers them, each week is sharper" | ONBEWEZEN | geen meting van leereffect | Feedback wordt als memory opgeslagen |
| knowledge/concierge-kb.ts:147-177 | SKC-case: 10 live skills actief, 3 IG-accounts, 4 merken | WAAR | DB fma_clients: 10 active_skills, 3 account_keys | (telling) |
| knowledge/concierge-kb.ts:163 | "weekly digest Monday 08:00 across IG, Shopify, SEO" | ONWAAR | vercel.json:61-63 weekly-digest zondag 08:00 UTC; client-report zondag 09:00 UTC | Wekelijkse digest op zondag (UTC); SEO-weekrapport via WhatsApp op vrijdag |
| knowledge/concierge-kb.ts:174 | "Weekly SEO rapport" | WAAR | seo-report-weekly-enqueue cron | (telling) |
| knowledge/concierge-kb.ts:168 | Clyde orchestrator "per-account memory plus portfolio-level learning" | ONBEWEZEN | agency memory (20260803000200) bestaat; gedeeld geheugen achter vlag CLYDE_SHARED_MEMORY, plan nog niet live | Geheugen per klant; agentuur-geheugen is in aanbouw |
| knowledge/concierge-kb.ts:202 | "Self-hosted EU infrastructure for AVG and EU AI Act compliance" | VERHAAL | taalmodel standaard bij Anthropic (VS), niet vermeld; compliance-claim niet toetsbaar | Data, servers en database in EU; taalmodel in VS |
| knowledge/concierge-kb.ts:205-208 | "Clyde is a colleague... Lifetime memory ... never forgets" | ONWAAR | decay/archivering: migratie 20260922002900_archive_decayed_memories | Memories vervallen en worden gearchiveerd |
| knowledge/concierge-kb.ts:213 | "Agencies with 5 to 20 people managing 5 to 20 brands" | VERHAAL | ICP-synthese: 5-15 fte | ICP 5-15 fte |
| knowledge/leadgen-kb.ts:39 | "Setup duurt 4 weken" | ONBEWEZEN | geen meting; llms-full.txt:369 PT4W | Onboardingduur niet gemeten |
| knowledge/leadgen-kb.ts:41 | "Tijdsbesparing is 15-20 uur/week" | VERBODEN | woordregel uren bespaard | Geen gemeten tijdwinst |
| knowledge/leadgen-kb.ts:64 | Blog "800-2000 words ... 2-4 articles per week per client" | ONWAAR | skills/llms zeggen 1500-3000 woorden; volume niet aantoonbaar | Blog Factory: lange SEO-artikelen, 1500-3000 woorden volgens site |
| knowledge/leadgen-kb.ts:66-70 | LinkedIn "3-5 posts per week", Instagram "4-7 pieces per week" | VERBODEN | volumecijfers als belofte | Publiceren IG (259 posts/10 accounts, 60 d) en LinkedIn (5) |
| knowledge/leadgen-kb.ts:72-73 | "Newsletters ... A/B variants" | ONWAAR | emailManagement is inboxclassificatie, geen campagnes (skills.ts:109; llms-full.txt:121) | Geen nieuwsbrief-skill |
| knowledge/leadgen-kb.ts:75-76 | "Video Scripts ... TikTok, YouTube Shorts" | NIET-LIVE | Reel Builder coming_soon (skills.ts:166) | Videoscripts zijn richting |
| knowledge/leadgen-kb.ts:78-79 | "Google Ads headlines ... LinkedIn sponsored content" | ONWAAR | alleen Meta in adCreator; geen Google Ads in src | Ad Manager publiceert naar Meta |
| knowledge/leadgen-kb.ts:96-118 | contentstrategie: discovery, 3-5 pillars, posting cadence | VERHAAL | app heeft strategielaag (doelen, pijlers, strategiesessie); chatbot-tekst is generiek en mist doel-research-agenda-uitvoering-analytics | Strategielaag: doelen met projectie, pijlers gemeten per pijler |
| knowledge/leadgen-kb.ts:112-117 | "Recommended Posting Cadence" 3-5x / 4-7x / 2-4x per week | VERBODEN | volumecijfers | Cadans stelt de agenda per merk |
| knowledge/leadgen-kb.ts:171-175 | "The Content Creator skill ... brand voice per client" | ONWAAR | skill "Content Creator" bestaat niet in skills.ts | Merkstem per klant zit in Social/Blog/Clyde |
| knowledge/leadgen-kb.ts:184-187 | "Output is checked against voice parameters"; "thumbs up/down" | ONBEWEZEN | niet teruggevonden als feature | Blog Factory heeft eigen kwaliteitsgates |
| knowledge/leadgen-kb.ts:225-230 | "typical weekly batch": 2-3 blogs, 5 LinkedIn, 5 IG, 1 newsletter | VERBODEN | volumecijfers + nieuwsbrief bestaat niet | Zie eerder |
| knowledge/leadgen-kb.ts:24-36 | "Clyde drafts, jij approves" | WAAR | autonomie per taak, goedkeuring | (telling) |
| knowledge/support-kb.ts:23-64 | tierprijzen, credit packs, skillpacks | WAAR | skills.ts:238-290,405-500 | (telling) |
| knowledge/support-kb.ts:25 | "recalibrated every 6 months" | ONBEWEZEN | beleid, niet in code | Eigen afspraak |
| knowledge/support-kb.ts:98-100 | "11x AI USD 5,000/mo", "EUR 5,997-20,000/mo agency retainer", junior EUR 4,500-6,200 | ONBEWEZEN | externe claims zonder bron | Niet toetsbaar |
| knowledge/support-kb.ts:104 | "Available 24/7, no sick days, no vacation" | VERBODEN | woordregel 24/7 | Routines draaien volgens schema |
| knowledge/support-kb.ts:106 | "add a workspace in 15 minutes" | ONBEWEZEN | geen meting | Onboarding per klant heeft stappen |
| knowledge/support-kb.ts:83-111 | kostenvergelijking junior marketeer vs Clyde | VERBODEN | "vervangt personeel"-framing | Clyde neemt werk weg, vervangt niemand (support-kb.ts:151 zegt dat zelf) |
| knowledge/support-kb.ts:127-151 | Tijdbenchmarks (blog 5-10 min, 14-19 uur/week bespaard, 65-90 uur/week) | VERBODEN | uren bespaard + volumecijfers | Geen gemeten tijdwinst |
| knowledge/support-kb.ts:169-204 | ROI 334% / 276% / 224%, "Payback under 1 month ... from day one", resell EUR 10-30k | VERBODEN | percentages als resultaat | Geen gemeten ROI |
| knowledge/support-kb.ts:229 | Founding "8,000 credits ... equivalent to 10-workspace allocation" | WAAR | 8000 = 10 x 800 (rekenkundig) | (telling) |
| knowledge/support-kb.ts:233-234 | "Founding Agency Network membership", "Priority for new feature rollouts" | ONBEWEZEN | niet in code | Founding heeft founder-Slack (skills.ts: support founder_slack) |
| knowledge/support-kb.ts:202 | Founding "Best value in the market" | ONBEWEZEN | superlatief zonder bron | Prijsvergelijking intern |
| knowledge/support-kb.ts:249 | "1 spot taken (SkinClarity Club)" | ONBEWEZEN | tier van SKC niet in fma_clients getoetst | SKC is de eerste klant |
| knowledge/ecommerce-kb.ts:8-9 | roles "Admin, Manager, Viewer" | ONWAAR | owner_admin / member / client_user (client-access.test.ts:126) | Drie principals: eigenaar-admin, lid, klantgebruiker |
| knowledge/ecommerce-kb.ts:18 | "Supported: LinkedIn, Instagram, Facebook, WordPress, Mailchimp, Google Ads, Meta Ads" | ONWAAR | geen Mailchimp/Google Ads/WordPress-publicatie in src; publiceren op IG en LinkedIn | Publiceren IG + LinkedIn; rest van Postiz op verzoek; Meta Ads |
| knowledge/ecommerce-kb.ts:24,130 | "Auto-publish: AI creates and publishes without human review (fastest)" | VERHAAL | autonomie per taak (observe/propose/act_report/full) is het verhaal | Controle per taak: van meekijken tot zelf uitvoeren met rapport |
| knowledge/ecommerce-kb.ts:53 | "Content for Client A never bleeds into Client B's voice" | ONBEWEZEN | cross-org lek gedicht pas 2026-10-11; memory-RLS org-breed | Scheiding via client_id in code, getest 12/12 op prod |
| knowledge/ecommerce-kb.ts:88 | "Assign team members to client workspaces ... Track who approved what and when" | ONBEWEZEN | teamtoewijzing live (spec); auditspoor goedkeuringen niet getoetst | Teamleden toewijzen aan klanten is live |
| knowledge/ecommerce-kb.ts:91 | "Adding a new client takes under 15 minutes" | ONBEWEZEN | geen meting | n.v.t. |
| knowledge/ecommerce-kb.ts:94 | "Data is retained for 90 days. Export all content..." | ONWAAR | geen 90-dagen-retentie en geen exportflow in src | Niet gebouwd |
| knowledge/ecommerce-kb.ts:76-85 | "Multi-Client Dashboard ... client workspace" zonder klantdashboard-verhaal | VERHAAL | nieuw verhaal: klant van het bureau krijgt eigen dashboard (/client/*), contentbibliotheek, aanvragen via formulier, eigen Clyde op WhatsApp | Staat nergens in de chatbotkennis |
| knowledge/ecommerce-kb.ts:119-120 | "Drag-and-drop rescheduling", "Holiday and industry event integration" | ONBEWEZEN | draggable in calendar/use-day-grid.ts:170; events niet gevonden | Kalender met slepen bestaat deels |
| knowledge/ecommerce-kb.ts:132 | "Agency + Client approval: Agency reviews first, then client approves" | ONBEWEZEN | klantportaal bestaat; tweestaps-flow niet getoetst | Klant ziet eigen content in /client/* |
| knowledge/flagship-kb.ts (algemeen) | kennis mist: drie ingangen (dashboard, WhatsApp, mobiele app in aanbouw), post-DM-lead, kring | VERHAAL | zie onderdeel hierboven | Mobiele app en aanvraag via Clyde/WhatsApp zijn richting |
| tool-data.ts:46,93 | "Alle 12 vaardigheden inbegrepen (10 live, 2 binnenkort)" | WAAR | skills.ts | (telling) |
| tool-data.ts:52,99,146 | Founding "10 plekken totaal, 1 bezet (SkinClarity Club)" | ONBEWEZEN | zie support-kb.ts:249 | n.v.t. |
| tool-data.ts:63,121 | Professional "Eigen Slack-kanaal" | WAAR | skills.ts: support 'slack' | (telling) |
| tools/concierge-tools.ts:23,39,55 | "Geheugen per account gescheiden. Nachtelijke geheugenconsolidatie." | ONBEWEZEN | consolidatie-cron dagelijks 03:00 UTC (vercel.json:161); scheiding via client_id | Dagelijkse consolidatie, scheiding per klant in code |
| tools/concierge-tools.ts:23 | "Wekelijkse performance-digest op maandag 08:00" | ONWAAR | vercel.json:61-63 zondag | Zondag 08:00 UTC |
| tools/concierge-tools.ts:195 | get_case_study "real results", "testimonial" | VERHAAL | casus bevat geen meetbare resultaten; SKC-cijfers uit mockup | Alleen kwalitatieve beschrijving, geen citaat |
| tools/concierge-tools.ts:94,146 | "Clyde does not self-serve; bookings are application-gated" | WAAR | beleid | n.v.t. |
| tools/leadgen-tools.ts:173-211 | get_roi_estimate: ROI-%, jaarbesparing, terugverdientijd | VERBODEN | percentages als resultaat; vaste aanname max 15 uur/week | Geen gemeten ROI |
| tools/leadgen-tools.ts:22-24 | "Daley beoordeelt elke aanvraag persoonlijk binnen 48 uur", "30 min strategiegesprek" | ONBEWEZEN | procesbelofte | Eigen afspraak |
| tools/flagship-tools.ts:123-136 | tools search_products, build_routine, add_to_cart, create_ticket aan Clyde gekoppeld | VERHAAL | skincare-/supporttools in tool-set (engine strippen volgens commentaar :105-110) | Alleen als engine ze strip echt weg; niet geverifieerd |
| tools/ecommerce-tools.ts, support-tools.ts | skincare-producten en tickets | ONBEWEZEN | niet inhoudelijk gelezen (door engine gestript volgens flagship-tools.ts:105) | n.v.t. |
| tool-data.ts / skill-i18n.ts | skill-copy voor get_skills | ONBEWEZEN | skill-i18n.ts:140-379 niet regel voor regel getoetst; EN-tekst "Save hours per week on email management" is VERBODEN-achtig | Skills-lijst en status kloppen |
| skill-i18n.ts (en.email-management) | "Save hours per week on email management" | VERBODEN | uren bespaard | Inbox-classificatie + labels + dagelijkse digest |
| llms.txt:3 | "per-brand memory isolation" | ONBEWEZEN | memory-RLS org-breed, scheiding via client_id; lek gedicht 2026-10-11 | Scheiding per klant in code |
| llms.txt:3 | "EU-native, AVG and EU AI Act ready" | ONBEWEZEN | geen DPIA/conformiteitsdocument in repo; taalmodel in VS | Data, servers, database in EU |
| llms.txt:3 | "Max 10 new partnerships per year" | ONBEWEZEN | tegenstrijdig met concierge-kb.ts:88 (20) | zie boven |
| llms.txt:5 | "Sindy ... runs 4 brands and 3 Instagram accounts autonomously with all 10 live skills active" | VERBODEN | "autonomously" + SKC-cijfers uit mockup; 10 skills actief klopt (DB) | 10 skills actief; Sindy keurt goed |
| llms.txt:5 | "persistent AI colleague ... learns each brand over time ... per-brand voice" | VERHAAL | verhaal: AI-collega van je bureau, werkt in een kring met controle; geen vermelding kring | zie boven |
| llms.txt:16 | "4-layer memory (Vandaag / Deze maand / Archief / Wie het merk is) ... Per-brand isolation via Supabase RLS. Nightly dream consolidation." | ONWAAR | geheugentypes episodic/semantic/procedural; RLS is org-breed; geen dream | Memories + kernblokken; consolidatie-cron dagelijks |
| llms.txt:18 | Founding "unlimited workspaces" | VERHAAL | besluit 2026-10-12: 15 werkruimtes inbegrepen + EUR 299 per extra | Bestand nog oude formulering (code maxClients -1) |
| llms.txt:22 | "Case: ... all 10 live skills active. The proof case." | ONBEWEZEN | geen meetbaar resultaat | Eerste klant, 10 skills actief |
| llms.txt:33 | Email "Gmail inbox classification, smart labels and a daily digest" | WAAR | gmail.ts, emailManagement live | (telling) |
| llms.txt:34 | ManyChat DM live | ONBEWEZEN | zie concierge-kb.ts:20 | Social Command Center |
| llms.txt:35 | Reporting "cross-platform KPIs" | NIET-LIVE | "analytics compleet" is richting (spec) | Weekrapporten live; analytics deels |
| llms.txt:36 | SEO/GEO live | WAAR | skills.ts | (telling) |
| llms.txt (geheel) | mist kring, klantdashboard, drie ingangen, post-DM-lead, controle per taak, EU-zin | VERHAAL | n.v.t. | Zie VERHAAL-lijst onderaan |
| llms-full.txt:7 | "EU AI Act compliant ahead of the August 2026 deadline" | ONBEWEZEN | geen compliance-bewijs in repo; datum in verleden | n.v.t. |
| llms-full.txt:11 | "Sindy is the first Founding Member (spot 1 of 10)" | ONBEWEZEN | niet in DB getoetst | n.v.t. |
| llms-full.txt:22 | "Compliance: AVG by design, EU AI Act ready, self-hosted EU infrastructure" | ONBEWEZEN | zie boven | n.v.t. |
| llms-full.txt:26-29 | "Clyde is a persistent AI colleague, not a chatbot ... 4-layer memory ... nightly dream process" | ONWAAR | zie llms.txt:16 | zie boven |
| llms-full.txt:28 | "Named identity across ... website, dashboard, WhatsApp, Telegram" | WAAR | spec: Clyde in elk scherm, WhatsApp + Telegram (bureau) | (telling) |
| llms-full.txt:31 | "Per-brand isolation via Supabase Row Level Security. No cross-brand leakage." | ONWAAR | RLS org-breed (`is_org_member`); client-user policy zonder filter; lek ISO18 pas gedicht 2026-10-11 | Scheiding via client_id in RPC en code, getest 12/12 |
| llms-full.txt:32 | "Self-hosted EU infrastructure for AVG and EU AI Act compliance" | VERHAAL | taalmodel bij Anthropic (VS) | EU voor data/servers/database |
| llms-full.txt:33 | WhatsApp: vragen over content/resultaten, SEO-weekrapport vrijdag, Clyde meldt afwijking/goedkeuring | WAAR | spec: weekrapport SEO op WhatsApp, Clyde op WhatsApp | (telling) |
| llms-full.txt:34 | "content agenda that looks a year ahead" | ONBEWEZEN | niet teruggevonden | Strategielaag met doelen en pijlers is live |
| llms-full.txt:40 | Social Media "Suitable for Instagram, Facebook and LinkedIn" | NIET-LIVE | publiceren vandaag IG + LinkedIn; Facebook niet in prod | Publiceren IG en LinkedIn |
| llms-full.txt:45-48 | "Hashtag research", "Carousel and story builder", "AI analyzes trending topics" | ONBEWEZEN | niet individueel getoetst | Captions, planning, kalender |
| llms-full.txt:60 | Blog "Automatic publication to website" | ONBEWEZEN | destinations per klant; /blog-factory/destinations niet voor elke org | Blog Factory live, publicatie per bestemming |
| llms-full.txt:65-77 | Ad Manager "(Live)" en tegelijk "Status: coming soon." (regel 77) | ONWAAR | skills.ts:155 live; regel 77 spreekt zichzelf tegen | Ad Manager is live op Meta |
| llms-full.txt:72 | "Multi-format output (Stories, Feed, Reels)", "Competitor ad library research" | ONBEWEZEN | niet individueel getoetst | n.v.t. |
| llms-full.txt:94 | Voice Agent "Built on ElevenLabs" | NIET-LIVE | skills.ts:139 coming_soon; status juist vermeld | Richting |
| llms-full.txt:108-116 | Lead Qualifier "CRM routing based on qualification" | ONWAAR | geen CRM-koppeling in src | Scoring + inbox |
| llms-full.txt:134-145 | ManyChat: "Conversation flows with branching", "performance analytics per trigger" | ONBEWEZEN | niet getoetst | zie boven |
| llms-full.txt:149-156 | Reporting "Real-time KPI dashboards", "Cross-platform analytics (social, web, sales)" | NIET-LIVE | "analytics compleet" is richting | Weekrapporten en digest live |
| llms-full.txt:162-172 | SEO: "Google AI Overviews" citaties, keyword ranking, Core Web Vitals, competitor keywords | ONBEWEZEN | CWV-cron en GEO bestaan; AI Overviews niet getoetst | SEO/GEO live |
| llms-full.txt:176-183 | Research "continuous", "monitors trends" | ONBEWEZEN | research live; continu niet getoetst | Research per verzoek/routine |
| llms-full.txt:196 | Clyde "Knowledge base with search" | NIET-LIVE | kennisbank als nette weergave is richting | Kennis zit in memories en kernblokken |
| llms-full.txt:217 | Founding "Unlimited workspaces (no cap)" | VERHAAL | besluit: 15 werkruimtes inbegrepen + EUR 299 per extra | Bestand moet worden gelijkgetrokken |
| llms-full.txt:255-257 | SKC-accounts "circa 50 / 30 / 20 percent of content volume" | VERBODEN | volumecijfers; bron ontbreekt | Drie accounts, elk eigen stem |
| llms-full.txt:271 | "One Clyde, 3 workspaces, shared portfolio memory" | ONWAAR | SKC is 1 client met 3 account_keys (DB), niet 3 werkruimtes; strijdt met "per-brand isolation" | Eén klant met drie accounts |
| llms-full.txt:278 | "Sindy approves in her own dashboard before anything goes live" | WAAR | klantportaal /client/* | (telling) |
| llms-full.txt:282-292 | 4 lagen (24h hot cache, 30 dagen, archief, identiteit) + "dream consolidation ... Connections that survive multiple nights" | ONWAAR | geen lagen/venster van 24u of 30 dagen in code; consolidatie = cluster-merge + decay + archivering | Dagelijkse consolidatie, decay en archivering |
| llms-full.txt:294 | "24-hour SLA on full export or full deletion" | ONBEWEZEN | geen exportflow in src/app | Op verzoek, handmatig |
| llms-full.txt:300 | Apply "8 fields" | ONBEWEZEN | tegenstrijdig met concierge-kb.ts:114 (9) en :372 | zie boven |
| llms-full.txt:318 | "Per-brand data isolation via Supabase Row Level Security" | ONWAAR | zie :31 | zie boven |
| llms-full.txt:319 | "EU AI Act transparency ... voice agent greeting identifies as AI" | NIET-LIVE | Voice Agent niet live | Chatbot meldt zich als AI |
| llms-full.txt:320 | "Self-hosted EU infrastructure (Hetzner Amsterdam region)" | ONBEWEZEN | Hetzner heeft geen Amsterdam-regio (Falkenstein/Nuremberg/Helsinki); VPS 91.98.143.60 is Hetzner | VPS bij Hetzner (EU), Supabase-regio niet getoetst |
| llms-full.txt:322 | "No data leaves the EU for training or inference" | ONWAAR | taalmodel standaard Anthropic (VS) (spec) | Data/servers/DB in EU; taalmodel in VS |
| llms-full.txt:323-324 | "DPA available", "DPIA covers all 6 active skill categories" | ONBEWEZEN | geen DPIA in repo | n.v.t. |
| llms-full.txt:335,343,345 | kennisbank-slug en omschrijving "AI medewerker voor marketing", "AI Marketing Medewerker" | VERBODEN | woordregel AI-medewerker | Term is AI-collega |
| llms-full.txt:333 | "opschalen zonder extra fte" | VERBODEN | "vervangt personeel"-framing | Clyde neemt werk weg |
| llms-full.txt:368 | HowTo: "AI-collega die zelfstandig meedraait" | VERHAAL | verhaal: controle per taak | Autonomie per taak instelbaar |
| llms-full.txt:372 | Apply "alleen je naam, e-mailadres en eventueel je bedrijfsnaam" | ONBEWEZEN | tegenstrijdig met 8/9 velden | zie boven |
| llms-full.txt:395 | "Prijzen worden halfjaarlijks herzien. Geen verborgen kosten" | ONBEWEZEN | beleid | n.v.t. |
| llms-full.txt:401 | "2 tot 50 klantmerken" | VERHAAL | ICP 5-15 fte; elders 5-20 merken | Intern tegenstrijdig |
| llms-full.txt:404 | "Volledig autonoom werken begint meestal in maand 2" | VERBODEN | "fully autonomous" + termijn niet gemeten | Autonomie per taak, ingesteld door het team |
| llms-full.txt:407 | "Per-merk data-isolatie via RLS. Geen cross-brand lekkage ... Hetzner Amsterdam. Voldoet aan AVG en EU AI Act" | ONWAAR | zie :31, :320 | zie boven |
| llms-full.txt:410 | "De merken weten niets van elkaar" | ONBEWEZEN | agency memory (in aanbouw) deelt juist tussen merken | Scheiding per klant, gedeeld bureaugeheugen komt |
| llms-full.txt:413 | platformlijst: Facebook, WordPress en Webflow, Google Ads, Calendly, Twilio, "alle gangbare rapportagetools via API" | ONWAAR | geen Webflow/Twilio/Google Ads/Mailchimp in src; Calendly alleen kickoff-embed | IG + LinkedIn publiceren, Meta Ads, Gmail, ElevenLabs gepland |
| llms-full.txt:416 | "Clyde genereert content autonoom ... Clyde leert van elke review" | VERHAAL | zie :404; leren niet gemeten | Controle per taak; feedback als memory |
| llms-full.txt:419 | Founding via Slack, prioriteit bij nieuwe vaardigheden | ONBEWEZEN | Slack waar (founder_slack); prioriteit niet | Founder-Slack |
| llms-full.txt:398 | "alle tiers maandelijks opzegbaar" | ONBEWEZEN | contractvoorwaarde, niet in code | n.v.t. |

## Verhaal-gaten (chatbot en llms mist dit vrijwel overal)

- Kring doel, research, agenda, uitvoering, analytics: niet aanwezig in persona, kennis of llms.
- Teamleden toegewezen aan klanten: alleen ecommerce-kb.ts:88 zijdelings.
- Klant van het bureau: eigen dashboard, contentbibliotheek, aanvraag via formulier, eigen Clyde op WhatsApp: ontbreekt (alleen "Sindy approves in her dashboard", llms-full.txt:278).
- Drie ingangen (dashboard, WhatsApp, mobiele app in aanbouw): WhatsApp/Telegram staan in llms-full.txt:28,33; mobiele app ontbreekt.
- Van post naar DM naar lead (link-attributie): ontbreekt.
- Controle per taak + goedkeuring (observe/propose/act_report/full): vervangen door "autonoom" en "auto-publish".
- EU-zin met taalmodel in VS: ontbreekt; staat "no data leaves the EU".
- Geheugen als USP met 4 lagen en dream: opschonen.
- Persona zegt "50+ agencies" en "AI marketing professional" (clyde.ts:8-9).

Niet gelezen: skill-i18n.ts regel 140-379 (EN/ES-overlay), tools/ecommerce-tools.ts, tools/support-tools.ts inhoud. Persona-index.ts is 5 regels import.
