// Re-export all components from organized directories

// Common/Shared Components
export * from './common'

// Layer 1: Hero - System Diagram Components
export * from './layer1-hero'

// Layer 3: Dashboard Components
export * from './layer3-dashboard'

// Calculator Components
export * from './calculator'

// Comparison Components
export { ComparisonSection } from './comparison/ComparisonSection'

// Visualizations
export * from './visualizations'

// Journey Components removed - Will be reimplemented in Task #29 (AI Journey Assistant)

// AI Journey Assistant (Task #29)
export { default as AIJourneyAssistant } from './ai-assistant/AIJourneyAssistant'
export * from './ai-assistant'

// Credibility Components (Task #19)
export * from './credibility'

// Landing Page Components
export * from './landing'

// SEO Components
export * from './seo'
