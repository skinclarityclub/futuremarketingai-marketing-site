# Phase 16: Chatbot Personas & Knowledge — Context

## Goal

Build all 5 persona configurations that plug into the Phase 15 engine. Each persona has: system prompt (with cache-friendly static prefix), tools with Zod schemas, knowledge base content, topic router keywords, suggested conversation starters (EN/NL/ES), and demo scenario descriptions.

## Design Reference

- Full design: `docs/plans/2026-03-13-chatbot-showcase-design.md`

## The 5 Personas

### Persona 1: Website Concierge

- **Purpose**: Hybrid tour guide + sales assistant on all marketing pages
- **Personality**: Friendly, professional, knowledgeable about all FMai services
- **Model**: Haiku default, Sonnet for complex service questions
- **Tools**:
  - `get_services` — Return FMai service info (automations, chatbots, voice agents, marketing machine)
  - `book_call` — Trigger Calendly booking flow
  - `navigate_to_page` — Suggest relevant page to visit
  - `get_case_study` — Return case study info (SKC, etc.)
- **Knowledge base**: FMai services, pricing tiers, process (discovery → build → optimize), team info, case studies
- **Topic router keywords**: services, pricing, automations, chatbots, voice, demo, contact, process, case study, ROI
- **Context-aware**: Knows which page visitor is on, adapts greeting
- **Conversation starters (EN)**: "What services do you offer?", "How much does a chatbot cost?", "Can I see a case study?"

### Persona 2: E-commerce Advisor (Demo)

- **Purpose**: Show how a webshop chatbot works
- **Personality**: Skincare expert, helpful, recommends products based on needs
- **Model**: Haiku default
- **Tools**:
  - `search_products` — Search mock product catalog by concern/skin type
  - `get_product_details` — Return detailed product info (price, ingredients, reviews)
  - `build_routine` — Assemble morning/evening skincare routine from products
  - `add_to_cart_suggestion` — Simulate add-to-cart with product + variant
- **Knowledge base**: Mock skincare catalog (anonymized from SKC — 8-10 products), skin types, concerns, ingredients
- **Demo scenario**: "You're browsing a premium skincare webshop. Ask for product recommendations, build a routine, or get ingredient advice."
- **Conversation starters (EN)**: "I have dry, sensitive skin", "What's a good morning routine?", "Do you have anything for acne?"
- **Tool result cards**: ProductCard (image, price, rating), RoutineCard (AM/PM steps)

### Persona 3: Lead Qualification Bot (Demo)

- **Purpose**: Show how a lead gen bot qualifies prospects
- **Personality**: Professional SDR, asks smart qualifying questions, scores leads
- **Model**: Haiku default, Sonnet for scoring logic
- **Tools**:
  - `qualify_lead` — Score lead based on collected info (company size, budget, timeline, use case)
  - `get_pricing_info` — Return pricing tiers for the demo SaaS product
  - `schedule_demo` — Trigger demo booking flow
  - `get_roi_estimate` — Calculate estimated ROI based on company profile
- **Knowledge base**: B2B SaaS qualification framework (BANT + MEDDIC lite), ICP criteria, pricing tiers, ROI benchmarks
- **Demo scenario**: "You're visiting a B2B SaaS website. The bot will qualify you as a lead, estimate your ROI, and offer to book a demo."
- **Conversation starters (EN)**: "I'm looking for a marketing automation tool", "What are your pricing plans?", "We're a team of 50 people"
- **Tool result cards**: LeadScoreCard (score /100, qualification stage, recommendation)

### Persona 4: Knowledge Base / Support (Demo)

- **Purpose**: Show how a support bot works with RAG/knowledge base
- **Personality**: Helpful support agent, empathetic, knows when to escalate
- **Model**: Haiku default
- **Tools**:
  - `search_knowledge_base` — Search mock FAQ/docs by query (returns article snippets + sources)
  - `create_ticket` — Create a mock support ticket (category, priority, description)
  - `check_status` — Check mock ticket status
  - `escalate_to_human` — Trigger human handoff flow (simulated)
