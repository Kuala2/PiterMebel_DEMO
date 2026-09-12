import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001";
const outputDir = "tests/.artifacts";
await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator(".final-section").screenshot({ path: `${outputDir}/consultation-desktop.png` });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.locator(".final-section").screenshot({ path: `${outputDir}/consultation-mobile.png` });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/calculator/`, { waitUntil: "networkidle" });
  await page.locator(".calculator-section").screenshot({ path: `${outputDir}/calculator-desktop.png` });
  await page.locator(".final-section").screenshot({ path: `${outputDir}/calculator-consultation-desktop.png` });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/calculator/`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /4\s*Оснащение/ }).click();
  await page.locator(".calculator-section").screenshot({ path: `${outputDir}/calculator-mobile.png` });
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/production/`, { waitUntil: "networkidle" });
  await page.locator("main").screenshot({ path: `${outputDir}/production-desktop.png` });
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const counter = page.locator('[data-count-final="1500"]');
  await counter.scrollIntoViewIfNeeded();
  const value = (await counter.innerText()).replace(/\s/g, "");
  if (value !== "1500") throw new Error(`Reduced motion: ожидалось 1500, получено ${value}`);
  await page.locator(".hero-stats-strip").screenshot({ path: `${outputDir}/stats-reduced-motion.png` });
  await context.close();
}

await browser.close();
console.log(`Visual QA: снимки сохранены в ${outputDir}`);
