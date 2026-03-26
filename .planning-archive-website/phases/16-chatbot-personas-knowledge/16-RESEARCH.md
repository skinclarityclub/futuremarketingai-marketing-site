# Phase 16: Chatbot Personas & Knowledge - Research

**Researched:** 2026-03-13
**Domain:** AI chatbot persona configuration, knowledge base architecture, tool definition patterns
**Confidence:** HIGH

## Summary

Phase 16 creates 5 persona configurations (concierge, e-commerce, lead-gen, support, demo-guide) that plug into the Phase 15 engine. The engine infrastructure is already complete with well-defined interfaces: `PersonaConfig` (with `staticPrefix`, `topicDefinitions`, `tools`, model routing), `TopicDefinition` (keyword-based knowledge routing), and a `tool()` factory using AI SDK v6 + Zod 4 schemas.

The project already has two rich reference implementations to draw from: SKC Sindy chatbot (production-grade system with hybrid prompt caching, topic routing, platform tools, and comprehensive knowledge base) and the existing ARIA code (page context detection, module follow-ups, journey configs, and platform knowledge). Phase 16 creates new files in `src/lib/chatbot/personas/`, `src/lib/chatbot/knowledge/`, and `src/lib/chatbot/tools/` -- all pure data/config modules with no UI work.

**Primary recommendation:** Follow the SKC Sindy knowledge-base pattern (exported string constants organized by topic) for knowledge files, the SKC system-prompt pattern (static prefix with core persona + decision rules + guidelines) for persona configs, and the AI SDK v6 `tool()` + Zod 4 `inputSchema` pattern (already demonstrated in `DEMO_TOOL`) for tool definitions. Each persona file exports a complete `PersonaConfig` object and calls `registerPersona()` at import time.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

All 5 persona specifications are locked in CONTEXT.md with:

- Specific tool names and descriptions per persona
- Knowledge base content requirements per persona
- Model routing (Haiku default, Sonnet for complex)
- i18n requirements (EN/NL/ES conversation starters)
- File structure: `personas/`, `knowledge/`, `tools/` directories
- SKC code references for demo data patterns
- ARIA code references for demo guide patterns

### Claude's Discretion

No explicit discretion areas listed in CONTEXT.md. All persona specs are fully defined.

### Deferred Ideas (OUT OF SCOPE)

No deferred ideas listed. All 5 personas are in scope.
</user_constraints>

<phase_requirements>

## Phase Requirements

| ID                   | Description                                                                                                                                                                                           | Research Support                                                                                                                                                                          |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-CHATBOT-PERSONAS | Build all 5 persona configurations: system prompts, tool definitions, knowledge bases, topic routers, and conversation starters for concierge, e-commerce, lead-gen, support, and demo-guide personas | Full engine interface documented (PersonaConfig, TopicDefinition, tool()), SKC patterns verified for knowledge/prompt/tool architecture, AI SDK v6 + Zod 4 tool pattern confirmed working |

</phase_requirements>

## Standard Stack

### Core

| Library           | Version  | Purpose                          | Why Standard                                             |
| ----------------- | -------- | -------------------------------- | -------------------------------------------------------- |
| ai                | ^6.0.116 | AI SDK tool() factory, streaming | Already installed, used by Phase 15 engine               |
| zod               | ^4.3.6   | Tool input schema validation     | Already installed, used by DEMO_TOOL in tool-executor.ts |
| @ai-sdk/anthropic | ^3.0.58  | Claude model provider            | Already installed, used by engine.ts                     |

### Supporting

No additional libraries needed. Phase 16 is pure data/configuration -- no new dependencies.

### Alternatives Considered

| Instead of                       | Could Use             | Tradeoff                                                                                  |
| -------------------------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| Exported string constants for KB | JSON files            | TS strings allow template literals, better IDE support, co-located with topic definitions |
| Inline tool definitions          | Separate schema files | Co-located tool definition + execute handler is cleaner per AI SDK conventions            |

**Installation:**

```bash
# No new packages needed
```

## Architecture Patterns

### Recommended Project Structure

