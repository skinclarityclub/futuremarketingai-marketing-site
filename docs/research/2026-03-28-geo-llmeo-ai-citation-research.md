---
title: GEO/LLMEO Research — AI Citation Tracking & Optimization
tags: #geo #llmeo #ai-citations #seo #research
created: 2026-03-28
source: Firecrawl deep research (5 searches, 25 sources)
---

# GEO / LLMEO Research: How to Track and Improve AI Citations

## 1. What Is GEO / LLMEO?

**Generative Engine Optimization (GEO)** is the practice of structuring your content and digital presence so that AI-powered search platforms — ChatGPT, Google AI Overviews, Perplexity, Claude, Copilot — can retrieve, cite, and recommend your brand when answering user questions.

**Key difference from traditional SEO**: SEO = ranking among 10 blue links. GEO = being one of 2-7 domains an LLM typically cites in a single response. AI does not rank pages — it cites sources.

**Scale of the shift (2026 data)**:
- Gartner predicts 25% decline in traditional search volume by 2026
- Google AI Overviews reach 2+ billion monthly users
- ChatGPT serves 800 million users weekly
- 52% of US adults use AI chatbots for search
- 60% of searches now end without a click
- 15% of all website traffic now comes from AI agents/bots

**The "Reasoning Economy"**: Users no longer search for links — they ask AI to synthesize answers. The cognitive load shifts from user to model. Your content must be the source the model trusts and cites.

---

## 2. How to MEASURE AI Citations

### 2.1 Programmatic API Approaches

#### Perplexity API (BEST for citation tracking)
- **Endpoint**: Sonar models via `api.perplexity.ai` or OpenRouter
- **Key feature**: Returns `citations[]` array with every response — explicit URLs the model used
- **Models**: `sonar` (cheap), `sonar-pro` (best balance), `sonar-pro-search` (agentic multi-step)
- **Pricing**: Pay per request via Perplexity API or via OpenRouter ($5 minimum credits)
- **Multi-query**: Up to 5 queries per single request (reduces round trips)
- **Domain filtering**: Allowlist/denylist up to 20 domains per request
- **How to check**: Send query, parse `citations[]`, check if your domain appears
- **Docs**: https://docs.perplexity.ai/docs/search/quickstart

```javascript
// Example: Check if domain appears in Perplexity citations
const response = await fetch('https://api.perplexity.ai/chat/completions', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: 'sonar-pro',
    messages: [{ role: 'user', content: 'What are the best skincare routines for acne?' }]
  })
});
const data = await response.json();
const cited = data.citations?.some(url => url.includes('yourdomain.com'));
```

#### ChatGPT API (OpenAI)
- **Challenge**: Standard Chat Completions API does NOT do web search — uses training data only
- **With browsing**: ChatGPT web interface has browsing, but API access to search results is limited
- **Workaround**: Use the Responses API with web_search tool, or use the ChatGPT Search API (beta)
- **Alternative**: Scrape ChatGPT web responses via browser automation (Playwright/Puppeteer)
- **Note**: ChatGPT provides clickable links but brand mentions are often without direct URL citations

#### Google Gemini API
- **Challenge**: Gemini API does not expose which web sources were used in grounding
- **Google AI Overviews**: No API — must be tracked via SERP scraping tools
- **Workaround**: Use Google Custom Search API + Gemini for grounded responses

#### Claude API (Anthropic)
- **Challenge**: Claude API does not have built-in web search — no citations to track
- **With MCP tools**: Claude can use web search tools, but citation tracking varies
- **Workaround**: Track via Claude web interface scraping

**Bottom line**: Perplexity is the ONLY major AI platform with a clean, programmatic citation API. For others, you need browser automation or third-party tools.

### 2.2 Existing Tools and Services

#### Tier 1: Purpose-Built GEO Monitoring

| Tool | Coverage | Starting Price | Best For |
|---|---|---|---|
| **Otterly.AI** | ChatGPT, Perplexity, AI Overviews, AI Mode, Gemini, Copilot | $29/mo (Lite) | Budget-friendly, agencies, 20K+ users |
| **Peec AI** | ChatGPT, Perplexity, AI Overviews + add-ons | EUR 89/mo (Starter) | Marketing teams, clean dashboards |
| **Profound** | 10+ AI platforms, proprietary prompt volume data | ~$300/mo (Growth) | Enterprise, widest coverage |
| **Promptmonitor** | ChatGPT, Claude, Gemini, DeepSeek, Grok, Perplexity, AI Overview/Mode | $29/mo (Starter) | SMBs, multi-model tracking |
| **Akii** | Google AI, ChatGPT, Gemini, Copilot, Perplexity | $49/mo (Starter) | Visibility scoring + optimization |
| **LLMClicks.ai** | ChatGPT, Perplexity, Google AI, Copilot | Custom | Real-time continuous monitoring |
| **Frizerly** | ChatGPT, Perplexity, Claude, Gemini, Grok | Custom | Auto-publish + track combo |

