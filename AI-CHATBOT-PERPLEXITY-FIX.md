# Perplexity AI Q&A Fix

## ❌ **Probleem:**

Gebruiker vraagt: **"Hoe werkt Perplexity AI?"**
Bot antwoord: Info over Research & Planning module ❌

**Verwacht:** Direct uitleg over Perplexity AI zelf ✅

---

## ✅ **Oplossing:**

### **1. Nieuwe Q&A toegevoegd aan Knowledge Base**

```json
{
  "id": "te_000",
  "question": "Hoe werkt Perplexity AI?",
  "keywords": ["perplexity", "perplexity ai", "ai search", "research tool", "perplexity werkt"],
  "answer": "🔍 **Perplexity AI** is een geavanceerde AI-zoekmachine:\n\n**Wat het doet:**\n• Doorzoekt het web in real-time\n• Analyseert bronnen en genereert gestructureerde inzichten\n• Geeft antwoorden met bronvermelding\n\n**Perfect voor:**\n• Marktanalyse\n• Competitor research\n• Trend spotting\n• Content research\n\n💡 **In ons platform:** We gebruiken Perplexity voor de Research & Planning module om je actuele marktinzichten te geven",
  "relatedModules": ["research-planning"],
  "cta": {
    "text": "Bekijk Research Module",
    "action": "navigate_module",
    "value": "research-planning"
  }
}
```

---

## 🧪 **Test:**

1. **Open chat**
2. **Vraag:** "Hoe werkt Perplexity AI?"
3. **Verwacht antwoord:**

   ```
   🔍 Perplexity AI is een geavanceerde AI-zoekmachine:

   Wat het doet:
   • Doorzoekt het web in real-time
   • Analyseert bronnen en genereert gestructureerde inzichten
   • Geeft antwoorden met bronvermelding

   Perfect voor:
   • Marktanalyse
   • Competitor research
   • Trend spotting
   • Content research

   💡 In ons platform: We gebruiken Perplexity voor de Research & Planning module om je actuele marktinzichten te geven
   ```

---

## 📋 **Variaties die nu werken:**

- "Hoe werkt Perplexity AI?"
- "Wat is Perplexity?"
- "Perplexity AI uitleg"
- "Vertel over Perplexity"
- "Wat doet Perplexity?"

---

## 🔧 **Technisch:**

- **Bestand:** `src/config/knowledgeBase.json`
- **Sectie:** `technical.questions`
- **ID:** `te_000`
- **Confidence matching:** >= 0.3 voor medium confidence, >= 0.5 voor high confidence

---

**Status:** ✅ **OPGELOST**
**Datum:** 2025-01-09
