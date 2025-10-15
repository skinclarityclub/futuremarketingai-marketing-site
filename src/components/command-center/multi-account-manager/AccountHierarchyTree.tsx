import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaChevronRight as ChevronRight,
  FaChevronDown as ChevronDown,
  FaCrown as Crown,
  FaUsers as Users,
  FaFlask as TestTube,
  FaArrowUp as TrendingUp,
  FaArrowDown as TrendingDown,
  FaMinus as Minus,
  FaCheckCircle as CheckCircle2,
  FaTrophy as Trophy,
  FaBolt as Zap,
} from 'react-icons/fa'
import { Account, getSubAccounts } from './mockAccountData'

interface AccountHierarchyTreeProps {
  accounts: Account[]
  selectedAccountId?: string
  onAccountSelect: (account: Account) => void
}

interface TreeNodeProps {
  account: Account
  level: number
  isSelected: boolean
  onClick: () => void
  children?: React.ReactNode
}

const TreeNode: React.FC<TreeNodeProps> = ({ account, level, isSelected, onClick, children }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const hasChildren = React.Children.count(children) > 0

  const getTypeIcon = () => {
    switch (account.type) {
      case 'main':
        return <Crown className="w-4 h-4 text-amber-400" />
      case 'sub':
        return <Users className="w-4 h-4 text-violet-400" />
      case 'test':
        return <TestTube className="w-4 h-4 text-indigo-400" />
    }
  }

  const getTrendIcon = () => {
    const avgTrend = (account.trend.followers + account.trend.engagement + account.trend.reach) / 3
    if (avgTrend > 15) {
      return <TrendingUp className="w-3 h-3 text-emerald-400" />
    } else if (avgTrend < 0) {
      return <TrendingDown className="w-3 h-3 text-rose-400" />
    }
    return <Minus className="w-3 h-3 text-slate-400" />
  }

  const getStatusBadge = () => {
    if (account.testStatus === 'winner') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full">
          <Trophy className="w-3 h-3" />
          Winner
        </span>
      )
    }
    if (account.testStatus === 'active') {
      return (
        <span className="flex items-center gap-1 px-2 py-0.5 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
          <Zap className="w-3 h-3" />
          Testing
        </span>
      )
    }
    return null
  }

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        style={{ paddingLeft: `${level * 24}px` }}
        className="group"
      >
        <div
          onClick={onClick}
          className={`
            flex items-center gap-3 p-3 rounded-lg cursor-pointer
            transition-all duration-200
            ${
              isSelected
                ? 'bg-indigo-500/20 border border-indigo-400/50 shadow-lg shadow-indigo-500/10'
                : 'hover:/50 border border-transparent hover:border-slate-700/50'
            }
          `}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(!isExpanded)
              }}
              className="flex-shrink-0 p-1 hover:/50 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>
          )}

          {/* Account Icon */}
          <div className="flex-shrink-0">{getTypeIcon()}</div>

          {/* Avatar */}
          <img
            src={account.avatar}
            alt={account.name}
            className="w-10 h-10 rounded-full border-2 border-violet-500/30"
          />

          {/* Account Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <p className="font-semibold text-white truncate">{account.handle}</p>
              {account.verified && <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />}
            </div>
            <p className="text-xs text-slate-400 truncate">{account.role}</p>
          </div>

          {/* Metrics */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Followers */}
            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                {(account.followers / 1000).toFixed(1)}K
              </p>
              <p className="text-xs text-slate-400">followers</p>
            </div>

            {/* Engagement Rate */}
            <div className="text-right">
              <div className="flex items-center gap-1">
                <p className="text-sm font-semibold text-violet-400">
                  {account.metrics.engagementRate.toFixed(1)}%
                </p>
                {getTrendIcon()}
              </div>
              <p className="text-xs text-slate-400">engagement</p>
            </div>

            {/* Test Win Rate (for test accounts) */}
            {account.type === 'test' && account.winRate && (
              <div className="text-right">
                <p className="text-sm font-semibold text-amber-400">
                  {account.winRate.toFixed(1)}%
                </p>
                <p className="text-xs text-slate-400">win rate</p>
              </div>
            )}

            {/* Status Badge */}
            {getStatusBadge()}
          </div>
        </div>
      </motion.div>

      {/* Children */}
      <AnimatePresence>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export const AccountHierarchyTree: React.FC<AccountHierarchyTreeProps> = ({
  accounts,
  selectedAccountId,
  onAccountSelect,
}) => {
  const renderAccountTree = (account: Account, level: number = 0): React.ReactNode => {
    const subAccounts = getSubAccounts(account.id)
    const isSelected = account.id === selectedAccountId

    return (
      <TreeNode
        key={account.id}
        account={account}
        level={level}
        isSelected={isSelected}
        onClick={() => onAccountSelect(account)}
      >
        {subAccounts.map((subAccount) => renderAccountTree(subAccount, level + 1))}
      </TreeNode>
    )
  }

  // Get only root accounts (main accounts with no parent)
  const rootAccounts = accounts.filter((acc) => !acc.parentId)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Account Hierarchy</h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400">Main</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-400" />
            <span className="text-slate-400">Sub</span>
          </div>
          <div className="flex items-center gap-2">
            <TestTube className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-400">Test</span>
          </div>
        </div>
      </div>

      <div className="space-y-1">{rootAccounts.map((account) => renderAccountTree(account))}</div>

      {/* Strategy Flow Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 border border-indigo-500/30 rounded-lg"
      >
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-400" />
          Content Strategy Flow
        </h4>
        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <TestTube className="w-3 h-3 text-indigo-400" />
            <span>Test Accounts</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <Trophy className="w-3 h-3 text-amber-400" />
            <span>Winners</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3 text-violet-400" />
            <span>Sub Accounts</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-amber-400" />
            <span>Main Account</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-emerald-400" />
            <span>Paid Ads</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
