/**
 * Campaign Orchestra Data Generator
 *
 * Converts existing campaign data to the Campaign Orchestra format.
 */

import type { Campaign } from '../../types/dashboard'
import type { CampaignData } from '../../components/command-center/campaign-orchestra'

const platformNameMap: Record<string, string> = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  tiktok: 'TikTok',
  linkedin: 'LinkedIn',
  twitter: 'Twitter',
}

/**
 * Convert dashboard Campaign to CampaignOrchestra CampaignData
 */
export function convertToCampaignData(campaign: Campaign): CampaignData {
  return {
    id: campaign.id,
    name: campaign.name,
    status: campaign.status,
    progress: campaign.progress,
    metrics: {
      roi: campaign.metrics.roi,
      reach: campaign.metrics.reach,
      engagement: campaign.metrics.engagementRate,
      conversions: campaign.metrics.conversions,
      budget: campaign.budget,
      spent: campaign.spend,
    },
    platforms: campaign.platforms.map((p) => platformNameMap[p] || p),
    schedule: {
      start: campaign.schedule.start,
      end: campaign.schedule.end,
    },
    aiOptimizations: {
      enabled: campaign.aiOptimizations.length > 0,
      improvements: campaign.aiOptimizations.map((opt) => opt.improvement),
    },
  }
}

/**
 * Convert multiple campaigns
 */
export function convertCampaignsForOrchestra(campaigns: Campaign[]): CampaignData[] {
  return campaigns.map(convertToCampaignData)
}
