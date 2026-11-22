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

  // 1. Full Login Page with Tour Banner and Step 1
  await page.goto('http://localhost:3000/login', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'login_page_with_tour_banner.png') });
  console.log('1. Captured: Login Page with Tour Banner');

  // Helper to click button with text
  const clickButtonWithText = async (targetText) => {
    const btns = await page.$$('button');
    for (const b of btns) {
      const text = await page.evaluate(el => el.textContent, b);
      if (text && text.includes(targetText)) {
        await b.click();
        await new Promise(r => setTimeout(r, 600));
        return true;
      }
    }
    return false;
  };

  // 2. Open Tour Modal
  await clickButtonWithText('Mulai Tur Interaktif');
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'login_tour_modal_open.png') });
  console.log('2. Captured: Tour Modal Open');

  // Close Tour Modal by clicking close button or pressing Escape
  await page.keyboard.press('Escape');
  // or click button with X
  const closeBtns = await page.$$('button');
  for (const b of closeBtns) {
    const hasX = await page.evaluate(el => !!el.querySelector('svg.lucide-x'), b);
    if (hasX) {
      await b.click();
      await new Promise(r => setTimeout(r, 600));
      break;
    }
  }

  // 3. Step 1: Panen Subuh
  await clickButtonWithText('01 Panen Subuh');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agri_step_01_panen_subuh.png') });
  console.log('3. Captured Step 1: Panen Subuh');

  // 4. Step 2: Sortir Ozon
  await clickButtonWithText('02 Sortir Ozon');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agri_step_02_sortir_ozon.png') });
  console.log('4. Captured Step 2: Sortir Ozon');

  // 5. Step 3: Kemas Porsi
  await clickButtonWithText('03 Kemas Porsi');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agri_step_03_kemas_porsi.png') });
  console.log('5. Captured Step 3: Kemas Porsi');

  // 6. Step 4: Tiba Gerbang
  await clickButtonWithText('04 Tiba Gerbang');
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'agri_step_04_tiba_gerbang.png') });
  console.log('6. Captured Step 4: Tiba Gerbang');

  await browser.close();
  console.log('All captures done successfully!');
}

capture().catch(console.error);
