# Phase 19: Homepage Concierge + Demo Guide + ARIA Cleanup - Research

**Researched:** 2026-03-13
**Domain:** React component wiring, route-based persona switching, legacy code removal
**Confidence:** HIGH

## Summary

Phase 19 is primarily an integration and cleanup phase. The heavy lifting (chatbot engine, personas, ChatWidget UI, demo playground) was completed in Phases 15-18. This phase wires the existing `ChatWidget` component in floating mode onto marketing and demo pages with route-based persona switching, then removes all old ARIA code.

The main technical challenge is not building new things -- it is safely removing the old ARIA system without breaking non-ARIA functionality that shares stores and hooks. Several files outside the ARIA tree import from `journeyStore`, `personalizationStore`, and `useCalendlyBooking` -- these must be preserved or refactored.

**Primary recommendation:** Execute in 3 plans: (1) Wire ChatWidget floating mode with route-based persona switching in App.tsx, (2) Port demo-guide page-context behaviors (module follow-up, journey nudges) into the new system, (3) Systematic ARIA removal with dependency-safe deletion order.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

**Route-Based Persona Switching:**

- Marketing pages (/, /pricing, /about, /chatbots, /automations, /voice-agents, /marketing-machine, /how-it-works, /contact) use concierge persona
- Demo pages (/explorer, /calculator, /dashboard, /demo) use demo-guide persona

**Concierge Behavior:**

- Floating widget (FAB + panel)
- Context-aware greetings based on current page (homepage, pricing, service page variants)

**Demo Guide Behavior (preserves key ARIA behaviors):**

- Floating widget with proactive opening
- Page-context greetings (explorer, calculator, dashboard specific)
- Module follow-up messages when user closes a module modal in /explorer
- Journey nudges based on time/modules viewed
- Progressive guidance: Explore -> Calculate -> Book Demo

**Implementation in App.tsx:**

- Replace `<AIJourneyAssistant />` with `<ChatWidget mode="floating" personaId={isDemoPage ? 'demo-guide' : 'concierge'} pageContext={{ pathname: location.pathname }} />`

**Files to Remove:** Complete list specified in CONTEXT.md (components/ai-assistant/\*, services/llmService, utils/conversationEngine, utils/intentRecognition, utils/questionMatcher, utils/chatNavigationHelpers, stores/chatStore, stores/journeyStore, stores/personalizationStore (if ARIA-only), types/chat, config/knowledgeBase.json, config/conversationPersonality, config/platformKnowledge, config/assistantJourneys, config/moduleExplanations, hooks/useModuleFollowUp, hooks/useJourneyNudges, hooks/useAchievementTracking, api/chat.ts)

**Reference behaviors before deleting:** assistantJourneys.ts, pageContext.ts, useModuleFollowUp.ts, useJourneyNudges.ts, conversationPersonality.ts

### Claude's Discretion

- How to implement page-context passing to the chatbot engine (ChatWidget prop vs useLocation inside widget vs API body context)
- How to port module follow-up and journey nudge behaviors into the new chatbot system
- Whether to keep `personalizationStore` (it has non-ARIA consumers) or refactor its consumers
- Whether to keep `FloatingElementContext` (only used by ARIA + StrategicCTA)
- Deletion order for safe cleanup

### Deferred Ideas (OUT OF SCOPE)

- None specified
  </user_constraints>

<phase_requirements>

## Phase Requirements

| ID                    | Description                                                                             | Research Support                                                                                                                       |
| --------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| REQ-CHATBOT-CONCIERGE | Wire concierge persona as floating chatbot on marketing pages, demo-guide on demo pages | ChatWidget already built with floating mode; concierge + demo-guide personas registered; route detection pattern identified in App.tsx |
| REQ-ARIA-CLEANUP      | Remove all old ARIA code and OpenAI dependencies                                        | Full file inventory mapped; dependency graph analyzed showing shared stores need careful handling                                      |

</phase_requirements>

## Standard Stack

### Core (Already Built)

