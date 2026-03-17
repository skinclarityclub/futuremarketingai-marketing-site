---
title: "Research: Automated MDX Blog Publishing Pipeline"
tags: [#research, #mdx, #automation, #n8n, #seo, #content-pipeline]
created: 2026-03-17
source: Claude Code research session
---

# Research: Automated MDX Blog Publishing Pipeline

Research into building an automated pipeline that generates MDX blog posts, optimizes images, validates content, and publishes to the SkinClarity Club Next.js platform via Git.

---

## Table of Contents

1. [MDX Generation Best Practices](#1-mdx-generation-best-practices)
2. [Git-Based Content Publishing](#2-git-based-content-publishing)
3. [Image Pipeline for Blogs](#3-image-pipeline-for-blogs)
4. [Automated Internal Linking](#4-automated-internal-linking)
5. [SEO Metadata Generation](#5-seo-metadata-generation)
6. [Content Scheduling and Publishing](#6-content-scheduling-and-publishing)
7. [Frontmatter Validation](#7-frontmatter-validation)
8. [FAQ and Citation Extraction](#8-faq-and-citation-extraction)
9. [Recommended Architecture](#9-recommended-architecture)

---

## 1. MDX Generation Best Practices

### Current Platform Setup

The SKC platform stores MDX files in `src/content/blog/` and uses:

- `gray-matter` for frontmatter parsing
- `next-mdx-remote/rsc` for rendering (React Server Components)
- `remark-gfm`, `rehype-highlight`, `rehype-slug` plugins
- Custom components: `ExpertTip`, `ExpandableProtocol`, `MedicalTooltip`, `MedicalDisclaimer`, `CitationsList`, `EvidenceStrengthIndicator`, and more

### Generating Valid MDX Programmatically

**Template approach (recommended):** Build MDX as a string using template literals or a template engine. The key challenge is producing output that compiles without errors -- MDX is strict about JSX syntax.

```
Strategy: Generate content in stages
1. LLM generates raw markdown content (no JSX components)
2. Post-processor injects components based on rules
3. Frontmatter is assembled separately and prepended
4. Validator checks the final MDX compiles
```

**Frontmatter assembly:**

```typescript
import yaml from 'js-yaml'

function buildFrontmatter(data: ArticleFrontmatter): string {
  const yamlStr = yaml.dump(data, {
    lineWidth: -1, // no line wrapping
    quotingType: "'", // consistent quoting
    forceQuotes: true, // quote all strings
  })
  return `---\n${yamlStr}---`
}
```

**Component injection rules:**

- `<MedicalDisclaimer />` -- Insert at top of every medical/skincare article
- `<ExpertTip>...</ExpertTip>` -- Wrap paragraphs that contain expert advice patterns
- `<CitationRef id={n} />` -- Replace inline citation markers like `(Smith et al., 2023)` with component references
- `<KeyTakeaways items={[...]} />` -- Generate from a summary extraction step

**Validation before commit:**

```typescript
import { compile } from '@mdx-js/mdx'

async function validateMDX(source: string): Promise<boolean> {
  try {
    await compile(source, { remarkPlugins: [remarkGfm] })
    return true
  } catch (err) {
    console.error('MDX compilation error:', err)
    return false
  }
}
```

### Key Considerations

- MDX v3 (used by next-mdx-remote v5) treats JSX strictly -- unclosed tags or HTML entities cause compilation failures
- Curly braces `{` `}` in text must be escaped as `{'{'}`
- Angle brackets in text (e.g., comparisons) must be escaped
- Self-closing component tags must use `/>` syntax
- Components must be registered in the MDX provider or `mdx-components.tsx`

---

## 2. Git-Based Content Publishing

### GitHub API for File Creation

The GitHub Contents API allows creating files directly without cloning:

```
PUT /repos/{owner}/{repo}/contents/{path}
```

**Required fields:**

- `message` -- commit message
- `content` -- Base64-encoded file content
- `branch` -- target branch name
- `sha` -- required only for updates (not new files)

**Workflow for creating a blog post:**

1. Create a new branch from `main`: `POST /repos/{owner}/{repo}/git/refs`
2. Create/upload the MDX file: `PUT /repos/{owner}/{repo}/contents/src/content/blog/{slug}.mdx`
3. Create/upload images: `PUT /repos/{owner}/{repo}/contents/public/images/blog/{filename}`
4. Create a Pull Request: `POST /repos/{owner}/{repo}/pulls`
5. (Optional) Auto-merge: `PUT /repos/{owner}/{repo}/pulls/{pull_number}/merge`

### n8n GitHub Integration

The n8n GitHub node supports:

- **File operations:** Create, edit, delete, get files
- **Repository operations:** Get, list repositories
- **Release and issue management**
- **Branch creation** via the Git refs API (use HTTP Request node)

**Recommended n8n workflow pattern:**

```
[Content Generation] → [Image Generation] → [MDX Assembly]
    → [Validation] → [GitHub: Create Branch]
    → [GitHub: Upload MDX File] → [GitHub: Upload Images]
    → [GitHub: Create PR] → [Slack/Discord Notification]
    → (Optional) [GitHub: Auto-merge after checks pass]
```

**n8n GitHub node limitations:**

- The built-in GitHub node does not support branch creation directly; use the HTTP Request node with GitHub API
- File content must be Base64-encoded before sending
- For multiple files in one commit, use the Git Trees API (`POST /repos/{owner}/{repo}/git/trees`) combined with creating a commit and updating the ref

**Auto-merge strategies:**

1. **GitHub Actions:** Set up a workflow that auto-merges PRs with a specific label (e.g., `auto-publish`)
2. **n8n polling:** After PR creation, poll the PR status and merge when checks pass
3. **GitHub branch protection + auto-merge:** Enable "Allow auto-merge" in repository settings; the PR merges automatically once required checks pass
4. **GitHub CLI in Actions:** `gh pr merge --auto --squash` enables auto-merge after CI passes

### Branch naming convention

```
content/blog/{slug}-{timestamp}
```

Example: `content/blog/hormonale-acne-supplementen-20260317`

---

## 3. Image Pipeline for Blogs

### Image Types Needed

| Image Type      | Dimensions | Format                      | Usage                                    |
| --------------- | ---------- | --------------------------- | ---------------------------------------- |
| Hero / Featured | 1200x630   | WebP + AVIF                 | `featuredImage` in frontmatter, OG image |
| In-article      | 800x450    | WebP                        | Inline content illustrations             |
| OG Social       | 1200x630   | PNG (required by platforms) | Social sharing                           |
| Thumbnail       | 400x225    | WebP                        | Blog listing cards                       |

### AI Image Generation

**DALL-E 3 via n8n:**

- n8n has a built-in OpenAI node supporting DALL-E 3 and `gpt-image-1`
- Max prompt: 4000 characters (DALL-E 3)
- Output format: Use `b64_json` for pipeline processing (not URL, which expires)
- Rate limit: 5 images/minute on Tier 1; use `SplitInBatches` with delay for batch jobs
- A Code node is needed to convert base64 to n8n binary data

**Prompt engineering for blog images:**

```
"Professional, clean illustration for a Dutch skincare blog article
about [topic]. Soft pastel tones, botanical elements, no text overlay.
Style: modern editorial illustration, suitable for medical/wellness content.
Aspect ratio: 16:9."
```

**Alternative: Stable Diffusion / ComfyUI API:**

- Self-hosted for cost savings on high volume
- More control over style consistency via LoRA models
- Can maintain brand-consistent visual style

### Image Optimization Pipeline

**Using Sharp (Node.js) or n8n-nodes-image-sharp:**

```typescript
import sharp from 'sharp'

async function optimizeHeroImage(inputBuffer: Buffer, slug: string) {
  // WebP version
  await sharp(inputBuffer)
    .resize(1200, 630, { fit: 'cover' })
    .webp({ quality: 82 })
    .toFile(`public/images/blog/${slug}-hero.webp`)

  // AVIF version (smaller, slower to encode)
  await sharp(inputBuffer)
    .resize(1200, 630, { fit: 'cover' })
    .avif({ quality: 65 })
    .toFile(`public/images/blog/${slug}-hero.avif`)

  // Thumbnail for listing
  await sharp(inputBuffer)
    .resize(400, 225, { fit: 'cover' })
    .webp({ quality: 75 })
    .toFile(`public/images/blog/${slug}-thumb.webp`)
}
```

**n8n image pipeline:**

```
[DALL-E Generate] → [Code: base64 → binary] → [n8n-image-sharp: resize/convert]
    → [GitHub: Upload to repo] (or [S3/Cloudflare R2: Upload])
```

**Note:** The `n8n-nodes-image-sharp` community node (github.com/Zetanova/n8n-nodes-image-sharp) enables Sharp processing directly within n8n workflows.

**Next.js Image optimization:**

- Next.js `<Image>` component automatically serves WebP/AVIF based on browser support
- Using `next/image` with `sizes` and `priority` attributes for hero images
- For static export, pre-optimize images in the pipeline rather than relying on runtime optimization

### Recommended approach

Generate images via DALL-E 3 in n8n, optimize with Sharp, upload WebP versions to the repository at `public/images/blog/`, and reference them in frontmatter as `/images/blog/{slug}-hero.webp`.

---

## 4. Automated Internal Linking

### Topic Cluster Architecture

The SKC platform uses a pillar-cluster model:

- **Pillar pages:** Comprehensive guides (e.g., `complete-gids-voor-acne-behandeling`)
- **Cluster pages:** Specific topics linking back to the pillar (e.g., `hormonale-acne-behandeling` with `pillarPage: 'complete-acne-gids'`)

### Automated Linking Strategy

**Approach 1: Keyword-to-URL mapping (simple, deterministic)**

Maintain a JSON config file mapping anchor phrases to URLs:

```json
{
  "linkMap": [
    {
      "keywords": ["acne behandeling", "acne behandelen", "acne aanpakken"],
      "url": "/blog/complete-gids-voor-acne-behandeling",
      "maxOccurrences": 1,
      "priority": 10
    },
    {
      "keywords": ["hormonale acne", "hormoon acne"],
      "url": "/blog/hormonale-acne-behandeling",
      "maxOccurrences": 1,
      "priority": 8
    },
    {
      "keywords": ["skincare routine", "huidverzorgingsroutine"],
      "url": "/blog/de-ultieme-skincare-routine-gids",
      "maxOccurrences": 1,
      "priority": 7
    }
  ]
}
```

**Implementation:**

```typescript
function injectInternalLinks(
  content: string,
  currentSlug: string,
  linkMap: LinkMapEntry[]
): string {
  let result = content
  const sortedMap = linkMap
    .filter((entry) => !entry.url.includes(currentSlug)) // don't self-link
    .sort((a, b) => b.priority - a.priority)

  for (const entry of sortedMap) {
    let linked = 0
    for (const keyword of entry.keywords) {
      if (linked >= (entry.maxOccurrences || 1)) break
      // Only match in paragraph text, not headings or existing links
      const regex = new RegExp(`(?<=^|[^\\[\\(])\\b(${keyword})\\b(?=[^\\]\\)])`, 'gi')
      // Replace first occurrence only
      const match = regex.exec(result)
      if (match) {
        result =
          result.slice(0, match.index) +
          `[${match[1]}](${entry.url})` +
          result.slice(match.index + match[0].length)
        linked++
      }
    }
  }
  return result
}
```

**Approach 2: Semantic similarity (advanced)**

Use vector embeddings to find contextually relevant links:

1. Generate embeddings for all existing article titles + excerpts
2. For each paragraph in the new article, compute its embedding
3. Find the closest matching articles by cosine similarity
4. Insert links where similarity exceeds a threshold

This can be done in n8n using an AI Agent node with access to a vector store (Supabase pgvector, Pinecone, etc.).

**Approach 3: LLM-assisted linking (highest quality)**

Include the link map in the LLM prompt when generating content:

```
"Available internal links for contextual linking:
- /blog/complete-gids-voor-acne-behandeling (pillar: acne treatment guide)
- /blog/hormonale-acne-behandeling (hormonal acne)
- /blog/de-ultieme-skincare-routine-gids (skincare routines)
- /acne/nodullair (nodular acne type page)

Naturally weave 3-5 internal links into the article where contextually relevant."
```

### Best Practices

- Limit to 3-7 internal links per 1500 words
- Always link to the pillar page from cluster articles
- Vary anchor text (don't always use the exact keyword)
- Never link from headings
- Don't link the same URL more than once per article
- Cluster articles should link to each other, not just to the pillar

---

## 5. SEO Metadata Generation

### Current Platform Implementation

The SKC platform already has:

- `generateArticleMetadata()` in `src/lib/blog/blog-utils.ts` -- generates Next.js Metadata from frontmatter
- `generateBlogSchema()` in `src/lib/blog/blog-schema.ts` -- generates Article + MedicalWebPage JSON-LD
- `parseFAQFrontmatter()` + `generateFAQSchema()` in `src/lib/schema.ts` -- FAQPage schema from frontmatter

### Automated Generation in the Pipeline

**Title tag generation (target: under 60 characters):**

```
LLM prompt: "Generate an SEO-optimized title tag for this article.
Requirements:
- Under 60 characters
- Include the primary keyword near the beginning
- Make it compelling for click-through
- Dutch language
- Do NOT include the site name (appended automatically)
Article topic: {topic}
Primary keyword: {keyword}"
```

**Meta description (target: under 160 characters):**

```
LLM prompt: "Write a meta description for this article.
Requirements:
- 140-155 characters
- Include the primary keyword naturally
- Include a call-to-action or benefit
- Dutch language
Article excerpt: {excerpt}"
```

**Structured data auto-generation from frontmatter:**

The current `blog-schema.ts` already handles this well. The pipeline only needs to ensure frontmatter fields are correctly populated. The schema types generated:

1. **Article + MedicalWebPage** -- from `generateBlogSchema()`
   - Includes author credentials, publisher, citations, medical specialty
2. **FAQPage** -- from `generateFAQSchema()`
   - Derived from `faqs[]` in frontmatter
3. **BreadcrumbList** -- from `BreadcrumbSchema` component
   - Auto-generated from URL path

**OG data:** Already derived from frontmatter via `generateArticleMetadata()`:

- `og:title` from `frontmatter.title`
- `og:description` from `frontmatter.excerpt`
- `og:image` from `frontmatter.featuredImage`
- `og:type` = `article`
- `article:published_time` from `frontmatter.publishedDate`

**Validation:**

- Use Google's Rich Results Test API or Schema.org validator programmatically
- Check title length <= 60 chars, description length 140-160 chars
- Validate JSON-LD output with `schema-dts` TypeScript types

---

## 6. Content Scheduling and Publishing

### Workflow States

```
Draft → Review → Scheduled → Published → (Updated)
```

### Implementation Options

**Option A: Frontmatter status field (recommended for SKC)**

Add a `status` field to frontmatter:

```yaml
status: 'scheduled' # draft | review | scheduled | published
publishedDate: '2026-04-01'
scheduledPublishDate: '2026-04-01T09:00:00+02:00' # exact publish time
```

Filter in `getAllArticles()`:

```typescript
const articles = mdxFiles.map(/* parse */).filter((article) => {
  if (article.frontmatter.status !== 'published') {
    // Check if scheduled and past publish time
    if (
      article.frontmatter.status === 'scheduled' &&
      new Date(article.frontmatter.scheduledPublishDate) <= new Date()
    ) {
      return true
    }
    return false
  }
  return true
})
```

**Requires a rebuild trigger** -- static sites don't auto-publish. Solutions:

1. **GitHub Actions cron:** Rebuild every 3-6 hours via scheduled workflow
2. **Vercel Deploy Hook:** Hit a webhook URL on schedule to trigger rebuild
3. **n8n scheduled trigger:** Call the Vercel deploy hook at the scheduled time

**Option B: Branch-based workflow (for review process)**

```
main (published) ← PR ← content/blog/{slug} (draft/review)
```

- Draft: exists as a branch, not merged
- Review: PR created, team reviews
- Scheduled: PR approved, merge scheduled via GitHub Actions
- Published: PR merged, Vercel auto-deploys

**Option C: Combined approach (recommended)**

Use branches for the review workflow AND frontmatter status for scheduling:

1. n8n generates content on a feature branch
2. PR created with `status: scheduled` and `scheduledPublishDate`
3. Reviewer approves and merges PR
4. Article exists in `main` but is filtered out by status
5. GitHub Actions cron job runs daily, checks for articles past their scheduled date, updates status to `published`, and commits

**GitHub Actions cron workflow:**

```yaml
name: Publish Scheduled Articles
on:
  schedule:
    - cron: '0 7 * * *' # Daily at 07:00 UTC (09:00 CET)
  workflow_dispatch: {} # Manual trigger

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check and publish scheduled articles
        run: node scripts/publish-scheduled.mjs
      - name: Commit changes
        run: |
          git config user.name "github-actions[bot]"
          git config user.email "github-actions[bot]@users.noreply.github.com"
          git add -A
          git diff --staged --quiet || git commit -m "chore: publish scheduled articles"
          git push
```

---

## 7. Frontmatter Validation

### Zod Schema Definition

```typescript
import { z } from 'zod'

const CitationSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  journal: z.string().min(1),
  authors: z.array(z.string()).optional(),
  year: z.number().int().min(2000).max(2030).optional(),
  pmid: z.string().optional(),
})

const FAQSchema = z.object({
  question: z.string().min(10).max(200),
  answer: z.string().min(20).max(1000),
  category: z.string().optional(),
})

export const ArticleFrontmatterSchema = z.object({
  title: z.string().min(10).max(100),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase kebab-case'),
  excerpt: z.string().min(50).max(300),
  author: z.string().default('Sindy Kienstra'),
  publishedDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  updatedDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  category: z.string().min(1),
  pillarPage: z.union([z.boolean(), z.string()]).optional(),
  featuredImage: z.string().startsWith('/images/blog/'),
  tags: z.array(z.string()).min(1).max(10),
  readTime: z.number().int().min(1).max(60),
  medicallyReviewed: z.boolean().default(false),
  medicalReviewer: z.string().optional(),
  status: z.enum(['draft', 'review', 'scheduled', 'published']).default('draft'),
  scheduledPublishDate: z.string().optional(),
  faqs: z.array(FAQSchema).min(3).max(10).optional(),
  citations: z.array(CitationSchema).min(1).optional(),
})

export type ValidatedFrontmatter = z.infer<typeof ArticleFrontmatterSchema>
```

### Integration Points

**1. In the n8n pipeline (generation time):**
After the LLM generates frontmatter, validate it before proceeding:

```typescript
const result = ArticleFrontmatterSchema.safeParse(generatedFrontmatter)
if (!result.success) {
  // Log errors, retry generation with error feedback
  console.error(result.error.flatten())
}
```

**2. At build time (Next.js):**
Validate in `getAllArticles()` before returning:

```typescript
const parsed = ArticleFrontmatterSchema.safeParse(data)
if (!parsed.success) {
  console.warn(`Invalid frontmatter in ${filename}:`, parsed.error.flatten())
  return null // Skip invalid articles
}
```

**3. In CI/CD (GitHub Actions):**
Run a validation script as a PR check:

```typescript
// scripts/validate-blog-posts.ts
import { glob } from 'glob'
import matter from 'gray-matter'
import { ArticleFrontmatterSchema } from '../src/lib/blog/schema'

const files = glob.sync('src/content/blog/*.mdx')
let hasErrors = false

for (const file of files) {
  const { data } = matter(fs.readFileSync(file, 'utf8'))
  const result = ArticleFrontmatterSchema.safeParse(data)
  if (!result.success) {
    console.error(`FAIL: ${file}`)
    console.error(result.error.flatten())
    hasErrors = true
  }
}

process.exit(hasErrors ? 1 : 0)
```

**4. Using zod-matter (alternative):**
The `zod-matter` package (github.com/HiDeoo/zod-matter) combines gray-matter parsing with Zod validation in one step:

```typescript
import { matter } from 'zod-matter'
const { data, content } = matter(fileContents, ArticleFrontmatterSchema)
// `data` is typed and validated
```

---

## 8. FAQ and Citation Extraction

### FAQ Extraction

**Approach: LLM structured output (recommended)**

Use Claude or GPT function calling / structured output to extract FAQs from the generated content:

```typescript
const faqExtractionPrompt = `
Extract 5-7 FAQ question-answer pairs from this article.
Requirements:
- Questions should be in Dutch, phrased as a user would search
- Answers should be 2-4 sentences, factual, directly from the content
- Include the most important/searched topics
- Format for FAQPage schema markup

Article content:
{content}

Return as JSON array:
[{"question": "...", "answer": "..."}]
`
```

**Using OpenAI function calling:**

```typescript
const response = await openai.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: faqExtractionPrompt }],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'faq_extraction',
      schema: {
        type: 'object',
        properties: {
          faqs: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                question: { type: 'string' },
                answer: { type: 'string' },
              },
              required: ['question', 'answer'],
            },
          },
        },
      },
    },
  },
})
```

**Alternative: Generate FAQs during content creation**

Rather than extracting after the fact, instruct the LLM to include FAQ data as part of the generation prompt. This produces higher quality Q&A pairs since the model writes them intentionally.

### Citation Extraction

**Approach 1: Generate citations as structured data from the start**

Include citation requirements in the content generation prompt:

```
"For each scientific claim, include a citation. After generating the article,
provide all citations as a JSON array with fields:
title, url, journal, authors (array), year, pmid (if available)"
```

**Approach 2: Extract from existing text with regex + LLM**

For content that already contains inline citations like `(Smith et al., 2023)`:

```typescript
// Step 1: Extract inline citation markers
const citationPattern = /\(([A-Z][a-z]+ et al\.,?\s*\d{4})\)/g
const markers = [...content.matchAll(citationPattern)]

// Step 2: Use LLM to find/generate full citation details
const citationPrompt = `
For each of these citation markers, provide the full citation details.
If you cannot find the exact paper, provide a plausible real paper on the topic.

Markers: ${markers.map((m) => m[1]).join(', ')}
Article topic: ${topic}

Return as JSON:
[{
  "title": "Full paper title",
  "url": "https://doi.org/... or https://pubmed.ncbi.nlm.nih.gov/...",
  "journal": "Journal Name",
  "authors": ["Last, F."],
  "year": 2023,
  "pmid": "12345678" // if available
}]
`
```

**Approach 3: PubMed API for real citations**

For medical/skincare content, fetch real citations from PubMed:

```typescript
async function searchPubMed(query: string, maxResults: number = 5) {
  const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(query)}&retmax=${maxResults}&retmode=json`
  const searchResult = await fetch(searchUrl).then((r) => r.json())
  const ids = searchResult.esearchresult.idlist

  const detailUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(',')}&retmode=json`
  const details = await fetch(detailUrl).then((r) => r.json())

  return ids.map((id) => ({
    title: details.result[id].title,
    journal: details.result[id].source,
    authors: details.result[id].authors?.map((a) => a.name) || [],
    year: parseInt(details.result[id].pubdate),
    pmid: id,
    url: `https://pubmed.ncbi.nlm.nih.gov/${id}`,
  }))
}
```

**Recommended approach for SKC:** Combine approaches 1 and 3. Generate the article with citation intent, then use PubMed API to find real papers that support each claim. This ensures citations are genuine and verifiable -- critical for YMYL (Your Money Your Life) content.

---

## 9. Recommended Architecture

### End-to-End Pipeline Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        n8n Workflow                              │
│                                                                  │
│  [Schedule/Manual Trigger]                                       │
│       │                                                          │
│       ▼                                                          │
│  [Topic Selection]  ◄── topic-cluster-config.json                │
│       │                                                          │
│       ▼                                                          │
│  [Content Generation - Claude/GPT]                               │
│       │  - Article body (markdown, no JSX)                       │
│       │  - Frontmatter data (structured output)                  │
│       │  - FAQ pairs (structured output)                         │
│       │  - Image prompts                                         │
│       │                                                          │
│       ├──────────────────┐                                       │
│       ▼                  ▼                                       │
│  [Citation Pipeline] [Image Pipeline]                            │
│  - PubMed API search  - DALL-E 3 generation                     │
│  - Citation assembly   - Sharp optimization                     │
│  - Validation          - WebP/AVIF conversion                   │
│       │                  │                                       │
│       ▼                  ▼                                       │
│  [MDX Assembly]                                                  │
│  - Build frontmatter (YAML)                                      │
│  - Inject internal links (from link map)                         │
│  - Inject MDX components                                         │
│  - Prepend frontmatter to content                                │
│       │                                                          │
│       ▼                                                          │
│  [Validation]                                                    │
│  - Zod schema validation (frontmatter)                           │
│  - MDX compilation check                                         │
│  - Link validity check                                           │
│  - Image reference check                                         │
│       │                                                          │
│       ▼                                                          │
│  [Git Publishing]                                                │
│  - Create branch                                                 │
│  - Upload MDX + images via GitHub API                            │
│  - Create Pull Request                                           │
│  - Notify via Slack/Discord                                      │
│       │                                                          │
│       ▼                                                          │
│  [Human Review] (optional)                                       │
│  - Review PR, request changes or approve                         │
│  - Auto-merge when approved + checks pass                        │
│       │                                                          │
│       ▼                                                          │
│  [Vercel Auto-Deploy on merge]                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Required Configuration Files

1. **`topic-cluster-config.json`** -- Defines pillar pages, cluster topics, keywords, and internal link map
2. **`content-calendar.json`** -- Scheduled topics with target publish dates
3. **`brand-voice-prompt.md`** -- System prompt for consistent LLM output (Dutch language, Sindy's voice)
4. **`image-style-guide.json`** -- DALL-E prompt templates for consistent visual style

### n8n Nodes Used

| Step           | n8n Node              | Purpose                        |
| -------------- | --------------------- | ------------------------------ |
| Trigger        | Schedule / Webhook    | Start pipeline                 |
| Content gen    | OpenAI / Anthropic    | Generate article + metadata    |
| Citations      | HTTP Request          | PubMed API calls               |
| Image gen      | OpenAI (DALL-E)       | Generate hero + article images |
| Image opt      | n8n-nodes-image-sharp | Resize, convert to WebP        |
| Validation     | Code (JavaScript)     | Zod validation, MDX check      |
| Link injection | Code (JavaScript)     | Apply internal link map        |
| Git publish    | GitHub / HTTP Request | Branch, commit, PR creation    |
| Notify         | Slack / Discord       | Alert team of new PR           |

### Key Dependencies

```json
{
  "gray-matter": "^4.0.3", // frontmatter parsing
  "js-yaml": "^4.1.0", // YAML stringification
  "zod": "^3.23.0", // schema validation
  "sharp": "^0.33.0", // image processing
  "@mdx-js/mdx": "^3.0.0", // MDX compilation/validation
  "zod-matter": "^0.3.0" // combined frontmatter + Zod
}
```

### Implementation Priority

1. **Phase 1 -- Core pipeline:** Content generation + frontmatter assembly + Zod validation + GitHub PR creation
2. **Phase 2 -- Image pipeline:** DALL-E generation + Sharp optimization + upload to repo
3. **Phase 3 -- Internal linking:** Link map config + automated injection
4. **Phase 4 -- Scheduling:** Frontmatter status field + GitHub Actions cron + Vercel deploy hooks
5. **Phase 5 -- Citations:** PubMed API integration + citation validation
6. **Phase 6 -- Quality loop:** Human review workflow + feedback loop to improve prompts

---

## Sources

- [Next.js MDX Guide](https://nextjs.org/docs/app/guides/mdx)
- [Josh Comeau - How I Built my Blog with MDX](https://www.joshwcomeau.com/blog/how-i-built-my-blog/)
- [next-mdx-remote](https://github.com/hashicorp/next-mdx-remote)
- [n8n GitHub Node Docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.github/)
- [n8n Workflow: Automated GitHub PR Creation](https://n8n.io/workflows/4463-automated-workflow-backups-to-github-with-pr-creation-and-slack-notifications/)
- [Auto-Merge PRs with GitHub Actions](https://www.nickyt.co/blog/automate-and-merge-pull-requests-using-github-actions-and-the-github-cli-4lo6/)
- [n8n OpenAI DALL-E Image Pipeline](https://markaicode.com/n8n-openai-dalle-image-generation-pipeline/)
- [n8n-nodes-image-sharp](https://github.com/Zetanova/n8n-nodes-image-sharp)
- [Optimix Image Pipeline](https://github.com/codecrypt112/optimix-image-pipeline)
- [Image Optimization Best Practices 2025](https://www.frontendtools.tech/blog/modern-image-optimization-techniques-2025)
- [Automating Image Optimization for Static Blogs](https://dasroot.net/posts/2026/02/automating-image-optimization-deployment-static-blogs/)
- [The Semantic Mesh: Automating Internal Linking](https://blog.trysteakhouse.com/blog/semantic-mesh-automating-internal-linking-topic-clusters)
- [ML-Based Internal Link Auditing](https://lazarinastoy.com/how-to-incorporate-machine-learning-in-internal-linking-audits/)
- [AI Internal Linking Optimization](https://www.airops.com/blog/using-ai-to-improve-seo-exploring-internal-links-and-backlinks)
- [Next.js Metadata and OG Images](https://nextjs.org/docs/app/getting-started/metadata-and-og-images)
- [Next.js generateMetadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [SEO Metadata Best Practices 2026](https://zoer.ai/posts/zoer/seo-metadata-best-practices-implementation-guide-1459)
- [SSR SEO Automation for React](https://dev.to/autoblogwriter/ssr-seo-automation-for-react-metadata-schema-and-internal-linking-5989)
- [Scheduled Publishing with GitHub Actions](https://www.codeslog.com/en/posts/github-actions-scheduled-publish-check/)
- [Schedule Blog Posts with GitHub Actions](https://www.curiouslychase.com/posts/how-i-schedule-blog-posts-with-github-actions-and-netlify/)
- [Blog Post Publishing with GitHub Actions](https://www.damirscorner.com/blog/posts/20220128-BlogPostPublishingWithGitHubActions.html)
- [zod-matter - Typesafe Frontmatter](https://github.com/HiDeoo/zod-matter)
- [Astro Content Collections (Zod Schema Example)](https://docs.astro.build/en/guides/content-collections/)
- [LLM-Optimized Content Structures: FAQs](https://www.averi.ai/how-to/llm%E2%80%91optimized-content-structures-tables-faqs-snippets)
- [FAQ and HowTo Schema for AEO](https://semai.ai/blogs/how-to-implement-faqpage-and-howto-schema-for-aeo/)
- [Structured Information Extraction with LLMs (Nature)](https://www.nature.com/articles/s41467-024-45563-x)
- [QA Extraction from Scientific Articles](https://arxiv.org/abs/2507.13827)
