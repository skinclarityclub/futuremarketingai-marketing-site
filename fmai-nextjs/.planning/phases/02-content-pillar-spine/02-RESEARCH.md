# Phase 2: Content-pillar spine - Research

**Researched:** 2026-06-02
**Domain:** Supabase data-seeding (cross-repo, fma-app), `fma_content_pillars` JSONB strategy-spine
**Confidence:** HIGH (table schema, FMai client_id, seed precedent, prompt_context contract all read directly from fma-app source)

## Summary

Phase 2 is a pure DATA-INSERT task in the **fma-app** Supabase project (`nurdldgqxseunotmygzn`), not a code or schema change. The `fma_content_pillars` table already exists (defined in `fma-app/supabase/migrations/089_content_quality_engine_schema.sql`, extended with `account_weights` in `117`). Both the table and a proven seed mechanism are in place: migration `117_skc_instagram_pillars.sql` and its idempotent Node companion `scripts/skc-pillars-import.mjs` seeded SKC's 5 pillars. Phase 2 mirrors that precedent for FutureMarketingAI's 4 pillars.

The single biggest planning question — "does FMai's `client_id` exist yet, or is this a chicken-and-egg with Phase 4 PUB-04?" — is **RESOLVED**. FMai's `fma_clients` row already exists with a hard-pinned canonical UUID. Two FK values are needed and both are known and live (confirmed in `supabase/migrations/20260610000000_dedup_smoke_org_clients_v2.sql`):

- **FMai `client_id` (canonical): `b7681463-cd1f-4212-87e0-c5174b3631d9`**
- **FMai `organization_id` (canonical): `ae336ca4-41ec-442d-b8cf-0a30bb53de1c`**

So Phase 2 is NOT blocked by Phase 4. PUB-04 ("FMai geregistreerd als fma_clients-rij") is about adding the **publishing config** to that existing client (target_site, GitHub token, brand-voice), not creating the bare client row. Phase 2 only inserts pillar rows under the already-existing client.

The `prompt_context` JSONB shape is a known, typed contract: `PillarPromptContext` in `fma-app/src/types/database.ts`, read at runtime by `src/lib/clyde/pillars.ts` (Clyde system-prompt injection) and `src/lib/narrative/pillars.ts` (social pipeline). WF7 (the blog engine, n8n `34PqLtFS`) is currently an OAuth-blocked stub and does NOT yet read pillars — its pillar-reading is Phase 6 work (ENG-03). Therefore the canonical reader contract Phase 2 must satisfy is the **existing fma-app `PillarPromptContext` shape** (topics[], funnel_stage as column, weight as column, plus doel/instagram_share/platform_gating/carousel_formats). Matching it now means WF7 can adopt it later with zero rework.

**Primary recommendation:** Write an idempotent Node seed script (`scripts/fmai-pillars-import.mjs`) modeled 1:1 on `skc-pillars-import.mjs`, using `@supabase/supabase-js` + service-role key from `fma-app/.env.local`, upserting 4 FMai pillar rows on `onConflict: 'client_id,slug'`. Verify with a read-back SELECT via the same client. Optionally also commit a parallel idempotent SQL migration (`119_fmai_content_pillars.sql`) as the canonical DR record, following the migration-117 template, but the script is the runnable mechanism.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PILR-01 | FMai content-pillars gedefinieerd in `fma_content_pillars` (GEO, AI marketing automation voor bureaus, agency-ops/proof, product/Clyde) als gedeelde strategie-spine | Table schema (089 migration), FMai client_id+org_id (resolved, live), seed precedent (117 + skc-pillars-import.mjs), prompt_context contract (`PillarPromptContext` in database.ts), pillar→blog-taxonomy map (BLOG_CATEGORIES from Phase 1). All four pillars insertable under existing FMai client with the documented row shape. |
</phase_requirements>

## User Constraints

No CONTEXT.md exists for this phase (no `/gsd:discuss-phase` run). Project-wide constraints from CLAUDE.md the planner MUST honor:

