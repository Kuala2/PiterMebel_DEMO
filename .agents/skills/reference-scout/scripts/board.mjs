// Контакт-листы (борды) из картинок + инвентаризация проектных медиа.
// Рендер через временный HTML-файл: страница с file://-origin грузит file://-картинки,
// а setContent после file://-документа в Chromium зависает — поэтому без setContent.
//
//   node board.mjs <папка-или-файлы...> --out board.png --cols 3
//   node board.mjs --media public --out .design/media        (инвентарь + борд)
//   node board.mjs --captures <captures.json> --page-type home --variant desktopFirst --out board-pool.png
//     (честный борд из machine-отчёта захвата: только указанный pageType и variant;
//      рядом с PNG пишется <board>.report.json для research-гейта)
//   --only name1,name2 — доп. фильтр по именам items (например, только финалисты
//     для board-finalists-deep, когда в captures.json есть и другие внутренние)
import path from "node:path";
import fs from "node:fs";
import { loadPlaywright, fileUrl, writeJson, toPosix, normDomain, parseArgs, EXIT_CRASH, EXIT_DATA_FAIL } from "./lib.mjs";

const IMG_RE = /\.(png|jpe?g|webp|avif)$/i;
const EXCLUDE_RE = /(generated|placeholder|reference|og-|favicon|icon|logo-?mark)/i;

function collectInputs(args) {
  const files = [];
  for (const p of args._) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) files.push(path.resolve(p));
    else if (fs.existsSync(p)) {
      files.push(...fs.readdirSync(p).filter((f) => IMG_RE.test(f)).sort().map((f) => path.resolve(p, f)));
    } else console.warn(`[SKIP] не найдено: ${p}`);
  }
  return files;
}

function walkMedia(dir, acc = []) {
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name.startsWith(".")) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkMedia(p, acc);
    else if (IMG_RE.test(ent.name) && !EXCLUDE_RE.test(ent.name)) acc.push(p);
  }
  return acc;
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function buildHtml(files, cols, labels) {
  const cells = files
    .map((f, i) => `<div class="c"><img src="${esc(fileUrl(f))}"><div>${esc(labels[i] || path.basename(f))}</div></div>`)
    .join("\n");
  return `<!doctype html><meta charset="utf-8"><style>
    body{margin:0;font:12px/1.3 Arial;padding:12px;background:#111}
    .g{display:grid;grid-template-columns:repeat(${cols},1fr);gap:12px}
    .c{background:#000;padding:6px}
    .c img{width:100%;display:block}
    .c div{color:#ddd;padding:4px 2px;word-break:break-all}
  </style><div class="g" id="g">${cells}</div>`;
}

async function openImagePage(browser, htmlPath) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  await page.goto(fileUrl(htmlPath), { waitUntil: "load", timeout: 90000 });
  return page;
}

async function withTempHtml(browser, files, cols, labels, outPng, fn) {
  const tmp = outPng + ".src.html";
  fs.mkdirSync(path.dirname(outPng), { recursive: true });
  fs.writeFileSync(tmp, buildHtml(files, cols, labels), "utf8");
  try {
    const page = await openImagePage(browser, tmp);
    try {
      return await fn(page);
    } finally {
      await page.close();
    }
  } finally {
    fs.rmSync(tmp, { force: true });
  }
}

