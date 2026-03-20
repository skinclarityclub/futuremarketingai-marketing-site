# Phase 3: n8n Multi-Tenant - Research

**Researched:** 2026-03-20
**Domain:** n8n workflow parameterization, multi-tenant content pipeline, usage metering
**Confidence:** HIGH

## Summary

Phase 3 transforms existing n8n workflows from single-tenant (SKC-hardcoded) to multi-tenant (agency client context injected per execution). The foundation is already substantial: Init & Config V1.0 loads from 8 Supabase client*\* tables per client_id, the R&P Orchestrator has a multi-client schedule loop (Fetch Active Clients -> SplitInBatches -> Set Client), and the content_items/content_briefs tables are already client_id-scoped. The primary work is: (1) ensuring all downstream workflows (Content Posting Pipeline v2, CarouselBuilder, Daily Analytics, Weekly Performance) consume client_id context instead of hardcoded SKC values, (2) building an agency client setup workflow that auto-populates client*\* tables when a new client workspace is created in the dashboard, (3) adding usage metering (execution counts, content items, voice minutes) with per-client logging to Supabase, and (4) parameterizing error notifications to route to the correct agency owner.

The hardest parts are the Content Posting Pipeline (hardcoded Blotato account IDs and Telegram bot tokens) and the analytics workflows (hardcoded Instagram access tokens and Supabase queries). The CarouselBuilder is already sub-workflow-invoked and receives data from the R&P pipeline, so it needs minimal changes. The n8n MCP tools (n8n_update_partial_workflow, n8n_get_workflow) enable programmatic workflow modification without manual n8n Cloud UI work.

**Primary recommendation:** Work from the outside in -- parameterize Init Config to pass client context as sub-workflow input data through the entire R&P pipeline chain, then modify Posting Pipeline and Analytics workflows to accept client_id and load their credentials from client_config/client_accounts tables instead of hardcoded Code nodes.

<phase_requirements>

## Phase Requirements

| ID     | Description                                                                                      | Research Support                                                                                                                                                                                             |
| ------ | ------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| N8N-01 | Init Config parameterized for agency client context (brand voice, accounts, API keys per client) | Init & Config V1.0 already loads from 8 client\_\* tables per client_id. Need to verify API key storage pattern in client_config and ensure brand voice flows through to agent prompts.                      |
| N8N-02 | R&P Pipeline runs per-client with isolated data (content_schedule per client)                    | content_items table already has client_id column. R&P Orchestrator has multi-client loop. Need to verify all sub-workflows (Research, Strategy, Content Factory, Validate & Persist) pass client_id through. |
| N8N-03 | Posting Pipeline parameterized for per-client social accounts                                    | Content Posting Pipeline v2 has hardcoded Blotato account IDs in "Configuration + Week Range" Code node. Must load from client_accounts table (blotato_account_id column exists).                            |
| N8N-04 | Agency client setup workflow (new client -> auto-configure all active skill workflows)           | Dashboard onboarding wizard (Phase 20) already writes to all client\_\* tables. Need new n8n workflow triggered by dashboard that validates config completeness and optionally triggers first R&P run.       |
| N8N-05 | Usage metering per client (execution count, content items, voice minutes logged to Supabase)     | Need new usage_metrics table. Can use n8n webhook callbacks (pattern exists from Phase 19 pipeline_runs callbacks) to log per-execution metrics.                                                             |
| N8N-06 | Daily Analytics Collector activated and parameterized per client                                 | Daily Analytics Collector V1.0 exists (workflow tIwqBmpgzNGZnVKT, inactive). Currently queries hardcoded IG posts. Must add multi-client loop and load IG access tokens from client_config.                  |
| N8N-07 | Weekly Performance Intelligence activated with per-client reporting                              | Weekly Performance Intelligence V1.0 exists (workflow Pr4F6fzHh8RYwlnX, inactive). Must add client loop and scope snapshot queries to client_id.                                                             |
| N8N-08 | Error handling sends per-client notifications (Telegram/Slack to agency owner)                   | Current Telegram notifications use hardcoded bot token and chat_id. Must load notification_config from client_config (telegram_bot_token, telegram_chat_id, or slack_webhook_url).                           |

</phase_requirements>

## Standard Stack

### Core

