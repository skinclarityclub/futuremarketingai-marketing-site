---
title: Blog Factory — Complete Bouwplan
tags: #plan #n8n #blog #seo #fma
created: 2026-03-17
source: 5 research streams + fma-app codebase analysis + SKC blog analysis + SEO audit
---

# Blog Factory — Complete Bouwplan

> End-to-end geautomatiseerde blog pipeline: van keyword tot gepubliceerd artikel.
> n8n genereert, fma-app reviewt, website publiceert.

---

## Architectuur Overzicht

```
┌─────────────────────────────────────────────────────────────────┐
│                        n8n WORKFLOWS                            │
│                                                                 │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌────────────┐  │
│  │ Keyword  │──▶│ Research │──▶│ Outline  │──▶│  Section   │  │
│  │ Planner  │   │ Pipeline │   │ Builder  │   │  Drafter   │  │
│  └──────────┘   └──────────┘   └──────────┘   └─────┬──────┘  │
│                                                       │         │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐         │         │
│  │ Publish  │◀──│ AI QA    │◀──│ Enricher │◀────────┘         │
│  │ to Git   │   │ Validator│   │ + Images │                    │
│  └────┬─────┘   └──────────┘   └──────────┘                    │
│       │                                                         │
└───────┼─────────────────────────────────────────────────────────┘
        │
        ▼ webhook: blog_ready
┌─────────────────────────────────────────────────────────────────┐
│                      SUPABASE                                    │
│                                                                 │
│  blog_articles table                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ id, client_id, title, slug, content_mdx, frontmatter,   │  │
│  │ seo_score, geo_score, eeat_score, readability_score,     │  │
│  │ review_status, ai_validation, human_notes, version,      │  │
│  │ published_url, created_at, updated_at                    │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────┬─────────────────────────────────────────────────────────┘
        │
        ▼ real-time subscription
┌─────────────────────────────────────────────────────────────────┐
│                     FMA-APP DASHBOARD                            │
│                                                                 │
│  /clients/[id]/blogs                                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Blog Review Page                                         │  │
│  │                                                          │  │
│  │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌───────────────┐  │  │
│  │ │ AI      │ │ Pending │ │Approved │ │  Published    │  │  │
│  │ │Validated│ │ Review  │ │         │ │               │  │  │
│  │ │ (new)   │ │         │ │         │ │               │  │  │
│  │ └─────────┘ └─────────┘ └─────────┘ └───────────────┘  │  │
│  │                                                          │  │
│  │ [Preview] [AI Scores] [Approve] [Reject & Regenerate]   │  │
│  └──────────────────────────────────────────────────────────┘  │
└───────┬─────────────────────────────────────────────────────────┘
        │
        ▼ on approve → server action
┌─────────────────────────────────────────────────────────────────┐
│                    PUBLISH PIPELINE                               │
│                                                                 │
│  GitHub API → Create branch → Add MDX + images → Create PR     │
│  → Auto-merge → Vercel auto-deploy → Update published_url      │
└─────────────────────────────────────────────────────────────────┘
```

---

## Fase 1: Supabase Schema (blog_articles tabel)

