import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001";
const destination = "seo-work/2026-09-27/evidence";
await mkdir(destination, { recursive: true });
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
// Never send test visits, goals or leads to external services.
await context.route("**/*", route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
const page = await context.newPage();
const calls = () => page.evaluate(() => (window.ym?.a || []).map(args => Array.from(args)));
const hits = async () => (await calls()).filter(call => call[1] === "hit");

try {
  await page.goto(base + "/?utm_source=seo-test", { waitUntil: "networkidle" });
  await page.waitForFunction(() => window.ym?.a?.some(args => args[1] === "hit"));
  assert.equal((await hits()).length, 1);
  assert.equal((await hits())[0][2], base + "/?utm_source=seo-test");
  assert.equal((await hits())[0][3].title, await page.title());
  assert.equal(await page.locator('link[rel="preload"][as="image"][href="/img/production/line-boring.webp"]').count(), 0);
  await page.screenshot({ path: destination + "/home-mobile.png" });

  // Use rendered Next links; a full reload would erase the queue and fail the count.
  await page.locator('footer a[href="/kitchens/"]').first().click();
  await page.waitForURL(base + "/kitchens/");
  await page.waitForFunction(() => window.ym.a.filter(args => args[1] === "hit").length === 2);
  assert.equal((await hits())[1][3].title, await page.title());
  assert.equal((await hits())[1][3].referer, base + "/?utm_source=seo-test");
  const firstImage = page.locator(".kitchen-ladder-first .card-img-slide");
  assert.notEqual(await firstImage.getAttribute("loading"), "lazy");
  assert.equal(await page.locator('link[rel="preload"][as="image"][href="/img/kitchens/slavena/photo_1.jpg"]').count(), 1);
  await page.locator('footer a[href="/contacts/"]').first().click();
  await page.waitForURL(base + "/contacts/");
  await page.waitForFunction(() => window.ym.a.filter(args => args[1] === "hit").length === 3);
  assert.equal((await hits())[2][3].title, await page.title());
  await page.screenshot({ path: destination + "/contacts-mobile.png" });
  // Suppress the OS phone handler, while letting the tracking listener observe the click.
  await page.evaluate(() => document.addEventListener("click", e => {
    if (e.target.closest?.('a[href^="tel:"]')) e.preventDefault();
  }, { capture: true }));
  await page.locator('.contacts-channel-card[href^="tel:"]').click();
  assert.equal((await calls()).filter(c => c[1] === "reachGoal" && c[2] === "contact_phone").length, 1);
  await page.evaluate(() => { window.location.hash = "measure"; });
  await page.waitForTimeout(200);
  assert.equal((await hits()).length, 3, "An anchor must not create another pageview");
  await page.goBack(); // Remove the hash.
  await page.goBack(); // Return to kitchens via browser history.
  await page.waitForURL(base + "/kitchens/");
  await page.waitForFunction(() => window.ym.a.filter(args => args[1] === "hit").length === 4);
  assert.equal((await calls()).filter(c => c[1] === "init").length, 1);
  const navigationCalls = await calls();

  await page.goto(base + "/contacts/", { waitUntil: "networkidle" });
  const form = page.locator("#measure-form form");
  await form.locator('[name="contact"]').fill("+7 000 000 00 00");
  await form.locator('[name="consent"]').check();
  await form.locator('button[type="submit"]').click();
  await page.getByText("Онлайн-форма ещё не подключена.", { exact: false }).waitFor();
  assert.equal((await calls()).filter(c => c[1] === "reachGoal" && c[2] === "zayavka").length, 0);
  await form.locator('[name="botcheck"]').evaluate(el => { el.checked = true; });
  await form.locator('button[type="submit"]').click();
  await page.getByRole("heading", { name: "Заявка отправлена" }).waitFor();
  assert.equal((await calls()).filter(c => c[1] === "reachGoal" && c[2] === "zayavka").length, 0);

  const missing = await page.goto(base + "/seo-test-missing/");
  assert.equal(missing.status(), 404);
  await writeFile(destination + "/analytics-browser.json", JSON.stringify({
    testedAt: new Date().toISOString(), status: "passed", navigationCalls,
    checks: ["initial URL and query", "SPA transitions", "title and referer", "one init", "back navigation", "no hash duplicate", "contact click", "no lead without delivery", "no honeypot goal", "HTTP 404"],
    externalRequestsBlocked: true,
  }, null, 2));
  console.log("SEO browser: navigation, Metrica queue, mobile contact/form and 404 checks passed.");
} finally {
  await browser.close();
}
