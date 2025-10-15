/**
 * Module Explanations Configuration
 *
 * Centralized content for module explanations
 * Makes it easy to update messaging and maintain consistency
 */

export const MODULE_EXPLANATIONS: Record<string, string> = {
  explain_perplexity: `🧠 **Perplexity AI** is een geavanceerde AI-zoekmachine die realtime online onderzoek doet.

✨ Het doorzoekt het web, analyseert bronnen, en genereert gestructureerde inzichten.
💡 Perfect voor: marktanalyse, competitor research, trend spotting

**Wil je een voorbeeld zien?**`,

  explain_coordination: `💼 **Manager Workflow** is het centrale brein dat alle modules orkestreert.

🔄 Het zorgt dat:
• Research → Content creation → Publishing → Analytics naadloos werkt
• Alles op tijd gebeurt
• Er geen handmatige stappen nodig zijn

**Denk aan een conductor die een orkest leidt!** 🎼`,

  explain_content_types: `📝 De **Content Pipeline** kan vele content types genereren:

• 📄 Blog posts & artikelen (SEO-geoptimaliseerd)
• 📱 Social media posts (LinkedIn, Twitter, Instagram)
• 📧 Email campaigns
• 🎥 Video scripts
• 📊 Case studies
• 🎯 Landing pages

**Alles AI-gegenereerd, menselijk gecontroleerd!**`,

  explain_telegram: `📱 **Waarom Telegram?**

✅ Beveiligd & snel
✅ Werkt op alle devices
✅ Push notifications
✅ Geen extra app nodig

**Scenario:** Je AI genereert content → je krijgt notificatie op je telefoon → je keurt goed/af binnen 10 seconden → content wordt gepublished.

**Alles on-the-go! ⚡**`,

  explain_channels: `🚀 **Ondersteunde Publishing Kanalen:**

• 📱 Social: LinkedIn, Twitter, Instagram, Facebook
• 📧 Email: MailChimp, SendGrid, Custom SMTP
• 📝 Blog: WordPress, Medium, Custom CMS
• 🎥 Video: YouTube, Vimeo
• 📊 Analytics: Google Analytics, Mixpanel

**1-click publishing naar alle kanalen!**`,

  explain_metrics: `📊 **Metrics die we tracken:**

• 📈 Engagement: CTR, time-on-page, bounce rate
• 💰 Conversie: Sign-ups, purchases, ROI
• 👥 Audience: Demographics, behavior, preferences
• 🎯 Campaign performance: Per channel, per content type
• 🤖 AI predictions: What will work best

**Real-time dashboards met AI insights!**`,
}

/**
 * Next module navigation configuration
 */
export const NEXT_MODULE_MAP: Record<string, { route: string; name: string }> = {
  next_module_manager: { route: '/explorer#manager-workflow', name: 'Manager Workflow' },
  next_module_content: { route: '/explorer#content-pipeline', name: 'Content Pipeline' },
  next_module_telegram: { route: '/explorer#telegram-control', name: 'Telegram Control' },
  next_module_publishing: { route: '/explorer#publishing-layer', name: 'Publishing Layer' },
  next_module_analytics: { route: '/explorer#analytics-lab', name: 'Analytics Lab' },
  next_module_adbuilder: { route: '/explorer#ad-builder', name: 'Ad Builder Studio' },
}
