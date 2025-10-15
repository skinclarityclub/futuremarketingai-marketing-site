import React, { useState, useMemo, useCallback, memo, useRef, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Area,
  AreaChart,
  Line,
} from 'recharts'
import { formatNumber, formatCurrency, type ROIMetrics } from '../../utils/calculations'
import { GlassCard, InteractiveLegend, ExportButton } from '../common'
import type { LegendItem } from '../common'
import { useChartInteractivity } from '../../hooks/useChartInteractivity'
import { useChartExport } from '../../hooks/useChartExport'

export interface ComparisonChartsProps {
  metrics: ROIMetrics
  inputs: {
    teamSize: number
    avgSalary: number
    campaignsPerMonth: number
  }
  systemCost: number
}

/**
 * ComparisonCharts - Visual charts for ROI comparison
 *
 * Features:
 * - Bar Chart: Financial metrics comparison
 * - Radar Chart: Capability comparison
 * - Area Chart: ROI projection over time
 */
export const ComparisonCharts: React.FC<ComparisonChartsProps> = memo(
  ({ metrics, inputs, systemCost }) => {
    const [activeChart, setActiveChart] = useState<'bar' | 'radar' | 'projection'>('bar')
    const [isMobile, setIsMobile] = useState(false)
    const [chartHeight, setChartHeight] = useState(400)
    const containerRef = useRef<HTMLDivElement>(null)
    const chartContainerRef = useRef<HTMLDivElement>(null)

    // Detect mobile/tablet and adjust layout
    useEffect(() => {
      const checkMobile = () => {
        const mobile = window.innerWidth < 768
        setIsMobile(mobile)
        setChartHeight(mobile ? 300 : window.innerWidth < 1024 ? 350 : 400)
      }

      checkMobile()
      window.addEventListener('resize', checkMobile)
      return () => window.removeEventListener('resize', checkMobile)
    }, [])

    // Interactive legend for data series visibility
    const { visibleSeries, toggleSeries, isSeriesVisible, resetVisibility } = useChartInteractivity(
      {
        seriesKeys: ['Voor', 'Na'],
        initiallyHidden: [],
      }
    )

    // Chart export functionality
    const { exportToPNG, exportToPDF, isExporting } = useChartExport()

    // Legend items configuration - memoized
    const legendItems: LegendItem[] = useMemo(
      () => [
        { key: 'Voor', label: 'Voor (Zonder AI)', color: '#EF4444' }, // Red-500
        { key: 'Na', label: 'Na (Met AI)', color: '#10B981' }, // Emerald-500
      ],
      []
    )

    // Financial Comparison Data - memoized
    const financialData = useMemo(
      () => [
        {
          name: 'Team Kosten',
          Voor: Math.round((inputs.avgSalary / 12) * inputs.teamSize * 0.5),
          Na: Math.round((inputs.avgSalary / 12) * 2),
        },
        {
          name: 'Platform Kosten',
          Voor: 0,
          Na: systemCost,
        },
        {
          name: 'Totale Kosten',
          Voor: Math.round((inputs.avgSalary / 12) * inputs.teamSize * 0.5),
          Na: Math.round((inputs.avgSalary / 12) * 2 + systemCost),
        },
        {
          name: 'Extra Revenue',
          Voor: 0,
          Na: Math.round(metrics.revenueIncrease),
        },
        {
          name: 'Net Benefit',
          Voor: 0,
          Na: Math.round(metrics.netBenefit),
        },
      ],
      [inputs.avgSalary, inputs.teamSize, inputs.campaignsPerMonth, systemCost]
    )

    // Capability Comparison Data (0-100 scale) - memoized
    const capabilityData = useMemo(
      () => [
        {
          capability: 'Content Output',
          Voor: 40,
          Na: 100,
        },
        {
          capability: 'Consistentie',
          Voor: 40,
          Na: 99,
        },
        {
          capability: 'Tijd Efficiëntie',
          Voor: 20,
          Na: 95,
        },
        {
          capability: 'Data Insights',
          Voor: 10,
          Na: 90,
        },
        {
          capability: 'Platform Coverage',
          Voor: 50,
          Na: 100,
        },
        {
          capability: 'Ad ROI',
          Voor: 30,
          Na: 85,
        },
      ],
      []
    )

    // ROI Projection Over Time (12 months)
    const projectionData = useMemo(() => {
      return Array.from({ length: 12 }, (_, i) => {
        const month = i + 1
        const monthlyBenefit = metrics.laborCostSavings + metrics.revenueIncrease
        const cumulativeBenefit = monthlyBenefit * month
        const totalInvestment = systemCost * month
        const netCumulative = cumulativeBenefit - totalInvestment

        return {
          month: `M${month}`,
          'Cumulatieve Besparing': Math.round(cumulativeBenefit),
          'Totale Investering': Math.round(totalInvestment),
          'Net Benefit': Math.round(netCumulative),
        }
      })
    }, [metrics.laborCostSavings, metrics.revenueIncrease, systemCost])

    // Custom Tooltip with dark background override - memoized
    const CustomTooltip = useCallback(({ active, payload, label }: any) => {
      if (!active || !payload || !payload.length) {
        return null
      }

      // Map data keys to colors
      const getColorForDataKey = (dataKey: string) => {
        if (dataKey === 'Voor' || dataKey === 'Totale Investering') {
          return '#EF4444'
        } // Red-500
        if (dataKey === 'Na' || dataKey === 'Cumulatieve Besparing') {
          return '#10B981'
        } // Emerald-500
        if (dataKey === 'Net Benefit') {
          return '#8B5CF6'
        } // Purple-500
        return '#888888' // Fallback gray
      }

      return (
        <div
          style={{
            backgroundColor: 'rgba(17, 24, 39, 0.95)',
            backdropFilter: 'blur(12px)',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
            minWidth: '180px',
          }}
        >
          <p style={{ color: 'white', fontWeight: 600, marginBottom: '8px', fontSize: '14px' }}>
            {label}
          </p>
          {payload.map((entry: any, index: number) => {
            const color = getColorForDataKey(entry.dataKey || entry.name)
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  marginBottom: '6px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: color,
                    }}
                  />
                  <span style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>
                    {entry.name || entry.dataKey}:
                  </span>
                </div>
                <span
                  style={{
                    color: color,
                    fontWeight: 600,
                    fontSize: '14px',
                  }}
                >
                  {typeof entry.value === 'number' ? formatCurrency(entry.value) : entry.value}
                </span>
              </div>
            )
          })}
        </div>
      )
    }, [])

    // Memoized chart type change handler
    const handleChartTypeChange = useCallback((chartType: 'bar' | 'radar' | 'projection') => {
      setActiveChart(chartType)
    }, [])

    // Memoized keyboard navigation handler
    const handleChartKeyDown = useCallback(
      (e: React.KeyboardEvent, chartType: 'bar' | 'radar' | 'projection') => {
        if (e.key === 'ArrowRight') {
          const types = ['bar', 'radar', 'projection'] as const
          const currentIndex = types.indexOf(chartType)
          const nextIndex = (currentIndex + 1) % types.length
          setActiveChart(types[nextIndex])
        } else if (e.key === 'ArrowLeft') {
          const types = ['bar', 'radar', 'projection'] as const
          const currentIndex = types.indexOf(chartType)
          const prevIndex = (currentIndex - 1 + types.length) % types.length
          setActiveChart(types[prevIndex])
        }
      },
      []
    )

    // Touch gesture handlers for swipe navigation
    const handleDragEnd = useCallback(
      (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const swipeThreshold = 50
        const swipeVelocity = 500

        // Determine swipe direction
        if (Math.abs(info.offset.x) > swipeThreshold || Math.abs(info.velocity.x) > swipeVelocity) {
          const types = ['bar', 'radar', 'projection'] as const
          const currentIndex = types.indexOf(activeChart)

          if (info.offset.x > 0) {
            // Swipe right - go to previous chart
            const prevIndex = (currentIndex - 1 + types.length) % types.length
            setActiveChart(types[prevIndex])
          } else {
            // Swipe left - go to next chart
            const nextIndex = (currentIndex + 1) % types.length
            setActiveChart(types[nextIndex])
          }
        }
      },
      [activeChart]
    )

    const charts = useMemo(
      () => ({
        bar: {
          title: 'Financiële Impact Vergelijking',
          description: "Voor vs Na in Euro's per maand",
          component: (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  wrapperStyle={{ outline: 'none' }}
                  contentStyle={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                  }}
                />
                {isSeriesVisible('Voor') && (
                  <Bar dataKey="Voor" fill="#EF4444" radius={[8, 8, 0, 0]} opacity={0.8} />
                )}
                {isSeriesVisible('Na') && (
                  <Bar dataKey="Na" fill="#10B981" radius={[8, 8, 0, 0]} opacity={0.9} />
                )}
              </BarChart>
            </ResponsiveContainer>
          ),
        },
        radar: {
          title: 'Capability Matrix',
          description: 'Multi-dimensionale vergelijking (0-100 schaal)',
          component: (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <RadarChart data={capabilityData}>
                <PolarGrid stroke="rgba(255,255,255,0.2)" />
                <PolarAngleAxis
                  dataKey="capability"
                  stroke="#94a3b8"
                  style={{ fontSize: '11px' }}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" />
                {isSeriesVisible('Voor') && (
                  <Radar
                    name="Voor (Zonder AI)"
                    dataKey="Voor"
                    stroke="#EF4444"
                    fill="#EF4444"
                    fillOpacity={0.3}
                  />
                )}
                {isSeriesVisible('Na') && (
                  <Radar
                    name="Na (Met AI)"
                    dataKey="Na"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.5}
                  />
                )}
              </RadarChart>
            </ResponsiveContainer>
          ),
        },
        projection: {
          title: 'ROI Projectie - 12 Maanden',
          description: 'Cumulatieve besparingen vs investering over tijd',
          component: (
            <ResponsiveContainer width="100%" height={chartHeight}>
              <AreaChart data={projectionData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorBenefit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorInvestment" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.6} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                <YAxis
                  stroke="#94a3b8"
                  style={{ fontSize: '12px' }}
                  tickFormatter={(value) => `€${(value / 1000).toFixed(0)}K`}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }}
                  wrapperStyle={{ outline: 'none' }}
                  contentStyle={{
                    backgroundColor: 'transparent',
                    border: 'none',
                    padding: 0,
                  }}
                />
                {isSeriesVisible('Voor') && (
                  <Area
                    type="monotone"
                    dataKey="Totale Investering"
                    stroke="#EF4444"
                    fillOpacity={1}
                    fill="url(#colorInvestment)"
                  />
                )}
                {isSeriesVisible('Na') && (
                  <Area
                    type="monotone"
                    dataKey="Cumulatieve Besparing"
                    stroke="#10B981"
                    fillOpacity={1}
                    fill="url(#colorBenefit)"
                  />
                )}
                <Line
                  type="monotone"
                  dataKey="Net Benefit"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          ),
        },
      }),
      [financialData, capabilityData, projectionData, CustomTooltip, isSeriesVisible]
    )

    const currentChart = useMemo(() => charts[activeChart], [charts, activeChart])

    return (
      <GlassCard
        className="p-4 sm:p-6 lg:p-8"
        role="article"
        aria-labelledby="comparison-charts-title"
        ref={containerRef}
      >
        {/* Chart Selector - Touch Optimized */}
        <div
          className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center"
          role="tablist"
          aria-label="Chart type selection"
        >
          {(['bar', 'radar', 'projection'] as const).map((chartType) => (
            <button
              key={chartType}
              onClick={() => handleChartTypeChange(chartType)}
              onKeyDown={(e) => handleChartKeyDown(e, chartType)}
              role="tab"
              aria-selected={activeChart === chartType}
              aria-controls={`chart-panel-${chartType}`}
              id={`chart-tab-${chartType}`}
              tabIndex={activeChart === chartType ? 0 : -1}
              className={`
              px-4 py-2.5 sm:px-6 sm:py-3
              min-h-[44px] touch-manipulation
              rounded-xl font-semibold transition-all duration-300
              ${
                activeChart === chartType
                  ? 'bg-accent-primary text-white shadow-glow-primary scale-105'
                  : 'glass-card-subtle text-white/90 hover:text-text-primary hover-lift active:bg-white/15'
              }
            `}
            >
              {chartType === 'bar' && '📊 Financieel'}
              {chartType === 'radar' && '🎯 Capabilities'}
              {chartType === 'projection' && '📈 Projectie'}
            </button>
          ))}
        </div>

        {/* Chart Header with Export */}
        <motion.div
          key={activeChart}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6"
        >
          <div className="text-center sm:text-left flex-1">
            <h3 id="comparison-charts-title" className="text-2xl font-bold gradient-text mb-2">
              {currentChart.title}
            </h3>
            <p className="text-white/90 text-sm">{currentChart.description}</p>
          </div>

          {/* Export Button */}
          <div className="flex justify-center sm:justify-end">
            <ExportButton
              onExportPNG={() =>
                exportToPNG(chartContainerRef.current, `${activeChart}-chart`, {
                  prefix: 'roi-calculator-',
                })
              }
              onExportPDF={() =>
                exportToPDF(chartContainerRef.current, `${activeChart}-chart`, {
                  prefix: 'roi-calculator-',
                })
              }
              isExporting={isExporting}
            />
          </div>
        </motion.div>

        {/* Chart Display - Swipe Enabled */}
        <motion.div
          key={`chart-${activeChart}`}
          ref={chartContainerRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          drag={isMobile ? 'x' : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          onDragEnd={handleDragEnd}
          className="w-full relative"
          role="region"
          aria-label={`${currentChart.title} - Interactive chart visualization. ${isMobile ? 'Swipe left or right to change charts.' : ''}`}
          aria-describedby={`chart-description-${activeChart}`}
        >
          {/* Screen reader description */}
          <div id={`chart-description-${activeChart}`} className="sr-only">
            {currentChart.description}. Use arrow keys to navigate through data points. Press Tab to
            access legend controls.
            {isMobile && ' Swipe left or right to change charts.'}
          </div>

          {/* Swipe Indicator for Mobile */}
          {isMobile && (
            <div className="flex justify-center gap-2 mb-4" aria-hidden="true">
              {(['bar', 'radar', 'projection'] as const).map((type) => (
                <div
                  key={type}
                  className={`h-1 w-8 rounded-full transition-all duration-300 ${
                    activeChart === type ? 'bg-accent-primary' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}

          {currentChart.component}

          {/* Data Table Alternative for Screen Readers */}
          <div className="sr-only">
            <table>
              <caption>Data table for {currentChart.title}</caption>
              <thead>
                <tr>
                  <th scope="col">Category</th>
                  <th scope="col">Voor (Zonder AI)</th>
                  <th scope="col">Na (Met AI)</th>
                </tr>
              </thead>
              <tbody>
                {activeChart === 'bar' &&
                  financialData.map((row, idx) => (
                    <tr key={idx}>
                      <th scope="row">{row.name}</th>
                      <td>{formatCurrency(row.Voor)}</td>
                      <td>{formatCurrency(row.Na)}</td>
                    </tr>
                  ))}
                {activeChart === 'radar' &&
                  capabilityData.map((row, idx) => (
                    <tr key={idx}>
                      <th scope="row">{row.capability}</th>
                      <td>{row.Voor}%</td>
                      <td>{row.Na}%</td>
                    </tr>
                  ))}
                {activeChart === 'projection' && (
                  <>
                    <tr>
                      <th scope="row">Totale Investering (12 maanden)</th>
                      <td colSpan={2}>
                        {formatCurrency(projectionData[11]['Totale Investering'])}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Cumulatieve Besparing (12 maanden)</th>
                      <td colSpan={2}>
                        {formatCurrency(projectionData[11]['Cumulatieve Besparing'])}
                      </td>
                    </tr>
                    <tr>
                      <th scope="row">Net Benefit (12 maanden)</th>
                      <td colSpan={2}>{formatCurrency(projectionData[11]['Net Benefit'])}</td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Interactive Legend */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="mt-6 mb-4"
        >
          <InteractiveLegend
            items={legendItems}
            visibleKeys={visibleSeries}
            onToggle={toggleSeries}
            showReset={true}
            onResetAll={resetVisibility}
            className="justify-center"
          />
        </motion.div>

        {/* Insights */}
        <motion.div
          key={`insights-${activeChart}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {activeChart === 'bar' && (
            <>
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="text-xs text-success font-semibold mb-1">
                  💰 Maandelijkse Besparing
                </div>
                <div className="text-xl font-bold text-text-primary">
                  €{formatNumber(Math.round(metrics.laborCostSavings))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30">
                <div className="text-xs text-accent-primary font-semibold mb-1">
                  📈 Extra Revenue
                </div>
                <div className="text-xl font-bold text-text-primary">
                  €{formatNumber(Math.round(metrics.revenueIncrease))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="text-xs text-secondary font-semibold mb-1">🎯 Net Benefit</div>
                <div className="text-xl font-bold text-text-primary">
                  €{formatNumber(Math.round(metrics.netBenefit))}
                </div>
              </div>
            </>
          )}

          {activeChart === 'radar' && (
            <>
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="text-xs text-success font-semibold mb-1">
                  ⚡ Gemiddelde Verbetering
                </div>
                <div className="text-xl font-bold text-text-primary">+160%</div>
              </div>
              <div className="p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30">
                <div className="text-xs text-accent-primary font-semibold mb-1">
                  🚀 Hoogste Boost
                </div>
                <div className="text-xl font-bold text-text-primary">Tijd Efficiëntie (+375%)</div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="text-xs text-secondary font-semibold mb-1">📊 Totale Score</div>
                <div className="text-xl font-bold text-text-primary">86/100</div>
              </div>
            </>
          )}

          {activeChart === 'projection' && (
            <>
              <div className="p-4 rounded-lg bg-success/10 border border-success/30">
                <div className="text-xs text-success font-semibold mb-1">⏱️ Break-Even</div>
                <div className="text-xl font-bold text-text-primary">
                  {metrics.breakEven < 1 ? '<1 maand' : `${Math.round(metrics.breakEven)} maanden`}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-accent-primary/10 border border-accent-primary/30">
                <div className="text-xs text-accent-primary font-semibold mb-1">
                  💎 Jaar 1 Totaal
                </div>
                <div className="text-xl font-bold text-text-primary">
                  €{formatNumber(Math.round(metrics.netBenefit * 12))}
                </div>
              </div>
              <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/30">
                <div className="text-xs text-secondary font-semibold mb-1">📈 ROI</div>
                <div className="text-xl font-bold text-text-primary">
                  {Math.round(metrics.totalROI)}%
                </div>
              </div>
            </>
          )}
        </motion.div>
      </GlassCard>
    )
  }
)

// Display name for debugging
ComparisonCharts.displayName = 'ComparisonCharts'

export default ComparisonCharts
