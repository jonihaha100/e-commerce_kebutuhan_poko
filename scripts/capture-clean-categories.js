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
  await page.setViewport({ width: 1366, height: 900 });

  // 1. Capture User Page Category Filter
  console.log('Navigating to user home page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll down slightly to make category filters prominent
  await page.evaluate(() => {
    const el = document.querySelector('#katalog');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'user_page_clean_categories.png') });
  console.log('1. Captured: user_page_clean_categories.png');

  // 2. Set Admin Cookie and Capture Admin Product Page Category Filter
  await page.setCookie({
    name: 'user_role',
    value: 'ADMIN',
    domain: 'localhost',
    path: '/',
  });

  console.log('Navigating to /admin/produk...');
  await page.goto('http://localhost:3000/admin/produk', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_produk_clean_categories.png') });
  console.log('2. Captured: admin_produk_clean_categories.png');

  await browser.close();
  console.log('Capture complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
