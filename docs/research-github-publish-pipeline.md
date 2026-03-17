---
title: Research — Automated Blog Publishing Pipeline via GitHub API
tags: #research #github-api #blog-pipeline #next-js #mdx
created: 2026-03-17
source: Web research (multiple sources)
---

# Automated Blog Publishing Pipeline via GitHub API

Research into building an automated pipeline that commits MDX files + images to a Next.js repository and triggers deployment.

---

## 1. GitHub Contents API vs Trees API

### Contents API (REST)

- **Endpoint**: `PUT /repos/{owner}/{repo}/contents/{path}`
- Single-file operations only — one API call per file
- Simple to use but **not atomic** for multi-file commits
- Each call creates a separate commit unless you chain them with the Trees API
- File size limit: **100 MB** per file
- Good for: quick single-file updates (e.g., updating frontmatter)

### Git Trees + Blobs API (REST)

- **Multi-file atomic commits** — all files in a single commit
- Workflow: create blobs → create tree → create commit → update ref
- Requires 4+ API calls minimum, but guarantees atomicity
- Blob size limit: **100 MB** (base64 encoded)
- The Git Database API requires at least 1 existing commit (won't work on empty repos)

**Step-by-step flow:**

```
1. GET /repos/{owner}/{repo}/git/ref/heads/{branch}     → get current SHA
2. GET /repos/{owner}/{repo}/git/commits/{sha}           → get base tree SHA
3. POST /repos/{owner}/{repo}/git/blobs                  → create blob for each file (base64)
4. POST /repos/{owner}/{repo}/git/trees                  → create tree with all blobs
5. POST /repos/{owner}/{repo}/git/commits                → create commit pointing to tree
6. PATCH /repos/{owner}/{repo}/git/refs/heads/{branch}   → update branch ref
```

### GraphQL createCommitOnBranch Mutation (Recommended)

- **Best option**: single API call for multi-file atomic commits
- Available since September 2021
- Supports additions and deletions in one operation
- File contents must be **base64 encoded** (RFC 4648 compliant, correct padding required)
- `expectedHeadOid` must match the last commit SHA — fails on mismatch (optimistic concurrency)
- Commits are **automatically GPG signed** and marked as verified

**Example mutation:**

```graphql
mutation ($input: CreateCommitOnBranchInput!) {
  createCommitOnBranch(input: $input) {
    commit {
      url
      oid
    }
  }
}
```

**Variables:**

```json
{
  "input": {
    "branch": {
      "repositoryNameWithOwner": "owner/repo",
      "branchName": "content/new-blog-post"
    },
    "message": {
      "headline": "feat(blog): add new blog post - huidverzorging-tips"
    },
    "expectedHeadOid": "abc123...",
    "fileChanges": {
      "additions": [
        {
          "path": "src/content/blog/huidverzorging-tips.mdx",
          "contents": "<base64-encoded-mdx-content>"
        },
        {
          "path": "public/images/blog/huidverzorging-tips/hero.webp",
          "contents": "<base64-encoded-image>"
        }
      ]
    }
  }
}
```

### Recommendation

**Use the GraphQL `createCommitOnBranch` mutation** for the publishing pipeline. It provides atomic multi-file commits in a single API call, automatic GPG signing, and handles the blob/tree creation automatically.

For images larger than ~50 MB (unlikely for blog images), fall back to the REST Trees + Blobs API.

---

## 2. Branch-Based Publishing Workflow

### Recommended Flow

```
n8n workflow generates content
    ↓
Create feature branch (content/post-slug)
    ↓
Commit MDX + images via createCommitOnBranch
    ↓
Create Pull Request
    ↓
GitHub Actions CI validates (MDX, frontmatter, images)
    ↓
Auto-merge on passing checks
    ↓
Vercel deploys from main
```

### Creating a Branch via API

```bash
# REST API
POST /repos/{owner}/{repo}/git/refs
{
  "ref": "refs/heads/content/post-slug",
  "sha": "<main-branch-sha>"
}
```

### Creating a Pull Request

```bash
POST /repos/{owner}/{repo}/pulls
{
  "title": "feat(blog): publish - Huidverzorgingstips voor acne",
  "head": "content/post-slug",
  "base": "main",
  "body": "Automated blog post publication\n\n- MDX content validated\n- Images optimized"
}
```

### Auto-Merge Configuration

**Prerequisites:**

- Repository setting: "Allow auto-merge" must be enabled
- Branch protection rule on `main` with at least one required status check
- PR must have passing status checks

**Enable auto-merge on PR:**

```bash
# Using GitHub CLI
gh pr merge --auto --delete-branch --squash "$PR_NUMBER"

# Using GraphQL
mutation {
  enablePullRequestAutoMerge(input: {
    pullRequestId: "<PR_NODE_ID>",
    mergeMethod: SQUASH
  }) {
    pullRequest { number }
  }
}
```

**GitHub Actions helper (peter-evans/enable-pull-request-automerge):**

```yaml
- uses: peter-evans/enable-pull-request-automerge@v3
  with:
    pull-request-number: ${{ steps.create-pr.outputs.pull-request-number }}
    merge-method: squash
```

### Branch Protection Rules

Configure for `main`:

- Require status checks: `validate-blog-content`, `build-check`
- Require up-to-date branches before merging
- Allow auto-merge
- Allow bot accounts to bypass review requirements (or use a GitHub App with appropriate permissions)

---

## 3. GitHub Actions for Blog Validation

### Workflow File: `.github/workflows/validate-blog.yml`

```yaml
name: Validate Blog Content
on:
  pull_request:
    paths:
      - 'src/content/blog/**'
      - 'public/images/blog/**'

jobs:
  validate-blog:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      # 1. Frontmatter validation
      - name: Validate frontmatter
        run: npx tsx scripts/validate-frontmatter.ts

      # 2. MDX compilation check
      - name: Check MDX compiles
        run: npx tsx scripts/check-mdx-compilation.ts

      # 3. Image optimization
      - name: Optimize images
        uses: calibreapp/image-actions@main
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          jpegQuality: '80'
          pngQuality: '80'
          webpQuality: '80'
          ignorePaths: 'node_modules/**'

      # 4. Build check (catches any Next.js compilation errors)
      - name: Build check
        run: npm run build
```

### Frontmatter Schema Validation

**Using Zod (`zod-matter` or custom):**

```typescript
// scripts/validate-frontmatter.ts
import { z } from 'zod'
import matter from 'gray-matter'
import { glob } from 'glob'
import fs from 'fs'

const BlogFrontmatterSchema = z.object({
  title: z.string().min(10).max(70),
  description: z.string().min(50).max(160),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  author: z.string(),
  tags: z.array(z.string()).min(1),
  image: z.string().optional(),
  draft: z.boolean().default(false),
})

const files = glob.sync('src/content/blog/**/*.mdx')
for (const file of files) {
  const content = fs.readFileSync(file, 'utf-8')
  const { data } = matter(content)
  BlogFrontmatterSchema.parse(data) // throws on invalid
}
```

**GitHub Marketplace action alternative:**

- `Frontmatter JSON Schema Validator` action validates frontmatter against a JSON schema directly in PRs

### MDX Compilation Check

```typescript
// scripts/check-mdx-compilation.ts
import { compile } from '@mdx-js/mdx'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'

const files = glob.sync('src/content/blog/**/*.mdx')
for (const file of files) {
  const source = fs.readFileSync(file, 'utf-8')
  await compile(source, {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  })
}
```

### Image Optimization in CI

**calibreapp/image-actions** (recommended):

- Automatically compresses JPEG, PNG, WebP, AVIF in PRs
- Uses Sharp under the hood
- Commits optimized versions back to the PR branch
- Configurable quality settings per format

**Alternative: custom Sharp script:**

```typescript
import sharp from 'sharp'

// Convert to WebP with quality control
await sharp(inputBuffer).webp({ quality: 80 }).toFile(outputPath)
```

### Broken Link Detection

```yaml
- name: Check broken links
  uses: lycheeverse/lychee-action@v1
  with:
    args: --verbose --no-progress 'src/content/blog/**/*.mdx'
```

---

## 4. Vercel Deployment Hooks

### Automatic Git-Based Deploys (Default)

Vercel automatically deploys on push to `main`. When the auto-merged PR lands on main, Vercel picks it up automatically. **This is the simplest approach and usually sufficient.**

### Deploy Hooks (Manual Trigger)

For cases where you need to trigger a rebuild without a git push:

```bash
# Create in Vercel Dashboard → Project Settings → Git → Deploy Hooks
# Returns a URL like:
POST https://api.vercel.com/v1/integrations/deploy/prj_xxxxx/hook_xxxxx
```

Use cases:

- Revalidating after external data changes
- Forcing rebuild without code changes
- Triggering from n8n after content generation

### ISR: On-Demand Revalidation (Recommended for Blog)

Instead of full rebuilds, revalidate only the affected blog page:

```typescript
// app/api/revalidate/route.ts
import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { secret, slug, tag } = await request.json()

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  // Path-based revalidation
  if (slug) {
    revalidatePath(`/blog/${slug}`)
    revalidatePath('/blog') // revalidate blog index too
  }

  // Tag-based revalidation (revalidate all pages using a specific data tag)
  if (tag) {
    revalidateTag(tag)
  }

  return NextResponse.json({ revalidated: true, now: Date.now() })
}
```

**Call from n8n after successful merge:**

```bash
curl -X POST https://skinclarityclub.nl/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{"secret": "xxx", "slug": "huidverzorging-tips"}'
```

### Comparison

| Method          | Speed    | Cost       | Use Case                       |
| --------------- | -------- | ---------- | ------------------------------ |
| Auto git deploy | ~60-120s | Full build | Default, always works          |
| Deploy hook     | ~60-120s | Full build | External trigger needed        |
| On-demand ISR   | ~1-5s    | Minimal    | Revalidate specific pages      |
| Time-based ISR  | Varies   | Minimal    | Background refresh at interval |

**Recommendation:** Use automatic git-based deploys as the primary mechanism. Add on-demand ISR revalidation as a post-merge webhook for near-instant content availability.

---

## 5. Image Handling

### GitHub API Size Limits

| Method                       | File Size Limit    |
| ---------------------------- | ------------------ |
| Contents API (REST)          | 100 MB             |
| Git Blobs API (REST)         | 100 MB             |
| GraphQL createCommitOnBranch | ~100 MB (base64)   |
| GitHub repository total      | Recommended < 1 GB |

For blog images (typically 100 KB - 2 MB after optimization), these limits are more than sufficient.

### Pre-Commit Optimization Pipeline

**In n8n before committing to GitHub:**

1. Download/generate image
2. Convert to WebP (primary) and optionally AVIF (for modern browsers)
3. Resize to maximum dimensions (e.g., 1200px wide for hero, 800px for inline)
4. Compress with quality 80
5. Base64 encode for GitHub API

```typescript
// Example optimization before commit
import sharp from 'sharp'

async function optimizeForBlog(imageBuffer: Buffer, name: string) {
  const webp = await sharp(imageBuffer)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer()

  return {
    path: `public/images/blog/${name}.webp`,
    contents: webp.toString('base64'),
  }
}
```

### Git LFS Considerations

- **Not recommended for this use case** — blog images after optimization are typically < 500 KB
- Git LFS adds complexity (separate storage, authentication, Vercel compatibility issues)
- Only consider LFS if storing original unoptimized images (10+ MB each)
- Vercel does not natively support Git LFS — images must be in regular Git

### Image Strategy

1. Optimize images **before** committing (in n8n or a preprocessing step)
2. Store as WebP in `public/images/blog/{slug}/` directory
3. Reference in MDX frontmatter: `image: /images/blog/slug/hero.webp`
4. Use Next.js `<Image>` component for automatic srcset generation
5. Keep images under 500 KB each after optimization

---

## 6. Next.js MDX Compilation

### Approach Comparison

| Feature            | @next/mdx          | next-mdx-remote        | Contentlayer             | Custom loader   |
| ------------------ | ------------------ | ---------------------- | ------------------------ | --------------- |
| File-based routing | Yes (MDX as pages) | No (load in pages)     | No (load in pages)       | Flexible        |
| Content source     | Local files only   | Anywhere               | Local or remote          | Anywhere        |
| Type safety        | No                 | No                     | Yes (generated types)    | Manual          |
| Frontmatter        | Plugin needed      | Built-in (gray-matter) | Built-in + validation    | Manual          |
| Hot reload         | Yes                | Partial                | Yes                      | Depends         |
| Maintenance        | Official Next.js   | HashiCorp maintained   | Unmaintained (abandoned) | Self-maintained |
| Build performance  | Good               | Good                   | Good (cached)            | Depends         |

### Recommendation: next-mdx-remote + custom validation

**Contentlayer is effectively abandoned** (no updates since 2023). The best approach for an API-driven pipeline:

1. Store MDX files in `src/content/blog/`
2. Use `next-mdx-remote` to compile at request/build time
3. Use Zod for frontmatter validation (replaces Contentlayer's type safety)
4. File discovery via `fs.readdir` + `glob`

```typescript
// lib/blog.ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { compileMDX } from 'next-mdx-remote/rsc'

const BLOG_DIR = path.join(process.cwd(), 'src/content/blog')

export async function getBlogPost(slug: string) {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`)
  const source = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(source)

  const { content: mdxContent } = await compileMDX({
    source: content,
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [
          /* ... */
        ],
        rehypePlugins: [
          /* ... */
        ],
      },
    },
  })

  return { frontmatter: data, content: mdxContent }
}

