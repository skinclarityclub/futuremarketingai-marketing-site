/**
 * Landing Page
 * Integrates all converted components
 *
 * SEO-optimized homepage for maximum discoverability
 */

import React from 'react'
import { SimpleHeader } from '../components/landing/SimpleHeader'
import { Hero } from '../components/landing/Hero'
import { SEOHead } from '../components/seo/SEOHead'
import { StructuredDataPresets } from '../components/seo/StructuredData'
import { StickyBottomCTA } from '../components/mobile'
import { GradientMesh } from '../components/common'
import { useIsMobile } from '../hooks'

export const LandingPage: React.FC = () => {
  const isMobile = useIsMobile()

  return (
    <>
      {/* SEO Meta Tags - Homepage */}
      <SEOHead
        title="FutureAI - AI Systems That Run Your Business"
        description="AI automation, chatbots, and voice agents for growth teams. Three specialized platforms, one agency. Book a free AI audit."
        keywords={[
          'AI agency',
          'AI automation',
          'AI chatbots',
          'AI voice agents',
          'business automation',
          'FutureAI',
        ]}
        canonical="https://futuremarketingai.com"
        ogImage="https://futuremarketingai.com/og-image-home.png"
      />

      {/* Structured Data - Organization + Website */}
      <StructuredDataPresets.organization />
      <StructuredDataPresets.website />

      <div className="relative min-h-screen bg-bg-deep">
        {/* Global background mesh — replaces old Framer Motion background layers */}
        <GradientMesh />

        {/* Simple Header - Minimal navigation for conversion */}
        <SimpleHeader />

        {/* Hero Section - Now with placeholders */}
        <Hero />

        {/* Below-the-fold content - Lazy loaded */}
        {/* <Suspense fallback={<LoadingFallback />}>
        <section className="relative z-10 max-w-5xl mx-auto px-6 py-20">
          <LazyLeadForm onSubmit={handleLeadFormSubmit} />
        </section>
      </Suspense> */}

        {/* Footer wordt centraal gerenderd in App.tsx */}

        {/* Accessibility Helper - Floating */}
        {/* <ResponsiveAccessibilityHelper /> */}

        {/* Sticky Bottom CTA - Mobile Only */}
        {isMobile && <StickyBottomCTA />}
      </div>
    </>
  )
}
