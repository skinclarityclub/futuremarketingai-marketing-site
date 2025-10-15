/**
 * ICP Scoring Logic Unit Tests
 *
 * Comprehensive test coverage for ICP qualification algorithm
 */

import { describe, it, expect } from 'vitest'
import {
  calculateICPScore,
  getICPTier,
  qualifyICP,
  getPersonalizationConfig,
  isPrimaryICP,
  isQualified,
  getScorePercentage,
  interpretScore,
} from '../icpScoring'
import { UserInput, ICP_THRESHOLDS, MAX_SCORES } from '../../types/icp'

describe('ICP Scoring Logic', () => {
  describe('calculateICPScore', () => {
    it('should calculate maximum possible score (100 points)', () => {
      const input: UserInput = {
        teamSize: '15-50', // 30 points
        channels: '6-10', // 25 points
        painPoints: ['agency-cost', 'scaling-problem'], // 15 + 10 = 25 points
        industry: 'ecommerce', // 20 points
      }

      const breakdown = calculateICPScore(input)

      expect(breakdown.teamSizeScore).toBe(30)
      expect(breakdown.channelsScore).toBe(25)
      expect(breakdown.painPointsScore).toBe(25)
      expect(breakdown.industryScore).toBe(20)
      expect(breakdown.totalScore).toBe(100)
      expect(breakdown.maxScore).toBe(MAX_SCORES.TOTAL)
    })

    it('should calculate primary ICP score (70-100 points)', () => {
      const input: UserInput = {
        teamSize: '15-50', // 30 points
        channels: '3-5', // 20 points
        painPoints: ['agency-cost'], // 15 points
        industry: 'saas', // 20 points
      }

      const breakdown = calculateICPScore(input)

      expect(breakdown.totalScore).toBe(85)
      expect(breakdown.totalScore).toBeGreaterThanOrEqual(ICP_THRESHOLDS.PRIMARY_MIN)
    })

    it('should calculate secondary ICP score (50-69 points)', () => {
      const input: UserInput = {
        teamSize: '5-15', // 25 points
        channels: '3-5', // 20 points
        painPoints: ['manual-work'], // 10 points
        industry: 'other', // 10 points
      }

      const breakdown = calculateICPScore(input)

      expect(breakdown.totalScore).toBe(65)
      expect(breakdown.totalScore).toBeGreaterThanOrEqual(ICP_THRESHOLDS.SECONDARY_MIN)
      expect(breakdown.totalScore).toBeLessThan(ICP_THRESHOLDS.PRIMARY_MIN)
    })

    it('should calculate nurture score (<50 points)', () => {
      const input: UserInput = {
        teamSize: '1-5', // 15 points
        channels: '1-2', // 10 points
        painPoints: [], // 0 points
        industry: 'other', // 10 points
      }

      const breakdown = calculateICPScore(input)

      expect(breakdown.totalScore).toBe(35)
      expect(breakdown.totalScore).toBeLessThan(ICP_THRESHOLDS.SECONDARY_MIN)
    })

    it('should cap pain points score at maximum', () => {
      const input: UserInput = {
        teamSize: '15-50',
        channels: '6-10',
        painPoints: [
          'agency-cost', // 15
          'scaling-problem', // 10
          'manual-work', // 10 (would be 35 total)
          'channel-overload', // 10 (would be 45 total)
        ],
        industry: 'ecommerce',
      }

      const breakdown = calculateICPScore(input)

      expect(breakdown.painPointsScore).toBe(MAX_SCORES.PAIN_POINTS) // Capped at 25
      expect(breakdown.painPointsScore).toBeLessThanOrEqual(MAX_SCORES.PAIN_POINTS)
    })

    it('should handle empty pain points array', () => {
      const input: UserInput = {
        teamSize: '15-50',
        channels: '6-10',
        painPoints: [],
        industry: 'ecommerce',
      }

      const breakdown = calculateICPScore(input)

      expect(breakdown.painPointsScore).toBe(0)
      expect(breakdown.totalScore).toBe(75) // 30 + 25 + 0 + 20
    })
  })

  describe('getICPTier', () => {
    it('should classify score 70-100 as primary', () => {
      expect(getICPTier(100)).toBe('primary')
      expect(getICPTier(85)).toBe('primary')
      expect(getICPTier(70)).toBe('primary')
    })

    it('should classify score 50-69 as secondary', () => {
      expect(getICPTier(69)).toBe('secondary')
      expect(getICPTier(60)).toBe('secondary')
      expect(getICPTier(50)).toBe('secondary')
    })

    it('should classify score 0-49 as nurture', () => {
      expect(getICPTier(49)).toBe('nurture')
      expect(getICPTier(25)).toBe('nurture')
      expect(getICPTier(0)).toBe('nurture')
    })

    it('should handle boundary values correctly', () => {
      expect(getICPTier(70)).toBe('primary') // Boundary: Primary
      expect(getICPTier(69)).toBe('secondary') // Boundary: Secondary
      expect(getICPTier(50)).toBe('secondary') // Boundary: Secondary
      expect(getICPTier(49)).toBe('nurture') // Boundary: Nurture
    })
  })

  describe('qualifyICP', () => {
    it('should return complete qualification for primary ICP', () => {
      const input: UserInput = {
        teamSize: '15-50',
        channels: '6-10',
        painPoints: ['agency-cost', 'scaling-problem'],
        industry: 'ecommerce',
      }

      const qualification = qualifyICP(input)

      expect(qualification.tier).toBe('primary')
      expect(qualification.score).toBe(100)
      expect(qualification.recommendations.cta).toBe('Book Founder Call →')
      expect(qualification.recommendations.followUpTiming).toBe('Within 24 hours, founder direct')
      expect(qualification.breakdown).toBeDefined()
    })

    it('should return complete qualification for secondary ICP', () => {
      const input: UserInput = {
        teamSize: '5-15', // 25 points
        channels: '3-5', // 20 points
        painPoints: ['manual-work'], // 10 points
        industry: 'other', // 10 points (changed from 'saas' to get secondary tier)
      }

      const qualification = qualifyICP(input)

      expect(qualification.tier).toBe('secondary')
      expect(qualification.score).toBe(65) // 25 + 20 + 10 + 10 = 65
      expect(qualification.recommendations.cta).toBe('See Demo →')
      expect(qualification.recommendations.followUpTiming).toBe(
        'Within 48 hours, standard outreach'
      )
    })

    it('should return complete qualification for nurture tier', () => {
      const input: UserInput = {
        teamSize: '1-5',
        channels: '1-2',
        painPoints: [],
        industry: 'other',
      }

      const qualification = qualifyICP(input)

      expect(qualification.tier).toBe('nurture')
      expect(qualification.score).toBe(35)
      expect(qualification.recommendations.cta).toBe('Learn More →')
      expect(qualification.recommendations.followUpTiming).toBe('Email drip campaign')
    })
  })

  describe('getPersonalizationConfig', () => {
    it('should return primary ICP personalization config', () => {
      const qualification = qualifyICP({
        teamSize: '15-50',
        channels: '6-10',
        painPoints: ['agency-cost'],
        industry: 'ecommerce',
      })

      const config = getPersonalizationConfig(qualification)

      expect(config.tier).toBe('primary')
      expect(config.showPremiumFeatures).toBe(true)
      expect(config.showTechnicalDetails).toBe(true)
      expect(config.ctaText).toBe('Book Founder Call')
      expect(config.ctaVariant).toBe('primary')
      expect(config.followUpStrategy).toBe('immediate')
      expect(config.priorityLevel).toBe('high')
    })

    it('should return secondary ICP personalization config', () => {
      const qualification = qualifyICP({
        teamSize: '5-15', // 25 points
        channels: '3-5', // 20 points
        painPoints: ['manual-work'], // 10 points
        industry: 'other', // 10 points (changed to get secondary tier)
      })

      const config = getPersonalizationConfig(qualification)

      expect(config.tier).toBe('secondary')
      expect(config.showPremiumFeatures).toBe(false)
      expect(config.showTechnicalDetails).toBe(false)
      expect(config.ctaText).toBe('See Demo')
      expect(config.ctaVariant).toBe('secondary')
      expect(config.followUpStrategy).toBe('standard')
      expect(config.priorityLevel).toBe('medium')
    })

    it('should return nurture personalization config', () => {
      const qualification = qualifyICP({
        teamSize: '1-5',
        channels: '1-2',
        painPoints: [],
        industry: 'other',
      })

      const config = getPersonalizationConfig(qualification)

      expect(config.tier).toBe('nurture')
      expect(config.showPremiumFeatures).toBe(false)
      expect(config.showTechnicalDetails).toBe(false)
      expect(config.ctaText).toBe('Learn More')
      expect(config.ctaVariant).toBe('default')
      expect(config.followUpStrategy).toBe('nurture')
      expect(config.priorityLevel).toBe('low')
    })
  })

  describe('Helper Functions', () => {
    describe('isPrimaryICP', () => {
      it('should return true for primary ICP', () => {
        const input: UserInput = {
          teamSize: '15-50',
          channels: '6-10',
          painPoints: ['agency-cost'],
          industry: 'ecommerce',
        }

        expect(isPrimaryICP(input)).toBe(true)
      })

      it('should return false for secondary ICP', () => {
        const input: UserInput = {
          teamSize: '5-15',
          channels: '3-5',
          painPoints: [],
          industry: 'other',
        }

        expect(isPrimaryICP(input)).toBe(false)
      })

      it('should return false for nurture tier', () => {
        const input: UserInput = {
          teamSize: '1-5',
          channels: '1-2',
          painPoints: [],
          industry: 'other',
        }

        expect(isPrimaryICP(input)).toBe(false)
      })
    })

    describe('isQualified', () => {
      it('should return true for primary ICP', () => {
        const input: UserInput = {
          teamSize: '15-50',
          channels: '6-10',
          painPoints: ['agency-cost'],
          industry: 'ecommerce',
        }

        expect(isQualified(input)).toBe(true)
      })

      it('should return true for secondary ICP', () => {
        const input: UserInput = {
          teamSize: '5-15',
          channels: '3-5',
          painPoints: ['manual-work'],
          industry: 'saas',
        }

        expect(isQualified(input)).toBe(true)
      })

      it('should return false for nurture tier', () => {
        const input: UserInput = {
          teamSize: '1-5',
          channels: '1-2',
          painPoints: [],
          industry: 'other',
        }

        expect(isQualified(input)).toBe(false)
      })
    })

    describe('getScorePercentage', () => {
      it('should calculate correct percentages', () => {
        expect(getScorePercentage(100)).toBe(100)
        expect(getScorePercentage(75)).toBe(75)
        expect(getScorePercentage(50)).toBe(50)
        expect(getScorePercentage(0)).toBe(0)
      })

      it('should round to nearest integer', () => {
        expect(getScorePercentage(67)).toBe(67)
        expect(getScorePercentage(33)).toBe(33)
      })
    })

    describe('interpretScore', () => {
      it('should generate human-readable interpretation', () => {
        const input: UserInput = {
          teamSize: '15-50',
          channels: '6-10',
          painPoints: ['agency-cost'],
          industry: 'ecommerce',
        }

        const qualification = qualifyICP(input)
        const interpretation = interpretScore(qualification)

        expect(interpretation).toContain('Score: 90/100')
        expect(interpretation).toContain('Tier: PRIMARY')
        expect(interpretation).toContain('Team Size: 30/30')
        expect(interpretation).toContain('Channels: 25/25')
        expect(interpretation).toContain('Pain Points: 15/25')
        expect(interpretation).toContain('Industry: 20/20')
      })
    })
  })

  describe('Industry Scoring', () => {
    it('should give 20 points for top 3 industries', () => {
      const industries = ['ecommerce', 'saas', 'agency'] as const

      industries.forEach((industry) => {
        const input: UserInput = {
          teamSize: '15-50',
          channels: '6-10',
          painPoints: [],
          industry,
        }

        const breakdown = calculateICPScore(input)
        expect(breakdown.industryScore).toBe(20)
      })
    })

    it('should give 10 points for other industries', () => {
      const input: UserInput = {
        teamSize: '15-50',
        channels: '6-10',
        painPoints: [],
        industry: 'other',
      }

      const breakdown = calculateICPScore(input)
      expect(breakdown.industryScore).toBe(10)
    })
  })

  describe('Team Size Scoring', () => {
    it('should score team sizes correctly', () => {
      const teamSizes: Array<[UserInput['teamSize'], number]> = [
        ['15-50', 30], // Primary ICP
        ['5-15', 25], // Secondary ICP
        ['1-5', 15], // Edge case
        ['50+', 10], // Too large
      ]

      teamSizes.forEach(([size, expectedScore]) => {
        const input: UserInput = {
          teamSize: size,
          channels: '3-5',
          painPoints: [],
          industry: 'ecommerce',
        }

        const breakdown = calculateICPScore(input)
        expect(breakdown.teamSizeScore).toBe(expectedScore)
      })
    })
  })

  describe('Channels Scoring', () => {
    it('should score channel counts correctly', () => {
      const channels: Array<[UserInput['channels'], number]> = [
        ['6-10', 25], // Sweet spot
        ['3-5', 20], // Good fit
        ['10+', 15], // Possibly enterprise
        ['1-2', 10], // Too simple
      ]

      channels.forEach(([count, expectedScore]) => {
        const input: UserInput = {
          teamSize: '15-50',
          channels: count,
          painPoints: [],
          industry: 'ecommerce',
        }

        const breakdown = calculateICPScore(input)
        expect(breakdown.channelsScore).toBe(expectedScore)
      })
    })
  })

  describe('Pain Points Scoring', () => {
    it('should score individual pain points correctly', () => {
      const painPoints = [
        { point: 'agency-cost' as const, score: 15 },
        { point: 'scaling-problem' as const, score: 10 },
        { point: 'manual-work' as const, score: 10 },
        { point: 'channel-overload' as const, score: 10 },
        { point: 'content-bottleneck' as const, score: 10 },
        { point: 'hiring-limitation' as const, score: 10 },
      ]

      painPoints.forEach(({ point, score }) => {
        const input: UserInput = {
          teamSize: '15-50',
          channels: '6-10',
          painPoints: [point],
          industry: 'ecommerce',
        }

        const breakdown = calculateICPScore(input)
        expect(breakdown.painPointsScore).toBe(score)
      })
    })

    it('should combine multiple pain points correctly', () => {
      const input: UserInput = {
        teamSize: '15-50',
        channels: '6-10',
        painPoints: ['agency-cost', 'manual-work'], // 15 + 10 = 25
        industry: 'ecommerce',
      }

      const breakdown = calculateICPScore(input)
      expect(breakdown.painPointsScore).toBe(25)
    })
  })

  describe('Edge Cases', () => {
    it('should handle maximum score correctly', () => {
      const input: UserInput = {
        teamSize: '15-50',
        channels: '6-10',
        painPoints: ['agency-cost', 'scaling-problem'],
        industry: 'ecommerce',
      }

      const breakdown = calculateICPScore(input)
      expect(breakdown.totalScore).toBe(100)
      expect(breakdown.totalScore).toBeLessThanOrEqual(MAX_SCORES.TOTAL)
    })

    it('should handle minimum score correctly', () => {
      const input: UserInput = {
        teamSize: '1-5',
        channels: '1-2',
        painPoints: [],
        industry: 'other',
      }

      const breakdown = calculateICPScore(input)
      expect(breakdown.totalScore).toBeGreaterThanOrEqual(0)
    })

    it('should handle optional currentSpend field', () => {
      const input: UserInput = {
        teamSize: '15-50',
        channels: '6-10',
        painPoints: ['agency-cost'],
        industry: 'ecommerce',
        currentSpend: 10000, // Optional field
      }

      const qualification = qualifyICP(input)
      expect(qualification).toBeDefined()
      expect(qualification.score).toBeGreaterThan(0)
    })
  })

  describe('Real-World Scenarios', () => {
    it('Scenario: Perfect fit e-commerce store', () => {
      const input: UserInput = {
        teamSize: '15-50',
        channels: '6-10',
        painPoints: ['agency-cost', 'scaling-problem', 'channel-overload'],
        industry: 'ecommerce',
      }

      const qualification = qualifyICP(input)
      const config = getPersonalizationConfig(qualification)

      expect(qualification.tier).toBe('primary')
      expect(qualification.score).toBe(100)
      expect(config.ctaText).toBe('Book Founder Call')
      expect(config.showPremiumFeatures).toBe(true)
    })

    it('Scenario: Growing SaaS company', () => {
      const input: UserInput = {
        teamSize: '5-15', // 25 points
        channels: '3-5', // 20 points
        painPoints: ['content-bottleneck', 'hiring-limitation'], // 10 + 10 = 20 points
        industry: 'saas', // 20 points
      }
      // Total: 25 + 20 + 20 + 20 = 85 points (PRIMARY ICP!)

      const qualification = qualifyICP(input)
      const config = getPersonalizationConfig(qualification)

      expect(qualification.tier).toBe('primary') // Changed from secondary
      expect(qualification.score).toBe(85) // Corrected score
      expect(config.ctaText).toBe('Book Founder Call') // Primary CTA
      expect(config.followUpStrategy).toBe('immediate') // Primary follow-up
    })

    it('Scenario: Small marketing agency', () => {
      const input: UserInput = {
        teamSize: '5-15', // 25 points
        channels: '6-10', // 25 points
        painPoints: ['manual-work', 'scaling-problem'], // 10 + 10 = 20 points
        industry: 'agency', // 20 points
      }
      // Total: 25 + 25 + 20 + 20 = 90 points

      const qualification = qualifyICP(input)
      const config = getPersonalizationConfig(qualification)

      expect(qualification.tier).toBe('primary')
      expect(qualification.score).toBe(90) // Corrected score
      expect(config.showTechnicalDetails).toBe(true)
    })

    it('Scenario: Lean startup (nurture)', () => {
      const input: UserInput = {
        teamSize: '1-5', // 15 points
        channels: '1-2', // 10 points
        painPoints: ['manual-work'], // 10 points
        industry: 'other', // 10 points
      }
      // Total: 15 + 10 + 10 + 10 = 45 points

      const qualification = qualifyICP(input)
      const config = getPersonalizationConfig(qualification)

      expect(qualification.tier).toBe('nurture')
      expect(qualification.score).toBe(45) // Corrected score
      expect(config.ctaText).toBe('Learn More')
      expect(config.priorityLevel).toBe('low')
    })

    it('Scenario: Enterprise (too large)', () => {
      const input: UserInput = {
        teamSize: '50+',
        channels: '10+',
        painPoints: ['scaling-problem'],
        industry: 'ecommerce',
      }

      const qualification = qualifyICP(input)

      expect(qualification.tier).toBe('secondary') // Score: 10 + 15 + 10 + 20 = 55
      expect(qualification.score).toBe(55)
    })
  })
})
