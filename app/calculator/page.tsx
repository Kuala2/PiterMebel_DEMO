"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import VkIcon from "@/components/VkIcon";
import MeasureForm from "@/components/MeasureForm";
import { MATERIALS } from "@/data/materials";
import { SITE_CONFIG } from "@/data/site";

interface MainCategory {
  id: string;
  name: string;
  desc: string;
}

const MAIN_CATEGORIES: MainCategory[] = [
  {
    id: "kitchens",
    name: "Кухни на заказ",
    desc: "Линейные, угловые, П-образные и с островом",
  },
  {
    id: "wardrobes",
    name: "Шкафы и гардеробные",
    desc: "Встроенные шкафы, гардеробные и смарт-витрины Stopsol",
  },
  {
    id: "cabinet",
    name: "Корпусная мебель для дома",
    desc: "Прихожие, подвесные ТВ-зоны, мебель для ванных и рейки",
  },
];

interface FurnitureSubtype {
  id: string;
  categoryId: string;
  name: string;
  subtitle: string;
  image: string;
}

const FURNITURE_SUBTYPES: FurnitureSubtype[] = [
  // Kitchens
  {
    id: "kitchen-straight",
    categoryId: "kitchens",
    name: "Прямая кухня",
    subtitle: "Линейная планировка",
    image: "/img/kitchens/aleksandra/photo_1.jpg",
  },
  {
    id: "kitchen-corner",
    categoryId: "kitchens",
    name: "Угловая кухня",
    subtitle: "L-образная планировка",
    image: "/img/projects/oak-stone/photo_1.jpg",
  },
  {
    id: "kitchen-u",
    categoryId: "kitchens",
    name: "П-образная кухня",
    subtitle: "Вместительная с 3 рядами",
    image: "/img/kitchens/stefania/photo_1.jpg",
  },
  {
    id: "kitchen-island",
    categoryId: "kitchens",
    name: "Кухня с островом / барной стойкой",
    subtitle: "Островная архитектура",
    image: "/img/projects/island-parquet/photo_1.jpg",
  },

  // Wardrobes
  {
    id: "wardrobe-room",
    categoryId: "wardrobes",
    name: "Гардеробная комната",
    subtitle: "П-образная с полками под геометрию стен",
    image: "/img/projects/brick-wardrobe/photo_1.jpg",
  },
  {
    id: "wardrobe-built",
    categoryId: "wardrobes",
    name: "Встроенный шкаф-купе в нишу",
    subtitle: "Точная посадка от пола до потолка",
    image: "/img/projects/mirror-hall/photo_1.jpg",
  },
  {
    id: "wardrobe-hinged",
    categoryId: "wardrobes",
    name: "Распашной шкаф в потолок",
    subtitle: "Классические распашные фасады",
    image: "/img/projects/bedroom-set/photo_1.jpg",
  },
  {
    id: "wardrobe-stopsol",
    categoryId: "wardrobes",
    name: "Витрина со стеклом STOPSOL",
    subtitle: "Смарт-зеркало с теплой подсветкой",
    image: "/img/projects/glass-wardrobe/photo_1.jpg",
  },

  // Cabinet furniture
  {
    id: "cabinet-hall",
    categoryId: "cabinet",
    name: "Прихожая и мягкая обувница",
    subtitle: "Интегрированная ниша и реечные акценты",
    image: "/img/projects/mirror-hall/photo_2.jpg",
  },
  {
    id: "cabinet-bath",
    categoryId: "cabinet",
    name: "Мебель в ванную комнату",
    subtitle: "Влагостойкая подвесная тумба под раковину",
    image: "/img/projects/oak-stone/photo_2.jpg",
  },
  {
    id: "cabinet-tv",
    categoryId: "cabinet",
    name: "ТВ-зона и подвесной стеллаж",
    subtitle: "Консоль с кабель-менеджментом",
    image: "/img/projects/bedroom-set/photo_2.jpg",
  },
  {
    id: "cabinet-slats",
    categoryId: "cabinet",
    name: "Стеновые реечные панели из шпона",
    subtitle: "Декоративное зонирование и акцентные стены",
    image: "/img/projects/oak-veneer-panel/photo_1.jpg",
  },
];

const SIZES = [
  { id: "s", name: "До 2.4 м", desc: "Компактный размер" },
  { id: "m", name: "2.5 – 3.2 м", desc: "Стандартная планировка" },
  { id: "l", name: "3.3 – 4.2 м", desc: "Просторный гарнитур" },
  { id: "xl", name: "Более 4.2 м", desc: "Индивидуальный масштаб" },
];

