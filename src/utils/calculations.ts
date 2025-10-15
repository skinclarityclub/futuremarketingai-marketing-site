/**
 * ROI Calculation Engine
 *
 * Comprehensive calculation functions for marketing ROI metrics.
 * All functions are pure and handle edge cases (zero values, negative ROI, etc.).
 */

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ROIInputs {
  teamSize: number
  avgSalary: number
  campaignsPerMonth: number
  monthlyAdBudget?: number // Optional: for ROAS calculation
  testingLevel?: number // Optional: 0-100 (none to AI-powered)
}

export interface ROIMetrics {
  timeSaved: number // Hours saved per month
  laborCostSavings: number // Dollar savings from time efficiency
  contentOutput: number // Campaigns/content produced
  productivityMultiplier: number // Productivity increase factor
  totalROI: number // Overall ROI percentage
  netBenefit: number // Total benefit in dollars
  breakEven: number // Months to break even
  revenueIncrease: number // Estimated revenue increase
  roas: number // Return on Ad Spend
  // ROAS-specific metrics
  currentROAS?: number // Current ROAS based on testing level
  potentialROAS?: number // Potential ROAS with AI testing
  wastedAdSpend?: number // Monthly wasted ad spend
  adSpendSavings?: number // Potential monthly savings from better testing
  adRevenueIncrease?: number // Additional revenue from better ROAS
}

export interface CalculationConstants {
  hoursPerMonth: number // Standard working hours
  productivityGain: number // Multiplier for campaign output
  avgRevenuePerCampaign: number // Average revenue per campaign
  systemCost: number // Monthly cost of the system
  timeEfficiencyRate: number // Hours saved per team member
  timeSpentOnMarketingPercent: number // Percentage of team time on marketing (0-1)
}

// ============================================================================
// Constants
// ============================================================================

export const DEFAULT_CONSTANTS: CalculationConstants = {
  hoursPerMonth: 160, // ~40 hours/week * 4 weeks
  productivityGain: 4, // 4x productivity increase (40 manual → 160 AI posts/month)
  avgRevenuePerCampaign: 800, // €800 average revenue impact per post (enterprise B2B: lead gen + brand value)
  systemCost: 15000, // €15,000/month system cost (enterprise pricing)
  timeEfficiencyRate: 60, // 60 hours saved per person per month (realistic for content automation)
  timeSpentOnMarketingPercent: 0.5, // 50% of team time spent on marketing
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Safely divide two numbers, returning 0 if denominator is 0
 */
const safeDivide = (numerator: number, denominator: number): number => {
  if (denominator === 0) {
    return 0
  }
  return numerator / denominator
}

/**
 * Clamp a number between min and max values
 */
const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value))
}

/**
 * Round to specified decimal places
 */
const roundTo = (value: number, decimals: number = 2): number => {
  const multiplier = Math.pow(10, decimals)
  return Math.round(value * multiplier) / multiplier
}

// ============================================================================
// Core Calculation Functions
// ============================================================================

/**
 * Calculate total hours saved per month
 *
 * Formula: teamSize × timeEfficiencyRate
 *
 * @param teamSize - Number of team members
 * @param constants - Calculation constants
 * @returns Hours saved per month
 */
export const calculateTimeSaved = (
  teamSize: number,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): number => {
  if (teamSize <= 0) {
    return 0
  }

  const timeSaved = teamSize * constants.timeEfficiencyRate
  return roundTo(timeSaved, 0)
}

/**
 * Calculate labor cost savings from time efficiency
 *
 * Formula: (avgSalary / 12 / hoursPerMonth) × timeSaved
 *
 * @param avgSalary - Average annual salary
 * @param timeSaved - Hours saved per month
 * @param constants - Calculation constants
 * @returns Dollar value of labor cost savings
 */
export const calculateLaborCostSavings = (
  avgSalary: number,
  timeSaved: number,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): number => {
  if (avgSalary <= 0 || timeSaved <= 0) {
    return 0
  }

  const monthlySalary = avgSalary / 12
  const hourlyRate = safeDivide(monthlySalary, constants.hoursPerMonth)
  const savings = hourlyRate * timeSaved

  return roundTo(savings, 2)
}

/**
 * Calculate enhanced content output with productivity multiplier
 *
 * Formula: campaignsPerMonth × productivityGain
 *
 * @param campaignsPerMonth - Base campaign volume
 * @param constants - Calculation constants
 * @returns Enhanced campaign output
 */
export const calculateContentOutput = (
  campaignsPerMonth: number,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): number => {
  if (campaignsPerMonth <= 0) {
    return 0
  }

  const output = campaignsPerMonth * constants.productivityGain
  return roundTo(output, 0)
}

