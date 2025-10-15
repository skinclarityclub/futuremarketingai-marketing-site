import { useState, useCallback, useMemo } from 'react'
import { trackCTAClick, trackCalendly } from '../utils/analytics'
import { trackVariantFormCompletion } from '../utils/headlineVariants'
import { usePersonalizationStore } from '../stores'
import { useJourneyStore } from '../stores/journeyStore'
import {
  getCalendlyEventTypeByJourney,
  getEventTypeDisplayName,
  type CalendlyEventType,
} from '../config/calendlyConfig'

// Define our own Prefill type based on Calendly's structure
export interface CalendlyPrefillData {
  name?: string
  email?: string
  firstName?: string
  lastName?: string
  location?: string
  guests?: string[]
  customAnswers?: {
    a1?: string
    a2?: string
    a3?: string
    a4?: string
    a5?: string
    a6?: string
    a7?: string
    a8?: string
    a9?: string
    a10?: string
  }
  date?: Date
}

// UTM parameters for campaign tracking
export interface CalendlyUTMParams {
  utmCampaign?: string
  utmSource?: string
  utmMedium?: string
  utmContent?: string
  utmTerm?: string
}

/**
 * useCalendlyBooking - Hook for managing Calendly booking state
 *
 * Features:
 * - Modal state management
 * - ICP-based smart event type selection
 * - Pre-fill data handling with automatic personalization injection
 * - Contact information pre-filling (name, email, company)
 * - UTM parameter tracking for campaign attribution
 * - Advanced analytics tracking (impressions, bookings, cancellations)
 * - User journey tracking
 */
