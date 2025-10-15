/**
 * Features Overview Section
 *
 * Comprehensive showcase of platform capabilities with benefits and use cases.
 * Based on the 6 core AI modules from the demo.
 *
 * @see src/config/platformKnowledge.ts for feature details
 */

import React from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Settings,
  Zap,
  Send,
  BarChart3,
  Target,
  Clock,
  TrendingUp,
  Users,
  Sparkles,
} from 'lucide-react'

/**
 * Core platform features based on the 6 AI modules
 */
export const PLATFORM_FEATURES = [
  {
    icon: Brain,
    name: 'AI Research & Planning',
    tagline: '24/7 market intelligence',
    description:
      'Autonomous AI analyzes trends, competitor activity, and market opportunities around the clock. Never miss a viral trend or emerging topic.',
    benefits: [
      'Saves €6,400/month in research costs',
      '24/7 trend monitoring',
      'Competitor intelligence automation',
      'Content opportunity identification',
    ],
    useCases: [
      'E-commerce: Product launch timing optimization',
      'SaaS: Feature announcement coordination',
      'Agency: Client industry trend reports',
    ],
  },
  {
    icon: Settings,
    name: 'Manager Orchestrator',
    tagline: 'Your AI marketing coordinator',
    description:
      'Central AI brain that coordinates all modules, manages workflows, and ensures seamless execution. Zero manual coordination needed.',
    benefits: [
      'Saves €12,000/month in labor',
      'Eliminates workflow bottlenecks',
      'Automatic priority management',
      'Cross-module synchronization',
    ],
    useCases: [
      'E-commerce: Campaign coordination across channels',
      'SaaS: Product launch orchestration',
      'Agency: Multi-client workflow management',
    ],
  },
  {
    icon: Zap,
    name: 'Content Pipelines',
    tagline: '15x faster content creation',
    description:
      'AI-powered content generation that produces premium-quality content at unprecedented speed while maintaining your brand voice.',
    benefits: [
      'Saves €8,000/month in production',
      '15x content output increase',
      'Consistent brand voice',
      'Multi-format generation (blog, social, ads)',
    ],
    useCases: [
      'E-commerce: Product descriptions & ads at scale',
      'SaaS: Blog posts, case studies, email sequences',
      'Agency: Client content packages',
    ],
  },
  {
    icon: Send,
    name: 'Smart Publishing',
    tagline: '35% better engagement',
    description:
      'Intelligent multi-channel distribution that optimizes timing, platform selection, and messaging for maximum reach and engagement.',
    benefits: [
      '35% engagement improvement',
      '+€15,000/month additional revenue',
      'Optimal timing per platform',
      'Cross-channel synchronization',
    ],
    useCases: [
      'E-commerce: Product promotions across channels',
      'SaaS: Webinar promotion campaigns',
      'Agency: Client social media management',
    ],
  },
  {
    icon: BarChart3,
    name: 'Self-Learning Analytics',
    tagline: '23% monthly improvement',
    description:
      'AI analytics that continuously learn from every campaign, becoming 23% more effective each month through proprietary ML models.',
    benefits: [
      '23% monthly performance gain',
      'Real-time optimization',
      'Predictive insights',
      'Cross-channel attribution',
    ],
    useCases: [
      'E-commerce: Sales funnel optimization',
      'SaaS: Lead conversion tracking',
      'Agency: Client ROI reporting',
    ],
  },
  {
    icon: Target,
    name: 'Ad Automation',
    tagline: '3.2x better ROAS',
    description:
      'Autonomous ad campaign management that continuously optimizes creative, targeting, and budget allocation for maximum return.',
    benefits: [
      '3.2x ROAS improvement',
      '+€45,000/month ad revenue',
      'Creative A/B testing automation',
      'Budget optimization 24/7',
    ],
    useCases: [
      'E-commerce: Dynamic product ads',
      'SaaS: Lead generation campaigns',
      'Agency: Performance marketing at scale',
    ],
  },
] as const

interface FeaturesSectionProps {
  /** Show compact version (fewer details) */
  compact?: boolean
  className?: string
}

/**
 * Features Overview Section Component
 *
 * Displays comprehensive platform capabilities with benefits and use cases.
 */
export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  compact = false,
  className = '',
}) => {
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-4"
          >
            <Sparkles className="w-5 h-5 text-purple-400" />
            <span className="text-sm font-medium text-purple-100">Complete Marketing OS</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold text-white mb-4"
          >
            6 AI Modules, One Autonomous System
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Each module works independently while the Manager Orchestrator ensures perfect
            coordination. The result: a marketing system that runs itself.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PLATFORM_FEATURES.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {/* Icon */}
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <Icon className="w-7 h-7 text-white" />
                </div>

                {/* Title & Tagline */}
                <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                  {feature.name}
                </h3>
                <p className="text-purple-300 font-semibold mb-4">{feature.tagline}</p>

                {/* Description */}
                <p className="text-blue-100 leading-relaxed mb-6">{feature.description}</p>

                {/* Benefits */}
                {!compact && (
                  <>
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-green-400" />
                      Key Benefits
                    </h4>
                    <ul className="space-y-2 mb-6">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="text-sm text-blue-100 flex items-start gap-2">
                          <span className="text-green-400 mt-1">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Use Cases */}
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-400" />
                      Use Cases
                    </h4>
                    <ul className="space-y-2">
                      {feature.useCases.map((useCase) => (
                        <li key={useCase} className="text-xs text-blue-100/80">
                          • {useCase}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Value Stack Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl text-center"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">The Complete Package</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">€26,000</div>
              <div className="text-sm text-blue-100">Monthly savings in tools & labor</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">€60,000</div>
              <div className="text-sm text-blue-100">Additional monthly revenue generated</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-400 mb-2">847%</div>
              <div className="text-sm text-blue-100">Average ROI in 90 days</div>
            </div>
          </div>
          <p className="text-lg text-white font-semibold mb-4">
            At Founding Member pricing (€15,000/month), you get €86,000/month in value
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
            >
              <Clock className="w-5 h-5 mr-2" />
              Try All Modules Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default FeaturesSection