#### Tier 2: Traditional SEO Tools Adding AI Features

| Tool | AI Feature | Price for AI Features |
|---|---|---|
| **Ahrefs Brand Radar** | 150M+ query database, instant analysis | Add-on up to $699/mo for all platforms |
| **SE Ranking** | 6 AI platform trackers in Pro plan | Included in Pro plan, accessible pricing |
| **Semrush** | Content optimization tool for AI search (new) | Part of existing subscription |
| **BrightEdge** | AI Catalyst tracking | Enterprise-only pricing |
| **Conductor** | Unified AEO and SEO (Forrester Wave Leader) | No public pricing |

#### Tier 3: Full-Stack (Monitor + Execute)

| Tool | Unique Value | Price |
|---|---|---|
| **AirOps** | Citation tracking to content execution pipeline, CMS publishing | Custom |
| **Scrunch AI** | SOC 2 compliance, deep prompt segmentation | Enterprise |

#### Open Source / DIY

| Tool | What It Does |
|---|---|
| **Apify: Perplexity Brand Monitor** | Apify actor that runs prompts through Perplexity, tracks brand mentions. Pay-per-use via Apify platform |
| **Perplexity search_evals** | Open-source evaluation framework on GitHub (github.com/perplexityai/search_evals) |
| **Custom n8n workflow** | Build your own: query Perplexity API weekly, parse citations, store in Supabase, alert on changes |

### 2.3 Cheapest Way to Monitor

**Budget Option A — Otterly.AI Lite ($29/mo)**:
- 6 platforms, prompt-based monitoring
- Good starting point for baseline visibility

**Budget Option B — DIY with Perplexity API (~$10-30/mo)**:
- Query Perplexity Sonar API with 50-100 relevant prompts weekly
- Parse `citations[]` for your domain
- Store results in Supabase
- Compare week-over-week
- Cost: ~$0.005-0.01 per query (Sonar) = $1-4/month for 100 queries/week

**Budget Option C — Apify Perplexity Brand Monitor (pay-per-use)**:
- Pre-built actor, runs on Apify infrastructure
- No code needed, just configure brands + prompts

---

## 3. How to IMPROVE AI Citations

### 3.1 Content Qualities That Get Cited (Semrush Study, Jan 2026)

Based on analysis of thousands of AI citations vs. non-cited pages:

| Quality | Correlation with Citation | Action |
|---|---|---|
| **Clarity & summarization** | +32.83% | Lead with clear answers, add TL;DR blocks (40-60 words) |
| **E-E-A-T signals** | +30.64% | Author bios, credentials, expert quotes, real experience |
| **Q&A format** | +25.45% | Structure content as question-answer pairs |
| **Section structure** | +22.91% | Clean H2/H3 hierarchy, semantic headings |
| **Structured data elements** | +21.60% | Schema markup (FAQ, HowTo, Article, Organization) |
| **Non-promotional tone** | -26.19% | Informational > commercial (editorial outperforms sales pages) |

### 3.2 The "Ski Ramp" Attention Effect

Research shows **44.2% of AI citations come from the first 30% of a document**. LLMs have position bias — they give more weight to information that appears earlier.

**Action**: Put the main answer at the TOP. Use inverted pyramid style (journalism). Definitions, key facts, and direct answers first — context and nuance later.

### 3.3 Content Structure for AI Citation

1. **Bottom Line Up Front (BLUF)**: Start every page/section with the direct answer
2. **Answer Blocks**: 40-60 word self-contained answer paragraphs that can be quoted without context
3. **Question-Based Headings**: H2s that match how users phrase prompts
4. **Entity-Rich Content**: Name specific brands, people, products, places — LLMs anchor on entities
5. **Original Data**: Proprietary research, benchmarks, surveys get cited 3-5x more
6. **Chunked Sections**: Each H2 section should stand alone as a quotable reference
7. **Comparison Tables**: AI loves structured comparisons (vs. pages, feature tables)
8. **FAQ Sections**: Direct Q&A pairs are the easiest format for AI to extract

### 3.4 Schema Markup That Matters

- `Article` schema with `author`, `datePublished`, `dateModified`
- `FAQPage` schema for Q&A content
- `HowTo` schema for instructional content
- `Organization` schema (brand entity)
- `Person` schema for author/expert pages
- `BreadcrumbList` for site structure signals
- `Product` + `Review` schema for e-commerce

### 3.5 E-E-A-T Signals for AI

