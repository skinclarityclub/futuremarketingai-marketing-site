import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaRobot,
  FaChartLine,
  FaPenFancy,
  FaCheckCircle,
  FaPaperPlane,
  FaArrowLeft,
  FaEllipsisV,
} from 'react-icons/fa'

// Agent Types
type AgentType = 'strategy' | 'campaign' | 'content' | 'approval'

interface Agent {
  id: AgentType
  name: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
  avatar: string
}

const AGENTS: Agent[] = [
  {
    id: 'strategy',
    name: 'Strategy Advisor',
    icon: FaChartLine,
    color: 'from-blue-500 to-cyan-500',
    description: 'Market insights & strategy planning',
    avatar: '📊',
  },
  {
    id: 'campaign',
    name: 'Campaign Manager',
    icon: FaRobot,
    color: 'from-indigo-500 to-violet-500',
    description: 'Campaign planning & optimization',
    avatar: '🎯',
  },
  {
    id: 'content',
    name: 'Content Creator',
    icon: FaPenFancy,
    color: 'from-pink-500 to-rose-500',
    description: 'Content generation & editing',
    avatar: '✍️',
  },
  {
    id: 'approval',
    name: 'Quick Approvals',
    icon: FaCheckCircle,
    color: 'from-emerald-500 to-green-500',
    description: 'Fast approve/reject actions',
    avatar: '✅',
  },
]

// Mock Conversations
const MOCK_CONVERSATIONS: Record<AgentType, any[]> = {
  strategy: [
    {
      type: 'agent',
      text: 'Hallo! Ik ben je Strategy Advisor. Waar kan ik je mee helpen?',
      time: '14:32',
    },
    {
      type: 'user',
      text: 'Wat zijn de trends voor Q1 2025?',
      time: '14:33',
    },
    {
      type: 'agent',
      text: 'Op basis van recente data zie ik 3 belangrijke trends:\n\n📈 Video content groei +45%\n🎯 AI-personalisatie essentieel\n💬 Interactive content stijgt\n\nZal ik een gedetailleerde strategie opstellen?',
      time: '14:33',
    },
    {
      type: 'user',
      text: 'Ja graag!',
      time: '14:34',
    },
    {
      type: 'agent',
      text: '✅ Strategie document wordt gegenereerd...\n\nIk stuur het over 2 minuten naar je dashboard!',
      time: '14:34',
    },
  ],
  campaign: [
    {
      type: 'agent',
      text: '🎯 Campaign Manager hier! Ik help je met campagne planning.',
      time: '10:15',
    },
    {
      type: 'user',
      text: 'Start een nieuwe LinkedIn campagne voor product launch',
      time: '10:16',
    },
    {
      type: 'agent',
      text: 'Perfect! Ik stel een campagne op:\n\n🎯 Platform: LinkedIn\n📅 Duur: 4 weken\n💰 Budget: €5.000\n🎨 Content: 12 posts + 3 videos\n\nZal ik deze campagne aanmaken?',
      time: '10:16',
    },
    {
      type: 'user',
      text: 'Ja, start maar!',
      time: '10:17',
    },
    {
      type: 'agent',
      text: '✅ Campagne gestart!\n\n📊 Dashboard: futuremarketing.ai/campaigns\n📈 Live stats beschikbaar\n🔔 Ik stuur updates zodra metrics binnenkomen',
      time: '10:17',
    },
  ],
  content: [
    {
      type: 'agent',
      text: '✍️ Content Creator ready! Wat wil je maken?',
      time: '15:20',
    },
    {
      type: 'user',
      text: 'Schrijf een LinkedIn post over AI in marketing',
      time: '15:21',
    },
    {
      type: 'agent',
      text: '📝 Content draft:\n\n"🤖 AI revolutioneert marketing!\n\nWaar we vroeger dagen besteedden aan campagnes, doen we nu in uren. De toekomst is autonoom.\n\n3 game-changers:\n✅ Predictive analytics\n✅ Hyper-personalisatie  \n✅ Real-time optimalisatie\n\nKlaar voor de AI-revolutie? 🚀"\n\nWil je aanpassingen?',
      time: '15:21',
    },
  ],
  approval: [
    {
      type: 'agent',
      text: '📝 Nieuwe content wacht op approval',
      time: '09:45',
    },
    {
      type: 'approval-card',
      content: {
        title: 'Instagram Story - Product Launch',
        preview: '🚀 Nieuwe feature live! Check het uit...',
        platform: 'Instagram',
        scheduledFor: 'Today, 14:00',
      },
      time: '09:45',
    },
    {
      type: 'agent',
      text: 'Gebruik de knoppen hieronder om snel te reageren! 👇',
      time: '09:45',
    },
  ],
}

