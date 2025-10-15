/**
 * Achievement Card Component
 *
 * Celebrates user milestones with confetti and animation
 */

import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface AchievementCardProps {
  title: string
  description: string
  icon: string
  points?: number
}

export default function AchievementCard({
  title,
  description,
  icon,
  points,
}: AchievementCardProps) {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
      }}
      className="
        relative
        bg-gradient-to-br from-purple-500 to-pink-500
        rounded-2xl
        p-6
        text-white
        shadow-2xl shadow-purple-500/50
        overflow-hidden
      "
    >
      {/* Background sparkles */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 animate-pulse">
          <Sparkles size={24} />
        </div>
        <div className="absolute bottom-4 left-4 animate-pulse delay-75">
          <Sparkles size={16} />
        </div>
        <div className="absolute top-1/2 left-1/2 animate-pulse delay-150">
          <Sparkles size={20} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Icon */}
        <motion.div
          animate={{
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.5,
            repeat: 2,
            repeatDelay: 0.5,
          }}
          className="text-5xl flex-shrink-0"
        >
          {icon}
        </motion.div>

        {/* Text */}
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className="text-sm text-white/90">{description}</p>
        </div>

        {/* Points badge */}
        {points && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="
              flex-shrink-0
              bg-white/20
              backdrop-blur-sm
              px-3 py-2
              rounded-xl
              text-center
            "
          >
            <div className="text-2xl font-bold">+{points}</div>
            <div className="text-xs opacity-90">points</div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
