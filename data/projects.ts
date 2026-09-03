export type ProjectType = "Кухня" | "Гардеробная" | "Спальня" | "Прихожая" | "Панели" | "Коммерческий";

export interface Project {
  slug: string;
  type: ProjectType;
  title: string;
  cover: string;
  gallery: string[];
  task: string;
  solution: string;
  materials: string[];
  price?: number;
  priceNote?: string;
  relatedKitchenSlug?: string;
}

export const PROJECTS: Project[] = [
  {
    slug: "island-parquet",
    type: "Кухня",
    title: "Кухня с островом и обеденным столом-слэбом",
    cover: "/img/projects/island-parquet/photo_1.jpg",
    gallery: [
      "/img/projects/island-parquet/photo_1.jpg",
      "/img/projects/island-parquet/photo_2.jpg",
      "/img/projects/island-parquet/photo_3.jpg",
      "/img/projects/island-parquet/photo_4.jpg"
    ],
    task: "Просторное помещение с классическим паркетом французской елкой и высокими потолками требовало гарнитура музейного уровня. Необходимо было зонировать кулинарную зону, остров и примыкающую обеденную группу со столом из массивного слэба.",
    solution: "Мы спроектировали монументальный гарнитур в матовой темной эмали с отделкой шпоном дуба. Центром композиции стал многофункциональный остров с варочной панелью и линейной встроенной подсветкой над рабочей плоскостью.",
    materials: ["Матовая эмаль по RAL", "Натуральный шпон дуба", "Каменная столешница", "Интегрированный линейный свет"],
    relatedKitchenSlug: "aleksandra"
  },
  {
    slug: "oak-stone",
    type: "Кухня",
    title: "Кухня в сочетании шпона дуба и камня",
    cover: "/img/projects/oak-stone/photo_1.jpg",
    gallery: [
      "/img/projects/oak-stone/photo_1.jpg",
      "/img/projects/oak-stone/photo_2.jpg",
      "/img/projects/oak-stone/photo_3.jpg",
      "/img/projects/oak-stone/photo_4.jpg",
      "/img/projects/oak-stone/photo_5.jpg",
      "/img/projects/oak-stone/photo_6.jpg"
    ],
    task: "Требовалось гармонично вписать угловой кухонный гарнитур в интерьер с круглым обеденным столом и декоративной акцентной люстрой. Важно было подчеркнуть природную эстетику дерева и камня без перегрузки вертикальных плоскостей.",
    solution: "Фасады нижнего яруса и высоких пеналов облицованы шпоном дуба с выразительной фактурой волокон. Рабочая зона и фартук выполнены из цельного камня с естественным рисунком прожилок, создавая ощущение монолитности.",
    materials: ["Натуральный шпон дуба", "Кварцевый камень", "Матовая эмаль", "Скрытые врезные ручки"],
    relatedKitchenSlug: "timofey"
  },
  {
    slug: "white-showcase",
    type: "Кухня",
    title: "Белая кухня с витриной и теплой подсветкой",
    cover: "/img/projects/white-showcase/photo_1.jpg",
    gallery: [
      "/img/projects/white-showcase/photo_1.jpg",
      "/img/projects/white-showcase/photo_2.jpg",
      "/img/projects/white-showcase/photo_3.jpg",
      "/img/projects/white-showcase/photo_4.jpg",
      "/img/projects/white-showcase/photo_5.jpg"
    ],
    task: "Помещение со сложной геометрией стен и вентиляционным коробом требовало визуального расширения. Заказчики хотели чистый белый гарнитур с контрастной рабочей зоной и вечерним сценарием мягкого освещения.",
    solution: "Мы изготовили белоснежные гладкие фасады с антипальчиковым покрытием Velvet и темную тонкую столешницу. В верхний ярус интегрирована застекленная витрина с теплым рассеянным светом, создающая уютный вечерний акцент.",
    materials: ["Антипальчиковое покрытие Velvet", "Матовая эмаль", "Тонированное стекло", "Врезной алюминиевый профиль"],
    relatedKitchenSlug: "valeria"
  },
  {
    slug: "marble-hood",
    type: "Кухня",
    title: "Кухня с мраморной отделкой и акцентной вытяжкой",
    cover: "/img/projects/marble-hood/photo_1.jpg",
    gallery: [
      "/img/projects/marble-hood/photo_1.jpg",
      "/img/projects/marble-hood/photo_2.jpg",
      "/img/projects/marble-hood/photo_3.jpg",
      "/img/projects/marble-hood/photo_4.jpg",
      "/img/projects/marble-hood/photo_5.jpg"
    ],
    task: "Задачей проекта было создание строгого графичного интерьера кухни с акцентом на фактуру натурального мрамора. Требовалось аккуратно обыграть массивную цилиндрическую вытяжку черного цвета.",
    solution: "Фартук и рабочая поверхность облицованы мраморным массивом с глубокими контрастными прожилками. Нижние шкафы в эмали образуют идеальную геометрическую базу, подчеркивающую парящую форму черной вытяжки.",
    materials: ["Матовая эмаль по RAL", "Мраморная отделка фартука", "Интегрированная мойка", "Скрытые системы открывания"],
    relatedKitchenSlug: "slavena"
  },
  {
    slug: "narrow-kitchen",
    type: "Кухня",
    title: "Узкая кухня со встроенной колонной пеналов",
    cover: "/img/projects/narrow-kitchen/photo_1.jpg",
    gallery: [
      "/img/projects/narrow-kitchen/photo_1.jpg",
      "/img/projects/narrow-kitchen/photo_2.jpg",
      "/img/projects/narrow-kitchen/photo_3.jpg"
    ],
    task: "Вытянутое компактное помещение требовало рационального использования каждого сантиметра. Стояла задача разместить полноценный комплект встроенной бытовой техники, сохранив свободный проход вдоль рабочей линии.",
    solution: "Мы выстроили линейный гарнитур с монолитной колонной пеналов во всю высоту потолка, куда компактно встроены духовой шкаф и холодильник. Светлые фасады зрительно раздвигают границы узкой комнаты.",
    materials: ["Матовая эмаль", "Влагостойкая столешница", "Интегрированный цоколь", "Скрытый крепеж"],
    relatedKitchenSlug: "ulyana"
  },
  {
    slug: "glass-wardrobe",
    type: "Гардеробная",
    title: "Гардеробная за тонированным стеклом «Стопсол»",
    cover: "/img/projects/glass-wardrobe/photo_1.jpg",
    gallery: [
      "/img/projects/glass-wardrobe/photo_1.jpg",
      "/img/projects/glass-wardrobe/photo_2.jpg",
      "/img/projects/glass-wardrobe/photo_3.jpg",
      "/img/projects/glass-wardrobe/photo_4.jpg",
      "/img/projects/glass-wardrobe/photo_5.jpg",
      "/img/projects/glass-wardrobe/photo_6.jpg"
    ],
    task: "В мастер-спальне требовалось выделить изолированную гардеробную зону, сохранив ощущение единого открытого пространства и визуальной легкости.",
    solution: "Мы установили раздвижные перегородки из премиального стекла «Стопсол» в тонком черном профиле. При выключенном освещении фасады работают как отражающие зеркала, а при включении встроенной подсветки открывают внутренний обзор.",
    materials: ["Стекло «Стопсол» с зеркальным эффектом", "Тонкий алюминиевый профиль", "Вертикальная подсветка полок", "Корпус глубокого графитового тона"],
    price: 245000,
    priceNote: "от 48 000 ₽ / м.п. под ключ"
  },
  {
    slug: "brick-wardrobe",
    type: "Гардеробная",
    title: "Встроенная гардеробная на фоне кирпичной кладки",
    cover: "/img/projects/brick-wardrobe/photo_1.jpg",
    gallery: [
      "/img/projects/brick-wardrobe/photo_1.jpg",
      "/img/projects/brick-wardrobe/photo_2.jpg",
      "/img/projects/brick-wardrobe/photo_3.jpg",
      "/img/projects/brick-wardrobe/photo_4.jpg",
      "/img/projects/brick-wardrobe/photo_5.jpg",
      "/img/projects/brick-wardrobe/photo_6.jpg"
    ],
    task: "Лофтовое пространство с фактурной кирпичной стеной требовало системы хранения, которая подчеркнет брутальный характер интерьера и обеспечит аккуратное зонирование вещей.",
    solution: "Система встроенных гардеробных секций с открытыми и закрытыми отсеками спроектирована точно по высоте кирпичной ниши. Фактура древесных панелей эффектно контрастирует с шероховатой текстурой кирпича.",
    materials: ["Натуральный шпон дуба", "Матовая эмаль", "Металлические направляющие", "Встроенные штанги для одежды"]
  },
  {
    slug: "wardrobe-inside",
    type: "Гардеробная",
    title: "Система хранения: полки, штанги и выдвижные ящики",
    cover: "/img/projects/wardrobe-inside/photo_1.jpg",
    gallery: [
      "/img/projects/wardrobe-inside/photo_1.jpg",
      "/img/projects/wardrobe-inside/photo_2.jpg",
      "/img/projects/wardrobe-inside/photo_3.jpg",
      "/img/projects/wardrobe-inside/photo_4.jpg",
      "/img/projects/wardrobe-inside/photo_5.jpg",
      "/img/projects/wardrobe-inside/photo_6.jpg"
    ],
    task: "Создание максимально эргономичного внутреннего наполнения для вместительного гардеробного шкафа в спальне с зонами под длинную одежду, белье и аксессуары.",
    solution: "Мы разработали многоярусную систему с усиленными штангами, плавными выдвижными ящиками скрытого монтажа и регулируемыми полками. Продуманное внутреннее зонирование позволяет поддерживать безупречный порядок.",
    materials: ["Высокопрочные мебельные плиты", "Направляющие скрытого монтажа", "Алюминиевые штанги", "Встроенные органайзеры"]
  },
  {
    slug: "bedroom-set",
    type: "Спальня",
    title: "Спальня со встроенными шкафами от пола до потолка",
    cover: "/img/projects/bedroom-set/photo_1.jpg",
    gallery: [
      "/img/projects/bedroom-set/photo_1.jpg",
      "/img/projects/bedroom-set/photo_2.jpg",
      "/img/projects/bedroom-set/photo_3.jpg",
      "/img/projects/bedroom-set/photo_4.jpg",
      "/img/projects/bedroom-set/photo_5.jpg",
      "/img/projects/bedroom-set/photo_6.jpg"
    ],
    task: "Оборудование жилой спальной комнаты комплексным мебельным решением. Требовалось встроить вместительный платяной шкаф без зазоров у потолочного карниза и плинтусов.",
    solution: "Шкафы встроены в нишу заподлицо со стенами, формируя чистую плоскость в матовой эмали пастельного оттенка. Прикроватная зона дополнена подвесными тумбами в едином визуальном стиле.",
    materials: ["Матовая эмаль по RAL", "Интегрированные ручки-профили", "Доводчики плавного хода", "Настенные панели"]
  },
  {
    slug: "mirror-hall",
    type: "Прихожая",
    title: "Зеркальная прихожая с обувницей и скрытыми ручками",
    cover: "/img/projects/mirror-hall/photo_1.jpg",
    gallery: [
      "/img/projects/mirror-hall/photo_1.jpg",
      "/img/projects/mirror-hall/photo_2.jpg",
      "/img/projects/mirror-hall/photo_3.jpg",
      "/img/projects/mirror-hall/photo_4.jpg"
    ],
    task: "Входная зона квартиры требовала создания вместительного встроенного шкафа с зеркальными полотнами в полный рост и открытой подсвеченной нишей для обуви.",
    solution: "Мы изготовили шкаф с зеркальными фасадами от пола до потолка, визуально удвоившими ширину прихожей. В нижней части спроектирована парящая ниша для обуви с мягкой светодиодной подсветкой.",
    materials: ["Зеркальные ударопрочные полотна", "Матовая эмаль", "Скрытые ручки-профили", "Влагостойкое покрытие цокольной ниши"]
  },
  {
    slug: "slat-panels",
    type: "Панели",
    title: "Стеновые реечные панели и встроенный стеллаж",
    cover: "/img/projects/slat-panels/photo_1.jpg",
    gallery: [
      "/img/projects/slat-panels/photo_1.jpg",
      "/img/projects/slat-panels/photo_2.jpg",
      "/img/projects/slat-panels/photo_3.jpg",
      "/img/projects/slat-panels/photo_4.jpg",
      "/img/projects/slat-panels/photo_5.jpg",
      "/img/projects/slat-panels/photo_6.jpg"
    ],
    task: "Оформление гостиной зоны с непрерывным переходом от кухонной зоны к акцентной ТВ-стене. Важно было создать выразительный объемный ритм на стене.",
    solution: "Мы изготовили массив стеновых реечных панелей из шпона дуба с точной геометрией ламелей. В единую плоскость панелей гармонично интегрированы открытые стеллажные секции с акцентным светом.",
    materials: ["Стеновые реечные панели", "Натуральный шпон дуба", "Матовая эмаль", "Скрытая подсветка пазов"]
  },
  {
    slug: "oak-veneer-panel",
    type: "Панели",
    title: "Фасады и настенные элементы в шпоне натурального дуба",
    cover: "/img/projects/oak-veneer-panel/photo_1.jpg",
    gallery: [
      "/img/projects/oak-veneer-panel/photo_1.jpg",
      "/img/projects/oak-veneer-panel/photo_2.jpg",
      "/img/projects/oak-veneer-panel/photo_3.jpg"
    ],
    task: "Индивидуальный подбор рисунка и текстуры шпона для серии мебельных фасадов и настенных декоративных накладок.",
    solution: "Каждая панель шпонирована вручную с радиальным подбором волокон древесины. Поверхность обработана защитным шелковисто-матовым составом, подчеркивающим природный золотистый оттенок дуба.",
    materials: ["Натуральный шпон дуба радиального распила", "Защитное шелковисто-матовое покрытие", "Основа высокой плотности"]
  },
  {
    slug: "office-reception",
    type: "Коммерческий",
    title: "Стойка ресепшена для офисного пространства",
    cover: "/img/projects/office-reception/photo_1.jpg",
    gallery: [
      "/img/projects/office-reception/photo_1.jpg",
      "/img/projects/office-reception/photo_2.jpg",
      "/img/projects/office-reception/photo_3.jpg",
      "/img/projects/office-reception/photo_4.jpg",
      "/img/projects/office-reception/photo_5.jpg"
    ],
    task: "Проектирование и изготовление представительской зоны ресепшена для коммерческой клиники в центре Санкт-Петербурга с учетом высокой проходимости и кабельного менеджмента.",
    solution: "Мы создали лаконичную радиусную стойку со скрытыми кабель-каналами, эргономичной внутренней столешницей для администратора и износостойким внешним фасадом с теплой подсветкой цоколя.",
    materials: ["Износостойкий HPL-пластик", "Матовая эмаль по RAL", "Внутренний кабельный менеджмент", "Защитные металлические накладки"]
  }
];
