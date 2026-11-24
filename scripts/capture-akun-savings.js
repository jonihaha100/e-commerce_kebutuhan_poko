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

  // 1. Capture Overview with new "Total Penghematan Dapur" Card
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_akun_total_savings_overview.png`,
    fullPage: false
  });
  console.log('Captured admin_akun_total_savings_overview.png');

  // 2. Click "Lihat Rincian Hemat" button to open Modal
  console.log('Clicking "Lihat Rincian Hemat" button ...');
  const modalButton = await page.$('button ::-p-text(Lihat Rincian Hemat)');
  if (modalButton) {
    await modalButton.click();
  } else {
    // Fallback: evaluate click
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find(b => b.textContent.includes('Lihat Rincian Hemat'));
      if (btn) btn.click();
    });
  }
  await new Promise((r) => setTimeout(r, 1000));

  // 3. Capture Savings Breakdown Modal
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_akun_savings_breakdown_modal.png`,
    fullPage: false
  });
  console.log('Captured admin_akun_savings_breakdown_modal.png');

  await browser.close();
  console.log('All savings screenshots successfully captured.');
})();
