/**
 * MetricDetailModal Component
 *
 * Displays detailed information and visualizations for a specific metric
 * when a MetricCard is clicked.
 */

import React from 'react'
import { motion } from 'framer-motion'
import { FaTimes as X } from 'react-icons/fa'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'
import type { HeroMetric } from '../../../types/dashboard'

export interface MetricDetailModalProps {
  metric: HeroMetric
  onClose: () => void
}

export const MetricDetailModal: React.FC<MetricDetailModalProps> = ({ metric, onClose }) => {
  // Generate detailed time series data for chart
  const chartData = React.useMemo(() => {
    if (metric.sparklineData && metric.sparklineData.length > 0) {
      return metric.sparklineData.map((point, index) => ({
        name: point.label || `T-${metric.sparklineData!.length - index}`,
        value: point.value,
        timestamp: point.timestamp,
      }))
    }

    // Generate mock data if sparkline not available
    return Array.from({ length: 24 }, (_, i) => {
      const variance = (Math.random() - 0.5) * 0.2
      return {
        name: `${23 - i}h`,
        value: metric.value * (1 + variance),
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
      }
    }).reverse()
  }, [metric])

  // Calculate stats
  const stats = React.useMemo(() => {
    const values = chartData.map((d) => d.value)
    return {
      current: metric.value,
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
      change: metric.trend.value,
    }
  }, [chartData, metric])

  // Format value based on metric type
  const formatValue = (value: number) => {
    if (metric.suffix === '%') {
      return `${value.toFixed(1)}%`
    } else if (metric.suffix === 'M') {
      return `${value.toFixed(1)}M`
    } else if (metric.prefix === '€') {
      return `€${Math.round(value).toLocaleString('nl-NL')}`
    }
    return Math.round(value).toString()
  }

  // Color mapping
  const getColorClasses = () => {
    switch (metric.color) {
      case 'success':
        return {
          primary: '#00FF88',
          gradient: 'from-success/20 to-success/5',
        }
      case 'secondary':
        return {
          primary: '#A855F7',
          gradient: 'from-accent-secondary/20 to-accent-secondary/5',
        }
      case 'gradient':
        return {
          primary: '#00D4FF',
          gradient: 'from-accent-primary/20 to-accent-secondary/20',
        }
      default:
        return {
          primary: '#00D4FF',
          gradient: 'from-accent-primary/20 to-accent-primary/5',
        }
    }
  }

  const colors = getColorClasses()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          relative w-full max-w-4xl max-h-[90vh] overflow-y-auto
          bg-gradient-to-br ${colors.gradient} backdrop-blur-xl
          border border-white/10 rounded-2xl p-6 md:p-8
        `}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{metric.label}</h2>
            <p className="text-white/60">Detailed analysis and historical trends</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6 text-white/70" />
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Current" value={formatValue(stats.current)} />
          <StatCard label="Average (24h)" value={formatValue(stats.avg)} />
          <StatCard label="Minimum" value={formatValue(stats.min)} />
          <StatCard label="Maximum" value={formatValue(stats.max)} />
        </div>

        {/* Trend Indicator */}
        <div className="mb-6 p-4 rounded-lg border border-white/10">
          <div className="flex items-center justify-between">
            <span className="text-white/70">Trend ({metric.trend.period})</span>
            <span
              className={`text-xl font-bold ${
                metric.trend.direction === 'up' ? 'text-success' : 'text-error'
              }`}
            >
              {metric.trend.direction === 'up' ? '+' : '-'}
              {metric.trend.value}%
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">Historical Performance (24h)</h3>
          <div className="bg-black/20 rounded-lg p-4 border border-white/5">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.primary} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" style={{ fontSize: '12px' }} />
                <YAxis
                  stroke="rgba(255,255,255,0.5)"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => formatValue(value)}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 22, 41, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                  }}
                  formatter={(value: number) => [formatValue(value), metric.label]}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={colors.primary}
                  strokeWidth={2}
                  fill="url(#colorValue)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white mb-3">AI Insights</h3>
          <InsightCard
            type="positive"
            message="Performance is trending upward with consistent growth over the past 24 hours."
          />
          <InsightCard
            type="info"
            message="Peak performance typically occurs between 14:00-18:00 CET based on historical data."
          />
          {metric.trend.value > 20 && (
            <InsightCard
              type="warning"
              message="Rapid growth detected. Consider monitoring for sustainability."
            />
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

/**
 * StatCard - Small stat display
 */
const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-4 rounded-lg border border-white/10">
    <p className="text-xs text-white/60 mb-1">{label}</p>
    <p className="text-lg font-bold text-white font-mono">{value}</p>
  </div>
)

/**
 * InsightCard - AI insight message
 */
const InsightCard: React.FC<{
  type: 'positive' | 'warning' | 'info'
  message: string
}> = ({ type, message }) => {
  const colors = {
    positive: 'border-success/30 bg-success/10',
    warning: 'border-warning/30 bg-warning/10',
    info: 'border-accent-primary/30 bg-accent-primary/10',
  }

  const icons = {
    positive: '✓',
    warning: '⚠',
    info: 'ℹ',
  }

  return (
    <div className={`p-3 rounded-lg border ${colors[type]}`}>
      <div className="flex items-start gap-3">
        <span className="text-lg">{icons[type]}</span>
        <p className="text-sm text-white/90 flex-1">{message}</p>
      </div>
    </div>
  )
}