```
src/lib/chatbot/
├── personas/
│   ├── concierge.ts        # PersonaConfig + registerPersona()
│   ├── ecommerce.ts        # PersonaConfig + registerPersona()
│   ├── leadgen.ts           # PersonaConfig + registerPersona()
│   ├── support.ts           # PersonaConfig + registerPersona()
│   ├── demo-guide.ts        # PersonaConfig + registerPersona()
│   └── index.ts             # Imports all persona files (triggers registration)
├── knowledge/
│   ├── concierge-kb.ts      # FMai service knowledge (TopicDefinition[])
│   ├── ecommerce-kb.ts      # Mock product catalog (TopicDefinition[])
│   ├── leadgen-kb.ts        # B2B qualification framework (TopicDefinition[])
│   ├── support-kb.ts        # Mock helpdesk FAQ (TopicDefinition[])
│   └── demo-guide-kb.ts     # Marketing machine modules (TopicDefinition[])
├── tools/
│   ├── concierge-tools.ts   # AI SDK tool() definitions with Zod schemas
│   ├── ecommerce-tools.ts   # AI SDK tool() definitions with Zod schemas
│   ├── leadgen-tools.ts     # AI SDK tool() definitions with Zod schemas
│   ├── support-tools.ts     # AI SDK tool() definitions with Zod schemas
│   └── demo-guide-tools.ts  # AI SDK tool() definitions with Zod schemas
├── types.ts                 # Already exists (PersonaConfig, TopicDefinition)
├── persona-router.ts        # Already exists (registerPersona, getPersona)
├── tool-executor.ts         # Already exists (createPersonaTools -- needs update)
└── engine.ts                # Already exists (handleChatRequest)
```

### Pattern 1: Persona Config Module

**What:** Each persona file exports a `PersonaConfig` and self-registers on import.
**When to use:** Every persona file follows this pattern.
**Example:**

```typescript
// Source: Phase 15 PersonaConfig interface + SKC sindy-system.ts pattern
import type { PersonaConfig } from '../types'
import { registerPersona } from '../persona-router'
import { CONCIERGE_TOPICS } from '../knowledge/concierge-kb'

const STATIC_PREFIX = `You are the FMai Website Concierge...
[core persona, decision rules, guidelines — ~1500-2500 tokens]
[MUST be byte-for-byte identical across requests for prompt caching]`

export const conciergePersona: PersonaConfig = {
  id: 'concierge',
  name: 'Website Concierge',
  description: 'Hybrid tour guide + sales assistant on all marketing pages',
  staticPrefix: STATIC_PREFIX,
  topicDefinitions: CONCIERGE_TOPICS,
  tools: {}, // Populated by createPersonaTools via tool registry
  defaultModel: 'haiku',
  complexityKeywords: ['pricing strategy', 'compare services', 'ROI'],
  maxTokens: 500,
  temperature: 0.7,
}

registerPersona(conciergePersona)
```

### Pattern 2: Knowledge Base as TopicDefinition Arrays

**What:** Each knowledge file exports an array of `TopicDefinition` objects compatible with the topic router.
**When to use:** All knowledge base files.
**Example:**

```typescript
// Source: Phase 15 TopicDefinition interface + SKC sindy-knowledge-base.ts pattern
import type { TopicDefinition } from '../types'

const SERVICES_KNOWLEDGE = `## FMai Services
- **AI Chatbots**: Custom conversational AI...
- **Voice Agents**: AI-powered phone systems...
- **Marketing Machine**: Full autonomous marketing...
- **Automations**: n8n workflow automation...`

const PRICING_KNOWLEDGE = `## Pricing Overview
...`

export const CONCIERGE_TOPICS: TopicDefinition[] = [
  {
    key: 'services',
    content: SERVICES_KNOWLEDGE,
    keywords: [
      'services',
      'chatbots',
      'voice',
      'automations',
      'marketing machine',
      'what do you offer',
    ],
    priority: 10,
  },
  {
    key: 'pricing',
    content: PRICING_KNOWLEDGE,
    keywords: ['pricing', 'cost', 'price', 'how much', 'budget', 'plans'],
    priority: 9,
  },
  // ... more topics
]
```

### Pattern 3: Tool Definitions with AI SDK v6 + Zod 4

**What:** Each tools file exports a record of `tool()` definitions with Zod 4 `inputSchema`.
**When to use:** All tool files.
**Example:**

