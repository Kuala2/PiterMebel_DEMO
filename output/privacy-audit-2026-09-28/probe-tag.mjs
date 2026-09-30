import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const tag = readFileSync(path.join(tmpdir(), 'pm-metrika-tag.js'), 'utf8');
const browser = await chromium.launch({ headless: true });
try {
  for (const replace of [true, false]) {
    const context = await browser.newContext();
    const page = await context.newPage();
    const requests = [];
    await context.route('**/*', route => {
      const url = route.request().url();
      if (url === 'https://pitermebel.com/') return route.fulfill({ contentType: 'text/html', body: '<html><head><title>Local test</title></head><body>test</body></html>' });
      requests.push(url);
      return route.fulfill({ contentType: 'application/json', body: JSON.stringify({ settings: {} }) });
    });
    await page.goto('https://pitermebel.com/');
    await page.evaluate(() => {
      window.ym = function (...args) { (window.ym.a ||= []).push(args); };
      window.ym.l = Date.now();
      window.ym(112318484, 'init', { defer: true, webvisor: false, clickmap: false, trackLinks: true });
      window.ym(112318484, 'hit', location.href);
    });
    await page.addScriptTag({ content: tag });
    await page.waitForTimeout(1200);
    console.log('before', replace, await page.evaluate(() => ({ push: String(window.ym.a?.push).slice(0,180), counters: window.Ya?._metrika?.getCounters?.() })));
    await page.evaluate(replace => {
      window.ym(112318484, 'destruct');
      if (replace) window.ym.a = []; else window.ym.a?.splice(0);
    }, replace);
    await page.waitForTimeout(300);
    const count = requests.filter(x => x.includes('/watch/')).length;
    await page.evaluate(() => {
      window.ym(112318484, 'init', { defer: true, webvisor: false, clickmap: false, trackLinks: true });
      window.ym(112318484, 'hit', location.href);
    });
    await page.waitForTimeout(1200);
    console.log('after', replace, { before: count, after: requests.filter(x => x.includes('/watch/')).length });
    await context.close();
  }
} finally { await browser.close(); }
