// Mock Strategy Data for Performance Matrix

export interface Strategy {
  id: string
  name: string
  description: string
  color: string
  accountCount: number
  avgReach: number
  avgImpressions: number
  avgEngagement: number
  avgEngagementRate: number
  avgROI: number
  avgCTR: number
  avgConversionRate: number
  totalConversions: number
  avgCPL: number
  topPerformer: string
  trend: {
    reach: number
    engagement: number
    conversions: number
    roi: number
  }
  bestPractices: Array<{
    id: string
    title: string
    impact: 'high' | 'medium' | 'low'
    description: string
  }>
  recommendations: Array<{
    id: string
    title: string
    confidence: number
    impact: 'high' | 'medium' | 'low'
    reasoning: string
  }>
}

export const mockStrategies: Strategy[] = [
  {
    id: 'premium-ads',
    name: 'Premium Content & Paid Ads',
    description:
      'High-quality content combined with strategic paid advertising for maximum reach and conversions',
    color: '#6366f1', // Indigo
    accountCount: 5, // 1 per platform
    avgReach: 850000,
    avgImpressions: 1250000,
    avgEngagement: 125000,
    avgEngagementRate: 8.6,
    avgROI: 285,
    avgCTR: 2.3,
    avgConversionRate: 11.2,
    totalConversions: 16000,
    avgCPL: 7.5,
    topPerformer: '@futuremarketingai',
    trend: {
      reach: 15,
      engagement: 8,
      conversions: 18,
      roi: 22,
    },
    bestPractices: [
      {
        id: 'bp1',
        title: 'Invest in High-Production Content',
        impact: 'high',
        description:
          'Premium visual content with professional editing generates 3x higher engagement and establishes brand authority',
      },
      {
        id: 'bp2',
        title: 'Strategic Ad Spend Allocation',
        impact: 'high',
        description: 'Focus 70% of ad budget on proven winning content for consistent ROI',
      },
      {
        id: 'bp3',
        title: 'Audience Segmentation',
        impact: 'medium',
        description:
          'Target high-value segments with tailored messaging for better conversion rates',
      },
    ],
    recommendations: [
      {
        id: 'rec1',
        title: 'Increase TikTok Ad Budget',
        confidence: 92,
        impact: 'high',
        reasoning:
          'TikTok shows 2.5x higher engagement rate than other platforms with similar CPM. Recommend increasing budget by 40%.',
      },
      {
        id: 'rec2',
        title: 'Test Carousel Ads on Instagram',
        confidence: 85,
        impact: 'medium',
        reasoning: 'Single-image ads showing fatigue. Carousel format tests show 23% higher CTR.',
      },
    ],
  },
  {
    id: 'educational-viral',
    name: 'Educational & Viral Content',
    description:
      'Mix of valuable educational content with viral potential to maximize organic reach and authority',
    color: '#8b5cf6', // Purple
    accountCount: 5, // 1 sub per platform
    avgReach: 180000,
    avgImpressions: 245000,
    avgEngagement: 19500,
    avgEngagementRate: 6.8,
    avgROI: 168,
    avgCTR: 4.6,
    avgConversionRate: 10.8,
    totalConversions: 4450,
    avgCPL: 5.8,
    topPerformer: '@fma_growth',
    trend: {
      reach: 22,
      engagement: 12,
      conversions: 15,
      roi: 18,
    },
    bestPractices: [
      {
        id: 'bp4',
        title: 'Hook Within 3 Seconds',
        impact: 'high',
        description:
          'Educational content with strong opening hooks retains 85% more viewers through completion',
      },
      {
        id: 'bp5',
        title: 'Balance Value and Entertainment',
        impact: 'high',
        description: 'Mix actionable tips with engaging storytelling for higher shares and saves',
      },
      {
        id: 'bp6',
        title: 'Consistent Posting Schedule',
        impact: 'medium',
        description: '4-5 posts per day maintains algorithm favorability and audience engagement',
      },
    ],
    recommendations: [
      {
        id: 'rec3',
        title: 'Create Tutorial Series',
        confidence: 88,
        impact: 'high',
        reasoning:
          'Series-based content shows 45% higher retention. Recommend launching 3-part marketing strategy series.',
      },
      {
        id: 'rec4',
        title: 'Leverage User-Generated Content',
        confidence: 76,
        impact: 'medium',
        reasoning:
          'UGC testimonials in educational content increase trust signals and conversion rates by 28%.',
      },
    ],
  },
  {
    id: 'viral-trends',
    name: 'Trending Hooks & Viral Formats',
    description:
      'Rapid testing of trending formats, memes, and viral hooks for maximum discoverability',
    color: '#ec4899', // Pink
    accountCount: 5, // 1 test per platform
    avgReach: 42000,
    avgImpressions: 58000,
    avgEngagement: 4500,
    avgEngagementRate: 10.8,
    avgROI: 124,
    avgCTR: 4.4,
    avgConversionRate: 4.4,
    totalConversions: 925,
    avgCPL: 4.5,
    topPerformer: '@fma_viral_lab',
    trend: {
      reach: 28,
      engagement: 22,
      conversions: 12,
      roi: 8,
    },
    bestPractices: [
      {
        id: 'bp7',
        title: 'Jump on Trends Early',
        impact: 'high',
        description: 'Being within first 48 hours of trending audio/format increases reach by 400%',
      },
      {
        id: 'bp8',
        title: 'Test Multiple Variations',
        impact: 'high',
        description: '8-10 posts per day allows rapid A/B testing to identify winning formats',
      },
      {
        id: 'bp9',
        title: 'Add Brand Context',
        impact: 'medium',
        description:
          'Adapt trends to your niche rather than copying directly for better conversion',
      },
    ],
    recommendations: [
      {
        id: 'rec5',
        title: 'Implement Trend Monitoring System',
        confidence: 94,
        impact: 'high',
        reasoning:
          'Automated trend detection would reduce response time from 24h to 2h, capturing peak viral windows.',
      },
      {
        id: 'rec6',
        title: 'Create Trend Adaptation Playbook',
        confidence: 81,
        impact: 'medium',
        reasoning:
          'Standardized process for adapting trends to brand voice would increase success rate by 35%.',
      },
    ],
  },
  {
    id: 'in-depth-tutorials',
    name: 'In-depth Tutorials & Guides',
    description:
      'Comprehensive educational content that builds authority and generates high-quality leads',
    color: '#10b981', // Emerald
    accountCount: 5, // 1 test per platform
    avgReach: 28000,
    avgImpressions: 38000,
    avgEngagement: 2850,
    avgEngagementRate: 7.5,
    avgROI: 156,
    avgCTR: 5.1,
    avgConversionRate: 15.1,
    totalConversions: 1075,
    avgCPL: 4.8,
    topPerformer: '@fma_edu_lab',
    trend: {
      reach: 18,
      engagement: 15,
      conversions: 20,
      roi: 16,
    },
    bestPractices: [
      {
        id: 'bp10',
        title: 'Multi-Slide Deep Dives',
        impact: 'high',
        description:
          'Carousels with 8-12 slides perform best for tutorial content, maximizing time spent and saves',
      },
      {
        id: 'bp11',
        title: 'Include Downloadable Resources',
        impact: 'high',
        description: 'Lead magnets in tutorials increase email capture rate by 45%',
      },
      {
        id: 'bp12',
        title: 'Expert Interviews & Case Studies',
        impact: 'medium',
        description:
          'Authority-building content through expert features increases trust and conversion',
      },
    ],
    recommendations: [
      {
        id: 'rec7',
        title: 'Launch Video Tutorial Series',
        confidence: 89,
        impact: 'high',
        reasoning:
          'Video tutorials show 3x higher completion rate than carousel posts. Recommend weekly video series.',
      },
      {
        id: 'rec8',
        title: 'Create Resource Library',
        confidence: 84,
        impact: 'high',
        reasoning:
          'Centralized resource hub would increase returning visitors by 60% and position as authority.',
      },
    ],
  },
]

// Helper functions to aggregate strategy data from accounts
export const getStrategyMetrics = (strategyId: string) => {
  return mockStrategies.find((s) => s.id === strategyId)
}

export const getAllStrategies = () => mockStrategies

export const getStrategyComparison = (strategyIds: string[]) => {
  return mockStrategies.filter((s) => strategyIds.includes(s.id))
}
