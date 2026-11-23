import LeadSection from "@/components/LeadSection";
import PageHeader from "@/components/PageHeader";
import CatalogEditorial from "@/components/CatalogEditorial";
import DirectionHubGrid from "@/components/DirectionHubGrid";
import { WARDROBE_SERVICES } from "@/data/services";
import { SITE_URL } from "@/lib/seo";

const COLLECTION_PAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Шкафы и гардеробные на заказ в Санкт-Петербурге — ПитерМебель",
  url: `${SITE_URL}/wardrobes/`,
  inLanguage: "ru-RU",
  isPartOf: { "@id": `${SITE_URL}/#website` },
  about: { "@id": `${SITE_URL}/#organization` },
  mainEntity: {
    "@type": "ItemList",
    name: "Направления производства шкафов и гардеробных",
    numberOfItems: WARDROBE_SERVICES.length,
    itemListElement: WARDROBE_SERVICES.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.shortTitle,
      url: `${SITE_URL}${item.href}`,
    })),
  },
};

export default function WardrobesPage() {
  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(COLLECTION_PAGE_JSON_LD),
        }}
      />

      {/* 1. Page Header */}
      <PageHeader title="Шкафы и гардеробные на заказ" breadcrumbPath="/wardrobes/" />

      {/* 2. Subcategories Showcase Grid */}
      <section style={{ backgroundColor: "var(--bg-dark)", paddingTop: "32px", paddingBottom: "96px" }}>
        <div className="container">
          <DirectionHubGrid services={WARDROBE_SERVICES} />
        </div>
      </section>

      <CatalogEditorial
        title="Встроенные шкафы и гардеробные на заказ в Санкт-Петербурге"
        intro="Изготавливаем шкафы от пола до потолка в собственном цеху на Петергофском шоссе, 73 без доплаты за нестандарт."
        materials={[
          { material: "ЛДСП Egger", priceTier: "120–140\u00A0тыс.\u00A0₽", leadTime: "21–40 раб. дн." },
          { material: "МДФ в плёнке ПВХ", priceTier: "150–170\u00A0тыс.\u00A0₽", leadTime: "21–40 раб. дн." },
          { material: "МДФ пластик AGT / Velvet", priceTier: "170–180\u00A0тыс.\u00A0₽", leadTime: "21–40 раб. дн." },
          { material: "МДФ эмаль RAL / NCS", priceTier: "190–210\u00A0тыс.\u00A0₽", leadTime: "21–40 раб. дн." },
          { material: "Шпон дуба и стекло Stopsol", priceTier: "210–230\u00A0тыс.\u00A0₽", leadTime: "21–40 раб. дн." },
        ]}
        materialsNote={"Ориентир за шкаф 2 м (компактная ниша — от 80\u00A0000\u00A0₽)."}
        calculatorHref="/calculator/?category=wardrobe&layout=built-in&meters=2.0&material=egger"
        calculatorLabel="Рассчитать шкаф →"
        items={[
          {
            title: "Любая геометрия помещения",
            text: "Встраиваем шкафы в ниши, прихожие, спальни и под скосы стен строго по точному замеру.",
          },
          {
            title: "Обход натяжных потолков и щитков",
            text: "Ставим крышу с зазором 10 мм у натяжного потолка и делаем ревизионный отсек для электрощита в прихожей.",
          },
          {
            title: "Внутреннее наполнение",
            text: "Комплектуем штангами, пантографами, брючницами, выдвижными ящиками, корзинами для белья и встроенной подсветкой.",
          },
        ]}
        links={[
          { href: "/apartment/", label: "Мебель во всю квартиру за месяц" },
          { href: "/calculator/?category=wardrobe&layout=built-in&meters=2.0", label: "Рассчитать шкаф" },
          { href: "/custom-furniture/", label: "Корпусная мебель на заказ" },
          { href: "/design/", label: "Услуги дизайнера интерьера" },
        ]}
        faq={[
          {
            question: "Сколько стоит встроенный шкаф или гардеробная на заказ?",
            answer: "Минимальная стоимость заказа — от 80\u00A0000\u00A0₽. Типовой шкаф 2,0 м в Egger стоит 120–140\u00A0тыс.\u00A0₽, гардеробная 2,4 м — 170–190\u00A0тыс.\u00A0₽.",
          },
          {
            question: "Делаете ли вы встроенные шкафы до самого потолка?",
            answer: "Да, проектируем шкафы до потолка с безопасной стыковкой с натяжным или гипсокартонным перекрытием.",
          },
          {
            question: "Сколько времени занимает изготовление шкафа или гардеробной?",
            answer: "От 21 до 40 рабочих дней по договору — точный срок зависит от выбранных фасадов и комплектации.",
          },
          {
            question: "Где можно посмотреть образцы ЛДСП Egger, эмали и стекла Stopsol?",
            answer: "Все образцы фасадов и фурнитуры можно сравнить вживую в офисе у метро «Нарвская» по предварительной записи.",
          },
        ]}
      />

      {/* 3. Consultation CTA */}
      <LeadSection
        id="consult"
        initialCategory="Шкаф или гардеробная"
        source="Шкафы и гардеробные"
      />
    </div>
  );
}
