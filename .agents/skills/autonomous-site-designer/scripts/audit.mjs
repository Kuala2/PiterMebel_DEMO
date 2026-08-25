// Детерминированный технический аудит готового сайта (этап QA и build-проверки).
// Проверяет то, что можно проверить машиной; вкус не оценивает.
//
//   node audit.mjs --config .design/qa/routes.json [--max-runs 2]
// routes.json: { "base": "http://127.0.0.1:3000", "routes": [{"name":"home","path":"/"}] }
//
// Exit: 0 TECHNICAL_PASS (нет P0) · 2 FAIL (есть P0) · 3 исчерпан лимит прогонов · 1 крах.
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

function loadPlaywright() {
  const candidates = [];
  if (process.cwd()) candidates.push(path.join(process.cwd(), "package.json"));
  const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
  candidates.push(path.join(here, "package.json"));
  for (const p of candidates) {
    try { return createRequire(p)("playwright"); } catch { /* next */ }
  }
  console.error(
    "PLAYWRIGHT_NOT_FOUND\nУстанови в проект:\n" +
    `  cd "${process.cwd()}" && npm i -D playwright && npx playwright install chromium`
  );
  process.exit(1);
}

const args = {};
process.argv.slice(2).forEach((a, i, all) => {
  if (a.startsWith("--")) {
    const k = a.slice(2);
    const n = all[i + 1];
    args[k] = n !== undefined && !n.startsWith("--") ? n : true;
  }
});

function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}
const toPosix = (p) => p.split(path.sep).join("/");

const MAIN_VPS = [{ width: 1440, height: 1000 }, { width: 390, height: 844 }];
const DEFAULT_PROBES = [320, 360, 430, 768];

async function auditPage(context, url, name, shotDir, probes) {
  const page = await context.newPage({ viewport: MAIN_VPS[0] });
  const report = { name, url, p0: [], p1: [], p2: [], manual: [], screenshots: [] };
  const consoleErrors = [];
  const pageErrors = [];
  const badSameOrigin = [];
  page.on("pageerror", (e) => pageErrors.push(String(e).slice(0, 160)));
  page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160)); });
  page.on("response", (r) => {
    if (r.status() >= 400) {
      const u = new URL(r.url());
      if (u.hostname === new URL(url).hostname && !/favicon/i.test(u.pathname)) badSameOrigin.push(`${r.status()} ${u.pathname}`);
    }
  });

  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(1200);
  } catch (e) {
    report.p0.push(`Страница не открылась: ${String(e.message || e).slice(0, 140)}`);
    await page.close();
    return report;
  }

  for (const vp of MAIN_VPS) {
    const label = `${vp.width}x${vp.height}`;
    await page.setViewportSize(vp);
    await page.waitForTimeout(300);
    const issues = await collectIssues(page, vp);
    for (const i of issues.p0) report.p0.push(`[${label}] ${i}`);
    for (const i of issues.p1) report.p1.push(`[${label}] ${i}`);
    for (const i of issues.p2) report.p2.push(`[${label}] ${i}`);
    report.manual.push(...issues.manual.map((m) => `[${label}] ${m}`));
    const first = path.join(shotDir, `${name}-${label}-first.png`);
    const full = path.join(shotDir, `${name}-${label}-full.png`);
    await page.screenshot({ path: first });
    await page.screenshot({ path: full, fullPage: true });
    report.screenshots.push(toPosix(path.relative(process.cwd(), first)), toPosix(path.relative(process.cwd(), full)));
  }

  for (const w of probes) {
    await page.setViewportSize({ width: w, height: 844 });
    await page.waitForTimeout(200);
    const probe = await page.evaluate(() => {
      const de = document.documentElement;
      return {
        overflow: de.scrollWidth > window.innerWidth + 1,
        text: (document.body.innerText || "").trim().length,
      };
    });
    if (probe.overflow) report.p0.push(`[${w}px] горизонтальный скролл`);
    if (probe.text < 120) report.p0.push(`[${w}px] страница пуста (текст ${probe.text} симв.)`);
  }

  if (pageErrors.length) report.p0.push(...dedupe(pageErrors).slice(0, 5).map((e) => `JS error: ${e}`));
  if (consoleErrors.length) report.p1.push(...dedupe(consoleErrors).slice(0, 5).map((e) => `console.error: ${e}`));
  if (badSameOrigin.length) report.p1.push(...dedupe(badSameOrigin).slice(0, 5).map((e) => `HTTP fail: ${e}`));

  await page.close();
  return report;
}

