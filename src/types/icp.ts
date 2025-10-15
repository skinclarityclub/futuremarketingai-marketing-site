/**
 * ICP (Ideal Customer Profile) Type Definitions
 *
 * Defines all types related to ICP scoring and qualification
 * Based on: docs/messaging/proxy-indicators-framework.md
 */

/**
 * Team size ranges for ICP qualification
 */
export type TeamSize = '1-5' | '5-15' | '15-50' | '50+'

/**
 * Marketing channels count ranges
 */
export type ChannelsCount = '1-2' | '3-5' | '6-10' | '10+'

/**
 * Target industries for personalization
 */
export type Industry = 'ecommerce' | 'saas' | 'agency' | 'other'

/**
 * Pain point indicators
 */
export type PainPoint =
  | 'agency-cost' // Spending €10K+/month on agencies
  | 'manual-work' // Drowning in manual marketing tasks
  | 'scaling-problem' // Need 10x output without 10x budget
  | 'channel-overload' // Managing too many channels manually
  | 'content-bottleneck' // Need more content than team can produce
  | 'hiring-limitation' // Can't hire fast enough

/**
 * ICP qualification tiers based on score
 */
export type ICPTier = 'primary' | 'secondary' | 'nurture'

/**
 * Input data for ICP scoring calculation
 */
export interface UserInput {
  teamSize: TeamSize
  channels: ChannelsCount
  painPoints: PainPoint[]
  industry: Industry
  currentSpend?: number // Optional: monthly marketing spend in €
}

/**
 * Detailed breakdown of ICP score calculation
 */
export interface ICPScoreBreakdown {
  teamSizeScore: number
  channelsScore: number
  painPointsScore: number
  industryScore: number
  totalScore: number
  overall: number // Alias for totalScore for backwards compatibility
  total: number // Another alias for totalScore
  tier: ICPTier // ICP tier classification
  maxScore: number
}

/**
 * Complete ICP qualification result
 */
export interface ICPQualification {
  score: number
  tier: ICPTier
  breakdown: ICPScoreBreakdown
  recommendations: {
    cta: string
    message: string
    features: string[]
    followUpTiming: string
  }
}

/**
 * Personalization configuration based on ICP tier
 */
export interface PersonalizationConfig {
  tier: ICPTier
  showPremiumFeatures: boolean
  showTechnicalDetails: boolean
  ctaText: string
  ctaVariant: 'primary' | 'secondary' | 'default'
  followUpStrategy: 'immediate' | 'standard' | 'nurture'
  priorityLevel: 'high' | 'medium' | 'low'
}

/**
 * Scoring thresholds for tier classification
 */
export const ICP_THRESHOLDS = {
  PRIMARY_MIN: 70, // 70-100 points → Primary ICP
  SECONDARY_MIN: 50, // 50-69 points → Secondary ICP
  // Below 50 → Nurture tier
} as const

/**
 * Maximum possible scores per category
 */
export const MAX_SCORES = {
  TEAM_SIZE: 30,
  CHANNELS: 25,
  PAIN_POINTS: 25,
  INDUSTRY: 20,
  TOTAL: 100,
} as const
