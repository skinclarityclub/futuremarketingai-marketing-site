# AI Journey Assistant - LLM Integration Plan

## 🎯 Doel

Koppel een **echte LLM** aan de AI Journey Assistant met **strikte guardrails** om alleen relevante, merkgebonden antwoorden te geven binnen de scope van de FutureMarketingAI demo.

---

## 🔑 Waarom een echte LLM?

### Huidige Situatie (Mock Responses)

❌ Beperkt tot hardcoded patterns
❌ Kan niet omgaan met variatie in vragen
❌ Geen natuurlijke conversatie
❌ Geen leervermogen
❌ Niet schaalbaar

### Met Echte LLM

✅ Natuurlijke, context-aware conversaties
✅ Begrijpt variaties en synoniemen
✅ Kan complexe vragen beantwoorden
✅ Flexibel en uitbreidbaar
✅ **Maar**: Moet strikt afgebakend worden!

---

## 🛡️ Guardrails & Scope Afbakening

### 1. System Prompt (Primaire Guardrail)

````typescript
const SYSTEM_PROMPT = `
Je bent de AI Journey Assistant van FutureMarketingAI, een demo-platform voor marketing automation.

STRIKTE REGELS:
1. Beantwoord ALLEEN vragen over:
   - FutureMarketingAI platform features
   - Marketing automation concepten
   - ROI calculaties en demo-scheduling
   - De modules: Explorer, Calculator, Strategy Hub

2. WEIGER beleefd vragen over:
   - Concurrenten
   - Andere onderwerpen buiten marketing/platform
   - Persoonlijke of gevoelige informatie
   - Technische implementatie details

3. STIJL:
   - Professioneel maar vriendelijk
   - Kort en bondig (max 2-3 zinnen per bericht)
   - Gebruik emoji's spaarzaam (1-2 max)
   - Focus op ACTION: altijd suggest next step

4. BESCHIKBARE ACTIES:
   - open_explorer: Open Platform Explorer
   - open_calculator: Open ROI Calculator
   - schedule_demo: Start demo booking
   - show_pricing: Toon pricing info

INDUSTRY CONTEXT: {industry}
USER ICP SCORE: {icpScore}/100
MODULES EXPLORED: {modulesExplored}
TIME ON SITE: {timeOnSite} seconds

Reageer natuurlijk, maar blijf ALTIJD binnen scope.
`

### 2. Input Validation
```typescript
const validateUserInput = (input: string): ValidationResult => {
  // Block PII attempts
  if (hasPII(input)) return { valid: false, reason: 'pii_detected' }

  // Block competitor mentions
  if (hasCompetitorMention(input)) return { valid: false, reason: 'competitor' }

  // Block inappropriate content
  if (isInappropriate(input)) return { valid: false, reason: 'inappropriate' }

  // Max length check (prevent abuse)
  if (input.length > 500) return { valid: false, reason: 'too_long' }

  return { valid: true }
}
````

### 3. Output Filtering

```typescript
const filterLLMResponse = (response: string): string => {
  // Remove any URLs except our own domain
  response = removeExternalURLs(response)

  // Ensure max length (prevent rambling)
  response = truncateToMaxLength(response, 300)

  // Ensure action suggestions are included
  if (!hasActionSuggestion(response)) {
    response += '\n\nWat wil je graag verkennen?'
  }

  return response
}
```

### 4. Rate Limiting

- Max 20 messages per session
- Max 5 messages per minute
- Prevent abuse and cost overrun

---

## 🤖 LLM Provider Options

### Optie 1: OpenAI GPT-4o-mini (AANBEVOLEN)

**Voordelen:**

- ✅ Snel (200-300ms response)
- ✅ Goedkoop ($0.15/$0.60 per 1M tokens)
- ✅ Uitstekende function calling
- ✅ Betrouwbaar en stabiel
- ✅ Goede Nederlands support

**Kosten Schatting:**

- 1000 demo sessions/maand
- Gem. 10 messages per session
- Gem. 100 tokens in + 150 tokens out per message
- **Totaal: ~$15-20/maand**

```typescript
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Only for demo!
})
```

### Optie 2: Google Gemini Flash (GRATIS TIER)

**Voordelen:**

- ✅ **GRATIS** tot 15 requests/minute
- ✅ Snel
- ✅ Goed Nederlands support
- ✅ Lange context window

**Nadelen:**

- ⚠️ Minder robuust dan OpenAI
- ⚠️ Beperkte function calling

```typescript
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)
```

### Optie 3: Anthropic Claude Haiku

**Voordelen:**

- ✅ Beste reasoning
- ✅ Uitstekende safety features
- ✅ Goede Nederlands support

**Nadelen:**

- ⚠️ Duurder ($0.25/$1.25 per 1M tokens)
- ⚠️ Langzamer

### AANBEVELING

Start met **OpenAI GPT-4o-mini**:

- Beste prijs/kwaliteit verhouding
- Snelste time-to-market
- Kan later switchen als nodig

---

## 🏗️ Implementatie Architectuur

### 1. LLM Service Layer

```typescript
// src/services/llmService.ts
export class LLMService {
  private client: OpenAI
  private systemPrompt: string

