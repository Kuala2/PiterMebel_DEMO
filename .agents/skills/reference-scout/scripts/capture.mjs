// Универсальный захват скриншотов: live-URL или локальные HTML-файлы.
// Заменяет capture-pool/capture-deep/capture-concepts из v5.
//
// URL-режим (референсы):
//   node capture.mjs urls --list sites.json --out .design/research/references
//   sites.json: [{ "name": "studio-x", "url": "https://..." }]
//   --merge — инкрементальный прогон: одноимённые items заменяют старые в существующем
//   captures.json, остальное сохраняется (пересъёмка только затронутых кадров)
//
// Файл-режим (концепты/targets):
//   node capture.mjs file -- segments: список HTML; --segments для длинных страниц
//   node capture.mjs file "concept-1.html" "concept-2.html" --out .design/style-lab/shots --segments
//
// Ссылки (витрины галерей → URL оригиналов):
//   node capture.mjs links <url> [--mode external|all] [--out links.json]
//   external — только ссылки на другие домены (оригиналы с карточек), all — все.
//
// Exit: 0 — всё ок; 2 — есть захваты, не прошедшие проверки; 1 — крах.
import path from "node:path";
import fs from "node:fs";
import {
  loadPlaywright, fileUrl, sha256File, writeJson, toPosix, slug, sameSite, normDomain,
  inspectDom, domVerdict, dismissOverlays, analyzeRaster, warmScroll, settleTop, parseArgs,
  findPinnedOverlays, pinnedVerdict,
  EXIT_OK, EXIT_DATA_FAIL, EXIT_CRASH,
} from "./lib.mjs";

const DESKTOP = { width: 1440, height: 1000 };
const MOBILE = { width: 390, height: 844 };

function parseViewport(s) {
  const [w, h] = String(s).split(/[x×]/).map(Number);
  if (!w || !h) throw new Error(`Неверный viewport «${s}» (ожидаю 1440x1000)`);
  return { width: w, height: h };
}

// Поведенческая проверка закреплённых в viewport оверлеев (не верим CSS position).
// Возвращает вердикт null/«blocking-overlay»/«chat-widget-overlay», найденное пишет в result[key].
async function behavioralCheck(page, result, key) {
  const pinned = await findPinnedOverlays(page);
  result[key] = pinned;
  const v = pinnedVerdict(pinned);
  if (v) {
    result.status = "fail";
    result.reasons.push(`pinned-${v} (${pinned.map((p) => `${p.tag}:${p.w}x${p.h}:${p.zone}`).slice(0, 3).join(", ")})`);
  }
  return v;
}

