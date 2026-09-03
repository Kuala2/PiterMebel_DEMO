export interface SiteConfig {
  name: string;
  city: string;
  slogan: string;
  foundingYear: number;
  foundedYear: number;
  clientCount: string;
  address: string;
  metro: string;
  legalEntity: string;
  contactPerson: string;
  phone: string;
  phoneRaw: string;
  email: string;
  workHours: string;
  vkUrl: string;
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
  clientCount: "Более 1500 довольных клиентов",
  address: "пл. Стачек, 9, 4 этаж",
  metro: "м. «Нарвская»",
  legalEntity: "Студия мебели «ПитерМебель»",
  contactPerson: "Елена Волкова",
  phone: "+7 (921) 784-05-89",
  phoneRaw: "+79217840589",
  email: "piter.meb@yandex.ru",
  workHours: "Пн – Пт: с 10:00 до 20:00",
  vkUrl: "https://vk.ru/pitermebelcom",
  disclaimer: "Демонстрационный концепт сайта. Материалы взяты из открытого сообщества студии ВКонтакте. Не является публичной офертой.",
  services: [
    "Точный замер помещения",
    "Индивидуальный дизайн-проект с 3D-визуализацией",
    "Изготовление на собственном производстве",
    "Бережная доставка и установка под ключ"
  ],
  productCategories: [
    "Кухни",
    "Гардеробные",
    "Прихожие",
    "Шкафы и стеллажи",
    "Стеновые реечные панели",
    "Корпусная мебель для коммерческих помещений"
  ]
};

export const NAVIGATION_LINKS = [
  { href: "/kitchens", label: "Кухни" },
  { href: "/projects", label: "Объекты" },
  { href: "/production", label: "Производство" },
  { href: "/calculator", label: "Калькулятор" },
  { href: "/contacts", label: "Контакты" },
];
