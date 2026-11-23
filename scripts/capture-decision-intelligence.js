const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/Users/syamhariabidin/.gemini/antigravity/brain/e1e2118a-0d80-4b27-881c-b3c433b77478';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 950 });

  // Set admin cookie
  await page.setCookie({
    name: 'user_role',
    value: 'ADMIN',
    domain: 'localhost',
    path: '/',
  });

  console.log('Navigating to /admin/laporan...');
  await page.goto('http://localhost:3000/admin/laporan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to Decision Intelligence Section
  await page.evaluate(() => {
    window.scrollBy({ top: 400, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_laporan_decision_intelligence.png') });
  console.log('1. Captured: admin_laporan_decision_intelligence.png');

  // Scroll to Simulator Section
  await page.evaluate(() => {
    window.scrollBy({ top: 350, behavior: 'instant' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_laporan_what_if_simulator.png') });
  console.log('2. Captured: admin_laporan_what_if_simulator.png');

  await browser.close();
  console.log('Capture complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
