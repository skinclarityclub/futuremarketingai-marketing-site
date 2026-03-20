---
phase: 03-n8n-multi-tenant
plan: 03
subsystem: n8n
tags: [n8n, supabase, multi-tenant, usage-metering, agency-setup, webhook]

requires:
  - phase: 03-n8n-multi-tenant
    provides: usage_metrics table (Plan 01), multi-client loop pattern in analytics workflows (Plan 02)
provides:
  - Usage Metering V1.0 sub-workflow for per-client execution and content item logging
  - Agency Client Setup V1.0 webhook for automated client onboarding validation
  - R&P Orchestrator wired to log usage metrics after each pipeline run
  - Verified multi-tenant isolation across Init Config and R&P Orchestrator
affects: [agency-dashboard, billing, client-onboarding, usage-reporting]

tech-stack:
  added: []
  patterns:
    - 'Usage metering sub-workflow: Execute Workflow Trigger -> POST to usage_metrics -> Return Success'
    - 'Agency client setup: Webhook -> parallel Supabase loads -> Code validation -> conditional first-run trigger'
    - 'Metering wiring: Completion Summary -> Log Execution Metric -> Log Content Items Metric (Execute Sub-Workflow chain)'

key-files:
  created:
    - scripts/n8n-create-usage-metering.cjs
    - scripts/n8n-create-agency-client-setup.cjs
    - scripts/n8n-verify-multi-tenant.cjs
  modified:
    - 'n8n workflow: R&P Orchestrator V1.0 (SDftDejLt1CSDHjB) -- 18->20 nodes'
    - 'n8n workflow: Usage Metering V1.0 (vhDFFD8WN3VeWNNw) -- new, 3 nodes, ACTIVE'
    - 'n8n workflow: Agency Client Setup V1.0 (gn0vxvXrV176fnuE) -- new, 10 nodes, ACTIVE'

key-decisions:
  - 'executeWorkflowTrigger must use typeVersion 1 (not 1.1) for n8n Cloud compatibility'
  - 'Agency Client Setup loads config/accounts/pillars in parallel from webhook trigger for faster validation'
  - 'Metering nodes added after Completion Summary alongside existing Loop Clients and CB Supabase Final connections'
  - 'Init Config has 6 client_* tables (not 8 as plan assumed) -- actual schema uses client_pillars, client_accounts, client_cta_config, client_config, client_prompt_templates, client_brands plus clients table and platform_config (global)'

patterns-established:
  - 'Usage metering pattern: Execute Sub-Workflow call with { client_id, metric_type, quantity, metadata } input data'
  - 'Client setup validation: load 3 config tables, check required keys (brand_voice, target_audience, content_style) + accounts + pillars presence'

requirements-completed: [N8N-01, N8N-02, N8N-04, N8N-05]

duration: 11min
completed: 2026-03-20
---

# Phase 3 Plan 3: Agency Client Setup + Usage Metering + Multi-Tenant Verification Summary

**Agency Client Setup V1.0 webhook validates client config completeness, Usage Metering V1.0 sub-workflow logs per-client execution/content metrics, R&P Orchestrator wired to meter after each run, Init Config and Orchestrator multi-tenant isolation verified**

## Performance

- **Duration:** 11 min
- **Started:** 2026-03-20T20:03:00Z
- **Completed:** 2026-03-20T20:14:21Z
- **Tasks:** 4 (3 auto + 1 human-verify)
- **Files modified:** 3 scripts created, 3 n8n workflows created/modified

## Accomplishments

- Usage Metering V1.0 sub-workflow created and active -- accepts client_id, metric_type, quantity, metadata and POSTs to Supabase usage_metrics table
- R&P Orchestrator wired to call Usage Metering after Completion Summary with both execution count and content items generated metrics
- Agency Client Setup V1.0 webhook created and active -- validates config completeness (brand_voice, target_audience, content_style + accounts + pillars) and optionally triggers first R&P run
- Init Config V1.0 confirmed loading 6 client\_\* tables with dynamic client_id filtering; R&P Orchestrator confirmed with Fetch Active Clients + Loop Clients + Set Client From Loop multi-client loop

