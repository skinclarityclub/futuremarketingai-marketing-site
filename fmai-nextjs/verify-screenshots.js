const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  // Homepage - check floating language switcher
  await page.goto('http://localhost:3001', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify-home.png' });
  
  // Lead qualifier - check demos
  await page.goto('http://localhost:3001/en/skills/lead-qualifier', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'verify-leadqual-top.png' });
  await page.evaluate(() => window.scrollBy(0, 2000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify-leadqual-mid.png' });
  await page.evaluate(() => window.scrollBy(0, 2000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify-leadqual-bottom.png' });
  
  // Voice agent - check demos
  await page.goto('http://localhost:3001/en/skills/voice-agent', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  await page.evaluate(() => window.scrollBy(0, 2000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'verify-voice-mid.png' });
  
  await browser.close();
})();
