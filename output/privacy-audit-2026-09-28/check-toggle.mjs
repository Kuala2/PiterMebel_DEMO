import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage();
let phase='initial';
const events=[];
page.on('request',r=>{if(/mc\.yandex\./.test(r.url())) events.push({phase,path:new URL(r.url()).pathname});});
try {
  await page.goto('https://pitermebel.com/privacy/',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(6000);
  await page.getByRole('button',{name:'Отключить аналитику',exact:true}).click();
  await page.waitForTimeout(1000);
  phase='re-enable-same-page';
  await page.getByRole('button',{name:'Включить аналитику',exact:true}).click();
  await page.waitForTimeout(17000);
  const status=await page.locator('.privacy-settings').innerText();
  phase='reload-enabled';
  await page.reload({waitUntil:'domcontentloaded'});
  await page.waitForTimeout(5000);
  const result={status,events};
  await writeFile('output/privacy-audit-2026-09-28/toggle-evidence.json',JSON.stringify(result,null,2));
  console.log(JSON.stringify(result));
} finally {await browser.close();}
