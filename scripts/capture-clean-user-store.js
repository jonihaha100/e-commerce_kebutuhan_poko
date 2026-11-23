const puppeteer = require('puppeteer-core');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = '/Users/syamhariabidin/.gemini/antigravity/brain/e1e2118a-0d80-4b27-881c-b3c433b77478';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) return true;
    } catch (e) {
      // wait
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond at ${url} within ${timeout}ms`);
}

async function run() {
  console.log('Starting Next.js production server on port 3000...');
  const server = spawn('npm', ['start', '--', '-p', '3000'], {
    cwd: '/Users/syamhariabidin/e-commerce_kebutuhan_poko',
    stdio: 'ignore',
  });

  try {
    await waitForServer('http://localhost:3000/');
    console.log('Server is ready! Launching Chrome Puppeteer...');

    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 950 });

    console.log('Navigating to homepage / as a customer...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // 1. Capture Header & Top Navbar
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean_user_navbar.png') });
    console.log('1. Captured: clean_user_navbar.png');

    // 2. Scroll to Product Catalog Grid
    await page.evaluate(() => {
      const el = document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollBy({ top: 550, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean_user_product_cards.png') });
    console.log('2. Captured: clean_user_product_cards.png');

    // 3. Click first product card to show clean detail modal
    await page.evaluate(() => {
      const card = document.querySelector('.astro-card');
      if (card) card.click();
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'clean_user_product_detail_modal.png') });
    console.log('3. Captured: clean_user_product_detail_modal.png');

    await browser.close();
    console.log('All screenshots captured successfully!');
  } finally {
    console.log('Shutting down Next.js server...');
    server.kill();
  }
}

run().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
