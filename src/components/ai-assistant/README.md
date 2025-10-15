# AI Journey Assistant - Component Documentation

**Status:** Phase 1 & 2 Complete ✅  
**Last Updated:** October 8, 2025

---

## 📋 Overview

The AI Journey Assistant is a flagship interactive feature that serves as the centerpiece of the FutureMarketingAI demo experience. It provides:

- **Contextual Journey Guidance** - Adaptive step-by-step paths based on industry/role
- **Interactive Chat Interface** - Glassmorphic design with smooth animations
- **Progress Tracking** - Visual journey completion with achievement badges
- **Proactive Support** - Context-aware tips and nudges (Phase 3)
- **Lead Qualification** - Seamless demo scheduling with Calendly (Phase 4)

---

## 🎨 Current Implementation (Phase 1 & 2)

### ✅ What's Working Now:

1. **Floating Action Button**
   - Positioned at **right-middle** of viewport
   - Breathing animation to draw attention
   - Unread message indicator
   - Smooth open/close with icon rotation

2. **Chat Panel**
   - Desktop: 400×600px floating panel (top-right)
   - Mobile: Full-width bottom sheet (70vh max)
   - Glassmorphic design with backdrop blur
   - Smooth slide-in animations

3. **Chat Interface**
   - Message history with system/user message types
   - Typing indicator animation
   - Auto-expanding textarea input
   - Character counter (500 char limit)
   - Timestamp formatting

4. **Journey Tracking**
   - Progress bar in header
   - Achievement badge counter
   - Time-on-site tracking
   - Industry-specific welcome messages

5. **Accessibility**
   - WCAG 2.1 AA compliant
   - Full keyboard navigation
   - Screen reader support
   - Respects prefers-reduced-motion

---

## 🚀 How to Test

### Start the Development Server

```bash
npm run dev
```

### Testing Checklist

1. **Open the Assistant**
   - Click the floating purple button on the right-middle of the screen
   - Verify smooth slide-in animation
   - Check welcome message appears

2. **Send Messages**
   - Type a message in the input field
   - Press Enter to send
   - Verify typing indicator appears
   - Check placeholder response arrives
   - Try Shift+Enter for multiline

3. **Progress Tracking**
   - Watch the progress bar in the header
   - It will show 0% initially (journey just started)
   - Progress increases as you complete steps (Phase 3)

4. **Responsive Testing**
   - Resize browser to mobile width (<768px)
   - Verify bottom sheet appears instead of floating panel
   - Test backdrop dismiss
   - Check swipe handle visibility

5. **Accessibility Testing**
   - Navigate with Tab key
   - Verify focus indicators
   - Test with screen reader (NVDA/JAWS/VoiceOver)
   - Enable prefers-reduced-motion and verify animations respect it

---

## 📁 File Structure

```
src/components/ai-assistant/
├── index.ts                      # Exports
├── AIJourneyAssistant.tsx        # Main container
├── FloatingActionButton.tsx      # FAB (right-middle position)
├── ChatPanel.tsx                 # Panel wrapper
├── ChatHeader.tsx                # Header with progress
├── MessageList.tsx               # Message history
├── SystemMessage.tsx             # AI messages
├── UserMessage.tsx               # User messages
├── TypingIndicator.tsx           # Animated dots
├── ChatInput.tsx                 # Input field
├── styles/
│   ├── animations.ts             # Framer Motion variants
│   └── glassmorphism.ts          # Glass effect styles
└── README.md                     # This file

src/stores/
├── chatStore.ts                  # Conversation state
└── journeyStore.ts               # Journey progress state

src/config/
├── assistantJourneys.ts          # Journey configurations
└── knowledgeBase.json            # Q&A data (Phase 3)

docs/
└── ai-journey-assistant-architecture.md   # Full architecture
```

---

## 🎯 Keyboard Shortcuts

| Key             | Action                        |
| --------------- | ----------------------------- |
| `Tab`           | Navigate between elements     |
| `Enter`         | Send message                  |
| `Shift + Enter` | New line in message           |
| `Escape`        | Close chat (via close button) |

