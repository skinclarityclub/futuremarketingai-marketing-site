import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaChartLine,
  FaRobot,
  FaPenFancy,
  FaCheckCircle,
  FaTelegram,
  FaLightbulb,
  FaRocket,
  FaBolt,
} from 'react-icons/fa'
import { TelegramMockup } from '../../telegram'
import { GlassCard } from '../../common'

type AgentType = 'strategy' | 'campaign' | 'content' | 'approval'

const AGENTS = [
  {
    id: 'strategy' as AgentType,
    name: 'Strategy Advisor',
    icon: FaChartLine,
    color: 'from-blue-500 to-cyan-500',
    description: 'Market insights & strategie planning',
    avatar: '📊',
    features: [
      'Real-time markt analyse',
      'Concurrentie monitoring',
      'Trend voorspelling',
      'Strategie aanbevelingen',
    ],
    useCases: [
      'Wat zijn de trends voor Q1 2025?',
      'Analyseer mijn concurrentie',
      'Stel een growth strategie op',
    ],
  },
  {
    id: 'campaign' as AgentType,
    name: 'Campaign Manager',
    icon: FaRobot,
    color: 'from-indigo-500 to-violet-500',
    description: 'Campaign planning & optimization',
    avatar: '🎯',
    features: [
      'Automatische campagne setup',
      'Budget optimalisatie',
      'A/B testing',
      'Performance tracking',
    ],
    useCases: [
      'Start een LinkedIn campagne',
      'Optimaliseer mijn advertising budget',
      'Analyseer campagne performance',
    ],
  },
  {
    id: 'content' as AgentType,
    name: 'Content Creator',
    icon: FaPenFancy,
    color: 'from-pink-500 to-rose-500',
    description: 'Content generation & editing',
    avatar: '✍️',
    features: [
      'AI content generation',
      'Multi-platform aanpassing',
      'Tone-of-voice matching',
      'SEO optimalisatie',
    ],
    useCases: [
      'Schrijf een LinkedIn post over AI',
      'Maak Instagram captions',
      'Genereer blog content',
    ],
  },
  {
    id: 'approval' as AgentType,
    name: 'Quick Approvals',
    icon: FaCheckCircle,
    color: 'from-emerald-500 to-green-500',
    description: 'Fast approve/reject actions',
    avatar: '✅',
    features: ['Instant approvals', 'Bulk actions', 'Smart notifications', 'Approval analytics'],
    useCases: [
      'Approve wachtende content',
      'Reject campagne voorstellen',
      'Edit en re-submit content',
    ],
  },
]

