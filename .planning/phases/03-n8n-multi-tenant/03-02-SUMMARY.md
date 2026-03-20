---
phase: 03-n8n-multi-tenant
plan: 02
subsystem: n8n
tags: [n8n, multi-tenant, analytics, instagram, telegram, supabase]

requires:
  - phase: 03-n8n-multi-tenant
    provides: client_config table and multi-client loop pattern from R&P Orchestrator
provides:
  - Daily Analytics Collector parameterized for multi-client with per-client IG token loading
  - Weekly Performance Intelligence parameterized with client-scoped queries
  - Per-client Telegram notification routing for both analytics workflows
affects: [03-03-PLAN, usage-metering, agency-client-setup]

tech-stack:
  added: []
  patterns:
    - 'Multi-client analytics loop: Fetch Active Clients -> SplitInBatches -> Set Client Context -> Load Token -> Skip If No Token'
    - 'Per-client notification routing via client_config with SKC fallback defaults'
    - 'Dynamic IG access token from client_config instead of hardcoded env var'

key-files:
  created:
    - scripts/n8n-update-daily-analytics.cjs
    - scripts/n8n-update-weekly-performance.cjs
  modified:
    - 'n8n workflow: Daily Analytics Collector V1.0 (tIwqBmpgzNGZnVKT) — 13->19 nodes'
    - 'n8n workflow: Weekly Performance Intelligence V1.0 (Pr4F6fzHh8RYwlnX) — 8->12 nodes'

key-decisions:
  - 'Replaced Supabase node with HTTP Request for content_items query to enable client_id filtering'
  - 'SKC Telegram bot/chat as fallback defaults in expression functions (not hardcoded in node params)'
  - 'Both workflows kept INACTIVE -- activation happens when agency clients provide IG tokens'
  - 'client_id added to instagram_post_snapshots upsert and scheduling_intelligence save payloads'

patterns-established:
  - 'Analytics multi-client loop: same Fetch Active Clients -> Loop Clients -> Set Client Context pattern as R&P Orchestrator'
  - 'Per-client notification config: Load from client_config, fallback to SKC defaults via inline JS function'

requirements-completed: [N8N-06, N8N-07, N8N-08]

duration: 6min
completed: 2026-03-20
---

# Phase 3 Plan 2: Analytics Multi-Client + Error Notification Routing Summary

**Daily Analytics Collector and Weekly Performance Intelligence parameterized with multi-client loops, per-client IG token loading, client-scoped queries, and per-client Telegram notification routing**

## Performance

- **Duration:** 6 min
- **Started:** 2026-03-20T19:29:05Z
- **Completed:** 2026-03-20T19:36:01Z
- **Tasks:** 2
- **Files modified:** 2 scripts created, 2 n8n workflows updated

## Accomplishments

- Daily Analytics Collector has multi-client loop with dynamic IG token loading from client_config, graceful skip for clients without tokens
- Weekly Performance Intelligence scopes all snapshot and intelligence queries to client_id with client-attributed reports
- Both workflows use per-client Telegram notification routing loaded from client_config with SKC fallback defaults
- Both workflows remain INACTIVE until agency clients provide their Instagram access tokens

## Task Commits

Each task was committed atomically:

1. **Task 1: Parameterize Daily Analytics Collector for multi-client** - `f41ae39` (feat)
2. **Task 2: Parameterize Weekly Performance Intelligence for multi-client** - `beac212` (feat)

## Files Created/Modified

- `scripts/n8n-update-daily-analytics.cjs` - Script that adds 6 new nodes (Fetch Active Clients, Loop Clients, Set Client Context, Load Client IG Token, Skip If No Token, Load Notification Config) and modifies existing nodes for dynamic token usage and client-scoped queries
- `scripts/n8n-update-weekly-performance.cjs` - Script that adds 4 new nodes (Fetch Active Clients, Loop Clients, Set Client Context, Load Notification Config) and modifies existing nodes for client-scoped snapshots and per-client reporting

## Decisions Made

- Replaced the Supabase native node ("Get Posts With ig_post_id") with an HTTP Request node querying content_items (not content_schedule) table to enable client_id filtering -- content_items is the multi-tenant table per research
- SKC Telegram credentials are embedded as fallback defaults inside expression functions rather than as hardcoded node parameters, ensuring new clients get their own config while SKC continues working
- Added client_id to both the instagram_post_snapshots upsert and scheduling_intelligence save payloads for data attribution
- Kept both workflows INACTIVE per plan -- activation is a client-readiness concern, not a deployment concern

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] n8n API uses PUT, not PATCH**

- **Found during:** Task 1 (Daily Analytics update)
- **Issue:** Plan references mcp**n8n-docs**n8n_update_partial_workflow which uses PATCH, but n8n REST API v1 requires PUT with full workflow body
- **Fix:** Changed API method to PUT and included name, settings, staticData in payload
- **Files modified:** scripts/n8n-update-daily-analytics.cjs
- **Verification:** Workflow updated successfully with 19 nodes

**2. [Rule 3 - Blocking] ES module scope error (.js in ESM package)**

- **Found during:** Task 1 (script execution)
- **Issue:** Package.json has "type": "module", causing .js files to be treated as ESM (require not defined)
- **Fix:** Renamed script to .cjs extension
- **Files modified:** scripts/n8n-update-daily-analytics.cjs (renamed from .js)
- **Verification:** Script executes correctly with CommonJS require

---

**Total deviations:** 2 auto-fixed (2 blocking)
**Impact on plan:** Both auto-fixes were infrastructure/tooling issues. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviations above.

## User Setup Required

None - no external service configuration required. Workflows are deployed to n8n Cloud and remain inactive.

## Next Phase Readiness

- Both analytics workflows ready for activation when agency clients provide Instagram access tokens
- Error notification routing complete -- per-client Telegram config will be loaded from client_config table
- Plan 03-03 (Usage Metering + Agency Client Setup) can proceed independently

---

_Phase: 03-n8n-multi-tenant_
_Completed: 2026-03-20_