```sql
CREATE TABLE blog_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES fma_clients(id),
  organization_id UUID NOT NULL,

  -- Content
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  excerpt TEXT,
  content_mdx TEXT NOT NULL,
  frontmatter JSONB NOT NULL,
  -- frontmatter bevat: author, category, pillarPage, featuredImage,
  -- tags[], readTime, medicallyReviewed, faqs[], citations[]

  -- SEO Metadata
  meta_title TEXT,
  meta_description TEXT,
  target_keyword TEXT,
  secondary_keywords TEXT[],
  internal_links JSONB,  -- [{anchor, url, context}]
  word_count INTEGER,

  -- Quality Scores (0-100)
  seo_score INTEGER,
  geo_score INTEGER,
  eeat_score INTEGER,
  readability_score INTEGER,
  overall_score INTEGER,
  quality_breakdown JSONB,  -- Detailed per-dimension scores

  -- AI Validation
  ai_validation JSONB,
  -- {
  --   passed: boolean,
  --   score: number,
  --   issues: [{severity, category, description, suggestion}],
  --   fact_check: [{claim, verified, source}],
  --   seo_analysis: {title_score, meta_score, heading_score, link_score},
  --   geo_analysis: {quotability, entity_mentions, passage_quality},
  --   brand_voice_score: number,
  --   medical_safety: {safe: boolean, flagged_claims: []}
  -- }

  -- Review Flow
  review_status TEXT NOT NULL DEFAULT 'ai_validating',
  -- States: ai_validating → ai_validated → pending_review →
  --         approved → publishing → published
  --         OR: rejected → regenerating → ai_validating
  human_notes TEXT,
  rejection_reason TEXT,
  rejection_count INTEGER DEFAULT 0,
  version INTEGER DEFAULT 1,
  previous_versions JSONB DEFAULT '[]',

  -- Publishing
  published_url TEXT,
  published_at TIMESTAMPTZ,
  github_pr_url TEXT,
  github_commit_sha TEXT,

  -- Hero Image
  hero_image_url TEXT,
  hero_image_prompt TEXT,
  og_image_url TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_blog_articles_client ON blog_articles(client_id);
CREATE INDEX idx_blog_articles_status ON blog_articles(review_status);
CREATE INDEX idx_blog_articles_org ON blog_articles(organization_id);
CREATE UNIQUE INDEX idx_blog_articles_slug ON blog_articles(client_id, slug);
```

---

## Fase 2: n8n Blog Factory Workflow

### Workflow 1: Blog Orchestrator (nieuw)

**Trigger:** Schedule (weekly) of handmatig via dashboard webhook

```
┌──────────────┐
│ Trigger      │ Schedule / Webhook van dashboard
└──────┬───────┘
       ▼
┌──────────────┐
│ Load Client  │ Supabase: fma_clients + content_config_store
│ Config       │ → brand voice, topic clusters, pillar pages
└──────┬───────┘
       ▼
┌──────────────┐
│ Keyword      │ Perplexity API: keyword research voor client niche
│ Planner      │ → target keyword, secondary keywords, search intent
└──────┬───────┘
       ▼
┌──────────────┐
│ Execute:     │ Sub-workflow: Research Pipeline (bestaand)
│ Research     │ → 4x parallel Perplexity (main, hashtag, community, competitive)
└──────┬───────┘
       ▼
┌──────────────┐
│ Outline      │ Claude API: Genereer article outline
│ Builder      │ Input: research + keyword + brand voice + topic cluster
│              │ Output: H2/H3 structuur, per-sectie briefing, FAQ kandidaten
└──────┬───────┘
       ▼
┌──────────────┐
│ Section      │ Claude API: Per sectie genereren (loop)
│ Drafter      │ Input: outline sectie + research + brand voice examples
│              │ Output: 300-500 woorden per sectie, met inline links
│              │ Model: Claude Opus 4.6 (beste voor voice consistency)
└──────┬───────┘
       ▼
┌──────────────┐
│ Assembly &   │ Code node: Combineer secties tot volledig artikel
│ Enrichment   │ → Frontmatter generatie (Zod-validated)
│              │ → FAQ extractie uit content
│              │ → Citation formatting (PubMed DOI lookup)
│              │ → Internal link injection (topic cluster config)
│              │ → readTime berekening
│              │ → Meta title + description generatie
└──────┬───────┘
       ▼
┌──────────────┐
│ Image        │ Parallel:
│ Generation   │ → Hero image (DALL-E / Flux via Replicate)
│              │ → OG image (branded template)
│              │ Upload naar Supabase Storage
└──────┬───────┘
       ▼
┌──────────────┐
│ AI Quality   │ ◀── ONAFHANKELIJKE VALIDATIE STAP
│ Validator    │
│              │ Aparte Claude call (NIET dezelfde die schreef):
│              │ 1. SEO Score (title, meta, headings, links, keyword density)
│              │ 2. GEO Score (quotability, passage quality, entity mentions)
│              │ 3. E-E-A-T Score (citations, author signals, medical safety)
│              │ 4. Readability (Flesch-Douma, B1/B2 niveau)
│              │ 5. Brand Voice (vergelijk met voice profile)
│              │ 6. Fact Check (claims vs PubMed/bronnen)
│              │ 7. Medical Safety (KOAG/KAG compliance)
│              │ 8. Uniqueness (embedding similarity vs bestaande content)
│              │
│              │ Output: Pass/Fail + detailed scores + issues
│              │
│              │ Als score < 70: automatisch terug naar Drafter (max 2x)
│              │ Als score >= 70: door naar dashboard
└──────┬───────┘
       ▼
┌──────────────┐
│ Save to      │ Supabase: blog_articles
│ Supabase     │ review_status = 'ai_validated'
│              │ + Telegram notificatie: "Nieuw blog artikel klaar voor review"
└──────────────┘
```

