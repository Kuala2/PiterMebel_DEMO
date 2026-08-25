// Гейт готовности этапа. Проверяет существование и вменяемость артефактов.
// НЕ оценивает красоту. Строгий разбор аргументов: неизвестная стадия = ошибка.
//
//   node gate.mjs --stage brief|research-pool|research|direction|targets|build|release [--root .]
//
// Exit: 0 GATE_PASS · 1 GATE_FAIL (со списком причин).
import path from "node:path";
import fs from "node:fs";

const STAGES = new Set(["brief", "research-pool", "research", "direction", "targets", "build", "release"]);

function parseArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    if (!argv[i].startsWith("--")) continue;
    const k = argv[i].slice(2);
    const n = argv[i + 1];
    if (n !== undefined && !n.startsWith("--")) { a[k] = n; i++; } else a[k] = true;
  }
  return a;
}

const args = parseArgs(process.argv.slice(2));
const stage = String(args.stage || "");
if (!STAGES.has(stage)) {
  console.error(`--stage обязателен и должен быть одним из: ${[...STAGES].join(", ")}`);
  process.exit(1);
}
const root = path.resolve(String(args.root || "."));
const STAGE_ORDER = ["brief", "research-pool", "research", "direction", "targets", "build", "release"];
const atLeast = (required) => STAGE_ORDER.indexOf(stage) >= STAGE_ORDER.indexOf(required);

const failures = [];
const notes = [];
const ok = (m) => notes.push(m);
let clientBrandAuditRequired = false;
let projectMode = "";
let clientSourceText = "";
let clientSourceWaiver = false;

function exists(rel, minSize = 1) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) { failures.push(`нет файла: ${rel}`); return false; }
  if (minSize > 1 && fs.statSync(p).size < minSize) {
    failures.push(`файл слишком мал/пуст: ${rel} (${fs.statSync(p).size} байт)`);
    return false;
  }
  return true;
}
function dirHas(rel, re, min = 1, what = "файлы") {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) { failures.push(`нет папки: ${rel}`); return 0; }
  const found = fs.readdirSync(p).filter((f) => re.test(f));
  if (found.length < min) failures.push(`${rel}: найдено ${found.length} ${what}, нужно ≥ ${min}`);
  return found.length;
}
function readText(rel) {
  try { return fs.readFileSync(path.join(root, rel), "utf8"); }
  catch { return ""; }
}
function countMatches(re, s) {
  const m = s.match(re);
  return m ? m.length : 0;
}

function walkFiles(dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ent.name === "node_modules" || ent.name === ".git" || ent.name.startsWith(".design")) continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkFiles(p, acc);
    else if (/\.(js|jsx|ts|tsx|astro|vue|html|css)$/.test(ent.name)) acc.push(p);
  }
  return acc;
}

// ---------- этапы ----------

