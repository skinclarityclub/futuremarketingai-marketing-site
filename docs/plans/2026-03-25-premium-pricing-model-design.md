---
title: FMai Premium Pricing Model — Design & Implementation Plan
tags:
  - pricing
  - strategy
  - premium
  - credits
  - aaas
created: 2026-03-25
source: Claude Code brainstorming session (5 Opus research agents, 200+ sources)
---

# FMai Premium Pricing Model — Design & Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Restructure FMai's pricing from vertical-pack tiers with add-ons to a premium credit-based model with workspace scaling and onboarding fees, positioning FMai as the only unified AI marketing employee platform in Europe.

**Architecture:** Replace the 4 current tiers (Social Media Engine / Ecommerce Growth / Full Agency Suite / Founding Member) with 3 premium tiers + Founding Member. All skills are included in every tier (no feature-gating). Monetization shifts from skill restrictions to workspace count + credit consumption. Stripe billing uses base subscription + metered credit usage.

**Tech Stack:** Stripe (subscriptions + metered billing), Supabase (PostgreSQL), Next.js, React, TypeScript, Tailwind CSS

---

## Research Summary (Validated by 5 Opus Research Agents)

### Market Position

- **Zero direct competitors in Europe** combining content + social + voice + video + ads + lead scoring + email + analytics under one AI agent for agencies
- Closest NL competitor: Typetone (1 skill, EUR 199/mo) — missing 10 of 11 capabilities
- Closest UK competitor: None with unified AI agent model
- AI employee companies (11x, Artisan) charge $2,000-7,200/mo for **single skills**

### Pricing Justification

| Benchmark | Price | What it covers |
|-----------|-------|---------------|
| FMai Full Suite (current) | EUR 1,997/mo | 11 skills, AI agent, 10 clients |
| Separate tool stack | EUR 2,000-3,400/mo | Same capabilities, NO operator |
| 1 junior marketer (NL) | EUR 4,500-6,200/mo | 1 human, 1 skill set |
| 11x AI Alice (1 skill) | $5,000/mo | Only outbound sales |
| HubSpot Enterprise | EUR 3,600/mo + EUR 7K onboarding | Only CRM + automation |
| Agency retainer (multichannel) | EUR 5,000-20,000/mo | Human-run services |

### Agency Budget Reality (NL + UK)

- Target ICP tool budget: EUR 2,000-5,000/mo
- Headcount replacement anchor: EUR 2,500-3,500/mo per junior
- Realistic ceiling: EUR 3,000-5,000/mo
- Sweet spot: EUR 1,500-3,000/mo

---

## New Pricing Model

### Tier Structure

| Tier | Name | Monthly Price | Workspaces | Credits/mo | Onboarding Fee | Support |
|------|------|-------------|-----------|-----------|----------------|---------|
| **Growth** | AI Marketing Starter | EUR 1,497 | 5 | 3,000 | EUR 1,500 | Email + Knowledge Base |
| **Professional** | AI Marketing Pro | EUR 2,997 | 15 | 8,000 | EUR 3,000 | Dedicated Slack + Monthly Call |
| **Enterprise** | AI Marketing Suite | EUR 4,997 | Unlimited | 20,000 | EUR 5,000+ | Dedicated CSM + Custom SLA |
| **Founding** | Founders Club | EUR 997 (lifetime) | Unlimited | 10,000 | EUR 0 | Direct Founder Access (Slack) |

**All tiers include ALL skills. No feature-gating. No add-on skills.**

### Credit System

**1 credit = EUR 0.10 face value. Internal cost ~EUR 0.03-0.04 (65-70% margin).**

| Skill | Action | Credits | Rationale |
|-------|--------|---------|-----------|
| Content Creator | 1 social post generated | 2 | Light LLM |
| Social Media Manager | 1 post scheduled/published | 1 | API call only |
| Blog Factory | 1 SEO article | 15 | Heavy: research + writing + SEO |
| Voice Agent | 1 minute of call | 5 | Vapi + real-time LLM |
| Lead Qualifier | 1 lead scored | 2 | BANT scoring + routing |
| Ad Creator | 1 static ad | 10 | AI image generation |
| Ad Creator | 1 video ad | 20 | Kling/HeyGen |
| Reel Builder | 1 reel | 25 | Video generation (most expensive) |
| Email Management | 1 campaign | 5 | Copy + segmentation |
| ManyChat DM | 10 DM interactions | 2 | Light, webhook-based |
| Reporting | 1 report | 5 | Data aggregation + AI summary |
| Intelligence | 1 research query | 3 | Perplexity/web search |

