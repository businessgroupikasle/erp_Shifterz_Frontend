const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.goto('http://localhost:3000/dashboard/carin', { waitUntil: 'networkidle2' });
  await page.screenshot({ path: 'carin-screenshot.png' });
  console.log('Screenshot saved: carin-screenshot.png');
  await browser.close();
})();
