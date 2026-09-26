import { chromium } from "playwright";

const baseUrl = process.env.PITER_MEBEL_TEST_URL || "http://localhost:3001";
const browser = await chromium.launch({ headless: true });
const failures = [];
const internalPaths = new Set();
const pageTitles = new Map();

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function testPage(path, viewport) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  const consoleErrors = [];
  page.on("console", (message) => {
    const text = message.text();
    if (
      message.type() === "error"
      && !text.includes("mc.yandex")
      && !text.startsWith("Failed to load resource")
    ) consoleErrors.push(text);
  });
  await page.route(/mc\.yandex|yandex\.ru\/ads/, (route) => route.abort());
  const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
  const expectedStatus = path === "/missing-smoke-page/" ? 404 : 200;
  check(response?.status() === expectedStatus, `${path} (${viewport.width}px): HTTP ${response?.status()}, ожидался ${expectedStatus}`);
  check(await page.locator("h1").count() === 1, `${path} (${viewport.width}px): должен быть один H1`);
  check(await page.locator(".eyebrow").count() === 0, `${path} (${viewport.width}px): на странице остался двойной надзаголовок .eyebrow`);
  check(await page.locator('.skip-link[href="#main-content"]').count() === 1, `${path}: нет skip-link`);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(overflow <= 1, `${path} (${viewport.width}px): горизонтальное переполнение ${overflow}px`);
  const brokenImages = await page.locator("img").evaluateAll((images) => images
    .filter((image) => image.complete && image.naturalWidth === 0)
    .map((image) => image.getAttribute("src")));
  check(brokenImages.length === 0, `${path}: сломанные изображения ${brokenImages.join(", ")}`);
  if (expectedStatus === 200) {
    const title = await page.title();
    const description = await page.locator('meta[name="description"]').getAttribute("content");
    check(title.length > 12 && title.length <= 70, `${path}: длина title ${title.length}`);
    check(Boolean(description) && description.length >= 50 && description.length <= 160, `${path}: длина description ${description?.length ?? 0}`);
    if (pageTitles.has(title) && pageTitles.get(title) !== path) failures.push(`${path}: title дублирует ${pageTitles.get(title)}`);
    else pageTitles.set(title, path);

    const invalidJsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts
      .map((script) => script.textContent || "")
      .filter((value) => {
        try { JSON.parse(value); return false; } catch { return true; }
      }));
    check(invalidJsonLd.length === 0, `${path}: невалидный JSON-LD`);

    const links = await page.locator("a[href]").evaluateAll((anchors) => anchors.map((anchor) => anchor.href));
    for (const href of links) {
      const url = new URL(href);
      if (url.origin === new URL(baseUrl).origin) internalPaths.add(`${url.pathname}${url.search}`);
    }
  }
  if (expectedStatus === 200) {
    check(consoleErrors.length === 0, `${path}: ошибки console: ${consoleErrors.join(" | ")}`);
  }
  await context.close();
}

