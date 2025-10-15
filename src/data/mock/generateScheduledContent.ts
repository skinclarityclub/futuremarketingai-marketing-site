import type {
  ScheduledContent,
  OptimalTimeSlot,
  PlatformType,
  ContentType,
} from '../../types/scheduler'

const PLATFORMS: PlatformType[] = [
  'instagram',
  'facebook',
  'linkedin',
  'twitter',
  'tiktok',
  'youtube',
]

const PLATFORM_COLORS: Record<PlatformType, string> = {
  instagram: '#E1306C',
  facebook: '#1877F2',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
  tiktok: '#000000',
  youtube: '#FF0000',
}

// Platform posting frequency: how many posts per day
const PLATFORM_FREQUENCY: Record<PlatformType, number> = {
  instagram: 3, // 3 posts per day (morning, afternoon, evening)
  twitter: 4, // 4 tweets per day (most frequent)
  facebook: 2, // 2 posts per day
  linkedin: 1, // 1 post per day (professional content)
  tiktok: 2, // 2 videos per day
  youtube: 1, // 1 video per day
}

// Platform-specific content types
const PLATFORM_CONTENT_TYPES: Record<PlatformType, ContentType[]> = {
  instagram: ['post', 'story', 'reel', 'carousel'],
  twitter: ['post'],
  facebook: ['post', 'video', 'carousel'],
  linkedin: ['article', 'post'],
  tiktok: ['video', 'reel'],
  youtube: ['video'],
}

const CONTENT_TITLES = [
  'Product Launch Announcement',
  'Behind the Scenes',
  'Customer Testimonial',
  'Industry Insights',
  'Tutorial: Getting Started',
  'Team Spotlight',
  'Weekly Tips & Tricks',
  'Event Highlights',
  'Case Study Results',
  'Q&A Session',
  'Feature Update',
  'Community Showcase',
  'Industry News Recap',
  'Success Story',
  'How-To Guide',
  'Expert Interview',
  'Product Demo',
  'User-Generated Content',
  'Seasonal Campaign',
  'Flash Sale Announcement',
]

export function generateScheduledContent(days: number = 14): ScheduledContent[] {
  const content: ScheduledContent[] = []
  const now = new Date()
  let idCounter = 1

  // For each day
  for (let day = 0; day < days; day++) {
    // For each platform
    for (const platform of PLATFORMS) {
      const postsPerDay = PLATFORM_FREQUENCY[platform]
      const allowedContentTypes = PLATFORM_CONTENT_TYPES[platform]

      // Create multiple posts per day based on platform frequency
      for (let postIndex = 0; postIndex < postsPerDay; postIndex++) {
        const scheduledTime = new Date(now)
        scheduledTime.setDate(scheduledTime.getDate() + day)

        // Distribute posts throughout the day based on optimal times
        let hour: number
        if (postIndex === 0) {
          hour = 9
        } // Morning post (9 AM)
        else if (postIndex === 1) {
          hour = 13
        } // Afternoon post (1 PM)
        else if (postIndex === 2) {
          hour = 18
        } // Evening post (6 PM)
        else {
          hour = 21
        } // Night post (9 PM)

        scheduledTime.setHours(hour, Math.floor(Math.random() * 60), 0, 0)

        // Mix of statuses: mostly scheduled for future, published for past
        let status: 'scheduled' | 'published' | 'draft' | 'failed'
        if (scheduledTime < now) {
          // Past posts: mostly published
          const rand = Math.random()
          if (rand < 0.92) {
            status = 'published'
          } else if (rand < 0.96) {
            status = 'scheduled'
          } else {
            status = 'failed'
          }
        } else {
          // Future posts: mostly scheduled, some drafts
          status = Math.random() > 0.15 ? 'scheduled' : 'draft'
        }

        const contentType =
          allowedContentTypes[Math.floor(Math.random() * allowedContentTypes.length)]

        content.push({
          id: `content-${idCounter++}`,
          title: CONTENT_TITLES[Math.floor(Math.random() * CONTENT_TITLES.length)],
          contentType,
          platform,
          scheduledTime,
          status,
          caption: `Engaging ${contentType} content for ${platform} audience #marketing #digital`,
          hashtags: ['#marketing', '#digitalmarketing', '#socialmedia', `#${platform}`],
          aiConfidence: Math.floor(Math.random() * 25) + 75, // 75-100
          estimatedReach: Math.floor(Math.random() * 80000) + 10000, // 10k-90k
          optimalScore: Math.floor(Math.random() * 35) + 65, // 65-100
          color: PLATFORM_COLORS[platform],
        })
      }
    }
  }

  // Sort by scheduled time
  return content.sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime())
}

export function generateOptimalTimeSlots(): OptimalTimeSlot[] {
  const slots: OptimalTimeSlot[] = []
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  PLATFORMS.forEach((platform) => {
    // Generate 4-6 optimal time slots per platform (covering different days/times)
    const slotsPerPlatform = Math.floor(Math.random() * 3) + 4 // 4-6 slots

    for (let i = 0; i < slotsPerPlatform; i++) {
      const day = days[Math.floor(Math.random() * days.length)]
      const hour = Math.floor(Math.random() * 15) + 8 // 8 AM - 11 PM
      const timeRange = `${hour.toString().padStart(2, '0')}:00 - ${(hour + 2).toString().padStart(2, '0')}:00`

      slots.push({
        platform,
        dayOfWeek: day,
        timeRange,
        audienceActivity: Math.floor(Math.random() * 35) + 65, // 65-100
        historicalPerformance: Math.floor(Math.random() * 35) + 65, // 65-100
        recommendationScore: Math.floor(Math.random() * 30) + 70, // 70-100
      })
    }
  })

  return slots.sort((a, b) => b.recommendationScore - a.recommendationScore)
}

// Export platform icon mapping for use with react-icons
export function getPlatformIconName(platform: PlatformType): string {
  const iconNames: Record<PlatformType, string> = {
    instagram: 'FaInstagram',
    facebook: 'FaFacebookF',
    linkedin: 'FaLinkedinIn',
    twitter: 'FaXTwitter',
    tiktok: 'FaTiktok',
    youtube: 'FaYoutube',
  }
  return iconNames[platform]
}

export function getContentTypeIcon(type: ContentType): string {
  const icons: Record<ContentType, string> = {
    post: '📝',
    reel: '🎬',
    story: '📖',
    video: '🎥',
    carousel: '🎠',
    article: '📰',
  }
  return icons[type]
}
