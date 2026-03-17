# Chatbot Showcase System — Design Document

## Overview

Replace the current ARIA chatbot (OpenAI-based tour guide) with a unified, persona-driven chatbot engine powered by Claude. The system serves 6 personas from a single API endpoint, showcasing FMai's chatbot capabilities through live interactive demos on the /chatbots page and a production concierge on the homepage.

## Problem Statement

- Current ARIA chatbot uses OpenAI GPT-4o-mini with pseudo-tool-calling (string parsing), no streaming, and hardcoded demo-only behavior
- The /chatbots service page has no live demos — only static marketing copy
- FMai already has production chatbot code (SKC Sindy) with streaming, tool calling, prompt caching, and multi-platform support — but none of this is showcased
- Prospects cannot experience FMai's chatbot capabilities before buying

## Research Findings

### Market Data

- 63% of B2B companies use chatbots for lead qualification
- E-commerce bots drive 15% higher AOV and 14% additional revenue
- Chatbots cut customer service costs by up to 30%
- Interactive demos convert 3x better than static pages (Klue: $550K pipeline in 60 days from "Demo Arena")

### Best Practices (2024-2026)

- **Playground-style demos** convert best — real AI interaction, not scripted
- **Persona-based switching** lets visitors try different bot types
- **Suggested conversation starters** prevent "blank page" paralysis
- **Session limits** (15 messages) control costs while showing capability
- **Progressive CTAs** — subtle at 5 messages, stronger at 10, gate at 15
- **Hybrid AI approach** — real AI with guardrails + suggested prompts
- **Demo mode indicator** — clear badge so visitors know it's a demo

### Cost Analysis

- Haiku 4.5 (80% of queries): ~$0.0008/1K input tokens
- Sonnet 4 (20% complex): ~$0.003/1K input tokens
- Prompt caching: 15-25% additional savings
- Estimated cost: $15-30/month for 100 demo sessions/day

## Architecture

### Single API Endpoint

```
POST /api/chatbot
{
  "personaId": "concierge" | "ecommerce" | "leadgen" | "support" | "demo-guide",
  "message": "...",
  "sessionId": "...",
  "conversationHistory": [...],
  "context": { "currentPage": "...", "language": "en" }
}
```

### Persona-Driven Engine (Adopted from SKC Sindy)

```
┌─────────────────────────────────────────────┐
│  Shared UI Shell (ChatWidget)               │
│  - Floating mode (concierge, demo-guide)    │
│  - Embedded mode (demo playground)          │
│  - Streaming text + tool result cards       │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  Persona Router                             │
│  - Request param determines persona         │
│  - Gates: tools, prompt, knowledge, model   │
└─────────────────────────────────────────────┘
                      ↓
┌─────────────────────────────────────────────┐
│  API: POST /api/chatbot                     │
│  - Vercel AI SDK streaming (SSE)            │
│  - Claude Haiku 4.5 / Sonnet 4 routing     │
│  - Prompt caching (static prefix/persona)   │
│  - Tool execution per persona               │
│  - Rate limiting + session management       │
└─────────────────────────────────────────────┘
```

### Key Patterns from SKC

1. **Hybrid Prompt Caching**: Static prefix (~2500 tokens, cached) + dynamic knowledge (topic router, per-request)
2. **Zero-Latency Topic Router**: Keyword-based knowledge selection in <1ms, no API call
3. **Dual-Model Routing**: Complexity detection → Haiku (simple) or Sonnet (complex)
4. **Tool Availability Matrix**: Same engine, different tools per persona
5. **Platform Detection**: Single endpoint, persona routing by request param

## 6 Chatbot Personas

### Persona 1: Website Concierge

- **Location**: Floating widget on all marketing pages (replaces ARIA)
- **Purpose**: Hybrid — navigation help + sales qualifying + capability showcase
- **Model**: Haiku default, Sonnet for complex questions
- **Tools**: `get_services`, `book_call`, `navigate_to_page`, `get_case_study`
- **Knowledge**: FMai service catalog, pricing, case studies, process
- **Context-aware**: Knows which page visitor is on, adapts greeting