| Tool              | Version   | Purpose                            | Why Standard                                                                                                                          |
| ----------------- | --------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| n8n Cloud         | 1.76+     | Workflow orchestration             | Already in production, 115 workflows, proven WAT architecture                                                                         |
| n8n REST API      | v1        | Programmatic workflow modification | Used in Phase 19 scripts (add_multi_client_loop.js, update_orchestrator_callbacks.js)                                                 |
| n8n MCP Server    | latest    | Claude-driven workflow CRUD        | Available via mcp\_\_n8n-docs tools, enables partial updates without full workflow replacement                                        |
| Supabase          | latest    | Multi-tenant data store            | All client\_\* tables already exist (migration 007), client_id scoping proven                                                         |
| Supabase REST API | PostgREST | n8n -> Supabase data access        | Used by all n8n HTTP Request nodes for DB operations (more reliable than n8n Supabase node for simple queries, per Phase 19 decision) |

### Supporting

| Tool                   | Version | Purpose                    | When to Use                                                                    |
| ---------------------- | ------- | -------------------------- | ------------------------------------------------------------------------------ |
| Blotato API            | v2      | Social media publishing    | Content Posting Pipeline -- per-client account_ids loaded from client_accounts |
| Instagram Graph API    | v21.0   | Analytics collection       | Daily Analytics Collector -- per-client access tokens from client_config       |
| Telegram Bot API       | latest  | Error/status notifications | Per-client notification routing from client_config                             |
| Claude API (Anthropic) | latest  | AI agent decisions         | Already used in R&P agents -- brand voice injection from client config         |

### Alternatives Considered

| Instead of                 | Could Use                 | Tradeoff                                                                                                                                                                          |
| -------------------------- | ------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| n8n Cloud                  | Self-hosted n8n (Hetzner) | Lower latency, more control, but migration complexity. Self-hosting plan exists (.planning/N8N_SELF_HOSTING_MIGRATION_PLAN.md) but is deferred -- do multi-tenant on Cloud first. |
| Supabase REST from n8n     | n8n Supabase node         | REST API is more reliable per Phase 19 learnings. Supabase node used for simple CRUD, REST for filtered queries.                                                                  |
| Telegram for notifications | Slack webhooks            | Both supported -- client_config should store either/both. Telegram is current default.                                                                                            |

## Architecture Patterns

### Existing Multi-Tenant Data Flow

```
Dashboard (fma-app)                    n8n Workflows                     Supabase
┌─────────────────────┐    ┌──────────────────────────┐    ┌─────────────────────┐
│ Onboarding Wizard   │───>│ (webhook trigger)        │    │ clients             │
│ writes to:          │    │                          │    │ client_config       │
│  - clients          │    │ R&P Orchestrator V1.0    │    │ client_accounts     │
│  - client_config    │    │  ├ Schedule: loop clients │    │ client_pillars      │
│  - client_accounts  │    │  ├ Webhook: single client │    │ client_cta_config   │
│  - client_pillars   │    │  ├ Init & Config V1.0    │    │ client_brands       │
│  - client_cta_config│    │  │  └ Loads ALL client_*  │    │ client_prompt_tmpl  │
│                     │    │  ├ Research Pipeline      │    │ content_briefs      │
│ Pipeline trigger    │───>│  ├ Strategy Engine        │    │ content_items       │
│  POST webhook +     │    │  ├ Content Factory        │    │ pipeline_runs       │
│  pipeline_runs row  │    │  └ Validate & Persist     │    │                     │
│                     │    │                          │    │ NEW:                │
│ Usage dashboard     │<───│ Callbacks to dashboard   │    │ usage_metrics       │
│  reads usage_metrics│    │  (5 stage callbacks)     │    │                     │
└─────────────────────┘    └──────────────────────────┘    └─────────────────────┘
```

### Pattern 1: Client Context Injection (Already Established)

**What:** Init & Config V1.0 loads all client\_\* tables sequentially, then Build Session & Config code node assembles a complete client context object. This object is passed as sub-workflow return data to the Orchestrator, which forwards it to all downstream sub-workflows.

**When to use:** Every workflow that needs per-client configuration.

**How it works (verified from live workflow t8SewWvKUot2VjeT):**

```
Trigger -> Load Client -> Load Pillars -> Load Accounts -> Load CTA Config
  -> Load Client Config -> Load Platform Config -> Load Prompt Templates
  -> Load Brands -> Build Session & Config -> Log Pipeline Run -> Return Config
```

All 8 Supabase nodes filter by client_id. The Build Session & Config code node merges everything into a single session config object.

