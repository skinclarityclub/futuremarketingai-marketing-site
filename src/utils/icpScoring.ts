/**
 * ICP Scoring Logic
 *
 * Implements the scoring algorithm to qualify leads based on proxy indicators
 * instead of direct revenue mentions.
 *
 * Algorithm details in: docs/messaging/proxy-indicators-framework.md
 *
 * @module icpScoring
 */

import {
  UserInput,
  ICPQualification,
  ICPScoreBreakdown,
  ICPTier,
  PersonalizationConfig,
  ICP_THRESHOLDS,
  MAX_SCORES,
  TeamSize,
  ChannelsCount,
  PainPoint,
  Industry,
} from '../types/icp'

// Re-export types for convenience
export type {
  UserInput as ICPInputData,
  TeamSize,
  ChannelsCount,
  PainPoint,
  Industry,
  ICPScoreBreakdown,
} from '../types/icp'

/**
 * Calculate team size score (0-30 points)
 *
 * Primary ICP: 15-50 people (30 points)
 * Secondary ICP: 5-15 people (25 points)
 * Edge case: 1-5 people (15 points)
 * Too large: 50+ people (10 points)
 */
function calculateTeamSizeScore(teamSize: TeamSize): number {
  const scores: Record<TeamSize, number> = {
    '15-50': 30, // Primary ICP - perfect fit
    '5-15': 25, // Secondary ICP - good fit
    '1-5': 15, // Edge case - lean startup
    '50+': 10, // Too large - enterprise (not target)
  }

  return scores[teamSize]
}

/**
 * Calculate marketing channels score (0-25 points)
 *
 * 6-10 channels: 25 points (high complexity, needs automation)
 * 3-5 channels: 20 points (moderate complexity)
 * 10+ channels: 15 points (possibly enterprise)
 * 1-2 channels: 10 points (too simple)
 */
function calculateChannelsScore(channels: ChannelsCount): number {
  const scores: Record<ChannelsCount, number> = {
    '6-10': 25, // Sweet spot - high complexity
    '3-5': 20, // Good fit
    '10+': 15, // Possibly enterprise
    '1-2': 10, // Too simple for autonomous AI
  }

  return scores[channels]
}

/**
 * Calculate pain points score (0-25 points)
 *
 * Each pain point adds value, max 25 points total
 *
 * High-value pain points:
 * - agency-cost: 15 points (clear budget to reallocate)
 * - scaling-problem: 10 points (growth blocker)
 *
 * Moderate-value pain points:
 * - manual-work: 10 points
 * - channel-overload: 10 points
 * - content-bottleneck: 10 points
 * - hiring-limitation: 10 points
 */
function calculatePainPointsScore(painPoints: PainPoint[]): number {
  const scores: Record<PainPoint, number> = {
    'agency-cost': 15, // Highest value - budget to reallocate
    'scaling-problem': 10, // High value - growth blocker
    'manual-work': 10,
    'channel-overload': 10,
    'content-bottleneck': 10,
    'hiring-limitation': 10,
  }

  // Sum all pain point scores, cap at MAX_SCORES.PAIN_POINTS
  const totalScore = painPoints.reduce((sum, point) => sum + scores[point], 0)
  return Math.min(totalScore, MAX_SCORES.PAIN_POINTS)
}

/**
 * Calculate industry score (0-20 points)
 *
 * Top 3 industries: 20 points
 * Other industries: 10 points
 */
function calculateIndustryScore(industry: Industry): number {
  const topIndustries: Industry[] = ['ecommerce', 'saas', 'agency']

  return topIndustries.includes(industry) ? 20 : 10
}

/**
 * Calculate complete ICP score with breakdown
 *
 * Scoring algorithm:
 * - Team Size: 0-30 points
 * - Channels: 0-25 points
 * - Pain Points: 0-25 points
 * - Industry: 0-20 points
 *
 * Total: 0-100 points
 *
 * @param input User input data
 * @returns Score breakdown
 */
export function calculateICPScore(input: UserInput): ICPScoreBreakdown {
  const teamSizeScore = calculateTeamSizeScore(input.teamSize)
  const channelsScore = calculateChannelsScore(input.channels)
  const painPointsScore = calculatePainPointsScore(input.painPoints)
  const industryScore = calculateIndustryScore(input.industry)

  const totalScore = Math.min(
    teamSizeScore + channelsScore + painPointsScore + industryScore,
    MAX_SCORES.TOTAL
  )

  const tier = getICPTier(totalScore)

  return {
    teamSizeScore,
    channelsScore,
    painPointsScore,
    industryScore,
    totalScore,
    overall: totalScore, // Alias for backwards compatibility
    total: totalScore, // Another alias
    tier, // ICP tier classification
    maxScore: MAX_SCORES.TOTAL,
  }
}

/**
 * Determine ICP tier based on total score
 *
 * Primary ICP: 70-100 points
 * Secondary ICP: 50-69 points
 * Nurture: 0-49 points
 */
