import { memo, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Brain, Cpu, Activity, FileCode } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { GlassCard } from '../common/GlassCard'

interface TechnicalShowcaseProps {
  className?: string
}

interface TechStat {
  value: string
  label: string
  icon: React.ReactNode
}

/**
 * TechnicalShowcase - Technical Authority Without Customer Stories
 *
 * Shows HOW it works with real system architecture. Builds credibility through
 * technical transparency, not fake testimonials. Perfect for tech-savvy founders.
 */
export const TechnicalShowcase = memo(function TechnicalShowcase({
  className = '',
}: TechnicalShowcaseProps) {
  const { t } = useTranslation()

  // Check for reduced motion preference
  const prefersReducedMotion = useMemo(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  )

  const techStats: TechStat[] = [
    {
      value: t('technical_showcase.tech_stats.agents.value'),
      label: t('technical_showcase.tech_stats.agents.label'),
      icon: <Brain className="w-5 h-5" />,
    },
    {
      value: t('technical_showcase.tech_stats.models.value'),
      label: t('technical_showcase.tech_stats.models.label'),
      icon: <Cpu className="w-5 h-5" />,
    },
    {
      value: t('technical_showcase.tech_stats.operation.value'),
      label: t('technical_showcase.tech_stats.operation.label'),
      icon: <Activity className="w-5 h-5" />,
    },
  ]

  const agents = [
    {
      name: t('technical_showcase.agents.research.name'),
      status: t('technical_showcase.agents.research.status'),
      color: 'text-green-400',
    },
    {
      name: t('technical_showcase.agents.content.name'),
      status: t('technical_showcase.agents.content.status'),
      color: 'text-green-400',
    },
    {
      name: t('technical_showcase.agents.analytics.name'),
      status: t('technical_showcase.agents.analytics.status'),
      color: 'text-blue-400',
    },
    {
      name: t('technical_showcase.agents.publishing.name'),
      status: t('technical_showcase.agents.publishing.status'),
      color: 'text-green-400',
    },
    {
      name: t('technical_showcase.agents.orchestrator.name'),
      status: t('technical_showcase.agents.orchestrator.status'),
      color: 'text-purple-400',
    },
  ]

  return (
    <div className={`relative ${className}`}>
      {/* Header */}
      <motion.header
        className="text-center mb-12"
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6 }}
      >
        <div className="inline-block px-4 py-2 mb-4 rounded-full bg-accent-secondary/10 border border-accent-secondary/30">
          <span className="text-sm font-semibold text-accent-secondary uppercase tracking-wider">
            {t('technical_showcase.badge')}
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
          {t('technical_showcase.title')}
        </h2>
        <p
          className="text-xl text-white/90 max-w-2xl mx-auto"
          dangerouslySetInnerHTML={{ __html: t('technical_showcase.subtitle') }}
        />
      </motion.header>

      <div className="max-w-6xl mx-auto">
        {/* Architecture Diagram */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <GlassCard className="p-8" glow>
            <div className="flex flex-col items-center">
              {/* Central Core */}
              <div className="relative mb-8">
                <motion.div
                  className="w-32 h-32 rounded-2xl bg-gradient-to-br from-accent-primary to-accent-secondary flex items-center justify-center shadow-2xl"
                  animate={
                    prefersReducedMotion
                      ? {}
                      : {
                          boxShadow: [
                            '0 0 20px rgba(0, 212, 255, 0.3)',
                            '0 0 40px rgba(168, 85, 247, 0.4)',
                            '0 0 20px rgba(0, 212, 255, 0.3)',
                          ],
                        }
                  }
                  transition={
                    prefersReducedMotion
                      ? { duration: 0 }
                      : {
                          duration: 2,
                          repeat: Infinity,
                          repeatType: 'reverse',
                        }
                  }
                  aria-label={t('common:accessibility.ai_core_system')}
                >
                  <Cpu className="w-12 h-12 text-white" aria-hidden="true" />
                </motion.div>
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-sm font-bold text-accent-primary">AI Core</span>
                </div>
              </div>

              {/* Agents Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 w-full mt-8">
                {agents.map((agent, index) => (
                  <motion.div
                    key={agent.name}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={
                      prefersReducedMotion
                        ? { duration: 0 }
                        : { duration: 0.4, delay: 0.3 + index * 0.1 }
                    }
                    className="flex flex-col items-center"
                  >
                    <div
                      className="p-4 rounded-xl border border-white/10 w-full flex flex-col items-center hover:border-accent-primary/30 transition-all"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <div className="relative">
                        <Brain className={`w-6 h-6 ${agent.color}`} aria-hidden="true" />
                        <motion.div
                          className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${
                            agent.status === 'active'
                              ? 'bg-green-400'
                              : agent.status === 'monitoring'
                                ? 'bg-blue-400'
                                : 'bg-purple-400'
                          }`}
                          animate={
                            prefersReducedMotion
                              ? {}
                              : {
                                  scale: [1, 1.2, 1],
                                  opacity: [1, 0.7, 1],
                                }
                          }
                          transition={
                            prefersReducedMotion
                              ? { duration: 0 }
                              : {
                                  duration: 1.5,
                                  repeat: Infinity,
                                  repeatType: 'reverse',
                                }
                          }
                          role="status"
                          aria-label={`${agent.name} is ${agent.status}`}
                        />
                      </div>
                      <span className="text-xs font-semibold text-white/90 mt-2 text-center">
                        {agent.name}
                      </span>
                      <span className="text-xs text-white/60 capitalize mt-1">{agent.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Tech Stats */}
        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8" role="list">
          {techStats.map((stat, index) => (
            <motion.li
              key={stat.label}
              initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={
                prefersReducedMotion ? { duration: 0 } : { duration: 0.4, delay: 0.6 + index * 0.1 }
              }
            >
              <GlassCard className="p-6 text-center hover-lift">
                <div className="flex justify-center mb-3 text-accent-primary" aria-hidden="true">
                  {stat.icon}
                </div>
                <div className="text-4xl font-bold text-text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-white/70">{stat.label}</div>
              </GlassCard>
            </motion.li>
          ))}
        </ul>

        {/* Tech Stack Pills */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 0.8 }}
          className="text-center mb-8"
        >
          <p className="text-sm text-white/70 mb-4">Powered by Industry-Leading AI:</p>
          <div className="flex flex-wrap justify-center gap-3">
            {['OpenAI GPT-4', 'Anthropic Claude', 'Google Gemini', 'Perplexity AI'].map((tech) => (
              <div
                key={tech}
                className="px-4 py-2 rounded-full border border-white/10 text-sm font-semibold text-white/90 hover:border-accent-primary/30 transition-all"
                style={{ background: 'rgba(0, 0, 0, 0.3)' }}
              >
                {tech}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Whitepaper CTA */}
        <motion.div
          initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.6, delay: 1 }}
          className="text-center"
        >
          <GlassCard className="p-6 inline-block">
            <div className="flex items-center gap-4">
              <FileCode className="w-6 h-6 text-accent-primary" />
              <div className="text-left">
                <p className="text-sm font-semibold text-white mb-1">Want to dive deeper?</p>
                <p className="text-xs text-white/70">
                  Download our technical whitepaper (Coming soon)
                </p>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  )
})
