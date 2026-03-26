import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const LIVE_URL = 'https://futuremarketingai.com';
const DEV_URL = 'http://localhost:3000';

const PAGES = [
  { path: '/en', name: 'homepage' },
  { path: '/en/chatbots', name: 'chatbots' },
  { path: '/en/automations', name: 'automations' },
  { path: '/en/voice-agents', name: 'voice-agents' },
  { path: '/en/marketing-machine', name: 'marketing-machine' },
  { path: '/en/how-it-works', name: 'how-it-works' },
  { path: '/en/pricing', name: 'pricing' },
  { path: '/en/about', name: 'about' },
  { path: '/en/contact', name: 'contact' },
];

async function run() {
  const outDir = path.join(__dirname, '..', 'screenshots');
  fs.mkdirSync(path.join(outDir, 'live'), { recursive: true });
  fs.mkdirSync(path.join(outDir, 'dev'), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
  });

  for (const page of PAGES) {
    console.log(`\n=== ${page.name} ===`);

    // Screenshot live site
    const livePage = await context.newPage();
    try {
      await livePage.goto(`${LIVE_URL}${page.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await livePage.waitForTimeout(2000);
      await livePage.screenshot({
        path: path.join(outDir, 'live', `${page.name}.png`),
        fullPage: true,
      });
      console.log(`  LIVE: ${page.name} - OK`);
    } catch (e: any) {
      console.log(`  LIVE: ${page.name} - FAILED: ${e.message}`);
    }
    await livePage.close();

    // Screenshot dev site
    const devPage = await context.newPage();
    try {
      await devPage.goto(`${DEV_URL}${page.path}`, { waitUntil: 'networkidle', timeout: 30000 });
      await devPage.waitForTimeout(2000);
      await devPage.screenshot({
        path: path.join(outDir, 'dev', `${page.name}.png`),
        fullPage: true,
      });
      console.log(`  DEV:  ${page.name} - OK`);
    } catch (e: any) {
      console.log(`  DEV:  ${page.name} - FAILED: ${e.message}`);
    }
    await devPage.close();
  }

  // Also capture header/footer details
  console.log('\n=== Header/Footer Detail ===');
  const detailPage = await context.newPage();

  // Live header
  await detailPage.goto(`${LIVE_URL}/en`, { waitUntil: 'networkidle', timeout: 30000 });
  await detailPage.waitForTimeout(2000);
  const liveHeader = await detailPage.$('header, nav, [class*="header"], [class*="Header"]');
  if (liveHeader) {
    await liveHeader.screenshot({ path: path.join(outDir, 'live', 'header-detail.png') });
    console.log('  LIVE header captured');
  }
  const liveFooter = await detailPage.$('footer, [class*="footer"], [class*="Footer"]');
  if (liveFooter) {
    await liveFooter.screenshot({ path: path.join(outDir, 'live', 'footer-detail.png') });
    console.log('  LIVE footer captured');
  }
  await detailPage.close();

  // Dev header
  const detailPage2 = await context.newPage();
  await detailPage2.goto(`${DEV_URL}/en`, { waitUntil: 'networkidle', timeout: 30000 });
  await detailPage2.waitForTimeout(2000);
  const devHeader = await detailPage2.$('header, nav, [class*="header"], [class*="Header"]');
  if (devHeader) {
    await devHeader.screenshot({ path: path.join(outDir, 'dev', 'header-detail.png') });
    console.log('  DEV header captured');
  }
  const devFooter = await detailPage2.$('footer, [class*="footer"], [class*="Footer"]');
  if (devFooter) {
    await devFooter.screenshot({ path: path.join(outDir, 'dev', 'footer-detail.png') });
    console.log('  DEV footer captured');
  }
  await detailPage2.close();

  await browser.close();
  console.log(`\nDone! Screenshots in: ${outDir}`);
}

run().catch(console.error);