- **Experience**: First-person accounts, case studies, "we tested this"
- **Expertise**: Author bios with credentials, linked profiles
- **Authority**: Backlinks, brand mentions across web, Wikipedia presence
- **Trust**: Clear sources, citations to studies, transparent methodology

**Critical stat**: Sites with 32,000+ referring domains are 3.5x more likely to be cited by ChatGPT than lower-authority sites (SE Ranking study).

### 3.6 Technical Foundations

**Allow AI crawlers in robots.txt**:
```
User-agent: GPTBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: OAI-Searchbot
Allow: /

User-agent: Google-Extended
Allow: /
```

**Add llms.txt file** (emerging standard): Machine-readable guide for AI systems on how to interpret your site.

**Server-side rendering**: AI crawlers do NOT execute JavaScript. If your content is client-side rendered (React SPA), AI crawlers see a blank page. Use SSR/SSG.

**CDN allowlisting**: Ensure Cloudflare/CDN rules do not block AI crawler user-agents.

**73% of sites have technical barriers blocking AI crawler access** (Otterly.AI study, 2026).

---

## 4. GEO Strategies by AI Engine

### 4.1 Perplexity (Bing + own index)
- **Citation style**: Numbered inline citations with clickable URLs — most transparent
- **Favors**: Reddit (16.9%), Wikipedia, LinkedIn, Forbes
- **Best approach**: Create reference-grade, quotable content with clear sources
- **Key**: Being in Bing's index is important (submit sitemap to Bing Webmaster Tools)
- **Community content**: 16.9% of Perplexity citations come from forums/Reddit