### AI Validator — Detail Design

De AI Validator is een **onafhankelijke beoordeling** door een ander model/prompt dan de schrijver. Dit voorkomt self-confirmation bias.

```
Validator prompt structuur:

Je bent een senior SEO-redacteur en medisch content reviewer.
Beoordeel dit artikel STRENG op de volgende dimensies.
Je hebt GEEN relatie met de schrijver — wees objectief.

<article>
{volledige MDX content}
</article>

<brand_voice_profile>
{voice examples van de klant}
</brand_voice_profile>

<seo_requirements>
Target keyword: {keyword}
Minimum word count: 2000
Required internal links: 7+
Required citations: 3+
Required FAQs: 3+
</seo_requirements>

Geef je beoordeling in dit JSON format:
{
  "overall_score": 0-100,
  "passed": true/false (>= 70 = pass),
  "dimensions": {
    "seo": { "score": 0-100, "issues": [...] },
    "geo": { "score": 0-100, "issues": [...] },
    "eeat": { "score": 0-100, "issues": [...] },
    "readability": { "score": 0-100, "issues": [...] },
    "brand_voice": { "score": 0-100, "issues": [...] },
    "medical_safety": { "score": 0-100, "issues": [...] },
    "uniqueness": { "score": 0-100, "issues": [...] }
  },
  "fact_check": [
    { "claim": "...", "verified": true/false, "source": "..." }
  ],
  "improvement_suggestions": ["..."],
  "publication_ready": true/false
}
```

**Waarom een aparte AI validatie stap?**

1. **Objectiviteit** — Een ander model/prompt beoordeelt zonder bias van de generator
2. **Tijdsbesparing** — 80% van de blogs kan automatisch goedgekeurd worden als AI score hoog genoeg is
3. **Kwaliteitsborging** — Vangt factual errors, medical safety issues, en SEO gaps op VOOR menselijke review
4. **Prioritering** — Dashboard toont AI scores zodat reviewer weet waar te focussen
5. **Learning loop** — Rejected items met AI feedback verbeteren toekomstige generatie

---

## Fase 3: FMA-App Dashboard Uitbreiding

### Nieuwe pagina: `/clients/[id]/blogs`

**Hergebruikt bestaande patronen van content-review module:**