| Library            | Version  | Purpose                           | Status                        |
| ------------------ | -------- | --------------------------------- | ----------------------------- |
| ChatWidget         | Phase 17 | Floating + embedded chat UI       | Ready, needs pageContext prop |
| usePersonaChat     | Phase 17 | Per-persona chat hook with AI SDK | Ready                         |
| chatbotStore       | Phase 17 | Zustand store for chat UI state   | Ready                         |
| concierge persona  | Phase 16 | System prompt, tools, knowledge   | Ready                         |
| demo-guide persona | Phase 16 | System prompt, tools, knowledge   | Ready                         |
| api/chatbot.ts     | Phase 15 | Streaming API endpoint            | Ready                         |

### Supporting (Already in package.json)

| Library                         | Purpose                               | Notes                          |
| ------------------------------- | ------------------------------------- | ------------------------------ |
| @ai-sdk/react (useChat)         | Client-side chat hook                 | Already used by usePersonaChat |
| zustand                         | State management                      | chatbotStore already created   |
| react-router-dom (useLocation)  | Route detection for persona switching | Already imported in App.tsx    |
| framer-motion (AnimatePresence) | Panel open/close animation            | Already used in ChatWidget     |

### To Remove

| Package     | Reason                                                             |
| ----------- | ------------------------------------------------------------------ |
| openai      | Not in package.json (already removed or never added as direct dep) |
| api/chat.ts | Old OpenAI proxy endpoint, replaced by api/chatbot.ts              |

**Note:** `openai` package was NOT found in package.json. It may have been removed already or was never a direct dependency. Verify at cleanup time.

## Architecture Patterns

### Pattern 1: Route-Based Persona Switching in App.tsx

**What:** Replace `<AIJourneyAssistant />` with `<ChatWidget>` using pathname-based persona ID selection.

**Current state (App.tsx line 182):**

```typescript
<AIJourneyAssistant />
```

**Target state:**

```typescript
const isDemoPage = ['/explorer', '/calculator', '/dashboard', '/demo'].some(
  p => location.pathname.startsWith(p)
)

<ChatWidget
  mode="floating"
  personaId={isDemoPage ? 'demo-guide' : 'concierge'}
  pageContext={{ pathname: location.pathname }}
/>
```

**Key consideration:** `location` is already available in App.tsx via `useLocation()` (line 82). The `marketingPaths` array (line 98) already classifies routes but uses exact match. Demo pages are the inverse (`isDemoRoute`). Use startsWith for demo page detection to match CONTEXT.md.

### Pattern 2: Page Context Passing

**What:** Pass current page pathname to ChatWidget so the persona can adapt greetings and behavior.

**Implementation options:**

Option A (Recommended): **Prop-based** -- ChatWidget receives `pageContext` prop, passes to usePersonaChat, which includes it in the API body.

This is cleanest because:

- ChatWidget already accepts arbitrary props
- usePersonaChat already sends `body: { personaId, sessionId }` to the transport
- Adding `pageContext` to the body is a one-line change
- Server-side prompt builder can use it for contextual greetings

Option B: useLocation inside ChatWidget -- breaks component purity, harder to test.

**Change chain for Option A:**

1. Add `pageContext?: { pathname: string }` to ChatWidgetProps
2. Pass `pageContext` to usePersonaChat
3. usePersonaChat includes it in DefaultChatTransport body
4. api/chatbot.ts reads context from request body
5. Prompt builder appends page-specific instruction to dynamic prompt section

### Pattern 3: Demo Guide Page-Context Behaviors

**What:** The old ARIA had 3 behavioral systems that need porting:

1. **Page-context greetings** (from pageContextI18n.ts) -- Different welcome messages per demo page. This maps naturally to the persona system: the server-side prompt builder receives `pageContext.pathname` and adds a greeting instruction.

2. **Module follow-up** (from useModuleFollowUp.ts) -- When user closes a module modal in Explorer, the chatbot sends a contextual follow-up. Currently this hook dispatches to `useChatStore` (old). Needs re-implementation as a lightweight hook that calls `sendMessage` on the new usePersonaChat.

3. **Journey nudges** (from useJourneyNudges.ts) -- Time/behavior-based prompts (30-second interval). Currently coupled to journeyStore + personalizationStore + chatStore (all old). Needs re-implementation as a simpler hook using chatbotStore message counts.

