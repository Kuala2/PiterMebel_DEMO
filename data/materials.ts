export interface MaterialItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  image: string;
}

export const MATERIALS: MaterialItem[] = [
  {
    id: "enamel",
    title: "Эмаль по RAL",
    subtitle: "Шелковисто-матовая",
    description: "Безупречно гладкая поверхность и точный подбор любого оттенка палитры.",
    tag: "Палитра RAL",
    image: "/img/materials/enamel.jpg",
  },
  {
    id: "veneer",
    title: "Натуральный шпон дуба",
    subtitle: "Природная текстура",
    description: "Выразительный рисунок благородного дерева для фасадов и реечных панелей.",
    tag: "Текстура дуба",
    image: "/img/materials/veneer.jpg",
  },
  {
    id: "fenix",
    title: "Суперматовый Fenix NTM",
    subtitle: "Нанотехнологичный",
    description: "Ультраматовое бархатистое покрытие с защитой от отпечатков пальцев.",
    tag: "Anti-Fingerprint",
    image: "/img/materials/fenix.jpg",
  },
  {
    id: "stopsol",
    title: "Стекло «Стопсол»",
    subtitle: "Смарт-зеркало",
    description: "Зеркальный эффект в темноте и эффектная витрина при включении подсветки.",
    tag: "Смарт-стекло",
    image: "/img/materials/stopsol.jpg",
  },
  {
    id: "velvet",
    title: "Покрытие Velvet",
    subtitle: "Soft-touch",
    description: "Приятная тактильная микротекстура, стойкая к бытовым загрязнениям.",
    tag: "Soft-Touch",
    image: "/img/materials/velvet.jpg",
  },
];
