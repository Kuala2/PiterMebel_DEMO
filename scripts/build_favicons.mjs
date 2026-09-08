import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const scale = 0.82;
const cx = 211;
const cy = 216;
const targetCenter = 256;
const tx = (targetCenter - cx * scale).toFixed(2);
const ty = (targetCenter - cy * scale).toFixed(2);

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%" shape-rendering="geometricPrecision">
  <rect width="512" height="512" fill="#1C1F24" />
  <g transform="translate(${tx}, ${ty}) scale(${scale})">
    <!-- Facet 1: Tail & Body Right (shaded underbelly side) -->
    <polygon points="246,104 316,168 250,208 86,400" fill="#62A902" />

    <!-- Facet 2: Tail & Body Left (bright main spine facet) -->
    <polygon points="176,160 246,104 86,400" fill="#8CE015" />

    <!-- Facet 3: Head / Neck -->
    <polygon points="320,32 316,108 316,168 250,208 246,104" fill="#71BB05" />

    <!-- Facet 4: Beak -->
    <polygon points="320,32 376,104 316,108" fill="#AFEB3C" />

    <!-- Facet 5: Lower Wing Blade -->
    <polygon points="46,38 246,104 176,160" fill="#84D804" />

    <!-- Facet 6: Upper Wing Blade -->
    <polygon points="46,38 160,38 246,104" fill="#A8EB37" />
  </g>
</svg>`;

async function main() {
  fs.writeFileSync('public/favicon.svg', svgContent, 'utf8');
  console.log('Saved public/favicon.svg');

  const browser = await chromium.launch();
  const page = await browser.newPage();

  const dataUri = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString('base64')}`;

  const sizes = [
    { name: 'icon-16.png', size: 16 },
    { name: 'icon-32.png', size: 32 },
    { name: 'icon-48.png', size: 48 },
    { name: 'icon-96.png', size: 96 },
    { name: 'icon-120.png', size: 120 },
    { name: 'apple-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-256.png', size: 256 },
    { name: 'icon.png', size: 512 }
  ];

  for (const item of sizes) {
    await page.setViewportSize({ width: item.size, height: item.size });
    await page.setContent(`<!DOCTYPE html><html><head><style>
      * { margin: 0; padding: 0; }
      html, body { width: ${item.size}px; height: ${item.size}px; overflow: hidden; background: #1C1F24; }
      img { width: 100%; height: 100%; display: block; }
    </style></head><body><img src="${dataUri}" /></body></html>`);
    
    await page.waitForTimeout(50);
    const buf = await page.screenshot({ type: 'png' });
    fs.writeFileSync(`public/${item.name}`, buf);
    console.log(`Generated public/${item.name} (${item.size}x${item.size})`);
  }

  await browser.close();
  console.log('Done generating PNGs!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