for (const width of [320, 360, 390, 430]) {
  for (const path of ["/kitchens/", "/projects/", "/wardrobes/", "/custom-furniture/"]) {
    const context = await browser.newContext({ viewport: { width, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
    const tablist = page.getByRole("tablist");
    await tablist.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    const geometry = await tablist.locator('[role="tab"]').evaluateAll((tabs) => tabs.map((tab) => ({
      left: tab.offsetLeft,
      top: tab.offsetTop,
      width: tab.offsetWidth,
      shrink: getComputedStyle(tab).flexShrink,
      textFits: tab.scrollWidth <= tab.clientWidth + 1,
    })));
    check(geometry.length >= 3, `${path} (${width}px): недостаточно вкладок фильтра`);
    check(geometry.every((tab) => tab.shrink === "0"), `${path} (${width}px): вкладка фильтра сжимается`);
    check(geometry.every((tab) => tab.textFits), `${path} (${width}px): текст вкладки обрезан`);
    check(geometry.every((tab) => tab.top === geometry[0]?.top), `${path} (${width}px): вкладки перенеслись на новую строку`);
    check(geometry.every((tab, index) => index === 0 || tab.left >= geometry[index - 1].left + geometry[index - 1].width), `${path} (${width}px): вкладки перекрываются`);
    check(await page.locator(".catalog-tabs-hint").isVisible(), `${path} (${width}px): нет подсказки о прокрутке`);
    const tabsOverflow = await tablist.evaluate((element) => element.scrollWidth > element.clientWidth + 1);
    check(!tabsOverflow || await page.locator(".catalog-tabs-shell.can-scroll-end").count() === 1, `${path} (${width}px): нет правого индиктора продолжения списка`);
    const selected = tablist.locator('[role="tab"][aria-selected="true"]');
    await selected.focus();
    await page.keyboard.press("ArrowRight");
    await page.waitForTimeout(100);
    check(await tablist.locator('[role="tab"]').nth(1).evaluate((tab) => tab === document.activeElement), `${path} (${width}px): стрелка вправо не переводит фокус`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    check(overflow <= 1, `${path} (${width}px): страница шире экрана на ${overflow}px`);
    await context.close();
  }
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/production/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  check(await page.locator(".sticky-cta").isVisible(), "Sticky CTA не видна в нейтральной зоне мобильной страницы");
  check(await page.locator(".prod-stage-badge, .prod-benefit-tag, .promo-cta-card-badge").count() === 0, "На /production/ остались двойные надзаголовки (badge/tag)");
  check(await page.locator(".prod-stage-title").count() === 3, "На /production/ должно быть 3 заголовка этапов производства");
  check(await page.locator(".prod-benefit-title").count() === 3, "На /production/ должно быть 3 заголовка преимуществ производства");
  const prodText = await page.locator("main").innerText();
  check(!prodText.includes("Офис отдельно от цеха") && !prodText.includes("Комфортная встреча"), "На /production/ остался нерелевантный пункт про офис в преимуществах цеха");
  await page.goto(`${baseUrl}/projects/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(250);
  const projectsHtml = await page.content();
  check(!projectsHtml.includes("Кировский завод") && !projectsHtml.includes("во время выезда специалиста на замер"), "На /projects/ осталась неверная станция метро или запрещённое обещание привезти образцы на замер");
  check(!projectsHtml.includes("Индивидуальный размер"), "На /projects/ остался дублирующийся тег «Индивидуальный размер» на каждой карточке");
  await page.getByRole("tablist").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  check(await page.locator(".sticky-cta").count() === 0, "Sticky CTA перекрывает фильтры каталога");
  await page.locator(".catalog-card").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  check(await page.locator(".sticky-cta").count() === 0, "Sticky CTA перекрывает карточку проекта");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
  await page.setViewportSize({ width: 390, height: 500 });
  await page.waitForTimeout(250);
  check(await page.locator(".sticky-cta").count() === 0, "Sticky CTA не скрылась при открытии экранной клавиатуры/уменьшении visual viewport");
  await page.goto(`${baseUrl}/kitchens/`, { waitUntil: "domcontentloaded" });
  check(await page.locator(".card-badge-top").count() === 0, "На /kitchens/ остался повторяющийся бейдж «Реализованный проект» на каждой карточке");
  const kitchensText = await page.locator("main").innerText();
  check(!kitchensText.includes("пластике Slotex"), "На /kitchens/ столешницы Slotex ошибочно названы пластиком фасадов");
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/knowledge/rozetki-na-kuhne-shema-vysoty/`, { waitUntil: "domcontentloaded" });
  const mobileToc = page.locator(".article-mobile-toc");
  check(await mobileToc.isVisible(), "В статье на телефоне нет доступного содержания");
  await mobileToc.locator("summary").click();
  check(await mobileToc.locator("a").first().isVisible(), "Мобильное содержание статьи не раскрывается");
  check(await page.locator(".article-related-grid a").count() >= 5, "В статье недостаточно связанных внутренних ссылок");
  check(await page.locator(".article-tier-label").count() === 0, "В статье остались двойные заголовки .article-tier-label");
  const articleSchema = await page.locator('script[type="application/ld+json"]').evaluateAll((scripts) => scripts
    .map((script) => JSON.parse(script.textContent || "{}"))
    .find((value) => value["@type"] === "TechArticle"));
  check(articleSchema?.wordCount >= 1500, `Статья остаётся слишком короткой: ${articleSchema?.wordCount ?? 0} слов`);
  check(/^PT\d+M$/.test(articleSchema?.timeRequired || ""), "В TechArticle нет рассчитанного времени чтения");
  await page.setViewportSize({ width: 1440, height: 900 });
  const tiersNoCollision = await page.locator(".article-list-tiers .article-list-item").evaluateAll((items) => items.every((item) => {
    const marker = item.querySelector(".article-list-marker")?.getBoundingClientRect();
    const text = item.querySelector(".article-list-text")?.getBoundingClientRect();
    return Boolean(marker && text && marker.right <= text.left + 1);
  }));
  check(tiersNoCollision, "В статье на десктопе левый столбец .article-list-marker налезает на правый текст .article-list-text");
  await context.close();
}

const sitemapResponse = await fetch(`${baseUrl}/sitemap.xml`);
const sitemap = await sitemapResponse.text();
const paths = [...sitemap.matchAll(/<loc>https:\/\/pitermebel\.com([^<]*)<\/loc>/g)]
  .map((match) => match[1]);
paths.push("/missing-smoke-page/");

for (const path of paths) {
  await testPage(path, { width: 1440, height: 900 });
  await testPage(path, { width: 390, height: 844 });
}

for (const path of internalPaths) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "manual" });
  check(response.status < 400, `Внутренняя ссылка ${path}: HTTP ${response.status}`);
}

const homeHtml = await fetch(`${baseUrl}/`).then((response) => response.text());
check(!homeHtml.includes('<div class="stat-num"><span>0</span>'), "В исходном HTML главной статистика всё ещё начинается с нуля");

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  const menu = page.getByRole("button", { name: "Открыть меню" });
  await menu.click();
  check(await page.getByRole("navigation", { name: "Мобильная навигация" }).getAttribute("aria-hidden") === "false", "Мобильное меню не открылось");
  await page.keyboard.press("Escape");
  check(await page.getByRole("navigation", { name: "Мобильная навигация", includeHidden: true }).getAttribute("aria-hidden") === "true", "Escape не закрыл мобильное меню");
  check(await menu.evaluate((element) => element === document.activeElement), "Фокус не вернулся на кнопку меню");

  const projectCounter = page.locator('[data-count-final="1500"]');
  await projectCounter.scrollIntoViewIfNeeded();
  const sawIntermediateValue = await projectCounter.evaluate(async (element) => {
    const finalValue = Number(element.getAttribute("data-count-final")).toLocaleString("ru-RU");
    if (element.textContent?.trim() !== finalValue) return true;
    return new Promise((resolve) => {
      const observer = new MutationObserver(() => {
        if (element.textContent?.trim() !== finalValue) {
          observer.disconnect();
          resolve(true);
        }
      });
      observer.observe(element, { childList: true, characterData: true, subtree: true });
      window.setTimeout(() => {
        observer.disconnect();
        resolve(false);
      }, 250);
    });
  });
  check(sawIntermediateValue, "Счётчик 1500 не запустил анимацию при появлении в кадре");
  await page.waitForFunction(() => document.querySelector('[data-count-final="1500"]')?.textContent?.replace(/\s/g, "") === "1500");
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/calculator/?category=wardrobe&layout=straight&meters=-5&material=veneer&options=drawers,bad`, { waitUntil: "domcontentloaded" });
  check(await page.locator(".sticky-cta").count() === 0, "Мобильная CTA-панель не должна дублировать кнопки калькулятора");
  await page.waitForFunction(() => {
    const values = document.querySelectorAll(".calculator-summary dd");
    return values[2]?.textContent?.trim() === "0.8 м";
  });
  check(await page.locator(".calculator-summary").innerText().then((text) => text.includes("Встроенный шкаф")), "Калькулятор не исправил несовместимую конфигурацию URL");
  check((await page.locator(".calculator-summary dd").nth(2).innerText()).trim() === "0.8 м", "Калькулятор не ограничил отрицательную длину");
  check((await page.locator(".calculator-summary dd").nth(4).innerText()).trim() === "1", "Калькулятор не отфильтровал неизвестную опцию URL");
  const priceBefore = await page.locator(".calculator-price strong").innerText();
  await page.locator("label.calculator-choice", { hasText: "Корпусная мебель" }).click();
  await page.waitForFunction(() => {
    const field = document.querySelector('#measure-form select[name="category"]');
    return field instanceof HTMLSelectElement && field.value === "Корпусная мебель";
  });
  check(await page.locator('#measure-form select[name="category"]').inputValue() === "Корпусная мебель", "Выбор изделия в форме не синхронизировался с калькулятором");
  await page.getByRole("button", { name: /4\s*Оснащение/ }).click();
  await page.getByLabel(/Встроенная подсветка/).check();
  const optionCount = (await page.locator(".calculator-summary dd").nth(4).innerText()).trim();
  check(optionCount === "2", `Итог калькулятора не обновился после выбора (получено: ${optionCount})`);
  const priceAfter = await page.locator(".calculator-price strong").innerText();
  check(priceAfter !== priceBefore, "Цена калькулятора не изменилась после смены категории и опции");

  const form = page.locator("#measure-form form");
  check(await form.locator('input[name="name"]').count() === 0, "Форма всё ещё запрашивает имя");
  check(await form.locator("details.form-details").count() === 1, "В форме нет раскрываемого блока деталей");
  await form.locator('input[name="contact"]').fill("+79990000000");
  await form.locator('input[name="consent"]').check();
  await form.getByRole("button", { name: "Запросить расчёт" }).click();
  check(await page.locator(".form-error-summary").innerText().then((text) => text.includes("ещё не подключена")), "Форма без ключа должна показывать ошибку настройки");
  check(await page.getByText("Заявка отправлена", { exact: true }).count() === 0, "Форма без ключа показала ложный успех");
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/calculator/?step=4`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => document.querySelector(".calculator-final-mobile") instanceof HTMLButtonElement);
  check(await page.locator(".calculator-mobile-price").isVisible(), "На телефоне не показана текущая ориентировочная цена");
  check(await page.locator(".calculator-final-mobile").isVisible(), "На телефоне нет кнопки перехода к стоимости");
  check(!(await page.locator(".calculator-final-desktop").isVisible()), "На телефоне показана desktop-кнопка перехода сразу к заявке");
  await page.locator(".calculator-final-mobile").click();
  await page.waitForTimeout(450);
  check(await page.evaluate(() => document.activeElement?.id === "calculator-result"), "Кнопка на телефоне не перевела пользователя к блоку стоимости");
  await context.close();
}

