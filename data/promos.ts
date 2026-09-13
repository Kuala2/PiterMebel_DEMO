export interface PromoOffer {
  id: string;
  badge: string;
  title: string;
  description: string;
  valueTag?: string;
  ctaText: string;
  ctaHref: string;
  active: boolean;
}

export const PROMOS: Record<string, PromoOffer> = {
  kitchens: {
    id: "kitchens-promo",
    badge: "В подарок к заказу",
    title: "Схема электрики в подарок при заказе кухни",
    description: "Подготовим схему привязки розеток и коммуникаций к мебели и выбранной технике.",
    valueTag: "Схема электрики в подарок",
    ctaText: "Получить схему в подарок →",
    ctaHref: "#measure-form",
    active: true,
  },
  wardrobes: {
    id: "wardrobes-promo",
    badge: "Скидка за объём",
    title: "Скидка на комплект от 2 изделий",
    description: "При заказе кухни со шкафом или мебели для нескольких помещений действует скидка на весь проект.",
    valueTag: "Скидка на комплект от 2 изделий",
    ctaText: "Рассчитать со скидкой →",
    ctaHref: "#measure-form",
    active: true,
  },
  customFurniture: {
    id: "custom-furniture-promo",
    badge: "Варианты оплаты",
    title: "Банковская рассрочка и разные способы оплаты",
    description: "Оплата на расчётный счёт, по ссылке или через терминал. Условия рассрочки зависят от банка.",
    valueTag: "Банковская рассрочка",
    ctaText: "Узнать условия рассрочки →",
    ctaHref: "#measure-form",
    active: true,
  },
};
