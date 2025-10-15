/**
 * Simple MetricCard for debugging
 */

import React from 'react'
import type { HeroMetric } from '../../../types/dashboard'

export const MetricCardSimple: React.FC<{ metric: HeroMetric }> = ({ metric }) => {
  return (
    <div className="bg-bg-card rounded-xl p-6 border border-white/10">
      <div className="text-white">
        <div className="text-4xl mb-2">{metric.icon}</div>
        <div className="text-3xl font-bold">{metric.value}</div>
        <div className="text-sm text-white/70">{metric.label}</div>
      </div>
    </div>
  )
}
