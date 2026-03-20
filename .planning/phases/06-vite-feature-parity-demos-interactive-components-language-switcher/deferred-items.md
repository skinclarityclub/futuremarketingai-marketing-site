---
title: Deferred Items - Phase 06
created: 2026-03-20
---

# Deferred Items

## Pre-existing Build Errors (Out of Scope)

1. **ecommerce-tools.ts** imports `PRODUCT_CATALOG` from `ecommerce-kb.ts` but the export doesn't exist (should be `ECOMMERCE_TOPICS`)
2. **support-tools.ts** imports `KB_ARTICLES` from `support-kb.ts` but the export doesn't exist

These are pre-existing issues not caused by Phase 06 changes.