### Pattern 2: Multi-Client Schedule Loop (Already Established)

**What:** R&P Orchestrator schedule trigger fetches all active clients, loops through them one-by-one using SplitInBatches.

**How it works (verified from live workflow SDftDejLt1CSDHjB):**

```
Schedule Trigger -> Fetch Active Clients (HTTP GET clients?is_active=eq.true)
  -> Loop Clients (SplitInBatches) -> Set Client From Loop -> Configuration
  -> [full pipeline] -> Completion Summary -> Loop Clients (loop-back)
```

Webhook trigger path bypasses the loop and goes directly to Configuration with a specific client_id.

### Pattern 3: Callback-based Status Reporting (Already Established)

**What:** Each pipeline stage sends a callback to the dashboard via HTTP POST with stage data, client_id, and run_id.

**From Phase 19:** 5 callback HTTP Request nodes (CB Supabase Research, Strategy, Content, Persist, Final) fire after each stage.

### Pattern 4: Usage Metering via Callbacks

**What:** Extend the existing callback pattern to also log usage metrics. After each execution completes, log execution_count, content_items_generated, voice_minutes_used to a new usage_metrics table.

**New table needed:**

```sql
CREATE TABLE IF NOT EXISTS usage_metrics (
  id BIGSERIAL PRIMARY KEY,
  client_id TEXT NOT NULL REFERENCES clients(id),
  metric_type TEXT NOT NULL,  -- 'execution', 'content_item', 'voice_minute', 'render'
  quantity INTEGER NOT NULL DEFAULT 1,
  metadata JSONB,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_usage_metrics_client_date
  ON usage_metrics(client_id, recorded_at);

CREATE INDEX idx_usage_metrics_client_type
  ON usage_metrics(client_id, metric_type);
```

### Pattern 5: Credential Isolation via client_config

**What:** API keys and access tokens stored as client_config rows with config_key like `blotato_api_key`, `instagram_access_token`, `telegram_bot_token`, `telegram_chat_id`.

**Why:** The client_config table already exists with (client_id, config_key, config_value JSONB) schema. This is the natural place for per-client credentials rather than n8n credentials (which are instance-global).

**Security consideration:** Supabase encrypts at rest. RLS policies on client_config should restrict to service_role only (n8n uses service_role key). Dashboard reads through API routes with auth checks.

### Anti-Patterns to Avoid

- **Duplicating client config in Code nodes:** All config must come from Supabase client\_\* tables. Hardcoded values in Code nodes (like the current Posting Pipeline) create cross-client leakage risk.
- **Using n8n credentials for per-client API keys:** n8n credentials are instance-global. Per-client secrets must be in client_config and loaded at runtime.
- **Modifying the legacy R&P workflow (By1z95JFUqASZDBy):** The v1.0 pipeline (SKC-specific, 94 nodes) must remain untouched for backward compatibility. The v2.0 pipeline (R&P Orchestrator + sub-workflows) is the multi-tenant target.
- **Client data in workflow names or IDs:** Use client_id as runtime data, not as workflow identifiers. One workflow serves all clients.

## Don't Hand-Roll

| Problem                       | Don't Build                | Use Instead                                                                | Why                                                            |
| ----------------------------- | -------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Multi-client loop             | Custom iteration logic     | SplitInBatches + Fetch Active Clients pattern (proven Phase 19)            | Handles errors per client without stopping loop                |
| Workflow modification         | Manual n8n UI edits        | n8n MCP partial update API (mcp**n8n-docs**n8n_update_partial_workflow)    | Reproducible, scriptable, auditable                            |
| Per-client credential storage | Encrypted file or env vars | client_config table with config_key/config_value                           | Already exists, integrated with Init & Config loading          |
| Usage aggregation             | Custom SQL in Code nodes   | Supabase views or RPC functions                                            | Database-level aggregation is faster and reusable by dashboard |
| Client setup orchestration    | Manual seed scripts        | Dashboard onboarding wizard (Phase 20, already built) + validation webhook | Wizard already writes to all client\_\* tables                 |

**Key insight:** 80% of the multi-tenant infrastructure already exists. Init & Config loads per-client. The Orchestrator loops clients. content_items are client_id-scoped. The remaining work is parameterizing the downstream workflows that still have hardcoded SKC-specific values.

## Common Pitfalls

### Pitfall 1: Hardcoded Credentials in Content Posting Pipeline

