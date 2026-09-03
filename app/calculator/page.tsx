"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import VkIcon from "@/components/VkIcon";
import MeasureForm from "@/components/MeasureForm";
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
    desc: "Линейные, угловые, П-образные гарнитуры и кухни с островом",
  },
  {
    id: "wardrobes",
    name: "Шкафы и гардеробные",
    desc: "Встроенные системы в нишу, гардеробные комнаты и витрины Stopsol",
  },
  {
    id: "cabinet",
    name: "Корпусная мебель для дома",
    desc: "Прихожие, подвесные ТВ-зоны, мебель для ванных и стеновые панели",
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
    name: "Прямая (линейная) кухня",
    subtitle: "Расположение вдоль одной стены, от 2.0 м",
    image: "/img/kitchens/aleksandra/photo_1.jpg",
  },
  {
    id: "kitchen-corner",
    categoryId: "kitchens",
    name: "Угловая (Г-образная) кухня",
    subtitle: "Классическая эргономичная компоновка с мойкой в углу",
    image: "/img/kitchens/valeria/photo_1.jpg",
  },
  {
    id: "kitchen-u",
    categoryId: "kitchens",
    name: "П-образная кухня",
    subtitle: "Максимум рабочей зоны и столешницы по трем стенам",
    image: "/img/kitchens/stefania/photo_1.jpg",
  },
  {
    id: "kitchen-island",
    categoryId: "kitchens",
    name: "Кухня с островом",
    subtitle: "Основной гарнитур плюс отдельно стоящая островная зона",
    image: "/img/kitchens/aleksandra/photo_3.jpg",
  },
  // Wardrobes
  {
    id: "wardrobe-room",
    categoryId: "wardrobes",
    name: "Гардеробная комната",
    subtitle: "Индивидуальное зонирование полок, вешалок и ящиков",
    image: "/img/projects/glass-wardrobe/photo_2.jpg",
  },
  {
    id: "wardrobe-niche",
    categoryId: "wardrobes",
    name: "Встроенный шкаф в нишу",
    subtitle: "Подгонка от пола до потолка без щелей и зазоров",
    image: "/img/projects/glass-wardrobe/photo_4.jpg",
  },
  {
    id: "wardrobe-hinged",
    categoryId: "wardrobes",
    name: "Распашной шкаф",
    subtitle: "Классические фасады со скрытыми петлями плавного хода",
    image: "/img/projects/glass-wardrobe/photo_5.jpg",
  },
  {
    id: "wardrobe-glass",
    categoryId: "wardrobes",
    name: "Витрины со стеклом Stopsol",
    subtitle: "Тонированное зеркальное стекло с подсветкой полок",
    image: "/img/projects/glass-wardrobe/photo_1.jpg",
  },
  // Cabinet
  {
    id: "cabinet-hall",
    categoryId: "cabinet",
    name: "Мебель для прихожей",
    subtitle: "Шкафы для верхней одежды, обувницы и мягкие банкетки",
    image: "/img/projects/green-hallway/photo_1.jpg",
  },
  {
    id: "cabinet-bath",
    categoryId: "cabinet",
    name: "Тумбы и пеналы в санузел",
    subtitle: "Влагостойкие фасады и бесшовная интеграция с сантехникой",
    image: "/img/projects/bathroom-enamel/photo_1.jpg",
  },
  {
    id: "cabinet-tv",
    categoryId: "cabinet",
    name: "Подвесная ТВ-зона",
    subtitle: "Парящие тумбы со скрытой прокладкой кабелей",
    image: "/img/projects/oak-veneer-panel/photo_3.jpg",
  },
  {
    id: "cabinet-slats",
    categoryId: "cabinet",
    name: "Стеновые панели из шпона",
    subtitle: "Интерьерная облицовка стен натуральным деревом",
    image: "/img/projects/oak-veneer-panel/photo_1.jpg",
  },
];

const SIZES = [
  { id: "s", name: "До 2.4 м", desc: "Компактная планировка для студии", meters: 2.4 },
  { id: "m", name: "2.5 – 3.2 м", desc: "Стандартный гарнитур для квартиры", meters: 3.0 },
  { id: "l", name: "3.3 – 4.2 м", desc: "Просторная кухня для семьи", meters: 3.8 },
  { id: "xl", name: "Более 4.2 м", desc: "Большой проект или кухня с островом", meters: 4.8 },
];