/**
 * Calculate productivity multiplier
 *
 * Formula: contentOutput / campaignsPerMonth
 *
 * @param contentOutput - Enhanced output
 * @param campaignsPerMonth - Base output
 * @returns Productivity multiplier (e.g., 3.0 for 3x)
 */
export const calculateProductivityMultiplier = (
  contentOutput: number,
  campaignsPerMonth: number
): number => {
  if (campaignsPerMonth <= 0) {
    return 0
  }

  const multiplier = safeDivide(contentOutput, campaignsPerMonth)
  return roundTo(multiplier, 1)
}

/**
 * Calculate estimated revenue increase from enhanced campaign output
 *
 * Formula: (contentOutput - campaignsPerMonth) × avgRevenuePerCampaign
 *
 * @param contentOutput - Enhanced output
 * @param campaignsPerMonth - Base output
 * @param constants - Calculation constants
 * @returns Additional revenue from increased output
 */
export const calculateRevenueIncrease = (
  contentOutput: number,
  campaignsPerMonth: number,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): number => {
  if (contentOutput <= 0 || campaignsPerMonth <= 0) {
    return 0
  }

  const additionalCampaigns = Math.max(0, contentOutput - campaignsPerMonth)
  const revenue = additionalCampaigns * constants.avgRevenuePerCampaign

  return roundTo(revenue, 2)
}

/**
 * Calculate Return on Ad Spend (ROAS)
 *
 * Formula: revenueIncrease / systemCost
 *
 * @param revenueIncrease - Additional revenue
 * @param constants - Calculation constants
 * @returns ROAS ratio (e.g., 5.0 for 5:1)
 */
export const calculateROAS = (
  revenueIncrease: number,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): number => {
  if (revenueIncrease <= 0 || constants.systemCost <= 0) {
    return 0
  }

  const roas = safeDivide(revenueIncrease, constants.systemCost)
  return roundTo(roas, 2)
}

/**
 * Get ROAS multiplier based on testing level
 * Research-backed: testing improves ROAS by 2-7x
 * @param testingLevel 0-100 (0 = no testing, 100 = AI-powered)
 * @returns ROAS multiplier (2x to 12x)
 */
const getROASMultiplier = (testingLevel: number): number => {
  // Normalize to 0-1
  const level = clamp(testingLevel, 0, 100) / 100

  // Linear interpolation between 2x (no testing) and 12x (AI-powered)
  // 0% → 2x, 25% → 4x, 50% → 6x, 75% → 9x, 100% → 12x
  return 2 + level * 10
}

/**
 * Calculate wasted ad spend percentage based on testing level
 * Research: 30-50% of ad spend is wasted without testing
 * @param testingLevel 0-100
 * @returns Waste percentage (0-1)
 */
const getWastePercentage = (testingLevel: number): number => {
  const level = clamp(testingLevel, 0, 100) / 100

  // 0% testing → 40% waste
  // 100% testing → 3% waste (minimal, always room for improvement)
  return 0.4 - level * 0.37
}

/**
 * Calculate ROAS-specific metrics
 * @param monthlyAdBudget Monthly ad spend
 * @param testingLevel Current testing level (0-100)
 * @returns Object with current/potential ROAS, wasted spend, savings
 */
export const calculateROASMetrics = (
  monthlyAdBudget: number,
  testingLevel: number
): {
  currentROAS: number
  potentialROAS: number
  wastedAdSpend: number
  adSpendSavings: number
  adRevenueIncrease: number
} => {
  if (!monthlyAdBudget || monthlyAdBudget === 0) {
    return {
      currentROAS: 0,
      potentialROAS: 0,
      wastedAdSpend: 0,
      adSpendSavings: 0,
      adRevenueIncrease: 0,
    }
  }

  const currentMultiplier = getROASMultiplier(testingLevel || 0)
  const potentialMultiplier = getROASMultiplier(100) // AI-powered = best case

  const currentROAS = currentMultiplier
  const potentialROAS = potentialMultiplier

  // Calculate wasted spend
  const currentWastePercentage = getWastePercentage(testingLevel || 0)
  const potentialWastePercentage = getWastePercentage(100)

  const currentWastedSpend = monthlyAdBudget * currentWastePercentage
  const potentialWastedSpend = monthlyAdBudget * potentialWastePercentage
  const adSpendSavings = currentWastedSpend - potentialWastedSpend

  // Calculate revenue increase
  const currentRevenue = monthlyAdBudget * currentMultiplier
  const potentialRevenue = monthlyAdBudget * potentialMultiplier
  const adRevenueIncrease = potentialRevenue - currentRevenue

  return {
    currentROAS: roundTo(currentROAS, 2),
    potentialROAS: roundTo(potentialROAS, 2),
    wastedAdSpend: roundTo(currentWastedSpend, 0),
    adSpendSavings: roundTo(adSpendSavings, 0),
    adRevenueIncrease: roundTo(adRevenueIncrease, 0),
  }
}