### Credit Packs (Overage)

| Pack | Credits | Price | Per-credit | Discount |
|------|---------|-------|-----------|----------|
| Boost | 2,000 | EUR 149 | EUR 0.075 | 25% off |
| Scale | 5,000 | EUR 297 | EUR 0.059 | 41% off |
| Unlimited | 15,000 | EUR 697 | EUR 0.046 | 54% off |

### Annual Discount

15% off monthly price for annual commitment (billed monthly).

| Tier | Monthly | Annual (per mo) | Annual savings |
|------|---------|----------------|----------------|
| Growth | EUR 1,497 | EUR 1,272 | EUR 2,700/yr |
| Professional | EUR 2,997 | EUR 2,547 | EUR 5,400/yr |
| Enterprise | EUR 4,997 | EUR 4,247 | EUR 9,000/yr |

### Per-Client Economics (All Skills, Average Usage)

| Clients | Tier | Workspaces | Est. Credits Used | Overage Cost | Total/mo |
|---------|------|-----------|------------------|-------------|---------|
| 2 | Growth | Included | ~2,090 | EUR 0 | EUR 1,497 |
| 5 | Growth | Included | ~5,225 | ~EUR 149 (1 Boost) | EUR 1,646 |
| 8 | Professional | Included | ~8,360 | EUR 0 | EUR 2,997 |
| 10 | Professional | Included | ~10,450 | ~EUR 149 (1 Boost) | EUR 3,146 |
| 15 | Professional | Included | ~15,675 | ~EUR 594 (2 Scale) | EUR 3,591 |
| 20 | Enterprise | Included | ~20,900 | EUR 0 | EUR 4,997 |
| 30 | Enterprise | Included | ~31,350 | ~EUR 697 (1 Unlimited) | EUR 5,694 |

### Revenue Projections (10-Agency Portfolio)

| Mix | Count | MRR | Onboarding |
|-----|-------|-----|-----------|
| Founding | 2 | EUR 1,994 | EUR 0 |
| Growth | 3 | EUR 4,491 | EUR 4,500 |
| Professional | 4 | EUR 11,988 | EUR 12,000 |
| Enterprise | 1 | EUR 4,997 | EUR 5,000 |
| **Total** | **10** | **EUR 23,470** | **EUR 21,500** |

Plus credit overage: ~EUR 2,000-4,000/mo.
**Total MRR: EUR 25,000-27,000 from 10 agencies.**

### Margin Analysis

| Clients | Agency Pays | Our Cost | Gross Margin |
|---------|-----------|----------|-------------|
| 2 | EUR 1,497 | EUR 254 | 83% |
| 5 | EUR 1,646 | EUR 410 | 75% |
| 10 | EUR 3,146 | EUR 670 | 79% |
| 20 | EUR 4,997 | EUR 1,190 | 76% |

---

## Premium Positioning Signals

1. **Mandatory onboarding fee** — Signals sophistication (like HubSpot EUR 3K-7K)
2. **"Contact Sales" on Enterprise** — Enterprise-ready signal
3. **ROI Calculator** on pricing page — Frame value, not cost
4. **"Powered by NVIDIA NemoClaw"** badge — Tech credibility
5. **GDPR / EU AI Act Compliant** badges — Moat vs US competitors
6. **Case studies with EUR figures** — "Agency X saved EUR 4,200/mo"
7. **Dedicated Slack for Professional+** — White-glove service

---

## Implementation Tasks

### Task 1: Update Tier Definitions in FMA-App

**Files:**
- Modify: `C:\Users\daley\Desktop\fma-app\src\lib\skills.ts:136-217`

**Step 1: Replace AGENT_TIERS constant**

Replace the existing `AGENT_TIERS` (lines 136-173) with:

