/**
 * Rich Card Component
 *
 * Displays a rich card with image, title, description, badge, and action buttons
 */

import { motion } from 'framer-motion'
import { LucideIcon, ArrowRight, Sparkles, Crown, AlertCircle, Info } from 'lucide-react'
import type { CardData } from '../../../types/chat'

interface RichCardProps {
  card: CardData
  onAction: (action: string) => void
}

// Icon mapping for card actions
const iconMap: Record<string, LucideIcon> = {
  arrow: ArrowRight,
  sparkles: Sparkles,
  crown: Crown,
  alert: AlertCircle,
  info: Info,
}

// Badge variants (dark mode optimized)
const badgeVariants = {
  success: 'bg-green-500/20 text-green-400 border-green-500/30',
  warning: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  info: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  premium:
    'bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-400 border-purple-500/30',
}

// Button variants (dark mode optimized)
const buttonVariants = {
  primary:
    'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/30',
  secondary:
    'hover:bg-white/10 text-white border border-white/10',
  outline:
    'border-2 border-purple-400 text-purple-400 hover:bg-purple-600 hover:text-white',
}

export default function RichCard({ card, onAction }: RichCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="
        relative
        bg-gray-800
        rounded-2xl
        overflow-hidden
        shadow-xl shadow-black/5
        border border-white/10
        max-w-sm
      "
    >
      {/* Badge */}
      {card.badge && (
        <div className="absolute top-3 right-3 z-10">
          <span
            className={`
            px-3 py-1
            rounded-full
            text-xs font-semibold
            border
            backdrop-blur-sm
            ${badgeVariants[card.badge.variant]}
          `}
          >
            {card.badge.text}
          </span>
        </div>
      )}

      {/* Image or Icon Header */}
      {card.image ? (
        <div className="relative h-40 bg-gradient-to-br from-purple-500/10 to-blue-500/10">
          <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      ) : (
        card.icon && (
          <div className="h-32 bg-gradient-to-br from-purple-500/10 to-blue-500/10 flex items-center justify-center">
            <div className="text-6xl">{card.icon}</div>
          </div>
        )
      )}

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="text-lg font-semibold text-white">{card.title}</h3>

        <p className="text-sm text-gray-400 line-clamp-3">{card.description}</p>

        {/* Actions */}
        <div className="flex flex-col gap-2 pt-2">
          {card.actions.map((action, index) => {
            const Icon = action.icon ? iconMap[action.icon] : null
            const variant = action.variant || 'primary'

            return (
              <motion.button
                key={index}
                onClick={() => onAction(action.action)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`
                  w-full
                  px-4 py-2.5
                  rounded-xl
                  font-medium text-sm
                  transition-all duration-200
                  flex items-center justify-center gap-2
                  ${buttonVariants[variant]}
                `}
              >
                {action.label}
                {Icon && <Icon size={16} />}
              </motion.button>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}
