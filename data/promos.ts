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
    description: "Инженер разрабатывает детальную схему выводов розеток, силовой проводки и вентиляции под технику. Исключает ошибки строителей при ремонте.",
    valueTag: "Схема электрики в подарок",
    ctaText: "Обсудить проект кухни →",
    ctaHref: "/contacts#measure",
    active: true,
  },
  wardrobes: {
    id: "wardrobes-promo",
    badge: "Скидка за объём",
    title: "Скидка на комплект от 2 изделий",
    description: "При заказе кухни со шкафом или мебели для двух помещений действует гибкая система скидок производства на весь проект.",
    valueTag: "Скидка на комплект от 2 изделий",
    ctaText: "Рассчитать со скидкой →",
    ctaHref: "/contacts#measure",
    active: true,
  },
  customFurniture: {
    id: "custom-furniture-promo",
    badge: "Условия фабрики",
    title: "Беспроцентная рассрочка и безналичный расчет",
    description: "Рассрочка от банков-партнеров без первого взноса и переплат. Официальный договор фабрики, удобная оплата по безналичному расчету.",
    valueTag: "Беспроцентная рассрочка",
    ctaText: "Узнать условия фабрики →",
    ctaHref: "/contacts#measure",
    active: true,
  },
};
