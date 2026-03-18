import type { SecurityValidation } from './types'

const MAX_MESSAGE_LENGTH = 500

const PII_PATTERNS: Array<{ pattern: RegExp; type: string }> = [
  { pattern: /\b\d{3}-\d{2}-\d{4}\b/, type: 'social security numbers' },
  { pattern: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/, type: 'credit card numbers' },
  {
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    type: 'email addresses',
  },
  { pattern: /\+\d{1,3}[\s-]?\d{6,14}/, type: 'phone numbers' },
]

export function validateInput(message: string): SecurityValidation {
  if (!message || message.trim().length === 0) {
    return { valid: false, reason: 'Message cannot be empty' }
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return {
      valid: false,
      reason: `Message too long (max ${MAX_MESSAGE_LENGTH} characters)`,
    }
  }

  for (const { pattern, type } of PII_PATTERNS) {
    if (pattern.test(message)) {
      return {
        valid: false,
        reason: `Please don't share personal information like ${type}`,
      }
    }
  }

  return { valid: true, sanitizedInput: message.trim() }
}

export function sanitizeOutput(text: string): string {
  let sanitized = text

  // Redact API key patterns
  sanitized = sanitized.replace(/\b(sk-[a-zA-Z0-9]{20,})\b/g, '[REDACTED]')

  // Redact internal email domains
  sanitized = sanitized.replace(/@(futuremarketingai|fmai)\.\w+/g, '@[REDACTED]')

  return sanitized
}
