# DECISION-PENDING: Credit pack name (15.000 credits / €697)

**Surface:** pricing.creditPacks.items.unlimited.name (NL/EN/ES)
**Plan:** 12-04, Task 2
**Status:** Default landed, awaiting Daley confirmation

## Default Applied (2026-04-25, plan 12-04)

Renamed `"Onbeperkt" / "Unlimited" / "Ilimitado"` -> **`"Max"`** in all 3 locales.

**Reasoning per audit 02 §2.1 + RESEARCH §7:**

The pack ships 15.000 credits. That is *not* unlimited. Calling it "Onbeperkt"
on the marketing site contradicts the transparency claim and creates a
bait-and-switch on the invoice. Renaming to "Max" keeps the positioning
("biggest pack we sell") while honest about the credit count.

The JSON key (`pricing.creditPacks.items.unlimited`) is **unchanged** to keep
Stripe webhook integration in `fma-app` working without a migration.

## Stripe Side (Daley Action Item)

The Stripe Product name in dashboard may still read `"Unlimited Credit Pack"`.
Rename to `"Max Credit Pack"` via Stripe dashboard so:
- Customer invoices show "Max" (matches site)
- Stripe webhook events stay tied to existing price IDs (stable for code)

## Alternative Names (if "Max" is wrong)

If Daley wants a different name, replace these 6 sites (3 .name + 3 FAQ refs):

| File | Path | Current | Alt 1 | Alt 2 |
|---|---|---|---|---|
| nl.json | pricing.creditPacks.items.unlimited.name | Max | Scale XL | Ultra |
| en.json | (same path) | Max | Scale XL | Ultra |
| es.json | (same path) | Max | Scale XL | Ultra |
| nl.json | pricing.faq.q2.answer (single occurrence) | "tot Max €697" | "tot Scale XL €697" | "tot Ultra €697" |
| en.json | pricing.faq.q2.answer (single occurrence) | "to Max €697" | "to Scale XL €697" | "to Ultra €697" |
| es.json | pricing.faq.q2.answer (single occurrence) | "a Max 697 EUR" | "a Scale XL 697 EUR" | "a Ultra 697 EUR" |

## Default-After-2-Weeks

If no answer by 2026-05-09, "Max" stays. It's a single-word concrete brand
choice, conversion-neutral.