```typescript
// Source: Phase 15 DEMO_TOOL pattern in tool-executor.ts
import { tool } from 'ai'
import { z } from 'zod'

export const conciergeTools = {
  get_services: tool({
    description: 'Return FMai service information for a specific service or all services',
    inputSchema: z.object({
      serviceType: z
        .enum(['chatbots', 'voice-agents', 'automations', 'marketing-machine', 'all'])
        .describe('Which service to get info about'),
    }),
    execute: async ({ serviceType }) => {
      // Return mock/static service data
      return SERVICES_DATA[serviceType] ?? SERVICES_DATA['all']
    },
  }),

  book_call: tool({
    description: 'Trigger Calendly booking flow for a discovery call',
    inputSchema: z.object({
      reason: z.string().describe('Why the visitor wants to book a call'),
    }),
    execute: async ({ reason }) => ({
      action: 'open_calendly',
      url: 'https://calendly.com/futuremarketingai/discovery',
      reason,
    }),
  }),
  // ... more tools
}
```

### Pattern 4: Tool Registry Bridge (createPersonaTools update)

**What:** `createPersonaTools` in `tool-executor.ts` maps persona IDs to their tool definitions.
**When to use:** Single update to existing file.
**Example:**

```typescript
// Updated tool-executor.ts
import { conciergeTools } from './tools/concierge-tools'
import { ecommerceTools } from './tools/ecommerce-tools'
// ... etc

const PERSONA_TOOLS: Record<string, Record<string, ReturnType<typeof tool>>> = {
  concierge: conciergeTools,
  ecommerce: ecommerceTools,
  leadgen: leadgenTools,
  support: supportTools,
  'demo-guide': demoGuideTools,
}

export function createPersonaTools(
  persona: PersonaConfig
): Record<string, ReturnType<typeof tool>> {
  return PERSONA_TOOLS[persona.id] ?? {}
}
```

### Pattern 5: Persona Index with Side-Effect Imports

**What:** `personas/index.ts` imports all persona files which triggers `registerPersona()` calls.
**When to use:** Single entry point that engine.ts or API endpoint imports.
**Example:**

```typescript
// personas/index.ts
// Side-effect imports trigger registerPersona() in each file
import './concierge'
import './ecommerce'
import './leadgen'
import './support'
import './demo-guide'

// Re-export for convenience
export { conciergePersona } from './concierge'
export { ecommercePersona } from './ecommerce'
// ... etc
```

### Pattern 6: i18n Conversation Starters (Co-located, Not in Locale Files)

**What:** Conversation starters and demo descriptions stored as typed objects in persona files, not in public/locales/.
**When to use:** Persona-specific i18n content consumed by Phase 17 UI, not by i18next.
**Why:** These are chatbot-specific strings consumed by the ChatWidget component, not general page translations. Keeping them co-located with persona configs keeps the data self-contained. Phase 17 UI reads from persona config, not from i18next.
**Example:**

```typescript
export const CONCIERGE_STARTERS: Record<string, string[]> = {
  en: ['What services do you offer?', 'How much does a chatbot cost?', 'Can I see a case study?'],
  nl: [
    'Welke diensten bieden jullie aan?',
    'Hoeveel kost een chatbot?',
    'Kan ik een case study zien?',
  ],
  es: ['Que servicios ofrecen?', 'Cuanto cuesta un chatbot?', 'Puedo ver un caso de estudio?'],
}
```

### Anti-Patterns to Avoid

- **Enormous staticPrefix:** Keep the static prefix under 3000 tokens. It must be byte-for-byte identical across requests for prompt caching to work. Do not include dynamic content (page context, language instructions) in the static prefix.
- **Knowledge in staticPrefix:** Knowledge content belongs in `topicDefinitions`, not the static prefix. The topic router selects relevant knowledge per message. Putting all knowledge in the static prefix wastes tokens and hits the "lost-in-the-middle" problem.
- **Hardcoded language in staticPrefix:** The language instruction (`Respond ONLY in {language}`) is dynamic context injected by the prompt builder, not part of the static prefix.
- **Mock data that looks real:** Demo personas use clearly mock data. The e-commerce catalog uses anonymized product names (not SKC brand names). The support KB uses generic SaaS product scenarios.
- **Tool execute() calling external APIs:** All tool execute() handlers return mock/static data. These are demo tools. No real Shopify, Calendly, or database calls.