interface TelegramMockupProps {
  initialAgent?: AgentType
  onClose?: () => void
  showInModal?: boolean
}

export const TelegramMockup: React.FC<TelegramMockupProps> = ({
  initialAgent = 'approval',
  onClose,
  showInModal = false,
}) => {
  const [activeAgent, setActiveAgent] = useState<AgentType>(initialAgent)
  const [inputValue, setInputValue] = useState('')

  const currentAgent = AGENTS.find((a) => a.id === activeAgent)!
  const messages = MOCK_CONVERSATIONS[activeAgent]

  return (
    <div
      className={`
        ${showInModal ? 'w-full max-w-md mx-auto' : ''}
        bg-gradient-to-br from-gray-800 to-gray-900 
        rounded-3xl shadow-2xl overflow-hidden
        border border-white/10
      `}
    >
      {/* Phone Notch */}
      <div className="h-8 bg-black flex items-center justify-center">
        <div className="w-32 h-6 bg-black rounded-b-2xl" />
      </div>

      {/* Telegram Header */}
      <div className={`bg-gradient-to-r ${currentAgent.color} p-4 flex items-center gap-3`}>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:rounded-full transition-colors">
            <FaArrowLeft className="w-5 h-5 text-white" />
          </button>
        )}

        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">
          {currentAgent.avatar}
        </div>

        <div className="flex-1">
          <h3 className="text-white font-semibold">{currentAgent.name}</h3>
          <p className="text-white/80 text-sm">{currentAgent.description}</p>
        </div>

        <button className="p-2 hover:rounded-full transition-colors">
          <FaEllipsisV className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Agent Switcher */}
      <div
        className="border-b border-white/10 p-2 flex gap-2 overflow-x-auto"
        style={{ background: 'rgba(0, 0, 0, 0.4)' }}
      >
        {AGENTS.map((agent) => (
          <motion.button
            key={agent.id}
            onClick={() => setActiveAgent(agent.id)}
            className={`
              flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap
              transition-all duration-300
              ${
                activeAgent === agent.id
                  ? 'bg-gradient-to-r ' + agent.color + ' text-white shadow-lg'
                  : 'text-white/60 hover:'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <agent.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{agent.name.split(' ')[0]}</span>
          </motion.button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="h-96 bg-[#0e1621] p-4 overflow-y-auto space-y-3">
        <AnimatePresence mode="wait">
          {messages.map((message, index) => (
            <motion.div
              key={`${activeAgent}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              {message.type === 'agent' && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {currentAgent.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#1e2936] rounded-2xl rounded-tl-none p-3 max-w-[80%]">
                      <p className="text-white text-sm whitespace-pre-line">{message.text}</p>
                    </div>
                    <span className="text-xs text-white/40 mt-1 block">{message.time}</span>
                  </div>
                </div>
              )}

              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="max-w-[80%]">
                    <div className="bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl rounded-tr-none p-3">
                      <p className="text-white text-sm">{message.text}</p>
                    </div>
                    <span className="text-xs text-white/40 mt-1 block text-right">
                      {message.time}
                    </span>
                  </div>
                </div>
              )}

              {message.type === 'approval-card' && (
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                    {currentAgent.avatar}
                  </div>
                  <div className="flex-1">
                    <div className="bg-[#1e2936] rounded-2xl p-4 border border-emerald-500/30">
                      <h4 className="text-white font-semibold mb-2">{message.content.title}</h4>
                      <p className="text-white/70 text-sm mb-3">{message.content.preview}</p>
                      <div className="flex gap-2 text-xs text-white/50 mb-4">
                        <span>📱 {message.content.platform}</span>
                        <span>•</span>
                        <span>🕐 {message.content.scheduledFor}</span>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          ✅ Approve
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                        >
                          ❌ Reject
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="hover:bg-white/10 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                          ✏️
                        </motion.button>
                      </div>
                    </div>
                    <span className="text-xs text-white/40 mt-1 block">{message.time}</span>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Input Area */}
      <div
        className="p-3 flex gap-2 items-center border-t border-white/10"
        style={{ background: 'rgba(0, 0, 0, 0.4)' }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Message ${currentAgent.name}...`}
          className="flex-1 text-white placeholder-white/40 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-white"
        >
          <FaPaperPlane className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}
