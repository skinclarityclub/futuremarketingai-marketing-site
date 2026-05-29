# Clyde Live Memory Panel — Design (v1, within-session)

> Status: **approved** 2026-05-29. Brainstormed with Daley. Next step: implementation plan via `writing-plans`. No code until the plan exists.

## Why

Clyde's core differentiator is "one brain, shared memory" (the `/memory` USP page). Today a prospect can read that claim but cannot feel it in the chat: nothing visibly demonstrates that Clyde retains and reuses what they tell him. A generic chatbot looks identical. This feature makes the memory USP tangible and hard to dismiss: as a B2B agency prospect chats, Clyde extracts salient facts into a visible, accumulating panel and refers back to them.

## Decisions log

| Decision | Choice | Rationale |
|---|---|---|
| Primary goal | Prove the memory USP | The differentiator no generic chatbot has; makes the `/memory` claim live |
| Surface | Visible "Wat Clyde over je onthoudt" panel in the sidebar | Visible structured capture is undeniable proof; implicit referencing is dismissible as ordinary chat |
| Scope | Within a single session, resets on "new chat" | YAGNI: no persistence, no PII consent, no privacy surface. Cross-session is a possible v2 |
| Capture mechanism | Tool-driven (`remember_context`) | The only genuinely AI-native option (regex would undercut the very USP); multilingual for free; reuses existing tool to card to sidebar infra; adds no API/rate-limit load |

Rejected: a separate per-message extraction LLM call (doubles API calls + rate-limit pressure, which the chatbot handover explicitly flags); client-side regex extraction (brittle, weak multilingual, and not AI, which contradicts the USP).

## Architecture and data flow

1. **Capture tool `remember_context`** — added to the flagship toolset in `tools/flagship-tools.ts` (`buildFlagshipTools`). Input schema = 6 optional fields the model fills as the prospect reveals them: `agencyName`, `niche`, `brandCount`, `teamSize`, `painPoint`, `goal`. `execute` echoes the fields back as `{ remembered: {...} }` (a capture tool: the work is recording, not computing). Not in the engine off-context strip. **Stripped in demo mode** (alongside `navigate_to_page`) so `toolChoice:'required'` cannot hijack a scripted demo step.

2. **Client accumulation** — a pure function `mergeMemory(prev, next)` (last-write-wins per field, empty strings ignored). A selector/effect in `ChatWidget` derives the full profile from every `remember_context` result in `messages` and mirrors it into `chatbotStore.memoryProfile`. Reset on `handleNewChat` and on messages-clear.

3. **Sidebar card `MemoryCard`** — new component in `components/chatbot/tool-results/`, mapped on `remember_context` in `TOOL_CARD_MAP` + `SIDE_PANEL_TOOLS`. Renders the **accumulated** profile from the store (not just the triggering call), so the panel visibly grows. Panel title via `useChatChrome` PANEL_TITLES (nl "Wat Clyde onthoudt" / en "What Clyde remembers" / es "Lo que Clyde recuerda"). Field labels localized nl/en/es inside the card.

4. **Recall** — captured facts live in the conversation history (the tool calls), so the model recalls them naturally. A short persona nudge in `personas/clyde.ts`: (a) call `remember_context` when the prospect shares concrete agency facts, (b) refer back to remembered facts in later replies. No system-prompt injection of the profile in v1 (history suffices).

## Error handling and edge cases

- Model does not call the tool on a turn: the panel simply does not fill that turn. No error; facts keep accumulating over the conversation.
- Duplicate or empty fields: `mergeMemory` is last-write-wins and ignores empty strings.
- Demo mode: tool is stripped, so it cannot derail a scripted step.
- New chat / messages cleared: `memoryProfile` resets.
- Single sidebar: a skills question shows the skills card; a captured fact shows the memory card (last-tool-wins). Acceptable for v1; a persistent memory badge is a possible later refinement.

## Testing

- `mergeMemory` as a pure function: unit test, no API.
- One gated live e2e (`RUN_CLYDE_LIVE`, chromium, ~1-2 calls, economical against the shared production rate-limit): send "We zijn een skincare-bureau met 8 merken, we verzuipen in content" then assert the memory panel shows niche=skincare and brands=8, and a follow-up reply references "8".

## Scope guard (YAGNI)

In scope: one tool, one card, one store field + merge fn, persona nudge, i18n labels, one unit test, one gated live e2e.
Out of scope (v1): persistence, backend, cross-session recall, profile injection into the system prompt, separate extraction call, a dedicated persistent memory badge.