## Don't Hand-Roll

| Problem                | Don't Build          | Use Instead                                               | Why                                                                      |
| ---------------------- | -------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------ |
| Tool schema validation | Custom validation    | `tool()` from `ai` + `z.object()` from `zod`              | AI SDK validates tool calls against schema automatically                 |
| Persona registration   | Custom persona map   | `registerPersona()` from Phase 15 persona-router.ts       | Already built with validation and error handling                         |
| Knowledge routing      | Custom search        | `routeToKnowledge()` from Phase 15 topic-router.ts        | Already built with scoring, priority, and context carryover              |
| Prompt assembly        | Manual string concat | `buildSystemMessages()` from Phase 15 prompt-builder.ts   | Already handles cache control headers correctly                          |
| Model routing          | Custom if/else       | `detectComplexity()` from Phase 15 complexity-detector.ts | Already handles per-persona keywords, message length, conversation depth |

**Key insight:** Phase 16 is purely data/configuration. The engine (Phase 15) handles all orchestration. Persona files should contain ONLY: PersonaConfig object, knowledge content, tool definitions, and conversation starters. No pipeline logic.

## Common Pitfalls

### Pitfall 1: Static Prefix Not Byte-Identical

**What goes wrong:** Prompt caching fails silently. Every request is a cache miss, costing 2-3x more.
**Why it happens:** Inserting dynamic values (timestamps, visitor names, page context) into the static prefix string.
**How to avoid:** Static prefix is a const string. Dynamic context is injected by `buildSystemMessages()` as separate system messages without `cacheControl`.
**Warning signs:** Token usage higher than expected in Anthropic dashboard.

### Pitfall 2: Knowledge Topics Too Large

**What goes wrong:** Topic router selects top 3 topics. If each is 2000+ tokens, dynamic knowledge exceeds context budget.
**Why it happens:** Copying entire documents as topic content instead of concise, AI-digestible summaries.
**How to avoid:** Each `TopicDefinition.content` should be 200-500 tokens. SKC pattern: each section is a focused markdown snippet, not a full document.
**Warning signs:** `estimatedTokens` in `TopicRouterResult` consistently above 1500.

### Pitfall 3: Overlapping Keywords Across Topics

**What goes wrong:** Same keywords in multiple topics cause all of them to score equally, diluting relevance.
**Why it happens:** Generic keywords like "help", "more", "info" added to every topic.
**How to avoid:** Each topic gets specific, non-overlapping keywords. Use `priority` field as tiebreaker. Test with representative queries.
**Warning signs:** `routeToKnowledge()` always returns the same 3 topics regardless of query.

### Pitfall 4: Tool Names Not Matching PersonaConfig.tools

**What goes wrong:** Engine passes tools to `streamText()` but persona.tools record doesn't match, leading to "tool not available" errors from `executeToolCall`.
**Why it happens:** Tool names in persona config don't match keys in the tools record returned by `createPersonaTools`.
**How to avoid:** Use the same string constants for tool names across persona config and tool definitions. Consider exporting tool name constants.
**Warning signs:** Runtime errors about unavailable tools.

### Pitfall 5: Zod 4 Import Path

**What goes wrong:** Import errors or runtime failures with Zod schemas.
**Why it happens:** Zod 4.x changed the import structure. The project uses `import { z } from 'zod'` which resolves to Zod 4 since that is the installed version.
**How to avoid:** Use `import { z } from 'zod'` (the standard import, same as DEMO_TOOL). The project's build already works with this pattern.
**Warning signs:** Build failures mentioning Zod schema types.

### Pitfall 6: Map.forEach vs for-of

**What goes wrong:** TypeScript error about downlevelIteration.
**Why it happens:** Project tsconfig does not enable `downlevelIteration`. Phase 15 established the `Map.forEach` pattern.
**How to avoid:** Use `Map.forEach` and `array.forEach` instead of `for-of` on Maps/Sets. Regular `for` loops on arrays are fine.
**Warning signs:** tsconfig errors about iterators.

## Code Examples

### Complete Persona Config (Concierge)

```typescript
// Source: Phase 15 types.ts PersonaConfig interface
import type { PersonaConfig } from '../types'
import { registerPersona } from '../persona-router'
import { CONCIERGE_TOPICS } from '../knowledge/concierge-kb'

const STATIC_PREFIX = `You are the FMai Website Concierge, a friendly and knowledgeable AI assistant for the FMai website.

