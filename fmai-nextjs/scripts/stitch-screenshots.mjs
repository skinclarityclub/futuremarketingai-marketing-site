import { chromium } from 'playwright';
import { mkdirSync } from 'fs';
import { join } from 'path';

const BASE_URL = 'http://localhost:3000';
const LOCALE = 'nl';
const OUTPUT_DIR = join(import.meta.dirname, '..', 'screenshots', 'stitch-review');

const PAGES = [
  { name: 'home', path: '/' },
  { name: 'about', path: '/about' },
  { name: 'contact', path: '/contact' },
  { name: 'pricing', path: '/pricing' },
  { name: 'founding-member', path: '/founding-member' },
  { name: 'how-it-works', path: '/how-it-works' },
  { name: 'skills-ad-creator', path: '/skills/ad-creator' },
  { name: 'skills-chatbot', path: '/skills/chatbot' },
  { name: 'skills-content-creator', path: '/skills/content-creator' },
  { name: 'skills-email', path: '/skills/email' },
  { name: 'skills-lead-qualifier', path: '/skills/lead-qualifier' },
  { name: 'skills-reporting', path: '/skills/reporting' },
  { name: 'skills-social-media', path: '/skills/social-media' },
  { name: 'skills-voice-agent', path: '/skills/voice-agent' },
  { name: 'blog', path: '/blog' },
  { name: 'legal', path: '/legal' },
];

mkdirSync(OUTPUT_DIR, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 },
  deviceScaleFactor: 1,
});

console.log(`Capturing ${PAGES.length} pages (${LOCALE}) at 1920x1080...\n`);

for (const { name, path } of PAGES) {
  const url = `${BASE_URL}/${LOCALE}${path}`;
  const page = await context.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // Wait for animations to settle
    await page.waitForTimeout(1500);

    // Full-page screenshot
    const file = join(OUTPUT_DIR, `${name}-full.png`);
    await page.screenshot({ path: file, fullPage: true });
    console.log(`  ${name}-full.png`);

    // Above-the-fold screenshot (viewport only)
    const fold = join(OUTPUT_DIR, `${name}-fold.png`);
    await page.screenshot({ path: fold, fullPage: false });
    console.log(`  ${name}-fold.png`);
  } catch (err) {
    console.error(`  FAILED: ${name} — ${err.message}`);
  }

  await page.close();
}

await browser.close();
console.log(`\nDone! Screenshots saved to: ${OUTPUT_DIR}`);
