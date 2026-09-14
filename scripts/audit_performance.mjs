import { chromium } from "playwright";
import { mkdirSync, writeFileSync } from "node:fs";

const baseUrl = process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001";
const outputPath = "seo-work/2026-09-13/PERFORMANCE-LAB.json";
const targets = [
  ["home", "/"],
  ["kitchens", "/kitchens/"],
  ["project", "/projects/marble-hood/"],
  ["article", "/knowledge/rozetki-na-kuhne-shema-vysoty/"],
  ["contacts", "/contacts/"],
];

const browser = await chromium.launch({ headless: true });
const results = [];

for (const [name, path] of targets) {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2.75,
    isMobile: true,
    hasTouch: true,
    userAgent: "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 Chrome/123 Mobile Safari/537.36",
  });
  const page = await context.newPage();
  await page.route(/mc\.yandex|yandex\.ru\/ads/, (route) => route.abort());
  await page.addInitScript(() => {
    window.__auditMetrics = { lcp: 0, cls: 0, longTasks: [] };
    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      window.__auditMetrics.lcp = entries.at(-1)?.startTime || window.__auditMetrics.lcp;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) window.__auditMetrics.cls += entry.value;
      }
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((list) => {
      window.__auditMetrics.longTasks.push(...list.getEntries().map((entry) => entry.duration));
    }).observe({ type: "longtask", buffered: true });
  });

  const cdp = await context.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 150,
    downloadThroughput: 1.6 * 1024 * 1024 / 8,
    uploadThroughput: 750 * 1024 / 8,
    connectionType: "cellular4g",
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.goto(`${baseUrl}${path}`, { waitUntil: "load", timeout: 60000 });
  await page.waitForTimeout(3000);
  const metrics = await page.evaluate(() => {
    const navigation = performance.getEntriesByType("navigation")[0];
    const resources = performance.getEntriesByType("resource");
    const scripts = resources.filter((entry) => entry.initiatorType === "script");
    const paints = Object.fromEntries(performance.getEntriesByType("paint").map((entry) => [entry.name, entry.startTime]));
    const audit = window.__auditMetrics;
    return {
      ttfbMs: Math.round(navigation.responseStart),
      domContentLoadedMs: Math.round(navigation.domContentLoadedEventEnd),
      loadMs: Math.round(navigation.loadEventEnd),
      fcpMs: Math.round(paints["first-contentful-paint"] || 0),
      lcpMs: Math.round(audit.lcp),
      cls: Number(audit.cls.toFixed(4)),
      totalBlockingTimeMs: Math.round(audit.longTasks.reduce((sum, duration) => sum + Math.max(0, duration - 50), 0)),
      longTaskCount: audit.longTasks.length,
      scriptRequests: scripts.length,
      scriptTransferKb: Math.round(scripts.reduce((sum, entry) => sum + entry.transferSize, 0) / 1024),
      webglContexts: document.querySelectorAll("canvas.global-silk.is-webgl").length,
      documentOverflowPx: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  results.push({ name, path, profile: "mobile, 4x CPU, 150 ms latency, 1.6 Mbps down", ...metrics });
  await context.close();
}

await browser.close();
mkdirSync("seo-work/2026-09-13", { recursive: true });
writeFileSync(outputPath, `${JSON.stringify({ measuredAt: new Date().toISOString(), baseUrl, results }, null, 2)}\n`);
console.table(results.map(({ name, fcpMs, lcpMs, cls, totalBlockingTimeMs, scriptTransferKb, webglContexts }) => ({
  name, fcpMs, lcpMs, cls, totalBlockingTimeMs, scriptTransferKb, webglContexts,
})));
console.log(`Performance lab written to ${outputPath}`);
