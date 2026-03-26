---
title: Deferred Items - Phase 21
created: 2026-03-16
tags:
  - deferred
  - phase-21
---

# Deferred Items

## Pre-existing Build Error in engine.ts

**Discovered during:** 21-01 execution
**File:** `src/lib/chatbot/engine.ts` (lines 134-135)
**Issue:** TypeScript errors with array filter/map on `unknown[]` type -- `(p: { type: string; }) => boolean` not assignable to `unknown` parameter type
**Impact:** `npm run build` fails due to these pre-existing errors (existed before Phase 21 changes)
**Action needed:** Add proper type assertions or cast in engine.ts filter/map calls