export const useCalendlyBooking = (initialPrefill?: CalendlyPrefillData) => {
  const [isOpen, setIsOpen] = useState(false)
  const [prefillData, setPrefillData] = useState<CalendlyPrefillData>(initialPrefill || {})
  const [utmParams, setUtmParams] = useState<CalendlyUTMParams>({})
  const [selectedEventType, setSelectedEventType] = useState<CalendlyEventType | null>(null)

  // Get personalization data
  const { selectedIndustry, userProfile, userJourney, userContact, icpScore } =
    usePersonalizationStore()

  // Get journey data
  const { completedSteps, timeOnSite } = useJourneyStore()

  // Smart event type selection based on ICP score and journey
  const recommendedEventType = useMemo(() => {
    const journeyContext = {
      completedSteps: completedSteps?.length || 0,
      timeOnSite: timeOnSite || 0,
      exploredModules: userJourney.viewedModules.length,
      calculatorCompleted: !!userJourney.calculatorInputs?.teamSize,
    }

    return getCalendlyEventTypeByJourney(icpScore?.overall || null, journeyContext)
  }, [icpScore, completedSteps, timeOnSite, userJourney])

  // Auto-generate base prefill data from personalization
  const basePrefillData = useMemo((): Partial<CalendlyPrefillData> => {
    const data: Partial<CalendlyPrefillData> = {}

    // Contact information
    if (userContact.fullName) {
      data.name = userContact.fullName
    } else if (userContact.firstName || userContact.lastName) {
      data.name = `${userContact.firstName || ''} ${userContact.lastName || ''}`.trim()
    }

    if (userContact.email) {
      data.email = userContact.email
    }

    if (userContact.firstName) {
      data.firstName = userContact.firstName
    }

    if (userContact.lastName) {
      data.lastName = userContact.lastName
    }

    // Custom answers for personalization context
    const customAnswers: CalendlyPrefillData['customAnswers'] = {}

    // Always include industry if selected
    if (selectedIndustry) {
      customAnswers.a1 = `Industrie: ${selectedIndustry.name}`
    }

    // Add company name if available
    if (userContact.company) {
      customAnswers.a2 = `Bedrijf: ${userContact.company}`
    }

    // Add company size if available
    if (userProfile.companySize) {
      customAnswers.a3 = `Bedrijfsgrootte: ${userProfile.companySize}`
    }

    // Add role if available
    if (userProfile.role) {
      customAnswers.a4 = `Rol: ${userProfile.role}`
    }

    // Add budget if available
    if (userProfile.budget) {
      customAnswers.a5 = `Budget: ${userProfile.budget}`
    }

    // Add pain points if available
    if (userProfile.painPoints && userProfile.painPoints.length > 0) {
      customAnswers.a6 = `Pijnpunten: ${userProfile.painPoints.slice(0, 3).join(', ')}`
    }

    // Add ICP score if available
    if (icpScore?.overall) {
      customAnswers.a7 = `ICP Score: ${Math.round(icpScore.overall)}/100`
    }

    // Add journey engagement metrics
    const journeyMetrics = []
    if (completedSteps && completedSteps.length > 0) {
      journeyMetrics.push(`${completedSteps.length} stappen voltooid`)
    }
    if (userJourney.viewedModules.length > 0) {
      journeyMetrics.push(`${userJourney.viewedModules.length} modules bekeken`)
    }
    if (timeOnSite && timeOnSite > 60) {
      journeyMetrics.push(`${Math.round(timeOnSite / 60)} min op site`)
    }
    if (journeyMetrics.length > 0) {
      customAnswers.a8 = `Engagement: ${journeyMetrics.join(', ')}`
    }

    data.customAnswers = customAnswers

    return data
  }, [
    selectedIndustry,
    userProfile,
    userContact,
    icpScore,
    completedSteps,
    timeOnSite,
    userJourney,
  ])

  // Generate UTM parameters based on user journey
  const generateUTMParams = useCallback(
    (location: string): CalendlyUTMParams => {
      return {
        utmCampaign: 'futuremarketingai-demo',
        utmSource: 'demo-platform',
        utmMedium: 'cta',
        utmContent: location.toLowerCase().replace(/\s+/g, '-'),
        utmTerm: selectedIndustry ? selectedIndustry.id : 'general',
      }
    },
    [selectedIndustry, userJourney]
  )

  const open = useCallback(
    (location: string, prefill?: CalendlyPrefillData, _eventTypeId?: string) => {
      // Track CTA click
      trackCTAClick('Open Calendly', location)

      // Track Calendly modal opened
      trackCalendly('Modal Opened', location)

      // Track A/B test form completion (calendly booking counts as conversion)
      trackVariantFormCompletion(`calendly_${location.toLowerCase().replace(/\s+/g, '_')}`)

      // Select event type (use provided ID or recommended)
      const eventType = recommendedEventType
      setSelectedEventType(eventType)

      // Log event type selection
      console.log(`📅 Calendly: Selected event type "${eventType.name}" for location "${location}"`)
      if (icpScore?.overall) {
        console.log(`   ICP Score: ${Math.round(icpScore.overall)}/100`)
      }

      // Merge base prefill data with provided prefill
      const finalPrefillData: CalendlyPrefillData = {
        ...basePrefillData,
        ...prefill,
        customAnswers: {
          ...basePrefillData.customAnswers,
          ...(prefill?.customAnswers || {}),
          // Add booking source
          a9: `Bron: ${location}`,
          // Add recommended event type
          a10: `Event Type: ${eventType.name} (${eventType.duration}min)`,
        },
      }

      // Generate and set UTM parameters
      const params = generateUTMParams(location)
      setUtmParams(params)

      setPrefillData(finalPrefillData)
      setIsOpen(true)
    },
    [basePrefillData, recommendedEventType, generateUTMParams, icpScore]
  )

  const close = useCallback(() => {
    setIsOpen(false)
    trackCalendly('Modal Closed', 'user-action')
  }, [])

  // Construct full Calendly URL with UTM parameters
  const calendlyUrlWithUTM = useMemo(() => {
    // Use selected event type URL or fallback to recommended
    const baseUrl = selectedEventType?.url || recommendedEventType.url

    if (Object.keys(utmParams).length === 0) {
      return baseUrl
    }

    const params = new URLSearchParams()
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })

    return `${baseUrl}?${params.toString()}`
  }, [selectedEventType, recommendedEventType, utmParams])

  return {
    isOpen,
    prefillData,
    utmParams,
    calendlyUrl: calendlyUrlWithUTM,
    eventType: selectedEventType || recommendedEventType,
    eventTypeDisplayName: getEventTypeDisplayName(selectedEventType || recommendedEventType),
    open,
    close,
  }
}

export default useCalendlyBooking
