import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { StrategyCategories } from './StrategyCategories'
import { StrategyPerformanceTable } from './StrategyPerformanceTable'
import { StrategyComparisonChart } from './StrategyComparisonChart'
import { StrategyDetailView } from './StrategyDetailView'
import { mockStrategies } from './mockStrategyData'

export const StrategyMatrix: React.FC = () => {
  const [selectedStrategies, setSelectedStrategies] = useState<string[]>([])
  const [detailStrategyId, setDetailStrategyId] = useState<string | null>(null)

  const handleStrategyToggle = (strategyId: string) => {
    setSelectedStrategies((prev) => {
      if (prev.includes(strategyId)) {
        return prev.filter((id) => id !== strategyId)
      } else {
        return [...prev, strategyId]
      }
    })
  }

  const handleStrategySelect = (strategyId: string) => {
    setDetailStrategyId(strategyId)
  }

  const handleCloseDetail = () => {
    setDetailStrategyId(null)
  }

  const detailStrategy = detailStrategyId
    ? mockStrategies.find((s) => s.id === detailStrategyId) || null
    : null

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Strategy Performance Matrix</h2>
        <p className="text-white/60">Compare marketing strategies across key performance metrics</p>
      </div>

      {/* Strategy Categories (Tags for filtering) */}
      <StrategyCategories
        strategies={mockStrategies}
        selectedStrategies={selectedStrategies}
        onStrategyToggle={handleStrategyToggle}
      />

      {/* Comparison Chart */}
      <StrategyComparisonChart
        strategies={mockStrategies}
        selectedStrategies={selectedStrategies}
      />

      {/* Performance Table */}
      <StrategyPerformanceTable
        strategies={mockStrategies}
        selectedStrategies={selectedStrategies}
        onStrategySelect={handleStrategySelect}
      />

      {/* Detail View Modal */}
      {detailStrategy && (
        <StrategyDetailView strategy={detailStrategy} onClose={handleCloseDetail} />
      )}
    </motion.div>
  )
}
