// Mock data types - no icons needed here

export interface Account {
  id: string
  handle: string
  name: string
  avatar: string
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'
  type: 'main' | 'sub' | 'test'
  role: string
  strategy: string
  followers: number
  verified: boolean
  connectionStatus: 'connected' | 'disconnected' | 'error'
  parentId?: string
  testGroupId?: string
  testGroupLabel?: string
  subAccounts?: Account[] // For hierarchy tree

  // Strategy details
  objectives: string[]
  targetAudience: string
  contentThemes: string[]
  postingFrequency: string

  // Performance metrics
  metrics: {
    reach: number
    impressions: number
    engagement: number
    engagementRate: number
    clicks: number
    conversions: number
    roi: number
    ctr: number
    cpc: number
    costPerConversion: number
  }

  // Trending data
  trend: {
    followers: number
    engagement: number
    reach: number
  }

  // Top performing content
  topPosts: Array<{
    id: string
    type: 'image' | 'video' | 'carousel' | 'reel'
    thumbnail: string
    caption: string
    engagement: number
    reach: number
    date: string
    isWinner?: boolean
    promotedToMain?: boolean
    becameAd?: boolean
  }>

  // Audience insights
  audience: {
    demographics: {
      ageGroups: Array<{ range: string; percentage: number }>
      gender: { male: number; female: number; other: number }
    }
    interests: string[]
    activeHours: Array<{ hour: number; activity: number }>
    locations: Array<{ country: string; percentage: number }>
  }

  // Testing data (for sub/test accounts)
  testDuration?: string
  testStatus?: 'active' | 'completed' | 'winner' | 'paused'
  winRate?: number
  promotionCount?: number
}

