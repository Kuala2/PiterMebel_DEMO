export type ProjectType =
  | "Гардеробная"
  | "Спальня"
  | "Прихожая"
  | "Корпусная мебель"
  | "Панели"
  | "Коммерческий"
  | "Перегородки"
  | "Ванная";

export interface Project {
  slug: string;
  type: ProjectType;
  targetHref: string;
  title: string;
  cover: string;
  gallery: string[];
  summary: string;
  materials: string[];
  /** Внутренний источник фактов. Не выводится на сайт. */
  source: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "glass-wardrobe",
    type: "Гардеробная",
    targetHref: "/wardrobes/walk-in/",
    title: "Гардеробная со стеклом Stopsol",
    cover: "/img/projects/glass-wardrobe/photo_1.jpg",
    gallery: [
      "/img/projects/glass-wardrobe/photo_1.jpg",
      "/img/projects/glass-wardrobe/photo_2.jpg",
      "/img/projects/glass-wardrobe/photo_3.jpg",
      "/img/projects/glass-wardrobe/photo_4.jpg",
      "/img/projects/glass-wardrobe/photo_5.jpg",
      "/img/projects/glass-wardrobe/photo_6.jpg",
    ],
    summary: "Раздвижные перегородки отделяют гардеробную, не утяжеляя пространство спальни. При выключенной подсветке стекло Stopsol выглядит как зеркало, а при включённой становится прозрачным; конструкция выполнена без нижней направляющей.",
    materials: ["Стекло Stopsol"],
    source: "posts/post_254/post_info.json",
  },
  {
    slug: "brick-wardrobe",
    type: "Гардеробная",
    targetHref: "/wardrobes/walk-in/",
    title: "П-образная гардеробная со скошенными полками",
    cover: "/img/projects/brick-wardrobe/photo_1.jpg",
    gallery: [
      "/img/projects/brick-wardrobe/photo_1.jpg",
      "/img/projects/brick-wardrobe/photo_2.jpg",
      "/img/projects/brick-wardrobe/photo_3.jpg",
      "/img/projects/brick-wardrobe/photo_4.jpg",
      "/img/projects/brick-wardrobe/photo_5.jpg",
      "/img/projects/brick-wardrobe/photo_6.jpg",
    ],
    summary: "П-образная планировка использует пространство гардеробной по трём стенам. Секции выполнены из ЛДСП Egger «Дуб Кендал натуральный», а полки у скошенной стены изготовлены по шаблону помещения.",
    materials: ["ЛДСП Egger H3170", "Дуб Кендал натуральный"],
    source: "posts/post_247/post_info.json",
  },
  {
    slug: "wardrobe-inside",
    type: "Гардеробная",
    targetHref: "/wardrobes/swing/",
    title: "Шкафы для комнаты и прихожей",
    cover: "/img/projects/wardrobe-inside/photo_1.jpg",
    gallery: [
      "/img/projects/wardrobe-inside/photo_1.jpg",
      "/img/projects/wardrobe-inside/photo_2.jpg",
      "/img/projects/wardrobe-inside/photo_3.jpg",
      "/img/projects/wardrobe-inside/photo_4.jpg",
      "/img/projects/wardrobe-inside/photo_5.jpg",
      "/img/projects/wardrobe-inside/photo_6.jpg",
    ],
    summary: "Шкафы для комнаты и прихожей выполнены из ЛДСП Egger U705 «Ангора серая». Нейтральный оттенок объединяет мебель в разных помещениях и спокойно сочетается с интерьером.",
    materials: ["ЛДСП Egger U705", "Ангора серая"],
    source: "posts/post_243/post_info.json",
  },
  {
    slug: "bedroom-set",
    type: "Спальня",
    targetHref: "/wardrobes/bedroom/",
    title: "Шкафы и мебель для спальни",
    cover: "/img/projects/bedroom-set/photo_1.jpg",
    gallery: [
      "/img/projects/bedroom-set/photo_1.jpg",
      "/img/projects/bedroom-set/photo_2.jpg",
      "/img/projects/bedroom-set/photo_3.jpg",
      "/img/projects/bedroom-set/photo_4.jpg",
      "/img/projects/bedroom-set/photo_5.jpg",
      "/img/projects/bedroom-set/photo_6.jpg",
    ],
    summary: "Мебель для спальни выполнена как часть комплексного заказа для квартиры. Шкафы, тумбы и другие элементы выдержаны в единой спокойной стилистике, поэтому пространство воспринимается цельно.",
    materials: [],
    source: "posts/post_232/post_info.json; материалы конкретной комнаты не указаны",
  },
  {
    slug: "mirror-hall",
    type: "Прихожая",
    targetHref: "/wardrobes/hallway/",
    title: "Зеркальный шкаф с нишей для обуви",
    cover: "/img/projects/mirror-hall/photo_1.jpg",
    gallery: [
      "/img/projects/mirror-hall/photo_1.jpg",
      "/img/projects/mirror-hall/photo_2.jpg",
      "/img/projects/mirror-hall/photo_3.jpg",
      "/img/projects/mirror-hall/photo_4.jpg",
    ],
    summary: "Встроенный зеркальный шкаф объединяет хранение и большое зеркало в полный рост. Открытая ниша оставляет удобное место для повседневной обуви, а торцевые ручки не дробят поверхность фасадов.",
    materials: ["Зеркальные фасады", "Торцевые ручки"],
    source: "posts/post_256/post_info.json",
  },
  {
    slug: "slat-panels",
    type: "Корпусная мебель",
    targetHref: "/wardrobes/sliding/",
    title: "Кухня, стеллаж и шкаф-купе",
    cover: "/img/projects/slat-panels/photo_1.jpg",
    gallery: [
      "/img/projects/slat-panels/photo_1.jpg",
      "/img/projects/slat-panels/photo_2.jpg",
      "/img/projects/slat-panels/photo_3.jpg",
      "/img/projects/slat-panels/photo_4.jpg",
      "/img/projects/slat-panels/photo_5.jpg",
      "/img/projects/slat-panels/photo_6.jpg",
    ],
    summary: "Стеллаж переходит в кухню, а кухня — в шкаф-купе, связывая несколько функциональных зон в единую конструкцию. Полки и секции изготовлены под размеры помещения, чтобы вся композиция выглядела цельно.",
    materials: [],
    source: "posts/post_245/post_info.json",
  },
  {
    slug: "oak-veneer-panel",
    type: "Панели",
    targetHref: "/custom-furniture/tv-zones/",
    title: "ТВ-зона с панелями из шпона дуба",
    cover: "/img/projects/oak-veneer-panel/photo_1.jpg",
    gallery: [
      "/img/projects/oak-veneer-panel/photo_1.jpg",
      "/img/projects/oak-veneer-panel/photo_2.jpg",
      "/img/projects/oak-veneer-panel/photo_3.jpg",
    ],
    summary: "ТВ-зона входит в комплексный проект мебели для квартиры. Панели из натурального шпона дуба сочетаются с МДФ в эмали и продолжают общую палитру интерьера.",
    materials: ["МДФ в эмали", "Натуральный шпон дуба"],
    source: "posts/post_252/post_info.json",
  },
  {
    slug: "office-reception",
    type: "Коммерческий",
    targetHref: "/custom-furniture/business/",
    title: "Стойка ресепшен для клиники",
    cover: "/img/projects/office-reception/photo_1.jpg",
    gallery: [
      "/img/projects/office-reception/photo_1.jpg",
      "/img/projects/office-reception/photo_2.jpg",
      "/img/projects/office-reception/photo_3.jpg",
      "/img/projects/office-reception/photo_4.jpg",
      "/img/projects/office-reception/photo_5.jpg",
    ],
    summary: "Стойка ресепшен спроектирована для клиники и объединяет рабочее место администратора с выразительной входной зоной. В отделке использованы акриловый искусственный камень, рейки из массива бука, МДФ в эмали и LED-подсветка.",
    materials: ["Акриловый камень", "Массив бука", "МДФ в эмали", "LED-подсветка"],
    source: "posts/post_251/post_info.json",
  },
  {
    slug: "light-wood-wardrobe",
    type: "Гардеробная",
    targetHref: "/wardrobes/walk-in/",
    title: "Гардеробная с подсветкой и древесным декором",
    cover: "/img/projects/light-wood-wardrobe/photo_1.jpg",
    gallery: [
      "/img/projects/light-wood-wardrobe/photo_1.jpg",
      "/img/projects/light-wood-wardrobe/photo_2.jpg",
      "/img/projects/light-wood-wardrobe/photo_3.jpg",
      "/img/projects/light-wood-wardrobe/photo_4.jpg",
      "/img/projects/light-wood-wardrobe/photo_5.jpg",
      "/img/projects/light-wood-wardrobe/photo_6.jpg",
    ],
    summary: "Открытая гардеробная система по индивидуальным размерам. Встроенная светодиодная подсветка полок и штанг сочетается с тёплым древесным декором корпуса и выдвижных ящиков.",
    materials: ["Древесный декор", "LED-подсветка"],
    source: "posts/post_261/post_info.json",
  },
  {
    slug: "sliding-partition",
    type: "Перегородки",
    targetHref: "/custom-furniture/partitions/",
    title: "Раздвижная перегородка для зонирования",
    cover: "/img/projects/sliding-partition/photo_1.jpg",
    gallery: [
      "/img/projects/sliding-partition/photo_1.jpg",
      "/img/projects/sliding-partition/photo_2.jpg",
      "/img/projects/sliding-partition/photo_3.jpg",
      "/img/projects/sliding-partition/photo_4.jpg",
    ],
    summary: "Раздвижная межкомнатная перегородка для зонирования жилого пространства. Каркас из прочного алюминиевого профиля с безопасным остеклением в защитной плёнке, срок изготовления от 10 дней.",
    materials: ["Алюминиевый профиль", "Стекло в защитной плёнке"],
    source: "posts/post_229/post_info.json",
  },
  {
    slug: "cascade-partitions",
    type: "Перегородки",
    targetHref: "/custom-furniture/partitions/",
    title: "Каскадные раздвижные перегородки",
    cover: "/img/projects/cascade-partitions/photo_1.jpg",
    gallery: [
      "/img/projects/cascade-partitions/photo_1.jpg",
      "/img/projects/cascade-partitions/photo_2.jpg",
      "/img/projects/cascade-partitions/photo_3.jpg",
      "/img/projects/cascade-partitions/photo_4.jpg",
      "/img/projects/cascade-partitions/photo_5.jpg",
      "/img/projects/cascade-partitions/photo_6.jpg",
      "/img/projects/cascade-partitions/photo_7.jpg",
      "/img/projects/cascade-partitions/photo_8.jpg",
    ],
    summary: "Система интерьерных раздвижных дверей и перегородок с каскадным открыванием. Возможен беспороговый монтаж без нижней направляющей, варианты глухих, зеркальных и рифлёных вставок.",
    materials: ["Алюминиевый профиль", "Рифлёное и матовое стекло"],
    source: "posts/post_208/post_info.json",
  },
  {
    slug: "curved-oak-facades",
    type: "Корпусная мебель",
    targetHref: "/custom-furniture/veneer-wood/",
    title: "Радиусные фасады из шпона дуба",
    cover: "/img/projects/curved-oak-facades/photo_1.jpg",
    gallery: [
      "/img/projects/curved-oak-facades/photo_1.jpg",
      "/img/projects/curved-oak-facades/photo_2.jpg",
      "/img/projects/curved-oak-facades/photo_3.jpg",
    ],
    summary: "Гнутые (радиусные) мебельные фасады из натурального шпона дуба под защитным лаком. Собственное производство элементов сложной геометрии для индивидуальных мебельных композиций.",
    materials: ["Шпон дуба под лаком", "Радиусные фасады"],
    source: "posts/post_159/post_info.json",
  },
  {
    slug: "bathroom-vanity",
    type: "Ванная",
    targetHref: "/custom-furniture/bathroom/",
    title: "Влагостойкая мебель для ванной комнаты",
    cover: "/img/projects/bathroom-vanity/photo_1.jpg",
    gallery: [
      "/img/projects/bathroom-vanity/photo_1.jpg",
      "/img/projects/bathroom-vanity/photo_2.jpg",
    ],
    summary: "Мебель для санузлов и ванных комнат с повышенной защитой от влаги. Фасады и корпуса из МДФ в пластике с влагостойкой кромкой.",
    materials: ["МДФ в пластике", "Влагостойкая кромка"],
    source: "posts/post_156/post_info.json",
  },
];
