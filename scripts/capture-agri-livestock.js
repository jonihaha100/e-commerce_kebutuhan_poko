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
  await page.setViewport({ width: 1280, height: 880 });

  // 1. Step 1: Panen Subuh 03:00 WIB (Sayur & Ayam Potong)
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agri_step_01_panen_subuh.png') });
  console.log('1. Captured Step 1: Panen Subuh');

  // Helper to click chapter
  const clickChapter = async (targetText) => {
    const btns = await page.$$('button');
    for (const b of btns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes(targetText)) {
        await b.click();
        await new Promise(r => setTimeout(r, 800));
        return true;
      }
    }
    return false;
  };

  // 2. Step 2: Sortir Ozon & Cold Chain 04:30 WIB
  await clickChapter('02 Sortir Ozon');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agri_step_02_sortir_ozon.png') });
  console.log('2. Captured Step 2: Sortir Ozon');

  // 3. Step 3: Kemas Porsi Dapur 05:30 WIB
  await clickChapter('03 Kemas Porsi');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agri_step_03_kemas_porsi.png') });
  console.log('3. Captured Step 3: Kemas Porsi');

  // 4. Step 4: Tiba di Gerbang 06:30 - 09:00 WIB
  await clickChapter('04 Tiba Gerbang');
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agri_step_04_tiba_gerbang.png') });
  console.log('4. Captured Step 4: Tiba Gerbang');

  await browser.close();
  console.log('All 4 steps captured successfully!');
}

capture().catch(console.error);
