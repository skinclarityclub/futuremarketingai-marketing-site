import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'
import type { Strategy } from './mockStrategyData'
import { ChartTooltip } from '../../common/ChartTooltip'
import type { TooltipEntry } from '../../common/ChartTooltip'

interface StrategyComparisonChartProps {
  strategies: Strategy[]
  selectedStrategies: string[]
}

export const StrategyComparisonChart: React.FC<StrategyComparisonChartProps> = ({
  strategies,
  selectedStrategies,
}) => {
  // Filter to show only selected strategies, or all if none selected
  const displayStrategies = useMemo(() => {
    if (selectedStrategies.length === 0) {
      return strategies
    }
    return strategies.filter((s) => selectedStrategies.includes(s.id))
  }, [strategies, selectedStrategies])

  // Prepare data for radar chart
  const chartData = useMemo(() => {
    // Normalize metrics to 0-100 scale for fair comparison
    const maxReach = Math.max(...strategies.map((s) => s.avgReach))
    const maxEngagement = Math.max(...strategies.map((s) => s.avgEngagementRate))
    const maxConversions = Math.max(...strategies.map((s) => s.totalConversions))
    const maxROI = Math.max(...strategies.map((s) => s.avgROI))
    const maxCTR = Math.max(...strategies.map((s) => s.avgCTR))

    return [
      {
        metric: 'Reach',
        fullMark: 100,
        ...displayStrategies.reduce(
          (acc, s) => ({
            ...acc,
            [s.id]: (s.avgReach / maxReach) * 100,
          }),
          {}
        ),
      },
      {
        metric: 'Engagement',
        fullMark: 100,
        ...displayStrategies.reduce(
          (acc, s) => ({
            ...acc,
            [s.id]: (s.avgEngagementRate / maxEngagement) * 100,
          }),
          {}
        ),
      },
      {
        metric: 'Conversions',
        fullMark: 100,
        ...displayStrategies.reduce(
          (acc, s) => ({
            ...acc,
            [s.id]: (s.totalConversions / maxConversions) * 100,
          }),
          {}
        ),
      },
      {
        metric: 'ROI',
        fullMark: 100,
        ...displayStrategies.reduce(
          (acc, s) => ({
            ...acc,
            [s.id]: (s.avgROI / maxROI) * 100,
          }),
          {}
        ),
      },
      {
        metric: 'CTR',
        fullMark: 100,
        ...displayStrategies.reduce(
          (acc, s) => ({
            ...acc,
            [s.id]: (s.avgCTR / maxCTR) * 100,
          }),
          {}
        ),
      },
    ]
  }, [strategies, displayStrategies])

  // Custom tooltip using standardized ChartTooltip component
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) {
      return null
    }

    const metric = payload[0].payload.metric

    const entries: TooltipEntry[] = payload
      .map((entry: any) => {
        const strategy = displayStrategies.find((s) => s.id === entry.dataKey)
        return {
          name: strategy?.name || entry.dataKey,
          value: entry.value.toFixed(1),
          color: strategy?.color || entry.color || '#888',
        }
      })
      .filter(Boolean)

    return <ChartTooltip title={metric} entries={entries} />
  }

  // Custom legend
  const CustomLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        {payload.map((entry: any, index: number) => {
          const strategy = displayStrategies.find((s) => s.id === entry.value)
          if (!strategy) {
            return null
          }

          return (
            <div key={index} className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: strategy.color }} />
              <span className="text-white/80 text-sm">{strategy.name}</span>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">Multi-Metric Comparison</h3>

      <div
        className="backdrop-blur-md rounded-xl border border-white/10 p-6"
        style={{
          background:
            'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
        }}
      >
        {displayStrategies.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={chartData}>
              <PolarGrid stroke="rgba(255, 255, 255, 0.1)" strokeWidth={1} />
              <PolarAngleAxis
                dataKey="metric"
                tick={{ fill: 'rgba(255, 255, 255, 0.6)', fontSize: 12 }}
                tickLine={false}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: 'rgba(255, 255, 255, 0.4)', fontSize: 10 }}
                axisLine={false}
              />

              {displayStrategies.map((strategy, index) => (
                <Radar
                  key={strategy.id}
                  name={strategy.name}
                  dataKey={strategy.id}
                  stroke={strategy.color}
                  fill={strategy.color}
                  fillOpacity={0.15}
                  strokeWidth={2}
                  dot={{
                    fill: strategy.color,
                    r: 4,
                    strokeWidth: 0,
                  }}
                  animationBegin={index * 100}
                  animationDuration={800}
                />
              ))}

              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
            </RadarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[400px] flex items-center justify-center">
            <p className="text-white/40 text-center">
              Select strategies to compare their performance across metrics
            </p>
          </div>
        )}
      </div>

      {/* Metric Explanations */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { label: 'Reach', desc: 'Total audience reached' },
          { label: 'Engagement', desc: 'Interaction rate %' },
          { label: 'Conversions', desc: 'Total conversions' },
          { label: 'ROI', desc: 'Return on investment' },
          { label: 'CTR', desc: 'Click-through rate' },
        ].map((item, index) => (
          <motion.div
            key={item.label}
            className="backdrop-blur-md rounded-lg p-3 border border-white/10"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.05 }}
          >
            <p className="text-white font-medium text-sm mb-1">{item.label}</p>
            <p className="text-white/50 text-xs">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
