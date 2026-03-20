---
phase: 02-dashboard-reframe
plan: 01
subsystem: database, ui, routing
tags: [supabase, next.js, sidebar, migration, skills, stripe]

requires:
  - phase: 01-website-rebrand
    provides: AaaS skill definitions and pricing tiers established in website
provides:
  - Supabase migration extending fma_organizations with agency columns (stripe_customer_id, display_name, onboarding_completed_at)
  - Supabase migration extending fma_clients with active_skills and skill_config columns
  - skills.ts single source of truth (6 SKILLS, 4 AGENT_TIERS, 3 SKILL_ADDONS)
  - Reframed sidebar navigation with 12 AaaS-appropriate items
  - Route redirects for renamed pages (pipeline->agent-activity, campaigns->tasks)
  - Updated middleware with new protected paths
affects: [02-02, 02-03, 02-04, billing, onboarding, client-workspaces]

tech-stack:
  added: []
  patterns: [skills-config-single-source-of-truth, permanent-route-redirects]

key-files:
  created:
    - fma-app/supabase/migrations/057_agency_data_model.sql
    - fma-app/src/lib/skills.ts
  modified:
    - fma-app/src/components/layout/app-sidebar.tsx
    - fma-app/next.config.ts
    - fma-app/src/middleware.ts

key-decisions:
  - 'Extended fma_organizations with agency columns instead of creating separate fma_agencies table (preserves existing RLS)'
  - 'Used TEXT[] for active_skills with GIN index for efficient array queries'
  - '12 sidebar items: removed 7 SKC-specific items, relabeled remaining for AaaS'
  - 'Permanent (308) redirects for pipeline->agent-activity and campaigns->tasks'

patterns-established:
  - 'skills.ts as single source of truth: all skill references import SKILLS, AGENT_TIERS, SKILL_ADDONS from lib/skills'
  - 'Route renaming via next.config.ts redirects (not middleware)'

requirements-completed: [DASH-01, DASH-03, DASH-08]

duration: 2min
completed: 2026-03-20
---

# Phase 2 Plan 1: Dashboard Foundation Summary

**Agency data model migration with skills config, sidebar relabeled to AaaS language, and route redirects for renamed pages**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T19:59:12Z
- **Completed:** 2026-03-20T20:01:00Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Supabase migration extending fma_organizations and fma_clients with agency/skill columns (safe for existing SkinClarity data)
- skills.ts as single source of truth: 6 skills, 4 agent tiers with pricing, 3 purchasable add-ons
- Sidebar reframed from 18 SKC items to 12 AaaS items with "AI Employee" branding
- Route redirects and middleware updated for renamed pages

## Task Commits

Each task was committed atomically:

1. **Task 1: Agency data model migration + shared skills config** - `fdfbd5e` (feat)
2. **Task 2: Sidebar relabel + route redirects + middleware update** - `f25f379` (feat)

## Files Created/Modified

- `fma-app/supabase/migrations/057_agency_data_model.sql` - Agency columns on fma_organizations, skill columns on fma_clients, updated CHECK constraint, performance indexes
- `fma-app/src/lib/skills.ts` - Single source of truth for SKILLS (6), AGENT_TIERS (4), SKILL_ADDONS (3), SkillId type
- `fma-app/src/components/layout/app-sidebar.tsx` - 12 AaaS nav items, "AI Employee" subtitle, removed unused imports
- `fma-app/next.config.ts` - 4 permanent redirect rules (pipeline->agent-activity, campaigns->tasks with path wildcards)
- `fma-app/src/middleware.ts` - Added /agent-activity, /tasks, /skills, /onboarding; removed 7 obsolete paths

## Decisions Made

- Extended fma_organizations instead of creating separate fma_agencies table -- preserves existing RLS and is_org_member() pattern
- Used TEXT[] for active_skills (not JSONB) with GIN index for efficient containment queries
- 12 sidebar items kept: removed Products, Config, Tokens, Meta Ads, Ad Library, Campaigns, Pipeline and nested voice-agent sub-routes
- Permanent redirects (308) in next.config.ts rather than middleware redirects -- evaluated before middleware, simpler

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required. Stripe Price IDs in env vars will be needed when billing integration is built (Phase 2 Plan 3).

## Next Phase Readiness

- Database schema ready for agency onboarding and billing integration
- skills.ts ready for import by client workspace pages, billing actions, and skill toggle components
- Sidebar and routes ready for new page implementations (agent-activity, tasks, skills, onboarding)
- All subsequent Phase 2 plans can proceed

---

_Phase: 02-dashboard-reframe_
_Completed: 2026-03-20_
