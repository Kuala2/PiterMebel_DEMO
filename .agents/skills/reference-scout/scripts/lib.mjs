// Общие утилиты reference-scout. Без внешних зависимостей кроме playwright.
// Playwright резолвится от РАБОЧЕЙ ПАПКИ ПРОЕКТА (cwd), а не от папки скилла —
// поэтому `npm i -D playwright` в проекте делает все скрипты рабочими.
import path from "node:path";
import fs from "node:fs";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import crypto from "node:crypto";

export const EXIT_OK = 0;
export const EXIT_DATA_FAIL = 2; // контент не прошёл проверки (бланк/бот/таймаут)
export const EXIT_CRASH = 1;

export function loadPlaywright() {
  const candidates = [];
  if (process.cwd()) candidates.push(path.join(process.cwd(), "package.json"));
  const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));
  candidates.push(path.join(here, "package.json"));
  for (const p of candidates) {
    try {
      const req = createRequire(p);
      return req("playwright");
    } catch {
      /* следующий кандидат */
    }
  }
  const cwd = process.cwd();
  console.error(
    "PLAYWRIGHT_NOT_FOUND\n" +
    `Скрипт запущен из: ${cwd}\n` +
    "Установи playwright в проект (один раз):\n" +
    `  cd "${cwd}" && npm i -D playwright && npx playwright install chromium`
  );
  process.exit(EXIT_CRASH);
}

export function fileUrl(p) {
  return pathToFileURL(path.resolve(p)).href;
}

export function sha256File(p) {
  return crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");
}

export function readJson(p) {
  return JSON.parse(fs.readFileSync(p, "utf8"));
}

export function writeJson(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(data, null, 2) + "\n", "utf8");
}

export function toPosix(p) {
  return p.split(path.sep).join("/");
}

export function normDomain(u) {
  try {
    return new URL(u).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return "";
  }
}

export function sameSite(a, b) {
  const da = normDomain(a);
  const db = normDomain(b);
  if (!da || !db) return false;
  return da === db || da.endsWith("." + db) || db.endsWith("." + da);
}

export function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9а-яё]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48) || "item";
}

const BOT_PATTERNS = [
  /just a moment/i, /checking your browser/i, /attention required/i,
  /access denied/i, /captcha/i, /cf-chl/i, /cloudflare/i, /ddos-guard/i,
  /datadome/i, /perimeterx/i, /incapsula/i, /подтвердите, что вы не робот/i,
  /доступ ограничен/i, /проверка браузера/i,
];

