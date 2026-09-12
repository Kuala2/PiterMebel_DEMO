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
    description: "Подготовим схему геометрической привязки розеток и коммуникаций к мебели и выбранной технике. Электрическую часть проверяет квалифицированный электрик.",
    valueTag: "Схема электрики в подарок",
    ctaText: "Получить схему в подарок →",
    ctaHref: "#measure-form",
    active: true,
  },
  wardrobes: {
    id: "wardrobes-promo",
    badge: "Скидка за объём",
    title: "Скидка на комплект от 2 изделий",
    description: "При заказе кухни со шкафом или мебели для двух помещений действует гибкая система скидок производства на весь проект.",
    valueTag: "Скидка на комплект от 2 изделий",
    ctaText: "Рассчитать со скидкой →",
    ctaHref: "#measure-form",
    active: true,
  },
  customFurniture: {
    id: "custom-furniture-promo",
    badge: "Варианты оплаты",
    title: "Банковская рассрочка и безналичный расчёт",
    description: "Возможна рассрочка от банка-партнёра; срок, ставка и одобрение зависят от условий банка. Также доступна оплата по реквизитам, ссылке или через терминал.",
    valueTag: "Банковская рассрочка",
    ctaText: "Узнать условия рассрочки →",
    ctaHref: "#measure-form",
    active: true,
  },
};
