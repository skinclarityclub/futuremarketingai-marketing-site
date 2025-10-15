/**
 * Mock Data Generators
 *
 * This module exports all mock data generators for the Command Center Dashboard demo.
 * All data is generated client-side without any backend dependencies.
 *
 * Usage:
 * ```ts
 * import { generateAllMockData } from '@/data/mock'
 *
 * const mockData = generateAllMockData()
 * ```
 */

export * from './generatePlatformData'
export * from './generateCampaignData'
export * from './generateMetricsData'
export * from './generateCampaignOrchestra'
export * from './generateScheduledContent'

import { generateMockPlatformData } from './generatePlatformData'
import { generateMockCampaignData } from './generateCampaignData'
import {
  generateHeroMetrics,
  generateWeeklyPerformanceData,
  generateSystemHealth,
} from './generateMetricsData'
import type { DashboardData } from '../../types/dashboard'

/**
 * Generate all mock data for the dashboard in one call
 */
export function generateAllMockData(): DashboardData {
  return {
    heroMetrics: generateHeroMetrics(),
    systemHealth: generateSystemHealth(),
    platforms: generateMockPlatformData(),
    campaigns: generateMockCampaignData(8),
    weeklyPerformance: generateWeeklyPerformanceData(),
    notifications: [], // Will be populated dynamically
    pipelineStages: [], // Will be added later
  }
}