**What goes wrong:** The "Configuration + Week Range" Code node in Content Posting Pipeline v2 has hardcoded Blotato account IDs (5874, 31104, 31105) and Telegram bot token. New clients would post to SKC accounts.

**Why it happens:** Pipeline was built for single-tenant SKC before multi-tenant was conceived.

**How to avoid:** Replace hardcoded values with a "Load Client Posting Config" Supabase query at the start of the pipeline. client_accounts.blotato_account_id already exists for this purpose.

**Warning signs:** All posts appearing under one client's social accounts regardless of which client triggered the pipeline.

### Pitfall 2: Instagram Access Token Scoping

**What goes wrong:** Daily Analytics Collector queries Instagram API with a single hardcoded access token. Different clients have different IG accounts requiring different tokens.

**Why it happens:** Current analytics workflows were built for SKC's 3 accounts only.

**How to avoid:** Store per-client IG access tokens in client_config (config_key: 'instagram_access_token'). Load per-client before the analytics loop. Each client may have multiple accounts -- the token must match the account.

**Warning signs:** 401 errors from Instagram API when processing non-SKC clients.

### Pitfall 3: pipeline_runs Table Schema Mismatch (Known Bug)

**What goes wrong:** Phase 19 verification found that pipeline_runs table lacks an `updated_at` column, but the webhook-status route sets `update.updated_at`. This causes PostgREST 400 errors.

**Why it happens:** Migration 018 recreated pipeline_runs without updated_at, but the API route and TypeScript type still reference it.

**How to avoid:** Fix before Phase 3 starts -- either add the column via migration or remove from webhook route and TypeScript type. This is a Phase 2 prerequisite fix.

**Warning signs:** Dashboard pipeline progress not updating after stage callbacks.

### Pitfall 4: Content Schedule vs Content Items Table Confusion

**What goes wrong:** Two content tables exist -- the legacy `content_schedule` (SKC-only, no client_id) and the new `content_items` (multi-tenant, has client_id). Mixing them causes data leakage.

**Why it happens:** Legacy v1.0 pipeline writes to content_schedule. v2.0 pipeline writes to content_items. Both are in production.

**How to avoid:** All Phase 3 work targets the v2.0 pipeline only. content_items table has proper client_id scoping. Never modify the legacy pipeline for multi-tenant.

### Pitfall 5: Notification Routing to Wrong Agency

**What goes wrong:** Error notifications go to a global Telegram chat instead of per-agency owner channels.

**Why it happens:** Telegram bot token and chat_id are hardcoded in workflow Code nodes.

**How to avoid:** Add notification_config to client_config with telegram_chat_id and/or slack_webhook_url per client. Error handler nodes read from client context.

### Pitfall 6: Double JSON.parse for Supabase JSONB

**What goes wrong:** Supabase JSONB columns sometimes return double-encoded strings (string containing JSON instead of parsed object).

**Why it happens:** Supabase PostgREST serialization behavior varies by client library.

**How to avoid:** Always handle both formats: `if (typeof raw === 'string') raw = JSON.parse(raw);` -- this is Key Lesson #11 from CLAUDE.md.

## Code Examples

### Loading Client Posting Config (Replacing Hardcoded Values)

```javascript
// In Content Posting Pipeline - replace "Configuration + Week Range" hardcoded values
// Source: client_accounts table (migration 007) + client_config table

// 1. Receive client_id from trigger
const clientId = $input.first().json.client_id || 'skc'

// 2. Load accounts from Supabase REST (pattern from Init & Config)
const accountsResponse = await $http.request({
  method: 'GET',
  url: `${SUPABASE_URL}/rest/v1/client_accounts?client_id=eq.${clientId}&is_active=eq.true`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
  },
})

// 3. Build account map (replaces hardcoded blotato IDs)
const accountMap = {}
for (const account of accountsResponse) {
  accountMap[account.id] = {
    blotato_account_id: account.blotato_account_id,
    posting_time: account.posting_time,
    platform: account.platform,
    handle: account.handle,
  }
}

// 4. Load notification config
const configResponse = await $http.request({
  method: 'GET',
  url: `${SUPABASE_URL}/rest/v1/client_config?client_id=eq.${clientId}&config_key=in.(telegram_bot_token,telegram_chat_id)`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
  },
})
```

### Usage Metering Callback Pattern

