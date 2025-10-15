import React, { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { GlassCard, Button } from '../common'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

/**
 * AdManager - Comprehensive ad campaign management interface
 *
 * Features:
 * - Active campaigns table with sort/filter
 * - Budget distribution donut chart
 * - Performance metrics per campaign
 * - Optimization suggestions
 */

// Types
interface Campaign {
  id: number
  name: string
  platform: 'Google Ads' | 'Meta Ads' | 'LinkedIn' | 'Twitter'
  status: 'Active' | 'Paused' | 'Ended'
  budget: number
  spent: number
  impressions: number
  clicks: number
  ctr: number // Click-through rate
  conversions: number
  cpc: number // Cost per click
  roi: number
  startDate: string
  endDate: string
}

type SortField = keyof Campaign
type SortOrder = 'asc' | 'desc'

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: 'Spring Product Launch',
    platform: 'Google Ads',
    status: 'Active',
    budget: 15000,
    spent: 12450,
    impressions: 245000,
    clicks: 8540,
    ctr: 3.48,
    conversions: 456,
    cpc: 1.46,
    roi: 342,
    startDate: '2025-03-01',
    endDate: '2025-04-30',
  },
  {
    id: 2,
    name: 'Summer Brand Awareness',
    platform: 'Meta Ads',
    status: 'Active',
    budget: 22000,
    spent: 14300,
    impressions: 582000,
    clicks: 12450,
    ctr: 2.14,
    conversions: 289,
    cpc: 1.15,
    roi: 218,
    startDate: '2025-04-15',
    endDate: '2025-06-30',
  },
  {
    id: 3,
    name: 'Q2 Lead Generation',
    platform: 'LinkedIn',
    status: 'Active',
    budget: 18500,
    spent: 17020,
    impressions: 128000,
    clicks: 5890,
    ctr: 4.6,
    conversions: 724,
    cpc: 2.89,
    roi: 456,
    startDate: '2025-04-01',
    endDate: '2025-06-30',
  },
  {
    id: 4,
    name: 'Retargeting Campaign',
    platform: 'Google Ads',
    status: 'Paused',
    budget: 8500,
    spent: 3825,
    impressions: 94000,
    clicks: 2350,
    ctr: 2.5,
    conversions: 142,
    cpc: 1.63,
    roi: 156,
    startDate: '2025-03-15',
    endDate: '2025-05-31',
  },
  {
    id: 5,
    name: 'Holiday Sale Prep',
    platform: 'Meta Ads',
    status: 'Active',
    budget: 25000,
    spent: 18750,
    impressions: 678000,
    clicks: 15230,
    ctr: 2.25,
    conversions: 892,
    cpc: 1.23,
    roi: 389,
    startDate: '2025-05-01',
    endDate: '2025-07-31',
  },
]

// Optimization suggestions
const optimizationSuggestions = [
  {
    id: 1,
    campaignId: 3,
    type: 'budget',
    severity: 'high',
    title: 'Increase Budget - High Performing Campaign',
    description:
      'Q2 Lead Generation is delivering exceptional ROI (456%). Consider increasing budget by 25% to maximize returns.',
    impact: '+15% potential conversions',
  },
  {
    id: 2,
    campaignId: 4,
    type: 'performance',
    severity: 'medium',
    title: 'Review Paused Campaign',
    description:
      'Retargeting Campaign has been paused. Review performance data to determine if reactivation is worthwhile.',
    impact: 'Potential revenue recovery',
  },
  {
    id: 3,
    campaignId: 2,
    type: 'optimization',
    severity: 'low',
    title: 'Optimize Ad Creative',
    description:
      'CTR for Summer Brand Awareness is below platform average (2.14% vs 2.8%). Test new ad variations.',
    impact: '+8% estimated CTR improvement',
  },
  {
    id: 4,
    campaignId: 1,
    type: 'budget',
    severity: 'medium',
    title: 'Budget Nearly Depleted',
    description:
      'Spring Product Launch has used 83% of budget with 45 days remaining. Consider budget adjustment.',
    impact: 'Prevent campaign interruption',
  },
]

