"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import LeadSection from "@/components/LeadSection";
import PageHeader from "@/components/PageHeader";
import {
  calculateEstimate,
  CalculatorCategory,
  CALCULATOR_PRICING,
  DEFAULT_METERS_BY_CATEGORY,
  SIZE_PRESETS_BY_CATEGORY,
} from "@/data/calculator-pricing";
import { SITE_CONFIG } from "@/data/site";

type Choice = { id: string; name: string; description: string };
type MaterialId = keyof typeof CALCULATOR_PRICING.materialMultipliers;

const CATEGORIES: Array<Choice & { id: CalculatorCategory }> = [
  { id: "kitchen", name: "Кухня", description: "Гарнитур по одной или нескольким стенам" },
  { id: "wardrobe", name: "Шкаф или гардеробная", description: "Встроенная или отдельностоящая система хранения" },
  { id: "cabinet", name: "Корпусная мебель", description: "Прихожая, ТВ-зона, ванная или несколько изделий" },
];

const LAYOUTS: Record<CalculatorCategory, Choice[]> = {
  kitchen: [
    { id: "straight", name: "Прямая", description: "Одна линия мебели" },
    { id: "corner", name: "Угловая", description: "Две стены и угловое соединение" },
    { id: "u-shaped", name: "П-образная", description: "Три рабочие стороны" },
    { id: "island", name: "С островом", description: "Основной ряд и отдельный остров" },
  ],
  wardrobe: [
    { id: "built-in", name: "Встроенный шкаф", description: "В нишу или от стены до стены" },
    { id: "freestanding", name: "Отдельный шкаф", description: "С собственными боковинами и крышей" },
    { id: "walk-in", name: "Гардеробная", description: "Открытая или закрытая система хранения" },
  ],
  cabinet: [
    { id: "single", name: "Одно изделие", description: "Например, тумба или ТВ-зона" },
    { id: "zone", name: "Одна зона", description: "Комплект мебели для помещения" },
    { id: "complex", name: "Несколько зон", description: "Мебель сразу для нескольких комнат или зон" },
  ],
};

const MATERIALS_BY_CATEGORY: Record<CalculatorCategory, Array<Choice & { id: MaterialId }>> = {
  kitchen: [
    {
      id: "egger",
      name: "ЛДСП Egger (3 категория)",
      description: "Базовый доступный декор европейского стандарта, практичный в уходе",
    },
    {
      id: "pvc",
      name: "МДФ ПВХ (плёнка)",
      description: "Суперматовая плёнка без фрезеровки или с классической выборкой",
    },
    {
      id: "plastic",
      name: "МДФ пластик: AGT или Velvet",
      description: "Матовые фасады AGT или бархатистый Velvet с надёжной влагостойкой кромкой",
    },
    {
      id: "enamel",
      name: "Матовая эмаль по RAL / NCS",
      description: "Матовая окраска по каталогам RAL / NCS (без глянца), гладкая или с фрезеровкой",
    },
    {
      id: "veneer",
      name: "Натуральный шпон с рамочкой (дуб)",
      description: "Натуральный шпон с дубовой рамкой (без дорогого американского ореха)",
    },
    {
      id: "unknown",
      name: "Нужна помощь",
      description: "Подберём практичные фасады под проект и бюджет",
    },
  ],
  wardrobe: [
    {
      id: "egger",
      name: "ЛДСП Egger (основной выбор — 90% заказов)",
      description: "Базовый материал для 90% шкафов: надёжная австрийская плита без переплаты",
    },
    {
      id: "pvc",
      name: "МДФ ПВХ (премиум)",
      description: "Премиум-опция: матовая плёнка с возможностью декоративной фрезеровки",
    },
    {
      id: "enamel",
      name: "Матовая эмаль (премиум)",
      description: "Премиум-опция: матовая окраска по RAL / NCS (без глянца)",
    },
    {
      id: "plastic",
      name: "МДФ пластик: AGT или Velvet",
      description: "Стойкие матовые фасады AGT или бархатистый Velvet",
    },
    {
      id: "veneer",
      name: "Натуральный шпон с рамочкой (дуб)",
      description: "Натуральный шпон с дубовой рамкой",
    },
    {
      id: "unknown",
      name: "Нужна помощь",
      description: "Подберём оптимальные фасады и наполнение под интерьер",
    },
  ],
  cabinet: [
    {
      id: "egger",
      name: "ЛДСП Egger",
      description: "Базовый практичный материал для корпусной мебели, стеллажей и тумб",
    },
    {
      id: "pvc",
      name: "МДФ ПВХ (плёнка)",
      description: "Матовая плёнка с фрезеровкой фасадов под общую стилистику",
    },
    {
      id: "plastic",
      name: "МДФ пластик: AGT или Velvet",
      description: "Матовая практичная поверхность AGT или Velvet с влагостойкой кромкой",
    },
    {
      id: "enamel",
      name: "Матовая эмаль по RAL / NCS",
      description: "Матовая эмаль по RAL / NCS (без глянца)",
    },
    {
      id: "veneer",
      name: "Натуральный шпон с рамочкой (дуб)",
      description: "Натуральный шпон с рамочкой (дуб)",
    },
    {
      id: "unknown",
      name: "Нужна помощь",
      description: "Подберём материалы по дизайн-проекту или фото помещения",
    },
  ],
};