export function getAllBlogSlugs() {
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace('.mdx', ''))
}
```

### How Next.js Discovers New MDX Files

- At build time: `generateStaticParams()` calls `getAllBlogSlugs()` which reads the filesystem
- New files committed via GitHub API are available after the next build/deploy
- In dev: file system watchers detect new files, hot reload works automatically
- With ISR: new files are discovered on first request after revalidation

### Security Note

MDX compiles to JavaScript and executes on the server. Since content comes from your own GitHub repo via an authenticated pipeline, this is safe. Never compile MDX from untrusted user input.

---

## 7. Rollback Strategies

### Strategy 1: Frontmatter Draft Status (Recommended for "Soft" Unpublish)

Add `draft: true` to frontmatter to hide without removing:

```mdx
---
title: Huidverzorgingstips
draft: true
---
```

Filter in code:

```typescript
export function getPublishedPosts() {
  return getAllPosts().filter((post) => !post.frontmatter.draft)
}
```

**To unpublish via API:** commit an update to the MDX file changing `draft: false` to `draft: true` using `createCommitOnBranch`.

### Strategy 2: Git Revert via API (Full Removal)

```bash
# 1. Find the merge commit SHA
GET /repos/{owner}/{repo}/pulls/{pr_number}
# → merge_commit_sha

