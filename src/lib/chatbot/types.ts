export type ComplexityLevel = 'haiku' | 'sonnet'

export interface ChatRequest {
  personaId: string
  message?: string
  sessionId: string
  conversationHistory?: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
  messages?: Array<{ role: string; content: string; parts?: unknown[] }>
  context?: {
    language?: string
    currentPage?: string
  }
}

export interface ChatResponse {
  success: boolean
  error?: string
  resetAt?: number
}

export interface PersonaConfig {
  id: string
  name: string
  description: string
  staticPrefix: string
  topicDefinitions: TopicDefinition[]
  tools: Record<string, unknown>
  defaultModel: ComplexityLevel
  complexityKeywords?: string[]
  maxTokens: number
  temperature: number
}

export interface TopicDefinition {
  key: string
  content: string
  keywords: string[]
  priority: number
}

export interface TopicRouterResult {
  topics: string[]
  knowledgeContent: string
  estimatedTokens: number
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  resetAt: number
  limitType?: 'session' | 'global' | 'ip'
}

export interface SecurityValidation {
  valid: boolean
  reason?: string
  sanitizedInput?: string
}
