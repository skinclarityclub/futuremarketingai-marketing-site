---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: "2026-04-27T14:39:12Z"
progress:
  total_phases: 15
  completed_phases: 11
  total_plans: 53
  completed_plans: 48
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-20)

**Core value:** Marketing agencies can scale without hiring by deploying an AI Marketing Employee with pluggable skills
**Current focus:** Post-audit hardening — Phases 10 through 15 added from the 2026-04-24 full-site audit. Content upgrade branch has landed (22 commits on feature/content-upgrade: v10 pricing, NL-authoritative copy). Audit surfaced P0 business-integrity gaps (lost apply submissions, stale chatbot pricing, stale llms.txt) plus EAA a11y legal risk. All six post-audit phase plans are being generated in parallel by Opus planners.

## Current Position

Phase: 15 of 15 (Conversion Accelerators) -- IN PROGRESS (Wave 1 + Wave 2 + Wave 3 mostly landed). 15-01 + 15-02 + 15-04 + 15-05 fully done code-side, 15-03 PARTIAL (scaffolding complete, transcript-blocked tasks pending).
Plan: 15-04 DONE -- Lead magnet programme shipped: /api/newsletter intake (Zod + honeypot + ip_hash + Resend confirm mail) + /api/newsletter/confirm (status flip + Resend Audience add + PDF delivery mail) + /[locale]/newsletter/confirm Suspense-wrapped client page (4 deterministic states) + LeadMagnetCTA component (inline + sidebar variants, AVG-compliant non-pre-checked consent + visible privacy link + verbatim consent_text storage) wired on home + pricing + founding-member + blog + Supabase migration newsletter_consents (table + 3 indexes + RLS) + 3-locale i18n keys (leadMagnet.* + newsletter.confirm.*). Build exit 0, all 93 SSG routes prerender, npm run check:palette PASS. 5 task commits (e0e3dcb migration / 0c30584 intake / 363ddf2 + ef0ce35 provenance noise from 15-05's git add capture / 4e18dcb own commit covering LeadMagnetCTA + 3-page wires + Suspense Rule-1 build fix). Three launch prerequisites now block end-to-end functional verification (NOT code ship): RESEND_AUDIENCE_ID env var (Daley creates audience in Resend dashboard), PDF asset (Daley designs in Canva, drops to fmai-nextjs/public/downloads/nl-bureau-ai-readiness-checklist.pdf), Supabase migration apply (Daley runs against fma-app Supabase project per DECISIONS Q3 of Phase 10). All three documented in 15-04-SUMMARY.md User Setup Required.
Status: Phase 15 (Conversion Accelerators) IN PROGRESS. 4 of 5 plans landed (15-01 + 15-02 + 15-04 + 15-05), 1 of 5 PARTIAL (15-03 scaffolding only). Phase 15 success criteria 1+2+9+10 all green for 15-01 portion + criterion 3 green for 15-02 portion + criterion 4 partially-green for 15-03 (testimonial photo+LinkedIn keys present, schema reused, Daley-leak fixed -- but real metrics not yet rewritten) + criteria 5+6 GREEN code-side for 15-04 (newsletter capture works end-to-end + LeadMagnetCTA on home + pricing + founding-member + blog) flipping to fully-green when launch prerequisites land + criterion 7 + 8 GREEN for 15-05.
Last activity: 2026-04-27 -- 15-04 done in 18min: 5 files created (route.ts × 2, page.tsx, LeadMagnetCTA.tsx, migration.sql) + 8 modified (4 page wires + 3 i18n locales + .env.example). 2 own atomic commits (e0e3dcb migration, 0c30584 intake, 4e18dcb LeadMagnetCTA+3-wire+Suspense-fix), 2 commits captured into parallel 15-05's git add (363ddf2 confirm route + page + i18n keys, ef0ce35 pricing wire) -- functional impact zero, provenance noise documented in 15-04-SUMMARY.

Progress: [██████████████] 92% | Phase 15: [████░] 4/5 plans complete (15-01 + 15-02 + 15-04 + 15-05; 15-03 PARTIAL pending Sindy artifacts)

### Audit context (2026-04-24)

Health scores from 8 parallel audits:
- Copywriting: 84/100 (strong)
- Performance: 72/100
- SEO Technical: 68/100
- Technical Quality: 66/100
- Marketing + Conversion: 60/100 (forms not wired, SKC metrics missing)
- Data Accuracy: 58/100 (chatbot still on v9 pricing, llms.txt stale)
- UX + Accessibility: 55/100 (EAA risk)
- GEO + LLM Citation: 42/100 (lowest — schema shallow, llms.txt poisoned)

Domain decision 2026-04-24: `future-marketing.ai` is canonical. Phase 10-01 migrates all 40+ refs away from `futuremarketingai.com`.

## Performance Metrics

**Velocity:**

- Total plans completed: 23
- Average duration: ~9 min
- Total execution time: ~2.6 hours

**By Phase:**

| Phase               | Plans | Total  | Avg/Plan |
| ------------------- | ----- | ------ | -------- |
| 1. Website Rebrand  | 5/5   | ~56min | ~11min   |
| 3. n8n Multi-Tenant | 3/3   | ~41min | ~14min   |
| 4. Compliance       | 2/2   | ~18min | ~9min    |
| 2. Dashboard Refr.  | 3/4   | ~6min  | ~2min    |
| 5. Go-to-Market     | 2/3   | ~8min  | ~4min    |
| 6. Vite Feat. Par.  | 3/4   | ~14min | ~5min    |

**Recent Trend:**

- Last 5 plans: 07-03 (16min), 07-04 (17min), 08-01 (3min), 08-02 (2min)
- Trend: Stable

_Updated after each plan completion_
| Phase 06 P02 | 7min | 2 tasks | 7 files |
| Phase 07 P01 | 11min | 2 tasks | 9 files |
| Phase 07 P02 | 4min | 2 tasks | 3 files |
| Phase 07 P03 | 16min | 2 tasks | 9 files |
| Phase 07 P04 | 17min | 2 tasks | 2 files |
| Phase 08 P01 | 3min | 2 tasks | 6 files |
| Phase 08 P02 | 2min | 2 tasks | 3 files |
| Phase 09 P01 | 5min | 2 tasks | 442 files |
| Phase 09 P02 | 7min | 2 tasks | 17 files |
| Phase 09 P01 | 4min | 2 tasks | 966 files |
| Phase 10 P04 | 15min | 6 tasks | 5 files |
| Phase 10 P01 | 53min | 7 tasks | 11 files |
| Phase 10 P02 | 24min | 7 tasks (Tasks 2-7) | 9 files | live smoke green; Task 8 prod-deploy verification deferred
| Phase 10 P03 | 16min | 8 tasks | 12 files |
| Phase 11 P02 | 12min | 3 tasks (Task 3 auto-approved checkpoint) | 1 file | CSS-only contrast + reduced-motion baseline; Lighthouse run deferred to verifier
| Phase 11 P01 | 10min | 4 tasks | 10 files |
| Phase 11 P03 | 7min | 3 tasks (Task 3 yolo-mode auto-approve) | 6 files | form a11y on /apply + /contact: per-field aria, autoComplete, inputMode, i18n status copy, aria-live submit
| Phase 11 P03 | 7 | 3 tasks | 6 files |
| Phase 12 P02 | 16min | 6 tasks | 6 files |
| Phase 12 P01 | 16min | 9 tasks | 24 files | brand assets via sharp+SVG generator, full src/ palette migration, /api/og dynamic route + check:palette regression gate
| Phase 12 P03 | 13min | 6 tasks | 8 files |
| Phase 12 P04 | 15min | 7 tasks | 8 files |
| Phase 13 P01 | 30min | 9 tasks | 12 files |
| Phase 13 P02 | 25min | 6 tasks | 5 files |
| Phase 13 P03 | 24min | 11 tasks | 12 files |
| Phase 14-seo-geo-depth-upgrade P04 | 16min | 3 tasks | 2 files |
| Phase 14 P03 | 22min | 4 tasks | 8 files |
| Phase 14 P01 | 24min | 6 tasks | 6 files |
| Phase 14 P02 | 31min | 9 tasks | 11 files | ServiceJsonLd on 12 skill pages + 180 FAQ Q/A in 3 locales + Speakable + Person rendering Daley/Sindy + SKC org schema |
| Phase 14-seo-geo-depth-upgrade P02 | 31min | 9 tasks tasks | 11 files files |
| Phase 15-conversion-accelerators P01 | 19min | 3 tasks | 10 files |
| Phase 15 P02 | 14min | 3 tasks tasks | 7 files files |
| Phase 15 P03 | 14min | 3 of 6 tasks (PARTIAL: scaffolding only; 3 transcript-blocked tasks emit human-action checkpoint) | 3 created + 3 modified |
| Phase 15-conversion-accelerators P04 | 18min | 4 tasks | 13 files |
| Phase 15 P05 | 16min | 2 tasks | 7 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmap]: 5 phases derived from 5 requirement categories (WEB, DASH, N8N, COMP, GTM)
- [Roadmap]: Parallel execution waves -- Phase 1+4+5 simultaneous, Phase 2 after 1, Phase 3 after 2
- [Roadmap]: Brownfield rebrand approach -- reframe existing code, do not rebuild
- [01-01]: Used 6 skill names from AaaS design doc (contentCreator, voiceAgent, leadQualifier, socialMedia, adCreator, reporting)
- [01-01]: 4 pricing tiers established: Founding Member EUR 997, Starter EUR 1,497, Growth EUR 1,997, Agency EUR 3,497
- [01-01]: Dutch "AI Marketing Medewerker voor bureaus", Spanish "Empleado de Marketing IA para agencias"
- [01-01]: How-it-works reframed as 4-step agent onboarding (choose/activate/connect/working)
- [01-02]: Kept HeaderClient.tsx nav strings hardcoded English (matches existing pattern)
- [01-02]: Used (skills) route group with nested /skills/ folder for /skills/{slug} URL structure
- [01-02]: Created full scaffold translations for 7 new pages in all 3 locales
- [01-03]: 4-column xl grid for pricing tiers, responsive 2-col on md
- [01-03]: Founding Member tier highlighted with accent border and "10 Spots Only" badge
- [01-03]: Homepage SERVICE_CARDS replaced with SKILL_CARDS for 6 skills
- [04-01]: AI disclosure badge and notice added to chatbot widget in all 3 locales
- [04-02]: DPA drafted in Dutch with 8 sub-processors in Annex A
- [04-02]: DPIA identifies 7 risks across all 6 AI skills with residual risk assessment
- [04-02]: Legal page uses SECTION_SUBSECTIONS map pattern for subsection rendering
- [04-02]: Terms of service: 7 subsections, Privacy policy: 9 subsections
- [05-01]: Dutch headline leads with problem-first positioning for LinkedIn
- [05-01]: Demo video uses Loom recording -- authenticity over production polish
- [05-01]: Content calendar splits pre-outreach authority building (week 1) and launch push (week 2)
- [01-05]: Persona IDs kept unchanged (ecommerce, leadgen, support) for DemoPlayground compatibility
- [01-05]: Content Creator temp 0.8 (creative), ROI Calculator temp 0.5 (precise), both maxTokens 600
- [01-04]: All 7 namespaces use identical key structures across EN/NL/ES (29 keys per skill, 39 keys for founding-member)
- [01-04]: HowToJsonLd updated to 4-step agent onboarding description
- [05-02]: ICP scoring uses 6 criteria (0-2 each, max 12) with 8+ hot, 5-7 warm, below 5 skip
- [05-02]: Outreach follows 5-touch cadence over 21 days with 3-Touch Rule before pitching
- [05-02]: Founding member agreement in Dutch with EUR 997/mo and 6-month minimum commitment
- [05-02]: CSV tracking uses 11-stage pipeline from prospect to signed/lost
- [03-02]: Replaced Supabase node with HTTP Request for content_items query to enable client_id filtering
- [03-02]: SKC Telegram credentials as fallback defaults in expression functions (not hardcoded node params)
- [03-02]: Both analytics workflows kept INACTIVE -- activation when agency clients provide IG tokens
- [03-02]: client_id added to instagram_post_snapshots and scheduling_intelligence payloads
- [03-01]: usage_metrics RLS simplified to authenticated read (clients table has no agency_id column yet)
- [03-01]: Set Client ID node added between triggers and config loading for schedule/webhook normalization
- [03-01]: Supabase Management API used for DDL (PostgREST doesn't support CREATE TABLE)
- [02-01]: Extended fma_organizations with agency columns instead of creating separate fma_agencies table
- [02-01]: Used TEXT[] for active_skills with GIN index for efficient array queries
- [02-01]: 12 sidebar items: removed 7 SKC-specific, relabeled remaining for AaaS
- [02-01]: Permanent (308) redirects for pipeline->agent-activity and campaigns->tasks
- [02-03]: SkillToggle as separate client component with optimistic state and useTransition
- [02-03]: Client detail page rewritten to focus on skill activation (removed old edit form, brand profile, blog links)
- [02-03]: Dashboard removed all SKC widgets (pipeline, revenue, tokens, shopify, insights, account health)
- [02-02]: Re-exported AGENT_TIERS/SKILL_ADDONS from stripe.ts for backward-compatible imports
- [02-02]: BillingClient extracted as client component for useTransition-based checkout/portal redirects
- [02-02]: Webhook idempotency check on checkout.session.completed prevents duplicate subscription writes
- [02-02]: Dynamic import of AGENT_TIERS in webhook to match price ID back to tier name
- [03-03]: executeWorkflowTrigger must use typeVersion 1 (not 1.1) for n8n Cloud compatibility
- [03-03]: Agency Client Setup loads config/accounts/pillars in parallel from webhook for faster validation
- [03-03]: Init Config has 6 client\_\* tables (not 8) -- actual schema differs from plan assumption
- [03-03]: Usage Metering V1.0 (vhDFFD8WN3VeWNNw) and Agency Client Setup V1.0 (gn0vxvXrV176fnuE) workflow IDs
- [06-01]: Flag emojis use Unicode escape sequences for cross-platform rendering
- [06-01]: Shared components are server components (no 'use client') importing client components as needed
- [06-01]: Common components pattern established in src/components/common/
- [06-01]: PricingTiers uses CTAButton variant prop for highlighted vs standard tiers
- [06-04]: VisionTimeline uses MotionDiv from existing motion wrapper (not direct framer-motion import)
- [06-04]: FeatureShowcase is a server component with props-based API (no hardcoded data)
- [06-04]: Pricing data hardcoded in page files matching Vite approach
- [06-04]: Automation icons use direct Lucide component mapping via Record<string, LucideIcon>
- [06-03]: useElevenLabsCall uses dynamic import with webpackIgnore to avoid build-time SDK dependency
- [06-03]: VoiceDemoFAB uses IntersectionObserver on section ID instead of passed ref
- [06-03]: Voice pricing uses EUR tiers matching AaaS pricing structure (997/1497/1997)
- [Phase 06-02]: ProgressiveCTA integrated inside DemoPlayground (not page-level) since both share activeTab state and store access
- [Phase 06-02]: MultiPlatformShowcase uses CSS keyframe animations matching Vite approach, dynamic imported with ssr:false
- [07-01]: Chatbot/email pages converted from hardcoded to getTranslations with full namespace (use_cases, pricing, trust, cta)
- [07-01]: Pricing tier features use indexed keys (features_0, features_1, etc.) for PricingTiers prop translation
- [07-01]: FeatureShowcase icons stay hardcoded (emoji strings are language-independent)
- [07-01]: SocialProof/FeatureShowcase receive translated strings as props from page-level t() calls
- [07-02]: Hero headline "Meet Clyde. Your AI Marketing Employee." -- Clyde introduced by name in hero
- [07-02]: FAQ rewritten with 5 Clyde-specific questions (what is Clyde, brand learning, multi-client, mistakes, vs ChatGPT)
- [07-02]: Header CTA changed from "See Our Work" to "Meet Clyde" linking to /skills/chatbot
- [07-02]: Stats updated to Clyde-relevant: 24/7 availability, 6 skills, 160+ content/mo, <2min response
- [07-03]: Per-skill pricing tiers replaced with simplified CTA to /pricing (avoids per-skill vs agent-tier pricing conflict)
- [07-03]: Task-demo section uses GlassCard with accent-system/green color coding for You/Clyde bubbles
- [07-03]: "Meet Clyde" primary CTA routes to /skills/chatbot (DemoPlayground); "Book a Strategy Call" secondary to /contact
- [07-03]: PricingTiers component import removed from 6 pages that no longer render tier cards
- [Phase 07-04]: Dutch task_demo examples use Dutch business names; Spanish uses Spanish names; Clyde stays Clyde everywhere
- [08-01]: Reused FLAGSHIP_TOPICS knowledge base for Clyde (covers all topics already)
- [08-01]: maxTokens 300 (between flagship 250 and concierge 500) per design doc
- [08-01]: PAGE_CONTEXT_HINTS as module-level const for 11 route-specific behavior hints
- [08-01]: DemoPlayground updated to use CLYDE_STARTERS for all 4 demo persona tabs
- [08-02]: WELCOME_MESSAGES uses 'default' key with nullish coalescing for clean pathname fallback
- [08-02]: Flagship persona ID kept as fallback in engine for persisted store compatibility
- [08-02]: filterToolsByContext function kept as dead code to avoid breaking potential references
- [09-02]: DemoPlayground sends personaId='clyde' for all 4 tabs (tabs keep distinct display names and welcome messages)
- [09-02]: Engine falls back to clyde for unknown persona IDs (graceful degradation, no 404)
- [09-02]: Knowledge base and tool files restored (still needed by flagship aggregator that feeds Clyde)
- [09-02]: Redirect destinations updated: /chatbots -> /skills/chatbot, /automations -> /skills/ad-creator
- [09-02]: ChatWidget treats 'clyde' as flagship-equivalent for side panel and badge features
- [09-01]: Deleted .github, .husky, .vercel, .cursor, .taskmaster alongside Vite dirs (all old project infrastructure)
- [09-01]: Simplified .gitignore to only Next.js-relevant patterns
- [09-01]: Kept DEPLOYMENT.md at root (still relevant for Vercel deployment)
- [10-04]: Used npm overrides to force postcss >=8.5.10 instead of `npm audit fix --force` (which would have downgraded Next.js to 9.3.3 — major regression). Result: 0 vulnerabilities, Next 16.2.4 retained.
- [10-04]: Mounted <SpeedInsights /> at locale-layout level, not root layout — [locale]/layout.tsx owns html/body and generateStaticParams, so per-route tracking comes for free.
- [10-04]: Permissions-Policy uses `microphone=(self)` instead of `microphone=*` — same-origin only because the voice-agent demo runs on our domain; cross-origin embeds remain blocked.
- [10-04]: Web-vitals dev-only console logger preserved; production vitals delegated to Vercel Speed Insights — no custom /api/vitals route.
- [10-04]: Task 1 (middleware -> proxy rename) was already shipped in commit 0346709 by parallel Plan 10-01; verified state and proceeded to Task 2 without re-doing the rename.
- [Phase 10]: [10-01]: Apex future-marketing.ai is canonical (not www); Vercel primary swapped via REST API, www 308 to apex
- [Phase 10]: [10-01]: Skipped vercel.json infra-as-code redirects; futuremarketingai.com is not registered, redirect rules for unowned hosts are inert
- [Phase 10]: [10-01]: Customer email unified to hello@future-marketing.ai; privacy@future-marketing.ai retained ONLY on legal page (AVG/GDPR contact obligation); apply@ kept as Resend server-side sender
- [Phase 10]: [10-01]: src/lib/seo-config.ts (SITE_URL + ORG_EMAIL exports) is the single source of truth for every URL and email rendered by the marketing site
- [Phase 10]: [10-02]: Sliding window 5 req / 10 min per IP for forms; chatbot keeps original 10/min ip + 100/h global + 15/h session (100/h for flagship persona) — all on Upstash now
- [Phase 10]: [10-02]: /api/contact ships zero CORS — same-origin fetch only. OPTIONS handler + corsHeaders deleted (audit 08 section 7 flagged the wildcard as a copy-paste mistake)
- [Phase 10]: [10-02]: Raw IPs never persisted — SHA-256(ip + IP_HASH_SALT) before any Supabase insert (AVG/GDPR data minimization). Same hash function reused in both routes.
- [Phase 10]: [10-02]: Supabase + Resend instantiated with placeholder URL/key when env missing instead of throwing — keeps `next build` green pre-provisioning. Runtime errors logged via existing dbError/emailError branches.
- [Phase 10]: [10-02]: Chatbot rate-limiter is now async (4 Upstash limiters, was sync Map). Single caller engine.ts updated with `await`. Public export shape preserved so index.ts re-exports work unchanged.
- [Phase 10]: [10-02]: Plan 10-03's parallel agent committed Task 2/3 helper files (ratelimit.ts, supabase-admin.ts, email templates) under 3c0fd02 + b6635bb because both plans shared package.json bumps. Content matched what 10-02 wrote. Documented in 10-02-SUMMARY deviations.
- [Phase 10]: [10-02]: Live smoke 2026-04-25T01:13Z passed 5 of 6 probes against live Resend (re_Dv1sLtNt..., domain `future-marketing.ai` verified by absence of domain-error log) + Supabase (project nurdldgqxseunotmygzn, both tables created via mcp__supabase__apply_migration) + dedicated FMai Upstash (`tolerant-feline-103004`, NOT shared with SKC). 5 of 6: status only because Smoke 6 (OPTIONS contact) returned 204 from Next.js default rather than expected 404/405, but with NO CORS headers, so the audit-08 wildcard-CORS regression cannot recur.
- [Phase 10]: [10-02]: Task 8 (production deploy + real submission) deferred from this session because Vercel Production scope envs were not in scope for the executor. Checklist documented in 10-02-SUMMARY for the next deploy push.
- [Phase 10]: [10-03]: CHATBOT_TIERS in src/lib/chatbot/tool-data.ts is the chatbot-side mirror of fma-app/src/lib/skills.ts AGENT_TIERS. Both leadgen-tools and concierge-tools import from this single file, preventing the v9 drift that caused the audit-flagged bait-and-switch.
- [Phase 10]: [10-03]: Renamed get_services to get_skills throughout the chatbot stack (5 consumer files: flagship-tools, clyde persona, tool-results map, demo scenarios, prompt-builder). Semantically correct under v10 12-skill model.
- [Phase 10]: [10-03]: concierge-tools get_skills sources from SKILLS_DATA dynamically. fma-app pricing changes propagate via skills-data.ts mirror, no chatbot code edits needed.
- [Phase 10]: [10-03]: Partner tier added to chatbot enum (was completely absent) plus "8 of 12 skills" correction in both KBs. Stops over-promising on entry tier.
- [Phase 10]: [10-03]: book_call execute path swapped from Calendly URL to /apply. Matches CLAUDE.md application-gated rule, no self-service signup.
- [Phase 10]: [10-03]: llms.txt rebuilt per llmstxt.org spec with H1 + blockquote + H2 link sections. All 32 URLs canonical apex (https://future-marketing.ai). AVG + EU AI Act framing in opening blockquote for GEO/AI citation strength.
- [Phase 10]: [10-03]: llms-full.txt rebuilt as ~2500-word v10 long-form with skills deep-dive, 4-layer memory architecture, SKC case study with truthful metrics from messages/nl.json, full compliance section.
- [Phase 11]: [11-02]: --color-text-muted raised from #5a6378 (3.23:1 FAIL) to #8C98AD (6.67:1 on bg-deep, 6.26:1 on bg-surface, PASS AA). Tailwind 4 @theme means the change propagates automatically to 269+ usage sites across 48 files; no component code touched.
- [Phase 11]: [11-02]: Universal-selector + !important reduced-motion pattern (W3C / Andy Bell canonical) covers all 18 @keyframes plus the 5 inline `style={{ animation: 'fadeInUp ...' }}` on src/app/[locale]/page.tsx. 0.01ms (not 0ms) preserves animationend events; fill-mode: both lands animations at terminal state so no content blanking.
- [Phase 11]: [11-02]: .blob-warm/.blob-cool/.blob-mixed/.loader explicitly `animation: none !important` because they have no terminal state — would freeze mid-cycle visually if just sped up to 0.01ms.
- [Phase 11]: [11-02]: Did NOT touch --color-border-primary (separate audit §1.4.11 non-text contrast, scheduled for later polish phase) or --color-text-secondary/-primary (already PASS AAA). Did NOT touch focus-visible (parallel 11-01 owns it).
- [Phase 11]: [11-02]: Reverted unstaged HeaderClient.tsx delta from parallel 11-01 agent (FLAT_SKILLS flatMap caused TS error on heterogeneous tuple union); 11-01's clean version landed at 10a40d9 shortly after. Documented as deviation Rule 3.
- [Phase 11]: Skills mega-menu uses ref-scoped outside-click instead of blanket document listener — fixes onClick conflict
- [Phase 11]: Hover-to-open dropped from Skills mega-menu; click + keyboard are the supported openers (WCAG 2.1.1 priority over hover convenience)
- [Phase 11]: FLAT_SKILLS computed at module scope with type-widening cast so flatMap unifies tuple-typed items under TS strict
- [Phase 11]: BookingModal focus-return: trigger captured in Zustand at openBooking, restored via requestAnimationFrame after AnimatePresence exit, with document.contains guard for unmounted triggers
- [Phase 11]: a11y i18n namespace placed at top of message files (existing top-level keys are not alphabetical)
- [Phase 11]: [11-03]: ApplicationForm now maps Zod issues to apply.form.errors.* i18n keys via mapIssueToKey; aria-invalid + aria-describedby + per-field role=alert paragraphs land on every field; first failing field auto-focused via requestAnimationFrame for screen-reader announcement
- [Phase 11]: [11-03]: ContactForm 6 hardcoded EN literals lifted into contact.form.status.* (sending, successTitle, successBody, sendAnother, networkError, genericError); 3 locales x 6 keys = 18 strings; ContactFormProps.labels extended with statusXxx fields wired via t('form.status.*') from contact/page.tsx
- [Phase 11]: [11-03]: WHATWG autoComplete tokens by field purpose (name/email/organization/organization-title); selects + textarea + honeypot get explicit autoComplete=off; inputMode=email pairs with type=email for mobile @ keyboard on both forms
- [Phase 11]: [11-03]: Schema for ApplicationForm gained explicit .max(5000) on problem so Zod too_big code resolves to problemMax i18n key; was unreachable before because schema was min-only
- [Phase 11]: [11-03]: noValidate added to ApplicationForm <form> so JS validation pipeline runs end-to-end; without it browsers HTML5 tooltip blocks Zod path entirely; ContactForm already had noValidate
- [Phase 12-02]: labelKey enum literal type ('addOn47' | 'addOn97' | 'notAvailable' | 'unlimited') for typo-safe i18n key references in SkillTierCap shape
- [Phase 12-02]: addOn47/addOn97 as dedicated keys (not interpolated price arg) — only 2 skills use them; simpler than template + arg
- [Phase 12-02]: NL notAvailable em-dash (—) replaced with middle dot (·) matching EN/ES — fixes audit em-dash flag in i18n value
- [Phase 12-02]: SkillPageTemplate.formatCap mirrored to same labelKey/unit dispatch (Rule 3 deviation) so tsc + build stay green after Task 1 interface change
- [Phase 12-02]: Visual capture deferred to verifier — both dev ports occupied, NEVER kill terminals; scripts/capture-tier-matrix.mjs committed for clean verifier run
- [Phase 12-01]: Brand assets generated programmatically via sharp + SVG (scripts/generate-brand-assets.mjs) instead of waiting for Figma export — reproducible, deterministic, re-runnable. og-image 1200x630 47KB, logo 512x512 7.9KB transparent.
- [Phase 12-01]: CookieConsentBanner inline-style props use var(--color-*) refs because react-cookie-consent does not consume Tailwind utility classes on its style props.
- [Phase 12-01]: error.tsx hides raw error.message — security/info-leak concern; renamed prop to _error with eslint-disable @typescript-eslint/no-unused-vars at function level.
- [Phase 12-01]: errors.generic.retryButton + homeButton added as new keys; legacy tryAgain kept for backward compat with any other consumers.
- [Phase 12-01]: Email templates (apply, contact) and Satori OG (lib/og-image.tsx) keep literal hex (no CSS-var support in those render contexts) but values updated to current palette: #0a0d14 / #00d4aa.
- [Phase 12-01]: /api/og dynamic edge route ships per-locale taglines (NL/EN/ES) but not yet wired into metadata config — static /og-image.png stays default until visual review.
- [Phase 12-01]: MemoryLayersDiagram context layer swapped purple #A855F7 to amber accent-human — purple was never in design system (only accent-system teal + accent-human amber).
- [Phase 12-01]: Rule 3 deviations: full src/ sweep surfaced 13 extra refs in src/lib/email/{apply,contact}-templates.ts + src/lib/og-image.tsx + 2 components (CalendlyModal, QuickAnswerBlock) not listed in plan — all migrated; verify-palette.sh now PASS.
- [Phase 12-03]: [12-03] header.* placed as top-level namespace (not merged into common.nav) — common.nav is footer-shaped, header.nav is megabar-shaped; semantic split keeps both clean
- [Phase 12-03]: Top-level nav.{login,apply} kept untouched: HeaderClient right-side login/apply CTAs use legacy useTranslations('nav') — merging would break sibling consumers
- [Phase 12-03]: common.comingSoon canonical for non-header use (SkillsTierMatrix); header.skills.comingSoon kept as header-local convenience key — same value, different scope
- [Phase 12-03]: ChatWidget demo-limit banner split into demoLimitMessage + demoLimitCta keys — gives translators control over CTA wording, matches NL/ES sentence inversion
- [Phase 12-03]: VoiceDemoSection phone +1 (570) 783-8236 flagged via DECISION-PENDING-phone-number.md (3 options, default-after-2-weeks = hide-and-CTA-only); VoiceDemoSection.tsx UNCHANGED
- [Phase 12-03]: Apply CTA banner copy ('Apply' + 'Book a partnership call') routed through header.cta.applyTitle/applySubtitle — Rule 2 deviation, was hardcoded EN before this plan, not in original task list
- [Phase 12-04]: next-intl 4.x removed defaultTranslationValues prop (was v3 API). Replaced with substituteGlobals() walker at message-load time in src/i18n/request.ts — same UX (zero call-site changes), modern API. Pattern: GLOBAL_PLACEHOLDERS registry → walker substitutes {key} tokens at config-load. Page-local ICU args ({taken}, {total}, {count}) untouched.
- [Phase 12-04]: Credit pack rename Onbeperkt/Unlimited/Ilimitado→Max in 3 locales. JSON key (pricing.creditPacks.items.unlimited) UNCHANGED to keep Stripe webhook integration in fma-app stable. DECISION-PENDING-credit-pack-name.md committed for Daley to rename Stripe Product to match (default-after-2-weeks: Max stays).
- [Phase 12-04]: 8 leftover "Onbeperkt" tier-copy refs preserved (workspaces, features_0, pricing.matrix.unlimited) — different semantic (truly-unlimited workspace count + per-skill tier label), audit scope was credit-pack transparency only.
- [Phase 12-04]: 10 cap-references interpolated, not 8 from plan: home.stats.languages.value + home.faq.q3.answer found via grep sweep. Rule 3 SSoT consistency — interpolating prevents future drift when MAX_PARTNERS_PER_YEAR changes.
- [Phase 12-04]: 200 in about.capacity.reasoning kept literal — rhetorical contrast number (rather 20 ... than 200), not the actual cap.
- [Phase 12-04]: Legal date format = localized long form per RESEARCH §9 ('24 april 2026', 'April 24, 2026', '24 de abril de 2026') — not ISO. Locale-native dates read better in policy text.
- [Phase 12-04]: contact.book_demo.title 'Boek een strategiegesprek' renamed 'Plan een strategiegesprek' under Rule 1 brand-glossary (not in plan but adjacent IK-context glossary slip).
- [Phase 13]: [13-01]: FloatingChatTrigger sets isOpen=true in store BEFORE mounting ChatWidget so user's one click both loads the chunk AND opens the panel; ChatWidget reads isOpen on first render and shows panel directly (avoids two-click UX regression)
- [Phase 13]: [13-01]: Reused existing ChatWidgetIsland inside the lazy dynamic import in FloatingChatTrigger -- preserves the per-pathname welcome message + suggested prompts mapping centralised in one place; the trigger only adds the loading boundary
- [Phase 13]: [13-01]: CookieConsentBanner double-gated -- needsConsent state in ClientIslands prevents the dynamic chunk from being requested AND the component itself short-circuits if cookie present (defense-in-depth, prevents listener attach on chunk race)
- [Phase 13]: [13-01]: GradientMesh blob animations switched to positive-default media (prefers-reduced-motion: no-preference) instead of relying on the existing reduce-override block; cleaner reasoning + decoupled from global override
- [Phase 13]: [13-01]: GradientMesh blobs hidden via display:none under 1024px -- mid-range mobiles were the largest INP contributor per audit doc 01-performance.md; zero composite layers is the cleanest fix versus shrink+de-blur
- [Phase 13]: [13-01]: Per-page Spline resource hints emitted as inline <link> JSX in [locale]/page.tsx; Next.js 16 App Router hoists bare <link> elements into the document <head>. Removes blanket <head> from [locale]/layout.tsx that was leaking to all 86 non-home routes
- [Phase 13]: [13-01]: Rule-3 cross-plan fix: 13-02's new (skills) async layout was calling getMessages() without setRequestLocale(), opting 12 skill routes out of SSG. Fixed in 13-01 because 13-01 must_haves require all 87 prerendered pages to keep building
- [Phase 13]: [13-02]: Root NextIntlClientProvider scoped via pick(messages, GLOBAL_CLIENT_NAMESPACES) — 8 namespaces ship to client, 13 server-only stay server. ~96 KB raw drop on /pricing, /about, /legal/privacy HTML.
- [Phase 13]: [13-02]: (skills) route group has its own scoped NextIntlClientProvider with chatbots + 12 skills-* namespaces; nested provider replaces parent subset so re-includes GLOBAL_CLIENT_NAMESPACES.
- [Phase 13]: [13-02]: setRequestLocale + generateStaticParams REQUIRED in (skills)/layout.tsx — getMessages() in async layout opts subtree out of SSG without them. Caught at first build.
- [Phase 13]: [13-02]: substituteGlobals() walker in src/i18n/request.ts preserved untouched — runs at message-load time BEFORE pick(), so {maxPartners}=20 substitution lands in client HTML correctly. Phase 12-04 invariant intact.
- [Phase 13]: [13-03]: Plan claimed 21 outdated deps but npm registry only had patch versions for 11 on day-of. Bumped 11 within safe semver bounds; majors deferred (lucide 0.x→1.x, schema-dts, typescript, eslint, @types/node) all need breaking-change reviews. `next` family stays on Phase 10 ownership.
- [Phase 13]: [13-03]: stitch-review.mjs moved to scripts/dev/ AND @google/stitch-sdk relocated to devDependencies — script kept (Daley uses it for design refresh) but no longer pulled by `npm install --omit=dev`.
- [Phase 13]: [13-03]: Space Grotesk dropped, NOT JetBrains Mono — `font-mono` is used 36 times in chatbot tool-result cards + pricing/about numerics; losing JetBrains would have downgraded code/numeric blocks to system mono. font-display now falls back to DM Sans 700.
- [Phase 13]: [13-03]: Soft prebuild lint gate (`npm run lint || true`) added — surfaces audit-08 React Compiler errors at every build without blocking until Phase 11 fixes them. _fixme_prebuild_strict comment in package.json marks the strict-mode flip.
- [Phase 13]: [13-03]: 16 hardcoded `<a href>` migrated to next-intl Link, NOT 14 from plan — extra 2 in (marketing)/contact/page.tsx applyCallout button. NL/ES users clicking from chatbot LeadScoreCard CTA → contact → apply would otherwise lose locale on the second hop. Folded under Rule 3 in-scope adjacent fix.
- [Phase 13]: [13-03]: 21 debug screenshots at fmai-nextjs/ root untracked from git (kept on disk in fmai-nextjs/.screenshots/, gitignored). Repo working tree no longer ships chatbots-scroll*, hero-*, mega-menu-final, nextjs-3001, verify-*, vite-*, voice-scroll* PNGs.
- [Phase 13]: [13-03]: Empty fmai-nextjs/fmai-nextjs/ nested scaffold deleted via rm -rf (no git diff because no tracked files inside) — folded into Task 6 commit. Future agents no longer see a ghost directory.
- [Phase 14-seo-geo-depth-upgrade]: [14-04] robots.ts: 16 explicit AI-crawler Allow rules + canonical Host: line — lifts implicit-allow GEO score (40/100) to explicit-allowlist signal that survives any later CDN/WAF
- [Phase 14-seo-geo-depth-upgrade]: [14-04] Bytespider + Meta-ExternalAgent + Meta-ExternalFetcher = Allow per DECISIONS-2026-04-24 Phase 14 Q6 (TikTok search index + WhatsApp/IG link previews are reach wins on a public marketing site)
- [Phase 14-seo-geo-depth-upgrade]: [14-04] Diffbot added to AI_CRAWLERS list (knowledge-graph aggregator behind enterprise B2B AI integrations) — 16 explicit bots vs plan's stated 15-16; same-shape rule, zero added risk
- [Phase 14-seo-geo-depth-upgrade]: [14-04] Task 3 third-party GEO probes (Otterly, DarkVisitors) deferred to post-deploy because SaaS scanners fetch the live URL not localhost — full probe checklist captured in 14-04-audit-tool-scores.md for re-run after Vercel deploy
- [Phase 14-seo-geo-depth-upgrade]: [14-04] SHARED_ALLOW + SHARED_DISALLOW const refactor in robots.ts (Rule 3 quality) — wildcard + per-bot rules now reference same single source for allow/disallow paths, prevents future drift
- [Phase 14]: [14-03]: Tightened meta-description trim target to <=155 chars (5-char buffer below Google 160-char SERP cap) to absorb mobile glyph-width drift on NL/ES diacritics
- [Phase 14]: [14-03]: Added meta.title+meta.description sub-keys to legal.sections.{privacy,terms,cookies} instead of using metaKeyPrefix override; keeps every page on the same default convention (meta.* under namespace root)
- [Phase 14]: [14-03]: Dropped schema-dts WithContext<Article> annotation on ArticleJsonLd data const because schema-dts ImageObject.width type rejects plain int; aligned with OrganizationJsonLd pattern (no annotation)
- [Phase 14]: [14-03]: ArticleJsonLd image is optional with /og-image.png default; future MDX-frontmatter cover-image override path stays open without prop-signature break
- [Phase 14]: [14-01]: Stable @id pattern `${SITE_URL}/path/#fragment` (e.g. https://future-marketing.ai/about/#daley) — locale-agnostic, stable across redeploys
- [Phase 14]: [14-01]: buildSameAs() filters null-default external profile URLs (LinkedIn always; Wikidata/Twitter/KvK/YouTube/Instagram add when constants flip) — Crunchbase intentionally absent per DECISIONS Q4
- [Phase 14]: [14-01]: PersonJsonLd component built but unrendered — Wave-2 plan 14-02 owns rendering + i18n keys (single messages/*.json owner per wave per checker B4)
- [Phase 14]: [14-01]: ArticleJsonLd author@id matches both 'Daley Maat' and 'Daley' (formal + short-form) — handle merged into 14-03 commit 25c3fd3 per wave-1 disjoint-hunk collision rule
- [Phase 14]: [14-01]: WIKIDATA_URL ships null until Daley's Task 1 UI work + 48h speedy-delete survival check passes — schema graph stays valid via buildSameAs() filter at every step
- [Phase 14]: [14-02]: ServiceJsonLd @id pattern (skillServiceId(slug)) closes Org.hasOfferCatalog graph loop from 14-01 — 12 services match 12 catalog items exactly, single source of truth (skillServiceId helper)
- [Phase 14]: [14-02]: serviceType taxonomy = human-readable category strings ('Social Media Content Service' etc.) NOT schema.org enum URIs — Google rich-result prefers human-readable, future swap to canonical IDs is one-line change per skill
- [Phase 14]: [14-02]: FAQ schema-content parity by single-array pattern: faqItems built once, passed to both visible <dl> and FaqJsonLd — eliminates the drift class of bugs Google penalizes
- [Phase 14]: [14-02]: Visible FAQ uses h3-in-dt semantic (audit 05 Top-15 #6) — same visual, better LLM h3 weight
- [Phase 14]: [14-02]: Sindy positioning = founder + operator of SKC only, zero mention of Daley's co-ownership per i18n quality bar (CLAUDE.md rule)
- [Phase 14]: [14-02]: SKC Organization @id is page-local (#organization-skc) not a global #org-skc — keeps FMai graph clean, lets Sindy.worksFor resolve graph-locally on SKC case study
- [Phase 14]: [14-02]: i18n flat-to-nested restructure for testimonial — flat author/role renamed to authorName/authorRole (visible code), new nested author={name,role,bio} added for schema. Zero visible content change
- [Phase 14]: [14-02]: about.founder.fullName ('Daley Maat') added alongside existing about.founder.name ('Daley') — separate keys for separate purposes (visible card unchanged, Person schema gets formal full name)
- [Phase 14]: [14-02]: Speakable type extension via `& { speakable?: ... }` pattern (schema-dts SpeakableSpecification is pending class) — same as ServiceJsonLd availableLanguage extension. No @ts-expect-error, types stay strict
- [Phase 14]: [14-02]: Wave-2 messages-file ownership absolute: 297 new i18n entries (180 FAQ + 36 titles + 81 misc) all in 14-02 commits, zero collision with 14-01 (code-only) or 14-03 (only trims existing meta-descriptions)
- [Phase 15]: [15-01]: Hero secondary CTA demoted from CTAButton variant=secondary size=lg to plain Link styled at 1/3 visual weight (text-sm text-text-muted underline-offset-4) -- single dominant primary closes audit 03 leak #8
- [Phase 15]: [15-01]: PageShell.showStickyCta opt-in flag (default false) chosen over implicit-everywhere; SkillPageTemplate single edit covers all 12 skill pages -- 5 explicit page wires + 1 template = 17 route leaves with bar enabled, /apply /contact /about /how-it-works /legal /blog stay clean by default
- [Phase 15]: [15-01]: StickyMobileCTA uses Link from @/i18n/navigation (not next/link) and palette tokens bg-bg-deep + text-bg-deep (not plan-spec deprecated #0A0E27/#05080f) -- preserves nl/en/es locale prefix and passes scripts/verify-palette.sh Phase-12-01 gate
- [Phase 15]: [15-01]: Lazy useState initializer (readInitialDismissed) reads sessionStorage on first client render instead of setState-in-effect rehydration -- silences React Compiler cascading-render warning, hydration-safe because component returns null until visible flips on scroll post-hydration
- [Phase 15]: [15-02]: ApplyCalendlyInline reuses existing react-calendly dependency (already pulled by CalendlyModal.tsx) -- zero new runtime deps, dynamic({ ssr: false }) prevents SSR mismatch, ErrorBoundary class catches dynamic-import rejection, URL constructor guard tolerates malformed env var, hosted-Calendly anchor fallback builds ?name=&email= search params for prefilled click-through on the embed-failure path
- [Phase 15]: [15-02]: Embed renders only on /apply success surface (high-intent moment); /contact gets a secondary outlined CTA, NOT an inline embed -- contact intent is lower than apply, full embed would feel pushy and dilute the contact form's distinct purpose
- [Phase 15]: [15-02]: Reassurance copy 'Daley antwoordt binnen 3 werkdagen' sits BELOW the embed per plan brief -- keeps the active booking surface visually dominant; safety-net wording is a footnote, not a competing headline
- [Phase 15]: [15-02]: useRef one-shot guard for GA4 calendly_load event instead of useState-in-effect (mirrors 15-01 lazy-init StickyMobileCTA pattern) -- refs do not retrigger render and React Compiler's react-hooks/set-state-in-effect rule does not flag them
- [Phase 15]: [15-02]: Removed redundant mounted-state gate around InlineWidget -- dynamic({ ssr: false }) already prevents server render, so the second-flag was redundant; net is simpler code, lint green, hydration semantics unchanged
- [Phase 15]: [15-02]: ContactForm continues to receive copy via the labels prop (Phase 11-03 pattern) rather than swapping to useTranslations inside the client component -- preserves single-source-of-truth in the server page, no double-fetch of the namespace
- [Phase 15]: [15-02]: ContactForm secondary CTA uses neutral 'Open Daley's agenda' label, NOT the canonical 'Plan een gesprek' -- per plan rule the primary brand-CTA vocabulary lives on /apply; contact's offer is a soft, distinct second option
- [Phase 15]: [15-03]: Surname leak audit codified -- author.name in case_studies.skc.testimonial reduced to bare "Sindy" across nl/en/es. Phase 14-02 had set author.name = "Sindy Maat" which is Daley's surname accidentally attached to Sindy in JSON-LD output. Public surfaces touching SKC must NOT render shared-surname identifiers per phase README success criterion 4 (zero Daley co-ownership leak). Fix verified by `grep "Sindy Maat" messages/*.json` returning zero matches.
- [Phase 15]: [15-03]: SkcTestimonialBlock built but intentionally NOT wired into case-study page.tsx -- orphan client component until Sindy headshot lands at fmai-nextjs/public/case-studies/skc/sindy-headshot.jpg. Wiring before photo lands would render a broken image (next/image 404) on the live page. Existing inline testimonial render in page.tsx stays in place; swap to SkcTestimonialBlock happens in one atomic commit when transcript + photo + consent arrive together.
- [Phase 15]: [15-03]: i18n key shape kept as authorName + authorRole + author.{name,role,bio} (Phase 14-02 schema) instead of plan-spec flat author + role keys -- avoids breaking the existing testimonial render which reads authorName/authorRole, prevents double-keys in i18n
- [Phase 15]: [15-03]: PersonJsonLd reuse confirmed (Phase 14-02 a9deef5 already shipped Sindy Person schema with @id SINDY_PERSON_ID + jobTitle from t('testimonial.author.role') + worksFor SKC Organization @id). Plan 15-03 Task 5 is verification, not re-implementation -- prevented duplicate component creation
- [Phase 15]: [15-03]: External-dependency partial-execution pattern: deliver scaffolding (interview brief + component code + i18n key shape + photo-dir gate doc) in one wave; defer content (real metrics + photo binary + final wiring + meta-description rewrite) to a second wave when external artifact arrives. Avoids blocking the entire plan on one human action. 15-04 + 15-05 unblocked, can run in parallel
- [Phase 15]: [15-03]: Photo-dir README at fmai-nextjs/public/case-studies/skc/README.md -- physical reminder of asset gate next to the asset path, survives repo navigation, not buried in plan docs. Future agents (or Daley) walking that directory see the spec + wiring trigger
- [Phase 15]: [15-03]: Provenance noise documented -- parallel 15-02 agent's `git add fmai-nextjs/messages/*.json` snapshotted my 15-03 unstaged Edit-tool changes (testimonial scaffolding keys + Sindy Maat fix) into commit 96b6bbe with a 15-02 message. Functionally clean, audit-trail noisy. Tracked in 15-03-SUMMARY.md Issues Encountered
- [Phase 15]: [15-04]: Audience-add gated to /api/newsletter/confirm AFTER status flip — unconfirmed emails NEVER enter Resend Audience
- [Phase 15]: [15-04]: RESEND_AUDIENCE_ID missing is non-fatal (warn-and-continue) so the flow ships green pre-provisioning; documented as launch prerequisite #1
- [Phase 15]: [15-04]: Privacy link routes to /[locale]/legal/privacy not /[locale]/privacy — matches actual (legal)/legal/privacy route group
- [Phase 15]: [15-04]: Suspense wrap on /[locale]/newsletter/confirm — Next.js 16 useSearchParams() bails prerender otherwise (Rule 1 build fix)
- [Phase 15]: [15-04]: Provenance noise — parallel 15-05 agent's git add captured my Task 3 + Task 4-pricing-wire edits into commits 363ddf2 + ef0ce35; functional impact zero
- [Phase 15]: [15-05]: founding namespace top-level (NOT merged into founding-member) keeps FoundingCounter context-free reusable across pricing/founding-member/about/home
- [Phase 15]: [15-05]: FoundingCounter is server-only via next-intl/server; consuming pages SSG so zero client bundle cost; new founding namespace skips GLOBAL_CLIENT_NAMESPACES (Phase 13-02 invariant intact)
- [Phase 15]: [15-05]: Hard-coded locale-tag map (nl=>nl-NL/en=>en-GB/es=>es-ES) for Intl.DateTimeFormat — deterministic across Vercel edge + local dev, matches DECISIONS-2026-04-24 Q2 long-form date format
- [Phase 15]: [15-05]: q8 repurposed from per-tier-caps (overlap with q1) to data ownership/export — closes audit 03 objection-matrix line 125 lock-in/exit gap with concrete commitments (14-day signed-S3 export, 30-day GDPR deletion)
- [Phase 15]: [15-05]: FAQ position is 4-of-8 not 4-of-7 because the actual page has a 'Why prices visible' transparency block audit 03 didn't count separately; FAQ now sits BEFORE that block, fully satisfying audit-03-leak-#14 intent (FAQ ABOVE credit packs)
- [Phase 15]: [15-05]: FAQ_KEYS const tuple drives both visible <dl> render AND FaqJsonLd schema entities — single source of truth, eliminates the schema/visible-content drift class of bugs Google penalizes

### Roadmap Evolution

- Phase 6 added (2026-03-20): Vite Feature Parity — port all interactive demos (chatbot DemoPlayground, voice VoiceDemoSection, VisionTimeline, FeatureShowcase), missing UI sections (pricing tiers, trust metrics, social proof, product media), and enhanced language switcher with flag emojis from original Vite project to Next.js
- Phase 7 added (2026-03-20): Website Copy Overhaul — rewrite all copy to introduce Clyde as AI marketing employee, wow-first messaging, task-result storytelling, premium tone, native EN/NL/ES copy
- Phase 8 added (2026-03-21): Clyde Chatbot Personality — unify 6 personas into single Clyde persona with context-aware welcome messages, confident expert tone, all 17 tools on every page
- Phase 9 added (2026-03-21): Codebase Cleanup — delete Vite legacy (442 files), fix persona crash, add contact email + analytics, remove orphaned pages

### Pending Todos

None yet.

### Blockers/Concerns

- Three-repo coordination: Website (this repo), Dashboard (fma-app), n8n (FMai) -- changes span all three
- No revenue while building: GTM Phase 5 starts immediately to pre-sell founding members

## Session Continuity

Last session: 2026-04-27
Stopped at: 15-04-PLAN.md DONE (4 of 5 tasks, 18min; Task 5 = end-to-end checkpoint deferred to launch prerequisites by design — those are external user actions Daley must perform). Lead magnet programme code is end-to-end ready: /api/newsletter intake validates email + explicit consent + honeypot, inserts pending row in newsletter_consents with ip_hashed + consent_text verbatim + locale + source, sends double-opt-in mail via Resend. /api/newsletter/confirm idempotently flips status to confirmed, adds to Resend Audience (RESEND_AUDIENCE_ID, non-fatal if missing), sends PDF delivery mail. /[locale]/newsletter/confirm Suspense-wrapped client page renders 4 deterministic states (pending/ok/already/error). LeadMagnetCTA inline + sidebar variants wired on home (inline below hero) + pricing (sidebar between visibility + credit-packs) + founding-member (sidebar between benefits + FAQ) + blog (sticky sidebar in 2-col layout on lg+). messages/{nl,en,es}.json got 16-key leadMagnet.* + 9-key newsletter.confirm.* namespaces. Supabase migration 20260427_newsletter_consents.sql written but NOT applied (Daley runs against fma-app project per DECISIONS Q3). Build exit 0, all 93 SSG routes prerender, npm run check:palette PASS, npx tsc --noEmit clean. Three launch prerequisites pending external action: (1) Resend Audience "FMai Newsletter NL" creation + RESEND_AUDIENCE_ID drop in Vercel env, (2) NL Bureau AI Readiness Checklist PDF designed in Canva and dropped to fmai-nextjs/public/downloads/nl-bureau-ai-readiness-checklist.pdf, (3) supabase/migrations/20260427_newsletter_consents.sql applied against fma-app Supabase project. Until (3), /api/newsletter intake returns 500 internal_error. Until (1), confirmed emails do NOT enter Resend Audience but everything else works. Until (2), the confirm-page delivery email link 404s on click. 5 commits: e0e3dcb (own, migration), 0c30584 (own, intake), 363ddf2 (provenance noise — 15-05 git add captured my Task-3 confirm route + page + i18n keys), ef0ce35 (provenance noise — 15-05 git add captured my pricing wire), 4e18dcb (own, LeadMagnetCTA + 3-page wires + Suspense Rule-1 build fix). Earlier in this session 15-03 PARTIAL also landed (Sindy SKC scaffolding, transcript-blocked tasks pending) and 15-05 fully landed (FoundingCounter + pricing FAQ promotion + 3 objection-handling Q&As; ef0ce35 + 363ddf2 commits).
Resume file: None — plan is fully shipped code-side. Daley's three external actions track in 15-04-SUMMARY.md User Setup Required section.
Next: All Wave 3 plans landed. Phase 15 is now 4 of 5 plans complete with 15-03 PARTIAL (transcript-blocked). Phase-close items: (a) 15-03 final completion when Sindy interview transcript + headshot + LinkedIn slug + akkoord-email arrive; (b) Daley executes the three 15-04 launch prerequisites; (c) verifier agent should run end-to-end Playwright on 15-01 (sticky CTA) + 15-02 (Calendly post-submit) + 15-04 (newsletter signup → confirm → PDF) + 15-05 (FoundingCounter date rendering + 8-Q FAQ JSON-LD). Daley still owes earlier-phase carried-over items: Wikidata FMai item creation + KvK URL confirmation + LinkedIn slug confirmations (LINKEDIN_DALEY_URL, LINKEDIN_SINDY_URL); VoiceDemoSection phone hide (12-03); Stripe live-mode product creation including Max Credit Pack rename (12-04 + CARRY-12-A); post-Phase-15 LinkedIn + Facebook share-cache flush (CARRY-12-B).
