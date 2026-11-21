export interface KitchenSpec {
  label: string;
  value: string;
}

export type KitchenFacadeTier =
  | "plastic"
  | "pvc"
  | "plastic-egger"
  | "enamel-plastic"
  | "enamel"
  | "veneer"
  | "custom";

export interface Kitchen {
  slug: string;
  title: string;
  cover: string;
  gallery: string[];
  materialGroup: "plastic" | "enamel" | "combined";
  /** Подтверждённая ценовая/технологическая группа фасадов по исходнику проекта. */
  facadeTier: KitchenFacadeTier;
  summary: string;
  specs: KitchenSpec[];
  /** Внутренний источник фактов. Не выводится на сайт. */
  source: string;
}

export const KITCHENS: Kitchen[] = [
  {
    slug: "mdf-plastik-gola",
    title: "Кухня МДФ пластик Gola",
    cover: "/img/kitchens/slavena/photo_1.jpg",
    gallery: [
      "/img/kitchens/slavena/photo_1.jpg",
      "/img/kitchens/slavena/photo_2.jpg",
      "/img/kitchens/slavena/photo_3.jpg",
      "/img/kitchens/slavena/photo_4.jpg",
      "/img/kitchens/slavena/photo_5.jpg",
    ],
    materialGroup: "plastic",
    facadeTier: "plastic",
    summary: "Фасады из МДФ-пластика объединены со столешницей и фартуком из искусственного камня. Профиль Gola сохраняет чистую линию фасадов, а встроенная подсветка делает рабочую зону удобнее.",
    specs: [
      { label: "Фасады", value: "МДФ-пластик" },
      { label: "Корпус", value: "Egger" },
      { label: "Столешница и фартук", value: "Искусственный камень" },
      { label: "Открывание", value: "Профиль Gola" },
      { label: "Подсветка", value: "LED" },
    ],
    source: "products/item_2_kukhnya_slavena/product_info.json",
  },
  {
    slug: "mdf-plastik-slotex",
    title: "Кухня МДФ пластик и Slotex",
    cover: "/img/kitchens/aleksandra/photo_1.jpg",
    gallery: [
      "/img/kitchens/aleksandra/photo_1.jpg",
      "/img/kitchens/aleksandra/photo_2.jpg",
      "/img/kitchens/aleksandra/photo_3.jpg",
      "/img/kitchens/aleksandra/photo_4.jpg",
    ],
    materialGroup: "plastic",
    facadeTier: "plastic",
    summary: "Суперматовые фасады из МДФ-пластика создают спокойную современную основу, а влагостойкая столешница Slotex добавляет интерьеру выразительную фактуру. Корпус выполнен из материалов Egger, за плавную работу механизмов отвечает фурнитура Blum.",
    specs: [
      { label: "Фасады", value: "Суперматовый МДФ-пластик" },
      { label: "Корпус", value: "Egger" },
      { label: "Столешница", value: "Slotex" },
      { label: "Фурнитура", value: "Blum" },
      { label: "Подсветка", value: "LED" },
    ],
    source: "products/item_1_kukhnya_alexandra/product_info.json",
  },
  {
    slug: "mdf-plastik-hettich",
    title: "Кухня МДФ пластик Hettich",
    cover: "/img/kitchens/timofey/photo_1.jpg",
    gallery: [
      "/img/kitchens/timofey/photo_1.jpg",
      "/img/kitchens/timofey/photo_2.jpg",
      "/img/kitchens/timofey/photo_3.jpg",
      "/img/kitchens/timofey/photo_4.jpg",
      "/img/kitchens/timofey/photo_5.jpg",
    ],
    materialGroup: "plastic",
    facadeTier: "plastic",
    summary: "Серые матовые фасады из МДФ-пластика уравновешены древесной фактурой столешницы Egger. Фурнитура Hettich с доводчиками и встроенная подсветка отвечают за удобство в ежедневном использовании.",
    specs: [
      { label: "Фасады", value: "МДФ-пластик" },
      { label: "Корпус", value: "Egger" },
      { label: "Столешница", value: "Egger, декор под дерево" },
      { label: "Фурнитура", value: "Hettich с доводчиками" },
      { label: "Подсветка", value: "LED" },
    ],
    source: "products/item_4_kukhnya_timofey/product_info.json",
  },
  {
    slug: "mdf-grafit-gola",
    title: "Кухня МДФ Графит Gola",
    cover: "/img/kitchens/stefania/photo_1.jpg",
    gallery: [
      "/img/kitchens/stefania/photo_1.jpg",
      "/img/kitchens/stefania/photo_2.jpg",
      "/img/kitchens/stefania/photo_3.jpg",
      "/img/kitchens/stefania/photo_4.jpg",
      "/img/kitchens/stefania/photo_5.jpg",
    ],
    materialGroup: "plastic",
    facadeTier: "plastic",
    summary: "Практичные фасады из МДФ-пластика дополнены древесным декором столешницы Egger. На нижних секциях используется профиль Gola, поэтому рабочая линия выглядит аккуратно и без лишних деталей.",
    specs: [
      { label: "Фасады", value: "МДФ-пластик" },
      { label: "Корпус", value: "Egger" },
      { label: "Столешница", value: "Egger, декор под дерево" },
      { label: "Фурнитура", value: "Blum" },
      { label: "Открывание", value: "Профиль Gola на нижних секциях" },
    ],
    source: "products/item_3_kukhnya_stefania/product_info.json",
  },
  {
    slug: "emerald-enamel",
    title: "Кухня МДФ Эмаль",
    cover: "/img/kitchens/emerald-enamel/photo_1.jpg",
    gallery: [
      "/img/kitchens/emerald-enamel/photo_1.jpg",
      "/img/kitchens/emerald-enamel/photo_2.jpg",
      "/img/kitchens/emerald-enamel/photo_3.jpg",
      "/img/kitchens/emerald-enamel/photo_4.jpg",
    ],
    materialGroup: "enamel",
    facadeTier: "enamel",
    summary: "Угловая кухня с фрезерованными фасадами из МДФ в эмали. Насыщенный зелёный низ сочетается с белыми верхними шкафами и витринами с перекрёстной раскладкой.",
    specs: [{ label: "Фасады", value: "МДФ в эмали" }],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
  },
  {
    slug: "mdf-belyj-egger",
    title: "Кухня белый пластик и Egger",
    cover: "/img/kitchens/ulyana/photo_1.jpg",
    gallery: [
      "/img/kitchens/ulyana/photo_1.jpg",
      "/img/kitchens/ulyana/photo_2.jpg",
      "/img/kitchens/ulyana/photo_3.jpg",
    ],
    materialGroup: "combined",
    facadeTier: "plastic-egger",
    summary: "Белые фасады из МДФ-пластика сочетаются с древесным декором Egger и стеновой панелью под белый мрамор. Верхние секции выполнены без ручек, подсветка включается сенсором.",
    specs: [
      { label: "Фасады", value: "Белый МДФ-пластик и декор Egger" },
      { label: "Столешница", value: "Egger" },
      { label: "Стеновая панель", value: "«Троя», белый мрамор" },
      { label: "Подсветка", value: "LED с сенсорным включением" },
      { label: "Верхние секции", value: "Без ручек" },
    ],
    source: "products/item_5_kukhnya_ulyana/product_info.json",
  },
  {
    slug: "velvet-matte",
    title: "Кухня МДФ Velvet",
    cover: "/img/kitchens/velvet-matte/photo_1.jpg",
    gallery: [
      "/img/kitchens/velvet-matte/photo_1.jpg",
      "/img/kitchens/velvet-matte/photo_2.jpg",
    ],
    materialGroup: "plastic",
    facadeTier: "plastic",
    summary: "Фасады из МДФ-пластика Velvet создают спокойную матовую поверхность и поддерживают лаконичный характер кухни. Основной акцент здесь сделан на сочетании фактур и чистой геометрии.",
    specs: [{ label: "Фасады", value: "МДФ-пластик Velvet" }],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
  },
  {
    slug: "mdf-emal-vitrina",
    title: "Кухня МДФ эмаль с витриной",
    cover: "/img/kitchens/valeria/photo_1.jpg",
    gallery: [
      "/img/kitchens/valeria/photo_1.jpg",
      "/img/kitchens/valeria/photo_2.jpg",
    ],
    materialGroup: "combined",
    facadeTier: "enamel-plastic",
    summary: "В этой кухне сочетаются фасады из МДФ в эмали и матовом пластике. Чёрная алюминиевая рамка витрины добавляет графичный акцент, а корпус и столешница Egger поддерживают общую спокойную композицию.",
    specs: [
      { label: "Фасады", value: "МДФ в эмали и матовом пластике" },
      { label: "Корпус", value: "Egger" },
      { label: "Столешница", value: "Egger" },
      { label: "Фурнитура", value: "Blum" },
      { label: "Витрина", value: "Узкая чёрная алюминиевая рамка" },
    ],
    source: "products/item_6_kukhnya_valeria/product_info.json",
  },
  {
    slug: "sherman-cognac",
    title: "Кухня Egger Шерман коньяк",
    cover: "/img/kitchens/sherman-cognac/photo_1.jpg",
    gallery: [
      "/img/kitchens/sherman-cognac/photo_1.jpg",
      "/img/kitchens/sherman-cognac/photo_2.jpg",
      "/img/kitchens/sherman-cognac/photo_3.jpg",
      "/img/kitchens/sherman-cognac/photo_4.jpg",
    ],
    materialGroup: "combined",
    facadeTier: "plastic-egger",
    summary: "Белые глянцевые фасады из МДФ-пластика сочетаются с тёплым древесным декором Egger «Шерман коньяк коричневый». Контраст гладкой и фактурной поверхностей делает кухню современной, но не холодной.",
    specs: [
      { label: "Фасады", value: "Глянцевый МДФ-пластик" },
      { label: "Декор", value: "Egger «Шерман коньяк коричневый»" },
    ],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
  },
  {
    slug: "mdf-klassika-dub",
    title: "Классическая молочная кухня",
    cover: "/img/kitchens/viktoria/photo_1.jpg",
    gallery: [
      "/img/kitchens/viktoria/photo_1.jpg",
      "/img/kitchens/viktoria/photo_2.jpg",
      "/img/kitchens/viktoria/photo_3.jpg",
      "/img/kitchens/viktoria/photo_4.jpg",
    ],
    materialGroup: "combined",
    facadeTier: "custom",
    summary: "Молочный оттенок фрезерованных фасадов делает кухню светлее, а столешница и фартук с древесным декором добавляют тепла. Спокойное сочетание легко вписывается в жилой интерьер и не перегружает пространство.",
    specs: [
      { label: "Фасады", value: "Молочные с классической фрезеровкой" },
      { label: "Столешница и фартук", value: "Декор под дерево" },
      { label: "Детали", value: "Витрина с раскладкой и LED-подсветка" },
    ],
    source: "products/item_7_kukhnya_viktoria/product_info.json (материал покрытия фасадов в исходнике не указан)",
  },
  {
    slug: "island-parquet",
    title: "Кухня эмаль и натуральный шпон",
    cover: "/img/projects/island-parquet/photo_1.jpg",
    gallery: [
      "/img/projects/island-parquet/photo_1.jpg",
      "/img/projects/island-parquet/photo_2.jpg",
      "/img/projects/island-parquet/photo_3.jpg",
      "/img/projects/island-parquet/photo_4.jpg",
    ],
    materialGroup: "enamel",
    facadeTier: "veneer",
    summary: "Фасады из МДФ в эмали сочетаются с натуральным шпоном, а столешница из искусственного камня объединяет рабочую зону в единую композицию. Тёплая древесная фактура смягчает строгую геометрию кухни.",
    specs: [
      { label: "Фасады", value: "МДФ в эмали и натуральный шпон" },
      { label: "Столешница", value: "Искусственный камень" },
    ],
    source: "posts/post_253/post_info.json",
  },
  {
    slug: "oak-stone",
    title: "Кухня эмаль и массив дуба",
    cover: "/img/projects/oak-stone/photo_1.jpg",
    gallery: [
      "/img/projects/oak-stone/photo_1.jpg",
      "/img/projects/oak-stone/photo_2.jpg",
      "/img/projects/oak-stone/photo_3.jpg",
      "/img/projects/oak-stone/photo_4.jpg",
      "/img/projects/oak-stone/photo_5.jpg",
    ],
    materialGroup: "enamel",
    facadeTier: "veneer",
    summary: "Фасады из МДФ в эмали дополнены деталями из массива дуба. Столешница из кварцевого агломерата продолжается на подоконник, образуя цельную рабочую поверхность с интегрированной мойкой.",
    specs: [
      { label: "Фасады", value: "МДФ в эмали и массив дуба" },
      { label: "Столешница", value: "Кварцевый агломерат" },
    ],
    source: "posts/post_246/post_info.json",
  },
  {
    slug: "white-showcase",
    title: "Кухня МДФ Velvet с витриной и HPL",
    cover: "/img/projects/white-showcase/photo_2.jpg",
    gallery: [
      "/img/projects/white-showcase/photo_2.jpg",
      "/img/projects/white-showcase/photo_3.jpg",
      "/img/projects/white-showcase/photo_4.jpg",
    ],
    materialGroup: "plastic",
    facadeTier: "plastic",
    summary: "Угловая кухня с двусторонними фасадами из МДФ-пластика Velvet и тонкой столешницей HPL 12 мм с подклеенной мойкой нижнего крепления. Вместо ручек установлен профиль Gola, в витрине выполнена врезная подсветка, вся фурнитура — с доводчиками.",
    specs: [
      { label: "Фасады", value: "Двусторонний МДФ-пластик Velvet" },
      { label: "Столешница", value: "HPL 12 мм, мойка нижнего крепления" },
      { label: "Открывание", value: "Профиль Gola" },
      { label: "Фурнитура", value: "С доводчиками" },
      { label: "Подсветка", value: "Врезная LED в витрине и рабочей зоне" },
    ],
    source: "posts/post_248/post_info.json",
  },
  {
    slug: "marble-hood",
    title: "Кухня с тонкой столешницей HPL",
    cover: "/img/projects/marble-hood/photo_1.jpg",
    gallery: [
      "/img/projects/marble-hood/photo_1.jpg",
      "/img/projects/marble-hood/photo_2.jpg",
      "/img/projects/marble-hood/photo_3.jpg",
      "/img/projects/marble-hood/photo_4.jpg",
      "/img/projects/marble-hood/photo_5.jpg",
    ],
    materialGroup: "combined",
    facadeTier: "custom",
    summary: "Тонкая чёрная столешница HPL толщиной 12 мм с мойкой нижнего крепления подчёркивает горизонталь рабочей зоны и делает угловую композицию визуально легче. В пенал встроен холодильник, рабочая зона дополнена LED-подсветкой.",
    specs: [
      { label: "Столешница", value: "Тонкая HPL 12 мм" },
      { label: "Оснащение", value: "Мойка нижнего крепления, LED-подсветка" },
    ],
    source: "posts/post_231/post_info.json (материал покрытия фасадов в исходнике не указан)",
  },
  {
    slug: "narrow-kitchen",
    title: "Кухня с фасадами МДФ ПВХ",
    cover: "/img/projects/narrow-kitchen/photo_1.jpg",
    gallery: [
      "/img/projects/narrow-kitchen/photo_1.jpg",
      "/img/projects/narrow-kitchen/photo_2.jpg",
      "/img/projects/narrow-kitchen/photo_3.jpg",
    ],
    materialGroup: "combined",
    facadeTier: "pvc",
    summary: "Фасады из МДФ ПВХ в оттенке «кашемир серый» создают спокойную нейтральную основу, столешница Slotex добавляет фактуру. Ручки и фартук заказчик подобрал отдельно под интерьер.",
    specs: [
      { label: "Фасады", value: "МДФ ПВХ «кашемир серый»" },
      { label: "Столешница", value: "Slotex" },
    ],
    source: "posts/post_244/post_info.json",
  },
];