```javascript
// Add to each workflow completion point -- logs usage per client
// Pattern extends Phase 19 callback pattern

const clientId = $json.client_id
const runId = $json.run_id

// Log execution metric
await $http.request({
  method: 'POST',
  url: `${SUPABASE_URL}/rest/v1/usage_metrics`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  },
  body: JSON.stringify({
    client_id: clientId,
    metric_type: 'execution',
    quantity: 1,
    metadata: {
      workflow: 'r_and_p_pipeline',
      run_id: runId,
      items_generated: itemCount,
    },
  }),
})
```

### Multi-Client Analytics Loop Pattern

```javascript
// For Daily Analytics Collector / Weekly Performance Intelligence
// Add at start of workflow, before existing logic

// 1. Fetch all active clients with analytics enabled
const clients = await $http.request({
  method: 'GET',
  url: `${SUPABASE_URL}/rest/v1/clients?is_active=eq.true&select=id,name`,
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
  },
})

// 2. For each client, load their IG access token
for (const client of clients) {
  const tokenConfig = await $http.request({
    method: 'GET',
    url: `${SUPABASE_URL}/rest/v1/client_config?client_id=eq.${client.id}&config_key=eq.instagram_access_token`,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
    },
  })

  if (!tokenConfig.length) {
    console.log(`Skipping ${client.name} — no IG token configured`)
    continue
  }
  // ... proceed with analytics collection using client-specific token
}
```

## State of the Art

| Old Approach                          | Current Approach                                  | When Changed               | Impact                                          |
| ------------------------------------- | ------------------------------------------------- | -------------------------- | ----------------------------------------------- |
| Hardcoded SKC config in Code nodes    | client\_\* tables loaded by Init & Config V1.0    | Phase 07 (2026-03-13)      | Config is data-driven, not code-driven          |
| Single-tenant R&P pipeline (94 nodes) | Hub-and-spoke: Orchestrator + 5 sub-workflows     | Phase 08+ (2026-03-14)     | Multi-client loop possible                      |
| content_schedule (no client_id)       | content_items + content_briefs (client_id scoped) | Migration 008 (2026-03-13) | Data isolation by design                        |
| Manual client setup                   | Dashboard onboarding wizard (6-step, AI-assisted) | Phase 20 (2026-03-17)      | Client setup writes to all tables automatically |

**Still hardcoded (must fix in Phase 3):**

- Content Posting Pipeline v2: Blotato account IDs, Telegram config
- Daily Analytics Collector V1.0: IG access token, post queries
- Weekly Performance Intelligence V1.0: snapshot queries not client-scoped
- All Telegram notification nodes: bot token and chat_id

## Open Questions

1. **Where to store per-client API keys securely?**
   - What we know: client_config table exists with JSONB config_value. Supabase encrypts at rest. RLS can restrict to service_role.
   - What's unclear: Should sensitive keys (Blotato API key, IG access token) be in client_config plaintext, or use Supabase Vault (if available)?
   - Recommendation: Use client_config for now (service_role access only). Add encryption layer in v2 if needed. All n8n access uses service_role key already.

2. **How to handle clients without certain skills enabled?**
   - What we know: DASH-05 (Phase 2) adds skill activation toggles per client workspace.
   - What's unclear: How does n8n know which skills are enabled? Does it check skill_enabled flags per client before running a workflow?
   - Recommendation: Add `enabled_skills` array to client_config. Init & Config checks this and returns it in session config. Each sub-workflow checks if its skill is enabled before executing.

3. **Voice minutes metering -- where does Vapi data come from?**
   - What we know: Vapi webhook server exists in n8n. Voice agent infrastructure built in separate planning track.
   - What's unclear: How Vapi call duration data flows to Supabase usage_metrics. Vapi likely sends webhook callbacks with call metadata.
   - Recommendation: Add usage logging in the Vapi webhook handler workflow. Parse call_duration from Vapi payload and log to usage_metrics with metric_type='voice_minute'.

4. **Should Content Posting Pipeline be modified in-place or rebuilt?**
   - What we know: Current pipeline has 24 nodes with hardcoded values. It works for SKC in production.
   - What's unclear: Risk of breaking SKC production while parameterizing.
   - Recommendation: Modify in-place but keep hardcoded values as fallback defaults. Pattern: `const accountId = clientConfig?.blotato_account_id || '5874'` (SKC default). This allows gradual migration.

