---
title: Research - Supabase Blog Schema for Multi-Tenant Blog Factory
tags: #research #supabase #blog-factory #schema #multi-tenant
created: 2026-03-17
source: Web research (PostgreSQL docs, Supabase docs, community guides)
---

# Supabase Blog Schema Research

Research findings for building a multi-tenant blog content management system in Supabase, powering a blog factory SaaS where each client organization has their own blogs.

---

## 1. Multi-Tenant Schema Design & RLS Policies

### Recommended Pattern: Shared Tables with org_id

Use a single set of shared tables with an `org_id` column on every tenant-scoped table. This is the standard Supabase pattern and works well for up to thousands of tenants. Schema-per-tenant provides stronger isolation but adds massive operational complexity (migrations must run per-schema) and is only justified for enterprise compliance requirements.

### Table Structure

```sql
-- Organizations table (tenants)
CREATE TABLE organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Blog articles - core content table
CREATE TABLE blog_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),

  -- Core content (separate columns for queryable fields)
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  body TEXT,                          -- Main content (markdown/HTML)

  -- Status workflow
  status TEXT NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'review', 'approved', 'published', 'archived')),
  review_status TEXT DEFAULT 'pending'
    CHECK (review_status IN ('pending', 'in_review', 'approved', 'rejected', 'needs_revision')),

  -- SEO fields (separate columns - queried frequently)
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT[],
  canonical_url TEXT,

  -- Flexible metadata (JSONB for sparse/variable fields)
  metadata JSONB DEFAULT '{}',        -- social sharing, custom fields, og_image, etc.

  -- Scoring (populated by RPC functions)
  seo_score INTEGER DEFAULT 0,
  readability_score INTEGER DEFAULT 0,

  -- Versioning
  version INTEGER NOT NULL DEFAULT 1,

  -- Timestamps
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id),

  -- Composite unique constraint
  UNIQUE(org_id, slug)
);

-- Categories (per-org)
CREATE TABLE blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  parent_id UUID REFERENCES blog_categories(id),
  UNIQUE(org_id, slug)
);

-- Tags (per-org)
CREATE TABLE blog_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  UNIQUE(org_id, slug)
);

-- Junction tables
CREATE TABLE blog_article_categories (
  article_id UUID REFERENCES blog_articles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES blog_categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

CREATE TABLE blog_article_tags (
  article_id UUID REFERENCES blog_articles(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, tag_id)
);

-- Media assets (linked to articles)
CREATE TABLE blog_media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES organizations(id),
  article_id UUID REFERENCES blog_articles(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,         -- Supabase Storage path
  filename TEXT NOT NULL,
  mime_type TEXT,
  size_bytes INTEGER,
  alt_text TEXT,
  metadata JSONB DEFAULT '{}',       -- dimensions, blurhash, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### Indexing Strategy

```sql
-- Composite indexes for tenant-scoped queries (always lead with org_id)
CREATE INDEX idx_articles_org_status ON blog_articles(org_id, status);
CREATE INDEX idx_articles_org_published ON blog_articles(org_id, published_at DESC)
  WHERE status = 'published';       -- Partial index: only published articles
CREATE INDEX idx_articles_org_review ON blog_articles(org_id, review_status)
  WHERE status = 'review';          -- Partial index: only articles in review
CREATE INDEX idx_articles_org_slug ON blog_articles(org_id, slug);

-- Index columns used in RLS policies
CREATE INDEX idx_articles_org_id ON blog_articles(org_id);
CREATE INDEX idx_media_org_id ON blog_media(org_id);

-- GIN index for JSONB metadata queries
CREATE INDEX idx_articles_metadata ON blog_articles USING GIN (metadata jsonb_path_ops);
```

### RLS Policies

Best practice: store `org_id` in the JWT as a custom claim via Supabase Auth Hook, then reference it in policies. This avoids subqueries on every row check.

```sql
-- Enable RLS
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_media ENABLE ROW LEVEL SECURITY;

-- Extract org_id from JWT custom claims (set via Auth Hook)
-- auth.jwt() ->> 'org_id' returns the org_id claim from the JWT

-- SELECT policy
CREATE POLICY "Users can read their organization's articles"
  ON blog_articles FOR SELECT
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid);

-- INSERT policy
CREATE POLICY "Users can create articles in their organization"
  ON blog_articles FOR INSERT
  WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);

