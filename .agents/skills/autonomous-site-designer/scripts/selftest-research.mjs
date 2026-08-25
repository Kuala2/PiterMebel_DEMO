// Регрессионный selftest research-гейта: гейт обязан ловить расхождение заявленных
// и фактических финалистов и фрагменты, у которых заявленный элемент отсутствует
// в описании кадра. Собирает валидный фикстурный проект, затем мутирует его.
//   node selftest-research.mjs    (зависимостей нет, gate.mjs запускается как процесс)
// Exit: 0 PASS · 1 FAIL.
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const GATE = path.join(path.dirname(fileURLToPath(import.meta.url)), "gate.mjs");
const PNG = Buffer.from("89504e470d0a1a0a0000000d49484452", "hex");

const FINALISTS = ["alpha.ru", "beta.ru", "delta.ru", "epsilon.ru"];
const POOL = ["zeta.ru", "eta.ru", "theta.ru", "iota.ru"];

function okItem(name, host, pageType, withMobile) {
  const route = pageType === "inner" ? `/${name}` : "/";
  const files = {
    desktopFirst: `.design/research/references/${name}-desktop-first.png`,
    desktopFull: `.design/research/references/${name}-desktop-full.png`,
  };
  if (withMobile) files.mobile = `.design/research/references/${name}-mobile-first.png`;
  return {
    name, url: `https://${host}${route}`, finalUrl: `https://${host}${route}`, pageType, status: "ok", reasons: [],
    files,
    dom: { textLength: 640, mediaCount: 4, overlays: 0 },
    firstViewport: { scrollY: 0, viewportWidth: 1440, viewportHeight: 1000 },
    ...(withMobile ? {
      mobileViewport: { scrollY: 0, viewportWidth: 390, viewportHeight: 844 },
      mobileDom: { textLength: 500, mediaCount: 3, overlays: 0 },
    } : {}),
    pinnedDesktop: [], pinnedAfterFull: [], pinnedMobile: [],
  };
}

function buildFixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "rs-gate-"));
  const refs = path.join(root, ".design/research/references");
  const frags = path.join(root, ".design/research/fragments");
  fs.mkdirSync(refs, { recursive: true });
  fs.mkdirSync(frags, { recursive: true });
  fs.writeFileSync(path.join(root, ".design/BRIEF.md"), `# BRIEF\n\n## Факты\nТестовый мебельный проект с подтверждённой нишей и городом.\n\n## Неизвестное\n[цены], [сроки], [контакты], [материалы] остаются полями до подтверждения.\n\n## Маршруты страниц\nГлавная ведёт к заявке; listing помогает выбрать; detail доказывает конкретный проект.\n\n## UX-каркас\nВопрос клиента → доказательство → ответ на возражение → действие.\n\n## Анти-качества и запреты\nНет шаблонных карточек, выдуманных фактов, слабого mobile, случайных кропов и одинаковых страниц.\n`);

  const items = [];
  for (const [i, host] of FINALISTS.entries()) {
    items.push(okItem(`f${i + 1}`, host, "home", true));
    items.push(okItem(`f${i + 1}-inner-1`, host, "inner", false));
    items.push(okItem(`f${i + 1}-inner-2`, host, "inner", false));
  }
  for (const [i, host] of POOL.entries()) items.push(okItem(`p${i + 1}`, host, "home", true));
  for (const it of items) for (const f of Object.values(it.files)) fs.writeFileSync(path.join(root, f), PNG);

  fs.writeFileSync(path.join(refs, "captures.json"), JSON.stringify({ capturedAt: new Date().toISOString(), mode: "urls", items }));

  const poolRep = { variant: "desktopFirst", items: items.filter((i) => i.pageType === "home").map((i) => ({ name: i.name, pageType: "home", file: i.files.desktopFirst, finalUrl: i.finalUrl })) };
  const deepRep = { variant: "desktopFirst", items: items.filter((i) => i.pageType === "inner").map((i) => ({ name: i.name, pageType: "inner", file: i.files.desktopFirst, finalUrl: i.finalUrl })) };
  fs.writeFileSync(path.join(root, ".design/research/board-pool.png"), Buffer.concat([PNG, PNG, PNG, PNG]));
  fs.writeFileSync(path.join(root, ".design/research/board-pool.png.report.json"), JSON.stringify(poolRep));
  fs.writeFileSync(path.join(root, ".design/research/board-finalists-deep.png"), PNG);
  fs.writeFileSync(path.join(root, ".design/research/board-finalists-deep.png.report.json"), JSON.stringify(deepRep));
  fs.writeFileSync(path.join(root, ".design/research/board-fragments.png"), Buffer.concat([PNG, PNG, PNG, PNG]));

  const allDomains = [...FINALISTS, ...POOL];
  fs.writeFileSync(path.join(root, ".design/research/DISCOVERY.md"), Array.from({ length: 20 }, (_, i) => `## Candidate ${i + 1}\n- URL: https://discovery-${i + 1}.example/site\n- Source: commercial search\n- Decision: ${i < 12 ? "screen — проверяем визуально" : "reject — слабая иерархия"}\n`).join("\n"));
  fs.writeFileSync(path.join(root, ".design/research/POOL.json"), JSON.stringify({
    candidates: allDomains.map((domain, i) => ({
      name: `candidate-${i + 1}`, domain, url: `https://${domain}/`, sourceType: "commercial-search",
      sourceDetail: `Запрос по продукту и городу, позиция ${i + 1}`,
      observedFirstViewport: "Ясный визуальный центр, крупное фото и читаемая иерархия",
      observedMobile: "Отдельная мобильная композиция без горизонтального overflow",
      internalRoutes: [`https://${domain}/projects`, `https://${domain}/about`],
      transferableMechanism: "Наблюдаемый механизм подачи продукта и следующего действия"
    }))
  }, null, 2));
  fs.writeFileSync(path.join(root, ".design/research/POOL_SELECTION.json"), JSON.stringify({
    source: "user", decision: "continue", approved: ["alpha.ru", "beta.ru"], rejected: ["iota.ru"],
    neutral: ["delta.ru", "epsilon.ru", "zeta.ru", "eta.ru", "theta.ru"],
    note: "Пользователь выбрал два сильных направления и отклонил один слабый первый экран."
  }, null, 2));

  fs.writeFileSync(path.join(root, ".design/research/FINALISTS.json"), JSON.stringify({
    finalists: FINALISTS.map((host, i) => ({
      name: `finalist-${i + 1}`, domain: host,
      role: ["visual-anchor", "product-system", "art-direction", "commercial-ux"][i],
      lane: ["market", "product-craft", "curated", "market"][i],
      relevance: ["same-niche", "adjacent-product", "adjacent-craft", "same-niche"][i],
      coverage: ["home", "listing", "detail", "mobile"],
      observedReason: "Наблюдаемая система сохраняет иерархию, медиа и навигацию на home, внутренних страницах и mobile."
    })),
  }, null, 2));

  let fragMd = "# FRAGMENTS\n\n";
  for (let i = 1; i <= 8; i++) {
    const src = i <= 4 ? `f${i}-desktop-first.png` : `f${((i - 5) % 4) + 1}-inner-1-desktop-first.png`;
    fs.writeFileSync(path.join(frags, `F0${i}-fixture.png`), PNG);
    const type = ["media", "media", "composition", "composition", "type", "commercial", "mobile", "interaction"][i - 1];
    fragMd += `## F0${i} — фикстура ${i}\nФайл: F0${i}-fixture.png\nТип: ${type}\nЗаявлено: фото, сетка\nИсточник: fixture-${i}.ru (home, ${src})\nЧто видно: на кропе видно крупное фото и сетка карточек в две колонки\nБерём: ритм\nНе берём: палитру\nКуда: listing\n\n`;
  }
  fs.writeFileSync(path.join(root, ".design/research/FRAGMENTS.md"), fragMd);

  let refMd = "# REFERENCES\n\n";
  for (const [i, host] of FINALISTS.entries()) refMd += `## finalist-${i + 1} — ${host}\nИсточник: фикстура. Наблюдаемое: фото и сетка. Берём: ритм. Не берём: палитру.\n\n`;
  fs.writeFileSync(path.join(root, ".design/research/REFERENCES.md"), refMd);
  fs.writeFileSync(path.join(root, ".design/SYNTHESIS.md"), "# SYNTHESIS\n\nТезис проекта: правда бизнеса → ощущение → визуальное поведение. Ядро: сетка, типографика, воздух и предметные фотографии.\n\n## Визуальный якорь\nfinalist-1 сохраняет роль фото, иерархию и навигацию на home, listing, detail и mobile.\n\n## Ограничение влияния\nArt-direction источник не определяет весь UX-каркас, все поля и все страницы.\n");
  return root;
}

