import LeadSection from "@/components/LeadSection";
import PageHeader from "@/components/PageHeader";
import CatalogEditorial from "@/components/CatalogEditorial";
import DirectionHubGrid from "@/components/DirectionHubGrid";
import { CUSTOM_FURNITURE_SERVICES } from "@/data/services";
import { SITE_URL } from "@/lib/seo";

const ITEM_LIST_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  numberOfItems: CUSTOM_FURNITURE_SERVICES.length,
  itemListElement: CUSTOM_FURNITURE_SERVICES.map((item, idx) => ({
    "@type": "ListItem",
    position: idx + 1,
    name: item.shortTitle,
    url: `${SITE_URL}${item.href}`,
  })),
};

export default function CustomFurniturePage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(ITEM_LIST_JSON_LD),
        }}
      />

      {/* 1. Page Header */}
      <PageHeader title="Корпусная мебель на заказ" />

      {/* 2. Subcategories Showcase Grid */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "32px", paddingBottom: "96px" }}>
        <div className="container">
          <DirectionHubGrid services={CUSTOM_FURNITURE_SERVICES} />
        </div>
      </section>

      <CatalogEditorial
        title="Корпусная мебель на заказ в Санкт-Петербурге"
        intro="Изготавливаем мебель для ванной, гостиной, детской, кабинета, постирочной и бизнеса — от одного изделия."
        materials={[
          { material: "ЛДСП Egger (класс E1)", priceTier: "от 80\u00A0000\u00A0₽", leadTime: "2–3 нед." },
          { material: "МДФ пластик AGT / ПВХ", priceTier: "от 90\u00A0000\u00A0₽", leadTime: "3–4 нед." },
          { material: "МДФ эмаль RAL / NCS", priceTier: "100–240\u00A0тыс.\u00A0₽", leadTime: "4–5 нед." },
          { material: "Шпон дуба и массив", priceTier: "110–270\u00A0тыс.\u00A0₽", leadTime: "4–6 нед." },
          { material: "Раздвижные перегородки", priceTier: "от 80\u00A0000\u00A0₽", leadTime: "от 10 раб. дн." },
        ]}
        materialsNote="Ориентир за изделие 1,2–2,4 м. Точная смета — после замера."
        calculatorHref="/calculator/?category=cabinet&layout=zone&meters=1.8&material=egger"
        calculatorLabel="Рассчитать корпусную мебель →"
        items={[
          {
            title: "Единый стиль для квартиры",
            text: "Кроим мебель для кухни, прихожей, гостиной и ванной из одной партии плит или выкраса.",
          },
          {
            title: "Материалы под любую нагрузку",
            text: "Для санузлов ставим влагостойкий МДФ, HPL и камень; для библиотек — плиты 18–25 мм.",
          },
          {
            title: "Свой цех и штатный монтаж",
            text: "Раскрой, кромление с прифуговкой и присадку выполняем на Петергофском шоссе, 73.",
          },
        ]}
        links={[
          { href: "/apartment/", label: "Мебель во всю квартиру за месяц" },
          { href: "/calculator/?category=cabinet&layout=zone&meters=1.8", label: "Рассчитать корпусную мебель" },
          { href: "/wardrobes/", label: "Шкафы и гардеробные" },
          { href: "/design/", label: "Услуги дизайнера интерьера" },
        ]}
        faq={[
          {
            question: "Сколько стоит корпусная мебель на заказ в СПб?",
            answer: "Отдельное изделие 1,2 м начинается от 80\u00A0000\u00A0₽ в Egger и от 90\u00A0000\u00A0₽ в пластике. Комплексная зона 2,4 м обходится в 160–240\u00A0тыс.\u00A0₽.",
          },
          {
            question: "Можно ли заказать всю мебель в квартиру одним договором?",
            answer: "Да — от 2 изделий действует скидка за объём, а вся меблировка квартиры изготавливается примерно за месяц.",
          },
          {
            question: "Работаете ли вы с коммерческими помещениями и юрлицами?",
            answer: "Да, делаем стойки ресепшен и мебель для клиник и офисов по договору с ООО и ИП по безналу.",
          },
          {
            question: "Можно ли изготовить мебель по чертежам дизайнера или фото?",
            answer: "Да — пришлите проект или фото с габаритами, мы проверим узлы, подберём материалы и посчитаем смету.",
          },
        ]}
      />

      {/* 3. Consultation CTA */}
      <LeadSection
        id="consult"
        initialCategory="Корпусная мебель"
        source="Корпусная мебель"
      />
    </div>
  );
}
