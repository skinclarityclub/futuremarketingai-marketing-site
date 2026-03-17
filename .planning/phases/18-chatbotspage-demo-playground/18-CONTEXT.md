# Phase 18: ChatbotsPage Demo Playground — Context

## Goal

Transform the /chatbots service page from static marketing into an interactive experience. Visitors can try 3 live chatbot demos (e-commerce, lead-gen, support) via tab switching. Each demo has scenario context, suggested starters, and session limits. Multi-platform showcase visualizes the 1-backend-multi-platform architecture. Progressive CTAs convert demo users to leads.

## Design Reference

- Full design: `docs/plans/2026-03-13-chatbot-showcase-design.md`

## Page Layout (New Structure)

```
┌─ Hero (updated) ─────────────────────────────────────────────┐
│  "Experience AI Chatbots in Action"                           │
│  "Don't take our word for it — try them yourself"            │
│  CTA: "Try a Demo Below" (smooth scroll to playground)        │
└──────────────────────────────────────────────────────────────┘

┌─ Demo Playground (NEW — main attraction) ────────────────────┐
│                                                               │
│  Tab Selector:                                                │
│  [🛒 E-commerce Advisor] [🎯 Lead Qualifier] [🛟 Support]   │
│                                                               │
│  Layout (desktop): Side-by-side                               │
│  ┌─ Context Card (30%) ──┐  ┌─ Chat Widget (70%) ──────────┐│
│  │                        │  │                               ││
│  │ Scenario:              │  │  [Streaming chat]             ││
│  │ "You're browsing a     │  │                               ││
│  │  skincare webshop..."  │  │  [Tool result cards]          ││
│  │                        │  │                               ││
│  │ This bot can:          │  │  [Suggested starters]         ││
│  │ • Recommend products   │  │                               ││
│  │ • Build routines       │  │  Input: [Type a message...]   ││
│  │ • Add to cart          │  │                               ││
│  │                        │  │  [Demo Mode · 12/15 msgs]     ││
│  └────────────────────────┘  └───────────────────────────────┘│
│                                                               │
│  Layout (mobile): Stacked (context card → chat below)         │
│                                                               │
│  Progressive CTA bar:                                         │
│  [msg 5: "Impressed? We build this for your business →"]     │
│  [msg 10: "Book a Free Strategy Session" + Calendly]          │
│  [msg 15: "Demo limit reached — book a call for full demo"]   │
└──────────────────────────────────────────────────────────────┘

┌─ Multi-Platform Showcase (NEW) ──────────────────────────────┐
│                                                               │
│  "One Brain, Every Channel"                                   │
│                                                               │
│  Animated diagram:                                            │
│  [Claude AI Brain] ──→ [Website Widget]                       │
│                   ──→ [Shopify Store]                         │
│                   ──→ [WhatsApp Business]                     │
│                                                               │
│  "Real case: SkinClarity Club uses one AI assistant           │
│   across their website AND Shopify store. Same knowledge,     │
│   different behavior per platform."                           │
│                                                               │
│  Stats: "70% inquiries handled · 24/7 · 2 platforms"         │
└──────────────────────────────────────────────────────────────┘

┌─ Use Cases (existing, updated) ──────────────────────────────┐
│  Cards now link to specific demo tabs above                   │
│  "Customer Service" → scrolls to Support tab                  │
│  "Lead Qualification" → scrolls to Lead Gen tab               │
└──────────────────────────────────────────────────────────────┘

┌─ Process (existing, preserved) ──────────────────────────────┐
┌─ Pricing (existing, preserved) ──────────────────────────────┐
┌─ FAQ (existing, preserved) ──────────────────────────────────┘
┌─ Final CTA (existing, preserved) ────────────────────────────┘
```

## Conversion Funnel Design

### Progressive CTA System

Based on research: Klue's Demo Arena generated $550K pipeline in 60 days with progressive engagement.

```
Messages 1-4:  Pure demo experience, no CTAs
Message 5:     Subtle banner: "Like what you see? We build custom chatbots →"
Message 10:    Stronger: "Ready to get your own? Book a free strategy session" [Calendly button]
Message 15:    Gate: "Demo limit reached. Book a call to experience the full version" [Calendly]
```

### Tab Switching Behavior

- Each tab has independent chat history
- Switching tabs preserves previous conversation
- New tab starts fresh with suggested prompts
- Demo message counter is per-tab

## Multi-Platform Showcase

### Visual Design

- Animated architecture diagram (CSS animations, no heavy libraries)
- Central "brain" node pulsing with connections to 3 platform nodes
- Each platform shows: icon, name, example behavior
- SKC case study as proof point

### Content

- **Website**: "Education-focused, books consultations, teaches skincare"
- **Shopify**: "Sales-focused, recommends products, builds routines, adds to cart"
- **WhatsApp**: "Quick support, order status, appointment reminders"
- **Proof**: "SkinClarity Club — 1 AI brain serving 2 platforms in production"

## Current ChatbotsPage Structure (What Changes)

- **Hero**: Updated copy (from "AI Chatbots That Never Sleep" → "Experience AI Chatbots in Action")
- **Use Cases section**: Keep 4 cards but add scroll-to-demo links
- **Product Demo Media**: REPLACED by DemoPlayground
- **Process/Pricing/FAQ/Final CTA**: Preserved as-is
- **NEW**: DemoPlayground section after hero
- **NEW**: MultiPlatformShowcase section after playground

## i18n Requirements

Update `public/locales/{en,nl,es}/chatbots.json`:

- New hero copy
- Demo tab labels
- Context card scenario descriptions (per persona, per language)
- Progressive CTA text
- Multi-platform showcase copy
- Demo mode labels ("Demo Mode", "messages remaining", etc.)

## Research Insights Applied

- **Playground-style demos convert best**: Real AI interaction, not scripted (Perplexity research)
- **Persona switching standardized by leaders**: Klue's 14-tour Demo Arena pattern
- **Progressive CTAs**: Don't gate immediately, let value build first
- **Context cards**: Explain what the demo does before interaction starts
- **Mobile**: Stack layout (context card → chat), not side-by-side

## Files to Create/Modify

```
NEW: src/components/chatbot/DemoPlayground.tsx      — Full demo section
NEW: src/components/chatbot/PersonaSelector.tsx      — Tab component
NEW: src/components/chatbot/DemoContextCard.tsx      — Scenario + capabilities
NEW: src/components/chatbot/ProgressiveCTA.tsx       — Message-count-based CTAs
NEW: src/components/chatbot/MultiPlatformShowcase.tsx — Animated diagram

MODIFY: src/pages/ChatbotsPage.tsx                   — Wire new sections
MODIFY: public/locales/en/chatbots.json              — New demo copy
MODIFY: public/locales/nl/chatbots.json              — NL translations
MODIFY: public/locales/es/chatbots.json              — ES translations
```
