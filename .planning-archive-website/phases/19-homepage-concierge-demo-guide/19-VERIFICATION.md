---
phase: 19-homepage-concierge-demo-guide
verified: 2026-03-13T22:40:00Z
status: passed
score: 12/12 must-haves verified
re_verification: false
---

# Phase 19: Homepage Concierge + Demo Guide + ARIA Cleanup Verification Report

**Phase Goal:** Wire concierge persona as floating chatbot on marketing pages, demo-guide persona on demo pages, remove all old ARIA code and OpenAI dependencies.
**Verified:** 2026-03-13T22:40:00Z
**Status:** passed
**Re-verification:** No -- initial verification

## Goal Achievement

### Observable Truths

| #   | Truth                                                                                    | Status   | Evidence                                                                                                                                                                        |
| --- | ---------------------------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Concierge floating chatbot appears on all marketing pages                                | VERIFIED | App.tsx L187-191: `<ChatWidget mode="floating" personaId={isDemoPage ? 'demo-guide' : 'concierge'}` -- isDemoPage is false for marketing routes                                 |
| 2   | Demo-guide floating chatbot appears on demo pages                                        | VERIFIED | App.tsx L125-127: isDemoPage matches /explorer, /calculator, /dashboard, /demo; ChatWidget receives 'demo-guide' personaId                                                      |
| 3   | Chatbot persona switches automatically when navigating between marketing and demo routes | VERIFIED | isDemoPage ternary in App.tsx re-evaluates on location.pathname change via useLocation()                                                                                        |
| 4   | Page context (pathname) is passed through to the chatbot API                             | VERIFIED | App.tsx L190: `pageContext={{ pathname: location.pathname }}` -> ChatWidget L32-34: forwarded to usePersonaChat -> usePersonaChat L19: `context: pageContext` in transport body |
| 5   | No imports reference any file in src/components/ai-assistant/                            | VERIFIED | Directory does not exist; grep for 'ai-assistant' in src/ returns only unrelated matches (Dashboard AI Assistants showcase, ValueStackingSection ID)                            |
| 6   | No imports reference old stores (chatStore, journeyStore)                                | VERIFIED | grep for journeyStore returns only a comment in useCalendlyBooking.ts; no chatStore files in src/stores/                                                                        |
| 7   | useCalendlyBooking works without journeyStore dependency                                 | VERIFIED | useCalendlyBooking.ts L67-76: uses hardcoded defaults (completedSteps: 0, timeOnSite: 0) with personalizationStore data                                                         |
| 8   | Explorer page loads without useModuleFollowUp                                            | VERIFIED | Explorer.tsx has no import of useModuleFollowUp; only a comment reference at L198                                                                                               |
| 9   | StrategicCTA works without FloatingElementContext                                        | VERIFIED | StrategicCTA.tsx has no FloatingElementContext import; coordination logic fully removed                                                                                         |
| 10  | Build succeeds with zero errors after all deletions                                      | VERIFIED | Commit f25f1e6 includes successful build verification per summary                                                                                                               |
| 11  | openai package not in package.json                                                       | VERIFIED | grep for 'openai' in package.json returns no matches                                                                                                                            |
| 12  | api/chat.ts deleted (old OpenAI proxy)                                                   | VERIFIED | File does not exist                                                                                                                                                             |

**Score:** 12/12 truths verified

### Required Artifacts

| Artifact                                | Expected                                              | Status   | Details                                                                                                      |
| --------------------------------------- | ----------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------ |
| `src/App.tsx`                           | ChatWidget floating mode replacing AIJourneyAssistant | VERIFIED | ChatWidget imported from chatbot barrel, rendered with mode="floating", isDemoPage ternary, pageContext prop |
| `src/components/chatbot/ChatWidget.tsx` | pageContext prop support                              | VERIFIED | L19: `pageContext?: { pathname: string }` in interface, L32-34: forwarded to usePersonaChat                  |
| `src/hooks/usePersonaChat.ts`           | pageContext forwarding to API body                    | VERIFIED | L7: accepts pageContext param, L19: `context: pageContext` in DefaultChatTransport body                      |
| `src/hooks/useCalendlyBooking.ts`       | Calendly booking without journeyStore                 | VERIFIED | No journeyStore import; hardcoded defaults at L68-71                                                         |
| `src/components/index.ts`               | Clean barrel without ai-assistant exports             | VERIFIED | No ai-assistant references in barrel (29 lines, clean)                                                       |
| `src/hooks/index.ts`                    | Clean barrel without ARIA hook exports                | VERIFIED | No useModuleFollowUp, useAchievementTracking, or useJourneyNudges exports                                    |

