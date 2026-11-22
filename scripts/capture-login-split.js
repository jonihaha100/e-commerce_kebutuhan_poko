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

  // 1. Desktop View - Chapter 1
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'swalayan_login_01_chapter1.png') });
  console.log('1. Captured Chapter 1');

  // 2. Click Chapter 2 indicator
  const chapterBtns = await page.$$('button');
  for (const b of chapterBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('02 Sortir Bersih')) {
      await b.click();
      console.log('Clicked Chapter 2');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'swalayan_login_02_chapter2.png') });
  console.log('2. Captured Chapter 2');

  // 3. Click Tab "Simulasi 1-Klik ✨"
  const tabBtns = await page.$$('button');
  for (const b of tabBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('Simulasi 1-Klik')) {
      await b.click();
      console.log('Clicked Simulasi 1-Klik tab');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'swalayan_login_03_tab_simulasi.png') });
  console.log('3. Captured Simulasi Tab');

  // 4. Mobile View
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'swalayan_login_04_mobile.png') });
  console.log('4. Captured Mobile Login');

  await browser.close();
  console.log('All login captures finished!');
}

capture().catch(console.error);
