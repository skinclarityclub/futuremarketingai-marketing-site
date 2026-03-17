import { lazy, Suspense } from 'react'
import { SimpleHeader } from '../components/landing'
import HeroSection from '../components/demo-showcase/HeroSection'
import SocialProofBar from '../components/demo-showcase/SocialProofBar'
import AutomationShowcase from '../components/demo-showcase/AutomationShowcase'
import ServicePreview from '../components/demo-showcase/ServicePreview'
import { FounderSection } from '../components/demo-showcase/FounderSection'
import FinalCTA from '../components/demo-showcase/FinalCTA'

const ROICalculatorSection = lazy(() => import('../components/demo-showcase/ROICalculatorSection'))

export default function DemoShowcase() {
  return (
    <div className="min-h-screen bg-bg-deep">
      <SimpleHeader />

      <main>
        <HeroSection />
        <SocialProofBar />

        <div className="mx-auto max-w-5xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />
        </div>

        <AutomationShowcase />

        <div className="mx-auto max-w-5xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />
        </div>

        <ServicePreview />

        <div className="mx-auto max-w-5xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />
        </div>

        <Suspense fallback={<div className="h-96" />}>
          <ROICalculatorSection />
        </Suspense>

        <div className="mx-auto max-w-5xl px-4">
          <div className="h-px bg-gradient-to-r from-transparent via-border-primary to-transparent" />
        </div>

        <FounderSection />
        <FinalCTA />
      </main>
    </div>
  )
}