**Recommendation:** Create a new `useDemoGuideBehavior` hook that combines module follow-up + journey nudge logic. This hook:

- Watches for module close events (custom events on window, same pattern as old useModuleFollowUp)
- Runs a 30-second interval for journey nudges
- Uses chatbotStore message counts instead of journeyStore milestones
- Calls chatbotStore.setUnread() + opens panel with contextual message

### Pattern 4: Safe ARIA Deletion Order

**Critical insight:** Several non-ARIA files import from stores that will be deleted.

**Dependency analysis of stores:**

`personalizationStore`:

- Used by: Explorer, Calculator, Dashboard, Hero (usePersonalization hook), PersonalizationControlBar, MobilePersonalizationMenu, UserPreferencesModal, FloatingNav (indirectly)
- Verdict: **KEEP** -- This store drives the demo personalization system (industry selection, benchmarks, etc.), not just ARIA. It is exported from stores/index.ts.

`journeyStore`:

- Used by: useCalendlyBooking, useAchievementTracking, useJourneyNudges, and many ARIA components
- Non-ARIA consumer: `useCalendlyBooking` (used by Explorer, Dashboard, Calculator, Hero pages)
- Verdict: **PARTIAL KEEP or REFACTOR** -- useCalendlyBooking imports `useJourneyStore` to get journey phase for Calendly event type routing. This one import needs refactoring before journeyStore can be deleted.

`chatStore` (old):

- Used exclusively by ARIA components and hooks
- Verdict: **SAFE TO DELETE** after ARIA components are removed

**Safe deletion order:**

1. Remove AIJourneyAssistant + NudgeToast from App.tsx (swap in ChatWidget)
2. Refactor useCalendlyBooking to not depend on journeyStore (hardcode default event type or use chatbotStore)
3. Delete all src/components/ai-assistant/ files
4. Delete ARIA-only hooks (useModuleFollowUp, useJourneyNudges, useAchievementTracking)
5. Delete ARIA-only stores (chatStore, journeyStore)
6. Delete ARIA-only utils (conversationEngine, intentRecognition, questionMatcher, chatNavigationHelpers, fallbackResponses, pageContextI18n)
7. Delete ARIA-only configs (knowledgeBase.json, conversationPersonality, platformKnowledge, assistantJourneys, moduleExplanations)
8. Delete ARIA-only services (llmService)
9. Delete api/chat.ts
10. Clean barrel exports (components/index.ts, hooks/index.ts, stores/index.ts)
11. Clean i18n config (remove 'ai-assistant' namespace from config.ts)

### Pattern 5: FloatingElementContext Decision

**Current state:** Used by App.tsx (provider), AIJourneyAssistant, FloatingActionButton, ChatPanel, ChatHeader, and StrategicCTA.

After ARIA removal, only StrategicCTA would use it. The new ChatWidget manages its own open/close state via chatbotStore and does NOT use FloatingElementContext.

**Options:**

- A: Keep FloatingElementContext for StrategicCTA coordination with new ChatWidget
- B: Remove FloatingElementContext entirely, StrategicCTA works independently

**Recommendation:** Remove. The new ChatWidget uses chatbotStore for state. StrategicCTA (exit-intent modal) can check chatbotStore.isOpen to avoid conflicts. This is simpler than maintaining the context.

### Anti-Patterns to Avoid

- **Deleting files before removing imports:** Always update importers first, then delete. Build verification between steps.
- **Breaking useCalendlyBooking:** This hook is used on 4 major pages. Must refactor its journeyStore dependency before deleting journeyStore.
- **Removing personalizationStore:** It drives demo personalization (industry selection), NOT just ARIA. Must be kept.
- **Forgetting barrel export cleanup:** components/index.ts re-exports all of ai-assistant/. hooks/index.ts exports ARIA hooks. stores/index.ts exports personalizationStore (keep).

## Don't Hand-Roll