function dedupe(arr) { return [...new Set(arr)]; }

async function collectIssues(page, vp) {
  return page.evaluate((vp) => {
    const p0 = [], p1 = [], p2 = [], manual = [];
    const isMobile = vp.width <= 768;

    // --- пустая страница ---
    const allText = (document.body.innerText || "").trim();
    const imgCount = document.images.length;
    if (allText.length < 120 && imgCount === 0) p0.push(`пустая страница (текст ${allText.length}, картинок 0)`);

    // --- dev-overlay ошибок сборки (Next, Vite, Astro) ---
    const overlaySel = "nextjs-portal,[data-nextjs-dialog-overlay],#vite-overlay,.vite-error-overlay,#astro-dev-overlay,[astro-dev-toolbar]";
    if (document.querySelector(overlaySel)) p0.push("виден dev-overlay ошибок сборки");

    // --- горизонтальный overflow + виновники ---
    const de = document.documentElement;
    if (de.scrollWidth > window.innerWidth + 1) {
      p0.push(`горизонтальный скролл (${de.scrollWidth}px > ${window.innerWidth}px)`);
      const offenders = [];
      for (const el of document.querySelectorAll("body *")) {
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1)) {
          offenders.push({ s: sel(el), area: r.width * r.height, w: Math.round(r.width) });
        }
      }
      offenders.sort((a, b) => b.area - a.area);
      p0.push("виновники: " + offenders.slice(0, 4).map((o) => `${o.s} (${o.w}px)`).join(", "));
    }

    function sel(el) {
      if (el.id) return "#" + el.id;
      const cls = (el.className && typeof el.className === "string") ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".") : "";
      return el.tagName.toLowerCase() + cls;
    }

    // --- h1 / main / lang ---
    const h1s = [...document.querySelectorAll("h1")].filter((h) => (h.innerText || "").trim());
    if (h1s.length === 0) p0.push("нет непустого h1");
    if (h1s.length > 1) p2.push(`h1 больше одного (${h1s.length})`);
    if (!document.querySelector("main,[role=main]")) p2.push("нет <main>");
    if (!document.documentElement.lang) p2.push("не указан lang (ожидался ru)");

    // --- картинки ---
    let noAlt = 0, broken = 0;
    for (const img of document.images) {
      if (!img.hasAttribute("alt")) noAlt++;
      if (img.complete && img.naturalWidth === 0) broken++;
    }
    if (broken) p1.push(`битых картинок: ${broken}`);
    if (noAlt) p1.push(`img без alt: ${noAlt}`);

    // --- контраст (WCAG, с альфа-смешением) ---
    const lum = (r, g, b) => {
      const f = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
      return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
    };
    const blend = (fg, bg) => ({
      r: fg.r * fg.a + bg.r * (1 - fg.a),
      g: fg.g * fg.a + bg.g * (1 - fg.a),
      b: fg.b * fg.a + bg.b * (1 - fg.a),
      a: 1,
    });
    const parse = (s) => {
      const m = s.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
      return m ? { r: +m[1], g: +m[2], b: +m[3], a: m[4] === undefined ? 1 : +m[4] } : null;
    };
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let contrastFails = 0, contrastManual = 0, checked = 0;
    let node;
    while ((node = walker.nextNode()) && checked < 1200) {
      const t = node.textContent.trim();
      if (t.length < 2) continue;
      const el = node.parentElement;
      if (!el || !el.offsetParent) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || +cs.opacity < 0.1) continue;
      checked++;
      let bg = { r: 255, g: 255, b: 255, a: 1 }, bgImage = false;
      let anc = el;
      while (anc && anc !== document.documentElement) {
        const acs = getComputedStyle(anc);
        if (acs.backgroundImage && acs.backgroundImage !== "none") { bgImage = true; break; }
        const c = parse(acs.backgroundColor);
        if (c && c.a > 0) { bg = c.a >= 1 ? c : blend(c, bg); if (bg.a >= 1) break; }
        anc = anc.parentElement;
      }
      const fgc = parse(cs.color);
      if (!fgc) continue;
      const fg = fgc.a >= 1 ? fgc : blend(fgc, bg);
      const size = parseFloat(cs.fontSize), weight = +cs.fontWeight || 400;
      const large = size >= 24 || (size >= 18.66 && weight >= 700);
      if (bgImage) { contrastManual++; continue; }
      const L1 = lum(fg.r, fg.g, fg.b), L2 = lum(bg.r, bg.g, bg.b);
      const ratio = (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
      const need = large ? 3 : 4.5;
      if (ratio < need) contrastFails++;
    }
    if (contrastFails) p1.push(`контраст ниже WCAG: ${contrastFails} текст. фрагментов (проверь пары токенов)`);
    if (contrastManual) manual.push(`текст поверх background-image: ${contrastManual} фрагментов — проверить глазами по скриншоту`);

    // --- интерактивные элементы ---
    let smallTargets = 0, iconNoLabel = 0, wrappedButtons = 0, genericLabels = [];
    for (const el of document.querySelectorAll("a,button,[role=button],input,select,textarea")) {
      if (!el.offsetParent) continue;
      const cs = getComputedStyle(el);
      if (cs.visibility === "hidden" || cs.pointerEvents === "none") continue;
      const r = el.getBoundingClientRect();
      const text = (el.innerText || el.value || "").trim();
      const tag = el.tagName.toLowerCase();
      const isB = tag === "button" || tag === "a" || el.getAttribute("role") === "button";
      if (isB && isMobile) {
        const inline = tag === "a" && cs.display === "inline" && /^(p|li|td|div)$/.test(el.parentElement ? el.parentElement.tagName.toLowerCase() : "");
        if (!inline && r.width > 0 && Math.min(r.width, r.height) < 44) smallTargets++;
        if (!text && !el.getAttribute("aria-label") && !el.getAttribute("title")) iconNoLabel++;
        if (text) {
          const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.3;
          const vertExtras = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom)
            + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
          const minH = parseFloat(cs.minHeight) || 0;
          const singleLineH = Math.max(lh + vertExtras, minH);
          // перенос = фактическая высота заметно больше одной строки с учётом отступов и min-height
          if (r.height > singleLineH + 4) wrappedButtons++;
          if (/^(submit|ok|далее|next|отправить|заказать\??)$/i.test(text)) genericLabels.push(text);
        }
      }
    }
    if (smallTargets) p1.push(`цели нажатия < 44px на mobile: ${smallTargets}`);
    if (iconNoLabel) p1.push(`иконочные кнопки без aria-label: ${iconNoLabel}`);
    if (wrappedButtons) p1.push(`кнопки с переносом текста: ${wrappedButtons}`);
    if (genericLabels.length) p2.push(`генерик-подписи кнопок: ${[...new Set(genericLabels)].join(", ")}`);

    // --- типографика ---
    let smallBody = 0, tightLH = 0, longLines = 0;
    for (const p of document.querySelectorAll("p,li")) {
      if (!p.offsetParent || (p.innerText || "").trim().length < 60) continue;
      const cs = getComputedStyle(p);
      const size = parseFloat(cs.fontSize);
      const lh = parseFloat(cs.lineHeight) || size * 1.2;
      const chars = p.getBoundingClientRect().width / (size * 0.52);
      if (size < 15) smallBody++;
      if (lh / size < 1.35) tightLH++;
      if (chars > 90) longLines++;
    }
    if (smallBody) p2.push(`абзацный текст < 15px: ${smallBody}`);
    if (tightLH) p2.push(`межстрочный < 1.35: ${tightLH}`);
    if (longLines) p2.push(`строки длиннее ~90 симв.: ${longLines}`);

    // --- focus-visible и reduced-motion в стилях ---
    let hasFocusVisible = false, hasReducedMotion = false;
    const scanRules = (rules) => {
      for (const r of rules) {
        if (r.type === CSSRule.MEDIA_RULE) {
          if (String(r.conditionText || "").includes("prefers-reduced-motion")) hasReducedMotion = true;
          scanRules(r.cssRules);
        } else if (r.selectorText && r.selectorText.includes(":focus-visible")) hasFocusVisible = true;
      }
    };
    let hasMotion = false;
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if ((cs.animationName !== "none" && cs.animationDuration !== "0s") || parseFloat(cs.transitionDuration) > 0) { hasMotion = true; break; }
    }
    try {
      for (const sheet of document.styleSheets) scanRules(sheet.cssRules);
    } catch { /* cross-origin */ }
    if (!hasFocusVisible) p1.push("в стилях нет :focus-visible (клавиатурная навигация невидима)");
    if (hasMotion && !hasReducedMotion) p2.push("есть анимации, но нет @media (prefers-reduced-motion)");

    return { p0, p1, p2, manual };
  }, vp);
}

