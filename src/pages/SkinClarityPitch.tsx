import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  Package,
  ShoppingCart,
  DollarSign,
  BarChart3,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  Box,
  CheckCircle,
} from 'lucide-react'

/**
 * SkinClarity Club Growth Projection Tool - Fulfillment Partner Pitch
 *
 * Standalone page voor het overtuigen van fulfillment partners
 * URL: /skinclarity-pitch
 */

interface ProjectionData {
  month: number
  ordersPerWeek: number
  ordersPerMonth: number
  revenue: number
  adSpend: number
  roas: number
  contentPieces: number
  engagement: number
}

interface GrowthMetrics {
  current: ProjectionData
  month3: ProjectionData
  month6: ProjectionData
  month12: ProjectionData
}

export const SkinClarityPitchPage = () => {
  // Huidige situatie (REALISTISCH)
  const [currentOrders] = useState(1.5) // 1-2 per week gemiddeld = 1.5
  const [totalSkuCount] = useState(60) // Totaal aantal producten
  const [warehouseSkuCount] = useState(30) // Alleen bestsellers op voorraad bij fulfillment
  const [avgOrderValue] = useState(85) // Beauty products gemiddeld €85
  const [currentMonthlyRevenue] = useState(currentOrders * 4 * avgOrderValue)

  const calculateGrowth = useMemo((): GrowthMetrics => {
    const current: ProjectionData = {
      month: 0,
      ordersPerWeek: currentOrders,
      ordersPerMonth: currentOrders * 4,
      revenue: currentMonthlyRevenue,
      adSpend: 0,
      roas: 0,
      contentPieces: 2,
      engagement: 0.8,
    }

    // Maand 3: Realistische early growth (1.5 → 5 orders/week = 3.3x)
    const month3: ProjectionData = {
      month: 3,
      ordersPerWeek: 5,
      ordersPerMonth: 5 * 4,
      revenue: 5 * 4 * avgOrderValue,
      adSpend: 3000,
      roas: 2.8,
      contentPieces: 25,
      engagement: 3.5,
    }

    // Maand 6: Groei fase (5 → 15 orders/week = 3x)
    const month6: ProjectionData = {
      month: 6,
      ordersPerWeek: 15,
      ordersPerMonth: 15 * 4,
      revenue: 15 * 4 * avgOrderValue,
      adSpend: 5000,
      roas: 4.0,
      contentPieces: 32,
      engagement: 5.5,
    }

    // Maand 12: Scale fase (15 → 30 orders/week = 2x)
    // Totaal: 20x groei (conservatief, verdedigbaar)
    const month12: ProjectionData = {
      month: 12,
      ordersPerWeek: 30,
      ordersPerMonth: 30 * 4,
      revenue: 30 * 4 * avgOrderValue,
      adSpend: 7000,
      roas: 4.9,
      contentPieces: 38,
      engagement: 7.2,
    }

    return { current, month3, month6, month12 }
  }, [currentOrders, currentMonthlyRevenue, avgOrderValue])

  const growth = calculateGrowth

  const fulfillmentMetrics = useMemo(() => {
    // Realistic stock: 3-4 units per SKU (let's say 3.5 average)
    const unitsPerSku = 3.5

    return {
      currentWeeklyShipments: growth.current.ordersPerWeek,
      month3WeeklyShipments: growth.month3.ordersPerWeek,
      month6WeeklyShipments: growth.month6.ordersPerWeek,
      month12WeeklyShipments: growth.month12.ordersPerWeek,
      totalShipments3Months: growth.month3.ordersPerMonth * 3,
      totalShipments6Months: growth.month6.ordersPerMonth * 6,
      totalShipments12Months: growth.month12.ordersPerMonth * 12,
      totalSkuCount: totalSkuCount,
      warehouseSkuCount: warehouseSkuCount,
      storageUnitsNeeded: Math.round(warehouseSkuCount * unitsPerSku), // 30 SKU's × 3-4 stuks = ~105 units
      unitsPerSku: unitsPerSku,
      percentageWarehouseOrders: 85, // 85% van orders zijn bestsellers
    }
  }, [growth, totalSkuCount, warehouseSkuCount])

  const MetricCard = ({
    icon: Icon,
    label,
    current,
    projected,
    suffix = '',
    highlight = false,
  }: {
    icon: React.ElementType
    label: string
    current: number | string
    projected: number | string
    suffix?: string
    highlight?: boolean
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-6 rounded-xl border ${
        highlight
          ? 'bg-gradient-to-br from-purple-500/10 to-blue-500/10 border-purple-500/30'
          : 'bg-white/5 border-white/10'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className={`w-5 h-5 ${highlight ? 'text-purple-400' : 'text-blue-400'}`} />
        <span className="text-sm text-gray-400">{label}</span>
      </div>

      <div className="space-y-2">
        <div>
          <div className="text-xs text-gray-500">Nu (zonder marketing)</div>
          <div className="text-2xl font-bold text-gray-300">
            {typeof current === 'number' ? current.toLocaleString() : current}
            <span className="text-sm text-gray-500 ml-1">{suffix}</span>
          </div>
        </div>

        <ArrowRight className="w-4 h-4 text-green-400" />

        <div>
          <div className="text-xs text-gray-500">Na 12 maanden met FutureMarketing</div>
          <div className={`text-3xl font-bold ${highlight ? 'text-purple-400' : 'text-green-400'}`}>
            {typeof projected === 'number' ? projected.toLocaleString() : projected}
            <span className="text-sm text-gray-400 ml-1">{suffix}</span>
          </div>
        </div>
      </div>

      {typeof current === 'number' && typeof projected === 'number' && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="text-xs text-gray-500">Groei</div>
          <div className="text-lg font-bold text-green-400">
            {((projected / current - 1) * 100).toFixed(0)}%{' '}
            <span className="text-sm text-gray-500">stijging</span>
          </div>
        </div>
      )}
    </motion.div>
  )

  const TimelineCard = ({ data, period }: { data: ProjectionData; period: string }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-white/5 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">{period}</h3>
        <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm">
          Maand {data.month}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-xs text-gray-500">Orders/week</div>
          <div className="text-2xl font-bold text-white">{data.ordersPerWeek}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Orders/maand</div>
          <div className="text-2xl font-bold text-white">{data.ordersPerMonth}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Omzet/maand</div>
          <div className="text-2xl font-bold text-green-400">
            €{(data.revenue / 1000).toFixed(0)}k
          </div>
        </div>
        <div>
          <div className="text-xs text-gray-500">ROAS</div>
          <div className="text-2xl font-bold text-blue-400">
            {data.roas > 0 ? `${data.roas}x` : 'N/A'}
          </div>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050814] to-[#0a0e27] text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">SkinClarity Club Growth Projection</span>
          </div>

          <h1 className="text-5xl font-bold mb-4">
            Van <span className="text-red-400">1-2 orders/week</span> naar{' '}
            <span className="text-green-400">30 orders/week</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-4">
            Realistische groeiprojectie voor SkinClarity Club met FutureMarketingAI marketing
            automation systeem
          </p>

          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
            <Package className="w-5 h-5 text-blue-400" />
            <span className="text-lg text-blue-300">
              Fulfillment Partnership Voorstel voor{' '}
              <strong className="text-white">Innostock</strong>
            </span>
          </div>
        </motion.div>

        {/* Current Situation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-12 p-8 rounded-2xl bg-red-500/10 border border-red-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-6 h-6 text-red-400" />
            <h2 className="text-2xl font-bold text-white">Huidige Situatie (Zonder Marketing)</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <div className="text-sm text-gray-400">Orders per week</div>
              <div className="text-3xl font-bold text-red-400">{currentOrders}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Orders per maand</div>
              <div className="text-3xl font-bold text-red-400">{currentOrders * 4}</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Totaal SKU's</div>
              <div className="text-3xl font-bold text-white">{totalSkuCount}</div>
              <div className="text-xs text-purple-400 mt-1">{warehouseSkuCount} op voorraad</div>
            </div>
            <div>
              <div className="text-sm text-gray-400">Maandelijkse omzet</div>
              <div className="text-3xl font-bold text-red-400">
                €{(currentMonthlyRevenue / 1000).toFixed(1)}k
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-red-500/5 border border-red-500/20">
            <p className="text-sm text-red-300 mb-2">
              <strong>Waarom Innostock?</strong> We zoeken een partner die met ons meegroeit vanaf
              dag 1, niet één die alleen geïnteresseerd is als we al groot zijn.
            </p>
            <p className="text-sm text-purple-300 mb-2">
              <strong>Wat we vragen:</strong> Start met 30 bestseller SKU's op voorraad. Overige
              producten dropship vanaf leverancier. Schaal op naar volledige voorraad bij groei.
            </p>
            <p className="text-sm text-blue-300">
              <strong>Jouw voordeel:</strong> Huidverzorgingsproducten = kleine potjes, tubes,
              flesjes. Minimale opslagruimte nodig (±1-2 pallets voor 105 units). Maximale groei
              potentieel.
            </p>
          </div>
        </motion.div>

        {/* Key Metrics Growth */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">
            <span className="text-gradient bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Verwachte Groei met FutureMarketingAI
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <MetricCard
              icon={ShoppingCart}
              label="Orders per week"
              current={growth.current.ordersPerWeek}
              projected={growth.month12.ordersPerWeek}
              highlight
            />

            <MetricCard
              icon={Package}
              label="Orders per maand"
              current={growth.current.ordersPerMonth}
              projected={growth.month12.ordersPerMonth}
              highlight
            />

            <MetricCard
              icon={DollarSign}
              label="Maandelijkse omzet"
              current={`€${(growth.current.revenue / 1000).toFixed(0)}k`}
              projected={`€${(growth.month12.revenue / 1000).toFixed(0)}k`}
            />

            <MetricCard
              icon={TrendingUp}
              label="Content output/maand"
              current={growth.current.contentPieces}
              projected={growth.month12.contentPieces}
              suffix="posts"
            />

            <MetricCard
              icon={Users}
              label="Engagement rate"
              current={`${growth.current.engagement}%`}
              projected={`${growth.month12.engagement}%`}
            />

            <MetricCard
              icon={BarChart3}
              label="Ad ROAS"
              current="N/A"
              projected={`${growth.month12.roas}x`}
            />
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Groei Tijdlijn</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TimelineCard data={growth.month3} period="Integration Phase" />
            <TimelineCard data={growth.month6} period="Optimization Phase" />
            <TimelineCard data={growth.month12} period="Autonomous Phase" />
          </div>
        </div>

        {/* Fulfillment Partner Value */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-green-500/10 to-blue-500/10 border border-green-500/30"
        >
          <div className="flex items-center gap-3 mb-6">
            <Package className="w-6 h-6 text-green-400" />
            <h2 className="text-2xl font-bold text-white">
              Waarom Dit Interessant Is Voor Innostock
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-green-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Volume Groei Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-gray-300">Nu (week 1)</span>
                  <span className="font-bold text-red-400">
                    {fulfillmentMetrics.currentWeeklyShipments.toFixed(0)} orders/week
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-gray-300">Maand 3</span>
                  <span className="font-bold text-yellow-400">
                    {fulfillmentMetrics.month3WeeklyShipments} orders/week
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-gray-300">Maand 6</span>
                  <span className="font-bold text-blue-400">
                    {fulfillmentMetrics.month6WeeklyShipments} orders/week
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                  <span className="text-gray-300 font-semibold">Maand 12</span>
                  <span className="font-bold text-green-400 text-lg">
                    {fulfillmentMetrics.month12WeeklyShipments} orders/week
                  </span>
                </div>
                <div className="mt-4 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <div className="text-xs text-gray-400 mb-1">Totaal eerste jaar</div>
                  <div className="text-2xl font-bold text-purple-400">
                    {fulfillmentMetrics.totalShipments12Months.toLocaleString()} orders
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Gemiddeld {Math.round(fulfillmentMetrics.totalShipments12Months / 12)} per maand
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-blue-400 mb-4 flex items-center gap-2">
                <Box className="w-5 h-5" />
                Operationele Details (Super Lean Start)
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-gray-300">Totaal SKU's SkinClarity</span>
                  <span className="font-bold text-white">
                    {fulfillmentMetrics.totalSkuCount} producten
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  <span className="text-gray-300">SKU's bij Innostock</span>
                  <span className="font-bold text-blue-400">
                    {fulfillmentMetrics.warehouseSkuCount} bestsellers
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-gray-300">Units per SKU</span>
                  <span className="font-bold text-blue-400">
                    {Math.round(fulfillmentMetrics.unitsPerSku)} stuks (3-4 gemiddeld)
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-white/5">
                  <span className="text-gray-300">Totaal storage units</span>
                  <span className="font-bold text-blue-400">
                    ~{fulfillmentMetrics.storageUnitsNeeded} producten
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-lg bg-green-500/20 border border-green-500/30">
                  <span className="text-gray-300 flex items-center gap-2 font-semibold">
                    <Package className="w-4 h-4" />
                    Fysieke ruimte nodig
                  </span>
                  <span className="font-bold text-green-400 text-lg">1-2 pallets</span>
                </div>
                <div className="mt-2 p-3 rounded-lg bg-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Orders via warehouse</span>
                    <span className="font-bold text-green-400">
                      ~{fulfillmentMetrics.percentageWarehouseOrders}%
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Overige 15% = dropship van leverancier
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-300 mb-3">
              <strong>Win-Win voor Innostock:</strong> Start nu met ons terwijl we klein zijn. Over
              12 maanden ship je {fulfillmentMetrics.month12WeeklyShipments} orders per week voor
              SkinClarity Club - dat is <strong>20x meer volume</strong> dan nu! (conservatieve
              schatting)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div className="p-3 rounded bg-white/5 border border-green-500/20">
                <div className="text-xs text-gray-400">Fase 1: Nu - 3 maanden</div>
                <div className="text-sm font-bold text-green-400">{warehouseSkuCount} SKU's</div>
                <div className="text-xs text-gray-500">
                  ~{Math.round(warehouseSkuCount * 3.5)} units (3-4/SKU)
                </div>
                <div className="text-xs text-blue-400 mt-1">≈ 1-2 pallets ruimte</div>
              </div>
              <div className="p-3 rounded bg-white/5 border border-blue-500/20">
                <div className="text-xs text-gray-400">Fase 2: 3-6 maanden</div>
                <div className="text-sm font-bold text-blue-400">45 SKU's</div>
                <div className="text-xs text-gray-500">~{Math.round(45 * 5)} units (4-6/SKU)</div>
                <div className="text-xs text-blue-400 mt-1">≈ 2-3 pallets ruimte</div>
              </div>
              <div className="p-3 rounded bg-white/5 border border-purple-500/20">
                <div className="text-xs text-gray-400">Fase 3: 6-12 maanden</div>
                <div className="text-sm font-bold text-purple-400">{totalSkuCount} SKU's</div>
                <div className="text-xs text-gray-500">
                  ~{Math.round(totalSkuCount * 8)} units (6-10/SKU)
                </div>
                <div className="text-xs text-blue-400 mt-1">≈ 4-5 pallets ruimte</div>
              </div>
            </div>
          </div>

          {/* Extra Value Props voor Innostock */}
          <div className="mt-6 p-4 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <h4 className="text-sm font-bold text-blue-300 mb-3">
              🎯 Waarom Nu Instappen Slim Is:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Early Partner Status:</strong> Word onze preferred
                  fulfillment partner voor toekomstige merken
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Bewezen Marketing:</strong> €15k/maand investment
                  toont commitment (niet "we gaan proberen")
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Laag Risico:</strong> 105 units = €2,500-3,500 aan
                  voorraad (wegwerpbaar risico)
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Beauty = Margins:</strong> Huidverzorging heeft
                  hogere fulfillment fees dan basic e-commerce
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="text-white">Schaalbaarheid:</strong> Dit is pas het begin -
                  meer producten, meer merken mogelijk
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center p-12 rounded-2xl bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30"
        >
          <h2 className="text-3xl font-bold mb-4">Realistische Groei, Gefaseerd Opschalen 🚀</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            SkinClarity Club start volgende maand met FutureMarketingAI (€15k/maand investment). De
            getallen hierboven zijn <strong>conservatieve, verdedigbare schattingen</strong>{' '}
            gebaseerd op bewezen industrie benchmarks voor beauty e-commerce met professionele
            marketing.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <div className="px-6 py-3 rounded-lg bg-white/5 border border-white/10">
              <div className="text-sm text-gray-400">Nu</div>
              <div className="text-2xl font-bold text-red-400">1-2 orders/week</div>
            </div>

            <ArrowRight className="w-8 h-8 text-green-400" />

            <div className="px-6 py-3 rounded-lg bg-green-500/20 border border-green-500/30">
              <div className="text-sm text-gray-400">Over 12 maanden</div>
              <div className="text-2xl font-bold text-green-400">30 orders/week</div>
            </div>
          </div>

          <div className="mt-6 text-sm text-gray-400">
            <strong className="text-purple-400">Groei factor: 20x</strong> in 12 maanden
            (conservatief)
          </div>

          <p className="mt-8 text-lg text-gray-400">
            <strong className="text-white">De vraag is niet óf SkinClarity Club groeit,</strong>
            <br />
            maar of Innostock met ons mee wil groeien vanaf dag 1.
          </p>

          <div className="mt-8 p-6 rounded-lg bg-blue-500/10 border-2 border-blue-500/30">
            <p className="text-center text-blue-300">
              <strong className="text-white text-xl">Wat zeg je ervan, Innostock?</strong>
              <br />
              <span className="text-lg">1-2 pallets nu. 30 shipments/week over 12 maanden.</span>
              <br />
              <span className="text-sm text-gray-400 mt-2 block">
                Minimaal risico. Solide groei. Realistische verwachtingen.
              </span>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default SkinClarityPitchPage
