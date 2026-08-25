import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots/review');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

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

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1.5 });

  for (const r of routes) {
    await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    const height = await page.evaluate(() => document.body.scrollHeight);
    const steps = Math.ceil(height / 900);
    console.log(`${r.name}: ${height}px -> ${steps} sections`);
    for (let i = 0; i < steps; i++) {
      await page.evaluate(y => window.scrollTo(0, y), i * 900);
      await page.waitForTimeout(350);
      await page.screenshot({ path: path.join(outDir, `${r.name}-s${String(i + 1).padStart(2, '0')}.png`), fullPage: false });
    }
  }
  await browser.close();
}
main().catch(console.error);
