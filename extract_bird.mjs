import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const imgPath = path.resolve('brand/logo_avatar.jpg');
  const imgData = fs.readFileSync(imgPath).toString('base64');
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="margin:0; background: transparent;">
      <canvas id="c"></canvas>
      <script>
        const img = new Image();
        img.onload = () => {
          const srcCanvas = document.createElement('canvas');
          srcCanvas.width = img.width;
          srcCanvas.height = img.height;
          const sctx = srcCanvas.getContext('2d');
          sctx.drawImage(img, 0, 0);
          const idata = sctx.getImageData(0, 0, img.width, img.height);
          const d = idata.data;
          
          let minX = img.width, maxX = 0, minY = img.height, maxY = 0;
          // Find precise bounding box of the green bird
          for (let y = 0; y < img.height; y++) {
            for (let x = 0; x < img.width; x++) {
              const idx = (y * img.width + x) * 4;
              const r = d[idx], g = d[idx+1], b = d[idx+2];
              // Bird pixels have strong green dominance:
              if (g > 100 && (g - r > 18) && (g - b > 18)) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
              }
            }
          }
          
          console.log('Bird bounds:', minX, minY, maxX, maxY);
          
          const pad = 2;
          const w = (maxX - minX + 1) + pad * 2;
          const h = (maxY - minY + 1) + pad * 2;
          
          const c = document.getElementById('c');
          c.width = w;
          c.height = h;
          const ctx = c.getContext('2d');
          
          const outData = ctx.createImageData(w, h);
          for (let y = 0; y < h; y++) {
            for (let x = 0; x < w; x++) {
              const srcX = minX - pad + x;
              const srcY = minY - pad + y;
              const outIdx = (y * w + x) * 4;
              if (srcX >= 0 && srcX < img.width && srcY >= 0 && srcY < img.height) {
                const sIdx = (srcY * img.width + srcX) * 4;
                const r = d[sIdx], g = d[sIdx+1], b = d[sIdx+2];
                // Smooth alpha blending for edges:
                const greenDelta = g - Math.max(r, b);
                if (greenDelta > 15 && g > 90) {
                  outData.data[outIdx] = r;
                  outData.data[outIdx+1] = g;
                  outData.data[outIdx+2] = b;
                  outData.data[outIdx+3] = 255;
                } else if (greenDelta > 5 && g > 75) {
                  outData.data[outIdx] = r;
                  outData.data[outIdx+1] = g;
                  outData.data[outIdx+2] = b;
                  outData.data[outIdx+3] = Math.min(255, Math.floor((greenDelta / 15) * 255));
                } else {
                  outData.data[outIdx+3] = 0;
                }
              }
            }
          }
          ctx.putImageData(outData, 0, 0);
          window.__ready = true;
        };
        img.src = 'data:image/jpeg;base64,${imgData}';
      </script>
    </body>
    </html>
  `;
  
  await page.setContent(html);
  await page.waitForFunction(() => window.__ready === true);
  const canvas = await page.$('#c');
  const buffer = await canvas.screenshot({ omitBackground: true });
  fs.writeFileSync('brand/logo_bird_transparent.png', buffer);
  console.log('Saved brand/logo_bird_transparent.png successfully!');
  await browser.close();
})();
