# Phase 2: Dashboard Reframe - Research

**Researched:** 2026-03-20
**Domain:** Next.js dashboard reframe, Supabase multi-tenant data model, Stripe subscription billing
**Confidence:** HIGH

## Summary

Phase 2 transforms the existing fma-app dashboard from a single-tenant SkinClarity-focused command center into a multi-agency AaaS platform. The dashboard already has a solid foundation: Supabase auth with org-scoped RLS (migrations 001-003), a 6-step client onboarding wizard, 18 sidebar nav items, and a billing page placeholder. The work divides into four domains: (1) relabeling sidebar and overview to "AI Employee" language, (2) adding an `fma_agencies` table with agency-to-client hierarchy and RLS, (3) integrating Stripe subscriptions with skill add-on line items, and (4) building an agency onboarding wizard that guides signup through first client creation and skill activation.

The existing codebase is brownfield with 93 API routes, 56+ migrations, and real production data. The `fma_organizations` table already provides tenant isolation via `is_org_member()` RLS helpers. The key architectural decision is whether to repurpose `fma_organizations` as the agency entity or create a separate `fma_agencies` table. Given the requirements reference "fma_agencies table" explicitly and the existing org table already has subscription_tier/features columns from migration 038, the cleanest approach is to add agency-specific columns to `fma_organizations` (renaming conceptually to "agency") rather than creating a parallel table.

**Primary recommendation:** Extend `fma_organizations` with agency-specific columns (agency_name, stripe_customer_id, active_skills JSONB), relabel sidebar nav items in the existing `app-sidebar.tsx` component, create Stripe Products for each AaaS tier + skill add-ons, and adapt the existing onboarding wizard pattern for agency-level onboarding.

<phase_requirements>

## Phase Requirements

| ID      | Description                                                                    | Research Support                                                                                                |
| ------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- |
| DASH-01 | Sidebar labels reframed (Pipeline -> Agent Activity, Campaigns -> Tasks, etc.) | Sidebar is a single `navItems` array in `app-sidebar.tsx` -- pure label + icon changes, plus route path updates |
| DASH-02 | Dashboard overview shows "AI Employee" status and daily activity summary       | Dashboard page fetches KPIs via parallel `Promise.all()` -- replace SKC-specific widgets with agent status card |
| DASH-03 | Agency data model (fma_agencies table, agency -> clients hierarchy)            | Extend `fma_organizations` with agency columns; existing `fma_clients` already has `organization_id` FK + RLS   |
| DASH-04 | Client workspace management page                                               | Existing `/clients` page with `ClientsTable` + `/clients/new` route -- extend with workspace concept            |
| DASH-05 | Skill activation toggles per client workspace                                  | Add `active_skills` JSONB column to `fma_clients`; build toggle UI component per skill                          |
| DASH-06 | Stripe billing integration (base subscription + skill add-ons)                 | Stripe subscription items API supports multi-product subscriptions; existing `stripe.ts` has plan definitions   |
| DASH-07 | Agency onboarding wizard (signup -> first client -> first skill activation)    | Existing `OnboardingWizard` pattern with 6 steps can be adapted for agency-level flow                           |
| DASH-08 | Route redirects for renamed pages                                              | Next.js `next.config.js` redirects or middleware-based redirects for old -> new route mapping                   |

</phase_requirements>

## Standard Stack

### Core

| Library               | Version | Purpose                                         | Why Standard                |
| --------------------- | ------- | ----------------------------------------------- | --------------------------- |
| Next.js               | 16.1.6  | App Router framework (already installed)        | Existing stack, locked      |
| @supabase/ssr         | 0.8.0   | Server-side Supabase client (already installed) | Existing auth + RLS pattern |
| @supabase/supabase-js | 2.97.0  | Supabase client (already installed)             | Existing data layer         |
| stripe                | 20.3.1  | Stripe Node.js SDK (already installed)          | Existing lib/stripe.ts      |
| @stripe/stripe-js     | 8.8.0   | Stripe client-side SDK (already installed)      | For Checkout redirect       |
| zod                   | 4.3.6   | Schema validation (already installed)           | Existing validation pattern |
| react-hook-form       | 7.71.2  | Form handling (already installed)               | Existing onboarding pattern |

### Supporting

