// Регрессионный selftest обнаружения плавающих chat/help/callback/messenger/support-виджетов
// и закреплённых в viewport оверлеев (поведенческая проверка). Гоняет inspectDom/domVerdict
// и findPinnedOverlays/pinnedVerdict по локальным HTML-фикстурам: виджет в углу (кнопка/iframe/
// RU-callback), большая контакт-форма поверх мобильного контента и absolute-popup в fixed-обёртке
// обязаны давать FAIL; легитимный UI (sticky-шапка, полноширинная нижняя навигация) — ok.
//   node selftest-overlay.mjs          (из корня проекта с playwright)
// Exit: 0 PASS · 1 FAIL.
import fs from "node:fs";
import path from "node:path";
import { loadPlaywright, fileUrl, inspectDom, domVerdict, findPinnedOverlays, pinnedVerdict } from "./lib.mjs";

const base = (body) => `<!doctype html><meta charset="utf-8"><style>
  body{margin:0;font:16px/1.5 system-ui}
  header{position:sticky;top:0;z-index:50;background:#fff;border-bottom:1px solid #ccc;padding:12px 24px;display:flex;justify-content:space-between}
  main{padding:24px;max-width:720px}
  footer{position:fixed;bottom:0;left:0;right:0;z-index:60;background:#fff;border-top:1px solid #ccc;display:flex;justify-content:space-around;padding:10px 0}
  .chat-bubble{position:fixed;right:16px;bottom:16px;z-index:9999;width:56px;height:56px;border-radius:50%;background:#25d366;color:#fff;display:flex;align-items:center;justify-content:center}
  .cb-iframe{position:fixed;left:14px;bottom:14px;z-index:9999;width:64px;height:64px;border:0;background:#3aa}
  .cb-ru{position:fixed;right:12px;bottom:90px;z-index:9998;padding:10px 14px;background:#c33;color:#fff}
  .contact-sheet{position:fixed;inset:auto 0 0 0;z-index:9990;background:#fff;padding:18px;border-top:2px solid #333}
  .anchor{position:fixed;width:0;height:0;top:0;left:0}
  .popup-abs{position:absolute;top:40vh;left:50%;transform:translateX(-50%);width:340px;padding:16px;background:#fff;box-shadow:0 12px 40px rgba(0,0,0,.35);z-index:9991}
  .popup-abs button.close{float:right}
</style>
<header><strong>Studio</strong><nav><a href="#">Projects</a> <a href="#">About</a></nav></header>
<main>${body}</main>`;

const TALL = "<h1>Столярная мастерская</h1><p>Мебель на заказ: кухни, гардеробные, системы хранения. Индивидуальные размеры, собственное производство, контроль каждого этапа от замера до монтажа. Дополнительный текст для объёма страницы, чтобы детектор бланка не срабатывал раньше детектора оверлеев.</p>" + "<p>Страница должна быть выше вьюпорта, чтобы прокрутка для поведенческой проверки состоялась. Ещё абзац текста.</p>".repeat(40);

