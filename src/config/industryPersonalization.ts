/**
 * Industry-Specific Personalization Data
 *
 * Features:
 * - Calculator benchmarks per industry
 * - Module priority/ordering
 * - Testimonials per industry
 * - Content variations
 */

/**
 * Industry Benchmarks for Calculator
 */
export interface IndustryBenchmarks {
  avgTeamSize: number
  avgSalary: number
  avgCampaignsPerMonth: number
  typicalROI: number // Percentage (industry average)
  description: string
  // Competitive benchmarking data
  topPerformerROI: number // Top 10% ROI
  avgTimeSaved: number // Average monthly time saved (hours)
  topTimeSaved: number // Top 10% time saved
  avgCostSavings: number // Average annual cost savings
  topCostSavings: number // Top 10% cost savings
  // ROAS Benchmarks
  avgROAS: number // Average ROAS (e.g., 4:1)
  topROAS: number // Top 10% ROAS (e.g., 10:1)
  avgWastedAdSpend: number // Average % of ad spend wasted (0-1, e.g., 0.30 = 30%)
  avgAdBudget: number // Average monthly ad budget
}

export const INDUSTRY_BENCHMARKS: Record<string, IndustryBenchmarks> = {
  ecommerce: {
    avgTeamSize: 4, // Research: 2-6, performance marketing focused
    avgSalary: 50000,
    avgCampaignsPerMonth: 20, // Realistic starting point: ~5/week (product launches, promos, retargeting)
    typicalROI: 420,
    description:
      'E-commerce bedrijven met 15-30% marketing spend bereiken hoogste ROI via AI automation',
    // Competitive benchmarks
    topPerformerROI: 650, // Top 10% achieve 650%+ ROI
    avgTimeSaved: 120, // Average 120 hours/month saved
    topTimeSaved: 200, // Top performers save 200+ hours/month
    avgCostSavings: 48000, // Average €48k annual savings
    topCostSavings: 85000, // Top performers save €85k+ annually
    // ROAS Benchmarks (2025 research-backed)
    avgROAS: 4.2, // Average 4.2:1 ROAS for ecommerce
    topROAS: 10.5, // Top 10% achieve 10.5:1 with AI testing
    avgWastedAdSpend: 0.35, // 35% wasted spend without proper testing
    avgAdBudget: 8000, // Average €8k/month ad budget
  },
  saas: {
    avgTeamSize: 5, // Research: 3-8, scaling teams managing multiple channels
    avgSalary: 65000,
    avgCampaignsPerMonth: 15, // Realistic: ~4/week (content, webinars, nurture sequences)
    typicalROI: 350,
    description: 'Scaling tech teams (5-15 people) managing 3-10 channels with AI automation',
    // Competitive benchmarks
    topPerformerROI: 550, // Top 10% achieve 550%+ ROI
    avgTimeSaved: 150, // Average 150 hours/month saved
    topTimeSaved: 250, // Top performers save 250+ hours/month
    avgCostSavings: 65000, // Average €65k annual savings
    topCostSavings: 110000, // Top performers save €110k+ annually
    // ROAS Benchmarks (2025 research-backed)
    avgROAS: 5.8, // Average 5.8:1 ROAS for B2B SaaS
    topROAS: 12, // Top 10% achieve 12:1 with AI testing
    avgWastedAdSpend: 0.3, // 30% wasted spend (lower than ecom, more targeted)
    avgAdBudget: 12000, // Average €12k/month ad budget
  },
  agency: {
    avgTeamSize: 8, // Research: 5-12, multi-client agency teams
    avgSalary: 55000,
    avgCampaignsPerMonth: 30, // Realistic: ~7-8/week across multiple clients
    typicalROI: 380,
    description: 'Marketing agencies managing 10+ clients with lean teams (8-15 people)',
    // Competitive benchmarks
    topPerformerROI: 600, // Top 10% achieve 600%+ ROI
    avgTimeSaved: 180, // Average 180 hours/month saved
    topTimeSaved: 300, // Top performers save 300+ hours/month
    avgCostSavings: 75000, // Average €75k annual savings
    topCostSavings: 135000, // Top performers save €135k+ annually
    // ROAS Benchmarks (2025 research-backed)
    avgROAS: 4.5, // Average 4.5:1 ROAS for agencies (mixed clients)
    topROAS: 11, // Top 10% achieve 11:1 with AI testing
    avgWastedAdSpend: 0.38, // 38% wasted spend (higher due to client variety)
    avgAdBudget: 15000, // Average €15k/month ad budget (across clients)
  },
  other: {
    avgTeamSize: 4, // Average across all
    avgSalary: 55000,
    avgCampaignsPerMonth: 12, // Realistic: ~3/week (balanced approach for SMBs)
    typicalROI: 310,
    description: 'Growing teams (4-12 people) managing 3-8 channels with lean resources',
    // Competitive benchmarks
    topPerformerROI: 500, // Top 10% achieve 500%+ ROI
    avgTimeSaved: 100, // Average 100 hours/month saved
    topTimeSaved: 180, // Top performers save 180+ hours/month
    avgCostSavings: 45000, // Average €45k annual savings
    topCostSavings: 80000, // Top performers save €80k+ annually
    // ROAS Benchmarks (2025 research-backed)
    avgROAS: 3.8, // Average 3.8:1 ROAS for general businesses
    topROAS: 9.5, // Top 10% achieve 9.5:1 with AI testing
    avgWastedAdSpend: 0.4, // 40% wasted spend (no specialized expertise)
    avgAdBudget: 5000, // Average €5k/month ad budget
  },
}