| Library       | Version | Purpose                                 | When to Use                       |
| ------------- | ------- | --------------------------------------- | --------------------------------- |
| lucide-react  | 0.575.0 | Icons (already installed)               | Sidebar icons, skill toggle icons |
| framer-motion | 12.34.3 | Animations (already installed)          | Onboarding wizard transitions     |
| sonner        | 2.0.7   | Toast notifications (already installed) | Success/error feedback            |

### Alternatives Considered

| Instead of                  | Could Use                  | Tradeoff                                                                                             |
| --------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------- |
| Extending fma_organizations | New fma_agencies table     | Creates parallel entity to organizations; redundant RLS; breaks existing is_org_member() pattern     |
| Stripe Checkout (redirect)  | Stripe Elements (embedded) | Checkout is simpler for subscription creation; Elements needed only for inline card forms            |
| next.config.js redirects    | Middleware redirects       | Config redirects are simpler and evaluated before middleware; prefer config for static route mapping |

**Installation:**

```bash
# No new packages needed -- all dependencies already installed
```

## Architecture Patterns

### Recommended Project Structure

```
src/
├── app/(protected)/
│   ├── agent-activity/     # renamed from pipeline (DASH-01)
│   ├── tasks/              # renamed from campaigns (DASH-01)
│   ├── skills/             # new: skill activation per client (DASH-05)
│   ├── clients/            # existing: extend for workspace management (DASH-04)
│   ├── dashboard/          # existing: rewrite overview (DASH-02)
│   ├── billing/            # existing: implement Stripe (DASH-06)
│   └── onboarding/         # new: agency onboarding wizard (DASH-07)
├── components/
│   ├── layout/app-sidebar.tsx  # relabel nav items (DASH-01)
│   ├── dashboard/              # rewrite overview widgets (DASH-02)
│   ├── clients/                # extend with skill toggles (DASH-04, DASH-05)
│   ├── billing/                # new: subscription management (DASH-06)
│   └── onboarding/             # adapt existing wizard (DASH-07)
├── lib/
│   ├── stripe.ts               # update plan definitions for AaaS tiers (DASH-06)
│   ├── dal.ts                  # existing: getOrgContext() unchanged
│   └── actions/
│       ├── billing.ts          # new: Stripe subscription actions (DASH-06)
│       └── skills.ts           # new: skill toggle server actions (DASH-05)
└── app/api/webhooks/stripe/
    └── route.ts                # new: Stripe webhook handler (DASH-06)
```

### Pattern 1: Sidebar Label Reframe (DASH-01)

**What:** Update the `navItems` array in `app-sidebar.tsx` with new labels, icons, and href paths
**When to use:** All sidebar label changes
**Example:**

```typescript
// Current navItems in src/components/layout/app-sidebar.tsx
const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pipeline', label: 'Pipeline', icon: LayoutList },
  { href: '/campaigns', label: 'Campaigns', icon: Megaphone },
  // ...
]

// Reframed navItems
const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/agent-activity', label: 'Agent Activity', icon: Activity },
  { href: '/tasks', label: 'Tasks', icon: LayoutList },
  { href: '/skills', label: 'Skills', icon: Zap },
  { href: '/clients', label: 'Client Workspaces', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/calendar', label: 'Calendar', icon: CalendarDays },
  { href: '/voice-agents', label: 'Voice Agent', icon: Phone },
  { href: '/ad-builder', label: 'Ad Creator', icon: Wand2 },
  { href: '/ai-copilot', label: 'AI Copilot', icon: Bot },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/billing', label: 'Billing', icon: CreditCard },
]
```

### Pattern 2: Agency Data Model Extension (DASH-03)

**What:** Add agency-specific columns to `fma_organizations` + new skill columns to `fma_clients`
**When to use:** Agency hierarchy with existing RLS
**Example:**

```sql
-- Migration: extend fma_organizations for agency concept
ALTER TABLE fma_organizations
  ADD COLUMN IF NOT EXISTS display_name TEXT,
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT UNIQUE,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT,
  ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS agency_website TEXT,
  ADD COLUMN IF NOT EXISTS agency_industry TEXT;

-- Add skill activation to fma_clients (per-client workspace)
ALTER TABLE fma_clients
  ADD COLUMN IF NOT EXISTS active_skills TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS skill_config JSONB DEFAULT '{}';

-- Update subscription_tier CHECK constraint for AaaS tiers
ALTER TABLE fma_organizations
  DROP CONSTRAINT IF EXISTS fma_organizations_subscription_tier_check;
ALTER TABLE fma_organizations
  ADD CONSTRAINT fma_organizations_subscription_tier_check
  CHECK (subscription_tier IN ('free', 'founding_member', 'starter', 'growth', 'agency'));
```

