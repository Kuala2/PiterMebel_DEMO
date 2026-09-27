import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";

const base = process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001";
const destination = "output/privacy-2026-09-27";
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
  await page.goto(base + "/?phone=private", { waitUntil: "networkidle" });
  assert.equal(await page.evaluate(() => typeof window.ym), "undefined");
  assert.equal(external.length, 0, "No third party should load before a choice");
  await page.locator('footer a[href="/kitchens/"]').click();
  await page.waitForURL(base + "/kitchens/");
  const firstImage = page.locator(".kitchen-ladder-first .card-img-slide");
  assert.notEqual(await firstImage.getAttribute("loading"), "lazy");
  await page.locator('footer a[href="/contacts/"]').click();
  await page.waitForURL(base + "/contacts/");
  const mapButton = page.getByRole("button", { name: "Показать интерактивную карту" });
  await mapButton.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  assert.equal(external.length, 0, "Scrolling to the map must not load Yandex");
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
  assert.equal(external.length, 0);
  assert.equal(await page.evaluate(() => typeof window.ym), "undefined");
  await mapButton.click();
  await page.waitForTimeout(250);
  assert.ok(external.some(url => url.includes("api-maps.yandex.ru")));

  for (const path of ["/privacy/", "/consent/", "/analytics-consent/"]) {
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
  await page.goto(base + "/privacy/#cookies", { waitUntil: "networkidle" });
  assert.equal(await page.getByRole("button", { name: "Дать согласие на аналитику" }).isDisabled(), true);
  await page.getByRole("button", { name: "Отключить аналитику" }).click();
  const choice = await page.evaluate(() => JSON.parse(localStorage.getItem("pm_privacy_v1")));
  assert.equal(choice.analytics, false);
  await page.screenshot({ path: destination + "/privacy-settings-mobile.png" });
  assert.equal(errors.length, 0, errors.join("\n"));
  assert.equal((await page.goto(base + "/seo-test-missing/")).status(), 404);
  await context.close();
  const noJs = await browser.newContext({ javaScriptEnabled: false });
  const noJsPage = await noJs.newPage();
  const trackers = [];
  noJsPage.on("request", request => { if (/mc\.yandex/.test(request.url())) trackers.push(request.url()); });
  await noJsPage.goto(base + "/privacy/");
  assert.equal(trackers.length, 0, "No noscript tracking without consent");
  await noJs.close();
  console.log("Browser checks passed: no tracking before consent; no unconfigured leads; separate consent; explicit map activation; legal pages at 320/390/1440; no-JS; HTTP 404.");
} finally { await browser.close(); }
