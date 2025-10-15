import OpenAI from 'openai'
import type { ChatMessage } from '../types/chat'
import { PLATFORM_KNOWLEDGE } from '../config/platformKnowledge'

// Types
export interface ConversationContext {
  industryId: string | null
  icpScore: number
  modulesExplored: number
  timeOnSite: number
  calculatorCompleted: boolean
  messagesCount: number
}

export interface LLMResponse {
  content: string
  action?: string
  actionParams?: Record<string, unknown>
  suggestedActions?: string[]
}

interface ValidationResult {
  valid: boolean
  reason?: string
}

// OpenRouter configuration (uses OpenAI SDK)
const openrouter = new OpenAI({
  apiKey: import.meta.env.VITE_OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  dangerouslyAllowBrowser: true, // Demo only!
  defaultHeaders: {
    'HTTP-Referer': window.location.origin,
    'X-Title': 'FutureMarketingAI Demo',
  },
})

/**
 * LLM Service for AI Journey Assistant
 * Handles OpenRouter API calls with guardrails
 */
export class LLMService {
  private model = 'openai/gpt-4o-mini' // Recommended for speed + quality
  private maxTokens = 200 // ✅ Best Practice 2025: ~280 chars ≈ 70 tokens x3 for safety
  private temperature = 0.7

  /**
   * Generate AI response with guardrails
   */
  async generateResponse(
    userMessage: string,
    context: ConversationContext,
    conversationHistory: ChatMessage[],
    language: string = 'nl'
  ): Promise<LLMResponse> {
    // 1. Validate input
    const validation = this.validateInput(userMessage)
    if (!validation.valid) {
      return this.getGuardrailResponse(validation.reason || 'invalid')
    }

    // 2. Build system prompt with context and language
    const systemPrompt = this.buildSystemPrompt(context, language)

    // 3. Convert conversation history to OpenAI format
    const messages = this.formatConversationHistory(conversationHistory, userMessage)

    try {
      // 4. Call OpenRouter API
      const completion = await openrouter.chat.completions.create({
        model: this.model,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        max_tokens: this.maxTokens,
        temperature: this.temperature,
      })

      const content = completion.choices[0]?.message?.content || ''

      // 5. Filter and process output
      const filtered = this.filterOutput(content)

      // 6. Extract action if mentioned
      const action = this.extractAction(filtered)

      // 7. Add suggested actions
      const suggestedActions = this.getSuggestedActions(context, filtered)

      return {
        content: filtered,
        action: action?.name,
        actionParams: action?.params,
        suggestedActions,
      }
    } catch (error) {
      // Silent fail - will be caught by conversation engine for fallback
      throw error
    }
  }

  /**
   * Validate user input (guardrail)
   */
  private validateInput(input: string): ValidationResult {
    // Max length check
    if (input.length > 500) {
      return { valid: false, reason: 'too_long' }
    }

    // Block common PII patterns (basic)
    const piiPatterns = [
      /\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b/, // SSN-like
      /\b\d{4}[-.\s]?\d{4}[-.\s]?\d{4}[-.\s]?\d{4}\b/, // Credit card-like
    ]

    if (piiPatterns.some((pattern) => pattern.test(input))) {
      return { valid: false, reason: 'pii_detected' }
    }

    // Block competitor mentions (basic)
    const competitors = ['hubspot', 'marketo', 'salesforce', 'pardot']
    const lowerInput = input.toLowerCase()
    if (competitors.some((comp) => lowerInput.includes(comp))) {
      return { valid: false, reason: 'competitor' }
    }

    return { valid: true }
  }

