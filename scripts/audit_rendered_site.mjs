import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";

const baseUrl = process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001";
const reportDir = "seo-reports";
await mkdir(reportDir, { recursive: true });

const sitemap = await fetch(`${baseUrl}/sitemap.xml`).then((response) => response.text());
const paths = [...sitemap.matchAll(/<loc>https:\/\/pitermebel\.com([^<]*)<\/loc>/g)]
  .map((match) => match[1]);

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const browser = await chromium.launch({ headless: true });
const pages = [];

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  await page.route(/mc\.yandex|yandex\.ru\/ads/, (route) => route.abort());

  for (const path of paths) {
    await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
    await page.evaluate(() => document.fonts.ready);

    const result = await page.evaluate(({ path, viewportName }) => {
      const visible = (element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none"
          && style.visibility !== "hidden"
          && Number(style.opacity) > 0
          && rect.width > 0
          && rect.height > 0;
      };

      const ownText = (element) => [...element.childNodes]
        .filter((node) => node.nodeType === Node.TEXT_NODE)
        .map((node) => node.textContent || "")
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      const selector = (element) => {
        const id = element.id ? `#${element.id}` : "";
        const classes = [...element.classList].slice(0, 3).map((name) => `.${name}`).join("");
        return `${element.tagName.toLowerCase()}${id}${classes}`;
      };

      const textElements = [...document.querySelectorAll("body *")]
        .filter((element) => !element.closest("svg, script, style, noscript") && visible(element))
        .map((element) => ({ element, text: ownText(element) }))
        .filter(({ text }) => text.length > 0)
        .map(({ element, text }) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return {
            selector: selector(element),
            tag: element.tagName.toLowerCase(),
            text: text.slice(0, 140),
            fontSize: Number.parseFloat(style.fontSize),
            lineHeight: style.lineHeight,
            fontFamily: style.fontFamily,
            fontWeight: style.fontWeight,
            color: style.color,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        });

      const fontSizeCounts = {};
      for (const item of textElements) {
        const key = String(item.fontSize);
        fontSizeCounts[key] = (fontSizeCounts[key] || 0) + 1;
      }

      const interactive = [...document.querySelectorAll("a[href], button, input, select, textarea, summary")]
        .filter(visible)
        .map((element) => {
          const rect = element.getBoundingClientRect();
          return {
            selector: selector(element),
            label: (element.getAttribute("aria-label") || element.textContent || element.getAttribute("placeholder") || "")
              .replace(/\s+/g, " ").trim().slice(0, 120),
            width: Math.round(rect.width * 10) / 10,
            height: Math.round(rect.height * 10) / 10,
          };
        });

      const bodyStyle = getComputedStyle(document.body);
      const main = document.querySelector("main");
      const mainText = main?.innerText.replace(/\s+/g, " ").trim() || "";
      const mainWords = mainText.match(/[\p{L}\p{N}][\p{L}\p{N}–—-]*/gu) || [];
      const articleParagraphs = [...document.querySelectorAll(".article-paragraph")]
        .filter(visible)
        .map((element) => ({
          fontSize: getComputedStyle(element).fontSize,
          lineHeight: getComputedStyle(element).lineHeight,
          width: Math.round(element.getBoundingClientRect().width),
        }));

      return {
        path,
        viewport: viewportName,
        title: document.title,
        description: document.querySelector('meta[name="description"]')?.getAttribute("content") || null,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href") || null,
        robots: document.querySelector('meta[name="robots"]')?.getAttribute("content") || null,
        h1: [...document.querySelectorAll("h1")].map((element) => element.textContent?.replace(/\s+/g, " ").trim()),
        headings: [...document.querySelectorAll("main h1, main h2, main h3")].map((element) => ({
          level: element.tagName.toLowerCase(),
          text: element.textContent?.replace(/\s+/g, " ").trim(),
        })),
        mainWordCount: mainWords.length,
        internalLinkCount: [...document.querySelectorAll('main a[href^="/"], main a[href^="#"]')].length,
        imageCount: document.querySelectorAll("main img").length,
        missingAltCount: [...document.querySelectorAll("main img")].filter((image) => !image.hasAttribute("alt")).length,
        body: { fontSize: bodyStyle.fontSize, lineHeight: bodyStyle.lineHeight, fontFamily: bodyStyle.fontFamily },
        fontSizeCounts,
        smallText: textElements.filter((item) => item.fontSize < 16),
        verySmallText: textElements.filter((item) => item.fontSize < 12),
        tinyTargets: interactive.filter((item) => item.width < 24 || item.height < 24),
        targetsUnder44: interactive.filter((item) => item.width < 44 || item.height < 44),
        articleParagraphs,
      };
    }, { path, viewportName: viewport.name });

    pages.push(result);
  }
  await context.close();
}

await browser.close();

const summary = {
  generatedAt: new Date().toISOString(),
  baseUrl,
  routes: paths.length,
  snapshots: pages.length,
  pages,
};

await writeFile(`${reportDir}/rendered-site-audit.json`, JSON.stringify(summary, null, 2));
console.log(`Rendered audit: ${paths.length} routes × ${viewports.length} viewports; saved ${reportDir}/rendered-site-audit.json`);
