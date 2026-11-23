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

  console.log('Navigating to user home page...');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));

  // Scroll to catalog section
  await page.evaluate(() => {
    const el = document.querySelector('#katalog');
    if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(r => setTimeout(r, 600));

  // Helper to click element by text
  const clickElementWithText = async (selector, targetText) => {
    const elements = await page.$$(selector);
    for (const el of elements) {
      const text = await page.evaluate(node => node.textContent, el);
      if (text && text.includes(targetText)) {
        await el.click();
        await new Promise(r => setTimeout(r, 600));
        return true;
      }
    }
    return false;
  };

  // 1. Click on Pakcoy card to open Product Detail Modal
  console.log('Clicking Pakcoy card...');
  const cardClicked = await clickElementWithText('h3', 'Pakcoy Hidroponik');
  console.log('Card clicked:', cardClicked);
  await new Promise(r => setTimeout(r, 800));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'product_detail_modal_overview.png') });
  console.log('1. Captured: product_detail_modal_overview.png');

  // 2. Click "Tips Simpan di Kulkas" tab
  console.log('Clicking Tips Simpan tab...');
  await clickElementWithText('button', 'Tips Simpan di Kulkas');
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'product_detail_modal_storage_tab.png') });
  console.log('2. Captured: product_detail_modal_storage_tab.png');

  // 3. Click "Ide Masakan" tab
  console.log('Clicking Ide Masakan tab...');
  await clickElementWithText('button', 'Ide Masakan');
  await new Promise(r => setTimeout(r, 600));

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'product_detail_modal_recipes_tab.png') });
  console.log('3. Captured: product_detail_modal_recipes_tab.png');

  await browser.close();
  console.log('Capture complete!');
}

capture().catch(err => {
  console.error('Capture error:', err);
  process.exit(1);
});
