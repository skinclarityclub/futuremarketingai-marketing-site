/**
 * Chatbot tier snapshot (v10).
 *
 * WHY: both /api/chatbot tools (leadgen + concierge) need tier data to answer
 * pricing questions. Instead of hardcoding it inline (which is how the v9 drift
 * happened), we keep one module that mirrors fma-app/src/lib/skills.ts AGENT_TIERS.
 *
 * When fma-app pricing changes, update this file AND src/lib/skills-data.ts
 * AND messages/*.json simultaneously. See fmai-nextjs/CLAUDE.md
 * "Pricing Source of Truth" rule.
 */

export const CHATBOT_TIERS = {
  partner: {
    name: 'Partner',
    monthlyPrice: 347,
    onboardingFee: 497,
    workspaces: 1,
    credits: 1000,
    skillsIncluded: 8,
    skillsTotal: 12,
    features: [
      '8 of 12 skills included (Social Media, Blog Factory, Lead Qualifier, Email Management, Reporting, SEO/GEO, Research, Clyde)',
      'Add-on paths: Static Ads pack 97 EUR, ManyChat pack 47 EUR',
      '1 workspace',
      '1,000 credits per month',
      '497 EUR one-time onboarding',
    ],
  },
  growth: {
    name: 'Growth',
    monthlyPrice: 2497,
    onboardingFee: 1997,
    workspaces: 5,
    credits: 4000,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included',
      '5 workspaces',
      '4,000 credits per month',
      '1,997 EUR one-time onboarding',
    ],
  },
  professional: {
    name: 'Professional',
    monthlyPrice: 4497,
    onboardingFee: 3997,
    workspaces: 15,
    credits: 12000,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included',
      '15 workspaces',
      '12,000 credits per month',
      'Dedicated Slack channel',
      '3,997 EUR one-time onboarding',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    monthlyPrice: 7997,
    onboardingFee: 5997,
    workspaces: -1,
    credits: 30000,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills included, no caps',
      'Unlimited workspaces',
      '30,000 credits per month',
      'Dedicated Customer Success Manager',
      '5,997 EUR one-time onboarding',
    ],
  },
  founding: {
    name: 'Founding Member',
    monthlyPrice: 997,
    onboardingFee: 0,
    workspaces: -1,
    credits: 8000,
    spotsTotal: 10,
    skillsIncluded: 12,
    skillsTotal: 12,
    features: [
      'All 12 skills with Professional-tier caps',
      'Unlimited workspaces',
      '8,000 credits per month',
      'Lifetime price lock',
      'Direct founder access',
      'Shape the product roadmap',
      '10 spots total, no onboarding fee',
    ],
  },
} as const

export type ChatbotTierKey = keyof typeof CHATBOT_TIERS
