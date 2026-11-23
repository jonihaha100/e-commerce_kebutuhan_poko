const puppeteer = require('puppeteer-core');
const path = require('path');
const { spawn } = require('child_process');

const ARTIFACT_DIR = '/Users/syamhariabidin/.gemini/antigravity/brain/e1e2118a-0d80-4b27-881c-b3c433b77478';
const CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

async function waitForServer(url, timeout = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 200 || res.status === 304) return true;
    } catch (e) {
      // wait
    }
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond at ${url} within ${timeout}ms`);
}

async function run() {
  console.log('Starting Next.js production server on port 3000...');
  const server = spawn('npm', ['start', '--', '-p', '3000'], {
    cwd: '/Users/syamhariabidin/e-commerce_kebutuhan_poko',
    stdio: 'ignore',
  });

  try {
    await waitForServer('http://localhost:3000/admin/laporan');
    console.log('Server is ready! Launching Chrome Puppeteer...');

    const browser = await puppeteer.launch({
      executablePath: CHROME_PATH,
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 1000 });

    // Set admin cookie
    await page.setCookie({
      name: 'user_role',
      value: 'ADMIN',
      domain: 'localhost',
      path: '/',
    });

    console.log('Navigating to /admin/laporan...');
    await page.goto('http://localhost:3000/admin/laporan', { waitUntil: 'networkidle0' });
    await new Promise(r => setTimeout(r, 1500));

    // Scroll to the 3-Option Simulator Section
    await page.evaluate(() => {
      const el = document.evaluate("//h3[contains(., 'Pusat Uji Keputusan & Simulasi')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (el) {
        el.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy({ top: -80, behavior: 'instant' });
      } else {
        window.scrollBy({ top: 900, behavior: 'instant' });
      }
    });
    await new Promise(r => setTimeout(r, 800));

    // 1. CAPTURE OPSI 1 (Scenario Cards & Prescriptive Verdict)
    console.log('Capturing Opsi 1: Skenario Strategis...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'simulator_opsi_1_skenario_strategis.png') });
    console.log('✓ Captured: simulator_opsi_1_skenario_strategis.png');

    // 2. SWITCH TO OPSI 2 (BEP Calculator)
    console.log('Switching to Opsi 2...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btnOpsi2 = btns.find(b => b.textContent && b.textContent.includes('Opsi 2: Kalkulator BEP'));
      if (btnOpsi2) btnOpsi2.click();
    });
    await new Promise(r => setTimeout(r, 800));

    console.log('Capturing Opsi 2: Kalkulator BEP Dinamis & Deteksi Boncos...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'simulator_opsi_2_kalkulator_bep.png') });
    console.log('✓ Captured: simulator_opsi_2_kalkulator_bep.png');

    // 3. SWITCH TO OPSI 3 (Side-by-Side Matrix)
    console.log('Switching to Opsi 3...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btnOpsi3 = btns.find(b => b.textContent && b.textContent.includes('Opsi 3: Matriks Berdampingan'));
      if (btnOpsi3) btnOpsi3.click();
    });
    await new Promise(r => setTimeout(r, 800));

    console.log('Capturing Opsi 3: Matriks Analisis Sensitivitas Berdampingan...');
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'simulator_opsi_3_matriks_berdampingan.png') });
    console.log('✓ Captured: simulator_opsi_3_matriks_berdampingan.png');

    await browser.close();
    console.log('All 3 options successfully captured!');
  } finally {
    console.log('Shutting down Next.js server...');
    server.kill();
  }
}

run().catch(err => {
  console.error('Script error:', err);
  process.exit(1);
});
