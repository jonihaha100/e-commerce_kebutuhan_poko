const puppeteer = require('puppeteer-core');
const path = require('path');

const ARTIFACT_DIR = '/Users/syamhariabidin/.gemini/antigravity/brain/e1e2118a-0d80-4b27-881c-b3c433b77478';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const pagesToCapture = [
  {
    name: '01_storefront_desktop.png',
    url: 'http://localhost:3000/',
    role: 'CUSTOMER',
    viewport: { width: 1280, height: 900 },
  },
  {
    name: '02_pilih_komplek.png',
    url: 'http://localhost:3000/pilih-komplek',
    role: 'CUSTOMER',
    viewport: { width: 1280, height: 850 },
  },
  {
    name: '03_waitlist_buah_batu.png',
    url: 'http://localhost:3000/c/buah-batu-regency',
    role: 'CUSTOMER',
    viewport: { width: 1280, height: 900 },
  },
  {
    name: '04_crm_account.png',
    url: 'http://localhost:3000/akun',
    role: 'CUSTOMER',
    viewport: { width: 1280, height: 950 },
  },
  {
    name: '05_admin_radar_harga.png',
    url: 'http://localhost:3000/admin/radar-harga',
    role: 'ADMIN',
    viewport: { width: 1280, height: 1000 },
  },
  {
    name: '06_vendor_input_harian.png',
    url: 'http://localhost:3000/vendor/input-harian',
    role: 'VENDOR_PETANI',
    viewport: { width: 1280, height: 950 },
  },
  {
    name: '07_vendor_surat_jalan.png',
    url: 'http://localhost:3000/vendor/surat-jalan',
    role: 'VENDOR_PETANI',
    viewport: { width: 1280, height: 850 },
  },
  {
    name: '08_storefront_mobile.png',
    url: 'http://localhost:3000/',
    role: 'CUSTOMER',
    viewport: { width: 390, height: 844, isMobile: true, hasTouch: true },
  },
];

async function captureAll() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
  });

  for (const pageInfo of pagesToCapture) {
    const page = await browser.newPage();
    await page.setViewport(pageInfo.viewport);

    // Set user_role cookie
    await page.setCookie({
      name: 'user_role',
      value: pageInfo.role,
      domain: 'localhost',
      path: '/',
    });

    await page.goto(pageInfo.url, { waitUntil: 'networkidle0', timeout: 30000 });
    // Small delay to allow charts or animations to render
    await new Promise((r) => setTimeout(r, 1200));

    const outputPath = path.join(ARTIFACT_DIR, pageInfo.name);
    await page.screenshot({ path: outputPath, fullPage: false });
    console.log(`Captured: ${pageInfo.name}`);
    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully.');
}

captureAll().catch((err) => {
  console.error('Error capturing screenshots:', err);
  process.exit(1);
});
