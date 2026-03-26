import { chromium, Page } from '@playwright/test';

const DEV = 'http://localhost:3000';

interface AuditResult {
  page: string;
  passed: string[];
  failed: string[];
}

async function auditHeader(page: Page, pageName: string): Promise<{ passed: string[]; failed: string[] }> {
  const passed: string[] = [];
  const failed: string[] = [];

  // Logo
  const logo = await page.$('header a[href="/"]');
  (logo ? passed : failed).push('Header: Logo with home link');

  // Nav items expected
  const navLinks = await page.$$('header nav a, header a');
  const navTexts = await Promise.all(navLinks.map(l => l.textContent()));
  const navText = navTexts.join(' ').toLowerCase();

  // Check for key nav items
  for (const item of ['pricing', 'about', 'contact']) {
    (navText.includes(item) ? passed : failed).push(`Header: Nav link "${item}"`);
  }

  // Login button
  const loginBtn = await page.$('header [href*="login"], header button:has-text("Login"), header button:has-text("Log in"), header a:has-text("Login"), header a:has-text("Log in")');
  (loginBtn ? passed : failed).push('Header: Login/Sign-in button');

  // Language switcher
  const langSwitcher = await page.$('header [class*="locale"], header [class*="lang"], header select, header button:has-text("EN"), header button:has-text("NL")');
  (langSwitcher ? passed : failed).push('Header: Language switcher');

  // Mobile menu button (should exist but hidden on desktop)
  const mobileMenu = await page.$('header button[aria-label*="menu"], header button[aria-label*="Menu"], header [class*="mobile"], header [class*="hamburger"]');
  (mobileMenu ? passed : failed).push('Header: Mobile menu button');

  // Service dropdown or service links
  const serviceDropdown = await page.$('header [class*="dropdown"], header button:has-text("Services"), header [aria-expanded]');
  (serviceDropdown ? passed : failed).push('Header: Services dropdown/mega menu');

  return { passed, failed };
}

async function auditFooter(page: Page): Promise<{ passed: string[]; failed: string[] }> {
  const passed: string[] = [];
  const failed: string[] = [];

  const footer = await page.$('footer');
  (footer ? passed : failed).push('Footer: Exists');

  if (!footer) return { passed, failed };

  const footerText = (await footer.textContent()) || '';
  const footerLower = footerText.toLowerCase();

  // 4-column layout check
  const columns = await footer.$$('nav, div > h3, [class*="col"]');
  (columns.length >= 3 ? passed : failed).push(`Footer: Has ${columns.length} sections (need 4+)`);

  // Product section
  (footerLower.includes('product') || footerLower.includes('services') ? passed : failed).push('Footer: Product/Services section');

  // Resources section
  (footerLower.includes('resources') || footerLower.includes('blog') ? passed : failed).push('Footer: Resources section');

  // Social links
  const socialLinks = await footer.$$('a[href*="linkedin"], a[href*="twitter"], a[href*="github"], svg');
  (socialLinks.length >= 1 ? passed : failed).push('Footer: Social media links');

  // Service links in footer
  for (const service of ['chatbots', 'automations', 'voice']) {
    (footerLower.includes(service) ? passed : failed).push(`Footer: "${service}" link`);
  }

  // Blog link
  (footerLower.includes('blog') ? passed : failed).push('Footer: Blog link');

  return { passed, failed };
}

async function auditHomepage(page: Page): Promise<{ passed: string[]; failed: string[] }> {
  const passed: string[] = [];
  const failed: string[] = [];

  // Hero section
  const hero = await page.$('h1');
  (hero ? passed : failed).push('Homepage: Hero heading');

  // CTA buttons
  const ctaButtons = await page.$$('a[class*="cta"], a[class*="CTA"], button[class*="cta"], [class*="hero"] a, [class*="Hero"] a');
  (ctaButtons.length >= 1 ? passed : failed).push(`Homepage: CTA buttons (found ${ctaButtons.length})`);

  // Service cards section
  const serviceCards = await page.$$('[class*="card"], [class*="Card"]');
  (serviceCards.length >= 4 ? passed : failed).push(`Homepage: Service cards (found ${serviceCards.length}, need 4)`);

  // "Why Teams Choose Us" section - should have content
  const whySection = await page.$('text="Why Teams Choose Us"');
  if (whySection) {
    passed.push('Homepage: "Why Teams Choose Us" heading exists');
    // Check for content AFTER this heading
    const parent = await whySection.$('xpath=..');
    const grandparent = await parent?.$('xpath=..');
    const section = grandparent || parent;
    const sectionText = await section?.textContent() || '';
    // If section only has the heading text and nothing substantial, it's empty
    const contentLength = sectionText.replace('Why Teams Choose Us', '').trim().length;
    (contentLength > 50 ? passed : failed).push(`Homepage: "Why Teams Choose Us" has content (${contentLength} chars after heading)`);
  } else {
    failed.push('Homepage: "Why Teams Choose Us" heading missing');
  }

  // Social proof / trust badges
  const trustBadges = await page.$$('[class*="trust"], [class*="Trust"], [class*="proof"], [class*="Proof"], [class*="badge"], [class*="Badge"]');
  (trustBadges.length >= 1 ? passed : failed).push('Homepage: Trust badges/social proof');

  // Stats/metrics section
  const stats = await page.$$('[class*="stat"], [class*="Stat"], [class*="metric"], [class*="Metric"], [class*="counter"]');
  (stats.length >= 1 ? passed : failed).push('Homepage: Stats/metrics section');

  return { passed, failed };
}

