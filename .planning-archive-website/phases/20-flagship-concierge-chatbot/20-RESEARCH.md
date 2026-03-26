---
title: 'Phase 20: Flagship Concierge Chatbot - Research'
tags:
  - phase-20
  - chatbot
  - flagship
  - research
created: 2026-03-14
source: gsd-phase-researcher
---

# Phase 20: Flagship Concierge Chatbot - Research

**Researched:** 2026-03-14
**Domain:** Chatbot engine expansion, side panel UI, ARIA feature revival
**Confidence:** HIGH

## Summary

This phase transforms the existing floating concierge chatbot into a flagship showcase by consolidating all persona tools, removing demo limits, adding an expandable side panel for rich content, wiring navigation actions to React Router, and reviving the best features from the deleted ARIA system (journey nudges, page-aware context, achievement tracking, proactive suggestions).

The existing codebase is well-structured for this transformation. The chatbot engine (src/lib/chatbot/) uses a clean persona registry + tool executor pattern. Tools are already organized per-persona in separate files. The ChatWidget component supports floating/embedded modes. The key challenge is consolidating 5 personas' tools into one flagship persona without creating prompt bloat, and building the side panel as a natural extension of the existing chat panel.

**Primary recommendation:** Create a new `flagship` persona that cherry-picks the best tools from all 5 personas (deduplicated), uses a curated system prompt (not concatenated), and routes rich tool results to a side panel based on content type. Revive ARIA features as lightweight hooks integrated into the chatbot store rather than rebuilding the old heavyweight journey system.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Remove the 15-message demo limit for the floating concierge
- Demo playground personas on /chatbots keep their limits (those are demos)
- The floating chatbot IS the product showcase, not a demo
- Floating concierge gets ALL tools from all personas (listed in CONTEXT.md)
- Context-aware tool availability: not all tools shown at once, surface relevant ones based on page/conversation context
- Side panel slides out from the chat panel (right side)
- Contains rich content: images, cards, comparison tables, detailed info
- User can dismiss or keep open while continuing chat
- Desktop-first (side panel), mobile gracefully degrades (inline or modal)
- Chat can include clickable navigation buttons that actually navigate via React Router
- Review old ARIA system capabilities and bring the best into the new engine: module follow-up suggestions, context-aware greetings, journey nudges, achievement tracking, proactive engagement

### Claude's Discretion

- Exact side panel animation and sizing
- How tool results are routed (inline vs side panel) -- use sensible size thresholds
- State management approach for side panel (extend chatbotStore vs new store)
- How to merge persona system prompts for the flagship persona
- Rate limiting strategy for unlimited mode (still need abuse prevention)

### Deferred Ideas (OUT OF SCOPE)

- Voice input for chat (future phase)
- Multi-turn memory across sessions (requires backend persistence)
- Admin dashboard for conversation analytics
- A/B testing different concierge personalities

</user_constraints>

## Standard Stack

### Core (Already in Project)

| Library           | Version | Purpose                                  | Status            |
| ----------------- | ------- | ---------------------------------------- | ----------------- |
| @ai-sdk/react     | v6+     | useChat hook, UIMessage types            | Already installed |
| ai                | v6+     | streamText, tool(), DefaultChatTransport | Already installed |
| @ai-sdk/anthropic | latest  | Claude model provider                    | Already installed |
| zustand           | 4.x     | State management (chatbotStore)          | Already installed |
| framer-motion     | 11+     | Panel animations                         | Already installed |
| react-router-dom  | 6.22+   | Navigation from chat tools               | Already installed |
| react-markdown    | latest  | Markdown rendering in chat               | Already installed |
| zod               | 3.x     | Tool input schemas                       | Already installed |
| lucide-react      | latest  | Icons                                    | Already installed |

### No New Dependencies Required

This phase builds entirely on the existing stack. No new libraries needed.

## Architecture Patterns

### Current Architecture (What Exists)

