# Phase 18: ChatbotsPage Demo Playground - Research

**Researched:** 2026-03-13
**Domain:** React page composition, tab-based UI, embedded chat integration, CSS architecture diagrams, progressive CTA patterns
**Confidence:** HIGH

## Summary

Phase 18 transforms the /chatbots service page from static marketing into an interactive demo experience. The heavy lifting -- chatbot engine (Phase 15), persona configs (Phase 16), and UI components (Phase 17) -- is already complete. This phase is purely a **page composition** task: building new section components (DemoPlayground, PersonaSelector, DemoContextCard, ProgressiveCTA, MultiPlatformShowcase), wiring them into the existing ChatbotsPage, and updating i18n files.

The existing ChatWidget already supports embedded mode with per-persona chat isolation via `useChat({ id: 'chat-${personaId}' })`. The main challenges are: (1) managing per-tab independent state with the current chatbotStore (which has a single global messageCount), (2) smooth scroll integration from hero CTA to playground, and (3) the multi-platform animated diagram using only CSS (no heavy libraries per CONTEXT.md).

**Primary recommendation:** Build 5 new components (DemoPlayground orchestrator, PersonaSelector tabs, DemoContextCard, ProgressiveCTA, MultiPlatformShowcase), modify ChatbotsPage to insert them, and extend chatbots.json for all 3 locales.

<user_constraints>

## User Constraints (from CONTEXT.md)

### Locked Decisions

- Page layout follows the exact structure defined in CONTEXT.md (Hero -> DemoPlayground -> MultiPlatformShowcase -> UseCases -> Process -> Pricing -> FAQ -> FinalCTA)
- Demo Playground uses 3 tabs: E-commerce Advisor, Lead Qualifier, Support
- Desktop: side-by-side layout (30% context card, 70% chat widget)
- Mobile: stacked layout (context card above chat)
- Progressive CTA system: no CTA for msgs 1-4, subtle at msg 5, stronger at msg 10, gate at msg 15
- Each tab has independent chat history; switching preserves conversation
- Demo message counter is per-tab
- Multi-platform showcase uses CSS animations only (no heavy libraries)
- Central "brain" node with connections to 3 platform nodes
- SKC case study as proof point
- Product Demo Media section REPLACED by DemoPlayground
- Use cases cards updated to link/scroll to specific demo tabs
- Files to create: DemoPlayground.tsx, PersonaSelector.tsx, DemoContextCard.tsx, ProgressiveCTA.tsx, MultiPlatformShowcase.tsx
- Files to modify: ChatbotsPage.tsx, chatbots.json (en/nl/es)

### Claude's Discretion

- Internal component structure and prop interfaces
- CSS animation specifics for multi-platform diagram
- Smooth scroll implementation details
- How to restructure chatbotStore for per-tab message counting

### Deferred Ideas (OUT OF SCOPE)

- None specified
  </user_constraints>

<phase_requirements>

## Phase Requirements

| ID                     | Description                                                                                                                   | Research Support                                                                                               |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| REQ-CHATBOT-PLAYGROUND | Interactive demo playground with 3 switchable personas, multi-platform showcase, progressive CTAs, and updated marketing copy | Full component inventory, store extension pattern, i18n structure, and CSS animation approach documented below |

</phase_requirements>

## Standard Stack

### Core (Already Installed)

| Library       | Version | Purpose                            | Why Standard                                 |
| ------------- | ------- | ---------------------------------- | -------------------------------------------- |
| React 18      | 18.3+   | Component framework                | Project stack                                |
| Framer Motion | 11.0+   | Tab transitions, scroll animations | Project stack, already used on ChatbotsPage  |
| react-i18next | -       | Internationalization               | Existing i18n infrastructure on ChatbotsPage |
| Zustand       | -       | chatbotStore state management      | Phase 17 store, needs extension              |
| @ai-sdk/react | -       | useChat hook                       | Phase 17 usePersonaChat hook                 |
| Lucide React  | -       | Icons                              | Project standard                             |

### Supporting (Already Installed)

| Library          | Version | Purpose                  | When to Use                  |
| ---------------- | ------- | ------------------------ | ---------------------------- |
| Tailwind CSS     | 3.4+    | Styling                  | All component styling        |
| react-router-dom | 6.22+   | Smooth scroll hash links | Use case card scroll-to-demo |
| react-calendly   | -       | Calendly modal           | Progressive CTA at msg 10+   |

