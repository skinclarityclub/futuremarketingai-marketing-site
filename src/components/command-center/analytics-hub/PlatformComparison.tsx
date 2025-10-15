/**
 * Platform Comparison Component
 *
 * Grouped bar charts comparing metrics across platforms
 * with sorting and trend indicators.
 */

import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from 'recharts'
import { FaArrowUp, FaArrowDown, FaSort } from 'react-icons/fa'
import { FaTiktok, FaInstagram, FaLinkedin, FaFacebookF, FaXTwitter } from 'react-icons/fa6'

interface PlatformMetrics {
  platform: string
  roi: number
  reach: number
  engagement: number
  conversions: number
  trend: 'up' | 'down' | 'stable'
  trendValue: number
}

interface PlatformComparisonProps {
  platforms: PlatformMetrics[]
  sortBy?: 'roi' | 'reach' | 'engagement' | 'conversions'
  showTrends?: boolean
}

const platformIconsMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  facebook: FaFacebookF,
  tiktok: FaTiktok,
  linkedin: FaLinkedin,
  twitter: FaXTwitter,
}

const platformColors: Record<string, string> = {
  instagram: '#E4405F',
  facebook: '#1877F2',
  tiktok: '#000000',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
}

export const PlatformComparison: React.FC<PlatformComparisonProps> = ({
  platforms: initialPlatforms,
  sortBy: initialSortBy = 'roi',
  showTrends = true,
}) => {
  const [sortBy, setSortBy] = useState<'roi' | 'reach' | 'engagement' | 'conversions'>(
    initialSortBy
  )
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Sort platforms
  const sortedPlatforms = useMemo(() => {
    return [...initialPlatforms].sort((a, b) => {
      const aValue = a[sortBy]
      const bValue = b[sortBy]
      return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
    })
  }, [initialPlatforms, sortBy, sortOrder])

  const handleSort = (metric: typeof sortBy) => {
    if (sortBy === metric) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      setSortBy(metric)
      setSortOrder('desc')
    }
  }

  const metrics = [
    { key: 'roi', name: 'ROI', color: '#6366F1', unit: '%' },
    { key: 'engagement', name: 'Engagement', color: '#8B5CF6', unit: '%' },
    { key: 'conversions', name: 'Conversions', color: '#10B981', unit: '' },
  ]

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Platform Comparison</h3>
          <p className="text-sm text-white/60">Performance metrics across platforms</p>
        </div>

        {/* Sort Controls */}
        <div className="flex gap-2">
          {metrics.map((metric) => (
            <motion.button
              key={metric.key}
              onClick={() => handleSort(metric.key as typeof sortBy)}
              className={`
                px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                flex items-center gap-2
                ${
                  sortBy === metric.key
                    ? 'border-2'
                    : 'border-2 border-transparent opacity-60 hover:opacity-100'
                }
              `}
              style={{
                backgroundColor: `${metric.color}20`,
                color: metric.color,
                borderColor: sortBy === metric.key ? metric.color : 'transparent',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {metric.name}
              {sortBy === metric.key && <FaSort className="text-xs" />}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <motion.div
        className="p-6 rounded-2xl backdrop-blur-xl border border-white/10"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="relative" style={{ background: 'transparent' }}>
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={sortedPlatforms} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis
                dataKey="platform"
                stroke="#94A3B8"
                style={{ fontSize: '11px' }}
                tick={(props) => {
                  const { x, y, payload } = props
                  return (
                    <g>
                      <text x={x} y={y + 25} textAnchor="middle" fill="#94A3B8" fontSize="10">
                        {payload.value}
                      </text>
                    </g>
                  )
                }}
                height={80}
              />
              <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(10, 15, 30, 0.98)',
                  border: '1px solid rgba(0, 212, 255, 0.3)',
                  borderRadius: '12px',
                  backdropFilter: 'blur(10px)',
                  padding: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
                labelStyle={{ color: '#FFFFFF', marginBottom: '8px', fontWeight: 'bold' }}
                itemStyle={{ color: '#E2E8F0', fontSize: '13px' }}
              />
              <Legend />

              {/* Bars for each metric */}
              <Bar dataKey="roi" fill={metrics[0].color} radius={[8, 8, 0, 0]} name="ROI %">
                {sortedPlatforms.map((entry, index) => (
                  <Cell
                    key={`cell-roi-${index}`}
                    fill={platformColors[entry.platform.toLowerCase()] || metrics[0].color}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="engagement"
                fill={metrics[1].color}
                radius={[8, 8, 0, 0]}
                name="Engagement %"
              >
                {sortedPlatforms.map((entry, index) => (
                  <Cell
                    key={`cell-engagement-${index}`}
                    fill={platformColors[entry.platform.toLowerCase()] || metrics[1].color}
                    opacity={0.7}
                  />
                ))}
              </Bar>
              <Bar
                dataKey="conversions"
                fill={metrics[2].color}
                radius={[8, 8, 0, 0]}
                name="Conversions"
              >
                {sortedPlatforms.map((entry, index) => (
                  <Cell
                    key={`cell-conversions-${index}`}
                    fill={platformColors[entry.platform.toLowerCase()] || metrics[2].color}
                    opacity={0.5}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Platform Cards with Trends */}
        {showTrends && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {sortedPlatforms.map((platform, index) => (
              <motion.div
                key={platform.platform}
                className="p-4 rounded-xl border border-white/10 hover:transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  {(() => {
                    const IconComponent = platformIconsMap[platform.platform.toLowerCase()]
                    const platformColor = platformColors[platform.platform.toLowerCase()]
                    return IconComponent ? (
                      <div className="text-2xl" style={{ color: platformColor }}>
                        <IconComponent />
                      </div>
                    ) : (
                      <span className="text-2xl">📱</span>
                    )
                  })()}
                  {platform.trend !== 'stable' && (
                    <div
                      className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
                        platform.trend === 'up'
                          ? 'bg-success/20 text-success'
                          : 'bg-error/20 text-error'
                      }`}
                    >
                      {platform.trend === 'up' ? <FaArrowUp /> : <FaArrowDown />}
                      {platform.trendValue}%
                    </div>
                  )}
                </div>
                <h4 className="text-xs font-bold text-white mb-2 truncate">{platform.platform}</h4>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between gap-1">
                    <span className="text-white/60 truncate">ROI:</span>
                    <span className="font-bold text-accent-primary flex-shrink-0">
                      {platform.roi}%
                    </span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span className="text-white/60 truncate">Engage:</span>
                    <span className="font-bold text-white flex-shrink-0">
                      {platform.engagement}%
                    </span>
                  </div>
                  <div className="flex justify-between gap-1">
                    <span className="text-white/60 truncate">Conv:</span>
                    <span className="font-bold text-success flex-shrink-0">
                      {platform.conversions}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default PlatformComparison
