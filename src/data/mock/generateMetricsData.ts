/**
 * Metrics Mock Data Generator
 *
 * Generates hero metrics, time-series data, and system health indicators.
 */

import type {
  HeroMetric,
  TimeSeriesDataPoint,
  ChartData,
  SystemHealth,
  AIModel,
} from '../../types/dashboard'

/**
 * Generate Hero Metrics for the dashboard
 */
export function generateHeroMetrics(): HeroMetric[] {
  return [
    {
      value: 24,
      label: 'Active Campaigns',
      trend: {
        value: 12,
        direction: 'up',
        period: 'vs last month',
      },
      sparklineData: generateSparklineData(20, 30, 7),
      color: 'primary',
      icon: 'rocket',
    },
    {
      value: 1.2,
      label: 'Multi-Channel Reach',
      suffix: 'M',
      trend: {
        value: 28,
        direction: 'up',
        period: 'vs last month',
      },
      sparklineData: generateSparklineData(900000, 1300000, 7),
      color: 'success',
      icon: 'users',
    },
    {
      value: 8.4,
      label: 'Conversion Rate',
      suffix: '%',
      trend: {
        value: 3.2,
        direction: 'up',
        period: 'vs last month',
      },
      sparklineData: generateSparklineData(6, 10, 7),
      color: 'secondary',
      icon: 'target',
    },
    {
      value: 127,
      label: 'Hours Saved (Team)',
      trend: {
        value: 35,
        direction: 'up',
        period: 'vs yesterday',
      },
      sparklineData: generateSparklineData(90, 150, 7),
      color: 'gradient',
      icon: 'clock',
    },
  ]
}

/**
 * Generate sparkline data (7 days by default)
 */
function generateSparklineData(min: number, max: number, days: number = 7): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = []
  const now = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate value with slight upward trend
    const trendFactor = (days - i) / days // 0 to 1
    const range = max - min
    const baseValue = min + range * trendFactor
    const variance = range * 0.2 // 20% variance
    const value = baseValue + (Math.random() - 0.5) * variance

    data.push({
      timestamp: date.toISOString(),
      value: Math.floor(value),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
    })
  }

  return data
}

/**
 * Generate weekly performance chart data
 */
export function generateWeeklyPerformanceData(): ChartData {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

  return {
    labels: days,
    datasets: [
      {
        label: 'ROI %',
        data: [245, 278, 312, 295, 342, 318, 301],
        color: '#00D4FF',
        borderColor: '#00D4FF',
      },
      {
        label: 'Reach',
        data: [18500, 21200, 24800, 22900, 28400, 25600, 23100],
        color: '#00FF88',
        borderColor: '#00FF88',
      },
      {
        label: 'Engagement %',
        data: [12.3, 14.1, 15.7, 14.8, 17.2, 16.4, 15.9],
        color: '#B794F4',
        borderColor: '#B794F4',
      },
    ],
  }
}

/**
 * Generate monthly performance data (30 days)
 */
export function generateMonthlyPerformanceData(): TimeSeriesDataPoint[] {
  return generateSparklineData(200, 400, 30)
}

/**
 * Generate system health data
 */
export function generateSystemHealth(): SystemHealth {
  const aiModels: AIModel[] = [
    { name: 'GPT-4', status: 'active', purpose: 'content-generation' },
    { name: 'Claude', status: 'active', purpose: 'research' },
    { name: 'Gemini', status: 'active', purpose: 'optimization' },
    { name: 'Perplexity', status: 'idle', purpose: 'analysis' },
  ]

  return {
    api: {
      status: 'operational',
      lastCheck: new Date(),
      responseTime: Math.floor(Math.random() * 50) + 20, // 20-70ms
    },
    aiModels: {
      active: aiModels.filter((m) => m.status === 'active').length,
      total: aiModels.length,
      models: aiModels,
    },
    publishingQueue: {
      pending: Math.floor(Math.random() * 15) + 5, // 5-20
      scheduled: Math.floor(Math.random() * 30) + 10, // 10-40
      completed: Math.floor(Math.random() * 100) + 50, // 50-150
    },
    processing: {
      activeJobs: Math.floor(Math.random() * 5) + 1, // 1-6
      queuedJobs: Math.floor(Math.random() * 10) + 2, // 2-12
    },
  }
}

/**
 * Simulate real-time metric updates
 * Returns a slightly varied value from the base value
 */
export function simulateMetricUpdate(baseValue: number, variancePercent: number = 2): number {
  const variance = baseValue * (variancePercent / 100)
  const change = (Math.random() - 0.5) * variance
  return Math.floor(baseValue + change)
}

/**
 * Generate time-series data for any metric
 */
export function generateTimeSeriesData(
  baseValue: number,
  points: number = 30,
  variance: number = 0.1
): TimeSeriesDataPoint[] {
  const data: TimeSeriesDataPoint[] = []
  const now = new Date()

  for (let i = points - 1; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Add some realistic variation with slight upward trend
    const trendFactor = 1 + (points - i) / (points * 10) // Slight upward trend
    const randomVariance = 1 + (Math.random() - 0.5) * variance
    const value = baseValue * trendFactor * randomVariance

    data.push({
      timestamp: date.toISOString(),
      value: Math.floor(value),
      label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    })
  }

  return data
}
