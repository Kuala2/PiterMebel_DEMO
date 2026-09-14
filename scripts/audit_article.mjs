import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001";
const path = "/knowledge/rozetki-na-kuhne-shema-vysoty/";
await mkdir("seo-reports/article-screenshots", { recursive: true });

const browser = await chromium.launch({ headless: true });
const results = [];

for (const viewport of [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
]) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.route(/mc\.yandex|yandex\.ru\/ads/, (route) => route.abort());
  await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);

  const data = await page.locator("article").evaluate((article) => {
    const text = article.innerText.replace(/\s+/g, " ").trim();
    const words = text.match(/[\p{L}\p{N}][\p{L}\p{N}–—-]*/gu) || [];
    return {
      wordCount: words.length,
      characterCount: text.length,
      headings: [...article.querySelectorAll("h1, h2, h3")].map((heading) => ({
        level: heading.tagName.toLowerCase(),
        text: heading.textContent?.replace(/\s+/g, " ").trim(),
      })),
      links: [...article.querySelectorAll("a[href]")].map((link) => ({
        href: link.href,
        text: link.textContent?.replace(/\s+/g, " ").trim(),
      })),
      images: [...article.querySelectorAll("img")].map((image) => ({
        src: image.getAttribute("src"),
        alt: image.getAttribute("alt"),
      })),
      tables: article.querySelectorAll("table").length,
      lists: article.querySelectorAll("ul, ol").length,
    };
  });

  await page.screenshot({
    path: `seo-reports/article-screenshots/article-${viewport.name}-full.png`,
    fullPage: true,
  });
  await page.locator("article").screenshot({
    path: `seo-reports/article-screenshots/article-${viewport.name}.png`,
  });
  results.push({ viewport: viewport.name, ...data });
  await context.close();
}

await browser.close();
await writeFile("seo-reports/article-audit.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
