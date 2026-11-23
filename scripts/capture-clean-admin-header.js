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
  // Test at 1080px width where previous horizontal scrollbar was most prominent
  await page.setViewport({ width: 1080, height: 750 });

  // Set admin cookie
  await page.setCookie({
    name: 'user_role',
    value: 'ADMIN',
    domain: 'localhost',
    path: '/',
  });

  console.log('Navigating to /admin/produk at 1080px width...');
  await page.goto('http://localhost:3000/admin/produk', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // 1. Capture Header at 1080px
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_header_clean_1080px.png') });
  console.log('1. Captured: admin_header_clean_1080px.png');

  // 2. Capture Header at 1280px standard desktop
  await page.setViewport({ width: 1280, height: 800 });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_header_clean_1280px.png') });
  console.log('2. Captured: admin_header_clean_1280px.png');

  await browser.close();
  console.log('Capture complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
