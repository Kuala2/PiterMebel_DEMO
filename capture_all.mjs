import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const routes = [
  { name: 'home', path: '/' },
  { name: 'kitchens', path: '/kitchens' },
  { name: 'kitchen-aleksandra', path: '/kitchens/aleksandra' },
  { name: 'projects', path: '/projects' },
  { name: 'project-island-parquet', path: '/projects/island-parquet' },
  { name: 'production', path: '/production' },
  { name: 'calculator', path: '/calculator' },
  { name: 'contacts', path: '/contacts' }
];

const viewports = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile', width: 390, height: 844 }
];

async function main() {
  const browser = await chromium.launch();
  const baseUrl = 'http://localhost:3000';

  for (const vp of viewports) {
    const page = await browser.newPage({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2
    });

    for (const r of routes) {
      const url = `${baseUrl}${r.path}`;
      console.log(`Capturing ${r.name} at ${vp.label} (${vp.width}x${vp.height})...`);
      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      // Screenshot above the fold
      const firstShot = path.join(outDir, `${r.name}-${vp.label}-first.png`);
      await page.screenshot({ path: firstShot, fullPage: false });

      // Screenshot full page
      const fullShot = path.join(outDir, `${r.name}-${vp.label}-full.png`);
      await page.screenshot({ path: fullShot, fullPage: true });

      console.log(`Saved: ${firstShot} and ${fullShot}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch(console.error);
