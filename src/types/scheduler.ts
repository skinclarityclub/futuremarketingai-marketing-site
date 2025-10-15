export type ContentType = 'post' | 'reel' | 'story' | 'video' | 'carousel' | 'article'
export type PlatformType = 'instagram' | 'facebook' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube'
export type ScheduleStatus = 'scheduled' | 'published' | 'failed' | 'draft' | 'pending_approval'

export interface ScheduledContent {
  id: string
  title: string
  contentType: ContentType
  platform: PlatformType
  scheduledTime: Date
  status: ScheduleStatus
  caption?: string
  hashtags?: string[]
  mediaUrl?: string
  aiConfidence?: number
  estimatedReach?: number
  optimalScore?: number
  color?: string // For calendar visualization
}

export interface OptimalTimeSlot {
  platform: PlatformType
  dayOfWeek: string
  timeRange: string
  audienceActivity: number // 0-100
  historicalPerformance: number // 0-100
  recommendationScore: number // 0-100
}

export interface SchedulingConflict {
  time: Date
  posts: ScheduledContent[]
  severity: 'low' | 'medium' | 'high'
  reason: string
}

export interface BulkScheduleResult {
  totalUploaded: number
  scheduled: number
  failed: number
  conflicts: SchedulingConflict[]
}