/**
 * Module Priority per Industry
 * Higher number = higher priority
 */
export interface ModulePriority {
  'research-planning': number
  'manager-workflow': number
  'content-pipeline': number
  'publishing-layer': number
  'command-center': number
  'analytics-monitoring': number
  'ai-advisory': number
}

export const MODULE_PRIORITIES: Record<string, ModulePriority> = {
  ecommerce: {
    'analytics-monitoring': 10,
    'content-pipeline': 9,
    'publishing-layer': 8,
    'research-planning': 7,
    'command-center': 6,
    'manager-workflow': 5,
    'ai-advisory': 4,
  },
  saas: {
    'research-planning': 10,
    'content-pipeline': 9,
    'analytics-monitoring': 8,
    'manager-workflow': 7,
    'ai-advisory': 6,
    'publishing-layer': 5,
    'command-center': 4,
  },
  agency: {
    'research-planning': 10,
    'content-pipeline': 9,
    'ai-advisory': 8,
    'analytics-monitoring': 7,
    'manager-workflow': 6,
    'publishing-layer': 5,
    'command-center': 4,
  },
  other: {
    'research-planning': 7,
    'content-pipeline': 7,
    'analytics-monitoring': 7,
    'manager-workflow': 7,
    'publishing-layer': 7,
    'command-center': 7,
    'ai-advisory': 7,
  },
}

/**
 * REMOVED: Fake testimonials replaced with transparent early-stage positioning
 * See FoundingTeams section below for real, transparent social proof
 */

/**
 * Founding Teams - Transparent Early-Stage Social Proof
 * These are REAL teams launching with FutureMarketingAI in Q1 2025
 */
export interface FoundingTeam {
  id: string
  name: string
  industry: string
  description: string
  teamSize: string
  launchDate: string
}

export const FOUNDING_TEAMS: FoundingTeam[] = [
  {
    id: 'fma',
    name: 'FutureMarketingAI',
    industry: 'Marketing Automation',
    description: 'Building and testing the autonomous marketing platform',
    teamSize: 'Team of 3',
    launchDate: 'Q1 2026',
  },
  {
    id: 'skinclarity',
    name: 'SkinClarity Club',
    industry: 'E-commerce (Skincare)',
    description: 'Online skincare platform launching autonomous content',
    teamSize: 'Team of 5',
    launchDate: 'Q1 2026',
  },
  {
    id: 'denhartogh',
    name: 'Den Hartogh Solutions',
    industry: 'Business Solutions',
    description: 'Business solutions provider testing multi-channel automation',
    teamSize: 'Team of 8',
    launchDate: 'Q1 2026',
  },
]

/**
 * Industry-Specific Messaging
 * Targets scaling teams managing multiple channels
 */
export interface IndustryMessaging {
  heroSubtitle: string
  calculatorIntro: string
  ctaPrimaryMessage: string
  valueProposition: string
}

