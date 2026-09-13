export type ProjectType =
  | "Кухня"
  | "Гардеробная"
  | "Спальня"
  | "Прихожая"
  | "Корпусная мебель"
  | "Панели"
  | "Коммерческий";

export interface Project {
  slug: string;
  type: ProjectType;
  title: string;
  cover: string;
  gallery: string[];
  summary: string;
  materials: string[];
  /** Внутренний источник фактов. Не выводится на сайт. */
  source: string;
  relatedKitchenSlug?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "island-parquet",
    type: "Кухня",
    title: "Кухня: эмаль и натуральный шпон",
    cover: "/img/projects/island-parquet/photo_1.jpg",
    gallery: [
      "/img/projects/island-parquet/photo_1.jpg",
      "/img/projects/island-parquet/photo_2.jpg",
      "/img/projects/island-parquet/photo_3.jpg",
      "/img/projects/island-parquet/photo_4.jpg",
    ],
    summary: "Фасады из МДФ в эмали сочетаются с натуральным шпоном, а столешница из искусственного камня объединяет рабочую зону в единую композицию. Тёплая древесная фактура смягчает строгую геометрию кухни.",
    materials: ["МДФ в эмали", "Натуральный шпон", "Искусственный камень"],
    source: "posts/post_253/post_info.json",
  },
  {
    slug: "oak-stone",
    type: "Кухня",
    title: "Кухня: эмаль и массив дуба",
    cover: "/img/projects/oak-stone/photo_1.jpg",
    gallery: [
      "/img/projects/oak-stone/photo_1.jpg",
      "/img/projects/oak-stone/photo_2.jpg",
      "/img/projects/oak-stone/photo_3.jpg",
      "/img/projects/oak-stone/photo_4.jpg",
      "/img/projects/oak-stone/photo_5.jpg",
      "/img/projects/oak-stone/photo_6.jpg",
    ],
    summary: "Фасады из МДФ в эмали дополнены деталями из массива дуба. Столешница из кварцевого агломерата продолжается на подоконник, образуя цельную рабочую поверхность с интегрированной мойкой.",
    materials: ["МДФ в эмали", "Массив дуба", "Кварцевый агломерат"],
    source: "posts/post_246/post_info.json",
  },
  {
    slug: "white-showcase",
    type: "Кухня",
    title: "Белая угловая кухня с витриной",
    cover: "/img/projects/white-showcase/photo_1.jpg",
    gallery: [
      "/img/projects/white-showcase/photo_1.jpg",
      "/img/projects/white-showcase/photo_2.jpg",
      "/img/projects/white-showcase/photo_3.jpg",
      "/img/projects/white-showcase/photo_4.jpg",
      "/img/projects/white-showcase/photo_5.jpg",
    ],
    summary: "Светлая угловая кухня с высокими секциями помогает собрать хранение и встроенную технику в единую линию. Витрина с подсветкой делает крупную композицию визуально легче.",
    materials: [],
    source: "Подтверждённого текстового описания материалов нет; указаны только видимые элементы",
  },
  {
    slug: "marble-hood",
    type: "Кухня",
    title: "Кухня с тонкой столешницей HPL",
    cover: "/img/projects/marble-hood/photo_1.jpg",
    gallery: [
      "/img/projects/marble-hood/photo_1.jpg",
      "/img/projects/marble-hood/photo_2.jpg",
      "/img/projects/marble-hood/photo_3.jpg",
      "/img/projects/marble-hood/photo_4.jpg",
      "/img/projects/marble-hood/photo_5.jpg",
    ],
    summary: "Тонкая столешница HPL толщиной 12 мм подчёркивает горизонталь рабочей зоны и поддерживает лаконичный характер кухни. Решение выглядит легче привычной массивной столешницы.",
    materials: ["HPL 12 мм"],
    source: "posts/post_231/post_info.json",
  },
  {
    slug: "narrow-kitchen",
    type: "Кухня",
    title: "Кухня с фасадами МДФ ПВХ",
    cover: "/img/projects/narrow-kitchen/photo_1.jpg",
    gallery: [
      "/img/projects/narrow-kitchen/photo_1.jpg",
      "/img/projects/narrow-kitchen/photo_2.jpg",
      "/img/projects/narrow-kitchen/photo_3.jpg",
    ],
    summary: "Фасады из МДФ ПВХ в оттенке «кашемир серый» создают спокойную нейтральную основу, столешница Slotex добавляет фактуру. Ручки и фартук заказчик подобрал отдельно под интерьер.",
    materials: ["МДФ ПВХ", "Slotex"],
    source: "posts/post_244/post_info.json",
  },
  {
    slug: "emerald-enamel",
    type: "Кухня",
    title: "Кухня с фасадами МДФ в эмали",
    cover: "/img/projects/emerald-enamel/photo_1.jpg",
    gallery: [
      "/img/projects/emerald-enamel/photo_1.jpg",
      "/img/projects/emerald-enamel/photo_2.jpg",
      "/img/projects/emerald-enamel/photo_3.jpg",
      "/img/projects/emerald-enamel/photo_4.jpg",
    ],
    summary: "Фасады из МДФ в эмали делают цвет главным акцентом кухни. Выразительный оттенок сочетается с классической геометрией фасадов и светлыми верхними секциями.",
    materials: ["МДФ в эмали"],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
    relatedKitchenSlug: "emerald-enamel",
  },
  {
    slug: "velvet-matte",
    type: "Кухня",
    title: "Кухня с фасадами МДФ Velvet",
    cover: "/img/projects/velvet-matte/photo_1.jpg",
    gallery: [
      "/img/projects/velvet-matte/photo_1.jpg",
      "/img/projects/velvet-matte/photo_2.jpg",
    ],
    summary: "Фасады из МДФ-пластика Velvet поддерживают спокойный современный образ кухни. Матовая поверхность и лаконичная геометрия позволяют сосредоточить внимание на пропорциях и сочетании материалов.",
    materials: ["МДФ-пластик Velvet"],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
    relatedKitchenSlug: "velvet-matte",
  },
  {
    slug: "sherman-cognac",
    type: "Кухня",
    title: "Кухня: глянец и Egger Шерман",
    cover: "/img/projects/sherman-cognac/photo_1.jpg",
    gallery: [
      "/img/projects/sherman-cognac/photo_1.jpg",
      "/img/projects/sherman-cognac/photo_2.jpg",
      "/img/projects/sherman-cognac/photo_3.jpg",
      "/img/projects/sherman-cognac/photo_4.jpg",
    ],
    summary: "Белые глянцевые фасады из МДФ-пластика сочетаются с тёплым древесным декором Egger «Шерман коньяк коричневый». Благодаря этому кухня выглядит современной, но сохраняет уютный жилой характер.",
    materials: ["Глянцевый МДФ-пластик", "Egger «Шерман коньяк»"],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
    relatedKitchenSlug: "sherman-cognac",
  },
  {
    slug: "glass-wardrobe",
    type: "Гардеробная",
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
];