function runGate(root) {
  const r = spawnSync(process.execPath, [GATE, "--stage", "research", "--root", root], { encoding: "utf8" });
  return { code: r.status, out: (r.stdout || "") + (r.stderr || "") };
}

let failed = 0;
const check = (pass, name, detail) => { if (!pass) failed++; console.log(`${pass ? "PASS" : "FAIL"}  ${name}${pass ? "" : "\n      " + detail}`); };

// база: консистентный фикстурный проект проходит гейт
const base = buildFixture();
const baseRun = runGate(base);
check(baseRun.code === 0, "базовый фикстурный проект → GATE_PASS", baseRun.out);

// мутация 1: заявленный финалист без полного набора кадров → GATE_FAIL
const m1 = buildFixture();
const reg1 = path.join(m1, ".design/research/FINALISTS.json");
const reg1d = JSON.parse(fs.readFileSync(reg1, "utf8"));
reg1d.finalists[0].domain = "gamma.ru"; // нет ни одного ok-захвата gamma
fs.writeFileSync(reg1, JSON.stringify(reg1d, null, 2));
const m1Run = runGate(m1);
check(m1Run.code === 1 && m1Run.out.includes("нет чистого ok-захвата home desktop+mobile"),
  "заявленный финалист отличается от фактических → GATE_FAIL", m1Run.out);

// мутация 2: у фрагмента заявлен элемент, которого нет в «Что видно» → GATE_FAIL
const m2 = buildFixture();
const frag2 = path.join(m2, ".design/research/FRAGMENTS.md");
fs.writeFileSync(frag2, fs.readFileSync(frag2, "utf8").replace("Заявлено: фото, сетка", "Заявлено: фото, трактор"));
const m2Run = runGate(m2);
check(m2Run.code === 1 && m2Run.out.includes("заявлено «трактор»"),
  "фрагмент с отсутствующим заявленным элементом → GATE_FAIL", m2Run.out);

// мутация 3: пользователь отклонил кандидата, но агент протащил его в финалисты → GATE_FAIL
const m3 = buildFixture();
const sel3 = path.join(m3, ".design/research/POOL_SELECTION.json");
const sel3d = JSON.parse(fs.readFileSync(sel3, "utf8"));
sel3d.approved = ["beta.ru", "iota.ru"];
sel3d.rejected = ["alpha.ru"];
fs.writeFileSync(sel3, JSON.stringify(sel3d, null, 2));
const m3Run = runGate(m3);
check(m3Run.code === 1 && m3Run.out.includes("кандидат отклонён пользователем"),
  "отклонённый пользователем кандидат не может стать финалистом → GATE_FAIL", m3Run.out);

for (const d of [base, m1, m2, m3]) fs.rmSync(d, { recursive: true, force: true });
console.log(`\n${failed ? "SELFTEST_FAIL" : "SELFTEST_PASS"} — research gate (${4 - failed}/4)`);
process.exit(failed ? 1 : 0);