async function main() {
  const configPath = path.resolve(String(args.config || ".design/qa/routes.json"));
  if (!fs.existsSync(configPath)) {
    console.error(`Нет конфига ${configPath}.\nФормат: { "base": "http://127.0.0.1:3000", "routes": [{"name":"home","path":"/"}] }`);
    process.exit(1);
  }
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const hasRelative = (config.routes || []).some((r) => !String(r.path).startsWith("http") && !String(r.path).startsWith("file:"));
  if ((!config.base && hasRelative) || !Array.isArray(config.routes) || !config.routes.length) {
    console.error("Конфиг должен содержать base (если пути относительные) и непустой routes[]");
    process.exit(1);
  }
  const maxRuns = Number(args["max-runs"] || 2);
  // QA-бюджет считается на цикл (--cycle). Новый цикл открывает только пользователь
  // явной просьбой о новом QA-раунде; агент не вправе сам «перезапустить» бюджет.
  const cycle = String(args.cycle || "main");

  const qaRoot = path.resolve(".design/qa");
  const counterPath = path.join(qaRoot, "runs.json");
  let store = { cycles: {} };
  if (fs.existsSync(counterPath)) {
    const raw = JSON.parse(fs.readFileSync(counterPath, "utf8"));
    // миграция старого формата { runs: [...] }
    if (Array.isArray(raw.runs)) store = { cycles: { main: raw.runs } };
    else if (raw.cycles) store = raw;
  }
  const runs = store.cycles[cycle] || [];
  if (runs.length >= maxRuns) {
    const total = Object.values(store.cycles).reduce((a, r) => a + r.length, 0);
    console.error(`QA_BUDGET_EXHAUSTED: цикл «${cycle}» уже выполнил ${runs.length} прогонов (лимит ${maxRuns}, всего по проекту ${total}). Новый цикл — только по явному запросу пользователя: --cycle <имя>.`);
    process.exit(3);
  }
  const totalRuns = Object.values(store.cycles).reduce((a, r) => a + r.length, 0);
  const runDir = path.join(qaRoot, `run-${String(totalRuns + 1).padStart(2, "0")}`);
  const shotDir = path.join(runDir, "screenshots");
  fs.mkdirSync(shotDir, { recursive: true });

  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });

  const probes = Array.isArray(config.probes) ? config.probes : DEFAULT_PROBES;
  const reports = [];
  try {
    for (const r of config.routes) {
      const url = r.path.startsWith("http") || r.path.startsWith("file:") ? r.path : config.base.replace(/\/$/, "") + r.path;
      console.log(`Аудит ${r.name}: ${url}`);
      reports.push(await auditPage(context, url, r.name, shotDir, probes));
    }
  } finally {
    await browser.close();
  }

  const p0 = reports.flatMap((r) => r.p0.map((i) => `${r.name}: ${i}`));
  const p1 = reports.flatMap((r) => r.p1.map((i) => `${r.name}: ${i}`));
  const p2 = reports.flatMap((r) => r.p2.map((i) => `${r.name}: ${i}`));
  const manual = reports.flatMap((r) => r.manual.map((i) => `${r.name}: ${i}`));
  const verdict = p0.length ? "FAIL" : "TECHNICAL_PASS";

  writeJson(path.join(runDir, "audit.json"), {
    at: new Date().toISOString(), verdict, counts: { p0: p0.length, p1: p1.length, p2: p2.length },
    p0, p1, p2, manual, routes: reports.map((r) => ({ name: r.name, url: r.url, screenshots: r.screenshots })),
  });
  runs.push({ dir: toPosix(path.relative(process.cwd(), runDir)), at: new Date().toISOString(), verdict, cycle });
  store.cycles[cycle] = runs;
  writeJson(counterPath, store);

  console.log(`\n${verdict}  (P0: ${p0.length}, P1: ${p1.length}, P2: ${p2.length}, manual: ${manual.length})`);
  for (const i of p0) console.log("  P0 " + i);
  for (const i of p1.slice(0, 10)) console.log("  P1 " + i);
  for (const i of p2.slice(0, 10)) console.log("  P2 " + i);
  console.log(`Отчёт: ${toPosix(path.relative(process.cwd(), path.join(runDir, "audit.json")))}`);
  process.exit(p0.length ? 2 : 0);
}

main().catch((e) => { console.error(e); process.exit(1); });