### Persona 2: E-commerce Advisor (Demo)

- **Location**: Embedded in /chatbots demo playground
- **Purpose**: Show how a webshop chatbot works — product advice, routines, cart
- **Model**: Haiku default
- **Tools**: `search_products`, `get_product_details`, `build_routine`, `add_to_cart_suggestion`
- **Knowledge**: Mock skincare product catalog (based on SKC data, anonymized)
- **Demo scenario**: "You're browsing a skincare webshop"

### Persona 3: Lead Qualification Bot (Demo)

- **Location**: Embedded in /chatbots demo playground
- **Purpose**: Show how a lead gen bot qualifies prospects
- **Model**: Haiku default, Sonnet for scoring
- **Tools**: `qualify_lead`, `get_pricing_info`, `schedule_demo`, `get_roi_estimate`
- **Knowledge**: B2B qualification frameworks, ICP criteria, ROI benchmarks
- **Demo scenario**: "You're a visitor on a B2B SaaS website"

### Persona 4: Knowledge Base / Support (Demo)

- **Location**: Embedded in /chatbots demo playground
- **Purpose**: Show how a support bot works with RAG/knowledge base
- **Model**: Haiku default
- **Tools**: `search_knowledge_base`, `create_ticket`, `check_status`, `escalate_to_human`
- **Knowledge**: Mock helpdesk FAQ, troubleshooting guides
- **Demo scenario**: "You're a customer with a technical question"

### Persona 5: Multi-Platform Agent (Visual)

- **Location**: Visual showcase section on /chatbots
- **Format**: Animated architecture diagram, not interactive
- **Content**: 1 backend → website + Shopify + WhatsApp, SKC case study

### Persona 6: Demo Guide (ARIA v2)

- **Location**: Floating widget on demo pages (/explorer, /calculator, /dashboard)
- **Purpose**: Guide users through the marketing machine demo (upgraded ARIA)
- **Model**: Haiku default
- **Tools**: `navigate_to_page`, `explain_module`, `get_roi_info`, `book_demo`
- **Knowledge**: Marketing machine modules, demo flow, ROI data
- **Context-aware**: Knows which demo page, which modules viewed

## /chatbots Page Restructure

### New Layout

```
┌─ Hero ("Experience AI Chatbots in Action") ──────────────────┐
│  "Don't take our word for it — try them yourself"            │
│  CTA: scroll to playground                                    │
└──────────────────────────────────────────────────────────────┘

┌─ Demo Playground (NEW) ─────────────────────────────────────┐
│                                                               │
│  [🛒 E-commerce] [🎯 Lead Gen] [🛟 Support]  ← Tabs        │
│                                                               │
│  ┌─ Context Card ──────┐  ┌─ Chat Widget ──────────────────┐│
│  │ Scenario description│  │ Streaming chat + tool results   ││
│  │ What this bot does  │  │ Suggested conversation starters ││
│  │ Key capabilities    │  │ Demo mode badge + msg counter   ││
│  └─────────────────────┘  └─────────────────────────────────┘│
│                                                               │
│  Progressive CTA bar                                          │
└──────────────────────────────────────────────────────────────┘

┌─ Multi-Platform Showcase (NEW) ──────────────────────────────┐
│  Animated: 1 backend → website + Shopify + WhatsApp          │
│  SKC case study: "Real client, 2 platforms, 1 AI brain"      │
└──────────────────────────────────────────────────────────────┘

┌─ Use Cases (updated links to demos above) ───────────────────┘
┌─ Process + Pricing + FAQ (existing, preserved) ──────────────┘
```

### Conversion Funnel

```
Tab select → Suggested starters → AI interaction → Progressive CTAs
  Message 1-4: Pure demo experience
  Message 5:   Subtle "Impressed? We build this for your business"
  Message 10:  Stronger CTA + Calendly embed option
  Message 15:  "Demo limit — book a call for unlimited demo"
```

