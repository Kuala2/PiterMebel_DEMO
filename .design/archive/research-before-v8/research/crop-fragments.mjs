import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';

const root = process.cwd();
const research = path.join(root, '.design', 'research');
const sourceDir = path.join(research, 'references');
const outputDir = path.join(research, 'fragments');
const hostUrl = pathToFileURL(path.join(research, 'crop-host.html')).href;
const manifest = JSON.parse(fs.readFileSync(path.join(research, 'fragment-crops.json'), 'utf8'));

fs.mkdirSync(outputDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 1200 } });
  for (const item of manifest) {
    const sourcePath = path.join(sourceDir, item.source);
    if (!fs.existsSync(sourcePath)) throw new Error(`Missing source: ${sourcePath}`);
    const sourceUrl = pathToFileURL(sourcePath).href;
    await page.goto(`${hostUrl}?src=${encodeURIComponent(sourceUrl)}`, { waitUntil: 'load' });
    const size = await page.locator('#source').evaluate((img) => new Promise((resolve, reject) => {
      const done = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
      if (img.complete && img.naturalWidth) done();
      else {
        img.addEventListener('load', done, { once: true });
        img.addEventListener('error', () => reject(new Error('Image load failed')), { once: true });
      }
    }));
    if (item.x < 0 || item.y < 0 || item.x + item.width > size.width || item.y + item.height > size.height) {
      throw new Error(`Crop outside ${item.source} (${size.width}x${size.height}): ${JSON.stringify(item)}`);
    }
    await page.setViewportSize({
      width: Math.max(390, Math.min(1600, item.x + item.width)),
      height: Math.max(844, Math.min(1200, item.y + item.height)),
    });
    await page.screenshot({
      path: path.join(outputDir, item.file),
      clip: { x: item.x, y: item.y, width: item.width, height: item.height },
    });
    console.log(`[OK] ${item.file} <- ${item.source}`);
  }
} finally {
  await browser.close();
}
