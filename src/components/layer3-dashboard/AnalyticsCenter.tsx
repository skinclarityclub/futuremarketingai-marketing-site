import React from 'react'
import { GlassCard, Button } from '../common'
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export const AnalyticsCenter: React.FC = () => {
  // Performance Comparison Data
  const performanceData = [
    { campaign: 'Q1 Launch', roi: 342, engagement: 87, conversions: 1240 },
    { campaign: 'Brand Awareness', roi: 218, engagement: 65, conversions: 890 },
    { campaign: 'Lead Gen', roi: 456, engagement: 92, conversions: 1850 },
    { campaign: 'Retargeting', roi: 156, engagement: 45, conversions: 620 },
    { campaign: 'Summer Sale', roi: 389, engagement: 78, conversions: 1560 },
  ]

  // Winner identification
  const winner = performanceData.reduce(
    (max, item) => (item.roi > max.roi ? item : max),
    performanceData[0]
  )

  // ROI Breakdown Data
  const roiBreakdownData = [
    { name: 'Ad Spend', value: 25000, color: '#00D4FF' },
    { name: 'Content Creation', value: 15000, color: '#A855F7' },
    { name: 'Platform Fees', value: 8000, color: '#00FF88' },
    { name: 'Analytics Tools', value: 5000, color: '#F59E0B' },
    { name: 'Team Labor', value: 12000, color: '#EC4899' },
  ]

  // Trend Predictions Data with Confidence Intervals
  const trendData = [
    { month: 'Jan', actual: 245, predicted: 250, lower: 230, upper: 270 },
    { month: 'Feb', actual: 278, predicted: 285, lower: 265, upper: 305 },
    { month: 'Mar', actual: 312, predicted: 320, lower: 300, upper: 340 },
    { month: 'Apr', actual: null, predicted: 358, lower: 335, upper: 380 },
    { month: 'May', actual: null, predicted: 395, lower: 370, upper: 420 },
    { month: 'Jun', actual: null, predicted: 435, lower: 408, upper: 462 },
  ]

  const handleExport = (chartName: string) => {
    // Visual only - no actual export logic
    console.log(`Exporting ${chartName}...`)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-text-primary mb-6">Analytics Center</h2>

      {/* Performance Comparison */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary">
            Campaign Performance Comparison
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport('Performance Comparison')}
          >
            📊 Export
          </Button>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="campaign"
              stroke="#94A3B8"
              style={{ fontSize: '12px' }}
              angle={-15}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(10px)',
              }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Legend />
            <Bar dataKey="roi" fill="#00D4FF" name="ROI %" radius={[8, 8, 0, 0]} />
            <Bar dataKey="engagement" fill="#00FF88" name="Engagement %" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        {/* Winner Highlight */}
        <div className="mt-6 glass-card-strong p-4 rounded-lg border-l-4 border-success">
          <div className="flex items-center gap-3">
            <div className="text-3xl">🏆</div>
            <div>
              <div className="text-sm text-white/80">Top Performer</div>
              <div className="text-xl font-bold text-success">{winner.campaign}</div>
              <div className="text-sm text-white/80">
                ROI: +{winner.roi}% | Engagement: {winner.engagement}% | Conversions:{' '}
                {winner.conversions.toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ROI Breakdown Pie Chart */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-text-primary">ROI Breakdown</h3>
            <Button variant="outline" size="sm" onClick={() => handleExport('ROI Breakdown')}>
              📊 Export
            </Button>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roiBreakdownData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name}: ${(props.percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                animationBegin={0}
                animationDuration={800}
              >
                {roiBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(15, 23, 42, 0.95)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                }}
                formatter={(value: number) => `$${value.toLocaleString()}`}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 space-y-2">
            {roiBreakdownData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-white/80">{item.name}</span>
                </div>
                <span className="text-text-primary font-semibold">
                  ${item.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>

        {/* Summary Stats */}
        <GlassCard className="p-6">
          <h3 className="text-xl font-semibold text-text-primary mb-6">Key Insights</h3>

          <div className="space-y-6">
            <div className="glass-card p-4 rounded-lg">
              <div className="text-white/80 text-sm mb-1">Total Investment</div>
              <div className="text-3xl font-bold gradient-text">
                ${roiBreakdownData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}
              </div>
              <div className="text-success text-sm mt-2">↑ 12% vs last quarter</div>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <div className="text-white/80 text-sm mb-1">Average Campaign ROI</div>
              <div className="text-3xl font-bold gradient-text-success">
                +
                {Math.round(
                  performanceData.reduce((sum, item) => sum + item.roi, 0) / performanceData.length
                )}
                %
              </div>
              <div className="text-success text-sm mt-2">↑ 28% vs last quarter</div>
            </div>

            <div className="glass-card p-4 rounded-lg">
              <div className="text-white/80 text-sm mb-1">Total Conversions</div>
              <div className="text-3xl font-bold gradient-text-secondary">
                {performanceData.reduce((sum, item) => sum + item.conversions, 0).toLocaleString()}
              </div>
              <div className="text-success text-sm mt-2">↑ 34% vs last quarter</div>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Trend Predictions Timeline */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-text-primary">
            ROI Trend Predictions (with Confidence Intervals)
          </h3>
          <Button variant="outline" size="sm" onClick={() => handleExport('Trend Predictions')}>
            📊 Export
          </Button>
        </div>

        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="month" stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <YAxis stroke="#94A3B8" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: '#E2E8F0' }}
            />
            <Legend />

            {/* Confidence Interval */}
            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="#00D4FF"
              fillOpacity={0.1}
              name="Upper Bound"
            />
            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#00D4FF"
              fillOpacity={0.1}
              name="Lower Bound"
            />

            {/* Actual Data */}
            <Line
              type="monotone"
              dataKey="actual"
              stroke="#00FF88"
              strokeWidth={3}
              dot={{ fill: '#00FF88', r: 5 }}
              name="Actual ROI %"
              connectNulls={false}
            />

            {/* Predicted Data */}
            <Line
              type="monotone"
              dataKey="predicted"
              stroke="#00D4FF"
              strokeWidth={3}
              strokeDasharray="5 5"
              dot={{ fill: '#00D4FF', r: 5 }}
              name="Predicted ROI %"
            />
          </AreaChart>
        </ResponsiveContainer>

        <div className="mt-4 flex items-center gap-6 text-sm text-white/80">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-success" />
            <span>Actual Data</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-accent-primary border-dashed" />
            <span>Predicted Trend</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-accent-primary/10 border border-accent-primary/30" />
            <span>95% Confidence Interval</span>
          </div>
        </div>

        <div className="mt-6 glass-card-strong p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="text-2xl">📈</div>
            <div>
              <div className="text-sm text-white/80">Forecast Summary</div>
              <div className="text-text-primary font-medium">
                Predicted +{trendData[trendData.length - 1].predicted}% ROI by June 2024
              </div>
              <div className="text-sm text-white/80 mt-1">
                95% confidence: {trendData[trendData.length - 1].lower}% -{' '}
                {trendData[trendData.length - 1].upper}%
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  )
}

export default AnalyticsCenter