### Pattern 3: Stripe Multi-Product Subscription (DASH-06)

**What:** One subscription per agency with base tier + skill add-on line items
**When to use:** Billing integration
**Example:**

```typescript
// lib/stripe.ts — updated for AaaS tiers
export const AGENT_TIERS = {
  FOUNDING_MEMBER: {
    name: 'Founding Member',
    priceId: process.env.STRIPE_PRICE_FOUNDING!,
    price: 997,
    maxClients: 3,
    includedSkills: ['contentCreator', 'socialMedia', 'reporting'],
  },
  STARTER: {
    name: 'Starter',
    priceId: process.env.STRIPE_PRICE_STARTER!,
    price: 1497,
    maxClients: 5,
    includedSkills: ['contentCreator', 'socialMedia', 'reporting'],
  },
  GROWTH: {
    name: 'Growth',
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    price: 1997,
    maxClients: 10,
    includedSkills: ['contentCreator', 'socialMedia', 'reporting', 'leadQualifier'],
  },
  AGENCY: {
    name: 'Agency',
    priceId: process.env.STRIPE_PRICE_AGENCY!,
    price: 3497,
    maxClients: 25,
    includedSkills: [
      'contentCreator',
      'socialMedia',
      'reporting',
      'leadQualifier',
      'voiceAgent',
      'adCreator',
    ],
  },
} as const

export const SKILL_ADDONS = {
  voiceAgent: { name: 'Voice Agent', priceId: process.env.STRIPE_PRICE_VOICE!, price: 297 },
  adCreator: { name: 'Ad Creator', priceId: process.env.STRIPE_PRICE_ADS!, price: 297 },
  leadQualifier: { name: 'Lead Qualifier', priceId: process.env.STRIPE_PRICE_LEADS!, price: 197 },
} as const
```

### Pattern 4: Stripe Webhook Handler (DASH-06)

**What:** App Router webhook route handling subscription lifecycle events
**When to use:** Sync Stripe state to Supabase
**Example:**

```typescript
// app/api/webhooks/stripe/route.ts
import { stripe } from '@/lib/stripe'
import { createAdminClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')!

  const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

  const admin = createAdminClient()

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object
      const orgId = session.metadata?.organization_id
      await admin
        .from('fma_organizations')
        .update({
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          subscription_tier: session.metadata?.tier,
        })
        .eq('id', orgId)
      break
    }
    case 'customer.subscription.updated': {
      // Sync tier changes, skill add-on additions/removals
      break
    }
    case 'customer.subscription.deleted': {
      // Downgrade to free tier
      break
    }
  }

  return new Response('OK', { status: 200 })
}
```

### Pattern 5: Route Redirects (DASH-08)

**What:** Map old route paths to new paths using next.config.js redirects
**When to use:** After renaming routes
**Example:**

```javascript
// next.config.js (or next.config.ts)
const nextConfig = {
  async redirects() {
    return [
      { source: '/pipeline', destination: '/agent-activity', permanent: true },
      { source: '/pipeline/:path*', destination: '/agent-activity/:path*', permanent: true },
      { source: '/campaigns', destination: '/tasks', permanent: true },
      { source: '/campaigns/:path*', destination: '/tasks/:path*', permanent: true },
    ]
  },
}
```

### Anti-Patterns to Avoid

- **Creating a separate fma_agencies table:** Duplicates the existing `fma_organizations` entity. The org table already has RLS, membership, subscription_tier, and features columns. Add agency-specific columns there instead.
- **Rebuilding the onboarding wizard from scratch:** The existing 6-step `OnboardingWizard` component is well-architected with step persistence, error handling, and template support. Adapt it for agency-level onboarding.
- **Storing Stripe subscription state only in Stripe:** Always sync subscription state to Supabase via webhooks so RLS policies can gate features based on tier.
- **Hardcoding skill names in multiple places:** Define skills once in a shared config (e.g., `lib/skills.ts`) and reference everywhere.

## Don't Hand-Roll

