// Types
export type {
  ComplexityLevel,
  ChatRequest,
  ChatResponse,
  PersonaConfig,
  TopicDefinition,
  TopicRouterResult,
  RateLimitResult,
  SecurityValidation,
} from './types'

// Security
export { validateInput, sanitizeOutput } from './security'

// Rate limiting
export {
  checkSessionLimit,
  checkGlobalLimit,
  checkIpLimit,
  checkAllRateLimits,
} from './rate-limiter'

// Complexity detection
export { detectComplexity, MODEL_IDS } from './complexity-detector'

// Topic routing
export { routeToKnowledge } from './topic-router'

// Prompt building
export { buildSystemMessages } from './prompt-builder'

// Persona routing
export { getPersona, registerPersona, hasPersona, getRegisteredPersonaIds } from './persona-router'

// Tool execution
export { createPersonaTools, executeToolCall, DEMO_TOOL } from './tool-executor'

// Engine
export { handleChatRequest } from './engine'
