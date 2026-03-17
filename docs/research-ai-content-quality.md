# Research: Generating Expert-Quality AI Blog Content (2025-2026)

> Research compiled March 2026 for FMai content automation pipeline
> Focus: SkinClarity Club Dutch-language skincare/acne blog content

---

## Table of Contents

1. [State of AI Content Generation Models](#1-state-of-ai-content-generation-models-2025-2026)
2. [Prompt Engineering for Blog Posts](#2-prompt-engineering-for-blog-posts)
3. [RAG for Blog Content Generation](#3-rag-retrieval-augmented-generation-for-blogs)
4. [Human-in-the-Loop Patterns](#4-human-in-the-loop-patterns)
5. [Citation and Source Verification](#5-citation-and-source-verification)
6. [Content Uniqueness and Plagiarism](#6-content-uniqueness-and-plagiarism)
7. [Voice Consistency Across Posts](#7-voice-consistency-across-posts)
8. [Multi-Language / Dutch Content Generation](#8-multi-language--dutch-content-generation)
9. [SEO and GEO Optimization](#9-seo-and-geo-optimization)
10. [Recommended Architecture for FMai](#10-recommended-architecture-for-fmai)

---

## 1. State of AI Content Generation Models (2025-2026)

### Model Landscape

The frontier models for long-form content in early 2026 are:

| Model                | Strengths for Content                                                                               | Best For                                                             |
| -------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Claude Opus 4.6**  | Style control, emotional pacing, "show don't tell", vivid sensory writing, minimal rewrites needed  | Creative/narrative content, brand voice matching, warm personal tone |
| **GPT-5.2 / 5.4**    | Polished structure, SEO structure in single draft, narrative consistency, breadth                   | Structured blog posts, SEO-focused content, whitepapers              |
| **Kimi K2 0905**     | Logical coherence across ultra-long documents, academic formatting, real-time citation verification | Academic/research-heavy content, medical citations                   |
| **Gemini 2.5 / 3.1** | Multimodal integration, Google ecosystem                                                            | Content with image analysis, Google-integrated workflows             |

### Key Findings

- **Claude Opus 4.6 leads GPT-5.4 by a 40-point ELO gap** on Chatbot Arena for style control, multi-turn dialogue, and creative writing. Output reads like it was written by an experienced editor.
- **GPT-5.2/5.4** excels at producing polished, SEO-structured drafts in a single pass with minimal editing.
- For **skincare/health content specifically**, Claude's ability to write with warmth, empathy, and nuance while maintaining accuracy makes it the strongest choice for Sindy's voice.
- **Recommendation for SKC**: Use Claude Opus 4.6 as the primary content generation model, with potential GPT-5 fallback for SEO structure analysis.

### Sources

- [Best AI Model for Blogging 2026 - eesel.ai](https://www.eesel.ai/blog/what-is-the-best-ai-model-for-blogging)
- [Best LLM for Writing - noviai.ai](https://www.noviai.ai/models-prompts/best-llm-for-writing/)
- [GPT-5.4 vs Claude Opus 4.6 Comparison](https://help.apiyi.com/en/gpt-5-4-vs-claude-opus-4-6-comparison-2026-en.html)
- [Tom's Guide: ChatGPT-5.2 vs Claude 4.6 Opus](https://www.tomsguide.com/ai/i-tested-chatgpt-5-2-vs-claude-4-6-opus-in-9-tough-challenges-heres-the-winner)
- [Best AI Writing Generators 2026 - Zapier](https://zapier.com/blog/best-ai-writing-generator/)

---

## 2. Prompt Engineering for Blog Posts

### Multi-Step Prompting Pipeline (Recommended)

The highest quality AI content comes from **prompt chaining** rather than single-shot generation. Each step feeds into the next:

```
Step 1: Topic Research & Outline Generation
Step 2: Section-by-Section Drafting (with voice examples)
Step 3: SEO Optimization Pass
Step 4: Voice/Tone Alignment Pass
Step 5: Fact-Check & Citation Pass
Step 6: Final Polish & Formatting
```

### Chain-of-Thought for Content

Chain-of-thought (CoT) prompting guides the model through intermediate reasoning steps. For blog content, this means asking the model to:

1. First analyze the target audience's knowledge level and pain points
2. Then outline the logical flow of arguments
3. Then draft each section with awareness of what came before
4. Then self-review for coherence and completeness

### Persona-Based Writing

The most effective technique for expert-quality content:

- **System prompt**: Define the persona with personality traits, expertise areas, communication style
- **Few-shot examples**: Include 2-3 excerpts from existing Sindy content as voice anchors
- **Negative examples**: Explicitly list phrases/patterns to avoid ("corporate speak", "in conclusion", etc.)
- **Audience context**: Describe the reader (vrouwen 18-35 met acne, gestresst, zoekend naar holistische oplossingen)

### Universal Prompt Architecture

```
SYSTEM: Persona + voice rules + guardrails
CONTEXT: Retrieved brand docs + product info + scientific sources (RAG)
TASK: Specific deliverable with format constraints
EXAMPLES: 1-3 few-shot writing samples for style anchoring
```

### Key Techniques

| Technique          | When to Use                | Impact                                |
| ------------------ | -------------------------- | ------------------------------------- |
| Few-shot examples  | Always (2-3 samples)       | High - anchors voice and style        |
| Chain-of-thought   | Complex/educational topics | Medium - improves logical flow        |
| Prompt chaining    | Long-form (>1500 words)    | High - maintains quality throughout   |
| Negative prompting | Voice consistency          | Medium - prevents generic AI patterns |
| Format constraints | Always                     | Medium - ensures consistent structure |

### Sources

- [Prompt Engineering Guide - CoT](https://www.promptingguide.ai/techniques/cot)
- [Lakera Prompt Engineering Guide 2026](https://www.lakera.ai/blog/prompt-engineering-guide)
- [Prompt Engineering Best Practices 2025](https://garrettlanders.com/prompt-engineering-guide-2025/)
- [K2view Prompt Engineering Techniques 2026](https://www.k2view.com/blog/prompt-engineering-techniques/)

---

## 3. RAG (Retrieval Augmented Generation) for Blogs

### Why RAG for Blog Content

RAG grounds generated content in real data, solving three critical problems:

1. **Hallucination reduction** - anchors claims to verifiable sources
2. **Brand consistency** - feeds in existing content as style reference
3. **Factual accuracy** - provides scientific citations for health claims

### RAG Architecture for Content Generation

```
Knowledge Sources:
├── Brand Voice Documents (tone, style, vocabulary)
├── Existing Blog Posts (voice examples, topic coverage)
├── Product Information (SKC webshop products, ingredients)
├── Scientific Literature (PubMed abstracts on skincare/acne)
├── Sindy Kennisbank (chatbot knowledge base)
└── Competitor Analysis (topic gaps, unique angles)

Pipeline:
1. Ingest -> Chunk -> Embed -> Vector Store
2. Query: topic + audience -> Retrieve relevant chunks
3. Augment prompt with retrieved context
4. Generate with full context awareness
```

### Chunking Strategy for Content

- **Brand voice docs**: Keep whole (they're short, need full context)
- **Existing blog posts**: Chunk by section/paragraph (500-800 tokens)
- **Scientific papers**: Chunk by abstract + key findings (focused retrieval)
- **Product info**: Chunk by product (ingredient lists, benefits, usage)

### n8n RAG Implementation

n8n provides native RAG pipeline components:

- **Document Loader node** for ingesting content from various sources
- **Split Out node** for text chunking
- **Vector Store node** (Pinecone, Supabase pgvector) for embedding storage
- **Question and Answer Chain node** for retrieval and generation
- Pre-built template: "Automate blog creation in brand voice with AI"

### Best Practices

- Use **semantic search** (not keyword) for retrieving voice examples
- Include **3-5 most similar existing posts** as context for each new generation
- For health claims, always retrieve from **vetted scientific sources** first
- Keep **product information current** - sync from Shopify regularly
- Use **hybrid retrieval** (semantic + keyword) for scientific citations

### Sources

- [Eden AI: 2025 Guide to RAG](https://www.edenai.co/post/the-2025-guide-to-retrieval-augmented-generation-rag)
- [Pinecone: RAG Guide](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [n8n: Build Custom RAG Systems](https://n8n.io/rag/)
- [n8n: Blog Creation in Brand Voice Template](https://n8n.io/workflows/2648-automate-blog-creation-in-brand-voice-with-ai/)
- [ACL Anthology: Enhancing RAG Best Practices](https://aclanthology.org/2025.coling-main.449.pdf)

---

## 4. Human-in-the-Loop Patterns

### Where Humans Add Most Value

Not every step needs human review. Place approval gates at **irreversible decision points**:

```
Phase 1: Topic Selection          -> AUTO (from content calendar)
Phase 2: Outline Generation       -> HUMAN REVIEW (Telegram approval)
Phase 3: Section Drafting          -> AUTO (Claude generates)
Phase 4: Full Draft Assembly       -> HUMAN REVIEW (Telegram with edit option)
Phase 5: SEO Optimization          -> AUTO (metadata, schema)
Phase 6: Fact-Check Verification   -> AUTO + HUMAN FLAG (flag uncertain claims)
Phase 7: Final Publish             -> HUMAN APPROVAL (one-click publish)
```

### Telegram Approval Flow (n8n)

The recommended pattern for SKC:

1. **n8n generates content** using Claude via AI nodes
2. **Wait node** pauses the workflow
3. **Telegram Bot sends** formatted preview with inline buttons:
   - "Goedkeuren" (Approve) -> proceed to publish
   - "Aanpassen" (Revise) -> send back with feedback
   - "Afwijzen" (Reject) -> discard and log reason
4. **Webhook receives** the response and continues workflow

Available n8n templates:

- "Create X Posts with Gemini & GPT-4.1 AI and Telegram Human-in-the-Loop Approval"
- "Create secure human-in-the-loop approval flows with Postgres and Telegram"
- "AI-powered content factory: RSS to blog, Instagram & TikTok with Slack approval"

### Best Practices

- **Don't over-approve**: Too many checkpoints slow the pipeline and cause approval fatigue
- **Route to tools people already use**: Telegram for solo operators, Slack for teams
- **Include context in approval messages**: Show the outline/draft inline, not just a link
- **Track approval metrics**: Time to approve, revision rate, rejection reasons
- **Batch approvals**: Group multiple posts for weekly review rather than one-by-one

### Sources

- [n8n: Human-in-the-Loop for AI Tool Calls](https://docs.n8n.io/advanced-ai/human-in-the-loop-tools/)
- [n8n Blog: Human in the Loop Automation](https://blog.n8n.io/human-in-the-loop-automation/)
- [n8n: Production AI Playbook - Human Oversight](https://blog.n8n.io/production-ai-playbook-human-oversight/)
- [n8n: Telegram Approval Workflow Template](https://n8n.io/workflows/5625-create-x-posts-with-gemini-and-gpt-41-ai-and-telegram-human-in-the-loop-approval/)

---

## 5. Citation and Source Verification

### The Problem

Between **50% and 90%** of LLM-cited sources are not fully supported or are contradicted by the actual sources. For health/skincare content, this is unacceptable.

### Automated Verification Pipeline

```
Step 1: Generate content with citation placeholders
Step 2: Extract health claims from generated text
Step 3: For each claim:
   a. Search PubMed API (NCBI E-utilities) for supporting evidence
   b. Retrieve abstract + DOI
   c. Verify claim against abstract using LLM judge
   d. Flag unsupported claims for human review
Step 4: Format citations (APA or inline with DOI links)
Step 5: Generate bibliography / bronnenlijst
```

### Tools and APIs

| Tool                              | Purpose                                                   | Integration                                      |
| --------------------------------- | --------------------------------------------------------- | ------------------------------------------------ |
| **NCBI E-utilities / PubMed API** | Search biomedical literature, retrieve abstracts          | Free REST API, n8n HTTP node                     |
| **PubMed.ai**                     | AI-enhanced medical literature search                     | Web interface + API                              |
| **PubTator 3.0**                  | Entity recognition in biomedical text, citation anchoring | API - reduces GPT-4 hallucinations significantly |
| **SourceCheckup**                 | Agent-based pipeline to evaluate source relevance/support | Research framework                               |
| **Semantic Scholar API**          | Academic paper search with citation graphs                | Free API                                         |
| **CrossRef API**                  | DOI resolution and metadata lookup                        | Free REST API                                    |

### For Skincare Content Specifically

- Query PubMed with structured searches: `("acne vulgaris"[MeSH] AND "treatment"[MeSH])`
- Focus on systematic reviews and meta-analyses for strongest evidence
- Include Dutch dermatology guidelines (NHG-Standaarden) as authoritative sources
- For ingredient claims, reference the CIR (Cosmetic Ingredient Review) database
- Always cite study type (RCT, meta-analysis, case study) for transparency

### Citation Format for Blog Posts

For a warm, accessible blog tone, avoid academic-style inline citations. Instead:

- Use "Uit onderzoek blijkt dat..." (Research shows that...) with a linked source
- Add a "Bronnen" (Sources) section at the bottom of each post
- Link to DOI URLs for verifiability
- Include year and journal for credibility

### Sources

- [Nature: Automated Framework for Assessing LLM Citations](https://www.nature.com/articles/s41467-025-58551-6)
- [JMIR: RAG-Enhanced LLM for Fact-Checking](https://www.jmir.org/2025/1/e66098/)
- [PubMed.ai](https://www.pubmed.ai/blog/best-free-search-engine-for-clinicians)
- [PubTator 3.0](https://academic.oup.com/nar/article/52/W1/W540/7640526)

---

## 6. Content Uniqueness and Plagiarism

### Detection Tools

| Tool               | Capabilities                                                                                                            | Best For                                             |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------- |
| **Originality.ai** | AI detection + plagiarism scanning simultaneously, highest accuracy for GPT-4 content, Chrome extension for Google Docs | Production pipeline - scan every post before publish |
| **Copyscape**      | Traditional plagiarism checking against web content                                                                     | Cross-checking against published articles            |
| **GPTZero**        | AI detection with sentence-level highlighting                                                                           | Understanding which passages read as AI              |
| **Copyleaks**      | AI detection for ChatGPT, Claude, Gemini                                                                                | Multi-model detection                                |

### Techniques for Maximizing Originality

1. **Inject personal anecdotes**: Include Sindy's real experiences, client stories (geanonimiseerd), and personal opinions
2. **Use proprietary data**: Reference SKC community statistics, product results, internal expertise
3. **Unique angles**: Don't write "Wat is acne?" - write "Waarom je acne niet je vijand is: een holistische kijk"
4. **Original frameworks**: Create branded methodologies (e.g., "De SkinClarity 5-Stappen Methode")
5. **Reader interaction**: Include interactive elements, self-assessment questions, journaling prompts
6. **Cultural specificity**: Reference Dutch skincare culture, Dutch climate effects on skin, Dutch healthcare system

### Embedding-Based Similarity Checking

Before publishing, compare new content against your existing corpus:

- Embed new post with the same model used for your vector store
- Calculate cosine similarity against all existing posts
- Flag if similarity > 0.85 (too close to existing content)
- This prevents self-plagiarism across 50+ posts

### AI Detection Avoidance (Ethical Approach)

The goal is not to "fool" detectors but to produce genuinely good content:

- Vary sentence length and structure (AI tends toward uniform patterns)
- Include specific numbers, dates, and details (AI tends to be vague)
- Add subjective opinions and emotional reactions (AI hedges everything)
- Reference recent events, seasonal topics, current trends
- Use colloquial Dutch expressions naturally

### Sources

- [Originality.ai](https://originality.ai/)
- [Originality.ai: Top 5 Tools to Identify AI and Plagiarism 2026](https://originality.ai/blog/identify-ai-plagiarism-top-tools)
- [Search Engine Land: How to Detect AI Content](https://searchengineland.com/guide/detect-ai-content-prevent-plagiarism)
- [AI Detection Trends 2025 - Wellows](https://wellows.com/blog/ai-detection-trends/)

---

## 7. Voice Consistency Across Posts

### The Challenge

Maintaining Sindy Kienstra's warm, personal, expert-but-accessible voice across 50+ AI-generated posts requires systematic voice encoding.

### Voice Profile Document Structure

Create a comprehensive voice profile that gets included in every generation prompt:

```markdown
## Sindy's Voice Profile

### Core Traits (3-5 adjectives with examples)

- Warm: "Ik snap hoe frustrerend het is als je huid niet meewerkt"
- Deskundig: Uses scientific terms but always explains them
- Persoonlijk: Shares own experiences, uses "ik" and "jij"
- Bemoedigend: "Je bent niet alleen hierin"
- Nuchter: No hype, no miracle cures, realistic expectations

### Vocabulary Rules

USE: jij/je (not u), "je huid", "holistische aanpak", "van binnenuit"
NEVER: "in dit artikel", "concluderend", "het is belangrijk om op te merken"
AVOID: Medical jargon without explanation, sales-y language, fear tactics

### Sentence Patterns

- Opens with empathy or personal observation
- Mixes short punchy sentences with longer explanatory ones
- Asks rhetorical questions to engage reader
- Ends sections with actionable takeaways

### Content Philosophy

- Acne is not just skin-deep; address root causes
- No shame, no blame, no "quick fix" promises
- Balance science with practical, daily-life advice
- Always acknowledge emotional impact of skin issues
```

### Implementation Strategies

1. **System prompt embedding**: Include the full voice profile in every system prompt
2. **Few-shot anchoring**: Rotate 2-3 different Sindy blog excerpts (from her best posts) as examples with each generation
3. **Voice scoring**: After generation, use a separate LLM call to score voice alignment (0-10) against the voice profile
4. **A/B rotation**: Maintain a library of 10-20 voice example excerpts, randomly select 2-3 per generation to prevent overfitting to specific phrases
5. **Periodic recalibration**: Every 10 posts, compare AI output against Sindy's actual writing and update the voice profile

### Brand Voice as RAG Context

Store the voice profile and example content in your vector store:

- When generating, retrieve the most **topically similar** existing posts as voice examples
- This ensures voice consistency AND topical continuity
- A post about "stress en acne" should retrieve Sindy's existing stress-related content as voice anchor

### Measuring Voice Consistency

Create a voice scorecard evaluated by LLM after each generation:

- Warmth/empathy (1-10)
- Expertise demonstration (1-10)
- Personal touch / "Sindy-ness" (1-10)
- Readability / accessibility (1-10)
- Dutch naturalness (1-10)
- Overall voice match (1-10)

Reject and regenerate any post scoring below 7 average.

### Sources

- [Oxford College of Marketing: AI Brand Voice Guidelines](https://blog.oxfordcollegeofmarketing.com/2025/08/04/ai-brand-voice-guidelines-keep-your-content-on-brand-at-scale/)
- [Typeface: Using AI for Consistent Brand Voice](https://www.typeface.ai/blog/using-ai-for-consistent-brand-voice)
- [AirOps: How to Maintain Brand Voice with AI Content](https://www.airops.com/blog/maintain-brand-voice-ai-content)
- [Optimizely: Using AI for Brand Voice](https://www.optimizely.com/insights/blog/using-ai-for-brand-voice/)
- [Medium: Maintaining Brand Voice with Generative AI](https://medium.com/@ffxcontent/maintaining-brand-voice-with-generative-ai-cca9273d4081)

---

## 8. Multi-Language / Dutch Content Generation

### Native Dutch Generation vs Translation

**Strong recommendation: Generate natively in Dutch, do NOT translate from English.**

Reasons:

- Translation produces unnatural phrasing, anglicisms, and incorrect register
- Dutch-generated content captures idiomatic expressions and cultural context
- LLMs trained to generate in Dutch produce better word order, morphosyntax, and plural markers
- SEO keywords must be natively Dutch (search volume differs between translated and natural terms)

### Known Pitfalls with Dutch AI Content

| Problem              | Example                               | Solution                                                   |
| -------------------- | ------------------------------------- | ---------------------------------------------------------- |
| Anglicisms           | "het is belangrijk" (overused calque) | Prompt: "Vermijd anglicismen" + provide Dutch alternatives |
| Formal register      | Using "u" instead of "jij"            | Explicit register instruction in system prompt             |
| Unnatural word order | English SVO patterns in Dutch         | Few-shot examples with correct Dutch syntax                |
| Non-existent words   | Hallucinated compound words           | Post-generation Dutch spell check                          |
| Generic phrasing     | "In de huidige tijd"                  | Negative example list of banned phrases                    |

### Model Capabilities for Dutch

- **Claude Opus 4.6**: Scores above 80% on multilingual MMLU in Dutch. Strong natural Dutch output when prompted correctly. Best with explicit instruction: "Schrijf als een native Nederlandse spreker in informele, warme toon."
- **GPT-5.x**: Strong Dutch capabilities, good at maintaining register
- **GPT-NL**: Dutch-specific model initiative, relevant for future consideration
- **Fietje**: Open-source Dutch LLM, good for specialized tasks but not frontier-quality for long-form

### Best Practices for Dutch Content Generation

1. **Always specify language explicitly**: "Schrijf in het Nederlands" in system prompt
2. **Provide Dutch examples**: Few-shot examples must be in Dutch (not translated)
3. **Request idiomatic speech**: Prompt to write "als een native spreker" (as a native speaker)
4. **Use Dutch cultural references**: Mention Dutch skincare brands, KNMG guidelines, Thuisarts.nl
5. **Dutch SEO keywords**: Research with Dutch keyword tools (Google Keyword Planner NL, Ahrefs NL)
6. **Post-generation quality check**: Run through Dutch language checker (e.g., LanguageTool NL)
7. **Native speaker review**: Final human review by a native Dutch speaker

### Dutch-Specific Voice Elements for Sindy

- Use "jij/je" consistently (informal register)
- Dutch skincare terminology: "huidverzorging", "onzuiverheden", "talgproductie"
- Cultural context: Dutch directness, pragmatism, no-nonsense approach
- Reference Dutch healthcare: huisarts, dermatoloog, apotheek
- Seasonal references: Dutch weather, indoor heating effects on skin

### Sources

- [Claude Multilingual Support Docs](https://docs.claude.com/en/docs/build-with-claude/multilingual-support)
- [GPT-NL: Dutch Language Model](https://www.typetone.ai/blog/gpt-nl-a-comprehensive-guide)
- [GitHub: Dutch LLMs](https://github.com/RobinSmits/Dutch-LLMs)
- [Fietje: Open LLM for Dutch](https://arxiv.org/html/2412.15450v1)
- [Xomnia: Navigating Multilingual LLMs](https://xomnia.com/post/a-language-barrier-to-bridge-navigating-the-landscape-of-multilingual-llms/)

---

## 9. SEO and GEO Optimization

### Google's Position on AI Content (2025-2026)

**Google does not penalize AI-generated content.** It penalizes low-quality, unhelpful content regardless of how it was produced. The key criteria are:

- **E-E-A-T**: Experience, Expertise, Authoritativeness, Trustworthiness
- **People-first content**: Created to help users, not to manipulate rankings
- **Trust is the most important E-E-A-T signal**

### SEO Requirements for AI Blog Content

1. **Clear author attribution**: Every post attributed to Sindy Kienstra with bio and credentials
2. **Demonstrated expertise**: Include personal experience, case studies, specific advice
3. **Original value**: Unique angles, proprietary insights, not rehashed generic info
4. **Depth over breadth**: Fewer, deeper articles outperform many shallow ones
5. **Technical SEO**: Schema markup (Article, Person, MedicalWebPage), meta descriptions, internal linking

### Generative Engine Optimization (GEO)

GEO is the new discipline alongside SEO. The goal: get your content **cited by AI search engines** (ChatGPT, Perplexity, Google AI Overviews, Claude).

**Key GEO tactics:**

- Structure content with **direct answers in the first 40-60 words**
- Maintain **fact density**: statistics/data every 150-200 words
- **Cite authoritative sources** throughout (builds AI trust in your content)
- Implement **proper schema markup** (structured data increases GPT-4 correct citation from 16% to 54%)
- Include **original data and unique insights** (AI prefers citing original sources)
- Build **third-party citations** (other sites linking to your content)

**GEO market impact:** AI-referred sessions jumped **527% year-over-year** in H1 2025. Most enterprise marketing teams have a GEO initiative by early 2026.

### Dual SEO/GEO Content Structure

```markdown
# [Keyword-Rich H1 with Direct Answer Promise]

[First paragraph: Direct, concise answer to the core question - 40-60 words]

## [H2: Context/Background]

[Paragraph with statistic + source citation]
[Personal experience / E-E-A-T signal]

## [H2: Detailed Explanation]

[Fact-dense paragraphs, data every 150-200 words]
[Schema-friendly structured data: lists, tables]

## [H2: Practical Steps / Actionable Advice]

[Numbered steps - AI engines love structured advice]
[Each step: what + why + how]

## [H2: FAQ Section]

[Question-answer pairs - direct GEO fodder]
[Schema: FAQPage markup]

## Bronnen

[Linked citations with DOIs where available]
```

### Sources

- [Google: Search and AI Content Guidelines](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content)
- [Google: Creating Helpful Content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Enrich Labs: GEO Complete Guide 2026](https://www.enrichlabs.ai/blog/generative-engine-optimization-geo-complete-guide-2026)
- [Frase.io: GEO Complete Guide 2026](https://www.frase.io/blog/what-is-generative-engine-optimization-geo)
- [Search Engine Land: Mastering GEO in 2026](https://searchengineland.com/mastering-generative-engine-optimization-in-2026-full-guide-469142)
- [Digidop: Structured Data for SEO and GEO 2026](https://www.digidop.com/blog/structured-data-secret-weapon-seo)

---

## 10. Recommended Architecture for FMai

### End-to-End Blog Generation Pipeline

Based on all research above, here is the recommended architecture for the FMai content automation system:

```
┌─────────────────────────────────────────────────────────┐
│                    CONTENT CALENDAR                       │
│  (Supabase table: topics, keywords, target dates)        │
└────────────────────────┬────────────────────────────────┘
                         │ n8n CRON trigger
                         ▼
┌─────────────────────────────────────────────────────────┐
│              STEP 1: RESEARCH & OUTLINE                  │
│  - Retrieve topic from calendar                          │
│  - PubMed API: fetch relevant studies                    │
│  - RAG: retrieve similar existing posts + voice examples │
│  - Claude Opus 4.6: generate outline                     │
│  - Send outline to Telegram for approval                 │
└────────────────────────┬────────────────────────────────┘
                         │ Telegram approval webhook
                         ▼
┌─────────────────────────────────────────────────────────┐
│              STEP 2: DRAFT GENERATION                    │
│  - Claude Opus 4.6 with:                                 │
│    * Sindy voice profile (system prompt)                 │
│    * 2-3 voice example excerpts (few-shot)               │
│    * Scientific sources from Step 1 (RAG context)        │
│    * Product info from Shopify (RAG context)             │
│    * Approved outline as structure                        │
│  - Generate section by section (prompt chaining)         │
│  - Assemble full draft                                   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              STEP 3: QUALITY ASSURANCE                   │
│  - Voice score check (LLM judge, reject if < 7)         │
│  - Citation verification (PubMed DOI check)              │
│  - Dutch language quality check (LanguageTool NL)        │
│  - Plagiarism/AI detection check (Originality.ai API)    │
│  - Embedding similarity vs existing posts (< 0.85)       │
│  - SEO score check (keyword density, structure)          │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              STEP 4: HUMAN REVIEW                        │
│  - Full draft sent to Telegram with:                     │
│    * Quality scores summary                              │
│    * Flagged items (uncertain citations, low scores)     │
│    * Inline buttons: Approve / Revise / Reject           │
│  - If Revise: feedback loop back to Step 2               │
│  - If Approve: proceed to publish                        │
└────────────────────────┬────────────────────────────────┘
                         │ Telegram approval webhook
                         ▼
┌─────────────────────────────────────────────────────────┐
│              STEP 5: PUBLISH & OPTIMIZE                  │
│  - Generate meta description, OG tags                    │
│  - Generate schema markup (Article, Person, FAQPage)     │
│  - Upload to WordPress/Next.js CMS                       │
│  - Submit to Google Search Console                       │
│  - Schedule social media posts (repurpose content)       │
│  - Log to analytics (track performance over time)        │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

| Component      | Tool                          | Notes                          |
| -------------- | ----------------------------- | ------------------------------ |
| Orchestration  | n8n (self-hosted)             | Already in use at FMai         |
| Primary LLM    | Claude Opus 4.6 API           | Best for voice + Dutch quality |
| Vector Store   | Supabase pgvector             | Already in stack               |
| Citation DB    | PubMed API (NCBI E-utilities) | Free, comprehensive            |
| Plagiarism     | Originality.ai API            | Best accuracy for AI content   |
| Language Check | LanguageTool API (NL)         | Free/open-source               |
| Human Approval | Telegram Bot                  | Personal workflow, fast        |
| CMS            | Next.js (SKC platform)        | Existing infrastructure        |
| SEO Monitoring | Google Search Console API     | Track indexing + ranking       |

### Key Success Metrics

- **Voice consistency score**: Average > 8/10 across all posts
- **Citation accuracy**: 100% of health claims backed by verified sources
- **AI detection score**: < 30% AI-detected (Originality.ai)
- **Plagiarism score**: < 5% similarity to existing web content
- **SEO performance**: Organic traffic growth month-over-month
- **GEO citations**: Track AI search engine citations of SKC content
- **Time to publish**: < 24 hours from topic selection to live post
- **Human review time**: < 15 minutes per post

---

## Summary of Key Recommendations

1. **Use Claude Opus 4.6** as the primary content model - best for voice matching, Dutch quality, and warm/empathetic tone
2. **Generate natively in Dutch** - never translate from English
3. **Multi-step prompt chaining** - outline -> section-by-section -> polish, not single-shot
4. **RAG everything** - feed in voice docs, existing posts, scientific sources, product info
5. **Automated quality gates** - voice score, citation check, plagiarism check before human review
6. **Telegram HITL at 2 points only** - outline approval and final draft approval
7. **Verify every health claim** - PubMed API + DOI verification, no unverified medical statements
8. **Optimize for both SEO and GEO** - structured data, direct answers, fact density, schema markup
9. **Measure voice consistency** - LLM judge scoring every post against Sindy's voice profile
10. **Include personal/unique elements** - Sindy's real experiences, SKC community data, Dutch cultural context
