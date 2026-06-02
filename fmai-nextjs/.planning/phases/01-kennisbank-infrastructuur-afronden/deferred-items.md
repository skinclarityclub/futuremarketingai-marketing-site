# Deferred Items — Phase 01

Out-of-scope discoveries logged during plan execution. NOT fixed by the discovering plan.

## From Plan 01-01 (2026-06-02)

- **Pre-existing TS error in `tests/e2e/audit-v2-lighthouse.spec.ts:90`** — `Object literal may only specify known properties, and 'timeout' does not exist in type 'TestDetails'`. Surfaced during full `tsc --noEmit`. Unrelated to the glossary work (file last touched by commit `0f070f9`). Out of scope per scope boundary. Needs a separate fix (likely move `timeout` into `test()`'s options arg rather than the details object).
