import { chromium } from "playwright";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Run against a production export. Only the public SDK is downloaded; ALL SDK
// requests from the browser are answered locally so test visits never reach Yandex.
const tag = process.env.PM_METRIKA_TAG_PATH
  ? await readFile(process.env.PM_METRIKA_TAG_PATH, "utf8")
  : await fetch("https://mc.yandex.ru/metrika/tag.js?id=112318484").then(r => {
    assert.equal(r.ok, true, "Public Metrika SDK must be available for this integration test");
    return r.text();
  });
const root = path.resolve("out");
const types = { ".html": "text/html", ".js": "application/javascript", ".css": "text/css", ".txt": "text/plain", ".svg": "image/svg+xml", ".json": "application/json", ".woff2": "font/woff2", ".png": "image/png", ".webp": "image/webp", ".jpg": "image/jpeg" };
const server = createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const file = path.resolve(root, "." + pathname + (pathname.endsWith("/") ? "index.html" : ""));
    if (!file.startsWith(root + path.sep)) throw new Error("Outside export");
    const body = await readFile(file);
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch { res.writeHead(404); res.end("Not found"); }
});
await new Promise(resolve => server.listen(0, "127.0.0.1", resolve));
const localBase = `http://127.0.0.1:${server.address().port}`;
// SDK ignores some loopback environments. Give the browser the real origin,
// but serve every site request exclusively from the local export.
const base = "https://pitermebel.com";
const output = "output/privacy-2026-09-29";
await mkdir(output, { recursive: true });
const browser = await chromium.launch({ headless: true });
const off = "Отключить Яндекс.Метрику для меня";
const on = "Включить Яндекс.Метрику для меня";
const errors = [];
const checks = [];
async function createContext(init, delayTag = 0) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  if (init) await context.addInitScript(init);
  const requests = [];
  await context.route("**/*", async route => {
    const url = route.request().url();
    if (new URL(url).origin === base) {
      const response = await context.request.get(url.replace(base, localBase));
      return route.fulfill({ response });
    }
    requests.push(url);
    if (url.includes("/metrika/tag.js")) {
      if (delayTag) await new Promise(resolve => setTimeout(resolve, delayTag));
      return route.fulfill({ contentType: "application/javascript", body: tag });
    }
    return route.fulfill({ contentType: "application/json", body: '{"settings":{}}' });
  });
  context.on("page", page => page.on("pageerror", error => errors.push(error.stack || error.message)));
  const page = await context.newPage();
  return { context, page, requests, watches: () => requests.filter(url => url.includes("/watch/")) };
}
try {
  const session = await createContext();
  const { page, context, watches } = session;
  await page.goto(base + "/?ysclid=privacy-test", { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  if (!watches().length) console.log({ requests: session.requests, errors, state: await page.evaluate(() => ({ ym: typeof window.ym, initialized: window.piterMetrikaInitialized, queue: window.ym?.a, counters: window.Ya?._metrika?.getCounters?.() })) });
  assert.ok(watches().length > 0, "Default visit must reach real SDK's request path");
  const options = await page.evaluate(() => window.Ya._metrika.getCounters()[0]);
  assert.equal(options.webvisor, false);
  assert.equal(options.clickmap, false);
  assert.equal(options.trackLinks, true);
  checks.push("Fresh visit starts automatically; Webvisor and clickmap remain disabled");
  await page.setViewportSize({ width: 390, height: 1000 });
  await page.locator(".footer-bottom-bar").scrollIntoViewIfNeeded();
  await page.locator("footer").getByRole("button", { name: off }).click({ trial: true });
  await page.locator(".footer-bottom-bar").screenshot({ path: `${output}/footer-enabled-390.png` });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.locator("footer").getByRole("button", { name: off, exact: true }).click();
  await page.waitForTimeout(300);
  const stoppedCount = watches().length;
  await page.locator('footer a[href="/kitchens/"]').click();
  await page.waitForURL(base + "/kitchens/");
  await page.waitForTimeout(600);
  assert.equal(watches().length, stoppedCount, "SPA navigation after opt-out must not send views or goals");
  await page.reload({ waitUntil: "networkidle" });
  assert.equal(watches().length, stoppedCount);
  assert.equal(await page.evaluate(() => typeof window.ym), "undefined");
  checks.push("Footer opt-out persists through SPA navigation and reload");

  await page.locator("footer").getByRole("button", { name: on, exact: true }).click();
  await page.waitForFunction(() => window.Ya?._metrika?.getCounters?.().length === 1);
  await page.waitForTimeout(500);
  assert.ok(watches().length > stoppedCount);
  for (let cycle = 0; cycle < 3; cycle++) {
    await page.locator("footer").getByRole("button", { name: off, exact: true }).click();
    await page.waitForTimeout(100);
    const before = watches().length;
    await page.locator("footer").getByRole("button", { name: on, exact: true }).click();
    await page.waitForTimeout(500);
    assert.ok(watches().length > before, `SDK resumes after destruct, cycle ${cycle}`);
  }
  checks.push("Real SDK restarts after destruct three times without reloading");

  await page.goto(base + "/privacy/", { waitUntil: "networkidle" });
  const other = await context.newPage();
  await other.goto(base + "/privacy/", { waitUntil: "networkidle" });
  await page.locator('[data-analytics-settings="page"]').getByRole("button", { name: off }).click();
  await other.locator('[data-analytics-settings="page"]').getByRole("button", { name: on }).waitFor();
  assert.equal(await other.evaluate(() => window.piterMetrikaInitialized), false);
  assert.equal(await page.locator('footer').getByRole("button", { name: on }).count(), 1);
  await other.close();
  const beforeBounce = watches().length;
  await page.waitForTimeout(16000);
  assert.equal(watches().length, beforeBounce, "Bounce timers must not send after opt-out");
  checks.push("Policy and footer controls sync with another tab; no bounce event after opt-out");

  await page.goto(base + "/", { waitUntil: "networkidle" });
  for (const width of [1440, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await page.locator(".footer-bottom-bar").scrollIntoViewIfNeeded();
    await page.locator("footer").getByRole("button", { name: on }).click({ trial: true });
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
    await page.locator(".footer-bottom-bar").screenshot({ path: `${output}/footer-${width}.png` });
  }
  checks.push("Footer fits desktop and 390/320px mobile widths");
  await context.close();

  const legacy = await createContext(() => {
    if (location.origin !== "https://pitermebel.com") return;
    localStorage.setItem("pm_privacy_v1", JSON.stringify({ analytics: false, at: 1, version: "old" }));
  });
  await legacy.page.goto(base + "/privacy/", { waitUntil: "networkidle" });
  assert.equal(legacy.requests.length, 0, "Old opt-out must block even the SDK download");
  await legacy.context.close();
  checks.push("Old opt-outs survive expiry and policy version changes");

  const blocked = await createContext(() => {
    if (location.origin !== "https://pitermebel.com") return;
    Storage.prototype.setItem = () => { throw new Error("storage unavailable"); };
  });
  await blocked.page.goto(base + "/privacy/", { waitUntil: "networkidle" });
  await blocked.page.locator("footer").getByRole("button", { name: off }).click();
  assert.equal(await blocked.page.locator('footer [role="alert"]').count(), 1);
  assert.equal(await blocked.page.evaluate(() => window.piterMetrikaInitialized), false);
  const count = blocked.watches().length;
  await blocked.page.locator('footer a[href="/kitchens/"]').click();
  await blocked.page.waitForTimeout(600);
  assert.equal(blocked.watches().length, count);
  await blocked.context.close();
  checks.push("Storage failure still stops the SDK and shows the persistence limitation");

  const delayed = await createContext(undefined, 2500);
  await delayed.page.goto(base + "/privacy/", { waitUntil: "domcontentloaded" });
  await delayed.page.locator("footer").getByRole("button", { name: off }).click();
  await delayed.page.waitForTimeout(3200);
  assert.equal(delayed.watches().length, 0, "Queued views must be dropped when opting out before the SDK arrives");
  await delayed.page.locator("footer").getByRole("button", { name: on }).click();
  await delayed.page.waitForTimeout(1000);
  assert.ok(delayed.watches().length > 0);
  await delayed.context.close();
  checks.push("Opt-out during SDK download prevents queued tracking; re-enable still works");
  assert.deepEqual(errors, []);
  await writeFile(`${output}/metrika-integration.json`, JSON.stringify({ testedAt: new Date().toISOString(), externalAnalyticsTransmitted: false, checks }, null, 2));
  console.log(checks.join("\n"));
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
