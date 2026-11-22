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
  await page.setViewport({ width: 1280, height: 860 });

  // 1. PINTU 1: USER / WARGA (Swalayan Segar)
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dual_door_01_user_swalayan.png') });
  console.log('1. Captured Door 1: User Swalayan');

  // 2. Klik Switcher: PINTU 2: ADMIN & OPERASIONAL
  const adminSwitchBtn = await page.$$('button');
  for (const b of adminSwitchBtn) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('2. Tim Operasional (Admin)')) {
      await b.click();
      console.log('Clicked Admin switch button');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dual_door_02_admin_command.png') });
  console.log('2. Captured Door 2: Admin Command Center');

  // 3. Admin: Klik Chapter 2 Radar Fiksasi 15.00
  const chBtns = await page.$$('button');
  for (const b of chBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('02 Fiksasi 15.00')) {
      await b.click();
      console.log('Clicked Fiksasi 15.00 chapter');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dual_door_03_admin_fiksasi_chapter.png') });
  console.log('3. Captured Admin Fiksasi Chapter');

  // 4. Mobile View: User vs Admin
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'dual_door_04_mobile_doors.png') });
  console.log('4. Captured Mobile Dual Door');

  await browser.close();
  console.log('All dual door captures done!');
}

capture().catch(console.error);