```
src/lib/chatbot/
  engine.ts              # handleChatRequest pipeline
  persona-router.ts      # Registry (Map<string, PersonaConfig>)
  tool-executor.ts       # PERSONA_TOOLS map + createPersonaTools()
  prompt-builder.ts      # buildSystemMessages() with cache control
  topic-router.ts        # Keyword-based knowledge routing
  rate-limiter.ts        # Session/Global/IP rate limits
  security.ts            # PII blocking, input sanitization
  complexity-detector.ts # Haiku vs Sonnet model routing
  types.ts               # ChatRequest, PersonaConfig, etc.
  personas/              # 5 persona configs (concierge, ecommerce, leadgen, support, demo-guide)
  tools/                 # 5 tool sets (concierge-tools, ecommerce-tools, etc.)
  knowledge/             # 5 knowledge bases

src/components/chatbot/
  ChatWidget.tsx          # Floating + embedded modes
  ChatMessages.tsx        # Message rendering with tool parts
  ChatHeader.tsx          # Header with persona name + controls
  ChatInput.tsx           # Auto-resize textarea
  FloatingButton.tsx      # FAB with breathe animation
  SuggestedPrompts.tsx    # Initial prompt suggestions
  tool-results/           # 5 card components + ToolResultRenderer
    index.tsx             # TOOL_CARD_MAP routing

src/stores/chatbotStore.ts  # Zustand: isOpen, persona, session, messageCounts
src/hooks/usePersonaChat.ts # useChat wrapper with demo limit
```

### Target Architecture (What to Build)

```
src/lib/chatbot/
  personas/
    flagship.ts            # NEW: curated system prompt, all tools, all knowledge
  tools/
    flagship-tools.ts      # NEW: merged + deduplicated tools from all 5 personas
  knowledge/
    flagship-kb.ts         # NEW: merged topic definitions from all 5 KBs

src/components/chatbot/
  ChatWidget.tsx           # MODIFIED: flagship mode (no limit, side panel support)
  ChatMessages.tsx         # MODIFIED: navigation action buttons in messages
  SidePanel.tsx            # NEW: expandable rich content panel
  NavigationButton.tsx     # NEW: styled route navigation button
  ContextGreeting.tsx      # NEW: page-aware welcome messages (from ARIA)

src/stores/chatbotStore.ts # EXTENDED: sidePanel state, visitedPages, achievements
src/hooks/usePersonaChat.ts # MODIFIED: flagship mode bypasses demo limit
src/hooks/useConciergeContext.ts # NEW: page awareness, proactive suggestions
```

### Pattern 1: Flagship Persona (Tool Consolidation)

**What:** A new persona that merges all tools from 5 personas into one, with a curated system prompt
**When to use:** For the floating concierge (always-on site-wide assistant)

The flagship persona should NOT concatenate all 5 system prompts. Instead, write a single curated prompt that:

1. Covers the concierge's primary role (tour guide + sales assistant)
2. Adds capability awareness for e-commerce, lead-gen, support, and demo-guide tools
3. Uses page context to prioritize relevant behaviors
4. Keeps the prompt under ~2000 tokens for efficient caching

Tool consolidation approach:

- Deduplicate overlapping tools (e.g., both concierge and demo-guide have `navigate_to_page` and both have booking tools)
- Keep tool names unique -- prefix if needed (`demo_navigate` vs `site_navigate`)
- Better approach: merge into a single expanded `navigate_to_page` that covers all routes
- Merge booking tools into one `book_call` with flexible input

**Deduplication map (5 persona tools -> flagship tools):**