### No New Dependencies Required

This phase uses only existing project dependencies.

## Architecture Patterns

### Recommended Component Structure

```
src/components/chatbot/
  DemoPlayground.tsx        # Orchestrator: tabs + context + chat + CTA
  PersonaSelector.tsx       # Tab bar for 3 personas
  DemoContextCard.tsx       # Scenario + capabilities sidebar
  ProgressiveCTA.tsx        # Message-count-based CTA banners
  MultiPlatformShowcase.tsx # Animated architecture diagram
  index.ts                  # Updated barrel exports
```

### Pattern 1: DemoPlayground as Orchestrator

**What:** DemoPlayground owns tab state (activeTab), renders PersonaSelector, DemoContextCard, embedded ChatWidget, and ProgressiveCTA. Each tab gets its own ChatWidget instance keyed by personaId.
**When to use:** This is the main new section.
**Key detail:** The existing ChatWidget already accepts `mode="embedded"`, `personaId`, `suggestedPrompts`, `messageLimit`, and `height` props. DemoPlayground simply switches which personaId is passed.

```typescript
// DemoPlayground orchestration pattern
const DEMO_PERSONAS = ['ecommerce', 'leadgen', 'support'] as const
type DemoPersonaId = typeof DEMO_PERSONAS[number]

function DemoPlayground() {
  const [activeTab, setActiveTab] = useState<DemoPersonaId>('ecommerce')
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'

  // Get starters for current persona + language
  const starters = PERSONA_STARTERS[activeTab][lang] || PERSONA_STARTERS[activeTab].en

  return (
    <section id="demo-playground">
      <PersonaSelector active={activeTab} onChange={setActiveTab} />
      <div className="flex gap-6"> {/* Desktop side-by-side */}
        <DemoContextCard personaId={activeTab} />
        <ChatWidget
          key={activeTab}  // Forces fresh mount per tab
          mode="embedded"
          personaId={activeTab}
          suggestedPrompts={starters}
          height="550px"
        />
      </div>
      <ProgressiveCTA personaId={activeTab} />
    </section>
  )
}
```

### Pattern 2: Per-Tab Chat Isolation via key Prop

**What:** Using `key={activeTab}` on ChatWidget forces React to unmount/remount when switching tabs. This is the simplest approach to independent chat histories since useChat already isolates by `id: 'chat-${personaId}'`.
**Why not preserve state:** The CONTEXT.md says "switching tabs preserves previous conversation." This requires keeping all 3 ChatWidget instances mounted simultaneously and toggling visibility with CSS.

```typescript
// Preserve-conversation pattern (preferred per CONTEXT.md)
{DEMO_PERSONAS.map((id) => (
  <div key={id} className={activeTab === id ? 'block' : 'hidden'}>
    <ChatWidget
      mode="embedded"
      personaId={id}
      suggestedPrompts={getStarters(id, lang)}
      height="550px"
    />
  </div>
))}
```

**Trade-off:** 3 simultaneous ChatWidget instances means 3 useChat hooks. Since useChat only makes API calls on user input, idle tabs have zero network overhead. Memory cost is negligible for chat message arrays.

### Pattern 3: Per-Tab Message Counting

**What:** The current chatbotStore has a single global `messageCount`. The CONTEXT.md requires per-tab message counters.
**How to extend:** Change messageCount from a single number to a `Record<string, number>` map.

```typescript
// Store extension
interface ChatbotState {
  // ... existing fields ...
  messageCounts: Record<string, number>  // per-persona counts
  incrementMessageCount: (personaId: string) => void
  getMessageCount: (personaId: string) => number
}

// In store
messageCounts: {},
incrementMessageCount: (personaId) =>
  set((state) => ({
    messageCounts: {
      ...state.messageCounts,
      [personaId]: (state.messageCounts[personaId] || 0) + 1,
    },
  })),
```

**Impact:** usePersonaChat needs to accept personaId and read/write the per-persona count. This is a backward-compatible change (concierge persona uses the same pattern).

### Pattern 4: Smooth Scroll from Hero and Use Cases

**What:** Hero CTA scrolls to #demo-playground. Use case cards scroll to specific tabs.
**How:**

