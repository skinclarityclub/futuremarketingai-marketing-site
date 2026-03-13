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
            className="inline-flex items-center gap-2 px-4 py-2 bg-accent-system/10 border border-accent-system/20 rounded-sm mb-4"
          >
            <Rocket className="w-5 h-5 text-accent-system" />
            <span className="text-sm font-medium text-text-secondary">
              {t('landing.social_proof.badge')}
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold text-text-primary mb-4"
          >
            {t('landing.social_proof.title')}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-text-secondary max-w-2xl mx-auto"
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
                className="bg-bg-surface border border-border-primary rounded-sm p-6 hover:bg-bg-elevated hover:border-l-2 hover:border-l-accent-system transition-all"
              >
                {/* Team Icon */}
                <div className="text-6xl mb-4 text-center">{icons[index]}</div>

                {/* Team Info */}
                <h3 className="text-xl font-bold text-text-primary text-center mb-2">
                  {team.name}
                </h3>
                <p className="text-sm text-text-secondary text-center mb-1">{team.industry}</p>
                <p className="text-xs text-text-muted text-center mb-4">Team of {team.teamSize}</p>

                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-system/20 border border-accent-system/30 rounded-sm text-xs text-text-secondary mx-auto block w-fit">
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
          className="bg-bg-surface border border-border-primary rounded-sm p-8 mb-16"
        >
          <div className="text-center max-w-3xl mx-auto">
            <Calendar className="w-12 h-12 text-accent-system mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              {t('landing.social_proof.founding_message.title')}
            </h3>
            <p className="text-text-secondary leading-relaxed mb-6">
              {t('landing.social_proof.founding_message.description')}
            </p>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-bg-elevated rounded-sm p-4">
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {t('landing.social_proof.founding_message.benefits.rate_lock.value')}
                </div>
                <div className="text-text-secondary">
                  {t('landing.social_proof.founding_message.benefits.rate_lock.label')}
                </div>
              </div>
              <div className="bg-bg-elevated rounded-sm p-4">
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {t('landing.social_proof.founding_message.benefits.savings.value')}
                </div>
                <div className="text-text-secondary">
                  {t('landing.social_proof.founding_message.benefits.savings.label')}
                </div>
              </div>
              <div className="bg-bg-elevated rounded-sm p-4">
                <div className="text-2xl font-bold text-text-primary mb-1">
                  {t('landing.social_proof.founding_message.benefits.access.value')}
                </div>
                <div className="text-text-secondary">
                  {t('landing.social_proof.founding_message.benefits.access.label')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Milestones - Tech Credibility */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center flex items-center justify-center gap-2">
            <Award className="w-7 h-7 text-accent-human" />
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
                className="flex items-start gap-3 bg-bg-surface border border-border-primary rounded-sm p-4 hover:bg-bg-elevated transition-all"
              >
                <div className="w-2 h-2 bg-green-400 rounded-full flex-shrink-0 mt-2" />
                <span className="text-text-secondary text-sm">{milestone}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Guarantees - Risk Reversal (Better than fake testimonials) */}
        <div>
          <h3 className="text-2xl font-bold text-text-primary mb-6 text-center">
            {t('landing.social_proof.guarantees.title')}
          </h3>
          <p className="text-center text-text-secondary mb-8 max-w-2xl mx-auto">
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
                  className="bg-bg-surface border border-border-primary rounded-sm p-6 hover:bg-bg-elevated hover:border-l-2 hover:border-l-accent-system transition-all"
                >
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-system rounded-sm mb-4">
                    <Icon className="w-6 h-6 text-bg-deep" />
                  </div>
                  <h4 className="text-lg font-bold text-text-primary mb-2">{guarantee.title}</h4>
                  <p className="text-sm text-text-secondary mb-3 leading-relaxed">
                    {guarantee.description}
                  </p>
                  <div className="px-3 py-2 bg-accent-system/10 border border-accent-system/20 rounded-sm">
                    <p className="text-xs font-semibold text-accent-system text-center">
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
          className="mt-16 text-center p-8 bg-bg-surface border border-border-primary rounded-sm"
        >
          <h3 className="text-2xl font-bold text-text-primary mb-3">
            {t('landing.social_proof.cta.title')}
          </h3>
          <p className="text-text-secondary mb-2">{t('landing.social_proof.cta.subtitle')}</p>
          <p className="text-sm text-text-muted mb-6">{t('landing.social_proof.cta.note')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/demo"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-flow text-bg-deep font-semibold rounded-sm hover:opacity-90 transition-all shadow-lg hover:shadow-xl"
            >
              {t('landing.social_proof.cta.demo_button')}
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-8 py-4 bg-bg-elevated border border-border-primary text-text-primary font-semibold rounded-sm hover:bg-bg-surface transition-all"
            >
              {t('landing.social_proof.cta.contact_button')}
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
      metric: '€39k',
      label: 'Tools Replaced',
      description: 'Verified monthly value consolidated',
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
            className="text-center p-6 bg-bg-surface border border-border-primary rounded-sm hover:bg-bg-elevated transition-all"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-accent-system rounded-sm mb-3">
              <Icon className="w-6 h-6 text-bg-deep" />
            </div>
            <div className="text-3xl font-bold text-text-primary mb-1">{indicator.metric}</div>
            <div className="text-sm font-semibold text-text-secondary mb-1">{indicator.label}</div>
            <div className="text-xs text-text-muted">{indicator.description}</div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default SocialProof
