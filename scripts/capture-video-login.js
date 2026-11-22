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

  // 1. User Door - Chapter 1 with Video playing
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'video_login_01_user_step1.png') });
  console.log('1. Captured Chapter 1 with Video');

  // 2. Click Chapter 3: "03 Antar Serentak" (matching the user uploaded image!)
  const chBtns = await page.$$('button');
  for (const b of chBtns) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('03 Antar Serentak')) {
      await b.click();
      console.log('Clicked Chapter 3 Antar Serentak');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'video_login_02_user_step3_matching.png') });
  console.log('2. Captured Chapter 3 matching user screenshot');

  // 3. Switch to Admin Door with Video
  const adminSwitchBtn = await page.$$('button');
  for (const b of adminSwitchBtn) {
    const text = await page.evaluate(el => el.textContent, b);
    if (text && text.includes('2. Tim Operasional (Admin)')) {
      await b.click();
      console.log('Clicked Admin switch');
      break;
    }
  }
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'video_login_03_admin_video.png') });
  console.log('3. Captured Admin Door with Video');

  await browser.close();
  console.log('All video login captures completed!');
}

capture().catch(console.error);