```typescript
// Hero CTA - scroll to playground
<CTAButton
  size="lg"
  onClick={() => {
    document.getElementById('demo-playground')?.scrollIntoView({ behavior: 'smooth' })
  }}
>
  Try a Demo Below
</CTAButton>

// Use case card - scroll + activate tab
function scrollToDemo(personaId: DemoPersonaId) {
  setActiveTab(personaId)  // Lifted state or via store
  document.getElementById('demo-playground')?.scrollIntoView({ behavior: 'smooth' })
}
```

### Pattern 5: Progressive CTA Based on Message Count

**What:** CTA content changes based on how many messages the user has sent in the active tab.
**Thresholds:** 0-4 (hidden), 5-9 (subtle), 10-14 (strong with Calendly), 15 (gate).

```typescript
function ProgressiveCTA({ messageCount }: { messageCount: number }) {
  if (messageCount < 5) return null
  if (messageCount < 10) return <SubtleBanner />
  if (messageCount < 15) return <StrongCTA />  // Calendly button
  return <GateCTA />  // Demo limit reached
}
```

### Pattern 6: Multi-Platform Animated Diagram (CSS Only)

**What:** Central brain node with animated connection lines to 3 platform nodes.
**Approach:** CSS keyframes for pulsing, data-flow line animations, and node appearance.

```css
/* Brain node pulse */
@keyframes brainPulse {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(0, 212, 170, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(0, 212, 170, 0.6);
  }
}

/* Connection line data flow */
@keyframes dataFlow {
  0% {
    stroke-dashoffset: 100;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
```

**Layout:** Flexbox/grid with SVG lines connecting nodes. Brain center, 3 platform nodes radiating outward. Each platform node shows icon + name + example behavior text.

### Anti-Patterns to Avoid

- **Global messageCount for demo tabs:** Must be per-persona or all tabs share the same counter.
- **Remounting ChatWidget on tab switch without preserving state:** User loses conversation. Use hidden/shown pattern instead.
- **Heavy animation library for diagram:** CSS keyframes + SVG lines are sufficient. No GSAP/Lottie needed.
- **Emojis in tab labels:** CONTEXT.md shows emojis but CLAUDE.md and skills say "no emoji icons." Use Lucide icons instead (ShoppingCart, Target, LifeBuoy).

## Don't Hand-Roll

| Problem                    | Don't Build              | Use Instead                              | Why                                    |
| -------------------------- | ------------------------ | ---------------------------------------- | -------------------------------------- |
| Chat UI                    | Custom message renderer  | Existing ChatWidget (embedded mode)      | Phase 17 already built this            |
| Per-persona chat isolation | Custom message storage   | useChat `id` param                       | AI SDK handles this natively           |
| Smooth scroll              | Custom scroll animation  | `scrollIntoView({ behavior: 'smooth' })` | Native browser API                     |
| Calendly integration       | Custom booking form      | CTAButton with `calendly` prop           | Existing component handles modal       |
| Tab component              | Custom tab state machine | Simple useState + conditional rendering  | 3 static tabs, no dynamic behavior     |
| Conversation starters      | Separate config          | Persona STARTERS exports from Phase 16   | Already built per persona per language |

## Common Pitfalls

### Pitfall 1: ChatbotStore Global State Conflicts

**What goes wrong:** DemoPlayground embedded widgets and the floating concierge (Phase 19) both use chatbotStore. The isOpen/isMinimized/toggle actions are floating-mode-only but share the same store.
**Why it happens:** ChatWidget reads from chatbotStore regardless of mode.
**How to avoid:** Embedded mode should NOT interact with isOpen/isMinimized/hasUnread. The ChatWidget already handles this -- embedded mode skips FloatingButton and the AnimatePresence panel wrapper. But ensure DemoPlayground does NOT call toggle/open/close.
**Warning signs:** Clicking a demo tab opens the floating widget, or vice versa.

### Pitfall 2: usePersonaChat Creates Duplicate Sessions

**What goes wrong:** If 3 ChatWidget instances mount simultaneously (preserve-conversation pattern), each calls useChat with different ids but the same sessionId. The API endpoint may confuse sessions.
**Why it happens:** chatbotStore has a single sessionId shared across all personas.
**How to avoid:** The sessionId is used for rate limiting, not conversation isolation. useChat `id` handles conversation isolation. This should be fine, but verify the API endpoint doesn't reject requests with the same sessionId but different personaIds.
**Warning signs:** Rate limit errors when switching tabs rapidly.

