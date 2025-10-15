/**
 * Performance Timeline Component
 *
 * Multi-metric line chart with zoom controls, annotations,
 * and real-time updates.
 */

import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine,
} from 'recharts'
import { FaExpand, FaCompress, FaDownload } from 'react-icons/fa'

interface TimeSeriesDataPoint {
  date: string
  roi: number
  reach: number
  engagement: number
  conversions: number
}

interface Annotation {
  date: string
  label: string
  color: string
}

interface PerformanceTimelineProps {
  data: TimeSeriesDataPoint[]
  annotations?: Annotation[]
  enableZoom?: boolean
  updateInterval?: number
  exportable?: boolean
}

export const PerformanceTimeline: React.FC<PerformanceTimelineProps> = ({
  data: initialData,
  annotations = [],
  enableZoom = true,
  updateInterval = 5000,
  exportable = true,
}) => {
  const [data, setData] = useState(initialData)
  const [isZoomed, setIsZoomed] = useState(false)
  const [selectedMetrics, setSelectedMetrics] = useState(['roi', 'engagement'])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setData((prevData) =>
        prevData.map((point, index) => {
          // Only update recent data points
          if (index >= prevData.length - 3) {
            return {
              ...point,
              roi: Math.max(0, point.roi + (Math.random() - 0.5) * 5),
              reach: Math.max(0, point.reach + (Math.random() - 0.5) * 1000),
              engagement: Math.max(0, point.engagement + (Math.random() - 0.5) * 2),
              conversions: Math.max(0, point.conversions + (Math.random() - 0.5) * 10),
            }
          }
          return point
        })
      )
    }, updateInterval)

    return () => clearInterval(interval)
  }, [updateInterval])

  const metrics = [
    { key: 'roi', name: 'ROI (%)', color: '#6366F1', unit: '%' },
    { key: 'reach', name: 'Reach', color: '#10B981', unit: 'K' },
    { key: 'engagement', name: 'Engagement (%)', color: '#8B5CF6', unit: '%' },
    { key: 'conversions', name: 'Conversions', color: '#EC4899', unit: '' },
  ]

  const toggleMetric = (metricKey: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(metricKey) ? prev.filter((k) => k !== metricKey) : [...prev, metricKey]
    )
  }

  const handleExport = () => {
    const csv = [
      ['Date', ...metrics.map((m) => m.name)].join(','),
      ...data.map((point) =>
        [
          point.date,
          point.roi.toFixed(2),
          point.reach.toFixed(0),
          point.engagement.toFixed(2),
          point.conversions.toFixed(0),
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'performance-timeline.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  // Format data for display
  const displayData = useMemo(() => {
    return isZoomed ? data.slice(-7) : data
  }, [data, isZoomed])

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Performance Timeline</h3>
          <p className="text-sm text-white/60">Real-time metrics tracking</p>
        </div>

        <div className="flex gap-2">
          {/* Metric Toggles */}
          <div className="flex gap-2">
            {metrics.map((metric) => (
              <motion.button
                key={metric.key}
                onClick={() => toggleMetric(metric.key)}
                className={`
                  px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200
                  ${
                    selectedMetrics.includes(metric.key)
                      ? 'opacity-100 border-2'
                      : 'opacity-40 border-2 border-transparent hover:opacity-70'
                  }
                `}
                style={{
                  backgroundColor: `${metric.color}20`,
                  color: metric.color,
                  borderColor: selectedMetrics.includes(metric.key) ? metric.color : 'transparent',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {metric.name}
              </motion.button>
            ))}
          </div>

          {/* Zoom Toggle */}
          {enableZoom && (
            <motion.button
              onClick={() => setIsZoomed(!isZoomed)}
              className="px-3 py-2 rounded-lg hover:bg-white/10 text-white transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title={isZoomed ? 'Show all data' : 'Zoom to last 7 days'}
            >
              {isZoomed ? <FaCompress /> : <FaExpand />}
            </motion.button>
          )}

          {/* Export Button */}
          {exportable && (
            <motion.button
              onClick={handleExport}
              className="px-3 py-2 rounded-lg bg-accent-primary/20 hover:bg-accent-primary/30 text-accent-primary border border-accent-primary/50 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Export to CSV"
            >
              <FaDownload />
            </motion.button>
          )}
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
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={displayData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="date" stroke="#94A3B8" style={{ fontSize: '12px' }} />
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

              {/* Annotations */}
              {annotations.map((annotation, index) => (
                <ReferenceLine
                  key={index}
                  x={annotation.date}
                  stroke={annotation.color}
                  strokeDasharray="3 3"
                  label={{
                    value: annotation.label,
                    position: 'top',
                    fill: annotation.color,
                    fontSize: 10,
                  }}
                />
              ))}

              {/* Metric Lines */}
              {selectedMetrics.includes('roi') && (
                <Line
                  type="monotone"
                  dataKey="roi"
                  stroke={metrics[0].color}
                  strokeWidth={2}
                  dot={{ fill: metrics[0].color, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="ROI %"
                />
              )}
              {selectedMetrics.includes('reach') && (
                <Line
                  type="monotone"
                  dataKey="reach"
                  stroke={metrics[1].color}
                  strokeWidth={2}
                  dot={{ fill: metrics[1].color, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Reach"
                />
              )}
              {selectedMetrics.includes('engagement') && (
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke={metrics[2].color}
                  strokeWidth={2}
                  dot={{ fill: metrics[2].color, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Engagement %"
                />
              )}
              {selectedMetrics.includes('conversions') && (
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke={metrics[3].color}
                  strokeWidth={2}
                  dot={{ fill: metrics[3].color, r: 4 }}
                  activeDot={{ r: 6 }}
                  name="Conversions"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Live Indicator */}
        <div className="mt-4 flex items-center justify-end gap-2">
          <motion.div
            className="w-2 h-2 rounded-full bg-success"
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <span className="text-xs text-white/60">Live updates every {updateInterval / 1000}s</span>
        </div>
      </motion.div>
    </div>
  )
}

export default PerformanceTimeline
