/**
 * Chatbot tier snapshot (v10, workspace-priced since 2026-04-28).
 *
 * WHY: both /api/chatbot tools (leadgen + concierge) need tier data to answer
 * pricing questions. Instead of hardcoding it inline (which is how the v9 drift
 * happened), we keep one module that mirrors fma-app/src/lib/skills.ts AGENT_TIERS.
 *
 * Pricing model:
 * - 'fixed': single monthly price (Founding Member only).
 * - 'workspace': monthly price = pricePerWorkspace * workspaces. Credits scale
 *   with workspaces too. `monthlyPrice` represents the starter price for
 *   minWorkspaces, used for legacy UI rendering compatibility.
 *
 * When fma-app pricing changes, update this file AND src/lib/skills-data.ts
 * AND messages/*.json simultaneously. See fmai-nextjs/CLAUDE.md
 * "Pricing Source of Truth" rule.
 */

export const CHATBOT_TIERS = {
  founding: {
    name: 'Founding Member',
    pricingModel: 'fixed' as const,
    monthlyPrice: 997,
    onboardingFee: 0,
    workspaces: -1, // unlimited
    credits: 8000,
    spotsTotal: 10,
    spotsTaken: 1,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included (9 live, 3 coming soon)',
      'Unlimited workspaces',
      '8,000 credits per month',
      'Lifetime price lock at 997 EUR (never raises for founding members)',
      'Direct founder access',
      'Shape the product roadmap',
      '10 spots total, 1 taken (SkinClarity Club), no onboarding fee',
    ],
  },
  growth: {
    name: 'Growth',
    pricingModel: 'workspace' as const,
    pricePerWorkspace: 499,
    minWorkspaces: 2,
    maxWorkspaces: 4,
    creditsPerWorkspace: 800,
    monthlyPrice: 998, // 499 * 2 starter (legacy field for UI rendering)
    onboardingFee: 1997,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included',
      '2 to 4 brand workspaces',
      '499 EUR per workspace per month (998 EUR starter for 2 brands)',
      '800 credits per workspace (1,600 to 3,200 total per month)',
      '1,997 EUR one-time onboarding',
      'Email support',
    ],
  },
  professional: {
    name: 'Professional',
    pricingModel: 'workspace' as const,
    pricePerWorkspace: 399,
    minWorkspaces: 5,
    maxWorkspaces: 14,
    creditsPerWorkspace: 800,
    monthlyPrice: 1995, // 399 * 5 starter
    onboardingFee: 3997,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included',
      '5 to 14 brand workspaces',
      '399 EUR per workspace per month (1,995 EUR starter for 5 brands)',
      '800 credits per workspace (4,000 to 11,200 total per month)',
      '3,997 EUR one-time onboarding',
      'Dedicated Slack channel',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    pricingModel: 'workspace' as const,
    pricePerWorkspace: 299,
    minWorkspaces: 15,
    maxWorkspaces: -1, // unlimited
    creditsPerWorkspace: 800,
    monthlyPrice: 4485, // 299 * 15 starter
    onboardingFee: 5997,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included',
      '15 plus brand workspaces (no upper cap)',
      '299 EUR per workspace per month (4,485 EUR starter for 15 brands)',
      '800 credits per workspace (12,000 plus total per month)',
      '5,997 EUR one-time onboarding',
      'Dedicated Customer Success Manager',
    ],
  },
} as const

export type ChatbotTierKey = keyof typeof CHATBOT_TIERS
