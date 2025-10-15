/**
 * Analytics Hub - Main Container
 *
 * Combines all analytics visualizations into one powerful hub.
 */

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { PerformanceTimeline } from './PerformanceTimeline'
import { FunnelVisualization } from './FunnelVisualization'
import { PlatformComparison } from './PlatformComparison'
import { HeatMapCalendar } from './HeatMapCalendar'
import { GeoPerformanceMap } from './GeoPerformanceMap'
import { CrossPlatformComparison } from './CrossPlatformComparison'

// Generate mock data
function generateTimeSeriesData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return days.map((day, index) => ({
    date: day,
    roi: 45 + Math.random() * 20 + index * 2,
    reach: 15000 + Math.random() * 5000 + index * 1000,
    engagement: 6 + Math.random() * 3,
    conversions: 120 + Math.random() * 40 + index * 10,
  }))
}

function generateFunnelData() {
  return [
    { name: 'Impressions', value: 125000, color: '#6366F1', dropoff: 0 },
    { name: 'Clicks', value: 12500, color: '#10B981', dropoff: 10 },
    { name: 'Leads', value: 3750, color: '#8B5CF6', dropoff: 70 },
    { name: 'Conversions', value: 1050, color: '#F59E0B', dropoff: 72 },
  ]
}

function generatePlatformData() {
  return [
    {
      platform: 'Instagram',
      roi: 58,
      reach: 45000,
      engagement: 7.2,
      conversions: 850,
      trend: 'up' as const,
      trendValue: 12,
    },
    {
      platform: 'Facebook',
      roi: 42,
      reach: 62000,
      engagement: 5.8,
      conversions: 720,
      trend: 'down' as const,
      trendValue: 5,
    },
    {
      platform: 'TikTok',
      roi: 65,
      reach: 38000,
      engagement: 9.1,
      conversions: 920,
      trend: 'up' as const,
      trendValue: 23,
    },
    {
      platform: 'LinkedIn',
      roi: 51,
      reach: 28000,
      engagement: 6.5,
      conversions: 680,
      trend: 'up' as const,
      trendValue: 8,
    },
    {
      platform: 'Twitter',
      roi: 38,
      reach: 34000,
      engagement: 4.9,
      conversions: 540,
      trend: 'stable' as const,
      trendValue: 0,
    },
  ]
}

function generateHeatMapData() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const data = []

  for (const day of days) {
    for (let hour = 0; hour < 24; hour++) {
      // Higher engagement during business hours (9-17) and evenings (19-22)
      let engagement = Math.random() * 30
      if ((hour >= 9 && hour <= 17) || (hour >= 19 && hour <= 22)) {
        engagement += Math.random() * 50
      }
      data.push({ day, hour, engagement: Math.round(engagement) })
    }
  }

  return data
}

function generateAIRecommendations() {
  return [
    { day: 'Mon', hour: 10, reason: 'Peak engagement time for professional audience' },
    { day: 'Wed', hour: 20, reason: 'High conversion rate historically' },
    { day: 'Fri', hour: 15, reason: 'Weekend planning activity spike' },
    { day: 'Sat', hour: 11, reason: 'Leisure browsing peak for consumer segment' },
  ]
}

function generateGeoData() {
  return [
    {
      region: 'North America',
      country: 'USA & Canada',
      engagement: 75,
      conversions: 1200,
      reach: 45000,
      roi: 62,
    },
    {
      region: 'Western Europe',
      country: 'UK, DE, FR',
      engagement: 68,
      conversions: 980,
      reach: 38000,
      roi: 55,
    },
    {
      region: 'Asia Pacific',
      country: 'JP, AU, SG',
      engagement: 82,
      conversions: 1450,
      reach: 52000,
      roi: 71,
    },
    {
      region: 'South America',
      country: 'BR, AR',
      engagement: 58,
      conversions: 720,
      reach: 28000,
      roi: 48,
    },
    {
      region: 'Middle East',
      country: 'UAE, SA',
      engagement: 71,
      conversions: 890,
      reach: 31000,
      roi: 58,
    },
  ]
}

export const AnalyticsHub: React.FC = () => {
  // Generate mock data once
  const timeSeriesData = useMemo(() => generateTimeSeriesData(), [])
  const funnelData = useMemo(() => generateFunnelData(), [])
  const platformData = useMemo(() => generatePlatformData(), [])
  const heatMapData = useMemo(() => generateHeatMapData(), [])
  const aiRecommendations = useMemo(() => generateAIRecommendations(), [])
  const geoData = useMemo(() => generateGeoData(), [])

  const annotations = [{ date: 'Wed', label: 'Campaign Launch', color: '#00FF88' }]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-3xl font-bold text-white mb-2">Real-Time Analytics Hub</h2>
        <p className="text-white/60">Comprehensive performance insights with live data updates</p>
      </motion.div>

      {/* Performance Timeline */}
      <PerformanceTimeline
        data={timeSeriesData}
        annotations={annotations}
        enableZoom
        updateInterval={5000}
        exportable
      />

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Funnel Visualization */}
        <FunnelVisualization stages={funnelData} animated clickable />

        {/* Platform Comparison */}
        <PlatformComparison platforms={platformData} sortBy="roi" showTrends />
      </div>

      {/* HeatMap Calendar */}
      <HeatMapCalendar data={heatMapData} aiRecommendations={aiRecommendations} interactive />

      {/* Geo Performance Map */}
      <GeoPerformanceMap data={geoData} colorScale="blue" interactive />

      {/* Cross-Platform Analytics */}
      <CrossPlatformComparison />

      {/* Summary Stats */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="text-center">
          <p className="text-sm text-white/60 mb-1">Total Impressions</p>
          <p className="text-3xl font-bold text-white">125K</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/60 mb-1">Conversion Rate</p>
          <p className="text-3xl font-bold text-success">8.4%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/60 mb-1">Avg ROI</p>
          <p className="text-3xl font-bold text-accent-primary">+54%</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-white/60 mb-1">Active Regions</p>
          <p className="text-3xl font-bold text-accent-secondary">5</p>
        </div>
      </motion.div>
    </div>
  )
}

export default AnalyticsHub