```typescript
export const AGENT_TIERS = {
  GROWTH: {
    name: 'AI Marketing Starter',
    displayName: 'Growth',
    price: 1497,
    currency: 'EUR',
    maxClients: 5,
    includedCredits: 3000,
    includedSkills: SKILL_IDS, // ALL skills included
    onboardingFee: 1500,
    support: 'email',
    priceId: process.env.STRIPE_PRICE_GROWTH!,
    onboardingPriceId: process.env.STRIPE_PRICE_ONBOARDING_GROWTH!,
  },
  PROFESSIONAL: {
    name: 'AI Marketing Pro',
    displayName: 'Professional',
    price: 2997,
    currency: 'EUR',
    maxClients: 15,
    includedCredits: 8000,
    includedSkills: SKILL_IDS,
    onboardingFee: 3000,
    support: 'slack',
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL!,
    onboardingPriceId: process.env.STRIPE_PRICE_ONBOARDING_PROFESSIONAL!,
  },
  ENTERPRISE: {
    name: 'AI Marketing Suite',
    displayName: 'Enterprise',
    price: 4997,
    currency: 'EUR',
    maxClients: -1, // unlimited
    includedCredits: 20000,
    includedSkills: SKILL_IDS,
    onboardingFee: 5000,
    support: 'dedicated_csm',
    priceId: process.env.STRIPE_PRICE_ENTERPRISE!,
    onboardingPriceId: process.env.STRIPE_PRICE_ONBOARDING_ENTERPRISE!,
  },
  FOUNDING_MEMBER: {
    name: 'Founders Club',
    displayName: 'Founding Member',
    price: 997,
    currency: 'EUR',
    maxClients: -1, // unlimited
    includedCredits: 10000,
    includedSkills: SKILL_IDS,
    onboardingFee: 0,
    support: 'founder_slack',
    priceId: process.env.STRIPE_PRICE_FOUNDING!,
    onboardingPriceId: null,
  },
} as const;

export type TierKey = keyof typeof AGENT_TIERS;
```

**Step 2: Replace SKILL_ADDONS with CREDIT_PACKS**

Replace `SKILL_ADDONS` (lines 181-217) with:

```typescript
export const CREDIT_PACKS = {
  BOOST: {
    name: 'Boost',
    credits: 2000,
    price: 149,
    currency: 'EUR',
    perCredit: 0.075,
    priceId: process.env.STRIPE_PRICE_CREDITS_BOOST!,
  },
  SCALE: {
    name: 'Scale',
    credits: 5000,
    price: 297,
    currency: 'EUR',
    perCredit: 0.059,
    priceId: process.env.STRIPE_PRICE_CREDITS_SCALE!,
  },
  UNLIMITED: {
    name: 'Unlimited',
    credits: 15000,
    price: 697,
    currency: 'EUR',
    perCredit: 0.046,
    priceId: process.env.STRIPE_PRICE_CREDITS_UNLIMITED!,
  },
} as const;

export type CreditPackKey = keyof typeof CREDIT_PACKS;
```

**Step 3: Add CREDIT_COSTS per skill action**

```typescript
export const CREDIT_COSTS: Record<string, Record<string, number>> = {
  contentCreator: { social_post: 2, caption: 1 },
  socialMedia: { schedule_post: 1, engage: 1 },
  blogFactory: { article: 15 },
  voiceAgent: { call_minute: 5 },
  leadQualifier: { score_lead: 2 },
  adCreator: { static_ad: 10, video_ad: 20 },
  reelBuilder: { reel: 25 },
  emailManagement: { campaign: 5 },
  manychatDm: { dm_batch_10: 2 },
  reporting: { report: 5 },
  intelligence: { research_query: 3 },
};
```

**Step 4: Update TIER_MAP for backward compatibility**

```typescript
export const TIER_MAP: Record<string, TierKey> = {
  growth: 'GROWTH',
  professional: 'PROFESSIONAL',
  enterprise: 'ENTERPRISE',
  founding_member: 'FOUNDING_MEMBER',
  // Legacy mappings
  starter: 'GROWTH',
  social_media_engine: 'GROWTH',
  ecommerce_growth: 'PROFESSIONAL',
  full_agency_suite: 'ENTERPRISE',
  agency: 'ENTERPRISE',
  GROWTH: 'GROWTH',
  PROFESSIONAL: 'PROFESSIONAL',
  ENTERPRISE: 'ENTERPRISE',
  FOUNDING_MEMBER: 'FOUNDING_MEMBER',
};
```

**Step 5: Commit**

```bash
git add src/lib/skills.ts
git commit -m "feat: restructure pricing to premium credit-based model

Replace vertical packs (997-1997) with premium tiers (1497-4997).
All skills included in every tier. Add credit system for usage.
Add credit packs (Boost/Scale/Unlimited) replacing skill add-ons."
```

