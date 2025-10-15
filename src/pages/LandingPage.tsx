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

export const LandingPage: React.FC = () => {
  return (
    <>
      {/* SEO Meta Tags - Homepage */}
      <SEOHead
        title="Future Marketing AI - Autonomous AI Marketing Automation Platform"
        description="Join the first 10 teams building an unfair 2-3 year lead with autonomous AI marketing. 6 AI modules work 24/7. Founding member pricing: €15,000/month. Only 2 slots remaining."
        keywords={[
          'AI marketing automation',
          'autonomous marketing',
          'marketing AI platform',
          'SaaS marketing automation',
          'AI marketing software',
          'marketing automation platform',
          'enterprise marketing AI',
        ]}
        canonical="https://futuremarketingai.com"
        ogImage="https://futuremarketingai.com/og-image-home.png"
      />

      {/* Structured Data - Organization + Website */}
      <StructuredDataPresets.organization />
      <StructuredDataPresets.website />

      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
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
      </div>
    </>
  )
}
