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
          
          // Background sample from border (grey ~88, 93, 93)
          const bgR = 88, bgG = 93, bgB = 93;
          
          let minX = 125, maxX = 236, minY = 140, maxY = 250;
          
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
                
                // Color distance to background
                const distToBg = Math.hypot(r - bgR, g - bgG, b - bgB);
                const greenEx = g - Math.max(r, b);
                
                if (greenEx > 15 && distToBg > 20) {
                  outData.data[outIdx] = r;
                  outData.data[outIdx+1] = g;
                  outData.data[outIdx+2] = b;
                  outData.data[outIdx+3] = 255;
                } else if (greenEx > 5 && distToBg > 10) {
                  outData.data[outIdx] = r;
                  outData.data[outIdx+1] = g;
                  outData.data[outIdx+2] = b;
                  outData.data[outIdx+3] = Math.min(255, Math.floor((distToBg / 20) * 255));
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
  fs.writeFileSync('brand/logo_bird.png', buffer);
  console.log('Saved brand/logo_bird.png cleanly!');
  await browser.close();
})();
