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

    // Set admin cookie
    await page.setCookie({
      name: 'user_role',
      value: 'ADMIN',
      domain: 'localhost',
      path: '/',
    });

    console.log('Navigating to /admin/pesanan...');
    await page.goto('http://localhost:3000/admin/pesanan', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1500));

    // 1. Click "Draft Rute Kurir (5 Wilayah • 50 Order)" button
    console.log('Opening Draft Rute Kurir modal...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const draftBtn = btns.find(b => b.textContent && b.textContent.includes('Draft Rute Kurir'));
      if (draftBtn) draftBtn.click();
    });
    await new Promise(r => setTimeout(r, 1200));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_courier_dispatch_modal_overview.png') });
    console.log('1. Captured: admin_courier_dispatch_modal_overview.png');

    // 2. Select Stop 2 (Arcamanik Endah)
    console.log('Selecting Stop 2: Arcamanik Endah...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const stop2Btn = btns.find(b => b.textContent && b.textContent.includes('Arcamanik'));
      if (stop2Btn) stop2Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Scroll down to show action buttons
    await page.evaluate(() => {
      const modalScroll = document.querySelector('.max-h-\\[92vh\\]');
      if (modalScroll) modalScroll.scrollTop = 350;
    });
    await new Promise(r => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'admin_courier_dispatch_stop_detail.png') });
    console.log('2. Captured: admin_courier_dispatch_stop_detail.png');

    console.log('Screenshots successfully generated!');
  } finally {
    await browser.close();
  }
}

run().catch(err => {
  console.error('Error during capture:', err);
  process.exit(1);
});
