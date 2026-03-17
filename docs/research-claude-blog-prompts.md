# Research: Claude API Prompt Engineering for SEO/GEO/LLMEO Blog Generation

> Research date: 2026-03-17
> Context: n8n workflow generating Dutch health/skincare blog content via Claude API
> Tags: #research #claude-api #seo #geo #llmeo #prompt-engineering #n8n

---

## 1. Extended Thinking for Long-Form Content Planning

### What It Does

Extended thinking lets Claude "think" internally before responding. The model reasons through article structure, research angles, and content flow before writing a single word. This is ideal for planning 8000+ word articles.

### API Implementation

```json
{
  "model": "claude-sonnet-4-5",
  "max_tokens": 16000,
  "thinking": {
    "type": "enabled",
    "budget_tokens": 10000
  },
  "messages": [...]
}
```

**Key parameters:**

- `budget_tokens` — minimum 1,024 tokens, must be less than `max_tokens`
- Start at minimum and increase incrementally; Claude may not use the full budget, especially above 32k
- Not compatible with `temperature`, `top_p`, or `top_k` modifications
- Cannot pre-fill responses when thinking is enabled

### Model-Specific Notes

- **Claude Sonnet 4.5 / 4.6**: Use `"type": "enabled"` with `budget_tokens`
- **Claude Opus 4.6**: Use `"type": "adaptive"` instead (enabled+budget_tokens is deprecated for Opus)
- Adaptive thinking lets Claude dynamically determine when and how much to think based on complexity

### Recommended Strategy for Blog Planning

Use extended thinking in **Step 1 (Planning)** of the n8n workflow:

```
System: You are a Dutch skincare content strategist planning a comprehensive article.

User: Plan a detailed article about {topic} targeting the keyword "{primary_keyword}".

Think through:
1. What search intent does this keyword serve?
2. What are the 6-8 major sections needed to comprehensively cover this topic?
3. What questions does a Dutch reader have about this topic?
4. What internal links to existing content make sense?
5. What unique angles or personal experience elements can we include?
6. What medical claims must we avoid?

Output a structured outline with section titles, key points per section, word count targets, and FAQ questions.
```

Set `budget_tokens: 8000-12000` for planning. The thinking output is not returned to the user but dramatically improves outline quality.

### Sources