async function auditServicePage(page: Page, name: string): Promise<{ passed: string[]; failed: string[] }> {
  const passed: string[] = [];
  const failed: string[] = [];

  // Hero
  const h1 = await page.$('h1');
  (h1 ? passed : failed).push(`${name}: Hero heading`);

  // CTA
  const cta = await page.$('[class*="cta"], [class*="CTA"], a[href*="calendly"], a:has-text("Strategy"), a:has-text("Demo")');
  (cta ? passed : failed).push(`${name}: CTA button`);

  // Feature/benefit cards
  const cards = await page.$$('[class*="card"], [class*="Card"], [class*="glass"]');
  (cards.length >= 2 ? passed : failed).push(`${name}: Feature cards (found ${cards.length})`);

  // FAQ section
  const faq = await page.$('[class*="faq"], [class*="FAQ"], [class*="question"]');
  const faqHeading = await page.$('h2');
  const faqHeadings = await page.$$('h2, h3');
  const hasFaqText = (await Promise.all(faqHeadings.map(h => h.textContent()))).some(t => t?.toLowerCase().includes('faq') || t?.toLowerCase().includes('question'));
  const faqItems = await page.$$('details, [class*="accordion"], [class*="faq"] h3, [class*="faq"] h4, dt');
  (faq || hasFaqText || faqItems.length >= 1 ? passed : failed).push(`${name}: FAQ section`);

  return { passed, failed };
}

async function run() {
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const results: AuditResult[] = [];

  // Homepage
  console.log('Auditing homepage...');
  const homePage = await ctx.newPage();
  await homePage.goto(`${DEV}/en`, { waitUntil: 'networkidle', timeout: 30000 });
  await homePage.waitForTimeout(2000);

  const headerRes = await auditHeader(homePage, 'homepage');
  const footerRes = await auditFooter(homePage);
  const homeRes = await auditHomepage(homePage);

  results.push({
    page: 'Homepage',
    passed: [...headerRes.passed, ...footerRes.passed, ...homeRes.passed],
    failed: [...headerRes.failed, ...footerRes.failed, ...homeRes.failed],
  });
  await homePage.close();

  // Service pages
  for (const svc of [
    { path: '/en/chatbots', name: 'Chatbots' },
    { path: '/en/automations', name: 'Automations' },
    { path: '/en/voice-agents', name: 'Voice Agents' },
    { path: '/en/marketing-machine', name: 'Marketing Machine' },
  ]) {
    console.log(`Auditing ${svc.name}...`);
    const p = await ctx.newPage();
    await p.goto(`${DEV}${svc.path}`, { waitUntil: 'networkidle', timeout: 30000 });
    await p.waitForTimeout(1500);
    const svcRes = await auditServicePage(p, svc.name);
    results.push({ page: svc.name, ...svcRes });
    await p.close();
  }

  // Pricing
  console.log('Auditing pricing...');
  const pricingPage = await ctx.newPage();
  await pricingPage.goto(`${DEV}/en/pricing`, { waitUntil: 'networkidle', timeout: 30000 });
  await pricingPage.waitForTimeout(1500);
  const pricingPassed: string[] = [];
  const pricingFailed: string[] = [];
  const pricingCards = await pricingPage.$$('[class*="card"], [class*="Card"], [class*="tier"], [class*="plan"]');
  (pricingCards.length >= 3 ? pricingPassed : pricingFailed).push(`Pricing: Tier cards (found ${pricingCards.length})`);
  const pricingCTA = await pricingPage.$$('a:has-text("Book"), a:has-text("Strategy"), button:has-text("Book")');
  (pricingCTA.length >= 2 ? pricingPassed : pricingFailed).push(`Pricing: CTA buttons (found ${pricingCTA.length})`);
  results.push({ page: 'Pricing', passed: pricingPassed, failed: pricingFailed });
  await pricingPage.close();

  await browser.close();

  // Report
  let totalPassed = 0;
  let totalFailed = 0;

  console.log('\n' + '='.repeat(70));
  console.log('  SITE AUDIT REPORT');
  console.log('='.repeat(70));

  for (const r of results) {
    console.log(`\n## ${r.page}`);
    for (const p of r.passed) console.log(`  ✓ ${p}`);
    for (const f of r.failed) console.log(`  ✗ ${f}`);
    totalPassed += r.passed.length;
    totalFailed += r.failed.length;
  }

  console.log('\n' + '='.repeat(70));
  console.log(`  TOTAL: ${totalPassed} passed, ${totalFailed} failed`);
  console.log('='.repeat(70));

  // Write failures to file for agents to consume
  const failures = results.flatMap(r => r.failed.map(f => `[${r.page}] ${f}`));
  const fs = await import('fs');
  fs.writeFileSync('scripts/audit-failures.txt', failures.join('\n'));
  console.log(`\nFailures written to scripts/audit-failures.txt`);
}

run().catch(console.error);
