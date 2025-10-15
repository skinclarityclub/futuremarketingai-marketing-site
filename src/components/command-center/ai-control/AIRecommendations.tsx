/**
 * AI Recommendations Component
 *
 * Displays AI-powered optimization recommendations and insights.
 */

import React from 'react'
import { motion } from 'framer-motion'

interface Recommendation {
  id: string
  title: string
  description: string
  impact: 'high' | 'medium' | 'low'
  category: 'performance' | 'cost' | 'quality' | 'strategy'
  icon: string
  actionLabel: string
}

export const AIRecommendations: React.FC = () => {
  const recommendations: Recommendation[] = [
    {
      id: '1',
      title: 'Switch to Claude for Content Creation',
      description:
        'Claude shows 15% better content quality with 12% lower costs for long-form content generation.',
      impact: 'high',
      category: 'cost',
      icon: '💡',
      actionLabel: 'Apply Suggestion',
    },
    {
      id: '2',
      title: 'Optimize GPT-4 Prompt Templates',
      description:
        'Your current prompts could be 23% shorter while maintaining quality, reducing token costs significantly.',
      impact: 'high',
      category: 'performance',
      icon: '⚡',
      actionLabel: 'Review Prompts',
    },
    {
      id: '3',
      title: 'Enable Batch Processing',
      description:
        'Process similar content requests in batches to reduce API calls by 30% and improve speed.',
      impact: 'medium',
      category: 'performance',
      icon: '🔄',
      actionLabel: 'Enable Feature',
    },
    {
      id: '4',
      title: 'Schedule Content During Off-Peak Hours',
      description:
        'AI processing costs are 15% lower between 2 AM - 6 AM. Schedule non-urgent tasks accordingly.',
      impact: 'medium',
      category: 'cost',
      icon: '📅',
      actionLabel: 'Configure Schedule',
    },
    {
      id: '5',
      title: 'Add Content Quality Checks',
      description:
        'Implement automated quality scoring before publishing to improve engagement by ~8%.',
      impact: 'medium',
      category: 'quality',
      icon: '✨',
      actionLabel: 'Setup Checks',
    },
    {
      id: '6',
      title: 'A/B Test AI-Generated Headlines',
      description:
        'Running headline variations could increase click-through rates by 12-18% based on similar campaigns.',
      impact: 'high',
      category: 'strategy',
      icon: '🎯',
      actionLabel: 'Start Test',
    },
  ]

  const getImpactColor = (impact: Recommendation['impact']) => {
    switch (impact) {
      case 'high':
        return '#00FF88'
      case 'medium':
        return '#FFD700'
      case 'low':
        return '#00D4FF'
      default:
        return '#FFFFFF50'
    }
  }

  const getCategoryColor = (category: Recommendation['category']) => {
    switch (category) {
      case 'performance':
        return '#00D4FF'
      case 'cost':
        return '#00FF88'
      case 'quality':
        return '#B794F4'
      case 'strategy':
        return '#FFD700'
      default:
        return '#FFFFFF50'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">AI Recommendations</h3>
          <p className="text-sm text-white/60">
            Optimization suggestions powered by machine learning
          </p>
        </div>
        <div className="px-4 py-2 rounded-full bg-accent-primary/20 text-accent-primary font-semibold text-sm">
          {recommendations.length} Active
        </div>
      </div>

      {/* Recommendations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {recommendations.map((rec, index) => (
          <motion.div
            key={rec.id}
            className="p-5 rounded-xl backdrop-blur-xl border border-white/10 hover:hover:border-white/20 transition-all duration-300 group"
            style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
          >
            {/* Header */}
            <div className="flex items-start gap-3 mb-3">
              <div
                className="text-2xl p-2 rounded-lg"
                style={{ backgroundColor: `${getCategoryColor(rec.category)}20` }}
              >
                {rec.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                </div>
                <p className="text-xs text-white/70">{rec.description}</p>
              </div>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 mb-3">
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${getImpactColor(rec.impact)}20`,
                  color: getImpactColor(rec.impact),
                }}
              >
                {rec.impact.toUpperCase()} IMPACT
              </span>
              <span
                className="text-xs font-medium px-2 py-1 rounded-full"
                style={{
                  backgroundColor: `${getCategoryColor(rec.category)}20`,
                  color: getCategoryColor(rec.category),
                }}
              >
                {rec.category}
              </span>
            </div>

            {/* Action Button */}
            <button className="w-full py-2 px-4 rounded-lg hover:text-white text-sm font-medium transition-all duration-300 border border-white/10 hover:border-white/20 group-hover:bg-accent-primary/20 group-hover:text-accent-primary group-hover:border-accent-primary/30">
              {rec.actionLabel} →
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AIRecommendations