const FACADE_MATERIALS = [
  {
    id: "enamel",
    name: "Эмаль по палитре RAL / NCS",
    desc: "Безупречно гладкая матовая поверхность без швов. Более 2000 оттенков палитры RAL и NCS.",
    image: "/img/materials/enamel.jpg",
  },
  {
    id: "veneer",
    name: "Натуральный шпон дуба",
    desc: "Срез натурального дерева под матовым лаком. Выразительный природный рисунок годичных колец.",
    image: "/img/materials/veneer.jpg",
  },
  {
    id: "fenix",
    name: "Суперматовый пластик Fenix NTM",
    desc: "Итальянский нанопластик. Поверхность не собирает отпечатки пальцев и восстанавливается от микроцарапин.",
    image: "/img/materials/fenix.jpg",
  },
  {
    id: "plastic",
    name: "Пластик Velvet (матовый)",
    desc: "Практичная тактильная микротекстура. Высокая стойкость к бытовой химии, влаге и истиранию.",
    image: "/img/materials/velvet.jpg",
  },
];

const EXTRA_OPTIONS = [
  {
    id: "stone",
    name: "Столешница из искусственного камня",
    desc: "Бесшовная монолитная склейка с интегрированной мойкой без стыков",
  },
  {
    id: "gola",
    name: "Скрытый профиль Gola (без ручек)",
    desc: "Алюминиевый профиль в цвет корпуса для открывания за фасад",
  },
  {
    id: "stopsol",
    name: "Витрины со стеклом Stopsol",
    desc: "Зеркальный эффект при выключенном свете и демонстрация посуды с подсветкой",
  },
  {
    id: "ceiling",
    name: "Антресольный ярус точно в потолок",
    desc: "Подгонка без пылевого зазора сверху и максимальный объем хранения",
  },
  {
    id: "fittings",
    name: "Фурнитура Blum Legrabox и Aventos",
    desc: "Австрийские механизмы с доводчиками плавного хода (100 000 циклов)",
  },
  {
    id: "led",
    name: "Врезная теплая подсветка 3000K",
    desc: "Линейный алюминиевый профиль с бесконтактным сенсором взмаха руки",
  },
];

const CALC_STEPS = ["Направление", "Планировка", "Длина", "Фасады", "Опции"];

