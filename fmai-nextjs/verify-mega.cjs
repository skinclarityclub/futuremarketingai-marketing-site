const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
  await page.goto('http://localhost:3001/en', { waitUntil: 'networkidle', timeout: 15000 }).catch(() => {});
  await page.waitForTimeout(2000);
  const skillsBtn = await page.$('text=Skills');
  if (skillsBtn) await skillsBtn.hover();
  await page.waitForTimeout(800);
  await page.screenshot({ path: 'mega-menu-final.png' });
  await browser.close();
})();