export const mockAccounts: Account[] = [
  // Main Account - Instagram
  {
    id: 'main-ig-1',
    handle: '@futuremarketingai',
    name: 'Future Marketing AI',
    avatar: 'https://ui-avatars.com/api/?name=FMA&background=6366f1&color=fff',
    platform: 'instagram',
    type: 'main',
    role: 'Brand Hub',
    strategy: 'Premium Content & Paid Ads',
    followers: 145000,
    verified: true,
    connectionStatus: 'connected',
    objectives: [
      'Drive conversions',
      'Build brand authority',
      'Scale successful content',
      'Run high-performing ads',
    ],
    targetAudience: 'Marketing professionals, business owners, digital marketers',
    contentThemes: ['AI marketing', 'Growth strategies', 'Success stories', 'Product demos'],
    postingFrequency: '2-3 times per day',
    metrics: {
      reach: 890000,
      impressions: 1450000,
      engagement: 98500,
      engagementRate: 6.8,
      clicks: 45200,
      conversions: 1850,
      roi: 385,
      ctr: 3.12,
      cpc: 0.85,
      costPerConversion: 12.4,
    },
    trend: {
      followers: 8.5,
      engagement: 12.3,
      reach: 15.7,
    },
    topPosts: [
      {
        id: 'post-1',
        type: 'reel',
        thumbnail: 'https://placehold.co/400x600/6366f1/fff?text=Reel+1',
        caption: 'How AI doubled our conversion rate',
        engagement: 45200,
        reach: 320000,
        date: '2024-01-15',
        becameAd: true,
      },
      {
        id: 'post-2',
        type: 'carousel',
        thumbnail: 'https://placehold.co/400x400/8b5cf6/fff?text=Carousel+1',
        caption: '5 AI tools every marketer needs',
        engagement: 38900,
        reach: 280000,
        date: '2024-01-14',
      },
    ],
    audience: {
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 15 },
          { range: '25-34', percentage: 42 },
          { range: '35-44', percentage: 28 },
          { range: '45+', percentage: 15 },
        ],
        gender: { male: 58, female: 40, other: 2 },
      },
      interests: ['Marketing', 'Technology', 'AI', 'Business', 'Entrepreneurship'],
      activeHours: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.random() * 100,
      })),
      locations: [
        { country: 'United States', percentage: 45 },
        { country: 'United Kingdom', percentage: 18 },
        { country: 'Canada', percentage: 12 },
        { country: 'Australia', percentage: 10 },
        { country: 'Other', percentage: 15 },
      ],
    },
  },

  // Sub Account 1 - Content Testing Hub
  {
    id: 'sub-ig-1',
    handle: '@fma_growth',
    name: 'FMA Growth Lab',
    avatar: 'https://ui-avatars.com/api/?name=FG&background=8b5cf6&color=fff',
    platform: 'instagram',
    type: 'sub',
    role: 'Content Testing Hub',
    strategy: 'Educational Content & Case Studies',
    followers: 28500,
    verified: false,
    connectionStatus: 'connected',
    parentId: 'main-ig-1',
    objectives: [
      'Test new content formats',
      'Identify high-performers',
      'Build engaged community',
      'Feed winners to main account',
    ],
    targetAudience: 'Growth hackers, startup founders, marketing managers',
    contentThemes: ['Growth tactics', 'Case studies', 'Strategy breakdowns', 'Tools reviews'],
    postingFrequency: '4-5 times per day',
    metrics: {
      reach: 185000,
      impressions: 320000,
      engagement: 22400,
      engagementRate: 7.85,
      clicks: 8900,
      conversions: 420,
      roi: 245,
      ctr: 2.78,
      cpc: 0.45,
      costPerConversion: 8.2,
    },
    trend: {
      followers: 12.3,
      engagement: 18.5,
      reach: 22.1,
    },
    testStatus: 'active',
    winRate: 28.5,
    promotionCount: 12,
    topPosts: [
      {
        id: 'sub-post-1',
        type: 'reel',
        thumbnail: 'https://placehold.co/400x600/8b5cf6/fff?text=Test+Winner',
        caption: 'This strategy 3x our leads',
        engagement: 12800,
        reach: 95000,
        date: '2024-01-16',
        isWinner: true,
        promotedToMain: true,
      },
    ],
    audience: {
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 22 },
          { range: '25-34', percentage: 48 },
          { range: '35-44', percentage: 22 },
          { range: '45+', percentage: 8 },
        ],
        gender: { male: 62, female: 36, other: 2 },
      },
      interests: ['Startups', 'Growth Hacking', 'Marketing', 'SaaS'],
      activeHours: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.random() * 100,
      })),
      locations: [
        { country: 'United States', percentage: 52 },
        { country: 'India', percentage: 15 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'Canada', percentage: 10 },
        { country: 'Other', percentage: 11 },
      ],
    },
  },

  // Test Account Group A - Viral Content Tests
  {
    id: 'test-ig-1',
    handle: '@fma_viral_lab',
    name: 'FMA Viral Lab',
    avatar: 'https://ui-avatars.com/api/?name=VL&background=a78bfa&color=fff',
    platform: 'instagram',
    type: 'test',
    role: 'Viral Content Tester',
    strategy: 'Trending Hooks & Viral Formats',
    followers: 5200,
    verified: false,
    connectionStatus: 'connected',
    parentId: 'sub-ig-1',
    testGroupId: 'viral-group',
    testGroupLabel: 'Viral Content Tests',
    objectives: [
      'Test trending formats',
      'Experiment with hooks',
      'Find viral patterns',
      'Quick validation',
    ],
    targetAudience: 'Broad audience, trend followers',
    contentThemes: ['Viral trends', 'Quick tips', 'Surprising facts', 'Entertainment'],
    postingFrequency: '8-10 times per day',
    testDuration: '14 days',
    testStatus: 'active',
    winRate: 35.2,
    promotionCount: 5,
    metrics: {
      reach: 45000,
      impressions: 78000,
      engagement: 5600,
      engagementRate: 10.8,
      clicks: 1200,
      conversions: 45,
      roi: 180,
      ctr: 1.54,
      cpc: 0.25,
      costPerConversion: 5.5,
    },
    trend: {
      followers: 45.2,
      engagement: 38.5,
      reach: 52.3,
    },
    topPosts: [
      {
        id: 'test-post-1',
        type: 'reel',
        thumbnail: 'https://placehold.co/400x600/a78bfa/fff?text=Viral+Hit',
        caption: 'This ONE trick changed everything',
        engagement: 3200,
        reach: 28000,
        date: '2024-01-17',
        isWinner: true,
      },
    ],
    audience: {
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 45 },
          { range: '25-34', percentage: 35 },
          { range: '35-44', percentage: 15 },
          { range: '45+', percentage: 5 },
        ],
        gender: { male: 48, female: 50, other: 2 },
      },
      interests: ['Trends', 'Entertainment', 'Lifestyle', 'Quick Tips'],
      activeHours: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.random() * 100,
      })),
      locations: [
        { country: 'United States', percentage: 40 },
        { country: 'United Kingdom', percentage: 15 },
        { country: 'Brazil', percentage: 12 },
        { country: 'India', percentage: 18 },
        { country: 'Other', percentage: 15 },
      ],
    },
  },

  // Test Account Group A - Educational Deep Dives
  {
    id: 'test-ig-2',
    handle: '@fma_edu_lab',
    name: 'FMA Education Lab',
    avatar: 'https://ui-avatars.com/api/?name=EL&background=c4b5fd/fff',
    platform: 'instagram',
    type: 'test',
    role: 'Educational Content Tester',
    strategy: 'In-depth Tutorials & Guides',
    followers: 3800,
    verified: false,
    connectionStatus: 'connected',
    parentId: 'sub-ig-1',
    testGroupId: 'education-group',
    testGroupLabel: 'Educational Content Tests',
    objectives: [
      'Test long-form content',
      'Build authority',
      'Identify engagement patterns',
      'Quality over quantity',
    ],
    targetAudience: 'Serious learners, professionals',
    contentThemes: ['Tutorials', 'Deep dives', 'Strategy guides', 'Technical content'],
    postingFrequency: '2-3 times per day',
    testDuration: '30 days',
    testStatus: 'active',
    winRate: 22.8,
    promotionCount: 3,
    metrics: {
      reach: 28000,
      impressions: 45000,
      engagement: 3200,
      engagementRate: 8.4,
      clicks: 890,
      conversions: 68,
      roi: 290,
      ctr: 1.98,
      cpc: 0.35,
      costPerConversion: 4.2,
    },
    trend: {
      followers: 18.5,
      engagement: 25.3,
      reach: 20.1,
    },
    topPosts: [
      {
        id: 'test-post-2',
        type: 'carousel',
        thumbnail: 'https://placehold.co/400x400/c4b5fd/fff?text=Tutorial',
        caption: 'Complete guide to AI marketing',
        engagement: 1800,
        reach: 15000,
        date: '2024-01-16',
        isWinner: true,
      },
    ],
    audience: {
      demographics: {
        ageGroups: [
          { range: '18-24', percentage: 18 },
          { range: '25-34', percentage: 42 },
          { range: '35-44', percentage: 30 },
          { range: '45+', percentage: 10 },
        ],
        gender: { male: 65, female: 33, other: 2 },
      },
      interests: ['Education', 'Professional Development', 'Marketing', 'Business Strategy'],
      activeHours: Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        activity: Math.random() * 100,
      })),
      locations: [
        { country: 'United States', percentage: 50 },
        { country: 'Canada', percentage: 15 },
        { country: 'United Kingdom', percentage: 12 },
        { country: 'Australia', percentage: 10 },
        { country: 'Other', percentage: 13 },
      ],
    },
  },
]