export const AdManager: React.FC = () => {
  const { t } = useTranslation(['dashboard', 'common'])
  const [campaigns] = useState<Campaign[]>(mockCampaigns)
  const [sortField, setSortField] = useState<SortField>('roi')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [filterStatus, setFilterStatus] = useState<'All' | Campaign['status']>('All')
  const [filterPlatform, setFilterPlatform] = useState<'All' | Campaign['platform']>('All')

  // Sort and filter logic
  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = campaigns

    // Apply status filter
    if (filterStatus !== 'All') {
      filtered = filtered.filter((c) => c.status === filterStatus)
    }

    // Apply platform filter
    if (filterPlatform !== 'All') {
      filtered = filtered.filter((c) => c.platform === filterPlatform)
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      const aValue = a[sortField]
      const bValue = b[sortField]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
      }

      return 0
    })
  }, [campaigns, sortField, sortOrder, filterStatus, filterPlatform])

  // Budget distribution data for donut chart
  const budgetData = useMemo(() => {
    return campaigns
      .filter((c) => c.status === 'Active')
      .map((c) => ({
        name: c.name,
        value: c.budget,
        spent: c.spent,
      }))
  }, [campaigns])

  const COLORS = ['#00D4FF', '#00FF88', '#FF00FF', '#FFD700', '#FF6B6B']

  // Handle sort
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortOrder('desc')
    }
  }

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  // Format number
  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-text-primary mb-6">
        {t('dashboard:ad_manager.title')}
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <GlassCard className="p-4" hover>
          <div className="text-white/80 text-sm mb-1">
            {t('dashboard:ad_manager.summary_cards.total_budget')}
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {formatCurrency(campaigns.reduce((sum, c) => sum + c.budget, 0))}
          </div>
          <div className="text-xs text-success mt-1">
            {t('dashboard:ad_manager.summary_cards.active_campaigns', {
              count: campaigns.filter((c) => c.status === 'Active').length,
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-4" hover>
          <div className="text-white/80 text-sm mb-1">
            {t('dashboard:ad_manager.summary_cards.total_spent')}
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {formatCurrency(campaigns.reduce((sum, c) => sum + c.spent, 0))}
          </div>
          <div className="text-xs text-accent-primary mt-1">
            {t('dashboard:ad_manager.summary_cards.utilized', {
              percent: (
                (campaigns.reduce((sum, c) => sum + c.spent, 0) /
                  campaigns.reduce((sum, c) => sum + c.budget, 0)) *
                100
              ).toFixed(1),
            })}
          </div>
        </GlassCard>

        <GlassCard className="p-4" hover>
          <div className="text-white/80 text-sm mb-1">
            {t('dashboard:ad_manager.summary_cards.total_conversions')}
          </div>
          <div className="text-2xl font-bold text-text-primary">
            {formatNumber(campaigns.reduce((sum, c) => sum + c.conversions, 0))}
          </div>
          <div className="text-xs text-success mt-1">
            {t('dashboard:ad_manager.summary_cards.avg_cpc')}{' '}
            {formatCurrency(campaigns.reduce((sum, c) => sum + c.cpc, 0) / campaigns.length)}
          </div>
        </GlassCard>

        <GlassCard className="p-4" hover>
          <div className="text-white/80 text-sm mb-1">
            {t('dashboard:ad_manager.summary_cards.avg_roi')}
          </div>
          <div className="text-2xl font-bold text-success">
            {(campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length).toFixed(0)}%
          </div>
          <div className="text-xs text-white/70 mt-1">
            {t('dashboard:ad_manager.summary_cards.across_all')}
          </div>
        </GlassCard>
      </div>

      {/* Budget Distribution Chart */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('dashboard:ad_manager.chart.budget_distribution')}
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={budgetData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              label={(props: any) => {
                const RADIAN = Math.PI / 180
                const { cx, cy, midAngle, outerRadius, name, percent } = props
                const radius = outerRadius + 30
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)

                return (
                  <text
                    x={x}
                    y={y}
                    fill="#E2E8F0"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-xs"
                  >
                    {`${name}: ${(percent * 100).toFixed(0)}%`}
                  </text>
                )
              }}
            >
              {budgetData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
              formatter={(value: number, _name: string, props: any) => [
                `${t('dashboard:ad_manager.chart.budget_label')}: ${formatCurrency(value)} | ${t('dashboard:ad_manager.chart.spent_label')}: ${formatCurrency(props.payload.spent)}`,
                props.payload.name,
              ]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </GlassCard>

      {/* Campaigns Table */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-semibold text-text-primary">
            {t('dashboard:ad_manager.table.title')}
          </h3>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-white/10 rounded-lg text-text-primary text-sm hover:border-accent-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary"
              style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            >
              <option value="All">{t('dashboard:ad_manager.filters.all_statuses')}</option>
              <option value="Active">{t('dashboard:ad_manager.status.active')}</option>
              <option value="Paused">{t('dashboard:ad_manager.status.paused')}</option>
              <option value="Ended">{t('dashboard:ad_manager.status.ended')}</option>
            </select>

            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value as any)}
              className="px-4 py-2 border border-white/10 rounded-lg text-text-primary text-sm hover:border-accent-primary/40 transition-colors focus:outline-none focus:ring-2 focus:ring-accent-primary"
              style={{ background: 'rgba(0, 0, 0, 0.3)' }}
            >
              <option value="All">{t('dashboard:ad_manager.filters.all_platforms')}</option>
              <option value="Google Ads">Google Ads</option>
              <option value="Meta Ads">Meta Ads</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Twitter">Twitter</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th
                  onClick={() => handleSort('name')}
                  className="text-left py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.campaign')}{' '}
                  {sortField === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('platform')}
                  className="text-left py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.platform')}{' '}
                  {sortField === 'platform' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('status')}
                  className="text-left py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.status')}{' '}
                  {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('budget')}
                  className="text-right py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.budget')}{' '}
                  {sortField === 'budget' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('spent')}
                  className="text-right py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.spent')}{' '}
                  {sortField === 'spent' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('impressions')}
                  className="text-right py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.impressions')}{' '}
                  {sortField === 'impressions' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('clicks')}
                  className="text-right py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.clicks')}{' '}
                  {sortField === 'clicks' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('ctr')}
                  className="text-right py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.ctr')}{' '}
                  {sortField === 'ctr' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('conversions')}
                  className="text-right py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.conversions')}{' '}
                  {sortField === 'conversions' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  onClick={() => handleSort('roi')}
                  className="text-right py-3 px-4 text-white/90 font-semibold cursor-pointer hover:text-accent-primary transition-colors"
                >
                  {t('dashboard:ad_manager.table.headers.roi')}{' '}
                  {sortField === 'roi' && (sortOrder === 'asc' ? '↑' : '↓')}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCampaigns.map((campaign) => (
                <tr key={campaign.id} className="border-b border-white/10 hover:transition-colors">
                  <td className="py-3 px-4 text-text-primary font-medium">{campaign.name}</td>
                  <td className="py-3 px-4 text-white/90 text-sm">{campaign.platform}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        campaign.status === 'Active'
                          ? 'bg-success/20 text-success'
                          : campaign.status === 'Paused'
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'text-white/70 border border-white/20'
                      }`}
                      style={
                        campaign.status === 'Ended'
                          ? { background: 'rgba(0, 0, 0, 0.3)' }
                          : undefined
                      }
                    >
                      {t(`dashboard:ad_manager.status.${campaign.status.toLowerCase()}`)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-text-primary text-right">
                    {formatCurrency(campaign.budget)}
                  </td>
                  <td className="py-3 px-4 text-white/90 text-right">
                    {formatCurrency(campaign.spent)}
                  </td>
                  <td className="py-3 px-4 text-white/90 text-right">
                    {formatNumber(campaign.impressions)}
                  </td>
                  <td className="py-3 px-4 text-white/90 text-right">
                    {formatNumber(campaign.clicks)}
                  </td>
                  <td className="py-3 px-4 text-white/90 text-right">{campaign.ctr.toFixed(2)}%</td>
                  <td className="py-3 px-4 text-accent-primary text-right font-semibold">
                    {formatNumber(campaign.conversions)}
                  </td>
                  <td className="py-3 px-4 text-success text-right font-bold">+{campaign.roi}%</td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAndSortedCampaigns.length === 0 && (
            <div className="text-center py-12 text-white/70">
              {t(
                'dashboard:ad_manager.table.no_results',
                'No campaigns found matching your filters.'
              )}
            </div>
          )}
        </div>
      </GlassCard>

      {/* Optimization Suggestions */}
      <div>
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          {t('dashboard:ad_manager.optimization.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizationSuggestions.map((suggestion) => {
            const campaign = campaigns.find((c) => c.id === suggestion.campaignId)
            return (
              <GlassCard
                key={suggestion.id}
                className="p-5 hover:scale-[1.02] transition-transform cursor-pointer"
                hover
                glow
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        suggestion.severity === 'high'
                          ? 'bg-red-500'
                          : suggestion.severity === 'medium'
                            ? 'bg-yellow-500'
                            : 'bg-blue-500'
                      }`}
                    />
                    <span className="text-xs text-white/70 uppercase tracking-wider">
                      {suggestion.type}
                    </span>
                  </div>
                  <span className="text-xs text-white/80">{campaign?.name}</span>
                </div>

                <h4 className="text-text-primary font-semibold mb-2">{suggestion.title}</h4>
                <p className="text-white/90 text-sm mb-3">{suggestion.description}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-accent-primary font-semibold">
                    {suggestion.impact}
                  </span>
                  <Button variant="ghost" size="sm">
                    Apply →
                  </Button>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default AdManager
