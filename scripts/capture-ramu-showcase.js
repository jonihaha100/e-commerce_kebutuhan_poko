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

  // 1. Storefront Desktop
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_01_storefront_desktop.png') });
  console.log('Captured ramu_01_storefront_desktop.png');

  // Add items to cart for checkout
  const buttons = await page.$$('button');
  let added = 0;
  for (const b of buttons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('+ Keranjang') && added < 3) {
      await b.click();
      added++;
      await new Promise(r => setTimeout(r, 300));
    }
  }

  // Open Cart drawer
  const cartBtn = await page.$('button[aria-label="Keranjang Belanja"]');
  if (cartBtn) {
    await cartBtn.click();
    await new Promise(r => setTimeout(r, 700));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_04_cart_groupbuy.png') });
    console.log('Captured ramu_04_cart_groupbuy.png');
  }

  // 2. Checkout Midtrans Gateway Page
  await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_02_checkout_midtrans.png') });
  console.log('Captured ramu_02_checkout_midtrans.png');

  // Trigger Midtrans Snap Modal simulation
  const payBtn = await page.$('button[form="checkout-form"]');
  if (payBtn) {
    await payBtn.click();
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_02b_midtrans_snap_modal.png') });
    console.log('Captured ramu_02b_midtrans_snap_modal.png');
  }

  // 3. Track Order Page
  await page.goto('http://localhost:3000/track', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_03_track_order.png') });
  console.log('Captured ramu_03_track_order.png');

  // 4. Admin Radar Harga
  await page.setCookie({ name: 'user_role', value: 'ADMIN', domain: 'localhost', path: '/' });
  await page.goto('http://localhost:3000/admin/radar-harga', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_05_admin_radar.png') });
  console.log('Captured ramu_05_admin_radar.png');

  // 5. CRM Account Page
  await page.setCookie({ name: 'user_role', value: 'CUSTOMER', domain: 'localhost', path: '/' });
  await page.goto('http://localhost:3000/akun', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_06_crm_account.png') });
  console.log('Captured ramu_06_crm_account.png');

  // 6. Vendor Input Portal
  await page.setCookie({ name: 'user_role', value: 'VENDOR_PETANI', domain: 'localhost', path: '/' });
  await page.goto('http://localhost:3000/vendor/input-harian', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_07_vendor_portal.png') });
  console.log('Captured ramu_07_vendor_portal.png');

  // 7. Vendor Surat Jalan Agregat
  await page.goto('http://localhost:3000/vendor/surat-jalan', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_08_surat_jalan.png') });
  console.log('Captured ramu_08_surat_jalan.png');

  // 8. Mobile Viewport Storefront
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'ramu_09_mobile_storefront.png') });
  console.log('Captured ramu_09_mobile_storefront.png');

  await browser.close();
  console.log('Done!');
}

capture().catch(console.error);
