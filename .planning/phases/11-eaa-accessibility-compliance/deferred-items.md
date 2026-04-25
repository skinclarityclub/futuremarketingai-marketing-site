# Phase 11 — Deferred Items (Out-of-Scope Findings)

Surface during plan execution. Not part of any 11-* plan scope.
Track here so they are not lost; assign to a polish/cleanup phase later.

## Pre-existing lint errors (discovered during 11-02, 2026-04-25)

`npm run lint` in `fmai-nextjs/` reports **36 errors + 14 warnings** across files unrelated to a11y work:

- `verify-mega.cjs:1`, `verify-screenshots.js:1` — CommonJS `require()` forbidden by `@typescript-eslint/no-require-imports`. Should be migrated to ESM or excluded from lint config.
- `src/components/chat/ChatWidget.tsx:18-30` — `react-hooks/preserve-manual-memoization` and `react-hooks/exhaustive-deps` warnings on `useMemo(() => new DefaultChatTransport(...))`. Pre-existing from Phase 09 chatbot work.
- `src/lib/chatbot/engine.ts:131` — Unused variable `_`. Cosmetic.
- `tests/e2e/homepage.spec.ts:108` — Unused variable `banner`. Cosmetic.
- Other accumulated TypeScript warnings/errors in chatbot stack and e2e specs.

These lint failures exist on the parent commit `dd33f7e` (before 11-02 started) and are NOT introduced by 11-02. The plan only touched `src/app/globals.css`, which produces zero lint output.

**Action:** Open a focused cleanup plan (e.g. Phase 14 polish) that runs `npm run lint -- --fix` and manually addresses the remaining typed errors. Do NOT bundle this with 11-* a11y plans.