```
Blog Review Page
├── BlogReviewFilter (status, score range, date)
├── BlogReviewGrid
│   ├── BlogReviewCard (per artikel)
│   │   ├── Title + Excerpt preview
│   │   ├── AI Score badges (SEO/GEO/E-E-A-T/Overall)
│   │   ├── Status badge (ai_validated/pending/approved/published)
│   │   ├── Target keyword
│   │   └── Word count + Read time
│   └── ...
├── BlogReviewDetail (slide-out sheet)
│   ├── Full article preview (rendered MDX)
│   ├── AI Validation Report
│   │   ├── Overall score + pass/fail
│   │   ├── Per-dimension scores met progress bars
│   │   ├── Fact check results
│   │   ├── Flagged issues met severity
│   │   └── Improvement suggestions
│   ├── SEO Preview (Google SERP mockup)
│   ├── Frontmatter editor (title, meta, tags)
│   ├── Action buttons:
│   │   ├── [Approve & Publish] → triggers Git publish
│   │   ├── [Approve for Later] → marks approved, manual publish
│   │   ├── [Reject & Regenerate] → sends to n8n with feedback
│   │   └── [Edit Manually] → inline MDX editor
│   └── Version history
└── BulkApproveBar (voor batch goedkeuring)
```

### Nieuwe componenten (gebaseerd op bestaande content-review)

| Component              | Basis                     | Aanpassing                               |
| ---------------------- | ------------------------- | ---------------------------------------- |
| `BlogReviewPageClient` | `ContentReviewPageClient` | Blog-specifieke filters + MDX preview    |
| `BlogReviewGrid`       | `ContentReviewGrid`       | Article cards ipv carousel cards         |
| `BlogReviewCard`       | `ContentReviewCard`       | SEO scores, keyword, word count          |
| `BlogReviewDetail`     | `ContentReviewDetail`     | Full MDX render + AI validation report   |
| `BlogAIReport`         | Nieuw                     | AI validation scores visualisatie        |
| `BlogSerpPreview`      | Nieuw                     | Google SERP mockup met title + meta      |
| `BlogPublishDialog`    | Nieuw                     | Confirm publish met target site selectie |

### Nieuwe server actions

```typescript
// lib/actions/blog-review.ts

export async function approveBlog(articleId: string)
// → review_status = 'publishing'
// → trigger publish pipeline (GitHub API)
// → on success: review_status = 'published', published_url = '...'

export async function rejectBlog(articleId: string, reason: string)
// → review_status = 'rejected'
// → POST to n8n regenerate webhook
// → rejection_count++, max 3

export async function bulkApproveBlog(articleIds: string[])
// → batch approve + publish

export async function editBlogFrontmatter(articleId: string, data: Partial<Frontmatter>)
// → update frontmatter JSONB
```

### Nieuwe API routes

```
POST /api/webhooks/blog-ready      ← n8n stuurt klaar artikel
POST /api/blogs/[id]/publish       ← Trigger Git publish
GET  /api/blogs/[id]/preview       ← Rendered MDX preview
POST /api/blogs/[id]/regenerate    ← Trigger n8n regeneratie
```

---

## Fase 4: Publish Pipeline

### Bij "Approve & Publish":

```
1. Server action: approveBlog(id)
2. Fetch blog_article van Supabase (content_mdx, frontmatter, images)
3. GitHub API:
   a. Create branch: blog/{slug}
   b. Upload MDX: src/content/blog/{slug}.mdx
   c. Upload hero image: public/images/blog/{slug}/hero.webp
   d. Create PR met auto-merge label
4. GitHub Actions:
   a. PR triggers build check
   b. Auto-merge op success
   c. Vercel auto-deploy
5. Update Supabase:
   a. review_status = 'published'
   b. published_url = 'https://www.{domain}/blog/{slug}'
   c. published_at = NOW()
   d. github_pr_url = PR URL
6. Telegram notificatie: "Blog gepubliceerd: {title}"
```

---

## Fase 5: Review Flow States