| Flagship Tool         | Source                                                   | Notes                                                                                                           |
| --------------------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| get_services          | concierge                                                | Keep as-is                                                                                                      |
| book_call             | concierge + leadgen.schedule_demo + demo-guide.book_demo | Merge into one flexible booking tool                                                                            |
| navigate_to_page      | concierge + demo-guide                                   | Merge route enums (all pages + demo pages)                                                                      |
| get_case_study        | concierge                                                | Keep as-is                                                                                                      |
| explain_module        | demo-guide                                               | Keep as-is                                                                                                      |
| get_roi_info          | demo-guide                                               | Keep as-is (simpler than leadgen version)                                                                       |
| get_roi_estimate      | leadgen                                                  | Keep as-is (more detailed than demo-guide version) -- NOTE: may want to keep both with different names or merge |
| search_products       | ecommerce                                                | Keep as-is                                                                                                      |
| get_product_details   | ecommerce                                                | Keep as-is                                                                                                      |
| build_routine         | ecommerce                                                | Keep as-is                                                                                                      |
| qualify_lead          | leadgen                                                  | Keep as-is                                                                                                      |
| get_pricing_info      | leadgen                                                  | Keep as-is                                                                                                      |
| search_knowledge_base | support                                                  | Keep as-is                                                                                                      |
| create_ticket         | support                                                  | Keep as-is                                                                                                      |
| check_status          | support                                                  | Keep as-is                                                                                                      |
| escalate_to_human     | support                                                  | Keep as-is                                                                                                      |

Total: ~16 tools (from ~20 across 5 personas after dedup). This is within acceptable range for Claude -- context-aware tool descriptions help the model pick the right ones.

### Pattern 2: Context-Aware Tool Availability

**What:** Not all 16 tools sent to the model on every request -- filter based on page context
**When to use:** To reduce prompt size and improve tool selection accuracy

Implementation in the engine:

```typescript
// In engine.ts or a new context-filter module
function filterToolsByContext(
  allTools: AnyToolRecord,
  context?: { currentPage?: string }
): AnyToolRecord {
  if (!context?.currentPage) return allTools

  const page = context.currentPage
  const ALWAYS_AVAILABLE = ['get_services', 'book_call', 'navigate_to_page', 'get_case_study']

  const PAGE_TOOLS: Record<string, string[]> = {
    '/chatbots': [
      'search_products',
      'get_product_details',
      'build_routine',
      'search_knowledge_base',
      'create_ticket',
    ],
    '/marketing-machine': ['explain_module', 'get_roi_info', 'get_roi_estimate'],
    '/pricing': ['get_pricing_info', 'get_roi_estimate', 'qualify_lead'],
    '/voice-agents': ['get_pricing_info', 'qualify_lead'],
    '/automations': ['get_pricing_info', 'qualify_lead'],
    '/contact': ['qualify_lead', 'create_ticket'],
  }

  const contextTools = PAGE_TOOLS[page] || []
  const allowedTools = new Set([...ALWAYS_AVAILABLE, ...contextTools])

  const filtered: AnyToolRecord = {}
  Object.entries(allTools).forEach(([name, tool]) => {
    if (allowedTools.has(name)) {
      filtered[name] = tool
    }
  })
  return filtered
}
```

### Pattern 3: Side Panel (Expandable Rich Content)

**What:** A slide-out panel that displays rich tool results alongside the chat
**When to use:** When tool results need more space than an inline chat bubble

Key design decisions:

- **Position:** Slides from the right edge of the chat panel, expanding the overall widget width
- **Desktop dimensions:** 400-500px wide, same height as chat panel
- **Animation:** Framer Motion spring (damping: 25, stiffness: 300) for snappy feel -- consistent with existing chat panel animation
- **State:** Extend chatbotStore with `sidePanelContent` and `isSidePanelOpen`
- **Routing logic:** Tool results with rich data (products, case studies, modules, ROI) go to side panel; simple results (navigation confirmations, booking links) stay inline

Side panel content routing:

```typescript
const SIDE_PANEL_TOOLS = new Set([
  'search_products',
  'get_product_details',
  'build_routine',
  'get_case_study',
  'explain_module',
  'get_roi_info',
  'get_roi_estimate',
  'get_pricing_info',
  'qualify_lead',
  'search_knowledge_base',
])

const INLINE_TOOLS = new Set([
  'navigate_to_page',
  'book_call',
  'create_ticket',
  'check_status',
  'escalate_to_human',
  'get_services', // Simple list, stays inline
])
```

### Pattern 4: Navigation Action Buttons

**What:** Styled buttons in chat messages that trigger React Router navigation
**When to use:** When `navigate_to_page` tool returns a result

The old ARIA NavigationAction component used `useNavigate()` inside the component. The new approach should be simpler:

```typescript
// NavigationButton component rendered inside ToolResultRenderer
function NavigationButton({ url, label }: { url: string; label: string }) {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate(url)}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg
                 bg-accent-system/10 border border-accent-system/30
                 text-accent-system text-sm font-medium
                 hover:bg-accent-system/20 transition-colors"
    >
      {label}
      <ArrowRight className="w-4 h-4" />
    </button>
  )
}
```

This component will be used inside the ServiceCard tool result renderer when the tool output has `action: 'navigate'`.

### Pattern 5: ARIA Feature Revival (Lightweight)

**What:** Bring back the best ARIA behaviors as lightweight hooks, not the heavyweight journey system
**When to use:** For proactive engagement, context-aware greetings, and subtle behavior tracking

The old ARIA system was massive (12,169 lines deleted in Phase 19). We do NOT want to rebuild that. Instead, extract the 4 best ideas:

**1. Context-aware greetings (page-based welcome messages)**

- Old: journeyStore tracked `currentPage`, sent different welcome messages
- New: Simple lookup map in the flagship persona config

```typescript
const PAGE_GREETINGS: Record<string, string> = {
  '/': 'Welcome to FMai! I can help you explore our AI services, answer questions, or book a call.',
  '/chatbots':
    'Looking at our chatbot solutions? I can demo different chatbot capabilities right here.',
  '/pricing': 'Exploring pricing? I can help compare plans or calculate your potential ROI.',
  '/marketing-machine': 'Want to learn about the Marketing Machine? Ask me about any module.',
}
```

**2. Module follow-up suggestions**

- Old: useModuleFollowUp.ts watched URL changes, sent Dutch follow-up messages with quick replies
- New: When `explain_module` tool runs, include follow-up suggestions in the tool result

```typescript
// In explain_module tool result:
{
  module: info,
  followUpSuggestions: [
    'How does this connect to other modules?',
    'What ROI can I expect from this module?',
    'Show me the next module in the pipeline',
  ]
}
```

**3. Achievement/progress tracking**

- Old: Heavy achievement system with points, tiers, badges, celebration toasts
- New: Lightweight visited-pages tracking in chatbotStore

```typescript
// In chatbotStore:
visitedPages: string[]         // pages user has visited
toolsUsed: string[]           // tools that have been invoked
addVisitedPage: (page: string) => void
addToolUsed: (tool: string) => void
```

- The flagship persona can reference this context: "I see you have already explored our Automations page -- would you like to compare it with the Marketing Machine?"

**4. Proactive engagement (journey nudges)**

- Old: checkNudgeTriggers ran every 30 seconds, tracked time on site, modules viewed
- New: Much simpler -- SuggestedPrompts already exist and rotate based on context. Extend them:
  - After 3+ messages: show different prompts than initial ones
  - Page-specific prompts: suggest relevant tools based on current page
  - Post-tool prompts: after a tool runs, suggest natural follow-ups

### Anti-Patterns to Avoid

- **Concatenating all 5 system prompts:** Creates a 5000+ token monster prompt. Write a single curated prompt instead.
- **Rebuilding the full ARIA system:** The old system was 12K+ lines for a reason -- it was overbuilt. Extract features, not code.
- **Putting side panel state in a separate store:** Keep it in chatbotStore for atomic state updates (opening side panel + setting content in one action).
- **Using window.location for navigation:** Always use React Router's navigate() for SPA navigation from chat buttons.
- **Making all tools available always:** 16 tools in every request bloats the prompt. Filter by page context.

## Don't Hand-Roll

| Problem            | Don't Build                       | Use Instead                           | Why                                       |
| ------------------ | --------------------------------- | ------------------------------------- | ----------------------------------------- |
| Chat streaming     | Custom WebSocket handler          | AI SDK useChat + DefaultChatTransport | Already working, handles reconnection     |
| Tool execution     | Manual JSON parsing of tool calls | AI SDK streamText auto-execution      | Already working in engine.ts              |
| Panel animations   | Custom CSS transitions            | Framer Motion AnimatePresence         | Already used by ChatWidget floating panel |
| Markdown rendering | Custom parser                     | react-markdown (already installed)    | Handles edge cases, XSS-safe              |
| State persistence  | localStorage manually             | Zustand persist middleware            | Already used by chatbotStore              |