-- UPDATE policy
CREATE POLICY "Users can update their organization's articles"
  ON blog_articles FOR UPDATE
  USING (org_id = (auth.jwt() ->> 'org_id')::uuid)
  WITH CHECK (org_id = (auth.jwt() ->> 'org_id')::uuid);

-- DELETE policy (optional: restrict to admins)
CREATE POLICY "Admins can delete articles"
  ON blog_articles FOR DELETE
  USING (
    org_id = (auth.jwt() ->> 'org_id')::uuid
    AND (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

-- Service role bypass: n8n and other backends use the service_role key,
-- which bypasses RLS entirely. No special policy needed for backend operations.
```

**Key points:**

- Use `raw_app_meta_data` or Auth Hooks for claims -- never `user_metadata` (users can modify it)
- Index every column referenced in RLS policies
- Service role key (used by n8n) bypasses RLS automatically
- Keep policies simple to avoid performance overhead on every query

### JSONB vs Separate Columns Decision

| Use separate columns for                          | Use JSONB `metadata` for                       |
| ------------------------------------------------- | ---------------------------------------------- |
| Fields queried in WHERE clauses (status, slug)    | Social sharing config (og_image, twitter_card) |
| Fields used in ORDER BY (published_at, seo_score) | Custom per-org fields                          |
| Fields updated independently (version, scores)    | Schema-flexible data that varies by client     |
| Fields in RLS policies (org_id)                   | Rarely queried configuration                   |
| Fields in indexes (seo_keywords)                  | A/B test variants, feature flags               |

**Hybrid model is the consensus best practice:** core fields as typed columns, flexible remainder in JSONB. Key reason: every `jsonb_set()` rewrites the entire JSONB document, so frequently-updated fields should be separate columns.

---

## 2. Content Versioning

### Recommended: Separate Versions Table with Full Snapshots

A JSONB array in the article row gets unwieldy and rewrites the whole document on every version bump. A separate table is better for querying, indexing, and storage.

```sql
CREATE TABLE blog_article_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID NOT NULL REFERENCES blog_articles(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,

  -- Full snapshot of content at this version
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  excerpt TEXT,
  seo_title TEXT,
  seo_description TEXT,
  metadata JSONB DEFAULT '{}',

  -- Change context
  change_summary TEXT,                -- Optional human-readable summary
  changed_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),

  UNIQUE(article_id, version)
);

CREATE INDEX idx_versions_article ON blog_article_versions(article_id, version DESC);
```

### Auto-Versioning Trigger

```sql
CREATE OR REPLACE FUNCTION create_article_version()
RETURNS TRIGGER AS $$
BEGIN
  -- Only version if content actually changed
  IF OLD.title IS DISTINCT FROM NEW.title
     OR OLD.body IS DISTINCT FROM NEW.body
     OR OLD.excerpt IS DISTINCT FROM NEW.excerpt
     OR OLD.metadata IS DISTINCT FROM NEW.metadata
  THEN
    INSERT INTO blog_article_versions (
      article_id, version, title, body, excerpt,
      seo_title, seo_description, metadata, changed_by
    ) VALUES (
      OLD.id, OLD.version, OLD.title, OLD.body, OLD.excerpt,
      OLD.seo_title, OLD.seo_description, OLD.metadata, NEW.updated_by
    );

    -- Increment version counter
    NEW.version := OLD.version + 1;
    NEW.updated_at := now();
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_article_version
  BEFORE UPDATE ON blog_articles
  FOR EACH ROW
  EXECUTE FUNCTION create_article_version();
```

### Rollback Mechanism

```sql
-- RPC function to restore a previous version
CREATE OR REPLACE FUNCTION restore_article_version(
  p_article_id UUID,
  p_version INTEGER
)
RETURNS blog_articles AS $$
DECLARE
  v_record blog_article_versions;
  v_result blog_articles;
BEGIN
  SELECT * INTO v_record
  FROM blog_article_versions
  WHERE article_id = p_article_id AND version = p_version;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Version % not found for article %', p_version, p_article_id;
  END IF;

  UPDATE blog_articles SET
    title = v_record.title,
    body = v_record.body,
    excerpt = v_record.excerpt,
    seo_title = v_record.seo_title,
    seo_description = v_record.seo_description,
    metadata = v_record.metadata
  WHERE id = p_article_id
  RETURNING * INTO v_result;

  RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
```

**Full snapshots vs diffs:** Full snapshots are recommended. They use more storage but make rollback trivial (just copy the row back) and avoid the complexity of applying/reverting diff chains. Storage is cheap; developer time is not. For a blog CMS, article bodies are typically 5-20KB -- even 100 versions is only 2MB per article.

---

## 3. Full-Text Search for Dutch Content

### Dutch Language Configuration

PostgreSQL ships with a built-in `dutch` text search configuration that includes Dutch stemming and stop word removal.

```sql
-- Test Dutch stemming
SELECT to_tsvector('dutch', 'De huidverzorging begint met een goede reiniging');
-- Result: 'goed':6 'huidverzorg':2 'reinig':8  (stemmed, stop words removed)

-- Add a generated tsvector column that auto-updates
ALTER TABLE blog_articles ADD COLUMN
  search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('dutch', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('dutch', coalesce(excerpt, '')), 'B') ||
    setweight(to_tsvector('dutch', coalesce(body, '')), 'C') ||
    setweight(to_tsvector('dutch', coalesce(seo_title, '')), 'B')
  ) STORED;