// DOM-инспекция: текст, медиа, оверлеи, признаки бот-челленджа.
export async function inspectDom(page) {
  return page.evaluate(() => {
    const txt = document.body ? document.body.innerText : "";
    const media = document.querySelectorAll("img, video, canvas, svg image").length;
    const headText = Array.from(document.querySelectorAll("h1,h2,h3,p,a,button,li"))
      .map((el) => el.textContent || "")
      .join(" ")
      .trim();
    const vw = window.innerWidth || 1440;
    const vh = window.innerHeight || 1000;
    const overlays = [];
    for (const el of document.querySelectorAll("dialog,[role=dialog],div,section,aside")) {
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      const r = el.getBoundingClientRect();
      if (r.width < vw * 0.35 || r.height < vh * 0.18) continue;
      const z = parseInt(cs.zIndex || "0", 10);
      if (cs.position === "sticky" && z < 100) continue;
      const t = (el.innerText || "").slice(0, 200).toLowerCase();
      const hasSignal =
        /cookie|соглаш|подпис[а-я]*|подпиш|subscribe|newsletter|region|стран[а-я]*|возраст|age|verify|form|<form/i.test(
          el.innerHTML.slice(0, 4000)
        ) || el.querySelector("form") !== null;
      if (z >= 100 && hasSignal) {
        overlays.push({ tag: el.tagName, z, area: Math.round((r.width * r.height) / (vw * vh) * 100) });
      }
    }
    // Плавающие chat/help/callback/messenger/support-виджеты в углах экрана.
    // Фильтр крупных оверлеев выше их не видит (маленькие/узкие), а зелёный чат-пузырь
    // в углу — такой же загрязнитель кадра, как cookie-баннер. Ловим: fixed/sticky,
    // видимый, прижатый к углу, компактный; сигнал — ключевое слово в id/class/aria/title,
    // iframe или размер пузыря (≤96px). Полноширинные шапки/нижние панели не трогаем.
    const WIDGET_KW = /chat|chatt|helper|help[-_]?desk|callback|call[-_]?back|zvon|звонок|messenger|support|assist|consult|livechat|live[-_]?chat|intercom|crisp|tawk|jivosite|carrot|chatbot|chat-bot|чат|помощ|перезвон|обратн|консульт|поддержк|виджет|сообщени|messeng|whatsapp|telegram|bubble/i;
    const widgetEls = [];
    for (const el of document.querySelectorAll("body *")) {
      if (el.closest("dialog,[role=dialog]")) continue; // диалоги уже учтены выше
      const cs = getComputedStyle(el);
      if (cs.position !== "fixed" && cs.position !== "sticky") continue;
      if (cs.display === "none" || cs.visibility === "hidden" || parseFloat(cs.opacity || "1") <= 0.05) continue;
      if (cs.pointerEvents === "none") continue;
      const r = el.getBoundingClientRect();
      if (r.width < 16 || r.height < 16) continue;
      // видимое пересечение с вьюпортом (transform-спрятанные за краем не считаем)
      if (r.left >= vw || r.right <= 0 || r.top >= vh || r.bottom <= 0) continue;
      const nearLeft = r.left <= vw * 0.3, nearRight = r.right >= vw * 0.7;
      const nearTop = r.top <= vh * 0.3, nearBottom = r.bottom >= vh * 0.7;
      if (!((nearLeft || nearRight) && (nearTop || nearBottom))) continue;
      // компактность: крупную плашку ловит фильтр оверлеев; полноширинные панели — легитимный UI
      if (r.width > vw * 0.6 || r.height > vh * 0.6) continue;
      const isIframe = el.tagName === "IFRAME";
      const cls = typeof el.className === "string" ? el.className : "";
      const attrs = [el.id, cls,
        el.getAttribute ? (el.getAttribute("aria-label") || "") : "",
        el.getAttribute ? (el.getAttribute("title") || "") : "",
        el.getAttribute ? (el.getAttribute("name") || "") : "",
        isIframe && el.getAttribute ? (el.getAttribute("src") || "") : ""].join(" ");
      const kw = WIDGET_KW.test(String(attrs));
      const bubble = Math.max(r.width, r.height) <= 96;
      if (kw || isIframe || bubble) {
        widgetEls.push({
          tag: el.tagName, widget: true,
          corner: `${nearTop ? "top" : "bottom"}-${r.left < vw / 2 ? "left" : "right"}`,
          w: Math.round(r.width), h: Math.round(r.height),
          signal: kw ? "keyword" : isIframe ? "iframe" : "bubble",
        });
      }
    }
    // дедуп по элементу: у виджетов бывают вложенные fixed-обёртки, оставляем самый внешний
    const seenWidgets = [];
    for (const w of widgetEls) {
      if (!seenWidgets.some((s) => s.tag === w.tag && s.w === w.w && s.h === w.h)) seenWidgets.push(w);
    }
    overlays.push(...seenWidgets.slice(0, 8));
    return {
      title: document.title || "",
      textLength: txt.trim().length,
      textSample: txt.trim().replace(/\s+/g, " ").slice(0, 400),
      headTextLength: headText.length,
      mediaCount: media,
      overlays,
      lang: document.documentElement.lang || "",
    };
  });
}

export function domVerdict(dom) {
  const blob = (dom.title + " " + (dom.textSample || "")).slice(0, 500);
  if (BOT_PATTERNS.some((re) => re.test(blob))) return "bot-challenge";
  // остаточный cookie/dialog/CAPTCHA-оверлей или плавающий чат-виджет после dismiss = невалидный захват
  if (dom.overlays && dom.overlays.length > 0) {
    return dom.overlays.some((o) => o.widget) ? "chat-widget-overlay" : "blocking-overlay";
  }
  if (dom.textLength < 80 && dom.mediaCount === 0) return "blank";
  if (dom.mediaCount === 0 && dom.headTextLength < 140) return "weak-first-screen";
  return "ok";
}