if (atLeast("brief")) {
  if (exists(".design/BRIEF.md", 400)) {
    const t = readText(".design/BRIEF.md");
    const mode = t.match(/PROJECT_MODE:\s*(COMMISSIONED|CONCEPT)\b/i);
    if (!mode) failures.push("BRIEF.md: нужен PROJECT_MODE: COMMISSIONED или PROJECT_MODE: CONCEPT");
    else projectMode = mode[1].toUpperCase();
    if (!/маршрут|страниц|route/i.test(t)) failures.push("BRIEF.md: не видно перечня маршрутов");
    if (!/неизвестн|unknown|\[подтверд/i.test(t)) failures.push("BRIEF.md: нет блока неизвестных данных (unknown fields)");
    if (!/анти|запрещ|reject/i.test(t)) failures.push("BRIEF.md: нет анти-качеств/запретов");
    else ok("BRIEF.md: факты, маршруты, анти-качества на месте");
  }
  const clientDir = path.join(root, ".design/client-source");
  if (fs.existsSync(clientDir)) {
    if (exists(".design/client-source/CLIENT_SOURCE.md", 120)) {
      const source = readText(".design/client-source/CLIENT_SOURCE.md");
      clientSourceText = source;
      if (!/SOURCE_(?:AVAILABLE|PARTIAL|UNAVAILABLE)/.test(source)) failures.push("CLIENT_SOURCE.md: нужен явный статус SOURCE_AVAILABLE, SOURCE_PARTIAL или SOURCE_UNAVAILABLE");
      if (/SOURCE_UNAVAILABLE/.test(source) && !/\[пол/i.test(readText(".design/BRIEF.md"))) failures.push("BRIEF.md: при SOURCE_UNAVAILABLE неподтверждённые данные должны остаться [полями]");
      clientBrandAuditRequired = /SOURCE_(?:AVAILABLE|PARTIAL)/.test(source);
      if (clientBrandAuditRequired) {
        if (!/^##\s+Визуальная идентичность\s*$/mi.test(source)) failures.push("CLIENT_SOURCE.md: при доступном источнике нужен раздел ## Визуальная идентичность");
        if (!/BRAND_MODE:\s*(?:PRESERVE|EVOLVE|REFRESH|NOT_ESTABLISHED)\b/i.test(source)) failures.push("CLIENT_SOURCE.md: нужен BRAND_MODE: PRESERVE|EVOLVE|REFRESH|NOT_ESTABLISHED");
        if (!/Повторяющиеся сигналы/i.test(source) || !/Разовые оформления/i.test(source) || !/Решение для Direction/i.test(source)) {
          failures.push("CLIENT_SOURCE.md: аудит бренда должен разделять повторяющиеся сигналы, разовые оформления и решение для Direction");
        }
      }
    }
  }
  if (projectMode === "COMMISSIONED" && !fs.existsSync(path.join(root, ".design/client-source/CLIENT_SOURCE.md"))) {
    failures.push("CLIENT_SOURCE.md: PROJECT_MODE COMMISSIONED требует клиентский intake; Brief/Research можно продолжить только после создания отчёта со статусом");
  }
}

if (atLeast("research-pool")) {
  if (exists(".design/research/DISCOVERY.md", 500)) {
    const discovery = readText(".design/research/DISCOVERY.md");
    const urls = [...discovery.matchAll(/https?:\/\/[^\s)\]>]+/gi)].map((m) => m[0].replace(/[.,;]+$/, ""));
    const uniqueUrls = new Set(urls);
    if (uniqueUrls.size < 20) failures.push(`DISCOVERY.md: уникальных URL ${uniqueUrls.size}, нужно ≥ 20 до отбора пула`);
    else ok(`discovery inventory: ${uniqueUrls.size} URL`);
    if (!/reject|отклон|screen|просмотр/i.test(discovery)) failures.push("DISCOVERY.md: нет решений screen/reject и наблюдаемых причин отсева");
  }

  let poolDomains = [];
  if (exists(".design/research/POOL.json", 500)) {
    try {
      const pool = JSON.parse(readText(".design/research/POOL.json"));
      const candidates = Array.isArray(pool.candidates) ? pool.candidates : [];
      if (candidates.length !== 8) failures.push(`POOL.json: кандидатов ${candidates.length}, нужно ровно 8`);
      poolDomains = candidates.map((c) => String(c.domain || "").toLowerCase().replace(/^www\./, ""));
      if (new Set(poolDomains).size !== 8 || poolDomains.some((d) => !d)) failures.push("POOL.json: нужны 8 уникальных непустых доменов");
      for (const c of candidates) {
        const label = c.name || c.domain || "?";
        for (const key of ["url", "sourceType", "sourceDetail", "observedFirstViewport", "observedMobile", "transferableMechanism"]) {
          if (String(c[key] || "").trim().length < 12) failures.push(`POOL.json ${label}: поле ${key} слишком короткое/пустое`);
        }
        const routes = Array.isArray(c.internalRoutes) ? c.internalRoutes.filter((u) => /^https?:\/\//i.test(String(u))) : [];
        if (routes.length < 2) failures.push(`POOL.json ${label}: internalRoutes содержит ${routes.length}, нужно ≥ 2 реальных URL`);
      }
      if (candidates.length === 8 && !failures.some((f) => f.startsWith("POOL.json"))) ok("pool registry: 8 кандидатов без квот по географии");
    } catch (e) {
      failures.push("POOL.json не парсится: " + (e && e.message));
    }
  }

  const capPath = path.join(root, ".design/research/references/captures.json");
  if (!fs.existsSync(capPath)) {
    failures.push("нет machine-отчёта: .design/research/references/captures.json");
  } else {
    try {
      const caps = JSON.parse(fs.readFileSync(capPath, "utf8"));
      const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
      for (const domain of poolDomains) {
        const home = (caps.items || []).find((it) => it.status === "ok" && it.pageType === "home" && hostOf(it.finalUrl || it.url) === domain);
        if (!home) { failures.push(`pool ${domain}: нет ok-захвата home`); continue; }
        for (const key of ["desktopFirst", "mobile"]) {
          const rel = home.files && home.files[key];
          if (!rel || !fs.existsSync(path.join(root, rel))) failures.push(`pool ${domain}: нет файла ${key}`);
        }
        if (!home.dom || home.dom.overlays !== 0) failures.push(`pool ${domain}: desktop-захват не подтверждает overlays=0`);
        if (!home.mobileDom || home.mobileDom.overlays !== 0) failures.push(`pool ${domain}: mobile-захват не подтверждает overlays=0`);
      }
    } catch (e) {
      failures.push("captures.json не парсится: " + (e && e.message));
    }
  }

  const boardRel = ".design/research/board-pool.png";
  if (exists(boardRel, 50)) {
    const reportRel = boardRel + ".report.json";
    if (!exists(reportRel, 50)) {
      failures.push(`${boardRel}: нет machine-отчёта board.mjs --captures`);
    } else {
      try {
        const report = JSON.parse(readText(reportRel));
        const items = Array.isArray(report.items) ? report.items : [];
        if (report.variant !== "desktopFirst" || items.length !== 8 || items.some((i) => i.pageType !== "home")) {
          failures.push(`${boardRel}: нужны ровно 8 home элементов variant=desktopFirst`);
        } else ok("board-pool: 8 первых экранов home");
      } catch (e) {
        failures.push(`${reportRel} не парсится: ${e && e.message}`);
      }
    }
  }
}

if (atLeast("research")) {
  let rejectedByUser = new Set();
  const poolPath = path.join(root, ".design/research/POOL.json");
  const selectionPath = path.join(root, ".design/research/POOL_SELECTION.json");
  if (!fs.existsSync(poolPath)) {
    failures.push("нет .design/research/POOL.json — сначала пройди stage research-pool");
  } else if (!fs.existsSync(selectionPath)) {
    failures.push("нет .design/research/POOL_SELECTION.json — глубокий Research нельзя начинать до пользовательского выбора board-pool");
  } else {
    try {
      const pool = JSON.parse(fs.readFileSync(poolPath, "utf8"));
      const selection = JSON.parse(fs.readFileSync(selectionPath, "utf8"));
      const poolDomains = (Array.isArray(pool.candidates) ? pool.candidates : []).map((c) => String(c.domain || "").toLowerCase().replace(/^www\./, ""));
      const approved = Array.isArray(selection.approved) ? selection.approved.map((d) => String(d).toLowerCase().replace(/^www\./, "")) : [];
      const rejected = Array.isArray(selection.rejected) ? selection.rejected.map((d) => String(d).toLowerCase().replace(/^www\./, "")) : [];
      const neutral = Array.isArray(selection.neutral) ? selection.neutral.map((d) => String(d).toLowerCase().replace(/^www\./, "")) : [];
      const classified = [...approved, ...rejected, ...neutral];
      rejectedByUser = new Set(rejected);
      if (selection.source !== "user") failures.push("POOL_SELECTION.json: source должен быть user");
      if (selection.decision !== "continue") failures.push("POOL_SELECTION.json: decision не continue — глубокий Research должен остановиться и заменить пул");
      if (!approved.length) failures.push("POOL_SELECTION.json: для continue нужен минимум один approved-кандидат");
      if (new Set(classified).size !== 8 || classified.length !== 8 || poolDomains.length !== 8 || poolDomains.some((d) => !classified.includes(d)) || classified.some((d) => !poolDomains.includes(d))) {
        failures.push("POOL_SELECTION.json: approved + rejected + neutral должны без повторов покрывать все 8 доменов POOL.json");
      }
      if (String(selection.note || "").trim().length < 10) failures.push("POOL_SELECTION.json: note слишком короткая — зафиксируй наблюдаемый ответ пользователя");
      if (!failures.some((f) => f.startsWith("POOL_SELECTION.json"))) ok("пользовательский выбор board-pool зафиксирован");
    } catch (e) {
      failures.push("POOL.json/POOL_SELECTION.json не парсится: " + (e && e.message));
    }
  }
  if (exists(".design/research/REFERENCES.md", 250)) {
    const t = readText(".design/research/REFERENCES.md");
    const sites = countMatches(/^##\s+/gm, t);
    if (sites < 4) failures.push(`REFERENCES.md: сайтов со своими секциями ${sites}, нужно ≥ 4`);
    else ok(`REFERENCES.md: ${sites} источников`);
    // «Источник» обязателен в КАЖДОЙ секции сайта, не один раз на файл
    const sections = t.split(/^##\s+/m).slice(1);
    const noSource = sections.filter((s) => !/источник|найден|search|gallery|запрос/i.test(s)).length;
    if (noSource > 0) failures.push(`REFERENCES.md: секций без строки «Источник»: ${noSource} из ${sections.length}`);
    else if (sections.length) ok(`«Источник» есть во всех ${sections.length} секциях`);
  }
  const shots = dirHas(".design/research/references", /\.png$/i, 8, "скриншотов");
  if (shots >= 8) ok(`скриншотов референсов: ${shots}`);
  const frags = dirHas(".design/research/fragments", /\.png$/i, 8, "фрагментов");
  if (frags >= 8) ok(`фрагментов: ${frags}`);
  exists(".design/research/FRAGMENTS.md", 100);
  if (exists(".design/SYNTHESIS.md", 150)) {
    const synthesis = readText(".design/SYNTHESIS.md");
    if (!/визуальн(ый|ого)\s+якор/i.test(synthesis)) failures.push("SYNTHESIS.md: нет раздела «Визуальный якорь»");
    if (!/ограничен(ие|ия)\s+влияни/i.test(synthesis)) failures.push("SYNTHESIS.md: нет раздела «Ограничение влияния» для art-direction источника");
  }

  // machine-отчёт захвата: у каждого финалиста уникальные home + inner и mobile именно у home
  const capPath = path.join(root, ".design/research/references/captures.json");
  if (!fs.existsSync(capPath)) {
    failures.push("нет machine-отчёта: .design/research/references/captures.json (захват — только capture.mjs urls)");
  } else {
    try {
      const caps = JSON.parse(fs.readFileSync(capPath, "utf8"));
      const hostOf = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };

      // ---- реестр финалистов: gate проверяет ПОЛНЫЙ набор кадров именно у заявленных четырёх ----
      const regPath = path.join(root, ".design/research/FINALISTS.json");
      if (!fs.existsSync(regPath)) {
        failures.push("нет реестра финалистов: .design/research/FINALISTS.json (формат: {finalists:[{name,domain,role}]}, ровно 4)");
      } else {
        let reg = null;
        try { reg = JSON.parse(fs.readFileSync(regPath, "utf8")); }
        catch (e) { failures.push("FINALISTS.json не парсится: " + (e && e.message)); }
        if (reg) {
          const fl = Array.isArray(reg.finalists) ? reg.finalists : null;
          if (!fl || fl.length !== 4) {
            failures.push(`FINALISTS.json: финалистов ${fl ? fl.length : 0}, нужно ровно 4`);
          } else {
            const doms = fl.map((f) => String(f.domain || "").toLowerCase());
            const roles = fl.map((f) => String(f.role || ""));
            if (new Set(doms).size !== 4) failures.push("FINALISTS.json: домены финалистов не уникальны");
            const requiredRoles = ["visual-anchor", "product-system", "art-direction", "commercial-ux"];
            if (new Set(roles).size !== 4 || !requiredRoles.every((r) => roles.includes(r))) failures.push(`FINALISTS.json: нужны ровно роли ${requiredRoles.join(", ")}`);
            const allowedLanes = new Set(["market", "product-craft", "craft", "curated"]);
            const allowedRelevance = new Set(["same-niche", "adjacent-product", "adjacent-craft"]);
            for (const f of fl) {
              if (!allowedLanes.has(f.lane)) failures.push(`FINALISTS.json ${f.name || f.domain}: lane должен быть market|product-craft|craft|curated`);
              if (!allowedRelevance.has(f.relevance)) failures.push(`FINALISTS.json ${f.name || f.domain}: relevance должен быть same-niche|adjacent-product|adjacent-craft`);
              const coverage = Array.isArray(f.coverage) ? f.coverage : [];
              if (!["home", "listing", "detail", "mobile"].every((x) => coverage.includes(x))) failures.push(`FINALISTS.json ${f.name || f.domain}: coverage должен включать home, listing, detail, mobile`);
              if (String(f.observedReason || "").trim().length < 40) failures.push(`FINALISTS.json ${f.name || f.domain}: observedReason слишком короткий — нужна наблюдаемая причина по кадрам`);
              if ((f.role === "visual-anchor" || f.role === "commercial-ux") && (f.lane !== "market" || f.relevance !== "same-niche")) {
                failures.push(`FINALISTS.json ${f.name || f.domain}: роль ${f.role} обязана быть market + same-niche`);
              }
              if (f.role === "product-system" && !["same-niche", "adjacent-product"].includes(f.relevance)) failures.push(`FINALISTS.json ${f.name || f.domain}: product-system не может быть adjacent-craft`);
              if (rejectedByUser.has(String(f.domain || "").toLowerCase().replace(/^www\./, ""))) failures.push(`FINALISTS.json ${f.name || f.domain}: кандидат отклонён пользователем в POOL_SELECTION.json`);
            }
            if (fl.filter((f) => f.relevance === "adjacent-craft").length > 1) failures.push("FINALISTS.json: adjacent-craft финалистов больше одного — набор снова перекошен в архитектурную/портфолио эстетику");
            for (const f of fl) {
              if (!f.name) failures.push(`FINALISTS.json: финалист без name (${f.domain})`);
              const host = String(f.domain || "").toLowerCase();
              const homeItems = (caps.items || []).filter((it) =>
                it.status === "ok" && it.pageType === "home" && hostOf(it.finalUrl || it.url) === host
                && it.files && it.files.desktopFirst && fs.existsSync(path.join(root, it.files.desktopFirst))
                && it.files.mobile && fs.existsSync(path.join(root, it.files.mobile)));
              const homeOk = homeItems.length > 0;
              const innerOk = (caps.items || []).filter((it) =>
                it.status === "ok" && it.pageType === "inner" && hostOf(it.finalUrl || it.url) === host
                && it.files && it.files.desktopFirst && fs.existsSync(path.join(root, it.files.desktopFirst)));
              if (!homeOk) failures.push(`финалист ${f.name || host} (${host}): нет чистого ok-захвата home desktop+mobile — источник без полного набора не финалист, а дополнительный imagery-source`);
              if (innerOk.length < 2) failures.push(`финалист ${f.name || host} (${host}): чистых inner ${innerOk.length}, нужно ≥ 2`);
              const urlKey = (it) => { try { const u = new URL(it.finalUrl || it.url); return u.hostname.replace(/^www\./, "") + u.pathname.replace(/\/$/, ""); } catch { return ""; } };
              const innerKeys = new Set(innerOk.map(urlKey));
              if (homeItems.some((it) => innerKeys.has(urlKey(it)))) failures.push(`финалист ${f.name || host} (${host}): home дублирует URL внутренней страницы`);
            }
            if (!failures.some((x) => String(x).startsWith("финалист "))) ok(`реестр финалистов проверен: ${fl.map((f) => f.name).join(", ")}`);
          }
        }
      }

      // честность ok-кадров: без остаточных оверлеев и с first-экранами, снятыми наверху
      for (const it of caps.items || []) {
        if (it.status !== "ok") continue;
        const ov = it.dom && it.dom.overlays;
        if (typeof ov !== "number") failures.push(`${it.name}: в machine-отчёте нет dom.overlays (устаревший захват — пересними capture.mjs urls)`);
        else if (ov > 0) failures.push(`${it.name}: ok-захват с остаточным overlay (${ov}) — cookie/CAPTCHA попали в кадр`);
        const fv = it.firstViewport;
        if (!fv || typeof fv.scrollY !== "number") failures.push(`${it.name}: нет firstViewport.scrollY (устаревший захват — пересними)`);
        else if (fv.scrollY > 2) failures.push(`${it.name}: desktop-first снят при scrollY=${fv.scrollY}`);
        // поведенческая проверка обязана была пройти: закреплённых в viewport панелей нет
        for (const pk of ["pinnedDesktop", "pinnedAfterFull", "pinnedMobile"]) {
          if (it[pk] && it[pk].length) failures.push(`${it.name}: ok-захват с закреплёнными в viewport элементами (${pk}: ${it[pk].length})`);
        }
        if (it.files && it.files.mobile) {
          const mv = it.mobileViewport;
          if (!mv || typeof mv.scrollY !== "number") failures.push(`${it.name}: есть mobile-файл, но нет mobileViewport.scrollY`);
          else if (mv.scrollY > 2) failures.push(`${it.name}: mobile-first снят при scrollY=${mv.scrollY}`);
          const md = it.mobileDom;
          if (!md || typeof md.overlays !== "number") failures.push(`${it.name}: есть mobile-файл, но нет mobileDom.overlays (устаревший захват — пересними)`);
          else if (md.overlays > 0) failures.push(`${it.name}: mobile-кадр с остаточным overlay (${md.overlays})`);
        }
      }

      // ---- достоверность фрагментов: заявленные элементы обязаны быть в «Что видно»,
      // ---- источник — ok-кадр machine-захвата, каждый PNG описан, лишних PNG нет
      const fragDir = path.join(root, ".design/research/fragments");
      const fragMd = readText(".design/research/FRAGMENTS.md");
      const fragSections = fragMd.split(/^##\s+/m).slice(1);
      if (!fragSections.length) failures.push("FRAGMENTS.md: нет секций ## F…");
      const claimedFiles = [];
      const fragTypes = [];
      for (const s of fragSections) {
        const title = s.split("\n")[0].trim();
        const file = (s.match(/^(?:-\s*)?Файл:\s*(\S+\.png)\s*$/m) || [])[1];
        const declared = (s.match(/^(?:-\s*)?Заявлено:\s*(.+)$/m) || [])[1];
        const visible = (s.match(/^(?:-\s*)?Что видно:\s*(.+)$/m) || [])[1];
        const type = (s.match(/^(?:-\s*)?Тип:\s*(composition|media|type|interaction|commercial|mobile)\s*$/mi) || [])[1];
        const srcLine = (s.match(/^(?:-\s*)?Источник:\s*(.+)$/m) || [])[1] || "";
        const srcMatches = [...srcLine.matchAll(/([A-Za-z0-9а-яё_-][A-Za-z0-9а-яё_.-]*\.png)/gi)];
        const srcFile = srcMatches.length ? srcMatches[srcMatches.length - 1][1] : null;
        if (!file || !declared || !visible || !srcFile || !type) {
          failures.push(`FRAGMENTS.md «${title}»: нужны строки Файл:, Тип:, Заявлено:, Источник: (…png), Что видно:`);
          continue;
        }
        claimedFiles.push(file);
        fragTypes.push(type.toLowerCase());
        if (!fs.existsSync(path.join(fragDir, file))) failures.push(`фрагмент ${file}: нет файла в fragments/`);
        for (const tokRaw of declared.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)) {
          if (!visible.toLowerCase().includes(tokRaw)) failures.push(`фрагмент ${file}: заявлено «${tokRaw}», но в «Что видно» этого элемента нет — подпись не соответствует кадру`);
        }
        const srcOk = (caps.items || []).some((it) => it.status === "ok" && it.files
          && Object.values(it.files).some((v) => typeof v === "string" && (v.endsWith("/" + srcFile) || v === srcFile)));
        if (!srcOk) failures.push(`фрагмент ${file}: источник ${srcFile} не является ok-кадром captures.json`);
      }
      const typeCount = (type) => fragTypes.filter((x) => x === type).length;
      if (typeCount("media") < 2) failures.push(`FRAGMENTS.md: media-фрагментов ${typeCount("media")}, нужно ≥ 2`);
      if (typeCount("commercial") < 1) failures.push("FRAGMENTS.md: нет commercial-фрагмента");
      if (typeCount("mobile") < 1) failures.push("FRAGMENTS.md: нет mobile-фрагмента");
      if (typeCount("composition") > 3) failures.push(`FRAGMENTS.md: composition-фрагментов ${typeCount("composition")}, максимум 3`);
      if (typeCount("type") > 2) failures.push(`FRAGMENTS.md: type-фрагментов ${typeCount("type")}, максимум 2`);
      if (fs.existsSync(fragDir)) {
        const orphans = fs.readdirSync(fragDir).filter((f) => /\.png$/i.test(f) && !claimedFiles.includes(f));
        if (orphans.length) failures.push(`фрагменты без описания в FRAGMENTS.md: ${orphans.join(", ")}`);
      }

      // три обязательных борда; pool и deep — только из machine-отчёта board.mjs --captures
      const boardFromReport = (pngRel, expectType, expectVariant, minCount) => {
        const png = path.join(root, pngRel);
        if (!fs.existsSync(png)) { failures.push(`нет борда: ${pngRel}`); return; }
        const repPath = pngRel + ".report.json";
        if (!fs.existsSync(path.join(root, repPath))) {
          failures.push(`${pngRel}: нет machine-отчёта — борд собран не через board.mjs --captures (передача всей папки references запрещена)`);
          return;
        }
        try {
          const r = JSON.parse(fs.readFileSync(path.join(root, repPath), "utf8"));
          const items = r.items || [];
          const badType = items.filter((i) => i.pageType !== expectType);
          if (badType.length) failures.push(`${pngRel}: содержит не-${expectType} страницы: ${badType.map((b) => b.name).slice(0, 4).join(", ")}`);
          if (r.variant !== expectVariant) failures.push(`${pngRel}: variant=${r.variant}, ожидался ${expectVariant}`);
          if (items.length < minCount) failures.push(`${pngRel}: элементов ${items.length}, нужно ≥ ${minCount}`);
          for (const i of items) {
            if (!fs.existsSync(path.join(root, i.file))) failures.push(`${pngRel}: нет файла ${i.file}`);
          }
        } catch (e) {
          failures.push(`${repPath} не парсится: ${e && e.message}`);
        }
      };
      boardFromReport(".design/research/board-pool.png", "home", "desktopFirst", 8);
      boardFromReport(".design/research/board-finalists-deep.png", "inner", "desktopFirst", 8);
      exists(".design/research/board-fragments.png", 50);
    } catch (e) {
      failures.push("captures.json не парсится: " + (e && e.message));
    }
  }
}

if (atLeast("direction")) {
  if (projectMode === "COMMISSIONED") {
    const waiverRel = ".design/client-source/CLIENT_SOURCE_WAIVER.md";
    if (fs.existsSync(path.join(root, waiverRel))) {
      const waiver = readText(waiverRel);
      clientSourceWaiver = /USER_DECISION:/i.test(waiver) && /ACCEPTED_GAPS:/i.test(waiver) && waiver.trim().length >= 120;
      if (!clientSourceWaiver) failures.push("CLIENT_SOURCE_WAIVER.md: нужны USER_DECISION, ACCEPTED_GAPS и точная граница разрешения");
    }
    if (!clientSourceWaiver) {
      if (!/SOURCE_STATUS:\s*SOURCE_AVAILABLE\b/i.test(clientSourceText) || !/SOURCE_READINESS:\s*COMPLETE\b/i.test(clientSourceText)) {
        failures.push("PRE_DESIGN_NOT_READY: COMMISSIONED требует SOURCE_STATUS: SOURCE_AVAILABLE и SOURCE_READINESS: COMPLETE");
      }
      if (!/MEDIA_READINESS:\s*READY\b/i.test(clientSourceText)) {
        failures.push("PRE_DESIGN_NOT_READY: COMMISSIONED требует MEDIA_READINESS: READY либо явный CLIENT_SOURCE_WAIVER.md пользователя");
      }
      if (exists(".design/client-source/source-register.json", 80)) {
        try {
          const reg = JSON.parse(readText(".design/client-source/source-register.json"));
          const sources = Array.isArray(reg.sources) ? reg.sources : [];
          if (!sources.length || sources.some((s) => !/^https?:\/\//i.test(String(s && s.url || "")) || !String(s && s.status || "").trim())) {
            failures.push("source-register.json: нужен хотя бы один источник с URL и status");
          }
        } catch (e) { failures.push("source-register.json не парсится: " + (e && e.message)); }
      }
      if (exists(".design/client-source/client-media.json", 80)) {
        try {
          const cm = JSON.parse(readText(".design/client-source/client-media.json"));
          const items = Array.isArray(cm) ? cm : Array.isArray(cm.media) ? cm.media : [];
          if (items.length < 4) failures.push(`client-media.json: медиа ${items.length}, для MEDIA_READINESS READY нужно ≥ 4`);
        } catch (e) { failures.push("client-media.json не парсится: " + (e && e.message)); }
      }
      exists(".design/client-source/client-media-board.png", 50);
      if (exists(".design/client-source/brand-assets.json", 40)) {
        try {
          const ba = JSON.parse(readText(".design/client-source/brand-assets.json"));
          const assets = Array.isArray(ba) ? ba : Array.isArray(ba.assets) ? ba.assets : [];
          if (assets.length > 0) exists(".design/client-source/brand-source-board.png", 50);
        } catch (e) { failures.push("brand-assets.json не парсится: " + (e && e.message)); }
      }
    } else ok("client source: пользователь явно принял перечисленные пробелы");
  }
  const hasAccepted = fs.existsSync(path.join(root, ".design/ACCEPTED.md"));
  const hasFinalTokens = fs.existsSync(path.join(root, ".design/DESIGN_TOKENS.md"));
  if (hasAccepted || hasFinalTokens) {
    exists(".design/ACCEPTED.md", 20);
    exists(".design/DESIGN_TOKENS.md", 150);
    if (hasAccepted && hasFinalTokens) ok("пользовательский выбор и финальные токены зафиксированы");
  } else if (stage === "direction" && fs.existsSync(path.join(root, ".design/style-lab"))) {
    ok("набор готов к пользовательскому выбору; ACCEPTED.md и финальные токены ещё не требуются");
  } else {
    failures.push("после Direction нет .design/ACCEPTED.md и .design/DESIGN_TOKENS.md — Page Targets/Build начинать нельзя до выбора пользователя");
  }
  const conceptFiles = dirHas(".design/style-lab", /^concept-\d+\.html$/i, 3, "концептов");
  if (conceptFiles !== 3) failures.push(`.design/style-lab: концептов ${conceptFiles}, нужно ровно 3`);
  else ok("концептов: ровно 3");

  // Direction без реального media pack не начинается: заглушки скрывают качество композиции.
  let allowedMedia = [];
  if (exists(".design/media/project-media.json", 80)) {
    try {
      const manifest = JSON.parse(readText(".design/media/project-media.json"));
      allowedMedia = (Array.isArray(manifest.media) ? manifest.media : [])
        .map((m) => typeof m === "string" ? m : m && m.path)
        .filter(Boolean)
        .map((p) => String(p).replace(/\\/g, "/"));
      if (allowedMedia.length < 4) failures.push(`project-media.json: реальных файлов ${allowedMedia.length}, нужно ≥ 4`);
      for (const rel of allowedMedia) {
        if (!fs.existsSync(path.join(root, rel))) failures.push(`project-media.json: нет файла ${rel}`);
      }
      if (allowedMedia.length >= 4) ok(`project media: ${allowedMedia.length} файлов`);
    } catch (e) {
      failures.push("project-media.json не парсится: " + (e && e.message));
    }
  }
  exists(".design/media/project-media-board.png", 50);

  // Контракты фиксируют измеримые различия и доказуемые source→output переносы до HTML.
  const contractAxes = ["heroGeometry", "navigationModel", "contentRhythm", "mediaRole", "typeSystem", "colorStrategy", "signatureElement"];
  if (exists(".design/style-lab/DIRECTION_CONTRACTS.json", 250)) {
    try {
      const dc = JSON.parse(readText(".design/style-lab/DIRECTION_CONTRACTS.json"));
      const concepts = Array.isArray(dc.concepts) ? dc.concepts : [];
      if (concepts.length !== 3) failures.push(`DIRECTION_CONTRACTS.json: концептов ${concepts.length}, нужно ровно 3`);
      const ids = concepts.map((c) => String(c.id || ""));
      if (new Set(ids).size !== 3 || !["concept-1", "concept-2", "concept-3"].every((id) => ids.includes(id))) {
        failures.push("DIRECTION_CONTRACTS.json: нужны уникальные id concept-1, concept-2, concept-3");
      }
      for (const c of concepts) {
        const requiredConceptFields = ["designQuestion", "archetype", "compositionFamily", ...contractAxes];
        if (clientBrandAuditRequired) requiredConceptFields.push("brandTreatment");
        for (const key of requiredConceptFields) {
          if (String(c[key] || "").trim().length < 12) failures.push(`DIRECTION_CONTRACTS.json ${c.id || "?"}: поле ${key} слишком короткое/пустое`);
        }
        const sourceFragments = Array.isArray(c.sourceFragments) ? [...new Set(c.sourceFragments.map((x) => String(x).toUpperCase()))] : [];
        if (sourceFragments.length < 2 || sourceFragments.length > 4 || sourceFragments.some((x) => !/^F\d{2,3}$/.test(x))) {
          failures.push(`DIRECTION_CONTRACTS.json ${c.id || "?"}: sourceFragments должен содержать 2–4 уникальных ID F01…`);
        }
        const transfers = Array.isArray(c.sourceTransfers) ? c.sourceTransfers : [];
        const transferIds = transfers.map((x) => String(x && x.fragment || "").toUpperCase());
        if (transfers.length !== sourceFragments.length || new Set(transferIds).size !== sourceFragments.length || sourceFragments.some((x) => !transferIds.includes(x))) {
          failures.push(`DIRECTION_CONTRACTS.json ${c.id || "?"}: для каждого sourceFragments нужна ровно одна sourceTransfers запись`);
        }
        for (const tr of transfers) {
          for (const key of ["observedRelation", "transfer", "mutation"]) {
            if (String(tr && tr[key] || "").trim().length < 20) failures.push(`DIRECTION_CONTRACTS.json ${c.id || "?"}: sourceTransfers.${key} слишком короткое/пустое`);
          }
        }
      }
      const norm = (v) => String(v || "").toLowerCase().replace(/[^a-zа-яё0-9]+/gi, " ").trim();
      for (let i = 0; i < concepts.length; i++) {
        for (let j = i + 1; j < concepts.length; j++) {
          const different = contractAxes.filter((key) => norm(concepts[i][key]) !== norm(concepts[j][key])).length;
          if (different < 5) failures.push(`DIRECTION_CONTRACTS.json: ${concepts[i].id}/${concepts[j].id} различаются только по ${different}/7 осям, нужно ≥ 5`);
          if (norm(concepts[i].compositionFamily) === norm(concepts[j].compositionFamily)) failures.push(`DIRECTION_CONTRACTS.json: ${concepts[i].id}/${concepts[j].id} повторяют compositionFamily`);
          const a = new Set((concepts[i].sourceFragments || []).map((x) => String(x).toUpperCase()));
          const overlap = (concepts[j].sourceFragments || []).filter((x) => a.has(String(x).toUpperCase())).length;
          if (overlap > 1) failures.push(`DIRECTION_CONTRACTS.json: ${concepts[i].id}/${concepts[j].id} пересекаются по ${overlap} sourceFragments, допустим максимум 1`);
        }
      }
      if (concepts.length === 3 && !failures.some((f) => f.startsWith("DIRECTION_CONTRACTS.json"))) ok("контракты: 3 направления различимы");
    } catch (e) {
      failures.push("DIRECTION_CONTRACTS.json не парсится: " + (e && e.message));
    }
  }

  for (const f of fs.existsSync(path.join(root, ".design/style-lab"))
    ? fs.readdirSync(path.join(root, ".design/style-lab")).filter((x) => /^concept-\d+\.html$/i.test(x))
    : []) {
    const t = readText(".design/style-lab/" + f);
    if (!/<!--\s*TOKENS/i.test(t)) failures.push(`${f}: нет provisional-токенов в комментарии <!-- TOKENS: … -->`);
    if (/PHOTO\s*SLOT|ФОТО\s*СЛОТ|IMAGE\s*SLOT|MEDIA\s*SLOT|UNSPLASH[- /]PEXELS|ФОТО\s+ДОБАВ/i.test(t)) {
      failures.push(`${f}: найдена медиа-заглушка — Direction допускает только реальные изображения из project-media.json`);
    }
    const used = new Set();
    for (const mediaPath of allowedMedia) {
      const base = path.basename(mediaPath);
      if (t.includes(mediaPath) || t.includes("/" + mediaPath.replace(/^public\//, "")) || t.includes(base)) used.add(mediaPath);
    }
    if (used.size < 2) failures.push(`${f}: использовано реальных media-файлов из manifest ${used.size}, нужно ≥ 2`);
    else ok(`${f}: media ${used.size}`);
  }
  const shots = dirHas(".design/style-lab/shots", /\.png$/i, 12, "скриншотов концептов");
  if (shots >= 12) ok(`скриншотов концептов: ${shots}`);
  exists(".design/style-lab/concept-board.png", 50);
  exists(".design/style-lab/reference-trace-board.png", 50);
  for (const id of ["concept-1", "concept-2", "concept-3"]) {
    const count = fs.existsSync(path.join(root, ".design/style-lab/shots"))
      ? fs.readdirSync(path.join(root, ".design/style-lab/shots")).filter((f) => f.toLowerCase().startsWith(id) && /\.png$/i.test(f)).length
      : 0;
    if (count < 4) failures.push(`shots: для ${id} кадров ${count}, нужно ≥ 4`);
  }

  // Сравнительный reviewer обязан ранжировать и отбраковать, а не rubber-stamp все варианты.
  if (exists(".design/style-lab/DIRECTION_REVIEW.json", 300)) {
    try {
      const review = JSON.parse(readText(".design/style-lab/DIRECTION_REVIEW.json"));
      if (review.reviewerMode !== "independent-read-only") failures.push("DIRECTION_REVIEW.json: reviewerMode должен быть independent-read-only");
      const items = Array.isArray(review.concepts) ? review.concepts : [];
      const validIds = new Set(["concept-1", "concept-2", "concept-3"]);
      if (items.length !== 3 || new Set(items.map((i) => i.id)).size !== 3 || items.some((i) => !validIds.has(i.id))) {
        failures.push("DIRECTION_REVIEW.json: нужны наблюдения по concept-1, concept-2 и concept-3");
      }
      const verdicts = new Set(["advance", "rework", "reject"]);
      for (const i of items) {
        if (!verdicts.has(i.verdict)) failures.push(`DIRECTION_REVIEW.json ${i.id || "?"}: verdict должен быть advance|rework|reject`);
        if (String(i.observedStrength || "").trim().length < 20 || String(i.observedWeakness || "").trim().length < 20) {
          failures.push(`DIRECTION_REVIEW.json ${i.id || "?"}: нужны конкретные observedStrength и observedWeakness`);
        }
        if (String(i.referenceFit || "").trim().length < 20 || String(i.genericityRisk || "").trim().length < 20) {
          failures.push(`DIRECTION_REVIEW.json ${i.id || "?"}: нужны конкретные referenceFit и genericityRisk`);
        }
        if (clientBrandAuditRequired && String(i.brandFit || "").trim().length < 20) failures.push(`DIRECTION_REVIEW.json ${i.id || "?"}: при доступной идентичности нужен конкретный brandFit`);
      }
      if (!items.some((i) => i.verdict === "rework" || i.verdict === "reject")) failures.push("DIRECTION_REVIEW.json: нельзя принять все три; минимум один verdict rework/reject");
      if (!validIds.has(review.recommended) || !validIds.has(review.weakest) || review.recommended === review.weakest) {
        failures.push("DIRECTION_REVIEW.json: recommended и weakest должны быть разными id концептов");
      }
      const motifs = Array.isArray(review.sharedMotifs) ? review.sharedMotifs.filter((x) => String(x).trim().length >= 10) : [];
      if (!motifs.length) failures.push("DIRECTION_REVIEW.json: sharedMotifs пуст — reviewer не проверил повторяемость направлений");
      const evidence = Array.isArray(review.evidence) ? review.evidence : [];
      if (evidence.length < 6) failures.push(`DIRECTION_REVIEW.json: evidence ${evidence.length}, нужно ≥ 6 реальных PNG`);
      for (const rel of evidence) {
        if (!fs.existsSync(path.join(root, String(rel)))) failures.push(`DIRECTION_REVIEW.json: нет evidence-файла ${rel}`);
      }
      const referenceEvidence = Array.isArray(review.referenceEvidence) ? review.referenceEvidence : [];
      if (referenceEvidence.length < 3) failures.push(`DIRECTION_REVIEW.json: referenceEvidence ${referenceEvidence.length}, нужно ≥ 3 fragment PNG`);
      for (const rel of referenceEvidence) {
        if (!fs.existsSync(path.join(root, String(rel)))) failures.push(`DIRECTION_REVIEW.json: нет referenceEvidence-файла ${rel}`);
      }
      if (!failures.some((f) => f.startsWith("DIRECTION_REVIEW.json"))) ok(`review: recommended ${review.recommended}, weakest ${review.weakest}`);
    } catch (e) {
      failures.push("DIRECTION_REVIEW.json не парсится: " + (e && e.message));
    }
  }
}

if (atLeast("targets")) {
  exists(".design/ROUTE_CONTRACTS.md", 150);
  const t = readText(".design/ROUTE_CONTRACTS.md");
  const routes = countMatches(/^##\s+/gm, t);
  const targets = dirHas(".design/targets", /\.html$/i, Math.max(2, routes || 2), "HTML-targets");
  if (routes >= 2 && targets >= routes) ok(`контрактов: ${routes}, targets: ${targets}`);
  const shots = dirHas(".design/targets/shots", /\.png$/i, targets * 2 || 4, "скриншотов targets");
  if (shots >= (targets * 2 || 4)) ok(`скриншотов targets: ${shots}`);
}

if (atLeast("build")) {
  if (exists(".design/DELIVERY.json", 40)) {
    let d = null;
    try { d = JSON.parse(readText(".design/DELIVERY.json")); }
    catch { failures.push("DELIVERY.json не парсится"); }
    if (d) {
      if (!Array.isArray(d.routes) || !d.routes.length) failures.push("DELIVERY.json: routes пуст");
      else {
        let withAudit = 0;
        let p1Total = 0;
        for (const r of d.routes) {
          if (!r.path || !r.audit) { failures.push(`маршрут без path/audit: ${JSON.stringify(r).slice(0, 80)}`); continue; }
          if (!fs.existsSync(path.join(root, r.audit))) failures.push(`нет файла аудита: ${r.audit}`);
          else {
            const a = JSON.parse(fs.readFileSync(path.join(root, r.audit), "utf8"));
            if (a.verdict !== "TECHNICAL_PASS") failures.push(`${r.path}: последний аудит ${a.verdict}`);
            else withAudit++;
            const p1 = a.counts ? a.counts.p1 : (a.p1 || []).length;
            p1Total += p1 || 0;
          }
        }
        if (withAudit) ok(`маршрутов с TECHNICAL_PASS: ${withAudit}/${d.routes.length}`);
        if (stage === "release" && p1Total > 0) {
          const waiverPath = path.join(root, ".design/qa/WAIVER.md");
          let waived = false;
          if (fs.existsSync(waiverPath)) {
            const w = fs.readFileSync(waiverPath, "utf8");
            const m = w.match(/P1:\s*(\d+)/);
            const declared = m ? parseInt(m[1], 10) : null;
            const sizeOk = Buffer.byteLength(w, "utf8") >= 100;
            const confirmed = /подтвержд/i.test(w);
            const countOk = declared === p1Total;
            if (sizeOk && confirmed && countOk) waived = true;
            else {
              const why = [];
              if (!sizeOk) why.push("файл меньше 100 байт");
              if (!confirmed) why.push("нет слов подтверждения пользователем");
              if (!countOk) why.push(`строка «P1: <число>» отсутствует или не равна фактическим ${p1Total}`);
              failures.push(`WAIVER.md невалиден: ${why.join("; ")}. Формат: перечислены принятые P1, причина каждого, строка «P1: ${p1Total}» и отметка о подтверждении пользователем.`);
            }
          }
          if (waived) ok(`P1: ${p1Total} (осознанно приняты, см. .design/qa/WAIVER.md)`);
          else if (!fs.existsSync(waiverPath)) {
            failures.push(`P1 без waiver: ${p1Total}. Исправь, либо зафиксируй осознанное решение пользователя в .design/qa/WAIVER.md (перечень P1 + причины + строка «P1: ${p1Total}» + подтверждение пользователем)`);
          }
        }
      }
      if (stage === "release") {
        if (d.contacts) {
          const c = JSON.stringify(d.contacts).toLowerCase();
          if (/todo|tbd|lorem|example\.com|000-00|\.invalid|\.\.\./.test(c)) failures.push("contacts в DELIVERY.json содержит заглушки");
        } else if (d.mode === "commercial") {
          failures.push("commercial-проект требует contacts в DELIVERY.json");
        }
        if (Array.isArray(d.sources) && d.sources.length) {
          const bad = [];
          const files = d.sources.flatMap((s) => walkFiles(path.join(root, s)));
          for (const s of files) {
            const t = fs.readFileSync(s, "utf8");
            if (/lorem ipsum/i.test(t)) bad.push(path.relative(root, s) + " (lorem)");
            if (/TODO:|FIXME:/.test(t)) bad.push(path.relative(root, s) + " (TODO)");
          }
          if (bad.length) failures.push("в исходниках: " + bad.slice(0, 5).join(", "));
        }
      }
    }
  }
}

// ---------- итог ----------
console.log(`\n${failures.length ? "GATE_FAIL" : "GATE_PASS"} — stage ${stage}`);
for (const n of notes) console.log("  ✓ " + n);
for (const f of failures) console.log("  ✗ " + f);
process.exit(failures.length ? 1 : 0);