---

### Task 2: Add Credit Tracking to Database

**Files:**
- Create: `C:\Users\daley\Desktop\fma-app\supabase\migrations\061_credit_system.sql`

**Step 1: Write migration**

```sql
-- Credit system: tracks credit balance and consumption per organization

-- Credit ledger: every credit change (earned, consumed, purchased, expired)
CREATE TABLE IF NOT EXISTS fma_credit_ledger (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES fma_organizations(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES fma_clients(id) ON DELETE SET NULL,
  credit_type TEXT NOT NULL CHECK (credit_type IN (
    'monthly_allocation',  -- recurring tier credits
    'pack_purchase',       -- one-time credit pack buy
    'skill_consumption',   -- credits used by skill execution
    'adjustment',          -- manual admin adjustment
    'rollover_expire'      -- unused credits expired at month end
  )),
  amount INTEGER NOT NULL, -- positive = credit added, negative = credit consumed
  balance_after INTEGER NOT NULL, -- running balance after this entry
  skill TEXT,              -- which skill consumed credits (null for allocations)
  action TEXT,             -- specific action (e.g. 'article', 'call_minute')
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Monthly credit summary per organization
CREATE TABLE IF NOT EXISTS fma_credit_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  organization_id UUID NOT NULL REFERENCES fma_organizations(id) ON DELETE CASCADE,
  month TEXT NOT NULL, -- YYYY-MM
  credits_allocated INTEGER DEFAULT 0,
  credits_purchased INTEGER DEFAULT 0,
  credits_consumed INTEGER DEFAULT 0,
  credits_expired INTEGER DEFAULT 0,
  credits_remaining INTEGER DEFAULT 0,
  UNIQUE(organization_id, month)
);

-- Add credit balance to organizations
ALTER TABLE fma_organizations
  ADD COLUMN IF NOT EXISTS credit_balance INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_this_month_allocated INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS credits_this_month_consumed INTEGER DEFAULT 0;

-- Update subscription_tier CHECK to include new tier names
ALTER TABLE fma_organizations
  DROP CONSTRAINT IF EXISTS fma_organizations_subscription_tier_check;

ALTER TABLE fma_organizations
  ADD CONSTRAINT fma_organizations_subscription_tier_check
  CHECK (subscription_tier IN (
    'free',
    'founding_member', 'growth', 'professional', 'enterprise',
    -- Legacy names (backward compat)
    'starter', 'agency', 'social_media_engine', 'ecommerce_growth', 'full_agency_suite'
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_credit_ledger_org_month
  ON fma_credit_ledger(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_org_skill
  ON fma_credit_ledger(organization_id, skill)
  WHERE credit_type = 'skill_consumption';

CREATE INDEX IF NOT EXISTS idx_credit_summary_org_month
  ON fma_credit_summary(organization_id, month);

-- Function: consume credits for a skill action
CREATE OR REPLACE FUNCTION consume_credits(
  p_org_id UUID,
  p_workspace_id UUID,
  p_skill TEXT,
  p_action TEXT,
  p_credits INTEGER,
  p_description TEXT DEFAULT NULL
) RETURNS TABLE(success BOOLEAN, remaining INTEGER, message TEXT)
LANGUAGE plpgsql
AS $$
DECLARE
  v_balance INTEGER;
  v_new_balance INTEGER;
BEGIN
  -- Lock the org row to prevent race conditions
  SELECT credit_balance INTO v_balance
  FROM fma_organizations
  WHERE id = p_org_id
  FOR UPDATE;

  IF v_balance IS NULL THEN
    RETURN QUERY SELECT false, 0, 'Organization not found'::TEXT;
    RETURN;
  END IF;

  IF v_balance < p_credits THEN
    RETURN QUERY SELECT false, v_balance, 'Insufficient credits'::TEXT;
    RETURN;
  END IF;

  v_new_balance := v_balance - p_credits;

  -- Update balance
  UPDATE fma_organizations
  SET credit_balance = v_new_balance,
      credits_this_month_consumed = credits_this_month_consumed + p_credits
  WHERE id = p_org_id;

  -- Insert ledger entry
  INSERT INTO fma_credit_ledger (
    organization_id, workspace_id, credit_type, amount,
    balance_after, skill, action, description
  ) VALUES (
    p_org_id, p_workspace_id, 'skill_consumption', -p_credits,
    v_new_balance, p_skill, p_action, p_description
  );

  -- Update monthly summary
  INSERT INTO fma_credit_summary (organization_id, month, credits_consumed)
  VALUES (p_org_id, to_char(NOW(), 'YYYY-MM'), p_credits)
  ON CONFLICT (organization_id, month)
  DO UPDATE SET credits_consumed = fma_credit_summary.credits_consumed + p_credits;

  RETURN QUERY SELECT true, v_new_balance, 'Credits consumed'::TEXT;
END;
$$;

-- Function: allocate monthly credits (called by cron/webhook at billing cycle)
CREATE OR REPLACE FUNCTION allocate_monthly_credits(
  p_org_id UUID,
  p_credits INTEGER
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE fma_organizations
  SET credit_balance = credit_balance + p_credits,
      credits_this_month_allocated = p_credits,
      credits_this_month_consumed = 0
  WHERE id = p_org_id
  RETURNING credit_balance INTO v_new_balance;

  INSERT INTO fma_credit_ledger (
    organization_id, credit_type, amount, balance_after, description
  ) VALUES (
    p_org_id, 'monthly_allocation', p_credits, v_new_balance,
    'Monthly credit allocation'
  );

  INSERT INTO fma_credit_summary (organization_id, month, credits_allocated)
  VALUES (p_org_id, to_char(NOW(), 'YYYY-MM'), p_credits)
  ON CONFLICT (organization_id, month)
  DO UPDATE SET credits_allocated = p_credits;
END;
$$;

-- Function: add purchased credits
CREATE OR REPLACE FUNCTION add_purchased_credits(
  p_org_id UUID,
  p_credits INTEGER,
  p_pack_name TEXT
) RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  v_new_balance INTEGER;
BEGIN
  UPDATE fma_organizations
  SET credit_balance = credit_balance + p_credits
  WHERE id = p_org_id
  RETURNING credit_balance INTO v_new_balance;

  INSERT INTO fma_credit_ledger (
    organization_id, credit_type, amount, balance_after, description
  ) VALUES (
    p_org_id, 'pack_purchase', p_credits, v_new_balance,
    'Credit pack purchased: ' || p_pack_name
  );

  INSERT INTO fma_credit_summary (organization_id, month, credits_purchased)
  VALUES (p_org_id, to_char(NOW(), 'YYYY-MM'), p_credits)
  ON CONFLICT (organization_id, month)
  DO UPDATE SET credits_purchased = fma_credit_summary.credits_purchased + p_credits;
END;
$$;
```

