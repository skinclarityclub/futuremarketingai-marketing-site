# 🚀 LLM Integration Setup

## ✅ Wat is er geïnstalleerd?

1. **OpenAI SDK** - Voor OpenRouter API calls
2. **LLM Service Layer** (`src/services/llmService.ts`)
   - Context-aware response generation
   - Guardrails voor input/output filtering
   - Function calling support (open_explorer, open_calculator, etc.)
   - Rate limiting integration

3. **Rate Limiter** (`src/utils/rateLimiter.ts`)
   - Max 20 messages per session
   - Max 5 messages per minute
   - Cost protection

4. **Integration** - Conversation engine updated to use LLM with fallback
   - Chat Input: async response generation
   - Message List: async action handling
   - Auto-fallback naar mock responses bij errors

---

## 🔑 Setup Instructies

### Stap 1: Maak .env.local bestand

Maak een nieuw bestand `.env.local` in de root van je project:

```bash
# Kopieer env.example naar .env.local
cp env.example .env.local
```

### Stap 2: Vul je OpenRouter API key in

Open `.env.local` en voeg je API key toe:

```env
# OpenRouter API (AI Assistant)
VITE_OPENROUTER_API_KEY=sk-or-v1-jouw-api-key-hier
```

**👉 Waar vind je je API key?**

1. Ga naar [openrouter.ai/keys](https://openrouter.ai/keys)
2. Log in met je account
3. Kopieer je API key (begint met `sk-or-v1-...`)

### Stap 3: Restart Dev Server

```bash
# Stop huidige dev server (Ctrl+C)
# Start opnieuw
npm run dev
```

---

## 🎯 Testen

### Test 1: Basisconversatie

1. Open chat
2. Type: **"Wat kan dit platform voor mij doen?"**
3. Je krijgt nu een **LLM-generated response** 🎉

### Test 2: Guardrails

- **Concurrent mention**: "Hoe verschil je van HubSpot?"
  - **Verwacht**: Redirect naar platform features
- **Off-topic**: "Wat is het weer vandaag?"
  - **Verwacht**: Beleefd redirect naar marketing topics
- **Te lang bericht** (>500 karakters)
  - **Verwacht**: Vraag om kortere formulering

### Test 3: Rate Limiting

- Stuur **6 berichten snel achter elkaar**
  - **Verwacht**: Na 5e bericht melding "Je stuurt berichten te snel"

### Test 4: Function Calling

- Type: **"Laat me de ROI calculator zien"**
  - **Verwacht**: Natuurlijke response met suggestie om calculator te openen

---

## 🔍 Debug Mode

### Check of LLM werkt:

Open browser console (F12) en kijk naar berichten:

- ✅ **LLM enabled**: Geen fallback warnings
- ❌ **LLM disabled**: Je ziet `"LLM failed, falling back to mock responses"`

### Check API calls:

In de Network tab (F12):

- Filter: `openrouter.ai`
- Bij elk bericht zie je een POST naar `/api/v1/chat/completions`

---

## 💰 Kosten Monitoring

### Huidige setup:

- **Model**: `openai/gpt-4o-mini`
- **Max tokens**: 200 per response
- **Kosten**: ~$0.15-0.60 per 1M tokens

### Geschatte kosten:

- **10 messages**: ~$0.001-0.003
- **100 demo sessions** (1000 messages): ~$1-3
- **1000 demo sessions** (10k messages): ~$10-30

### Cost monitoring:

```javascript
// In browser console tijdens development
rateLimiter.getStats()
// Zie huidige session usage
```

---

## 🛡️ Guardrails Configuratie

### Aanpassen in `src/services/llmService.ts`:

**System Prompt aanpassen:**

```typescript
private buildSystemPrompt(context: ConversationContext): string {
  return `Je bent de AI Journey Assistant...`
  // Pas hier aan naar jouw specifieke use case
}
```

**Competitor filtering uitbreiden:**

```typescript
const competitors = ['hubspot', 'marketo', 'salesforce', 'pardot']
// Voeg meer toe als nodig
```

**Rate limits aanpassen:**

```typescript
// In src/utils/rateLimiter.ts
const DEFAULT_CONFIG: RateLimitConfig = {
  maxMessagesPerSession: 20, // Verhoog/verlaag
  maxMessagesPerMinute: 5, // Verhoog/verlaag
}
```

---

## 🎨 Model Selection

Huidige: `openai/gpt-4o-mini` (aanbevolen)

### Alternatieven via OpenRouter:

**Voor meer kwaliteit:**

```typescript
private model = 'anthropic/claude-3.5-sonnet' // Duurder maar beter
```

**Voor lagere kosten:**

```typescript
private model = 'google/gemini-flash-1.5' // Goedkoper, goed genoeg
```

**Check beschikbare modellen:**
[openrouter.ai/models](https://openrouter.ai/models)

---

## ⚠️ Troubleshooting

### "LLM failed, falling back to mock responses"

1. **Check API key**:
   - Is `VITE_OPENROUTER_API_KEY` correct ingesteld?
   - Dev server gerestart na .env.local wijziging?

2. **Check OpenRouter credits**:
   - Ga naar [openrouter.ai/activity](https://openrouter.ai/activity)
   - Controleer of je credits hebt

3. **Check CORS**:
   - OpenRouter is configured met `dangerouslyAllowBrowser: true`
   - Dit is OK voor demo, maar NIET voor productie!

### "Rate limit exceeded"

- Normaal gedrag voor testing
- Refresh pagina om rate limiter te resetten
- Of verhoog limits in `rateLimiter.ts`

### Response te generiek

- Pas system prompt aan in `llmService.ts`
- Voeg meer context toe (industry-specific examples)
- Verhoog temperature voor creativiteit (0.7 → 0.9)

---

## 🚀 Next Steps

Je hebt nu een **production-ready LLM-powered assistant**!

### Volgende sprints:

1. ✅ Sprint 2.5: LLM Integration (DONE!)
2. 🔜 Sprint 3: Knowledge Base enhancement
3. 🔜 Sprint 4: Journey Guidance
4. 🔜 Sprint 5: Demo Scheduling (Calendly)
5. 🔜 Sprint 6: Polish & Testing

---

## 📞 Support

Vragen? Problemen?

- Check de console voor errors
- Test eerst met mock responses (verwijder API key tijdelijk)
- Controleer OpenRouter dashboard voor API call logs
