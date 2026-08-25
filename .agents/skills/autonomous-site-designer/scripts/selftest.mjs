// Воспроизводимый самотест системы: fixtures зашиты сюда, тесты изолированы в .selftest/.
// Запускать из корня проекта, где установлен playwright:
//   node <skill>/scripts/selftest.mjs
import { spawnSync, spawn } from "node:child_process";
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
const scoutScripts = path.resolve(here, "..", "..", "reference-scout", "scripts");
const ws = path.join(process.cwd(), ".selftest");
const PORT_A = 18791, PORT_B = 18792;

// playwright должен быть достижим из проекта
try { createRequire(path.join(process.cwd(), "package.json"))("playwright"); }
catch {
  console.error(`PLAYWRIGHT_NOT_FOUND. Запусти из проекта с playwright:\n  cd "${process.cwd()}" && npm i -D playwright && npx playwright install chromium`);
  process.exit(1);
}
if (!fs.existsSync(scoutScripts)) {
  console.error(`Не найден reference-scout рядом со скиллом: ${scoutScripts}`);
  process.exit(1);
}

const GOOD = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>good fixture</title><style>
:root{--ink:#141414;--muted:#5C5C5C;--accent:#2E5B3F}
*{box-sizing:border-box}body{margin:0;font:400 17px/1.6 sans-serif;color:var(--ink)}
main{max-width:900px;margin:0 auto;padding:32px}
h1{font-size:clamp(34px,5vw,52px);line-height:1.1;margin:0 0 16px}
p{max-width:70ch}.muted{color:var(--muted)}
.btn{display:inline-flex;min-height:48px;padding:8px 32px;background:var(--accent);color:#fff;border:0;border-radius:2px;font:600 16px/1 sans-serif;text-decoration:none}
.btn:focus-visible{outline:3px solid var(--accent);outline-offset:2px}
img{max-width:100%;height:auto}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
</style></head><body><main>
<h1>Мастерская: кухни и мебель на заказ</h1>
<p class="muted">Проектируем и производим мебель под конкретный интерьер. Полный цикл: замер, проект, производство, монтаж.</p>
<p><a class="btn" href="#f">Получить расчёт</a></p>
<img src="data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%232E5B3F'/%3E%3C/svg%3E" alt="Чертёж кухонного гарнитура" width="800" height="400">
<h2>Подход</h2><p>Работаем по чертежам дизайнеров и по собственным проектам. Каждый этап согласуется с заказчиком до начала производства.</p>
<h2>Обсудить проект</h2><p>Оставьте контакт — вернёмся с вопросами и предварительной оценкой.</p><p id="f"><a class="btn" href="mailto:hello@project-demo.ru">Написать нам</a></p>
</main></body></html>`;

const BAD = `<!doctype html><html><head><meta charset="utf-8"><title>bad fixture</title><style>
body{margin:0;font:13px/1.1 Arial;color:#999}.row{display:flex;white-space:nowrap}
.row>div{min-width:320px;padding:10px;background:#f8f8f8}
.cta{background:linear-gradient(135deg,#6366f1,#3b82f6);color:#cbd5e1;padding:6px 12px;font-size:12px}
.icon-btn{width:28px;height:28px;background:#ddd;border:0}
</style></head><body>
<div class="row"><div>Колонка раз с длинным текстом без переносов чтобы вызвать горизонтальный скролл на мобильных экранах</div><div>Колонка два</div><div>Колонка три</div><div>Колонка четыре</div></div>
<h1>Заголовок первый</h1><h1>Заголовок второй такой же</h1>
<p>Серый мелкий плотный текст для проверки контраста и типографики одновременно.</p>
<img src="https://selftest.invalid/nothing.png">
<a href="#" class="cta">Отправить</a><button class="icon-btn"></button>
</body></html>`;

const EMPTY = `<!doctype html><html><head><meta charset="utf-8"></head><body><div style="background:#f4f4f4"></div></body></html>`;

const LONG = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>long fixture</title><style>
body{margin:0;font:16px/1.5 sans-serif;color:#141414}
main{max-width:900px;margin:0 auto;padding:24px}
h1{font-size:42px;color:#2E5B3F}section{min-height:520px;padding:24px;border-bottom:1px solid #ccc}
section:nth-child(even){background:#eef3ee}
</style></head><body><main>
<h1>Длинная страница для проверки возврата наверх</h1>
<p>Первый экран обязан быть снят при scrollY=0 после прокрутки warmScroll до низа и возврата наверх с ожиданием стабилизации.</p>
${Array.from({ length: 14 }, (_, i) => `<section><h2>Секция ${i + 1}</h2><p>Контент секции номер ${i + 1} для ленивой загрузки, sticky-проверок и достаточной высоты страницы.</p></section>`).join("\n")}
</main></body></html>`;

const COOKIE = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>cookie fixture</title><style>
body{margin:0;font:17px/1.6 sans-serif;color:#141414}main{max-width:900px;margin:0 auto;padding:32px}
h1{font-size:40px;color:#2E5B3F}
</style></head><body><main>
<h1>Студия с cookie-баннером</h1>
<p>Обычная страница с достаточным количеством текста, чтобы первый экран считался содержательным до и после закрытия баннера согласия.</p>
<p>Здесь рассказывается о продукте, процессе и подходе студии, чтобы детектор слабого первого экрана не срабатывал на этой странице.</p>
<div role="dialog" aria-label="cookies" style="position:fixed;left:0;right:0;bottom:0;height:40vh;z-index:9999;background:#fff;padding:24px;border-top:2px solid #2E5B3F">
<p>We use cookies to improve your experience.</p>
<button id="ok-btn" style="min-height:48px;padding:8px 24px">Accept all</button>
</div>
<script>document.getElementById('ok-btn').addEventListener('click',function(){this.closest('[role=dialog]').remove();});</script>
</main></body></html>`;

const CAPTCHA = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>captcha fixture</title></head><body>
<main style="max-width:900px;margin:0 auto;padding:32px;font:17px/1.6 sans-serif">
<h1>Сайт с защитой</h1><p>Позади модалки находится обычный содержательный текст страницы, который не должен спасти захват.</p>
</main>
<div style="position:fixed;left:0;right:0;top:15%;height:60vh;z-index:9999;background:#fff;padding:24px;border:1px solid #ccc">
<p>SmartCaptcha — подтвердите, что вы не робот</p>
<button style="min-height:44px;padding:8px 20px">Проверить</button>
</div>
</body></html>`;

const MODAL = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>modal fixture</title></head><body>
<main style="max-width:900px;margin:0 auto;padding:32px;font:17px/1.6 sans-serif">
<h1>Сайт с подписной модалкой</h1><p>Позади модалки находится обычный содержательный текст страницы, который не должен спасти захват.</p>
</main>
<div role="dialog" style="position:fixed;left:0;right:0;top:20%;height:45vh;z-index:9999;background:#fff;padding:24px;border:1px solid #ccc">
<p>Подпишитесь на нашу рассылку, чтобы не пропустить новости студии и новые проекты.</p>
<button style="min-height:44px;padding:8px 20px">Позже, не сейчас</button>
</div>
</body></html>`;

// валидная PNG 1×1 для фикстур-файлов (борды должны реально рендерить картинки)
const PNG1X = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", "base64");

const LATE_MODAL = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>late modal</title><style>
body{margin:0;font:17px/1.6 sans-serif;color:#141414}main{max-width:900px;margin:0 auto;padding:32px}
h1{font-size:40px;color:#2E5B3F}section{min-height:500px;padding:20px;border-bottom:1px solid #ddd}
#m{display:none}
</style></head><body><main>
<h1>Модалка появляется после скролла</h1>
<p>При загрузке страница чистая и содержательная, поэтому первая проверка её пропускает. Оверлей возникает только после прокрутки.</p>
${Array.from({ length: 10 }, (_, i) => `<section><h2>Секция ${i + 1}</h2><p>Контент секции номер ${i + 1} для высоты и ленивых триггеров.</p></section>`).join("\n")}
</main>
<div id="m" role="dialog" style="position:fixed;left:0;right:0;top:18%;height:50vh;z-index:9999;background:#fff;padding:24px;border:1px solid #ccc">
<p>We use cookies and want to show you a subscription offer after you scroll.</p>
<button style="min-height:44px;padding:8px 20px">Настроить</button>
</div>
<script>window.addEventListener('scroll', function(){ if (window.scrollY > 200) document.getElementById('m').style.display = 'block'; });</script>
</body></html>`;

const MOBILE_MODAL = `<!doctype html><html lang="ru"><head><meta charset="utf-8"><title>mobile modal</title><style>
body{margin:0;font:17px/1.6 sans-serif;color:#141414}main{max-width:900px;margin:0 auto;padding:32px}
h1{font-size:40px;color:#2E5B3F}p{max-width:70ch}
#m{display:none;position:fixed;left:0;right:0;top:18%;height:50vh;z-index:9999;background:#fff;padding:24px;border:1px solid #ccc}
@media (max-width: 600px){ #m{display:block} }
</style></head><body><main>
<h1>Оверлей только на мобильном viewport</h1>
<p>Десктоп чист: все проверки вплоть до mobile-этапа проходят. На 390px появляется cookie-баннер, который нельзя закрыть.</p>
<p>Здесь достаточно содержательного текста про продукт, процесс и подход, чтобы первый экран считался наполненным на обоих viewport.</p>
</main>
<div id="m" role="dialog"><p>We use cookies on mobile.</p><button style="min-height:44px;padding:8px 20px">Настроить</button></div>
</body></html>`;

const BRIEF = `# BRIEF\n\nPROJECT_MODE: CONCEPT\n\n## Факты\nПродукт X, Москва, showcase. Аудитория — частные заказчики и дизайнеры интерьеров. Фото: 12 проектов.\n\n## Неизвестное\n[цены] [сроки] [адрес] [метрики]\n\n## Маршруты\nhome — показать уровень; listing — проекты; contact — написать нам.\n\n## Анти-качества\nЗапрещены шаблонный split hero, пустые плоскости, фиолетовые градиенты.\n`;

// ---------- подготовка ----------
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// на Windows удаление папки сразу после kill() серверов может поймать EPERM — ретраим
async function rmWs() {
  for (let i = 0; i < 8; i++) {
    try { fs.rmSync(ws, { recursive: true, force: true }); return true; }
    catch { await sleep(300); }
  }
  return fs.existsSync(ws);
}
if (!(await rmWs())) {
  console.error(`Не удаётся очистить ${ws} — её держит другой процесс (обычно забытый сервер прошлого прогона).`);
  process.exit(1);
}
fs.mkdirSync(path.join(ws, "html"), { recursive: true });
fs.writeFileSync(path.join(ws, "html", "good.html"), GOOD);
fs.writeFileSync(path.join(ws, "html", "bad.html"), BAD);
fs.writeFileSync(path.join(ws, "html", "empty.html"), EMPTY);
fs.writeFileSync(path.join(ws, "html", "long.html"), LONG);
fs.writeFileSync(path.join(ws, "html", "cookie.html"), COOKIE);
fs.writeFileSync(path.join(ws, "html", "captcha.html"), CAPTCHA);
fs.writeFileSync(path.join(ws, "html", "modal.html"), MODAL);
fs.writeFileSync(path.join(ws, "html", "late-modal.html"), LATE_MODAL);
fs.writeFileSync(path.join(ws, "html", "mobile-modal.html"), MOBILE_MODAL);

// локальные серверы: A редиректит на «чужой» хост, B отдаёт good.html
const srvRedirect = spawn(process.execPath, ["-e",
  `require('http').createServer((q,s)=>{s.writeHead(302,{Location:'http://localhost:${PORT_B}/good.html'});s.end();}).listen(${PORT_A},'127.0.0.1')`], { stdio: "ignore" });
const srvStatic = spawn(process.execPath, ["-e",
  `const http=require('http'),fs=require('fs'),path=require('path');const root=process.argv[1];
   http.createServer((q,s)=>{const u=q.url.split('?')[0];const name=u==='/'?'good.html':u.slice(1);
   const p=path.join(root,name);fs.readFile(p,(e,d)=>{if(e){s.writeHead(404);s.end('nf');}else{s.writeHead(200,{'Content-Type':'text/html; charset=utf-8'});s.end(d);}});}).listen(${PORT_B},'localhost')`,
  path.join(ws, "html")], { stdio: "ignore" });
await new Promise((r) => setTimeout(r, 900));

const results = [];
function run(name, cmd, args, expectExit, cwd = ws) {
  const r = spawnSync(cmd, args, { cwd, encoding: "utf8", shell: false });
  const tail = (r.stdout || "").trim().split("\n").slice(-2).join(" | ");
  const pass = r.status === expectExit;
  results.push([pass ? "PASS" : "FAIL", name, `exit ${r.status} (ожидался ${expectExit})${pass ? "" : " :: " + (tail || (r.stderr || "").trim().slice(0, 250))}`]);
  return r;
}
function check(name, cond, info) {
  results.push([cond ? "PASS" : "FAIL", name, info]);
}
const fu = (p) => pathToFileURL(path.join(ws, p)).href;
const wj = (p, o) => fs.writeFileSync(path.join(ws, p), typeof o === "string" ? o : JSON.stringify(o, null, 1));

// ---------- захват ----------
run("capture file: good → 0", process.execPath, [path.join(scoutScripts, "capture.mjs"), "file", "html/good.html", "--out", "shots"], 0);
run("capture file: empty → 2", process.execPath, [path.join(scoutScripts, "capture.mjs"), "file", "html/empty.html", "--out", "shots"], 2);
run("board: борд → 0", process.execPath, [path.join(scoutScripts, "board.mjs"), "shots", "--out", "board.png", "--cols", "2"], 0);
run("board --media: manifest совместим с Direction → 0", process.execPath, [path.join(scoutScripts, "board.mjs"), "--media", "shots", "--out", "media-auto"], 0);
try {
  const manifest = JSON.parse(fs.readFileSync(path.join(ws, "media-auto/project-media.json"), "utf8"));
  const compatible = Array.isArray(manifest.media) && manifest.media.length > 0 && manifest.media.every((m) => m.path && m.source && m.usage);
  check("board --media: есть media[].path/source/usage", compatible, `media=${Array.isArray(manifest.media) ? manifest.media.length : "missing"}`);
} catch (e) { check("board --media: есть media[].path/source/usage", false, String(e.message)); }

wj("live-redirect.json", [{ name: "redir", url: `http://127.0.0.1:${PORT_A}/`, pageType: "home", mobile: true }]);
run("capture urls: редирект на чужой хост → 2", process.execPath, [path.join(scoutScripts, "capture.mjs"), "urls", "--list", "live-redirect.json", "--out", "live"], 2);
try {
  const cap = JSON.parse(fs.readFileSync(path.join(ws, "live", "captures.json"), "utf8"));
  check("capture urls: причина = redirect", /redirect/.test((cap.items[0].reasons || []).join(" ")), `reasons: ${(cap.items[0].reasons || []).join(", ")}`);
} catch (e) { check("capture urls: причина = redirect", false, String(e.message)); }

wj("live-good.json", [{ name: "live-good", url: `http://localhost:${PORT_B}/good.html`, mobile: true }]);
run("capture urls: живая страница → 0 (DOM+raster+mobile)", process.execPath, [path.join(scoutScripts, "capture.mjs"), "urls", "--list", "live-good.json", "--out", "live"], 0);
try {
  const cap = JSON.parse(fs.readFileSync(path.join(ws, "live", "captures.json"), "utf8"));
  const links = cap.items[0].links || [];
  const withNavFlag = links.every((l) => typeof l.inNav === "boolean");
  check("capture urls: links сохранены с флагом inNav", links.length >= 2 && withNavFlag, `ссылок: ${links.length}, inNav у всех: ${withNavFlag}`);
} catch (e) { check("capture urls: links сохранены с флагом inNav", false, String(e.message)); }

// links-режим: витрина-заглушка со ссылкой на «оригинал» (другой хост localhost↔127.0.0.1)
wj("html/hub.html", `<!doctype html><html><head><meta charset="utf-8"><title>витрина</title></head><body><h1>Витрина</h1><main><a href="http://127.0.0.1:${PORT_B}/good.html">Оригинал №1</a><a href="http://127.0.0.1:${PORT_B}/bad.html">Оригинал №2</a></main></body></html>`);
run("links: внешние ссылки с витрины → 0", process.execPath, [path.join(scoutScripts, "capture.mjs"), "links", `http://localhost:${PORT_B}/hub.html`, "--mode", "external", "--out", "hub-links.json"], 0);
try {
  const h = JSON.parse(fs.readFileSync(path.join(ws, "hub-links.json"), "utf8"));
  const orig = h.links.filter((l) => /127\.0\.0\.1/.test(l.href));
  check("links: найдены ссылки на оригиналы", orig.length === 2, `внешних ссылок: ${h.count}, на оригиналы: ${orig.length}`);
} catch (e) { check("links: найдены ссылки на оригиналы", false, String(e.message)); }

// честные first-кадры: scrollY=0 после warmScroll, закрываемый cookie, неустранимые оверлеи
wj("ok-pages.json", [
  { name: "long-page", url: `http://localhost:${PORT_B}/long.html`, pageType: "home", mobile: true },
  { name: "cookie-page", url: `http://localhost:${PORT_B}/cookie.html`, pageType: "home", mobile: true },
]);
run("capture urls: длинная+cookie → 0", process.execPath, [path.join(scoutScripts, "capture.mjs"), "urls", "--list", "ok-pages.json", "--out", "live2"], 0);
try {
  const c = JSON.parse(fs.readFileSync(path.join(ws, "live2", "captures.json"), "utf8"));
  const L = c.items[0], K = c.items[1];
  check("first-кадр снят при scrollY=0 (+viewport в отчёте)",
    L.status === "ok" && L.firstViewport && L.firstViewport.scrollY <= 2 && L.firstViewport.viewportWidth === 1440,
    `scrollY=${L.firstViewport && L.firstViewport.scrollY}, vw=${L.firstViewport && L.firstViewport.viewportWidth}`);
  check("cookie ACCEPT ALL закрылся (overlays=0 в ok-захвате)",
    K.status === "ok" && K.dom && K.dom.overlays === 0,
    `status=${K.status}, overlays=${K.dom && K.dom.overlays}`);
} catch (e) { check("first-кадр scrollY / cookie", false, String(e.message)); }

wj("fail-pages.json", [
  { name: "captcha-page", url: `http://localhost:${PORT_B}/captcha.html`, pageType: "home", mobile: true },
  { name: "modal-page", url: `http://localhost:${PORT_B}/modal.html`, pageType: "home", mobile: true },
]);
run("capture urls: captcha/модалка → 2", process.execPath, [path.join(scoutScripts, "capture.mjs"), "urls", "--list", "fail-pages.json", "--out", "live3"], 2);
try {
  const c = JSON.parse(fs.readFileSync(path.join(ws, "live3", "captures.json"), "utf8"));
  const C = c.items[0], M = c.items[1];
  check("captcha → fail (bot-challenge), без desktopFirst",
    C.status === "fail" && /bot-challenge|blocking-overlay/.test((C.reasons || []).join(" ")) && !C.files.desktopFirst,
    `reasons=${(C.reasons || []).join(",")}; desktopFirst=${!!C.files.desktopFirst}`);
  check("неустранимая модалка → blocking-overlay, без desktopFirst",
    M.status === "fail" && (M.reasons || []).some((r) => /blocking-overlay/.test(r)) && !M.files.desktopFirst,
    `reasons=${(M.reasons || []).join(",")}; desktopFirst=${!!M.files.desktopFirst}`);
} catch (e) { check("captcha/модалка", false, String(e.message)); }

// повторные проверки overlays: модалка после скролла и оверлей только на 390px
wj("late-fail.json", [{ name: "late-modal", url: `http://localhost:${PORT_B}/late-modal.html`, pageType: "home", mobile: true }]);
run("capture urls: модалка после скролла → 2", process.execPath, [path.join(scoutScripts, "capture.mjs"), "urls", "--list", "late-fail.json", "--out", "live4"], 2);
try {
  const c = JSON.parse(fs.readFileSync(path.join(ws, "live4", "captures.json"), "utf8"));
  const L = c.items[0];
  check("модалка после скролла → blocking-overlay, без desktopFirst",
    L.status === "fail" && (L.reasons || []).some((r) => /blocking-overlay|bot-challenge/.test(r)) && !L.files.desktopFirst && !L.files.desktopFull,
    `reasons=${(L.reasons || []).join(",")}; desktopFirst=${!!L.files.desktopFirst}`);
} catch (e) { check("модалка после скролла", false, String(e.message)); }

wj("mobile-fail.json", [{ name: "mobile-modal", url: `http://localhost:${PORT_B}/mobile-modal.html`, pageType: "home", mobile: true }]);
run("capture urls: оверлей только на 390px → 2", process.execPath, [path.join(scoutScripts, "capture.mjs"), "urls", "--list", "mobile-fail.json", "--out", "live5"], 2);
try {
  const c = JSON.parse(fs.readFileSync(path.join(ws, "live5", "captures.json"), "utf8"));
  const M = c.items[0];
  check("оверлей на 390px → mobile-blocking-overlay, без mobile-first",
    M.status === "fail" && (M.reasons || []).some((r) => /mobile-blocking-overlay|mobile-bot-challenge/.test(r)) && !M.files.mobile,
    `reasons=${(M.reasons || []).join(",")}; mobile=${!!M.files.mobile}`);
} catch (e) { check("оверлей на 390px", false, String(e.message)); }

// чистая responsive-страница остаётся ok: финальные desktop/mobile проверки без оверлеев
try {
  const c = JSON.parse(fs.readFileSync(path.join(ws, "live", "captures.json"), "utf8"));
  const G = c.items[0];
  check("чистая responsive-страница: dom/mobileDom overlays=0, кадры записаны",
    G.status === "ok" && G.dom && G.dom.overlays === 0 && G.mobileDom && G.mobileDom.overlays === 0
      && !!G.files.desktopFirst && !!G.files.mobile,
    `dom.ov=${G.dom && G.dom.overlays}, mobileDom.ov=${G.mobileDom && G.mobileDom.overlays}, files=${!!G.files.desktopFirst}/${!!G.files.mobile}`);
} catch (e) { check("чистая responsive-страница", false, String(e.message)); }

// ---------- аудит ----------
wj("routes.json", { routes: [{ name: "good", path: fu("html/good.html") }, { name: "bad", path: fu("html/bad.html") }] });
run("audit: bad page → FAIL(2)", process.execPath, [path.join(here, "audit.mjs"), "--config", "routes.json"], 2);
try {
  const a = JSON.parse(fs.readFileSync(path.join(ws, ".design/qa/run-01/audit.json"), "utf8"));
  const badP0 = (a.p0 || []).filter((x) => x.startsWith("bad")).length;
  const goodClean = ["p0", "p1", "p2"].every((k) => (a[k] || []).every((x) => x.startsWith("bad")));
  check("audit: good чист, bad с P0", badP0 >= 3 && goodClean, `P0 у bad: ${badP0}; ложных у good: ${goodClean ? 0 : "есть"}`);
} catch (e) { check("audit: good чист, bad с P0", false, String(e.message)); }

// QA-бюджет по циклам
wj("routes-good.json", { routes: [{ name: "good", path: fu("html/good.html") }] });
run("audit cycle t1: прогон 1 → 0", process.execPath, [path.join(here, "audit.mjs"), "--config", "routes-good.json", "--cycle", "t1"], 0);
run("audit cycle t1: прогон 2 → 0", process.execPath, [path.join(here, "audit.mjs"), "--config", "routes-good.json", "--cycle", "t1"], 0);
run("audit cycle t1: прогон 3 → 3 (бюджет)", process.execPath, [path.join(here, "audit.mjs"), "--config", "routes-good.json", "--cycle", "t1"], 3);
run("audit cycle t2: новый цикл → 0", process.execPath, [path.join(here, "audit.mjs"), "--config", "routes-good.json", "--cycle", "t2"], 0);

// ---------- гейты ----------
run("gate: опечатка стадии → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "relase"], 1);
run("gate: brief отсутствует → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "brief"], 1);
run("gate: поздний direction не обходит отсутствующий brief → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 1);
wj(".design/BRIEF.md", BRIEF);
run("gate: валидный brief → 0", process.execPath, [path.join(here, "gate.mjs"), "--stage", "brief"], 0);
wj(".design/BRIEF.md", BRIEF.replace("PROJECT_MODE: CONCEPT", "PROJECT_MODE: COMMISSIONED") + "\nНеподтверждённые данные остаются [полями].\n");
fs.mkdirSync(path.join(ws, ".design/client-source"), { recursive: true });
wj(".design/client-source/CLIENT_SOURCE.md", "# CLIENT SOURCE\n\nSOURCE_STATUS: SOURCE_UNAVAILABLE\nSOURCE_READINESS: UNAVAILABLE\nMEDIA_READINESS: NOT_PRESENT\n\nИсточник недоступен. Неизвестное остаётся [полем].\n");
run("gate: commissioned brief допускает незавершённый intake → 0", process.execPath, [path.join(here, "gate.mjs"), "--stage", "brief"], 0);
const preDesign = run("gate: commissioned direction блокируется до client readiness → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 1);
check("gate: причина PRE_DESIGN_NOT_READY наблюдаема", /PRE_DESIGN_NOT_READY/.test((preDesign.stdout || "") + (preDesign.stderr || "")), "ожидается точная причина незавершённого client intake");
fs.rmSync(path.join(ws, ".design/client-source"), { recursive: true, force: true });
wj(".design/BRIEF.md", BRIEF);

// research gate: валидный fixture — 8 уникальных home-кандидатов,
// из них 4 финалиста с mobile home + 2 inner; честные first-кадры; Источник в каждой секции
const CAPDOMS = ["a.ru", "b.com", "c.de", "d.io", "e.org", "f.net", "g.co", "h.io"]; // первые 4 — финалисты
const mkCaptures = () => {
  const items = [];
  CAPDOMS.forEach((d, i) => {
    const finalist = i < 4;
    const home = { name: d + "-home", url: `https://${d}/`, finalUrl: `https://${d}/`, pageType: "home", status: "ok",
      dom: { overlays: 0 },
      firstViewport: { scrollY: 0, viewportWidth: 1440, viewportHeight: 1000 },
      files: { desktopFirst: `.design/research/references/${d}-home-d.png` } };
    home.mobileViewport = { scrollY: 0, viewportWidth: 390, viewportHeight: 844 };
    home.mobileDom = { overlays: 0 };
    home.files.mobile = `.design/research/references/${d}-home-m.png`;
    items.push(home);
    if (finalist) {
      for (const inner of ["works", "about"]) {
        items.push({ name: `${d}-inner-${inner}`, url: `https://${d}/${inner}`, finalUrl: `https://${d}/${inner}`, pageType: "inner", status: "ok",
          dom: { overlays: 0 },
          firstViewport: { scrollY: 0, viewportWidth: 1440, viewportHeight: 1000 },
          files: { desktopFirst: `.design/research/references/${d}-${inner}-d.png` } });
      }
    }
  });
  return { items };
};
fs.mkdirSync(path.join(ws, ".design/research/references"), { recursive: true });
fs.mkdirSync(path.join(ws, ".design/research/fragments"), { recursive: true });
for (const it of mkCaptures().items) {
  for (const k of ["desktopFirst", "mobile"]) if (it.files[k]) fs.writeFileSync(path.join(ws, it.files[k]), PNG1X);
}
for (let i = 1; i <= 8; i++) fs.writeFileSync(path.join(ws, `.design/research/references/r${i}.png`), PNG1X);
for (let i = 1; i <= 8; i++) fs.writeFileSync(path.join(ws, `.design/research/fragments/f${i}.png`), PNG1X);
const boardScript = path.join(scoutScripts, "board.mjs");
wj(".design/research/references/captures.json", mkCaptures());
run("board pool: home/desktopFirst из отчёта → 0", process.execPath, [boardScript, "--captures", ".design/research/references/captures.json", "--page-type", "home", "--variant", "desktopFirst", "--out", ".design/research/board-pool.png"], 0);
run("board deep: inner/desktopFirst из отчёта → 0", process.execPath, [boardScript, "--captures", ".design/research/references/captures.json", "--page-type", "inner", "--variant", "desktopFirst", "--out", ".design/research/board-finalists-deep.png"], 0);
run("board fragments → 0", process.execPath, [boardScript, ".design/research/fragments", "--out", ".design/research/board-fragments.png", "--cols", "4"], 0);

// смешанный captures.json: board обязан взять только home/desktopFirst
const all = mkCaptures().items;
wj("mixed-captures.json", { items: [all[0], all[1], all[2]] }); // home(a.ru), inner-works(a.ru), inner-about(a.ru)
run("board --captures: смешанный отчёт → 0", process.execPath, [boardScript, "--captures", "mixed-captures.json", "--page-type", "home", "--variant", "desktopFirst", "--out", "mixed-board.png"], 0);
try {
  const r = JSON.parse(fs.readFileSync(path.join(ws, "mixed-board.png.report.json"), "utf8"));
  const pure = r.count === 1 && r.items.every((i) => i.pageType === "home") && r.items[0].name === "a.ru-home";
  check("board из mixed: только home/desktopFirst", pure, `count=${r.count}, типы: ${r.items.map((i) => i.pageType).join(",")}`);
} catch (e) { check("board из mixed: только home/desktopFirst", false, String(e.message)); }
const REF = (src3 = true) => `## a.ru\nURL. Источник: запрос «мебель Москва». Берём сетку.\n## b.com\nURL. Источник: SiteInspire. Берём hero.\n## c.de\nURL. ${src3 ? "Источник: статья." : "Берём detail."} Берём detail.\n## d.io\nURL. Источник: поиск. Берём mobile.\n`;
wj(".design/research/DISCOVERY.md", Array.from({ length: 20 }, (_, i) => `## Candidate ${i + 1}\n- URL: https://candidate-${i + 1}.example/site\n- Source: commercial search query ${i + 1}\n- Decision: ${i < 12 ? "screen — визуально проверяем" : "reject — слабая иерархия"}\n`).join("\n"));
const poolRegistry = { candidates: CAPDOMS.map((domain, i) => ({
  name: `Candidate ${i + 1}`,
  domain,
  url: `https://${domain}/`,
  sourceType: "commercial-search",
  sourceDetail: `Запрос мебель на заказ, позиция ${i + 1}`,
  observedFirstViewport: "Ясный визуальный центр, доминирующее фото и читаемая иерархия",
  observedMobile: "Mobile перекомпонован в одну колонку без горизонтального overflow",
  internalRoutes: [`https://${domain}/works`, `https://${domain}/about`],
  transferableMechanism: "Наблюдаемый механизм подачи продукта и следующего шага"
})) };
wj(".design/research/POOL.json", poolRegistry);
run("gate research-pool: валидный → 0", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research-pool"], 0);
run("gate research: без пользовательского выбора → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/POOL_SELECTION.json", {
  source: "user",
  decision: "continue",
  approved: ["a.ru", "b.com"],
  rejected: ["h.io"],
  neutral: ["c.de", "d.io", "e.org", "f.net", "g.co"],
  note: "Пользователь выбрал два близких направления и отклонил один слабый первый экран."
});
wj(".design/research/REFERENCES.md", REF(true));
const finalistRegistry = { finalists: [
  { name: "A", domain: "a.ru", role: "visual-anchor", lane: "market", relevance: "same-niche", coverage: ["home", "listing", "detail", "mobile"], observedReason: "Единая композиция продукта сохраняется на главной, листинге, detail и mobile." },
  { name: "B", domain: "b.com", role: "product-system", lane: "product-craft", relevance: "adjacent-product", coverage: ["home", "listing", "detail", "mobile"], observedReason: "Фотографии, параметры и материалы образуют последовательную продуктовую систему на всех кадрах." },
  { name: "C", domain: "c.de", role: "art-direction", lane: "curated", relevance: "adjacent-craft", coverage: ["home", "listing", "detail", "mobile"], observedReason: "Один характерный композиционный приём подтверждён на главной, внутренних страницах и mobile." },
  { name: "D", domain: "d.io", role: "commercial-ux", lane: "market", relevance: "same-niche", coverage: ["home", "listing", "detail", "mobile"], observedReason: "Оффер, доказательства и заявка образуют ясный локальный коммерческий маршрут на всех кадрах." }
] };
wj(".design/research/FINALISTS.json", finalistRegistry);
const fragSources = ["a.ru-home-d.png", "a.ru-works-d.png", "a.ru-about-d.png", "b.com-home-d.png", "b.com-works-d.png", "b.com-about-d.png", "a.ru-home-d.png", "b.com-home-d.png"];
const validFragTypes = ["media", "media", "composition", "composition", "type", "commercial", "mobile", "interaction"];
const fragmentsMd = (types = validFragTypes) => fragSources.map((src, i) => `## F${String(i + 1).padStart(2, "0")}\nФайл: f${i + 1}.png\nТип: ${types[i]}\nЗаявлено: сетка\nИсточник: ${src}\nЧто видно: сетка и контентная иерархия\n`).join("\n");
wj(".design/research/FRAGMENTS.md", fragmentsMd());
wj(".design/SYNTHESIS.md", "# Synthesis\n\nТезис: правда бизнеса → ощущение → поведение. Ядро: сетка, типографика, воздух и предметные фотографии.\n\n## Визуальный якорь\nA связывает home, listing, detail и mobile общей ролью фотографии и навигации без буквального копирования.\n\n## Ограничение влияния\nArt-direction источник C не определяет весь UX-каркас, все поля и все страницы; он даёт только один характерный приём.\n\nПоверхности связаны с фрагментами F01–F08.\n");
wj(".design/research/references/captures.json", mkCaptures());
run("gate research: валидный → 0", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 0);

const noAnchor = JSON.parse(JSON.stringify(finalistRegistry));
noAnchor.finalists[0].role = "composition";
wj(".design/research/FINALISTS.json", noAnchor);
run("gate research: нет visual-anchor → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/FINALISTS.json", finalistRegistry);

const craftBias = JSON.parse(JSON.stringify(finalistRegistry));
craftBias.finalists[1].relevance = "adjacent-craft";
craftBias.finalists[1].lane = "craft";
wj(".design/research/FINALISTS.json", craftBias);
run("gate research: два adjacent-craft финалиста → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/FINALISTS.json", finalistRegistry);

wj(".design/research/FRAGMENTS.md", fragmentsMd(Array(8).fill("composition")));
run("gate research: только композиционные фрагменты → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/FRAGMENTS.md", fragmentsMd());

// негатив: у d.io home без mobile-файла
fs.rmSync(path.join(ws, ".design/research/references/d.io-home-m.png"));
run("gate research: нет mobile у home → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
fs.writeFileSync(path.join(ws, ".design/research/references/d.io-home-m.png"), "x");

// негатив: home-URL дублирует inner (уникальных home нет)
const dup = mkCaptures();
dup.items = dup.items.map((it) => (it.name === "d.io-home" ? { ...it, url: "https://d.io/works", finalUrl: "https://d.io/works" } : it));
wj(".design/research/references/captures.json", dup);
run("gate research: дубликат URL вместо home → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/references/captures.json", mkCaptures());

// негатив: у финалиста осталась только одна inner → FAIL
const one = mkCaptures();
one.items = one.items.filter((it) => it.name !== "d.io-inner-about");
wj(".design/research/references/captures.json", one);
run("gate research: одна inner у финалиста → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/references/captures.json", mkCaptures());

// негатив: status ok, но dom.overlays=1 (cookie/CAPTCHA в кадре) → FAIL
const ov = mkCaptures();
ov.items[0].dom.overlays = 1;
wj(".design/research/references/captures.json", ov);
run("gate research: overlays=1 при ok → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/references/captures.json", mkCaptures());

// негатив: mobile-кадр с остаточным overlay (mobileDom.overlays=1) → FAIL
const mov = mkCaptures();
mov.items[0].mobileDom.overlays = 1;
wj(".design/research/references/captures.json", mov);
run("gate research: mobileDom.overlays=1 → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/references/captures.json", mkCaptures());

// негатив: 7 home-кандидатов (борд пересобран из 7) → FAIL по пулу
const seven = mkCaptures();
seven.items = seven.items.filter((it) => it.name !== "h.io-home");
wj(".design/research/references/captures.json", seven);
run("board pool из 7 кандидатов → 0 (пересборка)", process.execPath, [boardScript, "--captures", ".design/research/references/captures.json", "--page-type", "home", "--variant", "desktopFirst", "--out", ".design/research/board-pool.png"], 0);
run("gate research: 7 home-кандидатов → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/references/captures.json", mkCaptures());
run("board pool из 8 кандидатов → 0 (восстановление)", process.execPath, [boardScript, "--captures", ".design/research/references/captures.json", "--page-type", "home", "--variant", "desktopFirst", "--out", ".design/research/board-pool.png"], 0);

// негатив: секция без «Источника»
wj(".design/research/REFERENCES.md", REF(false));
run("gate research: секция без «Источник» → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "research"], 1);
wj(".design/research/REFERENCES.md", REF(true));

// direction gate: реальные media, 3 различимых контракта и сравнительное review
fs.mkdirSync(path.join(ws, ".design/style-lab/shots"), { recursive: true });
fs.mkdirSync(path.join(ws, ".design/media"), { recursive: true });
fs.mkdirSync(path.join(ws, "public/images"), { recursive: true });
const media = Array.from({ length: 4 }, (_, i) => ({ path: `public/images/media-${i + 1}.png`, source: `https://images.example/${i + 1}`, usage: "demo" }));
for (const m of media) fs.writeFileSync(path.join(ws, m.path), PNG1X);
wj(".design/media/project-media.json", { media });
fs.writeFileSync(path.join(ws, ".design/media/project-media-board.png"), PNG1X);

const conceptHtml = (i) => `<!-- TOKENS: bg #fff, ink #141414, accent #${i}${i}5B3F; display Serif${i}; body Sans 17/1.6; spacing 4 8 16 32; radius ${i}px; motion 240ms -->
<!doctype html><html lang="ru"><body><main><h1>Концепт ${i}</h1><img src="/images/media-${i}.png" alt="Мебель"><img src="/images/media-4.png" alt="Интерьер"><section>Listing</section><section>Detail</section><section>Calculator</section></main></body></html>`;
for (let i = 1; i <= 3; i++) {
  fs.writeFileSync(path.join(ws, `.design/style-lab/concept-${i}.html`), conceptHtml(i));
  for (const view of ["desktop-first", "mobile-first", "listing", "detail"]) {
    fs.writeFileSync(path.join(ws, `.design/style-lab/shots/concept-${i}-${view}.png`), PNG1X);
  }
}
fs.writeFileSync(path.join(ws, ".design/style-lab/concept-board.png"), PNG1X);
fs.writeFileSync(path.join(ws, ".design/style-lab/reference-trace-board.png"), PNG1X);
const sourceTransfers = (...ids) => ids.map((fragment) => ({
  fragment,
  observedRelation: "На исходном PNG доминирующее медиа связано с коротким тезисом и одним следующим действием.",
  transfer: "Переносится отношение масштаба медиа к тезису и порядок чтения, а не внешний стиль сайта.",
  mutation: "Отношение перестроено под русскоязычный brief, реальные project media и отдельную mobile-композицию."
}));
const contracts = {
  concepts: [
    { id: "concept-1", designQuestion: "Может ли один интерьерный кадр сразу объяснить масштаб индивидуального решения и привести к действию?", archetype: "архитектурная рамка и спокойный маршрут", compositionFamily: "неравная двухчастная рама с медиаполем и отдельной последовательной колонкой действия", sourceFragments: ["F01", "F02"], sourceTransfers: sourceTransfers("F01", "F02"), heroGeometry: "панорама внутри глубокой внешней рамы", navigationModel: "верхняя тихая навигация по ключевым задачам", contentRhythm: "редкие крупные кадры чередуются с короткими доказательствами", mediaRole: "фотография показывает связь мебели с геометрией комнаты", typeSystem: "плотный гротеск display и нейтральный текстовый гротеск", colorStrategy: "холодная минеральная база и один красный служебный акцент", signatureElement: "координатный шов связывает чертёж и готовый интерьер" },
    { id: "concept-2", designQuestion: "Может ли последовательность общего плана и детали объяснить качество решения без каталога характеристик?", archetype: "кинематографический маршрут по материалу", compositionFamily: "полноширинное медиаполе с нижней полкой и последовательными горизонтальными сценами", sourceFragments: ["F03", "F04"], sourceTransfers: sourceTransfers("F03", "F04"), heroGeometry: "полноэкранный кадр с нижней информационной полкой", navigationModel: "боковой индекс раскрывает этапы проектирования", contentRhythm: "плотный первый акт сменяется горизонтальным архивом объектов", mediaRole: "макро и общий план последовательно доказывают качество материала", typeSystem: "контрастная антиква для тезиса и узкий гротеск для данных", colorStrategy: "тёмная древесная база и спокойный светлый текст без ярких акцентов", signatureElement: "движущаяся линия стыка раскрывает материал и конструкцию" },
    { id: "concept-3", designQuestion: "Поможет ли сравнительная рабочая поверхность быстро выбрать тип решения и перейти к разбору проекта?", archetype: "рабочий каталог решений для архитектора", compositionFamily: "асимметричная матрица из общего кадра, узла и компактной сравнительной спецификации", sourceFragments: ["F05", "F06"], sourceTransfers: sourceTransfers("F05", "F06"), heroGeometry: "асимметричный коллаж из общего плана и узла", navigationModel: "фиксированный нижний индекс по типам помещений", contentRhythm: "компактные спецификации прерываются высокими галерейными окнами", mediaRole: "изображение работает как аннотированная карточка решения", typeSystem: "широкий гуманистический гротеск и моноширинные спецификации", colorStrategy: "светлая бумажная база и природный зелёный код разделов", signatureElement: "интерактивный образец фасада управляет каталогом решений" }
  ]
};
wj(".design/style-lab/DIRECTION_CONTRACTS.json", contracts);
const review = {
  reviewerMode: "independent-read-only",
  evidence: Array.from({ length: 3 }, (_, i) => [`.design/style-lab/shots/concept-${i + 1}-desktop-first.png`, `.design/style-lab/shots/concept-${i + 1}-mobile-first.png`]).flat(),
  referenceEvidence: [".design/research/fragments/f1.png", ".design/research/fragments/f3.png", ".design/research/fragments/f5.png"],
  concepts: [
    { id: "concept-1", observedStrength: "Самая ясная иерархия оффера и действия на desktop и mobile.", observedWeakness: "Красная координатная линия может выглядеть слишком технической для частного клиента.", referenceFit: "На output действительно виден перенос масштаба F01 и короткого маршрута F02 без буквального копирования сетки.", genericityRisk: "Риск готового split-hero снижен неравной рамой, но приём требует проверки на следующей странице.", verdict: "advance" },
    { id: "concept-2", observedStrength: "Фотография получает максимальный эмоциональный вес и хорошо продаёт фактуру.", observedWeakness: "Тёмная полка местами конкурирует с предметом и требует более тихой типографики.", referenceFit: "Связь общего плана F03 и detail F04 читается, но порядок действий пока слабее источника.", genericityRisk: "Полноэкранное фото может стать обычным luxury-шаблоном без более специфичной продуктовой связи.", verdict: "rework" },
    { id: "concept-3", observedStrength: "Связь материалов и решений считывается последовательно на внутренних поверхностях.", observedWeakness: "Каталожная логика делает первый экран менее эмоциональным и слишком служебным.", referenceFit: "Коммерческий порядок F05 и proof F06 перенесены, но визуальный центр output заметно слабее фрагментов.", genericityRisk: "Табличные линии и зелёный код складываются в узнаваемый AI-default и требуют отказа.", verdict: "reject" }
  ],
  recommended: "concept-1",
  weakest: "concept-3",
  sharedMotifs: ["Во всех направлениях повторяются тонкие разделители, их нужно ослабить у победителя."],
  decision: "READY_FOR_USER_SELECTION"
};
wj(".design/style-lab/DIRECTION_REVIEW.json", review);
run("gate direction: готово к выбору без ACCEPTED → 0", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 0);
wj(".design/DESIGN_TOKENS.md", "# TOKENS\nЦвет: bg #fff, ink #141414, accent #2E5B3F. Типографика: display, body 17/1.6. Шкала 4..128. Движение: один reveal 400ms, reduced-motion.\n");
wj(".design/ACCEPTED.md", "Выбран concept-1: ясная иерархия, доказательная фотография и сильный mobile.\n");
run("gate direction: выбор+финальные токены → 0", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 0);

fs.writeFileSync(path.join(ws, ".design/style-lab/concept-2.html"), "<h1>Концепт 2 без токенов</h1><p>PHOTO SLOT</p>");
run("gate direction: концепт без TOKENS → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 1);
fs.writeFileSync(path.join(ws, ".design/style-lab/concept-2.html"), conceptHtml(2));

fs.writeFileSync(path.join(ws, ".design/style-lab/concept-2.html"), conceptHtml(2).replace("<h1>", "<p>PHOTO SLOT</p><h1>"));
run("gate direction: PHOTO SLOT → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 1);
fs.writeFileSync(path.join(ws, ".design/style-lab/concept-2.html"), conceptHtml(2));

const duplicateContracts = JSON.parse(JSON.stringify(contracts));
for (const key of ["heroGeometry", "navigationModel", "contentRhythm", "mediaRole", "typeSystem", "colorStrategy", "signatureElement"]) duplicateContracts.concepts[1][key] = duplicateContracts.concepts[0][key];
wj(".design/style-lab/DIRECTION_CONTRACTS.json", duplicateContracts);
run("gate direction: одинаковая грамматика контрактов → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 1);
wj(".design/style-lab/DIRECTION_CONTRACTS.json", contracts);

const rubberStamp = JSON.parse(JSON.stringify(review));
rubberStamp.concepts.forEach((c) => { c.verdict = "advance"; });
wj(".design/style-lab/DIRECTION_REVIEW.json", rubberStamp);
run("gate direction: reviewer принял все три → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 1);
wj(".design/style-lab/DIRECTION_REVIEW.json", review);

wj(".design/media/project-media.json", { media: media.slice(0, 3) });
run("gate direction: недостаточно реальных media → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "direction"], 1);
wj(".design/media/project-media.json", { media });

// cumulative targets/build prerequisites for release checks
fs.mkdirSync(path.join(ws, ".design/targets/shots"), { recursive: true });
wj(".design/ROUTE_CONTRACTS.md", "# Routes\n\n## Home\nГлавная: вопрос клиента, доказательство, визуальный центр и действие. Mobile приоритетен.\n\n## Listing\nКаталог: выбор категории, доказательство, визуальный центр и переход в detail. Mobile приоритетен.\n");
for (const target of ["home", "listing"]) {
  fs.writeFileSync(path.join(ws, `.design/targets/${target}.html`), `<!doctype html><html lang="ru"><body><main><h1>${target}</h1></main></body></html>`);
  fs.writeFileSync(path.join(ws, `.design/targets/shots/${target}-desktop.png`), PNG1X);
  fs.writeFileSync(path.join(ws, `.design/targets/shots/${target}-mobile.png`), PNG1X);
}

// release gate: P1 блокирует, waiver валидируется по содержимому
fs.mkdirSync(path.join(ws, ".design/qa/run-99"), { recursive: true });
wj(".design/qa/run-99/audit.json", { verdict: "TECHNICAL_PASS", counts: { p0: 0, p1: 3, p2: 0 } });
wj(".design/DELIVERY.json", { mode: "showcase", routes: [{ path: "/", audit: ".design/qa/run-99/audit.json" }], sources: [], contacts: null });
run("gate release: P1 без waiver → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "release"], 1);
wj(".design/qa/WAIVER.md", "# Waiver\n\nP1: 2\n\nПринято частично.\n");
run("gate release: waiver с неверным числом P1 → 1", process.execPath, [path.join(here, "gate.mjs"), "--stage", "release"], 1);
wj(".design/qa/WAIVER.md", "# Waiver\n\nP1: 3\n\n1) Контраст подписи в футере — заказчик настаивает на светло-сером.\n2) tap-target 42px у переключателя фильтра — компромисс по плотности.\n3) alt у декоративной линии — заглушка до поставки текстов.\n\nРешение подтверждено пользователем 2026-08-22.\n");
run("gate release: валидный waiver → 0", process.execPath, [path.join(here, "gate.mjs"), "--stage", "release"], 0);

// ---------- итог ----------
srvRedirect.kill(); srvStatic.kill();
await sleep(600);
let failed = 0;
console.log("\n=== SELFTEST ===");
for (const [st, name, info] of results) {
  console.log(`  ${st === "PASS" ? "✓" : "✗"} ${name} — ${info}`);
  if (st === "FAIL") failed++;
}
if (failed) {
  console.log(`\n${failed} провалено. Рабочая папка сохранена для разбора: ${ws}`);
  process.exit(1);
}
if (!(await rmWs())) {
  console.log(`\nВСЕ ТЕСТЫ ПРОШЛИ, но папка ${ws} не удалилась (процесс ещё держит её) — удали вручную.`);
  process.exit(0);
}
console.log("\nВСЕ ТЕСТЫ ПРОШЛИ. Рабочая папка удалена.");