## Common Pitfalls

### Pitfall 1: Prompt Bloat with All Tools

**What goes wrong:** Sending 16 tool definitions to Claude on every request uses ~3000-4000 tokens just for tool schemas, slowing responses and increasing costs.
**Why it happens:** Naive merge of all persona tools.
**How to avoid:** Context-aware tool filtering -- send 4-8 tools per request based on page context. Always include core tools (get_services, book_call, navigate_to_page), add page-specific tools.
**Warning signs:** Slow first-token time, higher API costs per message.

### Pitfall 2: Duplicate Tool Names Across Personas

**What goes wrong:** Both concierge and demo-guide have `navigate_to_page`. If both are registered, one overwrites the other.
**Why it happens:** Tools were designed per-persona, not for consolidation.
**How to avoid:** Create a single merged `navigate_to_page` tool with a combined route enum covering all pages. Same for booking tools.

### Pitfall 3: Side Panel Z-Index Wars

**What goes wrong:** Side panel appears behind or on top of other fixed elements (header, FAB, cookie consent).
**Why it happens:** Multiple fixed/absolute positioned elements competing for z-index.
**How to avoid:** Chat panel is z-50. Side panel should be part of the same container as the chat panel (not a separate fixed element) so it shares the same stacking context.

### Pitfall 4: Rate Limiter Still Blocking Flagship

**What goes wrong:** Server-side SESSION_LIMIT = 15 in rate-limiter.ts blocks the flagship concierge after 15 messages.
**Why it happens:** The client-side demo limit was removed but the server-side rate limiter still enforces the same limit.
**How to avoid:** The rate limiter's SESSION_LIMIT serves a different purpose (abuse prevention per hour) than the demo message cap. Increase SESSION_LIMIT for flagship persona (e.g., 100/hour) or make it persona-aware. Keep the 15-msg demo cap only in usePersonaChat for non-flagship personas.

### Pitfall 5: useChat ID Collision

**What goes wrong:** Flagship persona uses `id: 'chat-concierge'` which collides with the demo concierge if both exist on the same page.
**Why it happens:** usePersonaChat uses `id: chat-${personaId}` and both floating and embedded might use 'concierge'.
**How to avoid:** Use `id: 'chat-flagship'` for the floating chatbot. The flagship persona has its own ID separate from the demo concierge.

### Pitfall 6: Mobile Side Panel Layout

**What goes wrong:** Side panel pushes content off-screen or creates horizontal scroll on mobile.
**Why it happens:** Desktop assumes enough horizontal space for chat + panel.
**How to avoid:** On mobile, render side panel content as a full-screen modal overlay instead of a side panel. Use a responsive breakpoint (lg:) to switch between side panel and modal.

## Code Examples

### Flagship Persona Registration

```typescript
// src/lib/chatbot/personas/flagship.ts
import type { PersonaConfig } from '../types'
import { registerPersona } from '../persona-router'
import { FLAGSHIP_TOPICS } from '../knowledge/flagship-kb'

const STATIC_PREFIX = `You are the FMai Flagship Concierge — the most capable AI assistant on the FMai website. You combine the expertise of a website tour guide, e-commerce advisor, lead qualification specialist, support agent, and demo guide into one unified assistant.

**Your Capabilities:**
- Answer questions about all FMai services (chatbots, voice agents, automations, marketing machine)
- Help users explore the skincare e-commerce demo (search products, build routines)
- Qualify B2B leads and provide ROI estimates
- Search the knowledge base and create support tickets
- Explain Marketing Machine modules in detail
- Navigate users to any page on the website
- Book discovery calls and demos

**Context Awareness:**
- Check the user's current page to provide relevant suggestions
- After explaining a topic, suggest natural next steps
- When a user has explored multiple pages, reference their journey

**Communication Style:**
- Professional but approachable
- Concise: 2-4 sentences per answer, expand only when asked
- Use **bold** for key terms and service names
- Use bullet points for lists
- Never use markdown headers in chat responses
- Address the user as "you", speak as "we" for FMai