const ALL_MATERIALS: Array<Choice & { id: MaterialId }> = [
  { id: "egger", name: "ЛДСП Egger (3 категория)", description: "Базовый доступный декор европейского стандарта" },
  { id: "pvc", name: "МДФ ПВХ (плёнка)", description: "Суперматовая плёнка без фрезеровки или с выборкой" },
  { id: "plastic", name: "МДФ пластик: AGT или Velvet", description: "Матовые фасады AGT или Velvet с надёжной влагостойкой кромкой" },
  { id: "enamel", name: "Матовая эмаль по RAL / NCS", description: "Матовая эмаль по RAL / NCS (без глянца)" },
  { id: "veneer", name: "Натуральный шпон с рамочкой (дуб)", description: "Натуральный шпон с рамочкой (дуб)" },
  { id: "unknown", name: "Нужна помощь", description: "Подберём материал под задачу и бюджет" },
];

const OPTIONS_BY_CATEGORY: Record<CalculatorCategory, Choice[]> = {
  kitchen: [
    {
      id: "worktop_premium",
      name: "Столешница из компакт-ламината или камня",
      description: "Премиальный тонкий HPL или акриловый камень (базовая влагостойкая Slotex 38 мм уже в расчёте)",
    },
    { id: "gola", name: "Фасады без ручек", description: "Профиль Gola или другой способ открывания" },
    { id: "drawers", name: "Выдвижные системы", description: "Ящики, корзины, бутылочницы и подъёмники" },
    { id: "lighting", name: "Встроенная подсветка", description: "Профиль, светодиодная лента и управление" },
    { id: "ceiling", name: "До потолка", description: "Антресоли и подгонка по высоте" },
    { id: "connections", name: "Подключение техники и сантехники", description: "Сантехника и электрика силами одной команды" },
  ],
  wardrobe: [
    { id: "glass", name: "Стекло или зеркало", description: "Витрины со стеклом Stopsol, зеркало или тонированное стекло" },
    { id: "drawers", name: "Выдвижные ящики (4–6 шт.)", description: "Ящики и корзины плавного закрывания" },
    { id: "lighting", name: "Встроенная подсветка", description: "Свет внутри секций и витрин" },
    { id: "ceiling", name: "Под потолок (антресоли)", description: "Антресоли и подгонка по высоте" },
    { id: "fittings", name: "Расширенная фурнитура", description: "Больше механизмов плавного открывания" },
    { id: "filling", name: "Сложное наполнение", description: "Пантографы, обувницы и специальные секции" },
  ],
  cabinet: [
    { id: "worktop", name: "Влагостойкая столешница Slotex 38 мм", description: "Для тумбы, ванной или рабочей зоны" },
    { id: "drawers", name: "Выдвижные системы", description: "Ящики и механизмы плавного открывания" },
    { id: "lighting", name: "Встроенная подсветка", description: "Свет в нишах, витринах или под тумбами" },
    { id: "ceiling", name: "До потолка", description: "Высокие секции и точная подгонка" },
    { id: "fittings", name: "Расширенная фурнитура", description: "Дополнительные механизмы и подъёмники" },
    { id: "mixed", name: "Несколько материалов", description: "Сочетание эмали, шпона, стекла или металла" },
  ],
};

