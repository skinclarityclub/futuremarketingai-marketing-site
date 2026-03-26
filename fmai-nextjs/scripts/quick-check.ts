import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Header
  const headerHTML = await page.$eval('header', el => el.innerHTML).catch(() => 'NO HEADER');
  console.log('HEADER login:', headerHTML.toLowerCase().includes('login') || headerHTML.toLowerCase().includes('log in'));
  console.log('HEADER sparkles:', headerHTML.includes('sparkle') || headerHTML.includes('Sparkle'));
  console.log('HEADER mobile-menu:', headerHTML.toLowerCase().includes('menu'));
  console.log('HEADER dropdown/services:', headerHTML.toLowerCase().includes('chatbot') || headerHTML.toLowerCase().includes('dropdown'));

  // Footer
  const footerHTML = await page.$eval('footer', el => el.innerHTML).catch(() => 'NO FOOTER');
  console.log('FOOTER linkedin:', footerHTML.toLowerCase().includes('linkedin'));
  console.log('FOOTER blog:', footerHTML.toLowerCase().includes('blog'));
  console.log('FOOTER services-section:', footerHTML.toLowerCase().includes('services') || footerHTML.toLowerCase().includes('product'));

  // Homepage body
  const bodyText = await page.$eval('body', el => el.textContent || '');
  console.log('PAGE trust/gdpr:', bodyText.toLowerCase().includes('gdpr') || bodyText.toLowerCase().includes('trust'));
  console.log('PAGE stats:', bodyText.includes('50+') || bodyText.toLowerCase().includes('active automation'));
  console.log('PAGE "Why Teams":', bodyText.includes('Why Teams Choose Us'));

  // Take fresh screenshot
  await page.screenshot({ path: 'screenshots/dev/homepage-after-fix.png', fullPage: true });
  console.log('Screenshot saved');

  await browser.close();
}
run().catch(console.error);
