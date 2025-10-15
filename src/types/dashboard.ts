/**
 * Command Center Dashboard Types
 *
 * TypeScript interfaces for all mock data models used in the demo.
 * These define the structure without requiring actual backend integration.
 */

import React from 'react'

// ============================================================================
// CORE MODELS
// ============================================================================

export interface Platform {
  id: string
  name: string
  icon: React.ReactNode
  color: string // Brand color hex
  accountCount: number
  totalReach: number
  totalEngagement: number
  roi: number // Percentage
  status: 'connected' | 'syncing' | 'warning' | 'error'
  lastSync: string // Human-readable time
  accounts: Account[]
}

export interface Account {
  id: string
  platform: string
  handle: string
  name: string
  avatar: string
  followers: number
  strategy: StrategyType
  performanceLevel: 'excellent' | 'good' | 'average' | 'needs-attention'
  metrics: AccountMetrics
}

export type StrategyType =
  | 'Brand Awareness'
  | 'Direct Sales'
  | 'Lead Generation'
  | 'Community Building'
  | 'Education'
  | 'Experimental'

export interface AccountMetrics {
  reach: number
  impressions: number
  engagement: number
  engagementRate: number
  clicks: number
  conversions: number
  revenue: number
  roi: number
  cpl: number // Cost per lead
  followerGrowth: number
}

export interface Campaign {
  id: string
  name: string
  status: 'active' | 'paused' | 'completed' | 'draft'
  progress: number // 0-100
  platforms: string[]
  budget: number
  spend: number
  metrics: CampaignMetrics
  schedule: {
    start: string
    end: string
    postsRemaining: number
  }
  aiOptimizations: AIOptimization[]
}

export interface CampaignMetrics {
  reach: number
  engagement: number
  engagementRate: number
  roi: number
  conversions: number
  cpl: number
}

export interface AIOptimization {
  type: 'timing' | 'targeting' | 'content' | 'budget'
  improvement: string // e.g., "+23% engagement"
  confidence: number // 0-100
}

// ============================================================================
// METRICS & ANALYTICS
// ============================================================================

export interface HeroMetric {
  value: number
  label: string
  trend: {
    value: number
    direction: 'up' | 'down'
    period: string
  }
  sparklineData?: TimeSeriesDataPoint[]
  prefix?: string
  suffix?: string
  color: 'primary' | 'success' | 'secondary' | 'gradient'
  icon: string
}

export interface TimeSeriesDataPoint {
  timestamp: string
  value: number
  label?: string
}

export interface ChartDataset {
  label: string
  data: number[]
  color: string
  borderColor?: string
  backgroundColor?: string
}

export interface ChartData {
  labels: string[]
  datasets: ChartDataset[]
}

// ============================================================================
// SYSTEM HEALTH
// ============================================================================

export interface SystemHealth {
  api: {
    status: 'operational' | 'degraded' | 'down'
    lastCheck: Date
    responseTime: number // ms
  }
  aiModels: {
    active: number
    total: number
    models: AIModel[]
  }
  publishingQueue: {
    pending: number
    scheduled: number
    completed: number
  }
  processing: {
    activeJobs: number
    queuedJobs: number
  }
}

export interface AIModel {
  name: string
  status: 'active' | 'idle' | 'error'
  purpose: 'research' | 'content-generation' | 'optimization' | 'analysis'
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

export interface Notification {
  id: string
  type: 'success' | 'warning' | 'error' | 'info'
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionable: boolean
  actions?: NotificationAction[]
}

export interface NotificationAction {
  label: string
  action: () => void
  variant: 'primary' | 'secondary' | 'ghost'
}

// ============================================================================
// CONTENT PIPELINE
// ============================================================================

export interface PipelineStage {
  id: string
  title: string
  icon: string
  metrics: {
    active: number
    completed: number
  }
  status: 'processing' | 'active' | 'pending-action' | 'complete'
  aiActivity: boolean
}

// ============================================================================
// EXPORT
// ============================================================================

export type DashboardData = {
  heroMetrics: HeroMetric[]
  systemHealth: SystemHealth
  platforms: Platform[]
  campaigns: Campaign[]
  weeklyPerformance: ChartData
  notifications: Notification[]
  pipelineStages: PipelineStage[]
}
