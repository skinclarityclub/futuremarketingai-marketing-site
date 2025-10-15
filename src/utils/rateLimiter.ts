/**
 * Rate Limiter for AI Assistant
 * Prevents abuse and cost overrun
 */

interface RateLimitConfig {
  maxMessagesPerSession: number
  maxMessagesPerMinute: number
}

interface RateLimitState {
  sessionMessageCount: number
  recentMessages: number[]
}

const DEFAULT_CONFIG: RateLimitConfig = {
  maxMessagesPerSession: 20,
  maxMessagesPerMinute: 5,
}

class RateLimiter {
  private config: RateLimitConfig
  private state: RateLimitState

  constructor(config: RateLimitConfig = DEFAULT_CONFIG) {
    this.config = config
    this.state = {
      sessionMessageCount: 0,
      recentMessages: [],
    }
  }

  /**
   * Check if a new message is allowed
   */
  canSendMessage(): { allowed: boolean; reason?: string } {
    // Check session limit
    if (this.state.sessionMessageCount >= this.config.maxMessagesPerSession) {
      return {
        allowed: false,
        reason: `Je hebt het maximum van ${this.config.maxMessagesPerSession} berichten bereikt. Ververs de pagina om door te gaan.`,
      }
    }

    // Check per-minute limit
    const now = Date.now()
    const oneMinuteAgo = now - 60000

    // Clean old timestamps
    this.state.recentMessages = this.state.recentMessages.filter(
      (timestamp) => timestamp > oneMinuteAgo
    )

    if (this.state.recentMessages.length >= this.config.maxMessagesPerMinute) {
      return {
        allowed: false,
        reason: 'Je stuurt berichten te snel. Wacht even voordat je verder gaat.',
      }
    }

    return { allowed: true }
  }

  /**
   * Record a sent message
   */
  recordMessage(): void {
    this.state.sessionMessageCount++
    this.state.recentMessages.push(Date.now())
  }

  /**
   * Reset session counter (e.g., on page refresh)
   */
  reset(): void {
    this.state.sessionMessageCount = 0
    this.state.recentMessages = []
  }

  /**
   * Get current usage stats
   */
  getStats() {
    return {
      sessionMessages: this.state.sessionMessageCount,
      remainingInSession: this.config.maxMessagesPerSession - this.state.sessionMessageCount,
      recentMessages: this.state.recentMessages.length,
    }
  }
}

// Export singleton instance
export const rateLimiter = new RateLimiter()