export const AIAssistantsShowcase: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('strategy')

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', duration: 0.6 }}
          className="inline-block mb-6"
        >
          <motion.div
            whileHover={{ rotate: [0, -5, 5, -5, 0], scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-blue-400 via-blue-500 to-cyan-500 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/50"
          >
            <FaTelegram className="w-14 h-14 text-white" />
          </motion.div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold gradient-text mb-4"
        >
          Telegram AI Assistants
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-xl text-white/80 max-w-2xl mx-auto mb-6 leading-relaxed"
        >
          4 gespecialiseerde AI agents die je helpen met strategie, campagnes, content en approvals.
          <br />
          <span className="text-blue-400 font-semibold">
            Altijd en overal bereikbaar via Telegram.
          </span>
        </motion.p>

        {/* Key Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-3 mt-8"
        >
          {[
            {
              icon: FaBolt,
              color: 'text-yellow-400',
              bg: 'bg-yellow-400/10',
              label: 'Real-time responses',
            },
            {
              icon: FaTelegram,
              color: 'text-blue-400',
              bg: 'bg-blue-400/10',
              label: 'Telegram integratie',
            },
            {
              icon: FaRocket,
              color: 'text-indigo-400',
              bg: 'bg-indigo-400/10',
              label: 'Autonoom werkend',
            },
            {
              icon: FaLightbulb,
              color: 'text-emerald-400',
              bg: 'bg-emerald-400/10',
              label: 'Context-aware',
            },
          ].map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <motion.div
                key={benefit.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.08, y: -2 }}
                className={`flex items-center gap-2 px-5 py-2.5 ${benefit.bg} rounded-full border border-white/10 backdrop-blur-sm hover:border-white/30 transition-all duration-300 shadow-lg`}
              >
                <Icon className={`${benefit.color} w-4 h-4`} />
                <span className="text-white/90 font-medium text-sm">{benefit.label}</span>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {AGENTS.map((agent, index) => {
          const Icon = agent.icon
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <GlassCard
                  className={`p-6 cursor-pointer transition-all duration-300 ${
                    selectedAgent === agent.id
                      ? 'ring-2 ring-white/40 shadow-2xl '
                      : 'hover:shadow-xl hover:'
                  }`}
                  onClick={() => setSelectedAgent(agent.id)}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <motion.div
                      className={`w-14 h-14 bg-gradient-to-r ${agent.color} rounded-xl flex items-center justify-center text-2xl shadow-lg flex-shrink-0`}
                      whileHover={{ rotate: 5, scale: 1.1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {agent.avatar}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-1">{agent.name}</h3>
                      <p className="text-white/60 text-sm">{agent.description}</p>
                    </div>
                    <motion.div
                      animate={selectedAgent === agent.id ? { rotate: 360 } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon
                        className={`w-6 h-6 ${selectedAgent === agent.id ? 'text-white' : 'text-white/40'}`}
                      />
                    </motion.div>
                  </div>

                  {/* Features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Features:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {agent.features.map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-white/60">
                          <div className="w-1.5 h-1.5 bg-gradient-to-r from-indigo-400 to-violet-400 rounded-full" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Use Cases */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/80 mb-2">Voorbeelden:</h4>
                    <div className="space-y-1">
                      {agent.useCases.slice(0, 2).map((useCase, i) => (
                        <div key={i} className="text-xs text-white/50 rounded px-2 py-1">
                          💬 "{useCase}"
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {selectedAgent === agent.id && (
                    <motion.div
                      layoutId="selected-agent"
                      className={`mt-4 h-1 bg-gradient-to-r ${agent.color} rounded-full`}
                    />
                  )}
                </GlassCard>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* Live Demo */}
      <GlassCard className="p-8 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-pink-500/10 border-indigo-500/30">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <motion.div
            whileHover={{ rotate: 360, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30"
          >
            <FaTelegram className="w-9 h-9 text-white" />
          </motion.div>
          <div>
            <h3 className="text-3xl font-bold text-white mb-1">Live Demo</h3>
            <p className="text-white/70">Test alle agents in real-time Telegram interface</p>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Telegram Mockup */}
          <div className="w-full lg:w-1/2 mx-auto">
            <TelegramMockup initialAgent={selectedAgent} showInModal={false} />
          </div>

          {/* Info Panel */}
          <div className="w-full lg:w-1/2 space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Hoe het werkt:</h4>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-indigo-400 font-bold">
                    1
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Stuur een bericht</h5>
                    <p className="text-sm text-white/60">
                      Chat met de AI via Telegram, net als met een collega
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-violet-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-violet-400 font-bold">
                    2
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Smart Routing</h5>
                    <p className="text-sm text-white/60">
                      AI bepaalt automatisch welke agent je vraag moet beantwoorden
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-pink-400 font-bold">
                    3
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Instant Response</h5>
                    <p className="text-sm text-white/60">
                      Krijg binnen seconden een expert antwoord met acties
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0 text-emerald-400 font-bold">
                    4
                  </div>
                  <div>
                    <h5 className="font-medium text-white">Autonomous Execution</h5>
                    <p className="text-sm text-white/60">
                      AI voert taken automatisch uit en rapporteert terug
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Technical Integration */}
            <div className="rounded-lg p-4 border border-white/10">
              <h4 className="text-sm font-semibold text-white/80 mb-2">🔧 Technische Integratie</h4>
              <p className="text-xs text-white/60 mb-3">
                Volledig geïntegreerd met n8n workflows voor real-time AI processing:
              </p>
              <div className="space-y-1 text-xs text-white/50">
                <div>📱 Telegram Bot API</div>
                <div>🔗 n8n Webhook Nodes</div>
                <div>🤖 OpenAI/Claude API's</div>
                <div>💾 PostgreSQL/Supabase</div>
                <div>⚡ Real-time updates</div>
              </div>
            </div>

            {/* CTA */}
            <motion.a
              href="https://calendly.com/futuremarketing-ai/demo"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
                <div className="relative px-6 py-4 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-300 flex items-center justify-center gap-3">
                  <FaTelegram className="w-5 h-5" />
                  <span>Plan een demo call</span>
                  <FaRocket className="w-4 h-4" />
                </div>
              </div>
            </motion.a>
          </div>
        </div>
      </GlassCard>

      {/* Bottom Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '4', label: 'Specialist Agents', color: 'text-indigo-400', icon: '🤖' },
          { value: '24/7', label: 'Beschikbaar', color: 'text-violet-400', icon: '⚡' },
          { value: '<2s', label: 'Response Time', color: 'text-pink-400', icon: '🚀' },
          { value: '100%', label: 'Autonoom', color: 'text-emerald-400', icon: '✨' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div whileHover={{ y: -4, scale: 1.05 }} transition={{ duration: 0.2 }}>
              <GlassCard className="p-6 text-center border-white/10 hover:border-white/20 transition-all duration-300">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1, type: 'spring' }}
                  className="text-3xl mb-2"
                >
                  {stat.icon}
                </motion.div>
                <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                <div className="text-sm text-white/60 font-medium">{stat.label}</div>
              </GlassCard>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
