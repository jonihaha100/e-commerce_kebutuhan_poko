const puppeteer = require('puppeteer-core');

const ARTIFACT_DIR = '/Users/syamhariabidin/.gemini/antigravity/brain/e1e2118a-0d80-4b27-881c-b3c433b77478';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1300, height: 900 });

  console.log('Navigating to http://localhost:3000/akun ...');
  await page.goto('http://localhost:3000/akun', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1500));

  // 1. Capture Smart Pantry & Wallet Overview
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_akun_smart_pantry_overview.png`,
    fullPage: false
  });
  console.log('Captured admin_akun_smart_pantry_overview.png');

  // 2. Scroll to Subuh Courier Drop Point & Profil Dapur Keluarga
  await page.evaluate(() => {
    window.scrollBy(0, 580);
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_akun_drop_point_and_kitchen_preferences.png`,
    fullPage: false
  });
  console.log('Captured admin_akun_drop_point_and_kitchen_preferences.png');

  // 3. Full Page Capture
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_akun_full_page.png`,
    fullPage: true
  });
  console.log('Captured admin_akun_full_page.png');

  await browser.close();
  console.log('All profile screenshots successfully captured.');
})();