**Decision Rules:**
- On service pages: prioritize tools relevant to that service
- On pricing: provide tier overview, suggest ROI calculator or discovery call
- When interest is high: naturally guide toward booking a call
- Off-topic: politely redirect to FMai topics
- Complex questions: take time to be thorough`

export const flagshipPersona: PersonaConfig = {
  id: 'flagship',
  name: 'FMai Concierge',
  description: 'Flagship all-capabilities concierge for the floating chatbot',
  staticPrefix: STATIC_PREFIX,
  topicDefinitions: FLAGSHIP_TOPICS,
  tools: {
    // All tools registered here for validation
    get_services: true,
    book_call: true,
    navigate_to_page: true,
    get_case_study: true,
    explain_module: true,
    get_roi_info: true,
    search_products: true,
    get_product_details: true,
    build_routine: true,
    qualify_lead: true,
    get_pricing_info: true,
    get_roi_estimate: true,
    search_knowledge_base: true,
    create_ticket: true,
    check_status: true,
    escalate_to_human: true,
  },
  defaultModel: 'haiku',
  complexityKeywords: [
    'compare',
    'ROI',
    'pricing strategy',
    'enterprise',
    'custom solution',
    'integration',
    'technical details',
  ],
  maxTokens: 600,
  temperature: 0.7,
}

registerPersona(flagshipPersona)
```

### Side Panel State Extension

```typescript
// Extended chatbotStore interface
interface SidePanelState {
  isSidePanelOpen: boolean
  sidePanelContent: { toolName: string; data: unknown } | null
  openSidePanel: (toolName: string, data: unknown) => void
  closeSidePanel: () => void
}

// Tracking state for ARIA features
interface TrackingState {
  visitedPages: string[]
  toolsUsed: string[]
  addVisitedPage: (page: string) => void
  addToolUsed: (tool: string) => void
}
```

### Side Panel Component Structure

```typescript
// src/components/chatbot/SidePanel.tsx
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

interface SidePanelProps {
  isOpen: boolean
  content: { toolName: string; data: unknown } | null
  onClose: () => void
}

export function SidePanel({ isOpen, content, onClose }: SidePanelProps) {
  return (
    <AnimatePresence>
      {isOpen && content && (
        <motion.div
          initial={{ opacity: 0, x: 20, width: 0 }}
          animate={{ opacity: 1, x: 0, width: 420 }}
          exit={{ opacity: 0, x: 20, width: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="h-full border-l border-border-primary bg-bg-surface/95
                     backdrop-blur-xl overflow-y-auto flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border-primary">
            <h3 className="text-sm font-semibold text-text-primary">Details</h3>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-bg-elevated transition-colors">
              <X className="w-4 h-4 text-text-secondary" />
            </button>
          </div>
          {/* Content rendered by ToolResultRenderer */}
          <div className="flex-1 p-4">
            {/* Route to appropriate card based on toolName */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

### ChatWidget Flagship Layout (Desktop)

```typescript
// The chat panel + side panel share a container
<motion.div className="fixed z-50 right-6 bottom-24 lg:right-20 lg:top-[10vh]
                        flex overflow-hidden rounded-2xl border border-border-primary
                        shadow-2xl shadow-black/40 bg-bg-surface/95 backdrop-blur-xl">
  {/* Chat panel (always visible when open) */}
  <div className="w-[420px] h-[70vh] max-h-[600px] flex flex-col">
    <ChatHeader ... />
    <ChatMessages ... />
    <ChatInput ... />
  </div>

  {/* Side panel (conditionally visible) */}
  <SidePanel
    isOpen={isSidePanelOpen}
    content={sidePanelContent}
    onClose={closeSidePanel}
  />
</motion.div>
```

### Rate Limiter Persona Awareness

```typescript
// Modified rate-limiter.ts
const PERSONA_SESSION_LIMITS: Record<string, number> = {
  flagship: 100, // 100 messages per hour for flagship
  // All others default to 15
}