const FACADE_MATERIALS = [
  { id: "enamel", name: "Эмаль по палитре RAL", tier: "Дизайнерская серия", desc: "Безупречно гладкая матовая поверхность" },
  { id: "veneer", name: "Натуральный шпон дуба", tier: "Премиальная серия", desc: "Выразительная текстура благородного дерева" },
  { id: "fenix", name: "Суперматовый Fenix NTM", tier: "Инновационная серия", desc: "Anti-Fingerprint с защитой от отпечатков" },
  { id: "plastic", name: "МДФ пластик Velvet", tier: "Базовая серия", desc: "Практичная тактильная микротекстура" },
];

const EXTRA_OPTIONS = [
  { id: "stone", name: "Столешница из искусственного камня с бесшовной склейкой" },
  { id: "gola", name: "Скрытый профиль Gola (фасады без накладных ручек)" },
  { id: "stopsol", name: "Смарт-стекло Stopsol с интегрированной подсветкой полок" },
  { id: "ceiling", name: "Верхний ярус антресолей точно до потолка" },
  { id: "fittings", name: "Немецкие скрытые направляющие и петли с доводчиками" },
  { id: "led", name: "Встроенная врезная подсветка рабочей зоны 4000K" },
];

export default function CalculatorPage() {
  const [step, setStep] = useState<number>(1);
  const [selectedMainCat, setSelectedMainCat] = useState<string>("kitchens");
  const [selectedType, setSelectedType] = useState<string>("kitchen-corner");
  const [selectedSize, setSelectedSize] = useState<string>("m");
  const [selectedMaterial, setSelectedMaterial] = useState<string>("enamel");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "gola",
    "ceiling",
    "fittings",
  ]);

  const CALC_STEPS = [
    "Направление",
    "Планировка",
    "Размер",
    "Материал",
    "Опции",
  ];

  // Handle main category switch and auto-select first subtype
  const handleMainCatChange = (catId: string) => {
    setSelectedMainCat(catId);
    const firstSubtype = FURNITURE_SUBTYPES.find((s) => s.categoryId === catId);
    if (firstSubtype) {
      setSelectedType(firstSubtype.id);
    }
  };

  const currentSubtypes = useMemo(() => {
    return FURNITURE_SUBTYPES.filter((s) => s.categoryId === selectedMainCat);
  }, [selectedMainCat]);

  const toggleOption = (id: string) => {
    setSelectedOptions((prev) =>
      prev.includes(id) ? prev.filter((o) => o !== id) : [...prev, id]
    );
  };

  const calculation = useMemo(() => {
    const mainCat = MAIN_CATEGORIES.find((c) => c.id === selectedMainCat) || MAIN_CATEGORIES[0];
    const furn = FURNITURE_SUBTYPES.find((f) => f.id === selectedType) || currentSubtypes[0] || FURNITURE_SUBTYPES[0];
    const size = SIZES.find((s) => s.id === selectedSize) || SIZES[1];
    const mat = FACADE_MATERIALS.find((m) => m.id === selectedMaterial) || FACADE_MATERIALS[0];

    let complexity = "Оптимальная заводская комплектация";
    if (selectedOptions.length >= 3 || mat.id === "veneer" || mat.id === "fenix") {
      complexity = "Премиальная авторская спецификация";
    }

    // Предварительная вилка цены (корпус + фасады, без техники и монтажа)
    const baseByCategory: Record<string, number> = {
      kitchens: 190000,
      wardrobes: 150000,
      cabinet: 110000,
    };
    const sizeMult: Record<string, number> = { s: 0.8, m: 1.0, l: 1.3, xl: 1.6 };
    const matMult: Record<string, number> = { enamel: 1.15, veneer: 1.4, fenix: 1.25, plastic: 1.0 };
    const optionPrice: Record<string, number> = {
      stone: 55000,
      gola: 18000,
      stopsol: 38000,
      ceiling: 24000,
      fittings: 22000,
      led: 13000,
    };

    const base = (baseByCategory[selectedMainCat] ?? 150000) * (sizeMult[selectedSize] ?? 1) * (matMult[selectedMaterial] ?? 1);
    const optionsSum = selectedOptions.reduce((sum, id) => sum + (optionPrice[id] ?? 0), 0);
    const total = base + optionsSum;
    const roundTo10k = (v: number) => Math.round(v / 10000) * 10000;
    const priceLow = roundTo10k(total * 0.92);
    const priceHigh = roundTo10k(total * 1.18);

    return {
      mainCategoryName: mainCat.name,
      furnitureName: furn.name,
      furnitureSubtitle: furn.subtitle,
      furnitureImage: furn.image,
      sizeName: size.name,
      materialName: mat.name,
      tierName: mat.tier,
      complexity,
      priceLow,
      priceHigh,
      optionsCount: selectedOptions.length,
      optionsNames: selectedOptions
        .map((id) => EXTRA_OPTIONS.find((o) => o.id === id)?.name)
        .filter(Boolean),
    };
  }, [selectedMainCat, selectedType, currentSubtypes, selectedSize, selectedMaterial, selectedOptions]);

  return (
    <div>
      {/* 1. Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="subpage-hero-title">Калькулятор стоимости мебели</h1>
          <p className="subpage-hero-caption">
            5 шагов · предварительная смета без вызова мастера
          </p>
        </div>
      </section>

      {/* 2. Subtitle Intro Bar (Below Banner) */}
      <section className="subpage-intro-bar">
        <div className="container">
          <p className="subpage-intro-desc" style={{ marginBottom: 0 }}>
            Сконфигурируйте планировку, габариты, материалы фасадов и дополнительные опции для расчета предварительной сметы на собственном производстве.
          </p>
        </div>
      </section>

      {/* 3. Calculator Body (Tone 1: #0A0C0E) */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "50px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="calc-layout-grid">
            {/* Left Column: Step-by-step Wizard */}
            <div style={{ display: "flex", flexDirection: "column", gap: "36px" }}>

              {/* Progress line: 5 markers in the site language */}
              <div className="process-track calc-progress">
                {CALC_STEPS.map((label, i) => {
                  const n = i + 1;
                  const state = n === step ? "is-current" : n < step ? "is-done" : "is-future";
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`process-step calc-progress-step ${state}`}
                      onClick={() => setStep(n)}
                    >
                      <span className="calc-progress-num">{n}</span>
                      <span className="calc-progress-label">{label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Step 1: Main Category */}
              {step === 1 && (
              <div>
                <h3 className="calc-step-title">
                  Что будем рассчитывать?
                </h3>
                <div className="calc-categories-grid">
                  {MAIN_CATEGORIES.map((cat) => {
                    const isSelected = selectedMainCat === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleMainCatChange(cat.id)}
                        style={{
                          background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                          border: `1px solid ${isSelected ? "var(--border-green)" : "var(--border-subtle)"}`,
                          borderRadius: "var(--radius-sm)",
                          padding: "18px 16px",
                          textAlign: "left",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          boxShadow: "none",
                        }}
                      >
                        <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "4px" }}>
                          {cat.name}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--color-text-secondary)", lineHeight: "1.4" }}>
                          {cat.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Step 2: Subtype / Layout */}
              {step === 2 && (
              <div>
                <h3 className="calc-step-title">
                  Тип и планировка изделия
                </h3>
                <div className="calc-subtypes-grid">
                  {currentSubtypes.map((type) => {
                    const isSelected = selectedType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedType(type.id)}
                        style={{
                          background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                          border: `1px solid ${isSelected ? "var(--border-green)" : "var(--border-subtle)"}`,
                          borderRadius: "var(--radius-sm)",
                          padding: "14px",
                          textAlign: "left",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          boxShadow: "none",
                        }}
                      >
                        <div style={{ position: "relative", width: "58px", height: "58px", borderRadius: "var(--radius-xs)", overflow: "hidden", flexShrink: 0, background: "var(--bg-studio)", border: "1px solid var(--border-subtle)" }}>
                          <Image src={type.image} alt={type.name} fill style={{ objectFit: "cover" }} />
                        </div>
                        <div>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--color-text-primary)", lineHeight: "1.3" }}>
                            {type.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "3px" }}>
                            {type.subtitle}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Step 3: Size */}
              {step === 3 && (
              <div>
                <h3 className="calc-step-title">
                  Ориентировочный размер
                </h3>
                <div className="calc-sizes-grid">
                  {SIZES.map((size) => {
                    const isSelected = selectedSize === size.id;
                    return (
                      <button
                        key={size.id}
                        type="button"
                        onClick={() => setSelectedSize(size.id)}
                        style={{
                          background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                          color: "var(--color-text-primary)",
                          border: `1px solid ${isSelected ? "var(--border-green)" : "var(--border-subtle)"}`,
                          borderRadius: "var(--radius-sm)",
                          padding: "14px 10px",
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "14px",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          textAlign: "center",
                          boxShadow: "none",
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: "14px" }}>{size.name}</div>
                        <div style={{ fontSize: "11px", opacity: isSelected ? 0.95 : 0.65, marginTop: "3px" }}>{size.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Step 4: Facade Material */}
              {step === 4 && (
              <div>
                <h3 className="calc-step-title">
                  Материал фасадов и отделки
                </h3>
                <div className="calc-materials-grid">
                  {FACADE_MATERIALS.map((mat) => {
                    const isSelected = selectedMaterial === mat.id;
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        onClick={() => setSelectedMaterial(mat.id)}
                        style={{
                          background: isSelected ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                          border: `1px solid ${isSelected ? "var(--border-green)" : "var(--border-subtle)"}`,
                          borderRadius: "var(--radius-sm)",
                          padding: "16px",
                          fontWeight: isSelected ? 700 : 500,
                          fontSize: "15px",
                          color: isSelected ? "var(--color-text-primary)" : "var(--color-text-secondary)",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          textAlign: "left",
                          boxShadow: "none",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontWeight: 700, color: "var(--color-text-primary)" }}>{mat.name}</span>
                          <span style={{ fontSize: "10px", color: "var(--color-green-brand)", background: "var(--color-green-dark)", border: "1px solid var(--border-green)", padding: "2px 6px", borderRadius: "var(--radius-xs)" }}>{mat.tier}</span>
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--color-text-muted)", marginTop: "6px" }}>
                          {mat.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Step 5: Additional Options */}
              {step === 5 && (
              <div>
                <h3 className="calc-step-title">
                  Дополнительные опции комплектации
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {EXTRA_OPTIONS.map((opt) => {
                    const isChecked = selectedOptions.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleOption(opt.id)}
                        style={{
                          background: isChecked ? "var(--bg-surface-elevated)" : "var(--bg-surface)",
                          border: `1px solid ${isChecked ? "var(--border-green)" : "var(--border-subtle)"}`,
                          borderRadius: "var(--radius-sm)",
                          padding: "16px 20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          transition: "var(--transition)",
                          textAlign: "left",
                          width: "100%",
                          boxShadow: "none",
                        }}
                      >
                        <span style={{ fontSize: "15px", color: "var(--color-text-primary)", fontWeight: isChecked ? 600 : 400 }}>
                          {opt.name}
                        </span>
                        <span
                          style={{
                            width: "22px",
                            height: "22px",
                            borderRadius: "var(--radius-xs)",
                            border: `2px solid ${isChecked ? "var(--color-green-brand)" : "var(--border-medium)"}`,
                            background: isChecked ? "var(--color-green-brand)" : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#FFFFFF",
                            fontWeight: 800,
                            fontSize: "13px",
                            flexShrink: 0,
                            marginLeft: "16px",
                          }}
                        >
                          {isChecked ? "✓" : ""}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Materials List — кликабельный выбор */}
              {step === 5 && (
              <div className="calc-materials-spec-box">
                <h4 className="calc-materials-spec-title">
                  Материалы и покрытия
                </h4>
                <p style={{ fontSize: "12px", color: "var(--color-text-muted)", margin: "0 0 6px" }}>
                  Нажмите на материал, чтобы выбрать его для расчёта
                </p>
                <div className="calc-materials-spec-list">
                  {MATERIALS.map((mat) => {
                    const isFacade = mat.id !== "stopsol";
                    const isSelected = isFacade
                      ? selectedMaterial === (mat.id === "velvet" ? "plastic" : mat.id)
                      : selectedOptions.includes("stopsol");
                    return (
                      <button
                        key={mat.id}
                        type="button"
                        className={`calc-mat-spec-row ${isSelected ? "is-selected" : ""}`}
                        onClick={() => {
                          if (mat.id === "stopsol") {
                            if (!selectedOptions.includes("stopsol")) toggleOption("stopsol");
                          } else {
                            setSelectedMaterial(mat.id === "velvet" ? "plastic" : mat.id);
                          }
                        }}
                        style={{
                          textAlign: "left",
                          cursor: "pointer",
                          width: "100%",
                          transition: "var(--transition)",
                        }}
                      >
                        <div className="calc-mat-thumb">
                          <Image
                            src={mat.image}
                            alt={mat.title}
                            fill
                            sizes="48px"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        <div className="calc-mat-info">
                          <span className="calc-mat-name">
                            {mat.title}
                            {isSelected && (
                              <span style={{ color: "var(--color-green-brand)", fontSize: "11px", fontWeight: 600, marginLeft: "10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                Выбрано
                              </span>
                            )}
                          </span>
                          <span className="calc-mat-prop">{mat.description}</span>
                        </div>
                        <span className="calc-mat-tag">{mat.tag}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              )}

              {/* Wizard navigation */}              <div className="calc-nav-row">
                {step > 1 && (
                  <button type="button" className="btn btn-glass" onClick={() => setStep(step - 1)}>
                    ← Назад
                  </button>
                )}
                {step < 5 ? (
                  <button type="button" className="btn btn-green" onClick={() => setStep(step + 1)}>
                    Далее →
                  </button>
                ) : (
                  <Link href="#measure" className="btn btn-green">
                    Записаться на замер по этой комплектации →
                  </Link>
                )}
              </div>
            </div>

            {/* Right Column: Sticky Summary & Calculation Card */}
            <div className="calc-summary-card">
              <div>
                <span className="section-kicker" style={{ marginBottom: "6px" }}>
                  Сформированная спецификация
                </span>
                <h3 style={{ fontSize: "22px", fontWeight: 700, color: "var(--color-text-primary)", marginBottom: "6px" }}>
                  {calculation.complexity}
                </h3>
                <p style={{ fontSize: "13px", color: "var(--color-text-secondary)", lineHeight: "1.5" }}>
                  Прямой расчет сметы на собственном производстве на ул. Трефолева, 1П с учетом точной геометрии стен.
                </p>
              </div>

              {/* Preliminary Price */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)", marginBottom: "8px" }}>
                  Предварительная стоимость
                </div>
                <div style={{ fontFamily: "var(--font-serif)", fontSize: "30px", fontWeight: 500, color: "var(--color-text-primary)", lineHeight: 1.15, marginBottom: "8px" }}>
                  {calculation.priceLow.toLocaleString("ru-RU")} — {calculation.priceHigh.toLocaleString("ru-RU")} ₽
                </div>
                <div style={{ fontSize: "12px", color: "var(--color-text-muted)", lineHeight: "1.5" }}>
                  Корпус и фасады, без техники и монтажа. Точная смета — после замера инженером.
                </div>
              </div>

              {/* Specification Breakdown */}
              <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "18px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--color-text-muted)", marginBottom: "12px" }}>
                  Параметры заказа
                </div>
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px", color: "var(--color-text-secondary)" }}>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Тип мебели:</span>
                    <strong style={{ color: "var(--color-text-primary)" }}>{calculation.furnitureName}</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Размер:</span>
                    <strong style={{ color: "var(--color-text-primary)" }}>{calculation.sizeName}</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between" }}>
                    <span>Фасады:</span>
                    <strong style={{ color: "var(--color-text-primary)" }}>{calculation.materialName}</strong>
                  </li>
                  {calculation.optionsNames.length > 0 && (
                    <li style={{ borderTop: "1px dashed var(--border-subtle)", paddingTop: "8px", marginTop: "4px" }}>
                      <span style={{ fontSize: "11px", color: "var(--color-text-muted)", display: "block", marginBottom: "6px" }}>
                        Выбранные опции ({calculation.optionsCount}):
                      </span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                        {calculation.optionsNames.map((n, i) => (
                          <span key={i} className="spec-pill" style={{ fontSize: "11px" }}>
                            {n}
                          </span>
                        ))}
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "6px" }}>
                <a
                  href={`tel:${SITE_CONFIG.phoneRaw}`}
                  className="btn btn-green"
                  style={{ width: "100%", justifyContent: "center", gap: "8px" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Обсудить по телефону
                </a>
                <a
                  href={SITE_CONFIG.vkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                  style={{ width: "100%", justifyContent: "center", gap: "10px" }}
                >
                  <VkIcon />
                  Отправить спецификацию в VK
                </a>
                <a
                  href="#measure"
                  className="btn btn-glass"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Записаться на бесплатный замер
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Measure Form Section */}
      <section className="final-section" id="measure" style={{ backgroundColor: "var(--bg-studio)" }}>
        <div className="container">
          <div className="final-card-container">
            <div className="final-grid">
              <div className="final-cta-block">
                <span className="section-kicker">Бесплатный выезд мастера</span>
                <h2 className="final-headline">
                  Зафиксируйте параметры и вызовите инженера
                </h2>
                <p className="final-desc">
                  Специалист студии приедет с образцами материалов (Fenix, эмаль по RAL, шпон дуба), выполнит точный лазерный замер и рассчитает итоговую спецификацию на ул. Трефолева.
                </p>
                <div className="final-buttons-row">
                  <a
                    href={`tel:${SITE_CONFIG.phoneRaw}`}
                    className="btn btn-green"
                    style={{ gap: "8px" }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    {SITE_CONFIG.phone}
                  </a>
                  <a
                    href={SITE_CONFIG.vkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-glass"
                    style={{ gap: "10px" }}
                  >
                    <VkIcon />
                    ВКонтакте
                  </a>
                </div>
              </div>
              <div className="final-info-block">
                <MeasureForm initialCategory="Параметры из калькулятора" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