### Pitfall 3: i18n Key Structure Bloat

**What goes wrong:** Adding demo playground content triples the chatbots.json file size with deeply nested keys.
**Why it happens:** Each persona has scenario text, capabilities list, and CTA text in 3 languages.
**How to avoid:** Use flat key structure for demo content. Group by feature, not by persona.

```json
{
  "demo": {
    "tabs": {
      "ecommerce": { "label": "E-commerce Advisor", "scenario": "...", "capabilities": ["..."] },
      "leadgen": { "label": "Lead Qualifier", "scenario": "...", "capabilities": ["..."] },
      "support": { "label": "Support Agent", "scenario": "...", "capabilities": ["..."] }
    },
    "cta_subtle": "Like what you see? We build custom chatbots.",
    "cta_strong": "Ready to get your own? Book a free strategy session",
    "cta_gate": "Demo limit reached. Book a call for the full experience."
  }
}
```

### Pitfall 4: Mobile Layout Breakpoint

**What goes wrong:** Side-by-side context card + chat widget overflows on tablets/small screens.
**Why it happens:** 30/70 split requires minimum ~900px to be readable.
**How to avoid:** Use `lg:flex-row flex-col` breakpoint. Below lg, stack vertically (context card above chat).

### Pitfall 5: Scroll-to-Tab Not Working from Use Cases

**What goes wrong:** Use case card scrolls to playground but the wrong tab is active.
**Why it happens:** State update and scroll happen simultaneously; React batches updates.
**How to avoid:** Set tab state first, then scroll in a `requestAnimationFrame` or `setTimeout(0)` callback to ensure React has rendered.

## Code Examples

### DemoContextCard Pattern

```typescript
// Renders scenario description + capability list for active persona
interface DemoContextCardProps {
  personaId: 'ecommerce' | 'leadgen' | 'support'
}

export function DemoContextCard({ personaId }: DemoContextCardProps) {
  const { t } = useTranslation('chatbots')

  const capabilities = t(`demo.tabs.${personaId}.capabilities`, {
    returnObjects: true,
  }) as string[]

  return (
    <div className="w-full lg:w-[30%] flex-shrink-0">
      <div className="card-gradient-border bg-white/[0.02] border border-border-primary rounded-card p-6">
        <h3 className="font-display text-lg font-semibold text-text-primary mb-3">
          {t(`demo.tabs.${personaId}.scenario_title`)}
        </h3>
        <p className="text-sm text-text-muted mb-4">
          {t(`demo.tabs.${personaId}.scenario`)}
        </p>
        <h4 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          {t('demo.capabilities_label')}
        </h4>
        <ul className="space-y-1.5">
          {capabilities.map((cap, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-text-muted">
              <CheckCircle className="w-3.5 h-3.5 text-accent-system flex-shrink-0" />
              {cap}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
```

### PersonaSelector Tab Pattern

```typescript
const TAB_ICONS: Record<string, LucideIcon> = {
  ecommerce: ShoppingCart,
  leadgen: Target,
  support: LifeBuoy,
}

interface PersonaSelectorProps {
  active: string
  onChange: (id: string) => void
}

export function PersonaSelector({ active, onChange }: PersonaSelectorProps) {
  const { t } = useTranslation('chatbots')

  return (
    <div className="flex gap-2 mb-6" role="tablist">
      {DEMO_PERSONAS.map((id) => {
        const Icon = TAB_ICONS[id]
        const isActive = active === id
        return (
          <button
            key={id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-card border transition-all duration-200 cursor-pointer ${
              isActive
                ? 'border-accent-system/50 bg-accent-system/10 text-text-primary'
                : 'border-border-primary bg-white/[0.02] text-text-muted hover:border-border-secondary'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{t(`demo.tabs.${id}.label`)}</span>
          </button>
        )
      })}
    </div>
  )
}
```

### MultiPlatformShowcase SVG + CSS Pattern