// Generate accounts for other platforms
const generatePlatformAccounts = () => {
  const platforms: Array<{
    id: string
    name: string
    handle: string
    color: string
    multiplier: number
  }> = [
    { id: 'tiktok', name: 'TikTok', handle: '@fma_official', color: 'ff0050', multiplier: 2.5 },
    {
      id: 'youtube',
      name: 'YouTube',
      handle: '@FutureMarketingAI',
      color: 'ff0000',
      multiplier: 0.8,
    },
    {
      id: 'facebook',
      name: 'Facebook',
      handle: 'FutureMarketingAI',
      color: '1877f2',
      multiplier: 1.2,
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      handle: '@FutureMarktAI',
      color: '1da1f2',
      multiplier: 1.5,
    },
  ]

  platforms.forEach((platform, idx) => {
    const baseId = `${platform.id}-${idx}`
    const mult = platform.multiplier

    // Main Account
    mockAccounts.push({
      id: `main-${baseId}`,
      handle: platform.handle,
      name: `Future Marketing AI - ${platform.name}`,
      avatar: `https://ui-avatars.com/api/?name=FMA+${platform.name.charAt(0)}&background=${platform.color}&color=fff`,
      platform: platform.id as any,
      type: 'main',
      role: 'Brand Hub',
      strategy: 'Premium Content & Paid Ads',
      followers: Math.floor(145000 * mult),
      verified: true,
      connectionStatus: 'connected',
      objectives: [
        'Drive conversions',
        'Build brand authority',
        'Scale successful content',
        'Run high-performing ads',
      ],
      targetAudience: 'Marketing professionals, business owners, digital marketers',
      contentThemes: ['AI marketing', 'Growth strategies', 'Success stories', 'Product demos'],
      postingFrequency: '2-3 posts per day',
      metrics: {
        reach: Math.floor(850000 * mult),
        impressions: Math.floor(1250000 * mult),
        engagement: Math.floor(125000 * mult),
        engagementRate: 8.6,
        clicks: Math.floor(28500 * mult),
        conversions: Math.floor(3200 * mult),
        roi: 285,
        ctr: 2.3,
        cpc: 0.85,
        costPerConversion: 7.5,
      },
      trend: { followers: 12, engagement: 8, reach: 15 },
      topPosts: [
        {
          id: `post-${baseId}-1`,
          type: 'video',
          thumbnail: 'https://picsum.photos/seed/winner1/400/400',
          caption: 'Top performing content that became an ad',
          engagement: Math.floor(15000 * mult),
          reach: Math.floor(125000 * mult),
          date: '2024-01-15',
          becameAd: true,
        },
      ],
      audience: {
        demographics: {
          ageGroups: [
            { range: '18-24', percentage: 15 },
            { range: '25-34', percentage: 35 },
            { range: '35-44', percentage: 30 },
            { range: '45-54', percentage: 15 },
            { range: '55+', percentage: 5 },
          ],
          gender: { male: 55, female: 43, other: 2 },
        },
        interests: ['Digital Marketing', 'AI Technology', 'Business Growth', 'Entrepreneurship'],
        activeHours: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          activity: Math.random() * 100,
        })),
        locations: [
          { country: 'United States', percentage: 50 },
          { country: 'Canada', percentage: 15 },
          { country: 'United Kingdom', percentage: 12 },
          { country: 'Australia', percentage: 10 },
          { country: 'Other', percentage: 13 },
        ],
      },
    })

    // Sub Account
    mockAccounts.push({
      id: `sub-${baseId}`,
      handle: `${platform.handle}_growth`,
      name: `FMA Growth - ${platform.name}`,
      avatar: `https://ui-avatars.com/api/?name=FMA+G&background=8b5cf6&color=fff`,
      platform: platform.id as any,
      type: 'sub',
      role: 'Content Testing Hub',
      strategy: 'Educational & Viral Content',
      followers: Math.floor(28500 * mult),
      verified: false,
      connectionStatus: 'connected',
      parentId: `main-${baseId}`,
      objectives: ['Test content variations', 'Identify viral patterns', 'Feed winners to main'],
      targetAudience: 'Growth-focused marketers',
      contentThemes: ['Quick tips', 'Case studies', 'How-to guides'],
      postingFrequency: '4-5 posts per day',
      metrics: {
        reach: Math.floor(180000 * mult),
        impressions: Math.floor(245000 * mult),
        engagement: Math.floor(19500 * mult),
        engagementRate: 6.8,
        clicks: Math.floor(8200 * mult),
        conversions: Math.floor(890 * mult),
        roi: 168,
        ctr: 4.6,
        cpc: 0.62,
        costPerConversion: 5.8,
      },
      trend: { followers: 18, engagement: 12, reach: 22 },
      topPosts: [
        {
          id: `post-${baseId}-sub-1`,
          type: 'video',
          thumbnail: 'https://picsum.photos/seed/sub1/400/400',
          caption: 'Educational content that was promoted',
          engagement: Math.floor(8500 * mult),
          reach: Math.floor(65000 * mult),
          date: '2024-01-20',
          promotedToMain: true,
        },
      ],
      audience: {
        demographics: {
          ageGroups: [
            { range: '18-24', percentage: 25 },
            { range: '25-34', percentage: 40 },
            { range: '35-44', percentage: 25 },
            { range: '45-54', percentage: 8 },
            { range: '55+', percentage: 2 },
          ],
          gender: { male: 52, female: 46, other: 2 },
        },
        interests: ['Marketing Tools', 'Growth Hacking', 'Content Strategy'],
        activeHours: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          activity: Math.random() * 100,
        })),
        locations: [
          { country: 'United States', percentage: 45 },
          { country: 'India', percentage: 20 },
          { country: 'United Kingdom', percentage: 15 },
          { country: 'Canada', percentage: 10 },
          { country: 'Other', percentage: 10 },
        ],
      },
      testStatus: 'active',
      winRate: 28.5,
      promotionCount: 12,
    })

    // Test Account 1
    mockAccounts.push({
      id: `test1-${baseId}`,
      handle: `${platform.handle}_lab`,
      name: `FMA Viral Lab - ${platform.name}`,
      avatar: `https://ui-avatars.com/api/?name=Lab&background=6366f1&color=fff`,
      platform: platform.id as any,
      type: 'test',
      role: 'Viral Content Tester',
      strategy: 'Trending Hooks & Formats',
      followers: Math.floor(5200 * mult),
      verified: false,
      connectionStatus: 'connected',
      parentId: `sub-${baseId}`,
      objectives: ['Test viral hooks', 'Experiment with trends', 'Rapid iteration'],
      targetAudience: 'Trend-conscious audience',
      contentThemes: ['Viral trends', 'Memes', 'Quick wins'],
      postingFrequency: '8-10 posts per day',
      metrics: {
        reach: Math.floor(42000 * mult),
        impressions: Math.floor(58000 * mult),
        engagement: Math.floor(4500 * mult),
        engagementRate: 10.8,
        clicks: Math.floor(1850 * mult),
        conversions: Math.floor(185 * mult),
        roi: 124,
        ctr: 4.4,
        cpc: 0.45,
        costPerConversion: 4.5,
      },
      trend: { followers: 35, engagement: 22, reach: 28 },
      topPosts: [
        {
          id: `post-${baseId}-test1-1`,
          type: 'video',
          thumbnail: 'https://picsum.photos/seed/test1/400/400',
          caption: 'Viral test that won',
          engagement: Math.floor(2200 * mult),
          reach: Math.floor(18000 * mult),
          date: '2024-01-22',
          isWinner: true,
        },
      ],
      audience: {
        demographics: {
          ageGroups: [
            { range: '18-24', percentage: 45 },
            { range: '25-34', percentage: 35 },
            { range: '35-44', percentage: 15 },
            { range: '45-54', percentage: 4 },
            { range: '55+', percentage: 1 },
          ],
          gender: { male: 48, female: 50, other: 2 },
        },
        interests: ['Social Media', 'Viral Content', 'Trends'],
        activeHours: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          activity: Math.random() * 100,
        })),
        locations: [
          { country: 'United States', percentage: 40 },
          { country: 'India', percentage: 25 },
          { country: 'Brazil', percentage: 15 },
          { country: 'Mexico', percentage: 10 },
          { country: 'Other', percentage: 10 },
        ],
      },
      testDuration: '3 weeks',
      testStatus: 'active',
      winRate: 35.2,
      promotionCount: 8,
    })

    // Test Account 2
    mockAccounts.push({
      id: `test2-${baseId}`,
      handle: `${platform.handle}_edu`,
      name: `FMA Education Lab - ${platform.name}`,
      avatar: `https://ui-avatars.com/api/?name=Edu&background=8b5cf6&color=fff`,
      platform: platform.id as any,
      type: 'test',
      role: 'Educational Content Tester',
      strategy: 'In-depth Tutorials',
      followers: Math.floor(3800 * mult),
      verified: false,
      connectionStatus: 'connected',
      parentId: `sub-${baseId}`,
      objectives: ['Test educational formats', 'Build authority', 'Generate quality leads'],
      targetAudience: 'Learning-focused professionals',
      contentThemes: ['Tutorials', 'Deep dives', 'Expert interviews'],
      postingFrequency: '3-4 posts per day',
      metrics: {
        reach: Math.floor(28000 * mult),
        impressions: Math.floor(38000 * mult),
        engagement: Math.floor(2850 * mult),
        engagementRate: 7.5,
        clicks: Math.floor(1420 * mult),
        conversions: Math.floor(215 * mult),
        roi: 156,
        ctr: 5.1,
        cpc: 0.55,
        costPerConversion: 4.8,
      },
      trend: { followers: 22, engagement: 15, reach: 18 },
      topPosts: [
        {
          id: `post-${baseId}-test2-1`,
          type: 'carousel',
          thumbnail: 'https://picsum.photos/seed/test2/400/400',
          caption: 'Tutorial that won and was promoted',
          engagement: Math.floor(1850 * mult),
          reach: Math.floor(14000 * mult),
          date: '2024-01-24',
          isWinner: true,
          promotedToMain: true,
        },
      ],
      audience: {
        demographics: {
          ageGroups: [
            { range: '18-24', percentage: 20 },
            { range: '25-34', percentage: 40 },
            { range: '35-44', percentage: 25 },
            { range: '45-54', percentage: 12 },
            { range: '55+', percentage: 3 },
          ],
          gender: { male: 60, female: 38, other: 2 },
        },
        interests: ['Professional Development', 'Marketing Education', 'Business Strategy'],
        activeHours: Array.from({ length: 24 }, (_, i) => ({
          hour: i,
          activity: Math.random() * 100,
        })),
        locations: [
          { country: 'United States', percentage: 55 },
          { country: 'Canada', percentage: 15 },
          { country: 'United Kingdom', percentage: 12 },
          { country: 'Germany', percentage: 8 },
          { country: 'Other', percentage: 10 },
        ],
      },
      testDuration: '4 weeks',
      testStatus: 'active',
      winRate: 22.8,
      promotionCount: 5,
    })
  })
}