**Step 2: Commit**

```bash
git add supabase/migrations/061_credit_system.sql
git commit -m "feat: add credit system database schema

Credit ledger (append-only audit trail), monthly summaries,
org balance tracking, and atomic consume/allocate/purchase functions."
```

---

### Task 3: Update Usage/Quota System for Credits

**Files:**
- Modify: `C:\Users\daley\Desktop\fma-app\src\lib\usage\quota.ts`
- Create: `C:\Users\daley\Desktop\fma-app\src\lib\usage\credits.ts`

**Step 1: Create credits.ts module**

```typescript
import { createClient } from '@/lib/supabase/server';
import { AGENT_TIERS, CREDIT_COSTS, CREDIT_PACKS, TIER_MAP } from '@/lib/skills';
import type { TierKey, CreditPackKey } from '@/lib/skills';

export interface CreditBalance {
  balance: number;
  allocated: number;
  consumed: number;
  tier: TierKey | null;
  includedCredits: number;
}

export async function getCreditBalance(orgId: string): Promise<CreditBalance> {
  const supabase = await createClient();

  const { data: org } = await supabase
    .from('fma_organizations')
    .select('credit_balance, credits_this_month_allocated, credits_this_month_consumed, subscription_tier')
    .eq('id', orgId)
    .single();

  if (!org) {
    return { balance: 0, allocated: 0, consumed: 0, tier: null, includedCredits: 0 };
  }

  const tierKey = org.subscription_tier ? TIER_MAP[org.subscription_tier] : null;
  const includedCredits = tierKey ? AGENT_TIERS[tierKey].includedCredits : 0;

  return {
    balance: org.credit_balance ?? 0,
    allocated: org.credits_this_month_allocated ?? 0,
    consumed: org.credits_this_month_consumed ?? 0,
    tier: tierKey,
    includedCredits,
  };
}

export async function consumeCredits(
  orgId: string,
  workspaceId: string | null,
  skill: string,
  action: string,
  description?: string,
): Promise<{ success: boolean; remaining: number; message: string }> {
  const creditCost = CREDIT_COSTS[skill]?.[action];
  if (!creditCost) {
    return { success: false, remaining: 0, message: `Unknown skill/action: ${skill}/${action}` };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.rpc('consume_credits', {
    p_org_id: orgId,
    p_workspace_id: workspaceId,
    p_skill: skill,
    p_action: action,
    p_credits: creditCost,
    p_description: description ?? `${skill}: ${action}`,
  });

  if (error || !data?.[0]) {
    return { success: false, remaining: 0, message: error?.message ?? 'RPC failed' };
  }

  return data[0];
}

export async function getCreditUsageBreakdown(orgId: string, month?: string) {
  const supabase = await createClient();
  const targetMonth = month ?? new Date().toISOString().slice(0, 7);

  const { data } = await supabase
    .from('fma_credit_ledger')
    .select('skill, action, amount, created_at')
    .eq('organization_id', orgId)
    .eq('credit_type', 'skill_consumption')
    .gte('created_at', `${targetMonth}-01`)
    .lt('created_at', `${targetMonth}-32`)
    .order('created_at', { ascending: false });

  // Aggregate by skill
  const bySkill: Record<string, number> = {};
  for (const entry of data ?? []) {
    if (entry.skill) {
      bySkill[entry.skill] = (bySkill[entry.skill] ?? 0) + Math.abs(entry.amount);
    }
  }

  return { month: targetMonth, bySkill, total: Object.values(bySkill).reduce((a, b) => a + b, 0) };
}
```