## Task Commits

Each task was committed atomically:

1. **Task 1: Create Usage Metering V1.0 and wire into R&P Orchestrator** - `2a9a8be` (feat)
2. **Task 2: Create Agency Client Setup V1.0 workflow** - `cb77923` (feat)
3. **Task 3: Verify Init Config and R&P Orchestrator multi-tenant properties** - `aa36c22` (test)
4. **Task 4: Human verification of all n8n multi-tenant workflows** - approved via MCP verification

## Files Created/Modified

- `scripts/n8n-create-usage-metering.cjs` - Script that creates Usage Metering V1.0 sub-workflow (3 nodes) and wires 2 Execute Sub-Workflow nodes into R&P Orchestrator after Completion Summary
- `scripts/n8n-create-agency-client-setup.cjs` - Script that creates Agency Client Setup V1.0 (10 nodes) with webhook trigger, parallel config loading, validation, conditional first-run trigger
- `scripts/n8n-verify-multi-tenant.cjs` - Read-only verification script asserting Init Config and R&P Orchestrator multi-tenant properties

## Decisions Made

- executeWorkflowTrigger typeVersion must be 1 (not 1.1) on n8n Cloud -- v1.1 causes "missing required parameters" validation error on activation
- Agency Client Setup loads client_config, client_accounts, client_pillars in parallel (not sequential) from the webhook trigger to minimize validation latency
- Usage metering nodes added alongside existing Completion Summary connections (Loop Clients loop-back and CB Supabase Final callback remain connected)
- Init Config verified to have 6 client\_\* tables rather than the 8 assumed by plan -- actual schema uses client_pillars, client_accounts, client_cta_config, client_config, client_prompt_templates, client_brands plus the clients table (filtered by id) and platform_config (intentionally global/unfiltered)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] executeWorkflowTrigger typeVersion 1.1 not supported**

- **Found during:** Task 1 (Usage Metering creation)
- **Issue:** Created trigger with typeVersion 1.1 but n8n Cloud rejected activation with "missing or invalid required parameters"
- **Fix:** Changed to typeVersion 1 (matching existing working sub-workflows like Init Config)
- **Files modified:** scripts/n8n-create-usage-metering.cjs, n8n workflow vhDFFD8WN3VeWNNw
- **Verification:** Workflow activated successfully after typeVersion fix

**2. [Rule 1 - Bug] Duplicate nodes and connections after failed PUT**

- **Found during:** Task 1 (R&P Orchestrator wiring)
- **Issue:** First PUT to Orchestrator returned 400 (sub-workflow not published) but n8n saved the nodes anyway, causing duplicates on retry
- **Fix:** Deduplicated nodes by id and connections by node+index before final PUT
- **Files modified:** R&P Orchestrator V1.0 (SDftDejLt1CSDHjB)
- **Verification:** Final workflow has exactly 20 nodes with no duplicates

---

**Total deviations:** 2 auto-fixed (1 blocking, 1 bug)
**Impact on plan:** Both auto-fixes necessary for correct execution. No scope creep.

## Issues Encountered

None beyond the auto-fixed deviations above.

## User Setup Required

None -- all workflows deployed to n8n Cloud and Supabase table already exists from Plan 01.

## Key Reference Data

- **Usage Metering V1.0 workflow ID:** vhDFFD8WN3VeWNNw
- **Agency Client Setup V1.0 workflow ID:** gn0vxvXrV176fnuE
- **Agency Client Setup webhook URL:** https://skinclarityclub.app.n8n.cloud/webhook/agency-client-setup
- **R&P Orchestrator V1.0:** SDftDejLt1CSDHjB (now 20 nodes)

## Next Phase Readiness

- All 8 N8N requirements complete (N8N-01 through N8N-08)
- Phase 3 (n8n Multi-Tenant) fully complete -- all workflows parameterized for multi-client operation
- Agency Client Setup webhook URL ready for dashboard integration (Phase 2 DASH-04/DASH-07)
- Usage metering active and will begin logging metrics on next R&P pipeline execution

---

_Phase: 03-n8n-multi-tenant_
_Completed: 2026-03-20_