| Problem                        | Don't Build                       | Use Instead                              | Why                                                     |
| ------------------------------ | --------------------------------- | ---------------------------------------- | ------------------------------------------------------- |
| Subscription billing           | Custom payment logic              | Stripe Checkout + Subscription Items API | Proration, failed payments, dunning, tax all handled    |
| Customer portal                | Custom subscription management UI | Stripe Customer Portal                   | Self-serve plan changes, cancellations, invoice history |
| Webhook signature verification | Manual HMAC                       | `stripe.webhooks.constructEvent()`       | Handles timing attacks, replay protection               |
| Form validation                | Manual field checks               | Zod schemas + react-hook-form            | Already used throughout the app                         |
| Route authorization            | Custom middleware per route       | Existing `getOrgContext()` + RLS         | Already enforces org-scoped access                      |

**Key insight:** The fma-app already has robust multi-tenant foundations (org membership, RLS helpers, client table with org FK). The phase is about extending these patterns with agency-specific semantics and Stripe integration, not building auth/tenancy from scratch.

## Common Pitfalls

### Pitfall 1: Stripe Webhook Idempotency

**What goes wrong:** Webhook events can be delivered multiple times. Processing checkout.session.completed twice could create duplicate subscriptions or corrupt state.
**Why it happens:** Network retries, Stripe delivery guarantees.
**How to avoid:** Use `event.id` as idempotency key. Check if `stripe_subscription_id` is already set before processing. Use database upsert semantics.
**Warning signs:** Duplicate subscription records, double billing.

### Pitfall 2: RLS Policy Performance with Agency Hierarchy

**What goes wrong:** Nested RLS lookups (user -> org membership -> org -> clients) cause slow queries on every request.
**Why it happens:** RLS policies evaluated per-row without proper indexes.
**How to avoid:** Ensure indexes exist on `fma_organization_members(user_id)`, `fma_clients(organization_id)`. The existing `is_org_member()` SECURITY DEFINER function already bypasses recursive RLS -- keep using it.
**Warning signs:** Dashboard page load > 2 seconds, Supabase query logs showing sequential scans.

### Pitfall 3: Middleware Protected Paths Not Updated

**What goes wrong:** New routes (e.g., `/agent-activity`, `/skills`) aren't added to the `protectedPaths` array in middleware.ts, allowing unauthenticated access.
**Why it happens:** The middleware has a hardcoded list of protected paths -- not a catch-all pattern.
**How to avoid:** When adding new routes, update the `protectedPaths` array in `src/middleware.ts`. Consider refactoring to a negative list (only public paths) instead.
**Warning signs:** New pages accessible without login.

### Pitfall 4: Subscription Tier Not Synced Before Feature Check

**What goes wrong:** Agency creates subscription but features aren't gated because tier check reads stale data from Supabase.
**Why it happens:** Stripe webhook hasn't processed yet, or Next.js data cache serves stale OrgContext.
**How to avoid:** Use `revalidatePath` after webhook processing. For critical operations, fetch tier directly from Stripe as fallback.
**Warning signs:** Users see "free" tier immediately after payment.

### Pitfall 5: Breaking Existing SkinClarity Data

**What goes wrong:** Migration changes break the existing SkinClarity client workspace or its associated data queries.
**Why it happens:** Adding NOT NULL columns without defaults, changing column types, or altering RLS policies that affect existing rows.
**How to avoid:** All migrations must have DEFAULT values. Test queries against existing data before and after. Keep the SkinClarity organization as a test case.
**Warning signs:** Dashboard errors on existing pages, empty data in KPI cards.

## Code Examples

### Server Action: Toggle Skill for Client Workspace

```typescript
// lib/actions/skills.ts
'use server'

import { z } from 'zod'
import { createAdminClient } from '@/lib/supabase/server'
import { getOrgContext } from '@/lib/dal'
import { revalidatePath } from 'next/cache'
import { SKILL_IDS } from '@/lib/skills'

const ToggleSkillSchema = z.object({
  clientId: z.string().uuid(),
  skillId: z.enum(SKILL_IDS),
  enabled: z.boolean(),
})

export async function toggleClientSkill(input: z.infer<typeof ToggleSkillSchema>) {
  const parsed = ToggleSkillSchema.parse(input)
  const orgCtx = await getOrgContext()
  const admin = createAdminClient()

  // Verify client belongs to this org
  const { data: client } = await admin
    .from('fma_clients')
    .select('active_skills')
    .eq('id', parsed.clientId)
    .eq('organization_id', orgCtx.organizationId)
    .single()

  if (!client) throw new Error('Client not found')

  const currentSkills = client.active_skills ?? []
  const newSkills = parsed.enabled
    ? [...new Set([...currentSkills, parsed.skillId])]
    : currentSkills.filter((s: string) => s !== parsed.skillId)

  await admin
    .from('fma_clients')
    .update({ active_skills: newSkills })
    .eq('id', parsed.clientId)
    .eq('organization_id', orgCtx.organizationId)

  revalidatePath(`/clients/${parsed.clientId}`)
  return { success: true }
}
```