// Поведенческая проверка оверлеев: НЕ верим CSS position, меряем факт — элемент
// сохраняет положение относительно viewport после прокрутки. Ловит popup'ы на
// position:absolute внутри 0×0 fixed-обёрток, трансформированные панели,
// контактные/подписные формы и всплывающие панели, которые CSS-фильтр не видит.
// Кандидаты: dialog/form/iframe, keyword-имена (popup/contact/newsletter/chat/…),
// владельцы кнопки закрытия, fixed/sticky. Полноширинные нав-полосы и панели
// с ≥3 ссылками без form/iframe считаем легитимной навигацией.
export async function findPinnedOverlays(page, scrollStep = 700) {
  return page.evaluate(async (scrollStep) => {
    const vw = window.innerWidth || 1440;
    const vh = window.innerHeight || 1000;
    const KW = /popup|modal|newsletter|subscribe|contact|callback|chat|widget|overlay|signup|заявк|звонок|консульт|подписк|виджет|чат|помощ|перезвон|обратн|сообщен|спроси|messeng|support|help/i;
    const CLOSE = /^(close|закрыть|×|✕|✖|x)$/i;
    const cands = new Set();
    for (const el of document.querySelectorAll("dialog,[role=dialog],form,iframe")) cands.add(el);
    for (const el of document.querySelectorAll("[class],[id],[aria-label],[data-testid]")) {
      const blob = [el.id, typeof el.className === "string" ? el.className : "",
        el.getAttribute("aria-label") || "", el.getAttribute("data-testid") || ""].join(" ");
      if (KW.test(blob)) cands.add(el);
    }
    for (const b of document.querySelectorAll("button,[role=button]")) {
      const t = (b.textContent || "").trim();
      const al = b.getAttribute("aria-label") || "";
      if (CLOSE.test(t) || CLOSE.test(al) || /close|закрыть/i.test(String(b.className || ""))) {
        const host = b.closest("div,section,aside,form,dialog,[role=dialog]");
        if (host) cands.add(host);
      }
    }
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.position === "fixed" || cs.position === "sticky") cands.add(el);
    }
    const before = [];
    let i = 0;
    for (const el of cands) {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      if (cs.display === "none" || cs.visibility === "hidden") continue;
      if (parseFloat(cs.opacity || "1") <= 0.05 || cs.pointerEvents === "none") continue;
      if (r.width < 16 || r.height < 16) continue;
      if (r.left >= vw || r.right <= 0 || r.top >= vh || r.bottom <= 0) continue;
      el.setAttribute("data-rs-probe", String(i));
      before.push({ i, top: r.top, left: r.left, tag: el.tagName,
        nav: el.querySelectorAll("a").length >= 3 && !el.querySelector("form,iframe") });
      i++;
    }
    const maxScroll = document.documentElement.scrollHeight - vh;
    const dy = Math.min(scrollStep, maxScroll);
    window.scrollTo(0, dy);
    await new Promise((res) => setTimeout(res, 400));
    const scrolled = Math.round(window.scrollY);
    const pinned = [];
    for (const el of document.querySelectorAll("[data-rs-probe]")) {
      const b = before.find((x) => x.i === Number(el.getAttribute("data-rs-probe")));
      if (!b || b.nav) continue;
      const r = el.getBoundingClientRect();
      if (Math.abs(r.top - b.top) >= 24 || Math.abs(r.left - b.left) >= 24) continue; // уехал вместе с контентом
      if (scrolled < 100) continue; // страница не прокрутилась — проверка не состоялась
      // семантика важнее геометрии: форма/поле/iframe/кнопка закрытия = оверлей,
      // даже если панель широкая и низкая (контакт-шит внизу мобильного экрана)
      const semantic = /FORM|DIALOG|IFRAME/i.test(el.tagName)
        || !!el.querySelector("form,iframe,input,textarea,select");
      const closeBtn = [...el.querySelectorAll("button,[role=button]")].some((btn) =>
        CLOSE.test((btn.textContent || "").trim()) || CLOSE.test(btn.getAttribute("aria-label") || ""));
      const area = Math.round(((r.width * r.height) / (vw * vh)) * 100);
      const fullBar = r.width >= vw * 0.8 && r.height <= 140;
      if (fullBar && !semantic && !closeBtn) continue; // полноширинная нав-полоса без форм
      pinned.push({
        tag: el.tagName, w: Math.round(r.width), h: Math.round(r.height), area,
        semantic, closeBtn,
        zone: r.top < vh * 0.25 ? "top" : r.bottom > vh * 0.75 ? "bottom" : "mid",
      });
    }
    window.scrollTo(0, 0);
    for (const el of document.querySelectorAll("[data-rs-probe]")) el.removeAttribute("data-rs-probe");
    return pinned;
  }, scrollStep);
}

// Классификация закреплённых элементов: семантика (form/dialog/iframe/поля/кнопка
// закрытия) и крупные панели — блокирующий оверлей; угловые компактные — виджет.
export function pinnedVerdict(pinned) {
  if (!pinned || !pinned.length) return null;
  const hard = pinned.find((p) => p.semantic || p.closeBtn || p.area >= 35);
  if (hard) return "blocking-overlay";
  if (pinned.some((p) => p.zone !== "mid" || Math.max(p.w, p.h) <= 96)) return "chat-widget-overlay";
  return null;
}

