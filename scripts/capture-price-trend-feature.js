const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/Users/syamhariabidin/.gemini/antigravity/brain/e1e2118a-0d80-4b27-881c-b3c433b77478';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function waitForServer(url, timeout = 15000) {
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
  await waitForServer('http://localhost:3000/');
  console.log('Server is responsive! Launching Chrome Puppeteer...');

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 950 });

    // --- 1. Capture Storefront Product Cards with Price Trend Badges ---
    console.log('Navigating to homepage /...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    // Scroll to catalog grid
    await page.evaluate(() => {
      const el = document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'start' });
      else window.scrollBy({ top: 580, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'storefront_price_trend_badges.png') });
    console.log('1. Captured: storefront_price_trend_badges.png');

    // --- 2. Open Product Detail Modal (7-Day Price Trend & Dual-Source Tab) ---
    console.log('Clicking product card to open 7-day trend modal...');
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.astro-card'));
      if (cards[1]) cards[1].click();
      else if (cards[0]) cards[0].click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Scroll modal content down to show both 7-day chart & 2 data sources card
    await page.evaluate(() => {
      const scrollEl = document.querySelector('.overflow-y-auto');
      if (scrollEl) scrollEl.scrollTop = 480;
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'storefront_product_detail_trend_modal_scrolled.png') });
    console.log('2b. Captured: storefront_product_detail_trend_modal_scrolled.png');

    // Close modal
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 500));

    // --- 3. Navigate to Admin Radar Harga ---
    console.log('Navigating to /admin/radar-harga with user_role=ADMIN cookie...');
    await page.setCookie({
      name: 'user_role',
      value: 'ADMIN',
      domain: 'localhost',
      path: '/',
    });

    await page.goto('http://localhost:3000/admin/radar-harga', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_radar_dual_source_intelligence.png') });
    console.log('3. Captured: admin_radar_dual_source_intelligence.png');

    // Scroll down to show Publish bar with Signal selector
    await page.evaluate(() => {
      window.scrollBy({ top: 750, behavior: 'instant' });
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_radar_publish_bar_signals.png') });
    console.log('4. Captured: admin_radar_publish_bar_signals.png');

    console.log('All 3 screenshots successfully generated!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