**Step 2: Update quota.ts to use credits instead of execution limits**

Replace the `SKILL_LIMITS` and `checkQuota` function with a credit-aware version that calls `consumeCredits` instead of counting executions against hard limits.

**Step 3: Commit**

```bash
git add src/lib/usage/credits.ts src/lib/usage/quota.ts
git commit -m "feat: add credit consumption module and update quota system

Credits are consumed per skill action via atomic Supabase RPC.
Replaces hard execution limits with credit balance checks."
```

---

### Task 4: Update Stripe Billing Integration

**Files:**
- Modify: `C:\Users\daley\Desktop\fma-app\src\lib\actions\billing.ts`
- Modify: `C:\Users\daley\Desktop\fma-app\src\app\api\webhooks\stripe\route.ts`

**Step 1: Update createCheckoutSession for new tiers**

Add onboarding fee as a one-time line item alongside the subscription. Update tier key resolution to new AGENT_TIERS.

**Step 2: Add createCreditPackCheckout action**

```typescript
export async function createCreditPackCheckout(packKey: CreditPackKey) {
  // Validates pack exists, creates Stripe Checkout session in 'payment' mode
  // (one-time, not subscription) for the credit pack
}
```

**Step 3: Update webhook handler**

- `checkout.session.completed`: Handle credit pack purchases (call `add_purchased_credits` RPC)
- `invoice.paid`: Allocate monthly credits on successful subscription renewal (call `allocate_monthly_credits` RPC)
- Update tier mapping to new tier names

**Step 4: Commit**

```bash
git add src/lib/actions/billing.ts src/app/api/webhooks/stripe/route.ts
git commit -m "feat: update Stripe billing for premium tiers and credit packs

Onboarding fees as one-time line items. Credit pack purchases.
Monthly credit allocation on invoice.paid webhook."
```

---

### Task 5: Update Billing Dashboard UI

**Files:**
- Modify: `C:\Users\daley\Desktop\fma-app\src\app\(protected)\billing\page.tsx`
- Modify: `C:\Users\daley\Desktop\fma-app\src\components\billing\ContractOverview.tsx`
- Modify: `C:\Users\daley\Desktop\fma-app\src\components\billing\UsageBreakdown.tsx`
- Modify: `C:\Users\daley\Desktop\fma-app\src\components\billing\AddonCards.tsx`

**Step 1: Replace AddonCards with CreditPackCards**

Show 3 credit packs (Boost/Scale/Unlimited) instead of 7 skill add-ons.

**Step 2: Update ContractOverview for new tier names and prices**