-- GIN index for fast search
CREATE INDEX idx_articles_search ON blog_articles USING GIN (search_vector);
```

### Search Query Examples

```sql
-- Basic Dutch search
SELECT id, title, ts_rank(search_vector, query) AS rank
FROM blog_articles,
     to_tsquery('dutch', 'huidverzorging & acne') AS query
WHERE search_vector @@ query
  AND org_id = 'some-org-id'
ORDER BY rank DESC
LIMIT 20;

-- Prefix matching (autocomplete)
SELECT id, title
FROM blog_articles
WHERE search_vector @@ to_tsquery('dutch', 'huid:*')
  AND org_id = 'some-org-id';
```

### Supabase Client-Side Usage

```typescript
// Using Supabase JS client's built-in textSearch
const { data } = await supabase
  .from('blog_articles')
  .select('id, title, excerpt')
  .textSearch('search_vector', 'huidverzorging & acne', {
    config: 'dutch',
    type: 'websearch', // Allows natural language queries
  })
  .order('published_at', { ascending: false })
  .limit(20)
```

### Fuzzy Matching Complement

For typo-tolerant search (important for user-facing search), add `pg_trgm`:

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_articles_title_trgm ON blog_articles USING GIN (title gin_trgm_ops);

-- Fuzzy search on title
SELECT id, title, similarity(title, 'huidvezorging') AS sim
FROM blog_articles
WHERE title % 'huidvezorging'  -- trigram similarity > threshold
  AND org_id = 'some-org-id'
ORDER BY sim DESC;
```

**Recommendation:** Use the `dutch` tsvector configuration as the primary search mechanism, with `pg_trgm` as a complement for fuzzy/typo matching. The generated column approach keeps the search vector always in sync without application code.

---

## 4. Realtime Subscriptions for Content Status

### How It Works

Supabase Realtime uses PostgreSQL's logical replication to detect changes and push them over WebSockets. For a blog CMS dashboard, **Postgres Changes** is the right mode (not Broadcast or Presence).

### Setup

1. Enable Realtime on the `blog_articles` table in Supabase Dashboard > Database > Publications > `supabase_realtime`
2. RLS policies apply to Realtime -- users only receive changes for rows they have access to

### React/Next.js Client Implementation

```typescript
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'

function useArticleStatusUpdates(orgId: string, onStatusChange: (payload: any) => void) {
  useEffect(() => {
    const channel = supabase
      .channel('article-status-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'blog_articles',
          filter: `org_id=eq.${orgId}`, // Filter by organization
        },
        (payload) => {
          // Only fire callback if status actually changed
          if (
            payload.old.status !== payload.new.status ||
            payload.old.review_status !== payload.new.review_status
          ) {
            onStatusChange(payload)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orgId])
}
```

### n8n Integration Flow

When n8n completes content review/processing:

1. n8n uses the **service_role** key to update `blog_articles.review_status`
2. This bypasses RLS but still triggers the Realtime publication
3. The dashboard client receives the change via WebSocket
4. UI updates in real-time (e.g., badge changes from "In Review" to "Approved")

### Performance Considerations

- Every change event is checked against subscribed users' RLS policies -- with 100 subscribers, 1 update = 100 RLS checks
- For a multi-tenant SaaS, this is fine because each org typically has <10 concurrent dashboard users
- Use column filters if you only need specific fields: `filter: 'status=eq.review'` reduces noise
- Supabase Realtime scales well for this use case (low-frequency status changes, not high-throughput)