- **HARD RULE (CLAUDE.md): "NEVER modify n8n table schemas — READ-ONLY."** This phase INSERTS rows only. It must NOT `ALTER TABLE fma_content_pillars` or any other n8n-owned/shared schema. The `account_weights` column already exists (added in migration 117) — do NOT add it again. If a needed column were missing, that is a BLOCKER to report, not a schema change to plan. (Verified: no schema change is needed; all required columns exist.)
- **Cross-repo validation (CLAUDE.md):** changes in `fma-app` require validation in that repo. Since this writes to the live shared Supabase, run the seed against the live DB and read back the rows (DB-output check), per the "n8n altijd live run + DB-output checken" rule applied to the shared DB.
- **Positioning / key-phrase glossary (CLAUDE.md):** use "AI Marketing Medewerker" / "Clyde" (never "AI tool"/"platform"), "vaardigheden" (never "features"), "merken"/"klantportfolio" (never "klanten" for an agency's end-clients). Pillar `name`/`description`/`prompt_context` copy must respect this.
- **No em-dashes (—)** in any topic/copy string (NL/EN/ES). Use comma, period, colon. NOTE: SKC's existing pillar rows contain em-dashes in some `description`/`doel` strings — do NOT copy that habit; FMai rows must be em-dash-free.
- **NL is source-of-truth** for all topic strings. `name`, `description`, `prompt_context.topics[].title/hook/slide_lines` written in NL first.
- **Canonical domain** `future-marketing.ai`; pricing/brand SSoT in `fma-app/src/lib/skills.ts`.

## Critical Facts (the heart of this research)

### 1. `fma_content_pillars` table schema (HIGH — read from source)

Source: `fma-app/supabase/migrations/089_content_quality_engine_schema.sql:42-56`, plus `account_weights` added in `117_skc_instagram_pillars.sql:9-10`. TypeScript mirror: `fma-app/src/types/database.ts:3111` (`FmaContentPillar`).

| Column | Type | Null? | Default | Notes |
|--------|------|-------|---------|-------|
| `id` | UUID | NOT NULL | `gen_random_uuid()` | PK — let DB generate, do NOT hardcode |
| `client_id` | UUID | **NOT NULL** | — | FK → `fma_clients(id)`. Use FMai client_id (below) |
| `organization_id` | UUID | **NOT NULL** | — | FK → `fma_organizations(id)`. **Easy to miss — success criteria omit it but it is required.** Use FMai org_id (below) |
| `name` | TEXT | NOT NULL | — | Pillar display name (NL) |
| `slug` | TEXT | NOT NULL | — | Stable id, part of UNIQUE key |
| `description` | TEXT | nullable | — | NL, em-dash-free |
| `weight` | REAL | NOT NULL | `0.25` | Strategy weight; 4 pillars should sum to ~1.0 |
| `funnel_stage` | TEXT | NOT NULL | `'awareness'` | e.g. awareness / consideration / conversion |
| `color` | TEXT | nullable | `'#3B82F6'` | Hex UI color |
| `account_weights` | JSONB | nullable | `'{}'` | Per-account weight map. Added in migration 117. For FMai, keyed by FMai account_key(s) — see pitfall below |
| `prompt_context` | JSONB | nullable | `'{}'` | THE strategy payload — shape below |
| `is_active` | BOOLEAN | NOT NULL | `true` | Readers filter `is_active = true` |
| `created_at` | TIMESTAMPTZ | nullable | `now()` | — |

**Constraints / indexes:**
- `UNIQUE(client_id, slug)` — this is the upsert conflict target (`onConflict: 'client_id,slug'`).
- `CREATE INDEX idx_pillars_client ON fma_content_pillars(client_id) WHERE is_active;`
- **RLS enabled.** Policies: SELECT/INSERT/UPDATE/DELETE all gated by `is_org_member(organization_id)` (089 migration:188-192). **Implication:** an anon/user client cannot insert unless the caller is a member of the FMai org. The **service-role key bypasses RLS** — that is why the seed precedent uses the service-role key. Plan the insert via service role.

### 2. FMai's `client_id` — RESOLVED, not blocked (HIGH)

Source: `fma-app/supabase/migrations/20260610000000_dedup_smoke_org_clients_v2.sql:38-44,197` (hard-pinned canonical UUIDs, applied live) and `20260521000000_phase301_post_fixes_data_backfill.sql` (FMai org rename).

- **FMai canonical `client_id`: `b7681463-cd1f-4212-87e0-c5174b3631d9`** (active; smoke duplicate `ae5e04cd-...` marked `is_active=false`).
- **FMai canonical `organization_id`: `ae336ca4-41ec-442d-b8cf-0a30bb53de1c`** (`is_platform = true`, display_name "FutureMarketingAI").
- FMai client has `pipeline_client_id = 'fmai'`.

**Chicken-and-egg verdict:** NO blocker. The FMai client row exists today. ROADMAP Phase 4 PUB-04 ("FMai geregistreerd als fma_clients-rij + config") refers to attaching the **publishing config** (target_site → fmai-nextjs, GITHUB_TOKEN_FMAI, brand-voice), which is additive to the already-present row. Phase 2 inserts pillars under the existing client.

**RECOMMENDED resolution method for the planner:** do NOT hardcode the UUID as the only path. Follow the seed precedent: resolve the client_id at runtime by lookup (the SKC script uses `.contains('account_keys', ['skinclarity_club'])`). For FMai, look up by name and pick the canonical row, with the known UUID as an assertion/fallback. Two safe lookup options:
  - by name: `.in('name', ['Futuremarketingai','FutureMarketingAI','Future Marketing AI'])` then prefer the row whose `organization_id = ae336ca4-...` and `is_active = true`; OR
  - by id directly: `.eq('id', 'b7681463-cd1f-4212-87e0-c5174b3631d9')`.
  Always read `organization_id` from the resolved client row (don't hardcode separately) so the FK pair stays consistent. The plan should assert exactly one active FMai client resolves before inserting.

**VALIDATION the planner should require at execute time:** before inserting, run a SELECT to confirm `(id=b7681463-..., is_active=true, organization_id=ae336ca4-...)`. If the row is missing or ambiguous, STOP and report — do not invent a client row (creating an `fma_clients` row is Phase 4 territory and touches the client registry).

### 3. `prompt_context` shape — the WF7/reader contract (HIGH)

Source contract: `fma-app/src/types/database.ts` `PillarPromptContext` (line 3103) + `PillarTopic` (3087); runtime readers `fma-app/src/lib/clyde/pillars.ts` and `src/lib/narrative/pillars.ts`. Canonical filled example: every pillar in `117_skc_instagram_pillars.sql` and `scripts/skc-pillars-import.mjs`.

```ts
// PillarPromptContext (database.ts) — the JSONB the readers expect
interface PillarTopic {
  slug: string
  title: string
  hook: string
  slide_lines: string[]
  platform_gated: string[]
  open_lus_cta: string
  suggested_format: string
}
interface PillarCarouselFormat { slug: string; name: string; structure: string[] }
interface PillarPromptContext {
  doel?: string
  instagram_share?: string[]
  platform_gating?: string[]
  topics: PillarTopic[]          // the only required key
  carousel_formats?: PillarCarouselFormat[]
}
```

**How the readers actually consume it (so the plan matches the contract exactly):**
- `clyde/pillars.ts` (`formatPillarsForPrompt`): reads `pillar.name`, `pillar.funnel_stage`, `pillar.weight`, `pillar.description`, and `prompt_context.topics[].title` (slices first 12). It defensively defaults missing fields, so a sparse `prompt_context` won't crash, but topics is where the strategy lands.
- `narrative/pillars.ts` (`loadPillarsForClient`): selects `weight, account_weights, funnel_stage, color` columns; sorts by `account_weights[accountKey]` desc, fallback `weight` desc. So **weight + account_weights drive selection**; topics drive content.

**Success Criterion 2 mapping ("topics, funnel_stage, weight"):**
- `funnel_stage` and `weight` are **table columns** (not inside prompt_context) — both NOT NULL with defaults. Set them per pillar.
- `topics` live **inside `prompt_context`** as `topics[]` (PillarTopic objects). Each FMai pillar should have a small set of topics (the SKC rows carry 5-8). For a blog-first spine, the per-topic fields can be lighter than SKC's Instagram-carousel fields, but to satisfy the reader contract include at minimum `slug`, `title`, and `hook`; include `slide_lines`/`platform_gated`/`open_lus_cta`/`suggested_format` as optional richness (defensive readers tolerate empties). Keep the object shape identical to PillarTopic so the typed reader doesn't break.

**WF7 note (Phase 6, not now):** WF7 (`34PqLtFS`, n8n Blog Orchestrator) is an OAuth-blocked stub and does NOT yet read `fma_content_pillars` (confirmed in `FMai/.planning/SYSTEM_MAP.md`; ENG-03 is the future wiring). There is no separate "WF7 JSON shape" to match — when WF7 is wired in Phase 6 it will consume the same `PillarPromptContext`/column shape the fma-app loaders already use. Matching that shape now is exactly what Success Criterion 2 ("later door WF7 geladen kan worden") requires.

### 4. The four FMai pillars → blog-taxonomy map (HIGH for taxonomy, MEDIUM for copy)

Phase-1 blog taxonomy (`fmai-nextjs/src/lib/blog.ts` `BLOG_CATEGORIES`, per Phase 1 research + STATE decision 01-03): `geo`, `ai-marketing-automation`, `agency-ops`, `comparisons`, `guides`. The `/resources` hub buckets on the first three strategic categories.

Recommended pillar → category map (1:1 onto Phase-3 cornerstone clusters, Success Criterion 3):

| FMai pillar (PILR-01) | Suggested `slug` | Blog category | Phase-3 cornerstone(s) that map here | Taxonomy fit |
|-----------------------|------------------|---------------|--------------------------------------|--------------|
| GEO | `geo` | `geo` | CONT-01 GEO pillar-gids; CONT-02 GEO vs SEO; CONT-03 meten in AI Overviews; CONT-04 GEO monitoring tools | EXACT — category exists |
| AI marketing automation voor bureaus | `ai-marketing-automation` | `ai-marketing-automation` | CONT-05 AI marketing automation voor bureaus pillar; CONT-06 Wat is een AI Marketing Medewerker (Clyde) | EXACT — category exists |
| Agency-ops / proof | `agency-ops` | `agency-ops` | (proof / SKC-case / tier-caps content) | EXACT — category exists |
| Product / Clyde | `product-clyde` | **MISMATCH — no dedicated blog category** | CONT-07 comparison "Clyde vs Jasper vs ChatGPT vs Semrush" | See note |

**Taxonomy mismatch to flag (Success Criterion 3 risk):** "product/Clyde" has **no existing blog category**. Two clean options, pick in plan:
  - (A) Keep "product/Clyde" as its own pillar row (slug `product-clyde`), and map its Phase-3 cornerstone (the Clyde comparison money-page, CONT-07) to the existing **`comparisons`** blog category. The pillar still exists 1:1; only the article's blog-category tag differs from the pillar slug. This keeps the 4-pillar strategy intact and avoids a wees-cluster.
  - (B) Fold "product/Clyde" content under `ai-marketing-automation` (since CONT-06 "Wat is een AI Marketing Medewerker (Clyde)" already lives there) and drop a separate product pillar. This reduces to 3 pillars and contradicts PILR-01's explicit "product/Clyde" item.
  **Recommendation: Option A** — 4 pillar rows matching PILR-01 verbatim; document that the Clyde pillar's cornerstone uses the `comparisons` blog category. This satisfies "geen wees-cluster zonder pillar" because every Phase-3 cluster maps to a pillar; the blog-category label is a separate axis from the pillar slug.

**Slug stability:** choose slugs once and never change them — Phase 6 will reference pillars by id/slug via `pillar_id`. Recommended slugs: `geo`, `ai-marketing-automation`, `agency-ops`, `product-clyde`. Aligning the first three to `BLOG_CATEGORIES` ids keeps blog↔resources↔pillars structurally aligned (mirrors STATE decision 01-03).

### 5. HOW to insert the rows — mechanism (HIGH, follows precedent)

**Established precedent (use this):** SKC pillars were seeded BOTH as a SQL migration (`117_skc_instagram_pillars.sql`) AND a runnable idempotent Node script (`scripts/skc-pillars-import.mjs`). The script is the actual run mechanism; the migration is the canonical DR/code-review record.

Script pattern (from `skc-pillars-import.mjs`, verbatim approach):
- `import { createClient } from '@supabase/supabase-js'`
- Load `fma-app/.env.local` explicitly via `dotenv` (`config({ path: join(__dirname,'..','.env.local') })`) — note: `.env.local`, not `.env`.
- Read `process.env.NEXT_PUBLIC_SUPABASE_URL` and `process.env.SUPABASE_SERVICE_ROLE_KEY` (bypasses RLS). **Never print these values.**
- `createClient(url, serviceKey, { auth: { persistSession: false } })`.
- Resolve FMai client_id + organization_id by lookup (see fact 2).
- Upsert pillars: `supabase.from('fma_content_pillars').upsert(pillars, { onConflict: 'client_id,slug' })`.
- Idempotent by construction (upsert on the UNIQUE key) — safe to re-run.

**Credentials/connection path (do not print secret values):**
- File: `C:/Users/daley/Desktop/fma-app/.env.local`
- Env var names: `NEXT_PUBLIC_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (also `NEXT_PUBLIC_SUPABASE_ANON_KEY` exists but anon cannot insert under RLS).
- Supabase project ref: `nurdldgqxseunotmygzn` (per PROJECT.md / CLAUDE.md).
- Admin-client convention in app code: `fma-app/src/lib/supabase/server.ts` `createAdminClient()`.

**Where the script lives:** `C:/Users/daley/Desktop/fma-app/scripts/fmai-pillars-import.mjs` (cross-repo — the script and any SQL migration belong in fma-app, not fmai-nextjs, because that is where the DB, env, and migration history live).

**Migration-apply caveat (do NOT auto-push):** Both `20260525000000` and `20260610000000` migration headers explicitly say *"DO NOT apply via `supabase db push`"* — fma-app applies these manually via Supabase Studio or the Management API. So if a SQL migration is also produced, it is a record artifact; the **runnable insert is the Node script** against the live DB. Do not run `supabase db push`.

**Mechanism options ranked:**
| Option | Verdict |
|--------|---------|
| Idempotent Node script + service-role key (precedent) | **RECOMMENDED** — runnable, idempotent, matches `skc-pillars-import.mjs` exactly |
| Parallel idempotent SQL migration (`119_fmai_content_pillars.sql`, `ON CONFLICT (client_id,slug) DO UPDATE`) | Optional companion for DR/code-review record; do NOT `db push` |
| Supabase MCP / Studio dashboard manual insert | Possible but not idempotent/reproducible; reject for a 4-row strategic spine |
| n8n insert | Reject — n8n is READ-ONLY for schema and this is a one-shot seed, not pipeline work |

### 6. Verification mechanism (HIGH)

The plan needs a concrete, runnable read-back. Use the same service-role client to SELECT and assert:

```js
const { data, error } = await supabase
  .from('fma_content_pillars')
  .select('slug, name, weight, funnel_stage, is_active, prompt_context, organization_id, client_id')
  .eq('client_id', FMAI_CLIENT_ID)
  .eq('is_active', true)
  .order('weight', { ascending: false })
// Assert: exactly 4 active rows, slugs == [geo, ai-marketing-automation, agency-ops, product-clyde],
// each organization_id === FMAI_ORG_ID, each prompt_context.topics is a non-empty array,
// funnel_stage and weight set on every row, weights sum ~1.0.
```

This exercises the SAME query shape the live readers use (`clyde/pillars.ts` filters `organization_id`+`client_id`+`is_active`, orders by weight desc). Passing it proves the readers will see the rows.

**End-to-end reader smoke (stronger, optional):** call `getPillarContext(FMAI_ORG_ID, FMAI_CLIENT_ID)` from a tiny script (it returns `{ pillars, formattedSection }`) and assert `formattedSection` contains the 4 pillar names + topic titles. This proves Success Criterion 2 ("later door WF7 geladen kan worden") against the real reader, not just raw SQL.

## Standard Stack

No new libraries. Everything needed already exists in fma-app.

| Library | Version | Purpose | Why standard |
|---------|---------|---------|--------------|
| `@supabase/supabase-js` | as in fma-app | service-role insert + read-back | exact precedent (`skc-pillars-import.mjs`) |
| `dotenv` | as in fma-app | load `.env.local` | precedent |
| Node ESM (`.mjs`) | Node 18+ | runnable seed script | precedent |

## Architecture Patterns

### Pattern: idempotent service-role seed script (the one pattern that matters)
**What:** Standalone `.mjs` that resolves the client FK pair, then `upsert(..., { onConflict: 'client_id,slug' })`.
**Why:** RLS blocks anon/user inserts (`is_org_member(organization_id)`); service-role bypasses. Upsert-on-unique = safe re-runs.
**Skeleton (mirror of `fma-app/scripts/skc-pillars-import.mjs`):**
```js
import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'; import { dirname, join } from 'path'; import { fileURLToPath } from 'url'
const __dirname = dirname(fileURLToPath(import.meta.url))
config({ path: join(__dirname, '..', '.env.local') })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } }
)
// resolve FMai client (by id or name), read organization_id from the row, assert single active row
// build 4 pillar objects { client_id, organization_id, name, slug, description, weight, funnel_stage, color, account_weights, prompt_context, is_active }
const { error } = await supabase.from('fma_content_pillars').upsert(pillars, { onConflict: 'client_id,slug' })
// then SELECT read-back + assertions
```

### Anti-patterns to avoid
- **Hardcoding `id`** (the row PK) — let `gen_random_uuid()` fill it. Only hardcode/lookup the FK `client_id`/`organization_id`.
- **Forgetting `organization_id`** — NOT NULL, omitted from the success criteria but enforced by the table and RLS. Insert fails or RLS rejects without it.
- **Adding `account_weights` via ALTER** — column already exists (migration 117). Never re-add; never ALTER the table.
- **Inserting with anon key** — RLS `is_org_member` will reject. Use service role.
- **`supabase db push`** — fma-app applies migrations manually; pushing risks the migration-ordering issues those headers warn about.
- **Copying SKC's em-dashes** — SKC pillar `description`/`doel` strings contain `—`; FMai copy must be em-dash-free per CLAUDE.md.
- **Changing slugs later** — Phase 6 `pillar_id` references depend on stable identity.

## Don't Hand-Roll

| Problem | Don't build | Use instead | Why |
|---------|-------------|-------------|-----|
| DB connection + auth | Raw `pg`/psql connection string | `@supabase/supabase-js` + service-role key from `.env.local` | exact precedent; handles RLS bypass + PostgREST |
| Idempotency | Custom "exists?" checks | `upsert(..., { onConflict: 'client_id,slug' })` | UNIQUE(client_id,slug) makes upsert idempotent for free |
| client_id discovery | Guessing UUID | runtime lookup by name/id with assertion (known UUID `b7681463-...`) | survives DB rebuilds; precedent uses lookup |
| prompt_context shape | Inventing a JSON schema | copy `PillarPromptContext` / `PillarTopic` from `database.ts` | matches the live reader contract exactly |

**Key insight:** This phase is "fill in the SKC template with FMai content." The mechanism, schema, FK ids, and reader contract are all already proven in fma-app. The real work is authoring 4 strong, on-brand, em-dash-free NL pillar definitions (and their topics) that map cleanly onto the Phase-1 taxonomy and Phase-3 cornerstones.

## Common Pitfalls

### Pitfall 1: `account_weights` keying for FMai
**What goes wrong:** `account_weights` is keyed by `account_key` (e.g. SKC uses `skinclarity_club`, `sindy_huidtherapeut`). `narrative/pillars.ts` sorts pillars by `account_weights[accountKey]`. FMai's account_key(s) are not yet confirmed in this research.
**How to avoid:** For a blog-first spine, `weight` (the top-level column) is the primary selector and is sufficient — `narrative/pillars.ts` falls back to `weight` when no account-specific weight exists. Set `account_weights = {}` (the default) OR key it by FMai's pipeline_client_id `'fmai'` / a confirmed FMai account_key. **Plan step:** look up FMai's `account_keys` array on the client row first; if unknown, default `account_weights` to `{}` and rely on `weight`. Not a blocker — graceful fallback exists.
**Warning sign:** plan tries to invent FMai account_key strings.

### Pitfall 2: `organization_id` omitted
**What goes wrong:** Success criteria say "under FMai's client_id" but the table also requires `organization_id` (NOT NULL + RLS). Insert fails or is RLS-rejected.
**How to avoid:** Always read `organization_id` from the resolved FMai client row and include it in every pillar object. (`ae336ca4-41ec-442d-b8cf-0a30bb53de1c`.)

### Pitfall 3: weights don't sum to 1.0
**What goes wrong:** 4 pillars with arbitrary weights skew downstream selection.
**How to avoid:** Choose weights that sum to ~1.0 (e.g. GEO 0.35, AI-automation 0.30, agency-ops 0.20, product-clyde 0.15) reflecting strategic priority (GEO is the program's lead theme). Document the rationale in the plan.

### Pitfall 4: wrong repo
**What goes wrong:** Putting the seed script/migration in `fmai-nextjs`. The DB, env, migration history, and readers all live in `fma-app`.
**How to avoid:** Script + any SQL migration go in `C:/Users/daley/Desktop/fma-app/`. This is cross-repo work; commit there, validate against the live shared DB.

### Pitfall 5: stale/duplicate FMai client rows
**What goes wrong:** A smoke-test FMai client (`ae5e04cd-...`, `is_active=false`) still exists. Inserting under it would orphan the pillars (Phase 314/dedup history shows this exact bug).
**How to avoid:** Resolve to the **active** canonical client only (`is_active=true`, id `b7681463-...`, org `ae336ca4-...`). Assert exactly one active FMai client before inserting.

## State of the Art

| Old approach | Current approach | Impact |
|--------------|------------------|--------|
| SKC pillars seeded ad hoc | Migration 117 + idempotent companion script + `account_weights` per-account model | Reproducible, idempotent, multi-account-aware; FMai mirrors this |
| Pillars consumed only by social/Clyde | Spine intended for blog too (Phase 6 ENG-03 will add `pillar_id` + WF7 read) | Phase 2 lays the spine; readers stay backward-compatible |

## Open Questions

1. **FMai `account_keys` value(s)?**
   - Known: client row exists; `pipeline_client_id = 'fmai'`. SKC uses `skinclarity_club`/`skinclarity_shop`/`sindy_huidtherapeut`.
   - Unclear: exact `account_keys` array on the FMai client row.
   - Recommendation: SELECT `account_keys` from the FMai client at execute time. If present, key `account_weights` by it; if empty/unknown, set `account_weights = {}` and rely on top-level `weight` (readers fall back). Not blocking.

2. **Topic depth per FMai pillar?**
   - Known: SKC rows carry 5-8 rich Instagram-carousel topics. FMai's near-term consumer is the blog/cornerstone (Phase 3), not carousels.
   - Unclear: how many topics and how rich each should be for a blog-first spine.
   - Recommendation: 3-6 topics per pillar, each a real Phase-3 cornerstone candidate (e.g. GEO pillar topics = "wat is GEO", "GEO vs SEO", "meten in AI Overviews", "GEO monitoring tools" — i.e. CONT-01..04). Minimum fields `slug/title/hook`; richer carousel fields optional. This makes the spine directly drive Phase-3 1:1 (Success Criterion 3).

3. **Also commit a SQL migration, or script-only?**
   - Recommendation: script is mandatory (runnable). A parallel idempotent `119_fmai_content_pillars.sql` is a nice-to-have DR record matching the 117 precedent, but do NOT `db push` it. Planner's call; not required to satisfy PILR-01.

## Sources

### Primary (HIGH confidence — read directly)
- `fma-app/supabase/migrations/089_content_quality_engine_schema.sql` — table DDL (cols, types, UNIQUE, index, RLS policies)
- `fma-app/supabase/migrations/117_skc_instagram_pillars.sql` — `account_weights` column add + 5-pillar seed precedent (SQL form, idempotent upsert)
- `fma-app/scripts/skc-pillars-import.mjs` — runnable idempotent seed precedent (service-role + `.env.local` + upsert onConflict)
- `fma-app/supabase/migrations/20260610000000_dedup_smoke_org_clients_v2.sql` — hard-pinned canonical FMai client_id `b7681463-...` + org `ae336ca4-...` + `pipeline_client_id='fmai'`
- `fma-app/supabase/migrations/20260521000000_phase301_post_fixes_data_backfill.sql` + `20260521020000_phase301_fix_fmai_org_slug.sql` — FMai org identity (`ae336ca4-...`, FutureMarketingAI, is_platform)
- `fma-app/src/types/database.ts` (lines 3087-3125) — `PillarTopic`, `PillarPromptContext`, `FmaContentPillar` (the reader contract)
- `fma-app/src/lib/clyde/pillars.ts` + `src/lib/narrative/pillars.ts` — runtime readers (query shape, fields consumed, weight/account_weights selection)
- `fma-app/src/lib/supabase/server.ts` — `createAdminClient()` env var names
- `FMai/.planning/SYSTEM_MAP.md` (lines 171, 228) — WF7 = Blog Orchestrator `34PqLtFS`, OAuth-blocked stub, no pillar read yet
- `fmai-nextjs/.planning/{REQUIREMENTS,ROADMAP,PROJECT,STATE}.md` + `phases/01-.../01-RESEARCH.md` — BLOG_CATEGORIES taxonomy, phase deps

### Secondary
- `fma-app/supabase/migrations/20260525000000_phase314_merge_duplicate_fma_clients.sql` — confirms `fma_content_pillars` is FK-bound to `fma_clients`, dedup history

### Tertiary
- None.

## Metadata

**Confidence breakdown:**
- Table schema: HIGH — read from DDL migration + TS mirror.
- FMai client_id / org_id (blocker resolution): HIGH — hard-pinned in applied dedup migration; should be confirmed live at execute time via SELECT (cheap, recommended).
- prompt_context contract: HIGH — typed in database.ts + two live readers + filled precedent.
- Seed mechanism: HIGH — exact runnable precedent exists.
- Pillar→taxonomy map: HIGH for the 3 matching categories; the "product/Clyde" mismatch is a real flagged decision (Option A recommended).
- Pillar copy/weights/topic depth: MEDIUM — authoring decisions for the plan, constrained by glossary + em-dash rules.

**Research date:** 2026-06-02
**Valid until:** 2026-07-02 (stable; re-verify the live FMai client row at execute time since it is shared-DB state).
