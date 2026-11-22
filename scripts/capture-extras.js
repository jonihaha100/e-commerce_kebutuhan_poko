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
  await page.setViewport({ width: 1280, height: 900 });

  // Go to login and click Petani 1P
  await page.goto('http://localhost:3000/login');
  await new Promise((r) => setTimeout(r, 600));

  // Find and click the button for Kang Asep
  const buttons = await page.$$('button');
  for (const btn of buttons) {
    const text = await page.evaluate(el => el.textContent, btn);
    if (text && text.includes('Kang Asep')) {
      await btn.click();
      break;
    }
  }

  await new Promise((r) => setTimeout(r, 1000));

  // Navigate to /vendor/surat-jalan
  await page.goto('http://localhost:3000/vendor/surat-jalan', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '07_vendor_surat_jalan_petani.png') });
  console.log('Captured 07_vendor_surat_jalan_petani.png');

  // Navigate to /vendor/input-harian
  await page.goto('http://localhost:3000/vendor/input-harian', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, '06_vendor_input_petani.png') });
  console.log('Captured 06_vendor_input_petani.png');

  // Also capture Cart drawer open
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise((r) => setTimeout(r, 800));
  // Click first 2 "Keranjang" buttons
  const addButtons = await page.$$('button');
  let added = 0;
  for (const b of addButtons) {
    const txt = await page.evaluate(el => el.textContent, b);
    if (txt && txt.includes('Keranjang') && added < 3) {
      await b.click();
      added++;
      await new Promise(r => setTimeout(r, 300));
    }
  }
  // Open cart drawer
  const cartBtn = await page.$('button[aria-label="Keranjang Belanja"]');
  if (cartBtn) {
    await cartBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, '09_cart_drawer_groupbuy.png') });
    console.log('Captured 09_cart_drawer_groupbuy.png');
  }

  await browser.close();
}

capture().catch(console.error);