function sanitizeOptions(rawOptions: string[], cat: CalculatorCategory): string[] {
  const allowed = new Set(OPTIONS_BY_CATEGORY[cat].map((o) => o.id));
  let result = [...new Set(rawOptions)].filter((id) => allowed.has(id));
  if (result.includes("worktop") && result.includes("worktop_premium")) {
    result = result.filter((id) => id !== "worktop");
  }
  return result;
}

const STEPS = [
  { short: "Изделие", title: "Что будем проектировать?", description: "Выберите основное направление мебели." },
  { short: "Размер", title: "Какая конфигурация и длина?", description: "Приблизительных размеров достаточно для первого ориентира." },
  { short: "Фасады", title: "Какие фасады вам ближе?", description: "Если ещё не решили, оставьте подбор материала дизайнеру." },
  { short: "Оснащение", title: "Что важно учесть в комплектации?", description: "Можно не выбирать ничего: детали всё равно уточним перед сметой." },
] as const;

function getChoice<T extends Choice>(list: readonly T[], id: string): T {
  const fallback = list[0];
  if (!fallback) throw new Error("Список вариантов калькулятора пуст");
  return list.find((item) => item.id === id) ?? fallback;
}

function clampMeters(value: number, fallback = 3) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(12, Math.max(0.8, Math.round(value * 10) / 10));
}

function formatPrice(value: number) {
  return value.toLocaleString("ru-RU");
}

