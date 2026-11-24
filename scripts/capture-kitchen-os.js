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
  await page.setViewport({ width: 1300, height: 950 });

  console.log('Navigating to http://localhost:3000/akun ...');
  await page.goto('http://localhost:3000/akun', { waitUntil: 'networkidle0', timeout: 20000 });
  await new Promise((r) => setTimeout(r, 1500));

  // 1. Capture Kitchen OS Command Center (Top Half)
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_kitchen_os_command_center.png`,
    fullPage: false
  });
  console.log('Captured admin_kitchen_os_command_center.png');

  // 2. Scroll to Radar Stok & SOP Pengantaran
  await page.evaluate(() => {
    window.scrollBy(0, 680);
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_kitchen_os_radar_and_sop.png`,
    fullPage: false
  });
  console.log('Captured admin_kitchen_os_radar_and_sop.png');

  // 3. Scroll back to top & open "Klaim Barang Rusak (5 Detik)" modal
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await new Promise((r) => setTimeout(r, 800));

  console.log('Clicking "Klaim Barang Rusak (5 Detik)" ...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const btn = buttons.find(b => b.textContent.includes('Klaim Barang Rusak'));
    if (btn) btn.click();
  });
  await new Promise((r) => setTimeout(r, 800));
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_kitchen_os_instant_claim_modal.png`,
    fullPage: false
  });
  console.log('Captured admin_kitchen_os_instant_claim_modal.png');

  // 4. Full Page
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_kitchen_os_full_page.png`,
    fullPage: true
  });
  console.log('Captured admin_kitchen_os_full_page.png');

  await browser.close();
  console.log('All Kitchen OS screenshots successfully captured.');
})();
