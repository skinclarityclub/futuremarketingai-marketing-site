import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  FaArrowUp as TrendingUp,
  FaArrowDown as TrendingDown,
  FaSort as ArrowUpDown,
  FaSortUp as ArrowUp,
  FaSortDown as ArrowDown,
  FaTrophy as Trophy,
  FaInstagram,
  FaTiktok,
  FaYoutube,
  FaFacebook,
  FaTwitter,
} from 'react-icons/fa'
import type { Account } from '../multi-account-manager/mockAccountData'
import type { MetricType } from './MetricsChartSelector'

interface ComparisonTableProps {
  accounts: Account[]
  selectedMetrics: MetricType[]
}

type SortField = 'name' | 'platform' | MetricType
type SortDirection = 'asc' | 'desc'

const platformIcons = {
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  facebook: FaFacebook,
  twitter: FaTwitter,
}

const platformColors = {
  instagram: '#E4405F',
  tiktok: '#000000',
  youtube: '#FF0000',
  facebook: '#1877F2',
  twitter: '#1DA1F2',
}

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ accounts, selectedMetrics }) => {
  const [sortField, setSortField] = useState<SortField>('name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const getMetricValue = (account: Account, metric: MetricType): number => {
    switch (metric) {
      case 'reach':
        return account.metrics.reach
      case 'engagement':
        return account.metrics.engagementRate
      case 'clicks':
        return account.metrics.clicks
      case 'conversions':
        return account.metrics.conversions
      case 'cpl':
        return account.metrics.costPerConversion
      case 'roi':
        return account.metrics.roi
    }
  }

  const getTrendValue = (account: Account, metric: MetricType): number => {
    switch (metric) {
      case 'reach':
        return account.trend.reach
      case 'engagement':
        return account.trend.engagement
      case 'roi':
        return 0 // Not in trend data
      default:
        return 0
    }
  }

  const sortedAccounts = useMemo(() => {
    return [...accounts].sort((a, b) => {
      let aVal, bVal

      if (sortField === 'name') {
        aVal = a.handle
        bVal = b.handle
      } else if (sortField === 'platform') {
        aVal = a.platform
        bVal = b.platform
      } else {
        aVal = getMetricValue(a, sortField)
        bVal = getMetricValue(b, sortField)
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      return 0
    })
  }, [accounts, sortField, sortDirection])

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

  const formatMetricValue = (value: number, metric: MetricType): string => {
    switch (metric) {
      case 'reach':
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M`
        }
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`
        }
        return value.toString()
      case 'engagement':
        return `${value.toFixed(1)}%`
      case 'clicks':
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`
        }
        return value.toString()
      case 'conversions':
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`
        }
        return value.toString()
      case 'cpl':
        return `€${value.toFixed(2)}`
      case 'roi':
        return `+${value}%`
    }
  }

  const TrendIndicator = ({ value }: { value: number }) => {
    if (value === 0) {
      return null
    }
    const isPositive = value > 0
    const Icon = isPositive ? TrendingUp : TrendingDown
    const color = isPositive ? 'text-emerald-400' : 'text-red-400'

    return (
      <div className={`flex items-center gap-1 ${color}`}>
        <Icon className="w-3 h-3" />
        <span className="text-xs">{Math.abs(value)}%</span>
      </div>
    )
  }

  const topPerformer = sortedAccounts[0]

  if (accounts.length === 0 || selectedMetrics.length === 0) {
    return (
      <div
        className="backdrop-blur-md rounded-xl border border-white/10 p-8 text-center"
        style={{ background: 'rgba(0, 0, 0, 0.3)' }}
      >
        <p className="text-white/40">Select accounts and metrics to view comparison table</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-x-auto"
    >
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10">
            <th
              className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center gap-2">
                Account
                <SortIcon field="name" />
              </div>
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
              onClick={() => handleSort('platform')}
            >
              <div className="flex items-center gap-2">
                Platform
                <SortIcon field="platform" />
              </div>
            </th>
            {selectedMetrics.map((metric) => (
              <th
                key={metric}
                className="px-4 py-3 text-right text-xs font-medium text-white/60 uppercase tracking-wider cursor-pointer hover:text-white/80 transition-colors"
                onClick={() => handleSort(metric)}
              >
                <div className="flex items-center justify-end gap-2">
                  {metric === 'cpl' ? 'CPL' : metric === 'roi' ? 'ROI' : metric}
                  <SortIcon field={metric} />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedAccounts.map((account, index) => {
            const isTop = account.id === topPerformer.id
            const PlatformIcon = platformIcons[account.platform]

            return (
              <motion.tr
                key={account.id}
                className="border-b border-white/5 hover:transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={account.avatar}
                      alt={account.name}
                      className="w-8 h-8 rounded-full border border-white/20"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-white text-sm">{account.handle}</span>
                        {isTop && <Trophy className="w-4 h-4 text-amber-400" />}
                      </div>
                      <span className="text-xs text-white/50">{account.type}</span>
                    </div>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <PlatformIcon
                      className="w-4 h-4"
                      style={{ color: platformColors[account.platform] }}
                    />
                    <span className="text-white/80 text-sm capitalize">{account.platform}</span>
                  </div>
                </td>

                {selectedMetrics.map((metric) => (
                  <td key={metric} className="px-4 py-4 text-right">
                    <div className="flex flex-col items-end">
                      <span className="text-white font-medium">
                        {formatMetricValue(getMetricValue(account, metric), metric)}
                      </span>
                      <TrendIndicator value={getTrendValue(account, metric)} />
                    </div>
                  </td>
                ))}
              </motion.tr>
            )
          })}
        </tbody>
      </table>
    </motion.div>
  )
}
