import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import {
  FaTimes as X,
  FaCheckCircle as CheckCircle2,
  FaArrowUp as TrendingUp,
  FaArrowDown as TrendingDown,
  FaBullseye as Target,
  FaUsers as UsersIcon,
  FaCalendar as Calendar,
  FaMapMarkerAlt as MapPin,
  FaTrophy as Trophy,
  FaArrowRight as ArrowRight,
  FaBolt as Zap,
  FaHeart as Heart,
  FaEye as Eye,
} from 'react-icons/fa'
import { Account } from './mockAccountData'

interface AccountDetailDrawerProps {
  account: Account | null
  isOpen: boolean
  onClose: () => void
}

export const AccountDetailDrawer: React.FC<AccountDetailDrawerProps> = ({
  account,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation(['common'])
  if (!account) {
    return null
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getTrendIndicator = (value: number) => {
    if (value > 10) {
      return (
        <span className="flex items-center gap-1 text-emerald-400">
          <TrendingUp className="w-4 h-4" />+{value.toFixed(1)}%
        </span>
      )
    } else if (value < 0) {
      return (
        <span className="flex items-center gap-1 text-rose-400">
          <TrendingDown className="w-4 h-4" />
          {value.toFixed(1)}%
        </span>
      )
    }
    return <span className="text-slate-400">~{value.toFixed(1)}%</span>
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl border-l border-white/10 z-50 overflow-y-auto"
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          >
            {/* Header */}
            <div
              className="sticky top-0 backdrop-blur-sm border-b border-white/10 p-6 z-10"
              style={{ background: 'rgba(0, 0, 0, 0.5)' }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <img
                    src={account.avatar}
                    alt={account.name}
                    className="w-16 h-16 rounded-full border-2 border-violet-500/50"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h2 className="text-2xl font-bold text-white">{account.handle}</h2>
                      {account.verified && <CheckCircle2 className="w-5 h-5 text-blue-400" />}
                    </div>
                    <p className="text-slate-400">{account.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">
                        {account.role}
                      </span>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          account.connectionStatus === 'connected'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {account.connectionStatus}
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={onClose} className="p-2  rounded-lg transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{formatNumber(account.followers)}</p>
                  <p className="text-xs text-slate-400">Followers</p>
                  {getTrendIndicator(account.trend.followers)}
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-violet-400">
                    {account.metrics.engagementRate.toFixed(1)}%
                  </p>
                  <p className="text-xs text-slate-400">Engagement Rate</p>
                  {getTrendIndicator(account.trend.engagement)}
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-indigo-400">{account.metrics.roi}%</p>
                  <p className="text-xs text-slate-400">ROI</p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Strategy Section */}
              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-violet-400" />
                  Content Strategy
                </h3>
                <div className="space-y-4">
                  <div
                    className="p-4  rounded-lg border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <p className="text-sm font-semibold text-slate-300 mb-2">Current Strategy</p>
                    <p className="text-white">{account.strategy}</p>
                  </div>
                  <div
                    className="p-4  rounded-lg border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <p className="text-sm font-semibold text-slate-300 mb-2">Objectives</p>
                    <ul className="space-y-2">
                      {account.objectives.map((objective, index) => (
                        <li key={index} className="flex items-start gap-2 text-slate-300">
                          <ArrowRight className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                          <span>{objective}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="p-4  rounded-lg border border-white/10"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <p className="text-sm font-semibold text-slate-300 mb-2">Target Audience</p>
                      <p className="text-white text-sm">{account.targetAudience}</p>
                    </div>
                    <div
                      className="p-4  rounded-lg border border-white/10"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <p className="text-sm font-semibold text-slate-300 mb-2">Posting Frequency</p>
                      <p className="text-white text-sm flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-violet-400" />
                        {account.postingFrequency}
                      </p>
                    </div>
                  </div>
                  <div
                    className="p-4  rounded-lg border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <p className="text-sm font-semibold text-slate-300 mb-2">Content Themes</p>
                    <div className="flex flex-wrap gap-2">
                      {account.contentThemes.map((theme, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full"
                        >
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Performance Metrics */}
              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                  Performance Metrics (Last 30 Days)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Reach', value: account.metrics.reach, icon: Eye, color: 'violet' },
                    {
                      label: 'Impressions',
                      value: account.metrics.impressions,
                      icon: Eye,
                      color: 'indigo',
                    },
                    {
                      label: 'Engagement',
                      value: account.metrics.engagement,
                      icon: Heart,
                      color: 'rose',
                    },
                    { label: 'Clicks', value: account.metrics.clicks, icon: Zap, color: 'amber' },
                    {
                      label: 'Conversions',
                      value: account.metrics.conversions,
                      icon: Target,
                      color: 'emerald',
                    },
                    {
                      label: 'CTR',
                      value: account.metrics.ctr,
                      icon: Zap,
                      color: 'blue',
                      suffix: '%',
                    },
                    {
                      label: 'CPC',
                      value: account.metrics.cpc,
                      icon: Target,
                      color: 'purple',
                      prefix: '$',
                    },
                    {
                      label: 'Cost/Conv',
                      value: account.metrics.costPerConversion,
                      icon: Target,
                      color: 'pink',
                      prefix: '$',
                    },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className="p-4  rounded-lg border border-white/10"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon className={`w-4 h-4 text-${metric.color}-400`} />
                        <p className="text-sm text-slate-400">{metric.label}</p>
                      </div>
                      <p className="text-2xl font-bold text-white">
                        {metric.prefix || ''}
                        {formatNumber(metric.value)}
                        {metric.suffix || ''}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Top Performing Content */}
              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Top Performing Content
                </h3>
                <div className="space-y-3">
                  {account.topPosts.map((post, index) => (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4  rounded-lg border border-white/10 hover:border-violet-500/50 transition-colors"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={post.thumbnail}
                          alt={t('common:images.post_thumbnail')}
                          className="w-20 h-20 rounded-lg object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-white font-medium line-clamp-2">{post.caption}</p>
                            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                              {post.isWinner && (
                                <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-xs rounded-full">
                                  Winner
                                </span>
                              )}
                              {post.promotedToMain && (
                                <span className="px-2 py-1 bg-violet-500/20 text-violet-300 text-xs rounded-full">
                                  Promoted
                                </span>
                              )}
                              {post.becameAd && (
                                <span className="px-2 py-1 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">
                                  Ad
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Heart className="w-4 h-4" />
                              {formatNumber(post.engagement)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-4 h-4" />
                              {formatNumber(post.reach)}
                            </span>
                            <span>{post.date}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Audience Insights */}
              <section>
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <UsersIcon className="w-5 h-5 text-indigo-400" />
                  Audience Insights
                </h3>
                <div className="space-y-4">
                  {/* Demographics */}
                  <div
                    className="p-4  rounded-lg border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <p className="text-sm font-semibold text-slate-300 mb-3">Age Distribution</p>
                    <div className="space-y-2">
                      {account.audience.demographics.ageGroups.map((group, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-slate-400">{group.range}</span>
                            <span className="text-white font-semibold">{group.percentage}%</span>
                          </div>
                          <div
                            className="w-full  rounded-full h-2"
                            style={{ background: 'rgba(0, 0, 0, 0.25)' }}
                          >
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-violet-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${group.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Locations */}
                  <div
                    className="p-4  rounded-lg border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <p className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-violet-400" />
                      Top Locations
                    </p>
                    <div className="space-y-2">
                      {account.audience.locations.map((location, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{location.country}</span>
                          <span className="text-violet-400 font-semibold">
                            {location.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div
                    className="p-4  rounded-lg border border-white/10"
                    style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                  >
                    <p className="text-sm font-semibold text-slate-300 mb-3">Top Interests</p>
                    <div className="flex flex-wrap gap-2">
                      {account.audience.interests.map((interest, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-violet-500/20 text-violet-300 text-sm rounded-full"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Test Account Info */}
              {account.type === 'test' && (
                <section>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-indigo-400" />
                    Testing Performance
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div
                      className="p-4  rounded-lg border border-white/10 text-center"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <p className="text-sm text-slate-400 mb-1">Win Rate</p>
                      <p className="text-2xl font-bold text-amber-400">{account.winRate}%</p>
                    </div>
                    <div
                      className="p-4  rounded-lg border border-white/10 text-center"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <p className="text-sm text-slate-400 mb-1">Promoted</p>
                      <p className="text-2xl font-bold text-violet-400">{account.promotionCount}</p>
                    </div>
                    <div
                      className="p-4  rounded-lg border border-white/10 text-center"
                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                    >
                      <p className="text-sm text-slate-400 mb-1">Duration</p>
                      <p className="text-2xl font-bold text-indigo-400">{account.testDuration}</p>
                    </div>
                  </div>
                </section>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