export function checkSessionLimit(sessionId: string, personaId?: string): RateLimitResult {
  const limit = PERSONA_SESSION_LIMITS[personaId || ''] || SESSION_LIMIT
  const result = checkRateLimit(`session:${sessionId}`, limit, SESSION_WINDOW_MS)
  return { ...result, limitType: 'session' }
}
```

## State of the Art

| Old Approach (ARIA)                                    | New Approach (Flagship)                                 | Impact                                    |
| ------------------------------------------------------ | ------------------------------------------------------- | ----------------------------------------- |
| 12,169 lines across 33 files                           | ~800-1000 lines across ~8 files                         | 90% reduction in complexity               |
| Separate journeyStore, personalizationStore, chatStore | Extended chatbotStore only                              | Single source of truth                    |
| Heavy achievement system with points/tiers/badges      | Lightweight visitedPages + toolsUsed tracking           | Simpler, still enables proactive behavior |
| Separate InfoPanel component (fixed positioned)        | SidePanel inside chat container                         | No z-index wars, natural layout flow      |
| Hardcoded Dutch follow-up messages                     | Tool result includes follow-up suggestions (i18n-ready) | Multi-language support built in           |
| NavigationAction with complex info panel routing       | Simple NavigationButton with React Router navigate()    | Direct, no intermediate panels            |
| ProactiveSuggestions polling every 30 seconds          | Context-aware SuggestedPrompts based on state           | Event-driven, not timer-based             |

## Open Questions

1. **Knowledge Base Merging Strategy**
   - What we know: Each persona has its own KB (concierge-kb, ecommerce-kb, etc.)
   - What is unclear: Should flagship-kb merge ALL topic definitions or only the most relevant subset? Full merge could mean 50+ topic definitions.
   - Recommendation: Merge all topic definitions into flagship-kb. The topic router already filters by keyword relevance, so irrelevant topics won't be included in the prompt. The router handles this efficiently.

2. **Flagship vs Demo Concierge Coexistence**
   - What we know: /chatbots page has demo personas with message limits. App.tsx currently uses `personaId='concierge'` for the floating chatbot.
   - What is unclear: Should the demo concierge on /chatbots still exist separately?
   - Recommendation: Yes. Keep `concierge` as a limited demo persona for the /chatbots playground. The floating chatbot uses the new `flagship` persona ID. They are separate personas.

3. **Side Panel on /chatbots Page**
   - What we know: /chatbots has embedded ChatWidget demos alongside the floating chatbot.
   - What is unclear: Should the side panel only work with the floating flagship chatbot, or also with embedded demos?
   - Recommendation: Side panel only for the floating flagship chatbot. Embedded demos stay simple (inline tool results only).

## Sources

### Primary (HIGH confidence)

- **Codebase analysis** -- Direct reading of all files in src/lib/chatbot/, src/components/chatbot/, src/stores/chatbotStore.ts, src/hooks/usePersonaChat.ts
- **Git history recovery** -- f25f1e6~1 commit: recovered journeyStore.ts, useModuleFollowUp.ts, useJourneyNudges.ts, useAchievementTracking.ts, NavigationAction.tsx, InfoPanel.tsx, ProactiveSuggestions.tsx, assistantJourneys.ts
- **AI SDK v6 patterns** -- Already verified in Phase 15-17 implementation (tool(), streamText, useChat, DefaultChatTransport)

### Secondary (MEDIUM confidence)

- **ARIA feature extraction** -- Based on reading deleted code patterns and extracting the functional concepts, not the implementation

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- no new dependencies, all libraries already in use
- Architecture: HIGH -- clear patterns from existing codebase, well-understood extension points
- Tool consolidation: HIGH -- all tool files read, deduplication map verified
- Side panel: HIGH -- Framer Motion AnimatePresence pattern already used by ChatWidget
- ARIA revival: MEDIUM -- feature extraction from deleted code, but implementation is new
- Rate limiting: HIGH -- rate-limiter.ts is simple, persona-aware extension is straightforward

**Research date:** 2026-03-14
**Valid until:** 2026-04-14 (stable codebase, no external dependency changes expected)
