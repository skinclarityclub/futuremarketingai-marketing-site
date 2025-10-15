/**
 * Chat Message Types
 *
 * Type definitions for rich message system
 */

export type MessageType =
  | 'text' // Basic text message
  | 'card' // Rich card with image, title, description, CTAs
  | 'carousel' // Multiple cards in horizontal scroll
  | 'quick-replies' // Button options for quick selection
  | 'achievement' // Gamification: milestone unlocked
  | 'demo-invite' // Special Calendly integration card

export interface BaseMessage {
  id: string
  type: MessageType
  timestamp: number
  sender: 'user' | 'system'
  reaction?: 'helpful' | 'not-helpful' | null
}

export interface TextMessage extends BaseMessage {
  type: 'text'
  content: string
  suggestedActions?: string[]
}

export interface CardData {
  title: string
  description: string
  image?: string
  icon?: string
  badge?: {
    text: string
    variant: 'success' | 'warning' | 'info' | 'premium'
  }
  actions: {
    label: string
    action: string
    variant?: 'primary' | 'secondary' | 'outline'
    icon?: string
  }[]
}

export interface CardMessage extends BaseMessage {
  type: 'card'
  content: string // Intro text before card
  card: CardData
}

export interface CarouselMessage extends BaseMessage {
  type: 'carousel'
  content: string // Intro text before carousel
  cards: CardData[]
}

export interface QuickReply {
  label: string
  value: string
  icon?: string
}

export interface QuickRepliesMessage extends BaseMessage {
  type: 'quick-replies'
  content: string
  replies: QuickReply[]
}

export interface AchievementMessage extends BaseMessage {
  type: 'achievement'
  title: string
  description: string
  icon: string
  points?: number
}

export interface DemoInviteMessage extends BaseMessage {
  type: 'demo-invite'
  content: string
  calendlyUrl: string // Kept for backwards compatibility, but hook handles URL selection
  prefillData?: {
    name?: string
    email?: string
    company?: string
    notes?: string
  }
  ctaText?: string
  secondaryCtaText?: string
}

// Navigation Message
export interface NavigationMessage {
  id: string
  type: 'navigation'
  sender: 'system'
  timestamp: number
  content: string
  reaction?: 'helpful' | 'not-helpful' | null
  navigationData: {
    label: string
    route: string
    icon?: 'calculator' | 'explorer' | 'dashboard' | 'sparkles' | 'demo'
    helpText?: string
    features?: string[]
    ctaText?: string
  }
}

export type ChatMessage =
  | TextMessage
  | CardMessage
  | CarouselMessage
  | QuickRepliesMessage
  | AchievementMessage
  | NavigationMessage
  | DemoInviteMessage

// Helper type guards
export const isTextMessage = (msg: ChatMessage): msg is TextMessage => msg.type === 'text'
export const isCardMessage = (msg: ChatMessage): msg is CardMessage => msg.type === 'card'
export const isCarouselMessage = (msg: ChatMessage): msg is CarouselMessage =>
  msg.type === 'carousel'
export const isQuickRepliesMessage = (msg: ChatMessage): msg is QuickRepliesMessage =>
  msg.type === 'quick-replies'
export const isAchievementMessage = (msg: ChatMessage): msg is AchievementMessage =>
  msg.type === 'achievement'
export const isNavigationMessage = (msg: ChatMessage): msg is NavigationMessage =>
  msg.type === 'navigation'
export const isDemoInviteMessage = (msg: ChatMessage): msg is DemoInviteMessage =>
  msg.type === 'demo-invite'