### Stripe Checkout Session Creation

```typescript
// lib/actions/billing.ts
'use server'

import { stripe, AGENT_TIERS } from '@/lib/stripe'
import { getOrgContext } from '@/lib/dal'
import { createAdminClient } from '@/lib/supabase/server'

export async function createCheckoutSession(tierKey: string) {
  const orgCtx = await getOrgContext()
  const tier = AGENT_TIERS[tierKey as keyof typeof AGENT_TIERS]
  if (!tier) throw new Error('Invalid tier')

  const admin = createAdminClient()
  const { data: org } = await admin
    .from('fma_organizations')
    .select('stripe_customer_id, name')
    .eq('id', orgCtx.organizationId)
    .single()

  // Create or reuse Stripe customer
  let customerId = org?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      metadata: { organization_id: orgCtx.organizationId },
    })
    customerId = customer.id
    await admin
      .from('fma_organizations')
      .update({ stripe_customer_id: customerId })
      .eq('id', orgCtx.organizationId)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: tier.priceId, quantity: 1 }],
    metadata: {
      organization_id: orgCtx.organizationId,
      tier: tierKey.toLowerCase(),
    },
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing?canceled=true`,
  })

  return { url: session.url }
}
```

### Skill Definitions (Single Source of Truth)

```typescript
// lib/skills.ts
export const SKILLS = {
  contentCreator: {
    id: 'contentCreator',
    name: 'Content Creator',
    description: 'Blog posts, social content, email newsletters',
    icon: 'FileText',
    n8nWorkflows: ['rnp-pipeline', 'blog-orchestrator', 'content-factory'],
  },
  socialMedia: {
    id: 'socialMedia',
    name: 'Social Media Manager',
    description: 'Multi-platform scheduling, engagement, analytics',
    icon: 'Share2',
    n8nWorkflows: ['posting-pipeline', 'carousel-builder', 'story-builder'],
  },
  leadQualifier: {
    id: 'leadQualifier',
    name: 'Lead Qualifier',
    description: 'Website chatbot, lead scoring, CRM routing',
    icon: 'MessageSquare',
    n8nWorkflows: ['chatbot-workflows', 'lead-management'],
  },
  voiceAgent: {
    id: 'voiceAgent',
    name: 'Voice Agent',
    description: 'Inbound/outbound calls, appointment booking',
    icon: 'Phone',
    n8nWorkflows: ['vapi-server', 'call-logging'],
  },
  adCreator: {
    id: 'adCreator',
    name: 'Ad Creator',
    description: 'AI-generated static/video ads, Meta publishing',
    icon: 'Film',
    n8nWorkflows: ['ad-creative-pipeline', 'dpa-pipeline'],
  },
  reporting: {
    id: 'reporting',
    name: 'Reporting & Analytics',
    description: 'Dashboards, weekly reports, anomaly detection',
    icon: 'BarChart2',
    n8nWorkflows: ['daily-analytics', 'weekly-performance', 'anomaly-detection'],
  },
} as const