## Your Role
- Help visitors understand FMai services (AI chatbots, voice agents, automations, marketing machine)
- Answer questions about pricing, process, and capabilities
- Guide visitors to relevant pages
- Qualify leads and encourage booking a discovery call
- Adapt your greeting based on which page the visitor is on

## Communication Style
- Professional but approachable
- Concise responses (2-4 sentences per point)
- Use markdown bold for emphasis, bullets for lists
- Never use headers in chat messages
- End with a question or clear next step when relevant

## Decision Rules
- Service questions → provide clear answer + suggest booking call for specifics
- Pricing questions → share tier overview + suggest discovery call for custom quote
- Technical questions → answer at high level + suggest technical demo
- Off-topic → politely redirect to FMai services
- Complex comparisons → use Sonnet-level reasoning

## What You Do NOT Do
- Make up specific prices not in your knowledge base
- Promise specific results or timelines
- Discuss competitor products negatively
- Share internal technical implementation details`

export const conciergePersona: PersonaConfig = {
  id: 'concierge',
  name: 'Website Concierge',
  description: 'Hybrid tour guide + sales assistant on all marketing pages',
  staticPrefix: STATIC_PREFIX,
  topicDefinitions: CONCIERGE_TOPICS,
  tools: {},
  defaultModel: 'haiku',
  complexityKeywords: ['compare services', 'pricing strategy', 'ROI analysis', 'custom solution'],
  maxTokens: 500,
  temperature: 0.7,
}

registerPersona(conciergePersona)
```

### Knowledge Base Topics (E-commerce Demo)

```typescript
// Source: Phase 15 TopicDefinition interface + SKC sindy-knowledge-base.ts pattern
import type { TopicDefinition } from '../types'

const PRODUCT_CATALOG = `## Product Catalog
- **Gentle Cleansing Foam** (€24.95): For sensitive/dry skin. Sulfate-free, pH-balanced.
- **Balancing Toner** (€19.95): For oily/combination skin. Niacinamide + BHA.
- **Hydra Boost Serum** (€34.95): For all skin types. Hyaluronic acid + vitamin B5.
- **Barrier Repair Cream** (€29.95): For dry/damaged skin. Ceramides + peptides.
- **Daily SPF 50** (€27.95): For all skin types. Mineral, lightweight.
- **Glow Vitamin C Serum** (€39.95): For dull/pigmented skin. Stabilized vitamin C.
- **Acne Control Serum** (€32.95): For acne-prone skin. Salicylic acid + niacinamide.
- **Night Recovery Mask** (€36.95): For all skin types. Retinal alternative + squalane.`

export const ECOMMERCE_TOPICS: TopicDefinition[] = [
  {
    key: 'products',
    content: PRODUCT_CATALOG,
    keywords: ['product', 'products', 'buy', 'shop', 'catalog', 'what do you have', 'show me'],
    priority: 10,
  },
  // ... skin types, routines, ingredients topics
]
```

### Tool Definition (AI SDK v6 + Zod 4)

```typescript
// Source: Phase 15 DEMO_TOOL pattern + AI SDK docs
import { tool } from 'ai'
import { z } from 'zod'

export const ecommerceTools = {
  search_products: tool({
    description: 'Search the product catalog by skin concern, skin type, or product category',
    inputSchema: z.object({
      query: z.string().optional().describe('Free text search query'),
      skinType: z
        .enum(['dry', 'oily', 'combination', 'normal', 'sensitive'])
        .optional()
        .describe('Filter by skin type'),
      concern: z.string().optional().describe('Skin concern like acne, dryness, pigmentation'),
      limit: z.number().min(1).max(5).default(3).describe('Number of results to return'),
    }),
    execute: async ({ query, skinType, concern, limit }) => {
      // Filter mock catalog based on inputs, return matching products
      return { products: filterProducts(query, skinType, concern, limit) }
    },
  }),
  // ... more tools
}
```

## State of the Art