---

## 🔧 State Management

### Chat Store (`useChatStore`)

```typescript
const {
  isOpen, // Chat panel visibility
  messages, // Message history
  hasUnreadMessages, // Unread indicator
  addUserMessage, // Add user message
  addSystemMessage, // Add system message
  setTyping, // Show typing indicator
  toggleChat, // Open/close chat
} = useChatStore()
```

### Journey Store (`useJourneyStore`)

```typescript
const {
  steps, // Journey steps
  milestones, // Achievement milestones
  completionPercentage, // Progress (0-100)
  trackModuleView, // Track module view
  completeStep, // Mark step complete
  achieveMilestone, // Award achievement
} = useJourneyStore()
```

---

## 🎨 Design Tokens

### Colors

- **Primary Gradient:** `from-purple-600 to-blue-600`
- **Glass Background:** `bg-white/10 dark:bg-slate-900/30`
- **Borders:** `border-white/20 dark:border-slate-700/30`
- **Backdrop:** `backdrop-blur-xl`

### Animations

- **Breathing:** 2s infinite ease-in-out
- **Slide In:** Spring (stiffness: 300, damping: 30)
- **Fade In:** 0.3s ease-out
- **Typing Dots:** 0.6s staggered bounce

### Breakpoints

- **Mobile:** < 768px (bottom sheet)
- **Desktop:** ≥ 768px (floating panel)

---

## 🔜 Coming in Phase 3 & 4

### Phase 3: Journey Guidance (Subtask 29.3)

- [ ] Contextual nudges based on user behavior
- [ ] Step completion tracking with module viewing
- [ ] Milestone achievements (Explorer, ROI Calculator, etc.)
- [ ] Proactive tips at strategic points

### Phase 4: Q&A & Calendly (Subtasks 29.4 & 29.5)

- [ ] Natural language Q&A with knowledge base
- [ ] Pattern matching for common questions
- [ ] Fallback responses for unknown queries
- [ ] Seamless Calendly integration with pre-filled data
- [ ] Post-booking confirmation flow

---

## 🐛 Known Issues

1. **Placeholder Responses:** Q&A engine not yet implemented. Currently shows placeholder response.
2. **Progress Bar:** Shows 0% until journey step tracking is implemented (Phase 3).
3. **Suggested Actions:** Quick reply buttons don't do anything yet (Phase 3).

---

## 📚 References

- **Architecture:** `docs/ai-journey-assistant-architecture.md`
- **Journey Configs:** `src/config/assistantJourneys.ts`
- **Knowledge Base:** `src/config/knowledgeBase.json`
- **Taskmaster:** `.taskmaster/tasks/task_29*.md`

---

## 💡 Tips for Developers

### Adding a New Message Type

```typescript
// In chatStore
addSystemMessage('Hello!', {
  ctaLink: '/calculator',
  ctaText: 'Try Calculator',
  suggestedActions: ['Tell me more', 'Book demo'],
})
```

### Triggering a Milestone

```typescript
// In your component
const { achieveMilestone } = useJourneyStore()

// When user completes ROI calculator
achieveMilestone('roi_calculator')
```

### Industry-Specific Content

```typescript
import { getJourneyConfig } from '@/config/assistantJourneys'

const config = getJourneyConfig('ecommerce')
console.log(config.welcomeMessage) // Industry-specific welcome
```

---

## 🧪 Testing Commands

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Run Storybook (when stories are added)
npm run storybook

# Lint check
npm run lint

# Type check
npm run type-check
```

---

## 📞 Need Help?

- Review the full architecture: `docs/ai-journey-assistant-architecture.md`
- Check Taskmaster progress: `task-master show 29`
- Ask questions in the chat! 😊

---

**Built with:** React, TypeScript, Zustand, Framer Motion, Tailwind CSS  
**Inspired by:** Intercom, Drift, Notion AI, Linear, Superhuman