  async generateResponse(userMessage: string, context: ConversationContext): Promise<LLMResponse> {
    // 1. Validate input
    const validation = validateUserInput(userMessage)
    if (!validation.valid) {
      return this.getGuardrailResponse(validation.reason)
    }

    // 2. Build context-aware system prompt
    const systemPrompt = this.buildSystemPrompt(context)

    // 3. Call LLM with function calling
    const response = await this.client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...conversationHistory,
        { role: 'user', content: userMessage },
      ],
      functions: this.getAvailableFunctions(),
      temperature: 0.7,
      max_tokens: 200,
    })

    // 4. Filter output
    const filtered = filterLLMResponse(response)

    // 5. Extract function calls if any
    const actions = this.extractActions(response)

    return { message: filtered, actions }
  }
}
```

### 2. Function Calling (Actions)

```typescript
const AVAILABLE_FUNCTIONS = [
  {
    name: 'open_explorer',
    description: 'Open Platform Explorer module',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'open_calculator',
    description: 'Open ROI Calculator',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'schedule_demo',
    description: 'Start demo scheduling flow',
    parameters: {
      type: 'object',
      properties: {
        prefilled_email: { type: 'string' },
        prefilled_name: { type: 'string' },
      },
    },
  },
  {
    name: 'show_pricing',
    description: 'Show Early Adopter pricing info',
    parameters: { type: 'object', properties: {} },
  },
]
```

### 3. Error Handling & Fallbacks

```typescript
async generateResponse(userMessage: string) {
  try {
    // Try LLM
    return await this.llmService.generateResponse(userMessage, context)
  } catch (error) {
    // Log error
    console.error('LLM Error:', error)

    // Fallback to mock responses
    return this.mockConversationEngine.generateResponse(userMessage, context)
  }
}
```

---

## 📊 Kosten Management

### Cost Tracking

```typescript
interface CostTracker {
  sessionsThisMonth: number
  tokensUsedThisMonth: number
  estimatedCostThisMonth: number
  costPerSession: number
}

// Alert if costs exceed budget
if (costTracker.estimatedCostThisMonth > 50) {
  // Switch to cheaper model or disable for new sessions
  alertAdmin('LLM cost threshold exceeded')
}
```

### Cost Optimization Strategies

1. **Cache common responses** (Redis/memory)
2. **Batch requests** waar mogelijk
3. **Compress system prompt** (remove verbose parts)
4. **Use shorter max_tokens** (150-200 is genoeg)
5. **Monitor en alert** bij abnormaal gebruik

---

## 🚀 Implementation Roadmap

### Sprint 2.5: LLM Integration (3-4 uur)

#### Task 1: Setup & Configuration (30 min)

- [ ] OpenAI account + API key
- [ ] Environment variables setup
- [ ] Install `openai` package
- [ ] Create `.env.example` met API key placeholder

#### Task 2: LLM Service Layer (1 uur)

- [ ] Create `src/services/llmService.ts`
- [ ] Implement `generateResponse()` method
- [ ] Build context-aware system prompt
- [ ] Add function calling support

#### Task 3: Guardrails (1 uur)

- [ ] Input validation functions
- [ ] Output filtering
- [ ] Rate limiting logic
- [ ] Fallback to mock responses

#### Task 4: Integration (1 uur)

- [ ] Update `conversationEngine.ts` to use LLM
- [ ] Update `MessageList.tsx` to handle function calls
- [ ] Add loading states during LLM calls
- [ ] Error handling & fallbacks

#### Task 5: Testing (30 min)

- [ ] Test happy path scenarios
- [ ] Test guardrail violations
- [ ] Test error scenarios
- [ ] Test cost per session

---

## 🧪 Testing Checklist

### Functional Tests

- [ ] Vraag over platform features → Relevante info
- [ ] Vraag over concurrent → Beleefd weigeren
- [ ] Off-topic vraag → Redirect naar scope
- [ ] ROI vraag → Open calculator
- [ ] Demo vraag → Start scheduling

### Guardrail Tests

- [ ] PII input → Block
- [ ] Competitor mention → Redirect
- [ ] Inappropriate content → Block
- [ ] > 500 characters → Truncate

### Performance Tests

- [ ] Response time < 1 seconde
- [ ] Cost per session < $0.02
- [ ] Fallback werkt bij LLM failure

---

## 🎯 Success Criteria

1. ✅ **Natuurlijke conversatie** - Users voelen dat het "echt" is
2. ✅ **Binnen scope** - Geen off-topic antwoorden
3. ✅ **Actiegericht** - Altijd next step suggestions
4. ✅ **Snel** - Response binnen 1 seconde
5. ✅ **Cost-effective** - < $20/maand voor 1000 sessions
6. ✅ **Robuust** - Fallback werkt bij failures

---

## 💡 Aanbeveling

**JA, dit moet NU gebeuren** voor een productie-waardige demo!

**Aanpak:**

1. Start met **OpenAI GPT-4o-mini** (beste ROI)
2. Implementeer **strikte guardrails** vanaf dag 1
3. Houd **mock responses als fallback**
4. Monitor **kosten en performance**
5. Itereer op system prompt based on user feedback

**Volgorde:**

1. ✅ Sprint 1: Rich Messages (DONE)
2. ✅ Sprint 2: Conversational Intelligence (DONE)
3. 🚀 **Sprint 2.5: LLM Integration (NU DOEN)**
4. Sprint 3: Knowledge Base enhancement
5. Sprint 4: Journey Guidance
6. Sprint 5: Demo Scheduling
7. Sprint 6: Polish & Testing

---

## 🤔 Vragen?

1. **Wil je OpenAI GPT-4o-mini gebruiken?** (Aanbevolen)
2. **Heb je al een OpenAI account/API key?**
3. **Budget akkoord voor ~$15-20/maand?**
4. **Wil je dat ik dit nu implementeer?**
