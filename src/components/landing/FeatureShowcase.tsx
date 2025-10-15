/**
 * FeatureShowcase Component
 * Lightweight 2D alternative to SystemDiagram for landing page
 * Shows key platform capabilities without heavy 3D rendering
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Brain, Crown, Palette, Send, BarChart3, DollarSign, TrendingUp } from 'lucide-react'

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  stat: string
  color: string
}

// Real platform modules from Explorer (src/config/platformKnowledge.ts)
const features: Feature[] = [
  {
    icon: <Brain className="h-8 w-8" />,
    title: 'Research & Planning Intelligence',
    description: 'AI analyzes market trends 24/7 and generates content ideas automatically',
    stat: '€6,400/mo saved',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: <Crown className="h-8 w-8" />,
    title: 'Manager Orchestration Engine',
    description: 'Coordinates all workflows and A/B testing strategies autonomously',
    stat: '€12,000/mo saved',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: 'Content Creation Pipelines',
    description: 'Creates platform-optimized content with AI - 15x output increase',
    stat: '€8,000/mo saved',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: <Send className="h-8 w-8" />,
    title: 'Smart Publishing Layer',
    description: 'Posts at scientifically optimal times with perfect audience targeting',
    stat: '+€15,000/mo revenue',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: <BarChart3 className="h-8 w-8" />,
    title: 'Self-Learning Analytics',
    description: 'Learns from every campaign and continuously improves strategies',
    stat: '23% monthly improvement',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    icon: <DollarSign className="h-8 w-8" />,
    title: 'Automated Ad Campaigns',
    description: 'Converts winning posts to ads with automatic budget optimization',
    stat: '+€45,000/mo revenue',
    color: 'from-yellow-500 to-orange-500',
  },
]

export const FeatureShowcase: React.FC = () => {
  return (
    <div className="relative">
      {/* Background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
      </div>

      {/* Grid of feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.05, y: -5 }}
            className="group relative"
          >
            {/* Card */}
            <div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden">
              {/* Gradient glow on hover */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Content */}
              <div className="relative z-10 space-y-4">
                {/* Icon */}
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${feature.color} text-white shadow-lg`}
                >
                  {feature.icon}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-blue-100/80 leading-relaxed">{feature.description}</p>

                {/* Stat badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <span className="text-xs font-semibold text-blue-300">{feature.stat}</span>
                </div>
              </div>

              {/* Animated corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Total savings callout */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-12 text-center"
      >
        <div className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 backdrop-blur-sm">
          <TrendingUp className="h-6 w-6 text-green-400" />
          <div className="text-left">
            <div className="text-sm text-green-300 font-medium">Total Value</div>
            <div className="text-2xl font-bold text-white">€26,000/month saved</div>
          </div>
        </div>
        <p className="mt-4 text-sm text-blue-200/60">
          Replace 3 full-time marketers + eliminate software subscriptions
        </p>
      </motion.div>
    </div>
  )
}
