# Clyde Memory Panel — Design (v2, cross-session)

> Status: **approved** 2026-05-30 (design). Builds on v1 (within-session), see
> `2026-05-29-clyde-memory-panel-design.md`. Implementation branch: TBD
> (`feature/clyde-memory-v2`). Plan: TBD via writing-plans.

## Why

v1 makes the "one brain, shared memory" USP tangible *within* a session: as a
B2B agency prospect chats, Clyde captures salient facts into a visible panel and
refers back to them. v2 makes the USP undeniable *across* sessions: a returning
or reloading prospect finds Clyde already remembers them. No generic chatbot
does this, so it is the strongest possible proof of the differentiator.

## Decisions log

| Decision | Choice | Rationale |
|---|---|---|
| Scope | Full v2 | Persistence + system-prompt injection + personalized welcome-back + dedicated memory badge |
| Persistence store | Dedicated `clyde:memory` localStorage entry, separate from the zustand store-persist | Lets us consent-gate and wipe precisely; adding `memoryProfile` to `partialize` would couple it to the whole store-persist and muddy gating/clearing |
| Consent | Persist only when `cookieConsent` exists (functional is always-on); visible "Wis geheugen" button + one transparency line; private mode / no consent -> no persistence (v1 fallback) | GDPR-defensible (chatting is the requested service) + transparent + reversible, while keeping the cross-session wow for most visitors |
| Returning recall | Inject the stored profile into the system prompt on `/api/chatbot` | A returning session has no history, so injection is the only way Clyde can *talk about* the remembered facts (not just show them) |
| Welcome-back | Personalized, client-side greeting derived from the profile (no API) | Maximal, instant wow; panel already filled |
| Memory visibility | Dedicated persistent memory badge in `ChatHeader` (click -> opens the memory side panel) | Decouples memory from the last-tool-wins side panel: a conversion card can still take the panel, but memory stays one click away |
| "Nieuwe chat" | Clears the conversation, KEEPS the persistent memory | Matches the "Clyde remembers you" USP; `handleNewChat` must stop calling `resetMemory()`. Only "Wis geheugen" clears the profile + localStorage |

Rejected: separate per-message extraction LLM pass (doubles API calls + rate-limit
pressure; contradicts the AI-native capture; already rejected in v1). A new cookie
consent category (touches the 3-locale banner UX, heavier than warranted).

## Architecture and data flow

Builds on v1 primitives: `MemoryProfile`, `mergeMemory`, `chatbotStore.memoryProfile`,
`MemoryCard`, the `remember_context` capture tool, and the accumulation effect in
`ChatMessages`.

1. **Persistence (consent-gated).** A small client module (`lib/chatbot/memory-persistence.ts`)
   reads/writes a `clyde:memory` localStorage entry. On mount, `ChatWidgetIsland`
   hydrates the entry into `chatbotStore.memoryProfile`. An effect writes the
   profile back whenever it changes AND `cookieConsent` exists. No consent / private
   mode (storage throws) -> skip persistence; behaviour falls back to v1
   (within-session only). Versioned payload (`{ v: 1, profile }`) for forward safety.

2. **System-prompt injection (returning recall).** The chat request to
   `/api/chatbot` includes the current `memoryProfile`. The engine, when the profile
   is non-empty, prepends a short system line: "You already know this about the
   visitor: agency {name}, niche {niche}, {brandCount} brands, team {teamSize},
   pain {painPoint}, goal {goal}. Refer to it naturally; do not re-ask." Only
   non-empty fields are included. No message text is persisted server-side.

3. **Personalized welcome-back (client-side).** `ChatWidgetIsland` derives the
   welcome: if a hydrated profile has at least `agencyName` (or enough signal),
   show a localized welcome-back ("Welkom terug. Nog steeds {brandCount}
   {niche}-merken bij {agencyName}? Waar wil je verder?" / en / es). Otherwise the
   normal page-aware welcome. No API call.

4. **Dedicated memory badge.** A small brain badge in `ChatHeader`, shown when the
   profile is non-empty, with the remembered-field count. Click -> `openSidePanel('remember_context', ...)`
   so the memory card is always reachable regardless of the last-tool-wins panel.
   Localized aria-label.

5. **Consent + transparency + wipe.** The memory card (or its panel footer) shows a
   one-line note ("Clyde onthoudt dit lokaal in je browser voor je volgende
   bezoek." / en / es) and a "Wis geheugen" button -> `resetMemory()` + clear the
   `clyde:memory` localStorage entry.

## Error handling and edge cases

- No consent / private mode (storage throws): no persistence; v1 within-session
  behaviour. All storage access wrapped in try/catch.
- Empty / partial profile: no welcome-back, no badge; injection includes only
  non-empty fields.
- "Nieuwe chat": resets the conversation but NOT the profile (remove the
  `resetMemory()` call from `handleNewChat`). "Wis geheugen" is the explicit clear.
- Corrupt / version-mismatched localStorage payload: ignore + treat as empty.
- Locale switch on return: welcome-back + injection are locale-aware at render/request time.
- SSR: hydration is client-only (effect on mount); no server read of localStorage.

## Testing

- `memory-persistence` read/write/clear + consent-gate + corrupt-payload: pure unit, no API.
- Welcome-back derivation (nl/en/es, empty vs filled): pure/unit render, no API.
- System-prompt injection: unit on the engine builder (profile -> injected line, empty -> nothing). No live call.
- One gated live e2e (`RUN_CLYDE_LIVE`): seed a profile in localStorage -> open chat in a fresh
  load -> assert personalized welcome-back + that Clyde references a fact on first reply.

## Scope guard (YAGNI)

In scope: localStorage persistence module + consent gate, hydrate + persist effects,
system-prompt injection (client send + engine inject), client-side welcome-back,
memory badge in header, transparency line + wipe button, `handleNewChat` keeps memory,
i18n for the new strings, unit tests + one gated live e2e.

Out of scope (v2): server-side / cross-device persistence, a backend memory store,
a separate extraction pass, editing remembered fields inline, expiry/TTL of the
stored profile.
