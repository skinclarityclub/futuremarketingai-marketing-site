import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaSort as ArrowUpDown,
  FaSortUp as ArrowUp,
  FaSortDown as ArrowDown,
  FaTrophy as Trophy,
  FaCrown as Crown,
  FaUsers as Users,
  FaFlask as TestTube,
  FaArrowUp as TrendingUp,
  FaArrowDown as TrendingDown,
} from 'react-icons/fa'
import { Account } from './mockAccountData'

interface AccountComparisonTableProps {
  accounts: Account[]
  onAccountSelect: (account: Account) => void
  selectedAccountId?: string
}

type SortKey = keyof Account['metrics'] | 'followers' | 'handle'
type SortDirection = 'asc' | 'desc'

export const AccountComparisonTable: React.FC<AccountComparisonTableProps> = ({
  accounts,
  onAccountSelect,
  selectedAccountId,
}) => {
  const [sortKey, setSortKey] = useState<SortKey>('engagementRate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }

  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => {
      let aValue: number
      let bValue: number

      if (sortKey === 'followers' || sortKey === 'handle') {
        aValue = sortKey === 'followers' ? a.followers : 0
        bValue = sortKey === 'followers' ? b.followers : 0
      } else {
        aValue = a.metrics[sortKey] || 0
        bValue = b.metrics[sortKey] || 0
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })
  }, [accounts, sortKey, sortDirection])

  // Find top 3 performers for each metric
  const getTopPerformers = (metric: SortKey): Set<string> => {
    const sorted = [...accounts].sort((a, b) => {
      const aVal =
        metric === 'followers' ? a.followers : a.metrics[metric as keyof Account['metrics']] || 0
      const bVal =
        metric === 'followers' ? b.followers : b.metrics[metric as keyof Account['metrics']] || 0
      return bVal - aVal
    })
    return new Set(sorted.slice(0, 3).map((a) => a.id))
  }

  const formatNumber = (num: number, decimals: number = 0): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toFixed(decimals)
  }

  const formatCurrency = (num: number): string => {
    return '$' + num.toFixed(2)
  }

  const getTypeIcon = (type: Account['type']) => {
    switch (type) {
      case 'main':
        return <Crown className="w-4 h-4 text-amber-400" />
      case 'sub':
        return <Users className="w-4 h-4 text-violet-400" />
      case 'test':
        return <TestTube className="w-4 h-4 text-indigo-400" />
    }
  }

  const getTrendIcon = (account: Account) => {
    const avgTrend = (account.trend.followers + account.trend.engagement + account.trend.reach) / 3
    if (avgTrend > 15) {
      return <TrendingUp className="w-3 h-3 text-emerald-400" />
    } else if (avgTrend < 0) {
      return <TrendingDown className="w-3 h-3 text-rose-400" />
    }
    return null
  }

  const SortButton: React.FC<{ column: SortKey; label: string }> = ({ column, label }) => (
    <button
      onClick={() => handleSort(column)}
      className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors group"
    >
      {label}
      {sortKey === column ? (
        sortDirection === 'asc' ? (
          <ArrowUp className="w-3 h-3" />
        ) : (
          <ArrowDown className="w-3 h-3" />
        )
      ) : (
        <ArrowUpDown className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity" />
      )}
    </button>
  )

  const topEngagement = getTopPerformers('engagementRate')
  const topReach = getTopPerformers('reach')
  const topROI = getTopPerformers('roi')
  const topConversions = getTopPerformers('conversions')

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">Account Comparison</h3>
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Top 3 performers highlighted</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="text-left p-3">
                <SortButton column="handle" label="Account" />
              </th>
              <th className="text-right p-3">
                <SortButton column="followers" label="Followers" />
              </th>
              <th className="text-right p-3">
                <SortButton column="reach" label="Reach" />
              </th>
              <th className="text-right p-3">
                <SortButton column="engagement" label="Engagement" />
              </th>
              <th className="text-right p-3">
                <SortButton column="engagementRate" label="Eng. Rate" />
              </th>
              <th className="text-right p-3">
                <SortButton column="clicks" label="Clicks" />
              </th>
              <th className="text-right p-3">
                <SortButton column="conversions" label="Conversions" />
              </th>
              <th className="text-right p-3">
                <SortButton column="roi" label="ROI" />
              </th>
              <th className="text-right p-3">
                <SortButton column="cpc" label="CPC" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedAccounts.map((account, index) => {
              const isSelected = account.id === selectedAccountId
              const isTopEngagement = topEngagement.has(account.id)
              const isTopReach = topReach.has(account.id)
              const isTopROI = topROI.has(account.id)
              const isTopConversions = topConversions.has(account.id)

              return (
                <motion.tr
                  key={account.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => onAccountSelect(account)}
                  className={`
                    border-b border-slate-800/50 cursor-pointer
                    transition-all duration-200
                    ${
                      isSelected
                        ? 'bg-indigo-500/10 hover:bg-indigo-500/15'
                        : 'hover:bg-slate-800/30'
                    }
                  `}
                >
                  {/* Account */}
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      {getTypeIcon(account.type)}
                      <img
                        src={account.avatar}
                        alt={account.name}
                        className="w-8 h-8 rounded-full border-2 border-violet-500/30"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">{account.handle}</p>
                        <p className="text-xs text-slate-400">{account.role}</p>
                      </div>
                    </div>
                  </td>

                  {/* Followers */}
                  <td className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-sm text-white">{formatNumber(account.followers)}</span>
                      {getTrendIcon(account)}
                    </div>
                  </td>

                  {/* Reach */}
                  <td className="p-3 text-right">
                    <span
                      className={`text-sm ${
                        isTopReach ? 'text-amber-400 font-bold' : 'text-white'
                      }`}
                    >
                      {formatNumber(account.metrics.reach)}
                    </span>
                    {isTopReach && <Trophy className="w-3 h-3 text-amber-400 inline ml-1" />}
                  </td>

                  {/* Engagement */}
                  <td className="p-3 text-right">
                    <span
                      className={`text-sm ${
                        isTopEngagement ? 'text-violet-400 font-bold' : 'text-white'
                      }`}
                    >
                      {formatNumber(account.metrics.engagement)}
                    </span>
                  </td>

                  {/* Engagement Rate */}
                  <td className="p-3 text-right">
                    <span
                      className={`text-sm ${
                        isTopEngagement ? 'text-violet-400 font-bold' : 'text-white'
                      }`}
                    >
                      {account.metrics.engagementRate.toFixed(1)}%
                    </span>
                    {isTopEngagement && <Trophy className="w-3 h-3 text-amber-400 inline ml-1" />}
                  </td>

                  {/* Clicks */}
                  <td className="p-3 text-right">
                    <span className="text-sm text-white">
                      {formatNumber(account.metrics.clicks)}
                    </span>
                  </td>

                  {/* Conversions */}
                  <td className="p-3 text-right">
                    <span
                      className={`text-sm ${
                        isTopConversions ? 'text-emerald-400 font-bold' : 'text-white'
                      }`}
                    >
                      {formatNumber(account.metrics.conversions)}
                    </span>
                    {isTopConversions && <Trophy className="w-3 h-3 text-amber-400 inline ml-1" />}
                  </td>

                  {/* ROI */}
                  <td className="p-3 text-right">
                    <span
                      className={`text-sm ${isTopROI ? 'text-indigo-400 font-bold' : 'text-white'}`}
                    >
                      {account.metrics.roi}%
                    </span>
                    {isTopROI && <Trophy className="w-3 h-3 text-amber-400 inline ml-1" />}
                  </td>

                  {/* CPC */}
                  <td className="p-3 text-right">
                    <span className="text-sm text-white">
                      {formatCurrency(account.metrics.cpc)}
                    </span>
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