# 2. Create a revert commit (no direct API — use createCommitOnBranch to delete files)
# Or create a revert PR via GitHub UI/CLI:
gh api repos/{owner}/{repo}/pulls \
  -X POST \
  -f base=main \
  -f head=revert-{pr_number} \
  -f title="revert: unpublish blog post"
```

Alternative: use `createCommitOnBranch` with `deletions` to remove the MDX and image files.

### Strategy 3: Redirect Handling

For SEO-safe removal of published content:

```typescript
// next.config.js or middleware.ts
const redirects = async () => [
  {
    source: '/blog/removed-post-slug',
    destination: '/blog',
    permanent: false, // 302 — temporary (content may return)
    // permanent: true, // 301 — permanent redirect
  },
]
```

For content that should never have existed:

```typescript
// middleware.ts — return 410 Gone
if (removedSlugs.includes(slug)) {
  return new NextResponse(null, { status: 410 })
}
```

### SEO Considerations

| Scenario                   | Status Code             | Action                                     |
| -------------------------- | ----------------------- | ------------------------------------------ |
| Temporarily hidden (draft) | 404 (page not rendered) | Set `draft: true`, will return             |
| Permanently removed        | 301 to /blog            | Redirect, update sitemap                   |
| Should never have existed  | 410 Gone                | Remove from sitemap, tell Google it's gone |
| Content moved to new URL   | 301 to new URL          | Update sitemap with new URL                |

### Sitemap Updates

Ensure `sitemap.ts` filters out draft posts and removed URLs:

```typescript
// app/sitemap.ts
export default async function sitemap() {
  const posts = getPublishedPosts() // excludes drafts
  return posts.map((post) => ({
    url: `https://skinclarityclub.nl/blog/${post.slug}`,
    lastModified: post.date,
  }))
}
```

---

## 8. Rate Limits and Error Handling

### GitHub API Rate Limits

| Authentication            | Limit                                        |
| ------------------------- | -------------------------------------------- |
| Unauthenticated           | 60 requests/hour                             |
| Personal Access Token     | 5,000 requests/hour                          |
| GitHub App (installation) | 5,000 requests/hour (or more based on users) |
| GraphQL API               | 5,000 points/hour                            |

For a blog publishing pipeline (typically < 10 API calls per post), rate limits are rarely a concern.

### Response Headers to Monitor

```
X-RateLimit-Limit: 5000
X-RateLimit-Remaining: 4987
X-RateLimit-Reset: 1711756800    (UTC epoch seconds)
```

### Secondary Rate Limits

GitHub also enforces **secondary (abuse) rate limits**:

- No more than 100 concurrent requests
- No more than 900 points per minute for REST API
- No more than 80 content-generating requests per minute (POST, PUT, PATCH, DELETE)
- Response: `403` or `429` with `retry-after` header

### Retry Strategy with Exponential Backoff

```typescript
async function githubApiCall(fn: () => Promise<Response>, maxRetries = 3) {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const response = await fn()

    if (response.ok) return response

    // Rate limited
    if (response.status === 403 || response.status === 429) {
      const retryAfter = response.headers.get('retry-after')
      const rateLimitReset = response.headers.get('x-ratelimit-reset')

      let waitMs: number
      if (retryAfter) {
        waitMs = parseInt(retryAfter) * 1000
      } else if (rateLimitReset) {
        waitMs = parseInt(rateLimitReset) * 1000 - Date.now()
      } else {
        waitMs = Math.pow(2, attempt) * 1000 // 1s, 2s, 4s
      }

      console.log(`Rate limited. Waiting ${waitMs}ms before retry...`)
      await new Promise((resolve) => setTimeout(resolve, waitMs))
      continue
    }

    // Conflict (expectedHeadOid mismatch) — refetch and retry
    if (response.status === 409) {
      console.log('Conflict detected. Refetching HEAD SHA...')
      // Refetch current HEAD SHA and retry
      continue
    }

    throw new Error(`GitHub API error: ${response.status}`)
  }
  throw new Error(`Failed after ${maxRetries} retries`)
}
```

### Pre-Flight Rate Limit Check

```typescript
async function checkRateLimit(token: string) {
  const res = await fetch('https://api.github.com/rate_limit', {
    headers: { Authorization: `Bearer ${token}` },
  })
  const data = await res.json()
  const remaining = data.resources.core.remaining
  const resetAt = new Date(data.resources.core.reset * 1000)

  if (remaining < 10) {
    throw new Error(`Rate limit low: ${remaining} remaining. Resets at ${resetAt}`)
  }
}
```

### Webhook Confirmation Pattern

After creating a PR and enabling auto-merge, confirm the merge completed:

```typescript
// Poll for merge status (or better: use GitHub webhook)
async function waitForMerge(owner: string, repo: string, prNumber: number) {
  for (let i = 0; i < 30; i++) {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`)
    const pr = await res.json()

    if (pr.merged) return pr.merge_commit_sha
    if (pr.state === 'closed' && !pr.merged) throw new Error('PR closed without merge')

    await new Promise((r) => setTimeout(r, 10000)) // wait 10s
  }
  throw new Error('Merge timeout')
}
```

**Better approach: GitHub Webhooks**

- Configure a webhook for `pull_request` events with `action: closed` and `merged: true`
- n8n can receive webhooks and trigger the post-merge revalidation step

---

## Complete Pipeline Architecture

```
┌─────────────────────────────────────────────────────────┐
│  n8n Content Generation Workflow                        │
│                                                         │
│  1. Generate/receive blog content (Claude API)          │
│  2. Generate/download images                            │
│  3. Optimize images (sharp → WebP, resize, compress)    │
│  4. Validate frontmatter (Zod schema)                   │
│  5. Base64 encode all files                             │
│  6. Create branch via GitHub REST API                   │
│  7. Commit files via GraphQL createCommitOnBranch       │
│  8. Create PR via GitHub REST API                       │
│  9. Enable auto-merge via GraphQL                       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  GitHub Actions CI (.github/workflows/validate-blog.yml)│
│                                                         │
│  - Frontmatter schema validation (Zod)                  │
│  - MDX compilation check                                │
│  - Image optimization (calibreapp/image-actions)        │
│  - Next.js build check                                  │
│  - Broken link detection (lychee)                       │
└────────────────────────┬────────────────────────────────┘
                         │ All checks pass → auto-merge
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Vercel Auto-Deploy (triggered by push to main)         │
│                                                         │
│  - Full build and deploy                                │
│  - CDN cache invalidation                               │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│  Post-Deploy (n8n webhook listener)                     │
│                                                         │
│  - Receive GitHub pull_request.closed+merged webhook    │
│  - Call /api/revalidate for on-demand ISR               │
│  - Update internal tracking (Supabase)                  │
│  - Send notification (Slack/email)                      │
└─────────────────────────────────────────────────────────┘
```

---

## Sources

- [Push multiple files under a single commit through GitHub API](https://siddharthav.medium.com/push-multiple-files-under-a-single-commit-through-github-api-f1a5b0b283ae)
- [Gotchas with Git and the GitHub API — Retool Blog](https://retool.com/blog/gotchas-git-github-api)
- [A simpler API for authoring commits — GitHub Changelog](https://github.blog/changelog/2021-09-13-a-simpler-api-for-authoring-commits/)
- [REST API endpoints for Git trees — GitHub Docs](https://docs.github.com/en/rest/git/trees)
- [REST API endpoints for Git blobs — GitHub Docs](https://docs.github.com/en/rest/git/blobs?apiVersion=2022-11-28)
- [How to use createCommitOnBranch — GitHub Community](https://github.com/orgs/community/discussions/24599)
- [GraphQL createCommitOnBranch implementation — Grafana DeepWiki](https://deepwiki.com/grafana/github-api-commit-action/2.2-graphql-integration)
- [GitHub Add/Update/Delete Files on Branch with GraphQL](https://gliptak.github.io/post/github_graphql_branchfile/)
- [peter-evans/enable-pull-request-automerge](https://github.com/peter-evans/enable-pull-request-automerge)
- [Automatically merging a pull request — GitHub Docs](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/incorporating-changes-from-a-pull-request/automatically-merging-a-pull-request)
- [Automate and Auto-Merge PRs using GitHub Actions and CLI](https://www.nickyt.co/blog/automate-and-merge-pull-requests-using-github-actions-and-the-github-cli-4lo6/)
- [Frontmatter JSON Schema Validator — GitHub Marketplace](https://github.com/marketplace/actions/frontmatter-json-schema-validator)
- [remark-lint-frontmatter-schema](https://github.com/JulianCataldo/remark-lint-frontmatter-schema)
- [zod-matter — Typesafe front matter](https://github.com/HiDeoo/zod-matter)
- [calibreapp/image-actions — GitHub](https://github.com/calibreapp/image-actions)
- [Vercel Deploy Hooks — Knowledge Base](https://vercel.com/kb/guide/set-up-and-use-deploy-hooks-with-vercel-and-headless-cms)
- [Getting started with ISR — Vercel Docs](https://vercel.com/docs/incremental-static-regeneration/quickstart)
- [ISR: A flexible way to cache dynamic content — Vercel Blog](https://vercel.com/blog/isr-a-flexible-way-to-cache-dynamic-content)
- [Guides: ISR — Next.js Docs](https://nextjs.org/docs/app/guides/incremental-static-regeneration)
- [On-Demand ISR — Vercel Template](https://vercel.com/templates/next.js/on-demand-incremental-static-regeneration)
- [Comparison of MDX integration strategies with Next.js](https://dev.to/tylerlwsmith/quick-comparison-of-mdx-integration-strategies-with-next-js-1kcm)
- [next-mdx-remote — GitHub](https://github.com/hashicorp/next-mdx-remote)
- [Contentlayer comparison](https://contentlayer.dev/docs/concepts/comparison-d7093dfb)
- [Guides: MDX — Next.js Docs](https://nextjs.org/docs/pages/guides/mdx)
- [Rate limits for the REST API — GitHub Docs](https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api)
- [Managing Rate Limits for the GitHub API — Lunar.dev](https://www.lunar.dev/post/a-developers-guide-managing-rate-limits-for-the-github-api)
- [Understanding GitHub API Rate Limits — GitHub Community](https://github.com/orgs/community/discussions/163553)
- [GitHub Revert Pull Request Guide — DevToolbox](https://devtoolbox.dedyn.io/blog/github-revert-pull-request-guide)