// Generate accounts for all platforms
generatePlatformAccounts()

// Helper functions
export const getAccountsByType = (type: Account['type']) =>
  mockAccounts.filter((acc) => acc.type === type)

export const getSubAccounts = (parentId: string) =>
  mockAccounts.filter((acc) => acc.parentId === parentId)

export const getTestAccounts = (parentId: string) =>
  mockAccounts.filter((acc) => acc.parentId === parentId && acc.type === 'test')

export const getTopPerformers = (count: number = 3) =>
  [...mockAccounts]
    .sort((a, b) => b.metrics.engagementRate - a.metrics.engagementRate)
    .slice(0, count)

export const getWinningContent = () =>
  mockAccounts
    .flatMap((acc) => acc.topPosts.filter((post) => post.isWinner))
    .sort((a, b) => b.engagement - a.engagement)

export const getPromotedContent = () =>
  mockAccounts
    .flatMap((acc) => acc.topPosts.filter((post) => post.promotedToMain))
    .sort((a, b) => b.engagement - a.engagement)

export const getAdContent = () =>
  mockAccounts
    .flatMap((acc) => acc.topPosts.filter((post) => post.becameAd))
    .sort((a, b) => b.engagement - a.engagement)

// Build account hierarchy
export const buildAccountHierarchy = (): Account[] => {
  // Create a map for quick lookup
  const accountMap = new Map<string, Account>()
  mockAccounts.forEach((account) => {
    accountMap.set(account.id, { ...account, subAccounts: [] })
  })

  const rootAccounts: Account[] = []

  // Build the hierarchy
  accountMap.forEach((account) => {
    if (account.parentId) {
      const parent = accountMap.get(account.parentId)
      if (parent) {
        parent.subAccounts = parent.subAccounts || []
        parent.subAccounts.push(account)
      }
    } else {
      // This is a root account (no parent)
      rootAccounts.push(account)
    }
  })

  return rootAccounts
}
