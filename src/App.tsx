import { useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import {
  LoadingFallback,
  // FloatingNav,  // Parked during demo page restructure
  Footer,
  LandingFooter,
  // PersonalizationControlBar,  // Parked during demo page restructure
  TopBarControls,
  ErrorBoundary,
  AsyncErrorBoundary,
  SkipLink,
  CookieConsentBanner,
  SEOHelmet,
} from './components'
import { ChatWidget } from './components/chatbot'
import { DEMO_GUIDE_STARTERS } from './lib/chatbot/personas'
import { useConciergeContext } from './hooks/useConciergeContext'
import { useScrollToTop, useIsMobile } from './hooks'
import { useTranslation } from 'react-i18next'
import { trackGA4PageView } from './utils/ga4'
import { hotjarStateChange } from './utils/hotjar'
import SentryTestButton from './components/common/SentryTestButton'
import { ToastProvider } from './contexts/ToastContext'

// Lazy load all page components for code splitting
// const Hero = lazy(() => import('./pages/Hero'))  // Parked during demo page restructure
const DemoShowcase = lazy(() => import('./pages/DemoShowcase'))
const LandingPage = lazy(() =>
  import('./pages/LandingPage').then((module) => ({ default: module.LandingPage }))
)
// Parked during demo page restructure
// const DemoIntro = lazy(() =>
//   import('./components/demo/DemoIntro').then((module) => ({ default: module.DemoIntro }))
// )
// const Explorer = lazy(() => import('./pages/Explorer'))
// const Dashboard = lazy(() => import('./pages/Dashboard'))
const Calculator = lazy(() => import('./pages/Calculator'))
// const AdBuilder = lazy(() => import('./pages/AdBuilder'))  // Parked during demo page restructure
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

// Service Pages
const AutomationsPage = lazy(() => import('./pages/AutomationsPage'))
const ChatbotsPage = lazy(() => import('./pages/ChatbotsPage'))
const VoiceAgentsPage = lazy(() => import('./pages/VoiceAgentsPage'))
const MarketingMachinePage = lazy(() => import('./pages/MarketingMachinePage'))

// Placeholder Pages (Coming Soon)
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'))
const CareersPage = lazy(() => import('./pages/CareersPage'))
const PartnersPage = lazy(() => import('./pages/PartnersPage'))
const SecurityPage = lazy(() => import('./pages/SecurityPage'))
const GDPRPage = lazy(() => import('./pages/GDPRPage'))

// SkinClarity Club Pitch Page (Fulfillment Partner Presentation)
const SkinClarityPitchPage = lazy(() =>
  import('./pages/SkinClarityPitch').then((module) => ({ default: module.SkinClarityPitchPage }))
)

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
  const isMobile = useIsMobile()
  const { i18n } = useTranslation()
  const lang = i18n.language || 'en'

  // Force dark mode activation (app is dark-mode-only by design)
  useEffect(() => {
    // Add 'dark' class to HTML element to enable Tailwind dark: prefixes
    document.documentElement.classList.add('dark')

    // Optional: Set data attribute for CSS targeting
    document.documentElement.setAttribute('data-theme', 'dark')

    // Clean up old ARIA chatStore localStorage key from returning visitors
    localStorage.removeItem('fmai-chat-state')
  }, [])

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
    '/skinclarity-pitch', // Special pitch page
    '/automations',
    '/chatbots',
    '/voice-agents',
    '/marketing-machine',
    '/demo',
    '/demo-home',
  ]
  const isMarketingRoute = marketingPaths.includes(location.pathname)
  // const isLandingPage = location.pathname === '/' // Not used currently

  // Route-based persona detection for floating chatbot
  const isDemoPage = location.pathname.startsWith('/demo')

  // Context-aware concierge hook for flagship persona on marketing pages
  const conciergeCtx = useConciergeContext(location.pathname, lang)

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
      <ToastProvider>
        <ErrorBoundary>
          {/* Skip Link - First element for keyboard accessibility */}
          <SkipLink />

          {/* SEO Meta Tags - Dynamic per page */}
          <SEOHelmet />

          {/* Top Bar Controls - Language switcher + settings */}
          {/* Desktop: Show TopBarControls on all pages */}
          {/* Mobile: TopBarControlsMobile DISABLED on landing (language now in header) */}
          {!isMobile && <TopBarControls />}

          {/* Floating Navigation and Personalization - removed during demo page restructure */}

          {/* Floating Chatbot - Route-based persona switching */}
          <ChatWidget
            mode="floating"
            personaId={isDemoPage ? 'demo-guide' : 'flagship'}
            personaName={isDemoPage ? 'Demo Guide' : 'FMai Concierge'}
            personaAvatar={isDemoPage ? '🎯' : '✦'}
            suggestedPrompts={
              isDemoPage
                ? DEMO_GUIDE_STARTERS[lang] || DEMO_GUIDE_STARTERS.en
                : conciergeCtx.suggestedPrompts
            }
            welcomeMessage={
              isDemoPage
                ? 'Welcome to FMai! I can help you explore our AI automation, chatbot, and voice agent solutions.'
                : conciergeCtx.welcomeMessage
            }
            pageContext={conciergeCtx.pageContext}
          />

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

                  {/* Service Pages */}
                  <Route path="/automations" element={<AutomationsPage />} />
                  <Route path="/chatbots" element={<ChatbotsPage />} />
                  <Route path="/voice-agents" element={<VoiceAgentsPage />} />
                  <Route path="/marketing-machine" element={<MarketingMachinePage />} />

                  {/* Placeholder Pages (Coming Soon) */}
                  <Route path="/case-studies" element={<CaseStudiesPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/documentation" element={<DocumentationPage />} />
                  <Route path="/careers" element={<CareersPage />} />
                  <Route path="/partners" element={<PartnersPage />} />
                  <Route path="/security" element={<SecurityPage />} />
                  <Route path="/gdpr" element={<GDPRPage />} />

                  {/* SkinClarity Club Pitch - Fulfillment Partner Presentation */}
                  <Route path="/skinclarity-pitch" element={<SkinClarityPitchPage />} />

                  {/* Demo Pages */}
                  <Route path="/demo" element={<DemoShowcase />} />
                  <Route path="/demo-home" element={<DemoShowcase />} />

                  {/* Active calculator routes */}
                  <Route path="/calculator" element={<Calculator />} />
                  <Route path="/calculator-test" element={<CalculatorTest />} />

                  {/* Old demo routes - parked for Marketing Machine launch
                  <Route path="/demo-intro" element={<DemoIntro targetPage="demo" />} />
                  <Route path="/explorer" element={<Explorer />} />
                  <Route path="/explorer-intro" element={<DemoIntro targetPage="explorer" />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard-intro" element={<DemoIntro targetPage="dashboard" />} />
                  <Route path="/calculator-intro" element={<DemoIntro targetPage="calculator" />} />
                  <Route path="/ad-builder" element={<AdBuilder />} />
                  */}

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

        {/* Cookie Consent Banner - GDPR/CCPA Compliance */}
        <CookieConsentBanner />
      </ToastProvider>
    </HelmetProvider>
  )
}

export default App