async function captureUrlItem(context, item, outDir) {
  const name = slug(item.name || item.url);
  const result = { name, url: item.url, status: "ok", reasons: [], files: {} };
  // pageType обязателен для research gate: home или inner (fallback — по пути URL)
  if (item.pageType) result.pageType = item.pageType;
  else {
    try { result.pageType = new URL(item.url).pathname.replace(/\/+$/, "") === "" ? "home" : "inner"; }
    catch { result.pageType = "inner"; }
  }
  const page = await context.newPage();
  try {
    const resp = await page.goto(item.url, { waitUntil: "domcontentloaded", timeout: 45000 });
    if (resp && resp.status() >= 400) result.reasons.push(`HTTP ${resp.status()}`);
    await page.waitForTimeout(1200);
    const clicked = await dismissOverlays(page);
    if (clicked) await page.waitForTimeout(600);

    let dom = await inspectDom(page);
    let verdict = domVerdict(dom);
    if (verdict === "weak-first-screen") {
      // одна мягкая попытка: подождать ленивую загрузку
      await page.waitForTimeout(2500);
      dom = await inspectDom(page);
      verdict = domVerdict(dom);
    }
    result.finalUrl = page.url();
    result.title = dom.title;
    result.dom = { textLength: dom.textLength, mediaCount: dom.mediaCount, overlays: dom.overlays.length };

    // редирект на чужой домен = неудачный захват; обнови url на канонический и пересними
    if (!sameSite(result.finalUrl, item.url)) {
      result.status = "fail";
      result.reasons.push(`redirect → ${result.finalUrl}`);
      await page.screenshot({ path: path.join(outDir, `${name}-redirect.png`) });
      return result;
    }
    if (verdict !== "ok") {
      // брак (бот-челлендж, остаточный cookie/CAPTCHA-оверлей, бланк) — только evidence,
      // никакого desktopFirst, пригодного для референсов и бордов
      result.status = "fail";
      result.reasons.push(verdict);
      await page.screenshot({ path: path.join(outDir, `${name}-evidence.png`) });
      return result;
    }

    await warmScroll(page, 12000);
    // первый экран снимаем только после подтверждённого возврата наверх
    const syD = await settleTop(page);
    const vpD = page.viewportSize() || DESKTOP;
    result.firstViewport = { scrollY: syD, viewportWidth: vpD.width, viewportHeight: vpD.height };
    if (syD > 2) {
      result.status = "fail";
      result.reasons.push(`scroll-not-top (${syD}px)`);
      await page.screenshot({ path: path.join(outDir, `${name}-evidence.png`) });
      return result;
    }

    // повторная проверка overlays ПОСЛЕ прогрева: cookie/подписные модалки часто
    // появляются только после скролла; result.dom хранит именно эту финальную проверку
    await dismissOverlays(page);
    await page.waitForTimeout(600);
    const domFinal = await inspectDom(page);
    const verdictFinal = domVerdict(domFinal);
    result.dom = { textLength: domFinal.textLength, mediaCount: domFinal.mediaCount, overlays: domFinal.overlays.length };
    if (verdictFinal !== "ok") {
      result.status = "fail";
      result.reasons.push(verdictFinal);
      await page.screenshot({ path: path.join(outDir, `${name}-evidence.png`) });
      return result;
    }

    // поведенческая проверка: закреплённые в viewport панели/формы/попапы (после возврата наверх)
    const pinnedD = await behavioralCheck(page, result, "pinnedDesktop");
    if (pinnedD) {
      await page.screenshot({ path: path.join(outDir, `${name}-evidence.png`) });
      return result;
    }

    const first = path.join(outDir, `${name}-desktop-first.png`);
    const full = path.join(outDir, `${name}-desktop-full.png`);
    await page.screenshot({ path: first });
    await page.screenshot({ path: full, fullPage: true });

    // overlay мог появиться во время/после fullPage-захвата (fullPage сам скроллит страницу) —
    // загрязнённые кадры не попадают в files и удаляются с диска
    const domAfterFull = await inspectDom(page);
    const verdictAfterFull = domVerdict(domAfterFull);
    if (verdictAfterFull !== "ok") {
      result.status = "fail";
      result.reasons.push(`overlay-after-full (${verdictAfterFull})`);
      await settleTop(page);
      await page.screenshot({ path: path.join(outDir, `${name}-evidence.png`) });
      fs.rmSync(first, { force: true });
      fs.rmSync(full, { force: true });
      return result;
    }
    await settleTop(page);

    // повторная поведенческая проверка после fullPage: попапы часто открываются по скроллу вглубь
    const pinnedF = await behavioralCheck(page, result, "pinnedAfterFull");
    if (pinnedF) {
      await page.screenshot({ path: path.join(outDir, `${name}-evidence.png`) });
      fs.rmSync(first, { force: true });
      fs.rmSync(full, { force: true });
      return result;
    }

    // растровый детект живого кадра: чёрный canvas/видео или splash без контента
    result.rasterDesktop = await analyzeRaster(page, first);
    if (result.rasterDesktop.bins <= 3 && result.rasterDesktop.std < 5) {
      result.status = "fail";
      result.reasons.push(`raster-flat (bins=${result.rasterDesktop.bins}, std=${result.rasterDesktop.std})`);
    }

    if (item.mobile !== false) {
      await page.setViewportSize({ width: MOBILE.width, height: MOBILE.height });
      await page.waitForTimeout(800);
      // мобильный первый экран — тоже только после возврата наверх
      const syM = await settleTop(page);
      const vpM = page.viewportSize() || MOBILE;
      result.mobileViewport = { scrollY: syM, viewportWidth: vpM.width, viewportHeight: vpM.height };
      if (syM > 2) {
        result.status = "fail";
        result.reasons.push(`scroll-not-top-mobile (${syM}px)`);
        await page.screenshot({ path: path.join(outDir, `${name}-mobile-evidence.png`) });
        return result;
      }
      // повторная mobile-проверка overlays: часть баннеров показывается только на 390px
      await dismissOverlays(page);
      await page.waitForTimeout(500);
      const mdomF = await inspectDom(page);
      const verdictMobile = domVerdict(mdomF);
      result.mobileDom = { textLength: mdomF.textLength, mediaCount: mdomF.mediaCount, overlays: mdomF.overlays.length };
      if (verdictMobile !== "ok") {
        result.status = "fail";
        result.reasons.push(`mobile-${verdictMobile}`);
        await page.screenshot({ path: path.join(outDir, `${name}-mobile-evidence.png`) });
        return result;
      }
      const m = path.join(outDir, `${name}-mobile-first.png`);
      await page.screenshot({ path: m });
      result.files.mobile = toPosix(path.relative(process.cwd(), m));
      // поведенческая проверка в мобильном viewport (контактные формы поверх контента и т.п.)
      const pinnedM = await behavioralCheck(page, result, "pinnedMobile");
      if (pinnedM) {
        await page.screenshot({ path: path.join(outDir, `${name}-mobile-evidence.png`) });
        fs.rmSync(m, { force: true });
        delete result.files.mobile;
        return result;
      }
      const mraster = await analyzeRaster(page, m);
      result.rasterMobile = mraster;
      if (mdomF.textLength < 40 && mdomF.mediaCount === 0) {
        result.status = "fail";
        result.reasons.push("mobile-empty");
      } else if (mraster.bins <= 3 && mraster.std < 5) {
        result.status = "fail";
        result.reasons.push(`mobile-flat (bins=${mraster.bins}, std=${mraster.std})`);
      }
    }
    result.files.desktopFirst = toPosix(path.relative(process.cwd(), first));
    result.files.desktopFull = toPosix(path.relative(process.cwd(), full));

    // ссылки забираем тем же визитом: повторный заход в галерею может поймать чекпойнт.
    // nav/header/footer-ссылки помечаем — карточки витрин обычно в контенте
    result.links = await page.evaluate(() => {
      const seen = new Set();
      const out = [];
      for (const a of document.querySelectorAll("a[href]")) {
        const href = a.href;
        if (!href || href.startsWith("javascript:") || seen.has(href)) continue;
        seen.add(href);
        const inNav = !!a.closest("nav,header,footer");
        out.push({ href, inNav, text: (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 100) });
        if (out.length >= 300) break;
      }
      return out;
    });
  } catch (e) {
    result.status = "fail";
    result.reasons.push(String(e && e.message ? e.message : e).slice(0, 200));
  } finally {
    await page.close();
  }
  return result;
}

