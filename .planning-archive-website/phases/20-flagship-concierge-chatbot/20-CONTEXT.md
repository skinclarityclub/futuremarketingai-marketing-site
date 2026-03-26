---
title: 'Phase 20: Flagship Concierge Chatbot - Context'
tags:
  - phase-20
  - chatbot
  - flagship
created: 2026-03-14
source: user conversation
---

# Phase 20: Flagship Concierge Chatbot - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform the floating concierge chatbot from a basic chat window into the **flagship showcase** — the "best of the best" chatbot that demonstrates everything FMai can build for clients. This is not a demo persona with limitations — this is the live production-quality assistant that runs across the entire website.

**What this phase delivers:**

- Unlimited conversation (no 15-message demo cap)
- All tools from every persona combined into one super-assistant
- Expandable side panel for rich content display
- Page navigation actions (buttons that route users through the website)
- Proactive context-aware behavior inherited from old ARIA system

</domain>

<decisions>
## Implementation Decisions

### Message Limits

- Remove the 15-message demo limit for the floating concierge
- Demo playground personas on /chatbots keep their limits (those are demos)
- The floating chatbot IS the product showcase, not a demo

### Tool Consolidation

- Floating concierge gets ALL tools from all personas:
  - From concierge: get_services, book_call, navigate_to_page, get_case_study
  - From demo-guide: explain_module, get_roi_info, book_demo
  - From ecommerce: search_products, get_product_details, build_routine
  - From leadgen: qualify_lead, get_roi_estimate, get_pricing_info, schedule_demo
  - From support: search_knowledge_base, create_ticket, check_status
- Context-aware tool availability: not all tools shown at once, surface relevant ones based on page/conversation context

### Expandable Side Panel

- Tool results that need more space (product cards, case studies, module details, ROI calculations) open in an expandable side panel
- Side panel slides out from the chat panel (right side)
- Contains rich content: images, cards, comparison tables, detailed info
- User can dismiss or keep open while continuing chat
- Desktop-first (side panel), mobile gracefully degrades (inline or modal)

### Navigation Actions

- Chat can include clickable navigation buttons ("View Explorer", "Go to Pricing", "Try Calculator")
- These actually navigate the user via React Router (not just links)
- Rendered as styled action buttons in chat messages
- Inherit from old ARIA's page navigation behavior

### ARIA Feature Revival

- Review old ARIA system capabilities and bring the best into the new engine:
  - Module follow-up suggestions (after explaining a module, suggest related ones)
  - Context-aware greetings based on which page the user is on
  - Journey nudges (subtle suggestions based on user behavior/path)
  - Achievement tracking (visited pages, completed actions)
  - Proactive engagement (not just reactive Q&A)

### Claude's Discretion

- Exact side panel animation and sizing
- How tool results are routed (inline vs side panel) — use sensible size thresholds
- State management approach for side panel (extend chatbotStore vs new store)
- How to merge persona system prompts for the flagship persona
- Rate limiting strategy for unlimited mode (still need abuse prevention)

</decisions>

<specifics>
## Specific Ideas

- The floating button stays the same (right-middle FAB with breathe animation)
- Side panel should feel like a natural extension of the chat, not a separate window
- Navigation buttons should use the app's existing accent colors and button styles
- The flagship persona system prompt should be a curated merge — not just concatenating all persona prompts
- Consider a "Concierge Mode" label/badge to differentiate from demo chatbots
- Old ARIA had: AIJourneyAssistant, NudgeToast, useModuleFollowUp, useJourneyNudges, useAchievementTracking, journeyStore — review these for feature extraction

</specifics>

<deferred>
## Deferred Ideas

- Voice input for chat (future phase)
- Multi-turn memory across sessions (requires backend persistence)
- Admin dashboard for conversation analytics
- A/B testing different concierge personalities

</deferred>

---

_Phase: 20-flagship-concierge-chatbot_
_Context gathered: 2026-03-14 via user conversation_