export const SKILL_IDS = Object.keys(SKILLS) as [keyof typeof SKILLS, ...Array<keyof typeof SKILLS>]
export type SkillId = keyof typeof SKILLS
```

## State of the Art

| Old Approach                    | Current Approach                            | When Changed           | Impact                                             |
| ------------------------------- | ------------------------------------------- | ---------------------- | -------------------------------------------------- |
| Separate API routes for Stripe  | Server Actions for checkout/billing         | Next.js 14+ (2024)     | Simpler code, no separate API routes needed        |
| Manual webhook raw body parsing | `req.text()` in App Router route handlers   | Next.js 13.4+ (2023)   | Works correctly with Stripe signature verification |
| Stripe Customer Portal via API  | Stripe Customer Portal via dashboard config | Stripe 2024+           | Self-serve management with zero custom UI          |
| Per-table RLS policies          | SECURITY DEFINER helper functions           | Supabase best practice | Already implemented in migration 002               |

**Deprecated/outdated:**

- Old `PLANS` object in `lib/stripe.ts` (Starter/Professional/Enterprise at 499/999/2499): Must be replaced with AaaS tier pricing (Founding Member/Starter/Growth/Agency at 997/1497/1997/3497)
- `subscription_tier` CHECK constraint (free/starter/professional/enterprise): Must be updated to include founding_member/growth/agency

## Open Questions

1. **Stripe Products: Pre-created or Created at Build Time?**
   - What we know: Stripe Products and Prices need to exist before checkout sessions can reference them. The current `lib/stripe.ts` references env vars for price IDs.
   - What's unclear: Whether to create these manually in Stripe Dashboard or via a setup script.
   - Recommendation: Create manually in Stripe Dashboard (test mode first, then live). Document the Price IDs in a `.env.example`. This is a one-time task.

2. **How Many Sidebar Items to Keep vs Remove?**
   - What we know: Current sidebar has 18 items. Many are SKC-specific (Products, Meta Ads, Ad Library, Tokens). The AaaS reframe should show skill-relevant items only.
   - What's unclear: Which items to remove vs relabel vs hide behind skill activation.
   - Recommendation: Keep core navigation (Overview, Agent Activity, Tasks, Skills, Clients, Analytics, Calendar, Settings, Billing). Feature-specific items (Ad Builder, Voice, AI Copilot) visible only when the corresponding skill is active for the agency's tier.

3. **Agency Onboarding: New Wizard or Extend Existing?**
   - What we know: Existing `OnboardingWizard` has 6 content-focused steps (Basics, Brand Scan, Pillars, Accounts, CTAs, Review). Agency onboarding needs different steps (Agency Info, First Client, Choose Tier, Activate Skills, Review).
   - What's unclear: Whether to modify the existing wizard or create a parallel one.
   - Recommendation: Create a new `AgencyOnboardingWizard` component with agency-specific steps, reusing the existing wizard's architecture (step persistence, error handling, progress bar). The existing client-level wizard stays for when agencies add subsequent clients.

4. **Signup Flow: Self-Serve or Invite-Only?**
   - What we know: Current signup page says "invite-only." REQUIREMENTS.md Out of Scope lists "Self-serve agency signup (currently invite-only)" as v2.
   - What's unclear: Whether Phase 2 should implement a real signup or remain invite-only with manual onboarding.
   - Recommendation: Keep invite-only for v1. The onboarding wizard activates after the founder manually creates the organization + user in Supabase. The wizard starts at first login, not at signup.

## Sources

### Primary (HIGH confidence)

- Existing codebase analysis: `C:\Users\daley\Desktop\fma-app\src\` -- all findings verified against actual code
- Supabase migrations 001-003, 038: actual SQL schema, RLS policies, and constraint definitions
- Stripe Node.js SDK: `stripe@20.3.1` already installed, API version `2026-01-28.clover`
- [Stripe Subscription Items API](https://docs.stripe.com/api/subscription_items) -- multi-product subscriptions
- [Stripe Build Subscriptions Guide](https://docs.stripe.com/billing/subscriptions/build-subscriptions) -- checkout + webhook pattern

### Secondary (MEDIUM confidence)

- [Next.js redirects configuration](https://nextjs.org/docs/app/api-reference/config/next-config-js/redirects) -- route redirect pattern
- [Supabase RLS Best Practices](https://makerkit.dev/blog/tutorials/supabase-rls-best-practices) -- multi-tenant patterns verified against existing codebase implementation
- [Stripe Subscription Lifecycle in Next.js 2026](https://dev.to/thekarlesi/stripe-subscription-lifecycle-in-nextjs-the-complete-developer-guide-2026-4l9d) -- webhook handler pattern

### Tertiary (LOW confidence)

- None. All findings verified against codebase or official documentation.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH -- all libraries already installed and in use, no new dependencies needed
- Architecture: HIGH -- extending existing patterns (org membership, RLS helpers, onboarding wizard), not introducing new ones
- Pitfalls: HIGH -- identified from actual codebase inspection (hardcoded middleware paths, existing CHECK constraints, SKC data preservation)

**Research date:** 2026-03-20
**Valid until:** 2026-04-20 (stable -- no fast-moving dependencies)