/**
 * Calculate net benefit (total value - cost)
 *
 * Formula: (laborCostSavings + revenueIncrease) - systemCost
 *
 * @param laborCostSavings - Labor cost savings
 * @param revenueIncrease - Revenue increase
 * @param constants - Calculation constants
 * @returns Net benefit in dollars
 */
export const calculateNetBenefit = (
  laborCostSavings: number,
  revenueIncrease: number,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): number => {
  const totalBenefit = laborCostSavings + revenueIncrease
  const netBenefit = totalBenefit - constants.systemCost

  return roundTo(netBenefit, 2)
}

/**
 * Calculate total ROI percentage
 *
 * Formula: ((totalBenefit - systemCost) / systemCost) × 100
 *
 * @param netBenefit - Net benefit
 * @param constants - Calculation constants
 * @returns ROI as percentage
 */
export const calculateTotalROI = (
  netBenefit: number,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): number => {
  if (constants.systemCost <= 0) {
    return 0
  }

  const roi = safeDivide(netBenefit, constants.systemCost) * 100

  // Clamp extreme values for UI display
  return roundTo(clamp(roi, -100, 10000), 0)
}

/**
 * Calculate break-even period in months
 *
 * Formula: systemCost / (laborCostSavings + revenueIncrease)
 *
 * @param laborCostSavings - Monthly labor savings
 * @param revenueIncrease - Monthly revenue increase
 * @param constants - Calculation constants
 * @returns Months to break even
 */
export const calculateBreakEven = (
  laborCostSavings: number,
  revenueIncrease: number,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): number => {
  const monthlyBenefit = laborCostSavings + revenueIncrease

  if (monthlyBenefit <= 0) {
    return Infinity
  }

  const breakEven = safeDivide(constants.systemCost, monthlyBenefit)

  // Cap at 999 months for display purposes
  return roundTo(Math.min(breakEven, 999), 1)
}

// ============================================================================
// Comprehensive Calculation Function
// ============================================================================

/**
 * Calculate all ROI metrics from inputs
 *
 * @param inputs - User input values
 * @param constants - Calculation constants (optional)
 * @returns Complete ROI metrics object
 */
export const calculateROIMetrics = (
  inputs: ROIInputs,
  constants: CalculationConstants = DEFAULT_CONSTANTS
): ROIMetrics => {
  // Validate inputs
  const safeInputs: ROIInputs = {
    teamSize: Math.max(0, inputs.teamSize),
    avgSalary: Math.max(0, inputs.avgSalary),
    campaignsPerMonth: Math.max(0, inputs.campaignsPerMonth),
    monthlyAdBudget: inputs.monthlyAdBudget || 0,
    testingLevel: inputs.testingLevel || 0,
  }

  // Calculate primary metrics
  const timeSaved = calculateTimeSaved(safeInputs.teamSize, constants)
  const laborCostSavings = calculateLaborCostSavings(safeInputs.avgSalary, timeSaved, constants)
  const contentOutput = calculateContentOutput(safeInputs.campaignsPerMonth, constants)
  const productivityMultiplier = calculateProductivityMultiplier(
    contentOutput,
    safeInputs.campaignsPerMonth
  )

  // Calculate financial metrics
  const revenueIncrease = calculateRevenueIncrease(
    contentOutput,
    safeInputs.campaignsPerMonth,
    constants
  )
  const roas = calculateROAS(revenueIncrease, constants)
  const netBenefit = calculateNetBenefit(laborCostSavings, revenueIncrease, constants)
  const totalROI = calculateTotalROI(netBenefit, constants)
  const breakEven = calculateBreakEven(laborCostSavings, revenueIncrease, constants)

  // Calculate ROAS metrics if ad budget is provided
  let roasMetrics = {}
  if (safeInputs.monthlyAdBudget && safeInputs.monthlyAdBudget > 0) {
    roasMetrics = calculateROASMetrics(safeInputs.monthlyAdBudget, safeInputs.testingLevel || 0)
  }

  return {
    timeSaved,
    laborCostSavings,
    contentOutput,
    productivityMultiplier,
    revenueIncrease,
    roas,
    netBenefit,
    totalROI,
    breakEven,
    ...roasMetrics,
  }
}

// ============================================================================
// Formatting Helpers
// ============================================================================

/**
 * Format currency value
 */
export const formatCurrency = (value: number): string => {
  if (!isFinite(value)) {
    return '$0'
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Format percentage value
 */
export const formatPercentage = (value: number): string => {
  if (!isFinite(value)) {
    return '0%'
  }
  return `${roundTo(value, 0)}%`
}

/**
 * Format number with commas
 */
export const formatNumber = (value: number): string => {
  if (!isFinite(value)) {
    return '0'
  }
  return new Intl.NumberFormat('en-US').format(roundTo(value, 0))
}