| Problem                | Don't Build                | Use Instead                                     | Why                                                                |
| ---------------------- | -------------------------- | ----------------------------------------------- | ------------------------------------------------------------------ |
| Floating chat widget   | New floating UI            | Existing ChatWidget mode="floating"             | Already built and tested in Phase 17                               |
| Persona switching      | Custom persona router      | Route detection + personaId prop                | ChatWidget already accepts personaId                               |
| Chat state management  | New store                  | Existing chatbotStore                           | Already has open/close/minimize/unread state                       |
| Streaming chat         | Custom SSE handler         | usePersonaChat (useChat + DefaultChatTransport) | Already wired to api/chatbot.ts                                    |
| Page context greetings | Client-side greeting logic | Server-side prompt builder context injection    | Persona system already has page-context awareness in static prefix |

## Common Pitfalls

### Pitfall 1: Import Graph Breakage

**What goes wrong:** Deleting an ARIA file while another non-ARIA file still imports from it causes build failure.
**Why it happens:** The ARIA system is deeply intertwined with shared stores and hooks.
**How to avoid:** Run `npx tsc --noEmit` or `npx vite build` after each deletion batch. Use the dependency analysis above.
**Warning signs:** TypeScript errors about missing modules after deletion.

### Pitfall 2: useCalendlyBooking Breaking

**What goes wrong:** useCalendlyBooking imports useJourneyStore. Deleting journeyStore breaks Calendly booking on Explorer, Calculator, Dashboard, Hero pages.
**Why it happens:** The hook uses journey phase to determine which Calendly event type to show.
**How to avoid:** Refactor useCalendlyBooking FIRST. Replace journeyStore usage with a simple default or derive from chatbotStore/route.
**Warning signs:** Build errors in Explorer, Calculator, Dashboard, Hero.

### Pitfall 3: Explorer useModuleFollowUp Removal

**What goes wrong:** Explorer.tsx (line 22, 169) directly imports and calls useModuleFollowUp(). Removing this hook without updating Explorer causes build failure.
**Why it happens:** Module follow-up behavior was wired directly into the Explorer page.
**How to avoid:** Either replace with new useDemoGuideBehavior hook or remove the call from Explorer.tsx with a TODO for re-implementation.
**Warning signs:** Explorer page crash.

### Pitfall 4: Stale localStorage Keys

**What goes wrong:** Old ARIA chatStore used 'fmai-chat-state' localStorage key. New chatbotStore uses 'fmai-chatbot-state'. Old key remains in user browsers.
**Why it happens:** Zustand persist creates localStorage entries that outlive code removal.
**How to avoid:** Add a one-time cleanup in App.tsx useEffect: `localStorage.removeItem('fmai-chat-state')`.
**Warning signs:** Wasted storage, potential confusion if key names are reused.

### Pitfall 5: NudgeToast Orphan

**What goes wrong:** NudgeToast is imported separately in App.tsx (not through the barrel) at line 18 and rendered at line 249. Easy to miss during cleanup.
**Why it happens:** It was imported directly from the ai-assistant directory, not through the barrel export.
**How to avoid:** Search App.tsx for ALL ai-assistant imports, not just AIJourneyAssistant.
**Warning signs:** Build error after deleting NudgeToast.tsx.

### Pitfall 6: i18n 'ai-assistant' Namespace

**What goes wrong:** i18n config (src/i18n/config.ts line 92) loads 'ai-assistant' namespace. After removing ARIA, the locale files for this namespace become dead weight.
**Why it happens:** i18n namespaces are registered globally in config.
**How to avoid:** Remove 'ai-assistant' from the ns array in i18n config. Delete the ai-assistant locale JSON files.
**Warning signs:** Console warnings about missing translation keys (benign but messy).

## Code Examples

### Wiring ChatWidget in App.tsx

```typescript
// Replace these imports:
// import { AIJourneyAssistant } from './components'
// import NudgeToast from './components/ai-assistant/NudgeToast'

// With:
import { ChatWidget } from './components/chatbot'

// In the component body, after location/isMobile:
const isDemoPage = ['/explorer', '/calculator', '/dashboard', '/demo'].some(
  p => location.pathname.startsWith(p)
)

// Replace <AIJourneyAssistant /> and <NudgeToast /> with:
<ChatWidget
  mode="floating"
  personaId={isDemoPage ? 'demo-guide' : 'concierge'}
  pageContext={{ pathname: location.pathname }}
/>
```