async function captureFileItem(context, htmlPath, outDir, viewports, withSegments) {
  const abs = path.resolve(htmlPath);
  const stem = slug(path.basename(abs, path.extname(abs)));
  const result = { name: stem, file: toPosix(path.relative(process.cwd(), abs)), status: "ok", reasons: [], files: {}, viewports: {} };
  const page = await context.newPage();
  try {
    await page.goto(fileUrl(abs), { waitUntil: "load", timeout: 30000 });
    await page.waitForTimeout(400);
    await dismissOverlays(page);

    for (const vp of viewports) {
      const label = `${vp.width}x${vp.height}`;
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.waitForTimeout(300);
      const first = path.join(outDir, `${stem}-${label}-first.png`);
      const full = path.join(outDir, `${stem}-${label}-full.png`);
      await page.screenshot({ path: first });
      await page.screenshot({ path: full, fullPage: true });
      result.files[label] = {
        first: toPosix(path.relative(process.cwd(), first)),
        full: toPosix(path.relative(process.cwd(), full)),
      };
      if (withSegments) {
        const segs = await captureSegments(page, outDir, stem, label);
        result.files[label].segments = segs;
      }
    }

    // проверка на пустышку: DOM (контент) + растр против полностью плоских кадров.
    // Минималистичная белая страница с текстом легитимна — bins≥8 требует лишь пёстрый веб.
    const dom = await inspectDom(page);
    if (dom.textLength < 30 && dom.mediaCount === 0) {
      result.status = "fail";
      result.reasons.push(`dom-empty (текст ${dom.textLength} симв., медиа 0)`);
    }
    const dv = viewports[0];
    const firstShot = path.join(outDir, `${stem}-${dv.width}x${dv.height}-first.png`);
    const raster = await analyzeRaster(page, firstShot);
    result.raster = raster;
    if (raster.bins <= 3 && raster.std < 5) {
      result.status = "fail";
      result.reasons.push(`raster-flat (bins=${raster.bins}, std=${raster.std})`);
    }
    result.sha256 = sha256File(firstShot);
  } catch (e) {
    result.status = "fail";
    result.reasons.push(String(e && e.message ? e.message : e).slice(0, 200));
  } finally {
    await page.close();
  }
  return result;
}