Show new tier names, credit balance, credit usage bar (consumed/allocated).

**Step 3: Update UsageBreakdown to show credit consumption per skill**

Replace execution-count bars with credit-consumption bars. Show top skills by credit usage.

**Step 4: Commit**

```bash
git add src/app/(protected)/billing/ src/components/billing/
git commit -m "feat: update billing dashboard for credit-based model

Credit balance display, credit pack purchase cards,
per-skill credit consumption breakdown."
```

---

### Task 6: Update Feature Gate (Remove Skill Restrictions)

**Files:**
- Modify: `C:\Users\daley\Desktop\fma-app\src\components\feature-gate.tsx`
- Modify: `C:\Users\daley\Desktop\fma-app\src\components\upgrade-modal.tsx`

**Step 1: Simplify feature-gate**

All paid tiers now include all skills. Feature gate only checks:
1. Has any paid tier (not 'free')
2. Has credit balance > 0

**Step 2: Update upgrade-modal**

Remove "add as addon" option. Replace with "buy credits" option when credits are low, or "upgrade tier" when on free.

**Step 3: Commit**

```bash
git add src/components/feature-gate.tsx src/components/upgrade-modal.tsx
git commit -m "feat: simplify feature gate — all skills included in all paid tiers

Gate now checks tier (any paid) and credit balance only.
Upgrade modal offers tier upgrade or credit pack purchase."
```

---

### Task 7: Update Showcase Website — Pricing Page

**Files:**
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\src\app\[locale]\(marketing)\pricing\page.tsx`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\messages\en.json`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\messages\nl.json`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\messages\es.json`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\src\components\seo\PricingJsonLd.tsx`

**Step 1: Update i18n files with new pricing**

Replace all tier prices, names, descriptions, and feature lists in en.json, nl.json, es.json.

New tiers:
- Growth: EUR 1,497/mo — "Tot 5 klanten, 3.000 credits, alle skills"
- Professional: EUR 2,997/mo — "Tot 15 klanten, 8.000 credits, dedicated Slack" (highlighted as "Most Popular")
- Enterprise: EUR 4,997/mo — "Onbeperkt klanten, 20.000 credits, dedicated CSM"
- Founding: EUR 997/mo — "10 spots, lifetime pricing, direct founder access"

Replace add-on section with Credit Pack section (Boost/Scale/Unlimited).

Add onboarding fee mentions per tier.

**Step 2: Update pricing page component**

- Replace `TIER_KEYS` with new tier structure
- Replace `ADDON_KEYS` with credit pack keys
- Add "Contact Sales" button for Enterprise (instead of checkout link)
- Add onboarding fee display per tier card
- Add "All skills included" badge on every tier

**Step 3: Update PricingJsonLd.tsx**

Replace old structured data with new tier prices.

**Step 4: Commit**

```bash
git add fmai-nextjs/src/ fmai-nextjs/messages/
git commit -m "feat: update showcase pricing page to premium model

New tiers: Growth 1497, Professional 2997, Enterprise 4997.
All skills included. Credit packs replace add-ons.
Contact Sales for Enterprise. Onboarding fees displayed."
```

---

### Task 8: Update Founding Member Page

**Files:**
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\src\app\[locale]\(marketing)\founding-member\page.tsx`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\messages\en.json` (founding-member namespace)
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\messages\nl.json`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\messages\es.json`

**Step 1: Update founding member pricing and comparison**

- Price: EUR 997/mo (lifetime lock)
- Comparison: "Professional tier normally EUR 2,997/month — you save EUR 2,000/mo"
- 10,000 credits/mo included
- Unlimited workspaces
- All skills included
- Direct founder access via Slack
- 10 spots only (reduced from previous)
- No onboarding fee

**Step 2: Commit**

```bash
git add fmai-nextjs/
git commit -m "feat: update founding member page for premium positioning

997/mo vs Professional 2997/mo comparison. 10K credits, unlimited workspaces.
Stronger value prop against premium tier pricing."
```

---

### Task 9: Update Chatbot Knowledge Bases

**Files:**
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\src\lib\chatbot\knowledge\concierge-kb.ts`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\src\lib\chatbot\knowledge\leadgen-kb.ts`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\src\lib\chatbot\tools\flagship-tools.ts`
- Modify: `C:\Users\daley\Desktop\Futuremarketingai\fmai-nextjs\src\lib\chatbot\tools\leadgen-tools.ts`

