# Phase 4: Compliance - Research

**Researched:** 2026-03-20
**Domain:** EU AI Act transparency, GDPR/AVG data processing agreements, legal document drafting
**Confidence:** HIGH

## Summary

Phase 4 is a legal/compliance phase, not a code-heavy engineering phase. The work splits into two categories: (1) technical implementation of AI disclosure in the chatbot widget and voice agent greeting, and (2) drafting legal documents (DPA, DPIA, updated ToS, updated privacy policy). The existing legal research document (`docs/wetgeving-aaas-nederland-eu.md`) provides comprehensive Dutch/EU regulatory context that directly maps to every requirement in this phase.

The chatbot widget (`ChatWidgetIsland.tsx`) currently has a welcome message that does NOT include AI disclosure -- it says "Hi! I'm the FMai Concierge" without mentioning it is an AI assistant. The demo playground personas similarly lack disclosure. The voice agent uses Vapi with an assistant configured via `VITE_VAPI_DEMO_ASSISTANT_ID` -- the greeting is configured in the Vapi dashboard, not in code. The legal page (`/legal`) currently has placeholder-level terms, privacy, cookies, and disclaimer sections that need substantial expansion for AaaS-specific content.

**Primary recommendation:** Split this phase into two plans: (1) technical AI disclosure implementation in chatbot + Vapi config, and (2) legal document drafting for DPA, DPIA, ToS, and privacy policy updates.

<phase_requirements>

## Phase Requirements

