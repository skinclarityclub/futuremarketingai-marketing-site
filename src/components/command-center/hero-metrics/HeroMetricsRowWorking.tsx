/**
 * HeroMetricsRow - Working Version with Real-Time Updates
 */

import React, { useState, useEffect } from 'react'
import { MetricCardWorking } from './MetricCardWorking'
import type { HeroMetric } from '../../../types/dashboard'

export interface HeroMetricsRowWorkingProps {
  metrics: HeroMetric[]
  enableLiveUpdates?: boolean
  updateInterval?: number
}

export const HeroMetricsRowWorking: React.FC<HeroMetricsRowWorkingProps> = ({
  metrics: initialMetrics,
  enableLiveUpdates = true,
  updateInterval = 5000,
}) => {
  const [metrics, setMetrics] = useState(initialMetrics)

  // Simulate real-time metric updates
  useEffect(() => {
    if (!enableLiveUpdates) {
      return
    }

    const interval = setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => ({
          ...metric,
          value: simulateMetricUpdate(metric.value, 2), // 2% variance
        }))
      )
    }, updateInterval)

    return () => clearInterval(interval)
  }, [enableLiveUpdates, updateInterval])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {metrics.map((metric, index) => (
        <MetricCardWorking key={metric.label} metric={metric} delay={index} />
      ))}
    </div>
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
