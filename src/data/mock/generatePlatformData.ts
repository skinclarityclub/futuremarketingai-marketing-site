/**
 * Platform Mock Data Generator
 *
 * Generates realistic platform and account data for the demo.
 */

import React from 'react'
import { FaInstagram, FaFacebook, FaTiktok, FaLinkedin, FaXTwitter } from 'react-icons/fa6'
import type { Platform, Account, AccountMetrics } from '../../types/dashboard'

const platformConfig = [
  {
    id: 'instagram',
    name: 'Instagram',
    icon: React.createElement(FaInstagram, { size: 24 }),
    color: '#E1306C',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: React.createElement(FaFacebook, { size: 24 }),
    color: '#1877F2',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    icon: React.createElement(FaTiktok, { size: 24 }),
    color: '#000000',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: React.createElement(FaLinkedin, { size: 24 }),
    color: '#0A66C2',
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: React.createElement(FaXTwitter, { size: 24 }),
    color: '#1DA1F2',
  },
]

function generateAccountMetrics(): AccountMetrics {
  const reach = Math.floor(Math.random() * 500000) + 100000
  const impressions = reach * (Math.random() * 1.5 + 1.2)
  const engagement = Math.floor(impressions * (Math.random() * 0.08 + 0.02))
  const clicks = Math.floor(engagement * (Math.random() * 0.3 + 0.1))
  const conversions = Math.floor(clicks * (Math.random() * 0.05 + 0.01))
  const revenue = conversions * (Math.random() * 100 + 50)
  const spend = revenue / (Math.random() * 4 + 2) // ROI between 200-600%

  return {
    reach,
    impressions: Math.floor(impressions),
    engagement,
    engagementRate: parseFloat(((engagement / impressions) * 100).toFixed(2)),
    clicks,
    conversions,
    revenue: Math.floor(revenue),
    roi: Math.floor((revenue / spend - 1) * 100),
    cpl: parseFloat((spend / conversions).toFixed(2)),
    followerGrowth: parseFloat((Math.random() * 15 + 5).toFixed(1)),
  }
}

function generateAccounts(platform: string, count: number): Account[] {
  const strategies = [
    'Brand Awareness',
    'Direct Sales',
    'Lead Generation',
    'Community Building',
    'Education',
  ] as const

  const handles = [
    { handle: '@lifestylebrand', name: 'Lifestyle Brand Main' },
    { handle: '@lifestylebrand_shop', name: 'Lifestyle Brand Shop' },
    { handle: '@lifestylebrand_community', name: 'Lifestyle Brand Community' },
    { handle: '@lifestylebrand_test_a', name: 'Test Account A' },
    { handle: '@lifestylebrand_test_b', name: 'Test Account B' },
  ]

  return Array.from({ length: count }, (_, i) => {
    const metrics = generateAccountMetrics()
    const followers = Math.floor(Math.random() * 100000) + 20000

    // Determine performance level based on ROI
    let performanceLevel: Account['performanceLevel'] = 'average'
    if (metrics.roi > 400) {
      performanceLevel = 'excellent'
    } else if (metrics.roi > 250) {
      performanceLevel = 'good'
    } else if (metrics.roi < 150) {
      performanceLevel = 'needs-attention'
    }

    return {
      id: `${platform}-${i + 1}`,
      platform,
      handle: handles[i % handles.length].handle,
      name: handles[i % handles.length].name,
      avatar: `https://i.pravatar.cc/150?u=${platform}-${i}`,
      followers,
      strategy: strategies[i % strategies.length],
      performanceLevel,
      metrics,
    }
  })
}

export function generateMockPlatformData(): Platform[] {
  return platformConfig.map((config) => {
    const accountCount = Math.floor(Math.random() * 3) + 2 // 2-4 accounts per platform
    const accounts = generateAccounts(config.id, accountCount)

    // Aggregate metrics from all accounts
    const totalReach = accounts.reduce((sum, acc) => sum + acc.metrics.reach, 0)
    const totalEngagement = accounts.reduce((sum, acc) => sum + acc.metrics.engagement, 0)
    const avgROI = Math.floor(
      accounts.reduce((sum, acc) => sum + acc.metrics.roi, 0) / accounts.length
    )

    // Randomize status (mostly connected for demo)
    const statuses: Platform['status'][] = ['connected', 'connected', 'connected', 'syncing']
    const status = statuses[Math.floor(Math.random() * statuses.length)]

    // Random last sync time
    const syncMinutes = Math.floor(Math.random() * 10) + 1
    const lastSync = `${syncMinutes} minute${syncMinutes > 1 ? 's' : ''} ago`

    return {
      id: config.id,
      name: config.name,
      icon: config.icon,
      color: config.color,
      accountCount,
      totalReach,
      totalEngagement,
      roi: avgROI,
      status,
      lastSync,
      accounts,
    }
  })
}

/**
 * Get a specific platform by ID
 */
export function getPlatformById(platforms: Platform[], id: string): Platform | undefined {
  return platforms.find((p) => p.id === id)
}

/**
 * Get all accounts across all platforms
 */
export function getAllAccounts(platforms: Platform[]): Account[] {
  return platforms.flatMap((p) => p.accounts)
}

/**
 * Filter accounts by strategy
 */
export function getAccountsByStrategy(platforms: Platform[], strategy: string): Account[] {
  return getAllAccounts(platforms).filter((acc) => acc.strategy === strategy)
}