| ID      | Description                                                      | Research Support                                                                                                                                                                                 |
| ------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| COMP-01 | AI-disclosure text in chatbot widget ("Ik ben een AI-assistent") | ChatWidgetIsland.tsx welcomeMessage needs update; ChatMessages.tsx shows welcome message when messages array is empty; also add persistent disclosure badge in ChatHeader.tsx                    |
| COMP-02 | AI-disclosure in voice agent (Vapi greeting identifies as AI)    | Vapi assistant greeting is configured via dashboard (assistant ID from env var); useVapiCall.ts calls `vapi.start(assistantId)` -- greeting text lives in Vapi dashboard config, not in codebase |
| COMP-03 | Verwerkersovereenkomst (DPA) template drafted                    | New document needed; wetgeving doc section 2.1 provides required DPA contents list; template should cover processing chain (FMai -> agency -> agency's clients)                                  |
| COMP-04 | DPIA document created for AI agent data processing               | New document needed; wetgeving doc section 2.5 provides DPIA criteria and required contents; AP has AI on high-risk processing list                                                              |
| COMP-05 | Terms of service updated with AaaS-specific clauses              | Current ToS in en.json is a single paragraph placeholder; needs AaaS service description, liability limits, AI output disclaimers, SLA terms                                                     |
| COMP-06 | Privacy policy updated for agent data processing                 | Current privacy policy in en.json is a single paragraph placeholder; needs AI data processing descriptions, sub-processor list, retention periods, data subject rights                           |

</phase_requirements>

## Standard Stack

### Core

This phase is primarily document/content work, not library work. The technical changes use the existing stack:

| Library       | Version      | Purpose                                  | Why Standard                              |
| ------------- | ------------ | ---------------------------------------- | ----------------------------------------- |
| next-intl     | (existing)   | i18n for disclosure text across EN/NL/ES | Already used for all website translations |
| React/Next.js | (existing)   | Component updates for disclosure UI      | Existing chatbot components               |
| Vapi          | @vapi-ai/web | Voice agent config                       | Already integrated via useVapiCall.ts     |

### Supporting

No new libraries needed. This phase modifies existing components and creates new content/documents.

### Alternatives Considered

| Instead of             | Could Use                                      | Tradeoff                                                                                                                              |
| ---------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Inline disclosure text | Cookie-consent-style banner for AI disclosure  | Overkill -- a simple text line in the chat widget header and welcome message is sufficient and matches EU AI Act Art. 50 requirements |
| Manual DPA/DPIA docs   | Legal SaaS template services (Iubenda, Termly) | Could use for initial templates but need AaaS-specific customization; manual drafting gives full control                              |

## Architecture Patterns

### Pattern 1: AI Disclosure in Chatbot Widget

**What:** Add a persistent "AI assistant" disclosure visible at all times in the chat interface, plus update welcome messages to explicitly state AI nature.

**When to use:** Required by EU AI Act Article 50 (mandatory from August 2026, but implementing now for compliance readiness).

**Implementation approach:**

1. Add a disclosure line in `ChatHeader.tsx` below the persona name (e.g., "AI-assistent" badge)
2. Update `ChatWidgetIsland.tsx` welcomeMessage to include AI disclosure
3. Update `DemoPlayground.tsx` PERSONA_WELCOME messages to include AI disclosure
4. Add translated disclosure strings to all 3 locale files (en.json, nl.json, es.json)

**Key files to modify:**

- `fmai-nextjs/src/components/chatbot/ChatHeader.tsx` -- add disclosure badge
- `fmai-nextjs/src/components/chatbot/ChatWidgetIsland.tsx` -- update welcome message
- `fmai-nextjs/src/components/chatbot/DemoPlayground.tsx` -- update persona welcome messages
- `fmai-nextjs/messages/en.json`, `nl.json`, `es.json` -- add disclosure translations

### Pattern 2: Voice Agent AI Disclosure

**What:** Ensure Vapi voice agent greeting identifies itself as AI at the start of every conversation.

**When to use:** Required by EU AI Act Article 50 for voice-based AI systems.

**Implementation approach:**

- The Vapi assistant is configured externally via the Vapi dashboard (assistant ID stored as `VITE_VAPI_DEMO_ASSISTANT_ID` env var)
- The greeting/first message is set in the Vapi assistant configuration, NOT in the React codebase
- This is a Vapi dashboard configuration change, not a code change
- Document the required greeting text so it can be applied in the Vapi dashboard
- Note: The old Vite-based code in `src/hooks/useVapiCall.ts` may need to be migrated or the Next.js app may have its own Vapi integration

### Pattern 3: Legal Page Content Expansion

**What:** Replace the current single-paragraph placeholders in the legal page with comprehensive AaaS-specific legal content.

**When to use:** Required for COMP-05 and COMP-06.

**Implementation approach:**

- The legal page at `fmai-nextjs/src/app/[locale]/(legal)/legal/page.tsx` renders sections from translation keys
- Current sections: terms, privacy, cookies, disclaimer
- Content lives in locale JSON files under the `legal.sections` namespace
- The page component renders each section as a single `<p>` tag -- this needs to change to support multi-paragraph, structured legal content
- Consider using markdown rendering or multiple subsection keys for each legal section
- All 3 locales (EN/NL/ES) need updated content

### Pattern 4: Standalone Legal Documents (DPA, DPIA)

**What:** DPA and DPIA are standalone documents, not website pages. They are PDFs or markdown docs shared with clients.

**When to use:** COMP-03 (DPA) and COMP-04 (DPIA).

**Implementation approach:**

- Create as markdown files in `docs/legal/` directory
- DPA template: based on the required contents listed in wetgeving doc section 2.1
- DPIA document: based on the required contents listed in wetgeving doc section 2.5
- These are NOT published on the website -- they are internal/client-facing documents
- Can later be converted to PDF for professional distribution

### Anti-Patterns to Avoid

- **Over-engineering the legal page:** Do not build a CMS or complex rendering system. The legal page just needs to display structured text. Use translation keys with subsections.
- **Hardcoding disclosure text:** Do not hardcode English-only disclosure. Use the existing i18n system (next-intl) for all disclosure text.
- **Ignoring the processing chain:** The DPA must address the full chain: FMai (sub-processor) -> Agency (processor) -> Agency's clients (data subjects/controllers). Do not write a simple two-party DPA.
- **Putting DPA/DPIA on the website:** These are confidential client documents, not public web pages.

## Don't Hand-Roll

| Problem                   | Don't Build               | Use Instead                                                        | Why                                                          |
| ------------------------- | ------------------------- | ------------------------------------------------------------------ | ------------------------------------------------------------ |
| DPA template structure    | Custom legal framework    | Follow AP/ICTrecht standard DPA template structure                 | Legal compliance requires specific elements per Art. 28 GDPR |
| DPIA assessment framework | Custom risk matrix        | Follow AP's DPIA model (based on WP29 guidelines)                  | Regulatory acceptance requires recognized methodology        |
| Legal content formatting  | Custom rich text renderer | Structured translation keys with the existing legal page component | Minimal change, consistent with existing architecture        |

**Key insight:** Legal document content is the hard part, not the technical implementation. The code changes are trivial (add text, update components). The document drafting requires careful adherence to GDPR Art. 28 (DPA) and Art. 35 (DPIA) requirements.

## Common Pitfalls

### Pitfall 1: Disclosure Only in Welcome Message

**What goes wrong:** Putting AI disclosure only in the welcome message means users who scroll past it or open the chat mid-conversation miss it.
**Why it happens:** Developers treat disclosure as a one-time greeting rather than a persistent UI element.
**How to avoid:** Add BOTH a persistent badge/label in the ChatHeader AND disclosure in the welcome message. The header badge ensures disclosure is always visible.
**Warning signs:** If you can open the chat and not immediately see an AI disclosure indicator, it is insufficient.

### Pitfall 2: Missing Sub-Processor List in DPA

**What goes wrong:** DPA omits listing specific sub-processors (OpenAI, Anthropic, Supabase, Vercel, Vapi, etc.).
**Why it happens:** Overlooking the GDPR requirement that the controller must approve each sub-processor.
**How to avoid:** Include a complete sub-processor annex in the DPA listing: company name, purpose, location, and DPA status for each.
**Warning signs:** If the DPA does not have an appendix listing sub-processors, it is incomplete.

### Pitfall 3: Placeholder Legal Content That Does Not Cover AaaS

**What goes wrong:** Terms of service and privacy policy remain generic "we provide services" text without addressing AI agent-specific risks, data processing, liability limitations, or output accuracy disclaimers.
**Why it happens:** Treating legal content as a checkbox rather than a substantive business protection.
**How to avoid:** Use the wetgeving research doc section 5.2 (AV requirements) and section 2.1 (DPA requirements) as a checklist for content that MUST be present.
**Warning signs:** If the ToS does not mention "AI", "agent", "automated processing", or "liability limitation", it is too generic.

### Pitfall 4: Dutch-Only Legal Documents

**What goes wrong:** Writing legal docs only in Dutch while serving UK agencies too.
**Why it happens:** The regulatory research is in Dutch, so drafting follows naturally in Dutch.
**How to avoid:** Draft DPA and DPIA in Dutch (primary jurisdiction) with English versions for UK market. ToS and privacy policy on the website already have EN/NL/ES via i18n.
**Warning signs:** If founding members include UK agencies (per GTM phase: 20 UK targets), English legal documents are essential.

### Pitfall 5: Vapi Greeting Not Updated

**What goes wrong:** Code changes are deployed but the Vapi dashboard assistant configuration still has a greeting that does not identify as AI.
**Why it happens:** Vapi config is external to the codebase -- it is easy to forget.
**How to avoid:** Include a specific task to update the Vapi dashboard configuration with the documented greeting text. Create a verification step that involves actually calling the voice agent.
**Warning signs:** If the plan only mentions code changes and not Vapi dashboard config, COMP-02 will be missed.

## Code Examples

### AI Disclosure Badge in ChatHeader

```typescript
// Add below persona name in ChatHeader.tsx
<span className="text-[10px] text-text-muted/60 uppercase tracking-wider">
  AI Assistant
</span>
```

### Updated Welcome Message with Disclosure

```typescript
// ChatWidgetIsland.tsx
welcomeMessage =
  "Hi! I'm an AI assistant — the FMai Concierge. I can help you explore our skills, demo our AI agents, or book a discovery call. What would you like to know?"
```

### Translation Key Structure for Disclosure

```json
{
  "chatbot": {
    "disclosure": {
      "badge": "AI Assistant",
      "welcome_prefix": "I'm an AI assistant"
    }
  }
}
```

### Legal Page Section Structure (expanded)

```json
{
  "legal": {
    "sections": {
      "terms": {
        "title": "Terms of Service",
        "subsections": {
          "service_description": { "title": "...", "content": "..." },
          "subscription_terms": { "title": "...", "content": "..." },
          "ai_output_disclaimer": { "title": "...", "content": "..." },
          "liability_limitation": { "title": "...", "content": "..." },
          "data_processing": { "title": "...", "content": "..." },
          "termination": { "title": "...", "content": "..." }
        }
      }
    }
  }
}
```

## State of the Art

| Old Approach                        | Current Approach                                                    | When Changed                                   | Impact                                                 |
| ----------------------------------- | ------------------------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------------ |
| No AI disclosure required           | EU AI Act Art. 50 requires disclosure for chatbots and voice agents | Mandatory Aug 2026, recommended now            | Must implement before launch                           |
| Generic ToS sufficient for SaaS     | AaaS needs AI-specific liability clauses and output disclaimers     | EU AI Act + AI Liability withdrawal (Feb 2025) | Contractual protection is the primary liability shield |
| DPIA optional for marketing tools   | AP lists AI on high-risk processing list, DPIA mandatory            | AP guidance 2025-2026                          | Must complete before processing personal data          |
| Privacy Shield for US data transfer | EU-US DPF (July 2023) but Schrems III risk                          | Ongoing                                        | Use EU data residency for OpenAI/Anthropic APIs        |

## Open Questions

1. **Vapi Assistant Configuration Access**
   - What we know: The voice agent greeting is configured in the Vapi dashboard, not in code. The assistant ID is stored as an env var.
   - What is unclear: Whether the user has Vapi dashboard access and can update the greeting text. Also unclear if the Next.js app has its own Vapi integration or still uses the old Vite-based `src/hooks/useVapiCall.ts`.
   - Recommendation: Planner should include a task to verify Vapi dashboard access and document the exact greeting text to configure. Flag the old vs. new Vapi integration question.

2. **Legal Document Language Priority**
   - What we know: Website serves EN/NL/ES. Target market is 30 NL + 20 UK agencies.
   - What is unclear: Whether DPA and DPIA should be drafted in Dutch (legal jurisdiction) or English (wider reach) first.
   - Recommendation: Draft in Dutch first (Dutch BV, Dutch jurisdiction), then create English translations. The website ToS/privacy use i18n so all 3 languages are handled automatically.

3. **Legal Page Component Restructuring**
   - What we know: Current legal page renders each section as a single `<p>` tag, which cannot handle the expanded multi-subsection content needed.
   - What is unclear: Whether to restructure the component to support subsections or keep it simple with long-form content per section.
   - Recommendation: Use a subsection pattern in the translation keys and update the component to render subsections. This keeps content structured and maintainable.

4. **Professional Legal Review**
   - What we know: The wetgeving doc explicitly states "Dit is een onderzoeksoverzicht, geen juridisch advies."
   - What is unclear: Whether the drafted documents will be reviewed by a lawyer before use.
   - Recommendation: Draft documents to the best possible standard using the research. Flag that professional legal review is strongly recommended before sending DPA to clients or relying on ToS for liability protection.

## Existing Assets and Context

### Legal Research Document

`docs/wetgeving-aaas-nederland-eu.md` -- comprehensive 526-line research document covering:

- EU AI Act risk classification and transparency obligations (Art. 50)
- GDPR/AVG DPA requirements (Art. 28) with required contents checklist
- DPIA requirements with AP criteria
- Telecom/voice regulations for Netherlands
- Commercial law (AV, liability, insurance)
- IP and copyright for AI-generated content
- Practical compliance checklist with priorities

This document is the primary source for all legal content drafting in this phase.

### Current Chatbot Implementation

- `ChatWidgetIsland.tsx` -- floating concierge widget, no AI disclosure
- `DemoPlayground.tsx` -- 3 demo personas, no AI disclosure in welcome messages
- `ChatHeader.tsx` -- shows persona name and avatar, no disclosure badge
- `ChatMessages.tsx` -- renders welcome message when no messages exist

### Current Legal Page

- `fmai-nextjs/src/app/[locale]/(legal)/legal/page.tsx` -- renders 4 sections from i18n
- Sections: terms, privacy, cookies, disclaimer -- all single-paragraph placeholders
- Available in EN/NL/ES via locale JSON files

### Voice Agent (Vapi)

- Old Vite app: `src/hooks/useVapiCall.ts` -- uses `@vapi-ai/web`, assistant ID from env var
- Greeting is configured in Vapi dashboard, not in code
- No AI disclosure in current greeting (needs verification via Vapi dashboard)

### Key Regulatory Deadlines

- **Feb 2025** (PASSED): AI literacy obligation in effect
- **Jul 2026**: New Dutch telemarketing opt-in rules
- **Aug 2026**: EU AI Act Art. 50 transparency obligations mandatory
- **Jun 2026**: Expected final Code of Practice for AI content transparency

## Sources

### Primary (HIGH confidence)

- `docs/wetgeving-aaas-nederland-eu.md` -- existing comprehensive legal research with cited sources
- Codebase analysis of chatbot components, legal page, Vapi integration

### Secondary (MEDIUM confidence)

- EU AI Act Article 50 text (referenced in wetgeving doc with URL)
- AP guidance on DPIA requirements (referenced in wetgeving doc)
- GDPR Art. 28 DPA requirements (well-established law)

### Tertiary (LOW confidence)

- Exact current state of Vapi dashboard assistant greeting configuration (cannot verify without dashboard access)
- Whether Next.js app has migrated Vapi integration from old Vite app

## Metadata

**Confidence breakdown:**

- AI disclosure implementation: HIGH -- straightforward component updates with clear requirements
- Legal document drafting: HIGH -- wetgeving research doc provides comprehensive requirements and structure
- Vapi voice agent disclosure: MEDIUM -- implementation is external to codebase (Vapi dashboard)
- Legal content quality: MEDIUM -- drafting without professional legal review carries inherent risk

**Research date:** 2026-03-20
**Valid until:** 2026-06-20 (legal landscape stable until EU AI Act Art. 50 enforcement in Aug 2026; Code of Practice final version expected Jun 2026 may add specifics)