// Безопасное закрытие оверлеев: кликаем только по кнопкам ВНУТРИ найденного
// оверлея/consent-контейнера, никогда — по глобальным кнопкам вроде hero-CTA «Continue».
export async function dismissOverlays(page) {
  return page.evaluate(() => {
    const words = /^(accept( all| selected| cookies)?|agree( to all| all)?|allow( all)?|reject( all)?|close|got it|continue|ok|принять( все| и закрыть| куки)?|соглас(ен|ую|ие)?( со всем)?|разрешить все|отклонить все|понятно|хорошо|закрыть|ок)$/i;
    let clicked = 0;
    for (const el of document.querySelectorAll("dialog,[role=dialog]")) {
      for (const b of el.querySelectorAll("button, [role=button]")) {
        const t = (b.textContent || "").trim();
        if (t && t.length <= 32 && words.test(t)) { b.click(); clicked++; break; }
      }
    }
    // cookie/consent-плашки без dialog-семантики: точечные известные контейнеры
    const scopes = [
      "[class*=cookie] button", "[id*=cookie] button", "[class*=consent] button", "[id*=consent] button",
      "[class*=gdpr] button", "[id*=gdpr] button", "#onetrust-consent-sdk button",
    ];
    for (const sel of scopes) {
      try {
        for (const b of document.querySelectorAll(sel)) {
          const t = (b.textContent || "").trim();
          if (t && t.length <= 32 && words.test(t)) { b.click(); clicked++; break; }
        }
      } catch { /* ignore */
      }
    }
    return clicked;
  });
}

// Гарантированный возврат наверх: scrollTo(0,0) + ожидание scrollY<=2
// с двумя animation frames на стабилизацию sticky/lazy-интерфейса.
export async function settleTop(page, attempts = 4) {
  let y = 9999;
  for (let i = 0; i < attempts; i++) {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.evaluate(() => new Promise((res) => {
      let n = 0;
      const step = () => { if (++n >= 2) res(); else requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }));
    y = await page.evaluate(() => Math.round(window.scrollY));
    if (y <= 2) break;
    await page.waitForTimeout(250);
  }
  return y;
}

// Растровый анализ картинки через canvas в headless-странице.
// Ловит плоские бланки и почти-одноцветные кадры.
// Картинка передаётся как data: URL — иначе canvas считается tainted и не отдаёт пиксели.
export async function analyzeRaster(page, filePath) {
  const buf = fs.readFileSync(filePath);
  const dataUrl = "data:image/png;base64," + buf.toString("base64");
  const stats = await page.evaluate(async (url) => {
    const img = new Image();
    img.src = url;
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
    const W = 48, H = 32;
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    ctx.drawImage(img, 0, 0, W, H);
    const d = ctx.getImageData(0, 0, W, H).data;
    const bins = new Set();
    const lum = [];
    for (let i = 0; i < d.length; i += 4) {
      const r = d[i], g = d[i + 1], b = d[i + 2];
      bins.add(((r >> 5) << 6) | ((g >> 5) << 3) | (b >> 5));
      lum.push(0.2126 * r + 0.7152 * g + 0.0722 * b);
    }
    const mean = lum.reduce((a, x) => a + x, 0) / lum.length;
    const std = Math.sqrt(lum.reduce((a, x) => a + (x - mean) ** 2, 0) / lum.length);
    let edge = 0;
    for (let y = 0; y < H - 1; y++)
      for (let x = 0; x < W - 1; x++)
        edge += Math.abs(lum[y * W + x] - lum[y * W + x + 1]) + Math.abs(lum[y * W + x] - lum[(y + 1) * W + x]);
    return { bins: bins.size, std: Math.round(std * 10) / 10, edge: Math.round((edge / (W * H)) * 10) / 10 };
  }, dataUrl);
  return { ...stats, usable: stats.bins >= 8 && (stats.std >= 7 || stats.edge >= 2.5) };
}

export async function warmScroll(page, max = 12000) {
  await page.evaluate(async (maxPx) => {
    let y = 0;
    const step = Math.round(window.innerHeight * 0.8);
    while (y < maxPx) {
      window.scrollTo(0, y + step);
      y += step;
      await new Promise((r) => setTimeout(r, 90));
    }
    window.scrollTo(0, 0);
  }, max);
}

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) { args[key] = next; i++; }
      else args[key] = true;
    } else args._.push(a);
  }
  return args;
}
