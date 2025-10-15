import React from 'react'
import { motion } from 'framer-motion'
import { FaCheckCircle as CheckCircle2, FaUsers as Users } from 'react-icons/fa'
import type { Strategy } from './mockStrategyData'

interface StrategyCategoriesProps {
  strategies: Strategy[]
  selectedStrategies: string[]
  onStrategyToggle: (strategyId: string) => void
}

export const StrategyCategories: React.FC<StrategyCategoriesProps> = ({
  strategies,
  selectedStrategies,
  onStrategyToggle,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Strategy Categories</h3>

      <div className="flex flex-wrap gap-3">
        {strategies.map((strategy) => {
          const isSelected = selectedStrategies.includes(strategy.id)

          return (
            <motion.button
              key={strategy.id}
              onClick={() => onStrategyToggle(strategy.id)}
              className={`
                group relative px-6 py-3 rounded-xl
                backdrop-blur-md border-2 transition-all duration-300
                flex items-center gap-3
                ${
                  isSelected
                    ? 'border-white/40 shadow-lg shadow-white/10'
                    : 'border-white/10 hover:border-white/30'
                }
              `}
              style={{
                borderColor: isSelected ? strategy.color : undefined,
                boxShadow: isSelected ? `0 0 20px ${strategy.color}40` : undefined,
              }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Color Indicator */}
              <motion.div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: strategy.color }}
                animate={{
                  boxShadow: isSelected
                    ? `0 0 12px ${strategy.color}`
                    : `0 0 0px ${strategy.color}`,
                }}
              />

              {/* Strategy Name */}
              <span className="font-medium text-white text-sm">{strategy.name}</span>

              {/* Account Count */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-md">
                <Users className="w-3 h-3 text-white/60" />
                <span className="text-xs text-white/80 font-medium">{strategy.accountCount}</span>
              </div>

              {/* Selected Indicator */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                >
                  <CheckCircle2 className="w-4 h-4" style={{ color: strategy.color }} />
                </motion.div>
              )}

              {/* Glow Effect on Hover */}
              <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none"
                style={{
                  background: `radial-gradient(circle at center, ${strategy.color}20 0%, transparent 70%)`,
                }}
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>
          )
        })}
      </div>

      {/* Selected Count */}
      {selectedStrategies.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 text-sm text-white/60"
        >
          {selectedStrategies.length === 1
            ? '1 strategy'
            : `${selectedStrategies.length} strategies`}{' '}
          selected for comparison
        </motion.div>
      )}
    </div>
  )
}