async function captureSegments(page, outDir, stem, label, maxSegments = 40) {
  const files = [];
  const height = await page.evaluate(() => Math.max(window.innerHeight, 600));
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const count = Math.min(Math.ceil(total / height), maxSegments);
  for (let i = 0; i < count; i++) {
    await page.evaluate((y) => window.scrollTo(0, y), i * height);
    await page.waitForTimeout(120);
    const p = path.join(outDir, `${stem}-${label}-seg${String(i + 1).padStart(2, "0")}.png`);
    await page.screenshot({ path: p });
    files.push(toPosix(path.relative(process.cwd(), p)));
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  return files;
}

async function extractLinks(context, url, mode) {
  const page = await context.newPage();
  try {
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
    await page.waitForTimeout(1500);
    await dismissOverlays(page);
    const links = await page.evaluate(() => {
      const seen = new Set();
      const out = [];
      for (const a of document.querySelectorAll("a[href]")) {
        const href = a.href;
        if (!href || href.startsWith("javascript:") || seen.has(href)) continue;
        seen.add(href);
        out.push({ href, text: (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120) });
      }
      return out;
    });
    const baseHost = normDomain(url);
    const filtered = links.filter((l) => {
      const h = normDomain(l.href);
      if (!h) return false;
      return mode === "all" ? true : h !== baseHost;
    });
    // внешний мусор (соцсети/магазины тем) не интересует при поиске оригиналов
    const junk = /twitter\.com|x\.com|facebook\.com|instagram\.com|linkedin\.com|pinterest\.com|youtube\.com|vk\.com|t\.me|telegram\.me|apple\.com|google\.com$/i;
    return filtered.filter((l) => !junk.test(normDomain(l.href)));
  } finally {
    await page.close();
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const mode = args._[0] || args.mode;
  const outDir = path.resolve(args.out || ".design/capture");
  // в links-режиме --out — это файл, а не папка; создавать её заранее нельзя
  if (mode !== "links") fs.mkdirSync(outDir, { recursive: true });

  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: DESKTOP, deviceScaleFactor: 1 });

  let results = [];
  try {
    if (mode === "urls") {
      if (!args.list || !fs.existsSync(args.list)) {
        console.error("Нужен --list <file.json> со списком [{name,url}]");
        process.exit(EXIT_CRASH);
      }
      const items = JSON.parse(fs.readFileSync(args.list, "utf8"));
      for (const item of items) {
        const r = await captureUrlItem(context, item, outDir);
        results.push(r);
        console.log(`[${r.status.toUpperCase()}] ${r.name} ${r.reasons.join(", ")}`);
      }
      const reportPath = path.join(outDir, "captures.json");
      let reportItems = results;
      if (args.merge) {
        let prev = [];
        if (fs.existsSync(reportPath)) {
          try { prev = JSON.parse(fs.readFileSync(reportPath, "utf8")).items || []; }
          catch { prev = []; }
        }
        const byName = new Map(prev.map((it) => [it.name, it]));
        for (const r of results) byName.set(r.name, r);
        reportItems = [...byName.values()];
      }
      writeJson(reportPath, {
        capturedAt: new Date().toISOString(), mode: "urls",
        ...(args.merge ? { merged: results.map((r) => r.name) } : {}),
        items: reportItems,
      });
    } else if (mode === "file") {
      const inputs = (args.inputs ? String(args.inputs).split(",") : []).concat(args._.slice(1)).filter(Boolean)
        .flatMap((g) => (g.includes("*") ? expandGlob(g) : [g]));
      if (!inputs.length) {
        console.error("Укажи HTML-файлы: node capture.mjs file a.html b.html --out dir");
        process.exit(EXIT_CRASH);
      }
      const viewports = (args.viewports ? String(args.viewports).split(",") : ["1440x1000", "390x844"]).map(parseViewport);
      for (const f of inputs) {
        if (!fs.existsSync(f)) { console.error(`[MISS] ${f}`); continue; }
        const r = await captureFileItem(context, f, outDir, viewports, args.segments === true);
        results.push(r);
        console.log(`[${r.status.toUpperCase()}] ${r.name} ${r.reasons.join(", ")}`);
      }
      writeJson(path.join(outDir, "file-captures.json"), {
        capturedAt: new Date().toISOString(), mode: "file", items: results,
      });
    } else if (mode === "links") {
      const target = args._[1];
      if (!target || !/^https?:\/\//.test(target)) {
        console.error("Укажи URL: node capture.mjs links https://… [--mode external|all] [--out links.json]");
        process.exit(EXIT_CRASH);
      }
      const links = await extractLinks(context, target, args.mode === "all" ? "all" : "external");
      const payload = { url: target, extractedAt: new Date().toISOString(), count: links.length, links };
      if (args.out) writeJson(path.resolve(String(args.out)), payload);
      console.log(JSON.stringify(payload, null, 2));
      if (!links.length) {
        console.error("Ссылок не найдено (возможно, bot-блокировка или нет внешних ссылок)");
        process.exit(EXIT_DATA_FAIL);
      }
    } else {
      console.error("Режим: urls | file | links");
      process.exit(EXIT_CRASH);
    }
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => r.status !== "ok").length;
  console.log(`\nГотово: ${results.length - failed}/${results.length} ок → ${toPosix(outDir)}`);
  process.exit(failed > 0 ? EXIT_DATA_FAIL : EXIT_OK);
}

function expandGlob(g) {
  // минимальный glob только для *, без зависимостей
  const dir = path.dirname(g);
  const pattern = new RegExp("^" + path.basename(g).replace(/[.+^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*") + "$");
  try {
    return fs.readdirSync(dir).filter((f) => pattern.test(f)).sort().map((f) => path.join(dir, f));
  } catch {
    return [];
  }
}

main().catch((e) => { console.error(e); process.exit(EXIT_CRASH); });
