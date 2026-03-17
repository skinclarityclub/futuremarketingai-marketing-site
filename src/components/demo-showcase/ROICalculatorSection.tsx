import React, { lazy, Suspense, useState, useCallback } from 'react'
import { Calculator } from 'lucide-react'
import {
  CompanySizeSelector,
  PrimaryGoalSelector,
  ChannelsSelector,
  companySizeToTeamSize,
  InputSlider,
} from '../calculator'
import type { CompanySize, PrimaryGoal } from '../calculator'
import type { WizardInputs } from '../calculator/CalculatorWizard'
import type { ChannelsCount } from '../../utils/icpScoring'

const CalculatorWizard = lazy(() =>
  import('../calculator/CalculatorWizard').then((m) => ({ default: m.CalculatorWizard }))
)

/**
 * ROICalculatorSection
 *
 * Simplified ROI calculator for the demo-showcase page.
 * Soft-gated: results shown freely, email capture offered AFTER completion.
 */
const ROICalculatorSection: React.FC = () => {
  // Wizard input state
  const [companySize, setCompanySize] = useState<CompanySize | undefined>(undefined)
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal | undefined>(undefined)
  const [teamSize, setTeamSize] = useState(5)
  const [channels, setChannels] = useState<ChannelsCount>('3-5')
  const [marketingSpend, setMarketingSpend] = useState(0)
  const [campaignsPerMonth, setCampaignsPerMonth] = useState(10)
  const [avgSalary, setAvgSalary] = useState(60000)
  const [monthlyAdBudget, setMonthlyAdBudget] = useState(0)
  const [testingLevel, setTestingLevel] = useState(0)

  // Completion / email capture state
  const [isComplete, setIsComplete] = useState(false)
  const [email, setEmail] = useState('')
  const [emailSubmitted, setEmailSubmitted] = useState(false)

  const wizardInputs: WizardInputs = {
    companySize,
    primaryGoal,
    teamSize,
    channels,
    marketingSpend,
    campaignsPerMonth,
    avgSalary,
    monthlyAdBudget,
    testingLevel,
  }

  const handleInputChange = useCallback((key: keyof WizardInputs, value: any) => {
    switch (key) {
      case 'companySize': {
        const size = value as CompanySize
        setCompanySize(size)
        setTeamSize(companySizeToTeamSize(size))
        break
      }
      case 'teamSize':
        setTeamSize(value as number)
        break
      case 'channels':
        setChannels(value as ChannelsCount)
        break
      case 'marketingSpend':
        setMarketingSpend(value as number)
        break
      case 'campaignsPerMonth':
        setCampaignsPerMonth(value as number)
        break
      case 'avgSalary':
        setAvgSalary(value as number)
        break
      case 'primaryGoal':
        setPrimaryGoal(value as PrimaryGoal)
        break
      case 'monthlyAdBudget':
        setMonthlyAdBudget(value as number)
        break
      case 'testingLevel':
        setTestingLevel(value as number)
        break
    }
  }, [])

  const handleComplete = useCallback(() => {
    setIsComplete(true)
  }, [])

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      return
    }
    // Future: send email to backend / analytics
    setEmailSubmitted(true)
  }

  const renderStep = (
    step: number,
    inputs: WizardInputs,
    onChange: (key: keyof WizardInputs, value: any) => void
  ) => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <CompanySizeSelector
              value={inputs.companySize}
              onChange={(size) => onChange('companySize', size)}
            />
            <ChannelsSelector value={inputs.channels} onChange={(ch) => onChange('channels', ch)} />
            <PrimaryGoalSelector
              value={inputs.primaryGoal}
              onChange={(goal) => onChange('primaryGoal', goal)}
            />
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <InputSlider
              label="Interne teamkosten (maandelijks)"
              value={inputs.marketingSpend}
              min={0}
              max={50000}
              step={1000}
              isCurrency
              onChange={(value) => onChange('marketingSpend', value)}
              description="Salarissen, tools, software - uw interne marketingteam kosten"
            />
            <InputSlider
              label="Campagnes per maand"
              value={inputs.campaignsPerMonth}
              min={1}
              max={200}
              step={5}
              unit="/month"
              onChange={(value) => onChange('campaignsPerMonth', value)}
              description="Hoeveel marketingcampagnes voert u per maand uit?"
            />
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-sm text-white/80">
                Bijna klaar! Deze geavanceerde instellingen helpen ons een nauwkeurigere ROI te
                berekenen voor uw specifieke situatie.
              </p>
            </div>
            <InputSlider
              label="Gemiddeld salaris medewerker (jaarlijks)"
              value={inputs.avgSalary}
              min={30000}
              max={200000}
              step={5000}
              isCurrency
              onChange={(value) => onChange('avgSalary', value)}
              description="Gemiddeld jaarsalaris van uw marketingteamleden"
            />
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30">
              <div className="flex items-start gap-3">
                <span className="text-3xl">&#128142;</span>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    Eerst testen, dan schalen
                  </h4>
                  <p className="text-xs text-white/70">
                    De meeste bedrijven verspillen 30-50% van hun advertentiebudget door te lanceren
                    zonder te testen. AI-gestuurde testing kan uw ROAS met 4-7x verbeteren!
                  </p>
                </div>
              </div>
            </div>
            <InputSlider
              label="Advertentie-uitgaven (maandelijks, optioneel)"
              value={inputs.monthlyAdBudget || 0}
              min={0}
              max={50000}
              step={1000}
              isCurrency
              onChange={(value) => onChange('monthlyAdBudget', value)}
              description="Facebook, Google, LinkedIn Ads - los van teamkosten"
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <section id="calculator" className="py-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-accent-system/10 border border-accent-system/20 mb-4">
            <Calculator className="w-7 h-7 text-accent-system" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Bereken uw besparing</h2>
          <p className="text-white/60 max-w-xl mx-auto">
            Vul uw cijfers in en zie direct wat AI automation u oplevert. Geen email nodig.
          </p>
        </div>

        {/* Calculator Wrapper */}
        <div className="rounded-card border border-border-primary bg-bg-surface/60 p-6 md:p-8 backdrop-blur-md">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-accent-system border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <CalculatorWizard
              inputs={wizardInputs}
              onInputChange={handleInputChange}
              onComplete={handleComplete}
              renderStep={renderStep}
            />
          </Suspense>
        </div>

        {/* Email Capture - shown after completion */}
        {isComplete && !emailSubmitted && (
          <div className="mt-8 rounded-card border border-accent-system/20 bg-accent-system/5 p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Sla uw resultaten op</h3>
            <p className="text-white/60 mb-4">
              Ontvang een gepersonaliseerd implementatie-roadmap per email.
            </p>
            <form
              onSubmit={handleEmailSubmit}
              className="flex items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="uw@email.com"
                className="flex-1 border border-border-primary bg-bg-elevated rounded-btn px-4 py-2 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-accent-system/50"
              />
              <button
                type="submit"
                className="bg-accent-system text-bg-deep rounded-btn px-6 py-2 font-medium hover:opacity-90 transition-opacity"
              >
                Verstuur
              </button>
            </form>
          </div>
        )}

        {emailSubmitted && (
          <div className="mt-8 rounded-card border border-accent-success/20 bg-accent-success/5 p-6 text-center">
            <p className="text-accent-success font-medium">
              Uw resultaten worden verzonden naar {email}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

export default ROICalculatorSection
