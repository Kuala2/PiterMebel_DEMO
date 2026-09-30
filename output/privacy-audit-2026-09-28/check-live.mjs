import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const requests = [], responses = [], errors = [];
let phase = 'initial';
page.on('request', r => { if (/yandex|yadro|google-analytics|web3forms/.test(r.url())) { const u = new URL(r.url()); requests.push({ phase, host:u.host,path:u.pathname, page:u.searchParams.get('page-url'), webvisor:u.pathname.includes('webvisor') }); } });
page.on('response', r => { if (/mc\.yandex/.test(r.url())) responses.push({phase,path:new URL(r.url()).pathname,status:r.status()}); });
page.on('pageerror', e => errors.push(e.message));
await context.addInitScript(() => {
  window.auditCalls = [];
  let current;
  Object.defineProperty(window, 'ym', { configurable: true, get: () => current, set: fn => {
    if (typeof fn !== 'function') {current=fn;return;}
    current = new Proxy(fn, {apply(target,self,args) { window.auditCalls.push(args); return Reflect.apply(target,self,args); }});
  }});
});
const output = {};
try {
  const res = await page.goto('https://pitermebel.com/', {waitUntil:'networkidle', timeout:60000});
  await page.waitForTimeout(2000);
  output.initial = {status:res.status(),url:page.url(),calls:await page.evaluate(() => window.auditCalls),footer:await page.locator('footer').innerText(),cookieNames:(await context.cookies()).map(c=>c.name)};
  phase='privacy';
  await page.goto('https://pitermebel.com/privacy/',{waitUntil:'networkidle',timeout:60000});
  output.privacyText = await page.locator('main').count() ? await page.locator('main').innerText() : await page.locator('body').innerText();
  output.privacyCalls = await page.evaluate(()=>window.auditCalls);
  await page.getByRole('button',{name:'Отключить аналитику',exact:true}).click();
  await page.waitForTimeout(1000);
  phase='after-opt-out';
  output.optOut = {status:await page.locator('.privacy-settings').innerText(),choice:await page.evaluate(()=>localStorage.getItem('pm_privacy_v1')),cookieNames:(await context.cookies()).map(c=>c.name)};
  await page.goto('https://pitermebel.com/contacts/',{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(1500);
  output.afterReload = {calls:await page.evaluate(()=>window.auditCalls),scriptCount:await page.locator('script[src*="metrika"]').count()};
  await page.goto('https://pitermebel.com/privacy/',{waitUntil:'networkidle',timeout:60000});
  phase='re-enable';
  await page.getByRole('button',{name:'Включить аналитику',exact:true}).click();
  await page.waitForTimeout(2500);
  output.reEnabled = {status:await page.locator('.privacy-settings').innerText(),calls:await page.evaluate(()=>window.auditCalls)};
  phase='second-opt-out';
  await page.getByRole('button',{name:'Отключить аналитику',exact:true}).click();
  await page.waitForTimeout(750);
  phase='same-page-re-enable';
  await page.getByRole('button',{name:'Включить аналитику',exact:true}).click();
  await page.waitForTimeout(2000);
  output.samePageReEnabled = {calls:await page.evaluate(()=>window.auditCalls),status:await page.locator('.privacy-settings').innerText()};
} catch(e) { output.failure=String(e); }
finally {
  Object.assign(output,{requests,responses,errors});
  await writeFile('output/privacy-audit-2026-09-28/live-evidence.json',JSON.stringify(output,null,2));
  console.log(JSON.stringify({...output,privacyText:output.privacyText?.slice(0,220)},null,2));
  await browser.close();
}
