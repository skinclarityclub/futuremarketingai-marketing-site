---
title: n8n Implementation Patterns for Blog Generation Orchestrator
tags: #n8n #research #blog-factory #implementation
created: 2026-03-17
source: Web research (n8n docs, community, templates)
---

# n8n Implementation Patterns for Blog Generation Orchestrator

Research into specific n8n patterns needed for building the blog generation orchestrator workflow, complementing the existing Research Pipeline, Strategy Engine, and Content Factory workflows.

---

## 1. Sub-Workflow Orchestration

### Execute Workflow Node

The **Execute Sub-workflow** node is the core building block for orchestration. It calls one workflow from another, enabling modular, microservice-like architecture.

**Key configuration options:**

- **Source**: Select by workflow ID (hardcoded) or by expression (dynamic routing)
- **Mode**: "Run once with all items" (batch) or "Run once for each item" (per-item processing)
- The sub-workflow MUST start with an **Execute Sub-workflow Trigger** node to receive data

**Data passing:**

- Input: The parent passes its current items to the sub-workflow trigger
- Output: The **last node** in the sub-workflow sends data back to the parent's Execute node
- Data is passed as standard n8n items (JSON objects)

**Error propagation:**

- If the sub-workflow errors, the error propagates up to the parent workflow
- Use error branches on the Execute Workflow node to catch and handle sub-workflow failures
- Sub-workflow executions do NOT count against n8n Cloud execution limits (only the parent counts)

### Parallel Sub-Workflow Pattern

For running multiple sub-workflows in parallel with a "wait for all" pattern:

1. Use multiple Execute Workflow nodes branching from the same node
2. Use a **Merge** node (mode: "Wait for All") to collect all results
3. Alternative: Use callback URLs for truly async parallel execution where sub-workflows report back when finished

**Recommended for our orchestrator:**

```
Webhook Trigger
  -> Execute: Research Sub-workflow
  -> Execute: Strategy Sub-workflow
  -> Merge (Wait for All)
  -> Execute: Content Factory Sub-workflow
  -> Execute: Image Generation Sub-workflow
  -> Finalize & Store
```

### Sources

