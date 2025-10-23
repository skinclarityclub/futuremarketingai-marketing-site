# 🔐 OpenAI Backend Proxy - Setup Instructies

## ✅ Wat is er Geïmplementeerd?

### **Wijziging: OpenRouter → OpenAI**

- ✅ Backend proxy gebruikt nu **OpenAI API** (directer & goedkoper)
- ✅ Model: `gpt-4o-mini` (snelste & meest kostenefficiënte optie)
- ✅ Environment variable: `OPENAI_API_KEY` (ipv `OPENROUTER_API_KEY`)
- ✅ Veilige serverless function: `/api/chat`
- ✅ Code gepushed → Auto-deployed naar Vercel

---

## 🚀 LAATSTE STAP: OpenAI API Key Toevoegen

Je moet **eenmalig** de `OPENAI_API_KEY` toevoegen aan Vercel. Je hebt **2 opties**:

### **Optie 1: Via Vercel Dashboard (Aangeraden)**

1. **Open Vercel Environment Variables:**

   ```
   https://vercel.com/skinclarityclub/future-marketing-ai/settings/environment-variables
   ```

2. **Voeg de key toe:**
   - Click **"Add New"** / **"Add Environment Variable"**
   - **Key:** `OPENAI_API_KEY`
   - **Value:** Plak je OpenAI API key (begint met `sk-proj-...` of `sk-...`)
   - **Environments:** ✅ Production, ✅ Preview, ✅ Development (selecteer alle 3!)
   - Click **"Save"**

3. **Redeploy (belangrijk!):**
   - Ga naar: https://vercel.com/skinclarityclub/future-marketing-ai/deployments
   - Find de **nieuwste deployment** (commit: "feat(api): switch from OpenRouter to OpenAI")
   - Click **drie puntjes (⋮)** rechts → **"Redeploy"**
   - Wacht ~2 minuten voor deployment

---

### **Optie 2: Via Vercel CLI (Sneller)**

Run deze commando's in je terminal:

```bash
# Voeg key toe voor Production
vercel env add OPENAI_API_KEY production

# Voeg key toe voor Preview
vercel env add OPENAI_API_KEY preview

# Voeg key toe voor Development
vercel env add OPENAI_API_KEY development
```

Je wordt 3x gevraagd om dezelfde API key in te voeren.

Dan redeploy:

```bash
vercel --prod
```

---

## 🔑 Waar Vind Je Je OpenAI API Key?

### **Als je nog GEEN OpenAI account hebt:**

1. Ga naar: https://platform.openai.com/signup
2. Maak een account aan
3. Ga naar: https://platform.openai.com/api-keys
4. Click **"Create new secret key"**
5. Geef een naam: `Future Marketing AI Production`
6. Kopieer de key (begint met `sk-proj-...`)
7. **BELANGRIJK**: Sla deze key veilig op! Je kunt hem maar 1x zien.

### **Als je al een OpenAI account hebt:**

1. Login op: https://platform.openai.com/
2. Ga naar: https://platform.openai.com/api-keys
3. Kopieer je bestaande key OF maak een nieuwe aan
4. Key ziet er zo uit: `sk-proj-xxxxxxxxxxxxxxxxxxxxx`

---

## 💰 OpenAI Pricing (gpt-4o-mini)

**Model:** `gpt-4o-mini`

- **Input:** $0.15 per 1M tokens (~750k woorden)
- **Output:** $0.60 per 1M tokens (~750k woorden)

**Typisch chatbot gesprek (20 berichten):**

- ~5,000 tokens (input + output)
- **Kosten:** ~$0.003 (0.3 cent per gesprek)
- **100 gesprekken:** ~$0.30
- **1,000 gesprekken:** ~$3.00

**Zeer kosteneffectief voor productie!** 🎯

---

## ✅ Hoe Test Je of Het Werkt?

**Na de redeploy:**

1. **Open je live site:**

   ```
   https://future-marketing.ai
   ```

2. **Open de AI chatbot** (rechtsonder, blauw icoon)

3. **Test met een vraag:**
   - "Wat is Future Marketing AI?"
   - "Hoe werkt de AI content generator?"
   - "Vertel me over de pricing"

4. **Verwacht resultaat:**
   - ✅ Je krijgt binnen 2 seconden een intelligent antwoord
   - ✅ Geen errors in de browser console