export default function CalculatorPage() {
  const [step, setStep] = useState(1);
  const [selectedMainCat, setSelectedMainCat] = useState("kitchens");
  const [selectedType, setSelectedType] = useState("kitchen-straight");
  const [selectedSize, setSelectedSize] = useState("m");
  const [customMeters, setCustomMeters] = useState(3.0);
  const [selectedMaterial, setSelectedMaterial] = useState("enamel");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([
    "gola",
    "fittings",
    "ceiling",
  ]);
  const [copied, setCopied] = useState(false);

  // Restore state from URL query params if present
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const cat = p.get("cat");
    const type = p.get("type");
    const m = p.get("meters");
    const mat = p.get("mat");
    const opts = p.get("opts");

    if (cat && MAIN_CATEGORIES.some((c) => c.id === cat)) setSelectedMainCat(cat);
    if (type && FURNITURE_SUBTYPES.some((s) => s.id === type)) setSelectedType(type);
    if (m && !isNaN(parseFloat(m))) setCustomMeters(parseFloat(m));
    if (mat && FACADE_MATERIALS.some((fm) => fm.id === mat)) setSelectedMaterial(mat);
    if (opts) setSelectedOptions(opts.split(",").filter(Boolean));
  }, []);

  const shareLink = () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams({
      cat: selectedMainCat,
      type: selectedType,
      meters: customMeters.toFixed(1),
      mat: selectedMaterial,
      opts: selectedOptions.join(","),
    });
    const url = `${window.location.origin}/calculator/?${params.toString()}`;
    const done = () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(done).catch(() => {});
    }
  };

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
    const mat = FACADE_MATERIALS.find((m) => m.id === selectedMaterial) || FACADE_MATERIALS[0];

    const basePerMeter: Record<string, number> = {
      kitchens: 58000,
      wardrobes: 46000,
      cabinet: 38000,
    };

    const matMult: Record<string, number> = {
      enamel: 1.15,
      veneer: 1.45,
      fenix: 1.30,
      plastic: 1.0,
    };

    const optionPrice: Record<string, number> = {
      stone: 55000,
      gola: 18000,
      stopsol: 38000,
      ceiling: 24000,
      fittings: 22000,
      led: 14000,
    };

    const baseCost = (basePerMeter[selectedMainCat] ?? 50000) * customMeters * (matMult[selectedMaterial] ?? 1);
    const optionsCost = selectedOptions.reduce((sum, id) => sum + (optionPrice[id] ?? 0), 0);
    const total = baseCost + optionsCost;

    const roundTo10k = (v: number) => Math.round(v / 10000) * 10000;
    const priceLow = roundTo10k(total * 0.92);
    const priceHigh = roundTo10k(total * 1.15);

    return {
      mainCategoryName: mainCat.name,
      furnitureName: furn.name,
      furnitureSubtitle: furn.subtitle,
      customMeters: customMeters.toFixed(1),
      materialName: mat.name,
      priceLow,
      priceHigh,
      optionsNames: selectedOptions
        .map((id) => EXTRA_OPTIONS.find((o) => o.id === id)?.name)
        .filter(Boolean),
    };
  }, [selectedMainCat, selectedType, currentSubtypes, customMeters, selectedMaterial, selectedOptions]);

  return (
    <div className="calc-page">
      {/* 1. Page Header */}
      <section className="page-header">
        <div className="container">
          <h1 className="subpage-hero-title">Конфигуратор стоимости мебели</h1>
          <p className="subpage-hero-caption">
            Предварительный расчет сметы на собственном производстве без наценок салона
          </p>
        </div>
      </section>

      {/* 2. Main Configurator Section */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "40px", paddingBottom: "80px" }}>
        <div className="container">
          <div className="calc-layout-grid">
            {/* Left Column: Interactive Steps (Tile-free, minimal & clear) */}
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Step Navigation Tabs */}
              <div className="calc-clean-tabs">
                {CALC_STEPS.map((label, i) => {
                  const n = i + 1;
                  const isActive = n === step;
                  return (
                    <button
                      key={label}
                      type="button"
                      className={`calc-clean-tab ${isActive ? "is-active" : ""}`}
                      onClick={() => setStep(n)}
                    >
                      <span style={{ opacity: isActive ? 1 : 0.6, marginRight: "6px" }}>{n}.</span>
                      {label}
                    </button>
                  );
                })}
              </div>

              {/* STEP 1: Main Category */}
              {step === 1 && (
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginBottom: "8px" }}>
                    Что будем проектировать?
                  </h2>
                  <p style={{ fontSize: "14px", color: "#8C92A4", marginBottom: "20px" }}>
                    Выберите интерьерное направление мебели.
                  </p>

                  <div className="calc-clean-list">
                    {MAIN_CATEGORIES.map((cat) => {
                      const isSelected = selectedMainCat === cat.id;
                      return (
                        <div
                          key={cat.id}
                          className={`calc-clean-item ${isSelected ? "is-selected" : ""}`}
                          onClick={() => handleMainCatChange(cat.id)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div className="calc-radio-indicator" />
                            <div>
                              <div style={{ fontSize: "15.5px", fontWeight: 600, color: "#FFFFFF" }}>
                                {cat.name}
                              </div>
                              <div style={{ fontSize: "13px", color: "#7E8596", marginTop: "2px" }}>
                                {cat.desc}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 2: Subtype & Layout */}
              {step === 2 && (
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginBottom: "8px" }}>
                    Конфигурация и планировка
                  </h2>
                  <p style={{ fontSize: "14px", color: "#8C92A4", marginBottom: "20px" }}>
                    Выберите форму расположения модулей в помещении.
                  </p>

                  <div className="calc-clean-list">
                    {currentSubtypes.map((type) => {
                      const isSelected = selectedType === type.id;
                      return (
                        <div
                          key={type.id}
                          className={`calc-clean-item ${isSelected ? "is-selected" : ""}`}
                          onClick={() => setSelectedType(type.id)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div className="calc-radio-indicator" />
                            <div style={{ position: "relative", width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", flexShrink: 0 }}>
                              <Image src={type.image} alt={type.name} fill style={{ objectFit: "cover" }} />
                            </div>
                            <div>
                              <div style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF" }}>
                                {type.name}
                              </div>
                              <div style={{ fontSize: "13px", color: "#7E8596", marginTop: "2px" }}>
                                {type.subtitle}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 3: Length / Dimensions */}
              {step === 3 && (
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginBottom: "8px" }}>
                    Ориентировочная длина по стенам
                  </h2>
                  <p style={{ fontSize: "14px", color: "#8C92A4", marginBottom: "20px" }}>
                    Укажите примерную длину стен для расчета количества модулей и столешницы.
                  </p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px", marginBottom: "24px" }}>
                    {SIZES.map((size) => {
                      const isSelected = selectedSize === size.id;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => {
                            setSelectedSize(size.id);
                            setCustomMeters(size.meters);
                          }}
                          style={{
                            background: isSelected ? "rgba(140, 224, 65, 0.08)" : "transparent",
                            border: `1px solid ${isSelected ? "var(--color-green-brand)" : "rgba(255, 255, 255, 0.1)"}`,
                            borderRadius: "8px",
                            padding: "16px 14px",
                            cursor: "pointer",
                            textAlign: "left",
                            transition: "all 0.15s ease",
                          }}
                        >
                          <div style={{ fontWeight: 600, fontSize: "15px", color: isSelected ? "var(--color-green-brand)" : "#FFFFFF" }}>
                            {size.name}
                          </div>
                          <div style={{ fontSize: "12px", color: "#7E8596", marginTop: "4px" }}>
                            {size.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Manual adjustment counter */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
                    <span style={{ fontSize: "14px", color: "#8C92A4" }}>
                      Точная длина:
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <button
                        type="button"
                        onClick={() => setCustomMeters((prev) => Math.max(1.8, +(prev - 0.2).toFixed(1)))}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "6px",
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "#FFFFFF",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      >
                        –
                      </button>
                      <span style={{ fontSize: "20px", fontWeight: 700, color: "#FFFFFF", minWidth: "60px", textAlign: "center" }}>
                        {customMeters.toFixed(1)} м
                      </span>
                      <button
                        type="button"
                        onClick={() => setCustomMeters((prev) => Math.min(7.0, +(prev + 0.2).toFixed(1)))}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "6px",
                          background: "rgba(255, 255, 255, 0.06)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          color: "#FFFFFF",
                          fontSize: "18px",
                          cursor: "pointer",
                        }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Facade Materials */}
              {step === 4 && (
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginBottom: "8px" }}>
                    Материал фасадов
                  </h2>
                  <p style={{ fontSize: "14px", color: "#8C92A4", marginBottom: "20px" }}>
                    Материалы обрабатываются на ЧПУ-станках с влагостойким кромлением PUR-клеем.
                  </p>

                  <div className="calc-clean-list">
                    {FACADE_MATERIALS.map((mat) => {
                      const isSelected = selectedMaterial === mat.id;
                      return (
                        <div
                          key={mat.id}
                          className={`calc-clean-item ${isSelected ? "is-selected" : ""}`}
                          onClick={() => setSelectedMaterial(mat.id)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div className="calc-radio-indicator" />
                            <div style={{ position: "relative", width: "48px", height: "48px", borderRadius: "6px", overflow: "hidden", flexShrink: 0 }}>
                              <Image src={mat.image} alt={mat.name} fill style={{ objectFit: "cover" }} />
                            </div>
                            <div>
                              <div style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF" }}>
                                {mat.name}
                              </div>
                              <div style={{ fontSize: "13px", color: "#7E8596", marginTop: "2px" }}>
                                {mat.desc}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP 5: Options & Hardware */}
              {step === 5 && (
                <div>
                  <h2 style={{ fontSize: "20px", fontWeight: 600, color: "#FFFFFF", marginBottom: "8px" }}>
                    Комплектация и оснащение
                  </h2>
                  <p style={{ fontSize: "14px", color: "#8C92A4", marginBottom: "20px" }}>
                    Отметьте необходимые инженерные решения для долговечности и комфорта.
                  </p>

                  <div className="calc-clean-list">
                    {EXTRA_OPTIONS.map((opt) => {
                      const isSelected = selectedOptions.includes(opt.id);
                      return (
                        <div
                          key={opt.id}
                          className={`calc-clean-item ${isSelected ? "is-selected" : ""}`}
                          onClick={() => toggleOption(opt.id)}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                            <div className="calc-checkbox-indicator">
                              {isSelected && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              )}
                            </div>
                            <div>
                              <div style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF" }}>
                                {opt.name}
                              </div>
                              <div style={{ fontSize: "13px", color: "#7E8596", marginTop: "2px" }}>
                                {opt.desc}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div style={{ display: "flex", gap: "12px", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "20px" }}>
                {step > 1 && (
                  <button
                    type="button"
                    className="btn btn-glass"
                    onClick={() => setStep((s) => s - 1)}
                  >
                    ← Назад
                  </button>
                )}
                {step < 5 ? (
                  <button
                    type="button"
                    className="btn btn-green"
                    onClick={() => setStep((s) => s + 1)}
                  >
                    Далее: {CALC_STEPS[step]} →
                  </button>
                ) : (
                  <a href="#measure" className="btn btn-green">
                    Зафиксировать расчет и вызвать замерщика →
                  </a>
                )}
              </div>
            </div>

            {/* Right Column: Lightweight Flat Estimate Sidebar */}
            <div className="calc-summary-card">
              <div>
                <div style={{ fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8C92A4", marginBottom: "8px" }}>
                  Ориентир стоимости
                </div>
                <div style={{ fontFamily: "var(--font-main)", fontSize: "28px", fontWeight: 700, color: "var(--color-green-brand)", lineHeight: 1.15, marginBottom: "8px", fontVariantNumeric: "tabular-nums lining-nums", letterSpacing: "-0.02em" }}>
                  {calculation.priceLow.toLocaleString("ru-RU")} — {calculation.priceHigh.toLocaleString("ru-RU")} ₽
                </div>
                <div style={{ fontSize: "12.5px", color: "#7E8596", lineHeight: "1.5" }}>
                  Прямой расчет на ЧПУ-производстве в СПб. Включает раскрой, кромление PUR-клеем, фасады и фурнитуру. Без салонных наценок.
                </div>
              </div>

              {/* Specification Parameters */}
              <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "16px" }}>
                <div style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#8C92A4", marginBottom: "12px" }}>
                  Параметры спецификации
                </div>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px", fontSize: "13.5px" }}>
                  <li style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ color: "#7E8596" }}>Тип:</span>
                    <strong style={{ color: "#FFFFFF", textAlign: "right" }}>{calculation.furnitureName}</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ color: "#7E8596" }}>Длина по стенам:</span>
                    <strong style={{ color: "#FFFFFF" }}>{calculation.customMeters} м</strong>
                  </li>
                  <li style={{ display: "flex", justifyContent: "space-between", gap: "10px" }}>
                    <span style={{ color: "#7E8596" }}>Фасады:</span>
                    <strong style={{ color: "#FFFFFF", textAlign: "right" }}>{calculation.materialName}</strong>
                  </li>
                  {calculation.optionsNames.length > 0 && (
                    <li style={{ borderTop: "1px solid rgba(255, 255, 255, 0.06)", paddingTop: "10px", marginTop: "2px" }}>
                      <span style={{ color: "#7E8596", display: "block", marginBottom: "6px", fontSize: "12px" }}>
                        Выбранные опции:
                      </span>
                      <div style={{ fontSize: "12.5px", color: "#C2C7D4", lineHeight: "1.5" }}>
                        {calculation.optionsNames.join(", ")}
                      </div>
                    </li>
                  )}
                </ul>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px", paddingTop: "4px" }}>
                <a
                  href="#measure"
                  className="btn btn-green"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Записаться на бесплатный замер
                </a>
                <a
                  href={SITE_CONFIG.vkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-glass"
                  style={{ width: "100%", justifyContent: "center", gap: "8px" }}
                >
                  <VkIcon />
                  Обсудить спецификацию в VK
                </a>
                <button
                  type="button"
                  className="btn btn-glass"
                  style={{ width: "100%", justifyContent: "center" }}
                  onClick={shareLink}
                >
                  {copied ? "Ссылка скопирована ✓" : "Скопировать ссылку"}
                </button>
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
                <span className="section-kicker">Бесплатный выезд инженера</span>
                <h2 className="final-headline">
                  Зафиксируйте расчет и вызовите специалиста на замер
                </h2>
                <p className="final-desc">
                  Ведущий инженер студии приедет в Санкт-Петербурге с полным чемоданом образцов (Fenix NTM, эмаль по RAL, шпон дуба, камень), выполнит лазерный замер стен с учетом розеток и вентиляции и подготовит проект под ваши размеры.
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