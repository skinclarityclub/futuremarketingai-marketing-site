/**
 * Typing Indicator
 *
 * Animated indicator showing what the AI assistant is doing
 * - thinking: Processing the request
 * - searching: Looking up information
 * - generating: Creating a response
 */

import { motion } from 'framer-motion'
import { Brain, Search, Sparkles } from 'lucide-react'
import { typingDot } from './styles/animations'
import { glassCard } from './styles/glassmorphism'
import { useChatStore } from '../../stores/chatStore'

export default function TypingIndicator() {
  const { typingActivity } = useChatStore()

  // Determine icon and text based on activity
  const getActivityInfo = () => {
    switch (typingActivity) {
      case 'searching':
        return {
          icon: <Search className="w-4 h-4 animate-spin" />,
          text: 'Informatie opzoeken...',
          color: 'text-blue-400',
        }
      case 'generating':
        return {
          icon: <Sparkles className="w-4 h-4 animate-bounce" />,
          text: 'Antwoord genereren...',
          color: 'text-purple-400',
        }
      case 'thinking':
      default:
        return {
          icon: <Brain className="w-4 h-4 animate-pulse" />,
          text: 'Aan het nadenken...',
          color: 'text-indigo-400',
        }
    }
  }

  const activityInfo = getActivityInfo()

  return (
    <div className="flex gap-3 items-start">
      {/* Avatar */}
      <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
        AI
      </div>

      {/* Typing Animation with Activity Status */}
      <div className={`${glassCard} px-4 py-3`}>
        <div className="flex items-center gap-2" aria-live="polite" aria-label={activityInfo.text}>
          {/* Activity Icon */}
          <span className={activityInfo.color}>{activityInfo.icon}</span>

          {/* Activity Text */}
          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
            {activityInfo.text}
          </span>

          {/* Animated Dots */}
          <div className="flex gap-1 ml-1">
            {[0, 1, 2].map((index) => (
              <motion.div
                key={index}
                variants={typingDot}
                initial="initial"
                animate="animate"
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  animationDelay: `${index * 0.15}s`,
                  background: 'rgba(255, 255, 255, 0.4)',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
