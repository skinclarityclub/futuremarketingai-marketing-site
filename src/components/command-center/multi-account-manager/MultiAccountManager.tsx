import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FaSearch as Search, FaFilter as Filter } from 'react-icons/fa'
import { useTranslation } from 'react-i18next'
import { Account, mockAccounts } from './mockAccountData'
import { AccountHierarchyTree } from './AccountHierarchyTree'
import { AccountComparisonTable } from './AccountComparisonTable'
import { AccountDetailDrawer } from './AccountDetailDrawer'

interface MultiAccountManagerProps {
  platform?: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'
}

export const MultiAccountManager: React.FC<MultiAccountManagerProps> = ({
  platform = 'instagram',
}) => {
  const { t } = useTranslation(['common'])
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'main' | 'sub' | 'test'>('all')
  const [view, setView] = useState<'tree' | 'table'>('tree')

  // Filter accounts based on platform, search, and type
  const filteredAccounts = mockAccounts.filter((account) => {
    const matchesPlatform = account.platform === platform
    const matchesSearch =
      searchQuery === '' ||
      account.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.role.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || account.type === filterType

    return matchesPlatform && matchesSearch && matchesType
  })

  const handleAccountSelect = (account: Account) => {
    setSelectedAccount(account)
    setIsDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setIsDrawerOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Multi-Account Manager</h2>
          <p className="text-slate-400">Manage and compare performance across all your accounts</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center gap-1 p-1 /50 rounded-lg">
            <button
              onClick={() => setView('tree')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'tree' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tree View
            </button>
            <button
              onClick={() => setView('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                view === 'table' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table View
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('common:placeholders.search_accounts')}
              className="pl-10 pr-4 py-2 /50 border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/50 transition-colors"
            />
          </div>

          {/* Type Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as typeof filterType)}
              className="pl-10 pr-10 py-2 /50 border border-slate-700/50 rounded-lg text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500/50 transition-colors"
            >
              <option value="all">All Accounts</option>
              <option value="main">Main Only</option>
              <option value="sub">Sub Only</option>
              <option value="test">Test Only</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4"
      >
        {[
          {
            label: 'Total Accounts',
            value: filteredAccounts.length,
            color: 'indigo',
          },
          {
            label: 'Total Followers',
            value: filteredAccounts.reduce((sum, acc) => sum + acc.followers, 0),
            format: true,
            color: 'violet',
          },
          {
            label: 'Avg. Engagement Rate',
            value:
              filteredAccounts.reduce((sum, acc) => sum + acc.metrics.engagementRate, 0) /
              filteredAccounts.length,
            suffix: '%',
            decimals: 1,
            color: 'purple',
          },
          {
            label: 'Active Tests',
            value: filteredAccounts.filter((acc) => acc.testStatus === 'active').length,
            color: 'amber',
          },
        ].map((stat, index) => (
          <div key={index} className="p-4 /50 rounded-lg border border-slate-700/50">
            <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-400`}>
              {stat.format
                ? stat.value >= 1000000
                  ? (stat.value / 1000000).toFixed(1) + 'M'
                  : (stat.value / 1000).toFixed(1) + 'K'
                : stat.decimals
                  ? stat.value.toFixed(stat.decimals)
                  : stat.value}
              {stat.suffix || ''}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="/30 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6"
      >
        {view === 'tree' ? (
          <AccountHierarchyTree
            accounts={filteredAccounts}
            selectedAccountId={selectedAccount?.id}
            onAccountSelect={handleAccountSelect}
          />
        ) : (
          <AccountComparisonTable
            accounts={filteredAccounts}
            selectedAccountId={selectedAccount?.id}
            onAccountSelect={handleAccountSelect}
          />
        )}
      </motion.div>

      {/* Detail Drawer */}
      <AccountDetailDrawer
        account={selectedAccount}
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
      />
    </div>
  )
}
