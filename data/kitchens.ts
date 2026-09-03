export interface Kitchen {
  slug: string;
  title: string;
  cover: string;
  gallery: string[];
  facade: string;
  facadeMaterialCategory: "fenix" | "enamel" | "veneer";
  worktop: string;
  feature: string;
  price: number;
  pricePerMeter: string;
  story: [string, string];
}

export const KITCHENS: Kitchen[] = [
  {
    slug: "aleksandra",
    title: "Александра",
    cover: "/img/kitchens/aleksandra/photo_1.jpg",
    gallery: [
      "/img/kitchens/aleksandra/photo_1.jpg",
      "/img/kitchens/aleksandra/photo_2.jpg",
      "/img/kitchens/aleksandra/photo_3.jpg",
      "/img/kitchens/aleksandra/photo_4.jpg"
    ],
    facade: "Суперматовый пластик Fenix NTM",
    facadeMaterialCategory: "fenix",
    worktop: "Ударопрочная матовая поверхность с интегрированной мойкой",
    feature: "Витрина в тонком черном профиле с теплой подсветкой",
    price: 285000,
    pricePerMeter: "от 68 000 ₽ / м.п.",
    story: [
      "Просторная кухня-гостиная с высокими потолками требовала монументального, но визуально легкого гарнитура. Основной задачей было объединить рабочую зону приготовления, вместительные системы хранения и выразительную обеденную группу в единый архитектурный ансамбль.",
      "Мы спроектировали гарнитур с глубокими суперматовыми фасадами Fenix NTM, устойчивыми к следам касаний. В композицию гармонично вписана высокая застекленная витрина с деликатной подсветкой полок и скрытая интеграция бытовой техники."
    ]
  },
  {
    slug: "valeria",
    title: "Валерия",
    cover: "/img/kitchens/valeria/photo_1.jpg",
    gallery: [
      "/img/kitchens/valeria/photo_1.jpg",
      "/img/kitchens/valeria/photo_2.jpg",
      "/img/kitchens/valeria/photo_3.jpg",
      "/img/kitchens/valeria/photo_4.jpg"
    ],
    facade: "Светлые матовые фасады в эмали по RAL",
    facadeMaterialCategory: "enamel",
    worktop: "Светлая текстурированная столешница",
    feature: "Мягкая палитра, интегрированные профили без накладных ручек",
    price: 240000,
    pricePerMeter: "от 62 000 ₽ / м.п.",
    story: [
      "Светлое пространство правильной формы с естественным освещением из панорамного окна. Стояла задача создать спокойную, воздушную атмосферу, сохранив максимальную функциональность каждого шкафа.",
      "Гарнитур выполнен в светлой матовой эмали теплого оттенка. Верхний ярус шкафов продолжается до самого потолка, скрывая воздуховод вытяжки и формируя чистые геометрические линии без визуального шума."
    ]
  },
  {
    slug: "stefania",
    title: "Стефания",
    cover: "/img/kitchens/stefania/photo_1.jpg",
    gallery: [
      "/img/kitchens/stefania/photo_1.jpg",
      "/img/kitchens/stefania/photo_2.jpg",
      "/img/kitchens/stefania/photo_3.jpg",
      "/img/kitchens/stefania/photo_4.jpg",
      "/img/kitchens/stefania/photo_5.jpg"
    ],
    facade: "Матовая эмаль глубокого сложного оттенка",
    facadeMaterialCategory: "enamel",
    worktop: "Износостойкая столешница с бортиком в цвет рабочей поверхности",
    feature: "Геометричный фартук и встроенный акцентный световой профиль",
    price: 265000,
    pricePerMeter: "от 64 000 ₽ / м.п.",
    story: [
      "Помещение кухни с угловой геометрией и сложной нишей требовало точной подгонки каждого модуля. Требовалось разместить варочную панель, духовой шкаф и систему фильтрации воды на компактной площади.",
      "Мы реализовали угловую планировку с бесшовным примыканием фартука к столешнице. Матовая эмаль фасадов эффектно подчеркивает выразительную текстуру фартука, а скрытая подсветка мягко заливает всю рабочую зону."
    ]
  },
  {
    slug: "slavena",
    title: "Славена",
    cover: "/img/kitchens/slavena/photo_1.jpg",
    gallery: [
      "/img/kitchens/slavena/photo_1.jpg",
      "/img/kitchens/slavena/photo_2.jpg",
      "/img/kitchens/slavena/photo_3.jpg",
      "/img/kitchens/slavena/photo_4.jpg",
      "/img/kitchens/slavena/photo_5.jpg"
    ],
    facade: "Эмаль шелковисто-матовая с контрастными декоративными деталями",
    facadeMaterialCategory: "enamel",
    worktop: "Контрастная темная фактурная столешница",
    feature: "Эффектный визуальный контраст светлых фасадов и темных рабочих поверхностей",
    price: 310000,
    pricePerMeter: "от 70 000 ₽ / м.п.",
    story: [
      "Открытая планировка студии предполагала, что кухня будет просматриваться из жилой зоны и служить главным акцентом интерьера. Важно было выдержать строгие пропорции и благородную цветовую гамму.",
      "В основу проекта лег контраст светлых матовых фасадов и темной выразительной столешницы. Нижний ярус оснащен глубокими выдвижными ящиками, а верхние модули открываются от легкого нажатия."
    ]
  },
  {
    slug: "ulyana",
    title: "Ульяна",
    cover: "/img/kitchens/ulyana/photo_1.jpg",
    gallery: [
      "/img/kitchens/ulyana/photo_1.jpg",
      "/img/kitchens/ulyana/photo_2.jpg",
      "/img/kitchens/ulyana/photo_3.jpg"
    ],
    facade: "Гладкие матовые фасады в сочетании с древесной текстурой",
    facadeMaterialCategory: "veneer",
    worktop: "Влагостойкая столешница под массив светлого дерева",
    feature: "Прямая планировка, единая колонна высоких пеналов под технику",
    price: 225000,
    pricePerMeter: "от 58 000 ₽ / м.п.",
    story: [
      "Вытянутое помещение с акцентной торцевой стеной требовало линейной компоновки мебели. Было необходимо избежать ощущения загроможденности и обеспечить удобный рабочий треугольник.",
      "Мы спроектировали прямую кухню с высокими закрытыми пеналами, куда встроены холодильник и духовой шкаф на комфортной высоте. Линейная подсветка рабочей зоны обеспечивает равномерное мягкое освещение."
    ]
  },
  {
    slug: "timofey",
    title: "Тимофей",
    cover: "/img/kitchens/timofey/photo_1.jpg",
    gallery: [
      "/img/kitchens/timofey/photo_1.jpg",
      "/img/kitchens/timofey/photo_2.jpg",
      "/img/kitchens/timofey/photo_3.jpg",
      "/img/kitchens/timofey/photo_4.jpg",
      "/img/kitchens/timofey/photo_5.jpg"
    ],
    facade: "Натуральный шпон дуба с сохранением природной текстуры",
    facadeMaterialCategory: "veneer",
    worktop: "Деревянная фактурная столешница повышенной прочности",
    feature: "Теплая фактура дуба, природный рисунок волокон и строгая геометрия",
    price: 340000,
    pricePerMeter: "от 74 000 ₽ / м.п.",
    story: [
      "Интерьер загородного дома с обилием естественного света и теплыми природными оттенками. Задачей проекта было подчеркнуть натуральные материалы и создать уютную атмосферу семейной кухни.",
      "Фасады из натурального шпона дуба подобраны с непрерывным переходом древесного рисунка от секции к секции. Просторная столешница обеспечивает обширную рабочую зону для кулинарного творчества."
    ]
  },
  {
    slug: "viktoria",
    title: "Виктория",
    cover: "/img/kitchens/viktoria/photo_1.jpg",
    gallery: [
      "/img/kitchens/viktoria/photo_1.jpg",
      "/img/kitchens/viktoria/photo_2.jpg",
      "/img/kitchens/viktoria/photo_3.jpg",
      "/img/kitchens/viktoria/photo_4.jpg"
    ],
    facade: "Белая эмаль с утонченной классической фрезеровкой",
    facadeMaterialCategory: "enamel",
    worktop: "Столешница с естественной текстурой натурального дерева",
    feature: "Изящная фрезеровка фасадов и теплое сочетание белого цвета со структурой дерева",
    price: 275000,
    pricePerMeter: "от 65 000 ₽ / м.п.",
    story: [
      "Кухня в современном неоклассическом стиле с высокими потолками и лепным декором. Требовалось гармонично вписать кухонный гарнитур в классический контекст помещения без перегрузки деталями.",
      "Мы изготовили фасады с аккуратной тонкой фрезеровкой и покрыли их матовой белой эмалью. Древесная поверхность столешницы и открытых полок придает интерьеру теплоту и завершенность."
    ]
  }
];
