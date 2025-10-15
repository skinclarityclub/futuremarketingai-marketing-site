# AI Journey Assistant - Architecture & Implementation Plan

**Version:** 1.0  
**Status:** Planning Phase (Subtask 29.1)  
**Last Updated:** October 8, 2025

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Component Hierarchy](#component-hierarchy)
4. [State Management](#state-management)
5. [Integration Points](#integration-points)
6. [Implementation Roadmap](#implementation-roadmap)
7. [KPIs & Success Metrics](#kpis--success-metrics)
8. [Best Practices & References](#best-practices--references)

---

## 🎯 Executive Summary

The AI Journey Assistant is a flagship interactive feature designed to serve as the centerpiece of the FutureMarketingAI demo experience. It combines:

- **Contextual Journey Guidance** - Adaptive step-by-step paths based on industry/role
- **Intelligent Q&A** - Natural language support with knowledge base
- **Proactive Support** - Context-aware tips and nudges
- **Lead Qualification** - Seamless demo scheduling with Calendly
- **Gamification** - Achievement badges and progress tracking

**Core Philosophy:**

- Mobile-first, accessibility-first design (WCAG 2.1 AA)
- Progressive enhancement with future AI integration readiness
- Performance-optimized with lazy loading
- Privacy-respectful with localStorage persistence

---

## 🏗️ Architecture Overview

### High-Level System Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI Journey Assistant                         │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   UI Layer   │  │ State Layer  │  │ Service Layer│         │
│  │              │  │              │  │              │         │
│  │ • FAB Button │◄─┤ Chat Store   │◄─┤ Journey      │         │
│  │ • Chat Panel │  │ Journey Store│  │ Q&A Engine   │         │
│  │ • Messages   │  │              │  │ Analytics    │         │
│  │ • Progress   │  │              │  │ Calendly     │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                 │
│         └──────────────────┼──────────────────┘                 │
│                            │                                    │
└────────────────────────────┼────────────────────────────────────┘
                             │
                             ▼
         ┌───────────────────────────────────────┐
         │   Existing Infrastructure             │
         │                                       │
         │ • personalizationStore                │
         │ • ICP Scoring (icpScoring.ts)        │
         │ • Analytics (useAnalytics.ts)        │
         │ • Calendly (useCalendlyBooking.ts)   │
         │ • Industry Config                     │
         └───────────────────────────────────────┘
```

### Technology Stack

| Layer                | Technology         | Rationale                                                  |
| -------------------- | ------------------ | ---------------------------------------------------------- |
| **State Management** | Zustand            | Lightweight, performant, existing pattern in codebase      |
| **Animations**       | Framer Motion      | Best-in-class, accessible, respects prefers-reduced-motion |
| **UI Components**    | React + TypeScript | Type safety, component reusability                         |
| **Styling**          | Tailwind CSS       | Consistent with existing design system                     |
| **Analytics**        | GA4 + Hotjar       | Existing infrastructure, proven tracking                   |
| **Persistence**      | localStorage       | Session continuity, privacy-friendly                       |

---

## 🧩 Component Hierarchy

### Primary Components

```
<AIJourneyAssistant>                    # Root container
├── <FloatingActionButton />            # Entry point (right-middle)
│   ├── <BreathingAnimation />          # Subtle pulse effect
│   └── <UnreadBadge />                 # New message indicator
│
├── <ChatPanel />                       # Main interface
│   ├── <ChatHeader />                  # Title, minimize, close
│   │   ├── <ProgressIndicator />       # Journey progress
│   │   └── <AchievementBadges />       # Gamification
│   │
│   ├── <MessageList />                 # Conversation history
│   │   ├── <SystemMessage />           # Bot messages
│   │   ├── <UserMessage />             # User responses
│   │   ├── <SuggestedActions />        # Quick reply chips
│   │   └── <TypingIndicator />         # Loading state
│   │
│   ├── <JourneyProgress />             # Visual journey map
│   │   ├── <MilestoneIndicator />      # Checkpoints
│   │   └── <NextStepSuggestion />      # Proactive guidance
│   │
│   └── <ChatInput />                   # User input
│       ├── <TextInput />               # Natural language
│       └── <QuickActions />            # Common questions
│
└── <CalendlyEmbed />                   # Demo booking (conditional)
```

### Mobile Adaptation

**Desktop:**

- Floating panel (400px wide, 600px tall)
- Right-middle positioning
- Glassmorphic design

**Mobile:**

- Bottom sheet (full width)
- Slides up from bottom
- 70% viewport height (max)
- Swipe-to-dismiss gesture

---

## 🗄️ State Management

### Zustand Stores

#### 1. `useChatStore` - Conversation State

```typescript
// src/stores/chatStore.ts

interface ChatMessage {
  id: string
  type: 'system' | 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    ctaLink?: string
    ctaText?: string
    suggestedActions?: string[]
  }
}

interface ChatState {
  // UI State
  isOpen: boolean
  isMinimized: boolean
  hasUnreadMessages: boolean

  // Conversation
  messages: ChatMessage[]
  currentQuestion: string
  isTyping: boolean

  // Actions
  openChat: () => void
  closeChat: () => void
  minimizeChat: () => void
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  clearMessages: () => void
  setTyping: (typing: boolean) => void
  markAsRead: () => void
}
```

**Persistence:** localStorage with key `fmai-chat-state`

#### 2. `useJourneyStore` - Journey State

```typescript
// src/stores/journeyStore.ts

interface JourneyStep {
  id: string
  title: string
  description: string
  completed: boolean
  unlocked: boolean
  order: number
}

interface JourneyMilestone {
  id: string
  title: string
  description: string
  achieved: boolean
  achievedAt?: Date
  badgeIcon: string
}

interface JourneyState {
  // Journey State
  currentStep: string
  steps: JourneyStep[]
  milestones: JourneyMilestone[]
  completionPercentage: number

  // Contextual Triggers
  modulesViewedCount: number
  hasUsedCalculator: boolean
  hasScheduledDemo: boolean

  // Nudge System
  lastNudgeTime?: Date
  nudgesShown: string[]

  // Actions
  startJourney: (industry?: string, role?: string) => void
  completeStep: (stepId: string) => void
  unlockStep: (stepId: string) => void
  achieveMilestone: (milestoneId: string) => void
  trackModuleView: () => void
  trackCalculatorUse: () => void
  shouldShowNudge: (nudgeId: string) => boolean
  recordNudge: (nudgeId: string) => void
  resetJourney: () => void
}
```

**Persistence:** localStorage with key `fmai-journey-state`

**Integration:**

- Syncs with `personalizationStore.userJourney.viewedModules`
- Reads from `personalizationStore.selectedIndustry` for journey adaptation
- Reads from `personalizationStore.icpScore` for lead qualification

---

## 🔗 Integration Points

### 1. Personalization Store Integration

```typescript
// Read from personalizationStore
const {
  selectedIndustry, // Industry-specific journey paths
  userProfile, // Role, company size, budget
  userJourney, // Viewed modules, CTA clicks
  icpScore, // Lead qualification tier
  trackModuleView, // Track demo engagement
  trackCTAClick, // Track CTA interactions
} = usePersonalizationStore()

// Journey Assistant adapts based on:
// 1. Industry → Content & suggestions
// 2. ICP Score → CTA urgency & messaging
// 3. User Journey → Contextual nudges
// 4. User Profile → Personalized tone
```

### 2. Analytics Integration

```typescript
// src/utils/assistantAnalytics.ts

export const trackAssistantEvent = (eventName: string, properties?: Record<string, any>) => {
  // GA4 Custom Events
  gtag('event', eventName, {
    event_category: 'ai_assistant',
    event_label: properties?.label,
    ...properties,
  })

  // Hotjar events for session recordings
  if (window.hj) {
    window.hj('event', eventName)
  }
}

// Event Taxonomy:
// - assistant_opened
// - assistant_message_sent
// - assistant_action_clicked
// - assistant_milestone_achieved
// - assistant_demo_scheduled
// - assistant_journey_completed
```

### 3. Calendly Integration

```typescript
// Use existing useCalendlyBooking hook
const { open: openCalendly } = useCalendlyBooking()

// Pre-fill with journey data
const scheduleDemo = () => {
  openCalendly('AI Assistant', {
    customAnswers: {
      a1: `Journey Progress: ${completionPercentage}%`,
      a2: `ICP Tier: ${icpScore?.tier}`,
      a3: `Modules Viewed: ${modulesViewedCount}`,
    },
  })

  // Track in journey
  trackCalculatorUse() // Mark journey milestone
  achieveMilestone('demo_scheduled')
}
```

### 4. Industry Personalization

```typescript
// src/config/assistantJourneys.ts

export const industryJourneys: Record<string, JourneyConfig> = {
  ecommerce: {
    steps: [
      { id: 'explore_ad_builder', title: 'Zie AI Ad Builder', ... },
      { id: 'calculate_roi', title: 'Bereken ROI voor e-commerce', ... },
      { id: 'view_analytics', title: 'Bekijk Analytics Dashboard', ... },
      { id: 'schedule_demo', title: 'Plan Demo', ... },
    ],
    welcomeMessage: 'Welkom! Ik help je ontdekken hoe AI jouw e-commerce marketing transformeert.',
    tips: {
      ad_builder: 'E-commerce brands besparen 15-20 uur per week met onze AI Ad Builder...',
      roi_calculator: 'De gemiddelde e-commerce klant bespaart €5.000/maand...',
    },
  },
  saas: { /* ... */ },
  agency: { /* ... */ },
  other: { /* ... */ },
}
```

---

## 🗓️ Implementation Roadmap

### Phase 1: Core UI Foundation (Week 1)

**Subtask 29.2: Core UI Implementation**

- [ ] Create folder structure: `src/components/ai-assistant/`
- [ ] Implement `FloatingActionButton` with breathing animation
- [ ] Build `ChatPanel` with glassmorphic design
- [ ] Develop `MessageList` with message types
- [ ] Add `ProgressIndicator` placeholder
- [ ] Ensure WCAG 2.1 AA compliance
  - [ ] ARIA labels on all interactive elements
  - [ ] Keyboard navigation (Tab, Escape, Enter)
  - [ ] Screen reader announcements for new messages
  - [ ] Color contrast validation
- [ ] Implement responsive behavior (desktop/mobile)
- [ ] Add lazy loading for chat assets
- [ ] Respect `prefers-reduced-motion`

**Deliverables:**

- Functional chat UI (static messages)
- Accessibility audit report
- Mobile/desktop screenshots

---

### Phase 2: Journey Logic & State (Week 2)

**Subtask 29.3: Journey Guidance System**

- [ ] Create `useJourneyStore` with Zustand
- [ ] Define journey configurations per industry
- [ ] Implement step tracking logic
- [ ] Build progress persistence (localStorage)
- [ ] Create milestone achievement system
- [ ] Develop contextual nudge triggers:
  - [ ] After 3 modules viewed
  - [ ] On ROI Calculator page
  - [ ] After 2 minutes on site
  - [ ] On scroll to bottom of page
- [ ] Integrate with `personalizationStore`
- [ ] Test journey state transitions

**Deliverables:**

- Journey state machine
- Configuration files for 4 industries
- Unit tests for state logic

---

### Phase 3: Q&A & Conversation (Week 3)

**Subtask 29.4: Q&A and Proactive Support**

- [ ] Create knowledge base structure (JSON)
- [ ] Implement pattern-matching Q&A engine
- [ ] Build fallback response system
- [ ] Design conversation flows (friendly, professional tone)
- [ ] Add escalation paths to human support
- [ ] Implement suggested actions (quick replies)
- [ ] Create proactive tip system
- [ ] Test Q&A accuracy with sample questions

**Knowledge Base Categories:**

```
- Product Features (Ad Builder, Analytics, etc.)
- Pricing & Plans
- Implementation & Setup
- Use Cases by Industry
- Technical Questions
- Comparison vs. Competitors
```

**Deliverables:**

- Knowledge base JSON file
- Q&A engine with >90% accuracy on test set
- Conversation flow diagrams

---

### Phase 4: Personalization & Calendly (Week 4)

**Subtask 29.5: Calendly Integration**

- [ ] Integrate with existing `useCalendlyBooking`
- [ ] Pre-fill demo booking with journey data
- [ ] Implement smooth transition from chat to Calendly
- [ ] Add post-booking confirmation in chat
- [ ] Track booking events in analytics
- [ ] Test ICP-based scheduling flow

**Subtask 29.6: Personalization & Gamification**

- [ ] Implement ICP-based content adaptation
- [ ] Create adaptive messaging system
- [ ] Design achievement badge system
- [ ] Build milestone celebration animations
- [ ] Add progress bar visualizations
- [ ] Implement congratulatory messages on completion

**Deliverables:**

- Fully integrated Calendly flow
- 6-8 achievement badges
- Celebration animations (Framer Motion)

---

### Phase 5: Analytics & Testing (Week 5)

**Subtask 29.7: Analytics & Event Tracking**

- [ ] Configure GA4 custom events
- [ ] Implement Hotjar event triggers
- [ ] Create analytics dashboard visualization
- [ ] Set up A/B testing framework
- [ ] Add custom dimensions for segmentation:
  - [ ] Industry
  - [ ] ICP Tier
  - [ ] Journey Completion %
  - [ ] Time to Demo Booking
- [ ] Test analytics in dev/staging

**Subtask 29.8: User Testing & Iteration**

- [ ] Design user testing protocol
- [ ] Recruit 10-15 test users (varied segments)
- [ ] Conduct moderated testing sessions
- [ ] Collect qualitative feedback
- [ ] Analyze usage patterns from analytics
- [ ] Identify and prioritize improvements
- [ ] Implement feedback-driven changes
- [ ] Prepare for future AI integration (LLM backend, WebSocket)

**Deliverables:**

- Analytics configuration documented
- User testing report with findings
- Prioritized improvement backlog
- AI integration readiness plan

---

## 📊 KPIs & Success Metrics

### Primary Metrics

| Metric                 | Definition                        | Target | Tracking Method                               |
| ---------------------- | --------------------------------- | ------ | --------------------------------------------- |
| **Engagement Rate**    | % of visitors who open assistant  | >35%   | GA4: `assistant_opened` / page_views          |
| **Completion Rate**    | % who complete journey            | >60%   | GA4: `journey_completed` / `assistant_opened` |
| **Demo Booking Rate**  | % who schedule demo via assistant | >15%   | GA4: `assistant_demo_scheduled`               |
| **Satisfaction Score** | User rating (1-5 scale)           | >4.2   | In-app survey post-interaction                |

### Secondary Metrics

- **Time to First Interaction:** Average time from page load to assistant open
- **Messages per Session:** Average conversation depth
- **Most Viewed Modules:** Top 5 demo sections visited via assistant
- **Drop-off Points:** Where users abandon journey
- **Mobile vs Desktop:** Engagement rate comparison
- **ICP Correlation:** Booking rate by ICP tier

### Analytics Implementation

```typescript
// Track journey completion
trackAssistantEvent('journey_completed', {
  industry: selectedIndustry?.id,
  completion_time_seconds: timeElapsed,
  modules_viewed: modulesViewedCount,
  icp_tier: icpScore?.tier,
})

// Track milestone achievements
trackAssistantEvent('milestone_achieved', {
  milestone_id: milestoneId,
  milestone_name: milestone.title,
  time_to_achieve: timeElapsed,
})

// Track demo bookings
trackAssistantEvent('assistant_demo_scheduled', {
  from_nudge: nudgeId || 'manual',
  journey_progress: completionPercentage,
  icp_score: icpScore?.score,
})
```

---

## 🎨 Best Practices & References

### Inspiration Sources

1. **Intercom Messenger**
   - Contextual onboarding flows
   - Proactive nudges based on behavior
   - Achievement-based engagement

2. **Drift Chat**
   - Lead qualification within chat
   - Seamless meeting scheduling
   - Playful, conversational tone

3. **Notion AI**
   - Contextual suggestions
   - Elegant UI animations
   - Keyboard-first interactions

4. **Linear (Triage)**
   - Minimalist design
   - Smart defaults
   - Efficient workflows

5. **Superhuman**
   - Gamification (achievement badges)
   - Micro-animations for delight
   - Power user features

### Accessibility Guidelines

- **WCAG 2.1 AA Compliance**
  - Color contrast ≥4.5:1 for text
  - Focus indicators visible
  - Keyboard navigation complete
  - Screen reader compatible

- **Keyboard Shortcuts**
  - `Cmd/Ctrl + K` → Open assistant
  - `Escape` → Close assistant
  - `Tab` → Navigate options
  - `Enter` → Send message / select action

- **Motion Preferences**
  ```css
  @media (prefers-reduced-motion: reduce) {
    .assistant-panel {
      animation: none;
      transition: opacity 0.2s;
    }
  }
  ```

### Performance Guidelines

- **Lazy Loading**

  ```typescript
  const ChatPanel = lazy(() => import('./components/ai-assistant/ChatPanel'))
  ```

- **Code Splitting**
  - Separate bundle for assistant (~50KB gzipped)
  - Load on first interaction, not on page load

- **Target Metrics**
  - Time to Interactive: <200ms (open assistant)
  - Bundle Size: <100KB (uncompressed)
  - First Message Render: <100ms

---

## 🚀 Future AI Integration Readiness

### Phase 6: LLM Backend (Future)

When ready to integrate real AI:

1. **Backend Architecture**

   ```
   Frontend (React) → API Gateway → LLM Service (GPT-4, Claude)
                                  → Vector DB (Pinecone, Weaviate)
                                  → RAG Pipeline
   ```

2. **WebSocket for Real-time**

   ```typescript
   const ws = new WebSocket('wss://api.fmai.com/assistant')

   ws.onmessage = (event) => {
     const { type, content } = JSON.parse(event.data)
     if (type === 'message_chunk') {
       streamMessage(content) // Typewriter effect
     }
   }
   ```

3. **Prompt Engineering**

   ```
   System Prompt:
   You are an AI assistant for FutureMarketingAI, helping B2B marketing teams
   discover how autonomous AI can transform their workflows. Your role is to:
   - Guide users through the demo experience
   - Answer questions about product features
   - Qualify leads based on their needs
   - Schedule demos when appropriate

   Context:
   - Industry: {selectedIndustry}
   - ICP Tier: {icpScore.tier}
   - Journey Progress: {completionPercentage}%

   Tone: Friendly, professional, consultative (not salesy)
   ```

4. **Guardrails & Safety**
   - Content filtering (no off-topic responses)
   - Fact-checking against knowledge base
   - Escalation to human when uncertain
   - Privacy-first (no PII in prompts)

---

## 📝 Appendix

### File Structure

```
src/
├── components/
│   └── ai-assistant/
│       ├── index.ts
│       ├── AIJourneyAssistant.tsx          # Root container
│       ├── FloatingActionButton.tsx
│       ├── ChatPanel.tsx
│       ├── ChatHeader.tsx
│       ├── MessageList.tsx
│       ├── SystemMessage.tsx
│       ├── UserMessage.tsx
│       ├── SuggestedActions.tsx
│       ├── TypingIndicator.tsx
│       ├── JourneyProgress.tsx
│       ├── MilestoneIndicator.tsx
│       ├── AchievementBadges.tsx
│       ├── ChatInput.tsx
│       └── styles/
│           ├── animations.ts              # Framer Motion variants
│           └── glassmorphism.ts           # Reusable glass styles
│
├── stores/
│   ├── chatStore.ts                       # Conversation state
│   └── journeyStore.ts                    # Journey state
│
├── hooks/
│   ├── useAssistantAnalytics.ts          # Analytics tracking
│   └── useJourneyNudges.ts               # Contextual triggers
│
├── config/
│   ├── assistantJourneys.ts              # Journey definitions
│   └── knowledgeBase.json                # Q&A data
│
└── utils/
    ├── assistantAnalytics.ts             # GA4/Hotjar helpers
    ├── messageFormatter.ts               # Message parsing
    └── nudgeEngine.ts                    # Trigger logic
```

### Dependencies to Install

```json
{
  "dependencies": {
    "framer-motion": "^10.16.4",
    "zustand": "^4.4.1"
  }
}
```

_(Other dependencies already in project: React, TypeScript, Tailwind, react-router-dom)_

---

## ✅ Architecture Review Checklist

- [x] Component hierarchy defined
- [x] State management approach documented
- [x] Integration points with existing systems identified
- [x] Phased implementation roadmap created
- [x] KPIs and success metrics defined
- [x] Accessibility requirements specified
- [x] Performance targets set
- [x] Analytics tracking plan documented
- [x] Future AI integration path outlined
- [x] Best practices and references included

---

**Next Steps:**

1. Review architecture with senior developers
2. Validate approach with stakeholders
3. Begin Phase 1: Core UI Implementation (Subtask 29.2)

**Document Owner:** AI Development Team  
**Review Cadence:** Weekly during implementation  
**Last Review:** October 8, 2025