export function getICPTier(score: number): ICPTier {
  if (score >= ICP_THRESHOLDS.PRIMARY_MIN) {
    return 'primary'
  }
  if (score >= ICP_THRESHOLDS.SECONDARY_MIN) {
    return 'secondary'
  }
  return 'nurture'
}

/**
 * Get recommendations based on ICP tier
 *
 * Provides personalized CTA text, messaging, feature visibility,
 * and follow-up timing based on qualification tier.
 */
function getRecommendations(tier: ICPTier): ICPQualification['recommendations'] {
  switch (tier) {
    case 'primary':
      return {
        cta: 'Book Founder Call →',
        message: 'Perfect fit for teams like yours',
        features: [
          'Premium features',
          'Technical deep-dive',
          'Custom implementation plan',
          'Direct founder access',
        ],
        followUpTiming: 'Within 24 hours, founder direct',
      }

    case 'secondary':
      return {
        cta: 'See Demo →',
        message: 'Great fit for growing teams',
        features: ['Standard features', 'ROI calculator', 'Case studies', 'Implementation guide'],
        followUpTiming: 'Within 48 hours, standard outreach',
      }

    case 'nurture':
      return {
        cta: 'Learn More →',
        message: 'Discover how it works',
        features: ['Educational content', 'Use cases', 'Getting started guide', 'Community access'],
        followUpTiming: 'Email drip campaign',
      }
  }
}

/**
 * Complete ICP qualification
 *
 * Calculates score, determines tier, and provides recommendations
 *
 * @param input User input data
 * @returns Complete qualification result
 *
 * @example
 * ```typescript
 * const qualification = qualifyICP({
 *   teamSize: '15-50',
 *   channels: '6-10',
 *   painPoints: ['agency-cost', 'scaling-problem'],
 *   industry: 'ecommerce'
 * });
 *
 * console.log(qualification.tier); // 'primary'
 * console.log(qualification.score); // 90
 * console.log(qualification.recommendations.cta); // 'Book Founder Call →'
 * ```
 */
export function qualifyICP(input: UserInput): ICPQualification {
  const breakdown = calculateICPScore(input)
  const tier = getICPTier(breakdown.totalScore)
  const recommendations = getRecommendations(tier)

  return {
    score: breakdown.totalScore,
    tier,
    breakdown,
    recommendations,
  }
}

/**
 * Get personalization configuration based on ICP qualification
 *
 * Returns configuration for UI personalization including:
 * - Feature visibility
 * - CTA variants
 * - Follow-up strategy
 * - Priority level
 *
 * @param qualification ICP qualification result
 * @returns Personalization config
 */
export function getPersonalizationConfig(qualification: ICPQualification): PersonalizationConfig {
  const { tier } = qualification

  switch (tier) {
    case 'primary':
      return {
        tier,
        showPremiumFeatures: true,
        showTechnicalDetails: true,
        ctaText: 'Book Founder Call',
        ctaVariant: 'primary',
        followUpStrategy: 'immediate',
        priorityLevel: 'high',
      }

    case 'secondary':
      return {
        tier,
        showPremiumFeatures: false,
        showTechnicalDetails: false,
        ctaText: 'See Demo',
        ctaVariant: 'secondary',
        followUpStrategy: 'standard',
        priorityLevel: 'medium',
      }

    case 'nurture':
      return {
        tier,
        showPremiumFeatures: false,
        showTechnicalDetails: false,
        ctaText: 'Learn More',
        ctaVariant: 'default',
        followUpStrategy: 'nurture',
        priorityLevel: 'low',
      }
  }
}

/**
 * Helper: Check if user is primary ICP
 */
export function isPrimaryICP(input: UserInput): boolean {
  const { totalScore } = calculateICPScore(input)
  return totalScore >= ICP_THRESHOLDS.PRIMARY_MIN
}

/**
 * Helper: Check if user is qualified (primary or secondary ICP)
 */
export function isQualified(input: UserInput): boolean {
  const { totalScore } = calculateICPScore(input)
  return totalScore >= ICP_THRESHOLDS.SECONDARY_MIN
}

/**
 * Helper: Get score percentage (0-100%)
 */
export function getScorePercentage(score: number): number {
  return Math.round((score / MAX_SCORES.TOTAL) * 100)
}

/**
 * Debug: Get human-readable score interpretation
 *
 * Useful for testing and debugging
 */
export function interpretScore(qualification: ICPQualification): string {
  const { score, tier, breakdown } = qualification
  const percentage = getScorePercentage(score)

  const parts = [
    `Score: ${score}/${MAX_SCORES.TOTAL} (${percentage}%)`,
    `Tier: ${tier.toUpperCase()}`,
    '',
    'Breakdown:',
    `- Team Size: ${breakdown.teamSizeScore}/${MAX_SCORES.TEAM_SIZE}`,
    `- Channels: ${breakdown.channelsScore}/${MAX_SCORES.CHANNELS}`,
    `- Pain Points: ${breakdown.painPointsScore}/${MAX_SCORES.PAIN_POINTS}`,
    `- Industry: ${breakdown.industryScore}/${MAX_SCORES.INDUSTRY}`,
  ]

  return parts.join('\n')
}