**Step 1: Update all pricing references in chatbot knowledge bases**

Replace old tier names and prices with new premium model. Update get_pricing_info tool responses. Update ROI calculator with new pricing anchors.

**Step 2: Commit**

```bash
git add fmai-nextjs/src/lib/chatbot/
git commit -m "feat: update chatbot knowledge bases with premium pricing

All chatbot personas now reference Growth/Professional/Enterprise tiers
with updated prices and credit-based model."
```

---

### Task 10: Create Stripe Products and Prices

**Manual / Script task — not code changes but critical setup**

**Step 1: Create products in Stripe Dashboard**

Products to create:
- "FMai Growth — AI Marketing Starter" (recurring, EUR 1,497/mo)
- "FMai Professional — AI Marketing Pro" (recurring, EUR 2,997/mo)
- "FMai Enterprise — AI Marketing Suite" (recurring, EUR 4,997/mo)
- "FMai Founding Member — Founders Club" (recurring, EUR 997/mo)
- "FMai Onboarding — Growth" (one-time, EUR 1,500)
- "FMai Onboarding — Professional" (one-time, EUR 3,000)
- "FMai Onboarding — Enterprise" (one-time, EUR 5,000)
- "FMai Credits — Boost (2,000)" (one-time, EUR 149)
- "FMai Credits — Scale (5,000)" (one-time, EUR 297)
- "FMai Credits — Unlimited (15,000)" (one-time, EUR 697)

Also create annual price variants (15% discount):
- Growth Annual: EUR 1,272/mo
- Professional Annual: EUR 2,547/mo
- Enterprise Annual: EUR 4,247/mo

**Step 2: Update .env with new Stripe price IDs**

```env
STRIPE_PRICE_GROWTH=price_xxx
STRIPE_PRICE_PROFESSIONAL=price_xxx
STRIPE_PRICE_ENTERPRISE=price_xxx
STRIPE_PRICE_FOUNDING=price_xxx
STRIPE_PRICE_ONBOARDING_GROWTH=price_xxx
STRIPE_PRICE_ONBOARDING_PROFESSIONAL=price_xxx
STRIPE_PRICE_ONBOARDING_ENTERPRISE=price_xxx
STRIPE_PRICE_CREDITS_BOOST=price_xxx
STRIPE_PRICE_CREDITS_SCALE=price_xxx
STRIPE_PRICE_CREDITS_UNLIMITED=price_xxx
STRIPE_PRICE_GROWTH_ANNUAL=price_xxx
STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_xxx
STRIPE_PRICE_ENTERPRISE_ANNUAL=price_xxx
```

**Step 3: Commit env template**

```bash
git add .env.example
git commit -m "feat: add Stripe price ID env vars for premium pricing model"
```

---

## Execution Order

Tasks 1-3 are backend foundations (can be done in sequence).
Tasks 4-6 are FMA-App UI updates (depend on 1-3).
Tasks 7-9 are showcase website updates (can parallel with 4-6).
Task 10 is Stripe setup (should be done before testing 4-6).

Recommended wave execution:
- **Wave 1:** Task 1, Task 2 (parallel — code and database)
- **Wave 2:** Task 3 (depends on 1+2)
- **Wave 3:** Task 4, Task 7, Task 8, Task 10 (parallel — billing, website, Stripe)
- **Wave 4:** Task 5, Task 6, Task 9 (parallel — UI updates)
- **Wave 5:** Integration testing across both apps

---

## Verification Checklist

- [ ] All old tier names map correctly via TIER_MAP (no broken orgs)
- [ ] Credit consumption is atomic (no race conditions on balance)
- [ ] Stripe webhooks handle both old and new product IDs
- [ ] Pricing page shows correct EUR amounts in EN/NL/ES
- [ ] JSON-LD structured data matches new pricing
- [ ] Chatbot responds with correct pricing when asked
- [ ] Feature gate allows all skills for all paid tiers
- [ ] Credit balance decrements correctly on skill execution
- [ ] Monthly credit allocation fires on subscription renewal
- [ ] Credit pack purchase adds credits immediately
- [ ] Founding members get unlimited workspaces + 10K credits
- [ ] Enterprise "Contact Sales" button works (mailto or Calendly)
- [ ] Onboarding fee appears as line item in Stripe Checkout
