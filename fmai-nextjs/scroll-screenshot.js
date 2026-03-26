const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  
  await page.goto('http://localhost:3001/en/skills/lead-qualifier', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'chatbots-scroll1.png' });
  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'chatbots-scroll2.png' });
  await page.evaluate(() => window.scrollBy(0, 2000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'chatbots-scroll3.png' });
  
  await page.goto('http://localhost:3001/en/skills/voice-agent', { waitUntil: 'networkidle' });
  await page.evaluate(() => window.scrollBy(0, 1500));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'voice-scroll1.png' });
  await page.evaluate(() => window.scrollBy(0, 2000));
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'voice-scroll2.png' });

  await browser.close();
})();