export default function CalculatorPage() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState<CalculatorCategory>("kitchen");
  const [layout, setLayout] = useState("straight");
  const [meters, setMeters] = useState<number>(DEFAULT_METERS_BY_CATEGORY.kitchen);
  const [material, setMaterial] = useState<MaterialId>("egger");
  const [options, setOptions] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [urlReady, setUrlReady] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const stageHeadingRef = useRef<HTMLHeadingElement>(null);
  const summaryRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const categoryParam = params.get("category");
    const nextCategory = CATEGORIES.some((item) => item.id === categoryParam)
      ? categoryParam as CalculatorCategory
      : "kitchen";
    const allowedLayouts = LAYOUTS[nextCategory];
    const layoutParam = params.get("layout");
    const nextLayout = allowedLayouts.some((item) => item.id === layoutParam)
      ? layoutParam!
      : allowedLayouts[0].id;
    const materialParam = params.get("material");
    const nextMaterial = ALL_MATERIALS.some((item) => item.id === materialParam)
      ? materialParam as MaterialId
      : "egger";
    const rawOptions = (params.get("options") || "").split(",").map((s) => s.trim()).filter(Boolean);
    const nextOptions = sanitizeOptions(rawOptions, nextCategory);
    const stepParam = Number(params.get("step"));

    const metersParam = params.get("meters");
    const parsedMeters = metersParam !== null && metersParam !== "" ? Number(metersParam) : NaN;
    const nextMeters = clampMeters(parsedMeters, DEFAULT_METERS_BY_CATEGORY[nextCategory]);

    setCategory(nextCategory);
    setLayout(nextLayout);
    setMeters(nextMeters);
    setMaterial(nextMaterial);
    setOptions(nextOptions);
    if (Number.isInteger(stepParam) && stepParam >= 1 && stepParam <= STEPS.length) {
      setStep(stepParam - 1);
    }
    setUrlReady(true);
  }, []);

  useEffect(() => {
    if (!urlReady) return;
    const params = new URLSearchParams({
      category,
      layout,
      meters: meters.toFixed(1),
      material,
      options: options.join(","),
      step: String(step + 1),
    });
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}${window.location.hash}`);
  }, [category, layout, material, meters, options, step, urlReady]);

  const categoryChoice = getChoice(CATEGORIES, category);
  const layoutChoices = LAYOUTS[category];
  const layoutChoice = getChoice(layoutChoices, layout);
  const currentMaterials = MATERIALS_BY_CATEGORY[category];
  const materialChoice = currentMaterials.find((item) => item.id === material)
    ?? ALL_MATERIALS.find((item) => item.id === material)
    ?? currentMaterials[0];
  const availableOptions = OPTIONS_BY_CATEGORY[category];
  const optionChoices = options
    .map((id) => availableOptions.find((item) => item.id === id))
    .filter((item): item is Choice => Boolean(item));
  const estimate = useMemo(() => calculateEstimate({
    category,
    layout,
    meters,
    material,
    options,
  }), [category, layout, material, meters, options]);

  const priceLabel = `${formatPrice(estimate.low)} — ${formatPrice(estimate.high)} ₽`;
  const summary = useMemo(() => [
    `Изделие: ${categoryChoice.name}`,
    `Конфигурация: ${layoutChoice.name}`,
    `Ориентировочная длина: ${meters.toFixed(1)} м`,
    `Фасады: ${materialChoice.name}`,
    `Дополнительно: ${optionChoices.length ? optionChoices.map((item) => item.name).join(", ") : "без выбранных опций"}`,
    `Онлайн-ориентир: ${priceLabel}`,
  ].join("\n"), [categoryChoice.name, layoutChoice.name, materialChoice.name, meters, optionChoices, priceLabel]);

  const focusStage = () => window.requestAnimationFrame(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.matchMedia("(max-width: 960px)").matches) {
      stageRef.current?.scrollIntoView({
        behavior: reducedMotion ? "auto" : "smooth",
        block: "start",
      });
    }
    stageHeadingRef.current?.focus({ preventScroll: true });
  });

  const showEstimate = () => {
    const result = summaryRef.current;
    if (!result) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    result.scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start",
    });
    window.setTimeout(() => result.focus({ preventScroll: true }), reducedMotion ? 0 : 350);
  };

  const goToStep = (nextStep: number) => {
    setStep(Math.min(STEPS.length - 1, Math.max(0, nextStep)));
    focusStage();
  };

  const chooseCategory = (id: CalculatorCategory) => {
    setCategory(id);
    setLayout(LAYOUTS[id][0].id);
    setMeters(DEFAULT_METERS_BY_CATEGORY[id]);
    setOptions((current) => sanitizeOptions(current, id));
    const allowedMaterialIds = new Set(MATERIALS_BY_CATEGORY[id].map((item) => item.id));
    if (!allowedMaterialIds.has(material)) {
      setMaterial("egger");
    }
  };

  const toggleOption = (id: string) => {
    setOptions((current) => {
      const exists = current.includes(id);
      if (exists) {
        return current.filter((optionId) => optionId !== id);
      }
      let next = [...current, id];
      if (id === "worktop") {
        next = next.filter((optionId) => optionId !== "worktop_premium");
      } else if (id === "worktop_premium") {
        next = next.filter((optionId) => optionId !== "worktop");
      }
      return sanitizeOptions(next, category);
    });
  };

  const copyLink = async () => {
    const params = new URLSearchParams({
      category,
      layout,
      meters: meters.toFixed(1),
      material,
      options: options.join(","),
      step: String(step + 1),
    });
    const url = `${window.location.origin}/calculator/?${params.toString()}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const field = document.createElement("textarea");
      field.value = url;
      field.style.position = "fixed";
      field.style.opacity = "0";
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="calc-page">
      <PageHeader title="Предварительный расчёт мебели" />

      <section className="calculator-section" aria-label="Калькулятор предварительной стоимости">
        <div className="container">
          <nav className="calculator-steps" aria-label="Шаги калькулятора">
            <ol>
              {STEPS.map((item, index) => (
                <li key={item.short} className={index < step ? "is-complete" : ""}>
                  <button
                    type="button"
                    className={index === step ? "is-active" : ""}
                    aria-current={index === step ? "step" : undefined}
                    onClick={() => goToStep(index)}
                  >
                    <span>{index + 1}</span>
                    <small>{item.short}</small>
                  </button>
                </li>
              ))}
            </ol>
            <div
              className="calculator-progress"
              role="progressbar"
              aria-label="Прогресс заполнения калькулятора"
              aria-valuemin={1}
              aria-valuemax={STEPS.length}
              aria-valuenow={step + 1}
              aria-valuetext={`Шаг ${step + 1} из ${STEPS.length}: ${STEPS[step].short}`}
            >
              <span style={{ transform: `scaleX(${(step + 1) / STEPS.length})` }} />
            </div>
          </nav>

          <div className="calculator-layout">
            <div ref={stageRef} className="calculator-stage">
              <header className="calculator-stage-header">
                <p>Шаг {step + 1} из {STEPS.length}</p>
                <h3 ref={stageHeadingRef} tabIndex={-1}>{STEPS[step].title}</h3>
                <span>{STEPS[step].description}</span>
              </header>

              <div className="calculator-mobile-price" aria-live="polite">
                <span>Ориентировочная стоимость</span>
                <strong>≈ {priceLabel}</strong>
              </div>

              {step === 0 && (
                <fieldset className="calculator-group">
                  <legend className="sr-only">Тип мебели</legend>
                  <div className="calculator-choice-grid">
                    {CATEGORIES.map((item) => (
                      <label key={item.id} className={`calculator-choice ${category === item.id ? "is-selected" : ""}`}>
                        <input
                          type="radio"
                          name="calculator-category"
                          value={item.id}
                          checked={category === item.id}
                          onChange={() => chooseCategory(item.id)}
                        />
                        <span className="calculator-choice-marker" aria-hidden="true" />
                        <span className="calculator-choice-copy">
                          <strong>{item.name}</strong>
                          <small>{item.description}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 1 && (
                <fieldset className="calculator-group">
                  <legend className="sr-only">Конфигурация и длина</legend>
                  <div className="calculator-choice-grid calculator-choice-grid-compact">
                    {layoutChoices.map((item) => (
                      <label key={item.id} className={`calculator-choice ${layout === item.id ? "is-selected" : ""}`}>
                        <input
                          type="radio"
                          name="calculator-layout"
                          value={item.id}
                          checked={layout === item.id}
                          onChange={() => setLayout(item.id)}
                        />
                        <span className="calculator-choice-marker" aria-hidden="true" />
                        <span className="calculator-choice-copy">
                          <strong>{item.name}</strong>
                          <small>{item.description}</small>
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="calculator-size-presets" aria-label="Быстрый выбор длины">
                    {SIZE_PRESETS_BY_CATEGORY[category].map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        aria-pressed={Math.abs(meters - preset.meters) < 0.05}
                        onClick={() => setMeters(preset.meters)}
                      >
                        <strong>{preset.name}</strong>
                        <span>{preset.description}</span>
                      </button>
                    ))}
                  </div>

                  <div className="calculator-meter-row">
                    <label htmlFor="calculator-meters">
                      Общая длина по стенам
                      <span id="calculator-meters-help">Если точных размеров нет, укажите примерно.</span>
                    </label>
                    <div className="calculator-meter-control">
                      <button type="button" onClick={() => setMeters((value) => clampMeters(value - 0.2))} aria-label="Уменьшить длину">−</button>
                      <input
                        id="calculator-meters"
                        type="number"
                        min="0.8"
                        max="12"
                        step="0.1"
                        inputMode="decimal"
                        value={meters}
                        aria-describedby="calculator-meters-help"
                        onChange={(event) => setMeters(clampMeters(Number(event.target.value), DEFAULT_METERS_BY_CATEGORY[category]))}
                      />
                      <span>м</span>
                      <button type="button" onClick={() => setMeters((value) => clampMeters(value + 0.2))} aria-label="Увеличить длину">+</button>
                    </div>
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <fieldset className="calculator-group">
                  <legend className="sr-only">Материал фасадов</legend>
                  <div className="calculator-choice-grid calculator-choice-grid-compact">
                    {currentMaterials.map((item) => (
                      <label key={item.id} className={`calculator-choice ${material === item.id ? "is-selected" : ""}`}>
                        <input
                          type="radio"
                          name="calculator-material"
                          value={item.id}
                          checked={material === item.id}
                          onChange={() => setMaterial(item.id)}
                        />
                        <span className="calculator-choice-marker" aria-hidden="true" />
                        <span className="calculator-choice-copy">
                          <strong>{item.name}</strong>
                          <small>{item.description}</small>
                        </span>
                      </label>
                    ))}
                  </div>
                </fieldset>
              )}

              {step === 3 && (
                <fieldset className="calculator-group">
                  <legend className="sr-only">Дополнительные опции</legend>
                  <div className="calculator-option-grid">
                    {availableOptions.map((item) => (
                      <label key={item.id} className={`calculator-option ${options.includes(item.id) ? "is-selected" : ""}`}>
                        <input
                          type="checkbox"
                          checked={options.includes(item.id)}
                          onChange={() => toggleOption(item.id)}
                        />
                        <span><strong>{item.name}</strong><small>{item.description}</small></span>
                      </label>
                    ))}
                  </div>
                  <p className="calculator-options-note">
                    {category === "kitchen"
                      ? "В базовый расчёт кухни уже включена влагостойкая столешница Slotex 38 мм с еврозапилом. Дополнительные опции можно не выбирать."
                      : "Без дополнительных опций — тоже нормальный вариант для первого расчёта."}
                  </p>
                </fieldset>
              )}

              <div className="calculator-navigation">
                <button
                  type="button"
                  className={`btn btn-glass ${step === 0 ? "calculator-back-placeholder" : ""}`}
                  onClick={() => goToStep(step - 1)}
                  disabled={step === 0}
                  aria-hidden={step === 0}
                  tabIndex={step === 0 ? -1 : 0}
                >
                  Назад
                </button>
                {step < STEPS.length - 1 ? (
                  <button type="button" className="btn btn-green" onClick={() => goToStep(step + 1)}>
                    Далее
                  </button>
                ) : (
                  <>
                    <a href="#measure" className="btn btn-green calculator-final-desktop">
                      Перейти к заявке
                    </a>
                    <button
                      type="button"
                      className="btn btn-green calculator-final-mobile"
                      onClick={showEstimate}
                    >
                      Показать стоимость
                    </button>
                  </>
                )}
              </div>
            </div>

            <aside
              ref={summaryRef}
              id="calculator-result"
              className="calculator-summary"
              aria-label="Предварительная стоимость и параметры"
              tabIndex={-1}
            >
              <div className="calculator-price">
                <p>Предварительный диапазон</p>
                <strong>≈ {priceLabel}</strong>
                <span>Ориентир меняется вместе с выбранными параметрами.</span>
              </div>

              <dl>
                <div><dt>Изделие</dt><dd>{categoryChoice.name}</dd></div>
                <div><dt>Конфигурация</dt><dd>{layoutChoice.name}</dd></div>
                <div><dt>Длина</dt><dd>{meters.toFixed(1)} м</dd></div>
                <div><dt>Фасады</dt><dd>{materialChoice.name}</dd></div>
                <div><dt>Опции</dt><dd>{optionChoices.length || "Не выбраны"}</dd></div>
              </dl>

              <div className="calculator-price-notice">
                <strong>Это ориентир, не оферта</strong>
                <p>
                  Точная сумма зависит от раскроя листов, площади фасадов, числа петель,
                  механизмов, столешницы и монтажных работ.
                </p>
              </div>

              <a href="#measure" className="btn btn-green">Получить точный расчёт</a>
              <button type="button" className="btn btn-glass" onClick={copyLink} aria-live="polite">
                {copied ? "Ссылка скопирована" : "Скопировать конфигурацию"}
              </button>
              <p className="calculator-summary-note">Консультация не обязывает заключать договор.</p>
            </aside>
          </div>
        </div>
      </section>

      <LeadSection
        id="measure"
        initialCategory={categoryChoice.name}
        source="Калькулятор"
        calculatorSummary={summary}
        showSketchLink
        mode="calculator"
      />
    </div>
  );
}
