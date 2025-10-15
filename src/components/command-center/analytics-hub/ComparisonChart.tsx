import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import type { Account } from '../multi-account-manager/mockAccountData'
import type { MetricType, ChartType } from './MetricsChartSelector'
import { ChartTooltip } from '../../common/ChartTooltip'
import type { TooltipEntry } from '../../common/ChartTooltip'

interface ComparisonChartProps {
  accounts: Account[]
  selectedMetrics: MetricType[]
  chartType: ChartType
}

const metricColors: Record<MetricType, string> = {
  reach: '#6366f1',
  engagement: '#ec4899',
  clicks: '#8b5cf6',
  conversions: '#10b981',
  cpl: '#f59e0b',
  roi: '#14b8a6',
}

const metricLabels: Record<MetricType, string> = {
  reach: 'Reach',
  engagement: 'Engagement Rate',
  clicks: 'Clicks',
  conversions: 'Conversions',
  cpl: 'CPL (€)',
  roi: 'ROI (%)',
}

export const ComparisonChart: React.FC<ComparisonChartProps> = ({
  accounts,
  selectedMetrics,
  chartType,
}) => {
  // Prepare data for charts
  const chartData = useMemo(() => {
    if (chartType === 'radar') {
      // For radar chart, we need one data point per metric with all accounts
      return selectedMetrics.map((metric) => {
        const dataPoint: any = { metric: metricLabels[metric] }
        accounts.forEach((account) => {
          let value
          switch (metric) {
            case 'reach':
              value = account.metrics.reach / 10000 // Scale down for visualization
              break
            case 'engagement':
              value = account.metrics.engagementRate
              break
            case 'clicks':
              value = account.metrics.clicks / 1000
              break
            case 'conversions':
              value = account.metrics.conversions / 100
              break
            case 'cpl':
              value = account.metrics.costPerConversion
              break
            case 'roi':
              value = account.metrics.roi
              break
          }
          dataPoint[account.handle] = value
        })
        return dataPoint
      })
    } else {
      // For bar/line charts, we need one data point per account with selected metrics
      return accounts.map((account) => {
        const dataPoint: any = {
          name: account.handle,
          platform: account.platform,
        }

        selectedMetrics.forEach((metric) => {
          switch (metric) {
            case 'reach':
              dataPoint[metric] = account.metrics.reach / 10000
              break
            case 'engagement':
              dataPoint[metric] = account.metrics.engagementRate
              break
            case 'clicks':
              dataPoint[metric] = account.metrics.clicks / 1000
              break
            case 'conversions':
              dataPoint[metric] = account.metrics.conversions / 100
              break
            case 'cpl':
              dataPoint[metric] = account.metrics.costPerConversion
              break
            case 'roi':
              dataPoint[metric] = account.metrics.roi
              break
          }
        })

        return dataPoint
      })
    }
  }, [accounts, selectedMetrics, chartType])

  // Custom tooltip using standardized ChartTooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) {
      return null
    }

    const entries: TooltipEntry[] = payload.map((entry: any) => ({
      name: entry.name || entry.dataKey,
      value: typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value,
      color: entry.color || entry.fill || entry.stroke,
    }))

    return <ChartTooltip title={label} entries={entries} />
  }

  if (accounts.length === 0 || selectedMetrics.length === 0) {
    return (
      <div
        className="h-[400px] flex items-center justify-center backdrop-blur-md rounded-xl border border-white/10"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      >
        <p className="text-white/40 text-center">
          Select platforms, accounts, and metrics to compare
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-md rounded-xl border border-white/10 p-6"
      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
    >
      <ResponsiveContainer width="100%" height={400}>
        {chartType === 'bar' ? (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="name"
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11 }}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map((metric) => (
              <Bar
                key={metric}
                dataKey={metric}
                name={metricLabels[metric]}
                fill={metricColors[metric]}
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        ) : chartType === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis
              dataKey="name"
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11 }}
            />
            <YAxis
              stroke="rgba(255, 255, 255, 0.6)"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {selectedMetrics.map((metric) => (
              <Line
                key={metric}
                type="monotone"
                dataKey={metric}
                name={metricLabels[metric]}
                stroke={metricColors[metric]}
                strokeWidth={2}
                dot={{ fill: metricColors[metric], r: 4 }}
              />
            ))}
          </LineChart>
        ) : (
          <RadarChart data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.1)" />
            <PolarAngleAxis
              dataKey="metric"
              tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 11 }}
            />
            <PolarRadiusAxis tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 10 }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {accounts.map((account, index) => (
              <Radar
                key={account.id}
                name={account.handle}
                dataKey={account.handle}
                stroke={Object.values(metricColors)[index % Object.values(metricColors).length]}
                fill={Object.values(metricColors)[index % Object.values(metricColors).length]}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            ))}
          </RadarChart>
        )}
      </ResponsiveContainer>
    </motion.div>
  )
}
