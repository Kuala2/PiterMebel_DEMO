import { chromium } from "playwright";
import assert from "node:assert/strict";
import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".mp4": "video/mp4",
  ".ico": "image/x-icon",
};

async function ensureServer(defaultBase) {
  try {
    const res = await fetch(defaultBase);
    if (res.status > 0) return { base: defaultBase, close: async () => {} };
  } catch { /* Start embedded static server for out/ */ }
  const root = path.resolve("out");
  const server = createServer((req, res) => {
    const u = new URL(req.url || "/", "http://localhost");
    let file = path.join(root, decodeURIComponent(u.pathname));
    if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!existsSync(file) || !statSync(file).isFile()) {
      const nf = path.join(root, "404.html");
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      res.end(existsSync(nf) ? readFileSync(nf) : "Not found");
      return;
    }
    const ext = path.extname(file);
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    createReadStream(file).pipe(res);
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const addr = server.address();
  return {
    base: `http://127.0.0.1:${addr.port}`,
    close: () => new Promise((resolve) => server.close(resolve)),
  };
}

const { base, close: closeServer } = await ensureServer(process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001");
const destination = "output/privacy-2026-09-29";
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  const external = [];
  await context.route("**/*", route => {
    if (new URL(route.request().url()).origin === base) return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.goto(base + "/?ysclid=test123", { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => typeof window.ym), "undefined", "window.ym must be undefined");
  assert.equal(external.some(url => url.includes("mc.yandex")), false, "No requests to mc.yandex.ru are permitted");
  await page.locator('footer a[href="/kitchens/"]').click();
  await page.waitForURL(base + "/kitchens/");
  const firstImage = page.locator(".kitchen-ladder-first .card-img-slide");
  assert.notEqual(await firstImage.getAttribute("loading"), "lazy");
  await page.locator('footer a[href="/contacts/"]').click();
  await page.waitForURL(base + "/contacts/");
  const mapButton = page.getByRole("button", { name: "Показать интерактивную карту" });
  await mapButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  assert.equal(external.some(url => url.includes("api-maps.yandex.ru")), false, "Scrolling to the map must not load Yandex Maps");

  const form = page.locator("#measure-form form");
  assert.equal(await form.locator('[name="consent"]').isChecked(), false);
  assert.equal(await form.locator('a[href="/consent/"]').count(), 1);
  assert.equal(await form.locator('a[href="/privacy/"]').count(), 1);
  await form.locator('[name="contact"]').fill("+7 000 000 00 00");
  await form.locator('button[type="submit"]').click();
  await page.getByText("Нужно согласие на обработку данных", { exact: true }).waitFor();
  await form.locator('[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await form.locator(".form-error-summary").filter({ hasText: "Онлайн-форма ещё не подключена" }).waitFor();
  assert.equal(external.some(url => url.includes("mc.yandex")), false);
  await mapButton.click();
  await page.waitForTimeout(250);
  assert.ok(external.some(url => url.includes("api-maps.yandex.ru")));

  for (const path of ["/privacy/", "/consent/"]) {
    const response = await page.goto(base + path, { waitUntil: "networkidle" });
    assert.equal(response.status(), 200);
    assert.equal(await page.locator("h1").count(), 1);
    assert.equal(await page.locator('link[rel="canonical"]').getAttribute("href"), "https://pitermebel.com" + path);
    for (const width of [320, 390, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1), path + " horizontal overflow at " + width);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.screenshot({ path: destination + "/" + path.replaceAll("/", "") + "-mobile.png", fullPage: true });
    assert.equal(await page.locator(".sticky-cta, .boost-popup").count(), 0, "Legal documents must remain unobstructed");
  }

  assert.equal(errors.length, 0, errors.join("\n"));
  assert.equal((await page.goto(base + "/seo-test-missing/")).status(), 404);
  await context.close();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  const trackers = [];
  noJsPage.on("request", request => { if (/mc\.yandex/.test(request.url())) trackers.push(request.url()); });
  await noJsPage.goto(base + "/privacy/");
  assert.equal(trackers.length, 0, "No noscript tracking pixel in static HTML");
  await noJs.close();
  console.log("Browser checks passed: Metrika completely absent; no mc.yandex requests; legal pages at 320/390/1440; no-JS; HTTP 404.");
} finally {
  await browser.close();
  await closeServer();
}
