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
  await page.setViewport({ width: 1400, height: 950 });

  console.log('Navigating to http://localhost:3000/admin/laporan ...');
  await page.goto('http://localhost:3000/admin/laporan', { waitUntil: 'domcontentloaded', timeout: 20000 });
  await new Promise((r) => setTimeout(r, 2000));

  // 1. KPI & Decision Intelligence
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_laporan_kpi_dan_dss_fix.png`,
    fullPage: false
  });
  console.log('Captured admin_laporan_kpi_dan_dss_fix.png');

  // 2. Scroll to Simulator
  await page.evaluate(() => {
    window.scrollBy(0, 750);
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_laporan_simulator_skenario_fix.png`,
    fullPage: false
  });
  console.log('Captured admin_laporan_simulator_skenario_fix.png');

  // 3. Scroll to P&L Table & 5 Cluster Breakdown
  await page.evaluate(() => {
    window.scrollBy(0, 950);
  });
  await new Promise((r) => setTimeout(r, 1000));
  await page.screenshot({
    path: `${ARTIFACT_DIR}/admin_laporan_pnl_dan_klaster_fix.png`,
    fullPage: false
  });
  console.log('Captured admin_laporan_pnl_dan_klaster_fix.png');

  await browser.close();
  console.log('All screenshots captured successfully.');
})();