## What Gets Removed

- `src/components/ai-assistant/` (entire ARIA directory)
- `src/services/llmService.ts`
- `src/utils/conversationEngine.ts`, `intentRecognition.ts`, `questionMatcher.ts`
- `src/stores/chatStore.ts`, `src/stores/journeyStore.ts`
- `src/types/chat.ts`
- `src/config/knowledgeBase.json`, `conversationPersonality.ts`, `platformKnowledge.ts`, `assistantJourneys.ts`
- `src/hooks/useModuleFollowUp.ts`, `useJourneyNudges.ts`, `useAchievementTracking.ts`
- `api/chat.ts` (OpenAI proxy)
- OpenAI/OpenRouter dependencies

## What Gets Built (New)

- `api/chatbot.ts` — Single persona-aware API endpoint (Vercel serverless)
- `src/lib/chatbot/engine.ts` — Core chatbot engine
- `src/lib/chatbot/personas/` — Per-persona configs (system prompt, tools, knowledge, topic router)
- `src/lib/chatbot/tools/` — Tool definitions + executors per persona
- `src/lib/chatbot/topic-router.ts` — Zero-latency knowledge selection
- `src/lib/chatbot/types.ts` — TypeScript types
- `src/lib/chatbot/rate-limiter.ts` — Session + global rate limiting
- `src/lib/chatbot/security.ts` — Input validation, output sanitization
- `src/components/chatbot/ChatWidget.tsx` — Shared UI (floating + embedded modes)
- `src/components/chatbot/ChatMessages.tsx` — Message rendering with streaming
- `src/components/chatbot/ChatInput.tsx` — Input with suggested prompts
- `src/components/chatbot/PersonaSelector.tsx` — Tab selector for demos
- `src/components/chatbot/DemoPlayground.tsx` — Full demo section component
- `src/components/chatbot/tool-results/` — ProductCard, LeadScoreCard, KBArticleCard, TicketCard
- `src/components/chatbot/MultiPlatformShowcase.tsx` — Visual diagram
- `src/stores/chatStore.ts` — New Zustand store (per-persona history)

## What Gets Reused from SKC

- Streaming architecture pattern (Vercel AI SDK + @ai-sdk/anthropic)
- Hybrid prompt caching pattern (static prefix + dynamic knowledge)
- Tool availability matrix pattern
- Topic router algorithm (keyword scoring + priority)
- Dual-model routing pattern (complexity detection)
- Error handling + rate limiting patterns
- ChatWidget UI patterns (adapted to FMai Living System design)

## Dependencies

- `@ai-sdk/anthropic` (replaces openai)
- `ai` (Vercel AI SDK)
- `zod` (tool schema validation)
- Remove: `openai` package

## Security & Cost Controls

- Max 15 messages per demo session
- Max 100 requests/hour global rate limit
- Max 10 requests/minute per IP
- Input validation: max 500 chars, PII blocking
- Output sanitization: API key/email redaction
- Demo mode flag prevents real integrations
- Prompt injection guardrails in system prompts
- Graceful degradation with template responses on API failure

## i18n

- All personas support EN/NL/ES
- System prompts include language instruction
- Suggested conversation starters per language
- Tool results rendered in user's language
- Demo scenario descriptions translated

## Phase Breakdown

- **Phase 15**: Chatbot Engine Foundation — API endpoint, streaming, prompt caching, tool calling framework, persona router, rate limiting, security
- **Phase 16**: Chatbot Personas & Knowledge — Build all 5 persona configs (system prompts, tools, knowledge bases, topic routers)
- **Phase 17**: ChatWidget UI — Shared component (floating + embedded modes), message rendering, streaming display, tool result cards
- **Phase 18**: ChatbotsPage Demo Playground — Tab selector, demo playground section, conversation starters, progressive CTAs, multi-platform visual showcase
- **Phase 19**: Homepage Concierge + Demo Guide — Replace ARIA with concierge persona (floating), wire demo-guide persona to demo pages, page context detection, remove old ARIA code