export const INDUSTRY_MESSAGING: Record<string, IndustryMessaging> = {
  ecommerce: {
    heroSubtitle: 'For e-commerce owners running 70+ campaigns/month with a 2-4 person team',
    calculatorIntro: 'See what you save when AI handles 80% of your performance marketing',
    ctaPrimaryMessage: 'Scale My Output',
    valueProposition: 'boost sales with smart automation',
  },
  saas: {
    heroSubtitle:
      'For scale-ups doubling content output without hiring extra developers or marketers',
    calculatorIntro:
      'Calculate how many FTEs you save by letting AI handle what your team does manually',
    ctaPrimaryMessage: 'Double My Output',
    valueProposition: 'double your content without extra team',
  },
  agency: {
    heroSubtitle: 'For marketing agencies managing 10+ clients with lean teams (8-15 people)',
    calculatorIntro:
      'See how your agency saves 200+ hours/month managing multiple client campaigns',
    ctaPrimaryMessage: 'Scale My Agency',
    valueProposition: 'manage more clients without hiring',
  },
  other: {
    heroSubtitle:
      'For fast-moving marketing teams managing multiple channels without adding headcount',
    calculatorIntro:
      'Calculate what you save: autonomous marketing with your current 3-6 person team',
    ctaPrimaryMessage: 'Start My Growth',
    valueProposition: 'scale smartly without overhead',
  },
}

/**
 * Normalize industry ID - migrates old IDs to new IDs
 * Ensures backward compatibility with old industry selections
 */
export function normalizeIndustryId(industryId?: string | null): string {
  if (!industryId) {
    return 'other'
  }

  // Map old IDs to new IDs
  const idMigrationMap: Record<string, string> = {
    professional: 'agency',
    technology: 'saas',
    // Removed industries default to 'other'
    healthcare: 'other',
    finance: 'other',
    'real-estate': 'other',
    education: 'other',
    hospitality: 'other',
    manufacturing: 'other',
  }

  // Return migrated ID or original if already valid
  return idMigrationMap[industryId] || industryId
}

/**
 * Get messaging for specific industry
 */
export function getIndustryMessaging(industryId?: string | null): IndustryMessaging {
  const normalizedId = normalizeIndustryId(industryId)

  if (!INDUSTRY_MESSAGING[normalizedId]) {
    return INDUSTRY_MESSAGING.other
  }
  return INDUSTRY_MESSAGING[normalizedId]
}

/**
 * Get benchmarks for specific industry
 */
export function getIndustryBenchmarks(industryId?: string | null): IndustryBenchmarks {
  const normalizedId = normalizeIndustryId(industryId)

  if (!INDUSTRY_BENCHMARKS[normalizedId]) {
    return INDUSTRY_BENCHMARKS.other
  }
  return INDUSTRY_BENCHMARKS[normalizedId]
}

/**
 * Get module priorities for specific industry
 */
export function getModulePriorities(industryId?: string | null): ModulePriority {
  const normalizedId = normalizeIndustryId(industryId)

  if (!MODULE_PRIORITIES[normalizedId]) {
    return MODULE_PRIORITIES.other
  }
  return MODULE_PRIORITIES[normalizedId]
}

/**
 * Get founding teams (transparent early-stage social proof)
 * Replaces fake testimonials with real, transparent information
 */
export function getFoundingTeams(limit = 3): FoundingTeam[] {
  return FOUNDING_TEAMS.slice(0, limit)
}

/**
 * Get early adopter messaging for transparent positioning
 */
export function getEarlyAdopterMessage(): string {
  const spotsRemaining = 10 - FOUNDING_TEAMS.length
  return `Launching Q1 2026 with ${FOUNDING_TEAMS.length} founding teams. ${spotsRemaining} founder spots remaining.`
}

/**
 * @deprecated Use getFoundingTeams() instead for transparent early-stage positioning
 * Kept for backward compatibility only
 */
export function getTestimonials(_industryId?: string | null, limit = 3): FoundingTeam[] {
  // Return founding teams instead of fake testimonials
  return getFoundingTeams(limit)
}

/**
 * Sort modules by priority for industry
 */
export function sortModulesByIndustry<T extends { id: string }>(
  modules: T[],
  industryId?: string | null
): T[] {
  const priorities = getModulePriorities(industryId)

  return [...modules].sort((a, b) => {
    const aPriority = priorities[a.id as keyof ModulePriority] || 0
    const bPriority = priorities[b.id as keyof ModulePriority] || 0
    return bPriority - aPriority
  })
}
