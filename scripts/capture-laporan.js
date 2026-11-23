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

  // 1. Capture Dashboard Overview
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_laporan_dashboard.png') });
  console.log('1. Captured: admin_laporan_dashboard.png');

  // Helper to click button with text
  const clickButtonWithText = async (targetText) => {
    const btns = await page.$$('button');
    for (const b of btns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes(targetText)) {
        await b.click();
        await new Promise(r => setTimeout(r, 600));
        return true;
      }
    }
    return false;
  };

  // 2. Open Tutup Buku modal
  const clicked = await clickButtonWithText('Proses Tutup Buku');
  console.log('Clicked Tutup Buku button:', clicked);
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_laporan_closing_modal.png') });
  console.log('2. Captured: admin_laporan_closing_modal.png');

  await browser.close();
  console.log('Capture complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