### 4.2 ChatGPT (Bing search via browsing)
- **Citation style**: Mentions brands frequently, but weak link citations
- **Favors**: Reddit (#1 cited), Wikipedia, Amazon, Forbes
- **Challenge**: Creates awareness without conversion — mentions your brand but may not link
- **Best approach**: Brand entity optimization, Wikipedia presence, Reddit participation
- **Stat**: 56% of AI search referral traffic comes from ChatGPT

### 4.3 Google AI Overviews / AI Mode (Google Search)
- **Citation style**: Strongest brand preference (59.8% of citations), most clickable links
- **Favors**: YouTube, Wikipedia, Forbes, Quora, your own domain (if authoritative)
- **Best approach**: Traditional SEO still matters most here — domain authority, backlinks
- **Key**: Only appears ~33% of the time — still a growing feature
- **Stat**: 18% of AI referral traffic comes from Gemini

### 4.4 Claude (web search tools)
- **Citation style**: Cites when using web search tools, otherwise uses training data
- **Best approach**: Focus on being in training data (published before knowledge cutoff) AND in web search results
- **Key crawlers**: `ClaudeBot`, `Claude-Searchbot`, `Claude-User`

### 4.5 Microsoft Copilot (Bing search)
- **Similar to ChatGPT** in behavior since both use Bing
- **Best approach**: Bing optimization, authoritative content

### 4.6 Universal: What ALL AI engines favor
- Reddit threads (authentic discussions)
- Wikipedia
- Forbes, major news sites
- Community/forum content with diverse perspectives
- Editorial > commercial content
- Frequently updated content with timestamps
- Original research and proprietary data

---

## 5. Top Domains Cited by AI (Otterly.AI Study, 1M+ citations)

| ChatGPT | Google AI Overviews | Perplexity |
|---|---|---|
| Reddit.com (#1) | YouTube.com | Reddit.com (#1) |
| Wikipedia.org | Wikipedia.org | Wikipedia.org |
| Amazon.com | Forbes.com | LinkedIn.com |
| Forbes.com | Quora.com | Forbes.com |

**Community platforms capture 52.5% of all AI citations** vs. 47.5% for brand domains.

---

## 6. Automated Agent Implementation Plan

### Architecture: Weekly AI Citation Tracker

```
n8n Cron (weekly)
    |
    v
Query Generator
    - 50-100 prompts per client based on their topics
    - "best [topic]", "[brand] vs [competitor]", "how to [pain point]"
    |
    v
Perplexity Sonar API (primary - has citations)
    - Send each prompt
    - Collect response + citations[] array
    |
    v
Citation Parser
    - Check if client domain appears in citations
    - Check if competitor domains appear
    - Extract position (1st cited, 2nd, 3rd...)
    - Extract context (what was said about the brand)
    |
    v
Supabase Storage
    - Table: fma_geo_tracking
    - Columns: query, platform, cited (bool), position,
      competitors_cited, citation_url, response_snippet,
      tracked_at
    |
    v
Weekly Report Generator
    - Citation rate: X% of queries cite client
    - Share of voice: client vs competitors
    - New citations gained/lost
    - Top-performing content (most cited URLs)
    - Gap analysis: queries where competitors cited but client not
    |
    v
Dashboard + Email Alert
    - Trend charts in FMA dashboard
    - Weekly email digest to client
```

### Estimated Costs

| Component | Monthly Cost |
|---|---|
| Perplexity API (100 queries/week, Sonar) | $2-4 |
| Perplexity API (100 queries/week, Sonar-Pro) | $15-25 |
| n8n workflow (self-hosted) | $0 (already running) |
| Supabase storage | $0 (already have) |
| **Total DIY** | **$2-25/month per client** |

Compare to Otterly.AI at $29/mo minimum, or Profound at $300/mo.

### Optional: Multi-Platform Tracking

For ChatGPT/Gemini (which lack citation APIs), add browser automation:

```
Playwright on Hetzner VPS
    - Open ChatGPT web, ask query, scrape response
    - Open Gemini web, ask query, scrape response
    - Parse for brand mentions (not citations — these dont provide clean URLs)
    - Store in same tracking table
```

This adds complexity but gives coverage across all platforms. Cost: minimal (runs on existing Hetzner VPS).

### Actionable Recommendations Engine

Based on tracking data, auto-generate recommendations:

1. **"Create Content" alerts**: When competitor is cited but client has no content on the topic
2. **"Refresh Content" alerts**: When client content exists but is not being cited (stale, poorly structured)
3. **"Fix Technical" alerts**: When AI crawlers are blocked (check robots.txt, CDN rules)
4. **"Build Authority" alerts**: When client needs more backlinks/mentions for a topic area
5. **"Add Schema" alerts**: When cited pages lack structured data markup

---

## 7. Quick-Start Implementation Recommendations

### Phase 1: Baseline Audit (Week 1)
1. Check robots.txt — ensure AI crawlers are not blocked
2. Run 20 key queries through Perplexity manually, note citations
3. Sign up for Otterly.AI free trial OR build Perplexity API tracker
4. Document current citation rate as baseline

### Phase 2: Content Optimization (Weeks 2-4)
1. Add TL;DR / answer blocks to top 20 pages
2. Implement FAQ, Article, Organization schema markup
3. Add author bios with credentials to all content
4. Restructure key pages: answer-first, clean headings, quotable paragraphs
5. Add "Last updated" timestamps to all content
6. Create comparison/vs content for competitive queries

### Phase 3: Automated Monitoring (Week 3+)
1. Build n8n workflow: weekly Perplexity API queries
2. Store results in Supabase
3. Add citation tracking card to FMA dashboard
4. Set up weekly email digest with citation changes

### Phase 4: Authority Building (Ongoing)
1. Digital PR for brand mentions on news sites
2. Reddit participation in relevant subreddits
3. Wikipedia presence (if notable enough)
4. Guest posts on high-authority industry sites
5. Original research/data publication

---

## Sources

- Search Engine Land: "Mastering GEO in 2026: Full Guide" (Feb 2026)
  https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142
- Otterly.AI: "The AI Citation Economy: 1M+ Data Points" (2026)
  https://otterly.ai/blog/the-ai-citations-report-2026/
- AirOps: "Best AI Citation Tracking Tools" (Mar 2026)
  https://www.airops.com/blog/ai-citation-tracking-tools
- Semrush: "How We Built a Content Optimization Tool for AI Search" (Jan 2026)
  https://www.semrush.com/blog/content-optimization-ai-search-study/
- Yotpo: "12 Tips for ChatGPT SEO & GEO 2026" (Mar 2026)
  https://www.yotpo.com/blog/chatgpt-seo-geo-tips/
- JCT Growth: "How to Structure Content for LLMs" (Mar 2026)
  https://jctgrowth.com/how-to-structure-content-for-llms/
- ALM Corp: "12 Data-Backed Strategies for LLM Visibility" (Jan 2026)
  https://almcorp.com/blog/ai-search-optimization-guide-llm-visibility-strategies/
- Averi AI: "LLM-Optimized Content Guide" (2025)
  https://www.averi.ai/breakdowns/the-definitive-guide-to-llm-optimized-content
- OptimizeGEO: "Step-by-Step Guide to GEO 2026"
  https://www.optimizegeo.ai/blog/step-by-step-guide-to-geo-2026
- TheRankMasters: "Best AI Visibility Tools with Citation Tracking" (Feb 2026)
  https://www.therankmasters.com/insights/ai-visibility/best-ai-visibility-tools-citation-tracking
- Perplexity API Docs: Search API Quickstart
  https://docs.perplexity.ai/docs/search/quickstart
- LLMClicks.ai: AI Visibility Tracker
  https://llmclicks.ai/ai-visibility-tracker/
- Apify: Perplexity AI Brand Monitor
  https://apify.com/samstorm/perplexity-brand-monitor/api
