export interface SiteConfig {
  name: string;
  city: string;
  slogan: string;
  foundingYear: number;
  foundedYear: number;
  clientCount: string;
  address: string;
  officeAddress: string;
  productionAddress: string;
  officeNote: string;
  metro: string;
  legalEntity: string;
  contactPerson: string;
  phone: string;
  phoneRaw: string;
  email: string;
  workHours: string;
  vkUrl: string;
  vkImUrl: string;
  yandexMapsUrl: string;
  disclaimer: string;
  services: string[];
  productCategories: string[];
}

export const SITE_CONFIG: SiteConfig = {
  name: "ПитерМебель",
  city: "Санкт-Петербург",
  slogan: "Вы мечтаете — Мы воплощаем",
  foundingYear: 2005,
  foundedYear: 2005,
  clientCount: "Более 1500 реализованных проектов",
  address: "пл. Стачек, 9, офис 407",
  officeAddress: "пл. Стачек, 9, офис 407",
  productionAddress: "Санкт-Петербург, Петергофское шоссе, 73",
  officeNote: "Прием в офисе строго по предварительной записи",
  metro: "м. «Нарвская»",
  legalEntity: "Студия мебели «ПитерМебель»",
  contactPerson: "Елена Волкова",
  phone: "+7 (921) 784-05-89",
  phoneRaw: "+79217840589",
  email: "piter.meb@yandex.ru",
  workHours: "Пн – Пт: с 10:00 до 18:00 (по предварительной записи)",
  vkUrl: "https://vk.ru/pitermebelcom",
  vkImUrl: "https://vk.ru/im?sel=-215942650",
  yandexMapsUrl: "https://yandex.ru/maps/org/pitermebel/245406542043/?indoorLevel=1&ll=30.272883%2C59.899907",
  disclaimer: "Демонстрационный концепт сайта. Материалы взяты из открытого сообщества студии ВКонтакте. Не является публичной офертой.",
  services: [
    "Консультация и предварительный расчет проекта",
    "Индивидуальный дизайн-проект с 3D-визуализацией",
    "Схема электрики и коммуникаций в подарок при заказе кухни",
    "Точный инженерный замер помещения перед производством",
    "Изготовление на собственном производстве в Санкт-Петербурге",
    "Бережная доставка и чистая установка под ключ"
  ],
  productCategories: [
    "Кухни на заказ",
    "Шкафы и гардеробные",
    "Корпусная мебель на заказ",
    "Прихожие и ТВ-зоны",
    "Стеновые реечные панели",
    "Мебель для коммерческих пространств"
  ]
};

export const NAVIGATION_LINKS = [
  { href: "/kitchens", label: "Кухни" },
  { href: "/wardrobes", label: "Шкафы" },
  { href: "/custom-furniture", label: "Корпусная мебель" },
  { href: "/production", label: "Производство" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/contacts", label: "Контакты" },
];
