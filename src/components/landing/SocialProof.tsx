/**
 * Social Proof Section - TRANSPARENT EARLY-STAGE POSITIONING
 *
 * NO FAKE TESTIMONIALS. Uses transparent founding teams + tech credibility.
 * Based on TASK-19-SOCIAL-PROOF-TRANSFORMATION-SUMMARY.md strategy.
 *
 * Strategy:
 * - Transparency > Fake proof
 * - Vision-selling > Past results
 * - Tech credibility > Customer stories
 * - Risk reversal > Social proof
 */

import React from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  Users,
  Rocket,
  Calendar,
  TrendingUp,
  Shield,
  MessageSquare,
  Wrench,
  Award,
} from 'lucide-react'

const GUARANTEE_ICONS = {
  0: Shield,
  1: MessageSquare,
  2: Wrench,
  3: Rocket,
} as const

interface SocialProofProps {
  className?: string
}

/**
 * Social Proof Section - Transparent Early-Stage Positioning
 *
 * Uses REAL founding teams, tech credibility, and risk reversal instead of fake testimonials.
 */
export const SocialProof: React.FC<SocialProofProps> = ({ className = '' }) => {
  const { t } = useTranslation('common')

  const foundingTeams = t('landing.social_proof.founding_teams.teams', {
    returnObjects: true,
  }) as any[]
  const milestones = t('landing.social_proof.milestones.items', { returnObjects: true }) as string[]
  const guarantees = t('landing.social_proof.guarantees.items', { returnObjects: true }) as any[]
  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header - Transparent positioning */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-full mb-4"
          >
            <Rocket className="w-5 h-5 text-blue-400" />
            <span className="text-sm font-medium text-blue-100">
              {t('landing.social_proof.badge')}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            {t('landing.social_proof.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-blue-100 max-w-2xl mx-auto"
          >
            {t('landing.social_proof.subtitle')}
          </motion.p>
        </div>

        {/* Founding Teams Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {foundingTeams.map((team: any, index: number) => {
            const icons = ['🤖', '💄', '🏢']
            return (
              <motion.div
                key={team.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
              >
                {/* Team Icon */}
                <div className="text-6xl mb-4 text-center">{icons[index]}</div>

                {/* Team Info */}
                <h3 className="text-xl font-bold text-white text-center mb-2">{team.name}</h3>
                <p className="text-sm text-blue-200 text-center mb-1">{team.industry}</p>
                <p className="text-xs text-blue-300 text-center mb-4">Team of {team.teamSize}</p>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-xs text-blue-100 mx-auto block w-fit">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  {team.status}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Transparent Messaging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl p-8 mb-16"
        >
          <div className="text-center max-w-3xl mx-auto">
            <Calendar className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-white mb-4">7 Founding Slots Remaining</h3>
            <p className="text-blue-100 leading-relaxed mb-6">
              We're limiting our launch to 10 founding teams total. This isn't artificial
              scarcity—it's a commitment to build this platform right, with deep partnerships, not
              shallow transactions.
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">24 months</div>
                <div className="text-blue-100">Rate lock guarantee</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">€120,000</div>
                <div className="text-blue-100">Saved vs Standard rate</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-white mb-1">Direct access</div>
                <div className="text-blue-100">Founder partnership</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Milestones - Tech Credibility */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-white mb-6 text-center flex items-center justify-center gap-2">
            <Award className="w-7 h-7 text-yellow-400" />
            {t('landing.social_proof.milestones.title')}
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {milestones.map((milestone: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 bg-white/5 border border-white/10 rounded-lg p-4 hover:bg-white/10 transition-all"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-2" />
                <span className="text-blue-100 text-sm">{milestone}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Guarantees - Risk Reversal (Better than fake testimonials) */}
        <div>
          <h3 className="text-2xl font-bold text-white mb-6 text-center">
            {t('landing.social_proof.guarantees.title')}
          </h3>
          <p className="text-center text-blue-100 mb-8 max-w-2xl mx-auto">
            {t('landing.social_proof.guarantees.subtitle')}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((guarantee: any, index: number) => {
              const Icon = GUARANTEE_ICONS[index as keyof typeof GUARANTEE_ICONS]
              return (
                <motion.div
                  key={guarantee.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">{guarantee.title}</h4>
                  <p className="text-sm text-blue-100 mb-3 leading-relaxed">
                    {guarantee.description}
                  </p>
                  <div className="px-3 py-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                    <p className="text-xs font-semibold text-blue-200 text-center">
                      {guarantee.highlight}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA - Transparent messaging */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-xl"
        >
          <h3 className="text-2xl font-bold text-white mb-3">Join the Founding Teams</h3>
          <p className="text-blue-100 mb-2">
            We're building this in partnership with forward-thinking businesses.
          </p>
          <p className="text-sm text-blue-100/70 mb-6">
            Not looking for quick exits—long-term growth partners.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            >
              Try Interactive Demo
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-white/10 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/20 transition-all"
            >
              Book Founder Call
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/**
 * Trust Indicators - Platform Capabilities (not fake metrics)
 */
export const TrustIndicators: React.FC<{ className?: string }> = ({ className = '' }) => {
  const indicators = [
    {
      icon: Users,
      metric: '3/10',
      label: 'Founding Teams',
      description: 'Building together, Q1 2026 launch',
    },
    {
      icon: Rocket,
      metric: '9',
      label: 'AI Agents',
      description: 'Autonomous agents working 24/7',
    },
    {
      icon: TrendingUp,
      metric: '€26k',
      label: 'Tools Replaced',
      description: 'Total monthly value consolidated',
    },
    {
      icon: Award,
      metric: '15+',
      label: 'Years Experience',
      description: 'Team expertise in AI marketing',
    },
  ]

  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 ${className}`}>
      {indicators.map((indicator, index) => {
        const Icon = indicator.icon
        return (
          <motion.div
            key={indicator.label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-3">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">{indicator.metric}</div>
            <div className="text-sm font-semibold text-blue-200 mb-1">{indicator.label}</div>
            <div className="text-xs text-blue-100/70">{indicator.description}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default SocialProof
