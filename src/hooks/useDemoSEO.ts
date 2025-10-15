import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

/**
 * useDemoSEO Hook
 *
 * Provides dynamic, internationalized SEO metadata for the demo subpath.
 * Returns page-specific titles, descriptions, and social sharing metadata
 * based on current route and language.
 *
 * @usage
 * ```tsx
 * const seoData = useDemoSEO()
 * <Helmet>
 *   <title>{seoData.title}</title>
 *   <meta name="description" content={seoData.description} />
 * </Helmet>
 * ```
 */

export interface SEOData {
  title: string
  description: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  ogUrl: string
  twitterCard: 'summary_large_image' | 'summary'
  twitterTitle: string
  twitterDescription: string
  twitterImage: string
  keywords: string
  canonicalUrl: string
}

const BASE_URL = 'https://demo.futuremarketingai.com' // Update with actual domain
const DEFAULT_OG_IMAGE = '/og-demo-preview.jpg' // Default social preview image

export function useDemoSEO(): SEOData {
  const { i18n } = useTranslation(['common', 'calculator', 'hero'])
  const location = useLocation()
  const currentLang = i18n.language || 'en'

  // Determine current page from pathname
  const pathname = location.pathname
  const isCalculator = pathname.includes('/calculator')
  const isExplorer = pathname.includes('/explorer')
  const isPrivacy = pathname.includes('/privacy')
  const isCookies = pathname.includes('/cookies')
  const isTerms = pathname.includes('/terms')

  // Base site info
  const siteName = 'FutureMarketingAI'
  const baseTitle =
    currentLang === 'nl' ? 'AI-Gestuurde Marketing Demo' : 'AI-Powered Marketing Demo'

  // Page-specific SEO data
  let pageTitle: string
  let pageDescription: string
  let pageKeywords: string
  let ogImage = DEFAULT_OG_IMAGE

  if (isCalculator) {
    pageTitle =
      currentLang === 'nl'
        ? 'ROI Calculator - FutureMarketingAI Demo'
        : 'ROI Calculator - FutureMarketingAI Demo'

    pageDescription =
      currentLang === 'nl'
        ? 'Bereken direct uw marketing ROI met onze AI-gestuurde calculator. Zie real-time inzichten in uw marketingprestaties en ontdek groeikansen.'
        : 'Calculate your marketing ROI instantly with our AI-powered calculator. See real-time insights into your marketing performance and discover growth opportunities.'

    pageKeywords =
      currentLang === 'nl'
        ? 'ROI calculator, marketing ROI, AI marketing, marketinganalyse, conversie optimalisatie'
        : 'ROI calculator, marketing ROI, AI marketing, marketing analytics, conversion optimization'

    ogImage = '/og-calculator-preview.jpg'
  } else if (isExplorer) {
    pageTitle =
      currentLang === 'nl'
        ? 'Platform Verkenner - FutureMarketingAI Demo'
        : 'Platform Explorer - FutureMarketingAI Demo'

    pageDescription =
      currentLang === 'nl'
        ? 'Verken alle functies van ons AI-marketingplatform: campagnebeheer, analytics, content planning en meer.'
        : 'Explore all features of our AI marketing platform: campaign management, analytics, content planning and more.'

    pageKeywords =
      currentLang === 'nl'
        ? 'marketing platform, AI tools, campagnebeheer, marketing automation, analytics dashboard'
        : 'marketing platform, AI tools, campaign management, marketing automation, analytics dashboard'

    ogImage = '/og-explorer-preview.jpg'
  } else if (isPrivacy) {
    pageTitle =
      currentLang === 'nl'
        ? 'Privacybeleid - FutureMarketingAI'
        : 'Privacy Policy - FutureMarketingAI'

    pageDescription =
      currentLang === 'nl'
        ? 'Lees ons privacybeleid en ontdek hoe wij uw gegevens beschermen en verwerken.'
        : 'Read our privacy policy and learn how we protect and process your data.'

    pageKeywords = 'privacy policy, data protection, GDPR, privacy'
  } else if (isCookies) {
    pageTitle =
      currentLang === 'nl'
        ? 'Cookiebeleid - FutureMarketingAI'
        : 'Cookie Policy - FutureMarketingAI'

    pageDescription =
      currentLang === 'nl'
        ? 'Lees ons cookiebeleid en beheer uw cookie-voorkeuren.'
        : 'Read our cookie policy and manage your cookie preferences.'

    pageKeywords = 'cookie policy, cookies, privacy, tracking'
  } else if (isTerms) {
    pageTitle =
      currentLang === 'nl'
        ? 'Algemene Voorwaarden - FutureMarketingAI'
        : 'Terms of Service - FutureMarketingAI'

    pageDescription =
      currentLang === 'nl'
        ? 'Lees onze algemene voorwaarden voor het gebruik van het FutureMarketingAI platform.'
        : 'Read our terms of service for using the FutureMarketingAI platform.'

    pageKeywords = 'terms of service, legal, terms and conditions'
  } else {
    // Home/Hero page
    pageTitle = `${siteName} - ${baseTitle}`

    pageDescription =
      currentLang === 'nl'
        ? 'Ervaar AI-gestuurde marketing met onze interactieve demo. Bereken ROI, verken platformfuncties en zie real-time inzichten in uw marketingstrategie.'
        : 'Experience AI-powered marketing with our interactive demo. Calculate ROI, explore platform features, and see real-time insights into your marketing strategy.'

    pageKeywords =
      currentLang === 'nl'
        ? 'AI marketing, marketing automation, ROI calculator, marketing platform, conversie optimalisatie, lead generation'
        : 'AI marketing, marketing automation, ROI calculator, marketing platform, conversion optimization, lead generation'

    ogImage = '/og-home-preview.jpg'
  }

  // Construct full URL
  const canonicalUrl = `${BASE_URL}${pathname}`
  const ogUrl = canonicalUrl

  // Social media optimized titles (shorter for better display)
  const ogTitle = pageTitle.replace(' - FutureMarketingAI Demo', '')
  const twitterTitle = ogTitle

  // Social media descriptions (truncate if needed, ideal 150-160 chars)
  const ogDescription =
    pageDescription.length > 160 ? pageDescription.substring(0, 157) + '...' : pageDescription
  const twitterDescription = ogDescription

  return {
    title: pageTitle,
    description: pageDescription,
    ogTitle,
    ogDescription,
    ogImage: `${BASE_URL}${ogImage}`,
    ogUrl,
    twitterCard: 'summary_large_image',
    twitterTitle,
    twitterDescription,
    twitterImage: `${BASE_URL}${ogImage}`,
    keywords: pageKeywords,
    canonicalUrl,
  }
}

/**
 * usePageTitle Hook
 *
 * Updates document.title when component mounts.
 * Useful for pages not using Helmet.
 *
 * @param title - Page title to set
 */
export function usePageTitle(title: string) {
  useEffect(() => {
    document.title = title
  }, [title])
}
