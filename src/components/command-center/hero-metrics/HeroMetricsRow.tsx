/**
 * HeroMetricsRow Component
 *
 * Container for displaying 4 key performance metric cards
 * with staggered entrance animations and real-time updates.
 */

import React, { useState, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import { MetricCard } from './MetricCard'
import { MetricDetailModal } from './MetricDetailModal'
import type { HeroMetric } from '../../../types/dashboard'

export interface HeroMetricsRowProps {
  metrics: HeroMetric[]
  /** Enable simulated real-time updates */
  enableLiveUpdates?: boolean
  /** Update interval in milliseconds */
  updateInterval?: number
}

export const HeroMetricsRow: React.FC<HeroMetricsRowProps> = ({
  metrics: initialMetrics,
  enableLiveUpdates = true,
  updateInterval = 5000,
}) => {
  const [metrics, setMetrics] = useState(initialMetrics)
  const [selectedMetric, setSelectedMetric] = useState<HeroMetric | null>(null)

  // Simulate real-time metric updates - MUST be before any early returns
  useEffect(() => {
    if (!enableLiveUpdates) {
      return
    }

    const interval = setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => ({
          ...metric,
          value: simulateMetricUpdate(metric.value, 2), // 2% variance
          trend: {
            ...metric.trend,
            value: simulateMetricUpdate(metric.trend.value, 5), // 5% variance for trend
          },
        }))
      )
    }, updateInterval)

    return () => clearInterval(interval)
  }, [enableLiveUpdates, updateInterval])

  // Safety check - must be after hooks
  if (!metrics || metrics.length === 0) {
    return <div className="text-white">No metrics available</div>
  }

  // Handle metric card click
  const handleMetricClick = (metric: HeroMetric) => {
    setSelectedMetric(metric)
  }

  // Close modal
  const handleCloseModal = () => {
    setSelectedMetric(null)
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.label}
            metric={metric}
            onClick={() => handleMetricClick(metric)}
            sparklineData={metric.sparklineData?.map((d) => d.value)}
            progressRing={metric.suffix === '%'}
            delay={index}
          />
        ))}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedMetric && <MetricDetailModal metric={selectedMetric} onClose={handleCloseModal} />}
      </AnimatePresence>
    </>
  )
}

/**
 * Simulate metric update with small random variation
 */
function simulateMetricUpdate(currentValue: number, maxVariancePercent: number): number {
  const variance = (Math.random() - 0.5) * 2 * (maxVariancePercent / 100)
  const newValue = currentValue * (1 + variance)

  // Ensure value stays positive
  return Math.max(0, newValue)
}
