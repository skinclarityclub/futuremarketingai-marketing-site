# Research: n8n Blog Generation Architecture

> Comprehensive architecture research for an automated blog generation workflow
> Date: 2026-03-17
> Status: Research complete

---

## Table of Contents

1. [n8n Workflow Patterns for Long-Form Content](#1-n8n-workflow-patterns-for-long-form-content)
2. [Multi-Step AI Content Pipelines](#2-multi-step-ai-content-pipelines)
3. [Perplexity API for Blog Research](#3-perplexity-api-for-blog-research)
4. [Claude API for Long-Form Writing](#4-claude-api-for-long-form-writing)
5. [Quality Gates in Automated Content](#5-quality-gates-in-automated-content)
6. [Image Generation Integration](#6-image-generation-integration)
7. [Git-Based Publishing Pipeline](#7-git-based-publishing-pipeline)
8. [Recommended Architecture](#8-recommended-architecture)
9. [Sources](#9-sources)

---

## 1. n8n Workflow Patterns for Long-Form Content

### Multi-Agent Orchestration in n8n

The proven pattern for long-form content in n8n is **specialized agent roles** rather than a single monolithic prompt. Each agent has a focused purpose and limited tool set. n8n coordinates handoffs between agents.

**Recommended agent roles for blog generation:**

| Agent             | Role                                                  | Model                 |
| ----------------- | ----------------------------------------------------- | --------------------- |
| Research Agent    | Gather sources, keywords, competitor data             | Perplexity Sonar Pro  |
| Outline Architect | Structure the post, heading hierarchy, section briefs | Claude Sonnet         |
| Section Writer    | Write individual sections (2-3 at a time)             | Claude Opus / Sonnet  |
| Editor Agent      | Coherence, brand voice, readability, fact-check       | Claude Sonnet         |
| SEO Agent         | Meta, schema, keyword density, internal links         | Claude Haiku / Sonnet |
| Image Agent       | Generate prompts, create images, upload               | GPT-4o + Flux         |
| Publisher Agent   | Format MDX, commit to GitHub, trigger deploy          | n8n native nodes      |

### Chunking Strategies for Long Content

The key constraint is **output token limits**. Even with Claude's 128k output beta, generating 8000 words (~10,000 tokens) in a single call is unreliable for quality. Best practice:

1. **Section-by-section generation**: Generate an outline first, then write each H2 section individually
2. **Accumulating context**: Pass the outline + previously written sections as context to maintain coherence
3. **Parallel where possible**: Independent sections (e.g., FAQ, citations) can be generated in parallel
4. **Progressive summarization**: For very long posts, summarize completed sections rather than passing full text to stay within context limits

### n8n-Specific Patterns

- **Sub-workflows**: Break the pipeline into separate n8n workflows (Research, Writing, Publishing) triggered via webhook or workflow trigger nodes
- **Wait nodes**: Use wait/pause between LLM calls to respect rate limits
- **Error handling**: Each major step should have error branches with retry logic
- **Data persistence**: Store intermediate results in Supabase between steps so the pipeline is resumable
- **Split in Batches**: Use n8n's Split in Batches node to process sections sequentially through the writer agent

### Workflow Structure

```
Trigger (webhook/schedule/manual)
  └─→ Sub-workflow: Research Pipeline
       ├─→ Perplexity: Keyword research (parallel)
       ├─→ Perplexity: Competitor analysis (parallel)
       ├─→ Perplexity: Scientific sources (parallel)
       └─→ Merge + Store research brief in Supabase
  └─→ Sub-workflow: Writing Pipeline
       ├─→ Claude: Generate outline from research brief
       ├─→ Quality gate: Outline review
       ├─→ Split in Batches: For each section
       │    └─→ Claude: Write section (with outline + prior sections as context)
       ├─→ Claude: Editor pass (coherence, transitions, brand voice)
       ├─→ Claude: SEO optimization pass
       └─→ Store draft in Supabase
  └─→ Sub-workflow: Publishing Pipeline
       ├─→ Image generation (Flux via Replicate)
       ├─→ Format as MDX with frontmatter
       ├─→ GitHub API: Commit to repo
       └─→ Notification (Telegram)
```

---

## 2. Multi-Step AI Content Pipelines

### Optimal Pipeline Stages

Based on production content automation systems, the optimal pipeline has **7 stages**:

#### Stage 1: Research & Briefing

- **Input**: Topic/keyword, content calendar entry
- **Actions**: Keyword research, SERP analysis, competitor content audit, source finding
- **Output**: Structured research brief (JSON) with keywords, sources, competitor gaps, target word count
- **Model**: Perplexity Sonar Pro (search-grounded)

#### Stage 2: Outline Generation

- **Input**: Research brief
- **Actions**: Create heading hierarchy, section briefs, internal link opportunities, FAQ suggestions
- **Output**: Structured outline (JSON) with H2/H3 hierarchy, target word counts per section, key points per section
- **Model**: Claude Sonnet (fast, good at structure)

#### Stage 3: Section-by-Section Drafting

- **Input**: Outline + research brief + previously written sections
- **Actions**: Write each section following the outline, incorporate sources, maintain brand voice
- **Output**: Individual section content (markdown)
- **Model**: Claude Opus or Sonnet (best writing quality)
- **Key technique**: Process sections sequentially, passing an accumulating "story so far" summary

#### Stage 4: Assembly & Coherence Edit

- **Input**: All sections combined
- **Actions**: Ensure transitions between sections, eliminate redundancy, verify narrative flow, add intro/conclusion
- **Output**: Complete draft (markdown)
- **Model**: Claude Sonnet (good at editing tasks)

#### Stage 5: Quality Gates

- **Input**: Complete draft + research brief
- **Actions**: Fact-check against sources, readability scoring, SEO validation, brand voice check
- **Output**: Quality report + revised draft (if issues found)
- **Model**: Claude Sonnet + external APIs
- **Loop**: If quality score < threshold, send back to Stage 4 with feedback

#### Stage 6: Enrichment & Formatting

- **Input**: Approved draft
- **Actions**: Generate frontmatter, FAQ schema, citation formatting, image prompts, internal links
- **Output**: Complete MDX file with frontmatter
- **Model**: Claude Haiku (structured data extraction)

#### Stage 7: Publishing

- **Input**: MDX file + images
- **Actions**: Commit to GitHub, trigger deployment, send notification
- **Output**: Published blog post URL
- **Tools**: GitHub API, Vercel webhook, Telegram

### Context Passing Between Steps

The critical challenge is passing context between steps without exceeding token limits:

1. **Research brief**: Structured JSON (~2-4k tokens) — compact representation of all research
2. **Outline**: Structured JSON (~1-2k tokens) — serves as the "blueprint" throughout
3. **Section context**: Pass outline + summary of completed sections + current section brief (~4-8k tokens per call)
4. **Full draft**: Only assembled once for the editing stage (~10-15k tokens for 8000 words)

**Rule of thumb**: Never pass raw research to the writer. Always condense into a structured brief first.

### Using Different Models for Different Steps

| Step          | Best Model           | Why                                                   |
| ------------- | -------------------- | ----------------------------------------------------- |
| Research      | Perplexity Sonar Pro | Search-grounded, citations included                   |
| Outline       | Claude Sonnet        | Fast, structured, good at organization                |
| Writing       | Claude Opus/Sonnet   | Best prose quality, brand voice adherence             |
| Editing       | Claude Sonnet        | Good at identifying issues, fast enough for iteration |
| SEO/Meta      | Claude Haiku         | Simple structured tasks, cheapest                     |
| Fact-check    | Perplexity Sonar     | Can verify claims against web                         |
| Image prompts | GPT-4o               | Strong at creative image descriptions                 |

---

## 3. Perplexity API for Blog Research

### Model Selection

| Model                   | Best For                                | Context | Price (input/output per M tokens) |
| ----------------------- | --------------------------------------- | ------- | --------------------------------- |
| **Sonar**               | Quick lookups, simple questions         | 127,072 | $1 / $1                           |
| **Sonar Pro**           | Multi-step research, complex queries    | 200,000 | $3 / $15                          |
| **Sonar Deep Research** | Exhaustive analysis, literature reviews | 128,000 | $2 / $8 + $5/1k searches          |

**Recommendation**: Use **Sonar Pro** for the blog research pipeline. It provides double the citations vs Sonar, handles complex multi-step queries well, and has the largest context window. Reserve Deep Research for pillar content or medical topics requiring exhaustive source gathering.

### Research Query Patterns

#### Keyword Research & Search Intent

```
System: You are an SEO research specialist. Return structured JSON.
User: For the topic "[TOPIC]", provide:
1. Primary keyword and search volume estimate
2. 10 secondary keywords with search intent (informational/transactional/navigational)
3. 5 long-tail question keywords
4. LSI (Latent Semantic Indexing) terms
5. Content gaps in top 10 SERP results
Format as JSON.
```

#### Competitor Content Analysis

```
System: You are a content strategist analyzing competitor blog posts.
User: Analyze the top 5 ranking articles for "[PRIMARY KEYWORD]":
1. Average word count
2. Heading structure patterns
3. Topics covered vs missed
4. Content freshness (publish/update dates)
5. Unique angles or data points
6. Internal linking patterns
Return structured analysis as JSON.
```

#### Scientific Source Finding

```
System: You are a medical research assistant. Only cite peer-reviewed sources.
User: Find 5-8 scientific studies related to "[TOPIC]" published after 2020.
For each, provide: title, authors, journal, year, DOI or PMID, study type
(RCT, meta-analysis, cohort, etc.), and a 1-sentence summary of findings.
Format as JSON array.
```

#### Fact Verification

```
System: You are a fact-checker. Verify each claim against authoritative sources.
User: Verify the following claims from a blog post draft:
[LIST OF CLAIMS]
For each claim, provide: verified (true/false/partially), source, correction if needed.
```

### Extracting Structured Citations

Perplexity returns citations as numbered references in the response text. To extract structured data:

1. Ask Perplexity to return citations in a specific JSON format within the response
2. Parse the JSON from the response in n8n using a Code node
3. Map to the target citation schema:

```json
{
  "title": "Study Title",
  "authors": ["Author, A.", "Author, B."],
  "journal": "Journal Name",
  "year": 2024,
  "doi": "10.xxxx/xxxxx",
  "studyType": "meta-analysis"
}
```

### Cost Optimization

- Use **Sonar** (cheapest) for simple keyword lookups
- Use **Sonar Pro** for complex multi-step research
- Batch related queries into single calls where possible
- Cache research results in Supabase — reuse for related topics
- Use search mode "medium" for most queries, "high" only for pillar content

---

## 4. Claude API for Long-Form Writing

### Handling the Output Token Limit

Claude's models have the following output limits:

- **Claude Haiku 4.5**: 8,192 tokens
- **Claude Sonnet 4.6**: 16,384 tokens (64k with beta header)
- **Claude Opus 4.6**: 16,384 tokens (128k with beta header)

For 8,000 word posts (~10,000-12,000 tokens), a single call may hit limits. Solutions:

#### Strategy A: Section-by-Section (Recommended)

Generate each H2 section separately (600-1500 words each). This:

- Stays well within token limits
- Allows targeted prompting per section
- Enables parallel generation of independent sections
- Makes quality gates granular

#### Strategy B: Extended Output Beta

Use header `anthropic-beta: output-128k-2025-02-19` for Opus/Sonnet to unlock up to 128k output tokens. Viable for shorter posts (2000-4000 words) in a single call, but quality degrades for very long outputs.

#### Strategy C: Continuation Chaining

If a response hits max_tokens (stop_reason: "max_tokens"), append the assistant's partial response and send "Continue from where you left off." This is brittle and not recommended for production.

**Recommendation**: Strategy A (section-by-section) for posts >3000 words. Strategy B for shorter posts.

### Extended Thinking

Claude's extended thinking feature allows the model to "think" before responding, dramatically improving quality on complex tasks.

**When to use extended thinking:**

- Outline generation (complex structural reasoning)
- Editor pass (needs to reason about coherence across full post)
- Fact-checking (needs to cross-reference claims)

**When NOT to use:**

- Section writing (straightforward generation, thinking adds latency without proportional quality gain)
- Formatting/MDX conversion (simple transformation)

**Configuration:**

```json
{
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  }
}
```

Note: Extended thinking requires `temperature: 1` and is incompatible with `system` prompts being placed in the normal system field. Use a `<system>` tag in the user message instead, or use the dedicated thinking system prompt field if available.

### Structured Output

For stages that need JSON (outline, frontmatter, citations), use Claude's structured output:

```json
{
  "messages": [...],
  "tool_choice": {"type": "tool", "name": "generate_outline"},
  "tools": [{
    "name": "generate_outline",
    "description": "Generate a structured blog post outline",
    "input_schema": {
      "type": "object",
      "properties": {
        "title": {"type": "string"},
        "sections": {
          "type": "array",
          "items": {
            "type": "object",
            "properties": {
              "heading": {"type": "string"},
              "level": {"type": "integer", "enum": [2, 3]},
              "brief": {"type": "string"},
              "targetWords": {"type": "integer"},
              "keyPoints": {"type": "array", "items": {"type": "string"}}
            }
          }
        }
      }
    }
  }]
}
```

This forces Claude to return valid JSON matching your schema. More reliable than asking for JSON in the prompt.

### Brand Voice System Prompt

For the SKC platform (Dutch, holistic skincare, Sindy's voice):

```
Je bent Sindy Kienstra, huidspecialist en oprichter van SkinClarity Club.
Je schrijft blogposts voor je platform over holistische huidverzorging.

Schrijfstijl:
- Warm, toegankelijk maar professioneel
- Evidence-based: verwijs naar studies en onderzoek
- Holistische benadering: verbind huidgezondheid met voeding, stress, lifestyle
- Gebruik "je/jij" aanspreekvorm
- Vermijd overdreven claims — wees eerlijk over wat wel/niet bewezen is
- Geef praktische, actionable adviezen
- Schrijf in het Nederlands (geen anglicismen tenzij gangbaar in skincare)

Structuur:
- Begin met herkenbare situatieschets (empathie)
- Gebruik korte alinea's (max 3-4 zinnen)
- Wissel af: tekst, opsommingen, praktische tips, quotes uit onderzoek
- Eindig met concrete volgende stappen

Verboden:
- Medische diagnoses stellen
- Medicatie aanbevelen
- Garanties over resultaten
- Clickbait of sensationalisme
```

### Maintaining Consistency Across Sections

When generating sections separately, consistency is the main risk. Mitigations:

1. **Shared outline**: Every section call includes the full outline as context
2. **Style reference**: Include the first 500 words of the post as a "style anchor" in subsequent section calls
3. **Running summary**: After each section, generate a 2-sentence summary and pass it forward
4. **Terminology list**: Extract key terms from the first section and enforce them in subsequent calls
5. **Editor pass**: The final coherence edit catches remaining inconsistencies

---

## 5. Quality Gates in Automated Content

### Gate Architecture

Implement quality gates as **a separate n8n sub-workflow** that scores the draft on multiple dimensions. If the total score falls below threshold, the draft loops back for revision (max 2 iterations).

```
Draft Input
  ├─→ Gate 1: Factual Accuracy (parallel)
  ├─→ Gate 2: Readability Score (parallel)
  ├─→ Gate 3: SEO Compliance (parallel)
  ├─→ Gate 4: Brand Voice (parallel)
  ├─→ Gate 5: Medical Safety (parallel)
  └─→ Merge scores → Pass/Fail decision
       ├─→ Pass: Continue to publishing
       └─→ Fail: Send to Editor Agent with feedback → Re-check
```

### Gate 1: Factual Accuracy

**Approach**: Use Perplexity Sonar to verify key claims.

1. Extract factual claims from the draft (Claude Haiku: "List all factual claims in this text as a JSON array")
2. For each claim, query Perplexity: "Is this claim accurate? [CLAIM]. Cite sources."
3. Flag any claim that cannot be verified or is contradicted

**Tools**: Perplexity Sonar API, Claude Haiku for claim extraction

### Gate 2: Readability

**Metrics to check:**

- Flesch-Kincaid Reading Ease (target: 60-70 for Dutch consumer health content)
- Average sentence length (target: 15-20 words)
- Paragraph length (target: 2-4 sentences)
- Passive voice percentage (target: <15%)

**Implementation**: Use a Code node in n8n with a readability library, or use Claude Haiku to score readability and suggest improvements.

### Gate 3: SEO Compliance

**Checklist (automated via Claude Haiku):**

- [ ] Primary keyword in title, H1, first 100 words, and meta description
- [ ] Secondary keywords distributed across H2 headings
- [ ] Internal links to pillar pages (minimum 3)
- [ ] External links to authoritative sources (minimum 2)
- [ ] Image alt text contains keywords
- [ ] Meta description: 150-160 characters
- [ ] Heading hierarchy is valid (H1 → H2 → H3, no skips)
- [ ] Word count meets target (within 10%)
- [ ] FAQ schema present (minimum 3 questions)

### Gate 4: Brand Voice Compliance

**Approach**: Use Claude with the brand voice system prompt to evaluate the draft.

```
Beoordeel deze blogpost op merkstemscore (0-10) voor SkinClarity Club:

Criteria:
1. Toon: Warm, toegankelijk, professioneel (niet klinisch, niet casual)
2. Aanspreekvorm: Consistent je/jij gebruik
3. Holistische benadering: Verbinding huid-voeding-lifestyle
4. Evidence-based: Claims onderbouwd met bronnen
5. Praktisch: Concrete, actionable adviezen
6. Taal: Correct Nederlands, gangbare skincare-termen

Geef per criterium een score (0-10) en overall score.
Geef specifieke verbeterpunten als score < 7.
```

### Gate 5: Medical Safety (Critical for Health Content)

**Automated checks:**

- No diagnostic claims ("als je X hebt, heb je Y")
- No medication recommendations without "raadpleeg je arts" disclaimer
- No guarantee language ("geneest", "lost op", "100%")
- Disclaimer present for medical topics
- Claims align with Dutch KOAG/KAG advertising code for health products

**Implementation**: Claude with a specialized system prompt listing forbidden patterns + regex checks in a Code node for specific phrases.

### Quality Score Thresholds

| Gate             | Weight   | Pass Threshold                 |
| ---------------- | -------- | ------------------------------ |
| Factual Accuracy | 30%      | All claims verified or flagged |
| Readability      | 15%      | Score 55+ (Flesch-Kincaid NL)  |
| SEO Compliance   | 20%      | 8/9 checklist items pass       |
| Brand Voice      | 20%      | Score 7+ / 10                  |
| Medical Safety   | 15%      | Zero critical flags            |
| **Overall**      | **100%** | **Weighted score > 75%**       |

---

## 6. Image Generation Integration

### Architecture Decision: Flux via Replicate

| Option                       | Pros                                          | Cons                                   | Cost                 |
| ---------------------------- | --------------------------------------------- | -------------------------------------- | -------------------- |
| **DALL-E 3** (OpenAI)        | Best prompt understanding, consistent quality | Less stylistic control, no fine-tuning | $0.04-0.08/image     |
| **Flux Dev** (Replicate)     | Open weights, fine-tunable, great quality     | Slower, requires prompt engineering    | ~$0.03/image         |
| **Flux Schnell** (Replicate) | Fastest, cheapest                             | Lower quality than Dev                 | ~$0.003/image        |
| **Midjourney**               | Best aesthetics                               | No official API, requires Discord bot  | $10+/mo subscription |

**Recommendation**: **Flux Dev via Replicate** for hero images (quality matters), **Flux Schnell** for inline illustrations (volume matters). This matches the proven pattern of ~300 posts/month with 4 images each.

### Image Types per Blog Post

1. **Hero/Featured Image** (1x): 1200x630px, OG-compatible, represents the topic
2. **Section Illustrations** (2-3x): 800x600px, support key sections
3. **Infographic** (0-1x): 800x1200px, data visualization (optional, complex)

### n8n Integration Pattern

```
Blog Draft Complete
  └─→ Claude Haiku: Generate image prompts from draft
       ├─→ Hero image prompt (detailed, brand-aligned)
       ├─→ Section image prompts (2-3)
       └─→ Infographic data (if applicable)
  └─→ Split in Batches: For each image prompt
       └─→ HTTP Request: Replicate API (Flux Dev/Schnell)
            POST https://api.replicate.com/v1/predictions
            {
              "version": "flux-dev model version hash",
              "input": {
                "prompt": "[GENERATED PROMPT]",
                "width": 1200,
                "height": 630,
                "num_inference_steps": 28,
                "guidance_scale": 3.5
              }
            }
       └─→ Wait for completion (poll or webhook)
       └─→ Download image binary
       └─→ Upload to storage (Supabase Storage or GitHub)
```

### Image Prompt Engineering for Blog Content

**Template for hero images:**

```
Professional photography style. [SUBJECT DESCRIPTION].
Soft natural lighting, clean background, warm color palette
with blush pink and sage green accents. Skincare/wellness aesthetic.
No text overlays. High resolution, editorial quality.
Aspect ratio 1200:630.
```

**Brand consistency tips:**

- Maintain a consistent color palette across all generated images
- Use a "style suffix" appended to every prompt: brand colors, lighting style, mood
- For SKC: Warm, natural, feminine aesthetic. Soft focus backgrounds. Clean/minimal.
- Avoid: clinical/medical imagery, before/after photos, unrealistic skin

### Storage & CDN

For a Next.js site on Vercel:

- **Option A**: Commit images to `/public/images/blog/` in the repo (simple, versioned, but increases repo size)
- **Option B**: Upload to Supabase Storage and reference via public URL (decoupled, scalable)
- **Option C**: Upload to Vercel Blob Storage (closest to deployment, good caching)

**Recommendation**: Option A for hero images (small number, need to be in repo for OG tags), Option B for inline images at scale.

---

## 7. Git-Based Publishing Pipeline

### GitHub API for Automated Commits

n8n has a native GitHub node, but for multi-file operations (MDX + images), the **REST API via HTTP Request node** is more flexible.

#### Step 1: Create file content (Base64 encoded)

```javascript
// n8n Code node
const mdxContent = $input.item.json.mdxContent
const base64Content = Buffer.from(mdxContent).toString('base64')
return { content: base64Content }
```

#### Step 2: Create or update file via GitHub API

```
PUT https://api.github.com/repos/{owner}/{repo}/contents/{path}
{
  "message": "feat(blog): add {slug}",
  "content": "{base64_content}",
  "branch": "main"  // or "content/auto-publish"
}
```

For the target path: `src/content/blog/{slug}.mdx`

#### Step 3: Multi-file commit (MDX + images)

For committing multiple files atomically, use the Git Trees API:

1. **Get current commit SHA**: `GET /repos/{owner}/{repo}/git/ref/heads/main`
2. **Get current tree SHA**: `GET /repos/{owner}/{repo}/git/commits/{commit_sha}`
3. **Create blobs** for each file: `POST /repos/{owner}/{repo}/git/blobs`
4. **Create new tree**: `POST /repos/{owner}/{repo}/git/trees` with all blobs
5. **Create commit**: `POST /repos/{owner}/{repo}/git/commits`
6. **Update ref**: `PATCH /repos/{owner}/{repo}/git/ref/heads/main`

This is the pattern used by the n8n template "Push multiple files to GitHub repository via GitHub REST API."

### Branch Strategy

**Two options:**

| Strategy           | Flow                                  | Best For                                                    |
| ------------------ | ------------------------------------- | ----------------------------------------------------------- |
| **Direct to main** | Commit → Auto-deploy                  | Trusted, fully automated pipeline with strong quality gates |
| **PR-based**       | Branch → PR → Review → Merge → Deploy | Human-in-the-loop review before publishing                  |

**Recommendation**: Start with **PR-based** (create branch `content/{slug}`, open PR, send Telegram notification for review). Once quality gates are proven reliable (>95% pass rate), switch to direct-to-main.

### Vercel Deployment Trigger

With Vercel connected to GitHub:

- **Automatic**: Every push to main triggers a production deployment. Every PR gets a preview deployment.
- **Manual trigger** (if needed): `POST https://api.vercel.com/v1/integrations/deploy/{deploy-hook-id}`

No extra configuration needed if Vercel-GitHub integration is already set up.

### MDX File Naming Convention

Based on existing SKC blog structure:

```
src/content/blog/{slug}.mdx
```

Where slug is derived from the title: lowercase, hyphens, no special characters.
Example: `hormonale-acne-behandeling.mdx`

### Complete n8n Publishing Sub-Workflow

```
Input: MDX content + image binaries
  ├─→ Code node: Generate slug from title
  ├─→ Code node: Base64 encode MDX content
  ├─→ For each image:
  │    └─→ HTTP Request: Create blob via GitHub API
  ├─→ HTTP Request: Create tree with MDX + image blobs
  ├─→ HTTP Request: Create commit
  ├─→ HTTP Request: Create branch (content/{slug})
  ├─→ HTTP Request: Create PR
  │    Title: "blog: {title}"
  │    Body: Auto-generated summary, word count, quality scores
  ├─→ Telegram: Send notification with PR link for review
  └─→ Store publish record in Supabase
```

---

## 8. Recommended Architecture

### Complete Workflow Overview

Based on all research, here is the recommended architecture for the SKC blog generation system:

```
┌─────────────────────────────────────────────────────────────┐
│                    TRIGGER LAYER                             │
│  Content Calendar (Supabase) → Cron trigger (weekly)         │
│  Manual trigger (Telegram command or webhook)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              SUB-WORKFLOW 1: RESEARCH                         │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Keyword  │  │Competitor│  │Scientific│  ← Perplexity     │
│  │ Research │  │ Analysis │  │ Sources  │    Sonar Pro       │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘                  │
│       └──────────────┼─────────────┘                         │
│                      ▼                                       │
│              Research Brief (JSON)                            │
│              → Store in Supabase                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              SUB-WORKFLOW 2: WRITING                          │
│                                                              │
│  Research Brief → Claude Sonnet: Generate Outline            │
│                          ▼                                   │
│                   Outline (JSON)                             │
│                          ▼                                   │
│           ┌──── Split in Batches ────┐                      │
│           │  For each H2 section:    │                      │
│           │  Claude Opus: Write      │                      │
│           │  (outline + prior ctx)   │                      │
│           └──────────┬───────────────┘                      │
│                      ▼                                       │
│           Claude Sonnet: Editor Pass                         │
│           (coherence, transitions, voice)                    │
│                      ▼                                       │
│           Claude Sonnet: SEO Pass                            │
│           (keywords, links, meta)                            │
│                      ▼                                       │
│              Complete Draft                                   │
│              → Store in Supabase                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              SUB-WORKFLOW 3: QUALITY GATES                    │
│                                                              │
│  ┌─────────┐ ┌──────────┐ ┌─────┐ ┌───────┐ ┌────────┐   │
│  │ Fact    │ │Readabil- │ │ SEO │ │Brand  │ │Medical │   │
│  │ Check   │ │ity Score │ │Check│ │Voice  │ │Safety  │   │
│  └────┬────┘ └────┬─────┘ └──┬──┘ └───┬───┘ └───┬────┘   │
│       └───────────┼──────────┼────────┼─────────┘          │
│                   ▼                                          │
│           Score Aggregation                                  │
│           ├─→ Pass (>75%): Continue                         │
│           └─→ Fail: Loop to Editor (max 2x)                │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              SUB-WORKFLOW 4: ENRICHMENT                       │
│                                                              │
│  Draft → Claude Haiku: Generate image prompts                │
│       → Claude Haiku: Generate frontmatter JSON              │
│       → Claude Haiku: Generate FAQ schema                    │
│       → Claude Haiku: Format citations                       │
│                   ▼                                          │
│  Image prompts → Flux Dev (Replicate): Hero image            │
│               → Flux Schnell (Replicate): Section images     │
│                   ▼                                          │
│  Assemble MDX file (Code node)                               │
│  → Store final MDX in Supabase                               │
└─────────────────┬───────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────┐
│              SUB-WORKFLOW 5: PUBLISH                          │
│                                                              │
│  MDX + Images → GitHub API: Create branch                    │
│              → GitHub API: Commit files (tree API)           │
│              → GitHub API: Create PR                         │
│              → Telegram: Notify with PR link                 │
│              → Supabase: Update publish status               │
│                                                              │
│  (Vercel auto-deploys preview on PR creation)                │
│  (After human approval + merge → production deploy)          │
└─────────────────────────────────────────────────────────────┘
```

### Target MDX Output Format

Based on existing SKC blog posts:

```yaml
---
title: '{Generated Title}'
slug: '{generated-slug}'
excerpt: '{150-200 char excerpt}'
author: 'Sindy Kienstra'
publishedDate: '{YYYY-MM-DD}'
updatedDate: '{YYYY-MM-DD}'
category: '{Category}'
pillarPage: '{pillar-slug}'
featuredImage: '/images/blog/{slug}.jpeg'
tags: ['{tag1}', '{tag2}', '{tag3}']
readTime: {calculated}
medicallyReviewed: false

faqs:
  - question: '{FAQ question}'
    answer: '{FAQ answer}'

citations:
  - title: '{Study title}'
    authors: ['{Author, A.}']
    journal: '{Journal Name}'
    year: {YYYY}
    doi: '{DOI}'
    studyType: '{type}'
---

{MDX content with ## headings, **bold**, lists, links}
```

### Estimated Costs Per Blog Post

| Component                                 | Calls       | Est. Cost      |
| ----------------------------------------- | ----------- | -------------- |
| Perplexity Sonar Pro (research)           | 3-4 queries | $0.15-0.30     |
| Claude Sonnet (outline + editing)         | 3-4 calls   | $0.10-0.20     |
| Claude Opus (section writing)             | 5-8 calls   | $0.50-1.50     |
| Claude Haiku (quality gates + formatting) | 5-8 calls   | $0.02-0.05     |
| Perplexity Sonar (fact-check)             | 3-5 queries | $0.05-0.10     |
| Flux Dev (hero image)                     | 1 image     | $0.03          |
| Flux Schnell (section images)             | 2-3 images  | $0.01          |
| **Total per post**                        |             | **$0.86-2.19** |

### Implementation Priority

1. **Phase 1**: Research + Outline + Single-pass writing (MVP, fastest to value)
2. **Phase 2**: Section-by-section writing + Editor pass (quality improvement)
3. **Phase 3**: Quality gates + revision loop (reliability)
4. **Phase 4**: Image generation + GitHub publishing (full automation)
5. **Phase 5**: Content calendar integration + scheduling (scale)

---

## 9. Sources

### n8n Workflow Patterns

- [Multi-agent system: Frameworks & tutorial - n8n Blog](https://blog.n8n.io/multi-agent-systems/)
- [Multi-Agent PDF-to-Blog Content Generation - n8n Template](https://n8n.io/workflows/2457-multi-agent-pdf-to-blog-content-generation/)
- [Multi Agent Solutions in n8n - HatchWorks](https://hatchworks.com/blog/ai-agents/multi-agent-solutions-in-n8n/)
- [AI Agentic Workflows - n8n Blog](https://blog.n8n.io/ai-agentic-workflows/)
- [AI Agent Orchestration Frameworks - n8n Blog](https://blog.n8n.io/ai-agent-orchestration-frameworks/)
- [The Blog Agent - n8n Template](https://n8n.io/workflows/11536-the-blog-agent/)

### Multi-Step LLM Pipelines

- [Multi-Step LLM Chains: Best Practices - Deepchecks](https://deepchecks.com/orchestrating-multi-step-llm-chains-best-practices/)
- [LLM Orchestration 2025 - Label Your Data](https://labelyourdata.com/articles/llm-fine-tuning/llm-orchestration)
- [Prompt Structure Chaining for LLMs - orq.ai](https://orq.ai/blog/prompt-structure-chaining)
- [LLM Workflows in Production - AI Today](https://ai.trendnest.org/2025/07/20/llm-workflows-in-production/)

### Perplexity API

- [Introducing Sonar Pro API - Perplexity](https://www.perplexity.ai/hub/blog/introducing-the-sonar-pro-api)
- [Sonar Deep Research - Perplexity Docs](https://docs.perplexity.ai/getting-started/models/models/sonar-deep-research)
- [Perplexity API Pricing](https://docs.perplexity.ai/docs/getting-started/pricing)
- [Sonar Performance Benchmarks - Perplexity](https://www.perplexity.ai/hub/blog/perplexity-sonar-dominates-new-search-arena-evolution)

### Claude API & Prompt Engineering

- [Prompting Best Practices - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices)
- [Long Context Prompting Tips - Anthropic](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/long-context-tips)
- [Building with Extended Thinking - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Extended Thinking Tips - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/extended-thinking-tips)
- [Context Windows - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/context-windows)
- [Handling Stop Reasons - Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/handling-stop-reasons)

### Quality Gates

- [QA AI-Generated Content + Checklist - Search Engine Land](https://searchengineland.com/guide/qa-workflow-for-ai-generate-content)
- [AI Content Quality Assurance at Scale - Syntora](https://syntora.io/solutions/how-does-ai-content-quality-assurance-work-at-scale)
- [AI SEO Readability Audit - n8n Template](https://n8n.io/workflows/4151-ai-seo-readability-audit-check-website-friendliness-for-llms/)
- [Automated SEO Content Engine with Claude - n8n Template](https://n8n.io/workflows/5985-automated-seo-content-engine-with-claude-ai-scrapeless-and-competitor-analysis/)

### Image Generation

- [Generate Images with Replicate and Flux - n8n Template](https://n8n.io/workflows/7192-generate-images-with-replicate-and-flux/)
- [Flux Kontext Pro via Replicate - n8n Template](https://n8n.io/workflows/6875-create-images-from-text-prompts-using-flux-kontext-pro-and-replicate/)
- [DALL-E 3 Configuration API - n8n Template](https://n8n.io/workflows/2217-configure-your-own-image-creation-api-using-openai-dalle-3/)
- [n8n OpenAI DALL-E Pipeline 2026 - Markaicode](https://markaicode.com/n8n-openai-dalle-image-generation-pipeline/)

### Git-Based Publishing

- [Push Multiple Files to GitHub via REST API - n8n Template](https://n8n.io/workflows/3308-push-multiple-files-to-github-repository-via-github-rest-api/)
- [Push and Update Files in GitHub - n8n Template](https://n8n.io/workflows/1942-push-and-update-files-in-github/)
- [Build & Deploy MVPs with AI, GitHub & Vercel - n8n Template](https://n8n.io/workflows/6164-build-and-deploy-mvps-from-text-prompts-with-ai-github-and-vercel/)
- [Deploying GitHub Projects with Vercel](https://vercel.com/docs/git/vercel-for-github)
- [GitHub Node Documentation - n8n Docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.github/)