- [Building with extended thinking — Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/extended-thinking)
- [Adaptive thinking — Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/adaptive-thinking)
- [Extended thinking cookbook](https://platform.claude.com/cookbook/extended-thinking-extended-thinking)

---

## 2. Structured Output with Tool Use

### The Problem

We need both free-form markdown content AND structured metadata (frontmatter, FAQ schema, citation lists) from a single generation. Returning raw markdown means parsing headaches; returning only JSON loses prose quality.

### Two Complementary Features

1. **JSON outputs** (`output_config.format`) — Forces entire response into a JSON schema
2. **Strict tool use** (`strict: true`) — Guarantees schema validation on tool call inputs

When combined, Claude can generate structured data with guaranteed schema compliance. Structured outputs compile the JSON schema into a grammar and restrict token generation during inference — the model literally cannot produce tokens that violate the schema.

### Strategy: Separate Content Generation from Metadata Extraction

**Do NOT** force the article body into JSON. Instead, use a two-step approach:

**Step A — Generate article section** (free-form markdown, optimized for writing quality)

**Step B — Extract metadata** using tool_use:

```json
{
  "tools": [
    {
      "name": "extract_article_metadata",
      "description": "Extract structured metadata from the article section",
      "input_schema": {
        "type": "object",
        "properties": {
          "meta_title": { "type": "string", "maxLength": 60 },
          "meta_description": { "type": "string", "maxLength": 155 },
          "primary_keyword": { "type": "string" },
          "secondary_keywords": {
            "type": "array",
            "items": { "type": "string" }
          },
          "faq_items": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "question": { "type": "string" },
                "answer": { "type": "string" }
              },
              "required": ["question", "answer"]
            }
          },
          "internal_links_used": {
            "type": "array",
            "items": { "type": "string" }
          },
          "sources_cited": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "title": { "type": "string" },
                "url": { "type": "string" },
                "claim_supported": { "type": "string" }
              }
            }
          },
          "word_count": { "type": "integer" },
          "readability_level": { "type": "string", "enum": ["B1", "B2", "C1"] }
        },
        "required": ["meta_title", "meta_description", "primary_keyword", "faq_items"]
      }
    }
  ],
  "tool_choice": { "type": "tool", "name": "extract_article_metadata" }
}
```

### For Frontmatter Generation

Use `output_config` with JSON format for the planning step:

```json
{
  "output_config": {
    "format": {
      "type": "json_schema",
      "json_schema": {
        "name": "article_frontmatter",
        "schema": {
          "type": "object",
          "properties": {
            "title": { "type": "string" },
            "slug": { "type": "string" },
            "description": { "type": "string" },
            "category": { "type": "string" },
            "tags": { "type": "array", "items": { "type": "string" } },
            "estimated_reading_time": { "type": "integer" },
            "target_keywords": { "type": "array", "items": { "type": "string" } },
            "outline": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "h2": { "type": "string" },
                  "key_points": { "type": "array", "items": { "type": "string" } },
                  "target_words": { "type": "integer" }
                }
              }
            }
          }
        }
      }
    }
  }
}
```

### Sources

- [Structured outputs — Claude API Docs](https://platform.claude.com/docs/en/build-with-claude/structured-outputs)
- [Extracting structured JSON using Claude and tool use](https://platform.claude.com/cookbook/tool-use-extracting-structured-json)
- [Structured outputs blog post](https://claude.com/blog/structured-outputs-on-the-claude-developer-platform)

---

## 3. Section-by-Section Generation (8000+ Words)

### Why Multi-Call Is Necessary

LLMs that can process 100k+ input tokens still struggle to generate outputs longer than 2,000 words coherently. When forced to produce 8000+ words in a single call, models lose relevance, repeat content, go out of scope, and degrade in quality.

### The AgentWrite Pattern

Decompose ultra-long generation into subtasks. This is the proven approach for generating 20,000+ word coherent outputs:

1. **Plan** — Generate full outline with section specs (1 call)
2. **Generate** — Write each section independently (6-8 calls)
3. **Review** — Validate coherence and quality (1 call)

### n8n Workflow Architecture

```
[Planning Node] → [Loop: Section Generator] → [Assembly Node] → [Validator Node]
```

### Context Passing Between Section Calls

Each section call needs context to maintain flow. Include in every section prompt:

```
## Article Context
Title: {title}
Target keyword: {primary_keyword}
Author voice: {voice_description}

## Full Outline
{complete_outline}

## Previously Written Sections (summaries)
Section 1 "{h2_1}": {2-3 sentence summary of section 1}
Section 2 "{h2_2}": {2-3 sentence summary of section 2}
...

## Current Assignment
Write Section {n}: "{h2_n}"
Target: {word_count} words
Key points to cover: {key_points}
Internal links to include: {links}

## Constraints
- Continue the narrative flow from the previous section
- Do NOT repeat points already covered in earlier sections
- Do NOT write a conclusion or wrap-up (unless this is the final section)
- Match the established voice and tone exactly
- Begin with a transitional sentence that connects to Section {n-1}
```

### Preventing Repetition

- **Running summary**: After each section, generate a 2-3 sentence summary and a "concepts already covered" list. Pass these to subsequent calls.
- **Explicit exclusion list**: Tell each section what topics have already been covered.
- **Checkpoint method**: End each section with a natural continuation point, not a conclusive ending. Only the final section should conclude.

### Maintaining Voice Consistency

- Include the same `voice_description` and style examples in every call
- Use a persistent system prompt across all section calls
- Include a "voice reference" paragraph from a previously written section

### Word Count Control

Specify target word counts per section in the outline. Example breakdown for an 8000-word article:

| Section    | Type                 | Target Words |
| ---------- | -------------------- | ------------ |
| Intro      | Hook + overview      | 400          |
| Section 1  | Background/context   | 1200         |
| Section 2  | Main topic deep-dive | 1500         |
| Section 3  | Practical advice     | 1200         |
| Section 4  | Expert insights      | 1000         |
| Section 5  | Common mistakes      | 1000         |
| Section 6  | FAQ                  | 800          |
| Conclusion | Summary + CTA        | 400          |

### Sources

- [AgentWrite / LongWriter approach](https://medium.com/@hitesh.hinduja/unlocking-ultra-long-text-generation-a-deep-dive-into-longwriter-and-agentwrite-01632c2edfa7)
- [LongWriter paper](https://huggingface.co/papers/2408.07055)
- [Maximize agent output length](https://medium.com/@kyeg/how-to-maximize-agent-output-length-a-developers-guide-to-api-optimization-6b10b006c779)

---

## 4. Voice Cloning from Examples

### The Challenge

Matching a specific author's Dutch writing voice — sentence rhythm, personal touches, signature phrases, paragraph structure — requires more than just "write in a friendly tone."

### Three-Layer Voice System

#### Layer 1: Style Guide (System Prompt)

Define the voice explicitly in the system prompt. Be specific about mechanics:

```
## Writing Voice: Sindy — SkinClarity Club

### Tone
- Warm, empathisch, alsof je met een vriendin praat
- Nooit betuttelend of schools
- Eerlijk over eigen ervaring met acne

### Sentence Patterns
- Mix korte krachtige zinnen met langere uitleg
- Begin paragrafen vaak met een vraag aan de lezer
- Gebruik "je" (informeel), nooit "u"
- Af en toe een tussenzin met gedachtestreepje — zo blijft het persoonlijk

### Vocabulary
- "Huid" niet "cutis"; "puistjes" niet "comedonen" (behalve bij uitleg)
- Gebruik alledaagse woorden, leg vaktermen uit
- Vermijd anglicismen waar een goed Nederlands woord bestaat

### Structure Preferences
- Korte paragrafen (2-4 zinnen)
- Veel witruimte
- Bullet points voor lijstjes, maar niet voor elk punt
- H2s als vragen die de lezer zou stellen

### What NOT to Do
- Geen overdreven uitroeptekens!!!
- Geen "In dit artikel gaan we het hebben over..."
- Geen passieve zinnen waar actieve beter passen
- Geen medische claims of diagnoses
```

#### Layer 2: Few-Shot Examples (2-3 Excerpts)

Include 2-3 paragraphs from existing published posts. Place these near the top of the prompt (before instructions, per Claude best practices for long context).

```
<example_voice>
<source>Blog: "Waarom je huid in de winter droog aanvoelt"</source>
<text>
Ken je dat gevoel? Je smeert 's ochtends je moisturizer op, en tegen de middag
trekt je huid alweer. Alsof er een onzichtbare spons al je vocht opzuigt.

Dat is niet je verbeelding — en het ligt ook niet aan je product. Je huidbarrière
werkt in de winter gewoon anders. Laat me uitleggen waarom.
</text>
</example_voice>

<example_voice>
<source>Blog: "Acne en stress: het verband dat niemand je vertelt"</source>
<text>
Ik weet nog precies wanneer ik het verband zag. Elke keer als ik een deadline had,
verschenen er nieuwe puistjes op mijn kin. Toeval? Dat dacht ik eerst ook.

Maar je lichaam liegt niet. Cortisol — je stresshormoon — heeft een directe
invloed op je talgproductie. En die extra talg? Die is een feestmaal voor de
bacteriën die acne veroorzaken.
</text>
</example_voice>
```

Research confirms: 2-3 examples establish a reliable template, allowing the AI to distinguish between fixed elements (tone, structure) and flexible elements (specific content). Few-shot prompting consistently outperforms zero-shot for style alignment.

#### Layer 3: Inline Voice Corrections

After generating a section, run a quick voice-check prompt:

```
Review this text against the voice examples provided. Identify any sentences that:
- Sound too formal or academic
- Use passive voice unnecessarily
- Miss the personal, conversational tone
- Use jargon without explanation

Rewrite only those sentences to match the established voice.
```

### Dutch-Specific Considerations

- Dutch has more flexible word order than English — embrace natural Dutch phrasing, don't translate English patterns
- "Je/jij" vs "u" is a critical tone marker — always use "je" for this brand
- Dutch compound words (samenstellingen) should be used naturally, not avoided
- Idiomatic expressions ("het valt niet mee", "daar komt bij") add authenticity

### Sources

- [Few-shot prompting guide — PromptHub](https://www.prompthub.us/blog/the-few-shot-prompting-guide)
- [Style transfer with LLMs](https://arxiv.org/html/2505.07888v1)
- [How examples improve LLM style consistency](https://latitude-blog.ghost.io/blog/how-examples-improve-llm-style-consistency/)
- [Few-shot prompting — Relevance AI](https://relevanceai.com/docs/example-use-cases/few-shot-prompting)

---

## 5. SEO-Optimized Content Prompting

### Keyword Integration

Include keyword targets in the section prompt, but instruct natural integration:

```
## SEO Requirements for This Section
Primary keyword: "{keyword}" — use 2-3 times naturally in this section
Secondary keywords: {list} — weave in where they fit organically
LSI terms: {list} — use at least 3 of these

Rules:
- NEVER force a keyword where it breaks sentence flow
- Prefer Dutch natural phrasing over exact-match keyword stuffing
- Use keyword variations (singular/plural, with/without lidwoord)
- Place the primary keyword in the first paragraph of this section if possible
```

### Featured Snippet Optimization

Instruct Claude to write "snippet-ready" paragraphs:

```
For the question "{h2_question}", write a direct answer in the first 40-60 words
of the section. This answer should:
- Directly and completely answer the question
- Be self-contained (readable without surrounding context)
- Start with a declarative statement, not "Well..." or "Dat hangt af van..."
- Include the question's main terms in the answer
```

### Question-Based H2s

Generate H2s that match search queries:

```
Write H2 headings as questions a Dutch person would type into Google.
Good: "Hoe lang duurt het voordat acne verdwijnt?"
Bad: "Tijdlijn van acneherstel"
Good: "Welke voeding verergert acne?"
Bad: "Voeding en acne: een overzicht"
```

### Internal Linking Instructions

```
## Internal Links to Include
Available pages and their topics:
- /acne/hormonale-acne — Hormonale acne uitleg
- /acne/voeding — Voeding en acne
- /academy-info — SkinClarity Academy
- /coaching-info — 1-op-1 coaching

Naturally link to 3-5 of these pages where relevant.
Use descriptive anchor text in Dutch, not "klik hier."
Example: "Lees meer over [hoe voeding je huid beïnvloedt](/acne/voeding)"
```

### Meta Content Generation

After article assembly, generate meta tags with strict constraints:

```
Generate SEO meta content:
- Title tag: max 60 characters, include primary keyword, compelling for clicks
- Meta description: max 155 characters, include primary keyword, end with implicit CTA
- URL slug: lowercase, hyphens, max 5 words, Dutch
```

### Sources

- [Claude SEO prompts — AirOps](https://www.airops.com/prompts/awesome-ai-seo-claude-prompts)
- [AI-Powered SEO with Claude Code — MarketBetter](https://marketbetter.ai/blog/ai-seo-optimization-content/)
- [Claude SEO agency-level prompts](https://www.the-ai-corner.com/p/claude-seo-cowork-prompts-free-agency)
- [SEO Machine — GitHub](https://github.com/TheCraigHewitt/seomachine)

---

## 6. GEO/LLMEO Prompting — Optimizing for AI Search Citations

### Why This Matters

AI-referred traffic jumped 527% year-over-year in early 2025. LLM traffic is projected to overtake traditional Google search by end of 2027. Content must be optimized not just for Google but for ChatGPT, Perplexity, Gemini, and Claude search.

### The "Answer Capsule" Pattern

AI systems extract concise, self-contained passages of 130-160 words. Every section should contain at least one "answer capsule" — a semantically complete passage covering one idea fully.

```
## GEO Instructions for This Section

Write at least one "answer capsule" — a self-contained passage of 130-160 words
that fully answers a specific question. This passage should:
- Be understandable without reading the rest of the article
- Start with a declarative sentence using direct verbs ("is", "betekent", "werkt")
- Include specific entities (product names, ingredient names, study references)
- Contain at least one statistic or quantified claim with a source
- End with a clear conclusion, not a trailing thought

Sentences using direct verbs like "is," "refers to," and "means" are nearly 2x
more likely to be cited by AI systems than vague constructions.
```

### Quotable Sentences

Lead each section with one quotable line, then follow with context:

```
Write one standalone, quotable sentence per section that:
- Is under 25 words
- Makes a clear, specific claim
- Could be extracted and still make sense
- Contains the section's core insight

Example: "Niacinamide vermindert talgproductie met gemiddeld 20-30% bij dagelijks gebruik."
NOT: "Er zijn verschillende ingrediënten die kunnen helpen bij een vette huid."
```

### Statistics and Data Density

Princeton GEO research found content with citations and statistics achieves 30-40% higher visibility in AI responses:

```
Include factual density:
- At least one statistic or data point every 150-200 words
- Always cite the source of statistics (study name, institution, year)
- Use specific numbers, not vague qualifiers
- "85% van de tieners krijgt last van acne" > "veel tieners hebben acne"
```

### Entity Richness

```
Mention specific entities where relevant:
- Ingredient names (niacinamide, salicylzuur, retinol)
- Study/institution names (American Academy of Dermatology, RIVM)
- Method/framework names (dubbele reiniging, 5-stappenroutine)
- Tool/product category names

AI systems prefer entity-rich passages over vague ones.
```

### Structural Requirements

- Front-load definitions within the first 20% of the article
- Use question-based H2 headings
- Write declarative sentences that stand alone
- Structure modular sections that each answer one idea independently
- Include FAQ schema with direct, self-contained answers

### Sources

- [GEO Complete 2026 Guide — Frase.io](https://www.frase.io/blog/what-is-generative-engine-optimization-geo)
- [How to structure content for maximum AI citation — Norg.ai](https://home.norg.ai/ai-search-answer-engines/answer-engine-architecture-citation-mechanics/how-to-structure-content-for-maximum-ai-citation-a-step-by-step-optimization-guide/)
- [GEO: How to win AI mentions — Search Engine Land](https://searchengineland.com/what-is-generative-engine-optimization-geo-444418)
- [GEO Best Practices 2026 — Firebrand](https://www.firebrand.marketing/2025/12/geo-best-practices-2026/)
- [SEO, GEO & LLMEO — RankVise](https://rankvise.com/blog/seo-geo-llmeo-future/)
- [GEO guide — Backlinko](https://backlinko.com/generative-engine-optimization-geo)

---

## 7. Medical Content Safety Prompting

### The Regulatory Context: KOAG/KAG

The Keuringsraad (formerly KOAG/KAG — Keuringsraad Openlijke Aanprijzing Geneesmiddelen / Keuringsraad Aanprijzing Gezondheidsproducten) is the Dutch self-regulatory body overseeing public advertising for health products. Key rules:

- **No medical claims** for non-medical products (cosmetics, supplements)
- **Health claims** are permitted but regulated under EU Claimsverordening (EC 1924/2006)
- The **Code voor Aanprijzing Gezondheidsproducten (CAG)** is the operative code
- The **NVWA** (Nederlandse Voedsel- en Warenautoriteit) enforces compliance
- The **Indicatieve lijst gezondheidsaanprijzingen** provides boundary guidance

### System Prompt Safety Instructions

```
## Medical Content Safety Rules (VERPLICHT)

You are writing informational skincare content for a Dutch audience. You are NOT
a medical professional and this content is NOT medical advice.

### Absolute Prohibitions
- NOOIT een diagnose stellen of suggereren
- NOOIT claimen dat een product of ingrediënt een ziekte geneest, behandelt, of voorkomt
- NOOIT specifieke medicijnen of receptplichtige behandelingen aanbevelen
- NOOIT claimen dat natuurlijke middelen beter werken dan medische behandelingen
- NOOIT suggereren dat een arts bezoek onnodig is

### Required Disclaimers
- Bij elk artikel over huidproblemen: aanbeveling om een dermatoloog te raadplegen
- Bij ingrediënt-informatie: "Dit is geen medisch advies"
- Bij resultaatclaims: "Resultaten kunnen per persoon verschillen"

### Permitted Language
GOED: "Niacinamide kan helpen bij het verminderen van overtollige talgproductie"
FOUT: "Niacinamide geneest acne"

GOED: "Onderzoek suggereert dat zink een rol kan spelen bij huidgezondheid"
FOUT: "Zink is bewezen effectief tegen acne"

GOED: "Veel mensen ervaren verbetering wanneer ze..."
FOUT: "Dit product zal je acne genezen"

### Source Requirements
- Verwijs naar gepubliceerd onderzoek waar mogelijk
- Gebruik "kan", "suggereert", "draagt bij aan" — nooit absolute termen
- Maak onderscheid tussen cosmetische en medische claims
- Verwijs bij ernstige klachten altijd naar een huisarts of dermatoloog

### KOAG/KAG-Compliant Phrasing Patterns
- "Kan bijdragen aan een gezondere huid" (gezondheidsaanprijzing, toegestaan)
- "Helpt de huid te beschermen tegen uitdroging" (cosmetische claim, toegestaan)
- "Ondersteunt het natuurlijke herstelvermogen van de huid" (grensgebied, voorzichtig)
- "Geneest eczeem" (medische claim, VERBODEN)
```

### Post-Generation Safety Check

Add a dedicated validation step in the n8n workflow:

```
Review the following article for medical safety compliance.

Flag any sentence that:
1. Makes a diagnosis or suggests a specific condition
2. Claims a product cures, treats, or prevents a disease
3. Recommends specific medications
4. Makes absolute health claims without hedging language
5. Could be interpreted as replacing professional medical advice

For each flagged sentence, provide:
- The original sentence
- Why it's problematic
- A compliant rewrite

If no issues are found, confirm the article is compliant.
```

### Sources

- [KOAG/KAG — Keuringsraad](https://keuringsraad.nl/)
- [Code voor Aanprijzing Gezondheidsproducten (CAG)](<https://www.koagkag.nl/Keuringsraad/media/KoagKag/Downloads/Code-voor-de-Aanprijzing-van-Gezondheidsproducten-(CAG).pdf>)
- [Verbod op medische claims — NVWA](https://www.nvwa.nl/onderwerpen/voedingsclaims-en-gezondheidsclaims/verbod-op-medische-claims)
- [KOAG KAG claims: wat mag je wel zeggen — Nutrimedia](https://nutrimedia.nl/koag-kag-claims-wat-mag-je-wel-zeggen/)

---

## 8. AI Validator Prompting (LLM-as-Judge)

### Core Problem

LLM judges tend to assign inflated scores, especially to longer responses. The judge's "preference" correlates with its own generation patterns, not with independent quality signals. A validator that scores everything 8-9/10 is useless.

### Architecture: Use a Different Model as Judge

Use a **different model family** as judge than as generator. If Claude generates the content, consider using GPT-4o or Gemini as the validator (or at minimum, a different Claude model). Cross-model evaluation breaks the self-preference loop.

### Rubric Design

Each criterion must be verifiable in isolation. Use binary or 3-point scales rather than 1-10:

```json
{
  "name": "validate_article_quality",
  "input_schema": {
    "type": "object",
    "properties": {
      "dimensions": {
        "type": "array",
        "items": {
          "type": "object",
          "properties": {
            "dimension": { "type": "string" },
            "score": { "type": "string", "enum": ["pass", "partial", "fail"] },
            "evidence": { "type": "string" },
            "fix_required": { "type": "string" }
          }
        }
      },
      "overall_verdict": { "type": "string", "enum": ["publish", "revise", "reject"] },
      "revision_instructions": { "type": "string" }
    }
  }
}
```

### Scoring Dimensions

Design rubric around these dimensions for blog content:

| Dimension             | Pass Criteria                                              | Fail Criteria                                  |
| --------------------- | ---------------------------------------------------------- | ---------------------------------------------- |
| **Factual Accuracy**  | All claims supported by sources or common knowledge        | Contains unsupported health claims             |
| **Medical Safety**    | No prohibited claims, disclaimers present                  | Makes diagnosis or cure claims                 |
| **Voice Consistency** | Matches brand voice examples                               | Sounds generic or switches tone                |
| **SEO Compliance**    | Primary keyword in H1, meta, first para; H2s are questions | Missing keyword placement                      |
| **GEO Readiness**     | Contains answer capsules, statistics, quotable sentences   | No self-contained citable passages             |
| **Logical Flow**      | Sections build on each other, no repetition                | Repeats points, jumps topics                   |
| **Completeness**      | Covers all outline points, meets word target               | Missing sections or significantly under target |
| **Readability**       | Short paragraphs, clear language, B1-B2 Dutch level        | Long academic paragraphs, jargon               |
| **Internal Linking**  | 3-5 natural internal links with descriptive anchors        | No links or forced placements                  |
| **CTA Integration**   | Natural mention of services/academy, not pushy             | Hard sell or missing entirely                  |

### Calibration Techniques

1. **Gold standard test set**: Create 30-50 examples with human-scored labels. Compare LLM scores to calibrate.

2. **Few-shot scoring examples**: Show the validator examples of "pass" and "fail" for each dimension:

```
<scoring_example dimension="voice_consistency">
<sample>Dit is een uitgebreid overzicht van de verschillende manieren waarop acne
kan worden behandeld. Er zijn meerdere factoren die een rol spelen.</sample>
<score>fail</score>
<reason>Te formeel, geen persoonlijke toon, klinkt als een Wikipedia-artikel.
Mist de "vriendin die advies geeft" stem.</reason>
</scoring_example>

<scoring_example dimension="voice_consistency">
<sample>Oké, laten we eerlijk zijn — je hebt waarschijnlijk al twintig producten
geprobeerd. En dat snap ik. Maar voordat je weer iets nieuws koopt, wil ik dat
je dit begrijpt.</sample>
<score>pass</score>
<reason>Persoonlijk, direct, informeel "je", emotionele connectie, typische
Sindy-stem.</reason>
</scoring_example>
```

3. **Chain-of-thought scoring**: Force the validator to explain reasoning before scoring:

```
For each dimension:
1. Quote the specific text evidence (or note its absence)
2. Explain why this meets or fails the criteria
3. THEN assign pass/partial/fail
4. If partial or fail, write specific revision instructions

Do NOT assign a score before explaining your reasoning.
```

4. **Anti-inflation instructions**:

```
Calibration rules:
- "Pass" means genuinely good, not merely acceptable
- "Partial" is the expected baseline for first drafts — most dimensions should score partial
- A perfect score across all dimensions on a first draft is suspicious — double-check
- If you cannot find specific text evidence for "pass", score "partial"
- Penalize unnecessary length, repetition, and filler content
- Say "cannot determine" if you lack information to evaluate a dimension
```

5. **Score distribution monitoring**: Track scores over time. If >80% of articles score "pass" on all dimensions, the rubric needs tightening.

### Validator Prompt Template

```
You are an independent content quality reviewer for a Dutch skincare blog.
Your job is to find problems, not to praise. You are NOT the content creator.

You will evaluate the article against specific quality dimensions.
Be strict. First drafts should typically score "partial" on most dimensions.
A "pass" requires specific evidence of excellence.

## Voice Reference
{voice_examples}

## SEO Brief
Primary keyword: {keyword}
Target audience: {audience}

## Article to Review
{full_article}

## Evaluation Instructions
For each dimension, follow this exact process:
1. Find and quote specific evidence from the article
2. Compare against the pass/fail criteria
3. Assign score: pass / partial / fail
4. If not "pass", write specific, actionable revision instructions

Output your evaluation using the validate_article_quality tool.
```

### Sources

- [LLM-as-a-Judge complete guide — Evidently AI](https://www.evidentlyai.com/llm-guide/llm-as-a-judge)
- [Calibrating scores of LLM-as-a-Judge — GoDaddy](https://www.godaddy.com/resources/news/calibrating-scores-of-llm-as-a-judge)
- [LLM-as-Judge done right: Calibrating & debiasing — Kinde](https://www.kinde.com/learn/ai-for-software-engineering/best-practice/llm-as-a-judge-done-right-calibrating-guarding-debiasing-your-evaluators/)
- [LLM-as-a-Judge practical guide — Towards Data Science](https://towardsdatascience.com/llm-as-a-judge-a-practical-guide/)
- [What AI engineers get wrong about evaluation](https://vadim.blog/llm-as-judge)
- [LLM-as-Judge: How to calibrate with human corrections — LangChain](https://www.langchain.com/articles/llm-as-a-judge)

---

## Recommended n8n Workflow Architecture

Based on all research, here is the recommended multi-node pipeline:

```
┌─────────────────────────────────────────────────────────────┐
│ PHASE 1: PLANNING                                           │
│                                                             │
│ [Trigger] → [Research Node] → [Planning Node]               │
│              (web search)     (extended thinking,            │
│                               structured JSON output)        │
│                               → outline + frontmatter        │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ PHASE 2: GENERATION                                         │
│                                                             │
│ [Loop over sections] → [Section Generator Node]              │
│                         (voice examples in system prompt,    │
│                          running summary context,            │
│                          SEO + GEO instructions,             │
│                          medical safety rules)               │
│                         → markdown per section               │
│                                                             │
│ [After each section] → [Summary Extractor]                   │
│                         (tool_use, extract summary +         │
│                          covered concepts for next call)     │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ PHASE 3: ASSEMBLY                                           │
│                                                             │
│ [Assemble markdown] → [Metadata Extractor]                   │
│                        (tool_use: FAQ schema,                │
│                         meta tags, internal links used)      │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ PHASE 4: VALIDATION                                         │
│                                                             │
│ [Medical Safety Check] → [Quality Validator]                 │
│  (dedicated safety         (LLM-as-Judge,                    │
│   review prompt)            rubric-based scoring,            │
│                             chain-of-thought)                │
│                                                             │
│ [If "revise"] → loop back to relevant section generator      │
│ [If "publish"] → proceed to CMS                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│ PHASE 5: PUBLISH                                            │
│                                                             │
│ [Format for CMS] → [Upload to CMS API]                       │
│                     (frontmatter + markdown + FAQ schema)     │
└─────────────────────────────────────────────────────────────┘
```

### Token Budget Estimates per Article

| Step                  | Model                 | Input ~tokens | Output ~tokens       | Cost estimate |
| --------------------- | --------------------- | ------------- | -------------------- | ------------- |
| Planning              | Sonnet 4.5 + thinking | 3,000         | 2,000 (+8k thinking) | ~$0.10        |
| Section gen (x7)      | Sonnet 4.5            | 5,000 each    | 2,000 each           | ~$0.50        |
| Metadata extraction   | Sonnet 4.5            | 10,000        | 500                  | ~$0.04        |
| Safety check          | Sonnet 4.5            | 10,000        | 1,000                | ~$0.05        |
| Quality validation    | Different model       | 12,000        | 2,000                | ~$0.10        |
| **Total per article** |                       |               |                      | **~$0.80**    |
