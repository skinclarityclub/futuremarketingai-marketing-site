---
title: Deferred Items - Phase 01 Website Rebrand
tags: [deferred, phase-01]
created: 2026-03-20
---

# Deferred Items

## Pre-existing Build Error: PRODUCT_CATALOG Export

**Found during:** 01-04 execution (build verification)
**File:** `fmai-nextjs/src/lib/chatbot/tools/ecommerce-tools.ts:3`
**Issue:** Import `PRODUCT_CATALOG` from `../knowledge/ecommerce-kb` does not exist. The module exports `ECOMMERCE_TOPICS` instead.
**Impact:** Build fails with module resolution error in the chatbot API route.
**Not fixed because:** Pre-existing issue, not caused by 01-04 changes. Out of scope per deviation rules.
**Fix:** Rename the import to `ECOMMERCE_TOPICS` or add a `PRODUCT_CATALOG` export to `ecommerce-kb.ts`.