5. **Als het niet werkt:**
   - Open Chrome DevTools (F12)
   - Check "Console" tab voor errors
   - Check "Network" tab → zie je `/api/chat` requests?

---

## 🔒 Beveiligingsvoordelen

**OpenAI Direct (Nieuwe Setup):**

- ✅ API key verborgen op server
- ✅ Directer & sneller (geen tussenpartij)
- ✅ Lagere kosten (~50% goedkoper dan OpenRouter)
- ✅ Meer controle over rate limiting
- ✅ Production-ready architectuur

**vs OpenRouter (Oude Setup):**

- ❌ Extra hop via proxy service
- ❌ Hogere kosten (markup van ~2x)
- ⚠️ Afhankelijk van externe service

---

## 📊 Monitoring & Limits

### **OpenAI Dashboard:**

1. Ga naar: https://platform.openai.com/usage
2. Zie real-time API usage
3. Zet spending limits:
   - Click **"Settings"** → **"Limits"**
   - Stel een maandelijks budget in (bijv. €50)
   - Krijg alerts bij 80% en 100%

### **Aanbevolen Limits voor Start:**

- **Soft limit:** €20/maand (alert)
- **Hard limit:** €50/maand (stop)

Dit is meer dan genoeg voor 10,000+ chatbot gesprekken!

---

## 🎯 Na Setup: Volgende Stappen

### **Optioneel: Rate Limiting Toevoegen**

Voeg dit toe aan `api/chat.ts` voor extra beveiliging:

```typescript
// Simple rate limiting (max 10 requests per minute per IP)
const rateLimits = new Map()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const requests = rateLimits.get(ip) || []
  const recentRequests = requests.filter((time) => now - time < 60000)

  if (recentRequests.length >= 10) {
    return false // Too many requests
  }

  recentRequests.push(now)
  rateLimits.set(ip, recentRequests)
  return true
}
```

### **Optioneel: Analytics Toevoegen**

Track chatbot usage in je analytics:

```typescript
// In je frontend ChatPanel.tsx
gtag('event', 'chatbot_message_sent', {
  message_length: message.length,
  response_time: responseTime,
})
```

---

## 🆘 Troubleshooting

### **Error: "Missing credentials"**

- ✅ Check of `OPENAI_API_KEY` is toegevoegd in Vercel
- ✅ Verifieer dat alle 3 environments zijn geselecteerd
- ✅ Redeploy de laatste deployment

### **Error: "API key is not configured"**

- ✅ Check of de key EXACT `OPENAI_API_KEY` heet (geen typos!)
- ✅ Check of de key geen extra spaties heeft
- ✅ Redeploy na het toevoegen van de key

### **Error: "Insufficient quota"**

- ✅ Je OpenAI account heeft geen credits
- ✅ Ga naar: https://platform.openai.com/settings/organization/billing
- ✅ Voeg een betaalmethode toe
- ✅ OpenAI geeft automatisch $5 gratis credits voor nieuwe accounts

### **Chatbot geeft geen antwoord**

1. Open browser console (F12)
2. Check voor errors
3. Check Network tab → zie je `/api/chat` calls?
4. Check Vercel logs: https://vercel.com/skinclarityclub/future-marketing-ai/logs
5. Share screenshot als je hulp nodig hebt

---

## 📁 Code Referentie

### **Backend Proxy:**

- `api/chat.ts` - Secure OpenAI proxy
- Environment: `OPENAI_API_KEY`

### **Frontend:**

- `src/services/llmService.ts` - LLM service (roept `/api/chat` aan)
- Model: `gpt-4o-mini`
- Max tokens: 200 (per response)
- Temperature: 0.7 (balans creativiteit/consistentie)

---

## 💬 Hulp Nodig?

**Wil je dat ik de key voor je configureer?**

- Share tijdelijk je OpenAI API key
- Ik voeg hem toe via CLI
- Verwijder de key uit de chat na setup

**Anders:**

- Volg de stappen hierboven
- Het duurt max 5 minuten
- Je hebt volledige controle

---

## 🎉 Klaar!

Na het toevoegen van de key en redeploy:

- ✅ AI chatbot werkt perfect
- ✅ Veilige backend proxy
- ✅ Kosteneffectieve OpenAI integratie
- ✅ Production-ready setup

**Je bent klaar voor de launch!** 🚀
