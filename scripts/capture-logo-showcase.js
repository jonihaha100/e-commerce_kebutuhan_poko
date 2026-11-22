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

  // 1. Storefront Desktop with Logo & Astro UI
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logo_01_storefront_astro.png') });
  console.log('Captured logo_01_storefront_astro.png');

  // 2. Click "+ Tambah" on first 2 cards to trigger Astro Stepper and Floating Cart Bar
  const addButtons = await page.$$('button');
  for (const b of addButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.trim() === 'Tambah') {
      await b.click();
      await new Promise(r => setTimeout(r, 400));
    }
  }

  // Capture Stepper & Floating Cart Bar in action
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logo_02_stepper_floating_cart.png') });
  console.log('Captured logo_02_stepper_floating_cart.png');

  // 3. Checkout Midtrans Gateway Page
  await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logo_03_checkout_midtrans.png') });
  console.log('Captured logo_03_checkout_midtrans.png');

  // Trigger Midtrans Snap Modal simulation
  const payBtn = await page.$('button[form="checkout-form"]');
  if (payBtn) {
    await payBtn.click();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logo_04_midtrans_snap_modal.png') });
    console.log('Captured logo_04_midtrans_snap_modal.png');
  }

  // 4. Admin Radar Harga (PRD Modul 2B)
  await page.setCookie({ name: 'user_role', value: 'ADMIN', domain: 'localhost', path: '/' });
  await page.goto('http://localhost:3000/admin/radar-harga', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logo_05_admin_radar.png') });
  console.log('Captured logo_05_admin_radar.png');

  // 5. Mobile Viewport (Astro Quick-Commerce Experience)
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'logo_06_mobile_astro.png') });
  console.log('Captured logo_06_mobile_astro.png');

  await browser.close();
  console.log('All Logo Showcase screenshots captured successfully!');
}

capture().catch(console.error);