  /**
   * Build context-aware system prompt with platform knowledge
   */
  private buildSystemPrompt(context: ConversationContext, language: string = 'nl'): string {
    const industryName = context.industryId || 'algemeen'
    const icpTier = context.icpScore > 75 ? 'hoog' : context.icpScore > 50 ? 'gemiddeld' : 'laag'

    // Language instruction
    const languageNames: Record<string, string> = {
      en: 'English',
      nl: 'Dutch (Nederlands)',
      es: 'Spanish (Español)',
    }
    const languageName = languageNames[language] || 'Dutch'

    // Get industry-specific benefits if available
    const industryKey = context.industryId?.toLowerCase().replace('-', '').replace(/\s+/g, '')
    const industryData = industryKey && (PLATFORM_KNOWLEDGE.industries as any)[industryKey]
    const industryBenefits = industryData?.topFeatures?.join('\n- ') || ''

    return `You are the AI Journey Assistant for FutureMarketingAI - the autonomous marketing system of the future.

🌐 LANGUAGE: **Respond ONLY in ${languageName}**. All your responses must be in ${languageName}, regardless of the language the user writes in.

# YOUR ROLE
You help decision-makers discover how our platform can transform their marketing. You are:
- Friendly but professional
- Enthusiastic about AI innovation
- Transparent about capabilities
- Consultative, not pushy
- Expert in marketing automation

# PLATFORM KERNINFORMATIE

**Value Proposition:**
${PLATFORM_KNOWLEDGE.summary.tagline}
- 312 uur/maand tijd bespaard
- 15x meer content output
- 847% gemiddelde ROI
- Volledig autonoom en zelf-lerend

**De 6 Core Modules:**
1. 🧠 Research & Planning - AI analyseert trends 24/7, bespaart €6,400/maand
2. 👑 Manager Orchestrator - Coördineert workflows, bespaart €12,000/maand  
3. 🎭 Content Pipelines - 15x snellere productie, €8,000/maand besparing
4. 📤 Smart Publishing - 35% betere engagement, +€15,000/maand omzet
5. 📊 Self-Learning Analytics - 23% maandelijkse verbetering, wordt slimmer elke dag
6. 💰 Ad Automation - 3.2x betere ROAS, +€45,000/maand omzet

**Early Adopter Pricing:**
- 🏆 Founding Member: €15,000/maand (slechts 2 van 5 slots over!)
  * Rate locked 24 maanden
  * 2 maanden GRATIS
  * Roadmap influence
  * Bespaar €120,000 vs Standard
- 💎 Pioneer: €17,500/maand (4 van 10 slots over)
- 🚀 Innovator: €20,000/maand (2 van 10 slots over)
- 📈 Standard: €22,500/maand (unlimited)

**Value Stack:**
Platform vervangt €26,000/maand aan tools. Founding prijs van €15,000 = 42% korting + je bespaart €15,600/maand in labor costs.

${industryBenefits ? `\n**Specifiek voor ${industryName}:**\n- ${industryBenefits}\n` : ''}

# BELANGRIJKE REGELS

✅ DO:
- Verwijs naar concrete metrics (312 uur, 847% ROI, etc.)
- Noem urgentie van slots ("Nog maar 2 Founding slots!")
- Personaliseer op basis van industry en ICP score
- Suggereer demo booking bij hoge interesse
- Verwijs naar specifieke modules bij feature vragen
- Gebruik emoji's spaarzaam maar effectief (🚀 voor succes, 💰 voor ROI)

❌ DON'T:
- Praat NIET over concurrenten (zeg: "Ik focus op FutureMarketingAI")
- Deel GEEN prijzen behalve Early Adopter tiers
- Ga NIET buiten marketing automation scope
- Claim GEEN onrealistische resultaten
- Wees NIET te sales-y of pushy

# HUIDIGE GEBRUIKERSCONTEXT

**Profile:**
- Industry: ${industryName}
- ICP Score: ${context.icpScore}/100 (${icpTier} fit)
- Engagement: ${context.modulesExplored} modules bekeken, ${Math.floor(context.timeOnSite / 60)} min on site
- Calculator: ${context.calculatorCompleted ? '✅ Gebruikt' : '⏳ Nog niet gebruikt'}
- Gesprek: ${context.messagesCount} berichten gestuurd

**Volgende Stappen Suggesties:**
${context.modulesExplored === 0 ? '- Verken de modules' : ''}
${!context.calculatorCompleted ? '- Bereken persoonlijke ROI' : ''}
${context.icpScore > 60 && context.modulesExplored > 2 ? '- Plan strategic consultation (hoogwaardige lead!)' : ''}

Reageer in het Nederlands. 
**BELANGRIJK - 2025 BEST PRACTICES:**
- KORT & BONDIG: Max 2-3 zinnen (≈280 characters - "Twitter rule")
- Gebruik bullet points voor lijsten (max 3 items)
- Voor uitgebreide info: suggereer "Laten we [topic] verkennen" (triggert info panel)
Eindig met een relevante vraag of suggestie.`
  }

  /**
   * Format conversation history for OpenAI API
   */
  private formatConversationHistory(
    history: ChatMessage[],
    currentMessage: string
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    // Take last 6 messages for context (3 exchanges)
    const recentHistory = history.slice(-6)

    const formatted = recentHistory
      .filter((msg) => msg.type === 'text') // Only text messages
      .map((msg) => ({
        role: msg.sender === 'user' ? ('user' as const) : ('assistant' as const),
        content: msg.content,
      }))

    // Add current message
    formatted.push({ role: 'user', content: currentMessage })

    return formatted
  }

