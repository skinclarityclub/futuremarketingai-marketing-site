/**
 * AI Control Panel Component
 *
 * Main dashboard for AI model management, monitoring, and optimization.
 */

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'
import { SiOpenai, SiGoogle } from 'react-icons/si'
import { HiSparkles } from 'react-icons/hi2'
import { AIModelCard, type AIModel } from './AIModelCard'
import { AIRecommendations } from './AIRecommendations'

export const AIControlPanel: React.FC = () => {
  const aiModels: AIModel[] = useMemo(
    () => [
      {
        id: 'gpt-4',
        name: 'GPT-4',
        icon: <SiOpenai size={32} />,
        status: 'active',
        purpose: 'Advanced content generation & strategy',
        usage: {
          today: 1247,
          limit: 5000,
        },
        performance: {
          speed: 85,
          accuracy: 96,
          cost: 0.03,
        },
        stats: {
          requestsToday: 1247,
          avgResponseTime: '2.3s',
          successRate: 98.5,
        },
        color: '#00D4FF',
      },
      {
        id: 'claude',
        name: 'Claude 3',
        icon: <HiSparkles size={32} />,
        status: 'processing',
        purpose: 'Long-form content & analysis',
        usage: {
          today: 856,
          limit: 3000,
        },
        performance: {
          speed: 90,
          accuracy: 94,
          cost: 0.025,
        },
        stats: {
          requestsToday: 856,
          avgResponseTime: '1.8s',
          successRate: 97.2,
        },
        color: '#B794F4',
      },
      {
        id: 'gemini',
        name: 'Gemini Pro',
        icon: <SiGoogle size={32} />,
        status: 'active',
        purpose: 'Multi-modal content creation',
        usage: {
          today: 523,
          limit: 2000,
        },
        performance: {
          speed: 95,
          accuracy: 92,
          cost: 0.02,
        },
        stats: {
          requestsToday: 523,
          avgResponseTime: '1.5s',
          successRate: 96.8,
        },
        color: '#FFD700',
      },
      {
        id: 'dall-e',
        name: 'DALL-E 3',
        icon: <SiOpenai size={32} />,
        status: 'idle',
        purpose: 'Visual content generation',
        usage: {
          today: 124,
          limit: 500,
        },
        performance: {
          speed: 70,
          accuracy: 89,
          cost: 0.04,
        },
        stats: {
          requestsToday: 124,
          avgResponseTime: '8.2s',
          successRate: 94.5,
        },
        color: '#00FF88',
      },
    ],
    []
  )

  const totalRequests = aiModels.reduce((sum, model) => sum + model.stats.requestsToday, 0)
  const avgSuccessRate =
    aiModels.reduce((sum, model) => sum + model.stats.successRate, 0) / aiModels.length
  const activeModels = aiModels.filter(
    (m) => m.status === 'active' || m.status === 'processing'
  ).length

  return (
    <div className="space-y-8">
      {/* Overview Stats */}
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Active Models</p>
          <p className="text-2xl font-bold text-accent-primary">
            {activeModels}/{aiModels.length}
          </p>
        </div>
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Total Requests</p>
          <p className="text-2xl font-bold text-accent-secondary">
            {totalRequests.toLocaleString()}
          </p>
        </div>
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Avg Success Rate</p>
          <p className="text-2xl font-bold text-success">{avgSuccessRate.toFixed(1)}%</p>
        </div>
        <div
          className="p-4 rounded-xl backdrop-blur-xl border border-white/10"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <p className="text-xs text-white/60 mb-1">Cost Today</p>
          <p className="text-2xl font-bold text-white">$847</p>
        </div>
      </motion.div>

      {/* AI Models Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">AI Models</h3>
          <button className="px-4 py-2 rounded-lg hover:text-white text-sm font-medium transition-all duration-300 border border-white/10">
            Manage Models
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiModels.map((model, index) => (
            <AIModelCard key={model.id} model={model} index={index} />
          ))}
        </div>
      </div>

      {/* AI Recommendations */}
      <AIRecommendations />

      {/* System Insights */}
      <motion.div
        className="p-6 rounded-xl bg-gradient-to-r from-accent-primary/10 to-accent-secondary/10 border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h4 className="text-lg font-semibold text-white mb-2">🎉 AI Performance Optimized</h4>
            <p className="text-sm text-white/70 mb-4">
              Your AI models are running at peak efficiency. Total cost savings this month: $2,341
              (18% reduction). Average response time improved by 23% compared to last month.
            </p>
            <div className="flex gap-3">
              <button className="px-5 py-2 rounded-lg bg-accent-primary hover:bg-accent-primary/80 text-white font-semibold transition-all duration-300 text-sm">
                View Full Report
              </button>
              <button className="px-5 py-2 rounded-lg hover:bg-white/10 text-white font-medium transition-all duration-300 border border-white/20 text-sm">
                Configure Settings
              </button>
            </div>
          </div>
          <div className="text-6xl opacity-20">🤖</div>
        </div>
      </motion.div>
    </div>
  )
}

export default AIControlPanel