---

## 5. Storage for Blog Images

### Bucket Organization

```
blog-images/
  {org_id}/
    {article_id}/
      hero.webp
      inline-1.webp
      ...
    shared/
      logo.webp
      author-photo.webp
```

Use a **single bucket** with path-based organization. Multiple buckets per tenant adds management overhead without benefit since Storage policies can filter on path.

### Storage Policies

```sql
-- Allow users to read images from their org
CREATE POLICY "Org members can read their images"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'blog-images'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );

-- Allow uploads to their org folder
CREATE POLICY "Org members can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'blog-images'
    AND (storage.foldername(name))[1] = (auth.jwt() ->> 'org_id')
  );
```

### Public vs Signed URLs

| Approach                  | Use case                                          |
| ------------------------- | ------------------------------------------------- |
| **Public bucket**         | Published blog images (better CDN cache hit rate) |
| **Private + signed URLs** | Draft images, watermarked previews                |

**Recommendation:** Use a **public bucket** for blog images. Blog images are meant to be publicly visible once published. Public buckets get better CDN performance because caching isn't per-user. Control access at the upload/delete level with Storage policies.

### Image Transformations

Supabase Storage includes built-in image transformation (resize, format conversion). Images are auto-optimized to WebP when the client supports it.

```typescript
// Get transformed image URL
const { data } = supabase.storage.from('blog-images').getPublicUrl('org-123/article-456/hero.jpg', {
  transform: {
    width: 800,
    height: 400,
    resize: 'cover',
    quality: 80,
  },
})
```

### CDN

Supabase includes Smart CDN with automatic cache invalidation when files are updated/deleted (propagation within 60 seconds). For most blog factory use cases, this is sufficient -- no need for an external CDN like Cloudflare R2 unless you need:

- Custom domain for image URLs
- Edge locations Supabase doesn't cover
- Very high egress volumes (cost optimization)

### Linking Storage to Articles

Store the storage path in `blog_media.storage_path` and construct the public URL at query time:

```typescript
const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/blog-images/${media.storage_path}`
```

---

## 6. RPC Functions for Blog Operations

### Atomic Version Increment

```sql
CREATE OR REPLACE FUNCTION increment_article_version(p_article_id UUID)
RETURNS INTEGER AS $$
DECLARE
  new_version INTEGER;
BEGIN
  UPDATE blog_articles
  SET version = version + 1, updated_at = now()
  WHERE id = p_article_id
  RETURNING version INTO new_version;

  RETURN new_version;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
```

### Bulk Approve Articles

```sql
CREATE OR REPLACE FUNCTION bulk_approve_articles(p_article_ids UUID[])
RETURNS SETOF blog_articles AS $$
BEGIN
  RETURN QUERY
  UPDATE blog_articles
  SET
    review_status = 'approved',
    status = 'approved',
    updated_at = now()
  WHERE id = ANY(p_article_ids)
    AND status = 'review'           -- Only approve articles in review
  RETURNING *;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
