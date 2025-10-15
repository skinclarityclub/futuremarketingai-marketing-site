import React from 'react'
import { motion } from 'framer-motion'
import {
  FaEye as Eye,
  FaHeart as Heart,
  FaMousePointer as MousePointer,
  FaShoppingCart as ShoppingCart,
  FaDollarSign as DollarSign,
  FaChartLine as TrendingUp,
  FaChartBar as BarChart3,
  FaChartLine as LineChart,
  FaChartPie as PieChart,
  FaCheckCircle as CheckCircle2,
} from 'react-icons/fa'

export type MetricType = 'reach' | 'engagement' | 'clicks' | 'conversions' | 'cpl' | 'roi'
export type ChartType = 'bar' | 'line' | 'radar'

interface MetricsChartSelectorProps {
  availableMetrics: MetricType[]
  selectedMetrics: MetricType[]
  onMetricToggle: (metric: MetricType) => void

  chartType: ChartType
  onChartTypeChange: (type: ChartType) => void
}

const metricConfig: Record<
  MetricType,
  { icon: React.ComponentType<any>; label: string; color: string }
> = {
  reach: { icon: Eye, label: 'Reach', color: '#6366f1' },
  engagement: { icon: Heart, label: 'Engagement', color: '#ec4899' },
  clicks: { icon: MousePointer, label: 'Clicks', color: '#8b5cf6' },
  conversions: { icon: ShoppingCart, label: 'Conversions', color: '#10b981' },
  cpl: { icon: DollarSign, label: 'Cost Per Lead', color: '#f59e0b' },
  roi: { icon: TrendingUp, label: 'ROI', color: '#14b8a6' },
}

const chartTypeConfig: Record<ChartType, { icon: React.ComponentType<any>; label: string }> = {
  bar: { icon: BarChart3, label: 'Bar Chart' },
  line: { icon: LineChart, label: 'Line Chart' },
  radar: { icon: PieChart, label: 'Radar Chart' },
}

export const MetricsChartSelector: React.FC<MetricsChartSelectorProps> = ({
  availableMetrics,
  selectedMetrics,
  onMetricToggle,
  chartType,
  onChartTypeChange,
}) => {
  return (
    <div className="space-y-6">
      {/* Metrics Selector */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">
          Select Metrics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {availableMetrics.map((metric) => {
            const isSelected = selectedMetrics.includes(metric)
            const config = metricConfig[metric]
            const Icon = config.icon

            return (
              <motion.button
                key={metric}
                onClick={() => onMetricToggle(metric)}
                className={`
                  relative p-3 rounded-lg backdrop-blur-md border
                  transition-all duration-200
                  ${isSelected ? 'border-white/30' : 'border-white/10 hover:bg-white/8'}
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color: isSelected ? config.color : '#fff' }} />
                  <span className="text-sm font-medium text-white">{config.label}</span>
                </div>

                {isSelected && (
                  <motion.div
                    className="absolute top-2 right-2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* Chart Type Selector */}
      <div>
        <h3 className="text-sm font-medium text-white/60 mb-3 uppercase tracking-wider">
          Chart Type
        </h3>
        <div className="flex gap-2">
          {(Object.keys(chartTypeConfig) as ChartType[]).map((type) => {
            const isSelected = chartType === type
            const config = chartTypeConfig[type]
            const Icon = config.icon

            return (
              <motion.button
                key={type}
                onClick={() => onChartTypeChange(type)}
                className={`
                  flex-1 p-3 rounded-lg backdrop-blur-md border-2
                  transition-all duration-200 flex flex-col items-center gap-2
                  ${
                    isSelected
                      ? 'bg-accent-primary/20 border-accent-primary'
                      : 'border-white/10 hover:border-white/20'
                  }
                `}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon
                  className={`w-5 h-5 ${isSelected ? 'text-accent-primary' : 'text-white/60'}`}
                />
                <span
                  className={`text-xs font-medium ${isSelected ? 'text-accent-primary' : 'text-white/80'}`}
                >
                  {config.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