| Old Approach            | Current Approach                      | When Changed       | Impact                                                         |
| ----------------------- | ------------------------------------- | ------------------ | -------------------------------------------------------------- |
| Zod 3 `z.object()`      | Zod 4 `z.object()` (same API surface) | Zod 4 release 2025 | Import path unchanged, API compatible for basic object schemas |
| AI SDK `parameters`     | AI SDK `inputSchema`                  | AI SDK v6          | Phase 15 already uses `inputSchema` in DEMO_TOOL               |
| `for-of` iteration      | `Map.forEach` / `array.forEach`       | Phase 15 decision  | Avoids downlevelIteration tsconfig requirement                 |
| ARIA OpenAI GPT-4o-mini | Claude Haiku/Sonnet via AI SDK        | Phase 15           | Streaming, tool calling, prompt caching all improved           |

**Deprecated/outdated:**

- ARIA's `assistantJourneys.ts`, `pageContext.ts`, `useModuleFollowUp.ts`, `platformKnowledge.ts`: Content will be migrated into demo-guide persona config and knowledge base. The old files remain until Phase 19 cleanup.
- AI SDK `parameters` field: Renamed to `inputSchema` in v6. Phase 15 already follows the new convention.

## Open Questions

1. **PersonaConfig.tools field usage**
   - What we know: The `PersonaConfig.tools` field is typed as `Record<string, unknown>`. The engine uses `createPersonaTools(persona)` to get actual tool definitions, not `persona.tools` directly.
   - What's unclear: Whether `persona.tools` should store tool metadata, or be left empty and rely entirely on `createPersonaTools` for tool resolution.
   - Recommendation: Store tool name strings in `persona.tools` for validation purposes (used by `executeToolCall` to check availability). The actual `tool()` objects come from `createPersonaTools`. This matches the existing check `if (!(toolName in persona.tools))` in tool-executor.ts.

2. **Conversation starters delivery mechanism**
   - What we know: Phase 17 (ChatWidget UI) needs conversation starters per persona per language. CONTEXT.md specifies EN/NL/ES starters.
   - What's unclear: Exactly how Phase 17 will consume them (import from persona config? API response?).
   - Recommendation: Export starters as typed record objects from persona files. Phase 17 can import them directly. If API delivery is needed later, add a lightweight endpoint.

3. **Demo Guide knowledge base content freshness**
   - What we know: ARIA's `platformKnowledge.ts` has detailed module descriptions, pricing, and ROI data. Some values may be outdated (references "Q1 2025").
   - What's unclear: Whether all the FMai service/pricing data is current.
   - Recommendation: Extract and modernize relevant content from `platformKnowledge.ts` into demo-guide knowledge base. Flag pricing/ROI numbers for user review.

## Sources

### Primary (HIGH confidence)

- Phase 15 source code: `src/lib/chatbot/types.ts`, `persona-router.ts`, `tool-executor.ts`, `prompt-builder.ts`, `topic-router.ts`, `engine.ts` -- interfaces and patterns that Phase 16 must conform to
- Phase 15 DEMO_TOOL in `tool-executor.ts` -- verified working pattern for AI SDK v6 `tool()` + Zod 4 `inputSchema`
- SKC Sindy code: `sindy-knowledge-base.ts`, `sindy-system.ts`, `platform-tools.ts`, `webshop-tools.ts` -- production patterns for knowledge bases, system prompts, and tool implementations
- ARIA code: `assistantJourneys.ts`, `pageContext.ts`, `platformKnowledge.ts`, `useModuleFollowUp.ts` -- content and patterns to migrate into demo-guide persona
- 16-CONTEXT.md -- all 5 persona specifications with tools, knowledge, and i18n requirements

### Secondary (MEDIUM confidence)

- AI SDK v6 tool documentation: https://ai-sdk.dev/docs/foundations/tools -- tool() function API
- AI SDK v6 migration guide: https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0 -- inputSchema rename
- Zod 4 + AI SDK compatibility: https://github.com/vercel/ai/issues/7291 -- confirmed working in current versions

### Tertiary (LOW confidence)

- None -- all findings verified against existing project code

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - no new dependencies, all libraries already in use and verified by Phase 15
- Architecture: HIGH - all interfaces defined by Phase 15, patterns verified against SKC production code
- Pitfalls: HIGH - derived from actual Phase 15 decisions (Map.forEach, inputSchema, prompt caching) and SKC production experience (topic sizing, keyword overlap)

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable -- all dependencies are locked and working)
