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
  await page.setViewport({ width: 1280, height: 950 });

  // 1. Capture Login & Persona Onboarding (/login)
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'antislop_01_login_personas.png') });
  console.log('1. Captured login');

  // 2. Capture Storefront Dual-Grid Hero (no void)
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'antislop_02_storefront_dualgrid.png') });
  console.log('2. Captured dual-grid hero');

  // 3. Trigger Onboarding Tour Modal
  const tourButtons = await page.$$('button');
  for (const b of tourButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Mulai Tur Panduan Website')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'antislop_03_tour_modal_step1.png') });
  console.log('3. Captured modal step 1');

  // Next step
  const nextBtns = await page.$$('button');
  for (const b of nextBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Lanjut')) {
      await b.click();
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'antislop_04_tour_modal_step2.png') });
  console.log('4. Captured modal step 2');

  // 4. Reload page fresh to dismiss modal completely
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));

  // Scroll down to products grid
  await page.evaluate(() => window.scrollBy(0, 360));
  await new Promise(r => setTimeout(r, 400));

  // Click 250 gr portion on the first product card
  const portionBtns = await page.$$('button');
  for (const b of portionBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.trim() === '250 gr') {
      await b.click();
      console.log('Clicked 250 gr button');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 400));

  // Click "+ Tambah" button on first 2 cards to activate Stepper and Floating Cart
  const addButtons = await page.$$('button');
  let added = 0;
  for (const b of addButtons) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Tambah')) {
      await b.click();
      added++;
      await new Promise(r => setTimeout(r, 400));
      if (added >= 2) break;
    }
  }

  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'antislop_05_portion_cart_stepper.png') });
  console.log('5. Captured portion cart stepper');

  // 5. Mobile view
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'antislop_06_mobile_dualgrid.png') });
  console.log('6. Captured mobile view');

  await browser.close();
  console.log('Done captures!');
}

capture().catch(console.error);
