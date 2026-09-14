import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const baseUrl = process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001";
const outputDir = "screenshots/after-audit";
mkdirSync(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

async function capturePage(name, path, viewport, fullPage = false) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.route(/mc\.yandex|yandex\.ru\/ads/, (route) => route.abort());
  await page.goto(`${baseUrl}${path}`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outputDir}/${name}.png`, fullPage });
  await context.close();
}

await capturePage("home-390", "/", { width: 390, height: 844 });
await capturePage("home-1440", "/", { width: 1440, height: 900 });
await capturePage("production-sticky-cta-390", "/production/", { width: 390, height: 844 });
await capturePage("calculator-390", "/calculator/", { width: 390, height: 844 });
await capturePage("calculator-1440", "/calculator/", { width: 1440, height: 900 });
await capturePage("kitchens-390-full", "/kitchens/", { width: 390, height: 844 }, true);
await capturePage("article-390-full", "/knowledge/rozetki-na-kuhne-shema-vysoty/", { width: 390, height: 844 }, true);
await capturePage("article-1440-full", "/knowledge/rozetki-na-kuhne-shema-vysoty/", { width: 1440, height: 900 }, true);

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.route(/mc\.yandex|yandex\.ru\/ads/, (route) => route.abort());
  await page.goto(`${baseUrl}/knowledge/rozetki-na-kuhne-shema-vysoty/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: `${outputDir}/article-header-390.png` });
  await page.locator(".article-mobile-toc").scrollIntoViewIfNeeded();
  await page.locator(".article-mobile-toc summary").click();
  await page.screenshot({ path: `${outputDir}/article-toc-390.png` });
  await page.locator("#faq").scrollIntoViewIfNeeded();
  await page.screenshot({ path: `${outputDir}/article-faq-390.png` });
  await context.close();
}

for (const width of [320, 360, 390, 430]) {
  const context = await browser.newContext({ viewport: { width, height: 844 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/kitchens/`, { waitUntil: "networkidle" });
  const tablist = page.getByRole("tablist");
  await tablist.scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${outputDir}/kitchens-filter-${width}.png` });
  await context.close();
}

await browser.close();
console.log(`Screenshots written to ${outputDir}`);
