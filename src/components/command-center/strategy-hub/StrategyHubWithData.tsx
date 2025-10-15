import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
  FaBullseye as Target,
  FaBolt as Zap,
  FaTrophy as Trophy,
  FaUsers as Users,
  FaFlask as TestTube,
  FaCrown as Crown,
  FaArrowRight as ArrowRight,
} from 'react-icons/fa'
import {
  getWinningContent,
  getPromotedContent,
  getAdContent,
  getTopPerformers,
} from '../multi-account-manager/mockAccountData'

export const StrategyHubWithData: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<
    'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter'
  >('instagram')

  const winningContent = getWinningContent()
  const promotedContent = getPromotedContent()
  const adContent = getAdContent()
  const topPerformers = getTopPerformers(3)

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="w-8 h-8 text-indigo-400" />
            Strategy Hub
          </h1>
          <p className="text-slate-400 max-w-2xl">
            Manage your multi-account content testing strategy. Test content on sub-accounts,
            promote winners to main accounts, and turn top performers into paid ads.
          </p>
        </div>

        {/* Platform Selector */}
        <div className="flex items-center gap-2 p-1 /50 rounded-lg">
          {(['instagram', 'tiktok', 'youtube', 'facebook', 'twitter'] as const).map((platform) => (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${
                selectedPlatform === platform
                  ? 'bg-indigo-500 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {platform}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Strategy Flow Visualization */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/10 border border-indigo-500/30 rounded-xl p-6"
      >
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" />
          Content Strategy Pipeline
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {/* Step 1: Test Accounts */}
          <div className="relative">
            <div className="p-4 /50 rounded-lg border border-indigo-500/30">
              <div className="flex items-center gap-2 mb-3">
                <TestTube className="w-5 h-5 text-indigo-400" />
                <h3 className="font-semibold text-white">Test Accounts</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                Experiment with multiple content formats and strategies
              </p>
              <div className="space-y-1 text-xs text-slate-400">
                <p>• High posting frequency</p>
                <p>• Varied content types</p>
                <p>• Quick validation</p>
              </div>
            </div>
            <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400" />
          </div>

          {/* Step 2: Winners */}
          <div className="relative">
            <div className="p-4 /50 rounded-lg border border-amber-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="font-semibold text-white">Winners</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                Top performing content identified by engagement
              </p>
              <div className="space-y-1 text-xs text-slate-400">
                <p>• High engagement rate</p>
                <p>• Strong reach metrics</p>
                <p>• Positive sentiment</p>
              </div>
              <div className="mt-3 px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full inline-block">
                {winningContent.length} winners identified
              </div>
            </div>
            <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-amber-400" />
          </div>

          {/* Step 3: Sub Accounts */}
          <div className="relative">
            <div className="p-4 /50 rounded-lg border border-violet-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-violet-400" />
                <h3 className="font-semibold text-white">Sub Accounts</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                Scale winning content to larger audience
              </p>
              <div className="space-y-1 text-xs text-slate-400">
                <p>• Proven content</p>
                <p>• Optimized timing</p>
                <p>• Engaged community</p>
              </div>
            </div>
            <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-violet-400" />
          </div>

          {/* Step 4: Main Account */}
          <div className="relative">
            <div className="p-4 /50 rounded-lg border border-purple-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-purple-400" />
                <h3 className="font-semibold text-white">Main Account</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">Premium content hub for maximum impact</p>
              <div className="space-y-1 text-xs text-slate-400">
                <p>• Verified winners</p>
                <p>• Brand authority</p>
                <p>• High value audience</p>
              </div>
              <div className="mt-3 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full inline-block">
                {promotedContent.length} promoted
              </div>
            </div>
            <ArrowRight className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
          </div>

          {/* Step 5: Paid Ads */}
          <div>
            <div className="p-4 /50 rounded-lg border border-emerald-500/30">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-emerald-400" />
                <h3 className="font-semibold text-white">Paid Ads</h3>
              </div>
              <p className="text-sm text-slate-300 mb-2">
                Convert best performers into high-ROI ads
              </p>
              <div className="space-y-1 text-xs text-slate-400">
                <p>• Data-backed creative</p>
                <p>• Proven conversion</p>
                <p>• Optimized targeting</p>
              </div>
              <div className="mt-3 px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full inline-block">
                {adContent.length} running ads
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats - Top Performers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        {topPerformers.map((account, index) => (
          <div key={account.id} className="p-4 /50 rounded-lg border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <img
                src={account.avatar}
                alt={account.name}
                className="w-10 h-10 rounded-full border-2 border-violet-500/30"
              />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-white truncate">{account.handle}</p>
                <p className="text-xs text-slate-400">{account.role}</p>
              </div>
              {index === 0 && <Trophy className="w-5 h-5 text-amber-400" />}
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-slate-400 text-xs">Engagement</p>
                <p className="text-violet-400 font-bold">
                  {account.metrics.engagementRate.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs">ROI</p>
                <p className="text-indigo-400 font-bold">{account.metrics.roi}%</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Coming Soon */}
      <div className="text-center py-8 border-t border-slate-700/50">
        <p className="text-slate-400 mb-2">Full Multi-Account Manager coming soon...</p>
        <p className="text-sm text-slate-500">
          Account hierarchy tree, comparison tables, and detail drawer views
        </p>
      </div>
    </div>
  )
}
