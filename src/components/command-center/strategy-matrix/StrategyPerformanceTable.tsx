import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaArrowUp as TrendingUp,
  FaArrowDown as TrendingDown,
  FaSort as ArrowUpDown,
  FaSortUp as ArrowUp,
  FaSortDown as ArrowDown,
  FaTrophy as Trophy,
  FaUsers as Users,
} from 'react-icons/fa'
import type { Strategy } from './mockStrategyData'

interface StrategyPerformanceTableProps {
  strategies: Strategy[]
  selectedStrategies: string[]
  onStrategySelect: (strategyId: string) => void
}

type SortField = 'name' | 'accounts' | 'reach' | 'engagement' | 'roi' | 'conversions'
type SortDirection = 'asc' | 'desc'

export const StrategyPerformanceTable: React.FC<StrategyPerformanceTableProps> = ({
  strategies,
  selectedStrategies,
  onStrategySelect,
}) => {
  const [sortField, setSortField] = useState<SortField>('roi')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  // Sort strategies
  const sortedStrategies = useMemo(() => {
    return [...strategies].sort((a, b) => {
      let aVal, bVal

      switch (sortField) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'accounts':
          aVal = a.accountCount
          bVal = b.accountCount
          break
        case 'reach':
          aVal = a.avgReach
          bVal = b.avgReach
          break
        case 'engagement':
          aVal = a.avgEngagementRate
          bVal = b.avgEngagementRate
          break
        case 'roi':
          aVal = a.avgROI
          bVal = b.avgROI
          break
        case 'conversions':
          aVal = a.totalConversions
          bVal = b.totalConversions
          break
        default:
          return 0
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      // Type guard: ensure both values are numbers before arithmetic
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      return 0
    })
  }, [strategies, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 opacity-40" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-accent-primary" />
    ) : (
      <ArrowDown className="w-3 h-3 text-accent-primary" />
    )
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  const TrendIndicator = ({ value, inverse = false }: { value: number; inverse?: boolean }) => {
    const isPositive = inverse ? value < 0 : value > 0
    const color = isPositive ? 'text-emerald-400' : 'text-red-400'
    const Icon = isPositive ? TrendingUp : TrendingDown

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="w-3 h-3" />
        <span className="text-xs font-medium">{Math.abs(value)}%</span>
      </div>
    )
  }

  // Find top performer
  const topPerformer = sortedStrategies[0]

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-white mb-4">Performance Comparison</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10">
              <th
                className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center gap-2">
                  Strategy
                  <SortIcon field="name" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                onClick={() => handleSort('accounts')}
              >
                <div className="flex items-center gap-2">
                  Accounts
                  <SortIcon field="accounts" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                onClick={() => handleSort('reach')}
              >
                <div className="flex items-center justify-end gap-2">
                  Avg Reach
                  <SortIcon field="reach" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                onClick={() => handleSort('engagement')}
              >
                <div className="flex items-center justify-end gap-2">
                  Engagement
                  <SortIcon field="engagement" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                onClick={() => handleSort('conversions')}
              >
                <div className="flex items-center justify-end gap-2">
                  Conversions
                  <SortIcon field="conversions" />
                </div>
              </th>
              <th
                className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                onClick={() => handleSort('roi')}
              >
                <div className="flex items-center justify-end gap-2">
                  ROI
                  <SortIcon field="roi" />
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider">
                Top Performer
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedStrategies.map((strategy, index) => {
              const isSelected = selectedStrategies.includes(strategy.id)
              const isTopPerformer = strategy.id === topPerformer.id

              return (
                <motion.tr
                  key={strategy.id}
                  className={`
                    border-b border-white/5 cursor-pointer transition-all duration-200
                    ${isSelected ? '' : 'hover:'}
                  `}
                  onClick={() => onStrategySelect(strategy.id)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: strategy.color }}
                      />
                      <span className="font-medium text-white">{strategy.name}</span>
                      {isTopPerformer && <Trophy className="w-4 h-4 text-amber-400" />}
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-white/40" />
                      <span className="text-white/80">{strategy.accountCount}</span>
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-white font-medium">
                        {formatNumber(strategy.avgReach)}
                      </span>
                      <TrendIndicator value={strategy.trend.reach} />
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-white font-medium">{strategy.avgEngagementRate}%</span>
                      <TrendIndicator value={strategy.trend.engagement} />
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-white font-medium">
                        {formatNumber(strategy.totalConversions)}
                      </span>
                      <TrendIndicator value={strategy.trend.conversions} />
                    </div>
                  </td>

                  <td className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-emerald-400 font-bold text-lg">
                        +{strategy.avgROI}%
                      </span>
                      <TrendIndicator value={strategy.trend.roi} />
                    </div>
                  </td>

                  <td className="px-4 py-4">
                    <span className="text-white/60 text-sm">{strategy.topPerformer}</span>
                  </td>
                </motion.tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