### Adding pageContext to usePersonaChat

```typescript
// In usePersonaChat.ts, add pageContext param:
export function usePersonaChat(personaId: string, pageContext?: { pathname: string }) {
  const { sessionId, messageCounts, incrementMessageCount } = useChatbotStore()
  const messageCount = messageCounts[personaId] || 0

  const chat = useChat({
    id: `chat-${personaId}`,
    transport: new DefaultChatTransport({
      api: '/api/chatbot',
      body: {
        personaId,
        sessionId,
        context: pageContext, // Pass to server
      },
    }),
    // ...rest unchanged
  })
  // ...
}
```

### Refactoring useCalendlyBooking (journeyStore removal)

```typescript
// Before (depends on journeyStore):
import { useJourneyStore } from '../stores/journeyStore'
// const { currentPhase } = useJourneyStore()
// getCalendlyEventTypeByJourney(currentPhase)

// After (simple default):
// Remove journeyStore import entirely
// Use default event type or derive from route
const eventType = getCalendlyEventTypeByJourney('discovery') // hardcode default
```

### Cleaning barrel exports

```typescript
// components/index.ts — remove these lines:
// export { default as AIJourneyAssistant } from './ai-assistant/AIJourneyAssistant'
// export * from './ai-assistant'

// hooks/index.ts — remove these lines:
// export { useModuleFollowUp } from './useModuleFollowUp'
// export { useAchievementTracking } from './useAchievementTracking'
// export { useJourneyNudges } from './useJourneyNudges'
```

## Open Questions

1. **Module follow-up behavior scope**
   - What we know: CONTEXT.md says to preserve module follow-up behavior in demo-guide
   - What's unclear: Whether to fully re-implement the client-side hook or rely on server-side persona prompting to handle follow-ups naturally
   - Recommendation: Implement a lightweight client-side hook that detects module close events and sends a system-level context message to the chat. The demo-guide persona's prompt already includes module awareness.

2. **Journey nudge re-implementation scope**
   - What we know: Old system checked every 30 seconds for nudge triggers based on modules viewed, time, calculator usage
   - What's unclear: Whether the new chatbot should have the same proactive nudge system or rely on the chatbot's natural conversation flow
   - Recommendation: Implement a simplified version -- after 3+ minutes on a demo page without chat interaction, auto-open the chat with a contextual greeting. Skip the complex milestone tracking.

3. **Concierge page-context greetings**
   - What we know: CONTEXT.md specifies different greetings per marketing page
   - What's unclear: Whether these are automatic (chatbot opens with greeting) or triggered (greeting appears when user opens chat)
   - Recommendation: Greeting appears as first suggested prompt or as initial assistant message when chat is opened for the first time on that page. Use conversation starters variant per page context.

## Sources

### Primary (HIGH confidence)

- `src/App.tsx` -- Current AIJourneyAssistant wiring, route classification, imports
- `src/components/chatbot/ChatWidget.tsx` -- Existing floating mode implementation
- `src/hooks/usePersonaChat.ts` -- Current persona chat hook with DefaultChatTransport
- `src/stores/chatbotStore.ts` -- Current chatbot state management
- `src/lib/chatbot/personas/concierge.ts` -- Concierge persona config
- `src/lib/chatbot/personas/demo-guide.ts` -- Demo guide persona config
- `src/components/ai-assistant/` -- Full ARIA component inventory
- `src/hooks/useModuleFollowUp.ts`, `useJourneyNudges.ts` -- ARIA behavioral hooks
- `.planning/phases/19-homepage-concierge-demo-guide/19-CONTEXT.md` -- User decisions

### Secondary (MEDIUM confidence)

- Dependency graph analysis via grep -- Import relationships between ARIA stores and non-ARIA consumers

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- All components already built in Phases 15-18, verified in codebase
- Architecture: HIGH -- Route-based switching pattern is straightforward React Router
- Pitfalls: HIGH -- Import graph fully analyzed, shared dependencies identified
- ARIA cleanup: HIGH -- Complete file inventory and dependency analysis done

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable -- no external dependencies or fast-moving libraries)
