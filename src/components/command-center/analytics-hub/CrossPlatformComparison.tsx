import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { FaChartLine as TrendingUp } from 'react-icons/fa'
import { PlatformAccountSelector } from './PlatformAccountSelector'
import { MetricsChartSelector, type MetricType, type ChartType } from './MetricsChartSelector'
import { ComparisonChart } from './ComparisonChart'
import { ComparisonTable } from './ComparisonTable'
import { mockAccounts } from '../multi-account-manager/mockAccountData'

type Platform = 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'

export const CrossPlatformComparison: React.FC = () => {
  // Platform & Account Selection
  const availablePlatforms: Platform[] = ['instagram', 'tiktok', 'youtube', 'facebook', 'twitter']
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['instagram', 'tiktok'])
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([])

  // Metrics & Chart Selection
  const availableMetrics: MetricType[] = [
    'reach',
    'engagement',
    'clicks',
    'conversions',
    'cpl',
    'roi',
  ]
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(['engagement', 'roi'])
  const [chartType, setChartType] = useState<ChartType>('bar')

  // Filter accounts based on selections
  const filteredAccounts = useMemo(() => {
    let accounts = mockAccounts

    // Filter by selected platforms
    if (selectedPlatforms.length > 0) {
      accounts = accounts.filter((acc) => selectedPlatforms.includes(acc.platform))
    }

    // Filter by selected accounts
    if (selectedAccounts.length > 0) {
      accounts = accounts.filter((acc) => selectedAccounts.includes(acc.id))
    }

    return accounts
  }, [selectedPlatforms, selectedAccounts])

  const handlePlatformToggle = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      if (prev.includes(platform)) {
        return prev.filter((p) => p !== platform)
      } else {
        return [...prev, platform]
      }
    })
  }

  const handleAccountToggle = (accountId: string) => {
    setSelectedAccounts((prev) => {
      if (prev.includes(accountId)) {
        return prev.filter((id) => id !== accountId)
      } else {
        return [...prev, accountId]
      }
    })
  }

  const handleMetricToggle = (metric: MetricType) => {
    setSelectedMetrics((prev) => {
      if (prev.includes(metric)) {
        // Keep at least one metric selected
        if (prev.length > 1) {
          return prev.filter((m) => m !== metric)
        }
        return prev
      } else {
        return [...prev, metric]
      }
    })
  }

  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-6 h-6 text-accent-primary" />
          Cross-Platform Analytics
        </h2>
        <p className="text-white/60">Compare performance metrics across platforms and accounts</p>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Platform & Account Selection */}
        <motion.div
          className="backdrop-blur-md rounded-xl border border-white/10 p-6"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PlatformAccountSelector
            availablePlatforms={availablePlatforms}
            selectedPlatforms={selectedPlatforms}
            onPlatformToggle={handlePlatformToggle}
            availableAccounts={mockAccounts}
            selectedAccounts={selectedAccounts}
            onAccountToggle={handleAccountToggle}
          />
        </motion.div>

        {/* Right: Metrics & Chart Selection */}
        <motion.div
          className="backdrop-blur-md rounded-xl border border-white/10 p-6"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <MetricsChartSelector
            availableMetrics={availableMetrics}
            selectedMetrics={selectedMetrics}
            onMetricToggle={handleMetricToggle}
            chartType={chartType}
            onChartTypeChange={setChartType}
          />
        </motion.div>
      </div>

      {/* Chart Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <ComparisonChart
          accounts={filteredAccounts}
          selectedMetrics={selectedMetrics}
          chartType={chartType}
        />
      </motion.div>

      {/* Comparison Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-white mb-4">Detailed Comparison</h3>
        <ComparisonTable accounts={filteredAccounts} selectedMetrics={selectedMetrics} />
      </motion.div>
    </motion.div>
  )
}