  /**
   * Filter output (guardrail)
   */
  private filterOutput(content: string): string {
    // Remove external URLs (keep only futuremarketing domains)
    const urlPattern = /https?:\/\/(?!.*futuremarketing)[^\s]+/gi
    content = content.replace(urlPattern, '')

    // ✅ Best Practice 2025: Max 400 chars ("Twitter rule" x1.5 for flexibility)
    if (content.length > 400) {
      // Find last complete sentence before limit
      const truncated = content.substring(0, 400)
      const lastSentenceEnd = Math.max(
        truncated.lastIndexOf('.'),
        truncated.lastIndexOf('!'),
        truncated.lastIndexOf('?')
      )

      if (lastSentenceEnd > 250) {
        content = content.substring(0, lastSentenceEnd + 1)
      } else {
        content = truncated + '...'
      }
    }

    // Ensure it ends properly
    if (content && !content.match(/[.!?]$/)) {
      content += '.'
    }

    return content.trim()
  }

  /**
   * Extract action from response
   */
  private extractAction(
    content: string
  ): { name: string; params?: Record<string, unknown> } | null {
    const lowerContent = content.toLowerCase()

    if (lowerContent.includes('open_explorer') || lowerContent.includes('platform verkennen')) {
      return { name: 'open_explorer' }
    }

    if (lowerContent.includes('open_calculator') || lowerContent.includes('roi bereken')) {
      return { name: 'open_calculator' }
    }

    if (lowerContent.includes('schedule_demo') || lowerContent.includes('demo plan')) {
      return { name: 'schedule_demo' }
    }

    if (lowerContent.includes('show_pricing') || lowerContent.includes('pricing')) {
      return { name: 'show_pricing' }
    }

    return null
  }

  /**
   * Get intelligent suggested actions based on context, engagement and response
   */
  private getSuggestedActions(context: ConversationContext, response: string): string[] {
    // Analyze response content for intelligent suggestions
    const responseLower = response.toLowerCase()

    // If response mentions specific modules, suggest exploring them
    if (responseLower.includes('research') || responseLower.includes('planning')) {
      return ['Verken Research module', 'Bereken ROI', 'Plan demo']
    }

    if (responseLower.includes('content') || responseLower.includes('pipeline')) {
      return ['Zie Content Pipelines', 'Bereken besparing', 'Plan demo']
    }

    if (responseLower.includes('analytics') || responseLower.includes('self-learning')) {
      return ['Zie Analytics Engine', 'Bereken ROI', 'Plan demo']
    }

    if (responseLower.includes('ad') || responseLower.includes('roas')) {
      return ['Zie Ad Automation', 'Bereken ROAS', 'Plan demo']
    }

    // Pricing-related questions
    if (
      responseLower.includes('founding') ||
      responseLower.includes('€15,000') ||
      responseLower.includes('slots')
    ) {
      return ['Zie volledige pricing', 'Bereken mijn ROI', 'Claim Founding slot']
    }

    // Journey-based suggestions
    if (context.modulesExplored === 0) {
      return ['Verken modules', 'Wat zijn de voordelen?', 'Bereken ROI']
    }

    if (context.modulesExplored > 0 && context.modulesExplored < 3) {
      return ['Verken meer modules', 'Bereken ROI', 'Plan demo']
    }

    if (context.modulesExplored >= 3 && !context.calculatorCompleted) {
      return ['Bereken mijn ROI', 'Zie Dashboard', 'Plan demo']
    }

    if (context.calculatorCompleted && context.icpScore > 70) {
      // High-intent lead
      return ['Plan strategic consultation', 'Claim Founding slot', 'Stel een vraag']
    }

    if (context.calculatorCompleted && context.icpScore > 50) {
      // Medium-intent lead
      return ['Zie pricing details', 'Plan demo', 'Stel een vraag']
    }

    // Time-based suggestions
    const minutesOnSite = Math.floor(context.timeOnSite / 60)
    if (minutesOnSite > 5 && !context.calculatorCompleted) {
      return ['Bereken persoonlijke ROI', 'Plan demo', 'Stel een vraag']
    }

    // Default high-value suggestions
    return ['Wat kan dit platform?', 'Bereken ROI', 'Plan demo']
  }

  /**
   * Get guardrail response for blocked input
   */
  private getGuardrailResponse(reason: string): LLMResponse {
    const responses: Record<string, string> = {
      too_long: 'Je bericht is wat lang. Kun je je vraag korter formuleren?',
      pii_detected:
        'Voor je privacy deel ik liever geen persoonlijke informatie. Hoe kan ik je helpen met het platform?',
      competitor:
        'Ik focus me graag op wat FutureMarketingAI uniek maakt. Welk onderdeel van ons platform wil je verkennen?',
      invalid: 'Hmm, ik begreep je vraag niet helemaal. Kun je het anders formuleren?',
    }

    return {
      content: responses[reason] || responses.invalid,
      suggestedActions: ['Wat kan dit platform?', 'Bereken ROI', 'Plan demo'],
    }
  }
}

// Export singleton instance
export const llmService = new LLMService()