{
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  check(await page.locator(".boost-popup").count() === 0, "Всплывающее окно /boost не должно появляться сразу после входа");

  await page.evaluate(() => {
    window.sessionStorage.setItem("pm_boost_started_at_v1", String(Date.now() - 9400));
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  check(await page.locator(".boost-popup").count() === 0, "Всплывающее окно /boost появилось раньше 10 секунд");
  await page.waitForSelector(".boost-popup", { state: "visible", timeout: 2000 });
  check(await page.locator(".boost-popup-title").innerText().then((t) => t.includes("Купили квартиру или готовите её к сдаче?")), "Неверный заголовок во всплывающем окне /apartment");
  check(await page.locator(".boost-popup-cta").getAttribute("href") === "/apartment/", "Кнопка Подробнее во всплывающем окне должна вести на /apartment/");

  await page.locator(".boost-popup-close").click();
  await page.waitForTimeout(300);
  check(await page.locator(".boost-popup").count() === 0, "Кнопка закрытия не скрыла всплывающее окно /apartment");

  await page.goto(`${baseUrl}/?boost=1`, { waitUntil: "domcontentloaded" });
  await page.waitForSelector(".boost-popup-cta", { state: "visible", timeout: 2000 });
  await page.setViewportSize({ width: 320, height: 740 });
  const popupOverflow320 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(popupOverflow320 <= 1, `/?boost=1 (320px): горизонтальное переполнение со всплывающим окном ${popupOverflow320}px`);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator(".boost-popup-cta").click();
  await page.waitForURL("**/apartment/**");
  check(await page.locator(".boost-popup").count() === 0, "На самой странице /apartment всплывающее окно должно быть скрыто");
  check(await page.locator(".sticky-cta").count() === 0, "Sticky CTA не должна перекрывать первый экран /apartment на телефоне");
  check(await page.locator(".boost-hero-section img").count() === 0, "На странице /apartment не должно быть фотографий рядом с видео");
  check(await page.locator(".boost-editorial-section").count() === 0, "На странице /apartment не должно быть лишней текстовой секции");
  const sameHeadingFont = await page.evaluate(() => {
    const h1 = document.querySelector(".boost-main-title");
    const accent = document.querySelector(".boost-main-title-accent");
    return Boolean(h1 && accent && getComputedStyle(h1).fontFamily === getComputedStyle(accent).fontFamily);
  });
  check(sameHeadingFont, "В заголовке H1 на /apartment основной текст и акцентная строка должны иметь один шрифт");
  const videoAboveActionsOnMobile = await page.evaluate(() => {
    const video = document.querySelector(".boost-video-card")?.getBoundingClientRect();
    const actions = document.querySelector(".boost-hero-actions")?.getBoundingClientRect();
    return Boolean(video && actions && video.top < actions.top && video.top < 500);
  });
  check(videoAboveActionsOnMobile, "На мобильном экране /apartment видео должно располагаться сразу под заголовком (выше кнопок)");
  check(await page.locator('.boost-hero-actions a[href*="/calculator/"]').getAttribute("href") === "/calculator/?category=cabinet&layout=complex", "Ссылка на калькулятор с /apartment должна передавать валидные параметры category=cabinet&layout=complex");
  check(await page.locator("video.boost-video-el").getAttribute("src") === "/video/studio-apartment-720p.mp4", "На странице /apartment не подключено локальное видео обзора");
  const isAutoLoopMuted = await page.locator("video.boost-video-el").evaluate((video) => video.autoplay && video.muted && video.loop && video.playsInline);
  check(isAutoLoopMuted, "Видео на /apartment должно быть настроено на автозапуск без звука и зацикливание (autoPlay, muted, loop, playsInline)");
  check(await page.locator('#measure-form select[name="category"]').inputValue() === "Комплексный заказ", "На странице /apartment в форме должна быть выбрана категория Комплексный заказ");
  check(await page.locator(".promo-cta-card-title").innerText().then((t) => t.includes("Скидка на комплект от 2 изделий")), "На странице /apartment в блоке формы должна быть выбрана акция скидки за объём");

  await page.setViewportSize({ width: 320, height: 740 });
  const boostOverflow320 = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  check(boostOverflow320 <= 1, `/apartment/ (320px): горизонтальное переполнение ${boostOverflow320}px`);
  await context.close();
}

{
  // После перехода на /apartment и возврата обратно на главную окно снова отображается
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();
  await page.goto(`${baseUrl}/apartment/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    window.sessionStorage.setItem("pm_boost_started_at_v1", String(Date.now() - 9500));
  });
  await page.locator(".boost-back-btn").click();
  await page.waitForURL(`${baseUrl}/`);
  await page.waitForSelector(".boost-popup", { state: "visible", timeout: 2000 });
  check(await page.locator(".boost-popup").isVisible(), "После возврата со страницы /apartment всплывающее окно должно снова отображаться");
  await context.close();
}

{
  const clampedRangeRes = await fetch(`${baseUrl}/video/studio-apartment-720p.mp4`, {
    headers: { Range: "bytes=0-99999999" },
  });
  check(clampedRangeRes.status === 206, `Range bytes=0-99999999: ожидался HTTP 206, получен ${clampedRangeRes.status}`);
  const suffixRangeRes = await fetch(`${baseUrl}/video/studio-apartment-720p.mp4`, {
    headers: { Range: "bytes=-1024" },
  });
  check(suffixRangeRes.status === 206, `Range bytes=-1024: ожидался HTTP 206, получен ${suffixRangeRes.status}`);
  const invalidRangeRes = await fetch(`${baseUrl}/video/studio-apartment-720p.mp4`, {
    headers: { Range: "bytes=99999999-100000000" },
  });
  check(invalidRangeRes.status === 416, `Range bytes=99999999-100000000: ожидался HTTP 416, получен ${invalidRangeRes.status}`);
}

await browser.close();

if (failures.length) {
  console.error(`Smoke QA: ${failures.length} проблем`);
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Smoke QA: успешно проверено ${paths.length} маршрутов в desktop и mobile, меню, калькулятор и форма.`);
