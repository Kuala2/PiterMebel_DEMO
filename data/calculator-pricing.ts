/**
 * Источник: C:\Users\Titar\Downloads\просчет.ods, получен 11.09.2026.
 *
 * Таблица содержит детальную смету одного проекта, а не универсальную формулу
 * зависимости цены от погонных метров. Значения ниже используются только как
 * контрольная точка для широкого предварительного диапазона.
 */
export const CALCULATOR_PRICING = {
  enabled: true,
  source: "Рабочая смета одного проекта от 11.09.2026",
  sourceKind: "single-project-bill-of-materials",
  modelVersion: "rough-range-v1",
  categories: {
    kitchen: { perMeter: 105_000, minimum: 210_000 },
    wardrobe: { perMeter: 72_000, minimum: 120_000 },
    cabinet: { perMeter: 82_000, minimum: 110_000 },
  },
  layoutMultipliers: {
    straight: 1,
    corner: 1.1,
    "u-shaped": 1.18,
    island: 1.26,
    "built-in": 1,
    freestanding: 0.92,
    "walk-in": 1.18,
    single: 0.9,
    zone: 1,
    complex: 1.12,
  },
  materialMultipliers: {
    plastic: 1,
    enamel: 1.15,
    veneer: 1.3,
    unknown: 1.08,
  },
  optionAdditions: {
    worktop: 35_000,
    gola: 18_000,
    drawers: 28_000,
    lighting: 15_000,
    ceiling: 20_000,
    connections: 15_000,
    glass: 40_000,
    fittings: 24_000,
    filling: 22_000,
    mixed: 35_000,
  },
  range: {
    lowMultiplier: 0.85,
    highMultiplier: 1.18,
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
  const materialMultiplier = CALCULATOR_PRICING.materialMultipliers[material] ?? 1;
  const furnitureCost = Math.max(
    categoryPricing.minimum,
    categoryPricing.perMeter * meters * layoutMultiplier * materialMultiplier
  );
  const optionsCost = options.reduce((sum, optionId) => {
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
