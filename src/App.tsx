import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import {
  LoadingFallback,
  FloatingNav,
  Footer,
  LandingFooter,
  PersonalizationControlBar,
  TopBarControls,
  ErrorBoundary,
  AsyncErrorBoundary,
  SkipLink,
  AIJourneyAssistant,
  CookieConsentBanner,
  SEOHelmet,
} from './components'
import NudgeToast from './components/ai-assistant/NudgeToast'
import { useScrollToTop } from './hooks'
import { trackGA4PageView } from './utils/ga4'
import { hotjarStateChange } from './utils/hotjar'
import SentryTestButton from './components/common/SentryTestButton'
import { ToastProvider } from './contexts/ToastContext'
import { FloatingElementProvider } from './contexts/FloatingElementContext'

// Lazy load all page components for code splitting
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({ default: module.LandingPage }))
)
const Explorer = lazy(() => import('./pages/Explorer'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Calculator = lazy(() => import('./pages/Calculator'))
const AdBuilder = lazy(() => import('./pages/AdBuilder'))
const CalculatorTest = lazy(() => import('./pages/CalculatorTest'))
const LegalPage = lazy(() => import('./pages/LegalPage'))

// SEO Deep Dive Pages
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))

// Additional Marketing Pages
const LoginPage = lazy(() => import('./pages/LoginPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))

// Placeholder Pages (Coming Soon)
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'))
const CareersPage = lazy(() => import('./pages/CareersPage'))
const PartnersPage = lazy(() => import('./pages/PartnersPage'))
const SecurityPage = lazy(() => import('./pages/SecurityPage'))
const GDPRPage = lazy(() => import('./pages/GDPRPage'))

/**
 * App - Main application component with routing
 *
 * Configures all routes and layers:
 * - / - Marketing landing page (no demo UI)
 * - /demo - Interactive demo (sphere visualization)
 * - /explorer - System exploration
 * - /dashboard - Analytics and control (includes Strategy Hub)
 * - /calculator - ROI calculation
 */
function App() {
  const location = useLocation()

  // Enable smooth scroll to top on route change
  useScrollToTop()

  // Check if we're on a demo route (not landing/marketing pages)
  const marketingPaths = [
    '/',
    '/features',
    '/pricing',
    '/how-it-works',
    '/about',
    '/login',
    '/contact',
    '/case-studies',
    '/blog',
    '/documentation',
    '/careers',
    '/partners',
    '/security',
    '/gdpr',
  ]
  const isMarketingRoute = marketingPaths.includes(location.pathname)
  const isDemoRoute = !isMarketingRoute

  // Development-only analytics validation and performance logging
  // Note: Analytics are now initialized via CookieConsentBanner after user consent
  useEffect(() => {
    // Load analytics validator in development mode
    if (import.meta.env.DEV) {
      void import('./utils/analytics-validator').then(({ validateAnalytics }) => {
        // Run validation after a delay to allow cookie consent + initialization
        setTimeout(() => {
          validateAnalytics()
        }, 3000)
      })

      // Log performance metrics in development
      void import('./utils/webVitals').then(({ logPerformanceMetrics }) => {
        setTimeout(() => {
          logPerformanceMetrics()
        }, 4000)
      })
    }
  }, [])

  // Track page views and state changes on route change
  // Only track if user has given consent (analytics initialized)
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (consent === 'true') {
      trackGA4PageView(location.pathname, document.title)
      hotjarStateChange(location.pathname)
    }
  }, [location.pathname])

  return (
    <HelmetProvider>
      <FloatingElementProvider>
        <ToastProvider>
          <ErrorBoundary>
            {/* Skip Link - First element for keyboard accessibility */}
            <SkipLink />

            {/* SEO Meta Tags - Dynamic per page */}
            <SEOHelmet />

            {/* Top Bar Controls - Language switcher (always visible) */}
            <TopBarControls />

            {/* Demo UI Elements - Only show on demo routes, not on landing page */}
            {isDemoRoute && (
              <>
                {/* Floating Navigation - Always visible */}
                <FloatingNav />

                {/* Personalization Control Bar - Always visible when industry selected */}
                <PersonalizationControlBar />
              </>
            )}

            {/* AI Journey Assistant - Show everywhere (conversion opportunity on landing page too) */}
            <AIJourneyAssistant />

            {/* Sentry Test Button - Development only (hidden for demo) */}
            {import.meta.env.DEV && false && <SentryTestButton />}

            {/* Main Content Routes */}
            <main id="main-content" className="focus:outline-none" tabIndex={-1}>
              <AsyncErrorBoundary>
                <Suspense fallback={<LoadingFallback fullScreen message="Loading page..." />}>
                  <Routes>
                    {/* Marketing Pages */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/features" element={<FeaturesPage />} />
                    <Route path="/pricing" element={<PricingPage />} />
                    <Route path="/how-it-works" element={<HowItWorksPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/contact" element={<ContactPage />} />

                    {/* Placeholder Pages (Coming Soon) */}
                    <Route path="/case-studies" element={<CaseStudiesPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/documentation" element={<DocumentationPage />} />
                    <Route path="/careers" element={<CareersPage />} />
                    <Route path="/partners" element={<PartnersPage />} />
                    <Route path="/security" element={<SecurityPage />} />
                    <Route path="/gdpr" element={<GDPRPage />} />

                    {/* Demo Pages */}
                    <Route path="/demo" element={<Dashboard />} />
                    <Route path="/explorer" element={<Explorer />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calculator" element={<Calculator />} />
                    <Route path="/calculator-test" element={<CalculatorTest />} />
                    <Route path="/ad-builder" element={<AdBuilder />} />

                    {/* Legal Documents */}
                    <Route path="/privacy" element={<LegalPage />} />
                    <Route path="/cookies" element={<LegalPage />} />
                    <Route path="/terms" element={<LegalPage />} />
                  </Routes>
                </Suspense>
              </AsyncErrorBoundary>
            </main>

            {/* Footer - Context-aware */}
            {isMarketingRoute ? <LandingFooter /> : <Footer />}
          </ErrorBoundary>

          {/* Nudge Toast System */}
          <NudgeToast />

          {/* Cookie Consent Banner - GDPR/CCPA Compliance */}
          <CookieConsentBanner />
        </ToastProvider>
      </FloatingElementProvider>
    </HelmetProvider>
  )
}

export default App