const FIXTURES = [
  {
    name: "clean: sticky-шапка без виджетов → ok",
    html: base("<h1>Столярная мастерская</h1><p>Проектируем и изготавливаем мебель на заказ: кухни, гардеробные, стеллажи и системы хранения. Работаем по индивидуальным размерам, сами контролируем каждый этап — от замера до монтажа. На этой странице нет плавающих виджетов, только контент и обычная навигация сверху, поэтому кадр считается чистым.</p><p>Второй абзац с дополнительным текстом, чтобы страница не выглядела пустой для детекторов бланка.</p>"),
    expect: "ok", viewport: { width: 1440, height: 1000 },
  },
  {
    name: "chat-пузырь (keyword class, 56×56, правый низ) → chat-widget-overlay",
    html: base("<h1>Столярная мастерская</h1><p>Мебель на заказ: кухни, гардеробные, системы хранения. Индивидуальные размеры, собственное производство, контроль каждого этапа от замера до монтажа. Дополнительный текст для объёма страницы, чтобы детектор бланка не срабатывал раньше детектора виджетов.</p>") + '<div class="chat-bubble">💬</div>',
    expect: "chat-widget-overlay", viewport: { width: 1440, height: 1000 },
  },
  {
    name: "iframe-виджет (64×64, левый низ, без keyword) → chat-widget-overlay",
    html: base("<h1>Столярная мастерская</h1><p>Мебель на заказ: кухни, гардеробные, системы хранения. Индивидуальные размеры, собственное производство, контроль каждого этапа от замера до монтажа. Дополнительный текст для объёма страницы, чтобы детектор бланка не срабатывал раньше детектора виджетов.</p>") + '<iframe class="cb-iframe" title="" srcdoc="<b>?</b>"></iframe>',
    expect: "chat-widget-overlay", viewport: { width: 1440, height: 1000 },
  },
  {
    name: "RU callback-кнопка (aria-label «Заказать звонок», правый низ) → chat-widget-overlay",
    html: base("<h1>Столярная мастерская</h1><p>Мебель на заказ: кухни, гардеробные, системы хранения. Индивидуальные размеры, собственное производство, контроль каждого этапа от замера до монтажа. Дополнительный текст для объёма страницы, чтобы детектор бланка не срабатывал раньше детектора виджетов.</p>") + '<div class="cb-ru" aria-label="Заказать звонок">Обратный звонок</div>',
    expect: "chat-widget-overlay", viewport: { width: 1440, height: 1000 },
  },
  {
    name: "mobile 390: chat-пузырь в правом нижнем углу → chat-widget-overlay",
    html: base("<h1>Столярная мастерская</h1><p>Мебель на заказ: кухни, гардеробные, системы хранения. Индивидуальные размеры, собственное производство, контроль каждого этапа от замера до монтажа. Дополнительный текст для объёма страницы, чтобы детектор бланка не срабатывал раньше детектора виджетов.</p>") + '<div class="chat-bubble">💬</div>',
    expect: "chat-widget-overlay", viewport: { width: 390, height: 844 },
  },
  {
    name: "mobile 390: полноширинная нижняя навигация (легитимный UI) → ok",
    html: base("<h1>Столярная мастерская</h1><p>Мебель на заказ: кухни, гардеробные, системы хранения. Индивидуальные размеры, собственное производство, контроль каждого этапа от замера до монтажа. На мобилье внизу закреплена текстовая навигация на всю ширину — это дизайн, а не виджет, детектор не должен её считать.</p>") + "<footer><span>Floors</span><span>Cases</span><span>About</span><span>Contact</span></footer>",
    expect: "ok", viewport: { width: 390, height: 844 },
  },
  {
    name: "поведенчески: большая контакт-форма поверх мобильного контента → FAIL",
    html: base(TALL) + '<div class="contact-sheet"><form><b>Оставьте заявку</b><input placeholder="Имя"><input placeholder="Телефон"><button>Отправить</button></form></div>',
    expect: "fail", viewport: { width: 390, height: 844 }, mode: "pinned",
  },
  {
    name: "поведенчески: absolute-popup в 0×0 fixed-обёртке с кнопкой закрытия → FAIL",
    html: base(TALL) + '<div class="anchor"><div class="popup-abs"><button class="close">×</button><b>Подпишитесь на новости</b><p>Форма подписки, визуально закреплённая в viewport, но position:absolute.</p></div></div>',
    expect: "fail", viewport: { width: 1440, height: 1000 }, mode: "pinned",
  },
  {
    name: "поведенчески: обычная inline-форма в потоке страницы → ok",
    html: base(TALL + '<section id="contact"><form><b>Оставьте заявку</b><input placeholder="Имя"><button>Отправить</button></form></section>'),
    expect: "ok", viewport: { width: 1440, height: 1000 }, mode: "pinned",
  },
];

const tmp = fs.mkdtempSync(path.join(fs.realpathSync(process.env.TEMP || "."), "rs-selftest-"));
const { chromium } = loadPlaywright();
const browser = await chromium.launch({ headless: true });
let failed = 0;
try {
  for (const fx of FIXTURES) {
    const file = path.join(tmp, fx.name.replace(/[^a-z0-9]+/gi, "-") + ".html");
    fs.writeFileSync(file, fx.html, "utf8");
    const page = await browser.newPage({ viewport: fx.viewport });
    await page.goto(fileUrl(file), { waitUntil: "load" });
    let verdict;
    let details;
    if (fx.mode === "pinned") {
      const pinned = await findPinnedOverlays(page);
      verdict = pinnedVerdict(pinned) || "ok";
      details = `pinned=${JSON.stringify(pinned)}`;
    } else {
      const dom = await inspectDom(page);
      verdict = domVerdict(dom);
      details = `overlays=${JSON.stringify(dom.overlays)}`;
    }
    const pass = verdict === fx.expect || (fx.expect === "fail" && verdict !== "ok");
    if (!pass) failed++;
    console.log(`${pass ? "PASS" : "FAIL"}  ${fx.name}\n      вердикт: ${verdict} (ожидался ${fx.expect}); ${details}`);
    await page.close();
  }
} finally {
  await browser.close();
  fs.rmSync(tmp, { recursive: true, force: true });
}
console.log(`\n${failed ? "SELFTEST_FAIL" : "SELFTEST_PASS"} — плавающие виджеты (${FIXTURES.length - failed}/${FIXTURES.length})`);
process.exit(failed ? 1 : 0);