async function renderBoard(browser, files, outPng, cols = 3, labels = []) {
  return withTempHtml(browser, files, cols, labels, outPng, async (page) => {
    const dims = await page.evaluate(() => {
      const g = document.getElementById("g");
      const broken = [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).length;
      return { w: g.scrollWidth, h: g.scrollHeight, broken };
    });
    if (dims.broken) console.warn(`[WARN] не загрузилось картинок: ${dims.broken}`);
    await page.setViewportSize({
      width: Math.min(Math.max(dims.w, 320), 1600),
      height: Math.min(Math.max(dims.h, 240), 20000),
    });
    await page.waitForTimeout(200);
    await page.screenshot({ path: outPng, fullPage: true });
    return dims;
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ headless: true });

  try {
    if (args.captures) {
      const capsPath = path.resolve(String(args.captures));
      if (!fs.existsSync(capsPath)) { console.error(`Нет machine-отчёта: ${capsPath}`); process.exit(EXIT_CRASH); }
      const caps = JSON.parse(fs.readFileSync(capsPath, "utf8"));
      const pageType = String(args["page-type"] || "home");
      const variant = String(args.variant || "desktopFirst"); // desktopFirst | desktopFull | mobile
      const only = args.only ? String(args.only).split(",").map((s) => s.trim()).filter(Boolean) : null;
      const fileKey = variant;
      const items = (caps.items || []).filter((it) =>
        it.status === "ok" && it.pageType === pageType && it.files && it.files[fileKey]
        && (!only || only.includes(it.name)));
      const out = path.resolve(args.out ? String(args.out) : "board.png");
      if (!items.length) {
        console.error(`CAPTURES_BOARD_EMPTY: нет ok-захватов с pageType=${pageType}, variant=${variant}`);
        process.exit(EXIT_DATA_FAIL);
      }
      const files = items.map((it) => path.resolve(it.files[fileKey]));
      const missing = files.filter((f) => !fs.existsSync(f));
      if (missing.length) { console.error(`CAPTURES_BOARD_MISSING_FILES: ${missing.join(", ")}`); process.exit(EXIT_DATA_FAIL); }
      const labels = items.map((it) => `${it.name} · ${normDomain(it.finalUrl || it.url)}`);
      await renderBoard(browser, files, out, Number(args.cols || 4), labels);
      writeJson(out + ".report.json", {
        board: toPosix(path.relative(process.cwd(), out)),
        source: toPosix(path.relative(process.cwd(), capsPath)),
        pageType, variant, count: items.length,
        items: items.map((it) => ({ name: it.name, pageType: it.pageType, file: it.files[fileKey], finalUrl: it.finalUrl })),
      });
      console.log(`Борд ${pageType}/${variant} (${items.length} шт.) → ${toPosix(out)} (+ report.json)`);
    } else if (args.media) {
      const dir = path.resolve(String(args.media));
      if (!fs.existsSync(dir)) { console.error(`MEDIA_SOURCE_MISSING: ${dir}`); process.exit(EXIT_CRASH); }
      const files = walkMedia(dir);
      if (!files.length) { console.error("NEEDS_REAL_MEDIA: в источнике нет подходящих изображений"); process.exit(EXIT_CRASH); }
      const outDir = path.resolve(args.out ? String(args.out) : ".design/media");
      fs.mkdirSync(outDir, { recursive: true });

      const probePng = path.join(outDir, "project-media-board.png");
      const inventory = await withTempHtml(browser, files, 6, [], probePng, async (page) =>
        page.evaluate(() =>
          [...document.images].map((img) => ({ w: img.naturalWidth, h: img.naturalHeight }))
        )
      );
      const items = files.map((f, i) => ({
        file: toPosix(path.relative(process.cwd(), f)),
        width: inventory[i] ? inventory[i].w : 0,
        height: inventory[i] ? inventory[i].h : 0,
        usable: !!(inventory[i] && inventory[i].w >= 240 && inventory[i].h >= 160),
      }));
      const usable = items.filter((i) => i.usable);
      writeJson(path.join(outDir, "project-media.json"), {
        source: toPosix(dir), total: items.length, usable: usable.length,
        media: usable.map((i) => ({ path: i.file, source: "local-project-media", usage: "direction" })),
        items,
      });
      if (!usable.length) { console.error("NEEDS_REAL_MEDIA: все изображения слишком маленькие (<240×160)"); process.exit(EXIT_CRASH); }

      await renderBoard(browser, usable.map((i) => path.resolve(i.file)), path.join(outDir, "project-media-board.png"), 4,
        usable.map((i) => `${i.width}×${i.height} ${i.file.split("/").pop()}`));
      console.log(`Медиа: ${usable.length}/${items.length} пригодно → ${toPosix(path.join(outDir, "project-media-board.png"))}`);
    } else {
      const files = collectInputs(args);
      if (!files.length) { console.error("Нет входных картинок"); process.exit(EXIT_CRASH); }
      const out = path.resolve(args.out ? String(args.out) : "board.png");
      const dims = await renderBoard(browser, files, out, Number(args.cols || 3));
      console.log(`Борд (${files.length} шт., ${dims.w}×${dims.h}px) → ${toPosix(out)}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => { console.error(e); process.exit(EXIT_CRASH); });