- **Knowledge base**: Mock helpdesk FAQ (15-20 articles covering billing, technical, account, getting started)
- **Demo scenario**: "You're a customer with a question about a SaaS product. Ask for help, search the docs, or create a support ticket."
- **Conversation starters (EN)**: "How do I reset my password?", "I'm having trouble with my integration", "I want to cancel my subscription"
- **Tool result cards**: KBArticleCard (title, snippet, source link), TicketCard (ID, status, category)

### Persona 5: Demo Guide (ARIA v2)

- **Purpose**: Guide users through marketing machine demo (Explorer → Calculator → Dashboard)
- **Personality**: Enthusiastic guide, knows all 7 demo modules, encourages exploration
- **Model**: Haiku default
- **Tools**:
  - `navigate_to_page` — Navigate to demo page (explorer, calculator, dashboard)
  - `explain_module` — Explain a specific marketing machine module
  - `get_roi_info` — Return ROI data/calculator info
  - `book_demo` — Trigger Calendly booking
- **Knowledge base**: 7 marketing machine modules (Research & Planning, Manager Workflow, Content Pipeline, Telegram Control, Publishing Layer, Analytics Lab, Ad Builder), demo flow, ROI data
- **Context-aware**: Knows which demo page, which modules viewed, sends follow-ups
- **Conversation starters (EN)**: "Give me a tour", "What does the Content Pipeline do?", "How much can I save with this?"
- **Preserves from ARIA**: Page-context greetings, module follow-up messages, journey nudges, but powered by new engine

## SKC Code to Reference for Demo Data

- `C:\Users\daley\Desktop\skinclarityclub\src\lib\chatbot\sindy-knowledge-base.ts` — Knowledge structure pattern
- `C:\Users\daley\Desktop\skinclarityclub\src\lib\chatbot\sindy-system.ts` — System prompt builder pattern
- `C:\Users\daley\Desktop\skinclarityclub\src\lib\chatbot\platform-tools.ts` — Service info abstraction pattern
- `C:\Users\daley\Desktop\skinclarityclub\src\lib\chatbot\webshop-tools.ts` — Product tool implementation pattern

## ARIA Code to Reference for Demo Guide

- `C:\Users\daley\Desktop\Futuremarketingai\src\config\assistantJourneys.ts` — Industry-based journey configs
- `C:\Users\daley\Desktop\Futuremarketingai\src\utils\pageContext.ts` — Page detection + contextual greetings
- `C:\Users\daley\Desktop\Futuremarketingai\src\hooks\useModuleFollowUp.ts` — Module follow-up messages
- `C:\Users\daley\Desktop\Futuremarketingai\src\config\platformKnowledge.ts` — Module explanations

## i18n Requirements

All persona content needs EN/NL/ES:

- Conversation starters (3-4 per persona per language)
- Demo scenario descriptions
- Tool result labels
- System prompt language instruction: "Respond ONLY in {language}"

## Files to Create

```
src/lib/chatbot/personas/concierge.ts     — Persona config + system prompt
src/lib/chatbot/personas/ecommerce.ts     — Persona config + system prompt
src/lib/chatbot/personas/leadgen.ts       — Persona config + system prompt
src/lib/chatbot/personas/support.ts       — Persona config + system prompt
src/lib/chatbot/personas/demo-guide.ts    — Persona config + system prompt
src/lib/chatbot/personas/index.ts         — Registry + factory
src/lib/chatbot/knowledge/concierge-kb.ts — FMai service knowledge
src/lib/chatbot/knowledge/ecommerce-kb.ts — Mock product catalog
src/lib/chatbot/knowledge/leadgen-kb.ts   — B2B qualification framework
src/lib/chatbot/knowledge/support-kb.ts   — Mock helpdesk FAQ articles
src/lib/chatbot/knowledge/demo-guide-kb.ts — Marketing machine modules
src/lib/chatbot/tools/concierge-tools.ts  — Tool executors
src/lib/chatbot/tools/ecommerce-tools.ts  — Tool executors
src/lib/chatbot/tools/leadgen-tools.ts    — Tool executors
src/lib/chatbot/tools/support-tools.ts    — Tool executors
src/lib/chatbot/tools/demo-guide-tools.ts — Tool executors
```
