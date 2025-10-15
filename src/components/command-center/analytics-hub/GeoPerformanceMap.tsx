/**
 * Geo Performance Map Component
 *
 * Regional performance visualization with interactive regions.
 * Simplified version using list-based visualization.
 */

import React, { useState } from 'react'
import { motion } from 'framer-motion'

interface RegionalMetrics {
  region: string
  country: string
  engagement: number
  conversions: number
  reach: number
  roi: number
}

interface GeoPerformanceMapProps {
  data: RegionalMetrics[]
  colorScale?: 'blue' | 'green' | 'purple'
  interactive?: boolean
}

const colorScales = {
  blue: {
    low: 'rgba(99, 102, 241, 0.2)', // Indigo
    mid: 'rgba(99, 102, 241, 0.5)',
    high: 'rgba(99, 102, 241, 0.8)',
    text: '#6366F1',
  },
  green: {
    low: 'rgba(16, 185, 129, 0.2)', // Emerald
    mid: 'rgba(16, 185, 129, 0.5)',
    high: 'rgba(16, 185, 129, 0.8)',
    text: '#10B981',
  },
  purple: {
    low: 'rgba(139, 92, 246, 0.2)', // Violet
    mid: 'rgba(139, 92, 246, 0.5)',
    high: 'rgba(139, 92, 246, 0.8)',
    text: '#8B5CF6',
  },
}

export const GeoPerformanceMap: React.FC<GeoPerformanceMapProps> = ({
  data,
  colorScale = 'blue',
  interactive = true,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'engagement' | 'conversions' | 'roi'>('roi')

  const colors = colorScales[colorScale]
  const maxEngagement = Math.max(...data.map((d) => d.engagement), 1)

  // Sort data
  const sortedData = [...data].sort((a, b) => b[sortBy] - a[sortBy])

  const getIntensity = (engagement: number) => {
    const percentage = (engagement / maxEngagement) * 100
    if (percentage < 33) {
      return colors.low
    }
    if (percentage < 66) {
      return colors.mid
    }
    return colors.high
  }

  const selectedData = sortedData.find((d) => d.region === selectedRegion)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Regional Performance</h3>
          <p className="text-sm text-white/60">Performance metrics by region</p>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          {['roi', 'engagement', 'conversions'].map((metric) => (
            <motion.button
              key={metric}
              onClick={() => setSortBy(metric as typeof sortBy)}
              className={`
                px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                ${
                  sortBy === metric
                    ? 'bg-accent-primary text-white'
                    : 'text-white/70 hover:bg-white/10'
                }
              `}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {metric.charAt(0).toUpperCase() + metric.slice(1)}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Regions List */}
        <motion.div
          className="lg:col-span-2 p-6 rounded-2xl backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-2">
            {sortedData.map((region, index) => (
              <motion.div
                key={region.region}
                className={`
                  p-4 rounded-xl cursor-pointer transition-all duration-200
                  ${selectedRegion === region.region ? 'ring-2 ring-accent-primary ' : 'hover:'}
                `}
                style={{
                  backgroundColor:
                    selectedRegion !== region.region ? getIntensity(region.engagement) : undefined,
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => {
                  if (!interactive) {
                    return
                  }
                  setSelectedRegion(selectedRegion === region.region ? null : region.region)
                }}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  {/* Region Info */}
                  <div>
                    <h4 className="text-lg font-bold text-white mb-1">{region.region}</h4>
                    <p className="text-sm text-white/60">{region.country}</p>
                  </div>

                  {/* Quick Metrics */}
                  <div className="flex gap-6 text-right">
                    <div>
                      <p className="text-xs text-white/60">ROI</p>
                      <p className="text-lg font-bold" style={{ color: colors.text }}>
                        +{region.roi}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Engagement</p>
                      <p className="text-lg font-bold text-white">{region.engagement}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-white/60">Conversions</p>
                      <p className="text-lg font-bold text-success">{region.conversions}</p>
                    </div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full"
                    style={{ backgroundColor: colors.text }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(region.engagement / maxEngagement) * 100}%` }}
                    transition={{ duration: 1, delay: index * 0.05 + 0.2 }}
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-4">
            <span className="text-xs text-white/60">Engagement Intensity:</span>
            <div className="flex items-center gap-2">
              <div className="w-12 h-4 rounded" style={{ backgroundColor: colors.low }} />
              <span className="text-xs text-white/60">Low</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-4 rounded" style={{ backgroundColor: colors.mid }} />
              <span className="text-xs text-white/60">Medium</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-12 h-4 rounded" style={{ backgroundColor: colors.high }} />
              <span className="text-xs text-white/60">High</span>
            </div>
          </div>
        </motion.div>

        {/* Details Panel */}
        <motion.div
          className="p-6 rounded-2xl backdrop-blur-xl border border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {selectedData ? (
            <div className="space-y-6">
              <div>
                <h4 className="text-2xl font-bold text-white mb-2">{selectedData.region}</h4>
                <p className="text-white/60">{selectedData.country}</p>
              </div>

              <div className="space-y-4">
                {/* ROI */}
                <div className="p-4 rounded-xl border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Return on Investment</p>
                  <p className="text-3xl font-bold" style={{ color: colors.text }}>
                    +{selectedData.roi}%
                  </p>
                </div>

                {/* Engagement */}
                <div className="p-4 rounded-xl border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Engagement Rate</p>
                  <p className="text-3xl font-bold text-white">{selectedData.engagement}%</p>
                </div>

                {/* Reach */}
                <div className="p-4 rounded-xl border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Total Reach</p>
                  <p className="text-3xl font-bold text-accent-secondary">
                    {selectedData.reach >= 1000
                      ? `${(selectedData.reach / 1000).toFixed(1)}K`
                      : selectedData.reach}
                  </p>
                </div>

                {/* Conversions */}
                <div className="p-4 rounded-xl border border-white/10">
                  <p className="text-sm text-white/60 mb-1">Conversions</p>
                  <p className="text-3xl font-bold text-success">{selectedData.conversions}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedRegion(null)}
                className="w-full py-3 rounded-xl hover:bg-white/10 text-white font-semibold transition-all duration-200"
              >
                Clear Selection
              </button>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="text-6xl mb-4">🌍</div>
              <h4 className="text-lg font-bold text-white mb-2">Select a Region</h4>
              <p className="text-sm text-white/60">
                Click on any region to view detailed performance metrics
              </p>
            </div>
          )}
        </motion.div>
      </div>

      {/* Top Performers Summary */}
      <motion.div
        className="p-6 rounded-2xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-accent-primary/30"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h4 className="text-lg font-bold text-white mb-4">Top 3 Performing Regions</h4>
        <div className="grid grid-cols-3 gap-4">
          {sortedData.slice(0, 3).map((region, index) => (
            <div key={region.region} className="text-center">
              <div className="text-3xl mb-2">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</div>
              <p className="text-sm font-bold text-white">{region.region}</p>
              <p className="text-xs text-white/60 mb-2">{region.country}</p>
              <p className="text-lg font-bold" style={{ color: colors.text }}>
                +{region.roi}% ROI
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

export default GeoPerformanceMap
