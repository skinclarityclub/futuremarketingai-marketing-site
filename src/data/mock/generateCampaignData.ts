/**
 * Campaign Mock Data Generator
 *
 * Generates realistic campaign data for the demo dashboard.
 */

import type { Campaign, CampaignMetrics, AIOptimization } from '../../types/dashboard'

const campaignNames = [
  'Spring Product Launch',
  'Summer Brand Awareness',
  'Q2 Lead Generation',
  'Holiday Sales Campaign',
  'Back to School Promo',
  'Product Line A Launch',
  'Retargeting Campaign',
  'Influencer Collaboration',
  'Community Engagement Drive',
  'Educational Content Series',
]

const platformCombinations = [
  ['instagram', 'facebook'],
  ['instagram', 'tiktok'],
  ['linkedin', 'twitter'],
  ['facebook', 'instagram', 'tiktok'],
  ['instagram'],
  ['linkedin'],
]

function generateCampaignMetrics(budget: number): CampaignMetrics {
  const reach = Math.floor(Math.random() * 300000) + 50000
  const engagement = Math.floor(reach * (Math.random() * 0.08 + 0.02))
  const engagementRate = parseFloat(((engagement / reach) * 100).toFixed(2))
  const conversions = Math.floor(engagement * (Math.random() * 0.05 + 0.01))
  const revenue = conversions * (Math.random() * 100 + 50)
  const roi = Math.floor((revenue / budget - 1) * 100)
  const cpl = parseFloat((budget / conversions).toFixed(2))

  return {
    reach,
    engagement,
    engagementRate,
    roi,
    conversions,
    cpl,
  }
}

function generateAIOptimizations(): AIOptimization[] {
  const optimizations = [
    { type: 'timing' as const, improvement: '+23% engagement', confidence: 87 },
    { type: 'targeting' as const, improvement: '+15% reach', confidence: 92 },
    { type: 'content' as const, improvement: '+18% CTR', confidence: 85 },
    { type: 'budget' as const, improvement: '-12% CPL', confidence: 90 },
  ]

  // Return 1-3 random optimizations
  const count = Math.floor(Math.random() * 3) + 1
  return optimizations.sort(() => Math.random() - 0.5).slice(0, count)
}

function generateSchedule() {
  const start = new Date()
  start.setDate(start.getDate() - Math.floor(Math.random() * 30))

  const end = new Date(start)
  end.setDate(end.getDate() + Math.floor(Math.random() * 60) + 30)

  const postsRemaining = Math.floor(Math.random() * 50) + 10

  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
    postsRemaining,
  }
}

export function generateMockCampaignData(count: number = 8): Campaign[] {
  return Array.from({ length: count }, (_, i) => {
    const budget = Math.floor(Math.random() * 8000) + 2000 // €2000-€10000
    const spend = Math.floor(budget * (Math.random() * 0.5 + 0.3)) // 30-80% spent
    const progress = Math.floor((spend / budget) * 100)

    // More active campaigns, fewer paused/completed
    const statuses: Campaign['status'][] = [
      'active',
      'active',
      'active',
      'active',
      'active',
      'paused',
      'completed',
      'draft',
    ]
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    return {
      id: `campaign-${i + 1}`,
      name: campaignNames[i % campaignNames.length],
      status,
      progress,
      platforms: platformCombinations[i % platformCombinations.length],
      budget,
      spend,
      metrics: generateCampaignMetrics(budget),
      schedule: generateSchedule(),
      aiOptimizations: generateAIOptimizations(),
    }
  })
}

/**
 * Get active campaigns only
 */
export function getActiveCampaigns(campaigns: Campaign[]): Campaign[] {
  return campaigns.filter((c) => c.status === 'active')
}

/**
 * Get campaigns by platform
 */
export function getCampaignsByPlatform(campaigns: Campaign[], platform: string): Campaign[] {
  return campaigns.filter((c) => c.platforms.includes(platform))
}

/**
 * Sort campaigns by ROI (descending)
 */
export function sortCampaignsByROI(campaigns: Campaign[]): Campaign[] {
  return [...campaigns].sort((a, b) => b.metrics.roi - a.metrics.roi)
}

/**
 * Get campaign summary stats
 */
export function getCampaignSummary(campaigns: Campaign[]) {
  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0)
  const totalSpend = campaigns.reduce((sum, c) => sum + c.spend, 0)
  const totalRevenue = campaigns.reduce(
    (sum, c) => sum + c.metrics.conversions * 100, // Assume €100 per conversion
    0
  )
  const avgROI = Math.floor(campaigns.reduce((sum, c) => sum + c.metrics.roi, 0) / campaigns.length)

  return {
    totalCampaigns: campaigns.length,
    activeCampaigns: getActiveCampaigns(campaigns).length,
    totalBudget,
    totalSpend,
    totalRevenue,
    avgROI,
    budgetUtilization: Math.floor((totalSpend / totalBudget) * 100),
  }
}
