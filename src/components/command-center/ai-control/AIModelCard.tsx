/**
 * AI Model Card Component
 *
 * Displays information about an AI model including status, usage, and performance.
 */

import React from 'react'
import { motion } from 'framer-motion'

export interface AIModel {
  id: string
  name: string
  icon: React.ReactNode
  status: 'active' | 'idle' | 'offline' | 'processing'
  purpose: string
  usage: {
    today: number
    limit: number
  }
  performance: {
    speed: number // 1-100
    accuracy: number // 1-100
    cost: number // per 1K tokens
  }
  stats: {
    requestsToday: number
    avgResponseTime: string
    successRate: number
  }
  color: string
}

interface AIModelCardProps {
  model: AIModel
  index: number
}

export const AIModelCard: React.FC<AIModelCardProps> = ({ model, index }) => {
  const getStatusColor = () => {
    switch (model.status) {
      case 'active':
        return '#00FF88'
      case 'processing':
        return '#00D4FF'
      case 'idle':
        return '#FFD700'
      case 'offline':
        return '#FF6B6B'
      default:
        return '#FFFFFF50'
    }
  }

  const getStatusText = () => {
    switch (model.status) {
      case 'active':
        return 'Active'
      case 'processing':
        return 'Processing'
      case 'idle':
        return 'Idle'
      case 'offline':
        return 'Offline'
      default:
        return 'Unknown'
    }
  }

  const usagePercentage = (model.usage.today / model.usage.limit) * 100

  return (
    <motion.div
      className="relative p-6 rounded-2xl backdrop-blur-xl border border-white/10 hover:hover:border-white/20 transition-all duration-300 group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      style={{
        background: 'rgba(0, 0, 0, 0.3)',
        boxShadow: `0 4px 20px ${model.color}15`,
      }}
    >
      {/* Status Indicator */}
      <div className="absolute top-4 right-4">
        <div className="relative">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getStatusColor() }} />
          {model.status === 'processing' && (
            <motion.div
              className="absolute inset-0 w-3 h-3 rounded-full"
              style={{ backgroundColor: getStatusColor() }}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}
        </div>
      </div>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div
          className="text-4xl p-3 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: `${model.color}20`, color: model.color }}
        >
          {model.icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{model.name}</h3>
          <p className="text-xs text-white/60 mb-2">{model.purpose}</p>
          <span
            className="text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              backgroundColor: `${getStatusColor()}20`,
              color: getStatusColor(),
            }}
          >
            {getStatusText()}
          </span>
        </div>
      </div>

      {/* Usage Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">Usage Today</span>
          <span className="text-xs font-semibold text-white">
            {model.usage.today.toLocaleString()} / {model.usage.limit.toLocaleString()}
          </span>
        </div>
        <div className="w-full h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: model.color }}
            initial={{ width: 0 }}
            animate={{ width: `${usagePercentage}%` }}
            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
          />
        </div>
        <p className="text-xs text-white/50 mt-1">{usagePercentage.toFixed(0)}% capacity used</p>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg">
          <p className="text-xs text-white/60 mb-1">Speed</p>
          <div className="flex items-center justify-center gap-1">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      i < Math.floor(model.performance.speed / 20)
                        ? model.color
                        : 'rgba(255, 255, 255, 0.1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="text-center p-2 rounded-lg">
          <p className="text-xs text-white/60 mb-1">Accuracy</p>
          <p className="text-sm font-bold" style={{ color: model.color }}>
            {model.performance.accuracy}%
          </p>
        </div>
        <div className="text-center p-2 rounded-lg">
          <p className="text-xs text-white/60 mb-1">Cost</p>
          <p className="text-sm font-bold text-white">${model.performance.cost}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">Requests Today</span>
          <span className="text-xs font-semibold text-white">
            {model.stats.requestsToday.toLocaleString()}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">Avg Response</span>
          <span className="text-xs font-semibold text-white">{model.stats.avgResponseTime}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/60">Success Rate</span>
          <span className="text-xs font-semibold text-success">{model.stats.successRate}%</span>
        </div>
      </div>

      {/* Action Button */}
      <button
        className="w-full mt-4 py-2 rounded-lg font-medium text-sm transition-all duration-300"
        style={{
          backgroundColor: `${model.color}20`,
          color: model.color,
          border: `1px solid ${model.color}40`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = `${model.color}30`
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = `${model.color}20`
        }}
      >
        View Details
      </button>
    </motion.div>
  )
}

export default AIModelCard
