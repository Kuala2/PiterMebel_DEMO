export interface KitchenSpec {
  label: string;
  value: string;
}

export interface Kitchen {
  slug: string;
  title: string;
  cover: string;
  gallery: string[];
  materialGroup: "plastic" | "enamel" | "combined";
  summary: string;
  specs: KitchenSpec[];
  /** Внутренний источник фактов. Не выводится на сайт. */
  source: string;
}

export const KITCHENS: Kitchen[] = [
  {
    slug: "slavena",
    title: "Кухня из МДФ-пластика с профилем Gola и искусственным камнем",
    cover: "/img/kitchens/slavena/photo_1.jpg",
    gallery: [
      "/img/kitchens/slavena/photo_1.jpg",
      "/img/kitchens/slavena/photo_2.jpg",
      "/img/kitchens/slavena/photo_3.jpg",
      "/img/kitchens/slavena/photo_4.jpg",
      "/img/kitchens/slavena/photo_5.jpg",
    ],
    materialGroup: "plastic",
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
    slug: "aleksandra",
    title: "Кухня из суперматового МДФ-пластика со столешницей Slotex",
    cover: "/img/kitchens/aleksandra/photo_1.jpg",
    gallery: [
      "/img/kitchens/aleksandra/photo_1.jpg",
      "/img/kitchens/aleksandra/photo_2.jpg",
      "/img/kitchens/aleksandra/photo_3.jpg",
      "/img/kitchens/aleksandra/photo_4.jpg",
    ],
    materialGroup: "plastic",
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
    slug: "timofey",
    title: "Кухня из МДФ-пластика с древесной столешницей Egger",
    cover: "/img/kitchens/timofey/photo_1.jpg",
    gallery: [
      "/img/kitchens/timofey/photo_1.jpg",
      "/img/kitchens/timofey/photo_2.jpg",
      "/img/kitchens/timofey/photo_3.jpg",
      "/img/kitchens/timofey/photo_4.jpg",
      "/img/kitchens/timofey/photo_5.jpg",
    ],
    materialGroup: "plastic",
    summary: "Светлые фасады из МДФ-пластика уравновешены древесной фактурой столешницы Egger. Фурнитура Hettich с доводчиками и встроенная подсветка отвечают за удобство в ежедневном использовании.",
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
    slug: "stefania",
    title: "Кухня из МДФ-пластика с профилем Gola и декором под дерево",
    cover: "/img/kitchens/stefania/photo_1.jpg",
    gallery: [
      "/img/kitchens/stefania/photo_1.jpg",
      "/img/kitchens/stefania/photo_2.jpg",
      "/img/kitchens/stefania/photo_3.jpg",
      "/img/kitchens/stefania/photo_4.jpg",
      "/img/kitchens/stefania/photo_5.jpg",
    ],
    materialGroup: "plastic",
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
    title: "Кухня с фасадами МДФ Эмаль",
    cover: "/img/kitchens/emerald-enamel/photo_1.jpg",
    gallery: [
      "/img/kitchens/emerald-enamel/photo_1.jpg",
      "/img/kitchens/emerald-enamel/photo_2.jpg",
      "/img/kitchens/emerald-enamel/photo_3.jpg",
      "/img/kitchens/emerald-enamel/photo_4.jpg",
    ],
    materialGroup: "enamel",
    summary: "Кухня с фасадами из МДФ в эмали. Ровное покрытие и глубокий цвет подчёркивают геометрию фасадов и делают композицию выразительной без лишнего декора.",
    specs: [{ label: "Фасады", value: "МДФ в эмали" }],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
  },
  {
    slug: "ulyana",
    title: "Кухня из белого МДФ-пластика и декора Egger с панелью под мрамор",
    cover: "/img/kitchens/ulyana/photo_1.jpg",
    gallery: [
      "/img/kitchens/ulyana/photo_1.jpg",
      "/img/kitchens/ulyana/photo_2.jpg",
      "/img/kitchens/ulyana/photo_3.jpg",
    ],
    materialGroup: "combined",
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
    title: "Кухня с фасадами МДФ пластик Velvet",
    cover: "/img/kitchens/velvet-matte/photo_1.jpg",
    gallery: [
      "/img/kitchens/velvet-matte/photo_1.jpg",
      "/img/kitchens/velvet-matte/photo_2.jpg",
    ],
    materialGroup: "plastic",
    summary: "Фасады из МДФ-пластика Velvet создают спокойную матовую поверхность и поддерживают лаконичный характер кухни. Основной акцент здесь сделан на сочетании фактур и чистой геометрии.",
    specs: [{ label: "Фасады", value: "МДФ-пластик Velvet" }],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
  },
  {
    slug: "valeria",
    title: "Кухня из МДФ в эмали и матовом пластике с витриной",
    cover: "/img/kitchens/valeria/photo_1.jpg",
    gallery: [
      "/img/kitchens/valeria/photo_1.jpg",
      "/img/kitchens/valeria/photo_2.jpg",
      "/img/kitchens/valeria/photo_3.jpg",
      "/img/kitchens/valeria/photo_4.jpg",
    ],
    materialGroup: "combined",
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
    title: "Кухня с глянцевыми фасадами МДФ пластик и декором Egger Шерман коньяк",
    cover: "/img/kitchens/sherman-cognac/photo_1.jpg",
    gallery: [
      "/img/kitchens/sherman-cognac/photo_1.jpg",
      "/img/kitchens/sherman-cognac/photo_2.jpg",
      "/img/kitchens/sherman-cognac/photo_3.jpg",
      "/img/kitchens/sherman-cognac/photo_4.jpg",
    ],
    materialGroup: "combined",
    summary: "Белые глянцевые фасады из МДФ-пластика сочетаются с тёплым древесным декором Egger «Шерман коньяк коричневый». Контраст гладкой и фактурной поверхностей делает кухню современной, но не холодной.",
    specs: [
      { label: "Фасады", value: "Глянцевый МДФ-пластик" },
      { label: "Декор", value: "Egger «Шерман коньяк коричневый»" },
    ],
    source: "client_data/AUDIO_TRANSCRIPTS.md, раздел 3",
  },
  {
    slug: "viktoria",
    title: "Кухня с молочными фасадами и столешницей под дерево",
    cover: "/img/kitchens/viktoria/photo_1.jpg",
    gallery: [
      "/img/kitchens/viktoria/photo_1.jpg",
      "/img/kitchens/viktoria/photo_2.jpg",
      "/img/kitchens/viktoria/photo_3.jpg",
      "/img/kitchens/viktoria/photo_4.jpg",
    ],
    materialGroup: "combined",
    summary: "Молочный оттенок фасадов делает кухню светлее, а столешница с древесным декором добавляет тепла. Спокойное сочетание легко вписывается в жилой интерьер и не перегружает пространство.",
    specs: [
      { label: "Сочетание", value: "Белые молочные фасады и столешница под дерево" },
    ],
    source: "products/item_7_kukhnya_viktoria/product_info.json",
  },
];