- [Execute Sub-workflow | n8n Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.executeworkflow/)
- [Sub-workflows | n8n Docs](https://docs.n8n.io/flow-logic/subworkflows/)
- [Parallel sub-workflow execution pattern](https://n8n.io/workflows/2536-pattern-for-parallel-sub-workflow-execution-followed-by-wait-for-all-loop/)
- [Execute Workflow as Functions](https://flowengine.cloud/blog/execute-workflow-node-enables-treating-sub-workflows-as-functions-in-n8n)

---

## 2. Claude API Integration via HTTP Request

### Direct HTTP Request Configuration

When the built-in Anthropic node is insufficient (e.g., for extended thinking or tool_use), use the HTTP Request node directly.

**HTTP Request node setup:**

- **Method**: POST
- **URL**: `https://api.anthropic.com/v1/messages`
- **Authentication**: Generic Header Auth
- **Headers**:
  - `x-api-key`: Your Anthropic API key
  - `anthropic-version`: `2023-06-01`
  - `content-type`: `application/json`

**JSON body structure:**

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 8192,
  "messages": [
    {
      "role": "user",
      "content": "{{ $json.prompt }}"
    }
  ]
}
```

### Extended Thinking Configuration

**Known issue**: n8n's built-in Anthropic Chat Model node has a bug where extended thinking + tool_use fails due to message formatting (the API expects thinking blocks to precede tool_use blocks, but n8n doesn't structure this correctly). See [GitHub Issue #15715](https://github.com/n8n-io/n8n/issues/15715).

**Workaround**: Use HTTP Request node directly with extended thinking:

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 16000,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  },
  "messages": [...]
}
```

### Structured Output with tool_use

For forcing structured JSON output from Claude, use the `tools` parameter:

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 8192,
  "tools": [{
    "name": "blog_section",
    "description": "Output a blog section with structured fields",
    "input_schema": {
      "type": "object",
      "properties": {
        "heading": { "type": "string" },
        "content": { "type": "string" },
        "key_points": { "type": "array", "items": { "type": "string" } }
      },
      "required": ["heading", "content"]
    }
  }],
  "tool_choice": { "type": "tool", "name": "blog_section" },
  "messages": [...]
}
```

### Token Management for Long-Form Content

- Claude Sonnet 4: 200K context, 8192 default output (extendable to 64K with `max_tokens`)
- Claude Opus 4: 200K context, similar output limits
- For long blog posts (3000+ words), generate section-by-section rather than all at once
- Track token usage from response `usage.input_tokens` and `usage.output_tokens`
- Use a Code node to accumulate token counts across iterations for cost tracking

### Sources

- [Build AI Agents with n8n + Claude API](https://n8nlab.io/blog/build-ai-agents-n8n-claude-api)
- [Anthropic Chat Model node docs](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatanthropic/)
- [Claude Extended Thinking + Tools Issue](https://github.com/n8n-io/n8n/issues/15715)
- [Batch process prompts with Anthropic Claude API](https://n8n.io/workflows/3409-batch-process-prompts-with-anthropic-claude-api/)

---

## 3. Perplexity API (Sonar Pro) Integration

### HTTP Request Configuration

Perplexity uses an OpenAI-compatible API format:

- **Method**: POST
- **URL**: `https://api.perplexity.ai/chat/completions`
- **Authentication**: Header Auth with `Authorization: Bearer pplx-YOUR_KEY`
- **Content-Type**: `application/json`

**JSON body:**

```json
{
  "model": "sonar-pro",
  "messages": [
    {
      "role": "system",
      "content": "You are a skincare research assistant. Provide detailed, evidence-based information."
    },
    {
      "role": "user",
      "content": "{{ $json.research_query }}"
    }
  ],
  "max_tokens": 4096,
  "return_citations": true
}
```

### Parallel Research Queries

For running multiple research queries simultaneously:

1. Use a **Code** node to generate an array of research query items
2. Pass all items to a single HTTP Request node (it processes each item individually)
3. Or use **SplitInBatches** with batch size 3 + **Wait** node (1 second) to respect rate limits

### Rate Limit Handling

- Sonar models: **50 requests per minute**
- Search API: **3 requests per second**
- Implement exponential backoff with jitter for retries
- Parse `Retry-After` header from 429 responses
- For our 6-8 research queries per blog: batch into groups of 3 with 1-second delays between batches

### Response Parsing

Perplexity returns citations in the response. Parse them with a Code node:

```javascript
const response = $input.first().json
const content = response.choices[0].message.content
const citations = response.citations || []

return [
  {
    json: {
      research_text: content,
      citations: citations,
      model: response.model,
      usage: response.usage,
    },
  },
]
```

### Sources

- [Query Perplexity AI from n8n workflows](https://n8n.io/workflows/2824-query-perplexity-ai-from-your-n8n-workflows/)
- [Perplexity Sonar Models reusable module](https://n8n.io/workflows/4978-generate-ai-responses-with-perplexity-sonar-models-reusable-module/)
- [AI-powered research assistant with Perplexity Sonar API](https://n8n.io/workflows/3673-ai-powered-research-assistant-with-perplexity-sonar-api/)
- [Perplexity OpenAI Compatibility Guide](https://docs.perplexity.ai/guides/chat-completions-guide)
- [Fix Perplexity API Errors](https://www.hostingseekers.com/blog/fix-perplexity-api-errors-tutorial/)

---

## 4. Loop Patterns for Section Generation

### SplitInBatches for Sequential Section Generation

The **Loop Over Items (Split in Batches)** node is the primary tool for generating blog sections sequentially while accumulating context.

**Pattern for section-by-section generation with context accumulation:**

```
1. Code Node: Generate section outline items (6-8 items with title, instructions, keywords)
2. SplitInBatches (batch size: 1): Process one section at a time
3. Code Node: Build prompt with accumulated context from previous sections
4. HTTP Request: Call Claude API to generate section
5. Code Node: Append generated section to accumulated context
6. -> Loop back to SplitInBatches
7. Done output -> Merge/Assemble final blog post
```

### State Management Between Iterations

**Method 1: Static Data (recommended)**
Use the workflow's static data to persist state between loop iterations:

```javascript
// In Code node inside the loop:
const staticData = $getWorkflowStaticData('global')

// Read accumulated sections
const previousSections = staticData.sections || []

// After generating new section, append it
previousSections.push({
  heading: newSection.heading,
  content: newSection.content,
})
staticData.sections = previousSections

// Build context string for next iteration
const context = previousSections.map((s) => `## ${s.heading}\n${s.content}`).join('\n\n')

return [{ json: { accumulated_context: context, section_count: previousSections.length } }]
```

**Method 2: Item accumulation via Merge node**
After the loop completes, use a Merge node to combine all generated sections.

### Context Window Management

For 6-8 sections, the accumulated context can grow large. Strategies:

- Pass only headings + summaries (not full text) of previous sections as context
- Use a sliding window: only include the last 2-3 full sections plus summaries of earlier ones
- Track token count and truncate context if approaching limits

### Loop Control Expressions

- Check if items remain: `{{ $("Loop Over Items").context["noItemsLeft"] }}`
- Get current index: `{{ $("Loop Over Items").context["currentRunIndex"] }}`
- The loop automatically stops when all items are processed (no If node needed)

### Sources

- [Loop Over Items (Split in Batches) | n8n Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.splitinbatches/)
- [Why Loop Over Items is the most underrated node](https://blog.julietedjere.com/posts/why-loop-over-items-split-in-batches-is-the-most-underrated-node-in-n8n)
- [Hostinger n8n Loop Tutorial](https://www.hostinger.com/tutorials/how-to-loop-over-items-in-n8n)
- [n8n Community: How to Loop](https://community.n8n.io/t/how-to-loop-using-split-in-batches-node/3181)

---

## 5. Error Handling and Retry Patterns

### Node-Level Retry Configuration

Every HTTP Request node has built-in retry settings:

- **Retry On Fail**: Enable on all API call nodes
- **Max Tries**: Default caps at 5
- **Wait Between Tries**: Default caps at 5 seconds
- For Claude/Perplexity calls, set to 3 retries with 5-10 second delays

### Exponential Backoff Pattern

For more sophisticated retry logic (beyond built-in retry):

```
HTTP Request (Claude API)
  -> Error branch
    -> Code Node: Calculate backoff delay
    -> Wait Node: Dynamic delay
    -> If Node: Check retry count < max
      -> True: Loop back to HTTP Request
      -> False: Error workflow / DLQ
```

Backoff calculation in Code node:

```javascript
const retryCount = $json.retryCount || 0
const baseDelay = 2 // seconds
const maxDelay = 60
const delay = Math.min(baseDelay * Math.pow(2, retryCount) + Math.random() * 1000, maxDelay * 1000)

return [
  {
    json: {
      retryCount: retryCount + 1,
      waitSeconds: delay / 1000,
      originalPayload: $json.originalPayload,
    },
  },
]
```

### Error Classification

Map HTTP status codes to actions:

- **429 (Rate Limit)**: Retry with exponential backoff, parse `Retry-After` header
- **500, 502, 503 (Server Error)**: Retry up to 3 times
- **401 (Unauthorized)**: Fail fast, notify (credential issue)
- **400 (Bad Request)**: Fail fast, log payload for debugging
- **Timeout**: Retry with increased timeout setting

### Dead Letter Queue (DLQ)

Implement a DLQ as a separate n8n workflow:

1. Create a DLQ workflow with a Webhook trigger
2. In your main workflow's error branch, send failed items to the DLQ webhook
3. The DLQ workflow stores failed items in Supabase (`blog_generation_failures` table)
4. Include: original payload, error message, timestamp, retry count, workflow execution ID
5. A scheduled workflow can retry DLQ items periodically

### Error Workflow (Global)

Set a global error workflow in Workflow Settings:

- Triggered on any unhandled execution failure
- Sends notification (email/Slack) with execution ID and error details
- Logs to Supabase for monitoring dashboard

### Circuit Breaker Pattern

For protecting against cascading API failures:

- Store failure counts in Supabase or Redis
- Before calling an API, check failure count in last N minutes
- If above threshold, skip the call and use cached/fallback content
- Useful for Claude API outages during batch blog generation

### Sources

- [Advanced retry and delay logic template](https://n8n.io/workflows/5447-advanced-retry-and-delay-logic/)
- [Handling API rate limits | n8n Docs](https://docs.n8n.io/integrations/builtin/rate-limits/)
- [Error handling | n8n Docs](https://docs.n8n.io/flow-logic/error-handling/)
- [n8n Error Handling Patterns: Retry, Dead Letter, Circuit Breaker](https://www.pagelines.com/blog/n8n-error-handling-patterns)
- [Advanced n8n Error Handling and Recovery](https://www.wednesday.is/writing-articles/advanced-n8n-error-handling-and-recovery-strategies)
- [Advanced Error Handling for n8n AI Workflows](https://www.vatech.io/blog/advanced-error-handling-for-n8n-ai-workflows-building-resilient-automations)
- [Exponential backoff for Google APIs template](https://n8n.io/workflows/2556-exponential-backoff-for-google-apis/)

---

## 6. Supabase Integration

### Built-in Supabase Node

The native Supabase node supports:

- **Create**: Insert single rows
- **Delete**: Remove rows by filter
- **Get**: Retrieve rows with filters
- **Get Many**: Retrieve multiple rows
- **Update**: Update rows by filter
- **Upsert**: Insert or update (requires unique constraint)

### Bulk Operations via HTTP Request

For bulk inserts/upserts not supported by the native node, use HTTP Request with PostgREST:

**Bulk upsert:**

- **Method**: POST
- **URL**: `https://YOUR_PROJECT.supabase.co/rest/v1/blog_posts`
- **Headers**:
  - `apikey`: Your Supabase anon/service key
  - `Authorization`: `Bearer YOUR_SERVICE_KEY`
  - `Content-Type`: `application/json`
  - `Prefer`: `resolution=merge-duplicates` (for upsert)
- **Body**: Array of row objects

**Important**: Use `service_role` key (not `anon` key) for n8n integrations to bypass Row Level Security.

### JSONB Column Updates

Update JSONB columns via PostgREST PATCH:

```
PATCH /rest/v1/blog_posts?id=eq.{{ $json.postId }}
Body: { "metadata": { "seo_score": 85, "word_count": 3200, "sections": [...] } }
```

For partial JSONB updates (merge, not replace), use an RPC function.

### RPC Function Calls

Call Postgres functions via PostgREST:

- **Method**: POST
- **URL**: `https://YOUR_PROJECT.supabase.co/rest/v1/rpc/update_blog_status`
- **Body**: Function parameters as JSON

Example Postgres function:

```sql
CREATE OR REPLACE FUNCTION update_blog_status(
  p_blog_id UUID,
  p_status TEXT,
  p_metadata JSONB DEFAULT '{}'
) RETURNS void AS $$
BEGIN
  UPDATE blog_posts
  SET status = p_status,
      metadata = metadata || p_metadata,
      updated_at = NOW()
  WHERE id = p_blog_id;
END;
$$ LANGUAGE plpgsql;
```

### Real-Time Event Triggers

Supabase real-time can trigger n8n workflows:

- Use Database Webhooks (pg_net) to call n8n webhook endpoints on INSERT/UPDATE/DELETE
- Caveat: If n8n restarts, events during downtime are lost
- **Fallback**: Add a scheduled 5-minute cron poll for unprocessed rows

### Best Practices

- Batch rows in groups of 100-500 for bulk operations
- Use ULID or UUID v7 for ordered IDs
- Use `INSERT ... ON CONFLICT` for upserts
- Filter at the database level, not in n8n

### Sources

- [Supabase node documentation | n8n Docs](https://docs.n8n.io/integrations/builtin/app-nodes/n8n-nodes-base.supabase/)
- [n8n + Supabase: Upserts, Rate Limits, Webhooks](https://rolandsoftwares.com/content/n8n-supabase-postgres-upserts-rate-limits-webhooks/)
- [Supabase insertion & upsertion & retrieval template](https://n8n.io/workflows/2395-supabase-insertion-and-upsertion-and-retrieval/)
- [n8n Supabase Real-Time Trigger Workflows](https://markaicode.com/n8n-supabase-node-realtime-trigger-workflows/)
- [PostgREST RPC with Supabase](https://medium.com/stream-zero/postgrest-a-little-gem-supabase-postgres-functions-with-postgrest-d7819377d453)

---

## 7. Image Generation Integration

### Replicate API (Flux) via HTTP Request

Replicate uses an async prediction pattern:

**Step 1 - Create Prediction:**

- **Method**: POST
- **URL**: `https://api.replicate.com/v1/predictions`
- **Headers**: `Authorization: Bearer YOUR_REPLICATE_TOKEN`
- **Body**:

```json
{
  "version": "FLUX_MODEL_VERSION_ID",
  "input": {
    "prompt": "{{ $json.image_prompt }}",
    "width": 1200,
    "height": 630,
    "num_outputs": 1
  }
}
```

**Step 2 - Poll for Completion:**

```
Create Prediction -> Extract prediction ID
  -> Wait (5 seconds)
  -> HTTP Request: GET /v1/predictions/{{ predictionId }}
  -> Code Node: Check status
    -> If "succeeded": Continue to download
    -> If "processing"/"starting": Loop back to Wait
    -> If "failed"/"canceled": Error branch
```

**Step 3 - Download Image:**

- HTTP Request GET to the output URL from the prediction result
- The response comes as binary data

### Upload to Supabase Storage

**Method**: POST

- **URL**: `https://YOUR_PROJECT.supabase.co/storage/v1/object/blog-images/{{ $json.filename }}`
- **Headers**:
  - `Authorization`: `Bearer SERVICE_ROLE_KEY`
  - `Content-Type`: `image/webp` (or appropriate MIME type)
- **Body**: Binary data from the download step
- **Send Binary Data**: Enable and select the binary property

### Base64 Handling

If the image API returns base64:

1. Use a **Code** node to strip the `data:image/...;base64,` prefix
2. Use the **Convert to File** node to convert base64 string to binary
3. Then upload the binary to Supabase Storage

### OpenAI DALL-E Alternative

- **URL**: `https://api.openai.com/v1/images/generations`
- Returns base64 or URL directly (no polling needed)
- Simpler integration but less control over style

### Sources

- [Generate Images with Replicate API template](https://n8n.io/workflows/3176-generate-images-from-text-prompts-with-google-imagen-3-via-replicate-api/)
- [Replicate HTTP API docs](https://replicate.com/docs/reference/http)
- [Upload files to Supabase Storage template](https://n8n.io/workflows/4920-upload-and-categorize-files-with-supabase-storage-and-secure-url-generation/)
- [Supabase Storage tutorial template](https://n8n.io/workflows/8228-supabase-storage-tutorial-upload-fetch-sign-and-list-files/)
- [n8n Image Generator with Flux](https://github.com/YatharthSanghavi/n8n-image-generator)

---

## 8. Webhook Patterns

### Trigger Configuration

**Webhook node setup for blog generation trigger:**

- **HTTP Method**: POST
- **Path**: `/blog-generation/trigger`
- **Response Mode**: "Respond to Webhook" (for async pattern)
- **Authentication**: Header Auth (verify `x-api-key` header)

### Authentication Options

1. **Header Auth**: Check for a static API key in request headers (simplest)
2. **Basic Auth**: Username + password verification
3. **JWT Auth**: Validate signed JSON Web Tokens and claims (most secure)
4. **HMAC Signature**: Verify request integrity (for webhook-to-webhook calls)

### Async Response Pattern

For long-running blog generation (5-15 minutes), use the async polling pattern:

```
Webhook Trigger (receives request)
  -> Code Node: Generate jobId (UUID)
  -> Respond to Webhook: Return { jobId, status: "processing" } immediately
  -> Continue with blog generation pipeline...
  -> Update job status in Supabase when complete
```

The dashboard polls a second endpoint:

```
GET /blog-generation/status?jobId=xxx
  -> Query Supabase for job status
  -> Return current status + progress percentage
```

### Payload Validation

Add a Code node immediately after the webhook to validate:

```javascript
const body = $input.first().json.body

// Required fields
const required = ['keyword', 'topic', 'language', 'target_audience']
const missing = required.filter((field) => !body[field])

if (missing.length > 0) {
  throw new Error(`Missing required fields: ${missing.join(', ')}`)
}

// Sanitize and pass through
return [
  {
    json: {
      keyword: body.keyword.trim(),
      topic: body.topic.trim(),
      language: body.language || 'nl',
      target_audience: body.target_audience,
      priority: body.priority || 'normal',
      requested_at: new Date().toISOString(),
    },
  },
]
```

### Sources

- [Webhook node documentation | n8n Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Respond to Webhook | n8n Docs](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.respondtowebhook/)
- [Webhook credentials | n8n Docs](https://docs.n8n.io/integrations/builtin/credentials/webhook/)
- [Mastering the n8n Webhook Node: Fundamentals](https://automategeniushub.com/mastering-the-n8n-webhook-node-part-a/)
- [Mastering the n8n Webhook Node: Security](https://automategeniushub.com/mastering-the-n8n-webhook-node-part-b/)
- [Secure Webhook template](https://n8n.io/workflows/5174-creating-a-secure-webhook-must-have/)

---

## 9. Performance Optimization

### Memory Management

n8n does NOT restrict data size per node, so large text payloads can cause memory issues.

**Strategies for blog generation:**

- Split workflow into sub-workflows (each sub-workflow's memory is scoped to its execution)
- Avoid passing full blog content between nodes unnecessarily; store in Supabase and pass only IDs
- Process sections in batches of 1 (SplitInBatches) to limit concurrent memory usage
- Use Code nodes to trim/summarize data before passing downstream

### Execution Time Limits

- n8n Cloud: Execution timeout varies by plan (typically 5-30 minutes)
- Self-hosted: Configurable via `EXECUTIONS_TIMEOUT` environment variable
- Blog generation may take 10-20 minutes; set timeout accordingly
- Use `EXECUTIONS_TIMEOUT` of at least 1800 (30 minutes) for safety

### Binary Data Handling

- Images are handled as binary data in n8n (separate from JSON items)
- Use the **Convert to File** node for base64 -> binary conversion
- Upload binary data directly to Supabase Storage (don't pass through multiple nodes)
- Clean up binary data from items once uploaded to avoid memory bloat

### Workflow Design Best Practices

1. **Filter at source**: Only fetch needed data from Supabase, not entire tables
2. **Minimize item size**: Strip unnecessary fields with Set or Code nodes
3. **Sub-workflow isolation**: Heavy processing in sub-workflows scopes memory usage
4. **Avoid storing large text in static data**: Use Supabase as intermediate storage
5. **Caching**: Cache repeated API calls (e.g., brand voice documents) in static data
6. **Worker scaling**: For self-hosted, one worker per CPU core for parallel executions

### Monitoring

- Track execution times and memory usage via n8n's execution history
- Set up alerts for executions exceeding expected duration
- Log token usage (Claude/Perplexity) per blog post for cost tracking

### Sources

- [Memory-related errors | n8n Docs](https://docs.n8n.io/hosting/scaling/memory-errors/)
- [N8N Performance Optimization](https://www.wednesday.is/writing-articles/n8n-performance-optimization-maximizing-workflow-efficiency)
- [Performance and benchmarking | n8n Docs](https://docs.n8n.io/hosting/scaling/performance-benchmarking/)
- [Optimize n8n Performance for Large Data Loads](https://prosperasoft.com/blog/automation-tools/n8n/n8n-large-data-performance/)
- [Prevent n8n Execution Time Increases](https://flowgenius.in/why-n8n-execution-time-increases-over-time/)

---

## 10. Community Blog Workflow Examples

### Relevant Templates

| Template                                                                                                                                                      | Key Pattern                            | Relevance               |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- | ----------------------- |
| [SEO WordPress posts with AI & Google Sheets](https://n8n.io/workflows/3085-automate-seo-optimized-wordpress-posts-with-ai-and-google-sheets/)                | Keyword input -> AI content -> publish | Basic pipeline pattern  |
| [SEO content with Google SERP + Claude AI](https://n8n.io/workflows/7503-automate-seo-content-creation-with-google-serp-claude-ai-and-wordpress/)             | SERP research -> Claude generation     | Research-first approach |
| [Blog content with GPT-4 + Perplexity](https://n8n.io/workflows/3336-automate-blog-content-creation-with-gpt-4-perplexity-and-wordpress/)                     | Perplexity research -> GPT writing     | Dual-model pattern      |
| [AI-powered blog automation (Content Farming)](https://n8n.io/workflows/5230-content-farming-ai-powered-blog-automation-for-wordpress/)                       | 10 posts/day automated                 | Scale pattern           |
| [WordPress blog automation with images](https://n8n.io/workflows/11135-wordpress-blog-automation-ai-seo-content-images-scheduling-and-email-alerts/)          | Full pipeline with images + scheduling | End-to-end reference    |
| [Blog creation in brand voice](https://n8n.io/workflows/2648-automate-blog-creation-in-brand-voice-with-ai/)                                                  | Brand voice integration                | Voice consistency       |
| [Multi-agent SEO blog writing for E-Commerce](https://n8n.io/workflows/8654-multi-agent-seo-optimized-blog-writing-system-with-hyperlinks-for-e-commmerce/)   | Multiple AI agents                     | Agent orchestration     |
| [SEO WordPress content with Perplexity research](https://n8n.io/workflows/3291-generate-seo-optimized-wordpress-content-with-ai-powered-perplexity-research/) | Perplexity -> content generation       | Research integration    |

### What Works Well

1. **Research-first approach**: Using Perplexity/SERP for research BEFORE content generation produces more accurate, factual content
2. **Structured section generation**: Breaking blog into outline -> sections -> assembly yields better quality than single-prompt generation
3. **Brand voice injection**: Passing brand voice guidelines in system prompts ensures consistency
4. **Image generation integration**: Automated featured images + section images significantly increase engagement
5. **Scheduling and queuing**: Spreading generation across time prevents API rate limits and allows human review
6. **Google Sheets/Airtable as queue**: Simple keyword queues with status tracking work well for content pipelines

### What to Avoid

1. **Single massive prompt**: Generating an entire 3000+ word blog in one API call produces lower quality and higher failure rates
2. **No error handling**: API failures without retry logic cause entire pipelines to fail silently
3. **Hardcoded prompts**: Use dynamic prompt templates that incorporate research data and brand voice
4. **Ignoring rate limits**: Parallel API calls without rate limiting will get you throttled
5. **No human review step**: Fully automated publish-without-review leads to quality issues
6. **Storing full content in n8n items**: Large text payloads between nodes cause memory issues at scale

### Sources

- [awesome-n8n-templates (280+ templates)](https://github.com/enescingoz/awesome-n8n-templates)
- All template links in the table above

---

## Summary: Recommended Architecture for Blog Generation Orchestrator

Based on this research, here is the recommended implementation approach:

### Workflow Structure

```
[Main Orchestrator Workflow]
  1. Webhook Trigger (async response with jobId)
  2. Payload Validation (Code node)
  3. Update Supabase: status = "processing"
  4. Execute Sub-workflow: Research Pipeline (Perplexity Sonar Pro)
  5. Execute Sub-workflow: Content Strategy (Claude - outline generation)
  6. SplitInBatches (batch size 1): Section Generation Loop
     - Build context from previous sections
     - HTTP Request: Claude API (with tool_use for structured output)
     - Accumulate sections in static data
     - Loop back
  7. Code Node: Assemble final blog post
  8. Execute Sub-workflow: Image Generation (Replicate Flux)
  9. Upload images to Supabase Storage
  10. Upsert blog post to Supabase (with JSONB metadata)
  11. Update status = "completed"
```

### Key Technical Decisions

- **Claude API**: Use HTTP Request node directly (not built-in Anthropic node) for extended thinking and tool_use
- **Perplexity**: Use Sonar Pro with batched queries (3 at a time, 1s delay)
- **Loops**: SplitInBatches with batch size 1 + static data for context accumulation
- **Error handling**: Retry on fail (3x) on all API nodes + exponential backoff for rate limits + DLQ workflow
- **Supabase**: HTTP Request for bulk/JSONB operations, native node for simple CRUD
- **Images**: Replicate async prediction pattern (create -> poll -> download -> upload)
- **Webhook**: Async response pattern with jobId polling endpoint
- **Memory**: Sub-workflow isolation, store intermediate content in Supabase not n8n items