```

### Calculate SEO Score

```sql
CREATE OR REPLACE FUNCTION calculate_seo_score(p_article_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_article blog_articles;
  v_score INTEGER := 0;
BEGIN
  SELECT * INTO v_article FROM blog_articles WHERE id = p_article_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Article not found: %', p_article_id;
  END IF;

  -- Title checks
  IF v_article.seo_title IS NOT NULL AND length(v_article.seo_title) BETWEEN 30 AND 60 THEN
    v_score := v_score + 20;
  END IF;

  -- Meta description
  IF v_article.seo_description IS NOT NULL AND length(v_article.seo_description) BETWEEN 120 AND 160 THEN
    v_score := v_score + 20;
  END IF;

  -- Body length (minimum 300 words ~ 1800 chars)
  IF length(v_article.body) > 1800 THEN
    v_score := v_score + 20;
  END IF;

  -- Has keywords
  IF v_article.seo_keywords IS NOT NULL AND array_length(v_article.seo_keywords, 1) >= 3 THEN
    v_score := v_score + 15;
  END IF;

  -- Has excerpt
  IF v_article.excerpt IS NOT NULL AND length(v_article.excerpt) > 50 THEN
    v_score := v_score + 10;
  END IF;

  -- Has canonical URL
  IF v_article.canonical_url IS NOT NULL THEN
    v_score := v_score + 5;
  END IF;

  -- Has featured image (check metadata)
  IF v_article.metadata ? 'featured_image' THEN
    v_score := v_score + 10;
  END IF;

  -- Store the score
  UPDATE blog_articles SET seo_score = v_score WHERE id = p_article_id;

  RETURN v_score;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
```

### Dashboard Statistics Aggregation

```sql
CREATE OR REPLACE FUNCTION get_org_article_stats(p_org_id UUID)
RETURNS JSONB AS $$
BEGIN
  RETURN (
    SELECT jsonb_build_object(
      'total', count(*),
      'drafts', count(*) FILTER (WHERE status = 'draft'),
      'in_review', count(*) FILTER (WHERE status = 'review'),
      'approved', count(*) FILTER (WHERE status = 'approved'),
      'published', count(*) FILTER (WHERE status = 'published'),
      'avg_seo_score', round(avg(seo_score)),
      'avg_readability', round(avg(readability_score)),
      'published_this_month', count(*) FILTER (
        WHERE status = 'published'
        AND published_at >= date_trunc('month', now())
      )
    )
    FROM blog_articles
    WHERE org_id = p_org_id
  );
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
```

### Client-Side Usage

```typescript
// Bulk approve
const { data } = await supabase.rpc('bulk_approve_articles', {
  p_article_ids: ['uuid-1', 'uuid-2', 'uuid-3'],
})

// Get stats
const { data: stats } = await supabase.rpc('get_org_article_stats', {
  p_org_id: orgId,
})
```

### Security: INVOKER vs DEFINER

- **SECURITY INVOKER** (default, recommended): Function runs with the caller's permissions. RLS policies apply. Use for all user-facing operations.
- **SECURITY DEFINER**: Function runs with the creator's permissions, bypassing RLS. Only use when the function needs to access data across tenants (e.g., global analytics). Always set `search_path` explicitly when using DEFINER.

---

## 7. Migration Patterns

### CLI Workflow

```bash
# Create a new migration
supabase migration new add_blog_articles

# This creates: supabase/migrations/20260317120000_add_blog_articles.sql
# Edit the file with your SQL

# Test locally
supabase db reset       # Resets local DB and replays all migrations

# Diff against remote (if you made changes via Dashboard)
supabase db diff --linked -f add_blog_articles

# Deploy to production
supabase db push        # For direct push (dev/staging)
# OR use CI/CD with GitHub Actions for production
```

### Migration File Structure

```sql
-- supabase/migrations/20260317120000_add_blog_articles.sql

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create tables (order matters for foreign keys)
CREATE TABLE IF NOT EXISTS organizations ( ... );
CREATE TABLE IF NOT EXISTS blog_articles ( ... );
CREATE TABLE IF NOT EXISTS blog_article_versions ( ... );
CREATE TABLE IF NOT EXISTS blog_categories ( ... );
CREATE TABLE IF NOT EXISTS blog_tags ( ... );
CREATE TABLE IF NOT EXISTS blog_article_categories ( ... );
CREATE TABLE IF NOT EXISTS blog_article_tags ( ... );
CREATE TABLE IF NOT EXISTS blog_media ( ... );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_articles_org_status ON blog_articles(org_id, status);
-- ... other indexes

-- Enable RLS
ALTER TABLE blog_articles ENABLE ROW LEVEL SECURITY;
-- ... other tables

-- Create RLS policies
CREATE POLICY "..." ON blog_articles ...;
-- ... other policies

-- Create functions and triggers
CREATE OR REPLACE FUNCTION create_article_version() ...;
CREATE TRIGGER trg_article_version ...;

-- Create RPC functions
CREATE OR REPLACE FUNCTION bulk_approve_articles(...) ...;
-- ... other functions

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE blog_articles;
```

### Coexistence with Existing Tables

The blog factory tables (blog*articles, blog_categories, etc.) live alongside existing `fma*\*`and`n8n`tables in the`public` schema. No conflicts because:

- Different table name prefixes (`blog_` vs `fma_` vs `n8n`)
- Foreign keys only reference `organizations` (shared) and `auth.users` (Supabase built-in)
- RLS policies are per-table
- Each migration is additive (new tables, not altering existing ones)

For larger projects, consider PostgreSQL schemas for logical separation:

```sql
CREATE SCHEMA IF NOT EXISTS blog;
-- Then: blog.articles, blog.categories, etc.
-- But: Supabase client defaults to 'public' schema, requires explicit schema selection
```

**Recommendation:** Stay in the `public` schema with `blog_` prefixed table names. Simpler Supabase client usage, no schema switching needed.

### Rollback Strategy

Supabase migrations only roll forward. To undo a migration:

1. Write a new migration that reverses the changes
2. Never modify existing migration files that have been deployed
3. For development, `supabase db reset` replays all migrations from scratch

### Production Deployment Best Practice

1. Always test migrations locally with `supabase db reset`
2. Use `supabase db lint` to check for common issues
3. Deploy via CI/CD (GitHub Actions) for production, not manual `db push`
4. Keep migrations small and focused (one concern per migration file)
5. Use `IF NOT EXISTS` / `IF EXISTS` for idempotency

---

## Summary: Recommended Architecture

```
blog_articles (core content, versioned)
  |-- org_id -> organizations
  |-- search_vector (generated, Dutch FTS)
  |-- metadata (JSONB, flexible fields)
  |
  |-- blog_article_versions (full snapshots, auto-trigger)
  |-- blog_article_categories -> blog_categories
  |-- blog_article_tags -> blog_tags
  |-- blog_media (links to Supabase Storage)

RLS: org_id claim in JWT, indexed
Search: Dutch tsvector, weighted (title A, excerpt B, body C)
Realtime: Postgres Changes on blog_articles for status updates
Storage: Single public bucket, path = {org_id}/{article_id}/
RPC: bulk_approve, calculate_seo_score, get_org_article_stats, restore_version
Migrations: Supabase CLI, blog_ prefix, public schema, CI/CD deploy
```

---

## Sources

- [Multi-Tenant Applications with RLS on Supabase](https://www.antstack.com/blog/multi-tenant-applications-with-rls-on-supabase-postgress/)
- [Supabase RLS Best Practices: Production Patterns](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices)
- [Custom Claims & RBAC - Supabase Docs](https://supabase.com/docs/guides/database/postgres/custom-claims-and-role-based-access-control-rbac)
- [Row Level Security - Supabase Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [When To Avoid JSONB In A PostgreSQL Schema](https://www.heap.io/blog/when-to-avoid-jsonb-in-a-postgresql-schema)
- [Indexing JSONB in Postgres - Crunchy Data](https://www.crunchydata.com/blog/indexing-jsonb-in-postgres)
- [PostgreSQL JSONB - Architecture Weekly](https://www.architecture-weekly.com/p/postgresql-jsonb-powerful-storage)
- [How to Implement Audit Trails with Triggers in PostgreSQL](https://oneuptime.com/blog/post/2026-01-25-postgresql-audit-trails-triggers/view)
- [pgMemento - Audit trail with schema versioning](https://github.com/pgMemento/pgMemento)
- [Full Text Search - Supabase Docs](https://supabase.com/docs/guides/database/full-text-search)
- [PostgreSQL Docs: Text Search Controls](https://www.postgresql.org/docs/current/textsearch-controls.html)
- [PostgreSQL Docs: Text Search Dictionaries](https://www.postgresql.org/docs/current/textsearch-dictionaries.html)
- [RUM Index for Full-Text Search - Supabase Docs](https://supabase.com/docs/guides/database/extensions/rum)
- [Subscribing to Database Changes - Supabase Docs](https://supabase.com/docs/guides/realtime/subscribing-to-database-changes)
- [Postgres Changes - Supabase Docs](https://supabase.com/docs/guides/realtime/postgres-changes)
- [Storage Image Transformations - Supabase Docs](https://supabase.com/docs/guides/storage/serving/image-transformations)
- [Smart CDN - Supabase Docs](https://supabase.com/docs/guides/storage/cdn/smart-cdn)
- [Storage Buckets - Supabase Docs](https://supabase.com/docs/guides/storage/buckets/fundamentals)
- [Database Functions - Supabase Docs](https://supabase.com/docs/guides/database/functions)
- [Transactions and RLS in Supabase Edge Functions](https://marmelab.com/blog/2025/12/08/supabase-edge-function-transaction-rls.html)
- [Database Migrations - Supabase Docs](https://supabase.com/docs/guides/deployment/database-migrations)
- [Declarative Database Schemas - Supabase Docs](https://supabase.com/docs/guides/local-development/declarative-database-schemas)
- [Schema Design with Supabase: Partitioning and Normalization](https://dev.to/pipipi-dev/schema-design-with-supabase-partitioning-and-normalization-4b7i)
