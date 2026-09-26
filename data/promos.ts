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
    badge: "",
    title: "Схема электрики в подарок при заказе кухни",
    description: "Подготовим план привязки розеток и выводов воды под мебель и выбранную технику до начала ремонта.",
    valueTag: "Схема электрики в подарок",
    ctaText: "Получить схему в подарок →",
    ctaHref: "#measure-form",
    active: true,
  },
  wardrobes: {
    id: "wardrobes-promo",
    badge: "",
    title: "Скидка на комплект от 2 изделий",
    description: "При заказе кухни со шкафом или мебели сразу в несколько комнат действует скидка за объём на весь проект.",
    valueTag: "Скидка на комплект от 2 изделий",
    ctaText: "Рассчитать со скидкой →",
    ctaHref: "#measure-form",
    active: true,
  },
  customFurniture: {
    id: "custom-furniture-promo",
    badge: "",
    title: "Оплата по счёту, карте или в рассрочку",
    description: "Официальный договор: оплата на расчётный счёт, по ссылке СБП, через терминал в офисе или в рассрочку от банка.",
    valueTag: "Банковская рассрочка",
    ctaText: "Узнать условия рассрочки →",
    ctaHref: "#measure-form",
    active: true,
  },
};