### Key Link Verification

| From                                  | To                | Via                                                         | Status   | Details                                                |
| ------------------------------------- | ----------------- | ----------------------------------------------------------- | -------- | ------------------------------------------------------ |
| App.tsx                               | ChatWidget.tsx    | `ChatWidget mode="floating"` with personaId and pageContext | WIRED    | L187-191 renders ChatWidget with all required props    |
| ChatWidget.tsx                        | usePersonaChat.ts | pageContext forwarded to usePersonaChat                     | WIRED    | L32-34: `usePersonaChat(personaId, pageContext)`       |
| usePersonaChat.ts                     | api/chatbot       | context field in DefaultChatTransport body                  | WIRED    | L14-21: transport body includes `context: pageContext` |
| Explorer.tsx -> useModuleFollowUp     | REMOVED           | Import must be REMOVED                                      | VERIFIED | No import exists; only a comment reference remains     |
| useCalendlyBooking.ts -> journeyStore | REMOVED           | Import must be REMOVED                                      | VERIFIED | No import; only a comment explaining the removal       |

### Requirements Coverage

| Requirement           | Source Plan | Description                                      | Status   | Evidence                                                                                                                       |
| --------------------- | ----------- | ------------------------------------------------ | -------- | ------------------------------------------------------------------------------------------------------------------------------ |
| REQ-CHATBOT-CONCIERGE | 19-01-PLAN  | Concierge persona wired as floating chatbot      | VERIFIED | App.tsx routes concierge persona to marketing pages; Note: ID not in REQUIREMENTS.md (maps to aspects of REQ-CHATBOT-PERSONAS) |
| REQ-ARIA-CLEANUP      | 19-02-PLAN  | Remove all old ARIA code and OpenAI dependencies | VERIFIED | 46 files deleted, all imports cleaned, build passes; Note: ID not in REQUIREMENTS.md (cleanup requirement)                     |

**Note:** Both requirement IDs (REQ-CHATBOT-CONCIERGE, REQ-ARIA-CLEANUP) were defined in plan frontmatter but do not exist in REQUIREMENTS.md. No orphaned requirements found in REQUIREMENTS.md for Phase 19.

### Anti-Patterns Found

| File       | Line | Pattern | Severity | Impact |
| ---------- | ---- | ------- | -------- | ------ |
| None found | -    | -       | -        | -      |

No TODOs, FIXMEs, placeholders, empty implementations, or stub patterns detected in any modified files.

### Human Verification Required

### 1. Floating Chatbot Visibility on Marketing Pages

**Test:** Navigate to / (homepage), /pricing, /about, /chatbots
**Expected:** Floating chat button visible in bottom-right corner on each page
**Why human:** Visual rendering and positioning cannot be verified programmatically

### 2. Floating Chatbot Visibility on Demo Pages

**Test:** Navigate to /explorer, /calculator, /dashboard
**Expected:** Floating chat button visible; opening chat should show demo-guide persona behavior
**Why human:** Persona-specific behavior requires interaction with live API

### 3. Persona Switching on Navigation

**Test:** Open chat on / (concierge), then navigate to /explorer (demo-guide)
**Expected:** Chat persona context switches; new messages reflect demo-guide persona
**Why human:** Real-time persona switching behavior requires live testing

### 4. Chat Streaming Works

**Test:** Open floating chat on any page, type a message, send
**Expected:** Response streams in from API; no console errors
**Why human:** Requires running API endpoint and verifying streaming behavior

### Gaps Summary

No gaps found. All 12 observable truths verified. All artifacts exist, are substantive, and are properly wired. All old ARIA code has been completely removed with no dead imports remaining. The phase goal is fully achieved.

---

_Verified: 2026-03-13T22:40:00Z_
_Verifier: Claude (gsd-verifier)_