```typescript
// Animated architecture diagram
export function MultiPlatformShowcase() {
  return (
    <section className="py-16 px-12">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold font-display text-text-primary mb-4">
          {t('multi_platform.title')}
        </h2>

        {/* Diagram container */}
        <div className="relative flex items-center justify-center gap-16 py-12">
          {/* Central brain node */}
          <div className="brain-pulse flex flex-col items-center gap-2">
            <div className="w-20 h-20 rounded-full bg-accent-system/10 border-2 border-accent-system flex items-center justify-center">
              <Brain className="w-10 h-10 text-accent-system" />
            </div>
            <span className="text-sm font-medium text-text-primary">Claude AI</span>
          </div>

          {/* SVG connection lines */}
          <svg className="absolute inset-0 pointer-events-none" aria-hidden="true">
            {/* Animated dashed lines from center to each platform */}
          </svg>

          {/* Platform nodes */}
          <div className="flex flex-col gap-8">
            {platforms.map((p) => (
              <PlatformNode key={p.id} {...p} />
            ))}
          </div>
        </div>

        {/* SKC case study proof */}
        <div className="card-gradient-border bg-white/[0.02] border border-border-primary rounded-card p-6 mt-8 max-w-2xl mx-auto">
          <p className="text-text-muted">{t('multi_platform.case_study')}</p>
          <div className="flex gap-8 justify-center mt-4 font-mono text-sm text-accent-system">
            <span>70% handled</span>
            <span>24/7</span>
            <span>2 platforms</span>
          </div>
        </div>
      </div>
    </section>
  )
}
```

## State of the Art

| Old Approach                         | Current Approach             | When Changed | Impact                                               |
| ------------------------------------ | ---------------------------- | ------------ | ---------------------------------------------------- |
| Static marketing copy on /chatbots   | Interactive demo playground  | This phase   | Direct capability demonstration to prospects         |
| Product Demo Media placeholder video | Live embedded ChatWidget     | This phase   | Replaces 404-prone placeholder with real interaction |
| Global messageCount in store         | Per-persona messageCount map | This phase   | Enables independent demo tab limits                  |

## Open Questions

1. **Per-tab message counting backward compatibility**
   - What we know: chatbotStore currently has `messageCount: number` (global). Phase 17 usePersonaChat reads this. Phase 19 will use the same store for concierge.
   - What's unclear: Should we migrate to `messageCounts: Record<string, number>` now, or add a separate `demoMessageCounts` field?
   - Recommendation: Migrate to `messageCounts` map with backward-compatible getter. Cleaner long-term, and Phase 19 also needs per-persona counting.

2. **Use case card scroll-to-tab coordination**
   - What we know: Use case cards are in a section below the demo playground. They should scroll UP to the playground and activate the right tab.
   - What's unclear: How to pass the setActiveTab function from DemoPlayground to the use cases section (they are siblings in ChatbotsPage).
   - Recommendation: Lift activeTab state to ChatbotsPage, pass setter down to both DemoPlayground and use cases section.

3. **Hero CTA behavior change**
   - What we know: Current hero has "See a Live Demo" (links to /demo) and "Get a Free Strategy Session" (Calendly). New hero should have "Try a Demo Below" (smooth scroll).
   - What's unclear: Should secondary CTA remain Calendly or change?
   - Recommendation: Keep Calendly as secondary. Change primary to smooth scroll per CONTEXT.md.

## Sources

### Primary (HIGH confidence)

- Existing codebase: ChatWidget.tsx, usePersonaChat.ts, chatbotStore.ts -- direct code review
- CONTEXT.md (18-CONTEXT.md) -- locked user decisions
- Design document: docs/plans/2026-03-13-chatbot-showcase-design.md
- Phase 16 persona configs: ecommerce.ts, leadgen.ts, support.ts -- STARTERS exports verified
- Phase 17 STATE.md decisions -- ChatWidget dual-mode, barrel exports, useChat id param

### Secondary (MEDIUM confidence)

- CSS animation patterns for architecture diagrams -- standard CSS keyframes, well-documented

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH - all libraries already installed and used in project
- Architecture: HIGH - extending existing Phase 17 components with well-defined patterns
- Pitfalls: HIGH - identified through direct code review of existing store/hook/component interactions
- i18n: HIGH - existing chatbots.json structure reviewed, extension pattern clear

**Research date:** 2026-03-13
**Valid until:** 2026-04-13 (stable -- extending existing infrastructure)
