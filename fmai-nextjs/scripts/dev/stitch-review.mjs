import { stitch } from '@google/stitch-sdk';

const PROJECT_ID = '13183897990704750993'; // without projects/ prefix

const PAGES = [
  {
    name: 'home',
    prompt: 'Enterprise AI marketing platform homepage for "FutureMarketingAI". Dark theme (#050814 background). Hero section with bold headline "Your AI Marketing Team" about AI-powered marketing automation for agencies. Animated orbit visualization showing AI agents working together. Two CTA buttons: "Start Free Trial" (cyan #00D4FF) and "Watch Demo" (outline). Navigation bar with logo and mega menu. Stats section showing 10x ROI, 85% time saved. Feature cards with glassmorphism effect. Testimonials carousel. Footer with links. Colors: cyan #00D4FF primary, purple #A855F7 secondary, green #00FF88 success. Font: Inter. Premium B2B SaaS aesthetic.',
  },
  {
    name: 'about',
    prompt: 'About page for "FutureMarketingAI" — AI marketing agency platform. Dark theme (#050814). Mission statement about democratizing AI marketing for agencies. Team section with founder profile. Company timeline/milestones. Values: Innovation, Transparency, Results. Partner logos section. Same dark futuristic aesthetic with cyan #00D4FF and purple #A855F7 accents. Glassmorphism cards. Font: Inter.',
  },
  {
    name: 'pricing',
    prompt: 'SaaS pricing page for "FutureMarketingAI". Dark theme (#050814). 3 pricing tiers: Starter (€497/mo), Professional (€997/mo - highlighted), Enterprise (custom). Monthly/yearly toggle with 20% discount. Each tier shows included AI agents and features. Feature comparison table below. Enterprise CTA "Contact Sales". FAQ accordion. Colors: cyan #00D4FF, purple #A855F7 highlight on popular tier. Glassmorphism cards. Font: Inter.',
  },
  {
    name: 'contact',
    prompt: 'Contact page for "FutureMarketingAI". Dark theme (#050814). Left side: contact form with fields for name, email, company name, budget range dropdown, message textarea, submit button (cyan #00D4FF gradient). Right side: company info, email, phone, office address in Amsterdam. Social media links. Background subtle grid pattern. Glassmorphism form container. Font: Inter.',
  },
  {
    name: 'how-it-works',
    prompt: 'How it works page for "FutureMarketingAI" AI marketing platform. Dark theme (#050814). 4-step process: 1) Connect your channels 2) AI analyzes your audience 3) Agents create and execute campaigns 4) Real-time optimization and reporting. Each step has an icon and illustration. Interactive demo section showing live AI agent dashboard. Integration logos (Google Ads, Meta, LinkedIn, HubSpot). CTA "Start Your Free Trial". Colors: cyan #00D4FF, purple #A855F7. Font: Inter.',
  },
  {
    name: 'skills-chatbot',
    prompt: 'Product page for AI Chatbot agent by "FutureMarketingAI". Dark theme (#050814). Hero with chatbot interface preview showing conversation. Key metrics: 90% resolution rate, 24/7 availability, 3sec response time. Features: multilingual support, CRM integration, lead capture, sentiment analysis. Live demo chat widget. Integration logos. Pricing CTA. Colors: cyan #00D4FF primary, purple #A855F7 secondary. Glassmorphism UI elements. Font: Inter.',
  },
  {
    name: 'skills-voice-agent',
    prompt: 'Product page for AI Voice Agent by "FutureMarketingAI". Dark theme (#050814). Hero with audio waveform visualization and phone call UI mockup. Key features: natural voice conversations, appointment scheduling, call routing, call transcription. Metrics: 500+ calls/day capacity, 95% satisfaction. Call flow diagram. Integration with calendars and CRM. Colors: cyan #00D4FF, purple #A855F7. Glassmorphism cards. Font: Inter.',
  },
  {
    name: 'skills-lead-qualifier',
    prompt: 'Product page for AI Lead Qualification agent by "FutureMarketingAI". Dark theme (#050814). Hero with lead scoring dashboard preview showing lead cards with scores. Conversion funnel visualization. ROI calculator section. Features: automatic scoring, enrichment, routing, follow-up sequences. Metrics: 3x qualified leads, 60% faster qualification. CRM integration logos. Colors: cyan #00D4FF, purple #A855F7. Glassmorphism. Font: Inter.',
  },
];

async function main() {
  console.log('=== Generating Stitch Design Review Screens ===\n');
  console.log(`Project ID: ${PROJECT_ID}`);
  console.log(`Pages to generate: ${PAGES.length}\n`);

  const results = [];

  for (const page of PAGES) {
    console.log(`Generating: ${page.name}...`);
    const start = Date.now();

    try {
      const result = await stitch.callTool('generate_screen_from_text', {
        projectId: PROJECT_ID,
        prompt: page.prompt,
        deviceType: 'DESKTOP',
        modelId: 'GEMINI_3_1_PRO',
      });

      const elapsed = ((Date.now() - start) / 1000).toFixed(1);
      console.log(`  Done (${elapsed}s)`);

      // Extract screen info
      const screen = result?.screen || result?.screens?.[0] || result;
      const screenshotUrl = screen?.screenshot?.downloadUrl || 'n/a';
      const htmlUrl = screen?.html?.downloadUrl || 'n/a';
      console.log(`  Screenshot: ${screenshotUrl.slice(0, 80)}...`);
      console.log(`  HTML: ${htmlUrl.slice(0, 80)}...`);

      results.push({ page: page.name, screen, success: true });
    } catch (err) {
      console.error(`  FAILED: ${err.message}`);
      results.push({ page: page.name, success: false, error: err.message });
    }
    console.log();
  }

  // Summary
  console.log('=== SUMMARY ===\n');
  const success = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;
  console.log(`Generated: ${success}/${PAGES.length}`);
  console.log(`Failed: ${failed}/${PAGES.length}`);
  console.log(`\nView designs: https://stitch.withgoogle.com/project/${PROJECT_ID}`);

  await stitch.close();
}

main().catch(console.error);
