/**
 * AI Journey Assistant Components
 *
 * Export all assistant-related components from a single entry point
 */

export { default as AIJourneyAssistant } from './AIJourneyAssistant'
export { default as FloatingActionButton } from './FloatingActionButton'
export { default as ChatPanel } from './ChatPanel'
export { default as MessageList } from './MessageList'
export { default as SystemMessage } from './SystemMessage'
export { default as UserMessage } from './UserMessage'
export { default as ChatInput } from './ChatInput'

// Rich message components
export { default as RichCard } from './messages/RichCard'
export { default as Carousel } from './messages/Carousel'
export { default as QuickReplies } from './messages/QuickReplies'
export { default as AchievementCard } from './messages/AchievementCard'
export { default as NavigationAction } from './NavigationAction'
export { default as InfoPanel } from './InfoPanel'

// Re-export stores
export { useChatStore } from '../../stores/chatStore'
export { useJourneyStore } from '../../stores/journeyStore'
