---
phase: 02-dashboard-reframe
plan: 02
subsystem: payments, ui
tags: [stripe, next.js, webhooks, billing, subscriptions, server-actions]

requires:
  - phase: 02-dashboard-reframe
    provides: skills.ts with AGENT_TIERS, SKILL_ADDONS, agency columns on fma_organizations
provides:
  - Stripe billing integration with AaaS agent tiers replacing old PLANS
  - Server actions for checkout session and customer portal creation
  - Webhook handler syncing subscription lifecycle to Supabase
  - Billing management page with tier selection and subscription management
affects: [02-03, 02-04, onboarding, client-workspaces]

tech-stack:
  added: []
  patterns: [server-actions-for-stripe, webhook-idempotency, client-component-for-transitions]

key-files:
  created:
    - fma-app/src/lib/actions/billing.ts
    - fma-app/src/app/api/webhooks/stripe/route.ts
    - fma-app/src/app/(protected)/billing/billing-client.tsx
  modified:
    - fma-app/src/lib/stripe.ts
    - fma-app/src/app/(protected)/billing/page.tsx

key-decisions:
  - 'Re-exported AGENT_TIERS/SKILL_ADDONS from stripe.ts to maintain backward-compatible import path'
  - 'BillingClient extracted as client component for useTransition-based checkout/portal redirects'
  - 'Webhook uses dynamic import for AGENT_TIERS to determine tier from subscription price ID'
  - 'Idempotency check on checkout.session.completed prevents duplicate subscription writes'

patterns-established:
  - 'Server actions pattern: billing.ts with use server directive for Stripe operations'
  - 'Webhook idempotency: check existing state before writing on checkout.session.completed'
  - 'Client/server split: server component fetches data, client component handles user interactions'

requirements-completed: [DASH-06]

duration: 2min
completed: 2026-03-20
---

# Phase 2 Plan 2: Stripe Billing Integration Summary

**Stripe billing with AaaS tier checkout, webhook subscription sync, and billing management page replacing old PLANS pricing**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-20T20:03:31Z
- **Completed:** 2026-03-20T20:06:07Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments

- Replaced old Starter/Professional/Enterprise PLANS with AaaS AGENT_TIERS re-exports in stripe.ts
- Server actions for Stripe Checkout session creation (with auto-customer creation) and Customer Portal access
- Webhook handler processing 4 event types with idempotency on checkout completion
- Billing page showing tier cards for free users and subscription management for subscribed users

## Task Commits

Each task was committed atomically:

1. **Task 1: Update stripe.ts + create billing server actions + webhook handler** - `9fa74f4` (feat)
2. **Task 2: Billing management page** - `9e0b274` (feat)

## Files Created/Modified

- `fma-app/src/lib/stripe.ts` - Stripped old PLANS, re-exports AGENT_TIERS and SKILL_ADDONS from skills.ts, TierKey type
- `fma-app/src/lib/actions/billing.ts` - Server actions: createCheckoutSession (with zod validation, auto-customer creation), createPortalSession
- `fma-app/src/app/api/webhooks/stripe/route.ts` - Webhook handler: checkout.session.completed, subscription.updated, subscription.deleted, invoice.payment_failed
- `fma-app/src/app/(protected)/billing/page.tsx` - Server component: tier selection cards (free), subscription details + manage button (subscribed), success/cancel banners
- `fma-app/src/app/(protected)/billing/billing-client.tsx` - Client component: checkout and portal redirect with useTransition loading states

## Decisions Made

- Re-exported AGENT_TIERS/SKILL_ADDONS from stripe.ts so any existing imports from stripe.ts still work
- Extracted BillingClient as a client component since server components cannot handle onClick -- uses useTransition for non-blocking redirects
- Webhook dynamically imports AGENT_TIERS to match price ID back to tier name on subscription.updated events
- Idempotency: checkout.session.completed checks if stripe_subscription_id already matches before updating

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

Stripe environment variables needed for production:

- `STRIPE_SECRET_KEY` - Stripe API secret key
- `STRIPE_WEBHOOK_SECRET` - Webhook endpoint signing secret
- `STRIPE_PRICE_FOUNDING`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_AGENCY` - Price IDs for each tier
- `STRIPE_PRICE_VOICE`, `STRIPE_PRICE_ADS`, `STRIPE_PRICE_LEADS` - Add-on price IDs

## Next Phase Readiness

- Billing flow complete: agencies can subscribe, manage, and cancel subscriptions
- Webhook syncs subscription state to fma_organizations for use by client workspace and skill activation pages
- Ready for 02-03 (client workspace) and 02-04 (onboarding flow)

---

## Self-Check: PASSED

All 5 created/modified files verified present. Both task commits (9fa74f4, 9e0b274) verified in git log.

_Phase: 02-dashboard-reframe_
_Completed: 2026-03-20_