5. **Analytics workflow activation -- need IG tokens first?**
   - What we know: Daily Analytics and Weekly Performance are INACTIVE, waiting for IG token configuration.
   - What's unclear: Do founding member agencies have IG accounts ready with Graph API access?
   - Recommendation: Parameterize the workflows for multi-client, but keep them inactive until an agency client provides their IG access token. The multi-client loop should skip clients without tokens gracefully.

## Workflow Inventory (What Must Change)

### Must Modify

| Workflow                             | ID                    | Current State                          | Change Needed                                            |
| ------------------------------------ | --------------------- | -------------------------------------- | -------------------------------------------------------- |
| Content Posting Pipeline v2          | eTCSnh_m2CO7Kylal-4BZ | Hardcoded Blotato IDs, Telegram config | Load from client_accounts + client_config                |
| Daily Analytics Collector V1.0       | tIwqBmpgzNGZnVKT      | Hardcoded IG queries, inactive         | Add multi-client loop, load IG tokens from client_config |
| Weekly Performance Intelligence V1.0 | Pr4F6fzHh8RYwlnX      | Not client-scoped, inactive            | Scope queries to client_id, add client loop              |

### Must Create

| Workflow                 | Purpose                                                                   | Trigger                                                   |
| ------------------------ | ------------------------------------------------------------------------- | --------------------------------------------------------- |
| Agency Client Setup V1.0 | Validate new client config completeness, optionally trigger first R&P run | Webhook from dashboard after onboarding wizard activation |
| Usage Metering V1.0      | Aggregate and log execution metrics per client                            | Called as sub-workflow from Completion Summary nodes      |

### Already Multi-Tenant (No Changes Needed)

| Workflow               | ID                    | Why                                             |
| ---------------------- | --------------------- | ----------------------------------------------- |
| R&P Orchestrator V1.0  | SDftDejLt1CSDHjB      | Multi-client loop already built (Phase 19)      |
| Init & Config V1.0     | t8SewWvKUot2VjeT      | Loads all client\_\* tables per client_id       |
| Research Pipeline V1.0 | FiWwL19QnHmnUmtX      | Receives client context from Orchestrator       |
| Strategy Engine V1.0   | PPSfqfm1yRvG7s2a      | Receives client context from Orchestrator       |
| Content Factory V1.0   | 2Dl6ZnaImJXCHShb      | Receives client context from Orchestrator       |
| CarouselBuilder IG v2  | DG9U8Nv5GwzAJBSokgVUN | Invoked as sub-workflow, receives data from R&P |

## Sources

### Primary (HIGH confidence)

- Live n8n workflow inspection via MCP: Init & Config V1.0 (t8SewWvKUot2VjeT) -- 12 nodes, all client\_\* table loading verified
- Live n8n workflow inspection via MCP: R&P Orchestrator V1.0 (SDftDejLt1CSDHjB) -- 18 nodes, multi-client loop and callbacks verified
- Live n8n workflow inspection via MCP: Content Posting Pipeline v2 (eTCSnh_m2CO7Kylal-4BZ) -- 24 nodes, hardcoded config confirmed
- Live n8n workflow inspection via MCP: Daily Analytics Collector V1.0 (tIwqBmpgzNGZnVKT) -- 13 nodes, single-tenant confirmed
- Live n8n workflow inspection via MCP: Weekly Performance Intelligence V1.0 (Pr4F6fzHh8RYwlnX) -- 8 nodes, single-tenant confirmed
- Supabase migration 007 (multi-tenant config tables) -- 8 tables with client_id scoping
- Supabase migration 008 (content pipeline tables) -- content_items/content_briefs with client_id
- Phase 19 verification report -- multi-client pipeline dashboard, gaps documented
- Phase 20 verification report -- onboarding wizard, 11/11 truths verified
- FMai CLAUDE.md -- complete WAT architecture, production workflow documentation

### Secondary (MEDIUM confidence)

- Phase 19 summary 19-03 -- n8n callback pattern and multi-client loop implementation details
- Phase 04 analytics fundament -- Weekly Performance Intelligence design and SIA injection pattern
- n8n self-hosting migration plan -- workflow inventory with IDs and priorities

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - all tools already in production, versions verified from live workflows
- Architecture: HIGH - patterns verified from live n8n workflows via MCP inspection
- Pitfalls: HIGH - Phase 19 verification report documents known bugs; hardcoded values confirmed by workflow inspection

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable -- n8n Cloud, Supabase schema, and workflow architecture unlikely to change)
