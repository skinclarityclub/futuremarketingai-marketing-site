/**
 * Quick Replies Component
 *
 * Pill-style buttons for quick selection
 *
 * Features:
 * - Special styling for "start_tour" button (hero CTA)
 * - Accessible keyboard navigation
 * - Smooth animations with reduced motion support
 * - Clear visual hierarchy
 */

import { motion, AnimatePresence } from 'framer-motion'
import { LucideIcon, MessageCircle, Calculator, Calendar, Sparkles, HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface QuickReply {
  label: string
  value: string
  icon?: string
}

interface QuickRepliesProps {
  replies: QuickReply[]
  onSelect: (reply: QuickReply) => void
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  message: MessageCircle,
  calculator: Calculator,
  calendar: Calendar,
  sparkles: Sparkles,
  explorer: Sparkles,
  help: HelpCircle,
}

export default function QuickReplies({ replies, onSelect }: QuickRepliesProps) {
  const [selectedValue, setSelectedValue] = useState<string | null>(null)

  const handleSelect = (reply: QuickReply) => {
    setSelectedValue(reply.value)
    // Small delay to show selection animation before hiding
    setTimeout(() => {
      onSelect(reply)
    }, 200)
  }

  // 🎨 Generate unique key based on replies content for smooth transitions
  const repliesKey = replies.map((r) => r.value).join('-')

  if (!replies || replies.length === 0) {
    return null
  }

  return (
    <AnimatePresence mode="wait">
      {!selectedValue && (
        <motion.div
          key={repliesKey} // 🎯 Key ensures smooth transition when replies change
          initial={{ opacity: 0, x: -20, y: 10 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: 20, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1], // Smooth easing curve
          }}
          className="mt-4 p-4 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/30 backdrop-blur-sm"
        >
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-3 uppercase tracking-wider">
            Snelle Acties
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2.5">
            {replies.map((reply, index) => {
              const Icon = reply.icon ? iconMap[reply.icon] : null
              const isTourButton = reply.value === 'start_tour' || reply.value === 'explorer'
              const isPrimary = index === 0 && !isTourButton // First button OR tour button is primary

              return (
                <motion.button
                  key={`${reply.value}-${index}`}
                  onClick={() => handleSelect(reply)}
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    delay: index * 0.08,
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={reply.label}
                  type="button"
                  className={`
                  group
                  ${
                    isTourButton
                      ? `
                      w-full sm:w-auto
                      px-8 py-4
                      bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600
                      hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700
                      text-white
                      shadow-2xl shadow-purple-500/50
                      hover:shadow-purple-500/70
                      rounded-2xl
                      text-base font-bold
                      relative overflow-hidden
                      before:absolute before:inset-0
                      before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0
                      before:translate-x-[-200%] hover:before:translate-x-[200%]
                      before:transition-transform before:duration-700
                    `
                      : isPrimary
                        ? 'px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg'
                        : 'px-6 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 border-blue-200 dark:border-blue-800 shadow-md'
                  }
                  ${!isTourButton ? 'rounded-xl min-w-[180px] sm:min-w-[160px]' : ''}
                  backdrop-blur-sm
                  text-sm font-semibold
                  transition-all duration-300
                  flex items-center justify-center gap-2.5
                  hover:shadow-xl
                  focus:outline-none focus:ring-4 focus:ring-purple-500/50
                `}
                >
                  {Icon && (
                    <Icon
                      size={isTourButton ? 22 : 18}
                      className="group-hover:scale-110 transition-transform duration-200"
                    />
                  )}
                  <span className={isTourButton ? 'text-lg' : ''}>{reply.label}</span>
                  {isTourButton && (
                    <span className="ml-1 text-2xl group-hover:translate-x-1 transition-transform duration-200">
                      🚀
                    </span>
                  )}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