```
                    ┌──────────────┐
                    │ ai_validating│ ← n8n genereert + AI valideert
                    └──────┬───────┘
                           │
                    ┌──────▼───────┐
              ┌─────│ ai_validated │ ← AI score >= 70, klaar voor review
              │     └──────┬───────┘
              │            │
              │     ┌──────▼───────┐
              │     │pending_review│ ← Op dashboard, wacht op mens
              │     └──────┬───────┘
              │            │
              │     ┌──────┴──────┐
              │     │             │
              │ ┌───▼────┐  ┌────▼─────┐
              │ │approved│  │ rejected │
              │ └───┬────┘  └────┬─────┘
              │     │            │
              │ ┌───▼────┐  ┌───▼────────┐
              │ │publish-│  │regenerating │ → terug naar n8n
              │ │  ing   │  └───┬────────┘
              │ └───┬────┘      │
              │     │      ┌────▼───────┐
              │ ┌───▼────┐ │ai_validating│ (cycle, max 3x)
              │ │published│ └────────────┘
              │ └────────┘
              │
              │  Als AI score < 70:
              └──→ automatisch terug naar n8n (geen menselijke review nodig)
```

---

## Implementatie Volgorde

| Fase   | Wat                                      | Geschatte effort | Dependency |
| ------ | ---------------------------------------- | ---------------- | ---------- |
| **1**  | Supabase migration: blog_articles tabel  | 2 uur            | -          |
| **2**  | n8n Blog Orchestrator workflow           | 2-3 dagen        | Fase 1     |
| **3a** | fma-app: BlogReviewPage + componenten    | 2-3 dagen        | Fase 1     |
| **3b** | fma-app: Server actions + API routes     | 1 dag            | Fase 1, 3a |
| **4**  | Publish pipeline (GitHub API integratie) | 1 dag            | Fase 3b    |
| **5**  | AI Validator fine-tuning + testing       | 1-2 dagen        | Fase 2     |
| **6**  | End-to-end testing + polish              | 1 dag            | Alles      |

**Totaal: ~8-10 dagen**

---

## Kosten per Blog Post

| Stap          | Model/Service                  | Geschatte kosten    |
| ------------- | ------------------------------ | ------------------- |
| Research      | Perplexity Sonar Pro (4 calls) | $0.20               |
| Outline       | Claude Opus 4.6                | $0.15               |
| Drafting      | Claude Opus 4.6 (6-8 sections) | $0.80               |
| AI Validation | Claude Sonnet 4.6              | $0.10               |
| Hero Image    | DALL-E / Flux                  | $0.04               |
| Embeddings    | Google text-embedding-004      | $0.01               |
| **Totaal**    |                                | **~$1.30 per blog** |

---

## Configuratie per Client

```jsonc
// content_config_store key: "blog_factory_config"
{
  "enabled": true,
  "target_site": {
    "type": "nextjs_mdx", // of "wordpress", "webflow"
    "github_repo": "owner/repo",
    "content_path": "src/content/blog/",
    "image_path": "public/images/blog/",
    "deploy_hook": "https://api.vercel.com/v1/integrations/deploy/...",
  },
  "brand_voice": {
    "tone": "warm, persoonlijk, expert",
    "author_name": "Sindy Kienstra",
    "language": "nl",
    "example_posts": ["slug-1", "slug-2"], // voor voice cloning
    "forbidden_words": ["genees", "behandel", "garantie"],
    "required_disclaimer": true,
  },
  "seo_config": {
    "min_word_count": 2000,
    "min_internal_links": 7,
    "min_citations": 3,
    "min_faqs": 3,
    "topic_clusters": "auto", // of explicit cluster config
    "target_readability": "B1-B2",
  },
  "quality_gates": {
    "ai_auto_approve_threshold": 85, // >= 85: skip menselijke review
    "ai_pass_threshold": 70, // >= 70: naar menselijke review
    "ai_fail_threshold": 70, // < 70: automatisch regenerate
    "max_regenerations": 2,
  },
  "schedule": {
    "frequency": "weekly",
    "posts_per_week": 2,
    "preferred_publish_days": ["tuesday", "thursday"],
  },
}
```

---

_Plan gebaseerd op: 5 research streams, SKC blog analyse, FMA-app codebase analyse, SEO audit findings_
_Geschreven: 2026-03-17_
