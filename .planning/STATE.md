---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: unknown
last_updated: '2026-03-20T20:57:43.156Z'
progress:
  total_phases: 6
  completed_phases: 4
  total_plans: 21
  completed_plans: 20
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-03-20)

**Core value:** Marketing agencies can scale without hiring by deploying an AI Marketing Employee with pluggable skills
**Current focus:** Phase 1 COMPLETE, Phase 3 COMPLETE, Phase 4 COMPLETE, Phase 6 IN PROGRESS (plans 1+3+4 done, 2 remaining). Next: Phase 6 plan 2, Phase 2 plan 4, Phase 5 plan 3

## Current Position

Phase: 7 of 7 (Website Copy Overhaul) -- IN PROGRESS
Plan: 3 of 4 in current phase
Status: Executing
Last activity: 2026-03-20 -- Completed 07-03-PLAN.md (Skill pages Clyde rewrite + task-demo sections)

Progress: [██████████] 100% (phases 1-6) | Phase 7: [========--] 3/4

## Performance Metrics

**Velocity:**

- Total plans completed: 20
- Average duration: ~9 min
- Total execution time: ~2.5 hours

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

- Last 5 plans: 06-04 (4min), 06-03 (6min), 07-01 (11min), 07-02 (4min), 07-03 (16min)
- Trend: Stable

_Updated after each plan completion_
| Phase 06 P02 | 7min | 2 tasks | 7 files |
| Phase 07 P01 | 11min | 2 tasks | 9 files |
| Phase 07 P02 | 4min | 2 tasks | 3 files |
| Phase 07 P03 | 16min | 2 tasks | 9 files |

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

### Roadmap Evolution

- Phase 6 added (2026-03-20): Vite Feature Parity — port all interactive demos (chatbot DemoPlayground, voice VoiceDemoSection, VisionTimeline, FeatureShowcase), missing UI sections (pricing tiers, trust metrics, social proof, product media), and enhanced language switcher with flag emojis from original Vite project to Next.js

### Pending Todos

None yet.

### Blockers/Concerns

- Three-repo coordination: Website (this repo), Dashboard (fma-app), n8n (FMai) -- changes span all three
- No revenue while building: GTM Phase 5 starts immediately to pre-sell founding members

## Session Continuity

Last session: 2026-03-20
Stopped at: Completed 07-03-PLAN.md (Skill pages Clyde rewrite + task-demo sections)
Resume file: None
