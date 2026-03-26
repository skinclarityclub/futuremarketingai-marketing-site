# Phase 19: Homepage Concierge + Demo Guide + ARIA Cleanup — Context

## Goal

Replace the entire ARIA system with the new persona-driven chatbot. Wire concierge persona as floating chatbot on marketing pages, demo-guide persona on demo pages (/explorer, /calculator, /dashboard) with page-context awareness. Clean removal of all old ARIA code and OpenAI dependencies.

## Design Reference

- Full design: `docs/plans/2026-03-13-chatbot-showcase-design.md`

## Route-Based Persona Switching

### Marketing Pages → Concierge Persona

Routes: `/`, `/pricing`, `/about`, `/chatbots`, `/automations`, `/voice-agents`, `/marketing-machine`, `/how-it-works`, `/contact`

Concierge behavior:

- Floating widget (FAB + panel)
- Context-aware greetings based on current page
- Homepage: "Welcome! I'm here to help you explore our AI services"
- Pricing page: "Looking at pricing? I can help you find the right plan"
- Service page: "Want to learn more about our chatbot solutions?"

### Demo Pages → Demo Guide Persona

Routes: `/explorer`, `/calculator`, `/dashboard`, `/demo`

Demo Guide behavior (preserves key ARIA behaviors):

- Floating widget with proactive opening
- Page-context greetings (explorer, calculator, dashboard specific)
- Module follow-up messages when user closes a module modal in /explorer
- Journey nudges based on time/modules viewed
- Progressive guidance: Explore → Calculate → Book Demo

## ARIA Behaviors to Preserve in Demo Guide

### Page Context Detection (from pageContext.ts)

```
home → "/" — general greeting
calculator → URL contains "calculator" — ROI-focused greeting
explorer → URL contains "explorer" — module discovery greeting
dashboard → URL contains "dashboard" — dashboard tour greeting
```

### Module Follow-Ups (from useModuleFollowUp.ts)

When user closes a module modal in /explorer, demo-guide sends:

1. Contextual follow-up about the module just viewed
2. Suggestion for next module
3. After all 7 modules: final CTAs (Calculate ROI, Schedule Demo)

### Journey Nudges (from useJourneyNudges.ts)

Checked every 30 seconds:

- After 3+ modules viewed: "Want to see ROI impact?"
- After calculator used: "Ready to schedule a demo?"
- After 5+ minutes idle: re-engagement prompt

### Contextual Quick Replies

- Explorer: [Content Factory], [Lead Scoring], [Schedule demo]
- Calculator: [Calculate now], [Schedule demo], [View modules]
- Dashboard: [Dashboard help], [Next step], [Schedule demo]

## Implementation in App.tsx

```typescript
// In App.tsx, replace <AIJourneyAssistant /> with:
const isDemoPage = ['/explorer', '/calculator', '/dashboard', '/demo'].some(
  p => location.pathname.startsWith(p)
)

<ChatWidget
  mode="floating"
  personaId={isDemoPage ? 'demo-guide' : 'concierge'}
  pageContext={{ pathname: location.pathname }}
/>
```

## Files to REMOVE (Complete ARIA Cleanup)

### Components (entire directory)

```
src/components/ai-assistant/AIJourneyAssistant.tsx
src/components/ai-assistant/ChatPanel.tsx
src/components/ai-assistant/ChatHeader.tsx
src/components/ai-assistant/ChatInput.tsx
src/components/ai-assistant/MessageList.tsx
src/components/ai-assistant/NavigationAction.tsx
src/components/ai-assistant/FloatingActionButton.tsx
src/components/ai-assistant/InfoPanel.tsx
src/components/ai-assistant/messages/CalendlyBooking.tsx
src/components/ai-assistant/messages/QuickReplies.tsx
src/components/ai-assistant/messages/RichCard.tsx
src/components/ai-assistant/messages/Carousel.tsx
src/components/ai-assistant/messages/AchievementCard.tsx
```

### Services & Utils

```
src/services/llmService.ts
src/utils/conversationEngine.ts
src/utils/intentRecognition.ts
src/utils/questionMatcher.ts
src/utils/chatNavigationHelpers.ts
```

### Stores & Types

```
src/stores/chatStore.ts (OLD — new one created in Phase 17)
src/stores/journeyStore.ts
src/stores/personalizationStore.ts (if only used by ARIA)
src/types/chat.ts (OLD — new one in src/lib/chatbot/types.ts)
```

### Config

```
src/config/knowledgeBase.json
src/config/conversationPersonality.ts
src/config/platformKnowledge.ts
src/config/assistantJourneys.ts
src/config/moduleExplanations.ts
```

### Hooks

```
src/hooks/useModuleFollowUp.ts
src/hooks/useJourneyNudges.ts
src/hooks/useAchievementTracking.ts
```

### API & Dependencies

```
api/chat.ts (OpenAI proxy — replaced by api/chatbot.ts)
Remove 'openai' from package.json
```

## ARIA Code to Reference Before Deleting

Critical behavior patterns to extract into demo-guide persona BEFORE cleanup:

- `assistantJourneys.ts` — Industry journey steps + milestones
- `pageContext.ts` — Page detection + contextual greetings per page
- `useModuleFollowUp.ts` — Module close detection + follow-up logic
- `useJourneyNudges.ts` — Time/behavior based nudge triggers
- `conversationPersonality.ts` — Industry-specific message templates

## Verification Checklist

After cleanup:

- [ ] Homepage: Concierge floating widget appears, responds to questions
- [ ] /chatbots: Demo playground works with 3 personas
- [ ] /explorer: Demo guide greets, follows up on module close
- [ ] /calculator: Demo guide provides ROI context
- [ ] /dashboard: Demo guide offers tour
- [ ] No console errors about missing ARIA imports
- [ ] No dead imports referencing removed files
- [ ] `openai` package removed from node_modules
- [ ] Build succeeds with no warnings about deleted files
- [ ] All demo pages function without ARIA coupling

## Files to Create/Modify

```
MODIFY: src/App.tsx — Replace <AIJourneyAssistant /> with <ChatWidget mode="floating" ...>
MODIFY: package.json — Remove openai, add @ai-sdk/anthropic + ai + zod (if not done in Phase 15)
DELETE: All files listed in "Files to REMOVE" section above
```
