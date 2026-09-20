/**
 * Источник: C:\Users\Titar\Downloads\просчет.ods и аудиоинструкции Елены Волковой.
 *
 * Откалибровано по реальной смете и типовым проектам:
 * - Угловая кухня 3,5 м (4,1 м по стенам минус 600 мм угол):
 *   - Egger (3 кат.): 250 000 — 280 000 ₽
 *   - МДФ ПВХ (плёнка): 280 000 — 300 000 ₽
 *   - МДФ пластик AGT / Velvet: 300 000 — 330 000 ₽
 * - Шкафы (90% заказов в ЛДСП Egger):
 *   - Типовой шкаф в Egger: 120 000 — 140 000 ₽
 *   - Премиум-опции: МДФ ПВХ и МДФ Эмаль
 */
export const CALCULATOR_PRICING = {
  enabled: true,
  source: "Смета производства от 11.09.2026 с калибровкой по реальным заказам",
  sourceKind: "single-project-bill-of-materials",
  modelVersion: "calibrated-v2",
  categories: {
    kitchen: { perMeter: 72_000, minimum: 160_000 },
    wardrobe: { perMeter: 65_000, minimum: 80_000 },
    cabinet: { perMeter: 68_000, minimum: 80_000 },
  },
  layoutMultipliers: {
    straight: 1,
    corner: 1.05,
    "u-shaped": 1.15,
    island: 1.22,
    "built-in": 1,
    freestanding: 0.95,
    "walk-in": 1.15,
    single: 0.9,
    zone: 1,
    complex: 1,
  },
  materialMultipliers: {
    egger: 1,
    pvc: 1.096,
    plastic: 1.191,
    enamel: 1.34,
    veneer: 1.55,
    unknown: 1.10,
  },
  categoryMaterialMultipliers: {
    kitchen: {
      egger: 1,
      pvc: 1.096,
      plastic: 1.191,
      enamel: 1.34,
      veneer: 1.55,
      unknown: 1.10,
    },
    wardrobe: {
      egger: 1,
      pvc: 1.25,
      plastic: 1.35,
      enamel: 1.55,
      veneer: 1.70,
      unknown: 1.10,
    },
    cabinet: {
      egger: 1,
      pvc: 1.15,
      plastic: 1.22,
      enamel: 1.40,
      veneer: 1.58,
      unknown: 1.10,
    },
  },
  optionAdditions: {
    worktop: 22_000,
    worktop_premium: 45_000,
    gola: 18_000,
    drawers: 28_000,
    lighting: 15_000,
    ceiling: 20_000,
    connections: 18_000,
    glass: 40_000,
    fittings: 24_000,
    filling: 22_000,
    mixed: 35_000,
  },
  range: {
    lowMultiplier: 0.95,
    highMultiplier: 1.05,
    roundTo: 10_000,
  },
  reference: {
    componentsSubtotal: 162_056.4,
    productionMultiplier: 1.92,
    delivery: 8_000,
    designAndMeasure: 4_000,
    productionCost: 323_148.288,
    designCost: 339_305.7024,
    finalCost: 355_463.1168,
    installmentSixMonths: 391_009.42848,
    installmentTwelveMonths: 408_782.58432,
  },
  missingForPublicEstimate: [
    "Нормы расхода листов и площади фасадов для каждой планировки и длины",
    "Количество петель, ящиков и механизмов по выбранной конфигурации",
    "Состав базовой комплектации кухни, шкафа и корпусной мебели",
    "Правила расчёта столешницы, углов, острова, доставки и монтажа",
    "Дата действия закупочных цен и допустимый диапазон отклонения",
  ],
} as const;

export type CalculatorCategory = keyof typeof CALCULATOR_PRICING.categories;

export interface SizePreset {
  id: string;
  name: string;
  description: string;
  meters: number;
}

export const DEFAULT_METERS_BY_CATEGORY: Record<CalculatorCategory, number> = {
  kitchen: 3.0,
  wardrobe: 2.0,
  cabinet: 1.8,
};

export const SIZE_PRESETS_BY_CATEGORY: Record<CalculatorCategory, SizePreset[]> = {
  kitchen: [
    { id: "compact", name: "До 2,4 м", description: "Компактный проект", meters: 2.4 },
    { id: "standard", name: "Около 3 м", description: "Средний размер", meters: 3.0 },
    { id: "large", name: "Около 3,8 м", description: "Просторная зона", meters: 3.8 },
    { id: "xl", name: "От 4,8 м", description: "Большой проект", meters: 4.8 },
  ],
  wardrobe: [
    { id: "compact", name: "1,6 м", description: "2 секции (ниша / компактный)", meters: 1.6 },
    { id: "standard", name: "2,0 м", description: "3 секции (стандарт)", meters: 2.0 },
    { id: "large", name: "2,4 м", description: "4 секции (вместительный)", meters: 2.4 },
    { id: "xl", name: "От 3,0 м", description: "Во всю стену / гардероб", meters: 3.0 },
  ],
  cabinet: [
    { id: "compact", name: "1,2 м", description: "Компактная тумба / ниша", meters: 1.2 },
    { id: "standard", name: "1,8 м", description: "Стандартная зона хранения", meters: 1.8 },
    { id: "large", name: "2,4 м", description: "ТВ-зона или прихожая", meters: 2.4 },
    { id: "xl", name: "От 3,2 м", description: "Комплексная композиция", meters: 3.2 },
  ],
};

export interface EstimateInput {
  category: CalculatorCategory;
  layout: string;
  meters: number;
  material: keyof typeof CALCULATOR_PRICING.materialMultipliers;
  options: string[];
}

export interface EstimateResult {
  low: number;
  high: number;
  midpoint: number;
}

function roundPrice(value: number) {
  const step = CALCULATOR_PRICING.range.roundTo;
  return Math.round(value / step) * step;
}

export function calculateEstimate({
  category,
  layout,
  meters,
  material,
  options,
}: EstimateInput): EstimateResult {
  const categoryPricing = CALCULATOR_PRICING.categories[category];
  const layoutMultiplier = CALCULATOR_PRICING.layoutMultipliers[
    layout as keyof typeof CALCULATOR_PRICING.layoutMultipliers
  ] ?? 1;
  const categorySpecific = CALCULATOR_PRICING.categoryMaterialMultipliers as Record<
    string,
    Record<string, number>
  >;
  const materialMultiplier =
    categorySpecific[category]?.[material] ??
    CALCULATOR_PRICING.materialMultipliers[material] ??
    1;
  const furnitureCost = Math.max(
    categoryPricing.minimum,
    categoryPricing.perMeter * meters * layoutMultiplier * materialMultiplier
  );
  const optionsCost = options.reduce((sum, optionId) => {
    // В базовую стоимость кухни уже включена влагостойкая столешница Slotex 38 мм
    if (category === "kitchen" && optionId === "worktop") return sum;
    const addition = CALCULATOR_PRICING.optionAdditions[
      optionId as keyof typeof CALCULATOR_PRICING.optionAdditions
    ] ?? 0;
    return sum + addition;
  }, 0);
  const midpoint = furnitureCost + optionsCost;

  return {
    low: roundPrice(midpoint * CALCULATOR_PRICING.range.lowMultiplier),
    high: roundPrice(midpoint * CALCULATOR_PRICING.range.highMultiplier),
    midpoint: roundPrice(midpoint),
  };
}
